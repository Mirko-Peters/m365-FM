# SEO metadata

| Field | Value |
|---|---|
| Meta title | Shop Floor Management & Gemba Walks: A Practical Guide (54 characters) |
| Meta description | Shop floor management explained: tier meetings, SQDCP boards, KPIs, a gemba walk checklist, a rollout roadmap and a digital board in Microsoft 365. (147 characters) |
| Slug | `/en/learn/shop-floor-management/` (full URL: https://www.m365.fm/en/learn/shop-floor-management/) |
| Main keyword | shop floor management |
| Secondary keywords | gemba walk, what is a gemba walk, gemba walk checklist, gemba walk questions, tiered meetings, tier 1 meeting, tier 2 meeting, daily management system, shop floor board, SQDCP board, huddle board, shop floor meeting, digital shop floor management, leader standard work, andon, visual management, genchi genbutsu, layered process audit, shop floor KPIs, implementing shop floor management, Power BI shop floor dashboard, Microsoft Teams shop floor board |
| Search intent | Informational (definition, elements, how to run tier meetings and gemba walks) with a commercial/transactional share (checklists, templates, rollout, software, digital boards) |
| Target word count | at least 11,000 words (longest English competitor approx. 5,000 to 6,000 words). Actual `wc -w` of H1..Conclusion: see review log (final count: 15,104 words) |
| Language version | `en-US`; hreflang pair: `en-US` https://www.m365.fm/en/learn/shop-floor-management/ <-> `de-DE` https://www.m365.fm/learn/shop-floor-management/ (German source file `shopfloor-management.md`; both versions use the same slug) |

# Competitive analysis (google.com SERP, November 2026)

Analyzed were the strongest English-language results on google.com (US intent) for "shop floor management", "gemba walk checklist questions" and "tiered meetings manufacturing tier 1 tier 2 tier 3 SQDCP". Method: web search with US-weighted results, then each page was opened and its main text estimated (without navigation, footer and calls to action). Word counts are estimates. Note: safetyculture.com URLs now redirect to mitti.com (same publisher).

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| deskera.com/blog/shop-floor-management | 5,000–6,000 | longest competitor; objectives, "5 pillars", benefits, challenges, 13 best practices, broad technology list (IIoT, cloud, AI) | survey and outcome figures without sources; pillars contradict the key takeaways; tier meetings only as "10–15 minute huddles", no tier structure; KPIs without formulas; no rollout roadmap; heavy overlap between sections; ERP vendor pitch |
| tervene.com/blog/gemba-walk-checklist-questions/ | 2,700–3,000 | strongest gemba walk checklist page; questions by role (team leader, manager, executive), validation framework, standard walk steps | step counts inconsistent (7 vs. "12 steps" vs. 5); claims of impact without numbers; little on follow-up and escalation; vendor pitch |
| l2l.com/blog/shop-floor-management | approx. 2,500 | elements, roles, seven efficiency levers, six KPIs, software categories | no tier meetings, no gemba walk, no board design, no rollout, no sources |
| projectmanager.com/blog/shop-floor-management | approx. 2,000 | planning, scheduling and control; templates | treats SFM as shop floor control; manager role partly reads like retail; no tiers, no gemba; product promotion |
| symestic.com/en-us/what-is/shopfloor-management | approx. 1,700 | five pillars, three-level meeting cascade, SQDCP board sections, physical vs. digital, five-phase rollout, MES role | vendor-authored; unsourced figures (e.g., 30–40% of manager time on the floor); thin on people, change and costs |
| peakboard.com/en/blog/shop-floor-management | approx. 1,400 incl. FAQ | origins (TPS, gemba, hansei), cascade, analog vs. digital, case study | team meeting length contradicts its own FAQ (5–10 vs. 15 minutes); methods in one or two sentences; no measured results; vendor framing |
| mitti.com/topics/gemba-walk (formerly safetyculture.com) | approx. 1,300 | go see / ask why / show respect, six steps, safety and virtual gemba walks | FAQ questions without answers; no follow-up tracking; one example only |
| mitti.com/topics/shop-floor-management (formerly safetyculture.com) | approx. 1,250 | phases, components, best practices | no rollout, no examples, SQCDP undefined, FAQ answers missing, promotional blocks |
| kaizen.com/insights/daily-management-manufacturing-plant/ | 400–450 | clear four-tier model, same-day escalation, SQDC board | no durations, clock times, attendees, KPIs or layouts |

**"People also ask" style questions found in the SERP and on these pages:** What is shop floor management? What are the elements or pillars of shop floor management? What is a gemba walk? What are the three principles of a gemba walk? How often should you do a gemba walk? How long should a gemba walk take? Who should do a gemba walk? What questions should you ask on a gemba walk? What is a tier 1 meeting? What is an SQDCP board? How long should a shop floor meeting take? Can shop floor management work without digital tools?

**How this article beats the competitors:** None of the analyzed English pages connects shop floor management and the gemba walk into one leadership system, and none sources its numbers consistently. This article is the only one with a complete tier meeting matrix (tiers 1 to 4 with cadence, length, attendees, content, decisions and escalation triggers), a concrete board layout as a table, a KPI catalog with formulas (including the OSHA recordable incident rate), a step-by-step gemba walk guide with a question bank, a checklist and a clear line against management by walking around, and leader standard work with a sample day. It adds a six-phase rollout roadmap with a maturity check, a section on employee monitoring rules in the US (NLRA, state notice laws) and in Germany (works councils), an analog vs. digital assessment and a Microsoft 365 reference architecture with a build plan whose limits (Power BI page refresh intervals, the F64 licensing threshold, the Dataverse for Teams deprecation) are verified on Microsoft Learn. Every figure from the literature carries a numbered source; practice values (clock times, the sample day) are labeled as examples.

---

# Shop Floor Management and Gemba Walks: The Complete Guide to Leading Where the Work Happens

*Last updated: November 20, 2026 · Microsoft details verified on Microsoft Learn as of this date*

> **Short answer:** Shop floor management (also written shopfloor management, often called a daily management system or tiered management) is a leadership system in which managers run operations where value is actually created: on the production floor, in the warehouse or in the lab. It combines leaders being present at the gemba (the "real place"), visual KPIs on a shop floor board, short daily tier meetings that cascade issues up the organization, and structured problem solving, so that deviations are spotted every day and fixed for good. The gemba walk is the leadership routine at its core.

Almost every manufacturer has a whiteboard with numbers on it somewhere. Peter Gelbrich, as cited by the German training institute CETPM, estimates from company visits that roughly 80 percent of manufacturing companies have some kind of visual shop floor management tool [3]. So the real question is no longer whether you have a board but whether it works. Are deviations handled within hours instead of weeks? Do leaders show up at the gemba with questions or with answers? And do problems the team cannot solve reliably reach the next level the same day?

This guide explains the origins and principles, describes each element in detail and gives you a tier meeting matrix, a board layout, a gemba walk guide with a checklist, leader standard work, a rollout roadmap and a reference architecture for a digital shop floor board built with Microsoft Teams, Power BI, Power Apps and Microsoft Fabric. Much of the research on shop floor management comes from Germany, where the term "Shopfloor Management" is standard vocabulary in plants; this guide uses those sources where they add value and explains the context for US readers. A compact definition is also available on the entity page [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Key takeaways

- Shop floor management is a leadership system, not a board and not a piece of software. It consists of leaders present on the floor, visual management, a few KPIs, a fixed meeting rhythm, problem solving and standards.
- Team-level tier meetings last 10 to 15 minutes and are staggered so that a problem from the first shift reaches the plant manager the same day.
- A board should carry four to six KPIs the team can actually influence, usually organized as SQDCP (safety, quality, delivery, cost, people).
- The gemba walk is the central leadership routine: it has a topic, relies on observation and open questions, and always ends with follow-up.
- An action is closed only when its effect shows in the KPI and the standard has been updated.
- Routine first, digital second. A digital board in Microsoft 365 is a toolkit; licenses, refresh intervals, data design and employee monitoring rules drive the effort.

### Reading paths for busy readers

| You are a … | Read first |
|---|---|
| Team leader, supervisor or shift lead | Section 5 (tier meetings), 6 (board), 9 (gemba walk), 10 (leader standard work) |
| Plant manager or VP of operations | Section 3 (benefits), 13 (culture and employee monitoring rules), 14 (rollout), 15 (common mistakes) |
| Microsoft 365 or Azure admin | Section 16 (analog or digital), 17 (Microsoft 365 including the build plan), 18 (data integration) |
| Lean coach, CI manager or project lead | Section 4 (elements), 8 (problem solving), 14 (roadmap with maturity check) |

## Table of contents

1. [What is shop floor management? Definition and scope](#what-is-shop-floor-management-definition-and-scope)
2. [Origins: gemba, genchi genbutsu and the Toyota Production System](#origins-gemba-genchi-genbutsu-and-the-toyota-production-system)
3. [Goals and benefits](#goals-and-benefits)
4. [The six elements of shop floor management](#the-six-elements-of-shop-floor-management)
5. [Tiered meetings: the daily cascade](#tiered-meetings-the-daily-cascade)
6. [The shop floor board: structure, fields and a sample layout](#the-shop-floor-board-structure-fields-and-a-sample-layout)
7. [Shop floor KPIs: choosing SQDCP metrics that work](#shop-floor-kpis-choosing-sqdcp-metrics-that-work)
8. [Problem solving on the shop floor: from containment to standard](#problem-solving-on-the-shop-floor-from-containment-to-standard)
9. [The gemba walk: steps, questions and checklist](#the-gemba-walk-steps-questions-and-checklist)
10. [Leader standard work: leadership as a routine](#leader-standard-work-leadership-as-a-routine)
11. [Andon: making deviations visible in real time](#andon-making-deviations-visible-in-real-time)
12. [Roles and responsibilities](#roles-and-responsibilities)
13. [Culture, psychological safety and employee monitoring rules](#culture-psychological-safety-and-employee-monitoring-rules)
14. [How to implement shop floor management: a six-phase roadmap](#how-to-implement-shop-floor-management-a-six-phase-roadmap)
15. [Common mistakes and how to fix them](#common-mistakes-and-how-to-fix-them)
16. [Analog or digital? Digital shop floor management compared](#analog-or-digital-digital-shop-floor-management-compared)
17. [Building a digital shop floor board with Microsoft 365](#building-a-digital-shop-floor-board-with-microsoft-365)
18. [Data integration: MES, ERP and machine data](#data-integration-mes-erp-and-machine-data)
19. [Software support: the example of iFAKT Polaris](#software-support-the-example-of-ifakt-polaris)
20. [Glossary](#glossary)
21. [FAQ: shop floor management and gemba walks](#faq-shop-floor-management-and-gemba-walks)
22. [Conclusion](#conclusion)

## What is shop floor management? Definition and scope

The term combines "shop floor" (the production area, more generally the place where value is created) and "management." In US plants the same practice often goes by other names: daily management system, tiered accountability, tier meetings or huddle boards. The underlying idea is the same.

Germany's Institute for Applied Work Science (ifaa, a research institute for industrial engineering and ergonomics) describes shop floor management as leading at the point of value creation, bringing planning, controlling, improving and executing tasks together on the shop floor so that the knowledge of the "experts on site" is put to use [2]. The German Academic Association for Production Technology (WGP) calls it an integrated management system for the systematic development of processes and employees on the shop floor [4]. Remco Peters, whose 2009 book is a standard reference in German-speaking countries, stresses that shop floor management is "not merely a controlling tool but a holistic leadership instrument" [1][6].

Three characteristics follow from these definitions and separate real shop floor management from a KPI wall:

1. **Place:** Leadership happens where value is created, not in the conference room.
2. **Rhythm:** Communication is scheduled, short and standardized. It follows a fixed cascade through the levels of the organization.
3. **Effect:** Every deviation leads to an action with an owner and a due date, and the effect is checked.

### What shop floor management is not

In practice, shop floor management is often confused with related terms. In the US in particular, "shop floor management" is also used by ERP and scheduling vendors to mean shop floor control: releasing, sequencing and tracking work orders. The table below separates the concepts.

| Term | What it is about | Relationship to shop floor management |
|---|---|---|
| Shop floor control / production control | Sequencing, order release, capacity balancing, work order tracking | A subtask; shop floor management uses its results but is a leadership system |
| MES (manufacturing execution system) | IT system for recording and controlling production | Data source and tool, not the leadership system itself |
| Visual management | Making status and deviations visible | An element of shop floor management |
| Gemba walk | A leader goes to where the work is done, observes and asks | An element and leadership routine within shop floor management |
| Continuous improvement / kaizen | Improvement in small, ongoing steps | Result and driver; shop floor management provides the daily platform |
| Lean manufacturing | Overall philosophy for eliminating waste | The broader framework; shop floor management is its daily leadership system |

For the broader framework, see the entity page [Lean management](https://www.m365.fm/entity/lean-management/) and the m365.fm compendium [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned). In Germany this framework is often called a "holistic production system" (Ganzheitliches Produktionssystem). The guideline series VDI 2870 from the Association of German Engineers (VDI) describes its fundamentals (Part 1, July 2012) and a catalog of methods (Part 2, February 2013). VDI has classified both parts as partly in need of revision, and a new edition of Part 2 is in progress [27].

### Shop floor, office floor and other areas

Shop floor management started in manufacturing, but it transfers to any area with recurring work and a measurable result: logistics, maintenance, labs, hospital wards, customer service, engineering. For indirect areas the term "office floor management" has become established [3]. The principles stay the same; the KPIs change. Instead of output and scrap, the board shows, for example, lead time of cases, on-time release of drawings or the ticket backlog.

## Origins: gemba, genchi genbutsu and the Toyota Production System

### Gemba: the "real place"

"Gemba" (sometimes spelled "genba") is Japanese for "the actual place." In lean, it means the place where value-creating work actually happens, usually the shop floor [7][8]. Closely related is **genchi genbutsu**, roughly "real place, real thing." The Lean Lexicon of the Lean Enterprise Institute (LEI) defines it as going to the source to check the facts for yourself [8]. Michael Ballé of LEI draws the distinction this way: gemba is a place, genchi genbutsu is an action [8].

How central this principle is for Toyota shows in "The Toyota Way 2001." In April 2001 Toyota presented two pillars (continuous improvement and respect for people) and five key values. Next to challenge, kaizen, respect and teamwork, genchi genbutsu is explicitly one of them, translated as "go to the source to find the facts" [9].

### Taiichi Ohno and the chalk circle

Taiichi Ohno (1912–1990) is considered the architect of the Toyota Production System; his book "Toyota Production System: Beyond Large-Scale Production" was published in English by Productivity Press in 1988 [13]. A well-known story is attached to him: he is said to have placed new engineers inside a circle drawn in chalk on the shop floor and had them watch for hours until they really saw the problems in the process. The story may be embellished [12], but it captures the core: understanding comes from observation on site, not from reports.

### Masaaki Imai and "Gemba Kaizen"

Masaaki Imai made the term known in the West with his book "Gemba Kaizen: A Commonsense, Low-Cost Approach to Management" (McGraw-Hill, 1997) [10]. The associated "golden rules of gemba management" read as follows in the summary of the Kaizen Institute [11]:

1. When a problem arises, go to the gemba first.
2. Check the gembutsu (machine, tool, material, defective part).
3. Take temporary countermeasures on the spot.
4. Find the root cause.
5. Standardize to prevent recurrence.

These five steps are still the blueprint for problem solving in shop floor management (see section 8).

### Suzaki and the spread of the term

Kiyoshi Suzaki is considered the pioneer of the term "shop floor management" with his book "The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. The German training institute CETPM quotes Constantin May, who calls Suzaki the "father of shop floor management" [3]. Suzaki added to on-site leadership good communication between managers and employees, company-wide understanding of the customer, the ability to learn, and a demand for the highest quality [1]. In German-speaking countries, Remco Peters (2009) [6] and work at the Technical University of Darmstadt (including Hertle et al. on competence development in shop floor management [26]) shaped the discussion. In the US, the same practices spread mostly under the labels lean management system, daily management and leader standard work, notably through David Mann's book "Creating a Lean Culture" [19].

### How widespread is it today?

According to a 2018 study cited by WGP, about 82.5 percent of participating companies had introduced shop floor management, an increase of about 20 percent over three years earlier. It was mostly used in production and adjacent areas, but not at all levels of the hierarchy [4]. WGP does not name the study, so sample and method cannot be checked. The finding points to a core problem in many plants, which section 5 addresses: a team-level board without a working cascade above it has little effect. Comparable representative US figures were not found in the research for this article.

## Goals and benefits

Shop floor management pursues five goals that depend on each other:

| Goal | What actually happens | Measured by |
|---|---|---|
| Transparency | Target and actual are visible to everyone at a glance | How current the board is, share of KPIs with a target |
| Fast response | Deviations are spotted and handled within one shift | Time from deviation to action, escalation lead time |
| Lasting problem solving | Root causes are removed, not symptoms | Repeat rate of the same defect |
| Employee involvement | The knowledge of the people doing the work flows into decisions | Number of implemented ideas, participation in huddles |
| Leadership development | Leaders move from firefighter to coach | Share of leader standard work completed, gemba walk rate |

### What is the evidence?

Solid, independent numbers on the benefit of shop floor management are rare, because its effect is hard to separate from other lean measures. The documented examples are still instructive:

- **fischer (German fastener maker, fischerwerke):** After a nine-month project, the complaint rate fell by 13 percent and process costs by 9 percent; the number of deliveries rose by 11 percent, with the same workforce and on time [3].
- **Schinko (Austrian maker of sheet metal enclosures):** After introducing digital shop floor management, productivity in cutting rose by 20 percent; in bending, where the system was newer, the increase at the time of the report was 10 percent. The article was written by the marketing head of the software vendor involved, GFT, and should be read accordingly [42].
- **Research on digital shop floor management:** The study by the wbk Institute of Production Science at Karlsruhe Institute of Technology (KIT) and the IPRI institute in the ShopfloorPulse project indicates that near-real-time digital information can "considerably" reduce the latency until a fault is fixed, while analog action tracking depends on individual discipline [24][25]. The study is based on 18 companies and is therefore a qualitative snapshot rather than a representative survey.

Many vendor pages on google.com cite much larger gains (for example 25 to 35 percent more productivity) without naming a source. This guide does not repeat such figures. The sober conclusion: shop floor management is not a tool with a guaranteed ROI but a leadership system whose effect depends on how consistently it is run. The following sections show what that consistency depends on.

## The six elements of shop floor management

The literature structures shop floor management in different ways. ifaa distinguishes four visible building blocks (visual management, KPIs, standard communication, systematic problem solving) and three "invisible" foundations (working principles, understanding of roles, sustainability) [2]. Peters identified four core elements: leading on site, recognizing deviations, solving problems sustainably and using resources optimally [1]. WGP names stability and standardization as prerequisites, and performance management, problem solving and improvement management, on-site leadership, visual management and competence development as management elements [4]. US competitor pages typically list five "pillars" with similar content.

The following model brings these views together and has proven itself in practice:

| Element | Key question | Main tools |
|---|---|---|
| 1. Leaders present on the floor | Do leaders see reality for themselves? | Gemba walk, leader standard work |
| 2. Visual management | Can anyone tell in seconds whether things are on plan? | Shop floor board, andon, 5S, status lights |
| 3. KPIs | Do we measure what the team can influence? | SQDCP, OEE, first pass yield |
| 4. Meeting cadence (tiered communication) | Does information flow reliably up and down every day? | Tier meetings, escalation rules |
| 5. Problem solving | Are root causes removed for good? | PDCA, 5 Whys, fishbone (Ishikawa), A3 |
| 6. Standardization | Is what we learned locked in? | Standard work, work instructions |

### Element 1: Leaders present on the floor

LEI describes the gemba mindset this way: you go to the gemba to understand the work, to lead and to learn [15]. Fujio Cho, formerly president and later chairman of Toyota, summed up the attitude of lean leaders in three imperatives: "Go see, ask why, show respect" [15]. Presence does not mean control; it means being reachable and interested. Section 9 describes in detail what presence looks like as a gemba walk.

### Element 2: Visual management

LEI defines visual management as placing all tools, parts, production activities and performance indicators "in plain view," so that the status of the system can be understood at a glance by everyone involved [20]. Visual management is therefore much more than the board: floor markings, shadow boards, kanban cards, andon lights and stack lights on machines are all part of it. [5S](https://www.m365.fm/entity/5s/) is often the foundation, because deviations only stand out in an orderly environment. More: [Visual management](https://www.m365.fm/entity/visual-management/).

### Element 3: KPIs

KPIs make deviations objective. They have to meet three criteria: the team can influence them, they are available promptly, and they have a target. Section 7 covers how to choose them. Basics are on the entity page [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) and in the planned compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Element 4: Meeting cadence

The meeting cadence (German sources call it "Regelkommunikation," standard communication) means short, scheduled, standardized meetings at the board. Its defining feature is the cascade: information and problems flow from the team level through the department level to the plant level, and support and decisions flow back [3][58]. Section 5 provides a complete matrix.

### Element 5: Problem solving

Without problem solving, shop floor management degenerates into a reporting session. What matters is separating quick containment from lasting root cause elimination. Section 8 traces the path from a red dot on the board to an updated standard.

### Element 6: Standardization

Standards are both prerequisite and result. Without a standard there is no deviation, and without updating the standard every improvement gets lost again. WGP therefore names stability and standardization explicitly as prerequisites [4]. More: [Standard work](https://www.m365.fm/entity/standard-work/).

## Tiered meetings: the daily cascade

> **In short:** Each level meets briefly at its board, solves what it can and passes the rest to the next level the same day. That takes fixed meeting times, clear escalation triggers and a duty to respond.

Tiered meetings (also called tier meetings, tiered huddles, stand-ups or daily accountability meetings) are the backbone of the meeting cadence. The idea: each level meets briefly, reviews its KPIs, solves what it can and escalates the rest to the next level, which meets a little later. The Kaizen Institute describes the typical US structure as four tiers, from frontline teams (tier 1) through supervisors (tier 2) and department managers (tier 3) to plant leadership (tier 4), with problems escalated the same day to a named owner [58]. CETPM describes the classic cadence in German plants as daily or per shift at team level, weekly at department level and monthly or quarterly at plant level [3]. In many lean plants a daily meeting is now also common at tiers 2 and 3, so that a problem from the first shift reaches the plant manager the same morning. The ShopfloorPulse study describes the same structure: meetings cascade upward from the shop floor in daily, weekly or monthly rhythms [25]. More on the term on the entity page [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### How long should a tier meeting take?

There are documented guide values. Gelbrich cites about 10 to 12 minutes at the operational level and 20 to 30 minutes at management level; Orth cites 10, at most 20 minutes for stand-up meetings in indirect areas; Schwarz cites a maximum of 15 minutes in his practical example but points out that early meetings during rollout often take 30 minutes or more [3]. Gelbrich counts meetings that run too long, especially during rollout, among the ten most common reasons shop floor management fails [3].

### Tier meeting matrix (sample design)

The following matrix is a sample design for a plant running shifts, based on common practice. Cadence and length follow the documented guide values above; clock times and attendees are suggestions to adapt to your shift model and organization.

| Feature | Tier 1: team | Tier 2: area / supervisor | Tier 3: department / production manager | Tier 4: plant |
|---|---|---|---|---|
| Cadence | every shift, at shift start | daily | daily (alternatively weekly) | daily or weekly, plus a monthly review |
| Time (example: first shift starts 6:00 a.m.) | 6:10 to 6:30 a.m., staggered by line | 8:30 a.m. | 9:15 a.m. | 10:00 a.m. |
| Length | 10 to 15 minutes | 15 minutes | 15 to 20 minutes | 20 to 30 minutes |
| Location | board at the line | area board | department board on the floor | plant board (obeya room or on the floor) |
| Facilitator | team leader | supervisor / shift lead | production or department manager | plant manager |
| Attendees | team of the line or cell | team leaders of the area, maintenance and quality as needed | supervisors, representatives of quality, maintenance, logistics, EHS (environment, health and safety) | department heads, support functions (quality, supply chain, purchasing, HR, finance) |
| Time horizon | last shift, current shift | last 24 hours, today | yesterday, today, this week | week, month, trend |
| Typical KPIs | safety events, units per hour target vs. actual, scrap, downtime, attendance | output, OEE of bottlenecks, first pass yield, backlog | on-time delivery, cost of quality, productivity, open escalations | plant SQDCP view, customer complaints, cost, project status |
| Decisions | staffing, containment, ideas | reallocating people between lines, maintenance priorities | resources across areas, extra shifts, problem-solving teams | capital spending, priorities, target changes |
| Escalate upward when | the problem cannot be solved within the shift or resources are missing | the problem affects several lines or needs a support function | the problem affects customers, budget or several departments | corporate, customer, supplier |

**Second and third shift:** Tier 1 runs every shift; tiers 2 to 4 usually only during the day. So that issues from second and third shift do not get lost, the shift lead enters open escalations on the board or in the shift log and hands them over in person to the first shift. The morning tier 2 meeting starts with these items.

### Escalation rules that work

A cascade is only as good as its escalation rules. Four principles have proven themselves:

1. **Clear triggers instead of gut feeling.** Define for each KPI when to escalate, for example: "line down for more than 30 minutes," "scrap above the limit in two consecutive hours," "injury or near miss: always."
2. **Timing that interlocks.** The next-higher meeting takes place after the lower one so escalations arrive the same day. The facilitator of the lower meeting passes the escalation on in person or via the board.
3. **Duty to respond.** Every escalation gets an answer, at the latest in the next meeting of the lower level. Silence is the fastest way to destroy an escalation culture.
4. **Safety comes first.** Safety issues are escalated immediately, regardless of the cascade.

CETPM describes a faulty link between the levels of shop floor management as a typical stumbling block [3]. This matches the KIT and IPRI study: when actions are tracked on paper, escalation to higher levels breaks down and action tracking "depends on the discipline of individuals" [24].

### Standard agenda for a tier 1 meeting (15 minutes maximum)

The agenda uses the 15-minute upper limit. Well-practiced teams get through it in 10 to 12 minutes, the range Gelbrich cites for the operational level [3].

| Minute | Item | Guiding question |
|---|---|---|
| 0–2 | Safety | Any injuries, near misses or unsafe conditions? |
| 2–6 | KPIs yesterday / last shift | Where are we red, and why? |
| 6–9 | Plan for today | What is today's target? Any constraints on people, material, equipment? |
| 9–12 | Actions | Which open actions are due, what is done, what needs help? |
| 12–14 | Escalations | What do we pass on to tier 2? |
| 14–15 | Wrap-up | Who does what by when? Any recognition for good work? |

Important: the tier meeting names problems, assigns owners and agrees on containment. Root cause analysis happens afterward, in a small group right at the equipment.

## The shop floor board: structure, fields and a sample layout

> **In short:** A good board is readable from about 10 feet (3 m), shows four to six KPIs with targets, follows the meeting agenda from left to right and links every red KPI to an action. The team maintains it itself.

The shop floor board (also called huddle board, tier board, SQDCP board or performance board) is the central tool of the meeting cadence. ifaa describes its tasks this way: it visualizes selected KPIs of an area, shows improvement actions with their status so that their effect on the KPIs can be traced, and contains daily control information, above all the current order and capacity situation [2]. As example categories ifaa lists quality, cost, logistics, safety, personnel, capacity and order situation, and goals and actions (continuous improvement); example KPIs include first pass yield, ppm rates, OEE, on-time delivery, accident figures, 5S status and attendance rate [2].

### Design rules

- **Readable from about 10 feet (3 m):** Red/green status and large numbers, no tables with 30 columns.
- **Four to six KPIs:** CETPM recommends about four to six KPIs the team can influence [3]; the German training provider Haufe Akademie cites five to seven as the upper limit [43].
- **Target next to actual:** Every KPI has a target and a trend.
- **Tell the story left to right:** The board follows the meeting agenda, so the facilitator simply moves from left to right.
- **Actions visible:** Every red KPI is linked to an action or a problem-solving sheet.
- **Owned by the team:** The team maintains the board itself. A board filled in by finance or IT that nobody on the team understands will be ignored.

### Sample layout of a tier 1 board

The following layout shows a board for an assembly line with three rows and five columns. It works on a whiteboard (about 6.5 × 4 ft, or 2 × 1.2 m) just as well as on a screen.

| | Column A: Safety (S) | Column B: Quality (Q) | Column C: Delivery (D) | Column D: Cost / productivity (C) | Column E: People (P) |
|---|---|---|---|---|---|
| **Row 1: status today** | Safety cross (monthly calendar, each day green, yellow or red) | Scrap and rework per shift vs. target | Daily plan target vs. actual, backlog | Units per hour target vs. actual (hour-by-hour chart) | Attendance, skills matrix (who can do what) |
| **Row 2: trend** | Near misses over the last 4 weeks | First pass yield, top 3 defect types (Pareto) | On-time delivery this week | OEE of the bottleneck, top 3 downtime reasons, [micro stops](https://www.m365.fm/entity/micro-stops/) | Vacation and training plan |
| **Row 3: actions** | Open safety actions | Problem-solving sheets / A3s in progress | Escalations to tier 2 and responses | Action list (what, who, by when, status) | Ideas and suggestions with status |

Most boards also have a header with team name, area target and time of the last update, plus a "standards and audits" field (for example, the result of the last 5S audit). Note on column order: the German original of this guide uses SQCDP, which puts cost before delivery; US plants more often write SQDCP. The order of C and D matters less than putting safety first.

### Board content by level

With each level the board becomes more aggregated and the time horizon longer. The MES vendor Symestic describes this as two consistency rules: KPIs are condensed and reviewed less often as you move up, but they must trace back to the same data on every level [41].

| Level | Detail | Typical time horizon | Quality example |
|---|---|---|---|
| Tier 1 | station, hour | shift | defects per hour at station 3 |
| Tier 2 | line, shift | day | scrap rate per line |
| Tier 3 | area, day | week | first pass yield and cost of quality per area |
| Tier 4 | plant, week | month | customer complaints in ppm, cost of poor quality |

## Shop floor KPIs: choosing SQDCP metrics that work

Most boards follow a fixed order of dimensions. The most common is **SQDCP** (or SQCDP): safety, quality, delivery, cost and people [41]. Variants are SQDC (without P), SQDCM (M for morale) or SQDCE with environment. CETPM lists safety, quality, cost, delivery reliability and people topics as typical dimensions [3]. The order is deliberate: safety always comes first.

### Three guiding questions for choosing KPIs

Gelbrich suggests three questions from which suitable KPIs can be derived [3]:

1. What should the output of my process look like in terms of time and quality?
2. How can I show the efficiency of my actions in terms of cost and resources?
3. What reflects responsible execution of my process in terms of safety and the environment?

His central principle, phrased as a twist on a famous Drucker quote: what the team cannot influence should not be measured on its board [3].

### KPI catalog for the shop floor board

| Dimension | KPI | Definition / calculation | Tier |
|---|---|---|---|
| S | Days since last recordable injury | calendar days since the last OSHA-recordable case (see note below) | 1–4 |
| S | Total recordable incident rate (TRIR) | number of recordable injuries and illnesses × 200,000 / total hours worked; 200,000 hours equals 100 full-time workers for a year [51] | 3–4 |
| S | Near misses (reported) | reports per week (more reports are a good sign at first) | 1–3 |
| Q | Scrap rate | scrap quantity / total quantity; see [scrap rate](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | First pass yield (FPY) | good parts on the first pass / parts started | 1–3 |
| Q | Customer complaints | count or ppm | 3–4 |
| D | Units target vs. actual | per hour or per shift | 1–2 |
| D | On-time delivery | orders delivered on time / all orders | 2–4 |
| D | Backlog | open quantity vs. plan | 1–3 |
| C | OEE | availability × performance × quality [22] | 1–3 |
| C | Productivity | good parts per labor hour | 2–4 |
| C | Changeover time | time from the last good part to the first good part of the next order | 1–2 |
| P | Attendance / staffing | present / scheduled employees | 1–2 |
| P | Cross-training level | share of tasks covered in the skills matrix | 1–2 |
| P | Implemented ideas | implemented improvement suggestions per month | 1–3 |

**Note on safety KPIs in US plants:** "Days without an injury" counters are popular, but OSHA has warned that rate-based incentives (for example, a reward for an injury-free month) can discourage reporting. In its October 11, 2018 memo, OSHA states that such programs are permissible under 29 CFR 1904.35(b)(1)(iv) only if they are not implemented in a way that discourages reporting, and that a non-retaliation policy alone "may not, by itself, be adequate" [50]. OSHA recommends a process for reporting injuries, illnesses, close calls/near misses and hazards, including an anonymous option [49]. For the board this means: show near misses and hazard reports next to the injury count, and never tie a team reward to a clean safety cross alone.

OEE (overall equipment effectiveness) comes from total productive maintenance; LEI names six big losses: breakdowns, setup and adjustment, small stops, reduced speed, scrap and rework [22]. On the board, the OEE number itself matters less than the breakdown by loss type, because the team can derive actions from it. The planned m365.fm compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) covers these metrics in depth.

### What research shows about KPIs in shop floor management

In the KIT and IPRI study, 94 percent of the companies surveyed tracked quality and productivity KPIs in shop floor management, while cost KPIs were rarely used [24][25]. Near-real-time digital KPI use was the exception at just over 15 percent of mentions, and deviation forecasting was not a reality at any of the companies surveyed [24].

## Problem solving on the shop floor: from containment to standard

A red field on the board is the beginning, not the end. Problem solving in shop floor management follows a pattern derived directly from the golden rules of gemba management [11]:

| Step | What happens | Who | When |
|---|---|---|---|
| 1. Detect | Deviation becomes visible on the board or via andon | team | immediately or in the tier meeting |
| 2. Contain | Containment protects the customer (e.g., 100 percent inspection, quarantine, spare part) | team leader | in the same shift |
| 3. Understand | Check the gembutsu on site, collect data, observe the process | small team at the equipment | after the meeting |
| 4. Find the root cause | 5 Whys, fishbone diagram, A3 for complex problems | problem-solving team | days to weeks |
| 5. Correct | Implement the permanent countermeasure | owner per action list | as planned |
| 6. Verify the effect | Watch the KPI over a defined period | team leader | after implementation |
| 7. Standardize | Update standard, work instruction and training; share across lines (yokoten) | supervisor, process owner | after the effect is proven |

An action counts as closed only when its effect shows in the KPI. The rule sounds trivial, but many plants break it: action lists are reported "green" while the defect returns the next week.

### Which method for which problem?

| Problem type | Characteristic | Method | Time needed |
|---|---|---|---|
| Simple, cause obvious | cause and fix clear in the meeting | direct action with due date | minutes |
| Recurring, cause unclear | occurs repeatedly, team is not sure of the cause | 5 Whys, fishbone | hours |
| Complex, cross-functional | several causes, several departments | A3 problem solving based on PDCA | weeks |
| Systemic, strategic | affects value stream, layout, product | kaizen event, value stream mapping | weeks to months |

A3 is especially valuable because it puts problem, current state, root cause analysis, target state, countermeasures and follow-up on a single sheet of A3 paper (297 × 420 mm, close to the US 11 × 17 in. tabloid format that most US plants use instead). The entity page [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) offers an introduction, and the planned compendium [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) covers the systemic level. The PDCA cycle (plan, do, check, act), usually attributed to W. Edwards Deming (Deming himself credited Walter A. Shewhart), is the foundation of all problem-solving processes [1].

## The gemba walk: steps, questions and checklist

> **In short:** A gemba walk has a topic, starts at the board, observes the work over several cycles, asks open questions and ends with committed feedback to the team. Without a topic and follow-up it is just a stroll.

The gemba walk is the most important leadership routine in shop floor management. The Lean Lexicon defines it as "a management practice for grasping the current situation through direct observation and inquiry before taking action" [7]. A compact introduction is also available in the post [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) and on the entity page [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Three types of gemba walks

Jim Womack, founder of LEI, says he and Dan Jones first used the term "gemba walk" in the early 1990s, originally for managers walking the entire value stream of a product across departments and companies [14]. Today he distinguishes two forms and sets apart a third, now widespread use of the term [14]:

| Type | Purpose | Typical frequency | Who |
|---|---|---|---|
| Value stream walk | raise awareness of fundamental end-to-end improvement | as needed, e.g., quarterly | plant and area leadership, all functions along the value stream |
| Management system walk | check whether the management system can maintain stability (boards, standards, escalations) | weekly to daily | leaders at all levels |
| Problem-focused walk (genchi genbutsu) | get to the bottom of a specific problem on site | as needed | problem owners, specialists |

Womack is critical of the third use and places it close to "management by walking around": if daily management works, problems should already be solved in the cascade instead of top managers and improvement staff rushing to the gemba to fight fires. Their time is better invested in value stream and management system walks [14].

### LEI's three guiding questions: purpose, process, people

LEI recommends structuring the gemba walk around three dimensions [7]:

1. **Purpose:** What problem does this process solve for the customer?
2. **Process:** How does the work actually run, as opposed to how the standard describes it?
3. **People:** Are the employees engaged in creating, sustaining and improving the process?

LEI also recommends following one product family or customer-facing process from start to finish and bringing everyone involved along, because value flows horizontally across departments [7].

### Gemba walk vs. management by walking around

The gemba walk is often equated with "management by walking around" (MBWA). MBWA started at Hewlett-Packard; co-founder David Packard had picked up the practice at General Electric. It became famous through the book "In Search of Excellence" by Tom Peters and Robert Waterman (1982) [16]. The differences are still considerable:

| Feature | Gemba walk | Management by walking around |
|---|---|---|
| Purpose | understand the process, spot deviations from the standard, build problem-solving capability | closeness to employees, informal exchange, sense of the mood |
| Structure | topic, route, guiding questions, follow-up | mostly unstructured and spontaneous |
| Reference point | standard, KPI, board | people and conversation |
| Result | specific observations, coaching, actions | relationship, information |
| Anchored in | leader standard work, fixed rhythm | personal leadership style |

The two are not mutually exclusive: an informal chat in passing does not replace a gemba walk, but it does not hurt it either. The post [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) compares the two concepts in more detail.

### How to do a gemba walk in seven steps

**1. Set a topic.** Every gemba walk has a focus, for example "changeover on line 4," "use of the new inspection instruction" or "effect of the actions from the tier 3 meeting." Without a topic the walk becomes a tour.

**2. Prepare.** Review the area's KPIs and board, check open actions, bring the standard (work instruction, standard work sheet). Let the team know in advance so the visit is not seen as a surprise inspection. The post [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) has tips.

**3. Start at the board.** The board shows what the team itself sees as a problem. Ask: "What is your board telling you today?"

**4. Observe.** Stay at one workstation and watch several cycles. Compare what you see with the standard. Write down facts, not interpretations.

**5. Ask questions.** Open, respectful questions to the person doing the work. Do not hand out solutions.

**6. Summarize and say thank you.** At the end, briefly reflect back what you learned and agree on what happens with the observations.

**7. Follow up.** Document observations, feed actions into the right tier meeting, give feedback to the team. A walk without feedback undermines trust.

**Do not forget second and third shift.** In a three-shift plant, leaders who walk only during day shift see one third of the operation. Schedule a walk on the off-shifts at least occasionally; problems with staffing, maintenance support and handovers often show up there first (practice recommendation).

**How long should a gemba walk take?** The sources used here give no fixed value. In practice, a focused management system walk in one area takes 20 to 45 minutes; a value stream walk across a whole product family can take half a day. The sample day in section 10 plans 30 minutes. These are practice values, not source statements.

### Gemba walk question bank

**Purpose and goals**
- Who is the customer of this process, and what do they need?
- What is your shift's target today, and how do you know whether you are reaching it?
- Which KPI matters most to you right now, and why?

**Process and standard**
- How does this step normally run? Can you show me?
- Where is the standard written down, and does it match reality?
- How can you tell right away when something is wrong here?
- What happens when material is missing or the machine stops?
- Where do you wait, search for things or have to rework something?

**Problems and problem solving**
- What was the last problem you solved here?
- Which problem costs you the most time right now?
- What happens when you report a problem? How fast does help arrive?
- Which action on the board is overdue, and what does it need?

**People**
- What keeps you from doing your job well?
- What would you change if it were your call?
- Who besides you can do this task?
- What can I do to support you?

### Gemba walk checklist

Print it or turn it into a digital form (see section 17). A longer version with role-specific questions is in the post [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Topic and area are set.
- [ ] KPIs, board status and open actions were reviewed in advance.
- [ ] The relevant standard is at hand (printed or on a tablet).
- [ ] The team or team leader has been informed.
- [ ] Personal protective equipment (PPE) and the area's safety rules are observed.
- [ ] At least one workstation was observed over several cycles.
- [ ] Questions were open; no solutions were dictated.
- [ ] Observations are written down as facts (place, time, what was seen).
- [ ] Good practice was recognized.
- [ ] Agreements were summarized.
- [ ] Actions are entered in the action list or the next tier meeting.
- [ ] Feedback to the team is scheduled.

### Common gemba walk mistakes

| Mistake | Why it hurts | Better |
|---|---|---|
| Gemba walk as inspection | people hide problems | ask instead of audit; treat problems as a gift |
| Dictating solutions on the spot | the team unlearns problem solving, the leader becomes a bottleneck | coach with questions, let the team develop the solution |
| No topic, no route | the walk stays superficial | set a focus, bring the standard |
| Only leaders talk | the experts' knowledge goes unused | listen 80 percent of the time |
| No follow-up | loss of trust, "nothing ever happens anyway" | feedback within one week |
| Irregular walks | the walk looks like a special event | fixed rhythm in leader standard work |
| Blame | fear, problems get hidden | question the process and the system, not people |

Many of these mistakes share a root cause: the walk is understood as control. The post [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) goes deeper. Womack describes his own attitude like this: "I've never invented anything. I just take walks, comment on what I see, and give courage to people to try" (as quoted in the foreword by John Shook) [15].

## Leader standard work: leadership as a routine

Leader standard work applies the principle of standard work to leaders. LEI describes it as "kaizen for management": combined with the right leadership behaviors, leader standard work shifts the role of managers away from being the primary problem solvers toward building the problem-solving capability of their people [18].

In "Creating a Lean Culture," David Mann names four main elements of a lean management system: leader standard work, visual controls, a daily accountability process and leadership discipline [19]. The share of standardized work declines with each level of the hierarchy: operators can work to standard 100 percent of the time, a supervisor about 80 percent of the day; at higher levels the share drops further [19].

### Example: leader standard work for a production supervisor

| Time | Activity | Evidence |
|---|---|---|
| 6:00–6:10 a.m. | Shift handover, board check on all lines | Signed handover log |
| 6:10–6:30 a.m. | Attend two of the staggered tier 1 meetings (rotating) | Attendance list |
| 6:30–6:45 a.m. | Process confirmation: check one standard on one line | Audit card |
| 6:45–8:15 a.m. | Presence on the floor: support with breakdowns, resolve material and staffing gaps, check boards | Notes, action list |
| 8:30–8:45 a.m. | Facilitate the tier 2 meeting | Tier 2 board |
| 8:45–9:00 a.m. | Prepare escalations for tier 3 | Escalation list |
| 9:15–9:35 a.m. | Attend the tier 3 meeting | Tier 3 board |
| 10:00–11:00 a.m. | Coach a problem-solving team (A3) | A3 status |
| 1:00–1:30 p.m. | Gemba walk on a focus topic | Notes, actions |
| 1:30–2:00 p.m. | Prepare the shift handover | Handover log |

The plan is a practice example, not a source statement. On a 6:00 a.m. to 2:00 p.m. shift it structures well over two thirds of the day; Mann describes about 80 percent as achievable at this level [19]. The rest stays deliberately open for the unexpected, people issues and projects. Leader standard work is itself visible: many plants post their leaders' standard routines on the board and check off completed items. That creates accountability in both directions.

### Process confirmation (layered process audit)

A key building block of leader standard work is process confirmation: leaders at different levels check briefly and on a fixed rhythm whether a standard is being followed and whether the standard still fits. Several levels check the same processes at different frequencies, for example the team leader daily, the supervisor weekly, the plant manager monthly. In US plants, especially in automotive supply chains, the practice usually goes by the name layered process audit (LPA). Deviations are not punished; they are treated as a sign of an unsuitable standard or missing training.

## Andon: making deviations visible in real time

LEI defines andon as a visual management tool that shows the status of operations in an area at a glance and signals whenever an abnormality occurs [17]. The signal is triggered by a pull cord or button at the workstation, or automatically by a machine sensor. At Toyota the line keeps running after the cord is pulled while the team tries to fix the problem; if that does not succeed within the cycle, the line stops at a fixed position at the end of the station [17]. The lit station number calls the team leader, who is expected to respond quickly [17].

In shop floor management, andon bridges the gap between scheduled meetings: the tier meeting looks at yesterday and plans today, andon handles right now. At Toyota a team leader (hancho) leads a team of five to eight people, responds to line stops and andon calls, leads improvement activities and checks adherence to standard work daily with audit sheets [21]. This matters when transferring the model to Western plants: the Toyota team leader is an hourly employee without disciplinary authority and without a fixed position on the line; they master all of the team's tasks and fill in for breaks, absences or backlogs [21]. If you add this role on top of a lead operator who is fully tied to the line's cycle time, you will not get a fast andon response. The same goes for a team leader responsible for 25 people.

Andon events belong on the board: number of calls per shift, average response time and the most common reasons. Many calls are not a bad sign at first; they show that the team is making problems visible.

## Roles and responsibilities

| Role | Tasks in shop floor management |
|---|---|
| Plant manager | role model, facilitates tier 4, goes to the gemba regularly, decides on resources for escalations, deploys goals (e.g., through hoshin kanri) |
| Department / production manager | facilitates tier 3, coaches supervisors, makes sure the levels are linked |
| Supervisor / shift lead | facilitates tier 2, process confirmation, coaches team leaders |
| Team leader | facilitates tier 1, maintains the board with the team, responds to andon, puts containment in place |
| Operators and technicians | report deviations, contribute ideas, own actions, maintain parts of the board |
| Support functions (quality, maintenance, supply chain, EHS) | attend tiers 2 and 3, take on escalated problems, provide data |
| Shop floor coach / lean or CI specialist | sits in on meetings, gives feedback on facilitation, trains problem solving |
| Employee representatives (union, safety committee; in Germany the works council) | involved early; make sure KPIs are not used to monitor the behavior or performance of individuals (see section 13) |

CETPM describes shop floor coaches who observe meetings and give feedback afterward [3]. This role is often underestimated during rollout: a team leader who has never facilitated a meeting needs concrete feedback in the first weeks.

### How the leader's role changes

| Before | In shop floor management |
|---|---|
| solves problems personally | develops the team's problem-solving capability |
| receives reports in the office | sees reality on the floor |
| asks "Who did this?" | asks "What in the process allowed this?" |
| answers escalations by email | answers escalations in the next meeting |
| judges KPIs | uses KPIs to start a conversation |

## Culture, psychological safety and employee monitoring rules

Shop floor management only works when problems are named openly. That sounds obvious but is not the case in many organizations. A red field on the board that leads to criticism of the team will be painted green next time.

Organizational researcher Amy Edmondson of Harvard shaped the concept of team psychological safety: "a shared belief held by members of a team that the team is safe for interpersonal risk taking" [23]. Her study of 51 work teams at a furniture manufacturer with about 5,000 employees appeared in Administrative Science Quarterly in 1999 [23] and is one of the most cited works on learning behavior in teams. The implication for shop floor management: only in psychologically safe teams are errors reported, near misses documented and standards questioned.

### How leaders build psychological safety at the board

- **Red is welcome.** Thank people for every problem made visible. The reaction to the first red field decides all the ones that follow.
- **Process, not person.** Ask about conditions, not culprits.
- **Show your own mistakes.** Leaders who openly name their own misses lower the threshold.
- **Answer escalations.** People who escalate and never get an answer stop escalating.
- **Implement ideas.** Visible implementation of suggestions is the strongest form of recognition. The KIT and IPRI study criticized that employees often could not see the status of their suggestions, which lowers motivation [24].
- **Do not punish safety reports.** OSHA expects that workers "do not experience retaliation" when they report injuries, illnesses and hazards [49]; the reaction at the board is where that expectation becomes real.

The post [Operational excellence culture on the shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) describes how to anchor such a culture over the long term; the planned compendium [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/) puts it in the larger context. Haufe Akademie names hansei, the Japanese practice of self-critical reflection, as a building block of a positive error culture [43].

### Employee monitoring rules: US labor law and German works councils

A digital board that shows machine data next to user logins can be read as a monitoring system. How much that matters depends on where the plant is. The following is general information, not legal advice; have labor counsel review any digital rollout.

**In the US.** There is no general co-determination right comparable to Germany's, but several rules apply:

- **Unionized plants:** The NLRB has treated the installation and use of hidden surveillance cameras as a mandatory subject of bargaining (Colgate-Palmolive, 1997), a view the Seventh Circuit upheld in National Steel Corp. v. NLRB (2003) [54]. Whether a specific digital board with personal data falls under the duty to bargain is a case-by-case question; the safe route is to involve the union before rollout.
- **Non-union plants:** In October 2022 the then NLRB General Counsel issued memo GC 23-02, which argued that intrusive electronic monitoring can interfere with employees' Section 7 rights under the NLRA and urged disclosure of monitoring technologies [52]. On February 14, 2025 the Acting General Counsel rescinded that memo (GC 25-05) [53]. The NLRA itself has not changed, so monitoring that tends to chill protected activity remains a risk.
- **State notice laws:** Some states require notice of electronic monitoring. New York, for example, requires employers to give prior written notice upon hiring to employees whose telephone, email or internet usage is monitored [55]. A shop floor app that logs individual system usage can fall under such rules.
- **Safety reporting:** As shown in section 7, OSHA rules protect employees who report injuries [49][50]. A board that singles out the person who reported an incident works against that protection.

**In Germany (relevant for US companies with German plants or a German parent).** Involving the works council (Betriebsrat, the elected employee body with legal co-determination rights) is not a formality. ifaa recommends involving it from the start and designing KPIs so that no fear of surveillance arises [2]. With digital boards that use machine and personal data, Section 87(1) No. 6 of the German Works Constitution Act (BetrVG) applies: the works council has a say in "the introduction and use of technical devices designed to monitor the behavior or performance of employees" [44]. According to the Federal Labor Court (BAG), it is enough that a system is objectively suitable for collecting behavior or performance data; the employer's intent to monitor does not matter [48]. That generally applies to Power BI, Power Apps or an MES with user logins. GDPR applies on top. In practice, a works agreement (Betriebsvereinbarung) settles the details.

**What works in both countries:** a written rule that defines which data are shown at which level of aggregation, who may see which reports, how long data are kept and that KPIs rate processes, not people. That is the same content a German works agreement covers, and it gives a US union or workforce a clear answer to "Is this going to be used against us?"

## How to implement shop floor management: a six-phase roadmap

> **In short:** Start with a pilot area, design the board with the team, run it for about three months with coaching, and build the next level only when the one below runs reliably.

ifaa has described a six-phase rollout model and tested it in several small and mid-sized companies; the evaluation showed that the concept can be introduced with simple means [2]. The roadmap below builds on this model and adds the gemba walk, the cascade and digitization.

| Phase | Content | Participants | Duration (guide value) |
|---|---|---|---|
| 1. Set goals | define goals, pilot area and success criteria; plant walk-through | executive leadership, production management, project lead, facilitator | half a day according to ifaa [2] |
| 2. Inform and build awareness | information session with Q&A; involve employee representatives | leadership, managers, pilot area employees, union or works council where applicable | half a day according to the ifaa figure [2] |
| 3. Introduce | design the board with the team, choose KPIs, practice facilitation | managers and employees of the pilot area, 6 to 8 people | two half-day blocks of at most 4 hours each according to ifaa [2] |
| 4. Trial | daily shop floor meetings, coaching, improve the board iteratively | pilot team, coach | about 3 months according to ifaa [2] |
| 5. Check-up | neutral observation of meetings, feedback | internal or external observers | regularly during the trial [2] |
| 6. Validate and roll out | evaluation workshop, standardize board and meeting, build the cascade, further areas | all project participants, then further areas | workshop of 2 to 3 hours according to ifaa [2], rollout depending on plant size |

### Practical recommendations for each phase

**Phase 1:** Choose a pilot area with a stable process, motivated leadership and a visible problem. ifaa speaks of a "lighthouse" that carries the later rollout [2]. An area drowning in chaos is unsuitable, because stability has to come first there.

**Phase 2:** Explain the why, not just the what. Make clear that KPIs rate processes, not people.

**Phase 3:** Let the team design the board. Start with four to six KPIs at most [3] and a simple action list. A perfect board on day one is neither necessary nor useful.

**Phase 4:** The first weeks decide. Meetings take longer at first than they should [3]. A coach observes the meeting and gives the facilitator private feedback afterward. Orth describes about 15 minutes for this, covering one strength, one area for development and one concrete assignment [3]. In the first weeks this pays off daily, later weekly. Gemba walks by the next level of leadership start in this phase.

**Phase 5:** Use a simple assessment (see the maturity check below) to check whether the system works.

**Phase 6:** Build tier 2 only when tier 1 runs reliably, then tiers 3 and 4. Replace existing meetings instead of adding new ones. Gelbrich names it as a typical mistake when shop floor management is not used to replace existing meetings [3].

### Prerequisites and success factors according to ifaa

ifaa names as prerequisites management commitment, a budget of time and money, communication of the project within the company, a defined target state (vision and mission), conviction among the people involved and involvement of the works council [2]. For success it also stresses management that attends the meetings on site, goals that are clearly communicated and cascaded across all levels, employee participation and training, and discipline, consistency and stamina, because shop floor management is not a one-off campaign [2]. In US plants without a works council, the same logic applies to the union or, in a non-union plant, to early and open communication with the workforce.

### Maturity check: is your shop floor management working?

- [ ] The board was updated today, and the team can explain every KPI.
- [ ] Every red KPI has an action with an owner and a due date.
- [ ] Meetings start on time and stay within the time box.
- [ ] Escalations reach the next level the same day and get an answer.
- [ ] Leaders do gemba walks on a fixed rhythm.
- [ ] Actions are closed only after their effect is proven.
- [ ] The number of reported problems and near misses has gone up, not down.
- [ ] At least one existing meeting has been replaced by the tier meeting.
- [ ] Improved processes are documented in updated standards.
- [ ] Employees can see the status of their ideas.

Eight or more yes answers suggest an effective system; fewer than five suggest a board that is more ritual than leadership tool.

## Common mistakes and how to fix them

From observations since 2015 in about 50 German companies across industries, Gelbrich derived ten common reasons why shop floor management fails [3]. The table pairs them with countermeasures.

| Mistake (according to Gelbrich [3]) | Countermeasure |
|---|---|
| unrealistically high expectations without direct management engagement | the plant manager facilitates tier 4 personally and goes to the gemba regularly |
| faulty link between the levels of shop floor management | interlocking cascade, defined escalation triggers, duty to respond |
| content overload with unnecessary information | four to six KPIs, remove everything else from the board |
| complicated, time-consuming information updates | simplify data capture, automate where it makes sense |
| KPIs that are irrelevant to the process | re-derive KPIs with the three guiding questions |
| KPIs the team cannot influence | move them to the next-higher level |
| long update loops and outdated information | make the update a fixed item of the shift handover |
| no countermeasures when deviations are found | rule: no red without an action |
| shop floor meetings that run too long, especially during rollout | time box, stand up, move problem solving out of the meeting |
| shop floor management does not replace existing meetings | meeting inventory, cut duplicates |

Three more mistakes come up often in practice:

- **KPI theater:** KPIs are presented but not discussed. The question "What do we do now?" is missing.
- **Gemba tourism:** Leaders walk through the plant with no topic, no questions and no follow-up.
- **Going digital too early:** A plant introduces software before the routines are in place. What gets digitized is a process nobody lives.

## Analog or digital? Digital shop floor management compared

The question "whiteboard or screen?" is often treated as a matter of principle. It can be answered soberly. The available research suggests that the status quo is mostly analog: in the KIT and IPRI study (18 companies), shop floor management was run mainly on paper and only partly with digital support; only about 10 percent of meetings used a digital shop floor board, and digital display of KPIs usually started only at middle management level [24][25]. The study also describes broken hand-offs between paper, Excel and OneNote with no leading system, which make tracking across levels harder [24].

| Criterion | Analog board | Digital board |
|---|---|---|
| Upfront cost | very low | licenses, hardware, integration |
| Hands-on ownership | the team writes on it, strong identification | risk that the team only consumes |
| How current | depends on manual upkeep | automatic, up to near real time |
| Data quality | transcription errors, gaps | consistent, provided the sources are clean |
| Escalation across levels | manual, error-prone | end to end, traceable |
| Action tracking | individual discipline | system-supported with due dates and reminders |
| Distributed teams, multiple sites | not possible | possible |
| History and analysis | photos, binders | analyzable, trends, patterns |
| Resilience | always works | depends on network and systems |
| Employee monitoring rules | usually uncritical | written data rules recommended (union, state law; works agreement in Germany) |
| OT security | not an issue | network segmentation and access control needed (see section 18) |

### Which approach when?

- **Start analog** when the routines are new, the team is small and the KPIs are easy to capture by hand. The whiteboard forces you to keep it lean.
- **Go hybrid** when machine data flow automatically to a screen but actions and ideas are still maintained by hand at the board. For many plants this is the best compromise.
- **Expand digitally** when several levels, shifts or sites must be linked, when manual data capture is too much effort or when actions get lost between levels.

CETPM refers to a five-phase model by Müller-Seegers for digitization: project and goal definition, vendor testing and tool selection, pilot (four weeks at most), adjustment phase (only if needed), rollout and operation; overall he expects about six months [3]. More important than the tool is the order: routine first, digital second. The post [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) shows how to improve material flow in parallel.

## Building a digital shop floor board with Microsoft 365

> **In short:** Teams provides the room, Power BI the KPI wall, Power Apps data capture, Lists the action list and Fabric real-time alerts. The biggest levers are licenses for viewers, the Power BI refresh interval and the data model.

Many manufacturers already use Microsoft 365 for email, Teams and documents. It makes sense to build the digital shop floor board where employees already work. The building blocks below are documented on Microsoft Learn; check license requirements and availability for your own tenant before a project. US public-sector and defense suppliers on Microsoft's government clouds (GCC, GCC High) should check feature availability there separately.

### Reference architecture at a glance

| Board function | Microsoft building block | What it does (according to Microsoft documentation) |
|---|---|---|
| Communication space per area | Microsoft Teams (one team per area, one channel per line or tier) | channels with tabs for board, actions and apps |
| Visualize KPIs | Power BI, embedded as a tab in Teams | interactive reports in channels and chats, link previews, notifications in the activity feed [28] |
| KPIs with targets | Power BI Metrics (scorecards) | metrics with owners, current value and target, status, check-ins; as a tab in channels or meetings [31] |
| Data capture at the workstation | Power Apps (canvas app as a Teams tab) | custom input screens, e.g., for downtime reasons, scrap, ideas [30] |
| Action list, issue tracker | Microsoft Lists (e.g., the "Issue tracker" template) or Planner | lists with views, rules and notifications, stored in SharePoint [38] |
| Standard tasks across sites | Planner with task publishing | distribute task lists to many teams and track completion per location [37] |
| Shift communication | Teams apps for frontline workers (Shifts, Walkie Talkie, Approvals, Updates) | shift schedules, push-to-talk, approvals, recurring updates [35][36] |
| Real-time data and alerts | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | capture, analyze and visualize streaming data and act automatically on conditions [32][33] |

### Power BI as the KPI wall

Power BI reports can be embedded as a tab in a Teams channel, so the team sees and discusses KPIs where it already communicates [28]. Three points matter in practice:

1. **Permissions:** Embedding a report in Teams does not automatically give users permission to view it; permissions have to be granted explicitly [28].
2. **Licenses:** Users with a free Fabric license can view content in a workspace on a Premium capacity (P SKU) or a Fabric capacity of F64 or larger; creating and sharing requires Power BI Pro or Premium Per User [28]. Below F64, every viewer therefore needs a Pro or PPU license. With many viewers on the floor, this is the main cost driver; clarify licensing for display screens at the line with your Microsoft licensing partner.
3. **Limitations:** Power BI dashboards (as opposed to reports) cannot be embedded in the Power BI tab, and the tab does not support URL filters [28].

**How current can a Power BI board be?** Automatic page refresh works for DirectQuery sources, Direct Lake and some live connection scenarios, but not for import mode [29]. In shared capacity (typical with Pro licenses only), the minimum interval is 30 minutes and change detection is not available. In dedicated capacity (Fabric F, Premium P) and with Premium Per User, intervals down to one second are possible with DirectQuery if the capacity admin allows it; the default minimum interval is five minutes, and five seconds for change detection [29]. That is enough for a board that shows units per hour; for true andon functions, Real-Time Intelligence is the better fit.

### Power Apps for data capture at the workstation

Canvas apps built with Power Apps can be added to a Teams channel through the "Power Apps" tab, provided the app has been shared with the users first [30]. Typical shop floor apps:

- downtime reason capture with a few large buttons (e.g., "material missing," "tool breakage," "quality"),
- scrap and rework capture per hour,
- ideas and improvement suggestions with a photo,
- a digital gemba walk checklist with observations and actions,
- process confirmation (layered process audit) on a tablet.

Microsoft lists known limitations, for example that sensors such as location or compass are not supported in the Teams desktop app and that attachments cannot be downloaded in the Teams mobile app [30]. Important for the architecture decision: Dataverse for Teams environments are deprecated [30]. According to Microsoft, no new Dataverse for Teams environments can be created as of November 15, 2026; environments that have not been upgraded are suspended on September 15, 2027 and decommissioned on October 30, 2027 [45]. New solutions should therefore be built on a regular Dataverse environment, SharePoint lists or other data sources.

**The Power Apps licensing question:** Dataverse tables, premium connectors and on-premises data gateways (for example, for an MES database in the plant) require Power Apps premium rights [46]. A capture app based on SharePoint lists usually works with the rights included in Microsoft 365; the Power Platform Licensing Guide describes the exact scope. This fork often decides the cost per user at the line.

### Actions and tasks

Microsoft Lists, usable as a tab in Teams, is a good fit for the action list. Microsoft describes Lists as a tool for tracking information such as issues, assets, routines or incidents with customizable views, rules and notifications; an "Issue tracker" template is available, and the data live in the SharePoint team site [38]. A list with the columns problem, KPI, root cause, action, owner, due date, status, effect verified and escalation level mirrors the action column of the board. A filter per level shows exactly the relevant items in each tier meeting.

Standardized routines, such as daily 5S checks or weekly process confirmations on all lines, can be distributed with task publishing in Planner. Microsoft describes how operations managers can publish task lists to teams in a defined hierarchy and track completion through reports per task and per list; tasks can contain checklists with up to 20 items [37].

### Real time and alerts with Microsoft Fabric

For plants that want to use machine data in real time, Microsoft Fabric Real-Time Intelligence offers several building blocks [32]:

- **Eventstream** captures, transforms and routes large volumes of real-time data without code; connectors include MQTT, Apache Kafka and change data capture from databases. Azure sources such as Event Hubs and IoT Hub are available in the Real-Time hub.
- **Eventhouse** is optimized for time-based streaming events; queries use KQL (Kusto Query Language) or, in the KQL queryset, T-SQL.
- **Real-Time Dashboard** visualizes data in motion.
- **Activator** monitors data streams with low latency (sub-second for stateless rules on streaming data) and triggers actions when thresholds are reached or patterns are detected, including the absence of data. Actions include Teams messages to individuals, groups or channels, emails, Power Automate flows and Fabric items such as pipelines or notebooks [33].

Microsoft explicitly names manufacturing and IoT as scenarios [32]. For shop floor management this means an Activator rule can, for example, post a message to the line's Teams channel when a machine has been down longer than a defined time. That is a digital andon that reaches the team leader on a smartphone. It complements the pull cord and the stack light at the line but does not replace them, as long as not every team leader carries a company phone.

### Example: a tier 1 board in Teams

| Channel tab | Content | Building block |
|---|---|---|
| "Board" | SQDCP page with red/green status, hourly target vs. actual, top 3 downtime reasons | Power BI report |
| "Capture" | downtime reasons, scrap, ideas | Power Apps canvas app |
| "Actions" | action list filtered to tier 1 | Microsoft Lists |
| "Routines" | daily checks, 5S, process confirmation | Planner (published tasks) |
| "Goals" | area goals with check-ins | Power BI Metrics |
| Channel posts | escalations, andon messages, shift handover | Teams, Activator, Power Automate |

### Build plan: six steps to your first digital tier 1 board

For Microsoft 365 admins, the following order has proven itself. It assumes the pilot team already works with an analog board.

1. **Photograph the board and define the KPIs.** Copy the fields and KPIs of the analog board; for each KPI, define formula, source, target and refresh need.
2. **Create the team and channels.** One team per area, one channel per line or tier; permissions through groups instead of individuals.
3. **Build the action list in Microsoft Lists.** Columns as in "Actions and tasks" above, one view per tier, reminder on due date.
4. **Create the capture app.** A canvas app with a few large buttons for downtime reasons and scrap, data in SharePoint lists or Dataverse (mind the licensing question).
5. **Connect the Power BI report.** One report page per board, red/green logic against targets, DirectQuery or Direct Lake if page refresh is needed; embed as a tab in the channel and grant read access.
6. **Test for four weeks in the meeting, then expand.** Only when the team runs the digital board in the tier 1 meeting itself do Activator alerts, Planner routines and the link to tier 2 follow.

Agree on the data rules with employee representatives before step 4 (and, in Germany, with the works council), because from that step on, data that can be traced to individuals may be created.

### What Microsoft 365 does not replace

Microsoft 365 is a toolkit, not a finished shop floor management system. You have to design the cascade logic, the escalation rules, the link between KPI, action and verified effect, and the facilitation discipline yourself. Without a clear data model you quickly end up with a collection of unconnected lists and reports, exactly the broken hand-offs between tools that research criticizes in analog shop floor management [24]. Check the hardware question early, too: large screens at the line, rugged tablets and device accounts for shared devices create their own effort.

## Data integration: MES, ERP and machine data

> **In short:** Units and downtime come automatically from the machine or MES; downtime reasons and ideas are captured simply by hand. Each KPI is defined once and calculated the same way on every level.

A digital board is only as good as its data. Typical sources:

| Source | Data for the board | Typical path |
|---|---|---|
| ERP (e.g., SAP, Microsoft Dynamics 365) | orders, planned quantities, due dates, backlog | data export or connector into Power BI or Fabric |
| MES / production and machine data collection | units, downtime, downtime reasons, OEE, scrap | database or API connection, replication into Fabric |
| Machine controls (PLC, OPC UA) | states, counters, process values | edge gateway, e.g., Azure IoT Operations with the OPC UA connector, then via MQTT |
| Quality management system (QMS) | inspection results, complaints | database or API connection |
| HR and scheduling systems / Shifts | attendance, shift schedule | interface, aggregated |
| Manual capture | downtime reasons, ideas, safety events | Power Apps, Microsoft Lists |

In ISA-95 terms (ANSI/ISA-95, internationally IEC 62264), the board sits on top of level 3 (manufacturing operations management, such as MES) and level 4 (business planning and logistics, such as ERP); the standard primarily deals with the interface between these two levels [56]. Using its vocabulary for orders, materials and equipment makes the board's data model easier to align with MES and ERP.

For connecting machines, Microsoft describes the connector for OPC UA in Azure IoT Operations: it connects to OPC UA servers, reads data and publishes it as JSON messages in OPC UA PubSub format to the MQTT broker; it can also discover assets automatically [34]. From there, data flows in Azure IoT Operations route the data to destinations such as Microsoft Fabric OneLake, Azure Data Explorer or a Kafka endpoint [47]. The documentation reviewed here does not describe an OPC UA connector directly in Fabric; the path goes through the edge gateway.

As soon as machine networks are connected to cloud services, OT security becomes part of the project. The ISA/IEC 62443 series addresses the security of industrial automation and control systems and connects operations and IT [57]; the NIST Cybersecurity Framework (CSF) 2.0, published February 26, 2024, describes itself as a taxonomy of high-level cybersecurity outcomes and can serve as a reference for governing that work [59]. A shop floor board should read data from the OT network, not open a path into it.

### Principles for the data architecture

1. **One truth per KPI.** Define each KPI once (formula, source, granularity) and use that definition on every level. That way OEE on the tier 1 board matches OEE in the plant report.
2. **Automate what is stable.** Units and downtime come from the machine or MES. Downtime reasons that people have to judge are captured by hand, simply and quickly.
3. **Latency to match the decision.** Tier 1 needs hourly or real-time values, tier 4 daily or weekly values. Not everything has to be real time.
4. **Privacy and employee rules from the start.** Personal data are aggregated; roles and permissions are documented.

The planned compendium [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) covers these manufacturing IT questions in depth, and [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned) shows where real-time plant data lead next.

## Software support: the example of iFAKT Polaris

> **Note: The author works at iFAKT GmbH.**

Besides building your own board with Microsoft 365, there is specialized software for digital lean management. One example is [Polaris](https://www.m365.fm/entity/polaris/) by [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), based in Stuttgart, Germany. Polaris solutions are listed on Microsoft AppSource, including Polaris VSM for digital value stream mapping [39] and Polaris BSM for business process modeling in digital lean management [40]. The planned compendium [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) describes the product family in detail.

According to the vendor, two modules are relevant for shop floor management [unverified]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** brings tasks directly to the shop floor, for example actions from tier meetings or gemba walks, so they reach the owners at the line and their completion can be tracked.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** displays KPIs in dashboards and supports the KPI wall of the board at the different levels.

Assessment: a specialized solution no more designs your cascade, escalation rules and facilitation discipline for you than a self-built one does. It can, however, pre-structure the link between KPI, action and verified effect and so shorten the work on your own data model. What matters is whether the solution fits your existing IT landscape; the AppSource listing indicates a focus on the Microsoft ecosystem.

Besides Polaris there are many other vendors, such as shop floor modules from MES vendors or standalone lean and tiered-meeting platforms (several of them appear in the competitive analysis above). Regardless of vendor, these questions help with the selection:

- Does the software map the cascade with escalation and response across several tiers?
- Can an action be closed only after its effect is proven?
- Which interfaces to ERP, MES and machines exist, and who maintains them?
- Can the software aggregate KPIs the way your data rules (union agreement, state law, works agreement) require?
- What happens when the network at the line goes down?
- How are viewers licensed, and what does a screen at the line cost?

About the company: iFAKT GmbH has its headquarters at Curiestrasse 2, 70563 Stuttgart, Germany (commercial register Stuttgart HRB 22661) [61]. According to the company, it was founded in 2001 and has about 25 employees (company information, not independently verified). Its website shows a TÜV SÜD seal for ISO 9001 and ISO/IEC 27001 certification [61], and it took second place in the production category of the 2025 Best of Technology Award by the German business weekly WirtschaftsWoche with its Polaris IMS system [60].

## Glossary

| Term | Meaning |
|---|---|
| A3 | problem solving on one sheet of A3 paper (in the US usually 11 × 17 in.): problem, current state, root cause, target, countermeasures, follow-up |
| Andon | signal (pull cord, button, light) that makes a deviation visible at once and calls for help |
| Escalation | passing a problem to the next level when the team cannot solve it itself |
| Gemba | Japanese for "the actual place"; where value is created |
| Gembutsu | the "actual thing" at the gemba: machine, tool, material, defective part |
| Genchi genbutsu | going to see for yourself and checking the facts on site |
| Hoshin kanri | method for deploying company goals across all levels (also called policy deployment) |
| Layered process audit (process confirmation) | short check of a standard by leaders at several levels on a fixed rhythm |
| Leader standard work | fixed, visible daily routines for leaders |
| Obeya | "big room"; a meeting room with all KPIs and projects on the walls |
| OEE | overall equipment effectiveness: availability × performance × quality |
| SQDCP | board structure by safety, quality, delivery, cost, people (also SQCDP) |
| Tier meeting | short regular meeting at the board on a specific level of the hierarchy |
| TRIR | total recordable incident rate: OSHA-recordable cases × 200,000 / hours worked |
| Yokoten | transferring a proven solution to other lines or plants |
| DirectQuery / Direct Lake | Power BI connection modes in which data are queried directly instead of imported; required for automatic page refresh |
| F64 | size of a Microsoft Fabric capacity from which viewers can see content without a paid Power BI license |

## FAQ: shop floor management and gemba walks

### What is shop floor management in simple terms?

Shop floor management means leaders lead where the work is done. The team meets briefly every day at a board with a few KPIs, discusses deviations, agrees on actions and passes problems it cannot solve to the next level of leadership. Leaders go to the floor regularly to see for themselves.

### What are the elements of shop floor management?

Six elements: leaders present on the floor (gemba), visual management, a few KPIs the team can influence, a fixed meeting cadence in tier meetings, structured problem solving and standardization. German research institutes group them slightly differently [2][4], and US vendor pages often speak of five pillars, but the content is the same.

### What does gemba mean?

Gemba (also genba) is Japanese for "the actual place." In lean it means the place where value is created, usually the shop floor [7][8]. Genchi genbutsu, "go and see for yourself," is the related action: gemba is a place, genchi genbutsu is what you do there [8].

### What is a gemba walk?

A gemba walk is a planned visit by a leader to the place where value is created. The leader observes the work, compares it with the standard and asks open questions to understand the situation before taking action [7]. A good walk has a topic, starts at the board and ends with feedback to the team.

### What are the three principles of a gemba walk?

The most quoted version comes from former Toyota chairman Fujio Cho: "Go see, ask why, show respect" [15]. LEI adds three things to look at on the walk: purpose (what problem the process solves for the customer), process (how it actually works) and people (whether they are engaged in improving it) [7].

### What is the difference between shop floor management and a gemba walk?

Shop floor management is the entire leadership system of board, KPIs, tier meetings, problem solving and standards. The gemba walk is one routine within that system: the leader goes to where the work is done, observes and asks questions to understand the situation before acting [7].

### How long should a shop floor meeting take?

About 10 to 15 minutes at team level and 20 to 30 minutes at management level. Gelbrich cites 10 to 12 minutes at the operational level and 20 to 30 minutes at management level; during rollout, meetings often run longer [3].

### What is a tier 1, tier 2 and tier 3 meeting?

A tier meeting is a short, standardized meeting at the board on one level of the organization. Tier 1 is the frontline team, tier 2 the supervisors of an area, tier 3 the department managers and tier 4 plant leadership [58]. The meetings are staggered so problems can be escalated upward the same day.

### What is a shop floor board?

A shop floor board (also huddle board or SQDCP board) is the whiteboard or screen where the team meets for the tier meeting. It shows a few KPIs with target and trend, open actions with owners and due dates, and escalations to the next level. A typical layout has columns by SQDCP and rows for status, trend and actions.

### What does SQDCP stand for?

SQDCP stands for safety, quality, delivery, cost and people (also written SQCDP). The order is the message: safety is discussed first in every meeting. Variants are SQDC, SQDCM (morale) or SQDCE (environment).

### Which KPIs belong on a shop floor board?

Four to six KPIs the team can influence [3], organized by SQDCP: safety (recordable injuries, near misses), quality (scrap, first pass yield), delivery (target vs. actual, on-time delivery), cost or productivity (OEE, units per hour) and people (attendance, cross-training, ideas).

### How often should you do a gemba walk?

There is no universal number. What matters is a fixed, reliable rhythm anchored in leader standard work. In practice, supervisors and shift leads do a topic-based walk daily, department managers several times a week and plant managers at least weekly; value stream walks happen as needed. Team leaders are on the gemba all day anyway and use daily process confirmation instead. More important than frequency is that every walk has a topic and follow-up.

### Who should do a gemba walk?

Leaders at every level, each with a different focus: supervisors and department managers mostly do management system walks (are the boards, standards and escalations working?), plant leadership does value stream walks across functions, and specialists do problem-focused walks [14]. Team leaders work on the gemba anyway and use process confirmation instead. Bring the people who touch the process along, as LEI recommends [7].

### How long should a gemba walk take?

The sources reviewed give no fixed length. A focused walk in one area typically takes 20 to 45 minutes; a value stream walk across a product family can take half a day. Observing several cycles at one workstation matters more than covering ground.

### What questions should you ask on a gemba walk?

Open questions work best, such as "How does this step normally run?", "How can you tell something is wrong?", "What was the last problem you solved here?" and "What can I do to support you?" The full question bank is in the gemba walk section.

### Is a gemba walk the same as management by walking around?

No. MBWA comes from Hewlett-Packard and became known through "In Search of Excellence" (1982) [16]; it is mainly about closeness and informal exchange. The gemba walk is more structured, refers to standards and KPIs and serves to understand the process and build problem-solving capability.

### Does shop floor management work in small companies?

Yes. ifaa tested its rollout model in several small and mid-sized companies and found that it can be introduced with simple means [2]. In small companies two levels are often enough: a team meeting and a leadership meeting.

### Do I need software for shop floor management?

Not to start. A whiteboard, magnets and markers are enough to build the routines. Software pays off when several levels, shifts or sites must be linked, when manual data capture becomes too much effort or when actions get lost between levels [24].

### Can I build a digital shop floor board with Microsoft Teams and Power BI?

Yes. Power BI reports can be embedded as tabs in Teams channels [28], Power Apps handle data capture at the workstation [30], Microsoft Lists the action list [38] and Microsoft Fabric Real-Time Intelligence real-time alerts [32][33]. Mind the license requirements for viewers (free viewers only from Fabric F64 or Premium capacity), the minimum intervals of automatic page refresh in Power BI (30 minutes in shared capacity) and the deprecation of Dataverse for Teams [28][29][45].

### How long does it take to implement shop floor management?

For a pilot area, the ifaa model provides a trial phase of about three months after goal setting, information and introduction workshops [2]. Rolling out to an entire plant with a working cascade across all levels takes considerably longer depending on size, because each level should run reliably before the next one is built.

## Conclusion

Shop floor management is not a board and not software but a leadership system with clear mechanics: leaders go to where value is created, the team makes deviations visible with a few KPIs it can influence, short scheduled tier meetings carry problems the same day to where they can be solved, and every solution becomes the new standard only after its effect is proven. The gemba walk is the routine through which leaders understand instead of assume.

The documented experience shows two things. First, shop floor management is widespread but often fails in the same patterns: missing links between levels, overloaded boards, meetings that run too long and lack of management engagement [3]. Second, the status quo is mostly analog, with broken hand-offs between tools that make escalation and action tracking harder [24]. Digitization can help, but only when the routines are already lived.

For companies on Microsoft 365, a digital board with Teams, Power BI, Power Apps, Lists and Fabric is an obvious option. Plan the data model, licenses, refresh intervals and employee data rules from the start. And begin where every rollout should begin: with one pilot team, one simple board, a 15-minute time box and a leader who listens.

## Further reading on m365.fm

**Blog posts**
- [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Operational excellence culture on the shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Terms**
[Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Tier meeting](https://www.m365.fm/entity/tier-meeting/) · [Visual management](https://www.m365.fm/entity/visual-management/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Micro stops](https://www.m365.fm/entity/micro-stops/) · [Scrap rate](https://www.m365.fm/entity/scrap-rate/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**m365.fm compendiums in English (planned; check links before go-live)**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Germany. On m365.fm he writes about lean management, operational excellence and digitizing manufacturing with Microsoft 365 and Azure. His focus is on how proven lean routines such as shop floor management and the gemba walk can work together with modern data platforms without losing their core.

**Note: The author works at iFAKT GmbH.**

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All sources accessed on November 20, 2026. Sources 1 to 48 are carried over from the German version (re-checked where marked in the review log); sources 49 to 61 were added and verified for the US version. German-language sources are marked (German).

1. Shopfloor Management. Wikipedia (German). https://de.wikipedia.org/wiki/Shopfloor_Management
2. Conrad, R. W.; Eisele, O.: Shopfloor-Management: Führen am Ort der Wertschöpfung. In: Betriebspraxis & Arbeitsforschung 235, ifaa – Institut für angewandte Arbeitswissenschaft e. V., 2019, pp. 18–24 (German). https://www.arbeitswissenschaft.net/fileadmin/Downloads/Angebote_und_Produkte/Publikationen/ifaa_BA_235_Shopfloormanagement.pdf
3. Was ist Shopfloor Management? (glossary). CETPM – Centre of Excellence for Total Performance Management (with references to Gelbrich 2019, Orth, Schwarz, Hartmann/Melas 2020, Müller-Seegers 2020) (German). https://www.cetpm.de/lexikon/was-ist-shopfloor-management/141/
4. Shopfloor Management: Definition, Bedeutung, Kennzahlen. WGP – Wissenschaftliche Gesellschaft für Produktionstechnik (German). https://wgp.de/de/shopfloor-management/
5. Suzaki, K.: The New Shop Floor Management: Empowering People for Continuous Improvement. Free Press, 1993. https://books.google.com/books/about/New_Shop_Floor_Management.html?id=5vMvj0ge92IC
6. Peters, Remco: Shopfloor-Management. Führen am Ort der Wertschöpfung. LOG_X Verlag, Stuttgart 2009, ISBN 978-3-932298-39-4; quote p. 59, core elements p. 39 (cited via [1]; first name per Wikipedia and trade data; German National Library catalog not reachable at the time of access) (German).
7. Gemba Walk (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
8. Ballé, M.: Gemba, workplace, genchi genbutsu, go-and-see … What's the difference? Lean Enterprise Institute, September 14, 2015. https://www.lean.org/the-lean-post/articles/gemba-workplace-genchi-genbutsu-go-and-see-whats-the-difference/
9. Toyota Motor Corporation: 75 Years of Toyota, Section 7: The Functions that Supported Globalization (Toyota Way 2001). https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter4/section7/item4.html
10. Imai, M.: Gemba Kaizen: A Commonsense, Low-Cost Approach to Management. McGraw-Hill, 1997, ISBN 978-0-07-031446-7 (Publishers Weekly review). https://www.publishersweekly.com/9780070314467
11. Gemba and Its Meaning: The Heart of Lean Management. Kaizen Institute. https://kaizen.com/insights/gemba-meaning-lean-management/
12. Genchi Genbutsu. Wikipedia (English). https://en.wikipedia.org/wiki/Genchi_Genbutsu
13. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (publisher page, Routledge). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
14. Womack, J.: Value Stream Walk, Management Walk or … Just Walking Around? Lean Enterprise Institute, June 19, 2018. https://www.lean.org/the-lean-post/articles/value-stream-walk-management-walk-or-just-walking-around/
15. Shook, J.: Foreword. In: Womack, J.: Gemba Walks, 2nd edition. Lean Enterprise Institute, 2013. https://www.lean.org/wp-content/uploads/2021/01/gemba-walks-foreward.pdf
16. Tom Peters: The four-letter word every modern manager needs to know: MBWA. Fortune, December 18, 2015. https://fortune.com/2015/12/18/tom-peters-the-four-letter-word-every-modern-manager-needs-to-know-mbwa/
17. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
18. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
19. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
20. Visual Management (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/visual-management/
21. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
22. Overall Equipment Effectiveness (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
23. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
24. wbk Institute of Production Science (KIT) and IPRI: Auf dem Weg zum digitalen Shopfloor Management. Eine Studie zum Stand der Echtzeitentscheidungsfähigkeit und des Industrie 4.0-Reifegrads (ShopfloorPulse project; 18 companies from more than eight industries; undated, probably 2018/2019) (German). https://www.wbk.kit.edu/downloads/Auf%20dem%20Weg%20zum%20digitalen%20Shopfloor%20Management.pdf
25. Bundesvereinigung Logistik (BVL), IPRI, wbk (KIT): ShopfloorPulse, final report IGF project 19372 N (2017–2019) (German). https://www.bvl.de/files/1951/2125/2131/2133/Abschlussbericht_ShopfloorPulse_19372_N.pdf
26. Hertle, C.; Siedelhofer, C.; Metternich, J.; Abele, E.: The next generation shop floor management: How to continuously develop competencies in manufacturing environments. 23rd International Conference on Production Research, Manila 2015; TUprints TU Darmstadt, 2016. https://tuprints.ulb.tu-darmstadt.de/5253
27. VDI 2870 Part 2: Lean production systems; list of methods (project page for the new edition, possible publication date according to VDI: June 2027). VDI. https://vdi.de/richtlinien/details/vdi-2870-blatt-2-lean-production-systems-list-of-methods
28. Collaborate with Power BI in Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams
29. Automatic page refresh in Power BI Desktop. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-automatic-page-refresh
30. Embed a canvas app as tab app. Microsoft Learn (Power Apps). https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab
31. Use Power BI Metrics to track goals in Microsoft Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/explore-reports/business-user-teams-goals
32. What is Real-Time Intelligence in Microsoft Fabric? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview
33. What is Fabric Activator? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
34. What is the connector for OPC UA? Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
35. Frontline team collaboration. Microsoft Learn (Microsoft 365 for frontline workers). https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-team-collaboration?view=o365-worldwide
36. Simplify business processes for frontline teams. Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/simplify-business-processes?view=o365-worldwide
37. Publish task lists to define and track work in your organization. Microsoft Support. https://support.microsoft.com/en-us/teams/shifts/publish-task-lists-to-define-and-track-work-in-your-organization
38. Manage the Lists app for your organization. Microsoft Learn (Microsoft Teams). https://learn.microsoft.com/en-us/microsoftteams/manage-lists-app
39. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
40. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
41. What is shopfloor management? SYMESTIC (German version cited in the German article; English version: https://www.symestic.com/en-us/what-is/shopfloor-management). https://www.symestic.com/de-de/was-ist/shopfloor-management
42. Trummer, R. (GFT Technologies SE): Digitales Shopfloor-Management ermöglicht 20 Prozent mehr Produktivität. Digital Manufacturing Magazin, November 2, 2022 (German). https://www.digital-manufacturing-magazin.de/digitales-shopfloor-management-ermoeglicht-20-prozent-mehr-produktivitaet-a-2b00c53c429d27a792ea7f51627fac4a/
43. Shopfloor Management (glossary). Haufe Akademie (German). https://www.haufe-akademie.de/blog/glossar/shopfloor-management/
44. Section 87 Works Constitution Act (Betriebsverfassungsgesetz, BetrVG): co-determination rights. Federal Ministry of Justice, gesetze-im-internet.de (German). https://www.gesetze-im-internet.de/betrvg/__87.html
45. Important changes (deprecations) coming in Power Apps, Power Automate, and Copilot Studio: Deprecation of Microsoft Dataverse for Teams environments. Microsoft Learn. https://learn.microsoft.com/en-gb/power-platform/important-changes-coming
46. Power Apps licensing FAQs. Microsoft Learn (Power Platform). https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
47. Configure data flow endpoints. Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint
48. Federal Labor Court (Bundesarbeitsgericht), decision of July 16, 2024, 1 ABR 16/23 (headset system; co-determination under Section 87(1) No. 6 BetrVG) (German). https://www.bundesarbeitsgericht.de/wp-content/uploads/2024/11/1-ABR-16-23.pdf
49. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
50. OSHA: Clarification of OSHA's Position on Workplace Safety Incentive Programs and Post-Incident Drug Testing Under 29 C.F.R. § 1904.35(b)(1)(iv). Standard interpretation memorandum, October 11, 2018. https://www.osha.gov/laws-regs/standardinterpretations/2018-10-11
51. TRIR (Total Recordable Incident Rate). National Safety Council, Injury Facts. https://injuryfacts.nsc.org/definitions/trir-total-recordable-incident-rate/
52. Morgan Lewis: Electronic Monitoring and Algorithmic Management: Permissible Labor Practice or Unlawful Oversight? LawFlash, November 8, 2022 (on NLRB GC Memo 23-02, October 31, 2022). https://www.morganlewis.com/pubs/2022/11/electronic-monitoring-and-algorithmic-management-permissible-labor-practice-or-unlawful-oversight
53. NLRB: GC 25-05 Rescission of Certain General Counsel Memoranda. National Labor Relations Board, February 14, 2025. https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda
54. National Steel Corp. v. National Labor Relations Board, 324 F.3d 928 (7th Cir. 2003), discussing Colgate-Palmolive Co., 323 N.L.R.B. 515 (1997). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/324/928/577225/
55. New York Civil Rights Law § 52-c (notice of electronic monitoring by employers). Justia, 2021 New York Laws. https://law.justia.com/codes/new-york/2021/cvr/article-5/52-c-2/
56. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
57. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
58. How should daily management be structured in a manufacturing plant? Kaizen Institute. https://kaizen.com/insights/daily-management-manufacturing-plant/
59. NIST: The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
60. Best of Technology Award 2025: winners (category Produktion: 2nd place iFAKT GmbH, Polaris IMS). WirtschaftsWoche (German). https://award.wiwo.de/bot/gewinner-2025/
61. iFAKT GmbH: imprint (Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart HRB 22661) and home page (TÜV SÜD seal ISO 9001 & ISO/IEC 27001). https://www.ifakt.de/de/imprint and https://www.ifakt.de/

---

# Editorial notes

## Unverified items and items to check before publication

- **iFAKT facts:** Headquarters (Curiestrasse 2, 70563 Stuttgart, HRB 22661) verified in the ifakt.de imprint [61]; TÜV SÜD seal for ISO 9001 and ISO/IEC 27001 verified on the ifakt.de home page [61]; WirtschaftsWoche Best of Technology Award 2025, category production, 2nd place iFAKT GmbH (Polaris IMS) verified on the winners page [60]. Founding year 2001 and about 25 employees remain company information (labeled as such in the text). No other location is mentioned, by design.
- **Disclosure:** The iFAKT section and the author box carry exactly "Note: The author works at iFAKT GmbH." This satisfies the FTC's expectation that a material connection (here: employment) is clearly disclosed. iFAKT does not pay for publication; the article therefore carries no "sponsored" or "paid partnership" label and no `rel="sponsored"`. Open point from the German consistency check: the m365.fm entity page for iFAKT (https://www.m365.fm/entity/ifakt/) is currently labeled "Sponsored" / "Paid partnership"; this contradicts the confirmation that iFAKT does not pay and should be aligned before go-live.
- **Polaris Operator and Polaris Analyzer:** Module descriptions are vendor information [unverified]. AppSource listings were found for Polaris VSM [39] and Polaris BSM [40] only, not for Operator and Analyzer. Check the wording "Polaris solutions are listed on AppSource" against the current AppSource listing.
- **Tier meeting matrix:** Cadence and length are sourced [3][25][58]; clock times, attendees and escalation triggers are a sample design, not a source statement.
- **Leader standard work sample day, gemba walk frequencies and lengths (FAQ and section 9), off-shift walks, second/third shift rule, build plan, software selection questions:** practice recommendations without a source, worded as such.
- **Mann's time shares:** Only "supervisor about 80 percent" is sourced via the review [19]; other percentages per level that circulate online were deliberately left out. Check in the book if needed.
- **"About 80 percent of manufacturers" [3]:** CETPM cites the figure in two places with different primary sources (Gelbrich 2019 and Meiss/Müller 2020). Check the primary source if needed.
- **WGP study 2018 (82.5 percent):** WGP does not name the study [4]. Add the primary source (probably PTW, TU Darmstadt) if found. No comparable representative US figure was found.
- **Imai's golden rules:** The five-rule version is sourced via the Kaizen Institute [11]; the page reference in the book [10] was not checked.
- **Peters 2009 [6]:** First name "Remco" per German Wikipedia (with page references 39 and 59) and trade data (ISBN 978-3-932298-39-4); the German National Library catalog was not reachable during the German review. Do not confuse with the author of this article (Mirko Peters).
- **Microsoft features:** Re-verified on Microsoft Learn on November 20, 2026 for the English version: F64 / P SKU for Fabric Free viewers, permissions not granted by embedding, dashboards and URL filters not supported in the tab [28]; automatic page refresh 30 minutes in shared capacity without change detection, 1 second minimum in dedicated capacity, default 5 minutes / 5 seconds, import mode not supported, Direct Lake supported [29]; Dataverse for Teams dates November 15, 2026 / September 15, 2027 / October 30, 2027 [45]. Carried over from the German review (verified there on the same day): Planner task publishing [37], Activator actions [33], OPC UA connector in Azure IoT Operations, not in Fabric [34][47]. These details change often; re-check before publication and every six months. Government cloud (GCC, GCC High) availability was not checked; the text only advises checking it.
- **US labor law paragraph:** General information, not legal advice. Sources: National Steel Corp. v. NLRB (7th Cir. 2003) with Colgate-Palmolive (1997) [54]; GC 23-02 content via a Morgan Lewis LawFlash [52] (secondary source; the memo itself was not opened); rescission by GC 25-05 on February 14, 2025 per nlrb.gov [53]; New York Civil Rights Law § 52-c [55]. Whether a specific digital board triggers a duty to bargain was deliberately left open. Have the legal team approve the wording.
- **OSHA:** Worker participation page (near-miss and anonymous reporting, no retaliation) [49]; October 11, 2018 memo on rate-based incentive programs [50]; TRIR formula via the National Safety Council [51] (NSC is not OSHA; the formula follows OSHA recordkeeping guidelines per NSC).
- **German labor law paragraph:** Section 87(1) No. 6 BetrVG [44] and BAG 1 ABR 16/23 [48] carried over from the German version (BAG headnote checked there via a secondary source). Not legal advice.
- **Fortune article on MBWA [16]:** secondary source; the HP origin is Peters' own account.
- **Schinko figures [42]:** Schinko is a maker of sheet metal enclosures (corrected in the German review); the article is by the marketing head of the vendor GFT, labeled in the text.
- **KIT/IPRI study [24]:** sample of 18 companies; "just over 15 percent" refers to mentions (user stories), not companies.
- **ifaa phase 2 (half a day):** only in the figure of the ifaa article, not in the running text.
- **Units:** Board size 6.5 × 4 ft (2 × 1.2 m) and reading distance about 10 ft (3 m) are rounded conversions of the German metric values. A3 = 297 × 420 mm; US plants usually use 11 × 17 in. (tabloid) instead.
- **SQCDP vs. SQDCP:** The German original uses SQCDP; the English version uses SQDCP (more common in US plants) and mentions SQCDP as a variant. The sample board columns were reordered accordingly (D before C).
- **Competitive analysis:** Word counts are estimates from page fetches; safetyculture.com pages redirect to mitti.com. Verify the live google.com SERP with an SEO tool (e.g., NeuronWriter) before publication.
- **Table of contents anchors:** English anchors without special characters; test after CMS import.
- **Blog post titles in "Further reading":** English titles were derived from the URL slugs; check them against the live posts (the post `gemba-walk-checklist-questions` was found in the SERP and added for the English version).

## Internal links

- Sister compendiums (absolute English URLs, all marked "(planned)"): lean-manufacturing, operational-excellence, manufacturing-kpis, value-stream-mapping, digital-twin-manufacturing, manufacturing-it-azure, ifakt-polaris. The German version links Operational Excellence, Lean Management, Produktionskennzahlen, Manufacturing IT and iFAKT Polaris; the English version adds value stream mapping (A3/systemic problems) and digital twin (real-time data) where the text naturally leads there. Not linked: production-scheduling-aps and aerospace-production-planning (no natural anchor in this article). Remove "(planned)" once the pages are live.
- Entity pages (`/entity/...`) and community blog posts are unchanged from the German version.

## Schema suggestion (JSON-LD)

1. **Article** (or `TechArticle`): `headline` = H1, `inLanguage` = `en-US`, `author` = Person "Mirko Peters" with `url` https://www.m365.fm/entity/mirko-peters/, `publisher` = m365.fm, `datePublished`/`dateModified`, `about` = "Shop floor management", "Gemba walk", `mentions` = Microsoft Teams, Power BI, Power Apps, Microsoft Fabric, iFAKT Polaris. Keep the author's employment disclosure in the visible text.
2. **FAQPage** with the 20 FAQ questions and answers verbatim (without source markers).
3. **HowTo** for the gemba walk: `name` "How to do a gemba walk", `step` = the seven steps, `tool` = standard / work instruction, notepad or tablet, PPE. Note: Google no longer shows HowTo rich results; the markup can still be used for semantic markup.
4. **BreadcrumbList:** m365.fm › Learn › Shop floor management.
5. Optional **DefinedTermSet** for the glossary (17 terms).

Example (shortened):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Shop Floor Management and Gemba Walks: The Complete Guide to Leading Where the Work Happens",
      "inLanguage": "en-US",
      "url": "https://www.m365.fm/en/learn/shop-floor-management/",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "about": [{"@type": "Thing", "name": "Shop floor management"}, {"@type": "Thing", "name": "Gemba walk"}]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What is a gemba walk?",
         "acceptedAnswer": {"@type": "Answer", "text": "A gemba walk is a planned visit by a leader to the place where value is created. The leader observes the work, compares it with the standard and asks open questions to understand the situation before taking action. A good walk has a topic, starts at the board and ends with feedback to the team."}}
      ]
    }
  ]
}
```

## Recommended graphics

1. Tier cascade diagram (tiers 1 to 4 with clock times and escalation arrows).
2. Sample tier 1 board as an illustration (SQDCP columns, three rows).
3. Gemba walk in seven steps as a horizontal flow, plus a printable checklist (PDF).
4. Microsoft 365 reference architecture (Teams, Power BI, Power Apps, Lists, Fabric, Azure IoT Operations, ISA-95 levels).

## hreflang and cannibalization

- hreflang pair: `en-US` https://www.m365.fm/en/learn/shop-floor-management/ <-> `de-DE` https://www.m365.fm/learn/shop-floor-management/, plus `x-default` per site policy.
- The English entity page "Shop floor management" and the community posts on gemba walks target overlapping queries. The compendium links to all of them; the entity page should link back to the compendium as the in-depth resource. The post "Gemba walk checklist and questions" competes for "gemba walk checklist"; consider linking it prominently from the checklist section (done) and canonicalizing neither.

## Review log

Review of the US English version on November 20, 2026 with five roles in two rounds. Backup of the first draft: `sfm.v1.md` in the session scratchpad. The German review protocol (three rounds, consistency check of November 20, 2026) is the basis; its corrections (Schinko, Womack's two walk types, ifaa prerequisites, Peters' first name, KIT/IPRI sample size, Dataverse dates, Edmondson "furniture manufacturer") are carried over.

### Round 1

**Subject-matter expert, shop floor management / lean (not satisfied):** Substance carries over well, but (1) the gemba walk section ignores second and third shift, where many problems show up; (2) "In US automotive supply chains this practice is widely known as LPA" reads as a sourced fact; (3) the claim that US hospitals run tiered huddles "with the same logic" is plausible but unsourced; (4) the tier matrix is called "field-tested" without evidence.

**SEO specialist, US (not satisfied):** Main keyword is in H1, short answer, first H2 and meta title; US synonyms (daily management system, tiered meetings, huddle board, SQDCP board) are covered. Missing: the PAA questions "What does gemba mean?" and "Who should do a gemba walk?"; the m365.fm post on "gemba walk checklist questions" (ranking in the US SERP) is not linked from the checklist section; meta description was counted as 150 characters but is 147.

**Reader from the US target audience (plant manager and M365 admin) (partly satisfied):** The plant manager finds the US labor law and OSHA material useful and appreciates feet/inches and the second-shift handover rule. The M365 admin at a defense supplier misses a hint that government clouds (GCC, GCC High) may differ in feature availability.

**Fact checker (not satisfied):** Re-verified online: LEI gemba walk lexicon (definition, purpose/process/people), Womack 2018 (early 1990s, two walk types, skepticism about the third use), Shook foreword (Cho quote, "understand work and to lead ... learn"), Edmondson 1999 (definition, 51 teams, about 5,000 employees), Power BI in Teams (F64/P SKU, permissions, dashboards and URL filters), automatic page refresh (30 min shared, 1 s dedicated, 5 min / 5 s defaults, import not supported), Dataverse for Teams dates, Kaizen Institute four tiers and same-day escalation, and all new US sources [49]–[61] (OSHA worker participation, OSHA 2018 memo, NSC TRIR formula, Morgan Lewis on GC 23-02, NLRB GC 25-05, National Steel v. NLRB with Colgate-Palmolive, NY Civil Rights Law § 52-c, ISA-95, ISA/IEC 62443, NIST CSF 2.0, WirtschaftsWoche winners page, ifakt.de imprint and home page). Errors found: (1) the Womack quote had been translated back from German and did not match the original; (2) Edmondson was placed at "Harvard Business School" while the 1999 paper lists Harvard University, and the definition was paraphrased instead of quoted; (3) GC 23-02 must not be presented as current guidance (rescinded February 14, 2025); checked: the draft already says so.

**Critic (not satisfied):** No em-dash chains or AI clichés found. Germanisms remain: "media breaks" (Medienbrüche) three times, "regular communication" (Regelkommunikation) as an element name, "proof of effect" (Wirkungsnachweis). iFAKT section is neutral, disclosure is exact, vendor claims are labeled, alternatives and neutral selection questions are present. Warns against padding the FAQ.

**Discussion and decisions:** SEO wanted more FAQ entries; the critic warned against padding. Decision: add only the two PAA questions with real search demand ("What does gemba mean?", "Who should do a gemba walk?"), each with sourced content. The SME wanted to keep the LPA and hospital remarks as useful US context; the fact checker objected to unsourced claims. Decision: LPA kept as a naming note ("usually goes by the name"), hospital sentence removed. Legal paragraph: the reader wanted a clear yes/no on whether digital boards must be bargained over; the fact checker and critic objected because the sources only cover hidden cameras. Decision: state the case law precisely and leave the board question to labor counsel.

### Optimization 1: what changed

**Facts (old -> new):**
- Womack quote "I never invented anything. I just walk around, comment on what I see, and encourage people to try things" -> verbatim "I've never invented anything. I just take walks, comment on what I see, and give courage to people to try" [15].
- "Amy Edmondson of Harvard Business School ... a shared belief held by team members that ..." -> "Amy Edmondson of Harvard ... 'a shared belief held by members of a team that the team is safe for interpersonal risk taking'" [23].
- "US hospitals that run daily tiered safety huddles apply the same logic." -> removed (unsourced).
- "In US automotive supply chains this practice is widely known as the layered process audit (LPA)." -> "In US plants, especially in automotive supply chains, the practice usually goes by the name layered process audit (LPA)."
- "field-tested sample design" -> "sample design ... based on common practice."
- "Peter Gelbrich, a German lean consultant" -> "Peter Gelbrich, as cited by the German training institute CETPM" (his profession is not stated in the source).
- "ifaa, an employer-funded research institute" -> "ifaa, a research institute for industrial engineering and ergonomics" (funding not sourced).
- NIST CSF 2.0 "a general outcome framework that many US manufacturers use for governance" -> "describes itself as a taxonomy of high-level cybersecurity outcomes and can serve as a reference for governing that work" (adoption claim not sourced).
- Off-shift paragraph: "Leaders who walk only during day shift see one third of the operation" -> "In a three-shift plant, leaders who walk only during day shift see one third of the operation."
- iFAKT company paragraph: "(seal on ifakt.de)", "(confirmed on the award's winners page)" -> numbered sources [60][61]; founding year and headcount labeled as company information.

**Wording (Germanisms, old -> new):**
- "media breaks" (3x) -> "broken hand-offs between paper, Excel and OneNote" / "broken hand-offs between tools".
- Element "Regular communication" -> "Meeting cadence (tiered communication)", with the German term explained once.
- "proof of effect" (2x) -> "verified effect".

**New content:**
- Gemba walk: paragraph "Do not forget second and third shift" (practice recommendation).
- Microsoft 365: note on government clouds (GCC, GCC High).
- FAQ: "What does gemba mean?" and "Who should do a gemba walk?" (FAQ now 20 questions).
- Checklist section links the m365.fm post "Gemba walk checklist and questions".

**SEO:** meta description length corrected to 147 characters; schema FAQPage set to 20 questions.

### Round 2

**Subject-matter expert: satisfied.** The system described can work in a US multi-shift plant; practice values are recognizable as examples; the Toyota team leader caveat and the OSHA note on safety crosses are the kind of detail practitioners need.

**SEO specialist, US: satisfied.** All core keywords and US synonyms appear in H1, H2s, short answer or FAQ; 20 FAQ entries cover the PAA set; the article is more than twice as long as the longest English competitor (Deskera, approx. 5,000–6,000 words) and navigable through reading paths, "In short" boxes and the glossary. Test anchors after CMS import.

**Reader from the US target audience: satisfied.** The plant manager gets a clear legal picture without legalese; the M365 admin gets an order of steps, the licensing forks and the GCC caveat.

**Fact checker: satisfied, with documented open items.** Rechecked the changed passages (Womack quote, Edmondson definition and affiliation, new FAQ answers against [7][8][14]). Open and labeled: Polaris Operator/Analyzer [unverified], iFAKT founding year and headcount (company information), Peters' first name (DNB check), primary source of the WGP study, GC 23-02 content via secondary source [52], GCC availability not checked.

**Critic: satisfied.** No Germanisms or filler found in a final pass; the length comes from substance (US legal context, OSHA, ISA-95/OT security, build plan), not repetition. Remaining risk, as in the German version: the author box needs real practice credentials for E-E-A-T.

**Word count:** `wc -w` of H1 through the end of the Conclusion (including FAQ, excluding "Further reading"): 15,104 words. German original, same range: 11,863 words.
