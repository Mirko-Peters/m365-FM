---
title: "Advanced Planning and Scheduling Software: How to Evaluate APS"
summary: "Advanced planning and scheduling software builds schedules that respect real limits. Learn how to define your need, compare APS tools and test one on your data."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [advanced-planning-and-scheduling, finite-capacity-scheduling, material-requirements-planning, enterprise-resource-planning, manufacturing-execution-system, power-bi, polaris-optimizer, ifakt]
keypoints:
  - "Advanced planning and scheduling software adds capacity-based scheduling and sequencing on top of what MRP does, so competing orders and limited resources are part of the plan."
  - "Define your problem before you look at products: how many orders compete, how often the plan breaks, and what the real constraint is."
  - "Check what your ERP system already does with finite capacity before you buy anything. Some of it is limited to resources where you switch it on."
  - "Evaluate tools by constraint modeling, transparency, planner overrides, re-planning stability and the effort to keep master data clean."
  - "Test on your own data: replay a past week and compare the tool's schedule with what really happened."
faq:
  - q: "What is advanced planning and scheduling software?"
    a: "It's software that calculates a production plan and detailed schedule while respecting real limits such as machine capacity, shifts, skills and material availability. Unlike basic MRP, it handles competing orders and sequencing. It usually takes orders and master data from the ERP system and sends the schedule to the shop floor."
  - q: "How is APS different from MRP?"
    a: "MRP works out which materials are needed and when. Fraunhofer IPA describes APS as adding capacity scheduling and sequencing, so it takes account of competing orders and material availability. In short, MRP tells you what to buy and make, while APS tells you when and on which resource each job can actually run."
  - q: "How do you test an APS before buying it?"
    a: "Replay a real past week. Load the orders, calendars and routings, let the tool build a schedule, and compare it with what actually happened and with your planner's schedule. Then inject a disruption and check how it re-plans. Use your own data, not the vendor's demo data, and agree on success criteria before you start."
---

Advanced planning and scheduling software, usually called APS, calculates a production plan that fits real limits: machine hours, shifts, skills, tools and material. It's the step beyond a plan that just lists what to make and when material is needed. This guide is for production planners and operations leads who have to decide whether they need APS and how to judge the options, without a vendor deciding the criteria for them.

## What is advanced planning and scheduling software?

The APICS dictionary, quoted by [ASCM](https://www.phoenix.ascm.org/blog/4852930), describes an APS system as a computer program that uses advanced mathematical algorithms or logic to perform optimization on planning and scheduling functions. That's broad. A more practical definition comes from [Fraunhofer IPA](https://www.ipa.fraunhofer.de/content/dam/ipa/de/documents/aktuelle-forschung/Auftragsmanagement-und-Wertschoepfungsnetze/special-zu-advanced-planning-und-scheduling.pdf) (a German-language paper, my translation). It places APS next to two other software classes, supply chain management at the network level and manufacturing execution at the production level, with ERP at the enterprise level. And it describes three steps of planning logic.

[MRP](https://www.m365.fm/entity/material-requirements-planning/) in its first form only works out material requirements. The next step adds load-based capacity requirements, but it still doesn't account for orders that compete for the same resource. APS adds capacity scheduling and sequencing, so competing orders and material availability become part of the result. That's the whole point. You get a schedule you could actually run, not only a list of requirements.

This article takes a buyer's view: what to decide first, which criteria matter and how to test. For a short definition of the term itself, see the [advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) entry on this site.

## Where does APS sit between ERP and the shop floor?

ISA describes [ISA-95](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard) as an international set of standards for integrating logistics systems with manufacturing control systems. In its model, business planning and logistics, where the [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/) lives, is level 4. Manufacturing operations management, including MES, is level 3. APS usually works in the space between: it takes orders and master data from above, builds the schedule, and hands it to the floor.

Fraunhofer IPA notes that ERP is usually the master for planning data such as item masters, bills of materials and routings. That tells you where your data work will be. If those records are wrong in the ERP, any APS will schedule the wrong thing very efficiently.

The same paper points out that the APS and MES markets overlap heavily. Ask early who owns dispatching on the floor. A [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) records what really happened. APS decides what should happen next. If both claim the job list, planners and supervisors will work from two lists.

## What problem do you need it to solve?

Fraunhofer IPA advises defining your application focus and requirements first, usually through an as-is analysis and a rough concept, before evaluating software. Do that with these questions:

1. How many orders compete for the same few resources? If few, a spreadsheet might still do.
2. How often does the plan break during a shift, and why? Machine stops, missing material, rush orders?
3. What is the real constraint: a machine, a skilled person, a tool, a furnace, a test stand?
4. Do setup times depend on the sequence of jobs? If so, sequencing has real value.
5. Who builds the schedule today, how long does it take, and how often is it redone?
6. What decisions do you want the tool to make, and which stay with the planner?

Then check what your ERP can already do. As an example, Microsoft documents [finite capacity planning and scheduling](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/finite-capacity) in Dynamics 365 Supply Chain Management. With it, a planned order that doesn't fit the available capacity moves out to a date where capacity exists. But it's effective only for resources where you enable it, it uses a time fence that defines how many days are treated as finite, and Microsoft warns that a one-day fence is probably too short for most manufacturers. It also says finite capacity shouldn't be used when capacity changes with the requirements, such as shift-based capacity. If your constraint looks like that, you've learned something before talking to any vendor. Your own ERP may differ, so look for the same kinds of limits in its documentation. The related idea of [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) is the base for all of this.

## Which criteria separate one APS from another?

Feature lists look alike. These criteria separate tools in practice.

- Constraint modeling: Can it represent your real limits? Machines, people with skills, tools, shift calendars, sequence-dependent setups, material release.
- Transparency: Can a planner see why a job sits where it does? A schedule you can't explain won't survive the first argument on the floor.
- Priority rules: Can you change rules (due date, customer, setup saving) without a vendor's help?
- Overrides: Can the planner move a job by hand, and does the system log it and re-check the rest? Ask what happens to the rest of the schedule after a manual move.
- Re-planning behavior: A re-plan after a disruption should change only what has to change. A schedule that reshuffles everything each time is unusable on the floor. Fraunhofer IPA also notes that plans can never be executed exactly, so you need a tolerance for deviations between actual and planned.
- Data interfaces: How does it get orders, routings and progress, and who maintains those interfaces?
- Run time: How long does a full plan take on your data volume? Fraunhofer IPA mentions that run times in the minute range make nightly-only planning questionable, but test your own volume.
- What-if: Can you test a scenario without touching the live schedule?
- Planner effort: How much time does it take to keep the master data and rules alive?
- Cost over several years: license, interfaces, master data work, training, upgrades.

## What should you ask a vendor?

Take these into the first call. Good answers are specific, and vague answers tell you something too.

- Show me a schedule built from our data, not your sample plant.
- What happens when a machine stops at 10 a.m.? What changes, and what doesn't?
- How are sequence-dependent setups handled?
- Which of our rules can a planner change alone?
- How do manual overrides get logged and reviewed?
- What data quality do you need from us, and what do you do when it's missing?
- Who owns the interface to our ERP and to the shop floor system?
- What do customers in a similar process (job shop, repetitive, batch) usually struggle with?
- Can we export our model, rules and data if we leave?

## How do you test an APS before you buy it?

Use a replay. It's the cheapest way to separate marketing from fit.

1. Pick a real past week with a normal level of trouble.
2. Load the orders, routings, calendars and resources as they were at the start of that week.
3. Let the tool build a schedule.
4. Compare it with what happened and with the planner's schedule: late orders, number of setups, overtime, idle time at the constraint.
5. Inject a disruption, such as a two-hour stop at the constraint, and check what the re-plan changes.
6. Let a planner use it for a day and note every point where they didn't trust or understand it.

Agree on success criteria before you start. Otherwise the results get argued afterwards.

### Example: a replay with invented numbers

This example is invented to show how to read a replay. It isn't a measured result.

A planner's actual week had 120 orders, 14 of them late. The tool's schedule shows 9 late orders. A vendor would stop there and call it a win. A careful team looks at the five orders the tool "saved." Two relied on a machine that was down for most of that week in reality, and the tool didn't know, because stops weren't in the input. One relied on a routing time that was too optimistic. Only two were real improvements. The honest result is "the tool is probably better, and our data has a gap we should close." That's a useful finding either way.

## What does a rollout need?

Mostly data and ownership, not software.

- Clean routings, process times, setup times and calendars. Plan data cleanup first, and set the project timeline from that effort, not from a vendor's slide.
- A named owner for master data and for scheduling rules.
- A start with one area, often the one around the constraint. Expand when planners trust the output.
- Feedback from the floor: started, finished and scrapped quantities, and stops. Without them, the schedule drifts from reality within days.
- A weekly review of schedule adherence in the first months. [Power BI](https://www.m365.fm/entity/power-bi/) or any reporting tool can show planned against actual.

## Common mistakes

- **Buying features, not fit.** A long list of modules won't help if your problem is one constraint.
- **Skipping the ERP check.** Your ERP may already handle part of the need.
- **Trusting demo data.** A demo on a sample plant shows how the tool behaves in a good case.
- **Ignoring master data.** Wrong routing times produce neat but wrong schedules.
- **Taking the planner out of the loop.** The planner must be able to override, and must see why.
- **Unclear ownership between APS and MES.** Two job lists lead to two truths.
- **Expecting a perfect plan.** Plans always deviate. Build in a tolerance and a re-plan routine.

## Where Polaris fits

If your need is a feasible plan with constraints, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production. Its [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module turns a product-process-resource knowledge graph into an executable, optimized production plan based on real-time ERP data, resource availability and constraints such as shifts, zones, skills and capacities. It detects bottlenecks, prioritizes orders, analyzes the impact of disruptions and re-optimizes. Whether it fits depends on your process and your data, so use the replay test above on a narrow area first.

## Related topics to explore

- Multi-site scheduling. If plants share resources or orders, decide whether one team or each site owns its schedule.
- High-mix and make-to-order work. Unique routings and engineering lead times change what a scheduling tool must handle.
- Demand signals. How fast customer orders or changes reach the schedule decides how often you need to re-plan.
- Scheduling and energy. Some plants want energy cost as a scheduling input. Ask whether a tool supports it before it matters.

## Next step

Evaluating advanced planning and scheduling software gets easier once you have a written problem and a past week to replay. Pull the order, routing and calendar data for one recent week, and use it as the test case in your next vendor conversation.
