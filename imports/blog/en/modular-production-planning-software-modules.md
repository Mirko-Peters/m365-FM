---
title: "Modular Production Planning Software: Which Modules to Add First"
summary: "Modular production planning software lets a growing factory add planning layers step by step. See which modules exist, what they share and what to add first."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [manufacturing, master-planning, advanced-planning-and-scheduling, ifakt, polaris, polaris-designer, polaris-optimizer]
keypoints:
  - "Modular production planning software splits planning into layers such as master schedule, material planning, finite scheduling, execution feedback and KPIs."
  - "Modules only work together when they share one set of item, bill of materials, routing, resource and calendar data."
  - "Add the module that fixes your most expensive symptom first: shortages, infeasible schedules, plans nobody follows or a lack of visibility."
  - "Ask every vendor whether modular means one suite with shared data or separate products joined by interfaces; the answer changes your integration effort."
  - "Pilot one product family end to end across two modules before you buy the rest."
faq:
  - q: "What is modular production planning software?"
    a: "It is planning software built from separate modules, such as master scheduling, material planning, finite scheduling, shop floor feedback and reporting. You start with the module that solves your biggest problem and add others later. The modules should share the same product, routing and resource data."
  - q: "Which planning module should a growing factory add first?"
    a: "Add the one that addresses your most expensive symptom. Frequent shortages point to material planning. Late orders despite a good material plan point to finite scheduling. A plan that nobody follows points to shop floor feedback. Start with one product family to prove the gain."
  - q: "Is modular planning software better than one big system?"
    a: "Neither is better in general. A single suite gives you shared data with less integration work. Separate modules give you flexibility and a smaller first step. Judge by who owns the shared data, how the interfaces are maintained and what a new module costs to connect."
---

Modular production planning software splits planning into separate modules, such as master scheduling, material planning, finite scheduling, shop floor feedback and reporting, so you can start with the one that solves your biggest problem and add the rest as the factory grows. The catch is that modules only help if they share the same data and agree on the same plan. This article is for production planners in [manufacturing](https://www.m365.fm/entity/manufacturing/) plants who have to pick a first module and want to avoid a patchwork.

## What does "modular" mean in planning software?

Vendors use the word in two ways, and you should ask which one you're hearing.

The first is a suite with modules that share one database. Wikipedia's description of [manufacturing resource planning](https://en.wikipedia.org/wiki/Manufacturing_resource_planning) is a good picture of this idea. MRP II is built from modules such as the master production schedule, item master and bill of materials, production resources data, material requirements planning, shop floor control and capacity planning, and these modules share common data so they can exchange information freely. It is, by definition, fully integrated or at least fully interfaced.

The second is a set of separate products, each strong in one layer, joined by interfaces. That gives you freedom to replace one piece later, but you own the data mapping and the testing between the pieces.

Neither is wrong. They differ in where the work lands. With a suite, the work is in configuration. With separate products, it's in integration. Know which you're buying before you compare prices.

## Which planning layers can be modules?

A planner's day moves through a few layers, and each can be a module. Names differ between products, but the logic is stable.

- **Master schedule.** The [master production schedule](https://en.wikipedia.org/wiki/Master_production_schedule) sets out which products will be produced in each period. According to Wikipedia, its inputs include forecast demand, sales orders, inventory levels, supply, lot size, lead time and capacity, and it drives a material requirements plan.
- **Material planning.** This layer nets demand against stock and open supply, and proposes orders. Dynamics 365 calls it [master planning](https://www.m365.fm/entity/master-planning/), and [Microsoft's documentation](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/master-planning-home-page) describes it as combining available materials and capacities with what is required, calculating requirements and generating planned orders that planners can change. It separates a net requirements plan for day-to-day replenishment from forecast planning for long-term needs.
- **Finite scheduling.** This layer places orders on resources in time, with real limits. [Advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) is described on Wikipedia as an approach that plans materials and capacity together and accounts for constraints, whereas traditional MRP-style systems plan them separately and can produce plans that can't be executed.
- **Execution and feedback.** This layer gives supervisors their tasks and reports back what actually happened.
- **KPIs and review.** Lead time, utilization and on-time delivery, compared against the plan.

Look at the gap between the second and third layer, because it explains many late orders. Microsoft's documentation notes that a planned production order uses a static lead time from the product record, while route-based scheduling with resource constraints happens when the order is firmed. So the lead time can change between the plan and the firm order. That isn't a defect. It's what happens when planning layers use different information, and it's the reason a finite scheduling module is worth considering.

## Which module should you add first?

Start from the symptom that costs you the most, not from the feature list.

1. **You run short of material, or carry too much.** Start with material planning and clean stock and lead-time data.
2. **Material is there, but orders still ship late.** The plan ignores capacity. Look at finite scheduling.
3. **The schedule looks fine on screen and nobody follows it.** You need execution feedback, so planners learn about delays the same day.
4. **Everyone argues about numbers.** Add a KPI layer with agreed definitions before any new planning logic.
5. **You can't tell whether a change will help.** A what-if capability, such as the simulation that MRP II descriptions already mention, can come later.

A single product family is a better first scope than a single department. It lets you see the effect of one module on real delivery performance.

## What must the modules share?

Whatever the architecture, the modules must agree on a small set of master data:

- item master and bill of materials,
- routings and operation times,
- resources, work centers and their calendars,
- shift models and available skills,
- order statuses and their meaning.

If two modules hold their own copy of any of these, they'll drift apart within months. Decide which module is the master for each object and who corrects it when the floor disagrees.

Test this in the demo. Ask the vendor to change a routing time in one module and show you where the change appears in the others, and how long it takes. If the answer is "after an export", you've learned the real integration effort.

### Example: one routing, two answers

This is an invented example, not a measured result. A plant adds a finite scheduling module next to its existing material planning. The ERP routing for a bracket says the milling operation takes 15 minutes. The scheduling module was set up from a spreadsheet that says 22 minutes, because that's what the operators actually see after setup and deburring.

The material plan promises the bracket on Thursday. The schedule says Monday. Both modules are working correctly on their own data, and the planner spends an hour every week explaining why. The fix isn't a better algorithm. It's one agreed time, owned by one person, and stored in one place that both modules read.

## How do you grow without redoing everything?

Growth usually means more products, more shifts, a second line or another site. Plan for it in four ways.

- **Keep the planning horizons clear.** Microsoft states that master scheduling typically covers one week to six months and, in most companies, extends to the longest cumulative lead time of the products involved. Know which module owns which horizon, so a short-term schedule isn't mistaken for the long-term plan.
- **Plan the second site on paper first.** Microsoft's documentation lists intercompany planning as a separate process that connects demand and supply across legal entities. If you expect a second plant, ask how your candidate handles that.
- **Prefer configuration to custom code.** Every custom rule is something you must retest at each upgrade.
- **Check how the run behaves with more data.** According to Microsoft, plans created with Planning Optimization are regenerative, meaning they update all requirements instead of only changed ones. Ask any vendor how long a full planning run takes at twice your current volume.

## How do you choose and test a vendor?

Questions that work for any module:

1. Which data does this module read and write, and from which system?
2. What happens to the plan when a rush order, a machine breakdown or a missing worker arrives? Can a planner re-plan without a specialist?
3. Can a planner see why the module placed an order where it did? Black-box plans are hard to defend in a shop floor meeting.
4. How are upgrades handled, and who tests the interfaces afterwards?
5. What does the next module cost to connect, not only to license?
6. Can you export the plan and the master data in a usable format?

Then run a pilot. Take one product family and two weeks of real orders. Plan them in the candidate module, plan them the way you do today and compare the results against what actually happened. Record the effort too: how many manual corrections, and how many hours of preparation.

## Common mistakes

- **Buying all modules at once.** You can't tell which one helped, and the data work lands in one big lump.
- **Starting with a module that doesn't match the symptom.** A finite scheduler on bad bills of materials gives precise nonsense.
- **Two copies of master data.** The modules drift apart and nobody trusts either.
- **Ignoring the people layer.** Planners need to see why a plan looks the way it does, or they'll override it.
- **No owner for the interfaces.** When an upgrade breaks one, nobody is responsible.
- **Planning for today's volume.** Ask about the next product family or the next shift model before you sign.

## Where Polaris fits

If you'd like a planning stack that is built from modules, iFAKT Polaris is one to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) presents [Polaris](https://www.m365.fm/entity/polaris/) as production software that combines ERP data with a digital twin of manufacturing, organized in seven modules. The [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) builds a product-process-resource knowledge graph as the shared source of truth. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) generates production plans under constraints such as resources, shifts, zones, qualifications and capacities. Try it on one product family, with your own data, as you would with any other candidate.

## Related topics to explore

- **Master data quality.** Who owns routings and bills of materials, and how errors get corrected.
- **Finite versus infinite capacity planning.** When a material plan is enough and when it isn't.
- **Planning horizons and frozen zones.** How far ahead each layer plans, and when the schedule stops changing.
- **Scenario planning.** How to compare two plans before you commit.
- **Multi-site planning.** What changes when demand and supply are shared between plants.

## Next step

Modular production planning software pays off when you choose the module by symptom. Write down the single biggest planning problem in your plant, find which layer it belongs to, and ask two vendors to show how that module works on one of your own product families.
