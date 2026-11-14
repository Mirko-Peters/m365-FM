---
title: "DP-700 Fabric Data Engineer: Skills Measured and Study Plan"
summary: "The DP-700 study guide outline: audience, the three skill areas with their weights, what each area covers, passing score, preview and localization notes, and a study plan built on the outline. The exam page was not used and no questions are included."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [dp-700]
keypoints:
  - "The guide targets people with expertise in data loading patterns, data architectures and orchestration, skilled in SQL, PySpark and KQL."
  - "Three areas, each weighted 30 to 35 percent: implement and manage an analytics solution, ingest and transform data, monitor and optimize an analytics solution."
  - "The passing score is 700. Most questions cover generally available features, and preview features may appear."
  - "Localized exams follow about eight weeks after English, and the guide adds 30 minutes if the exam is not available in your language."
  - "The study guide page shows no as-of date and no change log, so check the page for the current outline."
faq:
  - q: "What are the skill areas and weights?"
    a: "Implement and manage an analytics solution (30 to 35 percent), ingest and transform data (30 to 35 percent), and monitor and optimize an analytics solution (30 to 35 percent)."
  - q: "What is the passing score?"
    a: "700."
  - q: "Who is the exam for?"
    a: "People with subject matter expertise in data loading patterns, data architectures and orchestration processes, who work with SQL, PySpark and KQL."
  - q: "Can preview features appear?"
    a: "The guide says most questions cover generally available features, and questions on preview features may be asked."
  - q: "Is there a practice assessment?"
    a: "The guide points to a new Practice Assessment on AI Skills Navigator at aka.ms/DP700-PA and says the legacy practice assessment is no longer updated."
---

DP-700 is the Microsoft Fabric Data Engineer exam. This guide summarizes the outline in the Microsoft Learn study guide and turns it into a study plan. It contains no exam questions. The study guide page shows no as-of date and no change log, so check the page itself for the current outline.

## Who it is for

The guide describes candidates with subject matter expertise in data loading patterns, data architectures and orchestration processes. They are skilled in SQL, PySpark and KQL.

## Skill areas and weights

| Area | Weight |
| --- | --- |
| Implement and manage an analytics solution | 30 to 35 percent |
| Ingest and transform data | 30 to 35 percent |
| Monitor and optimize an analytics solution | 30 to 35 percent |

## Area 1: implement and manage an analytics solution

- **Workspace settings.** Spark, domain, OneLake and data workflow settings.
- **Lifecycle management.** Version control, database projects and deployment pipelines.
- **Security and governance.** Workspace-, item-, row-, column-, object- and file-level access, dynamic data masking, sensitivity labels and endorsing.
- **Orchestration.** Pipeline versus notebook, schedules and event-based triggers, and orchestration patterns with parameters and dynamic expressions.

## Area 2: ingest and transform data

- **Loading patterns.** Full and incremental loads, a dimensional model and streaming.
- **Batch ingest and transform.** Choosing a data store, dataflows versus notebooks versus T-SQL, shortcuts, mirroring and pipelines. Transform with PySpark, SQL and KQL. Denormalize, group and aggregate data. Handle duplicate, missing and late-arriving data.
- **Streaming.** Choosing an engine, eventstreams, Spark structured streaming, KQL and windowing functions.

## Area 3: monitor and optimize an analytics solution

- **Monitor Fabric items.** Ingestion, transformation, semantic model refresh and alerts.
- **Identify and resolve errors.** Pipeline, dataflow, notebook, eventhouse, eventstream and T-SQL errors.
- **Optimize performance.** Lakehouse tables, pipelines, warehouses, eventstreams and eventhouses, Spark and queries.

## Notes from the guide

- The bullets illustrate how skills are assessed, and related topics may be covered.
- The passing score is 700.
- Most questions cover generally available features. Preview features may appear.
- Localized versions follow about eight weeks after the English exam. If the exam is not available in your language, you get 30 additional minutes.
- A new Practice Assessment is on AI Skills Navigator (aka.ms/DP700-PA). The legacy one is no longer updated.

## What the guide does not say

- Number of questions and exam duration in the portions read here.
- Item-level weights inside each area.
- A change log, so changes to the outline are not visible on the page.

## A study plan

This plan is practical advice built on the outline. The three areas have equal weight, so give them equal time.

1. Week 1 to 2: workspace settings, deployment pipelines, version control and the access levels from workspace to file.
2. Week 3 to 4: loading patterns and batch transformation. Practice the same transformation in a dataflow, a notebook and T-SQL.
3. Week 5: streaming with eventstreams, Spark structured streaming and KQL windowing.
4. Week 6: monitoring, alerts and error resolution across pipelines, notebooks and eventhouses.
5. Week 7: performance tuning, then the practice assessment.

## Typical mistakes

This list is my own advice, not from the study guide.

- Studying only the data engineering parts and skipping governance and lifecycle management.
- Ignoring KQL because the exam also names SQL and PySpark.
- Using the legacy practice assessment, which is no longer updated.
- Relying on an old copy of the outline instead of the current page.

## Quick reference

- Exam: DP-700, Microsoft Fabric Data Engineer.
- Skills named in the audience: SQL, PySpark and KQL.
- Areas: three, each 30 to 35 percent.
- Passing score: 700.
- Preview features may appear, although most questions cover generally available features.
- Practice: the new Practice Assessment on AI Skills Navigator.

## How to read the weights

This is practical advice. Three ranges of 30 to 35 percent mean no area is a minor one. A gap in one area can cost as much as a gap in another. If you work mostly with pipelines and notebooks, plan extra time for the security, lifecycle and monitoring parts of the outline, since those are named as skills as well.

Because the guide says related topics may be covered, treat each bullet as an example of a skill and practice the neighboring tasks in a Fabric workspace, not only the exact wording.

## Related

- [DP-700](https://www.m365.fm/entity/dp-700/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Fabric Data Activator](https://www.m365.fm/entity/fabric-data-activator/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Study Guide for Exam DP-700: Implementing Data Engineering Solutions Using Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-700)
