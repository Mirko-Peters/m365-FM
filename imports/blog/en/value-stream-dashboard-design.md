---
title: "How to Build a Value Stream Dashboard: Metrics, Layout and Data Sources"
summary: "Build a value stream dashboard: pick 5 key metrics, set targets, choose ERP data sources, lay out the board and review it weekly. Includes an invented example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-analyzer, visual-management]
keypoints:
  - "A value stream dashboard shows five to seven flow metrics for one product family on a single page, each as a trend against a target."
  - "Mike Orzen names four value stream level metrics: percent complete and accurate, value stream cycle time, order fulfilment rate and returns."
  - "Lay the board out in the order of the flow: speed first, then delivery, quality and inventory, with actions and owners at the bottom."
  - "Every number needs a written formula, one data source and an owner; the ERP system usually supplies orders and dates, the shop floor supplies quantities."
  - "The Lean Enterprise Institute describes andon as a tool that shows the status of an area at a single glance; a good dashboard aims for the same."
faq:
  - q: "What should a value stream dashboard show?"
    a: "It should show five to seven flow metrics for one product family: lead time, on-time delivery, first pass yield, inventory days and perhaps equipment effectiveness at the constraint. Each metric appears as a trend against a target, plus an open action list with owners and dates. Anything else belongs in a detail view."
  - q: "Where does the data for a value stream dashboard come from?"
    a: "Order dates, quantities and shipments usually come from the ERP system. Quantities, scrap and downtime come from the shop floor, by manual entry or machine data. Quality records and inventory counts add the rest. Write down the source of each metric, and check the numbers against the floor before you trust the trend."
  - q: "Should a value stream dashboard be digital or on paper?"
    a: "Start with the format your team will update and read. A paper board at the line works for a small stream. A digital dashboard pays off when data comes from several systems or when several sites share one layout. Either way, the content matters more than the screen: few metrics, clear targets, named owners."
---

A value stream dashboard is a single page that shows how one product family flows from customer order to delivery, using five to seven metrics, each as a trend against a target. This article is for plant leaders who want a board that the team reads every week and that leads to action. It covers which metrics to choose, how to lay out the page, where the data comes from, an invented example with numbers, and the mistakes that turn a dashboard into wallpaper.

## What is a value stream dashboard for?

A value stream dashboard makes the state of the flow visible. It answers three questions: is the stream getting faster, is it reliable for the customer, and where should the team act this week? It is the display of value stream management, the routine of owning and improving a value stream. The value stream map shows how the flow works. The dashboard shows whether the value stream is getting better, and it points to areas for improvement.

The Lean Enterprise Institute (LEI) describes andon as [a visual management tool that highlights the status of operations in an area at a single glance](https://www.lean.org/lexicon-terms/andon/), for example planned units against actual output. A dashboard for a whole stream has the same aim at a higher level: one look tells the reader whether the stream is on plan and what needs attention.

The importance of a good dashboard is not the screen. It is the habit: a fixed place and time where leaders look at the same few numbers and decide. In an operational value stream, the steps that deliver a product or service to the customer, this habit supports continuous improvement, because every change can be checked against the same measures. Effective value stream management also keeps the team on customer value, not on local output.

The concept of a value stream is simple. A value stream represents all the stages of the value stream from order to delivery, and each stage either adds value or does not. The benefit of value stream metrics is that they show where value added time ends and waiting begins across the entire value stream. Used well, they help the team provide value to the customer, improve value flow and remove waiting. They also keep the discussion on the state of your value stream, not on single machines or on project management detail.

## Which metrics belong on it?

Choose metrics that describe the flow of the whole value stream, not single departments. Mike Orzen, writing for the LEI, names [four value stream level metrics](https://www.lean.org/the-lean-post/articles/the-mythical-value-stream-manager): percent complete and accurate, value stream cycle time, order fulfilment rate and returns. The article does not define them in detail, so write your own formulas.

A working set of key metrics for a manufacturing stream, my own selection:

- **Lead time.** Days from order release to shipment. Show the median and the longest order. The share of that time in which work is actually done, sometimes called flow efficiency, can sit in the detail view.
- **On-time delivery.** Orders shipped on or before the promised date, divided by orders shipped.
- **First pass yield.** Good units out divided by units in, at the step that matters most for the stream.
- **Inventory days.** Work in process plus finished goods, divided by average daily demand.
- **Plan attainment.** Orders completed as planned, divided by orders planned.
- **Equipment effectiveness at the constraint.** Overall equipment effectiveness (OEE) is availability times performance times quality. Use it on the bottleneck only.

Keep to five to seven. If someone asks for a metric, ask which one it replaces. The ISO standard 22400-2, which [defines KPIs for manufacturing operations management](https://www.iso.org/standard/54497.html), shows how formal a KPI definition can be: a name, a formula, the elements in the formula and a unit. You do not need the standard to start, but the discipline helps.

## How should you lay out the page?

Lay the page out in the order of the flow, so that the eye follows the stream. A simple grid works for a board at the line or a screen:

1. **Header.** Stream name, owner, period and date of the last update.
2. **Speed.** Lead time as a trend of the last twelve weeks, with the target line.
3. **Delivery.** On-time delivery and plan attainment.
4. **Quality.** First pass yield or percent complete and accurate.
5. **Inventory and equipment.** Inventory days, and the constraint's effectiveness.
6. **Actions.** The open improvement actions, each with an owner and a due date.
7. **Signals.** A small area for current problems that need escalation.

Design rules that keep the page readable:

- **Show trends, not single values.** One number says little; a line over twelve weeks shows direction.
- **Draw the target on the chart.** The gap between the line and the target is the message.
- **Use colour sparingly.** Red for off target, green for on target, and nothing else. Never rely on colour alone, because some readers cannot tell red from green; add a symbol or a word.
- **Use the same scale every week.** A scale that changes hides the trend.
- **Keep the same layout across streams.** Leaders who move between streams then read each board at once.

This is [visual management](https://www.m365.fm/entity/visual-management/) at value stream level: a board that tells the truth about the flow in seconds, so the team can react before the next review.

## Where does the data come from?

Every metric needs a written formula, one data source and one owner. In most plants the sources are:

- **ERP system.** Order release dates, due dates, shipment dates, quantities, inventory values and routing data.
- **Shop floor.** Good quantities, scrap, downtime and cycle times, entered by hand or captured from machines.
- **Quality records.** Inspection results, rework and returns.
- **Warehouse counts.** Finished goods and work in process.

Check the numbers against the floor before you trust the trend. A routing in the ERP system often differs from the path the work really takes, and a late booking can make lead time look longer than it was. Decide who corrects errors, and how fast. A dashboard with wrong data destroys trust in the value stream numbers faster than no dashboard.

## Example: one stream, six metrics, invented numbers

This example is invented. The numbers are not from a real plant.

A plant leader builds a dashboard for a family with weekly demand of 600 units. After agreeing the formulas, the team puts the first week on the board:

- **Lead time:** 14 days (target 10), off target.
- **On-time delivery:** 89 percent (target 95), off target.
- **First pass yield at final test:** 96 percent (target 98), off target.
- **Inventory days:** 15 (target 10), off target.
- **Plan attainment:** 93 percent (target 95), near target.
- **OEE at the constraint:** 68 percent (target 75), off target.

The inventory figure comes from a simple check. Weekly demand is 600 units over five days, so daily demand is 120 units. Work in process and finished goods hold 1,800 units, which is 1,800 divided by 120, or 15 days. The first draft of the board used weekly demand in the formula and showed 3 days. The team caught the error on the floor, because the racks were clearly fuller than three days of demand. That is why the check against the floor matters.

The weekly review opens with the biggest gap: lead time of 14 days against 10, and inventory that is 5 days above target. The two are linked, since stock waiting between steps adds to lead time. The owner writes two actions with names and dates: reduce the batch size at the first machine, and release orders in smaller lots. Six weeks later the trend shows the first drop.

## How is this different for software and DevOps teams?

Software organisations also build dashboards of value stream metrics, often for software delivery and software development in DevOps settings. They distinguish an operational value stream from a development value stream: the first delivers value to customers, the second builds the product. Their delivery process and development process are tracked through tickets and releases. The best-known set is from DORA, which describes [four key metrics](https://dora.dev/guides/dora-metrics-four-keys) of software delivery: deployment frequency, lead time for changes, change failure rate and time to restore service. These track code and releases through a delivery pipeline. A plant tracks orders, material and machines. The wish to deliver value faster and to see the flow of value is the same, but the data and the metrics differ, so do not copy a software dashboard into a plant, or the reverse.

## Common mistakes

- **Too many metrics.** Ten numbers hide the one that matters.
- **No targets.** A trend without a target gives no direction for action.
- **No formula or owner.** Two people calculate the same metric in two ways.
- **A dashboard nobody updates.** An old board is worse than none. Give the update to a named person and a fixed time.
- **Measuring departments.** The page should describe the stream, not the performance of single functions.
- **Decoration without action.** If the board has no action list, it is a poster.

## How software can help

Building a dashboard by hand from spreadsheets works for one stream. It becomes slow when data sits in the ERP system, the shop floor and quality files, and when several streams need the same layout. A value stream dashboard tool that reads these sources and compares planned and actual values removes the copy work and keeps the formulas the same every week.

iFAKT's [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) is a module of iFAKT Polaris with KPI dashboards across all modules that compare planned and actual values in production. Check any tool against your own formulas first.

## Next step

A value stream dashboard works when it is short, current and tied to an action list. This week, pick five metrics for the value stream of one product family, write the formula, data source and owner for each, and put the first trend on the board.
