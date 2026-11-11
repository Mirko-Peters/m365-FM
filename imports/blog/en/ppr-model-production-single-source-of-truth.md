---
title: "Product-Process-Resource (PPR) Models: One Source of Truth for Production"
summary: "A PPR model links product, process and resource in one structure. Learn what it contains, how a knowledge graph helps and how plant managers can build one."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-designer, product-process-resource, knowledge-graph, enterprise-resource-planning]
keypoints:
  - "A PPR model links the product to be built, the process needed to build it and the resources that can do the work, so that the three are never described in isolation."
  - "Plants often keep cycle times and routings in several systems and spreadsheets, so one change has to be made in many places and errors creep in."
  - "A knowledge graph stores these links as relationships, so you can ask which resources can run which step for which product."
  - "Skills and capabilities decouple a process from a fixed machine, because the model describes what a step requires and what a resource provides."
  - "Start small with one product family, reuse the data your ERP system already holds and name an owner for every data field."
faq:
  - q: "What is a PPR model in manufacturing?"
    a: "A PPR model is a structure that links three things: the product to be made, the process steps needed to make it and the resources, such as machines, tools and people, that can perform those steps. By storing the links between them, it shows which resource can do which step for which product, in one place."
  - q: "How is a PPR model different from a bill of materials or a routing?"
    a: "A bill of materials lists parts, and a routing lists operations. A PPR model connects both to the resources and their limits, and keeps the relationships between them. You can follow a link from a product to its steps, and from a step to every resource that can run it, instead of reading separate lists."
  - q: "Why use a knowledge graph for production master data?"
    a: "A graph stores the links between products, steps and resources as first-class relationships. That makes it easy to ask questions that cross the three, for example which machines can run a step, or which products are affected when a resource is down. It also lets you add new relationships without redesigning tables."
---

A PPR model links the product you build, the process steps needed to build it and the resources that can do the work, in one connected structure. This article is for plant managers who are tired of different numbers in the ERP system, the planning spreadsheet and the simulation. You will learn what a PPR model contains, why a single source of truth matters, how a knowledge graph fits in and how to build a first version in steps.

## What is a PPR model?

PPR stands for product, process and resource. A reference paper on capabilities and skills in manufacturing describes the PPR concept as representing the three major aspects of production systems engineering. Products are the inputs and outputs of production. Processes transform inputs into outputs. Resources execute those processes. See the [reference model paper on capabilities and skills](https://arxiv.org/pdf/2209.09632).

The [product-process-resource](https://www.m365.fm/entity/product-process-resource/) structure ties them together. In plain words, it answers three linked questions:

- **Product.** What do we make? Variants, parts and the manufacturing bill of materials.
- **Process.** How is it made? Steps, their order, times and rules.
- **Resource.** What does the work? Machines, tools and people, with their calendars and limits.

The value is in the links. A list of products, a list of steps and a list of machines are three lists. A PPR model says which step belongs to which product and which machines and people can perform it.

## Why do plants need one source of truth?

Most plants already hold this information, but in many places: routings in the ERP system, times in a planning spreadsheet, machine lists in maintenance, parameters in a simulation model. Each copy drifts.

A paper by Ferrer and colleagues on assembly automation describes the underlying problem. PPR modelling is seen as promising because it can compress development time and engineering cost and enable efficient design and reconfiguration of manufacturing resources. The obstacle is ineffective coupling of PPR data, which leaves system design dependent on the knowledge and experience of individual engineers. See the [abstract of the paper](https://wrap.warwick.ac.uk/id/eprint/78817). The paper looks at assembly automation, but the point carries over to any plant where product, process and resource data are kept apart.

Signs that your plant has many versions of the truth:

- A cycle time changes, and the schedule, the quote and the simulation still use the old value.
- Planners keep a private spreadsheet, because they do not trust the system.
- Nobody can say quickly which products are affected if a machine is down.
- A new product variant needs weeks of data entry before it can be planned.

## What goes into the model?

A first useful version needs less than you may think. For each part, start with the fields that planning really uses.

**Product**
1. Product and variant identifiers
2. Manufacturing bill of materials (what is built from what)
3. Quality or test requirements that affect the route

**Process**
1. Operations and their order, including alternatives
2. Times per unit and setup times
3. Required skills or tools for each operation

**Resource**
1. Machines, workstations, tools and people
2. Calendars, shifts and planned downtime
3. Capacity, skills and qualifications

Then add the links: each operation points to the products it belongs to, and to the resources that can run it. The reference paper explains why this helps. A capability or skill describes the function a process needs, and a resource provides it, so "the otherwise rigid link between processes and resources is decoupled". In practice you describe what a step requires and what each resource offers, and you do not hard-code one machine into the routing.

## How is it different from a bill of materials and a routing?

A bill of materials lists the parts of a product. A routing lists the operations and the work centers. Both are part of production master data, and both are necessary. But each one describes only one side. The bill of materials does not say how the parts are joined, and the routing often names a fixed work center, which hides the other machines that could do the job.

A PPR model uses both as inputs and adds what is missing: the links to the resources and their limits. That lets planning, simulation and reporting work from the same data. It also supports a more dynamic and adaptive way of working. If a machine fails or a new variant arrives, you can look for another resource that provides the required skill, instead of editing many routings by hand.

## How does a knowledge graph help?

A graph is a way to store data as things and the relationships between them. In a PPR graph, products, steps and resources are the nodes, and "is made by", "requires" and "can be performed on" are the relationships.

The benefit shows when you ask questions that cross the three parts:

- Which resources can run step 30 of product family A?
- Which products lose their only qualified operator if one person is absent?
- Which steps share the same bottleneck machine?
- What changes if a new machine is added?

In a set of separate tables, each question needs a new report. In a [knowledge graph](https://www.m365.fm/entity/knowledge-graph/), you follow the links. It is also easier to extend: a new kind of relationship, such as a tool requirement, does not require a redesign.

## Example: one change, many edits

This example uses assumed numbers.

A plant makes 40 products. The cycle time of one drilling step on machine M3 changes. This step appears in the routings of 6 products. The time is stored in 4 places: the [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/), a planning sheet, the MES and a simulation model.

**Without a shared model.** The planner makes 6 × 4 = **24 edits**. Suppose each manual edit has a 2 percent chance of a mistake or of being forgotten. The chance that all 24 are right is 0.98 to the power of 24, which is about 0.62. So the chance of at least one error is about 1 − 0.62 = **38 percent**.

**With one source.** The time is stored once, on the link between the step and the machine, and all products and tools read it. One edit, and the chance of an error is the 2 percent of that single edit.

The numbers are made up, but the logic is general: the more copies, the more places for a wrong value. A single source of truth does not remove errors, but it reduces the number of places where they can occur.

## How do you build one in steps?

1. **Choose one product family** and one area, for example the bottleneck line. Do not model the whole plant first.
2. **Collect the existing data.** Take routings, bills of materials, times and resource lists from the ERP system and other sources.
3. **Find the conflicts.** Compare the same value in different places. Decide which one is correct, and who owns it.
4. **Model the links.** Connect each step to its products and to the resources and skills that can perform it.
5. **Check it with the floor.** Show the model to supervisors and planners. Ask: is this how the work really runs?
6. **Connect the consumers.** Planning, simulation and reporting should read the model, not their own copies.
7. **Keep it alive.** Name a data owner per field and set a rule for changes.

## Common mistakes

- **Trying to model everything first.** Start with one family and widen the scope.
- **Copying the ERP errors.** A model built on wrong times is a well-organized wrong model. Check key values at the machine.
- **No data owner.** If nobody owns a field, it drifts again.
- **Hard-coding machines into routings.** Describe the requirement, and let the model find the resources that fit.
- **Building a model that nobody uses.** If planning and simulation still use their own copies, you have added one more copy.
- **Leaving out people and skills.** Operators and their qualifications are often the real limit.

## How software can help

A PPR model can be built with a graph database, a data platform or a dedicated tool. [iFAKT's Polaris Designer](https://www.m365.fm/entity/polaris-designer/) is a module of iFAKT Polaris that builds a product-process-resource knowledge graph as the single source of truth for products, process steps and resources. When you compare tools, ask where the data comes from, how conflicts between sources are shown and how other tools, such as planning and simulation, read the model.

## Next step

Take one product family and write down the products, the steps and the resources in one sheet, with the links between them. Compare the times in your ERP system with those at the machine, and you have the first version of a PPR model and a list of the data to fix.
