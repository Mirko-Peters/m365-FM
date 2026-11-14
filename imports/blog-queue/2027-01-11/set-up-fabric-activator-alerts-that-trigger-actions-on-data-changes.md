---
title: "How to Set Up Fabric Activator Alerts That Trigger Actions on Data Changes"
summary: "What Fabric Activator is and how a rule works: events, objects, properties, stateless and stateful rules, lookback, data sources, supported actions and the high-level creation flow, and the setup steps that the Learn introduction does not give."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [fabric-data-activator]
keypoints:
  - "Fabric Activator is a no-code event detection engine that turns data streams into automated actions. It is part of Fabric Real-Time intelligence."
  - "Core concepts are events, objects, properties, rules, lookback period and actions. Rules are scoped to objects and are stateless or stateful."
  - "Sources include eventstreams, Fabric events, Azure events, Power BI reports, Real-Time dashboards and, in preview, Data Warehouse SQL query results."
  - "Actions include email, Teams messages, Power Automate flows and Fabric items such as pipelines, notebooks and dataflows."
  - "The page gives no step-by-step setup, no roles or SKUs and no prices. It says billing is pay-as-you-go and applies only while rules are actively running."
faq:
  - q: "What is Fabric Activator?"
    a: "Microsoft Learn calls it a no-code event detection engine that transforms data streams into automated actions. It monitors data sources with low latency and starts actions when thresholds are met or patterns are detected."
  - q: "What is a rule?"
    a: "A condition to detect plus the actions to take. Rules are stateless, such as value below 50, or stateful, such as DECREASES, BECOMES, EXIT RANGE and heartbeat or absence detection."
  - q: "What can an alert do?"
    a: "Send email, post a Teams message to an individual, group or channel, run a Power Automate flow, or start Fabric items such as pipelines, notebooks, Spark job definitions, dataflows, user data functions and copy jobs."
  - q: "Where does the data come from?"
    a: "Eventstreams are primary. Others are Fabric events, Azure events, business events, Power BI reports, Real-Time dashboards, and in preview ontology entities and Data Warehouse SQL query results."
  - q: "How is it billed?"
    a: "The page says Activator is scoped to Fabric capacities and deployed per workspace. Billing is pay-as-you-go and applies only when rules are actively running. It gives no figures."
---

Fabric Activator watches data and does something when a condition is met: it sends a message, starts a flow or runs a Fabric item. This guide follows the Microsoft Learn page What is Fabric Activator? The page explains concepts and sources. It does not give step-by-step setup and links no setup tutorial.

## What it is

Fabric Activator is a no-code event detection engine that transforms data streams into automated actions. It monitors data continuously with low latency. The page states subsecond latency for stateless rules on streaming data. It is the event detection and rules engine in the Fabric Real-Time intelligence stack.

## Concepts

| Concept | Meaning on the page |
| --- | --- |
| Events | Individual records, such as a telemetry signal or a file drop, received through an eventstream. Each has a timestamp, a payload and identifier attributes |
| Objects | The entities you monitor, grouped by a shared identifier such as a device ID. Rules are scoped to objects and evaluated per instance |
| Properties | Fields of an object that you want to monitor. They can be reused across rules |
| Rules | Conditions to detect plus the actions to take. Stateless or stateful |
| Lookback period | The historical window Activator analyzes to evaluate a rule. Example: a three-hour average needs a six-hour lookback |
| Actions | What runs when a rule fires. Activator continues monitoring without waiting for the action to complete |

## Data sources

- Eventstreams, the primary source, for example Azure Event Hubs and IoT Hub.
- Fabric events and Azure events.
- Business events.
- Ontology business entities (preview).
- Power BI reports, including new-row detection on table visuals.
- Fabric Real-Time dashboards.
- Fabric Data Warehouse SQL query results (preview), evaluated on a schedule.

## Actions

- Fabric items: pipelines, notebooks, Spark job definitions, dataflows, user data functions, copy jobs and publish business event (preview).
- Power Automate flows for external actions.
- Teams messages to an individual, group or channel.
- Email.

## Creation flow at a high level

The page does not give steps. From its concepts, a rule involves these parts, which is an inference and not a procedure:

1. Connect an event source such as an eventstream.
2. Choose a column as the object identifier and columns as properties.
3. Define a stateless or stateful condition, with a lookback period where needed.
4. Review the preview, which estimates how often the rule would have fired on past data.
5. Choose actions and activate the rule.

Rules can also be created from an eventstream, from Fabric Maps and from Power BI report visuals. The page links Activator limitations, Latency in Activator and an article on alert rules for Data Warehouse SQL queries, but no tutorial on creating and activating a rule.

## Capacity and billing

Activator instances are scoped to Fabric capacities and deployed per workspace. Billing is pay-as-you-go and applies only when rules are actively running. Known constraints are on a separate Activator limitations page.

## What the page does not say

- Step-by-step instructions.
- Roles, permissions or supported Fabric SKUs.
- Prices or capacity unit figures.
- Availability and limits of the preview features.
- The page is inconsistent on whether Activator subscribes to one or more or two or more eventstreams.

## A starting outline

This outline is my advice, built on the page.

1. Pick one stream and one clear condition, such as a threshold.
2. Choose the object identifier carefully, because rules are evaluated per object.
3. Check the preview of how often the rule would fire before you activate it.
4. Start with an email or Teams action, then move to flows and Fabric items.
5. Read the linked limitations and latency pages before you rely on it, and look elsewhere for a setup tutorial.

## Typical mistakes (my advice)

- Choosing a lookback shorter than the window the condition needs.
- Forgetting that rules run per object instance.
- Expecting action completion to affect monitoring. Activator does not wait for it.
- Assuming preview sources are ready for production.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Kind of tool | No-code event detection engine |
| Rule types | Stateless and stateful |
| Primary source | Eventstreams |
| Actions | Email, Teams, Power Automate, Fabric items |
| Scope | Fabric capacities, deployed per workspace |
| Billing | Pay-as-you-go while rules run |

## Stateless and stateful rules

A stateless rule checks a single value against a condition, for example a value below 50. The page says these rules can react with subsecond latency on streaming data. A stateful rule looks at how values change over time, with conditions such as DECREASES, BECOMES and EXIT RANGE, or detects that a heartbeat is missing. Rules that analyze trends or aggregations use the lookback period, the window of past data that Activator needs to evaluate the rule. Stateful rules only fire on entry into a new state, which prevents repeated firings while a condition is unchanged.

## More from the page

- **Distinct, active object IDs.** Activator tracks active object IDs, meaning objects with events inside the lookback period. The number of distinct object IDs you track within the lookback window also sets limits. The page does not give the limits.
- **Use cases.** The page lists examples such as notifying managers about malfunctioning freezers, rerunning failed jobs, and alerting account teams when customers fall into arrears.
- **Orchestration.** The page describes patterns such as ingestion, detection and transformation with a pipeline, or detection and notification through Power Automate.

## Related

- [Fabric Activator](https://www.m365.fm/entity/fabric-data-activator/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Teams](https://www.m365.fm/entity/teams/)

## Sources

- [What is Fabric Activator? (Microsoft Learn)](https://learn.microsoft.com/fabric/real-time-intelligence/data-activator/activator-introduction)
