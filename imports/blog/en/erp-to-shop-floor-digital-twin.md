---
title: "From ERP to Shop Floor: Why Production Plans Need a Digital Twin"
summary: "From ERP to shop floor, plans lose touch with reality. See why ERP plans miss, what a digital twin adds and how plant managers can make plans executable."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris, enterprise-resource-planning, digital-twin, manufacturing-execution-system]
keypoints:
  - "An ERP system plans what to make and when, while the shop floor decides how it is made right now, and the two need a feedback path to stay aligned."
  - "ERP plans often use theoretical cycle times and receive only aggregated confirmations, so they miss stops, changeover overruns and shift-level quality problems."
  - "A digital twin of the factory brings real constraints, real times and current status into planning, so the plan can be tested before it is released."
  - "ISA-95 describes the interface between business planning at level 4 and manufacturing operations at level 3, which is where plan-versus-reality gaps often appear."
  - "Start with one line: replace theoretical times with measured ones, feed back actual progress and compare plan and actual every shift."
faq:
  - q: "Why does the ERP production plan not match the shop floor?"
    a: "ERP plans at business level. It often uses theoretical cycle times and receives aggregated confirmations, such as total quantity and scrap, so it does not see micro-stops, changeover overruns or shift-level quality problems. The plan assumes ideal conditions, and the shop floor runs under real ones, so the two drift apart during the shift."
  - q: "What is the role of MES between ERP and the shop floor?"
    a: "A manufacturing execution system sits between business planning and the machines. It receives released orders from ERP, assigns them to lines, records actual output, delays and quality, and sends status back. Without that feedback path, the ERP plan has no way to learn what the shop floor actually did."
  - q: "How does a digital twin help production planning?"
    a: "A digital twin of the factory holds the real resources, times, shifts and current status, and keeps them in sync with the plant. Planners can test a schedule against real constraints before release, see bottlenecks early and update the plan when reality changes, instead of relying on theoretical values."
---

The path from ERP to shop floor is where many production plans lose touch with reality. The ERP system plans orders, but it rarely sees stops, changeovers or missing material as they happen. This article is for plant managers who release plans that the line cannot follow. You will learn why the gap exists, how data should flow in both directions, what a digital twin adds, and how to start with one line.

## How does data move from ERP to shop floor?

The ISA standard ISA-95, also known as IEC 62264, describes how business and manufacturing control systems exchange information. It focuses on the interface between level 4, business planning and logistics such as ERP, and level 3, manufacturing operations management such as MES. It sets out how to build interfaces between those layers and gives manufacturing and IT staff shared terms. See the [ISA page on ISA-95](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard).

A Fabrico article explains the split in simple words. The [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/) turns customer orders into production orders, plans materials and tracks inventory and costs. It works on a horizon from months down to days, and its core question is what to make and when. A [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) works from days down to seconds, and its core question is how the work is being made right now. See the [Fabrico article on ERP and MES](https://www.fabrico.io/blog/erp-vs-mes/).

The two work together in a loop:

1. ERP sends orders, schedules and material plans down.
2. The shop floor records actual output, consumption and status.
3. That data flows back up, so that ERP can update inventory, costs and schedules.

The Fabrico article warns that without the upward feedback, the business plan drifts from what the floor actually does. Many plants have the downward path and a weak upward path.

## Why do ERP plans miss reality?

TeepTrak, a vendor of OEE software, describes the data gap. ERP systems know what was planned but not what actually happened. They receive aggregated confirmations, such as total quantity, scrap and labor hours. So they miss micro-stoppages, changeover overruns and shift-level quality patterns. As a result, capacity planning uses theoretical cycle times, and OEE discussions rely on estimates. See the [TeepTrak article on MES and ERP integration](https://teeptrak.com/en/mes-erp-integration/). The article comes from a vendor, so treat its cost figures with care. The description of the gap itself matches what many plants see.

In practice, the plan breaks for four reasons:

- **Theoretical times.** The routing says 4.0 minutes per unit, but the real average, with small stops, is higher.
- **Ideal availability.** The plan assumes the machine runs all shift. Changeovers, breaks and repairs are missing.
- **Unlimited capacity.** Classic material planning does not check whether a machine or a person is free at that time.
- **Late news.** A stop that happens at 9:00 reaches the planner at the end of the shift, if at all.

## What shop floor data should flow back?

The upward path needs a short list of facts, captured close to real time. Real-time visibility of the line is the base of every good production schedule. Collect:

- **Start and end of each operation,** with the quantity produced.
- **Downtime events,** with a reason code, so that you can see which stops cost the most.
- **Scrap and rework,** from quality control checks at the line.
- **Material consumption,** which also supports traceability of lots to finished goods.
- **Operator and machine status,** for example running, waiting or in changeover.

This shop floor data is also the base for a few simple metrics: availability, speed, quality and the share of orders that finish as planned. Without them, the workflow between planning and execution stays a one-way street. Integrate the data with the ERP software through standard interfaces, so that confirmations arrive without manual entry. The aim is not more data, but the right data at the right time.

## What does a digital twin add?

A [digital twin](https://www.m365.fm/entity/digital-twin/) is a digital representation of a real resource, its relationships and its operating conditions, kept up to date from observations. For production planning, a twin of the factory holds the resources, the real times, the shift calendars and the current status of work.

That changes the plan in three ways:

1. **It uses real values.** Planned times come from measured data, not from the routing alone.
2. **It tests before release.** You can run the schedule through the model, see where it breaks and fix it, instead of finding out on the floor. This is the idea of a factory simulation, a model that tests a change before it is made.
3. **It stays in sync.** When the shop floor reports a stop or a delay, the model updates, and the plan can be revised from the current state.

The twin does not replace ERP. ERP remains the system for orders, materials and costs. The twin sits next to it and makes the plan executable.

## What does an executable plan need?

Use this checklist before you release a plan:

1. **Real capacity.** Net hours per resource, after breaks, maintenance and typical losses.
2. **Measured times.** Cycle and setup times based on actual runs.
3. **Limits are respected.** No resource is loaded beyond its calendar, and skills are matched to the work.
4. **Material is checked.** The plan knows what is available and when more arrives.
5. **Feedback is defined.** Everyone knows how progress, delays and stops are reported, and how fast.
6. **Triggers for replanning.** The team knows which events lead to a new plan and who decides.

## Example: 112 units planned, 84 delivered

This example uses assumed numbers.

A line runs one shift of 450 minutes. The ERP routing gives 4.0 minutes per unit.

**ERP plan.** 450 ÷ 4.0 = **112.5 units** per shift, rounded to 112.

**Reality, from measured data.**
- Availability is 85 percent after changeovers, stops and breaks: 450 × 0.85 = 382.5 productive minutes.
- Performance is 90 percent of nominal speed: 382.5 × 0.90 = 344.25 effective minutes.
- Quality is 98 percent good parts.

Units made: 344.25 ÷ 4.0 = about 86.1. Good units: 86.1 × 0.98 = about **84.3**. The combined factor is 0.85 × 0.90 × 0.98 = 0.75, so 112.5 × 0.75 = 84.3, which matches.

The plan promises 112 units, and the line delivers about 84. The shortfall is 28 units per shift, or 25 percent of the plan. Over a five-day week that is about 140 units. If the sales team has promised dates on the ERP numbers, the plant will miss them without any fault on the floor.

A twin that plans with 84 units per shift gives the right promise from the start. And when a stop happens, the plan can be revised that day.

## How do you start?

1. **Pick one line,** preferably the bottleneck.
2. **Measure the real numbers.** Track availability, speed and quality for four weeks, in a simple way, and compare them with the routing.
3. **Fix the master data.** Update cycle times and calendars where the gap is large.
4. **Define the feedback path.** Agree on what the shop floor reports, how, and how often.
5. **Compare plan and actual every shift.** Note the reasons for deviations.
6. **Add a model.** Once the data is reliable, test schedules in a model before release.

## Common mistakes

- **Trusting routings without checking.** Theoretical times are a common source of a failed plan.
- **Feedback only at the end of the shift.** Late news cannot change the plan in time.
- **Replacing ERP.** The aim is to add a layer for execution and planning, not to rebuild the ERP system.
- **Modeling the whole plant at once.** Start with one line and widen the scope.
- **Ignoring the people.** Supervisors and operators must trust the plan, or they will keep their own.
- **Buying software before fixing the data.** A model built on wrong times gives wrong answers faster.

## How software can help

Planning software can sit between ERP and the shop floor. [iFAKT's Polaris](https://www.m365.fm/entity/polaris/) is production software that takes order and master data from the ERP system and combines it with a digital twin of the factory, so that schedules can be optimized, bottlenecks become visible and on-time delivery improves. When you compare tools, ask how they read ERP data, how actual progress comes back and how a plan is tested before release.

## Next step

Take one line and compare the ERP cycle time with the measured one for four weeks. That gap, in units per shift, is your business case for closing the distance from ERP to shop floor. It is also the first input for a production plan that the floor can follow.
