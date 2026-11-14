---
title: "What Is Microsoft Fabric? A Plain-Language Guide for Microsoft 365 Teams"
summary: "Microsoft Fabric is a SaaS analytics platform where Power BI, data engineering, warehousing and real-time analytics share one storage layer, OneLake. Here is what it contains, what it costs to start and why Microsoft 365 teams meet it."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [fabric, onelake, power-bi, fabric-capacity]
keypoints:
  - "Microsoft Fabric is a software-as-a-service analytics platform for ingestion, transformation, real-time processing, analytics and reporting."
  - "All Fabric workloads store and read data through OneLake, one logical data lake per tenant, so teams share data without copying it."
  - "Power BI is one of the Fabric workloads. Business users reach Fabric data through Power BI, Excel and Microsoft Teams."
  - "Collaborating in Fabric needs an F or P capacity plus at least one per-user license. A 60-day trial capacity exists for evaluation only."
  - "A Fabric trial does not support Copilot or the data agent, so plan a paid F capacity if you want to test those."
faq:
  - q: "What is Microsoft Fabric in one sentence?"
    a: "According to Microsoft Learn, Fabric is a software-as-a-service analytics platform that covers data ingestion, transformation, real-time stream processing, analytics and reporting, with all workloads storing data in OneLake."
  - q: "Is Microsoft Fabric the same as Power BI?"
    a: "No. Microsoft Learn lists Power BI as one workload inside Fabric, next to Data Factory, Data Engineering, Data Science, Data Warehouse, Real-Time Intelligence and others. Power BI is the part business users typically see."
  - q: "Do I need an Azure account to use Fabric?"
    a: "Microsoft Learn states that you do not need an Azure account to use Fabric. It is delivered as a SaaS platform. Paid Fabric capacities (F SKUs) are billed through Azure according to the licensing page, which is a separate question from the account requirement."
  - q: "Can I try Fabric for free?"
    a: "Microsoft Learn describes a 60-day Fabric trial with an F4 or F64 capacity and up to 1 TB of OneLake storage. The trial is meant for evaluation and testing, not for production or business-critical workloads."
  - q: "Why should Microsoft 365 teams care about Fabric?"
    a: "Learn says Fabric data can be analyzed and consumed in Excel and shared through Microsoft Teams. It also states that Power BI business owners can access Fabric data, and Fabric data can be used by Microsoft 365 Copilot through a published data agent."
---

Microsoft Fabric is a single analytics platform from Microsoft. It brings data integration, data engineering, data warehousing, real-time analytics, data science and Power BI together in one software-as-a-service product. Every part of it stores data in one shared lake called OneLake. For a Microsoft 365 team, the practical meaning is simple: the reports in Power BI, the numbers in Excel and the data behind Copilot answers can all come from the same governed place.

This guide explains what Fabric contains, how OneLake works, what licensing looks like and where Microsoft 365 users meet it. Everything below comes from Microsoft Learn pages listed at the end.

## What Fabric is

Microsoft Learn describes Fabric as an analytics platform for end-to-end data workflows: ingestion, transformation, real-time stream processing, analytics and reporting. It is delivered as software as a service. The workloads share a compute and storage model, so you do not integrate separate services or manage infrastructure yourself. Learn also states that you do not need an Azure account to use Fabric.

## The workloads in plain words

Learn lists these workloads. Each one serves a role or a task.

| Workload | What it does, according to Learn |
|---|---|
| Power BI | Connect to data sources, build interactive charts and dashboards, share insights |
| Databases | A transactional database similar to Azure SQL Database, with mirroring into OneLake |
| Data Factory | Ingest, prepare and transform data, with more than 200 native connectors |
| Real-Time Intelligence | Analyze data as it arrives, such as sensor readings, logs and clickstreams |
| Data Engineering | Apache Spark for large datasets, with notebooks and scheduled jobs |
| Fabric Data Science | Build, deploy and operationalize machine learning models |
| Fabric Data Warehouse | SQL performance at scale, with data stored in open Delta Lake format |
| Industry Solutions | Industry-specific data solutions |
| Fabric IQ (preview) | Business semantics across data, models and systems, including the data agent |

Most Microsoft 365 teams start with Power BI and stay there. The other workloads matter when a data team builds the pipelines and models that Power BI reports sit on.

## OneLake: one lake for the tenant

OneLake is the part that makes Fabric different from a set of separate tools. Learn describes it as a centralized, logical data lake that is included by default, so nothing needs to be provisioned first.

- It is built on Azure Data Lake Storage Gen2.
- The hierarchy is tenant, then workspaces, then lakehouses. Learn compares workspaces to folders.
- Each tenant has one OneLake with a single namespace.
- Shortcuts give zero-copy access to external sources such as Azure Data Lake Storage, Amazon S3 and Google Cloud Storage.
- External data sharing lets you share live, governed datasets across Microsoft Entra tenant boundaries without copying data.

Learn compares OneLake to OneDrive: each developer or business unit creates workspaces and puts data into lakehouses, and everything stays discoverable in one place.

## Governance and Copilot

Permissions, sensitivity labels and auditing apply across the platform. Discovery and governance are centralized in the OneLake catalog, and Microsoft Purview provides information protection, data loss prevention, audit and compliance for supported Fabric data. Learn also lists Copilot as a platform layer that helps write queries, pipelines and code and generate summaries.

## Where Microsoft 365 users meet Fabric

The overview page names these touchpoints:

- **Power BI.** Business owners access Fabric data through Power BI reports and dashboards.
- **Excel.** Data can be analyzed and consumed in Excel.
- **Microsoft Teams.** Insights can be shared through Teams.
- **Microsoft 365 Copilot.** A Fabric data agent can be published so that Copilot users ask questions about governed data. The separate Learn page for this requires a paid F2 or higher capacity, and results respect row-level and column-level security.

## What it takes to start

Learn's licensing page gives the baseline: to collaborate in Fabric you need an F or P capacity and at least one per-user license.

- **F SKUs** are the recommended capacities. They are billed per second through Azure with a one-minute minimum and no commitment. The smallest listed size is F2 with 2 capacity units.
- **P SKUs** are available only to customers with an active Enterprise Agreement, and Learn says Microsoft is retiring Power BI Premium per-capacity SKUs.
- **Free, Pro and Premium Per User licenses** control who can create and share. Free users can create non-Power BI Fabric items only in workspaces backed by an F or Trial capacity. Creating Power BI items outside My workspace needs Pro, Premium Per User or a Power BI individual trial.
- **Viewing Power BI content** on F SKUs smaller than F64 needs a Pro, Premium Per User or trial license for each viewer. On F64 or larger, users with a Free license and a viewer role can view it.

### The trial

The Fabric trial lasts 60 days and provides an F4 or F64 capacity with up to 1 TB of OneLake storage. To start it, open the Fabric homepage, select your photo to open the Account manager, and select **Start trial**. If that option is missing, a Fabric administrator may have disabled trials under **Help and support settings** > **Users can try Microsoft Fabric paid features**.

Two limits matter for Microsoft 365 teams. The trial does not support Copilot or AI experiences such as the data agent. And it is for evaluation only. When it ends, non-Power BI items become inactive but stay in OneLake for 7 days, and you can reactivate them by assigning the workspace to a paid capacity.

## A simple way to decide where to start

1. If you only build reports, you are probably in the Power BI workload already. Check which license and capacity your workspace uses.
2. If a data team wants shared pipelines, lakehouses or warehouses, you need an F or trial capacity, because Premium Per User does not provision a Fabric capacity.
3. If the goal is Copilot answers on company data, plan a paid F2 or higher capacity, since the trial excludes the data agent.

## Common misunderstandings

- **"Fabric replaces Power BI."** Learn lists Power BI as a Fabric workload. It is part of it.
- **"Fabric needs an Azure subscription to try."** Learn says an Azure account is not required to use Fabric. Paid F capacities are, however, billed through Azure.
- **"The trial is a pilot for production."** Learn says not to use it for production or business-critical workloads.

The overview page does not give prices, and this guide does not either. Prices vary by region and are listed by Microsoft.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [OneLake](https://www.m365.fm/entity/onelake/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)

## Sources

- [Microsoft Learn: What is Microsoft Fabric?](https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview)
- [Microsoft Learn: Microsoft Fabric trial capacity](https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial)
- [Microsoft Learn: Microsoft Fabric concepts and licenses](https://learn.microsoft.com/en-us/fabric/enterprise/licenses)
- [Microsoft Learn: Consume a Fabric data agent in Microsoft 365 Copilot](https://learn.microsoft.com/fabric/data-science/data-agent-microsoft-365-copilot)
