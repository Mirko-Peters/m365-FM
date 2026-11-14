---
title: "Azure Monitor KQL Log Alert Rules That Cut Alert Noise and Sprawl"
summary: "Build log search alert rules in Azure Monitor that fire less often and cost less: choose the right alert type, aggregate, split by few dimensions, use violations and auto-resolve, and avoid query limits."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [azure-monitor, kql, log-analytics]
keypoints:
  - "Choose the alert type first. Metric alerts fit precomputed metric data, and log search alerts fit data that needs KQL logic."
  - "Aggregate over a window instead of alerting on single rows, then require several violations in an evaluation period."
  - "Split by dimensions with care. Each resulting time series fires its own alert and is charged separately, with at most six dimensions per rule."
  - "Stateful alerts auto-resolve after a documented number of quiet periods. Mute actions suppress repeat actions but not alerts across different dimension combinations."
  - "The alert time range is limited to two days, and some KQL operators are not supported in alert queries."
faq:
  - q: "Which alert type should I use to reduce noise?"
    a: "Microsoft Learn says metric alerts suit data that is already in metrics and needs little manipulation, while log search alerts suit data that needs advanced KQL logic. For detecting a lack of data, Learn suggests metric alerts, because logs are more latent than metric data."
  - q: "How do I avoid an alert for every single error row?"
    a: "Use a measure with aggregation, such as a total over an aggregation granularity, and set the number of violations within an evaluation period. Learn's example: with a 5-minute granularity, alert only if three failures occur in the last hour. Simple log search alerts, by contrast, alert on each row."
  - q: "Does splitting by dimensions increase cost?"
    a: "Yes. Learn says each time series that results from the combination of dimension values triggers its own alert and is charged separately. It also says log search alerts are billed by evaluation frequency, so more frequent evaluation costs more."
  - q: "How long can the lookback be?"
    a: "The alert time range is limited to a maximum of two days. Even if the query contains ago(7d), only up to two days of data are scanned, and ago changes automatically to two days."
  - q: "When does a stateful alert resolve?"
    a: "Learn lists the rules by frequency. For a 1 minute frequency it resolves after the condition is not met for 10 minutes. For 5 to 15 minutes it is three periods, for 15 minutes to 11 hours two periods, and for 11 to 12 hours one period. Stateful rules above 12 hours are not supported."
---

To cut alert noise in Azure Monitor, alert on aggregated results instead of single rows, require several violations within an evaluation period, split by only a few stable dimensions and let stateful alerts resolve themselves. Each choice also lowers cost, because log search alerts are billed by evaluation frequency and by the number of time series.

## Step 1: Choose the right alert type

Learn's alert type table gives the starting point:

- **Metric alert.** For data that is already precomputed as metrics. Charged by the number of time series monitored.
- **Log search alert.** For advanced logic with KQL. Billed by how often the query is evaluated, and with dimension splitting also by the number of time series.
- **Simple log search alert.** Evaluates each row individually, so each error triggers an alert. Billed like a 1-minute log alert. It suits cases where immediate response matters, not noise reduction.
- **Activity log alert.** Stateless and event driven.

If you only need to detect a lack of data, Learn advises metric alerts. Logs are semi-structured and inherently more latent than metrics such as a VM heartbeat. Learn also says log data can be sent to the metric store through metric alerts for logs.

Metric and log search alerts can use dynamic thresholds. These apply machine learning to historical behavior, scale to hundreds of time series with one rule and adapt over time to reduce noisy thresholds. Sensitivity can be High (tighter thresholds, more alerts), Medium (default) or Low (fewer alerts).

## Step 2: Create the rule

In the Azure portal, go to **Monitor** > **Alerts** > **+ Create** > **Alert rule**, select the scope and choose **Custom log search**. You need read permission on the target resource, write permission on the resource group of the rule and read permission on action groups.

Query limits to remember:

- `bag_unpack()`, `pivot()` and `narrow()` are not supported.
- `ago()` works only with timespan literals.
- `AggregatedValue` is a reserved word.
- The combined size of the rule properties cannot exceed 64 KB.
- Put relative time clauses inside the query.

## Step 3: Measure and aggregate

Under **Measurement**, pick **Table rows** or a **calculation of a numeric column**. For the numeric option choose Total, Average, Minimum or Maximum and an **aggregation granularity**, which is the interval for combining records into one value. A rule that evaluates one number per window produces fewer alerts than one that reacts to rows.

## Step 4: Use violations and evaluation periods

Under advanced options, set **Number of violations** and the **Evaluation period**. This needs a `datetime` column in the query results. Example from Learn: aggregation granularity of 5 minutes, and an alert only if three failures happen in the last hour.

The **Frequency of evaluation** can be from one minute to one day. A one-minute frequency has restrictions. Queries that use `search`, `union`, `take`, `ingestion_time()`, the `adx` pattern, functions that call other tables or `AzureDiagnostics` filtered on a category with a resource-specific table can fail.

## Step 5: Split by dimensions carefully

Dimensions turn one rule into per-resource alerts. Rules:

- Up to six dimensions per rule, as string or numeric columns.
- Dimension values come from the last 48 hours. Add custom values or choose to include all future values.
- Each combination fires its own alert and is charged separately.
- Avoid changing metric values, timestamps, GUIDs or other high-cardinality values as dimensions. Learn says mute actions do not suppress notifications across such instances.

For a workspace-scoped rule, alerts fire on the workspace by default. To alert per Azure resource, use the Azure Resource ID column as a dimension, or specify the alert as a dimension in the Azure Resource ID property.

## Step 6: Resolve and mute

- **Automatically resolve alerts.** A stateful alert resolves after the condition is not met for 10 minutes at a 1-minute frequency, three periods at 5 to 15 minutes, two periods at 15 minutes to 11 hours and one period at 11 to 12 hours. Frequencies above 12 hours are not supported for stateful rules.
- **Mute actions.** Set a period during which actions do not fire again after an alert.

Learn adds that stateful log search alerts are limited to 300 alerts per evaluation and 5,000 alerts in the fired condition.

## Step 7: Set time range and identity

- The alert time range is capped at two days, even if the query asks for more. Use the override option when you need a different range inside that cap.
- Use a managed identity for Azure Data Explorer or Azure Resource Graph queries. One managed identity supports at most 50 rules that use Resource Graph queries.
- Custom properties, such as the evaluation window start and end, are sent to webhook, Logic Apps, Functions and Automation runbook actions.

## Practical review of an alert estate

1. List rules that evaluate every minute and ask whether five minutes would do.
2. Find rules with dimensions that change often.
3. Replace row-level rules with aggregated rules and violation counts.
4. Add auto-resolve and mute settings.
5. Compare each rule with a metric alert where the data exists as metrics.

The pages I read do not give a pricing figure or a limit on the total number of rules, so use the Azure Monitor pricing page for cost estimates.

## Related

- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Log Analytics](https://www.m365.fm/entity/log-analytics/)
- [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/)

## Sources

- [Create or edit a log search alert rule (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-log-alert-rule)
- [Choosing the right type of alert rule (Microsoft Learn)](https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-types)
