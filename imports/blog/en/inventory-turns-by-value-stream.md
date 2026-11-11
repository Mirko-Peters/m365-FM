---
title: "Inventory Turns by Value Stream: How to Measure and Improve Them"
summary: "Measure inventory turns by value stream: cost of goods sold over average stream inventory, shown in days, then cut WIP and finished goods. Includes an example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-optimizer, enterprise-resource-planning]
keypoints:
  - "Inventory turns are COGS divided by average inventory; for one value stream, use the stream's COGS and the stream's own stock."
  - "Days of inventory are 365 divided by turns, so four turns a year is roughly 90 days of stock."
  - "A plant-wide average hides slow streams: in the invented example, one stream turns 3 times a year while the plant shows 4."
  - "Counting raw material, work in process and finished goods separately shows where stock sits and which lever to pull first."
  - "Turnover can be pushed too far; very lean stock can cause order backlogs, and profit depends on more than turns."
faq:
  - q: "How do you calculate inventory turns for a value stream?"
    a: "Divide the stream's annual COGS by its average inventory, counting raw material, work in process and finished goods that belong to the stream. For example, 6.0 million of COGS and 2.0 million of average inventory give 3 turns a year. Divide 365 by the turns to get days of inventory, here about 122 days."
  - q: "What is a good inventory turnover?"
    a: "There is no single good figure, because it depends on the industry, the product and the service level. A higher ratio means stock moves faster, but a ratio pushed too far can cause shipping delays and lost sales. Compare each stream with its own history and its own target, and look at slow-moving items inside the average."
  - q: "How do you improve inventory turns in manufacturing?"
    a: "To improve your inventory turnover, cut work in process with limits and pull signals, reduce batch sizes and changeover times, level the order release, and set stock rules by part family. Each lever shortens the time material waits, so the same sales need less stock. Change one lever at a time and measure the stream's turns and days of inventory for several weeks."
---

Inventory turns by value stream measure how many times the stock of one product family is used up and replaced in a year, using the stream's own cost of goods sold and the stream's own inventory. This article is for plant managers who see one turnover number for the whole plant and suspect that it hides the real picture. It defines the measure, shows how to build it per stream from raw material, work in process and finished goods, gives an invented worked example, and lists levers to improve it.

## What are inventory turns by value stream?

Inventory turnover, also called stock turnover, shows how fast stock moves. AccountingTools gives the basic formula as [annual cost of goods sold divided by inventory](https://www.accountingtools.com/articles/what-is-inventory-turnover.html?no_redirect=true). Cost of goods sold (COGS) is the direct cost of what you sold, used instead of sales because sales include a markup. The same source offers average inventory, beginning and ending inventory added and divided by two, when the ending balance is not typical.

[AccountingCoach](https://accountingcoach.com/blog/inventory-turnover-ratio) uses cost of goods sold divided by average inventory for the year. It warns that an average can hide slow-moving items, so a company should compute turnover for each inventory item. That warning is the case for measuring by value stream: the stream is a natural group between a single item and the whole plant.

A value stream is the flow of one product family from customer order to delivery. For a stream, the formula becomes:

- **Numerator:** the stream's annual cost of goods sold.
- **Denominator:** the average value of the stream's raw material, work in process and finished goods.

Divide 365 by the turns to get days of inventory. AccountingTools notes that four turns a year corresponds to roughly 90 days.

In short, the inventory turnover ratio is a financial metric that measures how many times a company's inventory is sold and replaced. The turnover ratio formula is simple, and the ratio tells you how quickly stock moves. To calculate inventory turnover for a stream, use this inventory turnover formula: COGS divided by average inventory value. A high ratio means stock moves quickly. A low inventory turnover ratio means that inventory levels are high compared with what the stream sells, and a lower inventory turnover than in the past is a signal to look closer. Both need a closer look before you act, because efficient inventory management balances stock against service to the customer.

## Why measure inventory turnover by value stream, not by plant?

A plant-wide inventory turnover number mixes fast and slow families. One stream with a long tail of slow parts can pull the figure down, and a fast stream can hide it. Value stream management asks one owner to improve the flow of one family, so the owner needs the inventory of that family, not an average. Tracking inventory turnover per stream also shows excess inventory early, before it ties up more cash.

Stream-level turns also connect to the rest of the stream's measures. A shorter lead time and less work in process raise turns. Seeing the three stock types separately tells you which lever to pull.

One caution about the accounting effect. Art Byrne of the Lean Enterprise Institute (LEI) describes [a company whose inventory turns rose from about 3 to 6](https://www.lean.org/the-lean-post/articles/ask-art-what-happens-when-standard-cost-accounting-meets-takt-time/) while its non-cash earnings fell, because under standard costing overhead that had sat in stock reached the P&L. Better turns can look like worse profit for a period. Involve finance before you set targets.

## How do you collect the inventory data for the turnover ratio?

Most of the data sits in the ERP system (enterprise resource planning, the software that holds orders, stock and costs). Some firms add inventory management software on top, but the stream view still needs a clean part-to-stream assignment. To get stream figures, assign each part number to a stream, then group stock by that assignment. Use these steps:

1. **List the parts of the stream.** Raw material, purchased components, semi-finished parts and finished goods that belong to the product family.
2. **Assign storage locations.** If a stockroom serves several streams, split by part number, not by location.
3. **Take stock values at several dates.** Month-end values for twelve months give a better average than two dates. A perpetual inventory system lets you average daily values.
4. **Split by type.** Raw material, work in process and finished goods, each with its own value.
5. **Take the cost of goods sold for the same period.** Check the figure with finance, so that your turns match the accounts.
6. **Note shared parts.** Components used by several streams need a stated rule, for example by usage.

To calculate the inventory turnover ratio for a stream, take the beginning and ending inventory of the year, add them and divide by two, or use the average of twelve month-end values. Then divide the COGS by that average inventory value. Check the calculation with finance, and calculate it the same way every month. This gives the inventory turnover rate. Divide 365 by it to get days inventory outstanding, the number of days the average stock lasts.

Be aware of seasonality. Stock builds up before a peak and falls after it, so compare the same months across years or use a full-year average.

## Example: two streams and a plant average, invented numbers

This example is invented. The numbers are not from a real plant.

A plant has two streams. Stream A has an annual COGS of 6.0 million. Its average inventory is 0.6 million of raw material, 0.9 million of work in process and 0.5 million of finished goods, so 2.0 million in total. Turns are 6.0 divided by 2.0, or 3.0 a year, and days of inventory are 365 divided by 3, about 122.

Stream B has COGS of 4.0 million and average inventory of 0.5 million. Turns are 8.0 and days of inventory are about 46.

The plant has COGS of 10.0 million and inventory of 2.5 million. Plant turns are 4.0 and the days of inventory about 91. The plant figure looks acceptable, but stream A ties up four fifths of the inventory and holds it for more than four months.

The owner of stream A goes after work in process first, since it is the largest part. The team sets limits on work in process, cuts the batch size and releases orders daily. Work in process falls from 0.9 to 0.45 million and finished goods from 0.5 to 0.35 million. Raw material stays at 0.6 million.

New inventory is 0.6 plus 0.45 plus 0.35, or 1.4 million. With the same COGS, turns are 6.0 divided by 1.4, about 4.3, and days of inventory fall to about 85. The stream has released 0.6 million of cash. The plant turns rise to 10.0 divided by 1.9, about 5.3, if stream B stays the same. In this example the inventory turnover for stream A rises from 3.0 to 4.3, a higher inventory turnover that comes from lower inventory levels and not from higher sales.

## What is a good inventory turnover ratio?

There is no single good inventory turnover ratio, and no ideal inventory turnover for every plant. A good inventory turnover depends on the industry and the product. AccountingTools points out that low turnover suggests excess inventory, obsolescence or weak inventory control, while high turnover can be positive but may mean the business lacks the working capital to hold enough stock, which can lead to shipping delays. It also says the ratio cannot predict profitability, and that turnover can be pushed too far. Very lean inventory can create order backlogs that customers will not tolerate.

So set a target for each stream from its own history, its lead times and its service level. Aim for a steady rise in inventory turnover, an optimal inventory turnover for your own mix, while on-time delivery stays at or above target.

## How do you improve your inventory turnover?

To improve inventory turnover, the levers are the same ones that shorten lead time, because stock is material waiting. Managing inventory by stream means managing the WIP and the finished goods together:

- **Limit work in process.** A cap, for example with kanban cards, stops the stream filling up with started orders.
- **Reduce batch sizes and changeover times.** Smaller lots need less stock between steps.
- **Level order release.** A steady rhythm avoids waves of material.
- **Set stock rules by part family.** Fast movers get a defined buffer, slow movers are made to order or reviewed for removal.
- **Improve supplier reliability.** Reliable delivery lets you hold less safety stock.
- **Remove excess and obsolete stock.** Decide what to sell, rework or write off.

Choose one lever, measure for several weeks, and keep what works.

## Common mistakes

- **Using the plant average only.** It hides the stream that ties up the cash.
- **Using sales instead of COGS.** Markup inflates the ratio.
- **Counting only finished goods.** Work in process is often the largest part.
- **Using one date for inventory.** A single balance may not be typical.
- **Pushing turns without watching delivery.** Stock-outs and late orders cost more than stock.
- **Ignoring the accounting effect.** Falling stock can reduce reported profit for a period.

## How software can help

Stream-level stock needs the ERP data per part and a plan that decides how much work waits. A schedule that ignores constraints creates queues and stock that nobody planned. Better planning decides which orders run when, so that material arrives as it is used.

iFAKT's [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. Check any planning result against your stock rules and your finance figures. Your [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/) remains the source of stock values.

## Next step

Inventory turns by value stream start with one product family and one clear formula. This month, assign the stream's parts, take twelve month-end stock values and compare the stream's days of inventory with the plant average.
