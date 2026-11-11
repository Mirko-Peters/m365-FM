---
title: "When Does Factory Simulation Pay Off? Five Typical Use Cases"
summary: "When to use factory simulation: if a decision is complex, costly or hard to reverse. Five typical use cases, a worked ROI example and when it does not pay off."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [factory-simulation, polaris-simulator, digital-twin]
keypoints:
  - "Factory simulation pays off when a decision is complex, costly or hard to reverse, and when random events and interactions make a simple calculation unreliable."
  - "Five typical use cases: new lines and layouts, capacity before an investment, bottlenecks and buffers, staffing and shifts, and automation decisions."
  - "A study pays off when the value of a better decision times the chance that the study changes the decision is larger than the study cost."
  - "Simulation does not pay off when the question is simple, the output will not be used, the data is missing or the scope keeps growing."
  - "A model needs a champion who knows modelling, a tight scope and documentation, or it loses credibility."
faq:
  - q: "When should you use factory simulation?"
    a: "Use it when a decision is complex, costly or hard to reverse, and when random events, queues and interactions between stations make a spreadsheet unreliable. Typical examples are new lines, layout changes, capacity investments, buffer sizes, staffing and automation. For a simple question, a calculation is faster and cheaper."
  - q: "How do you judge the ROI of a simulation study?"
    a: "Compare the study cost with the value at stake in the decision and the chance that the study changes it. If the decision is worth 180,000 and the study costs 24,000, the study pays off when it changes the decision in more than about 13 per cent of cases. Also count reuse of the model."
  - q: "What is discrete event simulation?"
    a: "It is the method behind most factory models. The model changes state at points in time, such as when a part arrives, a machine starts or a stop ends, and it tracks queues, waiting and utilization. Because random events are included, you run many replications and look at ranges, not one number."
---

When to use factory simulation is a question of risk and complexity. Use it when a decision about a production system is complex, costly or hard to reverse, and when random events and interactions between stations make a simple calculation unreliable. This guide is for operational excellence managers who must decide whether a study is worth the effort. It describes three tests, five typical use cases, a worked example with numbers for the return of a study, and the situations where [factory simulation](https://www.m365.fm/entity/factory-simulation/) does not pay off.

## When to use factory simulation: three tests

Factory simulation is a controlled model of how work moves through part of a factory, using current operating rules, resources, orders and normal variation, so a proposed change, such as an extra shift, a new machine or a smaller buffer, can be tested before it is made. The [Autodesk blog](https://www.autodesk.com/blogs/design-and-manufacturing/factory-simulation-basics-how-manufacturers-use-simulation-to-design-better-production-systems/), a vendor source from the maker of the FlexSim software, says it delivers the most value when decisions are complex, costly or difficult to reverse. The advice of [TWI](https://www.twi-global.com/technical-knowledge/faqs/faqmanufacturing-when-should-i-employ-simulation-to-assist-in-resolution-of-manufacturing-problems), a research and technology organisation, is similar. Its FAQ page says problems with dynamic effects, non-standard distributions and random events are the ones where simulation will often provide the most valuable solution.

From these sources, we derive three tests. They are our own planning aid, not a standard.

1. **Stakes.** Is the decision expensive or hard to undo? A machine, a building or a new shift pattern qualifies. A change to a sign or a label does not.
2. **Interaction.** Do stations, buffers, people and orders affect each other, so that one change moves the problem somewhere else? That is typical in a line with stops and queues.
3. **Variation.** Do stops, order mixes and arrival times vary? Averages hide the waiting time that variation causes.

If all three answers are yes, a simulation is a strong candidate. If only one is yes, try a calculation first.

## How manufacturing simulation works: discrete event simulation

Most factory models use discrete event simulation. The simulation model changes its state at points in time: a part arrives, a machine starts, a stop ends. It follows the queues and waiting that result, and reports output, utilization and lead time. Before you trust it, you validate it against the real-world line. Because the events are random, you run many replications and look at the range of results. You test a change in the model and compare it with the baseline under the same conditions. The WSC 2000 paper by J. Michael Knoll and Joseph Heim of Genie Industries, [on the adoption of discrete event simulation](https://informs-sim.org/wsc00papers/175.PDF), makes a point that also helps: comparing all options under the same conditions reduces the reliance on individual opinion.

In practice, manufacturing simulation is a way to use simulation on the factory floor without disturbing it. You can identify bottlenecks on an assembly line, test a change to the production planning and see the system behavior under peak load, all in a virtual environment. A smart factory programme often starts with the same questions.

## Use case 1: Designing a new line or a new layout

The most classic use case is the design of a new line or facility. The Knoll and Heim paper says simulation allows modelling any number of layout changes before moving a single piece of equipment. The Autodesk article lists the testing of new lines or facilities and the planning of layout changes first among its use cases.

The question is concrete: does the proposed layout deliver the planned output, and where do parts wait? A model of the design answers it before steel is bought, and the same model can later use real-time data from the running line. It also helps to compare two layouts under the same demand. This pays off most when the design is new, because there is no real line to measure and the cost of a wrong layout is high.

## Use case 2: Capacity, throughput and optimization before an investment

The second example is the test of capacity. A plant wants to know whether an extra shift, a second machine or a faster changeover will raise the output to a target. The Autodesk article lists capacity planning and the analysis of output rates among its applications.

A model with the real stops, changeovers and order mix shows the output you can expect, not the nameplate figure. It also shows whether the extra capacity is used or whether the line stops somewhere else. Here the stakes are clear. A machine is a large amount of money, and a simulation can show that it does not lift the output if another station limits the line.

## Use case 3: Bottlenecks, buffers and work in process

The third example is the search for the bottleneck and the sizing of buffers. The Autodesk article lists finding bottlenecks and reducing work in process. On a production line with random stops, the bottleneck can move, and a buffer that is too small starves the next station, while a buffer that is too big adds waiting time.

A model can simulate buffer sizes and placements with real stop data, cycle times and how busy each station is, and show the effect on output and lead time. The result is a ranking of the changes by effect, so that the team starts with the one that moves the output most. This works well for lines where a spreadsheet can only show averages.

## Use case 4: Staffing and shift plans

The fourth example is people. The Autodesk article lists the optimization of staffing and shift schedules. The question is how many operators a line needs at which time, and what happens to output if one is missing, so that you can optimize the plan.

A model that includes the resource allocation of operators, breaks and absence can compare shift plans. It shows where waiting for a person limits the output. This is often cheaper than the others, because the model is simple, and the decision is repeated every season. It is also one where people are affected, so involve them in the model.

## Use case 5: Automation and other hard-to-reverse investments

The fifth example is the investment in automation, such as a conveyor, a robot cell or a fleet of automated guided vehicles. The Autodesk article lists automation among the changes to plan. These decisions are costly to reverse, and they add interactions, for example queues at stations and congestion on the routes.

A model can simulate the number of vehicles or the speed of a conveyor with peak demand and failures, and show the effect on the production process and on supply chain deliveries. A [digital twin](https://www.m365.fm/entity/digital-twin/), which is a maintained digital representation of a physical resource that is kept up to date from observations, can supply the current data for such a model once the plant is running. Before the purchase, a model built from planning data is usually enough.

This list of five is our own grouping, based on the sources above and on common practice. It is not a ranking. A study can cover several applications at once.

## Example: does a study pay off?

This is an illustrative calculation with assumed numbers, not a measured example. A plant considers a second machine for 180,000 to raise the output of a line. A simulation study would cost 24,000, for example 20 engineering days at 900 plus 6,000 for licences.

The study can lead to a different decision, for example because the model shows that another station limits the line, and a change of buffer and shift plan for a lower cost gives the same output. Say the plant assumes that the study changes the decision in 1 of 4 cases, which is 25 per cent. That figure is a guess and should be tested with your own history.

- Value at stake: 180,000.
- Chance that the decision changes: 25 per cent.
- Expected value of the study: 0.25 × 180,000 = 45,000.
- Cost of the study: 24,000.

The expected gain is 45,000 − 24,000 = 21,000. The break-even chance is 24,000 ÷ 180,000 = about 13 per cent. If you believe the study changes the decision in more than 13 per cent of such cases, it pays off on this decision alone. If the model is reused for later changes, for example two small changes with a value of 20,000 each, the benefit grows without much extra cost. The calculation is simple, but it forces the team to state the value at stake and the chance, and that is already useful.

## When simulation does not pay off

Simulation is not always the right tool. The Knoll and Heim paper, which reports one mid-sized manufacturer and no quantified savings, gives practical cautions:

- **No champion.** Success depends on a champion with modelling experience. Without it, the champion will not have credibility.
- **Scope creep.** Keep the scope tight, and do not expand a model only because it is possible.
- **No use for the output.** A model whose output will not be used should not be built.
- **The wrong tool.** Match the software to the needs, and not to the cheapest offer.

Add three of our own. The question may be simple enough for a calculation. The data may have gaps, so the first task is a data audit of stop reasons and cycle times, and of the workflow behind them. The decision may already be made.

## Common mistakes

- **Starting without a decision.** A model without a question produces charts, not decisions.
- **Modelling everything.** Detail that the question does not need adds cost and weakens trust.
- **Skipping validation.** Check that the model reproduces the current line before you trust its forecasts.
- **Running one scenario.** Random events need many replications and a range of results.
- **Leaving out the shop floor.** People who know the line find the missing rules in the model.
- **Treating the result as a promise.** The model supports the decision. People take it.

## How software can help

[iFAKT's Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. Other manufacturing simulation software exists too, with different strengths, and a data-driven model needs clean inputs. When you compare tools, ask how the model is built from existing data, how results are validated, and who can run scenarios after the project ends.

## Next step

Take your next investment decision and apply the three tests of stakes, interaction and variation. If it passes, write down the value at stake, the cost of a study and the chance that it changes the decision. That is a short, evidence-based way to decide when to use factory simulation, and it gives the sponsor a clear question to answer.
