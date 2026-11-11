---
title: "Batch Size in Manufacturing: How Smaller Batches Cut Lead Time"
summary: "Batch size in manufacturing decides how long parts wait. See why smaller batches cut lead time, what they cost and when short changeovers make them pay off."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [batch-size, setup-time, lead-time]
keypoints:
  - "Batch size is the number of units made in one run before the machine is changed over; the same idea is called lot size."
  - "Large batches spread the setup over many parts, but every part waits for the rest of its batch and every order waits for its turn."
  - "Smaller batches shorten lead time and reduce stock, but they add changeovers and use capacity, so they need short setups."
  - "The cost-optimal lot size balances setup cost and holding cost, and it falls when the setup cost falls; treat it as a floor, not as the goal."
  - "Reduce batch size in steps: measure the setup, cut it, shrink the batch, then check capacity, quality and delivery before the next step."
faq:
  - q: "What is batch size in manufacturing?"
    a: "Batch size is the number of units produced in one run before the machine is changed over to another product. It is also called lot size. A larger batch spreads the setup over more parts, while a smaller batch lowers stock and lets orders move through the plant faster."
  - q: "How does batch size affect lead time?"
    a: "Every part in a batch waits until the whole batch is finished before it moves on, and a new order waits for its product's turn on the machine. Smaller batches shorten both waits. The gain is real only if the extra changeovers do not use up the machine's capacity."
  - q: "What is the best batch size?"
    a: "There is no universal figure. The cost-optimal lot size balances setup cost against holding cost, and it gets smaller when changeovers get cheaper. Use it as a starting point, then check lead time, quality and capacity, and keep shortening the setup to move toward smaller batches."
---

Batch size in manufacturing is the number of units a machine makes in one run before it is changed over to another product. For a production manager, it is one of the quietest levers on lead time: with smaller batches, parts wait less for the rest of their batch, and orders wait less for their turn on the machine. But smaller batches also mean more changeovers, so they pay only when setups are short. This guide shows the trade-off, a worked example with numbers, and a way to reduce batch size in safe steps.

## Batch size in manufacturing: what it is and why it matters

In batch production, a batch, or lot, is a group of identical parts that move through a step together. The [batch size](https://www.m365.fm/entity/batch-size/) is how many parts are in one production run. Many plants run large batches because a changeover costs time and sometimes scrap. The Lean Enterprise Institute (LEI) author Fred Stahl writes in [Which Will Prevail: Batch Thinking or Worker Leadership?](https://www.lean.org/the-lean-post/articles/which-will-prevail-batch-thinking-or-worker-leadership/) that once a machine is set up, processing parts in batches of hundreds or thousands reduces the unit cost to pennies or less. That is the logic of economies of scale, and it is not wrong for the machine.

The trouble is what the batch does to the flow. Large batches create three kinds of waiting:

- **Waiting inside the batch.** A part that was finished first sits until the last part of the batch is done, and then moves on. The same happens again at the next step.
- **Waiting for a turn.** A new order cannot start until the machine reaches its product in the production schedule. The larger the batches, the longer the cycle through all products.
- **Waiting as stock.** Finished parts, raw materials and parts in process occupy space and cash, and they hide problems. Good inventory management starts with seeing them.

Together, this waiting is most of the [lead time](https://www.m365.fm/entity/lead-time/) of an order. The time at the machine is often a small part of it. That is why batch size is a lever on lead time that a plant can pull without buying anything.

## How smaller batches cut lead time

The effect is simple. If you halve the batch, each part waits for half as many other parts, and the machine returns to every product twice as often. Parts and orders move through faster, and less stock sits between the steps.

Stahl describes the same direction in his article. Under just-in-time flow, he writes, batch sizes shrink and queues disappear. He also quotes Burbidge's fourth rule, which asks for the smallest run quantity that can be managed efficiently. Stahl argues that managers often do the opposite when things go wrong: they respond to breakdowns by increasing batch sizes and lead times, which in his view makes the system more unstable.

A second effect is learning. In an LEI article on [one-piece flow](https://www.lean.org/the-lean-post/articles/why-does-one-piece-flow-matter/), Michael Ballé describes asking operators to hold to single-piece flow for half an hour. Afterwards, all the waste that was previously hidden in the cell suddenly appeared, and the line was ripe with kaizen opportunities. With small batches, a defect is found after a few parts, not after a thousand. The feedback loop is shorter, so quality problems cost less.

Ballé is also honest about the limits: in many areas, usually upstream, the nature of the process forces production in batches. A furnace, a paint bath or a heat treatment step cannot be run one part at a time. The aim is not one piece everywhere. It is the smallest batch that each step can run sensibly.

## Setup time and the cost side of the trade-off

Smaller batches have a price. Every extra changeover in the production process adds setup costs: it uses machine time, labour and often some scrap during start-up. That is the [setup time](https://www.m365.fm/entity/setup-time/) that large batches were meant to avoid. On the other side stand the holding costs of stock: capital, space, handling and risk. Plants that want to minimize total inventory costs have to weigh the two sides.

The classic way to balance the two is the economic order quantity (EOQ), also used for production lot sizes. The software vendor Unleashed explains it in its article on the [economic order quantity](https://www.unleashedsoftware.com/blog/economic-order-quantity-explained-formulas-how-to-use-them/), which is a vendor source. It gives the formula EOQ = √(2DK/H), where D is annual demand, K is the cost per order or setup, and H is the annual holding cost per unit. The same source says the model assumes that demand, costs and lead times stay constant over the year, and it warns that the results are only as good as the input data.

The formula has one lesson that matters for lean. The optimal batch grows with the square root of the setup cost. If you cut the setup cost to a quarter, the cost-optimal batch is halved. So the way to smaller batches runs through shorter changeovers. The formula does not include lead time, quality feedback, machine utilization or flexibility, so treat its result as a cost floor, not as the target.

## Example: three products on one machine

This is an illustrative calculation, not a measured case. One machine makes three products, each with a weekly demand of 1,200 pieces (60,000 per year). The machine runs 60 pieces per hour and is available 80 hours per week. A piece is worth 80, and the holding cost is assumed to be 20 per cent of the value per year. A changeover takes one hour and costs 120, which is an assumed 90 for machine time plus 30 for start-up scrap.

**Weekly batches (1,200 pieces each).**

- Machine time per cycle: 3 × 20 hours of running plus 3 hours of changeover = 63 hours.
- Changeover cost per week: 3 × 120 = 360.
- Average stock: half a batch per product, so 1,800 pieces worth 144,000. Holding cost: about 554 per week.
- Total: about 914 per week. An order for product B may wait most of a week for its turn.

**Daily batches (240 pieces each).**

- Machine time per day: 3 × 4 hours of running plus 3 hours of changeover = 15 hours of 16 available.
- Changeover cost per week: 15 × 120 = 1,800.
- Average stock: 360 pieces worth 28,800. Holding cost: about 111 per week.
- Total: about 1,911 per week. An order waits at most about a day for its turn.

With one-hour changeovers, daily batches cut lead time but cost about 1,000 more per week, and they use 75 of 80 hours of production capacity. Now assume the team shortens the changeover to 15 minutes, which costs 30. The weekly option costs 90 + 554 = 644. The daily option costs 450 + 111 = 561, and it uses only 12.75 hours per day. The smaller batch is now cheaper and faster. The EOQ formula, used to optimize the lot size, gives the same picture: with D = 60,000 per product per year, H = 16 per piece per year and K = 120, it gives about 949 pieces. With K = 30, it gives about 474.

The numbers show the point: batch size and setup time have to be decided together.

## How to reduce batch size in five steps

This sequence is our own planning aid, not a standard.

1. **Pick the right machine.** Start where a long queue builds up, usually at the bottleneck or just before it.
2. **Measure the changeover and its cost.** Time it in full, from the last good part to the first good part, and add the scrap and the labour.
3. **Shorten the setup.** Do as much preparation as possible while the machine is still running, and remove adjustments by fixing positions.
4. **Cut the batch by a step, not by a leap.** Reduce it by a quarter or a third, run it for a few weeks, and compare lead time, stock and capacity.
5. **Check quality, delivery and the people.** Smaller batches mean more handovers and more changeovers per shift. Make sure the standard work covers them, then take the next step.

Repeat the loop. Each round lowers the cost floor of the formula and lets you run smaller batches.

## Common mistakes

- **Cutting batches without cutting the setup.** The machine then spends its capacity on changeovers and becomes the bottleneck.
- **Looking at stock cost only.** In the example above, the saving in holding cost is small. The gain is in lead time, flexibility and quality feedback.
- **Using one batch size for every product.** Fast sellers and rare variants need different lot sizes.
- **Trusting the formula blindly.** The EOQ model assumes constant demand and costs. Check it against your own data.
- **Increasing the batch as a reaction to breakdowns.** It hides the cause and lengthens lead time, as Stahl notes.
- **Forgetting the upstream and downstream steps.** A small batch at one machine does not help if the next step still waits for a full pallet.

## How software can help

An ERP system can hold lot sizes, setup times and demand per product, and it can show the stock and the planned changeovers by week. A production planning tool can test different batch sizes against the capacity before you change the floor. Simulation can show how batch size and variation affect queues and lead time. Software helps to decide, but the setup work itself has to be done at the machine.

## Next step

Pick one machine with a long queue, time its changeover, and calculate the cost per changeover. Then test a batch that is a third smaller, and watch the effect of batch size in manufacturing on your lead time.
