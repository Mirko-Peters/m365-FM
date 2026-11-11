---
title: "How to Define Value Streams: Product Families and Boundaries"
summary: "Define each value stream product family from routing similarity: build a product family matrix, start at the customer end and set clear boundaries. Steps."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, production-routing, value-stream-mapping]
keypoints:
  - "A product family is a product and its variants passing through similar processing steps and common equipment; it is the unit of analysis for a value stream map."
  - "Start at the customer end: upstream steps often batch several families, so they are a poor basis for defining a family."
  - "A product family matrix marks which products use which process steps and equipment, so similar routings stand out."
  - "Record for each family its finished part numbers, demand, volume, takt time and capacity need before you map."
  - "Set the boundary of the first map narrowly, and widen it to suppliers and customers once the plant stream works."
faq:
  - q: "What is a product family in value stream mapping?"
    a: "A product family is a product and its variants that pass through similar processing steps and common equipment. The Lean Enterprise Institute describes it as defined from the most downstream step just before the customer. It is the unit of analysis for a value stream map, so each family gets its own map."
  - q: "How do I group products into value stream families?"
    a: "List the products, list the process steps and equipment, and mark which product uses which step in a matrix. Group products with similar routings. Do not group by product name or by what the sales catalogue says. Check volume, takt time and capacity for each group before you start mapping."
  - q: "Where should a value stream start and end?"
    a: "Start at the customer and work upstream. For a first map, many teams keep the boundary inside their own plant, from the point where raw material arrives to the point where the product leaves. You can extend it later to suppliers and customers along the extended value stream."
---

To define a value stream, group your products by shared routing, starting from the customer end, and then draw a clear boundary around the steps you will map. This article is for continuous improvement managers who have to choose the first scope for a mapping workshop and want a method that survives questions. It covers the product family, the product family matrix, the value stream boundaries, what to record, a worked example and the mistakes that blur the scope.

## What is a value stream product family?

The Lean Enterprise Institute (LEI) defines a [product family](https://www.lean.org/lexicon-terms/product-family/) as a product and its variants passing through similar processing steps and common equipment. The LEI adds that families are defined from the most downstream step just before the customer, and that they are the unit of analysis for value stream maps.

In plain words: one value stream map covers one family. If you map "everything we make", the map shows a web and no flow. The family is what makes a value stream a stream.

The workbook *Learning to See* gives the practical reason for starting at the customer end: upstream fabrication steps often batch many product families together, so they are a poor basis for defining families. Look at the last steps before shipment instead, such as assembly, test and packing.

## Why define value streams before you map?

In lean manufacturing, value streams are the lens for process improvement. Defining value streams first lets you see the big picture of material and information flow, find the lead time hidden in queues and identify bottlenecks that no single department can see from inside its silo. Once the family is clear, the current state map shows how work flows today, and the future state map shows the continuous flow you aim for, with less waste. Good [value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) starts with good scope. A clear scope gives you a framework for the whole workflow, from the flow of materials to the value chain around the plant, and helps you eliminate waste instead of moving inefficiency to another department.

Reducing waste then happens where it matters for customer value. Stakeholders from planning, production and quality agree on the same scope up front, which avoids arguments later about what the map should include. Teams in software development and agile settings know the same need: you cannot improve a flow you have not scoped.

## How do you build a product family matrix?

The workbook describes a matrix for complicated product mixes. One axis lists the assembly steps and equipment, the other lists the products. You mark which products use which steps. Products with similar routing, the sequence of machines and steps they pass through, form a block. Here is a simple method:

1. **List the products.** Use finished part numbers, not product groups from the catalogue.
2. **List the process steps and equipment.** Start at the customer end and work back as far as you plan to map.
3. **Mark the usage.** For each product, mark the steps it needs. The [routing](https://www.m365.fm/entity/production-routing/) data in your ERP system is a good source, but check it on the floor, because routings in the system and the real path often differ.
4. **Look for similarity.** Move rows and columns until products with the same marks sit together.
5. **Name the families.** Give each block a name, a number of finished part numbers and a demand figure.
6. **Check the odd ones.** Products that fit nowhere may belong to a spare parts stream, or may need a separate map.

Aaron Hunt describes a related approach in an LEI article on [low-volume, high-mix value stream mapping](https://www.lean.org/the-lean-post/articles/apples-oranges-value-stream-mapping-in-a-low-volume-high-mix-environment/). He grouped products by process flow, not by product type, and found that items that looked unrelated, such as hips, knees and shoulders in his example, shared machine sequences. At one site he started with up to 4,000 products, some made once a year.

## Where do the value stream boundaries go?

A boundary says where the map starts and stops. Three levels are common. This is a practical scale of my own, not a standard.

- **Cell or area.** One production step and its immediate surroundings. Good for a kaizen event, too small for a stream.
- **Plant, from receiving to shipping.** The usual first scope. It covers material flow and the information flow that triggers it.
- **Extended stream.** It reaches upstream to suppliers or downstream to customers. The LEI notes that a family can be defined from any customer along an extended value stream, whether the end consumer or an intermediate customer.

For a first map, keep the boundary at the plant door. You can widen it when the plant stream is stable and the team knows the method. The LEI [value stream](https://www.lean.org/lexicon-terms/value-stream/) definition covers all actions, value-creating and non-value-creating, so decide in advance which supply chain steps you leave out and say so on the map.

Two rules keep the boundary honest:

- **Include the information flow.** A stream without the order and planning signals is half a stream.
- **Write the limits on the map.** "Receiving dock to shipping dock" is a boundary. "Mostly the plant" is not.

## What should you record for each family?

Before you map, collect facts for every family. *Learning to See* asks for the family's name, the number of finished part numbers and how much the customer wants and how often. Hunt adds volume, takt time (the pace set by customer demand) and the capacity required for each flow. He also adds margins and variance data so that leaders can pick the streams with the largest likely gain.

A short fact sheet per family:

- Name and finished part numbers
- Weekly demand and order pattern
- Takt time
- Main equipment and its capacity
- Revenue share and margin, if finance can provide them
- The most downstream step before the customer

## Example: eight products, three families

This example is invented to show the method. The routings and volumes are not from a real plant.

A plant makes eight products. The steps are saw, mill, lathe, wash, assembly and test. The marks per product:

- **P1, P2:** saw, mill, wash, assembly, test
- **P3:** saw, mill, wash, assembly
- **P4, P5, P6:** saw, lathe, wash, assembly, test
- **P7, P8:** saw, mill, lathe, wash

Grouped by routing, three families appear. Family A is P1 to P3, the milled assemblies. Family B is P4 to P6, the turned assemblies. Family C is P7 and P8, which leave after washing and are sold as spare parts.

Weekly demand is 120, 80 and 40 units for P1 to P3, so family A needs 240 units. P4 to P6 need 90, 60 and 30 units, so family B needs 180. P7 and P8 need 20 and 10, so family C needs 30. The total is 450 units. Family A is 240 divided by 450, about 53 percent. Family B is 40 percent. Family C is about 7 percent.

The team maps A first, then B. Together they cover 93 percent of the weekly units. Family C gets a light review later. All three families pass through saw and wash, so those two steps are shared. The team notes this on the maps, and flags it as a shared constraint because the maps for A and B will both depend on it.

## Common mistakes

- **Grouping by product name.** Two products with the same name can have different routings.
- **Using the ERP routing without checking it.** Walk the flow and compare.
- **Starting upstream.** Fabrication steps blend families. Start at the customer.
- **Choosing a family that is too big.** A map of 300 variants becomes unreadable.
- **Leaving the boundary vague.** State the first and last step on the map.
- **Ignoring shared resources.** Steps used by several families need a rule, and they often show up as the stream's constraint.

## How software can help

A product family matrix is easy to build by hand for ten products. For hundreds, routing data from the ERP system and a tool that can sort and compare it save days. A shared model also lets several people agree on the families in one session.

iFAKT's [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Whatever you use, check its output against the floor.

## Next step

Defining each value stream product family from routing, at the customer end and with a written boundary, makes every later map clearer. This week, list your finished part numbers, mark their process steps and circle the largest block of similar routings.
