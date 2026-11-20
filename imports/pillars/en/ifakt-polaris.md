# SEO metadata

| Field | Value |
|---|---|
| Meta title | Value Stream Mapping Software: Buyer's Guide + iFAKT Polaris (60 characters) |
| Meta description | How to choose value stream mapping software: 5 tool categories, selection criteria, a checklist, and a sourced look at iFAKT Polaris and its limits. (148 characters) |
| Slug | `/en/learn/ifakt-polaris/` (full URL: https://www.m365.fm/en/learn/ifakt-polaris/) |
| Alternative | Merge the content into the existing entity page https://www.m365.fm/entity/polaris/ and grow it into the pillar. Recommendation (same as the German version): publish a separate pillar under `/en/learn/ifakt-polaris/` and keep the entity page as a compact fact page that links to the pillar. The entity page stays a neutral data source (knowledge-graph signal); the pillar serves the commercial-comparison intent. Canonical URL for the topic "iFAKT Polaris" in English: this pillar. |
| Main keyword | value stream mapping software |
| Secondary keywords | VSM software, value stream mapping tool, digital value stream mapping, value stream mapping simulation software, value stream management software for manufacturing, free value stream mapping software, value stream map template, iFAKT Polaris, Polaris VSM, Polaris BSM, Polaris IMS, production simulation software, advanced planning and scheduling (APS), product-process-resource (PPR) model, swimlane process mapping, digital twin of production |
| Search intent | Commercial investigation (buyers comparing tools for mapping, analyzing, simulating and planning value streams). Navigational share for "iFAKT Polaris" and "Polaris IMS". The US SERP for "value stream mapping software" is dominated by diagramming vendors and listicles; "People also ask"-style questions focus on the best tool, free options, Excel, Visio and the difference to process mapping (see competitive analysis). |
| Target word count | At least 9,000 words in the article (longest English competitor found: gitnux.org, approx. 4,500 words). **Actual `wc -w` H1..Conclusion: 11,566 words.** |
| Language version | `en-US`. hreflang pair: `en-US` https://www.m365.fm/en/learn/ifakt-polaris/ <-> `de-DE` https://www.m365.fm/learn/ifakt-polaris/ (plus `x-default` per site convention) |

# Competitive analysis (google.com SERP, November 2026)

Basis: US web searches on November 20, 2026 for "value stream mapping software", "best value stream mapping software for manufacturing 2026", "free value stream mapping tool" and "value stream mapping simulation software manufacturing", plus fetches of the top pages. Word counts are estimates from the fetched main body (navigation, footers and CTAs excluded); no SEO tool data were available for the US SERP.

| Page | Words (est.) | Type | Strengths | Gaps |
|---|---|---|---|---|
| gitnux.org "Top 10 Best Value Stream Mapping Software of 2026" [48] | approx. 4,500 | Listicle, labeled commissioned research, co-funded by assessed vendors | 10 tools, comparison table, selection section, red flags | no pricing, scores not explained, claims not linked to sources, mostly process/EA tools (ARIS, Signavio, LeanIX), no shop-floor data, simulation or APS |
| leandatapoint.com "7 Best Value Stream Mapping software for Manufacturing" [47] | approx. 3,000 | Vendor-written ranking (author founded the #1-ranked vendor) | manufacturing angle, criteria list, FAQ | ranks own product first, comparison table unsourced, no APS, no named ERP/MES connectors, no security standards |
| project-management.com "Top Value Stream Mapping Tools & Software" [50] | approx. 2,500 | Listicle | pricing notes | four of seven tools are DevOps value stream tools; no takt time, WIP or OEE; no FAQ |
| clickup.com "10 Value Stream Mapping Software" [49] | approx. 2,000 to 2,500 | Vendor listicle (vendor ranks itself first) | short criteria section | only diagramming/work-management tools, no manufacturing criteria, no ERP/MES, outdated dates in body |
| lucidchart.com VSM landing page [51] | approx. 700 | Product page, ranks at the top | five-step how-to, symbols | own product only, no calculation logic |
| en.wikipedia.org "Value-stream-mapping software" [46] | approx. 250 | Encyclopedia stub | names two basic types (drawing vs. calculation/analysis) | no examples, no criteria |
| creately.com, edrawsoft.com, conceptdraw.com, smartdraw.com | not counted (seen in result lists only) | Product pages | templates, free tiers | drawing only |
| ifakt.de/en (for "iFAKT Polaris") [1] | approx. 1,200 | Vendor page | modules, industries, certificates | benefit figures without methodology |

**Assessment:** The US SERP mixes three things that buyers should keep apart: diagramming tools, DevOps "value stream management" platforms and manufacturing tools. The two longest pages are a commissioned listicle and a vendor-written ranking. None of the pages separates static value stream calculations from dynamic simulation, none covers APS and MES as neighboring categories, none gives a vendor-neutral checklist with security questions US buyers ask (SOC 2, ISO/IEC 27001, data residency), and none ties product claims to sources. For "iFAKT Polaris" the results show only the vendor site and m365.fm entity pages; no detailed English-language review that lists modules, evidence and limits was found. This article covers both gaps: a neutral category comparison from drawing tools to APS and MES with a selection checklist, and a module-by-module description of Polaris in which every statement has a source and every gap is named.

---

# Value Stream Mapping Software for Manufacturing: A Buyer's Guide and an Evidence-Based Look at iFAKT Polaris

> **Note: The author works at iFAKT GmbH.**

*As of November 20, 2026 · Every product statement has a source; vendor claims are labeled as vendor claims.*

> **Short answer:** Value stream mapping software ranges from drawing tools with lean symbols, through dedicated VSM tools that calculate metrics, to simulation and planning systems. Which category you need depends on whether you want to document value streams, evaluate them regularly with data, simulate them over time, or turn them into schedules for the shop floor. Free drawing tools such as Lucidchart and Miro, and the Visio template, are enough for workshops; dedicated VSM tools pay off when you map regularly; simulation and APS are separate categories. **iFAKT Polaris** is a modular platform from iFAKT GmbH (Stuttgart, Germany) with seven modules: VSM (value streams), BSM (process swimlanes), Designer (product-process-resource model), Simulator, Optimizer (constraint-based scheduling), Operator (shop-floor tasks) and Analyzer (KPI dashboards). According to the vendor, the modules share one data model [3]. The author knows of no independent comparison tests of Polaris. What can be verified includes two Microsoft AppSource listings [15][16], second place in the Production category of the 2025 Best of Technology Award from the German business weekly WirtschaftsWoche for Polaris IMS [18], and a series of technical articles in the German engineering journal ZWF [21][22][23][24].

Anyone shopping for value stream mapping software runs into a vocabulary problem first. Under "value stream mapping software" or "value stream management software," vendors sell very different things: diagramming programs with a symbol library, lean tools with formulas, simulation systems, platforms for software delivery teams, and planning systems with a digital twin. Comparisons that mix these categories lead to bad purchases. A plant that maps its value stream once a year in a kaizen event needs something different from a high-mix manufacturer that schedules against tight capacity every week.

This guide therefore has two parts. **Part A** maps the market neutrally: what value stream mapping software has to do, which categories exist, how to compare them, and which mistakes are typical during selection and rollout. **Part B** describes iFAKT Polaris in detail, module by module, with the evidence from vendor pages, the Microsoft marketplace, technical literature and an award jury, and with a clear statement of what is not documented and who the product does not fit.

Because the author works at iFAKT GmbH, one simple rule applies to this text: every product statement has a source, vendor benefit claims are labeled as such and not treated as fact, and Part A is written to work as a decision aid even if you never read Part B.

### Key takeaways

- **Category before product:** Drawing tools, dedicated VSM tools, simulation software, APS systems and MES/BI solve different problems. Start with the question the software has to answer.
- **Drawing is rarely the bottleneck.** What matters is data connectivity, calculation logic, scenarios, the ability to model variability and product mix, and whether the analysis turns into actions and schedules.
- **Static value stream mapping works with averages.** Variability, product mix and shared resources call for simulation; due dates under constraints call for scheduling algorithms.
- **Free options exist** in the drawing category (Lucidchart, Miro, Creately and others) and, for two modules, at iFAKT Polaris [3]. Check user limits, export and data ownership.
- **iFAKT Polaris** covers, according to the vendor, the chain from value stream mapping through simulation and scheduling to shop-floor tasks and reporting [3]. The module pages list functions but no benefit figures with disclosed methodology.
- **Documented** are ISO 9001 certification since October 2014 [4], an ISO/IEC 27001 certification by TÜV SÜD stated on the website [1][3], hosting of VSM and BSM on Microsoft Azure West Europe (a region located in the Netherlands) according to the module pages [6][7][43], two AppSource listings [15][16] and the WirtschaftsWoche award [18].
- **Not documented** on the pages reviewed: a simulation function inside the VSM module, native Microsoft Teams or Power BI integration, a US hosting region, a SOC 2 report and public prices.

## Table of contents

**Part A: What value stream mapping software needs to do**

1. [Terms: value stream mapping, future-state design, value stream management](#1-terms-value-stream-mapping-future-state-design-value-stream-management)
2. [Why paper and Excel hit their limits](#2-why-paper-and-excel-hit-their-limits)
3. [The five categories of value stream mapping software](#3-the-five-categories-of-value-stream-mapping-software)
4. [Category comparison table](#4-category-comparison-table)
5. [How to choose value stream mapping software: criteria in detail](#5-how-to-choose-value-stream-mapping-software-criteria-in-detail)
6. [Selection checklist](#6-selection-checklist)
7. [Rollout in six steps](#7-rollout-in-six-steps)
8. [Common mistakes in selection and rollout](#8-common-mistakes-in-selection-and-rollout)
9. [A business case without invented numbers](#9-a-business-case-without-invented-numbers)

**Part B: iFAKT Polaris in detail**

10. [Background and method: from metrics to event data](#10-background-and-method)
11. [Platform principle: one data model, seven modules](#11-platform-principle-one-data-model-seven-modules)
12. [The modules one by one](#12-the-modules-one-by-one)
13. [Polaris IMS and the 2025 Best of Technology Award](#13-polaris-ims-and-the-2025-best-of-technology-award)
14. [Industries according to the company](#14-industries-according-to-the-company)
15. [Polaris in the Microsoft ecosystem](#15-polaris-in-the-microsoft-ecosystem)
16. [Security, hosting and certifications](#16-security-hosting-and-certifications)
17. [What the vendor promises and how to test it](#17-what-the-vendor-promises-and-how-to-test-it)
18. [Who Polaris fits and who it does not](#18-who-polaris-fits-and-who-it-does-not)
19. [FAQ](#19-faq)
20. [Conclusion](#20-conclusion)

---

# Part A: What value stream mapping software needs to do

## 1. Terms: value stream mapping, future-state design, value stream management

**Value stream mapping** (VSM) shows the material and information flow of one product family from supplier to customer with standardized symbols. Under each process box sit data such as cycle time, changeover time, uptime and shift pattern; between the process boxes sit inventories, converted into days of coverage. The timeline along the bottom shows how much of the total lead time is value-adding. In the US, the method is closely tied to *Learning to See* by Mike Rother and John Shook, published by the Lean Enterprise Institute, which walks through current-state mapping, future-state design and an implementation plan for a fictional plant, Acme Stamping; the workbook received a Shingo Research Prize in 1999 [41]. The full method with symbols, formulas and a worked example is in the m365.fm compendium [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned).

**Future-state design** uses the current-state map to design a target: continuous flow where possible; pull through supermarkets where flow is not possible; one pacemaker process that sets the pace; leveled production. Only the future state and an implementation plan turn the analysis into improvement. German practitioners often use the term *Wertstromdesign* for this step, after the standard German textbook by Klaus Erlach of Fraunhofer IPA [40].

**Value stream management** in manufacturing means managing the business along value streams on an ongoing basis: an accountable value stream manager keeps current and future state up to date, tracks metrics and actions, and repeats the analysis when product mix or demand changes. Since 2020 there is an international standard for this, ISO 22468:2020 "Value stream management (VSM)" [39]. A short introduction is the post [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

**An important distinction:** In software development, "value stream management" names a separate product category. These platforms measure the flow of work items through the software delivery pipeline, from ticket to deployment. If you search for "value stream management software" and mean a factory, look closely: on the US SERP, several listicles mix DevOps tools such as LinearB, Copado or Plutora with manufacturing tools [50]. Those platforms are not built for material, inventory and machines. This guide covers only value streams in manufacturing and in the business processes around it.

## 2. Why paper and Excel hit their limits

Value stream mapping began as a pencil-and-paper method, and for a first map that is still the right way. Someone who stands on the gemba (the place where value is created, meaning the shop floor) with a pencil and counts inventory understands the flow better than someone clicking through software. Still, the paper method runs into limits in four situations.

**First: the snapshot.** A classic value stream map shows one point in time. When presenting the German research project ECOWERT, Markus Böhm of Fraunhofer IPA (a German applied-research institute for manufacturing engineering) put it this way (translated from German): "Basically, value stream mapping is nothing more than a snapshot." According to the institute, many companies do it once a year at most [25]. When product mix, demand or shift pattern change, the map is out of date.

**Second: averages instead of distributions.** On paper, each process box carries one cycle time, not its variation. Breakdowns, changeover sequences and shared resources disappear into the average. One simulation vendor describes the difference this way: value stream simulation adds "time-dependent sequences, variation and shared resources" to the view (translated from German) [37]. Türck, Weimer, Schubert and Drees described this step from static analysis to dynamic simulation of value streams back in 2014 in ZWF, the *Zeitschrift für wirtschaftlichen Fabrikbetrieb*, a German journal for production engineering [22].

**Third: product variety.** The method looks at one product family. In high-mix, low-volume manufacturing, however, many variants with different routings run across the same resources. One map per variant is impractical; one map for all variants blurs the bottlenecks.

**Fourth: calculation effort and versions.** Takt time, days of inventory, lead time and flow ratio can be calculated in Excel, but every change to the map has to be carried over by hand. Several scenarios, several plants and several editors quickly produce competing file versions.

The order of the consequences matters. Software solves the first and fourth problems fairly easily, provided data are available. Only software that actually models variability and product mix solves the second and third. And no software replaces the team discussion about what the future state should look like.

## 3. The five categories of value stream mapping software

Wikipedia's short entry on value-stream-mapping software distinguishes two basic types: tools that help you draw the map and tools that perform calculations and analysis [46]. For a buying decision, a finer split into five categories helps more than a ranking of individual products. The examples below are neither complete nor recommendations; they show what kind of tool you can expect in each category. All product statements are based on the vendors' own pages or marketplace listings.

### 3.1 Drawing and whiteboard tools

**What they do:** They provide symbol libraries for value stream maps and let teams work together in the browser or on the desktop. Microsoft Visio includes a value stream map template; Microsoft's support article says the template needs Visio Professional (or the older Premium edition) and is not included in Visio Standard, and the article lists Visio Plan 2 under "Applies to" [27]. Lucidchart offers a VSM shape library in its free account [28]; Miro offers a set of value stream map templates on its whiteboard [29]. Creately, EdrawMax, SmartDraw and similar tools work the same way. Excel and PowerPoint templates also belong here.

**Strengths:** low entry barrier, good collaboration, often free entry tiers, familiar interface.

**Limits:** There is usually no calculation logic behind the symbols. Metrics are typed in by hand, scenarios are copies of the drawing, and there is no data connection to ERP or MES.

**Good for:** documentation, training, first kaizen workshops, distributed teams that need a shared view.

### 3.2 Dedicated value stream mapping tools (VSM software with calculation logic)

**What they do:** They combine lean symbols with calculation logic. Metrics such as days of inventory, lead time and value-added ratio are calculated automatically from process data, and scenarios can be compared side by side. Examples: eVSM, which its vendor describes as "a complete lean toolkit to map, model and improve value streams of every type" (marketplace listing with user-reported features such as mixed-model mapping and Excel import) [42]; SimVSM from SimPlan (Germany), whose base version supports digital value stream mapping "including static evaluations" (translated from German) [30] and calculates key figures such as cycle time, throughput and inventory automatically [31]; visTable (Germany), which links value stream and factory layout in one model and, according to the vendor, calculates lead times automatically from process, cycle and inventory data [32]; and Polaris VSM from iFAKT (see Part B).

**Strengths:** fewer calculation errors, quick scenarios, versioning, often built-in action tracking.

**Limits:** license costs, learning curve, and the calculation usually stays static: it works with averages, even when the data flow in automatically.

**Good for:** companies that do value stream work regularly and want to keep several value streams or plants comparable.

### 3.3 Simulation software

**What it does:** Discrete-event simulation models orders, resources, buffers, shifts and breakdowns over time. That answers questions a static map cannot: Where does the bottleneck appear with this product mix? Is the buffer big enough at this breakdown rate? What does an extra shift buy us? Well-known tools include Siemens Tecnomatix Plant Simulation, AnyLogic (multi-method modeling: agent-based, system dynamics and discrete-event) and FlexSim (discrete-event with 3D modeling) [34]. Some vendors connect value stream and simulation directly: Siemens offers a VSM library for Plant Simulation X with preconfigured value stream elements, scenario comparison and dynamic simulation of value streams that collects metrics such as cycle time, lead time, WIP and resource utilization [33]; in SimVSM Pro, scenarios can be simulated, for example to evaluate measures or identify bottlenecks [31].

**Strengths:** variability, product mix and shared resources become visible; investments can be tested before you commit.

**Limits:** building and validating a model takes time and expertise. Classic simulation projects are often one-off studies whose model is not maintained after the decision.

**Good for:** capital and layout decisions, high-mix manufacturing, capacity questions with high uncertainty.

### 3.4 APS systems (advanced planning and scheduling)

**What they do:** APS systems create detailed schedules under constraints: machine and labor capacity, skills, changeover sequences, material availability and due dates. Siemens describes Opcenter Scheduling as creating "production schedules based on availability of resources, constraints and materials required by the order" [36]. A detailed overview is in the compendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned).

**Strengths:** realistic, executable schedules instead of rough-cut planning against infinite capacity; fast rescheduling after disruptions.

**Limits:** high demands on master data quality (routings, times, resources), integration effort with ERP and MES, acceptance among planners.

**Good for:** companies with scarce, shared resources, many variants and delivery pressure.

### 3.5 MES, process mining and BI

**What they do:** Manufacturing execution systems record actual data from the shop floor; BI tools and data-driven analytics evaluate them. Some vendors reconstruct value streams automatically from that data. ONIQ, offered through the PwC Store in Germany, states that feedback data from production IT systems "(e.g., MES, PDA, PPS, IIoT)" can be transferred into a digital value stream twin "without manual mapping" [35] (PDA is production data acquisition; PPS is the German term for production planning and control systems).

**Strengths:** actual data instead of estimates, continuous rather than one-off analysis.

**Limits:** the result is only as good as the feedback data; future state and schedules do not appear automatically. An MES does not replace value stream mapping; it feeds it data.

**Good for:** plants with a good data foundation that want to watch deviations and trends continuously. More on metrics in the compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned); on daily shop-floor routines in the compendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned).

### 3.6 Platforms that span several categories

Some vendors combine several of these categories in one product, such as value stream and layout (visTable [32]), value stream and simulation (SimVSM Pro [31], Plant Simulation X VSM library [33]) or value stream, simulation, scheduling and execution (iFAKT Polaris, according to the vendor [3]). The advantage is data continuity: what you capture during mapping does not have to be re-entered for simulation. The drawback: in each single category a specialist tool can go deeper. With platforms, check every category separately against your requirements instead of treating breadth as quality in itself.

## 4. Category comparison table

| Criterion | Drawing/whiteboard | Dedicated VSM tool | Simulation software | APS system | MES / process mining / BI |
|---|---|---|---|---|---|
| Main question | What does the flow look like? | Where are the waste and the levers? | How does the system behave over time? | Who does what, when? | What actually happened? |
| Lean symbols | yes (templates) | yes, with logic | partly (VSM libraries) | no | rarely |
| Automatic metrics | no | yes (static) | yes (dynamic, as distributions) | plan metrics (due dates, utilization) | actual metrics |
| Variability and breakdowns | no | mostly no | yes | partly (rescheduling) | visible after the fact |
| Product variety | weak | medium | good | good | good (actual data) |
| ERP/MES data connection | no | optional | import, usually per project | required | required |
| Output | drawing | map with metrics, scenarios | scenario evaluation | executable schedule | reports, dashboards |
| Typical effort | low | low to medium | medium to high | high | high |
| Typical users | lean coaches, kaizen teams | value stream managers, industrial engineers | simulation engineers, facility planners | production planners, schedulers | plant management, IT, finance |

The table describes typical profiles. Individual products can differ, and platforms cover several columns. For your decision, what counts is which column answers your most important question.

### Quick decision guide

- **You want to document value streams for workshops and training** and map them once a year at most: a drawing tool with a template is usually enough.
- **You do value stream work regularly**, compare several value streams or plants and want metrics without spreadsheet upkeep: a dedicated VSM tool.
- **Your bottlenecks move with the product mix**, or you need to justify an investment in equipment, people or buffers: simulation, ideally on a model that is maintained after the study.
- **Your problem is due dates**, because many orders compete for scarce machines, tools and skills: an APS system.
- **You do not know what actually happens on the shop floor**, because confirmations are missing or unreliable: data collection first (MES, machine data collection), then analysis.
- **Several of these apply:** look at platforms that connect several categories on one data model, and compare each category with a specialist tool.

## 5. How to choose value stream mapping software: criteria in detail

### 5.1 Data connection to ERP, MES and the shop floor

The most important question is: where do the data come from, and how often? A tool that only knows manual input stays a snapshot. A tool that cannot start without an ERP integration delays any benefit by months. A good solution starts without integration and can pull in data later. Ask specifically about import formats (Excel, CSV), standard connectors to your ERP system (SAP, Microsoft Dynamics 365, Epicor, Infor, Oracle or whatever you run), interfaces to MES and machine data collection, and the option to connect machine data through an IIoT gateway (common protocols are OPC UA, MTConnect and MQTT). Also settle who builds and maintains the interface: the vendor, a partner or your own IT team.

### 5.2 Calculation logic and metrics

Check which metrics the tool calculates and whether the formulas are visible. Takt time (available time divided by customer demand), days of inventory, lead time, value-added ratio (often reported as process cycle efficiency, PCE), OEE and flow ratio should be traceable. Custom metrics and formulas matter because every plant keeps its own definitions. Software whose results nobody can recalculate loses the first argument with finance.

### 5.3 Dynamics and simulation

This is the key distinction: does the tool calculate with averages, or does it simulate operations over time? Many vendors call a scenario comparison "simulation" even though only the static metrics of two variants are compared. Ask whether variability, breakdowns, shift patterns, product mix and shared resources are modeled over time, and what comes out: averages, distributions, utilization time series. With stochastic inputs (breakdowns, variable times), the software should be able to evaluate several replications; a single run is just one possible outcome, not a reliable result.

### 5.4 Product variety and product structure

When many variants run across the same resources, the model needs bills of materials, routings and resource assignments, not just process boxes. Check whether the tool models products, processes and resources separately and links them (often called a product-process-resource model, PPR for short) and whether it accounts for sequence-dependent changeover times between variants.

### 5.5 From analysis to execution

Much of the value is created after the analysis. Ask whether actions, kaizen cards, owners and due dates are managed in the same tool, whether a PDCA cycle can be documented, and whether a future state can turn into a schedule for the shop floor.

### 5.6 Collaboration and governance

Roles and permissions (read, edit, administer), version history, multi-tenancy for several plants or legal entities, concurrent editing and an audit trail of changes are mandatory as soon as more than one team uses the tool.

### 5.7 Microsoft integration

Many US manufacturers run Microsoft 365 and Microsoft Entra ID (formerly Azure Active Directory), and some use Dynamics 365 as their ERP system. Relevant questions are: Does the software support single sign-on with your identity provider? Is there a standard connector to Dynamics 365, or only a file import? Can metrics be exported to your BI tool, such as Power BI? Can you buy the solution through Microsoft AppSource or Azure Marketplace? A listing on AppSource means the solution is offered in the Microsoft marketplace; on its own it says nothing about how deep an integration goes.

### 5.8 Hosting, data protection and information security

Production data contain capacities, costs, customer orders and suppliers. Settle where the data live (region, data center operator), how tenants are separated and which attestations the vendor can show. For US buyers, four points are worth asking about:

- **Data residency.** Ask in writing which cloud region hosts your data. If the vendor hosts only in the EU, check whether that fits your customer contracts and internal policies. If your value stream data include technical data controlled under ITAR or EAR (common in aerospace and defense), involve your export-compliance team before you put those data into any cloud service.
- **Attestations.** Many US security teams ask for a SOC 2 report, an audit under the AICPA's criteria for controls relevant to security, availability, processing integrity, confidentiality or privacy [45]. The international alternative is an ISO/IEC 27001 certification, which shows an audited information security management system. Either can be acceptable; ask for the certificate with scope and expiry date, or for the report itself. What matters is whether development and operation of the software sit inside the scope.
- **Your own risk framework.** NIST's Cybersecurity Framework 2.0, released on February 26, 2024, is meant for organizations of every size and sector and added a "Govern" function to Identify, Protect, Detect, Respond and Recover [44]. You can use it to structure your own vendor reviews.
- **EU data protection law.** With a European vendor you will often see references to the GDPR, the EU's General Data Protection Regulation, and a data processing agreement (DPA). A DPA under the GDPR is a contract about how the vendor processes personal data on your behalf; in production tools that is mostly user accounts and names. It is not a security certification.

### 5.9 Cost, trial and support

Ask about the license model (per user, per plant, per module), a free tier or trial, training and implementation effort, and consulting from the vendor or a partner. For US buyers of a foreign vendor, also ask about support hours in your time zones and whether there are US-based implementation partners. Many vendors in this market do not publish prices; that is common but makes comparison harder. Request a written quote for total cost over three years, including integration.

## 6. Selection checklist

**Question and scope**
- [ ] The main question is written down (document, evaluate, simulate, schedule or monitor).
- [ ] The matching category from Section 3 is chosen.
- [ ] A pilot area with one product family and a measurable target is named.

**Data**
- [ ] You can start without system integration.
- [ ] Excel/CSV import has been tested with your own data.
- [ ] The connection to your ERP and MES is described (standard connector or project).
- [ ] Ownership of interface operation is settled.

**Functionality**
- [ ] Metrics and formulas are visible and can be adapted.
- [ ] Scenarios can be versioned and compared.
- [ ] Dynamics (variability, breakdowns, product mix) are modeled, if you need them.
- [ ] Variants, bills of materials and changeover sequences can be modeled, if you need them.
- [ ] Actions and PDCA are tracked in the tool.

**Operations and security**
- [ ] Hosting region and data center operator are confirmed in writing.
- [ ] A SOC 2 report or an ISO/IEC 27001 certificate with scope is available.
- [ ] A data processing agreement is available, where personal data are involved.
- [ ] Export-control questions (ITAR/EAR) are cleared, if relevant.
- [ ] Single sign-on and the role model fit your IT.

**Economics**
- [ ] Total cost over three years including integration and training is known.
- [ ] Benefit hypotheses are backed by your own baseline values (see Section 9).
- [ ] You have spoken with a reference customer from your industry.

## 7. Rollout in six steps

**Step 1: Set the goal and the pilot area.** Pick a product family with a noticeable problem, such as long lead time or poor on-time delivery, and a measurable target. A pilot across all plants at once usually fails on coordination.

**Step 2: Map the current state on the gemba.** Go to the shop floor, count inventory, ask about times. The software is for capturing the data, not a substitute for looking.

**Step 3: Enrich the data.** Add data from ERP, MES or machine data collection to the walk-through, first as a file. Differences between what you observed and what the systems say are a result in themselves: they show where master data are wrong.

**Step 4: Develop the future state and scenarios.** Work out a future state as a team and compare variants. If variability or product mix matter, test the variants with a simulation.

**Step 5: Implement and track actions.** Turn the future state into actions with owners and due dates. If the solution covers scheduling and execution, test in the pilot area whether schedules hold on the shop floor.

**Step 6: Sustain and roll out.** Decide who maintains the value stream, how often metrics are reviewed and when the analysis is repeated. Only then is a rollout to more value streams worth it.

## 8. Common mistakes in selection and rollout

- **Tool before method:** If your team has not mastered value stream mapping, software only helps it draw wrong maps faster. Train the method first.
- **Mixing up categories:** A drawing tool is bought when scheduling questions are on the table, or an APS system when nobody knows the value stream yet.
- **Mistaking scenario comparison for simulation:** Two static maps side by side do not show bottlenecks that only appear through variability.
- **Underestimating data quality:** Routings with outdated times produce unrealistic results in any software. Plan time for master data cleanup.
- **Forcing integration too early:** A months-long interface project before the first result costs support. Start with file import.
- **Adopting vendor benefit figures:** Percentages such as "up to 50 percent shorter lead time" describe individual cases under unknown conditions. Such figures are common across the market, from APS suites to VSM tools (Section 17 has examples). Calculate with your own baseline values.
- **Nobody owns the value stream:** Without a value stream manager, the best digital map goes stale just like the brown paper.
- **Leaving the shop floor out:** Schedules and tasks that operators do not understand or cannot confirm stay theoretical.

## 9. A business case without invented numbers

A credible business case for value stream mapping software rests on your own baseline values, not on percentages from brochures. The logic can be split into five levers and three cost blocks.

**Lever 1: inventory and lead time.** By Little's Law, in steady state: work in process = throughput × lead time. If you cut lead time at constant throughput, you cut tied-up inventory in the same proportion. Calculate with your current WIP, your cost of capital and a target hypothesis the project team can defend.

**Lever 2: on-time delivery.** Late deliveries cost contractual penalties, expedited freight, rush orders and customer trust. Record today's on-time delivery and the directly attributable cost of late orders over the past year.

**Lever 3: capacity and avoided capital spending.** If a simulation shows that an apparent bottleneck can be solved through sequencing or buffers, an investment falls away. This lever is often the largest, but it is one-time and only counts if the investment was actually planned.

**Lever 4: planning and analysis effort.** Count the hours spent today on value stream walks, spreadsheet upkeep and manual scheduling. Value the savings cautiously: freed-up time is a benefit only if it is used for something else.

**Lever 5: decision quality.** Hard to quantify but real: bad investments that are not made, and product-mix decisions that are tested beforehand. List this lever qualitatively instead of filling it with invented numbers.

**Costs:** (1) licenses or subscriptions over the planned term, (2) implementation including data preparation, interfaces, training and consulting, (3) internal time for the pilot, master data upkeep and ongoing value stream ownership.

**How to proceed:** For each lever, set a baseline, a conservative and an expected target hypothesis, and calculate both scenarios against the costs. The pilot exists to test the hypotheses with real data. A vendor willing to agree on a pilot with measurable criteria is more trustworthy than one that quotes benefit figures without methodology.

---

# Part B: iFAKT Polaris in detail

> **Note: The author works at iFAKT GmbH.**

The following sections describe [iFAKT Polaris](https://www.m365.fm/entity/polaris/) based on the product pages of [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) (English and German, retrieved November 20, 2026), the Microsoft AppSource listings, a Microsoft Tech Community post, the WirtschaftsWoche award pages and the technical literature. Where a statement comes only from the vendor, the text says so. The author knows of no independent comparison tests or analyst evaluations of Polaris.

## 10. Background and method

iFAKT GmbH is headquartered at Curiestrasse 2, 70563 Stuttgart, Germany (commercial register: Stuttgart Local Court, HRB 22661) [5]. Its English company page says the offices are close to Stuttgart Airport [4]. According to the company, it has worked on optimizing production and business processes for more than 25 years [3]. The company page lists automotive, aerospace, mechanical engineering and medical technology as industries [4].

For judging Polaris, the company history matters less than the methodological thinking behind the software. Here there is a verifiable trail: Jörg Drees, listed with the affiliation iFAKT GmbH in the 2023 ZWF article [24], published several articles with co-authors in ZWF between 2011 and 2023, most recently together with Fraunhofer IPA. ZWF (*Zeitschrift für wirtschaftlichen Fabrikbetrieb*) is a German-language engineering journal whose archive is now hosted by De Gruyter Brill; the titles below are translated, and the original German titles are in the sources. The articles trace a path that shows up in the module structure of Polaris.

| Year | Article (translated title) | Authors | Reference | Link to Polaris |
|---|---|---|---|---|
| 2011 | Production optimization through value stream modeling metrics | Jörg Drees, Christoph Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [21] | metric calculation in the value stream (VSM) |
| 2014 | Dynamic simulation of value streams | Stefan Türck, Andreas Weimer, Lars Schubert, Jörg Drees | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [22] | step from static analysis to simulation |
| 2018 | New perspectives for the value stream method: Value Stream Management 4.0, Next Generation | Jörg Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [23] | value stream method and software for connected production (Industry 4.0, IIoT) |
| 2023 | A universal data interface for digital value stream services | Markus Böhm, Jörg Drees, Brandon Sai, Klaus Erlach, Steffi Stambera, Tim Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [24] | event data from machines as a common data basis for value stream services |

**2011: metrics.** Drees and Sack describe how metrics from value stream modeling can be used to optimize production [21]. That is the core of a dedicated VSM tool: symbols with calculation logic behind them.

**2014: dynamics.** According to its abstract, the article by Türck, Weimer, [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) and [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) starts from the view that value stream modeling is moving from a static look at value streams and metrics toward dynamic simulation, and asks what new options including time opens up for production optimization [22]. This idea lives on in the Simulator module, which, however, works on the product-process-resource model of the Designer rather than on the value stream map (Section 12).

**2018: connectivity.** Drees asks how the value stream method and its software need to evolve now that Industry 4.0 and IIoT connect information across the plant [23].

**2021 to 2023: real-time data with Fraunhofer IPA.** In the research project ECOWERT (German acronym for "real-time value stream analysis for sustainable production optimization"), Fraunhofer IPA worked with iFAKT GmbH on software that queries and displays production data from ERP systems and other sources automatically and close to real time. The German state of Baden-Württemberg funded the one-year project, which ran until August 31, 2022, with about EUR 300,000 from its Invest BW program; ESB Business School at Reutlingen University helped build a demonstrator [25]. A trade article by Drees, Stambera and Böhm describes the technical path: machine data in JSON format through an IIoT gateway (it names OPC UA, MTConnect, IO-Link and MQTT; the project used MQTT with Sparkplug), a time-series database, and the link to the value stream application Polaris VSM, which calculates metrics through a KPI tree for selected periods and product families [26]. The 2023 ZWF article generalizes this approach into a universal data interface; according to the authors, a value stream service for metric calculation and visualization was connected within ECOWERT [24]. The authors include Klaus Erlach of Fraunhofer IPA, author of the standard German textbook on value stream design [40].

**What this trail proves and what it does not:** The publications show that the authors have worked on metrics, simulation and data connectivity for value streams for a long time, and that a research institute collaborated with iFAKT. They do not show that today's software is better than others. Fraunhofer IPA does not rate any product in its press release either; it describes a research project, and according to the institute the apps at that time made "no suggestions yet" (translated from German) [25].

Value stream mapping with live data and a continuous data model is also the subject of the podcast episode [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) on m365.fm.

## 11. Platform principle: one data model, seven modules

According to the vendor's FAQ, Polaris is a modular smart factory software platform that covers production optimization from value stream mapping through simulation and AI-supported scheduling to shop-floor execution and reporting [3]. The website names seven modules: VSM, BSM, Designer, Simulator, Optimizer, Operator and Analyzer. According to the vendor, all modules work with the same data model, so simulation or scheduling can be added later without collecting the data again [3]. The vendor describes the flow as a loop: "Map → Simulate → Optimize → Execute → Analyze" [3].

On its English home page, iFAKT sums up the offering this way: "Polaris combines ERP data with a manufacturing digital twin to optimize schedules" [1]. Listed core features are "Constraint-based scheduling (resources, skills, shifts, buffers)", "What-if simulation for disruptions and mix changes" and a "KPI cockpit: lead time, WIP, utilization, OTD" [1]. The page highlights three principles: connecting ERP, Excel or shop-floor data or starting with a lean model ("plug and play"), one platform for mapping, simulation, scheduling and execution without switching tools, and modeling complexity such as product mix, changeovers, skills, shifts, operation sequences, buffers and disruptions [1][2].

For getting started, the FAQ names two paths: the VSM and BSM modules are available in a free tier without a credit card; for Simulator, Optimizer and Operator the vendor offers a personalized demo and trial [3]. You do not have to adopt every module; according to the vendor, many companies start with VSM because it needs no system integration [3]. For simulation and scheduling, the FAQ gives a typical onboarding time of two to four weeks, including data integration, model configuration and training [3]. That duration is a vendor claim; in practice it depends heavily on master data quality and interfaces.

To understand the architecture, it helps to map the modules to the categories from Part A:

| Module | Category from Part A | Data basis according to the vendor | Output |
|---|---|---|---|
| VSM | dedicated VSM tool | manual capture, optionally ERP, MES, machine data collection, data warehouse [6] | value stream map with metrics, scenarios |
| BSM | process modeling (swimlanes) | manual modeling [7] | process map with timeline and metrics |
| Designer | modeling (PPR graph) | ERP data, bills of materials, process times, resources [8] | product-process-resource model, network diagram |
| Simulator | simulation | PPR model from the Designer [9] | utilization, bottlenecks, scenarios over time |
| Optimizer | APS | PPR model, ERP data, resource availability [10] | executable production schedule |
| Operator | shop-floor execution | schedule from the Optimizer [11] | tasks per worker, confirmations |
| Analyzer | BI / metrics | metrics from all modules [12] | dashboards, plan vs. actual |

For a classification as a business application in the m365.fm taxonomy, see the entity page [Business Application](https://www.m365.fm/entity/business-application/).

## 12. The modules one by one

### 12.1 Polaris VSM: digital value stream mapping

**Purpose:** [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is the module for value stream mapping. Microsoft's post about the AppSource listing describes it as a "digital lean management tool" that manufacturers use to map supply chains and value streams; a formula system and Kanban and Kaizen boards are meant to calculate, check and display KPIs, and teams can work together remotely [17].

**Functions according to the vendor page** [6][14]:
- import from ERP, MES, machine data collection and data warehouse systems via the Polaris IIoT Gateway, combinable with manual observations on the shop floor
- automatic calculation of "25+ standard VSM KPIs," including lead time, value-added ratio, inventory, OEE and takt vs. cycle time; custom metrics and formulas possible
- "50+ predefined Lean symbols" with editor and color coding
- three hierarchy levels: end-to-end value stream (Level 1), sub-processes (Level 2), detailed operations (Level 3)
- "Unlimited scenario creation (A, B, C, D…)," sensitivity analysis and side-by-side metric comparison; value streams can be duplicated to test changes without touching production
- roles Admin, Editor and Viewer in a multi-tenant architecture, concurrent editing, version history, change tracking and PDCA documentation of actions
- "Multi-format export (JPEG, Excel, SVG)" plus encrypted export for archiving
- support labeled "AI-Support" in the reports and dashboards area, without further description

**Evidence outside the vendor site:** AppSource listing [15][17]; use as the value stream application linked to a time-series database in the trade article on automatically captured value stream data [26].

**Vendor claims without methodology:** "Complete VSM in 2-4 hours (vs. 2-3 days brown paper & Excel)," "100% data accuracy (no manual Excel errors)" and a "30-40% implementation risk reduction" [6]. The product page also speaks of completing value stream projects in a third of the time [14]. None of these claims comes with a methodology. "100% data accuracy" can sensibly refer only to eliminating transcription errors, not to the quality of the input data.

**Limits and what is not documented:** The VSM page describes scenarios and sensitivity analysis but **no dynamic simulation** in the sense of Section 5.3 [6]. If you want to study variability, breakdowns or product mix over time, you need the Simulator or another simulation tool. The page does not mention Microsoft Teams or Power BI integration. Prices are not published; according to the FAQ, VSM is available in a free tier [3], whose scope the module page does not describe.

**Further reading:** compendium [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned) · post [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)

### 12.2 Polaris BSM: business processes as swimlanes

**Purpose:** [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) (Business Swimlane Modeling) applies the value stream view to business processes such as quoting, engineering, manufacturing engineering or order processing (lean practitioners in the US often call this office or transactional value stream mapping). The AppSource listing describes it as a "Digital business process modeling tool for business process analysis in digital lean management" [16].

**Functions according to the vendor page** [7]:
- pools as organizational containers, lanes for roles, skills or departments, which can be shown or hidden
- modeling of data objects, data stores and IT systems; media breaks between paper and digital or between systems become visible
- a timeline with activity durations on the critical path plus lead and lag times
- an operator balance chart (stacked bars of cycle-time shares) to spot imbalances
- automatic calculation of critical path, lead time, cycle time and value-added ratio; according to the page "10+" standard process metrics and custom metrics
- classification as value-adding or non-value-adding, quantification of waste costs
- unlimited scenarios (current, future, alternatives) with impact analysis
- kaizen cards created while modeling and linked to activities, organized in PDCA or DMAIC cycles

**Plans according to AppSource** [16]: P0 "Read Only" (read all content), P1 "Basic" (BPMN recordings, swimlane templates, basic formulas, lead time, balance chart, quick-edit view), P2 "Excellence" (all features from P0 and P1) and P3 "Integrate & Customize" (no description). The listing gives no prices.

**Limits and what is not documented:** The module page names no notation standard; only the AppSource listing mentions BPMN recordings in plan P1 [7][16]. Whether BSM models can be imported or exported in BPMN-compliant form is not documented. The BSM page does not name export formats. If you are looking for a full BPM suite with process execution (a workflow engine), BSM is, by its description, an analysis and improvement tool, not process automation.

### 12.3 Polaris Designer: the product-process-resource model

**Purpose:** According to the vendor, the [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) turns input data into a structured product-process-resource knowledge graph (PPR knowledge graph) that serves as the shared basis for simulation and optimization [8]. It is the link between the value stream view and the simulation and scheduling modules.

**Functions according to the vendor page** [8]:
- PPR modeling: product as manufacturing or engineering bill of materials (MBOM/EBOM), process with setup, machine and handling times, resources as stations, teams and zones
- input data: ERP data, manufacturing BOMs, process times, resource structures and constraints
- automatic generation of a network diagram from the production logic, critical path calculation
- what-if scenarios and comparison of current and optimized lead time
- product-based zones that group processes by product family and support capacity balancing

**Assessment:** For the variant problem described in Section 5.4, a PPR model is generally better suited than a value stream map, because variants are represented through their BOMs and routings rather than individual process boxes. The home page uses the term "digital twin" for this model [1]; for the different meanings of "digital twin," see the compendium [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned).

**Limits and what is not documented:** The page names no import formats or import mechanism, no quantitative results and no explicit variant configuration (such as rule sets for configurable products) [8]. How constraints are modeled in the graph remains open.

### 12.4 Polaris Simulator: scenarios over time

**Purpose:** According to the vendor, the [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) runs the Designer's network diagrams through configurable station, line and hall (building-level) models, for single and multiple lines [9].

**Functions according to the vendor page** [9]:
- simulation based on the real process logic from the PPR model
- scenarios for capacity, staffing and buffers
- analysis of dynamic product mixes on shared resources
- detection of bottlenecks and utilization imbalances over time
- time-based utilization of people and technical resources, over- and under-utilization
- capacity transparency across shifts and scenarios
- flexible configuration of stations and production routes

**Assessment:** The module therefore covers the questions that Part A assigns to the simulation category, especially product mix and shared resources. A customer quote on the home page (Everllance) says: "The Polaris simulation helped us identify problems in our planning data" [1]; that is a single quote on the vendor's site, not a study.

**Limits and what is not documented:** The page does not state the simulation type explicitly (such as discrete-event), does not define output metrics such as throughput or WIP in detail, and gives no information on stochastic inputs such as breakdown distributions [9]. Whether results are reported as distributions or single values is not described. For conveyor systems, robotics or virtual commissioning, the specialist tools from Section 3.3 are the intended choice; Polaris does not describe itself as a 3D material-flow simulator.

### 12.5 Polaris Optimizer: scheduling under constraints

**Purpose:** According to the vendor, the [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) turns the PPR graph into an executable, optimized production schedule based on ERP data and resource availability [10]. It corresponds to the APS category.

**Functions according to the vendor page** [10][13]:
- consideration of resources, shifts, zones, skills and capacities; order priorities set by planners
- scheduling of machines, workers and tools
- display of late orders and delivery risks
- lot sizing per variant and machine, sequencing by changeover times between variants
- trade-off between inventory, storage cost and service level
- confirmations from the shop floor through the Operator, automatic re-optimization after disruptions with impact analysis
- resources shared across projects
- short-term operational scheduling and long-term capacity outlook

According to the FAQ, Polaris uses "constraint-based optimization algorithms" to generate schedules that account for machine capacity, worker skills, shifts, materials and due dates [3]. The planning and execution page also names multi-resource constraints, changeover sequences and priority-based scheduling; for testing, data can be imported by file, Excel or ERP export, and in production there is continuous synchronization with ERP, MES or other systems [13].

**Vendor claims without methodology:** The planning page cites 50 percent shorter lead time, 40 percent capacity optimization and up to 80 percent less manual planning effort [13]; the Optimizer page speaks of minimal lead time and maximum cost efficiency at the click of a button and a considerable reduction in changeover time [10]. Baseline, sample and measurement method are not given.

**Limits and what is not documented:** The Optimizer is described as AI-supported (the planning page is titled "AI-powered production planning and scheduling"), without naming algorithms or methods [10][13]. The module page gives no concrete details on ERP integration; the FAQ mentions standard interfaces to SAP and Microsoft Dynamics [3]. Multi-plant or supply chain planning is not described. More context in the compendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned).

### 12.6 Polaris Operator: tasks for the shop floor

**Purpose:** According to the vendor, the [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) takes the optimized schedule straight from the Optimizer and presents it at task level on the shop floor [11].

**Functions according to the vendor page** [11]:
- an individual, current task view per worker
- a critical-path view for shift leads
- work instructions embedded in tasks
- pausing or blocking tasks, or flagging them with structured feedback
- real-time confirmations of progress, delays, disruptions, actual staffing and breaks
- a live overview of work in progress for planners
- production data fed back into scheduling

**Assessment:** The Operator is designed as the return channel between plan and execution: a schedule is only as good as the feedback on whether it held on the shop floor. Functionally it overlaps with parts of an MES (work queue, confirmations), but it does not describe itself as an MES.

**Limits and what is not documented:** The page names no supported devices and no performance metrics [11]. The relationship to an existing MES (complementary, replacing, parallel) is not described; settle this early in a project to avoid duplicate confirmations. More on daily shop-floor routines in the compendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned).

### 12.7 Polaris Analyzer: KPI dashboards

**Purpose:** According to the vendor, the [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) brings metrics from all Polaris modules together in dashboards [12].

**Functions according to the vendor page** [12]:
- central metrics across all Polaris modules
- visualization of lead times, utilization, bottlenecks and project status
- comparison of scenarios, schedules and actual performance
- detection of capacity limits and improvement potential

**Limits and what is not documented:** The page names no data sources outside the Polaris modules, no dashboard types and no connection to external BI tools such as Power BI [12]. If your company runs a central BI system, clarify how metrics get there. Metric definitions are covered in the compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned).

### 12.8 Overview: what is documented per module

| Module | Function description on ifakt.de | External evidence | Benefit figures with methodology | Most important open question |
|---|---|---|---|---|
| VSM | detailed [6][14] | AppSource [15], Tech Community [17], trade article [26] | no | scope of the free tier |
| BSM | detailed [7] | AppSource with plans [16] | no | notation, export |
| Designer | medium [8] | journal articles on the approach [22][24] (indirect) | no | import formats, variant logic |
| Simulator | medium [9] | WirtschaftsWoche award for Polaris IMS [18] (indirect) | no | simulation type, stochastics |
| Optimizer | detailed [10][13] | WirtschaftsWoche award for Polaris IMS [18] (indirect) | no (figures without methodology) | algorithms, ERP integration |
| Operator | medium [11] | WirtschaftsWoche award for Polaris IMS [18] (indirect) | no | devices, MES boundary |
| Analyzer | brief [12] | none | no | external BI connection |

## 13. Polaris IMS and the 2025 Best of Technology Award

Besides the seven module names, you will come across the name **Polaris IMS**. Under this name, iFAKT GmbH entered the 2025 Best of Technology Award of WirtschaftsWoche, a German weekly business magazine. On WirtschaftsWoche's winners page, iFAKT with Polaris IMS (described there as a production planning system) is listed in **second place in the Production category**, behind Skeleton Technologies and ahead of OMRON Electronics [18]. Other finalists in the category were remberg and UNWARE [19].

The jury description (in German) calls Polaris IMS an intelligent system that builds a digital twin of production and plans the efficient use of resources automatically; the plan is executed on the shop floor and monitored with real-time data, and when disruptions occur, AI proposes improvements [18][19]. In the author's assessment, this corresponds functionally to the interplay of Designer, Simulator, Optimizer and Operator. A customer quote on the home page (Silhouette) also uses the name: "The use of Polaris IMS was the next step towards the Smart Factory for our organization" [1]. On the sponsor page of the lean event Lean Around The Clock 2025, iFAKT describes itself with a "POLARIS suite" made up of the modules IMS, BSM and VSM [20].

**Interpretation:** Based on these sources, IMS is the name for the part of the platform that goes beyond value stream and process modeling, meaning modeling, simulation, scheduling and execution. The current website splits this part into individual modules and uses the IMS name only in the customer quote [1]. The vendor has not published an official mapping of IMS to today's module names; the mapping is the author's interpretation.

**What the award says:** The Best of Technology Award is a jury prize from a business publication. It shows that a jury rated the concept highly among the entries in the Production category. It is not a functional or performance test and does not replace a test with your own data. For US readers: it is a prize from a German publication judged among its entries, so treat it as one data point, not as a market endorsement.

## 14. Industries according to the company

The following information comes from the iFAKT GmbH website. It is self-reported; the scope and duration of each customer relationship are not stated.

| Industry per ifakt.de | Description on the website | Companies named (logos, references, quotes) |
|---|---|---|
| Aerospace and aviation | high precision for the aerospace industry [2] | Airbus [1] |
| Automotive and mobility | just-in-time and just-in-sequence production from component manufacturing to final assembly [2] | Magna, Vitesco, ZF, Junghans [1] |
| Mechanical engineering and automation | engineer-to-order to small batches, BOMs and variant manufacturing [2] | Karl Dungs, Pfannenberg, Weidmüller, GRASS [1] |
| Energy and infrastructure | production planning for critical infrastructure [2] | MAN Energy, Siemens Energy, Liebherr [1] |

The logo bar on the English home page also shows FFG, Fraunhofer, Helbling, Jumo, Liebherr, Pfannenberg, Silhouette, Airbus, Dungs and Eismann [1]. Quotes come from Silhouette, Airbus and Everllance [1], and on the VSM product page additionally from Siemens Energy about coaching by iFAKT [14]. The company page also lists medical technology as an industry [4]. The FAQ says Polaris is "built for manufacturing companies in aerospace, automotive, mechanical engineering, and energy" and names production managers, lean consultants and operations teams as intended users [3].

**What you can infer:** The focus is on discrete manufacturing and assembly with high variety and complex products. For process industries (chemicals, pharma, food with recipes and batches), the vendor names no references. The named customers are mostly European companies or European sites of international groups; the pages reviewed do not name US plants as references.

## 15. Polaris in the Microsoft ecosystem

For companies that rely heavily on Microsoft, the following points are documented:

- **AppSource listings:** Polaris VSM ("Polaris VSM - Digital Value Stream Mapping") and Polaris BSM ("Polaris BSM - Business Swimlane Modeling") are listed as iFAKT GmbH solutions on Microsoft AppSource [15][16].
- **Microsoft Tech Community:** On July 11, 2024, the Marketplace blog of the Tech Community published a post about Polaris VSM under "ISV Success for Business Applications." According to Microsoft, the program offers "platforms, resources, and support designed to help partners develop, publish, and market business apps" [17].
- **Hosting:** The VSM and BSM module pages say "Hosted on Microsoft Azure West Europe" [6][7]. Microsoft's region list places West Europe in the Netherlands [43]. The FAQ speaks more generally of "secure European cloud infrastructure" [3].
- **ERP integration:** According to the FAQ, Polaris can connect to SAP, Microsoft Dynamics and other ERP platforms through standard interfaces, and it can import data from spreadsheets and CSV files [3].
- **Partner status:** The company page names Microsoft Gold Partner status (reached in 2019) and the "Gold Application Development" competency for the tenth consecutive time [4]. According to Microsoft, Gold and Silver competencies could only be renewed until September 30, 2022; since October 3, 2022, Microsoft has awarded Solutions Partner designations instead [38]. The statement therefore describes a historical status.

**Not documented:** Native integration with Microsoft Teams, a Power BI connector, single sign-on with Microsoft Entra ID, or availability as a Dynamics 365 extension are not mentioned on the pages reviewed. An AppSource listing means you can buy through the Microsoft marketplace, not automatically a deep integration. If these points matter to you, get them confirmed in writing during selection. More background on manufacturing IT on Azure is in the compendium [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned).

## 16. Security, hosting and certifications

| Aspect | Statement | Source | Status |
|---|---|---|---|
| ISO 9001 | certified to DIN EN ISO 9001, effective October 2014 | company page [4] | vendor statement, documented on the website |
| ISO/IEC 27001 | "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" (badge); FAQ: certified to ISO 27001 and ISO 9001, audited by TÜV SÜD | home page, FAQ [1][2][3] | vendor statement; certificate with scope not viewed publicly |
| Hosting | Microsoft Azure West Europe, located in the Netherlands (VSM, BSM); "secure European cloud infrastructure" (FAQ) | module pages, FAQ, Microsoft region list [3][6][7][43] | vendor statement |
| Encryption, roles, audits | encryption, role-based access control and regular security audits | FAQ [3] | vendor statement |
| Tenant isolation, authentication | isolated tenant environments, OAuth 2.0 | BSM page [7] | vendor statement |
| GDPR | "100% GDPR-compliant" | VSM and BSM pages [6][7] | vendor statement; compliance is not a certification |
| SOC 2 | not mentioned on the pages reviewed | n/a | ask the vendor |
| US hosting region | not mentioned on the pages reviewed | n/a | ask the vendor |

**How to read this:** An ISO/IEC 27001 certification covers an organization's management system within a defined scope. During selection, ask to see the certificate and check whether development and operation of Polaris are in scope and how long it is valid. TÜV SÜD is a German testing and certification body. "GDPR-compliant" is a self-assessment; what counts is the data processing agreement, the list of sub-processors and the technical and organizational measures. If your security team requires a SOC 2 report (Section 5.8), ask early; the pages reviewed mention only ISO certifications. If you need an installation in your own data center: an on-premises option is not mentioned on the pages reviewed; the FAQ mentions only operation on European cloud infrastructure [3]. For US companies this also means that, according to the pages reviewed, data are hosted outside the US; check that against customer contracts and, in aerospace and defense, against export-control rules.

## 17. What the vendor promises and how to test it

The home page lists as results "Up To 50%" lead time reduction (described as "Average decrease in production cycle time"), "Up To 40%" capacity optimization ("Improvement in machine utilization rates") and "Up To 25%" quality improvement ("Reduction in schedule deviations and missed deadlines") [1]. The planning page also cites up to 80 percent less manual planning effort [13]. For none of these figures are baseline, number of projects or measurement method published. Note the wording on the home page: "Up To 50%" next to "Average decrease" mixes a maximum with an average, which is one more reason to ask how the figure was calculated.

Such claims are common in this market. Siemens, for example, cites up to 50 percent lower inventory and up to 50 percent better on-time delivery for Opcenter APS [36]. Read figures like these as an upper bound from individual cases, not as an expected value, whichever vendor states them.

How to turn promises into testable statements:

1. **Ask for the calculation:** Which baseline and target values, over what period, at which customer, with which definition of lead time?
2. **Ask for a reference call** with a user from your industry and type of manufacturing, ideally a US site if that matters to you.
3. **Agree on a pilot with exit criteria:** one value stream, your own data, metrics and targets defined in advance.
4. **Compare plan and actual** in the pilot: Do the schedules from the Optimizer hold on the shop floor? How often do you have to reschedule?
5. **Assess the effort honestly:** How much time did master data cleanup take, and how much the interface?

These test steps apply equally to every vendor in Part A.

## 18. Who Polaris fits and who it does not

**Based on its function description, Polaris is worth considering if**
- you run discrete manufacturing or assembly with many variants, BOMs and shared resources,
- you want to connect value stream mapping, simulation and scheduling on a shared data model instead of moving data between tools,
- you want to start with value stream mapping without system integration and add scheduling and execution later,
- you want to look at business processes outside production (quoting, engineering, order processing) with the same lean logic (BSM),
- a cloud solution hosted in the EU fits your IT policies.

**Polaris is probably a weaker fit if**
- you only document value stream maps occasionally; then a drawing tool with a template is often enough (Section 3.1),
- you need detailed 3D material-flow simulation with conveyors, robotics or virtual commissioning; specialist simulation tools are meant for that (Section 3.3),
- you work in process industries with recipes and batches, for which the vendor names no references,
- you require an installation in your own data center or a US hosting region, neither of which is described on the pages reviewed,
- you need a SOC 2 report as a precondition, which the pages reviewed do not mention,
- you are looking for full supply chain or multi-plant planning, which the module pages do not describe,
- you already run an APS and MES that answer your scheduling questions; then weigh the added value against a pure VSM tool separately,
- you require public prices or independent analyst ratings before any shortlist.

**Alternatives by category:** for pure documentation, Visio, Lucidchart or Miro [27][28][29]; for value streams with metrics and optional simulation, eVSM [42], SimVSM [30][31] or visTable with layout context [32]; for value streams with simulation, Plant Simulation X with the VSM library [33]; for data-driven value stream reconstruction, ONIQ [35]; for APS, for example Opcenter APS [36]. This is a selection for orientation, not a ranking.

## 19. FAQ

### What is value stream mapping software?
Value stream mapping software supports value stream mapping and future-state design digitally. The range goes from drawing tools with lean symbols, through dedicated tools with automatic metric calculation and scenarios, to platforms that include simulation and production scheduling (Section 3).

### What is the best value stream mapping software?
There is no single best tool, because the categories answer different questions. For workshops and documentation, a drawing tool with a VSM template is usually enough. For regular value stream work with metrics, a dedicated VSM tool fits. For variability and product mix you need simulation, and for due dates under constraints an APS system. Use the decision guide in Section 4 and the checklist in Section 6, and be careful with rankings written by vendors or funded by them; the two longest US ranking pages for this keyword are one of each [47][48].

### Is there free value stream mapping software?
Yes, in several categories. Drawing and whiteboard tools such as Lucidchart and Miro offer free entry tiers with VSM shapes or templates [28][29]. At iFAKT Polaris, the VSM and BSM modules are available in a free tier without a credit card, according to the FAQ [3]; the vendor does not describe the scope of that tier in detail. With any free offer, check user limits, export options and data storage.

### Can I do value stream mapping in Excel or Visio?
Yes. Excel templates work for small maps and simple calculations, but every change has to be carried over by hand, and versions multiply quickly (Section 2). Microsoft Visio has a value stream map template; according to Microsoft, it requires Visio Professional (or the older Premium edition) and is not included in Visio Standard [27]. Neither Excel nor Visio simulates variability.

### What is the difference between value stream mapping software and simulation software?
Value stream mapping software usually calculates statically with averages: days of inventory, lead time, value-added ratio. Simulation software models operations over time, including variability, breakdowns, product mix and shared resources [22][33][37]. A side-by-side comparison of two maps is not a simulation.

### What is the difference between value stream mapping and process mapping?
A value stream map follows one product family across the whole flow, from supplier to customer, and shows material flow, information flow, inventory and a lead-time line. A process map (such as a swimlane diagram or BPMN model) shows the steps, roles and decisions of one process in detail. Both can be combined: in Polaris, VSM covers value streams and BSM covers swimlane process maps [6][7].

### Is "value stream management software" the same thing?
Not always. In manufacturing, value stream management means ongoing management along value streams (ISO 22468 [39]). In software development, "value stream management" platforms measure the flow of work items from ticket to deployment. Several US listicles mix both [50]. Check whether a tool handles material, inventory and machines before you shortlist it.

### What is iFAKT Polaris?
A modular software platform from iFAKT GmbH (Stuttgart, Germany) for production optimization, from value stream mapping through simulation and scheduling to shop-floor execution and reporting. According to the vendor, it consists of seven modules with a shared data model: VSM, BSM, Designer, Simulator, Optimizer, Operator and Analyzer [3].

### What is Polaris IMS?
Under the name Polaris IMS, iFAKT took second place in the Production category of the 2025 Best of Technology Award from the German business weekly WirtschaftsWoche [18]. The jury description mentions a digital twin of production, automated resource planning, shop-floor execution with real-time monitoring, and AI proposals when disruptions occur [18][19]. On the current website, this scope is spread across the Designer, Simulator, Optimizer and Operator modules (Section 13; the mapping is the author's interpretation).

### Can Polaris VSM simulate?
The Polaris VSM module page describes scenarios, sensitivity analysis and metric comparisons, but no dynamic simulation [6]. Simulation is offered by the separate Simulator module, which works on the Designer's product-process-resource model [9].

### What data does Polaris need, and do I have to connect my ERP?
Not for VSM and BSM: according to the vendor, no system integration is needed to start [3]. Simulation and scheduling need data on products, BOMs, process times and resources; for testing via file, Excel or ERP export, in production through continuous synchronization with ERP, MES or other systems [13]. According to the FAQ, there are standard interfaces to SAP and Microsoft Dynamics [3].

### Is Polaris integrated with Microsoft 365 or Teams?
Documented are AppSource listings for Polaris VSM and BSM [15][16], a Microsoft Tech Community post [17] and hosting of VSM and BSM on Microsoft Azure West Europe according to the module pages [6][7]. Integration with Teams or Power BI is not mentioned on the pages reviewed.

### Where is Polaris hosted, and does iFAKT have SOC 2?
The VSM and BSM pages name Microsoft Azure West Europe [6][7], a region located in the Netherlands [43]; the FAQ speaks of European cloud infrastructure [3]. The website states ISO 9001 (since October 2014) and ISO/IEC 27001 certification by TÜV SÜD [1][3][4]. A SOC 2 report and a US hosting region are not mentioned on the pages reviewed. Ask for certificates with scope, and ask about SOC 2 directly if your security team requires it.

### How long does implementation take?
According to the vendor, VSM and BSM need no setup; for simulation and scheduling, the FAQ gives a typical onboarding time of two to four weeks, including data integration, model configuration and training [3]. The real duration depends mainly on master data quality and interfaces.

### How much does Polaris cost?
The vendor does not publish prices. The BSM AppSource listing names plans from "Read Only" to "Integrate & Customize" without prices [16]; for Simulator, Optimizer and Operator, the FAQ offers a demo with a trial [3].

### What are the alternatives to Polaris?
That depends on the category: drawing tools such as Visio, Lucidchart or Miro for documentation [27][28][29]; dedicated tools such as eVSM, SimVSM or visTable [42][30][32]; simulation with Plant Simulation, AnyLogic or FlexSim [33][34]; data-driven approaches such as ONIQ [35]; and APS systems such as Opcenter APS [36]. Section 4 compares the categories.

## 20. Conclusion

If you are choosing value stream mapping software, do not start with product names; start with the question the software has to answer. Documentation, regular evaluation with metrics, dynamic simulation, scheduling under constraints and ongoing analysis of actual data are different jobs, handled by different categories of software. The selection checklist in Section 6 and the business case logic in Section 9 help you make offers comparable without relying on brochure figures. For US buyers, add hosting region, SOC 2 or ISO/IEC 27001 scope and, where relevant, export control to the list early.

iFAKT Polaris is one of the platforms that connect several categories on a shared data model: value stream and process analysis (VSM, BSM), product-process-resource modeling (Designer), simulation, constraint-based scheduling (Optimizer), shop-floor task management (Operator) and reporting (Analyzer). What can be verified: the function descriptions on the vendor pages, two AppSource listings, a Microsoft Tech Community post, second place in the Production category of the 2025 Best of Technology Award, the ECOWERT research collaboration with Fraunhofer IPA and a series of ZWF journal articles spanning twelve years. Not documented: benefit figures with disclosed methodology, simulation in the VSM module, Teams or Power BI integration, a US hosting region, a SOC 2 report and public prices.

For discrete manufacturers with many variants who want to move from value stream to schedule, Polaris is, based on its function description, a candidate for a pilot. For pure documentation, 3D material-flow simulation or process industries, other categories fit better. In every case: decide on the basis of a pilot with your own data and metrics defined in advance, not on the basis of this or any other text.

## Further reading on m365.fm

**Entities**
- [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [Business Application](https://www.m365.fm/entity/business-application/)
- Modules: [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)
- People: [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Posts and episodes**
- [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- Podcast: [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Compendiums (planned)**
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about value stream management, production scheduling and the digital transformation of manufacturing in the Microsoft ecosystem.

> **Note: The author works at iFAKT GmbH.**

*iFAKT GmbH ([entity page](https://www.m365.fm/entity/ifakt/)) is the vendor of iFAKT Polaris.*

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All online sources retrieved on November 20, 2026. Titles of German-language sources are given in the original, with a translation in parentheses where helpful.

1. iFAKT GmbH: Polaris (home page, English). https://www.ifakt.de/en
2. iFAKT GmbH: Polaris (home page, German). https://www.ifakt.de/de
3. iFAKT GmbH: FAQ. https://www.ifakt.de/en/faq
4. iFAKT GmbH: About iFAKT (company page). https://www.ifakt.de/en/company/
5. iFAKT GmbH: Impressum (legal notice): iFAKT GmbH, Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart, HRB 22661. https://www.ifakt.de/de/imprint
6. iFAKT GmbH: Polaris VSM, Value Stream Mapping Software (module page, English and German). https://www.ifakt.de/en/solutions/value-stream-mapping-software · https://www.ifakt.de/de/solutions/value-stream-mapping-software
7. iFAKT GmbH: Polaris BSM, Business Swim Lane Modelling (module page). https://www.ifakt.de/en/solutions/business-swimlane-modelling
8. iFAKT GmbH: Polaris Designer (module page). https://www.ifakt.de/en/solutions/designer
9. iFAKT GmbH: Polaris Simulator (module page). https://www.ifakt.de/en/solutions/simulator
10. iFAKT GmbH: Polaris Optimizer (module page). https://www.ifakt.de/en/solutions/optimizer
11. iFAKT GmbH: Polaris Operator (module page). https://www.ifakt.de/en/solutions/operator
12. iFAKT GmbH: Polaris Analyzer (module page). https://www.ifakt.de/en/solutions/analyzer
13. iFAKT GmbH: Planning & Execution, AI-powered production planning and scheduling (application page). https://www.ifakt.de/en/software/ims/
14. iFAKT GmbH: Polaris VSM, Digital Value Stream Tool in Lean Management (product page). https://www.ifakt.de/en/software/vsm/
15. Microsoft AppSource: Polaris VSM - Digital Value Stream Mapping (iFAKT GmbH). https://appsource.microsoft.com/en-us/product/web-apps/ifaktgmbh.ifakt_vsm_1?tab=Overview
16. Microsoft AppSource: Polaris BSM - Business Swimlane Modeling (iFAKT GmbH). https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
17. Microsoft Tech Community, Marketplace Blog: Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
18. WirtschaftsWoche: Best of Technology Award, Gewinner 2025 (winners 2025), category Produktion (Production). https://award.wiwo.de/bot/gewinner-2025/
19. WirtschaftsWoche: Best of Technology Award, Finalisten 2025 (finalists 2025). https://award.wiwo.de/bot/finalisten-2025/
20. LeanBase: Lean Around The Clock 2025, sponsor iFAKT GmbH. https://leanbase.de/latc/sponsors/2025-ifakt
21. Drees, J.; Sack, C.: Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
22. Türck, S.; Weimer, A.; Schubert, L.; Drees, J.: Dynamische Simulation von Wertströmen. ZWF 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html
23. Drees, J.: Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
24. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
25. Fraunhofer IPA: Die Wertstromanalyse wird ins digitale Zeitalter übertragen (value stream analysis is moving into the digital age), press release, July 5, 2022. https://www.ipa.fraunhofer.de/de/presse/presseinformationen/die-wertstromanalyse-wird-ins-digitale-zeitalter-uebertragen.html (an AI-translated English republication exists at reinraum.de: https://www.reinraum.de/en/news/the-value-stream-analysis-is-being-transferred-into-the-digital-age.html)
26. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen (capturing value stream data automatically). IT&Production, January 12, 2023. https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/
27. Microsoft Support: Create a value stream map (Visio). https://support.microsoft.com/en-us/visio/create-a-value-stream-map
28. Lucid Software: Value stream mapping symbols and icons (Lucidchart VSM shape library). https://lucid.co/diagram/vsm/value-stream-mapping-symbols
29. Miro: Value stream mapping templates. https://miro.com/templates/value-stream-map
30. SimPlan AG: SimVSM, Wertstromanalyse und Simulation in einer App (German product page). https://www.simplan.de/software/simvsm/
31. SimPlan AG: Digital value stream mapping and analysis as the key to informed decisions (English). https://www.simplan.de/en/from-paper-to-digital-value-stream/
32. visTable GmbH: Wertstromanalyse Software (German product page). https://www.vistable.com/de/solutions/wertstromanalyse-software/
33. Siemens: Plant Simulation X value stream mapping (VSM library). https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/
34. Wikipedia: List of discrete event simulation software (entries AnyLogic, FlexSim, Plant Simulation). https://en.wikipedia.org/wiki/List_of_discrete_event_simulation_software
35. PwC Store: ONIQ value stream analysis (English). https://store.pwc.de/en/products/oniq-value-stream-analysis
36. Siemens: Opcenter Advanced Planning and Scheduling (APS). https://www.siemens.com/en-us/products/opcenter/advanced-planning-scheduling-aps/
37. ATS Pro / Simio: Wertstromanalyse und Simulation im Vergleich (value stream mapping vs. simulation, German). https://simio-simulation.de/simulation-vs-wertstromanalyse-vsm
38. Microsoft Tech Community (News from Microsoft Norway): Silver and Gold competency partners, guidance on renewal, April 28, 2023. https://techcommunity.microsoft.com/blog/newsfrommicrosoftnorway/silver-and-gold-competency-partners---guidance-on-renewal/3808345
39. ISO 22468:2020 Value stream management (VSM). International Organization for Standardization. https://committee.iso.org/standard/73292.html?browse=ics
40. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (bibliographic data taken from the m365.fm Value Stream Mapping compendium).
41. Lean Enterprise Institute: Learning to See, by Mike Rother and John Shook (book page). https://www.lean.org/store/book/learning-to-see/
42. G2: eVSM product listing and reviews (vendor description "a complete lean toolkit to map, model and improve value streams of every type"). https://www.g2.com/products/evsm/reviews
43. Microsoft Learn: List of Azure regions (West Europe: Netherlands). https://learn.microsoft.com/azure/reliability/regions-list
44. NIST: NIST Releases Version 2.0 of Landmark Cybersecurity Framework, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
45. AICPA & CIMA: SOC 2 Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy (guide). https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy
46. Wikipedia: Value-stream-mapping software. https://en.wikipedia.org/wiki/Value-stream-mapping_software
47. Lean Transition Solutions (Data Point): 7 Best Value Stream Mapping software for Manufacturing & Operations Teams (2026) (competitor, vendor-written). https://leandatapoint.com/blog/best-value-stream-mapping-software-for-manufacturing
48. Gitnux: Top 10 Best Value Stream Mapping Software of 2026 (competitor, labeled commissioned research). https://gitnux.org/best/value-stream-mapping-software/
49. ClickUp: 10 Value Stream Mapping Software to Improve Processes in 2026 (competitor, vendor-written). https://clickup.com/blog/value-stream-mapping-software/
50. Project-Management.com: Top Value Stream Mapping Tools & Software (competitor). https://project-management.com/value-stream-mapping-tools-software/
51. Lucidchart: Value stream mapping software (competitor, product page). https://www.lucidchart.com/pages/landing/value_stream_mapping

---

# Editorial notes

## Vendor-only claims (labeled in the text)

- All function lists of the seven modules [6]–[14]: self-reported on ifakt.de, not independently tested.
- Benefit figures: "Up To 50%" lead time, "Up To 40%" capacity, "Up To 25%" quality [1]; up to 80% less planning effort [13]; "2-4 hours" instead of "2-3 days", "100% data accuracy", 30–40% less implementation risk [6]; "a third of the time" [14]. Deliberately quoted only as vendor claims without methodology. Do not use them in meta data, teasers or schema.
- Onboarding of two to four weeks, free tier for VSM/BSM, interfaces to SAP and Microsoft Dynamics [3].
- ISO/IEC 27001: documented only as a TÜV SÜD badge and an FAQ statement on ifakt.de [1][3]; certificate, scope and validity not viewed. The company page [4] names only ISO 9001 (effective October 2014). Recommendation: check the certificate number in the TÜV SÜD certificate database or request it from iFAKT before ISO 27001 appears in schema or teasers.
- Hosting "Microsoft Azure West Europe" only on the VSM and BSM module pages [6][7]; the FAQ says only "secure European cloud infrastructure". For Designer, Simulator, Optimizer, Operator and Analyzer, hosting is not stated explicitly. The Netherlands location of West Europe comes from Microsoft [43], not from iFAKT.
- "100% GDPR-compliant" [6][7]: self-assessment.
- Customer and industry information (logos, quotes) [1][2][14]: self-reported; scope of the customer relationships unknown. No customer counts used.
- Siemens Opcenter APS benefit figures [36] are also vendor claims; they are cited only to show that "up to" figures are common across the market, not to compare products.

## Disclosure and neutrality

- Disclosure "**Note: The author works at iFAKT GmbH.**" appears under the H1, at the start of Part B and in the author box. This states the author's material connection to the vendor, as the US FTC's Guides Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR Part 255) expect; the Guides include an example of an employee endorsing the employer's product (Example 8 in § 255.5; checked in the FTC document https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf and the CFR text https://www.govinfo.gov/content/pkg/CFR-2012-title16-vol1/pdf/CFR-2012-title16-vol1-part255.pdf). It is not a sponsorship label: iFAKT does not pay for publication, so no "sponsored" / "paid partnership" label and no `rel="sponsored"` on links to ifakt.de.
- Part A works without Part B; Polaris appears in Part A only as one example among several, each time with a pointer to Part B.
- No superlatives, no contact or demo CTAs. Please do not add vendor CTA boxes.
- The iFAKT company location: only the Stuttgart headquarters (legal notice [5]) and "near Stuttgart Airport" (company page [4]) are named. No other locations are mentioned, in line with the brief.

## Items only on m365.fm, not on ifakt.de

- The module descriptions on the m365.fm entity pages (VSM value stream, BSM swimlanes, Designer PPR graph, Simulator, Optimizer constraint-based scheduling, Operator shop-floor tasks, Analyzer KPI dashboards) are covered by the ifakt.de module pages. No discrepancies found in the German review; the entity pages could not be fetched by tool, so please check them against the article.
- Founding year: the German Value Stream Mapping compendium says "founded in 2001 by Jörg Drees", citing the author biography in Drees/Sack 2011 (paywalled, not re-checked). This article uses only "more than 25 years" per the FAQ [3]. No personal roles (such as managing director) are named, because no primary source was retrieved.
- Affiliations: only for 2023 [24] is "iFAKT GmbH" documented by the publisher as the affiliation of Jörg Drees and Steffi Stambera. Affiliations of the 2011 and 2014 co-authors (Sack, Türck, Weimer, L. Schubert) were not checked; the text attributes no company to them.
- Philip Schubert: linked only in the further-reading list, without a role (client request; no primary source on the role retrieved).

## Unverified items and other checks

- **AppSource listing Polaris VSM [15]:** existence and title confirmed via search index and the Tech Community post [17]; the page itself could not be loaded by tool (German review). Open it in a browser before publishing. The BSM listing [16] was retrieved in the Bulgarian locale; switch to `en-us` if it resolves.
- **Polaris IMS:** the mapping "IMS = Designer, Simulator, Optimizer, Operator" is the author's interpretation (labeled in the text). Have iFAKT confirm it.
- **WirtschaftsWoche award:** second place in Production confirmed on the winners page [18] (re-checked November 20, 2026). ifakt.de does not mention the award.
- **ECOWERT:** "one-year, until August 31, 2022" per the press release [25]. EUR 300,000 not converted to USD (historical funding amount; conversion adds no value).
- **eVSM [42]:** the vendor's own website was not retrieved; the description comes from its G2 listing (vendor text plus user reviews). Optional: replace with the vendor site after checking it in a browser.
- **visTable [32]:** layout link and automatic lead-time calculation are taken from the German product page (checked in the German review); the English SourceForge listing describes VSM metrics but not layout, so the German source was kept.
- **Visio [27]:** Microsoft's page now says "Visio Professional or Premium edition" and excludes Visio Standard; it lists Plan 2 under "Applies to" without saying explicitly whether Plan 2 includes the template. The German article said "Plan 2 and Professional 2016–2024"; the English text follows the current wording.
- **SOC 2, US hosting region, US references, support hours:** "not mentioned on the pages reviewed" means the pages cited in this article ([1]–[14]); a full-site search was not done. Ask iFAKT before publishing whether any of these exist, and update Section 16, 18 and the FAQ if so.
- **Translated quotes:** the Böhm quote and the "no suggestions yet" statement [25], the Simio quote [37], the SimVSM quote [30] and the jury description [18] are translated from German by the editor. The Optimizer page [10] and the planning-page figures [13] were checked in the German review on November 20, 2026 and not re-fetched for this version.
- **Internal links:** `/en/learn/` compendiums are marked "(planned)" as in the German set; remove after publication. Entity links stay on `/entity/`.

## Recommended graphics

1. Category map: five categories as columns with the main question per category (from Section 4).
2. Polaris data flow: VSM/BSM → Designer (PPR) → Simulator / Optimizer → Operator → Analyzer, labeled "according to the vendor".
3. Timeline of the journal articles 2011–2023 with DOIs.
4. US buyer security checklist as a small graphic (region, SOC 2 / ISO 27001 scope, DPA, export control).

## hreflang and cannibalization

- hreflang pair: `en-US` https://www.m365.fm/en/learn/ifakt-polaris/ <-> `de-DE` https://www.m365.fm/learn/ifakt-polaris/; both pages reference each other plus `x-default`.
- Cannibalization: the English sister [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) targets the informational keyword "value stream mapping"; this article targets the commercial keyword "value stream mapping software". Keep the method (symbols, formulas, worked example) in the sister and link to it from Section 1 and 12.1, as done. The entity page https://www.m365.fm/entity/polaris/ should link to this pillar for "iFAKT Polaris".

## Schema suggestion (JSON-LD)

Only documented fields; **no** `aggregateRating`, **no** `review`, **no** `offers` with prices (no prices published). `award` only with the verified wording.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Value Stream Mapping Software for Manufacturing: A Buyer's Guide and an Evidence-Based Look at iFAKT Polaris",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.ifakt.de/" }
      },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "about": { "@id": "https://www.m365.fm/entity/polaris/#software" },
      "mainEntityOfPage": "https://www.m365.fm/en/learn/ifakt-polaris/"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.m365.fm/entity/polaris/#software",
      "name": "iFAKT Polaris",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://www.ifakt.de/en",
      "publisher": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.ifakt.de/" },
      "featureList": [
        "Polaris VSM: digital value stream mapping",
        "Polaris BSM: business swimlane modeling",
        "Polaris Designer: product-process-resource model",
        "Polaris Simulator: production simulation",
        "Polaris Optimizer: constraint-based scheduling",
        "Polaris Operator: shop-floor tasks",
        "Polaris Analyzer: KPI dashboards"
      ],
      "award": "WirtschaftsWoche Best of Technology Award 2025, category Production, 2nd place (Polaris IMS)",
      "sameAs": [
        "https://appsource.microsoft.com/en-us/product/web-apps/ifaktgmbh.ifakt_vsm_1",
        "https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1"
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": "[generate from the 16 FAQ questions in Section 19; answers word for word as in the visible text]"
    }
  ]
}
```

Note: set `sameAs` with the AppSource URLs only after [15] is confirmed in a browser. Decide editorially whether marketplace listings belong in `sameAs` or whether the vendor `url` alone is enough.

---

## Review log

Review of the US English version (November 20, 2026). Basis: the German source `ifakt-polaris.md` including its review protocol and the consistency check of November 20, 2026. Roles: subject-matter expert (value streams / industrial engineering), SEO specialist (US), US target reader (plant manager / operations leader at a US discrete manufacturer with Microsoft 365), fact checker (re-verifies online), critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms).

### Localization decisions before review

- H1, short answer, key takeaways, H2 for Section 5, FAQ, meta title and description rewritten for the US keyword "value stream mapping software" (the German version targeted "Wertstrom Software" and "iFAKT Polaris").
- Competitive analysis redone for google.com (US): longest competitor gitnux.org (approx. 4,500 words); German NEURONwriter analyses and German competitor sources (jodoo, balane) dropped from this version.
- Sources swapped or added where verified English equivalents exist: Lucid (English symbols page) [28], Miro (English templates) [29], SimPlan (English page) [31] next to the German one, Siemens Plant Simulation X VSM (en-us) [33] and Opcenter APS (en-us) [36], ONIQ (PwC Store English) [35]; new US/English sources: Lean Enterprise Institute *Learning to See* [41], eVSM via G2 [42], Microsoft Azure region list [43], NIST CSF 2.0 [44], AICPA SOC 2 guide [45], Wikipedia VSM software [46], five US competitor pages [47]–[51], iFAKT legal notice [5].
- German sources kept where no equivalent exists (ZWF articles, Fraunhofer IPA press release, IT&Production, visTable, Simio Germany, Erlach, WirtschaftsWoche), with German context explained (ZWF, Fraunhofer IPA, WirtschaftsWoche, PPS, TÜV SÜD, GDPR/DPA).
- New US-specific content: SOC 2 vs. ISO/IEC 27001, NIST CSF 2.0 for vendor reviews, data residency (Azure West Europe = Netherlands), ITAR/EAR note, support hours and US partners, US references not named, DevOps "value stream management" confusion on the US SERP, Excel/Visio FAQ, "best software" FAQ, VSM vs. process mapping FAQ, hosting/SOC 2 FAQ.
- iFAKT facts per brief: headquarters Curiestrasse 2, 70563 Stuttgart (HRB 22661, legal notice [5]); no other location named; no sponsorship label; disclosure exactly "**Note: The author works at iFAKT GmbH.**" under the H1, at the start of Part B and in the author box.

### Round 1

- **Subject-matter expert, not satisfied:** (a) takt time is listed as a metric but not defined, US readers searching "VSM software" expect the basic formula; (b) eVSM, a tool well known among US lean practitioners, is sourced only through a G2 listing; (c) ZWF described as "published by De Gruyter Brill", which is wrong for the 2011–2018 articles (DOI prefix 10.3139 is the former publisher); (d) otherwise the static vs. dynamic distinction, Little's Law and the category logic carried over correctly.
- **SEO specialist (US), largely satisfied:** meta title 60 characters, description 148 characters, main keyword in title, H1, short answer, a Section 5 H2 and 29 times in the text; 16 FAQ questions cover the US "People also ask" themes (best tool, free tools, Excel/Visio, VSM vs. process mapping, value stream management). Requests: put "VSM software" into a heading; keep the hreflang pair and the cannibalization note against the sister `/en/learn/value-stream-mapping/`.
- **US target reader (plant manager), not satisfied:** Part A is useful, but as a US buyer of a German product I need to know quickly where data are hosted, whether there is a SOC 2 report, whether there are US references and who supports me in my time zone. These points are spread across several sections.
- **Fact checker, not satisfied:** re-verified online: iFAKT FAQ, VSM module page, English home page, company page, legal notice, Tech Community post, WirtschaftsWoche winners page, Fraunhofer IPA content (via the reinraum.de English republication), Siemens VSM and Opcenter pages, SimPlan English page, Lucid, Miro, Visio support, PwC ONIQ, Azure region list, NIST CSF 2.0, AICPA guide title, FTC Endorsement Guides. Findings: (a) several FAQ phrases were set in quotation marks although only paraphrases could be confirmed ("a typical onboarding takes 2–4 weeks", the ERP sentence, the security sentence, "no credit card required", "a personalized demo and trial", "a modular Smart Factory software platform"); (b) the Visio statement in the German version ("Plan 2 and Professional 2016–2024") no longer matches Microsoft's page, which now says "Visio Professional or Premium" and excludes Standard; (c) ONIQ wording is "without manual mapping", not "without manual value stream mapping"; (d) the visTable English listing does not mention layout, so the layout claim must keep the German source; (e) translated quotes (Böhm, Simio, "no suggestions yet") must be labeled as translations; (f) Section 14 cited [2] for company logos, but the logos are on [1] in the German review; (g) ZWF and its articles were called "peer-reviewed", which is not documented (the German source says "Fachbeiträge", technical articles); (h) the SimVSM quote "including static evaluations" is a translation from German; (i) the Optimizer phrases "with one click" and "AI-powered" were set as quotes from the Optimizer page, but only the German review saw that page and "AI-powered" is the title of the planning page [13]; (j) the competitive-analysis row for creately/edrawsoft/conceptdraw/smartdraw gave a word count although those pages were not fetched.
- **Critic, not satisfied:** (a) "the award is not widely known outside German-speaking markets" is an unsourced claim; (b) "hall models" is a Germanism; (c) the observation that the home page mixes "Up To 50%" with "Average decrease" is fair and neutral, keep it; (d) the Siemens benefit figures help show that "up to" claims are market-wide, which avoids singling out the author's employer only in one direction, keep them labeled as vendor claims; (e) no em-dash chains, no "delve"/"game-changer"/"fast-paced" found; no CTAs; Polaris appears in Part A only as one example among several; (f) two unsourced generalizations in 5.8 ("European vendors more often hold ISO/IEC 27001", "Many US companies use [NIST CSF] to structure vendor reviews") and "data sit outside the US by default" in Section 16 overstate what is known.

**Conflicts and decisions:**
- SME vs. critic on eVSM: the SME wants the vendor site, the critic wants no unverified sources. Decision: keep the G2 listing (verified) with the vendor description in quotation marks and add an editorial note to replace it with the vendor site after a browser check.
- US reader vs. SEO on a separate "US buyers" section: a new H2 would dilute the structure. Decision: no new H2; instead the US points are bundled in Section 5.8 (four bullets), the security table in Section 16 gets explicit "SOC 2" and "US hosting region" rows, Section 18 adds two "weaker fit" bullets, a new FAQ answers hosting and SOC 2, and the conclusion names the US checks.

**Optimization after Round 1 (old -> new):**
- 5.2: "Takt time, days of inventory, …" -> "Takt time (available time divided by customer demand), days of inventory, …"
- 3.2 heading: "Dedicated value stream mapping tools" -> "Dedicated value stream mapping tools (VSM software with calculation logic)"
- 10: "ZWF (…, published by De Gruyter Brill)" -> "ZWF (…) is a German-language engineering journal whose archive is now hosted by De Gruyter Brill"
- 11, 15, 16, 19: quoted FAQ phrases -> paraphrases; only confirmed short strings stay in quotation marks ("constraint-based optimization algorithms", "secure European cloud infrastructure", "built for manufacturing companies in aerospace, automotive, mechanical engineering, and energy")
- 3.1 and FAQ: "Visio Plan 2 and Professional 2016–2024, not Standard" -> "requires Visio Professional (or the older Premium edition), not included in Visio Standard; Plan 2 listed under 'Applies to'"
- 3.5: ONIQ quote -> "(e.g., MES, PDA, PPS, IIoT)" … "without manual mapping", plus explanation of PDA and PPS
- 3.2 / 3.6 / 18: visTable layout claim kept on the German source [32]; note added
- 2 and 10: "(translated from German)" added to the Böhm, Simio and Fraunhofer IPA quotes
- 14: company names and logos cited to [1]; descriptions to [2]; target group sentence replaced by the confirmed FAQ quote plus user roles
- 13: "the award is not widely known outside German-speaking markets" -> "it is a prize from a German publication judged among its entries"
- 12.4: "station, line and hall models" -> "station, line and hall (building-level) models"
- 16: rows "SOC 2" and "US hosting region" (not mentioned on the pages reviewed) added; FAQ "Where is Polaris hosted, and does iFAKT have SOC 2?" added
- Editorial notes: FTC Endorsement Guides (16 CFR Part 255) reference for the disclosure added, explicitly not as a sponsorship label
- Short answer, intro, Section 2: "peer-reviewed articles / literature / journal" -> "technical articles", "technical literature", "a German journal for production engineering"
- 3.2: SimVSM quote marked "(translated from German)"
- 12.5: quoted 'with one click' -> "at the click of a button"; "described as 'AI-powered' [10]" -> "described as AI-supported (the planning page is titled 'AI-powered production planning and scheduling') [10][13]"
- Competitive analysis: "under 1,500 each" -> "not counted (seen in result lists only)"
- 5.8: "European vendors more often hold …" -> "The international alternative is …"; "Many US companies use it …" -> "You can use it to structure your own vendor reviews."
- 16: "data sit outside the US by default" -> "according to the pages reviewed, data are hosted outside the US"

### Round 2

- **Subject-matter expert, satisfied:** takt time defined, category logic and the static vs. dynamic distinction correct; Polaris module limits stated module by module; ZWF publisher statement correct.
- **SEO specialist (US), satisfied:** "VSM software" now in an H3; title 60 / description 148 characters; article 11,566 words (H1 to the end of the conclusion, `wc -w`), more than 2.5 times the longest US competitor; all English sister links absolute under `/en/learn/` and marked "(planned)"; entity links unchanged; hreflang and cannibalization note in place; FAQPage schema can be generated from the 16 visible questions.
- **US target reader, satisfied:** hosting region (Netherlands), SOC 2 status, US references and support questions are now answered in 5.8, 16, 18, the FAQ and the conclusion; the checklist includes SOC 2 / ISO 27001, DPA and ITAR/EAR.
- **Fact checker, satisfied with open points for the editor:** all changed and new facts re-verified (list above). Open: AppSource VSM page [15] not loadable by tool (carried over from the German review); eVSM vendor site not retrieved; SOC 2 / US hosting / US references checked only on the pages cited, not by full-site search; ISO/IEC 27001 certificate scope not viewed; Polaris IMS mapping is the author's interpretation.
- **Critic, satisfied:** no superlatives or CTAs; every benefit figure is labeled as a vendor claim without methodology; "who it does not fit" has eight bullets, including the US-specific ones; disclosure appears three times in the exact wording; no other iFAKT location than Stuttgart is mentioned; no sponsorship wording.

**Result:** all five roles satisfied after Round 2. Two rounds.
