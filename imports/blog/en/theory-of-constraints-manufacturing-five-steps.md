---
title: "Theory of Constraints in Manufacturing: The Five Focusing Steps"
summary: "The theory of constraints in manufacturing lifts output by working on the one limit that sets the pace. Learn the five focusing steps and drum-buffer-rope."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [theory-of-constraints, bottleneck, buffer-management]
keypoints:
  - "The theory of constraints (TOC) says the output of a system is limited by its weakest link, so improvement effort belongs on the constraint first."
  - "The five focusing steps are: identify the constraint, exploit it, subordinate everything else, elevate it, and go back to step one without letting inertia set in."
  - "A constraint is not always a machine; it can be a policy, a supplier or market demand, so check rules and flows as well as capacities."
  - "Drum-buffer-rope schedules the plant: the constraint is the drum, a time or stock buffer protects it, and a rope releases material at the rate it can use."
  - "Exploit before you elevate: look for hidden capacity at the constraint, such as relief during breaks, no starving and no scrap, before spending money."
faq:
  - q: "What are the five focusing steps of the theory of constraints?"
    a: "Identify the constraint, decide how to exploit it, subordinate everything else to that decision, elevate the constraint, and then go back to step one without letting inertia create a new constraint. The cycle repeats, because once a constraint is broken, the next weakest link becomes the one that limits the plant."
  - q: "What is drum-buffer-rope?"
    a: "Drum-buffer-rope is a scheduling method from the theory of constraints. The constraint is the drum that sets the pace, a buffer of time or stock protects it from disruption, and a rope releases raw material at the rate the constraint can use, so other resources do not overproduce."
  - q: "How is the theory of constraints different from lean?"
    a: "One Lean Enterprise Institute author describes the difference this way: TOC starts by finding the constraint and works on it, while lean starts by defining customer value and walking the whole value stream. Both aim at profit and continuous improvement, and many practitioners combine them to decide where to start."
---

The theory of constraints in manufacturing says that the output of a plant is limited by very few constraints, and that you improve the plant by working on them in five repeating steps: identify, exploit, subordinate, elevate and repeat. This guide is for operational excellence managers who want a method for deciding where to improve first. You will learn the core idea, the five focusing steps one by one, how drum-buffer-rope turns them into a schedule, a worked example with numbers, and the mistakes that waste the effort.

## Theory of constraints in manufacturing: the core idea

[Theory of constraints](https://www.m365.fm/entity/theory-of-constraints/) (TOC) was developed by Dr. Eliyahu Goldratt. The [entry on the theory in the Encyclopedia of Management](https://www.encyclopedia.com/management/encyclopedias-almanacs-transcripts-and-maps/theory-constraints), published on encyclopedia.com, states its premise: the strength of any chain, process or system depends on its weakest link. Goldratt's 1984 novel *The Goal* popularised the ideas by following a plant manager who has to save a failing plant. The encyclopedia entry has a promotional tone and gives no criticism, so read it as an introduction and not as proof of results.

A constraint is whatever limits the system from reaching its goal. In a plant, it is often a machine, but not always. The Lean Enterprise Institute (LEI) author Sergio Rattner writes in [What is the Theory of Constraints, and How Does it Compare to Lean Thinking?](https://www.lean.org/the-lean-post/articles/what-is-the-theory-of-constraints-and-how-does-it-compare-to-lean-thinking/) that a constraint can be physical or a policy, and that outside the shop floor, constraints such as market demand also exist. He adds that Goldratt argues that most organisations have very few true constraints. That is the practical value: if only one or two limits decide your output, you do not need to improve everything. You keep the focus on the system constraint and leave the rest alone for now.

TOC also changes what you measure. Both Rattner and the encyclopedia entry name three measures: throughput, inventory and operating expense. The entry defines throughput as the rate at which the system generates money through sales, not through production. Rattner summarises the aim as maximising throughput while minimising inventory and operating expense. So a machine that makes parts nobody orders adds no throughput, however busy it is. The entry also describes the thinking processes, a set of logic tools such as the current reality tree and the evaporating cloud, which help to find the root causes behind a problem. They are a topic of their own, and this guide focuses on the focusing steps.

## The five focusing steps

The steps are the heart of the method. The wording below follows the encyclopedia entry, and the explanations add the points made by Rattner and by a [personal web page of Dr. K. J. Youngman](https://www.dbrmfg.co.nz/Bottom%20Line%20Process%20of%20Change.htm) on implementing the theory.

1. **Identify the system's constraint.** Find the one resource, rule or flow that limits output. Often it is a physical [bottleneck](https://www.m365.fm/entity/bottleneck/): the machine in front of which work piles up, and after which work is scarce. In some plants it is a policy, such as a minimum batch rule or a purchasing limit.
2. **Decide how to exploit the constraint.** Get the most out of what the constraint already has. Youngman lists waste such as waiting, over-processing, over-production and defects as typical places to look. Rattner gives an example: reduce the downtime of the bottleneck without expensive upgrades.
3. **Subordinate everything else to that decision.** Every other resource works to the pace of the constraint. Youngman calls this active restraint: non-constraints should not be kept busy with work that is not needed, because that only creates stock.
4. **Elevate the constraint.** Raise its capacity, which may need money or new equipment. Rattner notes that this step applies only if steps two and three are not enough.
5. **Go back to step one, but do not let inertia create a new constraint.** Once a constraint is broken, another resource becomes the weakest link. The cycle starts again, which makes it a form of continuous improvement.

The order matters. It is tempting to jump to step four and buy a machine, when steps two and three may give a similar gain for much less.

## Drum-buffer-rope and buffer management

Drum-buffer-rope (DBR) is the scheduling method that applies steps two and three. The encyclopedia entry describes the parts:

- **The drum** is the constraint. It sets the pace of the whole system.
- **The buffer** is time or stock that protects throughput. Time buffers absorb internal disruptions, and stock buffers help to respond to market demand.
- **The rope** is a release schedule for raw materials, tied to the drum and the buffer. It keeps other resources subordinate by releasing work only at the rate the constraint can use it.

The entry also describes [buffer management](https://www.m365.fm/entity/buffer-management/): the contents of the buffers are used to set priorities for expediting, and the frequency of missing items shows where to improve. So the buffer is not only a safety cushion. It is also a signal. If the same item is often late into the buffer, the cause upstream deserves attention.

In plain terms: do not release more material than the constraint can process, protect the constraint from running out of work, and watch what is missing in front of it.

## Example: a four-station line

This is an illustrative example, not a measured case. A line has four stations with these capacities: cutting 60 parts per hour, forming 55, welding 40 and painting 50. The shift has 8 hours.

**Step 1: identify.** Welding has the lowest capacity, and work piles up in front of it. It is the constraint.

**Step 2: exploit.** Welding should make 40 × 8 = 320 parts per shift, but it makes less. The team looks at the lost time. The welder runs for 7 hours, because the station is idle for the lunch break and waits for parts for 30 minutes. At 40 parts per hour, 7 hours gives 280 parts. Also 10 parts are scrapped because formed parts arrive with defects. Good output is 270 per shift.

The team makes three changes without investment: a relief operator keeps welding running during breaks (30 minutes), a small buffer in front of welding stops it from waiting for parts (15 minutes), and an inspection before welding catches the defective parts (10 parts saved). The welder now runs 7.75 hours, which gives 310 good parts per shift. That is 15 per cent more than before, at almost no cost.

**Step 3: subordinate.** Cutting could make 60 per hour, but welding takes only 40. The rope limits the release of material to the welding rate, plus the buffer. The pile of work in front of welding shrinks, and cutting stops making parts that wait for days.

**Step 4: elevate.** The team adds a second welding fixture, which raises the welding capacity to 52 parts per hour. The line is no longer limited by welding.

**Step 5: repeat.** Painting, at 50 parts per hour, is now the weakest link. It limits the output to about 50 × 7.75 = 388 parts per shift, which is 25 per cent more than after step 2. The team goes back to step 1 with painting.

The numbers are made up, but the sequence is the point: step 2 delivers 15 per cent for almost nothing, and step 4 delivers more but costs a fixture and moves the constraint.

## How TOC and lean fit together

TOC and lean have the same aim, more profit through better flow, but they start differently. Rattner writes that TOC starts by finding constraints, while lean starts by defining customer value and walking the value stream. His summary table says TOC acts locally and lean thinks globally, and the comments under his article show that practitioners dispute this and other points, such as whether TOC is a push or a pull system. Treat the labels with care.

In practice, the two combine well. Rattner argues that TOC can complement lean, especially for choosing where to start and for keeping momentum where bottlenecks cannot yet be removed. A plant can use value stream mapping to see the flow, and the five steps to decide which step to improve first.

## Common mistakes

- **Improving everywhere at once.** Effort spent on a non-constraint adds cost and no output. Find the constraint first.
- **Looking only for machines.** A policy, a supplier or market demand can be the constraint. Check rules and flows too.
- **Keeping non-constraints busy.** High utilisation at a station that is not the constraint only builds stock.
- **Elevating before exploiting.** Spending money on capacity while the constraint idles for 30 minutes per shift wastes it.
- **Stopping after the first success.** Inertia is the fifth step's warning. The next constraint is waiting.
- **Judging stations by local efficiency.** The encyclopedia entry de-emphasises local measures such as efficiency and utilisation in favour of throughput.

## How software can help

A manufacturing execution system shows the actual output and downtime at each station, which helps to confirm the constraint with data instead of opinion. A planning system can release orders at the rate of the constraint. Simulation can test what happens to the whole line if capacity at one station changes, and where the next constraint will appear, before you spend money. The decision about what to change remains with your team.

## Next step

Pick one line, list the capacity of each station per hour, and check where work piles up. Then ask what lost time the constraint has, which is the first step toward the theory of constraints in manufacturing on your own floor.
