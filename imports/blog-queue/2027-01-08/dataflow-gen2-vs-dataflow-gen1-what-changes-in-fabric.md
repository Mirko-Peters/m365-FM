---
title: "Dataflow Gen2 vs Dataflow Gen1: What Changes in Microsoft Fabric"
summary: "Compare Dataflow Gen2 and Gen1 in Microsoft Fabric: the feature table, output destinations, monitoring, pipelines, high-performance compute, the Direct Query difference, CI/CD defaults and the three migration methods."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [dataflow-gen2, fabric-data-factory]
keypoints:
  - "Gen2 adds simpler creation, AutoSave, multiple output destinations, better monitoring, pipeline integration and high-performance compute. Gen1 keeps Direct Query through the dataflow connector."
  - "Gen1 stores output in its own internal storage. Gen2 can use that storage or send data to destinations such as Fabric Lakehouse, Warehouse, Azure SQL and SharePoint Files."
  - "Gen2 requires a Fabric capacity, a Fabric trial capacity or a Power BI Premium capacity."
  - "As of April 2026, all new Gen2 items are created with CI/CD and Git integration support. The classic option is no longer available."
  - "Migrate with export to PQT and import, copy and paste of queries, or Save As, which creates a Gen2 item with CI/CD support in one action."
faq:
  - q: "What is the main difference between Gen2 and Gen1?"
    a: "According to Microsoft Learn, Gen2 is the newer version with a simpler creation process, AutoSave, multiple output destinations, better monitoring, pipeline support and high-performance compute. Gen1 is the original Power BI dataflow."
  - q: "Where does each store data?"
    a: "Gen1 stores transformed data in its own internal storage, accessible through the dataflow connector. Gen2 can use that storage or send data to other destinations."
  - q: "What does Gen1 do that Gen2 does not?"
    a: "The page's table shows one difference in Gen1's favor: Direct Query via the dataflow connector."
  - q: "Do I need Fabric capacity for Gen2?"
    a: "Yes. Learn says Gen2 requires a Fabric capacity, a Fabric trial capacity or a Power BI Premium capacity."
  - q: "How do I move from Gen1 to Gen2?"
    a: "Export Gen1 queries to a PQT file and import them, copy and paste the queries into the Gen2 editor, or use Save As to create a Gen2 item with CI/CD and Git integration support."
---

Dataflow Gen2 is the newer version of the low-code data preparation tool that works alongside the original Power BI dataflow, now called Gen1. Learn recommends Gen2 if you are starting fresh. This guide follows the Microsoft Learn overview of Dataflow Gen2 and its comparison with Gen1.

## What the two are

Dataflows prepare and transform data without code, with a low-code interface, hundreds of data sources and more than 300 transformations. Gen2 is built on the Power Query experience and loads results into multiple destinations.

## The feature table

| Feature | Gen2 | Gen1 |
| --- | --- | --- |
| Create dataflows with Power Query | Yes | Yes |
| Simpler creation process | Yes | No |
| AutoSave and background publishing | Yes | No |
| Multiple output destinations | Yes | No |
| Better monitoring and refresh tracking | Yes | No |
| Works with pipelines | Yes | No |
| High-performance computing | Yes | No |
| Connect through the dataflow connector | Yes | Yes |
| Direct Query through the dataflow connector | No | Yes |
| Refresh only changed data | Yes | Yes |
| AI-powered insights | Yes | Yes |
| Recent data shortcuts to previously used sources | Yes | No |

## The differences in practice

- **Authoring.** Fewer steps to create a dataflow. Gen2 saves changes automatically, and publishing saves your work and runs background validations.
- **Destinations.** Gen1 stores transformed data in its own internal storage. Gen2 can use that or send data elsewhere. The page lists the destinations it currently supports: Azure SQL databases, Azure Data Explorer (Kusto), Azure Data Lake Gen2, Fabric Lakehouse tables and files, Fabric Warehouse, Fabric KQL database, Fabric SQL database, SharePoint Files, Snowflake database and PostgreSQL database.
- **Monitoring.** Gen2 integrates with the Monitoring hub and has an improved refresh history.
- **Pipelines.** Pipelines can trigger dataflows, and they can also copy data, run SQL queries, run stored procedures or run notebooks.
- **High-performance compute.** Gen2 uses Fabric SQL compute engines and creates both Lakehouse and Warehouse items in your workspace. You may see DataflowsStagingLakehouse or DataflowsStagingWarehouse. Learn says they are internal and can be ignored.
- **Recent data.** A module remembers tables, files, folders, databases and sheets you used before.
- **Copilot.** Natural-language transformations are supported, with an Undo action.

## CI/CD and Git

As of April 2026, creating Gen2 items without CI/CD and Git integration (formerly Dataflow Gen2 Classic) is no longer possible. All new Gen2 items are created with CI/CD and Git integration by default. Existing items without CI/CD continue to work. The page does not say whether Gen1 supports CI/CD.

## Capacity

Gen2 requires a Fabric capacity, a Fabric trial capacity or a Power BI Premium capacity. Licensing details are on a separate page.

## Migrate from Gen1

1. **Export and import.** Export Gen1 queries to a PQT file and import it into Gen2.
2. **Copy and paste.** Copy queries from Gen1 and paste them into the Gen2 editor.
3. **Save As.** Save an existing dataflow as a new Gen2 item with CI/CD and Git integration in one action.

## What the page does not say

- A limitations section. The only restriction in the comparison is Direct Query.
- What Fast Copy does. It is mentioned in the introduction but not explained or compared.
- Performance or capacity unit cost numbers.
- A retirement or end-of-support date for Gen1.
- Which queries or connectors may not transfer during migration.
- Destination write modes and schema handling.

## A migration checklist

This checklist is practical advice built on the page.

1. List Gen1 dataflows and note which reports use Direct Query through the dataflow connector. Gen2 does not offer that.
2. Confirm that you have Fabric or Premium capacity.
3. Choose Save As for a quick copy, or export and import for a controlled move.
4. Pick a destination for each dataflow and test a refresh.
5. Check monitoring in the Monitoring hub.

## Typical mistakes

- Migrating a dataflow whose reports rely on Direct Query.
- Deleting the staging Lakehouse or Warehouse items that Gen2 creates.
- Assuming Gen2 runs without Fabric or Premium capacity.
- Expecting a classic non-CI/CD option for new items.

## Related

- [Dataflow Gen2](https://www.m365.fm/entity/dataflow-gen2/)
- [Fabric Data Factory](https://www.m365.fm/entity/fabric-data-factory/)
- [Power Query](https://www.m365.fm/entity/power-query/)
- [Fabric Lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)

## Sources

- [Differences between Dataflow Gen1 and Dataflow Gen2 - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/data-factory/dataflows-gen2-overview)
