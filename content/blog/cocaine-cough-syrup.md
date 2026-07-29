---
title: "Should we put the cocaine back in the cough syrup? Making data access palatable"
description: "Some more of the ideas from my 2026 Scipy talk: data advertising, palatability, and vibe coding."
date: "2026-07-22"
author: "Charles Turner"
href: "/blog/cocaine-cough-syrup"
---

# Should we put the cocaine back in the cough syrup? Making data access palatable

> As I write this, I'm sitting in Canberra, on my way home from Scipy 2026. To my delight (and perhaps surprise), the ideas I've been promoting seemed about as well recieved as I could have possibly hoped for. This is a continuation of those ideas.
>
> Because I'm me, it'll probably take a few strange twists, turns, and asides. Hopefully the stream of thought narrative is appealing to at least somebody who reads this.
>
> > Warning - I finished this off when I wasn't high on jetlag. Some of it seems a bit more muddled now, but I'm going to leave it as is, because I like the stream of consciousness style that was apparently all I could muster.

## Getting the rat to pull the lever: How your dopamine system works.

There is a famous psychological experiment known as a [Skinner Box](). B. F. Skinner and his student, Charles Ferster, were trying to understand motivation. To this end, they created a box, which contained a lever which dispened food pellets. They would place a rat (or a pigeon) in this box, and via some clever mechanical tricks, could determine the conditions which made the rat push the lever.

It's unfortunately an apocryphal story, but it's so charming that I'll repeat the misconception. One day, as the story goes, they were running short on treats to dispense via the lever, so they rigged it to only give a treat a certain percentage of the time; say 30-50%. They expected this to be a disaster and to have to write their results for the day off. It turned out that the rats could not resist the uncertainty of the lever, and began furiously pressing as if they were possessed.

As I said, it turns out this origin story is completely untrue. They were just systematically investigating conditions that triggered pressing, and this was one condition they tested. It turned out, however, to be far more stimulating than just giving a reward on each press. This discovery, known as a **variable reward schedule**, is more or less the mechanism by which slot machines, social media, toxic on-again-off-again relationships, and coding agents work, and is just about the most reliable mechanism to motivate someone (or just about any mammal) to do something.

> Brief aside: When I was fact checking the Skinner box stuff for this, I also discovered that during one of their experiments, they managed to make pigeons superstitious - if a pigeon flapped it's wings just before a scheduled reward was dispensed just a couple of times, it would begin to flap its wings to obtain a reward.

> Aside 2: There is the legendary story about Google making their search worse to serve more ads - two searches means twice as many ads served. Ironically, this might have also made the user experience better - because it made Google unpredictable in a way that our brains can't resist.

Cool - but what the hell does this have to do with data advertising, let alone coding agents? Put very simply:

**We cannot resist pulling a lever that we know occasionally pays out a reward.**

Even more simply, there is something completely enthralling about taking actions that might pay off. **We love gambling** - and we're biologically hardwired to do it.

Facebook worked this out a while back. I'm not sure it's still true, but it used to be the case that every fourth post was an advert. It's probably still true for Instagram reels, and TikTok. Unless you counted, you wouldn't notice - you'd just get the dopamine hit when you suddenly scrolled past an advert to some content you were actually interested in.

Facebook also stole the refresh mechanism for your feed straight from slot machines, to my knowledge. You pull down, it bounces a bit, and then occasionally, it might show you something new. Dopamine, DOPAMINE, **DOPAMINE**.

### What the hell does this have to do with coding agents?

For a long time, writing code was a pretty medative process - it would work something like the following, assuming you were writing Python:

1. Sit down, write some code.
2. Write some tests.
3. Run the test suite.
4. Error
5. Fix the code and/or tests.
6. Repeat steps 3-5 until everything passes.

There **is** a variable reward in here, which, to my mind, is why programming gradually becomes satisying: you never know whether your code is actually going to work. Eventually, you get good enough that the chance it does work becomes high enough that the process becomes fun, not frustrating.

> Aside: This is 'flow state', or 'The Zone of Proximal Development' - the former term coined by the Hungarian psychologist Mihaly Csikszentmihalyi, the latter by Lev Vygotsky. Too easy, and things are boring. Too hard, things are frustrating. Just right, and like Goldilocks, your dopamine system gets just the right ratio of wins and failures - and the process of doing the task slots right into this dopamine dynamic, driving you to continue.

Now, let's think about how coding agents have moved the needle on this:

- Firstly, there is no guaranteed reward - If I fire up claude code and tell it to build me the next Ebay/Facebook/ChatGPT, it's going to fail.
- An LLM is basically a gigantic intuition machine - a model of your brains System 1, dialled up to 11. I can write for loops in Python to do maths all day, without really engaging my brain at all. That's dull - because I know I can do that with (effectively) 100% accuracy. I don't need an LLM to do it.

So we have a wide open problem space. One one hand, I know that I can type out code by hand to do the donkey work, with a virtually 100% chance of success - no neurochemical rewards to be found there. On the other hand, if I want to build the next gcc/polars/facebook, the chance of doing it is next to zero, and I'll be typing for a very long time before I get any reinforcement - so there's not much neurochemical reward there either.

So what does a coding agent actually let us do? It lets us titrate the chance of success, just to the point where we can't stop ourselves from using it. It's a slot machine that lets us choose the odds.

If I tell Claude Code/ Codex to build me a feature, I know approximately how much detail I need to tell it. In fact, in the interests of efficiency (I'll come back to this), I'm trying to minimise the amount of detail I'm giving it, aiming to give it just enough that it can fill in all the details itself. Sometimes it'll be enough. Sometimes, it'll need a little back and forth. Fine, seems reasonable enough.

But what if it's not in the interests of efficiency? Here's another way of thinking about it - when you give a coding agent a prompt, what if you're not giving it just enough information to fill in the blanks. What if you're actually giving it enough information that it's chance of success is maximally rewarding to your dopamine system?

**I don't think we can tell the difference**. In fact, I'm not even sure there is a difference. In the past few months, I've seen Simon Willison, David Heinemeir Hanssen, and Marc Andreesen talk about this phenomena where developers find it basically impossible to put the LLM down, borderline addict behaviour that involves prompting the thing until the early hours of the morning, waking up at 6AM to start building, etc etc. This looks an awful lot like addiction to me.

**To be clear**, I'm not actually sure this is a bad thing. We've managed to discover and/or invent plenty of addictive things - videogames, TikTok, drugs, sugary food, ice baths. Most of these things are generally neutral to bad for you, at least at a 'story of your life' level (I deliberately put ice baths in as an example of a 'neutral' addiction). But now we've managed to discover a way to make building useful tools addictive. Sure, this then comes at the cost of balance, but it's not like we were all super balanced to begin with.

Maybe replacing the destructive addictions with productive ones isn't such a bad idea?

## What the hell does this have to do with data access, though?

Okay, so after a probably unnecessary amount of preamble and philosophy, we arrive at the main point that I was hoping to make. To my mind, we now have something that looks like clear evidence that even one of the most traditionally tedious tasks, writing software, can be gamified in a way that makes it somewhere between effortless and addictive. So let's turn our attention to another of those tedious tasks - distributing, discovering, and accessing scientific data.

Again, the frame I'm going to take here isn't about what would be the most morally pure way to do this. Instead, we're going to think about this from the perspective of _"How can we make data access maximally appealing to our dopamine system?"_.

My justification for this is that if TikTok and Instagram are competing for your attention by randomly inserting videos of scantily clad women into your feed in order to sell your attention to advertisers and then pinging your phone at random in order to reel you in (pun intended), it doesn't strike me as particularly amoral to apply some similar principles to at least make doing something productive with your time able to compete on even ground.

#### Human beings love bright colours.

All the apps on your phone have bright logos, because we love bright flashing things. Here are some papers on the topic:

- [Is life brighter when your phone is not? The efficacy of a grayscale smartphone intervention addressing digital well-being
  ](https://journals.sagepub.com/doi/10.1177/20501579231212062)
- [Suffering from problematic smartphone use? Why not use grayscale setting as an intervention! – An experimental study](https://www.sciencedirect.com/science/article/pii/S2451958823000271)
- [Evaluating the Effectiveness of Apps Designed to Reduce Mobile Phone Use and Prevent Maladaptive Mobile Phone Use: Multimethod Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10498313/)

It's kind of hilarious - one of the highest leverage activities you can do to reduce ~~your smartphone usage~~ the nontrivial fraction of your life you are wasting on your phone is just to make it black and white.

The takeaway here for distributing data: Since data access is already kind of boring, we should probably include as many bright flashing colours as possible (and professional).

#### People don't like reading

"I'm not going to read that essay"

Nuff said. It needs to be short and sharp.

#### Popups, motion, excitement

In early June, I was on a flight from Kuala Lumpur to London with my nieces - who were about 15 months old at the time. They were, understandably, a bit bored on a 14 hour flight. At one point, I showed one of them that my watch had a touchscreen.

This was a Garmin Fenix by the way, not an Apple Watch or similar. It's a fairly dull, functional, piece of tech. What I didn't expect to see was how completely captivated she was by the movement on the screen and the haptic feedback.

Again, this was a 15 month old baby, who I don't think had previously really seen any smart watches at all, looking at one that was designed to be boring. I found that pretty remarkable.

### Make it short, make it bright, make it move

> I wish I could have done that for my writing here...

I think it winds up boiling down to this. When you think about it, this design pattern then shows up just about everywhere that needs to command limited attention:

- Traffic lights
- Childrens books
- Cartoons
- Social Media
- Smartphones
- Modern IDE's - syntax highlighting, status lines, git diffs.

I could keep going, but really it's kinda just evident. The problem is - just think about where it doesn't show up:

- Data Catalogues
- Academic Papers
- Anything the government can force you to interact with - eg. your tax return.

Data advertising is about moving your dataset from the long, bland and static to the short, bright and interactive 'bucket'.

### Data Advertising - A (heavily) abridged and wooly definition.

> "The best way to distribute large scientific datasets is via the Cloud" - [Virtualizarr Docs](https://virtualizarr.readthedocs.io/en/stable/), presumably written by Tom Nicholas.

I 100% agree with this statement. Just because something is in principle accessible by emailing you and asking for a copy, or obtaining login access to some computer system somewhere, that does not mean it is accessible in practice. But the cloud doesn't just give us an easy way to distribute datasets - it also gives us an easy way to advertise them.

**All you need is CORS**

- [Carbonplan/zarr-layer](https://zarr-layer.demo.carbonplan.org/)
- [DWER-CSI-Streamer](https://charles-turner-1.github.io/dwer-csi-streamer/view-data)

(The latter site is mine, and built on top of zarr layer. Shout out to everyone involved in that project, it is tremendous)

The beauty of cloud data distribution is that fundamentally, it's just HTTP access to a computer somewhere, with the datasets optimised in such a way that they can be streamed performantly. This opens up a second possibility - **why not just stream them straight into a website, so we can explore them by looking at them?**

In the DWER-CSI-Streamer I linked above, the data that you can look at and scroll through **is just a zarr store in an S3 (Ceph, actually) bucket**. In fact, you can open it with xarray now from your laptop, if you want:

```python
 # /// script
 # dependencies = [
 #   "xarray",
 #   "zarr",
 #   "fsspec",
 #   "requests",
 #   "aiohttp",
 # ]
 # ///

 import xarray as xr

 ds = xr.open_zarr("https://projects.pawsey.org.au/dwer-zarr-store/data.zarr")

 print(ds)
```

```
<xarray.Dataset> Size: 601MB
Dimensions:       (time: 492, rlat: 279, rlon: 364, rot_pole: 1, bnds: 2)
Coordinates:
  * time          (time) datetime64[ns] 4kB 1980-01-16T12:00:00 ... 2020-12-1...
  * rlat          (rlat) float64 2kB -11.34 -11.31 -11.27 ... -1.592 -1.557
  * rlon          (rlon) float64 3kB 147.7 147.7 147.7 ... 160.4 160.4 160.4
    lat           (rlat, rlon) float64 812kB ...
    lon           (rlat, rlon) float64 812kB ...
    rotated_pole  (rot_pole) int32 4B ...
    time_bnds     (time, bnds) datetime64[ns] 8kB ...
    height        float64 8B ...
Dimensions without coordinates: rot_pole, bnds
Data variables:
    pr            (time, rlat, rlon) float32 200MB ...
    tasmax        (time, rlat, rlon) float32 200MB ...
    tasmin        (time, rlat, rlon) float32 200MB ...
Attributes: (12/28)
    institute_id:                   WA-DWER
    institution:                    Murdoch University and Department of Wate...
    contact:                        Jatin Kala (J.Kala@murdoch.edu.au), Sean ...
    references:                     https://www.wa.gov.au/organisation/depart...
    project_id:                     WA-CSI
    product:                        output
    ...                             ...
    wrf_shemes_ra_lw_physics:       Iacono, M. J., J. S. Delamere, E. J. Mlaw...
    wrf_shemes_sf_sfclay_physics:   Revised_MM5; Jimenez et al. (2012, MWR)
    wrf_shemes_sf_surface_physics:  Niu, Guo-Yue, Zong-Liang Yang, Kenneth E....
    wrf_shemes_mp_physics:          Thompson, Gregory, Paul R. Field, Roy M. ...
    wrf_shemes_bl_pbl_physics:      Nakanishi, M., and H. Niino, 2006: An imp...
    wrf_shemes_cu_physics:          Disabled
```

### But how much better is a nice interactive page than reading an xarray repr?

It doesn't just have to be the data itself, by the way.

If you're a scientist, then poring over the specifics of what is in your dataset is probably actually quite fun. What's less fun is finding the damn thing in the first place. Scientists already know how to use xarray to explore a dataset. Typically, they're less versed in efficiently traversing data lakes.

**Enter the [interactive-data-catalogue](https://access-nri.github.io/interactive-data-catalogue/#/).**

The interactive data catalogue _is_ the same data catalogue that we provide on Gadi via intake at ACCESS-NRI. In fact, if you fire up an ARE session and take a look at the results of:

```python
import intake
intake.cat.access_nri
```

You will find _the exact same data_ - because it's made of the same files. The difference is the presentation:

- No more learning intake - you probably already know how to click through a website. As you explore, the site generates the code you need to load it in Python.
- Don't know what project a dataset requires? Don't worry - the page will pop that up.
- Not sure why you're not getting multiple datasets and not one? All good - the catalogue will spell it out for you.
- Not sure if Gadi even has the data you're after? No worries - you don't need to get yourself set up with an NCI account and join the right projects just to check now.

**The last point might seem trite, but it's really not. If anything, it's probably the most important part of the interactive data catalogue.**

I helped organise the Scientific Python track at PyCon AU last year. Afterwards, we (the organisers) were sitting in the bar, having a drink and reflecting on how the day went. I mentioned something I was doing with our intake catalog, and a bloke a couple of chairs down the long bench table we're sitting at flashes me a glance.

He came over, and asked about this catalog. It turns out he was (I think) a computational biologist, interested about how crop disease risk was going to change in the future. Having access to CMIP6 data with projections of relevant variables over the the next hundred years would make his research a lot easier to do. Unfortunately, because the catalog wasn't easy to find - being hidden behind a project on Gadi (`xp65`) that nobody outside climate science would know to look at or in, he never found it.

**Chance encounters in a bar are not a good way to share data**.

### Data advertising is pure fluff - it doesn't create anything new. But fluff is really important. It takes something that already exists, and wraps it up in a form that makes it competetive in the attention landscape and easy to consume.

### Sleeping on a board is just as practical as sleeping in a bed, but nobody wants to sleep in a board. In the bland, utilitarian landscape of software and science, we often forget this fact, and often go as far as looking down our noses at people who want to focus on the fluff. But without the fluff, quite frankly, nobody will care.

> N.B If someone has a better term than fluff, please get in touch. Also if you have a better term than data advertising, please do the same. For something that is expressly about presentation, it's a bit ironic I haven't been able to come up with at least half decent names.

---

## Aside - what has the title got to do with anything in here?

1. It's catchy
2. Cough syrup is literally designed to wrap up medicine in a way that convinces small children to take them. Calpol is just paracetamol and sugar.
3. Cough syrups often used to contain opiates and cocaine during the Victorian era. To my knowledge, this was for the analgesic/anasthetic qualities, rather than to drive consumption, but I think in practice, the reverse probably wound up being the case.
4. When I was doing a WIP version of this talk, I casually threw in the phrase "I'm not saying we should put the cocaine back in the cough syrup, but maybe we shouldn't take the sugar out either". I got several remarks saying that it was one of, if not hands down, the best quotes I've ever managed to produce, so I decided to shoehorn it in here.
