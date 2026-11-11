---
title: "Value Stream Mapping for High-Mix Low-Volume Production"
summary: "Value stream mapping for high mix low volume production: group products by routing, size each flow and map one family at a time. Includes a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, production-routing, value-stream-mapping, bottleneck]
keypoints:
  - "In high-mix low-volume production, group products by the sequence of operations they use, not by product type. Each distinct flow becomes its own value stream."
  - "A product-process matrix of work centers against products shows which products share a routing and can be mapped as one family."
  - "Size each flow with volume, takt time and the capacity it needs, and start with the streams that carry the most revenue."
  - "Shared machines connect value streams. Check the load on a shared resource before you plan improvements for one family."
  - "When one map per family is not enough, a value network map shows several linked streams, but it is one author's approach and not a standard."
faq:
  - q: "Can you use value stream mapping in high-mix low-volume production?"
    a: "Yes, if you map families and not single products. Group products by the sequence of operations they use, then map one family at a time. The classic map breaks down when you try to draw every product. In a plant with thousands of products, start with the flows that carry the most revenue."
  - q: "How do you group products into families when routings differ?"
    a: "Build a matrix with work centers on one side and products on the other, and mark which product uses which step. Products with the same or very similar routing form a family. Treat each clearly different routing as its own value stream, and check the families against what customers buy."
  - q: "What is a value network map?"
    a: "A value network map is a view that shows many interconnected value streams on one map. Shahrukh Irani proposes it for job shops, where products share machines and a single-family map is too narrow. It draws on ERP data and Gantt charts. It is one author's method, not a lean standard."
---
Value stream mapping for high mix low volume production works when you map families of products and not single products. You group products by the sequence of operations they use, size each flow and map one stream at a time. This guide is for production managers in job shops and make-to-order plants, where hundreds of products share the same machines and the classic one-family map seems too small. It explains why the method gets hard, how to adapt it, how routings fit in and what a worked example looks like.

## Why is it hard to create a value stream map when the mix is high?

*High-mix, low-volume* (HMLV) production makes many different products in small quantities. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) (VSM) is a lean process mapping method. A value stream map visualizes the flow of materials and information of one product family from customer to supplier, and it helps teams eliminate waste and shorten lead time. The classic examples assume a few families with stable flows and steady demand. An HMLV plant breaks all three assumptions.

Aaron Hunt describes the scale in his Lean Enterprise Institute article [Apples & Oranges: Value-Stream Mapping in a Low-Volume/High-Mix Environment](https://www.lean.org/the-lean-post/articles/apples-oranges-value-stream-mapping-in-a-low-volume-high-mix-environment/). One facility he writes about had up to 4,000 products, and some were made only once a year in batches as small as five, not counting custom orders and prototypes. Nobody can draw 4,000 value stream maps, and nobody could use them.

Shahrukh Irani raises a second problem in his article in *The Fabricator*, [Lean manufacturing in the job shop: 5 steps to building a value network map](https://www.thefabricator.com/article/shopmanagement/lean-manufacturing-in-the-job-shop-5-steps-to-building-a-value-network-map). He argues that a value stream map cannot handle dozens of different work centers or complex multilevel bills of materials. He also notes that the map gives a single day's snapshot of part flow, and that it relies on takt time and a pacemaker process for level loading. Those ideas fit a steady flow better than a job shop with sporadic orders.

None of this makes the method useless. It means you must change the unit of mapping from the product to the flow. A large mix also hides waste. Large batches that avoid frequent changeovers can lead to overproduction and long queues, and defects and rework add more waiting. This is where VSM helps. A good map shows where the process flow stops, helps you identify waste such as queues, rework and changeovers, and shows the total lead time of each family. You can then streamline the flow step by step as part of continuous improvement.

## How do you do value stream mapping for high mix low volume production?

Each family is one of the plant's value streams, and a plant with a large mix has many value streams. Hunt's advice is to group products by flow, not by product type. Products that look unrelated can share a route, such as lathe, vertical mill and vertical mill again, and then belong in one family. The steps below follow his approach, with the product family matrix from the Lean Enterprise Institute workbook *Learning to See* for the grouping:

1. **List all products.** Include the volume per product and how often it is ordered.
2. **Group by routing.** The workbook describes a matrix of process steps and equipment against products. Mark each product's steps. Products with similar steps form a family. Read its [first part](https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-part1.pdf) for the method.
3. **Size each flow.** For each flow, Hunt determines volume, takt time and the capacity needed. This shows how many machines, secondary processes and people each stream needs.
4. **Pick the streams that matter.** Map the whole plant at a high level, with each flow's share of the business. Then add margin and variance data to decide which maps will give the biggest gains.
5. **Draw the current state map of one family.** Build a cross-functional team with stakeholders from planning, sales and the floor. Walk the material flow, record the cycle time of each process step, changeovers and stock, and mark the shared machines.
6. **Design the future state map.** Use the make-to-order methods described below, and turn the gaps into small kaizen steps. Kaizen means continuous improvement in small steps, made by the people who do the work.
7. **Repeat for the next family.** Product mix changes, so revisit the grouping from time to time.

For make-to-order flows, Mike Rother describes three methods in the Lean Enterprise Institute article [Value-stream mapping in a make-to-order environment](https://www.lean.org/the-lean-post/articles/value-stream-mapping-in-a-make-to-order-environment/). Find the bottleneck on the critical path, release work in equal time increments based on its capacity and keep short first in, first out (FIFO) queues between steps. These methods suit job shops because they do not need a steady daily rate for every product.

Hunt reports one result from his work. In a critical value stream of several hundred products, average changeover time fell from 10 hours to 30 minutes. That is a reported case from one author, not a benchmark. It shows where the gain can be: the changeovers that large mixes force on you.

## How do routings and product families shape each value stream?

A *routing* defines the sequence of operations a product passes through and the work centers or resources that can perform each operation, including approved alternate routes and their rules. It is the best raw material for family grouping, because it is already recorded in your [production routing](https://www.m365.fm/entity/production-routing/) data. Export the routings for all active products, and let the matrix show the pattern.

Three rules help in practice:

- **Group by the main routing.** If a product has an alternate route, use the route that carries most of its volume.
- **Treat clearly different routings as separate streams.** Hunt's answer to products with different routings is to treat each distinct flow as its own value stream. The streams in his example ranged from about 300 products to just one or two.
- **Mark shared resources.** A machine that serves two families links their value streams. A press brake used by two cells, for example, is a point where one family's change affects the other.

Irani proposes one more step for plants with many shared machines. His *value network map* shows many interconnected value streams on one map, uses ERP data and Gantt charts and schedules with finite capacity or drum-buffer-rope methods. It is one author's approach for job shops, and it is not part of the standard value stream mapping workbook. Consider it when one value stream map per family hides too much of the interaction.

## Example: three families that share one machine

This is an illustrative example with made-up numbers, not a measured case. A job shop makes 12 products on five work centers: saw, mill, lathe, weld and paint. The production manager builds a product-process matrix from the routings and finds three families:

- **Family 1** (saw, mill, paint): products A to D, with 20, 15, 10 and 5 units per day, 50 in total.
- **Family 2** (saw, lathe, weld, paint): products E to G, with 12, 8 and 4 units per day, 24 in total.
- **Family 3** (lathe, mill): products H to L, with 6, 5, 4, 3 and 2 units per day, 20 in total.

A working day has 420 net minutes, or 25,200 seconds.

**Takt time per family.** Family 1: 25,200 ÷ 50 = 504 seconds. Family 2: 25,200 ÷ 24 = 1,050 seconds. Family 3: 25,200 ÷ 20 = 1,260 seconds. These are family averages. Individual products differ in work content, so compare each family's total load with capacity and not each product's cycle time with one number.

**Shared machine.** The mill serves families 1 and 3. Family 1 needs 4 minutes of mill time per unit: 50 × 4 = 200 minutes per day. Family 3 needs 6 minutes per unit: 20 × 6 = 120 minutes per day. The load is 320 minutes of 420, or about 76 percent.

**Test a change.** The sales team expects family 3 to double. Then it needs 40 × 6 = 240 minutes, and the mill load is 200 + 240 = 440 minutes. That is more than 420 minutes available, about 105 percent. The mill becomes the [bottleneck](https://www.m365.fm/entity/bottleneck/) for both families. An improvement plan for family 1 alone, such as shorter changeovers elsewhere, would not help.

The picture only appears because the manager mapped the families together at the shared machine. That is the main adaptation HMLV needs: one value stream map per family, plus a view of the machines they share, so that you can optimize the whole plant and not one family only.

## Common mistakes

- **Mapping every product.** Group by flow and map the families that carry most of the volume or revenue.
- **Grouping by product type.** Products that look alike may use different routes, and unlike products may share one. Group by routing.
- **Ignoring shared resources.** A machine used by two families can limit both. Check its load first.
- **Forcing a steady takt on sporadic orders.** Use family averages with care, and use equal time increments and FIFO queues where orders come in irregularly.
- **Waiting for perfect data.** Cycle times are often missing in low-volume plants. Use estimates, label them as estimates and refine them later.
- **Treating the grouping as final.** Product mix changes. Review the matrix when the portfolio changes.

## How software can help

In a high-mix plant, the routings, orders and stock change every week, so a map drawn once ages fast. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Grouping and sizing still need a person who understands the products and knows the floor.

## Next step

Export the routings of your active products and build a product-process matrix for one area of the plant. Then choose the biggest family and map it as the first step to implement value stream mapping for high mix low volume production.
