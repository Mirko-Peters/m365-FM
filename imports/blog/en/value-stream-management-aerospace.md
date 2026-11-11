---
title: "Value Stream Management in Aerospace: Long Lead Times, Low Volume, High Mix"
summary: "Value stream management in aerospace manufacturing works with long lead times, low volume and high mix. See how to set part families, find waits and plan gains."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, aerospace]
keypoints:
  - "Aerospace parts are made in low volumes with a high mix and long lead times, so the value stream is mostly waiting, not working."
  - "Group parts into families by shared routing and equipment, not by customer or programme, so that one map and one owner fit many part numbers."
  - "A Sikorsky back shop described in a Lean Enterprise Institute article cut changeovers from 30 minutes to 2 to 3 minutes and used fixed-interval part sequencing."
  - "A Lean Post case reports an order-to-delivery lead time cut from 42 to 16 days for one value stream, with volume up 40 percent."
  - "Treat suppliers such as heat treatment as part of the stream; one supplier case cut lead time from 42 to 6 days."
faq:
  - q: "Does value stream management work for low volume, high mix aerospace parts?"
    a: "Yes, if you group parts into families by routing and equipment, and manage the family as one stream. Lean Enterprise Institute articles describe a Sikorsky back shop with high mix and erratic demand that used part families, fast changeovers and first-in-first-out lanes. Volume is not the test; the shared flow is."
  - q: "What is the biggest source of lead time in aerospace manufacturing?"
    a: "Usually waiting, not processing. Parts queue before shared machines, wait for external processes such as heat treatment, and wait for inspection and documents. A value stream map shows each wait in days next to the processing time. In the invented example here, waiting is about 88 percent of the lead time."
  - q: "Can lean changes conflict with aerospace certification rules?"
    a: "They can, if a change touches a certified process, a qualified supplier or required records. Keep inspection and traceability steps on the map and in the future state, and ask your quality department to approve changes before a trial. I did not open a source on certification rules, so check yours."
---

Value stream management in aerospace means running each family of parts as one flow from order to delivery, with one owner and shared measures, even when volumes are low, the mix is high and lead times run to weeks or months. This article is for plant managers in aircraft and aerospace component manufacturing who want to know where the weeks go and how to shorten them. It covers part families, the lean tools that suit low volume, results reported by two manufacturers, an invented worked example and the usual mistakes. It stays with manufacturing. Software development and DevOps teams also use value stream management, to track deployment and flow metrics, but that is a different field and this article does not cover it.

## What does a value stream cover in an aerospace plant?

A value stream is every step, value-creating or not, that a product goes through from customer order to delivery, together with the information that triggers it. Value stream mapping, or VSM, draws that stream for one product family. A plant usually has several value streams, one per family, and each of the value streams needs its own owner. Management goes further: it gives the stream an owner, a few shared measures and a review rhythm, so that improvements are planned, tracked and kept.

In aerospace the stream is long. A part may be cut, machined, heat treated, inspected, surface finished, inspected again and documented, often at several sites and suppliers. The page on [aerospace](https://www.m365.fm/entity/aerospace/) describes the industry as one characterised by strict quality, traceability and certification requirements. Those requirements shape every change you make, and they are a reason to map the stream carefully, not a reason to skip it.

## Why does value stream management in aerospace need a different approach?

Textbook examples often show a stable product with steady volume. Aerospace plants usually look different, and three features matter.

- **Long lead times.** Material, external processes and approvals add weeks. Heat treatment, plating and testing are often done by suppliers.
- **Low volume.** A part number may be ordered a few times a year. Takt time, the pace set by customer demand, is hard to define for a single part number.
- **High mix.** Many different parts share the same machines, so changeovers and scheduling decide the lead time.

A Lean Enterprise Institute (LEI) article, [The Backbone of Lean in the Back Shops](https://www.lean.org/the-lean-post/articles/the-backbone-of-lean-in-the-back-shops/), describes the back shop of the helicopter maker Sikorsky in just this setting: high mix, low volume, erratic demand, shared equipment, frequent changeovers and batches from the planning system of up to 70 forgings. It is a 2004 article about one shop, so read it as an example of method, not as a benchmark for your plant.

## How do you form part families when the mix is high?

With thousands of part numbers you cannot draw a map per part. Group them into families that follow the same route through the plant. The LEI workbook [Learning to See](https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-part1.pdf) uses the same logic: a family is a group of products that pass through similar processing steps and use common equipment.

For a low-volume plant, this is a practical set of rules. It is my own working method, not a standard:

1. **List the routings.** Write each part number with its steps and machines.
2. **Sort by shared steps and equipment.** Parts that use the same machines and the same external processes belong together.
3. **Check the size.** A family should be large enough to matter, and small enough that one owner can walk the whole flow in a day or two.
4. **Name an owner.** One person is accountable for the family from order to delivery.

Do not group by customer or by programme alone. Two programmes can use one machining cell, and then the family is the cell.

## Which lean tools suit low volume and high mix?

The Sikorsky article shows how that shop used several tools together. Each one is explained here in plain terms.

- **Part families and cells.** Parts with similar routings are grouped, and the shop is arranged around them.
- **EPEI.** This stands for "every part every interval". It sets a fixed cycle in which each part in a family is made once, so that a part comes round again at a known time and you can size the buffer.
- **SMED.** Single-minute exchange of die is a method to shorten changeovers. The article reports a changeover cut from 30 minutes to 2 to 3 minutes on one operation.
- **FIFO lanes.** First-in, first-out lanes hold limited queues between steps, so that work leaves in the order it arrives.
- **A value stream manager.** One person looks after the whole flow, not one department.

The article reports results for one product, a helicopter spindle, in 2003: lead time down 73 percent and changeover time down 90 to 93 percent.

Shorter changeovers matter most in a high-mix plant, because they make smaller batches affordable, and smaller batches shorten every queue.

## What has been reported in aerospace plants?

A second LEI article, [Launching a Lean Transformation: An Aerospace Manufacturer's Journey](https://www.lean.org/the-lean-post/articles/launching-a-lean-transformation-an-aerospace-manufacturers-journey-with-purpose-process-and-people/), written by Matthew Savas in December 2023, describes a sheet metal cutting company that started with one value stream: aluminum sheet metal cutting, mapped from order entry to delivery. According to the article:

- The order-to-delivery lead time fell from 42 days to 16 days while volume grew by 40 percent.
- The company took a supplier into the work. The heat-treatment supplier's lead time fell from 42 days to 14 days, then to 6 days, and defects were eliminated, where previously up to 60 percent of parts had come back defective.
- The team used one-week rapid improvement events and visual "Mission Control" boards.

These figures come from the company's own author in a trade publication, and I could not check them. The article does not discuss certification. Two points carry over: the team started with one stream, and it treated a supplier step as part of the stream.

## Example: one part family, invented numbers

This example is invented. The numbers are not from a real plant or a real customer.

A machined bracket family has this current state, in calendar days:

- Order release and planning: 3 days.
- Cutting: 4 days queue, 0.5 days processing.
- Machining: 9 days queue, 1.5 days processing.
- Heat treatment at an external supplier: 14 days in total, of which 1 day is processing.
- Inspection: 3 days queue, 0.5 days processing.
- Surface finish: 5 days queue, 1 day processing.
- Final inspection and documents: 2 days queue, 1 day processing.
- Packing and shipping: 1 day.

The lead time is 3 plus 4.5 plus 10.5 plus 14 plus 3.5 plus 6 plus 3 plus 1, which is 46 days. Processing is 0.5 plus 1.5 plus 1 plus 0.5 plus 1 plus 1, or 5.5 days, which is 12 percent of the lead time. The other 40.5 days, or 88 percent, are waiting. The two largest waits are the heat-treatment supplier, at 14 days, and the queue before machining, at 9 days.

The team sets a future state with two main changes. First, it agrees a 7-day cycle with the heat-treatment supplier, based on a fixed weekly collection. Second, it groups the family's machining jobs into a fixed repeating sequence, so that the queue before machining falls from 9 to 4 days. The lead time becomes 46 minus 7 minus 5, which is 34 days, a cut of 26 percent. Inspection and documentation stay as they are, because they are required steps. The team asks the quality department to approve the supplier change before the trial starts.

## Which measures should the owner track?

Keep the set small. A useful metric set for a low-volume stream, my own suggestion:

- **Lead time** per order, from order entry to delivery, and its spread.
- **Wait days** at each step, which shows where the workflow stalls.
- **Cycle time** at the machines that shape the flow, to find the bottleneck.
- **On-time delivery** against the date promised to the customer.
- **First pass yield and returns**, including those from suppliers.

Visibility matters more than precision here. A weekly board that shows these numbers supports continuous improvement, because the team sees the effect of each change. The aim is to optimize the whole flow and the customer value it delivers, not a single machine. This is lean manufacturing applied to long lead times.

## How is this different from VSM in software delivery?

Software teams use the same words. In software delivery, VSM follows an idea through development, testing and deployment to release, usually with agile and DevOps teams, and it measures flow with metrics from their tools. Its stakeholders are product owners and engineers. An aerospace plant follows physical material through machines, suppliers and inspection, and the end-to-end flow takes weeks. The shared idea is to deliver value to the customer faster by finding and removing waiting. Use sources written for your own field. Real-time data from machines can help in a plant, but it does not replace walking the flow and asking why parts wait. The goal in both fields is higher productivity of the whole stream, not of single steps.

## Common mistakes

- **Mapping the plant, not a family.** A map with hundreds of part numbers shows nothing. Pick one family with one route, and map the value streams one at a time.
- **Leaving out suppliers.** External processes are often the longest wait. Put them on the map and in the owner's scope.
- **Cutting required steps.** Inspection, traceability and records are not waste in the sense of the map. Keep them, and shorten the waiting around them.
- **Using takt time per part number.** With low volume it makes little sense. Use it per family or per cell, or use a fixed cycle such as EPEI.
- **Skipping the quality department.** Involve them early, because they decide what a change needs to be approved.

## How software can help

In a plant with many part numbers and several external processes, drawing and updating maps by hand is slow. iFAKT's [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Software helps you see the flow; the part families, the owner and the approvals still need people.

## Next step

Value stream management in aerospace starts with one part family and one honest map of its waiting time. This week, list the routings of your most important parts, group them into a family, and measure the days each part waits between steps and at your external processors.
