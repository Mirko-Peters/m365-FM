# SEO metadata

| Field | Value |
|---|---|
| Meta title | Value Stream Mapping: Symbols, Metrics & Worked Example (55 characters) |
| Meta description | Value stream mapping (VSM) step by step: symbols, takt time and lead time formulas, a fully calculated example, future state design and VSM software. (149 characters) |
| Slug | `/en/learn/value-stream-mapping/` (full URL: https://www.m365.fm/en/learn/value-stream-mapping/) |
| Main keyword | value stream mapping |
| Secondary keywords | VSM, value stream map, value stream mapping symbols, value stream mapping metrics, value stream mapping example, how to create a value stream map, current state map, future state map, value stream design, takt time, cycle time, lead time, process cycle efficiency (PCE), flow ratio, activity ratio, inventory days, Little's Law, data box, timeline / lead time ladder, supermarket, FIFO lane, pacemaker process, heijunka, pitch, kaizen burst, spaghetti diagram, 8 wastes, value stream mapping software, digital value stream mapping, dynamic value stream mapping, VSM simulation, Value Stream 4.0, value stream management, value stream manager, ISO 22468 |
| Search intent | Mainly informational (definition, steps, symbols, metrics, example, current vs. future state). Secondary commercial/transactional share for "value stream mapping software" and templates. A large part of the US SERP for the bare keyword is about software delivery (DevOps); this article targets manufacturing and flags the difference in section 17. |
| Target word count | At least 8,000 words in the article; longest English-language competitor in the google.com top results about 4,000 words (leandatapoint.com, estimate). **Actual (`wc -w`, H1 to end of Conclusion): 13,303 words.** |
| Language version | `en-US`. hreflang pair: `en-US` https://www.m365.fm/en/learn/value-stream-mapping/ <-> `de-DE` https://www.m365.fm/learn/wertstromanalyse/ |

# Competitive analysis (google.com SERP, November 2026)

Basis: web searches on November 20, 2026 for "value stream mapping", "how to create a value stream map step by step current state future state", "value stream mapping symbols metrics example lean manufacturing guide" and "value stream mapping software manufacturing" (US-weighted search tool), plus a fetch of each page below. Word counts exclude navigation and footer and are estimates from the fetched text; no SEO tool data was available for the US SERP.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| leandatapoint.com/resources/value-stream-mapping-example | ~4,000 | longest competitor; takt, production lead time, VA time and PCE formulas; worked bracket example; symbols in three groups; 8 wastes; paper vs. digital; FAQ | vendor page; PCE uses an 8-hour day although the shift is 450 min; WIP figures inconsistent; unsourced statistics; pacemaker, pitch and kanban sizing named but not explained; no capacity check with changeovers |
| atlassian.com/continuous-delivery/principles/value-stream-mapping | ~3,000–3,300 | history, benefits, challenges, 7 wastes, nine steps | second half is about software delivery; no formulas, no example, no FAQ |
| kaizen.com/insights/value-stream-mapping-bottleneck-capacity | ~2,500 | lead time ladder, flow efficiency, bottleneck test, OEE at the constraint, common errors | symbols only as images; no future-state design guidelines; no data box reference |
| planview.com (What is Value Stream Mapping? guide) | ~2,300–2,400 | pros and cons, link to value stream management, industry examples | no formulas, no symbols, no worked example |
| smartsheet.com/content/create-value-stream-map | ~2,000–2,500 | six steps, symbol list, expert tips, AI section | only one formula (activity ratio), circular lead time definition, no numbers, no FAQ |
| lucid.co/diagram/vsm/value-stream-mapping-tutorial | ~1,800–2,100 | history, four phases, nine-question FAQ | no formulas, no example, symbols only on a separate page |
| slidemodel.com (VSM guide for manufacturing leaders) | ~1,600 | six-step framework, KPI definitions in prose | no formulas, no example, no FAQ |
| isixsigma.com (step-by-step guide for beginners) | ~1,400 | seven steps, related tools | no formulas, no example, no FAQ |
| techtarget.com/searcherp/definition/value-stream-mapping | ~1,300–1,400 | history, benefits, challenges | cycle time defined incorrectly ("time it takes a supplier to deliver"), no symbols, no formulas |
| asq.org/quality-resources/lean/value-stream-mapping | ~1,100–1,250 | association source; takt formula with example; team size and kaizen event; product family rule (about 80% shared steps) | figures not rendered as text; no value-added ratio formula; no future-state guidelines |
| en.wikipedia.org/wiki/Value-stream_mapping | ~900–1,000 | neutral definition, value stream vs. value chain, Hines/Rich tools | no symbols in text, no metrics, no example |
| tulip.co/blog/value-stream-mapping | ~700 | five steps, MES angle | no formulas, example referenced but missing |

Note: jellyfish.co, gitlab.com, harness.io, jetbrains.com and itrevolution.com rank for the bare keyword but cover value stream management in software delivery and do not match the manufacturing intent.

**"People also ask" style questions collected** (from SERP snippets, competitor FAQs and question headings): What is value stream mapping in simple terms? What are the steps of value stream mapping? What is the difference between a current state and a future state map? What is the difference between value stream mapping and process mapping? What symbols are used in value stream mapping? What metrics go on a value stream map? How do you calculate process cycle efficiency? How long does a value stream mapping exercise take? Is value stream mapping Lean or Six Sigma? What are the disadvantages of value stream mapping? Is there free value stream mapping software or a template?

**How this article beats the competition:** None of the English pages calculates a value stream consistently from current to future state. This article runs one example with the same base data through takt time, effective cycle time (including availability), inventory days, lead time, flow ratio and a capacity check that includes daily changeovers, and it reconciles the result with Little's Law [12]. It quotes the Rother/Shook guidelines verbatim [11], lists Erlach's design guidelines [3][4], gives a complete symbol table, maps the terminology US readers meet (flow ratio vs. process cycle efficiency vs. activity ratio), and places the method in the research on dynamic and digital value stream mapping with DOI-verified papers from ZWF, CIRP Annals and Fraunhofer IPA [13][16][17][18][23]. It adds ISO 22468:2020 [40], US resources (LEI, ASQ, NIST MEP, EPA, ANSI/ISA-95) [45][46][47][48][50], the value stream manager role, a neutral software category comparison and a clear separation from value stream management in software delivery.

---

# Value Stream Mapping: The Complete Guide to VSM Symbols, Metrics, Future State Design and Value Stream Management

*Updated November 20, 2026 · Reviewed against the literature listed under Sources, including DOI-referenced papers from the German production engineering journal ZWF and the Lean Enterprise Institute's own publications*

> **Short answer:** Value stream mapping (VSM) is a Lean method for drawing the material and information flow of one product family, from supplier to customer, on a single page with standard symbols. A timeline with lead time, processing time and inventory days shows how little of the total time adds value. A future state map then designs a leaner flow, and an implementation plan makes it happen.

In many plants an order sits in the factory for three or four weeks, while the actual work on it adds up to a few minutes. The German-language Wikipedia gives a typical case: four weeks of lead time against ten minutes of pure processing time [27]. If you only look at individual machines, you never see that gap. Value stream mapping forces you to look at the whole flow: Where does material sit? Why does it sit there? Who tells each process what to make next, and when?

This guide explains the method from the ground up. You get the full symbol set, a step-by-step guide, every important metric with its formula and a fully calculated example, the design guidelines for the future state, the limits of the paper-based method, dynamic and digital value stream mapping, Value Stream 4.0, value stream management as a leadership job, and a neutral overview of software categories. For a compact definition, see the m365.fm entity page [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

A note on sources: value stream mapping (German: *Wertstromanalyse*) has a strong research tradition in Germany, at Fraunhofer IPA and TU Darmstadt among others. Where a German source adds something the English literature lacks, it stays in the text with a short explanation.

### Key takeaways

- Value stream mapping always looks at one **product family** and the whole door-to-door flow, not at single machines or departments.
- You draw **from the customer backward**, upstream, with a pencil, on the shop floor at the gemba (Japanese for "the actual place", here the production floor).
- The core metrics are **takt time, cycle time, inventory days, lead time and the flow ratio** (also called process cycle efficiency or activity ratio). Inventory days follow from Little's Law: inventory divided by demand.
- The current state map is only half the method. Results come from the **future state map**, built with clear design guidelines, and an **implementation plan** with owners and dates.
- The classic map is a **snapshot** built on averages. With high product variety and volatile demand, dynamic simulation and automatically collected data extend the analysis.
- **Value stream management** turns a one-off workshop into an ongoing leadership task with an accountable value stream manager.

### Reading paths for busy readers

| You are … | Read first |
|---|---|
| New to Lean, or a student | Sections 1 to 4 (definition, history, goals, symbols) |
| A first-time facilitator or Lean coach | Sections 5 to 8 (step-by-step guide with workshop agenda, metrics, example, future state design) and 14 (common mistakes) |
| A plant manager or operations leader | Section 7 (example with current and future state numbers), sections 10 to 13 (limits, dynamic and digital VSM, Value Stream 4.0, value stream management) |
| An IT, MES or Microsoft 365/Azure lead | Sections 11 (dynamic and digital VSM), 12 (Value Stream 4.0) and 15 (software categories) |

## Table of contents

1. What Is Value Stream Mapping? Definition and How It Differs from Process Mapping
2. History: From Toyota's Material and Information Flow Diagram to "Learning to See"
3. Goals and Benefits of Value Stream Mapping
4. Value Stream Mapping Symbols: Complete Reference Table
5. How to Create a Value Stream Map: Step-by-Step Guide to the Current State
6. Value Stream Mapping Metrics and Formulas
7. Value Stream Mapping Example: One Value Stream Fully Calculated
8. Future State Mapping: Design Guidelines from Rother/Shook and Erlach
9. Finding Waste: The 8 Wastes and the Spaghetti Diagram
10. Limits of Traditional Value Stream Mapping
11. Dynamic and Digital Value Stream Mapping
12. Value Stream 4.0: Information Logistics as a Second Dimension
13. Value Stream Management: Running the Value Stream as a Leadership Job
14. Common Value Stream Mapping Mistakes and How to Avoid Them
15. Value Stream Mapping Software: Categories Compared
16. Digital Value Stream Mapping with iFAKT Polaris VSM and BSM
17. Value Stream Management in Software Delivery: How It Differs
18. Evidence and Research Publications
19. FAQ: Value Stream Mapping Questions Answered
20. Conclusion

## 1. What Is Value Stream Mapping? Definition and How It Differs from Process Mapping

The Lean Enterprise Institute (LEI) defines value stream mapping as "diagraming every step involved in the material and information flows needed to bring a product from order to delivery" [45]. ASQ calls it "a lean tool that employs a flowchart documenting every step in the process" [46]. Put more precisely: for one product family, a value stream map shows every activity needed to bring a product from raw material to the customer. That includes value-adding and non-value-adding activities, the physical material flow, and the information flow that controls it. The result fits on one large sheet, usually 11 × 17 in (tabloid, close to the A3 size used in Europe), and is drawn with standard symbols.

The **value stream** is the sum of those activities. In English, "value stream mapping" and "VSM" are the standard terms; "value stream analysis" is used too, mostly for the current state work. Klaus Erlach of the Fraunhofer Institute for Manufacturing Engineering and Automation IPA in Stuttgart draws a clean line between **value stream analysis** (recording and assessing the current state) and **value stream design** (designing the future state) [3][4]. Together they form the value stream method. The German industrial engineering association REFA defines the analysis in similar terms as a method for showing all processes and flows of a value-adding process [37].

Since March 2020 there has been an international standard, **ISO 22468:2020 "Value stream management (VSM)"**. ISO describes it as guidelines for collecting, evaluating and continuously improving value stream data and for assessing value streams with defined KPIs, applicable to material-, energy- and data-related processes [40]. The table of contents (published by DIN, the German standards body) structures value stream management into basic procedure, value stream analysis, value stream design, value stream planning, and the assessment and adjustment of value streams, with an informative annex on data boxes and application examples [40]. ISO confirmed the standard as current in its 2025 review [40]. It is a useful reference if you want to anchor the method in a company-wide production system.

### How VSM differs from related methods

| Method | Focus | Difference from value stream mapping |
|---|---|---|
| Process mapping / flowchart | individual procedures, often in one department | no information flow, no inventory, no timeline |
| Material flow analysis | transport routes, quantities, layout | looks at logistics, not at how information controls the flow |
| Value analysis / value engineering (in Germany: VDI 2800) | functions and cost of a product | product-related, not flow-related |
| Porter's value chain | strategic activities of a company | management model, not an operational flow diagram; English Wikipedia makes the same distinction [49] |
| Swimlane diagram / BPMN | business processes with responsibilities | strong in the office, weaker on inventory and takt |
| Simulation | time-dependent behavior of a system | dynamic and detailed but more effort; complements VSM (see section 11) |

What makes value stream mapping different is the combination of three things on one page: material flow, information flow and a timeline. The introduction to *Learning to See* explains that Toyota teaches three flows in manufacturing (material, information, and people/process) and that the mapping method covers the first two so that manufacturers "think of flow instead of discrete production processes" [1].

## 2. History: From Toyota's Material and Information Flow Diagram to "Learning to See"

Value stream mapping comes from the Toyota Production System. At Toyota the tool is called "Material and Information Flow Mapping". Toyota practitioners used it to depict current and ideal states when planning Lean implementations, not as a training tool [1]. The phrase "value stream" itself is rarely heard at Toyota [1]. LEI's lexicon also describes the tool as a Toyota development that Toyota calls a material and information flow diagram [45].

Mike Rother noticed the mapping method while studying Toyota's Lean implementation practices, formalized it and built a training method around it [1]. Together with John Shook, who had spent eleven years with Toyota in Japan and the US [1], he published the workbook **"Learning to See"** with LEI in 1998 (the introduction is signed in Ann Arbor, Michigan, and dated May 1998; the first edition's subtitle was "Value Stream Mapping to Create Value and Eliminate Muda", the current one reads "… to Add Value and Eliminate Muda") [1]. The book received the Shingo Research and Professional Publication Award in 1999 [1]. Its case study of the fictional stamping plant "Acme Stamping" takes readers from the current state through the search for waste to the future state [1]. LEI's current edition is dated 2018 (ISBN 978-0-9667843-0-5, 148 pages) [1].

In German-speaking countries, three books shaped how the method spread; one of them later appeared in English:

- **Rother/Shook: "Sehen lernen"**, the German edition of the LEI workbook, published by the Lean Management Institut in Aachen (version 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; 1st ed. 2007, 2nd ed. 2010, ISBN 978-3-540-89867-2; 3rd ed. 2020, ISBN 978-3-662-58906-9) [3]. Erlach systematizes the method for factory planning. An English edition, **"Value Stream Design: The Way Towards a Lean Factory"**, appeared with Springer in 2012 (copyright 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

The method was later transferred to office and knowledge work, most prominently by Karen Martin and Mike Osterling in "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, published October 2013, copyright 2014, ISBN 978-0-07-182891-8) [6].

In the US, the method is part of the standard Lean toolkit taught by LEI, ASQ and the NIST Manufacturing Extension Partnership (MEP). NIST MEP calls VSM "often the first step in applying lean process improvements" [47]. In Germany, it is part of so-called holistic production systems, whose basics are described in guideline **VDI 2870 Part 1** (July 2012) from the Association of German Engineers (VDI). According to VDI, the guideline is partly still valid and under revision [7].

## 3. Goals and Benefits of Value Stream Mapping

The overall goal is a flow aligned with the customer: material should move through the plant with as little waiting as possible, and each process should make only what the next process actually needs. That leads to concrete goals:

- **Shorten lead time.** The timeline shows how much of the total lead time is waiting. Because inventory usually accounts for most of the lead time, reducing it is the strongest lever.
- **Make waste visible.** Overproduction, inventory, waiting and unnecessary transport show up directly on the map.
- **Simplify scheduling.** The map shows how many points the ERP system sends orders to. The aim is to schedule at one point only, wherever possible.
- **Create a common language.** Production, logistics, planning and sales discuss the same flow on the same page.
- **Prioritize improvements.** Instead of local optimization, you get an implementation plan that targets the whole flow.

### When is value stream mapping worth it?

The method fits best in repetitive and mixed-model production with recurring products, high inventory and long delivery times, before layout changes, new plant designs or capacity investments, when on-time delivery is poor despite high utilization, and as the entry point into a Lean program. The classic form fits less well in pure job-shop or engineer-to-order production with changing routings, because a stable product family is hard to define there. Extended approaches such as simulation or data-driven analysis help in those cases (see section 11). Small and midsize US manufacturers who want outside facilitation can turn to the NIST MEP Centers, which list value stream mapping among the lean methods they help apply [47].

### Pros and cons at a glance

| Pros | Cons |
|---|---|
| end-to-end view of the flow from the customer's perspective | snapshot based on averages |
| simple, standard symbols | little detail on variants and changeover sequences |
| low barrier to entry: paper, pencil, stopwatch | manual data collection takes time and goes stale quickly |
| quantitative results (lead time, flow ratio) | variability, breakdowns and batch-size effects are not shown |
| connects material and information flow | future states cannot be tested on paper |
| strong basis for improvement actions and communication | impact depends on disciplined implementation |

The right-hand column is why research and industry have been extending the method in dynamic and digital directions for more than ten years [16][23]. More on that from section 10 on.

## 4. Value Stream Mapping Symbols: Complete Reference Table

The symbols go back to *Learning to See* [1][2] and are deliberately simple so that anyone can draw them with a pencil. Books and software libraries differ slightly. What matters is that your team agrees on a legend and uses it consistently. The tables below describe the common symbols as used by Rother/Shook and Erlach [1][3].

### Process and material flow symbols

| Symbol (how it looks) | Name | Meaning and use |
|---|---|---|
| factory building with saw-tooth roof | customer / supplier (outside source) | customer at top right, supplier at top left; below it a data box with demand, delivery frequency and packaging |
| rectangle with a header line and the process name | process box | one process through which material flows continuously; a new box starts where the flow stops and inventory builds up |
| rectangle below the process box | data box | process data: cycle time, changeover time, uptime/availability, batch size, number of operators, shifts, scrap |
| triangle with an "I" | inventory | material sitting between two processes; quantity and days of inventory are written below it |
| broad striped arrow | push arrow | material is pushed by the upstream process according to its own schedule, not according to the needs of the next process |
| broad hollow arrow | shipment | raw material from the supplier to the plant, or finished goods from the plant to the customer |
| truck (or train, plane, ship) | external shipment | means of transport with delivery frequency, e.g. "2× per week" |
| shelf open on the left | supermarket | controlled buffer stock from which the customer process withdraws; the supplying process only replaces what was taken |
| circular arrow | withdrawal (pull) | physical withdrawal from the supermarket by the downstream process |
| arrow with "FIFO" and a maximum quantity | FIFO lane | limited queue between two processes; parts run in order of arrival, and the supplying process stops when the maximum is reached |
| triangle with a safety note | safety or buffer stock | inventory against demand fluctuations (buffer) or process breakdowns (safety) |
| circle with an operator's head | operator | number of people at a process |

### Information flow symbols

| Symbol (how it looks) | Name | Meaning and use |
|---|---|---|
| straight thin arrow | manual information flow | information on paper or spoken, e.g. route card, delivery note, verbal instruction |
| lightning-bolt arrow (zigzag) | electronic information flow | EDI, ERP or MES messages, email |
| rectangle "Production Control" | production control | planning, MRP or ERP, often with the planning frequency |
| card with a cut corner, solid | production kanban | signal to a process to make a defined quantity |
| card with a cut corner, hatched or otherwise marked depending on the library | withdrawal kanban | instruction to a material handler to fetch parts from the supermarket |
| triangle standing on its tip | signal kanban | triggers a batch when supermarket inventory reaches a reorder point; typical for processes with changeovers |
| mailbox-like symbol | kanban post | place where kanbans are collected for pickup |
| dashed arrow with kanban | kanban path | route of the cards back to the supplying process |
| box with a grid of slots "OXOX" | heijunka box (load leveling box) | tool for leveling volume and mix at the pacemaker process |
| eyeglasses | go-see scheduling | scheduling by visual check instead of systematic signals; a sign that improvement is needed |

### General symbols

| Symbol (how it looks) | Name | Meaning and use |
|---|---|---|
| jagged starburst ("kaizen burst") | improvement need | marks a spot on the current or future state map where improvement is needed |
| square wave along the bottom | timeline (lead time ladder) | waiting times (inventory days) on one level, processing times on the other; totals for lead time and processing time on the right |

Some online guides describe the dashed arrow as electronic information flow [38]. In *Learning to See*, the lightning-bolt arrow stands for electronic information and the straight thin arrow for manual information [1]. Stick to that convention so maps stay readable across plants and software tools. An illustrated walkthrough of the symbols is in the post [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

For office processes, such as order handling before production, Polaris BSM adds BPMN swimlanes to the value stream symbols [30]. Research has picked up the same idea: the Value Stream Mapping 4.0 approach from TU Darmstadt explicitly includes all order-handling departments, starting from the first customer contact [14].

## 5. How to Create a Value Stream Map: Step-by-Step Guide to the Current State

The guide below follows the logic of Rother/Shook and Erlach [1][3] and adds practical detail. For a first map of a manageable value stream, plan one to two days with a small team [unverified]. Recommendations on team size differ: ASQ calls about 10 members ideal and suggests a three-day kaizen event for the kickoff [46], while a German practitioner guide from Mind Logistik prefers a small team of up to six people [42]. Both are practice recommendations, not research findings. Choose the smaller team if the value stream is short and the larger one if many departments touch it.

> **If you are facilitating for the first time: a proven agenda**
>
> - **Team:** people from production (supervisor or shift lead), logistics, production planning, maintenance and quality; add sales or order management if delivery time is the problem. The future value stream owner takes part.
> - **Materials:** 11 × 17 in paper or a roll of brown paper, pencil and eraser, clipboard, stopwatch, an inventory count sheet, and a symbol legend agreed in advance.
> - **Clarify upfront:** product family, customer demand over the last months, shift pattern and breaks. Announce the walk in the affected areas and explain that processes are being assessed, not people.
> - **Day 1:** introduction to goal and symbols (about one hour), walk the flow backward from shipping in pairs, merge the data into one map, calculate the metrics.
> - **Day 2 or a follow-up session:** validate the map with the areas, add kaizen bursts, work through the future state questions (section 8), start the implementation plan with owners.
>
> Durations and team makeup are experience values and depend on the size of the value stream [unverified].

### Step 1: Define the goal and scope

Before the first walk, decide which question the map should answer. Examples: Why is our delivery time 15 days when the customer expects 5? How much floor space do we gain by cutting inventory? Set the boundaries. The usual scope is "door to door", from receiving to shipping within one plant [1]. A value stream across several plants or suppliers (extended value stream) is the second step, not the first.

Name an owner as well. Rother/Shook recommend giving responsibility for the value stream to one person, the value stream manager, instead of splitting it across departments. LEI defines this role as "an individual assigned clear responsibility for the success of a value stream" [10]. More in section 13.

### Step 2: Define the product family

A product family is a group of products that go through similar processing steps on shared equipment. The tool for this is a **product-process matrix**: products or variants in the rows, processes in the columns. Products with mostly the same check marks form a family. ASQ suggests looking for products that share about 80% of their steps [46]. As a rule of thumb, the work content of products in one family should not differ much [unverified]. The German-language Wikipedia stresses that value streams are formed along process chains or material flows, and that splitting them by function is unusual because it works against short lead times [27].

For your first map, choose a family with a high share of revenue or a pressing problem. A Pareto (ABC) analysis by volume and revenue helps.

### Step 3: Capture customer demand

Start the map at the top right with the customer symbol. In the data box, write the demand (e.g. pieces per month), the variant mix, the batch size or pack quantity, the delivery frequency and the required delivery time. From demand and available working time, calculate the **takt time** (formula in section 6). Takt time is the reference for every other assessment.

### Step 4: Walk the process at the gemba, backward from shipping

Walk the flow against its direction, from shipping to receiving. Rother/Shook explain that this way you start with the processes closest to the customer, which should set the pace [1]. The German-language Wikipedia also describes recording backward from the customer via the producer to the supplier [27].

Draw a process box for every section where material flows continuously. Where material sits, a process box ends and an inventory triangle begins. Use your own observations and a stopwatch, not ERP data. The ERP system knows standard times from routings, not what actually happens at the workstation.

### Step 5: Fill in the data boxes

Record at least the following data for each process:

| Data field | Abbreviation | Explanation |
|---|---|---|
| Cycle time | C/T | time between two good parts at the end of the process |
| Processing time (value-added time) | P/T, VA | time during which work actually adds value to the part |
| Changeover time | C/O | time from the last good part of the old batch to the first good part of the new batch |
| Uptime / availability | | share of planned time in which the equipment can actually produce; decide whether changeovers are included or tracked separately |
| Batch size / EPEI | | pieces per batch, or "every part every interval": how often each variant is produced |
| Operators | | number of people per shift |
| Shifts | | number of shifts and available time per shift after breaks |
| Scrap / rework | | share of defective parts |

For processes with several machines in parallel, note the number of machines and calculate the process's effective cycle time (cycle time per machine divided by the number of machines).

### Step 6: Count inventory

Count inventory on the floor, not in the system. Write the quantity under each inventory triangle and convert it into **days of inventory** using daily demand. Also count the inventory that "doesn't count": parts in waiting areas, on carts, in rework corners. That is often where most of the waiting time hides.

### Step 7: Add external material flows

At the top left, draw the main supplier (or the suppliers of the most important raw materials) and connect supplier, receiving, shipping and customer with truck symbols and delivery frequencies.

### Step 8: Draw the information flow

The information flow is the part teams most often neglect, even though it explains why material sits. Ask at every process: How does this process know what to make next? Typical answers are a weekly schedule from the ERP system, a daily list from the supervisor, a kanban, a shout across the aisle, or "whatever is there". Draw production control in the top center, connect customer and supplier with electronic or manual arrows, and show which information reaches each process. Where a process gets several signals or schedules by looking, add the eyeglasses for go-see scheduling.

Then mark the material flows between processes as push (striped arrow), FIFO, or pull (supermarket and withdrawal).

### Step 9: Draw the timeline and calculate the metrics

The timeline goes under the processes. On one level, enter the days of inventory; on the other, the processing times of the processes. On the right, add both up to the **lead time** and the **processing time** and calculate the **flow ratio**. In branched value streams, the longest path determines the lead time [41].

### Step 10: Mark waste and validate

Mark problems with kaizen bursts: processes with cycle times above takt, high inventory, long changeovers, low uptime, multiple scheduling points. Review the finished map with the employees in the affected areas. Validation by the people on the floor keeps a workshop team from drawing a value stream that doesn't exist in the plant.

### Current state checklist

- [ ] Goal, scope and value stream owner defined
- [ ] Product family defined with a product-process matrix
- [ ] Customer demand, variants and takt time determined
- [ ] All processes recorded on the floor and backward
- [ ] Data boxes filled with measured values
- [ ] Inventory counted and converted into days
- [ ] Suppliers, customer and transport drawn
- [ ] Information flow clarified for each process
- [ ] Timeline, lead time, processing time and flow ratio calculated
- [ ] Kaizen bursts added and map validated with employees

## 6. Value Stream Mapping Metrics and Formulas

Metrics make value stream maps comparable. In ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, a German-language production engineering journal published by De Gruyter), Jörg Drees and Christoph Sack show that value stream metrics such as inventory reduction, resource utilization, delivery capability and short lead times seem to pursue conflicting goals but, applied correctly, give consistent recommendations. They propose a core set of metrics that form control loops together with targeted Lean methods [19]. The formulas below cover that core set. More definitions are on the entity pages [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) and [Takt Time](https://www.m365.fm/entity/takt-time/).

**A note on terminology.** US guides use several names for the same ratio. What German texts call *Flussgrad* appears in English as flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency or, in Karen Martin's terminology, activity ratio ("the sum of the Process Times for all the individual steps divided by Total Lead Time") [44]. This guide uses **flow ratio** throughout. Likewise, "inventory days", "days of supply" and "days of inventory" mean the same thing.

### Takt time

> **Takt time = available working time per period ÷ customer demand per period**

LEI gives the example of a widget factory that operates 480 minutes per day while customers demand 240 widgets per day, which gives a takt time of two minutes [8]. ASQ works the same formula with 22,000 seconds and 200 pieces, which gives 110 seconds per piece [46]. Available working time is shift time minus planned breaks. Unplanned downtime is not subtracted; it belongs in availability. The word "takt" is German (it means beat or pulse, as in music). According to LEI, takt was first used as a production management tool in the German aircraft industry in the 1930s and was widely used at Toyota in the 1950s [8].

### Cycle time and effective cycle time

Cycle time is the time between two good parts at the end of a process. To compare it with takt time, account for availability and scrap:

> **Effective cycle time = cycle time ÷ (availability × first-pass yield)**

A process with a 98-second cycle time and 85% availability effectively produces one part every 115 seconds. Against a takt time of 117 seconds it is almost fully loaded, even though the nominal cycle time suggests 16% headroom.

Watch for a common mix-up: some English guides use "cycle time" for the total time a unit spends in the process, or even for the supplier's delivery time. On a value stream map, cycle time always means the interval between two good parts at the end of one process.

### Inventory days and Little's Law

> **Inventory days = inventory (pieces) ÷ daily demand (pieces per day)**

The German-language Wikipedia calculates 280 pieces at a daily demand of 80 pieces as 3.5 days of inventory [27]. This calculation applies **Little's Law**, which John D. C. Little proved in 1961 in the journal Operations Research [12]:

> **L = λ × W**, rearranged: **W = L ÷ λ**

L is the average inventory in the system, λ the average throughput rate and W the average time in the system. Applied to a value stream: the average time a part waits in a buffer equals the inventory divided by the consumption rate. Little's Law holds for stable systems over the long run. For single days with demand spikes, or for a system during ramp-up, the formula is only an approximation. That is one of the reasons for dynamic value stream mapping (section 11).

### Lead time

> **Production lead time = Σ inventory days + Σ processing times (along the longest path)**

Because processing times are usually measured in seconds or minutes and inventory in days, the sum of inventory days dominates the result. A diploma thesis at Hochschule Mittweida (a German university of applied sciences) summarizes Erlach's definition of production lead time as the sum of processing and process times plus the inventory ranges, with the longest path being decisive [41]. Martin's glossary puts it more generally: lead time equals process time plus wait time [44].

### Processing time and process time

**Processing time** is the time during which the part is being worked on. Erlach also distinguishes **process time** for steps such as drying, curing or heat treatment, which take time without anyone working on the part [41]. Both count toward the flow ratio.

### Flow ratio (process cycle efficiency)

> **Flow ratio = (processing time + process time) ÷ lead time × 100%**

The German-language Wikipedia describes the flow ratio as the share of pure processing time in total lead time and calls it the key metric of value stream analysis [27]. Watch the time base. If lead time is given in working days, convert it into seconds using the daily working time, as Erlach's formula does with its "daily working time" factor [41]. If you calculate in calendar days, the flow ratio drops further. Pick one convention and stick to it, or current and future state are not comparable.

### Other metrics

| Metric | Formula / definition | Use |
|---|---|---|
| Load relative to takt | effective cycle time ÷ takt time | values above 100% show a bottleneck |
| Number of operators needed | Σ work content ÷ takt time | basis for line balancing |
| EPEI | time until every variant has been produced once | shows flexibility and batch-size effects |
| Changeover share | (number of changeovers × changeover time) ÷ available time | shows how much capacity is free for smaller batches |
| Load including changeovers | (daily demand × cycle time + changeovers × changeover time) ÷ (available time × availability) | checks whether a future state with small batches can still meet takt (example in section 7) |
| On-time delivery | orders delivered on time ÷ all orders | result metric from the customer's view |
| %C&A (percent complete and accurate) | share of work that the downstream step receives complete and error-free | quality of handoffs; mostly used in office value streams [44] |
| OEE | availability × performance × quality | equipment effectiveness; the data box often shortens it to uptime |

An operator balance chart (a bar chart of effective cycle times with a horizontal line for takt time) makes bottlenecks and overcapacity visible at a glance. Erlach uses it to show how well capacity is aligned with takt [3]. The German-language Wikipedia notes that cycle times close to takt point to bottlenecks, and cycle times well below takt point to overcapacity and waste [27].

## 7. Value Stream Mapping Example: One Value Stream Fully Calculated

The following example is **fictional and built for this guide**. It shows how the metrics connect and runs the current and future state with the same base data.

### Starting point

A supplier makes a product family of hydraulic valve housings in five variants with the same routing: sawing, turning, milling, washing, assembly. The customer calls off an average of 9,200 pieces per month, spread over 20 working days. The plant runs two 8-hour shifts, each with a 30-minute break.

**Step A: Calculate takt time**

- Daily demand: 9,200 pieces ÷ 20 days = **460 pieces per day**
- Available working time: 2 × (480 min − 30 min) = 900 min = **54,000 s per day**
- Takt time: 54,000 s ÷ 460 pieces = **117.4 s per piece**

### Current state: process data

| Process | Cycle time | Changeover time | Availability | Effective cycle time | Load vs. takt |
|---|---|---|---|---|---|
| Sawing | 45 s | 30 min | 95% | 47.4 s | 40% |
| Turning | 98 s | 60 min | 85% | 115.3 s | 98% |
| Milling | 125 s | 45 min | 90% | 138.9 s | **118%** |
| Washing | 40 s | 0 min | 98% | 40.8 s | 35% |
| Assembly | 105 s | 15 min | 95% | 110.5 s | 94% |

Simplifications: processing time equals cycle time here because each process works on one part after another. Scrap is ignored. Availability covers only breakdowns; changeovers are treated separately.

**Bottleneck finding:** Milling is already above takt at a nominal 125 s, and at an effective 138.9 s it is 18% above. In one day, milling makes 54,000 s × 0.90 ÷ 125 s = **389 pieces** instead of the 460 needed. Changeovers reduce that number further. The plant closes the gap with Saturday overtime shifts. Turning looks uncritical on paper (98 s) but is loaded at 98% once availability is included. If you ignore availability, you miss this second near-bottleneck.

### Current state: inventory and timeline

| Inventory | Quantity | Days of inventory (quantity ÷ 460) |
|---|---|---|
| Raw material before sawing | 4,600 pieces | 10.0 days |
| After sawing | 1,380 pieces | 3.0 days |
| After turning | 920 pieces | 2.0 days |
| After milling | 690 pieces | 1.5 days |
| After washing | 460 pieces | 1.0 day |
| Finished goods | 1,150 pieces | 2.5 days |
| **Total** | **9,200 pieces** | **20.0 days** |

- **Processing time:** 45 + 98 + 125 + 40 + 105 = **413 s** (just under 7 minutes)
- **Lead time:** 20.0 working days + 413 s ≈ **20 working days**
- **Flow ratio (working-time basis):** 413 s ÷ (20 × 54,000 s) = 413 ÷ 1,080,000 = **0.038%**
- **Flow ratio (calendar basis):** 20 working days correspond to about 28 calendar days; 413 s ÷ (28 × 86,400 s) = **0.017%**

**Plausibility check with Little's Law:** total inventory of 9,200 pieces ÷ throughput of 460 pieces per day = 20 days [12]. The sum of the individual inventory days and the overall calculation match. If this check does not work out on your map, you have either missed inventory or mixed reference values.

**Information flow finding:** Production planning sends a weekly schedule to all five processes. Each process produces to its own schedule and pushes material on. There is no quantity limit between processes, so inventory piles up in front of the bottleneck. The assembly supervisor steps in daily with rush orders (go-see scheduling).

### Future state: improvement actions

Using the design guidelines from section 8, the team designs this future state:

1. **Remove the milling bottleneck:** tooling and fixture improvements cut cycle time from 125 to 95 s; a TPM initiative (total productive maintenance, preventive maintenance with operator involvement) raises availability from 90 to 95%.
2. **Stabilize turning:** program optimization cuts cycle time from 98 to 90 s; TPM raises availability from 85 to 92%.
3. **Balance assembly:** work content is redistributed, and cycle time drops from 105 to 95 s.
4. **Cut changeover times (SMED):** because every variant will be made every day, each process needs five changeovers per day. SMED (single-minute exchange of die: preparing the changeover while the machine is still running) cuts changeover time in turning from 60 to 10 min, in milling from 45 to 10 min and in assembly from 15 to 5 min. Without this step the future state would not be feasible: five changeovers of 60 minutes each do not fit into the free capacity of turning.
5. **FIFO links:** turning, milling, washing and assembly are connected by three FIFO lanes with maximum quantities of 60, 30 and 30 pieces.
6. **Supermarket after sawing:** because sawing is much faster and has to change over, a supermarket holding half a day of inventory (230 pieces) decouples it. A signal kanban triggers new batches.
7. **Assembly as pacemaker:** planning sends customer orders only to assembly. A heijunka box spreads the five variants evenly over the day. With a pack quantity of 20 pieces, the pitch is 20 × 117.4 s ≈ 39 minutes.
8. **Finished goods supermarket:** one day of inventory (460 pieces) buffers fluctuations in customer call-offs.
9. **Supplier link:** raw material deliveries increase from once to twice a week; raw material inventory drops to five days (2,300 pieces).

### Future state: capacity check with changeovers

A future state must meet takt time even with daily changeovers. The check therefore calculates two values: effective cycle time compared with takt, and load including changeovers.

> **Load including changeovers = (daily demand × cycle time + changeovers × changeover time) ÷ (available time × availability)**

| Process | Cycle time | Changeover time | Availability | Effective cycle time | Load vs. takt | Load incl. 5 changeovers |
|---|---|---|---|---|---|---|
| Sawing | 45 s | 30 min | 95% | 47.4 s | 40% | 58% |
| Turning | 90 s | 10 min | 92% | 97.8 s | 83% | 89% |
| Milling | 95 s | 10 min | 95% | 100.0 s | 85% | **91%** |
| Washing | 40 s | 0 min | 98% | 40.8 s | 35% | 35% |
| Assembly | 95 s | 5 min | 95% | 100.0 s | 85% | 88% |

Worked for milling: (460 × 95 s + 5 × 600 s) ÷ (54,000 s × 0.95) = 46,700 ÷ 51,300 = 91%. All processes stay below 100%, with the highest value in milling. The pacemaker, assembly, has some reserve for call-off fluctuations at 88%.

### Future state: result

| Metric | Current | Future | Change |
|---|---|---|---|
| Total inventory | 9,200 pieces | 2,300 + 230 + 120 + 460 = 3,110 pieces | −66% |
| Lead time (Little) | 20.0 working days | 3,110 ÷ 460 = 6.8 working days | −66% |
| Processing time | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12% |
| Flow ratio (working-time basis) | 0.038% | 365 ÷ (6.76 × 54,000) = 0.100% | factor 2.6 |
| Bottleneck | milling 118% (without changeovers) | highest load milling 91% incl. changeovers | takt met without Saturday shifts |
| Scheduling points | 5 (weekly schedule to all) | 1 (pacemaker assembly) | simpler planning |

The FIFO lanes are counted at their maximum quantities (60 + 30 + 30 = 120 pieces). In operation they are rarely full, so the future inventory is a cautious upper limit.

Two lessons from the example. First, scheduling and inventory measures deliver most of the lead time reduction, not faster machines. Processing time falls by 12%, lead time by 66%. Second, even the improved flow ratio of 0.1% is still low. That is typical for plants with a raw material buffer. What matters is the direction, and a takt time that can be met reliably even with daily changeovers.

## 8. Future State Mapping: Design Guidelines from Rother/Shook and Erlach

Future state design answers the question of how the value stream should flow. *Learning to See* takes readers from the current state to a "map of a leaner future state" and to a value stream plan that steers implementation and is reviewed regularly [1].

### Key questions for the future state according to Rother/Shook

Rother/Shook structure the design through a series of key questions [1] (paraphrased):

1. What is the takt time?
2. Do we build to a finished goods supermarket or directly to shipping?
3. Where can we use continuous flow?
4. Where do we need supermarket pull systems?
5. At which single point in the production chain (the pacemaker process) do we schedule production?
6. How do we level the production mix at the pacemaker process?
7. What increment of work do we consistently release and take away at the pacemaker?
8. What process improvements are needed to make the future state work?

### The Rother and Shook guidelines

In an article for LEI's Lean Post (October 19, 2022), Mike Rother and John Shook summarize the guidelines for a lean value stream as follows [11]:

| No. | Guideline (original wording) | What it means |
|---|---|---|
| 1 | "Produce to your takt time" | align production with customer demand |
| 2 | "Develop continuous flow wherever possible" | create one-piece flow wherever you can |
| 3 | "Use supermarkets to control production where continuous flow does not extend upstream" | use supermarkets where flow is not possible |
| 4 | "Try to send the customer schedule only to one production process" | send customer orders to one process only (the pacemaker) |
| 5 | "Distribute the production of different products evenly over a set time at the pacemaker process" | level the product mix at the pacemaker (heijunka) |
| 6 | "Create an 'initial pull' by releasing and withdrawing small, consistent increments of work at the pacemaker process" | level the production volume |

Secondary sources name a seventh guideline from *Learning to See*: the ability to make every part every day in the processes upstream of the pacemaker ("every part every day"), and later every shift or every hour [1] [unverified: not checked against the book text]. The example in section 7 shows why this guideline requires short changeover times.

### Erlach's design guidelines

Klaus Erlach organizes value stream design into eight design guidelines that build on each other [3]. They fall into three groups: design of production processes (guidelines 1 and 2), production control (3 to 5) and production planning (6 to 8). The names below follow Erlach's German book and the overview on his website; the English edition (Springer 2012/2013) is described by its publisher as conveying "ten design guidelines" [4], so numbering may differ in the English text.

| No. | Design guideline [3] | Key question for your value stream |
|---|---|---|
| 1 | Alignment with takt time | Are all processes designed to meet takt time reliably, and where is there overcapacity? |
| 2 | Process integration | Which process steps can be combined physically and organizationally into continuous flow? |
| 3 | FIFO coupling | Where can processes be linked by limited FIFO lanes instead of unlimited storage? |
| 4 | Kanban control | Where is a supermarket with kanban needed because processes have different cycle times or changeovers? |
| 5 | Pacemaker process | At which single process are customer orders scheduled? |
| 6 | Defining the release unit | In which time increment is work released at the pacemaker (pitch)? |
| 7 | Production mix leveling | How are variants spread evenly, and where does campaign building make sense? |
| 8 | Bottleneck control | How is a remaining bottleneck controlled so that it never runs empty? |

The order follows the logic of the three groups: a leveled production mix (guideline 7) assumes that processes are aligned with takt and that control through FIFO, kanban and pacemaker works (guidelines 1 to 5).

### Future state terms in brief

- **Continuous flow (one-piece flow):** parts move one at a time from process to process without intermediate storage.
- **Supermarket and kanban:** the downstream process withdraws, the supplying process replaces only what was taken. More on the entity pages [Kanban](https://www.m365.fm/entity/kanban/) and [Pull System](https://www.m365.fm/entity/pull-system/).
- **FIFO lane:** a queue with a maximum quantity; when it is full, the supplying process stops. FIFO is simpler than kanban and suits high-variety parts that should not be built to stock.
- **Pacemaker process:** the only process that receives customer orders. Upstream processes are controlled by supermarket pull or FIFO lanes; downstream processes run in continuous flow or FIFO.
- **Heijunka:** leveling of volume and mix, for example with a heijunka box that has a slot per time increment.
- **Pitch / release unit:** the time increment in which work is released and finished goods are taken away: takt time × pack quantity, in the section 7 example 20 × 117.4 s ≈ 39 minutes.
- **SMED and TPM:** SMED cuts changeover times by preparing changeover work while the machine is still running; TPM raises availability through preventive maintenance. Both are often prerequisites for a future state with small batches.

### From future state to implementation plan

A future state without a plan is just a nice poster. Split the future state into **value stream loops**: the pacemaker loop (from the pacemaker to the customer) and the upstream loops up to each supermarket. Each loop gets goals, actions, owners and dates. Rother/Shook recommend starting with the pacemaker loop because it is closest to the customer [unverified]. Plan in cycles of a few months and review progress regularly, for example in a monthly value stream review.

Valuation is a common obstacle. Busch, Niehues and Maassen describe in ZWF that industry often fails to realize value stream potential because the benefit is poorly quantified. They extend the value stream method with a cost-based valuation model that links operational and strategic metrics [25]. For your implementation plan, that means: translate inventory reduction, floor space gained and lead time reduction into dollars before you ask for budget.

## 9. Finding Waste: The 8 Wastes and the Spaghetti Diagram

Value stream mapping is a tool for finding waste (Japanese: muda). The classification of the seven wastes goes back to Taiichi Ohno [9][32]; LEI lists them as overproduction, waiting, conveyance, processing, inventory, motion and correction [9]. Jeffrey Liker added an eighth in "The Toyota Way" (2004): unused employee creativity and skills [33]. In the US, the eight are often taught with the acronym DOWNTIME: defects, overproduction, waiting, non-utilized talent, transportation, inventory, motion, extra processing [51]. A compact overview is on the entity page [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| No. | Waste | How to spot it on the value stream map |
|---|---|---|
| 1 | Overproduction | push arrows, large batches, inventory after fast processes; according to LEI "the worst form of waste because it contributes to the other six" [9] |
| 2 | Waiting | operators wait for machines, material or approvals; low load relative to takt |
| 3 | Transportation | many truck and transport arrows, intermediate storage between processes |
| 4 | Overprocessing | process steps without customer value, duplicate inspections |
| 5 | Inventory | inventory triangles with many days, supermarkets without maximum quantities |
| 6 | Motion | long walks for employees, searching for parts and tools (better seen in a spaghetti diagram) |
| 7 | Defects / correction | scrap and rework in the data box, return-flow arrows |
| 8 | Unused talent | go-see scheduling, no involvement in drawing the map, no improvement suggestions |

### The spaghetti diagram as a complement

The value stream map shows the flow at an abstract level. It does not show how far parts and people actually travel. That is what the **spaghetti diagram** is for: on a scaled floor plan, trace every route of a part or a person with a pen. The result often looks like a plate of spaghetti and makes transport and motion waste visible at once. LEI reports the case of Thrustmaster of Texas, a Houston-based maker of marine propulsion equipment, where a spaghetti chart of the thruster assembly area revealed more than seven miles of walking and nearly 10 hours of non-value-added time per unit; after a layout redesign focused on flow and standard work, the company reported 100% on-time delivery 18 months later [43]. Use the spaghetti diagram after the value stream map for the processes with the most prominent kaizen bursts. Details on the entity page [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Limits of Traditional Value Stream Mapping

Paper-based value stream mapping is simple on purpose. That simplicity is its strength and also its limit. The literature mainly discusses five weaknesses.

**1. Snapshot.** The map shows the state of one day or one week. In ZWF, Lugert and Winkler note that the static character of value stream mapping becomes a growing problem under current production megatrends, and they call for dynamic value stream management [23]. Fraunhofer IPA asks whether individual snapshots are enough to analyze a production process in full [22].

**2. Averages instead of distributions.** Data boxes hold averages. Fluctuating cycle times, breakdowns and demand spikes disappear into the mean. Little's Law holds for the long-run average of stable systems [12] but says nothing about the spread of individual orders.

**3. Product variety.** As early as 2011, Drees and Sack pointed to more complex value chains, growing numbers of product variants and everyday demand fluctuations [19]. With hundreds of variants and different routings, it becomes almost impossible to form a product family with uniform cycle times.

**4. Manual data collection.** According to Fraunhofer IPA, clipboard data and estimated averages are less up to date, accurate and complete than digitally gathered data [22]. In many companies, data for value stream mapping is collected manually as a snapshot only [21]. The effort means that maps are rarely updated.

**5. No test of the future state.** Whether FIFO lanes of 30 pieces are enough, or whether a supermarket runs empty during demand spikes, cannot be checked on paper. Türck, Weimer, Schubert and Drees (iFAKT GmbH) therefore ask what new optimization opportunities arise when the time factor is taken into account [16].

There is also a content gap: the classic method mainly improves material flow. The information flow is drawn but hardly assessed. That is where Value Stream Mapping 4.0 comes in (section 12) [13][15].

## 11. Dynamic and Digital Value Stream Mapping

The method is evolving along two axes: **dynamic** (simulating time behavior and variability) and **digital** (collecting data automatically and calculating metrics continuously). Both axes add to the classic method; neither replaces it.

### From the static map to simulation

As early as 2014, Stefan Türck, Andreas Weimer, Lars Schubert and Jörg Drees of iFAKT GmbH described in ZWF the path from the static analysis of value streams and their metrics to **dynamic simulation** [16]. Their starting point was that value stream modeling is established in many manufacturing companies and that digital tools for it are gaining acceptance [16]. Dynamic value stream mapping asks not only how high the average inventory is, but how it develops over time when orders fluctuate, machines break down or changeover sequences change.

In practice, the value stream map becomes a model in which each symbol has behavior. A process no longer has a fixed cycle time but a distribution; a supermarket has a reorder point and a maximum; customer demand follows a time series. The simulation shows whether the future state works under realistic conditions, where buffers are too small and what lead time distribution to expect. More on factory simulation in general on the entity page [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Comparison: static vs. dynamic value stream mapping

| Criterion | Static (classic) VSM | Dynamic VSM / simulation |
|---|---|---|
| Data basis | averages from one on-site recording | distributions, time series, event data |
| Time reference | snapshot | development over days, weeks, months |
| Product variety | product family with uniform values | variants with their own routings and changeover sequences |
| Variability and breakdowns | not shown | modeled through distributions and breakdown profiles |
| Metrics | lead time, flow ratio, inventory days as single values | plus spread, percentiles, load over time |
| Testing the future state | not possible, expert judgment only | scenarios comparable before implementation |
| Effort | low: paper and stopwatch | higher: modeling and data maintenance |
| Tools | paper, whiteboard, diagramming software | specialized VSM software with simulation link, simulation suites |
| Strength | understanding, communication, involvement | de-risking investments and buffer sizes |
| Typical use | entry, workshop, Lean training | plant planning, high-mix production, capacity decisions |

### Digital value stream mapping: data from the plant instead of the clipboard

The second axis is data collection. In ZWF, Christian Urnauer shows how **process mining** can derive processes, their links and performance metrics from production timestamps, giving value stream mapping a data-driven perspective [24].

Fraunhofer IPA follows a similar path under the motto "We are automating the gemba walk": from digital data capture on the shop floor to visualized value stream metrics, with current analyses, consistent data-based metrics, and simple integration of energy and carbon footprint KPIs [22]. US manufacturers have a public reference for the environmental side as well: the EPA's Lean & Environment Toolkit recommends selecting "one or two environmental performance metrics to measure for each process in the value stream", such as the amount of hazardous waste per shift, and writing them into the process boxes next to cycle time and uptime [48].

In ISA-95 terms (ANSI/ISA-95, known internationally as IEC 62264), the data for a digital value stream comes from Level 4 business systems such as ERP, Level 3 manufacturing operations systems such as MES, and Level 2 control systems and sensors [50]. That layering helps when you discuss with IT which system delivers which data box field.

A concrete example is the research project **ECOWERT** ("real-time-oriented value stream analysis for sustainable production optimization") by Fraunhofer IPA and iFAKT GmbH. It ran from September 1, 2021, to August 31, 2022, had a volume of €500,000 and was funded by the German state of Baden-Württemberg through its Invest BW program [20]. The goal was a value stream analysis that collects ERP, MES, machine and sensor data automatically, updates it continuously and adds energy value stream data [20]. Jörg Drees and Steffi Stambera (iFAKT) and Markus Böhm (Fraunhofer IPA) describe the architecture: raw data travels via an IIoT gateway and MQTT (with the Sparkplug payload specification) into a time series database and is evaluated by the software Polaris VSM. Their conclusion: the result is an approach that can produce value stream analyses almost in real time, and retrofitting machines with simple sensors is already enough to generate the data [21].

To reuse this data, Böhm, Drees, Sai, Erlach, Stambera and Teriete developed a **universal data interface for digital value stream services**. They treat shop floor events as structured raw data for optimization services and standardize the data stream so that services can connect through a single interface. A service for calculating and visualizing metrics was connected in the ECOWERT project [18]. The authors include Klaus Erlach (Fraunhofer IPA), author of the standard work on value stream design [18][3].

### From digital value stream to digital twin

When the value stream map is updated continuously from real-time data and coupled with a simulation model, it becomes a building block of a digital twin of production. Siemens, for example, offers a VSM Library add-on for Plant Simulation X that lets users "run dynamic simulations of value streams" and "create and compare multiple scenarios", such as current and future state [35]. More on the concept on the entity page [Digital Twin](https://www.m365.fm/entity/digital-twin/) and in the planned guide [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned).

How a value stream works as a living data model is also discussed in the m365.fm episode [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Important caveat:** digitization does not fix a bad flow. TU Darmstadt explicitly recommends first establishing a stable, lean flow with classic value stream design and only then tackling digital improvements. It advises against digitizing complex processes before they are stable [14].

## 12. Value Stream 4.0: Information Logistics as a Second Dimension

**Value Stream Mapping 4.0** was developed at the Institute of Production Management, Technology and Machine Tools (PTW) at TU Darmstadt in Germany. Tobias Meudt, Joachim Metternich and Eberhard Abele presented it in 2017 in CIRP Annals under the title "Value stream mapping 4.0: Holistic examination of value stream and information logistics in production" [13]. An English book followed: "Value Stream 4.0: A Systems View of Information Flow for Digitalization" by Metternich, Meudt and Hartmann (CRC Press, released July 2025, copyright 2026) [15].

The core idea: alongside material flow, **information logistics** is analyzed systematically. Information should be available at the right time, in the right place, in the right quantity and quality, with as little waste as possible [14]. According to the guide "Industrie 4.0 trifft Lean" (Industry 4.0 meets Lean) from the German Mechanical Engineering Industry Association (VDMA), developed scientifically by Metternich, Meudt and Hartmann, the method includes these elements [14]:

- **Wider scope:** from the first customer contact to product use, across all order-handling departments.
- **Extended process boxes:** with information sources, recording intervals, type of recording (automated, semi-automated, manual) and current values.
- **Storage media as lines:** paper, ERP, MES, Excel and other storage media are drawn as horizontal lines and connected to the sources by vertical lines.
- **Eight types of information logistics waste**, organized along the data life cycle: at creation and transfer (data selection, data quality, data capture, data transfer), at processing and storage (waiting and inventory of information; transport, motion and searching) and at use (data analysis, decision support).
- **Metrics:** information availability, information use and degree of digitization.

In the example of a special machinery builder, the analysis found twelve storage media in use, manual duplicate data entry, and a degree of digitization and data use of zero percent each [14].

Bega and colleagues extended Value Stream Mapping 4.0 in 2023 in the journal Production Engineering for comprehensive identification of data and information flows [26]. That shows Value Stream 4.0 is not a finished method but an active research field.

In 2018, Jörg Drees took a related view from a software vendor's perspective in ZWF under the title "Wertstrom Management 4.0: Next Generation": the growing interconnection of information through Industry 4.0 and the industrial internet of things (IIoT) creates new expectations, and method and software must adapt to new forms of organizing and controlling the value chain [17].

## 13. Value Stream Management: Running the Value Stream as a Leadership Job

A value stream mapping project has a beginning and an end. **Value stream management** is ongoing. It means leading a value stream across departmental boundaries for the long term, with regular map updates, goals at value stream level and clear responsibility. A detailed introduction is in the post [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert and Winkler argue that technical Industry 4.0 solutions alone are not enough to turn static value stream mapping into a dynamic management approach. Organization and people must be considered equally [23]. ISO 22468:2020 reflects this cycle in its structure: analysis, design, planning, assessment and adjustment of value streams [40].

### The value stream management cycle

1. **Analyze:** record the current state, ideally with automatically collected data.
2. **Design:** draw the future state using the design guidelines, ideally validated by simulation.
3. **Plan:** implementation plan by value stream loop, with goals and owners.
4. **Implement:** actions in kaizen events and daily work.
5. **Assess:** track metrics continuously and value the impact in money [25].
6. **Adjust:** update the map and derive the next future state.

### The role of the value stream manager

LEI describes the value-stream manager as "an individual assigned clear responsibility for the success of a value stream". This person identifies value from the customer's perspective, designs the value stream and drives toward ever-faster flow. Because the money, assets and people usually sit with the functional departments, the value stream manager "leads through influence, not position". LEI names Toyota's chief engineer as the model for the role [10].

In practice, the value stream manager typically:

- owns the current and future state maps and the implementation plan
- facilitates the regular value stream review
- tracks value stream metrics (lead time, inventory, on-time delivery, productivity)
- resolves goal conflicts between departments
- escalates obstacles to plant management

The post [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) describes the profile, authority and typical pitfalls of the role in detail. How value stream management is supported by software in manufacturing is covered in [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

Value stream management is closely tied to [Lean management](https://www.m365.fm/entity/lean-management/) as a whole; see the planned guides [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned) and [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned). The daily routines that keep a future state alive, such as tiered meetings and gemba walks, are the subject of the planned guide [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned).

## 14. Common Value Stream Mapping Mistakes and How to Avoid Them

| Mistake | Consequence | Countermeasure |
|---|---|---|
| mapping at a desk from ERP data | map shows standard times, not reality | record at the gemba with stopwatch and counts |
| no product family defined | map becomes cluttered and cannot be evaluated | product-process matrix before the first walk |
| too much detail | workshop gets lost in single steps | draw a process box only where the flow stops |
| information flow left out | cause of inventory stays unclear | ask at every process: how does it know what to make? |
| availability not included | bottlenecks are missed | compare effective cycle time with takt time |
| current state only, no future state | analysis without impact | future state design and implementation plan are mandatory |
| future state as an ideal picture without a plan | frustration, nothing happens | value stream loops with goals, owners, dates |
| employees not involved | resistance, wrong data | validate the map together with the areas |
| one-off project without an owner | map is outdated within weeks | name a value stream manager, set a review rhythm |
| digitizing before stabilizing | waste gets automated | stabilize the flow first, then digitize [14] |
| different time bases for current and future state | flow ratios not comparable | fix the convention (working or calendar days) once |

## 15. Value Stream Mapping Software: Categories Compared

People searching for "value stream mapping software" mostly want to know which tool fits, which features it should have and whether there are free options. Instead of a ranking of single products, a split into categories helps, because the tools differ less in drawing than in what happens after drawing.

| Category | Typical examples | Strengths | Limits | Best for |
|---|---|---|---|---|
| Paper and whiteboard | brown paper, sticky notes, pencil | maximum involvement, no tool skills needed, free | no calculation, hard to share and version | first map at the gemba, training |
| General diagramming and whiteboard software | Microsoft Visio, Lucidchart, Miro, EdrawMax | symbol libraries, collaboration, often free entry tiers | metrics mostly manual, no logic behind the symbols | documentation, distributed teams |
| Specialized VSM software with metric calculation | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | symbols with built-in formulas, automatic timeline, variant and scenario comparison | license costs, learning curve | regular value stream work, value stream management |
| VSM software with simulation link | SimVSM Pro [34], Plant Simulation X with VSM Library [35] | dynamic analysis, testing the future state | more modeling and data effort | high-mix production, investment decisions |
| Data-driven analysis / process mining | ONIQ [36], research approaches such as ECOWERT [20] | metrics from production data, continuous instead of one-off analysis | data quality and IT integration are decisive | plants with an MES/ERP data foundation |
| Value stream management platforms (software delivery) | platforms per Gartner's market definition [31] | end-to-end measurement of the software delivery chain | not designed for physical production | IT and software organizations |

Read vendor claims critically. ONIQ, for example, states that automation reduces the effort for value stream analysis by up to 90% [36]; no independent methodology has been published. SimPlan describes SimVSM as covering digital recording and static key figures, with SimVSM Pro adding dynamic parameters and an interface to simulation [34].

### Selection criteria

- **Symbols:** Does the tool support the common Rother/Shook symbols, and can you add your own?
- **Calculation logic:** Are takt time, inventory days, lead time and flow ratio calculated automatically? Are the formulas transparent and adjustable?
- **Scenarios:** Can you version and compare current, future and intermediate states?
- **Dynamics:** Is there a simulation or a link to a simulation tool?
- **Data connection:** Can the tool start without an ERP or MES connection and take over data automatically later?
- **Implementation:** Are actions, kaizen bursts and owners managed in the same tool?
- **Collaboration and operations:** roles and permissions, multi-tenancy, cloud or on-premises, integration into the existing IT landscape (for Microsoft-based plants, see the planned guide [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)).
- **Cost:** license model, trial, training effort.

A good check question: does the tool only help document the current state, or does it also support steering the future state while the plant changes week after week?

## 16. Digital Value Stream Mapping with iFAKT Polaris VSM and BSM

> **Note: The author works at iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), based in Stuttgart, Germany, was founded in 2001 by Jörg Drees [19]. Employees of the company wrote several of the ZWF papers on dynamic and digital value stream mapping cited in this guide (overview in section 18, "Research publications"). The software family [iFAKT Polaris](https://www.m365.fm/entity/polaris/) grew out of this work; a separate guide is planned at [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned). Two modules are relevant for value stream mapping:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** is a digital Lean management tool that manufacturers use to map supply chains and value streams. According to Microsoft's post on its AppSource listing, metrics can be calculated, checked and visualized through a formula system, complemented by Kanban and Kaizen boards and collaboration from any location [29]. On ifakt.de, the vendor lists these functions [28]:

- drag-and-drop value stream maps with standard symbols and multi-level hierarchies
- automatic metrics such as lead time, cycle time, value-added ratio and OEE in dashboards, with export-ready reports
- unlimited scenarios, sensitivity analysis, version history with rollback and side-by-side metric comparison
- role-based permissions, multi-tenancy and PDCA documentation
- start without an ERP or MES connection, with optional data connection later

In the ECOWERT research project, Polaris VSM served as the evaluation tool for automatically collected data (see section 11) [21]. The vendor does not list a simulation function in the narrow sense; for dynamic analysis you need a tool from the "simulation link" category (section 15). Benefit figures on the vendor page (such as a 25% shorter lead time) are not repeated here because no methodology is given.

**[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) adds business processes to the value stream view. According to the AppSource listing, process steps are grouped in pools and lanes, and time factors and metrics are recorded and compared; the plans range from "Read Only" through "Basic" (BPMN recordings, swimlane templates, basic formulas, lead time and balance chart) to "Excellence" and "Integrate & Customize" [30]. That is useful when the value stream does not start in production but in quoting, engineering and order handling.

Both modules are listed on Microsoft AppSource [29][30]. The vendor does not publish prices; a demo is available on request [30].

**Assessment:** A tool like Polaris VSM does not replace going to the gemba or designing the future state. It takes over calculations, makes scenarios comparable and can keep the map current when data flows in automatically. Whether it fits your plant depends on product variety, available data and IT landscape. Check it against the selection criteria in section 15 like any other solution.

## 17. Value Stream Management in Software Delivery: How It Differs

If you search for "value stream mapping" or "value stream management" on google.com, many results come from software development and DevOps. Gartner describes value stream management platforms as tools that "enable organizations to optimize end-to-end product delivery and improve business outcomes"; they are tool-agnostic and connect to existing tools across the software delivery life cycle [31]. Mik Kersten's Flow Framework in "Project to Product" (IT Revolution, 2018) introduced metrics such as flow time and flow load for this world [39].

The basic idea is the same as in the factory: make the flow from customer request to delivery visible and cut waiting. The differences are large, though. In software delivery, work items flow instead of material, inventory is unfinished tickets, and takt time is hard to define meaningfully. Martin and Osterling transferred the method to office and knowledge work and put metrics such as percent complete and accurate (%C&A) at the center: the share of work that the downstream step finds complete and error-free. Multiplied across all steps, it gives the rolled %C&A, which Martin's glossary calls rolled first pass yield [6][44]. For manufacturing, the classic method with takt time, inventory and timeline remains the reference point.

## 18. Evidence and Research Publications

Robust, independently published case figures for value stream mapping are rarer than the many success claims online suggest. These are documented:

- **Special machinery builder (TU Darmstadt / VDMA):** twelve storage media and a degree of digitization of zero percent (details in section 12) [14].
- **ECOWERT (Fraunhofer IPA and iFAKT):** value stream analysis almost in real time with retrofitted sensors (details in section 11) [20][21].
- **HELLA (ZWF 2018):** development of a cost-based valuation model for value stream actions together with the German automotive supplier HELLA GmbH & Co. KGaA, to prioritize competing improvements in business terms [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, Lean management at Schaeffler AG, and Herwig Winkler (BTU Cottbus-Senftenberg) describe the path from static value stream mapping to dynamic value stream management [23].
- **Thrustmaster of Texas (LEI):** case report on the spaghetti chart as a complement to flow analysis, with 100% on-time delivery reported 18 months later [43].

The well-known textbook case "Acme Stamping" from *Learning to See* is fictional [1] but works well for practice.

### Research publications on dynamic and digital value stream mapping

The following papers were written by authors from iFAKT GmbH, partly together with Fraunhofer IPA. They are in German and can be checked by DOI at the publisher. Together they trace the development from metric calculation through simulation to an event-based data interface:

| Year | Title (English translation) | Authors | Publication |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Production optimization through value stream modeling metrics) | J. Drees, C. Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Dynamic simulation of value streams) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (New perspectives for the value stream method) | J. Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Universal data interface for digital value stream services) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Collecting data for value stream analyses automatically) | J. Drees, S. Stambera, M. Böhm | IT&Production, January 12, 2023 [21] |

Further independent ZWF papers on extending the method include Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] and Urnauer (2019) [24]. In English, the main research lines are Meudt et al. in CIRP Annals (2017) [13] and Bega et al. in Production Engineering (2023) [26].

## 19. FAQ: Value Stream Mapping Questions Answered

### What is value stream mapping in simple terms?
A value stream map is a one-page map of your production flow. Simple symbols show which processes a product goes through, where material sits, how long that takes and which information controls the processes. It shows how little of the lead time actually adds value.

### What are the steps of value stream mapping?
Define goal and scope, define the product family, capture customer demand and takt time, walk the process backward from shipping, fill in the data boxes, count inventory, add suppliers and transport, draw the information flow, draw the timeline and calculate the metrics, then mark waste and validate the map. After that come the future state map and the implementation plan. Section 5 explains each step.

### What is the difference between a current state map and a future state map?
The current state map records how material and information flow today, with measured data. The future state map designs how they should flow, following guidelines such as producing to takt time, continuous flow where possible, supermarkets where flow is not possible, and one pacemaker process [11]. Together they form the value stream method, followed by an implementation plan.

### What is the difference between value stream mapping and process mapping?
A process map shows the steps of one procedure, often within one department. A value stream map covers one product family door to door and adds what a process map lacks: inventory between steps, the information flow that controls production, and a timeline with lead time and processing time.

### What is the difference between value stream mapping and value stream management?
Value stream mapping is a project: a team records the current state and designs a future state. Value stream management is the ongoing leadership of the value stream by an accountable value stream manager, with a regularly updated map, metrics and reviews. ISO 22468:2020 describes this cycle of analysis, design, planning, assessment and adjustment [40].

### What symbols are used in value stream mapping?
The most important are the process box, data box, inventory triangle, push arrow, supermarket, FIFO lane, truck, kanban symbols, manual and electronic information arrows, heijunka box, kaizen burst and timeline. The full table is in section 4.

### What metrics go on a value stream map?
Per process: cycle time, changeover time, availability (uptime), batch size and staffing. Per inventory point: quantity and days of inventory. For the whole stream: takt time, lead time, processing time and flow ratio. The formulas are in section 6.

### How do you calculate process cycle efficiency (flow ratio)?
Divide processing time (plus process time such as curing) by lead time and multiply by 100%. Express both in the same unit and on the same basis (working days or calendar days). In the example in section 7: 413 s ÷ 1,080,000 s = 0.038%.

### Why do you map from the customer backward?
Because the customer sets the pace. If you start at shipping and walk upstream, you first record the processes that should control the flow, and you assess all others against customer demand [1][27].

### How long does value stream mapping take?
For a manageable value stream in one plant, one to two days for the current state and another workshop for the future state are realistic [unverified]. ASQ describes a three-day kaizen event for the kickoff [46]. The real effort is the implementation, which takes months.

### Is value stream mapping Lean or Six Sigma?
It is a Lean tool from the Toyota Production System, and ASQ files it under Lean [46]. English Wikipedia calls it "a recognised method used as part of Lean Six Sigma methodologies" [49]. It does not need Six Sigma statistics to work.

### What are the disadvantages of value stream mapping?
It is a snapshot based on averages, shows product variety and variability poorly, needs manual data collection and does not let you test the future state [22][23]. Dynamic simulation and automatic data collection close part of these gaps.

### What is dynamic value stream mapping?
Value stream mapping that takes time behavior into account. Processes get distributions instead of averages, demand follows time series, and a simulation shows how inventory and lead times develop over time [16].

### Is there a standard for value stream mapping?
Yes. ISO 22468:2020 "Value stream management (VSM)" covers value stream analysis, value stream design, value stream planning, and the assessment and adjustment of value streams [40]. ISO confirmed it as current in 2025. In Germany, guideline VDI 2870 on holistic production systems is also relevant [7].

### Is there free value stream mapping software?
Many general diagramming tools offer free entry tiers with VSM symbols, and spreadsheet templates are common. They usually do not calculate metrics automatically. Specialized VSM software is usually paid, often with a trial. For your first map, paper and pencil remain the best free choice.

### Can an MES replace value stream mapping?
No. An MES supplies valuable data such as cycle times, downtime and inventory, which can feed a digital value stream map [20]. Designing the flow, that is, deciding on supermarkets, FIFO lanes and the pacemaker, remains the job of the value stream method and the people who apply it.

## 20. Conclusion

Since "Learning to See" appeared in 1998, value stream mapping has been the standard tool for making flow visible in production [1]. Its value is not the map itself but what the map triggers: a shared understanding of the whole flow, an honest number for the flow ratio, and a future state designed according to clear guidelines [3][11].

Take away three points. First, calculate carefully. Takt time, effective cycle time, inventory days from Little's Law and a flow ratio on a fixed time base turn a drawing into a reliable basis for decisions. Second, don't stop at the current state. Future state design, an implementation plan and an accountable value stream manager decide whether anything changes. Third, use the extensions where the classic method reaches its limits. Dynamic simulation, automatically collected data and the information logistics view of Value Stream 4.0 prepare the method for high product variety and digital plants [13][16][18], provided the flow is stable first [14].

Start with paper, a pencil and one product family. Go digital once you want to update the map regularly.

## Further reading on m365.fm

**Blog posts**
- [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Podcast episode**
- [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Glossary**
[Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Eight Wastes](https://www.m365.fm/entity/eight-wastes/) · [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Companies and people**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Related guides (planned, not yet published; check links before go-live)**
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned)

German version: [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Germany. On m365.fm he writes about lean management, value stream mapping and the digitization of manufacturing with Microsoft 365 and Azure. His focus is how proven Lean tools such as value stream mapping work together with real-time data, simulation and modern data platforms without losing their methodical core.

**Note: The author works at iFAKT GmbH.** The cited iFAKT research papers can be checked by DOI in ZWF.

*[Editor: add role, background and profile photo from the author.]*

---

# Sources

All sources accessed November 20, 2026. Sources marked "verified 11/20/2026" were opened for this English version; the others were verified for the German original on the same date and spot-checked.

1. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, 1998 (introduction dated May 1998, Ann Arbor); current edition subtitled "… to Add Value and Eliminate Muda", LEI, September 2018, 148 pages, ISBN 978-0-9667843-0-5. Publisher page (Shingo award 1999, Shook eleven years at Toyota): https://www.lean.org/store/workbooks/learning-to-see/ · Introduction (PDF): https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf (verified 11/20/2026)
2. Rother, M.; Shook, J.: Sehen lernen. Mit Wertstromdesign die Wertschöpfung erhöhen und Verschwendung beseitigen. German edition, version 1.1. Lean Management Institut, Aachen 2004, ISBN 978-3-9809521-1-8 (German Digital Library catalog).
3. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. Springer, 1st ed. 2007; 2nd ed. 2010 (VDI-Buch), ISBN 978-3-540-89867-2; 3rd ed. Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (eBook 978-3-662-58907-6). Sample of 2nd ed.: https://lesejury.de/media/samples/672/9783540898672_leseprobe.pdf · Overview with the eight design guidelines: http://www.wertstromdesign.de/wertstromdesign.html (verified 11/20/2026)
4. Erlach, K.: Value Stream Design: The Way Towards a Lean Factory. Springer, Lecture Notes in Logistics, published September 2012 (copyright 2013), ISBN 978-3-642-12568-3 (hardcover), eBook 978-3-642-12569-0. https://link.springer.com/978-3-642-12568-3 · Publisher description ("ten design guidelines") via https://ebooks.mpdl.mpg.de/ebooks/Record/EB000384257 (verified 11/20/2026)
5. Klevers, T.: Wertstrom-Mapping und Wertstrom-Design. Verschwendung erkennen – Wertschöpfung steigern. mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9 (bibliographic data per [27]).
6. Martin, K.; Osterling, M.: Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation. McGraw-Hill, New York, published October 2013 (copyright 2014), ISBN 978-0-07-182891-8. https://www.mheducation.com/highered/mhp/product/value-stream-mapping-how-visualize-work-align-leadership-organizational-transformation.html (verified 11/20/2026)
7. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review. VDI (Association of German Engineers), July 2012. https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
8. Takt Time (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/ (verified 11/20/2026)
9. Seven Wastes (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/ (verified 11/20/2026)
10. Value-Stream Manager (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-manager/ (verified 11/20/2026)
11. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/ (verified 11/20/2026)
12. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387 (verified 11/20/2026)
13. Meudt, T.; Metternich, J.; Abele, E.: Value stream mapping 4.0: Holistic examination of value stream and information logistics in production. CIRP Annals 66 (1), 2017, pp. 413–416. DOI: 10.1016/j.cirp.2017.04.005 (bibliographic data per the reference list of [26]).
14. VDMA / PTW TU Darmstadt (Metternich, J.; Meudt, T.; Hartmann, L.): Leitfaden Industrie 4.0 trifft Lean, excerpt on Value Stream Mapping 4.0 (German). https://www.ptw.tu-darmstadt.de/media/fachgebietptw/dokumente_3/wissenssammlung_ptw/leitfaeden_2/Leitfaden_I40_Lean.pdf
15. Metternich, J.; Meudt, T.; Hartmann, L.: Value Stream 4.0: A Systems View of Information Flow for Digitalization. CRC Press, released July 20, 2025 (copyright 2026), ISBN 978-1-032-95831-6. https://www.routledge.com/Value-Stream-40-A-Systems-View-of-Information-Flow-for-Digitalization/Metternich-Meudt-Hartmann/p/book/9781032958316 (verified 11/20/2026)
16. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (iFAKT GmbH): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html (verified 11/20/2026)
17. Drees, J. (iFAKT GmbH): Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
18. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
19. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
20. ECOWERT – Echtzeitorientierte Wertstromanalyse für die nachhaltige Produktionsoptimierung (reference project). Fraunhofer IPA. https://www.ipa.fraunhofer.de/de/referenzprojekte/ECOWERT.html (verified 11/20/2026)
21. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen. IT&Production, January 12, 2023 (updated July 23, 2024). https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/ (verified 11/20/2026)
22. Digitalized value stream analysis: We are automating the gemba walk. Fraunhofer IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/production-management-and-value-stream-mapping-and-design/WertstromDigital.html (verified 11/20/2026)
23. Lugert, A.; Winkler, H.: Von der Wertstromanalyse zum Wertstrommanagement. ZWF 112 (4), 2017, pp. 261–265. DOI: 10.3139/104.111703. https://www.degruyterbrill.com/document/doi/10.3139/104.111703/html
24. Urnauer, C.: Die digitale Wertstrommethode. ZWF 114, 2019 (issue and pages not shown at access). DOI: 10.3139/104.112203. https://www.degruyterbrill.com/document/doi/10.3139/104.112203/html
25. Busch, O.; Niehues, M.; Maassen, K.: Die monetäre Bewertung von Wertströmen. ZWF 113 (6), 2018, pp. 389–392. DOI: 10.3139/104.111935. https://www.degruyterbrill.com/document/doi/10.3139/104.111935/html
26. Bega, M.; Sapel, P.; Ercan, F.; Schramm, T.; Spitz, M.; Kuhlenkötter, B.; Hopmann, C.: Extension of value stream mapping 4.0 for comprehensive identification of data and information flows within the manufacturing domain. Production Engineering 17 (6), 2023, pp. 915–927. DOI: 10.1007/s11740-023-01207-5. https://link.springer.com/10.1007/s11740-023-01207-5
27. Wertstromanalyse. Wikipedia (German-language). https://de.wikipedia.org/wiki/Wertstromanalyse (verified 11/20/2026)
28. Polaris VSM – Digital Value Stream Tool in Lean Management (vendor page). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/ (verified 11/20/2026)
29. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536 (verified 11/20/2026)
30. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1 (verified 11/20/2026)
31. Value Stream Management Platforms. Gartner Peer Insights. https://www.gartner.com/reviews/market/value-stream-management-platforms (verified 11/20/2026)
32. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (Japanese original 1978). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
33. Liker, J. K.: The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer. McGraw-Hill, New York 2004, ISBN 978-0-07-139231-0.
34. SimVSM – digital value stream analysis. SimPlan AG. https://www.simplan.de/en/software/simvsm (verified 11/20/2026)
35. Plant Simulation X – Value Stream Mapping. Siemens. https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/ (verified 11/20/2026)
36. Was ist eine Wertstromanalyse? (What is a value stream analysis?) ONIQ (German). https://oniq.com/de/ressourcen/was-ist-eine-wertstromanalyse (verified 11/20/2026)
37. Wertstromanalyse (REFA lexicon). REFA Bundesverband. https://refa.de/service/refa-lexikon/wertstromanalyse
38. Wertstromanalyse: Anleitung, Kennzahlen, Symbole. Industriezeitschrift (German). https://industriezeitschrift.de/qualitaet/wertstromanalyse/
39. Kersten, M.: Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution Press, Portland 2018, ISBN 978-1-942788-39-3.
40. ISO 22468:2020 Value stream management (VSM). ISO/TC 154, published March 9, 2020, confirmed June 25, 2025. https://committee.iso.org/standard/73292.html (verified 11/20/2026) · Table of contents (DIN): https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:322285827/toc-3156892/download
41. Fuchs, H.-W.: Wertstrom-Methode (diploma thesis). Hochschule Mittweida. https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/796/file/DA_Wertstrommethode.pdf
42. Wertstromanalyse (Value Stream Mapping). Mind Logistik (German). https://mind-logistik.de/knowhow/wertstromanalyse/
43. Small Chart, Big Impact: How a Simple Spaghetti Chart Led to Huge Wins at Thrustmaster of Texas. Lean Enterprise Institute, The Lean Post, February 4, 2016. https://www.lean.org/the-lean-post/articles/small-chart-big-impact-how-a-simple-spaghetti-chart-led-to-huge-wins-at-thrustmaster-of-texas/ (verified 11/20/2026)
44. The Karen Martin Group: Lean Terminology (glossary, PDF, 2014): definitions of activity ratio, lead time, process time, %C&A and rolled first pass yield. https://tkmg.com/wp-content/files/Lean-Terminology.pdf (verified 11/20/2026)
45. Value-Stream Mapping (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/ (verified 11/20/2026)
46. Value Stream Mapping. ASQ, Quality Resources (adapted from "Lean Lessons: Value Stream Mapping – An Introduction", Quality Progress). https://asq.org/quality-resources/lean/value-stream-mapping (verified 11/20/2026)
47. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (verified 11/20/2026)
48. Lean & Environment Toolkit, Chapter 3 (Value Stream Mapping). US Environmental Protection Agency. https://epa.gov/sustainability/lean-environment-toolkit-chapter-3 (verified 11/20/2026)
49. Value-stream mapping. Wikipedia (English). https://en.wikipedia.org/wiki/Value-stream_mapping (verified 11/20/2026)
50. ISA-95 framework and layers. Siemens. https://www.siemens.com/en-us/technology/isa-95-framework-layers/ (verified 11/20/2026)
51. 8 Wastes (DOWNTIME). GoLeanSixSigma.com. https://goleansixsigma.com/8-wastes/ (verified 11/20/2026)

---

# Editorial notes

## Unverified items and items to check

- **Duration of a current state map (one to two days)** in section 5 and the FAQ, and the **first-time facilitator agenda** (section 5): practical experience, not sourced, marked [unverified]. ASQ's three-day kaizen event [46] is now quoted alongside as a published reference.
- **Team size:** ASQ (about 10) [46] and Mind Logistik (up to six) [42] differ; both are shown as practice recommendations.
- **Product family rule of thumb** (similar work content), section 5: common teaching, no verbatim source, marked [unverified]. ASQ's "about 80% of the steps" [46] added as a sourced US reference.
- **Rother/Shook key questions (eight)** in section 8: paraphrased from *Learning to See* [1]; the book text was not available in full. Check wording and order against the book.
- **Seventh guideline "every part every day":** only found in secondary sources; the LEI article [11] lists six guidelines. Still marked [unverified].
- **Recommendation to start with the pacemaker loop** (section 8): marked [unverified].
- **Erlach: eight vs. ten design guidelines.** The German 2nd edition and wertstromdesign.de list eight; the publisher description of the English edition (Springer 2012/2013) speaks of "ten design guidelines" [4]. The article names the eight from the German source and flags the difference. Check the English book's chapter 3 if a US reader edition should be quoted.
- **%C&A and rolled %C&A** (sections 6 and 17): now sourced from the Karen Martin Group glossary [44] instead of a secondary book summary. The McGraw-Hill and O'Reilly pages for the book [6] do not mention the metric; ideally check the book.
- **Symbol descriptions** (section 4): follow the common Rother/Shook convention (lightning bolt = electronic, straight arrow = manual). Depiction of withdrawal kanban, kanban post, supermarket opening and timeline (waiting time on top or bottom) varies by source. Illustrate with graphics from a licensed symbol library.
- **Paper size:** 11 × 17 in (tabloid) is given as the US equivalent of the A3 sheet in the German original; *Learning to See* was not checked for a specific paper size.
- **Meudt et al. 2017 [13]:** volume and pages from the reference list of [26], not fetched from the publisher directly.
- **Urnauer 2019 [24]:** volume 114 derived from the year; issue and pages not visible at access.
- **Fuchs [41]:** year of the diploma thesis not determined; formulas there follow Erlach.
- **Value Stream 4.0 book [15]:** release date July 20, 2025, copyright 2026 per the publisher page; the German original said "2025".
- **iFAKT facts:** founded 2001 by Jörg Drees per the author biography in [19] (checked for the German original; paywall). Headquarters Stuttgart (Curiestrasse 2, 70563 Stuttgart, commercial register Stuttgart HRB 22661); no other location is mentioned. Vendor benefit figures from [28] (25% shorter lead time, 3× faster projects) deliberately **not** used because no methodology is given; the text says so.
- **iFAKT disclosure:** iFAKT does not pay for publication on m365.fm (confirmed by Mirko, November 20, 2026). The section and the author box therefore carry only "**Note: The author works at iFAKT GmbH.**" This satisfies the FTC Endorsement Guides' requirement to disclose a material connection; no "sponsored" or "paid partnership" label and no `rel="sponsored"` are used. Open point from the German consistency check: the m365.fm entity page for iFAKT is labeled "Sponsored"; align it.
- **Polaris functions:** the vendor page [28] lists scenarios and sensitivity analysis but no simulation in the narrow sense; the text says so. Kanban and Kaizen boards come from the Microsoft post [29], not from ifakt.de.
- **AppSource listing of Polaris VSM:** documented via the Microsoft Tech Community post [29]; the direct AppSource page for Polaris VSM was not checked. Check the link before publishing.
- **Worked example (section 7):** fictional and labeled as such. Recalculated for the English version: takt 117.4 s; current inventory days 20.0 = 9,200 ÷ 460; flow ratio current 0.038% (calendar basis 0.017%); future state with SMED and capacity check including five changeovers per day (highest load milling 91%); future inventory 3,110 pieces, 6.76 days; processing time 365 s; flow ratio 0.100% (factor 2.6); pitch 39 min at pack quantity 20.
- **Competitive analysis:** word counts are estimates from fetched page text (no SEO tool data for google.com). Rankings approximated with a US-weighted search tool. Before publishing, check the real google.com SERP for "value stream mapping" with an SEO tool (e.g. NEURONwriter for google.com, English).
- **Planned guide links** (`/en/learn/lean-manufacturing/`, `/en/learn/operational-excellence/`, `/en/learn/digital-twin-manufacturing/`, `/en/learn/production-scheduling-aps/`, `/en/learn/shop-floor-management/`, `/en/learn/manufacturing-kpis/`, `/en/learn/ifakt-polaris/`, `/en/learn/manufacturing-it-azure/`, `/en/learn/aerospace-production-planning/`): linked absolutely and marked "(planned)"; check before go-live.
- **m365.fm blog and episode links:** English titles used; the German original verified the symbols post ("Value Stream Mapping Symbols and Icons Explained"). The other post and episode titles were translated from the German link texts; check the exact English titles on the site.
- **Table of contents:** create jump anchors in the CMS.

## Recommended graphics

1. Symbol legend as SVG (section 4)
2. Current state map of the worked example with timeline (section 7)
3. Future state map with supermarket, FIFO lanes, pacemaker and heijunka box (section 7)
4. Operator balance chart, current and future state (section 7)
5. Diagram "static vs. dynamic vs. digital" (section 11)
6. Terminology box "flow ratio = PCE = activity ratio" (section 6)

## hreflang and cannibalization

- hreflang pair: `en-US` https://www.m365.fm/en/learn/value-stream-mapping/ <-> `de-DE` https://www.m365.fm/learn/wertstromanalyse/ (both pages reference each other plus `x-default` as the editor decides).
- Cannibalization: the planned English guide `ifakt-polaris` targets "value stream mapping software". This article keeps the software section neutral and category-based and links to that guide; it should not be optimized for "value stream mapping software" as a main keyword. The m365.fm entity page /entity/value-stream-mapping/ is a short definition and links here as the in-depth page.

## Schema suggestion (JSON-LD)

Recommended: `Article` for the page, `FAQPage` for section 19 and `HowTo` for section 5. FAQ answers in the schema must match the visible text word for word; the suggestion contains a selection, and the editor adds the remaining questions in the same pattern. (Google shows FAQ and HowTo rich results only in limited cases; the markup still helps machine readability.)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://www.m365.fm/en/learn/value-stream-mapping/#article",
      "headline": "Value Stream Mapping: The Complete Guide to VSM Symbols, Metrics, Future State Design and Value Stream Management",
      "description": "Value stream mapping (VSM) step by step: symbols, takt time and lead time formulas, a fully calculated example, future state design and VSM software.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/value-stream-mapping/",
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.m365.fm/entity/ifakt/" }
      },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "about": [
        { "@type": "Thing", "name": "Value stream mapping", "sameAs": "https://en.wikipedia.org/wiki/Value-stream_mapping" },
        { "@type": "Thing", "name": "Value Stream Mapping", "url": "https://www.m365.fm/entity/value-stream-mapping/" }
      ],
      "citation": [
        "https://doi.org/10.3139/104.111242",
        "https://doi.org/10.3139/104.111974",
        "https://doi.org/10.1515/zwf-2023-1062",
        "https://doi.org/10.3139/104.110589",
        "https://doi.org/10.1016/j.cirp.2017.04.005",
        "https://doi.org/10.3139/104.111703",
        "https://doi.org/10.3139/104.111935",
        "https://doi.org/10.3139/104.112203",
        "https://doi.org/10.1287/opre.9.3.383",
        "https://doi.org/10.1007/s11740-023-01207-5"
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://www.m365.fm/en/learn/value-stream-mapping/#howto",
      "name": "How to create a current state value stream map",
      "inLanguage": "en-US",
      "tool": [
        { "@type": "HowToTool", "name": "Pencil and 11 x 17 in paper" },
        { "@type": "HowToTool", "name": "Stopwatch" }
      ],
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Define the goal and scope", "text": "Decide which question the map should answer, set door-to-door boundaries and name an owner." },
        { "@type": "HowToStep", "position": 2, "name": "Define the product family", "text": "Group products with similar processing steps using a product-process matrix." },
        { "@type": "HowToStep", "position": 3, "name": "Capture customer demand", "text": "Record demand, variants and delivery frequency, and calculate takt time." },
        { "@type": "HowToStep", "position": 4, "name": "Walk the process at the gemba", "text": "Walk the flow backward from shipping to receiving and draw a process box for every section with continuous flow." },
        { "@type": "HowToStep", "position": 5, "name": "Fill in the data boxes", "text": "Record cycle time, processing time, changeover time, availability, batch size, operators and shifts." },
        { "@type": "HowToStep", "position": 6, "name": "Count inventory", "text": "Count inventory on the floor and convert it into days of inventory using daily demand." },
        { "@type": "HowToStep", "position": 7, "name": "Add external material flows", "text": "Draw suppliers, customer and transport with delivery frequencies." },
        { "@type": "HowToStep", "position": 8, "name": "Draw the information flow", "text": "Find out how each process knows what to make next, and mark push, FIFO or pull." },
        { "@type": "HowToStep", "position": 9, "name": "Draw the timeline and calculate the metrics", "text": "Enter inventory days and processing times and calculate lead time, processing time and flow ratio." },
        { "@type": "HowToStep", "position": 10, "name": "Mark waste and validate", "text": "Mark problems with kaizen bursts and validate the map with the employees." }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/en/learn/value-stream-mapping/#faq",
      "inLanguage": "en-US",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between a current state map and a future state map?",
          "acceptedAnswer": { "@type": "Answer", "text": "The current state map records how material and information flow today, with measured data. The future state map designs how they should flow, following guidelines such as producing to takt time, continuous flow where possible, supermarkets where flow is not possible, and one pacemaker process. Together they form the value stream method, followed by an implementation plan." }
        },
        {
          "@type": "Question",
          "name": "What is the difference between value stream mapping and value stream management?",
          "acceptedAnswer": { "@type": "Answer", "text": "Value stream mapping is a project: a team records the current state and designs a future state. Value stream management is the ongoing leadership of the value stream by an accountable value stream manager, with a regularly updated map, metrics and reviews. ISO 22468:2020 describes this cycle of analysis, design, planning, assessment and adjustment." }
        },
        {
          "@type": "Question",
          "name": "How do you calculate process cycle efficiency (flow ratio)?",
          "acceptedAnswer": { "@type": "Answer", "text": "Divide processing time (plus process time such as curing) by lead time and multiply by 100%. Express both in the same unit and on the same basis (working days or calendar days). In the example in section 7: 413 s ÷ 1,080,000 s = 0.038%." }
        },
        {
          "@type": "Question",
          "name": "Is there a standard for value stream mapping?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. ISO 22468:2020 \"Value stream management (VSM)\" covers value stream analysis, value stream design, value stream planning, and the assessment and adjustment of value streams. ISO confirmed it as current in 2025. In Germany, guideline VDI 2870 on holistic production systems is also relevant." }
        },
        {
          "@type": "Question",
          "name": "Can an MES replace value stream mapping?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. An MES supplies valuable data such as cycle times, downtime and inventory, which can feed a digital value stream map. Designing the flow, that is, deciding on supermarkets, FIFO lanes and the pacemaker, remains the job of the value stream method and the people who apply it." }
        }
      ]
    }
  ]
}
```

---

## Review log

Review and optimization loop for the US English version, November 20, 2026. Five roles: subject-matter expert (value stream / Lean), SEO specialist (US), reader from the US target audience (plant manager and first-time VSM facilitator at a US mid-size manufacturer), fact checker (re-verifies every new or changed fact and every new US source online), critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms). Starting point: the German original `wertstromanalyse.md` (after its own three review rounds and the consistency check of November 20, 2026). Draft snapshots: `draft_v1.md` and `draft_r1.md` in the session scratchpad.

### Localization decisions before Round 1 (German -> English)

- **SERP and keyword:** google.com check for "value stream mapping" and three variants (results above). Main keyword confirmed as "value stream mapping"; slug kept as `value-stream-mapping`. Longest English competitor about 4,000 words (leandatapoint.com) vs. about 3,900 for the German SERP; the target of 8,000+ words stays.
- **H1:** "Wertstromanalyse: Das Kompendium zu Value Stream Mapping, Wertstromdesign und Value Stream Management" -> "Value Stream Mapping: The Complete Guide to VSM Symbols, Metrics, Future State Design and Value Stream Management".
- **H2s rewritten for US queries:** e.g. "Wertstromanalyse Schritt für Schritt" -> "How to Create a Value Stream Map: Step-by-Step Guide to the Current State"; "Wertstromdesign: Vom Ist- zum Soll-Zustand" -> "Future State Mapping: Design Guidelines from Rother/Shook and Erlach"; "Kennzahlen der Wertstromanalyse mit Formeln" -> "Value Stream Mapping Metrics and Formulas".
- **Terminology:** Flussgrad -> flow ratio, with a terminology box mapping it to process cycle efficiency, activity ratio and flow efficiency [44]; Reichweite -> inventory days / days of supply; Ist-/Soll-Zustand -> current/future state map; Schrittmacher -> pacemaker; Freigabeeinheit -> pitch / release unit; Verfügbarkeit -> availability (uptime); Gutteilquote -> first-pass yield.
- **US sources added (all opened and verified):** LEI value-stream mapping lexicon [45], ASQ VSM page [46] (definition, takt example, team size, 80% product family rule, three-day kaizen event), NIST MEP lean page [47], EPA Lean & Environment Toolkit chapter 3 [48], English Wikipedia [49], ISA-95 layers [50], Karen Martin Group glossary [44] (replaces the secondary book summary formerly used for %C&A), Erlach's English edition [4], ISO committee page for ISO 22468 [40] (status confirmed 2025).
- **German context kept and explained:** REFA, VDI 2870, ZWF, Fraunhofer IPA, TU Darmstadt/PTW, VDMA, Invest BW, Hochschule Mittweida; German-language Wikipedia marked as such; German paper titles translated in the publication table.
- **Units and format:** DIN A3 -> 11 × 17 in (tabloid, close to A3); all numbers in US format (9,200; 117.4 s; 0.038%); dates as "November 20, 2026"; "translate into euros" -> "into dollars"; ECOWERT volume stays in EUR (€500,000).
- **NEURONwriter** (German SERP tool) removed from the article and sources; the software section now refers to US search intent.
- **iFAKT:** disclosure exactly "**Note: The author works at iFAKT GmbH.**" in section 16 and the author box; no sponsorship label; only Stuttgart named.

### Round 1

- **Subject-matter expert (not satisfied):** The worked example recalculates correctly (takt 117.4 s, 20.0 days, 0.038%/0.017%, Little's Law, future state 91% with changeovers, 3,110 pieces, 0.100%). Three issues: (1) section 2 said three books spread the method "two of them in Germany", but all three are German; (2) Erlach's guidelines are listed as eight, yet the English edition's publisher description speaks of ten, so US readers buying the English book may find a different numbering; (3) the cycle time definition needs a warning, because several US pages use "cycle time" for total throughput time.
- **SEO specialist (not satisfied):** Keyword placement in H1, short answer, meta and H2s is good. Section 15 referred to "the competitive analysis above", which is not part of the published page. Meta character counts in the table were off by one. FAQ should include the PAA questions "What are the steps of value stream mapping?", "current vs. future state", "VSM vs. process mapping" and "Is VSM Lean or Six Sigma?" (all added in the draft; check wording is answer-first).
- **US reader (satisfied with reservations):** The workshop box, 11 × 17 paper and ASQ team size make it usable. Wants to know where a small US plant can get facilitation help, and finds the opening "note on sources" a little long.
- **Fact checker (not satisfied):** Re-verified online: LEI lexicon (VSM, takt, seven wastes, value-stream manager), LEI Learning to See page and introduction PDF, Lean Post guidelines (date October 19, 2022, wording), Thrustmaster article (Houston, seven miles, nearly 10 hours, 100% on-time after 18 months, February 4, 2016), ASQ page, NIST MEP page, EPA chapter 3, ISO committee page (published March 9, 2020; confirmed June 25, 2025), Erlach English edition (Springer, September 2012, ISBN 978-3-642-12568-3), Value Stream 4.0 (released July 20, 2025, copyright 2026), Martin/Osterling (ISBN 978-0-07-182891-8; October 2013), TKMG glossary, Siemens Plant Simulation X VSM Library, SimVSM/SimVSM Pro, ONIQ 90% claim, iFAKT VSM page, Microsoft Tech Community post, AppSource BSM, Gartner, Fraunhofer IPA digital VSM page, ECOWERT, IT&Production article, Türck et al. DOI page, Little 1961, German Wikipedia quotes, ISA-95 levels. Not supported: "SAVE International" in the value analysis row (added from memory, no source opened); DOWNTIME acronym without a source; the FAQ claim that Lean Six Sigma programs use VSM "before deeper statistical analysis" goes beyond what English Wikipedia says.
- **Critic (not satisfied):** No AI clichés or em-dash chains found (`grep` for em dashes: 0). iFAKT section is factual, vendor figures excluded, disclosure correct. Polaris VSM is listed first in the specialized software row, which is alphabetical and acceptable. Wants the "note on sources" shortened and the meta-reference in section 15 removed (same as SEO).

**Conflicts and decisions:** SEO wanted more FAQ entries; the critic wanted no added length. Decision: keep the four PAA questions because they match real US queries, and keep answers short (two to four sentences). The expert wanted the English Erlach numbering; the fact checker could not access the English chapter. Decision: keep the eight German guidelines, which are verified, and add a sentence flagging the "ten design guidelines" in the English edition with a source; the editorial notes ask for a book check.

### What changed in Optimization 1 (old -> new)

- Value analysis row: "(VDI 2800 in Germany, SAVE International in the US)" -> "(in Germany: VDI 2800)".
- Section 2: "Three further books shaped how the method spread, two of them in Germany:" -> "In German-speaking countries, three books shaped how the method spread; one of them later appeared in English:".
- Section 15: "… whether there are free options (see the competitive analysis above)." -> "… whether there are free options."
- Section 9: "the eight are often remembered with the acronym DOWNTIME (…)" -> "the eight are often taught with the acronym DOWNTIME: … [51]" (new source GoLeanSixSigma, verified).
- FAQ "Is value stream mapping Lean or Six Sigma?": "Many Lean Six Sigma programs use it to show where waiting and waste sit before deeper statistical analysis [49]." -> "English Wikipedia calls it "a recognised method used as part of Lean Six Sigma methodologies" [49]." (quote verified).
- Section 8: added the note on Erlach's English edition ("ten design guidelines", source [4]).
- Section 6: added the paragraph warning about the US use of "cycle time" for total throughput time.

### Round 2

- **Subject-matter expert (satisfied):** Books, Erlach note and cycle time warning are correct; the method content matches the German original one to one.
- **SEO specialist (almost satisfied):** Meta character counts still need correcting in the metadata table (actual: title 55, description 149). Otherwise satisfied.
- **US reader (almost satisfied):** Still wants a pointer to US facilitation support and a tighter opening note.
- **Fact checker (satisfied):** Re-verified the three changed facts (Wikipedia quote, DOWNTIME source, Erlach English edition description). Remaining [unverified] items are listed in the editorial notes.
- **Critic (satisfied with reservation):** Text is neutral. Reservation: the m365.fm entity page for iFAKT still carries a "Sponsored" label, which contradicts the disclosure here; this is an editorial task outside the article.

### What changed in Optimization 2 (old -> new)

- Metadata: "(54 characters)" -> "(55 characters)"; "(150 characters)" -> "(149 characters)" (counted with Python).
- Section 3: added "Small and midsize US manufacturers who want outside facilitation can turn to the NIST MEP Centers, which list value stream mapping among the lean methods they help apply [47]." (verified against the NIST MEP page).
- Opening "A note on sources" shortened from 48 to 43 words.
- Word count measured: `wc -w` on H1 through the end of the Conclusion = 13,303 (includes table and markdown tokens); entered in the metadata.

### Round 3 (final verdicts)

All five roles reread the changed passages; citation check run (every [1]–[51] cited in the text and listed under Sources); JSON-LD FAQ answers match the visible text word for word.

- **Subject-matter expert: satisfied.** Method, symbols, metrics and the worked example are correct and fully recalculable.
- **SEO specialist: satisfied.** Main and secondary keywords in H1/H2, meta, short answer and FAQ; PAA questions covered; hreflang pair and planned sister links in place. Open: real google.com SERP check with an SEO tool, CMS jump anchors.
- **US reader: satisfied.** A plant manager can use section 7 to make the business case, and a first-time facilitator can run a workshop from section 5.
- **Fact checker: satisfied.** Still [unverified]: seventh guideline "every part every day", wording of the eight key questions, starting with the pacemaker loop, workshop duration, product family rule of thumb, Erlach's English numbering, Urnauer issue/pages, year of the Fuchs thesis, exact English titles of two m365.fm blog posts and the episode.
- **Critic: satisfied.** The article is balanced and free of marketing tone. Open editorial task outside the article: align the "Sponsored" label on the m365.fm iFAKT entity page with the disclosure used here.
