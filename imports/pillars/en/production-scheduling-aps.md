# SEO metadata

| Field | Value |
|---|---|
| Meta title | Production Scheduling Software: The APS Guide (2026) (52 characters) |
| Meta description | Production scheduling software and APS explained: finite capacity, bottlenecks, drum-buffer-rope, EOQ, safety stock, worked examples and a checklist. (149 characters) |
| Slug | `/en/learn/production-scheduling-aps/` |
| Main keyword | production scheduling software |
| Secondary keywords | APS software, advanced planning and scheduling, APS system, finite capacity scheduling, finite vs infinite capacity, detailed scheduling, capacity planning software, production planning and scheduling, production planning and control, MRP vs APS, APS vs ERP, ERP vs APS vs MES, bottleneck analysis, theory of constraints, drum buffer rope, buffer management, MRP II, dispatching rules (EDD, SPT, FIFO, critical ratio), Little's Law, economic order quantity, safety stock formula, improve on-time delivery, reduce manufacturing lead time, capable to promise |
| Search intent | Mixed. Commercial investigation dominates the head term "production scheduling software" (the google.com top 10 is mostly software directories and "best tools" listicles). "advanced planning and scheduling", "APS vs ERP" and "finite capacity scheduling" are informational. The article serves the informational layer in depth and the commercial layer with selection criteria and a checklist, without a vendor ranking. |
| Target word count | At least 9,000 words (longest English competitor on google.com: projectmanager.com listicle, approx. 5,500 words). Actual: **14,187 words** (`wc -w`, H1 through Conclusion, measured November 20, 2026) |
| Language version | `en-US`. hreflang pair: `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/ <-> `de-DE` https://www.m365.fm/learn/produktionsplanung-aps/ (plus `x-default` per site convention) |

# Competitive analysis (google.com SERP, November 2026)

Basis: US web searches on November 20, 2026 for "production scheduling software", "advanced planning and scheduling APS software what is" and "finite capacity scheduling vs MRP manufacturing", plus a check for "APS vs ERP vs MES" questions. The top English pages were opened and read; word counts are rounded estimates of the main content (without navigation, listing boilerplate or footers).

| Page (URL) | Query / position (approx.) | approx. words | Strengths | Gaps |
|---|---|---|---|---|
| projectmanager.com/blog/best-production-scheduling-software | production scheduling software, top 10 | 5,500 | longest page, 10-tool comparison table, FAQ, templates | publisher ranks its own tool first; project-management view; no finite capacity logic, no formulas, little on implementation |
| thedigitalprojectmanager.com/tools/best-production-scheduling-software | production scheduling software, top 10 | 3,000 to 3,500 | 10 vendor reviews, buyer criteria, FAQ | pricing "upon request", scores not shown, its own criteria (finite capacity, what-if) rarely checked in the reviews |
| selecthub.com/c/production-scheduling-software | production scheduling software, top 3 | 2,500 to 3,000 | scoring method, small-manufacturer considerations | forward/backward scheduling named but not explained, no formulas, inconsistent scores |
| clickup.com/blog/production-scheduling-software | production scheduling software, top 10 | 2,000 to 2,500 | criteria list, 10 tools | own product ranked first, no method, no comparison table, nothing on shop-floor constraints |
| capterra.com/production-scheduling-software | production scheduling software, top 3 | approx. 650 editorial (1,500 to 2,000 incl. listings) | many vendors, user ratings | directory; pricing data from 2019; no theory |
| theaccessgroup.com/en-us/…/what-is-advanced-planning-and-scheduling | advanced planning and scheduling, top 3 | 1,800 | APS components, challenges, trends | vendor page, no figures, no data-quality or integration guidance |
| planettogether.com/production-scheduling-software | production scheduling software, top 10 | 1,400 | clear APS vs ERP framing, "ready for APS" signals, FAQ | vendor marketing, no scheduling theory, unreferenced case figures |
| fabrico.io/blog/what-is-advanced-planning-and-scheduling-aps | advanced planning and scheduling, top 10 | 600 | concise, worked rush-order example, APS vs MRP FAQ | no formulas, no sources, no selection or rollout guidance |

"People also ask" style questions collected from the SERP and the FAQ blocks of ranking pages: What is production scheduling software? What is APS and how is it different from ERP? What is the difference between APS and MRP? Does APS replace ERP? Is Excel enough for production scheduling? What is the difference between production planning and scheduling? What are the types of production scheduling? How much does production scheduling software cost? How do I choose an APS vendor? Does APS replace planners?

**How this article beats the competition:** None of the ranking English pages explains *why* ERP-generated schedules keep failing on the shop floor. This guide gives the mechanics with primary sources: Little's Law [9], operating curves [8], Kingman's approximation and the VUT equation [10][11], and the lead time syndrome [23]. It connects the theory of constraints (TOC, DBR, buffer management) [1][2][4] with APS logic and works through every core formula: capacity load, dispatching rules, EOQ [17], safety stock [19], takt time and line balancing. It adds an ERP/APS/MES comparison anchored in ISA-95 [31] and the German guideline VDI 5600 [15], a data-quality grid, a vendor-neutral selection checklist, a rollout roadmap and a list of common mistakes. It does not rank vendors, so it complements rather than copies the listicles that dominate the head term.

---

# Production Scheduling Software and APS: The Complete Guide to Schedules That Hold on the Shop Floor

*Updated November 20, 2026 · Based on primary literature in production planning and control, operations research and the theory of constraints (see Sources)*

> **Short answer:** Production scheduling software with APS (advanced planning and scheduling) plans manufacturing orders against finite capacity and available material at the same time. Classic MRP logic in an ERP system assumes unlimited capacity and fixed lead times. An APS models machines, people, tools, changeovers, shifts and bottlenecks, so the sequence and dates it produces are dates your plant can actually hit.

It is Monday morning in production control. The weekend MRP run has created 140 work orders with a start date of "this week." The machining cell has almost two weeks of work on its plate, assembly is waiting for parts, and sales wants a ship date nobody can commit to with a straight face. So the schedule gets rebuilt: in Excel, on the whiteboard, in a hallway conversation with the shift supervisor. By Wednesday it is out of date again.

If that sounds familiar, the cause is rarely a lack of discipline. It is the planning logic. Material requirements planning (MRP) was built to answer one question: *What material do I need, and when?* It answers the question *Can my plant actually run this work in this sequence?* only roughly, or not at all. That second question is what detailed scheduling and APS are for.

This guide covers the fundamentals of production planning and control, the structural weaknesses of MRP, the physics of a factory, how APS systems work, the theory of constraints with drum-buffer-rope, lean building blocks such as heijunka and line balancing, the classic formulas for lot size and safety stock with worked examples, and how to select and implement production scheduling software with APS capabilities. For a short definition, see the m365.fm entity page [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/).

### Key takeaways

- **ERP plans material, APS plans feasibility.** MRP logic inside an ERP, in its basic form, assumes unlimited capacity and fixed planned lead times. An APS schedules against finite capacity and material availability at the same time.
- **Lead time is mostly waiting time.** Little's Law says cycle time = work in process ÷ throughput [9]. Cut WIP without starving the bottleneck and lead times drop.
- **High utilization costs time.** Queue time grows with the factor u/(1−u), not linearly. At 95% utilization the wait is almost five times as long as at 80% [10][11].
- **The bottleneck sets the pace.** The theory of constraints (TOC) and drum-buffer-rope (DBR) align order release and sequencing with the constraint [1][2].
- **Classic formulas are starting points, not truth.** The economic order quantity (EOQ) and the safety stock formula rest on simplifying assumptions. The EOQ cost curve is flat, and setup time is usually the bigger lever.
- **An APS is only as good as its master data.** Routings, standard times, changeover matrices and capacity calendars drive schedule quality more than the algorithm does.

### Where to start, by role

| You are … | Read first |
|---|---|
| A production planner or scheduler stuck with unrealistic ERP schedules | Sections 3, 4 and 5 (MRP weaknesses, factory physics, how APS works) |
| In production control, manufacturing engineering or shop-floor leadership | Sections 7 and 8 (bottleneck, DBR, takt, heijunka) |
| In supply chain, materials or inventory planning | Sections 9 and 10 (lot size, safety stock) |
| Leading an APS selection or implementation | Sections 13 to 16 (selection, data, roadmap, mistakes) |
| A plant manager or operations executive | Short answer, Section 11 (KPIs) and Section 21 (Conclusion) |

## Table of contents

1. [Why ERP schedules fail on the shop floor](#1-why-erp-schedules-fail-on-the-shop-floor)
2. [Fundamentals: what production planning and control covers](#2-fundamentals-what-production-planning-and-control-covers)
3. [The weaknesses of classic MRP logic](#3-the-weaknesses-of-classic-mrp-logic)
4. [Factory physics: Little's Law, operating curves and variability](#4-factory-physics-littles-law-operating-curves-and-variability)
5. [What an APS system is and how it calculates](#5-what-an-aps-system-is-and-how-it-calculates)
6. [ERP vs. APS vs. MES](#6-erp-vs-aps-vs-mes)
7. [Theory of constraints, drum-buffer-rope and buffer management](#7-theory-of-constraints-drum-buffer-rope-and-buffer-management)
8. [Lean building blocks in scheduling: takt, heijunka, line balancing, pull](#8-lean-building-blocks-in-scheduling-takt-heijunka-line-balancing-pull)
9. [Lot sizing: EOQ, worked example and limits](#9-lot-sizing-eoq-worked-example-and-limits)
10. [Safety stock: formula and worked example](#10-safety-stock-formula-and-worked-example)
11. [Production planning KPIs](#11-production-planning-kpis)
12. [Digital twin and simulation](#12-digital-twin-and-simulation)
13. [How to choose production scheduling software: criteria and checklist](#13-how-to-choose-production-scheduling-software-criteria-and-checklist)
14. [Data requirements and master data quality](#14-data-requirements-and-master-data-quality)
15. [APS implementation roadmap](#15-aps-implementation-roadmap)
16. [Common mistakes and how to avoid them](#16-common-mistakes-and-how-to-avoid-them)
17. [Evidence: what studies and users report](#17-evidence-what-studies-and-users-report)
18. [Constraint-based planning with iFAKT Polaris](#18-constraint-based-planning-with-ifakt-polaris)
19. [Glossary](#19-glossary)
20. [FAQ: production scheduling software and APS](#20-faq-production-scheduling-software-and-aps)
21. [Conclusion](#21-conclusion)

## 1. Why ERP schedules fail on the shop floor

Most manufacturers plan production in their ERP system, and for good reason: that is where customer orders, bills of material, routings and inventory live. An [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) system is the system of record for quantities, values and dates. The planning logic inside most ERP systems, however, is built on a method developed in the 1960s and 1970s and documented by Joseph Orlicky in his 1975 standard text: material requirements planning [24].

Planners recognize the symptoms the moment this logic hits its limits:

- **Overloaded work centers on paper:** The ERP schedules orders into a week when the work center's capacity is long gone.
- **Ship dates by gut feel:** Promised dates are based on standard lead times, not on the current load.
- **Shadow scheduling in Excel:** The real detailed schedule lives outside the ERP, in spreadsheets, on whiteboards or in the heads of experienced supervisors.
- **Hot jobs push everything else out:** Every expedite creates new late orders somewhere else.
- **High inventory and still shortages:** There is plenty of material on the floor, just not what assembly needs right now.
- **Planners as firefighters:** A large share of the week goes into rescheduling instead of planning.

How common this is shows up in a survey that IDC conducted for the planning software vendor Kinaxis. IDC surveyed more than 1,800 supply chain leaders in nine countries, including the US and Canada, in December 2023; 83% said their organization could not respond to a supply chain disruption within 24 hours [32]. For the 200 German respondents, the German trade journal Logistik Heute reported that 37% relied on Excel alone or Excel combined with stand-alone tools for supply chain planning, and 89% could not respond to disruptions within 24 hours [25]. The study is vendor-sponsored and covers supply chain planning in general, not shop-floor scheduling specifically, and the published release gives no US-specific spreadsheet figure. It still shows the scale of the problem.

The good news: the causes are well understood. They sit in three areas that this guide covers in turn: the planning logic (Section 3), the physics of queues and inventory (Section 4), and the missing focus on the bottleneck (Section 7). A shorter version of the first argument is in the m365.fm post [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/).

## 2. Fundamentals: what production planning and control covers

### 2.1 Definitions

**Production planning and control (PPC)** covers every task a company uses to decide *what*, *how much*, *when* and *where* to produce, and to trigger and monitor execution. Planning creates targets; control executes them on the shop floor and reacts to deviations. In US practice the same scope is often called manufacturing planning and control (MPC). The professional body of knowledge is maintained by ASCM, the Association for Supply Chain Management, through its APICS CPIM certification, whose modules include sales and operations planning, internal supply, inventory and detailed schedules [33].

Two terms cause regular confusion: **planning** and **scheduling**. Planning (rough-cut or aggregate planning) works with aggregated quantities, weekly or monthly buckets and work center groups. **Detailed scheduling** decides for each individual operation which resource it runs on, in what sequence and at what time. It works in days, shifts or minutes and is the core of what an APS system does. German practice uses the pair *Grobplanung* and *Feinplanung* for the same distinction; you will see "Feinplanung" in German vendor literature.

### 2.2 The planning levels at a glance

The literature organizes planning hierarchically, from the long-term sales and capacity plan down to the sequence on a single machine [7][12]. The table summarizes the levels. Horizons are typical orders of magnitude and vary by industry and production type.

| Level | Typical horizon | Key question | Output | Typical system |
|---|---|---|---|---|
| Sales and operations planning (S&OP) | 12 to 24 months | What will we sell, and what capacity do we need? | Sales and capacity plan by product family | ERP, planning tools, Excel |
| Master production schedule (MPS) | weeks to months | Which end items do we build, when and how many? | Independent demand, production program | ERP |
| Material requirements planning (MRP) | weeks | Which assemblies, parts and raw materials do we need, and when? | Dependent demand, planned orders, purchase requisitions | ERP |
| Capacity requirements planning (CRP) | days to weeks | When do operations run, and is there enough capacity? | Milestone dates, capacity load | ERP (rough), APS (precise) |
| Detailed scheduling | hours to days, rolling out to a few weeks | Which operation runs on which resource, in what sequence? | Resource schedule, sequence (Gantt chart) | APS, MES scheduling module, scheduling board |
| Production activity control / dispatching | shift to minute | Which order is released, what happens when something breaks? | Releases, confirmations, reschedule triggers | MES, APS, shop floor |

Hermann Lödding, a German production control researcher, splits production control into four tasks: order generation, order release, capacity control and sequencing [12]. The split is useful because it shows that a good schedule alone is not enough. The decision *when* an order enters the shop often affects WIP and lead time more than the sequence on any single machine.

### 2.3 Reference models: ISA-95, ASCM and the Aachen PPC model

US manufacturers usually orient themselves on two frameworks. The ASCM/APICS planning hierarchy shown in the table above (S&OP, MPS, MRP, CRP, detailed scheduling, execution) is the common language of planners and supply chain professionals [33]. ANSI/ISA-95 (published internationally as IEC 62264) draws the line between business planning and logistics (Level 4, typically ERP) and manufacturing operations management (Level 3, typically MES and scheduling). Part 3, ANSI/ISA-95.00.03-2013, describes the activity models of manufacturing operations management and defines finite capacity scheduling as a method in which work is scheduled for a set of manufacturing resources so that no scheduled capacity exceeds the capacity available [31].

In German-speaking countries, the dominant reference model is the **Aachen PPC model** (*Aachener PPS-Modell*) from the FIR institute at RWTH Aachen University. It is described in several editions of the standard German text *Produktionsplanung und -steuerung*; the fourth edition was edited by Günther Schuh and Volker Stich in 2012 [7]. The model groups planning and control tasks into three categories:

- **Network tasks:** strategic design of the production network, such as site and supplier decisions.
- **Core tasks:** the tasks that move an order forward, namely production program planning, production requirements planning, in-house production planning and control, and external procurement planning and control.
- **Cross-sectional tasks:** order management, inventory management and controlling, which integrate and optimize across functions.

The value of all three frameworks lies in the clean separation of tasks. They help answer which system should own which job: the ERP typically covers program and requirements planning, an APS covers detailed in-house production scheduling, and an MES covers execution and confirmations.

### 2.4 From MRP to MRP II to APS

The history of planning systems explains many of today's problems:

1. **Reorder points and lot-size formulas (from 1913):** Ford Whitman Harris published the economic lot size formula in 1913 [17]. In German-speaking countries it became known through Kurt Andler (1929) and is still called the *Andler formula* there [18].
2. **MRP (1960s and 1970s):** Computers made it possible to explode demand through bills of material and offset it in time by planned lead times. Orlicky described the method comprehensively in 1975 [24].
3. **MRP II (early 1980s):** Manufacturing resource planning added master scheduling, rough-cut capacity planning, capacity requirements planning (CRP) and the link to financial planning. The capacity check remained a downstream step, though: schedule first, then display the load [10].
4. **ERP (1990s):** ERP systems integrated finance, sales, purchasing and HR. The planning core often remained MRP II.
5. **APS (from the 1990s):** Advanced planning systems attack the downstream capacity check by planning material and capacity together with optimization methods. They do not replace ERP; they add planning that respects finite capacity [13].

## 3. The weaknesses of classic MRP logic

MRP logic is not wrong. For deciding what material is needed in what quantity, it is indispensable. It becomes a problem when its output is used unchecked as a production schedule. Wallace Hopp and Mark Spearman criticize in *Factory Physics* that the basic MRP model assumes fixed lead times that do not depend on load. Fixed lead times, however, would only be possible with unlimited capacity [10].

### 3.1 Infinite capacity

MRP schedules each planned order by backing off the planned lead time from the due date. It does not check whether the work center is free at that time. This is called **infinite capacity planning**. Downstream capacity requirements planning (CRP) shows overloads but does not resolve them. That is left to the planner.

**Worked example: the overload MRP does not see**

A machining center runs two shifts, five days a week, 8 hours per shift: 80 hours of capacity per week. The MRP run creates this load:

| Week | Capacity (h) | MRP load (h) | Difference (h) | Load |
|---|---|---|---|---|
| Week 12 | 80 | 112 | −32 | 140% |
| Week 13 | 80 | 54 | +26 | 68% |
| Week 14 | 80 | 96 | −16 | 120% |
| **Total** | **240** | **262** | **−22** | **109%** |

Even if the planner levels perfectly and pulls work from week 12 into week 13, 22 hours remain that cannot be done in the three weeks. Either overtime, outsourcing or an alternate machine is planned, or at least one order finishes late. The ERP, however, still shows every order with its original date, and sales promises ship dates on that basis. An APS would schedule the orders against 80 hours per week and report the earliest realistic completion date.

### 3.2 Fixed planned lead times

The second assumption is a **fixed planned lead time** per item or routing, for example "milling: 5 working days." In reality, lead time depends heavily on current load, as Section 4 shows. When the shop is empty, an order flows through in two days. When it is full, it takes two weeks. A fixed value is therefore almost always either too long (result: high inventory, early release) or too short (result: late orders).

The planned lead time also usually contains a large share of move and queue time. Peter Nyhuis and Hans-Peter Wiendahl of Leibniz University Hannover distinguish between operation time (setup and processing) and inter-operation time (waiting before and after processing, plus transport) [8]. In job shops, inter-operation time is usually the larger part. Writing that waiting time into master data as a fixed constant locks it in.

### 3.3 The lead time syndrome

What happens when planners respond to late orders by increasing planned lead times? The effect has been known for decades as the **lead time syndrome** and is discussed mainly in the context of MRP [23]:

1. Orders finish late.
2. Planners increase planned lead times to play it safe.
3. Orders are released earlier as a result.
4. More orders are in the shop at the same time; WIP rises.
5. According to Little's Law, with constant throughput, actual lead time rises.
6. Orders finish late again, and the cycle starts over.

In 2023, Matthias Thürer, Nuno Fernandes, Stefan Haeussler and Mark Stevenson used simulation to test whether dynamically adjusted planned lead times hurt make-to-order shops. Their answer: yes, but not in the way you would expect. The damage comes mainly from shortening planned lead times in low-load periods, which then increases the load in later high-load periods [23]. In practice: adjusting planned lead times without controlling order release only moves the problem.

The remedies are workload-based or bottleneck-based order release (Sections 7 and 8) and finite capacity scheduling that derives lead times from the actual schedule instead of prescribing them.

### 3.4 Sequential planning

The third weakness is **sequential planning**: first the program, then material, then dates, then capacity. Each step takes the previous result as fixed. Feedback such as "this machine is full, so I move the requirement and with it the purchase order" is not part of the design. The result is plans that are consistent at every step but infeasible as a whole.

| MRP assumption | Shop-floor reality | Consequence |
|---|---|---|
| Capacity is unlimited | Capacity is limited at every work center | overloaded weeks, unrealistic dates |
| Lead times are fixed | Lead times depend on load | orders released too early or too late |
| Lot sizes are independent of sequence | Setup times depend on the previous variant | lost capacity at the bottleneck |
| Planning steps run one after another | Material, capacity and dates interact | plans that only work on paper |
| Demand and inventory are known exactly | Forecasts vary, inventory records contain errors | nervousness, shortages, safety padding |

## 4. Factory physics: Little's Law, operating curves and variability

To understand why schedules fail, you need three relationships that hold regardless of industry or software. Hopp and Spearman summarized them under the name *Factory Physics* [10].

### 4.1 Little's Law: WIP, throughput and cycle time

In 1961, John D. C. Little proved a relationship that holds for any stable system with arrivals and departures [9]. In production terms:

> **Cycle time (CT) = work in process (WIP) ÷ throughput (TH)**

The formula holds for long-run averages, regardless of the distribution of processing times or the sequencing rule. Note on terms: in Little's Law, "cycle time" means the time an order spends in the system (its flow time or manufacturing lead time), not the station cycle time that is compared with takt time in Section 8.

**Worked example:** A parts shop completes 40 work orders per working day on average. On average, 600 released, not yet completed orders are on the floor.

- CT = 600 ÷ 40 = **15 working days**

If controlled order release cuts WIP to 320 orders while the bottleneck stays fully fed and throughput stays at 40 orders per day:

- CT = 320 ÷ 40 = **8 working days**

Lead time has almost halved without a single machine running faster. That is why WIP control and order release are among the most effective and cheapest levers in production planning. For more on the metric, see the entity page [Lead Time](https://www.m365.fm/entity/lead-time/).

**Important caveat:** Little's Law does not say that every WIP cut reduces lead time without side effects. If WIP in front of the bottleneck drops so far that it runs dry, throughput falls too. Operating curves describe exactly that relationship.

### 4.2 Operating curves and the funnel model

Researchers at the Institute of Production Systems and Logistics (IFA) at Leibniz University Hannover developed the **funnel model**: a work center is treated as a funnel into which orders flow and out of which they leave after processing. The derived **throughput diagram** shows WIP, output and lead time over time [8]. Building on this, Nyhuis and Wiendahl formulated **logistic operating curves**, which show how output and lead time of a work system depend on WIP [8]:

- At **low WIP**, output rises almost linearly with each added order, and lead time stays close to pure operation time. But the work center risks starving for lack of material.
- From **medium WIP** onward, output approaches its maximum. More WIP adds hardly any output.
- At **high WIP**, output stays flat while lead time keeps growing in proportion to WIP. Extra WIP is pure waiting time.

That gives a core planning rule: every work center has a WIP range in which output is secure and lead time is still short. Scheduling and release should aim to keep the shop in that range. Hopp and Spearman describe a related concept, **critical WIP**: the WIP level at which an ideal line just reaches maximum throughput at minimum cycle time [10]. Nyhuis and Wiendahl explicitly bring both approaches together and link operating curve theory with Little's Law [8].

### 4.3 Variability and utilization: why 95% can be too much

The third law concerns waiting time in front of a resource. John Kingman published an approximation for queues under heavy traffic in 1961 [11]. Hopp and Spearman use it in *Factory Physics* as the **VUT equation** (variability × utilization × time) [10]:

> **Average queue time at the resource ≈ V × U × T**
>
> V = (c_a² + c_e²) ÷ 2 (variability of arrivals and of processing times)
> U = u ÷ (1 − u) (utilization factor, u = utilization between 0 and 1)
> T = t_e (average effective processing time)

c_a and c_e are the coefficients of variation (standard deviation divided by the mean) of interarrival times and processing times. The approximation applies to a single resource and is most accurate at high utilization.

**Worked example:** A machine has an average effective processing time of 1 hour per order. Arrivals and processing times vary moderately; both coefficients of variation are 1, so V = (1 + 1) ÷ 2 = 1.

| Utilization u | U = u ÷ (1 − u) | Average queue time (h) | Time at the machine incl. processing (h) |
|---|---|---|---|
| 80% | 4.0 | 4.0 | 5.0 |
| 85% | 5.7 | 5.7 | 6.7 |
| 90% | 9.0 | 9.0 | 10.0 |
| 95% | 19.0 | 19.0 | 20.0 |

Going from 80% to 95% utilization adds 15 percentage points of load but multiplies queue time almost fivefold. Three planning lessons follow:

1. **Full utilization everywhere is not a sensible goal.** Schedule every work center at 95% and you get long, highly variable lead times.
2. **Reducing variability works like adding capacity.** Halve V, for example through more stable setups, smaller and more even lots or smoothed release, and queue time halves at the same utilization.
3. **High utilization is wanted at the bottleneck, but only with a buffer.** The bottleneck should never starve. That only works if a deliberately sized buffer sits in front of it and the other resources have spare capacity (Section 7).

## 5. What an APS system is and how it calculates

### 5.1 Definition

**Advanced planning and scheduling (APS)** refers to software systems and methods that plan and schedule production orders while considering material availability and finite capacity at the same time. Supply chain literature uses a broader definition: Bernhard Fleischmann, Herbert Meyr and Michael Wagner place advanced planning in a planning matrix that runs from long-term network design to short-term scheduling across procurement, production, distribution and sales [13]. On the shop floor, "APS" usually means the part responsible for detailed scheduling and sequencing in production. Many products listed under "production scheduling software" in US software directories cover this layer, as a stand-alone product or as a module of an ERP or MES; others in the same lists are project or resource planners (Section 13.1).

The word **"advanced"** refers to three differences from classic MRP logic:

- **Finite capacity scheduling:** Every resource has a limited, calendar-dependent capacity. An operation is scheduled only where the resource is free. ISA-95 defines finite capacity scheduling in exactly these terms: no scheduled capacity may exceed the capacity available [31].
- **Simultaneous planning:** Material, capacity and dates are considered together. If material is missing, the operation moves; if the machine is busy, the material requirement moves.
- **Optimization:** Instead of computing one answer, the system searches among many feasible solutions for a good one, ideally the best one according to defined objectives.

### 5.2 Constraint-based scheduling: what an APS models

An APS does not schedule against "capacity" as a single number but against a network of constraints. This is called **[constraint-based scheduling](https://www.m365.fm/entity/constraint-based-scheduling/)**. Typical constraints:

| Constraint | Example | Why it matters |
|---|---|---|
| Resource capacity | Machine A: 2 shifts, Monday to Friday | foundation of every detailed schedule |
| Alternate resources | Part can run on machine A or B, 20% slower on B | way out when a resource is overloaded |
| Labor and skills | Only three operators are certified on the test stand | labor is often the real bottleneck |
| Tools and fixtures | Only one injection mold per variant | two machines cannot run the same variant at the same time |
| Sequence-dependent setups | Light to dark color: 10 min; dark to light: 45 min | the sequence determines available capacity |
| Operation sequence and overlap | Assembly starts only after painting; transfer in partial lots allowed | lead time and synchronization |
| Minimum and maximum wait times | Adhesive must cure 24 h; part may sit no more than 4 h between washing and coating | technological minimum and maximum times |
| Material and purchased parts | Electronics arrive Thursday | material limits the earliest start |
| Zones and floor space | Only two fuselage sections fit in an assembly zone at once | typical in large-equipment and aerospace assembly |
| Campaigns and batches | Furnace runs only full batches at the same temperature | grouping versus due dates |

The more of these constraints apply, the less reliably a schedule can be built by hand or in Excel, and the larger the benefit of an APS.

### 5.3 How big the problem is: combinatorial explosion

Even on a single machine, the number of possible sequences grows with the factorial of the number of orders:

- 4 orders: 4! = 24 sequences
- 10 orders: 10! = 3,628,800 sequences
- 15 orders: 15! = 1,307,674,368,000 sequences, or about 1.3 trillion

In a real job shop with dozens of machines, hundreds of orders and multi-step routings, trying every option is hopeless. In 1976, Michael Garey, David Johnson and Ravi Sethi showed that minimizing makespan is NP-complete in a flow shop with three or more machines and in a job shop with two or more machines [14]. For such problems, no method is known that is guaranteed to find the optimum for arbitrarily large instances in reasonable time. That is why APS systems combine rules, heuristics and optimization.

### 5.4 Methods: from dispatching rules to mathematical optimization

**Dispatching rules** (priority rules) decide which waiting order runs next. They are simple, fast and transparent:

| Rule | Logic | Strength | Weakness |
|---|---|---|---|
| FIFO (first in, first out) | first come, first served | fair, simple, low variance | ignores due dates |
| EDD (earliest due date) | earliest due date first | on one machine, minimizes maximum lateness | ignores processing times |
| SPT (shortest processing time) | shortest operation first | on one machine, minimizes mean flow time | long jobs can starve |
| CR (critical ratio) | time remaining to due date ÷ work remaining | considers due date and remaining work | unstable with frequent rescheduling |
| Slack | time to due date minus remaining processing time, smallest first | good for multi-step orders | needs reliable remaining times |
| Setup-optimized | group jobs of the same setup family | saves setup time at the bottleneck | can violate due dates |

That EDD minimizes maximum lateness and SPT minimizes mean flow time on a single machine are classic results of scheduling theory [29].

**Worked example: three rules, four orders, one machine**

Four orders are waiting at a machine at time 0, in order of arrival A, B, C, D. Times in hours:

| Order | Processing time | Due |
|---|---|---|
| A | 4 | 6 |
| B | 2 | 4 |
| C | 6 | 14 |
| D | 3 | 9 |

| Rule | Sequence | Completion times | Tardiness | Late orders | Total tardiness | Mean flow time |
|---|---|---|---|---|---|---|
| FIFO | A, B, C, D | A 4, B 6, C 12, D 15 | B 2, D 6 | 2 | 8 h | (4+6+12+15)÷4 = 9.25 h |
| SPT | B, D, A, C | B 2, D 5, A 9, C 15 | A 3, C 1 | 2 | 4 h | (2+5+9+15)÷4 = 7.75 h |
| EDD | B, A, D, C | B 2, A 6, D 9, C 15 | C 1 | 1 | 1 h | (2+6+9+15)÷4 = 8.00 h |

Same machine, same work, same capacity: the sequence alone decides whether one or two orders are late and whether total tardiness is 1 or 8 hours. SPT gives the shortest mean flow time, EDD the best due-date performance. Which rule is "right" depends on the objective. In a multi-step shop with sequence-dependent setups no single rule is enough, and that is where an APS starts to pay off.

**Heuristics** quickly deliver good but not guaranteed optimal solutions. They include construction methods that build a schedule order by order (for example bottleneck-first: load the bottleneck, then align the other resources to it) and improvement methods that change an existing schedule step by step.

**Metaheuristics** such as genetic algorithms, simulated annealing or tabu search explore the solution space systematically and can escape local optima. They are common in commercial APS systems for sequence optimization.

**Mathematical optimization** formulates the scheduling problem as a model with an objective function and constraints, for example as a mixed-integer linear program (MILP) or a constraint programming (CP) model. Solvers find optimal solutions for small and medium problems or at least provide a bound on how far the solution found can be from the optimum. Large detailed scheduling problems are often decomposed, for example by time window or resource group.

**Artificial intelligence** plays several roles in APS systems: predicting processing and setup times from actual data, predicting disruptions, learning scheduling policies (for example with reinforcement learning), and natural-language interaction. Credible vendors use it to improve the inputs and speed up the search, not to replace optimization. AI-assisted scheduling is only as good as the shop-floor confirmation data it learns from.

### 5.5 Objectives and trade-offs

An APS never optimizes "the schedule"; it optimizes a weighted combination of objectives. Typical objectives:

- on-time delivery (minimizing tardiness or weighted tardiness)
- short lead times and low WIP
- high utilization of the bottleneck
- low setup time
- little overtime and an even workload for people
- schedule stability (few changes compared with the previous schedule)

These objectives conflict. German business literature calls the core of this conflict the "scheduling dilemma" (*Dilemma der Ablaufplanung*): high utilization requires queues, short lead times require idle capacity. Section 4.3 shows why that is mathematically so. One of the most important tasks in an APS rollout is therefore agreeing on the weighting of objectives with sales, production and logistics.

### 5.6 Scheduling direction, ATP and CTP

The question "what are the types of production scheduling?" usually comes down to two pairs: finite versus infinite capacity (Section 3.1) and the scheduling direction:

- **Forward scheduling:** Operations are scheduled from the earliest possible start. The result is the earliest possible completion date.
- **Backward scheduling:** Operations are scheduled backward from the due date. The result is the latest possible start, which saves inventory but leaves no slack.
- **Bottleneck-based scheduling:** The bottleneck is loaded first; upstream operations are then scheduled backward and downstream operations forward.

Two functions are especially valuable for sales:

- **Available to promise (ATP):** What quantity can be promised by what date from inventory and planned receipts?
- **Capable to promise (CTP):** What date is achievable for a new order considering material *and* capacity?

CTP is a typical APS function because it test-schedules a new order against the current load. It turns ship-date promises from an estimate into a calculation.

## 6. ERP vs. APS vs. MES

The three system classes do not compete; they complement each other. ANSI/ISA-95 places ERP at Level 4 (business planning and logistics) and manufacturing operations management at Level 3; the activity models in Part 3 cover the work schedule (called the "detailed production schedule" in the 2005 edition) and its execution [31]. The German guideline VDI 5600 Part 1 (October 2016), widely used in Europe, goes further and explicitly lists "detailed planning and detailed control" as one of ten tasks of a manufacturing execution system, next to order management, equipment management, material management, personnel management, data acquisition, performance analysis, quality management, information management and energy management [15]. In practice, detailed scheduling is delivered either in the MES, in a stand-alone APS or in an APS module of the ERP.

| Feature | ERP (planning module) | APS | MES |
|---|---|---|---|
| Main job | quantities, values, material, milestone dates | feasible dates and sequences under constraints | execution, confirmation, real-time visibility |
| Planning horizon | weeks to months | hours to weeks, rolling | shift to minute |
| Capacity model | infinite in its basic form, downstream load display | finite, many resources at once | measures capacity actually used |
| Time granularity | days, weeks | minutes to hours | seconds to minutes |
| Planning logic | MRP, backward scheduling with fixed lead times | heuristics, metaheuristics, mathematical optimization | release and dispatching rules, sometimes its own scheduler |
| Typical question | What must be done by when, which material is missing? | Which operation runs when on which resource? | What is running now, how far along is each order, why is the machine down? |
| Data | master data, customer and planned orders | ERP data plus changeover matrices, calendars, constraints, confirmations | machine, production and quality data |
| Response to disruptions | next planning run, often overnight | reschedule in minutes, scenario comparison | capture, alarm, reschedule trigger |
| Users | materials planning, purchasing, sales, finance | production planning, production control, supply chain | supervisors, operators, maintenance, quality |
| Limit | plans against assumptions instead of reality | needs good master data and confirmations | often plans only short-term and locally |

**How the systems work together:** The ERP passes orders, bills of material, routings and inventory to the APS. The APS schedules against finite capacity and returns realistic dates and sequences, which the ERP uses for ship dates and material requirements. The MES executes the sequence on the floor and reports actual times, quantities and disruptions back to APS and ERP. Only this closed loop makes a schedule reliable. How the path from ERP to shop floor can be closed with a digital twin is described in the post [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/).

**When is ERP enough?** If your orders have few operations, setups are hardly sequence-dependent, a clearly visible bottleneck can be run with a simple release rule, and capacity is rarely tight, a well-maintained ERP plan plus a scheduling board is often sufficient. The more constraints from Section 5.2 apply, the clearer the case for an APS.

## 7. Theory of constraints, drum-buffer-rope and buffer management

### 7.1 Theory of constraints

Eliyahu M. Goldratt introduced the **[theory of constraints](https://www.m365.fm/entity/theory-of-constraints/)** (TOC) in 1984 in the business novel *The Goal*, co-written with Jeff Cox [1]. The core message: every system has at least one constraint that limits its throughput. An hour lost at the bottleneck is an hour lost for the entire system. An hour saved at a non-bottleneck is worthless as long as it does not relieve the bottleneck.

Goldratt formulated five focusing steps, known as the process of ongoing improvement (POOGI) [3]:

1. **Identify** the system's constraint.
2. **Exploit** the constraint: no idle time, no processing of scrap, setups outside bottleneck time where possible.
3. **Subordinate** everything else to the constraint: release, lot sizes and sequences of the other resources follow the bottleneck.
4. **Elevate** the constraint: only now add shifts, invest or outsource.
5. **Prevent inertia:** if the constraint has moved, go back to step 1.

The order matters. Many companies jump straight to step 4 and buy a new machine although the existing bottleneck still loses capacity to idle time, waiting for material, poor sequences or unnecessary setups.

### 7.2 Finding the bottleneck: bottleneck analysis in practice

The bottleneck is not always the machine with the most breakdowns or the highest price tag. Proven indicators:

- **Queues:** Orders pile up permanently in front of the bottleneck, while resources behind it sit idle.
- **Load versus capacity:** For each resource, compare the planned load (including setup times) with available capacity over several weeks. The resource with the highest ratio is the candidate.
- **Throughput diagrams:** Where WIP stays high and the output curve still does not get steeper, there is a capacity bottleneck [8].
- **Ask the experts, then check:** Supervisors usually know where things jam. Verify with data, because "felt" bottlenecks are often resources with many visible breakdowns.

Watch for **shifting bottlenecks**. With a changing product mix, the bottleneck can move between resources from week to week. Static bottleneck control is then not enough, and an APS that calculates forward-looking load per resource for the current order book becomes especially valuable. Bottlenecks are also not always machines: often they are skilled people, inspection stations, tools or the planning department itself.

### 7.3 Drum-buffer-rope

In *The Race* (1986), Goldratt and Robert E. Fox described a control method that translates the five steps into shop-floor control: **drum-buffer-rope** (DBR) [2]. The metaphor comes from *The Goal*, where a scout troop can only hike as fast as its slowest member:

- **Drum:** The bottleneck sets the pace. Its schedule is the only detailed schedule that must be kept.
- **Buffer:** A **time buffer** sits in front of the bottleneck (and in front of shipping and assembly points where bottleneck parts meet other parts). It protects the bottleneck from variability upstream.
- **Rope:** Material is released into the shop only as fast as the bottleneck can process it. The rope ties release to the bottleneck schedule, offset by the buffer time.

**Worked example of DBR release:** The bottleneck is a heat-treating operation. Order 4711 is scheduled to start there on Thursday at 6:00 a.m. The time buffer in front of the bottleneck is 3 working days. So material for order 4711 is released on Monday at 6:00 a.m., not earlier. Releasing earlier only raises WIP and, by Little's Law, lead time, without adding throughput.

The time buffer is set pragmatically at first. A commonly cited starting value in TOC practice is about half the current lead time up to the bottleneck [unverified]. It is then adjusted through buffer management.

### 7.4 Buffer management

**[Buffer management](https://www.m365.fm/entity/buffer-management/)** is the feedback mechanism of DBR [4]. For each released order, you track how much of its time buffer has been consumed. A three-zone split is common:

| Zone | Buffer consumed | Meaning | Response |
|---|---|---|---|
| Green | up to about one third | order is on track | no action |
| Yellow | about one to two thirds | order is getting tight | find the cause, prepare action |
| Red | more than two thirds | bottleneck may starve or due date is at risk | expedite: prioritize the order, remove the obstacle |

The split into thirds is a widespread convention, not a law of nature. Two benefits matter most:

1. **Day-to-day priorities:** Instead of many conflicting hot lists there is a single rule: red orders first, then yellow, then green.
2. **Systematic improvement:** Record and analyze the causes of red orders and you get a Pareto list of disruption sources. If many orders are red all the time, the buffer is too small or the process too unstable. If almost all are green, the buffer can be reduced, which lowers WIP and lead time.

The variant **simplified DBR** (S-DBR) for make-to-order manufacturers does without a detailed bottleneck schedule and works with a shipping buffer plus a load check of the bottleneck at order acceptance. It is described in the *Theory of Constraints Handbook* alongside classic DBR [4].

### 7.5 DBR and APS: opposites or complements?

TOC practitioners were long skeptical of complex planning software, because a detailed schedule for every resource goes stale quickly when disruptions hit. Modern APS systems can model DBR principles well, though: bottleneck-based scheduling, release with a time buffer and a buffer status display are configurable in many systems. Conversely, DBR benefits from an APS when the bottleneck shifts, when setup sequences at the bottleneck need optimizing or when many constraints apply at once. The sensible stance: DBR provides the control philosophy, the APS provides the computing power.

## 8. Lean building blocks in scheduling: takt, heijunka, line balancing, pull

Lean production and APS are often presented as opposites: pull and visual control on one side, central planning by algorithm on the other. In practice they complement each other. Lean stabilizes flow and reduces variability; APS plans where flow alone is not enough, for example with high product variety, long lead times or shared resources. For the lean side in depth, see the planned m365.fm guide [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned).

### 8.1 Takt time

**[Takt time](https://www.m365.fm/entity/takt-time/)** is the interval at which one unit must be completed to meet customer demand:

> **Takt time = available working time per period ÷ customer demand per period**

**Worked example:** An assembly line runs two shifts of 7.5 hours net working time each (after planned breaks), so 900 minutes per day. Customer demand is 450 units per day.

- Takt time = 900 min ÷ 450 units = **2.0 minutes per unit** (120 seconds)

Takt time is a demand rate, not a performance measure. The actual cycle time of each station must be below it for demand to be met.

### 8.2 Line balancing

**[Line balancing](https://www.m365.fm/entity/line-balancing/)** distributes work content across stations so that each station stays below takt time with as little idle time as possible. Nils Boysen, Malte Fliedner and Armin Scholl systematically classified the many variants of the problem [22].

**Worked example (continued):** Total work content per unit is 9.6 minutes.

- Theoretical minimum number of stations = 9.6 min ÷ 2.0 min = 4.8, rounded up to **5 stations**
- Because of the precedence graph and indivisible work elements, **6 stations** are needed in practice.
- Balance efficiency = 9.6 min ÷ (6 × 2.0 min) = 9.6 ÷ 12.0 = **80%**
- Balance delay = 100% − 80% = **20%** of line capacity

For scheduling, that means: with 6 stations the line covers 450 units per day, but each station waits 20% of the time on average. If demand rises, the line must be rebalanced or working time extended.

### 8.3 Heijunka

**[Heijunka](https://www.m365.fm/entity/heijunka/)** (Japanese for leveling) is a core principle of the Toyota Production System described by Taiichi Ohno [20]. The Lean Enterprise Institute defines it as leveling the type and quantity of production over a fixed period of time [34]. Instead of building large lots of one variant after another, the mix is spread evenly over time.

**Example:** A plant builds 200 units of variant A, 100 of variant B and 100 of variant C per week over five days.

| Approach | Monday | Tuesday | Wednesday | Thursday | Friday |
|---|---|---|---|---|---|
| Batch by batch | 80 A | 80 A | 40 A, 40 B | 60 B, 20 C | 80 C |
| Leveled (heijunka) | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C |

In the leveled plan, peak load on upstream processes drops, finished-goods inventory per variant shrinks and customers of every variant can be supplied daily. The price is more frequent changeovers. Heijunka therefore requires short setup times, and this is where lean and APS meet: an APS can calculate the setup-friendliest sequence within a day for a leveled mix.

### 8.4 Kanban, pull and CONWIP

A **[pull system](https://www.m365.fm/entity/pull-system/)** limits WIP by starting new work only when a downstream consumer signals demand. The best-known form is **[kanban](https://www.m365.fm/entity/kanban/)**: cards or electronic signals between processes trigger replenishment, and the number of cards caps inventory.

Kanban suits parts with regular demand and a manageable number of variants. In job shops and low-volume, high-mix production it reaches its limits, because every variant would need stock. One alternative is **CONWIP** (constant work in process), proposed in 1990 by Mark Spearman, David Woodruff and Wallace Hopp as a pull alternative to kanban [21]. CONWIP does not cap inventory per part but the total number of orders in a line: a new order is released only when another one finishes. Little's Law becomes a control rule. A related method from the IFA in Hannover is **load-oriented order release** (*belastungsorientierte Auftragsfreigabe*), which releases orders only as long as the workload in front of a work center stays under a load limit; Lödding describes it together with CONWIP and bottleneck control as order release methods [12]. In English-language research, this family of methods is usually discussed under the heading of workload control.

**What this means for scheduling:** Kanban and CONWIP decide *when* to release and cap WIP. An APS decides *what* to build in which sequence and whether the dates are achievable. Many plants use both: standard parts run in a kanban loop, customer-specific orders are scheduled in the APS and released under a WIP cap.

## 9. Lot sizing: EOQ, worked example and limits

### 9.1 The basic problem

Every lot carries fixed costs for setup, order handling and start-up, regardless of quantity. Large lots spread these costs over many units but raise inventory and tied-up capital. Small lots cut inventory but mean more frequent setups. **[Batch size](https://www.m365.fm/entity/batch-size/)** is therefore a classic trade-off.

### 9.2 The classic formula: Harris (EOQ) and Andler

Ford Whitman Harris published the square-root formula for the economic lot size in 1913 in *Factory, The Magazine of Management*. It is known today as the economic order quantity (EOQ); Donald Erlenkotter traced its authorship in 1990 [17]. When the formula is used for production lots rather than purchase orders, US texts often call it the economic production or economic lot size. In German-speaking countries it is known as the **Andler formula**, after Kurt Andler's 1929 book [18]:

> **Q* = √(2 × D × S ÷ H)**
>
> Q* = optimal lot size (units)
> D = demand per period (units per year)
> S = fixed cost per lot, i.e., setup and ordering cost ($ per lot)
> H = holding cost per unit and period ($ per unit per year), often calculated as unit cost × carrying cost rate

The formula minimizes the sum of setup costs (D ÷ Q × S) and holding costs (Q ÷ 2 × H). At the optimum, both cost components are equal.

### 9.3 Worked example

A turned (lathe) part has an annual demand of 12,000 units. One setup costs $300 including machine and labor time. Unit cost is $40, the carrying cost rate 20% per year. (The German original uses the same figures in euros; the numbers are illustrative, not converted.)

- H = $40 × 0.20 = $8 per unit per year
- Q* = √(2 × 12,000 × 300 ÷ 8) = √(7,200,000 ÷ 8) = √900,000 ≈ **949 units**
- Lots per year = 12,000 ÷ 949 ≈ 12.6
- Setup cost per year = 12,000 ÷ 949 × $300 ≈ $3,793
- Holding cost per year = 949 ÷ 2 × $8 = $3,796
- **Total cost ≈ $7,589** per year

How sensitive is cost to deviations from Q*?

| Lot size | Setup cost ($/yr) | Holding cost ($/yr) | Total cost ($/yr) | Deviation from optimum |
|---|---|---|---|---|
| 500 | 7,200 | 2,000 | 9,200 | +21.2% |
| 600 | 6,000 | 2,400 | 8,400 | +10.7% |
| 949 | 3,793 | 3,796 | 7,589 | 0% |
| 1,200 | 3,000 | 4,800 | 7,800 | +2.8% |
| 2,000 | 1,800 | 8,000 | 9,800 | +29.1% |

The cost curve is flat around the optimum: a lot size about a quarter larger costs less than 3% more. In practice, you can round lot sizes to practical values, such as container quantities or daily demand, without a meaningful cost penalty.

**Setup time is the bigger lever:** If setup reduction halves setup cost from $300 to $150, the optimal lot size drops to √(2 × 12,000 × 150 ÷ 8) ≈ **671 units**. Total cost falls to about $5,367 per year, or roughly 29% less, because total cost at the optimum is proportional to the square root of S. Average cycle stock falls by about 29% as well. Setup reduction methods such as SMED (single-minute exchange of die) therefore pay off twice. More on the entity page [Setup Time](https://www.m365.fm/entity/setup-time/).

### 9.4 Limits of the EOQ formula

The formula is a useful starting point, but its assumptions are almost never met on the shop floor:

- **Constant, known demand:** Real demand fluctuates and is uncertain.
- **Unlimited capacity:** The formula ignores that setups cost capacity at the bottleneck. At a bottleneck, an hour of setup is an hour of lost throughput; at a non-bottleneck it costs almost nothing. TOC concludes that lots should tend to be larger at the bottleneck and smaller at non-bottlenecks.
- **Single product, no interactions:** Several products share machines; sequence-dependent setups are not modeled.
- **Instantaneous production:** In the basic form, the whole lot is available at once. For a finite production rate there is an extended formula (economic production quantity) in which holding costs are weighted by the factor (1 − demand rate ÷ production rate).
- **No effect on lead time:** Large lots lengthen the lead time of every following order on the same machine and increase variability. That effect is missing from the cost calculation.
- **Hard-to-pin-down cost rates:** Setup cost and carrying cost rate are often imputed values with wide discretion.

For dynamic demand there are methods such as the Wagner-Whitin algorithm and heuristics such as part-period balancing and Silver-Meal. An APS goes one step further: it decides lot sizes and sequence together, considering capacity, changeover matrices and due dates.

## 10. Safety stock: formula and worked example

### 10.1 What safety stock is for

**[Safety stock](https://www.m365.fm/entity/safety-stock/)** protects against two uncertainties: demand variation during the replenishment lead time and variation in the lead time itself. It is not a fix for poor planning but a deliberately paid insurance against randomness.

### 10.2 Formula for variable demand

If daily demand is approximately normally distributed and the replenishment lead time is constant [19]:

> **SS = z × σ_D × √L**
>
> SS = safety stock (units)
> z = safety factor from the standard normal distribution for the desired service level
> σ_D = standard deviation of daily demand (units)
> L = replenishment lead time (days)

The service level used here is the **cycle service level** (probability of no stockout during a replenishment cycle, called α service level in German texts). It is not the same as the **fill rate** (share of demand quantity delivered immediately from stock, the β service level). Mixing them up leads to systematically mis-sized inventory.

**Worked example:** A purchased part is consumed at an average of 100 units per day; the standard deviation is 30 units per day. Replenishment lead time is 9 working days.

| Cycle service level | z | Calculation | Safety stock |
|---|---|---|---|
| 90% | 1.282 | 1.282 × 30 × √9 = 1.282 × 30 × 3 | ≈ 115 units |
| 95% | 1.645 | 1.645 × 30 × 3 | ≈ 148 units |
| 99% | 2.326 | 2.326 × 30 × 3 | ≈ 209 units |

Going from 95% to 99% costs over 40% more safety stock. High service levels get disproportionately expensive.

### 10.3 Formula for variable demand and variable lead time

If the lead time also varies, the formula is extended [19]:

> **SS = z × √(L × σ_D² + d² × σ_L²)**
>
> d = average daily demand, σ_L = standard deviation of lead time (days)

**Worked example (continued):** The supplier delivers after 9 days on average, but with a standard deviation of 2 days.

- L × σ_D² = 9 × 30² = 8,100
- d² × σ_L² = 100² × 2² = 40,000
- √(8,100 + 40,000) = √48,100 ≈ 219.3
- SS (95%) = 1.645 × 219.3 ≈ **361 units**

Safety stock rises from 148 to 361 units, almost two and a half times, purely because of the unreliable lead time. Lead time variation contributes about 83% of the variance here. Improving the supplier's on-time delivery often reduces inventory more than any forecast improvement.

### 10.4 Limits of the formula

- The normal distribution fits poorly for intermittent demand (many periods without consumption). Other distributions or simulation are more appropriate there.
- The formula assumes independent demand. For parts with dependent demand from bills of material, safety stock is usually the wrong tool; safety lead time or buffers at targeted points work better.
- Safety stock that is constantly being consumed is not safety stock but a planning error. Check regularly how often and why it is breached.

## 11. Production planning KPIs

Without KPIs you can neither prove the value of an APS nor improve planning. Define every KPI unambiguously before the rollout and measure a baseline. A separate m365.fm guide on [manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned) covers the wider set.

| KPI | Formula | What it tells you | Pitfalls |
|---|---|---|---|
| On time in full (OTIF) | lines delivered on time and complete ÷ all lines due | customer view | define the reference: requested or confirmed date; set a tolerance window |
| On-time delivery (OTD) | lines delivered on time ÷ all lines due | like OTIF but without the quantity criterion | partial shipments distort the picture |
| Lead time (manufacturing cycle time) | completion minus release (per order), mean and spread | speed of flow | the mean is not enough; spread drives ship-date reliability |
| Flow factor | mean lead time ÷ mean operation time | how much longer an order waits than it is worked on [8] | use the same time unit (working hours or calendar hours) |
| Work in process (WIP) | number or work content of released, uncompleted orders | lead time driver per Little's Law | measure in hours of work content, not just units |
| Utilization | busy time ÷ available time | use of capacity | high utilization at non-bottlenecks is not a success |
| Bottleneck utilization | productive time at the bottleneck ÷ available time at the bottleneck | the most important utilization KPI under TOC | report setup and idle time at the bottleneck separately |
| Setup ratio | setup time ÷ (setup time + processing time) | capacity lost to changeovers | especially critical at the bottleneck |
| Overall equipment effectiveness (OEE) | availability × performance × quality | effectiveness of a machine | fits equipment, not the evaluation of a schedule |
| Schedule adherence | operations started or finished per schedule ÷ all scheduled operations | how realistic and stable is the schedule? | define a tolerance, e.g., ± 1 shift |
| Schedule stability | changed operations in the frozen horizon ÷ all operations | planning nervousness | too many changes point to poor data or a missing frozen zone |
| Buffer status | share of orders in red, yellow and green | early warning under buffer management | only meaningful with defined buffers |

**Worked example, delivery performance:** In October, 480 order lines were due on their confirmed date. 432 shipped on time; 410 of those also shipped complete.

- On-time delivery = 432 ÷ 480 = **90.0%**
- OTIF = 410 ÷ 480 ≈ **85.4%**

**Worked example, setup ratio and flow factor:** In one week, the bottleneck spent 18 hours on setups and 62 hours processing. Setup ratio = 18 ÷ (18 + 62) = **22.5%**. An order with 6 hours of operation time spent 120 working hours (15 days of 8 hours) in the shop. Flow factor = 120 ÷ 6 = **20**: the order sat in the shop twenty times as long as anyone worked on it.

**KPI set for an APS rollout:** At minimum, measure OTIF, lead time (mean and spread), WIP and bottleneck utilization before go-live and monthly afterward. These four are linked through Little's Law and the operating curves and together show whether a better schedule has led to better flow.

## 12. Digital twin and simulation

**Simulation** models a production system and runs it over time. The German guideline VDI 3633 Part 1 covers the fundamentals of simulating logistics, material flow and production systems [16]. Simulation answers questions a static capacity calculation cannot, because it accounts for randomness, disruptions and interactions: How does a machine breakdown affect ship dates over the next two weeks? What does a third shift at the bottleneck deliver? How does a new product mix change lead times?

A **digital twin of production** goes one step further: it is a model that is continuously synchronized with data from ERP, MES and machines. For production scheduling it has three functions:

1. **Planning basis:** The APS schedules on a model that reflects resources, constraints and actual status in real time.
2. **Scenario analysis:** Before a decision, such as accepting a rush order or making an investment, alternatives are simulated and compared on KPIs.
3. **Learning loop:** Deviations between plan and actual flow back and improve standard times and constraints.

Distinguish between a simulation model built once for a study and a continuously maintained twin used in operations. The second delivers more value but requires stable data integration and clear ownership for model maintenance. How ERP data, twin and shop floor can be connected is shown in the post [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). The planned m365.fm guide [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned) goes deeper; the cloud and data side is covered in [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned).

**Value stream mapping first:** Before you model a twin or an APS, map the value stream. It shows where inventory sits, where the bottleneck is suspected and which information flows drive planning today. See the planned guide [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned).

## 13. How to choose production scheduling software: criteria and checklist

### 13.1 Before you shortlist: clarify goals and starting point

Whether you search for "production scheduling software," "APS software," "finite capacity scheduling software" or "capacity planning software," what matters in manufacturing is whether a system schedules capacity as finite and with your real constraints. Many tools that rank for these terms are project management or team resource planning tools. They are useful for projects, but they typically do not model routings, sequence-dependent setups or material availability. The "best production scheduling software" lists on google.com mix both categories, so check every candidate against the constraint table in Section 5.2.

Before you talk to vendors, answer three questions:

1. **Which problem should be solved?** For example: raise OTIF from 78% to over 90%, halve lead time, cut planning effort, give reliable ship dates at order entry.
2. **Which constraints really matter?** Go through the table in Section 5.2 and mark what applies in your plant.
3. **How good is your data?** Check routings, standard times and confirmation quality before selection (Section 14).

### 13.2 Selection criteria

| Criterion | Question to ask | Weight (example) |
|---|---|---|
| Constraint modeling | Does the system model all relevant constraints without custom code? | high |
| Schedule quality | How good are the schedules for *your* data, measured on your objectives? | high |
| Run time | How long does a full reschedule take at realistic data volume? | medium to high |
| Interactive scheduling | Can planners drag and drop orders, and does the system check the consequences immediately? | high |
| Explainability | Can planners see why an order was scheduled where it is? | high |
| Scenarios and simulation | Can variants be calculated in parallel and compared on KPIs? | medium |
| ERP integration | Are there standard connectors to your ERP, in which direction, how often? | high |
| MES and confirmation integration | How do actuals reach the APS, and how fast? | high |
| Usability | Do planners and supervisors accept the interface? | high |
| Scalability | Multiple plants, more resources, more orders? | medium |
| Operations and security | Cloud or on-premises, hosting region, certifications (for example ISO/IEC 27001, SOC 2), role and permission model, fit with your security framework (for example NIST CSF 2.0 [35]); for US defense suppliers, CMMC requirements that apply to the data involved [36] | medium |
| Vendor and partners | Industry experience, references with comparable production, support, roadmap | medium |
| Total cost of ownership | Licenses, implementation, data cleanup, training, operations over 5 years | medium |

**What about price?** Pricing in this category ranges from per-user SaaS subscriptions for simple tools to enterprise quotes for multi-plant APS, and most APS vendors publish no list prices. The software directories that rank for the head term show the same pattern: many listings say "pricing upon request," and at least one ranking directory still shows pricing data collected in 2019. Compare total cost of ownership over five years, including internal effort for data cleanup and integration, rather than license price alone.

### 13.3 Selection checklist

Use the list as a checklist for vendor meetings and proof-of-concept tests:

- [ ] Goals and KPIs with baseline values are documented.
- [ ] Relevant constraints are prioritized (must, should, nice to have).
- [ ] A representative test dataset with real orders, routings and setup times is ready.
- [ ] Every vendor schedules the **same** test dataset; results are compared on the same KPIs.
- [ ] A disruption scenario was tested (machine breakdown, rush order, late material).
- [ ] The run time of a full reschedule was measured.
- [ ] Your own planners worked with the system hands-on, not just watched a demo.
- [ ] The ERP interface is specified (objects, direction, frequency, error handling).
- [ ] The confirmation path from the shop floor is defined (MES, terminal, mobile app).
- [ ] The system explains its scheduling decisions in a way planners can follow.
- [ ] Roles and permissions can be modeled (who may schedule, release, freeze?).
- [ ] At least one reference with a comparable production type was interviewed in person.
- [ ] Total cost over five years is calculated, including internal effort.
- [ ] Data protection, hosting and information security are agreed with IT (and, for defense work, with whoever owns CMMC compliance).
- [ ] An exit option (data export, contract term) is clarified.

**Tip:** The most telling test is a **pilot with your own data**. Vendor demos with clean sample data say little about how a system handles your incomplete routings and special cases.

## 14. Data requirements and master data quality

An APS calculates precisely, including with wrong data. A schedule based on standard times that are 30% off is precisely wrong. Data quality is therefore the most common reason APS projects take longer than planned.

| Data object | Minimum requirement | Typical gaps | How to check |
|---|---|---|---|
| Routings | complete operation sequence, correct work center group | missing operations, obsolete resources | compare samples with the actual shop flow |
| Standard times (processing) | deviation from actuals within a defined tolerance band | standards from costing instead of measurement | plan vs. actual from confirmations |
| Setup times | sequence-dependent where relevant (changeover matrix) | one flat setup time per operation | analyze setup logs |
| Resources and calendars | shift patterns, breaks, maintenance windows, plant shutdowns | calendars not maintained in the ERP | compare with the shift schedule |
| Alternate resources | permitted alternates with performance factor | only known to supervisors | interviews, then maintain in the system |
| Labor and skills | skills matrix, attendance planning | not available digitally | build a skills matrix |
| Tools and fixtures | count, assignment to operations | not modeled as a resource | reconcile with the tool list |
| Inventory and purchase dates | correct stock, reliable delivery dates | posting backlogs, unconfirmed delivery dates | cycle count variances, supplier on-time delivery |
| Confirmations | timely, per operation, with quantity and time | batch confirmation at end of shift or none at all | measure confirmation rate and delay |
| Orders and priorities | clear due dates, customer priority | dates pulled in "just in case" | review due-date history |

**Rule of thumb for the sequence:** Start with the bottleneck. If routings, standard times and setup times at the bottleneck resources are right, the schedule is already much better than before, even if non-bottlenecks still have inaccuracies. Then work your way along the material flow.

**Confirmations are the key:** Without timely shop-floor confirmations, the APS does not know where an order is and schedules against a state that no longer exists. Just as important: only confirmations allow the plan-vs-actual comparison that improves standard times over time.

## 15. APS implementation roadmap

The roadmap below describes proven phases. The durations are rough guide values for a single-site, midsize plant and depend heavily on data quality, integration effort and project resources [unverified: no robust study on implementation duration found].

| Phase | Content | Result | Guide value |
|---|---|---|---|
| 1. Assessment | goals, KPIs with baselines, value stream and bottlenecks, constraints, data quality | requirements spec, data findings, business case | 4 to 8 weeks |
| 2. Selection | vendor long list, test dataset, proof of concept, reference calls | system decision, contract | 6 to 12 weeks |
| 3. Data cleanup | routings, standard and setup times, calendars, skills; starting at the bottleneck | schedulable master data | parallel to phases 2 and 4, often the longest block |
| 4. Modeling and integration | resource model, constraints, objective weights, ERP and MES interfaces | working scheduling model | 8 to 16 weeks |
| 5. Pilot | one area, ideally including the bottleneck; parallel run with the old process | proof of schedule quality, user acceptance | 6 to 12 weeks |
| 6. Rollout | further areas, retire shadow scheduling, release rules, frozen zone | live operation | depends on scope |
| 7. Continuous improvement | plan vs. actual, maintain standard times, analyze buffer causes, KPI review | a planning system that learns | ongoing |

**Success factors across all phases:**

- **Involve planners from day one.** An APS that planners do not trust gets bypassed, and the Excel sheet lives on.
- **Settle planning rules before the software.** Who may change priorities? How long is the frozen zone? What rule governs release?
- **Start small, learn fast.** A pilot at the bottleneck shows within weeks whether data and model hold up.
- **Measure success.** Without baselines the value cannot be proven, and the project discussion turns into opinion.
- **Bring the shop floor in.** A schedule only helps if it reaches the floor as tasks and confirmations flow back. For the daily routines that make that work, see the planned guide [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned).

## 16. Common mistakes and how to avoid them

| Mistake | Consequence | Better |
|---|---|---|
| APS as a substitute for process improvement | unstable processes just get scheduled more precisely | stabilize setups, breakdowns and release first, schedule in parallel |
| Modeling every constraint at once | project slips, model becomes incomprehensible | start with the constraints that act on the bottleneck |
| Taking standard times from costing | schedules are systematically too optimistic or too pessimistic | use actuals from confirmations and update them regularly |
| Scheduling every resource at maximum utilization | long queues, erratic lead times | load the bottleneck fully, leave slack at non-bottlenecks |
| No frozen horizon | constant rescheduling, nervousness on the floor | define a frozen zone, e.g., the next 1 to 3 shifts |
| Release without a WIP cap | lead time syndrome, inventory build-up | release by the bottleneck or under a WIP cap |
| Blanket increases of planned lead times when orders run late | earlier releases raise WIP and lateness | fix causes at the bottleneck, control release |
| Objectives not agreed | sales, production and logistics judge the schedule differently | agree and document objective weights together |
| Planners not involved | system gets bypassed, shadow scheduling stays | involve planners in selection, modeling and pilot |
| Confirmations only at end of shift | APS schedules against an outdated state | timely confirmation per operation |
| Success not measured | value remains a claim | collect baselines before go-live |
| Black-box optimization | planners do not understand or trust the schedule | choose a system with explainable scheduling decisions |

**Quick wins without new software:** If you want to start tomorrow, five steps need no investment:

1. For the last eight weeks, compare load and capacity for each resource and name the bottleneck.
2. Count WIP and use Little's Law to calculate average lead time. If it differs sharply from the planned lead times in the ERP, you know why dates do not hold.
3. Set a release rule: new orders enter the shop only when the queue in front of the bottleneck is below a defined limit.
4. At the bottleneck, prioritize by due date and setup family, not by whoever shouts loudest.
5. Check standard and setup times at the bottleneck against actuals and correct the largest deviations.

## 17. Evidence: what studies and users report

**Theory of constraints in the literature:** Victoria Mabin and Steven Balderstone analyzed more than 80 successful TOC applications with quantitative results reported in the literature [5]. According to the summary by Roberto Panizzolo, these cases reported mean improvements of 70% in lead time from order to delivery, 65% in manufacturing cycle time, 49% in inventory, 63% in throughput or revenue and 44% in due-date performance [6]. Read these numbers with care: only published success stories were analyzed, and no failures were found in the literature [5]. This is a positive selection, not the expected average of any implementation. The direction of the results is still consistent with Little's Law and the operating curves: less WIP with a protected bottleneck means shorter lead times.

**User reports from APS vendors:** Vendors publish many case examples. The German MES vendor MPDV, for instance, reports for its customer VACOM, which schedules about 1,200 orders with up to 20 operations each, roughly 50% time savings in planning [30]. Such figures are vendor claims without a disclosed measurement method. They show what effects are possible but do not replace a pilot with your own data. The same applies to the case figures on the US vendor pages that rank for "production scheduling software."

**Aerospace as the extreme case:** Aerospace manufacturing combines long lead times, assembly zones with limited floor space, skill and certification requirements and complete traceability. Scheduling there has to protect not only dates but also records. The requirements for lead time and traceability are described in the post [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/). A full guide is planned: [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned).

**What generalizes:** Across studies and reports, three patterns recur. First, most of the benefit comes not from the algorithm but from transparency about capacity and the bottleneck. Second, WIP caps and controlled release work fast and cheaply. Third, whether results last depends on whether shop-floor confirmations and plan-vs-actual comparison keep working.

## 18. Constraint-based planning with iFAKT Polaris

> **Note: The author works at iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), headquartered in Stuttgart, Germany, develops the [iFAKT Polaris](https://www.m365.fm/entity/polaris/) software family. According to the company website, Polaris connects ERP data with a digital twin of production and lists as functions constraint-based planning (resources, skills, shifts, buffers), what-if simulations for disruptions and mix changes, and a KPI cockpit with lead time, WIP, utilization and on-time performance [28]. The website names aerospace, automotive, machinery and automation, and energy and infrastructure as industries [28]. Two modules are relevant to the topics of this guide:

**[Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/)**, according to the vendor page, creates an optimized, executable production schedule from ERP data, resource availability and operational constraints [26]. Listed capabilities:

- automatic scheduling of machines, employees and tools, considering shifts, zones, skills and capacities
- bottleneck detection, order prioritization and visibility of late orders and delivery risks
- impact analysis and re-optimization after disruptions, including based on shop-floor feedback
- a lot size optimization module that determines lot sizes per variant and machine, a setup-optimized sequence, and inventory levels balancing storage cost against delivery readiness
- support for short-term operational planning and long-term capacity forecasting

**[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)**, according to the vendor page, takes the optimized schedules and delivers them as time-based tasks to workers and shift leads on the shop floor [27]. Listed are an individual task view per worker, critical-path visibility for shift leaders, work instructions embedded in tasks, the option to pause, block or flag tasks with structured feedback, and a live WIP overview for planners. Feedback on progress, delays and disruptions flows back into planning [27].

The described functions therefore address two points this guide identifies as critical: scheduling against real constraints (Section 5.2) and the closed loop of plan, execution and feedback (Sections 6 and 14). iFAKT GmbH shows ISO 9001 and ISO/IEC 27001 certifications on its website [27]. The product pages give no customer counts or quantified results with a disclosed method [26][27]. All capability statements above are vendor claims.

**Perspective:** Polaris is one of many solutions on the market. Evaluate it like any other system with the checklist in Section 13.3 and a pilot with your own data. A dedicated guide, [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned), is in preparation.

## 19. Glossary

| Term | Explanation |
|---|---|
| APS (advanced planning and scheduling) | software and methods for scheduling against finite capacity and material availability with optimization |
| ATP (available to promise) | quantity that can be promised from inventory and planned receipts |
| Buffer management | control based on consumption of time buffers in zones (green, yellow, red) |
| Changeover matrix | table of sequence-dependent setup times between variants |
| CONWIP | pull control with a constant total number of orders in a line |
| CTP (capable to promise) | achievable ship date considering material and capacity |
| CRP (capacity requirements planning) | capacity planning step in MRP II; shows load but does not resolve overloads |
| Cycle time (Little's Law) | time an order spends in the system from release to completion; see [Lead Time](https://www.m365.fm/entity/lead-time/) |
| Detailed scheduling | scheduling of individual operations on resources with sequence and time (German: *Feinplanung*) |
| Drum-buffer-rope (DBR) | TOC control: the bottleneck sets the pace, a time buffer protects it, release is tied to it |
| EOQ (economic order quantity) | square-root lot size formula by Harris (1913); called the Andler formula in German texts |
| Finite capacity scheduling | scheduling in which no scheduled capacity exceeds available capacity (ISA-95) |
| Flow factor | ratio of lead time to operation time |
| Frozen zone | frozen planning horizon in which no more rescheduling happens |
| Heijunka | leveling of volume and mix over time |
| Lead time syndrome | vicious circle of longer planned lead times, earlier release, more WIP and even longer lead times |
| Little's Law | cycle time = WIP ÷ throughput |
| Lot size | quantity produced without interruption by a setup; see [Batch Size](https://www.m365.fm/entity/batch-size/) |
| MES (manufacturing execution system) | system for execution, data collection and shop-floor control (ISA-95 Level 3; VDI 5600) |
| MPS (master production schedule) | production program for end items |
| MRP (material requirements planning) | material planning by BOM explosion with planned lead times |
| MRP II (manufacturing resource planning) | extension of MRP with master scheduling, capacity and financial planning |
| OTIF (on time in full) | share of lines delivered on time and complete |
| PPC | production planning and control (German: PPS) |
| Setup time | time to change a resource over between two orders; see [Setup Time](https://www.m365.fm/entity/setup-time/) |
| Safety stock | inventory held to protect against demand and lead time variation |
| Takt time | available time ÷ customer demand |
| Bottleneck (constraint) | resource that limits the throughput of the whole system |
| TOC (theory of constraints) | management approach that aligns the system with its constraint |
| WIP (work in process) | released, not yet completed orders on the shop floor |

## 20. FAQ: production scheduling software and APS

### What is production scheduling software?

Production scheduling software decides which operation runs on which machine or work center, in what sequence and at what time. Good tools schedule against finite capacity and real constraints such as shifts, skills, tools and sequence-dependent setups. Many tools sold under the name are project or resource planners; for manufacturing, check whether they model routings, setups and material availability.

### What is an APS system?

An APS (advanced planning and scheduling) system is planning software that schedules manufacturing orders against the finite capacity of machines, people and tools and against material availability. It creates feasible sequences and dates using heuristics and mathematical optimization.

### What is the difference between APS and MRP?

MRP calculates which material is needed when, by exploding bills of material and backing off fixed planned lead times. In its basic form it assumes unlimited capacity. APS schedules operations against finite capacity and material at the same time, so its dates are feasible. MRP answers "what do we need"; APS answers "what can we actually build, and when."

### What is the difference between APS and ERP? Does APS replace ERP?

No, APS does not replace ERP. The ERP is the system of record for orders, material, inventory and finance. Its planning logic (MRP) assumes unlimited capacity and fixed lead times in its basic form. An APS adds scheduling against real capacity and constraints and returns realistic dates to the ERP.

### What is the difference between APS and MES?

An APS plans what should run when on which resource. An MES controls and records execution in real time. ISA-95 places both the work schedule and its execution in manufacturing operations management (Level 3) [31], and the German VDI 5600 lists detailed scheduling as an MES task [15]. In practice, scheduling is done either by an MES module or by a stand-alone APS that exchanges data with the MES.

### What is the difference between production planning and production scheduling?

Planning works with aggregated quantities, weekly or monthly buckets and work center groups to set the program and material requirements. Scheduling assigns individual operations to resources with a sequence and start time, typically in hours or shifts.

### What are the types of production scheduling?

The most useful distinctions are finite versus infinite capacity scheduling and the scheduling direction: forward scheduling (earliest start, earliest finish), backward scheduling (from the due date, latest start) and bottleneck-based scheduling (load the bottleneck first, then schedule upstream backward and downstream forward).

### Is Excel enough for production scheduling?

Sometimes. With few orders, setups that barely depend on sequence and a stable bottleneck, a spreadsheet or scheduling board plus disciplined bottleneck control (DBR) often works. Software becomes necessary when the number of constraints and reschedules exceeds what manual planning can handle reliably, which the constraint table in Section 5.2 helps you judge.

### When does an APS pay off?

Typically when several of these apply: many operations per order, sequence-dependent setups, shifting or multiple bottlenecks, scarce skilled labor, frequent rush orders, heavy rescheduling effort and on-time delivery that disappoints despite high inventory. There is no universal company size threshold.

### Is APS suitable for small and midsize manufacturers?

Yes. Planning complexity matters more than company size. For small and midsize manufacturers, systems with standard ERP connectors, configuration without custom code and a step-by-step start at the bottleneck are a good fit.

### How much does production scheduling software cost?

There is no reliable public price benchmark. Simple tools are sold as per-user subscriptions; most APS vendors quote by plant, resources and scope. Budget for total cost of ownership over five years, including data cleanup, integration, training and internal effort, and ask every vendor to quote against the same scope.

### How do I find the bottleneck in my plant?

For each resource, compare planned load including setups with available capacity over several weeks, watch where queues form permanently, and check which resource leaves downstream areas idle. Bottlenecks can also be people, inspection stations or tools, and they shift when the mix changes.

### What is drum-buffer-rope in simple terms?

The bottleneck is the drum that sets the pace. A time buffer in front of it protects it from disruptions. The rope ties material release to the bottleneck schedule so that no more work enters the shop than the bottleneck can process [2].

### How can I reduce manufacturing lead time?

The fastest lever is usually capping WIP, because by Little's Law lead time falls in proportion to WIP at constant throughput [9]. Other levers are smaller lots with short setups, less variability and keeping non-bottleneck utilization below the point where queues explode.

### How do I improve on-time delivery?

Schedule against finite capacity so that promised dates are feasible, control release at the bottleneck, prioritize daily work by buffer status and analyze the causes of late orders systematically. Measure delivery performance consistently, for example as OTIF against the confirmed date.

### How do you calculate the economic order quantity?

The classic EOQ formula is Q* = √(2 × annual demand × setup or ordering cost per lot ÷ holding cost per unit per year). With 12,000 units of demand, $300 setup cost and $8 holding cost, the result is about 949 units. The formula ignores capacity and sequence and is only a starting value.

### How do you calculate safety stock?

With variable demand and constant lead time: SS = z × σ_D × √L. With a standard deviation of 30 units per day, a 9-day lead time and a 95% cycle service level (z = 1.645), you get about 148 units. If the lead time also varies, the value rises sharply.

### Can AI take over production scheduling?

AI improves predictions of processing and setup times, detects disruption patterns and speeds up the search for good schedules. It does not replace clean master data or agreement on objectives and rules. Without reliable confirmation data, AI learns from bad data too.

### How long does an APS implementation take?

It depends mainly on data quality, integration effort and scope. A pilot in a bottleneck area can be live within a few months; a full rollout across several areas takes longer. There is no robust independent study on typical implementation times.

### Does APS replace production planners?

No. An APS takes over the calculation, not the decisions. Planners set priorities, maintain rules and data, handle exceptions and decide between scenarios. In successful rollouts, planners spend less time rebuilding schedules and more time on causes of delays.

## 21. Conclusion

Production schedules rarely fail because planners do not try hard enough. They fail because the planning logic assumes unlimited capacity and fixed lead times. The physics of the factory is clear: lead time follows from WIP and throughput, queues explode at high utilization, and the bottleneck determines what the plant can deliver.

An APS addresses exactly that. It schedules against finite capacity and real constraints, makes ship dates calculable and shows the consequences of disruptions and rush orders before they hit. It delivers results only together with three things no software provides: a clear focus on the bottleneck, controlled order release, and master data and confirmations that match reality.

So start in a simple order: identify the bottleneck, measure and cap WIP, clean up the bottleneck data, then test production scheduling software with APS capabilities in a pilot with your own data. That way the Excel shadow schedule is not replaced by a new black box but by a schedule that production, sales and customers can trust.

## Further reading on m365.fm

**Posts**

- [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/)
- [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Entity pages**

[Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Buffer Management](https://www.m365.fm/entity/buffer-management/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Line Balancing](https://www.m365.fm/entity/line-balancing/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [iFAKT](https://www.m365.fm/entity/ifakt/)

**Sister guides (planned, not yet published)**

- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about production planning and scheduling, lean manufacturing and the digital transformation of manufacturing. At [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), the developer of [iFAKT Polaris](https://www.m365.fm/entity/polaris/), he works on how constraint-based planning, digital twins and shop-floor feedback fit together so that schedules hold on the shop floor.

**Note: The author works at iFAKT GmbH.**

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All online sources accessed November 20, 2026.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press 1984 (3rd rev. ed. 2004, ISBN 978-0-88427-178-9).
2. Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
3. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html
4. Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, Mokshagundam L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
5. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636
6. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
7. Schuh, Günther; Stich, Volker (eds.): Produktionsplanung und -steuerung 1. Grundlagen der PPS [Production planning and control 1: Fundamentals]. 4th rev. ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-642-25422-2. (German)
8. Nyhuis, Peter; Wiendahl, Hans-Peter: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-540-92838-6. DOI: 10.1007/978-3-540-92839-3 (German). English edition: Nyhuis, Peter; Wiendahl, Hans-Peter: Fundamentals of Production Logistics. Theory, Tools and Applications. Springer, Berlin/Heidelberg 2009 (published October 2008), ISBN 978-3-540-34210-6, DOI: 10.1007/978-3-540-34211-3
9. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383
10. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
11. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
12. Lödding, Hermann: Verfahren der Fertigungssteuerung. Grundlagen, Beschreibung, Konfiguration [Production control methods]. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2016, ISBN 978-3-662-48458-6 (print), 978-3-662-48459-3 (e-book). (German)
13. Fleischmann, Bernhard; Meyr, Herbert; Wagner, Michael: Advanced Planning. In: Stadtler, Hartmut; Kilger, Christoph; Meyr, Herbert (eds.): Supply Chain Management and Advanced Planning. Concepts, Models, Software, and Case Studies. 5th ed., Springer, Berlin/Heidelberg 2015, pp. 71–95. DOI: 10.1007/978-3-642-55309-7_4 (book: DOI 10.1007/978-3-642-55309-7)
14. Garey, M. R.; Johnson, D. S.; Sethi, Ravi: The Complexity of Flowshop and Jobshop Scheduling. Mathematics of Operations Research 1 (1976) 2, pp. 117–129. DOI: 10.1287/moor.1.2.117
15. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 ; table of contents: https://www.vdi.de/fileadmin/pages/vdi_de/redakteure/richtlinien/inhaltsverzeichnisse/2436698.pdf (German guideline of the Association of German Engineers)
16. VDI 3633 Part 1: Simulation of systems in materials handling, logistics and production – Fundamentals. Edition December 2014. https://din.de/de/wdc-beuth:din21:149034959 (German guideline)
17. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2, pp. 135–136; and Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, pp. 937–946. DOI: 10.1287/opre.38.6.937
18. Andler, Kurt: Rationalisierung der Fabrikation und optimale Losgröße. Oldenbourg, Munich/Berlin 1929 [unverified: bibliographic details and first name not verified online, original not consulted; formula and assumptions per University of Duisburg-Essen, exercise "Statische Losgröße – Andler-Modell": https://www.uni-due.de/imperia/md/content/tul/de_ss2013_lm01_uebung_statische_losgroesse_andler_modell.pdf].
19. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4th ed., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
20. Ohno, Taiichi: Toyota Production System. Beyond Large-Scale Production. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-14-0.
21. Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
22. Boysen, Nils; Fliedner, Malte; Scholl, Armin: A classification of assembly line balancing problems. European Journal of Operational Research 183 (2007) 2, pp. 674–693. Reference: https://econpapers.repec.org/RePEc:eee:ejores:v:183:y:2007:i:2:p:674-693
23. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193
24. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975.
25. Logistik Heute: SCM-Studie: Mehr als ein Drittel der deutschen Unternehmen nutzt Excel als Rückgrat für die Lieferkettenplanung (IDC for Kinaxis), April 18, 2024. https://logistik-heute.de/news/scm-studie-mehr-als-ein-drittel-der-deutschen-unternehmen-nutzt-excel-als-rueckgrat-fuer-die-lieferkettenplanung-104313.html (German)
26. iFAKT GmbH: Polaris Optimizer. https://www.ifakt.de/en/solutions/optimizer
27. iFAKT GmbH: Polaris Operator. https://www.ifakt.de/en/solutions/operator
28. iFAKT GmbH: Home page. https://www.ifakt.de/
29. Pinedo, Michael L.: Scheduling. Theory, Algorithms, and Systems. 5th ed., Springer, Cham 2016. DOI: 10.1007/978-3-319-26580-3
30. MPDV Mikrolab GmbH: APS-Systeme einfach erklärt (Smart Factory glossary, with VACOM customer example). https://www.mpdv.com/industrie-4-0/smart-factory-glossar/advanced-planning-and-scheduling-system-aps (German)
31. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation. Preview incl. clause 3.1 definition of finite capacity scheduling: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf
32. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis, 1,800 respondents in nine countries incl. USA and Canada, fielded December 2023), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours
33. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf
34. Lean Enterprise Institute: Lean Lexicon, "Heijunka." https://www.lean.org/lexicon-terms/heijunka/
35. National Institute of Standards and Technology (NIST): The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
36. U.S. Department of Defense: Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), final rule. Federal Register 90 (2025) 173, September 10, 2025, effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm

---

# Editorial notes

## Unverified items and points to check

1. **Andler [18]:** First name "Kurt," title, publisher and year (Oldenbourg 1929) could not be confirmed in a library catalog; the literature consistently calls it the "Andler formula." Please check in the DNB or KVK catalog. Formula and assumptions are supported by [18] (University of Duisburg-Essen). In the English version, Andler only appears as the German name for Harris's EOQ.
2. **DBR starting buffer (Section 7.3):** "about half the current lead time up to the bottleneck" is marked [unverified]. No primary source with this exact rule of thumb was consulted. Delete or support with Cox/Schleier [4].
3. **Roadmap durations (Section 15):** marked as rough guide values without a study [unverified]. Replace with the author's experience if available and label as such.
4. **Buffer management zones:** The split into thirds is described as a convention; the chapter page consulted [4] does not state the zones explicitly.
5. **Hopp/Spearman [10]:** The statement on fixed lead times and unlimited capacity is paraphrased (cross-checked against secondary summaries and lecture slides in the German review); add page numbers if a copy is available. Same for the VUT form of Kingman's equation.
6. **Fleischmann/Meyr/Wagner [13]:** Bibliography verified (chapter DOI). The content summary (planning matrix, supplement rather than replacement of ERP) matches the known chapter content, but the full text was not consulted.
7. **Mabin/Balderstone [5]:** Percentages cited via Panizzolo [6], who references the 2000 book version ("The World of the Theory of Constraints," St. Lucie Press). The 2003 journal version [5] is bibliographically verified; the values come from the secondary source.
8. **IDC/Kinaxis [25][32]:** vendor-sponsored study, labeled in the text; scope is supply chain planning, not detailed scheduling. The global 83% figure is from the Kinaxis press release [32] (verified November 20, 2026). The Excel figure (37%) exists only for the German subsample [25]; no US or global spreadsheet figure was found in the release or the IDC executive summary.
9. **MPDV/VACOM [30]:** vendor claim without method, labeled in the text.
10. **Boysen et al. [22]:** DOI could not be confirmed via an accessible index; RePEc reference given instead. Lödding [12]: ISBN instead of DOI.
11. **Nyhuis/Wiendahl English edition [8]:** "Fundamentals of Production Logistics. Theory, Tools and Applications" verified on springer.com (copyright 2009, hardcover October 2008, ISBN 978-3-540-34210-6). US readers can use the English edition; page references in the text are not given.
12. **FAQ "How much does production scheduling software cost?":** No independent price benchmark was found; the answer therefore gives no figures. A draft clause claiming that implementation effort often exceeds first-year license cost was deleted in review (no source).
13. **Capterra pricing (Section 13.2 and competitive analysis):** "pricing data collected in 2019" refers to the capterra.com category page as read on November 20, 2026; recheck before publication, as directories update often.
14. **SOC 2** is named in Section 13.2 only as an example of a common attestation buyers ask for, without a source; it is not a claim about any vendor.
15. **Opening scenario** ("140 work orders") and all worked examples are constructed illustrative numbers, not measurements. The EOQ example uses US dollars with the same numeric values as the German euro example; these are illustrative, not converted amounts.

## Vendor-only claims

- iFAKT Polaris capabilities [26][27][28]: vendor statements, labeled "according to the vendor page/company website"; no customer counts or quantified results taken over. ISO 9001 and ISO/IEC 27001 badge confirmed on the Operator page footer (November 20, 2026).
- MPDV/VACOM 50% planning time savings [30].
- Case figures on US vendor pages (PlanetTogether and others) are mentioned generically and not quoted.

## iFAKT facts and disclosure

- iFAKT GmbH, headquarters Curiestrasse 2, 70563 Stuttgart, Germany (commercial register Stuttgart HRB 22661). The article names only "headquartered in Stuttgart, Germany." No other locations are mentioned.
- Disclosure in Section 18 and in the author box reads exactly "**Note: The author works at iFAKT GmbH.**" This line satisfies the FTC Endorsement Guides' requirement to disclose a material connection (employment). It is deliberately not labeled as sponsorship: iFAKT does not pay for publication, so no "sponsored" or "paid partnership" label and no `rel="sponsored"` are used.
- Open point from the German consistency check (still relevant for the English launch): the m365.fm entity page https://www.m365.fm/entity/ifakt/ has been shown as "Sponsored / Paid partnership with iFAKT GmbH." This contradicts the confirmation that iFAKT does not pay. Align the entity page labeling before publishing the English version, because the article links it.

## Internal links

- Entity pages (`/entity/...`) unchanged from the German version.
- Blog posts: titles checked against the live pages on November 20, 2026 ("From ERP to Shop Floor: Why Production Plans Need a Digital Twin," November 11, 2026; "Production Planning for Aerospace Suppliers: Lead Time and Traceability," November 11, 2026; "Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling," September 16, 2026). The "Beyond MRP" post is new in the English version (not linked in the German original).
- Sister guides: absolute English URLs per the localization brief slug map (`/en/learn/<slug>/`), all marked "(planned)". Added in the English version compared with the German list: Lean Manufacturing (Section 8 and list) and Shop Floor Management (Section 15 and list), because the topics are referenced in the text. Remove "(planned)" at launch.
- Table-of-contents anchors use GitHub-style slugs; adjust if the CMS creates different anchors (e.g., for the apostrophe in "Little's Law").

## Cannibalization and hreflang

- hreflang pair: `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/ <-> `de-DE` https://www.m365.fm/learn/produktionsplanung-aps/. Both pages need reciprocal hreflang tags and self-referencing canonicals.
- Possible overlap with the English blog post "Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling" (approx. 1,100 words) for "finite capacity scheduling" and "MRP vs APS." Mitigation: the guide links the post as a short read; the post should link back to this guide with the anchor "production scheduling software and APS guide." Consider the guide as the canonical target for the head term.
- Sister guide "Aerospace Production Planning" and the aerospace post target "aerospace production planning," not the head term here; no conflict expected.

## Recommended graphics

- Logistic operating curve (output and lead time over WIP) with the operating range marked
- VUT curve: queue time over utilization (values from the table in Section 4.3)
- Gantt chart of the three sequences from the dispatching rule example
- DBR diagram with drum, buffer and rope
- ERP, APS, MES system landscape as a closed loop, labeled with ISA-95 Levels 4 and 3
- EOQ cost curve (setup, holding and total cost)

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/#article",
      "headline": "Production Scheduling Software and APS: The Complete Guide to Schedules That Hold on the Shop Floor",
      "description": "Production scheduling software and APS explained: finite capacity, bottlenecks, drum-buffer-rope, EOQ, safety stock, worked examples and a checklist.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/production-scheduling-aps/",
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.m365.fm/entity/ifakt/" }
      },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "about": [
        { "@type": "Thing", "name": "Advanced Planning and Scheduling", "sameAs": "https://www.m365.fm/entity/advanced-planning-and-scheduling/" },
        { "@type": "Thing", "name": "Theory of Constraints", "sameAs": "https://www.m365.fm/entity/theory-of-constraints/" },
        { "@type": "Thing", "name": "Production planning and control" }
      ],
      "keywords": "production scheduling software, APS software, advanced planning and scheduling, finite capacity scheduling, MRP vs APS, bottleneck analysis, drum buffer rope, economic order quantity, safety stock"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/#faq",
      "mainEntity": [
        { "@type": "Question", "name": "What is production scheduling software?", "acceptedAnswer": { "@type": "Answer", "text": "Production scheduling software decides which operation runs on which machine or work center, in what sequence and at what time. Good tools schedule against finite capacity and real constraints such as shifts, skills, tools and sequence-dependent setups. Many tools sold under the name are project or resource planners; for manufacturing, check whether they model routings, setups and material availability." } },
        { "@type": "Question", "name": "What is the difference between APS and MRP?", "acceptedAnswer": { "@type": "Answer", "text": "MRP calculates which material is needed when, by exploding bills of material and backing off fixed planned lead times. In its basic form it assumes unlimited capacity. APS schedules operations against finite capacity and material at the same time, so its dates are feasible. MRP answers \"what do we need\"; APS answers \"what can we actually build, and when.\"" } },
        { "@type": "Question", "name": "What is the difference between APS and ERP? Does APS replace ERP?", "acceptedAnswer": { "@type": "Answer", "text": "No, APS does not replace ERP. The ERP is the system of record for orders, material, inventory and finance. Its planning logic (MRP) assumes unlimited capacity and fixed lead times in its basic form. An APS adds scheduling against real capacity and constraints and returns realistic dates to the ERP." } },
        { "@type": "Question", "name": "How can I reduce manufacturing lead time?", "acceptedAnswer": { "@type": "Answer", "text": "The fastest lever is usually capping WIP, because by Little's Law lead time falls in proportion to WIP at constant throughput. Other levers are smaller lots with short setups, less variability and keeping non-bottleneck utilization below the point where queues explode." } },
        { "@type": "Question", "name": "How do you calculate safety stock?", "acceptedAnswer": { "@type": "Answer", "text": "With variable demand and constant lead time: SS = z × σ_D × √L. With a standard deviation of 30 units per day, a 9-day lead time and a 95% cycle service level (z = 1.645), you get about 148 units. If the lead time also varies, the value rises sharply." } }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/en/learn/" },
        { "@type": "ListItem", "position": 2, "name": "Production Scheduling Software and APS", "item": "https://www.m365.fm/en/learn/production-scheduling-aps/" }
      ]
    }
  ]
}
```

Note: Five of the 20 FAQs are written out in the FAQPage markup as examples; add the remaining 15 from Section 20 in the same way. Markup answers must match the visible text (keep [n] reference markers out of the markup text).

---

## Review log

English localization of `produktionsplanung-aps.md`, November 20, 2026. Five roles, two rounds. The German review (three rounds, 27 facts verified online, all formulas recalculated by script) carries over for every unchanged fact; this log covers the localization. Worked examples were recalculated by script for the English version (number format changed from 1.000,5 to 1,000.5; EOQ example switched from EUR to USD with identical values, labeled as illustrative).

**New or re-verified online for the English version (November 20, 2026):** ANSI/ISA-95.00.03-2013 preview (title, clause 3.1 definition of finite capacity scheduling, "Detailed Production Schedule changed to Work Schedule") [31]; Kinaxis/IDC press release April 16, 2024 (1,800 respondents, nine countries incl. USA and Canada, fielded December 2023, 83% figure, commissioned by Kinaxis) [32] plus the IDC InfoBrief executive summary (no spreadsheet figure); ASCM APICS CPIM 2026 brochure (modules incl. S&OP and Detailed Schedules) [33]; Lean Enterprise Institute lexicon entry "Heijunka" [34]; NIST CSF 2.0, CSWP 29, February 26, 2024 [35]; DFARS Case 2019-D041 CMMC final rule, Federal Register September 10, 2025, effective November 10, 2025 [36]; Springer record of Nyhuis/Wiendahl "Fundamentals of Production Logistics" [8]; iFAKT Polaris Optimizer and Operator pages incl. ISO badge [26][27]; titles and dates of the three m365.fm blog posts.

### Round 1

| Role | Verdict | Main findings |
|---|---|---|
| Subject-matter expert (production planning / OR, US practice) | not satisfied | (a) Section 6 claimed ISA-95 lists "detailed scheduling, dispatching and execution" as Level 3 activities; the verified preview only shows the Level 3 scope and the "work schedule" term, so the wording overstates what was checked. (b) "cycle time" in Little's Law collides with the US lean meaning (station cycle time vs. takt); needs a clarifying note. (c) "control room" for German *Leitstand* is not a US term. |
| SEO specialist (US) | not satisfied | (a) Meta description 157 characters, over the 155 limit (metadata said 155). (b) Meta title is 52, not 51 characters. (c) Head term SERP is listicle-heavy; article needs an explicit answer to "how much does it cost" and "does APS replace planners" (PAA). (d) FAQ should lead with "What is production scheduling software?" to match the head term. |
| Reader (US plant manager, 300-person job shop) | mostly satisfied | Clear and usable. Wants (a) guidance on whether Excel is enough, (b) a plain statement that APS does not replace planners, (c) "turned part" explained, (d) security criteria that mean something in the US (not GDPR). |
| Fact checker | not satisfied | (a) Nyhuis/Wiendahl English edition marked [unverified]: verifiable. (b) FAQ cost answer contained an unsourced claim that implementation effort often exceeds first-year license cost. (c) "Most vendors in the category on US directories sell exactly that layer" is a generalization without evidence; the directories read actually mix project tools and APS. (d) Kinaxis: confirm the 37% Excel figure is German-only; confirm no US figure exists. |
| Critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms) | mostly satisfied | No em-dash chains, no clichés found. Germanisms: "Mittelstand" correctly replaced, "Feinplanung" kept only as an explained German term. SOC 2 appears without a source. iFAKT section neutral; asks that the vendor-claim status be stated once more at the end of the capability list. |

### Conflicts and decisions

- **SOC 2 without a source (critic, fact checker) vs. US buyer expectations (SEO, reader):** kept as an example of an attestation buyers ask for, not as a factual claim about any vendor; documented in the editorial notes (item 14).
- **Cost FAQ (SEO wants an answer; fact checker rejects unsourced numbers):** the FAQ stays, gives no figures, explains pricing models qualitatively and points to TCO; the unsourced clause was deleted.
- **ISA-95 wording (SME, fact checker):** rewritten to the verified scope instead of buying the full standard text for this version; VDI 5600 keeps the explicit task list, labeled as a German guideline.
- **USD in the EOQ example (critic asked whether this breaks the "keep EUR" rule):** the figures are constructed examples, not sourced EUR amounts, so they were localized to USD with identical values and labeled as illustrative in the text and editorial notes.

### Changes after Round 1 (old -> new)

- Meta description: "Production scheduling software and APS explained: finite capacity, bottlenecks, drum-buffer-rope, EOQ and safety stock, with worked examples and a checklist." (157) -> "Production scheduling software and APS explained: finite capacity, bottlenecks, drum-buffer-rope, EOQ, safety stock, worked examples and a checklist." (149); schema description updated to match.
- Meta title character count: "(51 characters)" -> "(52 characters)".
- Section 6: "ANSI/ISA-95 places ERP at Level 4 … and manufacturing operations management, including detailed scheduling, dispatching and execution, at Level 3 [31]." -> "… manufacturing operations management at Level 3; the activity models in Part 3 cover the work schedule (called the 'detailed production schedule' in the 2005 edition) and its execution [31]." FAQ "APS vs MES" adjusted the same way ("both detailed scheduling and execution" -> "both the work schedule and its execution").
- Section 5.1: "Most vendors in the 'production scheduling software' category on US directories sell exactly that layer …" -> "Many products listed under 'production scheduling software' in US software directories cover this layer … others in the same lists are project or resource planners (Section 13.1)."
- Section 2.2 table: "APS, MES scheduling module, control room" -> "APS, MES scheduling module, scheduling board".
- Section 9.3: "A turned part" -> "A turned (lathe) part".
- Source [8]: "(an English edition exists as 'Fundamentals of Production Logistics', Springer 2009 [unverified …])" -> full verified reference (Springer 2009, published October 2008, ISBN 978-3-540-34210-6, DOI 10.1007/978-3-540-34211-3); editorial note 11 updated.
- FAQ "How much does production scheduling software cost?": "… which often exceed the license cost in the first year [unverified: no independent cost study found]." -> "… and ask every vendor to quote against the same scope."; editorial note 12 updated.
- Already in the draft and confirmed by the reviewers rather than changed: Little's Law terminology note (Section 4.1), FAQ entries "What is production scheduling software?", "Is Excel enough?", "Does APS replace production planners?", "What are the types of production scheduling?", security row in Section 13.2 with NIST CSF 2.0 [35] and CMMC [36] instead of GDPR, Kinaxis 37% figure labeled as German subsample with the global 83% from the US release [32], vendor-claim sentence at the end of the iFAKT capability list.

### Round 2

| Role | Verdict |
|---|---|
| Subject-matter expert | satisfied: theory (Little, operating curves, Kingman/VUT, TOC/DBR, NP-hardness) unchanged from the reviewed German text; ISA-95 now stated only as far as verified; US terms (MPC, CPIM, dispatching, scheduling board, cycle time vs. takt) used correctly |
| SEO specialist (US) | satisfied: title 52 and description 149 characters, main keyword in title, description, H1, short answer, Section 13 heading and first FAQ; 20 FAQs mapped to collected PAA questions; competitive analysis documents a gap (no theory, no rollout guidance) the listicles cannot fill; hreflang pair and cannibalization note for the "Beyond MRP" post in place |
| Reader (US plant manager) | satisfied: quick wins, Excel threshold, security criteria and "planners stay" answer are what he would forward to his scheduler |
| Fact checker | satisfied: all six new US/English sources opened and verified on November 20, 2026; all worked examples recalculated (MRP overload 262 h vs. 240 h = 109%; SPT 7.75 h, EDD 1 h, FIFO 8 h total tardiness; EOQ 949 units, total cost $7,589, at half setup cost 671 units and approx. $5,367; SS 115/148/209/361 units; OTIF 85.4%; takt 2.0 min, balance efficiency 80%; VUT 4/5.7/9/19 h; 15! = 1,307,674,368,000); remaining [unverified] items (Andler bibliography, DBR starting buffer, roadmap durations) carried over from the German version and listed in the editorial notes |
| Critic | satisfied: plain tone, no AI clichés, no em-dashes (en-dashes only inside original source titles and page ranges), iFAKT section labeled and neutral, disclosure exactly "Note: The author works at iFAKT GmbH." in Section 18 and the author box, only the Stuttgart headquarters named, no sponsorship label |

### Final verdict

All five roles are satisfied after Round 2. Word count H1 through Conclusion: **14,187 words** (`wc -w`; table cell separators count as tokens in `wc -w`, so prose plus table text is slightly lower), about 2.5 times the longest English competitor (projectmanager.com, approx. 5,500 words). Before publication, the editor should resolve editorial notes 1, 2, 3 and 13 and align the labeling of the m365.fm iFAKT entity page.
