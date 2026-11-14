---
title: "Real-Time Dataverse Events in Copilot Studio: Event Triggers, Service Endpoints and Where Event Grid Fits"
summary: "What Microsoft documents for reacting to Dataverse changes in Copilot Studio: the Dataverse event trigger, credentials and billing, Dataverse service endpoints, and what the pages do not say about Azure Event Grid."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [copilot-studio, dataverse, azure-event-grid, power-automate]
keypoints:
  - "Copilot Studio has an event trigger named When a row is added, modified or deleted for Dataverse, with the table selected in the trigger."
  - "Event triggers need generative orchestration, solution-aware cloud flow sharing and the agent maker's credentials."
  - "Trigger activity counts toward Copilot Credit consumption, and a payload is billed like a user message."
  - "Dataverse publishes events to Azure through service endpoints for Service Bus and Event Hubs. The page I read does not mention Event Grid."
  - "The Azure Event Grid connector lists one trigger, When a resource event occurs, and is available in Copilot Studio as a Premium connector."
faq:
  - q: "Can Copilot Studio react to Dataverse changes without Event Grid?"
    a: "Yes. According to Microsoft Learn, the event trigger When a row is added, modified or deleted lets you pick the table whose changes activate the agent. The agent then uses its instructions to choose actions or topics. This is the direct, documented route."
  - q: "Does Dataverse publish events to Azure Event Grid?"
    a: "The Dataverse Azure integration article I read describes Service Bus integration and mentions Event Hubs. It does not mention Event Grid, so I cannot confirm a native Dataverse to Event Grid path from it. Check the current Dataverse documentation before you design one."
  - q: "Whose credentials does an event trigger use?"
    a: "Microsoft Learn says event triggers can only use the agent maker's credentials. Users of a published agent may access data and systems through the author's credentials, and Copilot Studio shows a warning about this before you publish an agent with authenticated triggers."
  - q: "How are triggers billed?"
    a: "Learn says event trigger activity counts toward Copilot Credit consumption. Each trigger payload is processed like a user message and the response is billed at Copilot Credit rates. A recurrence trigger every 10 minutes sends a payload every 10 minutes."
---

The request is to stream real-time Dataverse events into Copilot Studio through Azure Event Grid. The documentation I could read supports a simpler core than that: Copilot Studio has a Dataverse event trigger, and Dataverse has its own Azure integration through service endpoints. The pages do not describe a combined path through Event Grid. This article explains the documented parts, what each one costs and requires, and where the gaps are, so you can decide with accurate information.

## Option 1: The Dataverse event trigger

Microsoft Learn describes event triggers as a way for an agent to act in response to an event without user input. They activate on events external to the agent. The named trigger **When a row is added, modified or deleted** (Dataverse) lets you select the table whose changes activate it. The default payload message is Use content from Body. Other named examples are SharePoint item created, OneDrive file created, Planner task completed and Recurrence.

How it works:

1. The trigger registers that the event occurred.
2. It sends a payload, as JSON or plain text, to the agent through a connector.
3. The agent uses its instructions to choose one or more actions or topics.

The agent does not invent new actions. You define what it can call. Learn recommends fewer than 15 actions or topics called consecutively.

### Requirements

- **Generative orchestration** must be on for the agent.
- **Solution-aware cloud flow sharing** must be on in the environment. Otherwise you cannot add triggers.
- Your organization's data policies must allow triggers. Admins can block event triggers in an environment.

### Add the trigger

1. On the agent's **Overview** page, go to **Triggers**.
2. Select **Add trigger** and choose the trigger.
3. Provide authentication details if needed and select **Next**.
4. Configure the event parameters and the trigger payload instructions.
5. Add the actions or topics the agent should call, and write instructions that say when to call each one.

Payload instructions should not conflict with the agent's instructions, or you may get errors or unexpected results. To change a trigger later, select the three dots, then **Edit in Power Automate**, and use the **Parameters** and **Code view** tabs.

### Test and publish

A new trigger does not react automatically until the agent is published. To test, generate one event in Dataverse, then on **Overview** select the **Test trigger** icon beside the trigger, choose the instance and select **Start testing**. The map icon in the test pane opens the activity map. After publishing, the **Activity** page shows triggers and reactions step by step.

### Credentials

Event triggers can only use the maker's credentials. For autonomous operation, configure every action with maker authentication that needs no user input. Learn says you can also instruct the agent not to request credentials from users. If an action needs user authentication or fails, the agent cannot continue the session. Narrow the trigger scope with parameters and tell the agent how to handle payload data, because payloads can contain sensitive information.

### Cost and limits

Event trigger activity counts toward Copilot Credit consumption, and each payload is processed like a user message. For Microsoft 365 Copilot license holders, agent flows called while responding to a trigger payload consume Copilot Credits at the standard rate and are blocked when the environment has none available. Frequent or recurring triggers use more resources, and exceeding quota limits can cause throttling. Admins can monitor usage in Power Platform.

For a busy Dataverse table, this matters. Every row change can be a billable payload, so use trigger parameters or filters to limit which changes reach the agent.

## Option 2: Dataverse service endpoints

The Dataverse Azure integration article describes how Dataverse sends event data outward. It covers Azure Service Bus integration and says Dataverse supports sending event data to an Azure Event Hubs solution. Events are published by plug-ins, either the out-of-box Azure-aware plug-in registered through a service endpoint with the Plug-in Registration tool or a custom one, or by custom workflow activities. The page recommends registering plug-ins to run asynchronously.

Contract types listed: Queue, One-way, Two-way, REST, Topic and Event Hubs. Key operational details:

- Each post runs as a system job visible in the **System Jobs** view.
- The default data format is .NET binary. XML or JSON are also supported.
- If the HTTP payload exceeds 192 KB, the ParentContext, InputParameters, PreEntityImages and PostEntityImages properties are removed and a MessageMaxSizeExceeded property is added when what remains is under the limit.
- For external Service Bus or network errors, the job enters a Wait state and retries at increasing intervals.

The page I read does not mention Azure Event Grid in this context.

## Where Event Grid fits

The Azure Event Grid connector reference lists one trigger, **When a resource event occurs** (CreateSubscription). It needs a subscription ID, resource type and resource name, with optional prefix, suffix and event type filters, and returns event data, time, type, ID, subject and topic. It lists no actions. It is Premium in Copilot Studio and Power Automate, Standard in Logic Apps, not available in Power Apps, and throttled at 100 calls per connection per 60 seconds.

What I could not confirm:

- That the Event Grid trigger appears in the Copilot Studio event trigger library. The event trigger article says the library contains triggers for Microsoft and partner services but does not list Event Grid.
- That Dataverse publishes events to Event Grid natively.

A reasonable design for Azure-side sources is therefore to use the connector in a cloud flow and test whether the agent can use it. For Dataverse changes alone, use the Dataverse trigger and skip the extra moving parts.

## Decision guide

- **Reacting to row changes in one environment:** the Dataverse event trigger.
- **Sending Dataverse events to other Azure consumers:** a service endpoint to Service Bus or Event Hubs.
- **Reacting to Azure resource events:** the Event Grid connector, after confirming availability in your agent.

## Common mistakes

- Expecting the trigger to fire before publishing the agent.
- Publishing with maker credentials without reviewing who can use the agent.
- Leaving a high-volume table unfiltered and spending credits on every change.
- Adding an action that needs user sign-in and expecting autonomous runs.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Azure Event Grid](https://www.m365.fm/entity/azure-event-grid/)
- [Azure Service Bus](https://www.m365.fm/entity/azure-service-bus/)

## Sources

- [Microsoft Learn: Event trigger overview](https://learn.microsoft.com/microsoft-copilot-studio/authoring-triggers-about)
- [Microsoft Learn: Add an event trigger](https://learn.microsoft.com/microsoft-copilot-studio/authoring-trigger-event)
- [Microsoft Learn: Azure integration with Dataverse](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/azure-integration)
- [Microsoft Learn: Azure Event Grid connector](https://learn.microsoft.com/en-us/connectors/azureeventgrid/)
