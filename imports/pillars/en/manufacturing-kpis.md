# SEO metadata

| Field | Value |
|---|---|
| Meta title | Manufacturing KPIs: Formulas, Examples & Power BI Guide (55 characters) |
| Meta description | Manufacturing KPIs with formulas and worked examples: takt time, cycle time, lead time, OEE, scrap, FPY, OTIF, MTBF, TRIR and a Power BI dashboard. (147 characters) |
| Slug | `/en/learn/manufacturing-kpis/` (full URL: https://www.m365.fm/en/learn/manufacturing-kpis/) |
| Main keyword | manufacturing KPIs |
| Secondary keywords | manufacturing metrics, production KPIs, manufacturing KPI formulas, KPI for production, manufacturing KPI examples, key performance indicators in manufacturing, how to calculate takt time, takt time vs cycle time, cycle time vs lead time, manufacturing lead time, flow factor, changeover time, SMED, micro-stops, how to calculate OEE, overall equipment effectiveness, TEEP, six big losses, world-class OEE, scrap rate formula, first pass yield, rolled throughput yield, rework rate, PPM, OTIF, on-time delivery, schedule adherence, WIP, days of supply, Little's Law, capacity utilization, labor productivity, MTBF, MTTR, energy per unit, TRIR, DART rate, LTIFR, cost per unit, ISO 22400, ISA-95, SQCDP, leading and lagging indicators, Power BI OEE dashboard, DAX OEE |
| Search intent | Mainly informational with a strong how-to share (definition, formula, worked calculation). Secondary intent commercial investigation (MES, dashboards, software). US "People also ask" themes: which KPIs matter most, what a good OEE is, how to calculate takt time and OEE, takt vs. cycle time, what OTIF means, how to calculate TRIR |
| Target word count | at least 7,000 words (longest English competitor read: NetSuite, approx. 6,500 to 7,000 words). Actual article H1 to end of Conclusion: **12,326 words** (`wc -w`, November 20, 2026; incl. tables and DAX code) |
| Language version | `en-US`. hreflang pair: `en-US` https://www.m365.fm/en/learn/manufacturing-kpis/ <-> `de-DE` https://www.m365.fm/learn/produktionskennzahlen/ (x-default: editor's choice) |

# Competitive analysis (google.com SERP, November 2026)

Basis: own searches on November 20, 2026 for "manufacturing KPIs", "production KPIs list with formulas", "manufacturing metrics formulas examples OEE takt time cycle time" and a "People also ask" style query. The search tool returns US-weighted results; the order below is approximated from how often a domain recurred across queries. Word counts exclude navigation, footer and CTA boxes and are estimates from the fetch on November 20, 2026.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| netsuite.com/portal/resource/articles/erp/manufacturing-kpis-metrics.shtml | 6,500–7,000 | 78 KPIs, nearly all with a formula, KPI vs. metric distinction, OSHA 200,000-hour note, short FAQ | only two worked examples; several formula errors (missing parentheses, takt text says demand ÷ time, "machine downtime rate" computes uptime); many duplicates (FPY/FTY/RFT, OOE/TEEP = OEE formula) |
| insightsoftware.com/blog/30-manufacturing-kpis-and-metric-examples | 4,000–4,500 | 41 KPIs, lean section, FAQ, links to LEI lexicon | no standards; 11 KPIs without formula; invalid demand-forecast and cash-to-cash formulas; safety rate counts near misses |
| dataparc.com/blog/manufacturing-kpi-examples-10-formulas-for-measuring-success | 4,500–5,000 | 10 KPIs with sub-metrics, data types, 7-question FAQ | two conflicting availability formulas, incident rate without 200,000 base, no benchmarks, many typos |
| machinemetrics.com/blog/manufacturing-kpis | 3,500–4,000 | 53 KPIs with formulas, OSHA reference for incident rate | dated 2020; cycle time formula inverted (parts ÷ time); availability defined two ways; no worked examples, no FAQ |
| tulip.co/blog/manufacturing/how-to-calculate-34-manufacturing-kpis | 2,800–3,200 | 39 unique KPIs, reference table, selection framework | duplicate item; MTTF described as for repairable systems (wrong); on-time delivery ratio inverted in body text; one worked example |
| cascade.app/blog/manufacturing-kpis | approx. 3,000 | 33 KPIs with example targets | no formulas at all; OEE listed twice with 100 % and 85 % targets |
| scw.ai/blog/manufacturing-kpis | approx. 2,700 | 65 KPIs in 8 categories incl. safety and environment | formulas mostly as images or gated; no worked examples; "world-class OEE 80" without source |
| upkeep.com/learning/what-are-the-best-metrics-and-kpis-for-manufacturing-companies | 2,500–2,800 | maintenance angle, University of Tennessee study via Plant Services | no formulas, no examples, no safety or OTIF |
| safetyculture.com/topics/kpi/manufacturing-kpis (redirects to mitti.com) | approx. 1,500 | 15 KPIs, 13 with formula | OEE, OOE and TEEP all given the same formula; no examples |
| vorne.com/learning-center/kpi.htm | 900–1,000 | KPI selection principles, TPS context | no formulas, three KPIs named |

**How this article beats the competition:** The longest English competitor read runs about 6,500 to 7,000 words. None of the pages above cites ISO 22400-2 or ISA-95 as the definition basis, none works all KPIs through one consistent example where takt, cycle time, OEE, quality, cost and lead time check each other, and several contain verifiable errors (inverted cycle-time formula, OEE/OOE/TEEP with one formula, incident rates without the 200,000-hour base, takt described as a rate). This article delivers one worked example, "Line 3", with identical numbers for every KPI; a cheat-sheet table with formula, unit, direction and level; sourced benchmarks including the critique of the 85 % OEE figure; correct OEE roll-up across lines; OSHA TRIR and DART with the official formula and current BLS data; and a Power BI section with a star schema, tested DAX and licensing notes from Microsoft Learn.

---

# Manufacturing KPIs: The Complete Guide to Production Metrics, Formulas, Worked Examples, and Power BI Dashboards

*Updated November 20, 2026 · Definitions based on ISO 22400-2, ISA-95, the Lean Enterprise Institute, Nakajima's TPM, OSHA/BLS and the German VDMA 66412-1 and REFA conventions; every worked example recalculated*

> **Short answer:** Manufacturing KPIs are measures that express the speed, quality, delivery, cost and safety of a production operation in numbers. The most important ones are takt time, cycle time, manufacturing lead time, OEE, scrap rate, first pass yield, on-time in-full delivery (OTIF), days of supply, MTBF/MTTR, cost per unit and a safety rate such as TRIR. They only work when each KPI has one agreed definition, reliable data, and a fixed meeting routine in which deviations turn into actions.

> **Key takeaways**
> - **Define before you build a dashboard:** ISO 22400-2:2014 describes 34 KPIs for manufacturing operations management, each with formula, unit and timing [1][38]. ISA-95 places these KPIs at Level 3, between the control layer and ERP [40]. In Germany, the VDMA 66412-1 guideline adds MES KPI definitions [4].
> - **Takt time is not a machine time:** takt is available time divided by customer demand [9]. Cycle time is measured; lead time also includes all queue and wait time [10].
> - **OEE = Availability × Performance × Quality.** The popular 85 % "world-class" target is traced back to Nakajima, but it is not a universal benchmark [6][8].
> - **Little's Law** links inventory, throughput and lead time: if you do not reduce WIP, you will not shorten lead time for long [13].
> - **Safety comes first and has a US standard formula:** OSHA's incidence rate is cases × 200,000 ÷ hours worked [42]. In 2025, US private industry recorded 2.3 total recordable cases per 100 full-time equivalent workers [43].
> - **Less is more (recommendation):** five to eight KPIs per level, sorted by Safety, Quality, Cost, Delivery and People (SQCDP), are enough to run an operation.
> - **KPIs used as targets lose their value** when they are rewarded instead of understood (Goodhart's law) [23][24].
> - **Power BI** works well for KPI dashboards if the data model is a star schema and OEE is calculated from summed times, not from averages of percentages [27].

## Table of contents

1. What are manufacturing KPIs?
2. Manufacturing KPI cheat sheet: every formula at a glance
3. The worked example "Line 3": input data
4. Time metrics: takt time, cycle time, lead time, processing time, flow factor
5. Takt time vs. cycle time vs. lead time
6. Changeover time, SMED and micro-stops
7. OEE: how to calculate overall equipment effectiveness
8. Quality KPIs: scrap rate, first pass yield, rework rate, PPM
9. Delivery and inventory KPIs: OTIF, schedule adherence, WIP, days of supply
10. Capacity and productivity: utilization, utilization efficiency, labor productivity
11. Maintenance KPIs: MTBF, MTTR and inherent availability
12. Energy, safety (TRIR, DART, LTIFR) and cost per unit
13. KPI systems: hierarchy, leading and lagging indicators, SQCDP
14. Data collection and data quality
15. Visualization: shop floor boards and Power BI dashboards
16. How to set KPI targets
17. Common mistakes and how to avoid them
18. Roadmap: roll out manufacturing KPIs in 90 days
19. KPIs from value stream modeling: iFAKT Polaris
20. Glossary
21. FAQ: manufacturing KPIs
22. Conclusion

## 1. What are manufacturing KPIs?

Manufacturing KPIs (also called manufacturing metrics, production KPIs or key performance indicators in manufacturing) are condensed numbers that make one aspect of production measurable. How fast does an order flow through the plant? How much of the planned time does a machine actually spend making good parts? How many shipments reach the customer on time and complete? Every KPI consists of four elements: a **definition** (what exactly is counted), a **formula**, a **unit** and a **time period**. If one of them is missing, you get the familiar meeting where two departments use the same name for two different numbers.

Not every metric is a [key performance indicator (KPI)](https://www.m365.fm/entity/key-performance-indicator/). A KPI is a metric that is tied directly to a goal and regularly drives decisions. The number of parts produced is a metric. On-time delivery to the customer is a KPI for most plants, because revenue and customer retention depend on it.

### The standards behind the formulas: ISO 22400, ISA-95, SEMI and VDMA 66412

You do not have to invent your KPI definitions. The international standard **ISO 22400-2:2014** "Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions" defines a selection of common KPIs with formula, timing, unit, user group and the production methodology they apply to [1]. Secondary sources count 34 KPIs [38][3]. ISO lists the standard as "to be revised"; Amendment 1 added a set of energy KPIs in 2017 [1].

The standard works with a precise time model. Kang et al., in a paper published through the US National Institute of Standards and Technology (NIST), give the core formulas as: availability = actual production time (APT) ÷ planned busy time (PBT), and effectiveness = planned runtime per item (PRI) × produced quantity (PQ) ÷ APT [3]. So the standard says "effectiveness" where the TPM literature says "performance".

For US readers, **ISA-95** (ANSI/ISA-95, internationally IEC 62264) provides the architecture around these KPIs. Based on the Purdue reference model, it defines five levels from the physical process (Level 0) through sensing, supervisory control and **Level 3, manufacturing operations management (MOM), where MES and SCADA live**, up to business planning and logistics in ERP (Level 4) [40]. ISO 22400 KPIs are, by name, KPIs for manufacturing operations management, so they are calculated at ISA-95 Level 3 and reported upward. In semiconductor fabs, SEMI E10 (equipment reliability, availability, maintainability and utilization) and SEMI E79 (equipment productivity, including OEE) are the industry-specific references [41].

In Germany, a working group of the VDMA (the German mechanical engineering industry association) published guideline **VDMA 66412-1 "Manufacturing Execution Systems (MES) – KPIs"** (edition 2009-10, 36 pages, amended by A1:2010-05) [4]. It defines standard KPIs and how to calculate them from machine states [5]. The message for you as a practitioner is the same in every country: adopt the standard terms wherever possible and document every deviation. That makes plant-to-plant comparisons and MES integration much easier.

### What manufacturing KPIs are for

KPIs do three jobs. They **make visible** what gets lost in daily business, for example that a machine runs all the time but delivers only two thirds of its possible output. They **focus attention** on the biggest lever, because they break losses down into categories. And they **test countermeasures**: did the new changeover method really cut changeover time, or did the loss simply move into the ramp-up phase? Without a number, that question stays a matter of opinion.

A fourth purpose is often forgotten: KPIs are a **communication tool**. In [shop floor management](https://www.m365.fm/entity/shop-floor-management/) they are the common language between operators, shift supervisors and plant leadership. They only serve that purpose if everyone knows the definition and sees the same number.

## 2. Manufacturing KPI cheat sheet: every formula at a glance

The table summarizes all KPIs covered in this guide. "Level" shows the typical management level (M = machine/workstation, L = line/area, P = plant). The formulas follow the sources named in each section.

| KPI | Formula (short form) | Unit | Direction | Level |
|---|---|---|---|---|
| Takt time | available production time ÷ customer demand | s/unit | a given, not something to optimize | L |
| Cycle time | measured time between two finished units | s/unit | ≤ takt | M, L |
| Manufacturing lead time | end − start (order or part); on average WIP ÷ throughput | h, days | ↓ | L, P |
| Processing time | sum of the times the part is actually worked on | s, min | ↓ (without quality loss) | M, L |
| Flow factor (Wiendahl) | lead time ÷ operation time | ratio (≥ 1) | ↓ | L |
| Value-added ratio (VSM) | processing time ÷ lead time × 100 | % | ↑ | L, P |
| Changeover time | last good part of old run to first good part of new run | min | ↓ | M |
| Changeover share | changeover time ÷ planned production time × 100 | % | ↓ | M, L |
| Micro-stops | number or duration of short stops below a set threshold | count, min | ↓ | M |
| Availability (OEE) | run time ÷ planned production time | % | ↑ | M |
| Performance (OEE) | ideal cycle time × total count ÷ run time | % | ↑ | M |
| Quality rate (OEE) | good count ÷ total count | % | ↑ | M |
| OEE | availability × performance × quality | % | ↑ | M, L |
| TEEP | OEE × loading (planned time ÷ calendar time) | % | ↑ | M, P |
| Scrap rate | scrap count ÷ total count × 100 | % | ↓ | M, L, P |
| First pass yield (FPY) | units good on first pass ÷ total count × 100 | % | ↑ | M, L |
| Rework rate | reworked count ÷ total count × 100 | % | ↓ | M, L |
| PPM | defective parts ÷ parts inspected or shipped × 1,000,000 | ppm | ↓ | P |
| OTIF | lines delivered on time and in full ÷ all lines due × 100 | % | ↑ | P |
| Schedule adherence (production) | orders completed on schedule ÷ all orders due × 100 | % | ↑ | L, P |
| WIP | quantity or value of work in process | units, $ | ↓ (down to the minimum needed) | L |
| Days of supply | inventory ÷ average daily usage | days | ↓ (down to the safety level) | L, P |
| Capacity utilization | load ÷ available capacity × 100 | % | target band, not maximum | L, P |
| Utilization efficiency (ISO) | actual production time ÷ actual unit busy time | % | ↑ | M |
| Labor productivity | good count ÷ labor hours | units/h | ↑ | L, P |
| MTBF | run time ÷ number of failures | h, min | ↑ | M |
| MTTR | total repair time ÷ number of failures | min | ↓ | M |
| Energy per unit | energy consumed ÷ good count | kWh/unit | ↓ | M, P |
| TRIR (OSHA) | recordable cases × 200,000 ÷ hours worked | per 100 FTE | ↓ | P |
| DART rate (OSHA) | DART cases × 200,000 ÷ hours worked | per 100 FTE | ↓ | P |
| LTIFR | lost-time injuries ÷ hours worked × 1,000,000 | per 1 million h | ↓ | P |
| Cost per unit | period cost ÷ good count | $/unit | ↓ | L, P |

## 3. The worked example "Line 3": input data

To keep the formulas concrete, this guide calculates every KPI on one fictional assembly line. The numbers are chosen so they check each other: if the OEE is right, it has to match the good count, and if the lead time is right, it has to match WIP and throughput.

| Input | Value |
|---|---|
| Shift pattern | 2 shifts of 8 h (480 min), 5 days per week |
| Breaks per shift | 30 min (not planned production time) |
| Planned production time per shift | 450 min |
| Customer demand | 900 units per day, i.e., 450 units per shift |
| Ideal cycle time (bottleneck station) | 50 s/unit |
| Breakdowns per shift | 25 min |
| Changeovers per shift | 2 changeovers of 10 min = 20 min |
| Total count per shift | 432 units |
| of which good on first pass | 410 units |
| of which reworked and then good | 12 units |
| of which scrap | 10 units |
| Staffing | 6 operators per shift |

These inputs come back in every section. Every calculation has been rechecked; rounding happens only in the result. Costs in Section 12 are shown in US dollars; the figures are illustrative, like the line itself.

## 4. Time metrics: takt time, cycle time, lead time, processing time, flow factor

Time metrics are the most frequently confused manufacturing KPIs. The terms sound alike, and companies use them differently in practice. Write down the definitions for your plant once and link that definition on every board.

### How to calculate takt time

[Takt time](https://www.m365.fm/entity/takt-time/) tells you how often a finished unit has to leave the line to meet customer demand. The Lean Enterprise Institute (LEI) defines it as available production time divided by customer demand [9]. Rother and Shook list "Produce to your takt time" as the first guideline for a lean value stream and describe takt as a stand-in for customer demand [2][12].

> **Takt time = available production time per period ÷ customer demand per period**

The word comes from German ("Takt" means beat or meter). According to LEI, takt was first used as a production management tool in the German aircraft industry in the 1930s [9].

**Line 3 example:** available time per shift 450 min = 27,000 s; demand per shift 450 units.
Takt time = 27,000 s ÷ 450 units = **60 s/unit**.

As a cross-check, LEI's example: 480 minutes per day and demand of 240 units give a takt time of 2 minutes [9].

**Common mistakes:**
- **Not subtracting breaks.** Using 480 instead of 450 minutes gives a takt of 64 s. On paper, the line would then be designed too slow.
- **Subtracting unplanned downtime.** Breakdowns do not belong in the available time for takt. They are a loss the line has to absorb through its capacity reserve. Subtracting them hides the problem inside the takt.
- **Treating takt as something to optimize.** The customer sets the takt, not production. What you optimize is cycle time, so that it reliably meets takt.
- **Confusing takt with a rate.** Takt is time per unit, not units per time. Its inverse (1 unit every 60 s = 60 units per hour) is the required output rate.

### Cycle time

According to LEI, [cycle time](https://www.m365.fm/entity/cycle-time/) is "the time required to produce a part or complete a process, as timed by actual measurement" [10]. In value stream mapping it describes how often a process completes a part. The key word is "measured": cycle time is an actual value. The **ideal cycle time** (also called standard, design or nameplate cycle time) is the best technically possible time and the basis of OEE performance.

> **Average actual cycle time = run time ÷ units produced**

**Line 3 example:** run time 405 min (450 min minus 25 min breakdowns minus 20 min changeovers) = 24,300 s; 432 units produced.
Actual cycle time = 24,300 s ÷ 432 = **56.25 s/unit**.
The ideal cycle time is 50 s. The gap of 6.25 s per unit sits in micro-stops and reduced speed, i.e., in the performance loss (Section 7).

For machines, LEI also defines the **effective machine cycle time**: machine cycle time plus load and unload time plus changeover time divided by the number of pieces made between changeovers [10]. This tells you whether a machine can hold takt at all, given how often it is changed over.

**Common mistake:** equating cycle time with takt time. Both are measured in seconds per unit, but takt is a demand figure and cycle time is a process figure. At least one high-ranking English page gives the cycle time formula upside down (parts ÷ run time); that is a rate, not a cycle time.

### How to calculate manufacturing lead time

[Lead time](https://www.m365.fm/entity/lead-time/) (production lead time, also called throughput time) is "the time required for a product to move all the way through a process or a value stream from start to finish" [10]. Besides processing, it includes all transport, queue and wait times. German production engineering splits it into operation time (setup and processing), transition time (queueing and transport) and inter-operation wait time [15]. Hans-Peter Wiendahl made lead time the central concept of production control with his funnel model [15][14].

There are two ways to determine it:

**1. Directly, per order or part:**

> **Lead time = completion timestamp − start timestamp (or order release)**

Decide whether you count calendar days, working days (shop calendar days) or hours, and where the clock starts (order entry, release, first operation). Different start points are the most common reason why sales and production argue about "the" lead time.

**2. Indirectly, with Little's Law:**

In 1961, John D. C. Little proved that in a stable system the average number of items in the system equals the arrival rate times the average time in the system (L = λW) [13]. Applied to manufacturing:

> **Average lead time = average WIP ÷ average throughput**

**Line 3 example:** on average 2,700 parts sit in the line and its buffers; the line ships an average of 900 parts per working day.
Lead time = 2,700 ÷ 900 = **3 working days**.

Little's Law holds for averages over a long enough period in which WIP neither keeps growing nor keeps shrinking. WIP and throughput must use the same unit (pieces or dollars, not mixed). Its big practical value: it shows that at constant throughput, shorter lead time is only possible with less WIP. Faster machines alone do little as long as parts wait in front of them.

### Processing time and standard time (REFA)

**Processing time** is the time a product is actually being worked on [10]; it is usually a small fraction of lead time. For planning and costing, German plants use the time categories of REFA, the German association for work design and industrial engineering (comparable in role to standard-time conventions in US industrial engineering). REFA splits order time into setup time and run time, each made up of basic, rest and allowance components; the machine-side counterpart is called equipment occupancy time [16][17]:

> **Order time T = setup time t_r + run time t_a**, with **t_a = order quantity m × time per unit t_e**

**Example:** an order of 400 units runs on the bottleneck station: setup 20 min, time per unit 50 s.
T = 20 min + 400 × 50 s ÷ 60 = 20 + 333.3 = **353.3 min** (about 5.9 h).

Nyhuis and Wiendahl derive the **operation time** of a work step from the order time and express it in shop calendar days by relating the order time to the daily capacity of the work system [14]. [unverified: exact formula notation in Nyhuis/Wiendahl, Section 2.1.1, verified only through the table of contents and list of abbreviations] To keep the examples comparable, this guide simplifies and calculates in minutes of operating time; for a single machine, the operation time then equals the order time.

### Flow factor and value-added ratio

Two different KPIs circulate under similar names, and you should not mix them up.

**Flow factor according to Wiendahl (logistics view):** the ratio of lead time to operation time of a work step or order [14][15]. A value of 1 means the order was processed without waiting; a value of 6 means it spent six times as long in the system as setup and processing required.

> **Flow factor = lead time ÷ operation time**

**Example:** the order from the REFA example has an operation time of 353.3 min. It waits two working days before the operation (2 × 900 min = 1,800 min of operating time).
Lead time of the operation = 1,800 + 353.3 = 2,153.3 min. Flow factor = 2,153.3 ÷ 353.3 = **6.09**.

**Value-added ratio (value stream view):** in [value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) the opposite view is common: the share of processing time in lead time, in percent. (LEI's narrower "value-creating time" counts only the work elements the customer is willing to pay for [10].) The German Wikipedia calls this ratio "Fließgrad", its inverse "Flussgrad", and puts the share of value-adding activity in German industry at 5 to 15 percent [15]. [unverified: primary source for this range not clearly documented in Wikipedia] Some value stream textbooks also call the percentage a flow factor. So always check whether a value above 1 or below 100 % is meant.

> **Value-added ratio = processing time ÷ lead time × 100 %**

**Line 3 example:** the processing times of the four stations add up to 190 s. Lead time is 3 working days of 900 min operating time each = 162,000 s.
Value-added ratio = 190 ÷ 162,000 × 100 % = **0.117 %**.

Values below one percent are normal in operations with buffers and batches. What matters is the trend and the time basis: in calendar time, the value drops further. The method is covered in detail in the guide [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned).

## 5. Takt time vs. cycle time vs. lead time

"What is the difference between takt time and cycle time?" is one of the most common questions around manufacturing KPIs. The table puts the three side by side. LEI summarizes the order like this: "Usually, value-creating time is less than cycle time, which is less than production lead time" [10].

| Attribute | Takt time | Cycle time | Lead time |
|---|---|---|---|
| Question | How often **must** a part be finished? | How often **is** a part finished? | How long **does** a part take through the system? |
| Source | customer demand and working time | measurement at the process | timestamps or Little's Law |
| Formula | available time ÷ demand | run time ÷ units (measured) | end − start, or WIP ÷ throughput |
| Typical unit | s/unit | s/unit | h, days |
| Line 3 | 60 s | 56.25 s (ideal 50 s) | 3 working days |
| Who influences it? | sales, customer, shift pattern | engineering, method, maintenance | scheduling, WIP, batch sizes |
| Sensible direction | none; it is the given | ≤ takt with a reserve | as short as possible |
| Common mistake | breaks not subtracted | ideal instead of actual value used | start point not defined |

**Key insight from the example:** the actual cycle time of 56.25 s is below the takt of 60 s. Yet Line 3 still misses demand, as the next sections show, because cycle time only applies during run time. Breakdowns, changeovers and scrap are missing from that view. For line design, what counts is the **effective cycle time per good part**, i.e., planned production time divided by good count.

## 6. Changeover time, SMED and micro-stops

### Changeover time and changeover share

[Changeover time](https://www.m365.fm/entity/setup-time/) (setup time) is the time needed to switch a machine or line from one product to another. In practice, measuring from the last good part of the old run to the first good part of the new run works best, because it includes adjustment and ramp-up. [unverified: this convention is widespread in practice but not stated verbatim in the sources checked here.] In the REFA system, setup time is part of order time [16].

> **Changeover share = changeover time ÷ planned production time × 100 %**

**Line 3 example:** 20 min changeover ÷ 450 min = **4.44 %**.

### SMED: changeovers in single-digit minutes

[SMED](https://www.m365.fm/entity/smed/) (Single-Minute Exchange of Die) is a method for making changeovers as short as possible; the goal is a changeover time in single-digit minutes, i.e., under ten minutes [11]. Shigeo Shingo developed the core ideas in the 1950s and 1960s: he separated internal setup, which can only be done while the machine is stopped, from external setup, which can be done while it runs, and moved as much as possible to external [11].

**Line 3 example:** if both changeovers drop from 10 to 6 min, the line gains 8 min of run time per shift. At an unchanged performance of 88.9 %, that is 8 × 60 ÷ 50 × 0.889 = **about 8.5 additional parts** per shift. Alternatively, the line can keep the same total changeover time, change over more often and run smaller batches, which lowers WIP and lead time.

**Common mistake:** treating changeover time only as a loss. Shorter changeovers are above all a lever for smaller batches. If you put all the gained time into bigger runs, you give away the logistics benefit.

### Micro-stops

[Micro-stops](https://www.m365.fm/entity/micro-stops/) (minor stops) are short interruptions, such as a jammed part or a tripped sensor, that barely register one at a time. In Nakajima's TPM framework they belong to the six big losses as "idling and minor stoppage losses" and reduce performance, not availability [7]. Each company sets its own threshold between a micro-stop and a breakdown; thresholds of a few minutes are common. [unverified: no standard with a binding threshold found.] Muchiri and Pintelon point out that manual recording often misses small stops [7].

**Line 3 example:** the total performance loss is run time minus the ideal time for the units produced: 405 min − 432 × 50 s ÷ 60 = 405 − 360 = **45 min**. The machine controller counts 120 micro-stops of 15 s each = 30 min. The remaining 15 min are reduced speed. Without automatic data capture, those 30 minutes of micro-stops would probably have been logged in the shift report as "line running".

## 7. OEE: how to calculate overall equipment effectiveness

Overall equipment effectiveness (OEE) is the best-known manufacturing KPI. The term goes back to Seiichi Nakajima and is a core element of [Total Productive Maintenance (TPM)](https://www.m365.fm/entity/total-productive-maintenance/) [8][6]. The ASQ glossary describes OEE as a measure of how well a manufacturing unit performs relative to its designed capacity during the periods it is scheduled to run, combining uptime, speed and the share of good output [36]. OEE answers one question: what share of planned production time was used to make good parts at ideal speed?

### The three factors

> **OEE = Availability × Performance × Quality**

| Factor | Formula | Losses it captures |
|---|---|---|
| Availability | run time ÷ planned production time | breakdowns, setup and adjustment |
| Performance (ISO: effectiveness) | ideal cycle time × total count ÷ run time | micro-stops, reduced speed |
| Quality | good count ÷ total count | scrap, rework, startup losses |

Muchiri and Pintelon define availability as operating time as a percentage of loading time, performance as theoretical cycle time times actual output divided by operating time, and the quality rate as total output minus defects relative to total output [7]. ISO 22400-2 uses the same logic with its own time terms [3].

### The six big losses

Nakajima assigns losses to six categories [7]:

1. **Breakdowns** (breakdown losses) → availability
2. **Setup and adjustment** → availability
3. **Idling and minor stoppages** → performance
4. **Reduced speed** → performance
5. **Quality defects and rework** → quality
6. **Reduced yield during startup** → quality

This mapping is the real value of OEE. The total alone says little; only the breakdown shows whether maintenance, the changeover team or quality has the biggest lever.

### How to calculate OEE: the Line 3 example

**Step 1, availability:** planned production time 450 min; breakdowns 25 min, changeovers 20 min; run time 405 min.
Availability = 405 ÷ 450 = **90.0 %**.

**Step 2, performance:** 432 units × 50 s = 21,600 s of ideal time; run time 405 min = 24,300 s.
Performance = 21,600 ÷ 24,300 = **88.9 %**.

**Step 3, quality:** 410 parts good on first pass out of 432 units.
Quality = 410 ÷ 432 = **94.9 %**.

**Step 4, OEE:** 0.900 × 0.8889 × 0.9491 = **75.9 %**.

**Cross-check via time:** good count times ideal cycle time divided by planned production time = 410 × 50 s ÷ 27,000 s = 20,500 ÷ 27,000 = **75.9 %**. Both ways must give the same result; if they do not, the input data are wrong.

**What OEE means for takt:** the effective cycle time per good part is 50 s ÷ 0.759 = 65.9 s, which is above the takt of 60 s. In 27,000 s, the line makes 410 good parts on first pass, 422 including the 12 reworked parts. Demand of 450 units per shift is missed by 28 units. To cover it with first-pass good parts alone, Line 3 would need an OEE of 450 × 50 ÷ 27,000 = 83.3 %.

### Rework: good or bad?

In TPM logic, rework is a quality loss [7]; that is why the example counts only the 410 parts that were good on first pass. Kang et al. use a quality rate that counts reworked parts as good [3]. With 422 instead of 410 parts, quality would rise to 97.7 % and OEE to 78.1 %. Both variants are defensible, but you have to pick one and must not compare plants that use different definitions.

### TEEP: OEE against calendar time

Total effective equipment performance (TEEP) relates OEE to total calendar time instead of planned time only [8]:

> **TEEP = OEE × loading**, with **loading = planned production time ÷ calendar time**

**Line 3 example:** 10 shifts × 450 min = 4,500 min planned time per week; calendar time 7 × 24 × 60 = 10,080 min.
Loading = 4,500 ÷ 10,080 = 44.6 %. TEEP = 75.9 % × 44.6 % = **33.9 %**.

TEEP is the right KPI for investment decisions: before you buy a second machine, it shows how much unused calendar time the existing one still has. Note that some English pages give OEE, OOE and TEEP the same formula; that is wrong, because the three differ in the time base.

### What is a good OEE? Where the 85 % benchmark comes from and why it is disputed

The figure of 85 % as "world-class OEE" is regularly attributed to Nakajima in trade articles, often built from 90 % availability, 95 % performance and 99.9 % quality (0.90 × 0.95 × 0.999 = 85.4 %) [37]. In the primary and review sources checked for this article, the component split could not be found verbatim. [unverified: original passage in Nakajima 1988] The English Wikipedia explicitly states that 85 % is not the right target in many cases, for example when not all losses are captured or when the industry's quality requirements are higher [8].

Further points of criticism [8]:

- OEE behaves like a geometric mean and penalizes unequal factors: 20 % × 80 % = 16 %, 50 % × 50 % = 25 %.
- Definitions differ between companies, so OEE is poorly suited to comparisons between plants or machine types.
- OEE is not a measure of individual employee performance.

Use OEE as an improvement KPI for the same asset over time, not as a league table. A continuous-process plant running 24/7 and a job shop with many changeovers have structurally different values.

### Rolling up OEE across machines correctly

A common reporting mistake is averaging OEE percentages. Example: machine A has 80 % OEE with 450 min planned time, machine B 50 % with 150 min.

- Wrong (unweighted average): (80 % + 50 %) ÷ 2 = 65.0 %
- Right (time-weighted): (0.80 × 450 + 0.50 × 150) ÷ (450 + 150) = (360 + 75) ÷ 600 = **72.5 %**

The cleanest approach is to recalculate OEE at every level from summed times: sum of value-adding time (good count × ideal cycle time) divided by sum of planned time. Section 15 shows the matching DAX formula.

## 8. Quality KPIs: scrap rate, first pass yield, rework rate, PPM

Quality KPIs answer two different questions: how much material and time is lost inside the plant (internal), and how many defects reach the customer (external)? Each view needs its own KPIs. ISO 22400-2 includes, among others, quality ratio, scrap ratio, rework ratio and a first pass yield [3]; the scrap and rework ratios also appear in Fabrico's list of the 34 ISO KPIs [38].

### Scrap rate formula

The [scrap rate](https://www.m365.fm/entity/scrap-rate/) measures the share of parts that can no longer be used and are scrapped or recycled. In Kang et al.'s presentation, the ISO formula is scrap quantity divided by produced quantity [3].

> **Scrap rate = scrap count ÷ total count × 100 %**

**Line 3 example:** 10 scrapped parts ÷ 432 parts × 100 % = **2.31 %**.

**Common mistakes:**
- **Changing the base.** Sometimes the total count, sometimes the good count is used (10 ÷ 422 = 2.37 %). With low rates the difference is small; with high rates it matters.
- **Missing startup scrap.** Parts discarded while dialing in after a changeover often do not get counted. Yet they show whether changeovers are under control.
- **Pieces only, no value.** A scrapped part at the end of the value stream costs many times a raw part. Add scrap cost to the piece rate.

### First pass yield (FPY)

First pass yield (also first time through or right first time) measures the share of units that pass a process the first time without rework and without scrap. ASQ describes FPY, also called the quality rate, as the percentage of units that complete a process and meet quality guidelines without being scrapped, rerun, retested, returned or diverted to an offline repair area [36]. Kang et al. give the formula as quantity good on first pass divided by produced quantity [3].

> **FPY = units good on first pass ÷ total count × 100 %**

**Line 3 example:** 410 ÷ 432 × 100 % = **94.9 %**.

For several process steps, multiply the FPY values of the individual steps to get the **rolled throughput yield (RTY)**. Three stations with 98 % FPY each give 0.98 × 0.98 × 0.98 = 94.1 %. RTY shows how many parts make it through the whole chain without any correction. [unverified: RTY is widespread in Six Sigma literature but was not checked against a primary source for this article.]

**OEE quality vs. FPY:** if you treat rework as a loss, FPY and the OEE quality rate are identical (both 94.9 % in the example). If you count rework as good, OEE quality equals final yield: (410 + 12) ÷ 432 = 97.7 %.

### Rework rate

> **Rework rate = reworked count ÷ total count × 100 %**

**Line 3 example:** 12 ÷ 432 × 100 % = **2.78 %**.

The check: FPY + rework rate + scrap rate = 94.91 % + 2.78 % + 2.31 % = 100 %. This sum check should run automatically in every dashboard; if it is off, transactions are missing.

Rework is often underestimated because the part ends up good. But it ties up people, creates WIP and extends lead time. Record rework time as well as rework quantity.

### PPM (parts per million)

ASQ defines PPM as a metric reporting the number of defects normalized to a population of one million for ease of comparison [36]. It is mainly used for customer complaints and supplier ratings.

> **PPM = defective parts ÷ parts shipped (or inspected) × 1,000,000**

**Example:** in a quarter, the plant ships 250,000 parts; the customer rejects 18. PPM = 18 ÷ 250,000 × 1,000,000 = **72 ppm**.

Agree with the customer whether rejected parts, rejected shipments or accepted complaints count. Expressing internal scrap in PPM (Line 3: 10 ÷ 432 × 1,000,000 = 23,148 ppm) is possible but not very intuitive; the percentage works better there.

## 9. Delivery and inventory KPIs: OTIF, schedule adherence, WIP, days of supply

### On-time delivery and OTIF

Delivery performance measures how reliably the plant keeps its promises to customers. The most common form is **OTIF** (on time in full): a delivery only counts if it is on time **and** complete.

> **OTIF = order lines delivered on time and in full ÷ all order lines due × 100 %**

There is no binding standard definition. McKinsey noted in 2019 that without a standard definition OTIF is interpreted very differently; in a survey of 24 large North American retailers and consumer goods manufacturers, 79 % favored a single combined OTIF metric over separate measurement, and there was no consensus on the width of the delivery window [18].

**Example:** in one month, 200 order lines are due. 184 were delivered on time, 190 in full, 178 on time and in full.
- On time = 184 ÷ 200 = 92.0 %
- In full = 190 ÷ 200 = 95.0 %
- OTIF = 178 ÷ 200 = **89.0 %**

Note that OTIF is not the product of the two rates (0.92 × 0.95 = 87.4 %); it is counted from the lines that met both conditions at the same time.

**You need to define:** the reference date (requested or confirmed date), the tolerance window (for example ±1 day), the level (order, line, quantity), and whether early deliveries count as on time. Big customers often set the rules for you: Walmart, for example, required suppliers in 2019 to deliver full truckloads within a two-day window 87 % of the time and fined misses at 3 % of the cost of goods sold [47]. Such programs change, so check each customer's current definition before you compare.

### Schedule adherence in production

Schedule adherence (production on-time completion) measures whether production orders finish on their planned date. It is an internal KPI and a leading indicator for customer OTIF.

> **Schedule adherence = production orders completed on schedule ÷ all production orders due × 100 %**

**Example:** 102 of 120 orders due are finished on schedule: **85.0 %**.

Nyhuis and Wiendahl justify their model of logistic operating curves partly with the unsatisfactory achievement of logistics targets in many companies [14]. [unverified: abstract cut off in the retrieved version after this part of the sentence] Add the average schedule deviation in days to the rate; 85 % adherence with one day late is something different from 85 % with two weeks late.

### WIP (work in process)

Work in process covers all unfinished goods between material release and completion. It is reported in pieces (for control) or dollars (for finance). Little's Law links WIP directly to lead time [13]: Line 3 has 2,700 parts of WIP with 900 parts of daily throughput, so 3 days of lead time. If the team cuts WIP to 1,800 parts at the same throughput, lead time drops to 2 days.

### Days of supply (inventory coverage)

> **Days of supply = inventory ÷ average daily usage (or demand)**

**Example:** finished goods inventory 2,250 units, demand 900 units per day. Days of supply = 2,250 ÷ 900 = **2.5 days**.

Mathematically, days of supply is Little's Law applied to one inventory point. Use forward-looking demand when demand fluctuates strongly; otherwise coverage based on history can look deceptively high or low.

## 10. Capacity and productivity: utilization, utilization efficiency, labor productivity

### Capacity utilization

Utilization compares the load (capacity required according to standard times) with available capacity.

> **Capacity utilization = load ÷ available capacity × 100 %**

**Example:** orders with 4,050 min of standard time are scheduled on the bottleneck station for the week; available capacity is 4,500 min. Utilization = 4,050 ÷ 4,500 = **90.0 %**.

**Why 100 % is not a target:** the logistic operating curves of Nyhuis and Wiendahl describe the relationship between WIP, output and lead time of a work system [14]. As utilization approaches the capacity limit, queues and lead times grow disproportionately, because every disruption and every fluctuation can no longer be absorbed. The bottleneck should be highly utilized; non-bottlenecks need reserve. Set a target band rather than a maximum.

### Utilization is not utilization efficiency

The terms are often mixed up. **Capacity utilization** is a planning figure (how much work is loaded on the capacity?). **Utilization efficiency** (ISO 22400) is an execution figure: the ratio of actual production time (APT) to actual unit busy time (AUBT) [3]. A machine can be 95 % loaded and still have poor utilization efficiency if much of the occupied time is lost to breakdowns and waiting. For Line 3, the ratio of run time to occupied time is 405 ÷ 450 = 90 %, which in this simple case equals OEE availability; in plants that record setup and occupancy times separately, the values differ.

### Productivity

Productivity is the ratio of output to input. In manufacturing you usually measure **partial productivities**, because input factors cannot be added up meaningfully.

> **Labor productivity = good count ÷ labor hours worked**

**Line 3 example:** 422 good parts (including reworked) ÷ (6 operators × 8 h) = 422 ÷ 48 = **8.79 units per labor hour**.

**Common mistakes:** confusing productivity with a performance ratio (actual vs. standard output is a performance or efficiency ratio, not productivity), counting total instead of good output, and comparing productivity across products with different work content. For high-mix plants, earned standard hours per attended hour is a better measure.

## 11. Maintenance KPIs: MTBF, MTTR and inherent availability

ISO 22400 includes MTBF and MTTR as maintenance KPIs [38][3]. They break the availability loss from breakdowns into two questions: how often does the machine fail, and how long until it runs again?

> **MTBF (mean time between failures) = run time ÷ number of failures**
> **MTTR (mean time to repair) = total repair time ÷ number of failures**

**Line 3 example, one month:** 40 shifts of 405 min run time each = 16,200 min; 40 failures totaling 1,000 min.
- MTBF = 16,200 ÷ 40 = **405 min** (6.75 h)
- MTTR = 1,000 ÷ 40 = **25 min**

From these you can derive **inherent (technical) availability**, which considers breakdowns only:

> **Inherent availability = MTBF ÷ (MTBF + MTTR)**

405 ÷ (405 + 25) = 405 ÷ 430 = **94.2 %**. OEE availability of 90 % is lower because it also includes changeover time.

**Common mistakes:** MTTR may measure only the repair, not the response time until the technician arrives; decide which time you mean and measure response and repair separately. An average over a few events is also highly random; MTBF only becomes reliable over several months. And do not confuse MTBF with MTTF (mean time to failure), which applies to non-repairable items; some high-ranking English pages blur the two.

## 12. Energy, safety (TRIR, DART, LTIFR) and cost per unit

### Energy per unit

In many plants, energy has become a cost block that deserves its own KPI. ISO 22400-2 was extended with energy KPIs in 2017 [1]; for energy management, ISO 50006:2023 (second edition, replacing the 2014 version) describes how to build energy performance indicators (EnPIs) and energy baselines [22][34].

> **Specific energy consumption = energy consumed in the period ÷ good count**

**Line 3 example:** 1,520 kWh per shift ÷ 422 good parts = **3.60 kWh per unit**.

Watch the base load: a line that keeps compressed air and heating running while stopped looks much worse per unit at low output. A simple regression line with a base-load and a volume-dependent component tells you more than the plain ratio.

### Safety KPIs: OSHA TRIR and DART rate

In an SQCDP KPI system, safety comes first. In the US, the reference is OSHA's recordkeeping rule (29 CFR Part 1904). OSHA calculates incidence rates with one formula [42]:

> **Incidence rate = number of injuries and illnesses × 200,000 ÷ employee hours worked**

The 200,000 is the number of hours 100 employees work at 40 hours per week for 50 weeks a year [42], so the result reads as "cases per 100 full-time equivalent workers". Two variants are standard:

- **TRIR** (total recordable incident rate, also total case incident rate): all recordable cases. Recordable cases are work-related injuries and illnesses that result in death, loss of consciousness, days away, restricted work or job transfer, or medical treatment beyond first aid, among other criteria [46].
- **DART rate:** only cases with days away from work, restricted work activity or job transfer [46].

**Example:** 5 recordable cases, 3 of them DART cases, in a plant with 420,000 hours worked per year.
TRIR = 5 × 200,000 ÷ 420,000 = **2.38**. DART rate = 3 × 200,000 ÷ 420,000 = **1.43**.

For context: according to the Bureau of Labor Statistics, US private industry recorded a total recordable case rate of 2.3 cases per 100 full-time equivalent workers in 2025 (released November 18, 2026) [43]. The BLS chart for 2025 shows 2.5 cases per 100 full-time workers for manufacturing, with 304,200 cases [44][43]. These are national averages, not benchmarks for your plant; compare against your own NAICS industry instead.

Separately from the rates, OSHA requires employers to report a work-related fatality within 8 hours and an in-patient hospitalization, amputation or loss of an eye within 24 hours (29 CFR 1904.39) [45].

### LTIFR and the German 1,000-worker rate

Multinational groups often also use the **LTIFR** (lost time injury frequency rate), which uses a base of one million hours instead of 200,000:

> **LTIFR = number of lost-time injuries ÷ hours worked × 1,000,000**

Safe Work Australia defines LTIFR as the number of lost-time injuries per million hours worked; a lost-time injury is one that results in at least one full day or shift off work [21].

**Example:** 3 lost-time injuries with 420,000 hours worked per year: 3 ÷ 420,000 × 1,000,000 = **7.14**. Note that this is the same plant as above: a DART rate of 1.43 and an LTIFR of 7.14 describe the same three cases (1.43 × 5 = 7.14) if all three DART cases involved days away from work. DART also counts restricted-work and job-transfer cases, which most LTI definitions exclude. Always state the base when you compare sites.

German plants report a "1,000-worker rate": reportable accidents per 1,000 full-time equivalents. An accident is reportable in Germany if the insured person dies or is unable to work for more than three days (Section 193 (1) of the German Social Code, Book VII) [20]. The German statutory accident insurance association DGUV reported 19.9 reportable workplace accidents per 1,000 full-time equivalents for 2025, 3.2 % lower than the previous year [19]. **Example:** 4 reportable accidents with 250 full-time equivalents give 4 ÷ 250 × 1,000 = **16.0**. Because the reporting thresholds differ, this rate cannot be compared directly with an OSHA rate.

Complement these lagging indicators with leading indicators such as reported near misses and completed safety actions. A falling number of reported near misses can be a warning sign if it reflects a weaker reporting culture.

### Cost per unit

> **Cost per unit = period cost ÷ good count**

**Line 3 example, one shift (illustrative US dollar figures):**
- Labor: 6 × 8 h × $45/h = $2,160
- Machine (depreciation, maintenance, floor space): 8 h × $60/h = $480
- Material: 432 parts × $4.00 = $1,728 (scrap consumes material, too)
- Total: $4,368

Cost per unit = $4,368 ÷ 422 good parts = **$10.35 per unit**.

The calculation shows the link to OEE: if all 432 parts were good on first pass, cost per unit would fall to $4,368 ÷ 432 = $10.11 without any rate changing. With fixed costs, output volume plays the main role, which is why cost per unit is hard to interpret without volume. For make-or-buy or pricing decisions, you also need fixed and variable costs separately. How to turn improvements into a solid business case is covered in the post [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

## 13. KPI systems: hierarchy, leading and lagging indicators, SQCDP

Individual KPIs are measurements. A **KPI system** arranges them so that each level sees the numbers it can influence, and the numbers of lower levels roll up logically into those of higher levels.

### Hierarchy: plant, area, line, workstation

| Level | Typical KPIs | Cadence | Forum |
|---|---|---|---|
| Plant | OTIF, cost per unit, customer PPM, TRIR, days of supply | weekly, monthly | plant leadership meeting |
| Area | schedule adherence, lead time, bottleneck OEE, scrap cost, productivity | daily, weekly | area meeting (Tier 3) |
| Line | plan vs. actual units per hour, OEE, FPY, top downtime reasons, open actions | per shift | line meeting (Tier 2) |
| Workstation/machine | units per hour vs. takt, breakdowns, micro-stops, quality deviations | hourly, per shift | team huddle (Tier 1) |

The levels are linked by cause-and-effect chains: falling OTIF at plant level can be traced through schedule adherence in the area down to the OEE and downtime reasons of one machine. That is exactly the chain a [tier meeting](https://www.m365.fm/entity/tier-meeting/) uses: each level reviews its numbers, escalates what it cannot solve itself and gets feedback from above. The guide [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned) describes these routines in detail.

### Leading and lagging indicators

**Lagging indicators** measure results that have already happened: OTIF, cost per unit, the month's scrap rate, TRIR. They matter for goal achievement but come too late for countermeasures.

**Leading indicators** measure drivers that predict the result: schedule adherence of the upstream process, WIP in front of the bottleneck, changeover time, preventive maintenance compliance, near misses, units per hour against takt. Fabrico rightly stresses that a KPI has to trigger an action [35]; leading indicators do that while there is still time to act.

A good rule of thumb: leading indicators dominate at the lower levels, lagging indicators at plant level. Every lagging KPI at plant level should have at least one assigned leading indicator at line level.

### SQCDP: a structure for boards and meetings

Many plants sort their KPIs by **SQCDP**: Safety, Quality, Cost, Delivery and People. The order is deliberate: safety before quality before cost. [unverified: SQCDP is a practice convention, not a standard; its origin cannot be clearly documented.] Plants also use variants with a different order or without People (for example SQDC).

| Category | Line 3, example KPIs |
|---|---|
| S | injuries and near misses of the shift, open safety actions |
| Q | FPY 94.9 %, scrap rate 2.31 %, customer complaints |
| C | cost per unit $10.35, energy 3.60 kWh/unit |
| D | plan 450 / actual 422 good parts, OEE 75.9 %, schedule adherence |
| P | attendance, skills matrix, implemented improvement ideas |

The categories guard against a one-sided fixation on output. If you only measure output, you get output at the expense of quality and safety.

## 14. Data collection and data quality

The best formula is useless if the input data are wrong. In practice, KPI projects fail more often because of the data than because of the method.

### Data collection methods compared

| Method | Description | Strengths | Weaknesses |
|---|---|---|---|
| Manual (tally sheet, shift log, Excel) | operators write down counts and stops | quick to start, builds awareness, no IT needed | micro-stops missing, rounding, after-the-fact entries, high effort |
| Production data terminals | terminals for order start/stop, quantities, downtime reasons | structured reasons, order context | depends on booking discipline |
| Machine data collection | signals from the controller (run, stop, counter) | complete times, short stops included | reasons missing without operator input |
| MES | integrates production and machine data, quality and order control; KPIs per ISO 22400, ISA-95 Level 3 (VDMA 66412-1 in Germany) | consistent definitions, real time | implementation effort, master data maintenance |
| IoT retrofit | sensors and gateways on existing machines, data in a cloud platform | works for old machines, scalable | context (order, product) has to be added |

The pragmatic route is a combination: machine signals supply times and counts, operators add the reason for a stop and quality decisions at a terminal. Muchiri and Pintelon name the accuracy of data collection as one of the biggest challenges of OEE measurement [7]. How to connect machines, MES and the cloud technically is covered in the guide [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned).

### Five rules for reliable KPIs

1. **One time model for everyone.** Decide which times belong to planned production time (breaks? maintenance? trial runs? no orders?). ISO 22400-2 and VDMA 66412-1 offer a template [1][4].
2. **One downtime reason catalog with at most two levels.** Too many reasons lead to "other", too few to meaningless Paretos. Map each reason clearly to one OEE loss category.
3. **Maintain ideal cycle times.** OEE performance depends entirely on this master data. A too-generous standard leads to over 100 % performance or hides losses.
4. **Automate plausibility checks.** FPY + rework + scrap = 100 %; run time ≤ planned time; performance ≤ 100 %; sum of stops ≤ shift length.
5. **Make the definition visible.** Every KPI has a KPI definition sheet with purpose, formula, data source, owner, cadence and target.

### The KPI definition sheet

| Field | Example: OEE Line 3 |
|---|---|
| Purpose | make losses of the bottleneck machine visible and prioritize them |
| Formula | availability × performance × quality; cross-check good count × ideal cycle time ÷ planned time |
| Data source | machine data (run/stop, counter), terminal (downtime reason, scrap, rework) |
| Definitions | planned time = shift minus breaks; changeovers count as availability loss; rework counts as quality loss |
| Owner | shift supervisor Line 3 |
| Cadence | per shift, weekly trend |
| Target | 80 % by end of Q2 (baseline 75.9 %, see Section 16) |
| Escalation | two consecutive shifts below 70 % → Tier 2 meeting |

## 15. Visualization: shop floor boards and Power BI dashboards

### The shop floor board

At the workstation, readability in a few seconds matters more than completeness. [Visual management](https://www.m365.fm/entity/visual-management/) here means: plan and actual per hour, a clear red/green against the target, the top three downtime reasons and an action list with owners and due dates. Hour-by-hour boards work well: the team enters the planned and actual count for each hour (Line 3: 60 parts in every full production hour at a 60 s takt, correspondingly fewer in hours with a break) and gives a short reason for each deviation right away. How to bring flow and the board together is described in the post [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

Digital boards do not automatically replace the whiteboard. They pay off when data are already captured automatically, when several shifts or sites need the same view, and when actions have to be tracked. The team discussion stays the same.

### Power BI dashboard: structure

For area and plant level, Power BI is an obvious tool if the company already uses Microsoft 365. A proven three-page structure:

1. **Overview (plant):** SQCDP tiles with actual, target and trend; traffic lights only where a target is defined.
2. **Line:** OEE as a waterfall from planned time through the six loss categories to value-adding time; Pareto of downtime reasons; FPY and scrap over time.
3. **Detail and actions:** shift and order tables with drill-through, linked to the action list.

For goals, check-ins and owners, Power BI also offers scorecards with goals. According to Microsoft, creating and sharing scorecards is a Pro feature; viewing is possible with a Pro license or as a free user in a workspace on Premium or Fabric F64 capacity or larger [29].

### Data model: star schema

Microsoft recommends a star schema for Power BI: dimension tables describe business entities and are used for filtering and grouping, fact tables store events and are used for aggregation [27]. For manufacturing KPIs, that means:

| Table | Type | Content (example columns) |
|---|---|---|
| FactProduction | fact | Date, ShiftID, LineID, ProductID, PlannedMin, BreakdownMin, ChangeoverMin, TotalQty, GoodFirstPass, Rework, Scrap, IdealCycleSec |
| FactDowntime | fact | Start, End, DurationMin, LineID, ReasonID |
| DimDate | dimension | Date, Week, Month, WorkingDay yes/no |
| DimShift | dimension | ShiftID, Name, Start, End |
| DimLine | dimension | LineID, Line, Area, Plant |
| DimProduct | dimension | ProductID, Product, ProductFamily |
| DimDowntimeReason | dimension | ReasonID, Reason, LossCategory (breakdown, changeover, micro-stop …) |

The LossCategory column in the reason dimension is the key to the loss cascade: it maps every downtime reason to one of the six big losses.

### DAX example: aggregating OEE correctly

The following measures calculate OEE so that it rolls up correctly at every level (shift, line, week, plant), because it is built from summed times instead of averages. `DIVIDE` returns BLANK instead of an error when the denominator is zero [25]; Microsoft recommends the function when the denominator can be zero or blank, and the `/` operator when the denominator is a constant [26].

```dax
Planned Min =
SUM ( FactProduction[PlannedMin] )

Run Min =
[Planned Min]
    - SUM ( FactProduction[BreakdownMin] )
    - SUM ( FactProduction[ChangeoverMin] )

Ideal Min =
SUMX (
    FactProduction,
    FactProduction[TotalQty] * FactProduction[IdealCycleSec] / 60
)

Value Adding Min =
SUMX (
    FactProduction,
    FactProduction[GoodFirstPass] * FactProduction[IdealCycleSec] / 60
)

Availability =
DIVIDE ( [Run Min], [Planned Min] )

Performance =
DIVIDE ( [Ideal Min], [Run Min] )

Quality (time-weighted) =
DIVIDE ( [Value Adding Min], [Ideal Min] )

OEE =
DIVIDE ( [Value Adding Min], [Planned Min] )
```

**Why quality is time-weighted here:** for a single product, `Value Adding Min ÷ Ideal Min` is identical to good count ÷ total count. With several products that have different ideal times, this form weights each part by its ideal time. Only then does availability × performance × quality = OEE hold exactly at every aggregation level, because run time and ideal time cancel out. A piece-based quality rate is useful as an additional measure but should not feed into the OEE multiplication.

**Check with Line 3:** planned time 450, run time 405, ideal time 432 × 50 ÷ 60 = 360, value-adding time 410 × 50 ÷ 60 = 341.67 min. Availability 90.0 %, performance 88.9 %, quality 94.9 %, OEE 341.67 ÷ 450 = 75.9 %. The measures reproduce the hand calculation from Section 7.

One more measure for the takt check:

```dax
Effective Cycle Time per Good Part Sec =
DIVIDE (
    [Planned Min] * 60,
    SUM ( FactProduction[GoodFirstPass] )
)
```

For Line 3, that gives 27,000 ÷ 410 = 65.9 s, above the takt of 60 s.

The quality KPIs from Section 8 follow the same pattern:

```dax
FPY =
DIVIDE (
    SUM ( FactProduction[GoodFirstPass] ),
    SUM ( FactProduction[TotalQty] )
)

Scrap Rate =
DIVIDE (
    SUM ( FactProduction[Scrap] ),
    SUM ( FactProduction[TotalQty] )
)

Rework Rate =
DIVIDE (
    SUM ( FactProduction[Rework] ),
    SUM ( FactProduction[TotalQty] )
)

Quality Sum Check =
[FPY] + [Scrap Rate] + [Rework Rate]
```

`Quality Sum Check` must equal 100 %; conditional formatting that flags deviations in red makes missing transactions visible immediately.

**Two pitfalls for Power BI developers:**
- **Double-counting downtime.** If breakdown and changeover minutes are stored in both `FactProduction` and `FactDowntime`, calculate run time from only one of the two tables. The most robust approach is to keep `FactProduction` at shift, line and product grain and aggregate the downtime minutes there from `FactDowntime` in Power Query.
- **Grain of planned time.** If more than one product runs in a shift, planned time has to be split across the products (for example by order start and end). If the full shift time sits in every product row, it is counted several times when summed.

### Licensing notes

According to Microsoft Learn (page updated August 24, 2026): users with a free license can create reports for their own use but cannot share them. Publishing and sharing require Power BI Pro. Free users can only view shared content if it sits in a workspace on Power BI Premium capacity or Fabric capacity F64 or larger. With Premium Per User (PPU), content can only be shared with other PPU users unless it sits in a Premium capacity [28]. For a shop floor dashboard that many supervisors only read, licensing is therefore an architecture decision. Check current prices and terms with Microsoft; they are deliberately not quoted here.

## 16. How to set KPI targets

Targets are where KPIs most often do damage. Three principles help.

**1. Start from your own baseline, not from a benchmark.** Measure cleanly for at least four to eight weeks before you set a target. Line 3 at 75.9 % OEE gains little from a world-class target of 85 % as long as nobody knows which loss to tackle first.

**2. Derive targets from demand.** In the example, the target follows directly from the customer: for 450 good parts per shift, Line 3 needs an OEE of 83.3 % if only first-pass good parts count (Section 7). A sensible interim target is 80 %; that is 4.1 percentage points away. Mathematically, it equals (0.800 − 0.759) × 450 min = about 18.3 min of value-adding time per shift, for example through fewer micro-stops (30 min potential) or shorter changeovers (8 min potential through SMED).

**3. Use target bands instead of point values for KPIs with trade-offs.** Utilization, WIP and days of supply do not follow "the higher, the better". A band (for example days of supply 2 to 3 days) stops a team from cutting inventory so far that delivery suffers. Drees and Sack describe exactly this tension between inventory reduction, resource output, delivery capability and lead-time reduction for value stream KPIs [32].

**On external benchmarks:** industry values for OEE, scrap or MTTR quoted on many vendor pages usually come from their own customer data without a disclosed method [37]. Use them as rough orientation at most, never as a target. The exception are official statistics with a published method, such as the BLS injury rates by NAICS industry [43].

## 17. Common mistakes and how to avoid them

| Mistake | Consequence | Countermeasure |
|---|---|---|
| KPI overload: 30 KPIs on the board | nobody knows what matters; meetings turn into lectures | 5 to 8 KPIs per level, sorted by SQCDP |
| KPI without a definition | every department calculates differently; comparisons are worthless | definition sheet, terms per ISO 22400 (VDMA 66412-1 in Germany) |
| Averaging percentages | distorted plant OEE | recalculate KPIs at every level from sums |
| KPI as an individual performance rating | data manipulation, hidden breakdowns | KPIs for processes, not for people |
| Target without a path | frustration, window dressing of the numbers | every target backed by loss analysis and an action plan |
| Lagging indicators only | countermeasures come too late | assign a leading indicator to every lagging one |
| Too-generous standard times | performance over 100 % or hidden losses | justify ideal times technically and review them yearly |
| Data without a routine | dashboard stops being opened after three months | fixed meeting cadences with KPIs as the agenda |
| Comparing safety rates with different bases | TRIR, DART, LTIFR and German rates mixed up | always state formula and base (200,000 h, 1 million h, 1,000 FTE) |

### Goodhart's law

In 1975, the British economist Charles Goodhart observed that any observed statistical regularity tends to collapse once pressure is placed on it for control purposes [24]. The anthropologist Marilyn Strathern condensed this in 1997 into the well-known sentence "When a measure becomes a target, it ceases to be a good measure" [23]. On the shop floor it looks like this: if OEE is tied to bonuses, changeovers get avoided (bigger batches, more inventory), stops get rebooked as "planned", or standard times get stretched. The KPI goes up; the plant does not get better.

Three antidotes: always look at a KPI together with a counter-KPI (OEE with inventory and OTIF), maintain definitions centrally and log changes, and use KPIs in meetings as a reason to ask questions, not as a verdict.

## 18. Roadmap: roll out manufacturing KPIs in 90 days

The following roadmap works as a framework for a line or an area. It does not require software; software speeds up phases 2 and 3.

**Phase 1, weeks 1 to 3: purpose and definitions**
- Clarify the area's goals (what does the customer want? where are the biggest losses?).
- Select 5 to 8 KPIs, at least one per SQCDP category.
- Define the time model, downtime reason catalog and definition sheets; check ideal cycle times.

**Phase 2, weeks 4 to 8: measure and learn**
- Start data collection, manually or semi-automatically at first if needed.
- Check plausibility daily; sharpen definitions where questions come up.
- Establish baselines over at least four weeks.

**Phase 3, weeks 9 to 12: manage**
- Derive targets from demand and baseline.
- Build the board and, where useful, a Power BI report.
- Establish tier routines: Tier 1 per shift, Tier 2 daily, Tier 3 weekly.
- Pick the first improvement topics from the loss Paretos and work them with PDCA.

**After that:** check quarterly whether each KPI still drives a decision. KPIs nobody uses get dropped. Embedding KPIs in a broader improvement system is covered in the guides [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned) and [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned). Targets for the bottleneck also feed directly into scheduling, see [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned).

## 19. KPIs from value stream modeling: iFAKT Polaris

> **Note: The author works at iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), headquartered in Stuttgart, Germany, develops software for planning and optimizing logistics and production processes based on Microsoft technology [33]. The company has worked on KPIs for a long time: in 2011, Jörg Drees and Christoph Sack showed in the German journal ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb) that value stream KPIs easily run into conflicts between inventory reduction, resource output, delivery capability and lead-time reduction, and that a deliberately chosen KPI set combined with lean methods enables lasting control loops [32].

According to the vendor, the [iFAKT Polaris](https://www.m365.fm/entity/polaris/) software family includes Value Stream Mapping, Business Swim Lane Mapping, Designer, Simulator, Optimizer, Operator and Analyzer [31]. Two of them are relevant for manufacturing KPIs:

- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)**, according to ifakt.de, brings together KPIs from all Polaris modules in structured dashboards, visualizes lead times, utilization, bottlenecks and project status, shows capacity limits and improvement potential, and compares scenarios, plans and actual performance [30]. The vendor page gives no information on integrations, deployment model or pricing.
- **Polaris VSM**, according to the vendor, calculates lean KPIs such as lead time, cycle time, WIP, value-added ratio and flow factor automatically from the value stream model, offers dashboards for lead time, WIP, value-added ratio and OEE, and compares scenario KPIs side by side [31].

**Assessment:** a tool like this replaces neither clean definitions nor the meeting routine. Its value lies in calculating KPIs consistently from one model and comparing scenarios before implementation, for example the effect of a WIP cap on lead time and OTIF. Whether it fits your plant should be checked like any other solution: against your data, your IT landscape and the decisions the KPIs are meant to support. More on the product family is in the guide [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned).

## 20. Glossary

| Term | Explanation |
|---|---|
| Availability (OEE) | run time ÷ planned production time [7] |
| Cycle time | measured time to complete one unit at a process [10] |
| DART rate | OSHA rate of cases with days away, restricted work or job transfer per 100 FTE [42][46] |
| Days of supply | inventory ÷ average daily usage |
| Effectiveness (ISO 22400) | corresponds to OEE performance: planned runtime per item × quantity ÷ actual production time [3] |
| Flow factor | lead time ÷ operation time (Wiendahl) [14][15] |
| FPY | first pass yield, share of units good without rework or scrap [36] |
| ISA-95 | ANSI/ISA-95 (IEC 62264); Level 3 = manufacturing operations management [40] |
| Lagging indicator | KPI that measures a result that has already happened |
| Lead time | time from start to end of an order, including all wait, queue and transport time [10][15] |
| Leading indicator | KPI that predicts a future result |
| Little's Law | L = λW: average WIP = throughput × average lead time [13] |
| Loading | planned production time ÷ calendar time; factor of TEEP [8] |
| MES | manufacturing execution system; ISA-95 Level 3 [40]; KPI guideline VDMA 66412-1 in Germany [4] |
| MTBF / MTTR | mean run time between failures / mean time to repair |
| OEE | availability × performance × quality [7] |
| Operation time | setup plus processing time of a work step (Wiendahl) [14][15] |
| Order time (REFA) | setup time plus run time (quantity × time per unit) [16][17] |
| OTIF | on time in full; no standard definition [18] |
| PPM | parts per million, defects normalized to one million [36] |
| SMED | changeover method aiming at under ten minutes [11] |
| SQCDP | Safety, Quality, Cost, Delivery, People: ordering scheme for KPIs |
| Takt time | available time ÷ customer demand [9] |
| TEEP | OEE × loading [8] |
| TRIR | OSHA total recordable incident rate: recordable cases × 200,000 ÷ hours worked [42] |
| WIP | work in process |

## 21. FAQ: manufacturing KPIs

**What are manufacturing KPIs?**
Manufacturing KPIs are measures that quantify the time, output, quality, delivery, cost and safety of a production operation, for example takt time, OEE, scrap rate or OTIF. Each KPI needs a definition, formula, unit and time period.

**What is the difference between a KPI and a metric?**
Every KPI is a metric, but not every metric is a KPI. A KPI is tied directly to a goal and regularly drives decisions, such as OTIF or bottleneck OEE. The number of parts produced is a metric; on its own it rarely triggers an action.

**What are the most important KPIs in manufacturing?**
For most plants, a starter set is enough: bottleneck OEE, FPY or scrap rate, OTIF, lead time or WIP, cost per unit and a safety rate such as TRIR. Which KPIs are "the most important" depends on where your biggest losses are.

**What are the 5 key performance indicators in manufacturing?**
There is no official top five. A practical set covers one KPI per SQCDP category: TRIR (safety), first pass yield (quality), cost per unit (cost), OTIF (delivery) and a people metric such as implemented improvement ideas, plus OEE for the bottleneck.

**How do you calculate takt time?**
Takt time = available production time ÷ customer demand. Example: 450 min (27,000 s) of available time per shift and demand of 450 units give 60 s per unit. Subtract breaks, but not unplanned downtime.

**What is the difference between takt time and cycle time?**
Takt time comes from customer demand and says how often a part must be finished. Cycle time is measured at the process and says how often a part is actually finished. Cycle time should be below takt with a reserve.

**How do you calculate manufacturing lead time?**
Directly as completion timestamp minus start timestamp per order, or indirectly with Little's Law: average WIP ÷ average throughput. 2,700 parts of WIP at 900 parts of daily throughput give 3 working days.

**How do you calculate OEE?**
OEE = availability × performance × quality. With 90 % availability, 88.9 % performance and 94.9 % quality, OEE is 75.9 %. Cross-check: good count × ideal cycle time ÷ planned production time.

**What is a good OEE score?**
85 % is often quoted as "world-class" and traced back to Nakajima, but the figure is disputed and depends on the industry [8]. A better target is one derived from your own baseline and customer demand.

**How do you calculate scrap rate?**
Scrap rate = scrap count ÷ total count × 100 %. 10 scrapped parts out of 432 produced give 2.31 %.

**What is the difference between scrap rate and first pass yield?**
Scrap rate counts only parts that are finally discarded. FPY counts only parts that were good without any correction, so also without rework. FPY, rework rate and scrap rate add up to 100 %.

**What does OTIF mean?**
On time in full: the share of deliveries or order lines that reach the customer on time and complete. There is no standard definition; you have to set the reference date, tolerance and level [18].

**How do you calculate TRIR?**
TRIR = number of OSHA-recordable cases × 200,000 ÷ total hours worked [42]. 5 recordable cases with 420,000 hours give 2.38. The 200,000 stands for 100 full-time employees working 40 hours a week for 50 weeks.

**What is the difference between capacity utilization and utilization efficiency?**
Capacity utilization is a planning figure (load relative to capacity). Utilization efficiency measures during execution how much of the occupied time was actually productive. High utilization is not a goal in itself, because lead times rise sharply near the capacity limit.

**How many KPIs should a plant track?**
Five to eight KPIs per management level, sorted by SQCDP, with each lagging indicator mapped to a leading one. More KPIs increase the data collection effort without improving control.

**Which standard defines manufacturing KPIs?**
ISO 22400-2:2014 defines KPIs for manufacturing operations management with formulas, units and timing [1]. ISA-95 defines the Level 3 context in which they are calculated [40]; in Germany, the VDMA guideline 66412-1 on MES KPIs is also widely used [4].

**Can I build manufacturing KPIs in Power BI?**
Yes. What matters is a star schema with fact and dimension tables [27] and measures that calculate KPIs from summed times. Sharing requires Power BI Pro; viewers without a Pro license need content on Premium or Fabric F64 capacity or larger [28].

**What are MTBF and MTTR?**
MTBF is the average run time between two failures, MTTR the average time to restore the machine. 16,200 min of run time and 40 failures with 1,000 min total duration give an MTBF of 405 min and an MTTR of 25 min.

## 22. Conclusion

Manufacturing KPIs are not an end in themselves. Their value comes from three things: an unambiguous definition based on ISO 22400-2 (and ISA-95 for the system context), a reliable data basis from machine signals and operator input, and a routine in which deviations lead to questions and actions. The Line 3 example shows how closely the KPIs are connected: a cycle time below takt does not guarantee delivery as long as breakdowns, changeovers and quality losses push OEE down to 75.9 %; the missing 28 parts per shift can be traced to individual loss categories and minutes. Start with a few KPIs, calculate them at every level from sums, set targets from customer demand, put safety first with a correctly based rate, and treat every KPI as a reason for a conversation at the gemba.

### Further reading on m365.fm

- Guides (planned): [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) · [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) · [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) · [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) · [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) · [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- Blog: [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) · [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- Terms: [Takt Time](https://www.m365.fm/entity/takt-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Micro Stops](https://www.m365.fm/entity/micro-stops/) · [Scrap Rate](https://www.m365.fm/entity/scrap-rate/) · [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [SMED](https://www.m365.fm/entity/smed/) · [Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/) · [Visual Management](https://www.m365.fm/entity/visual-management/) · [Tier Meeting](https://www.m365.fm/entity/tier-meeting/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Germany. On m365.fm he writes about lean manufacturing, manufacturing KPIs, value stream methods and the digitalization of manufacturing with Microsoft 365, Power BI and Azure. His focus is how to define and visualize KPIs so that they lead to decisions on the shop floor.

**Note: The author works at iFAKT GmbH.**

*[Editor: add role, background and profile photo from the author.]*

---

# Sources

All sources accessed November 20, 2026. Sources [1] to [39] keep the German numbering (re-checked where marked in the review log); [35], [36] and [38] now point to English sources, and [40] to [47] were added for the US version. All new or replaced sources were verified online.

1. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html
2. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/
3. Kang, N.; Zhao, C.; Li, J.; Horst, J. A.: A Hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54 (21), 2016, pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754
4. VDMA 66412-1:2009-10 Manufacturing Execution Systems (MES) – Kennzahlen (KPIs). 36 pages; amended by VDMA 66412-1/A1:2010-05. DIN Media: https://6sku3uaup9f9.din.de/en/technical-rule/vdma-66412-1/122410632
5. Schließmann, A.; Strahlberger, M.: Kennzahlen und Prozessgrößen wohl definiert. MES-Kennzahlen basierend auf Maschinenzuständen (well-defined KPIs: MES KPIs based on machine states). ZWF 109 (7–8), 2014, pp. 549–551. DOI: 10.3139/104.111180. https://www.degruyterbrill.com/document/doi/10.3139/104.111180/html
6. Nakajima, S.: Introduction to TPM: Total Productive Maintenance. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-23-2 (bibliographic data per [8]).
7. Muchiri, P.; Pintelon, L.: Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46 (13), 2008, pp. 3517–3535. DOI: 10.1080/00207540601142645. https://scispace.com/pdf/performance-measurement-using-overall-equipment-3udssbfefm.pdf
8. Overall equipment effectiveness. Wikipedia (English), with references to Nakajima 1982/1988/1989 and Hartmann 1992 (TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness
9. Takt Time (lexicon term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
10. Cycle Time (lexicon term, with lead time, processing time, value-creating time, effective machine cycle time). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/cycle-time/
11. Single Minute Exchange of Die (lexicon term). Lean Enterprise Institute, referring to Shingo, S.: A Revolution in Manufacturing: The SMED System. Productivity Press, 1985. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
12. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, Brookline (MA) 1998 (Shingo Research Prize 1999); current edition LEI 2018. https://www.lean.org/store/workbooks/learning-to-see/
13. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html
14. Nyhuis, P.; Wiendahl, H.-P.: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer, Berlin/Heidelberg 2012 (VDI-Buch), ISBN 978-3-540-92838-6 (English edition: Fundamentals of Production Logistics: Theory, Tools and Applications, Springer, Berlin/Heidelberg 2009, ISBN 978-3-540-34210-6). Sample (table of contents and abbreviations): https://lesejury.de/media/samples/393/9783540928393_leseprobe.pdf · Chapter "Zusammenfassung und Ausblick": https://rd.springer.com/content/pdf/10.1007%2F978-3-540-92839-3_10.pdf
15. Durchlaufzeit. Wikipedia (German), referring to Wiendahl, H.-P.: Fertigungsregelung. Hanser, Munich 1997, ISBN 3-446-19084-8. https://de.wikipedia.org/wiki/Durchlaufzeit
16. REFA (ed.): Lexikon der Betriebsorganisation. Carl Hanser, Munich 1993, ISBN 3-446-17523-7, p. 195 (bibliographic data per [17]).
17. Auftragszeit. Wikipedia (German). https://de.wikipedia.org/wiki/Auftragszeit
18. Davies, A.; Lal, S.; Perez, F.; Potdar, S.: Defining 'on-time, in-full' in the consumer sector. McKinsey & Company, June 13, 2019. https://www.mckinsey.com/capabilities/operations/our-insights/defining-on-time-in-full-in-the-consumer-sector
19. DGUV: Unfallrisiko bei der Arbeit 2025 erneut gesunken (workplace accident risk fell again in 2025). Press release, September 22, 2026. https://dguv.de/de/mediencenter/pm/pressearchiv/2026/quartal_3/details_3_713348.jsp
20. Section 193 SGB VII (German Social Code, Book VII): employer's duty to report an insured event. https://www.gesetze-im-internet.de/sgb_7/__193.html
21. Lost time injury frequency rates (LTIFR). Safe Work Australia. https://data.safeworkaustralia.gov.au/node/33
22. ISO 50006:2023 Energy management systems – Evaluating energy performance using energy performance indicators and energy baselines. https://www.iso.org/standard/79367.html
23. Strathern, M.: 'Improving ratings': audit in the British University system. European Review 5 (3), 1997, pp. 305–321. DOI: 10.1002/(SICI)1234-981X(199707)5:3<305::AID-EURO184>3.0.CO;2-4
24. Goodhart, C.: Problems of Monetary Management: The UK Experience. Papers in Monetary Economics, Vol. 1, Reserve Bank of Australia, Sydney 1975 (bibliographic data per https://en.wikipedia.org/wiki/Goodhart%27s_law).
25. DIVIDE function (DAX). Microsoft Learn. https://learn.microsoft.com/en-us/dax/divide-function-dax
26. DIVIDE function vs. divide operator (/) in DAX. Microsoft Learn. https://learn.microsoft.com/en-us/dax/best-practices/dax-divide-function-operator
27. Understand star schema and the importance for Power BI. Microsoft Learn (updated December 30, 2024). https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
28. Power BI service per-user and capacity-based licenses. Microsoft Learn (updated August 24, 2026; re-checked November 20, 2026). https://learn.microsoft.com/en-us/power-bi/service-features-license-type
29. Get started with goals and scorecards in Power BI. Microsoft Learn (updated March 5, 2026). https://learn.microsoft.com/power-bi/create-reports/service-goals-introduction
30. Polaris Analyzer (vendor page). iFAKT GmbH. https://www.ifakt.de/en/solutions/analyzer
31. Polaris VSM (vendor page, with overview of the Polaris suite). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/
32. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (production optimization through value stream modeling KPIs). ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
33. About iFAKT (company page). iFAKT GmbH. https://www.ifakt.de/en/company/
34. ISO 50006:2023, preview pages (second edition 2023-05, replaces ISO 50006:2014). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISO/preview_ISO+50006-2023.pdf
35. Manufacturing KPIs: The Metrics That Actually Drive the Floor. Fabrico (vendor blog), published June 29, 2026, updated October 26, 2026. https://www.fabrico.io/blog/manufacturing-kpis/
36. Quality Glossary of Terms, Acronyms & Definitions (entries "first pass yield", "overall equipment effectiveness", "parts per million"). ASQ. https://asq.org/quality-resources/quality-glossary
37. World-Class OEE: What Is It and How Close Are You Actually? TEEPTRAK (vendor page, benchmarks from own data). https://teeptrak.com/en/world-class-oee-benchmark/
38. ISO 22400 KPI Selection Guide. Fabrico (secondary source for the count of 34 KPIs and the categories). https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/
39. Competitor pages (competitive analysis): https://netsuite.com/portal/resource/articles/erp/manufacturing-kpis-metrics.shtml · https://www.insightsoftware.com/blog/30-manufacturing-kpis-and-metric-examples/ · https://www.dataparc.com/blog/manufacturing-kpi-examples-10-formulas-for-measuring-success/ · https://machinemetrics.com/blog/manufacturing-kpis · https://tulip.co/blog/manufacturing/how-to-calculate-34-manufacturing-kpis/ · https://www.cascade.app/blog/manufacturing-kpis · https://scw.ai/blog/manufacturing-kpis/ · https://upkeep.com/learning/what-are-the-best-metrics-and-kpis-for-manufacturing-companies/ · https://safetyculture.com/topics/kpi/manufacturing-kpis/ (redirects to mitti.com) · https://www.vorne.com/learning-center/kpi.htm
40. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264; Purdue-based Levels 0–4, Level 3 = manufacturing operations management). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
41. Equipment Performance Metrics (SEMI E10 RAM and utilization; SEMI E79 equipment productivity incl. OEE). SEMI. https://semi.org/en/products-services/standards/step/equipment-performance-metrics
42. OSHA: Clarification on how the formula is used by OSHA to calculate incident rates. Standard interpretation letter, August 23, 2016. https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23
43. U.S. Bureau of Labor Statistics: Employer-Reported Workplace Injuries and Illnesses – 2025. News release, November 18, 2026. https://www.bls.gov/news.release/osh.nr0.htm
44. U.S. Bureau of Labor Statistics: Number and rate of nonfatal work injuries and illnesses in private industries, 2025 (chart). https://www.bls.gov/charts/injuries-and-illnesses/number-and-rate-of-nonfatal-work-injuries-and-illnesses-by-industry.htm
45. 29 CFR 1904.39 – Reporting fatalities, hospitalizations, amputations, and losses of an eye as a result of work-related incidents to OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.39
46. U.S. Bureau of Labor Statistics: Occupational Safety and Health Definitions (recordable cases, DART, days away from work). https://www.bls.gov/iif/definitions/occupational-safety-and-health-definitions.htm
47. Supply Chain Dive: news brief on Walmart's on-time, in-full requirement for suppliers (87 %, two-day window, 3 % fine). March 8, 2019. https://www.supplychaindive.com/news/walmart-on-time-in-full-87-suppliers/550083/

---

# Editorial notes

## Unverified items and points to check

- **85 % benchmark and component values (90/95/99.9 %):** attributed to Nakajima in secondary sources [37]; the original passage in Nakajima 1988 was not consulted. Marked [unverified] in the text (carried over from the German version).
- **ISO 22400-2 time model:** the standard itself (paid) was not consulted. Formulas come from Kang et al. (NIST) [3]; the count of 34 from secondary sources [38][3]. In particular, whether changeovers and planned stops fall inside planned busy time (PBT) should be checked against the standard text.
- **FPY in ISO 22400-2:** the German version cited [3][38] for FPY as an ISO KPI. Fabrico's English guide [38] lists scrap and rework ratio among the 34 ISO KPIs but explicitly not first pass yield. The English text now cites only Kang et al. [3] for FPY; check against the standard text.
- **VDMA 66412-1:** only metadata (2009-10, 36 pages, A1:2010-05) and the ZWF abstract verified; no formulas quoted from the guideline.
- **Wiendahl, operation time and flow factor:** terms verified through the table of contents and abbreviations of Nyhuis/Wiendahl 2012 and Wikipedia; exact formula notation (Section 2.1.1, p. 17 ff.) not consulted. The English edition "Fundamentals of Production Logistics: Theory, Tools and Applications" (Springer 2009, ISBN verified via Springer Professional) was not checked page by page.
- **5–15 % value-added share:** Wikipedia figure without a clear primary source.
- **Changeover measurement convention (last good part to first good part), micro-stop threshold, SQCDP origin, RTY:** practice conventions, marked [unverified]. ASQ's glossary could not be checked for an RTY entry (page section not retrieved; the ASQ RTY article returned an error).
- **Polaris Analyzer:** statements come only from ifakt.de/en/solutions/analyzer [30]; no information on integration, deployment or pricing. Re-check against the current vendor page before publishing.
- **Power BI licensing:** Microsoft Learn as of August 24, 2026 [28] (re-checked November 20, 2026) and March 5, 2026 [29]; re-check before publishing. Prices deliberately not quoted.
- **BLS figures:** private industry TRC rate 2.3 per 100 FTE (2025 data, release November 18, 2026) [43]; manufacturing 2.5 per 100 full-time workers and 304,200 cases from the BLS chart [44]. The release itself does not state the manufacturing sector rate; the chart labels it "per 100 full-time workers". Re-check when BLS publishes the detailed tables.
- **Walmart OTIF:** 87 %, two-day window, 3 % fine from a March 2019 trade article [47]; later press reports mention a 98 % requirement from 2020 (not verified for this article). The text presents the 2019 figures as dated and tells readers to check current rules.
- **DGUV value 19.9 (2025):** press release September 22, 2026 [19]; kept as German context only.
- **Source [33]:** the iFAKT company page still lists a former second location that has since closed (confirmed by Mirko, November 20, 2026). The article cites [33] only for the Stuttgart headquarters and the Microsoft-based software and names no other location.
- **Example costs in USD:** the Line 3 cost rates ($45/h labor, $60/h machine, $4.00 material) are illustrative and use the same numbers as the EUR figures in the German version; they are not converted and not sourced. The text labels them as illustrative.

## Disclosure

Section 19 and the author box carry exactly "Note: The author works at iFAKT GmbH." This is the material-connection disclosure in the sense of the FTC Endorsement Guides. iFAKT does not pay for publication; there is no "sponsored" or "paid partnership" label and no rel="sponsored". The m365.fm entity page for iFAKT is currently labeled "Sponsored"; see the open point in the German consistency check (to be aligned by the editor).

## Internal links

- English sister guides (all planned, absolute URLs): /en/learn/shop-floor-management/, /en/learn/operational-excellence/, /en/learn/value-stream-mapping/, /en/learn/manufacturing-it-azure/, /en/learn/lean-manufacturing/, /en/learn/production-scheduling-aps/, /en/learn/ifakt-polaris/. Remove "(planned)" after go-live.
- Not linked because the German original does not link it: /en/learn/digital-twin-manufacturing/ and /en/learn/aerospace-production-planning/ (editor may add for completeness).
- Entity pages (/entity/...) unchanged. Blog posts are English already (title of the ROI post verified: "The Business Case for Operational Excellence: How to Prove ROI").

## hreflang and cannibalization

- hreflang pair: en-US https://www.m365.fm/en/learn/manufacturing-kpis/ <-> de-DE https://www.m365.fm/learn/produktionskennzahlen/. Both pages need reciprocal tags.
- Overlap risk: OEE is also covered in /en/learn/operational-excellence/ and the tier routines in /en/learn/shop-floor-management/. This guide should own "manufacturing KPIs", "how to calculate OEE" and "takt time vs cycle time"; the sister guides should link here for formulas.

## Technical notes

- Add jump links to the H2s in the table of contents in the CMS.
- Render formulas in blockquotes (`>`) as highlighted formula boxes; DAX code blocks with syntax highlighting.
- Make the cheat-sheet table (Section 2) and comparison table (Section 5) horizontally scrollable on mobile.

## Recommended graphics

1. OEE loss cascade Line 3: 450 min planned → −25 min breakdowns → −20 min changeovers → −30 min micro-stops → −15 min reduced speed → −18.3 min quality loss → 341.7 min value-adding (75.9 %).
2. Timeline takt time / cycle time / lead time with 60 s / 56.25 s / 3 working days.
3. KPI pyramid plant – area – line – workstation with SQCDP columns.
4. Star schema diagram of the Power BI model (Section 15).
5. Logistic operating curve (qualitative): lead time over utilization.

Check of graphic 1: 25 + 20 + 30 + 15 = 90 min; 450 − 90 = 360 min ideal time; quality loss 22 parts × 50 s = 1,100 s = 18.33 min; 360 − 18.33 = 341.67 min; 341.67 ÷ 450 = 75.9 %.

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://www.m365.fm/en/learn/manufacturing-kpis/#article",
      "headline": "Manufacturing KPIs: The Complete Guide to Production Metrics, Formulas, Worked Examples, and Power BI Dashboards",
      "description": "Manufacturing KPIs with formulas and worked examples: takt time, cycle time, lead time, OEE, scrap, FPY, OTIF, MTBF, TRIR and a Power BI dashboard.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.m365.fm/entity/ifakt/" }
      },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "mainEntityOfPage": "https://www.m365.fm/en/learn/manufacturing-kpis/",
      "isPartOf": { "@type": "WebSite", "url": "https://www.m365.fm/" },
      "about": [
        { "@type": "Thing", "name": "Key Performance Indicator", "url": "https://www.m365.fm/entity/key-performance-indicator/" },
        { "@type": "Thing", "name": "Overall Equipment Effectiveness" },
        { "@type": "Thing", "name": "Takt time", "url": "https://www.m365.fm/entity/takt-time/" }
      ],
      "citation": [
        "https://www.iso.org/standard/54497.html",
        "https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard",
        "https://doi.org/10.1080/00207540601142645",
        "https://doi.org/10.1287/opre.9.3.383",
        "https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23",
        "https://www.bls.gov/news.release/osh.nr0.htm"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/en/learn/manufacturing-kpis/#faq",
      "inLanguage": "en-US",
      "mainEntity": [
        { "@type": "Question", "name": "How do you calculate takt time?", "acceptedAnswer": { "@type": "Answer", "text": "Takt time = available production time ÷ customer demand. Example: 450 min (27,000 s) of available time per shift and demand of 450 units give 60 s per unit. Subtract breaks, but not unplanned downtime." } },
        { "@type": "Question", "name": "What is the difference between takt time and cycle time?", "acceptedAnswer": { "@type": "Answer", "text": "Takt time comes from customer demand and says how often a part must be finished. Cycle time is measured at the process and says how often a part is actually finished. Cycle time should be below takt with a reserve." } },
        { "@type": "Question", "name": "How do you calculate OEE?", "acceptedAnswer": { "@type": "Answer", "text": "OEE = availability × performance × quality. With 90 % availability, 88.9 % performance and 94.9 % quality, OEE is 75.9 %. Cross-check: good count × ideal cycle time ÷ planned production time." } },
        { "@type": "Question", "name": "What is a good OEE score?", "acceptedAnswer": { "@type": "Answer", "text": "85 % is often quoted as \"world-class\" and traced back to Nakajima, but the figure is disputed and depends on the industry. A better target is one derived from your own baseline and customer demand." } },
        { "@type": "Question", "name": "How do you calculate TRIR?", "acceptedAnswer": { "@type": "Answer", "text": "TRIR = number of OSHA-recordable cases × 200,000 ÷ total hours worked. 5 recordable cases with 420,000 hours give 2.38. The 200,000 stands for 100 full-time employees working 40 hours a week for 50 weeks." } }
      ]
    }
  ]
}
```

Note: only use questions in the FAQPage markup that appear verbatim in the visible FAQ; the remaining thirteen questions can be added following the same pattern.

---

## Review log

Procedure: five roles review the English file independently. After each round the findings are applied to the file, then the next round follows. All worked examples were recalculated by script (Python, exact values, rounding only in the result), including the new TRIR, DART and LTIFR examples. The German review log (two rounds, all five roles satisfied, plus the consistency check of November 20, 2026) is the baseline; this log covers only the localization.

### Round 1

| Role | Verdict | Key findings |
|---|---|---|
| Subject-matter expert (US industrial engineer / plant controller) | partly satisfied | (1) LTIFR/DART comparison implied DART cases are always lost-time cases; DART also contains restricted-work and job-transfer cases; (2) US readers need ISA-95 as the system context, not only ISO 22400 and VDMA; (3) the German "1,000-worker rate" cannot be the main safety KPI for US plants, OSHA TRIR/DART must lead; (4) REFA needs a one-line explanation |
| SEO specialist (US) | partly satisfied | (1) main keyword "manufacturing KPIs" confirmed by SERP; meta title 55 and description 147 characters OK; (2) PAA themes "KPI vs. metric" and "what are the 5 KPIs" missing from FAQ; (3) "how to calculate TRIR" is a strong US query and belongs in FAQ and schema; (4) internal links must point to /en/learn/ slugs; (5) ROI blog link labeled "(German)" without checking |
| US target reader (plant manager; M365/Power BI admin) | partly satisfied | Plant manager: cost example in EUR is confusing for a US audience; wants OTIF tied to real customer rules; safety section must answer "how does OSHA calculate it". Power BI admin: DAX column names in German are unusable; licensing section fine |
| Fact checker | not satisfied | Re-verified online: ISO 22400-2 status (published, "to be revised", Amd 1:2017); LEI takt (definition, 480/240 = 2 min, 1930s German aircraft industry) and cycle time lexicon (definitions, ordering sentence); Microsoft Learn licensing page (updated August 24, 2026: free, Pro, F64, PPU); ISA-95 page (Levels 0–4, Level 3 = MOM incl. MES/SCADA, IEC 62264); SEMI E10/E79 scope; OSHA interpretation 2016-08-23 (formula, 200,000 = 100 employees × 40 h × 50 weeks); 29 CFR 1904.39 (8 h / 24 h); BLS release November 18, 2026 (2025 data, private industry TRC 2.3 per 100 FTE, manufacturing cases 304,200); BLS chart (manufacturing 2.5 per 100 full-time workers); BLS definitions (DART, recordable cases); ASQ glossary (FPY, OEE, PPM); Fabrico English blog (actionable KPIs, dated June 29 / October 26, 2026); Fabrico ISO 22400 guide (34 KPIs, MTBF/MTTR, scrap and rework ratio). Findings: (a) Fabrico's ISO list does **not** include first pass yield, so [38] cannot support "ISO 22400-2 includes FPY"; (b) "several high-ranking pages give the cycle time formula upside down": only MachineMetrics confirmed; (c) "at least two pages get MTTF wrong": only Tulip clearly wrong; (d) "Large US retailers publish their own OTIF rules" had no source; (e) source [46] number skipped in first draft; (f) English edition of Nyhuis/Wiendahl must be verified before citing |
| Critic | partly satisfied | (1) Germanisms: "has proven itself" (bewährt, 4×), "number cosmetics" (Zahlenkosmetik); (2) "Variants such as SQDC are common in US plants" is an unsourced claim; (3) iFAKT section neutral, disclosure exactly as required, no sponsorship wording; (4) no AI clichés or em-dash chains found; (5) competitor criticism must stay provable |

**Conflicts and decisions:**
- SEO wanted more PAA questions (for example "what are the 4 types of KPIs"); the critic warned against padding. Decision: add only questions the article already answers in substance (KPI vs. metric, top five, TRIR). FAQ grows from 15 to 18.
- Plant manager wanted USD; the brief says keep EUR where the source is EUR and never convert silently. Decision: the Line 3 cost rates are invented, not sourced EUR data, so the example uses USD with the same numbers, labeled "illustrative" in Section 3, Section 12 and the editorial notes. No conversion rate is applied.
- Expert wanted the German safety rate removed; the brief says keep German context where it adds value. Decision: OSHA TRIR/DART lead the section; LTIFR and the German 1,000-worker rate stay as a short, explained comparison with a warning that the bases differ.
- Walmart OTIF: the only verifiable figures are from 2019. Decision: cite them as dated (with year) and tell readers to check current rules; mention later reports only in the editorial notes.

**What changed (Round 1 → Round 2):**

| old | new |
|---|---|
| Safety section: LTIFR and 1,000-worker rate (German original) | OSHA incidence rate formula [42], TRIR and DART with example (2.38 / 1.43), BLS 2025 data [43][44], 29 CFR 1904.39 [45], BLS definitions [46]; LTIFR and German rate as explained comparison |
| Standards: ISO 22400-2 and VDMA 66412-1 | plus ISA-95 / IEC 62264 Level 3 [40] and SEMI E10/E79 [41]; VDMA explained as German guideline |
| "ISO 22400-2 includes … first pass yield [3][38]" | "… first pass yield [3]; the scrap and rework ratios also appear in Fabrico's list [38]" |
| FPY, OEE and PPM defined from literature only | ASQ glossary added as US reference [36] (slot [36] reused; the German NEURONwriter analysis is not used in the English version) |
| Fabrico German blog [35] | Fabrico English blog [35], dated |
| "Several high-ranking English pages … upside down" | "At least one high-ranking English page …" |
| "at least two high-ranking English pages get this wrong" (MTTF) | "some high-ranking English pages blur the two" |
| "DART rate 1.43 and LTIFR 7.14 can describe the same three cases if every DART case involved lost time" | "… if all three DART cases involved days away from work. DART also counts restricted-work and job-transfer cases, which most LTI definitions exclude." |
| "Large US retailers publish their own OTIF rules …" (no source) | Walmart 2019: 87 %, two-day window, 3 % fine [47], labeled as dated |
| "Variants such as SQDCP or SQDC (without People) are also common in US plants." | "Plants also use variants with a different order or without People (for example SQDC)." |
| "has proven itself" / "have proven themselves" (4×), "number cosmetics" | "works best", "work well", "works", "window dressing of the numbers" |
| Cost example in EUR | same numbers in USD, labeled illustrative |
| German DAX column names (PlanzeitMin, GutErstdurchlauf …) | English names (PlannedMin, GoodFirstPass …), DAX re-checked against Line 3 |
| Blog link "Operational Excellence: ROI and Business Case (German)" | verified English title "The Business Case for Operational Excellence: How to Prove ROI", "(German)" removed |
| Nyhuis/Wiendahl German edition only | English edition added (Springer 2009, ISBN 978-3-540-34210-6, verified via Springer Professional) |
| FAQ 15 questions | 18 questions (+ KPI vs. metric, + 5 KPIs, + TRIR); schema with 5 questions incl. TRIR |
| Source numbers 40–48 with a gap | renumbered 40–47 without gap |
| Editorial note on source [33] named the closed office | rephrased without naming the location |

### Round 2

| Role | Verdict | Findings |
|---|---|---|
| Subject-matter expert | satisfied | OSHA/BLS terms correct (recordable vs. DART vs. days away); LTIFR caveat now precise; ISA-95 placement of ISO 22400 KPIs at Level 3 correct; REFA explained; time model and six big losses unchanged from the reviewed German version |
| SEO specialist (US) | satisfied | 18 FAQ questions cover the main PAA themes; FAQPage schema uses verbatim questions, `inLanguage: en-US`; all sister links absolute under /en/learn/; hreflang pair and cannibalization note present; 12,326 words, about 1.8 times the longest English competitor (NetSuite, approx. 6,500–7,000) |
| US target reader | satisfied | Plant manager: TRIR example and BLS context directly usable; USD example clear; OTIF section now names a real customer rule with a date. Power BI admin: English DAX runs as written in a model with the listed columns |
| Fact checker | satisfied | All changed facts re-verified (see Round 1); every calculation re-run by script (takt 60 s, cycle 56.25 s, OEE 75.9 %, rework variant 78.1 %, TEEP 33.9 %, roll-up 72.5 %, scrap 2.31 %, FPY 94.9 %, rework 2.78 %, sum 100 %, PPM 72, OTIF 89.0 %, flow factor 6.09, value-added 0.117 %, MTBF 405 min, availability 94.2 %, 3.60 kWh, $10.35 / $10.11, target gap 18.3 min, TRIR 2.38, DART 1.43, LTIFR 7.14, 1,000-worker rate 16.0). Open: FPY in the ISO 22400-2 text, RTY primary source, 85 % component split (all marked) |
| Critic | satisfied | No Germanisms left in the checked passages, no marketing language, no AI clichés; iFAKT section neutral with exact disclosure, no other location named; competitor criticism limited to findings documented in the competitive analysis. Remaining remark: number of [unverified] markers is high but justified |

**What changed (Round 2 → final version):** glossary sorted alphabetically ("Cycle time" was listed last); the title of source [47] replaced by a neutral description because the exact headline was not captured during verification; the Sources intro now states that [35], [36] and [38] point to English sources. No further content changes to the article.

### Final verdict

All five roles are satisfied after Round 2. The English article has 12,326 words from the H1 to the end of the Conclusion (`wc -w`, including tables and DAX code), a cheat sheet with 32 KPIs, one consistent and recalculated worked example, 47 sources (8 of them new US/English sources verified online on November 20, 2026), and a neutral, disclosed iFAKT section. Open points for the editor are listed under "Unverified items and points to check".
