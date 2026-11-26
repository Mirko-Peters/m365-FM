# SEO metadata

| Field | Value |
|---|---|
| Meta title | Process Mining in Manufacturing: MES and ERP Event Logs (55 characters) |
| Meta description | Process mining in manufacturing explained: event logs from MES and ERP, a worked example, object-centric OCEL 2.0, use cases, tools and pitfalls. (145 characters) |
| Slug | `/en/learn/digital-twin-manufacturing/process-mining-manufacturing/` (full URL: https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) |
| Parent pillar | [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |
| Main keyword | process mining in manufacturing |
| Secondary keywords | process mining manufacturing, manufacturing process mining, event log, MES event data, ERP production order data, process discovery, conformance checking, object-centric process mining, OCEL 2.0, XES IEEE 1849, Process Mining Manifesto, production process analysis, rework loop analysis, process mining vs value stream mapping, process mining and simulation |
| Search intent | Informational with a commercial-investigation share: readers want to know whether and how process mining works on production (not only on purchase-to-pay), which data it needs and which tools exist. The visible SERP mixes academic papers and theses with short vendor pages (own check, November 20, 2026). |
| Target word count | 3,000 to 5,000 words (cluster). Longest non-academic competitor found: Formaspace with about 1,600 words (estimate). Actual `wc -w` H1..Conclusion: 5,005 words after the round 5 SERP re-check (4,928 after the verification pass of November 20, 2026). |
| Language version | `en-US`. New article, no German version: no hreflang pair; self-referencing canonical only. |

# Competitive analysis (google.com SERP, November 2026)

Method: US web searches on November 20, 2026 for "process mining in manufacturing", "process mining manufacturing use cases MES ERP event log" and "how is process mining used in manufacturing shop floor MES data object-centric". The top results for the main keyword were dominated by academic sources (TUM, Politecnico di Milano, Springer, IFIP, International Journal of Production Research, Int. J. of Advanced Manufacturing Technology), which shows a strong technical sub-intent. The relevant practitioner and vendor pages were opened in full. Word counts are estimates of the main body.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| formaspace.com/articles/industrial/process-mining-helps-manufacturing-assembly/ | 1,600 | question-style H2s, discovery/conformance/enhancement, Petri nets, links to ProM, XES and the IEEE Task Force | no MES, no case-ID discussion, no object-centric approach, no worked example |
| appian.com/blog/2021/process-mining-in-manufacturing | 520 | the only worked example found (four-station line, 65/h target, drop to 57/h traced to station C) | very short, no MES, no conformance, no sources |
| celonis.com/solutions/industries/manufacturing | 500 | customer figures (e.g. Siemens "$15M", Alstom "10%" targeted stock reduction) | no event-log explanation, no method; figures are vendor claims |
| qpr.com/industries/manufacturing | 300 | outcome headlines | no method, no data, figures without context |
| link.springer.com/article/10.1007/s00170-025-15029-5 (Lee et al. 2025) | journal article | full framework on a factory testbed, conformance fitness, link to simulation | academic, paywalled for many readers |

**People also ask / FAQ topics found in the SERP and on the pages:** What is process mining in manufacturing? How is process mining used in manufacturing? What data do you need for process mining? Can process mining use MES data? What is an event log? What is the difference between process mining and value stream mapping? What is object-centric process mining? What are the challenges of process mining in production? Which process mining tools are there?

**How this article beats the competition:** No practitioner page explains why production data break the classic "one case ID" assumption, where the events sit in ERP, MES, WMS, QMS and CMMS, or what the timestamps actually mean. This article does, with a worked event log of six production orders from MES and ERP data, computed results (variants, lead time, waiting, rework share of the constraint's capacity, a conformance check that exposes a booking delay) and the same example in object-centric form after OCEL 2.0 [4]. It rests on the primary method sources (Process Mining Manifesto [2], van der Aalst [1], IEEE 1849-2023 XES [3]) and connects process mining to value stream mapping and simulation.

### SERP re-check, November 20, 2026

Method: US web searches for "process mining in manufacturing" (main keyword), "process mining manufacturing use cases" and "process mining manufacturing MES data production" (variants). Positions are the order returned by the search tool and approximate the google.com SERP; no live "People also ask" box is available through the tool. Searches ran on November 20; pages were opened on November 23, 2026 after the fetch quota reset.

| Position (approx.) | Page | Type | Findings |
|---|---|---|---|
| 1 | mediatum.ub.tum.de (TUM) | thesis / publication | academic |
| 2 | link.springer.com/10.1007/978-3-662-65004-2_15 | book chapter | academic |
| 3 | re.public.polimi.it (IJCIM accepted manuscript) | journal article | academic |
| 4 | dl.ifip.org IFIP AICT 591, "Process Mining in Manufacturing: Goals, Techniques and Applications" | conference paper | could not be opened (bot protection) |
| 5 | International Journal of Production Research, DOI 10.1080/00207543.2021.1906460 | journal article | academic |
| 6 | link.springer.com/article/10.1007/s00170-025-15029-5 (Lee et al. 2025) | journal article | unchanged from the first analysis |
| 7–10 | Politecnico di Torino and Politecnico di Milano theses, Springer chapter 978-3-319-39564-7_19, IFIP mirror | theses, chapter | academic |

Variant "process mining manufacturing use cases": aimultiple.com/process-mining-use-cases (research.aimultiple.com/process-mining-manufacturing now redirects there; approx. 5,000–6,000 words across all industries, only two production use cases: reduced cycle time and reduced rework; FAQ: process mining vs. data mining, how process mining works, process intelligence vs. process mining, challenges, object-centric process mining), core.ac.uk, Paderborn University, Appian documentation. Variant "... MES data production": a Silesian University of Technology paper, the Polimi thesis, core.ac.uk, arXiv 2201.06465 ("Process Visualization of Manufacturing Execution System (MES) Data"), industrial-production.de and Lee et al. 2025.

**Result:** the main keyword is still held entirely by academic sources; Formaspace and Appian, the practitioner pages from the first analysis, were not in this check's top results. A practitioner article with a worked MES/ERP event log remains the gap. Question not yet answered by us: process mining vs. data mining (added). The other AIMultiple questions are covered (how it works: section 1; challenges and object-centric: FAQ).

---

# Process Mining in Manufacturing: How to Turn MES and ERP Event Logs Into Flow Insight

*Last updated: November 20, 2026 · Part of the guide [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)*

> **Short answer:** Process mining in manufacturing reconstructs how production orders, lots and parts actually flow through a plant from the timestamps that ERP, MES, warehouse, quality and maintenance systems already record. It discovers the real process, checks it against the planned routing (conformance checking) and adds times, waiting and rework to the picture. The hard part in production is not the algorithm but the event log: choosing what counts as a case, joining data across systems and knowing what each timestamp means.

This deep dive belongs to our pillar guide [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/). In the twin vocabulary of that guide, process mining builds a data-driven **digital shadow** of the process: it shows what happened, based on recorded events. Its sibling, [manufacturing simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/), tests what would happen under changes. The two work best together.

Much of the published process mining material deals with purchase-to-pay or order-to-cash. Production is different: one order splits into several lots, several orders share one material lot, machines process batches, and half the timestamps are booked by people after the fact. We go through these differences with a worked example you can follow line by line.

### Key takeaways

- Process mining has three core types: **discovery** (build a model from the log), **conformance checking** (compare a model with the log) and **enhancement** (extend a model with times, resources and other data from the log) [2].
- The minimum event log is **case ID, activity, timestamp** [2]. In a plant, the case can be a production order, a lot, a serial number or a machine, and each choice gives a different picture.
- **Object-centric process mining** handles orders, lots, machines and inspection lots at the same time instead of forcing one case ID. **OCEL 2.0** is the current exchange format for such logs [4]; **IEEE 1849-2023 (XES)** is the standard for classic single-case logs [3].
- In our worked example, six orders spend only 12.5% of their lead time in recorded activities, and rework consumes 18% of the bottleneck machine's busy time. One "deviation" turns out to be a late warehouse booking, not a process problem.
- Process mining shows what happened; it does not tell you what will happen if you change something. Use [simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) for that, fed with the distributions the mining delivers [5].

## Table of contents

1. [What is process mining?](#1-what-is-process-mining)
2. [Why manufacturing data are different](#2-why-manufacturing-data-are-different)
3. [Where the events come from in a plant](#3-where-the-events-come-from-in-a-plant)
4. [Worked example: an event log from MES and ERP data](#4-worked-example-an-event-log-from-mes-and-erp-data)
5. [The same example, object-centric](#5-the-same-example-object-centric)
6. [Use cases in manufacturing](#6-use-cases-in-manufacturing)
7. [Process mining, value stream mapping, simulation and MES dashboards](#7-process-mining-value-stream-mapping-simulation-and-mes-dashboards)
8. [Tools and standards](#8-tools-and-standards)
9. [Implementation in seven steps](#9-implementation-in-seven-steps)
10. [People, privacy and works councils](#10-people-privacy-and-works-councils)
11. [Common mistakes](#11-common-mistakes)
12. [FAQ](#12-faq)
13. [Conclusion](#13-conclusion)

## 1. What is process mining?

The Process Mining Manifesto of the IEEE Task Force on Process Mining (2012) gives a compact definition of the field. It names three types of process mining [2]:

- **Discovery:** "A discovery technique takes an event log and produces a model without using any a-priori information."
- **Conformance:** "an existing process model is compared with an event log of the same process."
- **Enhancement:** "the idea is to extend or improve an existing process model using information about the actual process," for example with times or resources.

The manifesto also sets six guiding principles. Two of them matter most in a plant: **"Log Extraction Should Be Driven by Questions"** and **"Process Mining Should Be a Continuous Process"** [2]. It lists eleven challenges, the first being "Finding, Merging, and Cleaning Event Data" [2], which is exactly where production projects spend most of their effort.

Wil van der Aalst's textbook *Process Mining: Data Science in Action* (2nd edition, 2016) is the standard reference for the algorithms, from process discovery to conformance checking and predictive analytics [1].

In the glossary of the manifesto, an **event log** is a "collection of events used as input for process mining," a **case** is "the entity being handled by the process that is analyzed," and an **activity** is "a well-defined step in the process" [2]. Each event carries at least a case reference, an activity and a timestamp; resource and other attributes are optional.

## 2. Why manufacturing data are different

Finance processes usually have a natural case: an invoice, a purchase order. Production rarely does. Four properties make plant data harder:

1. **Several candidate cases.** A sales order creates production orders; a production order consumes material lots and produces serial numbers; operations run on machines; inspections create inspection lots. Each is a valid case, and each gives a different process map.
2. **Divergence and convergence.** One raw-material lot feeds several production orders (divergence). One assembly consumes components from several orders (convergence). If you flatten the data to a single case ID, shared events are either duplicated or lost.
3. **Batching.** A heat-treat furnace or a washing machine processes parts from several orders in one run. In an order-centric log, the same physical event appears several times.
4. **Timestamp semantics.** A "confirmation" in ERP may be the time someone booked the operation, not the time it happened. A PLC signal is precise but has no order context. MES sits in between.

The manifesto rates event-log quality on five levels, from the top level (trustworthy, complete, semantically annotated) down to the lowest level (hand-recorded trails that may not match reality). **ERP tables** sit on the third of five levels: "automatically recorded and trustworthy, but not necessarily complete" [2]. That is a fair description of most plant data: good enough to start, never good enough to trust blindly.

The classic answer to points 1 to 3 is one case notion per question. The newer answer is **object-centric process mining**, where every event can refer to several objects (order, lot, machine) of different types. The OCEL 2.0 specification, published by the OCEL team at RWTH Aachen University, defines events, objects, event-to-object and object-to-object relationships with qualifiers, and object attributes whose values change over time [4]. Section 5 shows what this looks like.

## 3. Where the events come from in a plant

In ISA-95 terms, ERP sits at level 4 and MES at level 3; our planned pillar on [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned) explains the layers. For process mining, what matters is which system records which event, with which key and which timestamp meaning.

| System | Typical events | Natural case / object keys | Timestamp meaning | Pitfalls |
|---|---|---|---|---|
| ERP (production planning) | order created, released, operation confirmed, goods issue, goods receipt, order closed | sales order, production order, material document | often booking time | batch confirmations at shift end; backflushing creates events that never "happened" as such |
| MES | operation start/end, setup start/end, interruption with reason code, quantity good/scrap | production order, operation, serial or lot, work center | close to physical time if confirmed at the machine | manual start/stop by operators; local time vs. UTC |
| WMS / warehouse | pick, stage at line, transfer, put-away | transfer order, handling unit, lot | scan time | staging booked late or in bulk |
| QMS | inspection lot created, result recorded, usage decision, nonconformance | inspection lot, nonconformance number | entry time of the result | results entered hours after the test |
| CMMS / maintenance | work order created, started, completed | maintenance order, equipment | entry time | response time and repair time mixed |
| PLC / historian | cycle start/end, alarm, state change | machine, signal | precise machine time | no order reference without MES context |

Rule of thumb from projects: start with ERP and MES for the order flow, add WMS and QMS where waiting and rework matter, and use PLC data only where the question needs second-level precision (cycle-time variation, micro-stops). That is a practical heuristic, not a standard.

## 4. Worked example: an event log from MES and ERP data

The example is illustrative: six production orders for a machined part, released on November 2, 2026. ERP supplies release and goods receipt, WMS the staging at the line, MES the operations on milling machine MC-07 and deburring station DB-02, QMS the final inspection. All data are made up to show the method; the numbers below were computed from them.

### 4.1 The event log (excerpt)

The full log has 40 events. Two orders are shown here.

| Case (production order) | Activity | Start | End | Resource | Source |
|---|---|---|---|---|---|
| PO-4712 | Order released | 11-02 06:15 | 11-02 06:15 | n/a | ERP |
| PO-4712 | Material staged | 11-02 10:05 | 11-02 10:20 | line 3 | WMS |
| PO-4712 | Milling | 11-02 15:40 | 11-02 17:50 | MC-07 | MES |
| PO-4712 | Deburring | 11-03 08:20 | 11-03 09:00 | DB-02 | MES |
| PO-4712 | Final inspection | 11-03 11:10 | 11-03 11:35 | QC | QMS |
| PO-4712 | Rework | 11-03 13:00 | 11-03 14:30 | MC-07 | MES |
| PO-4712 | Final inspection | 11-03 15:10 | 11-03 15:30 | QC | QMS |
| PO-4712 | Goods receipt | 11-03 15:45 | 11-03 15:45 | n/a | ERP |
| PO-4713 | Order released | 11-02 06:20 | 11-02 06:20 | n/a | ERP |
| PO-4713 | Milling | 11-02 18:00 | 11-02 20:05 | MC-07 | MES |
| PO-4713 | Material staged | 11-02 18:30 | 11-02 18:40 | line 3 | WMS |
| PO-4713 | Deburring | 11-03 09:10 | 11-03 09:45 | DB-02 | MES |
| PO-4713 | Final inspection | 11-03 11:40 | 11-03 12:00 | QC | QMS |
| PO-4713 | Goods receipt | 11-03 12:20 | 11-03 12:20 | n/a | ERP |

To build such a log, you join ERP order tables, MES operation records, WMS transfer orders and QMS inspection lots on the production order number, map system-specific codes to readable activity names, and convert all timestamps to one time base. Note that the operator is deliberately not in the log (see section 10).

### 4.2 Discovery: variants

Sorting each order's events by start time gives three variants:

| Variant | Orders | Sequence |
|---|---|---|
| V1 (planned path) | 3 | Released → Staged → Milling → Deburring → Inspection → Goods receipt |
| V2 (rework loop) | 2 | Released → Staged → Milling → Deburring → Inspection → Rework → Inspection → Goods receipt |
| V3 (sequence anomaly) | 1 | Released → Milling → Staged → Deburring → Inspection → Goods receipt |

The directly-follows counts show the same picture: "Inspection → Rework" and "Rework → Inspection" occur twice each, "Released → Milling" and "Milling → Staged" once each.

### 4.3 Enhancement: times

| Metric | Value | How it is computed |
|---|---|---|
| Average lead time (release to goods receipt) | 31.2 h | mean over the six orders (range 29.3 to 33.7 h) |
| Recorded activity time | 3.2 to 5.3 h per order | sum of event durations |
| Share of lead time in recorded activities | 12.5% overall | sum of activity times ÷ sum of lead times; the rest is waiting or unrecorded |
| Lead time with rework vs. without | 33.6 h vs. 30.0 h | mean of V2 orders vs. V1 and V3 orders |
| Waiting from staged to milling start | 3.2 h, 5.3 h, 18.9 h, 20.9 h, 22.8 h | orders 4711, 4712, 4714, 4715, 4716 (4713 excluded, see below) |
| MC-07 busy time | 15.7 h, of which rework 2.8 h (18%) | sum of milling and rework durations on MC-07 |

Three findings for the plant:

1. **MC-07 is the constraint, and it runs out of shift.** Milling runs almost back-to-back on MC-07 from 13:05 to 20:05 on day 1 and from 06:05 to 12:45 on day 2. Nothing runs overnight. The last three orders wait about 19 to 23 hours between staging and milling.
2. **All six orders were released within one hour,** although MC-07 can mill only three to four of them per eight-hour shift (about 2.1 hours each). The early release adds WIP and waiting without adding output. A release rule tied to the constraint's capacity (drum-buffer-rope or CONWIP, see the planned [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/) pillar) would shorten lead time at the same output.
3. **Rework runs on the constraint.** 18% of MC-07's busy time went to rework of two orders. Every rework hour on the constraint is an hour of lost output for the whole cell: 2.8 hours equal about 1.3 orders' worth of milling (2.8 ÷ 2.14 h) in two days. That turns a quality problem into a capacity problem.

Six orders are far too few for statistics; the example shows the method. In a real project you would look at several weeks of orders and at percentiles, not only means.

### 4.4 Conformance checking: the routing vs. the log

The ERP routing says: Released → Staged → Milling → Deburring → Inspection → Goods receipt. Against that model:

- **3 of 6 orders (V1) fit** the routing exactly.
- **2 orders (V2)** deviate through the rework loop. Whether that counts as a deviation depends on whether the routing models rework as an allowed exception. Here it does not, so both are flagged.
- **1 order (V3)** shows milling *before* staging. Physically impossible: the material must be at the machine before milling. On the floor, the explanation is a staging scan booked 30 minutes after milling had already started (staging recorded 18:30, milling started 18:00). This is a **data-quality finding**, not a process deviation.

V3 holds the main lesson of the example. Conformance checking on plant data finds process problems and booking problems, and you have to tell them apart with people who know the floor. Here, 3 of 6 traces fit completely (a trace-level fitness of 0.5); formal techniques also compute finer measures, such as how much of each trace a model can replay, so a trace with one extra step still scores high. The manifesto lists balancing fitness, simplicity, precision and generalization as a core challenge [2].

A word on terms: "conformance" in process mining means conformance of the event log to a process model. It is not product conformity in the quality-management sense. A rework loop in the log may correspond to a nonconformance record and a disposition in the QMS, which is the place to analyze the quality side. In a 2025 case study on a fully automated factory testbed, alignment-based conformance checking gave a fitness of 1.0, and 64 of 70 planned products completed through the three main variants [5].

### 4.5 From mining to action and to simulation

The analysis leads to three candidate actions: release orders to the constraint's rhythm, reduce rework at its root (inspection data for a root-cause analysis), and test whether a third shift or an offload of milling pays off. The first two are low-cost. The third is a capacity decision with variability and breakdowns involved: a case for [simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/). The mined event log provides the input distributions for processing, waiting and rework rates, and it serves as validation data for the model. Lee, Shin and Lee did exactly that on their testbed: process mining identified the CNC bottleneck, and simulation showed that adjusted CNC settings plus three AGVs could reach the target of 70 units, while more AGVs did not raise output [5]. Their results come from a single testbed, as the authors state [5].

## 5. The same example, object-centric

In the order-centric log above, the material lot, the machine and the inspection lot are only attributes. Suppose lot L-2207 of bar stock was staged once and feeds both PO-4713 and a follow-up order PO-4717 (not in the excerpt). Flattened by order, the one physical staging event appears twice, and a count of "staging events" overstates warehouse activity. An object-centric log keeps one event and links it to several objects.

**Objects (excerpt)**

| Object ID | Object type | Attributes |
|---|---|---|
| PO-4713 | production order | material, quantity |
| PO-4717 | production order | material, quantity |
| L-2207 | material lot | supplier, heat number |
| MC-07 | machine | work center |
| IL-9031 | inspection lot | inspection plan |

**Events with event-to-object (E2O) relationships and qualifiers**

| Event | Activity | Time | Related objects (qualifier) |
|---|---|---|---|
| e101 | Material staged | 11-02 18:30 | L-2207 (staged lot), PO-4713 (for order), PO-4717 (for order) |
| e102 | Milling | 11-02 18:00 | PO-4713 (processed order), L-2207 (consumed lot), MC-07 (executed on) |
| e103 | Final inspection | 11-03 11:40 | PO-4713 (inspected order), IL-9031 (inspection lot) |

**Object-to-object (O2O) relationship:** L-2207 "reserved for" PO-4713 and PO-4717.

These are the building blocks of OCEL 2.0: events with exactly one type, objects with exactly one type, E2O and O2O relationships with qualifiers, and object attributes that can change over time. The specification offers three exchange formats: SQLite, XML and JSON [4]. From such a log you can look at the same data per order (lead time), per lot (where material waits), per machine (utilization and sequence) and per inspection lot (time to usage decision) without rebuilding the extraction each time.

## 6. Use cases in manufacturing

| Use case | Question | Main case or objects | Data needed |
|---|---|---|---|
| Lead time and waiting | Where do orders wait, and how long? | production order | ERP release/receipt, MES operations |
| Bottleneck and constraint behavior | Which resource drives lead time, and when does it idle? | machine + order | MES start/end, shift calendar |
| Rework and scrap loops | How often do orders loop back, and on which resource? | order, inspection lot | MES, QMS |
| Routing conformance | Do orders follow the planned routing? | order | ERP routing, MES operations |
| Order release and WIP | Are orders released faster than the constraint can work? | order | ERP release dates, MES |
| Material availability | Do orders wait for staging or missing parts? | order + lot | WMS, ERP goods issue |
| Maintenance flow | How long from failure to repair start to completion? | maintenance order | CMMS, MES interruptions |
| Engineering change | How long does an engineering change take from request to first produced part? | change order + production order | PLM, ERP |
| Order-to-delivery | Where does time go between sales order and shipment? | sales order + production order | ERP sales and delivery |

Published manufacturing cases on vendor sites mix production with procurement and master data. Celonis' story for automotive supplier Eissmann, for example, covers purchase-to-pay, master data management and production via the MES, and reports "reduced throughput times by 30 percent" for a master-data process, with no figure for production [7]. Treat such figures as vendor claims that describe one company.

## 7. Process mining, value stream mapping, simulation and MES dashboards

| Method | Answers | Data | Time view | Limits |
|---|---|---|---|---|
| [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned) | How does material and information flow, where is waste? | walk-through, a few measurements | snapshot, averages | static, manual, one product family at a time |
| Process mining | What really happened, in which variants, with which times? | event logs from ERP, MES, WMS, QMS | historical, all cases | needs clean events; no "what if" |
| [Manufacturing simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) | What will happen if we change something? | model + distributions | future scenarios | needs validation; model effort |
| MES dashboards | What is happening now? | MES, machine data | real time | shows states, rarely end-to-end flow |

The methods complement each other. A practical sequence: map the value stream with the team on the floor, check with process mining whether the map holds for all orders (not only the ones you watched), and test the future state with simulation before you invest. Teams that already work with dynamic value stream models, for example in iFAKT Polaris, can carry mined times into those models; see our planned pillar [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned). Any DES tool works the same way.

**Note: The author works at iFAKT GmbH.**

## 8. Tools and standards

**Standards and formats**

| Standard / format | What it is | Use |
|---|---|---|
| IEEE 1849-2023 (XES) | "IEEE Standard for eXtensible Event Stream (XES) for Achieving Interoperability in Event Logs and Event Streams," approved June 5, 2023, supersedes IEEE 1849-2016 [3] | exchange of classic case-centric logs between tools |
| OCEL 2.0 | object-centric event log specification with SQLite, XML and JSON formats [4] | exchange of object-centric logs |
| Process Mining Manifesto | guiding principles, challenges and log maturity levels [2] | project method and data-quality assessment |

**Tools.** The market ranges from enterprise platforms to open-source research tools. The table names tools found during research for this article and states what their sources say; it is not a ranking.

| Tool | Type | Manufacturing angle according to the source |
|---|---|---|
| Celonis | commercial platform | manufacturing industry page with customer figures; lists ERP, CRM, MES and PLM as source systems [6] |
| QPR | commercial | manufacturing page on downtime, efficiency, quality and compliance [8] |
| Appian | commercial | blog on process mining in manufacturing with a production-line throughput example [9] |
| ProM | open-source research framework | linked from the Formaspace article [10] |
| Microsoft Power Automate Process Mining | commercial, part of Power Platform | relevant for Microsoft 365 / Power Platform shops; Microsoft describes it as the process mining capability in Power Automate that extracts event data from systems of record [11]; Microsoft acquired the process mining vendor Minit in 2022 [12] |

Questions to ask any vendor: Can the tool handle object-centric logs or only one case ID? Which connectors exist for your ERP and MES, and who maintains the extraction? How are timestamp semantics and time zones handled? Can results be exported as distributions for simulation? Where is the data hosted, and how are personal data protected?

## 9. Implementation in seven steps

1. **Write down the question** (lead time, rework, conformance, release behavior). The manifesto's principle "Log Extraction Should Be Driven by Questions" [2] protects against a data lake project without a purpose.
2. **Choose the case notion or objects.** Order-centric for lead time; machine-centric for sequences and idle time; object-centric if lots, batches or assemblies matter.
3. **Map the systems and keys** (section 3) and agree which timestamp counts as the event time.
4. **Extract and join** ERP, MES and other sources; convert to one time base; give activities readable names. Extract from replicas or exports rather than querying the production MES database, and route OT-side data through the plant's security zones (see our [OT cybersecurity](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) pillar, planned).
5. **Clean and test the log** with people from the floor: impossible sequences, duplicated batch events, missing ends, implausible durations.
6. **Discover, check conformance, enhance.** Start with variants and directly-follows counts, then waiting times and resource views; separate data problems from process problems.
7. **Act and repeat.** Pick one or two actions, measure the effect with the same log a few weeks later and keep the extraction running ("Process Mining Should Be a Continuous Process" [2]).

Steps 3 to 5 usually take most of the time, consistent with the manifesto's first challenge on finding, merging and cleaning event data [2].

## 10. People, privacy and works councils

MES and ERP logs often contain the operator who started or confirmed an operation. Process mining on such data can turn into individual performance monitoring very quickly, which damages trust on the floor and may be legally restricted.

- **Leave the operator out** unless the question needs it, as in the example. Most flow questions are answered per order, machine and shift.
- **If people data are needed** (for example skills and staffing), pseudonymize and aggregate, and agree the purpose in writing.
- **Involve the workforce early.** In unionized US plants, involve the union before rollout. In German plants, works councils have co-determination rights over the introduction and use of technical systems designed to monitor employee behavior or performance (section 87(1) no. 6 of the Works Constitution Act, BetrVG) [13], and GDPR applies to personal data in the EU.
- **Use the results for the process, not against individuals.** If a rework loop shows up, the question is why the process allows it, not who was on shift.
- **Show the findings to the operators first.** They often know the explanation (like the late staging scan in the example) and become owners of the fix.

## 11. Common mistakes

| Mistake | Effect | Better |
|---|---|---|
| Starting without a question | a "spaghetti" process map that nobody acts on | one question, one case notion, one owner |
| Forcing one case ID on lot and batch data | duplicated or missing events, wrong counts | choose the case per question or go object-centric [4] |
| Trusting booking times as physical times | false deviations like V3 in the example | check timestamp semantics with the floor |
| Mixing time zones and clock offsets | negative durations, wrong sequences | normalize to one time base first |
| Reporting averages only | hides the long tail that customers feel | percentiles and per-variant times |
| Treating vendor ROI figures as benchmarks | inflated business cases | use your own baseline from the log |
| Monitoring individuals | loss of trust, legal risk | aggregate, pseudonymize, agree the purpose |
| Stopping at the map | no improvement | link findings to actions, re-measure, and use simulation for capacity decisions |

## 12. FAQ

### What is process mining in manufacturing?

The analysis of event data from ERP, MES and related systems to reconstruct how orders, lots and parts actually flow through production, compare that flow with the planned routing and measure waiting, rework and lead times [1][2].

### How is process mining used in manufacturing?

Typical uses are lead-time and waiting analysis, bottleneck behavior, rework loops, routing conformance, order release behavior, material availability and maintenance flows (section 6).

### What data do you need for process mining?

At minimum a case ID, an activity name and a timestamp per event [2]. In production you also want start and end times, the resource (machine), quantities and the source system, plus the planned routing for conformance checking.

### Can process mining use MES data?

Yes. MES operation start and end records are often the best source for shop-floor timing because they are recorded close to the machine. Combine them with ERP order data for release and goods receipt, and check how operators confirm operations before trusting the times.

### What is an event log?

A "collection of events used as input for process mining" [2]. Each event refers to a case (or, object-centric, to several objects), an activity and a timestamp. Logs are exchanged as XES (IEEE 1849-2023) [3] or OCEL 2.0 [4].

### What is object-centric process mining?

An approach in which each event can relate to several objects of different types, such as a production order, a material lot and a machine, instead of a single case ID. It avoids the duplication and loss of events that occur when lot and batch data are flattened. OCEL 2.0 defines the format [4].

### What is the difference between process mining and value stream mapping?

Value stream mapping is a team exercise on the floor that produces a snapshot with averages. Process mining uses recorded data for all orders over a period. Mining can check whether the value stream map holds, and the map gives the mining results a lean frame (section 7).

### What is the difference between process mining and simulation?

Process mining analyzes what happened; simulation tests what would happen after a change. Mined event logs are a good source of input distributions and validation data for a simulation model [5].

### What is the difference between process mining and data mining?

Data mining looks for patterns in data in general; the Process Mining Manifesto notes that "most data mining techniques are not process-centric at all" [2]. Process mining works on event logs with a case, an activity and a timestamp per event and discovers, checks or enhances a process model. The manifesto calls it "an important bridge between data mining and business process modeling and analysis" [2].

### What are the challenges of process mining in production?

Finding, merging and cleaning event data across systems [2], choosing the case notion, handling batches and lots, unclear timestamp meaning, and the protection of employee data.

### Which process mining tools are used in manufacturing?

Enterprise platforms such as Celonis and QPR publish manufacturing use cases [6][8]; open-source tools such as ProM are used in research [10]. Choose by connectors to your ERP and MES, object-centric support and data hosting.

## 13. Conclusion

Process mining in manufacturing works when you treat the event log as the product. Discovery and conformance techniques are well established, and standardized formats exist (XES, OCEL 2.0). What decides success is the plant-specific work: choosing what counts as a case, joining ERP, MES, warehouse and quality data on the right keys, and knowing which timestamps describe physical events. In the worked example, six orders and 40 events were enough to show a constraint that idles overnight, a release rule that floods the floor, rework that eats 18% of the bottleneck's time and a booking delay that looks like a process deviation. Start with one question like these, keep the extraction running, and hand capacity decisions to simulation with the mined data as input.

## Further reading on m365.fm

**Parent pillar**

- [Digital Twin in Manufacturing: The Complete Guide](https://www.m365.fm/en/learn/digital-twin-manufacturing/)

**Sibling cluster**

- [Manufacturing Simulation: How Discrete Event Simulation Works](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) (planned)

**Related guides** (links go live after publication)

- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)

**Entity pages**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about digitalizing manufacturing with Microsoft 365 and Azure, value stream methods, production planning, process data and digital twins.

**Note: The author works at iFAKT GmbH.**

*[Editor: have the author add role, background and a profile photo.]*

---

# Sources

All online sources accessed on November 20, 2026, and opened for this article unless noted.

1. van der Aalst, W. (2016): Process Mining: Data Science in Action. 2nd ed., Springer, Berlin/Heidelberg. https://link.springer.com/978-3-662-49850-7
2. van der Aalst, W.; Adriansyah, A.; Alves de Medeiros, A. K.; et al. (2012): Process Mining Manifesto. In: Daniel, F.; Barkaoui, K.; Dustdar, S. (eds.): Business Process Management Workshops (BPM 2011). Lecture Notes in Business Information Processing 99, Springer, pp. 169–194. DOI: [10.1007/978-3-642-28108-2_19](https://doi.org/10.1007/978-3-642-28108-2_19). Full text used: https://art.torvergata.it/bitstream/2108/39458/2/chp_10.1007_978-3-642-28108-2_19%281%29.pdf
3. IEEE 1849-2023: IEEE Standard for eXtensible Event Stream (XES) for Achieving Interoperability in Event Logs and Event Streams (approved June 5, 2023; published September 8, 2023; supersedes IEEE 1849-2016). https://standards.ieee.org/ieee/1849/10907
4. Berti, A.; Koren, I.; Adams, J. N.; Park, G.; Knopp, B.; Graves, N.; Rafiei, M.; Liß, L.; Tacke Genannt Unterberg, L.; Zhang, Y.; Schwanen, C.; Pegoraro, M.; van der Aalst, W. M. P. (2023/2024): OCEL (Object-Centric Event Log) 2.0 Specification. Version dated October 16, 2023; arXiv:2403.01975. https://arxiv.org/pdf/2403.01975
5. Lee, Y.; Shin, J.; Lee, W. (2025): Manufacturing process analysis framework for process mining: case study of fully automated factory applications. International Journal of Advanced Manufacturing Technology 136, pp. 5641–5664. DOI: [10.1007/s00170-025-15029-5](https://doi.org/10.1007/s00170-025-15029-5)
6. Celonis: Manufacturing solutions (industry page; vendor claims). https://www.celonis.com/solutions/industries/manufacturing
7. Celonis: Eissmann success story (case study collected by the IEEE Task Force on Process Mining; vendor claims). https://www.win.tue.nl/ieeetfpm/casestudies/celonis_eissmann_-_success_story.pdf
8. QPR Software: Process mining in manufacturing (industry page; vendor claims). https://www.qpr.com/industries/manufacturing
9. Appian: Process mining in manufacturing (blog, 2021). https://appian.com/blog/2021/process-mining-in-manufacturing
10. Formaspace: How process mining helps manufacturing and assembly (article; links to ProM, XES and the IEEE Task Force). https://formaspace.com/articles/industrial/process-mining-helps-manufacturing-assembly/
11. Overview of process mining in Power Automate. Microsoft Learn. https://learn.microsoft.com/en-us/power-automate/process-mining-overview (accessed November 20, 2026)
12. Mackie, K.: Microsoft Buys Process Mining Company Minit. Redmond Magazine, March 31, 2022. https://redmondmag.com/Articles/2022/03/31/Microsoft-Buys-Process-Mining-Company-Minit.aspx (accessed November 20, 2026)
13. § 87 Betriebsverfassungsgesetz (Works Constitution Act), paragraph 1 no. 6. Gesetze im Internet, Federal Ministry of Justice (German). https://www.gesetze-im-internet.de/betrvg/__87.html (accessed November 20, 2026)

---

# Editorial notes

## URL and canonical

- Cluster URL nested under the parent pillar is an assumption from the brief; confirm with the site structure. Self-referencing canonical, no hreflang pair.

## Worked example

- The event log (six orders, 40 events, November 2–3, 2026) is **invented for illustration** and labeled as such. All metrics were computed from it with a short script: lead times 29.33/33.50/30.00/29.67/33.67/31.08 h (mean 31.2 h); recorded activity share 12.5% overall; V1 = 3, V2 = 2, V3 = 1 orders; MC-07 busy 15.67 h, rework 2.83 h (18.1%); waits staged → milling 3.17/5.33/18.92/20.92/22.83 h. Recommendation: offer the log as a CSV download (and an OCEL 2.0 JSON version) so readers can load it into a tool.
- Lot L-2207 and inspection lot IL-9031 in section 5 are added for the object-centric illustration.

## Unverified items and points to check before publication

- **Microsoft Power Automate Process Mining (closed November 20, 2026):** Microsoft Learn overview opened [11]; Minit acquisition confirmed via Redmond Magazine, March 31, 2022 [12]. Licensing not stated on the overview page; not mentioned in the article.
- **German works council co-determination (closed November 20, 2026):** § 87(1) no. 6 BetrVG opened on gesetze-im-internet.de [13].
- **Gartner:** the brief asks for the Gartner market guide. A search for the Gartner Market Guide / Magic Quadrant for process mining could not be completed (search budget exhausted). Nothing from Gartner is cited in the article. Decision for Mirko: add a verified Gartner reference later or leave it out.
- **Other tools not verified and therefore not listed:** SAP Signavio, UiPath, ARIS, PM4Py, Disco, Apromore.
- **IFIP paper "Process Mining in Manufacturing: Goals, Techniques and Applications"** appeared in the SERP (dl.ifip.org, IFIP AICT 591) but could not be opened (bot protection); not cited. Also not opened: Springer chapter 10.1007/978-3-662-65004-2_15 and IJPR 10.1080/00207543.2021.1906460 (fetch budget). Good candidates for a later review-literature sentence.
- **Section 3 rule of thumb** (start with ERP and MES) is labeled as heuristic.

## Vendor-only claims

- Celonis figures (Siemens "$15M", Alstom "10%" targeted, TD Synnex "57%") [6] and the Eissmann "30 percent" [7] are vendor claims; only the Eissmann figure is quoted in the body, labeled.
- QPR headline figures [8] are not quoted.

## iFAKT and disclosure

- One short iFAKT mention in section 7 as one option next to "any DES tool"; disclosure exactly "**Note: The author works at iFAKT GmbH.**" after the passage and in the author box; no sponsorship label; no locations mentioned.

## Internal links

- Parent pillar in the first 150 words (H1 subline, intro) and in Further reading. Sibling (manufacturing-simulation) in intro, key takeaways, sections 4.5, 7, FAQ and Further reading. Pillars in body text: digital-twin-manufacturing, mes-isa-95, theory-of-constraints, value-stream-mapping, ifakt-polaris, ot-cybersecurity-iec-62443 (6) plus the sibling cluster. Remove "(planned)" once live.

## Recommended graphics

1. Diagram: one production order, one lot, one machine and their events (order-centric vs. object-centric view).
2. Process map of the example with the three variants and directly-follows counts.
3. Gantt chart of MC-07 over the two days showing the overnight idle time and the rework blocks.
4. Table graphic: system → event → key → timestamp meaning (section 3).

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Process Mining in Manufacturing: How to Turn MES and ERP Event Logs Into Flow Insight",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/digital-twin-manufacturing/"},
      "about": ["process mining", "manufacturing", "event log", "object-centric process mining"]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": "[include all 11 FAQ questions from section 12 with their answers]"
    }
  ]
}
```

## Cannibalization

- The parent pillar does not cover process mining; no overlap. The pillar should link to this cluster from its data-foundation section (section 5) and from section 6 in the final consistency check.
- The planned mes-isa-95 pillar may mention process mining briefly; it should link here rather than cover it.

## Review log

Expert-panel review with nine roles, three full rounds (review, cross-check, re-optimize), run on November 20, 2026, per the course-expansion brief and Mirko's update of the same day (at least three rounds per cluster).

### Round 1

| Role | Verdict | Main findings |
|---|---|---|
| 1. Practitioner (US plant manager, 20 years) | changes needed | The three findings in 4.3 are what a plant would act on. "Milling runs back-to-back" is not exact (gaps of 10 to 20 minutes); "about three orders per shift" understates a 2.1-hour operation in an 8-hour shift. |
| 2. Academic (IE / OM professor) | changes needed | (1) "3 of 6 fit" is a trace-level count; distinguish it from replay-based fitness. (2) Say that six cases give no statistics; the example illustrates the method. (3) Manifesto quotes checked against the full text: correct. |
| 3. IT/OT architect | changes needed | Extraction should not query the production MES database directly; mention replicas/exports and OT security zones (ISA/IEC 62443), with a link to the planned OT security pillar. Timestamp and time-zone points in sections 3 and 11: OK. |
| 4. Quality lead (CQE / Black Belt, AS9100/IATF) | changes needed | "Conformance checking" collides with product conformity in quality language. Clarify the term and point to nonconformance records and dispositions in the QMS for the quality side of rework loops. |
| 5. Finance (plant controller) | changes needed | Express the rework share of the constraint in lost output, not only in percent. No vendor ROI figures as benchmarks (section 11 already says so: OK). |
| 6. Worker voice / lean coach | changes needed | Section 10 is good. Add: share findings with operators first; they often know the cause and should own the fix. |
| 7. SEO specialist (US) | changes needed | Meta title is 55 characters (not 54), description 145 (not 146): correct the counts. Main keyword in title, H1, short answer, first H2-level FAQ and conclusion: OK. Parent link within the first 150 words: OK. PAA questions covered: 10 FAQ. Word count 4,716: within range. |
| 8. Fact checker | changes needed | (1) "still the best compact definition" is an opinion. (2) Example: staging at 18:30 vs. milling at 18:00 is 30 minutes, not "about 25". (3) Section 5 links lot L-2207 to PO-4714, but the log shows PO-4714 staged separately at 11:00; inconsistent. (4) "QPR ProcessAnalyzer": product name not on the opened page [8]. (5) "ProM ... as the academic tool": Formaspace only links ProM [10]. (6) "Appian (process automation with process mining)": not stated on the opened page. (7) Microsoft Power Automate Process Mining and Gartner could not be verified (search and fetch budgets exhausted). |
| 9. Critic | changes needed | "Most process mining content is written for purchase-to-pay" is an unsourced generalization. "The best protection against a data lake project" overclaims. iFAKT mention in section 7 is short, framed as one option next to any DES tool, disclosure exact: OK. No em-dash chains or listed AI clichés (grep). |

### Debates in round 1

- **Academic vs. SEO (fitness metrics):** The academic wanted a formal definition of alignment-based fitness; the SEO specialist warned that formulas would lose the plant reader. **Resolution:** one sentence that separates trace-level fitness (0.5 in the example) from replay-based measures, plus the manifesto's quality criteria [2].
- **IT/OT vs. practitioner (OT security):** IT/OT asked for a security subsection. The practitioner argued that it belongs in the OT security pillar. **Resolution:** one sentence in step 4 and a link to the planned OT cybersecurity pillar.
- **Critic vs. SEO (Power Automate row):** The critic did not want an unverified row in a table. The SEO specialist argued that Microsoft's tool is the most relevant one for the m365.fm audience. **Resolution:** keep the row with a visible [unverified] marker and list it as a decision for Mirko in the editorial notes.

### Optimization after round 1 (old -> new)

| Location | Old | New |
|---|---|---|
| Metadata | "(54 characters)", "(146 characters)" | "(55 characters)", "(145 characters)" |
| Intro | "Most process mining content is written for purchase-to-pay or order-to-cash in finance and procurement." | "Much of the published process mining material deals with purchase-to-pay or order-to-cash." |
| Section 1 | "is still the best compact definition of the field" | "gives a compact definition of the field" |
| 4.3 table | "3.2 to 5.3 h ÷ lead time" | "sum of activity times ÷ sum of lead times" |
| 4.3 finding 1 | "Milling runs back-to-back" | "Milling runs almost back-to-back" |
| 4.3 finding 2 | "MC-07 can mill about three of them per shift" | "only three to four of them per eight-hour shift (about 2.1 hours each)" |
| 4.3 finding 3 | "... which makes the quality problem a capacity problem." | "... 2.8 hours equal about 1.3 orders' worth of milling (2.8 ÷ 2.14 h) in two days." + new paragraph "Six orders are far too few for statistics ..." |
| 4.4 | "booked about 25 minutes after" | "booked 30 minutes after" |
| 4.4 | "Formal conformance techniques compute measures such as fitness (how much of the log the model can replay)" | "Here, 3 of 6 traces fit completely (a trace-level fitness of 0.5); formal techniques also compute finer measures ..." + new paragraph distinguishing process-mining conformance from product conformity |
| Section 5 | lot L-2207 feeds PO-4713 and PO-4714 | lot L-2207 feeds PO-4713 and a follow-up order PO-4717 (not in the excerpt) |
| Section 8 | "QPR ProcessAnalyzer"; "ProM ... as the academic tool"; "Appian ... (process automation with process mining)" | "QPR"; "linked from the Formaspace article"; "blog on process mining in manufacturing with a production-line throughput example" |
| Section 9, step 1 | "is the best protection against a data lake project" | "protects against a data lake project without a purpose" |
| Section 9, step 4 | (none) | extraction from replicas or exports; OT data through security zones; link to OT cybersecurity pillar |
| Section 10 | (none) | new bullet "Show the findings to the operators first." |

### Round 2 (cross-check)

| Role | Verdict | Findings |
|---|---|---|
| 1. Practitioner | satisfied | Lost-output figure makes the rework case for the plant. |
| 2. Academic | satisfied | Fitness wording correct; statistics caveat in place. |
| 3. IT/OT architect | changes needed | Link formatting in step 4 shows "(planned)" twice. |
| 4. Quality lead | satisfied | Term clarification added. |
| 5. Finance | satisfied | No further remarks. |
| 6. Worker voice | satisfied | No further remarks. |
| 7. SEO specialist | satisfied | 4,901 words; internal links to parent, sibling and six pillars. |
| 8. Fact checker | changes needed | "ERP tables are placed in the middle" should name the level precisely (third of five in the manifesto's maturity scale). Re-verified online for this article: Manifesto full text (three types, glossary, 6 guiding principles, 11 challenges, five maturity levels) [2]; IEEE 1849-2023 (approval June 5, 2023, publication September 8, 2023, supersedes 1849-2016) [3]; OCEL 2.0 (authors, version date, E2O/O2O, qualifiers, three formats, published by the OCEL team at RWTH Aachen, not by the IEEE task force) [4]; Lee et al. 2025 (fitness 1.0, 64 of 70, three AGVs, single testbed) [5]; Celonis manufacturing page [6]; Eissmann case ("reduced throughput times by 30 percent", master data) [7]; QPR [8]; Appian [9]; Formaspace [10]; van der Aalst 2nd ed. 2016 (Springer page) [1]. |
| 9. Critic | changes needed | "V3 is the most valuable lesson" is a superlative. |

### Optimization after round 2 (old -> new)

| Location | Old | New |
|---|---|---|
| Step 4 | "(see the planned [OT cybersecurity](...) pillar) (planned)." | "(see our [OT cybersecurity](...) pillar, planned)." |
| Section 2 | "ERP tables are placed in the middle" | "ERP tables sit on the third of five levels" |
| 4.4 | "V3 is the most valuable lesson of the example." | "V3 holds the main lesson of the example." |
| Section 2 | "The classic answer to points 1 to 3 is to pick one case notion per question." | "The classic answer to points 1 to 3 is one case notion per question." |

### Round 3 (final review, re-optimize)

| Role | Verdict | Findings |
|---|---|---|
| 1. Practitioner | satisfied | Ready for a plant audience. |
| 2. Academic | satisfied | All example metrics rechecked against the script output (see editorial notes). |
| 3. IT/OT architect | satisfied | Link fixed. |
| 4. Quality lead | satisfied | No further remarks. |
| 5. Finance | satisfied | No further remarks. |
| 6. Worker voice | satisfied | No further remarks. |
| 7. SEO specialist | satisfied | Intro wording "This article is a cluster under" reads as site jargon; changed. Final 4,896 words, 10 FAQ, meta lengths correct. |
| 8. Fact checker | satisfied, with open items | No new facts added in round 3. Open: Microsoft Power Automate Process Mining [unverified], German works council provision [unverified], Gartner reference not found (not cited). Additional literature from the SERP (IFIP AICT 591, Springer chapter, IJPR 2021) not opened and not cited. |
| 9. Critic | satisfied | Conclusion wording "algorithms ... are mature" softened. Tone plain; vendor figures labeled; iFAKT neutral with exact disclosure, no sponsorship wording, no locations. |

**Optimization after round 3 (old -> new):** "This article is a cluster under our pillar guide" -> "This deep dive belongs to our pillar guide"; "The algorithms for discovery and conformance checking are mature and standardized formats exist" -> "Discovery and conformance techniques are well established, and standardized formats exist".

### Consensus statement

After three rounds, all nine roles sign off. The article answers "process mining in manufacturing" with the plant-specific part that competitors leave out (case notion, system map, timestamp semantics, object-centric logs), a computed worked example and a link to simulation. Vendor statements are labeled; open items are listed under Editorial notes.

**Final word count (`wc -w`, H1 through end of section 13 Conclusion): 4,896 words.**

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (accessed November 20, 2026):

- Microsoft Power Automate Process Mining: [unverified] -> confirmed on Microsoft Learn ("process mining capability in Power Automate", event data extracted from systems of record) [11]; Minit acquisition (2022) added with Redmond Magazine as source [12]. Row kept; marker removed.
- German works council co-determination: [unverified] -> confirmed, § 87(1) no. 6 BetrVG (introduction and use of technical systems designed to monitor behavior or performance) [13]; wording tightened to the statute.
- Gartner reference: still not searched (lower priority; nothing from Gartner is cited). Decision for Mirko unchanged.
- IFIP AICT 591, Springer chapter and IJPR 2021 paper: still not opened (fetch budget throttled); not cited.

Sign-off:
- **Fact checker:** satisfied; both open markers closed with primary sources.
- **Critic:** satisfied; the Microsoft row now carries a sourced description instead of a marker, no promotional wording.
- **Subject expert (process mining / IT/OT):** satisfied.

**Word count after round 4:** 4,928 words (+32).

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** web (no NEURONwriter analysis exists for this keyword). US web searches for "process mining in manufacturing", "process mining manufacturing use cases" and "process mining manufacturing MES data production" on November 20; pages opened on November 23, 2026 after the fetch quota reset. Search-tool order used as an approximation of the google.com SERP; no live PAA box available.

**SERP findings:** the top 10 for the main keyword are all academic (TUM, Springer, Polimi, IFIP, IJPR, Lee et al. 2025, theses). The use-case variant is led by AIMultiple (all industries, two production use cases). No practitioner page with a worked event log was found. Missing question: process mining vs. data mining.

**Changes (old -> new):**
1. FAQ: 10 questions -> 11; new "What is the difference between process mining and data mining?" with two verbatim quotes from the Process Mining Manifesto [2] (full text re-opened on November 23, 2026; quotes checked: "Most data mining techniques are not process-centric at all." and "Process mining provides an important bridge between data mining and business process modeling and analysis.").
2. Competitive analysis: added the SERP re-check table.
3. Editorial notes, JSON-LD: "include all 10 FAQ questions" -> "include all 11 FAQ questions".
4. Metadata: word count 4,928 -> 5,005.
Meta title, description and H1 unchanged: they carry the exact main keyword plus MES and ERP, which is the practitioner angle the academic SERP lacks.

**Sign-off:**
- **SEO specialist:** satisfied; the academic SERP leaves room for a practitioner page; the new question came from the use-case variant.
- **Critic:** satisfied; the answer is short and quotes rather than paraphrases.
- **Fact checker:** satisfied; both quotes verified verbatim in the manifesto full text [2].
- **Subject expert (process mining / MES):** satisfied; the case, activity and timestamp framing matches section 1.

**Word count after round 5:** 5,005 words (+77).
