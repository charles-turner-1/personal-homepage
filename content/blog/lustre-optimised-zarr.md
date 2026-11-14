---
title: "Lustre Optimised Zarr - And Cloud Optimised Excel"
description: "What cloud optimised excel spreadsheets and building (some of) a google sheets clone have to teach us about data access patterns"
date: "2026-11-12"
author: "Charles Turner"
href: "/blog/lustre-optimised-zarr"
---
# Lustre Optimised Zarr - And Cloud Optimised Excel

## What cloud optimised excel spreadsheets and building (some of) a google sheets clone have to teach us about data access patterns

### TLDR;

This is for anyone who can't be bothered to read my rambling prose.

1. Zarr is often touted as being incompatible with Lustre (and by extension HPC) because it creates too many inodes. __This isn't true__.
2. Zarr stores with large shards _can_ serialise climate, weather (and anything else xarray-ish) with fewer inodes than an equivalent netCDF representation (if you deliberately design it this way).
3. Zarr is cloud optimised, meaning its design avoids constant mucking around chasing file pointers. For a filesytem like Lustre which is really a datacentre in a trenchcoat, this is actually a better design than a traditional netCDF setup - provided you can manage your inodes.
4. I built this functionality into [`intake-virtual-icechunk`](https://github.com/ACCESS-NRI/intake-virtual-icechunk), which takes an intake-esm datastore and wraps it up in a single icechunk store. Calling `.rechunk(shards="auto")` on the builder sizes each shard to roughly match one of your source files, so you end up with a similar order of magnitude of inodes to what you started with (measure your store to check). If you want a cloud & HPC optimised data format, this might be worth looking at.
5. There are no free lunches (yet?). Lustre optimising a Zarr store will make repeated writing to it horribly inefficient (in the naive case). With that said, most data of this kind is write-once read-forever.

### Cloud optimised excel spreadsheets - because why not?

This whole idea started a few months ago, when my buddy Adam told me that he'd managed to save a decent chunk of time in some air quality modelling pipeline by serialising intermediate steps and checkpoints as HDF files, rather than excel. I'm pretty sure this was just using the `pandas.DataFrame.to_hdf` method rather than `pandas.DataFrame.to_excel`, although I can't totally remember. This makes sense - a `.xlsx` file is basically just a zip full of `xml` files wearing a trenchcoat, and is not really optimised for anything resembling read or write speeds. If it's optimised for anything at all please let me know. 

An HDF file (Hierarchical Data Format), on the other hand, is a pretty handy kind of file. I don't know all that much about it beyond a couple of things that are relevant here:
- It's a chunked, and self describing, data format.
- netCDF4 is implemented (to my knowledge) as a layer on top of HDF5.
- It's not cloud optimised.
- Climate datasets are typically serialised as either netCDF4 or Zarr.

Hopefully you can see where this is going. We can save a pandas dataframe as an HDF file, which is kind of interesting, but mostly a curiosity. But if we could save it as a Zarr file, given Zarr can be loosely thought of as a cloud optimised version of HDF5, then we have created a cloud optimised excel spreadsheet. Or, as I put it on Github:

> # excelizarr
> 
> ## Cloud native excel spreadsheets - the BI use case for Zarr nobody asked for or wanted
> 
> **A cloud-native representation of an `.xlsx` workbook. In Zarr. Yes, really.**
> 
> ::warning
> This is a bit of fun. It works and it's property-tested, but please don't put it
> anywhere important. Claude wrote most of the code at my direction.
> ::
> 
> A friend made me realise you could save an `.xlsx` spreadsheet as an HDF5 file. That
> raised an obvious question: why not Zarr? Then a workbook is chunked, compressed and
> cloud-readable, and with [Icechunk](https://icechunk.io) it's version-controlled too.

Then I did some [benchmarking](https://github.com/charles-turner-1/excelizarr/blob/main/docs/guide/cloud.md)...

This is where things get interesting. Originally, I just set a 'sensible' chunk target - something like 32 MB. This far exceeds any typical excel workbook, and the results were exactly as you might expect - no cloud optimisation whatsoever. To read any data, you need to fetch a whole chunk, and if that's bigger than the workbook, then you download the entire file each time.

The obvious next step? Make the chunks tiny. This has the advantage of meaning we can pull down a tiny tiny chunk, which in theory should be a lot faster. I quickly discovered that the default behaviour of zarr-python is to limit the number of concurrent fetches to 10 with a semaphore, so it turned out to be a lot slower.

Finally, I sharded the thing. Sharding lets you pack a lot of chunks into a single file, and the zarr spec is such that you can use range requests to read the shard's index and then pull just the chunk you need out of the shard. This turned out to be, on balance, the fastest way of doing things. 


> On a 50,000 × 20 local sheet ([details](https://github.com/charles-turner-1/excelizarr/blob/main/docs/guide/benchmarks.md)):
> 
> | read | seconds |
> |---|---:|
> | `pd.read_excel` (openpyxl) | 2.97 |
> | `pd.read_excel` (calamine) | 0.63 |
> | `pd.read_hdf` | **0.017** |
> | `xz.read_excel` | 0.22 |
> | 100-cell range read | **0.004** |
> 
> So HDF is still the right call for "the whole sheet as a DataFrame, fast". excelizarr
> is 14× faster than parsing the `.xlsx`, smaller on disk than either, and much better
> at the cloud-shaped jobs: range reads, partial access and version control.
> 
> From S3 (`ap-southeast-2`, from Australia), on a 500,000 × 20 sheet
> ([details](https://github.com/charles-turner-1/excelizarr/blob/main/docs/guide/cloud.md#whole-sheets)):
> 
> | read | seconds |
> |---|---:|
> | `pd.read_excel` (openpyxl) | 34.76 |
> | `pd.read_excel` (calamine) | 8.26 |
> | download + `pd.read_hdf` | **1.99** |
> | `xz.read_excel` | 2.96 |
> | open + 100-cell range read | **0.48** |
> 
> The range read costs the same at 10,000 rows as at 500,000: it only ever fetches the
> chunks it needs.

That's fun, for a vibe coded project, which started as a joke. We're somewhere on the order of 100x faster (very loosely) than pandas if we just want to read a slice of a spreadsheet. Since we can represent zarr stores with icechunk, we also have native version controlled, ACID excel spreadsheets. Like I said in the repo description, finally the business use case for zarr nobody wanted or asked for.

Then I posted this in the Python WA discord, because a joke needs an audience. Surprisingly (worryingly?), someone pointed out it would be quite useful to demo things to their clients. That got me thinking - this might actually be a decent way to build an object store backed google sheets clone. I haven't (gotten claude to) build a frontend for this yet, but I did do a little bit of profiling - which is where things become less stupid, and more useful.

### Large shards kill write performance

When you shard a zarr store, what you're doing is packing a bunch of chunks into a single file, instead of giving them their own file each. The catch is that you now can't rewrite a single chunk at once - you have to rewrite every chunk in the shard if you want to update one. I haven't dug too deep into this, but it looks like zarr doesn't guarantee that the write won't shift the bytes representing chunks about in the file at the codec level. Think of it like pushing into a queue - everyone has to shuffle backwards a step or two to accommodate.

Now, I sharded these files because an excel spreadsheet is not a serious choice of data model to stuff into a zarr store. Sharding was an accommodation I made to make my benchmarks favour my dumb idea, because if a read needs more than ten requests, zarr-python starts queuing them, and you might as well just dump an HDF file or the raw xlsx in the bucket. But this is where things get interesting for more sensible workflows.

::note
It turns out this isn't necessarily true. My understanding is that this is being worked on in zarrs (and by extension might be exposed to python via zarrista). Basically, to make this happen, you need to write the single updated chunk to the end of the shard, update a pointer, and then orphan the previous chunk contents. 

Claude tells me that Icechunk can do something like this, one level up: its manifest stores a pointer (file, offset, length) to every chunk, and a single file can hold many chunks. An update writes the new chunk somewhere else, repoints the manifest, and orphans the old bytes (kept around for version history until they're garbage collected). The catch is that a regular Zarr shard inside Icechunk is still treated as one big chunk, so if you shard the Zarr way, you're back to rewriting the whole thing. 

If someone understands this all better and wants to correct me, please do!
::

### Lustre works a lot like object storage, unless files are in the OS cache

A lustre filesystem is a network filesystem that uses metadata servers to handle inodes. That's a lot of jargon, and to be frank I don't have a good mental model of how it maps into hardware. What it means though, is that if you're on a lustre system and you touch a file that hasn't been hit recently, you first make a network round trip to the metadata server to look the file up and find out where its data lives, then another to the storage servers to actually fetch it. That's closely analogous to an HTTP GET against an object store. Once it's cached, later reads are a lot cheaper - though it's never quite a local disk, since the client has to coordinate with the servers whenever someone else might be touching the same file.


::note
I have a slightly better mental model for Ceph. Ceph uses a RADOS backend, and then can expose either RADOSGW (RADOS GateWay), with s3 semantics, or CephFS, with posix filesystem semantics. What's underneath is the same thing - how you access it changes. So crucially, these network filesystems aren't as different from object storage as is commonly bandied about as an explanation for why Zarr on HPC is bad.
::
 
::note
It's probably also worth thinking about the fact that the general advice for both Object Storage and Lustre is to avoid having hundreds of thousands of tiny objects. In an object store, it's because you pay the latency hit for every interaction. It's not quite so bad in Lustre - caching takes the edge off repeat access - but every new file still costs a trip to the metadata server, so it's the same story. This really just boils down, again, to lustre being a datacentre in a trenchcoat.
::

Let's ignore the specific details for now, and let's just pretend we want to open a climate dataset. Say it has been serialised as eight hundred netCDF files, one per quarter for 200 years (not unrealistic). So something like

```python
import xarray as xr

files = [f"output_{n:03d}.nc" for n in range(800)]
ds = xr.open_mfdataset(files)
```

Now, what's going to happen? Realistically, we're going to get something that looks something like 800 fetches to grab the metadata for all of those files. Sure, lustre is going to be within an HPC, so we're getting datacentre speeds, but that's still overhead. Remember as well that since we're "on a filesystem", it's safe to assume that we can do everything synchronously. That's a lot of slowdown - 800 serial fetches can be a lot of waiting around. (Yes, you can pass `parallel=True` to `open_mfdataset`, but that just spreads the blocking calls across dask workers - each worker still waits on each file in turn.)

I appreciate here that there is also a lot of overhead going on with constructing this dataset - joining indices, checking dimensions, coordinates, etc. That will probably dominate. But that's not an argument against what I'm saying here - if anything, it makes the case stronger.

If we reserialise that big pile of netCDF files as sharded zarr v3 with consolidated metadata, we can get that down to a handful of fetches: open `zarr.json`, grab the coordinate chunks xarray needs to build its indexes, construct the dataset. Done.

So now let's consider a straightforward access pattern:

```python
import xarray as xr

# netCDF
files = [f"output_{n:03d}.nc" for n in range(800)]
ds = xr.open_mfdataset(files).sel(time="2026-11-13", method="nearest").compute()

# zarr
zarr_store = "my_dataset.zarr"
ds = xr.open_zarr(zarr_store).sel(time="2026-11-13", method="nearest").compute()
```

In both cases, we want to fetch the chunk data from a single file on disk. In the first, we have to touch 800 files - that's hammering the metadata servers with 800 requests to use one of them. In the zarr store, we touch a few - the consolidated metadata, the coordinates, and the shard we need. Better for the user, better for the filesystem.

Again - this ignores all the extra overhead from xarray constructing its representation of the serialised data in memory. But that's not an argument against this - it's necessary as a result of splitting the metadata up and putting part of it in each netCDF file. So it's another argument for putting everything in Zarr - even if you only care about your metadata servers and not at all about your users' computing experience.

### Here are some benchmarks I made earlier

__These are not benchmarks I made for this post.__ I had them lying around, [here](https://github.com/charles-turner-1/PawseyVirtualisationTests/blob/main/gadi/virtualisation-tests-nirin.ipynb).

On NCI's Gadi HPC system, there is [this dataset](https://access-nri.github.io/interactive-data-catalogue/#/datastore/cj877?file_id_filter=atmos.1day.bnds:2.depth:6.lat:144.lon:192), daily atmospheric data split across a lot of netCDF files. For the benchmark I took the first 500 of them.

If we want to just _open_ those 500 files, with a 48 worker dask cluster, it takes 2 minutes and 37 seconds.

That's over two and a half minutes of your user wondering whether their Jupyter Notebook is actually running, and 500 file opens for your metadata server to deal with - just to see what's in the dataset, before reading any actual data.

Now compare that to a virtual Icechunk store indexing exactly the same 500 files, sitting in a separate bucket in NCI's object storage. Opening it from the same session, over a throttled connection of about 10 Mbps (1.25 MB/s), takes 1.47 seconds, with no dask cluster. That's over 100x faster, and the metadata server doesn't get touched at all until you actually load some data. Put the store on disk next to the data and I'd expect it to be quicker still.

And you don't have to blow up your inode count to get this. Even if you reserialise to sharded zarr rather than virtualising, sensible shard sizes leave you with a similar number of inodes to what you started with, not hundreds of thousands.




