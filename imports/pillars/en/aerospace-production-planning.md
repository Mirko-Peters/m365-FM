# SEO metadata

| Field | Value |
|---|---|
| Meta title | Aerospace Production Planning: The Complete Supplier Guide (58 characters) |
| Meta description | Aerospace production planning explained: AS9100, FAA Part 21/145, traceability, learning curves, rate ramp-up, APS and MRO planning, with worked examples. (154 characters) |
| Slug | `/en/learn/aerospace-production-planning/` |
| Main keyword | aerospace production planning |
| Secondary keywords | aerospace production scheduling, aerospace manufacturing scheduling, aerospace manufacturing planning, production planning aerospace suppliers, aerospace supply chain ramp-up, rate readiness, aircraft production rate, AS9100 traceability, AS9100 production planning, AS9102 first article inspection, AS9145 APQP PPAP, AS9103 key characteristics, FAA production certificate, 14 CFR Part 21, FAA Part 145 repair station, FAA Form 8130-3, Nadcap special processes, Wright learning curve, learning curve aircraft manufacturing, MRO planning, aviation maintenance planning, turnaround time MRO, serialized genealogy, life-limited parts, configuration management aerospace, high-mix low-volume scheduling, APS aerospace, finite capacity scheduling aerospace, digital thread aerospace, ITAR production planning, CMMC 2.0 manufacturing |
| Search intent | Mainly informational (fundamentals, standards, methods) with a commercial secondary layer (software, consulting). The google.com SERP for "aerospace production planning" shows academic papers (ICAS, Georgia Tech, MIT DSpace, DTIC), vendor solution pages (Plataine, Siemens, Dassault Systemes, PlanetTogether, Cosmo Tech) and a few long-form vendor blog posts. A complete, sourced guide that connects plant-level planning with the regulatory framework is missing. |
| Target word count | At least 9,000 words in the article (longest English competitor found: datacalculus.com, approx. 4,500 to 5,000 words). **Actual: 14,137 words** (`wc -w`, H1 through Conclusion, incl. FAQ) |
| Language version | `en-US`. hreflang pair: `en-US` https://www.m365.fm/en/learn/aerospace-production-planning/ <-> `de-DE` https://www.m365.fm/learn/produktionsplanung-luftfahrt/ |

# Competitive analysis (google.com SERP, November 2026)

Basis: web searches with US intent on November 20, 2026 for "aerospace production planning", "aerospace production scheduling software AS9100 traceability", "aerospace manufacturing production planning and control challenges supplier ramp-up" and "aerospace manufacturing scheduling high-mix low-volume finite capacity". The organic results are dominated by academic papers (ICAS 2012, Georgia Tech, MIT DSpace, DTIC, Production Research journals), which are not comparable as guides and were not counted. The pages below were opened and read. Word counts are estimates of the main body without navigation and footer. A measurement with NEURONwriter for google.com is still pending (see Editorial notes).

| Page (URL) | Query | Approx. words | Strengths | Gaps |
|---|---|---|---|---|
| datacalculus.com/en/blog/…/efficient-production-scheduling-in-aviation--aerospace | aerospace production planning | 4,500–5,000 | long outline, data analytics, best practices, three case studies | generic; names no standard (no AS9100, no FAA); no external sources; no numbers; case studies anonymous; about two dozen product links |
| teeptrak.com/en/aerospace-as9100-mes-implementation-2027/ | aerospace production scheduling AS9100 | 2,000–2,400 (approx. 2,800–3,200 incl. FAQ) | names AS9100D, AS9102C, AS9145, Nadcap, DFARS/CMMC, ITAR; FAQ with 10 questions | MES focus, not planning; cost and timeline figures without sources; no learning curve, no ramp-up math, no MRO |
| epsilon3.io/behind-the-console/production-tracking-for-aerospace-and-defense | aerospace production scheduling AS9100 | approx. 1,800 | serialized traceability, digital traveler, ITAR, digital thread | vendor page; no external sources; execution tracking only, no capacity planning |
| planettogether.com/aps/industries/aerospace-defense | aerospace production planning | approx. 1,400 | finite capacity, multi-level BOM, outside processing, FAQ on ITAR | vendor page; no external sources; ROI claims without evidence |
| 4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace | aerospace production planning | approx. 900 | backlogs, data quality, step-by-step APS introduction | short; no standards; no plant-level methods |
| plataine.com/industry/aerospacedefense/ | aerospace production planning | 700–750 | ramp-up framing, composites | product page; no methodology |
| aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals | aerospace supplier ramp-up | approx. 700 | survey of 100+ suppliers (Vendigital): 38 % with inadequate capacity planning | news item, undated, no method |

**Questions US searchers ask (collected from competitor FAQs, related searches and query variants; the Google "People also ask" box itself was not visible in the search tool, so confirm with NEURONwriter or a live google.com check):** What is production planning in aerospace? Why is ERP scheduling not enough for aerospace? What is AS9100 and how is it different from ISO 9001? What is the difference between AS9100 and EN 9100? When is a first article inspection (AS9102) required? What is Nadcap? What is the learning curve in aircraft manufacturing? How do you plan a production rate increase? What is MRO planning? How can a repair station reduce turnaround time? Can APS handle outside processes like heat treating? Does CMMC apply to aerospace suppliers?

**How this article beats the competitors:** None of the pages found connects the plant level of a supplier with the regulatory framework of the industry. The English results are either vendor pages without numbers or academic papers without practical guidance. This article provides current, sourced market and rate data (Airbus, Boeing, AIA, BDLI, IATA, Roland Berger, Oliver Wyman/ARSA), a standards and regulations table with planning impact for both FAA and EASA, a data model for traceability, a worked Wright learning curve example, a ramp-up calculation with a checklist, a dedicated MRO section with findings-based planning and a KPI table. It is more than twice as long as the longest competitor found and the only one with sources throughout.

---

# Aerospace Production Planning: The Complete Guide for Suppliers and MRO Shops

*As of November 20, 2026 · Based on industry and company data, IAQG/SAE standards, FAA and EASA regulations and the technical literature (see Sources)*

> **Short answer:** Aerospace production planning means matching customer rates with finite capacity, long lead times, certified special processes and complete traceability. Unlike high-volume industries, it is not enough to hit the date. You also have to prove how the part was made: every part needs a documented origin, a released configuration and a controlled process, and that evidence has to be planned just like machine hours.

Tuesday morning at a Tier 2 supplier of structural parts. The customer has raised next quarter's releases by a fifth because the aircraft maker is increasing its rate. The five-axis machining cells are already running three shifts. Heat treatment goes to an outside Nadcap-accredited processor with a three-week lead time. An engineering change has just arrived for two part numbers, which triggers a partial first article inspection. And since yesterday, the quality department has been searching for the material certificate of a titanium heat lot because a customer has a question about a lot that already shipped.

Each of these tasks can be solved on its own. The difficulty is that they all land in the same plan at the same time. That is what sets aerospace production planning apart from planning in many other industries: it plans not only quantities and dates but also evidence, approvals and configurations. And it does this in a market where the aircraft makers' order books are full for years while the supply chain is stuck in several places at once.

This guide is written for plant managers, planning and scheduling managers and quality managers at aerospace suppliers, and for planners at maintenance, repair and overhaul (MRO) shops and repair stations. Readers searching for aerospace production scheduling will find the scheduling side (finite capacity, APS, bottleneck control) in Sections 5, 10 and 11. The guide covers the market situation in 2026 with sourced numbers, what makes the industry different, the relevant standards and regulations on both sides of the Atlantic (FAA and EASA), traceability and genealogy, Wright learning curves with a worked example, how to plan a rate ramp-up, capacity planning with APS and simulation, MRO planning with unplanned findings, KPIs, a step-by-step approach and typical mistakes. A short introduction to the link between lead time and traceability is also available in the post [Aerospace production planning: lead time and traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) on m365.fm.

A note on the European context: the original version of this guide was written for German suppliers, and much of the global supply chain for Airbus runs through Europe. Where European rules (EASA, EN standards) matter for US companies, for example when you supply European customers or hold dual FAA/EASA approvals, this guide explains them next to their US counterparts.

### Key takeaways

- **Demand is there, capacity is not.** Airbus had a backlog of 9,310 commercial aircraft at the end of September 2026 [3]; Boeing reported a commercial backlog of over 6,300 airplanes at the same date [47]. Rates are rising more slowly than planned because engines, castings and forgings, raw material and skilled labor are short [4][10].
- **Planning here means planning under a burden of proof.** AS9100D requires, among other things, configuration management, traceability and the prevention of counterfeit parts [14][44]. FAA production approval holders must run a quality system that covers supplier control, quality records and quality escapes [41]. Every design change can trigger a full or partial first article inspection under AS9102 [18][46].
- **Lead time is mostly waiting time.** Little's Law says: lead time = work in process ÷ throughput [27]. Outside special processes, inspection loops and approvals are typical sources of waiting.
- **Learning curves are planning inputs.** Wright showed in 1936 that labor hours per airplane fell by about 20 % every time cumulative output doubled [24][25]. If you plan a launch with mature-rate standard hours, you plan too little capacity.
- **A ramp-up fails at the bottleneck, not on average.** A 20 % rate increase hits a resource running at 85 % utilization much harder than total capacity suggests.
- **MRO planning has to account for the unknown.** The scope of a shop visit is only known after inspection. Good MRO planning works with finding probabilities, buffers and parts availability.
- **No algorithm fixes bad master data.** APS, simulation and digital twins require correct routings, standard times, capacities and certification data.

### Quick reading paths

| You are … | Read first |
|---|---|
| Plant manager at a supplier facing a rate increase | Sections 1, 9 and 10 (market, learning curve, ramp-up with checklist) |
| Production planner or scheduler with unrealistic ERP plans | Sections 5, 6 and 11 (planning levels, lead time, APS and simulation) |
| Quality manager | Sections 3, 4 and 8 (standards and regulations, traceability, engineering changes) |
| MRO planner at a repair station | Sections 3, 4 and 13 (Part 145, life-limited parts, MRO planning) |
| IT, digital or cybersecurity lead | Sections 3.6, 4, 11, 14 and 16 (ITAR/CMMC, data model, APS, digital twin, approach) |

## Table of contents

1. [The 2026 market: why planning has become the bottleneck](#1-the-2026-market-why-planning-has-become-the-bottleneck)
2. [What makes aerospace production planning different from other industries](#2-what-makes-aerospace-production-planning-different-from-other-industries)
3. [Standards and regulations that matter for planning](#3-standards-and-regulations-that-matter-for-planning)
4. [Traceability and genealogy](#4-traceability-and-genealogy)
5. [Planning levels: from customer rate to operation](#5-planning-levels-from-customer-rate-to-operation)
6. [Understanding and reducing lead time](#6-understanding-and-reducing-lead-time)
7. [Planning special processes and outside operations](#7-planning-special-processes-and-outside-operations)
8. [Engineering changes and configuration management](#8-engineering-changes-and-configuration-management)
9. [Wright learning curves: theory and worked example](#9-wright-learning-curves-theory-and-worked-example)
10. [Planning a rate ramp-up: calculation and checklist](#10-planning-a-rate-ramp-up-calculation-and-checklist)
11. [Capacity planning with APS, bottleneck management and simulation](#11-capacity-planning-with-aps-bottleneck-management-and-simulation)
12. [Supply chain risks 2022 to 2026 and what they mean for planning](#12-supply-chain-risks-2022-to-2026-and-what-they-mean-for-planning)
13. [MRO planning: maintenance with unplanned findings](#13-mro-planning-maintenance-with-unplanned-findings)
14. [Digital twin and digital thread](#14-digital-twin-and-digital-thread)
15. [KPIs for planning and control](#15-kpis-for-planning-and-control)
16. [Approach: six steps to a reliable plan](#16-approach-six-steps-to-a-reliable-plan)
17. [Common mistakes and how to avoid them](#17-common-mistakes-and-how-to-avoid-them)
18. [iFAKT and aerospace](#18-ifakt-and-aerospace)
19. [Glossary](#19-glossary)
20. [FAQ: common questions about aerospace production planning](#20-faq-common-questions-about-aerospace-production-planning)
21. [Conclusion](#21-conclusion)

## 1. The 2026 market: why planning has become the bottleneck

### 1.1 Record demand, limited delivery capacity

Commercial aviation is in an unusual situation: demand for new aircraft has never been higher, but the industry cannot deliver at the pace customers want. According to a study that the airline association IATA presented with Oliver Wyman in October 2025, the global backlog of commercial aircraft reached a record of more than 17,000 aircraft in 2024. Between 2010 and 2019 it averaged about 13,000 [9]. The study estimates that delivery delays cost airlines more than $11 billion in 2025. The largest items are excess fuel burn from older aircraft (about $4.2 billion), additional maintenance ($3.1 billion), engine leasing ($2.6 billion) and higher spare parts inventories ($1.4 billion) [9].

The numbers for the two large manufacturers show the picture in detail:

| Metric | Airbus | Boeing |
|---|---|---|
| Deliveries 2025 | 793 commercial aircraft, of which 607 A320 Family [2] | 600 commercial airplanes, of which 447 Boeing 737 [6] |
| Backlog | 8,754 at year-end 2025 [2]; 9,310 at the end of September 2026 [3] | over 6,100 at year-end 2025, valued at about $567 billion [6]; over 6,300 at the end of September 2026, valued at $611.8 billion [47] |
| 2026 target | around 870 deliveries [3] | no unit forecast in the sources cited |
| Status 2026 | 547 deliveries through September 30 [3]; 621 through the end of October [5] | 161 deliveries in Q3 2026, of which 124 Boeing 737 [47]; 737 program still progressing toward stabilized production of 47 per month; 787 stable at 8 per month [47] |

### 1.2 Rate targets and why they keep moving

For suppliers, the aircraft maker's monthly rate is the most important planning input, because it drives the releases through every tier of the supply chain. In its report on the first nine months of 2026, Airbus states these targets: 70 to 75 A320 Family aircraft per month by the end of 2027, then stabilizing at rate 75; rate 12 for the A350 in 2028; rate 13 for the A220 in 2028; and rate 5 for the A330 in 2029 [3].

The history of the "rate 75" target shows how volatile such assumptions are. Airbus originally wanted to reach this rate in 2025 to 2026. At the end of 2024 the target moved to 2027 [4]. In April 2026, Airbus CEO Guillaume Faury publicly blamed Pratt & Whitney for not delivering the number of engines ordered and spoke of shortfalls that matched neither demand nor orders [4]. Trade media consider a slip of rate 75 into 2028 possible [4]. The target range of 70 to 75 by the end of 2027 reflects the status of October 28, 2026 [3].

At Boeing, the FAA capped 737 MAX production at 38 airplanes per month after the door plug blowout on an Alaska Airlines flight in January 2024. In October 2025 the FAA approved an increase to 42 [7]. In May 2026, Boeing CEO Kelly Ortberg said the line was now running at rate 47; he described a further step to 52 as a bigger strain because of inventory levels in the supply chain [8]. Boeing's third-quarter release of October 27, 2026 describes the 737 program as still progressing toward stabilized production of 47 per month [47].

**What this means for your planning:** Rate targets are not commitments. They are planning assumptions with significant uncertainty. A supplier that builds capacity strictly to the official target risks idle cost. A supplier that builds too late becomes the bottleneck itself, in an industry where one missing part holds up an entire airplane. Robust planning therefore works with scenarios (for example rate 60, 67 and 75) and with investment triggers defined in advance.

### 1.3 The industry in numbers: United States and Germany

The US aerospace and defense industry is the largest in the world. According to the Aerospace Industries Association (AIA) and S&P Global Market Intelligence, the industry recorded total sales of $988.6 billion in 2025 (AIA puts total business activity at $1 trillion) and supported about 2.1 million jobs. About 1.1 million of those jobs and nearly $483 billion in activity are in the domestic supply chain. Exports reached $172.7 billion, up 25 % year over year [48]. In other words, roughly half of the jobs sit with suppliers, which is exactly the group this guide is written for.

Germany is a smaller but important part of the Airbus supply chain and the home market of the original version of this guide. The German Aerospace Industries Association (BDLI) reported record figures in May 2026: EUR 62 billion in revenue in 2025 (2024: EUR 52 billion, up 19 %) and 130,000 employees (previous year: 120,000). Civil aviation is the largest segment with EUR 45 billion in revenue (up 15 %), followed by military aviation with EUR 13.5 billion (up 35 %) and space with EUR 3.5 billion. The export share was 66 %, and research and development spending was about EUR 4 billion [1].

Behind these numbers, on both sides of the Atlantic, are many small and mid-sized suppliers next to the OEMs and large system houses. They make structural parts, cabin components, engine parts, systems and special processes, or provide maintenance services. For these companies in particular, the switch from underutilization (2020 to 2022) to sustained overload is a planning challenge.

### 1.4 The supplier view: what surveys show

The consulting firm Roland Berger surveyed 95 companies in the aerospace supply chain in early 2026 [10]. The results are revealing for anyone responsible for planning:

- 55 % of companies report supply chain disruptions (2025: 64 %).
- About 80 % see a medium to high risk of critical raw material shortages; titanium, steel, copper, rare earths and magnets are named most often.
- 56 % report a shortage of qualified staff (previous year: 65 %). This remains the most common brake on the ramp-up.
- Almost 40 % lack production capacity.
- About a third operate with an EBIT margin below 5 %, and 40 % built up higher inventories for the start of production, which puts further pressure on margins.
- Long lead times affect not only material but also services such as testing, surface treatment and finishing.

An earlier survey points in the same direction from a planning angle. In a rate readiness assessment of more than 100 suppliers in Asia, Europe and the US, the consultancy Vendigital found that 38 % had inadequate capacity planning processes. It named skills shortages, unknown condition of plant and machinery, lapsed maintenance programs and poor communication between senior planners and the shop floor as causes [55]. The article does not show a publication date; it refers to Airbus's 2021 plan to reach rate 75 by 2025, so the data is several years old.

The last point of the Roland Berger list is central for planning: special processes and inspections have themselves become bottlenecks in many supply chains. Section 7 covers how to deal with this.

## 2. What makes aerospace production planning different from other industries

Many planning principles apply to any discrete manufacturing. Aerospace, however, combines several characteristics that are familiar on their own but together require their own planning logic.

### 2.1 High mix, low volume and many variants

An aerospace supplier typically makes many part numbers in small quantities. Even at a rate of 75 aircraft per month, that is about 3.5 aircraft per working day (at about 21 working days per month). A part installed once per aircraft therefore has a daily quantity in the single digits. Add customer-specific variants (cabin configuration), spare parts demand and parts for older models. The result is a high-mix, low-volume (HMLV) environment in which setups, program changeovers and inspection effort tie up a large share of capacity.

### 2.2 Long lead times and deep bills of materials

A titanium structural part can spend many weeks between raw material and shipment: forging or casting, rough machining, heat treatment, finish machining, nondestructive testing (NDT), surface treatment, final inspection. Several of these steps often happen at outside specialists. The bills of materials of large assemblies are deeply nested; aircraft consist of millions of parts that come together across many supply tiers. The consequence: a delay at a lower tier often shows up weeks later on the final assembly line. If you do not understand and actively manage [lead time](https://www.m365.fm/entity/lead-time/), you are planning with buffers you do not know.

### 2.3 Certification, qualification and evidence

In aerospace it is not enough to make a part to dimension. It has to be made with a released process, on qualified equipment, by qualified people, from certified material and in the released configuration, and all of that has to be documented. This has direct planning consequences: an order cannot simply be moved to a machine that is free but not qualified. An employee without a valid qualification for a special process is not capacity from a planning point of view. A change of supplier can require a new first article inspection.

### 2.4 Rate logic instead of lot-size logic

Aircraft makers plan in monthly rates that are announced years ahead and raised step by step. A supplier has to translate this rate into its own production lots without losing its customer's cadence. At the same time, rate steps are rarely smooth: the customer builds inventory, pushes releases out or pulls them in. Good planning therefore separates the customer rate (what the customer needs in the long run) from the releases (what the customer orders in the short term) and tracks the gap.

### 2.5 Long product life cycles

An aircraft type is often built for decades and operated even longer. That means drawing revisions, material specifications and process approvals stay valid for a long time but keep changing. Spare parts for older configurations must remain available. And records have to be kept for very long periods. Under FAA rules, a production approval holder must keep quality records for at least 5 years for products and articles made under the approval and at least 10 years for critical components [41]; customer requirements often go further. In practice, retention periods follow from customer flow-downs and the applicable regulations.

### 2.6 The high cost of a mistake

A defective part that reaches the customer (an escape) can trigger rework on the final assembly line, inspections of delivered aircraft or, in extreme cases, groundings. The FAA treats this as a quality system topic in its own right: 14 CFR 21.137 lists "quality escapes" as one of the required elements of a production approval holder's quality system [41]. The Pratt & Whitney GTF engine shows what a material defect can lead to (Section 12). For planning this means: quality inspections are not a buffer you can cut when the schedule is tight. They are fixed parts of the routing.

## 3. Standards and regulations that matter for planning

### 3.1 The IAQG standards family at a glance

The International Aerospace Quality Group (IAQG) develops the industry's quality standards. They are published in the Americas as AS standards (by SAE International), in Europe as EN standards and in Asia as JISQ standards; the content is identical. The core standard is 9100, supplemented by standards for maintenance organizations (9110), distributors (9120), first article inspection (9102), variation management of key characteristics (9103) and others [13]. In the US you will mostly see the AS designations (AS9100D, AS9102C, AS9145); European customers and documents use EN 9100 and so on. They refer to the same requirements.

On the regulatory side, two systems matter for most suppliers: the US Federal Aviation Administration (FAA), whose rules are in Title 14 of the Code of Federal Regulations (14 CFR), and the European Union Aviation Safety Agency (EASA). Confusingly, both have a "Part 21" and a "Part 145", and in both systems Subpart G of Part 21 covers production approvals. The content is similar in purpose but not identical.

The following table summarizes what you need to know as a planning manager:

| Standard / regulation | Content | Planning impact |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | Quality management system for aviation, space and defense; includes ISO 9001:2015 plus about 105 industry-specific additional requirements, including configuration management, risk management, product safety, counterfeit parts prevention, traceability and on-time delivery [14][44] | On-time delivery becomes an audited metric; traceability of material, processes, tools and people must travel with the order flow [14] |
| **AS9102C** (2023; EN 9102:2024) | First article inspection (FAI): complete verification of the first part from the production process against all design characteristics [17][18][46] | Plan FAI effort as its own operation; changes to design, material, source, process, tooling or location, and a production break of more than two years, trigger a full or partial FAI [18][34] |
| **AS9103 / EN 9103:2023** | Variation management of key characteristics [19] | Key characteristics require process capability studies and control charts; this ties up inspection capacity and affects lot sizes and inspection frequency |
| **AS9145** (2016; EN 9145:2018) | Advanced Product Quality Planning (APQP) and Production Part Approval Process (PPAP) for aerospace, five phases from planning to ongoing production [16][35][45] | Production readiness must be demonstrated at customer rate (production readiness review, runs at rate); launch planning and proof of capacity become part of the approval [35] |
| **AS9110 / EN 9110:2018** | Quality management system for aviation maintenance organizations [20] | Adds quality system requirements to Part 145; relevant for planning processes, supplier control and KPIs in MRO |
| **AS9120 / EN 9120** | Quality management system for distributors and stockists [13][14] | Traceability and certificate chain for purchased standard parts and raw material |
| **Nadcap** | Industry-managed accreditation program for special processes, founded in 1990 under SAE and administered by the Performance Review Institute (PRI); areas include heat treating, chemical processing, NDT, welding, coatings and composites [21][54] | Many customers allow only accredited shops to perform special processes; this limits the choice of sources and often makes special processes the bottleneck |
| **FAA 14 CFR Part 21, Subpart G** (production certificate); also Subpart K (Parts Manufacturer Approval, PMA) and Subpart O (TSO authorization) | Production approvals; 14 CFR 21.137 requires a written quality system with 14 elements, including design data control, supplier control, manufacturing process control, nonconforming product control, quality records and quality escapes [41] | The approval holder controls its suppliers; records must be kept for at least 5 years (10 years for critical components) [41]. Most Tier 2 and Tier 3 suppliers hold no production approval themselves but work under their customer's supplier control |
| **FAA 14 CFR Part 145** | Repair station certificate; work only within ratings and operations specifications, with current maintenance data, an FAA-approved training program and records kept for at least 2 years [42] | Planning can only assign work the station is rated for, to trained staff, with current manuals and data at hand |
| **EASA Part 21 Subpart G** | Production Organisation Approval (POA) in the EU [22] | The approval holder releases parts with an EASA Form 1 and oversees its suppliers; processes and staff must match the approval. Relevant for US suppliers to European customers |
| **EASA Part 145** | Maintenance organization approval (Annex II to Regulation (EU) No 1321/2014) [23] | Work only within the approved scope (rating), with certifying staff and valid maintenance data. A facility that holds both FAA and EASA approvals can issue a dual release on FAA Form 8130-3 [43] |
| **EASA Part-CAMO** | Continuing airworthiness management organization, introduced by Regulation (EU) 2019/1383 [23] | Plans the maintenance program, airworthiness directives and life-limited parts in Europe and hands work packages to the MRO |
| **ITAR / EAR** (USA) | Export controls for defense articles (ITAR, 22 CFR 120–130) and dual-use items (EAR, 15 CFR 730–774) [36] | Access to technical data and parts can be restricted by person and location; this also applies to planning and IT systems |
| **DFARS / CMMC 2.0** (US defense programs) | Cybersecurity Maturity Model Certification; DFARS clause 252.204-7021 effective November 10, 2025, phased in over three years; program rule 32 CFR Part 170 [49][50] | Suppliers that process federal contract information (FCI) or controlled unclassified information (CUI) in their planning, ERP or MES systems need the required CMMC level; primes must check a subcontractor's CMMC status before award [49] |
| **DFARS 252.225-7009** (specialty metals) | Specialty metals, including titanium and titanium alloys, in items delivered under DoD contracts must be melted or produced in the US or a qualifying country; flows down to subcontracts for items containing specialty metals [51] | Material planning must track melt origin by heat lot, not just alloy and quantity; a cheaper or faster lot from a non-qualifying source may not be usable |

### 3.2 AS9100 in detail: what the standard means for planning

AS9100D adopts the structure of ISO 9001 and adds requirements that reach directly into planning [44]. Three of them are especially important.

**Configuration management.** You must know at any time which design revision applies to which order and which revision was actually built. This affects order release (release only valid revisions), the handling of open orders when changes come in and the documentation of deviations.

**Traceability.** The standard requires traceability of all raw materials, materials and processes used, as well as of tools and people [14]. For planning, this means every operation confirmation must at least record who worked, when, on which machine, with which material and to which process revision. Section 4 goes deeper.

**On-time delivery.** AS9100 names on-time delivery explicitly as a requirement [14]. Customers rate their suppliers on on-time delivery (OTD) and quality. Poor OTD is therefore not only a commercial issue but also an audit issue.

### 3.3 FAA production approval: what 14 CFR 21.137 means for planners

If you hold an FAA production certificate or a Parts Manufacturer Approval (PMA holders must meet the same quality system requirements under 14 CFR 21.307), or if you supply such a holder, the quality system requirements of 14 CFR 21.137 shape your planning [41]. The rule requires each applicant for or holder of a production certificate to establish a written quality system "that ensures that each product and article conforms to its approved design and is in a condition for safe operation" [41]. Its 14 elements read like a checklist for a planning process that works:

- **Design data control and document control:** only the current, approved revision may be released to the shop floor.
- **Supplier control:** procedures that ensure each supplier-provided product, article or service conforms to the approval holder's requirements, plus a reporting process for nonconformities found after release [41].
- **Manufacturing process control, inspecting and testing, inspection and test status:** the routing has to show which inspections happen where, and the status of every part must be visible.
- **Nonconforming product control and corrective action:** scrap, rework and deviations have to be planned and documented, not handled informally.
- **Control of quality records:** at least 5 years for products and articles, at least 10 years for critical components [41].
- **In-service feedback and quality escapes:** findings from the field and escapes flow back into the system.

For a Tier 2 or Tier 3 supplier without its own approval, these requirements arrive as flow-downs in the customer's purchase order and supplier quality manual. The planning consequence is the same: the evidence has to be produced in the order flow, not reconstructed afterward.

### 3.4 Outlook: AS9100D becomes IA9100

The IAQG is working on a revision of 9100 that is to be published as IA9100. The new name is meant to unify the regional designations (AS, EN, JISQ). As of mid-October 2026, according to a review of the available information, there was no official publication and no confirmed date; estimates range from late 2026 to early 2027. The transition period for certificates has not been set either [15]. Until then, AS9100D (EN 9100:2018) remains the valid edition, and existing certificates remain valid [15]. Plan the transition as a separate project once the IAQG has published the standard, and agree the timing with your registrar.

### 3.5 AS9145: proving production readiness at customer rate

AS9145 brings APQP and PPAP, methods familiar from the automotive industry, to aerospace [45]. It structures the path to production in five phases: planning; product design and development; process design and development; product and process validation; and ongoing production, use and post-delivery service [35]. The PPAP package includes, among other things, design records, a process flow diagram, a process FMEA, a control plan, measurement system analysis, initial process capability studies and the first article inspection report (FAIR) [35].

Phases 3 and 4 are decisive for planning. In phase 3, production readiness is assessed in a production readiness review, and the processes should meet requirements at the customer's demand rate. In phase 4, production runs must show that the process delivers conforming parts at customer rate [35]. In other words: proof of capacity is part of the approval. If your capacity exists only on paper, this is where it shows.

### 3.6 Defense programs: CMMC 2.0, export controls and specialty metals

Many aerospace suppliers serve both commercial and defense customers, often on the same machines and in the same ERP system. Three US requirements then reach into planning:

- **CMMC 2.0.** The DFARS rule "Assessing Contractor Implementation of Cybersecurity Requirements" took effect on November 10, 2025. It adds clause 252.204-7021 and phases CMMC requirements in over three years; the underlying program rule, 32 CFR Part 170, took effect on December 16, 2024 [49]. The model has three levels and is aligned with NIST SP 800-171 [50]. Flow-down to subcontractors applies when the subcontract involves FCI or CUI, and primes must confirm a subcontractor's current CMMC status before award [49]. If drawings, routings or work instructions with CUI sit in your planning system, that system is in scope.
- **ITAR and EAR.** Technical data for defense articles may only be accessible to authorized persons [36]. Schedulers, offshore IT support and cloud tenants all need to be checked. This affects where planning data is stored and who can see which orders.
- **Specialty metals.** Under DFARS 252.225-7009, titanium and titanium alloys (among other specialty metals) in items delivered under DoD contracts must be melted or produced in the US or a qualifying country, and the clause flows down to subcontracts for items containing specialty metals [51]. Material allocation therefore has to know the melt origin of each heat lot.

## 4. Traceability and genealogy

### 4.1 Why traceability is a planning task

Traceability is often treated as a pure quality topic. In reality it is created in the order flow, where work is planned, performed and confirmed. When a planner moves an order to a different machine, splits a lot or reroutes an outside operation, the part's genealogy changes. If that information is missing later, the part may in the worst case no longer be shippable because its record is incomplete.

A recent article in the German trade journal *Produktion* describes evidence and data quality as the real bottleneck for mid-sized suppliers to the defense industry. It cites a BearingPoint survey according to which only 10 % of the companies surveyed in Germany have a fully integrated data architecture, while 38 % work with fragmented systems [37]. The m365.fm podcast episode [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) looks at how traceability and genealogy can be implemented technically and organizationally in manufacturing.

### 4.2 Terms: traceability, genealogy, as-designed and as-built

- **Traceability** is the ability to follow a part's origin (forward and backward): from which material, from which supplier, with which process, when and by whom?
- **Genealogy** describes the parent-child relationships between parts, lots and assemblies. It answers questions such as: which assemblies contain material from heat lot X? Which serial numbers are affected by a faulty heat treat run?
- **As-designed** is the configuration that engineering specifies; **as-built** is the configuration that was actually built, including approved deviations. **As-maintained** describes the condition after maintenance in MRO.

### 4.3 The data model: what you need to capture at a minimum

| Object | Typical attributes | Why planning needs it |
|---|---|---|
| Part / serial number | part number, revision, serial number, configuration | link to customer order and design revision |
| Lot / batch | lot number, quantity, splits and merges | lot sizing, scoping a recall |
| Raw material | material, specification, heat, supplier, material certificate, melt origin (for DFARS specialty metals [51]) | release of material before the order starts |
| Operation | machine, NC program revision, tool, process parameters, start/end | confirmation, lead time, capacity reconciliation |
| Personnel | employee, qualification, validity | assignment of qualified people only |
| Special process | processor, accreditation, furnace load/tank number, certificate | planning of outside steps, containment of deviations |
| Inspection | inspection plan, gage, result, inspector | release, FAI, evidence for key characteristics |
| Deviation | concession, rework, deviation approval | as-built documentation, shippability |
| Release document | certificate of conformity (C of C); at approved organizations FAA Form 8130-3 or EASA Form 1 [22][23][43] | shipping release; suppliers without their own production approval usually ship to the approval holder with a certificate of conformity |

A note on release documents for US readers: FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) documents domestic airworthiness approvals, approvals for return to service and export approvals. It may only be issued by persons and organizations authorized by the FAA, and FAA Order 8130.21H states that suppliers without production approval may generally not issue it for parts shipped to their production approval holder; the order also notes that it is "not a delivery or shipping document" [43]. Facilities approved by both the FAA and EASA can issue a dual release on the 8130-3 that makes a part eligible for installation on US and EU aircraft [43]. The European counterpart for single EASA releases is the EASA Form 1 [22][23].

### 4.4 Life-limited parts

Certain parts, especially rotating engine parts such as disks and shafts, have an approved life in cycles or hours (life-limited parts, LLP). Their consumption must be documented without gaps over the entire life. In the US, owners and operators must keep records of "the current status of life-limited parts" for each airframe, engine, propeller, rotor and appliance, and these records are retained and transferred with the aircraft when it is sold [53]. In Europe, the same task is part of continuing airworthiness under EASA rules [23]. If part of the history is missing (so-called back-to-birth traceability), a technically perfect part can become unusable. For manufacturers this means: the part's birth record, meaning material, heat, forging lot and manufacturing data, must be complete. For MRO shops it means: without a complete history a part cannot be reinstalled, and planning has to source a replacement.

### 4.5 Counterfeit and unapproved parts

AS9100 explicitly requires measures to prevent counterfeit parts [14]. The FAA's Advisory Circular AC 21-29D (2016) describes how to detect and report suspected unapproved parts (SUP); it defines an unapproved part as one that fails to meet the criteria of 14 CFR 21.8 or 21.9, which includes intentionally misrepresented and counterfeit parts [52]. Its guidance for purchasing is directly relevant for planners: buy from sources whose documentation traces parts back to an FAA-approved source, and be wary of warning signs such as a price far below other sellers, an unusually short delivery time or missing documentation [52]. Suspected unapproved parts are reported on FAA Form 8120-11 [52].

For planning this means: purchases may only come from approved sources, certificates must be checked at receiving inspection, and a quickly sourced replacement from an unknown source is not an option, not even under schedule pressure. Supply shortages raise the risk, because the pressure to turn to gray-market sources increases.

### 4.6 In practice: building traceability into the planning process

1. **Reserve and release material before the order starts.** An order starts only when the specific material (heat lot, certificate) is assigned and checked.
2. **Model qualifications in the capacity model.** Planning assigns operations only to people and machines with valid qualifications.
3. **Capture splits and merges in the system.** Every lot split creates a new lot number linked to its origin.
4. **Plan outside operations including the return of certificates.** A part is only back when its certificate is back.
5. **Record confirmations at the workstation, not at the end of the shift.** The later you record, the more is missing.
6. **Test your queries regularly.** Run a mock recall: how long does it take to find all serial numbers for a heat lot?

## 5. Planning levels: from customer rate to operation

### 5.1 Four levels, four time horizons

Aerospace production planning can be divided into four levels. Each answers a different question and needs different data.

| Level | Horizon | Key question | Typical tools |
|---|---|---|---|
| Strategic rate and capacity planning | 2 to 5 years | Which rate can we deliver with which investment? | scenario calculation, factory simulation, capital planning |
| Sales and operations planning (S&OP) and master production scheduling | 6 to 24 months | How do we translate customer rates into a feasible program? | ERP, rough-cut capacity planning, APS |
| Material and capacity planning | 1 to 6 months | Which material and which capacity do we need when? | ERP/MRP, supplier portals, APS |
| Detailed scheduling and shop floor control | hours to 4 weeks | Which order runs when, on which machine, with whom? | APS, MES, shop floor board |

A common cause of poor on-time delivery is not one weak level but a break between levels: the master schedule commits to rate 75, the detailed schedule knows the bottlenecks that make this impossible, and nobody reconciles the two systematically.

### 5.2 ERP, APS and MES: who does what

In most companies, [enterprise resource planning (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) is the leading system for orders, bills of materials, routings, inventory and purchasing. Its classic material requirements planning (MRP), in its basic form, calculates with fixed planned lead times and without capacity limits. That is enough to determine material requirements, but not to create a feasible production schedule.

A system for [advanced planning and scheduling (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/), by contrast, schedules against finite capacity: machines, people with qualifications, tools, shifts and material availability are considered at the same time. The underlying method is called [constraint-based scheduling](https://www.m365.fm/entity/constraint-based-scheduling/). Finally, a manufacturing execution system (MES) controls and documents execution on the shop floor and provides the confirmations without which neither planning nor traceability works.

The sister guide [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned) covers the differences between ERP, APS and MES, the limits of MRP logic and how to select planning software in detail.

### 5.3 What an aerospace planning model has to capture in addition

Compared with generic manufacturing, a planning model in aerospace needs some additional constraints:

- **Qualification matrix** for people (special processes, inspection authorizations, release authorizations)
- **Machine qualification** by part number (not every machine is approved for every part)
- **Outside operations** with realistic lead times and capacity commitments from processors
- **Inspection and release steps** as schedulable operations with their own capacity (inspection lab, inspectors, FAI)
- **Configuration and effectivity data** (which revision applies from which serial number or aircraft)
- **Material allocation at heat lot level** instead of quantity availability only (including melt origin where DFARS specialty metals rules apply [51])
- **Batch constraints** for furnaces, autoclaves and process tanks (minimum load, compatibility of parts and materials)
- **Data access restrictions** for ITAR-controlled or CUI orders (who may see and schedule which work) [36][49]

## 6. Understanding and reducing lead time

### 6.1 Little's Law: the link between inventory and time

In 1961, John D. C. Little proved a relationship that holds for every stable production system: the average inventory in the system equals throughput multiplied by the average time in the system [27]. Rearranged:

**Lead time = work in process (WIP) ÷ throughput**

**Worked example:** A shop for engine components ships an average of 40 parts per week. There are 320 parts in the system (being processed, waiting, at the outside processor, in inspection). The average lead time is then 320 ÷ 40 = 8 weeks. If WIP can be reduced to 200 parts at the same throughput, lead time drops to 5 weeks. Throughput does not change as long as the bottleneck stays fully supplied.

The law explains why releasing more orders to the shop floor does not shorten delivery time but lengthens it: WIP rises, throughput stays the same, lead time grows.

### 6.2 Where the time goes

In many factories, actual processing time is only a small part of lead time; the larger part is waiting time. This is a widely shared rule of thumb, not a generally documented ratio [unverified]. The share depends heavily on the company and should be measured in your own plant, for example with [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned). In aerospace, typical causes are:

- **Waiting for outside special processes** (transport there and back, queue at the processor, return of certificates)
- **Waiting for inspection and release** (inspection lab, FAI, customer source inspection, concessions)
- **Waiting for material or documents** (missing certificates, open engineering changes)
- **Batching** (parts wait until a furnace or batch is full)
- **Overloaded bottlenecks** (high utilization creates disproportionately long queues)
- **Disruption by rush orders** (expediting pushes regular orders aside)

### 6.3 Levers for shorter lead times

1. **Limit WIP.** Release only as many orders as the bottleneck can process. The Theory of Constraints calls this the "rope" (Section 11).
2. **Bundle and schedule outside steps.** Fixed pickup and delivery days with the processor reduce variability.
3. **Plan inspection capacity.** The inspection lab and inspectors are capacity just like machines and belong in the capacity plan.
4. **Clear documents before the start.** No order without complete documents, material with certificate and a valid design revision.
5. **Do not load bottlenecks above 85 to 90 % for long periods** when variability is high. This rule of thumb follows from queueing theory (Section 11.1); the right value depends on the variability in your plant. A small capacity reserve often costs less than long queues.

## 7. Planning special processes and outside operations

### 7.1 Why special processes often become the bottleneck

Special processes are processes whose result cannot be fully verified on the finished part without destroying it, for example heat treating, surface treatment, welding or certain coatings. Their quality must therefore be ensured through qualified processes, equipment and people. In aerospace, many customers require Nadcap accreditation for them [21][54].

This has three consequences for planning. First, the number of approved sources is limited; a change requires qualification and often a new first article inspection. Second, many of these processes run in batches (furnaces, tanks, autoclaves), which creates batching and waiting times. Third, suppliers report that testing and surface treatment in particular have long lead times [10].

### 7.2 Planning rules for special processes

- **Model the special process as a resource,** not as a flat lead time. An outside heat treater with two furnace runs per week is a capacity with a cadence, not "lead time 10 days".
- **Agree capacity commitments by contract** (slots per week) and store them in planning as a hard constraint.
- **Plan batching deliberately.** Which parts may be processed together? Which minimum load makes sense? How long may a part wait for a batch at most?
- **Make the confirmation including the certificate** a condition for the next operation.
- **Qualify second sources** before the bottleneck becomes acute. Qualification often takes months.

### 7.3 In-house special processes: make or buy from a capacity point of view

Many suppliers consider bringing special processes in-house to reduce their dependency. This can make sense, but it is a project with a long lead time of its own: equipment, qualification, accreditation, staff and customer approvals. A simulation of future utilization (Section 11.4) helps to clarify whether the investment pays off or whether the in-house equipment only creates a new bottleneck with low utilization.

## 8. Engineering changes and configuration management

### 8.1 Changes are normal in aerospace

Over the long life of an aircraft program, drawings, materials, processes and suppliers change again and again. Every change has to be assessed, approved and given an effectivity: from which serial number, aircraft or date does the new revision apply? For planning, this is a permanent source of disruption.

### 8.2 What a change triggers in planning

| Impact | Planning consequence |
|---|---|
| New design revision | review open orders: let them run out, rework, scrap or ship with a concession |
| New or changed operations | update routing, standard times, NC programs and inspection plans |
| First article inspection (full or partial) | schedule FAI as its own operation with inspection capacity; approval before production deliveries [18][34] |
| Change of material or supplier | qualification, possibly a new FAI, new certificates and procurement lead times |
| New tooling or fixtures | procurement lead time, acceptance, possibly FAI for changed tooling |

Under AS9102, a design change affecting form, fit or function, a change of manufacturing source, process, location or tooling, and a production break of more than two years, among other things, trigger a full or partial first article inspection [34]. Revision C of AS9102, published in 2023, puts more emphasis on the planning, evaluation and repetition of first article inspections [18][46]. In Europe, the corresponding edition was published as EN 9102:2024 (in Germany as DIN EN 9102:2025-01) [17].

### 8.3 Practical rules for handling changes

1. **Bundle changes where the customer allows it.** Many small individual changes cost more than a few bundled ones.
2. **Set effectivity early and transfer it to planning.** An order must know at its start which revision it is building.
3. **Actively manage inventory of old revisions.** Launching large lots of the old revision when a change is foreseeable produces scrap.
4. **Reserve FAI capacity.** Inspection resources for first articles are quickly overloaded during ramp-ups and waves of changes.
5. **Make change status visible on the planning board.** Orders with open changes are risk orders.

## 9. Wright learning curves: theory and worked example

### 9.1 The 1936 discovery

In 1936, Theodore Paul Wright published the paper "Factors Affecting the Cost of Airplanes" in the *Journal of the Aeronautical Sciences* (vol. 3, no. 4, pp. 122–128) [24]. He found that the labor hours needed per airplane fell by about 20 % with every doubling of cumulative production [25]. This pattern is known today as Wright's Law or the learning curve. A 20 % reduction per doubling is called an 80 % learning curve; the name states the remaining share [25].

Learning curves are still a standard tool for cost estimating and capacity planning in aerospace. The US Government Accountability Office (GAO) describes them in its Cost Estimating and Assessment Guide [26].

### 9.2 Two variants: cumulative average and unit model

There are two common formulations [26]:

- **Cumulative average model (Wright):** the *average* hours across all units built so far fall by a fixed percentage per doubling.
- **Unit model (Crawford model):** the hours for the *individual* unit fall by a fixed percentage per doubling.

Both use the same formula but different reference quantities [26][40]. Decide which variant you use and stick with it. If you transfer a learning rate from the cumulative average model to the unit model, you compare actual and target values that do not match.

The formula is: **Y = A · X^b**, where A = hours for the first unit, X = cumulative units and b = log(learning rate) ÷ log(2) [26].

### 9.3 Worked example: launching a new assembly

A supplier takes over the assembly of a new subassembly. The first unit requires 1,000 assembly hours. Based on comparable programs, an 85 % learning curve is assumed (cumulative average model).

**Step 1: Calculate the exponent.** b = log(0.85) ÷ log(2) = −0.2345.

**Step 2: Average and unit hours.** The hours for unit N follow from the difference of the cumulative totals: T(N) = N · avg(N) − (N−1) · avg(N−1).

| Cumulative units N | Average hours per unit | Cumulative hours | Hours for unit N |
|---|---|---|---|
| 1 | 1,000.0 | 1,000 | 1,000.0 |
| 2 | 850.0 | 1,700 | 700.0 |
| 4 | 722.5 | 2,890 | 571.3 |
| 8 | 614.1 | 4,913 | 477.4 |
| 16 | 522.0 | 8,352 | 402.6 |
| 32 | 443.7 | 14,199 | 340.9 |
| 50 | 399.6 | 19,981 | 306.6 |
| 100 | 339.7 | 33,968 | 260.3 |

**Step 3: What this means for capacity planning.** If the supplier planned the first ten units with the hours of the hundredth unit (260 hours), it would arrive at 2,603 hours. According to the learning curve, the first ten units actually need 5,828 hours, more than twice as much. A launch planned with mature-rate standard hours is therefore systematically underplanned.

**Step 4: Check sensitivity.** How strongly does the result depend on the assumed learning rate? With a 90 % curve instead of 85 %, the requirement for the first 100 units rises from 33,968 to 49,659 hours, an increase of 46 %. The choice of learning rate is thus one of the most consequential assumptions in the entire launch plan.

### 9.4 Practical rules for learning curves

- **Derive learning rates from your own data,** do not copy them from the literature. Record actual hours per unit from the start.
- **Distinguish learning curves by work content.** Manual assembly learns more than machining, where machine time hardly drops.
- **Account for interruptions.** After longer breaks, staff changes or relocations, part of the learning effect is lost.
- **Track actual against target.** If actual hours stay above the curve, either the assumption or the process is wrong. Planning needs to know which.
- **Engineering changes partly reset the curve.** A major change can trigger a new learning process.

## 10. Planning a rate ramp-up: calculation and checklist

### 10.1 Why ramp-ups fail at the bottleneck

A rate increase is often assessed on the basis of total capacity: "We are at 75 % utilization on average, so we can handle 20 % more." That is rarely true, because throughput is determined by the bottleneck, not by the average. Eliyahu M. Goldratt's [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) made this principle popular in the 1980s [28].

### 10.2 Worked example: rate 60 to rate 72

A supplier delivers one set of fitting parts per aircraft. The customer rate is to rise from 60 to 72 aircraft per month (up 20 %). The three most important resources look like this:

| Resource | Available hours/month | Load at rate 60 | Utilization rate 60 | Load at rate 72 | Utilization rate 72 |
|---|---|---|---|---|---|
| 5-axis machining | 1,400 | 1,190 | 85 % | 1,428 | 102 % |
| Deburring and assembly | 2,000 | 1,300 | 65 % | 1,560 | 78 % |
| Inspection lab (CMM) | 600 | 420 | 70 % | 504 | 84 % |
| Total (hours-weighted) | 4,000 | 2,910 | 73 % | 3,492 | 87 % |

Total utilization of 87 % sounds feasible. But 5-axis machining, at 102 %, is above its capacity, and that is without accounting for disruptions, setups for additional variants or first article inspections after changes. On top of that comes the effect from Section 6: the closer utilization gets to 100 %, the more the queues grow. Without action, lead time and late deliveries increase even though total capacity is mathematically sufficient.

**Possible actions, ordered by lead time:**

1. **Immediately:** protect the bottleneck (no idle time during breaks, prepare setups outside machine time, decouple inspection from the machine).
2. **Weeks:** extra weekend shifts, move parts with lower complexity to other qualified machines.
3. **Months:** program optimization (cycle time), fixtures for multiple setups, outsourcing individual parts to qualified partners (with FAI).
4. **Quarters to years:** an additional machine including delivery time, installation, qualification and customer approval.

The last point shows why ramp-ups in aerospace need so much lead time: between the decision for a new machine and its first approved production delivery there are often many months.

### 10.3 Checklist: is your plant ready for the next rate?

**Demand and scenarios**

- [ ] Customer rate, releases and spare parts demand by part number are available for at least 18 months.
- [ ] At least three rate scenarios have been calculated (conservative, plan, ambitious).
- [ ] Triggers for investment and hiring are defined in advance.

**Capacity**

- [ ] The bottleneck is known for each scenario, not just average utilization.
- [ ] Bottleneck utilization in the plan scenario is below 85 to 90 %.
- [ ] Learning curves for new parts are planned (Section 9).
- [ ] Inspection and measuring capacity is planned for production, FAI and changes.

**People**

- [ ] The qualification matrix shows how many people are available for each special process and inspection.
- [ ] Onboarding and qualification times for new employees are included in the plan.
- [ ] Single points of failure (one-person qualifications) are identified.

**Material and suppliers**

- [ ] Raw material contracts cover the higher rate including lead times.
- [ ] Outside special processes have capacity commitments for the new rate.
- [ ] Second sources for critical materials and processes are qualified or in qualification.
- [ ] For defense work: material sources meet DFARS specialty metals rules [51].

**Quality and approvals**

- [ ] New machines, fixtures and sources are planned with FAI and customer approval times.
- [ ] Proof of production readiness at customer rate (AS9145) is prepared [35].
- [ ] Traceability works at higher volumes without manual rework.

**Control**

- [ ] KPIs (OTD, lead time, WIP, bottleneck utilization) are tracked weekly.
- [ ] An escalation path for bottleneck disruptions is defined.
- [ ] The plan is regularly reconciled with actual confirmations.

## 11. Capacity planning with APS, bottleneck management and simulation

### 11.1 Why high utilization costs time

Queueing theory provides a simple rule of thumb: the average waiting time at a resource grows with the factor u ÷ (1 − u), where u is utilization. This approximation goes back to J. F. C. Kingman (1961); in its full form it also includes the variability of arrivals and processing times [38]. At 80 % utilization the factor is 4, at 90 % it is already 9 and at 95 % it is 19. Waiting time at a resource with 95 % utilization is therefore almost five times as long as at 80 %, all else being equal.

This is especially relevant for aerospace with its high variability (changes, rework, outside processes, rush orders). If you plan a bottleneck at 98 % utilization, you are planning long lead times along with it.

### 11.2 Bottleneck management with the Theory of Constraints

The Theory of Constraints (TOC) describes five focusing steps: identify the constraint, exploit it, subordinate everything else to it, elevate it, and then start again, because the constraint moves [28]. For shop floor control, the drum-buffer-rope (DBR) principle has become established:

- **Drum:** the bottleneck sets the pace. Its schedule is the master schedule for the shop.
- **Buffer:** a time buffer sits in front of the bottleneck so that disruptions upstream do not starve it.
- **Rope:** material release at the start of production is tied to the bottleneck. Only what the bottleneck can process in the foreseeable future is released. This keeps WIP limited.

In aerospace, the bottleneck is often not in your own building but at the outside special process or in the inspection lab. DBR still works if you treat the outside step as the drum and tie your own release to its slots.

### 11.3 APS in aerospace: what it has to do

An APS system for an aerospace supplier should be able to do at least the following:

| Capability | Why it matters in aerospace |
|---|---|
| Scheduling against finite capacity | Bottlenecks are the rule, not the exception |
| Qualifications of people and machines | Only qualified resources may be scheduled |
| Outside operations with slots | Special processes are often the real bottleneck |
| Batch building | Furnaces, tanks and autoclaves work in batches |
| Inspection and release steps | FAI and inspections tie up capacity |
| Fast rescheduling | Changes, rework and rush orders are frequent |
| Scenarios (what-if) | Evaluate rate scenarios, investments, supplier failures |
| Feedback from the shop floor | Without actual data, every plan goes stale |
| Integration with ERP and MES | Master data and orders come from ERP, actual data from MES |
| Access control for controlled data | ITAR and CUI orders must be visible only to authorized users [36][49] |

The sister guide [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned) contains a selection checklist and an implementation roadmap for APS systems.

### 11.4 Simulation: test capacity decisions before you make them

A [factory simulation](https://www.m365.fm/entity/factory-simulation/) represents resources, orders, variability and rules in a model and plays through weeks or months in minutes. It answers questions that a static capacity calculation cannot:

- How do lead time and on-time delivery develop at rate 67 and rate 75?
- What does an additional machine bring, and where does the next bottleneck appear?
- What happens if the outside heat treater is down for two weeks?
- Which release rule keeps WIP lowest at the same on-time delivery?
- Does an in-house special process pay off, or will the equipment stay underused?

Simulation does not replace detailed scheduling; it prepares strategic and tactical decisions. It is especially valuable before investments with long lead times, which is exactly the situation many suppliers are in with the current rate plans. On m365.fm you will also find the entity page [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) on the topic of planning and simulation.

## 12. Supply chain risks 2022 to 2026 and what they mean for planning

### 12.1 What happened in recent years

**Engines.** In 2023, Pratt & Whitney disclosed a defect in the powder metal of certain parts of the geared turbofan (GTF) engine that can lead to cracks. In September 2023, parent company RTX announced that an additional 600 to 700 engines would have to be removed for shop visits through 2026 and expected an average of 350 A320 Family aircraft per year to be grounded. RTX took a pre-tax charge of $3 billion; total costs were estimated at up to $7 billion, part of which falls on partners such as MTU [11]. In 2026, Airbus accused Pratt & Whitney of prioritizing maintenance in the field over new engines and of not delivering the quantities ordered [4]. By mid-2026, Airbus said it no longer had finished aircraft waiting only for engines, but it had no buffer either [39].

**Titanium.** After Russia's attack on Ukraine, Boeing suspended purchases from the Russian titanium producer VSMPO-Avisma in March 2022. Airbus, which at the time said it sourced about half of its titanium from Russia, initially continued buying [12]. Titanium remains one of the most frequently cited raw material risks in 2026 [10]. For suppliers on US defense programs, the DFARS specialty metals clause adds a source restriction on top of the availability problem [51].

**Castings and forgings.** Roland Berger reports persistent gaps in 2026 for castings and forgings for engine and system components (such as landing gear) and for fasteners for structures. For turbine blades, aerospace competes with industrial gas turbines, whose demand is also rising because of the power needs of data centers [10].

**Skilled labor.** The shortage of qualified staff remains the most common brake on the ramp-up (56 % of respondents) [10]. The situation in maintenance is similar (Section 13).

**Structural change among suppliers.** Airbus is taking over former Spirit AeroSystems work packages. The integration reduced Airbus's results for the first nine months of 2026 by EUR 235 million [3]. Shifts like this change supply relationships on all tiers below.

### 12.2 Planning responses

| Risk | Planning response |
|---|---|
| Long and variable material lead times | long-term agreements with capacity commitments, safety stock targeted at critical materials, update replenishment lead times regularly |
| Single sources for special processes | qualify second sources, secure slots by contract, model the bottleneck in the plan |
| Fluctuating customer releases | track customer rate and releases separately, raise deviations early |
| Labor shortage | qualification matrix, cross-training, onboarding in the capacity plan |
| Supplier failure | simulate scenarios, watch early warning indicators (late deliveries, quality, financial health) |
| Inventory build-up against disruptions | hold inventory deliberately and in limited amounts where it protects the bottleneck; every unit of inventory lengthens lead time according to Little's Law |

An important note on the last point: inventory is not free protection. According to Roland Berger, 40 % of suppliers built up higher inventories for the start of production, which puts pressure on their already thin margins [10]. Targeted buffers in front of the bottleneck are more effective than blanket safety stock across all parts.

## 13. MRO planning: maintenance with unplanned findings

### 13.1 The MRO market in 2026

Maintenance, repair and overhaul (MRO) is a large and growing market. In its forecast published with the US Aeronautical Repair Station Association (ARSA), Oliver Wyman puts the global commercial aviation MRO market at $139.6 billion for 2026 and expects it to grow to $193.1 billion by 2036. Engine maintenance is the largest segment at $70.1 billion. The fleet is expected to grow from about 30,000 commercial aircraft at the start of 2026 to about 41,100 in 2036 [30]. In a separate analysis from September 2026, Oliver Wyman points to material shortages, long lead times for castings and forgings and few suppliers for critical engine parts; almost 30 % of respondents expect the supply chain to fully recover only in more than three years [29].

Delayed new aircraft deliveries add to the pressure: airlines operate older aircraft longer, and these need more maintenance. The IATA study estimates the additional maintenance cost in 2025 alone at $3.1 billion [9]. At the same time, new production and maintenance compete for the same parts and capacity, as the dispute between Airbus and Pratt & Whitney shows [4].

### 13.2 Regulatory framework

In the US, a maintenance shop typically works under a repair station certificate issued under 14 CFR Part 145. A repair station may only work on articles for which it is rated and within its operations specifications, and it "may not maintain or alter any article for which it is not rated" [42]. It must keep current maintenance data such as airworthiness directives, maintenance manuals, overhaul manuals and service bulletins "current and accessible when the relevant work is being done", run an FAA-approved training program, and keep records of work for at least two years from approval for return to service [42]. Work packages typically come from the aircraft operator, which is also responsible for records such as the current status of life-limited parts under 14 CFR 91.417 [53]. Many repair stations are also certified to AS9110 [20].

In Europe, a maintenance organization works with an approval under EASA Part 145. The work packages often come from a continuing airworthiness management organization (Part-CAMO), which manages the maintenance program, airworthiness directives and life-limited parts [23]. US repair stations that also hold EASA approval can issue dual releases on FAA Form 8130-3 [43].

For planning, both systems mean the same thing: work is only allowed within the approved scope, by authorized staff and to valid maintenance data, such as the Aircraft Maintenance Manual (AMM) or the Component Maintenance Manual (CMM) in its current revision. A technician without the right authorization or training is not capacity here either.

### 13.3 What makes MRO planning fundamentally different

In new production, the work content is known before the order starts. In maintenance, it is only known after the aircraft, engine or component has been opened and inspected. Planning therefore has to deal with three types of work:

- **Routine work:** scheduled tasks from the maintenance program or the shop manual, easy to plan
- **Non-routine work (findings):** corrosion, cracks, wear or damage discovered during inspection; scope and timing are uncertain
- **Add-on work:** modifications, airworthiness directives or customer requests added to the work package

The central KPI is turnaround time (TAT), the time from induction to return to the customer. Every day an aircraft or engine spends longer in the shop costs the operator money. TAT is often determined less by labor hours than by waiting for parts, decisions on findings, approvals and specialists.

### 13.4 Worked example: plan findings instead of hoping

A component MRO shop plans the overhaul of one component type. Routine work is 80 hours. From the shop's own history of the last 50 orders, there are three typical findings (all values are assumptions for the example):

| Finding | Frequency | Additional hours | Parts required |
|---|---|---|---|
| Corrosion, repairable | 40 % | 12 h | no |
| Crack, part replacement | 10 % | 20 h | yes, lead time 15 working days, no stock |
| Wear, replacement part | 30 % | 6 h | yes, from stock |

**Expected additional hours:** 0.4 × 12 + 0.1 × 20 + 0.3 × 6 = 4.8 + 2.0 + 1.8 = 8.6 hours. On average, about 89 hours per order can be planned. For capacity planning across many orders, this expected value is useful.

**For the TAT commitment, it is not enough.** For 10 % of orders, 15 working days of waiting for the replacement part are added. If you commit to TAT as an average (mathematically a 1.5-day allowance), you will miss it badly on every tenth order. Better options are:

1. **Stock the part:** one or two parts in stock greatly reduce the TAT risk. Compare the cost of inventory with the cost of delay.
2. **Inspect earlier:** the sooner the finding is known, the sooner you can order. Schedule inspection as the first step with priority.
3. **Commit TAT by percentile:** for example a TAT that is met in 80 or 90 % of cases, with a transparent rule for findings with long parts lead times.
4. **Exchange pool:** for frequent findings, a rotable exchange pool can decouple TAT from the repair cycle.

### 13.5 Practical rules for MRO planning

- **Record finding history systematically.** Without data on the frequency and effort of findings, every plan stays an estimate.
- **Reserve capacity for non-routine work.** If you load the hangar or shop 100 % with routine work, there is no room for findings.
- **Check parts availability before accepting the order.** Critical parts with long lead times are the largest TAT risk.
- **Check the life and history of parts.** Parts without complete traceability cannot be reinstalled (Section 4.4).
- **Schedule bottleneck specialists visibly.** NDT inspectors, staff authorized to approve for return to service and specialized shops are often the bottleneck.
- **Inform customers early about findings.** Customer approval decisions are often the longest wait in the process.

## 14. Digital twin and digital thread

### 14.1 Terms

A [digital twin](https://www.m365.fm/entity/digital-twin/) of production is a model of the real factory that is fed with current data and used for analysis, planning and simulation. It covers resources, orders, routings, inventory and rules. The digital thread is the continuous link of a product's data across its life cycle: from design through manufacturing and inspection to operation and maintenance. In aerospace, the digital thread is closely tied to traceability and configuration management, because it connects as-designed, as-built and as-maintained.

### 14.2 Benefits for planning and quality

- **Planning:** the factory twin enables scenarios and optimization based on the current state (see Section 11.4).
- **Traceability:** the digital thread answers questions about lots, processes and configurations in minutes instead of days.
- **Changes:** the impact of a design change on open orders, inventory and routings becomes visible.
- **MRO:** linking manufacturing history and maintenance findings allows conclusions about process and design weaknesses.

### 14.3 Prerequisites

A digital twin is only as good as its data. Before you invest in models, check routings, standard times, capacity calendars, qualifications and confirmation quality. The consultancy 4flow names incorrect bills of materials, outdated lead times and data scattered across disconnected ERP, PLM and MES platforms as typical obstacles in aerospace, which often push planners back to disconnected spreadsheets [33]. The sister guide [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned) covers this topic in more depth; IT architecture questions, such as connecting machine and planning data to cloud platforms, are covered in the guide [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned). For data subject to export controls or CUI rules, storage location and access rights must be clarified up front [36][37][49]. In US defense programs this includes the CMMC level required for the systems that hold the data [49][50].

## 15. KPIs for planning and control

| KPI | Definition | Why it matters in aerospace |
|---|---|---|
| On-time delivery (OTD) | share of deliveries on the committed date (agree definition and tolerance window with the customer) | central criterion of supplier ratings; named as a requirement in AS9100 [14] |
| Lead time | time from order start to completion, as average and spread | determines delivery capability and inventory (Little's Law) [27] |
| Work in process (WIP) | number or value of orders on the shop floor | leading indicator of rising lead times |
| Bottleneck utilization | occupied time ÷ available time at the bottleneck | determines throughput; above 90 % waiting times rise sharply [38] |
| Schedule adherence | share of operations completed in the planned time window | shows whether the plan is realistic |
| Escapes | number of defective parts reaching the customer | highest cost impact, often a customer metric; a required quality system element for FAA production approval holders [41] |
| First pass yield (FPY) | share of parts without rework or scrap | rework consumes bottleneck capacity |
| FAI lead time | time from completion of the first article to approval | frequently underestimated factor in ramp-ups and changes |
| Learning curve deviation | actual hours per unit versus target curve | shows whether launch assumptions hold |
| Turnaround time (TAT) | time from induction to return in MRO, as average and percentile | main criterion for MRO customers |
| Finding rate | share of orders with non-routine work and its effort | basis of MRO capacity planning |

**A note on measurement:** Define each KPI unambiguously and apply the definition consistently. OTD definitions in particular differ between customers (reference to first requested or confirmed date, allowed early delivery, partial or complete delivery). A metric that everyone calculates differently controls nothing. The sister guide [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned) covers KPI definitions in more detail.

## 16. Approach: six steps to a reliable plan

**Step 1: Measure the current state.** Capture lead times, WIP, OTD and utilization by resource over at least three months. A value stream map for the most important part families shows where time is lost.

**Step 2: Identify bottlenecks.** Where do orders pile up? Which resource determines throughput? Include outside special processes, inspection and staff qualifications.

**Step 3: Clean up master data.** Routings, standard times, setup times, capacity calendars, qualifications, replenishment lead times. Without this basis, every planning tool produces wrong results.

**Step 4: Introduce control rules.** Limit WIP, tie release to the bottleneck, protect the bottleneck with a buffer and set priority rules.

**Step 5: Introduce constraint-based scheduling.** Add detailed scheduling to the ERP that considers finite capacity, qualifications and outside slots. Start with a pilot area, ideally at the bottleneck.

**Step 6: Establish scenarios and a feedback loop.** Use simulation for rate and investment decisions and reconcile plan and actuals weekly. Keep improving planning parameters based on the confirmations.

> **Quick check for plant and planning managers: five questions you can answer this week**
>
> 1. Which resource is your bottleneck today, and what was its utilization over the last four weeks?
> 2. How many orders are on the shop floor right now, and how many of them are waiting for outside special processes or inspection?
> 3. How long does it take to find all serial numbers for a specific raw material heat lot?
> 4. Which standard times are you using for parts that are just launching: mature-rate times or a learning curve?
> 5. What happens to your on-time delivery if your most important outside processor is down for two weeks?
>
> If you cannot answer one of these questions with data within a day, start with Step 1.

**Timeline:** Steps 1 to 4 require no new software and, in the author's experience, can be implemented in many companies within a few months [unverified]. Steps 5 and 6 require a software implementation; their duration depends mainly on master data quality. Reliable industry figures on duration are not available.

## 17. Common mistakes and how to avoid them

1. **Planning with infinite capacity.** The MRP logic in ERP ignores bottlenecks. Result: plans that are infeasible from the start. *Fix:* detailed scheduling against finite capacity.
2. **Releasing more orders to deliver faster.** According to Little's Law, higher WIP lengthens lead time. *Fix:* tie release to the bottleneck.
3. **Modeling outside special processes as a fixed lead time.** Outside processes have capacities, cadences and variability. *Fix:* agree slots and plan them as a resource.
4. **Forgetting inspection and FAI.** The inspection lab and inspectors are not planned and become a hidden bottleneck. *Fix:* inspection steps as operations with capacity.
5. **Using mature-rate standard times during launch.** Learning curves are ignored, the launch is underplanned. *Fix:* learning curve from your own data.
6. **Assessing the average instead of the bottleneck.** An average utilization of 75 % says nothing about the bottleneck resource. *Fix:* assess resource by resource, focus on the bottleneck.
7. **Reconstructing traceability after the fact.** Missing confirmations are pieced together at the end. *Fix:* capture in the process, assign material before the start.
8. **Ignoring qualifications.** The plan assigns tasks to people without valid qualifications. *Fix:* qualification matrix as a constraint.
9. **Treating rate targets as commitments.** Capacity is built to an official target that then slips. *Fix:* scenarios with triggers.
10. **Committing to the average in MRO.** TAT commitments based on the average are regularly missed when findings occur. *Fix:* percentiles and a parts strategy.
11. **Letting rush orders become the rule.** Constant expediting destroys schedule stability. *Fix:* clear priority rules and intervention rights.
12. **Software before data.** An APS is introduced before the master data is right. *Fix:* data quality as the first work package.
13. **Treating controlled data as an IT afterthought.** ITAR or CUI orders end up in a planning system or cloud tenant that is not set up for them. *Fix:* clarify export control and CMMC scope before selecting or rolling out planning software [36][49].

## 18. iFAKT and aerospace

> **Note: The author works at iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), headquartered in Stuttgart, Germany, develops the software [Polaris](https://www.m365.fm/entity/polaris/). According to the company website, Polaris connects ERP data with a digital twin of production in order to optimize plans. The platform includes modules for value stream and business process modeling, simulation, planning optimization (Optimizer), shop floor execution (Operator) and analytics (Analyzer) [31]. The website lists aerospace as a separate industry and describes support for suppliers and manufacturers with complex manufacturing processes [31].

As an aerospace reference, iFAKT publishes a case study with Airbus Netherlands. Since 2018, the site has built thrust frames for the propulsion modules of the Ariane 6 launch vehicle (Vulcain Aft Bay and Vinci Thrust Frame). According to the case study, the Polaris modules Optimizer, Operator and Analyzer have supported this production for seven years. The stated requirements were digital documentation, in-process quality assurance, shorter lead times, automated order scheduling and optimized resource allocation. The case study describes qualitative results such as shorter waiting times thanks to faster response to unplanned changes, shorter handover times and order status available at any time; it gives no figures [32]. The AIT manager of Airbus Netherlands is quoted as saying that the Polaris tools helped bring more structure to production [32].

On its home page, iFAKT also states improvement figures with the qualifier "up to" (for example for lead time and capacity). Because no methodology has been published for them, these figures are not used here [31].

**Context:** The requirements described in this guide (constraint-based scheduling, qualifications, outside operations, simulation of rate scenarios, shop floor feedback) are vendor-neutral. Polaris is one of several solutions on the market. Evaluate any system against the criteria in Section 11.3 and with a pilot using your own data. The sister article [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned) describes the software in more detail.

## 19. Glossary

**APQP (Advanced Product Quality Planning):** Structured quality planning for new products and processes; in aerospace governed by AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling):** Planning software that schedules against finite capacity and material availability.

**As-built / as-designed:** The configuration actually built versus the configuration specified by engineering.

**Bottleneck (constraint):** The resource that limits the throughput of the whole system.

**CAMO (Continuing Airworthiness Management Organisation):** EASA-approved organization that manages the continuing airworthiness of an aircraft (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification):** US Department of Defense program for verifying the cybersecurity of contractors that handle FCI or CUI; contract clause DFARS 252.204-7021.

**CUI (Controlled Unclassified Information):** Government information that requires safeguarding but is not classified; its presence in planning systems brings them into CMMC scope.

**Digital thread:** Continuous link of all product data across the life cycle.

**Drum-buffer-rope (DBR):** Theory of Constraints control principle in which the bottleneck sets the pace and limits release.

**EASA Form 1:** Authorized release certificate for aviation parts issued by EASA-approved production or maintenance organizations.

**Effectivity:** Statement of the serial number, aircraft or date from which a configuration or change applies.

**Escape:** A defective part that has reached the customer.

**FAA Form 8130-3:** FAA Authorized Release Certificate (Airworthiness Approval Tag) for domestic airworthiness approval, return to service and export; issued only by FAA-authorized persons and organizations.

**FAI (First Article Inspection):** Complete inspection of a first production part against all design characteristics under AS9102 / EN 9102.

**Genealogy:** Parent-child relationships between material, lots, parts and assemblies.

**HMLV (high mix, low volume):** Production of many variants in small quantities.

**Key characteristic:** A feature whose variation significantly affects fit, function, performance or service life; governed by AS9103 / EN 9103.

**Learning curve:** Relationship between cumulative quantity and effort per unit; after Wright (1936).

**LLP (life-limited part):** A part with an approved maximum number of cycles or hours.

**MRO (maintenance, repair and overhaul):** Aircraft and component maintenance services.

**Nadcap:** Industry-managed accreditation program for special processes, administered by the Performance Review Institute (PRI).

**OTD (on-time delivery):** Share of deliveries made on the committed date.

**Part 145:** In the US, the FAA repair station certificate (14 CFR Part 145); in the EU, the EASA maintenance organization approval.

**Part 21 Subpart G:** In the US, the FAA production certificate (14 CFR 21.131 to 21.150); in the EU, the EASA Production Organisation Approval (POA).

**PMA (Parts Manufacturer Approval):** FAA production approval for replacement and modification parts (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process):** Approval procedure for production parts; in aerospace part of AS9145 / EN 9145.

**Rate:** Production quantity per month, for example rate 75 = 75 aircraft per month.

**Repair station:** A maintenance organization certificated by the FAA under 14 CFR Part 145.

**Special process:** A process whose result cannot be fully verified on the finished part without destroying it, such as heat treating or surface treatment.

**TAT (turnaround time):** Time from induction of a maintenance order to return to the customer.

**Tier 1 / Tier 2:** Supply tiers; Tier 1 supplies the aircraft maker directly, Tier 2 supplies Tier 1.

**WIP (work in process):** Inventory on the shop floor.

## 20. FAQ: common questions about aerospace production planning

**What is aerospace production planning?**
It is the planning of quantities, dates, capacity and material for aircraft, engine and component manufacturing, under the industry's evidence requirements. It combines high-mix, low-volume production, long lead times and outside special processes with strict traceability and configuration control. The aircraft makers' customer rates set the pace across all supply tiers.

**Why is ERP scheduling not enough for aerospace?**
Classic MRP logic calculates with fixed lead times and without capacity limits. A feasible production schedule has to account for finite capacity, qualifications of people and machines, and slots at outside processors. APS systems or an extended detailed scheduling layer do this.

**What production rate is Airbus planning for the A320 Family?**
According to its report on the first nine months of 2026, Airbus is aiming for 70 to 75 aircraft per month by the end of 2027, then stabilizing at rate 75 [3]. The target has slipped several times, partly because of missing engines [4].

**What is Boeing's 737 production rate?**
In May 2026 Boeing's CEO said the 737 line was running at rate 47 [8]. Boeing's third-quarter 2026 release describes the program as progressing toward stabilized production of 47 per month [47]. The FAA had capped the rate at 38 after January 2024 and approved 42 in October 2025 [7].

**Which standards does an aerospace supplier need to know?**
The core is AS9100D (EN 9100:2018). Depending on the work, add AS9102 (first article inspection), AS9103 (key characteristics), AS9145 (APQP/PPAP), AS9120 (distributors) and often Nadcap accreditation for special processes. Production approval holders work under FAA 14 CFR Part 21 (or EASA Part 21 Subpart G); defense suppliers also face ITAR/EAR, DFARS and CMMC requirements.

**What is the difference between AS9100 and EN 9100?**
None in content. The IAQG standard is published as AS9100 by SAE International in the Americas, as EN 9100 in Europe and as JISQ 9100 in Asia [13][14].

**Is AS9100D still valid?**
Yes. The IAQG is working on a revision to be published as IA9100. As of October 2026, the publication date and transition period had not been confirmed, and AS9100D certificates remain valid [15].

**What does AS9100 require for traceability?**
It requires traceability of the raw materials, materials and processes used, as well as of tools and people [14]. Customers add specific requirements in their supplier quality requirements, and FAA production approval holders flow down their own quality system requirements [41].

**When is a first article inspection (AS9102) required?**
For new parts and for changes that can affect form, fit or function, for example to design, material, manufacturing source, process, tooling or location, and after a production break of more than two years. Depending on the scope, a full or partial FAI is required [34].

**What is the learning curve in aircraft manufacturing, and why does it matter for planning?**
The learning curve describes how effort per unit falls as cumulative quantity rises. Wright showed a reduction of about 20 % per doubling in 1936 [25]. If you plan a launch with mature-rate times, you significantly underestimate the capacity required (worked example in Section 9).

**How do I plan a rate ramp-up correctly?**
Assess each resource individually, especially the bottleneck, instead of average utilization. Calculate several rate scenarios, account for learning curves, inspection capacity, qualification times and approvals, and secure outside capacity by contract. The checklist in Section 10.3 helps.

**What is Nadcap?**
Nadcap is an industry-managed accreditation program for special processes such as heat treating, chemical processing, welding and nondestructive testing, founded in 1990 and administered by the Performance Review Institute [21][54]. Many customers require Nadcap accreditation for special processes.

**Can APS handle outside processes like heat treating?**
Yes, if they are modeled as resources with capacity and slots rather than as a flat lead time. Agree weekly slots with the processor, store them as a constraint and make the returned certificate a condition for the next operation (Section 7.2).

**Does CMMC apply to aerospace suppliers?**
It applies to defense contractors and subcontractors whose contracts involve federal contract information (FCI) or controlled unclassified information (CUI). The DFARS clause took effect on November 10, 2025 and is being phased in over three years; it flows down to subcontracts that involve FCI or CUI [49].

**How is MRO planning different from production planning?**
In maintenance, the scope of work is only known after inspection. Planning has to work with finding probabilities, parts availability and buffers. The central KPI is turnaround time.

**How can a repair station reduce turnaround time?**
By inspecting early, stocking critical parts or providing them through exchange pools, reserving capacity for non-routine work and speeding up customer approvals. TAT commitments should be based on percentiles rather than averages.

**Which KPIs matter most for aerospace suppliers?**
On-time delivery (OTD), lead time, work in process, bottleneck utilization, escapes and first pass yield. In maintenance, turnaround time and finding rate are added.

**What does a digital twin bring to aerospace manufacturing?**
It enables scenarios for rates and investments, faster rescheduling during disruptions and, together with the digital thread, fast answers to traceability questions. Clean master data and confirmation data are the prerequisite.

**Where are the biggest supply chain risks in 2026?**
According to Roland Berger, in skilled labor, raw materials such as titanium, castings and forgings, fasteners, and testing and surface treatment services [10]. For engines, supply shortages are limiting the aircraft makers' rates [4].

## 21. Conclusion

In 2026 the aerospace industry has full order books but a supply chain that can work through them only slowly. For suppliers and maintenance shops, production planning has become a competitive factor. Those who know their bottlenecks, plan learning curves and special processes realistically, build traceability into the order flow and calculate rate scenarios in advance can follow ramp-ups without sacrificing on-time delivery and quality.

The path there rarely starts with software. It starts with measurement, clean master data and simple control rules such as limited WIP and bottleneck-based release. APS, simulation and digital twins strengthen these foundations; they do not replace them. The mechanisms are well known and have been documented for decades, from Wright's learning curve to Little's Law and the Theory of Constraints. Applying them consistently is the real task.

## Further reading on m365.fm

**Post and podcast**

- [Aerospace production planning: lead time and traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Podcast episode [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Entity pages**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Sister guides (planned, not yet published)**

- [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about production planning, traceability, simulation and the digitalization of manufacturing. He focuses on how constraint-based planning, digital twins and shop floor feedback work together so that plans hold on the shop floor, even in demanding industries such as aerospace.

**Note: The author works at iFAKT GmbH.**

*[Editor: have the author add role, background and profile photo.]*

---

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap (secondary source for the founding year; see Editorial notes)
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals

---

# Editorial notes

1. **Competitor word counts** are estimates from reading the pages (datacalculus.com was measured at approx. 4,500–5,000 words in November 2026; the German version had estimated 3,000–3,500 for the same page, so it has evidently grown). Before publication, run a NEURONwriter analysis for google.com on "aerospace production planning" and confirm the target word count.
2. **Check rate targets shortly before publication.** Airbus publishes its 2026 deliveries in January and full-year results with new guidance in February; Boeing publishes Q4 results in late January. Status in the article: Airbus 9M report of October 28, 2026 [3], October deliveries [5], Boeing Q3 release of October 27, 2026 [47].
3. **IA9100:** If the IAQG publishes the new 9100 before publication, update Section 3.4, the standards table and the FAQ [15].
4. **Nadcap:** The founding year 1990 still rests on Wikipedia [21]. The role of PRI and the "industry-managed" character are now backed by Boeing's supplier site [54]. If possible, replace [21] with a page from the Performance Review Institute (p-r-i.org); the PRI site could not be found in the US search on November 20, 2026.
5. **iFAKT location:** Only the headquarters is named: Curiestrasse 2, 70563 Stuttgart, Germany (commercial register Stuttgart HRB 22661), as verified in the German consistency check. Other locations listed on older company pages are deliberately not mentioned (per Mirko, November 20, 2026).
6. **iFAKT reference:** The Airbus reference concerns Airbus Netherlands and space (Ariane 6), not commercial aviation. The article says so. Add further aerospace references only with evidence on ifakt.de.
7. **Disclosure:** Section 18 and the author box carry exactly "Note: The author works at iFAKT GmbH." This discloses the author's employment, a material connection in the sense of the FTC Endorsement Guides (16 CFR Part 255). It is not a sponsorship: iFAKT does not pay for publication, so no "sponsored" label and no `rel="sponsored"` markup. Vendor claims (Polaris functions, case study) are labeled as company statements; the "up to" figures from the iFAKT home page are deliberately not used. Open point from the German consistency check: the m365.fm entity page for iFAKT is currently labeled "Sponsored / Paid partnership"; this contradicts the disclosure and should be aligned before the English version goes live.
8. **Philip Schubert:** The entity page is linked neutrally ("on the topic of planning and simulation"). Please check that the description fits the content of the entity page.
9. **Internal links** to English sister guides use the absolute URLs from the localization brief (`https://www.m365.fm/en/learn/<slug>/`) and are marked "(planned)"; remove the marker once published. Entity pages (`/entity/…`), the blog post and the podcast episode are linked as in the German version.
10. **Learning curve and ramp-up examples** are fictional worked examples with disclosed assumptions; values were recalculated with Python for the English version (same results as the German version; US number format).
11. **[unverified] markings:** Two rules of thumb carry this marking (share of waiting time in lead time, Section 6.2; timeline, Section 16), carried over from the German version. Either source them or keep the wording.
12. **Vendigital survey [55]:** The article is undated and refers to Airbus's 2021 plan for rate 75 by 2025. It is used with that caveat in Section 1.4. Replace with a dated primary source from Vendigital if available.
13. **German sources kept on purpose:** BDLI [1], TÜV Rheinland FAQ (German PDF) [14], DIN Media [17] and the *Produktion* article [37] stay because they carry facts used in the text (German industry data, AS/EN 9100 equivalence and number of additional requirements, EN 9102 edition, BearingPoint figures). US equivalents were added where they exist (AIA [48], SAE [44][45][46]).
14. **Currency:** EUR figures (BDLI, Airbus Spirit adjustment) are kept in EUR without conversion, because no conversion rate is sourced.
15. **Recommended graphics:** learning curve 85 % vs. 90 %; utilization vs. waiting time (factor u/(1−u)); genealogy diagram material → heat lot → part → assembly; FAA vs. EASA comparison graphic (Part 21G, Part 145, Form 8130-3 vs. Form 1). Write descriptive alt text.
16. **TOC anchors** follow the GitHub convention. Check in the CMS whether the generated IDs match; otherwise set anchors manually. (In the Claude Doc version, the table of contents is shown as a plain list without anchor links.)
17. **hreflang / cannibalization:** Set `en-US` (this page) and `de-DE` (https://www.m365.fm/learn/produktionsplanung-luftfahrt/) as a reciprocal pair, plus `x-default` per site policy. Within the English cluster, this guide targets "aerospace production planning"; generic "production scheduling software / APS" queries belong to `/en/learn/production-scheduling-aps/`, and the MRO section should not be expanded into a separate competing page without a distinct keyword.

**Schema suggestion (JSON-LD):**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Aerospace Production Planning: The Complete Guide for Suppliers and MRO Shops",
      "description": "Aerospace production planning explained: AS9100, FAA Part 21/145, traceability, learning curves, rate ramp-up, APS and MRO planning, with worked examples.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": {"@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.m365.fm/entity/ifakt/"}
      },
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/en/learn/aerospace-production-planning/",
      "about": ["aerospace production planning", "AS9100", "FAA Part 21", "FAA Part 145", "MRO planning", "learning curve"],
      "workTranslation": {"@type": "Article", "inLanguage": "de-DE", "url": "https://www.m365.fm/learn/produktionsplanung-luftfahrt/"}
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "What is aerospace production planning?", "acceptedAnswer": {"@type": "Answer", "text": "It is the planning of quantities, dates, capacity and material for aircraft, engine and component manufacturing, under the industry's evidence requirements. It combines high-mix, low-volume production, long lead times and outside special processes with strict traceability and configuration control."}},
        {"@type": "Question", "name": "Why is ERP scheduling not enough for aerospace?", "acceptedAnswer": {"@type": "Answer", "text": "Classic MRP logic calculates with fixed lead times and without capacity limits. A feasible production schedule has to account for finite capacity, qualifications of people and machines, and slots at outside processors."}},
        {"@type": "Question", "name": "Is AS9100D still valid?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The IAQG is working on a revision to be published as IA9100. As of October 2026, the publication date and transition period had not been confirmed, and AS9100D certificates remain valid."}}
      ]
    }
  ]
}
```

Note: extend the FAQPage schema to all 19 questions in the implementation. Use `workTranslation`/`translationOfWork` only if the CMS supports it; hreflang tags are the primary signal. No `sponsored` markup, because this is a disclosure of employment.

## Review log

Review of the US English version on November 20, 2026. Five roles: subject-matter expert (aerospace supplier planning and quality, FAA/EASA), SEO specialist (US), reader from the US target audience (plant manager at a Tier 2 machining and assembly supplier with commercial and defense work), fact checker (re-verifies every new or changed fact and every new US source online), critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms). The German review protocol (three rounds, all five roles satisfied, plus the consistency check of November 20, 2026) is the baseline; its corrections (EASA Form 1 vs. certificate of conformity, AMM/CMM, ramp-up table 73 %/87 %, two [unverified] markings, absolute sister links, author box wording, iFAKT location) were carried over.

### Localization decisions before Round 1

- Main keyword confirmed as "aerospace production planning" (slug as given). The US SERP is dominated by academic papers and vendor pages; the longest guide-type competitor is datacalculus.com (approx. 4,500–5,000 words, no standards, no sources). "aerospace production scheduling" was added as the strongest secondary variant.
- Regulatory frame switched to FAA first, EASA explained: 14 CFR Part 21 Subpart G/K (21.137 quality system, 21.307 for PMA) [41], 14 CFR Part 145 [42], FAA Form 8130-3 and dual release (Order 8130.21H) [43], 14 CFR 91.417 for life-limited parts records [53], FAA AC 21-29D for suspected unapproved parts [52]. EASA Part 21G, Part 145 and Part-CAMO kept and explained for US suppliers to European customers.
- Standards renamed to the US designations (AS9100D, AS9102C, AS9103, AS9145, AS9110, AS9120) with EN equivalents in parentheses; SAE/ANSI pages added as primary references [44][45][46].
- New subsections for US readers: 3.3 (what 14 CFR 21.137 means for planners) and 3.6 (CMMC 2.0, ITAR/EAR, DFARS specialty metals) [49][50][51]; new rows in the standards table, the data model (melt origin), Section 5.3 (access restrictions), the APS capability table (access control), the ramp-up checklist (specialty metals) and the common-mistakes list (#13).
- US market data added: AIA 2026 Facts & Figures [48] next to BDLI [1]; Boeing Q3 2026 results [47] to update backlog and rates; Vendigital supplier survey [55] with an explicit date caveat.
- FAQ rebuilt around US questions (19 instead of 15): added "What is aerospace production planning?", "What is Boeing's 737 production rate?", "What is the difference between AS9100 and EN 9100?", "Can APS handle outside processes like heat treating?", "Does CMMC apply to aerospace suppliers?"; reordered so the definition and the ERP question come first.
- Sister links switched to the English URLs from the brief; Further reading extended with Manufacturing KPIs, Shop floor management and iFAKT Polaris (all "(planned)").

### Round 1

| Role | Verdict | Main findings |
|---|---|---|
| Subject-matter expert | Changes needed | 3.3 claims 21.137 applies to PC, PMA and TSO holders, but the source only covers production certificates; PMA needs its own citation, TSOA was not checked. The EASA Part 145 row implied that US repair stations working on EU aircraft "typically need" EASA approval; the cited FAA order only says a dual release requires both approvals. Otherwise accurate; FAA/EASA parallel well explained, 8130-3 "not a shipping document" is an important point for Tier 2 suppliers. |
| SEO specialist (US) | Changes needed | Main keyword in meta title, H1, H2 (Section 2), short answer and FAQ. Secondary keyword "aerospace production scheduling" does not appear in the article body. Glossary should be alphabetical for skimmability and featured snippets. Meta title 58 and description 154 characters are within limits. |
| Reader (US plant manager) | Satisfied with notes | Finally a guide that puts CMMC and specialty metals next to scheduling; the 21.137 checklist reads like an audit prep list. Would like to know where the scheduling content is if they came in via "production scheduling". |
| Fact checker | Changes needed | Re-verified online: Airbus 9M 2026 (547, 9,310, 870, rates, EUR 235 million Spirit) [3]; Boeing Q3 2026 (161 deliveries, 124 737s, backlog over 6,300 airplanes, $611.8 billion, 737 "continues to progress toward stabilized production of 47 per month", 787 at 8) [47]; AIA 2026 ($988.6 billion sales, $1 trillion business activity, 2.1 million jobs, 1.1 million and nearly $483 billion in supply chain, exports $172.7 billion, +25 %) [48]; 21.137 headings, supplier control text, 5/10-year retention [41]; 21.307 reference to 21.137 [41]; Part 145 sections 145.1/.59/.109/.163/.201/.219 [42]; Order 8130.21H effective February 1, 2014, issuer rules, "not a delivery or shipping document", dual release [43]; AS9100D revised September 20, 2016 [44]; AS9145 issued November 8, 2016 [45]; AS9102C-2023 [46]; DFARS CMMC rule effective November 10, 2025, clause 252.204-7021, three-year phase-in, flow-down only with FCI/CUI, 32 CFR 170 effective December 16, 2024 [49]; CMMC three levels, NIST SP 800-171 alignment [50]; 252.225-7009 titanium and flow-down [51]; AC 21-29D date, SUP definition, Form 8120-11, purchasing guidance [52]; 91.417(a)(2)(ii) and (b)(2) [53]; Boeing Nadcap FAQ [54]; Vendigital 100+ suppliers, 38 % [55]; IA9100 still unpublished (QMS Collective October 16, 2026; Quality Austria August 20, 2026 "late 2026 or early 2027") [15]. Learning curve table, 5,828 vs. 2,603 h, 49,659 h (+46 %) recalculated with Python. Errors found: (1) Boeing table puts quotation marks around "progressing toward stabilized production of 47 per month", which is not the exact wording; (2) "AIA rounds total business activity to $1 trillion" misstates AIA, which reports $1 trillion in total business activity as a separate figure from $988.6 billion in sales. |
| Critic | Changes needed | No AI clichés, no em-dash chains, short paragraphs. iFAKT section neutral, disclosure in exact wording, "up to" figures excluded. Glossary order is broken ("Bottleneck" between "Effectivity" and "Escape", a leftover from the German "Engpass"). Editorial notes still name a closed iFAKT location; the brief says never to mention it. |

**Conflicts and decisions (Round 1):**

- Expert vs. reader on Section 3.3: the reader liked the broad "PC, PMA, TSOA" framing; the expert wanted it limited to what is sourced. Decision: name PC and PMA (both sourced via 21.137 and 21.307), drop TSOA from the sentence; the standards table still lists Subpart O as a subpart, which the Part 21 table of contents supports.
- SEO vs. critic on the secondary keyword: SEO wanted "aerospace production scheduling" in an H2; the critic objected to renaming a clear H2 for a keyword. Decision: add one natural sentence in the introduction that points scheduling readers to Sections 5, 10 and 11; H2s unchanged.

**What changed after Round 1 (old -> new):**

- Section 1.1 table: `737 "progressing toward stabilized production of 47 per month", 787 stable at 8 per month [47]` -> `737 program still progressing toward stabilized production of 47 per month; 787 stable at 8 per month [47]`.
- Section 1.3: "(AIA rounds total business activity to $1 trillion)" -> "(AIA puts total business activity at $1 trillion)".
- Section 3.3: "If you hold an FAA production certificate, a PMA or a TSO authorization, or if you supply one of these holders, …" -> "If you hold an FAA production certificate or a Parts Manufacturer Approval (PMA holders must meet the same quality system requirements under 14 CFR 21.307), or if you supply such a holder, … [41]"; source [41] extended with 21.307.
- Standards table, EASA Part 145 row: "US repair stations working on EU-registered aircraft typically need this approval in addition to their FAA certificate [43]" -> "A facility that holds both FAA and EASA approvals can issue a dual release on FAA Form 8130-3 [43]".
- Introduction: added "Readers searching for aerospace production scheduling will find the scheduling side (finite capacity, APS, bottleneck control) in Sections 5, 10 and 11."
- Glossary: "Bottleneck (constraint)" moved to its alphabetical position after "As-built / as-designed".
- Editorial note 5: location note rewritten so that only the Stuttgart headquarters is named and no former location appears.

### Round 2

| Role | Verdict | Main findings |
|---|---|---|
| Subject-matter expert | Satisfied | 3.3 and the Part 145 row now match the sources. Section 13.2 correctly distinguishes US repair stations (operator as source of work packages, 91.417 records) from EASA Part-CAMO. |
| SEO specialist (US) | Satisfied | Keyword coverage complete; 19 FAQs match the question list; internal links: blog post, podcast, 11 entity pages, 7 English sister guides. Schema with `inLanguage: en-US` and hreflang note in place. |
| Reader (US plant manager) | Satisfied | The pointer to the scheduling sections helps. The quick check and the ramp-up checklist are directly usable. |
| Fact checker | Changes needed (minor) | All Round 1 corrections verified against the sources again. One remaining issue: the competitive analysis labels its question list "People also ask", but the search tool shows no PAA box, so the label overstates the evidence. Nadcap founding year 1990 still only from Wikipedia [21] (documented in Editorial note 4). |
| Critic | Satisfied | Glossary order fixed; no Germanisms left ("inspection lab", "outside processor", "mature-rate standard hours" read naturally); German sources that remain are explained. |

**What changed after Round 2 (old -> new):**

- Competitive analysis: "**People also ask (collected from SERP features, competitor FAQs and related searches):**" -> "**Questions US searchers ask (collected from competitor FAQs, related searches and query variants; the Google "People also ask" box itself was not visible in the search tool, so confirm with NEURONwriter or a live google.com check):**".

### Round 3 (final verdicts)

| Role | Verdict |
|---|---|
| Subject-matter expert | Satisfied. Technically correct for Tier 1/Tier 2 suppliers and repair stations; FAA and EASA kept apart where they differ. |
| SEO specialist (US) | Satisfied. Article 14,137 words (H1 through Conclusion), roughly three times the longest English competitor (datacalculus.com, approx. 4,500–5,000). |
| Reader (US plant manager) | Satisfied. |
| Fact checker | Satisfied. No unsourced numbers; two rules of thumb marked [unverified]; Vendigital date caveat and Nadcap founding-year source documented; all worked examples recalculated. |
| Critic | Satisfied. Disclosure exact, no sponsorship wording, vendor claims labeled, no mention of former iFAKT locations. |

### Final verdict

After three rounds all five roles are satisfied. The English version is ready for publication from the review's point of view, subject to Editorial notes 1 to 4, 7 and 12 (NEURONwriter measurement for google.com, update of rates before publication, IA9100 status, Nadcap primary source, alignment of the iFAKT entity page label, dated Vendigital source).
