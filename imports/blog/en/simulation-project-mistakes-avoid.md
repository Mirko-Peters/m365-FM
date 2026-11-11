---
title: "Five Common Mistakes in Simulation Projects and How to Avoid Them"
summary: "Simulation project mistakes cost time and trust. Learn five common ones, from vague questions to skipped validation, with a worked example and a checklist."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [factory-simulation, polaris-simulator, digital-twin]
keypoints:
  - "Five mistakes recur in simulation projects: no clear question, the wrong level of detail, weak data, no validation, and trusting a single run."
  - "A model without a clear question and a decision-maker in regular contact solves the wrong problem, however good it is."
  - "Start simple and add detail only when the question needs it; unnecessary detail costs time and hides the factors that matter."
  - "Validate the model against the existing system before you use it for forecasts, and keep the written assumptions for review."
  - "Random events need many replications: one run can rank two options the wrong way round."
faq:
  - q: "What are the most common simulation project mistakes?"
    a: "Five recur: starting without a clear question, modelling too much or too little detail, using weak or averaged data, skipping validation against the real system, and trusting one run. Averill Law lists 17 pitfalls in 2003 and 23 in 2024. The five here are our own selection from those lists."
  - q: "How do you validate a simulation model?"
    a: "Compare the model's output with data from the existing system, for example output per shift, under the same conditions. Have experts review the assumptions and the results for reasonableness, and test which inputs move the results most. Do this before you use the model to compare options."
  - q: "How much detail should a simulation model have?"
    a: "Just enough to answer the question. Start with a simple model and add detail only when a result needs it. Too much detail delays the project and can hide the factors that matter, while too little misses the effects you want to test. Write the assumptions down and review them with the people who know the line."
---

Simulation project mistakes are mostly avoidable, and most of them are made before the first model is built. This guide is for plant managers who sponsor a manufacturing simulation project, and for the engineers who build the model, when they want the work to end in a decision. You will learn five common mistakes, drawn from two papers by the simulation expert Averill Law and from practice, a worked example with numbers that shows why one run is not enough, and a checklist for your next project with [factory simulation](https://www.m365.fm/entity/factory-simulation/).

## Simulation project mistakes: where they come from

A simulation project is not a programming exercise. Averill Law, in his paper on [how to conduct a successful simulation study](https://www.informs-sim.org/wsc03papers/009.pdf) at the 2003 Winter Simulation Conference, lists 17 pitfalls in four groups: modelling and validation, software, randomness and the design of experiments. In 2024 he extended the list to 23 pitfalls in [a paper for the same conference](https://informs-sim.org/wsc24papers/inv198.pdf). He notes that programming is only 25 to 50 per cent of the work in a sound study.

Law works at his own simulation consultancy, Averill M. Law & Associates, so his lists reflect one expert view. They agree with a practical paper by J. Michael Knoll and Joseph Heim of Genie Industries on the [adoption of discrete event simulation in a manufacturing environment](https://informs-sim.org/wsc00papers/175.PDF), which is based on one mid-sized manufacturer and reports no quantified savings.

From these sources and from common practice, we pick five mistakes that matter most for a plant. This selection is our own, not a ranking from the papers.

## Mistake 1: No clear question and no contact with the decision-maker

The first mistake is to start with the tool, not with the question. Law lists undefined objectives and little regular contact with the decision-maker among his pitfalls. He quotes a warning that the greatest model for the wrong problem will be of little value to the decision-maker. In one of his examples, an analyst worked for months without consulting the requesting general, who left the final briefing after five minutes saying that this was not the problem he was interested in.

Knoll and Heim add a practical rule: a model whose output will not be used should not be built.

**How to avoid it.** Write the question as a decision. "Which of two layouts delivers 3,000 units per shift?" is a question. "Let's simulate the plant" is not. Hold a kick-off meeting with everyone who is affected, name who decides and by when, and agree on regular review meetings during the project.

## Mistake 2: The wrong level of detail

The second mistake is to model too much, or too little. Law calls an inappropriate level of detail one of the most common errors, especially for new analysts. His advice is to include just enough detail to answer the questions of interest, and to start simple and add detail as needed. Knoll and Heim agree: keep the scope tight, and do not expand a model only because it is possible.

Too much detail delays the project, and it hides the factors that matter in a crowd of parameters. Too little leaves out an effect that you wanted to test, such as a changeover or a buffer.

**How to avoid it.** Ask for each element and each input parameter of the model whether it changes the answer to the question. If not, leave it out or use a simple rule. Write the assumptions down in a short conceptual model, which Law calls an absolutely critical activity that is often skipped, and go through it with the people who know the line.

## Mistake 3: Weak simulation data collection

The third mistake concerns data. Law lists poor system data collection among the pitfalls, and he also warns about two typical errors in input modelling. The first is to replace a random input with its average. In his queueing example, using constant times equal to the means removes the queue completely, so the model shows no waiting where the real system has it. The second is to choose a distribution such as the normal one by habit. In one of his examples, a normal distribution for service times produced an output error of 39 per cent compared with a better-fitting distribution.

The plant data itself needs care. Does the stop reason in the manufacturing execution system agree with the maintenance record? If a [digital twin](https://www.m365.fm/entity/digital-twin/), a maintained digital representation of a physical resource that is kept up to date from observations, is available, it can supply current data. If not, plan time for measurement.

**How to avoid it.** List the data the question needs, find the source and the owner of each item, and collect the variation, not only the average. Use at least two experts for important parts of the process, because some of what people say will be wrong.

## Mistake 4: Skipping simulation model validation

The fourth mistake is to trust a model that has never been compared with reality. Law calls the comparison of model output with the existing system the most important validation technique, and he says it also supports credibility. In his 2024 paper, he gives a paper-pulp example in which model and system throughput differed by only 0.4 and 1.1 per cent. He also recommends a structured walkthrough of the assumptions with all stakeholders, because model errors and omissions will be found.

**How to avoid it.** Build the baseline first, and check it against output, stops and lead time of the real-world line. Have experts review the simulation results for reasonableness and test which input parameter moves the results most. Only then use the model for options. If the line does not exist yet, compare the model with a similar line or with calculations, and say so openly.

## Mistake 5: Treating one run as the truth

The fifth mistake is statistical. A simulation with random events gives a different result in each run. Law warns against treating the output of one run as the true performance of the model. In his example of a motor-vehicle office, the average delay ranged from 1.83 to 10.37 minutes across replications. He also lists the omission of a warm-up period, when the starting state is empty and unrepresentative, and the comparison of options without confidence intervals.

**How to avoid it.** Run many independent replications, discard the warm-up, plan the analyses before the runs, and compare options using ranges or confidence intervals, not single numbers.

## Example: one run against five replications

This is an illustrative example with assumed numbers, not a measured case. A plant compares two buffer designs, A and B, in a model of a packing line. The output per shift of each design in the model is:

- Design A, five replications: 412, 389, 401, 395 and 393 units. The mean is 1,990 ÷ 5 = 398 units.
- Design B, five replications: 405, 399, 408, 402 and 406 units. The mean is 2,020 ÷ 5 = 404 units.

If the team had run only the first replication of each, A would have scored 412 and B 405, and A would look 7 units better. With five replications, B is 6 units better on average, and its range of 399 to 408 is narrower than that of A, which runs from 389 to 412. The first run ranked the designs the wrong way round.

Five replications are a minimum for an illustration. A real project would run more and calculate confidence intervals. The validation step uses the same idea: if the baseline model gives a mean of 391 units and the real line averaged 380 units per shift over 20 shifts, the model is 11 units, or about 3 per cent, higher. The team decides whether that is close enough for the question, and it records the decision.

## How to avoid the five mistakes: a checklist

1. **Write the question** as a decision, with the decision-maker and the date.
2. **Hold a kick-off** with all stakeholders and agree on review meetings. Treat the work as an iteration with review points, not as a one-way workflow.
3. **Start simple.** Write a short conceptual model with the assumptions, and walk through it with experts before programming.
4. **Plan the data.** Name the source and owner of each data item, and collect the variation.
5. **Validate** the baseline against the real line before you test options.
6. **Replicate.** Run enough replications, drop the warm-up and report ranges.

## Common mistakes

- **Treating the project as programming.** Programming is only a part of the work, according to Law.
- **Letting the animation decide.** A short look at the animation is not an experiment.
- **Choosing simulation tools by price alone.** Match the tool to the problem and to the skills of your team, and do not use simulation software as a black box.
- **No documentation.** A model without written assumptions cannot be reviewed or reused.
- **No owner after the project.** A model that nobody updates is out of date after the first change.

## How software can help

[iFAKT's Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. Whatever tool you choose, and before you use simulation for a decision, check how it handles replications and warm-up, how you import real data, and how you can document and review assumptions. Software cannot replace the question or the validation.

## Next step

Take your next manufacturing simulation project, or one that is running now, and check it against the checklist above. Where an answer is missing, you have found a likely cause of simulation project mistakes, and you can fix it before the model is built.
