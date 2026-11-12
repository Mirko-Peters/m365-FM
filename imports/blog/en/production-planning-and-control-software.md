---
title: "Production Planning and Control Software: What to Look For"
summary: "Production planning and control software plans, schedules and tracks orders. See what it covers, where ERP stops and how planners can choose the right tool."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [enterprise-resource-planning, dynamics-365-supply-chain-management, advanced-planning-and-scheduling, finite-capacity-scheduling, manufacturing-execution-system, polaris-optimizer, polaris-operator, ifakt]
keypoints:
  - "Production planning and control software covers three linked jobs: planning what to make, scheduling which order runs where, and controlling execution against the plan."
  - "ERP master planning and ERP scheduling are separate steps, and in some ERP products the planning run does not consider finite capacity."
  - "A scheduling layer pays off when sequence matters: a shared bottleneck, setup times that depend on the previous order, or several constraints at once."
  - "Software can only schedule as well as your routings, times, calendars and inventory records allow, so check that data before you compare tools."
  - "Pilot on one bottleneck, run the tool next to your current method, and compare plan against actual before you extend it."
faq:
  - q: "What is production planning and control software?"
    a: "It is software that decides what to produce and when, schedules orders on machines and people, releases them to the shop floor, and compares progress with the plan. ERP systems cover part of this. Dedicated scheduling or execution tools cover the rest, depending on how complex your sequencing is."
  - q: "Is production planning and control software the same as ERP?"
    a: "No. ERP manages orders, inventory, purchasing and finance, and its planning module calculates requirements. Production planning and control also needs detailed scheduling and shop floor feedback. Some ERP systems cover this partly, others rely on add-on tools or a separate scheduling system."
  - q: "How do I choose production planning and control software?"
    a: "Write down the decision the tool must support, list your hardest scheduling constraints, and check the quality of your routings and times. Then test two or three tools on one bottleneck with your own data. A demo on the vendor's sample factory tells you little about your plant."
---

Production planning and control software helps you decide what to make and when, and then checks whether the shop floor is following that decision. It covers three linked jobs: planning (what to produce and what to buy), scheduling (which order runs on which resource, in what sequence) and control (releasing orders, tracking progress and correcting the plan). This article is for production planners who already work with an ERP system and want to know what else they need, and how to choose it.

## What does production planning and control software cover?

Think of it as a loop with five steps: plan, release, report, compare, correct. Most tools are strong at one or two steps. Few are strong at all five.

Microsoft's documentation for Dynamics 365 Supply Chain Management shows what the planning step looks like in a typical ERP. [Master planning](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/production-planning) covers requirements from on-hand inventory, existing supply and approved planned orders. Any shortfall creates a new planned order, and a planned production order carries the active bill of materials and a route.

Scheduling comes next. The same documentation separates [operations scheduling from job scheduling](https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/operations-scheduling). Operations scheduling gives a general estimate of the production process over time and doesn't break the route into jobs. Job scheduling is used for individual jobs on the shop floor over an immediate or short-term horizon. With finite capacity, the schedule depends on the availability of the resources that the order needs.

Control is what happens after release. In the [production process overview](https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/production-process-overview), an order is released once scheduling is finished and material can be picked. Then progress and consumption are reported, finished goods are received and the order is ended. Researchers at the [FIR institute at RWTH Aachen](https://www.fir.rwth-aachen.de/en/research/production-management/production-planning) describe the same idea as a permanent feedback loop: order status and resource use go back to the ERP system, and planning data is checked against actual data all the time.

The point is that the loop has to close. A tool that only produces a plan is a planning tool. A tool that also sees what happened and reacts is production planning and control.

## What does your ERP already do, and where does it stop?

Start with what you own. Your [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/) almost certainly calculates material requirements and creates planned orders. Many plants stop there and do the sequencing in spreadsheets or in the planner's head.

Look at the details of one product to see why. In the Microsoft documentation for planning optimization, a planned production order gets the static lead time of the released product. Route-based scheduling that uses route information and resource constraints happens when the order is firmed. Changes to a planned order don't affect the rest of the plan until the next master planning run. And the operations scheduling page states that finite capacity isn't considered when multi-threaded master planning is used with operations scheduling.

That is a design choice of one product, not a flaw. It does show a pattern you'll find in many ERP systems: the planning run answers "what is needed by when", and the question "in which order, on which machine, with which crew" is answered by a different step. If you run [Dynamics 365 Supply Chain Management](https://www.m365.fm/entity/dynamics-365-supply-chain-management/), read what your version does at each step. If you run another system, ask your vendor the same question in plain words: does the planning run respect capacity, or does it only show me an overload afterwards?

When the answer is "it only shows the overload", and your sequence matters, a scheduling layer starts to make sense. That is the territory of [advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/): software that builds a feasible schedule from capacity, calendars, material, routing rules and priorities.

## When do you need more than ERP scheduling?

You may not. A plant with stable routings, plenty of capacity and few changeovers can run well on ERP planning and a careful planner. Add a scheduling tool when you see these signs:

- One resource or work center decides your output, and orders queue in front of it.
- Setup time depends on what ran before, so sequence changes the real capacity.
- Several constraints apply together: machine, tooling, skilled people and material.
- Your planners spend more time rebuilding the schedule than judging it.
- Customers ask for date promises, and you can't answer without a half-day of manual work.

If none of these fits, spend your first effort on data and on shop floor reporting instead. A better scheduler on poor data produces confident but wrong schedules.

## Which features matter when you compare tools?

Skip the feature checklist from the brochure. Ask how the tool handles your own hardest cases.

1. Which constraints can it model: machines, tools, shifts, skills, zones, material availability? Give the vendor your three hardest ones.
2. Does it load capacity finitely, so a schedule is always feasible, or does it show you an overload to fix by hand?
3. Can you copy the plan, change one thing and compare both versions?
4. After a disruption, how long does a reschedule take, and does the tool show you what moved and why?
5. How does the plan reach the floor: printout, screen, task list?
6. How does progress come back, and who or what reports it?
7. Where does the data come from, who maintains the mapping, and what happens when a routing changes?
8. Can your planners change rules and priorities without calling the vendor?
9. What does it cost over three years, including training and interfaces?

Run these questions in a pilot on your own data. A demo on a sample factory proves little about yours.

## What data does it need?

Every scheduling tool needs the same ingredients:

- routings with operation sequence, run times and setup times
- bills of materials and the right version for each order
- resources, calendars and shift models
- skills or qualifications, where people limit capacity
- inventory and open purchase orders
- the current status of each order

The routing times deserve the most attention. If the routing says an operation takes 12 minutes and it takes 20, every schedule is wrong in the same direction, and the planner blames the software. Take a handful of recent orders and compare the routing time with what happened. Fix the gaps on your bottleneck first.

## How do you roll it out?

Keep the first project small and measurable.

1. Pick one area, usually the bottleneck work center and the operations around it.
2. Write down the decision the tool must support, such as "which order starts next on the machine, and when will each order finish".
3. Clean the data for that area: routings, times, calendars, inventory.
4. Build the first schedule next to your current method and don't switch yet.
5. Compare plan against actual for a few weeks. Note where the plan was wrong and why.
6. Agree on rules for changes: what triggers a reschedule, and what is frozen.
7. Extend to the next area only when the first one holds.

A hypothetical example shows the pattern. Imagine a machining shop where every order passes through one five-axis machine, and the planner sequences by due date in a spreadsheet. A finite schedule might show that two orders with the same tooling should run back to back to save a changeover. It might also show that a third order can't finish before the end of the week, whatever the sequence. The planner learns that on Monday instead of Thursday. None of these details come from a real plant. They show what a schedule can tell you early.

## How do you keep the plan from changing all the time?

A schedule that is rebuilt every hour is as useless as one that never changes. Decide in advance which part of the plan is frozen, usually the next few hours or the next shift. Decide which events justify a change: a machine stops, a material is late, a rush order arrives. Everything else waits for the next planning cycle.

Control also needs a measure. Compare how many orders started and finished as planned. A deviation tells you either that the plan was unrealistic or that the floor drifted. Both are useful to know, and they need different fixes.

## Common mistakes

- Buying a scheduler before checking routing times and calendars.
- Assuming the ERP planning run already respects capacity, without testing it.
- Starting with the whole plant instead of one bottleneck.
- Rebuilding the schedule after every small disruption, so nobody on the floor trusts it.
- Giving the planner a plan but no way to see what really happened on the shop floor.
- Leaving rules and priorities in the head of one planner, so the tool can't reflect them.

## Where Polaris fits

If your gap sits between the ERP plan and a feasible schedule, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production that works with ERP data. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module turns the product-process-resource model into an executable plan under constraints such as resources, shifts, zones, skills and capacities, and it re-optimizes when disruptions occur. The [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) module brings plans to the floor as time-based tasks and captures progress, delays and disruptions as feedback. Test it, like any tool, on one bottleneck with your own data first.

## Related topics to explore

- Capacity planning against finite scheduling: when a weekly load view is enough and when you need a daily feasible schedule. See [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/).
- How to measure schedule adherence: compare planned and actual start and finish for each order.
- How APS and MES share data: the plan goes down and the status comes back. See [manufacturing execution systems](https://www.m365.fm/entity/manufacturing-execution-system/).
- Master data quality for planning: who owns routings and times, and how often they are checked.

## Next step

Before you shop for production planning and control software, choose the one resource that decides your output and write down the three constraints that make its schedule hard. Take that list, and a month of order data, into your next conversation with a vendor or with your ERP team.
