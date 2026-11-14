---
title: "DP-600 Fabric Analytics Engineer: Skills Measured and Study Plan"
summary: "The DP-600 Implementing Analytics Solutions Using Microsoft Fabric skills outline with four domain weights, subtopics for each, the practice assessment and resources named on the study guide, and a study plan built on the weights."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [dp-600, fabric]
keypoints:
  - "Four domains: plan and manage a solution (10-15%), prepare and serve data (40-45%), implement and manage semantic models (20-25%) and explore and analyze data (20-25%)."
  - "Prepare and serve data carries the most weight and covers lakehouse and warehouse objects, copying and transforming data, and performance."
  - "Expected experience includes data modeling, data transformation, Git-based source control, and SQL, DAX and PySpark."
  - "The page recommends a new practice assessment on AI Skills Navigator and calls the Learn practice assessment legacy and no longer updated."
  - "Use the outline to plan study. This guide contains no exam questions."
faq:
  - q: "What does DP-600 cover?"
    a: "The Microsoft study guide lists four domains: plan, implement and manage a solution for data analytics; prepare and serve data; implement and manage semantic models; and explore and analyze data."
  - q: "How is the exam weighted?"
    a: "Planning and managing is 10-15%, prepare and serve data is 40-45%, semantic models are 20-25% and explore and analyze data is 20-25%."
  - q: "Which languages does a candidate need?"
    a: "The audience profile expects experience with SQL, DAX and PySpark, along with data modeling, data transformation, Git-based source control and exploratory analytics."
  - q: "Which practice assessment should I use?"
    a: "The page recommends the new Practice Assessment on AI Skills Navigator. It says the legacy practice assessment on Microsoft Learn is no longer updated."
  - q: "Is there a retirement date?"
    a: "The study guide page does not show an exam retirement date. Its last update is shown as 2026-10-30."
---

DP-600 measures whether you can design, build and deploy analytics solutions in Microsoft Fabric. The study guide gives four domains, and one of them, preparing and serving data, is worth up to 45% of the exam. This guide summarizes the outline as published on the Microsoft Learn study guide, last updated 2026-10-30, and adds a study order. It contains no exam questions.

## Audience

The page describes candidates with expertise in designing, creating and deploying enterprise-scale analytics solutions. They turn data into reusable assets with Fabric components: lakehouses, data warehouses, notebooks, dataflows, data pipelines, semantic models and reports. They apply best practices such as version control and deployment, and work with architects, data engineers, data scientists, AI engineers, database administrators and Power BI analysts. Expected experience is data modeling, data transformation, Git-based source control, exploratory analytics, and SQL, DAX and PySpark. The page shows no retirement date.

## Domain 1: plan, implement and manage a solution for data analytics (10-15%)

- **Plan the environment:** requirements including components, features, performance and capacity SKUs, Fabric admin portal settings, data gateway type and a custom Power BI report theme.
- **Implement and manage the environment:** workspace and item-level access controls, data sharing for workspaces, warehouses and lakehouses, sensitivity labels in semantic models and lakehouses, workspace settings and capacity.
- **Manage the development lifecycle:** workspace version control, Power BI Desktop projects (.pbip), deployment solutions, impact analysis of downstream dependencies, semantic model deployment with the XMLA endpoint, and reusable assets such as .pbit, .pbids and shared semantic models.

## Domain 2: prepare and serve data (40-45%)

- **Create objects in a lakehouse or warehouse:** ingest with a pipeline, dataflow or notebook, shortcuts, file partitioning, views, functions, stored procedures and enrichment.
- **Copy data:** choose a method, copy with a pipeline, dataflow or notebook, add stored procedures, notebooks and dataflows to a pipeline, and schedule pipelines, dataflows and notebooks.
- **Transform data:** cleansing, star schemas including Type 1 and Type 2 slowly changing dimensions, bridge tables, denormalizing, aggregating, merging and joining, duplicates, missing data and nulls, type conversion with SQL or PySpark, and filtering.
- **Optimize performance:** find and fix bottlenecks in dataflows, notebooks and SQL queries, and Delta table file size issues.

## Domain 3: implement and manage semantic models (20-25%)

- **Design and build:** choose a storage mode including Direct Lake, DAX Studio and Tabular Editor 2 use cases, star schemas, relationships, DAX with variables and functions, calculation groups, dynamic strings and field parameters, large format datasets, composite models with aggregations, and dynamic row-level and object-level security with validation.
- **Optimize at enterprise scale:** query and visual performance, DAX performance with DAX Studio, optimization with Tabular Editor 2 and incremental refresh.

## Domain 4: explore and analyze data (20-25%)

- **Exploratory analytics:** descriptive and diagnostic analytics, prescriptive and predictive analytics in a visual or report, and data profiling.
- **Query with SQL:** query a lakehouse or warehouse with SQL or the visual query editor, and connect to and query datasets with the XMLA endpoint.

## Resources named on the page

- The recommended practice assessment on AI Skills Navigator, and the legacy Learn assessment that is no longer updated.
- Self-paced learning paths, modules and instructor-led courses, and the exam sandbox.
- Documentation on Microsoft Fabric, lakehouses, data warehousing and warehouse architecture.
- Microsoft Q&A, community hubs and the Fabric blog.
- The Exam Prep video, Data Exposed and other Learn shows.

## What the page does not say

Exam length, question count, price, prerequisites, and weights below the domain level.

## A study plan

This plan is practical advice built on the weights.

1. **Weeks 1-4, domain 2.** It is the largest. Build a lakehouse and a warehouse, ingest with pipelines, dataflows and notebooks, and practice star schemas and slowly changing dimensions.
2. **Weeks 5-6, domain 3.** Build a semantic model with Direct Lake, write DAX with variables and iterators, and set up row-level and object-level security.
3. **Week 7, domain 4.** Write SQL against both a lakehouse and a warehouse, and profile data.
4. **Week 8, domain 1.** Cover workspace access, Git integration, deployment and the XMLA endpoint.
5. **Final week.** Take the practice assessment and review weak spots against the outline.

## Typical mistakes

- Treating the exam as only a Power BI exam.
- Skipping PySpark or SQL practice.
- Ignoring lifecycle topics such as Git, .pbip and deployment.
- Relying on the legacy practice assessment.

## Related

- [DP-600](https://www.m365.fm/entity/dp-600/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric Lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Study guide for Exam DP-600: Implementing Analytics Solutions Using Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-600)
