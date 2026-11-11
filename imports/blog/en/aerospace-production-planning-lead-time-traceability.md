---
title: "Production Planning for Aerospace Suppliers: Lead Time and Traceability"
summary: "Aerospace production planning must handle long lead times, multi-tier suppliers and traceability. A guide for production managers with a lead time example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [aerospace, polaris, traceability, enterprise-resource-planning]
keypoints:
  - "Aerospace production planning is driven by long supplier lead times, multi-tier supply chains and strict traceability, not by machine speed alone."
  - "Outdated lead times in master data distort the plan, so the first fix is to compare the lead times in the ERP system with the real ones."
  - "Traceability is an outcome that the quality system must achieve; each supplier decides how, for example with lot numbers and an as-built list per build package."
  - "Plan backwards from the due date with real lead times, and release long-lead items first, because a late order cannot be recovered on the shop floor."
  - "Start with one product family: clean the master data, mark the long-lead items and compare planned with real supplier dates every week."
faq:
  - q: "Why is production planning harder for aerospace suppliers?"
    a: "Aerospace parts combine long lead times for specialized material, a multi-tier supplier network, strict quality rules and full traceability. A late forging or an incomplete record can stop a whole program. Planners must coordinate demand, capacity and supplier dates across several tiers, and keep the records that prove which lot went into which product."
  - q: "What does AS9100 require for traceability?"
    a: "An article on the standard says AS9100 requires the quality system to achieve traceability but leaves the method to each supplier. Typical practice is lot or serial numbers that follow a part from receipt into assemblies, with a build package that lists what went into which product. Check your own contracts and the current revision."
  - q: "How do you plan around long lead times?"
    a: "Plan backwards from the due date using real lead times, not the values in old master data. Mark long-lead items, release them first and track supplier dates every week. Keep a small buffer for the items that cannot be recovered later, and compare planned with confirmed dates so that delays show up while there is still time."
---

Aerospace production planning has to deal with long supplier lead times, a multi-tier supply chain and strict traceability, and a plan that ignores any of the three fails on the shop floor. This article is for production managers at aerospace and defense suppliers and for the production planners who work with them. You will learn why the planning differs, how lead times distort a plan, what traceability asks of it and how to build a plan that holds.

## What makes aerospace production planning different?

The [aerospace](https://www.m365.fm/entity/aerospace/) industry designs, builds and maintains aircraft, spacecraft and their components, and it is defined by strict quality, traceability and certification requirements. For the production planner this has three effects.

- **Long lead times.** Surgere, a supply chain company, writes that specialized parts can take months or years to source. See the [Surgere article on aerospace supply chains](https://surgere.com/blog/aerospace-supply-chain-challenges-and-resilience/). A late order of raw material cannot be recovered later by working faster.
- **Many tiers.** The consultancy 4flow describes aircraft with millions of individual parts and programs with hundreds of thousands of components across several production tiers. Suppliers for critical systems are few, so ramp-ups cannot simply be ordered downstream.
- **Records as part of the product.** A part is only ready to ship if its history is complete.

Demand is not the main problem right now. 4flow reports that Airbus and Boeing held backlogs of roughly 8,750 and 6,100 aircraft in 2025, about a decade of production at current rates. Suppliers in the aerospace industry who sit below the OEMs feel this as a steady pull on capacity, material and skilled people. See the [4flow article on advanced planning in aerospace](https://www.4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace). It comes from a consultancy, so read the market figures as context and not as a forecast for your plant.

## How do long lead times distort the plan?

A production schedule runs backwards from the due date. For each level it subtracts the lead time, and the sum tells you when to release the first order. If one lead time is wrong, every date above it is wrong too.

4flow points to a typical cause: outdated lead times in master data. Traditional sequential planning, it says, struggles with long lead times and chained dependencies. It also notes that fragmented data across ERP, PLM and MES systems, such as incorrect bills of materials and duplicate supplier records, erodes the trust of planners. Poor data produces poor results, even with advanced software.

You can see the problem in four signs:

1. The MRP run in the ERP system suggests purchase orders that are already late on the day they are created.
2. The planner keeps a private list of "real" lead times for the critical items.
3. Procurement checks material availability by phone call, not by the plan.
4. Expediting is routine for the same suppliers every month.

The fix starts with data. Compare the lead time in the master data with the last delivery dates of the supplier. Update the values, and name an owner for each long-lead item. A lead time that moves by a few weeks can change the release date by the same amount.

## What does traceability require from the plan?

The [traceability](https://www.m365.fm/entity/traceability/) of material and products means following their recorded history through receipt, production and delivery, for example to support recall and containment decisions.

An article for defense subcontractors, written when AS 9100D was being introduced, gives a practical picture. It says that AS 9100 treats acquisition traceability as a specialized area of the quality system. The standard sets outcomes, not methods: the quality system has to achieve traceability, and each supplier chooses the procedure. Customers such as the US Department of Defense, NASA and the FAA expect suppliers to trace a failing component back to its origin, which means keeping the ancestry of the component on file. See the [InCompliance article on AS 9100 traceability](https://incompliancemag.com/how-to-fulfill-as-9100-traceability-requirements-as-a-defense-subcontractor/). Check your own contracts and the current revision of the standard, because the article is older.

What does this mean for the plan?

- **Lots stay together.** A received lot gets a number that follows the material into stock issues and into assemblies. The plan should not mix lots that must stay separate.
- **Routing documents are records.** The article describes a build package with routing documents and an as-built list, which shows which lots went into which products and which customers received them.
- **Tooling has records too.** Tools need a documented procedure and records of when they were serviced or replaced.
- **Rework and scrap need a trail.** A rework step is a planned operation with its own record, not a side activity.

Traceability costs time. Build the recording steps into the routing and the standard times. If they live outside the plan, they will be done late or not at all.

## Who plans what in an aerospace plant?

Planning in aerospace manufacturing is a team job, and unclear roles are a hidden source of delay.

- **The aerospace production planner** turns sales orders and forecasts into material planning and work orders, using the bill of materials (BOM), inventory levels and the supplier dates.
- **The production scheduler** sequences the work orders on the machines and checks the material flow on the shop floor.
- **The production planning manager** owns the planning function and reviews production performance with the plant.
- **Quality control** supplies the corrective actions and holds that change the schedule.

The key skills are data-driven decisions, good knowledge of ERP and MRP, clear written and verbal communication and the ability to handle multiple priorities and projects. Aerospace companies and aerospace manufacturers differ in size, but the planning function looks alike from avionics assemblies to machined aerospace components. Define the handover between planning and scheduling in writing, so that nobody assumes the other side checks the material.

## How do you build a plan that holds?

Combine the points above into a short routine for the planning team:

1. **Clean the master data first.** Lead times, bills of materials and supplier records must be right before any tool can help.
2. **Plan backwards with real lead times.** Offset each level from the due date, and flag the items whose lead time is longer than the horizon.
3. **Release long-lead items first.** Purchase orders for forgings, castings or special material go out before the rest.
4. **Check material availability before release.** A work order without material blocks a machine and a person.
5. **Plan finite capacity for the shop floor.** A schedule that respects each machine and each qualification is more stable than one that assumes unlimited capacity.
6. **Freeze the near term.** Changes inside the frozen window need an owner.
7. **Track confirmed against planned dates every week,** and ask suppliers early when a date moves.
8. **Review the on-time performance** of the plan on a dashboard that planners and managers both read.

## Example: a six-week error in the forging lead time

This example uses assumed numbers.

A product has a final assembly date in week 40. The levels, from the end backwards, are:

- Assembly and test: 2 weeks
- Inspection and records: 1 week
- External heat treatment: 2 weeks
- Machining: 4 weeks
- Forging from the supplier: 20 weeks in reality

**With the real lead times.** 2 + 1 + 2 + 4 + 20 = **29 weeks**. Week 40 minus 29 weeks gives week 11. The forging order must go out in **week 11**.

**With the master data.** The ERP record still says 14 weeks for the forging. Then the sum is 2 + 1 + 2 + 4 + 14 = **23 weeks**, and the system suggests an order in week 40 − 23 = **week 17**.

**Result.** An order placed in week 17 arrives after 20 weeks, in week 37. Machining, heat treatment, inspection and assembly need another 4 + 2 + 1 + 2 = 9 weeks, so the product is finished in week 46. That is **6 weeks late**, and no amount of overtime in the shop can win those weeks back.

The numbers are made up, but the effect is general. A wrong lead time at the start of the chain moves the whole schedule, and the error is invisible until the material arrives.

## Common mistakes

- **Trusting old lead times.** Master data that nobody has checked for years is a frequent source of late plans.
- **Treating traceability as paperwork.** If recording steps are not in the routing, they will be skipped under pressure.
- **Ignoring the lower tiers.** A shortage at a sub-supplier can cascade through the program, so ask your suppliers about theirs.
- **Planning only in the ERP system.** An ERP run does not check finite capacity or qualifications, so the shop floor works around it.
- **Fixing delays with overtime.** Overtime helps with machining, not with a late forging.
- **Changing the frozen plan daily.** The shop floor stops believing in the schedule.

## How software can help

Many suppliers still plan in spreadsheets next to their [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/). [iFAKT's Polaris](https://www.m365.fm/entity/polaris/) is production software that combines ERP data with a digital twin of manufacturing and AI to optimize production schedules, reveal bottlenecks and improve on-time delivery. When you compare tools, ask how they read lead times and lot data, how they show late supplier dates and how a plan is checked against real capacity.

## Next step

Take your five longest-lead items and compare the lead time in the master data with the last three deliveries. Any gap of more than a week is a direct input for better aerospace production planning, and it costs you nothing to find.
