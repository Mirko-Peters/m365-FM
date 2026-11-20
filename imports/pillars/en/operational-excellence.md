# SEO metadata

| Field | Value |
|---|---|
| Meta title | Operational Excellence: Definition, Frameworks & Methods (56 characters) |
| Meta description | Operational excellence explained: definition, Shingo model, Hoshin Kanri, OEE, KPIs and a 12-month roadmap for US plants and small manufacturers. Sourced. (154 characters) |
| Slug | `/en/learn/operational-excellence/` (full URL: https://www.m365.fm/en/learn/operational-excellence/) |
| Main keyword | operational excellence |
| Secondary keywords | what is operational excellence, operational excellence definition, OpEx, operational excellence in manufacturing, operational excellence framework, operational excellence principles, Shingo model, pillars of operational excellence, operational excellence vs lean, operational excellence vs continuous improvement, Hoshin Kanri, A3 problem solving, Toyota Kata, TPM, how to calculate OEE, operational excellence KPIs, operational excellence manager, operational excellence roadmap, leader standard work, Baldrige Excellence Framework, operational excellence for small manufacturers, operational excellence Microsoft 365 / Power BI |
| Search intent | Informational with a commercial secondary layer (ops leaders, plant managers and practitioners looking for a definition, how it compares with lean and Six Sigma, frameworks, methods and a way to implement it) |
| Target word count | At least 11,000 words in the article (longest English competitor on google.com: Smartsheet, approx. 6,000 to 7,000 words). Actual: 13,130 words from H1 to the end of the Conclusion, counted with `wc -w` including tables |
| Language version | `en-US`; hreflang pair: `en-US` https://www.m365.fm/en/learn/operational-excellence/ <-> `de-DE` https://www.m365.fm/learn/operational-excellence/ |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: the strongest English-language results on google.com (US intent) for "operational excellence", "what is operational excellence in manufacturing" and "operational excellence framework principles examples". Word counts are estimates of the main text without navigation, fetched on November 20, 2026.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| smartsheet.com/content/operational-excellence | 6,000 to 7,000 | very broad: principles (incl. all ten Shingo principles), failure reasons, models, 8-phase implementation plan, roles, KPIs, industry sections | Hoshin Kanri only named, no X-matrix; no OEE formula, no TPM; no FAQ; no reference list; no timeline in the plan |
| kainexus.com/operational-excellence | approx. 5,500 | Hoshin Kanri with catchball, leader standard work, 4-phase roadmap, maturity model, 15-question FAQ | Shingo principles not listed (only linked); no OEE, no TPM; no reference list; vendor call to action |
| pipefy.com/blog/operational-excellence/ | approx. 3,000 | Shingo table, comparisons with continuous improvement, process excellence, efficiency | no Hoshin Kanri, OEE or TPM; no FAQ; no roadmap; workflow-software slant |
| scw.ai/blog/operational-excellence-in-manufacturing/ | 2,700 to 3,000 | manufacturing focus, OEE formula, digital/AI section, WEF Lighthouse link, case studies | no worked OEE example; no Shingo, no Hoshin Kanri; TPM only named; no FAQ; vendor page |
| netsuite.com (business-strategy/operational-excellence) | 2,000 to 2,300 | clear basics, stages model, 3 FAQs | no Shingo, Hoshin Kanri, OEE or TPM; unsourced statistic; ERP vendor slant |
| processexcellencenetwork.com (What is operational excellence?) | 2,000 to 2,300 | methods and technologies (RPA, process mining), case studies | no Shingo, Hoshin Kanri, OEE or TPM; no FAQ, no roadmap |
| en.wikipedia.org/wiki/Operational_excellence | approx. 500 | neutral definition; Juran model, Shingo model, FLEX | very short; no methods, metrics or implementation |
| docs.aws.amazon.com (Well-Architected, Operational Excellence pillar) | n/a (cloud documentation) | ranks for the head term; shows a second, IT meaning of the term | different topic (cloud workloads); confirms a disambiguation need |

**People also ask / question headings seen in the SERP:** What is operational excellence? What are the principles of operational excellence? What are the pillars of operational excellence? Why do operational excellence efforts fail? How do you achieve operational excellence? What does an operational excellence manager do? What are operational excellence KPIs? What is operational excellence in manufacturing / healthcare / IT? Operational excellence vs. continuous improvement? How do lean and Six Sigma contribute to operational excellence?

**How this article beats the competition:** No analyzed English page combines all ten Shingo guiding principles, Hoshin Kanri with X-matrix and catchball, the OEE formula with a worked example, TPM with its eight pillars, a 12-month roadmap with milestones and a business-case template backed by studies (NBER, American Economic Review, WEF, McKinsey with counter-evidence). This article adds a section for small and mid-sized manufacturers (the US equivalent of the German Mittelstand, with NIST MEP as a resource), OSHA/BLS-based safety metrics, the US Baldrige framework next to EFQM and VDI 2870, labor-relations guidance for union and nonunion plants (plus German works councils for US companies with German sites), Microsoft 365 and Azure patterns, a disambiguation of the cloud meaning, Toyota Kata, a glossary and an 18-question FAQ. Every study figure has a numbered source; rules of thumb are labeled as such.

---

# Operational Excellence: The Complete Guide to Definition, Frameworks, Methods and Implementation

*Updated: November 2026 · Reading time: about 50 minutes (quick start: see "Key takeaways")*

> **Short answer:** Operational excellence (OpEx) is an organization's lasting ability to improve how it creates value, systematically and continuously, in terms of both efficiency and effectiveness [1]. It combines a clear strategy, a culture of leadership and learning, stable standard processes and reliable data so that quality, cost and delivery get measurably and sustainably better.

> **Key takeaways**
> - Operational excellence is a long-term management system that aligns lean, Six Sigma, TPM and continuous improvement with a few strategic goals.
> - The best-known reference model is the Shingo Model from Utah State University, with ten guiding principles. The US Baldrige Excellence Framework, the European EFQM Model 2025 and the German VDI 2870 guideline add broader or more production-specific frames.
> - In a plant, the core consists of four routines: Hoshin Kanri (goals), shop floor management (daily control), A3 and PDCA (problem solving) and standardized work (holding the gains).
> - Research on about 35,000 US manufacturing plants finds that management practices explain over 20% of productivity differences, about as much as R&D or IT [35].
> - You don't need an OpEx department to start: one bottleneck line, a daily 15-minute meeting, one problem-solving method and a plant manager who shows up on the floor regularly.

Many companies run lean projects, train Six Sigma belts and hang KPI boards. Yet improvements often slide back to the old level after a year or two. Operational excellence addresses exactly this problem: it is the management system that ties tools, behavior and results together for the long term. This guide explains the term, compares it with related approaches, presents the main models and describes the methods plants and offices use to put OpEx into practice. It also covers small and mid-sized manufacturers, Microsoft 365, labor relations, a 12-month roadmap, a KPI system, a business-case template, an FAQ and a glossary.

If you want a shorter, manufacturing-focused introduction first, read [What is operational excellence in manufacturing?](https://www.m365.fm/community/u/mirko-p/blog/what-is-operational-excellence-in-manufacturing/). A short definition is also on the entity page [Operational Excellence](https://www.m365.fm/entity/operational-excellence/).

## Table of contents

1. [What is operational excellence? Definition and core idea](#what-is-operational-excellence-definition-and-core-idea)
2. [Origins and history](#origins-and-history)
3. [Operational excellence vs. lean, Six Sigma, TQM and continuous improvement](#operational-excellence-vs-lean-six-sigma-tqm-and-continuous-improvement)
4. [The four pillars of operational excellence](#the-four-pillars-of-operational-excellence)
5. [Operational excellence frameworks and maturity models](#operational-excellence-frameworks-and-maturity-models)
6. [Operational excellence methods in detail](#operational-excellence-methods-in-detail)
7. [Operational excellence in manufacturing and in small and mid-sized plants](#operational-excellence-in-manufacturing-and-in-small-and-mid-sized-plants)
8. [Operational excellence KPIs: how to measure it](#operational-excellence-kpis-how-to-measure-it)
9. [Business case and ROI](#business-case-and-roi)
10. [How to achieve operational excellence: a 12-month roadmap](#how-to-achieve-operational-excellence-a-12-month-roadmap)
11. [Roles, organization and labor relations](#roles-organization-and-labor-relations)
12. [Digital tools, Microsoft 365, digital twins and AI](#digital-tools-microsoft-365-digital-twins-and-ai)
13. [Why operational excellence programs fail: common mistakes and fixes](#why-operational-excellence-programs-fail-common-mistakes-and-fixes)
14. [Operational excellence examples: what documented cases show](#operational-excellence-examples-what-documented-cases-show)
15. [Software support: the example of iFAKT Polaris](#software-support-the-example-of-ifakt-polaris)
16. [FAQ](#faq-operational-excellence)
17. [Glossary](#glossary-key-opex-terms)
18. [Conclusion and first steps](#conclusion-and-first-steps)

## What is operational excellence? Definition and core idea

### The definition

The Fraunhofer Institute for Production Systems and Design Technology (IPK) in Berlin, one of Germany's large applied-research institutes, defines operational excellence as "a company's ability to continuously improve its value chain in terms of efficiency and effectiveness" (translated from German) [1]. Three parts of this definition matter:

- **Ability:** OpEx is not a project with an end date. It is an organizational capability. A plant that runs one kaizen event does not have operational excellence. A plant that spots and solves problems in a structured way every day is much closer.
- **Value chain:** The view goes beyond single machines or departments. The goal is to improve the flow from order entry to shipment, including indirect areas such as planning, purchasing and maintenance.
- **Efficiency and effectiveness:** Efficiency means doing things right (less waste, lower cost). Effectiveness means doing the right things (customer value, strategic goals). Operational excellence requires both.

### Operational excellence as a strategic value discipline

The term has a second, older meaning. In a 1993 Harvard Business Review article, Michael Treacy and Fred Wiersema described three "value disciplines" through which companies can become market leaders: operational excellence, customer intimacy and product leadership [2]. They expanded the model in their 1995 book *The Discipline of Market Leaders* [3]. In that model, operational excellence stands for a value proposition of lowest total cost and highest convenience for the customer, delivered through standardized, lean processes [3].

In practice, operational excellence is therefore two things. It is a **strategic choice** (competing on cost, reliability and simplicity), and it is a **management discipline** that every company needs, even if it competes mainly on product innovation or customer intimacy. This guide is mostly about the second meaning.

### Not to be confused with: the "operational excellence" pillar in AWS and Azure

If you work in IT, you have probably met the term in a third sense. Cloud architecture frameworks use "operational excellence" as the name of one design pillar. In the AWS Well-Architected Framework, it covers four best-practice areas: Organization, Prepare, Operate and Evolve [43]. In the Azure Well-Architected Framework, operational excellence is one of five pillars, next to reliability, security, cost optimization and performance efficiency, and is summarized as "streamline operations with standards, comprehensive monitoring, and safe deployment practices" [44]. The ideas are related (standards, feedback loops, continuous improvement), but the cloud pillar is about running software workloads. This guide is about the management system for plants and business operations. For the Azure side of manufacturing IT, see the sister guide [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned).

### How to recognize operational excellence on a normal day

Operational excellence is visible on the shop floor long before it shows up on the income statement. Typical signs:

- Every employee knows the two or three most important goals of their area and their own contribution.
- Deviations from the standard become visible and are escalated within one shift, not in the monthly report.
- Leaders spend a fixed share of their time where the work is done and ask questions there instead of giving orders.
- Problems are solved to the root cause with one common method (such as A3 and PDCA), and the result becomes the new standard.
- There are few metrics. They are clearly defined, current and displayed so everyone understands them.
- Improvements hold, even after the person who started them leaves the company.

## Origins and history

Operational excellence was not invented on a particular day. The term bundles developments from several decades:

| Period | Development | Why it matters for OpEx |
|---|---|---|
| 1920s to 1950s | Walter A. Shewhart develops a repeating improvement cycle; W. Edwards Deming expands it in the 1950s for Japanese audiences; in 1951 the Japanese Union of Scientists and Engineers (JUSE) turns it into the familiar PDCA cycle [11] | scientific, iterative problem solving as the core |
| 1950s to 1970s | Toyota Production System (TPS); Taiichi Ohno classifies the seven wastes [16] | flow, pull, waste elimination, respect for people |
| 1950 to 1971 | Seiichi Nakajima develops Total Productive Maintenance in Japan; in 1971 Nippondenso is the first company to receive the PM Prize [14] | equipment stability and operator involvement |
| 1982 | The term Overall Equipment Effectiveness (OEE) first appears in Nakajima's book *TPM Tenkai* [13] | first end-to-end metric for equipment effectiveness |
| 1986 | Motorola introduces Six Sigma (Bill Smith) [20] | data-driven reduction of variation |
| 1988 | John Krafcik coins the term "lean production" in MIT Sloan Management Review [19]; Utah State University creates the Shingo Prize in honor of Shigeo Shingo [5] | Japanese principles reach the West; an award for operational excellence |
| 1990 / 1996 | *The Machine That Changed the World* and *Lean Thinking* popularize lean [19] | lean becomes a management philosophy |
| 1993 / 1995 | Treacy and Wiersema describe operational excellence as a value discipline [2][3] | the term enters the strategy vocabulary |
| 1995 | Jack Welch makes Six Sigma central to GE's strategy [20] | Six Sigma becomes a corporate program |
| 2004 | Jeffrey Liker publishes *The Toyota Way* with 14 management principles [28] | focus shifts from tools to principles |
| 2008 | The Shingo Model and its assessment guidelines are first published [4] | first widely used principle-based OpEx model |
| 2012 | German guideline VDI 2870 Part 1 on holistic production systems is published [21] | German reference for production systems |
| since 2018 | World Economic Forum's Global Lighthouse Network [25] | links OpEx with digital technology and AI |

One observation from Krafcik's 1988 article stands out: the best predictor of productivity in the auto plants he studied was not the level of automation. It was a "management index" made up of teamwork, visual control, absenteeism and repair areas [19]. The insight that management practices matter more than technology alone runs through the entire history of OpEx, and it was later confirmed at scale in US plant data (see "Business case and ROI").

## Operational excellence vs. lean, Six Sigma, TQM and continuous improvement

The most common question in practice: is operational excellence just a new name for lean? The short answer is no. Lean, Six Sigma, TQM and continuous improvement (kaizen) are families of methods or philosophies. Operational excellence is the overall target state and the management system that integrates these approaches and aligns them with strategy. For a detailed comparison, see [Operational excellence vs. lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/).

| Criterion | Operational excellence | Lean | Six Sigma | TQM | Continuous improvement / kaizen |
|---|---|---|---|---|---|
| Core question | How do we improve permanently and in line with strategy? | How do we eliminate waste and create flow? | How do we reduce variation and defects? | How do we build quality into every function? | How do we get a little better every day? |
| Origin | Shingo Model, Treacy/Wiersema, practice | Toyota Production System, MIT studies | Motorola 1986, GE 1995 [20] | Japanese and US quality movement | Japanese kaizen practice |
| Focus | culture, principles, systems, results | value stream, flow, pull | variation, statistics | customer-oriented quality | incremental improvement |
| Typical tools | Hoshin Kanri, shop floor management, maturity assessments, plus all the methods to the right | value stream mapping, 5S, kanban, standardized work | DMAIC, statistical process control, design of experiments | quality circles, QFD, audits | PDCA, suggestion systems, kaizen events |
| Time horizon | permanent, systemic | permanent | project-based (months) | permanent | permanent, daily |
| Result | sustainable performance | short lead times | stable, capable processes | high quality | culture of improvement |

How the pieces fit:

- **Lean** answers the "what" of flow: make the value stream visible, remove waste, produce to customer demand. An overview is on the entity page [Lean Management](https://www.m365.fm/entity/lean-management/) and in the sister guide [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned).
- **Six Sigma** adds statistical depth for stubborn quality problems through DMAIC (Define, Measure, Analyze, Improve, Control) [20]. The combination is widely known as [Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/).
- **Continuous improvement** is a mindset and a daily process. It is necessary, but without strategic direction it is not enough: improvement work aimed at the wrong places produces local gains with no effect on the overall result.

The Shingo Institute states that its model does not replace lean, Six Sigma or other improvement methods [4]. Operational excellence is the frame in which these methods work together and point toward shared goals.

**Operational excellence vs. operational efficiency.** Efficiency is one outcome (output per input). Operational excellence also asks whether you are improving the right things for the customer and whether the gains last. A plant can raise efficiency for a quarter by cutting maintenance; an OpEx system would flag that as a future availability loss.

## The four pillars of operational excellence

Literature and consulting practice offer many pillar models, with three, four or five pillars. The four pillars below are a synthesis based on the dimensions of the Shingo Model [4] and the logic of holistic production systems in VDI 2870 [21]. They are most useful for diagnosis: where is your organization weak?

### Pillar 1: Strategy and leadership

Without a clear direction, every department optimizes by its own criteria. Leadership in an OpEx organization means:

- **Alignment:** A few measurable breakthrough goals are cascaded through all levels (Hoshin Kanri, see below).
- **Presence at the gemba:** Leaders go to the place where value is created to understand the actual situation through direct observation and questions before they act [17]. Practical tips are on the entity page [Gemba Walk](https://www.m365.fm/entity/gemba-walk/).
- **Coaching instead of commanding:** Leaders develop their teams' problem-solving ability instead of handing out solutions. The A3 process is explicitly designed as a coaching process between leader and employee [9].
- **Humility:** The Shingo Model lists "Lead with Humility" as a guiding principle [4]. People who surface problems are not punished.

### Pillar 2: Culture and people

The Shingo Model puts culture at the foundation: principles should be anchored in the culture, and culture changes when behavior changes [4]. In concrete terms:

- Respect for every individual, shown in behavior rather than slogans (listening, involving, enabling).
- Psychological safety, so deviations are reported openly.
- Systematic training, so employees master standards and can improve them.
- Recognition of improvement contributions, not only of results.

How to build this culture on the shop floor is covered in [Operational excellence culture on the shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/).

### Pillar 3: Processes and standards

Stable processes are the precondition for any improvement. Without a standard you can neither recognize a deviation nor lock in a gain. This pillar includes:

- Value stream orientation: design processes from the customer backward and create flow.
- Standardized work with takt time, work sequence and standard work-in-process [15].
- Quality at the source: prevent or detect defects where they occur.
- Equipment stability through TPM.
- Visual management, so target and actual are clear at a glance.

### Pillar 4: Data and systems

The fourth pillar has gained weight with digitalization. What counts is the right data at the right time, not the largest amount of it:

- A lean, consistent KPI system from company level down to team level.
- Clean master data and a shared data model for products, resources and processes.
- Timely data capture (ideally automated) instead of manual consolidation in Excel.
- Systems that support decisions: simulation, scheduling, analysis.

The Shingo Model stresses that systems must be designed to drive the desired behavior and that success should be measured in both performance and behavior terms [4]. A dashboard nobody uses in the daily meeting is not a system. It is decoration.

### Pillar check: where does your organization stand?

Answer the following questions honestly with yes or no:

- [ ] Can every team leader name the plant's three most important annual goals?
- [ ] Do the plant manager and department heads go to the gemba in a structured way at least once a week?
- [ ] Are there documented standards that people actually follow at the most important workstations?
- [ ] Are deviations discussed and escalated daily in a short meeting?
- [ ] Is there one problem-solving method that all leaders have mastered?
- [ ] Is the OEE of the bottleneck equipment known and broken down by loss type?
- [ ] Are metrics consolidated automatically rather than by hand?
- [ ] Do implemented improvements demonstrably hold after twelve months?

Fewer than four "yes" answers suggest that your organization uses methods but does not yet run an OpEx system.

## Operational excellence frameworks and maturity models

A framework answers two questions: what does an OpEx program align to, and how is progress assessed? For US companies, the Shingo Model and the Baldrige Excellence Framework are the main references. Companies with European operations also meet the EFQM Model, and German plants often refer to the VDI 2870 guideline. A practical overview of building blocks and maturity levels is in [Operational excellence framework: building blocks and maturity](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-framework-building-blocks-maturity/).

### The Shingo Model

The Shingo Model comes from the Shingo Institute, part of the Jon M. Huntsman School of Business at Utah State University. The model and its assessment guidelines were first published in January 2008 [4]. The associated Shingo Prize dates back to 1988 and honors Japanese industrial engineer Shigeo Shingo, who contributed significantly to the principles and tools of the Toyota Production System [5].

**The logic of the model.** The Shingo Model distinguishes five elements: culture, guiding principles, systems, tools and results [4]. The central chain of effect: principles inform the ideal behaviors that leaders expect from everyone, and these behaviors drive results [4]. Tools explain the "how" of improvement. Without an understanding of the "why", tools make teams dependent on instructions [4]. This is a common reason lean programs fail: they introduce tools without changing principles and behavior.

**The ten guiding principles in three dimensions** [4]:

| Dimension | Guiding principle | What it means in practice |
|---|---|---|
| Cultural Enablers | Respect Every Individual | Every person is taken seriously and developed as a problem solver. |
| | Lead with Humility | Leaders listen, ask and learn instead of knowing everything. |
| Continuous Improvement | Seek Perfection | The ideal is the benchmark, not the industry average. |
| | Embrace Scientific Thinking | Hypotheses are tested through experiments (PDCA). |
| | Focus on Process | When something goes wrong, look at the process first, not the person. |
| | Assure Quality at the Source | Defects are prevented or detected where they occur. |
| | Improve Flow & Pull | Value flows without interruption at the pace of customer demand. |
| Enterprise Alignment | Think Systemically | Relationships and interactions are understood; silos are broken down. |
| | Create Constancy of Purpose | A stable direction provides orientation over years. |
| | Create Value for the Customer | Value is defined from the customer's point of view. |

**Results in the Shingo Model.** Results are usually tracked as KPIs. The institute points out that even lagging KPIs allow conclusions about behavior and culture, and that value must always be judged from the customer's perspective [4]. Assessments therefore check not only whether results are good, but whether they come from ideal behavior and can be repeated.

**When does the Shingo Model fit?** It fits particularly well when a company already uses lean methods but the impact does not last. It shifts the question from "Which tools do we use?" to "What behavior do our systems produce?"

### The Baldrige Excellence Framework (US)

The Baldrige Excellence Framework is the US reference for organization-wide performance excellence. It is maintained by the Baldrige Performance Excellence Program at the National Institute of Standards and Technology (NIST), which also runs the Malcolm Baldrige National Quality Award [38]. In late 2024, NIST announced that the next edition would be "reorganized, simplified, and refocused as a maturity model improvement guide" [38]. According to the Baldrige Foundation, the 2026 framework now uses six categories that share one structure with the award criteria. Results are no longer a separate category but are evaluated within each category, a category called "Organizational Intelligence" covers data, knowledge and decision-making, and three maturity pathways (Establishing, Developing, Maturing) let organizations start at their current level. AI is now addressed explicitly [37].

Compared with the Shingo Model, Baldrige is broader (governance, workforce, customers, finance, community) and less specific to production. It suits companies that want to embed operational excellence in an enterprise-wide performance program, and organization-wide assessments are offered through the state and regional programs of the Alliance for Performance Excellence [38].

### The EFQM Model (Europe)

The EFQM Model is the European framework for organizational excellence. US companies with European subsidiaries or customers often meet it. The current EFQM Model 2025 has three areas with seven criteria [22]:

| Area | Criterion |
|---|---|
| Direction | 1. Purpose, vision and strategy |
| | 2. Organizational culture and leadership |
| Execution | 3. Engaging stakeholders |
| | 4. Creating sustainable value |
| | 5. Driving performance and transformation |
| Results | 6. Stakeholder perceptions |
| | 7. Strategic and operational performance |

(Criterion names translated from the German edition cited [22].) Assessment follows the RADAR logic; the 2025 edition has only two RADAR matrices (one for Direction and Execution, one for Results). In external assessments, maturity is rated on a 1,000-point scale [22]. Like Baldrige, EFQM is broader than the Shingo Model (stakeholders, sustainability, transformation) and less specific to the shop floor.

### VDI 2870: holistic production systems (Germany)

VDI is the Association of German Engineers, which publishes engineering guidelines similar in role to ANSI-accredited standards in the US. VDI 2870 Part 1, "Lean production systems: basic principles, introduction and review" (German title: "Ganzheitliche Produktionssysteme"), dates from July 2012 and addresses manufacturers of all industries and sizes, explicitly including small and mid-sized companies [21]. It describes design principles, methods and an assessment approach for production systems modeled on the Toyota Production System. According to VDI, the guideline is still partly valid but partly in need of revision; a revision project is to add occupational safety and check consistency with VDI 2871 and VDI 2872, with a possible publication date of June 2027 [21]. The design principles commonly associated with the guideline in practice include standardization, zero defects, flow, pull, continuous improvement, employee orientation and goal-oriented leadership, waste avoidance and visual management [unverified].

For US companies with plants in Germany, VDI 2870 matters because German sites often describe their production system in its terms, giving headquarters, plant and suppliers a shared vocabulary.

### Framework comparison

| Feature | Shingo Model | Baldrige Excellence Framework | EFQM Model 2025 | VDI 2870 |
|---|---|---|---|---|
| Publisher | Shingo Institute, Utah State University | NIST Baldrige Performance Excellence Program | EFQM (Brussels) | VDI, Association of German Engineers |
| Focus | principles, behavior, culture | organization-wide performance excellence | organizational excellence, stakeholders | design of production systems |
| Assessment | Shingo assessment, Shingo Prize | Baldrige Award, state programs, maturity pathways | RADAR, up to 1,000 points | assessment approach in the guideline |
| Strength | explains why improvements last | broad enterprise view, strong US ecosystem | broad enterprise view | concrete methods for manufacturing |
| Limitation | little detail on individual methods | little tool depth for the shop floor | little tool depth for the shop floor | production-focused, German-language context |

### A practical maturity model

For internal self-assessment, a five-level scale works well. The following model is an editorial synthesis of the frameworks above, not a standard:

| Level | Name | Typical characteristics |
|---|---|---|
| 1 | Reactive | firefighting, knowledge in people's heads, metrics monthly and manual |
| 2 | Methodical | first lean tools (5S, standardized work) in pilot areas, projects instead of a system |
| 3 | Systematic | shop floor management in all areas, one problem-solving method, KPI cascade |
| 4 | Aligned | Hoshin Kanri links strategy and daily work, leaders coach, improvements hold |
| 5 | Excellent | improvement is part of the identity, principles shape behavior, results stay at top level |

Experience shows that the jump from level 2 to level 3 is the hardest, because it requires moving from projects to a daily management system.

## Operational excellence methods in detail

The following methods make up the operational excellence toolbox. What matters is how they connect: Hoshin Kanri sets the direction, shop floor management makes deviations visible every day, A3 solves problems at the root cause, standardized work holds the gains, TPM stabilizes equipment and continuous improvement keeps the cycle going.

### Hoshin Kanri: taking strategy to the workstation

**Definition.** According to the Lean Enterprise Institute (LEI), Hoshin Kanri (also called policy deployment or strategy deployment) is a strategic framework for building sustainable high performance and achieving results [7]. It aligns activities vertically (from top management to the line) and horizontally (across departments) with the strategic goals, so every person sees how their role contributes [7]. The typical output is an annual plan with goals, actions, timelines, owners and measures [6]. A standard reference is *Hoshin Kanri: Policy Deployment for Successful TQM*, edited by Yoji Akao and originally published by the Japanese Standards Association [8]. A short description is on the entity page [Hoshin Kanri](https://www.m365.fm/entity/hoshin-kanri/).

**Catchball.** The heart of the method is the dialogue between management and teams about the time and resources available and needed. LEI calls this dialogue catchball (or nemawashi), because ideas are tossed back and forth like a ball [6]. Many practitioners use nemawashi more narrowly, for informal consensus-building with stakeholders before a decision. Catchball is meant to ensure that only projects that are desirable, important and achievable get approved [6]. During a lean transformation, the process often starts top-down and becomes two-way once the big goals are set [6].

**The X-matrix.** A common aid is the X-matrix, a one-page document that links four levels through correlation fields:

1. **Long-term breakthrough objectives** (three to five years), for example "cut lead time in half".
2. **Annual objectives** that support the breakthrough objectives.
3. **Top-priority initiatives and improvement projects** that deliver the annual objectives.
4. **Metrics** that track progress.

The matrix is completed with responsibilities (who leads, who supports). The X-matrix is one format among several; LEI, for example, also illustrates strategy deployment with an A3 [6]. The form matters less than the discipline of pursuing a few goals consistently.

**Six steps:**

1. Set the vision and three to five breakthrough objectives.
2. Derive and quantify annual objectives.
3. Catchball across all levels: align goals, resources and actions.
4. Execute through projects and daily work.
5. Monthly reviews with red/yellow/green status and countermeasures (PDCA at strategy level).
6. Annual reflection (hansei) and start of the next cycle.

**Common mistakes:** too many goals (more than five breakthrough objectives dilute focus), catchball as a mere formality, no monthly reviews and goals that never reach the shop floor boards.

### A3 problem solving and PDCA

**Origin and principle.** The A3 report is a practice developed at Toyota: problem, analysis, countermeasures and action plan are captured on a single large sheet of paper in A3 format (297 x 420 mm, about 11.7 x 16.5 in., close to US ledger/tabloid size of 11 x 17 in.), often with charts [9]. John Shook, who joined Toyota in 1983, describes the principle that every problem in an organization should be described, analyzed and solved on one sheet; the process is structured around PDCA [10]. Shook described the approach in the book *Managing to Learn* [10]. More on the entity page [A3 Problem Solving](https://www.m365.fm/entity/a3-problem-solving/).

**PDCA.** The Plan-Do-Check-Act cycle is a repeating improvement loop: a change is planned, carried out, its effect measured, and then it is either standardized or the cycle starts again [11]. It goes back to Walter A. Shewhart, was expanded by W. Edwards Deming in the 1950s and was put into today's PDCA form by the Japanese Union of Scientists and Engineers in 1951 [11].

**Structure of an A3** (typical fields):

| Phase | Field | Guiding question |
|---|---|---|
| Plan | Background | Why does this topic matter, and how does it connect to our goals? |
| Plan | Current condition | What is actually happening? (data and observation at the gemba) |
| Plan | Target | What should be achieved, measurably, by when? |
| Plan | Root cause analysis | Why does the problem occur? (5 Whys, Ishikawa/fishbone) |
| Do | Countermeasures | Which actions address the root cause? |
| Do | Implementation plan | Who does what by when? |
| Check | Effect confirmation | Was the target reached? |
| Act | Standardization and follow-up | What becomes the new standard, and what is still open? |

LEI stresses that an A3 is not just a form but a management process in which a leader coaches an employee through a problem in dialogue [9]. That is why every A3 has a named owner whose initials are on the sheet [9].

**Practical tip:** Start with problems that can be solved in four to eight weeks. An A3 that stays open for months signals a problem scoped too broadly.

### Toyota Kata: training problem solving as a daily routine

A3 solves a specific problem. Toyota Kata trains the habit behind it. According to LEI, Mike Rother introduced the two routines to the lean community with his 2010 book *Toyota Kata* [32]:

- **Improvement Kata:** a repeating, PDCA-based four-step routine: understand the challenge derived from the vision; grasp the current condition with facts and data; define a target condition for roughly the next two weeks; and work through the obstacles on the way there with small experiments [32].
- **Coaching Kata:** five questions a leader asks as a coach at the gemba. The coach gives hints about the process but no solutions [32].

Kata is especially useful when shop floor meetings take place but only manage problems instead of solving them. A daily coaching cycle of 15 to 20 minutes per team leader (rule of thumb) turns problem solving into a habit and gives leaders a concrete coaching standard.

### Total productive maintenance (TPM) and OEE

**Origin.** Total productive maintenance was developed in Japan between 1950 and 1970, largely by Seiichi Nakajima; in 1971 Toyota supplier Nippondenso became the first company to receive the PM Prize [14]. The Japan Institute of Plant Maintenance (JIPM) later extended the approach to eight company-wide activities [14]. More on the entity page [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/).

**The eight pillars of TPM** [14]:

| Pillar | Japanese term | Content |
|---|---|---|
| 1. Focused improvement | Kobetsu Kaizen | targeted elimination of the biggest losses |
| 2. Autonomous maintenance | Jishu Hozen | operators take over cleaning, inspection, lubrication |
| 3. Planned maintenance | | preventive and condition-based maintenance |
| 4. Quality maintenance | Hinshitsu Hozen | maintain equipment conditions that allow zero defects |
| 5. Early equipment management (development management) | | lessons learned feed into the design of new equipment and products |
| 6. Training and education | | skills for operators and maintenance staff |
| 7. Office TPM | | loss elimination in indirect functions |
| 8. Safety, health and environment | | zero accidents, zero environmental incidents |

**OEE: the lead metric of TPM.** Overall Equipment Effectiveness measures how effectively equipment is used [12]. The term first appeared in 1982 in Nakajima's book *TPM Tenkai* [13]. For a deeper treatment of OEE and related metrics, see the sister guide [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned).

**Formula:**

```
OEE = Availability × Performance × Quality

Availability = Run time / Planned production time
Performance  = (Total count × Ideal cycle time) / Run time
Quality      = Good count / Total count
```

The definitions follow the common presentation [12][13]. Important: the performance rate uses the total count, not the good count; otherwise quality losses would be counted twice [13].

**Worked example.** A machine is scheduled for a 480-minute shift. It is down for 90 minutes (breakdowns, changeovers). The ideal cycle time is 1.5 minutes per part; 242 parts are produced, 221 of them good.

- Availability = (480 − 90) / 480 = 81.3%
- Performance = (242 × 1.5) / 390 = 93.1%
- Quality = 221 / 242 = 91.3%
- OEE = 0.813 × 0.931 × 0.913 ≈ 69.1%

The input data come from a widely used textbook example (a 30-minute break and 60 minutes of downtime, 242 parts, 21 of them defective) [13]. Whether breaks count as downtime or are excluded from planned production time is a definition question: many plants subtract planned breaks up front. Put this rule in writing, or OEE values will not be comparable between lines. The result is typical: three individually decent factors multiply to an OEE below 70%.

**The six big losses.** LEI lists the "six major losses" as breakdowns, setup and adjustment losses, small stops, reduced speed, scrap and rework [12]. The classic TPM breakdown groups setup and adjustment together and splits scrap into startup losses and production rejects. Mapped to the OEE factors:

| OEE factor | Loss type |
|---|---|
| Availability | equipment breakdowns; setup and adjustment |
| Performance | small stops and idling; reduced speed |
| Quality | production rejects and rework; startup losses |

**Is 85% OEE "world class"?** The 85% figure is often cited as a world-class target. It is usually derived from 90% availability, 95% performance and 99.9% quality (0.90 × 0.95 × 0.999 ≈ 85.4%) and attributed to Nakajima; a primary source for this has not been confirmed [unverified]. LEI's lexicon works through a similar example with 99% quality (0.90 × 0.95 × 0.99 ≈ 84.6%) without calling it world class [12]. Using the figure as a blanket benchmark is considered misleading in many cases [13], because industries, batch sizes and product mix produce very different values. Compare OEE mainly with itself over time and use the loss breakdown as your improvement list.

**Related metric: TEEP.** Total Effective Equipment Performance relates OEE to calendar time (TEEP = OEE × utilization) and shows how much capacity remains unused overall [13]. Normative definitions for OEE and other manufacturing metrics are in ISO 22400-2:2014, "Key performance indicators (KPIs) for manufacturing operations management" [31].

### Standardized work

**Definition.** Standardized work means establishing precise procedures for each operator's work in a production process [15]. It consists of three elements [15]:

1. **Takt time:** the pace at which the process must produce to meet customer demand.
2. **Work sequence:** the exact order of tasks within the takt time.
3. **Standard inventory:** the defined amount of material in the process, including units in machines, needed to keep flow going.

Takt time equals available working time per period divided by customer demand per period. With 450 minutes of net working time and a daily demand of 300 parts, takt time is 1.5 minutes per part.

**Standardized work tools** [15]: the process capacity sheet (makes bottlenecks visible), the standardized work combination table (manual, walking and machine times per operator), the standardized work chart (walking paths and material locations in the layout) and job instructions for training.

**Why standardized work is central to OpEx:** A standard is the baseline for improvement. Without a standard, every deviation is a matter of opinion. Good standards are developed by the people who do the work, and they are improved regularly. A standard that never changes suggests that nobody is improving. See also the entity page [Standard Work](https://www.m365.fm/entity/standard-work/).

### Continuous improvement and kaizen

Continuous improvement and the Japanese term kaizen describe daily improvement in small steps by everyone. (German plants call this KVP, short for "kontinuierlicher Verbesserungsprozess".) In an OpEx context, practitioners distinguish three forms:

- **Daily kaizen:** small improvements at your own workstation, implemented right away.
- **Kaizen events (workshops):** focused, multi-day improvement of one process by a cross-functional team.
- **System kaizen:** improvements across a whole value stream, derived from Hoshin Kanri.

All forms aim to eliminate waste. LEI defines muda as any activity that consumes resources without creating value for the customer; it is complemented by mura (unevenness) and muri (overburden) [18]. Taiichi Ohno distinguished seven types of waste [16]:

| Waste | Example |
|---|---|
| Overproduction | producing to stock without a customer order; considered the worst waste because it feeds the others [16] |
| Waiting | operators waiting for material, approvals or machines |
| Transportation | parts moved back and forth between warehouse and line |
| Overprocessing | unnecessary steps, overly tight tolerances |
| Inventory | material beyond what a pull system needs |
| Motion | searching for tools, parts or documents |
| Defects and correction | inspection, rework, scrap |

An eighth waste, unused employee talent, is often added; this extension does not come from Ohno.

### Shop floor management

Shop floor management is the daily leadership system where value is created. It combines metrics, visual boards, short regular meetings and escalation. In the US, the same practice is often called tiered daily management or daily management. In German-speaking research, the Technical University of Darmstadt (PTW institute) has developed models for classic and digital shop floor management; Joachim Metternich and co-authors published the German-language book *Digitales Shopfloor Management* (Hanser) on the topic [29]. A short definition is on the entity page [Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/), and the sister guide [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) (planned) goes deeper.

**Building blocks of effective shop floor management:**

1. **Tiered meetings:** short meetings (typically 10 to 15 minutes) at team, supervisor, department and plant level, staggered so information reaches the top on the same day.
2. **Visual board:** safety, quality, delivery, cost and people (often called SQDCP) with target vs. actual from the previous day. Safety comes first on purpose: experience shows that a plant that openly discusses near misses also discusses quality problems more openly.
3. **Escalation rules:** whatever the team cannot solve within a defined time goes up one level.
4. **Action list:** open, with owners and due dates, reviewed weekly.
5. **Gemba walks and standard confirmation:** leaders regularly check whether standards are followed (often organized as layered process audits).
6. **Problem solving:** recurring deviations are turned into A3s.
7. **Leader standard work:** supervisors, department heads and plant managers also have a fixed daily and weekly routine with meetings, gemba time, standard confirmations and coaching. Without this standard, day-to-day business pushes the leadership system aside first.

**Common mistakes:** boards become reporting rituals without decisions, metrics are too late or too many, leaders show up irregularly and escalations get no response.

### Other methods in the OpEx toolbox

| Method | Purpose | When to use |
|---|---|---|
| Value stream mapping and design | make material and information flow visible, determine lead time and value-added share | at the start, to set priorities (see the sister guide [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/), planned) |
| 5S | order and cleanliness as the basis for standards | early, as a visible entry point in pilot areas |
| SMED (quick changeover) | shorten changeovers, enable smaller batches | high product mix and changeover losses |
| Kanban / pull | limit inventory and overproduction | stable processes with recurring demand |
| Poka-yoke | make errors technically impossible | recurring operator errors |
| Jidoka | stop the process on abnormality, quality at the source | automated equipment and lines |
| Six Sigma DMAIC | statistical solution of complex quality problems | high variation with unclear causes |
| Heijunka | level production by volume and mix | fluctuating demand and mura |

## Operational excellence in manufacturing and in small and mid-sized plants

Most models in this guide come from large corporations with their own OpEx department. That is not the typical US manufacturer. According to Census Bureau data compiled by the National Association of Manufacturers, the US had 239,265 manufacturing firms in 2022, and all but 4,177 of them had fewer than 500 employees [40]. A plant with 150 to 800 employees faces different conditions: fewer staff functions, more product variants, leaders with dual roles and a plant manager who often also handles sales, capital spending and HR. Operational excellence works there too, but in a different order and with less overhead. (In Germany, this segment is called the Mittelstand; the German version of this guide addresses the same audience.)

A practical US resource is the Hollings Manufacturing Extension Partnership (MEP), run by NIST. Its mission is "to strengthen and empower small and medium-sized U.S. manufacturers", with state-designated MEP centers across the US and in Puerto Rico and more than 450 service locations [39]. Many MEP centers offer lean and continuous-improvement support, which can replace part of the outside coaching mentioned below.

### What is different in production compared with offices

- **The bottleneck determines the result.** An hour lost at the bottleneck is an hour lost for the whole plant; an hour lost at a non-bottleneck usually is not. Start improvement work at the bottleneck, not where the complaints are loudest.
- **Shift work requires handovers.** Standards, boards and escalation must work across shift changes. A structured five-minute shift handover is the cheapest first standard in many plants.
- **Equipment and people are linked.** Without stable equipment, standardized work is theory. Autonomous maintenance (cleaning, inspection and lubrication by operators) is often the entry point that connects both.
- **High mix, small batches.** With high product variety, quick changeover (SMED) and leveled sequencing often deliver more than classic flow lines.
- **Indirect functions drive lead time too.** In engineer-to-order and make-to-order production, order clarification, production engineering, design and purchasing often cause a large share of total lead time. A value stream map that starts at receiving misses this part.

### OpEx without an OpEx department: the lean version

| Element | Large corporation | Small or mid-sized plant (rule of thumb) |
|---|---|---|
| OpEx organization | central team plus plant coaches | one person with at least 50% of their time as OpEx lead, reporting directly to the plant manager |
| Strategy deployment | Hoshin Kanri with X-matrix across several levels | a one-page annual plan with three goals, reviewed monthly in the leadership meeting |
| Shop floor management | four tiers, digital boards | two tiers (team and plant), whiteboard or a simple digital list |
| Method skills | belt system, in-house academy | one problem-solving method (A3 or Kata) for all leaders, with outside coaching on selected days (for example via an MEP center) |
| Maturity assessment | formal assessment, possibly Shingo or Baldrige | the pillar check from this guide twice a year, plus gemba observation |

What matters is not scope but rhythm. A plant that stands at the board for 15 minutes every day, reviews open actions every week and discusses its three annual goals every month already runs an OpEx system.

### Illustrative scenario: a supplier's first 90 days

The following example is fictional and for illustration only. A metal-working supplier with about 300 employees struggles with unreliable on-time delivery. The plant manager proceeds as follows:

1. **Weeks 1 to 2:** OEE baseline at the suspected bottleneck line, captured on tally sheets; result about 60%, biggest loss is changeovers.
2. **Weeks 3 to 4:** daily 15-minute meeting at this line (safety, quality, output, previous day's disruptions); the plant manager attends twice a week.
3. **Weeks 5 to 8:** one SMED workshop with operators and maintenance; the result is documented as a changeover standard and posted at the machine.
4. **Weeks 9 to 12:** first A3s on the two most frequent causes of downtime; supervisors are coached through the A3 by the plant manager or an outside coach.

The outcome is not a "finished OpEx system", but a working model area, a reliable loss analysis and three leaders who have applied a method themselves. That is the foundation for the roadmap below.

## Operational excellence KPIs: how to measure it

Metrics drive behavior, even when they are defined badly. A good OpEx metrics system has three properties: it is **cascaded** (plant goals break down into team metrics), **balanced** (result and behavior metrics) and **lean** (five to seven metrics per level). Basics are on the entity page [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/); the sister guide [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned) covers definitions in depth.

### Metrics by category

| Category | Metric | Formula / definition | Level |
|---|---|---|---|
| Safety | Total recordable incident rate (TRIR), the OSHA/BLS incidence rate | recordable injuries and illnesses × 200,000 / hours worked; 200,000 hours = 100 full-time workers × 40 hours × 50 weeks [36]. (German plants often use rates per 1 million hours or the "1000-Mann-Quote", accidents per 1,000 full-time workers; convert before comparing sites.) | plant, department |
| Safety | Reported near misses | number of reports per month (a rising number is a good sign at first) | team, department |
| Quality | First pass yield (FPY) | good units on first pass / units started | line, team |
| Quality | Customer complaint rate (ppm) | complained parts × 1,000,000 / parts delivered | plant |
| Delivery | On-time in-full (OTIF) | orders delivered on time and in full / all orders | plant |
| Delivery | Lead time | time from order start to completion | value stream |
| Productivity | OEE | availability × performance × quality [12] | machine, line |
| Productivity | Labor productivity | good units or value added / labor hours | department |
| Cost | Manufacturing cost per unit | manufacturing cost / good units | plant |
| Inventory | Days of inventory | inventory / average daily consumption | plant |
| Flow | Value-added ratio | value-added time / lead time | value stream |
| People | Implemented improvements per employee per year | number of implemented ideas / employees | team |
| Behavior | Gemba walk and standard-confirmation completion rate | completed / planned sessions | leadership |
| Behavior | A3 completion rate | completed A3s with confirmed effect / A3s started | department |

For manufacturing metrics close to MES, ISO 22400 provides standardized definitions [31], and ANSI/ISA-95 (IEC 62264) provides the shared model for how manufacturing operations management (MES, SCADA) exchanges data with business systems such as ERP [42]. Both make comparisons between plants easier. Only collect and compare metrics across plants when the definitions really are identical.

### Leading and lagging indicators

Lagging indicators (cost, complaints, financial results) show what happened. Leading indicators (standard adherence, changeover times, A3 throughput, gemba rate) show what will happen. The Shingo Model points out that success should be measured in both performance and behavior terms [4]. An OpEx program that tracks only lagging indicators sees problems too late.

### Checklist: is your KPI system fit for OpEx?

- [ ] Every metric has a written definition (formula, data source, frequency, owner).
- [ ] Every team metric can be traced back to a plant or Hoshin goal.
- [ ] Shop floor metrics are available by the next day at the latest.
- [ ] Every metric has a target value and a reaction rule for deviations.
- [ ] At least one behavior metric is tracked per leadership level.
- [ ] Metrics that have not triggered a decision in six months are dropped.

## Business case and ROI

Operational excellence competes for budget with investments in equipment, IT and sales. A solid business case is therefore a must. Detailed calculation models are in [Operational excellence ROI and business case](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

### What the research shows

- **Management explains productivity differences in US plants.** Bloom, Brynjolfsson and co-authors analyzed the Census Bureau's Management and Organizational Practices Survey (MOPS), with two waves of about 35,000 US manufacturing plants each in 2010 and 2015. Management practices account for more than 20% of the variation in productivity, "a similar, or greater, percentage as that accounted for by R&D, ICT, or human capital" [35].
- **The international picture is similar.** An analysis of the World Management Survey finds that about a quarter of the differences in total factor productivity (TFP) between and within countries can be attributed to management practices; a one-standard-deviation improvement in the management score is associated with roughly 15% higher TFP in the cross-section [24]. The authors themselves call this attribution a rough estimate [24].
- **Causal evidence from an experiment.** In a randomized field experiment with Indian textile firms, productivity rose by about 20% after structured management practices (including metrics, quality management and inventory control) were introduced. Profits rose by an average of about $325,000 in the first year, against a market price for the consulting service of about $200,000 [24]. From the experiment, the authors derive a somewhat smaller effect than from the cross-section: about 10% more productivity per standard deviation of management score [24].
- **Top plants show the potential.** The twelve sites added to the Global Lighthouse Network in September 2025 reported on average 40% higher labor productivity and 48% shorter lead times; the network then counted 201 sites [25]. This is a positive selection of award-winning plants, not industry averages.
- **Implementation risk is real.** McKinsey cites the widely held finding that 70% of change programs fail to reach their goals, mainly because of employee resistance and lack of management support [23]. That number is not solid: after reviewing the evidence, Mark Hughes concluded in the *Journal of Change Management* in 2011 that there is no valid and reliable empirical basis for the 70% narrative [33]. For the business case, the lesson still holds: implementation risk is real and belongs in the calculation, as its own assumption rather than as a blanket failure rate.

### How to build the business case

1. **Establish a baseline:** OEE of bottleneck equipment, scrap and rework cost, inventory, on-time delivery, overtime, expedited freight.
2. **Quantify the levers:** one conservative assumption per lever, based on your own loss analysis (not on third-party benchmarks).
3. **Capture all costs:** internal time (workshops, coaching, release from regular duties), outside support, training, software, hardware for visual management.
4. **Translate benefits into cash:** value additional output only if it can be sold; otherwise count it as avoided capital spending or avoided overtime.
5. **Model the risk:** scenarios (conservative, expected, ambitious) and a ramp-up that assumes effects only from month four to six.

### Worked example (illustrative, fictional values)

The following example shows the calculation logic. The values are made up and are not a benchmark. (The German version uses the same numbers in euros; they are equally fictional there.)

| Item | Assumption | Annual effect |
|---|---|---|
| Bottleneck line: OEE from 62% to 68% | output rises proportionally by about 9.7%; additional volume can be sold with a contribution margin of $400,000 per OEE percentage point | $2,400,000 |
| Scrap: rate from 3.0% to 2.2% | material spend $20 million | $160,000 |
| Inventory: days on hand from 30 to 24 | inventory $6 million, cost of capital 8% | $96,000 (plus one-time cash release of $1.2 million) |
| **Total recurring benefit** | | **$2,656,000** |
| Cost: OpEx team (3 full-time positions), training, coaching, software | | $650,000 |
| **Net benefit in year 1 at 50% ramp-up** | | **approx. $678,000** |

Note on the calculation: year 1 counts 50% of the recurring benefit ($1,328,000) minus the full cost. From year 2 on, the ratio improves considerably, provided the effects hold.

How to check the largest item for your own plant: at the bottleneck line, one OEE percentage point corresponds roughly to one percent of planned production time. Multiply those hours by output per hour and contribution margin per unit. The $400,000 in the example assumes a highly utilized line with a high contribution margin; in many small and mid-sized plants, the value is much lower. Only count this item if the additional volume can really be sold (see step 4 above).

## How to achieve operational excellence: a 12-month roadmap

Twelve months are not enough to fully embed operational excellence. They are enough to lay the foundation in one plant, achieve first measurable results and make the shift from projects to a daily management system. A detailed plant plan is in [Operational excellence roadmap: a 12-month plan for a plant](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roadmap-12-month-plan-plant/).

The phases overlap on purpose: while the pilot area stabilizes, strategy deployment already begins.

| Phase | Months | Goals | Core activities | Result / milestone |
|---|---|---|---|---|
| 1. Diagnosis and alignment | 1–2 | understand the starting point, align leadership | maturity assessment, value stream map of the main product family, OEE baseline, interviews, leadership workshop on principles | current-state picture, three to five breakthrough objectives, sponsor and OpEx lead named |
| 2. Pilot and foundation | 3–5 | get methods working in one pilot area | 5S, standardized work, shop floor board with daily meeting, first A3s with coaching, TPM initial cleaning at the bottleneck | working model area, first measurable improvements |
| 3. Anchor the strategy | 4–6 | connect strategy with daily work | Hoshin Kanri with X-matrix, catchball, KPI cascade, monthly strategy reviews | documented goal cascade down to team level |
| 4. Roll out | 6–9 | shop floor management across the plant | tiered meeting cascade, escalation rules, gemba walk standard, A3 training for supervisors and team leaders | all areas with a daily meeting, same-day escalation |
| 5. Stabilize and digitize | 9–11 | secure the gains, reduce effort | standard confirmation (layered audits), automated KPI capture, simulation of layout and capacity scenarios | metrics available next day, backslide rate measured |
| 6. Reflect and start the next cycle | 12 | learn and realign | re-assessment, leadership hansei, new annual goals, plan for other plants | second maturity assessment, Hoshin plan for year 2 |

### Success factors for the roadmap

- **One model area before rollout.** An area that visibly works convinces more than any presentation.
- **Leaders first.** Train leaders before teams. Anyone expected to coach must have used the method themselves.
- **Few goals.** Three to five breakthrough objectives are enough.
- **Rhythm over activity.** Daily meetings, weekly action reviews, monthly strategy reviews and an annual cycle.
- **Free up capacity.** Improvement takes time. Plan it explicitly, for example as fixed hours per week for team leaders.

## Roles, organization and labor relations

### The role of the operational excellence manager

The OpEx manager (also OpEx lead, director of operational excellence or CI manager) is architect, coach and driver of the management system. Typical tasks:

- Designing the production system or OpEx system and its standards.
- Facilitating Hoshin Kanri and supporting the strategy reviews.
- Coaching leaders in A3, gemba walks and shop floor management.
- Building method skills (training programs, belt or coach levels).
- Maintaining the KPI system and maturity assessments.
- Transferring proven solutions between areas and plants.

**Skill profile:** solid method knowledge (lean, Six Sigma, TPM), experience in production or process management, facilitation and coaching skills, analytical understanding of data and a good feel for change. Important: the OpEx manager is not responsible for the improvements. They are responsible for the line organization's ability to improve itself. Someone who leads every project personally creates dependency, not capability.

### Typical roles at a glance

| Role | Responsibility | Time spent on OpEx (rule of thumb from practice) |
|---|---|---|
| CEO / general manager / plant manager (sponsor) | breakthrough objectives, resources, role model at the gemba | regular, fixed in the calendar |
| OpEx manager / OpEx team | system, methods, coaching | full time |
| Department and area managers | goal achievement, strategy reviews, A3 coaching | a substantial part of the week |
| Supervisors / team leaders | daily meeting, standard confirmation, problem solving | daily |
| Employees | follow and improve standards, report deviations | daily |
| Maintenance, quality, logistics | TPM, quality methods, pull systems | project-based and daily |

### Central vs. decentralized organization

A small central team that owns standards and methods, combined with coaches in the plants who report to the plant manager, has proven effective. A large central team that runs projects for the plants produces short-term results but rarely lasting capability.

### Involve employees and their representatives early

Operational excellence changes how work is measured. That makes it a labor-relations topic, especially for its digital parts: machine data capture with operator log-in, digital boards with names, camera-based systems or analytics in Microsoft 365.

**In the US.** In a nonunion plant, there is no legal co-determination body, but the practical rule is the same: if employees believe metrics will be used against them, they stop reporting problems. In a unionized plant, the National Labor Relations Act requires the employer to bargain over mandatory subjects of bargaining. The National Labor Relations Board held in *Colgate-Palmolive Co.*, 323 NLRB 515 (1997), that the installation and use of hidden surveillance cameras is a mandatory subject of bargaining because it is "plainly germane to the working environment" [41]. Whether a specific system (for example operator-level machine data or productivity tracking) triggers a duty to bargain depends on the facts and the collective bargaining agreement; clarify it with labor counsel before rollout.

**At German sites.** Many US companies run plants in Germany, where elected works councils (Betriebsrat) have statutory co-determination rights. Under Section 87(1) No. 6 of the German Works Constitution Act (Betriebsverfassungsgesetz, BetrVG), the works council has a say in the introduction and use of technical devices designed to monitor employees' behavior or performance [34]. The Federal Labor Court (Bundesarbeitsgericht) interprets this provision broadly in established case law: it is enough that a system is objectively capable of capturing such data. Machine data capture with operator ID, digital shop floor boards with names or Microsoft 365 analytics can fall under it. Section 87(1) No. 12 BetrVG adds a separate co-determination right for the principles of employee suggestion systems [34]. The employer cannot introduce such a system unilaterally; if the parties do not agree, a conciliation board (Einigungsstelle) decides [34]. The result is usually documented in a works agreement (Betriebsvereinbarung).

Three steps that work in both settings:

1. **Inform early:** involve employee representatives or the union in the diagnosis phase, not only at software selection.
2. **Put the purpose in writing:** state that metrics serve process improvement, not individual performance evaluation; report at team or machine level rather than at person level. In Germany this goes into a works agreement; in a union plant, into a side letter or the bargaining record.
3. **Protect jobs:** say clearly how productivity gains will be used. Without that commitment, employee participation stays low (see "Why operational excellence programs fail").

This section is not legal advice; the details depend on your agreements and jurisdiction.

## Digital tools, Microsoft 365, digital twins and AI

Digital technology does not replace operational excellence. It amplifies it, for better or worse: digitize an unstable process and you mostly see its deviations faster. On the other hand, paper-based OpEx systems hit their limits as product variety, multi-plant networks and real-time requirements grow.

### Where digital tools support OpEx

| OpEx element | Analog approach | Digital support |
|---|---|---|
| Value stream mapping | paper and stopwatch, snapshot | digital value stream models with data, scenario comparison |
| Capacity and layout planning | spreadsheets, experience | simulation of variants before implementation |
| Shop floor management | whiteboard, manual metrics | automatically populated boards, escalation in the system |
| OEE | tally sheets | machine data capture with loss reasons |
| Problem solving | A3 on paper | digital A3 with data links and a knowledge base |
| Hoshin Kanri | X-matrix in Excel | end-to-end goal cascade with live metrics |

### Microsoft 365 and Azure in daily OpEx work

Many plants already license the building blocks for a digital OpEx system but use them only for office work. The following mapping shows typical patterns; it is not a product recommendation, and you should check features and licensing terms for your case.

| OpEx routine | Typical setup in the Microsoft stack | What to watch |
|---|---|---|
| Shop floor board and KPI cascade | Power BI reports on screens at the board, fed from MES, ERP or machine data capture | define metrics first; match refresh frequency to the meeting (previous-day values are often enough) |
| Action list and escalation | Microsoft Lists or Planner per area, escalation through one Teams channel per tier | one list per tier, not per project; review open actions together in the weekly meeting |
| Standard confirmation and checklists | simple Power Apps on tablets for layered process audits, 5S audits or shift handovers | keep forms short enough to complete in two minutes |
| A3 and knowledge base | A3 template in SharePoint or Loop, completed A3s searchable by tags | the conversation between coach and owner stays at the core; the digital A3 does not replace it |
| Machine data | connect equipment through Azure IoT services or existing MES interfaces, analyze in Power BI or Microsoft Fabric | loss reasons still need meaningful capture; involve employee representatives (see "Labor relations") |
| AI assistance | Microsoft 365 Copilot to summarize shift reports, action lists and meetings | check results; use confidential production data only in approved environments |

For M365 admins and owners, this means the value comes from mapping the tools exactly to the routines of the leadership system: daily meeting, weekly review and monthly review. Another dashboard without a fixed place in these routines adds little. Start with one line and one board, and expand only when the meeting runs without help from IT. For the architecture behind it, see the sister guide [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned).

### Digital twins

A digital twin is a digital representation of a physical object, process or system that is coupled with real data. For manufacturing, the ISO 23247 series (since 2021) describes a framework for digital twins in production [27]. For operational excellence, three uses stand out:

1. **Plan before you change:** layout, takt and capacity changes are simulated before equipment is moved. That reduces the risk of large kaizen changes.
2. **Value stream transparency:** material and information flows become visible based on current data, not just once a year in a workshop.
3. **Decision support:** bottlenecks, inventories and lead times can be evaluated under different assumptions.

Further reading: entity page [Digital Twin](https://www.m365.fm/entity/digital-twin/) and the sister guide [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned).

### Data models: an underrated prerequisite

Many digitalization projects fail not because of the software but because of inconsistent master data: different names for the same machine, different cycle times in the ERP system and the routing, metrics without a common definition. A shared data model for product, process and resource is therefore an OpEx task, not just an IT task. Standardized work applies here too, figuratively: data standard first, automation second.

### AI in operational excellence

According to the World Economic Forum, up to 50% of the top use cases at the sites added to the Global Lighthouse Network in 2025 were powered by AI or generative AI [25]. In January 2026, the Forum also launched "Lumina", an AI-powered platform for industrial transformation, drawing on insights from more than 220 Lighthouse sites in over 30 countries [26]. Typical AI use cases related to OpEx:

- Detecting patterns in downtime and quality data (root-cause hypotheses for A3s).
- Predicting equipment failures as a complement to planned maintenance.
- Optimizing sequencing and capacity planning (see the sister guide [Production scheduling software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/), planned).
- Assistance systems that make standards and solution knowledge available at the workstation.
- Summarizing shift reports and action lists for tiered meetings.

**Limit:** AI delivers hypotheses and suggestions. Checking them at the gemba, testing them with PDCA and locking them into the standard remain human tasks. That matches the Shingo principle "Embrace Scientific Thinking" [4].

## Why operational excellence programs fail: common mistakes and fixes

| Mistake | Symptom | Countermeasure |
|---|---|---|
| Tools without principles | 5S audits and boards exist, behavior stays the same | define principles and ideal behaviors, train leaders (Shingo logic [4]) |
| Leadership not involved | OpEx delegated to a staff function | plant manager takes the sponsor role, fixed gemba time in the calendar |
| Too many initiatives | dozens of projects, none finished | Hoshin Kanri with three to five breakthrough objectives |
| Metric overload | 40 KPIs on the board, no decisions | five to seven metrics per level, reaction rules |
| Project instead of system | results slide back after the project ends | standardized work, standard confirmation, daily meeting |
| Copying instead of understanding | Toyota tools adopted one to one | develop your own production system, using the Shingo Model or VDI 2870 as a reference [4][21] |
| No time set aside | improvement happens "on the side" | fixed time budgets, planned capacity |
| Layoffs as the first result | employees refuse to participate | communicate job security, use productivity gains for growth |
| Digitizing before stabilizing | expensive software maps chaotic processes | standard first, then digital |
| Underestimating change management | resistance, relapse into old patterns | communication, participation, visible early wins; plan implementation risk as its own assumption [23][33] |
| Involving employee representatives too late | rollout of digital boards or machine data capture stalls | involve union, works council or employee reps from the diagnosis phase; document the purpose of metrics [34][41] |

## Operational excellence examples: what documented cases show

Many success stories online are unsourced or come from vendors. The following examples are publicly documented:

- **The historical references.** Toyota (TPS, A3, standardized work [9][15][16]; management principles according to Liker [28]), Nippondenso as the first PM Prize winner in 1971 [14] and Motorola and GE with Six Sigma [20] are placed in the timeline above. Their shared lesson: each of these companies built its own system instead of copying tools.
- **US manufacturing plants (Census data).** Across roughly 35,000 US plants, structured management practices (monitoring, targets, incentives) are associated with higher productivity, and management accounts for a share of productivity spread similar to R&D [35]. This is observational data, but at a scale no case study can match.
- **Indian textile firms (field experiment).** Structured management practices raised productivity by about 20% [24]. The example is valuable because it was a randomized experiment and therefore separates cause and effect. Notable for smaller manufacturers: the practices introduced (including metrics, quality management and inventory control) were simple; consistent application made the difference.
- **WEF Lighthouse sites.** Sites added in January 2026 report, among other things: Ford Otosan (Yeniköy, Türkiye) 44% higher labor productivity and 6% better quality; Haier Strauss Science & Technology (Qingdao) 40% lower defect rates, 72% lower quality costs and 53% fewer inventory turnover days; Midea Kitchen & Bath Appliances (Wuhu) 39% shorter delivery lead time, 30% fewer inventory days and 86% fewer field failures [26]. These are self-reported figures published by the WEF as part of the recognition, and a positive selection.

**What these examples have in common:** the impact comes from a system of goals, standards, daily leadership and consistent problem solving, increasingly supported by data and digital tools. No single tool explains any of these successes.

## Software support: the example of iFAKT Polaris

> **Note: The author works at iFAKT GmbH.**

Software cannot replace operational excellence, but it can support work with value streams, scenarios and metrics. Several classes of tools fit the methods in this guide: manufacturing execution systems (MES) and machine data capture for OEE and production reporting, BI tools such as Power BI for the KPI cascade, simulation software for material flow and layout, and specialized solutions for digital value stream models. One example of the last class, from Germany, is [iFAKT Polaris](https://www.m365.fm/entity/polaris/) by [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). According to the company, the firm is headquartered in Stuttgart, Germany, was founded in 2001, has about 25 employees and is certified to ISO 9001 and ISO/IEC 27001; its core industries are aerospace, automotive, machinery and energy [30]. Polaris is positioned under the tagline "AI + Digital Twin for Production"; the modules Polaris VSM and Polaris BSM are listed as SaaS offers in Microsoft's marketplace (AppSource) [30]. According to the vendor, the product Polaris IMS placed second in the production category of the German business magazine WirtschaftsWoche's Best of Technology Award 2025 [30]. A detailed, separately labeled look at the product is in the sister guide [iFAKT Polaris and value stream mapping software](https://www.m365.fm/en/learn/ifakt-polaris/) (planned).

Relative to the methods in this guide, a solution of this kind mainly addresses four tasks:

- **Value stream:** model value streams digitally instead of only drawing them on paper, and evaluate lead times and bottlenecks on a data basis.
- **Simulation:** test layout, capacity and takt scenarios before implementation, for example as part of Hoshin initiatives or larger kaizen changes.
- **Planning:** connect production and capacity planning with the value stream model.
- **KPI analysis:** analyze metrics such as lead time, utilization or OEE-related measures and prepare them for reviews.

Whatever the vendor, check three things when choosing software: does the tool reflect your standards and data model, does it fit your existing IT landscape (ERP, MES, Microsoft 365), and do its results actually feed into the daily tiered meetings and strategy reviews?

## FAQ: operational excellence

### What is operational excellence in simple terms?
Operational excellence is a company's ability to improve how it works, permanently and systematically, so that quality, cost and delivery keep getting better [1]. It rests on a clear strategy, good leadership, stable standards and reliable data.

### What does OpEx stand for?
In operations, OpEx is the common short form of operational excellence. In finance, OPEX (or opex) means operating expenses, as opposed to CapEx (capital expenditures). The context usually makes clear which meaning is intended.

### What are the 4 pillars of operational excellence?
There is no single official list. A practical four-pillar model, based on the Shingo Model and holistic production systems, is: strategy and leadership, culture and people, processes and standards, and data and systems [4][21]. Other sources use three or five pillars; what matters is that all four areas are covered.

### What are the principles of operational excellence?
The best-known set comes from the Shingo Model: ten guiding principles in three dimensions, from "Respect Every Individual" and "Lead with Humility" through "Embrace Scientific Thinking" and "Improve Flow & Pull" to "Think Systemically" and "Create Value for the Customer" [4]. The full list is in the Shingo Model section.

### What is the difference between operational excellence and lean?
Lean is a family of methods and a philosophy for eliminating waste and creating flow. Operational excellence is the overall target state and the management system that connects lean, Six Sigma, TPM and continuous improvement with strategy and culture [4].

### Is operational excellence the same as continuous improvement?
No. Continuous improvement is daily, step-by-step improvement. Operational excellence also includes strategic alignment (for example through Hoshin Kanri), leadership, culture and a metrics system, so that improvements target the right places and last.

### What is the difference between operational excellence and Six Sigma?
Six Sigma is a project-based, statistical method for reducing variation and defects, usually following the DMAIC cycle [20]. Operational excellence is the overarching management system; within it, Six Sigma is a tool for stubborn quality problems with unclear causes.

### What is an operational excellence framework?
A framework defines what an OpEx program aligns to and how progress is assessed. The main ones are the Shingo Model (principles and behavior) [4], the Baldrige Excellence Framework in the US (organization-wide performance, now with maturity pathways) [37], the EFQM Model in Europe [22] and, for German plants, VDI 2870 [21].

### What is an example of operational excellence?
A well-documented example is the randomized experiment with Indian textile firms, where simple structured management practices (metrics, quality management, inventory control) raised productivity by about 20% [24]. On the shop floor, a typical example is a plant that runs a daily 15-minute tiered meeting, escalates problems the same day and turns recurring issues into A3s that become new standards.

### What tools and methods are part of operational excellence?
The core methods are Hoshin Kanri, A3 problem solving with PDCA, shop floor management, standardized work, TPM with OEE, value stream mapping, 5S, SMED, kanban, poka-yoke and Six Sigma with DMAIC. The number of methods matters less than how they work together.

### How do you calculate OEE, and is 85% world class?
OEE = availability × performance × quality [12]. Availability is run time divided by planned production time, performance is total count times ideal cycle time divided by run time, and quality is good count divided by total count. The often-quoted 85% "world class" figure is usually derived from 90% × 95% × 99.9% and attributed to Nakajima, but a primary source is not confirmed [unverified]; LEI's similar example (90% × 95% × 99% ≈ 84.6%) is not labeled world class [12]. Compare OEE with your own trend rather than a blanket benchmark [13].

### How do you measure operational excellence?
Use a mix of result and behavior metrics, five to seven per level: for example total recordable incident rate, first pass yield, on-time in-full (OTIF), OEE at bottleneck equipment and lead time, plus behavior metrics such as completed gemba walks or closed A3s. ISO 22400-2 contains standardized definitions for manufacturing metrics [31]; the US safety rate follows the BLS/OSHA formula based on 200,000 hours [36].

### What does an operational excellence manager do?
They design the OpEx system, facilitate Hoshin Kanri, coach leaders in A3 and shop floor management, build method skills and maintain metrics and maturity assessments. The goal is a line organization that can improve itself.

### How long does it take to implement operational excellence?
First measurable results in a pilot area are realistic after three to six months, a plant-wide management system after about a year. An OpEx culture that stays stable without individual champions usually takes several years [unverified: experience-based estimate, no study source].

### What does operational excellence cost, and is it worth it?
Costs consist mainly of internal time, training, coaching and possibly software. Studies show a strong link between management practices and productivity, including in US Census data on about 35,000 plants [35]; in a field experiment, the first-year profit increase exceeded the market price of the consulting [24]. The concrete ROI depends on your loss base.

### Does operational excellence work outside manufacturing?
Yes. The principles apply to offices, services, hospitals and public agencies. Fraunhofer IPK describes OpEx approaches for hospitals, chemicals and pharmaceuticals, services and public administration, among others [1]. TPM even has its own pillar for indirect functions, office TPM [14]. In IT, the term also names a design pillar of the AWS and Azure Well-Architected Frameworks [43][44].

### How should a small manufacturer start with operational excellence?
Start at the bottleneck line: establish an OEE baseline, introduce a daily 15-minute meeting, apply one problem-solving method (A3 or Kata) with your supervisors and, as plant manager, be on the floor regularly. You don't need an OpEx department; one person with at least half their time as a driver is enough to begin. Your state's MEP center can provide outside support [39].

### Do we need to involve the union or works council?
In a unionized US plant, changes that affect working conditions can be mandatory subjects of bargaining; the NLRB has held this for hidden surveillance cameras [41], and systems that track individual operators deserve a check with labor counsel. At German sites, the works council has co-determination rights over technical systems capable of monitoring behavior or performance (Section 87(1) No. 6 BetrVG) and over suggestion-system principles (No. 12) [34]. Regardless of the legal situation, involve employees early, because OpEx does not work without them.

## Glossary: key OpEx terms

| Term | Short explanation |
|---|---|
| A3 | problem solving on one sheet of A3 paper (297 x 420 mm, about 11.7 x 16.5 in.), structured by PDCA and designed as a coaching process |
| Andon | signal (light, button, cord) that lets employees flag a problem immediately |
| Catchball | dialogue between levels in Hoshin Kanri about goals and resources |
| Gemba | the place where value is created; in a plant, the line or workstation |
| Hansei | structured reflection, for example at the end of a Hoshin cycle |
| Heijunka | leveling production by volume and product mix |
| Hoshin Kanri | method for cascading a few strategic goals down to the workstation |
| Jidoka | principle of stopping a process on abnormality so no defect is passed on |
| Kaizen / continuous improvement | ongoing improvement in small steps (German: KVP) |
| Kata | practiced routine; in lean, the improvement and coaching kata according to Rother |
| Leader standard work | fixed daily and weekly routine for leaders (meetings, gemba time, confirmations, coaching) |
| Muda, mura, muri | waste, unevenness, overburden |
| OEE | Overall Equipment Effectiveness: availability × performance × quality |
| PDCA | Plan, Do, Check, Act: repeating improvement cycle |
| Poka-yoke | mistake-proofing device that makes errors impossible or immediately visible |
| SMED | single-minute exchange of die: method for reducing changeover time |
| Standardized work | defined procedure of takt time, work sequence and standard inventory |
| TPM | Total Productive Maintenance: equipment care involving all employees |
| TRIR | total recordable incident rate: recordable cases × 200,000 / hours worked (OSHA/BLS) |
| X-matrix | one-page view of breakthrough objectives, annual objectives, initiatives and metrics |

## Conclusion and first steps

Operational excellence is an organization's ability to get a little better every day, aligned with a few strategic goals. Research shows that management practices explain a substantial share of productivity differences between plants and companies, in US Census data as well as internationally [35][24], and award-winning plants show the potential of combining OpEx with digital technology [25][26].

Three steps to start: first, an honest assessment with maturity level, value stream and OEE baseline. Second, a model area with standardized work, shop floor management and A3 coaching. Third, a link to strategy through Hoshin Kanri. If you also put principles and behavior at the center, as the Shingo Model does, you lay the groundwork for improvements that survive the next change of personnel.

**Your next 30 days as plant manager or head of operations:**

- [ ] Name the bottleneck equipment and record OEE with loss reasons for one week (a tally sheet is enough).
- [ ] Fill out the pillar check from this guide with your leadership team and compare the answers.
- [ ] Start a daily 15-minute meeting at the bottleneck line and attend at least twice a week yourself.
- [ ] Work through a first A3 on the biggest loss at the bottleneck together with a supervisor.
- [ ] Inform employee representatives (union, works council at German sites) and IT/M365 owners before digital boards or machine data come into play.

## Further reading on m365.fm

**In-depth articles**
- [What is operational excellence in manufacturing?](https://www.m365.fm/community/u/mirko-p/blog/what-is-operational-excellence-in-manufacturing/)
- [Operational excellence vs. lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/)
- [Operational excellence ROI and business case](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- [Operational excellence roadmap: a 12-month plan for a plant](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roadmap-12-month-plan-plant/)
- [Operational excellence framework: building blocks and maturity](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-framework-building-blocks-maturity/)
- [Operational excellence culture on the shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)

**Sister guides (planned)**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned, activate link after publication)
- [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Production scheduling software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [iFAKT Polaris and value stream mapping software](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about operational excellence, lean manufacturing and the digital transformation of production. At [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Germany, the maker of [iFAKT Polaris](https://www.m365.fm/entity/polaris/), he works on how value stream, simulation and KPI analysis help plants on the way to operational excellence. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

1. Fraunhofer IPK: "Operational Excellence entwickeln" (German-language page; quote translated). Fraunhofer Institute for Production Systems and Design Technology. https://www.ipk.fraunhofer.de/de/kompetenzen-und-loesungen/unternehmens-und-produktionsmanagement/agiles-prozessmanagement/operational-excellence-entwickeln.html (accessed November 20, 2026)
2. Treacy, M.; Wiersema, F.: "Customer Intimacy and Other Value Disciplines". Harvard Business Review, January/February 1993. https://hbr.org/1993/01/customer-intimacy-and-other-value-disciplines (accessed November 20, 2026)
3. Rework Resources: "Value Disciplines Model" (secondary source on Treacy/Wiersema, *The Discipline of Market Leaders*, 1995; English edition of the page cited in the German version). https://resources.rework.com/libraries/strategic-management/value-disciplines-model (accessed November 20, 2026)
4. Shingo Institute: "The Shingo Model". Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/model (accessed November 20, 2026)
5. Wikipedia: "Shingo Prize". https://en.wikipedia.org/wiki/Shingo_Prize (accessed November 20, 2026)
6. Lean Enterprise Institute: "Strategy Deployment" (Lean Lexicon). https://www.lean.org/lexicon-terms/strategy-deployment/ (accessed November 20, 2026)
7. Lean Enterprise Institute: "Hoshin Kanri – Resource Guide". https://www.lean.org/lexicon-terms/hoshin-kanri/ (accessed November 20, 2026)
8. Akao, Y. (ed.): *Hoshin Kanri: Policy Deployment for Successful TQM*. Productivity Press / Routledge (originally Japanese Standards Association). https://www.routledge.com/Hoshin-Kanri-Policy-Deployment-for-Successful-TQM/Akao/p/book/9781563273117 (accessed November 20, 2026)
9. Lean Enterprise Institute: "A3 Problem-Solving – A Resource Guide". https://www.lean.org/lexicon-terms/a3-report/ (accessed November 20, 2026)
10. MIT Sloan Management Review: "Problem Solving by Design" (on John Shook, *Managing to Learn*). https://sloanreview.mit.edu/article/problem-solving-by-design (accessed November 20, 2026)
11. Lean Enterprise Institute: "Plan, Do, Check, Act (PDCA)". https://www.lean.org/lexicon-terms/pdca/ (accessed November 20, 2026)
12. Lean Enterprise Institute: "Overall Equipment Effectiveness". https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/ (accessed November 20, 2026)
13. Wikipedia: "Overall equipment effectiveness" (secondary source for term origin, textbook example and TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness (accessed November 20, 2026)
14. Wikipedia: "Total productive maintenance". https://en.wikipedia.org/wiki/Total_productive_maintenance (accessed November 20, 2026)
15. Lean Enterprise Institute: "Standardized Work". https://www.lean.org/lexicon-terms/standardized-work/ (accessed November 20, 2026)
16. Lean Enterprise Institute: "Seven Wastes". https://www.lean.org/lexicon-terms/seven-wastes/ (accessed November 20, 2026)
17. Lean Enterprise Institute: "Gemba". https://www.lean.org/lexicon-terms/gemba/ (accessed November 20, 2026)
18. Lean Enterprise Institute: "Muda". https://www.lean.org/lexicon-terms/muda/ (accessed November 20, 2026)
19. Graban, M.: "The Evolution of 'Lean Production': Reflecting on 25 Years Since the Term Was Coined" (on Krafcik, "Triumph of the Lean Production System", MIT Sloan Management Review, Fall 1988). Lean Blog. https://www.leanblog.org/2013/09/evolution-of-lean-production-25-years/ (accessed November 20, 2026)
20. Wikipedia: "Six Sigma". https://en.wikipedia.org/wiki/Six_Sigma (accessed November 20, 2026)
21. VDI: "VDI 2870 Part 1 – Lean production systems; Basic principles, introduction and review" (German title: Ganzheitliche Produktionssysteme). Verein Deutscher Ingenieure. https://vdi.de/en/home/vdi-standards/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review (accessed November 20, 2026)
22. EFQM / DGQ: "Das EFQM Modell 2025" (German edition; criterion names translated). https://dgq.de/wp-content/uploads/2024/11/THe_EFQM_Model_2025_DE_FINAL.pdf (accessed November 20, 2026)
23. Ewenstein, B.; Smith, W.; Sologar, A.: "Changing change management". McKinsey & Company, July 1, 2015. https://www.mckinsey.com/featured-insights/leadership/changing-change-management (accessed November 20, 2026)
24. Bloom, N.; Lemos, R.; Sadun, R.; Scur, D.; Van Reenen, J.: "The New Empirical Economics of Management". NBER Working Paper 20102, May 2014. https://www.nber.org/system/files/working_papers/w20102/w20102.pdf (accessed November 20, 2026)
25. World Economic Forum: "Global Lighthouse Network 2025: World Economic Forum Recognizes 12 New Sites Driving Holistic Transformation in Manufacturing", September 16, 2025. https://www.weforum.org/press/2025/09/global-lighthouse-network-2025-world-economic-forum-recognizes-12-new-sites-driving-holistic-transformation-in-manufacturing/ (accessed November 20, 2026)
26. World Economic Forum: "Global Lighthouse Network Recognizes 23 New Sites, Launches AI Platform for Industrial Transformation", January 15, 2026. https://www.weforum.org/press/2026/01/global-lighthouse-network-recognizes-23-new-sites-launches-ai-platform-for-industrial-transformation-89a7334dcb/ (accessed November 20, 2026)
27. ISO: "ISO 23247-1:2021 Automation systems and integration – Digital twin framework for manufacturing – Part 1: Overview and general principles" (catalog entry). https://iteh.eu/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021 (accessed November 20, 2026)
28. Liker, J. K.: *The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer*. McGraw-Hill, 2004 (catalog entry, MPDL). https://ebooks.mpdl.mpg.de/ebooks/Record/EB001951503/Description (accessed November 20, 2026)
29. Metternich, J. et al.: *Digitales Shopfloor Management* (German-language book). Carl Hanser Verlag (catalog entry). https://www.schweitzer-online.de/en/buch/Metternich/Digitales-Shopfloor-Management/9783446477612/B642123/ (accessed November 20, 2026)
30. m365.fm: entity page "iFAKT GmbH" (company information provided by iFAKT, as of November 2026). https://www.m365.fm/entity/ifakt/ (accessed November 20, 2026)
31. ISO: "ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions" (catalog entry). https://www.iso.org/standard/54497.html (accessed November 20, 2026)
32. Lean Enterprise Institute: "Kata" (Lean Lexicon). https://www.lean.org/lexicon-terms/kata/ (accessed November 20, 2026)
33. Hughes, M.: "Do 70 Per Cent of All Organizational Change Initiatives Really Fail?". Journal of Change Management 11 (4), 2011, pp. 451–464. https://research.brighton.ac.uk/en/publications/do-70-per-cent-of-all-organizational-change-initiatives-really-fa/ (accessed November 20, 2026)
34. German Federal Ministry of Justice: Works Constitution Act (Betriebsverfassungsgesetz), Section 87, Co-determination rights (German-language statute). https://www.gesetze-im-internet.de/betrvg/__87.html (accessed November 20, 2026)
35. Bloom, N.; Brynjolfsson, E.; Foster, L.; Jarmin, R.; Patnaik, M.; Saporta-Eksten, I.; Van Reenen, J.: "What Drives Differences in Management Practices?". American Economic Review 109 (5), 2019, pp. 1648–1683 (author PDF via MIT Initiative on the Digital Economy). https://ide.mit.edu/wp-content/uploads/2019/05/What-Drives-Diffs-in-Mgmt-Practices_AER-2019-May.20170491.pdf (accessed November 20, 2026)
36. US Bureau of Labor Statistics: "Occupational Safety and Health Definitions" (incidence rate formula, 200,000 hours). https://www.bls.gov/iif/definitions/occupational-safety-and-health-definitions.htm (accessed November 20, 2026)
37. Baldrige Foundation: "2026 Baldrige Framework Key Changes". https://baldrigefoundation.org/what-we-do/baldrige-excellence-framework/2026-baldrige-framework-key-changes.html (accessed November 20, 2026)
38. NIST: "Now Announcing 2025 Baldrige Award Criteria", December 2024. https://www.nist.gov/news-events/news/2024/12/now-announcing-2025-baldrige-award-criteria (accessed November 20, 2026)
39. NIST: Hollings Manufacturing Extension Partnership (MEP), "About" page. https://www.nist.gov/mep/about (accessed November 20, 2026)
40. National Association of Manufacturers: "Facts About Manufacturing (Expanded)" (citing US Census Bureau, Statistics of U.S. Businesses, 2022). https://nam.org/mfgdata/facts-about-manufacturing-expanded/ (accessed November 20, 2026)
41. FindLaw: "NLRB Rules Employers Must Bargain Over Placement and Use of Hidden Surveillance Cameras" (on *Colgate-Palmolive Co.*, 323 NLRB 515 (1997)). https://corporate.findlaw.com/?p=33439 (accessed November 20, 2026)
42. International Society of Automation: "ISA-95 Standard". https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard (accessed November 20, 2026)
43. Amazon Web Services: "Definition" (Operational excellence pillar, AWS Well-Architected Framework). https://docs.aws.amazon.com/en_en/wellarchitected/latest/framework/oe-definition.html (accessed November 20, 2026)
44. Microsoft Learn: "Azure Well-Architected Framework pillars". https://learn.microsoft.com/azure/well-architected/pillars (accessed November 20, 2026)

---

# Editorial notes

**Open or still-to-verify items (as of the English review, November 20, 2026)**

1. **VDI 2870 design principles** (section "VDI 2870"): the list stays marked [unverified]. The VDI page lists no principles; check against the guideline text (section 3.5, design principles). The revision status (project, possible publication June 2027) is verified but should be rechecked before publication.
2. **FAQ "How long does it take?"**: time estimates (3 to 6 months pilot, about 1 year plant-wide, several years for culture) are experience values and marked [unverified].
3. **iFAKT facts** [30]: founded 2001, about 25 employees, ISO 9001 and ISO/IEC 27001 (TÜV SÜD), industries, AppSource listing (Polaris VSM/BSM) and award (Polaris IMS, 2nd place, production category) match the m365.fm entity page, which reflects company information. Independently confirmed (consistency check of the German set, November 20, 2026): the award (WirtschaftsWoche winners page award.wiwo.de/bot/gewinner-2025/, production category, 2nd place iFAKT GmbH), the AppSource entries for Polaris VSM and BSM, and the ISO seal on ifakt.de. Founding year and headcount remain company statements; the text says "according to the company" / "according to the vendor". Headquarters per imprint: Curiestrasse 2, 70563 Stuttgart, Germany (commercial register Stuttgart HRB 22661). No other locations are mentioned.
4. **m365.fm entity page iFAKT**: per the German consistency check, the entity page currently shows a "Sponsored" / "Paid partnership" label, which contradicts the confirmed fact that iFAKT does not pay for publication. This article cites the page as source [30] and links it; align the entity page label before publication.
5. **Disclosure**: the iFAKT section and the author box carry exactly "Note: The author works at iFAKT GmbH." This discloses the author's material connection in line with the FTC Endorsement Guides; it is intentionally not a sponsorship label, and no `rel="sponsored"` is used.
6. **Treacy/Wiersema definition** ("lowest total cost and highest convenience"): supported by secondary source [3] (now the English edition of the Rework page, verified); the HBR full text is paywalled.
7. **Akao, Hoshin Kanri**: the first English edition is commonly dated 1991 (Productivity Press); the Routledge entry shows the 2004 edition. Named without a year.
8. **85% OEE "world class"**: origin (often attributed to Nakajima, 90/95/99.9%) not confirmed in a primary source; marked [unverified], consistent with the German set and the Manufacturing KPIs guide.
9. **Rules of thumb without a single source**: SQDCP, meeting length 10 to 15 minutes, role time shares, Kata coaching 15 to 20 minutes, small-plant table (OpEx lead with at least 50%), 5 to 7 metrics per level. All labeled as rules of thumb or experience values.
10. **Labor relations section**: *Colgate-Palmolive Co.*, 323 NLRB 515 (1997), verified via a FindLaw summary [41]; consider adding the NLRB decision itself as the primary source. NLRB General Counsel guidance on electronic monitoring has changed in recent years; the text deliberately cites only the Board decision and recommends labor counsel. German part: wording of Section 87(1) No. 6 and No. 12 BetrVG verified [34]; the broad interpretation by the Federal Labor Court is established case law but given without a docket number. Have a US labor lawyer and a German labor lawyer read the section before publication.
11. **Baldrige 2026**: structure (six categories, results integrated, "Organizational Intelligence", three maturity pathways) is taken from the Baldrige Foundation page [37]; the category names other than Category 4 were not listed there. Check the NIST framework page for the full names before publication and consider naming them.
12. **EFQM criteria names**: translated from the German DGQ edition [22]; the official English names may differ slightly. Check against the English EFQM Model 2025 publication (efqm.org shop page did not show content when fetched).
13. **Fraunhofer IPK definition** [1]: translated from German; no English version of the page was found. Kept because it is the definition used throughout the German set.
14. **Business case currency**: the illustrative business case uses fictional USD values (same numbers as the fictional EUR values in the German version). This is not a currency conversion; both are made-up figures for the calculation logic.
15. **Microsoft 365 table**: product names (Power BI, Lists, Planner, Power Apps, SharePoint, Loop, Azure IoT services, Microsoft Fabric, Microsoft 365 Copilot) as of November 2026; check for renames before publication. The table describes usage patterns, not licensing.
16. **Illustrative 90-day scenario and business-case calculation**: fictional and labeled as such. Set them off as example boxes in the layout.
17. **Competitor word counts**: estimates from fetched main text (without navigation), November 20, 2026.
18. **Meta title and description**: 56 and 154 characters including spaces; check pixel width in the CMS snippet tool (the description is close to the limit).
19. **Anchors in the table of contents**: generated from the English H2s; check that the CMS creates identical anchors.
20. **Internal links**: the m365.fm community blog posts and entity pages were not individually checked for availability; click through before publication. All `/en/learn/` sister guides are planned; activate links and remove "(planned)" after publication.

**Internal links used (English sister guides, absolute URLs)**
- https://www.m365.fm/en/learn/lean-manufacturing/
- https://www.m365.fm/en/learn/shop-floor-management/
- https://www.m365.fm/en/learn/manufacturing-kpis/
- https://www.m365.fm/en/learn/value-stream-mapping/
- https://www.m365.fm/en/learn/manufacturing-it-azure/
- https://www.m365.fm/en/learn/digital-twin-manufacturing/
- https://www.m365.fm/en/learn/production-scheduling-aps/
- https://www.m365.fm/en/learn/ifakt-polaris/

**Hreflang and cannibalization**
- `<link rel="alternate" hreflang="en-US" href="https://www.m365.fm/en/learn/operational-excellence/">` and `<link rel="alternate" hreflang="de-DE" href="https://www.m365.fm/learn/operational-excellence/">` on both pages, plus `x-default` pointing to the English version if the site uses one.
- Possible overlap with the community post "What is operational excellence in manufacturing?" (same head intent in English). Keep the post as a short entry point that links to this guide; make this guide the canonical target for "operational excellence".
- Overlap with "Manufacturing KPIs" (OEE) and "Lean manufacturing" (lean tools) is handled by short treatment plus links.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Operational Excellence: The Complete Guide to Definition, Frameworks, Methods and Implementation",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/operational-excellence/",
      "about": {"@type": "Thing", "name": "Operational excellence", "sameAs": "https://www.m365.fm/entity/operational-excellence/"},
      "mentions": [
        {"@type": "Thing", "name": "Hoshin Kanri", "sameAs": "https://www.m365.fm/entity/hoshin-kanri/"},
        {"@type": "Thing", "name": "Total Productive Maintenance", "sameAs": "https://www.m365.fm/entity/total-productive-maintenance/"},
        {"@type": "Thing", "name": "Shingo Model"},
        {"@type": "Thing", "name": "Baldrige Excellence Framework"},
        {"@type": "SoftwareApplication", "name": "iFAKT Polaris", "sameAs": "https://www.m365.fm/entity/polaris/"}
      ]
    },
    {"@type": "FAQPage", "inLanguage": "en-US", "mainEntity": "[all 18 FAQ questions as Question with acceptedAnswer; answer text without [n] references]"},
    {"@type": "DefinedTermSet", "name": "Key OpEx terms", "inLanguage": "en-US", "hasDefinedTerm": "[20 glossary terms]"},
    {"@type": "BreadcrumbList", "itemListElement": ["Home", "Learn", "Operational Excellence"]}
  ]
}
```

Keep the iFAKT disclosure visible in the HTML. Optional `HowTo` only if the 12-month roadmap is marked up as its own step sequence.

**Recommended graphics**
1. Shingo Model diagram (culture, principles, systems, tools, results) with the ten principles in three dimensions (own drawing, no copy of the Shingo graphic).
2. Four-pillar diagram (strategy and leadership, culture and people, processes and standards, data and systems).
3. X-matrix template (one page, four quadrants plus responsibilities).
4. OEE waterfall from planned production time to fully productive time, using the worked example (480 min → 69.1%).
5. Tiered meeting cascade (team, supervisor, department, plant) with times of day.
6. 12-month roadmap as a Gantt chart with overlapping phases.

## Review log

Review and optimization loop for the US English version, November 20, 2026, with five roles: subject-matter expert (OpEx/lean), SEO specialist (US), reader from the US target audience (plant manager at a mid-sized manufacturer, also responsible for the plant's M365 rollout), fact checker (re-verifies every new or changed fact online), critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms). Starting point: the German final version including its review log and the consistency check of November 20, 2026. Two rounds, one optimization pass.

### Localization decisions before the review

- **US SERP:** main keyword confirmed as "operational excellence" (Wikipedia, Smartsheet, KaiNexus, Pipefy, NetSuite rank for it; AWS Well-Architected also ranks, which shows a cloud meaning of the term). Longest competitor: Smartsheet with approx. 6,000 to 7,000 words.
- **Sources swapped or added (all opened and verified on November 20, 2026):** Bloom, Brynjolfsson et al., AER 2019 (US Census MOPS, about 35,000 plants per wave) [35]; BLS incidence-rate definition with the 200,000-hour base [36]; Baldrige Foundation 2026 key changes [37] and NIST Baldrige announcement [38]; NIST MEP [39]; NAM/Census firm-size data [40]; *Colgate-Palmolive* (NLRB) via FindLaw [41]; ISA-95 [42]; AWS and Azure Well-Architected [43][44]; Rework source switched from the German to the English edition [3].
- **Kept German sources, explained:** Fraunhofer IPK (translated definition), VDI 2870 (explained as a guideline of the Association of German Engineers), EFQM German edition, Metternich book (labeled German-language), BetrVG (now framed for US companies with German sites).

### Round 1 (first English draft)

- **Subject-matter expert (not satisfied):** content carried over correctly, but the A3 paper size was given as "about 11 x 17 inches", which is the US ledger size, not A3; "Common mistakes" did not say why OpEx programs fail, a framing US practitioners use; the US term "tiered daily management" should appear next to shop floor management.
- **SEO specialist (not satisfied):** strong coverage, but the PAA questions "How do you achieve operational excellence?" and "Why do operational excellence efforts fail?" had no matching H2 wording; the cloud meaning ranks for the head term and needed an explicit disambiguation (already drafted, keep it); the German-specific FAQ "What does operative Exzellenz mean?" has no US search volume.
- **US reader (not satisfied at first):** liked the small-plant section, MEP pointer and USD business case. Wanted the safety metric in OSHA terms (done in draft: TRIR with 200,000 hours) and a clearer answer on what happens at German sites if the works council says no.
- **Fact checker (satisfied with conditions):** all new US facts re-verified (MOPS figures and quote, BLS formula, NAM 239,265 firms / 4,177 not small, MEP quote and 450+ locations, Baldrige 2026 changes, NIST 2024 announcement, *Colgate-Palmolive* holding, ISA-95 levels, AWS four areas, Azure five pillars and quote). Conditions: the key takeaway said "more than 30,000 plants" while the body said about 35,000 per wave (align); the A3 dimensions must be exact; the works-council sentence "cannot be introduced without agreement" is incomplete because Section 87(2) BetrVG lets a conciliation board decide.
- **Critic (not satisfied):** several "not X, it's Y" constructions ("neither a tool nor a project. It is …", "The point is not more data but …"); "in our experience" could be read as the vendor's experience given the author's employer; iFAKT section neutral and correctly disclosed, no sponsorship claim.

**Conflicts and decisions:** SEO wanted an extra FAQ for "How do you achieve operational excellence?"; the reader wanted fewer FAQs. Decision: put the phrase into the roadmap H2 instead of adding a 19th question. SEO and expert agreed to drop the German-only FAQ and replace it with "What is an example of operational excellence?" (PAA-style). The critic wanted to remove the cloud disambiguation as off-topic; SEO and the reader (M365 admin role) kept it because the AWS page ranks for the head term and m365.fm readers are IT-heavy. Decision: keep it as one short H3 with a link to the Azure sister guide.

### Changes in optimization 1 (old -> new)

- A3 size: "about 11 x 17 inches, close to US tabloid size" -> "297 x 420 mm, about 11.7 x 16.5 in., close to US ledger/tabloid size of 11 x 17 in." (text and glossary).
- H2 "Roadmap: implementing operational excellence in 12 months" -> "How to achieve operational excellence: a 12-month roadmap" (TOC and anchor updated).
- H2 "Common mistakes and how to avoid them" -> "Why operational excellence programs fail: common mistakes and fixes" (TOC, anchor and cross-reference updated).
- Key takeaway: "more than 30,000 US manufacturing plants" -> "about 35,000 US manufacturing plants".
- German sites: "the system cannot be introduced without the works council's agreement" -> "the employer cannot introduce such a system unilaterally; if the parties do not agree, a conciliation board (Einigungsstelle) decides [34]".
- Conclusion: "Operational excellence is neither a tool nor a project. It is an organization's ability …" -> "Operational excellence is an organization's ability …".
- Pillar 4: "The point is not 'more data' but the right data at the right time" -> "What counts is the right data at the right time, not the largest amount of it".
- "in our experience" (2x) -> "experience shows".
- Earlier draft decisions confirmed in the review: FAQ "operative Exzellenz" -> "What is an example of operational excellence?"; new FAQs "What are the 4 pillars", "What is an operational excellence framework"; safety KPI "accidents per 1 million hours / 1000-Mann-Quote" -> "TRIR × 200,000 hours (BLS/OSHA)", German rates kept as a conversion note; Mittelstand section -> small and mid-sized manufacturers with NAM/Census data and NIST MEP; BetrVG section -> labor relations for union and nonunion US plants plus German sites; Baldrige added to frameworks and comparison table; ISA-95 added next to ISO 22400; business case in fictional USD.

### Round 2 (after optimization 1)

- **Subject-matter expert: satisfied.** Methods, TPM, OEE and Shingo content are correct and complete; A3 size and US terminology fixed. Open only: VDI principles list (unchanged from German set).
- **SEO specialist: satisfied.** Head term in H1, short answer, meta and first paragraph; PAA questions covered by H2s and FAQ; hreflang pair and schema with `inLanguage: en-US` defined; article (13,000+ words) is clearly more complete than Smartsheet and KaiNexus without padding.
- **US reader: satisfied.** "After the key takeaways and the 30-day list I know what to do on Monday; the union and German works council parts tell me who to call before we put names on a Power BI board."
- **Fact checker: satisfied.** Conditions resolved; all [n] references match the source list (44 sources); German [unverified] items carried over (VDI principles, 85% OEE origin, implementation time). Open items documented in the editorial notes (primary NLRB decision, Baldrige category names, English EFQM names).
- **Critic: satisfied.** No AI clichés or em-dash chains found in a final scan; "not X but Y" constructions reduced to cases that carry content; iFAKT section stays factual, vendor claims labeled, disclosure exactly as required.

**Word count:** `wc -w` from H1 to the end of the Conclusion (including FAQ, glossary and tables): 13,130 words (German original: approx. 10,700).
