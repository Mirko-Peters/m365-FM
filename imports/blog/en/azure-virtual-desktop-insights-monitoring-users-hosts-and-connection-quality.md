---
title: "Azure Virtual Desktop Insights: monitoring users, hosts and connection quality"
summary: "Azure Virtual Desktop Insights is a dashboard built on Azure Monitor Workbooks that turns service diagnostics, session host performance counters and event logs into views for connections, hosts, clients, utilization and autoscale. This article explains which tab answers which question, how Learn defines the main metrics, and where the data has limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-insights, azure-virtual-desktop]
keypoints:
  - "Insights is a dashboard on Azure Monitor Workbooks. It reads three data sets from Log Analytics workspaces: Azure Virtual Desktop diagnostics, recommended performance counters and recommended Windows event logs. The session host data can go to a different workspace than the diagnostics."
  - "Different tabs answer different questions: Connection Performance for round-trip time, Connection Reliability for disconnections, Host Performance and Host Diagnostics for session host load and input delay, Utilization for capacity and cost, Clients for outdated client versions, Autoscale for scaling operations."
  - "Learn's input delay categories are good below 150 ms, acceptable 150 to 500 ms, poor 500 to 2,000 ms and bad at 2,000 ms and above (Learn words that edge two ways). Its use cases page separately says ideal latency is generally below 100 ms and sessions become low quality above 200 ms."
  - "Autoscale monitoring in Insights works for pooled host pools only. Time to connect, available sessions and total session counts have documented caveats, so read single spikes with care."
  - "Learn's cost example estimates 92 to 145 MB of data per session host per day, roughly 3 to 5 GB per host per 31 days, with performance counters making up 80 to 99% of ingestion."
faq:
  - q: "What does Azure Virtual Desktop Insights need before it shows data?"
    a: "Learn lists a Log Analytics workspace, diagnostic settings on the host pool and workspace, and collection of the recommended performance counters and Windows event logs from the session hosts through the Azure Monitor Agent. Viewers need the Desktop Virtualization Reader role on the resource group or subscription and the Log Analytics Reader role on the workspace."
  - q: "Why are some Insights charts empty or delayed?"
    a: "Learn says missing counters or events mean the matching data does not appear, and that missing permissions or blocked outgoing ports can also cause it. Its troubleshooting page lists the configuration workbook check first, then permissions and outgoing ports, and says to wait 15 minutes and refresh if data from recent activity is missing."
  - q: "Does Insights monitor autoscale for personal host pools?"
    a: "No. Learn says Autoscale operations can be monitored in Insights for pooled host pools only. For personal host pools you can send the autoscale diagnostic logs to a storage account or an event hub instead."
---

Azure Virtual Desktop Insights shows how users connect, how session hosts perform and how the connection quality looks, in one dashboard. Learn's glossary defines the main metrics, and several come with caveats.

Setup is covered in "Setting up AVD Insights with Azure Monitor and Log Analytics", query examples in "Useful KQL queries for Azure Virtual Desktop diagnostics" and alert rules in "Key metrics and alerts for Azure Virtual Desktop".

## What Insights is and where its data comes from

Learn describes [Azure Virtual Desktop Insights](/entity/avd-insights/) as a dashboard built on [Azure Monitor Workbooks](/entity/azure-monitor-workbooks/) that helps IT professionals understand their environments. Open it at `aka.ms/avdi` or per host pool under **Host pools**, then **Insights**. It draws on three kinds of data in [Log Analytics](/entity/log-analytics/) workspaces. The workspace that receives session host data does not have to be the one that receives the diagnostic data:

- **Service diagnostics** from the host pool and workspace diagnostic settings (connections, errors, checkpoints, feeds, management, host registration, agent health).
- **Performance counters** from the session hosts, such as processor time, memory, disk queue length, sessions and user input delay.
- **Windows event logs** from the session hosts, including FSLogix and Remote Desktop Services logs.

The [Azure Monitor Agent](/entity/azure-monitor-agent/) collects the session host data. Insights based on that agent became generally available in version 3.0.0 (18 September 2023), with an "Insights (Legacy)" view for the Log Analytics agent, which version 4.0.5 (7 October 2024) marks as deprecated.

Viewers need the Desktop Virtualization Reader role on the resource group or subscription that holds the host pools, workspaces and session hosts, and the Log Analytics Reader role on the workspace.

## Which tab answers which question

The table maps each tab to the question it helps with. The questions are our grouping; the notes column follows Learn.

| Tab | Question it answers | Notes from Learn |
|---|---|---|
| Overview | Is the environment healthy at a glance? | Active Azure Monitor alerts of severity 0. Release notes: 4.2.0 let the Host Pool Overview view switch between pooled and personal host pools. |
| User | What does one user experience? | Release notes name a User page (a User tab in 2.0.2) and an RTT view added in 4.2.0. The glossary describes a user report page. |
| Connection Performance | Is latency between users and the session host region high, and which gateway regions and users are affected? | Round-trip time per gateway region, median and 95th percentile |
| Connection Reliability | Where do sessions disconnect, and what do they have in common? | Top 20 disconnection events and pivots such as host pool, transport, client version and gateway region |
| Host Performance | Are session hosts the reason for slow input? | Input delay by host, CPU, memory and disk metrics |
| Host Diagnostics | Which host crossed a threshold? | Performance counters flagged for available memory, page faults, CPU, disk space and input delay per session |
| Utilization | Are hosts running idle, and when is demand? | Session history and session host count over time; release notes place a Connection Time graph here (2.0.1) |
| Clients | Who runs outdated clients? | Newest client version per client type, with affected users |
| Autoscale | What did autoscale do? | Pooled host pools only |

## Reading users: activity, connection health and time to connect

The glossary defines the user-facing numbers but does not say on which tab each appears:

- **Daily active users** counts users who started a session in the last 24 hours. **Monthly active users** counts users who started a session in the last 28 days. If you store data for 30 days or less, you can see lower-than-expected MAU and connection values while fewer than 28 days of data exist.
- **Connection success** means the connection reached the host, as confirmed by the stack on that virtual machine. A failed connection did not reach the host.
- **Potential connectivity issues** lists hosts, users, published resources and clients with a high connection failure rate. Per Learn, an issue spanning several hosts, users, resources or clients likely affects the whole system; otherwise it is smaller.
- **Errors** by kind: "service" (`ServiceError = TRUE`) occurred in the Azure Virtual Desktop service, "deployment" (`ServiceError = FALSE`) outside it.
- The **User report** shows one user's connection history and errors, filterable by connection ID or time period.

**Time to connect** is the time between a user opening a resource and the desktop being loaded and ready. It starts at a `started` connection state and ends at the `ShellReady` checkpoint for desktops, or `RdpShellAppExecuted` for the first RemoteApp launch. Learn splits it into user route, stack connected, logon (profile, Group Policy, shell start, FSLogix) and shell start to shell ready. These components can run in parallel, so they do not add up to the total time to connect.

The glossary says the time to provide credentials is subtracted, while the troubleshooting page says time to connect includes the time users take to enter credentials and can show false peaks in some cases. A missing connection completion event can also affect some visuals.

## Reading hosts: input delay and resource counters

On the Host Performance tab, the central metric is **input delay**, based on the user input delay per process performance counter. Learn says the counter reports every 30 seconds; each interval is a "sample" and reports the worst case in that window. **Median** and **p95** are taken across all samples. Learn's categories (it words the Poor/Bad edge as both "below 2 seconds" and "over 2,000 milliseconds (2 seconds and up)"):

| Category | Input delay |
|---|---|
| Good | below 150 ms |
| Acceptable | 150 to 500 ms |
| Poor | 500 to 2,000 ms |
| Bad | 2,000 ms and above |

The use cases page adds that ideally each host's input delay is below 100 ms.

In the use cases workflow, open **Host Performance** and compare the **Input delay by host** table and the **Median input delay over time** graph with the **Host CPU and memory metrics**, **Host disk timing metrics** and **Host disk queue length** graphs.

The **Host Diagnostics** tab flags devices that cross thresholds for available memory, page faults, CPU, disk space and input delay per session. Learn's glossary and use cases pages do not state which threshold values the tab uses; the only value they show is 60% CPU over one minute in the use cases example. For extended high utilization Learn suggests a larger VM size for the [session host](/entity/avd-session-host/).

## Reading connection quality: round-trip time and reliability

**Round-trip time** is, per the glossary, an estimate of the round-trip time between the end user's location and the session host's Azure region. On the **Connection Performance** tab, the **RTT by gateway region** table and the **RTT median and 95th percentile for all regions** graph show it. Learn says ideal interaction times require latency generally below 100 ms, and a session broadly becomes low quality above 200 ms.

Learn notes that p95 is often substantially higher than the median, so some users have periods of higher latency. Selecting a gateway region shows its graph and the top 20 users by RTT median. Learn names poor Wi-Fi and ISP problems as causes.

On the source of RTT: the glossary lists the `RemoteFX Network(*)\Current TCP RTT` counter, while release notes for version 4.0.3 (22 August 2024) say RTT queries still using it were switched to Azure Virtual Desktop network logs. Learn's connection quality data page has "(preview)" in its title, and its Important note names the Connection Graphics Data Logs as the preview part. The page also describes a Network Data Logs diagnostic category and the `WVDConnectionNetworkData` table. Learn's Insights pages do not say whether the RTT views read that table, so we cannot name the diagnostic setting they need.

**Connection Reliability** charts disconnections against concurrent connections and lists the top 20 disconnection events. Select a row to highlight its time segment, then apply a **pivot** to look for commonalities: subscription, resource group, host pool, transport, session host, session host IP/16, client type, client version, client IP/16 or gateway region. The transport pivot distinguishes UDP types (`Multipath`, `Relay`, `ShortpathPublic`, `ShortpathPrivate`) from TCP (`NotUsed`). Connection reliability was preview in version 3.3.1 (April 2024) and generally available in 3.5.0 (1 July 2024); Multipath as a UDP type was added in 4.3.1.

## Using Insights for capacity and cost

The **Utilization** tab holds the session history chart (active and idle, meaning disconnected, sessions) and the session host count chart. Learn says a regular, repeated pattern, such as midday weekday peaks and little weekend activity, usually indicates an opportunity for a [scaling plan](/entity/avd-scaling-plan/); Learn's example also shows long periods where idle session hosts stay powered on, which raises cost. Review all host pools together first, then narrow the scope to one host pool to find the pattern for that pool's scaling plan.

The **Autoscale** tab shows scaling operations, including host power state changes over time. Learn says this works for pooled host pools only, with an assigned scaling plan. The host pool diagnostic setting needs the category "Autoscale logs for pooled host pools" on top of the minimum categories the autoscale page lists: checkpoint, error, management, connection, host registration and agent health. Release notes list autoscale reporting as preview in version 3.3.1 (April 2024) with no later status change; the Learn autoscale page has no preview label. Autoscale evaluations are written to the `WVDAutoscaleEvaluationPooled` table. Its `ScalingReasonMessage` column holds the actions autoscale decided to perform and why. Learn's Insights autoscale page does not mention dynamic autoscale, so it does not say whether the tab covers it.

The **Clients** tab lists, per client type, the highest version as **Newest** and the number of users on older versions, with days behind and an export button. Windows App on iOS/iPadOS and Android appears with a build number instead of a version number.

Insights adds workspace costs. Learn's example, with light and power usage VMs, is 90 to 130 MB per VM per day for performance counters, 2 to 15 MB for events and under 1 MB for diagnostics: 92 to 145 MB per VM per day, or roughly 3 to 5 GB every 31 days. Learn calls all sizes examples and says performance counters should make up 80 to 99% of ingestion. Its levers are a designated workspace, shorter retention, a fixed pricing tier, an ingestion cap and fewer or less frequent counters; removing data points affects their corresponding visuals.

## Limits to keep in mind

- **Latency and gaps**: Azure Monitor has a 15-minute latency for populating log data. Missing counters or events, missing permissions and blocked outgoing ports leave the matching data absent.
- **Total sessions**: the total session performance counter can overcount by a small number, so totals may appear to exceed your maximum session limit.
- **Available sessions**: the glossary defines it as VMs times maximum sessions per VM minus total sessions, and Learn says the count does not reflect scaling policies on the host pool.
- **Custom workbooks**: custom templates do not automatically adopt updates.
- **Scale**: the configuration workbook's automated agent deployment is limited to 1,000 session hosts or fewer; for larger pools Learn recommends installing the Azure Monitor Agent through an ARM template.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [Microsoft Learn: Use cases for Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-use-cases)
- [Microsoft Learn: What's new in Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-insights)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights monitoring costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Microsoft Learn: Monitor Autoscale operations with Insights in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Collect and query Azure Virtual Desktop connection quality data (preview)](https://learn.microsoft.com/en-us/azure/virtual-desktop/connection-quality-monitoring)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-insights)
