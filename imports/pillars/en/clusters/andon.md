# SEO metadata

| Field | Value |
|---|---|
| Meta title | Andon System: Design, Escalation Matrix and KPIs (48 characters) |
| Meta description | How an andon system works: cord and fixed-position stop, a sample escalation matrix, response-time math, alarm-fatigue rules from ISA-18.2 and KPIs. (148 characters) |
| Slug | `/en/learn/shop-floor-management/andon/` (full URL: https://www.m365.fm/en/learn/shop-floor-management/andon/) |
| Parent pillar | [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) |
| Main keyword | andon system |
| Secondary keywords | andon, andon cord, andon board, andon light colors, digital andon, andon escalation, andon response time, fixed-position stop, jidoka, stop the line, andon in lean manufacturing, andon KPIs, alarm fatigue manufacturing |
| Search intent | Informational (what is andon, how it works) with a practical and commercial share (how to design escalation, digital andon systems) |
| Target word count | 3,000 to 5,000 words H1..Conclusion (longest analyzed competitor: Adobe, approx. 1,900 words, SERP re-check). Actual `wc -w` of H1..Conclusion (incl. FAQ, excl. Further reading): 4,931 words after the SERP re-check (4,807 after the verification pass of November 20, 2026) |
| Language version | `en-US`; new article, no German version, no hreflang pair; self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Method: web search for "andon system manufacturing" with US-weighted results; the leading pages were opened and their main text estimated (without navigation, footer and calls to action). Word counts are estimates. safetyculture.com now redirects to mitti.com (same publisher). The live "People also ask" box could not be captured directly; questions were collected from the ranking pages and their FAQ blocks.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| vorne.com/learn/key-concepts/andon/systems/ | 1,400–1,600 | digital andon components (sensors, scoreboard, alert software), signal–alert–resolve logic | vendor page; time-based escalation mentioned without thresholds; no response-time targets, no fixed-position stop, no safety content |
| mitti.com/topics/andon (formerly safetyculture.com) | 1,000–1,100 | cord, light and board; Toyota example; three light states | five FAQ questions without answers; no escalation, no KPIs; product promotion |
| tulip.co/blog/lean-manufacturers-guide-to-andon/ | 900–1,000 | lights vs. boards, digital andon | no numbers, no escalation matrix, no response targets |
| en.wikipedia.org/wiki/Andon_(manufacturing) | approx. 500 | etymology, two-pull system, Toyota's switch to wireless buttons since 2014 | no design guidance |
| lean.org/lexicon-terms/andon/ | approx. 350 | authoritative definition, fixed-position stop explained | glossary entry, no implementation |

**Questions found on the ranking pages:** What is an andon system? What does andon mean? Who invented andon? How does an andon cord work? What do the andon light colors mean? How do you implement andon? What is a digital andon system? Does pulling the andon cord stop the line?

**How this article beats the competitors:** No ranking page gives an escalation matrix with times and roles, a calculation of why response time grows when team leaders are overloaded, or design rules against alarm fatigue. This article adds all three, plus the fixed-position stop, light colors checked against OSHA 29 CFR 1910.144, the separation of andon from emergency stops, KPIs with formulas, a business case with a finance caveat, and a digital andon reference architecture placed in ISA-95 terms.

### SERP re-check, November 20, 2026

Method: US web searches for "andon system" (main keyword) and "what is andon in manufacturing" (variant). Positions are the order returned by the search tool; they approximate but are not identical to a live google.com SERP. The tool does not return the "People also ask" box, so questions come from FAQ blocks and question headings on the ranking pages. Searches ran on November 20; the page fetch quota ran out that day, so the pages were opened on November 23, 2026 after it reset. Word counts are estimates of the main text.

| Position (approx.) | Page | approx. words | Findings |
|---|---|---|---|
| 1 | vorne.com/learn/key-concepts/andon/systems/ | 1,400–1,600 (earlier estimate) | unchanged at the top |
| 2 | resources.duralabel.com/articles/andon-system | 500–550 | definition and jidoka; yellow escalates to red at the fixed stop point; no times, no KPIs, no FAQ |
| 3 | commons-os.github.io (pattern page) | not opened | pattern library entry |
| 4 | rzsoftware.com/blog/andon-meaning | 1,100–1,200 | green/yellow/red; FAQ: andon vs. jidoka, andon outside manufacturing, andon board vs. OEE dashboard, standard response time (states "under 60 seconds" for high-volume automotive and equates it with takt time, which mixes two concepts) |
| 5 | safetyculture.com/topics/andon (now mitti.com) | 1,000–1,100 (earlier estimate) | unchanged |
| 6 | en.wikipedia.org/wiki/Andon_(manufacturing) | approx. 500 | unchanged |
| 7–10 | tulip.co, shoplogix.com (1,000–1,200), lucidchart.com, veryableops.com (approx. 1,400 plus promotion) | see notes | light colors in all; escalation "within a set time" without numbers; no KPIs with formulas |
| Variant, position 1 | business.adobe.com/blog/basics/what-is-andon-lean-manufacturing | approx. 1,900 | manual, automatic and digital types; five colors (blue and white optional); board metrics; "document who responds, expected times, and escalation paths" without values |

**Result:** the SERP still has no page with an escalation matrix, response-time math or alarm-fatigue rules; the longest competitor (Adobe) is about 1,900 words. New questions found: andon vs. jidoka and andon board vs. OEE dashboard (both added to the FAQ); andon outside manufacturing (not added, out of scope for a plant article).

---

# Andon System: How to Design Signals, Escalation and Response That Work

*Last updated: November 20, 2026*

> **Short answer:** An andon system is a signal and response system that shows the status of operations at a glance and calls for help the moment something goes wrong. An operator pulls a cord or presses a button, or a machine triggers the signal automatically, and a light or board shows where the problem is [1]. What makes andon work is not the light but the response: a team leader who arrives within the work cycle, a fixed point where the line stops if the problem is not solved [1], and an escalation path that brings in more help as time passes.

This article is a deep dive within our guide to [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/). The pillar places andon between the scheduled tier meetings: the meeting looks at yesterday and plans today, the andon handles right now. Here we design the andon itself: signals, roles, escalation times, metrics and the digital system behind it.

### Key takeaways

- Andon comes from the Japanese word for a paper lantern [7] and is part of jidoka, Toyota's principle of stopping to fix abnormalities instead of passing defects on [2][1].
- At Toyota final assembly, pulling the cord does not stop the line at once; the line runs to the next fixed position, usually the end of the workstation, and stops only if the problem is not solved by then [1][5].
- Response capacity decides everything. A 2007 BBC report quoted 2,000 cord pulls a week at Toyota's Georgetown, Kentucky plant and two a week at a new Ford plant in Dearborn [6].
- Design andon like an alarm system: every signal must need a response, each call type has an owner and a time limit, and nuisance signals are removed. ISA-18.2 offers a useful vocabulary for this, even though it was written for the process industries [8][9].
- Measure calls, response time, resolution time and repeat causes. A high number of calls is not bad news at first; unanswered calls are.

## Table of contents

1. [What is an andon system?](#what-is-an-andon-system)
2. [How the andon cord works at Toyota: the fixed-position stop](#how-the-andon-cord-works-at-toyota-the-fixed-position-stop)
3. [Types of andon signals](#types-of-andon-signals)
4. [Andon light colors and safety](#andon-light-colors-and-safety)
5. [Designing the response: roles and the escalation matrix](#designing-the-response-roles-and-the-escalation-matrix)
6. [Why response time explodes: the queueing math](#why-response-time-explodes-the-queueing-math)
7. [Avoiding alarm fatigue: lessons from ISA-18.2](#avoiding-alarm-fatigue-lessons-from-isa-182)
8. [Andon KPIs](#andon-kpis)
9. [The business case for andon](#the-business-case-for-andon)
10. [Digital andon: architecture and integration](#digital-andon-architecture-and-integration)
11. [Culture: making it safe to pull the cord](#culture-making-it-safe-to-pull-the-cord)
12. [Implementation in eight steps](#implementation-in-eight-steps)
13. [Common mistakes](#common-mistakes)
14. [FAQ](#faq-andon-systems)
15. [Conclusion](#conclusion)

## What is an andon system?

The Lean Enterprise Institute defines andon as "a visual management tool that highlights the status of operations in an area at a glance" and that signals whenever an abnormality occurs [1]. An andon can show production status (which machines are running), abnormalities (downtime, quality problems, tooling faults, operator delays, material shortages) and needed actions such as changeovers; many also show planned versus actual output [1].

The word itself is a Japanese loanword for a paper lantern [7]. The idea behind it comes from jidoka. Toyota translates jidoka as "automation with a human touch" and traces it to Sakichi Toyoda's loom, which "built the capability to make judgments into the machine itself" [2]. When equipment stops, "the andon (problem display board) lights up to notify workers of the abnormality," and on the assembly line "the operator can stop the line by pulling the stop cord themselves" [2].

Three parts make an andon system:

| Part | What it is | Typical form |
|---|---|---|
| Trigger | the event that raises the signal | pull cord, push button, machine fault, sensor (e.g. slow cycle) |
| Signal | what shows the problem and where | overhead board with station numbers, stack light, sound, screen, mobile notification [1] |
| Response | who comes, how fast, what they decide | team leader within the cycle, escalation to supervisor, maintenance, quality, management |

Most articles describe the first two. The third is where andon systems succeed or fail.

## How the andon cord works at Toyota: the fixed-position stop

A common belief is that one Toyota worker can stop the whole plant with one pull. That is not how it works in final assembly. LEI describes a "fixed-position stop system that Toyota uses in its final-assembly lines" [1]:

1. An operator detects a problem and pulls the cord. The station number lights up on the board and a tone calls the team leader [1].
2. The line keeps moving until the vehicle reaches a fixed position, typically the end of the workstation [1].
3. The team leader and operator try to fix the problem within the remaining cycle. Mark Graban puts the window between pull and stop at roughly 5 to 30 seconds [5].
4. If the problem is solved, the team leader resets the signal and the line never stops. If not, the conveyor stops at the fixed position [1][5].

Stopping at a fixed position rather than instantly avoids disrupting other stations mid-task, which could cause new errors such as incomplete assembly [1]. Because most problems are solved within the window, no restart and resynchronization are needed [5]. Graban also cites Liker and Meier's *Toyota Way Fieldbook* for buffers between line segments of no more than about 10 minutes, which keeps a stop largely confined to one segment [5]. Wikipedia describes the same logic as a two-pull system: the first pull calls for help, a second pull confirms the line can keep running [7].

Toyota UK describes the cord as the tool that lets every team member stop the line if they see a threat to vehicle quality [3]. Since 2014, according to Wikipedia, Toyota has been replacing cords with wireless buttons to reduce clutter and trip hazards [7].

**What this means for your plant:** if you install a cord that stops the line instantly and nobody is free to respond, you will get either a lot of downtime or, more likely, very few pulls. The fixed-position stop only works with a responder who can arrive inside the cycle.

## Types of andon signals

| Type | Trigger | Example | Design note |
|---|---|---|---|
| Manual quality andon | operator | defect found, part does not fit | must be quick and anonymous enough to use without hesitation |
| Manual help andon | operator | falling behind, unclear instruction | separate from quality calls so the right person comes |
| Material andon | operator or sensor | minimum stock reached at line side | often links to kanban; see [kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) (planned) |
| Machine andon | machine controller | fault code, stop, slow cycle | needs filtering (see alarm fatigue below) |
| Maintenance andon | operator or machine | abnormal noise, leak, repeated fault | routes to maintenance with asset ID |
| Safety andon | operator | near miss, hazard spotted | never a substitute for an emergency stop |
| Status andon | system | running, changeover, planned stop | information only, no response needed |

The last row is important. A status display tells people what is happening; it does not call anyone. Mixing status and call signals on the same light is one of the most common reasons why andon calls are ignored.

## Andon light colors and safety

Most plants use a three-color logic: green for normal, yellow (or amber) for a problem being worked on or help requested, red for stopped. Vendor guides describe the same scheme [13]. There is no single standard for andon colors, so the color code must be defined locally and trained.

Two US safety rules limit your choices:

- OSHA 29 CFR 1910.144 designates red for fire protection, danger and stop, and requires emergency stop bars on hazardous machines to be red [11]. Yellow is the basic color for caution and physical hazards [11]. Using red for "stopped" is consistent with this; using red for a routine "material low" call dilutes it.
- An andon is a production signal, not a safety function. Emergency stops, light curtains and other safeguarding must stay independent of the andon. If an andon call leads someone to reach into a machine, the response steps must include energy control under OSHA's lockout/tagout standard [12], or a documented reason why the minor servicing exception applies [12].

| Color | Recommended meaning | Avoid |
|---|---|---|
| Green | running to plan | blinking green for "almost on plan" |
| Yellow / amber | help requested, problem being worked on, line still running | yellow for status-only information |
| Red | line or machine stopped | red for routine material or information calls |
| Blue / white (optional) | material call, quality inspection request | adding colors without training and a legend at the board |

## Designing the response: roles and the escalation matrix

An escalation matrix states, for each call type, who responds first and who is added after how many minutes. It is the most important document of an andon system and it fits on one page.

### Sample escalation matrix (illustrative, for a paced assembly line with a 60-second cycle)

| Elapsed time since call | Quality call | Material call | Machine / maintenance call | Safety call |
|---|---|---|---|---|
| 0 (signal) | team leader | team leader / water spider | team leader | team leader and supervisor immediately |
| end of cycle (about 60 s) | line stops at fixed position if not solved | line stops if not solved | line stops if not solved | stop as required by the hazard |
| 3 min | supervisor + quality technician | material handler lead | maintenance technician | safety coordinator |
| 10 min | quality engineer | logistics supervisor | maintenance lead, process engineer | area manager |
| 30 min | area manager, containment decision | area manager | area manager, decision on alternative routing | plant manager |
| 60 min | plant manager informed | plant manager informed | plant manager informed | per incident procedure |

Rules that make the matrix work:

1. **Each level has a decision, not just a notification.** At 30 minutes the area manager decides on containment or rerouting; being informed is not enough.
2. **Escalation is automatic.** If the timer passes the threshold, the next level is called whether or not anyone thinks it is necessary. Discretion is what makes escalation fail.
3. **Times fit the process.** A paced line with a 60-second cycle needs a response in seconds. A machining cell with 20-minute cycles and buffers can work with longer thresholds. Derive the first threshold from cycle time and buffer, not from a template.
4. **Off-shift coverage is explicit.** Write down who covers each role on second and third shift and on weekends. An escalation path that ends at an empty desk is no path.
5. **Every call is closed with a reason code.** Without it, you cannot learn from the calls (see KPIs).
6. **Quality calls trigger containment.** If a defect reached the station, the responder decides which parts since the last good check are suspect and how they are marked and held. The [poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) (planned) cluster shows how to keep the same defect from being made again.

**Unpaced lines and job shops.** Without a moving line there is no fixed position, but the logic stays: define the first-response time from the job's cycle and the downstream buffer, and stop the job (not the shop) if it is not solved in that time. A "water spider" (material handler on a fixed route) is often the first responder for material calls.

The tier meetings of the parent pillar pick up from here: calls that were contained but not solved at the root go onto the tier 1 board the next morning. See the [tier meeting matrix](https://www.m365.fm/en/learn/shop-floor-management/) in the pillar.

## Why response time explodes: the queueing math

LEI describes Toyota's team leaders as hourly workers who lead teams of five to eight people, respond to line stops and andon calls and cover jobs for absent team members [4]. Many Western plants try to run andon with a supervisor responsible for 25 or more people who also handles paperwork and meetings. Simple queueing math shows why that fails.

Treat the responder as a single server. Calls arrive at a rate λ (calls per hour); handling one call takes on average s minutes, so the service rate is μ = 60 ÷ s calls per hour. Utilization is ρ = λ ÷ μ. In the textbook M/M/1 model (random arrivals, random handling times), the average waiting time before the responder arrives is Wq = ρ ÷ (μ − λ).

**Example:** One responder covers a line with 6 calls per hour on average. Each call takes 6 minutes to handle (μ = 10 per hour).

- ρ = 6 ÷ 10 = 0.6 (60 percent utilization)
- Wq = 0.6 ÷ (10 − 6) = 0.15 hours = **9 minutes average wait**

| Calls per hour | Utilization | Average wait before response |
|---|---|---|
| 3 | 30% | 0.3 ÷ 7 h = about 2.6 min |
| 6 | 60% | 9 min |
| 8 | 80% | 0.8 ÷ 2 h = 24 min |
| 9 | 90% | 0.9 ÷ 1 h = 54 min |

The service time must include walking to the station, not only fixing. With two responders sharing calls, the M/M/c model applies and waits fall sharply, which is one argument for pooling responders across neighboring lines. The real line is not exactly M/M/1, but the pattern holds for any queue with random arrivals: waiting time grows much faster than utilization. A responder who is busy 60 percent of the time with andon calls cannot meet a 60-second response target. The fix is structural: smaller teams per responder, a dedicated responder role, or fewer calls through problem solving on the repeat causes. Adding more lights does not help.

## Avoiding alarm fatigue: lessons from ISA-18.2

When every machine fault, every low-stock sensor and every slow cycle raises a signal, people stop reacting. The process industries have a standard for this problem: ANSI/ISA-18.2-2016, *Management of Alarm Systems for the Process Industries* [10]. It manages alarms over a life cycle that includes philosophy, identification, rationalization, detailed design, implementation, operation, maintenance, monitoring and assessment, management of change and audit [8]. In rationalization, each proposed alarm is justified against the criteria of the alarm philosophy, documented, prioritized and classified [9]. A technical report, ISA-TR18.2.6-2012, applies the standard's principles to batch and discrete processes [9].

ISA-18.2 is written for control rooms, not for assembly lines, and it is not a requirement for andon systems. But its logic transfers well:

| ISA-18.2 idea | Andon translation |
|---|---|
| An alarm indicates a condition that needs operator action [8] | Every andon call needs a defined response. If nobody has to act, it is status, not a call. |
| Alarm philosophy document [8] | One page: call types, colors, sounds, owners, escalation times |
| Rationalization: justify, prioritize, classify each alarm [9] | Review every automatic machine signal: does it need a person now? Which priority? |
| Performance monitoring [8] | Track calls per responder per hour, repeat calls, calls closed without action |
| Management of change [8] | New signals or changed thresholds go through a short approval, not a quick PLC edit |

For a sense of scale: a Control Engineering article on ISA-18.2 cites the standard's figures of about 150 alarms per day (about 1 per 10 minutes on average) as "very likely acceptable" for a control room operator and about 300 per day (about 2 per 10 minutes) as the maximum manageable [8]; a Honeywell white paper lists the same ISA-18.2 figures, with about 300 per day (about 2 per 10 minutes) as "may be manageable" [16]. Those numbers do not apply to a team leader on an assembly line, whose calls take minutes each, but they show the principle: the acceptable rate is set by the time each response takes. Use the queueing table above to set your own limit.

## Andon KPIs

| KPI | Formula | Use |
|---|---|---|
| Calls per shift | count of calls by type | shows how much the team makes visible; falling to zero is a warning sign |
| Response time | time from call to responder at station | tests whether the response structure works |
| Resolution time | time from call to reset | shows problem difficulty; long times feed tier meetings |
| Line-stop minutes from andon | sum of stop durations after fixed-position stop | feeds availability in OEE; see [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned) |
| Share of calls solved within cycle | calls reset before fixed position ÷ all calls | the core health metric of a fixed-position system |
| Repeat-cause rate | calls with a reason code seen 3+ times in 30 days ÷ all calls | points to problems that need root cause analysis |
| Escalation rate | calls reaching level 3 or higher ÷ all calls | shows where first-level capability is missing |

Show the top reason codes as a Pareto chart on the tier board and pick one per week for structured problem solving, for example with an [A3](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) (planned) or the methods in [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned). Report andon KPIs by line and shift, not by person (see culture below).

## The business case for andon

A typical business case for a new or better andon system rests on shorter response and fewer repeat problems. An illustrative calculation:

| Item | Before | After | Note |
|---|---|---|---|
| Calls per day that lead to a line stop | 12 | 12 | same problems, faster response |
| Average stop duration per call | 4.0 min | 1.5 min | dedicated responder, clear escalation |
| Stop minutes per day | 48 | 18 | |
| Recovered minutes per day | | 30 | |
| Line rate | 1 unit/min | | |
| Contribution margin per unit | $35 | | sales price minus variable cost |
| Value per day | | $1,050 | 30 units × $35 |
| Value per year (240 days) | | $252,000 | |
| Cost of a dedicated responder | | −$139,840 | 1 hourly responder × 2 shifts × 1,840 paid hours (assumption) × $38 loaded |
| Net value per year | | $112,160 | before hardware, software and training |

**Finance caveat.** The recovered minutes only turn into cash if the line is the plant's constraint and the extra units can be sold. If the line already meets demand, the gain is lower overtime, less expediting or a shorter shift, valued at the actual cost saved, not at contribution margin. The other side of the case is cost: a dedicated responder role (one hourly wage per shift per line segment), hardware and software (capex or subscription), integration and training. Many andon improvements are mostly organizational and need little capex. Present both the throughput view and the cost view so the plant controller can choose the right one; the [theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned) pillar explains why the distinction matters.

## Digital andon: architecture and integration

A simple andon needs only a cord, a light and a board. Digital andon adds automatic triggers, timers, escalation messages and a database for analysis. Vendors describe the basic chain as signal, alert and resolve, with escalation to wider groups as an event lasts longer [13].

| Layer (ISA-95 terms) | Components | Notes |
|---|---|---|
| Level 1–2: sensing and control | buttons, cords, PLC fault bits, cycle sensors | use dedicated inputs or PLC tags; read-only from the andon side |
| Level 2–3: andon logic | andon server or MES module: call types, timers, escalation rules | many MES products include andon; see [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned) |
| Level 3: displays and notifications | overhead boards, stack lights, smartwatches, pagers, mobile apps | test delivery times; notifications must arrive within the first threshold |
| Level 3–4: analysis | database, dashboards, tier board feed | reason codes and durations feed OEE and Pareto analysis |

Design points:

- **Latency.** Office collaboration tools can be useful for the 30- and 60-minute escalation levels and for reporting, but test whether their delivery times are suitable before you rely on them for the first, seconds-level response. Keep the first-level signal local (light, sound, board).
- **Line stop is a control function.** If the andon stops a conveyor, that signal goes to the line PLC and must be engineered, tested and documented by the controls team like any other control change. The andon software itself should read machine signals, not write to controllers.
- **Fail-safe behavior.** If the andon server or network fails, operators must still be able to call for help. A local light and a radio are the fallback.
- **OT security.** The andon system bridges the machine network and the office network. Place it in the segmented architecture your plant uses and give it read access to machine signals only; see [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) (planned).
- **Data model.** Store per call: line, station, call type, trigger (manual/automatic), timestamps (call, arrival, reset, stop start, stop end), responder role, reason code, comment. This is enough for every KPI above.
- **Paper and digital together.** Many plants combine digital andon with digital work instructions so the responder can open the current standard at the station; see [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

## Culture: making it safe to pull the cord

The Georgetown and Dearborn numbers from the BBC report make the point: 2,000 pulls a week at Toyota Georgetown and two a week at Ford's new Dearborn truck plant [6]. The article attributed the gap to "the legacy of generations of mistrust between shop-floor workers and managers" [6]. Graban later reported Jeff Liker's account that Ford created an offline team leader role at Dearborn but that the role was at risk if it could not prove its value [5].

Hardware is identical in both plants. What differs is what happens to the person who pulls. Amy Edmondson's research describes psychological safety as "a shared belief held by members of a team that the team is safe for interpersonal risk taking" [14]; pulling an andon in front of colleagues is exactly that kind of risk.

Practical rules:

- **The first words of the responder are about the problem, not the person.** "What did you find?" rather than "What happened now?"
- **No targets for fewer calls.** A target for fewer andon pulls is a target for hiding problems. Target response time and repeat causes instead.
- **Report by line and shift, not by name.** Andon data can be read as individual performance data. In unionized plants, talk with the union before introducing per-person andon reports; the parent pillar covers [employee monitoring rules](https://www.m365.fm/en/learn/shop-floor-management/) in the US.
- **Close the loop visibly.** Show on the board which repeat causes were fixed because of andon calls.
- **Protect safety reports.** OSHA's guidance on worker participation recommends a process for workers to report injuries, near misses and hazards, protection against retaliation for reporting, and empowering workers to request a temporary suspension or shutdown of work they believe is unsafe [15]. A safety andon call is such a report.
- **Train the pull.** New operators should practice pulling the cord in their first week, so the first real pull is not also the first time.

## Implementation in eight steps

| Step | Content | Output |
|---|---|---|
| 1 | Pick a pilot line with a clear cycle time and a willing team | pilot scope |
| 2 | Define call types (start with three: quality, material, help) | call type list |
| 3 | Define the responder role and check capacity with the queueing math | responder per shift, team size |
| 4 | Write the escalation matrix and the color code | one-page andon philosophy |
| 5 | Install the simplest working signal (light, board, sound) | working andon |
| 6 | Train operators and responders, including practice pulls | training records |
| 7 | Record every call with reason code for four weeks; review weekly | KPI baseline, Pareto |
| 8 | Adjust thresholds, remove nuisance signals, then add automatic machine triggers and digital escalation | revised philosophy, rollout plan |

Write the response itself as [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/): what the responder checks first, when to stop, when to escalate, how to reset.

## Common mistakes

1. **Lights without responders.** The signal works, nobody comes, people stop pulling.
2. **Instant line stop with no fixed position.** Stops take longer and disrupt other stations [1].
3. **One responder for 25 people.** The queueing math guarantees long waits.
4. **Every machine fault becomes a call.** Alarm fatigue; nuisance signals drown real ones [8].
5. **Red for everything.** Red loses its meaning, which conflicts with its safety use [11].
6. **Andon as a safety device.** Emergency stops and safeguarding stay separate [11][12].
7. **Escalation by judgment.** People do not want to bother the next level; the timer must decide.
8. **No reason codes.** Calls are handled but nobody learns.
9. **Targets for fewer calls.** Problems go underground.
10. **Per-person reporting introduced without the workforce.** Trust breaks, pulls drop.

## FAQ: andon systems

### What is an andon system in lean manufacturing?

A visual signal and response system that shows the status of operations at a glance and calls for help when an abnormality occurs, triggered by a cord, button or machine [1].

### What does andon mean?

Andon is a Japanese word for a paper lantern [7]. In manufacturing it refers to the light or board that signals a problem.

### Does pulling the andon cord stop the line?

At Toyota final assembly, not immediately. The line runs to the next fixed position, typically the end of the workstation, and stops there only if the problem has not been solved [1][5].

### What is an andon board?

An overhead display with numbered rows or fields for workstations or machines; a field lights up when a cord, button or sensor signals a problem, so the team leader can see where to go [1]. Many boards also show planned versus actual output [1].

### Who invented andon?

The andon is part of jidoka in the Toyota Production System; Toyota traces jidoka to Sakichi Toyoda's loom, which stopped itself when a problem occurred [2][7]. No single inventor of the andon board is documented in the sources we checked.

### What do andon light colors mean?

There is no universal standard. Common practice is green for normal, yellow for help requested and red for stopped. In US plants, keep red consistent with its OSHA meaning of danger and stop [11].

### What is a digital andon system?

An andon in which signals come from buttons or machine controllers, and software runs timers, escalation messages, displays and analysis [13].

### How fast should someone respond to an andon call?

Within the remaining work cycle on a paced line, so that the problem can be solved before the fixed-position stop. Derive the target from your cycle time and buffers, and check your responder capacity with the queueing math in this article.

### What KPIs should an andon system track?

Calls per shift, response time, resolution time, line-stop minutes, share of calls solved within the cycle, repeat-cause rate and escalation rate.

### Is a high number of andon calls bad?

Not at first. Many calls mean the team makes problems visible. The warning signs are unanswered calls, long response times and the same causes coming back.

### What is the difference between andon and jidoka?

Jidoka is the principle: stop at the first abnormality and fix it instead of passing defects on [2]. Andon is the tool that makes such a stop visible and calls for help: the cord, button or machine signal and the light or board that shows where the problem is [1][2].

### What is the difference between an andon board and an OEE dashboard?

An andon board shows what needs a response right now: which station or machine has called for help or stopped [1]. An OEE dashboard summarizes performance over a shift or longer. Many digital systems show both on one screen; keep the andon calls on top so they are not buried in charts.

### Is andon the same as an emergency stop?

No. Andon is a production signal. Emergency stops and machine safeguarding are safety functions and must stay independent [11][12].

## Conclusion

An andon system tells operators one thing: if you signal a problem, help will come in time. The light and the board make that visible; the response makes it true. That response needs a responder with spare capacity (the queueing math shows how quickly waiting times grow), a fixed point where the line stops, an escalation matrix that brings in more help automatically, and signal design that treats every call as something that needs action.

Measure response time and repeat causes, report by line rather than by person, and feed the top causes into the tier meetings of your [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) system. Then the andon does what it was meant to do: make every abnormality visible right now, so the team can fix it for good.

## Further reading on m365.fm

**Parent pillar**
- [Shop floor management and gemba walks](https://www.m365.fm/en/learn/shop-floor-management/)

**Sibling clusters (planned)**
- [Standard work: elements, forms and a worked example](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned)
- [Paperless manufacturing and digital work instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) (planned)

**Related pillars and clusters (planned; check links before go-live)**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned)
- [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) (planned)
- [Kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) (planned)
- [Theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned)
- [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned)
- [A3 problem solving](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)

**Terms**
[Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Visual management](https://www.m365.fm/entity/visual-management/) · [Micro stops](https://www.m365.fm/entity/micro-stops/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Germany. On m365.fm he writes about lean management, operational excellence and digitizing manufacturing with Microsoft 365 and Azure.

**Note: The author works at iFAKT GmbH.**

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All sources accessed on November 20, 2026.

1. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
2. Toyota Production System. Toyota Motor Corporation (global website). https://global.toyota/en/company/vision-and-philosophy/production-system/
3. Andon: Toyota Production System guide. Toyota UK Magazine. https://mag.toyota.co.uk/andon-toyota-production-system/
4. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
5. Graban, M.: No, One Toyota Worker Can't Stop the Whole Factory. Lean Blog, June 29, 2026 (cites Liker, J.; Meier, D.: The Toyota Way Fieldbook, and a 2024 conversation with Jeff Liker). https://www.leanblog.org/2026/06/andon-cord-stop-the-line-myth/
6. Schifferes, S.: The triumph of lean production. BBC News, February 27, 2007 (archived PDF on Lean Blog). https://www.leanblog.org/wp-content/uploads/2026/06/BBC-NEWS-_-Business-_-The-triumph-of-lean-production.pdf
7. Andon (manufacturing). Wikipedia (English). https://en.wikipedia.org/wiki/Andon_(manufacturing)
8. Tennant, M.: Implementing Alarm Management per the ANSI/ISA-18.2 Standard. Control Engineering, September 2013 (republished by Yokogawa). https://www.yokogawa.com/us/library/resources/media-publications/implementing-alarm-management-per-the-ansi-isa-182-standard-control-engineering/
9. ISA18 alarm management standard updated. InTech, International Society of Automation, May/June 2016. https://www.isa.org/intech-home/2016/may-june/departments/isa18-alarm-management-standard-updated
10. ANSI/ISA-18.2-2016, Management of Alarm Systems for the Process Industries (ANSI webstore listing). https://webstore.ansi.org/standards/isa/ansiisa182016
11. 29 CFR 1910.144, Safety color code for marking physical hazards. Occupational Safety and Health Administration. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.144
12. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
13. Andon Systems. Vorne Industries (vendor page). https://www.vorne.com/learn/key-concepts/andon/systems/
14. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
15. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
16. Enhance Alarm Management. Honeywell white paper WP-20-24-ENG, October 2020, p. 8 (vendor source; table of ANSI/ISA-18.2 alarm rate figures). https://process.honeywell.com/content/dam/process/en/documents/document-lists/honeywell_enhanced-a.pdf (accessed November 20, 2026)

# Editorial notes

## Vendor claims, unverified items and items to check before publication

- **URL scheme:** nested cluster URL (`/en/learn/shop-floor-management/andon/`) per the course expansion brief; an assumption of the brief. Confirm with the CMS.
- **Escalation matrix, color table, implementation steps, business case figures (12 calls, 4.0 → 1.5 min, $35 contribution margin, 240 days, 1,840 paid hours, $38 loaded):** sample design and illustrative numbers, labeled as such; not sourced benchmarks.
- **Queueing math:** standard M/M/1 formula Wq = ρ ÷ (μ − λ) (textbook queueing theory; no specific source cited). Table values recalculated in round 2. The real arrival and service processes on a line differ; the text says so.
- **5 to 30 seconds window:** Mark Graban's estimate [5], not a Toyota figure.
- **Buffers of about 10 minutes:** via Graban citing Liker and Meier, *The Toyota Way Fieldbook* [5]; not checked in the book.
- **2,000 vs. 2 pulls per week:** BBC News, Steve Schifferes, February 27, 2007 [6], read in the archived PDF on Lean Blog; figures are from 2007 and are used as an illustration of culture, not as current data.
- **Ford Dearborn team leader role:** Jeff Liker's account as reported by Graban [5]; secondary.
- **Wireless buttons since 2014 and the two-pull system:** from Wikipedia [7]; Wikipedia cites Toyota UK. Not confirmed on a Toyota page [unverified beyond Wikipedia]; a search on November 20, 2026 found no Toyota or independent source either. Decision for Mirko: keep with the "according to Wikipedia" attribution or delete the sentence.
- **ISA-18.2 alarm rates (about 150 / 300 per day, about 1 / 2 per 10 minutes):** from the Control Engineering article by a Yokogawa architect [8]; confirmed on November 20, 2026 by a second, independent vendor source that tabulates the ISA-18.2 figures [16]. The paid standard text itself was still not opened [unverified against the standard text], but two independent vendor sources agree. The article states explicitly that these rates are not andon targets.
- **ISA-TR18.2.6-2012 (batch and discrete):** named in ISA's InTech article [9]; content of the technical report not checked.
- **Vorne:** vendor page [13], used only for the generic signal–alert–resolve chain and the common three-color scheme; vendor performance and price claims were not used.
- **Peer-reviewed literature:** Edmondson 1999 [14] (Administrative Science Quarterly 44 (2), carried over from the parent pillar, verified there on November 20, 2026). Wikipedia also cites Everett and Sohal (1991) in the International Journal of Quality & Reliability Management on andon; not opened, not cited [candidate source; DOI not checked].
- **OSHA:** 1910.144 colors [11], 1910.147 scope and minor servicing exception [12], worker participation page [15], all opened on November 20, 2026. The article does not give legal advice on whether a specific andon response falls under the minor servicing exception.
- **Competitive analysis:** word counts are estimates; live PAA not captured; safetyculture.com redirects to mitti.com. Verify with an SEO tool before publication.
- **iFAKT:** not mentioned in the body (no genuine fit). Disclosure in the author box exactly as required; no sponsored label.

## Internal links

- Parent pillar in the first 150 words and in Further reading; also linked from the escalation section (tier meeting matrix), culture section (employee monitoring rules) and the conclusion.
- Siblings: standard work (implementation step 8, Further reading), paperless manufacturing (digital andon section, Further reading).
- New pillars and clusters in the body: kanban-pull-system, tpm-oee, mes-isa-95, ot-cybersecurity-iec-62443, theory-of-constraints, six-sigma-root-cause-analysis, lean-manufacturing/a3-problem-solving, lean-manufacturing/poka-yoke. All "(planned)".

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Andon System: How to Design Signals, Escalation and Response That Work",
      "inLanguage": "en-US",
      "url": "https://www.m365.fm/en/learn/shop-floor-management/andon/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/shop-floor-management/"},
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "about": [{"@type": "Thing", "name": "Andon"}, {"@type": "Thing", "name": "Jidoka"}]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "Does pulling the andon cord stop the line?",
         "acceptedAnswer": {"@type": "Answer", "text": "At Toyota final assembly, not immediately. The line runs to the next fixed position, typically the end of the workstation, and stops there only if the problem has not been solved."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 2, "name": "Shop floor management", "item": "https://www.m365.fm/en/learn/shop-floor-management/"},
        {"@type": "ListItem", "position": 3, "name": "Andon", "item": "https://www.m365.fm/en/learn/shop-floor-management/andon/"}
      ]
    }
  ]
}
```

FAQPage: include all 13 FAQ questions verbatim (without source markers).

## Recommended graphics

1. Fixed-position stop as a timeline (pull, team leader arrives, fixed position, stop or reset).
2. Escalation matrix as a swimlane graphic by elapsed time.
3. Chart: average wait vs. responder utilization (from the queueing table) to show the nonlinear growth.
4. Digital andon architecture on the ISA-95 levels.

## Cannibalization

- The parent pillar has a short andon section (definition, fixed-position stop, Toyota team leader, andon events on the board). This cluster takes the query "andon system" with design depth; the pillar's andon section should link here (final consistency check). The pillar statements used here (LEI definitions, team leader role) are consistent with the pillar; nothing in this article contradicts it.
- Possible overlap with `tpm-oee` (downtime) and `mes-isa-95` (andon as MES module): only linked.

## Review log

Review of the cluster article on November 20, 2026 with the nine-role panel of the course expansion brief, in three full rounds. Backup of the first draft: `andon.v1.md` in the session scratchpad. Research note: the session's shared web search quota ran out during research; all sources cited were opened with web fetch.

### Round 1

1. **Practitioner (changes needed):** The fixed-position stop and queueing section are what plant managers need. Missing: andon in unpaced lines and job shops, the role of the water spider, and containment of suspect parts after a quality call.
2. **Academic (changes needed):** M/M/1 is a fair illustration but must say that service time includes walking and that pooling (M/M/c) changes the picture. Otherwise readers conclude "one responder per line" is the only fix.
3. **IT/OT architect (changes needed):** If the andon stops a conveyor, that is a control function and belongs to the controls team; the andon software should not write to PLCs. Add. Notification latency paragraph is good; keep the first level local.
4. **Quality lead (changes needed):** A quality call must trigger a containment decision (which parts since the last good check). Link poka-yoke for prevention.
5. **Finance (changes needed):** The business case counts recovered minutes but not the cost of the dedicated responder that the article itself recommends. Add the responder cost to the table. Throughput vs. cost caveat is correct.
6. **Worker voice and lean coach (changes needed):** Culture rules are good. Add the OSHA angle: a safety andon is a safety report and must be protected from retaliation.
7. **SEO specialist, US (changes needed):** Strong coverage of "andon cord", "andon light colors", "digital andon". Missing a direct answer to "What is an andon board?", which the ranking pages use as an H3. Meta description 148 characters, fine.
8. **Fact checker (changes needed):** Re-opened and checked: LEI andon (definition, three uses, overhead board, fixed-position stop and reasons) [1]; Toyota global TPS page (jidoka translation, loom quote, andon board quote, stop cord quote) [2]; Toyota UK (every team member may stop the line; 2021 comment that the line ultimately stops if not resolved) [3]; LEI team leader [4]; Graban 2026 (5–30 s, no restart, 10-minute buffers via Liker/Meier, Ford role) [5]; BBC 2007 PDF (author, date, both quotes) [6]; Wikipedia (lantern, two-pull, 2014 wireless) [7]; Control Engineering article (ten life cycle stages, alarm rate table) [8]; InTech 2016 (rationalization definition, TR18.2.6) [9]; ANSI listing (title, scope) [10]; OSHA 1910.144 and 1910.147 [11][12]; Vorne (three colors, escalation as events last longer) [13]. Findings: (a) the Toyota UK article itself says activation "automatically halts production", while its 2021 comment describes the line stopping only if unresolved; the draft relies on LEI for the mechanism and cites Toyota UK only for "every team member may stop the line", which is correct; (b) Wikipedia's 2014 wireless claim is secondary; label it; (c) the alarm-rate figures are from a secondary article citing the standard; label; (d) new OSHA source needed for the worker voice addition.
9. **Critic (changes needed):** "An andon system is a promise" is a rhetorical opener; tone it down. "Most articles describe the first two" is fair given the competitive analysis. No em-dash chains, no AI clichés.

**Debate 1: the cost of the responder.** Finance argued that with a dedicated responder the case may not pay; Practitioner argued that without a responder there is no andon system at all, so the cost is not optional; Worker voice added that the responder should be an hourly team-leader role with time for kaizen, not an extra supervisor. Resolution: show the responder cost in the business case (net $112,160 per year in the example), keep the finance caveat, and keep the LEI team leader description as the model.

**Debate 2: office tools for andon alerts.** IT/OT architect wanted to discourage collaboration tools for andon entirely; SEO pointed out that many readers search for "andon Teams alerts". Resolution: allow them for the 30- and 60-minute levels and reporting after testing delivery times; first-level signals stay local. No product claims were added.

### Optimization 1: what changed (old -> new)

- Business case table: added "Cost of a dedicated responder: −$139,840" (1 × 2 shifts × 1,840 h × $38) and "Net value per year: $112,160".
- Queueing section: added "The service time must include walking ... With two responders sharing calls, the M/M/c model applies ...".
- Escalation rules: new rule 6 "Quality calls trigger containment" with poka-yoke link; new paragraph "Unpaced lines and job shops" including the water spider.
- Digital andon design points: new bullet "Line stop is a control function".
- Culture: new bullet "Protect safety reports" with OSHA worker participation [15] (new source, opened and verified: reporting process, no retaliation, workers may request temporary suspension or shutdown of unsafe work).
- FAQ: new question "What is an andon board?" [1].
- Conclusion: "An andon system is a promise: ... the response keeps it." -> "An andon system tells operators one thing: if you signal a problem, help will come in time. The light and the board make that visible; the response makes it true."

### Round 2

1. **Practitioner: satisfied.**
2. **Academic: satisfied.** Rechecked the queueing table: λ = 3, 6, 8, 9 per hour with μ = 10 gives Wq = 0.043 h (2.6 min), 0.15 h (9 min), 0.4 h (24 min), 0.9 h (54 min). Correct.
3. **IT/OT architect: satisfied.**
4. **Quality lead: satisfied.**
5. **Finance (changes needed, minor):** The "Value per day" row reads $1,050 = 30 units × $35; correct. Ask to note that hardware and software are excluded from the net figure; the table says "before hardware, software and training". Satisfied after that check.
6. **Worker voice and lean coach: satisfied.**
7. **SEO specialist (changes needed, minor):** Add BreadcrumbList with the nested URL and set the FAQPage to 11 questions in the schema notes.
8. **Fact checker (changes needed, minor):** New OSHA bullet checked against [15]; matches. Ask to document the Toyota UK wording conflict and the secondary status of the alarm rates in the editorial notes.
9. **Critic: satisfied.**

**Debate:** none.

### Optimization 2: what changed (old -> new)

- Editorial notes: documented the Toyota UK wording conflict (handled by relying on LEI), Wikipedia 2014 claim [unverified beyond Wikipedia], alarm rates [unverified against the standard text], Everett and Sohal as a candidate peer-reviewed source.
- Schema: BreadcrumbList added; FAQPage 11 questions.

### Round 3

1. **Practitioner: satisfied.** The escalation matrix and queueing table are usable as they are.
2. **Academic: satisfied.**
3. **IT/OT architect: satisfied.**
4. **Quality lead: satisfied.**
5. **Finance: satisfied.**
6. **Worker voice and lean coach: satisfied.** "No targets for fewer calls" and report-by-line are the two rules that protect operators.
7. **SEO specialist: satisfied.** Covers every question collected from the SERP, about 2.5 times the length of the longest competitor (Vorne, approx. 1,400 to 1,600 words), within the 3,000 to 5,000 range; parent link in the first 150 words.
8. **Fact checker: satisfied with documented open items** (alarm rates via secondary source, Wikipedia-only claims, Graban estimates). Disclosure line and absence of sponsored labels checked.
9. **Critic: satisfied.** Final pass for em-dash chains, clichés and vendor bias: none found; Vorne is cited only for generic statements.

**Optimization 3 (after the round 3 SEO recount, old -> new):** meta description 150 -> 148 characters (recounted); final word count inserted in the metadata table.

**Consensus statement:** All nine roles sign off. The article goes beyond the ranking pages with the fixed-position stop, a sample escalation matrix, response-time math, alarm-management rules adapted from ISA-18.2, OSHA-consistent color guidance, KPIs and a business case with its costs; open items are listed in the editorial notes.

**Word count:** `wc -w` of H1 through the end of the Conclusion (including FAQ, excluding Further reading): 4,783 words.

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (accessed November 20, 2026):

- ISA-18.2 alarm rates: [unverified against the standard text] -> partly closed: a Honeywell white paper (WP-20-24-ENG, October 2020) tabulates the same ISA-18.2 figures (~150 per day, ~1 per 10 minutes; ~300 and ~2 "may be manageable") [16]; added as a second source in section 7. Still not checked against the paid standard text.
- Toyota wireless buttons since 2014: still unverified beyond Wikipedia (search found no Toyota or independent page). Decision for Mirko: keep with attribution or delete.
- No sources in this article were marked as checked via a sister pillar.

Sign-off:
- **Fact checker:** satisfied; one item strengthened with an independent second source, one item left open and flagged for a decision.
- **Critic:** satisfied; the added clause is short and labeled as vendor source; no padding.
- **Subject expert (lean coach / practitioner):** satisfied; the wording "may be manageable" is more careful than "maximum manageable" and both are shown.

**Word count after round 4:** 4,807 words (+24).

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** web (no NEURONwriter analysis exists for this keyword). US web searches for "andon system" and "what is andon in manufacturing" on November 20; ranking pages opened on November 23, 2026 after the fetch quota reset. Search-tool order used as an approximation of the google.com SERP; no live PAA box available.

**SERP findings:** Vorne still leads; Duralabel (500–550 words), RZ Software (1,100–1,200, with a four-question FAQ) and Adobe (approx. 1,900, first for the variant) are new or more visible. No ranking page gives escalation thresholds, response-time math, KPI formulas or alarm-fatigue rules. Questions not yet answered by us: andon vs. jidoka, andon board vs. OEE dashboard. Details in the Competitive analysis section.

**Changes (old -> new):**
1. FAQ: 11 questions -> 13; new "What is the difference between andon and jidoka?" (sources [1][2], already in the article).
2. FAQ: new "What is the difference between an andon board and an OEE dashboard?" (source [1]; the OEE sentence is a definition, no new fact).
3. Competitive analysis: added the SERP re-check table.
4. Editorial notes, JSON-LD: "include all 11 FAQ questions" -> "include all 13 FAQ questions".
5. Metadata: word count 4,807 -> 4,931; longest competitor 1,400–1,600 (Vorne) -> approx. 1,900 (Adobe).
Meta title, meta description and H1 unchanged: the main keyword "andon system" is already in all three, and the SERP shows no better keyword fit.

**Sign-off:**
- **SEO specialist:** satisfied; both new questions come from the ranking pages and match real intent.
- **Critic:** satisfied; answers are short, plain and do not repeat the body.
- **Fact checker:** satisfied; the jidoka and board answers rest on [1] and [2], which were checked in rounds 1 to 4; no new facts.
- **Subject expert (lean coach / practitioner):** satisfied; the advice to keep andon calls above OEE charts on shared screens matches practice.

**Word count after round 5:** 4,931 words (+124).
