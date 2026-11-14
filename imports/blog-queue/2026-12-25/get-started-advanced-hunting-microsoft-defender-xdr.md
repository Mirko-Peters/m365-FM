---
title: "Get Started With Advanced Hunting in Microsoft Defender XDR: Access, Limits, Retention"
summary: "Start with advanced hunting in Microsoft Defender XDR: guided and advanced modes, who gets access, 30 day data retention, the documented query quotas, how to review resource-heavy queries and what the overview page leaves out."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [defender, kql]
keypoints:
  - "Advanced hunting is a query-based tool for exploring up to 30 days of raw Defender data. Guided mode is a query builder and advanced mode takes KQL."
  - "Access comes through unified RBAC permissions, Email and Collaboration or Exchange Online role groups, or Microsoft Entra roles such as Security Reader and Global Reader."
  - "Documented quotas: 100,000 rows per query, 10 minutes of run time, 64 MB result size, and CPU resources based on tenant size, refreshed every 15 minutes."
  - "Advanced hunting uses UTC for all data. Write queries in UTC. Results are converted to the time zone you set."
  - "For more than 30 days, use Microsoft Sentinel analytics-tier retention or the streaming APIs. Data held only in the Sentinel data lake is not available."
faq:
  - q: "How far back can advanced hunting look?"
    a: "According to Microsoft Learn, 30 days for native Defender data. Microsoft Sentinel table retention depends on the configured analytics-tier retention."
  - q: "What are the query limits?"
    a: "The overview lists 100,000 rows per query, a 10 minute timeout and a 64 MB results size limit. CPU resources are based on tenant size and refresh every 15 minutes."
  - q: "Who can use advanced hunting?"
    a: "Learn lists unified RBAC permissions, Email and Collaboration role groups, Exchange Online role groups and Microsoft Entra roles. It says Global Administrator, Security Administrator, Security Reader and Global Reader grant full read access to all advanced hunting data."
  - q: "Do I need to know KQL?"
    a: "Not at first. Guided mode is described as a query builder for users not yet familiar with Kusto Query Language. Advanced mode is for writing KQL from scratch."
  - q: "What time zone do queries use?"
    a: "Learn says advanced hunting uses UTC for all data, so write queries in UTC. Microsoft Defender converts results to the time zone you set."
---

Advanced hunting in Microsoft Defender XDR is a query-based threat hunting tool. It lets you explore up to 30 days of raw Defender data to find threat indicators and entities. This guide follows the Microsoft Learn overview and the page on service limits.

## What you get

Advanced hunting supports queries across data from Microsoft Defender for Endpoint, Defender for Office 365, Defender for Cloud Apps, Defender for Identity and Microsoft Sentinel. Learn describes two modes:

- **Guided mode** for users not yet familiar with Kusto Query Language (KQL), or who prefer a query builder.
- **Advanced mode** for users who write KQL queries from scratch.

The overview does not give an exact menu path for opening the tool. It links to a separate page on choosing between the two modes in the Microsoft Defender portal.

## Setup

To use advanced hunting, turn on Microsoft Defender. To use it with Microsoft Sentinel, connect Sentinel to the Defender portal. The page does not state licensing requirements.

## Permissions

Access can come from any of these options:

- **Microsoft Defender unified RBAC:** for email and collaboration tables, the **Security operations** > **Raw data** > **Email & collaboration metadata (read)** permission. For alerts and behaviors tables, **Security operations** > **Security data** > **Security data basics (read)**, which does not include the email and collaboration schema.
- **Email and Collaboration role groups:** Security Administrator, Security Operator and Security Reader.
- **Exchange Online role groups:** View-Only Organization Management, View-Only Configuration, Security Reader and Global Reader.
- **Microsoft Entra roles:** Global Administrator, Security Administrator, Security Reader and Global Reader, which grant full read access to all advanced hunting data.

Endpoint data access is also governed by role-based access control settings in Microsoft Defender for Endpoint.

## Data retention and freshness

Native Defender data is kept for 30 days. Sentinel table retention depends on the analytics-tier retention you configured. To keep data longer, onboard a Sentinel workspace or stream data with the Microsoft Defender Streaming API or the Defender for Endpoint raw data streaming API. Streaming retention starts from the day you enable the API. Data stored only in the Microsoft Sentinel data lake is not available in advanced hunting.

Event data arrives almost immediately after sensors transmit it. Entity data for users and devices is updated every hour.

## Quotas

| Quota | Size | Refresh |
| --- | --- | --- |
| Date range | 30 days for native Defender data | Every query |
| Result set | 100,000 rows | Every query |
| Timeout | 10 minutes | Every query |
| CPU resources | Based on tenant size | Every 15 minutes |
| Results size | 64 MB | Every query |

The portal warns when a query pushes the tenant over 10% of allocated resources. Queries are blocked if the tenant reaches 100% until the next 15-minute cycle. These quotas apply separately to manual queries and custom detection rules, and API queries have their own quotas.

## Find and fix heavy queries

The separate limits page describes a query resources report covering the last 30 days across all hunting interfaces. Review queries marked **High** resource usage, check the **State** column for **Completed**, **Failed** or **Throttled**, and use the usage graph to find spikes. To edit a query built in guided mode, switch to advanced mode first. That page carries a prerelease notice, so the report may change.

## Time zones

Advanced hunting uses UTC for all data, so write queries in UTC. Results are converted to the time zone you set in the portal.

## First query

The overview has no sample queries. This one is an illustration, not from the page, so check table and column names against the schema first.

```kql
DeviceProcessEvents
| where Timestamp > ago(7d)
| summarize ProcessCount = count() by DeviceName
| top 10 by ProcessCount desc
```

## Custom detections

The same hunting queries can build custom detection rules, which run automatically to check for suspected breach activity and other findings.

## Not covered

The pages I read do not give the portal menu path, licensing, KQL syntax or the contents of each schema table. They link to separate pages for those.

## Related

- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)

## Sources

- [Proactively hunt for threats with advanced hunting in Microsoft Defender XDR](https://learn.microsoft.com/defender-xdr/advanced-hunting-overview)
- [Advanced hunting service limits](https://learn.microsoft.com/defender-xdr/advanced-hunting-limits)
