---
title: "Digital Twin of the Value Stream: Test Changes Before You Make Them"
summary: "A digital twin of the value stream models a product family with live data, so you can test batch sizes and shifts virtually. Includes an invented example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-simulator, digital-twin, factory-simulation]
keypoints:
  - "A digital twin of the value stream is a model of one product family that is kept in sync with data, so that changes can be tested on the model before they are made on the floor."
  - "ISO 23247-1 defines a digital twin as a fit-for-purpose digital representation of an observable manufacturing element, with synchronization between the element and its representation."
  - "A simulation study of a tubular machining facility paired value stream mapping with discrete event simulation to give quantifiable evidence for lean changes."
  - "Calibrate first: the model must reproduce today's lead time and throughput before you trust its answers about tomorrow."
  - "Run what-if scenarios such as a smaller batch, a faster changeover or an extra operator one at a time, then confirm the winner in a floor trial."
faq:
  - q: "What is a digital twin of a value stream?"
    a: "It is a digital model of one product family's flow, with process steps, resources, orders and variation, that is kept in sync with data from your systems. You use it to test changes, such as smaller batches or an extra shift, before making them on the floor. It adds a dynamic view to the static value stream map."
  - q: "How is a digital twin different from a simulation?"
    a: "A simulation is a model that you run to test scenarios. A digital twin is a model that stays synchronised with the real system through data, so it starts from the current state. The same simulation engine can sit inside both. If the model is not updated from observations, it is a simulation, not a twin."
  - q: "Do I need sensors or IoT for a digital twin of the value stream?"
    a: "Not at the start. Many flow questions can be answered with order, routing and booking data from ERP, plus measured cycle times and changeovers. Sensors and machine data add detail and reduce manual booking. Start with the data you can trust, then add connections where a decision needs finer data."
---

A digital twin of the value stream is a model of one product family's flow that is kept in sync with real data, so that you can test a change on the model before you make it on the floor. This article is for plant managers who have a value stream map and a list of ideas, and who want to know which idea is worth trying. It explains what the twin is, what it needs, how a what-if test works, an invented example with numbers, and the limits to keep in mind.

## What is a digital twin of the value stream?

A value stream map shows how material and information flow through a product family, with process steps, queues and handoffs. It is a snapshot. It cannot tell you what happens to lead time if you halve the batch size, add an operator or shorten a changeover, because the map does not move.

A model that does move is a simulation. It represents the steps, the resources, the orders and the normal variation, and it plays the flow forward in time. The question "what happens if?" gets a quantified answer. The entity page on [factory simulation](https://www.m365.fm/entity/factory-simulation/) describes this as a controlled model of how work moves through part of a factory, so a proposed change can be tested before it is made.

A digital twin goes one step further, and twins allow you to start every test from the real state. The International Organization for Standardization defines it in [ISO 23247-1](https://standards.iteh.ai/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021) as a fit-for-purpose digital representation of an observable manufacturing element, with synchronization between the element and its digital representation. In plain words, a [digital twin](https://www.m365.fm/entity/digital-twin/) is a virtual replica that is updated from observations, and a digital twin of the value stream applies that idea to the flow of a product family. Observable manufacturing elements include personnel, equipment, material, process and facility. For a value stream, the element is the stream: its steps, machines, people, material and orders.

The test is simple. If the model starts from today's real state, because data keeps it current, the digital twin behaves as a twin. If you fill it by hand once, it is a simulation.

## Why test changes virtually?

Changes on the floor cost time and disrupt output. A test on a model costs hours and does not stop the line. Wei Xia and Jiwen Sun describe this in [a case study of a tubular machining facility](https://jiem.org/index.php/jiem/article/view/532), published in the Journal of Industrial Engineering and Management in 2013. They paired value stream mapping with discrete event simulation, a method that models a system as a sequence of events over time. The abstract states that the simulation provides quantifiable evidence for lean approaches, lowers uncertainty and builds agreement among stakeholders. It also reports that the simulated results matched the real production data, and that scenarios were used to identify a future state. The abstract gives no figures, so read it as a method reference, not as proof of a size of gain.

Three benefits follow in practice:

- **Less risk.** You see a bad idea before you pay for it.
- **Better ranking.** With several ideas, the model shows which one moves lead time or throughput most.
- **Shared understanding.** Planning, production and finance can look at the same test case and agree on the numbers.

## What does the model need?

The model is only as good as its inputs. For a first version, collect:

- **Routings:** the steps and their order for each product in the family.
- **Times:** cycle times, setup and changeover times, measured on the floor and not taken only from the ERP system.
- **Availability:** shift calendars, planned breaks, breakdowns and their typical length.
- **Demand:** order sizes and arrival patterns, including the mix of variants.
- **Rules:** batch sizes, release rules, priorities and buffer limits.
- **People:** operators per step and their qualifications.
- **Variation:** the spread of times, not just averages, because queues come from variation.

Sensors and machine connections (the Internet of Things) can supply real-time data on cycle times and downtime, and cut manual bookings. They help, but a first twin can run on ERP bookings and a stopwatch study. Add machine data where a decision needs it.

## How do you run a what-if test?

1. **Build the baseline.** Model the current state of one product family.
2. **Calibrate.** Run the model and compare its lead time, throughput and queues with measured values. If the gap is large, find the missing delay or the wrong time. Do not go on until the model reproduces today.
3. **Define one change.** For example a smaller batch, a shorter changeover, an extra operator, a buffer limit or a new release rule.
4. **Run it many times.** Variation means one run is a single sample, so run the test several times and look at the range.
5. **Compare.** Look at lead time, throughput, queue length and the use of the bottleneck.
6. **Combine.** Try the best options together, because effects interact.
7. **Trial on the floor.** Confirm the winner in a limited trial and compare the real result with the forecast.
8. **Update the model** with what you learned.

## Example: one stream, three tests, invented numbers

This example is invented. The numbers are not from a real plant or a real model.

A product family has demand of 480 units a day. The calibrated model reproduces a lead time of 9.0 days and a throughput of 480 units a day. By Little's Law, which says that work in process equals throughput times lead time, that is 4,320 units in the stream. The bottleneck runs at 96 percent of its capacity.

The team tests three changes:

- **Smaller batches:** halve the batch from 80 to 40 units, which adds changeovers. Model result: lead time 6.5 days, throughput 470 units a day, because the extra changeovers cost output.
- **Extra operator at the bottleneck:** model result: lead time 7.8 days, throughput 480 units a day.
- **Both together:** smaller batches and the extra operator. Model result: lead time 5.4 days, throughput 480 units a day, so work in process is 5.4 times 480, or 2,592 units.

The combined scenario cuts lead time by 40 percent without losing output, whereas smaller batches alone cost 10 units a day. The team starts a four-week trial with the combined change, and compares the real lead time with the forecast of 5.4 days.

## How does this fit the wider digital twin picture?

Digital twin technology is used in many sector settings, from single machines to whole sites. Most descriptions call a digital twin a virtual replica of a physical object or physical asset, fed by sensors and connectivity, and used for analytics, decision-making and, for example, predictive maintenance. Some add machine learning or artificial intelligence on top of the model.

The value stream twin is narrower. Its object is the flow of a product family, not one machine. Its data sources are orders, routings, bookings and measured times, and its question is operational: how to improve productivity, lead time and operational efficiency by changing the workflow. You can optimize a plant step by step with a data-driven model of the stream, long before you cover every asset.

## What are the limits?

- **Garbage in, garbage out.** Wrong times produce wrong answers, with neat charts.
- **Fit for purpose.** A model for one family and one question is enough. A twin of the whole plant is rarely needed at the start.
- **Cost of upkeep.** A twin must be kept in sync, or it drifts back to a simulation.
- **People and rules.** Models handle rules well, and handle habits and workarounds badly. Walk the floor and compare.
- **Other uses.** Twins are also used for asset management and predictive maintenance. This article covers the flow of a product family only.

## Common mistakes

- **Skipping calibration.** An unchecked model gives confident nonsense.
- **Modelling everything.** More detail costs time and does not always improve the answer.
- **Using averages only.** Variation drives queues.
- **Testing five changes at once.** You cannot tell which one worked.
- **Trusting the model over the floor.** Always confirm with a trial.
- **Building a twin without a question.** Start from the decision you must take.

## How software can help

Building a simulation model by hand takes weeks. Software that reads the routings and orders from the ERP system and models the stream shortens that. iFAKT's [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. Calibrate any model against your own measurements first.

## Next step

A digital twin of the value stream pays off when it answers one real question, such as which change shortens lead time most. This week, pick one product family and one decision, and list the routings, times and rules a model of that stream would need.
