---
title: "Digital Twin in Manufacturing: What It Is and Where to Start"
summary: "Digital twin manufacturing explained for plant managers: what a twin is, how it differs from a simulation, where it pays off first and how to start small."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [digital-twin, polaris, factory-simulation, industry-4-0]
keypoints:
  - "A digital twin is a fit-for-purpose digital representation of a real manufacturing element, such as a machine, a line or a process, that stays in sync with it."
  - "A one-off simulation or a CAD drawing is not a twin, because a twin keeps receiving data from the physical side and changes with it."
  - "The three building blocks named by NIST are reliable sensor data, dependable connectivity and simulation models for predictive analysis."
  - "Start with one clear question, such as where the bottleneck is or whether a change will work, instead of twinning the whole plant at once."
  - "The twin is only as good as its data, so check master data, routings and shop floor feedback before you build anything."
faq:
  - q: "What is a digital twin in manufacturing?"
    a: "A digital twin is a digital representation of a real manufacturing element, such as a machine, a line, a product or a process, that is kept in sync with the real thing through data. It is built for a purpose, for example to test a change or to predict a problem, and it is updated as the real system changes."
  - q: "What is the difference between a digital twin and a simulation?"
    a: "A simulation is a model that you run to answer a question, often once, with data you load by hand. A digital twin keeps receiving data from the physical system, so it reflects the current state. A twin can run simulations, but a simulation alone is not a twin because it does not stay connected."
  - q: "Where should a plant start with a digital twin?"
    a: "Start with one specific question that matters to the business, for example which step limits output or whether a new shift pattern meets demand. Pick a small area, check that the data exists and is reliable, build a first version, learn from it and then grow. Do not try to model the whole plant first."
---

Digital twin manufacturing means keeping a digital model of a real machine, line or process in step with the real thing, so you can see its state and test changes before you make them. This article is for plant managers who hear the term often and want to know what it means in practice. You will learn what a twin is, how it differs from a one-off model, where it pays off first, how to start small, and which mistakes to avoid.

## What is a digital twin in manufacturing?

The standard ISO 23247-1 defines a [digital twin](https://www.m365.fm/entity/digital-twin/) as a fit-for-purpose digital representation of an observable manufacturing element, kept in synchronization with that element. The standard lists what such an element can be: personnel, equipment, material, process, facility, environment, product and supporting documents. See the [ISO 23247-1 overview](https://standards.iteh.ai/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021). The same series has further parts for a reference architecture, information attributes and information exchange.

Two words in that definition matter most:

- **Fit-for-purpose.** A twin is built to answer a question. A digital twin of a press for maintenance looks very different from a digital twin of a whole assembly hall for planning. Digital twin applications in manufacturing range from a single machine to a whole factory.
- **Synchronization.** A twin must stay close to reality. If nobody updates it, it becomes an old model.

In plain words, a digital twin of production combines three things: a virtual model of how work flows, the rules and operating conditions of the real plant, and a stream of real-time data from the shop floor. Many people use the term digital twin of production for the version that covers orders, resources and shifts rather than a single physical asset. Digital twins provide a way to see the real-world plant in a virtual environment.

## How is a digital twin different from a simulation?

NIST describes a twin as a dynamic, data-driven virtual representation that must replicate, connect and synchronize with its physical counterpart, and says it is not a static model. It names three essential elements: robust, high-frequency sensor technology for data collection, reliable industrial IoT infrastructure for connectivity, and advanced simulation models for predictive analysis. These elements, NIST says, determine the twin's fidelity, utility and long-term viability. Read the [NIST page on essential elements](https://www.nist.gov/el/applied-economics-office/manufacturing/topics-manufacturing/digital-twins/essential-elements).

McKinsey draws a similar line. A true twin often combines several physical models and processes real-time data live, which sets it apart from a simple model or a CAD drawing. See [McKinsey on digital twins](https://www.mckinsey.com/capabilities/operations/our-insights/digital-twins-what-could-they-do-for-your-business).

So the difference is the connection. A digital twin model is useful because it is current:

- A **simulation** is a model you run to answer a question. You load data, run it and read the result. Discrete event models are a common type.
- A **digital twin** keeps receiving data, so the model reflects what is happening now. It can run tests, and the result is based on the current state.

A [factory simulation](https://www.m365.fm/entity/factory-simulation/) is therefore one of the main uses of a digital twin, but it is not the same thing. A one-off study for a new production line can be very useful, and many plants start there. It becomes a twin when the data flows in on a regular basis.

Digital twin technology also fits into the wider topic of [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) and smart manufacturing, the idea of connected machines, data and software in production, with the internet of things as one source of data. Digital twins in smart manufacturing are one way to make use of that data and to support digital transformation.

## What types of digital twins exist?

McKinsey names four common archetypes: the product twin, the production plant twin, the procurement and supply chain twin and the infrastructure twin. For a plant, two matter most.

- **Product twin.** It follows a product from design to use, and helps engineering test designs and see how they behave in service.
- **Production plant twin.** It represents a facility, its lines, resources and flow. This is the digital twin that plant managers use for planning, capacity and bottleneck questions in manufacturing operations.

Within a plant, you can also think in layers, or types of digital twins. A twin can cover a **single asset**, such as a machine for predictive maintenance. It can cover a **process**, such as a packing line. Or it can cover a **system** of lines, halls and orders. The larger the scope, the more data and the more effort you need. That is why most plants begin with one asset or one line.

## Where does digital twin manufacturing pay off first?

The benefits of digital twins depend on the use case. McKinsey lists benefits such as faster product development through quick design iteration, better product quality through testing the manufacturing process virtually, and lower material use. It reports that consumer electronics makers cut scrap by roughly 20 percent in one case it describes. Treat figures like this as an example of what is possible, not a promise for your plant.

For a plant manager, four digital twin use cases come up most often:

1. **Bottleneck and flow analysis.** Where does work wait, and what limits output?
2. **What-if tests for capacity and staffing.** Will an extra shift, a new machine or a smaller buffer meet demand?
3. **Predictive maintenance.** A digital twin of a machine uses sensor data to spot signs of wear before a failure.
4. **Quality and process optimization.** A model of a manufacturing process helps find settings that reduce scrap and improve product quality.

If your main problem is delivery performance, begin with number 1 or 2. If it is unplanned downtime, begin with number 3. Choose the use case with a clear business case, because that decides whether the digital twin solution gets support from management.

## How do you start with a digital twin?

McKinsey advises that you assess your digital maturity, choose a specific and manageable use case, start with a small minimum viable product, tie the work to a clear business case and plan for barriers such as skills, up-front investment and access to quality data. In practice, that becomes six steps:

1. **Write the question.** For example, "Can we meet 100 units per day on line 2 without overtime?"
2. **Pick the scope.** One line, one cell or one product family. Not the whole plant.
3. **Check the data.** Do you have reliable routings, cycle times, resources, shift calendars and current order data? Gaps here matter more than any tool.
4. **Build a first model.** Keep it simple. Include the main resources, the flow and the main rules.
5. **Compare with reality.** Run the model on last month's orders and check whether its output is close to what really happened. Fix the model until it is.
6. **Connect and grow.** Feed it current data, use it for the next decision and then widen the scope.

Step 5 is where trust is built. If operators see that the model matches what they know from the floor, they will use it. If it does not, they will ignore it.

## Example: testing a change on a three-station line

This example uses assumed numbers.

A line has three stations in a row. Station A needs 4.0 minutes per unit, station B 5.5 minutes and station C 4.5 minutes. The shift has 7.5 productive hours. Demand is 100 units per day.

**Capacity per hour:**

- A: 60 ÷ 4.0 = 15.0 units
- B: 60 ÷ 5.5 = about 10.9 units
- C: 60 ÷ 4.5 = about 13.3 units

Station B is the bottleneck, so the line makes about 10.9 × 7.5 = **82 units per day**. That is 18 short of demand.

**Option 1: overtime of 1.5 hours.** Productive time becomes 9 hours. Output: 10.9 × 9 = about **98 units**. Still just short.

**Option 2: a second machine at station B.** The effective time at B halves to 2.75 minutes, so B makes 60 ÷ 2.75 = about 21.8 units per hour. Now station C is the limit at 13.3 units per hour. Output: 13.3 × 7.5 = **100 units**. Demand is met, and the bottleneck moves to C.

This arithmetic ignores variation. In a real plant, stops, changeovers and product mix reduce output. A digital twin adds those effects, so you can see whether 100 units is reached on a normal day or only on a perfect one. That is the value of the model: you can simulate the idea in the virtual model first and use digital twins to see the effect before you spend money.

## Common mistakes

- **Starting with the tool.** Pick the question first and the technology second.
- **Twinning everything at once.** A large scope delays the first result and the first lesson.
- **Ignoring data quality.** Wrong cycle times or old routings produce a confident but wrong model.
- **Building a model that nobody updates.** Without synchronization it is a simulation that ages.
- **Skipping validation.** If the model has not been compared with real results, nobody should trust its forecasts.
- **Leaving out the shop floor.** Operators and supervisors know the exceptions. Involve them when you build and check the model.

## How software can help

Manufacturing software for a digital twin must hold the model and the data together. [iFAKT's Polaris](https://www.m365.fm/entity/polaris/) is production software that iFAKT presents as "AI + Digital Twin for Production". It takes order and master data from the ERP system and combines it with a digital twin of the factory, so that schedules can be optimized, bottlenecks become visible and on-time delivery improves. Whatever you choose, ask how the tool gets its data, how often the model is updated and how you check it against real results.

## Next step

Choose one line and write down one question that a digital twin manufacturing project should answer, with a number such as units per day or on-time delivery. Then check whether the data for that line is complete and reliable, before you look at any tool.
