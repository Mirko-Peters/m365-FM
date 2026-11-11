---
title: "How to Find and Fix Bottlenecks on the Shop Floor"
summary: "Bottleneck analysis finds the one step that limits plant output. Learn to spot it, measure it and apply the five focusing steps of the theory of constraints."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [bottleneck, polaris-analyzer, finite-capacity-scheduling]
keypoints:
  - "A bottleneck is the resource that limits the output of the whole system. Every hour lost there is an hour lost for the plant."
  - "You find a bottleneck by looking for the highest utilization, the longest queue in front of a station and the station that downstream steps wait for."
  - "The theory of constraints gives five focusing steps: identify, exploit, subordinate, elevate and prevent inertia."
  - "Exploit the bottleneck first with no new investment: keep it running through breaks, changeovers and material shortages."
  - "After you fix one bottleneck, the limit moves to another step. Measure again and treat it as a continuous routine."
faq:
  - q: "What is a bottleneck in manufacturing?"
    a: "A bottleneck is the step or resource whose capacity limits the output of the whole production system. Work queues up in front of it, and steps after it wait for material. Raising output anywhere else does not raise plant output. Only a gain at the bottleneck does."
  - q: "How do you identify a production bottleneck?"
    a: "Compare each step's capacity with the demand placed on it. The bottleneck usually shows the highest utilization, the longest queue of waiting work in front of it and idle time at the steps after it. Confirm it by watching for a full shift, and check that the pattern holds on different days and products."
  - q: "Can a plant have more than one bottleneck?"
    a: "At any moment one resource usually limits the system, although the limiting resource can change with the product mix, the shift or the day. Plants with varied products often see different bottlenecks for different orders. Analyse the main product families separately, and remeasure after each improvement."
---

A [bottleneck](https://www.m365.fm/entity/bottleneck/) is the step in a process that limits the output of the whole plant. Bottleneck analysis is the work of finding that step, measuring how much it loses and acting on it first. This article is for plant managers who want more throughput and production capacity without more people or machines. It shows how to spot a production bottleneck, how to apply the theory of constraints in five steps, and how to avoid the usual traps.

## What is a bottleneck, and why does it decide your output?

Think of a pipe made of sections with different widths. The flow of water is set by the narrowest section. A production line works the same way. If the saw cuts 60 parts per hour and the paint booth finishes 40, the line delivers 40. The paint booth is the bottleneck.

The Theory of Constraints (TOC) builds on this idea. The Lean Enterprise Institute lexicon [describes TOC](https://www.lean.org/lexicon-terms/theory-of-constraints/) as a management philosophy and set of tools for organizational change developed by the physicist Eliyahu Goldratt and popularized in his 1984 book *The Goal*. It focuses on identifying and managing the factors that keep a company from reaching its goals, with the aim of increasing throughput. Throughput here means the output rate of the whole system. It is not the speed of any single machine.

Two consequences matter on the shop floor:

- **A minute lost at the bottleneck is a minute lost for the plant.** The same minute lost at a non-bottleneck step usually costs nothing, because that step has spare capacity.
- **Improving a non-bottleneck does not raise output.** It only builds more work in progress in front of the real bottleneck.

This is why a plant can buy a faster machine and see no change in shipments. The money went to the wrong place.

## How do you conduct a bottleneck analysis?

To identify bottlenecks reliably, look for evidence from three directions, and trust a result only when they agree. You are reading the workflow of the plant, so start from what you can see.

1. **Capacity utilization.** Compare each station's load with its available time. The bottleneck usually runs closest to 100% and has little slack.
2. **Queues.** Walk the floor and look at where work waits. A stack of parts in front of one station is the strongest visual sign.
3. **Starvation.** Look at the steps after the suspected bottleneck. If they often stand idle waiting for parts, the bottleneck sits upstream of them.

Then confirm with a simple data check:

1. Start the mapping: draw the process flow for one product family, from release to shipping, so you see every step and its routing.
2. For each step, write down the net time per unit, including the loading and unloading you actually see, and the time available per shift.
3. Calculate capacity per shift: available minutes divided by minutes per unit.
4. Compare capacity with the demand per shift. The step with the lowest capacity is the candidate.
5. Watch it for a full shift. Note every stop: waiting for material, waiting for a person, a breakdown, a changeover, a quality check. Use root cause analysis, such as asking why five times, on the biggest stop. Fix the cause, not just the symptom.

Do not trust a single day. Repeat the check on another shift and another product. If a different step limits output on different days, you have a moving bottleneck. Handle each product family separately. Data collection can start with a clipboard and a stopwatch. Later, production data from your systems makes the analysis repeatable and saves manual analysis.

Go to the gemba to check the figures. Gemba is the Japanese word for the place where the work is done. A machine can look slow in the data because an operator logs breaks incorrectly. The floor shows the real cause. Ask the supervisor and the operators too. Their view helps you make informed decisions.

## What are common causes of a production bottleneck?

A manufacturing bottleneck can appear in any of the production processes, at any process step, including inspection and packing. Teams that identify constraints early avoid production delays. Most bottlenecks fall into a few groups. Knowing them shortens the search and improves resource allocation.

- **Slow cycle time.** The machine or manual step simply takes longer per piece than its neighbours.
- **Uneven workload.** Work piling up in front of a station is the visible sign.
- **Downtime.** Breakdowns, small stops and waiting for repair cut the effective capacity of a station.
- **Changeovers.** Long setups remove hours of production time each week.
- **Material and tool shortages.** The station waits for parts, fixtures or documents.
- **Staffing and skills.** Only one person can run the step, so breaks and absences stop it.
- **Quality loops.** Rework and inspection send parts through the same step twice.
- **The production schedule.** A plan that ignores limited capacity creates a bottleneck where none existed.

## How do you fix a bottleneck? The five focusing steps

The Theory of Constraints Institute lists [five focusing steps](https://www.tocinstitute.org/five-focusing-steps.html). It states that the output of the constraint governs or restricts the output of the organization as a whole, and that most systems typically have a single resource constraint, such as a machine or department. The steps are:

1. **Identify** the system's constraint.
2. **Exploit** the constraint. Get the most out of what you already have.
3. **Subordinate** everything else to the constraint.
4. **Elevate** the constraint. Add capacity only when steps two and three are not enough.
5. **Prevent inertia** from becoming the constraint. When the constraint moves, go back to step one.

In practice, the order matters because it puts cheap actions before expensive ones.

**Exploit** means the bottleneck never waits for anything. Typical actions:

- Keep it running during breaks and shift changes by staggering operators.
- Prepare material, tools and documents before the previous job ends.
- Move quality checks off the bottleneck, or check before the work reaches it, so it does not process parts that are already defective.
- Do changeovers while other work is still running where you can. The quick changeover method SMED, short for Single-Minute Exchange of Die, moves setup work outside the machine's stop time.
- Run the bottleneck on the jobs with the highest value per minute of its time.

**Subordinate** means the rest of the plant follows the pace of the constraint. Release work to the floor at the rate the bottleneck can process it. This limits the work in progress and shortens lead time. Capacity planning must use the real capacity of the bottleneck, not its rated speed. Plans that respect limited capacity, often called [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/), put this rule into the schedule.

**Elevate** comes last. Add a shift, a second machine or a faster process only after the first three steps are used up. A new machine bought before step two is often a machine bought for a problem that discipline would have solved.

## Example: one cell with four steps

This is an illustration with made-up numbers.

A cell makes pump covers in four steps, working 450 productive minutes per shift. Net times per piece are: sawing 1.5 min, milling 3.0 min, deburring 2.0 min, washing 1.0 min.

Capacity per shift is 450 divided by the time per piece:

- Sawing: 450 / 1.5 = 300 pieces
- Milling: 450 / 3.0 = 150 pieces
- Deburring: 450 / 2.0 = 225 pieces
- Washing: 450 / 1.0 = 450 pieces

Milling is the bottleneck. The cell can make 150 pieces per shift, however fast the saw is. Watching the mill for a shift shows it stops for 40 minutes: 25 minutes waiting for the next job's material and 15 minutes for tool changes.

The team exploits the mill first. They stage the material beside the machine and do the next tool preset while the current job runs. Together this gives back 35 of the 40 lost minutes. Mill capacity rises from 450 / 3.0 = 150 to (450 + 35) / 3.0 = 161.7, about 161 pieces. That is roughly 7% more output with no investment. The saw now sits with spare time, so the team releases material to the saw at the pace of the mill. Deburring, at 225 pieces, is still well above the mill. The bottleneck stays at the mill until it reaches that level.

## How do you keep the improvement and watch for the next one?

When you lift one bottleneck, another step becomes the limit. This is the goal of the fifth step. Treat each fix as process improvement work, and make bottleneck analysis part of your culture of continuous improvement:

- Track output, stops and queue length at the bottleneck every shift and show them at the cell board.
- Review the numbers in the daily meeting. A drop at the bottleneck gets a response the same day.
- Optimize one bottleneck at a time and re-run the capacity analysis after each change in products, staffing or equipment.

Data helps here, together with a few KPIs such as output per shift, stop minutes and queue length. A regular bottleneck analysis with a planned-versus-actual comparison for each station shows where overall performance falls short and for how long, and lets you separate a real bottleneck from a one-off problem.

## Common mistakes

- **Improving the busiest-looking machine.** A machine that runs all day is not always the bottleneck. It may be running work nobody needs yet.
- **Judging by machine speed alone.** The step with the lowest capacity after all stops, setups and waits is the bottleneck, not the step with the lowest rated speed.
- **Starting with new equipment.** Exploit the bottleneck with what you have before you buy anything.
- **Letting the bottleneck wait.** One missing tool or one late forklift can stop the whole plant's output.
- **Releasing too much work.** Feeding the floor faster than the bottleneck can process only builds queues and lengthens lead time.
- **Analysing once.** Constraints move with product mix and after every improvement.

## How software can help

A bottleneck is easy to see in one cell and hard to see in a plant with many products. Software can compare planned and actual values by station and show where the shortfall is largest. iFAKT's [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) provides KPI dashboards across all modules that compare planned and actual values in production. Use such a view to choose where to look. Then go to the floor and confirm the cause.

## Next step

Choose one product family and calculate the capacity of each step this week, using net times you have watched yourself. Then start your bottleneck analysis at the lowest-capacity step by writing down every minute it stops for one full shift.
