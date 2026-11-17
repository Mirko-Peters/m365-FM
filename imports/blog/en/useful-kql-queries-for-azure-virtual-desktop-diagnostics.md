---
title: "Useful KQL queries for Azure Virtual Desktop diagnostics"
summary: "These KQL queries come word for word from Microsoft Learn pages and answer four admin questions: why a user's connection failed, whether others hit the same error, whether autoscale evaluations fail, and how the network behaves. Each section names the table, the setting that fills it and the limits of the data."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-insights, kql]
keypoints:
  - "All queries run against the WVD-prefixed tables that fill after you add a diagnostic setting with Send to Log Analytics on the host pool, application group or workspace."
  - "Start with WVDErrors and the Connection Errors query, which joins WVDConnections, WVDErrors and WVDCheckpoints on CorrelationId. A ServiceError value of false means an admin can resolve the cause."
  - "The WVDAutoscaleEvaluationPooled table covers pooled host pools only. Learn says Insights does not monitor autoscale for personal host pools."
  - "The connection quality table WVDConnectionNetworkData is documented on a page headed preview, so check the current page before you build alerts on it."
  - "Connections that never reach the service do not appear in diagnostics, and Log Analytics storage charges apply to all collected data."
faq:
  - q: "Which tables do I need for AVD diagnostics in Log Analytics?"
    a: "Learn says all Azure Virtual Desktop diagnostics tables have a WVD prefix. The ones used here are WVDConnections, WVDErrors, WVDCheckpoints, WVDAgentHealthStatus, WVDAutoscaleEvaluationPooled and WVDConnectionNetworkData. Each is filled by a diagnostic setting on the relevant resource."
  - q: "Why does my query return nothing for a user?"
    a: "Learn says data is available only for activity after diagnostics was enabled, and that it can take a few hours after first set-up. Connections that do not reach Azure Virtual Desktop are not shown at all, because the diagnostics role service is part of the service. Also check that you replaced placeholders such as userupn."
  - q: "What does ServiceError mean in WVDErrors?"
    a: "Learn says the value should be false for issues an admin can resolve. If it is true, escalate to Microsoft and provide the CorrelationId of the failing activity."
---

The fastest way to diagnose an Azure Virtual Desktop problem in Log Analytics is to query WVDErrors for the affected user, then join the connection and checkpoint tables on the correlation ID to see where the attempt stopped. This article collects the queries that Microsoft Learn publishes for that, grouped by the question they answer. Every query block below is copied from a Learn page; replace placeholders such as `userupn` before you run it. For the dashboards built on the same data, see "Key metrics and alerts for Azure Virtual Desktop" and [AVD Insights](/entity/avd-insights/), and for fixing a failed connection once you know the cause, see "Troubleshooting Azure Virtual Desktop connection failures: a checklist".

## What must be switched on first

Learn's [diagnostics article](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics) says to open the object in Azure Virtual Desktop (host pool, application group or workspace), select **Diagnostic settings**, then **Add diagnostic setting**, and **Send to Log Analytics**. Select the categories you want. Remember to enable it for each Azure Resource Manager object you monitor; data exists only for activity after you enable diagnostics and can take a few hours to appear after first set-up. To query, open your [Log Analytics](/entity/log-analytics/) workspace and select **Logs**, or use **Monitor** then **Logs**. All diagnostics tables have the prefix WVD.

Learn's Insights setup page lists the categories to enable on a host pool: Management Activities, Feed, Connections, Errors, Checkpoints, HostRegistration and AgentHealthStatus. For a workspace it lists Management Activities, Feed, Errors and Checkpoints. The same page says standard Log Analytics data storage charges apply.

| Table | What a row represents | Notes from Learn |
|---|---|---|
| WVDConnections | A connection activity in the states Started, Connected and Completed | The Connection Errors query joins it to WVDErrors and WVDCheckpoints on `CorrelationId` |
| WVDErrors | An error for an activity | `ServiceError` false means an admin can resolve it |
| WVDCheckpoints | A step reached in an activity | Apps inside a full desktop session are not tracked |
| WVDAgentHealthStatus | Health of the agent on each session host | Fires about every 30 seconds |
| WVDAutoscaleEvaluationPooled | One autoscale evaluation of a pooled host pool | Needs the autoscale log category |
| WVDConnectionNetworkData | Round-trip time and bandwidth estimates | Preview page; needs the Network Data Logs category |

## Question 1: why did this user's connection fail?

Start with the errors for the user:

```kusto
WVDErrors
| where UserName == "userupn"
|take 100
```

Our note, not from Learn: `take` returns an arbitrary set of rows, not the newest. To see the latest errors first, put `| order by TimeGenerated desc` before `| take 100`. Learn adds that `WVDErrors` shows management errors, host registration issues and problems while a user subscribes to a list of apps or desktops. Then use the Connection Errors query from the WVDConnections examples. It lists the checkpoints and errors for each connection attempt. Uncomment the user filter to narrow it:

```kusto
//You can also uncomment the where clause to filter to a specific user if you are troubleshooting an issue.
WVDConnections
//| where UserName == "upn.here@contoso.com"
| project-away TenantId,SourceSystem
| summarize arg_max(TimeGenerated, *), StartTime = min(iff(State=='Started', TimeGenerated , datetime(null) )), ConnectTime = min(iff(State=='Connected', TimeGenerated , datetime(null) )) by CorrelationId
| join kind=leftouter
(
    WVDErrors
    |summarize Errors=make_list(pack('Code', Code, 'CodeSymbolic', CodeSymbolic, 'Time', TimeGenerated, 'Message', Message ,'ServiceError', ServiceError, 'Source', Source)) by CorrelationId
) on CorrelationId
| join kind=leftouter
(
    WVDCheckpoints
    | summarize Checkpoints=make_list(pack('Time', TimeGenerated, 'Name', Name, 'Parameters', Parameters, 'Source', Source)) by CorrelationId
    | mv-apply Checkpoints on
    (
        order by todatetime(Checkpoints['Time']) asc
        | summarize Checkpoints=make_list(Checkpoints)
    )
) on CorrelationId
| project-away CorrelationId1, CorrelationId2
| order by TimeGenerated desc
```

Read it from the oldest checkpoint to the newest to see the last step that completed. Keep the `CorrelationId` of a failing attempt: Learn says to provide it when you escalate an error to Microsoft.

## Question 2: is it only this user?

Take the symbolic code from the first query and count the users affected:

```kusto
WVDErrors
| where CodeSymbolic =="ErrorSymbolicCode"
| summarize count(UserName) by CodeSymbolic
```

Learn's Insights glossary says that if a connection issue spans multiple hosts, users, resources or clients, it is likely to affect the whole system, and otherwise it is a smaller issue of lower priority. Our reading: many users with one code suggest looking at the shared environment, and a single user suggests looking at that user's client and account. The glossary also defines "Kind": errors marked ServiceError TRUE happened in the service, and errors marked FALSE happened outside it.

## Question 3: are autoscale evaluations failing?

Learn documents this table for **pooled** host pools. Its Insights page says personal host pools are not supported for autoscale monitoring in Insights, and that for personal pools you send Autoscale logs to a storage account or event hub. For a pooled pool, add the category **Autoscale logs for pooled host pools** to the host pool's diagnostic setting, then run:

```kusto
WVDAutoscaleEvaluationPooled
| where ResultType != "Succeeded"
| join kind=leftouter WVDErrors
    on CorrelationId
| order by _ResourceId asc, TimeGenerated asc, CorrelationId, TimeGenerated1 asc
```

This returns evaluations that failed, including partial failures, with the matching WVDErrors rows where `ServiceError` is false. The table also holds `ScalingReasonMessage`, which Learn describes as the actions autoscale decided to perform and why, so it is a good column to read when a host pool did not scale as planned. The related [scaling plan](/entity/avd-scaling-plan/) articles explain the settings behind the decisions.

## Question 4: how is the network behaving?

The connection quality page, headed **preview** on Learn, documents WVDConnectionNetworkData. In the host pool's **Diagnostic settings**, select **allLogs**, or select **Network Data Logs** and **Connection Graphics Data Logs Preview** plus the tables you need. Learn notes that your host pool needs users who have connected, and that data can take up to 15 minutes to appear. This query charts the round-trip time distribution:

```kusto
// 90th, 50th, 10th Percentile for RTT in 10 min increments
WVDConnectionNetworkData
| summarize RTTP90=percentile(EstRoundTripTimeInMs,90),RTTP50=percentile(EstRoundTripTimeInMs,50),RTTP10=percentile(EstRoundTripTimeInMs,10) by bin(TimeGenerated,10m)
| render timechart
```

The same page has queries for bandwidth, for round-trip time and bandwidth per connection joined to WVDConnections (client OS, client version, protocol), and for the 10 users with the highest round-trip time. Because the page is a preview page dated 2023, check its current state before you base an alert on the table.

## A triage order that uses these queries

This order is our suggestion, built from the queries above rather than a Learn procedure:

1. Run the WVDErrors query for the reporting user and note the `CodeSymbolic`, the `ServiceError` value and the `CorrelationId`.
2. Run the Connection Errors query for the same user and read the checkpoints for that correlation ID to find the last step reached.
3. Count the users with the same `CodeSymbolic`. A wide spread points at a host, network path or policy; a single user points at the client or account.
4. If the error is `ServiceError` true, stop and escalate with the correlation ID. If it is false, continue with the session host, using the agent health queries.
5. For slow rather than failed sessions, compare the round-trip time chart with the time of the user's report.

## Other published queries worth knowing

Learn's Azure Monitor reference pages hold more examples that follow the same pattern:

- WVDConnections: session duration, top 10 users by average connection duration, average connection duration by host pool, client operating systems by user count, and average session logon time by host pool.
- WVDCheckpoints: published remote resources by count of users, which only reflects apps published as RemoteApp.
- WVDAgentHealthStatus: peak active sessions per host pool as a time chart (the Learn query is titled "Active sessions on SessionHost", but it sums the hosts of each pool), and a health check summary whose query maps the check indexes to names such as DomainJoin, DomainTrust, FSLogix, SxSStack, URLCheck, DomainReachable, WebRTCRedirector and IMDSReachable. Use it after the [agent](/entity/avd-agent/) shows as unavailable.

Learn's glossary defines time to connect as starting at a WVDConnections row with state Started and ending at a WVDCheckpoints row named ShellReady for desktops, or RdpShellAppExecuted for RemoteApp (first launch only). That tells you where to look if you build your own logon-time query.

## Limits of the data

- Connections that do not reach Azure Virtual Desktop do not appear in diagnostics results, so a client-side network failure can leave no row at all.
- Client information can be missing from WVDConnections and WVDCheckpoints even when the connection completes.
- Diagnostic events are sent when completed, and connection activities show Started, Connected and Completed as intermediate states.
- The diagnostics article is dated 2020 on Learn and its query set is small; the Azure Monitor reference pages are dated January 2026. Learn's Azure Monitor pages are the more current source for examples.
- Standard Log Analytics storage charges apply to every table you send.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop diagnostics log analytics](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: Monitor Autoscale operations with Insights in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Collect and query Azure Virtual Desktop connection quality data (preview)](https://learn.microsoft.com/en-us/azure/virtual-desktop/connection-quality-monitoring)
- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [Microsoft Learn: Example log table queries for WVDConnections](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/wvdconnections)
- [Microsoft Learn: Example log table queries for WVDCheckpoints](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/wvdcheckpoints)
- [Microsoft Learn: Example log table queries for WVDAgentHealthStatus](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/wvdagenthealthstatus)
