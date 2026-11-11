---
title: "Reducing Work in Progress (WIP) in Manufacturing"
summary: "To reduce work in progress, cut batch sizes, cap WIP with kanban and release work at the bottleneck pace. A guide for production managers with a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-optimizer, value-stream-mapping, kanban]
keypoints:
  - "Work in progress is material that has started but is not finished. On average, lead time equals work in progress divided by throughput, so less of it means shorter lead time."
  - "Excess inventory usually comes from large batches, uneven release of work and long waits in front of the bottleneck."
  - "Count work in progress by location first. A value stream map shows where work waits and for how long."
  - "Four levers reduce WIP: smaller batches, a WIP cap such as kanban, release at the pace of the bottleneck and shorter changeovers."
  - "Lower WIP exposes problems that stock used to hide, so be ready to fix quality and machine reliability."
faq:
  - q: "What is WIP in manufacturing?"
    a: "WIP, or work in progress, is material and parts that have entered production but are not yet finished goods. It sits between process steps, in queues in front of machines and inside machines. It is counted in units, orders or value. High WIP ties up cash and floor space and lengthens lead time."
  - q: "How do you calculate lead time from WIP?"
    a: "Use Little's law: average lead time equals average WIP divided by average throughput. If 600 units are in the system and 100 units leave per day, the average lead time is six days. The law holds for long-run averages of a stable system, not for a single order."
  - q: "Is zero WIP possible?"
    a: "No, and it is not the goal. Every process needs some work in process to keep machines busy and flow smooth. Lean systems aim for the minimum amount needed, called standard work-in-process. The target is a fixed, small and visible level, not an empty floor."
---

Work in progress, or WIP, is material that has started production but is not yet a finished product. To reduce work in progress, you cut batch sizes, set an upper limit on how much work may enter a step, release orders at the pace of the bottleneck and shorten changeovers. This article is for production managers who see parts piling up between machines. It explains how to measure WIP, why it grows and how to bring it down without starving the line.

## Why does work in progress matter?

WIP is not harmless stock. It ties up cash, takes floor space and hides problems. Most of all, it makes lead time longer. A part that waits is not being made.

The link between WIP and lead time is a simple rule. John Little proved it in 1961, and it is now called Little's law. In a [retrospective paper](https://people.cs.umass.edu/~emery/classes/cmpsci691st/readings/OS/Littles-Law-50-Years-Later.pdf) written for its 50th anniversary, it is stated as L = λW. L is the average number of items in the system, λ is the average arrival rate of items and W is the average time an item spends in the system. For a plant, read it this way:

**Average lead time = average WIP ÷ average throughput**

Throughput is the number of units that leave the process per unit of time. If it stays the same, halving the work in progress halves the average lead time. If the inventory stays high, lead time stays high, whatever the plan says. The law describes long-run averages. It does not predict the time for one order.

## What counts as WIP, and how do you measure it?

The Lean Enterprise Institute lexicon [defines work-in-process](https://www.lean.org/lexicon-terms/work-in-process/) as items of work between processing steps. It adds that in lean systems, standardized work-in-process is the minimum number of parts, including units in machines, needed to keep a process flowing smoothly. So the goal is a small, fixed amount, not zero.

To measure WIP:

1. **Define the boundary.** Choose a start point, such as material release, and an end point, such as packing. Count everything between them.
2. **Count by location.** Walk the floor and count units or orders in each queue, machine and buffer. Note the date and time.
3. **Count in the same unit each time.** Use pieces, containers or orders. Do not mix them.
4. **Repeat on several days.** A single count can be unusually high or low.
5. **Divide by throughput.** Use the number of units that left the process per day to get the average lead time.

A value stream map makes this visual. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) shows the queues between process steps, with the quantity waiting at each. You see at once where work waits the longest.

## Why does work in process build up?

Look for these usual causes:

- **Large batches.** A part waits for the rest of its batch to finish at each step. A batch of 200 means 199 parts wait while one is worked.
- **Releasing too much work.** Orders go to the floor when material arrives or when the plan says so, not when the line has room.
- **Waiting in front of the bottleneck.** Every step upstream of the constraint can run faster than the constraint. The excess piles up in front of it.
- **Long changeovers.** When setups take hours, planners group jobs in large lots to avoid them.
- **Quality loops.** Rework and inspection hold parts back.
- **Missing parts.** Orders that are started without complete material wait on the floor.

Several of these feed on each other. Large batches come from long changeovers, and large batches build queues.

## How do you reduce WIP? Four levers

**1. Cut batch size.** Move parts in smaller lots, or move one piece at a time where possible. Smaller batches wait less. They need shorter changeovers, so these two actions go together.

**2. Cap WIP with a pull signal.** A kanban is, in the Lean Enterprise Institute's words, a [signal device](https://www.lean.org/lexicon-terms/kanban/) that gives authorization and instructions for the production or withdrawal of items in a pull system. The simplest form is one card per container of parts. Without a free card, the upstream step does not produce. This sets a hard upper limit on WIP between two steps. It is the simplest way to limit WIP. You can set the first limit with Little's law, turned around: WIP limit = target lead time × throughput. If you want a lead time of 3 days at 100 parts per day, the limit for the whole process is 300 parts. Divide it between the steps, with the larger share in front of the bottleneck. Then lower it step by step. These WIP limits work for any kind of flow, whether the cards are paper, bins or electronic signals.

**3. Release work at the pace of the bottleneck.** Do not feed the first step faster than the constraint can process. Release orders on a fixed rhythm that matches the bottleneck's capacity. Work waits in the order book, where it costs nothing, instead of on the floor. Prioritize the oldest and most urgent orders when you release, so the delay for any one order stays short.

**4. Shorten changeovers and fix reliability.** Quick changeover and preventive maintenance let you run smaller lots with less buffer.

Do these in small steps. Take out a modest share of the inventory, watch what happens, then take out more.

## How do you visualize WIP and limit it on a board?

Put the flow on a kanban board at the cell. Use one column per process step and one card per order in progress. Counting the cards in each column gives you the WIP metric at a glance. Write the WIP limit at the top of each column, so the team can limit WIP without a meeting. When a column is full, the team stops starting new work and helps to finish what is open. This focus on finishing, not starting, shortens cycle time and reduces the delay between steps, so it helps to improve flow. A physical board is enough to start. It makes the workflow visible to the whole team and shows the supervisor where work waits. The same board idea is used by agile software teams, but a plant adds physical limits such as floor space and containers. Review the numbers each week as a productivity and lead-time metric, and lower the limit only when the flow is stable.

## Example: cutting work in progress in a machining cell

This is an illustration with made-up numbers.

A cell finishes 100 parts per day. A count on three days shows an average of 600 parts between release and packing. Average lead time is 600 ÷ 100 = 6 days.

The team finds that parts wait in front of the heat-treatment step, which is the bottleneck, and that upstream steps work in batches of 120.

- They cut the batch size at the first two steps from 120 to 60.
- They place a limit of 150 parts in the queue in front of heat treatment and add a signal: when the queue is full, upstream steps stop.
- They release new orders once per shift at the rate heat treatment can process.

After the change, the count shows an average of 300 parts at the same throughput of 100 per day. Average lead time is now 300 ÷ 100 = 3 days. The cell has not produced more. It has delivered the same output in half the time and has freed floor space. The team then keeps lowering the queue limit, watching that heat treatment never runs empty.

## What happens when you lower WIP?

Lower WIP makes problems visible. A buffer of 600 parts covers a machine that breaks down for an hour. A buffer of 300 does not. This is the point: the problem was always there and the buffer hid it.

Prepare for this. Before you cut the limit, ask which stops are likely: breakdowns, missing material, quality defects. Assign an owner to the biggest one. Treat each stop as a cause to remove through [kaizen](https://www.m365.fm/entity/kaizen/) or a similar improvement routine. Keep the WIP limit stable until the stop is fixed, then lower it again.

## Common mistakes

- **Cutting work in progress everywhere at once.** The line starves and people lose faith. Change one cell at a time.
- **Starving the bottleneck.** Cutting inventory in front of the bottleneck loses plant output. Keep a small protected buffer there.
- **Treating inventory as an accounting number.** The goal is a shorter lead time, not a better balance sheet.
- **Counting once.** One count shows nothing about the average. Count on several days.
- **Hiding inventory.** Moving parts to a corner or a warehouse does not remove them.
- **Skipping the causes.** If batches stay large and changeovers long, the WIP returns.

## How software can help

A manual count shows work in progress at one moment. A plan that respects capacity, material and shifts can keep it low by design, because it does not release more work than the plant can finish. iFAKT's [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. Whatever tool you use, compare the plan with the actual WIP on the floor each day.

## Next step

Count the work in progress in one cell on three different days, and divide the average by daily throughput to find your current lead time. Then pick one lever from this article and use it to reduce work in progress in that cell by a fixed amount you can check.
