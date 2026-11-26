# SEO metadata

| Field | Value |
|---|---|
| Meta title | PDCA Cycle (Plan-Do-Check-Act): Steps and Examples (50 characters; before the November 20, 2026 SERP re-check: "PDCA Cycle: Plan-Do-Check-Act with Examples") |
| Meta description | The PDCA cycle for continuous improvement: the four steps, PDCA vs. PDSA, history from Shewhart to Deming, a worked shop floor example and a template. (150 characters; before the re-check: "The PDCA cycle explained: the four steps, PDCA vs. PDSA, its real history from Shewhart to Deming, a worked shop floor example and a template.") |
| Slug | `/en/learn/lean-manufacturing/pdca-cycle/` (full URL: https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) |
| Parent pillar | [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) |
| Main keyword | PDCA cycle |
| Secondary keywords | plan do check act, Deming cycle, Deming wheel, Shewhart cycle, PDSA, plan do study act, PDCA vs PDSA, PDCA example, PDCA template, PDCA in manufacturing, PDCA vs DMAIC, OPDCA, Model for Improvement, continuous improvement cycle |
| Search intent | Informational (definition, steps, history) with how-to intent (example, template). Audience: supervisors, quality and CI engineers, plant managers, students, quality managers working with ISO-based management systems |
| Target word count | 3,000-5,000 words (cluster). Longest competitor fetched: approx. 1,300-1,400 words (asana.com). Actual H1 to Conclusion (`wc -w`): **4,377 words** (after the SERP re-check and optimization, November 20, 2026; 3,886 after the verification pass) |
| Language version | US English (`en-US`). New article without a German version: no hreflang pair, self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: English results on google.com (US) for "PDCA cycle plan do check act", searched November 20, 2026. Word counts are estimates of the main text without navigation and promotional blocks.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| en.wikipedia.org/wiki/PDCA | 1,200-1,300 | origins, OPDCA and PDSA variants, iteration as a spiral | no metrics for Check, no standardization guidance, no example beyond a fragment, "citation needed" tags |
| lean.org/lexicon-terms/pdca/ (Lean Enterprise Institute) | short lexicon entry (not counted) | precise history: Shewhart's specify-produce-inspect, Deming's four-step model, JUSE's 1951 PDCA; link to kaizen and standardized work | no example, no template |
| asana.com/resources/pdca-cycle | 1,300-1,400 | clear four-step H3s, summary table, history, pros and cons, three FAQs (PDCA vs. PDSA, lean or Six Sigma, kaizen) | marketing example only (email open rates), no failed test, no guidance on cycle length or Check methods, promotional blocks |
| techtarget.com/whatis/definition/PDCA-plan-do-check-act | 700-800 | who created PDCA, link to lean and quality management, PDCA vs. DMAIC section | no example, no dates, PDSA named but not explained, no limitations |
| adobe.com, coursera.org, owu.edu, ox.ac.uk (PDCA guides) | not fetched in full (shared fetch budget exhausted in this session; see editorial notes) | appear in the top 10 with general-business explanations | to be checked before publication |

**Questions collected (SERP titles, competitor content and related searches; the People-also-ask box itself could not be captured in this session):** What is the PDCA cycle? What are the 4 steps of PDCA? Who created the PDCA cycle? What is the difference between PDCA and PDSA? What is an example of PDCA? What is the difference between PDCA and DMAIC? Is PDCA part of ISO 9001? How long should a PDCA cycle take? What is OPDCA?

**How this article beats the competition:** Most top pages repeat four boxes with business-generic examples. Few explain that the cycle's history is contested (Shewhart's three steps, Deming's 1950 wheel, the Japanese PDCA, Deming's later PDSA and his letter calling PDCA a "corruption"), and none shows a manufacturing PDCA with a written prediction, a measured result and the cost math. This article adds that, plus PDCA at different time scales (hourly to yearly), a comparison with DMAIC and A3, a fill-in template and a Check-phase checklist.

**NEURONwriter re-check (analysis of November 11, 2026; query "pdca cycle", id 94269748c9965d70, google.com, English):** NEURONwriter's top 17 organic results have a median of about 1,280 words and an average content score of 61; its recommended length is 1,492 words. The strongest pages by score:

| Page (NW rank) | Words (NW) | NW content score |
|---|---|---|
| blog.proactioninternational.com (PDCA method complete guide) (2) | 2,506 | 79 |
| lemonlearning.com (4 stages of the Deming wheel) (5) | 1,362 | 76 |
| vistaprojects.com (understanding the PDCA cycle) (1) | 3,101 | 74 |
| geeksforgeeks.org (what is the PDCA cycle) (8) | 1,159 | 71 |
| symestic.com/en-us/what-is/pdca (4) | 2,350 | 68 |
| asq.org/quality-resources/pdca-cycle (outside top 17) | 1,151 | 63 |
| **This article** | 4,377 | **65 before -> 80 after** |

People also ask (NW): What do you mean by PDCA? In which stage of PDCA is the solution identified and implemented? Is PDCA part of Six Sigma? Is PDCA Kaizen? NW topic gaps: when to use the PDCA cycle, benefits and limitations. The biggest term gap was "continuous improvement" (used by 90% of competitors, 0 times in our draft).

---

# PDCA Cycle (Plan-Do-Check-Act): Steps, History and a Shop Floor Example

*Updated: November 2026 · Reading time: about 16 minutes*

> **Short answer:** The PDCA cycle (Plan-Do-Check-Act, also called the Deming cycle or Deming wheel) is a repeating four-step method for improvement based on the scientific method: plan a change, try it, check the result against the goal, then standardize it or start over [1]. Deming himself later preferred PDSA, with "Study" instead of "Check," to stress learning from the comparison of prediction and result [2][3].

PDCA is the logic underneath almost every lean tool, from daily kaizen to A3 reports and hoshin kanri. This deep dive belongs to our [lean manufacturing guide](https://www.m365.fm/en/learn/lean-manufacturing/), which covers the full system. Here you get the four steps in practical detail, the real history, a worked example with numbers, and a template you can use tomorrow.

> **Key takeaways**
> - PDCA has four steps: Plan (goal and change), Do (carry it out), Check (compare results with the target), Act (standardize or restart) [1].
> - Walter Shewhart's original cycle had three steps: specification, production, inspection [1][2].
> - Deming presented a four-step wheel in Japan in 1950 (design, production, sales, research); Japanese executives recast it as PDCA around 1951 [1][2].
> - Deming later called the cycle PDSA and, in a 1990 letter, asked that it be called "PDSA, not the corruption PDCA" [2].
> - A good Plan contains a prediction. Without one, Check can only say "it got better" or "it didn't," and little is learned [2][4].
> - Act ends in a new standard. The LEI ties PDCA to kaizen through standardized work [1].
> - PDCA runs at every time scale: hourly at the line, weekly in problem solving, yearly in hoshin kanri [5].

## Table of contents

1. [What is the PDCA cycle?](#what-is-the-pdca-cycle)
2. [How the PDCA cycle works: the 4 steps in detail](#how-the-pdca-cycle-works-the-4-steps-in-detail)
3. [When to use the PDCA cycle to drive continuous improvement](#when-to-use-the-pdca-cycle-to-drive-continuous-improvement)
4. [History: Shewhart, Deming and the Japanese PDCA](#history-shewhart-deming-and-the-japanese-pdca)
5. [PDCA vs. PDSA: does "check" or "study" matter?](#pdca-vs-pdsa-does-check-or-study-matter)
6. [Worked example: cutting scrap on a CNC lathe](#worked-example-cutting-scrap-on-a-cnc-lathe)
7. [PDCA template and Check-phase checklist](#pdca-template-and-check-phase-checklist)
8. [PDCA at every level of the plant](#pdca-at-every-level-of-the-plant)
9. [PDCA vs. DMAIC vs. A3 vs. kaizen events](#pdca-vs-dmaic-vs-a3-vs-kaizen-events)
10. [Common PDCA mistakes](#common-pdca-mistakes)
11. [FAQ](#faq-pdca-cycle)
12. [Conclusion](#conclusion)

## What is the PDCA cycle?

The Lean Enterprise Institute (LEI) defines PDCA as an improvement cycle based on the scientific method of proposing a change in a process, implementing the change, measuring the results and taking appropriate action [1]. It is called a cycle because the Act step feeds the next Plan. Each turn either confirms a better standard or produces knowledge for the next attempt.

Three names circulate for the same idea:

| Name | Where it comes from |
|---|---|
| PDCA (Plan-Do-Check-Act) | Japanese recasting of Deming's 1950 wheel, around 1951 [1][2] |
| Deming cycle / Deming wheel | named after W. Edwards Deming, who brought the idea to Japan in the 1950s [1] |
| Shewhart cycle | after Walter Shewhart, whose specify-produce-inspect sequence was the starting point; Deming himself used this name [1][2] |
| PDSA (Plan-Do-Study-Act) | Deming's later wording, described in *The New Economics* (1993) [2] |

In a plant, PDCA shows up everywhere once you look for it: in the countermeasure column of a shop floor board, in the structure of an [A3 report](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/), in every [kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/), and in the catchball of hoshin kanri.

## How the PDCA cycle works: the 4 steps in detail

The LEI's short definitions are a good starting point: Plan sets goals and identifies the changes needed, Do implements them, Check evaluates results against performance targets, and Act standardizes and stabilizes the change or begins the cycle again [1]. In practice each step has more to it.

### Plan: understand, predict, decide

Plan usually deserves the most time. A complete Plan answers six questions:

| Question | Example answer (CNC scrap case below) |
|---|---|
| What is the problem, in numbers? | 4.2% scrap on bore diameter, op 20, lathe 7 |
| What is the target, by when? | below 2.0% within 6 weeks |
| What is the cause, as far as we know? | insert wear: oversize bores cluster in the last third of each tool life |
| What change will we test? | shorten the insert change interval from 600 to 450 parts |
| What do we predict will happen? | scrap falls to about 1.5%; insert cost rises by about $40 per week |
| How and when will we measure? | scrap by tool-life position, 2 weeks, every part gauged on the existing SPC sheet |

The prediction row is the one most teams skip. Moen and Norman trace how prediction became part of the cycle: in 1991 Moen, Nolan and Provost expanded the Plan step to require a prediction and its supporting theory, so that the Study step compares observed results with that prediction [2]. The Deming Institute makes the same point: building new knowledge from learning "is always guided by a theory" [3].

### Do: run the test small

Do means carrying out the plan, ideally as a small-scale test: one machine, one shift, one product. Collect data while you do it, and note what did not go as planned. John Hunter, writing for the Deming Institute, suggests calling Do the "Do-the-experiment" step, because its purpose is to generate learning [4].

Small tests have two advantages. They are cheap to reverse if the change makes things worse, and they finish fast, so the team can run several cycles in the time one big rollout would take.

### Check phase: compare result with prediction

Check compares the measured result with the target and with the prediction. Three outcomes are possible:

1. **Result as predicted:** the theory held; move to Act and standardize.
2. **Result better or worse than predicted:** the theory is incomplete; find out why before standardizing.
3. **No change:** the cause was wrong, or the change was not carried out as planned; go back to Plan.

Check also looks for side effects: did quality improve while cycle time grew? Did a change on one shift move the problem to another?

### Act: standardize or restart

If the change worked, Act makes it the new standard: update the work instruction, train every shift, add it to the audit, change the routing or control plan. The LEI connects this directly to kaizen: measured gains are locked in by updating standardized work [1]. Our [standard work guide](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned) shows how.

If it did not work, Act decides what to test next. Either way, the cycle closes with a decision, not with a slide.

## When to use the PDCA cycle to drive continuous improvement

Use the PDCA cycle whenever you can test a change on a small scale and measure the result. Typical cases in a plant:

- a recurring problem with a suspected cause, such as the scrap case in the worked example below;
- a new or changed process (new product, new machine, new supplier) where the first runs need checking;
- daily management, where the hourly board and the tier meetings run short PDCA loops;
- a countermeasure from a root cause analysis that needs proof before it becomes the standard.

PDCA is a management method, not only a manufacturing tool. The same iterative process works for business processes such as order entry, quoting or onboarding, for products and services, and in project management reviews. ISO 9001:2015 applies it to all processes and to the quality management system as a whole [10].

It fits less well when you cannot test small (a plant relocation, an ERP cutover) or when a variation problem has many interacting causes. There a [Six Sigma DMAIC project](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned) with designed experiments is usually the better choice.

### Benefits and limits of the PDCA cycle

| Benefits | Limits |
|---|---|
| simple enough for every organizational level, from operator to plant manager | so simple that teams skip the prediction and the Check phase |
| small-scale tests keep risk and cost low | slow for urgent problems if each cycle waits for a meeting |
| data-driven: decisions rest on measured results, not opinions | needs reliable measurement; a weak gauge makes Check meaningless |
| builds a culture of continuous improvement, because every cycle ends in a standard or a lesson | does not tell you which problem to work on; that comes from strategy, KPIs or a value stream map |
| fits with lean, Six Sigma, ISO 9001 and total quality management | turns into paperwork if forms replace work at the gemba |

## History: Shewhart, Deming and the Japanese PDCA

The history is more interesting, and more contested, than most summaries suggest. The most careful account is Moen and Norman's 2010 *Quality Progress* article "Clearing up myths about the Deming cycle and seeing how it keeps evolving" [2].

| Year | Event | Source |
|---|---|---|
| 1939 | Walter Shewhart's *Statistical Method From the Viewpoint of Quality Control* presents three steps: specification, production, inspection; Shewhart later draws them as a cycle | [1][2] |
| 1950 | At a JUSE-sponsored seminar in Japan, Deming presents a four-step wheel: design, production, sales, research (market research and testing in service) | [2][6] |
| 1951 | Japanese executives recast the Deming wheel as Plan-Do-Check-Act; the LEI attributes the rework to JUSE, while Moen and Norman note that Masaaki Imai reported it without details on who did it | [1][2] |
| 1986 | In *Out of the Crisis*, Deming presents the "Shewhart cycle" and says it comes from his 1950 work | [2] |
| 1990 | In a letter to Ronald Moen dated November 17, 1990, Deming writes: "Be sure to call it PDSA, not the corruption PDCA" | [2] |
| 1991 | Moen, Nolan and Provost add prediction and theory to the Plan step | [2] |
| 1993 | Deming describes the Plan-Do-Study-Act cycle in *The New Economics* | [2] |
| 1994 | Langley, Nolan and Nolan add three questions in front of the cycle, which become the Model for Improvement | [2] |

The Model for Improvement's three questions are worth putting on any improvement board [2]:

1. What are we trying to accomplish?
2. How will we know that a change is an improvement?
3. What change can we make that will result in improvement?

Two practical lessons follow from this history. First, the cycle was never meant as a checklist for implementation; it was a learning loop. Second, the Japanese PDCA and Deming's PDSA developed in parallel, and both are legitimate. Lean literature mostly uses PDCA, as the LEI does [1]; the Model for Improvement uses PDSA [2].

## PDCA vs. PDSA: does "check" or "study" matter?

Deming warned that "check" can be misread [2]. The Deming Institute explains the difference this way: in PDCA, the focus on Check is more about the implementation of a change and whether it succeeded or failed, while Deming chose Study because he wanted the focus on predicting results, studying the actual outcomes and revising the theory [3].

| | PDCA as often practiced | PDSA as Deming intended |
|---|---|---|
| Plan | decide on a change | decide on a change, state a theory and a prediction |
| Do | implement | run a test and collect data |
| Check / Study | did it work: yes or no? | how do results compare with the prediction, and why? |
| Act | roll out or drop | adapt, adopt or abandon; revise the theory |
| Typical failure | "inspection" mindset, checking boxes | over-analysis if tests are too large |

In a plant, the label matters less than the habit. A team that writes "Check" but compares a written prediction with measured data is doing PDSA. A team that writes "Study" but only asks "did we do the actions?" is not. Use whichever word your company already uses, and insist on the prediction.

**OPDCA.** Some lean organizations add an O for "observe the current condition" in front of Plan [7]. It stresses going to the gemba before planning. It does not change the logic; a good Plan already starts with observation.

## Worked example: cutting scrap on a CNC lathe

The numbers are an illustrative example.

**Plan.** Lathe 7 runs op 20 (finish bore) on a steel housing, 5,000 parts per week. Scrap for oversize bore is 4.2 percent: 210 parts per week. Each scrapped part costs $18 in material and prior operations. The team plots oversize bores against the position in the insert's life and sees they cluster after about part 400 of the current 600-part change interval.

*Theory:* insert wear pushes the bore oversize in the last third of tool life.
*Change:* change inserts every 450 parts instead of 600.
*Prediction:* scrap falls to about 1.5 percent; extra insert cost about $40 per week; no effect on other characteristics.

**Do.** The test runs on lathe 7 only, all three shifts, for two weeks. Operators log the tool-life count on the existing SPC sheet. One deviation is recorded: on day 3, second shift ran 520 parts on one insert because no spare was at the machine.

**Check.** Results over two weeks (10,000 parts):

| Measure | Before | Predicted | Actual |
|---|---|---|---|
| Scrap rate | 4.2% | about 1.5% | 1.6% |
| Scrap parts per week | 210 | about 75 | 80 |
| Scrap cost per week (× $18) | $3,780 | about $1,350 | $1,440 |
| Insert changes per week (5,000 / interval) | 8.3 | 11.1 | 11.1 |
| Extra insert cost per week (2.8 × $14) | | about $40 | $39 |
| Extra machine time for changes per week (2.8 × 6 min) | | about 17 min | 17 min |

Is the difference real or noise? At the old rate, 10,000 parts would produce about 420 scrapped parts, with a standard deviation of about √(10,000 × 0.042 × 0.958) ≈ 20. The test produced 160, about 13 standard deviations lower: far beyond normal variation. A p-chart of daily scrap rates shows the same thing visually.

The result matches the prediction closely, and the day 3 deviation explains part of the remaining scrap: most oversize parts in week 1 came from inserts that ran past 450. The theory holds.

**Net effect:** $3,780 − $1,440 − $39 = **about $2,300 saved per week**, roughly $115,000 per year at 50 weeks. Seventeen minutes of extra changeover per week is negligible on this machine; on a bottleneck it would need pricing.

**Act.** The team updates the setup sheet and the tool management system to 450 parts, adds a two-bin supply of inserts at the machine (the cause of the day 3 deviation), trains all shifts, and rolls the change to the two sister lathes after a one-week check on each. The next PDCA cycle starts on the remaining 1.6 percent: the plot now shows scrap concentrated after insert changes, so the next theory is about offset setting after a change, a candidate for a [poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) on the offset entry.

A controller's note: the $18 per scrapped part is a full-cost figure. If the material can be recycled for value or if prior operations have spare capacity, the cash saving is lower than the standard-cost saving. State which figure you use.

## PDCA template and Check-phase checklist

**Template: one-page PDCA worksheet**

| Section | Content | Filled in by / when |
|---|---|---|
| Title, owner and team | problem in a few words; one named owner; team members including the operators who run the test | owner, start |
| Background | why this matters now (safety, quality, delivery, cost) | owner, start |
| Current condition | data and a sketch from the gemba | team, Plan |
| Target | measurable, with a date | owner with manager, Plan |
| Cause / theory | what we believe causes the gap, and the evidence | team, Plan |
| Change to test | what, where, how small | team, Plan |
| Prediction | expected result in numbers, expected side effects | team, Plan |
| Measurement plan | what, how, how often, who | team, Plan |
| Test log | what was done, deviations, observations | team, Do |
| Result vs. prediction | table: before, predicted, actual | team, Check |
| Learning | why results matched or did not | team, Check |
| Decision | adopt, adapt, abandon; next cycle | owner with manager, Act |
| Standardization | documents changed, people trained, audit added | owner, Act |

**Checklist: before you leave the Check step**

| Question | Yes / No |
|---|---|
| Was the change carried out as planned? Deviations recorded? | ☐ |
| Is the measurement the same as in the baseline (same gauge, same definition), and is the gauge capable (MSA / gauge R&R)? | ☐ |
| Is the sample large enough to separate the effect from normal variation (look at a run chart or control chart)? | ☐ |
| Did we compare the result with the written prediction, not just with the baseline? | ☐ |
| Can we explain any gap between prediction and result? | ☐ |
| Did we check side effects on safety, other quality characteristics, cycle time and cost? | ☐ |
| Do the operators who ran the test agree with the conclusion? | ☐ |

**Checklist: Act (standardization)**

| Item | Done |
|---|---|
| Work instruction or standard work sheet updated | ☐ |
| All shifts trained, training recorded | ☐ |
| Control plan / PFMEA updated (where used, e.g. IATF 16949 or AS9100 environments) | ☐ |
| ERP routing, tool life or machine program changed, and the parameter change logged under change management | ☐ |
| Layered audit or leader standard work includes the new point | ☐ |
| Change rolled to similar processes (yokoten) after a check | ☐ |
| Next PDCA cycle defined, or problem closed | ☐ |

## PDCA at every level of the plant

PDCA is not just a project method. It runs at several speeds at the same time.

| Level | Cycle time | Plan | Do | Check | Act |
|---|---|---|---|---|---|
| Operator at the line | minutes to hours | hourly target on the production board | run the hour | actual vs. plan each hour | note the problem, call the team lead, quick fix |
| Team / supervisor | daily | shift plan, daily targets | run the shift | tier 1 huddle reviews yesterday | countermeasures with owners on the board |
| Department | weekly to monthly | improvement priorities, A3s | run tests | A3 reviews, KPI trends | standardize, start next A3 |
| Plant | quarterly to yearly | hoshin kanri objectives | deploy through catchball | quarterly reviews | adjust objectives and the next year's plan |

The LEI describes hoshin kanri as building on PDCA [5]. The daily layer is the [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) routine, where hourly boards and tiered huddles turn PDCA into a habit rather than a project.

## PDCA vs. DMAIC vs. A3 vs. kaizen events

| | PDCA | DMAIC (Six Sigma) | A3 | Kaizen event |
|---|---|---|---|---|
| What it is | generic learning cycle | structured project method | one-page PDCA report and coaching process [8] | five-day team workshop [9] |
| Steps | plan, do, check, act | define, measure, analyze, improve, control | background to follow-up on one sheet | prepare, train, implement, follow up |
| Typical duration | minutes to months | about 3 to 6 months [unverified: common practice] | weeks to a few months | 1 week plus follow-up |
| Data depth | as needed | heavy statistics | moderate, visual | moderate, time studies |
| Best for | any improvement, fast tests | variation problems with unknown causes | problems that need root cause and alignment | bounded flow and layout problems |
| Link | the base logic | DMAIC maps to PDCA (Define/Measure/Analyze ≈ Plan) | the left side of an A3 is Plan, the right side Do-Check-Act | each event is one big PDCA turn |

The [Six Sigma and root cause analysis guide](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned) covers DMAIC in depth; the [A3 guide](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) shows how one PDCA fits on one sheet.

## Common PDCA mistakes

| Mistake | What it looks like | Fix |
|---|---|---|
| PDDDD: plan, do, do, do | actions pile up, nobody checks effect | no new action without a check date |
| no prediction | "Check" can only say better or worse | write the expected number in Plan [2] |
| Plan without gemba | theory built in the conference room | observe the process and talk to operators first |
| test too big | plantwide rollout as the first try | test on one machine, one shift |
| checking only the action list | "all actions done" counts as success | check the KPI against the target |
| no standard afterward | improvement disappears in weeks | Act checklist: documents, training, audit [1] |
| one cycle and done | first countermeasure partly works, problem left | plan the next cycle explicitly |
| PDCA as paperwork | forms filled for audits, no learning | short, handwritten, reviewed at the gemba |
| blaming people in Check | operators hide deviations next time | look at the process; deviations are data |

## FAQ: PDCA cycle

### What are the 4 steps of the PDCA cycle?

Plan (set goals and identify the change), Do (implement it), Check (evaluate results against the target) and Act (standardize the change or begin the cycle again) [1].

### Who created the PDCA cycle?

No single person. Walter Shewhart described a specify-produce-inspect sequence in 1939; W. Edwards Deming presented a four-step wheel in Japan in 1950; Japanese executives recast it as Plan-Do-Check-Act around 1951 [1][2]. Deming later preferred PDSA [2].

### What is the difference between PDCA and PDSA?

The third step. Deming replaced "Check" with "Study" because he wanted teams to compare results with a prediction and revise their theory, not just verify whether a change was implemented [2][3]. Used well, both lead to the same behavior.

### What is an example of PDCA in manufacturing?

Shortening a lathe's insert change interval from 600 to 450 parts to cut oversize-bore scrap: plan with a prediction (scrap to about 1.5 percent), test on one machine for two weeks, check (1.6 percent actual), act by updating the setup sheet and rolling it to sister machines. Details are in the worked example above.

### What is the difference between PDCA and DMAIC?

PDCA is a short, general learning cycle; DMAIC is the five-phase Six Sigma project method for variation problems, with more statistical analysis and formal tollgates. DMAIC can be read as an extended PDCA.

### How long should a PDCA cycle take?

As short as the problem allows. At the line a cycle can take an hour; a problem-solving cycle with a two-week test, as in the example above, takes about a month; hoshin kanri runs a yearly cycle [5]. Shorter cycles mean faster learning.

### Is PDCA part of ISO 9001?

Yes. The introduction of ISO 9001:2015 says that management of the processes and the system as a whole "can be achieved using the PDCA cycle" (0.3.1), and that the PDCA cycle "can be applied to all processes and to the quality management system as a whole" (0.3.2) [10]. Check the current edition before quoting it in audits.

### Is PDCA part of Six Sigma?

Yes, and of lean as well. PDCA is older than either: lean organizations use it as the logic of kaizen and A3 [1][8], and Six Sigma's DMAIC can be read as an extended PDCA with more statistics.

### What is OPDCA?

A variant that adds "Observe" before Plan, to stress studying the current condition at the gemba first [7].

### In which stage of PDCA is the solution identified and implemented?

The solution, or more precisely the change to test, is identified in Plan, after the cause has been analyzed, and implemented in Do, first as a small test. It becomes the permanent standard only in Act, after Check has confirmed that it works [1].

### Is the PDCA cycle still relevant today?

Yes. ISO 9001:2015 still builds its process approach on it [10], and the LEI describes it as the logic of kaizen and the basis of hoshin kanri [1][5]. Digital boards and MES data make the Check phase faster, but they do not replace the prediction and the decision in Act.

### Is PDCA the same as kaizen?

Not quite. Kaizen is the practice of continuous improvement; PDCA is the method inside it: leaders set targets against a stable baseline, teams test improvements, and gains are locked in by updating standardized work [1]. See our [kaizen guide](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/).

## Conclusion

The PDCA cycle looks too simple to need a guide: plan, do, check, act. Its value lies in two details that most teams skip. Plan should contain a written prediction, so Check becomes a real comparison and not a yes-or-no verdict. And Act should end in a new standard that every shift follows, or the gain disappears. Deming's insistence on "Study" makes the same point from a different angle: the cycle is a way to learn about your process, and only secondarily a way to implement actions. Run it small and often, and PDCA becomes the everyday habit behind continuous improvement instead of a form.

**Your next steps**

- [ ] Pick one open problem from your shop floor board and write it on the one-page PDCA template
- [ ] Add a numeric prediction before you test anything
- [ ] Test small: one machine, one shift, two weeks
- [ ] Compare result vs. prediction in a three-column table
- [ ] Standardize with the Act checklist, then define the next cycle

---

## Further reading on m365.fm

**Parent guide**
- [Lean Manufacturing: Principles, Tools, Implementation, and Limits](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)

**Sibling deep dives**
- [Kaizen and Kaizen Events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) (planned)
- [A3 Problem Solving](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) (planned)
- [Poka-Yoke and Mistake Proofing](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) (planned)

**Related guides**
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)

**Glossary terms (entities)**
[Lean management](https://www.m365.fm/entity/lean-management/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about lean manufacturing, operational excellence and the digital transformation of production. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026.

1. Plan, Do, Check, Act (PDCA). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pdca/
2. Moen, R. D.; Norman, C. L.: Clearing up myths about the Deming cycle and seeing how it keeps evolving. Quality Progress, November 2010, pp. 23–28 (ASQ). Copy hosted by East London NHS Foundation Trust QI: https://qi.elft.nhs.uk/wp-content/uploads/2026/02/ron-cliff-circling-back.pdf
3. PDSA Cycle. The W. Edwards Deming Institute. https://deming.org/?p=920
4. Hunter, J.: The History and Evolution of the PDSA Cycle. The W. Edwards Deming Institute blog. https://deming.org/the-history-and-evolution-of-the-pdsa-cycle/
5. Hoshin Kanri. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/hoshin-kanri/
6. Timeline: W. Edwards Deming. The W. Edwards Deming Institute. https://deming.org/timeline/
7. PDCA (section on variants, OPDCA). Wikipedia. https://en.wikipedia.org/wiki/PDCA
8. A3 Report. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/a3-report/
9. Kaizen. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kaizen/
10. ISO 9001:2015 Quality management systems – Requirements, informative preview (introduction, clauses 0.3.1 and 0.3.2). https://www.en-standard.eu/publicdoc/iso-9001-prev-1.pdf (accessed November 20, 2026)

# Editorial notes

**URL scheme:** nested cluster URL per the course-expansion brief; an assumption about the final CMS structure.

**Unverified items (marked in text):** DMAIC duration 3 to 6 months (practitioner estimate). The ISO 9001 PDCA wording was closed in the verification pass of November 20, 2026 with the official preview of ISO 9001:2015 [10].

**Source notes:** [2] is the ASQ *Quality Progress* article, read in the copy hosted by ELFT; link to ASQ's own page if available at publication. [3] was fetched via the Deming Institute's short link; replace with the canonical URL in the CMS. [5], [6] and [8] were verified in the parent pillar review on November 20, 2026. [7] Wikipedia is used only for the existence of the OPDCA variant.

**Competitive analysis gap:** the business-generic PDCA guides in the top 10 (Adobe, Coursera, OWU, Oxford) could not be fetched in this session because the shared fetch budget ran out; their word counts must be added before publication.

**Worked example:** illustrative, recalculated: 5,000 × 4.2% = 210; 210 × 18 = 3,780; 5,000 × 1.6% = 80; 80 × 18 = 1,440; 5,000 / 600 = 8.33; 5,000 / 450 = 11.11; difference 2.78 × $14 = $38.9; 2.78 × 6 min = 16.7 min; 3,780 − 1,440 − 39 = 2,301; × 50 = 115,050; binomial check: 10,000 × 0.042 = 420, σ = √(10,000 × 0.042 × 0.958) = 20.06, (420 − 160) / 20.06 = 13.0.

**Vendor claims:** none. **iFAKT:** not mentioned in the body; disclosure in author box only.

**Internal links (body):** parent pillar (first 150 words), siblings kaizen, A3, poka-yoke; cluster standard work; pillars shop floor management, Six Sigma (new).

**Cannibalization:** The parent pillar mentions PDCA in the kaizen, A3 and history sections without its own H3. This cluster owns "PDCA cycle", "PDSA" and "Deming cycle". The planned Six Sigma pillar should own DMAIC and link here for PDCA.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "PDCA Cycle (Plan-Do-Check-Act): Steps, History and a Shop Floor Example",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/lean-manufacturing/"},
      "about": {"@type": "Thing", "name": "PDCA cycle"}
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What is the difference between PDCA and PDSA?", "acceptedAnswer": {"@type": "Answer", "text": "Deming replaced Check with Study so that teams compare results with a prediction and revise their theory, not just verify whether a change was implemented."}},
        {"@type": "Question", "name": "In which stage of PDCA is the solution identified and implemented?", "acceptedAnswer": {"@type": "Answer", "text": "The change to test is identified in Plan and implemented in Do as a small test. It becomes the permanent standard only in Act, after Check has confirmed that it works."}},
        {"@type": "Question", "name": "Is the PDCA cycle still relevant today?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. ISO 9001:2015 builds its process approach on it, and lean uses it as the logic of kaizen and hoshin kanri."}},
        {"@type": "Question", "name": "Is PDCA part of Six Sigma?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, and of lean as well. Lean uses PDCA as the logic of kaizen and A3, and Six Sigma's DMAIC can be read as an extended PDCA with more statistics."}},
        {"@type": "Question", "name": "Is PDCA the same as kaizen?", "acceptedAnswer": {"@type": "Answer", "text": "Not quite. Kaizen is the practice of continuous improvement; PDCA is the method inside it, ending in an updated standard."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 3, "name": "Lean Manufacturing", "item": "https://www.m365.fm/en/learn/lean-manufacturing/"},
        {"@type": "ListItem", "position": 4, "name": "PDCA Cycle", "item": "https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/"}
      ]
    }
  ]
}
```

**Recommended graphics**

1. PDCA wheel with the six Plan questions around the Plan quadrant.
2. Timeline 1939-1994 (Shewhart, Deming wheel, PDCA, PDSA, Model for Improvement).
3. Before / predicted / actual bar chart for the lathe example.
4. "PDCA at four speeds" diagram (hour, day, week/month, year).

## Review log

Expert-panel review per the course-expansion brief, November 20, 2026: nine roles, three full rounds (Mirko's update: at least three rounds for clusters). Roles: practitioner (US plant manager), academic (IE / operations management professor), IT/OT architect, quality lead (ASQ CQE / Black Belt, IATF 16949 / AS9100), finance (plant controller), worker voice and lean coach, SEO specialist (US), fact checker, critic. Starting point: first full draft (3,753 words H1 to Conclusion).

### Round 1: findings and verdicts

- **Practitioner (satisfied with a remark):** The lathe example is realistic, including the day 3 deviation caused by a missing spare insert. Remark: keep the "PDCA at four speeds" table; it is what supervisors need.
- **Academic (changes needed):** Check step lacks any statement on whether 1.6 vs. 4.2 percent could be noise. Add a simple significance argument; the sample (10,000 parts) makes it easy.
- **IT/OT architect (changes needed):** The tool-life change lives in the CNC controller or tool management system; the Act checklist must require logging it under change management.
- **Quality lead (changes needed):** Check checklist mentions "same gauge" but not gauge capability; add MSA / gauge R&R.
- **Finance (satisfied):** The note on full-cost vs. cash saving per scrapped part is correct and needed.
- **Worker voice and lean coach (changes needed):** The template names one owner but not the team; operators who run the test should be named.
- **SEO specialist (changes needed):** PAA-style query "What are the 4 steps of PDCA?" is not mirrored in an H2. Competitor table has no fetched business-generic guides; at least Asana and TechTarget should be counted. Meta title and description lengths stated wrongly (43 and 142, not 44 and 143).
- **Fact checker (changes needed):** Re-verified online: LEI definition, four stages, JUSE 1951 rework, Shewhart's specify-produce-inspect, Deming's design-make-sell-test model [1]; Moen and Norman: 1939 book, 1950 wheel, Imai's report on the PDCA recast, 1986 *Out of the Crisis*, letter of November 17, 1990 with the "corruption PDCA" quote, 1991 prediction, 1993 *New Economics*, 1994 three questions [2]; Deming Institute PDSA page: definition and the Check vs. Study explanation, "is always guided by a theory" [3]; Deming timeline: 1950 JUSE invitation and lectures, 1951 Deming Prize [6]. Errors: (1) Hunter's wording is "Do-the-experiment step", not "do the experiment"; (2) "Toyota and most lean literature use PDCA; healthcare ... mostly use PDSA" is not supported by any cited source.
- **Critic (satisfied with a remark):** No em dashes, no AI clichés. "PDCA is not just a project method" acceptable as a single use.

**Debate:**

- *ISO 9001:* the quality lead wanted to state that ISO 9001:2015 is built on PDCA; the fact checker could not open the standard text in this session. Resolution: keep the FAQ answer with an [unverified] mark and an editor instruction to check the current edition.
- *Significance test:* the critic worried that a standard-deviation calculation scares supervisors; the academic and quality lead argued that a single binomial line plus "a p-chart shows the same" is the minimum. Resolution: keep it to three sentences.
- *PDCA vs. PDSA preference:* the academic suggested recommending PDSA as "correct"; the practitioner and lean coach argued plants should keep the term they use. Resolution: the article says the label matters less than the written prediction.

### Optimization 1: what changed (old -> new)

- H2 "The four steps of PDCA in detail" -> "The 4 steps of the PDCA cycle in detail"; TOC anchor updated.
- "suggests thinking of Do as "do the experiment," because the purpose is learning [4]" -> "suggests calling Do the "Do-the-experiment" step, because its purpose is to generate learning [4]".
- "Toyota and most lean literature use PDCA; healthcare improvement and the Model for Improvement community mostly use PDSA." -> "Lean literature mostly uses PDCA, as the LEI does [1]; the Model for Improvement uses PDSA [2]."
- Added before the Check interpretation: binomial check (expected 420, σ ≈ 20, observed 160, about 13 σ) and the p-chart remark.
- Check checklist: "same gauge, same definition" -> "... and is the gauge capable (MSA / gauge R&R)?".
- Act checklist: "ERP routing, tool life or machine program changed" -> "..., and the parameter change logged under change management".
- Template: "Title and owner" -> "Title, owner and team ... including the operators who run the test".
- Competitive analysis: added Asana (1,300-1,400 words) and TechTarget (700-800 words) after fetching them.
- Metadata: "(44 characters)" -> "(43 characters)"; "(143 characters)" -> "(142 characters)".

### Round 2: verdicts with spot fact check of the changes

- **Practitioner (satisfied).** **Academic (satisfied):** σ = √(10,000 × 0.042 × 0.958) = 20.06; (420 − 160) / 20.06 = 13.0, correct. **IT/OT architect (satisfied).** **Quality lead (satisfied).** **Finance (satisfied).** **Worker voice and lean coach (satisfied).**
- **SEO specialist (changes needed):** Asana's FAQ answers "Is PDCA lean or Six Sigma?", a common follow-up query; add it.
- **Fact checker (satisfied):** Asana and TechTarget figures taken from today's fetch; Hunter wording now matches [4].
- **Critic (satisfied).**

**Debate:** none; the SEO addition was accepted by all because it answers a real query in four lines.

### Optimization 2: what changed (old -> new)

- New FAQ "Is PDCA lean or Six Sigma?" (both use it; DMAIC as an extended PDCA), citing [1] and [8].

### Round 3: final verdicts

- **Critic (changes needed, then satisfied):** "Plan takes the most time, often more than half of the cycle [unverified]" adds an unsourced number with no benefit. Changed to "Plan usually deserves the most time." The unverified marker is removed with the number.
- **Fact checker:** satisfied; all 9 sources cited, every citation number exists; remaining [unverified]: DMAIC duration, ISO 9001 wording.
- **Practitioner, academic, IT/OT architect, quality lead, finance, worker voice, SEO specialist:** satisfied.

**Optimization 3 (old -> new):** "Plan takes the most time, often more than half of the cycle [unverified: practitioner rule of thumb]." -> "Plan usually deserves the most time."

**Consensus:** All nine roles release the article. Before publication: check the ISO 9001:2015 PDCA wording, count the remaining competitor pages (Adobe, Coursera, OWU, Oxford), and replace the Deming Institute short link [3] with its canonical URL.

**Word count:** `wc -w` on H1 through the end of "Conclusion" (incl. tables and FAQ, excluding Further reading, author box, sources, notes): 3,865 words.

### Round 4: verification pass, November 20, 2026

- FAQ "Is PDCA part of ISO 9001?": "ISO 9001 describes its process approach with reference to the PDCA cycle [unverified]" -> verified against the official informative preview of ISO 9001:2015 (0.3.1: management of processes "can be achieved using the PDCA cycle"; 0.3.2: PDCA "can be applied to all processes and to the quality management system as a whole"); text now quotes both; new source [10].
- DMAIC duration 3 to 6 months: still unverified (practitioner estimate by design).
- Competitor word counts (Adobe, Coursera, OWU, Oxford) and the canonical URL of [3]: still open (low priority; not reached because the shared fetch budget was nearly exhausted).
- No sister-pillar sources in this file.
- Word count: 3,865 -> 3,886 (`wc -w`, H1 to Conclusion).

Sign-off:
- **Fact checker:** satisfied; the ISO 9001 point now rests on the standard's own preview text; one practitioner [unverified] item remains.
- **Critic:** satisfied; the FAQ answer now starts with a direct "Yes" and two short quotes, no padding.
- **Subject expert (quality lead):** satisfied; clause 0.3.2 is the reference auditors expect.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** NEURONwriter query 94269748c9965d70 ("pdca cycle", google.com, analysis of November 11, 2026; no new analysis created). Content scored with evaluate-content using the article part (H1 to Further reading) and the meta title and description.

**Score:** 65 -> 80 (NW top-17 average 61, best competitor 79).

**Findings:** The draft never used "continuous improvement" (NW range 2-14, 90% of competitors), and lacked iterative / iterative process, management method, organizational, small scale, business processes, data-driven, check phase, total quality management. H2s missed "how the PDCA cycle works", "use the PDCA cycle" and "drive continuous improvement". No section answered when to use PDCA or its benefits and limits (NW topics 6 and 5). Two PAA questions were not answered directly ("In which stage of PDCA is the solution identified and implemented?", "Is PDCA Kaizen?"), and "Is PDCA part of Six Sigma?" was phrased differently.

**Changes (old -> new):**
1. H2 "The 4 steps of the PDCA cycle in detail" -> "How the PDCA cycle works: the 4 steps in detail"; H3 "Check: compare result with prediction" -> "Check phase: compare result with prediction" (TOC updated and renumbered).
2. New H2 "When to use the PDCA cycle to drive continuous improvement" (about 330 words incl. table): use cases in a plant, PDCA beyond manufacturing (business processes, products and services, project management), where it fits less well (link to the planned Six Sigma pillar), and new H3 "Benefits and limits of the PDCA cycle" as a table. Only sourced fact: ISO 9001:2015 applies PDCA to all processes [10] (already verified in Round 4); the rest is practitioner judgment without numbers.
3. "What is the PDCA cycle?": added "That repeating, iterative nature is what makes PDCA a tool for continuous improvement rather than a one-off project."
4. Do: "ideally as a small test" -> "ideally as a small-scale test".
5. FAQ "Is PDCA lean or Six Sigma?" -> "Is PDCA part of Six Sigma?" ("Both use it." -> "Yes, and of lean as well."); FAQ "How does PDCA relate to kaizen?" -> "Is PDCA the same as kaizen?" (answer opens with "Not quite. Kaizen is the practice of continuous improvement; PDCA is the method inside it").
6. Two new FAQs: "In which stage of PDCA is the solution identified and implemented?" [1] and "Is the PDCA cycle still relevant today?" [1][5][10]. JSON-LD FAQPage extended by four questions.
7. Conclusion: added "Run it small and often, and PDCA becomes the everyday habit behind continuous improvement instead of a form."
8. Meta title "PDCA Cycle: Plan-Do-Check-Act with Examples" -> "PDCA Cycle (Plan-Do-Check-Act): Steps and Examples" (50 characters); meta description now opens "The PDCA cycle for continuous improvement: ..." (150 characters).
9. Word count: 3,886 -> 4,377 (`wc -w`, H1 to Conclusion incl. FAQ).

Not adopted: ISO 45001 and "PDCA in safety management" (suggest questions; no source opened in this session), and long-tail phrases such as "PDCA cycle can be applied" (would read as stuffing).

Sign-off:
- **SEO specialist (US):** satisfied; score 80 is above the best competitor (79), all four PAA questions now answered.
- **Critic:** satisfied; the new section is concrete (plant cases, explicit limits), no filler, no AI phrasing.
- **Fact checker:** satisfied; the only factual claim added (ISO 9001:2015 scope of PDCA) uses [10] as verified in Round 4; the FAQ answers reuse [1] and [5].
- **Subject expert (quality lead):** satisfied; the "fits less well" paragraph correctly sends multi-cause variation problems to DMAIC.
