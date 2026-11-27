# SEO metadata

| Field | Value |
|---|---|
| Meta title | Manufacturing Simulation: Factory Simulation with DES (53 characters) |
| Meta description | Manufacturing and factory simulation explained: how discrete event simulation works, when to use it, a worked model with numbers, validation and tools. (151 characters) |
| Slug | `/en/learn/digital-twin-manufacturing/manufacturing-simulation/` (full URL: https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) |
| Parent pillar | [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |
| Main keyword | manufacturing simulation |
| Secondary keywords | discrete event simulation, discrete event simulation manufacturing, DES model, production simulation, factory simulation, simulation modeling, verification and validation of simulation models, warm-up period, replications, confidence interval, simulation software for manufacturing, Plant Simulation, AnyLogic, Simio, FlexSim, Arena, SimPy, JaamSim, VDI 3633, Winter Simulation Conference, value stream simulation |
| Search intent | Informational with a commercial-investigation share. Readers want to know what manufacturing simulation and discrete event simulation (DES) are, how a model works, how reliable it is and which tools exist. The visible SERP is dominated by vendor explainers (Autodesk, Siemens, Visual Components) and academic PDFs (own check, November 20, 2026). |
| Target word count | 3,000 to 5,000 words (cluster). Longest competitor found: Visual Components with about 1,800 words (estimate). Actual `wc -w` H1..Conclusion: 5,203 words after the Round 5 SERP re-check (5,011 after the verification pass of November 20, 2026). |
| Language version | `en-US`. New article, no German version: no hreflang pair; self-referencing canonical only. |

# Competitive analysis (google.com SERP, November 2026)

Method: US web searches on November 20, 2026 for "manufacturing simulation discrete event simulation", "what is manufacturing simulation software guide" and "discrete event simulation manufacturing examples benefits FlexSim Simio AnyLogic". The most relevant English pages were opened in full. Word counts are estimates of the main body (navigation, footer and calls to action excluded); no SEO tool data were available for the US SERP. Several results were academic PDFs (theses, Winter Simulation Conference papers, a NIST report), which shows that Google sees a technical sub-intent behind the keyword.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| visualcomponents.com/what-is-manufacturing-simulation | 1,800 | use cases, stakeholders, four steps from layout to virtual commissioning, alternatives (Excel, CAD) | no numbers, no V&V method, no warm-up or replications, no sources, 3D/layout focus |
| autodesk.com/blogs/.../how-discrete-event-simulation-helps-manufacturers-make-better-decisions/ | 1,150 (1,550 with FAQ) | DES applications, six FAQ (accuracy, data, ERP/MES integration) | case figures (12% throughput, $50 million avoided) unattributed; "within 5-10%" accuracy claim without method; vendor product focus |
| en.wikipedia.org/wiki/Simulation_in_manufacturing_systems [9] | 1,100 | academic references (Robinson, Jahangirian et al.), simulation types | no headings, no method for model building or validation, no output analysis, no tools |
| autodesk.com/blogs/.../what-is-discrete-event-simulation-manufacturing-guide/ | 1,000 | clean definition, use-case list, five FAQ (DES vs. digital twin) | no worked example, no V&V, no sources, no standards |
| siemens.com/en-us/technology/manufacturing-simulation/ | 700 | application map (throughput, logistics, layout, robotics, quality) | product navigation page, no method, no FAQ |

**People also ask / FAQ topics found in the SERP:** What is discrete event simulation in manufacturing? What is the difference between discrete event simulation and a digital twin? Why do manufacturers use discrete event simulation? Can discrete event simulation reduce production bottlenecks? How accurate are discrete event simulation models compared to real factory conditions? What data is needed to build a reliable discrete event simulation model? How do discrete event simulations integrate with ERP, MES or production data systems? What industries use discrete event simulation?

**How this article beats the competition:** None of the analyzed pages shows a model with numbers, and none explains how you know a model is right. This article builds a two-station DES model, verifies it against queueing theory, validates it against shop-floor data, computes confidence intervals from 20 replications, shows the warm-up bias in numbers, and compares three improvement scenarios with paired differences. It adds the method literature that the vendor pages leave out (Law [1], Banks et al. [2], Sargent [3], VDI 3633 [5], the Winter Simulation Conference archive [4]), a vendor-neutral tool table that includes free open-source options [10][11], and a list of the mistakes that make simulation studies fail.

**NEURONwriter re-check (analysis of November 11, 2026; query "factory simulation", id 9bb42a7c23f820f7, google.com, English; secondary query "when to use factory simulation", id b45c82c0de15c04f, used for term gaps and topics only):** NEURONwriter's top 17 organic results for "factory simulation" have a median of about 900 words and an average content score of 43; its recommended length is 925 words. The secondary SERP averages 41; part of it is software-engineering pages on the "factory pattern", which were ignored. The strongest pages by score:

| Page (NW rank) | Words (NW) | NW content score |
|---|---|---|
| autodesk.com blog (future of factory automation and simulation) (6) | 895 | 76 |
| autodesk.com/solutions/design-manufacturing/factory-simulation (outside top 17) | 2,075 | 70 |
| autodesk.com blog (factory simulation and its role in manufacturing) (outside top 17) | 1,266 | 68 |
| incontrolsim.com (best factory simulation software) (outside top 17) | 2,509 | 68 |
| linkedin.com (guide to making useful factory simulations) (15) | 4,009 | 55 |
| rockwellautomation.com (Arena, discrete event modeling for manufacturing) (1) | 1,432 | 53 |
| **This article** | 5,203 | **48 before -> 64 after** |

People also ask (NW): Can I use Python for simulation? What are the top 10 simulation software tools? (Two further PAA entries, "live in a simulation" and "robot simulator", are off-topic.) NW topics: when manufacturers should use factory simulation (importance 10, secondary query), how simulation evaluates factory changes before they are made (10), benefits of factory simulation (8), layout and production flow (9), bottlenecks and capacity (9), automation and equipment investments (9), factory simulation vs. digital twin (7, covered in the FAQ). Biggest term gaps before the re-check: "factory simulation" (1 use), manufacturing process, optimize, factory layout, material flow, resource allocation, identify bottlenecks, workstation, conveyor, data-driven, what-if.

---

# Manufacturing Simulation: How Discrete Event Simulation Works, With a Worked Example

*Last updated: November 20, 2026 · Part of the guide [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)*

> **Short answer:** Manufacturing simulation is the use of an executable computer model of a production system to test decisions before you make them on the shop floor. Most factory questions (throughput, lead time, WIP, buffer sizes, staffing, bottlenecks) are answered with **discrete event simulation (DES)**, which jumps from event to event (an order arrives, a job finishes, a machine fails) and includes randomness. A DES model is only useful if it is verified, validated and run with enough replications to put confidence intervals on the results.

This deep dive belongs to our pillar guide [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/), which places simulation between digital model, digital shadow and twin. Here we stay with one question: how do you build a simulation model that you can trust enough to approve a capital request, a staffing plan or a new buffer layout?

Below you find how a DES engine moves through time, which data it needs, how to check that the model is right, and how many runs you need before a difference between two scenarios is real, all with a small model whose numbers you can reproduce.

### Key takeaways

- **Discrete event simulation** is the standard method for production and logistics questions: orders, machines, buffers, people and breakdowns as events over time, with random variation [1][2][5].
- Capacity spreadsheets work with averages and miss queues from variability, blocking and breakdowns. In our example, the spreadsheet says "fits" at 93% effective load; the simulation shows almost three hours of lead time for 21 minutes of processing.
- **Verification** asks "did we build the model right?" **Validation** asks "did we build the right model?" Both are required, and they are different steps [3].
- Report **means with confidence intervals** from several **replications**, and cut the **warm-up period** in which the model fills up [1][2]. In our example, skipping the warm-up underestimates lead time by about 44%.
- In the example, halving the repair time at the constraint cuts lead time by about 59 minutes; tripling the buffer gives a reduction not distinguishable from zero.

## Table of contents

1. [What is manufacturing simulation?](#1-what-is-manufacturing-simulation)
2. [How discrete event simulation works](#2-how-discrete-event-simulation-works)
3. [When to use factory simulation, and when a spreadsheet is enough](#3-when-to-use-factory-simulation-and-when-a-spreadsheet-is-enough)
4. [Worked example: a two-station DES model with numbers](#4-worked-example-a-two-station-des-model-with-numbers)
5. [Verification and validation step by step](#5-verification-and-validation-step-by-step)
6. [Input data: where it comes from and how to model it](#6-input-data-where-it-comes-from-and-how-to-model-it)
7. [Manufacturing simulation software compared](#7-manufacturing-simulation-software-compared)
8. [Simulation, value streams, process mining and the digital twin](#8-simulation-value-streams-process-mining-and-the-digital-twin)
9. [Common mistakes](#9-common-mistakes)
10. [FAQ](#10-faq)
11. [Conclusion](#11-conclusion)

## 1. What is manufacturing simulation?

Manufacturing simulation, also called factory simulation or production simulation, uses software to model and simulate a manufacturing process on the computer before anyone changes the real one.

The German guideline VDI 3633 Part 1, a long-established method reference for simulating production and logistics systems, defines simulation as reproducing a system with its dynamic processes in a model you can experiment with, to gain insights that can be transferred to reality [5]. (VDI is the Association of German Engineers.) The standard US textbooks, Law's *Simulation Modeling and Analysis* (6th edition, 2024) [1] and Banks, Carson, Nelson and Nicol's *Discrete-Event System Simulation* [2], cover the same ground with a strong statistical focus.

In manufacturing, "simulation" covers several things that are worth keeping apart:

| Type | What it models | Typical question | Time handling |
|---|---|---|---|
| Discrete event simulation (DES) | orders, parts, machines, buffers, operators, breakdowns | Can the line make 5 parts per hour, and what lead time and WIP result? | jumps from event to event |
| Agent-based simulation | autonomous agents with rules (AMRs, people) | How do 12 mobile robots behave in shared aisles? | event- or time-step-driven |
| System dynamics | stocks, flows, feedback loops | How does capacity expansion interact with demand over five years? | continuous, aggregated |
| 3D motion and robotics simulation | kinematics, reach, collisions | Does the robot reach every weld point within the cycle time? | fine time steps |
| Process (physics) simulation | heat, stress, flow in a part or tool | Will the casting fill completely? | numerical solvers |

This article covers DES, the type meant in almost every plant-level question; the parent guide compares all paradigms ([section 6](https://www.m365.fm/en/learn/digital-twin-manufacturing/)).

The method has a long research record: the Winter Simulation Conference archive holds full papers going back to 1968 [4], including many on warm-up detection, output analysis and validation.

## 2. How discrete event simulation works

A DES model describes the system as a set of **entities** (parts, orders), **resources** (machines, operators, forklifts), **queues and buffers**, and **events** that change the state of the system. Between two events nothing changes, so the engine does not need to compute every second. It keeps an **event list** sorted by time, takes the next event, updates the state and schedules new events [1][2].

For a single machine:

1. **08:00, arrival.** The machine is idle, so the part starts. The engine draws a processing time (say 9.4 minutes) and schedules an end event at 08:09.4.
2. **08:03, arrival.** The machine is busy; the part waits (queue length 1).
3. **08:09.4, end.** The first part leaves; the waiting part starts and gets its own end event.
4. **08:47, failure.** The remaining processing time is saved and a repair event is scheduled with a random repair time.

Three ingredients make this useful:

- **Randomness.** Interarrival, processing, failure and repair times come from probability distributions. That creates queues even when average load is below 100%.
- **Interaction.** A machine can be **starved** (no input) or **blocked** (output buffer full). Shared resources, such as one setup technician for four machines, create dependencies that averages cannot represent.
- **Statistics.** The engine records time-weighted values (WIP, utilization) and per-part values (lead time). Every run uses different random numbers, so results vary.

## 3. When to use factory simulation, and when a spreadsheet is enough

A capacity spreadsheet divides demand times processing time by available time; below 100% the plan looks feasible. Queueing theory shows why that misleads: waiting time grows non-linearly with utilization. Kingman's approximation makes this visible [6]: in the parent guide's table, the average wait in front of a 10-minute station rises from about 23 minutes at 70% utilization to about 190 minutes at 95% ([parent guide, section 6](https://www.m365.fm/en/learn/digital-twin-manufacturing/)). **Little's Law** (WIP = throughput × lead time) [7] tells you which lead time corresponds to a given WIP, but not which WIP a given level of variability will produce.

Use simulation when at least one of these is true:

- utilization of a key resource is above roughly 80% (a rule of thumb from the queueing curve, not a standard) and variability is noticeable (breakdowns, mixed products, setups)
- stations interact through finite buffers, shared operators, cranes, AGVs or batching rules
- you need to compare control rules (lot sizes, sequencing, kanban loops, CONWIP limits)
- the decision is expensive enough that a wrong answer costs more than the study

Typical uses in a plant are what-if questions asked before money is spent:

- identify bottlenecks and test how to optimize output at the constraint
- compare factory layout and material flow variants, including conveyor and AGV routes
- resource allocation: staffing per shift, setup technicians, number of workstations
- check an automation or equipment investment before the purchase order
- see how a new product mix or a change in demand affects cycle times, lead time and WIP

The benefit is not the animation. It is a data-driven comparison of options instead of guesswork, with the uncertainty of each result stated.

Skip simulation when a closed-form calculation answers the question, when critical input data cannot be collected, or when nobody has written down the decision the model should support (then it becomes an animation project).

## 4. Worked example: a two-station DES model with numbers

The model is deliberately small so that every number can be checked. We built it as a Python script with its own event list (about 150 lines); any DES tool from section 7 can reproduce it. All parameters are illustrative assumptions, not plant measurements.

### 4.1 The system and the question

A machining cell feeds an assembly station:

| Element | Assumption |
|---|---|
| Order releases | on average one part every 12 minutes (5 parts per hour), random (exponential interarrival times) |
| Station A (machining) | mean processing time 10.0 min, lognormal, coefficient of variation 0.5 |
| Buffer between A and B | 5 parts; if full, A is blocked |
| Station B (assembly) | mean processing time 10.5 min, lognormal, coefficient of variation 0.5 (the constraint of the cell) |
| Breakdowns at B | mean time between failures 480 min, mean time to repair 30 min (both exponential) |
| Operation | continuous (24/7), to keep the example short; a real model adds a shift calendar |

**The plant manager's question:** lead time is too long. Should we (a) enlarge the buffer from 5 to 15, (b) cut mean repair time at B from 30 to 15 minutes with a spare-parts kit and a second trained responder, or (c) cut B's processing time to 9.5 minutes with a fixture change?

### 4.2 What the spreadsheet says

Load on B = 5 parts/h × 10.5 min = 52.5 min of work per hour = 87.5% busy. Availability of B = MTBF / (MTBF + MTTR) = 480 / 510 = 94.1%. Effective load = 87.5% / 94.1% = 93%. Station A is at 5 × 10 / 60 = 83%. Everything is below 100%, so the spreadsheet says the cell "fits," and it cannot say anything about lead time.

### 4.3 Experiment design

- **Run length:** 30 simulated days per replication.
- **Warm-up:** 5 days discarded before statistics start (the model starts empty).
- **Replications:** 20 independent runs with different random-number seeds. The same seeds are reused in every scenario (common random numbers), so the comparison is paired.
- **Outputs:** throughput (parts per hour), average lead time (release to completion at B), average WIP, busy share of B.

### 4.4 Results for the base case

| Output (base case, 20 replications) | Mean | 95% confidence interval |
|---|---|---|
| Throughput | 4.98 parts/h | ±0.04 |
| Average lead time | 166.5 min | ±20.1 |
| Average WIP | 13.8 parts | ±1.8 |
| Busy share of B (processing, excluding downtime) | 87% | ±1 |

The confidence interval is computed as mean ± t × s / √n, with n = 20 replications, t = 2.093 (Student's t, 19 degrees of freedom, 95%) and s the standard deviation across replications. For lead time, s = 42.95 min, so the half-width is 2.093 × 42.95 / √20 = 20.1 min.

Throughput equals demand, so a throughput KPI shows nothing wrong. The problem appears only in lead time and WIP: 20.5 minutes of processing become almost three hours of lead time. The busy share of B matches the hand calculation (87.5%), one of the verification checks in section 5.

### 4.5 Scenario comparison

| Scenario | Average lead time | Difference vs. base (paired, 95% CI) | Average WIP | Significant? |
|---|---|---|---|---|
| Base (buffer 5, MTTR 30, B = 10.5 min) | 166.5 min | n/a | 13.8 | n/a |
| (a) Buffer 15 | 145.5 min | −21.1 ± 21.2 min | 12.2 | not distinguishable from zero at 95% |
| (b) MTTR 15 min | 107.5 min | −59.1 ± 20.4 min | 9.0 | yes |
| (c) B = 9.5 min | 92.9 min | −73.6 ± 17.3 min | 7.7 | yes |

Reading the table:

- **The buffer does not address the cause.** Station A is not the constraint, so a bigger buffer between A and B mostly stores the queue in a different place. With 20 replications its effect is not distinguishable from zero; more replications might show a small effect, but not one in the range of (b) or (c).
- **Repair time matters more than the availability figure suggests.** Option (b) raises availability only from 94.1% to 97.0%, yet it removes about a third of the lead time, because long repairs create long queues behind the bottleneck.
- **Option (c) is the strongest lever,** but it may cost more (fixture design, process validation, possibly a first-article inspection). Finance can now compare the cost of (b) and (c) against a known effect.

**Translating the result into money.** Throughput does not change in any scenario, so there is no revenue effect unless shorter lead times win orders. The direct effect is tied-up inventory: by Little's Law, lower lead time at the same throughput means lower WIP. Option (b) cuts average WIP by 13.8 − 9.0 = 4.8 parts. At an assumed (illustrative) inventory value of $500 per part, that frees about $2,400 of working capital once, plus the carrying cost on it every year. For a cell like this, the stronger arguments are usually delivery reliability and floor space, which the model also quantifies (WIP and its 90th percentile).

This is the same logic that the [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned) teaches: improve the constraint, not the non-constraint. The simulation adds the size of the effect and its uncertainty.

### 4.6 How many replications do you need?

With 20 replications, the lead-time half-width is about 20 minutes. If the decision needs ±10 minutes, the usual approximation is n ≈ n₀ × (h₀ / h)² = 20 × (20.1 / 10)² ≈ 81 replications [1]. Paired comparisons with common random numbers usually need fewer runs than independent ones, because the shared randomness cancels out in the difference.

### 4.7 What the warm-up period changes

Run for only two simulated days from an empty start without a warm-up, the base case gives about 94 minutes average lead time instead of 166.5, an underestimate of roughly 44%, because an empty line has no queues. Law [1] and Banks et al. [2] describe methods for choosing the warm-up length, such as plotting moving averages of the output over time and cutting where the curve levels off.

## 5. Verification and validation step by step

Sargent's paper in the Journal of Simulation distinguishes **conceptual model validity**, **computerized model verification**, **operational validity** and **data validity**, and recommends documenting each [3]. In plain terms:

- **Verification:** the code or tool model does what the conceptual model says.
- **Validation:** the conceptual model, with its data, represents the real system accurately enough for the decision at hand.

"Accurately enough for the decision" matters. A model for a buffer decision does not need to reproduce every shift's output to the part; it needs to rank the scenarios correctly and estimate the effect size within a range that would not change the decision.

### 5.1 Verification checks we ran on the example

| Check | How | Result in the example |
|---|---|---|
| Analytical benchmark | Replace lognormal times with exponential times, remove breakdowns and the buffer limit. Two stations in series with Poisson arrivals then form a simple Jackson network: each station behaves as an independent M/M/1 queue, for which exact formulas exist. | Expected lead time: 50 min wait + 10 min at A, 121 min wait + 11 min at B = 192 min; expected WIP = 5/h × 3.2 h = 16 parts. Simulation (20 replications): 179 ± 16 min and 14.9 ± 1.4 parts. Both intervals contain the exact values. |
| Little's Law | Compare WIP with throughput × lead time [7] | 4.98/h × 179.4 min / 60 = 14.89 vs. measured WIP 14.93: consistent |
| Hand calculation of utilization | Busy share of B should equal arrival rate × mean processing time | 87.5% expected, 87% simulated |
| Extreme conditions | No arrivals → no output; MTTR → 0 → results approach the no-failure case; buffer → infinite → A never blocked | all behaved as expected |
| Trace | Step through the first 20 events by hand, including one failure during processing | remaining processing time correctly resumed after repair |

In the M/M/1 test, B runs at 91.7% utilization, so run-to-run variation and the interval are wide; add a benchmark at lower load for a tighter check.

### 5.2 Validation checks

Validation compares the model with the real system. For an existing line, the most useful sources are MES and ERP data (see section 6). The following example is illustrative:

| Validation step | Example |
|---|---|
| Face validity | Walk the model animation with the cell lead and two operators. They point out that B is never starved at shift start in reality because a material handler pre-stages parts. The model gets a pre-staging rule. |
| Historical comparison | MES data for six comparable weeks show an average lead time of 172 minutes and average WIP of 14 parts (illustrative values). The model's base case gives 166.5 ± 20.1 min and 13.8 ± 1.8 parts. Both observed values fall inside the intervals: no evidence of a mismatch. |
| Distribution check | Compare the simulated lead-time distribution (not only the mean) with the MES distribution, for example the 90th percentile. |
| Sensitivity | Vary uncertain inputs (MTTR ±20%, processing time CV 0.3 to 0.7) and check whether the ranking of scenarios changes. Here it does not: (c) > (b) > (a) in all variants we tried. |
| Sign-off and version control | Document assumptions, data sources and validation results on one page that the decision-makers sign. Version the model and its input data like a controlled document, so a later rerun can be traced to what was approved. |

A model that matches the past is not automatically right for a different future (new products, new shift model), so state which conditions the validation covers. NIST is working on a verification, validation and uncertainty quantification (VVUQ) framework for manufacturing digital twins in the ISO 23247 context [8], which shows that the topic is far from settled for connected models.

## 6. Input data: where it comes from and how to model it

The model is only as good as its inputs. Typical sources in a US plant:

| Input | Primary source | Typical problem | What to do |
|---|---|---|---|
| Routings and standard times | ERP routing / work center data | standards are years old or padded | compare with MES actuals for the last 3 to 6 months |
| Actual processing times | MES operation start/end, machine signals (MTConnect, OPC UA) | booking delays, operators confirm in batches | filter implausible values, check with time studies |
| Setup times | MES setup confirmations, SMED records | not booked separately | sample on the floor |
| Breakdowns (MTBF, MTTR) | CMMS work orders, MES downtime codes | short stops not recorded, repair time includes waiting for maintenance | separate response time and repair time; they need different improvement actions |
| Order releases and product mix | ERP production orders, demand plan | future mix differs from the past | model scenarios, not one forecast |
| Shift calendar and staffing | timekeeping, shift plan | overtime and absences missing | include actual attendance |
| Timestamps across systems | MES, PLC historians, ERP | clocks not synchronized, time zones, local vs. UTC time | normalize to one time base before computing durations |

On **distributions**: with a few dozen observations or more, fit a distribution (lognormal, gamma and Weibull are common for processing and repair times) and test the fit [1]. With very few observations, a triangular distribution with minimum, most likely and maximum from the people who run the process is a defensible start, flagged for later data collection. Using only the mean (a constant) removes exactly the variability that creates queues.

Operator-level timestamps are personal data. For simulation you rarely need them per person: aggregate by operation and shift, agree the purpose with the workforce (and, in unionized plants, with the union), and in German plants expect the works council to have a say: under section 87(1) no. 6 of the Works Constitution Act (BetrVG), it co-determines the introduction and use of technical systems designed to monitor employee behavior or performance [20].

Where the data lives in a layered system landscape (ERP at level 4, MES at level 3 in ISA-95 terms) is explained in our planned pillar on [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned). If timestamps from MES and ERP are messy, the techniques of [process mining in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) help to reconstruct real flows and times before you parameterize a model.

## 7. Manufacturing simulation software compared

The table lists widely used tools and what their makers say about them. It is not a ranking. Prices are not published consistently and are left out.

| Tool | Maker / license | Paradigm according to the maker | Notes |
|---|---|---|---|
| Plant Simulation (Tecnomatix) | Siemens, commercial | discrete event simulation and throughput optimization, object-oriented 3D environment [12] | Siemens also lists a "Plant Simulation X VSM Library" to simulate value stream maps [12] |
| Simio | Simio LLC, commercial | discrete event simulation, plus APS and "process digital twin" offerings [14] | combines simulation with scheduling |
| AnyLogic | AnyLogic Company, commercial | discrete event, agent-based and system dynamics modeling, and their combination (multimethod) [15] | suited to hybrid models such as AMR fleets inside a DES line |
| FlexSim | Autodesk (definitive agreement to acquire announced October 24, 2023) [16] | discrete event simulation of factories and logistics centers [16] | now marketed as Autodesk FlexSim |
| Arena | Rockwell Automation, commercial | "uses the discrete event method for most simulation efforts," flowchart modeling [13] | free trial and academic program offered [13] |
| SimPy | open source, MIT License | "process-based discrete-event simulation framework based on standard Python" [10] | code-based, no GUI; good for analysts who already use Python |
| JaamSim | open source, Apache License 2.0 | Java-based discrete event simulation environment with drag-and-drop and 3D graphics [11] | free GUI tool |
| iFAKT Polaris Simulator | iFAKT GmbH, commercial | the vendor page describes simulation on a product-process-resource model, "station, line, and hall models," capacity, staffing and buffer scenarios; the simulation type is not stated [17] | see the note below |
| Spreadsheet | any | static calculation | fine for screening; no queues, blocking or variability |

How to choose: (1) write the decision, outputs and level of detail first; (2) check whether the tool reads your ERP/MES extracts or someone retypes routings; (3) check built-in support for replications, warm-up and confidence intervals; (4) decide who maintains the model, since a one-off capital study and a monthly planning model have different needs; (5) pilot with your own data before signing a multi-year license.

**A value stream example.** Some teams prefer to start simulation from a model they already know, such as a value stream map or a product-process-resource model derived from ERP data, instead of building a separate 3D layout model. That idea goes back to work on dynamic value stream simulation published in the German engineering journal ZWF in 2014 [18]. One product built on it is iFAKT Polaris: according to the vendor, its Simulator runs network plans from the Polaris Designer through configurable station, line and hall models and reports utilization, bottlenecks and over- or underutilization over time [17]. The vendor page does not state whether the engine is discrete event or how randomness is modeled, so ask about replications and distributions in a demo, as with any tool in this table. Siemens' VSM library [12] is an alternative route to the same idea inside a classic DES tool. More on the Polaris modules, with evidence and limits, is in our planned pillar [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned).

**Note: The author works at iFAKT GmbH.**

## 8. Simulation, value streams, process mining and the digital twin

Simulation rarely stands alone. Four neighbors matter:

- **[Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)** gives a static picture with averages. Simulation tests whether the future-state map holds up when variability, product mix and breakdowns are added.
- **[Process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)** reconstructs the actual flow and timing from MES and ERP event logs. It is a strong source for model inputs and for validation. A 2025 study on a fully automated factory testbed combined both: process mining identified a CNC machine as the main bottleneck, and simulation then showed that adjusted CNC settings plus three AGVs could reach the target output of 70 units, while more AGVs added nothing [19]. The authors note that the results come from a single testbed.
- **[Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)** uses similar models for a shorter horizon: tomorrow's sequence instead of next year's layout.
- **The digital twin** connects the model to live data. A DES model fed regularly with current MES data moves from "digital model" toward "digital shadow"; whether you need that depends on how often the decision recurs.

Align the model's KPI definitions with those used on the floor; see [manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned).

## 9. Common mistakes

| Mistake | Why it hurts | Better |
|---|---|---|
| Starting with the tool or the 3D layout | weeks of modeling detail that does not affect the decision | write the decision, outputs and scope on one page first |
| Using averages as inputs | removes the variability that creates queues; results look like the spreadsheet | fit distributions or at least use triangular estimates |
| One run per scenario | a single run is one random outcome, not a result | 10 to 30 replications to start, more if the intervals overlap |
| No warm-up | empty-start bias (44% in our example) | plot output over time, discard the transient |
| Reporting only throughput | in demand-limited systems throughput hides the problem | report lead time, WIP and distributions |
| Skipping verification | coding errors look like insights | analytical benchmarks, Little's Law, traces |
| "Validated" because the animation looks right | face validity is only one test | compare with MES history and document it [3] |
| Modeling people as machines | ignores breaks, skills, learning, fatigue | model skills and break rules; involve operators in face validity |
| Model dies after the study | the next decision starts from zero | assign an owner and keep a data pipeline if decisions recur |

Operators and cell leads know the real rules (who pre-stages material, which machine gets priority after a breakdown). Involving them in face validation is a cheap accuracy gain and eases acceptance on the floor.

## 10. FAQ

### What is manufacturing simulation in simple terms?

A computer model of a production system that you run forward in time to test decisions (new product mix, bigger buffer, extra operator) before changing the real shop floor.

### What is discrete event simulation in manufacturing?

Discrete event simulation models a factory as a sequence of events (arrivals, starts, ends, failures, repairs) that change the system state at specific points in time. Between events nothing changes, so the engine jumps from one event to the next. Random variation is built in, which makes queues, blocking and bottlenecks visible [1][2].

### What is the difference between factory simulation and a digital twin?

DES is a method; a digital twin is a model connected to the real system by data, ideally automatically in both directions. A DES model fed manually is a digital model; fed automatically with current data it becomes part of a digital shadow or twin ([parent guide](https://www.m365.fm/en/learn/digital-twin-manufacturing/)).

### What is the difference between discrete event and agent-based simulation?

DES focuses on flows of entities through processes and resources. Agent-based simulation focuses on autonomous actors with their own rules, such as mobile robots negotiating aisles. Many factory models combine both, for example a DES production line with agent-based AMRs.

### How accurate are discrete event simulation models?

There is no fixed accuracy figure. Accuracy depends on input data and validation. A validated model should reproduce historical lead time, WIP and throughput within its confidence intervals and rank decision options correctly. Vendor statements such as "within 5 to 10%" are only meaningful if the validation method is stated [3].

### What data do I need to build a simulation model?

Routings and processing times, setup times, breakdown and repair data, order releases and product mix, buffer sizes, shift calendars and staffing, plus transport times if material handling matters. Most of it is in ERP, MES and CMMS systems (section 6).

### Can I do manufacturing simulation in Excel?

You can run simple Monte Carlo calculations in a spreadsheet, but a spreadsheet does not manage an event list, queues, blocking or shared resources. For anything beyond a single station, a DES tool or library (including free ones such as SimPy or JaamSim) is faster and less error-prone [10][11].

### How many simulation runs (replications) do I need?

Start with 10 to 30 and look at the confidence intervals. If the intervals of the scenarios you compare overlap or are too wide for the decision, add replications: halving the interval width needs about four times as many runs [1].

### What is the warm-up period in simulation?

The initial period in which a model that starts empty fills up with work. Statistics from that period are biased, usually toward lead times that are too short, so you discard it before collecting results [1][2].

### Can I use Python for simulation?

Yes. SimPy is a free, process-based discrete-event simulation framework based on standard Python [10], and the worked example in section 4 was itself built as a Python script with its own event list. Code gives full control and easy version control; a GUI tool is faster to show to people who do not read code.

### What is the best manufacturing simulation software?

There is no single best tool. Plant Simulation, Simio, AnyLogic, FlexSim and Arena differ in paradigm, 3D focus and scheduling features; SimPy and JaamSim are free. Choose by decision, data path, statistics features and model ownership (section 7).

### Is simulation worth it for a small manufacturer?

Often yes, if the decision is expensive (a machine, an extension, a second shift) and a key resource runs at high utilization. Free tools lower the entry cost, and NIST MEP centers support small and mid-sized US manufacturers (see the parent guide).

## 11. Conclusion

Manufacturing simulation earns its place where averages mislead: high utilization, variability, breakdowns and interacting stations. Discrete event simulation is the standard method there, and its value depends less on the tool than on discipline: write down the decision, use real distributions from MES, ERP and maintenance data, verify the model against benchmarks, validate it against history, discard the warm-up, run enough replications and compare scenarios with confidence intervals. In the small example in this article, a spreadsheet said "fits," a bigger buffer looked plausible, and the model showed that repair time and processing time at the constraint were the levers that matter, with a size and an uncertainty attached to each.

## Further reading on m365.fm

**Parent pillar**

- [Digital Twin in Manufacturing: The Complete Guide](https://www.m365.fm/en/learn/digital-twin-manufacturing/)

**Sibling cluster**

- [Process Mining in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) (planned)

**Related guides** (links go live after publication)

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)

**Entity pages**

- [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about digitalizing manufacturing with Microsoft 365 and Azure, value stream methods, production planning, simulation and digital twins.

**Note: The author works at iFAKT GmbH.**

*[Editor: have the author add role, background and a profile photo.]*

---

# Sources

All online sources accessed on November 20, 2026. Sources [5], [6], [7], [8] and [18] are also cited in the parent pillar and were verified there; the others were opened and verified for this article.

1. Law, A. M. (2024): Simulation Modeling and Analysis. 6th ed., McGraw-Hill, ISBN 978-1-264-26824-5 (published January 23, 2024; covers input modeling, model verification and validation, and statistical design and analysis of simulation experiments). https://www.mheducation.com/highered/mhp/product/simulation-modeling-analysis-sixth-edition.html
2. Banks, J.; Carson, J. S.; Nelson, B. L.; Nicol, D. M. (2010): Discrete-Event System Simulation. 5th ed., Pearson (published June 26, 2009, © 2010), ISBN 978-0-13-606212-7. https://pearson.com/en-us/subject-catalog/p/discrete-event-system-simulation/P200000003161/9780136062127
3. Sargent, R. G. (2013): Verification and validation of simulation models. Journal of Simulation 7(1), pp. 12–24. DOI: [10.1057/jos.2012.20](https://doi.org/10.1057/jos.2012.20)
4. Winter Simulation Conference: WSC Archive (programs with full papers, WSC 1968 to WSC 2025). https://informs-sim.org
5. VDI 3633 Part 1:2014-12 Simulation of systems in materials handling, logistics and production: Fundamentals. https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals
6. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), pp. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
7. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), pp. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
8. NIST: Digital Twins for Advanced Manufacturing (project page; ISO 23247 contributions, proposed VVUQ framework). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
9. Wikipedia: Simulation in manufacturing systems (used for the competitive analysis and as a pointer to Robinson, S. (2014): Simulation: The Practice of Model Development and Use, Palgrave Macmillan). https://en.wikipedia.org/wiki/Simulation_in_manufacturing_systems
10. SimPy documentation ("SimPy is a process-based discrete-event simulation framework based on standard Python"; MIT License; version 4.1). https://simpy.readthedocs.io/en/latest/
11. JaamSim (GitHub repository; Java-based discrete-event simulation environment, Apache License 2.0). https://github.com/jaamsim/jaamsim
12. Siemens: Plant Simulation software (Tecnomatix; Plant Simulation X editions and VSM Library). https://www.siemens.com/en-us/products/tecnomatix/plant-simulation-software/
13. Rockwell Automation: Arena Simulation Software. https://www.rockwellautomation.com/en-mde/products/software/arena-simulation.html
14. Simio: Simio Sync practical applications (product navigation: Discrete Event Simulation Software, APS, Process Digital Twin). https://simio.com/resources/events/2022-Simio-Sync-Practical-Applications/index.html
15. AnyLogic Help: Modeling approaches (discrete event, system dynamics, agent based, multimethod modeling). https://anylogic.help/anylogic/ui/multimethod.html
16. CIMdata: Autodesk Signs Definitive Agreement to Acquire FlexSim (October 24, 2023). https://www.cimdata.com/en/industry-summary-articles/item/23014-autodesk-signs-definitive-agreement-to-acquire-flexsim
17. iFAKT GmbH: Polaris Simulator (module page; vendor information). https://www.ifakt.de/en/solutions/simulator
18. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen [Dynamic simulation of value streams]. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), pp. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
19. Lee, Y.; Shin, J.; Lee, W. (2025): Manufacturing process analysis framework for process mining: case study of fully automated factory applications. International Journal of Advanced Manufacturing Technology 136, pp. 5641–5664. DOI: [10.1007/s00170-025-15029-5](https://doi.org/10.1007/s00170-025-15029-5)
20. § 87 Betriebsverfassungsgesetz (Works Constitution Act), paragraph 1 no. 6. Gesetze im Internet, Federal Ministry of Justice (German). https://www.gesetze-im-internet.de/betrvg/__87.html (accessed November 20, 2026)

---

# Editorial notes

## URL and canonical

- Cluster URL nested under the parent pillar (`/en/learn/digital-twin-manufacturing/manufacturing-simulation/`) is an assumption from the brief; confirm with the site structure before publication. Self-referencing canonical, no hreflang pair (no German version).

## Worked example

- All parameters (12-min interarrival, 10.0 / 10.5 min processing, CV 0.5, MTBF 480, MTTR 30, buffer 5) and the MES validation figures (172 min, 14 parts) are **illustrative assumptions**, labeled as such in the text.
- The simulation results come from a Python script written for this article (own event list, lognormal and exponential variates, 20 replications, seeds 1000–1019, common random numbers across scenarios, 5-day warm-up, 30-day run). The M/M/1 benchmark values (192 min, 16 parts) are exact queueing results (M/M/1 waiting time ρ/(μ−λ), Burke's output theorem for tandem queues). Recommendation: offer the script as a download so readers can reproduce the numbers; if the editor reruns it with other seeds, numbers change within the stated intervals.

## Unverified items and points to check before publication

- **Works council co-determination (section 6), closed November 20, 2026:** § 87(1) no. 6 BetrVG opened on gesetze-im-internet.de and cited [20]; marker removed.
- **Removed during review:** the AnyLogic "free personal edition" note and the FAQ on study durations, because neither could be verified online (see review log).
- **Robinson (2014):** cited only via the Wikipedia reference list [9]; the book itself was not opened.
- **"80% utilization" and "10 to 30 replications":** rules of thumb, labeled as such in text; not a standard.
- **Sources [5]–[8], [18]:** verified in the parent pillar on November 20, 2026, not re-opened for this article (fetch budget); the fact checker re-checked [3], [4], [10]–[17], [19] online.

## Vendor-only claims

- Tool descriptions in section 7 are makers' own descriptions [10]–[17].
- iFAKT Polaris Simulator: vendor page only [17]; the article states what the page does not document (simulation type, randomness).
- Autodesk competitor claims (12% throughput, $50 million, 5–10% accuracy) are mentioned only in the competitive analysis and FAQ as unattributed vendor statements.

## iFAKT and disclosure

- One iFAKT passage (section 7), presented as one example among vendor-neutral alternatives (Siemens VSM library, any DES tool). Disclosure exactly "**Note: The author works at iFAKT GmbH.**" after the passage and in the author box (FTC Endorsement Guides material-connection disclosure, see parent pillar source [61]); no sponsorship label, iFAKT does not pay for publication. No location other than the Stuttgart headquarters is mentioned (none needed here).

## Internal links

- Parent pillar in the first 150 words (short answer area and intro) and in Further reading. Sibling cluster (process mining) in sections 6 and 8 and Further reading. Pillars linked in body text: digital-twin-manufacturing, theory-of-constraints, mes-isa-95, value-stream-mapping, production-scheduling-aps, manufacturing-kpis, ifakt-polaris (7). Remove "(planned)" once live.

## Recommended graphics

1. Event-list diagram: four events on a time axis with state changes (section 2).
2. Lead time vs. utilization curve (Kingman) with the spreadsheet "fits" zone marked.
3. Bar chart with confidence-interval whiskers for the four scenarios (section 4.5).
4. Warm-up plot: moving average of lead time over simulated days, with the cut line (section 4.7).
5. V&V flow: conceptual model → verification → validation → experiments (after Sargent [3]).

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Manufacturing Simulation: How Discrete Event Simulation Works, With a Worked Example",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/digital-twin-manufacturing/"},
      "about": ["manufacturing simulation", "factory simulation", "discrete event simulation"]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": "[include all 12 FAQ questions from section 10 with their answers]"
    }
  ]
}
```

## Cannibalization

- The parent pillar covers simulation types, Kingman and the study sequence at overview level (section 6). This cluster targets "manufacturing simulation" / "discrete event simulation" with a method deep dive (worked model, V&V, replications, tools). It does not repeat the Kingman table; it links to it. The parent should link to this cluster from section 6 in the final consistency check.
- ifakt-polaris targets "value stream mapping software"; this cluster mentions Polaris Simulator once as an example, with no overlap in intent.

## Review log

Expert-panel review with nine roles, three full rounds (review, cross-check, re-optimize), run on November 20, 2026, as required by the course-expansion brief and Mirko's update of the same day (at least three rounds per cluster).

### Round 1

| Role | Verdict | Main findings |
|---|---|---|
| 1. Practitioner (US plant manager, 20 years) | changes needed | The worked example is the strongest part, but it stops before the money question; a plant manager cannot take "−59 minutes" to the CFO. 24/7 operation is unrealistic; at least say that a shift calendar belongs in a real model (already stated in 4.1: OK). Mark station B as the constraint explicitly. |
| 2. Academic (IE / OM professor) | changes needed | (1) "Not significant" for scenario (a) reads as "no effect"; say "not distinguishable from zero at 95%" and note that more replications might show a small effect. (2) The tandem benchmark should be named (Jackson network) so readers can look it up. (3) CI formula, t value (2.093 for 19 df) and replication formula checked: correct. (4) Exact M/M/1 values (50 + 10 + 121 + 11 = 192 min; WIP 16) recomputed: correct. |
| 3. IT/OT architect (MES, ISA-95, OT security) | changes needed | Input table lacks the most common timestamp problem: unsynchronized clocks between PLC historians, MES and ERP, plus local time vs. UTC. Link to the MES/ISA-95 pillar is present. |
| 4. Quality lead (CQE / Black Belt, AS9100/IATF) | changes needed | A validated model used for a capital or capacity decision must be traceable: version the model and its input data like a controlled document. Option (c) needs process validation and possibly first-article inspection, not just "validation." |
| 5. Finance (plant controller) | changes needed | Translate WIP change into tied-up working capital and state that throughput, and therefore revenue, does not change. No invented carrying-cost rate. |
| 6. Worker voice / lean coach | changes needed | MES operator timestamps are personal data; say how to use them without turning a simulation study into performance surveillance. Keep the face-validation paragraph with operators. |
| 7. SEO specialist (US) | changes needed | H1..Conclusion is 5,306 words, above the 5,000 cluster cap. Main keyword in meta title, H1, short answer, H2 1 and H2 7: OK. PAA coverage (DES definition, DES vs. twin, accuracy, data, ERP/MES) good. Parent link within first 150 words: OK (H1 subline and intro). Trim padding in intro, key takeaways and FAQ. |
| 8. Fact checker | changes needed | (1) "VDI 3633, the most detailed published guideline" is a superlative we cannot prove. (2) "WSC, the main annual meeting of the field" is not stated on the archive page [4]; the page confirms only papers back to 1968. (3) "Arena: long history in US IE teaching" and "FlexSim: 3D-oriented" are not supported by the opened pages [13][16]. (4) "AnyLogic free personal edition" could not be verified (search budget exhausted). (5) "Sargent's widely cited paper": citation count not checked. (6) Lee et al. [19]: the single-testbed limitation stated by the authors is missing. |
| 9. Critic | changes needed | Intro paragraph 3 is filler ("Most explainers stop at..."). The last line of the conclusion ("That is the kind of answer that justifies the effort") is self-congratulation. "The cheapest accuracy gain there is" overclaims. iFAKT passage: one example among Siemens' VSM library and generic DES tools, gaps of the vendor page named, disclosure exact: OK. No em-dash chains, no listed AI clichés (grep). |

### Debates in round 1

- **SEO vs. academic (length vs. V&V depth):** The SEO specialist proposed cutting section 5.1 to a short list to get under 5,000 words. The academic objected that the verification table with real benchmark numbers is the one thing no competitor has. **Resolution:** keep 5.1 and 5.2 in full; cut the intro, key takeaways, the tool-selection list, duplicated FAQ answers and one mistakes row instead.
- **Finance vs. critic (dollar figures):** Finance wanted a full ROI with carrying cost. The critic rejected any rate that is not sourced. **Resolution:** one working-capital calculation with a clearly labeled illustrative unit value ($500), no carrying-cost percentage, and the statement that throughput and revenue are unchanged.
- **Worker voice vs. IT/OT (operator data):** IT/OT pointed out that per-operator MES data improve distribution fitting. Worker voice argued that the study does not need person-level data. **Resolution:** aggregate by operation and shift, agree the purpose with the workforce and union, mention the German works-council angle as context, marked [unverified] for the exact legal basis.

### Optimization after round 1 (old -> new)

| Location | Old | New |
|---|---|---|
| Intro | "Most explainers stop at 'simulation lets you test what-if scenarios.' That is true and not very helpful. The work is in the details: ..." | "Below you find how a DES engine moves through time, which data it needs, how to check that the model is right, and how many runs you need ..." |
| Section 1 | "VDI 3633 Part 1, the most detailed published guideline on simulating ..." | "VDI 3633 Part 1, a long-established method reference for simulating ..." |
| Section 1 | "The Winter Simulation Conference, the main annual meeting of the field, has an online archive ..." | "the Winter Simulation Conference archive holds full papers going back to 1968 [4] ..." |
| 4.1 table | "Station B ... coefficient of variation 0.5" | "... coefficient of variation 0.5 (the constraint of the cell)" |
| 4.5 table | "no, the interval includes zero" | "not distinguishable from zero at 95%" |
| 4.5 text | (none) | new paragraph "Translating the result into money" (ΔWIP 4.8 parts, illustrative $500/part, about $2,400 working capital, no revenue effect) |
| 4.5 text | "With 20 replications we cannot distinguish its effect from zero." | "... not distinguishable from zero; more replications might show a small effect, but not one in the range of (b) or (c)." |
| 5.1 table | "behave as two independent M/M/1 queues" | "form a simple Jackson network: each station behaves as an independent M/M/1 queue" |
| 5.2 table | "Sign-off" | "Sign-off and version control" (model and input data versioned like a controlled document) |
| 6 table | (none) | new row "Timestamps across systems" (clock sync, time zones, UTC) |
| 6 text | (none) | new paragraph on operator-level timestamps as personal data |
| 7 table | "AnyLogic ... (free personal edition exists [unverified]) ... strong for hybrid models" | "AnyLogic ... commercial ... suited to hybrid models" |
| 7 table | "FlexSim ... 3D-oriented"; "Arena ... long history in US industrial engineering teaching" | "now marketed as Autodesk FlexSim"; "free trial and academic program offered [13]" |
| Section 5 | "Sargent's widely cited paper" | "Sargent's paper in the Journal of Simulation" |
| Section 8 | Lee et al. without limitation | "+ The authors note that the results come from a single testbed." |
| Section 9 | "the cheapest accuracy gain there is" | "a cheap accuracy gain" |
| Conclusion | "That is the kind of answer that justifies the effort." | "... with a size and an uncertainty attached to each." |

### Round 2 (cross-check)

| Role | Verdict | Findings |
|---|---|---|
| 1. Practitioner | satisfied | Money paragraph is what a plant manager needs; options (b) and (c) can now be costed. |
| 2. Academic | satisfied | Wording on significance and the Jackson-network benchmark correct. Suggests keeping the paired-comparison (common random numbers) explanation in 4.3: kept. |
| 3. IT/OT architect | satisfied | Timestamp row added. |
| 4. Quality lead | satisfied | Version control and process validation wording added. |
| 5. Finance | satisfied | No invented rates; working-capital effect labeled illustrative. |
| 6. Worker voice | satisfied | Aggregation rule and workforce agreement in place; operators in face validation kept. |
| 7. SEO specialist | changes needed | After round 1 additions the article grew to 5,479 words. Cut the FAQ on study duration (unverifiable anyway), shorten FAQ answers, the event loop, section 1 closing paragraph, section 8 and the "how to choose" list. |
| 8. Fact checker | changes needed | FAQ "How long does a study take" contains only an [unverified] statement; remove rather than publish an unsourced answer. Re-verified online: Law 6th ed. (McGraw-Hill page: January 23, 2024, ISBN 9781264268245, V&V and input modeling covered) [1]; Banks et al. 5th ed. (Pearson: June 26, 2009, © 2010, ISBN 9780136062127) [2]; Sargent 2013 (RePEc: 7(1), 12–24, DOI) [3]; WSC archive 1968–2025 [4]. |
| 9. Critic | changes needed | Key takeaways still repeat section 4 almost verbatim; the "80%" caveat paragraph duplicates the bullet. |

**Debate in round 2:** The SEO specialist wanted to drop the FAQ "What is manufacturing simulation in simple terms?" because the short answer already covers it. The practitioner and the SEO specialist's own PAA list argued that it matches the main keyword's most common question. **Resolution:** keep it, shortened to one sentence.

### Optimization after round 2 (old -> new)

| Location | Old | New |
|---|---|---|
| Key takeaways | "Static capacity spreadsheets work with averages. They miss queues caused by ..." (and two more long bullets) | shortened; bullet "Tool choice comes after the question ..." removed |
| Section 1 | "This article covers the first type. The parent guide compares all paradigms in more detail ... When people search for ..." | "This article covers DES, the type meant in almost every plant-level question; the parent guide compares all paradigms (section 6)." |
| Section 2 | four-step event loop with full sentences | same four steps, compressed |
| Section 3 | separate "80%" caveat paragraph | caveat moved into the bullet "(a rule of thumb from the queueing curve, not a standard)" |
| Section 7 | five-item numbered "How to choose" list | one sentence with the same five criteria |
| Section 9 | row "Mixing response time into MTTR" | removed (covered in section 6 input table) |
| FAQ | "How long does a manufacturing simulation study take?" | removed (no verifiable answer) |
| FAQ | answers of "simple terms", "DES vs. digital twin", "best software", "small manufacturer" | shortened |
| 4.7 | three sentences on the warm-up run | one sentence |

### Round 3 (final review, re-optimize)

| Role | Verdict | Findings |
|---|---|---|
| 1. Practitioner | satisfied | Reads like a study a plant would commission; the "plant manager's question" framing is clear. |
| 2. Academic | satisfied | All formulas and numbers rechecked against the script output: base 166.5 ± 20.1 min (s = 42.95, n = 20, t = 2.093); paired differences −21.1 ± 21.2, −59.1 ± 20.4, −73.6 ± 17.3; benchmark 179 ± 16 vs. 192; warm-up bias 93.6 vs. 166.5 min (−44%); replication estimate 20 × (20.1/10)² ≈ 81. |
| 3. IT/OT architect | satisfied | No further remarks. |
| 4. Quality lead | satisfied | No further remarks. |
| 5. Finance | satisfied | No further remarks. |
| 6. Worker voice | satisfied | No further remarks. |
| 7. SEO specialist | changes needed, then satisfied | At 5,149 words still above the cap; final trims to key takeaways, 4.1, 4.4, 5.1, 5.2, 6, 8, 9, section 3 and the conclusion brought the article to 4,996 words. Meta title 57 and description 150 characters. 11 FAQ. |
| 8. Fact checker | satisfied, with open items | Re-verified online in this round: SimPy (MIT, "process-based discrete-event simulation framework based on standard Python") [10]; JaamSim (Apache 2.0) [11]; Siemens Plant Simulation (DES, object-oriented 3D, Plant Simulation X, VSM Library) [12]; Arena quote and free trial [13]; Simio navigation labels [14]; AnyLogic modeling approaches [15]; CIMdata, October 24, 2023 [16]; iFAKT Polaris Simulator page (no simulation type stated) [17]; Lee et al. 2025 (IJAMT 136, 5641–5664, DOI; 70 units, three AGVs, single testbed) [19]. Not re-opened in this session: [5], [6], [7], [8], [18], verified in the parent pillar on the same day; an attempted re-check of [7] failed because the session's web-fetch budget was exhausted. Open: works-council legal basis [unverified]. |
| 9. Critic | satisfied | Padding removed; tone plain; no superlatives left that are not sourced; iFAKT passage neutral with exact disclosure, no sponsorship wording, no locations. |

**Optimization after round 3 (old -> new), selection:** "Two things stand out. First, throughput equals demand ..." -> "Throughput equals demand, so a throughput KPI shows nothing wrong ..."; "Manufacturing simulation earns its place where averages lie" -> "... where averages mislead"; "A note on the benchmark: in the M/M/1 test ..." (3 sentences) -> one sentence; "Do not use simulation when ..." -> "Skip simulation when ..."; "This article is a deep dive under our pillar guide ..." -> "This deep dive belongs to our pillar guide ...".

### Consensus statement

After three rounds, all nine roles sign off. The article answers "manufacturing simulation" and "discrete event simulation" with a reproducible worked model, explicit verification and validation, and a neutral tool table; vendor statements are labeled, the iFAKT example is one of several routes, and the remaining open item is listed under Editorial notes.

**Final word count (`wc -w`, H1 through end of section 11 Conclusion): 4,996 words.**

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (accessed November 20, 2026):

- Works council co-determination (section 6): [unverified for the specific legal basis] -> confirmed and cited: § 87(1) no. 6 BetrVG, co-determination over the introduction and use of technical systems designed to monitor employee behavior or performance [20]. Sentence now names the provision.
- No other [unverified] markers in this article; no sources were marked as checked via a sister pillar.

Sign-off:
- **Fact checker:** satisfied; the only open marker is closed with the statute text.
- **Critic:** satisfied; one sentence changed, no padding, iFAKT passage untouched.
- **Subject expert (simulation engineer):** satisfied.

**Word count after round 4:** 5,011 words (+15).

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** NEURONwriter query 9bb42a7c23f820f7 ("factory simulation", google.com, analysis of November 11, 2026) for scoring; query b45c82c0de15c04f ("when to use factory simulation") for term gaps and topics only. No new analysis created. Content scored with evaluate-content using the article part (H1 to Further reading) and the meta title and description.

**Score:** 48 -> 64 (NW top-17 average 43, best competitor 76, an 895-word Autodesk blog post).

**Findings:** The NW query is "factory simulation", but the article used that phrase once and never named the plant-level uses the SERP lists (layout, material flow, resource allocation, automation investments). The "when to use" content existed but sat under a heading about spreadsheets. PAA "Can I use Python for simulation?" was answerable from existing content [10]. The remaining gap is vendor marketing vocabulary (streamline, improve efficiency, digital factory, 3D environment), which does not fit the plain style and was not added.

**Changes (old -> new):**
1. New first sentence in Section 1: "Manufacturing simulation, also called factory simulation or production simulation, uses software to model and simulate a manufacturing process on the computer before anyone changes the real one."
2. H2 "3. When simulation beats a spreadsheet, and when it does not" -> "3. When to use factory simulation, and when a spreadsheet is enough" (TOC and anchor updated; no inbound links to the old anchor in the project files).
3. New list in Section 3, "Typical uses in a plant are what-if questions asked before money is spent" (bottlenecks, factory layout and material flow, resource allocation, automation investments, product mix and demand changes), plus two sentences on the benefit (data-driven comparison instead of guesswork, with uncertainty stated). No new facts or numbers.
4. FAQ "What is the difference between discrete event simulation and a digital twin?" -> "What is the difference between factory simulation and a digital twin?" (answer unchanged).
5. New FAQ "Can I use Python for simulation?" (SimPy [10], already verified in Round 3; the worked example's Python script). JSON-LD placeholder now asks for all 12 FAQs; "factory simulation" added to "about".
6. Meta title "Manufacturing Simulation: Discrete Event Simulation Guide" -> "Manufacturing Simulation: Factory Simulation with DES" (53 characters).
7. Meta description -> "Manufacturing and factory simulation explained: how discrete event simulation works, when to use it, a worked model with numbers, validation and tools." (151 characters).
8. Word count: 5,011 -> 5,203 (`wc -w`, H1 to Conclusion incl. FAQ), within the 5,300 ceiling.

Sign-off:
- **SEO specialist (US):** satisfied; 64 is well above the SERP average of 43; the main keyword stays first in the title, the NW keyword is now in title, description, H2 and Section 1.
- **Critic:** satisfied; the new list is concrete and short; "factory simulation" now appears three times in the body (plus the TOC) in 5,200 words, no stuffing.
- **Fact checker:** satisfied; the only sourced statement added (SimPy) reuses [10], verified in Round 3; the Python script claim matches Section 4 and the editorial notes.
- **Subject expert (simulation engineer):** satisfied; the use cases match typical DES studies, and the "uncertainty stated" sentence keeps the article's line on confidence intervals.
