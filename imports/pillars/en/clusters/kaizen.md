# SEO metadata

| Field | Value |
|---|---|
| Meta title | Kaizen and Kaizen Events: How to Run One That Sticks (52 characters) |
| Meta description | Kaizen events explained: daily kaizen vs. events, a 5-day agenda, team charter, payback example, and how to sustain continuous improvement. (139 characters; before the November 20, 2026 SERP re-check: "Kaizen explained for plants: daily kaizen vs. kaizen events, a 5-day agenda, team charter, worked example with payback, and why gains fade.") |
| Slug | `/en/learn/lean-manufacturing/kaizen/` (full URL: https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) |
| Parent pillar | [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) |
| Main keyword | kaizen, kaizen event |
| Secondary keywords | what is kaizen, kaizen blitz, kaizen workshop, rapid improvement event, continuous improvement, daily kaizen, kaizen event agenda, kaizen team charter, kaizen event steps, kaizen examples manufacturing, kaizen vs kaizen event, kaizen PDCA, kaizen newspaper, kaizen follow-up, Masaaki Imai |
| Search intent | Informational with strong how-to intent ("how to run a kaizen event"). Audience: CI managers, plant and operations managers, supervisors, lean coaches, engineers preparing a first or better event |
| Target word count | 3,000-5,000 words (cluster). Longest competitor fetched: approx. 2,500-2,800 words (tulip.co). Actual H1 to Conclusion (`wc -w`): **5,158 words** (after the SERP re-check and optimization, November 20, 2026; 4,842 after the verification pass) |
| Language version | US English (`en-US`). New article without a German version: no hreflang pair, self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: English results on google.com (US) for "kaizen event" and "kaizen", searched and fetched on November 20, 2026. Word counts are estimates of the main text without navigation, forms and promotional blocks.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| tulip.co/blog/practical-guide-to-kaizen-events/ | 2,500-2,800 | 5-day outline, metrics section, pitfalls, five FAQs | promised templates missing; no worked numbers; no cost or labor/safety guidance; vendor product throughout |
| en.wikipedia.org/wiki/Kaizen | 2,000-2,500 | history, Imai, TWI roots, kaizen types | no agenda, no metrics, no roles, "citation needed" tags, contradictory event length |
| business.adobe.com/blog/basics/what-is-kaizen | 1,700-1,900 | clear definition, event types, Pixar and Nestlé examples | no FAQ, no templates, no data, no failure modes |
| ascm.org/ascm-insights/understanding-kaizen-events/ | approx. 950 | four event types, four phases (preparation, training, implementation, follow-up) | templates only as images, no metrics, no sustainment, no worked example |
| purdue.edu/leansixsigmaonline (kaizen training blog) | 650-750 | sample four-day event table mapped to DMAIC | thin definition, no evidence, no limits, course promotion |
| lean.org/lexicon-terms/kaizen/ (Lean Enterprise Institute) | short lexicon entry (not counted) | authoritative definition, five-day event, four failure modes | no how-to, no templates |

**Questions collected (SERP titles, competitor FAQs and related searches; the People-also-ask box itself could not be captured in this session):** What is a kaizen event? How long does a kaizen event last? What is the difference between kaizen and a kaizen event? What is a kaizen blitz? Who should be on a kaizen team? What are the steps of a kaizen event? How do you sustain improvements after a kaizen event? How do you measure kaizen success? Is kaizen the same as continuous improvement? How does kaizen relate to PDCA?

**How this article beats the competition:** None of the top pages shows a kaizen event with real arithmetic (takt, line balance, WIP, lead time, cost and payback), and none gives a usable charter, agenda and 30-day follow-up list as tables. Only the LEI names failure modes, and nobody cites the empirical research on why kaizen event results fade (Farris; Glover et al.). This article adds both, plus US labor and safety points (union and NLRA committee questions, OSHA ergonomics) and a finance view on hard vs. soft savings, within a focused cluster length.

**NEURONwriter re-check (analysis of November 11, 2026; query "kaizen event", id 2f6ed22f5c1da74a, google.com, English):** NEURONwriter's top 15 organic results have a median of about 870 words and an average content score of 65; its recommended length is 766 words. The strongest pages by score:

| Page (NW rank) | Words (NW) | NW content score |
|---|---|---|
| flowdit.com/kaizen-event/ (5) | 4,030 | 88 |
| blog.invgate.com/kaizen-events (7) | 968 | 84 |
| theleansuite.com/blogs/what-is-a-kaizen-event (9) | 3,522 | 80 |
| kpifire.com/blog/when-should-you-have-a-kaizen-event/ (6) | 628 | 72 |
| blog.kainexus.com (when to use kaizen events) (4) | 802 | 70 |
| business.adobe.com/blog/basics/what-is-kaizen (2) | 1,673 | 65 |
| tulip.co/blog/practical-guide-to-kaizen-events/ (outside top 15) | 3,328 | 65 |
| **This article** | 5,158 | **82 before -> 91 after** |

People also ask (NW): How do you do a kaizen? Is kaizen outdated? What does "kaizen week" mean? What are the 5 main elements of kaizen? Frequent competitor questions: types of kaizen events, when to use a kaizen event, what happens if the event misses its target, 5S vs. kaizen. The "5 main elements" list is not covered because no primary source (LEI, Imai) for a fixed five-element list was available in this session.

---

# Kaizen and Kaizen Events: How to Run Continuous Improvement That Lasts

*Updated: November 2026 · Reading time: about 18 minutes*

> **Short answer:** Kaizen is Japanese for "continuous improvement": many small, incremental changes made by the people who do the work, every day [1]. A kaizen event (also kaizen blitz or kaizen workshop) is the concentrated form: a cross-functional team improves one bounded process in about five days [1]. Events build capability fast, but the Lean Enterprise Institute warns against relying on them alone; daily kaizen is what keeps the gains [1].

This guide is a deep dive under our [lean manufacturing guide](https://www.m365.fm/en/learn/lean-manufacturing/), which places kaizen within the whole Toyota Production System toolbox. Here we go one level deeper: how daily kaizen and kaizen events differ, how to charter and run a five-day event, a worked example with takt time and payback, and what research says about why results fade.

> **Key takeaways**
> - Kaizen means continuous, incremental improvement by everyone; the term became known in the West through Masaaki Imai's 1986 book *Kaizen: The Key to Japan's Competitive Success* [2].
> - Kaizen runs on the PDCA cycle and starts from a standard; without a stable baseline there is nothing to improve against [3].
> - A kaizen event typically lasts five days and follows four phases: preparation, training, implementation, follow-up [1][8].
> - In a field study of 51 kaizen events, management support and goal difficulty were the most consistent predictors of event outcomes [5].
> - Sustaining results is the hard part; established kaizen programs report sustainability as a recurring struggle [7].
> - Count results in safety, quality, delivery and cost, never in the number of events held [1].
> - Freed labor hours are soft savings until a manager redeploys them or cuts overtime; say so in the event report.

## Table of contents

1. [What is kaizen?](#what-is-kaizen)
2. [What is a kaizen event (kaizen blitz)? Daily kaizen vs. kaizen events](#what-is-a-kaizen-event-kaizen-blitz-daily-kaizen-vs-kaizen-events)
3. [When to use kaizen events, and types of kaizen events](#when-to-use-kaizen-events-and-types-of-kaizen-events)
4. [How to run a kaizen event: the four phases](#how-to-run-a-kaizen-event-the-four-phases)
5. [Worked example: rebalancing an assembly cell in five days](#worked-example-rebalancing-an-assembly-cell-in-five-days)
6. [Daily kaizen: the idea system that keeps gains](#daily-kaizen-the-idea-system-that-keeps-gains)
7. [Measuring a successful kaizen event: metrics that matter](#measuring-a-successful-kaizen-event-metrics-that-matter)
8. [Why kaizen results fade: what research says](#why-kaizen-results-fade-what-research-says)
9. [People, safety and labor relations](#people-safety-and-labor-relations)
10. [Common kaizen mistakes](#common-kaizen-mistakes)
11. [FAQ](#faq-kaizen-and-kaizen-events)
12. [Conclusion](#conclusion)

## What is kaizen?

The Lean Enterprise Institute (LEI) defines kaizen as continuous improvement: small, incremental changes to processes and systems that add up to large long-term benefits [1]. Two features set it apart from a typical improvement project. First, everyone takes part, operators included. Second, the improvements are small enough to try quickly, so learning cycles stay short.

The word reached Western managers through Masaaki Imai. Born in Tokyo in 1930, Imai incorporated the Kaizen Institute in Switzerland in 1985, published *Kaizen: The Key to Japan's Competitive Success* in 1986 and *Gemba Kaizen* in 1997; he died in 2023 [2]. In US plants the program usually runs under the name continuous improvement (CI).

### Kaizen and PDCA

Every kaizen, large or small, is one turn of the Plan-Do-Check-Act cycle. The LEI describes the link this way: leaders set targets against a stable performance baseline, teams test improvements toward those targets, and measured gains are locked in by updating standardized work [3]. That last step matters. A kaizen that does not end in a new standard is an experiment that will be forgotten. Our [PDCA cycle guide](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) covers the cycle and its history in detail.

### The standard is the starting point

Improvement needs a yardstick. If three shifts run a process three different ways, a kaizen team cannot tell whether its change helped or whether the night shift just had a good week. That is why [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned) comes before kaizen in most lean rollouts: takt time, work sequence and standard work-in-process define the current best way, and kaizen improves it [9].

## What is a kaizen event (kaizen blitz)? Daily kaizen vs. kaizen events

Kaizen happens in two forms. A kaizen event is the concentrated one: a team, one bounded area, one week. Daily kaizen is the continuous one. Both matter, and they reinforce each other.

| | Daily kaizen | Kaizen event (blitz, workshop, rapid improvement event) |
|---|---|---|
| Scope | one station, one problem, one idea | one bounded process or area, e.g. a cell, a changeover, a pick route |
| Who | the work team and its supervisor | cross-functional team of about 6 to 10, full time for the event [unverified: common practice, team size not stated in [1]] |
| Duration | minutes to days per idea | typically five days [1] |
| Typical change | relocate a tool, add a visual cue, fix a fixture | relayout of a cell, new standard work, setup reduction |
| Governance | idea card, team board, supervisor approval | charter, sponsor, facilitator, report-out to leadership |
| Main benefit | builds problem-solving skill in every team [1] | big step change and fast learning in one area [1] |
| Main risk | ideas pile up without implementation | gains lost when people return to old ways [1] |

The LEI is explicit on the balance: events are a good way to build capability and make quick changes, but steady daily kaizen develops frontline problem solving over time, so an organization should not rely on events alone [1].

## When to use kaizen events, and types of kaizen events

A kaizen event is a concentrated, expensive use of people. Use it when the problem is bounded, the team can change the physical process within a week, and the result can be measured before and after.

| Good fit for a kaizen event | Better handled another way |
|---|---|
| a cell misses takt because work is unbalanced | a chronic quality defect with unknown cause: use an [A3](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) or a [Six Sigma DMAIC](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned) project |
| changeovers take hours and block flow (see [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/), planned) | an ERP or MES change that needs months of IT work |
| a workplace is disorganized and searching wastes time (5S event) | a strategic question such as insourcing a product family |
| a repeat assembly error that a fixture or sensor could stop (see [poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/)) | a problem nobody has measured yet: measure first |
| an office workflow with obvious handoff waste (order entry, quoting) | a process that will be replaced within six months |

### Types of kaizen events

ASCM author Peter Sherman groups typical events into four types: waste elimination, error-proofing, lead-time reduction and visual management [8]. A [value stream map](https://www.m365.fm/en/learn/value-stream-mapping/) is the best place to find candidates: the kaizen bursts on a future-state map are, in effect, a list of kaizen events in priority order.

## How to run a kaizen event: the four phases

Sherman describes four phases: preparation, training, implementation and follow-up [8]. The LEI's description of a classic five-day event follows the same arc: learn flow principles, go to the gemba to assess and plan, move machines and test the new cell, then standardize and report to senior management [1]. The templates below turn that arc into working documents.

### Phase 1: Preparation (two to four weeks before)

Most failed events fail here. The sponsor and facilitator write a charter, collect baseline data and clear the calendar of every team member.

**Template: kaizen event charter**

| Field | What to write | Example |
|---|---|---|
| Event name and dates | area plus week | "Valve cell 3 rebalance, March 9-13" |
| Sponsor | the manager who owns the area and can approve changes | value stream manager, assembly |
| Facilitator | trained lean coach, not the area owner | CI engineer |
| Team leader | supervisor or lead from the area | first-shift team lead |
| Team (6-10) | operators from each shift, maintenance, quality, engineering, one outsider | 3 operators, 1 maintenance tech, 1 quality tech, 1 engineer, 1 buyer |
| Problem statement | fact, not solution | "Cell 3 runs 140 s at station 1 vs. 117 s takt; 12 h overtime per week" |
| Scope (in / out) | physical and process boundaries | in: stations 1-4 and their supermarket; out: upstream machining |
| Targets | measurable, dated, stretching | all stations at or below takt; WIP from 38 to 8; overtime 0 |
| Baseline data | collected before day 1 | time studies (10 cycles per station), WIP counts, defect log, overtime record |
| Constraints | budget, safety, labor contract | spend up to $3,000 without further approval; no change to job classifications without HR and union rep |
| Report-out | date, audience | Friday 1:00 p.m., plant manager and staff |

**Readiness checklist (sponsor signs before the event)**

| Check | Done |
|---|---|
| Baseline data collected and validated at the gemba | ☐ |
| Team members released from regular duties for the full week, backfill arranged | ☐ |
| Maintenance and EHS support booked for moves and electrical work | ☐ |
| Materials budget approved | ☐ |
| Union representative or employee representatives informed (where applicable) | ☐ |
| Customer orders protected (build-ahead or temporary overtime) | ☐ |
| Sponsor blocked time for the day 1 kickoff and the day 5 report-out | ☐ |

A note on targets: in Farris's field study of 51 events, goal difficulty was one of the two most consistent predictors of event outcomes; the other was management support [5]. Stretch targets help, as long as the sponsor backs the team when they cost something.

### Phase 2: Training (day 1 morning)

Short and specific. The team learns only the tools and techniques the event needs: takt time, the eight wastes, standard work, and how to take a time study. Then it goes to the floor. A four-hour classroom session followed by an afternoon at the gemba is common [unverified: practitioner norm].

### Phase 3: Implementation (days 1 to 4)

**Template: five-day kaizen event agenda**

| Day | Morning | Afternoon | Output by end of day |
|---|---|---|---|
| 1 Monday | kickoff by sponsor; charter review; focused training | gemba: observe, time studies, process mapping, spaghetti diagram, verify baseline | validated current state, waste list |
| 2 Tuesday | root cause analysis and potential solutions; draft future state | quick trials with cardboard, tape, mock-ups | chosen future state, action plan |
| 3 Wednesday | move equipment, change fixtures (maintenance and EHS present) | run the new layout, time it, fix problems | first working version |
| 4 Thursday | second and third trial runs at real takt | draft standard work, train other shifts' operators | standard work sheets, visual controls |
| 5 Friday | final run, measure results against baseline | report-out to leadership; hand over the 30-day action list | report-out, signed follow-up list |

A short daily check-in of team leader, facilitator and sponsor at the end of each day (15 minutes) catches problems before Friday. Two rules make days 3 and 4 work. Try ideas physically and quickly, with tape on the floor before anyone moves a machine. And keep the operators in control of the design; they will run the cell long after the facilitator has gone.

### Phase 4: Follow-up (30 to 90 days)

No event finishes everything in five days. The open items go onto a follow-up list, often called a kaizen newspaper.

**Template: 30-day follow-up list (kaizen newspaper)**

| # | Open item | Owner | Due | Status (0/25/50/75/100%) | Effect check |
|---|---|---|---|---|---|
| 1 | permanent gravity rack replaces temporary cart at station 2 | maintenance tech | +14 days | 50% | WIP at station 2 ≤ 2 |
| 2 | standard work posted and trained on second shift | team lead, 2nd shift | +7 days | 100% | audit shows sequence followed |
| 3 | torque tool counter interlock (poka-yoke) | engineer | +30 days | 25% | zero missing-fastener escapes |
| 4 | update routing times in ERP and work instructions in the MES or document system | industrial engineer | +21 days | 0% | standard cost reflects 400 s |
| 5 | update PFMEA and control plan for the new layout (IATF 16949 / AS9100 plants) | quality engineer | +21 days | 0% | documents released |

The sponsor reviews this list weekly at the area board until every line reaches 100 percent. A 30-, 60- and 90-day result check against the baseline belongs on the same board.

## Worked example: rebalancing an assembly cell in five days

The numbers below are an illustrative example, chosen to show the arithmetic.

**Situation.** A hydraulic valve cell runs two shifts with 450 available minutes each (900 minutes per day). Customer demand is 460 valves per day. Four operators share the work; their measured cycle times are 140, 95, 120 and 70 seconds. The cell carries 38 valves of work-in-process (WIP) and needs 12 hours of overtime per week to ship.

**Step 1: Takt time.**
Takt time = available time / customer demand = (900 min × 60 s) / 460 = 54,000 s / 460 = **117.4 s** per valve.

Station 1 (140 s) and station 3 (120 s) exceed takt. The cell cannot meet demand in regular time, which explains the overtime.

**Step 2: How many operators does the work need?**
Total work content = 140 + 95 + 120 + 70 = 425 s.
Theoretical operators = 425 / 117.4 = 3.62, so four operators are justified. The problem is balance, not headcount.

**Step 3: Remove waste, then rebalance.**
On days 1 and 2, the team's spaghetti diagram shows station 1 walking to a parts rack 4 m away and station 3 hand-starting six screws before torquing. Moving parts to point of use and adding a nut runner removes 25 s of work content: 425 s → 400 s. The team rebalances to 105, 100, 100 and 95 s. Every station is now below takt.

Required operators at 400 s = 400 / 117.4 = 3.41. Still four people, but now with about 12 s of margin per station (117.4 − 105) for small disturbances.

**Step 4: WIP and lead time with Little's law.**
Throughput = 460 valves / 900 min = 0.511 valves per minute.
Lead time before = WIP / throughput = 38 / 0.511 = **74 minutes**.
The new layout holds one valve between stations plus a small buffer: 8 valves. Lead time after = 8 / 0.511 = **15.7 minutes**.

Little's law holds for averages in a stable system; measure the actual lead time for two weeks after the event to confirm it.

**Step 5: Finance view.**

| Item | Calculation | Amount |
|---|---|---|
| Team time | 7 people × 36 h × $45 loaded rate | $11,340 |
| Facilitator | 40 h × $75 | $3,000 |
| Materials (racks, nut runner, tape, signs) | quotes | $2,500 |
| **Event cost** | | **$16,840** |
| Overtime saved (hard saving) | 12 h × ($42 × 1.5) = $756 per week; × 50 weeks | $37,800 per year |
| WIP reduction (one-time cash, balance sheet) | 30 valves × $85 standard cost | $2,550 |
| **Simple payback** | $16,840 / $756 per week | **about 22 weeks** |

Three points from a plant controller's view. First, the loaded rate ($45) includes wages and benefits; if team members are backfilled with overtime during the event, add that premium to the cost. Second, only the overtime is a hard saving, because the cash actually stops going out. The 25 seconds of freed work content per valve (about 3.2 hours a day at 460 valves) stays a soft saving until someone uses it, for example to absorb demand growth without hiring. Third, the WIP reduction releases cash once and lowers inventory on the balance sheet; it is not a recurring profit gain. A report-out that adds all three into one "annual savings" figure will lose credibility with finance the first time.

**What a good report-out shows:** baseline vs. result for takt attainment, WIP, lead time, overtime, safety observations and quality; the 30-day list; and what the team learned.

## Daily kaizen: the idea system that keeps gains

Events create step changes. Daily kaizen keeps them and adds hundreds of small ones. The mechanics are simple; the discipline is not.

**Template: kaizen idea card**

| Field | Example |
|---|---|
| Name, team, date | J. Ortiz, valve cell 3, 2nd shift, April 2 |
| Problem I see | the nut runner cable snags on the fixture every 10 to 15 cycles |
| My idea | hang the cable from a spring balancer above station 3 |
| Expected effect | fewer interruptions, less wrist strain |
| Cost estimate | about $150 |
| Approved by / date | supervisor, April 2 |
| Done by / date | maintenance, April 5 |
| Result | no snags in 3 shifts; operator confirms easier reach |

**Rules that make daily kaizen work** [unverified: practitioner guidance, consistent with LEI's emphasis on frontline problem solving [1]]:

1. The supervisor answers every idea within 24 to 48 hours: yes, no with a reason, or "let's test it."
2. Most ideas are implemented by the person who had them, with help as needed.
3. Small spending authority sits at the team level, so a $150 idea does not wait for a purchase committee.
4. Ideas live on the team board, visible, with status. A shoebox of cards is a graveyard.
5. Leaders recognize ideas in the daily huddle; cash rewards per idea tend to shift attention to big-ticket ideas and arguments about value.

The [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) routine (tiered huddles, team boards, gemba walks) is where daily kaizen lives. Without that routine, idea systems usually stall within months.

## Measuring a successful kaizen event: metrics that matter

The LEI names one classic mistake directly: tracking the number of events instead of meaningful results in safety, cost, quality and delivery [1]. Use three layers.

| Layer | Metric | Formula / example | Why |
|---|---|---|---|
| Event outcome | target attainment | targets met / targets set (e.g. 4 of 5 = 80%) | did the event do what the charter promised? |
| Event outcome | KPI change vs. baseline | e.g. WIP 38 → 8; lead time 74 → 15.7 min | the actual improvement |
| Sustainment | result at 30, 60, 90 days | KPI at day 90 vs. day 5 | shows whether gains held |
| Sustainment | follow-up completion | closed items / total items on the newspaper | open items are where gains leak |
| Daily kaizen | ideas implemented per employee per year | implemented ideas / headcount | participation, not just suggestions |
| Daily kaizen | implementation lead time | median days from idea to done | measures leadership response |
| People | team attitude and skill gain | short survey after event and at 90 days | attitude and problem-solving skill gains are the human outcomes Farris and Glover studied [4][6] |

The value-stream and plant-level effects (lead time, OEE, on-time delivery, first pass yield) belong on the KPI board described in our [manufacturing KPIs guide](https://www.m365.fm/en/learn/manufacturing-kpis/).

## Why kaizen results fade: what research says

Kaizen events are among the most researched lean practices, mostly through a series of field studies by Farris, Van Aken, Doolen, Glover and colleagues.

- **What drives event outcomes.** Farris's 2006 dissertation studied 51 kaizen event teams in six manufacturing organizations. Management support and goal difficulty were common predictors of three of five outcomes. Surprisingly, functional diversity, team and team leader kaizen experience, and action orientation were negatively related to one or more outcomes [5]. These are correlations from one field study, not proof that experience hurts. The peer-reviewed version appeared in the *International Journal of Production Economics* in 2009 [4].
- **What sustains the human outcomes.** A later field study of 65 events in eight manufacturing organizations treated sustainability as its own research question: whether employee attitudes and commitment from kaizen events last over time. The authors describe sustaining these outcomes as difficult and under-researched [6]. Achieving a result in the event week and keeping it are two different problems.
- **What established programs struggle with.** Interviews with 16 established kaizen event programs in manufacturing, service and government found that most programs considered themselves successful, but they did not measure many aspects of success they considered important, especially human resource outcomes, and that sustainability was a recurring struggle that could threaten the programs' long-term viability [7].

Practical consequences, in line with these findings and the LEI's failure modes [1]:

1. **Sponsor time is the scarcest input.** Book it before you book the team.
2. **Set hard but reachable targets.** Easy targets waste a week; impossible ones teach cynicism.
3. **Do not staff events only with veterans and specialists.** The LEI warns against engineers removed from daily operations leading the work [1], and Farris found experience was not automatically an advantage [5].
4. **Measure what happens after day 5.** Results at day 90 and follow-up completion tell you more than the Friday slide.
5. **Feed events into daily kaizen.** The team that runs the cell must own the new standard and keep improving it.

## People, safety and labor relations

Kaizen asks people to change their own work, often quickly. Three points deserve attention in US plants.

**Paid time and all shifts.** Run the event in paid working time and include operators from every shift, not just the day shift that is easiest to release. Second- and third-shift operators run the new standard half of the time.

**Employment security.** If a kaizen frees up a person, and that person is laid off, the next event will produce no ideas. Many lean companies commit that no one loses their job because of a kaizen improvement; freed people move to other work or to the CI team [unverified: common lean practice, no single source]. Decide your policy before the first event and say it out loud.

**Safety and ergonomics.** Moving machines, rerouting air and power, and changing reach and lift distances are safety-relevant changes. Bring EHS into the event on day 1, apply lockout/tagout when equipment is moved, and check the new layout for awkward postures and repetitive strain. OSHA defines ergonomics as "fitting a job to a person" and treats work-related musculoskeletal disorders as preventable [10]. A rebalance that pushes every station to 99 percent of takt with no recovery time creates muri (overburden) and will cost more in strain and errors than it saves.

**Unions and employee committees.** In unionized plants, changes to job content and classifications may be bargaining subjects; involve the union representative in the charter. In non-union plants, standing employee committees that discuss working conditions with management can raise questions under Section 8(a)(2) of the National Labor Relations Act; the *Electromation* decision (7th Cir. 1994) is the leading case [11]. Whether a standing kaizen team falls under this depends on its charter and what it discusses, so have employment counsel review standing team charters before launch.

**Respect for people.** The Shingo Institute at Utah State University awards the Shingo Prize to organizations whose key systems are informed by the principles of organizational excellence [12]. Kaizen shows why principles matter more than tools: a team that is listened to will keep improving after the facilitator leaves.

## Common kaizen mistakes

| Mistake | What happens | Fix |
|---|---|---|
| counting events instead of results [1] | busy calendar, flat KPIs | report SQDC results at day 90 |
| no baseline data before day 1 | team spends two days measuring, no time to implement | collect baseline in preparation |
| solution decided before the event | team becomes labor for a manager's project | charter states the problem, not the answer |
| engineers design, operators watch [1] | new layout nobody owns; old habits return | operators design and try |
| no follow-up owner | 30-day list stalls at 60% | sponsor reviews weekly at the area board |
| new standard not written or trained on all shifts | second shift runs the old way | standard work and training before Friday |
| savings inflated in the report-out | finance stops believing CI | separate hard, soft and one-time cash effects |
| events only, no daily kaizen [1] | gains erode between events | idea system with 48-hour response |
| layoffs after improvement | ideas dry up | employment security policy before the first event |
| no safety review of the new layout | injuries or strain from rushed moves | EHS on the team, ergonomic check on day 4 |

## FAQ: kaizen and kaizen events

### What is a kaizen event?

A kaizen event, also called a kaizen blitz, kaizen workshop or rapid improvement event, is a focused improvement effort in which a cross-functional team identifies and implements a significant process improvement in a bounded area, usually within five days [1].

### How long does a kaizen event last?

Typically five days, according to the Lean Enterprise Institute [1]. Shorter formats exist (Purdue's sample event uses four days [13]), but preparation (two to four weeks) and follow-up (30 to 90 days) are part of the event even if they happen outside the workshop week.

### What is the difference between kaizen and a kaizen event?

Kaizen is the philosophy and daily practice of continuous, small-step improvement by everyone. A kaizen event is one concentrated format of it. The LEI warns against relying on events alone, because daily kaizen builds problem-solving skill on the front line [1].

### What are the steps of a kaizen event?

Four phases: preparation, training, implementation and follow-up [8]. Inside the workshop week, the classic sequence is learn the principles, go to the gemba to assess and plan, change and test the process, then standardize and report out [1].

### Who should be on a kaizen event team?

Six to ten people: operators from the area (from every shift), a team lead or supervisor, maintenance, quality, an engineer or other subject matter experts, and one or two outsiders who ask naive questions, plus a facilitator and a sponsor [unverified: common practice]. The LEI warns against leaving frontline workers out [1].

### How do you sustain the results of a kaizen event?

Write and train the new standard before the event ends, assign an owner to every open item, review the follow-up list weekly, check results at 30, 60 and 90 days, and feed the area into daily kaizen. Research on established programs shows sustainability is the most common struggle [7].

### What is an example of kaizen in manufacturing?

Rebalancing an assembly cell so every station runs below takt time is a typical event; the worked example above cuts lead time from 74 to 15.7 minutes and pays back in about 22 weeks. A daily kaizen example is hanging a tool cable on a spring balancer to stop snagging.

### Is kaizen the same as continuous improvement?

Yes, kaizen translates to continuous improvement [1]. In US plants the program is often called CI; German plants use KVP (*kontinuierlicher Verbesserungsprozess*).

### How does kaizen relate to PDCA, A3 and Six Sigma?

PDCA is the logic inside every kaizen [3]. An [A3](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) documents one PDCA cycle on one sheet and suits problems that need deeper root cause analysis. Six Sigma or Lean Six Sigma DMAIC projects are longer, data-heavy projects for variation problems; many companies use all three.

### What does "kaizen week" mean?

It is plant shorthand for a kaizen event: the team spends one working week, usually Monday to Friday, on one bounded process, which matches the LEI's description of a typical five-day event [1]. The scope of the event is wider than that week, because preparation starts two to four weeks earlier and the follow-up list runs for 30 to 90 days afterward.

### What happens if a kaizen event misses its target by day 5?

Report the gap honestly at the report-out, with the reason. Open items move to the 30-day follow-up list with an owner and a due date, and the sponsor reviews them weekly at the area board. If the target was wrong (for example, the baseline data was poor), correct the charter rather than the numbers. A missed stretch target is still useful learning; a hidden one destroys trust with finance and the team.

### What is the difference between 5S and kaizen?

5S is a method for workplace organization and visual control, covered in our [5S guide](https://www.m365.fm/en/learn/5s-visual-management/) (planned). Kaizen is the broader practice of continuous improvement. A 5S event is one type of kaizen event, useful when searching and clutter waste time; many plants start with 5S because a clean, ordered area makes problems visible.

### Is kaizen outdated?

No. The tools change (digital boards, MES data, simulation), but the logic of small, frequent improvements by the people who do the work still applies. What is outdated is a program that counts events instead of results; the LEI names that as a classic failure mode [1], and research on established programs shows the real challenge is sustaining gains, not the method itself [7].

### Can kaizen events work in a union plant?

Yes, if the union is involved from the charter onward and the event respects the contract on job content and classifications. In non-union plants, have counsel review the charter of standing teams because of NLRA Section 8(a)(2) [11].

## Conclusion

Kaizen is simple to explain and hard to sustain. The five-day event is the visible part: a team, a charter, tape on the floor and a Friday report-out. The part that decides success is less visible: baseline data before the event, a sponsor who shows up, standards trained on every shift, a follow-up list that reaches 100 percent, and a daily idea system that answers within two days. Research and the LEI agree on the weak point: results fade when nobody owns them after day 5.

**Your next steps**

- [ ] Pick one area from your value stream map where a bounded problem blocks flow
- [ ] Write the charter with a measurable, dated target and collect baseline data
- [ ] Agree your employment security statement and inform union or employee representatives
- [ ] Run the event with operators designing the change and EHS on the team
- [ ] Review the 30-day list weekly and the KPIs at day 30, 60 and 90
- [ ] Start a daily idea system in the same area within a month

---

## Further reading on m365.fm

**Parent guide**
- [Lean Manufacturing: Principles, Tools, Implementation, and Limits](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)

**Sibling deep dives**
- [PDCA Cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) (planned)
- [A3 Problem Solving](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) (planned)
- [Poka-Yoke and Mistake Proofing](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) (planned)

**Related guides**
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [SMED and Changeover Reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/) (planned)
- [5S and Visual Management](https://www.m365.fm/en/learn/5s-visual-management/) (planned)
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)

**Glossary terms (entities)**
[Lean management](https://www.m365.fm/entity/lean-management/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Takt time](https://www.m365.fm/entity/takt-time/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about lean manufacturing, operational excellence and the digital transformation of production. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026.

1. Kaizen. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kaizen/
2. Kaizen Institute Success Story (history timeline: Masaaki Imai, 1985 incorporation, 1986 and 1997 books). Kaizen Institute. https://kaizen.com/forty-years/kaizen-institute-success-story/
3. Plan, Do, Check, Act (PDCA). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pdca/
4. Farris, J. A.; Van Aken, E. M.; Doolen, T. L.; Worley, J.: Critical success factors for human resource outcomes in Kaizen events: An empirical study. International Journal of Production Economics, 117(1), 2009, pp. 42–65. Bibliographic record: https://econpapers.repec.org/RePEc:eee:proeco:v:117:y:2009:i:1:p:42-65
5. Farris, J. A.: An Empirical Investigation of Kaizen Event Effectiveness: Outcomes and Critical Success Factors. Ph.D. dissertation, Virginia Tech, 2006. https://vtechworks.lib.vt.edu/items/258d1964-ea74-4885-bba0-e67e05213dca/full
6. Glover, W. J.; Farris, J. A.; Van Aken, E. M.; Doolen, T. L.: Critical success factors for the sustainability of Kaizen event human resource outcomes: An empirical study. International Journal of Production Economics, 132(2), 2011, pp. 197–213. Bibliographic record: https://ideas.repec.org/a/eee/proeco/v132y2011i2p197-213.html
7. Glover, W. J.; Liu, W.; Farris, J. A.; Van Aken, E. M.: Characteristics of established kaizen event programs: an empirical study. International Journal of Operations & Production Management, 33(9), 2013, pp. 1166–1201. DOI: 10.1108/IJOPM-03-2011-0119. https://www.emerald.com/insight/content/doi/10.1108/IJOPM-03-2011-0119/full/html
8. Sherman, P. J.: Understanding Kaizen Events. ASCM Insights, Association for Supply Chain Management. https://www.ascm.org/ascm-insights/understanding-kaizen-events/
9. Standardized Work. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/standardized-work/
10. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics
11. Electromation, Inc. v. National Labor Relations Board, 35 F.3d 1148 (7th Cir. 1994). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/35/1148/605691/
12. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
13. Kaizen Training and the Lean Six Sigma Approach (sample four-day kaizen event). Purdue University, Online Lean Six Sigma program blog. https://www.purdue.edu/leansixsigmaonline/blog/kaizen-training-lean-six-sigma-approach

# Editorial notes

**URL scheme:** The nested cluster URL `/en/learn/lean-manufacturing/kaizen/` follows the course-expansion brief; it is an assumption about the final CMS structure. Check before publication.

**Unverified items (marked in text):** team size 6 to 10; four-hour training norm; daily kaizen rules (48-hour response etc.); employment security as common lean practice. All are practitioner guidance and labeled as such.

**Worked example:** illustrative numbers, recalculated: 54,000 / 460 = 117.4 s; 425 / 117.4 = 3.62; 400 / 117.4 = 3.41; 460 / 900 = 0.511 per min; 38 / 0.511 = 74.3 min; 8 / 0.511 = 15.7 min; 7 × 36 × 45 = 11,340; 11,340 + 3,000 + 2,500 = 16,840; 12 × 63 = 756; 756 × 50 = 37,800; 16,840 / 756 = 22.3 weeks; 30 × 85 = 2,550; 25 s × 460 = 11,500 s = 3.2 h. Set it off as an example box in the layout.

**Sources shared with the parent pillar:** [9], [10] and [11] were re-fetched and verified for this article on November 20, 2026 (LEI standardized work, OSHA ergonomics wording, *Electromation*). [12] (Shingo Institute) was re-fetched in the verification pass of November 20, 2026; the page confirms the Huntsman School affiliation and the Shingo Prize wording, but not the earlier phrase "rather than against a tool list", so the sentence was rewritten. [11] is used without legal assessment beyond "counsel should review".

**Vendor claims:** none. Tulip, Adobe and Purdue appear only in the competitive analysis.

**iFAKT:** not mentioned in the article body (no value-stream software angle needed); disclosure only in the author box.

**Internal links (body):** parent pillar (first 150 words), siblings PDCA, A3, poka-yoke; clusters standard work; pillars value stream mapping, shop floor management, manufacturing KPIs, SMED (new), Six Sigma (new). All new URLs are planned; activate after publication.

**Cannibalization:** The parent pillar has an H3 "Kaizen and continuous improvement" (about 200 words). This cluster owns "kaizen event", "kaizen blitz" and how-to queries; the pillar should link here with the anchor "kaizen events" in the final consistency check. The m365.fm entity pages are glossary entries and do not compete.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Kaizen and Kaizen Events: How to Run Continuous Improvement That Lasts",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/lean-manufacturing/kaizen/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/lean-manufacturing/"},
      "about": {"@type": "Thing", "name": "Kaizen"}
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "How long does a kaizen event last?", "acceptedAnswer": {"@type": "Answer", "text": "Typically five days, according to the Lean Enterprise Institute, plus two to four weeks of preparation and 30 to 90 days of follow-up."}},
        {"@type": "Question", "name": "What does kaizen week mean?", "acceptedAnswer": {"@type": "Answer", "text": "It is plant shorthand for a kaizen event: one working week on one bounded process, plus two to four weeks of preparation and 30 to 90 days of follow-up."}},
        {"@type": "Question", "name": "What happens if a kaizen event misses its target by day 5?", "acceptedAnswer": {"@type": "Answer", "text": "Report the gap and its reason at the report-out, move open items to the 30-day follow-up list with owners and due dates, and have the sponsor review them weekly."}},
        {"@type": "Question", "name": "What is the difference between 5S and kaizen?", "acceptedAnswer": {"@type": "Answer", "text": "5S is a method for workplace organization and visual control. Kaizen is the broader practice of continuous improvement; a 5S event is one type of kaizen event."}},
        {"@type": "Question", "name": "Is kaizen outdated?", "acceptedAnswer": {"@type": "Answer", "text": "No. The tools change, but small, frequent improvements by the people who do the work still apply. Programs fail when they count events instead of results or do not sustain gains."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 3, "name": "Lean Manufacturing", "item": "https://www.m365.fm/en/learn/lean-manufacturing/"},
        {"@type": "ListItem", "position": 4, "name": "Kaizen", "item": "https://www.m365.fm/en/learn/lean-manufacturing/kaizen/"}
      ]
    }
  ]
}
```

Add all FAQ questions to `FAQPage` (answers without [n]). FAQ rich results are limited by Google since 2023; the markup still helps machine readers.

**Recommended graphics**

1. Daily kaizen vs. kaizen event comparison (two-column infographic).
2. Five-day agenda as a timeline with outputs per day.
3. Yamazumi chart of the worked example: before (140/95/120/70 s) and after (105/100/100/95 s) against the 117.4 s takt line.
4. Kaizen newspaper template as a downloadable PDF.

## Review log

Expert-panel review per the course-expansion brief, November 20, 2026: nine roles, three full rounds (Mirko's update of November 20, 2026: at least three rounds for clusters). Roles: (1) practitioner, US plant manager with 20 years on the floor; (2) academic, industrial engineering professor; (3) IT/OT architect; (4) quality lead, ASQ CQE / Black Belt, IATF 16949 and AS9100 context; (5) finance, plant controller; (6) worker voice and lean coach; (7) SEO specialist (US); (8) fact checker; (9) critic. Starting point: first full draft (4,596 words H1 to Conclusion).

### Round 1: findings and verdicts

- **Practitioner (changes needed):** Agenda and charter are usable as written. Missing: a daily end-of-day check-in with the sponsor, which is where most events are saved or lost.
- **Academic (changes needed):** Takt, operator count and Little's law recalculated and correct (117.4 s; 3.62; 3.41; 74.3 and 15.7 min). Two issues: Little's law needs the stability caveat; the Farris finding that experience correlated negatively with outcomes must not read as causal.
- **IT/OT architect (changes needed):** Follow-up item 4 updates ERP routing times but forgets the work instructions in the MES or document system; otherwise the new standard and the system disagree.
- **Quality lead (changes needed):** A relayout in an IATF 16949 or AS9100 plant triggers PFMEA and control plan updates; add as a follow-up item.
- **Finance (changes needed):** Hard / soft / one-time split is correct and rare in competitor content. Add that the loaded rate includes benefits and that backfill overtime during the event is an extra cost.
- **Worker voice and lean coach (changes needed):** Employment security and union points are good. Missing: the event must run in paid time and include operators from every shift; second-shift operators run the cell half the time.
- **SEO specialist (changes needed):** Main query is "kaizen event", but no H2 contains the phrase "what is a kaizen event". Rename the comparison H2. Meta title and description lengths stated wrongly (52 and 139 characters, not 51 and 142).
- **Fact checker (changes needed):** Re-verified online: LEI kaizen definition, five-day event, four-step event arc, four failure modes [1]; Imai 1930, Kaizen Institute 1985 in Switzerland, 1986 and 1997 books, died 2023 [2]; LEI PDCA link to kaizen and standardized work [3]; Farris 2006, 51 events, six organizations, management support and goal difficulty, negative relations for diversity and experience [5]; Farris et al. 2009 bibliographic data [4]; Glover et al. 2011, 65 events, eight organizations [6]; Glover et al. 2013, 16 programs, DOI, measurement gaps and sustainability [7]; Sherman four event types and four phases [8]. Errors: (1) OSHA wording "fitting the job to the worker" is a paraphrase presented as OSHA's definition; OSHA's wording is "fitting a job to a person"; (2) "the Shingo Institute's long-standing emphasis on principles over tools" goes beyond [12]; (3) "Purdue's sample event uses four days" had no source.
- **Critic (changes needed):** No em dashes, no AI clichés. Two "X, not Y" endings close together ("balance, not headcount"; "muri, not improvement"); rewrite one. No iFAKT in the body, author box disclosure exact.

**Debate:**

- *Team size 6 to 10:* the fact checker wanted it deleted because the LEI page gives no number; the practitioner and lean coach argued that readers need a number to plan. Resolution: keep, marked [unverified: common practice].
- *Employment security:* finance worried that a no-layoff statement is a commitment many plants cannot make; the worker voice insisted that without it ideas stop. Resolution: the article does not prescribe a policy, it says to decide one before the first event and to state it openly; the "many lean companies commit" sentence stays marked [unverified].
- *Length:* SEO suggested adding a section on kaizen software; the critic called that padding and the IT/OT architect agreed that the MES/document point covers what matters. Resolution: no software section; stay under 5,000 words.

### Optimization 1: what changed (old -> new)

- H2 "Daily kaizen vs. kaizen events" -> "What is a kaizen event? Daily kaizen vs. kaizen events", with a two-sentence definition added; TOC anchor updated.
- "OSHA describes ergonomics as fitting the job to the worker to reduce work-related musculoskeletal disorders [10]. ... is muri, not improvement." -> "OSHA defines ergonomics as "fitting a job to a person" and treats work-related musculoskeletal disorders as preventable [10]. ... creates muri (overburden) and will cost more in strain and errors than it saves."
- "The Shingo Institute's long-standing emphasis on principles over tools [12]" -> "The Shingo Model assesses organizations against guiding principles of operational excellence rather than against a tool list [12]".
- "(Purdue's sample event uses four days)" -> "(Purdue's sample event uses four days [13])"; new source [13].
- Added before the day 3/4 rules: daily 15-minute check-in of team leader, facilitator and sponsor.
- Follow-up item 4 "update routing times in ERP" -> "update routing times in ERP and work instructions in the MES or document system"; new item 5 "update PFMEA and control plan (IATF 16949 / AS9100 plants)".
- Finance box: "Two points" -> "Three points", new first point on loaded rate and backfill overtime.
- Added after the lead-time result: Little's law caveat and two-week confirmation measurement.
- Added after the Farris finding: "These are correlations from one field study, not proof that experience hurts."
- New paragraph "Paid time and all shifts" in the people section.
- Metadata: "(51 characters)" -> "(52 characters)"; "(142 characters)" -> "(139 characters)".

### Round 2: verdicts with spot fact check of the changes

- **Practitioner (satisfied).**
- **Academic (changes needed):** The Glover 2011 bullet says the study looked at "which factors most strongly influence" sustainability but names none, which reads as a hidden finding. State what the abstract supports.
- **IT/OT architect (satisfied).**
- **Quality lead (satisfied):** PFMEA / control plan item correct and scoped to the right plants.
- **Finance (satisfied).**
- **Worker voice and lean coach (satisfied).**
- **SEO specialist (satisfied):** "kaizen event" now in H1, short answer, an H2, the FAQ and the meta description; parent pillar link at word 103 of the article; links to 3 siblings, 1 sibling-pillar cluster (standard work) and 8 pillars.
- **Fact checker (satisfied with one open item):** Re-verified online: OSHA "fitting a job to a person" and "Work-related MSDs can be prevented" [10]; *Electromation*, 7th Cir. 1994, employer-created action committees, Section 8(a)(2) [11]; Purdue sample four-day event [13]; LEI standardized work elements and "the object of continuous improvement through kaizen" [9]. Open: the Shingo Institute page [12] could not be re-fetched in this session (shared fetch budget); the wording matches the parent pillar's verified sentence of the same day.
- **Critic (satisfied).**

**Debate:** The academic wanted the Glover 2011 factors listed from the full paper; the fact checker refused because only the abstract was accessible. Resolution: describe only what the abstract supports.

### Optimization 2: what changed (old -> new)

- "A later field study ... looked at whether employee attitudes and commitment from kaizen events last over time and which factors most strongly influence that sustainability [6]." -> "A later field study ... treated sustainability as its own research question ... The authors describe sustaining these outcomes as difficult and under-researched [6]. Achieving a result in the event week and keeping it are two different problems."

### Round 3: final verdicts

- **Practitioner:** satisfied.
- **Academic:** satisfied.
- **IT/OT architect:** satisfied.
- **Quality lead:** satisfied.
- **Finance:** satisfied; all worked-example figures recalculated once more after the edits.
- **Worker voice and lean coach:** satisfied.
- **SEO specialist:** satisfied; anchors checked by script, meta lengths recounted.
- **Fact checker:** satisfied after one last precision edit: the metrics table said Farris and Glover "measured exactly these human outcomes"; changed to "attitude and problem-solving skill gains are the human outcomes Farris and Glover studied [4][6]". All 13 sources cited, every citation number exists.
- **Critic:** satisfied; no em dashes, no padding sections, no sponsorship wording.

**Optimization 3 (old -> new):** metrics table "Farris and Glover measured exactly these human outcomes [4][6]" -> "attitude and problem-solving skill gains are the human outcomes Farris and Glover studied [4][6]".

**Consensus:** All nine roles release the article. Before publication: re-fetch [12] once, confirm the nested URL scheme, and add the open [unverified] practitioner items to the editor's checklist.

**Word count:** `wc -w` on H1 through the end of "Conclusion" (incl. tables and FAQ, excluding Further reading, author box, sources, notes): 4,831 words.

### Round 4: verification pass, November 20, 2026

- [12] Shingo Institute (verified only via the parent pillar): re-fetched. Confirmed: program of the Jon M. Huntsman School of Business, Utah State University; Shingo Prize for organizations with key systems "informed by the principles of organizational excellence". Not on the page: "assesses organizations ... rather than against a tool list". Text corrected: "The Shingo Model assesses organizations against guiding principles of operational excellence rather than against a tool list [12], and kaizen shows why:" -> "The Shingo Institute at Utah State University awards the Shingo Prize to organizations whose key systems are informed by the principles of organizational excellence [12]. Kaizen shows why principles matter more than tools:".
- Event team size 6 to 10 (two places): still unverified (practitioner common practice; LEI page gives no number).
- Rules for daily kaizen: still unverified (practitioner guidance by design).
- Word count: 4,831 -> 4,842 (`wc -w`, H1 to Conclusion).

Sign-off:
- **Fact checker:** satisfied; no source in this file now rests on a sister-pillar check; two practitioner [unverified] items remain, both labeled.
- **Critic:** satisfied; the corrected Shingo sentence no longer claims more than the source says.
- **Subject expert (lean coach):** satisfied; the respect-for-people point survives the correction intact.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** NEURONwriter query 2f6ed22f5c1da74a ("kaizen event", google.com, analysis of November 11, 2026; no new analysis created). Content scored with evaluate-content using the article part (H1 to Further reading) and the meta title and description.

**Score:** 82 -> 91 (NW top-15 average 65, best competitor 88).

**Findings:** All core terms in range (kaizen event 24, continuous improvement 6, rapid improvement event, cross-functional, sustain). Missing or underused: workflow, types of kaizen (events), process mapping, action plan, potential solutions, subject matter experts, tools and techniques, Lean Six Sigma; NW heading terms "use kaizen events", "kaizen blitz" and "successful kaizen" missing from H2s. PAA questions "Is kaizen outdated?" and "What does kaizen week mean?" plus competitor questions on 5S vs. kaizen and missed targets were not answered.

**Changes (old -> new):**
1. H2 "What is a kaizen event? Daily kaizen vs. kaizen events" -> "What is a kaizen event (kaizen blitz)? Daily kaizen vs. kaizen events" (TOC updated).
2. H2 "When a kaizen event is the right tool" -> "When to use kaizen events, and types of kaizen events" (TOC updated); new H3 "Types of kaizen events" above the existing Sherman paragraph [8] (no new fact).
3. H2 "Measuring kaizen: metrics that matter" -> "Measuring a successful kaizen event: metrics that matter" (TOC updated).
4. Fit table: "an office process with obvious handoff waste" -> "an office workflow with obvious handoff waste".
5. Agenda day 1: "time studies, spaghetti diagram" -> "time studies, process mapping, spaghetti diagram"; day 2: "root cause and idea generation ... action list" -> "root cause analysis and potential solutions ... action plan".
6. Phase 2: "only the concepts the event needs" -> "only the tools and techniques the event needs".
7. FAQ team: "an engineer and one or two outsiders" -> "an engineer or other subject matter experts, and one or two outsiders"; FAQ PDCA/A3/Six Sigma: "Six Sigma DMAIC" -> "Six Sigma or Lean Six Sigma DMAIC".
8. Four new FAQs: "What does 'kaizen week' mean?", "What happens if a kaizen event misses its target by day 5?", "What is the difference between 5S and kaizen?" (with link to the planned 5S pillar `/en/learn/5s-visual-management/`), "Is kaizen outdated?". Facts only from existing sources [1] and [7]; the rest is labeled practice guidance. JSON-LD FAQPage extended with the four questions.
9. Meta description: "Kaizen explained for plants: ... and why gains fade." -> "Kaizen events explained: daily kaizen vs. events, a 5-day agenda, team charter, payback example, and how to sustain continuous improvement." (139 characters). Meta title unchanged (already holds kaizen, event, kaizen event).
10. Word count: 4,842 -> 5,158 (`wc -w`, H1 to Conclusion incl. FAQ), within the 5,300 ceiling.

Not adopted: "lean kaizen" and "three to five days" (would read as stuffing or need an unsourced claim); "5 main elements of kaizen" (no primary source).

Sign-off:
- **SEO specialist (US):** satisfied; score 91 is above every analyzed competitor, PAA covered except the unsourced "5 elements" list.
- **Critic:** satisfied; new FAQs are short and specific, no keyword stuffing, no AI clichés.
- **Fact checker:** satisfied; no new numbers, new FAQ answers rest on [1] and [7] already verified in Round 4, practice guidance is not presented as sourced fact.
- **Subject expert (lean coach):** satisfied; the missed-target and 5S answers match how events are run on the floor.
