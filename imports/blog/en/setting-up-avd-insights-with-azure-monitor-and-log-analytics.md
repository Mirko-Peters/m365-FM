---
title: "Setting up AVD Insights with Azure Monitor and Log Analytics"
summary: "Azure Virtual Desktop Insights needs three kinds of data collection: diagnostics from the environment, the recommended performance counters and the recommended Windows event logs from the session hosts. The Azure Monitor Agent with a data collection rule carries the last two. This article walks through the setup order, the configuration workbook steps and the checks that tell you it worked."
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
    a: "For viewing, Learn lists Desktop Virtualization Reader on the resource group or subscription and Log Analytics Reader on the workspace. For configuring diagnostic settings, the autoscale monitoring page lists Desktop Virtualization Contributor. For the data collection rule, Learn's DCR page lists Monitoring Contributor on the subscription, resource group and/or an existing DCR. Learn's Insights page does not list a role for installing the agent extension; the Azure Monitor Agent requirements page lists Virtual Machine Contributor for installation methods other than the Azure portal."
  - q: "Why is my dashboard empty right after setup?"
    a: "Learn gives two timing notes. Azure Monitor has a 15-minute latency for populating log data, and diagnostics can take a few hours after first set-up. If the data is still missing after that, the troubleshooting page says to re-check the configuration workbook first, and also to check permissions and outgoing ports."
---

To set up Azure Virtual Desktop Insights, create a Log Analytics workspace, send host pool and workspace diagnostics to it, install the Azure Monitor Agent on the session hosts with a data collection rule for performance counters and event logs, and then confirm in the configuration workbook that nothing is missing. This article follows that order and covers setup only; the dashboard, queries and alert rules have their own articles.

## What you are setting up

[Azure Virtual Desktop Insights](/entity/avd-insights/) is a dashboard built on [Azure Monitor Workbooks](/entity/azure-monitor-workbooks/). Learn's prerequisites say monitored environments must be based on the latest Azure Virtual Desktop release that is compatible with Azure Resource Manager, and list three things to enable: diagnostics from your Azure Virtual Desktop environment, the recommended performance counters from the session hosts and the recommended Windows event logs from the session hosts.

The data lands in [Log Analytics](/entity/log-analytics/) workspaces. Learn recommends a designated workspace for your session hosts so that counters and events come only from your Azure Virtual Desktop deployment, and says you can disable other items that send data to it to save costs. The workspace for session host data does not have to be the one that receives the diagnostics.

The session host data comes from the [Azure Monitor Agent](/entity/azure-monitor-agent/) (AMA). The older Log Analytics agent is out of scope: the Insights version history says version 4.0.5 (7 October 2024) changed the wording to say it is deprecated.

## Before you start: roles and cost

Learn names these minimum roles for viewing Insights: **Desktop Virtualization Reader** on the resource group or subscription with the host pools, workspaces and session hosts, and **Log Analytics Reader** on any workspace used with Insights. Read access only lets an admin view data. The autoscale monitoring page adds **Desktop Virtualization Contributor** for configuring diagnostic settings. The DCR page lists **Monitoring Contributor** on the subscription, the resource group and/or an existing DCR to create or edit DCRs and deploy associations, and for ARM template deployments any role that includes the action `Microsoft.Resources/deployments/*`. The Insights page names no role for adding the agent extension or the system managed identity. The Azure Monitor Agent requirements page says that, for methods other than the Azure portal, installing the agent needs Virtual Machine Contributor (Azure Connected Machine Resource Administrator for Azure Arc-enabled servers). It calls a system-assigned managed identity suited for initial testing and small deployments and recommends user-assigned identities for large-scale deployments. Our reading: the workbook's **Add system managed identity** button adds the system-assigned type, so check that this suits a large pool, and confirm these rights before the change window.

Standard Log Analytics data storage charges apply, and Learn suggests starting with pay-as-you-go. In the cost page's example for healthy VMs, the total is 92 to 145 MB per VM per day, about 3 to 5 GB per VM every 31 days, with performance counters typically 80 to 99% of ingestion.

## Step 1: create or choose the Log Analytics workspace

Create a workspace in the Azure portal if you do not have a designated one; Learn links the quick-create article. The cost page lists reducing the retention period, evaluating a fixed storage pricing tier and setting ingestion boundaries as ways to limit the impact of an unhealthy deployment.

## Step 2: open the configuration workbook

Open Insights at `aka.ms/avdi`, select **Workbooks**, then **Check Configuration**, and choose the **Subscription**, **Resource Group** and **Host Pool** from the drop-down lists. Alternatively, go to **Host pools** in Azure Virtual Desktop, select the pooled host pool you want to monitor, select **Insights**, then **Open Configuration Workbook**. Check the configuration again when dashboard items display incorrectly or after product updates that need new settings.

## Step 3: enable resource diagnostic settings

Open the **Resource diagnostic settings** tab and select **Log Analytics workspace** as the destination. Learn lists these tables:

| Object | Tables to enable |
|---|---|
| Host pool | Management Activities, Feed, Connections, Errors, Checkpoints, HostRegistration, AgentHealthStatus |
| Azure Virtual Desktop workspace | Management Activities, Feed, Errors, Checkpoints |

For the host pool, if you see "No existing diagnostic configuration was found for the selected host pool", select **Configure host pool**, then **Deploy**, then refresh the workbook. The workspace works the same way with **Configure workspace**. Here Learn means the Azure Virtual Desktop workspace, not the Log Analytics workspace.

Without the workbook, the diagnostics page has you open the object under **Azure Virtual Desktop**, select **Diagnostic settings**, then **Add diagnostic setting**, enter a name without spaces, select **Send to Log Analytics**, pick the categories and select **Save**. Diagnostics must be enabled for each Azure Resource Manager object you want to monitor.

The diagnostics page lists further categories: Network, Connection Graphics, Session Host Management Activity and Autoscale. The Insights setup page does not name them. The autoscale monitoring page asks for **Autoscale logs for pooled host pools** and says Insights monitors autoscale for pooled host pools only. Do not select a category twice: Learn says a category already present in another diagnostic setting for the same host pool causes an error on save.

## Step 4: configure session host data

On the **Session host data settings** tab, Learn lists what must be in place: a data collection rule (DCR) for performance data and Windows event logs, session hosts associated with it, the AMA on all session hosts in the monitored pools, and hosts that send data to a Log Analytics workspace.

To create the rule:

1. Under **Workspace destination**, select the Log Analytics workspace.
2. Under **DCR resource group**, select the resource group for the rule.
3. Select **Create data collection rule**. Learn says this button appears only after you select both.

If the workbook then shows "Some hosts in the host pool are not sending data to the selected Log Analytics workspace":

1. Select the DCR you are using.
2. Select **Deploy association**.
3. Select **Add extension** to deploy the agent to all session hosts.
4. Select **Add system managed identity**.
5. After the agent installs and the identity is added, refresh the workbook.

Learn limits the automated deployment to 1,000 session hosts or fewer. For larger pools, or if it fails, it says to install the agent when you create the session hosts, using an ARM template.

Replaced hosts need attention too. Learn's session host update page says that with Insights the Azure Monitor Agent is not installed automatically on updated session hosts. Its options: use Azure Policy to install the agent, or manually add the new hosts from within Insights.

## Step 5: apply the recommended counters and events

**Performance counters.** Under **Workspace performance counters**, check **Configured counters** and **Missing counters**. If counters are missing, select **Configure performance counters**, then **Apply Config**, refresh the workbook and confirm that the **Missing counters** list is empty.

**Windows event logs.** Under **Windows Event Logs configuration**, check **Configured Event Logs** and **Missing Event Logs**. If events are missing, select **Configure Events**, then **Deploy**, refresh and confirm that **Missing Event Logs** is empty. If the automatic deployment fails, select **Open agent configuration** to add the missing logs by hand.

The Insights setup page does not list the counters or events; the Insights glossary does. It lists 19 "recommended" performance counters (30- or 60-second intervals) and these "required" Windows Event Logs: Application and System (Error and Warning), plus two TerminalServices logs and two FSLogix logs (Error, Warning, and Information). The cost page lists 20 default counters, the same set plus `Logical Disk(C:)\% free space` at 60 seconds, and the same six event sources. Our reading: rely on the workbook's missing-counter check rather than either list.

## Step 6: check the network path

Learn's troubleshooting page says you might need to open outgoing ports in the firewall, without naming ports. Two other pages carry details. The Required FQDNs and endpoints page lists `*.prod.warm.ingest.monitor.core.windows.net` and `gcs.prod.monitoring.core.windows.net` (TCP 443, service tag `AzureMonitor`) as agent traffic for session hosts in the Azure cloud. A tip there says to use a wildcard for service traffic FQDNs. For agent traffic without a wildcard, open Event viewer on a registered session host, go to **Windows logs** > **Application** > **WVD-Agent**, look for event ID 3701 and unblock the FQDNs found; they are region-specific. The Azure Monitor Agent network configuration page says both the `AzureMonitor` and `AzureResourceManager` service tags are required, lists outbound port 443 endpoints such as `<virtual-machine-region-name>.handler.control.monitor.azure.com` and `<log-analytics-workspace-id>.ods.opinsights.azure.com`, and says to disable HTTPS inspection for all endpoints. Our reading: behind a restrictive firewall or proxy, check both lists and test on one host first.

## Step 7: verify and wait

1. Wait. Learn says Azure Monitor has a 15-minute latency for log data, and the diagnostics page says data can take a few hours after first set-up.
2. Refresh the configuration workbook and confirm that no "No existing diagnostic configuration" or "not sending data" messages remain and both missing lists are empty.
3. Run a query in the workspace. All diagnostics tables have a `WVD` prefix, and the diagnostics page gives this example:

```kusto
WVDConnections
|where UserName == "userupn"
|take 100
|sort by TimeGenerated asc, CorrelationId
```

4. To check that the agent is running, the agent management page gives a heartbeat query: `Heartbeat | where Category == "Azure Monitor Agent" | where TimeGenerated > ago(5m)`. It also says to confirm under **Extensions + applications** on the VM that the agent extension shows **Provisioning succeeded**.
5. To check that the session hosts send counters, the cost page gives a query over the `Perf` table that groups records by counter (put your own host names in its `WVDHosts` list). It returns records and billed megabytes per counter, which helps you target cost reductions. Removing data points also affects the matching Insights visuals.

## If it does not work

Learn's troubleshooting page lists these checks, with the configuration workbook first:

1. Re-check the setup in the configuration workbook. If counters or events are missing, the data associated with them does not appear in the portal.
2. Check permissions. Anyone monitoring needs read access to the resource groups with the Azure Virtual Desktop resources, to the resource groups with the session hosts and to the Log Analytics workspaces in use.
3. Check outgoing ports in the firewall.
4. If recent activity is missing, wait 15 minutes and refresh the feed.

If nothing is missing but the data still looks wrong, the cause may be a query or data source issue. The page lists known limitations, for example "Query failed" errors in the configuration workbook (refresh and re-enter your selection) and that the total session counter can overcount sessions by a small number. If the workbook itself does not work, the page links manual alternatives, such as installing the agent extension on a session host. Custom workbook templates do not adopt product group updates automatically.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Send Azure Virtual Desktop diagnostics to Log Analytics](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-insights)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights monitoring costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Microsoft Learn: What's new in Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-insights)
- [Microsoft Learn: Monitor Autoscale operations with Insights in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Azure Monitor Agent Network Configuration](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-network-configuration)
- [Microsoft Learn: Create data collection rules (DCRs) using JSON](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-create-edit)
- [Microsoft Learn: Install and Manage the Azure Monitor Agent](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-manage)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Azure Monitor Agent requirements](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-requirements)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
