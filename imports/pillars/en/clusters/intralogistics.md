# SEO metadata

| Field | Value |
|---|---|
| Meta title | Intralogistics: In-Plant Material Flow and Milk Runs (51 characters) |
| Meta description | Intralogistics in manufacturing with worked numbers: from-to chart, line feeding methods, milk run cycle design, AMR fleet sizing, OSHA and AMR standards. (154 characters) |
| Slug | `/en/learn/production-scheduling-aps/intralogistics/` |
| Parent pillar | [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) |
| Main keyword | intralogistics |
| Secondary keywords | in-plant logistics, in-plant material flow, internal logistics manufacturing, material handling, milk run, milk run logistics, tugger train, line feeding, line-side replenishment, kitting, supermarket lean, water spider, from-to chart, AGV vs AMR, AMR fleet sizing, forklift-free plant, OSHA 1910.178, ANSI/A3 R15.08 |
| Search intent | Informational. "Intralogistics" is a European-origin term; on google.com its results are split between definition pages and automation vendors. US readers more often search "in-plant logistics", "material handling" and "milk run". The article uses the term in the H1 and answers the US synonyms in the body and FAQ. |
| Target word count | 3,000 to 5,000 words (cluster rule; longest page read: Wikipedia AGV article, approx. 4,000 words). Actual: **4,443 words** (`wc -w`, H1 through Conclusion, after the round 5 SERP re-check; 4,369 after round 4) |
| Language version | `en-US`. New article, no German version, no hreflang pair. Self-referencing canonical only. |

# Competitive analysis (google.com SERP, November 2026)

Basis: November 20, 2026. The session's shared web search budget ran out during the research for the two sibling clusters, so SERP positions for "intralogistics", "milk run" and "AGV vs AMR" could not be recorded. Instead, three pages that typically rank for these terms were opened and read directly; word counts are rounded estimates of the main content. [Resolved in round 5: positions for all three searches are recorded in the SERP re-check below.]

| Page (URL) | Query (position not recorded) | approx. words | Strengths | Gaps |
|---|---|---|---|---|
| mecalux.com/blog/intralogistics | intralogistics | 950 | definition, technology overview (Intralogistics 4.0), advantages | no numbers, no milk run or fleet calculation, no OSHA or ANSI standards, no FAQ, closes with product promotion |
| en.wikipedia.org/wiki/Automated_guided_vehicle | AGV vs AMR | 4,000 | navigation methods, traffic control, battery charging; distinguishes AGV and AMR | no safety standards cited, no fleet sizing, not manufacturing-planning oriented |
| en.wikipedia.org/wiki/Milk_run | milk run | 375 | general definition | dairy, airline and military senses only; nothing on in-plant milk runs, tugger trains or cycle time |

"People also ask" style questions the article answers (from the working keyword list, to be checked against the live SERP): What is intralogistics? What is the difference between intralogistics and logistics? What is a milk run in manufacturing? How do you calculate a milk run cycle time? What is line feeding? What is the difference between an AGV and an AMR? Do forklift operators need OSHA certification? How many AMRs do I need?

**How this article beats the competition:** The pages read define the term and list technologies; none calculates anything or cites a US safety standard. This article works through the planning numbers: a from-to chart with load-distance, a milk run cycle and capacity check, kanban quantities at the line, an AMR fleet calculation, and the US safety and standards framework (OSHA 29 CFR 1910.176 and 1910.178, ANSI/RIA R15.08 for industrial mobile robots).

### SERP re-check, November 20, 2026

Method: US web searches for "intralogistics" (main keyword), "milk run logistics manufacturing" and "AGV vs AMR" (variants). This establishes the positions that were not recorded in the first analysis. Positions are the order returned by the search tool and approximate the google.com SERP; no live "People also ask" box is available through the tool. Searches ran on November 20; pages were opened on November 23, 2026 after the fetch quota reset. Word counts are estimates of the main text.

**"intralogistics"**

| Position (approx.) | Page | approx. words | Findings |
|---|---|---|---|
| 1 | beumergroup.com glossary "intralogistics" (two URLs) | approx. 750 | definition, how it works, intralogistics vs. logistics; FAQ: example of intralogistics, processes, why important, technologies, industries, sustainability; no milk run, line feeding, fleet sizing or safety standards |
| 2 | bito.com "What is intralogistics?" (en-gb and en-us) | approx. 1,600 | areas and systems (material flow, WMS, storage, fleet management, picking); no calculations, no standards |
| 3 | siemens.com/en-us/industries/intralogistics (two URLs) | not opened | vendor industry page |
| 4 | elementlogic.net/us "What is intralogistics?" | approx. 1,000 | examples (AS/RS, autonomous vehicles, WMS, WCS), benefits, trends; warehouse focus |
| 5 | ssi-schaefer.com | not opened | vendor solution page |
| 6 | festo.com/intralogistics | not opened | vendor product page |
| 7 | still.co.uk intralogistics systems | not opened | vendor (UK) |
| 8 | shopify.com/blog/intralogistics | approx. 1,800 | categories, best practices; FAQ: meaning, why important, systems used; warehouse and e-commerce focus |
| 9–10 | boschrexroth.com, kiongroup.com | not opened | vendor pages |

**"milk run logistics manufacturing":** interlakemecalux.com and mecalux.com (approx. 1,400; concept, pros and cons, a tire plant case; no cycle-time formula, no worked example), flexqube.com, shipbob.com, redstagfulfillment.com, inteklogistics.com. Most pages treat the milk run as inbound or distribution logistics, not in-plant line feeding.

**"AGV vs AMR":** standardbots.com, mobile-industrial-robots.com, automate.org (A3), a sponsored supplychaindive.com piece, mecalux.com, mouser.com, automationworld.com and ottomotors.com lead; all are vendor or trade pages.

**Result:** every top page for the main keyword is a vendor definition page between 750 and 1,800 words, mostly warehouse-oriented. None covers line feeding methods, a milk run calculation, AMR fleet sizing, OSHA or ANSI/A3 R15.08. Questions found that our FAQ did not answer: "What is an example of intralogistics?" and "What technologies are used in intralogistics?" (now one combined FAQ). Mecalux's general intralogistics page from the first analysis did not appear in the top results for the bare term.

---

# Intralogistics in Manufacturing: In-Plant Material Flow, Milk Runs and AMR Planning

*Updated November 20, 2026 · Part of the guide [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)*

> **Short answer:** Intralogistics is the planning and control of material flow inside a plant: receiving, storage, supermarkets, line feeding, WIP transport between operations, and shipping. In the US it is usually called in-plant logistics or material handling. Good intralogistics delivers the right parts to the line in small, regular quantities, typically with a milk run on a fixed cycle, and keeps forklifts, tuggers and mobile robots safe around people.

A schedule is only as good as the material that reaches the workstation on time. The parent guide on [production scheduling software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) shows how to build schedules against finite capacity. This deep dive covers the physical side of that plan: how parts move from the dock to the line, how to design a milk run with real numbers, how to size a fleet of autonomous mobile robots, and which US safety rules apply. It connects to the sibling articles on [lot sizing](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) and [manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/), because transport quantities and line-side stock follow from both.

### Key takeaways

- **Measure flow before you buy equipment.** A from-to chart with loads × distance shows where transport effort goes. In the example, one relocation cuts load-distance by 16%.
- **Line feeding has four basic methods.** Line stocking, kanban from a supermarket, kitting and sequencing differ in line-side space, handling effort and error rate.
- **A milk run is a fixed timetable.** Calculate the cycle from travel, stops and handling; keep a reserve against the pitch. In the example, faster container handling takes the cycle from 92% to 79% of a 30-minute pitch.
- **Fleet size is arithmetic first.** Trips per hour × minutes per trip ÷ (60 × availability). The example needs 7 AMRs, not 6.
- **Safety is a design input.** OSHA 1910.178 requires operator training and an evaluation at least every three years for powered industrial trucks; industrial mobile robots have their own standard, ANSI/RIA R15.08.

## Table of contents

1. [What intralogistics covers](#1-what-intralogistics-covers)
2. [Measure the flow: from-to chart and load-distance](#2-measure-the-flow-from-to-chart-and-load-distance)
3. [Line feeding methods](#3-line-feeding-methods)
4. [Milk run design with a worked example](#4-milk-run-design-with-a-worked-example)
5. [Supermarkets and kanban quantities at the line](#5-supermarkets-and-kanban-quantities-at-the-line)
6. [Equipment: forklifts, tuggers, conveyors, AGVs and AMRs](#6-equipment-forklifts-tuggers-conveyors-agvs-and-amrs)
7. [AMR and AGV fleet sizing](#7-amr-and-agv-fleet-sizing)
8. [Safety and the people who move material](#8-safety-and-the-people-who-move-material)
9. [IT and OT integration](#9-it-and-ot-integration)
10. [KPIs for in-plant logistics](#10-kpis-for-in-plant-logistics)
11. [Template: milk run design worksheet](#11-template-milk-run-design-worksheet)
12. [Common mistakes](#12-common-mistakes)
13. [FAQ: intralogistics and milk runs](#13-faq-intralogistics-and-milk-runs)
14. [Conclusion](#14-conclusion)

## 1. What intralogistics covers

"Intralogistics" is the common term in Europe, particularly in Germany, for all logistics *within* a site. US plants usually speak of in-plant logistics, internal logistics or material handling; MHI, the US industry association, describes itself as "a leading trade association for the material handling, logistics and supply chain industry" [5]. The scope is the same:

| Process step | Typical activities | Typical equipment |
|---|---|---|
| Receiving | Unload, check, label, put away | Forklifts, dock levelers, scanners |
| Storage | Raw materials and purchased parts in racks or automated storage | Pallet racks, AS/RS, shelving |
| Supermarket | Small-container stock close to the line, picked by route drivers | Flow racks, carts |
| Line feeding | Delivery of parts to the point of use | Tugger trains, carts, AMRs, conveyors |
| WIP transport | Moves between operations or cells | Carts, conveyors, AGVs |
| Finished goods and shipping | Packing, staging, loading | Forklifts, conveyors, stretch wrappers |

Intralogistics touches scheduling in two places. First, every material shortage at the line breaks the schedule regardless of how well it was optimized. Second, transport time is part of lead time: the WIP that waits for the next forklift is WIP that Little's Law counts. The parent pillar explains that relationship in its section on factory physics.

## 2. Measure the flow: from-to chart and load-distance

A **from-to chart** records how many loads move between each pair of areas per day. Multiply by distance to get **load-distance** (also called transport intensity). It is the quickest objective measure of transport effort and the basis for layout decisions. A [value stream map](https://www.m365.fm/en/learn/value-stream-mapping/) shows the same flow at a higher level; a spaghetti diagram shows it visually.

**Worked example.** One assembly plant, five areas, flows counted over two weeks and averaged:

| From → To | Loads per day | Distance (ft) | Load-feet per day |
|---|---|---|---|
| Receiving → Warehouse | 60 | 150 | 9,000 |
| Receiving → Supermarket (direct) | 20 | 450 | 9,000 |
| Warehouse → Supermarket | 55 | 400 | 22,000 |
| Warehouse → Assembly (bulk parts) | 25 | 480 | 12,000 |
| Supermarket → Assembly | 120 | 120 | 14,400 |
| Assembly → Shipping | 40 | 500 | 20,000 |
| **Total** | | | **86,400** |

Two layout ideas, tested on paper:

1. **Move the supermarket next to the warehouse** (warehouse → supermarket 60 ft, but supermarket → assembly 380 ft, receiving → supermarket 180 ft). Total load-distance *rises* to 93,500 load-feet per day (+8%), because the supermarket-to-line flow is the largest one. Supermarkets belong close to the point of use.
2. **Move finished goods staging next to assembly** (assembly → shipping 150 ft instead of 500). Total falls to 72,400 load-feet per day, **16% less**, with no change to the line-feeding concept.

Load-distance is a proxy. Weight it by equipment if loads differ a lot (a pallet move by forklift is not the same as a tote on a cart), and check that a shorter route does not run through a pedestrian area.

## 3. Line feeding methods

Line feeding is the step most visible to operators. There are four basic methods, and most plants combine them by part family. Boysen, Emde, Hoeck and Kauderer describe the process steps and decision problems of part logistics for automotive assembly lines, from the call order to the return of empty containers, in a 2015 review [1].

| Method | How it works | Line-side space | Handling effort | Error risk | Best for |
|---|---|---|---|---|---|
| Line stocking | Full pallets or bulk containers placed at the line | High | Low (few moves) | Medium (wrong part in big quantities) | Large, cheap, few-variant parts |
| Kanban from a supermarket | Small containers replenished on signal by a route driver | Medium | Medium | Low | Repetitive parts with steady use |
| Kitting | All parts for one product or order picked into a kit | Low | High (picking) | Low at the line, picking errors move upstream | Many variants, small parts, low volume |
| Sequencing (just-in-sequence) | Parts delivered in the exact order of the products on the line | Low | High | Low if the sequence is stable | Large, variant-rich parts (seats, harnesses) |

Questions that decide the method per part family:

- How many variants of the part does the line use, and how big is each?
- Is there room at the workstation for more than two containers?
- How stable is the production sequence in the hours before build? Sequencing needs a frozen sequence; kitting needs the order released early enough to pick.
- What does an error cost? A wrong kit stops one product; a wrong pallet can stop a shift.

Lean plants often assign a **water spider** (mizusumashi), a dedicated material handler who runs a standard route so that operators stay at their workstations [10]. The role and its standard work are covered in the shop floor articles on m365.fm, for example [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 4. Milk run design with a worked example

### 4.1 What a milk run is

A **milk run** is a fixed route driven on a fixed timetable, like a bus line: the driver collects empty containers and kanban cards at each stop and delivers full containers picked in the supermarket during the previous loop. The fixed interval is called the **pitch** or route cycle. Because the timetable is fixed, line-side stock can be small and predictable. The same term is used for external logistics (one truck collecting from several suppliers); this article covers the in-plant version.

### 4.2 The cycle time formula

> **Route cycle time = travel time + (number of stops × time per stop) + (containers handled × time per container) + supermarket loading time**

The route cycle must fit inside the pitch with a reserve for traffic, waiting at crossings and small problems.

### 4.3 Worked example

A tugger train serves eight stops on an assembly line. Route length 2,000 ft. Average speed 3 mph (264 ft per minute) including slowing at crossings. Each stop takes 0.5 minutes (stop, get off, get back on). The driver swaps 40 containers per loop (full in, empty out), 0.25 minutes each. Loading the train in the supermarket takes 6 minutes. The plant wants a 30-minute pitch.

| Element | Calculation | Minutes |
|---|---|---|
| Travel | 2,000 ft ÷ 264 ft/min | 7.6 |
| Stops | 8 × 0.5 | 4.0 |
| Container handling | 40 × 0.25 | 10.0 |
| Supermarket loading | given | 6.0 |
| **Route cycle** | | **27.6** |
| Share of 30-minute pitch | 27.6 ÷ 30 | **92%** |

At 92%, a single blocked crossing makes the train late, and the line starts consuming its safety containers. The design needs more reserve. Many planners aim for roughly 80 to 85% [unverified: rule of thumb, no source; calibrate with your own route data]. Three options:

| Option | Change | New cycle | Share of pitch | Side effects |
|---|---|---|---|---|
| A. Faster handling | Roller-deck carts and shelf-height racks, 0.15 min per container | 23.6 min | 79% | Investment in carts and racks |
| B. Split the route | Two routes, 4 stops and 20 containers each, 1,200 ft each | 4.5 + 2.0 + 5.0 + 3.0 = 14.5 min | 48% | Second driver or train, idle capacity |
| C. Longer pitch | 40-minute pitch, so about 53 containers per loop and 8 min loading | 7.6 + 4.0 + 13.3 + 8.0 = 32.9 min | 82% | Exceeds the 48 train positions (Section 4.4); more line-side stock |

Option A is usually the first step, because handling time is the largest element. Option B fits when a second route can also serve other areas. Option C fails the capacity check and adds the line-side stock the milk run was supposed to remove.

### 4.4 Train capacity check

The second check is physical: do the containers fit? If the train has four carts with 12 container positions each (48 positions) and a loop moves 40 full containers in, it works, with 8 positions of reserve for consumption peaks. Check the peak hour, not the shift average, because consumption follows the product mix in the schedule.

## 5. Supermarkets and kanban quantities at the line

The milk run pitch sets how much stock the line needs. For a kanban loop between the supermarket and the line with a fixed-interval route:

> **Number of containers = consumption per hour × (pitch × (1 + order lag) + safety time) ÷ container quantity**, rounded up

The order lag is the number of route cycles between picking up a card and delivering the full container. With a pick-in-supermarket-and-deliver-next-loop process, it is 1.

**Worked example.** A part is used once per minute (60 per hour). Pitch 30 minutes, order lag 1, safety time 15 minutes, container of 30 parts.

- Coverage time = 0.5 h × (1 + 1) + 0.25 h = 1.25 h
- Consumption during coverage = 60 × 1.25 = 75 parts
- Containers = 75 ÷ 30 = 2.5, rounded up to **3 containers** in the loop

Halve the pitch to 15 minutes, and coverage drops to 0.25 h × 2 + 0.25 h = 0.75 h, which needs 45 parts or 2 containers. Shorter pitches mean less line-side stock, more frequent trips and more handling. The [kanban pull system](https://www.m365.fm/en/learn/kanban-pull-system/) pillar (planned) covers card loops, supermarkets and kanban rules in depth. Container quantities interact with lot sizes upstream: a supplier or press lot that does not fit the container quantity creates partial containers and counting errors (see [lot sizing](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)). Where lot traceability or shelf life matters, run supermarket lanes first-in, first-out (load from the back, pick from the front) so the line always consumes the oldest lot.

## 6. Equipment: forklifts, tuggers, conveyors, AGVs and AMRs

| Equipment | Strengths | Limits | Typical use |
|---|---|---|---|
| Forklift | Flexible, lifts pallets to height | Serious pedestrian hazard, one load per trip, high driver cost per move | Receiving, storage, shipping |
| Tugger train | Many small containers per trip, timetable-based | Needs wide, clean routes and turning space | Line feeding (milk run) |
| Manual cart | Cheap, flexible | Ergonomic limits on push force and weight | Short distances, cells |
| Conveyor | Continuous, predictable | Fixed path, blocks floor space and cross traffic | Fixed high-volume flows |
| AGV (automated guided vehicle) | Follows fixed paths (wire, magnetic tape, reflectors); predictable | Rerouting needs infrastructure changes | Repetitive point-to-point transport |
| AMR (autonomous mobile robot) | Navigates by map and sensors, can drive around obstacles | Throughput drops in crowded aisles; needs good Wi-Fi and fleet management | Tote and cart transport in mixed traffic |

The AGV and AMR distinction is mostly about navigation: an AGV follows predefined paths, an AMR plans its own path within a map. For safety, the US has a dedicated standard for industrial mobile robots: ANSI/RIA R15.08-1-2020, *Industrial Mobile Robots – Safety Requirements – Part 1: Requirements for the Industrial Mobile Robot*, which "specifies safety requirements for industrial mobile robots (IMRs)" [4]. Part 2 covers "Requirements for IMR system(s) and IMR application(s)," that is, integration and use [4]. Part 2 was developed by A3 (Association for Advancing Automation) and released in 2023 as ANSI/A3 R15.08-2-2023 [6]. Driverless industrial trucks have their own standards: ANSI/ITSDF B56.5-2024 in the US [8] and ISO 3691-4:2023 internationally [9].

Many plants pursue **forklift-free zones** in assembly areas: forklifts stay at receiving, storage and shipping, and tuggers, carts or AMRs feed the line. The reasons are safety (pedestrian separation) and flow (small, frequent deliveries instead of pallets).

## 7. AMR and AGV fleet sizing

A first-cut fleet size comes from a simple calculation, before any simulation:

> **Vehicles = (trips per hour × average minutes per trip) ÷ (60 × availability)**, rounded up

Minutes per trip include loaded travel, empty travel back or to the next job, load and unload time, and waiting at doors or elevators. Availability covers charging and maintenance.

**Worked example.** An assembly area needs 48 tote transports per hour at peak. A trip averages 6.5 minutes (2.5 loaded travel, 2.0 empty travel, 1.5 load and unload, 0.5 waiting). Availability after charging is 85%.

- Workload = 48 × 6.5 = 312 vehicle-minutes per hour
- Capacity per vehicle = 60 × 0.85 = 51 minutes per hour
- Vehicles = 312 ÷ 51 = 6.1, rounded up to **7 AMRs**

Six vehicles would need 102% of their available time at peak. With seven, utilization is 87%. Compare the fleet's cost per move (purchase or subscription, fleet software, maintenance, integration) with the current cost per move before deciding. Two cautions apply:

1. **Traffic is non-linear.** With more vehicles in the same aisles, waiting time grows. The same queueing effect the pillar describes for machines (Kingman's formula) applies to aisles and charging stations. Validate fleets above a handful of vehicles with a discrete event simulation; the planned cluster on manufacturing simulation under the [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) pillar covers the method.
2. **Empty travel is the hidden variable.** Good dispatching (assigning the nearest free vehicle, combining jobs) reduces it; poor dispatching inflates it.

## 8. Safety and the people who move material

### 8.1 OSHA rules for powered industrial trucks

In the US, forklifts, tuggers and other powered industrial trucks fall under OSHA 29 CFR 1910.178 [2]. Key requirements for planners:

- **Training and evaluation.** The employer must ensure each operator is "competent to operate a powered industrial truck safely," completes training before driving (except under supervision during training), and is evaluated "at least once every three years." Refresher training is required after an accident or near miss, after unsafe operation is observed, when the operator is assigned a different type of truck, or when workplace conditions change [2]. The employer certifies training and evaluation [2].
- **Daily examination.** Trucks are examined before being placed in service, "at least daily," and after each shift when used around the clock. A truck with a condition that affects safety is taken out of service [2].
- **Clear aisles.** Fire aisles, access to stairways and fire equipment must be kept clear [2].

OSHA 29 CFR 1910.176 adds the general rules for material handling and storage: "sufficient safe clearances shall be allowed for aisles" where mechanical handling equipment is used, aisles must be "kept clear and in good repair," permanent aisles must be marked, and stored material must be "stacked, blocked, interlocked and limited in height so that they are stable and secure" [3].

A route change for a milk run is a **change in workplace conditions** in the sense of 1910.178: brief the drivers, update the route map and check whether refresher training is needed.

### 8.2 Mobile robots and mixed traffic

AMRs move among people. Safety depends on the robot (safety-rated scanners, speed limits near people), on the integration (speed zones, door interlocks, marked crossings) and on training for everyone in the area. R15.08 reflects this split: Part 1 addresses the robot, Part 2 the system and application [4]. Treat every new route or fleet expansion as a change that needs a risk assessment.

### 8.3 The operator's view

Material handlers and route drivers know where the route breaks down: the crossing that is always blocked, the rack nobody can reach without bending, the kanban card that gets lost. Include them in route design, time the route with them rather than on them, and treat their suggestions as part of the standard work. When automation such as AMRs changes job content, involve the workforce and, where there is one, the union early: about which tasks move to robots, how roles change and what training follows. Ergonomics belongs in the design as well: container weight, shelf height and cart push forces decide whether a route can be driven for a full shift.

## 9. IT and OT integration

Material flow needs three information flows:

| Information | Source | Consumer |
|---|---|---|
| What to build, in which sequence | ERP / APS schedule, MES dispatch list | Supermarket picking, sequencing, kitting |
| What was consumed | Kanban scan, backflush, MES confirmation | Replenishment, inventory records |
| Where material and vehicles are | WMS, fleet manager, RFID or barcode scans | Dispatching, line-side stock visibility |

In ISA-95 terms, these are Level 3 manufacturing operations management activities between the ERP at Level 4 and the control systems below; the parent pillar covers the levels in its Section 6. Two practical points:

- **Electronic kanban** replaces lost cards with scans, but it also needs the same discipline: one scan per empty container, at the right moment.
- **Fleet managers for AGVs and AMRs are OT systems.** They need network segmentation and access control like any other plant-floor system; see the planned pillar on [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/). Where vehicles from several vendors share one plant, a common interface between fleet manager and vehicles avoids one control system per brand; in Europe, the VDA 5050 interface specification, developed by VDA and VDMA for communication between mobile robots and a central master control system, is one such approach [7].

## 10. KPIs for in-plant logistics

| KPI | Definition | Why it matters |
|---|---|---|
| Line-side stockouts | Number of times a workstation waited for material, per shift | Direct measure of schedule disruption |
| Milk run on-time rate | Loops completed within the pitch ÷ total loops | Shows whether the route design has enough reserve |
| Route utilization | Route cycle ÷ pitch | Early warning before on-time drops |
| Load-distance | Loads × distance per day (Section 2) | Tracks layout and routing improvements |
| Inventory record accuracy at the line | Correct line-side quantities ÷ checked locations | Kanban and backflush discipline |
| Transport cost per move | Logistics labor and equipment cost ÷ moves | Basis for equipment decisions |
| Safety events | Near misses and incidents involving vehicles, per month | Leading indicator for traffic design |

More on KPI definitions in the [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) pillar.

## 11. Template: milk run design worksheet

| Step | Input or calculation | Value |
|---|---|---|
| 1. Pitch | Target interval in minutes (from consumption and line-side space) | |
| 2. Stops | Number of stops on the route | |
| 3. Route length | Feet, measured on the actual route | |
| 4. Average speed | Feet per minute, measured including crossings | |
| 5. Travel time | Step 3 ÷ step 4 | |
| 6. Time per stop | Measured, minutes | |
| 7. Containers per loop | Sum over stops of containers per pitch, at peak | |
| 8. Time per container | Measured, minutes | |
| 9. Supermarket loading | Measured, minutes | |
| 10. Route cycle | 5 + (2 × 6) + (7 × 8) + 9 | |
| 11. Utilization | Step 10 ÷ step 1 | |
| 12. Capacity check | Container positions on the train ≥ step 7 at peak | |
| 13. Kanban containers per part | Formula in Section 5 | |
| 14. Safety review | Crossings, pedestrian zones, aisle widths, driver briefing per OSHA 1910.178 | |

## 12. Common mistakes

1. **Designing the route on the average shift.** Consumption peaks with the product mix; check the peak hour.
2. **No reserve in the pitch.** A route at 90% or more of its pitch is late as soon as anything happens.
3. **Supermarket far from the line.** The largest flow should be the shortest (Section 2).
4. **Buying AMRs to fix a messy flow.** Robots automate the current routes and the current errors. Measure and simplify first.
5. **Ignoring empty travel in fleet sizing.** In the example it is almost a third of the trip time.
6. **Container quantities that do not match lots or consumption.** Partial containers create counting errors and extra moves.
7. **Treating route drivers as interchangeable.** The route is standard work; it needs training, timing with the driver and a way to report problems.
8. **Changing routes without a safety review.** A new crossing is a change in workplace conditions.

## 13. FAQ: intralogistics and milk runs

### What is intralogistics?

Intralogistics is the organization, control and execution of material flow inside a company's site: receiving, storage, supermarkets, line feeding, transport between operations and shipping. The term is common in Europe; in the US the same scope is usually called in-plant logistics, internal logistics or material handling.

### What are examples of intralogistics?

In a plant: unloading and putaway at receiving, a supermarket next to assembly, a tugger train that runs a milk run to the line on a fixed timetable, kitting and sequencing of parts, conveyors or AGVs between operations, AMRs that move totes, and staging for shipping. Typical technologies are forklifts, tugger trains, carts, conveyors, automated storage, AGVs and AMRs, coordinated by the WMS, MES or a fleet manager.

### What is the difference between intralogistics and logistics?

Logistics covers the entire flow of goods, including transport between suppliers, plants, warehouses and customers. Intralogistics is the part within one site, from the receiving dock to the shipping dock.

### What is a milk run in manufacturing?

A milk run is a fixed route with a fixed timetable on which a driver, usually with a tugger train, delivers full containers to the line and collects empty containers and kanban cards. The fixed interval (pitch) makes line-side stock small and predictable.

### How do you calculate a milk run cycle time?

Add travel time (route length ÷ speed), stop time (stops × time per stop), handling time (containers × time per container) and loading time in the supermarket. In the example, 7.6 + 4.0 + 10.0 + 6.0 = 27.6 minutes, which is 92% of a 30-minute pitch and therefore too tight.

### What is line feeding?

Line feeding is the delivery of parts from storage or a supermarket to the point of use at the line. The basic methods are line stocking (full pallets), kanban replenishment of small containers, kitting (all parts for one product in a kit) and sequencing (parts in the build order).

### What is the difference between an AGV and an AMR?

An AGV follows predefined paths such as magnetic tape, wires or reflector-based routes and stops when blocked. An AMR navigates with a map and sensors and can plan a way around obstacles. AMRs are easier to reroute; AGVs are more predictable on fixed, high-volume paths.

### Do forklift operators need OSHA certification?

OSHA 29 CFR 1910.178 requires the employer to train each powered industrial truck operator, evaluate their performance at least once every three years and certify that training and evaluation took place. The certification is issued by the employer, not by OSHA.

### How many AMRs do I need?

Start with trips per hour × average minutes per trip ÷ (60 × availability), rounded up. For 48 trips per hour at 6.5 minutes and 85% availability, the answer is 7. For larger fleets or crowded aisles, confirm the number with a simulation.

## 14. Conclusion

A schedule holds only if material reaches the line on time. The planning behind that is mostly arithmetic: a from-to chart to see where transport effort goes, a milk run cycle with enough reserve, kanban quantities that follow from the pitch, and a fleet size that includes empty travel and charging. The constraints are physical and human: aisle space, safe crossings, ergonomic containers and drivers who know the route.

Start by measuring the current flow and the line-side stockouts. Fix the layout where the largest flows travel farthest, put the most frequent deliveries on a timetable, and only then decide whether tuggers, carts or mobile robots should drive the routes. The schedule side, from finite capacity to order release, is in the parent guide on production scheduling and APS.

## Further reading on m365.fm

**Parent guide**

- [Production Scheduling Software and APS: The Complete Guide](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)

**Sibling clusters (planned)**

- [Lot Sizing in Manufacturing: EOQ, EPQ and Dynamic Methods](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) (planned)
- [Manufacturing Inventory Management: Safety Stock, ABC/XYZ and Inventory Accounting](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) (planned)

**Related pillars (planned)**

- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/) (planned)
- [S&OP, MRP and Production Planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [OT Cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)

**Entity pages**

[Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Takt Time](https://www.m365.fm/entity/takt-time/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about production planning and scheduling, lean manufacturing and the digital transformation of manufacturing.

**Note: The author works at iFAKT GmbH.**

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All online sources accessed November 20, 2026.

1. Boysen, Nils; Emde, Simon; Hoeck, Michael; Kauderer, Markus: Part logistics in the automotive industry: Decision problems, literature review and research agenda. European Journal of Operational Research 242 (2015) 1, pp. 107–120. DOI: 10.1016/j.ejor.2014.09.065. Record: https://ideas.repec.org/a/eee/ejores/v242y2015i1p107-120.html
2. OSHA: 29 CFR 1910.178, Powered industrial trucks. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178
3. OSHA: 29 CFR 1910.176, Handling materials – general. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176
4. ANSI/RIA R15.08-1-2020: Industrial Mobile Robots – Safety Requirements – Part 1: Requirements for the Industrial Mobile Robot. ANSI Webstore record (with related listing of Part 2: Requirements for IMR system(s) and IMR application(s)): https://webstore.ansi.org/standards/ria/ansiriar15082020
5. MHI: About MHI. https://www.mhi.org/about
6. A3 (Association for Advancing Automation): ANSI/A3 R15.08-2 Safety Standard for Industrial Mobile Robot Systems and Applications Now Available (news release, International Robot Safety Conference, October 2023). https://www.automate.org/robotics/news/ansi-a3-r15-08-2-safety-standard-for-industrial-mobile-robot-systems-and-applications-now-available/aph ; ANSI Webstore listing ANSI/A3 R15.08-2-2023: https://webstore.ansi.org/standards/ria/ansia3r15082023 (listing not opened)
7. VDA (German Association of the Automotive Industry): VDA 5050, interface for communication between AGVs and central master control systems (developed with VDMA, supported by KIT IFL; current version 3.0.0, March 2026). https://www.vda.de/en/topics/automotive-industry/vda-5050
8. ANSI/ITSDF B56.5-2024: Safety Standard for Driverless, Automatic Guided Industrial Vehicles and Automated Functions of Manned Industrial Vehicles. ANSI Webstore record. https://webstore.ansi.org/standards/ansi/ansiitsdfb562024
9. ISO 3691-4:2023: Industrial trucks – Safety requirements and verification – Part 4: Driverless industrial trucks and their systems (June 2023, current; replaces ISO 3691-4:2020). AFNOR Boutique record. https://www.boutique.afnor.org/en-gb/standard/iso-369142023/industrial-trucks-safety-requirements-and-verification-part-4-driverless-in/xs140360/346822
10. Gillis, Alexander S.: What is a lean water spider? TechTarget, April 9, 2025 (role definition; Japanese term mizusumashi). https://www.techtarget.com/searcherp/definition/Lean-water-spider

---

# Editorial notes

## URL and structure assumptions

- Cluster URL `https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/` per the nested scheme in the course expansion brief (assumption).

## Unverified items and points to check

1. SERP positions for the three queries not recorded (shared search budget exhausted); add two or three US pages to the competitive table.
2. ~~ANSI/ITSDF B56.5 and ISO 3691-4 designations and editions~~ closed in round 4: B56.5-2024 [8], ISO 3691-4:2023 [9].
3. ~~ANSI/RIA R15.08 Part 2 edition year~~ closed in round 4: ANSI/A3 R15.08-2-2023, developed by A3 [6].
4. ~~VDA 5050 as a vehicle interface specification~~ closed in round 4 [7].
5. 80 to 85% route utilization rule of thumb.
6. ~~Water spider (mizusumashi) definition~~ closed in round 4 via TechTarget [10]; the Lean Enterprise Institute lexicon itself was still not opened.
7. All worked examples are constructed illustrative numbers.

## Vendor-only claims

- None.

## iFAKT facts and disclosure

- iFAKT is not mentioned in the body. Author box carries "**Note: The author works at iFAKT GmbH.**" (FTC material-connection disclosure, no sponsorship label).

## Internal links

- Parent pillar in the subtitle and first paragraph, Sections 1 and 9, Conclusion, Further reading.
- Siblings: lot-sizing and manufacturing-inventory-management (first paragraph, Section 5).
- New pillars: kanban-pull-system (5), ot-cybersecurity-iec-62443 (9), sop-mrp-production-planning (Further reading); existing: value-stream-mapping (2), shop-floor-management (3), digital-twin-manufacturing (7), manufacturing-kpis (10).

## Cannibalization

- No existing pillar targets "intralogistics" or "milk run". Overlap risk with the planned kanban-pull-system pillar for "supermarket" and "kanban quantity": this cluster keeps kanban to the route-driven loop and links to the pillar for card systems.

## Recommended graphics

- From-to chart as a flow diagram with line thickness proportional to load-feet
- Milk run timeline bar: travel, stops, handling, loading against the 30-minute pitch (before and after option A)
- AGV vs AMR comparison graphic
- Kanban loop: line, route, supermarket, with the 3-container example

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/#article",
      "headline": "Intralogistics in Manufacturing: In-Plant Material Flow, Milk Runs and AMR Planning",
      "description": "Intralogistics in manufacturing with worked numbers: from-to chart, line feeding methods, milk run cycle design, AMR fleet sizing, OSHA and AMR standards.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/",
      "isPartOf": { "@type": "Article", "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/#article" },
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.m365.fm/entity/ifakt/" }
      },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "about": [
        { "@type": "Thing", "name": "Intralogistics" },
        { "@type": "Thing", "name": "Milk run" },
        { "@type": "Thing", "name": "Kanban", "sameAs": "https://www.m365.fm/entity/kanban/" }
      ],
      "keywords": "intralogistics, in-plant logistics, material handling, milk run, tugger train, line feeding, AGV vs AMR, AMR fleet sizing, OSHA 1910.178"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/#faq",
      "mainEntity": [
        { "@type": "Question", "name": "What is intralogistics?", "acceptedAnswer": { "@type": "Answer", "text": "Intralogistics is the organization, control and execution of material flow inside a company's site: receiving, storage, supermarkets, line feeding, transport between operations and shipping. The term is common in Europe; in the US the same scope is usually called in-plant logistics, internal logistics or material handling." } },
        { "@type": "Question", "name": "What are examples of intralogistics?", "acceptedAnswer": { "@type": "Answer", "text": "In a plant: unloading and putaway at receiving, a supermarket next to assembly, a tugger train that runs a milk run to the line on a fixed timetable, kitting and sequencing of parts, conveyors or AGVs between operations, AMRs that move totes, and staging for shipping. Typical technologies are forklifts, tugger trains, carts, conveyors, automated storage, AGVs and AMRs, coordinated by the WMS, MES or a fleet manager." } },
        { "@type": "Question", "name": "What is a milk run in manufacturing?", "acceptedAnswer": { "@type": "Answer", "text": "A milk run is a fixed route with a fixed timetable on which a driver, usually with a tugger train, delivers full containers to the line and collects empty containers and kanban cards. The fixed interval (pitch) makes line-side stock small and predictable." } },
        { "@type": "Question", "name": "Do forklift operators need OSHA certification?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA 29 CFR 1910.178 requires the employer to train each powered industrial truck operator, evaluate their performance at least once every three years and certify that training and evaluation took place. The certification is issued by the employer, not by OSHA." } },
        { "@type": "Question", "name": "How many AMRs do I need?", "acceptedAnswer": { "@type": "Answer", "text": "Start with trips per hour × average minutes per trip ÷ (60 × availability), rounded up. For 48 trips per hour at 6.5 minutes and 85% availability, the answer is 7. For larger fleets or crowded aisles, confirm the number with a simulation." } }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/en/learn/" },
        { "@type": "ListItem", "position": 2, "name": "Production Scheduling Software and APS", "item": "https://www.m365.fm/en/learn/production-scheduling-aps/" },
        { "@type": "ListItem", "position": 3, "name": "Intralogistics", "item": "https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/" }
      ]
    }
  ]
}
```

Note: five of nine FAQs are in the markup; add the remaining four the same way.

---

## Review log

New cluster article, written directly in US English, November 20, 2026. Nine-role expert panel per the course expansion brief, three full rounds. All worked examples recalculated by script (load-distance and both layout variants, milk run cycle and options A to C, train capacity, kanban containers, AMR fleet).

**Verified online for this article (November 20, 2026):** OSHA 29 CFR 1910.178 scope, (l) training, certification, three-year evaluation, refresher triggers, (m)(14) clear fire aisles, (q)(7) daily examination [2]; OSHA 29 CFR 1910.176(a) and (b) quotes [3]; ANSI Webstore record of ANSI/RIA R15.08-1-2020 with title and scope quote, plus the related Part 2 listing title [4]; MHI self-description [5]; Boysen, Emde, Hoeck, Kauderer 2015, EJOR 242(1) 107–120, DOI 10.1016/j.ejor.2014.09.065 [1]; competitor pages mecalux.com/blog/intralogistics, Wikipedia "Automated guided vehicle" (confirms the AGV/AMR navigation distinction; cites no safety standard) and Wikipedia "Milk run". ITSDF home page opened: it describes the B56 committee scope but does not name B56.5, so B56.5 stays [unverified].

### Round 1

| Role | Verdict | Findings |
|---|---|---|
| Practitioner (US plant manager) | changes needed | Option B in the milk run table has an unfinished formula; Option C is not calculated. 3 mph average including crossings is realistic. Peak-hour check is the right emphasis. |
| Academic (IE/OM professor) | changes needed | Fleet formula is a deterministic first cut; the queueing caveat is correct. "Poor dispatching can double empty travel" and "empty travel can be a third of trip time" are unsourced; tie them to the example. |
| IT/OT architect | changes needed | The ISA-95 sentence assigns "warehouse and transport execution" to Level 3 more precisely than anything verified for this article; keep it to the Level 3/Level 4 split the pillar verified. VDA 5050 and fleet manager segmentation are appropriate. |
| Quality lead | changes needed | Supermarket lanes must be FIFO where lot traceability or shelf life matters. |
| Finance (plant controller) | changes needed | AMR decision needs a cost-per-move comparison (capex or subscription, software, maintenance, integration) against today's cost per move. |
| Worker voice and lean coach | changes needed | Automation changes jobs: involve the workforce and the union, where there is one, before the AMR decision. |
| SEO specialist (US) | changes needed | The competitive analysis is empty because the shared search budget ran out; at minimum read pages that rank for the terms. FAQ heading should carry the keyword. Title 51 and description 154 characters are correct. |
| Fact checker | changes needed | (a) Boysen et al. now verified: remove the marker. (b) R15.08: designation "ANSI/A3" not confirmed; the verified record is ANSI/RIA R15.08-1-2020; Part 2 title confirmed, year not. (c) B56.5, ISO 3691-4, VDA 5050 not verified (sites failed or fetch limit): keep markers. (d) "per 200,000 hours worked" is unsourced in this article: drop it. (e) MHI full name not on its About page: quote its self-description instead. (f) Recalculated: load-distance 86,400 / 93,500 / 72,400; cycle 27.58 min = 91.9%; option A 23.6 min = 78.6%. |
| Critic | changes needed | The Conclusion opens with a slogan ("decides whether a good schedule survives contact with the shop floor"). Otherwise plain. |

### Debate (Round 1)

- **Publish without a SERP table? (SEO vs. Fact checker).** SEO argued that the brief requires a competitive analysis with fetched pages. The fact checker refused to invent positions or word counts. Resolution: three pages that typically rank were opened directly and counted; SERP positions are marked [unverified] and the editor is asked to re-run the searches before publication.
- **The 80 to 85% route utilization target (Practitioner vs. Fact checker).** The practitioner uses it daily; the fact checker found no source. Resolution: keep it as a labeled rule of thumb with [unverified] and the instruction to calibrate with own route data.
- **Standards naming (IT/OT vs. Fact checker).** IT/OT preferred the current "ANSI/A3" label; the fact checker only verified "ANSI/RIA R15.08-1-2020." Resolution: use the verified designation and note the RIA-to-A3 naming as [unverified].

### Changes after Round 1 (old -> new)

- Section 4.3 table, option B: "3.8 + 2.0 + 5.0 + 3.0 + (travel of a shorter loop) | well under 70%" -> "4.5 + 2.0 + 5.0 + 3.0 = 14.5 min | 48%" (routes of 1,200 ft each).
- Option C: "27.6 min (more containers per loop) | under 85% only if …" -> "7.6 + 4.0 + 13.3 + 8.0 = 32.9 min | 82% | Exceeds the 48 train positions (Section 4.4)"; follow-up paragraph rewritten for A, B and C.
- Section 3: "Boysen and co-authors classify … [unverified …]" -> "Boysen, Emde, Hoeck and Kauderer describe the process steps and decision problems of part logistics … in a 2015 review [1]"; source [1] completed with DOI.
- Section 6: "driverless industrial trucks under ANSI/ITSDF B56.5, and industrial mobile robots under ANSI/A3 R15.08 [unverified …]" -> verified R15.08-1-2020 title and scope quote [4], Part 2 title [4], B56.5 and ISO 3691-4 kept with [unverified]. Section 8.2 aligned ("Part 1 addresses the robot, Part 2 the system and application"). Key takeaway and competitive text "ANSI/A3" -> "ANSI/RIA".
- Section 1: "MHI (the Material Handling Institute) [unverified …]" -> quote of MHI's self-description [5].
- Section 5: added FIFO lane sentence for traceability and shelf life.
- Section 7: added cost-per-move comparison sentence; "Six vehicles would run at over 100%" -> "Six vehicles would need 102% of their available time".
- Section 7 and mistake 5: "poor dispatching can double it" -> "poor dispatching inflates it"; "It can be a third of the trip time" -> "In the example it is almost a third of the trip time."
- Section 8.3: added the sentence on involving the workforce and the union when automation changes job content.
- Section 9: ISA-95 sentence reduced to the verified Level 3/Level 4 split.
- Section 10: "per 200,000 hours worked" -> "per month".
- Conclusion: "Intralogistics decides whether a good schedule survives contact with the shop floor." -> "A schedule holds only if material reaches the line on time."
- Competitive analysis: empty table -> three fetched pages with word counts, strengths and gaps.

### Round 2

| Role | Verdict | Findings |
|---|---|---|
| Practitioner | satisfied | Options table now complete; option C failing the capacity check is a useful lesson. |
| Academic | satisfied | |
| IT/OT architect | satisfied | |
| Quality lead | satisfied | |
| Finance | satisfied | |
| Worker voice and lean coach | satisfied | |
| SEO specialist (US) | changes needed | FAQ heading with keyword and anchor. |
| Fact checker | satisfied with open items | Kanban example rechecked after an intermediate edit: at a 15-minute pitch, coverage is 0.25 h × 2 + 0.25 h = 0.75 h, 45 parts, 2 containers (an edit that had changed this to 0.5 h was reverted). Option figures recalculated (B 14.5 min = 48%; C 53.3 containers, 32.9 min = 82%). |
| Critic | satisfied | |

### Changes after Round 2 (old -> new)

- H2 "## 13. FAQ" -> "## 13. FAQ: intralogistics and milk runs"; TOC anchor updated.

### Round 3

| Role | Verdict |
|---|---|
| Practitioner | satisfied |
| Academic | satisfied |
| IT/OT architect | satisfied |
| Quality lead | satisfied |
| Finance | satisfied |
| Worker voice and lean coach | satisfied: operators and route drivers appear as designers of the route, not as resources |
| SEO specialist (US) | satisfied: "intralogistics" in title, H1, short answer, first paragraph and FAQ heading, US synonyms (in-plant logistics, material handling, milk run) in body and FAQ; parent pillar linked in the first 150 words and Further reading; both siblings and two new pillars (kanban-pull-system, ot-cybersecurity-iec-62443) plus value-stream-mapping, shop-floor-management, digital-twin-manufacturing and manufacturing-kpis linked in the body; SERP positions flagged for the editor |
| Fact checker | satisfied with the open items below |
| Critic | satisfied: no padding, no em-dash chains, no clichés; disclosure exact in the author box; no sponsorship label; iFAKT not mentioned in the body |

**Open [unverified] items for the editor (updated in round 4):** (1) SERP positions for "intralogistics", "milk run", "AGV vs AMR"; add two or three US pages to the competitive table. (2) closed: B56.5-2024 and ISO 3691-4:2023 [8][9]. (3) closed: ANSI/A3 R15.08-2-2023 [6]. (4) closed: VDA 5050 [7]. (5) 80 to 85% route utilization rule of thumb. (6) closed: water spider term sourced to TechTarget [10]; LEI lexicon still not opened.

### Consensus

All nine roles sign off after Round 3. The article is the only one among the pages read that calculates a milk run, a kanban loop and an AMR fleet and cites the OSHA and ANSI framework. Final word count H1 through Conclusion: **4,361 words** (`wc -w`, measured November 20, 2026).

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (WebSearch, WebFetch). All access dates November 20, 2026.

| # | Item | Old -> new |
|---|---|---|
| 1 | Section 6, R15.08 Part 2 year and A3 naming | "[4] [unverified: edition year of Part 2 not confirmed]. RIA is now part of A3, so newer documents carry the ANSI/A3 label [unverified]." -> "Part 2 was developed by A3 (Association for Advancing Automation) and released in 2023 as ANSI/A3 R15.08-2-2023 [6]." The broader claim "RIA is now part of A3" was dropped because only the Part 2 label was confirmed. |
| 2 | Section 6, B56.5 and ISO 3691-4 | "[unverified: designations and editions not confirmed online]" -> "ANSI/ITSDF B56.5-2024 [8] and ISO 3691-4:2023 [9]" (ANSI Webstore; AFNOR record: June 2023, replaces the 2020 edition) |
| 3 | Section 9, VDA 5050 | "[unverified]" -> described as the VDA/VDMA interface between mobile robots and a central master control system [7] (VDA page; current version 3.0.0, March 2026) |
| 4 | Section 3, water spider (mizusumashi) | sourced to TechTarget [10]; LEI lexicon not opened |
| 5 | 80 to 85% route utilization | still unverified: no source found; stays a labeled rule of thumb |
| 6 | SERP positions | still open: the search tool does not show google.com positions; editor to re-run before publication |

Body text changed; `wc -w` H1 through Conclusion is now 4,369 words (cluster range kept). Sources: 10.

- **Fact checker:** satisfied; all standards designations in Section 6 are now confirmed with editions.
- **Critic:** satisfied; additions are short and factual.
- **Subject expert (IT/OT architect):** satisfied; the "ANSI/A3" label debated in Round 1 is now verified for Part 2, and Part 1 keeps its verified ANSI/RIA designation.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** web (no NEURONwriter analysis exists for this keyword). US web searches for "intralogistics", "milk run logistics manufacturing" and "AGV vs AMR" on November 20; ranking pages opened on November 23, 2026 after the fetch quota reset. Search-tool order used as an approximation of the google.com SERP; no live PAA box available. SERP positions were not recorded before; they are now.

**SERP findings:** the main keyword is held by vendor definition pages (BEUMER approx. 750 words, BITO approx. 1,600, Siemens, Element Logic approx. 1,000, SSI Schäfer, Festo, STILL, Shopify approx. 1,800, Bosch Rexroth, KION), mostly warehouse-oriented. Milk run and AGV vs. AMR results are vendor and trade pages. None calculates anything or names OSHA or R15.08. Missing question: examples and technologies of intralogistics.

**Changes (old -> new):**
1. FAQ: 8 questions -> 9; new "What are examples of intralogistics?" (combines the "example" and "technologies" questions; content from sections 1 and 6, no new facts).
2. JSON-LD: the new question added to the FAQPage markup; note "four of eight" -> "five of nine".
3. Competitive analysis: added the SERP re-check with positions for all three queries; the "[unverified: SERP positions]" marker replaced with a resolved note.
4. Metadata: word count 4,369 -> 4,443.
Meta title, description and H1 unchanged: the warehouse-heavy SERP makes the manufacturing angle ("in-plant material flow", "milk runs") the differentiator, and it is already in all three.

**Sign-off:**
- **SEO specialist:** satisfied; positions now documented; the article answers the main SERP questions and adds the plant-specific layer no competitor has.
- **Critic:** satisfied; the new FAQ is concrete and plant-specific.
- **Fact checker:** satisfied; no new facts; equipment list matches the table in section 6.
- **Subject expert (logistics planner):** satisfied; the examples are typical of in-plant logistics.

**Word count after round 5:** 4,443 words (+74).
