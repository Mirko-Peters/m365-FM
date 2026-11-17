---
title: "Key metrics and alerts for Azure Virtual Desktop"
summary: "Azure Virtual Desktop monitoring rests on three data sources: connection and error diagnostics in Log Analytics, performance counters from the session hosts, and autoscale evaluations. Insights charts them and Azure Monitor log search alerts can notify on them, but Learn gives no ready-made alert list, so the thresholds you set are your own."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-insights, azure-virtual-desktop]
keypoints:
  - "Insights is a dashboard built on Azure Monitor Workbooks. It needs diagnostic settings on host pools and workspaces, the Azure Monitor Agent with a data collection rule on the session hosts, and a Log Analytics workspace. Alerts are optional and set up separately."
  - "Learn's Insights pages give two yardsticks for input delay: ideal below 100 ms in the use cases, and good below 150 ms, acceptable 150 to 500 ms in the glossary. For latency it says generally below 100 ms, poor above 200 ms."
  - "Most Azure Virtual Desktop diagnostics are logs, so log search alerts on the WVD tables are the natural fit. Learn warns that log alerts are a poor fit for detecting missing data and suggests metric alerts for that."
  - "Insights shows only active severity 0 Azure Monitor alerts on its Overview page. Alert rules, action groups and severity are configured in Azure Monitor."
  - "Session host update does not install the Azure Monitor Agent on the new hosts, so monitoring can go quiet after an update unless Azure Policy installs the agent."
faq:
  - q: "Does Azure Virtual Desktop have a built-in alert set?"
    a: "Learn describes Insights and the Azure Monitor alerts framework but does not publish a list of recommended Azure Virtual Desktop alert rules. Azure Monitor's recommended alert rules are enabled for virtual machines, AKS resources and Log Analytics workspaces. You create Azure Virtual Desktop alert rules yourself, for example as log search alerts on the WVD tables."
  - q: "Which alert type should I use for Azure Virtual Desktop diagnostics?"
    a: "Log search alerts, because the diagnostics land in Log Analytics tables whose names start with WVD. Use activity log alerts for events such as a VM being deleted, and metric alerts for platform metrics of the session host VMs or for detecting missing data."
  - q: "Why did my Insights data stop after a session host update?"
    a: "Learn says the Azure Monitor agent is not installed automatically on session hosts that session host update creates. It suggests Azure Policy to install the agent, or adding the hosts again from within Insights in the Azure portal."
---

The metrics that matter most for Azure Virtual Desktop come from three places: connection and error diagnostics, performance counters from the session hosts, and autoscale evaluations. Insights charts all three, and Azure Monitor alert rules can notify you when they cross a limit you choose. Microsoft Learn does not publish a recommended set of Azure Virtual Desktop alert rules, so this article separates what Learn states from the starting rules we suggest.

It does not cover query-by-query diagnostics, which belong to a separate article on KQL.

## What has to be in place first

[Azure Virtual Desktop Insights](/entity/avd-insights/) is, in Learn's words, a dashboard built on [Azure Monitor Workbooks](/entity/azure-monitor-workbooks/). The Insights setup page (ms.date January 2025, updated June 2025) lists what it needs:

- A [Log Analytics workspace](/entity/log-analytics/). Learn recommends a designated workspace for the session hosts so that counters and events come only from your Azure Virtual Desktop deployment.
- Diagnostic settings on each host pool for Management Activities, Feed, Connections, Errors, Checkpoints, HostRegistration and AgentHealthStatus, and on each workspace for Management Activities, Feed, Errors and Checkpoints. Diagnostics start flowing only after you enable them, and Learn says it can take a few hours after the first setup.
- The [Azure Monitor Agent](/entity/azure-monitor-agent/) on every session host, with a data collection rule for performance counters and Windows Event Logs. Learn names the required event logs, including FSLogix's Operational and Admin logs.
- For people who read the dashboard: Desktop Virtualization Reader on the resource group or subscription and Log Analytics Reader on the workspace.

Open Insights at `aka.ms/avdi` and use the configuration workbook to check the setup. Two caveats from Learn matter for alerting. Diagnostic events are sent to Log Analytics when an activity completes, and connections that never reach Azure Virtual Desktop do not show up at all, because the diagnostics service is part of Azure Virtual Desktop. And after a session host update, the agent is not installed on the new hosts automatically; Learn suggests Azure Policy for that.

## The metrics worth watching

| Question | Where Learn shows it | Reading |
|---|---|---|
| Can users connect? | Insights glossary: connection success; potential connectivity issues | A failed connection means it could not reach the host. A problem spanning several hosts, users, resources or clients likely affects the whole system |
| Is the network slow? | Insights, Connection Performance, round-trip time by gateway region | Latency generally below 100 ms, a session broadly low quality above 200 ms; compare median with the 95th percentile |
| Is sign-in slow? | Time to connect | Split into user route, stack connected, logon (profiles, GPOs, shell start, FSLogix) and shell start to shell ready. Learn subtracts the time users take to enter credentials |
| Do users feel lag? | Host Performance, input delay | See the two yardsticks below |
| Are hosts under pressure? | Host CPU and memory, disk timing, disk queue length | Learn's example flags CPU above 60% for one minute; it is an example, not a limit |
| Are connections dropping? | Connection Reliability | Top 20 disconnection events, pivoted by host pool, transport, session host, client version or gateway region |
| Is capacity right? | Utilization: session history, session host count, users per core | Idle hosts powered on suggest a scaling plan |
| Is autoscale healthy? | Autoscale tab; WVDAutoscaleEvaluationPooled | Pooled host pools only; personal pools send autoscale logs to a storage account or Event Hubs |

Learn's two Insights pages disagree slightly on input delay. The use-cases page says each host should ideally stay below 100 ms. The glossary sorts delay into good (below 150 ms), acceptable (150 to 500 ms), poor (500 to 2,000 ms) and bad (above 2,000 ms), based on a counter sampled every 30 seconds with the worst case in each window reported. Pick one and say which in your runbook.

## What Insights does with alerts

Insights reads alerts; it does not create them. Learn calls Azure Monitor alerts an optional feature to be set up separately, and says the Overview page shows active alerts classified as severity 0, the "most urgent items" that could stop a deployment working. A severity 2 rule will therefore not appear there, but it still fires and notifies.

## Which alert type fits

Learn's alert types page gives the guide. This table maps it to Azure Virtual Desktop.

| Alert type | Learn's use | Azure Virtual Desktop fit |
|---|---|---|
| Log search | Advanced logic on log data with KQL; billed by evaluation interval, and by time series if you split by dimensions | The WVD tables: errors, autoscale evaluations, agent health |
| Metric | Data that is already precomputed as metrics; one rule can cover many resources of one type in one region, but not VM guest metrics | Platform metrics of session host VMs, such as the CPU example Learn gives; detecting missing data |
| Activity log | Event-driven and stateless; fires once and stays "Fired" until you set the user response | A VM deleted or restarted in a production resource group; Service Health and Resource Health |

Learn's note on log alerts is worth keeping: they work best for detecting specific data, not a lack of data, because logs are more latent than metrics. For a session host that stopped reporting, Learn points to metric alerts.

## Building a log search alert rule

Learn's rule wizard, from **Monitor** > **Alerts** > **Create** > **Alert rule**:

1. Choose the Log Analytics workspace as scope.
2. On **Condition**, choose **Custom log search** and write the query. Learn lists limits: no `bag_unpack()`, `pivot()` or `narrow()`, and `ago()` only with timespan literals.
3. Under **Measurement**, choose **Table rows** or a numeric column, an aggregation type and an aggregation granularity. By default, the rule counts results in the last five minutes.
4. Optionally **Split by dimensions**, up to six string or numeric columns. Learn warns against volatile values such as timestamps or GUIDs, because each combination becomes a separate alert.
5. Set the **Threshold** (static or dynamic) and the **Frequency of evaluation**, anywhere from one minute to one day. More frequent evaluation costs more. A one-minute frequency rules out queries with `search`, `union` or `take`.
6. Under advanced options, require several violations, for example three failures within an hour.
7. Add an action group, set severity, name the rule and, on the **Details** tab, choose the identity. Learn advises a managed identity if you want to see its permissions; without one, the rule inherits the permissions of the last editor. The identity needs Reader on every workspace the query reads.
8. Optionally **Automatically resolve alerts** to make the rule stateful, and **Mute actions** to stop repeat notifications.

You need read permission on the target, write permission on the rule's resource group, and read on the action group. Fired alerts are kept for 30 days.

## A starting set of rules

Learn publishes no thresholds for these, so the conditions are our suggestions. Tune them against two weeks of your own data.

| Rule | Query idea | Notes |
|---|---|---|
| Autoscale evaluation not successful | `WVDAutoscaleEvaluationPooled`, `where ResultType != "Succeeded"` (Learn's own filter), threshold above 0 | Join to `WVDErrors` on `CorrelationId` for detail, as Learn's sample does |
| Admin-fixable errors rising | `WVDErrors`, `where ServiceError == false`, split by `CodeSymbolic`, threshold above a count you set | Learn says `ServiceError` false marks issues an admin task can resolve; true means escalate to Microsoft with the correlation ID |
| Agent health | `WVDAgentHealthStatus`, filtered on the `Status` values you see in your data | Learn's column description does not list the values, so read them from your own table first |
| Session host VM under load | Metric alert on VM platform metrics | Multi-resource rules need the same resource type and region |
| VM deleted in production | Activity log alert on the resource group | Learn gives a VM deleted in a production resource group as an example scenario |

Keep the first version small. A rule nobody acts on is noise, and dimension splitting multiplies alerts quickly.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [Microsoft Learn: Use cases for Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-use-cases)
- [Microsoft Learn: Monitor Autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Send Azure Virtual Desktop diagnostics to Log Analytics](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Types of Azure Monitor alerts](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types)
- [Microsoft Learn: Overview of Azure Monitor alerts](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview)
- [Microsoft Learn: Create Azure Monitor log search alert rules](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-log-alert-rule)
- [Microsoft Learn: WVDErrors table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvderrors)
- [Microsoft Learn: WVDAgentHealthStatus table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdagenthealthstatus)
