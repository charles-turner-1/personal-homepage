<template>
  <article
    class="max-w-5xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200"
  >
    <h1 class="text-3xl font-bold mb-6 leading-tight">
      Virtualising &amp; Distributing Data through Acacia (Pawsey) &amp; Nirin
      (NCI)
    </h1>

    <p class="m-4 font-semibold">
      Disclaimer 1: I used a LLM to translate this from markdown to a vue
      component. Formatting might be weird because I probably won't re-read it
      carefully enough to check.
    </p>
    <p class="m-4 text-medium text-gray-400">
      Disclaimer 2: Please don't take my jokes about not doing cloud in
      Australia to heart (unless you can make it happen)
    </p>
    <p class="m-4 font-semibold">
      Disclaimer 3: Any claims here about the 'correct' or 'proper' way to do things 
      are just my personal opinions.
    </p>

    <p class="mb-4">
      At AMOS 2026 (Hobart, February), we did a bunch of alpha user testing on a
      new tool we've been working on,
      <a
        href="https://access-nri.github.io/interactive-data-catalogue/#/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline"
        >the ACCESS-NRI Interactive Data Catalogue</a
      >. This is a tool that lets people click through the catalogue of data
      that we maintain on Gadi.
    </p>

    <p class="mb-4">
      The key insight that powers this is that the metadata that we trawl,
      index, and make available in order to discover what climate data products
      are available on Gadi is on the order of megabytes, not petabytes, which
      means that we can ship it straight to the browser. As a result, we can
      stream data indices for around 20PB of data and let users click through
      them, in pretty much real time.
    </p>

    <p class="mb-4">This all sounds great, but it has a few limitations:</p>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-3">
      <li>
        We use intake-esm to index our datasets. These datasets are on disk on
        Gadi, NCI's HPC System. Indexing produces parquet files containing
        metadata about the datasets in question, but those datasets are still
        unreachable. As a result, we are unable to display any richer
        information.
        <p class="mt-2">
          The pangeo catalog gets around this limitation by using a properly
          cloud native approach. The datasets, not just the indices are made
          available through object storage, and this means that they can dump a
          <em>full xarray repr</em> straight into the page (eg.
          <a
            href="https://catalog.pangeo.io/browse/master/atmosphere/era5_hourly_reanalysis_single_levels_sa/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >https://catalog.pangeo.io/browse/master/atmosphere/era5_hourly_reanalysis_single_levels_sa/</a
          >). With our current approach, this is fundamentally impossible.
        </p>
        <p class="mt-2">
          This is, unfortunately, a major limitation of our Hybrid HPC/Cloud
          system, because people are used to looking at the results of
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >xr.open_mfdataset</code
          >, and less used to looking at a bunch of data indices wrapped around
          it.
        </p>
        <p class="mt-2">
          Unfortunately, if you can't get your hands on the
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >repr</code
          >, which is just an interactive view of the dataset metadata, our
          hopes of getting anything more interesting are also zero.
        </p>
      </li>
      <li>
        We have to keep two catalogues manually synced: one on disk (Gadi), and
        one in object storage (currently,
        <a
          href="https://ardc.edu.au/services/ardc-nectar-research-cloud/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
          >ARDC's Nectar</a
        >). NCI compute nodes don't have any internet access, and ARE sessions
        seem to be throttled pretty heavily for reasons I still don't fully
        understand.
        <p class="mt-2">
          Whilst you can create an intake-esm datastore with local paths and
          dump it into object storage (the paths will then only work if you
          download that datastore to the machine it was built on, but you can
          explore them anywhere), the download performance on ARE makes this a
          generally fairly poor experience for the user — better to keep it on
          disk locally.
        </p>
        <p class="mt-2">
          If they want to access a catalog in object storage from a compute
          node, they're totally out of luck. (Well, maybe not totally... NCI
          have their own cloud, Nirin, which compute nodes might be able to talk
          to? More on that later!)
        </p>
      </li>
      <li>
        Users still need to get themselves on NCI in order to access the data.
        This might be straightforward, if they're in a university research group
        with other NCI users, or they know someone with a compute allocation who
        is happy to add them to their project.
        <p class="mt-2 font-semibold">
          In theory, anyone with an Australian academic or government email
          address should be able to get themselves onto NCI to look at this data
          (as far as I'm aware). In practice, this is going to limit data access
          to people who already know how to access it. If we want this data to
          be used to its full potential, we need to do better.
        </p>
      </li>
    </ul>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <p class="mb-4">
      When we were gathering feedback on the interactive catalogue tool, a few
      people mentioned that it would be really handy to actually look at the
      data itself when exploring the data. This is a much bigger task — it's a
      lot easier to ship a few megabytes than several petabytes. Actually
      shipping the data, rather than just a metadata index, means figuring out a
      way to let users actually download the slice of the data they're
      interested in looking at. This means you have a couple of hard
      requirements:
    </p>

    <ol class="list-decimal list-outside ml-6 mb-4 space-y-3">
      <li>
        You cannot build a system that forces a user to download an entire
        netCDF file in order to look at a subset of it. If that netCDF file is
        25GB, there's just no way of doing it in real time, even in the totally
        unrealistic case that you somehow managed to saturate the 10Gb/s
        bandwidth that is in theory available through your computer's ethernet
        port.
      </li>
      <li>
        You need to be able to anonymously &amp; instantaneously access data. I
        have no real evidence of this, but think of all the times that you've
        (and I'm talking from experience here):
        <ul class="list-disc list-outside ml-6 mt-2 space-y-1">
          <li>
            Tried to access some data, only to be told to register for an
            account. Can you really be bothered to?
          </li>
          <li>
            Shut a page because it was loading slowly (I think Agoda found
            anything over 300ms loses something like half the visitors before it
            finishes opening).
          </li>
          <li>
            Decided a Youtube video wasn't worth waiting for the ads to finish.
          </li>
        </ul>
        <p class="mt-2">
          People just don't care that much, and especially if they don't know
          whether they're going to find the resources they're looking for.
          Things need to be fast, and slick.
        </p>
      </li>
      <li>
        The data needs to be on an HPC system, somehow. This is Australia, and
        we don't do cloud. Maybe in 10 years...
      </li>
    </ol>

    <p class="mb-4">
      Squaring all these requirements would get a bit tough, if not for some of
      the amazing infrastructure work done by Tom Nicholas (virtualizarr) and
      Martin Durant (kerchunk) in particular, as well as the rest of the guys at
      Earthmover and carbonplan. Without all their hard work, this never would
      have gotten off the ground.
    </p>

    <p class="mb-4">
      The second slice of luck is that I'd recently got an allocation for the
      Pawsey supercomputing centre, 20 minutes down the road from my house in
      Perth, WA. When building their HPC system, Pawsey just so happened to
      implement an S3 compatible Ceph object store, <em>Acacia</em>, instead of
      a more traditional
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >gdata</code
      >
      area. Very lucky!
    </p>

    <p class="mb-4">
      When I first had a crack at this, I wasn't super sure about how easy it
      was going to be to get what I was after out of Acacia. I've mostly heard
      people describe it as weird, and/or hard to use. Apparently, it can be a
      little contrived to spin up a Jupyter server on Setonix (the HPC proper)
      and have it read files in Acacia. Fortunately, that's not my use case — I
      was specifically interested about whether we could use this to ship data
      to
      <em>users who weren't on Setonix</em>.
    </p>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <h2 class="text-2xl font-bold mt-8 mb-4">Virtualisation</h2>

    <h3 class="text-xl font-semibold mt-6 mb-3">Zarr</h3>

    <p class="mb-4">
      If you want to send these large array datasets over the wire (e.g., stream
      it to a browser viewer widget), the only way to do it is Zarr (okay, there
      probably are other ways. I'm ignoring them anyway). There have been
      various other solutions in the past — things like Thredds — but
      fundamentally, the user experience of those things is less than pleasant.
    </p>

    <p class="mb-4">
      Zarr is basically a rethink of netCDF/HDF, designed to be optimised for
      cloud storage and access. The problem is it really does not play nicely
      with HPC systems, especially those with a lustre filesystem (like NCI's
      Gadi machine). If you take a typical ocean model run, with maybe 200 years
      of data spread across maybe 800 netCDF files, and reserialise it as zarr,
      you typically wind up creating hundreds of thousands, maybe millions of
      inodes. Ignoring recent developments, this is basically because each chunk
      in the zarr store (the equivalent of all our netCDF files) gets its own
      inode.
    </p>

    <p class="mb-4">
      On a lustre filesystem, this is a big no-no, and as a result, Zarr hasn't
      really taken off in Australia (remember, we don't do cloud). At that same
      AMOS, someone referred to zarr as an 'emerging format' — despite its
      already (extremely) widespread adoption, and being on version 3. I guess
      Python is an emerging programming language in some places too?
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-3">
      Virtualising netCDF datasets
    </h3>

    <p class="mb-4">
      Virtualisation is basically the way to square the circle here.
      Virtualizarr lets you take a bunch of netCDFs and create a 'Virtual Zarr
      store' from them: something that you can query and work with as if it were
      zarr, with the backend infrastructure handling fetching all the file
      chunks for you. The idea here was that it means you can pop a bunch of
      netCDF files in the cloud — which is typically a fairly bad idea, see
      <a
        href="https://earthmover.io/blog/fundamentals-what-is-cloud-optimized-scientific-data"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline"
        >this blog post</a
      >
      by Tom Nicholas — and then virtualise them, making it as fast to access
      them as if they were Zarr.
    </p>

    <p class="mb-4">
      To my knowledge, Martin Durant (who originally conceived of kerchunk to do
      this) was mostly interested in the problem of getting these netCDF type
      files out of cloud object storage efficiently. However, virtualisation
      (perhaps inadvertently — I don't know the history) also solves a bunch of
      other problems.
    </p>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-3">
      <li>
        <strong>Opening large, multifile datasets.</strong> On a lustre file
        system, opening a file that hasn't been touched in a while can be really
        slow — like, upwards of a couple of seconds slow. This means that if you
        want to open a dataset with e.g. 500 files, a really nontrivial amount
        of time (from the user's perspective) can be spent
        <em>just opening files</em>. A kerchunk reference can be as simple as a
        single json file — so you spend less time fighting the filesystem to get
        a
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >repr</code
        >. (You still pay this cost
        <em>if you actually need data from each of those files</em>, but 1. you
        might only need a tiny subset of the files, and 2. people expect doing
        big complicated calculations on gargantuan datasets to take a while
        anyway.)
      </li>
      <li>
        <strong>Combining large, multifile datasets.</strong> When we open all
        these files as one dataset, there is still work to be done stitching all
        the files together into a single object — even if we don't bother to
        perform any validity checks. Virtualisation lets us do this
        <em>once</em>, and then cache the result.
      </li>
    </ul>

    <p class="mb-4">
      All in all — even on a posix filesystem, a virtualised dataset is a way
      better solution than a bunch of netCDF files, and unless we change from
      lustre, it's also workable from an inode perspective, unlike reserialising
      everything as zarr. (Again, I'm totally ignoring sharding and zipped zarr
      stores here.)
    </p>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <h2 class="text-2xl font-bold mt-8 mb-4">
      Getting this all working on Pawsey
    </h2>

    <p class="mb-4">
      Getting started on Acacia was really straightforward. I've used GCS for
      some personal stuff before, thanks to their forever free tier, but I'd
      never played with S3/Ceph, and I'd only been on Setonix once or twice
      before. Luckily, their documentation has clearly been actually used,
      because I just followed along (No LLM helping me!) and was able to get set
      up in under an hour.
    </p>

    <p class="mb-4">
      I decided to make 3 buckets on Pawsey: an
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >01deg</code
      >
      and
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >1deg</code
      >
      bucket under my user storage area, and a
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >ct-zarr-test</code
      >
      bucket under an ACCESS-NRI trial project storage area we had.
    </p>

    <p class="mb-4">
      Why under both? I'd heard from someone that Acacia might restrict policies
      (and CORS headers) to only be freely available for buckets in user
      storage, and I wanted to test that. You only get 100GB of quota in your
      personal user storage, so if we wanted to virtualise real datasets, it
      would need to work for project storage too.
    </p>

    <p class="mb-4">One step at a time though...</p>

    <h2 class="text-2xl font-bold mt-8 mb-4">
      Virtualising Climate Data on Acacia
    </h2>

    <p class="mb-4">
      After I got the bucket set up and some data copied in, I spent a few hours
      poking at the
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >01deg</code
      >
      bucket and trying to make a virtual, remotely-consumable dataset. A few
      hours later, I had exactly what I was after. Here's how it went down: see
      <a
        href="https://github.com/charles-turner-1/PawseyVirtualisationTests/blob/main/pawsey/vz_01deg.ipynb"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline"
        >this notebook</a
      >
      if you want to see the full process.
    </p>

    <h2 class="text-2xl font-bold mt-8 mb-4">What I did</h2>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-6">
      <li>
        <p class="mb-2">
          Open a single NetCDF from the bucket over S3 to check permissions and
          basic reads:
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >xarray</code
          >
          +
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >h5netcdf</code
          >
          with anonymous client options against
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >s3://01deg</code
          >. A cold read takes about 7 seconds to open the dataset:
        </p>
        <highlightjs
          language="python"
          :code="code1OpenDataset"
          class="rounded-lg"
        />
        <p class="mt-2">
          If you're following along at home, you should be able to execute this
          code yourself — it's a publicly readable bucket, and running this code
          was a (very comfortable) way of proving it to myself.
        </p>
      </li>

      <li>
        <p class="mb-2">
          Use
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >virtualizarr</code
          >
          (the
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >HDFParser</code
          >
          +
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >S3Store</code
          >
          parts in this instance) to build a virtual dataset across many files
          via
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >open_virtual_mfdataset</code
          >. The code for this is remarkably simple:
        </p>
        <highlightjs
          language="python"
          :code="code2VirtualMfdataset"
          class="rounded-lg"
        />
        <p class="mt-2">
          For whatever reason, I had to pass credentials to my store. Maybe if I
          tried an anonymous store without credentials, things would have
          worked. I didn't bother investigating, because I created my virtual
          dataset before worrying about making it publicly readable.
        </p>
      </li>

      <li>
        <p class="mb-2">
          Persist the combined virtual dataset in a few formats for downstream
          testing: an
          <code
            class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
            >icechunk</code
          >
          repo, a kerchunk JSON reference, and a parquet reference file. For
          reasons I also didn't bother investigating, I ran into issues writing
          the kerchunk reference straight into the bucket, but the icechunk one
          was fine.
        </p>
        <p class="mb-2">This can be done with e.g.</p>
        <highlightjs
          language="python"
          :code="code3Icechunk"
          class="rounded-lg"
        />
        <p class="my-2">
          to write a virtual icechunk store into the bucket, or
        </p>
        <highlightjs
          language="python"
          :code="code4ToKerchunk"
          class="rounded-lg"
        />
        <p class="mt-2">
          to write it to a json file on my local machine. I'll come back to that
          later.
        </p>
      </li>
    </ul>

    <h2 class="text-2xl font-bold mt-8 mb-4">Bucket permissions &amp; CORS</h2>

    <p class="mb-4">
      The data streaming app I'm building is totally serverless — the browser
      just fetches the data directly from the bucket, without any proxy,
      intermediate server, or auth flow. This is ideal for performance and user
      experience, but it does mean that the bucket needs to be configured to
      allow anonymous reads from browsers.
    </p>

    <p class="mb-4">
      This means we need to make two changes to the bucket policy:
    </p>

    <ol class="list-decimal list-outside ml-6 mb-4 space-y-2">
      <li>
        Allow public read access to objects in the bucket. Note, I don't think
        we need to allow public read access to the bucket itself, just the
        objects — this would mean that as well as users being able to fetch the
        data if they know the exact path, they could list all the contents of
        the bucket — which is apparently bad. I allowed it anyway, because it
        was the first thing that worked. However, we definitely don't allow
        public write access, etc., because that would be a disaster.
      </li>
      <li>
        Set a CORS policy that allows simple
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >GET</code
        >/<code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >HEAD</code
        >
        requests from the origins we want to allow.
      </li>
    </ol>

    <p class="mb-4">
      Browsers enforce Cross-Origin Resource Sharing (CORS) rules when making
      requests to a different domain (i.e. from our data streamer app to the
      Acacia object store). If CORS is not configured correctly, the browser
      will just block requests entirely.
    </p>

    <p class="mb-4">There are two types of cross-origin requests:</p>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-2">
      <li>
        <strong>Simple requests</strong> (fast): standard
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >GET</code
        >/<code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >HEAD</code
        >
        requests with no custom headers. These are sent directly.
      </li>
      <li>
        <strong>Preflighted requests</strong> (slower): if the request includes
        non-standard headers (e.g.
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >Authorization</code
        >), the browser first sends an
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >OPTIONS</code
        >
        request to check permissions before issuing the real request.
      </li>
    </ul>

    <p class="mb-4">
      To maximise performance (especially when making many small chunk
      requests), we want to avoid preflight requests entirely. This means:
    </p>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-1">
      <li>
        Clients should only send simple
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >GET</code
        >/<code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >HEAD</code
        >
        requests
      </li>
      <li>
        No custom headers (especially no
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >Authorization</code
        >)
      </li>
      <li>Data must be publicly readable (anonymous access)</li>
    </ul>

    <p class="mb-4">
      The CORS policy below allows simple requests from any origin. In
      production, we'd probably want to lock it down via
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >AllowedOrigins</code
      >
      to specific domains.
    </p>

    <p class="mb-4">
      I'm not sure that I set the public read access correctly either — I'm
      probably a bit too much of a carefree loose unit with this stuff, but
      there's no sensitive data in there, and this is just a test anyway.
    </p>

    <p class="mb-4">
      For whatever reason, I couldn't apply these policies whilst I was logged
      into Setonix — I had to do it from my local machine (presumably any other
      non-Setonix machine would work just fine too).
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-3">1) Public read for objects</h3>

    <p class="mb-2">
      Create a
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >public-read.json</code
      >
      (replace
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >&lt;BUCKET_NAME&gt;</code
      >
      with... the name of your bucket):
    </p>

    <highlightjs
      language="python"
      :code="code5BucketPolicy"
      class="rounded-lg"
    />

    <p class="mb-2">
      Apply it using the AWS CLI (remember
      <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
        >--endpoint-url</code
      >
      for Acacia):
    </p>

    <highlightjs language="bash" :code="code6PutPolicy" class="rounded-lg" />

    <h3 class="text-xl font-semibold mt-6 mb-3">
      2) Minimal CORS (avoid preflight)
    </h3>

    <p class="mb-4">
      Browsers send OPTIONS preflight when a request isn't "simple" (e.g. custom
      headers). To avoid that, make your clients issue plain GET/HEAD without
      custom headers and set a CORS policy that allows those methods. What I
      used (but prefer locking down origins):
    </p>

    <highlightjs language="json" :code="code7Cors" class="rounded-lg" />

    <p class="mb-2">Apply with:</p>

    <highlightjs language="bash" :code="code8PutCors" class="rounded-lg" />

    <h3 class="text-xl font-semibold mt-6 mb-3">Notes and best practice</h3>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-2">
      <li>
        Prefer restricting
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >AllowedOrigins</code
        >
        to the exact origin(s) rather than
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >*</code
        >
        for security.
      </li>
      <li>
        To really avoid preflight, clients must not send custom headers (no
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >Authorization</code
        >). If you must use credentials, expect preflights and configure the
        server accordingly.
      </li>
      <li>
        For Acacia and other S3-compatible stores: always pass
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >--endpoint-url</code
        >
        and consider
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >force_path_style=True</code
        >
        in clients.
      </li>
    </ul>

    <p class="mb-4">
      Did I do all this 'correctly'? Maybe, probably not. I wrote a 1st draft of
      this write-up using Claude, and it gave me some policies which looked
      surprisingly (…worryingly?) different to the ones here. But whatever, this
      is a work in progress. Again, there's no personally identifiable
      information, sensitive data, etc. in this bucket.
    </p>

    <p class="mb-4">
      If you are dealing with those sorts of things, please don't use this as a
      how-to guide — I really don't fully know what I'm doing yet. I mean, this
      whole write-up is mostly so I don't have to trawl git histories to piece
      back together how to do this.
    </p>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <h2 class="text-2xl font-bold mt-8 mb-4">
      Okay... why? What's the end goal?
    </h2>

    <p class="mb-4">
      The guys over at carbonplan have been working on
      <a
        href="https://github.com/carbonplan/zarr-layer"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline"
        >this visualisation tool</a
      >, which I came across recently. I figured this was exactly what we needed
      in order to produce the over-the-wire data exploration tool which people
      wanted.
    </p>

    <p class="mb-4">
      Using zarr-layer,
      <a
        href="https://zarrita.dev/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline"
        >zarrita</a
      >
      (a TypeScript library for dealing with zarr files), and Claude Sonnet 4.6
      to speed up the process, I managed to generate
      <RouterLink
        to="/projects/zarr-data-streamer"
        class="text-blue-600 dark:text-blue-400 hover:underline"
        >this interactive data explorer
      </RouterLink>
      in about 2 hours.
    </p>

    <p class="mb-4">
      Remember how I said above that I couldn't figure out how to get the
      kerchunk reference file to read into/out of the Acacia bucket correctly.
      In the end, I wound up just saving it locally, and then shipping it to the
      browser as a static object with this site. Sloppy, but it works.
    </p>

    <p class="mb-4">
      Zarrita then just reads this local object out of the browser's JavaScript
      bundle, and from that knows how and where to fetch chunks from the Acacia
      bucket on demand.
    </p>

    <p class="mb-4">
      This is something we should probably figure out — it's probably cleaner to
      keep it in the bucket, and then fetch it when we need it, rather than with
      every load of my homepage, but Rome wasn't built in a day.
    </p>

    <p class="mb-4">
      This demo is still obviously very rough and ready — it's still on native
      grids for a start — but it's clearly a massive improvement over current
      data exploration tools, and surprisingly easy to get working. It turns out
      you can get a lot done by grabbing onto the coattails of very smart
      people.
    </p>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <h2 class="text-2xl font-bold mt-8 mb-4">
      Trying the same thing on NCI / Nirin
    </h2>

    <p class="mb-4">
      So virtualising and streaming data from Acacia works remarkably well.
      Great!
    </p>

    <p class="mb-4">
      Unfortunately, we deal with making climate data available to scientists in
      Australia, and most of Australia's trove of climate data is hosted on
      Gadi. This means we have two options (ignoring the sit-on-our-hands
      approach):
    </p>

    <ol class="list-decimal list-outside ml-6 mb-4 space-y-2">
      <li>
        Move the data to Acacia and host it from there. This is a bit of a
        non-starter for a lot of reasons — but most of the work the climate
        science community does on HPC is on Gadi. So we'd either have to
        duplicate the data, or stream it back to Gadi. Neither of these are
        really tenable.
      </li>
      <li>See if we can do the same thing on NCI's object storage, Nirin.</li>
    </ol>

    <p class="mb-4">
      It turns out the answer to the second question is... maybe?
    </p>

    <ol class="list-decimal list-outside ml-6 mb-4 space-y-2">
      <li>
        It's a lot more fiddly than Acacia, and there are some pretty big
        performance issues to work through.
      </li>
      <li>
        I haven't yet figured out whether it's possible to read the chunks the
        references point to from outside Gadi. Some of the documentation
        suggests it might be possible via NFS mounts, but I haven't gotten that
        working yet.
      </li>
    </ol>

    <p class="mb-4">Still, it's a step in the right direction.</p>

    <h3 class="text-xl font-semibold mt-6 mb-3">Why Nirin feels harder</h3>

    <p class="mb-4">
      I ran the same experiments on Nirin and hit a different (unfortunately
      bigger) set of operational annoyances compared with Acacia. Short version:
    </p>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-4">
      <li>
        <strong>Protocol &amp; gateway differences:</strong> Nirin exposes both
        Swift and an S3 gateway (e.g.
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >https://cloud.nci.org.au:8080/swift/...</code
        >
        and
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >s3://ct-icechunk-root/...</code
        >). In these experiments, I accessed the kerchunk reference remotely via
        the Swift endpoint while icechunk tests used the S3 gateway +
        credentials. This is because apparently public reads on Nirin buckets
        can only be achieved via Swift, not S3.
      </li>
      <li>
        <strong>No anonymous S3 reads:</strong> the S3 gateway did not allow
        anonymous access. That means consumers need credentials, signed URLs, or
        a trusted proxy inside Nirin to serve data. This means that if we want
        to read the icechunk store remotely, we need to provide credentials, as
        icechunk doesn't support Swift.
      </li>
      <li>
        <strong>Performance variability:</strong> reads from ARE (interactive
        environment) over Swift were noticeably slower than remote reads. I
        think there is some throttling of downloads into an ARE session, for
        reasons I don't totally understand.
        <p class="mt-2">
          With that said, it is still substantially faster to read the virtual
          references than the raw data: 2 minutes 40 for the non-virtualised
          dataset, 45s for the kerchunk reference over swift into an ARE
          session, and 2.6 seconds for the kerchunk reference remotely.
        </p>
        <p class="mt-2">
          Unfortunately, the performance improvement of kerchunk references will
          probably diminish for smaller datasets. I haven't run any scaling
          tests, but I assume that the end result will be that kerchunk will be
          much slower for virtualised datasets that only contain e.g. ten files
          than just opening the files, if we access the reference via Swift.
        </p>
      </li>
      <li>
        Weirdly, you don't see the same performance issues with icechunk: it
        reads in 1.6 seconds from within an ARE session, but takes 2.2 seconds
        remotely. This makes a bit more sense <em>a priori</em>, but it's weird
        that we see such a massive slowdown via Swift, when it's actually faster
        via S3.
      </li>
      <li>
        <strong>Icechunk vs Swift:</strong> icechunk doesn't speak Swift, so
        writing icechunk repos required the S3 gateway and credentials — more
        friction than the Acacia case.
        <p class="mt-2">
          This might be less of a big deal than it seems. You can't stream zarr
          from an icechunk store straight into the browser (true, AFAIK, at time
          of writing due to JavaScript being single-threaded and icechunk
          multi), so if you want to use the same set of virtual references for
          both remote data streaming/exploration, and to speed up reads on Gadi,
          you need to use kerchunk (or set up a server to handle getting data
          from icechunk to the browser).
        </p>
        <p class="mt-2">
          However, it does mean that the slowdown of kerchunk over Swift is more
          of an issue. Either we'd need to figure out how to speed up access to
          the kerchunk reference over Swift, or make the S3 gateway support
          anonymous reads and then read the kerchunk reference via that.
        </p>
      </li>
      <li>
        <strong>Compute-node access:</strong> the other big operational question
        for putting virtual reference datasets on Gadi is whether compute nodes
        can talk to Nirin endpoints directly. If they can't, then you'd need to
        have these references on the posix filesystem somewhere too. This is
        fine — in theory — but the number of these we'd be creating increases
        the risk that something gets out of sync. It seems like the atomicity
        guarantees that Swift provides aren't particularly great either...
      </li>
      <li>
        In the other direction, if we want to read the chunks out of the virtual
        references, we need some way of doing that. As of right now, this is an
        unresolved question. Maybe we'll get there eventually, but it's
        definitely not going to be as easy as with Acacia. This obviously makes
        streaming data out quite a bit harder.
      </li>
      <li>
        <strong>Documentation:</strong> The documentation for Acacia is really
        pretty clear, and easy to follow. Acacia is built on Ceph, and access is
        using the AWS CLI. In contrast, Nirin has multiple access methods
        (Swift, S3 gateway) and the documentation is quite a bit less complete.
        It also doesn't seem to be up to date: lots of things I tried seemed to
        no longer be true. It also contains gems like this:
        <blockquote
          class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-3 text-gray-600 dark:text-gray-400 italic"
        >
          The Nirin Cloud integrated object storage service supports a subset of
          the Swift and S3 access control mechanisms, with additional
          constraints which make them very limited for practical use. The NCI
          Cloud Team does not recommend the use of anything beyond the simplest
          case of enabling public read access to a container, which can be done
          via a simple check box for each container in the dashboard's Object
          Store → Containers tab.
        </blockquote>
        <p class="mt-2">
          Which subset does the Nirin object storage support? Not documented.
          And even though it explicitly states that you can set public read
          access, this only seems to apply to using the Swift Access protocol.
          In fact, it seems that the bucket policies are not set on the bucket
          itself, but on the access protocol. So you can have a totally
          different set of policies depending on whether you try to access it
          via Swift, or via S3api.
        </p>
        <p class="mt-2">
          If someone at NCI knows how to fix this, please let me know!
        </p>
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-3">Recommendations for Nirin</h3>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-2">
      <li>
        Use kerchunk + Swift only if the Swift gateway performs well from the
        interactive environment you plan to use; otherwise use S3 reads with
        signed URLs or a proxy.
      </li>
      <li>
        If anonymous S3 reads are required, request that from NCI support or
        plan for a proxy service in Nirin that holds credentials and serves
        kerchunk JSON.
      </li>
      <li>
        For icechunk, plan to use the S3 gateway with credentials and
        <code
          class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm font-mono"
          >force_path_style=True</code
        >; handle secrets securely (don't bake them into notebooks 🫠).
      </li>
      <li>
        Benchmark both Swift and S3 reads from your intended client (ARE, Gadi
        interactive node, etc.) — performance varies a lot depending on where
        you run the client.
      </li>
      <li>
        Consider placing the interactive catalog/parquet files in Nirin object
        storage (if compute nodes can read them) to reduce cross-site syncing.
      </li>
    </ul>

    <p class="mb-4">
      <strong>Bottom line:</strong> Nirin is usable, but the lack of anonymous
      S3 reads and the Swift/S3 performance differences make it more
      operationally fiddly than Acacia. The usual workarounds are: enable
      anonymous access, run a small trusted proxy inside Nirin, or accept
      credentialed access with careful secret management.
    </p>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <h2 class="text-2xl font-bold mt-8 mb-4">Some final thoughts</h2>

    <ul class="list-disc list-outside ml-6 mb-4 space-y-3">
      <li>
        The fact that one man in a shed in Western Australia can do all this in
        a few days is pretty amazing, and it's a testament to the work of the
        people who built these tools. It's also a testament to the power of open
        source software and the scientific Python ecosystem. In particular, big
        shoutout to Tom Nicholas and Martin Durant for their work on
        virtualizarr and kerchunk, which made this all possible, the entire
        Earthmover team for what they've been doing in this area (including open
        sourcing icechunk), and the carbonplan team for zarr-layer.
      </li>
      <li>
        Shout out to Dougie Squire and Thomas Moore, amongst others, for really
        pushing these ideas in Australia. If they hadn't been so keen on these
        things, I think it would have taken me a lot longer to discover the
        possibilities in this space.
      </li>
      <li>
        Building reliable infrastructure is really tough — it's no wonder that
        Amazon have been so successful, having more or less cracked the problem.
        It's amazing that Pawsey and NCI are able to replicate this
        functionality on a much tighter budget.
      </li>
      <li>
        We already have the tools and infrastructure to distribute data
        effectively, here in Australia. We just need to make use of them.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-3">
      Next on the to-explore list: Virtual CMORisation
    </h3>

    <p class="mb-4">
      See
      <a
        href="https://github.com/charles-turner-1/PawseyVirtualisationTests/blob/main/pawsey/vz_01deg_cmorize.ipynb"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline break-all"
        >https://github.com/charles-turner-1/PawseyVirtualisationTests/blob/main/pawsey/vz_01deg_cmorize.ipynb</a
      >
    </p>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

const code1OpenDataset = `import xarray as xr

url = "s3://01deg/output980/iceh.2146-01.nc"

ds = xr.open_dataset(
    url,
    engine="h5netcdf",
    backend_kwargs={
        "storage_options": {
            "anon": True,
            "client_kwargs": {"endpoint_url": "https://projects.pawsey.org.au"},
        }
    },
)`;

const code2VirtualMfdataset = `import os
from virtualizarr import open_virtual_mfdataset
from virtualizarr.parsers import HDFParser
import obstore
from obstore.store import S3Store
from obspec_utils.registry import ObjectStoreRegistry

import numcodecs.zarr3  # Register the zarr3 codec

from dotenv import load_dotenv

load_dotenv()

access_key_id = os.environ.get("ACCESS_KEY_ID")
secret_access_key = os.environ.get("SECRET_ACCESS_KEY")
endpoint = "https://projects.pawsey.org.au"
bucket = "s3://01deg"

# create s3 store with aws-style credentials
store = S3Store.from_url(
    f"{bucket}",
    endpoint=endpoint,
    access_key_id=access_key_id,
    secret_access_key=secret_access_key,
)

registry = ObjectStoreRegistry({f"{bucket}": store})

parser = HDFParser()

urls = []
for batch in obstore.list(store):
    for obj in batch:
        urls.append(obj.get("path"))

combined_vds = open_virtual_mfdataset(
    urls=urls,
    parser=parser,
    registry=registry,
    combine="nested",
    concat_dim="time",
    parallel="dask",
    compat="override",
    coords=["time"],
)`;

const code3Icechunk = `import icechunk
from pathlib import Path

# Create a new repository instance with virtual chunk container permissions for reading
config = icechunk.RepositoryConfig.default()
config.set_virtual_chunk_container(
    icechunk.VirtualChunkContainer(
        url_prefix=f"{bucket}/",
        store=icechunk.s3_store(
            endpoint_url=endpoint,
            s3_compatible=True,
            force_path_style=True,
        )
    ),
)

credentials = icechunk.containers_credentials(
    {
        bucket: icechunk.s3_credentials(
            access_key_id=access_key_id,
            secret_access_key=secret_access_key,
        )
    }
)

storage = icechunk.s3_storage(
    bucket='01deg',
    prefix='icechunk',
    endpoint_url=endpoint,
    access_key_id=access_key_id,
    secret_access_key=secret_access_key,
    force_path_style=True,
)

repo = icechunk.Repository.create(
    storage,
    config,
    authorize_virtual_chunk_access=credentials
)

write_session = repo.writable_session("main")
combined_vds.vz.to_icechunk(write_session.store)
write_session.commit("Write Pawsey 01deg virtual dataset to acacia zarr store for testing")`;

const code4ToKerchunk = `combined_vds.vz.to_kerchunk(
    filepath="file:///Users/u1166368/scratch/virtualizarr/pawsey/ref-01deg.json",
)`;

const code5BucketPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicList",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::<BUCKET_NAME>"
    },
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::<BUCKET_NAME>"
    },
    {
      "Sid": "AuthenticatedWrite",
      "Effect": "Allow",
      "Principal": {"AWS": ["arn:aws:iam:::user/cturner"]},
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::<BUCKET_NAME>/*"
    }
  ]
}`;

const code6PutPolicy = `aws s3api put-bucket-policy \\
  --endpoint-url https://projects.pawsey.org.au \\
  --bucket <BUCKET_NAME> \\
  --policy file://list-and-read-vz-cmor.json \\
  --profile cturner`;

const code7Cors = `{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type", "ETag"]
    }
  ]
}`;

const code8PutCors = `aws s3api put-bucket-cors \\
  --endpoint-url https://projects.pawsey.org.au \\
  --bucket <BUCKET_NAME> \\
  --profile cturner \\
  --cors-configuration file://cors.json`;
</script>
