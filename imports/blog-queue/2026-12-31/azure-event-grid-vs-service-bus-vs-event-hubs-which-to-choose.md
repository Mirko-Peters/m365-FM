---
title: "Azure Event Grid vs Service Bus vs Event Hubs: Choosing a Messaging Service"
summary: "Compare Azure Event Grid, Event Hubs and Service Bus using the Microsoft Learn comparison page: events versus messages, purpose, delivery, ordering, transactions, protocols, editions, and how the three services can be used together."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [azure-event-grid, azure-service-bus, azure-event-hubs, event-driven-architecture]
keypoints:
  - "Learn separates events, which are lightweight notifications, from messages, which carry raw data under a contract between publisher and consumer."
  - "Event Grid is for reactive event routing, Event Hubs for big data streaming and ingestion, and Service Bus for enterprise transactional messaging."
  - "All three offer at-least-once delivery. Only Service Bus lists transactions, duplicate detection and FIFO ordering with sessions."
  - "Event Hubs lists ordering per partition and capture and replay with Event Hubs Capture. Event Grid lists no ordering guarantee."
  - "The page gives no pricing, quotas, message size limits or retention periods, so check those elsewhere."
faq:
  - q: "What is the difference between an event and a message?"
    a: "According to Microsoft Learn, an event is a lightweight notification of a condition or state change where the publisher has no expectation about handling. A message is raw data with a contract between publisher and consumer."
  - q: "Which service supports transactions?"
    a: "According to the Microsoft Learn comparison table, only Service Bus lists transactions. Event Grid and Event Hubs list no."
  - q: "Which protocols does each service use?"
    a: "The Learn table lists MQTT and HTTP for Event Grid, AMQP, Kafka and HTTP for Event Hubs, and AMQP and HTTP for Service Bus."
  - q: "Can I use the services together?"
    a: "Yes. Microsoft Learn describes using them side by side for distinct roles, or linked as a pipeline, for example Event Grid with Event Hubs to stream data into Azure Synapse Analytics."
---

Choose Event Grid to react to events, Event Hubs to ingest and stream large volumes of telemetry, and Service Bus for transactional messaging between applications. This follows the Microsoft Learn comparison page, which calls its first table a starting point for consideration.

## Events and messages

Learn defines the two terms:

- **Event:** a lightweight notification of a condition or state change. The publisher has no expectation about how the event is handled. Events can be discrete, reporting an actionable state change, or part of a time-ordered series that can be analyzed. Discrete events suit serverless solutions that need to scale.
- **Message:** raw data produced by a service to be consumed or stored elsewhere. The message contains the data that triggered the pipeline, and a contract exists between publisher and consumer. The page's example is a publisher that sends raw data and expects the consumer to create a file and report back when done.

## Choose a candidate

| Criterion | Event Grid | Event Hubs | Service Bus |
|---|---|---|---|
| Primary purpose | Reactive event routing | Big data streaming and ingestion | Enterprise transactional messaging |
| Data model | Events (discrete notifications) | Event streams (time-ordered series) | Messages (high-value payloads) |
| Delivery guarantee | At least once | At least once | At least once, optionally ordered, exactly once with sessions |
| When to use | React to status changes, serverless architectures | Telemetry, distributed data streaming, real-time analytics | Order processing, financial transactions, workflows |

## Scale and throughput

| Criterion | Event Grid | Event Hubs | Service Bus |
|---|---|---|---|
| Throughput | Dynamically scalable, serverless | Millions of events per second | Reliable asynchronous delivery |
| Latency model | Near-real-time event delivery | Low latency streaming | Brokered with optional long polling |
| Scaling model | Automatic (serverless) | Throughput units or processing units | Messaging units (Premium) |

## Messaging features

| Criterion | Event Grid | Event Hubs | Service Bus |
|---|---|---|---|
| Protocol | MQTT, HTTP | AMQP, Kafka, HTTP | AMQP, HTTP |
| Publish and subscribe | Yes | Yes, with consumer groups | Yes, with topics and subscriptions |
| Ordering | No guarantee | Per partition | FIFO with sessions |
| Transactions | No | No | Yes |
| Duplicate detection | No | No | Yes |
| Dead-lettering | Yes | No | Yes |
| Batching | Yes | Yes, event batches | Yes, sessions |
| Capture and replay | No | Yes, Event Hubs Capture | No |

## Integration and editions

Learn describes Event Grid as deeply integrated with Azure services and third-party services. Event Hubs fits stream-processing infrastructures and analytics services. Service Bus fits enterprise applications, hybrid cloud and on-premises connectivity.

Editions listed on the page: Event Grid is offered as Azure Event Grid (PaaS) and Event Grid on Kubernetes with Azure Arc. Event Hubs has Standard, Premium and Dedicated. Service Bus has Basic, Standard and Premium.

## Using the services together

Learn describes two patterns:

- **Side by side**, each with its own role. The page's example is an e-commerce site that uses Service Bus to process orders, Event Hubs to capture site telemetry, and Event Grid to respond to events such as an item being shipped.
- **Linked as a pipeline.** Event Grid can respond to events in the other services. The page links to an example that uses Event Grid with Event Hubs to stream data into Azure Synapse Analytics.

## Suggestion: questions that narrow the choice

This section is a practical suggestion that restates the table as questions. It is not a Microsoft statement.

1. Does a producer simply announce that something happened, or does it hand over data that someone must process? The first points to Event Grid, the second to Service Bus.
2. Do you need to keep a stream and replay it? The table lists capture and replay only for Event Hubs.
3. Do you need transactions or duplicate detection? The table lists them only for Service Bus.
4. Do clients speak MQTT or Kafka? The table lists MQTT for Event Grid and Kafka for Event Hubs.

## Not covered

The page I read does not describe the following:

- Pricing, cost comparisons and SLAs.
- Quotas, message size limits, retention periods and partition counts.
- Throughput figures beyond millions of events per second for Event Hubs.
- Authentication, security and regional availability.
- Code examples.

## Related

- [Azure Event Grid](https://www.m365.fm/entity/azure-event-grid/)
- [Azure Service Bus](https://www.m365.fm/entity/azure-service-bus/)
- [Azure Event Hubs](https://www.m365.fm/entity/azure-event-hubs/)
- [Event-driven architecture](https://www.m365.fm/entity/event-driven-architecture/)

## Sources

- [Compare Messaging Services (Microsoft Learn)](https://learn.microsoft.com/azure/service-bus-messaging/compare-messaging-services)
