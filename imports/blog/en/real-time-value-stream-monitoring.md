---
title: "Real-Time Value Stream Monitoring With ERP and MES Data"
summary: "A real-time value stream shows lead time, queues and WIP from live ERP and MES data. See which data each system gives, how fresh it must be and how to build it."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, manufacturing-execution-system]
keypoints:
  - "A real-time value stream refreshes lead time, queue time and work in process from live system data, so the map no longer ages on a wall."
  - "ERP supplies orders, routings, stock and costs at order level; MES supplies what happened at each operation, with timestamps, quantities and downtime."
  - "How fresh the data must be depends on the decision: minutes for dispatching, daily for the review, weekly for the trend."
  - "Time stamps at release, start and end of each operation are enough to calculate queue time, processing time and lead time per order."
  - "Late or manual bookings make a live map wrong; check the data against the floor before you trust the numbers."
faq:
  - q: "What is a real-time value stream?"
    a: "A real-time value stream is a value stream map whose numbers, such as lead time, queue time and work in process, are refreshed from live data in your ERP and shop floor systems. It shows the current state of a product family without a manual count. Real time here means fresh enough for the decision, often minutes to a day, not milliseconds."
  - q: "Which data comes from ERP and which from MES?"
    a: "ERP supplies orders, routings, stock and costs at order level, working in days to months. MES supplies what happens at each operation, such as start and end times, good quantities, scrap and downtime, working in minutes to shifts. ERP releases the work order to MES, and MES reports the actual results back."
  - q: "Do I need a manufacturing execution system for a live value stream map?"
    a: "Not always. If your ERP system books operation start and end times reliably, you can start there. An MES gives finer data and more reliable timestamps. Check booking discipline first: late or manual entries give a live map that is wrong. Pilot on one product family before you invest in new systems."
---

A real-time value stream is a value stream map whose numbers, such as lead time, queues and work in process, come from live ERP and MES data instead of a one-off walk with a stopwatch. This article is for plant managers who want to see the current state of a product family without waiting for the next mapping workshop. It explains which system supplies which data, how fresh the data must be, how to build the first version, and a worked example with invented timestamps.

## What is a real-time value stream?

The Lean Enterprise Institute (LEI) defines [value stream mapping](https://www.lean.org/lexicon-terms/value-stream-mapping/) as a method of seeing and understanding the flow of material and information as a product makes its way through the value stream. A paper map is a snapshot. It is valid on the day it is drawn, and the lead times change afterwards.

A real-time value stream, sometimes called a live value stream map or a view across value streams, keeps the same picture current. The boxes and the timeline are filled from production data, so you can see queues build, orders age and inventory move. The data does not have to arrive in milliseconds. It has to be fresh enough for the decision you want to take with it.

This is a data-driven value stream: the map stays the lean tool, and the data replaces the stopwatch. It does not replace the team. People still walk the flow, ask why, and decide what to change.

## How does it differ from a traditional current-state map?

A traditional current state value stream map is drawn by a cross-functional team in a workshop. They walk the process steps, record cycle time, lead time and inventory by hand, and draw the diagram of material and information flow. Then they draw a future state map and plan the changes. This is the core of lean manufacturing, and it should stay that way, because it builds shared understanding.

The live version adds a second layer. The team still draws the current and future state, but the numbers on the current-state map update from data. In a real-time view you can compare value streams, watch a bottleneck move after a change and identify areas for improvement between workshops. It supports continuous improvement, because every change shows up in the numbers. It also helps you optimize the workflow step by step, since you see the effect within days and not at the next workshop. Use the live data to ask better questions on the floor, and do not use it to replace those visits.

## Which data comes from ERP and which from MES?

Two kinds of systems usually hold the data. An independent editorial from ReliaMag, [MES versus ERP](https://reliamag.com/guides/mes-vs-erp/), says that ERP operates at the business level, answering what to make, when and at what cost, in hours, days, weeks and months, with data at order and work-order level. The MES (manufacturing execution system) answers whether what was planned is actually getting made correctly, in seconds and minutes, with data at operation, cycle and unit level. ERP releases work orders to MES, and MES reports actuals back.

A [Fabrico page on ISA-95](https://www.fabrico.io/blog/isa-95/), from an MES vendor, describes the same split in levels: business planning with ERP at level 4, manufacturing operations with MES at level 3. It also says that the business level should receive a summary, not a flood of sensor points.

For a value stream, the split is practical:

- **From ERP:** orders, due dates, routings, bills of material, stock values, customer data and costs.
- **From MES:** start and end of each operation, good quantity, scrap, rework, downtime reasons, material consumed at a station and the current location of the order.
- **From quality records:** inspection results and returns.
- **From the warehouse:** goods receipt and shipment events.

A [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) is shop-floor software that records production activity against work orders and operations. Without it, operation times are often booked by hand, late or in blocks. That does not make the map useless, but it limits how far you can trust it.

## What can you calculate from timestamps?

Four timestamps per operation are enough for most flow metrics: order release, operation start, operation end and shipment. From them you can calculate:

- **Lead time** per order: release to shipment.
- **Processing time** per operation: start to end.
- **Queue time** before an operation: the end of the previous operation to the start of the next one.
- **Work in process:** the count of orders released but not yet shipped, by operation.
- **Value-creating share:** processing time divided by lead time, as an approximation.

Quantities and scrap from MES add the first pass yield per step. Stock from ERP adds inventory days.

## How fresh must the data be?

The refresh rate follows the decision. This is my own rule of thumb, not a standard:

- **Minutes:** dispatching and shop floor reaction, for example a stopped machine.
- **Each shift or day:** the daily board and tier meeting, which look at yesterday's flow.
- **Weekly:** the stream review, which looks at the trend of lead time, delivery and inventory.
- **Monthly or quarterly:** the redraw of the map and the annual plan.

Do not push every one of your value streams to the fastest rate. Faster data costs more to build and to maintain, and a weekly decision does not need a minute-by-minute feed.

## How do you build the first version?

1. **Pick one product family** and five metrics, as a process map of the stream with its steps, such as lead time, queue time per operation, work in process, on-time delivery and first pass yield.
2. **List the events** you need and which system books them. Write the formula for each metric.
3. **Check the booking discipline.** Walk the floor and compare ten orders in the system with what happened. Fix the worst gaps first.
4. **Extract the data.** Start with a daily file or a database view. Do not build a complex interface for the first test.
5. **Show it on the map.** Fill the process boxes and the timeline from the data, and mark the largest queue.
6. **Review it weekly.** Ask whether the numbers match what the team sees. Adjust the rules.
7. **Extend step by step** to more families once the first one holds.

## Example: one order, invented timestamps

This example is invented. The times are not from a real plant, and they are calendar hours, nights and weekends included.

Order 1042 is released on Monday at 08:00. Operation 10 runs Monday 14:00 to 16:00, operation 20 runs Wednesday 08:00 to 11:00, operation 30 runs Thursday 10:00 to 12:00, and the order ships on Friday at 10:00.

Lead time is 98 hours. Processing time is 2 plus 3 plus 2, or 7 hours, so the value-creating share is 7 divided by 98, about 7 percent. The queues are 6 hours before operation 10, 40 hours between operations 10 and 20, 23 hours between 20 and 30, and 22 hours from the end of operation 30 to shipment. Together they are 91 hours, which with the 7 hours of processing makes 98.

The largest queue, 40 hours, sits in front of operation 20. When the same pattern shows across many orders, the team looks at that step: changeovers, batch size, a missing tool or a rule that releases work in a wave. The live map points to the place, and the people on the floor find the cause.

## Common mistakes

- **Trusting the numbers without checking the floor.** Late bookings turn queues into fiction.
- **Chasing real time for its own sake.** Choose the refresh rate by the decision.
- **Starting with all value streams.** One stream teaches the data problems; several value streams at once hide them.
- **Measuring averages only.** The longest orders show the real problems.
- **Building the display before the definitions.** Write formulas and owners first.
- **Dropping the routine.** A live screen does not replace the weekly review and the action list.

## How software can help

Live maps need a model of the stream and a connection to ERP and MES data. Building that with spreadsheets works for a pilot, and becomes heavy for many families. iFAKT's [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Test the data connection on one family first.

## Next step

A real-time value stream starts with trustworthy timestamps for one product family. This week, compare ten orders in your ERP or MES with what happened on the floor, and note the biggest gaps before you build anything.
