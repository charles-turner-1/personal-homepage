---
title: "Should we put the cocaine back in the cough syrup? Making data access palatable"
description: "Some more of the ideas from my 2026 Scipy talk: data advertising, palatability, and vibe coding."
date: "2026-07-22"
author: "Charles Turner"
href: "/blog/cough-syrup-cocaine"
---

# Should we put the cocaine back in the cough syrup? Making data access palatable

> As I write this, I'm sitting in Canberra, on my way home from Scipy 2026. To my delight (and perhaps surprise), the ideas I've been promoting seemed about as well recieved as I could have possibly hoped for. This is a continuation of those ideas. 
> 
> Because I'm me, it'll probably take a few strange twists, turns, and asides. Hopefully the stream of thought narrative is appealing to at least somebody who reads this.

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
- An LLM is basically a gigantic intuition machine - a model of your brains System 1, dialled up to 11. I can write for loops in Python to do complicated maths all day, without really engaging my brain at all. That's dull - because I know I can do that with (effectively) 100% accuracy. I don't need an LLM to do it.

So we have a wide open problem space. One one hand, I know that I can type out code by hand to do the donkey work, with a virtually 100% chance of success - no neurochemical rewards to be found there. On the other hand, if I want to build the next gcc/polars/facebook, the chance of doing it is next to zero, and I'll be typing for a very long time before I get any reinforcement - so there's not much neurochemical reward there either.

So what does a coding agent actually let us do? It lets us titrate the chance of success, just to the point where we can't stop ourselves from using it. It's a slot machine that lets us chose the odds.

If I tell Claude Code/ Codex to build me a feature, I know approximately how much detail I need to tell it. In fact, in the interests of efficiency (I'll come back to this), I'm trying to minimise the amount of detail I'm giving it, aiming to give it just enough that it can fill in all the details itself. Sometimes it'll be enough. Sometimes, it'll need a little back and forth. Fine, seems reasonable enough.

But what if it's not in the interests of efficiency? Here's another way of thinking about it - when you give a coding agent a prompt, what if you're not giving it just enough information to fill in the blanks. What if you're actually giving it enough information that it's chance of success is maximally rewarding to your dopamine system?

**I don't think we can tell the difference**. In fact, I'm not even sure there is a difference. In the past few months, I've seen Simon Willison, David Heinemeir Hanssen, and Marc Andreesen talk about this phenomena where developers find it basically impossible to put the LLM down, borderline addict behaviour that involves prompting the thing to the early hours of the morning, waking up at 6AM to start building, etc etc. This looks an awful lot like addiction to me.

**To be clear**, I'm not actually sure this is a bad thing. We've managed to discover and/or invent plenty of addictive things - videogames, TikTok, drugs, sugary food, ice baths. Most of these things are generally neutral to bad for you, at least at a 'story of your life' level. But now we've managed to discover a way to make building useful tools additive. Sure, this then comes at the cost of balance, but it's not like we were all super balanced to begin with. 

Maybe replacing the destructive addictions with productive ones isn't such a bad idea?

## What the hell does this have to do with data access, though?

Okay, so after an extreme amount of preamble, we arrive at the main point that I was hoping to make. To my mind, we now have something that looks like clear evidence that even one of the most traditionally tedious tasks, writing software, can be gamified in a way that makes it somewhere between effortless and addictive. So let's turn our attention to another of those tedious tasks - distributing, discovering, and accessing scientific data.

Again, the frame I'm going to take here isn't about what would be the most morally pure way to do this. Instead, we're going to think about this from the perspective of *"How can we make data access maximally appealing to our dopamine system?"*.

My justification for this is that if TikTok and Instagram are competing for your attention by randomly inserting videos of scantily clad women into your feed in order to sell your attention to advertisers and then pinging your phone at random in order to reel you in (pun intended), it doesn't strike me as amoral to apply some similar principles to at least make doing something productive with your time able to compete on even ground.

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
- Anything the government can force you to interact with


Data advertising is about moving your dataset from the long, bland and static to the short, bright and interactive bucket. 

### Data Advertising - A (heavily) abridged definition.

> "The best way to distribute large scientific datasets is via the Cloud" - [Virtualizarr Docs](https://virtualizarr.readthedocs.io/en/stable/), presumably written by Tom Nicholas.

I 100% agree with this statement. Just because something is in principle accessible by emailing you and asking for a copy, or obtaining login access to some computer system somewhere, that does not mean it is accessible in practice. But the cloud doesn't just give us an easy way to distribute datasets - it also gives us an easy way to advertise them.

**All you need is CORS**
- [Carbonplan/zarr-layer](https://zarr-layer.demo.carbonplan.org/)
- [DWER-CSI-Streamer](https://charles-turner-1.github.io/dwer-csi-streamer/view-data)

(The latter site is mine, and built on top of zarr layer. Shout out to everyone involved in that project)

The beauty of cloud data distribution is that fundamentally, it's just HTTP access to a computer somewhere, with the datasets optimised in such a way that they can be streamed performantly. This opens up a second possibility - why not just stream them straight into a website, so we can explore them by looking at them?

