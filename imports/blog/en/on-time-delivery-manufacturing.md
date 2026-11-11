---
title: "On-Time Delivery in Manufacturing: How to Measure and Improve It by Value Stream"
summary: "On-time delivery in manufacturing is the share of orders shipped by the promised date. Measure OTIF per value stream, find late-order causes and fix them."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-analyzer, finite-capacity-scheduling]
keypoints:
  - "On-time delivery is the share of orders shipped on or before the promised date; OTIF also requires the order to be complete."
  - "Write down which date counts as promised, whether you count orders or order lines, and what window counts as on time before you start measuring."
  - "Measure by value stream, so that late orders can be traced to the flow of one product family and not to a plant average."
  - "Schedule attainment counts total units; schedule adherence checks each product against its own plan, so a plant can score 100 percent on one and 90 on the other."
  - "Sort late orders by cause, such as material, capacity, quality or planning, and fix the largest cause first."
faq:
  - q: "What is on-time delivery in manufacturing?"
    a: "On-time delivery is the share of orders shipped on or before the promised date, divided by all orders shipped in the period. You must decide which date is the promise, such as the customer request or the confirmed date, and what counts as on time. Many plants measure it per value stream so that causes of late orders are easier to find."
  - q: "What is the difference between on-time delivery and OTIF?"
    a: "On-time delivery looks only at the date. OTIF, short for on time in full, counts an order only if it arrives on time and complete. An order that is on time but short, or complete but late, does not count. OTIF is therefore never higher than on-time delivery and shows the perfect-order rate."
  - q: "How do you improve on-time delivery?"
    a: "Start with the causes of late orders. Sort them by material, capacity, quality and planning, and fix the largest group first. Give realistic promise dates based on capacity, keep to the plan at the bottleneck, check material before release, and review late orders in a short, regular meeting. Measure per value stream to see which flow needs work."
---

On-time delivery in manufacturing is the share of orders that leave the plant on or before the date promised to the customer. It is the number customers feel most, and the one that plant managers are asked about first. This article is for plant managers who want to measure on-time delivery per value stream, find out why orders are late, and improve it without hiding behind averages. It covers definitions, formulas, causes, an invented worked example and ways to improve.

## What does on-time delivery mean in manufacturing?

The basic idea is simple: orders shipped on time divided by orders shipped. This is the on-time delivery rate, often shortened to OTD. Together with quality and cost, it is a core measure of delivery performance and of manufacturing performance as a whole. The difficulty is in the definitions, and you have to write them down before you measure:

- **Which date is the promise?** The date the customer asked for, or the date you confirmed. Using the confirmed date can look better than the customer's view, so report both.
- **What counts as on time?** On or before the date, or within a window, for example one day early to zero days late.
- **Orders or order lines?** One late line can make a whole order late for the customer.
- **Which event counts as delivery?** Shipment from the plant, or arrival at the customer.

A related measure is OTIF, which stands for on time in full. A [Kaizen Institute article](https://kaizen.com/insights/otif-supply-chain-indicator/) defines it as whether an order is delivered within the agreed time frame and complete, without missing items or errors. Only orders meeting both criteria count. The page is from a consulting firm, so read it as a vendor view. OTIF is therefore never higher than on-time delivery alone.

Mike Orzen of the Lean Enterprise Institute (LEI) names the order fulfilment rate as one of [four value stream level metrics](https://www.lean.org/the-lean-post/articles/the-mythical-value-stream-manager). The article does not define it in detail, so write your own formula and keep it stable.

## Why measure delivery by value stream?

A plant-wide number mixes streams that behave differently. A stream with short lead times and make-to-stock products can deliver at 98 percent while a made-to-order stream with long routings sits at 75. The average of 90 hides the problem and sends the improvement effort to the wrong place.

A value stream is the flow of one product family from customer order to delivery. When you count on-time deliveries per stream, a late order leads you to one flow, one owner and one map. You can then compare the delivery trend with lead time and inventory of the same stream and see how they move together.

## What about supplier on-time delivery and the supply chain?

Your own delivery depends on the deliveries you receive. Measure supplier on-time deliveries in the same way, because late supplier deliveries become your late orders: purchase order lines received on or before the confirmed date, divided by lines received. Track it for the suppliers of the parts that stop your stream most often.

The supply chain also includes freight. If a carrier takes a day longer than planned, the customer sees a late delivery, even if the order left your plant on time. State clearly whether you measure on-time shipment or on-time arrival. Benchmarks for on-time delivery vary by industry and customer, so compare each stream with its own history and its own target, and do not borrow a number from a general article.

## How do you calculate it?

Use simple formulas and keep them the same every week:

- **On-time delivery** = orders shipped on or before the promised date, divided by orders shipped.
- **In full** = orders shipped complete, divided by orders shipped.
- **OTIF** = orders both on time and complete, divided by orders shipped.
- **Days late** = average and longest delay of the late orders.

Show the trend over twelve weeks, not one number. Real-time data from the ERP system helps, but a weekly figure is enough for most decisions. Add the average days late, because a stream that is one day late differs from one that is two weeks late. Count orders by shipping date in the period. If you count by promise date, orders that are still open will be missing from the measure.

## What is the difference between schedule attainment and schedule adherence?

On-time delivery is an outcome. Schedule adherence is one of the causes that you can control. A Fabrico page, from a vendor of production software, [explains the difference](https://www.fabrico.io/blog/schedule-attainment-vs-production-adherence/). Schedule attainment is a volume measure: actual units produced divided by planned units. Production adherence checks whether the line made the right products, in the right quantities, in the right sequence, so a surplus on one product cannot cover a shortfall on another.

Here is an invented example. A line plans 1,200 units of A, 1,000 of B and 800 of C, and makes 1,500, 700 and 800. Total output is 3,000 against a plan of 3,000, so attainment is 100 percent. Counting each product up to its plan gives 1,200 plus 700 plus 800, or 2,700 units, so adherence is 2,700 divided by 3,000, or 90 percent. The shortfall of 300 units of B is a likely source of late orders, and the attainment figure hides it.

## Why are orders late?

Sort late orders by cause. Common groups are:

- **Material.** A part or raw material was missing at release or arrived late.
- **Capacity.** The plan loaded a resource beyond what it can do, and orders queued.
- **Quality.** Rework or scrap sent the order through a second loop.
- **Planning.** The promise date did not match the real lead time, or the plan changed after release.
- **Changeovers and breakdowns.** Setup or downtime at the constraint pushed work out.
- **Information.** A missing drawing, approval or customer confirmation held the order.

Count late orders by group for a month and draw a simple bar chart, with the largest cause on the left. The first one or two bars usually explain most of the delay. Work on those first.

## Example: one stream, 200 orders, invented numbers

This example is invented. The numbers are not from a real plant.

A stream ships 200 orders in a month. 176 are on time, so on-time delivery is 176 divided by 200, or 88 percent. 190 are complete, so the in-full rate is 95 percent. 168 are both on time and complete, so OTIF is 168 divided by 200, or 84 percent.

The 24 late orders sort as follows: 9 for material, 7 for capacity overload, 5 for quality rework and 3 for other reasons. Material and capacity explain 16 of the 24, or two thirds.

The team picks two actions with owners and dates. Planning checks material availability three days before release and holds orders that fail the check. The planner also loads the constraint to a realistic limit when confirming dates, so that the promise matches the capacity. After two months, the stream's on-time delivery rises to 93 percent in the same invented scenario, and the weekly review moves on to the quality loops.

## How do you improve on-time delivery?

These levers come up repeatedly, and the Kaizen Institute page lists similar ones, such as standardising activities, removing waste and errors, using pull systems and better forecasting, and strengthening supplier relationships:

1. **Promise what the capacity can do.** Give dates from a plan that respects capacity. [Finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) plans each resource only up to its real limit, so that dates are realistic.
2. **Protect the constraint.** The step that limits output decides the delivery date. Keep it fed, and avoid changing its plan at short notice.
3. **Check material before release.** An order that starts without all parts will wait in the stream.
4. **Release in a steady rhythm.** Small, regular lots avoid peaks and queues.
5. **Shorten lead time.** Less waiting means fewer chances for an order to slip.
6. **Review late orders at a fixed time.** A short weekly meeting with an owner for each late order keeps the topic alive.
7. **Talk to the customer early.** If a date will slip, say so and agree a new one. A known delay hurts less than a surprise.

## Common mistakes

- **Moving the promise date after the fact.** The measure then looks good while customers are unhappy.
- **Counting only the plant average.** The weak stream stays hidden.
- **Measuring on time but not in full.** A short shipment is not a delivery.
- **No cause analysis.** Without sorted causes, actions are guesses.
- **Chasing orders instead of fixing flow.** Expediting moves problems around.
- **Using attainment alone.** Total units can be right while the wrong products are made.

## How software can help

On-time delivery needs data from the ERP system (promise dates, shipment dates, quantities) and from the shop floor (progress and delays). Collecting it by hand takes hours each week and leaves little time for the causes. A dashboard that compares planned and actual values per stream shows late orders early and lets you deliver on time more often.

iFAKT's [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) is a module of iFAKT Polaris with KPI dashboards across all modules that compare planned and actual values in production. Check any tool against your own definitions first.

## Next step

On-time delivery in manufacturing gets better when you measure it per value stream and sort late orders by cause. This week, write down your definition of on time, calculate the last month's on-time delivery and OTIF for one stream, and list its late orders by cause.
