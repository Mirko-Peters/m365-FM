# SEO metadata

| Field | Value |
|---|---|
| Meta title | Digital Twin in Manufacturing: The Complete Guide (49 characters) |
| Meta description | Digital twin in manufacturing explained: twin vs. shadow vs. simulation, factory simulation, virtual commissioning, AGVs, ISO 23247 and a roadmap. (146 characters) |
| Slug | `/en/learn/digital-twin-manufacturing/` (full URL: https://www.m365.fm/en/learn/digital-twin-manufacturing/) |
| Main keyword | digital twin in manufacturing |
| Secondary keywords | digital twin manufacturing, manufacturing digital twin, factory digital twin, production digital twin, digital twin vs simulation, digital shadow, digital model, digital thread, factory simulation, production simulation, material flow simulation, discrete event simulation, virtual commissioning, value stream simulation, factory layout planning, bottleneck analysis, capacity planning, AGV simulation, AMR fleet planning, Industry 4.0, smart factory, smart manufacturing, Asset Administration Shell, ISO 23247, ISO/IEC 30173, ISA-95, MTConnect, OPC UA, ERP, MES, PLM, product-process-resource model, Azure Digital Twins, DTDL, digital twin builder in Microsoft Fabric |
| Search intent | Mainly informational (definition, how it works, types, examples, getting started), with a commercial-investigation share (software categories, cost). The google.com top 10 for "digital twin in manufacturing" consists of explainer and vendor guide pages; no product or category pages rank in the top positions (own check, November 20, 2026). |
| Target word count | At least 9,000 words in the article. Longest English competitor found: blog.emb.global with about 4,800 words (estimate). Actual `wc -w` H1..Conclusion: 13,363 words. |
| Language version | `en-US`. hreflang pair: `en-US` https://www.m365.fm/en/learn/digital-twin-manufacturing/ <-> `de-DE` https://www.m365.fm/learn/digital-twin/ (plus `x-default` per site policy) |

# Competitive analysis (google.com SERP, November 2026)

Method: google.com searches with US intent for "digital twin in manufacturing", "digital twin manufacturing examples use cases" and "what is a manufacturing digital twin vs digital shadow vs simulation" (November 20, 2026). The eight most relevant English pages were opened in full. Word counts are estimates of the main body without navigation, footer, contact forms and related links. No NEURONwriter analysis was run for the English keyword; the German analyses [44][45] apply to the German version only.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| blog.emb.global/digital-twins-in-manufacturing | 4,800 | broad outline (concepts, technology, benefits, limits, cost-benefit, workforce, FAQ) | repetitive, market forecasts instead of plant decisions, no standards except GDPR/HIPAA, no simulation method, editing errors |
| simio.com/digital-twin-manufacturing-applications-benefits-and-industry-insights/ | 3,900 | discrete event and stochastic modeling, ERP/MES integration, implementation steps | vendor perspective throughout; market and Gartner figures partly mis-sourced; no ISO 23247, no definition of twin vs. shadow, no data-quality method |
| infor.com/industries/industrial-manufacturing/digital-twin-manufacturing | 2,500 | types, technologies, data and systems, getting-started pitfalls, 5 FAQ | no numbers, no sources, no standards, no simulation method |
| stxnext.com/blog/digital-twin-in-manufacturing | 2,400 | strong "visualization trap" angle, start small, problem first | no standards, no statistics, no methodology, no FAQ |
| unity.com/resources/digital-twins-in-manufacturing | 1,800 | four types, twin vs. simulation vs. BIM, cost section, 6 FAQ, McKinsey figures | 3D/visualization focus; a key figure comes from research commissioned by the vendor; no standards |
| matterport.com/learn/digital-twin/manufacturing | 1,800 | eight use cases, Deloitte 2025 survey figure | reality capture (3D scans) treated as the twin; no process logic, no simulation |
| autodesk.com/blogs/design-and-manufacturing/digital-twin-in-manufacturing/ | 1,750 | twin vs. simulation section, FlexSim (discrete event simulation) | no statistics, no standards, no data requirements |
| visualcomponents.com/blog/understanding-digital-twins-in-manufacturing | 1,400 | virtual commissioning, "simulation is the best starting point" | short, no sources apart from an image credit |

Also checked: converged.propelsoftware.com "complete guide" (about 1,750 words, five deployment levels, unsourced market figure).

**People also ask / FAQ topics found in the SERP:** What is a digital twin in manufacturing? What are the 4 types of digital twins? What is the difference between a digital twin and a simulation? Is a digital twin the same as BIM or a 3D model? How does a digital twin work? What data is needed to build a digital twin? How much does a digital twin cost? How accurate does a digital twin need to be? Do digital twins replace engineering judgment? What are examples of digital twins in manufacturing?

**How this article beats the competition:** None of the analyzed English pages connects the three layers that plant and operations leaders actually need: a precise distinction between model, shadow and twin (Kritzinger et al. [5], plus the US definitions of NIST, the National Academies and the Digital Twin Consortium [49][50][51]); the method of simulation with discrete event, continuous and agent-based modeling, including a worked queueing example [13][41][46]; and the data foundation from ERP, MES and the value stream. None of them cites ISO 23247, which NIST actively supports with use-case guidance and reference implementations [6][7][8][47][48]. This guide adds the standards landscape (ISO 23247 including Parts 5 and 6 from 2026, ISO/IEC 30173, IEC 63278-1, ISA-95, ISA/IEC 62443, ANSI/ITSDF B56.5 and ANSI/A3 R15.08 for AGVs and mobile robots, plus the German VDI guidelines that shaped factory simulation), the current status of the Microsoft services (Azure Digital Twins, DTDL v3, digital twin builder in Fabric as a preview) [21][22][23], a use-case table with data requirements, a six-phase roadmap, a data-quality checklist and an honest cost-benefit view with sourced figures only.

---

# Digital Twin in Manufacturing: The Complete Guide to Factory Simulation, Material Flow and Virtual Commissioning

*Last updated: November 20, 2026 · Technically reviewed against the standards, primary sources and publications listed under Sources*

> **Short answer:** A digital twin in manufacturing is an executable digital representation of a factory's products, processes and resources that is updated with data from real operations, ideally automatically. You use it to simulate operations, assess bottlenecks and scenarios in advance, commission control software virtually and make decisions before you change anything on the real shop floor.

The term "digital twin" is used so loosely that it has almost stopped meaning anything. A 3D model of a building is called a digital twin. So is a dashboard of machine data, and sometimes a capacity spreadsheet with red, yellow and green cells. For plant and operations leaders that is a real problem: if you do not know exactly what you want to build, you buy the wrong thing, collect data without a question to answer and end up a year later with an expensive visualization project that does not improve a single decision.

This guide clears up the terminology and walks you through every layer: from the origin of the concept with Michael Grieves and NASA, through the standards (ISO 23247, ISA-95, the Asset Administration Shell, and the German VDI guidelines on simulation and virtual commissioning that much of the industry still works from), to the practical question of how to derive a useful production twin from the data that already sits in your ERP system. The focus is on what manufacturing teams actually decide: factory and layout planning, capacity and bottlenecks, product mix, schedule quality, virtual commissioning and the sizing of automated guided vehicle (AGV) fleets. For a compact definition, see the entity page [Digital Twin](https://www.m365.fm/entity/digital-twin/).

### Key takeaways

- A **digital twin** differs from a digital model and a digital shadow by its **automatic data flow in both directions** [5]. In factory planning, many productive solutions deliberately work as a model or a shadow, and that is not a flaw.
- The core of a production twin is a **product-process-resource (PPR) model**: what is made (bill of materials), how (routing, times, sequences) and with what (machines, people, floor space, material handling). Most of this data already lives in your **ERP system**.
- **Simulation** turns the model into a decision tool. In manufacturing and logistics, **discrete event simulation** dominates; the classic methodological reference is the German guideline VDI 3633 [13], and the standard US textbook is Law's *Simulation Modeling and Analysis* [41].
- The key standards are **ISO 23247** (digital twin framework for manufacturing, Parts 1 to 4 from 2021, Parts 5 and 6 from 2026) [6][7][8], **IEC 63278-1** (Asset Administration Shell) [10] and **ISA-95 / IEC 62264** (enterprise-control integration) [58]. NIST supports ISO 23247 with use-case guidance and reference implementations for US manufacturers [47][48].
- Start with **one concrete decision**, not with a platform. A twin without a question becomes a data graveyard.
- **Data quality** decides success or failure: standard times, setup times, shift calendars and downtime records are often less accurate than the master data suggests.
- At Microsoft, **Azure Digital Twins** is a generally available PaaS service supporting DTDL v2 and v3 [21][22]; **digital twin builder in Microsoft Fabric** is still labeled a **preview** as of this writing [23].

### Reading paths for busy readers

| You are a ... | Read first |
|---|---|
| Manufacturing engineer or factory planner | Sections 2, 6, 7 and 10 (definitions, simulation, use cases, roadmap) |
| Plant manager, VP of operations, executive | Short answer, sections 4, 12 and 13 (maturity, cost and benefit, common mistakes) |
| Controls or automation engineer | Section 7.5 (virtual commissioning) and 14 (standards) |
| Intralogistics, AGV/AMR project lead | Section 7.6 (AGV and AMR fleet planning) |
| M365/Azure admin, IT/OT architect | Sections 5, 8 and 16 (architecture, Microsoft services, security) |

## Table of contents

1. [What is a digital twin in manufacturing?](#1-what-is-a-digital-twin-in-manufacturing)
2. [Digital model vs. digital shadow vs. digital twin](#2-digital-model-vs-digital-shadow-vs-digital-twin)
3. [Types of digital twins in manufacturing](#3-types-of-digital-twins-in-manufacturing)
4. [Maturity levels: from representation to self-optimizing system](#4-maturity-levels-from-representation-to-self-optimizing-system)
5. [Architecture and data foundation: ERP, MES, PLM, IoT](#5-architecture-and-data-foundation-erp-mes-plm-iot)
6. [Simulation at the core: factory, material flow and value stream simulation](#6-simulation-at-the-core-factory-material-flow-and-value-stream-simulation)
7. [Use cases and the data each one needs](#7-use-cases-and-the-data-each-one-needs)
8. [Digital twins with Microsoft Azure and Fabric](#8-digital-twins-with-microsoft-azure-and-fabric)
9. [Artificial intelligence and the digital twin](#9-artificial-intelligence-and-the-digital-twin)
10. [Roadmap: implementation in six phases](#10-roadmap-implementation-in-six-phases)
11. [Data quality: the underrated prerequisite](#11-data-quality-the-underrated-prerequisite)
12. [Cost and benefit, assessed honestly](#12-cost-and-benefit-assessed-honestly)
13. [Common mistakes and how to avoid them](#13-common-mistakes-and-how-to-avoid-them)
14. [Standards and guidelines at a glance](#14-standards-and-guidelines-at-a-glance)
15. [Software categories: a neutral comparison](#15-software-categories-a-neutral-comparison)
16. [Security, data ownership and regulation](#16-security-data-ownership-and-regulation)
17. [Building a twin from ERP and value stream data with iFAKT Polaris](#17-building-a-twin-from-erp-and-value-stream-data-with-ifakt-polaris)
18. [Glossary](#18-glossary)
19. [FAQ: digital twins in manufacturing](#19-faq-digital-twins-in-manufacturing)
20. [Conclusion](#20-conclusion)

## 1. What is a digital twin in manufacturing?

### A working definition

In manufacturing practice, a working definition with three conditions has proven useful:

1. **It represents a real counterpart.** The twin stands for a specific object (a machine, a line, a plant) or a specific process, not a generic class.
2. **It is executable.** It holds not only structure and geometry but also behavior. It can advance states, play through operations and answer "what happens if ...?" questions.
3. **It is connected to reality by data.** It is updated from operating data, ideally automatically, and its results flow back into decisions or controls.

Without point 2, you have a database or a 3D model. Without point 3, you have a simulation model. Both are useful, but neither is a twin in the narrow sense.

US institutions define the term along the same lines. The Digital Twin Consortium's definition from December 3, 2020 calls a digital twin "a virtual representation of real-world entities and processes, synchronized at a specified frequency and fidelity" [51]. The 2024 consensus report of the National Academies of Sciences, Engineering, and Medicine, sponsored by the US Department of Defense, the Department of Energy, the National Institutes of Health and the National Science Foundation, describes a digital twin as a set of virtual information constructs that mimics the structure, context and behavior of a system, "is dynamically updated with data from its physical twin, has a predictive capability, and informs decisions that realize value," and adds: "The bidirectional interaction between the virtual and the physical is central to the digital twin" [50]. NIST describes digital twins as electronic representations of real-world entities that let people observe those entities and their state changes, and examines the security and trust issues they raise [49]. All three definitions contain the same elements as the working definition above: a real counterpart, behavior and a data connection.

### Digital twin, smart factory, digital factory: terms sorted out

In English, you will see "digital twin in manufacturing", "manufacturing digital twin", "factory digital twin" and "production digital twin" used for the same concept. The **smart factory** (or smart manufacturing) is something else: a connected, largely self-organizing plant as the target picture of Industry 4.0. The digital twin is one of its tools, not a synonym. The **digital factory** is an older, planning-oriented umbrella term from the German guideline VDI 4499 for digital models, methods and tools (see below); in North America the closest everyday terms are "digital manufacturing" and "virtual manufacturing". Terms such as production simulation, factory simulation and material flow simulation describe methods a digital twin can use. **Digital thread** describes the connected flow of information across the lifecycle; ISO 23247-5 now addresses it explicitly [7].

### Origins: from Grieves and NASA to Industry 4.0

The concept comes from product lifecycle management (PLM). Michael Grieves presented a model in 2002 that linked a real space, a virtual space and the flow of data and information between them. He dates the first presentation to a management forum of the Society of Manufacturing Engineers (SME) in October 2002 and a presentation at the University of Michigan in December 2002 [2]. The model was first called the "Mirrored Spaces Model" (2005), then the "Information Mirroring Model" (2006) and later "Digital Twin"; according to Grieves, the concept itself stayed the same [2]. Grieves credits the name "digital twin" to John Vickers of NASA [1][2]. Other authors point out that the origin story cannot be documented without gaps and that there were earlier precursors, such as research on virtual manufacturing in the 1990s [4].

The term gained wide attention through aerospace. NASA described the digital twin in its technology roadmap "Modeling, Simulation, Information Technology & Processing" (Shafto et al., draft 2010) [4]. In 2012, Glaessgen and Stargel formulated the often-quoted definition for NASA and the US Air Force of a digital twin as an "integrated multiphysics, multiscale, probabilistic simulation of an as-built vehicle or system" that combines ultra-high-fidelity simulation with health monitoring, maintenance history and fleet data to mirror the life of its flying twin [3].

In German manufacturing, the term became tied to Industrie 4.0 from the mid-2010s. There it met an older, independent tradition: the **Digital Factory** (VDI 4499) and **discrete event simulation of material flow** (VDI 3633). In the US, factory simulation grew from operations research and industrial engineering, with textbooks such as Law's [41] and commercial discrete event tools. On both sides of the Atlantic, many tools marketed today as digital twins are methodologically descendants of this factory simulation. For more context, see the entity page [Industry 4.0](https://www.m365.fm/entity/industry-4-0/).

### Formal definitions in standards

Formal standards have existed since 2021. **ISO 23247** ("Automation systems and integration: Digital twin framework for manufacturing") defines a framework for digital twins in manufacturing. Parts 1 to 4 (overview, reference architecture, digital representation of manufacturing elements, information exchange) were published in October 2021 (Part 1 on October 21, 2021) [6]. Part 5 ("Digital thread for digital twin") and Part 6 ("Digital twin composition", published July 14, 2026) followed in 2026 [7][8]. **ISO/IEC 30173:2023** sets cross-industry terms and concepts, including lifecycle processes, types of digital twins, a functional view and stakeholders [9].

For US manufacturers, NIST offers a practical entry point into ISO 23247. Its report *Use Case Scenarios for Digital Twin Implementation Based on ISO 23247* (NIST AMS 400-2, Guodong Shao, May 2021) was written explicitly to reduce the confusion about digital twins among small and mid-sized manufacturers and walks through three use cases built on the framework [47]. NIST's ongoing project "Digital Twins for Advanced Manufacturing" contributes to ISO 23247, works on a reference implementation of Part 5 (digital thread) and proposes a verification, validation and uncertainty quantification (VVUQ) framework as a future Part 7; it names the "lack of standards" as a main barrier to adoption [48].

For factory planning, the German definition of the Digital Factory in VDI 4499 Part 1 remains influential. The 2008 edition reads (our translation): "The Digital Factory is the generic term for a comprehensive network of digital models, methods and tools, including simulation and three-dimensional visualization, that are integrated by continuous data management. Its aim is the holistic planning, evaluation and ongoing improvement of all essential structures, processes and resources of the real factory in conjunction with the product." [17] A new edition of VDI 4499 Part 1 appeared in April 2026, covering the term, objectives, processes, data management and system architecture of the Digital Factory [16]. If you quote it, check whether the wording of the new edition differs.

Note the phrase "structures, processes and resources ... in conjunction with the product". It already contains the product-process-resource thinking that a production twin is built on (see section 5, "The product-process-resource model at the core").

## 2. Digital model vs. digital shadow vs. digital twin

The most-cited distinction for manufacturing comes from Kritzinger, Karner, Traar, Henjes and Sihn (Fraunhofer Austria) in 2018 [5]. They distinguish three levels of integration based on how data flows between the physical and the digital object.

| Attribute | Digital model | Digital shadow | Digital twin |
|---|---|---|---|
| Data flow physical → digital | manual | automatic | automatic |
| Data flow digital → physical | manual | manual | automatic |
| Typical example | simulation model of a planned line, CAD layout | simulation model updated daily with orders and confirmations from ERP/MES | model that automatically sends production sequences or parameters back to the control system |
| State of the physical object | does not have to exist | exists, is observed | exists, is observed and influenced |
| Typical use | factory planning, greenfield, capital investment decision | monitoring, as-is analysis, forecasting, schedule validation | closed-loop control, detailed scheduling, autonomous optimization |
| Demands on IT and governance | low | medium (interfaces, data quality) | high (real time, security, approval processes) |

In their literature review, Kritzinger et al. found that publications on the highest level, the true twin, were rare, while models and shadows were described far more often [5]. That matches practice: in factory and production planning, an automatic feedback loop into the controls is often not even wanted. A planner wants to compare scenarios and then decide deliberately. A model that changes your production sequence without approval would be unacceptable in many plants, both organizationally and in terms of liability.

The consequence for your project: do not ask "Do we have a real twin?" Ask "What level of integration does the decision we want to improve require?" For a capital decision on a new assembly building, a well-validated model is enough. For a daily check of whether this week's schedule is realistic, you need a shadow with automatic data feeds. Only for closed-loop control, such as automatic sequencing at a bottleneck station, does the effort of a full twin pay off.

**A second look at the "shadow":** In German production engineering, "digital shadow" is sometimes used more narrowly, as a sufficiently accurate, task-specific image of production data without simulation capability. Some vendors also describe the shadow as a "static copy of historical data". These readings differ from Kritzinger et al. US sources rarely use the term "digital shadow" at all and often call every level a twin. If you use any of these terms in a request for proposal (RFP) or a requirements document, define them explicitly.

## 3. Types of digital twins in manufacturing

Digital twins can be classified by the object they represent and by lifecycle phase. The classification below is common in the literature and in practice but not standardized; ISO/IEC 30173 describes types of digital twins at a more general level [9]. US explainers often use a four-level scheme of component (or part) twins, asset twins, system (or unit) twins and process twins, popularized by IBM [52]. The table below is more specific to manufacturing.

| Type | Represents | Typical questions | Main data sources |
|---|---|---|---|
| Product twin | a product over its lifecycle (geometry, variants, properties, condition in the field) | Does the design meet the requirements? How does the product behave in use? | CAD, PLM, analysis (FEA, CFD), field data |
| Process twin | a manufacturing process (milling, welding, injection molding, assembly) | Which parameters deliver stable quality? Where do scrap and rework arise? | machine controls, sensors, quality data, process models |
| Machine or asset twin | a machine or piece of equipment with kinematics, control logic and condition | Does the PLC logic work? When is maintenance due? | mechanical CAD, electrical CAD, PLC program, condition data |
| Production or factory twin | the interaction of orders, processes, resources, material flow and logistics | Is there enough capacity? Where is the bottleneck? Which layout, which buffer, how many AGVs? | ERP, MES, value stream data, layout, shift patterns |
| Performance or operations twin | ongoing performance metrics of a system | How are OEE, lead time, on-time delivery and energy use trending? | MES, production data collection, energy meters, IoT |
| Supply chain twin | suppliers, sites, transportation, inventory | What happens if a supplier fails? Where should we hold safety stock? | ERP, SCM, logistics data |

The types are not sharply separated; they nest. A factory twin can embed a more detailed asset twin for a single bottleneck machine. Composition of several twins is exactly what the new Part 6 of ISO 23247 covers [8].

**Lifecycle phases:** Many authors also distinguish the twin "as designed" (planning state), "as built" (actually built) and "as operated" or "as maintained" (in operation). This matters for factory planning: a planning model describes a plant that does not exist yet, so it must not be confused with operating data that cannot exist yet.

**Levels of detail:** In discrete event simulation, you also distinguish levels of aggregation, from the network and plant level through area, line and cell down to the single machine. VDI 3633 covers machine-level simulation with 3D motion and process simulation in a separate part [13]. The skill is to choose the level as coarse as possible and as fine as necessary.

## 4. Maturity levels: from representation to self-optimizing system

Maturity models help you assess your starting point and set realistic goals. In German-speaking countries, the **acatech Industrie 4.0 Maturity Index** is widely used (acatech is the German National Academy of Science and Engineering). It describes six development stages and assesses resources, information systems, culture and organizational structure; the updated edition appeared in 2020 [20]. The stages are computerization, connectivity, visibility, transparency, predictive capacity and adaptability.

For the digital twin, this translates into a practical scale:

| Level | Guiding question | What the twin delivers | Prerequisite |
|---|---|---|---|
| 1 Represent | What do we have? | structured model of products, processes, resources (master data, layout) | maintained master data, consistent naming |
| 2 Observe | What is happening? | current state from confirmations, machine data, inventory (visibility) | interfaces to ERP/MES, timestamps |
| 3 Understand | Why is it happening? | root-cause analysis, bottleneck identification, variance analysis (transparency) | historized data, metric definitions |
| 4 Predict | What will happen? | simulation and forecasting of lead time, utilization, due dates | validated simulation model, planning data |
| 5 Recommend | What should we do? | scenario comparison, optimization, recommended actions | objective function, optimization methods |
| 6 Act | What happens automatically? | closed loop into control (adaptability) | approval concept, IT security, clear accountability |

In consulting and vendor material, you will often see a shorter three-way split into descriptive, predictive and prescriptive twins. It corresponds roughly to levels 2 to 3, 4 and 5 to 6 in the table.

**Important:** The levels are not a mandatory sequence. A factory planning twin can be very valuable at level 4 without ever reaching level 2, because the planned plant does not exist yet. Conversely, a monitoring dashboard at level 2 is not a stepping stone to simulation if its data model contains no process logic. Plan the levels along your question, not along a model.

## 5. Architecture and data foundation: ERP, MES, PLM, IoT

### The ISO 23247 reference model

ISO 23247-2 organizes a manufacturing digital twin into domains [6][43]:

- **Observable manufacturing elements:** personnel, equipment, material, manufacturing processes, facilities, environment, products and supporting documents [6]. They sit outside the twin but are represented by it.
- **Device communication:** data collection and device control, such as controller connectivity, sensors and gateways.
- **Digital twin (core):** representation, synchronization, applications and services such as simulation, analytics and schedule validation.
- **User:** people and applications that use the twin, such as planner workstations or enterprise systems like ERP and MES.
- **Cross-system functions:** data translation, data assurance and security.

This model is vendor-neutral and works well as the outline of a requirements document or RFP. NIST used exactly this structure for its three ISO 23247 use-case scenarios [47]. Above all, it makes one point clear: the twin is not the visualization. It is the layer in between that represents, synchronizes and computes.

### Systems by ISA-95 level: who supplies which data?

The ISA-95 standard (ANSI/ISA-95, internationally IEC 62264) organizes a plant's systems into levels based on the Purdue model [58][19][42]: level 0 is the physical process, level 1 sensing and actuation, level 2 process control (PLC, SCADA, HMI), level 3 manufacturing operations management (MES) and level 4 business planning and logistics (ERP). ISA notes that the standard primarily deals with the interface between levels 3 and 4 [58]. For the digital twin, this gives you a clear data map:

| System (level) | Supplies to the twin | Typical granularity | Typical weaknesses |
|---|---|---|---|
| ERP (4) | material master, bills of materials, routings, work centers, capacities, shift calendars, sales and production orders, confirmations | order, operation, day/shift | standard times outdated, setup times flat, work center groups too coarse |
| MES (3) | actual times, downtime reasons, quantities, scrap, labor assignment, sequences | operation, minute | inconsistent downtime reason codes, gaps in manual entries |
| PLM/CAD | product structure (EBOM), geometry, variants, revision levels | part, version | EBOM and manufacturing BOM (MBOM) out of sync |
| Layout/factory CAD | floor space, aisles, positions, conveyors | foot/meter | layouts outdated, brownfield often undocumented |
| PLC/SCADA (2) | states, cycle times, signals | millisecond to second | little meaning without context (which order?) |
| IoT/sensors (1) | energy, temperature, vibration, position (e.g., AGVs) | second | high data volume, missing asset mapping |
| Warehouse/intralogistics (WMS, AGV fleet manager) | inventory, transport orders, travel times | order, second | travel times often not historized |

For a production and factory twin, most of the structure you need sits at levels 3 and 4. Machine data from levels 1 and 2 improves distributions and downtime models but is rarely the starting point. If you do connect machines, two open standards matter most: OPC UA (IEC 62541) and, common in US machine shops, **MTConnect**, an open standard for manufacturing data interoperability that is also published as an ANSI standard (ANSI/MTC1.4-2018) [57]. NIST lists an MTConnect interface for digital twins among its project work [48]. The post [From ERP to the shop floor: the digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/) shows what that bridge from ERP to the shop floor looks like in practice. For ERP basics, see the entity page [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/).

### The product-process-resource model at the core

In digital factory practice, the **product-process-resource (PPR) model** has become the structuring principle. It links three views:

- **Product:** What is made? End items, assemblies, parts and their relationships (bill of materials, variants).
- **Process:** How is it made? Operations, sequences, predecessor-successor relationships, times (setup, run, handling), lot sizes.
- **Resource:** What is it made with? Machines, work centers, people with skills, tooling, floor space, material handling equipment, shift patterns.

The value lies in the **edges** between the nodes: which operation consumes which assembly, on which resource, with what time, under which constraint? Model this network as a graph, and you can automatically derive network diagrams, critical paths, bottleneck resources and simulation models from it. Such a graph is also the semantic foundation on which planning algorithms and AI services can work.

The advantage over a pure 3D or IoT twin is practical: the PPR model answers the questions that production and factory planners ask every day (capacity, lead time, bottleneck, labor requirements), and much of it can be built from data that already exists.

### Building the twin from ERP and value stream data

The usual digital twin story starts with sensors. For production questions, that is often the wrong place to start. Your ERP system already contains the blueprint of your plant in structured form:

| ERP object | Role in the twin |
|---|---|
| Material master and bill of materials (manufacturing BOM, MBOM) | product structure, requirements explosion, assembly sequence |
| Routing with operations | process logic, sequence, standard times for setup and run |
| Work center or work center group | resources, available capacity, cost center |
| Factory calendar and shift patterns | available time, breaks, extra shifts |
| Sales orders and forecasts | load, product mix, due dates |
| Production orders and confirmations | actual times, actual quantities, scrap, progress |
| Inventory and MRP parameters | buffers, safety stock, lot-sizing rules |

**Value stream mapping** provides the second, complementary view: it makes material and information flows, inventory between processes and the control logic (push, pull, supermarket, FIFO) visible, which ERP tables contain only indirectly. Mike Rother and John Shook popularized the method in 1998 with *Learning to See*, published by the Lean Enterprise Institute [40]. Combine value stream logic with ERP master data and confirmations, and you get a model that captures both the structure and the dynamics of a production system. The episode [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) shows how a value stream map becomes a living data model; the method itself is explained on the entity page [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/), and in depth in our guide to [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned).

This discussion is not new in the literature. As early as 2014, Türck, Weimer, Schubert and Drees described in the German journal *Zeitschrift für wirtschaftlichen Fabrikbetrieb* (ZWF) the step from static value stream mapping and its metrics to dynamic simulation of value streams, and asked which optimization options open up once time is added as a dimension [31]. In 2023, Böhm, Drees, Sai, Erlach, Stambera and Teriete presented in ZWF a universal data interface for digital value stream services that uses event-based production data as a common basis for metric calculation and visualization; it was tested in the German research project ECOWERT [32].

### Semantics and interoperability: Asset Administration Shell, OPC UA, DTDL

A twin that lives only in a proprietary database is hard to extend. Three standards shape interoperability:

- **Asset Administration Shell (AAS):** The concept of Germany's Plattform Industrie 4.0 for a standardized digital representation of an asset. IEC 63278-1:2023 (published December 14, 2023) defines its structure and aims to let software applications exchange information in a uniform and secure way; it applies to physical, digital and intangible assets across the entire lifecycle [10]. Content is organized in submodels, for example for technical data or operating data. The German Reference Architecture Model Industrie 4.0 (RAMI 4.0, DIN SPEC 91345:2016) describes the structure and behavior of the Industrie 4.0 component that represents an asset virtually [12]; in the Plattform Industrie 4.0 concept, the AAS is the digital part of that component. Its further development is driven by the **Industrial Digital Twin Association (IDTA)**, founded on September 24, 2020 by the German engineering and electrical industry associations VDMA and ZVEI together with Bitkom and 20 companies [11]. An open-source implementation is Eclipse BaSyx, advanced among others by Fraunhofer IESE [29].
- **OPC UA (IEC 62541):** The widely used standard for vendor-independent machine communication with information models. For the twin, OPC UA matters mostly at levels 1 to 3.
- **DTDL (Digital Twins Definition Language):** Microsoft's JSON-based modeling language for Azure Digital Twins. Azure Digital Twins supports DTDL v2 and v3; Microsoft recommends v3 [22].

None of these standards alone is enough for production planning twins, because they mainly describe assets, not process logic and order dynamics. In practice, you therefore combine a planning model (PPR, simulation) with standardized asset descriptions for connectivity.

## 6. Simulation at the core: factory, material flow and value stream simulation

### What simulation does and why static calculations fall short

VDI 3633 Part 1 (December 2014 edition), the German reference guideline, describes the fundamentals of simulating logistics, material flow and production systems and addresses planners, suppliers and operators [13]. It defines simulation as reproducing a system with its dynamic processes in a model you can experiment with, in order to gain insights that can be transferred to reality [13][30]. Law's textbook, widely used in US industrial engineering programs, covers the same ground from the statistical side [41].

The decisive point is **dynamics**. A spreadsheet capacity calculation works with averages: demand times processing time, divided by available time, gives utilization. If every value is below 100 percent, the plan seems to work. In reality, arrivals, processing times, setup times and breakdowns vary. Queueing theory shows that with variable times, waiting times grow disproportionately as utilization rises, and large queues build up in front of a station that runs close to its capacity limit. Interactions between stations (blocking, starving, shared resources such as operators or cranes) cannot be captured by a static calculation at all.

**Worked example:** For a single station, Kingman's approximation gives a sense of scale [46]. The average waiting time in front of the station is approximately W ≈ (cₐ² + cₛ²) / 2 · u / (1 − u) · t, where u is utilization, t is the mean processing time and cₐ and cₛ are the coefficients of variation of interarrival and processing times. Assume a processing time of 10 minutes and moderate variability (both coefficients of variation equal to 1):

| Utilization u | Factor u / (1 − u) | Average wait in front of the station |
|---|---|---|
| 70% | 2.3 | approx. 23 minutes |
| 80% | 4 | approx. 40 minutes |
| 90% | 9 | approx. 90 minutes |
| 95% | 19 | approx. 190 minutes |

The capacity spreadsheet says "fits" in all four cases. In fact, the waiting time almost quintuples between 80 and 95 percent utilization. In a line with several stations, setups and breakdowns, the effect becomes even stronger and hard to handle analytically. This is where simulation comes in.

**Little's Law** remains a useful sanity check: in steady state, the average inventory in a system equals the average throughput rate times the average lead time (L = λ · W) [37]. Little's Law tells you which lead time matches a given inventory, but not which inventory will result from a given level of variability. For that, you need simulation.

### Types of simulation compared

| Attribute | Discrete event simulation (DES) | Continuous simulation / system dynamics | Agent-based simulation (ABS) | Physics and 3D motion simulation |
|---|---|---|---|---|
| Time advance | jumps from event to event (arrival, end of processing, breakdown) | continuous in small time steps, differential equations | event- or time-step-driven, depending on the tool | fine time steps, kinematics and dynamics |
| Model elements | sources, sinks, stations, buffers, conveyors, resources, orders | stocks, flows, feedback loops | autonomous agents with rules and states (vehicles, people, orders) | rigid bodies, joints, sensors, control signals |
| Typical questions | throughput, lead time, utilization, bottleneck, buffer sizes, labor requirements | strategic capacity and market development, bullwhip effect | AGV traffic, pedestrian flows, decentralized control, negotiation logic | reachability, collision, cycle time of a robot cell, control testing |
| Level of detail | line to plant | plant to network, highly aggregated | local to network | cell, machine |
| Strengths | established, easy to validate, randomness built in | fast, good for feedback and long horizons | emergent behavior, individual rules | realistic geometry and physics |
| Limits | geometry usually simplified | no individual orders | parameterization and validation demanding | compute-intensive, small slice of the system |
| Reference | VDI 3633 [13], Law [41] | Forrester, *Industrial Dynamics* (MIT) [38] | no dedicated VDI guideline known [unverified] | VDI 3633 Part 8 (machine-level simulation) [13], VDI/VDE 3693 [14] |

In production and factory simulation, **discrete event simulation** dominates. Many modern tools combine paradigms, such as discrete event production with agent-based vehicles or a continuous energy model. Law's textbook describes the methodological fundamentals of discrete event simulation in detail, from random numbers and input distributions to statistical analysis [41].

### Material flow simulation and factory simulation

The terms are often used interchangeably but have different emphases:

- **Material flow simulation** traces the path of material and orders through production and logistics: conveyors, buffers, storage, material handling, picking. Guiding questions: Is the conveyor system sufficient? How big do buffers need to be? Where does material back up?
- **Factory simulation** looks at the plant as a whole: product mix, capacities, shift patterns, labor, layout, logistics and control rules. Guiding questions: Can the plant handle the volume? Which layout is robust? What does a third shift cost compared with an additional machine?
- **Production simulation** is often used as the umbrella term for both.

For more on factory simulation, see the entity page [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Value stream simulation: dynamic value stream mapping

Classic value stream mapping is a snapshot based on averages. It shows inventory, lead times and flow on a given day, but not how the value stream behaves when the product mix changes, breakdowns occur or lot sizes change. Value stream simulation closes this gap by treating the value stream map as an executable model. The 2014 ZWF publication mentioned above describes exactly this step from static metrics to a dynamic view over time [31].

The practical advantage: the value stream map is familiar and accepted in the company. If you derive a simulation model from it, operations teams do not have to learn a new modeling world. The limits are very complex material flows with conveyors and warehouse logic, which call for classic material flow simulation.

### How a simulation study runs

VDI 3633 describes the preparation, execution and evaluation of simulation studies [13]. The following sequence has proven itself:

1. **Objective:** Which decision are you preparing? Which metrics decide it (throughput, lead time, on-time delivery, cost)?
2. **System boundary:** What belongs in the model and what does not? What level of detail is needed?
3. **Data collection and preparation:** master data, times, distributions, breakdowns, shift patterns (see section 11).
4. **Model building:** conceptual model first, then the executable model.
5. **Verification and validation:** Is the model built right (verification)? Does it represent reality accurately enough (validation)? Compare with actual data and sanity-check with subject-matter experts.
6. **Experiment design:** scenarios, warm-up period, run length, number of replications.
7. **Execution and analysis:** metrics with confidence intervals instead of single values, sensitivity analyses.
8. **Documentation and handover:** assumptions, limits, recommendations.

Two points are neglected especially often in practice: the **warm-up period** (a model that starts empty produces distorted metrics for the first simulated days) and **replications** (a stochastic model gives different results on every run; only several runs support a reliable statement) [41]. The same verification and validation logic is what NIST wants to formalize for manufacturing twins with its proposed VVUQ framework [48].

## 7. Use cases and the data each one needs

The table below sorts the most important manufacturing use cases by integration level and data requirements. Treat it as a planning aid: for your case, check the "Minimum data" column first.

| Use case | Typical decision | Integration level | Minimum data | Value-adding extra data |
|---|---|---|---|---|
| Factory and layout planning | building structure, arrangement, floor space, aisles | model | product program, routings, times, space requirements, layout variants | transport matrices, building constraints, 3D scan |
| Capacity and capital investment planning | additional machine, shift or outsourcing | model or shadow | forecasts, routings, work centers, shift patterns, availability | breakdown distributions, setup matrices |
| Bottleneck analysis | Where to invest, where to relieve? | shadow | time-stamped confirmations, actual times, inventory | machine states, downtime reasons |
| Product mix and scenario analysis | new product, variant mix, lot sizes | model or shadow | bills of materials, routings, mix scenarios | setup families, sequencing rules |
| Schedule validation and APS | Is this week's schedule feasible? Which sequence? | shadow to twin | orders, due dates, routings, capacities, current progress | material availability, people with skills |
| Virtual commissioning | test control software before physical commissioning | model (equipment model with real or emulated controller) | mechanical and electrical design, PLC program, I/O lists, behavior models | safety functions, operating concepts |
| AGV and AMR fleet planning | number of vehicles, routes, charging strategy | model, later shadow | transport orders (source, destination, quantity, time), layout, vehicle data | traffic rules, charging infrastructure, mixed traffic |
| Energy and CO2 assessment | peak loads, shift moves, shutdown strategies | shadow | power draw per state, state data, shift patterns | energy prices, metered data per machine |
| Maintenance | maintenance timing, spare parts stocking | shadow to twin | failure history, run hours, condition data | sensors, damage models |

### 7.1 Factory and layout planning

Factory planning is the classic field of the digital factory. In a greenfield project, the plant does not exist yet, so there is no operating data. The digital twin here is a **planning model** built from the product program, routings and layout variants. Its job is to compare variants under uncertainty: Which layout stays productive if the mix shifts or volume grows by a third?

Brownfield projects are different: there is data, but often no current layout. Laser scans and 3D point clouds help capture the as-built state of the building. Process logic still decides the outcome, though. A photorealistic model of the building without routings will not answer a single capacity question. Some English-language explainers call this the "visualization trap".

Proven metrics for comparing variants are throughput, lead time, work in process (WIP), transport effort (ton-miles or trips per hour), floor space and labor requirements.

### 7.2 Capacity and bottleneck analysis

Goldratt's **Theory of Constraints** assumes that a system's performance is limited by one constraint, and that any improvement away from the constraint does not raise throughput [39]. The practical problem: the bottleneck is not always where the spreadsheet shows the highest utilization. It moves with the product mix, with setups and with breakdowns. A simulation model shows where orders actually pile up and which station blocks or starves others. For more on the method, see the entity page [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/).

McKinsey describes a concrete example: in one production line, an optimized sequence at the bottleneck station reduced total processing time by about four percent [26]. Numbers like that sound small, but at a real bottleneck they translate directly into throughput.

### 7.3 Product mix and scenario analysis

New products, more variants, smaller lot sizes: each of these changes shifts load between resources. A twin built on a PPR model can read in new bills of materials and routings and show which resources become critical before the first part is made. McKinsey describes a metal fabrication plant whose twin, with a reinforcement-learning agent, evaluated thousands of possible product combinations across four parallel production lines [26]. Typical scenarios include:

- mix shifts between product families,
- introducing a new product on existing resources,
- reducing lot sizes and the effect on setup share,
- changing the shift model (two to three shifts, weekend shifts),
- loss of a key resource or a supplier.

### 7.4 Production scheduling and advanced planning and scheduling (APS)

APS systems create capacity-constrained schedules and sequences. A simulation twin complements them in two ways: it can **play a schedule through in advance** and show whether it holds under realistic variability, and it can serve as the **evaluation function** for optimization methods that generate many schedule variants. McKinsey reports an assembly plant where a redesigned production schedule reduced overtime and led to monthly cost savings of 5 to 7 percent [26]. The entity page [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) explains the basics of capacity-constrained planning, and our guide to [production scheduling software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned) goes deeper.

Keep the roles clear: classic ERP planning (MRP II) works sequentially (quantities, then dates, then capacities), often against infinite capacity. The twin does not replace the ERP system. It checks and improves its results.

### 7.5 Virtual commissioning

**Virtual commissioning** tests a machine's or line's control software against a simulation model before the physical equipment is in place. The most detailed guideline is German: VDI/VDE 3693 Part 1 (August 2016) defines virtual commissioning for process and factory automation, with the aim of finding and fixing errors from the engineering of automation systems, and describes model types and terms [14]. Part 2 (December 2018) covers introducing virtual commissioning in companies; VDI has announced a revision [15]. We found no ANSI or ISA standard dedicated to virtual commissioning [unverified]; US integrators typically work with these concepts and with their tool vendors' own methods.

Three coupling variants are common:

| Variant | Controller | Equipment | Use |
|---|---|---|---|
| Model-in-the-loop (MiL) | as a model | as a model | early concept check |
| Software-in-the-loop (SiL) | real control program on an emulated or virtual PLC | as a model | testing PLC logic without hardware |
| Hardware-in-the-loop (HiL) | real controller hardware | as a real-time model | testing including timing behavior and fieldbus systems |

The benefit is moving troubleshooting out of the expensive on-site commissioning phase into an earlier, cheaper phase. Reliable industry-wide percentages for time savings are scarce; many published numbers are vendor claims. One documented example: at a pre-assembly line in its Saarbrücken, Germany plant, ZF, working with Fraunhofer IESE, expected to commission about 30 percent faster using a digital twin and the Eclipse BaSyx middleware; in 2021 this was an expectation, not a value measured across many projects [28]. A 2024 study by Fraunhofer IWU among machine and equipment builders in the German state of Saxony found that more than 90 percent of the companies surveyed know virtual commissioning, but only a few use its potential in practice [27].

**Virtual commissioning vs. factory twin:** Virtual commissioning works at the signal and control level, often in milliseconds. A factory twin works at the order and resource level, in minutes to shifts. Both can use the same layout but answer different questions. More on the entity page [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/).

### 7.6 AGV and AMR fleet planning

Automated guided vehicles (AGVs) and autonomous mobile robots (AMRs) are a textbook case for simulation, because their behavior is driven by interactions: vehicles block each other at intersections, wait at transfer stations, travel back empty and need to charge. A static calculation (transport orders per hour times average travel time) regularly underestimates the number of vehicles needed, because empty trips, waiting times and charging breaks are missing.

For safety, two US standards frame these projects. **ANSI/ITSDF B56.5-2024**, *Safety Standard for Guided Industrial Vehicles*, defines safety requirements for the design, operation and maintenance of powered, unmanned automatic guided industrial vehicles and the systems they are part of [53]. **ANSI/A3 R15.08-1-2020 (R2026)**, *Industrial Mobile Robots: Safety Requirements, Part 1*, addresses manufacturers of industrial mobile robots and builds on risk assessment within a documented operating environment [54]. In Germany, the guideline **VDI 2510** covers AGV systems for in-plant material flow; the current edition is from 2005, and a July 2025 draft addresses AGV and AMR systems, including vehicle types, fleet control, navigation, power supply, data transmission, infrastructure and safety [18]. A simulation does not replace the risk assessment these standards require, but it shows early where traffic rules, speed zones and mixed traffic with people create conflicts.

Typical questions for an AGV simulation:

- How many vehicles do we need at peak load, and how many on average?
- Which routes, one-way rules and waiting positions avoid congestion?
- Which charging strategy (opportunity charging, battery swap) keeps availability high?
- How does mixed traffic with forklifts and pedestrians affect performance?
- What happens if a vehicle or a transfer station fails?

**Worked example with illustrative values:** Assume an assembly area needs 60 transports per hour, and a loaded trip takes 3 minutes on average. The naive calculation gives 60 × 3 = 180 travel minutes per hour, or 3 vehicles. Add empty travel to the next pickup (also 3 minutes here) and 1 minute each for pickup and drop-off, and each transport takes 8 minutes, or 480 minutes per hour: 8 fully utilized vehicles. With a target utilization of 80 percent and 85 percent availability due to charging, you get 8 / (0.8 × 0.85) ≈ 11.8, or 12 vehicles. Congestion at intersections and waiting at transfer stations are not included yet; only simulation shows those.

The data requirement is manageable but often underestimated: you need a **transport matrix** (from where to where, how often, when), which can be derived from routings, bills of materials and the line-side supply concept. This is where a PPR model pays off, because it already knows the material requirements per operation. For controlling real, mixed fleets, physics-based 3D environments are increasingly used; NVIDIA, for example, describes its "Mega" blueprint (introduced as a preview in 2025) as a reference workflow for testing robot fleets in digital twins of facilities [25]. More on the entity page [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/).

### 7.7 Energy and CO2

A production twin can model energy use by state: a machine draws different amounts of power when processing, idling, setting up and stopped. Combined with the order flow, the simulation shows peak loads and the effect of measures such as moving shifts, automatic shutdown during breaks or changed sequences. The prerequisite is power values per state, which you either measure or derive from manufacturer data. Reliable figures for savings potential depend heavily on the individual case; be skeptical of blanket percentages.

### 7.8 Maintenance

Predictive maintenance is often cited as the prime example of a digital twin. In practice, these are two different disciplines: condition monitoring and failure prediction work with sensor data and statistical or physical damage models at the asset level. A production twin can benefit by taking predicted downtime as a scenario and showing which orders are affected and when a maintenance window does the least harm.

## 8. Digital twins with Microsoft Azure and Fabric

Many manufacturers run their corporate IT on Microsoft 365 and Azure. For them, the question is which Microsoft services are candidates for digital twins and what their status is. The episode [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) gives an overview of Azure's role.

### Azure Digital Twins

**Azure Digital Twins** is a platform-as-a-service (PaaS) offering for creating twin graphs based on digital models of entire environments, such as buildings, factories, energy networks or cities [21]. Models are written in the **Digital Twins Definition Language (DTDL)**. Azure Digital Twins supports DTDL v2 and v3, and Microsoft recommends v3 because of its extended capabilities; a v3 interface can extend a v2 interface, but not the other way around [22]. Microsoft also provides ontologies that bundle DTDL models based on industry standards [22]. The overview page contained no retirement notice when we checked it [21].

Azure Digital Twins is a modeling and graph platform, not simulation software. It represents relationships and states and processes events; discrete event simulation, scenario comparison or optimization must come from other tools.

### Digital twin builder in Microsoft Fabric (preview)

With **digital twin builder**, Microsoft introduced an item in the Real-Time Intelligence workload of Microsoft Fabric in 2025. It is used to model business concepts such as assets and processes in an **ontology**, map data from various source systems to instances of these entity types and create semantic relationships between them; the data lives in OneLake [23]. As of this writing, Microsoft explicitly labels digital twin builder as a **preview** (Microsoft Learn, page last updated May 20, 2026; checked November 20, 2026) [23]. Microsoft also points out that digital twin builder is a different service from Azure Digital Twins [21][23]. In the Fabric blog, Microsoft names manufacturing examples such as twins of machines and processes for root-cause analysis and what-if questions, as well as partners that provide manufacturing data schemas and KPI queries, for example for overall equipment effectiveness (OEE) [24].

### Which service for which purpose?

| Need | Suitable approach | Note |
|---|---|---|
| Graph of assets, spaces and equipment with event processing, in production | Azure Digital Twins with DTDL v3 [21][22] | generally available PaaS service; add simulation separately |
| Ontology over ERP, MES and sensor data on a Fabric data platform | digital twin builder in Fabric [23] | preview: for pilots and evaluation; check production use against Microsoft's preview terms |
| Capacity, bottleneck, scenarios, layout | simulation tool (section 15), results in Fabric or Power BI | neither Azure Digital Twins nor digital twin builder is simulation software |

### What M365 and Azure admins contribute

A production twin is not a pure OT project. IT contributes essential building blocks:

- **Identity and permissions:** Who may create scenarios, and who may approve results? Roles in Microsoft Entra ID, separate rights for modeling, analysis and write-back.
- **Data platform:** connecting ERP and MES to a central data platform, historization, data-quality rules, catalogs.
- **Governance:** classification of production and customer data, retention, access logs. For defense suppliers, this includes controlled unclassified information (CUI) handling under DFARS and CMMC; our guide to [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned) covers those rules.
- **Reporting and collaboration:** publishing simulation results in Power BI, Teams channels for scenario decisions, versioning of model states.
- **Security:** network segmentation between IT and OT, no direct write access from the cloud to controllers without a defined approval chain (see section 16).

Our guide to [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned) covers manufacturing IT on Azure in detail.

## 9. Artificial intelligence and the digital twin

AI and the digital twin complement each other in both directions: the twin gives AI structured context and a safe place to experiment, and AI speeds up and extends the twin. Five patterns matter in manufacturing:

1. **Data preparation:** Machine learning detects outliers in confirmations, estimates missing times and derives distributions from actual data. It is unspectacular, but often the biggest practical lever.
2. **Surrogate models:** A detailed simulation model is used to "train" a neural network or another surrogate with many runs; the surrogate then delivers approximations in seconds. Useful for optimizations that need very many evaluations. The limits lie outside the trained range.
3. **Optimization and reinforcement learning:** Agents learn control rules inside the simulation model, for example for sequencing or vehicle dispatching, without disturbing real production. The McKinsey metal fabrication example in section 7.3 used this approach [26]. The rules are only as good as the model's fidelity.
4. **Generative AI as the interface:** Language models translate questions like "What happens if line 3 is down for a week?" into scenarios and explain results. The prerequisite is a semantically clean model (ontology, PPR graph) so the AI does not guess.
5. **Physical AI and robotics:** Physics-based 3D twins serve as training and test environments for robots and autonomous vehicles; NVIDIA positions Omniverse and the Mega blueprint, based on OpenUSD, for this purpose [25].

**A sober assessment:** AI replaces neither validation nor domain expertise. A language model working on a faulty routing quickly produces plausible but wrong answers. The order is therefore: data foundation and model first, then AI.

## 10. Roadmap: implementation in six phases

The following roadmap is a guide for a production or factory twin. The durations are the author's experience for a mid-sized plant with a clearly scoped first use case [unverified]; McKinsey gives a range of two to three months to more than a year for twin projects, depending on team capabilities and plant complexity [26]. The post [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) also describes how to take the first step.

| Phase | Content | Result | Typical duration |
|---|---|---|---|
| 1 Question | name the decision, set metrics and targets, assign owners | one-page charter with guiding question, metrics, system boundary | 2–4 weeks |
| 2 Data inventory | review ERP, MES and layout data, check data quality, close gaps | data map, quality report, action list | 3–6 weeks |
| 3 Pilot model | PPR model for one value stream or area, executable simulation model | validated pilot model | 6–12 weeks |
| 4 Validation and first decision | compare with actual data, run scenarios, prepare decision | documented decision with assumptions | 2–6 weeks |
| 5 Operationalization | automatic data feeds, roles, maintenance processes, regular schedule validation | shadow in routine operation | 2–6 months |
| 6 Scaling | more areas, plants, use cases, coupling with APS, energy, AGVs | twin portfolio on a shared data foundation | ongoing |

**Guiding principles for the roadmap:**

- **One decision first.** A twin that improves a concrete capital or planning decision pays for the next phase.
- **Data before platform.** Check data quality before you select tools.
- **Operations in the lead.** Planners and supervisors have to understand and trust the model. A model that only the simulation group can operate dies with the next staff change.
- **Maintenance from day one.** Decide early who updates the model when routings, layouts or shift patterns change.

**Help for small and mid-sized manufacturers:** In the US, the NIST Manufacturing Extension Partnership (MEP), a program of the Department of Commerce's National Institute of Standards and Technology with more than 450 service locations in all 50 states and Puerto Rico, is a common starting point for smaller manufacturers that want outside support with digitalization projects [60]. NIST's ISO 23247 use-case report was written with exactly this audience in mind [47].

## 11. Data quality: the underrated prerequisite

In many twin projects, the first data review already shows it: the master data in the ERP system describes the plant more as it was once planned than as it works today. That is no criticism of master data management. It follows from the fact that ERP systems are maintained mainly for costing and material planning, not for simulation.

### Typical data problems

- **Standard times** come from costing or from time studies done years ago (in Germany often REFA studies, the German counterpart of classic industrial-engineering time study) and deviate considerably from actual times.
- **Setup times** are stored as flat values, although in reality they depend on the sequence (setup matrix).
- **Work center groups** combine machines that actually differ (age, availability, operator skills).
- **Shift calendars** do not reflect extra shifts, reduced-hours periods (in Germany: *Kurzarbeit*, government-subsidized short-time work) or staff shortages.
- **Downtime** is not captured in the ERP system at all and is captured in the MES with inconsistent reason codes.
- **Manufacturing BOMs** deviate from the engineering BOM without the deviation being documented.
- **Confirmations** are booked in bulk at the end of the shift, so timestamps do not reflect the real sequence of events.
- **Travel times** and in-plant routes are missing entirely.

### Checklist before you build the model

| Check | Question | Method |
|---|---|---|
| Completeness | Does every relevant material have a routing, and every operation a work center? | query for missing links |
| Currency | When were standard times last reviewed? | change date per routing |
| Plausibility | How large is the gap between standard and actual times? | comparison with confirmations over three to six months |
| Granularity | Are work centers fine-grained enough for the question? | cross-check with layout and a gemba walk |
| Consistency | Do names match between ERP, MES and layout? | mapping table |
| Timestamps | Are confirmations booked promptly? | distribution of booking times across the shift |
| Downtime | Is there a single downtime reason catalog? | frequency analysis of reasons |
| Ownership | Who maintains which data, and who approves changes? | RACI matrix |

**Rule of thumb:** A simulation model may bridge data gaps with assumptions, as long as the assumptions are documented and tested in sensitivity analyses. A twin that silently calculates with wrong standard times is dangerous, because it looks precise.

A side effect many companies underestimate: the data inventory for a twin alone often improves planning quality in the ERP system, because it exposes outdated routings and wrong capacities.

## 12. Cost and benefit, assessed honestly

### Cost drivers

In the author's assessment, the cost of a production twin is usually dominated not by software but by data and modeling work. The main cost drivers are:

- **Data preparation:** interfaces, cleansing, mapping, clarification with the business.
- **Modeling and validation:** building the PPR model and the simulation model, comparing it with reality.
- **Maintenance:** updates when products, processes or layouts change. This item is missing from many business cases.
- **Training:** training planners and key users, building in-house capability.
- **Software and infrastructure:** licenses, cloud resources, integration.

For simulation studies, a German simulation services firm gives as a rule of thumb that the cost should not exceed 1 percent of the investment concerned, and refers to studies and benchmarks (including VDI) that put the cost-benefit ratio at about 1:6 on average [30]. These values come from a vendor source; check the original studies before using them in your own business case.

### Documented benefit examples

Reliable, independently collected benefit figures are rare. The following values are sourced, but they are individual cases:

| Source | Context | Value |
|---|---|---|
| McKinsey (2024) [26] | assembly plant, redesigned production schedule | 5–7% monthly cost savings through less overtime |
| McKinsey (2024) [26] | sequence optimization at a bottleneck station | approx. 4% lower total processing time |
| McKinsey (2024) [26] | survey of 75 senior industrial executives (June 2022) | 86% consider twins applicable, 44% have already implemented one, 15% are planning to |
| ZF / Fraunhofer IESE (2021) [28] | pre-assembly line, Saarbrücken (Germany), Eclipse BaSyx middleware | approx. 30% faster commissioning (expectation, not an average) |
| Fraunhofer IWU (2024) [27] | survey of machine and equipment builders in Saxony (Germany) | more than 90% know virtual commissioning, only a few use its potential |

For context on the US investment climate: in Deloitte's 2025 Smart Manufacturing and Operations Survey (600 executives at US manufacturers with $500 million or more in revenue, conducted August to September 2024), 78 percent of leaders said they put more than 20 percent of their improvement budget into smart manufacturing initiatives; respondents reported up to 20 percent improvement in production output [56]. These are self-reported figures for smart manufacturing as a whole, not for digital twins specifically.

### The business case in five questions

1. **Which decision** does the twin improve, and how often is it made (once for a capital project, or weekly in scheduling)?
2. **What does a wrong decision cost** (over- or under-sized investment, late deliveries, overtime, stockouts)?
3. **How much more accurate** does the decision become with the twin? A pilot gives you a first comparison between plan, simulation and actual results.
4. **What does the twin cost** over three to five years, including maintenance?
5. **Which follow-on benefits** arise (better master data, faster quote checks, reuse in other areas)?

For capital decisions in the millions of dollars, a single avoided mis-sizing can justify a simulation project. For ongoing planning twins, frequency of use decides.

## 13. Common mistakes and how to avoid them

| Mistake | Consequence | Countermeasure |
|---|---|---|
| technology before the question | expensive platform without benefit | one-page charter with a concrete decision and metric before any tool selection |
| confusing 3D visualization with a twin | nice pictures, no answers to capacity questions | process logic (PPR) before geometry |
| modeling everything at once | project never finishes | one value stream or area as the pilot |
| adopting master data unchecked | precise-looking but wrong results | data-quality check (section 11), comparison with actual times |
| no validation | loss of trust at the first deviation | systematic comparison with actual data, documented assumptions |
| averages instead of distributions | bottlenecks and inventory underestimated | distributions from actual data, model breakdowns |
| a single simulation replication | a random result sold as the truth | several replications, confidence intervals [41] |
| no maintenance plan | model outdated after a few months | roles, processes and budget for maintenance |
| model only for specialists | knowledge leaves with one person | understandable interfaces, training, documentation |
| feedback loop without approval | safety and liability risk | human approval, logging, IT/OT security concept |
| undefined terms | misunderstandings in RFP and contract | specify the integration level (model, shadow, twin) explicitly [5] |

## 14. Standards and guidelines at a glance

| Standard/guideline | Title (short) | Status | Relevance |
|---|---|---|---|
| ISO 23247-1 to -4 | Digital twin framework for manufacturing: overview, reference architecture, digital representation, information exchange | 2021 [6] | framework and structure for manufacturing twins |
| ISO 23247-5 | Digital thread for digital twin | 2026 (listed in the ISO catalog as Edition 1, 2026-06, still shown as "under publication" on November 20, 2026) [7] | linking lifecycle information |
| ISO 23247-6 | Digital twin composition | published July 14, 2026 [8] | composing several twins |
| NIST AMS 400-2 | Use Case Scenarios for Digital Twin Implementation Based on ISO 23247 | May 2021 [47] | US implementation guidance for ISO 23247 |
| ISO/IEC 30173 | Digital twin: Concepts and terminology | November 2023 [9] | cross-industry terms |
| NIST IR 8356 | Security and Trust Considerations for Digital Twin Technology | February 2025 [49] | security and trust |
| IEC 63278-1 | Asset Administration Shell for industrial applications, Part 1: Structure | December 14, 2023 [10] | Asset Administration Shell |
| DIN SPEC 91345 | Reference Architecture Model Industrie 4.0 (RAMI 4.0) | 2016 [12] | Industry 4.0 framework (German) |
| ANSI/ISA-95 (IEC 62264) | Enterprise-control system integration | standard series [58][19] | levels ERP/MES/control, data models |
| ANSI/MTC1.4-2018 (MTConnect) | manufacturing data interoperability | 2018 edition [57] | machine data, common in US machine shops |
| IEC 62541 (OPC UA) | OPC Unified Architecture | standard series | machine communication and information models |
| VDI 3633 Part 1 | Simulation of systems in materials handling, logistics and production: fundamentals | December 2014 [13] | method of the simulation study (German) |
| VDI/VDE 3693 Part 1 | Virtual commissioning: model types and glossary | August 2016 [14] | virtual commissioning terms (German) |
| VDI/VDE 3693 Part 2 | Virtual commissioning: introduction in companies | December 2018, revision announced [15] | introducing virtual commissioning (German) |
| VDI 4499 Part 1 | Digital factory: fundamentals | new edition April 2026 (first edition February 2008) [16] | term and architecture of the digital factory (German) |
| ANSI/ITSDF B56.5-2024 | Safety Standard for Guided Industrial Vehicles | 2024 [53] | AGV safety (US) |
| ANSI/A3 R15.08-1-2020 (R2026) | Industrial Mobile Robots: Safety Requirements, Part 1 | reaffirmed 2026 [54] | AMR safety (US) |
| VDI 2510 | Automated guided vehicle systems (AGVS) | October 2005, draft July 2025 [18] | AGVs and AMRs (German) |
| ISA/IEC 62443 | Security for industrial automation and control systems | standard series [59] | security of automation systems |
| NIST SP 800-82 Rev. 3 | Guide to Operational Technology (OT) Security | September 2023 [55] | OT security guidance (US) |

## 15. Software categories: a neutral comparison

The market is hard to navigate because many vendors call their product a "digital twin". A classification by function is more helpful:

| Category | Core function | Strengths | Limits | Typical users |
|---|---|---|---|---|
| Discrete event simulation tools | material flow and factory simulation | high modeling freedom, established method | model building is effortful, needs expertise | simulation experts, factory planning |
| Multi-method simulation tools | combination of discrete event, agent-based, system dynamics | flexible for mixed questions | steep learning curve | simulation and logistics experts |
| Digital factory and PLM suites | layout, robotics, process planning, simulation in a PLM context | continuity from design to production | complexity, license cost | large enterprises, automotive |
| Virtual commissioning tools | equipment models with PLC coupling (SiL/HiL) | control testing before installation | focus on equipment, not the plant | controls engineers, machine builders |
| Value stream and PPR-based planning tools | model from ERP and value stream data, simulation, scenarios | fast build from existing data, close to operations | less suited to detailed conveyor systems | production planning, lean, plant management |
| APS systems | capacity-constrained planning and sequencing | operational scheduling | simulation often limited | production planning and control |
| IoT and twin platforms | asset models, event processing, graphs (e.g., Azure Digital Twins) | scale, integration, real time | no simulation out of the box | IT, data platform teams |
| 3D and physics platforms | photorealistic scenes, physics, robot training (e.g., on OpenUSD) | visualization, robotics, AI training | process logic and order dynamics not the focus | robotics, large projects |

**Selection criteria:** Does the tool fit the question and level of detail? How fast can a model be built from your existing data? Can operations staff use it themselves? How is it maintained? Which interfaces to ERP, MES and your data platform exist? Which standards (AAS, OPC UA, MTConnect, DTDL) are supported? Where does the data reside, and who has access?

## 16. Security, data ownership and regulation

A production twin holds sensitive information: product structures, process times, capacities and customer orders describe a company's know-how and competitive position. The higher the integration level, the greater the risk.

- **IT/OT separation:** A twin that writes back to controls needs a zones-and-conduits concept according to ISA/IEC 62443, the series that defines requirements and processes for secure industrial automation and control systems [59], plus defined crossings and logging. NIST SP 800-82 Rev. 3 (September 2023) is the US government's guide to securing operational technology, with typical architectures, threats and countermeasures [55].
- **Twin-specific risks:** NIST IR 8356 (final, February 2025) analyzes the traditional and new cybersecurity challenges of digital twin architectures and maps trust considerations to existing NIST guidance [49]. Use it as a checklist when the twin aggregates data from many systems in one place.
- **Approval chains:** Recommendations from the twin should be approved by people before they take effect in ERP, MES or controls, at least until reliability has been demonstrated.
- **Data ownership:** Settle by contract who owns the models and derived data, where they are processed and whether vendors may use them for their own purposes (such as AI training).
- **Regulation for exporters to the EU:** The European Union's **Cyber Resilience Act** (Regulation (EU) 2024/2847) sets cybersecurity requirements for products with digital elements sold in the EU. Reporting obligations for actively exploited vulnerabilities have applied since September 11, 2026; the remaining obligations apply from December 11, 2027 [36]. For US makers of connected machines and software that sell into the EU, this is directly relevant; for plant operators, it matters indirectly through the requirements they place on their suppliers.

## 17. Building a twin from ERP and value stream data with iFAKT Polaris

> **Note: The author works at iFAKT GmbH.**

This section describes one solution approach that follows the principle explained in section 5: building the production twin from existing ERP and value stream data through a product-process-resource model. The information comes from iFAKT GmbH's product pages and can be checked there; the author has no independent comparative tests.

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), headquartered in Stuttgart, Germany, says it has been active for more than 25 years and develops software for value stream mapping, production simulation, planning and optimization [35]. The company describes its platform [iFAKT Polaris](https://www.m365.fm/entity/polaris/) as a way to connect ERP data with a digital twin of production in order to optimize plans and expose bottlenecks; the platform includes modules for value stream and swimlane modeling (VSM/BSM), Designer, Simulator, Optimizer, Operator and Analyzer [35].

**Polaris Designer:** According to the vendor's page, Designer turns input data into a structured **PPR knowledge graph** that connects products (manufacturing and engineering bills of materials, MBOM/EBOM), processes (setup, machine and handling times) and resources (stations, teams, zones) with their constraints in one model. The inputs are ERP data, manufacturing BOMs, process times, resource structures and constraints. From these, Designer automatically generates network diagrams based on the real production logic, shows the critical path and critical resources, highlights bottleneck processes, compares current and optimized lead times and assigns zones based on product-process relationships. The vendor positions the graph as the common basis ("single source of truth") for simulation and optimization [33]. More on the entity page [Polaris Designer](https://www.m365.fm/entity/polaris-designer/).

**Polaris Simulator:** According to the vendor, Simulator builds on the PPR graph created in Designer and runs the network diagrams through configurable station, line and shop-floor (hall) models, for single and multiple lines. It is meant to make capacity utilization across shifts and scenarios transparent, detect bottlenecks and utilization imbalances over time, show over- and under-utilization as well as time-based labor utilization, and evaluate scenarios for capacity, labor deployment and buffers as well as dynamic product mixes on shared resources [34]. More on the entity page [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/).

**Technical background:** iFAKT employees have published on the underlying questions in the German trade literature, for example on dynamic simulation of value streams (ZWF 109(11), 2014) [31] and, with research partners, on a universal data interface for digital value stream services (ZWF 118(5), 2023) [32].

**Assessment:** A PPR- and value-stream-based approach is particularly suited to questions of production planning, capacity, bottlenecks and labor deployment in high-mix assembly and fabrication areas. For detailed conveyor systems, robot cells or virtual commissioning at the signal level, the specialized categories in section 15 are a better fit. As with any tool, test in a pilot with your own data whether the results answer your question. Our dedicated guide to [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned) covers the platform in more depth.

## 18. Glossary

| Term | Explanation |
|---|---|
| Advanced planning and scheduling (APS) | software for capacity-constrained planning and sequencing |
| Agent-based simulation (ABS) | modeling of autonomous units (agents) with their own rules, whose interaction produces system behavior |
| AGV / AMR | automated guided vehicle / autonomous mobile robot [53][54] |
| Asset Administration Shell (AAS) | standardized digital representation of an asset according to IEC 63278 [10] |
| Bottleneck (constraint) | resource that limits the throughput of the overall system [39] |
| Digital factory | umbrella term for digital models, methods and tools for planning and improving the real factory (German guideline VDI 4499) [16][17] |
| Digital model | digital representation without automatic data exchange with the physical object [5] |
| Digital shadow | representation with automatic data flow from physical to digital, but manual flow back [5] |
| Digital thread | connected linking of information across the lifecycle; addressed in ISO 23247-5 [7] |
| Digital twin | representation with automatic data flow in both directions [5]; often used more broadly in practice |
| Discrete event simulation (DES) | simulation whose clock jumps from event to event; the standard in production simulation |
| DTDL | Digital Twins Definition Language, JSON-based modeling language for Azure Digital Twins [22] |
| ERP | enterprise resource planning, the core business system with master data, orders and material planning |
| HiL / SiL / MiL | hardware-, software-, model-in-the-loop: coupling variants for virtual commissioning |
| ISA-95 / IEC 62264 | standard series for integrating enterprise and control systems [58] |
| Little's Law | L = λ · W: average inventory equals throughput rate times lead time in steady state [37] |
| Material flow simulation | simulation of material and order flows through production and logistics, usually discrete event |
| MBOM / EBOM | manufacturing bill of materials / engineering bill of materials |
| MES | manufacturing execution system, operations management at ISA-95 level 3 |
| MTConnect | open standard for manufacturing data interoperability, published as ANSI/MTC1.4-2018 [57] |
| OPC UA | vendor-independent communication standard with information models (IEC 62541) |
| PPR model | product-process-resource model, the structuring principle of the digital factory |
| Replication | repeated simulation run with different random numbers for statistical confidence [41] |
| Validation | checking whether a model represents reality accurately enough for its purpose |
| Value stream simulation | dynamic simulation of a value stream map over time [31] |
| Verification | checking whether a model has been implemented correctly |
| Virtual commissioning | testing control software against a simulation model before physical commissioning [14] |
| VVUQ | verification, validation and uncertainty quantification; proposed by NIST as a future ISO 23247 part [48] |
| Warm-up period | initial phase of a simulation run whose results are discarded because of the empty starting state |

## 19. FAQ: digital twins in manufacturing

### What is a digital twin in manufacturing, in simple terms?
A digital twin is an executable computer model of your production that is updated with data from real operations. You can use it to play through operations, find bottlenecks and test changes before you make them on the real shop floor.

### What are the 4 types of digital twins?
A common four-level scheme distinguishes component (part) twins, asset twins, system (unit) twins and process twins [52]. For manufacturing decisions, a more useful split is product, process, asset, factory, performance and supply chain twins (see section 3). None of these classifications is standardized; ISO/IEC 30173 describes twin types only at a general level [9].

### What is the difference between a digital twin and a digital shadow?
According to Kritzinger et al., in a digital shadow data flows automatically from the physical to the digital object, but the return path is manual. In a digital twin, data flows automatically in both directions [5]. A digital model has no automatic data exchange at all.

### What are examples of digital twins in manufacturing?
Typical examples are a factory model that compares layout variants before a new building is approved, a simulation fed daily from ERP and MES that checks whether this week's schedule holds, a virtual commissioning model that tests PLC code before a line is installed, and an AGV fleet model that sizes vehicles and charging. McKinsey documents cases such as a redesigned assembly schedule with 5 to 7 percent monthly cost savings and a bottleneck sequence that cut processing time by about four percent [26].

### What is the difference between a digital twin and a simulation?
A simulation is a model you run experiments with. It becomes a digital shadow or twin when it is fed automatically with operating data and its results flow back into decisions or controls. Many twins contain a simulation at their core.

### Is a 3D model or a BIM model a digital twin?
Not on its own. A 3D scan, CAD layout or building information model (BIM) captures geometry. Without process logic (routings, times, resources) and a data connection to operations, it cannot answer capacity or lead-time questions. It can be a useful layer of a twin, especially in brownfield layout planning.

### What is the difference between production simulation and virtual commissioning?
Production simulation evaluates operations at the order and resource level (throughput, lead time, bottlenecks). Virtual commissioning tests a machine's control software at the signal level against an equipment model before the physical equipment is built [14].

### What data does a manufacturing digital twin need?
For a production and factory twin, you mainly need bills of materials, routings with times, work centers and capacities, shift patterns, orders and confirmations. This data comes mostly from ERP and MES. Machine and sensor data improves the model but is rarely the starting point.

### Can you build a digital twin from ERP data?
Yes. For questions of capacity, lead time and scheduling, the ERP system is the most important source. It holds product, process and resource data in structured form. A data-quality check is essential, because standard and setup times often deviate from reality.

### What type of simulation is used in manufacturing?
Mostly discrete event simulation, whose clock jumps from event to event. System dynamics is added for strategic questions, agent-based simulation for vehicles and people, and physics-based 3D simulation for robot cells and control testing.

### How accurate does a digital twin need to be?
Accurate enough for the decision it supports, and no more. Validate the model against actual data for the metrics that matter (for example throughput or lead time), document assumptions and run sensitivity analyses. NIST is working on a verification, validation and uncertainty quantification framework for manufacturing twins [48].

### What standards apply to digital twins in manufacturing?
The core standards are ISO 23247 (digital twin framework for manufacturing, Parts 1 to 6) [6][7][8], ISO/IEC 30173 (terminology) [9], IEC 63278-1 (Asset Administration Shell) [10] and ISA-95 / IEC 62264 [58]. For security, use ISA/IEC 62443 [59] and NIST SP 800-82 [55]. NIST AMS 400-2 shows how to apply ISO 23247 [47]. German guidelines (VDI 3633 for simulation, VDI/VDE 3693 for virtual commissioning, VDI 4499 for the digital factory) add method detail [13][14][16].

### Are digital twins a good fit for small and mid-sized manufacturers?
Yes, if you start with a clearly scoped question. A pilot for one value stream or area based on existing ERP data takes far less effort than a plant-wide IoT project and delivers verifiable benefit sooner. NIST's ISO 23247 use-case report targets exactly this group [47], and NIST MEP centers offer outside support [60].

### How much does a digital twin cost?
That depends on scope, data situation and integration level. The largest cost items are usually data preparation, modeling, validation and maintenance, not the software. A German simulation services firm gives a rule of thumb of at most 1 percent of the investment concerned for simulation studies [30].

### How long does implementation take?
McKinsey gives a range of two to three months to more than a year for twin projects, depending on team capabilities and plant complexity [26]. A pilot focused on one concrete decision is usually possible within a few months.

### How does a digital twin help plan AGV and AMR fleets?
It simulates vehicles with trips, empty travel, waiting times, intersection conflicts and charging breaks. That way you determine the number of vehicles, routes and charging strategy, which a static calculation regularly underestimates.

### What role does artificial intelligence play?
AI helps prepare data, speeds up simulations through surrogate models, learns control rules inside the model and makes twins usable through natural language. It requires a validated model and clean data.

### Is Azure Digital Twins the same as digital twin builder in Fabric?
No. Microsoft explicitly states that these are different services [21][23]. Azure Digital Twins is a PaaS service for twin graphs with DTDL; digital twin builder is an ontology and mapping tool in Microsoft Fabric and is in preview as of this writing [23].

### Who invented the digital twin?
The concept goes back to Michael Grieves, who presented it in 2002 in the context of product lifecycle management; Grieves credits the name "digital twin" to John Vickers of NASA [1][2]. Other authors point to earlier precursors, for example in research on virtual manufacturing [4].

## 20. Conclusion

The digital twin in manufacturing is less a new technology than the consistent combination of three proven building blocks: a structured model of products, processes and resources; a simulation that captures dynamics and variability; and a data feed from real operations. The standards exist, from ISO 23247 and ISA-95 to the Asset Administration Shell, NIST provides US implementation guidance, and the method of factory simulation has been tested for decades.

The most common mistake is not the wrong technology but a missing purpose. Start with a decision that today rests too often on gut feeling or a spreadsheet: a capital investment, a new product mix, an AGV fleet, a weekly schedule that regularly does not hold. Check your ERP data honestly, build a validated pilot model and then decide which integration level the next step justifies. That is how you get a twin that does not just look good but improves decisions.

## Further reading on m365.fm

**Blog posts and episodes**

- [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [From ERP to the shop floor: the digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Episode: Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Episode: Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Entity pages**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/) · [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/)
- [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/)
- [iFAKT](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

**Sister guides** (links go live after publication)

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about digitalizing manufacturing with Microsoft 365 and Azure, value stream methods, production planning and digital twins. His focus is on how to derive reliable models for planning and capital decisions from existing ERP and value stream data.

**Note: The author works at iFAKT GmbH.**

*[Editor: have the author add role, background and a profile photo.]*

---

# Sources

All online sources accessed on November 20, 2026. Sources [1] to [46] are carried over from the German version (re-checked where noted in the review log); [47] to [61] are new US/English sources, each opened and verified for this version.

1. Grieves, M.; Vickers, J. (2017): Digital Twin: Mitigating Unpredictable, Undesirable Emergent Behavior in Complex Systems. In: Kahlen, F.-J.; Flumerfelt, S.; Alves, A. (eds.): Transdisciplinary Perspectives on Complex Systems. Springer, Cham. DOI: [10.1007/978-3-319-38756-7_4](https://doi.org/10.1007/978-3-319-38756-7_4)
2. Grieves, M.: Digital and Physical Twins (book chapter, provided in the ASME resource library). https://event.asme.org/Events/media/library/resources/digital-twin/Digital-and-Physical-Twins.pdf
3. Glaessgen, E. H.; Stargel, D. S. (2012): The Digital Twin Paradigm for Future NASA and U.S. Air Force Vehicles. 53rd AIAA/ASME/ASCE/AHS/ASC Structures, Structural Dynamics and Materials Conference, Honolulu, April 23–26, 2012. NASA Technical Reports Server 20120008178. https://ntrs.nasa.gov/citations/20120008178
4. Zhou, J.; Zhang, S.; Gu, M. (2022): Revisiting Digital Twins: Origins, Fundamentals and Practices. arXiv:2203.12867 (with reference to Shafto et al. 2010, NASA Modeling, Simulation, Information Technology & Processing Roadmap). https://arxiv.org/abs/2203.12867
5. Kritzinger, W.; Karner, M.; Traar, G.; Henjes, J.; Sihn, W. (2018): Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine 51(11), pp. 1016–1022. DOI: [10.1016/j.ifacol.2018.08.474](https://doi.org/10.1016/j.ifacol.2018.08.474)
6. ISO 23247-1:2021 Automation systems and integration: Digital twin framework for manufacturing, Part 1: Overview and general principles (Parts 2 to 4 also 2021). Catalog entry: https://iteh.eu/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021
7. ISO 23247-5 Automation systems and integration: Digital twin framework for manufacturing, Part 5: Digital thread for digital twin (Edition 1, 2026-06; status "under publication" when checked on November 20, 2026). https://www.iso.org/standard/87425.html
8. ISO 23247-6:2026 Automation systems and integration: Digital twin framework for manufacturing, Part 6: Digital twin composition (published July 14, 2026, stage 60.60). https://committee.iso.org/standard/87426.html
9. ISO/IEC 30173:2023 Digital twin: Concepts and terminology (November 2023). https://www.iso.org/standard/81442.html
10. IEC 63278-1:2023 Asset Administration Shell for industrial applications, Part 1: Asset Administration Shell structure (December 14, 2023). https://webstore.iec.ch/en/publication/65628
11. ZVEI (2020): User organization Industrial Digital Twin Association founded (founded September 24, 2020). https://www.zvei.org/en/press-media/pressarea/user-organization-industrial-digital-twin-association-founded
12. DIN SPEC 91345:2016-04 Reference Architecture Model Industrie 4.0 (RAMI4.0). https://www.dinmedia.de/de/technische-regel/din-spec-91345/250940128
13. VDI 3633 Part 1:2014-12 Simulation of systems in materials handling, logistics and production: Fundamentals. https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals ; VDI 3633 Part 8 (machine-oriented simulation, 3D motion and process simulation): https://www.vdi.de/mitgliedschaft/vdi-richtlinien/details/vdi-3633-blatt-8-simulation-of-systems-in-materials-handling-logistics-and-production-machine-oriented-simulation-3d-motion-and-process-simulation
14. VDI/VDE 3693 Part 1:2016-08 Virtual commissioning: Model types and glossary. https://vdi.de/richtlinien/details/vdivde-3693-blatt-1-virtual-commissioning-model-types-and-glossary
15. VDI/VDE 3693 Part 2:2018-12 Virtual commissioning: Introduction of virtual commissioning in companies; revision announced. https://vdi.de/en/home/vdi-standards/details/vdivde-3693-blatt-2-virtual-commissioning-introduction-of-virtual-commissioning-in-companies ; edition history: https://dinmedia.de/en/draft-technical-rule/vdi-vde-3693-blatt-2/276110751
16. VDI 4499 Part 1:2026-04 Digital factory: Fundamentals. https://vdi.de/richtlinien/details/vdi-4499-blatt-1-digital-factory-fundamentals
17. University of Duisburg-Essen, Chair VIP: lecture notes "Digitale Fabrik" (quotes the definition from VDI 4499 Part 1:2008; in German). https://www.uni-due.de/imperia/md/content/vip/scriptum_digitalefabrik.pdf
18. VDI 2510:2005-10 Automated guided vehicle systems (AGVS). https://vdi.de/richtlinien/details/vdi-2510-automated-guided-vehicle-systems-agvs ; draft VDI 2510:2025-07: https://www.dinmedia.de/de/technische-regel-entwurf/vdi-2510/388587666
19. OPC Foundation: OPC 10030 ISA-95 Common Object Model, section 4.2.3 ISA-95. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
20. Schuh, G.; Anderl, R.; Dumitrescu, R.; Krüger, A.; ten Hompel, M. (2020): Industrie 4.0 Maturity Index. Managing the Digital Transformation of Companies. Update 2020 (acatech STUDY). https://en.acatech.de/publication/industrie-4-0-maturity-index-update-2020/
21. Microsoft Learn: What is Azure Digital Twins? https://learn.microsoft.com/azure/digital-twins/overview
22. Microsoft Learn: Learn about twin models and how to define them in Azure Digital Twins (DTDL v2 and v3). https://learn.microsoft.com/en-ca/azure/digital-twins/concepts-models
23. Microsoft Learn: What Is Digital Twin Builder (Preview)? (last updated May 20, 2026; preview label re-checked November 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
24. Microsoft Fabric Blog: Digital twin builder in Microsoft Fabric Real-Time Intelligence. https://blog.fabric.microsoft.com/en-us/blog/digital-twin-builder-in-microsoft-fabric-real-time-intelligence-revolutionizing-digital-twin-creation-and-management
25. NVIDIA Blog (March 31, 2025): Industrial Ecosystem Adopts Mega NVIDIA Omniverse Blueprint to Train Physical AI in Digital Twins. https://blogs.nvidia.com/blog/mega-omniverse-blueprint-industrial-digital-twins/
26. Camarella, S.; Conway, M. P.; Goering, K.; Huntington, M. (2024): Digital twins: The next frontier of factory optimization. McKinsey & Company, January 10, 2024. https://www.mckinsey.com/capabilities/operations/our-insights/digital-twins-the-next-frontier-of-factory-optimization
27. Fraunhofer IWU (2024): Sächsische Maschinenbauer nutzen Vorteile der Virtuellen Inbetriebnahme oft noch nicht (press release on the SaxoVI study, August 13, 2024; in German). https://www.iwu.fraunhofer.de/content/dam/iwu/de/documents/Presse/2024-Saechsische-Maschinenbauer-nutzen-Vorteile-der-Virtuellen-Inbetriebnahme-oft-noch-nicht.pdf
28. Poll, D. (2021): Digitalisierung bei ZF: Neue Methode spart 30 Prozent Zeit. produktion.de, June 16, 2021 (in German). https://www.produktion.de/technik/digitalisierung-bei-zf-neue-methode-spart-30-prozent-zeit/1656151
29. Fraunhofer IESE: Digitaler Zwilling in der Produktion & Industrie 4.0 (in German). https://www.iese.fraunhofer.de/de/leistungen/digitaler-zwilling.html
30. SimPlan AG: FAQ Simulation (definition according to VDI 3633, cost-benefit rules of thumb). https://www.simplan.de/en/knowledge/faq-simulation-en
31. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen [Dynamic simulation of value streams]. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), pp. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
32. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (2023): Universelle Datenschnittstelle für digitale Wertstromdienste [Universal data interface for digital value stream services]. ZWF 118(5), pp. 293–297. DOI: [10.1515/zwf-2023-1062](https://doi.org/10.1515/zwf-2023-1062)
33. iFAKT GmbH: Polaris Designer (product page). https://www.ifakt.de/en/solutions/designer
34. iFAKT GmbH: Polaris Simulator (product page). https://www.ifakt.de/en/solutions/simulator
35. iFAKT GmbH: home page (company and Polaris platform). https://www.ifakt.de/
36. European Commission: Cyber Resilience Act, summary (Regulation (EU) 2024/2847). https://digital-strategy.ec.europa.eu/en/policies/cra-summary
37. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), pp. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
38. Forrester, J. W. (1961): Industrial Dynamics. MIT Press, Cambridge, MA.
39. Goldratt, E. M.; Cox, J. (1984): The Goal: A Process of Ongoing Improvement. North River Press.
40. Rother, M.; Shook, J. (1998): Learning to See: Value Stream Mapping to Add Value and Eliminate Muda. Lean Enterprise Institute, Brookline, MA.
41. Law, A. M. (2015): Simulation Modeling and Analysis. 5th ed., McGraw-Hill Education, New York.
42. SYMESTIC: Was ist ISA-95? (level model, relation to IEC 62264; in German). https://www.symestic.com/de-de/was-ist/isa-95
43. Umbrex: ISO 23247 Digital Twin Framework for Manufacturing (overview of parts and reference architecture). https://umbrex.com/resources/frameworks/manufacturing-industrial-equipment-frameworks/iso-23247-digital-twin-framework-for-manufacturing/
44. NEURONwriter: analysis "digitaler zwilling fertigung", google.de, query f5135b90c13e4c59 (internal analysis for the German version, accessed November 20, 2026).
45. NEURONwriter: analysis "produktionssimulation", google.de, query 3ee168d2a2cb38f1 (internal analysis for the German version, accessed November 20, 2026).
46. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), pp. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
47. Shao, G. (2021): Use Case Scenarios for Digital Twin Implementation Based on ISO 23247. NIST Advanced Manufacturing Series (NIST AMS) 400-2, May 4, 2021. DOI: [10.6028/NIST.AMS.400-2](https://doi.org/10.6028/NIST.AMS.400-2); publication page: https://www.nist.gov/publications/use-case-scenarios-digital-twin-implementation-based-iso-23247
48. NIST: Digital Twins for Advanced Manufacturing (project page; ISO 23247 Part 5 reference implementation, proposed VVUQ framework as Part 7, MTConnect interface, NIST Digital Twin Testbed). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
49. Voas, J.; Mell, P.; Laplante, P.; Piroumian, V. (2025): Security and Trust Considerations for Digital Twin Technology. NIST IR 8356 (final), February 14, 2025 (initial public draft 2021 titled "Considerations for Digital Twin Technology and Emerging Standards"). DOI: [10.6028/NIST.IR.8356](https://doi.org/10.6028/NIST.IR.8356); https://csrc.nist.gov/pubs/ir/8356/final
50. National Academies of Sciences, Engineering, and Medicine (2024): Foundational Research Gaps and Future Directions for Digital Twins. Consensus Study Report, The National Academies Press, Washington, DC (definition and quotes on p. 22). https://www.nationalacademies.org/our-work/foundational-research-gaps-and-future-directions-for-digital-twins ; chapter: https://www.nationalacademies.org/read/26894/chapter/4
51. Digital Twin Consortium (2020): Digital Twin Consortium Defines Digital Twin (definition released December 3, 2020). https://www.digitaltwinconsortium.org/2020/12/digital-twin-consortium-defines-digital-twin ; current definition page: https://www.digitaltwinconsortium.org/initiatives/the-definition-of-a-digital-twin/
52. IBM: What Is a Digital Twin? (component, asset, system and process twins). https://www.ibm.com/think/topics/what-is-a-digital-twin
53. ANSI/ITSDF B56.5-2024: Safety Standard for Guided Industrial Vehicles. ANSI Blog summary: https://blog.ansi.org/ansi/ansi-itsdf-b56-5-2024-guided-industrial-vehicles/
54. ANSI/A3 R15.08-1-2020 (R2026): Industrial Mobile Robots, Safety Requirements, Part 1: Requirements for the Industrial Mobile Robot (reaffirmed 2026, no technical changes). ANSI Webstore: https://webstore.ansi.org/standards/ria/ansia3r15082020r2026
55. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3); https://csrc.nist.gov/pubs/sp/800/82/r3/final
56. Deloitte (2025): 2025 Smart Manufacturing and Operations Survey, press release May 1, 2025 (600 executives, US manufacturers with $500 million+ revenue, survey August–September 2024). https://www.deloitte.com/us/en/about/press-room/deloitte-2025-smart-manufacturing-survey.html
57. MTConnect Institute: MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals, Version 1.4.0. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf ; about MTConnect: https://www.mtconnect.org/about
58. International Society of Automation (ISA): ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
59. International Society of Automation (ISA): ISA/IEC 62443 Series of Standards. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
60. NIST: Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep
61. Federal Trade Commission: Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, § 255.5 (disclosure of material connections, including an employee example); FTC notice on the revised Guides. https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf

---

# Editorial notes

## Unverified items and points to check before publication

- **[unverified] Roadmap durations (section 10):** The durations per phase are the author's experience, not sourced. The sourced overall range (two to three months to more than a year) comes from McKinsey [26]. (Carried over from the German version.)
- **[unverified] Agent-based simulation and VDI:** The simulation table states that no dedicated VDI guideline on agent-based simulation is known. Check the VDI guideline directory if needed. (Carried over.)
- **[unverified] No ANSI/ISA standard for virtual commissioning (section 7.5):** Our searches found none; ask a US controls expert or check the ISA and ANSI catalogs before publication. (New in the English version.)
- **ISO 23247-5:** Listed in the ISO catalog with publication 2026-06 but still shown as "under publication" on November 20, 2026. Check the status before publication and change to "published" if appropriate [7].
- **VDI 4499 Part 1:** The quotation (our translation) comes from the 2008 edition (via [17]). The new April 2026 edition [16] could not be read in full; check whether the definition changed.
- **Worked examples (Kingman, AGV):** The numbers are illustrative assumptions, not measurements. Kingman's formula is an approximation for a single station (G/G/1) [46].
- **ISO 23247-2 domains and observable manufacturing elements:** Description from a secondary source [43] and catalog information; the standard itself is paywalled. NIST AMS 400-2 [47] uses the same structure.
- **NASA roadmap Shafto et al.:** The original (TA11 roadmap, draft 2010) was not retrieved directly; evidence via [4]. The definition quote is supported by Glaessgen/Stargel [3].
- **SimPlan rules of thumb (1 percent of investment, 1:6):** Vendor source with reference to VDI; labeled as such in the text [30].
- **ZF 30 percent value:** Expectation from a 2021 trade press interview, labeled as such [28].
- **Deloitte figures [56]:** Self-reported survey results for smart manufacturing overall, not for digital twins; labeled as such in section 12.
- **ANSI/ITSDF B56.5 and AMRs:** The ANSI summary [53] does not say whether AMRs are in scope; the article assigns AMRs to R15.08 [54] and AGVs to B56.5. Have a US safety expert confirm the scope wording if the section is expanded.
- **iFAKT information:** Taken exclusively from ifakt.de [33][34][35]; check that it is current before publication. The product names "Polaris Designer" and "Polaris Simulator" match the m365.fm entity pages; ifakt.de lists the modules as Designer and Simulator under the Polaris platform. Only the Stuttgart headquarters is named; closed former locations are deliberately not mentioned. No "sponsored" or "paid partnership" label: iFAKT does not pay for publication. The disclosure line "Note: The author works at iFAKT GmbH." in section 17 and the author box discloses the author's material connection as required by the FTC Endorsement Guides (16 CFR Part 255, § 255.5) [61]; it is an employment disclosure, not a sponsorship label.
- **Microsoft status:** digital twin builder is a preview according to Microsoft Learn (page last updated May 20, 2026; re-checked November 20, 2026) [23]. Re-check before publication, since Microsoft often moves preview features to general availability.
- **Internal links:** Entity, blog and episode links were supplied by the client as verified (same as the German version); the English sister guides are linked absolutely under `https://www.m365.fm/en/learn/<slug>/` and marked "(planned)". Remove "(planned)" once the pages are live.
- **Open point from the German consistency check:** The m365.fm entity page for iFAKT is currently labeled "Sponsored" / "Paid partnership with iFAKT GmbH". This contradicts the confirmation that iFAKT does not pay. Align the entity page before this article goes live, since section 17 and the author box link to it.

## Vendor-only claims

- All descriptions of Polaris Designer and Polaris Simulator (section 17) are vendor claims [33][34][35].
- NVIDIA Mega blueprint (sections 7.6 and 9): vendor blog [25].
- SimPlan cost rules of thumb: vendor FAQ [30].

## Recommended graphics

1. Diagram model / shadow / twin with data-flow arrows (after Kritzinger et al. [5]).
2. ISA-95 level diagram with the twin's data sources mapped to each level.
3. Example PPR graph (product, process, resource with edges).
4. Roadmap as a six-phase timeline.
5. Simulation types compared (event-driven vs. continuous time advance).
6. New for the US version: the Kingman waiting-time curve (utilization on the x-axis, waiting time on the y-axis) from the table in section 6.

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://www.m365.fm/en/learn/digital-twin-manufacturing/#article",
      "headline": "Digital Twin in Manufacturing: The Complete Guide to Factory Simulation, Material Flow and Virtual Commissioning",
      "description": "Digital twin in manufacturing explained: twin vs. shadow vs. simulation, factory simulation, virtual commissioning, AGVs, ISO 23247 and a roadmap.",
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
      "mainEntityOfPage": "https://www.m365.fm/en/learn/digital-twin-manufacturing/",
      "about": [
        { "@type": "Thing", "name": "Digital twin", "sameAs": "https://www.m365.fm/entity/digital-twin/" },
        { "@type": "Thing", "name": "Factory simulation", "sameAs": "https://www.m365.fm/entity/factory-simulation/" },
        { "@type": "Thing", "name": "Virtual commissioning", "sameAs": "https://www.m365.fm/entity/virtual-commissioning/" }
      ],
      "mentions": [
        { "@type": "Thing", "name": "Industry 4.0", "sameAs": "https://www.m365.fm/entity/industry-4-0/" },
        { "@type": "Thing", "name": "Automated guided vehicle", "sameAs": "https://www.m365.fm/entity/automated-guided-vehicle/" },
        { "@type": "SoftwareApplication", "name": "iFAKT Polaris", "url": "https://www.m365.fm/entity/polaris/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/en/learn/digital-twin-manufacturing/#faq",
      "inLanguage": "en-US",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between a digital twin and a digital shadow?",
          "acceptedAnswer": { "@type": "Answer", "text": "In a digital shadow, data flows automatically from the physical to the digital object, but the return path is manual. In a digital twin, data flows automatically in both directions (Kritzinger et al. 2018)." }
        },
        {
          "@type": "Question",
          "name": "What data does a manufacturing digital twin need?",
          "acceptedAnswer": { "@type": "Answer", "text": "Mainly bills of materials, routings with times, work centers and capacities, shift patterns, orders and confirmations from ERP and MES. Machine and sensor data improves the model." }
        },
        {
          "@type": "Question",
          "name": "What standards apply to digital twins in manufacturing?",
          "acceptedAnswer": { "@type": "Answer", "text": "The core standards are ISO 23247, ISO/IEC 30173, IEC 63278-1 (Asset Administration Shell) and ISA-95 / IEC 62264, with ISA/IEC 62443 and NIST SP 800-82 for security. NIST AMS 400-2 shows how to apply ISO 23247." }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/en/learn/" },
        { "@type": "ListItem", "position": 2, "name": "Digital Twin in Manufacturing", "item": "https://www.m365.fm/en/learn/digital-twin-manufacturing/" }
      ]
    }
  ]
}
```

Schema note: the FAQPage contains three sample questions; for the live page, include all 19 FAQ questions from section 19. No `sponsor` or `rel="sponsored"` markup, since this is a disclosure of employment, not a paid partnership.

## hreflang and cannibalization

- hreflang: `en-US` https://www.m365.fm/en/learn/digital-twin-manufacturing/ <-> `de-DE` https://www.m365.fm/learn/digital-twin/; both pages reference each other and themselves.
- Cannibalization: the entity page [Digital Twin](https://www.m365.fm/entity/digital-twin/) and the blog post "Digital twin in manufacturing: where to start" target related terms. Keep the entity page as a short definition and the blog post as a narrow "getting started" piece, both linking to this guide as the pillar. The sister guides on value stream mapping, APS and Azure for manufacturing should link here for "digital twin" and not target the main keyword themselves.

---

## Review log

Review loop for the US English version with five roles, run on November 20, 2026. The German review protocol (three rounds, 28 facts checked online, consistency check of November 20, 2026) is the baseline; this log covers only the localization. The fact checker re-verified every new US source and every fact that changed against the German version online (list below).

### Round 1

| Role | Verdict | Main findings |
|---|---|---|
| Subject-matter expert (simulation / digital factory, US industrial engineering) | partly satisfied | (1) Section 7.5 claimed flatly that "there is no equivalent ANSI or ISA standard for virtual commissioning"; a negative claim like that cannot be proven by a search. (2) Checked that US method references (Law [41], NIST VVUQ work [48]) stand next to the German VDI guidelines: yes. (3) Checked that the AGV section says simulation does not replace the risk assessment required by B56.5 / R15.08: yes. |
| SEO specialist (US) | partly satisfied | Main keyword present in title, H1, short answer, first H2 and FAQ. Missing a "People also ask" question that appears repeatedly in the SERP: "What are examples of digital twins in manufacturing?". Meta title 49 and meta description 146 characters: OK. Confirms the four-type scheme (component/asset/system/process) and its FAQ are in place, since that scheme dominates US snippets. |
| US target reader (plant manager / VP operations; M365 admin as second persona) | partly satisfied | "Short-time work" in the data-quality list is a German concept (Kurzarbeit) that US readers will not recognize. Checked that a US support program for smaller plants (NIST MEP) and the DFARS/CMMC pointer for defense suppliers are present: yes. |
| Fact checker | partly satisfied | (1) Confirmed that the McKinsey example now reads "metal fabrication plant" with a reinforcement-learning agent, as in the source (the German text said "Metallverarbeiter"). (2) NIST IR 8356: final version (Feb 14, 2025) has a different title from the 2021 draft; checked that the article cites the final title (it does). (3) "Visualization trap that several US explainers warn about": only one SERP page (STX Next) uses the term. (4) ISO 23247-5 and digital twin builder status must be re-checked on the day, not carried over. |
| Critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms) | partly satisfied | "NIST is the most useful entry point" is opinion stated as fact. "Rightly" in section 7.1 is editorializing. "Hall models" in section 17 is a Germanism (Hallenmodelle). Abbreviations NIH/NSF unexplained. iFAKT section neutral, disclosure exact, only the Stuttgart headquarters named, no sponsorship wording: OK. No em-dash chains, no listed AI clichés found (checked with grep). |

### Discussion of conflicts and decisions

- **VDI guidelines vs. US standards (SME vs. SEO):** The SEO specialist suggested cutting VDI references to keep the page "American". The SME objected: VDI 3633 and VDI/VDE 3693 are the most detailed published guidelines for simulation studies and virtual commissioning, and no US equivalent was found. **Decision:** keep the VDI guidelines, label them "German" in text and in the standards table, and put US/international sources (ISO 23247, NIST AMS 400-2, ISA-95, ISA/IEC 62443, NIST SP 800-82, ANSI/ITSDF B56.5, ANSI/A3 R15.08, MTConnect) first where they exist.
- **Negative claim on virtual commissioning standards (SME vs. reader):** The reader wanted a clear "there is no US standard" for simplicity. **Decision:** keep the statement but phrase it as a search result and mark it [unverified]; listed in the editorial notes for a US controls expert to confirm.
- **Market forecasts (SEO vs. critic):** Competitors use digital-twin market size forecasts. The critic rejected them as unverifiable and irrelevant to plant decisions. **Decision:** no market forecasts; only the verified Deloitte 2025 survey figures, labeled as self-reported and as smart-manufacturing-wide.
- **CRA section (reader vs. SME):** The reader asked whether an EU regulation belongs in a US article. **Decision:** keep it, reframed as relevant for US machine and software makers that export to the EU.

### Optimization (old → new)

| Round | Location | Old | New |
|---|---|---|---|
| 1 | Section 7.5 | "There is no equivalent ANSI or ISA standard for virtual commissioning; US integrators generally work with these concepts and with the vendors' own methods." | "We found no ANSI or ISA standard dedicated to virtual commissioning [unverified]; US integrators typically work with these concepts and with their tool vendors' own methods." |
| 1 | Section 7.1 | "This is the 'visualization trap' that several US explainers rightly warn about." | "Some English-language explainers call this the 'visualization trap'." |
| 1 | Section 1, formal definitions | "NIST is the most useful entry point into ISO 23247." | "NIST offers a practical entry point into ISO 23247." |
| 1 | Section 11, data problems | "Shift calendars do not reflect extra shifts, short-time work or staff shortages." | "... extra shifts, reduced-hours periods (in Germany: *Kurzarbeit*, government-subsidized short-time work) or staff shortages." |
| 1 | Section 17 | "configurable station, line and hall models" | "configurable station, line and shop-floor (hall) models" |
| 1 | Section 19 FAQ | 18 questions, no examples question | new FAQ "What are examples of digital twins in manufacturing?" (now 19 questions) |
| 2 | Section 1 | "sponsored by the Department of Defense, the Department of Energy, NIH and NSF" | "sponsored by the US Department of Defense, the Department of Energy, the National Institutes of Health and the National Science Foundation" |
| 2 | Editorial notes, schema | "include all 15 FAQ questions" (German) | "include all 19 FAQ questions from section 19" |
| 2 | Sources / editorial notes | FTC disclosure mentioned without source | added source [61] (FTC Endorsement Guides, 16 CFR Part 255, § 255.5) |

### Localization changes against the German original (summary)

- **Definitions:** added the US definitions of the Digital Twin Consortium (2020) [51], the National Academies (2024) [50] and NIST IR 8356 (2025) [49] next to Kritzinger et al. [5].
- **ISO 23247 in the US:** added NIST AMS 400-2 [47] and the NIST "Digital Twins for Advanced Manufacturing" project (Part 5 reference implementation, proposed VVUQ Part 7, MTConnect interface) [48].
- **Data and connectivity:** ISA-95 now sourced from ISA itself [58]; MTConnect (ANSI/MTC1.4-2018) added as the machine-data standard common in US machine shops [57].
- **AGV/AMR safety:** ANSI/ITSDF B56.5-2024 [53] and ANSI/A3 R15.08-1-2020 (R2026) [54] added; VDI 2510 kept as German context.
- **Security:** ISA/IEC 62443 sourced from ISA [59]; NIST SP 800-82 Rev. 3 [55] and NIST IR 8356 [49] added; the EU Cyber Resilience Act [36] reframed for US exporters.
- **US benchmark data:** Deloitte 2025 Smart Manufacturing and Operations Survey [56] added, labeled as self-reported and not twin-specific.
- **German context explained:** VDI, acatech, Plattform Industrie 4.0, VDMA/ZVEI, REFA, Kurzarbeit, ZWF and the Saarbrücken and Saxony locations are now explained in passing; the VDI 4499 quote is marked "our translation".
- **US terms:** routing, work center, confirmation, MRP II, RFP, gemba walk, ton-miles, foot/meter; US spelling and number format throughout; dates in US format.

### Round 2

| Role | Verdict | Remaining comments |
|---|---|---|
| Subject-matter expert | satisfied | Distinction model/shadow/twin, simulation method, worked examples and AGV sizing are correct and labeled as approximations or illustrative assumptions. US and German method references now sit side by side. |
| SEO specialist (US) | satisfied | Main keyword in title, H1, short answer, H2 of section 1, conclusion and FAQ; secondary keywords (digital twin vs simulation, digital shadow, virtual commissioning, discrete event simulation, ISO 23247, AGV) covered in H2/H3 and FAQ; 19 FAQ incl. the main PAA questions; article about 2.8 times as long as the longest English competitor found; internal links to all relevant sister guides. |
| US target reader | satisfied | Use-case table with minimum data, data-quality checklist and roadmap are directly usable; MEP pointer and B56.5/R15.08 references help a US plant; admin persona finds the service decision table and the DFARS/CMMC pointer. |
| Fact checker | satisfied, subject to the items under "Editorial notes" | Open: ISO 23247-5 status, wording of VDI 4499 Part 1:2026, roadmap durations, the [unverified] virtual commissioning standards statement, B56.5 scope wording for AMRs. |
| Critic | satisfied | No marketing language, no AI clichés, no em-dash chains; iFAKT section factual, vendor claims labeled, limits stated; disclosure exactly "Note: The author works at iFAKT GmbH."; only the Stuttgart headquarters named, no sponsorship claim. |

### Facts re-verified online for the English version (fact checker, November 20, 2026)

1. Digital Twin Consortium definition and release date December 3, 2020 [51]
2. National Academies report: title, 2024, sponsors (DoD, DOE, NIH, NSF), definition and "bidirectional interaction" quote on p. 22 [50]
3. NIST IR 8356 final: title, authors, February 14, 2025, DOI; draft title 2021 [49]
4. NIST AMS 400-2: title, author Guodong Shao, May 4, 2021, DOI, SME focus, three use cases [47]
5. NIST Digital Twins for Advanced Manufacturing: ISO 23247 contribution, Part 5 reference implementation, proposed VVUQ Part 7, MTConnect interface, "lack of standards" [48]
6. IBM four types (component/part, asset, system/unit, process) [52]
7. ANSI/ITSDF B56.5-2024 title and scope [53]
8. ANSI/A3 R15.08-1-2020 (R2026): title, reaffirmation 2026 without technical changes, scope [54]
9. NIST SP 800-82 Rev. 3: title, September 28, 2023, DOI [55]
10. Deloitte 2025 survey: 600 executives, $500M+ revenue, US, August–September 2024, 78% / >20% of improvement budget, up to 20% output; no twin-specific figure [56]
11. MTConnect: open standard for manufacturing data interoperability; ANSI/MTC1.4-2018 cover designation [57]
12. ISA-95: ANSI/ISA-95 = IEC 62264, Purdue-based levels, focus on interface between levels 3 and 4 [58]
13. ISA/IEC 62443: requirements and processes for secure IACS [59]
14. NIST MEP: Department of Commerce program, 450+ service locations, all 50 states and Puerto Rico [60]
15. McKinsey 2024 (re-check): authors, date, 75 respondents June 2022, 86/44/15%, 5–7%, about 4%, two to three months to more than a year, "metal fabrication plant" with four parallel lines [26]
16. Microsoft digital twin builder: still "(Preview)", page last updated May 20, 2026 [23]
17. ISO 23247-5: still "under publication", Edition 1, 2026-06 [7]
18. EU Cyber Resilience Act: reporting obligations from September 11, 2026, main provisions from December 11, 2027 (English Commission page) [36]
19. FTC Endorsement Guides: 16 CFR Part 255, § 255.5 material connections incl. employee example [61]

### Final verdict

After two rounds, all five roles are satisfied. The English version keeps the depth of the German original, replaces or supplements German sources with verified US and international equivalents where they exist, and keeps German context where it adds value, explained for US readers. Before publication, resolve the items under "Editorial notes", in particular the ISO 23247-5 status, the VDI 4499 Part 1:2026 wording, the preview status of digital twin builder, the [unverified] items, the iFAKT entity page label and the author box details.

**Word count (`wc -w`, H1 through end of section 20 Conclusion): 13,363 words.** German original (same range): 10,424 words. Longest English competitor found: about 4,800 words.
