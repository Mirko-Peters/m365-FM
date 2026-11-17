---
title: "Setting up AVD Insights with Azure Monitor and Log Analytics"
summary: "Azure Virtual Desktop Insights needs three data feeds before it shows anything: diagnostic settings on host pools and workspaces, the Azure Monitor Agent with a data collection rule on the session hosts, and the recommended performance counters and event logs. This article walks through the setup order, the configuration workbook steps and the checks that tell you it worked."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-insights, azure-virtual-desktop]
keypoints:
  - "Setup has two halves: resource diagnostic settings on the host pool and the Azure Virtual Desktop workspace, and session host data through the Azure Monitor Agent and a data collection rule. The configuration workbook can deploy both."
  - "Learn lists seven diagnostic tables for the host pool (Management Activities, Feed, Connections, Errors, Checkpoints, HostRegistration, AgentHealthStatus) and four for the workspace (Management Activities, Feed, Errors, Checkpoints)."
  - "Insights asks for a designated Log Analytics workspace for the session hosts. The session host workspace does not have to be the one that receives the diagnostics."
  - "The workbook's automated agent deployment supports 1,000 session hosts or fewer. For larger pools, or if deployment fails, Learn says to install the Azure Monitor Agent when you create the hosts, using an ARM template."
  - "After setup, allow time: Learn says Azure Monitor has a 15-minute latency for log data, and the diagnostics page says data can take a few hours after first set-up."
faq:
  - q: "Do I need to create the data collection rule by hand?"
    a: "No. In the Open Configuration Workbook, the Session host data settings tab has a Create data collection rule button that appears once you pick a workspace destination and a DCR resource group. Learn also describes manual options through its troubleshooting page if the workbook does not work."
  - q: "Which roles do I need to set Insights up and to view it?"
    a: "For viewing, Learn lists Desktop Virtualization Reader on the resource group or subscription and Log Analytics Reader on the workspace. For configuring diagnostic settings, the autoscale monitoring page lists Desktop Virtualization Contributor. Learn's Insights page does not list roles for deploying the agent or the data collection rule."
  - q: "Why is my dashboard empty right after setup?"
    a: "Learn gives two timing notes. Azure Monitor has a 15-minute latency for populating log data, and diagnostics can take a few hours after first set-up. If the data is still missing after that, the troubleshooting page says to re-check the configuration workbook, then permissions and outgoing ports."
---

To set up Azure Virtual Desktop Insights, create a Log Analytics workspace, send host pool and workspace diagnostics to it, install the Azure Monitor Agent on the session hosts with a data collection rule for performance counters and event logs, and then confirm in the configuration workbook that nothing is missing. This article follows that order and covers setup only. Reading the dashboard is the subject of "Azure Virtual Desktop Insights: monitoring users, hosts and connection quality", queries of "Useful KQL queries for Azure Virtual Desktop diagnostics" and alert rules of "Key metrics and alerts for Azure Virtual Desktop".

## What you are setting up

[Azure Virtual Desktop Insights](/entity/avd-insights/) is a dashboard built on [Azure Monitor Workbooks](/entity/azure-monitor-workbooks/). Learn's prerequisites list three things to enable: diagnostics from your Azure Virtual Desktop environment, the recommended performance counters from the session hosts and the recommended Windows event logs from the session hosts.

The data lands in [Log Analytics](/entity/log-analytics/) workspaces. Learn recommends a designated workspace for your session hosts so that performance counters and events are collected only from your Azure Virtual Desktop deployment, and says you can disable other items that send data to the workspace to save costs. The workspace that receives the session host data does not have to be the one that receives the diagnostics.

The session host data comes from the [Azure Monitor Agent](/entity/azure-monitor-agent/) (AMA). The older Log Analytics agent is out of scope here: the Insights version history says version 4.0.5 (7 October 2024) changed the banner to say the Log Analytics Agent has been deprecated, and Learn's troubleshooting page says to migrate to the Azure Monitor Agent. Insights based on the AMA became generally available in version 3.0.0 (18 September 2023).

## Before you start: roles and cost

Learn names these minimum roles for viewing Insights: **Desktop Virtualization Reader** on the resource group or subscription that contains the host pools, workspaces and session hosts, and **Log Analytics Reader** on any workspace used with Insights. Read access only lets an admin view data. The autoscale monitoring page adds **Desktop Virtualization Contributor** on the same scopes for configuring diagnostic settings. The Insights page does not list the roles needed to deploy the agent or the data collection rule. Our reading: whoever runs the workbook needs enough rights to change the host pool, the session hosts and the rule's resource group, so check this before the change window.

Standard Log Analytics data storage charges apply. Learn suggests starting with the pay-as-you-go model and adjusting as you scale. In its example for healthy VMs, the total is 92 to 145 MB per VM per day, about 3 to 5 GB per VM every 31 days, and performance counters are typically 80 to 99% of ingestion.

## Step 1: create or choose the Log Analytics workspace

Create a workspace in the Azure portal if you do not already have a designated one; Learn links the quick-create article. Decide retention and any daily cap now: the cost page lists shorter retention, a fixed-storage pricing tier and daily ingestion caps as ways to limit the impact of an unhealthy deployment.

## Step 2: open the configuration workbook

Open Insights at `aka.ms/avdi`, select **Workbooks**, then **Check Configuration**, and choose the **Subscription**, **Resource Group** and **Host Pool** from the drop-down lists. Alternatively, go to **Host pools** in Azure Virtual Desktop, select the host pool, select **Insights**, then **Open Configuration Workbook**. Learn says to check the configuration again whenever dashboard items do not display correctly, or when the product group publishes updates that need new settings.

The version history says the legacy configuration workbook was deleted in version 4.0.0, so follow the current Learn page if older instructions mention a different workbook.

## Step 3: enable resource diagnostic settings

Open the **Resource diagnostic settings** tab and select **Log Analytics workspace** as the destination. Learn lists these tables:

| Object | Tables to enable |
|---|---|
| Host pool | Management Activities, Feed, Connections, Errors, Checkpoints, HostRegistration, AgentHealthStatus |
| Azure Virtual Desktop workspace | Management Activities, Feed, Errors, Checkpoints |

For the host pool, if you see "No existing diagnostic configuration was found for the selected host pool", select **Configure host pool**, then **Deploy**, then refresh the workbook. The workspace works the same way with **Configure workspace**. Learn means the Azure Virtual Desktop workspace here, not the Log Analytics workspace. If the message does not appear, skip the step.

You can also set this up without the workbook. On the diagnostics page, the steps are: in the Azure portal go to **Azure Virtual Desktop**, open the object, select **Diagnostic settings**, then **Add diagnostic setting**, enter a name without spaces and select **Send to Log Analytics**. Pick the categories and select **Save**. Learn stresses that diagnostics must be enabled for each Azure Resource Manager object you want to monitor, and that data is available for activities only after enabling.

The diagnostics page lists further categories beyond the seven used above: Network, Connection Graphics, Session Host Management Activity and Autoscale. The Insights setup page does not name them. The exception is the autoscale tab: the autoscale monitoring page asks for the host pool category **Autoscale logs for pooled host pools** on top of its minimum categories, and says that Insights monitors autoscale for pooled host pools only. Add those categories only if you need the matching views, and do not select a category twice: Learn says selecting a category that already exists in another diagnostic setting for the same host pool causes an error when you save.

## Step 4: configure session host data

On the **Session host data settings** tab, Learn describes what must be in place: a data collection rule (DCR) that collects performance data and Windows event logs, session hosts associated with that rule, the AMA installed on all session hosts in the monitored host pools, and hosts that send data to a Log Analytics workspace.

To create the rule:

1. Under **Workspace destination**, select the Log Analytics workspace.
2. Under **DCR resource group**, select the resource group for the rule.
3. Select **Create data collection rule**. Learn says this button appears only after you have selected both the workspace destination and the resource group.

If the workbook then shows "Some hosts in the host pool are not sending data to the selected Log Analytics workspace":

1. Select the DCR you are using.
2. Select **Deploy association**.
3. Select **Add extension** to deploy the agent to all session hosts.
4. Select **Add system managed identity**.
5. After the agent installs and the identity is added, refresh the workbook.

Learn limits the automated deployment to 1,000 session hosts or fewer. For larger pools, or if the deployment fails, it says to install the agent when you create the session hosts, using an ARM template.

## Step 5: apply the recommended counters and events

Two further sections of the workbook compare what is configured with what Insights expects.

**Performance counters.** Under **Workspace performance counters**, check **Configured counters** and **Missing counters**. If counters are missing, select **Configure performance counters**, then **Apply Config**, refresh the workbook and confirm that the **Missing counters** list is empty.

**Windows event logs.** Under **Windows Event Logs configuration**, check **Configured Event Logs** and **Missing Event Logs**. If events are missing, select **Configure Events**, then **Deploy**, refresh and confirm that **Missing Event Logs** is empty. If the automatic deployment fails, select **Open agent configuration** to add the missing logs by hand.

The Insights page does not list the counters or events. The cost page does list defaults. Its event sources are the Application and System logs, Microsoft-Windows-TerminalServices-RemoteConnectionManager/Admin, Microsoft-Windows-TerminalServices-LocalSessionManager/Operational, Microsoft-FSLogix-Apps/Operational and Microsoft-FSLogix-Apps/Admin. Its counter table, which it says holds 20 default counters, includes examples such as `Memory(*)\Available Mbytes` (30-second sample rate) and `User Input Delay per Session(*)\Max Input Delay` (30 seconds). Rely on the workbook's missing-counter check rather than an older list.

## Step 6: check the network path

Learn's troubleshooting page says you might need to open outgoing ports in the firewall so Azure Monitor can send data, without naming ports. Two other pages carry details. The Azure Virtual Desktop required URLs page lists `*.prod.warm.ingest.monitor.core.windows.net` and `gcs.prod.monitoring.core.windows.net` (TCP 443, service tag `AzureMonitor`) as agent traffic for session hosts. The Azure Monitor Agent page says both the `AzureMonitor` and `AzureResourceManager` service tags are required, lists outbound port 443 endpoints such as `<virtual-machine-region-name>.handler.control.monitor.azure.com` and `<log-analytics-workspace-id>.ods.opinsights.azure.com`, and says to disable HTTPS inspection for all endpoints. Our reading: behind a restrictive firewall or proxy, check both lists, and test on one host before rolling out to the whole pool.

## Step 7: verify and wait

1. Wait. Learn says Azure Monitor has a 15-minute latency for populating log data, and the diagnostics page says data can take a few hours after first set-up.
2. Refresh the configuration workbook and confirm that no "No existing diagnostic configuration" or "not sending data" messages remain and that both missing lists are empty.
3. Run a query in the workspace. All diagnostics tables have a `WVD` prefix, and the diagnostics page gives this example:

```kusto
WVDConnections
|where UserName == "userupn"
|take 100
|sort by TimeGenerated asc, CorrelationId
```

4. To check that the session hosts send counters, the cost page gives a query over the `Perf` table that groups records by counter (`Perf | where TimeGenerated > ago(1d) | where Computer in (WVDHosts) | summarize ... by PerfCounter`, with your own host names in the `WVDHosts` list). It also shows which counters ingest the most data, which is where Learn suggests reducing a counter's frequency or removing it. Removing data points also affects the matching Insights visuals.

## If it does not work

Learn's troubleshooting page gives this order:

1. Re-check the setup in the configuration workbook. If counters or events are missing, the data associated with them does not appear in the portal.
2. Check permissions. Anyone monitoring needs read access to the resource groups with the Azure Virtual Desktop resources, to the resource groups with the session hosts and to the Log Analytics workspaces in use.
3. Check outgoing ports in the firewall, and wait 15 minutes and refresh if recent activity is missing.
4. If nothing is missing but the data still looks wrong, the cause may be a query or data source issue. The page lists known limitations, for example "Query failed" errors in the configuration workbook (refresh and re-enter your selection) and that the total session counter can overcount sessions by a small number.

If the configuration workbook itself does not work, the same page links manual alternatives, including installing the Azure Monitor Agent extension on a session host and viewing data collection rules. Custom workbook templates do not automatically adopt product group updates, so save a copy only when you need a customization.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Send Azure Virtual Desktop diagnostics to Log Analytics](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-insights)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights monitoring costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Microsoft Learn: What's new in Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-insights)
- [Microsoft Learn: Monitor Autoscale operations with Insights in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Required URLs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/safe-url-list)
- [Microsoft Learn: Azure Monitor Agent network configuration](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-data-collection-endpoint)
