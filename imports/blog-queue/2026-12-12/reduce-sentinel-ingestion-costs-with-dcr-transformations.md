---
title: "Microsoft Sentinel Ingestion Costs: Reduce Them With DCR Transformations and Source Filtering"
summary: "How to cut Microsoft Sentinel ingestion volume with data collection rule transformations, workspace transformation DCRs and source-side filtering, plus the billing rules and limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [microsoft-sentinel, azure-monitor, log-analytics]
keypoints:
  - "An ingestion-time transformation is a KQL statement in a data collection rule that filters or reshapes each record before it is written to the workspace."
  - "Transformations work on one record at a time. Operators such as summarize are not supported, and only the operators Microsoft lists can be used."
  - "With Microsoft Sentinel enabled on the workspace, Azure Monitor charges nothing for a transformation to Analytics tables, however much data it drops."
  - "A workspace transformation DCR covers data that does not use its own DCR. Azure Monitor Agent data needs the transformation in the agent's DCR."
  - "Windows Security Events can be filtered at the source with the Minimal, Common or custom event sets, so unwanted events are never ingested."
faq:
  - q: "Do transformations cost extra when Microsoft Sentinel is enabled?"
    a: "According to Microsoft Learn, if Microsoft Sentinel is enabled for the Log Analytics workspace, there is no cost for a transformation to Analytics tables, regardless of how much data it filters. Without Sentinel, Analytics and Basic tables are charged for filtered data above 50 percent of the incoming volume."
  - q: "Which KQL operators can I use in a transformation?"
    a: "Microsoft Learn lists extend, project, print, where, parse, project-away, project-rename, datatable and columnifexists as supported tabular operators. Operators that act on several records, such as summarize, are not supported, and only the listed operators work."
  - q: "How long does a new transformation take to apply?"
    a: "The Azure Monitor tutorial says to allow about 30 minutes, and only data sent after the change reflects it. The Microsoft Sentinel page says changes may take up to 60 minutes. Plan for the longer figure."
  - q: "Why does my transformation not affect data from the Azure Monitor Agent?"
    a: "Per Microsoft Learn, a workspace transformation DCR applies only to data that did not come from another DCR. Azure Monitor Agent uses its own DCR, so the transformation must be added to that DCR instead."
---

Microsoft Sentinel bills for the data it ingests, so the most direct way to lower the bill is to ingest less. Data collection rule (DCR) transformations do this: a KQL statement runs on each incoming record and can drop rows or remove columns before anything is stored. For Windows Security Events, the DCR can also filter at the source. This article follows the Microsoft Learn pages on Sentinel data transformation, Azure Monitor transformations and Sentinel cost reduction.

## Where transformations run

Microsoft Learn describes ingestion-time transformations as KQL that Azure Monitor applies after the data source delivers a record and before it reaches the Log Analytics workspace. They are defined in a DCR. The Sentinel documentation names three cases:

| Ingestion scenario | Transformation | DCR type |
|---|---|---|
| Custom data through the Log Ingestion API | Required | Standard DCR |
| Syslog, CommonSecurityLog, WindowsEvent, SecurityEvent through Azure Monitor Agent | Optional | Standard DCR |
| Built-in types from most other sources | Optional | Workspace transformation DCR |

Before you start, check the data connector reference to confirm that your connector supports transformation and which DCR type applies.

## Workspace DCR versus standard DCR

A workspace transformation DCR is a special DCR attached to the workspace. Microsoft says there can be only one per workspace, and it can hold transformations for any number of supported tables. It applies to data sent to those tables unless that data came from another DCR.

The page gives an example. A workspace transformation on the `Event` table applies to events from machines using the Log Analytics agent. It is ignored for data from Azure Monitor Agent, because that agent uses a DCR. For Azure Monitor Agent, put the transformation into the DCR associated with the agent.

## What the KQL can do

Transformations see one record at a time. Microsoft states that operators acting on several records, such as `summarize`, are not supported, and only the operators listed in the article work. The supported tabular operators are `extend`, `project`, `print`, `where`, `parse`, `project-away`, `project-rename`, `datatable` and `columnifexists`. The incoming data is referenced with the `source` keyword.

Useful details from the same page:

- `parse` is limited to 10 columns per statement.
- With `parse kind=regex`, the expression must match the entire input string for the parsed columns to be filled.
- `geo_location` calls an external service and can add ingestion latency, so use it sparingly.
- A dynamic column can be read with `parse_json`, provided the input stream declares it as `dynamic`.

A filter that drops noisy records looks like this:

```kusto
source
| where QueryText !contains 'LAQueryLogs'
| project-away RequestContext
```

This is the pattern from Microsoft's portal tutorial. The query removes rows that query the table itself and drops a large column to save space.

## Add a workspace transformation in the portal

The tutorial uses the `LAQueryLogs` table, but the steps are the same for any supported table that already holds data. You need contributor rights on the workspace and permission to create DCR objects.

1. Open the Log Analytics workspace and select **Tables**.
2. Find the table and select **Create transformation**.
3. Select **Create a new data collection rule**, enter a name and select **Done**. Store the transformations for other tables in this same workspace DCR.
4. Select **Next** to see sample data, then open the **Transformation editor**.
5. Replace the default query with your KQL and select **Run** to check the result.
6. Select **Apply**, then **Next**, then **Create**.

Output columns that do not exist in the table are added by the portal, so keep only the columns you want. Custom columns added to a built-in table must end in `_CF`. Columns in a custom table ending in `_CL` do not need the suffix.

Allow time for the change. The Azure Monitor tutorial says about 30 minutes, the Sentinel page says it may take up to 60 minutes, and only data sent after the change is affected. If IntelliSense does not know a new column, the cache can take up to 24 hours to refresh. Microsoft lists a known issue with transformations on dynamic columns. The temporary workaround is to parse the column explicitly with `parse_json()` first.

## How billing works

The Azure Monitor page separates the cases:

- **Microsoft Sentinel enabled on the workspace:** no cost for a transformation to Analytics tables, regardless of how much data it filters.
- **Analytics or Basic tables without Sentinel:** transformations normally cost nothing. If a transformation adds data, such as a calculated column, the extra data is charged at the standard ingestion rate. If it removes more than 50 percent of the incoming data, the amount above 50 percent is charged. The formula is data dropped minus half of the incoming size.
- **Auxiliary tables:** the processing charge applies to all incoming data, and the ingestion charge applies only to the data left after the transformation.

Microsoft advises filtering by other means first where possible, so that less data reaches the transformation.

## Filter at the source for Windows Security Events

The Windows Security Events connector uses Azure Monitor Agent and DCRs. Microsoft Learn lists predefined sets named **All events**, **Minimal** and **Common**, and lets you pick specific events. The agent filters at the source and ingests only the selected events. The page says this can help optimize costs but gives no figures.

## Other cost levers on the same page

Microsoft's cost page lists several options beyond transformations:

- **Commitment tiers.** Raising the tier is allowed at any time and restarts the 31-day commitment period. Moving to pay-as-you-go or a lower tier waits until the period ends. The setting is under Sentinel **Settings** > **Pricing**.
- **Separate workspace for non-security data.** Sentinel analyzes all data in a Sentinel-enabled workspace, so operational data kept elsewhere does not incur Sentinel costs.
- **Sentinel data lake.** Microsoft positions it for secondary security data that is not needed for real-time detection, at significantly reduced ingestion and storage cost.
- **Total retention.** Analytics data is kept 90 days by default, and older data can be retained at lower cost under **Data management** > **Tables**.

## Check before dropping data

A record dropped by a transformation is not stored, so it cannot be queried later. Review which analytics rules, workbooks and hunting queries read a table before filtering it. The pages read for this article do not describe a way to preview which detections would be affected, so test on one table first and compare rule results.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Log Analytics](https://www.m365.fm/entity/log-analytics/)

## Sources

- [Microsoft Learn: Data transformation in Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/configure-data-transformation)
- [Microsoft Learn: Transformations in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-transformations)
- [Microsoft Learn: Supported KQL features in transformations](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-transformations-kql)
- [Microsoft Learn: Add a workspace transformation in the Azure portal](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)
- [Microsoft Learn: Reduce costs for Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/billing-reduce-costs)
