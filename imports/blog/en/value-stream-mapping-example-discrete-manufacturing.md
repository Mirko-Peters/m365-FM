---
title: "Value Stream Mapping Examples From Discrete Manufacturing"
summary: "A value stream mapping example from discrete manufacturing: two worked cases, an assembly family and a make-to-order job shop, plus how to pick a family."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, manufacturing, value-stream-mapping, bottleneck]
keypoints:
  - "Discrete manufacturing makes distinct, countable items, so a value stream map follows one product family through its routing from order to delivery."
  - "In a make-to-stock assembly family, large batches and push scheduling build days of stock between steps, even when every cycle time is below takt time."
  - "In a make-to-order job shop, release work in equal time increments based on the bottleneck, not one traveler per order, and keep FIFO queues short."
  - "Choose the product family from the customer end, with a matrix of steps and equipment, and map the family that matters most to customers."
  - "Treat every example as a pattern to adapt. Measure your own times and stock on the floor before you draw."
faq:
  - q: "What is an example of value stream mapping in discrete manufacturing?"
    a: "A typical example maps one product family, such as an assembled housing, through stamping, welding, assembly and packing. The map shows cycle times, stock between steps and how schedules reach each step. It often reveals days of stock and a push schedule, while the actual working time is only minutes per unit."
  - q: "How do you map a job shop with many different products?"
    a: "Group products into families that share similar steps and equipment, then map one family. For make-to-order work, the Lean Enterprise Institute suggests identifying the bottleneck, releasing work in equal time increments based on its capacity and keeping short FIFO queues between steps. That makes the flow steadier and easier to read."
  - q: "How do you choose the product family for a value stream map?"
    a: "Build a matrix with process steps and equipment on one side and products on the other, and mark which product uses what. Group products that pass through similar steps and share downstream equipment. Look at the family from the customer end, and start with the family that is most important for customers or lead time."
---
A value stream mapping example from discrete manufacturing follows one product family through its steps, from customer order to delivery, and records the time, the stock and the information flow at each step. This article is for production managers who want to see what a finished map tells them. It explains what makes discrete manufacturing special, then walks through two worked examples with simple numbers: a make-to-stock assembly family and a make-to-order job shop. It ends with a way to pick the right product family.

## What does a value stream mapping example look like in discrete manufacturing?

Discrete manufacturing produces distinct, countable items assembled from components. The Kaizen Institute gives cars, aircraft, appliances and medical devices as examples. Each unit follows a *routing*, the sequence of operations it passes through. The same source describes a *job shop* as a layout for many product types, small batches and frequent route changes. An assembly line is the opposite: high volume, little variety and balanced stations. Most plants sit somewhere in between. You can read more in the Kaizen Institute's article [What is discrete manufacturing?](https://kaizen.com/insights/what-is-discrete-manufacturing/).

Customer demand sets another split. *Make-to-stock* products are built to a forecast and drawn from finished goods. *Make-to-order* products start when an order arrives, which lowers stock but lengthens lead time. The type of demand changes what your value stream map shows, so value stream mapping examples differ between make-to-stock and make-to-order plants.

[Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) works in both cases, in [factories and workshops](https://www.m365.fm/entity/manufacturing/) of all sizes. The map follows one product family, not the whole plant. The workbook *Learning to See* from the Lean Enterprise Institute (LEI) defines a product family as a group of products that pass through similar processing steps and share common downstream equipment. According to its [first part](https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-part1.pdf), you identify families from the customer end, not from upstream fabrication, which often batches across many families. A matrix of steps and equipment against products can help in complex mixes.

A plant has several value streams, one for each product family, so you draw one value stream map per family. The examples below use made-up numbers. They do not describe a real company. Use them as patterns.

### How do you read the finished map?

Read a value stream map from the customer back to the supplier. The current state map shows the customer box, a process box for each step with a data box for cycle time and changeover time, the stock under each inventory triangle and a timeline. Raw material enters at the supplier end. *Process time* is the sum of the cycle times, and *wait time* is the stock divided by daily demand. The share of time that adds value is the process time divided by the total lead time. After the current state map comes the future state map, which you draw on the basis of what you find.

## Example 1: a make-to-stock assembly family

This is an illustrative example with made-up numbers, not a measured case. A production manager maps one product family, an assembled housing, made to stock. Demand is 300 units per day. One day has 28,800 seconds of available time.

- **Takt time:** 28,800 ÷ 300 = **96 seconds**.
- **Stamping:** cycle time 8 seconds, changeover 30 minutes, stock in front 1,500 units.
- **Welding:** cycle time 60 seconds, two operators, stock in front 600 units.
- **Assembly:** cycle time 90 seconds, stock in front 300 units.
- **Packing:** cycle time 20 seconds, no stock in front. A finished goods store holds 600 units.

Days of supply are the stock divided by daily demand: stamping 1,500 ÷ 300 = 5 days, welding 600 ÷ 300 = 2 days, assembly 300 ÷ 300 = 1 day and the finished goods store 600 ÷ 300 = 2 days. Waiting time is 5 + 2 + 1 + 2 = **10 days**, or 10 × 28,800 = 288,000 seconds. Value-added time is 8 + 60 + 90 + 20 = **178 seconds**.

Share of time that adds value: 178 ÷ (288,000 + 178) = 0.0006, about **0.06 percent**.

What the map tells the manager:

- Every cycle time is below takt time, but assembly uses 94 percent of it (90 ÷ 96), so there is little room for disturbance.
- The stamping batches of 1,500 units equal 5 days of demand. The 30-minute changeover is the reason for such large batches, because nobody wants to switch often.
- The information flow shows one weekly schedule sent to every step. Each step produces to its own plan. That is a push system, and it builds stock.

The first actions are therefore to shorten the stamping changeover so that batches can shrink, and to test a pull link between stamping and welding. The manager walks the flow and counts the stock on two different days before acting.

## Example 2: a make-to-order job shop

This is an illustrative example with made-up numbers, not a measured case. A job shop makes custom machine parts. Each customer order has a traveler, the paper or electronic document that moves with the order. The orders pass through cutting, milling, painting and packing. Work content varies a lot by order.

Mike Rother describes this situation in a LEI article on [value-stream mapping in a make-to-order environment](https://www.lean.org/the-lean-post/articles/value-stream-mapping-in-a-make-to-order-environment/). If work is released one traveler per customer order, large orders overload some steps while small ones leave others idle. Work bunches up between steps. Steps also pick jobs by setup efficiency, which breaks first in, first out (FIFO) order, and it becomes hard to see who is ahead or behind.

The article suggests three methods:

1. **Identify the [bottleneck](https://www.m365.fm/entity/bottleneck/) on the critical path.** Here it is painting.
2. **Release work in equal time increments** based on the bottleneck's capacity, not one traveler per order. LEI's example: if painting is the bottleneck, release one hour of painting work to the chain each hour.
3. **Keep short FIFO queues between steps**, especially in front of the bottleneck. Smaller queues mean less work on the floor and shorter lead times.

Here is how the numbers might look. Painting has 7.5 hours of capacity per day. The queue in front of painting holds 12 orders with an average of 1.5 hours of painting work each:

- **Queue today:** 12 × 1.5 = 18 hours of work, which is 18 ÷ 7.5 = **2.4 days** of waiting.
- **Release rule:** one hour of painting work is released every hour. A 6-hour order enters as six one-hour increments.
- **FIFO limit:** the queue in front of painting may hold at most 2 hours of work, which is 2 ÷ 7.5 = about **0.27 days**.

The queue in front of painting would shrink from 2.4 days to about 0.27 days, because the system no longer lets work pile up there. The work does not disappear. It waits at the gate instead of on the shop floor, where it blocks space and hides problems. The manager still needs to check the real painting capacity on the floor before she applies the rule.

LEI points out one more detail. Partly custom streams often start with standard components that a supermarket can supply. Only the customized part downstream needs FIFO or sequential pull.

## How do you choose the product family for your own map?

A good first map starts with the right family. To create a value stream map for your plant, follow these steps:

1. **List your products and steps.** Draw a matrix with process steps and equipment in the rows and products in the columns.
2. **Mark what each product uses.** Put an X where a product needs a step or a machine.
3. **Group similar products.** Products with similar steps and shared downstream equipment form a family.
4. **Look from the customer end.** Check the groups against what customers buy and how often.
5. **Pick one family.** Choose the one with the biggest effect on customers, lead time or stock.

Keep the first value stream map small. One family and one plant area are enough to learn the method.

## Common mistakes

- **Copying an example.** The numbers in this article are made up. Measure your own cycle times and stock.
- **Mapping every product at once.** In a job shop, this produces an unreadable value stream map. Use families, and map the steps that add value and the steps that do not.
- **Ignoring the type of demand.** A make-to-stock map and a make-to-order map need different questions.
- **Releasing work by order only.** Large and small orders create uneven load. Use equal time increments at the bottleneck.
- **Forgetting information flow.** How schedules reach the floor often explains the stock.
- **Mapping alone.** Operators know why work waits at a step.

## How software can help

A value stream map built from observation is a good start, but routings, times and orders change. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Whichever tool you use, the numbers still need a check on the floor.

## Next step

Choose one product family in your plant and write down its steps, cycle times and stock. Then draw your own value stream mapping example and compare it with the two patterns above.
