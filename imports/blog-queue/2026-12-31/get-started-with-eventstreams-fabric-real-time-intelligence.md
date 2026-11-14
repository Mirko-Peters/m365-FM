---
title: "Get Started With Eventstreams in Fabric Real-Time Intelligence: Create, Route and Limits"
summary: "How to create an eventstream in Microsoft Fabric Real-Time Intelligence, based on Microsoft Learn: prerequisites, the creation steps, supported sources, transformations, destinations, and documented limits such as message size and retention."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [fabric-real-time-intelligence, eventstream, fabric-eventhouse]
keypoints:
  - "To create an eventstream you need a workspace in Fabric capacity or trial license mode and Contributor or higher permissions on that workspace."
  - "Create it with New item, search for Eventstream, enter a name in the New Eventstream window and select Create. The editor opens so you can add sources."
  - "Learn lists transformations such as Filter, Manage fields, Aggregate, Group by, Union, Expand and Join, plus a SQL operator that is in preview."
  - "Destinations include a custom endpoint, an Eventhouse, a Lakehouse, a derived stream and Activator. A Spark Notebook destination is listed as preview."
  - "The overview page documents a 1 MB message size, retention of up to 90 days and at-least-once delivery."
faq:
  - q: "Which permissions do I need to create an eventstream?"
    a: "According to Microsoft Learn, you need access to a workspace in Fabric capacity license mode or trial license mode, and Contributor or higher permissions on that workspace."
  - q: "Which capacity size does an eventstream need?"
    a: "According to the Microsoft Learn overview, an eventstream needs at least F4 capacity. Check the current overview page before you size a capacity, because sizing is not covered in the creation article."
  - q: "How large can a message be and how long is data kept?"
    a: "According to Microsoft Learn, the message size limit is 1 MB and retention can be up to 90 days. Delivery is at-least-once."
  - q: "Can I send data from an eventstream to a Lakehouse or Eventhouse?"
    a: "Yes. According to Microsoft Learn, an eventstream can route to an Eventhouse, either by direct ingestion or event processing, and to a Lakehouse in Delta format."
---

An eventstream in Microsoft Fabric Real-Time Intelligence captures streaming events from a source, optionally transforms them, and routes them to one or more destinations. You create one from a workspace with **New item**, give it a name, and then add sources and destinations in the editor. This guide follows the Microsoft Learn overview and the article on creating and managing an eventstream.

## Prerequisites

Learn names two prerequisites for creating an eventstream:

- Access to a workspace in Microsoft Fabric capacity license mode or in trial license mode.
- Contributor or higher permissions on that workspace.

The overview page also states that an eventstream needs at least F4 capacity. The creation article does not repeat this and does not cover capacity sizing or pricing, so confirm the figure on the live overview page before you plan a deployment.

## Create an eventstream

Learn describes these steps:

1. Go to the Fabric portal.
2. Select **My workspace** on the left navigation bar.
3. On the workspace page, select **+ New item** on the command bar.
4. On the **New item** page, search for **Eventstream** and select **Eventstream**.
5. In the **New Eventstream** window, enter a name and select **Create**.
6. Wait a few seconds. You are taken to the main editor, where you can start adding sources.

The page describes the editor only as the place where you start adding sources and does not describe the editor controls in text. It says enhanced capabilities are enabled by default now, and that eventstreams created with standard capabilities keep working and can still be edited and published. The overview also offers an opt-in schema-aware eventstream (preview) as a second experience. The creation page does not explain how to edit or delete an eventstream afterwards.

## What can feed an eventstream

The overview lists sources such as Azure Event Hubs, Azure Event Grid, Azure Service Bus, Azure IoT Hub, a custom endpoint, sample data, change data capture connectors for databases, and Kafka-based sources. The list on the page is longer than this and also includes, for example, Amazon Kinesis Data Streams, Google Cloud Pub/Sub, MQTT (preview), Confluent Cloud and several more CDC connectors. Sources change over time, so check the live overview for the current set.

Learn also notes that the eventstreams feature is associated with Azure Event Hubs: an event hub namespace is created automatically with each eventstream, and an Apache Kafka endpoint is available.

## Transformations

Between source and destination you can add operators. The overview lists:

- Filter
- Manage fields
- Aggregate
- Group by
- Union
- Expand
- Join
- A SQL operator, which is marked as preview

The page names these operators but the overview does not give configuration steps for each one.

## Destinations

The overview lists these destination types:

| Destination | Notes from Learn |
|---|---|
| Custom endpoint | Send events to your own consumer |
| Eventhouse | Direct ingestion or event processing |
| Lakehouse | Data is written in Delta format |
| Spark Notebook | Listed as preview |
| Derived stream | Reuse processed output as a new stream |
| Activator | Trigger actions from the data |

One eventstream can have several destinations, so one stream can feed analytics and alerting at the same time.

## Documented limits and behavior

The overview documents these values:

- Message size limit of 1 MB.
- Retention of up to 90 days.
- At-least-once delivery. Design downstream consumers so that a repeated event does not cause a wrong result.

Schema-aware eventstreams and DeltaFlow are described as preview features on the overview page. Preview features can change, so check their status before you depend on them.

## Suggestion: a sensible build order

This section is a practical suggestion and not a Microsoft statement.

1. Create the eventstream and add the sample data source first. This lets you check the editor, the operators and the destination without connecting a production system.
2. Add the destination you actually need, for example an Eventhouse, and confirm that events arrive.
3. Replace the sample source with the real source.
4. Add operators one at a time, so you can see which one changes the output.

Because delivery is at-least-once, plan a key or timestamp that lets downstream queries remove duplicates.

## Not covered

The pages I read do not describe the following:

- Editing or deleting an eventstream after creation.
- Pricing or the capacity consumption of an eventstream.
- Per-operator configuration steps on the overview page.
- Per-source setup steps, which live in the individual source articles.
- Troubleshooting for a source that does not deliver events.

## Related

- [Fabric Real-Time Intelligence](https://www.m365.fm/entity/fabric-real-time-intelligence/)
- [Eventstream](https://www.m365.fm/entity/eventstream/)
- [Fabric Eventhouse](https://www.m365.fm/entity/fabric-eventhouse/)

## Sources

- [Microsoft Fabric Eventstreams Overview (Microsoft Learn)](https://learn.microsoft.com/fabric/real-time-intelligence/event-streams/overview)
- [Create an eventstream in Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/real-time-intelligence/event-streams/create-manage-an-eventstream)
