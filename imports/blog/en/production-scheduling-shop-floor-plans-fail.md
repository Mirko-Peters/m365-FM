---
title: "Production Scheduling on the Shop Floor: Why Plans Fail by 10 a.m."
summary: "Production scheduling turns orders into a machine sequence, but the shop floor changes it within hours. Learn why plans fail and how to keep a schedule usable."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [finite-capacity-scheduling, polaris-optimizer, enterprise-resource-planning]
keypoints:
  - "Production scheduling assigns each order to a machine, a start time and a sequence. Production planning decides how much to make and when it is due."
  - "Schedules break early in the shift because they assume full capacity, complete material and no disruption, and the floor delivers none of the three."
  - "A schedule that respects finite capacity, real run times and material status survives longer than one built on nominal rates."
  - "Update the schedule at fixed times and after every major disruption, and tell the floor what changed."
  - "Measure schedule adherence every day: the share of jobs started and finished as planned. Then work on the biggest causes of deviation."
faq:
  - q: "What is the difference between production planning and production scheduling?"
    a: "Planning decides what to produce, how much and by when, usually in weeks or months and from demand and capacity. Scheduling takes those orders and assigns each to a machine, a start time and a position in the sequence, usually for days or shifts. A plan can be feasible on paper while the schedule shows the real conflicts."
  - q: "Why do production schedules fail so quickly?"
    a: "Most schedules assume the plan runs without disruption. Breakdowns, late material, absences, quality holds and rush orders arrive during the shift, and run times are often longer than the rates in the system. One delay at a shared resource moves every job behind it. A schedule that is not updated soon becomes outdated."
  - q: "How do you measure schedule adherence?"
    a: "Count the jobs planned for a period and the jobs that started and finished as planned, within a tolerance you set, for example 30 minutes. Divide the second number by the first. Track it daily and by cause, so you can see which problems, such as missing material or breakdowns, cost the most."
---

Production scheduling is the work of turning released orders into a sequence for each machine, with start and end times. On the shop floor that sequence starts to change within the first hours of a shift, because breakdowns, late material and absences do not wait for the plan. This article is for plant managers who ask why a good schedule at 6 a.m. is useless by 10 a.m. It explains the causes, shows how to build a schedule that lasts longer and how to measure how well the floor follows it.

## What is production scheduling, and how is it different from planning?

Planning and scheduling work at different levels. Planning decides what to make, how much and by when. It looks at demand, capacity and material over weeks or months. Scheduling takes the orders and decides the details: which machine, which start time, and which job comes before which.

A good production schedule answers four questions for each job: what product and quantity, where, when and in what order. Better schedules also include setups, material readiness and the operators or tooling a job needs. A [published overview](https://www.fabrico.io/blog/what-is-a-production-schedule/) lists the inputs as demand, capacity net of downtime and changeovers, materials on hand and arriving, and constraints such as due dates, sequence rules, tooling and the bottleneck.

Many plants build the schedule in a spreadsheet or in the planning module of an [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/). That works until the plant has many orders, shared machines and frequent changes. Then the schedule and the floor drift apart.

## Why do plans fail so early in the shift?

Research on dynamic scheduling treats disruption as normal. A survey in the [Journal of Scheduling](https://iaorifors.com/paper/65484) notes that unexpected disruptions in manufacturing are usually inevitable, which is why static schedules fall short. In practice, the causes are familiar:

- **Optimistic capacity.** The production schedule assumes nominal run times. It ignores downtime, changeovers and slow starts. The overview above warns that if real OEE (overall equipment effectiveness) is lower than the plan assumes, jobs run longer and the schedule can unravel within hours.
- **Material that is not there.** A sequence is worthless if components are missing. The job is skipped, and everything behind it moves.
- **Breakdowns and quality holds.** One machine stops, and the work for it piles up elsewhere.
- **Absences and skills.** The plan assumes a person who is not in today.
- **Rush orders.** A new priority order pushes others back.
- **A schedule that is not updated.** The same overview says a schedule not updated during the shift quickly becomes outdated and recommends updating at least each shift and right after a breakdown, rush order or material delay.

Several of these hit at the same time at a shared resource. A delay on the bottleneck moves every job behind it, and the schedule is wrong after the first hour.

## How do you build a production schedule that lasts longer?

You cannot remove disruption. You can build a production schedule that bends before it breaks.

1. **Use real capacity.** Base run times on measured values, not on the rate plate. Include setup and changeover time as separate items.
2. **Schedule the bottleneck first.** The constraint decides the plant's output, so sequence its jobs first and let the other steps follow.
3. **Respect finite capacity.** A machine can do only so much per shift. [Finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) plans each resource with its real limits, so the production schedule shows conflicts before the floor feels them.
4. **Check material before release.** Release only orders whose parts, tools and documents are available or confirmed.
5. **Plan a small buffer at the constraint.** Put protective time in front of the bottleneck, not everywhere.
6. **Set fixed update times.** For example at the start of each shift and after every major disruption. Tell the floor what changed, and why.
7. **Keep the frozen window short.** Give the floor a stable sequence for the next hours, and allow changes beyond it.

Forward scheduling starts each job at its release date and finds the finish date. Backward scheduling starts at the due date and works back to the latest start. Use backward scheduling to see how much slack an order has, and forward scheduling to check that the plan is feasible.

## Which methods and tools do plants use?

Most plants combine a few methods. A master production schedule sets the quantities per period for each product, usually from the sales plan. Production orders then carry the detail for each job. Scheduling methods differ in how they sequence orders: by due date, by shortest processing time, by similar setups or by bottleneck priority. No method is best everywhere. Test one against your own adherence data.

Tools range from a whiteboard to Excel or another spreadsheet, to the planning module of an ERP system, to an advanced planning and scheduling (APS) system or dedicated production scheduling software. A spreadsheet is cheap and flexible, but it does not check capacity for you, and nobody updates it automatically after a breakdown. A scheduling tool with finite capacity logic calculates a feasible production schedule from capacity, material and rules.

Scheduling sits between supply chain planning, which decides what the plant should make, and the production process on the floor, which makes it. A schedule that looks only at one machine and ignores the entire production line, from material receipt to shipping, will fail at the first handover. Production managers who review the schedule against the real manufacturing process every day catch these gaps early.

## How do you measure schedule adherence?

Schedule adherence compares what the schedule said with what happened. One simple way to measure it:

**Schedule adherence = jobs started and finished as planned ÷ jobs planned**

Set a tolerance, for example 30 minutes on start and finish, and count a job as adherent if it falls inside it. Track the figure every day, and log the reason for each miss: material, machine, people, quality, priority change or planning error. The reasons matter more than the number. After a few weeks, a Pareto view of causes tells you where to act first.

Rescheduling is not a failure. Adherence shows whether the plan was realistic and whether the floor could follow it. A low figure with many reschedules means the plan did not reflect reality.

## Example: a schedule at 6 a.m. and at 10 a.m.

This is an illustration with made-up numbers.

A cell has 20 jobs scheduled for the day shift, 10 on a milling machine and 10 on a lathe. At 6 a.m. the schedule looks full but feasible, with 450 productive minutes available per machine.

By 10 a.m. four hours have passed. The milling machine stopped for 55 minutes because of a tool failure. Material for two lathe jobs was not at the cell. A rush order of 90 minutes arrived and was inserted on the milling machine.

The count at 10 a.m.: 8 jobs planned to be finished, 5 finished as planned, 3 late or skipped. Adherence for the first four hours is 5 ÷ 8 = 62.5%.

The milling machine now has 450 − 55 − 90 = 305 minutes left for work that was planned at 450 minutes. Several jobs behind the rush order must move to the afternoon or to the next shift. The scheduler updates the sequence at 10 a.m., informs the floor and moves two jobs to a second machine. The next day the team looks at the causes: tool management, material staging and a rule for rush orders.

## Common mistakes

- **Scheduling with nominal rates.** Plates and catalogues are not your real run times.
- **Releasing orders without material.** The floor starts jobs that cannot finish.
- **Treating the schedule as fixed.** A plan that is not updated is a plan that nobody follows.
- **Rescheduling without telling the floor.** If operators learn the new sequence by accident, trust in the schedule falls.
- **Blaming the floor for low adherence.** Look at the causes first. Often the plan was not feasible.
- **Measuring adherence without causes.** A figure without reasons shows a problem but gives no way to fix it.

## How software can help

A spreadsheet cannot recalculate a sequence quickly when a machine stops. Software that plans with finite capacity can generate a new feasible schedule in minutes and show the conflicts. iFAKT's [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. Check any generated plan with the people who run the machines before you release it.

## Next step

For one week, record the planned and actual start of each job on one machine, and the reason for every deviation. Use that data to rebuild your production scheduling rules around real run times and the three largest causes of delay.
