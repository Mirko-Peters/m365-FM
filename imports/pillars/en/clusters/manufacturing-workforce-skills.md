# SEO metadata

| Field | Value |
|---|---|
| Meta title | Manufacturing Workforce Skills: Skills Matrix, TWI, Training (60 characters) |
| Meta description | Close the manufacturing skills gap: skills matrix template with a worked example, TWI Job Instruction, registered apprenticeships and OSHA training. (150 characters) |
| Slug | `/en/learn/operational-excellence/manufacturing-workforce-skills/` (full URL: https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) |
| Parent pillar | [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/) |
| Main keyword | manufacturing workforce skills |
| Secondary keywords | manufacturing skills gap, skills matrix, skills matrix template, cross-training matrix, training matrix manufacturing, Training Within Industry (TWI), TWI Job Instruction, job breakdown sheet, registered apprenticeship manufacturing, OSHA training requirements, operator qualification, flexibility index, manufacturing talent retention |
| Search intent | Informational with a practical layer (plant managers, HR and training leads, production supervisors, CI coaches) |
| Target word count | 3,000 to 5,000 words H1..Conclusion (cluster rule). Actual: 4,826 words (after the round 5 SERP re-check; 4,642 after round 4) from H1 to the end of the Conclusion, counted with `wc -w` including FAQ and tables |
| Language version | `en-US`; new article without a German version, so no hreflang pair; self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

### SERP re-check, November 20, 2026 (top 10)

Method: US web searches for "manufacturing workforce skills" (main keyword), "skills matrix manufacturing" and "manufacturing skills gap" (variants). Positions are the order returned by the search tool and approximate the google.com SERP; no live "People also ask" box is available through the tool, so questions come from FAQ blocks and headings. Searches ran on November 20; pages were opened on November 23, 2026 after the fetch quota reset. Word counts are estimates of the main text.

**"manufacturing workforce skills"**

| Position (approx.) | Page | approx. words | Findings |
|---|---|---|---|
| 1 | nist.gov/mep/workforce-development | 1,100 to 1,200 | MEP services: assessment and planning, recruitment, training, retention, Job Quality Toolkit; no skills matrix, no TWI, no OSHA |
| 2 | deloitte.com/us/en/insights (Deloitte and The Manufacturing Institute, "Taking charge", April 3, 2024; two URLs) | 5,000 to 6,000 | source of the 3.8 million / 1.9 million figures; no plant tools |
| 3 | ey.com PDF on adaptive skills | not opened | consulting report |
| 4 | nist.gov (MEP node) | not opened | government page |
| 5 | industryweek.com, "Skilled Labor: Manufacturing's Anchor Amid Economic Uncertainty" | not opened | trade article |
| 6 | learningandwork.org.uk PDF | not opened | UK report |
| 7 | indeed.com/hire skills gap in manufacturing | 2,000 to 2,300 | causes, skill areas, upskilling, apprenticeships, measuring; two-question FAQ; no matrix, no TWI steps |
| 8 | ey.com article on next-generation skills | not opened | consulting |
| 9 | kpmg.com PDF "Manufacturing talent shortage: breaking point" (2026) | not opened | consulting report |
| 10 | MIT Work of the Future working paper | not opened | academic |

**"skills matrix manufacturing":** speach.me, ag5.com (guide and template), azumuta.com, World Economic Forum, Infor MES documentation, l2l.com, hashmicro.com, cloudassess.com (approx. 3,000 words; seven build steps, role examples, four-level scale novice to expert; FAQ: what a matrix should include, whether ISO 9001 or ISO 45001 require one, how often to update it, skills matrix vs. training matrix), vectorsolutions.com, fabrico.io, symestic.com, augmentir.com. All are software vendors; none covers TWI, apprenticeship standards or OSHA training rules.

**"manufacturing skills gap":** inddist.com / manufacturing.net, autodesk.com, netsuite.com, the NIST-hosted 2015 skills gap report, indeed.com, industryweek.com, deloitte.com, festo.com (approx. 700), cornerstoneondemand.com, mau.com, Siemens blog, l2l.com.

**Result:** the main keyword is led by government and research pages without plant tools; the skills matrix SERP is all vendors. Questions found that our FAQ did not answer: skills matrix vs. training matrix, how often to update the matrix, and whether ISO 9001 requires a skills matrix (all three added). No ranking page combines a matrix with evidence rules, TWI, apprenticeship standards and OSHA training.

### Authority pages read during the first research (not a SERP list)

The table below was compiled on November 20, 2026 before the search quota ran out; it is kept as background.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| deloitte.com (Deloitte and The Manufacturing Institute, "Taking charge", April 3, 2024) | long research report (page text over 100,000 characters) | the reference figures for the US skills gap, retention findings, digital skills | no plant-level tools: no skills matrix, no training method, no OSHA link |
| en.wikipedia.org/wiki/Training_Within_Industry | not counted | history, the four J programs, 1.6 million certifications, influence on Japan | no how-to for today's plants; no job breakdown example |
| twi-institute.com/job-instruction/ | short course page | current JI elements and course format | course sales page; no worked example |
| apprenticeship.gov (Registered Apprenticeship Program for employers) | short | DOL hallmarks of Registered Apprenticeship | no cost example, no link to day-to-day skills management |
| themanufacturinginstitute.org research page | n/a | lists research partners | report gated for members |

**Questions seen in competitor pages and headings:** What skills do manufacturing workers need? How big is the skills gap? What is a skills matrix and how do you create one? What is TWI and what are the steps of Job Instruction? How long is an apprenticeship? How do you retain workers?

**How this article beats the competition:** it combines the verified gap figures with the tools a plant runs every day: a skills matrix with evidence rules and a worked risk reading, a cost example for cross-training, a TWI job breakdown sheet, the federal apprenticeship standards (29 CFR 29.5) and the OSHA training rules that belong in the same matrix (1910.178(l), 1910.147(c)(7)).

---

# Manufacturing Workforce Skills: Skills Matrix, TWI and Apprenticeships for Plant Leaders

*Updated: November 20, 2026 · Reading time: about 20 minutes*

*A cluster article of the m365.fm [operational excellence guide](https://www.m365.fm/en/learn/operational-excellence/).*

> **Short answer:** Manufacturing workforce skills are the technical, digital, problem-solving and leadership abilities a plant needs to run safely and improve. Plants close skill gaps with three tools that work together: a skills matrix that shows who can do what, a structured way to teach jobs such as TWI Job Instruction, and longer pipelines such as registered apprenticeships.

> **Key takeaways**
> - The projected gap spans a decade. Deloitte and The Manufacturing Institute estimate that US manufacturing may need about 3.8 million new workers from 2024 to 2033 and that about 1.9 million of those jobs could go unfilled [1].
> - Use the skills matrix as a risk tool: its main job is to show which tasks depend on one or two people.
> - Measure coverage per task and per shift. In the worked example below, a cell with a 60% flexibility index still had two critical tasks with a single qualified person.
> - TWI Job Instruction gives supervisors a repeatable method to teach a job: break it down into what, how and why, demonstrate it, let the learner do it, then check and coach [4].
> - OSHA-required training belongs in the same matrix, with expiry dates, so qualification and compliance are tracked in one place.

This article is a cluster of the [operational excellence guide](https://www.m365.fm/en/learn/operational-excellence/) on m365.fm. The pillar names culture and people as one of the four pillars of operational excellence. This deep dive shows how a plant turns that pillar into daily practice: measuring skills, teaching jobs, building a pipeline and keeping the people it trained.

## Table of contents

1. [The manufacturing skills gap in numbers](#the-manufacturing-skills-gap-in-numbers)
2. [Which skills a plant needs](#which-skills-a-plant-needs)
3. [The skills matrix: structure and rating scale](#the-skills-matrix-structure-and-rating-scale)
4. [Worked example: reading a skills matrix for risk](#worked-example-reading-a-skills-matrix-for-risk)
5. [Worked example: cost of a cross-training plan](#worked-example-cost-of-a-cross-training-plan)
6. [TWI: teaching jobs the same way every time](#twi-teaching-jobs-the-same-way-every-time)
7. [Registered apprenticeships and longer pipelines](#registered-apprenticeships-and-longer-pipelines)
8. [OSHA training requirements in the matrix](#osha-training-requirements-in-the-matrix)
9. [Retention, pay and respect for people](#retention-pay-and-respect-for-people)
10. [A 90-day plan](#a-90-day-plan)
11. [Common mistakes](#common-mistakes)
12. [FAQ](#faq-manufacturing-workforce-skills)
13. [Conclusion](#conclusion)

## The manufacturing skills gap in numbers

| Indicator | Figure | Source |
|---|---|---|
| US manufacturing employment, October 2026 (preliminary, seasonally adjusted) | 12.68 million | BLS [2] |
| Manufacturing job openings, September 2026 (preliminary) | 594,000 | BLS JOLTS [2] |
| Manufacturing hires and separations, September 2026 (preliminary) | 331,000 hires, 326,000 separations | BLS JOLTS [2] |
| Net need for new manufacturing workers, 2024 to 2033 | about 3.8 million | Deloitte and The Manufacturing Institute [1] |
| Of those, jobs that could go unfilled if gaps are not addressed | about 1.9 million | Deloitte and The Manufacturing Institute [1] |
| Share of NAM survey respondents (Q1 2024) naming attracting and retaining talent as their primary business challenge | over 65% | cited in [1] |
| Share of current skill requirements in advanced manufacturing expected to change within five years | 40% (World Economic Forum projection) | cited in [1] |

Two observations for plant leaders. First, hires and separations are nearly equal, so a large part of recruiting just replaces people who left. Training that is slow or inconsistent turns that churn into a quality and safety problem. Second, the same Deloitte study reports that employees who believe they can acquire important future skills are 2.7 times less likely to leave within 12 months [1]. Training also works as a retention tool.

## Which skills a plant needs

| Skill area | Examples | Roles | How to build it |
|---|---|---|---|
| Safety | lockout/tagout, machine guarding, forklift operation, hazard communication | everyone, by task | OSHA-required training plus on-the-job verification |
| Core technical | machine operation, setup and changeover, quality checks, measuring | operators, setup technicians | TWI Job Instruction, standard work, qualification sign-off |
| Maintenance | mechanical, electrical, PLC troubleshooting, hydraulics | maintenance technicians | apprenticeships, vendor courses, TPM |
| Digital | MES and ERP transactions, digital work instructions, data on shop floor boards, basic spreadsheets and BI | operators to managers | short task-based modules, super-user networks |
| Problem solving | 5 Why, A3, PDCA, basic statistics | team leads, engineers, supervisors | coached projects, A3 reviews |
| Leadership | daily meetings, coaching, job relations, conflict handling | team leads, supervisors | TWI Job Relations, leader standard work |

The Deloitte study found that half of the manufacturers surveyed rated high digital proficiency as important or very important for their workforce [1]. In practice, the digital part is usually small for each person (a handful of MES screens, a tablet with [digital work instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)) but it has to be taught as carefully as a machine operation.

## The skills matrix: structure and rating scale

A skills matrix (also called a training matrix, cross-training matrix or qualification matrix) is a table with people in rows, tasks in columns and a rating in each cell. It answers three questions: who can do this task today, where we are exposed, and whom we train next.

**Rating scale.** Many plants use four or five levels. This one is simple to audit:

| Level | Meaning | Evidence required |
|---|---|---|
| 0 | not trained | none |
| 1 | in training; works only with a qualified person | training started, trainer named |
| 2 | qualified; works alone to standard | sign-off by supervisor after observation on at least three separate shifts (plant rule) |
| 3 | experienced; handles abnormalities and changeovers | sign-off plus documented handling of defined abnormal situations |
| 4 | trainer; can teach the task with TWI Job Instruction | level 3 plus trainer qualification |

A popular variant in lean plants uses the letters I, L, U and O, drawn as a quarter-filled to fully filled circle. The logic is the same. What matters is that each level has a clear evidence rule, so a "2" means the same thing on every shift. In plants certified to ISO 9001, the same records serve the audit: clause 7.2 d) requires the organization to "retain appropriate documented information as evidence of competence" [10].

**Template: skills matrix header**

| Field | Content |
|---|---|
| Area / cell | e.g. Cell 3, machining |
| Tasks (columns) | each task from the standard work or job breakdown list, plus required safety qualifications |
| Criticality per task | A = safety or quality critical, B = needed for output, C = occasional |
| Target per task | minimum number of people at level 2+ per shift (for example 3 for A tasks, 2 for B tasks) |
| People (rows) | name, shift, role |
| Cells | level 0 to 4, date of sign-off, expiry date where training must be renewed |
| Summary rows | people at level 2+ per task and shift, gap vs. target |
| Summary columns | tasks at level 2+ per person |
| Owner and review | supervisor; monthly review in the team meeting |

The targets in the table (three people per critical task and shift) are a plant rule of thumb, not a standard. Set them based on absenteeism, turnover and the consequences of a missing person.

## Worked example: reading a skills matrix for risk

*Illustrative example with fictional values.* Cell 3 on day shift has six operators and eight tasks. Level 2 or higher counts as qualified.

| Operator | T1 Saw | T2 CNC run | T3 CNC setup | T4 CMM measuring | T5 Deburr | T6 Wash | T7 Pack | T8 Forklift (OSHA) |
|---|---|---|---|---|---|---|---|---|
| Ana | 3 | 4 | 3 | 2 | 2 | 2 | 2 | 2 |
| Ben | 2 | 3 | 1 | 0 | 2 | 2 | 2 | 0 |
| Carla | 2 | 2 | 0 | 0 | 3 | 2 | 2 | 2 |
| Dev | 0 | 2 | 0 | 0 | 2 | 2 | 2 | 0 |
| Eli | 0 | 1 | 0 | 0 | 2 | 3 | 2 | 0 |
| Fay | 0 | 0 | 0 | 0 | 1 | 2 | 3 | 2 |
| **Qualified (2+)** | **3** | **4** | **1** | **1** | **5** | **6** | **6** | **3** |
| **Target** | 2 | 3 | 2 | 2 | 2 | 2 | 2 | 2 |
| **Gap** | 0 | 0 | **−1** | **−1** | 0 | 0 | 0 | 0 |

**Flexibility index** = qualified cells ÷ all cells = (3 + 4 + 1 + 1 + 5 + 6 + 6 + 3) ÷ (6 × 8) = 29 ÷ 48 = **60%** (calculate it per shift; a plant-wide average hides weak shifts).

That looks healthy. The task view tells a different story:

1. **CNC setup (T3) and CMM measuring (T4) depend on one person: Ana.** If she is on vacation, the cell cannot change over or release first articles. These are the tasks that stop output, and they are also the hardest to learn.
2. **Packing and washing are over-covered.** Six qualified people where two are needed. Cross-training has gone where it was easy, not where it was needed.
3. **Ana is qualified on all eight tasks and is the only level 4 trainer.** She is the cell's trainer, troubleshooter and backup. That is a single point of failure for people, the same as a sole-source supplier in the [supply chain resilience cluster](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/).

**Prioritize by criticality × gap.** T3 and T4 are A tasks with a gap of 1 each. Ben (level 1 on T3) is the obvious next setup technician; Carla, who is already strong on deburring and quality-sensitive work, is a candidate for CMM. Washing and packing need no new training this quarter.

**A better summary metric.** Next to the flexibility index, report the **number of tasks below target** (here: 2) and the **number of critical tasks with a single qualified person** (here: 2). These two numbers belong on the monthly operations review, the same way OEE does in the [manufacturing KPIs guide](https://www.m365.fm/en/learn/manufacturing-kpis/).

## Worked example: cost of a cross-training plan

*Illustrative example with fictional values.* The plant wants Ben qualified on CNC setup and Carla on CMM measuring.

| Item | Ben, CNC setup (T3) | Carla, CMM (T4) |
|---|---|---|
| Training time with trainer (Ana) | 40 hours | 24 hours |
| Trainee hours off normal output | 40 hours | 24 hours |
| Loaded labor cost per hour (wage plus benefits; use your controller's rate) | $42 | $42 |
| Trainee cost | $1,680 | $1,008 |
| Trainer cost (Ana's time, backfilled) | $1,680 | $1,008 |
| CMM software course (external) | – | $1,200 |
| **Total** | **$3,360** | **$3,216** |

**Total plan: $6,576.**

**What it avoids.** Last year, Ana was absent 22 days (vacation, sickness, training). On 9 of those days, changeovers were postponed or done by a setup technician from another cell on overtime, at about 4 hours of overtime per day at $63 per hour: 9 × 4 × $63 = **$2,268 of overtime**. In addition, postponed changeovers caused late orders twice, with expedited freight of $3,100 in total. Avoidable cost: about **$5,368 per year**, before counting the risk that Ana leaves the company.

Payback is a little over one year on avoidable cost alone. If the cell is the plant's bottleneck, add the value of lost output during training, or schedule the training hours in planned downtime. The real argument is risk: a cell where only one person can set up the machine is one resignation away from a capacity problem.

Two practical points. Schedule the training as planned work in the production plan, not "when there is time." And check whether the training changes a job classification or pay grade under your labor agreement before you start.

## TWI: teaching jobs the same way every time

Training Within Industry (TWI) ran from 1940 to 1945 within the War Manpower Commission during World War II [3]. Its four basic programs were 10-hour courses: Job Instruction (how to train inexperienced workers quickly), Job Methods (how to improve the way a job is done), Job Relations (how supervisors deal with people fairly) and Program Development (how training staff help line organizations solve problems through training) [3]. By the end of World War II, more than 1.6 million workers in over 16,500 plants had received a TWI certification [3]. Robinson and Schroeder's article in *California Management Review* examines the link between the US TWI programs and the Japanese management style [5].

**Job Instruction (JI) in plain terms.** The TWI Institute, which teaches the method today in 10-hour courses for up to 10 participants, describes four elements [4]:

1. Break the job down into the "one best way": what, how and why.
2. Present the process and demonstrate it.
3. Let the learner do the job and learn by doing.
4. Check progress, coach and encourage questions.

The credo attributed to the program sums up the attitude: "If the worker hasn't learned, the instructor hasn't taught" [3].

**Why it works in a plant.** Learning by shadowing a colleague copies good habits and bad ones. JI forces the trainer to write down the key points (the "how") and the reasons for them (the "why") before teaching. Those key points are often the tacit knowledge that separates a level 2 operator from a level 3 one.

**Job Relations and Job Methods** matter too. Job Relations gives new supervisors a method for handling people problems before they become grievances. Job Methods is an early form of the improvement thinking that later became [kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/).

**Template: job breakdown sheet (TWI style)**

*Illustrative example for task T3, part of the CNC setup: mounting the fixture.*

| Important steps (what) | Key points (how) | Reasons for key points (why) |
|---|---|---|
| 1. Clean the table and fixture base | wipe with lint-free cloth; check for chips by hand (gloves) | chips under the fixture cause position errors |
| 2. Place the fixture on the locating pins | lower straight down, do not slide | sliding damages the pins |
| 3. Tighten the clamping bolts | in a cross pattern, to the torque on the setup sheet | uneven clamping distorts the fixture |
| 4. Verify position with the probe | run program "FIX-CHK"; compare with tolerance on the sheet | catches errors before the first part |
| 5. Record the setup | sign the setup sheet, note the probe values | traceability for the first article |

A breakdown fits on one page. If it does not, the task is too big; split it. The breakdown and the standard work document should match; the [standard work cluster](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) explains how standard work sheets and job breakdowns relate.

## Registered apprenticeships and longer pipelines

A Registered Apprenticeship is a program approved by the US Department of Labor or a State Apprenticeship Agency. Its hallmarks, per DOL's Apprenticeship.gov: it is industry-led, it is a paid job with wages that rise as skills and productivity grow, it combines structured on-the-job learning with a mentor and supplemental classroom instruction, and completers earn a portable, nationally recognized credential [6].

The federal standards in 29 CFR 29.5 allow three ways to measure the term of an apprenticeship: time-based (at least 2,000 hours of on-the-job learning), competency-based (successful demonstration of skills) and hybrid (a combination of minimum hours and demonstrated competencies). They recommend a minimum of 144 hours of related instruction for each year of apprenticeship [7].

Apprenticeship.gov also reports that 90% of apprentices stay employed after completing their apprenticeship [6]. The page does not give a method for that figure, so treat it as indicative.

*Illustrative budget (fictional values)* for one maintenance apprentice over four years, time-based: 8,000 hours of paid work with a progressive wage starting at $22 and rising to $34 per hour, 4 × 144 = 576 hours of related instruction at a community college, and about 2 hours per week of mentor time. The plant gets productive work from the apprentice from the first year; the cost to compare against is the alternative of recruiting an experienced technician in a tight market, plus the risk of not finding one.

**Which roles suit apprenticeships?** Roles with a long learning curve and a shortage in the local labor market: maintenance and industrial electricians, CNC machinists and programmers, toolmakers, mechatronics technicians, welders. Operator roles usually do better with short, task-based qualification through the skills matrix.

**Other pipeline tools**

| Tool | What it is | Effort for the plant | Good for |
|---|---|---|---|
| High school and community college partnerships | plant tours, internships, advisory board seats, equipment donations | low to medium | building interest early |
| Pre-apprenticeship | short program that prepares candidates to enter an apprenticeship | medium (with a partner) | widening the candidate pool |
| Internal career ladder | defined steps from operator to setup technician to team lead, with skill requirements per step | medium | retention and internal mobility |

## OSHA training requirements in the matrix

Many OSHA standards require training, and some require it per task, with evaluations and retraining triggers. Two examples that touch almost every plant:

| Standard | What it requires (summary) | What it means for the matrix |
|---|---|---|
| Powered industrial trucks, 29 CFR 1910.178(l) | the employer must ensure each operator is competent, as shown by successful completion of training and evaluation; an evaluation of each operator's performance at least once every three years; refresher training after unsafe operation, an accident or near miss, a failed evaluation, assignment to a different type of truck, or a workplace change that affects safe operation [8] | one column per truck type; evaluation date and due date; automatic flag on refresher triggers |
| Control of hazardous energy (lockout/tagout), 29 CFR 1910.147(c)(7) | training for authorized employees (recognize hazardous energy sources, type and magnitude, isolation and control), instruction for affected employees, retraining when job assignments, machines, processes or procedures change or when inspections show deviations; the employer must certify training with each employee's name and dates [9] | separate levels for "authorized" and "affected"; certification record; retraining when a machine or procedure changes |

The lockout/tagout standard also requires a periodic inspection of the energy control procedure at least annually [9]. That inspection is a natural moment to check the matrix entries for the people who use the procedure.

Other standards with training requirements, depending on your processes, include hazard communication, respiratory protection, hearing conservation and machine guarding. Have your EHS lead list every applicable requirement and map each to a matrix column. This article does not replace a compliance review.

**Template: compliance columns in the skills matrix**

| Column | Example entry |
|---|---|
| Qualification | powered industrial truck (forklift), counterbalance type |
| Standard reference | 29 CFR 1910.178(l) |
| Training date / evaluation date | 2026-03-12 / 2026-03-12 |
| Next evaluation due | per the standard's interval and plant rule |
| Trainer / evaluator | name |
| Status | current / due in 30 days / expired (expired = not allowed to operate) |

When the safety column and the skills columns live in the same matrix, supervisors see in one place whether a person may do a task today. Many plants keep the matrix in a spreadsheet, a SharePoint list or an MES module; the [Azure for manufacturing guide](https://www.m365.fm/en/learn/manufacturing-it-azure/) covers the Microsoft 365 options. Whatever the tool, the expiry date has to trigger an alert to the supervisor. Qualification records are personnel records: restrict edit rights to supervisors and training staff and keep an audit trail.

## Retention, pay and respect for people

A skills program fails if people see it as more work for the same pay. Four practices help:

1. **Link skills to pay or progression.** Skill-based pay or a clear career ladder makes qualification worth the effort. In union plants, the job classification and pay structure are part of the collective agreement; changes are a bargaining topic, so involve the union early.
2. **Make the matrix visible and fair.** Post coverage per task in the team area, explain the evidence rules and let each operator see their own ratings and path. Avoid ranking people against each other on a public board. A matrix that only management sees invites suspicion; one that shames people does too.
3. **Train trainers and give them time.** Ana in the worked example cannot train others while she runs the cell alone. Plan trainer hours in the schedule.
4. **Listen.** Operators know which tasks are hard to learn, which instructions are wrong and which shifts lack backup. A monthly review of the matrix in the team meeting surfaces this.

Deloitte's study reports that flexible work arrangements were named by 47% of respondents as the most impactful retention strategy, second only to competitive benefits [1]. In a plant, "flexible" usually means predictable schedules, shift swaps and some say in overtime, not remote work.

These practices are the people side of [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) and of [kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/): people who are trained and heard are the ones who bring improvement ideas.

## A 90-day plan

| Weeks | Action | Output | Owner |
|---|---|---|---|
| 1 to 2 | List tasks per cell from standard work; set criticality and target coverage | task list with A/B/C and targets | supervisor + CI engineer |
| 3 to 4 | Rate everyone with the evidence rules; add OSHA qualification columns with expiry dates | first skills matrix per cell | supervisors + EHS |
| 5 | Calculate tasks below target and single-person critical tasks; agree priorities | training priority list | plant manager + HR |
| 6 to 8 | Train two to three supervisors or team leads in TWI Job Instruction; write job breakdowns for the top gap tasks | qualified trainers, job breakdowns | HR / training lead (external TWI trainer if needed) |
| 9 to 12 | Run the first cross-training plan as scheduled work; monthly matrix review in each team meeting | gaps closed, routine started | supervisors |
| 12 | Decide on an apprenticeship for the hardest-to-hire role (maintenance is the usual candidate) | decision and partner | plant manager + HR |

## Common mistakes

| Mistake | Why it hurts | Fix |
|---|---|---|
| Matrix ratings without evidence rules | "qualified" means different things on each shift | define evidence per level; supervisor sign-off |
| Reporting only the flexibility index | high average hides single-person critical tasks | report tasks below target and single-person critical tasks |
| Cross-training where it is easy | coverage on packing, none on setup | prioritize by criticality × gap |
| Training "when there is time" | it never happens | schedule training as planned work |
| Learning by shadowing only | bad habits are copied with the good ones | TWI Job Instruction with job breakdowns |
| Safety training tracked separately | people operate equipment with expired qualifications | OSHA columns with expiry dates in the same matrix |
| No link to pay or progression | people avoid extra qualifications | skill-based pay or career ladder (bargain in union plants) |
| Treating the matrix as an HR document | supervisors do not use it daily | keep it in the team area and review monthly |

## FAQ: manufacturing workforce skills

### What skills do manufacturing workers need?

Safety skills for every task, core technical skills (operating, setting up and checking machines), maintenance skills, basic digital skills for MES, ERP and digital work instructions, problem solving (5 Why, A3, PDCA) and, for team leads, coaching and leadership. Half of the manufacturers in the Deloitte study rated high digital proficiency as important or very important [1].

### How big is the manufacturing skills gap?

Deloitte and The Manufacturing Institute estimate a net need of about 3.8 million new US manufacturing workers from 2024 to 2033, with about 1.9 million jobs that could go unfilled if skills and applicant gaps are not addressed [1]. BLS counted 594,000 manufacturing job openings in September 2026 (preliminary) [2].

### What is a skills matrix in manufacturing?

A table with people in rows, tasks in columns and a skill level in each cell. It shows who can do which task, where coverage is below target and whom to train next. Good matrices define evidence rules for each level and include safety qualifications with expiry dates.

### How do you create a skills matrix?

List tasks per cell from standard work, set criticality and a target number of qualified people per shift, rate each person with clear evidence rules, then calculate tasks below target and critical tasks with a single qualified person. Review it monthly in the team meeting.

### What is the difference between a skills matrix and a training matrix?

Many plants use the terms interchangeably, as this article does. Where they are separated, a training matrix tracks which required courses and certifications each person has completed and when they expire, while a skills matrix rates demonstrated ability per task. A completed course is not yet a skill: the evidence rule for level 2 (observed work to standard) is what turns a training record into a qualification.

### How often should a skills matrix be updated?

Update a cell whenever someone is signed off or a qualification expires, and review the whole matrix monthly in the team meeting, as in the template above. Check it again after changes to standard work, new equipment or turnover in a cell.

### Is a skills matrix required for ISO 9001?

ISO 9001 does not prescribe a matrix format. Clause 7.2 d) requires the organization to "retain appropriate documented information as evidence of competence" [10]. A matrix with dated sign-offs, backed by the training records, is a common and audit-friendly way to meet that requirement.

### What is the flexibility index?

The share of matrix cells in which a person is qualified: qualified cells ÷ (people × tasks). It is a useful average but hides single points of failure, so report it together with the number of tasks below target.

### What is TWI in manufacturing?

Training Within Industry, a US program from 1940 to 1945 with four 10-hour courses: Job Instruction, Job Methods, Job Relations and Program Development [3]. Job Instruction is still widely used to teach jobs consistently, based on a written breakdown of what, how and why [4].

### What are the four steps of TWI Job Instruction?

As taught by the TWI Institute: break the job down into what, how and why; present and demonstrate it; let the learner do it; then check progress and coach [4]. The Lean Enterprise Institute's Job Instruction card names the four steps "Prepare the person", "Present the operation", "Try out performance" and "Follow up" [11].

### How long is a registered apprenticeship?

It depends on the program. Under 29 CFR 29.5, a time-based apprenticeship requires at least 2,000 hours of on-the-job learning; competency-based and hybrid models are also allowed, and at least 144 hours of related instruction per year are recommended [7].

### Which OSHA training is required in manufacturing?

It depends on the hazards and equipment. Common examples are forklift operator training with an evaluation at least every three years [8] and lockout/tagout training with documented certification [9]. Your EHS lead should map every applicable standard to the skills matrix.

### How do you retain skilled manufacturing workers?

Show people a path: link skills to pay or progression, make the matrix visible and fair, schedule training as planned work and give trainers time. Deloitte reports that employees who believe they can acquire important future skills are 2.7 times less likely to leave within 12 months [1].

## Conclusion

The manufacturing skills gap will not close by hiring alone. Plants that cope best treat skills like any other part of operations: they measure coverage per task, close gaps on critical tasks first, teach jobs with a repeatable method such as TWI Job Instruction, and build longer pipelines through apprenticeships for the roles they cannot hire.

Start with one cell. Build the matrix with clear evidence rules, find the tasks that depend on one person, and put two cross-training plans in the schedule. Add the OSHA qualifications with expiry dates. Within a quarter, you will know your real exposure, and your best operators will see that the plant invests in them.

## Further reading on m365.fm

**Parent pillar**
- [Operational excellence: the complete guide](https://www.m365.fm/en/learn/operational-excellence/)

**Sibling clusters (planned)**
- [Sustainable manufacturing: energy per unit and Scope 1-3](https://www.m365.fm/en/learn/operational-excellence/sustainable-manufacturing/) (planned)
- [Supply chain resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) (planned)

**Related guides (planned)**
- [Shop floor management and gemba walks](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned)
- [Paperless manufacturing and digital work instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) (planned)
- [Kaizen and kaizen events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) (planned)
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned)
- [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about operational excellence, lean manufacturing and the digital transformation of production. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources opened and checked on November 20, 2026.

1. Coykendall, J.; Hardin, K.; Morehouse, J.; Reyes, V.; Carrick, G.: "Taking charge: Manufacturers support growth with active workforce strategies". Deloitte Research Center for Energy & Industrials and The Manufacturing Institute, April 3, 2024. https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/supporting-us-manufacturing-growth-amid-workforce-challenges.html
2. US Bureau of Labor Statistics: "Manufacturing: NAICS 31-33" (Industries at a Glance; CES employment October 2026 and JOLTS September 2026, preliminary). https://www.bls.gov/iag/tgs/iag31-33.htm
3. Wikipedia: "Training Within Industry" (secondary source for history, programs, certifications and the JI credo). https://en.wikipedia.org/wiki/Training_Within_Industry
4. TWI Institute: "Job Instruction" (course elements and format). https://www.twi-institute.com/job-instruction/
5. Robinson, A. G.; Schroeder, D. M.: "Training, Continuous Improvement, and Human Relations: The U.S. TWI Programs and the Japanese Management Style". *California Management Review* 35 (2), 1993, pp. 35–57. DOI: 10.2307/41166721
6. US Department of Labor, Apprenticeship.gov: "Registered Apprenticeship Program" (employer page). https://www.apprenticeship.gov/employers/registered-apprenticeship-program
7. 29 CFR § 29.5, Standards of apprenticeship (Legal Information Institute, Cornell Law School). https://www.law.cornell.edu/cfr/text/29/29.5
8. OSHA: 29 CFR 1910.178, Powered industrial trucks (paragraph (l), operator training). https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178
9. OSHA: 29 CFR 1910.147, The control of hazardous energy (lockout/tagout), paragraphs (c)(6) and (c)(7). https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
10. ISO 9001:2015, clause 7.2 Competence, item d), as excerpted in: Aviation Suppliers Association (ASA): "'Documented Information' in ISO 9001:2015" (handout, ISO/AS changes for distributors, part 2). https://www.aviationsuppliers.org/ASA/files/ccLibraryFiles/Filename/000000001626/ASA-ISO-AS-Changes-For-Distributors-Handouts-part-2.pdf (secondary excerpt; the ISO text itself is not openly accessible)
11. Lean Enterprise Institute: "TWI Job Instruction Card" (How to Instruct: Step 1 Prepare the person, Step 2 Present the operation, Step 3 Try out performance, Step 4 Follow up). https://www.lean.org/wp-content/uploads/2021/01/TWI-Job-Instruction-Card.pdf

---

# Editorial notes

**URL assumption:** cluster URL nested under the parent pillar (`/en/learn/operational-excellence/manufacturing-workforce-skills/`) per the course-expansion brief; confirm in the CMS.

**Open or still-to-verify items**

1. **SERP capture (resolved in round 5):** top-10 lists for "manufacturing workforce skills", "skills matrix manufacturing" and "manufacturing skills gap" were captured with the search tool on November 20 and pages opened on November 23, 2026 (see the Competitive analysis). As expected, vendor pages dominate the skills matrix SERP. The search tool approximates google.com; a live PAA box was not available.
2. **Deloitte/MI figures** [1]: verified on the Deloitte page; the Manufacturing Institute version is member-gated. The "over 65%" figure is NAM's Q1 2024 survey as cited by Deloitte; the 40% figure is a World Economic Forum projection as cited by Deloitte.
3. **BLS figures** [2] are preliminary (October 2026 employment, September 2026 JOLTS) and will be revised; update before publication.
4. **TWI history** [3] is from Wikipedia (secondary); consider the primary *The Training Within Industry Report 1940–1945* (War Manpower Commission, 1945) [unverified, not fetched]. The JI step names "prepare, present, try out, follow up" are now sourced to the LEI Job Instruction card [11] (closed in round 4); the article states the TWI Institute wording [4] as the verified version.
5. **Robinson and Schroeder** [5]: bibliographic data verified via Crossref; the article cites only the paper's subject (link between TWI and Japanese management style), not specific findings.
6. **Apprenticeship retention 90%** [6]: shown on Apprenticeship.gov without a method (refers to a company case study); labeled as indicative.
7. **ILUO scale**: described as a common variant in lean plants without a source (practitioner knowledge).
8. **Matrix rules** (three shifts for sign-off, three people per critical task and shift): plant rules of thumb, labeled.
9. **Worked examples** (matrix, cross-training cost, apprenticeship budget): fictional values, labeled; arithmetic re-checked in review.
10. **Labor relations**: statements on job classifications and pay as bargaining topics are general; have labor counsel review the union paragraph before publication.
11. **Quality system competence requirements** (updated in round 4): ISO 9001:2015 clause 7.2 d) verified through a secondary excerpt [10] and added to the section "The skills matrix: structure and rating scale". IATF 16949 and AS9100 competence clauses still unverified [unverified]; not named in the text.
12. **No iFAKT passage**; disclosure in the author box only.

**Internal links used (absolute URLs)**
- Parent: https://www.m365.fm/en/learn/operational-excellence/ (first 150 words and Further reading)
- Siblings: https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/ (body and Further reading), https://www.m365.fm/en/learn/operational-excellence/sustainable-manufacturing/ (Further reading)
- Body: shop-floor-management/paperless-manufacturing, manufacturing-kpis, shop-floor-management/standard-work, lean-manufacturing/kaizen, manufacturing-it-azure, shop-floor-management
- Further reading adds: lean-manufacturing, tpm-oee

**Cannibalization:** the parent pillar mentions training only as a TPM pillar and in the OpEx manager profile. The planned standard work cluster owns standard work sheets; this cluster owns skills measurement, TWI and pipelines and links to it.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Manufacturing Workforce Skills: Skills Matrix, TWI and Apprenticeships for Plant Leaders",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/",
      "isPartOf": {"@type": "Article", "url": "https://www.m365.fm/en/learn/operational-excellence/"},
      "about": {"@type": "Thing", "name": "Manufacturing workforce skills"}
    },
    {"@type": "FAQPage", "inLanguage": "en-US", "mainEntity": "[all 13 FAQ questions as Question with acceptedAnswer; answer text without [n] references]"},
    {"@type": "BreadcrumbList", "itemListElement": ["Home", "Learn", "Operational Excellence", "Manufacturing Workforce Skills"]}
  ]
}
```

**Recommended graphics**
1. Skills matrix heat map for Cell 3 with the two single-person critical tasks highlighted.
2. Coverage bar chart per task: qualified people vs. target.
3. Job breakdown sheet as a printable one-page template.
4. Apprenticeship path: on-the-job learning, related instruction and wage steps over four years.

## Review log

Expert-panel review per the course-expansion brief, November 20, 2026. Nine roles: practitioner (US plant manager, 20 years on the floor), academic (industrial engineering professor), IT/OT architect, quality lead (ASQ CQE / Black Belt), finance (plant controller), worker voice and lean coach (operator perspective, union/OSHA), SEO specialist (US), fact checker (re-verifies online), critic. Three full rounds (Mirko's instruction of November 20, 2026).

### Research basis before the review

- Verified online on November 20, 2026: Deloitte/Manufacturing Institute study of April 3, 2024 [1]; BLS Industries at a Glance, NAICS 31-33 [2]; Wikipedia TWI page [3]; TWI Institute JI course page [4]; Robinson and Schroeder 1993 via Crossref [5]; Apprenticeship.gov employer page [6]; 29 CFR 29.5 via Cornell LII [7]; OSHA 1910.178 [8] and 1910.147 [9].
- Not available: the Manufacturing Institute version of the study (member-gated); NIST MEP workforce page (fetch failed, so the planned MEP row was dropped); a full google.com SERP for the keyword (search quota exhausted).

### Round 1 (first draft, 4,526 words)

- **Practitioner (changes needed):** the Cell 3 matrix is exactly how coverage problems look. "Class 5" in the forklift row is jargon and not needed.
- **Academic (changes needed):** the flexibility index should be computed per shift; a plant-wide figure hides weak shifts. No evidence is cited for skill-based pay effects, so the text must present it as practice, not as a finding (it does).
- **IT/OT architect (changes needed):** qualification data in SharePoint or an MES module is personnel data. Mention edit rights and an audit trail.
- **Quality lead (changes needed):** ISO 9001, IATF 16949 and AS9100 require documented evidence of competence; the matrix is often the audit evidence. Wants a sentence on it.
- **Finance (changes needed):** cost example labels the loaded rate correctly. If the cell is the bottleneck, training hours cost lost output, not only wages.
- **Worker voice / lean coach (changes needed):** posting individual ratings on a public board can shame people and, in union plants, raise grievances. Post task coverage publicly, individual ratings only to the person and the team leader.
- **SEO specialist (changes needed):** keyword in H1, short answer and meta; "skills matrix template", "TWI" and "registered apprenticeship" covered with H2s and FAQs. Missing SERP capture must stay documented.
- **Fact checker (changes needed):** re-opened all nine sources; figures match. Corrections: the key takeaway described the JI steps as "prepare the learner, present the operation, try out performance, follow up", which is not the wording of the verified source [4]; "Class 5" is not verified; the flexibility index in the takeaways was given as 54% while the table yields 29 ÷ 48 = 60%. Recalculated the matrix totals, the cross-training plan ($6,576), avoidable cost ($5,368) and the apprenticeship hours (8,000 and 576): correct.
- **Critic (changes needed):** two not-X-but-Y constructions: "A skills matrix is a risk tool, not an HR form." and "Training is a retention tool, not only a cost." The matrix example called Ana "level 3 or 4 on almost everything", which the table does not show.

**Debate 1: public matrix.** The practitioner wanted the full matrix posted ("visibility drives cross-training"); the worker voice role objected for the reasons above. The academic noted that coverage per task carries the operational information. Resolution: post task coverage, show individual ratings to the person and team leader, no public ranking.

**Debate 2: quality system clause.** Quality wanted ISO 9001 competence requirements named; the fact checker could not open the ISO text in this session. Resolution: not added to the text; recorded in the editorial notes as a pre-publication suggestion with [unverified].

### Changes in optimization 1 (old -> new)

- Key takeaway JI: "prepare the learner, present the operation, try out performance, follow up." -> "break it down into what, how and why, demonstrate it, let the learner do it, then check and coach [4]."
- Key takeaway: "a cell with a 54% flexibility index still had two tasks with a single qualified person" -> "a cell with a 60% flexibility index still had two critical tasks with a single qualified person".
- Matrix reading: "Ana is level 3 or 4 on almost everything." -> "Ana is qualified on all eight tasks and is the only level 4 trainer."
- Key takeaway: "A skills matrix is a risk tool, not an HR form. Its job is to show …" -> "Use the skills matrix as a risk tool: its main job is to show …".
- "Training is a retention tool, not only a cost." -> "Training also works as a retention tool."
- Compliance template: "counterbalance, Class 5" -> "counterbalance type".
- Flexibility index: added "(calculate it per shift; a plant-wide average hides weak shifts)".
- Cost example: added "If the cell is the plant's bottleneck, add the value of lost output during training, or schedule the training hours in planned downtime."
- Tools paragraph: added "Qualification records are personnel records: restrict edit rights to supervisors and training staff and keep an audit trail."
- Retention item 2: "Post it in the team area … let operators see their own path." -> "Post coverage per task in the team area … let each operator see their own ratings and path. Avoid ranking people against each other on a public board. … one that shames people does too."
- Pipeline table: NIST MEP workforce row removed (source page could not be verified).

### Round 2 (after optimization 1, 4,593 words)

- **Practitioner: satisfied.**
- **Academic: satisfied.**
- **IT/OT architect: satisfied.**
- **Quality lead: satisfied** with the editorial note.
- **Finance: satisfied.**
- **Worker voice / lean coach: satisfied.** Union paragraph says to involve the union early on classification and pay; labor counsel review noted.
- **SEO specialist (changes needed):** parent link appears after the short answer and takeaways (about word 250), outside the first 150 words required by the brief.
- **Fact checker: satisfied.** All changed sentences re-checked against [1], [4], [8].
- **Critic (changes needed):** "The gap is real and long-term." is filler.

### Changes in optimization 2 (old -> new)

- New line under the date: (none) -> "*A cluster article of the m365.fm [operational excellence guide](https://www.m365.fm/en/learn/operational-excellence/).*" (parent link now at word 30).
- Key takeaway: "The gap is real and long-term." -> "The projected gap spans a decade."

### Round 3 (cross-check of the final text)

- **Practitioner: satisfied.** "The matrix template and the job breakdown are ready to print."
- **Academic: satisfied.**
- **IT/OT architect: satisfied.**
- **Quality lead: satisfied.**
- **Finance: satisfied.**
- **Worker voice / lean coach: satisfied.**
- **SEO specialist: satisfied.** Parent link at word 30 and in Further reading; sibling supply-chain-resilience in body, both siblings in Further reading; body links to paperless-manufacturing, manufacturing-kpis, standard-work, kaizen, manufacturing-it-azure and shop-floor-management. Word count within range.
- **Fact checker: satisfied.** Every [n] matches the nine sources; preliminary BLS data labeled; open items in the editorial notes (TWI primary report, JI step wording, 90% apprenticeship figure, ILUO, ISO competence clause).
- **Critic: satisfied.** No AI clichés or em-dash chains; iFAKT only in the author box with the exact disclosure.

**Consensus:** all nine roles sign off. Before publication: refresh BLS figures and the SERP table.

**Word count:** `wc -w` from H1 to the end of the Conclusion (including FAQ and tables): 4,602 words.

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (WebSearch, WebFetch). All access dates November 20, 2026.

| # | Item | Old -> new |
|---|---|---|
| 1 | Quality system competence requirement (clause numbers, priority a) | not in text, [unverified] in note 11 -> ISO 9001:2015 clause 7.2 d) "retain appropriate documented information as evidence of competence" confirmed via an ASA excerpt [10]; one sentence added after the rating scale. IATF 16949 and AS9100 clauses still unverified and not named. |
| 2 | JI step summary (FAQ) | "Many trainers summarize them as prepare, present, try out and follow up." [unverified] -> LEI Job Instruction card wording "Prepare the person", "Present the operation", "Try out performance", "Follow up" [11] |
| 3 | *The Training Within Industry Report 1940–1945* | still unverified (primary report not fetched; budget) |
| 4 | BLS preliminary figures [2] | unchanged; still to be refreshed before publication (data revisions, not a verification gap) |
| 5 | Full google.com SERP | still open |

Body text changed; `wc -w` H1 through Conclusion is now 4,642 words (cluster range kept). Sources: 11.

- **Fact checker:** satisfied; the Round 1 quality-lead suggestion is now in the text for ISO 9001 only, which is the part that could be verified.
- **Critic:** satisfied; the FAQ answer now gives source wording instead of "many trainers say".
- **Subject expert (quality lead / lean coach):** satisfied; the audit link makes the evidence rules more convincing to plant managers.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** web (no NEURONwriter analysis exists for this keyword). US web searches for "manufacturing workforce skills", "skills matrix manufacturing" and "manufacturing skills gap" on November 20; ranking pages opened on November 23, 2026 after the fetch quota reset. Search-tool order used as an approximation of the google.com SERP; no live PAA box available.

**SERP findings:** the previous table listed authority pages, not a top 10. The real top 10 for the main keyword is NIST MEP (1,100 to 1,200 words), the Deloitte/Manufacturing Institute study, EY, NIST, IndustryWeek, a UK report, Indeed (2,000 to 2,300), EY, KPMG (2026) and MIT. The skills matrix SERP is all software vendors (Cloud Assess approx. 3,000 words with a four-question FAQ). No ranking page links a matrix with evidence rules, TWI, apprenticeship standards and OSHA training.

**Changes (old -> new):**
1. Competitive analysis: new top-10 table plus variant lists; the old table kept and relabeled "Authority pages read during the first research (not a SERP list)".
2. FAQ: 10 questions -> 13; new "What is the difference between a skills matrix and a training matrix?", "How often should a skills matrix be updated?" (both from the body: synonym note, level 2 evidence rule, monthly review in the template) and "Is a skills matrix required for ISO 9001?" (clause 7.2 d) quote from [10], already verified in round 4).
3. Editorial notes: open item 1 "SERP capture incomplete" -> resolved; JSON-LD "all 10 FAQ questions" -> "all 13".
4. Metadata: word count 4,642 -> 4,826.
Meta title, description and H1 unchanged: "manufacturing workforce skills" plus "skills matrix" and TWI cover both SERPs.

**Sign-off:**
- **SEO specialist:** satisfied; real top 10 documented; the three new questions come from the skills matrix SERP, where vendor pages answer them without method.
- **Critic:** satisfied; answers are short and consistent with the body; the ISO answer avoids overclaiming.
- **Fact checker:** satisfied; the ISO 9001 quote matches [10]; "does not prescribe a matrix format" follows from the clause text, which names documented information, not a format.
- **Subject expert (training lead / HR):** satisfied; the distinction between training records and qualification is the one auditors and supervisors need.

**Word count after round 5:** 4,826 words (+184).
