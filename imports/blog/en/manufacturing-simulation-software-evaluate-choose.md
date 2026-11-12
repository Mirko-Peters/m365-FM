---
title: "Manufacturing Simulation Software: How to Evaluate and Choose"
summary: "Manufacturing simulation software is easier to choose with a scorecard than a ranking. Criteria, test questions and a fair comparison method for plant managers."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [factory-simulation, digital-twin, azure, polaris-simulator, polaris-designer, ifakt]
keypoints:
  - "Choose manufacturing simulation software by your question, your data and the people who will build and read the models, not by a popularity list."
  - "A 2016 Winter Simulation Conference study ranked tools by popularity and itself states that popularity does not assure quality; most tools have similar feature lists."
  - "Discrete-event and agent-based approaches both suit process development, so the choice often depends on the software and on who builds the model."
  - "Check that the tool supports repeated runs with confidence intervals and warm-up handling, because a single run is only one sample."
  - "Compare finalists on the same case with your own data, fixed weights set in advance and a record of the modeler hours each one needed."
faq:
  - q: "How do I choose manufacturing simulation software?"
    a: "Write down the decision the model must support, then score candidates on modelling fit, data import, experiment handling, validation support, result reporting, skills needed and total cost. Give every finalist the same case with your own data and compare modeler hours as well as results."
  - q: "Is the most popular simulation software the best choice?"
    a: "Not necessarily. A 2016 Winter Simulation Conference paper ranked tools by popularity and stated that popularity does not assure quality. Popularity does help you find trained modelers. Treat it as one input next to fit, data handling and cost."
  - q: "Should we buy simulation software or hire a specialist?"
    a: "It depends on how often you will use it. If you have one or two questions a year, a specialist study may cost less than licenses and training. If planners will test options every month, owning a tool and the skills to run it usually makes more sense."
---

Manufacturing simulation software is the tool behind [factory simulation](https://www.m365.fm/entity/factory-simulation/): you build a computer model of a line or plant and test decisions before real money moves. Picking the right one is less about a feature list and more about three things: the question you need answered, the data you can supply, and the people who will build and read the models. This guide is for plant managers who have to run a software evaluation and want a scorecard they can defend.

## What kinds of manufacturing simulation software exist?

Two splits help you sort the market. The first is the modelling approach, the second is how the model gets built.

A [Lean Six Sigma study](https://emerald.com/insight/content/doi/10.1108/IJLSS-03-2018-0025/full/html) compared three approaches on a factory case: discrete-event, agent-based and system dynamics. The authors found discrete-event and agent-based simulation about equally suited to developing manufacturing processes and said the choice may depend on the available software or the modeler's preference. They also found hybrid models very promising. In short, the paradigm matters less than people expect. What matters is whether the tool can represent your flow, your rules and your variability.

In practice, the questions fall into a few groups, and tools usually lean toward one of them:

- **Flow models** follow parts through stations, buffers and queues. They answer questions about throughput, lead time and work in process.
- **Models with individual actors**, such as planners, orders or transporters that follow their own rules. They help when behavior and decisions matter as much as the flow.
- **High-level models** of quantities over longer periods, used for strategic questions.
- **Physical or 3D models** of machines and robots. They answer a different question, namely whether a motion or layout works in space.

How the model is built is the second split. Some tools are visual and drag-and-drop. Some work from tables and spreadsheets. Some are code libraries that your team programs. The more freedom a tool gives, the more skill it needs.

If you're also weighing a [digital twin](https://www.m365.fm/entity/digital-twin/), note that it solves a different problem: it stays connected to live plant data, while a simulation is run on demand to test choices. Settle that question first.

## Why won't a ranking help?

Lists of top tools are everywhere, and they're tempting. Be careful with them.

The Winter Simulation Conference paper [Discrete Simulation Software Ranking](https://www.informs-sim.org/wsc16papers/095.pdf) from 2016 ranked tools by popularity, using web searches, publications, reviews and social networks. The authors state that more popularity does not assure more quality. They say popularity shouldn't be the only selection criterion and suggest combining it with feature comparison and experimentation. They also note that most tools have similar feature lists, which makes a pure feature comparison hard to conclude from.

There is one real advantage to a popular tool: you can find people who know it. That counts when you hire or when your consultant leaves. Weigh it, but don't let it decide.

## Which criteria matter most?

Use these as scorecard rows. For each, the right-hand question is what you'd ask in a demo.

1. **Fit to your question.** Can it represent your flow, your batch rules, your shift calendars and your changeovers without workarounds? Ask the vendor to model one awkward feature of your line live.
2. **Data import.** Can it read routings, resources and orders from your ERP exports, Excel files or a database, and can you refresh the model without rebuilding it? A model fed by retyped numbers goes stale quickly.
3. **Experiment handling.** Can it run many scenarios and repeat each one automatically? See the next section.
4. **Validation support.** Can you compare model output with past results, trace a single part through the model and find out why something happened?
5. **Results and reporting.** Can it produce the KPIs you track, and export results to the tools your managers read, such as Excel or Power BI? Animation helps people believe a model, but numbers decide.
6. **Skills needed.** Who in your plant can build and maintain a model, and how long is training? A tool that only one expert understands rarely survives that expert leaving.
7. **Run time and scale.** How long does a realistic model run, and what happens with ten times the orders?
8. **Automation and integration.** Is there an interface to run models from scripts or other systems?
9. **Cost over three years.** Licenses, training, modeler hours, data preparation and support. Add the cost of the next model, not only the first.
10. **Exit.** Can you export the model structure and data if you switch?

### Why does experiment handling deserve its own check?

Simulation models with random inputs give a different answer on every run, so a single run is just one sample. An [MIT lecture on experiment design](https://ocw.tau.edu.ng/courses/sloan-school-of-management/15-066j-system-optimization-and-analysis-for-manufacturing-summer-2003/lecture-notes/lec20_experiment_design.pdf) (hosted on a mirror of MIT OpenCourseWare) frames the key question as how many independent replications you need for a given accuracy, and describes a stopping rule based on the width of a confidence interval. For models that run continuously, it also covers the warm-up period: you discard the first observations of each replication and average the rest, and Welch's method helps you choose where the warm-up ends.

You don't need to do that math yourself, but the software should. Ask whether it can run replications automatically, report confidence intervals, help set a warm-up period and compare scenarios in one view. If it can only show one animated run, you'll end up deciding on a coin toss.

### What about running many scenarios?

When you test dozens of scenarios with many replications each, run time becomes a real cost. Replications are independent of each other, so they can run side by side. Microsoft describes [Azure Batch](https://learn.microsoft.com/en-us/azure/batch/batch-technical-overview) as a service for large-scale parallel jobs that don't need to communicate with each other, with Monte Carlo simulation named as an example. You bring your own application, and Batch deploys it to a pool of virtual machines. That only helps if your simulation tool can run without a screen from a command line and its license allows it, so put both on your question list. [Azure](https://www.m365.fm/entity/azure/) capacity is something to discuss with IT only after a pilot shows you need it.

## Should you buy a tool, hire a specialist or build your own?

Be honest about how often you'll use it.

- **Hire a specialist** when you have one or two big questions a year, such as a new line or a major investment. You pay for the study and skip the training.
- **Buy a tool** when planners will test options regularly, for example shift models, product mix and buffer sizes. Budget time for training and for keeping the model current.
- **Build your own** with a programming library only when you have people who can write and maintain the code. Flexibility is high, but so is the dependence on those people.

Many plants start with a specialist study, learn what questions they really have and then decide on a tool.

## How do you run a fair comparison?

A fair test takes a few weeks, not months.

1. **Write the question.** One decision, one date, one owner.
2. **Prepare one data pack** for one line or cell: routings, times, resources, calendars, demand and a month of actual results.
3. **Set the weights first.** Decide how much data import, experiment handling, skills and cost count before you see a demo.
4. **Give every finalist the same case** and the same deadline.
5. **Let your own people use it.** Watch where they get stuck.
6. **Validate against history.** Does the model reproduce last month within a margin you agreed on?
7. **Record the effort.** Modeler hours, data cleanup hours, questions to support.
8. **Score together.** Plant, planning, IT and finance each score their own rows.

If a vendor won't run your data in a pilot, that's an answer.

## Common mistakes

- **Choosing from a ranking.** It tells you what's popular, not what fits.
- **Buying for the demo.** A polished animation says nothing about data handling or experiment support.
- **Ignoring who builds the models.** The best tool for an expert can be the wrong one for your team.
- **Skipping validation.** A model that can't reproduce the past shouldn't be trusted with the future.
- **Underestimating data work.** Collecting and cleaning input data can take as long as building the model.
- **Deciding on one run.** Without replications you can't tell a real gain from noise.

## Where Polaris fits

If you want a simulation that starts from your ERP data, iFAKT Polaris is one candidate. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production. The [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) module builds a product-process-resource knowledge graph from ERP data, bills of materials and process times, and the [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) module uses it to test capacity, staffing and buffer scenarios virtually and to show bottlenecks and utilization imbalances. Put it through the same scorecard and the same pilot case as every other candidate.

## Related topics to explore

- **Input data for simulation.** Which times and rules to collect first, and how to check them with the people on the line.
- **Validating a model.** How to compare output with a past period and document the gaps.
- **Simulation and live data.** What changes when a model is connected to the shop floor.
- **Reporting simulation results.** Which few KPIs managers need and how to show scenarios side by side.
- **Staffing a simulation capability.** Who builds, who owns and who reviews the models.

## Next step

Choosing manufacturing simulation software gets easier once you have a scorecard with weights agreed in advance. Pick one real decision in your plant, assemble the data pack for it and give the same case to two or three candidates.
