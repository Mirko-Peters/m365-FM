---
title: "Product Mix Planning in Manufacturing: Decide What to Make"
summary: "Product mix planning in manufacturing decides what to build, how much and in which pattern when capacity is limited. Learn the method, the checks and the traps."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [manufacturing, factory-simulation, dynamics-365, power-bi, polaris-simulator, polaris-optimizer, ifakt]
keypoints:
  - "Product mix planning decides what to build, how much and in which pattern when one scarce resource, usually a bottleneck, cannot cover all demand."
  - "Rank products by contribution per hour of the scarce resource, not by contribution per unit, and cap each product at its demand."
  - "Lean.org defines heijunka as leveling the type and quantity of production over a fixed period, and shorter changeovers make a mixed pattern affordable."
  - "In Dynamics 365 master planning, you choose how actual orders consume forecast, so check that method before you read the planned mix."
  - "Test a mix change against the bottleneck's detailed schedule before you commit, because a weekly load view can look fine while a daily plan fails."
faq:
  - q: "What is product mix planning in manufacturing?"
    a: "It is the process of deciding which products to make, in what quantities and in what pattern over time, given limited capacity, material and people. The aim is to meet demand and delivery dates while getting the most from the scarce resource. It links sales forecasts, margins, changeovers and the production schedule."
  - q: "How do you decide the best product mix when capacity is limited?"
    a: "Find the scarce resource, usually the bottleneck. Calculate each product's contribution per hour of that resource, rank the products from highest to lowest, and allocate hours down the list until they run out, never exceeding a product's demand. Then check customer commitments and changeover effects before you accept the result."
  - q: "How often should you review the product mix?"
    a: "Review it on a regular rhythm, for example monthly for volume and mix decisions and weekly for the detailed schedule, and again whenever demand, capacity or material changes sharply. The right rhythm depends on your lead times and how often orders shift. Write the rhythm down so that changes follow a routine, not a panic."
---

Product mix planning in [manufacturing](https://www.m365.fm/entity/manufacturing/) means deciding which products to build, how much of each, and in what pattern over time, when your capacity can't cover everything customers want. The decision usually comes down to one scarce resource, often a bottleneck machine, and to how well you use its hours. This article is for production planners who need a method they can run with their own numbers, and who want to avoid the two classic traps: chasing the highest margin per unit and ignoring changeovers.

## What is product mix planning in manufacturing, and what do you decide?

Three decisions sit under the one label, and mixing them up causes most of the confusion.

1. **The volume mix.** How many units of each product do you commit to in a period? This matters when demand exceeds capacity.
2. **The pattern.** In what order and rhythm do you build the products? One long run of each, or a repeating mix? This decides inventory, lead time and changeover load.
3. **The reaction to change.** What do you do when orders shift toward other variants, a machine goes down or material arrives late?

Each decision needs different information. The first needs product economics and bottleneck hours. The second needs changeover times and demand rhythm. The third needs a way to test options quickly. The sections below take them in that order.

## How do you decide the mix when capacity is short?

Start by finding out whether anything is short. Compare the hours of the scarce resource that full demand needs with the hours available. If demand fits, there's no mix problem at this level, and you can plan to demand. If it doesn't fit, you need a rule for rationing.

A common rule is limiting factor analysis, described in an [accounting study guide](https://opentuition.com/cima/cima-p1/notes/cima-p1-5-limiting-factor-analysis-and-throughput-accounting/): calculate contribution per unit, divide it by the scarce resource used per unit, rank products from highest to lowest and allocate the resource down the ranking, capping each product at its maximum demand until the resource runs out. The guide notes that with two or more scarce resources at once, you need linear programming instead.

Here is a hypothetical example, invented only to show the arithmetic. A bottleneck has 400 hours this month. Three products compete for it:

- **A:** contribution $60 per unit, 3 hours per unit, demand 60 units. That's $20 per hour.
- **B:** contribution $45 per unit, 1.5 hours per unit, demand 100 units. That's $30 per hour.
- **C:** contribution $90 per unit, 5 hours per unit, demand 40 units. That's $18 per hour.

Full demand needs 180 + 150 + 200 = 530 hours, so the bottleneck is short by 130 hours. Ranking by contribution per unit puts C first, and the plan gives C its 40 units (200 hours) and A its 60 units (180 hours). Only 20 hours are left for 13 units of B. Total contribution: $3,600 + $3,600 + $585 = $7,785.

Ranking by contribution per bottleneck hour reverses the order: B first (100 units, 150 hours), then A (60 units, 180 hours), then C with the 70 hours left, which is 14 units. Total contribution: $4,500 + $3,600 + $1,260 = $9,360. Same plant, same hours, $1,575 more, only because the ranking used the scarce resource as the yardstick.

Two warnings before you use this on real data.

**Costs depend on your assumptions.** The same study guide shows that treating only direct material as variable (throughput accounting) can produce a different ranking from treating labor as variable too. Each plan is best only under its own assumption, so pick the cost view with finance and use it consistently.

**The ranking isn't the whole decision.** Customer commitments, contracts, strategic products, minimum lot sizes and quality requirements all limit what you can drop. Use the ranking to see what a commitment costs, then decide with sales whether to keep it.

## How do changeovers shape the pattern?

The ranking tells you how much of each product. It says nothing about the sequence. That is where changeovers decide.

Lean.org defines [heijunka](https://www.lean.org/lexicon-terms/heijunka/) as leveling the type and quantity of production over a fixed period of time. According to the page, leveling lets production meet demand without batching and reduces inventory, capital cost, manpower needs and lead time along the value stream. It also covers the type of product: instead of building all of model A, then all of B, a lean producer interleaves the models in a repeating pattern and cuts changeover times to make that practical. The sequence is adjusted periodically as orders change.

The consequence is straightforward. A mixed pattern needs short changeovers. [SMED](https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/), single minute exchange of die, is the method for that: Lean.org describes it as changing equipment from one part number to another in as little time as possible, with the target of a single-digit number of minutes, by separating internal setup (done with the machine stopped) from external setup (done while it runs) and moving tasks from the first group to the second. That target is a goal, not a promise for every machine.

When you plan the pattern, ask three things:

- How long is the changeover between each pair of products, in both directions? Some pairs cost far more than others.
- What does a longer run cost in inventory and lead time?
- Which products can share a run without a costly changeover?

If changeovers are long, the right mix pattern is bigger batches, and the right investment is setup reduction. Work on setup time before you try to change the pattern.

## How do you plan the mix from forecasts and orders?

Most plants plan from a mixture of forecast and actual orders. The danger is double counting: planning the forecast and the orders on top of it.

[Dynamics 365](https://www.m365.fm/entity/dynamics-365/) shows how this is handled in an ERP system. In [Planning Optimization master planning](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/demand-forecast), you choose whether the forecast is included and a method for reducing forecast requirements by actual demand. The documented options are none, percent by reduction key, transactions by reduction key and transactions by dynamic period. With "none", planned orders cover the full forecast and sales orders add separate planned orders on top. With the transaction methods, actual orders consume the forecast within a period. Excess orders carry to neighboring periods under the reduction-key method but not under the dynamic-period method. Pick the method on purpose, and test it on one product family with a known history.

Beyond the setting, some habits help in any system:

- Plan the mix at product-family level first, then break it down into variants as the date comes closer.
- Keep forecasts and orders visible side by side, with the version and date, so you can see how a forecast changed.
- Agree on a regular review where sales, planning and production look at the same numbers. Monthly for the volume mix and weekly for the detailed schedule is one workable rhythm, but your lead times should set it.

## How do you react when the mix changes?

Mix changes are normal. A customer shifts orders from one variant to another, a bottleneck loses a shift, or a material runs late. A small routine keeps you from improvising.

1. **Check the bottleneck first.** What does the change do to its hours, not to the total plant load?
2. **Check changeovers.** A shift toward more variants usually means more changeovers, and so fewer productive hours.
3. **Copy the plan and apply the change.** Compare the new plan with the baseline, one change at a time.
4. **Look at the daily schedule, not only the weekly load.** A weekly view can look fine while one day is infeasible.
5. **Decide and write down why.** Include what you'll tell customers and which orders move.
6. **Freeze what you've decided.** Define how far ahead the plan may not change without approval.

When the interactions get complex, such as shared machines, sequence-dependent setups and shifts, a spreadsheet gets hard to trust. That's the point at which a [factory simulation](https://www.m365.fm/entity/factory-simulation/) or a finite scheduling tool starts paying for itself, because it can run the changed mix through the whole line and show where the queue builds.

## Which measures show whether the mix works?

Pick a few and track them over time:

- Bottleneck utilization, split into productive time, changeover time and idle time.
- Contribution per bottleneck hour, by product and by month.
- On-time delivery by product family.
- Inventory of finished goods and work in process.
- Share of orders changed inside the frozen window.

A [Power BI](https://www.m365.fm/entity/power-bi/) report on top of your ERP data can show these side by side for planners and managers. Keep the definitions written down so the numbers mean the same thing in every meeting.

## Common mistakes

- Ranking products by contribution per unit when one resource is the real limit.
- Ignoring demand caps and planning more of a profitable product than customers want.
- Treating the ranking as final without checking commitments to customers.
- Planning forecast and orders on top of each other because the reduction method wasn't checked.
- Looking at weekly capacity only and finding the daily conflicts on the floor.
- Leaving changeover times out of the mix decision.
- Changing the mix every day with no frozen window.
- Using cost data that nobody has checked for a year.

## Where Polaris fits

If your mix keeps changing on shared resources, a simulation can show what each change does before you commit. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, working with ERP data. The [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) module tests the production system virtually and handles dynamic product mixes on shared resources, along with capacity, staffing and buffer scenarios, to show bottlenecks and utilization imbalances over time. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module turns the model into an optimized plan under constraints and re-optimizes when disruptions occur. Try it on one product family and one bottleneck first, and compare the results with your own calculation.

## Related topics to explore

- **Changeover reduction:** how SMED-style analysis frees bottleneck hours before you touch the mix.
- **Forecasting at family level:** why you plan families first and variants later.
- **Margin per bottleneck hour:** agreeing on a cost view with finance and using it consistently.
- **Scenario planning for demand shifts:** which what-if cases to prepare for mix swings.
- **Linking sales and operations:** a simple monthly routine where sales, planning and production review the same numbers.

## Next step

Find your scarce resource and calculate contribution per hour for your three biggest products, using the cost view your finance team agrees with. Compare that ranking with your current product mix planning in manufacturing, and note any product that takes more bottleneck time than it earns.
