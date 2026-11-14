---
title: "What Is a Semantic Model in Fabric? Lakehouse, Warehouse, Data Factory and Security Basics"
summary: "A plain explanation of the semantic model in Microsoft Fabric and how it relates to the lakehouse, the warehouse, Data Factory and the Fabric security layers, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-25
topics: [fabric, semantic-model, fabric-lakehouse, fabric-warehouse]
keypoints:
  - "A semantic model is data ready for reporting. It holds data or queries, the model design (relationships, calculations) and optional row-level security rules."
  - "A lakehouse handles structured and unstructured data with Spark. A warehouse is T-SQL based and supports multi-table transactions. Both store Delta tables on OneLake."
  - "Each lakehouse gets a read-only SQL analytics endpoint. Since September 5, 2025, a default semantic model is no longer created automatically with a lakehouse."
  - "Data Factory in Fabric moves, transforms and orchestrates data with copy jobs, Dataflow Gen2, mirroring and pipelines."
  - "Fabric authenticates every request with Microsoft Entra ID and controls access through workspace roles, item permissions, data-level security and sensitivity labels."
faq:
  - q: "What is a semantic model in Fabric?"
    a: "Microsoft Learn describes Power BI semantic models as a source of data that is ready for reporting and visualization. A model can store imported data, issue pass-through queries to the source, or both. It also contains the model design, including data preparation queries, relationships and calculations, and it can enforce row-level security."
  - q: "Do I still get a default semantic model with a new lakehouse?"
    a: "No. The Microsoft Learn lakehouse page states that since September 5, 2025, default semantic models are no longer created automatically when you create a lakehouse. Existing default semantic models were decoupled from their parent items by November 30, 2025 and became independent semantic models."
  - q: "Should I choose a lakehouse or a warehouse?"
    a: "According to Microsoft Learn, choose a warehouse for an enterprise-scale solution with an open standard format, minimal setup and little tuning. Choose a lakehouse for large volumes of unstructured data from different sources, especially when Spark is your main tool. Both use the same SQL engine for T-SQL queries, and you can add the other item later."
  - q: "What is the SQL analytics endpoint?"
    a: "Microsoft Learn says Fabric generates a SQL analytics endpoint automatically when you create a lakehouse. It is read-only, lets you query Delta tables with T-SQL, and lets you create a Power BI semantic model on top. Only Delta tables appear in it."
  - q: "How does Fabric handle security?"
    a: "The Microsoft Learn security overview describes layers: Microsoft Entra ID authentication, tenant-level admin settings, workspace roles, item permissions, OneLake security, row, column and object-level security, network controls, and Purview sensitivity labels that follow data from item to item."
---

A semantic model in Fabric is the layer that turns raw tables into something reports can use. Microsoft Learn describes a Power BI semantic model as a source of data that is ready for reporting and visualization. It sits on top of data in a lakehouse, a warehouse or another source, and adds relationships, calculations and security rules. This article explains that layer and then the pieces around it: the lakehouse, the warehouse, Data Factory and the security model.

One note on sources: the Power BI page read for the semantic model definition does not mention Direct Lake or the former name of semantic models, so this article does not cover them.

## What a semantic model contains

Microsoft Learn lists three things a semantic model holds:

- **Data.** Semantic models can store imported data, issue pass-through query requests to the underlying sources, or do both.
- **Model design.** This includes data preparation queries, relationships and calculations.
- **Row-level security (RLS) rules.** Models can enforce RLS to filter data access for certain users.

The page also describes how models are built and kept current. You can connect to an existing model, upload a Power BI Desktop file, upload an Excel workbook or CSV file, or use the push or streaming APIs. Models developed in Power BI Desktop use one of three storage modes: Import, DirectQuery or Composite. Import models need refresh to stay current, and they refresh on a schedule or on demand in the Power BI service. They must use gateways when the source is not directly reachable over the internet.

## Lakehouse: files and tables in one place

Learn says a lakehouse in Fabric combines the scalability of a data lake with the querying of a warehouse. It organizes data into two top-level folders: **Tables** for managed Delta tables and **Files** for unstructured or non-Delta data. Delta Lake gives ACID transactions, schema enforcement and time travel.

When you create a lakehouse, Fabric generates a **SQL analytics endpoint**. It is read-only and shows only Delta tables, including Delta tables reached through OneLake shortcuts. Parquet or CSV files do not appear until you convert them to Delta. From the endpoint you can create a Power BI semantic model.

Microsoft also states a change: since September 5, 2025, default semantic models are no longer created automatically with a lakehouse, and existing ones became independent semantic models by November 30, 2025. In practice you now create and name the semantic model yourself.

## Warehouse: T-SQL and transactions

Fabric Data Warehouse is described as an enterprise-scale relational warehouse built on a data lake foundation. Data is stored as Delta tables. Development is mainly T-SQL, with support for multi-table ACID transactions, materialized views, functions and stored procedures. Storage and compute are separated.

Learn names two warehousing items:

| Item | Capability |
|---|---|
| Warehouse | Full transactional support, including DDL and DML |
| SQL analytics endpoint | Can query data objects but not modify the data. Autogenerated for each lakehouse. |

### Which one to pick

Microsoft's guidance is short. A warehouse suits an enterprise-scale solution with minimal setup and little performance tuning, and it works best with structured and semi-structured data. A lakehouse suits large volumes of unstructured data from different sources, especially when Spark is the main tool. The lakehouse page adds that it does not support multi-table transactions, while a warehouse does. Both store Delta data on OneLake and use the same SQL engine for T-SQL queries.

## Data Factory in Fabric

Learn calls Data Factory in Microsoft Fabric the next generation of Azure Data Factory. It connects to more than 170 data sources and covers movement, transformation and orchestration:

| Job | Items |
|---|---|
| Move | Copy job (the preferred solution for simplified movement), copy activity, mirroring |
| Transform | Dataflow Gen2 with over 300 transformations, pipeline activities, dbt job |
| Orchestrate | Pipelines with loops, conditionals, schedules and event triggers, plus Apache Airflow |

Mirroring creates a near real-time replica of an operational database within OneLake. The page says the SLA for Fabric pipelines is equivalent to the SLA for pipelines in Azure Data Factory, but it points to a separate guide for the full list of differences, which was not read here.

## Fabric security in layers

The Fabric security overview describes these layers:

1. **Authentication.** Every request is authenticated with Microsoft Entra ID, and Conditional Access can add controls such as MFA or location limits.
2. **Tenant settings.** Admins control capabilities for the whole organization and can delegate to capacities, workspaces and domains.
3. **Workspace roles.** Workspaces are the main access boundary. Admin, member and contributor can use all items. Viewers have no OneLake access.
4. **Item permissions.** Users without a workspace role can receive a shared item with restricted access.
5. **Data-level security.** Row-level, column-level and object-level security limit what viewers see. Data at rest in OneLake is encrypted.
6. **Network security.** Private Links block public access and restrict access to a virtual network. Managed private endpoints allow secure connections to data sources without exposing them to the public network.
7. **Sensitivity labels.** Microsoft Purview labels follow the data from item to item and persist on export to PBIX, Excel, PowerPoint and PDF.

The page's table says viewers can see all the items in the workspace but have no OneLake access. For exact behavior, check the permission model page.

## A simple way to start

1. Land raw data in a lakehouse, using a copy job, pipeline or Dataflow Gen2.
2. Use the SQL analytics endpoint for T-SQL checks, or a warehouse if you need full T-SQL writes and transactions.
3. Create a semantic model with relationships, calculations and RLS.
4. Build reports on the model, and review workspace roles and labels before sharing.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)
- [Fabric lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Data Factory in Microsoft Fabric](https://www.m365.fm/entity/fabric-data-factory/)

## Sources

- [Microsoft Learn: Power BI semantic models in the service](https://learn.microsoft.com/en-us/power-bi/connect-data/service-datasets-understand)
- [Microsoft Learn: Lakehouse overview in Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview)
- [Microsoft Learn: Overview of Fabric Data Warehouse](https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing)
- [Microsoft Learn: Data Factory in Microsoft Fabric overview](https://learn.microsoft.com/en-us/fabric/data-factory/data-factory-overview)
- [Microsoft Learn: Security in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/security/security-overview)
