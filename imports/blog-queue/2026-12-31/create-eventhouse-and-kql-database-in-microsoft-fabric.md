---
title: "Create an Eventhouse and KQL Database in Microsoft Fabric: Steps and Naming Rules"
summary: "How to create an eventhouse and a KQL database in Microsoft Fabric Real-Time Intelligence, based on Microsoft Learn: prerequisites, creation and rename steps, naming rules, the embedded queryset, sharing, deletion, OneLake availability and capacity planning."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [fabric-eventhouse, eventhouse, fabric-real-time-intelligence, kql]
keypoints:
  - "You need a workspace with a Fabric-enabled capacity. Select New item, search for Eventhouse, enter a name and select Create."
  - "Creating an eventhouse also creates a default KQL database with the same name. The database can be renamed at any time."
  - "Names can contain alphanumeric characters, underscores, periods and hyphens. Special characters are not supported."
  - "Add another database under KQL Databases with the plus sign, or choose Eventhouse and then Database in the explorer."
  - "Deleting an eventhouse permanently deletes all of its child KQL databases."
faq:
  - q: "What do I need to create an eventhouse?"
    a: "According to Microsoft Learn, a workspace with a Microsoft Fabric-enabled capacity. The page lists no other prerequisites and does not describe workspace roles."
  - q: "Is a KQL database created automatically?"
    a: "Yes. According to Microsoft Learn, creating an eventhouse creates a default child KQL database with the same name, and the database can be renamed at any time."
  - q: "Which characters can I use in the name?"
    a: "According to Microsoft Learn, alphanumeric characters, underscores, periods and hyphens. Special characters are not supported."
  - q: "What happens if I delete an eventhouse?"
    a: "According to Microsoft Learn, deleting an eventhouse permanently deletes the eventhouse and all its child KQL databases."
---

To create an eventhouse in Microsoft Fabric, open a capacity-backed workspace, select **New item**, choose **Eventhouse**, enter a name and select **Create**. A KQL database with the same name is created with it. This guide follows the Microsoft Learn articles on creating an eventhouse and on creating a KQL database, plus the eventhouse overview.

## What an eventhouse is

An eventhouse lets you manage several databases together. They share capacity and resources, which Learn says optimizes performance and cost, and you get unified monitoring and management across all databases and for each one. The overview describes an eventhouse as a container of KQL databases, which can be standard databases or shortcut databases. In Real-Time Intelligence data is organized as eventhouses, KQL databases and tables.

## Prerequisites

Learn lists one prerequisite: a workspace with a Microsoft Fabric-enabled capacity. The page does not describe specific workspace roles.

## Create the eventhouse

1. In the Fabric portal, switch to the Fabric experience if needed, and select **My workspace**.
2. On the workspace page, select **New item**.
3. In the **New item** pane, search for **Eventhouse** and select it.
4. Enter a name and select **Create**.
5. The system overview opens in the main view area.

An eventhouse and its default child KQL database are created, both with the same name. The eventhouse name can contain alphanumeric characters, underscores, periods and hyphens. Special characters are not supported.

## Add a KQL database

Learn describes two ways in the **Eventhouse explorer**:

- Select **Eventhouse**, then **+ Database**.
- Under **KQL Databases**, select **+**.

Enter a database name, keep **New database (default)** selected and select **Create**. The database is created in the selected eventhouse. The same naming rules apply.

Creating a database also creates an attached KQL queryset, named after the database with the suffix `_queryset`. To rename it, select the pencil icon next to its name. The page also mentions an SQL analytics endpoint, a notebook or a standalone KQL queryset as other options.

A database shortcut is not a dialog option on this page. The page tells you to follow the separate article on creating a database shortcut, where shortcuts can include all source subitems or only selected ones.

## Rename, share and delete

- **Rename an eventhouse:** browse to the workspace, hover over the item, select **...**, select **Settings**, and update the name in the right pane.
- **Share:** the page describes sharing a link through **Share**, with the permissions **Share** and **Edit**. A note on the same page says that sharing the eventhouse is not supported and only individual databases can be shared. The two statements conflict and the page does not resolve it.
- **Delete:** hover over the item, select **...**, and select **Delete**. This permanently deletes the eventhouse and all its child KQL databases.

## When to use an eventhouse

The overview describes eventhouses as databases designed for storing and analyzing streaming data. It recommends them for any scenario with event-based data, and names telemetry and log data, time series and IoT data, security and compliance logs, and financial records. They handle structured, semistructured (JSON, XML) and unstructured data such as free text. Data can arrive from sources such as Eventstream, SDKs, Kafka, Logstash and data flows.

## OneLake availability and the SQL analytics endpoint

OneLake availability can be enabled on a database or table level. The **Analyze data with**, **SQL analytics endpoint** option appears for eventhouses and KQL databases only when OneLake availability and schema synchronization are enabled on the database. The creation article does not mention OneLake availability.

When you enable the Eventhouse endpoint from a Lakehouse or Data Warehouse, Fabric automatically creates an eventhouse and KQL database as child items of that source item. They stay in the originating workspace, and backend schema synchronization keeps them aligned.

## Capacity Planner

Learn says an eventhouse is designed to optimize cost by suspending the service when it is not in use, and that reactivation might add a latency of a few seconds. For time-sensitive systems you can enable **Capacity Planner**, so the eventhouse is always active.

- The schedule is a 7-day recurring schedule in 60-minute blocks.
- Each block can have a minimum capacity or none, with autoscale still enabled.
- The default minimum is 2 capacity units if no minimum is set.
- A scheduled minimum stops autoscale from going below the baseline in that window, but autoscale can still scale up.

Pricing figures and the UI steps are not on the overview. They are in the linked article on configuring Capacity Planner.

## Monitoring views

The system overview page shows eventhouse details, advisory findings, storage, system resources, compute usage, activity in minutes by application, ingestion rate, top queried databases, top ingested databases and schema changes. The databases page can be shown as a list or as tiles. The tile view shows details such as the database activity tracker, tables, a data preview and query insights for the top 100 queries.

## Sharing and permissions

The overview says that when you share a direct link to an eventhouse, the recipient inherits the sender's permission level to all eventhouse items. These include KQL databases and tables, dashboards, functions, materialized views and embedded querysets. KQL databases can also be shared individually. Users with database-only access do not get eventhouse-level navigation such as the system overview or the list of databases. The page names no permission roles.

## Suggestion: a starting layout

This section is a practical suggestion and not a Microsoft statement.

1. Create one eventhouse per project or team and use clear names, because only a limited set of characters is allowed.
2. Rename the default database to something that states its data.
3. Create further databases only when data needs different sharing or lifecycle.
4. Confirm the sharing behavior in your tenant, because of the contradiction on the page.

## Not covered

The pages I read do not describe the following:

- Default retention and cache policies, and how to find the query and ingestion URIs.
- Workspace roles needed to create an eventhouse.
- Pricing, KQL code and API steps.

## Related

- [Fabric Eventhouse](https://www.m365.fm/entity/fabric-eventhouse/)
- [Eventhouse](https://www.m365.fm/entity/eventhouse/)
- [Fabric Real-Time Intelligence](https://www.m365.fm/entity/fabric-real-time-intelligence/)
- [KQL](https://www.m365.fm/entity/kql/)

## Sources

- [Create an eventhouse (Microsoft Learn)](https://learn.microsoft.com/fabric/real-time-intelligence/create-eventhouse)
- [Create a KQL database (Microsoft Learn)](https://learn.microsoft.com/fabric/real-time-intelligence/create-database)
- [Eventhouse overview (Microsoft Learn)](https://learn.microsoft.com/fabric/real-time-intelligence/eventhouse)
