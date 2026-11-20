# SEO metadata

| Field | Value |
|---|---|
| Meta title | Lean Manufacturing: Principles, Tools & How to Start (52 characters; alternative: "Lean Manufacturing Explained: Principles and Tools", 50 characters) |
| Meta description | Lean manufacturing explained: 5 principles, the 8 wastes, 17 tools with worked examples, a 12-month rollout roadmap, KPIs and limits. Fully sourced. (148 characters) |
| Slug | `/en/learn/lean-manufacturing/` (full URL: https://www.m365.fm/en/learn/lean-manufacturing/) |
| Main keyword | lean manufacturing |
| Secondary keywords | lean production, lean management, lean manufacturing principles, 5 principles of lean, lean manufacturing tools, lean tools, 8 wastes of lean, DOWNTIME waste, TIMWOODS, muda mura muri, Toyota Production System, TPS house, just-in-time, jidoka, 5S, kanban, pull system, heijunka, SMED, quick changeover, poka-yoke, standard work, kaizen, continuous improvement, value stream mapping, andon, TPM, A3 problem solving, takt time formula, line balancing, lean six sigma, lean leadership, lean implementation, lean KPIs, lean 4.0, disadvantages of lean manufacturing, lean and supply chain resilience |
| Search intent | Informational (definition, principles, tools) with a commercial/practical secondary intent (implementation, training, software). Audience: plant managers, operations and continuous-improvement leaders, production supervisors, engineering students, and Microsoft 365 admins who support manufacturing sites |
| Target word count | At least 8,500 words (longest English competitor on google.com: approx. 8,000 words). Actual: see `wc -w` note in the review log; H1 to Conclusion incl. tables, glossary and FAQ (`wc -w`): **14,791 words** |
| Language version | US English (`en-US`). hreflang pair: `en-US` https://www.m365.fm/en/learn/lean-manufacturing/ <-> `de-DE` https://www.m365.fm/learn/lean-management/ (plus `x-default` recommended to the English URL). Existing English blog post on m365.fm, "Lean Management in Manufacturing: The Complete Guide", is **not** part of this hreflang pair; see the cannibalization note in the editorial notes |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: the strongest English-language results on google.com (US) for "lean manufacturing", "what is lean manufacturing", "lean manufacturing principles tools" and "lean management in manufacturing". Pages were fetched in full; word counts are estimates of the main text without navigation, footer and promotional blocks.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| smartsheet.com/lean-manufacturing-tools | 8,000 | longest page; history with Krafcik and Womack/Jones, about 30 tools as H3s, tool-selection matrix, Six Sigma, green lean, free templates | no FAQ, no phased roadmap, critique limited to "romantic JIT", takt formula without worked example, KPIs as a bare list, two promotional blocks |
| xometry.com/resources/supply-chain/lean-manufacturing/ | 5,500–6,000 | question-style H2s, lean vs. lean production, Toyota and small-company examples | statistics without sources and contradictory (defect reduction 20–60%), muddled Six Sigma explanation, no formulas, no roadmap, almost no limits |
| netsuite.com (What Is Lean Manufacturing?) | 4,500–5,000 | clear numbered structure, 8 wastes, 11 implementation steps, challenges section, 7 FAQs | no bibliography, KPIs only named, no calculations, no timeline, examples (Nike, John Deere) without figures, ERP product pitch |
| tulip.co/ebooks/lean-manufacturing/ | approx. 3,000 | six chapters, TWI and Taylor in the history, Industry 4.0 chapter | "Total Predictive Maintenance" mislabel, no KPI definitions, no roadmap, no critique, no FAQ |
| en.wikipedia.org/wiki/Lean_manufacturing | approx. 2,700 (without references) | broad history, case data (Omark, NCR, HP), criticism section, lean accounting | no roadmap, no formulas, no KPI system, not practitioner-oriented |
| azumuta.com (Ultimate Guide to Lean Manufacturing) | 2,300–2,500 | linear structure, Toyota die-change and Lockheed Martin examples | untraceable statistics, overstated causal claims, no roadmap, no risks, product promotion |
| m365.fm community blog "Lean Management in Manufacturing: The Complete Guide" (own site) | approx. 1,700 | practical daily lean management system, 8-step rollout, lead-time example, disclosure | short; targets "lean management in manufacturing"; see cannibalization note |
| techtarget.com (What is lean manufacturing?) | 1,000–1,100 | concise definitions, lean vs. Six Sigma | no implementation, no metrics, no limits |
| mrpeasy.com/blog/what-is-lean-manufacturing/ | 900–950 | DOWNTIME mnemonic with one fix per waste | no history, no sources, no KPIs, no FAQ |

**"People also ask" style questions collected (google.com, November 2026):** What are the 5 principles of lean manufacturing? What are the 8 wastes of lean? What is an example of lean manufacturing? What is the difference between lean and Six Sigma? What is the difference between lean manufacturing and lean production? What are the disadvantages of lean manufacturing? Who invented lean manufacturing? How do you calculate takt time? What are the main lean tools? Is just-in-time still viable after the chip shortage? How long does lean implementation take? Does lean work for small manufacturers or high-mix job shops?

**How this article beats the competition:** No page in the US top results combines history, principles, tools, implementation and critique with consistent source citations; most quote years and percentages without a source, and several contradict themselves on the waste count or on Six Sigma. This article gives every tool its own H3 with purpose, steps and common mistakes; it shows SMED in six steps, poka-yoke with concrete examples, and worked examples for takt time, line balancing, kanban sizing, pitch, OEE and lead time. It covers what the competitors leave out: a 12-month roadmap with a pilot area, a KPI system, a sourced critique (work intensification, supply chain resilience after 2020/2021 with Toyota's chip stockpile), US labor and safety context (union contracts, NLRA employee committees, OSHA ergonomics), lean 4.0 and digital twins, documented case examples (IMVP benchmark, NUMMI, Porsche) with their limits, a glossary, US support resources (NIST MEP, Shingo Institute, EPA Lean & Environment Toolkit) and a sober look at what Microsoft 365 can and cannot do for lean routines. At 14,791 words it is about 85 percent longer than the longest competitor, with that length going into worked examples, tables and checklists rather than repetition.

---

# Lean Manufacturing: Principles, Tools, Implementation, and Limits

*Updated: November 2026 · Reading time: about 55 minutes (quick start: short answer, "Key takeaways" box and glossary)*

> **Short answer:** Lean manufacturing is a way of running a plant that aligns every activity with what the customer values and removes everything else, step by step. It comes from the Toyota Production System, rests on five principles (value, value stream, flow, pull, perfection) and is put into practice with tools such as 5S, kanban, SMED, standard work and kaizen [1][5].

> **Key takeaways**
> - John Krafcik coined the term "lean production" in 1988; the 1990 MIT book *The Machine That Changed the World* made it known worldwide [2][3][4].
> - Womack and Jones set out the five lean principles in *Lean Thinking* (1996) [5].
> - The Toyota Production System rests on two pillars: just-in-time and jidoka [1][25].
> - Taiichi Ohno defined seven wastes; most Western sources add an eighth, unused employee talent (the DOWNTIME or TIMWOODS mnemonics) [8][40].
> - Lean is a management system. Kanban or 5S only work when leadership, standards and daily problem solving come with them.
> - A proven sequence for implementation: stability before flow, flow before pull, pull before leveling.
> - Lean does not mean "zero buffer at any cost": since a continuity plan introduced after 2011, Toyota has required suppliers to hold two to six months of semiconductor stock [31].
> - The core metrics are lead time, flow ratio, OEE, first pass yield and on-time delivery; they belong on the shop floor board every day, paper or digital.

## Table of contents

1. [What is lean manufacturing? Definition and core idea](#what-is-lean-manufacturing-definition-and-core-idea)
2. [History: from Ford and Toyota to MIT](#history-from-ford-and-toyota-to-mit)
3. [The 5 principles of lean manufacturing (Womack and Jones)](#the-5-principles-of-lean-manufacturing-womack-and-jones)
4. [Muda, mura, muri and the 8 wastes of lean](#muda-mura-muri-and-the-8-wastes-of-lean)
5. [The house of the Toyota Production System](#the-house-of-the-toyota-production-system)
6. [Lean manufacturing tools: the toolbox at a glance](#lean-manufacturing-tools-the-toolbox-at-a-glance)
7. [Lean vs. Six Sigma vs. Lean Six Sigma](#lean-vs-six-sigma-vs-lean-six-sigma)
8. [Lean leadership and culture](#lean-leadership-and-culture)
9. [How to implement lean manufacturing: a five-phase roadmap](#how-to-implement-lean-manufacturing-a-five-phase-roadmap)
10. [Lean KPIs: how to measure progress](#lean-kpis-how-to-measure-progress)
11. [Common lean implementation mistakes](#common-lean-implementation-mistakes)
12. [Disadvantages and limits of lean manufacturing](#disadvantages-and-limits-of-lean-manufacturing)
13. [Lean and digital: lean 4.0, digital twins and Microsoft 365](#lean-and-digital-lean-40-digital-twins-and-microsoft-365)
14. [Documented lean manufacturing examples](#documented-lean-manufacturing-examples)
15. [Software support: iFAKT Polaris as an example](#software-support-ifakt-polaris-as-an-example)
16. [Lean glossary: key terms from A to Z](#lean-glossary-key-terms-from-a-to-z)
17. [FAQ: lean manufacturing questions](#faq-lean-manufacturing-questions)
18. [Conclusion and first steps](#conclusion-and-first-steps)

## What is lean manufacturing? Definition and core idea

Lean manufacturing is a management system that designs how a company creates value from the customer's point of view and removes, step by step, everything that does not add value. The word "lean" is often misread as headcount reduction. The intent is a system that delivers more customer value with less floor space, inventory, lead time and defects. The MIT researchers summed this up in 1990: compared with mass production, lean production uses "less of everything": half the human effort in the factory, half the manufacturing space and half the investment in tools [4].

The Lean Enterprise Institute (LEI), the US nonprofit founded by James P. Womack, describes lean as a way of thinking and acting that improves a process in five steps: specify value, identify the value stream, create flow, establish pull and seek perfection [5]. Germany's Fraunhofer Institute for Manufacturing Engineering and Automation (IPA), an applied research institute for production, treats lean management as both a philosophy and a method whose goal is to eliminate waste and increase value creation in all areas of production (paraphrased); continuous improvement involving all employees and managers is central [37].

### Lean manufacturing vs. lean production vs. lean management

The terms are often used as synonyms, but their focus differs:

| Term | Focus | Typical scope |
|---|---|---|
| Lean manufacturing / lean production | designing fabrication and assembly according to lean principles | plant, line, cell, in-plant logistics |
| [Lean management](https://www.m365.fm/entity/lean-management/) | the leadership and organizational system that extends lean to the whole company | strategy, leadership, office functions, supply chain |
| Toyota Production System (TPS) | the historical model; Toyota's company-specific system | Toyota and its suppliers |
| Company production system ("XPS"; in Germany *Ganzheitliches Produktionssystem*, GPS) | a company-specific rulebook of principles and methods, often named after the company | multi-plant manufacturers, midsize firms |

Lean manufacturing is the application of lean thinking on the shop floor; lean management is the overarching framework. In the US, the two terms overlap so much that most search results use them interchangeably. German readers will know a third term: the "holistic production system" (GPS), defined in the German engineering guideline VDI 2870 Part 1 from July 2012. According to VDI, the guideline remains partly valid but is under revision, among other things to add occupational safety [36]. The closest US counterpart is not a standard but a framework: the Shingo Model of the Shingo Institute at Utah State University's Jon M. Huntsman School of Business, which assesses organizations against guiding principles of operational excellence and awards the Shingo Prize, founded in 1988 [64]. How lean relates to the broader idea of operational excellence is covered in [Operational Excellence vs. Lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/) and in the planned [operational excellence guide](https://www.m365.fm/en/learn/operational-excellence/) (planned).

### The core idea in one sentence

Lean sees a process as a stream through which a product flows to the customer, and only secondarily as a sequence of departments. Every minute a product waits, is moved, searched for or reworked adds lead time, ties up cash and hides problems. Lean makes this time visible and treats it as improvement potential.

A simple calculation shows the scale. A turned part goes through sawing (2 minutes), turning (12 minutes) and deburring (6 minutes), so 20 minutes of value-adding work. Between the steps it sits in buffers and reaches shipping after five working days of eight hours each, that is, after 2,400 minutes. The share of value-adding time in total lead time (the flow ratio) is 20 / 2,400 = 0.83 percent. The example is illustrative, but it matches the pattern value stream maps show in many plants: processing time is rarely the bottleneck; waiting time almost always is.

### Benefits of lean manufacturing

Most pages list benefits as percentages without a source. The documented effects are more modest in number but clearer in mechanism:

- **Less effort, space and capital for the same output:** the MIT researchers found lean production used about half the human effort, half the manufacturing space and half the tooling investment of mass production [4]; Japanese plants in Japan needed 16.8 labor hours per vehicle in 1989 against 24.9 for US plants in North America [6].
- **Shorter lead times and less inventory:** at Porsche, inventory fell from seven days of supply to one, and hours per 911 halved over several years [34].
- **Quality built into the process:** NUMMI's Corollas were judged equal in quality to those built in Japan, with a largely former GM workforce [56].
- **Problems surface earlier:** low inventory and andon make abnormalities visible instead of hiding them in buffers [3][23].
- **More employee involvement:** improvement suggestions at Porsche rose from 0.09 to 4.3 per employee [34].

Each of these results came with leadership change and took years; the examples section below shows the limits as well.

## History: from Ford and Toyota to MIT

Lean was not invented in the 1990s. The ideas grew over more than a century, and many competing pages date them inconsistently. The timeline below relies on primary and company sources.

| Year | Event | Source |
|---|---|---|
| 1896 | Sakichi Toyoda develops the Toyoda power loom with a device that stops it automatically when a weft thread breaks: the origin of jidoka | [1] |
| 1913 | On October 7, Ford launches a moving assembly line at Highland Park, Michigan; Model T assembly time falls from 12.5 hours to 93 minutes | [30] |
| 1924 | Sakichi Toyoda's Type G loom, according to Toyota the world's first automatic loom with non-stop shuttle change | [1] |
| 1927 / 1938 | Kiichiro Toyoda introduces flow production with a chain conveyor in loom assembly (1927) and applies the principle to body production at the Koromo plant, completed in 1938: the root of just-in-time | [1] |
| 1930s | The German aircraft industry uses takt as a control parameter; Toyota adopts the concept in the 1950s | [19] |
| 1940 | The US government launches Training Within Industry (TWI); by the end of World War II more than 1.6 million workers at over 16,500 plants are certified. After the war, TWI is taught in Japan and becomes a basis of kaizen culture | [59] |
| 1950 | W. Edwards Deming lectures on statistical quality improvement in Japan at the invitation of JUSE; the Deming Prize is founded in 1951 | [29] |
| 1950s–1960s | Shigeo Shingo develops the foundations of setup reduction (SMED), at Toyota's presses from 1969 | [11][12] |
| 1978 | Taiichi Ohno publishes his book on the Toyota Production System (English edition 1988) | [7] |
| 1984 | NUMMI, the GM-Toyota joint venture in Fremont, California, starts production | [3][56] |
| 1985 | MIT launches the International Motor Vehicle Program (IMVP) | [4] |
| 1986 | Masaaki Imai publishes *Kaizen: The Key to Japan's Competitive Success* | [35] |
| 1988 | John Krafcik coins "lean production" in the *Sloan Management Review*; the Shingo Prize is founded at Utah State University; Motorola, the company associated with Six Sigma, receives the Malcolm Baldrige National Quality Award | [2][3][45][64] |
| 1990 | Womack, Jones and Roos publish *The Machine That Changed the World* | [4] |
| 1996 | *Lean Thinking* sets out the five lean principles | [5] |
| 2004 | Jeffrey Liker publishes *The Toyota Way* with 14 management principles | [10] |
| 2011 | After the earthquake and tsunami in Japan, Toyota builds a business continuity plan with chip stockpiles | [31] |
| 2012 | VDI 2870 Part 1 on holistic production systems is published in Germany | [36] |

### Ford and mass production

Henry Ford is seen as the father of mass production. When a Model T chassis was first pulled by rope and winch past 140 workers at Highland Park on October 7, 1913, assembly time fell from 12.5 hours to 93 minutes, and the price of the Model T later dropped from $850 to $260 [30]. The repetitive work also had a cost: turnover was so high that Ford doubled wages to $5 a day [30]. Ford created flow, but for a single product in huge volumes. Toyota's situation was different. After World War II the Japanese company had neither the capital nor the market for Ford-style volume and had to build many variants in small quantities at a profit.

### Toyota: jidoka and just-in-time

Toyota traces its production system to two founders [1]. Sakichi Toyoda (1867–1930) laid the root of jidoka with his loom that stopped when a thread broke: a machine detects an abnormality and stops so that no defects flow on, and one person can tend several machines. His son Kiichiro Toyoda (1894–1952) developed the idea of just-in-time: making only what is needed, when it is needed, in the amount needed. Eiji Toyoda (1913–2013) and Taiichi Ohno (1912–1990) applied both consistently and created the actual Toyota Production System [1]. Ohno, who moved from Toyoda Spinning to Toyota Motor in 1943 and rose from shop foreman, described it in his 1978 book, published in English in 1988 [7][54].

### Deming, TWI and the quality movement

Two American influences shaped Japanese management in parallel. The first is Training Within Industry. The US War Department launched TWI in 1940 to train supervisors quickly for war production, with three standardized programs: Job Instruction (teaching a job step by step), Job Methods (improving a job by eliminating, combining, rearranging and simplifying steps) and Job Relations (treating people fairly as individuals) [59]. After the war, the program was taught in Japan, where it was well received and became a foundation of kaizen culture; Toyota combined it with Ohno's just-in-time principles [59].

The second is the quality movement. The Union of Japanese Scientists and Engineers (JUSE) invited W. Edwards Deming in 1950 to teach statistical methods of quality improvement; in 1951 JUSE established the Deming Prize [29]. The learning and improvement cycle that goes back to Walter Shewhart (PDCA, also written PDSA) is still the backbone of kaizen and A3 [29].

### MIT, Krafcik and the word "lean"

Western automakers lost market share to Japanese competitors in the 1980s. In 1985 MIT started the International Motor Vehicle Program with a budget of $5 million, funded by automakers, suppliers and governments; its world assembly plant survey covered 90 plants in 15 countries [4]. John Krafcik, who had worked for two years as an engineer at NUMMI, contrasted two systems in "Triumph of the Lean Production System" in the fall 1988 issue of the *Sloan Management Review* [2][3]: the "buffered" system of Western plants, which piles up inventory so machines always run, and the "lean" system, which cuts inventory to an absolute minimum so quality and downtime problems surface immediately [3].

In 1990, *The Machine That Changed the World* by James P. Womack, Daniel T. Jones and Daniel Roos presented the synthesis of the study [4]. The performance gaps were large: according to IMVP data, Japanese-owned plants in Japan needed an average of 16.8 labor hours per vehicle in 1989, US-owned plants in North America 24.9 hours and European plants in Europe 35.3 hours [6]. The researchers found large differences between and within regions and concluded that the best plants followed a lean rather than a mass production approach [6].

In 1996, Womack and Jones extended the concept to entire companies in *Lean Thinking* and set out the five principles [5]. In 2007 they condensed these into three themes: purpose, process and people [5]. A shorter take on the daily lean management routines for plant leaders is the m365.fm post [Lean Management in Manufacturing: The Complete Guide](https://www.m365.fm/community/u/mirko-p/blog/lean-management-in-manufacturing-complete-guide/).

## The 5 principles of lean manufacturing (Womack and Jones)

The five principles are meant as thinking steps, worked through in order and then repeated [5].

| Principle | Original wording (paraphrased) [5] | Shop floor example | Typical tools |
|---|---|---|---|
| 1. Value | specify value from the end customer's standpoint by product family | the customer pays for a housing that meets tolerance and arrives in three days, not for storage or rework | customer requirements, product family matrix |
| 2. Value stream | identify all the steps in the value stream for each product family, eliminating steps that do not create value | value stream walk from receiving to shipping | value stream mapping, gemba walk |
| 3. Flow | make the value-creating steps occur in tight sequence so the product flows smoothly toward the customer | cells instead of a process village, smaller batches | flow lines, SMED, line balancing, takt |
| 4. Pull | as flow is introduced, let customers pull value from the next upstream activity | production starts only on a kanban signal from the customer or next process | kanban, supermarket, FIFO lanes, heijunka |
| 5. Perfection | repeat the process until a state of perfect value with no waste is reached | daily improvement, standards raised continuously | kaizen, PDCA, A3, standard work |

### Principle 1: Specify value from the customer's perspective

Value exists only where a customer is willing to pay for an activity. Three test questions help classify it: Does the activity change the form, fit or function of the product? Is the customer willing to pay for it? Is it done right the first time? Only if all three answers are yes is the activity value-adding. Next come necessary but non-value-adding activities (such as legally required inspections), which should be minimized, and pure waste, which should be eliminated. The LEI accordingly distinguishes two types of muda: waste that cannot be removed immediately and waste that can be eliminated quickly through kaizen [9].

### Principle 2: Identify the value stream

The value stream covers all activities, value-adding and non-value-adding, that a product goes through from raw material to customer, along with the information flow that controls them [18]. It is tied to a product family: a plant does not have "one" value stream but as many as it has product families with similar process steps.

### Principle 3: Create flow

Flow means a product moves from step to step without waiting, intermediate storage or backtracking. The ideal is one-piece flow; in practice, continuous flow in small batches. The prerequisites are short changeovers, stable equipment, balanced work content and a layout that places process steps next to each other. Practical levers are described in [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

### Principle 4: Pull instead of push

In a push system, production follows a schedule and output is pushed to the next process whether it needs it or not. In a [pull system](https://www.m365.fm/entity/pull-system/), only actual consumption by the downstream process triggers replenishment [5]. Pull caps inventory in the system and therefore lead time; where flow is not possible, supermarkets with [kanban](https://www.m365.fm/entity/kanban/) connect the processes.

### Principle 5: Seek perfection

Perfection describes a direction, not an end state you can reach. Every improvement exposes the next waste; that is why the principles are designed as a cycle [5]. Day to day, principle 5 shows up as kaizen: many small improvements, implemented daily, based on standards.

## Muda, mura, muri and the 8 wastes of lean

Toyota thinking distinguishes three connected forms of loss. The LEI describes them as follows [9]:

- **Muda (waste):** activities that consume resources without creating value for the customer.
- **Mura (unevenness):** variation in the workflow, such as demand spikes the production system creates itself, or a cycle of rushing and waiting.
- **Muri (overburden):** people or equipment are pushed harder, faster or longer than their design or reasonable work design allows.

The LEI illustrates the link with a truck rated for three tons that has to deliver six tons [9]. One trip with six tons is muri (overloading, risk of breakdown). Two trips with four and two tons are mura (uneven deliveries jam the dock and then leave it idle) and also contain muri. Three trips with two tons each are muda (half-empty trips). Only two trips with three tons each avoid all three. The lesson for the plant: chasing muda while ignoring mura and muri treats symptoms. Heijunka and standard work address the causes.

### Ohno's seven wastes and the eighth

Taiichi Ohno grouped the typical wastes of mass production into seven categories [8]. Western lean literature added an eighth, unused employee talent; it does not come from Ohno [40]. Two mnemonics are common: **DOWNTIME** (Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing) is the one most US plants use; **TIMWOODS** lists the same eight in a different order and is common in Europe. A compact overview is on the m365.fm entity page for the [eight wastes](https://www.m365.fm/entity/eight-wastes/).

| DOWNTIME | Waste | Description [8] | Shop floor example | Countermeasures |
|---|---|---|---|---|
| D | Defects | inspection, rework, scrap | 5% scrap and 3% rework at a welding station | poka-yoke, jidoka, root cause analysis |
| O | Overproduction | producing more or earlier than the next process needs | 100 parts made, 80 ordered | pull, takt, heijunka |
| W | Waiting | idle people and machines | operator waits for machine, material or sign-off | line balancing, TPM, andon |
| N | Non-utilized talent | employees' knowledge and ideas go unused | improvement suggestions disappear | kaizen, suggestion system, training |
| T | Transportation | unnecessary movement of parts and products | parts travel through a central warehouse between two steps that could sit side by side | flow layout, cells, milk run |
| I | Inventory | more material than a tightly controlled pull system needs | three weeks of WIP in front of the paint shop | pull, kanban, smaller batches, SMED |
| M | Motion | unnecessary or straining body movements | searching for tools, bending for parts | 5S, ergonomic workstation design |
| E | Extra-processing (overprocessing) | steps the customer does not require, or that result from unsuitable tools | tighter tolerances than needed, double data entry | value analysis, standard work |

**Why overproduction is the worst waste:** The LEI calls overproduction the worst form because it contributes to all six others [8]. Producing too early or too much requires storage space (inventory), transport and handling (motion), ties up capacity that is missing elsewhere (waiting) and hides defects that show up only weeks later.

**Checklist: spot waste at your own workstation**

- [ ] Is there material sitting in front of a station for more than one shift?
- [ ] Do people have to search for tools, parts or information?
- [ ] Does someone regularly wait for a machine, a sign-off or material?
- [ ] Are parts handled or stored more than once?
- [ ] Are there inspections that exist only because of known but unsolved problems?
- [ ] Is more produced than the next process takes today?
- [ ] Are employees' ideas captured, worked on and answered?

## The house of the Toyota Production System

The Toyota Production System is often drawn as a house. Toyota itself names jidoka and just-in-time as its two core concepts [1]; the LEI calls jidoka one of the two pillars of TPS alongside just-in-time [25]. The exact house graphic varies by author; the version below shows the common structure.

| Level | Content | Function |
|---|---|---|
| Roof | highest quality, lowest cost, shortest lead time, safety and morale | goal of the system |
| Left pillar: just-in-time | takt, flow, pull (kanban), quick changeover | make the right item at the right time in the right amount [1] |
| Right pillar: jidoka | stop at abnormalities, andon, poka-yoke, separating human work from machine work | build quality into the process, never pass on a defect [1][25] |
| Center | people and teams, kaizen, waste reduction | engine of improvement |
| Foundation | heijunka, standard work, stable processes, kaizen | stability as the prerequisite for flow |

### Just-in-time

Toyota defines [just-in-time](https://www.m365.fm/entity/just-in-time/) as making only what is needed, when it is needed, and in the amount needed [1]. The LEI describes three operating elements: the pull system, takt time and continuous flow, with heijunka as the foundation [49]. In practice, JIT is often reduced to supplier deliveries ("JIT delivery" or sequenced delivery to an automotive line). The intended meaning is a production principle that keeps inventory deliberately low so problems become visible; just-in-time delivery by suppliers is only one application.

### Jidoka

Jidoka, often translated as "autonomation" or "automation with a human touch," gives machines and operators the ability to detect an abnormality and stop work immediately [25]. Quality is built into every process step, and people no longer have to watch machines. In practice jidoka follows a simple sequence: detect the abnormality, stop, respond immediately and fix the root cause. Its main tools are andon and poka-yoke.

### Why the foundation comes first

Many rollouts start with kanban because it is visible and tangible. Without level demand (heijunka), standard work and stable equipment, however, pull creates shortages and firefighting. Liker's principles 2 to 6 treat flow, pull, leveling, stopping to fix problems and standardized tasks as one connected package; he calls standards the foundation for continuous improvement [10].

## Lean manufacturing tools: the toolbox at a glance

Lean tools are the means to put the principles into practice. The table sorts them by purpose, effort and timing. The effort rating is an experience-based estimate for a midsize plant (here: roughly 100 to 500 employees) and depends heavily on the starting point and scope.

| Tool | Purpose | Effort | When to use |
|---|---|---|---|
| 5S | an orderly, safe, self-explanatory workplace | low | as an entry point and foundation for every other tool |
| Value stream mapping | make material and information flow visible, quantify waste | medium | at the start, to set priorities; then yearly |
| Takt time | align the production rhythm with customer demand | low | when designing lines and cells, when demand changes |
| Standard work | define the best known method, the baseline for improvement | medium | as soon as a process is stable enough |
| Line balancing | distribute work content evenly across stations | medium | on assembly lines with several stations |
| SMED (quick changeover) | shorten changeovers, enable smaller batches | medium | when changeovers drive batch sizes and inventory |
| Kanban | consumption-driven replenishment | medium | for regularly used parts with stable demand |
| Pull system | cap inventory, prevent overproduction | medium to high | after processes and changeovers are stable |
| Just-in-time | production synchronized with demand | high | as the target state, reached via takt, flow and pull |
| Heijunka | level production by volume and mix | high | with fluctuating demand and many variants |
| Poka-yoke | prevent defects or detect them immediately | low to medium | for recurring handling and assembly errors |
| Andon | make abnormalities visible at once, trigger fast response | low to medium | when problems are escalated too late |
| TPM | secure equipment availability and performance | high | when OEE losses come from breakdowns, minor stops, quality problems |
| Kaizen / continuous improvement | continuous, small-step improvement | low per action, high to anchor | permanently, from day one |
| A3 problem solving | structured problem solving on one sheet | low to medium | for problems without an obvious cause |
| Gemba walk | leaders on site, understanding the actual work | low | regularly, at every management level |
| Hoshin kanri | align strategy down to the shop floor | high | once a certain maturity is reached, usually in year two |

US manufacturers that want outside help can turn to the NIST Manufacturing Extension Partnership (MEP). Its centers offer lean services including value stream mapping, 5S, quick changeover, cellular flow, kanban, Six Sigma and Toyota Kata; NIST states that the MEP National Network has delivered more than 80,000 lean manufacturing projects [60].

### 5S: workplace organization as the foundation

[5S](https://www.m365.fm/entity/5s/) is a method for organizing a workplace so that visual control and lean operations are possible. The LEI lists the five steps as follows [14]:

| Japanese | English | Content |
|---|---|---|
| Seiri | Sort | remove everything unnecessary from the work area |
| Seiton | Set in order (Straighten) | arrange what remains so it is easy to find and use |
| Seiso | Shine | clean the work area, equipment and tools, and inspect while cleaning |
| Seiketsu | Standardize | maintain order and cleanliness through standards |
| Shitsuke | Sustain | build the discipline to keep the first four steps up permanently |

Some companies add a sixth S for safety ("6S") [14]. What matters is that 5S is not a cleanup day. The purpose is a workplace where every abnormality, such as a missing tool or an oil leak, is noticed immediately. That is why Shine also means inspection: whoever cleans a machine finds loose bolts and leaks.

**How to do it:** red-tag event for items that are not needed, shadow boards and floor markings, a cleaning and inspection plan, a 5S standard with photos of the target state, regular 5S audits by the teams themselves.

**Common mistakes:** 5S as a one-time event, audits without consequences, standards imposed from outside instead of developed by the team.

### Value stream mapping

[Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) (VSM) shows all steps of the material and information flow that a product goes through from order to delivery [18]. Toyota used the tool under the name "material and information flow diagram"; in the West it became known through the LEI workbook *Learning to See* by Mike Rother and John Shook, which received a Shingo Research Prize in 1999 [18][39].

**Steps:**

1. **Choose a product family:** group products with similar process steps [18].
2. **Name an owner:** one person leads the mapping and owns the value stream [18].
3. **Map the current state:** door to door, walking against the material flow from shipping back to receiving, with a stopwatch and notepad on site. For each process, record cycle time, changeover time, uptime, number of operators and inventory in front of the process.
4. **Add the information flow:** how do customer orders, schedules and control signals reach the processes [18]?
5. **Draw the timeline:** compare processing times with waiting times; this gives the flow ratio.
6. **Design the future state:** set takt, continuous flow where possible, supermarkets and pull where necessary, define a pacemaker process, level production [18].
7. **Create an action plan:** structure improvements into loops, set dates and owners.

The LEI stresses that a "perfectly drawn current-state map is not the point"; the goal is to understand the flow [18]. For inventory lead times, Little's law applies: lead time = inventory / throughput. If 600 parts sit in front of a station and the customer uses 300 parts per day, that inventory equals two days of waiting time. Digital tools add to pencil and paper when value streams have to be assessed with variants, capacities and scenarios; more in the section on digital tools and in the planned [value stream mapping guide](https://www.m365.fm/en/learn/value-stream-mapping/) (planned).

### Takt time

[Takt time](https://www.m365.fm/entity/takt-time/) is available production time divided by customer demand [19]. It sets the rhythm at which one product must be finished to match demand exactly. The word comes from the German *Takt* (beat, as in a musical meter); the German aircraft industry used the principle as early as the 1930s, and Toyota rolled it out widely in the 1950s [19].

**Worked example (after LEI):** A plant works 480 minutes per day, and the customer needs 240 parts per day. Takt time = 480 / 240 = 2 minutes [19].

Keep it separate from related measures:

| Measure | Definition | Driven by |
|---|---|---|
| Takt time | available time / customer demand | demand |
| Cycle time | actual time a process needs to complete one part | process capability |
| Lead time | time from a part entering to leaving the value stream | flow, inventory |

If a process's cycle time is above takt time, it cannot meet demand; if it is far below, overproduction or waiting follows. According to the LEI, Toyota typically reviews the takt of a process monthly and makes small adjustments every ten days [19].

### Standard work

[Standard work](https://www.m365.fm/entity/standard-work/) (standardized work) defines the exact work method for each operator in a process and, once posted, becomes the baseline for kaizen [17]. It has three elements [17]:

1. **Takt time:** the rhythm at which production must run.
2. **Work sequence:** the exact order of tasks within takt time.
3. **Standard inventory:** the in-process stock, including parts in machines, needed for smooth operation.

The LEI names three forms: the process capacity sheet, the standardized work combination table (manual time, walking time, machine time) and the standardized work chart with walking paths [17]. Standard work is not a rigid rulebook. It describes the best method currently known and is improved by the people who do the work. Liker puts it this way: standardized tasks are the foundation for continuous improvement and employee empowerment [10]. The TWI Job Instruction method described in the history section, which breaks a job into steps and key points, is a practical way to train it [59].

**Common mistakes:** 30-page work instructions instead of a one-page visual, standards without a link to takt, no process for changing standards.

### Line balancing

[Line balancing](https://www.m365.fm/entity/line-balancing/) distributes work content across stations or operators so that each station is as close to takt time as possible without exceeding it. The central tool is the operator balance chart (also called a yamazumi chart): each person is shown as a bar of stacked work elements and compared with takt time [24].

**Worked example (illustrative):** A shift has 7.5 hours, so 27,000 seconds of available time; demand is 450 units. Takt time = 27,000 / 450 = 60 seconds. The work elements add up to 99 seconds (A = 25, B = 20, C = 14, D = 22, E = 18). Minimum staffing = 99 / 60 = 1.65, so two people. Person 1 takes A, B and C (59 seconds), person 2 takes D and E (40 seconds). The chart makes person 2's 20 seconds of idle time visible; the next step is to reduce waste for person 1 or redistribute work sensibly. According to the LEI, the goal is to redistribute work elements so each operator's load is close to, but below, takt time [24].

Two practical notes complete the example. First, many plants do not plan against full takt time but against a slightly shorter planned cycle time to absorb variation and minor disruptions; at 59 of 60 seconds, person 1 has practically no reserve. Second, idle time is deliberately concentrated at the last person instead of spread evenly. That keeps it visible, and if kaizen cuts work content by 20 seconds, the station can later be merged. Idle time spread evenly disappears into the work and is often filled by a slower pace.

### SMED: quick changeover in steps

SMED stands for "single-minute exchange of die," meaning changeovers in single-digit minutes, under ten minutes [12]. Shigeo Shingo (1909–1990) developed its key insights in the 1950s and 1960s [12], including at Toyo Kogyo (today Mazda) in 1950, at Mitsubishi Heavy Industries in 1957 and at Toyota from 1969, where press changeovers dropped from one to two hours to a few minutes [11]. He published the method in English in 1985 as *A Revolution in Manufacturing: The SMED System* [11].

Why [SMED](https://www.m365.fm/entity/smed/) matters so much for lean: long [setup times](https://www.m365.fm/entity/setup-time/) lead to large batches, large batches to high inventory and long lead times. Short changeovers make small batches economical and are what make flow and heijunka possible in the first place.

**SMED in six steps:**

1. **Record the current changeover:** film the full changeover, from the last good part of the old order to the first good part of the new one. Log every activity with its duration.
2. **Separate internal and external setup:** internal setup can only be done while the machine is stopped (such as mounting the new die); external setup can be done while it runs (such as staging the die) [12]. This separation alone often cuts downtime noticeably, because searching and fetching drop out of the stop time.
3. **Convert internal to external setup:** move as many internal tasks outside as possible [12], for example by preheating dies, using preset fixtures or standardizing die heights.
4. **Streamline internal setup:** quick clamps instead of bolts, locating pins instead of adjustment, two people working in parallel, eliminating adjustments.
5. **Streamline external setup:** changeover carts, checklists, fixed staging locations according to 5S.
6. **Standardize and practice:** document the new changeover as standard work, train it and measure it; then the cycle starts again.

**Common mistakes:** investing in expensive hardware before organizational steps 1 to 3 are exhausted; not turning changeover gains into smaller batches, so inventory stays the same.

### Kanban

A kanban is a signal that triggers and controls the production or movement of parts in a pull system; the Japanese word means "sign" or "signboard" [15]. Kanbans can be cards, metal plates, colored balls or electronic signals; a typical card shows part name and number, supplier, container quantity, and storage and point-of-use locations [15].

The LEI distinguishes two basic types [15]:

- **Production kanban:** tells the upstream process what and how much to make. In the simplest case, one card equals one container. For processes with long changeovers, such as stamping, a signal kanban triggers production only when a minimum stock level is reached.
- **Withdrawal kanban (move kanban):** authorizes moving parts to the downstream process, internally between processes or as a supplier kanban with external suppliers, increasingly electronic over long distances.

**Toyota's six kanban rules (Ohno 1988):** Ohno describes six rules in his book [7][51]:

1. The downstream process withdraws exactly the quantity the kanban specifies from the upstream process.
2. The upstream process produces in the quantity and sequence the kanban specifies.
3. Nothing is made or moved without a kanban.
4. The kanban is always attached to the part or container.
5. Defective parts are not passed to the downstream process.
6. The number of kanbans is reduced step by step; this makes the system more sensitive and exposes problems.

**Worked example: number of kanbans (illustrative):** A common basic formula is: number of kanbans = demand per period × replenishment lead time × (1 + safety factor) / container quantity. If an assembly area uses 400 parts per day, replenishment from upstream takes half a day, the safety factor is 10 percent and a container holds 50 parts, the result is 400 × 0.5 × 1.1 / 50 = 4.4, so five kanbans. That caps the loop at 250 parts, a bit more than half a day of demand. If SMED later halves the replenishment time, the number of kanbans can be reduced in the spirit of rule 6, in this example from five to three.

**When kanban does not fit:** with highly volatile demand, very rarely used parts or customer-specific one-off parts. FIFO lanes, order-based control or CONWIP are often better there.

### Pull systems and supermarkets

A pull system caps inventory between two processes and lets the downstream process set the pace [5]. There are three basic forms: the supermarket pull system (replenish what was taken), the sequential pull system (make to order in sequence, capped by FIFO lanes) and mixed forms. A supermarket is a controlled inventory with defined maximum and minimum quantities from which the downstream process withdraws. Pull is the opposite of central scheduling for every single station: only one pacemaker process receives the schedule, and all upstream processes follow kanban signals. In US plants this often means the MRP/ERP system still plans materials and capacity, while the pacemaker schedule and kanban loops govern what is actually built each day.

### Heijunka: level production

[Heijunka](https://www.m365.fm/entity/heijunka/) levels the type and quantity of production over a fixed period [16]. This lowers inventory, capital, staffing needs and lead time, because upstream processes do not have to be sized for peaks.

**Leveling by volume (example after LEI):** A manufacturer receives 500 orders per week, arriving unevenly: 200 on Monday, 100 on Tuesday, 50 on Wednesday, 100 on Thursday and 50 on Friday. Instead of following this variation, it keeps a small finished goods buffer and produces a steady 100 units per day [16].

**Leveling by mix (example after LEI):** With weekly demand of 5 × A, 3 × B, 2 × C and 2 × D, a mass producer builds in the sequence "A A A A A B B B C C D D", while a lean producer builds "A A B C D A A B C D A B" [16].

The tool for this is the heijunka box, a visual schedule with product types on the vertical axis and time intervals on the horizontal axis [16]. The width of one interval usually equals the pitch, the time for one container: with a takt time of one minute and 20 parts per container, the pitch is 20 minutes [55]. In a shift with 450 minutes of available time, the heijunka box therefore has 22 slots per row, and every 20 minutes a material handler picks up the next kanban. This also shows at a glance whether the line is on schedule. Short changeovers are a prerequisite: the mixed sequence in the example above requires about ten type changes per cycle with four variants, which is only economical with SMED.

### Poka-yoke: prevent defects instead of inspecting

[Poka-yoke](https://www.m365.fm/entity/poka-yoke/) (error-proofing) means simple, low-cost devices that prevent errors such as using the wrong part, leaving out a part or installing a part backward; "poka" means inadvertent error and "yoke" avoidance [13]. The goal is 100 percent quality by catching errors at the source [13]. Poka-yoke is attributed to Shigeo Shingo [11].

The LEI distinguishes two types [13]:

- **Shutdown poka-yoke:** prevents the error, for example when a machine will not start while a workpiece is loaded incorrectly. The LEI calls this the most effective form [13].
- **Warning poka-yoke:** alerts the operator to an abnormality with a sound or light.

**Shop floor examples:**

- parts whose geometry allows assembly only in the correct orientation [13]
- light curtains over parts bins that release the line only after the operator has reached into every required bin; more advanced systems also check the right part combination for each variant [13]
- fixtures with locating pins that only accept the correct variant
- torque tools that count fastenings and block the next transfer while one is missing
- connectors that only fit one way

**Everyday examples** (after LEI): washing machines that will not start with the door open; lawn mowers that run only while the safety bar is held; table saws with automatic stop [13].

According to the LEI, good poka-yoke solutions are simple, durable and low-maintenance, highly reliable, low-cost and designed for the specific work situation [13]. Shingo also distinguished three detection methods [50]: the contact method checks physical features such as shape, size or color (for example, a locating pin). The fixed-value method signals when a set number of motions has not been reached (for example, the counting torque tool). The motion-step method checks whether the prescribed steps were done in the right order.

### Andon: make problems visible immediately

Andon (Japanese for "lamp") is a visual control tool that shows the status of an area at a glance and signals when an abnormality occurs [23]. A typical setup is a display board above the line where a station number lights up when a sensor detects a problem or an operator pulls a cord or presses a button; the team leader then responds immediately [23].

On Toyota's final assembly lines, the line does not stop the moment the cord is pulled but only when the vehicle reaches a fixed position at the end of the station (fixed-position stop). If the team can solve the problem within takt, the line keeps running; otherwise it stops at that position. Defects are not passed on and stops stay short [23].

**Prerequisite for andon:** a leadership culture in which pulling the cord is welcome. If people are criticized for line stops, you stop getting signals and start getting hidden problems.

### TPM: total productive maintenance

[TPM](https://www.m365.fm/entity/total-productive-maintenance/) is a set of activities that ensures every machine in a process can always perform its required task [20]. According to the LEI, "total" stands for three things: involvement of all employees, focus on total equipment productivity and consideration of the entire life cycle [20]. Unlike classic preventive maintenance, TPM involves operators in routine maintenance, improvement and simple repairs. The LEI names Denso, part of the Toyota group, as a pioneer [20].

TPM targets six big losses that feed directly into OEE [21]:

| OEE factor | Loss | Example |
|---|---|---|
| Availability | breakdowns | hydraulic failure |
| Availability | setup and adjustment | die change, startup |
| Performance | minor stops | jammed part, sensor trip |
| Performance | reduced speed | machine runs slower than rated |
| Quality | scrap | unusable parts |
| Quality | rework | parts have to be corrected |

TPM was formalized in Japan by the Japan Institute of Plant Maintenance (JIPM) [52]. A common representation uses eight pillars [52]: focused improvement (kobetsu kaizen), autonomous maintenance by operators (cleaning, inspecting, lubricating), planned maintenance, training and education, quality maintenance, early equipment management for new equipment, safety, health and environment, and TPM in administration. To get started, the first three are usually enough; the others follow as maturity grows.

**Worked example: OEE factors (illustrative):** A machine is scheduled for 450 minutes in a shift and stands still for 45 minutes due to breakdowns and changeovers: availability = 405 / 450 = 90%. With an ideal cycle time of 0.5 minutes, 810 parts were possible in 405 minutes; 770 were produced: performance = 770 / 810 = 95%. Of these, 762 are good parts: quality = 762 / 770 = 99%. Unrounded, OEE is 84.7%; as a check: 762 good parts × 0.5 minutes / 450 minutes = 84.7%. That is almost the LEI example in the KPI section, but it shows which loss costs how many minutes.

### Kaizen and continuous improvement

Kaizen (Japanese, roughly "change for the better") stands for continuous, small-step improvement by all employees. The term became known in the West through Masaaki Imai, whose book *Kaizen: The Key to Japan's Competitive Success* appeared in 1986; Imai founded the Kaizen Institute in 1985 [35]. In US plants the program usually runs under the name continuous improvement (CI); German plants call it KVP (*kontinuierlicher Verbesserungsprozess*).

There are two forms:

- **Daily kaizen:** small improvements in the team, often via idea cards on the shop floor board, implemented within days.
- **Kaizen event (kaizen blitz, rapid improvement event):** a cross-functional team improves a clearly bounded area in a short time, such as a layout or a changeover. According to the LEI, these workshops usually last five days; the LEI also warns against relying on events alone, because shop floor problem-solving capability grows only through daily kaizen [53].

The method is based on the PDCA cycle (plan, do, check, act), which goes back to Shewhart and was spread by Deming [29]. A standard is always the starting point: without a standard there is no yardstick against which to measure an improvement.

### A3 problem solving

The A3 report is a Toyota practice of capturing problem, analysis, countermeasures and action plan on a single sheet of A3 paper (297 × 420 mm; US plants usually use the similar 11 × 17 in. tabloid size) [22]. The LEI stresses that A3 is primarily a management process, not just a document [22]. More on the method is on the entity page for [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/).

**Typical structure (left: problem, right: solution):**

1. Background and why the topic matters
2. Current condition with facts and data from the gemba
3. Target (measurable, with a date)
4. Root cause analysis (such as 5 Whys, fishbone/Ishikawa)
5. Countermeasures, from several options to the best one
6. Action plan: who does what by when
7. Follow-up: proof of effect and standardization

The structure clearly follows the PDCA cycle. The LEI explicitly names an owner whose initials appear on the A3 [22]. The real value is the dialogue: the leader coaches through the A3 instead of handing out solutions.

### Gemba walk

*Gemba* is Japanese for "the actual place"; in lean it means the place where value is created [26]. According to the LEI, the [gemba walk](https://www.m365.fm/entity/gemba-walk/) is a management practice for grasping the current situation through direct observation and inquiry before taking action [26]. The LEI recommends following a product or process from start to finish, together with everyone involved, and asking three questions: What is the purpose of the process, how is the work actually done, and are the people engaged [26]? A practical guide is [What Is a Gemba Walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/); the routine is covered in more depth in the planned [shop floor management guide](https://www.m365.fm/en/learn/shop-floor-management/) (planned).

### Hoshin kanri

Hoshin kanri (policy deployment, sometimes called strategy deployment) is a strategic framework that aligns a company's goals vertically from the executive team to the shop floor and horizontally across departments, building on PDCA [27]. The LEI recommends combining hoshin with A3 so that each level works on the priorities set through hoshin [27]. For beginners, hoshin kanri is usually not the starting point but the step at which lean moves from individual projects into how the company is run, in our experience after one to two years [unverified: practitioner estimate].

## Lean vs. Six Sigma vs. Lean Six Sigma

Lean and Six Sigma are often mentioned together but have different priorities. Lean targets flow and the elimination of waste; Six Sigma targets the reduction of variation and defects with statistical methods. By common account, Six Sigma was developed at Motorola in the mid-1980s [58]; Motorola received the Malcolm Baldrige National Quality Award in 1988, and its award profile describes Six Sigma as a target of no more than 3.4 defects per million [45]. ASQ defines Six Sigma quality performance as 3.4 defects per million opportunities, accounting for a 1.5-sigma shift in the mean [28].

| Feature | Lean | Six Sigma | Lean Six Sigma |
|---|---|---|---|
| Core question | Where does the process not flow, where is waste created? | Why does the process vary, where do defects come from? | both, depending on the type of problem |
| Origin | Toyota Production System [1] | Motorola [45][58] | combination of both |
| Approach | PDCA, kaizen, value stream design | DMAIC: define, measure, analyze, improve, control [28] | DMAIC with lean tools |
| Tools | 5S, kanban, SMED, standard work, VSM | statistical process control, design of experiments, regression and capability analysis | combination |
| Organization | all employees, daily improvement | experts in roles (belts), project work | belt structure plus broad participation |
| Time horizon | days to weeks per improvement | typically several months per project [unverified] | mixed |
| Strength | fast, visible, participative | precise for complex quality problems | broad range of problems |
| Risk | tool activism without data | expert projects without broad impact | overhead from duplicate structures |

### DMAIC in brief

1. **Define:** set the problem, customer requirements and project scope.
2. **Measure:** measure baseline performance, check the measurement system.
3. **Analyze:** prove causes with data.
4. **Improve:** develop, test and implement solutions.
5. **Control:** sustain the improvement, for example with control charts and standards [28].

### The belt roles

Six Sigma organizes improvement through roles named after martial arts belts. According to ASQ, Black Belts are key people with extensive training in advanced statistics and project management [28]. Also common in practice are Yellow Belts (basic knowledge, team members on projects), Green Belts (lead smaller projects alongside their regular job), Master Black Belts (coaching, method ownership) and Champions (executives who sponsor projects). The roles and training hours are not standardized internationally; content and duration differ by provider. In the US, ASQ is one of several bodies that certify belts.

**Rule of thumb:** If a problem's cause is visible in the workflow (waiting, searching, inventory), lean tools help faster. If the cause is hidden and data-dependent (variation of a dimension, sporadic defects), a [Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/) project with DMAIC is the right fit. A detailed comparison is in [Lean vs. Six Sigma: Differences and How to Combine Them](https://www.m365.fm/community/u/mirko-p/blog/lean-vs-six-sigma-differences-combine/).

## Lean leadership and culture

Whether lean lasts depends less on the tools than on leadership. The structure of Liker's *The Toyota Way* (2004) already points that way: of the 14 principles, only seven deal with the process in the narrow sense; the rest concern philosophy, people and problem solving [10].

| Section according to Liker [10] | Principles (abridged) |
|---|---|
| Long-term philosophy | 1. base management decisions on a long-term philosophy, even at the expense of short-term financial goals |
| The right process will produce the right results | 2. create continuous flow to bring problems to the surface; 3. use pull systems to avoid overproduction; 4. level out the workload; 5. build a culture of stopping to fix problems; 6. standardized tasks are the foundation for improvement; 7. use visual control; 8. use only reliable, thoroughly tested technology |
| Develop your people and partners | 9. grow leaders who understand the work and teach it; 10. develop exceptional people and teams; 11. respect your partners and suppliers by challenging and helping them |
| Continuous problem solving | 12. go and see for yourself (genchi genbutsu); 13. make decisions slowly by consensus, implement rapidly; 14. become a learning organization through reflection (hansei) and continuous improvement |

### What lean leaders do differently

- **They go to where the work happens:** decisions are based on their own observation at the gemba, not on reports alone [10][26].
- **They ask instead of tell:** the leader develops problem-solving capability, for example through A3 coaching [22].
- **They make problems visible and reward reporting:** andon only works if a line stop counts as a contribution, not a disruption [23].
- **They lead with standards:** deviations from the standard trigger problem solving, not blame.
- **They align goals:** through hoshin kanri they connect company strategy and daily improvement [27].

### Shop floor management as a leadership tool

Most plants anchor lean leadership through shop floor management, often called a tiered daily management system in the US: short daily meetings at visual boards with metrics for safety, quality, delivery and cost (SQDC), an escalation cascade across several tiers (team, area, plant) and consistent follow-up of actions. Shop floor management is where standards, andon signals and kaizen ideas come together. The method is covered in depth in the planned [shop floor management guide](https://www.m365.fm/en/learn/shop-floor-management/) (planned).

### Lean beyond the shop floor

The principles can be transferred to office functions such as order processing, production planning, purchasing or engineering (lean office, lean product development). There the value stream is an information flow: a quote, an engineering change or an invoice "sits" in inboxes and approval loops instead of in buffers. Typical tools are process and swimlane analyses, visual team boards, standardization of recurring tasks and limits on work in progress. This matters directly for production, because a large share of a customer order's lead time is often created before the first shop floor operation.

**Green lean:** The US Environmental Protection Agency's *Lean & Environment Toolkit* (2016) helps lean and environmental specialists identify waste in terms of energy, water and materials use and eliminate environmental wastes as part of routine lean work [61]. A simple way to start is to add energy, water and material columns to the data boxes of a current-state value stream map.

### Respect for people

Running lean as a cost-cutting program with Japanese vocabulary wastes its most important resource. A plant that regularly turns productivity gains into layoffs loses the workforce's willingness to expose waste. A common approach is therefore a commitment at launch that no one will lose their job because of lean improvements; freed-up capacity goes into growth, insourcing or improvement teams.

Labor relations are part of the design, and the rules differ by country:

- **Unionized US plants:** standards, staffing changes, job content and new metrics can touch the collective bargaining agreement. Involve the union early; NUMMI showed that lean can work with a UAW-represented workforce [56].
- **Non-union US plants:** standing employee committees that discuss wages, hours or working conditions with management can raise questions under Section 8(a)(2) of the National Labor Relations Act, which bars employer domination of labor organizations. In *Electromation, Inc. v. NLRB* (1994), the Seventh Circuit upheld such a finding for employer-created "action committees," while stressing that its ruling was limited to those committees and recognizing the growing importance of employee involvement [62]. Whether a standing improvement team falls under this depends on its charter and what it discusses, so have employment counsel review the charter before launch.
- **Safety:** reducing muri is also a safety task. OSHA describes work-related musculoskeletal disorders as preventable and defines ergonomics as "fitting a job to a person" [63]; ergonomic risk belongs in every standard work sheet and every takt change.
- **German plants:** standards, metrics and technical systems that can monitor performance or behavior require early involvement of the works council (*Betriebsrat*), which has co-determination rights under the German Works Constitution Act. US companies with German sites should plan for this in their global rollout.

## How to implement lean manufacturing: a five-phase roadmap

There is no standard recipe, but there is a proven pattern: start small, learn in a pilot area, stabilize results, then roll out. The roadmap below is a guide for a midsize plant; the time frames are practitioner estimates [unverified] and depend on size, starting point and resources.

| Phase | Time frame (guide) | Goals | Deliverables |
|---|---|---|---|
| 0. Preparation | month 1 | clarify the goal and the why, align leadership, involve union or employee representatives | lean vision, steering committee, named lean coordinator |
| 1. Diagnosis | months 1–2 | understand the current state, quantify waste | value stream maps of the main product families, KPI baseline, pilot area chosen |
| 2. Pilot | months 3–6 | make the tools work in one area | 5S, standard work, shop floor board, SMED at the bottleneck, first kaizen events, measurable improvement |
| 3. Stabilize and standardize | months 6–9 | lock in the pilot, derive a lean standard for the plant | documented production system (principles, tools, roles), training plan, audits |
| 4. Roll out | months 9–12 and beyond | further value streams, pull and leveling, hoshin kanri | plant-wide tiered meetings, pull loops, goal cascade |

### Choosing the pilot area

The pilot area decides the credibility of the whole program. Proven criteria:

- [ ] **Relevance:** the area affects an important metric (bottleneck, delivery, quality).
- [ ] **Manageable scope:** one line or cell with a clearly bounded product family.
- [ ] **Leadership:** a supervisor who wants the change.
- [ ] **Visibility:** results are visible to and transferable to other areas.
- [ ] **Feasibility:** no parallel major projects such as equipment moves or ERP go-lives.
- [ ] **Measurability:** baseline values for lead time, OEE, quality and inventory exist or can be collected quickly.

### Tools in the right order

A sequence that often works: stability before flow, flow before pull, pull before leveling.

1. **Stability:** 5S, standard work, TPM basics, shop floor board, problem solving.
2. **Flow:** value stream design, flow layout, line balancing, SMED, smaller batches.
3. **Pull:** supermarkets, kanban, FIFO lanes, pacemaker process.
4. **Leveling:** heijunka, mixed-model sequences, takt-based control.
5. **Alignment:** hoshin kanri, lean in office functions, supplier development.

### Roles during implementation

| Role | Responsibility |
|---|---|
| Executive team / plant manager | vision, resources, personal presence at the gemba, chair of the steering committee |
| Lean coordinator (CI manager, lean manager) | method expertise, training, coaching, program management |
| Area managers and shift supervisors | daily leadership with standards, tiered meetings, escalation |
| Shop floor teams | apply standards, report abnormalities, implement kaizen ideas |
| Maintenance, logistics, quality | support for TPM, pull loops, problem solving |
| Union or employee representatives (works council in Germany) | input on standards, metrics, working time and workload questions |
| EHS (environment, health and safety) | ergonomics and safety review of new standards and layouts |

**Outside support in the US:** The NIST MEP National Network, with more than 450 service locations and partnerships in all 50 states and Puerto Rico, focuses on small and medium-sized US manufacturers and offers lean training and implementation support [60][65]. The Association for Manufacturing Excellence (AME), which says it was born out of the lean movement, runs conferences and events for practitioners [66]; the Shingo Institute assesses organizations against the Shingo Model [64]; the Lean Enterprise Institute publishes the lexicon and workbooks cited throughout this guide [5][39].

## Lean KPIs: how to measure progress

Lean success shows in a few meaningful metrics. More important than how many you track is that they are discussed on the shop floor every day. The planned [manufacturing KPIs guide](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned) goes deeper.

| KPI | Formula or definition | What it tells you | Lean link |
|---|---|---|---|
| Lead time | time from material receipt to shipping, e.g. inventory / throughput (Little's law) | How fast does an order flow? | flow, pull |
| Flow ratio (process cycle efficiency) | processing time / lead time | share of value-adding time | value stream |
| OEE (overall equipment effectiveness) | availability × performance × quality [21] | How productive is the equipment? | TPM, SMED |
| Days of supply | inventory / average daily demand | How many days does inventory cover? | pull, kanban |
| First pass yield (FPY) | good parts on the first pass / parts produced | quality without rework | jidoka, poka-yoke |
| On-time in-full (OTIF) | orders delivered on time and complete / all orders | customer view | takt, heijunka |
| Changeover time | last good part old to first good part new | flexibility | SMED |
| Productivity | output / labor hours | efficiency | standard work, line balancing |
| Safety | recordable incidents and near misses per period (in the US, often the OSHA recordable incident rate) | protecting people | 5S, standard work |
| Improvements per employee | implemented ideas / employees per year | engagement | kaizen |

**Worked example: OEE (after LEI):** availability 90%, performance 95%, quality 99% gives 0.90 × 0.95 × 0.99 = 84.6% OEE [21]. The metric is only as good as its data: if you take changeovers out of planned time, you get nice numbers but no hints of SMED potential.

**Checklist for a good KPI system**

- [ ] No more than five to seven KPIs per tier [unverified: guideline]
- [ ] Every KPI has an owner and a target
- [ ] KPIs are shown visually where the work happens
- [ ] Deviations trigger a defined response (action, escalation, A3)
- [ ] Results and process metrics are balanced (for example, OTIF and changeover time)
- [ ] Collecting the data takes less time than discussing it

## Common lean implementation mistakes

| Mistake | Consequence | Better |
|---|---|---|
| copying tools instead of understanding principles | kanban without stable processes creates shortages | keep the sequence stability, flow, pull, leveling |
| 5S as a cleanup event | after three months the old state is back | standards, audits, team ownership |
| lean as a cost-cutting program | people hide waste, resistance | employment security, use gains for growth |
| leadership delegates lean to a staff function | tools without leadership behavior | leaders at the gemba themselves, leader standard work |
| too many pilot areas at once | resources fizzle out, no visible success | one pilot, then roll out |
| ignoring muri | takt compression leads to overburden, injuries and errors | include ergonomics and workload in standard work |
| cutting inventory without risk analysis | delivery failures during disruptions | define strategic buffers for critical parts |
| KPIs without response | boards turn into wallpaper | every deviation gets an action |
| involving the union or employee representatives too late | delays, mistrust | include them in the steering committee from the start |
| digitizing before stabilizing | unstable processes get cast in software | standard first, then digital support |

## Disadvantages and limits of lean manufacturing

A guide that lists only benefits is incomplete. Criticism of lean falls into four areas.

### 1. Work intensification and strain

A systematic literature review by Rampasso and colleagues (2017) identified 22 categories of problems that lean production can cause for employee health and well-being; the most frequently cited was work intensification, which appeared in 13 of the 27 papers reviewed [33]. The authors also name increased stress and growing responsibility, demands and pressure [33]. This does not contradict lean thinking; it shows what happens when muda is attacked and muri is ignored. Toyota itself names muri explicitly as a type of loss [9], Liker calls for leveling the workload [10], and OSHA's ergonomics guidance treats work-related musculoskeletal disorders as preventable [63].

### 2. Supply chain resilience after 2020 and 2021

The COVID-19 pandemic and the 2021 semiconductor shortage put just-in-time under fire. Willy Shih (Harvard Business School) wrote in 2020 that the pandemic had exposed the vulnerability of production strategies and supply chains everywhere; companies should assess their risks and use process innovation rather than simply relocating sources of supply [32].

Toyota had learned the lesson ten years earlier. After the earthquake and tsunami of March 11, 2011, Toyota found that more than 1,200 parts and materials could be affected and drew up a list of 500 priority items needing secure supply [31]. Under the business continuity plan developed from this, suppliers had to stockpile two to six months' worth of chips for Toyota, depending on order-to-delivery time [31]. When the 2021 chip shortage forced many automakers to cut production, Toyota kept its production largely on plan through May, according to Fortune [47]; a person familiar with supplier Harman told Reuters that Toyota was, as far as they could tell, the only automaker properly equipped to deal with chip shortages [31]. A Toyota spokesman called the plan "a classic lean solution" [31]. Toyota was not immune, though: in August 2021 the company announced it would cut global production in September by 40 percent from its original plan [48]. Buffers buy time; they do not replace risk management across the supply chain.

The lesson: lean does not mean zero inventory at any cost. Lean means justifying inventory deliberately. A buffer for a critical part with a long replenishment time and few sources is a decision based on risk analysis, and therefore justified. Waste is uncontrolled inventory that nobody can justify. Krafcik had shown in 1988 that the "buffered" system piles up inventory that hides problems [3]; a strategic buffer, by contrast, is deliberately sized and transparent.

**Checklist: build resilience into a lean system**

- [ ] Identify critical parts (replenishment time, number of sources, impact of a shortage)
- [ ] Define, size and visualize strategic buffers for these parts
- [ ] Make the supplier structure transparent down to deeper tiers where possible
- [ ] Run scenarios (loss of a supplier, demand jump)
- [ ] Review buffers regularly and reduce them as risk falls

### 3. Limits in high-mix, low-volume and engineer-to-order production

Lean grew up in repetitive production. In job shops, high-mix/low-volume and engineer-to-order manufacturing, such as special machinery, kanban and heijunka fit only to a limited extent. The principles still apply, but the tools have to be adapted: instead of kanban, bottleneck scheduling, CONWIP, takt-paced (pulsed) assembly and visual project management usually help more.

### 4. Lean as a fad and tool copying

Many rollouts copy Toyota's visible tools but not the management system behind them. In 2007, Womack and Jones condensed their five principles into purpose, process and people [5]. The third theme describes exactly the management side that tool copying misses: one person responsible for each value stream, strategy deployment, frequent improvement cycles with A3 and standard work [5]. IMVP researchers MacDuffie and Pil also conclude that how the production system is organized matters more than heavy investment in high-tech equipment [6].

Even within GM the transfer was not automatic: although GM had direct insight into the Toyota system through NUMMI from 1984, about 15 years later lean had still not been implemented across GM's other US plants [56]. Knowing the tools is not enough; it takes leaders who anchor the system in their own plant.

## Lean and digital: lean 4.0, digital twins and Microsoft 365

Lean and Industry 4.0 are often presented as opposites: simple cards and boards on one side, sensors, software and AI on the other. In practice they complement each other. The term "lean 4.0" (sometimes "digital lean") describes the combination of lean principles with digital technology; it is not standardized and is used in different ways.

### What digital tools can do for lean

| Lean element | Analog | Digitally supported |
|---|---|---|
| Value stream mapping | paper, pencil, stopwatch | digital value stream model with data from ERP and MES, scenarios, simulation |
| Kanban | cards in circulation | e-kanban with automatic reordering, scanners or scales |
| Andon | pull cord and light | automatic alerts from machine data, mobile escalation |
| OEE | tally sheet | real-time machine data collection |
| Shop floor board | whiteboard | digital boards with automatically updated KPIs |
| Standard work | printed sheet | digital work instructions, video instructions |
| Line balancing | yamazumi board | simulating different balancing options before rebuilding the line |

### The digital twin in a lean context

A digital twin is a virtual representation of products, processes or equipment connected to real data. For lean, the process twin is the most interesting: a model of the value stream with capacities, cycle times, changeover times and inventory in which scenarios can be tested before a line is rebuilt. You can check, for example, how halving the batch size affects changeover share, inventory and lead time, or whether a new line balance holds takt. The planned [digital twin in manufacturing guide](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned) covers the topic in depth.

### Limits and sequence

A study by Winkler and Lugert at BTU Cottbus-Senftenberg in Germany (2017, 170 experts mostly from Germany, Austria and Switzerland) argues that Industry 4.0 concepts such as self-controlling cyber-physical production systems create dynamic material flows in which classic value stream mapping loses explanatory power; the method therefore needs to evolve [38]. That argues for developing lean's tools further, not for dropping lean.

In practice a simple sequence applies: first stabilize and standardize the process, then support it digitally. Liker states this as principle 8: use only reliable, thoroughly tested technology that serves people and processes [10]. A digital model of an unstable process reproduces its variation but removes none of its causes.

### Data as a lean topic

Data have a specific role in lean thinking: they should make problems visible, not monitor people. When introducing machine data collection or digital boards, define which data are analyzed at the equipment and process level, who has access and how person-level analysis is excluded. This builds trust with the workforce and the union where there is one; in German plants it is also a prerequisite for works council approval, and for EU sites the GDPR applies to any personal data.

### Microsoft 365 in daily lean work: what is realistic

Many plants already run Microsoft 365. For manufacturing frontline teams, Microsoft describes among other things Shifts for schedules, Planner for tasks, Approvals for sign-offs (for example, an operator requesting approval for an equipment adjustment), Updates for recurring check-ins such as inspections, Walkie Talkie for communication on the line, Lists for simple tracking, Power BI for KPI reports and Power Apps for custom workflows [57]. A few practical uses for lean routines follow from this:

| Lean routine | Possible Microsoft 365 setup | What to watch |
|---|---|---|
| Shop floor board, tiered meeting | Power BI report with lead time, OEE, FPY and OTIF on a screen at the board | data must come from MES or ERP; manual Excel upkeep eats the benefit |
| Action list | one Planner plan per area with owners and due dates | one list per meeting tier, not in addition to the paper list |
| Kaizen ideas, 5S audits | Lists or a simple Power App on a tablet at the workstation | feedback to submitters within fixed deadlines |
| Escalation | Teams channel per line, automated notifications where useful | does not replace a physical andon light on the line |
| Standard work | standard work sheets and video instructions stored centrally in SharePoint, opened by QR code at the workstation | one valid version, clear change process |
| Shift handover | Teams post or form with fixed fields (safety, quality, downtime, open items) | keep it short, or the handover itself becomes waste |

Two limits belong here. Microsoft 365 is not an MES and not a machine data collection system; real-time values for OEE or andon signals come from the controls and MES level. And a digital board does not replace going to the gemba: the tiered meeting still happens at the line; the screen only shows the numbers. For M365 admins this means: agree early with operations (and the union or works council, where there is one) on which data are visible at which level, and settle frontline licensing, the device concept (shared tablets) and permissions before the pilot. How Azure fits under this layer is the topic of the planned [Azure for manufacturing guide](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned).

## Documented lean manufacturing examples

Many success stories online come from vendors or cannot be checked. The examples below are publicly documented.

### Toyota: the reference system

Toyota is the historical reference system. Toyota itself describes its production system as the interplay of two concepts, just-in-time and jidoka [1]; IMVP research traced the lead of the best plants to the lean production approach as a whole [6]. Its handling of the 2021 chip shortage shows that the system does not dogmatically minimize inventory but weighs risks deliberately [31].

### NUMMI: same workforce, different system

NUMMI, the GM-Toyota joint venture launched in 1984 in Fremont, California, is the best-known example of lean transferring to a Western plant [3][56]. It was set up at the site of GM's Fremont plant, closed in 1982; most of the initial workforce, more than 85 percent, had been laid off from that plant, and the United Auto Workers (UAW) stayed on board [56]. Corollas built at NUMMI were judged equal in quality to those built in Japan, and the plant soon reached Japanese production speeds after launch [56]. John Krafcik worked there for two years as an engineer and described the management environment as very different from traditional plants; his experience fed into his 1988 article [3]. NUMMI showed that lean can work with the same workforce and the same union when the management system changes. The case also shows the limit: GM transferred little of what it learned to its other plants for years, and the plant closed in 2010 [56]. Part of the site was sold to Tesla the same year and reopened as the Tesla Fremont Factory [56].

### Porsche: lean in a crisis

Porsche, the German sports car maker, faced an existential crisis in the early 1990s: according to IndustryWeek, sales fell from 50,000 vehicles in 1986 to 14,000 in 1993, and a loss of about $150 million loomed for 1991 [34]. Wendelin Wiedeking, responsible for production and materials management from 1991, brought in Japanese consultants led by Chihiro Nakao; in the fall of 1992 Nakao had the storage racks at the Zuffenhausen plant cut in half [34]. According to IndustryWeek, inventory then fell from seven days of supply to one day, manufacturing hours per 911 from 120 (1992/93) to 60 by the end of the 1990s, and the number of improvement suggestions rose from 0.09 to 4.3 per employee [34]. Lean was not the only lever: Wiedeking cut the number of managers by 35 percent, set a cost reduction target of 30 percent, involved suppliers and launched a new model in 1996, the Boxster, which shared many parts with the new 911 [34]. The case shows that lean works in a premium, low-volume German manufacturer when leadership owns it; it also shows that the turnaround was a bundle of measures.

### What the examples have in common

In all three cases a system of principles, leadership and tools made the difference, not a single tool, and top management was personally involved. NUMMI also shows that a working model inside your own company is not enough if the leaders of your other plants do not adopt it.

## Software support: iFAKT Polaris as an example

> **Note: The author works at iFAKT GmbH.**

Software does not replace an understanding of lean, but it can support work with value streams, scenarios and KPIs. Several tool classes are relevant for the methods in this guide: manufacturing execution systems (MES) and machine data collection for OEE and production reporting, BI tools for KPIs, discrete-event simulation for layout and capacity, and specialized solutions for digital value stream models.

One example of the last class, from Germany, is [iFAKT Polaris](https://www.m365.fm/entity/polaris/) from [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), headquartered in Stuttgart, Germany [44]. According to the company, iFAKT was founded in 2001 and has about 25 employees [46]; the company shows ISO 9001 and ISO/IEC 27001 certification (TÜV SÜD) on its website [41]. The product Polaris IMS placed second in the production category of the 2025 Best of Technology Award of the German business weekly *WirtschaftsWoche* [67]. Two modules are listed in the Microsoft commercial marketplace (AppSource): Polaris VSM for digital value stream mapping with KPI calculation plus kanban and kaizen boards [43], and Polaris BSM for modeling business processes as swimlane diagrams [42].

Mapped to the methods in this guide, a solution of this kind mainly addresses four tasks (vendor description, not an independent test):

- **Value stream:** model value streams digitally and assess lead times, inventory and bottlenecks based on data.
- **Simulation:** test layout, capacity and takt scenarios before implementation, such as a new line balance or smaller batches after a SMED project.
- **Planning:** connect production and capacity planning with the value stream model.
- **KPI analysis:** analyze KPIs such as lead time, flow ratio or OEE and prepare plan-versus-actual comparisons for tiered meetings.

Whatever the vendor, check whether the tool reflects your standards and data model, whether it fits the existing IT landscape (ERP, MES, Microsoft 365) and whether its results actually feed into gemba walks, tiered meetings and improvement decisions. A closer look at the product is planned in the [iFAKT Polaris profile](https://www.m365.fm/en/learn/ifakt-polaris/) (planned); scheduling software in general is the topic of the planned [production scheduling and APS guide](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned).

## Lean glossary: key terms from A to Z

| Term | Short definition |
|---|---|
| A3 report | problem solving, analysis and action plan on one sheet of A3 (about 11 × 17 in) paper |
| Andon | signal (light, cord, button) that makes an abnormality visible immediately |
| CONWIP | control with a constant amount of work in process in the system; suited to high-mix production |
| Cycle time | actual time a process needs to complete one part |
| DOWNTIME | US mnemonic for the eight wastes: defects, overproduction, waiting, non-utilized talent, transportation, inventory, motion, extra-processing |
| FIFO lane | buffer with capped capacity that passes parts on in the order they arrived |
| Flow ratio | share of processing time in lead time (also called process cycle efficiency) |
| Gemba | the place where value is created; on the shop floor, the line or cell |
| Genchi genbutsu | go and see for yourself instead of relying on reports |
| Hansei | structured reflection after a project or a mistake |
| Heijunka | leveling production by volume and mix |
| Hoshin kanri | strategy (policy) deployment from the executive team to the shop floor |
| Jidoka | stop at abnormalities, quality built into the process; second pillar of TPS |
| Just-in-time | make only what is needed, when it is needed, in the amount needed |
| Kaizen | continuous, small-step improvement by all employees (continuous improvement, CI) |
| Kanban | signal that triggers production or movement in a pull system |
| Leader standard work | standard work for leaders, such as fixed times for gemba walks and tiered meetings |
| Lead time | time from a part or order entering to leaving the value stream |
| Muda, mura, muri | waste, unevenness, overburden |
| OEE | overall equipment effectiveness: availability × performance × quality |
| One-piece flow | making and passing on parts one at a time instead of in batches |
| Pacemaker process | the only process that receives the production schedule; all upstream processes follow via pull |
| Pitch | takt time × container quantity; time interval of the heijunka box |
| Poka-yoke | simple device that prevents an error or flags it immediately |
| SMED | changeover in single-digit minutes by separating and converting setup tasks |
| Supermarket | controlled inventory with minimum and maximum quantities from which the downstream process withdraws |
| Takt time | available production time / customer demand |
| TIMWOODS | European mnemonic for the same eight wastes |
| TPM | total productive maintenance: equipment care with everyone involved |
| TWI | Training Within Industry: US program from 1940 for job instruction, job methods and job relations |
| Yamazumi | stacked bar chart of each operator's work content compared with takt time |

## FAQ: lean manufacturing questions

### What is lean manufacturing in simple terms?

Lean manufacturing is a way of running a plant in which everything is aligned with what the customer values. Anything the customer would not pay for, such as waiting, searching, storing or rework, counts as waste and is removed step by step. The people who do the work improve their own processes.

### What are the 5 principles of lean manufacturing?

According to Womack and Jones (1996): specify value from the customer's perspective, identify the value stream, create flow, establish pull and seek perfection [5]. The principles build on each other and are repeated as a cycle.

### What are the 8 wastes of lean?

Defects, overproduction, waiting, non-utilized talent, transportation, inventory, motion and extra-processing, summarized in the US mnemonic DOWNTIME (TIMWOODS lists the same eight). The first seven go back to Taiichi Ohno [8]; the eighth was added in Western literature [40].

### What is the difference between lean manufacturing and lean management?

Lean manufacturing (or lean production) is the application of lean principles to fabrication and assembly. Lean management is the overarching leadership and organizational approach that extends lean thinking to the whole company, including office functions, engineering and the supply chain. In everyday US usage the terms overlap heavily.

### Who invented lean manufacturing?

The foundations were developed at Toyota from the 1950s, mainly by Taiichi Ohno and Eiji Toyoda, building on ideas from Sakichi and Kiichiro Toyoda [1]. American influences included Ford's flow production, the Training Within Industry program and Deming's quality teaching [30][59][29]. John Krafcik coined the term "lean production" in 1988 [2][3], and the 1990 MIT book *The Machine That Changed the World* made it widely known [4].

### What do muda, mura and muri mean?

Muda is waste, mura is unevenness and muri is overburden [9]. The three are connected: uneven workflows (mura) lead to overburden (muri), which in turn creates defects and waste (muda).

### Which lean tool should you start with?

A proven start is a value stream map to see priorities, plus 5S and standard work in one pilot area to create stability. Kanban and heijunka require stable processes and short changeovers and come later.

### How do you calculate takt time?

Takt time = available production time / customer demand [19]. Example: 480 minutes of working time per day and 240 required parts give a takt time of 2 minutes.

### What is the difference between takt time, cycle time and lead time?

Takt time comes from demand: it says how often one part must be finished. Cycle time is how long a process actually needs for one part; it has to be below takt time. Lead time measures how long a part travels through the value stream from entry to exit, including all waiting. It is usually many times longer than the sum of the cycle times.

### Which KPIs measure lean progress?

A few metrics discussed every day work best: lead time and flow ratio for flow, OEE for equipment, first pass yield for quality, on-time in-full for the customer view, plus changeover time, safety and the number of implemented improvements. What matters is that every deviation triggers an action.

### What is the difference between lean and Six Sigma?

Lean removes waste and creates flow; Six Sigma reduces variation and defects with statistical methods and the DMAIC cycle [28]. Lean Six Sigma combines both.

### What are the disadvantages of lean manufacturing?

The main risks are work intensification when muri is ignored [33], supply chain fragility when inventory is cut without risk analysis [31][48], limited fit of tools such as kanban in high-mix, low-volume production, and disappointing results when companies copy tools without the management system [6][56]. All four are avoidable, but only with leadership attention.

### Does lean work for small manufacturers and job shops?

Yes, the principles apply regardless of company size, and short decision paths are an advantage for small manufacturers. US companies can get help from NIST MEP centers, which focus on small and medium-sized manufacturers [65]. In job shops and engineer-to-order production, tools have to be adapted, for example bottleneck scheduling and takt-paced assembly instead of kanban.

### Is just-in-time still viable after the chip shortage?

Yes, if it is understood correctly. Just-in-time aims at flow and visible problems, not zero inventory at any cost. Since a continuity plan introduced after 2011, Toyota has required suppliers to hold two to six months of semiconductor stock and kept production stable longer than many competitors in 2021, even though it also had to cut output from September [31][47][48].

### How long does it take to implement lean manufacturing?

First measurable results in a pilot area are realistic within a few months; a plant-wide production system usually takes one to two years, and a durable lean culture several years [unverified: practitioner estimates]. Lean is not a project with an end date but a permanent management system.

### Can Microsoft 365 support lean manufacturing?

Yes, for tiered meetings, action tracking and KPIs. Power BI works for shop floor KPIs, Planner for action lists, Teams and Shifts for communication with shift teams [57]. But Microsoft 365 replaces neither an MES nor the gemba walk, and it pays off only once the standards are in place. See the section "Microsoft 365 in daily lean work."

## Conclusion and first steps

Lean manufacturing is more than a toolbox from Japan. It is a management system that grew over more than a century, from Toyoda's self-stopping loom, Ford's assembly line and the US Training Within Industry program to Ohno's Toyota Production System and the MIT studies that gave it its name in 1988. Its five principles are simple: value, value stream, flow, pull and perfection. Implementation is hard because it demands leadership, standards and daily problem solving.

The tools in this guide only work in the right order and together: stability before flow, flow before pull, pull before leveling. The criticism of lean deserves to be taken seriously. Work intensification happens when muri is ignored, and supply chains become fragile when inventory is cut without risk analysis. Toyota's chip stockpile shows that good lean weighs risks deliberately. Digital tools such as value stream models and simulation make lean faster and more precise, but they require stable processes.

**Your first steps in the next 30 days**

- [ ] Do a gemba walk along one important product family, from shipping back to receiving
- [ ] Measure the lead time of this product family and calculate the flow ratio
- [ ] Determine takt time for the product family and compare it with the cycle times
- [ ] Choose a pilot area using the criteria above
- [ ] Start 5S and a simple shop floor board with three to five KPIs in the pilot area
- [ ] Work on the pilot area's biggest problem with an A3
- [ ] Brief the leadership team and, where applicable, the union or employee representatives on goals, approach and employment security
- [ ] Ask IT or your Microsoft 365 team which systems could feed the board KPIs automatically later; start the board on paper first
- [ ] Check whether your state's NIST MEP center offers a lean training or assessment that fits your pilot [65]

---

## Further reading on m365.fm

**In-depth posts**
- [Lean Management in Manufacturing: The Complete Guide](https://www.m365.fm/community/u/mirko-p/blog/lean-management-in-manufacturing-complete-guide/) (shorter post on daily lean management routines)
- [Lean vs. Six Sigma: Differences and How to Combine Them](https://www.m365.fm/community/u/mirko-p/blog/lean-vs-six-sigma-differences-combine/)
- [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)
- [Operational Excellence vs. Lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/)
- [What Is a Gemba Walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)

**Glossary terms (entities)**
[Lean management](https://www.m365.fm/entity/lean-management/) · [5S](https://www.m365.fm/entity/5s/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Just-in-time](https://www.m365.fm/entity/just-in-time/) · [Pull system](https://www.m365.fm/entity/pull-system/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [SMED](https://www.m365.fm/entity/smed/) · [Setup time](https://www.m365.fm/entity/setup-time/) · [Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/) · [Eight wastes](https://www.m365.fm/entity/eight-wastes/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Line balancing](https://www.m365.fm/entity/line-balancing/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/)

**Sister guides (planned)**
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned, activate link after publication)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)

**German version:** [Lean Management in der Produktion](https://www.m365.fm/learn/lean-management/) (de-DE)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about lean manufacturing, operational excellence and the digital transformation of production, with a focus on how value stream models, simulation and KPI analysis help plants put lean into practice. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources [58] to [67] were added for the US version and opened and checked on that date.

1. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html
2. Triumph of the Lean Production System (Krafcik, J. F., Sloan Management Review, Fall 1988, pp. 41–52), title page and context. AllAboutLean (Christoph Roser). https://www.allaboutlean.com/definition-of-lean/triumph-of-the-lean-production-system/
3. The Term "Lean Production" Is 25 Years Old: My Thoughts on the Original Article. Lean Blog (Mark Graban). https://leanblog.org/2013/09/the-term-lean-production-is-25-years-old-my-thoughts-on-the-original-article
4. The Machine That Changed the World (Womack, J. P.; Jones, D. T.; Roos, D.), sample of the introduction. Free Press / Simon & Schuster, via boekhuis.nl. https://download.boekhuis.nl/9780743299794_fragm-docb.pdf
5. Lean Thinking and Practice. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/lean-thinking-and-practice/
6. MacDuffie, J. P.; Pil, F. K.: Changes in Auto Industry Employment Practices (chapter 9 in "Lean Work"). The Wharton School, University of Pennsylvania. https://faculty.wharton.upenn.edu/wp-content/uploads/2012/05/MacDuffiePil_LeanWork_Chap9.pdf
7. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge. https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
8. Seven Wastes. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/
9. Muda, Mura, Muri. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/muda-mura-muri/
10. The Toyota Way (Liker, J. K., McGraw-Hill 2004), overview of the 14 principles. Wikipedia. https://en.wikipedia.org/wiki/The_Toyota_Way
11. Shigeo Shingo. Wikipedia. https://en.wikipedia.org/wiki/Shigeo_Shingo
12. Single-Minute Exchange of Die (SMED). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
13. Poka-Yoke. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/poka-yoke/
14. 5S. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/five-s/
15. Kanban. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kanban/
16. Heijunka. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/heijunka/
17. Standardized Work. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/standardized-work/
18. Value-Stream Mapping. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/
19. Takt Time. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
20. Total Productive Maintenance. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/total-productive-maintenance/
21. Overall Equipment Effectiveness. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
22. A3 Report. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/a3-report/
23. Andon. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
24. Operator Balance Chart. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/operator-balance-chart/
25. Jidoka. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/jidoka/
26. Gemba Walk. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
27. Hoshin Kanri. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/hoshin-kanri/
28. What Is Six Sigma? American Society for Quality (ASQ). https://asq.org/quality-resources/six-sigma
29. Timeline: W. Edwards Deming. The W. Edwards Deming Institute. https://deming.org/timeline/
30. Ford Launched the Modern Assembly Line a Century Ago and Changed Society. IndustryWeek. https://www.industryweek.com/innovation/process-improvement/article/21961364/ford-launched-the-modern-assembly-line-a-century-ago-and-changed-society
31. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (March 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/
32. Shih, W.: Global Supply Chains in a Post-Pandemic World: Companies Need to Make Their Networks More Resilient (September/October 2020). Harvard Kennedy School, M-RCBG. https://www.hks.harvard.edu/centers/mrcbg/programs/growthpolicy/global-supply-chains-post-pandemic-world-companies-need-make
33. Rampasso, I. S. et al.: Primary problems associated with the health and welfare of employees observed when implementing lean manufacturing projects. Work, Vol. 58, No. 3 (2017), pp. 263–275. IOS Press. https://content.iospress.com/articles/work/wor2632
34. Mudd, T.: Back in High Gear. IndustryWeek. https://www.industryweek.com/leadership/companies-executives/article/21954759/back-in-high-gear
35. Kaizen Institute Success Story (history timeline). Kaizen Institute. https://kaizen.com/forty-years/kaizen-institute-success-story/
36. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review (German: Ganzheitliche Produktionssysteme). Verein Deutscher Ingenieure (VDI, Association of German Engineers). https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
37. Lean Management. Fraunhofer Institute for Manufacturing Engineering and Automation IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/Operational_excellence_production_logistics/lean-management.html
38. Die Wertstrommethode im Zeitalter von Industrie 4.0 [Value stream mapping in the age of Industry 4.0] (Winkler, H.; Lugert, A.). BTU Cottbus-Senftenberg, Chair of Production Economics (in German). https://www.b-tu.de/fg-produktionswirtschaft/aktuelles/ansicht/11318-die-wertstrommethode-im-zeitalter-von-industrie-4-0
39. Learning to See (Rother, M.; Shook, J.). Lean Enterprise Institute. https://www.lean.org/store/book/learning-to-see/
40. What About the 8th Waste? Gemba Academy. https://www.gembaacademy.com/gemba-insights/what-about-the-8th-waste
41. iFAKT GmbH, website (home page with certification badge and Polaris modules). iFAKT GmbH. https://www.ifakt.de/
42. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
43. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
44. iFakt VSM (Polaris): product profile. erp-software.org. https://erp-software.org/software/ifakt-vsm/
45. Baldrige Award Recipients: Motorola Inc. (1988), award profile. National Institute of Standards and Technology (NIST). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
46. iFAKT GmbH (entity page, company information). m365.fm. https://www.m365.fm/entity/ifakt/
47. Toyota cars and the chip shortage (August 2021). Fortune. https://fortune.com/2021/08/02/toyota-cars-chip-shortage-semiconductors/
48. Shiraki, M.; Ando, R.: Toyota to slash September production due to global chip shortage (August 19, 2021). Reuters, via Investing.com. https://www.investing.com/news/stock-market-news/toyota-to-slash-september-production-due-to-global-chip-shortage--nikkei-2593993
49. Just-in-Time. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/just-in-time/
50. Poka-yoke (citing Shingo, S.; Dillon, A.: A Study of the Toyota Production System from an Industrial Engineering Viewpoint, Productivity Press 1989). Wikipedia. https://en.wikipedia.org/wiki/Poka-yoke
51. Kanban (Toyota's six kanban rules, citing Ohno 1988, p. 176). Wikipedia. https://en.wikipedia.org/wiki/Kanban
52. Total Productive Maintenance (TPM): Principles, pillars, and implementation. Kaizen Institute. https://kaizen.com/insights/tpm-principles-pillars-implementation/
53. Kaizen. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kaizen/
54. Taiichi Ohno. Wikipedia. https://en.wikipedia.org/wiki/Taiichi_Ohno
55. Pitch. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pitch/
56. NUMMI. Wikipedia. https://en.wikipedia.org/wiki/NUMMI
57. Microsoft 365 for Manufacturing (Teams for manufacturing frontline). Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/teams-for-manufacturing
58. Bill Smith (Motorola engineer). Wikipedia. https://en.wikipedia.org/wiki/Bill_Smith_(Motorola_engineer)
59. Training Within Industry. Wikipedia. https://en.wikipedia.org/wiki/Training_Within_Industry
60. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement
61. Lean & Environment Toolkit: Preface (2016). US Environmental Protection Agency (EPA). https://www.epa.gov/lean/lean-environment-toolkit-preface
62. Electromation, Inc. v. National Labor Relations Board, 35 F.3d 1148 (7th Cir. 1994). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/35/1148/605691/
63. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics
64. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
65. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
66. About AME. Association for Manufacturing Excellence. https://www.ame.org/about-ame
67. Best of Technology Award 2025: winners (category Produktion / production). WirtschaftsWoche. https://award.wiwo.de/bot/gewinner-2025/

# Editorial notes

**Cannibalization with the existing English blog post**

m365.fm already has "Lean Management in Manufacturing: The Complete Guide" (community blog, English, approx. 1,700 words, self-referencing canonical, language switcher with 15 machine-language versions). The new pillar and the blog post sit in the same language market, so unlike the German pillar, language separation does not solve the overlap. Recommendation:

1. **Split the keywords:** This pillar owns "lean manufacturing" (broad, informational, high volume) and the tool and principle terms. The blog post keeps the narrower angle "lean management system / daily lean routines for plant leaders". Its title currently uses "The Complete Guide", which competes directly with the pillar's comprehensive intent. Suggested retitle (editor decision, URL can stay): "Lean Management in Manufacturing: Daily Routines and First Steps for Plant Leaders". This pillar deliberately avoids "complete guide" in its H1 and meta title.
2. **No cross-canonical, no hreflang to the blog:** The two pages are not equivalent, so neither a canonical from blog to pillar nor an hreflang pair is appropriate. The blog's 15 language variants are a separate cluster; do not add this pillar to it.
3. **Internal links in both directions:** The pillar links to the blog post twice (history section, Further reading) with the anchor describing its narrower role. Add a link from the blog post to this pillar with the anchor "lean manufacturing" (for example in its "Where does lean come from?" or "What are the principles of lean?" section) so that Google sees the pillar as the hub.
4. **Monitor and consolidate if needed:** After publication, check Google Search Console for queries where both URLs get impressions (for example "lean manufacturing guide", "lean management in manufacturing"). If the blog post keeps outranking or splitting clicks with the pillar after about three months, merge its unique parts (the eight-step rollout, lead-time example) into the pillar and 301-redirect the blog URL to `/en/learn/lean-manufacturing/`.
5. **hreflang pair with the German pillar:** This page is the equivalent English version of `/learn/lean-management/`. Set reciprocal hreflang annotations `en-US` (this URL) and `de-DE` (German URL) plus `x-default` to the English URL, in the HTML head or XML sitemap, not in JSON-LD. **Update the German pillar's editorial note 2** ("do not set hreflang yet"), which assumed no equivalent English pillar existed; that condition is now met. Self-referencing canonicals on both; no cross-language canonical.

**Localization decisions (German -> US)**

1. **H1, meta, keywords:** "Lean Management" (German main keyword) -> "lean manufacturing" (US main keyword; the US SERP for "lean management" is dominated by general management and software pages, while "lean manufacturing" carries the plant intent). Slug as given: `/en/learn/lean-manufacturing/`.
2. **Labor context:** German works council (*Betriebsrat*) and the Works Constitution Act -> US union contracts, NLRA Section 8(a)(2) with *Electromation* (1994) [62], OSHA ergonomics [63]; the German context is kept in one explained bullet for US companies with German sites. The German note on § 87(1) no. 6 BetrVG is not needed in the US text.
3. **Frameworks and support:** VDI 2870 / "holistic production system" kept and explained; added the Shingo Model and Shingo Prize [64], NIST MEP [60][65], AME [66] and the EPA Lean & Environment Toolkit for green lean [61].
4. **History:** added Training Within Industry (1940) as the US root of standard work training and kaizen [59] and Ford's $5 day [30]; the German book title "Die zweite Revolution in der Autoindustrie" and source [45] produktion.de (a German competitor page) were dropped. [45] now points to NIST's 1988 Baldrige profile of Motorola, which also covers the 3.4 defects-per-million target; Motorola origin additionally via [58].
5. **Terms:** TIMWOODS -> DOWNTIME as primary mnemonic (TIMWOODS kept); KVP -> continuous improvement (CI); Mittelstand -> small and midsize manufacturers; Meister -> supervisor; Regelrunde -> tiered meeting; A3 explained as about 11 × 17 in; shop floor KPIs SQDC; OSHA recordable rate as a safety KPI example.
6. **NUMMI:** added the 2010 sale of part of the site to Tesla (Tesla Fremont Factory) [56], which US readers know.
7. **Porsche** kept as a documented case with figures from IndustryWeek, labeled as a German manufacturer.

**Open or still-to-verify items (as of November 20, 2026)**

1. **[unverified] in the text (5 places, carried over from German):** Six Sigma project duration, timing of hoshin kanri, roadmap time frames, five to seven KPIs per tier, implementation duration in the FAQ. All are explicitly practitioner estimates or guidelines and can stay as they are.
2. **Wikipedia as a source [10][11][50][51][54][56][58][59]:** used for Liker, Shingo, poka-yoke detection methods, kanban rules, Ohno, NUMMI, Bill Smith and TWI, each pointing to primary literature. Before publication, ideally replace with the book editions (Ohno 1988, Shingo/Dillon 1989, Liker 2004) and, for TWI, with the War Manpower Commission's TWI reports or Dinero's *Training Within Industry* (Productivity Press). The Bill Smith article contains an internal date inconsistency (1986 vs. 1987); the text therefore says only "mid-1980s" and "by common account".
3. **Electromation [62]:** a legal summary, not legal advice. The text says only that standing committees dealing with terms of employment "can raise questions" and recommends counsel review. Have US employment counsel check the paragraph; NLRB doctrine on employee involvement committees can change.
4. **NIST MEP figures [60][65]:** "more than 80,000 lean manufacturing projects" and "more than 450 service locations" are NIST's own statements; the $18.8 billion savings claim on the same page was deliberately not used (program self-reporting).
5. **Microsoft 365 section [57]:** apps and scenarios from Microsoft Learn (checked November 20, 2026: Shifts, Planner, Approvals, Updates, Walkie Talkie, Lists, Power BI, Power Apps); product names change often, recheck before publication. The mapping to lean routines is our own, deliberately cautious assessment.
6. **Krafcik 1988:** issue details (Fall 1988, pp. 41–52) via [2] and [3]; volume/issue of the Sloan Management Review (probably Vol. 30, No. 1) not confirmed online and not stated.
7. **Eighth waste:** often attributed to Liker (2004); not verifiable from a primary source online, so phrased neutrally as "added in Western literature" [40]. The DOWNTIME mnemonic is widespread in US sources (seen on mrpeasy.com and others in the SERP) but has no single originator; no source cited for it.
8. **"Learning to See":** publication year (commonly 1998) not confirmed on the LEI page; only the 1999 Shingo Research Prize is stated.
9. **Porsche figures [34]:** IndustryWeek, online dated December 21, 2004; the 60 hours per 911 refer to "today" in the article (about 1999). A cross-check against Porsche annual reports remains desirable.
10. **Toyota chip stockpile [31][47][48]:** the Reuters date is not in the nippon.com text; the URL code points to March 9, 2021. The 40 percent cut in September 2021 is relative to the original production plan. Re-verified November 20, 2026 (1,200 parts, 500 priority items, two to six months, "a classic lean solution", Harman insider quote).
11. **iFAKT facts:** headquarters Stuttgart via [44] and [46]; ISO 9001 and ISO/IEC 27001 via the iFAKT website badge "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" [41] (rechecked November 20, 2026). Founded 2001 and about 25 employees are company information via the m365.fm entity page [46] (the iFAKT site says "over 25 years of experience", consistent with 2001). The WirtschaftsWoche Best of Technology Award 2025 (production category, 2nd place iFAKT GmbH, Polaris IMS) is independently confirmed on the WiWo winners page [67] (rechecked November 20, 2026). AppSource listings: Polaris BSM via [42], Polaris VSM via [43]. No other office locations are mentioned.
12. **Disclosure and FTC:** The iFAKT section and the author box carry exactly "Note: The author works at iFAKT GmbH." This is a clear and conspicuous disclosure of the author's material connection as expected under the FTC's Guides Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR Part 255). The FTC's 2023 revision defines a clear and conspicuous disclosure as "difficult to miss (i.e., easily noticeable) and easily understandable by ordinary consumers" (https://www.ftc.gov/system/files/ftc_gov/pdf/p204500_endorsement_guides_in_2023.pdf, checked November 20, 2026); the disclosure sits directly under the section heading and in the author box. iFAKT does not pay for publication, so the page carries no "sponsored" or "paid partnership" label and no `rel="sponsored"`. Open point carried over from the German consistency check: the m365.fm entity page for iFAKT (https://www.m365.fm/entity/ifakt/) is currently labeled "Sponsored" / "Paid partnership with iFAKT GmbH"; this contradicts the confirmation that iFAKT does not pay. Clarify and align the entity page.
13. **Worked examples:** turned-part flow ratio, line balancing, kanban, OEE factor examples are illustrative and labeled; takt, OEE, pitch and heijunka examples come from the LEI. All recalculated for the English version (20 / 2,400 = 0.83%; 27,000 / 450 = 60 s; 99 / 60 = 1.65 -> 2; 400 × 0.5 × 1.1 / 50 = 4.4 -> 5; 405/450 × 770/810 × 762/770 = 84.7%; 0.90 × 0.95 × 0.99 = 84.6%; 450 / 20 = 22.5 -> 22 slots). Set them off as example boxes in the layout.
14. **House of TPS:** a common representation, not an official Toyota graphic; stated in the text. Add as SVG.
15. **Competitor word counts:** estimates based on fetched main text, November 20, 2026.
16. **Jump links:** table of contents anchors include "lean-40" for "lean 4.0"; check that the CMS generates identical anchors.
17. **Internal links:** blog posts and entity pages taken from the German version (verified there). English sister guides use the slug map of the localization brief and are marked "(planned)"; activate after publication. The German pillar is linked in Further reading as the `de-DE` counterpart.
18. **Meta title and description:** title 52 characters, description 148 characters including spaces; check pixel width in a snippet tool (title limit approx. 580 px).
19. **Units:** the article uses minutes, seconds and parts; the only physical units are tons in the LEI truck example (kept as in the LEI original) and A3 paper with its inch equivalent.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Lean Manufacturing: Principles, Tools, Implementation, and Limits",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/lean-manufacturing/",
      "about": {"@type": "Thing", "name": "Lean manufacturing", "sameAs": "https://www.m365.fm/entity/lean-management/"},
      "mentions": [
        {"@type": "Thing", "name": "5S", "sameAs": "https://www.m365.fm/entity/5s/"},
        {"@type": "Thing", "name": "Kanban", "sameAs": "https://www.m365.fm/entity/kanban/"},
        {"@type": "Thing", "name": "Just-in-time", "sameAs": "https://www.m365.fm/entity/just-in-time/"},
        {"@type": "Thing", "name": "SMED", "sameAs": "https://www.m365.fm/entity/smed/"},
        {"@type": "Thing", "name": "Poka-yoke", "sameAs": "https://www.m365.fm/entity/poka-yoke/"},
        {"@type": "Thing", "name": "Heijunka", "sameAs": "https://www.m365.fm/entity/heijunka/"},
        {"@type": "Thing", "name": "Total productive maintenance", "sameAs": "https://www.m365.fm/entity/total-productive-maintenance/"},
        {"@type": "Thing", "name": "Value stream mapping", "sameAs": "https://www.m365.fm/entity/value-stream-mapping/"},
        {"@type": "Thing", "name": "Lean Six Sigma", "sameAs": "https://www.m365.fm/entity/lean-six-sigma/"},
        {"@type": "SoftwareApplication", "name": "iFAKT Polaris", "sameAs": "https://www.m365.fm/entity/polaris/"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What are the 5 principles of lean manufacturing?", "acceptedAnswer": {"@type": "Answer", "text": "According to Womack and Jones (1996): specify value from the customer's perspective, identify the value stream, create flow, establish pull and seek perfection."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 3, "name": "Lean Manufacturing", "item": "https://www.m365.fm/en/learn/lean-manufacturing/"}
      ]
    }
  ]
}
```

- `FAQPage`: add all 16 FAQ questions as `Question` / `acceptedAnswer` (answer text without [n] references); one is shown above as a pattern. Google has limited FAQ rich results to selected government and health sites since 2023; the markup does no harm and helps machine readers, but brings no FAQ snippet.
- `HowTo` for "SMED in six steps" optional only: Google retired HowTo rich results in 2023. Low priority.
- `DefinedTermSet` optional for the glossary (one `DefinedTerm` per entry).
- hreflang belongs in the HTML head or XML sitemap, not in JSON-LD.
- iFAKT section: only the visible disclosure "Note: The author works at iFAKT GmbH." in HTML, per Mirko's decision of November 20, 2026.

**Recommended graphics**

1. House of the Toyota Production System (SVG, labeled "common representation").
2. Timeline from 1896 to 2012 (horizontal, with TWI 1940 and NUMMI 1984 highlighted for US readers).
3. Example value stream map of the turned part with timeline (20 minutes processing vs. 2,400 minutes lead time).
4. Yamazumi chart for the line balancing example (59 s / 40 s against 60 s takt).
5. DOWNTIME infographic with one shop floor example per waste.
6. Roadmap graphic for the five phases with the "stability, flow, pull, leveling" sequence.

## Review log

Review and optimization loop for the US English version, November 20, 2026, with five roles: subject-matter expert (lean/TPS practitioner), SEO specialist (US), reader from the US target audience (plant manager of a 300-employee discrete manufacturer, with an M365 admin colleague reading the digital section), fact checker (re-verifies every new or changed fact and every new US source online), critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms). Starting point: the German pillar after its own two review loops and the consistency check of November 20, 2026. Three rounds, two optimization passes; all five satisfied in round 3. First draft: 14,610 words H1 to Conclusion (`wc -w`); final: 14,791 words.

### Round 1: findings and verdicts

- **Subject-matter expert (not satisfied):** Method content and all worked examples carried over correctly (recalculated: flow ratio 0.83%; Little's law 2 days; takt 2 min; line balancing 60 s, 1.65 -> 2, 59 s / 40 s; kanban 4.4 -> 5; OEE 84.7% and 84.6%; pitch 20 min, 22 slots). Issues: (1) the claim that US lean practitioners "still use TWI Job Instruction" and "many US plants train standard work with TWI" was stated as fact without a source; (2) "takted assembly" is not an English term; (3) the US distinction between MRP planning and kanban execution was missing in the pull section (added in the draft and accepted).
- **SEO specialist US (largely satisfied):** Main keyword in H1, short answer, meta title and four H2s. Issues: (1) the principles H2 did not match the PAA wording "5 principles of lean manufacturing"; (2) no benefits section, although NetSuite, Xometry and Azumuta all rank with one and "benefits of lean manufacturing" is a frequent secondary query; (3) meta description length stated as 150 characters, actual 148; (4) metadata word count placeholder "13,9xx" and the competitive analysis claim "13,900 words, 70 percent longer" no longer matched the draft; (5) cannibalization with the existing English blog post must be handled differently from the German case, because both pages are English.
- **US reader, plant manager / M365 admin (satisfied with reservations):** The labor bullets (union, NLRA, OSHA) are the first lean guide that addresses the US legal context in plain terms; NIST MEP and DOWNTIME are useful. Wants to know where to get help without a consultant (answered by MEP in roadmap, FAQ and 30-day list). Asked for implementation cost figures; M365 admin satisfied with the limits stated for Microsoft 365.
- **Fact checker (not satisfied):** Re-verified online: TWI (1940, War Department / War Manpower Commission, 1.6 million workers, 16,500 plants, postwar Japan and kaizen) [59]; *Electromation* (7th Cir. 1994, action committees, narrow holding, quotes) [62]; OSHA ergonomics definition [63]; Shingo Prize 1988, Huntsman School [64]; NIST MEP 80,000 projects and listed methods [60], 450 service locations, 50 states and Puerto Rico, focus on small and medium-sized manufacturers [65]; AME "born out of the lean movement" [66]; EPA toolkit 2016, energy, water and materials [61]; NIST 1988 Baldrige profile of Motorola with the 3.4-per-million target [45]; Bill Smith page (internal 1986/1987 inconsistency, so only "mid-1980s") [58]; Ford $5 day [30]; NUMMI December 1984, closure April 1, 2010, Tesla purchase 2010 [56]; WiWo award 2025, production, 2nd place iFAKT GmbH [67]; iFAKT TÜV SÜD ISO badge and "over 25 years" [41]; Microsoft Learn apps incl. Updates and the Approvals example [57]; Reuters/nippon.com Toyota figures [31]; FTC 2023 definition of clear and conspicuous. Errors or overreach: (1) "LEI founded in Cambridge, Massachusetts" not in any cited source; (2) "Fraunhofer IPA, one of Europe's largest applied research institutes" not sourced; (3) "Shewhart at Bell Labs" and "PDSA in Deming's later wording" go beyond [29]; (4) the TWI usage claims (same as expert). Rejected in the draft before round 1: NIST's "$18.8 billion savings" (program self-reporting) and "MEP centers in every state, subsidized rates" (replaced with the verified wording "partnerships in all fifty states and Puerto Rico").
- **Critic (not satisfied):** iFAKT section neutral and correctly disclosed; vendor capabilities should be labeled as the vendor's description (done in the draft: "vendor description, not an independent test"). Several "not X but Y" constructions remain ("not an argument against lean but for developing its tools", "is not waste; it is a decision"). Germanisms: "takted", "process village" acceptable US usage, "milk run" fine. No em-dash chains found.

**Discussion of conflicts and decisions:**

- *Benefits section:* SEO wanted a full H2 "Benefits of lean manufacturing" with the usual percentage claims; the critic and fact checker refused any unsourced percentages. Decision: a short H3 under the definition with five benefits, each tied to a cited result (IMVP, Porsche, NUMMI, Krafcik, LEI andon) and a closing caveat.
- *Implementation cost:* the reader asked for typical budgets; no verifiable US source exists for a generic figure. Decision: no cost numbers; point to NIST MEP for scoped offers.
- *US company examples:* SEO suggested adding John Deere or Nike as they appear on NetSuite; the fact checker found no figures in the competitor sources. Decision: keep NUMMI (US plant, documented) and Porsche; add the Tesla follow-up for NUMMI.
- *Cannibalization:* SEO proposed a canonical from the blog post to the pillar; the expert and critic argued the blog post has its own useful angle (daily routines). Decision: keyword split, retitle suggestion for the blog, two-way internal links, Search Console monitoring and a 301 merge only if both URLs keep competing after about three months (editorial notes).
- *German context:* the critic suggested deleting the works council bullet; the reader (US company with a German site) wanted to keep it. Decision: keep one explained bullet.

### Optimization 1: what changed (old -> new)

- "the organization founded by James P. Womack in Cambridge, Massachusetts" -> "the US nonprofit founded by James P. Womack".
- "Fraunhofer IPA, one of Europe's largest applied research institutes for production" -> "Fraunhofer IPA, an applied research institute for production".
- "Walter Shewhart at Bell Labs (PDCA, or PDSA in Deming's later wording)" -> "Walter Shewhart (PDCA, also written PDSA)".
- History: sentence "Lean practitioners in the US today still use TWI Job Instruction to train standard work." -> deleted.
- Standard work: "Many US plants train standard work with the TWI Job Instruction method" -> "The TWI Job Instruction method ..., which breaks a job into steps and key points, is a practical way to train it [59]."
- "takted assembly" (2 places) -> "takt-paced (pulsed) assembly" / "takt-paced assembly".
- H2 "The five lean principles (Womack and Jones)" -> "The 5 principles of lean manufacturing (Womack and Jones)"; table of contents and anchor updated.
- New H3 "Benefits of lean manufacturing" (five sourced points plus caveat).
- "That is not an argument against lean but for developing its tools further." -> "That argues for developing lean's tools further, not for dropping lean."
- "... is not waste; it is a decision based on risk analysis." -> "... is a decision based on risk analysis, and therefore justified."
- "a midsize plant (roughly 100 to 500 employees)" -> "(here: roughly 100 to 500 employees)", to mark it as our working definition.
- Metadata: meta description "(150 characters)" -> "(148 characters)"; target word count placeholder -> actual `wc -w`; competitive analysis "roughly 13,900 words, about 70 percent longer" -> actual count and ratio.
- Editorial notes: cannibalization plan for the English blog post, hreflang pair with the German pillar and the instruction to update the German note 2; FTC note with the 2023 definition.

### Round 2: verdicts with spot fact check of the changes

- **Subject-matter expert (satisfied):** TWI now presented as a sourced historical root with a practical recommendation, not a usage claim; terminology idiomatic; tool sequence and examples correct.
- **SEO specialist US (satisfied):** H2s now match PAA phrasing for principles, tools, implementation, disadvantages and examples; benefits covered; 16 FAQs; meta title 52 and description 148 characters (recounted); anchors consistent; cannibalization handled with a measurable trigger.
- **US reader (satisfied):** Benefits list is credible because each point has a source and a caveat; the 30-day list now includes the MEP check.
- **Fact checker (satisfied):** Benefits H3 checked against [4], [6], [34], [56], [3], [23]: wording matches (IMVP 16.8 vs. 24.9 hours, Porsche 7 -> 1 day and 120 -> 60 hours, 0.09 -> 4.3 suggestions, NUMMI quality parity). All 67 sources are cited in the text and every citation number exists. Remaining [unverified] items (5) are practitioner estimates and listed in the editorial notes.
- **Critic (satisfied):** remaining "not X" phrasings are single, natural uses; no em-dash chains, no "delve"/"game-changer"; iFAKT section unchanged in tone, disclosure exact, no sponsorship label.

### Optimization 2: what changed (old -> new)

Round 2 spot checks during the transfer into the Claude Doc found three remaining points; all five roles agreed on the fixes:

- Fact checker: the just-in-time definition stood in quotation marks, but the wording could not be confirmed as Toyota's verbatim text. Old: `as "making only what is needed, when it is needed, and in the amount needed" [1]` -> new: same words without quotation marks (paraphrase).
- Fact checker and critic: "Kaizen teams focused on quality, productivity and process are generally a different matter" was an unsourced legal assessment. Old: that sentence plus "but have employment counsel review the charter of standing committees before launch" -> new: "Whether a standing improvement team falls under this depends on its charter and what it discusses, so have employment counsel review the charter before launch."
- Critic (iFAKT neutrality): "A broader vendor-neutral view of the category is planned in the iFAKT Polaris profile" was contradictory. -> "A closer look at the product is planned in the iFAKT Polaris profile (planned); scheduling software in general is the topic of the planned production scheduling and APS guide (planned)."

### Round 3: final verdicts

- **Subject-matter expert:** satisfied.
- **SEO specialist US:** satisfied; word count rechecked after optimization 2.
- **US reader:** satisfied.
- **Fact checker:** satisfied; no quotation in the text now goes beyond its source.
- **Critic:** satisfied; iFAKT section neutral, disclosure exact.

**Final verdict:** release from the perspective of all five roles. Before publication: replace Wikipedia citations with book editions where possible (note 2), have counsel read the NLRA bullet (note 3), recheck Microsoft product names (note 5), retitle and link the English blog post and update the German pillar's hreflang note (cannibalization notes 1, 3 and 5), and clarify the "Sponsored" label on the m365.fm iFAKT entity page (note 12).

**Word count:** `wc -w` on H1 through the end of "Conclusion and first steps" (incl. tables, glossary and FAQ, excluding Further reading, author box, sources and notes): 14,791 words.
