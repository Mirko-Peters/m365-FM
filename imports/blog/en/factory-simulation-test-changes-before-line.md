---
title: "Factory Simulation: How to Test Changes Before You Touch the Line"
summary: "Factory simulation lets production managers test a new shift, machine or buffer in a model first. Learn when it pays off, what data you need, how to run it."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [factory-simulation, polaris-simulator, bottleneck, digital-twin]
keypoints:
  - "A factory simulation is a controlled model of how work moves through part of a plant, so a change can be tested in the model before it is made on the line."
  - "Most tools use discrete event simulation, which models timed events and captures randomness such as breakdowns, changeovers and demand swings."
  - "Simulation adds the most value when a decision is complex, costly or hard to reverse, such as a new machine, a new layout or a new shift pattern."
  - "A model must be validated against known behavior, for example last month's output, before anyone trusts its what-if results."
  - "Start with one business question and a small scope, then refine the model as you learn."
faq:
  - q: "What is factory simulation?"
    a: "Factory simulation is a virtual model of a production system, such as a line, a cell or a hall, that you run on a computer to see how work flows. It uses resources, rules, orders and normal variation. You change an input, such as a shift pattern or a buffer size, and compare the results before you change the real line."
  - q: "What is discrete event simulation in manufacturing?"
    a: "Discrete event simulation models a system as a series of timed events, such as a part arriving, a process starting, a process ending or a machine failing. Because it handles randomness and queues, it suits production. It shows waiting times, utilization and throughput, which a simple spreadsheet with average values cannot show."
  - q: "How accurate does a factory simulation have to be?"
    a: "It does not have to be perfect, but it must be fit for its purpose. Check it by running it on a period you know, such as last month's orders, and compare output, queues and utilization with what really happened. If the gap is small enough for the decision at hand, the model is good enough to use."
---

Factory simulation means building a model of part of your plant and running it on a computer, so you can see what a change would do before you make it on the line. This article is for production managers who face decisions like an extra shift, a new machine or a smaller buffer, and want evidence first. You will learn what a simulation can answer, which data it needs, how to run a study in steps, and how to avoid the usual mistakes.

## What can you test with a simulation?

An overview from Autodesk describes factory simulation as a virtual model of a manufacturing system used to analyze, test and optimize how production behaves. Models can cover a production line, workstations, material flow and buffers, labor, machines and variability such as downtime, changeovers and demand swings. Read the [Autodesk guide to factory simulation basics](https://www.autodesk.com/blogs/design-and-manufacturing/factory-simulation-basics-how-manufacturers-use-simulation-to-design-better-production-systems/).

The same article lists typical uses:

- designing a new line or facility
- capacity planning and throughput analysis
- finding the [bottleneck](https://www.m365.fm/entity/bottleneck/) and reducing work in process
- labor and shift planning, including resource allocation
- factory layout changes, automation and expansion

Simulation helps you analyse the manufacturing process and the workflow of orders without guesswork. The overview adds that simulation brings the most value when decisions are complex, costly or hard to reverse. That matches shop floor experience. Moving a machine, buying a second one or changing a shift pattern is expensive to undo, so a test in the model is cheap by comparison, and it is a risk-free way to identify bottlenecks and to optimize the setup. Good manufacturing simulation software enables this kind of what-if work in a virtual environment, from factory planning to the daily optimization of the process flow.

A [factory simulation](https://www.m365.fm/entity/factory-simulation/) is a controlled model of how work moves through part of a factory. It uses current operating rules, resources, orders and normal variation, so that you can try a change in the model first. The key word is controlled: you change one thing at a time and compare the results. When a model like this is fed with current data from the shop floor, it moves toward a [digital twin](https://www.m365.fm/entity/digital-twin/) of the plant, but a first study does not need live data.

## Why do averages mislead, and what is discrete event simulation?

A spreadsheet works with averages, and cycle times in it are single numbers. Real lines do not. Machines stop, changeovers take longer on some days and orders arrive in clumps. These effects make queues grow and output fall, even when the average capacity looks sufficient.

Most tools use discrete event simulation. According to the same overview, it models a system as a sequence of timed events, such as part arrivals, process starts and completions, and breakdowns. It suits manufacturing because it captures randomness and variability, tracks queues, waiting times and utilization, and shows how people, machines and materials interact.

The practical consequence: simulate the same change many times with different random numbers and look at the range of results, not one number. A line that reaches its target in one run and misses it in the next is a risk, even if the average looks fine.

## What data does a simulation need?

You need enough data to describe how the line really works. Start with this list:

1. **Flow.** The route of each product through stations, the order of steps and the buffers between them.
2. **Times.** Cycle times, setup and changeover times, and their spread, not only averages.
3. **Resources.** Machines, workers, tools and their shift calendars.
4. **Losses.** Breakdown frequency and repair time, scrap and rework.
5. **Demand.** Order sizes, due dates and product mix, for example from the last few months of the production schedule.
6. **Rules.** How jobs are chosen, how batches are formed and how people are assigned.

The overview advises using realistic data where available and refining it over time. Do not wait for perfect data. A first model with honest estimates, marked as estimates, is better than no model. But note which inputs are weak, because they limit how far you can trust the answer.

## How do you run a factory simulation study?

A published case shows the main steps. A paper from the Winter Simulation Conference describes a discrete event study at a home-appliance manufacturer, where the task was to sort appliances downstream of an assembly line and to schedule manually operated clamp trucks. The team tested seven scenarios and found that changing the pickup logic reduced the required fleet from eight trucks to five in the best scenarios. See the [Winter Simulation Conference paper](https://www.informs-sim.org/wsc07papers/232.pdf). Treat this as one example of what a study can look like, not as a benchmark for your plant.

The steps below follow the same logic:

1. **Write the question.** For example, "Does a second operator at finishing let the cell meet 130 units per day?" A clear question keeps the model small.
2. **Define scope and measures.** Which stations, which products, which output measure: throughput, lead time, utilization or queue length.
3. **Collect data.** Use the list above. Mark estimates.
4. **Build the model.** Start simple and add detail only where it affects the answer.
5. **Verify.** Check that the model does what you intended. In the paper, the team used runs with randomness removed, single-item runs and animation checks.
6. **Validate.** Compare the model with reality. In the same study, the model reproduced the client's current practice, and under a no-breakdown assumption it matched the team's spreadsheet estimate. The overview likewise says to check against known or historical behavior.
7. **Experiment.** Run each scenario with a warm-up period and several replications. The paper used a five-day warm-up, twenty days of data and twelve replications per scenario.
8. **Decide and review.** Pick the option, make the change and compare real results with the forecast. Use the difference to improve the model.

## Example: three options for a finishing cell

This example uses assumed numbers.

A cell has two machining machines, each needing 6 minutes per unit, and one manual finishing station run by one operator, needing 4 minutes per unit. The shift has 7.5 productive hours. Planning needs 130 units per day.

**Capacity per hour:**

- Machining: 2 machines × 60 ÷ 6 = 20 units
- Finishing: 60 ÷ 4 = 15 units

Finishing is the bottleneck. Baseline output is 15 × 7.5 = **112.5 units per day**, which is 17.5 short.

**Option A: a second finishing operator.** Finishing becomes 30 units per hour, so machining at 20 units per hour is the limit. Output: 20 × 7.5 = **150 units**.

**Option B: a third machining machine.** Machining becomes 30 units per hour, but finishing stays at 15. Output: **112.5 units**. No gain, because the machine is added at the wrong place. A model like this helps reduce costs, because you avoid the wrong purchase, and it helps improve efficiency where it counts.

**Option C: 1.5 hours of overtime.** Output: 15 × 9 = **135 units**. Just enough on paper.

Now add variation. Suppose stops, changeovers and waiting reduce real output by a flat 10 percent. Option A gives 150 × 0.9 = 135 units and still meets demand. Option C gives 135 × 0.9 = 121.5 units and fails. A simulation replaces this flat 10 percent with the real spread of events, so you also see how often each option misses the target. The point of the example is the order of work: find the constraint first, then test options against it, and keep a margin for variation.

## Common mistakes

- **Starting without a question.** A model that tries to answer everything answers nothing well.
- **Modeling too much detail.** Detail costs time and data. Add it only where it changes the decision.
- **Skipping validation.** If the model cannot reproduce last month, do not use it to predict next month.
- **Using averages only.** Variability drives queues. Include stops, changeovers and demand swings.
- **Running one replication.** One run is one random outcome. Use several and look at the range.
- **Treating the result as a promise.** A simulation supports a decision. It does not replace judgment or a trial on the line.
- **Leaving out the people on the floor.** Operators know the exceptions that the data does not show.

## How software can help

Some vendors call such a model a digital factory. Simulation software lets you build and run these models without writing code, which supports a data-driven decision. [iFAKT's Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. When you compare tools, ask how the model gets its data, how easily you can validate it and whether non-specialists can read the results. A model that only one expert understands rarely survives.

## Next step

Pick one change you are considering, such as a new shift pattern or a machine, and write the question and the output measure for a first factory simulation. Then collect the cycle times and loss data for that area and validate a simple model against last month before you test the change.
