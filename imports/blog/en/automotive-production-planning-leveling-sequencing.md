---
title: "Automotive Production Planning: Leveling, Sequencing, Changes"
summary: "Automotive production planning turns customer schedules into a leveled, feasible plan. See the planning levels, leveling, sequencing and change handling."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [manufacturing, advanced-planning-and-scheduling, sap, polaris-optimizer, polaris-simulator, ifakt]
keypoints:
  - "Automotive production planning turns customer forecasts and firm delivery schedules into a leveled build plan, a material and capacity plan and a daily sequence."
  - "Odette describes delivery requirements as a mix of firm near-term instructions and forecasts that usually cover 6 to 12 months, so a plan has to carry both."
  - "Lean.org defines heijunka as leveling the type and quantity of production over a fixed period, which reduces inventory and lead time compared with batching."
  - "Just-in-sequence delivery means parts arrive in the exact order of use, and the sequence has to hold from the source to the line."
  - "Test every change request against capacity and material before you accept it, and agree in writing which part of the plan is frozen."
faq:
  - q: "What is automotive production planning?"
    a: "It is the process of turning customer forecasts and firm delivery schedules into a plan the plant can build. It covers long-term capacity, a leveled medium-term plan, material availability and the daily sequence. Because vehicles and parts come in many variants, it has to balance volume and mix at the same time."
  - q: "What is the difference between production planning and scheduling in automotive?"
    a: "Planning decides what to build and in which quantities over weeks and months, checking capacity and material. Scheduling decides when and on which resource each job runs, and in which order, down to shifts and hours. Planning sets the frame, and scheduling works inside it every day."
  - q: "Why is leveling important in automotive production?"
    a: "Customer orders swing from day to day, but a plant runs better at an even load. Leveling spreads type and quantity evenly over a fixed period, which avoids large batches, reduces inventory and lead time, and gives suppliers a steadier signal. It needs a small finished-goods buffer and short changeovers."
---

Automotive production planning turns customer forecasts and firm delivery schedules into a plan your plant can actually build: how much of each variant, on which resources, in which order, with which material. It differs from planning in many other [manufacturing](https://www.m365.fm/entity/manufacturing/) settings because customer schedules arrive in layers, product variety is high, and parts often have to arrive in an exact sequence. This article is for production planners at automotive suppliers and plants who want a clear picture of the planning levels, how to level the load and how to cope with changes.

## What makes automotive planning different?

Four things stand out.

**Customers send schedules, not just orders.** [Odette](https://www.odette.org/process/ordering), the automotive standards organization, describes purchase orders for production parts as framework contracts that often last 12 months up to a model's full production life. Delivery requirements then come separately, based on actual production programs. Those messages typically combine firm near-term delivery instructions with forecasts, usually covering 6 to 12 months. Some companies keep long-term forecasts apart from firm instructions. Either way, your plan has to treat the firm part and the forecast part differently.

**Variety is high.** Colors, options and markets multiply variants. A plan that looks fine in total units can still be infeasible for one variant that needs a scarce tool or a special material.

**Delivery can be tight in time and in order.** Odette lists call-off, kanban and synchronized delivery messages for just-in-time and just-in-sequence processes. You'll meet these in many customer agreements.

**Quality systems are part of the plan.** [IATF 16949:2016](https://www.iso.org/es/contents/news/2016/08/Ref2109.html) replaced ISO/TS 16949 and is used alongside ISO 9001:2015 as a supplement, according to ISO. If you read older material that cites ISO/TS 16949, check which standard your customers require today. For planning, this means time for validation runs, inspection and traceability must be in the routing, not added later.

## How do you build an automotive production planning process step by step?

Think in levels. Each level has a different horizon, a different owner and a different question.

1. **Read the demand.** Separate the firm schedule from the forecast. Check how each customer's forecast has behaved in the past, and keep a note of which customers change their numbers often.
2. **Check capacity at a coarse level.** Compare the load by resource group with available hours across the months ahead. This is where you see whether a new program needs another shift, a second tool or an investment. It's also where you decide what to tell customers early.
3. **Build a leveled plan.** Turn demand into a steady load per day or week (more on this below).
4. **Plan material.** Run your requirements planning on the leveled plan. Check long lead-time items and shared components first.
5. **Schedule the near term.** Assign jobs to machines and shifts for the next days, respecting setup times, tool availability, skills and maintenance. This is detailed scheduling, and a spreadsheet gets difficult here once several constraints interact.
6. **Sequence and release.** Fix the order in which work enters the line and release it to the floor.
7. **Track and feed back.** Compare plan and actual every shift, and let the differences change the next plan.

Your ERP system normally covers steps 1, 2 and 4, for instance when [SAP](https://www.m365.fm/entity/sap/) is the system of record. Steps 5 and 6 are where a dedicated [advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) tool or an MES often comes in. Where the boundary sits depends on your products, your routings and your IT setup, so decide it deliberately.

## How do you level the load?

Customer demand is uneven. Your plant should not be. Lean.org defines [heijunka](https://www.lean.org/lexicon-terms/heijunka/) as leveling the type and quantity of production over a fixed period of time. According to the page, this lets production meet customer demand without batching and reduces inventory, capital costs, manpower needs and production lead time along the value stream.

Here is a hypothetical example, made up only to show the arithmetic. A supplier gets call-offs of 300, 200, 150, 150 and 200 units from Monday to Friday, 1,000 in total. Building to those numbers means a heavy Monday, a thin Wednesday and Thursday, and a plant that is either rushed or idle. Instead the plant builds 200 units every day and keeps a small finished-goods buffer near shipping to cover the daily differences. The load on the line and on suppliers is even. The price is the buffer, and it needs a rule for its size.

Leveling applies to mix as well. The lean.org page contrasts building all of model A, then all of model B, to minimize changeovers, with interleaving models in a repeating pattern and cutting changeover times so that this becomes practical. The sequence is adjusted periodically as orders change. In automotive terms: if you build a week of one variant and then a week of another, you carry stock and your customer sees long lead times. Short changeovers are what make a mixed pattern affordable, so work on setup time before you work on the pattern.

## How does sequencing work, and when do you need just-in-sequence?

[Just-in-sequence](https://www.allaboutlean.com/just-in-sequence-definition/) means parts are delivered in the exact order in which they will be used, so the assembler takes the next part instead of choosing among variants. It's about order, not about stock levels. The source notes that it combines well with just-in-time, but neither is a prerequisite for the other, and it doesn't automatically lower inventory.

Why does automotive use it? Many options make production high-mix, and a part such as a door has to match the specific car. A stocked shelf works only for a limited number of variants.

The same source describes three ways to hold the sequence: pick to sequence from inventory, ship to sequence with the supplier loading trucks in order, and build to sequence upstream. Build to sequence is only worthwhile if the source is close enough. It also advises not extending sequencing to sub-components until the direct sequencing runs reliably.

For you as a planner, the consequence is simple. A sequence is a promise down the chain. Once you've released it, every change has a cost at a supplier. That's one reason to agree in advance what is frozen.

## How do you handle changes and bottlenecks?

Changes are the normal case. Customers revise schedules, machines stop, material arrives late. Three habits keep the plan from falling apart.

**Define a frozen window.** Decide, with your sales and production colleagues, how far ahead the plan may not be changed without approval. This is a recommendation from planning practice, not a rule from a standard, and the right length depends on your lead times and changeover costs. Write it down and show it to your customers if their agreements allow it.

**Test every change request before you accept it.** Before answering "yes, we can do that", check capacity at the bottleneck and the material for the affected parts. A request that fits the weekly load can still break Wednesday's schedule. A what-if run helps here: copy the plan, apply the change, compare the two.

**Protect the bottleneck.** Find the resource that limits output and keep it fed. A small buffer in front of it and a clear rule for which jobs go first matter more than another percentage point of utilization elsewhere. When a disturbance hits, first ask what it does to the bottleneck.

Here is another hypothetical example. A customer asks for an extra 200 units in the week after next. The weekly load looks fine, with some slack. But those units need a tool that's in maintenance on Tuesday and Wednesday. The detailed schedule shows the earliest completion is Thursday. That's the answer to give the customer, with a date you can keep.

## What data and systems do you need?

The plan is only as good as its master data. Before buying anything, check these basics:

- **Bills of materials and routings** that match how you build today, including variants and options.
- **Cycle, setup and changeover times** that someone has measured recently.
- **Calendars** with shifts, holidays, planned maintenance and tool availability.
- **Customer schedules** stored with their version and date, so you can see how forecasts changed.
- **Actuals** from the floor: start, finish, good and scrap quantities, downtime.

The systems fall into layers. ERP holds orders, items, routings and costs and runs requirements planning. An APS calculates a feasible detailed schedule under constraints. An MES records execution. A reporting layer such as Power BI can show plan against actual, delivery performance and the state of the bottleneck to planners and managers. Decide which system owns the sequence, so the floor doesn't receive two versions of the plan.

Start with the data, then the layers. A strong scheduler on weak routing data produces confident, wrong schedules.

## Common mistakes

- Treating the forecast as if it were a firm order, or the other way round.
- Planning only at the weekly level and discovering the daily conflicts on the floor.
- Chasing every customer change without testing it against capacity and material.
- Building in large batches to avoid changeovers, then carrying the stock and the lead time.
- Leaving the frozen window undefined, so the plan changes every shift.
- Running two systems that both publish a work list.
- Using old cycle times and setup times that nobody has verified.
- Citing outdated standards in supplier documents, for instance ISO/TS 16949 where your customer now expects IATF 16949.

## Where Polaris fits

If your hardest problems are feasible plans under constraints and fast reaction to disruptions, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, working with ERP data, and names automotive among its key industries. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module turns the production model and real-time ERP data into an optimized plan under constraints such as resources, shifts, skills and capacities, detects bottlenecks and prioritizes orders, and reacts to disruptions with impact analysis and re-optimization. The [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) module lets you test capacity, staffing and buffer scenarios, and dynamic product mixes on shared resources, before you change the real plant. Test it on one line and one real change request first.

## Related topics to explore

- **Workforce planning:** how to forecast labor needs and skills when volumes and technology change.
- **Supply chain disruptions:** which what-if cases to run for late material, supplier outages and logistics problems.
- **Supplier quality and standards:** where IATF 16949 requirements show up in routings, inspection steps and traceability.
- **Bottleneck management:** buffers, priorities and the rules for protecting the constraint.
- **Sustainability data in planning:** how energy and material data can sit next to capacity data in the same plan.

## Next step

Take your next customer schedule and mark which part is firm and which part is forecast. Then check the first firm week against the bottleneck's detailed schedule, not only the weekly load, and write down where automotive production planning in your plant still depends on guesses.
