---
title: "Data-Based Value Stream Mapping: Use ERP Data Instead of Stopwatches"
summary: "Digital value stream mapping builds the map from ERP and shop-floor data. See which data you need, the steps, its limits and a worked example for managers."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, enterprise-resource-planning, manufacturing-execution-system, value-stream-mapping]
keypoints:
  - "Digital value stream mapping builds the map from recorded data, such as orders, routings, stock and production feedback, instead of from a stopwatch and one day of observation."
  - "A classic map is a snapshot. Data shows how times and stock vary from order to order, which a single walk cannot show."
  - "ERP data usually gives demand, orders, routings and stock. Shop-floor systems add actual start and end times and quantities per operation."
  - "Data is only as good as the bookings behind it. Walk the flow to check what the numbers mean before you trust them."
  - "Use data to find where to look and to repeat the map often. Use the walk to understand why, and agree on actions with the team."
faq:
  - q: "What is digital value stream mapping?"
    a: "Digital value stream mapping builds a value stream map from recorded data, such as ERP orders, routings, stock records and production feedback, instead of from manual timing alone. It shows lead times and waiting times for many orders, not one day. It still needs a walk on the floor to check what the data means."
  - q: "What data do you need for a data-based value stream map?"
    a: "You need customer demand, orders and routings from the ERP system, stock levels for each step, and actual start and end times and quantities per operation from production feedback. Add changeover and downtime records if you have them. Check how each figure is booked, because late or batch bookings distort times."
  - q: "Can digital value stream mapping replace the gemba walk?"
    a: "No. Data shows what happened and how much it varies, but not why. The walk shows how work really flows and how people book it. Use data to choose where to look and to repeat the map often, and use the walk to check the data and find causes."
---
Digital value stream mapping builds the value stream map from recorded data instead of from a stopwatch and one day of observation. Orders, routings, stock records and production feedback give you cycle times, waiting times and stock for many orders at once. This guide is for plant managers who have ERP data and want to know how far it can replace manual mapping. It explains what data you need, how to build the map step by step, what a worked example shows and where data alone misleads.

## Why do stopwatches and snapshots fall short?

[Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) is a method of lean process mapping. It draws the flow of materials and information that bring a product or service to the customer, usually one product family at a time. A plant has several value streams, one for each family, and each one needs its own value stream map. The classic method works well on the floor, but it has limits. The Institute of Production Management, Technology and Machine Tools (PTW) at TU Darmstadt lists them on its page about the [data-assisted value stream method](https://www.ptw.tu-darmstadt.de/forschung_ptw/cip/abgeschlossene_projekte_1/datengestuetzte_wertstrommethode/index.en.jsp):

- The value stream map is static. It rests on snapshots and estimates and does not capture variability.
- Recording times, inventories and key figures by hand makes it very time-consuming to repeat the mapping.
- The modelling language suits simple linear flows, so branched flows and several product families are hard to capture.
- Choosing the process steps and recording correct data depends on the user's experience.

PTW also reports from its first industrial projects that customer demand, the volume share of a product family and the machine allocation for shared resources were each corrected by more than 20 percent compared with the experts' first estimates. That is a result from a research project and may not match your plant. It does show that estimates deserve a check against data.

Manual mapping has another weakness. Christoph Roser of AllAboutLean warns that if you only ask employees, you get the ideal state and not reality, and the deviations from the standard are what matter. He recommends that you draw the current state on the shop floor and verify the information yourself. His article [Practical Tips for Value Stream Mapping](https://www.allaboutlean.com/vsm-pitfalls/) also points out, in a reader comment, that data from the walk should be checked against MES or other reporting systems. The check works both ways: data tests the walk, and the walk tests the data.

## What is digital value stream mapping, and which data does it use?

Digital value stream mapping, also called data-driven or data-based VSM, creates the value stream map from records in your systems. PTW describes how transaction data can build product-process matrices, and how production feedback and event data allow process mining. Process mining reconstructs actual process flows and derives metrics such as throughput, processing and waiting times. A 2026 paper by Paryanto, Faizin and Franke in the *Journal of Manufacturing and Materials Processing*, [Improving Manufacturing Line Design Efficiency Using Digital Value Stream Mapping](https://cris.fau.de/publications/361160193), proposes a framework with real-time operational data instead of static, manually aggregated data.

Two kinds of system supply most of the data:

- **[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) (ERP).** Business software that connects purchasing, inventory, orders and related transactions across an organization. It usually holds demand, orders, routings and stock.
- **A [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) (MES).** Shop-floor software that records production activity against work orders and operations, such as the actual material consumed at a station. It supplies actual times and quantities.

As a rule of thumb, which is my own mapping and not a rule from the sources, the data fills the value stream map like this:

- **Customer box:** demand per day or week from order history.
- **Product family:** orders that share routings and equipment.
- **Process boxes:** operations from the routings.
- **Data boxes:** cycle time, processing time and changeover from production feedback.
- **Inventory triangles:** stock records, turned into days of stock by dividing by daily demand.
- **Information flow:** how orders and schedules are released to the floor.

## How do you build a data-based value stream map step by step?

1. **Choose the product family and the period.** Take enough weeks to cover normal variation, and avoid holiday weeks.
2. **Extract the data.** Pull orders, routings, stock and production feedback for that family. One of the best practices is to keep the raw export so you can trace every figure.
3. **Clean the data.** Remove test orders, duplicates and obvious booking errors. Ask the people who book the data what each field means.
4. **Calculate the metrics.** Compute processing time, wait time and lead time per order. Report the median and the range, not only the average.
5. **Draw the map.** Put the numbers into the usual data boxes and timeline. Create a value stream map you can read in one minute, and keep the extract as a repeatable workflow so that you can update it each month.
6. **Walk the flow.** Check the value stream map against the floor. Count the stock yourself at two steps and watch several cycles.
7. **Agree on actions.** Draw the future state, choose the biggest gaps, set measurable targets, assign owners and repeat the value stream map after the change. Share it with stakeholders in production, planning and logistics.

## Example: what a stopwatch and the data say about one step

This is an illustrative example with made-up numbers, not a measured case. A plant manager maps one product family. Demand is 280 units per day, and one working day has 25,200 seconds, so takt time is 25,200 ÷ 280 = **90 seconds**.

**The stopwatch.** On the walk, the team times the welding station: **85 seconds** per unit, from an experienced operator on a good day. That is below takt time, so welding looks fine.

**The data.** The production feedback for four weeks shows an average of **98 seconds** per unit. It includes short stops, rework loops and slower shifts that nobody saw on the walk day. At 98 seconds, welding makes 25,200 ÷ 98 = about 257 units per working day. Demand is 280, so the shortfall is about 23 units per day, or 8 percent. Welding is above takt time, and it is the bottleneck.

**The waiting time.** The walk found 2 days of stock in front of welding. The order records for ten orders show these waits in days: 0.5, 0.5, 1, 1, 1.5, 2, 2, 2.5, 3 and 6. The sum is 20, so the average is 2 days, and the median is 1.75 days. One order in ten waited 6 days. A customer remembers the 6-day order, not the average, so the range matters as much as the mean.

The lesson: the stopwatch and the walk gave a plausible picture, and the data showed two things they missed. Waiting is the main inefficiency in this flow, and the stock behind it is a sign of overproduction upstream. The data also tells you where to look: welding, and the orders that wait the longest. The walk then tells you why.

## What are the limits of data-based mapping?

Data is a record of what people booked, and bookings are not always the same as events. Operators may book a whole batch at the end of a shift, so start times and end times show the booking, not the work. Stock records may lag behind the floor. Some operations may have no booking at all, such as moves between buildings. Waiting often hides in places where nobody books anything.

Data also says nothing about why. It does not tell you that the operator walks 40 metres for cartons or that a fixture is hard to clamp. For this, you still need the gemba, the place where the work happens. Treat data as a guide to where to look first and as a way to repeat the value stream map often, and treat the walk as a way to understand. Use both to identify waste and to choose a kaizen step, which is a small change in continuous process improvement. The aim is to optimize the flow, not to produce a perfect map. When you run both, each corrects the other.

## Common mistakes

- **Trusting the data blindly.** Find out how each field is booked and when. Late and batch bookings distort cycle times.
- **Skipping the walk.** A map built only at a desk shows what the systems record, not what the plant does.
- **Using averages only.** One long wait can hide behind a good average. Show the median and the range.
- **Mapping every family at once.** Start with one product family and extend later.
- **Forgetting the information flow.** Data shows how material moved. You still need to ask how schedules and orders reach the floor.
- **Buying a tool before cleaning the data.** A tool shows wrong numbers faster. Fix the bookings first.

## How software can help

Extracting, cleaning and joining data by hand takes time, and it must be repeated. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Whatever tool you use, check how the data is booked, and compare the first map with what you see on the floor.

## Next step

List the systems that hold demand, routings, stock and production feedback for one product family, and ask who books each figure and when. Then try digital value stream mapping on that family for four weeks of data, and walk the flow to check the result.
