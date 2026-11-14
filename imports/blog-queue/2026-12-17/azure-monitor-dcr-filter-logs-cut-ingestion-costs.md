---
title: "Azure Monitor Data Collection Rules: Filter Logs and Cut Ingestion Costs"
summary: "How to reduce Log Analytics ingestion volume with data collection rules: XPath filters on the agent, KQL transformations, workspace transformation DCRs, the billing rules and the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [azure-monitor, azure-monitor-agent, log-analytics]
keypoints:
  - "Filter at the source first: XPath queries in a Windows event data source stop unwanted events from leaving the machine at all."
  - "A transformation is a single-line KQL statement that starts with source and runs on each record before it is stored."
  - "Only a short list of KQL operators works in a transformation. summarize and join are not supported."
  - "A workspace transformation DCR does not touch data that arrives through another DCR, such as Azure Monitor Agent data."
  - "Without Microsoft Sentinel, filtering more than 50 percent of the incoming data on Analytics or Basic tables adds a processing charge."
faq:
  - q: "Does filtering data in a transformation always save money?"
    a: "Not always. According to Microsoft Learn, a transformation on Analytics or Basic Logs usually adds no charge, but if it drops more than 50 percent of the incoming data you pay a processing charge for the amount above 50 percent. Learn gives the formula as GB dropped minus incoming GB divided by two. If Microsoft Sentinel is enabled on the workspace, there is no such charge for Analytics tables."
  - q: "Why does my workspace transformation not change data from my virtual machines?"
    a: "Microsoft Learn states that a workspace transformation DCR is ignored for data collected through another DCR. Azure Monitor Agent uses its own DCR, so the transformation has to be added to that DCR instead. Machines that still use the deprecated Log Analytics agent do not use a DCR and are covered by the workspace transformation."
  - q: "How long until a new transformation takes effect?"
    a: "The Learn page on creating a transformation says a new transformation query can take up to 60 minutes to activate. Only data that arrives after it is active is affected. Existing records stay as they are."
  - q: "How many XPath expressions can a data collection rule hold?"
    a: "Microsoft Learn says Get-WinEvent supports up to 23 expressions while a DCR supports up to 20. Learn also says XPath 1.0 limits apply, so functions such as starts-with and contains are not supported."
  - q: "Can I use summarize to reduce data volume in a transformation?"
    a: "No. Per Microsoft Learn, standard transformations process each record on its own, so operators that aggregate several records, such as summarize, are not supported. Aggregation is only described for the Azure Monitor pipeline and the multi-stage preview."
---

The most reliable way to lower Azure Monitor ingestion cost is to send less data into the Log Analytics workspace. Data collection rules (DCRs) offer two places to do that. Filter on the agent with an XPath query for Windows events, or drop rows and columns with a KQL transformation before the data is stored. Microsoft Learn names the amount of data collected as the primary cost factor in Azure Monitor, so collect only what you need for health, performance and alerting.

## Pick the filter point

| Method | Where it runs | Good for |
|---|---|---|
| XPath query in the DCR data source | On the agent, before data is sent | Windows event logs |
| Ingestion-time transformation (`transformKql`) | In Azure Monitor, before the workspace stores the record | Dropping rows or columns from supported tables |
| Workspace transformation DCR | On the workspace table | Data that does not use its own DCR, such as resource logs from diagnostic settings |

Learn says that diagnostic settings do not allow granular filtering of resource logs. For tables that support it, use a workspace transformation to filter those resources. Learn also recommends moving from the Log Analytics agent to Azure Monitor Agent for granular filtering.

## Filter Windows events at the source

When you create a DCR, open the **Collect and deliver** tab and choose **Windows Event Logs** as the data source type. Select **Custom** instead of the basic log and severity selection. Entries use the format `LogName!XPathQuery`. For example, `Application!*[System[EventID=1035]]` returns only Application events with ID 1035.

Test the query before you paste it into the rule. Use the part before the exclamation mark as the log name:

```powershell
$XPath = '*[System[EventID=1035]]'
Get-WinEvent -LogName 'Application' -FilterXPath $XPath
```

If events come back, the query is valid. "No events were found" can still mean a valid query on a machine without matching events. "The specified query is invalid" means a syntax error.

Learn lists these limits:

- A DCR holds up to 20 XPath expressions, while Get-WinEvent accepts up to 23.
- Only XPath 1.0 functions such as `position`, `band` and `timediff` work. `starts-with` and `contains` do not.
- Event logs on network shares or UNC paths are not supported.
- Analytic and Debug channels cannot be collected.

The Learn page shows an example that keeps Critical, Error, Warning and Information events from System but excludes Event ID 6: `System!*[System[(Level=1 or Level=2 or Level=3) and (EventID != 6)]]`.

Watch for duplicates. Learn warns that adding several workspaces sends the data to each one and increases cost.

## Write a transformation

A transformation is a KQL statement that starts with `source`. Test it against existing data in Log Analytics first, then replace the table name with `source`. A query that reads `Syslog | where SeverityLevel != 'info'` becomes `source | where SeverityLevel != 'info'` in the rule.

To add it to an existing DCR:

1. Open the DCR and select **JSON view**, or export it with `az monitor data-collection rule show`.
2. Find the `dataFlows` section.
3. Add the `transformKql` property. The value must be on a single line.
4. Deploy with `az monitor data-collection rule update --body @dcr.json`.

Omitting `transformKql`, or setting it to `source`, applies no transformation.

Microsoft Learn gives three filtering patterns:

- Drop rows: `source | where severity == "Critical"`
- Drop columns you do not use: `source | project-away RawData`
- Keep only listed columns with `project`

## Know the KQL limits

Transformations process one record at a time. Learn lists these tabular operators as supported: `extend`, `project`, `print`, `where`, `parse`, `project-away`, `project-rename`, `datatable` and `columnifexists`. Only `source` and `print` are allowed data sources. `parse` is limited to 10 columns per statement, and `join` is listed as unsupported in the troubleshooting table.

Keep the query light. Learn says an optimal transformation takes no more than one second, and data loss is possible if one takes longer than 20 seconds.

## Add a workspace transformation

For data that does not use a DCR, add the transformation to the workspace:

1. In the Azure portal, open **Log Analytics workspaces** and select **Tables**.
2. Select the ellipsis next to the table, then **Create transformation**.
3. Create the workspace transformation DCR if none exists. If one exists, the portal selects it.
4. Select **Next**, open the **Transformation editor**, and run the query against real table data.
5. Select **Apply**, **Next** and **Create**.
6. In **Monitor** > **Data Collection Rules**, confirm the status shows **Succeeded**.

Each workspace can have only one workspace transformation DCR, but it can cover many tables. It applies to all data sent to the table, so use a `where` clause to separate sources. Not every table supports transformations. Learn refers to the table feature support list for the exact tables.

## Understand the billing rule

Learn describes two cases for Analytics or Basic Logs where a transformation adds cost. Adding data, for example a calculated column, is charged at the standard ingestion rate. Dropping more than half of the incoming data is charged on the amount above 50 percent. In Learn's example, 20 GB comes in and 12 GB is dropped. The processing charge covers 2 GB, and 8 GB is ingested.

If Microsoft Sentinel is enabled on the workspace, Learn states there is no cost for a transformation to Analytics tables. For Auxiliary Logs tables, the data processing charge applies to all incoming data.

## Check the result

Learn lists two built-in metrics: **Logs Transformation Duration per Min** and **Logs Transformation Errors per Min**. Enable DCR error logs and review the `DCRLogErrors` table to catch problems. Creating or changing a transformation needs the **Monitoring Contributor** role on the resource group or subscription.

## Other cost levers

Learn's cost guidance lists several options beyond filtering:

- Lower the polling frequency of performance counters.
- Configure debugging and auditing tables as Basic Logs if you query them rarely and do not alert on them.
- Consider a commitment tier if you collect enough data.
- Do not use the daily cap as a cost tool. It stops collection for the rest of the day, so pair it with an alert at a lower percentage.

## Typical mistakes

- Putting a workspace transformation in place and expecting it to change Azure Monitor Agent data.
- Setting both `transform` and `transformKql` on one data flow, which stops the transformation from being applied.
- Using `summarize` or `join` in a standard transformation.
- Checking the table before the roughly 60 minutes have passed.

The Learn pages read for this article do not describe a way to filter data on Azure Arc machines differently from other machines, so this article makes no Arc-specific claims.

## Related

- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/)
- [Log Analytics](https://www.m365.fm/entity/log-analytics/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)

## Sources

- [Ingestion-time transformations in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-transformations)
- [Create a transformation in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-transformations-create)
- [Supported KQL features in transformations](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-transformations-kql)
- [Best practices and samples for transformations](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-transformations-samples)
- [Collect Windows events with Azure Monitor Agent](https://learn.microsoft.com/en-us/azure/azure-monitor/vm/data-collection-windows-events)
- [Cost optimization in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/best-practices-cost)
