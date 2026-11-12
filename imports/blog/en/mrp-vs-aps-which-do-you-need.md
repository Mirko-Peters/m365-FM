---
title: "MRP vs APS: What Each Does and When MRP Is Not Enough"
summary: "MRP vs APS: MRP works out what material to order and when, APS works out what the plant can actually run. See where MRP breaks and how to add APS in steps."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [material-requirements-planning, advanced-planning-and-scheduling, enterprise-resource-planning, dynamics-365, polaris-optimizer, ifakt]
keypoints:
  - "MRP nets gross requirements against inventory and offsets by lead time to produce planned orders; it answers what to order or make, and when."
  - "MIT course notes list the limits of MRP: it is deterministic, it assumes infinite capacity, planned lead times tend to be long and small deviations can cause large schedule changes."
  - "APS adds finite capacity, calendars, setups and priorities, so it answers whether the plan can be run and which order slips if it can't."
  - "Most plants use both: MRP for material, APS for the feasible sequence, with one system named as the owner of the sequence."
  - "Add APS when overloaded resources, long lead times padded for safety or constant expediting show up, and fix routing and capacity data before you buy anything."
faq:
  - q: "What is the main difference between MRP and APS?"
    a: "MRP calculates what material you need and when, from demand, bills of materials, inventory and lead times. It does not check whether machines and people can do the work. APS adds those limits and calculates a schedule the plant can run, showing which orders will be late if capacity falls short."
  - q: "Does APS replace MRP?"
    a: "Usually not. MRP still explodes bills of materials and nets inventory to produce material requirements, and APS typically works on top of that result or uses the same data. The question is which system owns the final sequence and how changes move between the two without a second, conflicting plan."
  - q: "When is MRP alone enough?"
    a: "MRP alone can be enough when capacity is not tight, routings are stable and lead times are short and reliable. If your resources are rarely overloaded and expediting is the exception, an MRP run plus a careful planner may do the job. Overloaded bottlenecks, long setups and frequent rush orders point toward APS."
---

MRP (material requirements planning) works out what material you need and when to order or make it. APS (advanced planning and scheduling) works out whether the plant can actually run that plan, on which resource and in which order, and which orders slip if it can't. That is the short answer to the mrp vs aps question, and it explains why most plants end up with both. This article is for production planners who feel that their MRP output looks fine on paper but doesn't survive contact with the shop floor, and who want to know whether APS is the fix.

## What does MRP actually do?

Take the mechanics from the [MIT course notes on MRP](https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf). The inputs are a master production schedule (what must be delivered and when, plus on-hand inventory), an item master with the bill of materials, lot-sizing rules and planning lead times, and inventory status.

The logic has four parts:

1. **Netting.** Net requirements equal gross requirements minus on-hand inventory, tracked period by period. An order is needed when projected inventory would go negative.
2. **Lot sizing.** Orders are sized by a rule such as lot-for-lot, fixed order period or fixed order quantity.
3. **Lead-time offsetting.** Each order is released earlier than its due date by the planned lead time.
4. **BOM explosion.** The same steps repeat for each component level, using the planned releases of the level above as gross requirements.

The output is planned orders, change notices and exception reports. In an [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/), this is normally the planning run. In [Dynamics 365](https://www.m365.fm/entity/dynamics-365/) Supply Chain Management, it's part of master planning. That is [material requirements planning](https://www.m365.fm/entity/material-requirements-planning/) at its core: a reliable way to keep material coming for a known demand.

## Where does MRP break?

The same MIT notes are blunt about the limits. They say MRP is deterministic but reality is not, and they name several consequences:

- **Infinite capacity.** MRP assumes capacity is available when the plan needs it. Real capacity is finite, so the schedule can be infeasible.
- **Padded lead times.** Planned lead times tend to be set long to absorb variability, which inflates inventory and work in process.
- **Nervousness.** Small deviations from plan can cause large changes in the schedule. Freezing the near-term schedule helps but has its own cost.
- **Compensation by buffers.** Safety stock and safety lead time are added to deal with uncertainty, and yield losses force you to start extra parts.

Here is a hypothetical example, invented only to show the logic. A machine has 80 hours available this week (two shifts, five days). The MRP run releases three planned orders that all need it: 40 hours, 35 hours and 30 hours. The total load is 105 hours. MRP doesn't object. It sees material and lead times, not an overload of 25 hours. On the floor, someone has to decide which order waits, whether to add overtime or move work to another machine, and nobody sees the consequences for delivery dates until it happens.

That decision is what APS makes visible before the week starts.

## What does APS add?

APS puts the plan on a calendar with limits. In practice that means finite capacity, working calendars, setup and changeover times, alternative resources, order priorities and, often, tool and skill availability. The result is a schedule that fits the plant, plus a clear list of which orders will be late and by how much.

Microsoft's documentation shows that even ERP systems have a layer for this. The page on [constrained plans](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/tasks/constrained-plan) describes a master plan that accounts for both material and capacity constraints, so that manufacturing doesn't start before materials are available and resources aren't overbooked. It's switched on through settings such as finite capacity and time fences. The page on [operations scheduling](https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/operations-scheduling) adds a caveat that matters for expectations: operations scheduling gives a general estimate over time and schedules each operation for its resource group using the route's durations. It doesn't select specific resources within a group. Job scheduling is the tool for short-term, detailed shop floor scheduling. So there is a spectrum, not a switch. Check what your ERP version can do before you assume you need a separate product.

A dedicated [APS](https://www.m365.fm/entity/advanced-planning-and-scheduling/) goes further on detail. It typically handles sequence-dependent setups, several constraints at once and quick what-if runs, and it lets a planner see and change the result. Whether you need that depends on your plant, not on the label.

## How do you know you've outgrown MRP?

Look for symptoms, not for features. These patterns usually point to a scheduling problem and not a material problem:

- The MRP run says everything is fine, yet the same machines are overloaded every week.
- Planned lead times keep growing because that is the only way to hit dates.
- Planners keep a private spreadsheet to sequence the bottleneck.
- Rush orders cause most of the chaos, and nobody can say what they push back.
- You can't give a reliable delivery date without walking to the floor.
- Material shortages are rare, but late orders are common.

If material shortages are your main problem, fix your MRP data first: bills of materials, lead times, lot sizes and inventory accuracy. APS on top of poor master data produces precise nonsense.

If most of your symptoms match, test the idea cheaply. Take the bottleneck machine, copy next week's released orders into a spreadsheet, and sequence them by hand with real calendars and setup times. If that exercise changes the plan, you've found the value APS would automate.

## MRP vs APS: how do they work together?

Think of a division of labor, and write it down.

- **MRP (in ERP) owns material.** Requirements, purchase proposals, planned orders and stock.
- **APS owns the sequence.** It takes the orders, checks capacity and publishes the schedule.
- **The shop floor reports back.** Start, finish, quantities, scrap and downtime flow to the system that owns the sequence, so the next schedule starts from reality.

Data flows both ways. Orders and routings go from ERP to APS. Dates, sequence and resources go back to ERP, so that promises to customers and material timing follow the feasible plan, not the infinite-capacity one. The most common trouble spot is a second work list. If the ERP prints one list and the APS shows another, the floor will follow whichever is easier, and the plan quietly stops being the plan.

Decide three things before you integrate:

1. **Who may release or change an order?** One system, one rule.
2. **How often do the systems exchange data?** Hourly, per shift or on demand. Match it to the decisions: a planner who reschedules tomorrow needs status by the end of the shift, not by the minute.
3. **What happens when the connection breaks?** The floor must keep working and catch up later.

## How do you add APS without a big-bang project?

Work line by line.

1. **Pick one constraint and its line.** One bottleneck, one product family.
2. **Clean the data for that line.** Routings, cycle and setup times, calendars, alternative resources. Walk the floor to check them.
3. **Run the APS in parallel for a few weeks.** Compare its schedule with what the planner would do, and with what really happened.
4. **Measure the gaps.** Planned against actual start and finish, delivery performance, overtime. Look at where the schedule was wrong and why.
5. **Name the owner of the sequence** and switch the floor to that list.
6. **Extend to the next line** only after the numbers agree.

A word on staffing. APS typically changes the planner's job. Instead of following a routine and resolving exceptions after the run, the planner monitors and adjusts a live schedule. Plan training time and give them authority to change the plan, or the tool will be used as a report.

## What should you ask a vendor?

Questions that separate good answers from vague ones:

- Which system owns the sequence, and how does the other one learn about changes?
- How does the tool treat setups that depend on the previous job?
- How long does a reschedule take with my order volume, and how does a planner see what changed?
- What data do you need from the ERP, and what do you write back?
- Which parts of this can my own team maintain after go-live?
- Can I run the tool on one line with my data before I commit?

Ask also how it fits your ERP. If you run an ERP system with built-in finite-capacity options, ask what you'd gain beyond them, and what it would cost to keep both in sync.

## Common mistakes

- Buying APS to fix material shortages that are really bad MRP data.
- Trusting an MRP plan without checking load against capacity.
- Padding lead times in the ERP to compensate, then wondering why inventory grows.
- Letting both systems publish a work list.
- Going live on the whole plant at once.
- Ignoring that scheduling needs setup times and calendars that someone has verified.
- Treating APS as a software purchase and not as a change in how planners work.

## Where Polaris fits

If your MRP plan is right but the schedule is wrong, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, working with ERP data. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module turns the production model into an executable, optimized plan based on real-time ERP data, resource availability and constraints such as resources, shifts, zones, skills and capacities. It detects bottlenecks, prioritizes orders, and reacts to disruptions with impact analysis and re-optimization. Whether it complements or replaces parts of your current setup depends on your ERP and your shop floor reporting, so test it on one line with your own data.

## Related topics to explore

- **Finite capacity scheduling:** why a weekly load view can look fine while the daily schedule is infeasible.
- **Planning data quality:** who owns routings, times and calendars, and how often they're checked.
- **Closed-loop planning:** how actuals from the floor change the next plan.
- **Safety stock and lead-time buffers:** how padding in MRP hides a scheduling problem.
- **Planner skills in a scheduling project:** what changes in the daily work and how to prepare for it.

## Next step

Open your latest MRP run and pick the machine that is overloaded most often. Sequence next week's orders on it by hand, with real calendars and setup times, and see how far the result differs from the plan. That one exercise tells you whether the mrp vs aps question is a data issue or a scheduling issue in your plant.
