# SEO metadata

| Field | Value |
|---|---|
| Meta title | A3 Problem Solving in Lean: A3 Report Template, Example (55 characters; before the November 20, 2026 SERP re-check: "A3 Problem Solving: A3 Report Template and Example") |
| Meta description | A3 problem solving explained: the lean A3 methodology, the 7 sections of an A3 report, a worked example with numbers, coaching questions, pitfalls. (149 characters; before the re-check: "A3 problem solving explained: the 7 sections of an A3 report, a filled-in example with root cause and numbers, coaching questions and pitfalls.") |
| Slug | `/en/learn/lean-manufacturing/a3-problem-solving/` (full URL: https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) |
| Parent pillar | [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) |
| Main keyword | A3 problem solving, A3 report |
| Secondary keywords | A3 template, A3 report example, A3 thinking, A3 lean, Toyota A3, A3 problem solving steps, A3 sections, Managing to Learn, John Shook A3, proposal A3, status A3, A3 vs 8D, A3 vs DMAIC, A3 coaching, 11 x 17 A3 |
| Search intent | Informational with strong template/example intent. Audience: engineers, supervisors, CI and quality managers, managers who coach A3s |
| Target word count | 3,000-5,000 words (cluster). Longest competitor fetched with a count: approx. 650 words (asq.org); several top pages not yet counted. Actual H1 to Conclusion (`wc -w`): **4,425 words** (after the SERP re-check and optimization, November 20, 2026; 3,866 after the verification pass) |
| Language version | US English (`en-US`). New article without a German version: no hreflang pair, self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: English results on google.com (US) for "A3 problem solving report", searched November 20, 2026. Word counts are estimates of the main text.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| asq.org/quality-resources/a3-report | approx. 650 | authoritative; left/right section list; three forms (problem-solving, proposal, storyboard); U-2 inspection example in eight blocks | no filled-in template, no coaching guidance, no mistakes |
| lean.org/lexicon-terms/a3-report/ (Lean Enterprise Institute) | short lexicon entry (not counted) | owner whose initials sit on the A3; A3 as a management and mentoring process; paper size | no example, no template |
| montana.edu/dsobek/a3/ (Durward Sobek, Montana State University) | short page (not counted) | research-based ten-step process, NSF-funded, hospital example (45 → under 10 minutes) | steps only via links; no manufacturing example |
| business.adobe.com (What is A3 problem solving), kanbantool.com, leanconstruction.org, phf.org, sc.edu | not fetched in full (shared fetch budget exhausted in this session; see editorial notes) | rank with general explanations and templates | to be checked before publication |

**Questions collected (SERP titles, competitor content and related searches; the People-also-ask box itself could not be captured in this session):** What is A3 problem solving? What are the 7 steps of A3 problem solving? Why is it called A3? What is an A3 report used for? Who invented A3? What is the difference between A3 and 8D? What is the difference between A3 and DMAIC? What are the types of A3? How do you write a good problem statement for an A3?

**How this article beats the competition:** The top results describe the boxes of an A3 but rarely fill one in with real numbers, and almost none explains the part Toyota veterans stress most: the A3 as a coaching dialogue between an owner and a mentor. This article gives a complete manufacturing A3 (on-time delivery, Pareto, 5 Whys, countermeasure comparison, plan, follow-up with a result that first misses the target), a coaching-question table per section, the three A3 types, a review checklist and a comparison with 8D and DMAIC.

**NEURONwriter re-check (analysis of November 11, 2026; query "a3 problem solving", id a0e7d3e8d18d55aa, google.com, English):** NEURONwriter's top 15 organic results have a median of about 720 words and an average content score of 44; its recommended length is 1,102 words. Several top results are short lean.org pages and PDFs. The strongest pages by score:

| Page (NW rank) | Words (NW) | NW content score |
|---|---|---|
| teamassurance.com/blog/a3-thinking-problem-solving (2) | 5,742 | 76 |
| goleansixsigma.com/a3-problem-solving/ (5) | 1,102 | 73 |
| quality-one.com/a3/ (3) | 1,426 | 71 |
| kanbantool.com (A3 problem solving guide) (outside top 15) | 1,475 | 69 |
| business.adobe.com (what is an A3 problem-solving report) (outside top 15) | 2,547 | 63 |
| sixsigmadsi.com/glossary/a3-problem-solving/ (11) | 3,047 | 60 |
| **This article** | 4,425 | **73 before -> 80 after** |

People also ask (NW): What are the 8 steps of Toyota's 8-step problem-solving method? What are the 7 problem-solving techniques? What are the 5 problem-solving steps? What does A3 stand for? NW topics also ask when to use A3 problem solving and what its benefits are; competitor questions include "Is the A3 method the same as PDCA?" and "What is the difference between A3 and kaizen?". The generic "7 techniques" and "5 steps" questions have no single authoritative answer and are not covered.

---

# A3 Problem Solving: How to Write an A3 Report (Template and Worked Example)

*Updated: November 2026 · Reading time: about 17 minutes*

> **Short answer:** A3 problem solving is a Toyota practice of putting a problem, its analysis, the countermeasures and an action plan on a single large sheet of paper, the A3 format (297 × 420 mm; in the US usually 11 × 17 in. tabloid) [1]. It follows the PDCA cycle [2][4]. The sheet is the visible part; the method is a structured dialogue in which a manager coaches the A3 owner through the problem [1][3].

This article is a deep dive under our [lean manufacturing guide](https://www.m365.fm/en/learn/lean-manufacturing/), which introduces the A3 in the context of the full lean toolbox. Here you will find each section of the A3 explained, a fully worked manufacturing example, a blank template, coaching questions for managers, and the mistakes that turn A3s into paperwork.

> **Key takeaways**
> - The A3 report was pioneered at Toyota; Toyota uses it for problem solving, status reports and planning [1].
> - The left side holds the problem (background, current condition, target, root cause); the right side holds the solution (countermeasures, plan, follow-up) [1][4].
> - Every A3 has one owner, whose initials appear in the upper right corner; the owner gets decisions made even without formal authority [1].
> - Sobek and Smalley describe three types: problem-solving, proposal and status A3s [5].
> - John Shook's *Managing to Learn* (LEI, 2008) shows A3 as a mentoring process; it received a Shingo award [3].
> - A good A3 starts at the gemba with data, not with a solution.
> - The A3 is finished only when the follow-up shows the target was met and the new standard is in place.

## Table of contents

1. [What is A3 problem solving?](#what-is-a3-problem-solving)
2. [Why one sheet? The thinking behind the A3 format](#why-one-sheet-the-thinking-behind-the-a3-format)
3. [A3 report sections: the 7 steps from background to follow-up](#a3-report-sections-the-7-steps-from-background-to-follow-up)
4. [Worked example: on-time delivery A3](#worked-example-on-time-delivery-a3)
5. [Blank A3 template](#blank-a3-template)
6. [How to coach an A3: the A3 as a coaching process](#how-to-coach-an-a3-the-a3-as-a-coaching-process)
7. [Three types of A3: problem-solving, proposal, status](#three-types-of-a3-problem-solving-proposal-status)
8. [When to use A3 problem solving, and its benefits](#when-to-use-a3-problem-solving-and-its-benefits)
9. [A3 vs. 8D vs. DMAIC](#a3-vs-8d-vs-dmaic)
10. [Common A3 mistakes](#common-a3-mistakes)
11. [Paper or digital A3?](#paper-or-digital-a3)
12. [FAQ](#faq-a3-problem-solving)
13. [Conclusion](#conclusion)

## What is A3 problem solving?

The Lean Enterprise Institute (LEI) describes the A3 report as a Toyota-pioneered practice of getting the problem, the analysis, the corrective actions and the action plan down on a single sheet of large paper, often with graphics [1]. At Toyota it became a standard way to summarize problem solving, status reports and planning exercises such as value stream mapping [1].

The American Society for Quality (ASQ) adds two useful details: A3 thinking is based on the plan-do-check-act cycle, and the report uses text, pictures, diagrams and charts to present only what is relevant to the problem and its solution [4].

The name comes from the paper. A3 is the international paper size of 297 × 420 mm; the closest US size is 11 × 17 in. tabloid, also called ledger [1][4].

A3 problem solving is not a separate tool from the rest of lean. It is how one turn of the [PDCA cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) is planned, documented and coached. A [kaizen event](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) can be the Do step of an A3, and a [poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) is often its countermeasure.

## Why one sheet? The thinking behind the A3 format

Limiting the whole story to one side of one sheet forces three things.

1. **Distillation.** There is no room for every data set; the owner must choose the facts that matter. Sobek and Smalley list "synthesis, distillation and visualization" among their seven elements of A3 thinking [5].
2. **Logic you can follow.** The sections run in order from background to follow-up. A reader can check whether the countermeasure addresses the root cause and whether the root cause explains the current condition. Sobek and Smalley call this the logical thinking process and "coherency within and consistency across" [5].
3. **Conversation.** A single sheet can be put on a table between two people. Shook describes the A3 process as "the key to Toyota's entire system of developing talent and continually deepening its knowledge and capabilities" [3].

Sobek and Smalley's seven elements of A3 thinking are: logical thinking process; objectivity; results and process; synthesis, distillation and visualization; alignment; coherency within and consistency across; systems viewpoint [5]. They also stress that creating and managing A3 reports matters as much as the reports themselves [5].

## A3 report sections: the 7 steps from background to follow-up

Templates vary between companies. The structure below follows ASQ's section list [4] and the LEI's description of an A3's content [1].

| # | Section | Side | What goes in | PDCA |
|---|---|---|---|---|
| 0 | Title / theme | top | a short problem statement, not a solution ("Late shipments, pump family P") | Plan |
| 1 | Background | left | why this matters now; link to business goals; scope | Plan |
| 2 | Current condition | left | facts and data from the gemba: chart, process sketch, value stream map, Pareto | Plan |
| 3 | Target condition / goal | left | measurable, dated target | Plan |
| 4 | Root cause analysis | left | 5 Whys, fishbone diagram, data that verify the cause | Plan |
| 5 | Countermeasures | right | options considered, the chosen ones, why | Plan / Do |
| 6 | Implementation plan | right | what, who, due date, status | Do |
| 7 | Follow-up / effect confirmation | right | result vs. target, standardization, open issues | Check / Act |

ASQ groups target condition with countermeasures on the right side [4]; many Toyota-style templates keep the target on the left, under the current condition. Both work. What matters is that the target is a number with a date, set before countermeasures are chosen.

The LEI also points to the owner: the author-owner's initials sit in the upper right corner, and that person takes responsibility for getting decisions made and implemented, even without authority over every part [1].

### A3 sections and Toyota's 8-step problem-solving process

Toyota describes its practical problem solving in eight steps [9]. The A3 sections cover the same ground; the mapping below is ours, not Toyota's.

| Toyota step [9] | Where it sits on the A3 |
|---|---|
| 1. Clarify the problem | background and current condition |
| 2. Break down the problem | current condition (Pareto, process sketch) |
| 3. Set a target | target |
| 4. Analyze the root cause | root cause analysis |
| 5. Develop countermeasures | countermeasures |
| 6. Implement countermeasures | implementation plan |
| 7. Evaluate results and process | follow-up |
| 8. Standardize successful processes | follow-up (standardization) |

## Worked example: on-time delivery A3

The data are an illustrative example. Owner: production engineer, pump assembly. Mentor: value stream manager.

**1. Theme:** Late shipments of pump family P

**2. Background.** Pump family P is 38 percent of plant revenue. On-time delivery (OTD) to the customer's requested date fell from 96 percent in Q2 to 88 percent in Q3. Two key customers have issued supplier scorecards in the yellow zone; one has requested a corrective action. Scope: family P from order release to shipping.

**3. Current condition (Q3, 13 weeks).**

- Orders shipped: 433. Late: 52. OTD = 381 / 433 = **88.0%**.
- Pareto of the 52 late orders by first cause:

| Cause | Late orders | Share | Cumulative |
|---|---|---|---|
| waiting for machined housings | 29 | 56% | 56% |
| test bench failures and retest | 12 | 23% | 79% |
| purchased parts missing | 7 | 13% | 92% |
| other | 4 | 8% | 100% |

- Gemba observation at the housing machining center (one five-axis machine, four housing variants, demand 50 per variant per week): each variant runs in batches of 200, about four weeks of cover. Changeovers take 180 minutes; fixtures and tools are prepared while the machine is stopped.

**4. Target.** OTD of family P at 95 percent or more by February 28, measured weekly; no increase in overtime.

At 433 orders per quarter, 95 percent allows at most 21 late orders (433 × 0.05 = 21.7). Removing the housing cause alone would leave 23 late orders, an OTD of 410 / 433 = 94.7 percent, just short. The owner notes this on the A3: housings are necessary but not sufficient; test bench failures must be reduced too.

**5. Root cause analysis (housing branch, 5 Whys).**

| Why? | Answer | Evidence |
|---|---|---|
| Why do assemblies wait for housings? | the needed variant is often not in stock | stockout log: 31 stockouts in Q3 |
| Why is it not in stock? | each variant is made only once every four weeks | schedule history |
| Why every four weeks? | batch size of 200 per variant | routing and schedule |
| Why such large batches? | each changeover costs 180 minutes of machine time | 10 timed changeovers |
| Why 180 minutes? | all fixture and tool preparation happens while the machine is stopped; no standard for setup | changeover video, no setup standard exists |

Root cause: internal setup work that could be done externally, and no setup standard.

A 5 Whys chain follows one path; real problems often have several. That is why each answer in the table carries evidence, and why the owner checks the other Pareto branches separately instead of assuming one root cause explains everything. The test bench branch gets its own short analysis (a leaking seal fixture accounts for 8 of 12 failures, confirmed by teardown).

**6. Countermeasures considered.**

| Option | Effect on cause | Cost | Time to effect | Decision |
|---|---|---|---|---|
| A. Saturday overtime on the machining center | none (more capacity, same batches) | about $2,600 per week [example] | immediate | temporary bridge only, max 4 weeks |
| B. SMED: preset tools offline, fixture cart, setup standard | removes root cause | about $9,000 (cart, second fixture set, presetter time) [example] | 4 to 6 weeks | **chosen** |
| C. Second machining center | hides the cause | about $450,000 capex [example] | 9 to 12 months | rejected |
| D. Replace the seal fixture at the test bench | removes test cause | about $1,200 | 2 weeks | **chosen** |

Option B pays for itself quickly: $9,000 / $2,600 per week of avoided Saturday overtime ≈ 3.5 weeks, and it avoids the $450,000 capex of option C. With changeovers cut from 180 to 45 minutes, the machine can run batches of 50 (one week of cover) with the same total changeover time per week: before, 200 housings per week / 200 per batch = 1 changeover × 180 min = 180 min; after, 200 / 50 = 4 changeovers × 45 min = 180 min. Cover drops from four weeks to one. The method is covered in the [SMED guide](https://www.m365.fm/en/learn/smed-changeover-reduction/) (planned).

**7. Implementation plan.**

| # | Action | Owner | Due | Status |
|---|---|---|---|---|
| 1 | bridge: Saturday shift on machining center | production supervisor | Dec 1-28 | done |
| 2 | video and analyze changeover; split internal/external | engineer + setup operators | Dec 8 | done |
| 3 | build fixture cart, buy second fixture set | maintenance, purchasing | Jan 9 | done |
| 4 | write and train setup standard, all shifts | setup lead | Jan 16 | done |
| 5 | change batch size to 50 in ERP, update kanban | planner | Jan 19 | done |
| 6 | new seal fixture at test bench | test engineer | Dec 15 | done |

**8. Follow-up.** Weekly OTD after implementation (January 19 to February 28, six weeks): average 93.8 percent. Target not yet met. Check shows the housing cause has dropped to near zero, test failures have halved, but purchased-parts shortages rose with the smaller batches pulling parts more often. The owner opens a second PDCA turn with purchasing on the two parts involved; by the end of March the six-week average is 96.1 percent. The setup standard becomes standard work for all setup team members, and it is added to the area's layered audit together with the new batch size. Remaining issue: changeover is at 52 minutes, not 45; next kaizen scheduled.

This follow-up is typical: the first countermeasures work on the targeted cause, the target is still missed, and the second cycle finds what the first one moved. An A3 that reports "target met" after the first cycle is not always wrong, but a mentor should ask how the owner knows.

## Blank A3 template

Print on 11 × 17 in. (tabloid), landscape. Write in pencil.

| LEFT SIDE | RIGHT SIDE |
|---|---|
| **Title** (the problem, not the solution) · Owner (initials, upper right) · Mentor · Date / version | |
| **1. Background:** Why does this matter now? Which business goal does it affect? Scope? | **5. Countermeasures:** Options considered, how each addresses the root cause, cost, time, decision |
| **2. Current condition:** What is happening at the gemba, in numbers? Chart, sketch, Pareto. What is the gap? | **6. Implementation plan:** What, who, when, status |
| **3. Target:** Measurable, dated. How will we know we succeeded? | **7. Follow-up:** Result vs. target (chart), what was standardized, what is still open, what we learned |
| **4. Root cause analysis:** 5 Whys or fishbone; data that confirm the cause | **Containment (optional):** immediate actions that protect the customer until the countermeasures work · **Approvals / review notes** |

## How to coach an A3: the A3 as a coaching process

The LEI stresses that A3 is also a management discipline: a leader challenges a subordinate to solve a problem and coaches by asking questions rather than giving answers, while the subordinate keeps responsibility for gathering the facts and building consensus [1]. Shook, who worked for Toyota for 11 years in Japan and the US [3], built *Managing to Learn* entirely around this: each spread shows a manager's attempts to write an A3 on one side and his boss's questions on the other [3]. In his 2009 MIT Sloan Management Review article "Toyota's Secret: The A3 Report," Shook argues that the goal is more than solving the problem at hand: A3s should make problem solving transparent and teachable [6].

**Coaching questions for each section** [questions compiled for this guide, in the spirit of [1] and [3]]

| Section | Questions a mentor asks |
|---|---|
| Theme | Is this the problem or a solution in disguise? Would the customer recognize it? |
| Background | Why this problem, why now? What happens if we do nothing? |
| Current condition | Did you see it yourself? What do the operators say? What does the data show over time, not just on average? |
| Target | Is it measurable? Ambitious but reachable? Who agreed to it? |
| Root cause | How do you know this is the cause and not a symptom? Can you switch the problem on and off? What data confirms it? |
| Countermeasures | Which other options did you consider? Does each countermeasure address a root cause? Which stakeholders will be affected, and have you talked to them? |
| Plan | Who owns each action? What could delay it? |
| Follow-up | Did the result meet the target? If not, why not? What did we standardize? What would you do differently? |

The rule for mentors is simple: ask, do not write. If the mentor rewrites the A3, the owner learns nothing, and next time brings the problem to the mentor instead of solving it.

**Respect for the owner.** In our experience the format also protects the owner: the discussion is about the facts on the sheet, not about who is to blame. The LEI notes that the process shifts decisions from arguing about who has authority to discussing what is the right thing to do [1].

## Three types of A3: problem-solving, proposal, status

Sobek and Smalley describe three main types [5]; ASQ names the same three, calling the status form a storyboard [4].

| Type | Purpose | Typical sections | Example |
|---|---|---|---|
| Problem-solving A3 | close a gap between actual and standard | background, current condition, target, root cause, countermeasures, plan, follow-up | late shipments, scrap, downtime |
| Proposal A3 | get a decision on a new initiative or investment | background, current condition, proposal, analysis of options, cost and benefit, plan, unresolved issues | new machine, new layout, software introduction |
| Status A3 | report progress on a project or plan | background, plan vs. actual, results, open issues, next steps | quarterly hoshin review, project review |

The LEI also mentions A3s for planning exercises such as value stream mapping and strategy deployment [1]. A [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) project often ends in a proposal A3 for the future state.

## When to use A3 problem solving, and its benefits

Use an A3 when a problem is too big for a quick fix at the line but does not need a full statistical project:

- the gap is measurable and recurring, such as late orders, scrap or downtime on one line;
- the cause is not yet known, or several causes compete;
- the fix needs agreement across departments, for example engineering, purchasing and production;
- you want to develop a person, not only close the problem: the A3 owner learns problem solving with a mentor [1][3].

Skip the A3 for a one-off issue that a team leader can fix within the shift, and use DMAIC when the cause hides in process variation (see the comparison below).

The benefits follow from the format. One concise sheet forces the owner to choose the facts that matter; the left-to-right logic lets anyone verify whether the countermeasures address the root cause; and the A3 problem-solving process gives managers a structured way to coach instead of handing out answers [1][5]. It also creates a record: a library of closed A3s shows what the plant has learned, and a status A3 can replace a long slide deck in a review. The main cost is time. A good A3 takes gemba work, data and several coaching conversations, so limit each owner to one or two active A3s.

## A3 vs. 8D vs. DMAIC

| | A3 | 8D | DMAIC |
|---|---|---|---|
| Origin | Toyota [1] | Ford's *Team Oriented Problem Solving* (TOPS) manual, first published in 1987; common in automotive [8] | Six Sigma |
| Trigger | any gap, improvement or proposal | customer complaint or escape | chronic variation problem |
| Containment | optional section | explicit discipline (D3) | not a formal phase |
| Data depth | moderate, visual | moderate | high, statistical |
| Format | one sheet | multi-page report, often a customer form | project charter plus tollgate reviews |
| Typical duration | weeks to a few months | days for containment, weeks for closure | months |
| Strength | thinking and coaching | customer-facing closure | statistical rigor |

Use the A3 for internal problems and proposals, the 8D when a customer asks for one, and DMAIC when the cause hides in variation that only statistics can find. The [Six Sigma and root cause analysis guide](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned) covers DMAIC and the root cause tools in detail. Many quality teams translate an internal A3 into the customer's 8D form when needed.

## Common A3 mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| solution in the title | "Install a second machine" | name the problem; options come later |
| written at the desk | no gemba data, only ERP reports | go and see; talk to operators |
| vague target | "improve OTD" | number plus date: "≥ 95% by Feb 28" |
| symptom as root cause | "operator error" | ask why the process allowed the error; consider poka-yoke |
| one countermeasure, no options | no comparison, no learning | at least two options with cost and effect |
| countermeasure does not match cause | new software for a setup problem | trace each countermeasure to a cause on the left side |
| A3 closed at "actions done" | no effect check | close only when target met and standard in place |
| mentor writes the A3 | owner disengaged | ask, do not write [1][3] |
| A3 as a form for audits | pages of boxes, no story | one sheet, pencil, revisions visible |
| too many A3s per person | none finished | one or two active A3s per owner |

## Paper or digital A3?

Paper on 11 × 17 in. keeps the A3 short and invites pencil edits during coaching, which is why many lean coaches start with paper. Digital A3s (a spreadsheet, a slide, a shared document, or an A3 module in a CI software tool) help when owners and mentors sit at different sites, when the company wants a searchable library, or when an audit trail is required, for example in AS9100 or IATF 16949 environments. Keep the one-page limit in the digital version: a digital A3 that grows to 15 slides has lost the point. Data that update automatically, such as OTD from the ERP or downtime from the MES, can feed the current condition and follow-up charts; the [manufacturing KPIs guide](https://www.m365.fm/en/learn/manufacturing-kpis/) explains the common definitions.

## FAQ: A3 problem solving

### What is A3 problem solving?

A structured problem-solving and continuous improvement approach developed at Toyota, in which the problem, analysis, countermeasures and action plan are captured on one A3-size sheet and worked through with a mentor [1]. It follows the PDCA cycle [4].

### What does A3 stand for?

It names the paper size: A3 is 297 × 420 mm under the international standard; the closest US size is 11 × 17 in. tabloid [1].

### What are the steps (sections) of an A3?

Seven sections plus a title: background, current condition, target, root cause analysis, countermeasures, implementation plan and follow-up [1][4]. Templates vary in how they group them.

### Who invented the A3 report?

It is a Toyota practice [1]. In the West it became known mainly through John Shook's *Managing to Learn* (2008) and Sobek and Smalley's *Understanding A3 Thinking* (2008) [3][5].

### What are the types of A3 reports?

Problem-solving, proposal and status A3s [5]. ASQ calls the third form a storyboard [4].

### What is the difference between A3 and 8D?

The A3 is a one-page thinking and coaching format for any problem; 8D is a multi-step report with an explicit containment step, often required by automotive customers after a complaint. They can be combined: work the problem on an A3, report it on the customer's 8D form.

### What is the difference between A3 and DMAIC?

DMAIC is a longer Six Sigma project method with statistical analysis and tollgates; the A3 is lighter and used for most everyday problems. A DMAIC project can be summarized on a status A3.

### How long does an A3 take?

From a few weeks for a contained problem to several months for a complex one; the worked example above took about four months, including a second PDCA turn. Writing the first version takes hours; the time goes into gemba observation, root cause confirmation and follow-up [unverified: practitioner estimate].

### What is A3 thinking?

The way of reasoning behind the report. Sobek and Smalley describe seven elements: logical thinking process; objectivity; results and process; synthesis, distillation and visualization; alignment; coherency within and consistency across; and a systems viewpoint [5].

### What are the 8 steps of Toyota's problem-solving method?

Toyota names eight steps: clarify the problem, break down the problem, set a target, analyze the root cause, develop countermeasures, implement countermeasures, evaluate results and process, and standardize successful processes [9]. An A3 report documents these steps on one sheet; the table in the sections chapter maps them to the A3 sections.

### Is the A3 method the same as PDCA?

Not the same, but built on it. PDCA is the improvement cycle; the A3 is the format and coaching process that documents one turn of it, with Plan on the left side and Do, Check and Act on the right [4][5].

### What is the difference between A3 and kaizen?

Kaizen is continuous improvement in general, from small daily ideas to five-day [kaizen events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/). An A3 is a structured problem-solving report for one problem. They work together: an A3 often names a kaizen event as a countermeasure, and the result of a kaizen event can be documented on an A3.

### Can A3 be used outside manufacturing?

Yes. The Montana State University A3 research project reports a hospital team cutting patient transport time from an average of 45 minutes to under 10 minutes [7], and Mark Graban's summary of Shook's 2009 article mentions hospitals using A3s [6].

## Conclusion

The A3 report is one sheet of paper, but A3 problem solving is a way of thinking and a way of managing. The sheet makes the logic visible: from background through current condition, target and root cause on the left, to countermeasures, plan and follow-up on the right. The coaching makes the logic stick: a mentor who asks questions instead of handing out answers develops people who can solve the next problem alone. Start with one real problem, one owner, one mentor and a pencil. Close the A3 only when the follow-up shows the target was met and the new standard is in place.

**Your next steps**

- [ ] Choose one problem with a measurable gap and a named owner
- [ ] Go to the gemba and collect current-condition data before writing anything else
- [ ] Set a numeric, dated target with the mentor
- [ ] Confirm the root cause with data, then compare at least two countermeasures
- [ ] Review the A3 weekly with the mentor using the coaching questions
- [ ] Close it only after the follow-up shows the target met and the standard updated

---

## Further reading on m365.fm

**Parent guide**
- [Lean Manufacturing: Principles, Tools, Implementation, and Limits](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)

**Sibling deep dives**
- [PDCA Cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) (planned)
- [Kaizen and Kaizen Events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) (planned)
- [Poka-Yoke and Mistake Proofing](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) (planned)

**Related guides**
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned)
- [SMED and Changeover Reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)

**Glossary terms (entities)**
[A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about lean manufacturing, operational excellence and the digital transformation of production. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026.

1. A3 Report. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/a3-report/
2. Plan, Do, Check, Act (PDCA). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pdca/
3. Shook, J.: Managing to Learn: Using the A3 Management Process to Solve Problems, Gain Agreement, Mentor and Lead. Lean Enterprise Institute, 2008, 138 pp., ISBN 9781934109205 (Shingo Research and Professional Publication Award recipient). https://www.lean.org/store/book/managing-to-learn/
4. A3 Report. American Society for Quality (ASQ). https://asq.org/quality-resources/a3-report
5. Sobek, D. K. II; Smalley, A.: Understanding A3 Thinking: A Critical Component of Toyota's PDCA Management System. Productivity Press, 2008, 184 pp., ISBN 9781563273605 (2009 Shingo Research and Professional Publication Prize). Routledge. https://www.routledge.com/Understanding-A3-Thinking-A-Critical-Component-of-Toyotas-PDCA-Management/Sobek-II-Smalley/p/book/9781563273605
6. Shook, J.: Toyota's Secret: The A3 Report. MIT Sloan Management Review, Summer 2009; summary and quotes via Lean Blog (Mark Graban). https://www.leanblog.org/2009/07/john-shook-on-a3-reports-in-sloan
7. A3 Process. Montana State University (A3 research project, NSF grant 0115352). https://www.montana.edu/dsobek/a3/index.html
8. Eight disciplines problem solving. Wikipedia (history section, citing Ford's 8-D Problem Solving Overview). https://en.wikipedia.org/wiki/Eight_disciplines_problem_solving (accessed November 20, 2026)
9. Problem Solving Through Toyota Lean Management. Toyota Forklifts blog (Toyota Material Handling, USA), June 10, 2021. https://www.toyotaforklift.com/resource-library/blog/toyota-solutions/problem-solving-through-toyota-lean-management (opened November 23, 2026 for the SERP re-check; lists the eight steps as cited)

# Editorial notes

**URL scheme:** nested cluster URL per the course-expansion brief; an assumption about the final CMS structure.

**Unverified items (marked in text):** time needed for an A3 (practitioner estimate). The 8D origin at Ford (TOPS, 1987) was closed in the verification pass of November 20, 2026 via [8] (Wikipedia citing Ford material; the article notes that the exact history of 8D is disputed). Coaching questions are compiled for this guide and labeled as such.

**Worked example:** illustrative, recalculated: 381 / 433 = 87.99%; 433 × 0.05 = 21.65 → max 21 late orders; 52 − 29 = 23 late → 410 / 433 = 94.69%; Pareto shares 29/52 = 55.8%, 12/52 = 23.1%, 7/52 = 13.5%, 4/52 = 7.7%; changeover load 1 × 180 = 4 × 45 = 180 min; cover 200 / 50 = 4 weeks → 50 / 50 = 1 week; option B payback 9,000 / 2,600 = 3.46 weeks. Cost figures for options A to C are labeled examples. Show the A3 as a graphic, not only as a table.

**Source notes:** [6] is quoted via Mark Graban's summary; link to MIT SMR's own page in the CMS if accessible. [3] and [5] are book pages from the publishers; both describe awards (Shingo Research and Professional Publication Award / Prize).

**Competitive analysis gap:** Adobe, Kanban Tool, Lean Construction Institute, PHF and University of South Carolina pages appear in the top results but could not be fetched in this session (shared fetch budget). Add word counts before publication.

**Vendor claims:** none. **iFAKT:** not mentioned in the body; disclosure in author box only.

**Internal links (body):** parent pillar (first 150 words), siblings PDCA, kaizen, poka-yoke; pillars value stream mapping, manufacturing KPIs, SMED (new), Six Sigma (new).

**Cannibalization:** The parent pillar has an H3 "A3 problem solving" (about 200 words) with a seven-point structure that matches this article. This cluster owns "A3 report", "A3 template", "A3 example". The m365.fm entity page `/entity/a3-problem-solving/` is a glossary entry; link it to this cluster.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "A3 Problem Solving: How to Write an A3 Report (Template and Worked Example)",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/lean-manufacturing/"},
      "about": {"@type": "Thing", "name": "A3 problem solving", "sameAs": "https://www.m365.fm/entity/a3-problem-solving/"}
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What does A3 stand for?", "acceptedAnswer": {"@type": "Answer", "text": "It names the paper size: A3 is 297 by 420 mm; the closest US size is 11 by 17 inch tabloid."}},
        {"@type": "Question", "name": "What are the 8 steps of Toyota's problem-solving method?", "acceptedAnswer": {"@type": "Answer", "text": "Clarify the problem, break down the problem, set a target, analyze the root cause, develop countermeasures, implement countermeasures, evaluate results and process, and standardize successful processes."}},
        {"@type": "Question", "name": "Is the A3 method the same as PDCA?", "acceptedAnswer": {"@type": "Answer", "text": "Not the same, but built on it: the A3 documents one turn of the PDCA cycle, with Plan on the left side and Do, Check and Act on the right."}},
        {"@type": "Question", "name": "What is the difference between A3 and kaizen?", "acceptedAnswer": {"@type": "Answer", "text": "Kaizen is continuous improvement in general; an A3 is a structured problem-solving report for one problem. An A3 often names a kaizen event as a countermeasure."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 3, "name": "Lean Manufacturing", "item": "https://www.m365.fm/en/learn/lean-manufacturing/"},
        {"@type": "ListItem", "position": 4, "name": "A3 Problem Solving", "item": "https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/"}
      ]
    }
  ]
}
```

**Recommended graphics**

1. The worked example as a filled-in A3 sheet (landscape, readable at 1,200 px width).
2. Blank A3 template as a downloadable PDF (11 × 17 in. and A3).
3. Pareto chart of the 52 late orders.
4. OTD run chart with target line, showing the first cycle at 93.8% and the second at 96.1%.

## Review log

Expert-panel review per the course-expansion brief, November 20, 2026: nine roles, three full rounds (Mirko's update: at least three rounds for clusters). Roles: practitioner (US plant manager), academic (IE / operations management professor), IT/OT architect, quality lead (ASQ CQE / Black Belt, IATF 16949 / AS9100), finance (plant controller), worker voice and lean coach, SEO specialist (US), fact checker, critic. Starting point: first full draft (3,719 words H1 to Conclusion).

### Round 1: findings and verdicts

- **Practitioner (changes needed):** The OTD example is convincing because the first cycle misses the target. Missing: a containment field; with a customer corrective action pending, the plant needs immediate protection, which option A delivers but the template does not ask for.
- **Academic (changes needed):** The 5 Whys table follows one causal chain. Readers should be told that real problems have several causes and that each answer needs evidence; otherwise the example teaches single-cause thinking.
- **IT/OT architect (satisfied):** Paper vs. digital section is balanced; MES/ERP feeds for current condition and follow-up are the right use of systems.
- **Quality lead (satisfied with a remark):** 8D containment is D3; the origin row is correctly marked unverified. A3-to-8D translation advice is practical.
- **Finance (changes needed):** Option B vs. A vs. C is the best part, but the payback of B is not stated; add it, and note the avoided capex.
- **Worker voice and lean coach (satisfied):** setup operators appear in the action plan; the "ask, do not write" rule is the right emphasis.
- **SEO specialist (changes needed):** "What are the 7 steps of A3 problem solving?" is a frequent query; the H2 "The sections of an A3 report" does not match it, and the table numbers the title as step 1, giving eight. Competitor table lacks counted pages beyond ASQ.
- **Fact checker (changes needed):** Re-verified online: LEI A3 definition, Toyota uses, owner's initials, management-process description, paper sizes [1]; *Managing to Learn* 2008, 138 pages, ISBN, Shingo award, Shook quote, dialogue format [3]; ASQ: PDCA basis, 11 × 17, three forms incl. storyboard, left/right sections, U-2 example [4]; Sobek and Smalley 2008, 184 pages, 2009 Shingo prize, seven elements, three types [5]; Shook SMR Summer 2009 via Graban [6]; Montana State: NSF grant, three A3 styles, 45 -> under 10 minutes [7]. Errors: (1) "Shook's 2009 article mentions hospital use": the hospital details come from Graban's summary, not verifiably from the article; (2) "Shook's format also protects the owner ... not about who is to blame" is presented as Shook's view without a source.
- **Critic (satisfied with a remark):** No em dashes or clichés; the "respect for the owner" paragraph should be labeled as the author's view (same point as the fact checker).

**Debate:**

- *Seven vs. eight steps:* the academic argued templates vary and a fixed "7" is artificial; SEO argued the query wording matters. Resolution: H2 says "the 7 steps from background to follow-up", the title is shown as row 0, and the text keeps the note that templates vary.
- *Containment:* the quality lead wanted a mandatory containment box (as in 8D); the lean coach argued that most internal A3s have no customer exposure. Resolution: an optional containment field on the right side of the template.
- *Competitor counts:* the SEO specialist asked to estimate missing word counts from snippets; the fact checker refused estimates without a fetch. Resolution: pages listed as "not fetched", with an editor task.

### Optimization 1: what changed (old -> new)

- H2 "The sections of an A3 report" -> "A3 report sections: the 7 steps from background to follow-up"; table rows renumbered 0 (title) to 7; TOC anchor updated.
- Added after the root cause statement: two sentences on 5 Whys following one path, evidence per answer, and checking other Pareto branches.
- Added before the batch arithmetic: "Option B pays for itself quickly: $9,000 / $2,600 per week ... ≈ 3.5 weeks, and it avoids the $450,000 capex of option C."
- "and Shook's 2009 article mentions hospital use [6]" -> "and Mark Graban's summary of Shook's 2009 article mentions hospitals using A3s [6]".
- "Shook's format also protects the owner:" -> "In our experience the format also protects the owner:".
- Template: "**Approvals / review notes**" -> "**Containment (optional):** immediate actions that protect the customer until the countermeasures work · **Approvals / review notes**".
- Metadata: description "(142 characters)" -> "(143 characters)".

### Round 2: verdicts with spot fact check of the changes

- **Practitioner, academic, IT/OT architect, quality lead, finance, worker voice (satisfied).** Finance recalculated 9,000 / 2,600 = 3.46 weeks.
- **SEO specialist (changes needed):** "A3 thinking" is a secondary keyword and Sobek and Smalley's subtitle, but no FAQ answers "What is A3 thinking?"; add it.
- **Fact checker (changes needed):** Shook's Toyota background (11 years in Japan and the US) is on the LEI book page [3] and adds credibility to the coaching section; add it with the citation.
- **Critic (satisfied).**

**Debate:** The critic asked whether the seven elements now appear twice (body and FAQ). Resolution: accepted, because the FAQ answer is the snippet-ready form; the body keeps the explanation.

### Optimization 2: what changed (old -> new)

- "Shook's *Managing to Learn* is built entirely around this:" -> "Shook, who worked for Toyota for 11 years in Japan and the US [3], built *Managing to Learn* entirely around this:".
- New FAQ "What is A3 thinking?" with the seven elements [5].

### Round 3: final verdicts

- **SEO specialist (changes needed, then satisfied):** the FAQ "What are the steps (sections) of an A3?" still said "Typically seven or eight", contradicting the new H2. Changed to "Seven sections plus a title: ...".
- **Fact checker:** satisfied; 7 sources, all cited, every citation number exists. Remaining [unverified]: 8D origin, A3 duration estimate.
- **Practitioner, academic, IT/OT architect, quality lead, finance, worker voice, critic:** satisfied. Critic confirms no iFAKT in the body, author box disclosure exact, no sponsorship wording.

**Optimization 3 (old -> new):** FAQ "Typically seven or eight: title, background, ..." -> "Seven sections plus a title: background, ...".

**Consensus:** All nine roles release the article. Before publication: fetch and count the remaining competitor pages (Adobe, Kanban Tool, LCI, PHF, USC), link MIT SMR's own page for [6] if accessible, and confirm the 8D origin.

**Word count:** `wc -w` on H1 through the end of "Conclusion" (incl. tables and FAQ, excluding Further reading, author box, sources, notes): 3,865 words.

### Round 4: verification pass, November 20, 2026

- Comparison table, 8D origin: "Ford's Team Oriented Problem Solving; common in automotive [unverified]" -> "Ford's *Team Oriented Problem Solving* (TOPS) manual, first published in 1987; common in automotive [8]"; verified on the Wikipedia 8D article (citing Ford's 8-D Problem Solving Overview), which also records MIL-STD-1520 as a possible model and calls the exact history disputed; new source [8]. A Ford primary document was not opened (fetch budget nearly exhausted).
- A3 duration (FAQ): still unverified (practitioner estimate by design).
- Competitor word counts (Adobe, Kanban Tool, LCI, PHF, USC): still open (low priority; not reached).
- No sister-pillar sources in this file.
- Word count: 3,865 -> 3,866 (`wc -w`, H1 to Conclusion).

Sign-off:
- **Fact checker:** satisfied; 8 sources, all cited; one practitioner [unverified] item remains. Replace [8] with a Ford primary source if one becomes available.
- **Critic:** satisfied; table cell stays short.
- **Subject expert (quality lead):** satisfied; TOPS 1987 is the origin automotive quality people know.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** NEURONwriter query a0e7d3e8d18d55aa ("a3 problem solving", google.com, analysis of November 11, 2026; no new analysis created). Content scored with evaluate-content using the article part (H1 to Further reading) and the meta title and description. One new source opened online on November 23, 2026 (Toyota Forklifts blog, new [9]).

**Score:** 73 -> 80 (NW top-15 average 44, best competitor 76).

**Findings:** Core terms well covered (A3 report, root cause, template, PDCA). Gaps: problem statement, fishbone diagram, due date, verify, stakeholder, standard work, team members, concise, A3 problem-solving process; H2 terms "coach", "A3 format", "use A3" missing. PAA "What does A3 stand for?" and "Toyota's 8-step problem-solving method" not answered; NW topics "when to use A3" and "benefits of A3" (importance 7 each) not covered as sections.

**Changes (old -> new):**
1. H2 "Why one sheet? The thinking behind the format" -> "Why one sheet? The thinking behind the A3 format"; H2 "The A3 as a coaching process" -> "How to coach an A3: the A3 as a coaching process" (TOC updated and renumbered).
2. New H3 "A3 sections and Toyota's 8-step problem-solving process" with a mapping table; the eight step names come from the new source [9], the mapping to A3 sections is labeled as ours.
3. New H2 "When to use A3 problem solving, and its benefits" (about 230 words): use cases, when to skip the A3, benefits and the time cost; facts only from [1][3][5].
4. Section table: "the problem in a few words" -> "a short problem statement"; "5 Whys, fishbone, data that confirm the cause" -> "5 Whys, fishbone diagram, data that verify the cause"; "what, who, when, status" -> "what, who, due date, status".
5. Worked example follow-up: "The setup standard and batch size are added to the area's layered audit." -> "The setup standard becomes standard work for all setup team members, and it is added to the area's layered audit together with the new batch size."
6. Coaching question: "Who will be affected" -> "Which stakeholders will be affected".
7. FAQ "Why is it called A3?" -> "What does A3 stand for?" (answer: "It names the paper size ..."); three new FAQs: "What are the 8 steps of Toyota's problem-solving method?" [9], "Is the A3 method the same as PDCA?" [4][5], "What is the difference between A3 and kaizen?" (links the kaizen cluster). JSON-LD FAQPage updated (renamed question plus three new ones).
8. Sources: new [9] "Problem Solving Through Toyota Lean Management", Toyota Forklifts blog, June 10, 2021 (page lists exactly the eight steps as cited; it does not mention A3 or PDCA, so the article does not claim it does).
9. Meta title "A3 Problem Solving: A3 Report Template and Example" -> "A3 Problem Solving in Lean: A3 Report Template, Example" (55 characters; adds "lean", used in 33% of competitor titles); meta description adds "the lean A3 methodology" (149 characters).
10. Word count: 3,866 -> 4,425 (`wc -w`, H1 to Conclusion incl. FAQ).

Sign-off:
- **SEO specialist (US):** satisfied; score 80 tops all analyzed competitors; the main PAA question and both high-importance NW topics are now covered.
- **Critic:** satisfied; the mapping table is clearly labeled as our interpretation, no filler added.
- **Fact checker:** satisfied; [9] was opened and its eight step names match the text word for word; it is a Toyota Material Handling marketing blog, acceptable for step names only; no other new facts.
- **Subject expert (lean coach):** satisfied; the "when to skip the A3" guidance matches practice and keeps the one-or-two-A3s-per-owner rule.
