---
title: "Value Stream KPIs: 12 Metrics to Manage Flow, Not Departments"
summary: "Twelve value stream KPIs that show flow, not department output: lead time, on-time delivery, first pass yield, inventory days and more, with a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-analyzer, oee]
keypoints:
  - "Value stream KPIs measure the flow of one product family from order to delivery, so they replace department targets that can improve while the stream gets worse."
  - "Mike Orzen names four value stream level metrics: percent complete and accurate, value stream cycle time, order fulfilment rate and returns."
  - "The twelve KPIs here cover speed, reliability, quality, inventory and equipment; pick three to five for the board, not all twelve."
  - "First pass yield is good units out divided by units in; multiplied across steps it gives the rolled throughput yield."
  - "Write down the formula, the data source and the owner of every KPI before it goes on the board."
faq:
  - q: "How many KPIs should a value stream have?"
    a: "Three to five is enough for the board of one value stream. Too many KPIs turn the weekly review into a reading exercise. Choose one measure each for speed, delivery, quality and inventory, and add an equipment measure only for the constraint. Keep the longer list in the background for root cause work."
  - q: "What is the difference between a value stream KPI and a department KPI?"
    a: "A value stream KPI describes the flow of one product family from order to delivery, such as lead time or on-time delivery. A department KPI describes one function, such as machine utilisation. Department KPIs can improve while the stream gets slower, because waste often moves to the next department."
  - q: "How do I calculate first pass yield?"
    a: "First pass yield is the number of good units leaving a process divided by the number of units entering it. A step that receives 100 units and passes 95 good ones the first time has a first pass yield of 95 percent. For several steps in series, multiply the yields to get the rolled throughput yield."
---

Value stream KPIs measure the flow of one product family from customer order to delivery. They tell you whether the whole stream gets faster, more reliable and cleaner, and they do not reward a single department for a local gain. This article is for operational excellence managers who need a short, defensible list. It gives twelve metrics with simple formulas, a worked example, advice on how many to show, and the mistakes that make KPIs misleading.

## Why do value stream KPIs differ from department KPIs?

Mike Orzen, writing for the Lean Enterprise Institute (LEI), argues that [local improvements](https://www.lean.org/the-lean-post/articles/the-mythical-value-stream-manager) do almost nothing to improve value stream performance and often hurt the flow of the same stream. His example is a document control team that cut its own processing time from days to minutes by shifting work to the departments it served.

He names four value stream level metrics: percent complete and accurate, value stream cycle time, order fulfilment rate and returns. The article does not define them in detail, so write your own definitions and keep them stable.

The importance of value stream KPIs is simple: they help you create value around the whole stream, not around one team. A good value stream KPI has four properties:

- It covers the whole stream, from order to delivery.
- It has one written formula and one data source.
- It has an owner who can act on it.
- It is shown as a trend, not as one number.

The international standard ISO 22400-2 shows how formal this can get. It [defines KPIs for manufacturing operations management](https://www.iso.org/standard/54497.html) by their formula, the elements in the formula, their time behaviour and their unit. You do not need the standard to start, but the discipline is the same.

## What are the 12 value stream metrics?

This list is my own selection. Formulas are simple working definitions. Where a source defines a metric, it is named.

**Speed**

- **1. Value stream lead time.** Days from order release (or customer order) to shipment. Take the median and the longest order, not only the average.
- **2. Value-creating share of lead time.** Value-creating time divided by lead time. It shows how much of the time is waiting.
- **3. Process cycle time against takt time.** Takt time is the pace set by customer demand: available time divided by demand. Compare each step's cycle time with it.

**Reliability**

- **4. On-time delivery.** Orders shipped on or before the promised date, divided by orders shipped.
- **5. Order fulfilment rate.** Orders delivered complete, divided by orders delivered. One of Orzen's four metrics.
- **6. Plan attainment.** Units or orders completed as planned in the period, divided by units or orders planned.

**Quality**

- **7. First pass yield.** The ISSSP defines first time yield as good units out divided by units in. Multiply the yields of steps in series for the rolled throughput yield, which makes hidden rework visible.
- **8. Percent complete and accurate.** The share of work passed to the next step that needs no correction. Orzen names it, and you must define it for your stream.
- **9. Returns.** Returned units or complaints per 1,000 shipped. Another of Orzen's four.

**Inventory and equipment**

- **10. Inventory days.** Work in process plus finished goods, divided by average daily demand.
- **11. Changeover time.** Time from the last good piece of one product to the first good piece of the next.
- **12. OEE at the constraint.** The LEI defines [overall equipment effectiveness](https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/) as availability times performance times quality, a measure of how effectively equipment is used. Use it on the bottleneck, not on every machine. See also the [OEE](https://www.m365.fm/entity/oee/) topic page on M365.FM.

## How do the KPIs connect to the map?

Value stream KPIs start with value stream mapping. On the current state map, you write the lead time, the value-creating time, the yield and the inventory at each step. On the future state map, you set a target for each KPI. This is value stream analysis: the gap between the two maps tells you which KPI to attack first.

Value stream management then keeps the numbers current in the weekly review. The KPIs show whether changes add value or only move waste, and they show how well continuous improvement works. If lead time falls and on-time delivery rises, the flow of value improves. Aim at the optimization of the whole flow, not of one workflow step. When the KPIs show that the stream has changed, update the map.

## How many KPIs should you show?

Three to five. The twelve are a menu, not a dashboard. Pick one from each group that matters most for your stream:

- **Speed:** lead time.
- **Reliability:** on-time delivery.
- **Quality:** rolled throughput yield or percent complete and accurate.
- **Inventory:** inventory days.
- **Equipment:** OEE at the constraint, if equipment is the limit.

Keep the rest as diagnostic measures that you open when a main KPI moves in the wrong direction.

## Example: reading one stream, hypothetical numbers

This example is invented. The numbers are not from a real plant.

A stream shipped 200 orders last month. 176 arrived on time, so on-time delivery is 176 divided by 200, or 88 percent. 190 orders were complete, so order fulfilment is 95 percent.

Three process steps have first pass yields of 97, 96 and 95 percent. The rolled throughput yield is 0.97 times 0.96 times 0.95, which is 0.885, or about 88.5 percent. So roughly 11.5 in 100 units need rework or are scrapped somewhere along the stream, even though each step looks fine alone.

Lead time is 12 days and value-creating time is 0.5 days, so the value-creating share is 0.5 divided by 12, about 4 percent. Work in process and finished goods hold 1,800 units against a daily demand of 120 units, which is 15 days of inventory.

The team picks five KPIs for the board: lead time (12 days), on-time delivery (88 percent), rolled throughput yield (88.5 percent), inventory days (15) and plan attainment. The first action is to find out why 24 orders were late, since late orders and long inventory point at the same queues.

## How is this different for agile software teams?

Software organisations also use value stream metrics, often in agile and scaled agile settings. They separate an operational value stream, which delivers a product or service to a customer, from a development value stream, which builds the product. Their metrics follow work items through a delivery framework and look at dependencies between teams. Some scaled agile frameworks add release trains and portfolio management on top, to give large organisations more agility; check each framework's own documentation for the details. The wish to deliver value faster, and the focus on flow, is the same as in a plant. These are the two main types of value streams in that world. In software development, scrum teams track a backlog, and the dependency between teams often limits value delivery. Process mapping of those dependencies is the software counterpart of a plant map. The data differs, so do not copy plant KPIs such as inventory days into a software backlog.

## Common mistakes

- **Using department KPIs as stream KPIs.** Machine utilisation of one cell says little about the stream.
- **Showing too many KPIs.** Ten numbers hide the one that matters.
- **No written formula.** Two people calculate on-time delivery in two ways, and the trend is meaningless.
- **Averages only.** One long order can hide behind a good average.
- **Measuring without an owner.** A KPI nobody can influence becomes decoration.
- **Ignoring rework.** Yield per step hides the hidden factory; look at rolled throughput yield.

## How software can help

Value stream KPIs need data from several places: orders from the ERP system, quantities from the shop floor, quality records and delivery dates. Collected by hand, this takes hours each week. A KPI tool that reads these sources and shows planned against actual values saves that time and keeps the definitions the same every week.

iFAKT's [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) is a module of iFAKT Polaris with KPI dashboards across all modules that compare planned and actual values in production. Check any tool against your own formulas first.

## Next step

Value stream KPIs work when they are few, written down and tied to the whole flow. This week, pick three KPIs from the list for one product family, write the formula and data source for each and put the first trend on the board.
