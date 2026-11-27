# SEO metadata

| Field | Value |
|---|---|
| Meta title | Standard Work in Lean: Elements, Benefits, Examples (51 characters; before the November 20, 2026 SERP re-check: "Standard Work in Lean: Elements, Forms and Examples") |
| Meta description | Standard work in lean: takt time, work sequence and standard WIP, how to implement it with a worked example, TWI Job Instruction and audit templates. (149 characters; before the re-check: "Standardized work explained: takt time, work sequence and standard WIP, with a worked combination table, TWI Job Instruction and audit templates.") |
| Slug | `/en/learn/shop-floor-management/standard-work/` (full URL: https://www.m365.fm/en/learn/shop-floor-management/standard-work/) |
| Parent pillar | [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) |
| Main keyword | standard work |
| Secondary keywords | standardized work, standard work lean, elements of standard work, standardized work combination table, standard work combination sheet, process capacity sheet, standardized work chart, standard WIP, standard work vs SOP, standard work template, job instruction breakdown, TWI Job Instruction, leader standard work, standard work audit |
| Search intent | Informational (definition, elements, documents) with a practical share (how to build the forms, templates, audits) |
| Target word count | 3,000 to 5,000 words H1..Conclusion (longest analyzed competitor approx. 1,600 to 1,800 words). Actual `wc -w` of H1..Conclusion (incl. FAQ, excl. Further reading): 5,144 words after the SERP re-check and optimization of November 20, 2026 (4,855 before) |
| Language version | `en-US`; new article, no German version, no hreflang pair; self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Method: web search for "standard work lean manufacturing standardized work" with US-weighted results, then the ranking pages were opened and their main text estimated (without navigation, footer and calls to action). Word counts are estimates from page fetches. The live "People also ask" box could not be captured directly; the questions below were collected from the ranking pages and their FAQ sections.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| lucid.co/blog/lean-manufacturing-standardized-work | 1,600–1,800 | clean three-element structure; takt time formula with one example (390 min ÷ 60 units = 6.5 min); six-step setup | no combination table, no standard WIP method, no TWI, no audit; only one calculation |
| isixsigma.com/dictionary/standard-work/ | approx. 1,100 | variability argument; benefits for training and improvement projects | takt time only mentioned, never calculated; no forms; no worked example |
| tulip.co/blog/what-is-standardized-work-and-how-to-apply-it/ | 900–1,000 | three elements, six steps | no forms, no numbers, benefit list skips an item, strong product pitch |
| en.wikipedia.org/wiki/Standard_work | approx. 300 (plus references) | names the three standardized work forms and separates standard work from SOPs | no history, no example, no "how to" |
| lean.org/lexicon-terms/standardized-work/ | approx. 400 | authoritative definition, three elements, three forms, link to job instruction sheet | glossary entry, no calculation, no implementation guidance |

**Questions found on the ranking pages:** What is standard work? What are the three elements of standard work? What is the difference between standard work and an SOP? What forms are used for standardized work? What is a standardized work combination table? How do you create standard work? Who writes standard work? How often should standard work be updated?

**How this article beats the competitors:** None of the top pages works through the three standardized work forms with real numbers. This article calculates takt time, a process capacity sheet, a full combination table for a four-station cell, standard WIP and the operator count, then shows how the job is taught with TWI Job Instruction and kept alive with leader standard work and audits. It separates standard work from SOPs, work instructions and job breakdowns in one table, covers non-cyclic work (changeovers, maintenance) and lockout/tagout, and ends with templates and a list of the mistakes that kill standard work in practice.

**NEURONwriter re-check (analysis of November 11, 2026; query "standard work", id eb1dd17893b01eaf, google.com, English):** NEURONwriter's top 18 organic results have a median of about 910 words and an average content score of 59; its recommended length is 908 words. Several results are short lean.org pages; Google's suggest data for "standard work" is mostly off-topic (working hours, blood work), so only the on-topic questions were used. The strongest pages by score:

| Page (NW rank) | Words (NW) | NW content score |
|---|---|---|
| vksapp.com/blog/4-types-standard-work (2) | 2,544 | 80 |
| poka.io (guide to standard work in lean manufacturing) (outside top 18) | 3,330 | 77 |
| learnleansigma.com (standard work explained) (15) | 1,866 | 73 |
| artoflean.com/reference/standard-work/ (9) | 948 | 72 |
| machinemetrics.com/blog/standard-work (1) | 1,680 | 71 |
| transformanceadvisors.com (what is standard work) (10) | 1,802 | 69 |
| **This article** | 5,144 | **76 before -> 87 after** |

People also ask (NW): What do we mean by standard work? What are the 7 key elements of lean manufacturing? What is SWIP vs WIP? What are three types of work in a lean process? NW topics: benefits of standard work (importance 7), how to create and implement standard work (7), how standard work supports continuous improvement (6), standard work vs. SOPs (5, already covered). Biggest term gap: "continuous improvement" (60% of competitors, 0 in our draft); also best practice, variation, Six Sigma, implementing standard work.

---

# Standard Work in Lean Manufacturing: Elements, Forms and a Worked Example

*Last updated: November 20, 2026*

> **Short answer:** Standard work (also called standardized work) is the current best way to do a job safely, with good quality, at the pace customers need. The Lean Enterprise Institute defines it through three elements: takt time, the precise work sequence an operator follows within takt time, and the standard inventory (standard WIP) needed to keep the process running smoothly [1]. It is documented on three forms (process capacity sheet, standardized work combination table, standardized work chart), taught with methods such as TWI Job Instruction, and changed whenever the team finds a better way.

This article is a deep dive within our guide to [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/). The pillar explains why standardization is one of the six elements of a daily management system. Here we build standard work step by step, with numbers you can recalculate.

### Key takeaways

- Standard work has three elements: takt time, work sequence and standard WIP [1]. A document that lacks one of them is a work instruction, not standard work.
- The three forms answer three questions: can the machines make the demand (process capacity sheet), can the operator do the work within takt (combination table), and where do people walk and where does material sit (standardized work chart) [1].
- At Toyota, the people who do the work help write the standard, and standardized work and kaizen are "two sides of the same coin" [2].
- A standard only survives if leaders check it on a fixed rhythm and treat deviations as information, not as misconduct [5][6].
- The worked example in this article shows a cell where a 160-second work content and a 75-second takt time lead to three operators, and how removing 10 seconds of waste brings it to two.

## Table of contents

1. [What is standard work?](#what-is-standard-work)
2. [The three elements of standard work](#the-three-elements-of-standard-work)
3. [Standard work vs. SOP, work instruction and job breakdown](#standard-work-vs-sop-work-instruction-and-job-breakdown)
4. [The three standardized work forms](#the-three-standardized-work-forms)
5. [How to create and implement standard work: worked example](#how-to-create-and-implement-standard-work-worked-example)
6. [Teaching standard work: TWI Job Instruction](#teaching-standard-work-twi-job-instruction)
7. [Keeping standard work alive: audits and leader standard work](#keeping-standard-work-alive-audits-and-leader-standard-work)
8. [Standard work for non-cyclic tasks](#standard-work-for-non-cyclic-tasks)
9. [Templates](#templates)
10. [Common mistakes](#common-mistakes)
11. [FAQ](#faq-standard-work)
12. [Conclusion](#conclusion)

## What is standard work?

Standard work is a written and visible agreement on how a job is done today. It states which steps happen in which order, how long the job may take, where material sits and how much of it is allowed between steps. LEI calls it "establishing precise procedures for each operator's work in a production process" [1].

Two points separate standard work from a binder of procedures.

**It is tied to customer demand.** The job is designed to fit takt time, the rate at which customers need product. When demand changes, the standard changes. Toyota's 1992 booklet *The Toyota Production System* describes teams first changing their work procedures to meet a new takt time before anyone considers changing equipment [2].

**It is the baseline for improvement.** Without a current standard you cannot tell whether a change helped. Toyota's booklet defines standardized work as "team leaders establishing procedures and standards for their own teams' work" and kaizen as "teams of employees revising their work procedures and standards continually" [2]. The standard is meant to be revised. A standard that has not changed in three years on a line that has changed is often a sign that nobody uses it.

### Benefits of standard work: a baseline for continuous improvement

- **Less variation.** When every shift follows the same current best practice, differences in output, quality and safety between operators shrink, and the remaining variation points to a real problem.
- **Visible waste.** Waiting, walking and searching show up on the combination table, so the standard reduces waste instead of hiding it.
- **Faster training.** New employees learn one defined method, taught with TWI Job Instruction (see below), instead of three versions picked up from colleagues.
- **Measurable improvement.** Each kaizen starts from the defined standard and ends in a new one, so continuous improvement can be measured rather than claimed [2].
- **Clear documentation.** Auditors, engineers and managers see the same method that operators use.

## The three elements of standard work

### 1. Takt time

Takt time is the available production time divided by customer demand. LEI describes it as "the rate at which products must be made in a process to meet customer demand" [1].

**Formula:** takt time = net available time per period ÷ customer demand per period

**Example:** A plant runs two 8-hour shifts. Each shift has 480 minutes, minus 30 minutes of breaks: 450 minutes net, 900 minutes per day, or 54,000 seconds. Demand is 720 units per day.

Takt time = 54,000 s ÷ 720 = **75 seconds per unit**.

Takt time is not the same as cycle time. Takt is the pace the customer demands; cycle time is what the process actually achieves. Lucidchart's guide shows the same logic with a 390-minute day and 60 units, which gives 6.5 minutes per unit [9]. Do not subtract planned downtime for breakdowns or changeovers from the available time to "make takt fit". That hides losses that belong on the [manufacturing KPI](https://www.m365.fm/en/learn/manufacturing-kpis/) board.

### 2. Work sequence

The work sequence is the exact order in which one operator performs the steps of the job within takt time [1]. It includes walking. A good sequence avoids backtracking, keeps hands busy while machines run and puts quality checks where a defect would otherwise move on. It should also avoid awkward reaches, lifts and repeated twisting; ask the operator which steps hurt at the end of the shift, because the stopwatch will not tell you. The sequence is written per operator, not per product: if two operators share a cell, each gets a sequence.

### 3. Standard WIP (standard inventory)

Standard work in process is the minimum number of parts inside the process needed to keep it running smoothly, including the parts inside machines [1]. It is a fixed number, not a range. If the standard says four pieces and you find nine, overproduction has started. If you find two, the operator will wait. Standard WIP is often marked on the bench or rack with a painted square or outline, which links standard work to [5S and visual management](https://www.m365.fm/en/learn/5s-visual-management/) (planned).

## Standard work vs. SOP, work instruction and job breakdown

The terms are used interchangeably online, which causes confusion in audits and training. Wikipedia separates standard work, which describes how an operator performs the job and interacts with tools, equipment and product, from a standard operating procedure, which states rules and technical requirements such as a torque value [8]. LEI adds two related documents: the job instruction sheet (also called job breakdown sheet or job element sheet), used to train new operators and listing the job steps and any special knack, and the work standards sheet that summarizes how the product must be built to engineering specification [1].

| Document | Answers | Owner (typical) | Contains takt, sequence and WIP? | Used for |
|---|---|---|---|---|
| Standardized work (the three forms) | How is this job done at the pace of demand? | team leader and operators, supported by engineering | yes | running and improving the process |
| Standard operating procedure (SOP) | What rules and requirements apply? | quality, engineering | no | compliance, specification, quality system |
| Work instruction | How do I do this task step by step? | engineering, team leader | usually not | reference at the workstation |
| Job instruction / job breakdown sheet | What are the steps and the knack, and why? | trainer, team leader | no | training new operators [1] |
| Work standards sheet | What must the product meet? | engineering | no | build-to-specification checks [1] |

In practice a plant with an ISO 9001, IATF 16949 or AS9100 quality system will have controlled work instructions anyway. Standard work does not replace them. It sits on top: it takes the controlled method and adds time, sequence, walking and inventory. Some plants embed the combination table in the controlled document; others keep the three forms as team documents and reference the controlled instruction. Both work, as long as change control is clear. If a control plan or PFMEA references the standard work (for example, a check at step 5), a change to the sequence is a change to a controlled document and needs the same review and sign-off (see [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) for how revision control works when instructions go digital).

## The three standardized work forms

LEI lists three forms that engineers and front-line supervisors use to design the process and that operators use to improve their own jobs [1].

| Form | Question it answers | Main inputs | Output |
|---|---|---|---|
| Process capacity sheet | Can each machine make the demand? | manual time, machine time, tool change interval and time per machine | capacity per machine, bottleneck [1] |
| Standardized work combination table | Can the operator do the full loop within takt? | manual, walk and machine time per step, takt time | time chart of operator and machines [1] |
| Standardized work chart | Where does the operator walk and where does material sit? | layout, sequence, standard WIP, safety and quality points | layout sketch with takt, cycle time, sequence and WIP [1] |

Fill them in this order. Capacity first, because no work sequence can fix a machine that is too slow. Then the combination table. Then the chart, which visualizes the result for the team.

## How to create and implement standard work: worked example

The six steps below show how to build standard work for a machining cell, from the first stopwatch reading to the chart at the workstation.

The example is a U-shaped cell that turns, drills, deburrs, washes and gauges a steel bushing. All times are illustrative but internally consistent; recalculate them with your own data.

### Step 1: Observe and time the current method

Time each element at least ten times with a stopwatch at the workstation, together with the operator. A common practice is to use the lowest repeatable time rather than the average: the average includes the disruptions you want to remove, while the lowest repeatable time shows what the method can do when nothing goes wrong. Do not use a single fastest reading, and time an experienced operator who works at a normal, sustainable pace. Write down every disruption separately. They become your improvement list. Explain to the team beforehand why you are timing and that the result describes the method, not the person.

### Step 2: Process capacity sheet

Takt time is 75 seconds (from the calculation above). Net available time per day is 54,000 seconds.

The usual calculation on the form: time per piece = manual time + machine time + (tool change time ÷ pieces per tool change). Capacity = net available time ÷ time per piece.

| # | Machine / step | Manual time (s) | Machine time (s) | Tool change every (pcs) | Tool change time (s) | Time per piece (s) | Capacity per day (pcs) |
|---|---|---|---|---|---|---|---|
| 1 | CNC lathe | 8 | 55 | 500 | 300 | 63.6 | 849 |
| 2 | Drill | 7 | 40 | 1,000 | 240 | 47.24 | 1,143 |
| 3 | Deburr (manual) | 12 | 0 | 2,000 | 120 | 12.06 | 4,477 |
| 4 | Washer | 10 | 30 | none | 0 | 40.0 | 1,350 |
| 5 | Gauge and pack | 9 | 0 | none | 0 | 9.0 | 6,000 |

Check for the lathe: 300 ÷ 500 = 0.6 s; 8 + 55 + 0.6 = 63.6 s; 54,000 ÷ 63.6 = 849 pieces. Demand is 720 per day, so every machine can make the demand. The lathe is the bottleneck with 849, which leaves 15 percent headroom. If a machine comes out below demand, you need a second machine, a shorter machine cycle or more time, and you stop here.

### Step 3: Standardized work combination table

The table lists each step with manual time, walk time to the next step and machine time. On the paper form the times are drawn as lines on a time scale: manual as a solid line, walking as a wavy line, machine time as a dashed line, with takt time as a vertical red line. Here is the same information as a table for one operator running the whole cell.

| # | Step | Manual (s) | Walk to next (s) | Machine (s) | Operator clock at end of step (s) |
|---|---|---|---|---|---|
| 1 | Take blank from rack, unload and load lathe, start | 8 | 2 | 55 | 10 |
| 2 | Unload and load drill, start | 7 | 3 | 40 | 20 |
| 3 | Deburr part by hand, visual check of bore | 12 | 2 | 0 | 34 |
| 4 | Unload and load washer, start | 10 | 3 | 30 | 47 |
| 5 | Gauge diameter, place in outgoing container | 9 | 4 (back to lathe) | 0 | 60 |
| | **Total** | **46** | **14** | | **60** |

**Reading the result:**

- Operator cycle time: 46 s manual + 14 s walking = **60 s**. Takt is 75 s. One operator can run the cell and has 15 s of slack per cycle.
- Machine check: each machine must finish before the operator comes back. The lathe is started at about second 8 and the operator returns 60 s later; 55 s machine time fits. The drill (40 s) and washer (30 s) fit easily.
- What to do with the 15 s of slack: do not let it fill with overproduction. Either run at takt and use the gap as a buffer for small problems (and mark the takt line on the board so early parts are visible), or combine the cell with another task so the operator's loop gets closer to 75 s.

### Step 4: Standard WIP

Count the parts that must sit in the process for the sequence to work:

| Location | Pieces | Why |
|---|---|---|
| Inside lathe | 1 | machine runs while operator walks |
| Inside drill | 1 | same |
| Inside washer | 1 | same |
| Deburr bench | 0 | operator carries the part from drill to bench and finishes it in the same loop |
| **Standard WIP** | **3** | |

If the sequence ran against the flow (for example, the operator loads the washer before unloading the drill), you would need a part waiting between steps and standard WIP would rise. That is why sequence and WIP are calculated together.

### Step 5: Standardized work chart

Draw the cell layout, number the stations in sequence, draw the walking path, mark the three standard WIP positions with a filled circle, mark the quality check (step 5, gauge) with a diamond and the safety point (step 1, chip guard on the lathe) with a cross. Write takt time (75 s), cycle time (60 s) and standard WIP (3) in the header. Post it at the cell at eye level.

### Step 6: What happens when demand rises

Sales raises demand to 1,350 units per day. Takt drops to 54,000 ÷ 1,350 = 40 s.

- The process capacity sheet now fails at the lathe (849 per day) and the drill (1,143). A second lathe and drill, or shorter machine times, are needed before any work redesign makes sense.
- Assume a second cell with the same machines. Total work content (manual + walk) for one part is 60 s; with two cells at a combined output of 1,350 per day, each cell needs a takt of 80 s, which one operator per cell can meet.

Now take the case where work content grows. A new customer variant adds a 100-second manual assembly and test after the gauge station, so the work content per unit becomes 160 s. At 75 s takt:

Operators needed = total work content ÷ takt time = 160 ÷ 75 = 2.13, which rounds up to **3 operators**.

Three operators at 2.13 operators' worth of work means about 0.87 of an operator waits every cycle. The kaizen target is clear: remove at least 10 seconds of work content (160 → 150 s), and 150 ÷ 75 = 2.0 operators. That is where improvement starts: walking, reaching, searching and rework, usually visible on the combination table. Balancing to exactly 100 percent leaves no room for any disruption, so many teams target a little below takt; how much margin is a local decision.

**What the saved operator is worth, and what happens to the person.** One operator per shift on two shifts is about 2 × 1,840 paid working hours per year (an assumption; use your own figure) × $38 loaded labor cost = about $139,800 per year of capacity. Whether that becomes a cost saving or capacity for growth is a management decision. If people lose their jobs because of improvements they helped find, the improvements stop. Many lean plants therefore commit that nobody is laid off as a result of kaizen and move freed operators to other work, training or the next improvement project. Decide and announce the policy before the first combination table is drawn.

## Teaching standard work: TWI Job Instruction

A standard on paper changes nothing until people can do the job that way. The most widely used training method for this is Job Instruction from Training Within Industry (TWI), a program the US War Department developed in the 1940s to train a new, inexperienced wartime workforce [4]. TWI has three core modules: Job Instruction, Job Methods and Job Relations; the standard Job Instruction class lasts 10 hours [4].

Job Instruction follows four steps [3]:

| Step | What the trainer does |
|---|---|
| 1. Prepare the worker | asks what the learner already knows about the job and explains why the job matters [3] |
| 2. Present the operation | tells and shows the job, dosing new information in small segments; the TWI Institute describes presenting the job three times [3] |
| 3. Try-out performance | the learner does the job and explains it; the TWI Institute describes four repetitions with correction of errors [3] |
| 4. Follow up | the learner works on their own while the trainer checks back on progress [3] |

The motto of the program sums it up: "If the worker hasn't learned, the instructor hasn't taught" [3].

The job breakdown sheet links training back to standard work. It lists the job steps and the special knack needed to do the job safely and well [1]. The combination table tells you what happens and when; the breakdown tells a new operator how to do the difficult parts, such as how to feel that a part is fully seated. Keep both under the same revision number so training never runs on an outdated version.

For skills matrices, cross-training plans and the workforce side of TWI, see the cluster [manufacturing workforce skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) (planned).

## Keeping standard work alive: audits and leader standard work

Standards decay. Tools move, a new operator learns a shortcut, a material change adds a step. Without a routine that compares the standard with reality, the posted chart turns into wallpaper within months.

**Daily check at team level.** At Toyota, team leaders lead teams of five to eight people, respond to line stops and andon calls and check daily, with standardized work audit sheets, that team members follow the procedures [5]. The audit takes minutes: watch one or two cycles, compare with the chart, ask the operator whether anything gets in the way.

**Layered checks.** Supervisors, area managers and plant managers check the same standards at lower frequencies. This is the process confirmation or layered process audit described in the parent pillar's section on [leader standard work](https://www.m365.fm/en/learn/shop-floor-management/). LEI describes leader standard work as shifting managers away from being the primary problem solvers toward building the problem-solving capability of their people [6]. David Mann, as summarized in a review of *Creating a Lean Culture*, puts the share of standardized time at about 80 percent of the day for a supervisor and 100 percent for operators [7].

**What an audit finding means.** There are three possible reasons for a deviation, and each leads to a different action:

| Finding | Likely cause | Action |
|---|---|---|
| Operator does not follow the standard and the standard works | training gap, unclear chart | retrain with Job Instruction, improve the visual |
| Operator does not follow the standard because it does not work | standard is outdated or wrong | fix the standard with the operator, retrain everyone |
| Operator found a better way | improvement | test it, measure it, make it the new standard |

Only the first row is about the operator, and even there the action is training. If audits are used to punish, operators hide deviations and the plant loses its best source of improvement ideas. Toyota's 1992 booklet is explicit that "the employees who implement its guidelines are the same people who establish those guidelines" [2].

## Standard work for non-cyclic tasks

Takt-based standard work fits repetitive jobs. Many jobs are not: changeovers, material replenishment, maintenance, quality inspections, first-piece approval, start-up and shutdown. These still benefit from a defined sequence and time, just without a takt line.

| Task type | What to standardize | Related method |
|---|---|---|
| Changeover | sequence of internal and external tasks, who does what, target time | [SMED changeover reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/) (planned) |
| Autonomous maintenance | cleaning, inspection and lubrication route, frequency, criteria | [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned) |
| Material replenishment | route, frequency, quantity per pick | [kanban and pull](https://www.m365.fm/en/learn/kanban-pull-system/) (planned) |
| Jam clearing, minor adjustments | steps, energy control, when to call maintenance | OSHA 29 CFR 1910.147 |
| Responding to an andon call | who responds, in what time, with what decision | [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/) |

**Lockout/tagout belongs in the standard.** OSHA's lockout/tagout standard covers servicing and maintenance in which unexpected energization or start-up, or the release of stored energy, could injure employees [10]. Its exception for "minor tool changes and adjustments, and other minor servicing activities" only applies if they are routine, repetitive and integral to production and if alternative measures give effective protection [10]. A combination table that says "clear chip jam, 15 s" without stating how the operator is protected is incomplete. Write the protective measure into the step and have your safety team confirm that the exception actually applies.

## Templates

### Template 1: Process capacity sheet

| # | Machine | Manual (s) | Machine (s) | Tool change every (pcs) | Tool change time (s) | Time per piece (s) = manual + machine + change ÷ pcs | Capacity = available time ÷ time per piece |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |

Header: part number, available time per day, demand per day, takt time, date, prepared by.

### Template 2: Standardized work combination table

| # | Step | Manual (s) | Walk (s) | Machine (s) | Time scale 0 ... takt (draw lines) |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| | Total | | | | operator cycle = manual + walk |

Header: takt time, operator cycle time, operator number, revision, date, signed by team leader and operator.

### Template 3: Standardized work chart (header fields)

| Field | Content |
|---|---|
| Process / cell | |
| Takt time / cycle time | |
| Standard WIP (number and positions) | |
| Sequence numbers on layout | |
| Symbols | circle = standard WIP, diamond = quality check, cross = safety point |
| Revision / date / approved | |

### Template 4: Daily standard work audit card

| Question | Yes / No | Note |
|---|---|---|
| Is the current revision posted at the workstation? | | |
| Does the observed sequence match the chart? | | |
| Is standard WIP at the marked number? | | |
| Did the cycle fit within takt in two observed cycles? | | |
| Are quality and safety points done as marked? | | |
| Does the operator report anything that gets in the way? | | |
| Action, owner, due date | | |

## Common mistakes

1. **Written by engineering alone.** The standard looks correct and nobody follows it. Build it at the workstation with the operators who do the job [2].
2. **Average times instead of repeatable times.** The standard absorbs the waste it should expose.
3. **No takt time on the form.** Without takt the document cannot tell you whether the job fits demand. It is a work instruction.
4. **Standard WIP as a range.** "3 to 8 pieces" means nobody notices overproduction.
5. **Posted and never audited.** The chart becomes wallpaper. Put the check into the team leader's daily routine [5].
6. **Audits as policing.** Operators hide deviations; improvement stops.
7. **Frozen standards.** A standard that has not changed since launch on a line that has seen new variants and new people is not a standard anymore. Review it whenever takt, layout or product changes, and after every kaizen. See [kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) (planned) and the [PDCA cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) (planned).
8. **Balancing to 100 percent of takt.** Any small problem then means a missed unit. Decide on a margin consciously.
9. **Safety left out of non-cyclic steps.** Jam clearing and adjustments need their energy control in the standard [10].
10. **Training without method.** "Watch Joe for a week" spreads Joe's shortcuts. Use Job Instruction [3].

## FAQ: standard work

### What is standard work in simple terms?

It is the agreed, current best way to do a job at the pace customers need, written down so everyone does it the same way and so the team can see when something deviates and improve it.

### What are the three elements of standard work?

Takt time, the work sequence an operator follows within takt time, and standard inventory (standard WIP), including units inside machines [1].

### What is the difference between standard work and an SOP?

An SOP states rules and technical requirements, such as a torque value. Standard work describes how an operator does the job in sequence and time, with walking and inventory, at the pace of demand [8].

### What forms are used for standardized work?

The process capacity sheet, the standardized work combination table and the standardized work chart [1]. They are often used together with a job instruction (job breakdown) sheet for training and a work standards sheet for product requirements [1].

### What is a standardized work combination table?

A form that shows manual work time, walk time and machine processing time for each step against takt time, so you can see whether one operator can do the job within takt and how operator and machines interact [1].

### What is an example of standard work?

A one-operator machining cell with a 75-second takt time: the operator unloads and loads the lathe, the drill and the washer, deburrs by hand and gauges each part in a fixed loop of 46 seconds of manual work and 14 seconds of walking, with three parts in process. The worked example in this article shows all three forms for that cell.

### Who should write standard work?

The team leader and the operators who do the job, supported by an industrial engineer for times and specifications. Toyota describes team leaders establishing procedures for their own teams and teams revising them continually [2].

### How often should standard work be updated?

Whenever takt time, the layout, the product or the method changes, and after every successful improvement. A fixed review date (for example, once a year) is a safety net, not the main trigger.

### Is standard work only for assembly lines?

No. Cyclic jobs use the full three forms. Non-cyclic jobs such as changeovers, maintenance routes or andon responses use a defined sequence and target time without a takt line.

### What is leader standard work?

The application of standard work to leaders: a defined daily routine of checks, meetings and coaching. LEI describes it as moving managers from solving problems themselves toward building their people's problem-solving capability [6].

### Is standard work too rigid? Does it kill creativity?

Not if it is used as intended. The standard is the baseline that makes improvement measurable, and the people doing the work are expected to improve it [2]. It becomes rigid only when nobody is allowed to change it.

### What is SWIP vs. WIP?

SWIP (standard work in process) is the fixed minimum number of parts the process needs to run smoothly, including parts inside machines [1]. WIP is whatever is actually in the process right now. If WIP is above SWIP, overproduction or a blockage has started; if it is below, an operator will wait.

### How does standard work relate to Six Sigma?

In a Six Sigma or Lean Six Sigma DMAIC project, updating standard work is a typical Control-phase action: the improved method only holds if it becomes the defined standard and is audited. Standard work also gives the stable baseline that a Six Sigma team needs before it can separate special causes from normal variation.

## Conclusion

Standard work is three numbers and one drawing: takt time, the operator's sequence, the standard WIP and a chart that shows them at the workstation. The value comes from the calculation behind them. The process capacity sheet shows whether the machines can make the demand, the combination table shows whether the operator can, and the operator count formula (work content ÷ takt) tells you exactly how much waste you need to remove to save an operator.

The forms are the easy part. The hard part is the routine around them: building the standard with the operators, teaching it with a method like TWI Job Instruction, checking it every day, and changing it whenever someone finds a better way. That routine is what connects standard work to the rest of [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/): the tier board shows the deviation, the andon calls for help in real time, and the improved method becomes the next revision of the standard.

## Further reading on m365.fm

**Parent pillar**
- [Shop floor management and gemba walks](https://www.m365.fm/en/learn/shop-floor-management/)

**Sibling clusters (planned)**
- [Andon systems: design, escalation and response](https://www.m365.fm/en/learn/shop-floor-management/andon/) (planned)
- [Paperless manufacturing and digital work instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) (planned)

**Related pillars and clusters (planned; check links before go-live)**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) (planned)
- [PDCA cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) (planned)
- [5S and visual management](https://www.m365.fm/en/learn/5s-visual-management/) (planned)
- [SMED changeover reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/) (planned)
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned)
- [Kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Manufacturing workforce skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) (planned)

**Terms**
[Standard work](https://www.m365.fm/entity/standard-work/) · [Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Lean management](https://www.m365.fm/entity/lean-management/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Germany. On m365.fm he writes about lean management, operational excellence and digitizing manufacturing with Microsoft 365 and Azure.

**Note: The author works at iFAKT GmbH.**

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All sources accessed on November 20, 2026.

1. Standardized Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/standardized-work/
2. Graban, M.: Toyota's 1992 View: Standardized Work and Kaizen Are Two Sides of the Same Coin. Lean Blog, July 22, 2026 (quotes Toyota Motor Corporation, *The Toyota Production System*, April 1992). https://www.leanblog.org/2026/07/standardized-work-and-kaizen-toyota/
3. TWI Job Instruction (program page). TWI Institute. https://www.twi-institute.com/programs/twi-job-instruction/
4. Ortiz, T.: Rethinking How We Train. Target magazine, Association for Manufacturing Excellence (AME), Summer 2019. https://www.ame.org/files/rethinking_how_we_train_-_target_magazine_summer_2019.pdf
5. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
6. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
7. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
8. Standard work. Wikipedia (English). https://en.wikipedia.org/wiki/Standard_work
9. Setting up standardized work and Lean manufacturing. Lucid Software blog. https://lucid.co/blog/lean-manufacturing-standardized-work
10. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147

# Editorial notes

## Vendor claims, unverified items and items to check before publication

- **URL scheme:** Cluster URL nested under the parent pillar (`/en/learn/shop-floor-management/standard-work/`) per the course expansion brief; this nesting is an assumption of the brief. Confirm with the CMS before go-live.
- **Worked example:** All times, demand figures, tool change intervals, labor rates (2 × 1,840 paid hours, $38 loaded) and the cell layout are illustrative and internally consistent (recalculated in review round 2). They are not sourced benchmarks and are worded as examples.
- **Process capacity sheet formula:** LEI states the purpose of the form (capacity of each machine in a linked set of processes) [1]; the calculation "manual + machine + tool change time ÷ pieces per change" is the usual layout of the form in practice, worded as "the usual calculation on the form", not attributed to LEI.
- **Lowest repeatable time:** described as a common practice, not as a sourced rule.
- **TWI Job Instruction:** Steps 1, 3 and 4 are named on the TWI Institute page; step 2 is described there ("tell and show", three presentations) but not named; the name "Present the operation" is the common TWI label and was kept [unverified as an exact quote from the fetched page]. The 10-hour class length, the three modules and the 1940s War Department origin are from the AME article [4]. The motto is quoted from the TWI Institute page [3] (AME uses the variant "If the learner hasn't learned, the instructor hasn't taught" [4]).
- **Toyota 1992 booklet:** quoted via Mark Graban's Lean Blog article [2], not from the booklet itself (no public copy found). Labeled as such in the sources.
- **Mann, 80 percent for supervisors:** via the Lean Blog book review [7]; re-opened in the verification pass of November 20, 2026 (operators 100 percent, supervisors 80 percent of the day confirmed); not checked in the book itself.
- **No-layoff policy:** a common lean recommendation, worded as practice ("many lean plants"), not sourced to a study.
- **Peer-reviewed literature:** no DOI-referenced study was added; the cluster relies on LEI, TWI Institute, AME, Toyota (via Graban) and OSHA. If the editor wants an academic source, add one after checking it online.
- **Competitive analysis:** word counts are estimates from page fetches; the live People-also-ask box was not captured. Verify the SERP with an SEO tool (e.g. NeuronWriter) before publication.
- **Table of contents anchors:** test after CMS import.
- **iFAKT:** not mentioned in the body (no natural fit); disclosure only in the author box, exactly as required. No sponsored label.

## Internal links

- Parent pillar in the first 150 words (intro paragraph after the short answer) and in Further reading.
- Sibling clusters: andon (non-cyclic tasks table, Further reading), paperless manufacturing (change control paragraph, Further reading).
- New pillars and clusters in the body: 5s-visual-management, smed-changeover-reduction, tpm-oee, kanban-pull-system, lean-manufacturing/kaizen, lean-manufacturing/pdca-cycle, operational-excellence/manufacturing-workforce-skills; existing pillar manufacturing-kpis. All marked "(planned)" in Further reading.
- Not linked: mes-isa-95 (no natural anchor; the paperless sibling links it), ifakt-polaris (no genuine fit).

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Standard Work in Lean Manufacturing: Elements, Forms and a Worked Example",
      "inLanguage": "en-US",
      "url": "https://www.m365.fm/en/learn/shop-floor-management/standard-work/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/shop-floor-management/"},
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "about": [{"@type": "Thing", "name": "Standardized work"}, {"@type": "Thing", "name": "Takt time"}]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What are the three elements of standard work?",
         "acceptedAnswer": {"@type": "Answer", "text": "Takt time, the work sequence an operator follows within takt time, and standard inventory (standard WIP), including units inside machines."}},
        {"@type": "Question", "name": "Is standard work too rigid? Does it kill creativity?", "acceptedAnswer": {"@type": "Answer", "text": "Not if it is used as intended. The standard is the baseline that makes improvement measurable, and the people doing the work are expected to improve it. It becomes rigid only when nobody is allowed to change it."}},
        {"@type": "Question", "name": "What is SWIP vs. WIP?", "acceptedAnswer": {"@type": "Answer", "text": "SWIP is the fixed minimum number of parts the process needs to run smoothly, including parts inside machines; WIP is what is actually in the process. WIP above SWIP signals overproduction or a blockage."}},
        {"@type": "Question", "name": "How does standard work relate to Six Sigma?", "acceptedAnswer": {"@type": "Answer", "text": "Updating standard work is a typical Control-phase action in a DMAIC project, and standard work gives the stable baseline needed to separate special causes from normal variation."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 2, "name": "Shop floor management", "item": "https://www.m365.fm/en/learn/shop-floor-management/"},
        {"@type": "ListItem", "position": 3, "name": "Standard work", "item": "https://www.m365.fm/en/learn/shop-floor-management/standard-work/"}
      ]
    }
  ]
}
```

FAQPage: include all 11 FAQ questions verbatim (without source markers).

## Recommended graphics

1. Combination table of the worked example as a time chart (manual solid, walk wavy, machine dashed, takt line red at 75 s).
2. Standardized work chart of the U-cell with sequence numbers, walking path, WIP circles, quality diamond and safety cross.
3. Printable PDF templates for the four tables in the Templates section.

## Cannibalization

- The parent pillar covers standardization in one short element section and leader standard work in depth; this cluster takes the query "standard work / standardized work" and the forms. The pillar should link here from "Element 6: Standardization" (to be added in the final consistency check, not by this writer). The pillar's entity link `/entity/standard-work/` stays; the entity page should point to this cluster as the in-depth resource.
- Overlap with the planned cluster `manufacturing-workforce-skills` (TWI): this article covers Job Instruction only as the way to teach standard work and links there for skills matrices and the full TWI program.
- Overlap with `lean-manufacturing/kaizen` and `pdca-cycle`: only linked, not explained here.

## Review log

Review of the cluster article on November 20, 2026 with the nine-role panel of the course expansion brief, in three full rounds (Mirko's instruction of November 20, 2026: at least three rounds per cluster). Backup of the first draft: `standard-work.v1.md` in the session scratchpad. Research note: the session's shared web search quota ran out during research; all sources cited were opened with web fetch, and items that could not be reopened are marked in the editorial notes.

### Round 1

1. **Practitioner (changes needed):** The worked example is the strongest part; nobody on page one shows a full combination table. Two issues: "use the lowest repeatable time" reads like a law, while many plants use a selected representative time; and the time study advice should say which operator to time. Also wants a sentence on control plans, because in automotive a sequence change is a document change.
2. **Academic (changes needed):** Takt, capacity and operator-count math is correct. The process capacity formula is presented as if LEI defined it; it is practice. The 100-percent balancing remark should stay, but variability and learning curves are the reason, which the text should not overstate.
3. **IT/OT architect (satisfied):** Standard work is mostly a paper or document topic; the link to paperless for revision control is enough. No architecture claims to check.
4. **Quality lead (changes needed):** Separation from SOP, work instruction and job breakdown is useful. Missing: what happens when the standard work is referenced in a control plan or PFMEA.
5. **Finance (changes needed):** The 3-to-2 operator example stops before the money. A plant controller wants to see what one operator per shift is worth per year, and whether it is a saving or capacity.
6. **Worker voice and lean coach (changes needed):** The timing step mentions explaining the purpose, good. But if Finance adds a savings line, the article must say what happens to the freed operator; otherwise every reader on the floor hears "headcount reduction". Also: ergonomics is missing from the sequence design.
7. **SEO specialist, US (changes needed):** Keyword placement is good (H1, short answer, first H2, meta title). PAA-type query "standard work example" is not answered as a question. Internal links: parent in first 150 words, both siblings, seven new pillars/clusters; fine.
8. **Fact checker (changes needed):** Re-opened and checked: LEI standardized work (definition, three elements, three forms, job instruction sheet, work standards sheet) [1]; Graban on the 1992 booklet (both definitions, "same people who establish those guidelines", takt change before equipment) [2]; TWI Institute JI page [3]; AME article (10 hours, three modules, 1940s War Department) [4]; LEI team leader (five to eight, hourly, andon, audit sheets) [5]; Lucid takt example (390 min, 60 units, 6.5 min) [9]; OSHA 1910.147 scope and minor servicing note [10]; Wikipedia SOP distinction [8]. Errors: (a) step 1 of JI was described as "puts the learner at ease", which the TWI Institute page does not say; (b) step 2 description "one important step at a time" is not on the page, which speaks of "segmentation and dosing" and "tell and show"; (c) step 4 "checks back often and tapers off" is not on the page; (d) capacity table rounding: drill 47.2 s / 1,144 and deburr 12.1 s / 4,463 did not match the stated formula (corrected already during drafting to 47.24 s / 1,143 and 12.06 s / 4,477; rechecked).
9. **Critic (changes needed):** No em-dash chains, no AI clichés found. "is a sign that nobody uses it" is an overclaim. Key takeaways repeat the body closely, acceptable for a cluster. No iFAKT content; neutral.

**Debate 1: savings line vs. respect for people.** Finance wanted a dollar value for the saved operator; Worker voice objected that a savings line without a policy statement teaches readers to use standard work for headcount cuts. Practitioner sided with both: plants do need the number for capex decisions, and in his experience kaizen dies the day the first person is laid off. Resolution: add the value as "capacity", state that turning it into a cost saving is a management decision, and add the no-layoff-from-kaizen policy as common lean practice (not as a sourced fact).

**Debate 2: lowest repeatable time.** Academic preferred average or selected time with allowances (classical work measurement); Practitioner preferred lowest repeatable for standard work design. Resolution: keep lowest repeatable as "a common practice", explicitly reject single fastest readings, and require a normal, sustainable pace from an experienced operator.

### Optimization 1: what changed (old -> new)

- "A standard that has not changed in three years ... is a sign that nobody uses it." -> "... is often a sign that nobody uses it."
- "use the lowest repeatable time rather than the average." -> "A common practice is to use the lowest repeatable time ... Do not use a single fastest reading, and time an experienced operator who works at a normal, sustainable pace."
- JI step 1 "puts the learner at ease, asks what they already know, explains why the job matters" -> "asks what the learner already knows about the job and explains why the job matters [3]".
- JI step 2 "shows and tells the job in small portions, one important step at a time" -> "tells and shows the job, dosing new information in small segments; ... three times [3]".
- JI step 4 "the learner works on their own, the trainer checks back often and tapers off" -> "the learner works on their own while the trainer checks back on progress [3]".
- New paragraph after the operator-count calculation: "What the saved operator is worth, and what happens to the person" (2 × 1,840 h × $38 = about $139,800 per year of capacity; no-layoff-from-kaizen policy).
- Change control paragraph: added the control plan / PFMEA sentence.
- Work sequence: added the ergonomics sentence ("ask the operator which steps hurt at the end of the shift").
- FAQ: new question "What is an example of standard work?"

### Round 2

1. **Practitioner: satisfied.** Time study and control plan points fixed.
2. **Academic (changes needed, minor):** The capacity formula should not be attributed to LEI; please make sure the editorial notes say so. Also checked the new value line: 2 × 1,840 × 38 = 139,840, written as "about $139,800"; fine.
3. **IT/OT architect: satisfied.**
4. **Quality lead: satisfied.**
5. **Finance: satisfied.** Capacity framing is correct; the paid-hours assumption is labeled.
6. **Worker voice and lean coach: satisfied.** The policy sentence ("Decide and announce the policy before the first combination table is drawn") is the right order.
7. **SEO specialist (changes needed, minor):** Meta description is 145 characters; fine. Recommends the BreadcrumbList with the nested cluster URL and the FAQPage with all questions in the schema notes.
8. **Fact checker (changes needed, minor):** Re-checked the three corrected JI rows against [3]; they now match. Step 2's name "Present the operation" is not on the fetched page: label it in the notes. Re-ran all calculations: takt 54,000 ÷ 720 = 75; lathe 63.6 s / 849; drill 47.24 s / 1,143; deburr 12.06 s / 4,477; washer 40 s / 1,350; gauge 9 s / 6,000; operator loop 46 + 14 = 60 s; 1,350 per day gives takt 40 s and a per-cell takt of 80 s with two cells; 160 ÷ 75 = 2.13; 150 ÷ 75 = 2.0. All correct.
9. **Critic: satisfied, one note.** The new Finance/worker paragraph is the longest in the section but carries substance. No padding found.

**Debate:** none; all remaining points were editorial.

### Optimization 2: what changed (old -> new)

- Editorial notes: added "Process capacity sheet formula" note (practice, not LEI) and the TWI step 2 naming note [unverified as exact quote].
- Schema: BreadcrumbList with nested URL added; FAQPage set to 11 questions.

### Round 3

1. **Practitioner: satisfied.** Would use the templates as they are.
2. **Academic: satisfied.**
3. **IT/OT architect: satisfied.**
4. **Quality lead: satisfied.**
5. **Finance: satisfied.**
6. **Worker voice and lean coach: satisfied.** Audit table ("only the first row is about the operator") is the strongest respect-for-people passage.
7. **SEO specialist: satisfied.** Answers the three-elements, forms, SOP and combination table queries more completely than the top five pages, at more than twice the length of the longest competitor (Lucid, approx. 1,600 to 1,800 words), within the 3,000 to 5,000 range.
8. **Fact checker: satisfied with documented open items:** TWI step 2 label, Toyota booklet via secondary source, Mann via review, no peer-reviewed source. Final check of the disclosure line and the absence of any sponsored label: correct.
9. **Critic: satisfied.** Final pass: no em-dash chains, no "delve", no "game-changer", no marketing claims.

**Optimization 3 (after the round 3 SEO recount, old -> new):** meta title 50 -> 51 characters, meta description 146 -> 145 characters (recounted); final word count inserted in the metadata table.

**Consensus statement:** All nine roles sign off. The article is a focused deep dive on standardized work with a full worked example, sourced definitions and labeled practice values; open items are documented in the editorial notes.

**Word count:** `wc -w` of H1 through the end of the Conclusion (including FAQ, excluding Further reading): 4,855 words.

### Round 4: verification pass, November 20, 2026

- [7] Mann via Lean Blog (carried over from the parent pillar's check): re-opened; "100% of the time" for operators and "80% of the day" for supervisors confirmed; the review gives no figures for higher levels, which matches the text. Editorial note updated.
- TWI Job Instruction step 2 name "Present the operation": still unverified as an exact quote; the TWI Institute page [3] was re-opened and names steps 1, 3 and 4 ("Prepare the Worker", "Try-Out Performance", "Follow-Up") but refers to step 2 only as "Step 2".
- No [unverified] markers in the body text; no body text changed; word count unchanged.

Sign-off:
- **Fact checker:** satisfied; the only sister-pillar source is now re-checked; the TWI step 2 label stays flagged in the editorial notes.
- **Critic:** satisfied; nothing to change.
- **Subject expert (lean coach / TWI trainer):** satisfied; "Present the operation" is the standard TWI JI card wording, but keep the flag until a primary JI card is opened.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** NEURONwriter query eb1dd17893b01eaf ("standard work", google.com, analysis of November 11, 2026; no new analysis created). Content scored with evaluate-content using the article part (H1 to Further reading) and the meta title and description.

**Score:** 76 -> 87 (NW top-18 average 59, best competitor 80).

**Findings:** Strong coverage of the core (takt time, work sequence, standard WIP, forms). Gaps: "continuous improvement" never used; no benefits section; no "how to implement" heading; Six Sigma, best practice, variation, new employees, documentation, rigid, industrial engineer absent. PAA "What is SWIP vs WIP?" not answered directly. The PAA questions "7 key elements of lean manufacturing" and "three types of work in a lean process" belong to the parent pillar and were not added here.

**Changes (old -> new):**
1. New H3 "Benefits of standard work: a baseline for continuous improvement" (five bullets, about 120 words) under "What is standard work?"; only sourced statement reuses [2].
2. H2 "Worked example: building standard work for a machining cell" -> "How to create and implement standard work: worked example", plus a one-sentence intro (TOC updated).
3. FAQ "Does standard work kill creativity?" -> "Is standard work too rigid? Does it kill creativity?" (one sentence added); new FAQs "What is SWIP vs. WIP?" [1] and "How does standard work relate to Six Sigma?". JSON-LD FAQPage extended by three questions.
4. FAQ "Who should write standard work?": "supported by engineering" -> "supported by an industrial engineer".
5. Meta title "Standard Work in Lean: Elements, Forms and Examples" -> "Standard Work in Lean: Elements, Benefits, Examples" (51 characters); meta description now starts "Standard work in lean:" and adds "how to implement it with a worked example" (149 characters).
6. Word count: 4,855 -> 5,144 (`wc -w`, H1 to Conclusion incl. FAQ), within the 5,300 ceiling; no further additions possible without trimming.

Sign-off:
- **SEO specialist (US):** satisfied; 87 is the top score in the analyzed SERP; the main keyword is now in the meta description opening.
- **Critic:** satisfied; the benefits bullets are concrete and short; no keyword stuffing ("continuous improvement" used twice in new text).
- **Fact checker:** satisfied; no new numbers or external claims; the SWIP answer restates LEI's definition [1] verified in Round 4.
- **Subject expert (practitioner):** satisfied; the SWIP vs. WIP answer and the Control-phase link match plant practice.
