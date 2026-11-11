---
title: "Simulation Model Data: Where It Comes From and How Good It Must Be"
summary: "Data for a simulation model comes from systems, measurements and experts. See the sources, the usual quality gaps and how good simulation input data must be."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [factory-simulation, polaris-designer, manufacturing-execution-system]
keypoints:
  - "A simulation model needs products and routings, process times, resources, stops, orders and staffing rules; each item comes from a system, a measurement or an expert."
  - "Data comes from primary sources, such as stopwatch studies and observation, and from secondary sources, such as ERP, MES and CAD systems and forecasts."
  - "Typical gaps are preset ERP times that differ from actual times, duplicate records, data that lags reality and missing variation."
  - "Inputs must be good enough for the question: check which inputs change the result most and spend your effort there."
  - "Use distributions and actual records, not only averages, because variation creates the waiting time you want to test."
faq:
  - q: "What data do you need for a simulation model?"
    a: "You need the products and their routings, process and changeover times, resources and their availability, stops and failures, orders and demand, and shift and staffing rules. Collect the variation of times and stops, not only the average, because variation causes queues and waiting."
  - q: "Where does simulation input data come from?"
    a: "From primary sources, such as stopwatch studies and observation on the line, and from secondary sources, such as ERP, MES and CAD systems, forecasts and expert judgement. System data is cheaper but must be checked against the shop floor, because preset values often differ from actual ones."
  - q: "How accurate must simulation data be?"
    a: "Accurate enough for the decision. Test which inputs move the result most, and measure those carefully. For inputs with little effect, an expert judgement is enough. Check the model against output of the real line to see whether the inputs are good enough."
---

The data for simulation model building comes from three places: business and shop-floor systems, direct measurement, and the people who know the line. How good it must be depends on the question, not on a general standard. This guide is for continuous improvement managers who are asked to supply the data for a [factory simulation](https://www.m365.fm/entity/factory-simulation/). You will learn what the model needs, where each item comes from, what usually goes wrong, a worked example with numbers and a six-step plan to get data that is good enough.

## Data for simulation model building: what the model needs

A flow model of a line needs six kinds of input. This list is our own summary of common practice, not a standard.

- **Products and routings.** Which product visits which station, and in which order.
- **Times.** Process time per product and station, changeover times, and the variation of both.
- **Resources.** Machines, tools and people, their capacity and their availability, including failures and planned stops.
- **Orders and demand.** Order sizes, mix and arrival pattern, from the order book or from a forecast.
- **Rules.** Shift model, break times, sequencing and batch rules, and how operators move between stations.
- **Quality.** Scrap and rework rates, and where defects are found.

It does not need every number in the plant. It needs the numbers that the question depends on, and it needs the variation, because variation creates the waiting that you want to simulate and test. A model can only predict what its data allows.

## Where simulation input data comes from: data collection in practice

A paper by Maja Bärring and colleagues at the [2018 Winter Simulation Conference](https://www.informs-sim.org/wsc18papers/includes/files/057.pdf) describes the sources in two groups, following earlier work by Anders Skoogh and colleagues.

- **Primary data** is gathered for the study: measurements, stopwatch studies and observation on the line.
- **Secondary data** already exists. It includes external references such as industrial standards and domain experts, corporate business systems such as ERP, MES, PDM and CAD, and project-specific data such as production volume forecasts.

For a continuous improvement manager, the data collection looks like this in practice. The [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) holds actual cycle times, stop events and quantities by station. The ERP holds orders, routings and planned times. The CAD or PDM system holds product structure. Shift plans sit with planning or HR. Changeover times and the way operators really work are often found only by observation and by asking the shift leaders.

## Why the data is often not good enough

Bärring and colleagues studied two case companies with five interviewees, so the findings are indicative, not general. In the case that collected data manually from ERP and spreadsheets, they report problems that many plants will recognise:

- Preset ERP values were used in place of actual times, so it was unclear which times to use.
- The same item was stored in both the ERP system and in spreadsheets.
- Labels were inconsistent, and departments differed.
- Reality changed, but the system did not.

The authors also note that ERP systems emphasise deterministic values over stochastic ones, so the variation that a simulation needs is often missing. In the second case, automatic acquisition avoided five of the eight challenges they list. The paper recommends, among other things, assigning ownership of the data to functions within the company. A survey by Skoogh, Perera and Johansson in [Simulation Modelling Practice and Theory](https://research.chalmers.se/publication/166418) found that around 80 per cent of simulation users still rely on highly manual work procedures for input data.

## Routing and bill of materials in a simulation

Two kinds of master data often cause trouble. The routing says which operations a product needs, in which order, on which resource and with which time. The bill of materials says which parts go into the product. For a flow model, the routing is usually the backbone, and the bill of materials matters when parts can be missing or when a station waits for an assembly.

Routings in the ERP are often planning values, set once and rarely updated, which is the problem Bärring and colleagues describe. Before you load a routing into a model, compare its times with actual times from the MES for the same product and station. Check that the sequence of operations still matches the shop floor, and that the bill of materials shows the variants you really build. Do not fill a gap with simulated data, also called synthetic data, and forget to label it.

## How good must simulation data quality be?

The answer is: good enough for the decision. Averill Law, in his paper on [pitfalls in simulation modelling](https://informs-sim.org/wsc24papers/inv198.pdf), asks for records of input distributions and for validation, and he recommends collecting data on all possible sources of system randomness if at all possible. He warns about two errors: replacing a random input with its average, which in his example removes the queue entirely, and choosing a normal distribution out of habit, which in one of his examples gave an output error of 39 per cent.

A practical way to decide how much effort to spend is to rank the inputs by their effect and by the uncertainty of each parameter. Law also recommends sensitivity analysis to see which factors affect the performance measures most. This grading is our own planning aid, not a standard:

1. **Grade A: measured and checked.** Use it for inputs that move the result most, such as the cycle time at the bottleneck and the stop pattern before it.
2. **Grade B: taken from a system and checked on a sample.** Use it for inputs with a medium effect.
3. **Grade C: expert judgement.** Use it for inputs with little effect, and write down the assumption.

Finally, check the whole set by validation: does the model reproduce the output of the real line? If it does not, look first at the grade A inputs.

## Example: routing time against actual time

This is an illustrative example with assumed numbers, not a measured case. A line makes one product. The ERP routing says 42 seconds per part at the bottleneck station. The MES shows a median actual cycle time of 47 seconds over four weeks.

- Output per hour with the routing time: 3,600 ÷ 42 = 85.7 parts.
- Output per hour with the actual time: 3,600 ÷ 47 = 76.6 parts.
- The routing overstates the rate by 85.7 ÷ 76.6 = about 12 per cent. Over an 8-hour shift, that is about 686 against 613 parts, a gap of 73 parts.

A model fed with the routing would make a prediction that the line has never reached, and any improvement measured against it would look worse than it is.

The same logic applies to stops. Suppose the MES records seven stops with durations of 2, 3, 3, 4, 5, 6 and 40 minutes. The sum is 63 minutes, so the mean is 9 minutes, while the median is 4 minutes. A model with a constant stop of 9 minutes never shows the 40-minute stop that empties the buffer, and it shows more medium stops than the line really has. Plot the recorded durations, calculate their spread, and use them directly or a statistical distribution fitted to them. Estimate its parameters from the records.

## Using data well: a plan in six steps

1. **List the questions.** The question decides which inputs you need.
2. **List the items** in the six groups above, and mark which ones the question depends on most.
3. **Name source and owner** for each, for example the MES for stops, the ERP for orders, an observer for changeovers.
4. **Compare sources.** Check routing times against the MES, and check that identifiers and units match between systems.
5. **Measure the gaps** with the grade A method for the inputs that matter, and record assumptions for the rest.
6. **Validate and keep the data.** Compare the model with the real line, store the set with a date, and name an owner to update it.

## Common mistakes

- **Loading the ERP routing without a check.** Planned values are not actual values.
- **Using only averages.** Each input is a variable with a spread, not a single number. Variation creates the waiting time, and the average removes it.
- **Collecting everything.** Effort without a question wastes time that the project does not have, and the sheer volume hides what matters.
- **Mixing definitions.** A stop, a changeover or a cycle may mean different things in different systems.
- **No owner.** Figures that nobody maintains are out of date at the next change.
- **Skipping validation.** Without a comparison with the real line, you do not know if the inputs are good enough.

## How software can help

A knowledge graph that links products, process steps and resources can reduce duplicate and conflicting data, because each fact is stored once. [iFAKT's Polaris Designer](https://www.m365.fm/entity/polaris-designer/) is a module of iFAKT Polaris that builds a product-process-resource (PPR) knowledge graph as the single source of truth for products, process steps and resources. It does not replace the check against actual times, the owners or the validation of the model. Whatever tool you use, ask how it imports data from your ERP and MES, and how changes are tracked.

## Next step

Take the bottleneck station of one line and compare the routing time in the ERP with the actual cycle time in the MES over the last four weeks. If they differ, you have found the first gap in the data for simulation model building, and you know where to start.
