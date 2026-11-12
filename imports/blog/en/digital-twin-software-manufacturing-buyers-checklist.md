---
title: "Digital Twin Software for Manufacturing: A Buyer's Checklist"
summary: "Digital twin software for manufacturing keeps a model in sync with live data. A checklist to compare platforms, packaged tools, security, cost and upkeep."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [digital-twin, azure-digital-twins, azure, polaris-designer, polaris-simulator, ifakt]
keypoints:
  - "NIST names three essential elements of a twin: high-frequency sensing, reliable industrial IoT connectivity and simulation models for prediction. Software must cover them or work with partners."
  - "Azure Digital Twins is a platform service for twin graphs, not a ready-made factory application, and Microsoft says it differs from the Fabric digital twin builder preview."
  - "Decide first whether you need a platform to build on or a packaged tool for a specific question, because the answer changes who does the work and what it costs."
  - "ISO 23247-1 gives an overview and general principles of a digital twin framework for manufacturing, which helps you agree on vocabulary with vendors."
  - "Budget for data integration, model validation and upkeep as well as licenses, and keep a first pilot to one line and one decision."
faq:
  - q: "What is digital twin software in manufacturing?"
    a: "It is software that builds a model of a machine, line or plant and keeps it connected to real data. NIST describes a twin as a dynamic, data-driven representation that stays synchronized with its physical counterpart. Manufacturers use it to monitor assets, predict problems or test changes before touching the real plant."
  - q: "Do I need Azure Digital Twins for a digital twin in manufacturing?"
    a: "Not necessarily. Azure Digital Twins is a platform service for developers who build twin graphs from models and live data. It suits teams that want to create their own solution. If your question is narrower, such as testing capacity or product mix scenarios, a packaged tool may get you there with less development."
  - q: "How much does digital twin software cost?"
    a: "License fees are only part of it. Costs also come from sensors and connectivity, data preparation, building and validating the model, cloud consumption and the people who keep it up to date. Ask vendors for the total cost over three years on one pilot line, not just the subscription price."
---

Digital twin software for manufacturing builds a model of a machine, a line or a plant and keeps that model connected to real data, so you can monitor what is running, predict problems or test a change before you make it. This article is for plant managers who have to compare offers that all use the same words. It doesn't repeat the basics of what a twin is; it gives you a checklist for choosing software, from what it must contain to what it will cost you to keep alive.

## What should digital twin software for manufacturing include?

Start from a definition that vendors can't stretch. NIST describes a [digital twin](https://www.nist.gov/el/applied-economics-office/manufacturing/topics-manufacturing/digital-twins/essential-elements) as a dynamic, data-driven virtual representation that accurately replicates, connects to and synchronizes with its physical counterpart. It says a twin is not a static model, and it names three essential elements that determine its fidelity, utility and long-term viability: high-frequency sensing, reliable industrial IoT infrastructure for connectivity, and advanced simulation models for predictive analysis.

Turn those three elements into questions for any product:

1. **Data in.** Which sources does it read: machine controllers, sensors, MES, ERP, spreadsheets? How often does it refresh? Who builds and maintains each connection?
2. **A model that means something.** How is the plant described: assets, lines, processes, relationships? Can your own people change that description when the process changes?
3. **Analysis on top.** Does it only show current values, or can it predict, simulate and compare scenarios? Is that part built in, or is it a separate project?

Then add two practical needs: people must be able to read the results (dashboards, reports, alerts), and access must be controlled by role. If a product leaves out one of the five, ask who delivers it.

## What kinds of software are sold as digital twins?

The [digital twin](https://www.m365.fm/entity/digital-twin/) label covers very different things. Sort offers into four groups before you compare prices.

- **Platforms to build on.** They give you the pieces to store a model, connect data and query it. You or a partner build the solution on top.
- **Packaged production twins.** They come with a ready data model for production, for example for planning, simulation or optimization of a plant, and need less development.
- **Asset and condition twins.** They focus on the health of machines, using sensor data to spot wear and anomalies.
- **Design and commissioning twins.** They test layouts and control logic before equipment is installed.

A tool from one group answers a different question than a tool from another. A condition twin won't tell you whether a new shift model clears your backlog, and a production simulation won't tell you when a bearing will fail. Write down your decision first, then pick the group.

### What does a platform like Azure Digital Twins give you?

[Azure Digital Twins](https://www.m365.fm/entity/azure-digital-twins/) is the Microsoft example. According to [Microsoft Learn](https://learn.microsoft.com/en-us/azure/digital-twins/overview), it's a platform as a service for creating twin graphs based on digital models of environments such as buildings, factories or energy networks. You define your domain vocabulary in the Digital Twins Definition Language (DTDL), a JSON-like language, and twins are instances of those models. Relationships between twins form the graph, which you can query as a live, up-to-date representation. IoT Hub can supply device data, REST APIs and connectors can bring in business system data, and event routes can send twin data on to other [Azure](https://www.m365.fm/entity/azure/) services for analytics.

Two things matter for a buyer. First, this is a building block. It stores and connects the model. The what-if logic of a production simulation, with queues, setups and shift calendars, is a different piece of software, and the result is something you or a partner must develop. Second, the page states that Azure Digital Twins differs from the Fabric digital twin builder (preview) and from IoT Hub device twins. Check which one a colleague or vendor means before you plan around it.

History is a separate step. The graph is a live view, and Microsoft's page on [data history](https://learn.microsoft.com/en-us/azure/digital-twins/concepts-data-history) explains that you connect an instance to an Azure Data Explorer cluster to record graph updates over time, with an Event Hubs namespace in between. It also notes that messages emitted by data history are billed under the message pricing dimension. In other words, "we want to see last month's trends" adds components and a cost line. Ask any vendor the same question: where does history live, and what does it cost?

## Should you build on a platform or buy a packaged tool?

Use these questions to decide.

- **How specific is your question?** For a defined production question, such as capacity, staffing or product mix, a packaged tool usually reaches an answer sooner. For a broad, long-term digital foundation across many asset types, a platform gives flexibility.
- **Who will do the work?** A platform needs developers or a partner. Count their time. A packaged tool shifts work to configuration and data preparation.
- **How unique is your process?** The more unusual your process, the more a flexible model matters. Standard flows fit packaged tools better.
- **How long do you plan to keep it?** A model that lasts years needs an owner and a budget for change. Ask who will update it when you add a product family or move a line.
- **What do you already own?** If your IT team already runs a cloud platform and a data team, a platform build may fit. If you have neither, a packaged tool may be the more realistic route.

There's no correct answer for everyone. Many plants end up with both: a platform for the shared data foundation and a packaged tool for a specific decision. Plan the interface between them from the start.

## How do you check connectivity and standards?

A twin is only useful if data gets in and results get out. Ask how the software connects to equipment of different ages and makers.

One common route is OPC UA. The OPC Foundation describes it as carrying data from factory and process control devices to enterprise systems, with an emphasis on security, reliability and operation across platforms, and says it became the IEC 62541 standard in 2011. A vendor that speaks OPC UA can usually read many machines without custom drivers, though older equipment may need gateways or added sensors.

For the framework itself, [ISO 23247-1](https://www.iso.org/standard/75066.html) is the first part of the standard "Digital twin framework for manufacturing". ISO lists it as published in October 2021, with an overview and general principles, including terms, definitions and requirements of the framework. Reading it won't build your twin, but it gives your team and your vendors the same vocabulary. Ask whether a vendor's architecture refers to it and what that means in practice, not only in a slide.

Also ask about the edges of the system:

- Can you export your model and your data in an open format?
- Does it connect to your ERP, MES and reporting tools, for instance Power BI, without custom work for each report?
- What happens when a data feed stops? A twin that keeps showing old values with full confidence is worse than one that shows a gap.

## How do you judge security and access?

A twin ties together systems that were separate: machines, production orders, maybe supplier data. That widens the path an attacker could use, and widens the circle of people who can see your process.

Ask these questions in writing:

- Who can see and edit which parts of the model? Is access role-based, and can it be limited by plant or line?
- Where is data stored, who operates it and what happens to it if you leave?
- How are changes to models recorded, and can you roll back?
- Which security certifications does the vendor hold, and what is their scope? A certificate for the company doesn't automatically cover the product you're buying.
- How do updates and patches reach the system, and who is responsible for them?

If you share data with customers or suppliers, ask your customers whether they require specific security assessments before you connect anything.

## What does it really cost, and how do you measure value?

License fees are the visible part. The rest tends to arrive later:

- Sensors, gateways and network work for machines that have no digital output.
- Data preparation: cleaning, mapping and agreeing on definitions across systems.
- Building the model and validating it against real results.
- Cloud consumption, such as message volumes and storage for history.
- People who maintain the model after each process change.
- Training for the people who use the results.

Ask each vendor to price one pilot line over three years, including all of the above. Compare totals, not subscriptions.

For value, pick the measure before you start. Tie it to the decision the twin supports: unplanned downtime on the pilot line, lead time, schedule adherence, setup time, scrap or maintenance effort. Record a baseline for at least a few weeks, run the pilot, then compare. If you can't name a number that should move, you're not ready to buy.

Here is a hypothetical example. A plant manager wants to know whether a second shift on an assembly cell would clear a recurring backlog. Nothing here needs live machine data. A simulation built from routings, cycle times and calendars can answer it directly. A condition-monitoring twin with a sensor program would be a much bigger project and wouldn't answer the question at all. The cheapest tool that answers the decision wins.

## How do you keep a twin accurate over time?

Plants change, and a twin that isn't updated drifts away from reality. Set rules early.

1. **Name an owner** for each model, with a deputy.
2. **Version the model.** Record who changed what and why, and keep the ability to roll back.
3. **Tie model changes to plant changes.** A new product family, a moved machine or a changed shift pattern triggers a model review.
4. **Validate regularly.** Compare the twin's output with real results for a recent period and write down the gaps.
5. **Scale in steps.** Add the next line only when the first one has an owner, a validated model and a measurable result. When you go multi-plant, standardize core data definitions and allow controlled local variations.

## Common mistakes

- Buying software before naming the decision it should support.
- Comparing license prices and ignoring integration, validation and upkeep.
- Choosing a platform when a packaged tool would answer the question, or the other way round.
- Accepting a 3D picture as proof of a twin when live data doesn't drive it.
- Skipping the check of what happens when a data feed fails.
- Leaving the model without an owner after the project team moves on.
- Starting with the whole plant instead of one line.

## Where Polaris fits

If your first question is about planning and what-if decisions, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, combining ERP data with a manufacturing digital twin. The [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) module turns input data such as ERP data, process times, resource structures and constraints into a product-process-resource knowledge graph that serves as the single source of truth. The [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) module builds on it to test the production system virtually, including capacity, staffing and buffer scenarios. It's aimed at production planning decisions, not at condition monitoring of single machines, so match it to your question first.

## Related topics to explore

- **Standards and interoperability:** how OPC UA, other protocols and ISO 23247 fit together in a mixed machine park.
- **Middleware and integration:** connecting twins to ERP, MES and SCADA without a custom link for every report.
- **Model governance:** versioning, access roles and review cycles for models that change.
- **Scaling across plants:** central versus local models and how to keep data definitions aligned.
- **Total cost and return:** how to build a three-year cost view and a before-and-after measure for a pilot.

## Next step

Write down the one decision you want a twin to support, and the number that should change if it works. Take that page to your next vendor conversation and ask each vendor how their digital twin software for manufacturing would answer it on one pilot line, with what data, at what total cost over three years.
