---
title: "Microsoft Sentinel Data Lake Explained: What It Stores and How to Query It"
summary: "What the Microsoft Sentinel data lake is, what data it holds, the analytics tier versus the data lake tier, up to 12 years of retention, how to query it with KQL, jobs and notebooks, auditing, and what the overview page does not state."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [microsoft-sentinel-data-lake, microsoft-sentinel]
keypoints:
  - "The Sentinel data lake is a fully managed, cloud-native security data lake that stores a single copy of security data in open-format Parquet files."
  - "Two tiers exist: the analytics tier for hunting, alerting and incidents, and the data lake tier for long-term storage and Python analytics."
  - "Learn says it retains up to 12 years of security data and telemetry. It works with all existing Sentinel data connectors."
  - "You query it with KQL in a query editor, with one-time or scheduled jobs that can promote data to the analytics tier, and with Jupyter notebooks."
  - "Auditing is on by default and captures, among other things, KQL queries, notebook runs and job events. The page gives no prices, prerequisites or query limits."
faq:
  - q: "What is the Sentinel data lake?"
    a: "According to Microsoft Learn, it is a purpose-built, cloud-native security data lake that ingests, stores and analyzes large volumes of security data at scale. It is fully managed and stores a single copy of security data in open-format Parquet files."
  - q: "What data does it hold?"
    a: "Data from Defender XDR and all Defender and Sentinel sources, Microsoft 365, Microsoft Entra ID, Microsoft Resource Graph, and third-party sources such as firewall and network logs, identity logs, DNS, proxy and email telemetry, plus threat intelligence."
  - q: "What is the difference between the tiers?"
    a: "The analytics tier supports advanced hunting, alerting and incident management. The data lake tier provides centralized long-term storage for querying and Python-based advanced analytics. Analytics tier data is mirrored to the lake tier."
  - q: "How long can data be kept?"
    a: "Learn says up to 12 years of security data and telemetry, and describes the data lake tier as designed for cost-effective retention for up to 12 years. It gives no per-tier defaults and points to a separate article on managing data tiers and retention."
  - q: "How do I query it?"
    a: "Use KQL in the data lake exploration query editor, run one-time or scheduled jobs, or use Jupyter notebooks with Python libraries and machine learning tools."
---

The Sentinel data lake adds a long-term, low-cost home for security data next to the existing Sentinel analytics tier. It keeps one copy of the data in an open format and lets you query it with KQL, jobs and notebooks. This guide follows the Microsoft Learn overview of the Sentinel data lake. The page is an overview. It gives no prerequisites, prices or limits.

## What it is

Microsoft Sentinel data lake is a purpose-built, cloud-native security data lake. It ingests, stores and analyzes large volumes of diverse security data at scale. It is fully managed, so you do not deploy or maintain data infrastructure. It keeps a single copy of security data across assets, activity logs and threat intelligence, as open-format Parquet files. It works with all existing Sentinel data connectors. The page lists storage and compute as separate and native integration with Sentinel SIEM and its security operations workflows among the architecture benefits.

## What it stores

The page names data from the following (the connector list plus the introduction):

- Microsoft Defender XDR and all Defender and Sentinel data sources.
- Microsoft 365, Microsoft Entra ID and Microsoft Resource Graph.
- EDR platforms, firewall and network logs, and cloud infrastructure and workload telemetry.
- Identity and access logs, including Entra and Okta.
- DNS, proxy and email telemetry.
- Third-party sources, assets, activity logs and threat intelligence (named in the page introduction, not in the connector list).

The page introduces its connector list with "including", so it is not presented as complete.

## The two tiers

| Tier | Purpose |
| --- | --- |
| Analytics tier | The existing Sentinel tier for advanced hunting, alerting and incident management. Designed for high-performance analytics and real-time processing |
| Data lake tier | Centralized long-term storage for querying and Python-based advanced analytics |

Data in the analytics tier is mirrored to the lake tier, so there is one copy. The page does not explain whether the lake tier is a logical view of the same data.

## Retention

Learn says the lake keeps up to 12 years of security data and telemetry. It describes the data lake tier as designed for cost-effective retention of large volumes of security data for up to 12 years. It gives no defaults for each tier or steps to change retention. It points to an article on managing data tiers and retention in the Defender portal.

## How to query it

- **KQL.** Write and run queries against lake resources in the query editor, which has IntelliSense and autocomplete. Learn says KQL support is full, including machine learning functions.
- **Jobs.** One-time or scheduled jobs promote data from the data lake tier to the analytics tier.
- **Jupyter notebooks.** Use Python libraries and machine learning tools for forensics, incident response and anomaly detection. Notebooks can be scheduled to summarize data, run machine learning models and promote data.

## Audit

Auditing is enabled by default. The audit log captures data access, job management and query events. The page lists these as examples of audited activities: accessing lake data with KQL queries, running notebooks, and creating, editing, running and deleting jobs. Audited actions are shown in the audit log.

## Costs and regions

The page describes the lake as cost-effective, with tiered storage, on-demand data promotion and a single copy of data. It gives no prices and links to the article on managing and monitoring Sentinel costs. Supported regions are on a separate page.

## What the page does not say

- Prerequisites, licenses or required roles. It links to onboarding and permissions articles.
- Query, job or notebook limits for size, runtime or concurrency.
- Retention defaults and how to change them.
- Prices or per-GB rates.
- Code samples. The syntax is in the linked KQL and notebook articles.

## A planning outline

This outline is my advice, built on the page.

1. Decide which data needs long retention but not real-time alerting.
2. Read the onboarding and permissions pages before you plan.
3. Check cost guidance, since this overview has none.
4. Start with KQL exploration, then add jobs or notebooks for repeated analysis.
5. Review the audit log for query and job activity.

## Typical mistakes (my advice)

- Expecting the lake tier to run real-time alerting. That is the analytics tier.
- Assuming prices or limits that the page does not state.
- Forgetting to check retention settings for each tier.
- Treating promotion jobs as free of cost without reading the cost article.

## Quick reference

| Question | Answer on the page |
| --- | --- |
| Storage format | Open-format Parquet files, single copy |
| Retention | Up to 12 years |
| Analytics tier use | Advanced hunting, alerting, incident management |
| Data lake tier use | Long-term storage, Python-based analytics |
| Query options | KQL, jobs, Jupyter notebooks |
| Auditing | On by default |
| Connectors | Works with all existing Sentinel data connectors |

## Why a second tier exists

The page describes the analytics tier as designed for high-performance analytics and real-time processing. The data lake tier is described as centralized long-term storage. Splitting the two lets you keep large volumes of data that you rarely query without paying for analytics-tier features on all of it. That cost reading is practical advice. The page itself only describes the purpose of each tier and says the lake is cost-effective.

## Related

- [Microsoft Sentinel data lake](https://www.m365.fm/entity/microsoft-sentinel-data-lake/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Microsoft Sentinel data lake overview (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/datalake/sentinel-lake-overview)
