---
title: "Azure Virtual Desktop Insights: monitoring users, hosts and connection quality"
summary: "Azure Virtual Desktop Insights is a dashboard built on Azure Monitor Workbooks that turns service diagnostics, session host performance counters and event logs into views for connections, hosts, clients, utilization and autoscale. This article explains which tab answers which question, how Learn defines the main metrics, and where the data has limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-insights, azure-virtual-desktop]
keypoints:
  - "Insights is a dashboard on Azure Monitor Workbooks. It reads three data sets from a Log Analytics workspace: Azure Virtual Desktop diagnostics, recommended performance counters and recommended Windows event logs. Without that data, the matching visuals stay empty."
  - "Different tabs answer different questions: Connection Performance for round-trip time, Connection Reliability for disconnections, Host Performance and Host Diagnostics for session host load and input delay, Utilization for capacity and cost, Clients for outdated client versions, Autoscale for scaling operations."
  - "Learn's input delay categories are good below 150 ms, acceptable 150 to 500 ms, poor 500 to 2,000 ms and bad above 2,000 ms. Its use cases page separately says ideal latency is generally below 100 ms and sessions become low quality above 200 ms."
  - "Autoscale monitoring in Insights works for pooled host pools only. Time to connect, available sessions and total session counts have documented caveats, so read single spikes with care."
  - "Learn's cost example estimates 92 to 145 MB of data per session host per day, roughly 3 to 5 GB per host per 31 days, with performance counters making up 80 to 99% of ingestion."
faq:
  - q: "What does Azure Virtual Desktop Insights need before it shows data?"
    a: "Learn lists a Log Analytics workspace, diagnostic settings on the host pool and workspace, and data collection for the recommended performance counters and Windows event logs from the session hosts, which uses the Azure Monitor Agent. Viewers need the Desktop Virtualization Reader role on the resource group or subscription and the Log Analytics Reader role on the workspace. Standard Log Analytics storage charges apply."
  - q: "Why are some Insights charts empty or delayed?"
    a: "Learn says missing counters or events mean the matching data does not appear, that missing permissions or blocked outgoing ports can also cause it, and that Azure Monitor has a 15-minute latency for populating log data. Waiting 15 minutes and refreshing is the first step, then the configuration workbook should be checked."
  - q: "Does Insights monitor autoscale for personal host pools?"
    a: "No. Learn says Autoscale operations can be monitored in Insights for pooled host pools only. For personal host pools you can send the autoscale diagnostic logs to a storage account or an event hub instead."
---

Azure Virtual Desktop Insights shows how users connect, how session hosts perform and how the connection quality looks, in one dashboard. Each tab answers a separate admin question, and each metric has a definition on Learn that explains what it does and does not measure.

Setup is covered in a separate article, "Setting up AVD Insights with Azure Monitor and Log Analytics". Query examples are in "Useful KQL queries for Azure Virtual Desktop diagnostics", and alert rules in "Key metrics and alerts for Azure Virtual Desktop". This article is about reading the dashboard.

## What Insights is and where its data comes from

Learn describes [Azure Virtual Desktop Insights](/entity/avd-insights/) as a dashboard built on [Azure Monitor Workbooks](/entity/azure-monitor-workbooks/) that helps IT professionals understand their Azure Virtual Desktop environments. You open it at `aka.ms/avdi`, or per host pool through **Host pools**, then **Insights**. It draws on three kinds of data in a [Log Analytics](/entity/log-analytics/) workspace:

- **Service diagnostics** from the host pool and workspace diagnostic settings (the tables for connections, errors, checkpoints, feeds, management activities, host registration and agent health).
- **Performance counters** from the session hosts, such as processor time, memory, disk queue length, active sessions and user input delay.
- **Windows event logs** from the session hosts, including FSLogix and Remote Desktop Services logs.

The session host data is collected by the [Azure Monitor Agent](/entity/azure-monitor-agent/). Learn's release notes show that Azure Monitor Agent based Insights became generally available in version 3.0.0 (18 September 2023), with an "Insights (Legacy)" view for the Log Analytics agent, which version 4.0.5 (7 October 2024) marks as deprecated.

Viewers need the Desktop Virtualization Reader role on the resource group or subscription that holds the host pools, workspaces and session hosts, and the Log Analytics Reader role on the workspace. 

## Which tab answers which question

The table maps each to the question it helps with.

| Tab | Question it answers | Notes from Learn |
|---|---|---|
| Overview | Is the environment healthy at a glance? | Shows active Azure Monitor alerts of severity 0 and, since version 4.1.0, highlights unhealthy hosts. Version 4.2.0 added a switch between pooled and personal host pool views. |
| Connection Performance | Is the network path to the gateway slow? | Round-trip time per gateway region, median and 95th percentile |
| Connection Reliability | Where do sessions disconnect, and what do they have in common? | Top 20 disconnection events and pivots such as host pool, transport, client version and gateway region |
| Host Performance | Are session hosts the reason for slow input? | Input delay by host, CPU, memory and disk metrics |
| Host Diagnostics | Which host crossed a threshold? | Performance counters flagged for available memory, page faults, CPU, disk space and input delay per session |
| Utilization | Are hosts running idle, and when is demand? | Session history and session host count over time |
| Clients | Who runs outdated clients? | Newest client version per client type, with affected users |
| Autoscale | What did autoscale do? | Pooled host pools only |

## Reading users: activity, connection health and time to connect

The glossary defines the user-facing numbers:

- **Daily active users** counts users who started a session in the last 24 hours. **Monthly active users** counts users who started a session in the last 28 days. If you store data for 30 days or less, you can see lower-than-expected MAU and connection values while fewer than 28 days of data exist.
- **Connection success** means the connection reached the host, as confirmed by the stack on that virtual machine. A failed connection did not reach the host.
- **Potential connectivity issues** lists hosts, users, published resources and clients with a high connection failure rate. Learn's rule: an issue spanning several hosts, users, resources or clients likely affects the whole system; otherwise it is smaller.
- **Errors** are classified by kind: "service" (`ServiceError = TRUE`) occurred in the Azure Virtual Desktop service, "deployment" (`ServiceError = FALSE`) outside it.
- The **User report** shows one user's connection history and errors, filterable by connection ID or time period.

**Time to connect** is the time between a user opening a resource and the desktop being loaded and ready. It starts at a `started` connection state and ends at the `ShellReady` checkpoint for desktops, or `RdpShellAppExecuted` for the first RemoteApp launch. Learn splits it into user route, stack connected, logon (profile load, Group Policy, shell start, FSLogix) and shell start to shell ready.

The glossary says the time to provide credentials is subtracted, while the troubleshooting page says time to connect includes the time users take to enter credentials and can show false peaks in some cases. Treat a single spike as a reason to look at the trend, not as proof of a problem. Learn also warns that a connection's completion event can go missing, which affects some visuals.

## Reading hosts: input delay and resource counters

On the Host Performance tab, the central metric is **input delay**, based on the user input delay per process performance counter. Learn says a report goes to the service every 30 seconds; each 30-second interval is a "sample", and the view uses the worst case in that window. The **median** and **p95** values are taken across all samples. Learn's categories:

| Category | Input delay |
|---|---|
| Good | below 150 ms |
| Acceptable | 150 to 500 ms |
| Poor | 500 to 2,000 ms |
| Bad | 2,000 ms and above |

The use cases page adds that ideally the input delay for each host is below 100 ms, and lower is better.

The workflow in the use cases page is: select the host pool, set the time range, open **Host Performance**, and compare the **Input delay by host** table and the **Median input delay over time** graph with the **Host CPU and memory metrics**, **Host disk timing metrics** and **Host disk queue length** graphs. Learn's example shows higher disk read times correlating with higher input delay.

The **Host Diagnostics** tab flags devices that cross thresholds for available memory, page faults per second, CPU utilization, disk space and input delay per session. Learn's example shows a host above 60% CPU for 1 minute; that is an illustration, not a published threshold. For extended high utilization Learn suggests considering a larger Azure VM size for the [session host](/entity/avd-session-host/).

## Reading connection quality: round-trip time and reliability

**Round-trip time** is, in the glossary's words, an estimate of the connection's round-trip time between the end user's location and the session host's Azure region. On the **Connection Performance** tab, the **RTT by gateway region** table and the **RTT median and 95th percentile for all regions** graph show it. Learn says that keeping interaction times ideal requires latency generally below 100 ms, and that a session broadly becomes low quality above 200 ms.

Compare the median with the 95th percentile. Learn notes that p95 is often substantially higher than the median, which means some users have periods of higher latency. Selecting a gateway region shows its graph and the top 20 users by RTT median. Learn names a poor Wi-Fi connection and internet service provider problems as possible causes.

On the source of RTT: the glossary lists the `RemoteFX Network(*)\Current TCP RTT` counter, while the release notes for version 4.0.3 (22 August 2024) say RTT queries still using that counter were switched to Azure Virtual Desktop network logs. If RTT charts stay empty, check your diagnostic settings against both pages.

**Connection Reliability** charts disconnections against concurrent connections and lists the top 20 disconnection events. Select a row to highlight its time segment, then apply a **pivot** to look for commonalities. The pivots are subscription, resource group, host pool, transport, session host, session host IP/16, client type, client version, client IP/16 and gateway region. The transport pivot distinguishes UDP types (`Multipath`, `Relay`, `ShortpathPublic`, `ShortpathPrivate`) from TCP (`NotUsed`). The release notes list connection reliability as preview in April 2024 and generally available in version 3.5.0 on 1 July 2024; Multipath as a UDP type was added in 4.3.1.

## Using Insights for capacity and cost

The **Utilization** tab holds the session history chart (active and idle, meaning disconnected, sessions over time) and the session host count chart. Learn says a regular, repeated pattern, such as peaks around midday on weekdays and little activity at weekends, usually indicates an opportunity for a [scaling plan](/entity/avd-scaling-plan/). Another signal is long periods where idle session hosts stay powered on. Scope the view to one host pool before deciding.

The **Autoscale** tab shows scaling operations, including a graph of the power state change of the hosts over time. Learn says this works for pooled host pools only, with an assigned scaling plan. The host pool diagnostic setting needs the category "Autoscale logs for pooled host pools" in addition to the categories for checkpoints, errors, management, connections, host registration and agent health. The release notes list autoscale reporting as preview in version 3.3.1 (April 2024) with no later status change, while the Learn autoscale page carries no preview label. The tab reads the `WVDAutoscaleEvaluationPooled` table, whose `ScalingReasonMessage` column holds what autoscale decided to do and why.

The **Clients** tab lists, per client type, the highest version as **Newest** and the number of users on older versions, with days behind and an export button. Some clients, such as Windows App on iOS, iPadOS and Android, appear with a build number instead of a version number.

Insights also costs money through the workspace. Learn's estimate for a sample workload, with light and power usage VMs, is 90 to 130 MB per VM per day for performance counters, 2 to 15 MB for events and under 1 MB for diagnostics. That gives 92 to 145 MB per VM per day, or roughly 3 to 5 GB per VM every 31 days. Learn calls all sizes examples and says performance counters should make up 80 to 99% of ingestion. Its cost levers are a designated workspace, shorter retention, a fixed pricing tier, an ingestion cap and fewer or less frequent counters; removing data points removes the matching visuals.

## Limits to keep in mind

- **Latency**: Azure Monitor has a 15-minute latency for populating log data. Learn says to wait 15 minutes and refresh if recent activity is missing.
- **Missing data**: if counters or events are missing, the data tied to them does not appear. Permissions and blocked outgoing ports can cause the same symptom.
- **Total sessions**: the total session performance counter can overcount by a small number, so totals may appear to exceed your maximum session limit.
- **Available sessions**: the glossary defines it as VMs times maximum sessions per VM minus total sessions, and Learn says the count does not reflect scaling policies on the host pool. Version 4.2.0 removed the column from the personal host pool view.
- **Custom workbooks**: custom templates do not automatically adopt updates from the product group.
- **Scale**: the configuration workbook's automated agent deployment is limited to 1,000 session hosts or fewer; larger pools should install the Azure Monitor Agent through an ARM template at creation.
- **Page dates**: the main Insights pages show a last-updated date of 20 June 2025, and the release notes list version 4.3.1 (29 January 2025) as the latest.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [Microsoft Learn: Use cases for Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-use-cases)
- [Microsoft Learn: What's new in Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-insights)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights monitoring costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Microsoft Learn: Monitor Autoscale operations with Insights in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-insights)
