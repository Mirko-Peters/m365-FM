---
title: "Manufacturing Simulation KPI Tracking: Compare Scenarios Fairly"
summary: "Manufacturing simulation KPI tracking starts with a few KPIs defined like your plant defines them. Learn how to run scenarios, read results and report them."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [factory-simulation, oee, power-bi, polaris-simulator, polaris-analyzer, ifakt]
keypoints:
  - "Simulation KPI tracking means choosing a few KPIs before the model is built and computing them exactly as the plant computes them."
  - "ISO 22400-2 shows the discipline: each KPI is described by its formula, its elements, its time behavior and its unit."
  - "A single simulation run is one sample, so use several replications and report an average with a confidence interval."
  - "Change one thing per scenario, compare scenarios on the same KPI definitions and check the baseline against a real past period first."
  - "Simulation results are not live, so a dashboard fed by them must be refreshed after each batch of runs and labelled by scenario."
faq:
  - q: "Which KPIs should I track in a manufacturing simulation?"
    a: "Pick the few that answer your decision. Typical choices are throughput, lead time, work in process, resource utilization and on-time delivery. Add OEE only when equipment is the limit. Define each one with a formula, a time basis and a unit, and use the same definition in the plant."
  - q: "How many simulation runs do I need?"
    a: "More than one. Each run is a random sample, so run several independent replications and report the average with a confidence interval. Keep adding replications until the interval is narrow enough for your decision. For steady-state questions, discard the warm-up period at the start of each run."
  - q: "Can I show simulation KPIs in Power BI?"
    a: "Yes. Export the results as a table with scenario, replication and KPI columns, and load it into a Power BI semantic model. Imported data is a point-in-time copy, so refresh the model after new runs. Label every visual with the scenario so nobody mistakes forecasts for live plant data."
---

Manufacturing simulation KPI tracking means picking a small set of performance indicators before you build the model, computing them in the model exactly as your plant computes them, and comparing scenarios on those numbers. If the definitions differ between model and plant, the results can't be trusted, however good the dashboard looks. This article is for plant managers and process engineers who run simulation studies, or who have to read the results and decide on them.

## What is manufacturing simulation KPI tracking?

A simulation model produces a lot of raw output: every part, every wait, every machine state over simulated time. KPI tracking turns that output into a handful of numbers that people can compare. Where [factory simulation](https://www.m365.fm/entity/factory-simulation/) answers "what happens if we change this?", the KPIs say how much, in terms the plant already uses.

There are two ways this goes wrong. In the first, the team measures what is easy to get from the model software and ends up with figures nobody in the plant recognizes. In the second, the team copies a long KPI list from a dashboard template, and the study drowns in numbers that don't relate to the decision.

The fix is the same in both cases. Start from the decision, such as "do we add a second shift on the assembly line or buy a second machine?", and ask which numbers would make you choose one option over the other. Those are your KPIs.

## Which KPIs belong in a simulation study?

Keep the list short. Five to seven is plenty. These are common choices, and which ones matter depends on your question:

1. **Throughput.** Good units out per hour, shift or week.
2. **Lead time.** How long an order or a part takes from release to completion.
3. **Work in process (WIP).** How much is in the system at a given time. It often moves together with lead time.
4. **Resource utilization.** How much of the available time machines and people are busy. Look at the bottleneck and at the resource next to it.
5. **Waiting time and queue length** in front of the bottleneck.
6. **On-time delivery,** if the model includes due dates.
7. **OEE,** if equipment losses are the limit.

On OEE, be specific. The Lean Enterprise Institute describes [overall equipment effectiveness](https://www.m365.fm/entity/oee/) as a total productive maintenance metric that multiplies availability, performance and quality rates, and says it usually targets the six major losses: failures, adjustments, minor stoppages, reduced speeds, scrap and rework. OEE only makes sense in a simulation if the model contains those losses, such as breakdown behavior, changeovers and scrap rates. If it doesn't, an OEE figure from the model is a guess with a decimal point. On a mixed-product line with a long changeover, OEE can also hide what drives cost and delivery, so pair it with lead time or on-time delivery.

Resist KPIs that the model can't influence. If your scenarios change the shift pattern, a customer satisfaction score has no place in the study.

## How do you define KPIs so that the model and the plant agree?

Write a one-page KPI sheet before the first run. For each KPI, state:

- the name and the question it answers,
- the formula and its elements,
- the time basis, for example per shift, per calendar week or per planned production hour,
- the unit,
- where the real value comes from in the plant,
- who owns the definition.

This is the discipline that standards in this area follow. The ISO page for [ISO 22400-2](https://www.iso.org/standard/87563.html), which defines key performance indicators for manufacturing operations management, says each KPI is described by its formula and elements, its time behavior, its unit or dimension, its user group and the production methodology it belongs to. The page I read describes the draft of the second edition that will replace the 2014 version, so check the current edition if you plan to cite the standard. You don't have to adopt the standard to benefit from its habit: one precise definition per KPI.

Most disagreements come from time. "Availability" changes with the answer to "available out of what?". LEI's description of OEE measures downtime from breakdowns and changeovers relative to scheduled time, so scheduled time must be clearly defined in your sheet. Does it include planned maintenance? Breaks? A shift that the calendar says is off? Settle this before the model is built, because it changes every result.

Then do the check that gives the sheet its value: compute the same KPIs from a real past period using plant data, and compare them with what the model produces when you feed it that period.

## How do you run scenarios and read the results?

A simulation run is a random sample. Breakdowns, arrival times and processing times vary, so two runs of the same scenario give two different answers. Treat a single run as an anecdote.

1. **Validate the baseline.** Run the model for a period you know, and compare the KPIs with reality. If the model can't reproduce the past within a range you accept, fix the model before you test any change.
2. **Use replications.** Run each scenario several times with independent random streams. A MIT lecture on [simulation experiment design](https://ocw.tau.edu.ng/courses/sloan-school-of-management/15-066j-system-optimization-and-analysis-for-manufacturing-summer-2003/lecture-notes/lec20_experiment_design.pdf) describes setting the number of replications by a precision target: you keep going until the confidence interval is narrow enough relative to the estimate. It also notes that with fewer than 30 replications you use the Student-t distribution for the interval.
3. **Handle warm-up.** For a plant that runs continuously, the model starts empty and needs time to reach normal operation. The same lecture describes discarding the first part of each replication and mentions Welch's method for choosing how much to discard. If your question is about a defined period, such as one order batch, start the model in the state the plant has at that time.
4. **Change one thing per scenario.** If scenario B adds a machine and changes the shift pattern and the batch size, you won't know which one did what.
5. **Report ranges.** "Throughput rises by 4% to 9%" is more honest than "rises by 6.5%". If the intervals of two scenarios overlap heavily, say that the data doesn't separate them.
6. **Look at the whole stream.** A gain at one machine can push the bottleneck somewhere else. Check utilization and queues along the flow, not only at the station you changed.

Keep the scenario register: a list with the scenario name, what changed, the assumptions, the number of replications and the date. Without it, nobody remembers in six months why scenario 7 was chosen.

## How do you show simulation KPIs to managers?

Managers need the comparison, not the raw output. A simple page works: baseline and each scenario side by side, for the same few KPIs, with the range, and a note on what each scenario changes.

In a Microsoft environment, a common route is a results table loaded into [Power BI](https://www.m365.fm/entity/power-bi/). Each row carries the scenario, the replication, the KPI name and the value, which lets you build the comparison and filter by scenario. Microsoft's documentation on [data refresh](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data) explains that imported data in a semantic model is a point-in-time copy, so you need to refresh it to see new data. For simulation results this fits well: you refresh after a batch of runs, and not before.

Two practical points follow:

- Mark every visual as a scenario result, with the date of the last run. Forecast numbers sitting next to live plant numbers invite misreading.
- Show planned versus actual later, when the change is in place, using the same KPI definitions. That's where the KPI sheet pays back.

If you want a live view of the plant next to the model, that's a separate job with its own data feed. Treat it as the next phase, once the simulation KPIs are trusted.

## How do you keep the model honest over time?

A model that's right in March can be wrong in September, because the process moved on.

- **Recalibrate.** Compare model KPIs with actual KPIs every quarter, or after any major change, and adjust the inputs if they drift.
- **Own the inputs.** Cycle times, setup times, failure behavior and shift calendars need a named owner who updates them. Treat the simulation data like a product that has a maintainer.
- **Include people where it matters.** Operators change results through absence, skill and variation in work pace. You don't need to model fatigue to see this: using realistic variation in cycle times and the real staffing per shift gets you most of the way. Ask the shift leads whether the model's assumptions look right.
- **Revisit the targets.** Don't carry a benchmark from another plant into your model without asking if it fits your product mix. Use your own baseline first.

## Common mistakes

- **Starting with the dashboard.** Decide the KPIs and the question first.
- **Too many KPIs.** A page with twenty numbers won't be read.
- **Different definitions in model and plant.** Then no comparison is possible.
- **One run per scenario.** Randomness will decide your conclusion for you.
- **Skipping the baseline check.** If the model can't reproduce the past, its forecasts have no basis.
- **Changing several things per scenario.** You learn nothing about cause.
- **Showing forecasts as live data.** Label scenario results clearly.
- **No owner for the model inputs.** Old inputs produce confident wrong answers.

## Where Polaris fits

For this kind of study, iFAKT Polaris offers two modules to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes the [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) as a tool that tests the production system virtually before real decisions, with capacity, staffing and buffer scenarios, and shows bottlenecks and utilization imbalances over time. The [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) provides KPI dashboards across the modules and compares planned and actual values. As with any tool, check that the KPI definitions in it match yours, and try it on one line first.

## Related topics to explore

- **Hierarchies of KPIs.** How line, shift, department and plant values roll up without recalculating at every level.
- **Data sources for the model.** Which ERP, machine and manual data feed the model, and how to check their quality.
- **Normalizing across plants.** How to compare sites with different automation levels without penalizing high-mix plants.
- **Workforce variation in models.** Which operator and shift effects are worth modeling, and which add complexity without benefit.
- **From plan to actual.** How to compare the chosen scenario with real KPIs after the change goes live.

## Next step

Manufacturing simulation KPI tracking pays off when the model and the plant speak the same numbers. Take your next simulation question, write the KPI sheet on one page with formula, time basis and unit, and check it against a real past period before you run the first scenario.
