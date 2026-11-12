---
title: "Production Simulation for Disruptions and Product Mix Changes"
summary: "Production simulation disruptions: test breakdowns, absences, late material and product mix changes in a model before they hit your line. A practical guide."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [factory-simulation, digital-twin, bottleneck, power-bi, polaris-simulator, polaris-optimizer, ifakt]
keypoints:
  - "A production simulation lets you replay a disruption, such as a breakdown or a shift in product mix, in a model and see the effect on output and lead time before it happens."
  - "Pick disruptions by likelihood and impact from your own records. Modeling every possible event only makes the model slower and harder to trust."
  - "A product mix change can move the bottleneck even when total volume stays the same, because variants use shared machines for different lengths of time."
  - "Because breakdowns are random, run each scenario several times and compare ranges, not a single result."
  - "Check the model against a past period first, and keep a short list of disruption scenarios you rerun whenever the process changes."
faq:
  - q: "What is production simulation for disruptions?"
    a: "It is a computer model of your production system that you run with a disruption built in, for example a machine failure, a missing operator or a delayed delivery. You compare output, lead time and queues with a normal run. The point is to learn which disruptions hurt most and which responses help, before they happen."
  - q: "How do you simulate a product mix change?"
    a: "Keep the model and change the share of each variant in the order stream. Then compare utilization of each machine, queues and lead times with the baseline. Shift the mix in steps to find the point where the bottleneck moves to another resource. Variants need their own process times and setup times in the data."
  - q: "How accurate does a disruption simulation need to be?"
    a: "It needs to be accurate enough for the decision, not perfect. Check that the model reproduces a past period, such as last month's output and lead times, within a gap you and the line team accept. If it can't reproduce the past, don't trust its picture of a disruption."
---

A production simulation lets you replay a disruption in a model: a breakdown at your bottleneck, a missing operator, a late delivery or a shift in product mix. You then see what happens to output and lead time without touching the real line. This article is for production planners who want to know which disruptions to simulate, what data they need and how to read the results.

## What can a simulation show you about a disruption?

A disruption is anything that makes the plan wrong: less capacity than planned, material that isn't there, or demand that looks different from the forecast. A plan answers "what should happen." A [factory simulation](https://www.m365.fm/entity/factory-simulation/) answers "what happens if this goes wrong."

NIST describes discrete event simulation as a way to analyze a production system under [different scenarios and conditions](https://www.nist.gov/node/603446), and to measure throughput, capacity and bottlenecks. The same NIST page names the main obstacle: it is hard to get timely, accurate data on equipment and processes. Keep that in mind, because it decides how far you can trust any result.

The most useful thing a simulation shows is where the pain lands. A stop at one machine rarely hurts only that machine. Work piles up in front of it, starves the stations behind it and delays orders that never touched it. A model makes that chain visible in minutes instead of weeks of firefighting.

It also helps you see that the [bottleneck](https://www.m365.fm/entity/bottleneck/) can move. The Lean Enterprise Institute's introduction to the [theory of constraints](https://www.lean.org/the-lean-post/articles/what-is-the-theory-of-constraints-and-how-does-it-compare-to-lean-thinking/) says that after you act on the constraint, you re-evaluate whether it has shifted to another part of the system. A disruption does the same thing without asking you. Run it in the model first.

## Which disruptions are worth simulating?

Not all of them. Start with a short list and choose by two questions: how often does it happen, and how much does it cost when it does?

Typical candidates:

- Machine stops. Model how often it stops and how long repairs take. Averages hide the long repairs, and those are the ones that hurt. If your maintenance log has real stop durations, use their spread, not just the mean.
- People. Absences, a missing skill on one shift, overtime limits.
- Material. A late delivery, a short delivery, a quality hold on an incoming lot.
- Quality loss. Scrap or rework that sends parts back through a station.
- Rush orders. An urgent order that jumps the queue and forces extra setups.
- Demand shifts. A different share of variants, or a volume jump.

Use your own records to rank them. Look at last year's downtime log, the shift reports and the late-order list. If a disruption shows up there every month, simulate it. If it happened once in five years, write it down and leave it out for now.

## How do you simulate a product mix change?

Product mix is the share of each variant in your order stream. It matters because variants rarely use shared machines for the same length of time. When the mix changes, the load on each resource changes, even if the total number of units stays the same.

A paper from the Winter Simulation Conference on [interactive manufacturing simulation](https://www.informs-sim.org/wsc01papers/129.PDF) shows the effect in a batch furnace area. Products can only share a batch under specific combination rules, so the order of products affects furnace use, and the bottleneck shifts as the mix changes. That's an old paper and a special case, but the lesson holds for most shared resources.

Here is a way to work through it:

1. **Fix a baseline.** Use today's mix and make sure the model reproduces recent output and lead times.
2. **Define the new mix.** Write it as shares of volume, for example "variant B grows from a minority to half of the orders." Decide whether total volume stays flat or grows.
3. **Check the data per variant.** Each variant needs its own routing, process times and setup times. Changeovers between variants often matter more than the run times.
4. **Run the new mix.** Compare utilization by resource, queue lengths and lead time by variant.
5. **Move the mix in steps.** Don't test only the end state. Shift it in a few steps to find the point where the bottleneck moves to another resource or where lead time starts to climb quickly.
6. **Write down what you'd change.** A second shift, a buffer, a different sequence rule, a tool on a second machine. Then test those changes in the same model.

## Example: a back-of-the-envelope check (hypothetical numbers)

This example is invented to show the logic. It isn't a measured result.

A cell has one milling machine. Variant A takes 6 minutes there and variant B takes 10 minutes. Today 70% of the orders are A and 30% are B. The average time per unit is 0.7 × 6 + 0.3 × 10 = 7.2 minutes. In a 450-minute shift, the mill can make about 62 units.

Now the mix moves to 50% A and 50% B. The average becomes 8 minutes, and the same shift gives about 56 units. That's roughly 10% less output from the mix alone, with no breakdown at all.

Add a 45-minute stop. The mill now has 405 minutes, and the shift gives about 50 units. Two harmless-looking changes took about a fifth off the output.

This arithmetic is a good first check, and you should do it before you build any model. What it can't show are queues, setups, batch rules, random stops and the knock-on effect at the next station. That's what the simulation adds.

## What data do the scenarios need?

Disruption scenarios need a few things the normal model may not have. Check this list before you promise results.

- Stop history per machine: how often it stops and how long each stop lasts, taken from the maintenance or downtime log.
- Work calendars and skills: who can run which station, and what happens on a short shift.
- Setup and changeover times between variants, not just run times.
- Order and due-date data, so you can see which orders slip and not only that something slipped.
- The rules the line really follows today: sequence rules, overtime limits, when a job moves to another machine.

If a row is missing, say so in the scenario description. A result built on a guessed stop duration is a guess with a nice chart around it. Ask the line team to review the numbers. They'll often tell you in two minutes which one is wrong.

## How do you run a disruption study?

The steps are the same as for any simulation project, with a few points that matter more for disruptions.

1. **Write the question down.** For example: "If the mill is down for a full shift, which orders miss their date, and what is the cheapest response?"
2. **Validate the baseline.** Compare model output with a past period. If the gap is large, fix the data before you add a single disruption.
3. **Define a small set of scenarios.** Three to five is plenty. Name each one, and write down what changes and for how long.
4. **Run each scenario several times.** Breakdowns are random, so one run can look better or worse than typical. Compare the range of results, not a single number.
5. **Test responses.** Overtime, moving work to another machine, changing the sequence, using stock. A disruption study without response options only tells you that things go wrong.
6. **Agree the decision rule.** Before the run, decide what result would make you act. Otherwise the numbers just get debated.

Keep the scenarios in a short list that you can rerun when the process changes. A scenario library is more valuable than any single study.

## Where do Microsoft tools fit?

Your ERP system is usually where routings, bills of materials and work calendars live. That makes it the natural source for the model's base data. The model itself is usually separate software.

For showing results, [Power BI](https://www.m365.fm/entity/power-bi/) works well for comparing scenarios side by side. Microsoft Learn also documents [what-if parameters](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-what-if): an adjustable variable that report viewers change with a slicer, so the report recalculates. That's useful for simple arithmetic like the example above, such as changing the mix share and seeing a capacity figure move. Microsoft states that these parameters are designed for measures in visuals. They don't simulate queues, so don't mistake a what-if slider for a simulation.

## Common mistakes

- **Simulating everything.** Too many scenarios make the model slow and the results hard to explain.
- **Using average repair times only.** The long stops cause most of the damage.
- **Testing only the end state of a mix change.** The bottleneck often moves along the way.
- **Skipping the baseline check.** If the model can't reproduce last month, its disruption results are guesses.
- **Trusting one run.** With random events, a single run can mislead.
- **Forgetting the people.** Absences, skills and overtime limits belong in the model when the disruption is about staffing.
- **Building a one-off.** A model nobody updates after the next process change is out of date within a few months.

## Where Polaris fits

If your questions are about capacity, staffing, buffers or product mix, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, combining ERP data with a manufacturing digital twin. The [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) module tests the production system virtually, including capacity, staffing and buffer scenarios and dynamic product mixes on shared resources. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module detects bottlenecks and, when disruptions occur, analyzes their impact and re-optimizes the plan. Whether it fits depends on your data and your question, so try it on one narrow case first.

## Related topics to explore

- **Feeding the model with live data.** A [digital twin](https://www.m365.fm/entity/digital-twin/) keeps the model connected to the plant. Decide first whether your decision needs a live feed or only a good model.
- **Modeling human response.** Delayed reactions and shift changes change how long a disruption lasts, so add them when staffing is part of the question.
- **Recovery and restart.** After the disruption ends, the backlog hits the line. Simulate the restart, including overtime limits.
- **Closing the loop with planning.** Once a disruption is real, the schedule has to change. Think about how the result of a simulation feeds the re-plan.

## Next step

Production simulation disruptions are easiest to handle if you start from your own downtime log. Pick the one disruption that cost you the most last year, write it as a one-sentence scenario with duration and affected resource, and test it in a model, even a rough one, before the next planning meeting.
