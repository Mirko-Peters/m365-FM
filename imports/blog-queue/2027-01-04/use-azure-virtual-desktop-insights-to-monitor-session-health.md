---
title: "How to Use Azure Virtual Desktop Insights to Monitor Sessions and Connection Health"
summary: "Set up Azure Virtual Desktop Insights: prerequisites, RBAC roles, the configuration workbook, diagnostic settings, Azure Monitor Agent and data collection rule, performance counters, event logs, costs and gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [azure-virtual-desktop, azure-monitor]
keypoints:
  - "Open Insights at aka.ms/avdi, select Workbooks, then Check Configuration, and pick the subscription, resource group and host pool."
  - "Minimum roles are Desktop Virtualization Reader on the resource group or subscription and Log Analytics Reader on the workspace."
  - "Enable diagnostics, recommended performance counters and recommended Windows Event Logs. Learn advises a designated Log Analytics workspace for session hosts."
  - "Session host data uses the Azure Monitor Agent and a data collection rule. Automated deployment is limited to 1,000 session hosts or fewer."
  - "The page read names only two configuration tabs and does not describe the monitoring tabs, so this guide covers setup, not interpretation."
faq:
  - q: "What do I need before I use Insights?"
    a: "Learn requires environments based on the latest Azure Resource Manager compatible release of Azure Virtual Desktop, and data collection for diagnostics, recommended performance counters and recommended Windows Event Logs. A designated Log Analytics workspace for session hosts is recommended."
  - q: "Which roles do I need to view Insights?"
    a: "Desktop Virtualization Reader on the resource group or subscription that holds the host pools, workspaces and session hosts, and Log Analytics Reader on any workspace used with Insights. Read access only lets you view data."
  - q: "How do session hosts send data?"
    a: "Through the Azure Monitor Agent and a data collection rule. In the configuration workbook you set the workspace destination and DCR resource group, create the rule, deploy the association, add the extension and add the system managed identity."
  - q: "Are there size limits for automated deployment?"
    a: "Learn says automated deployment is limited to 1,000 session hosts or fewer. For larger pools or deployment problems, install the agent when you create the session hosts with an ARM template."
  - q: "Does Insights cost anything?"
    a: "Standard Log Analytics data storage charges apply. Learn recommends starting with pay-as-you-go pricing and adjusting as you scale, and says you can disable other items sending data to the workspace to save costs."
---

To use Azure Virtual Desktop Insights, you first turn on data collection. Open the configuration workbook at aka.ms/avdi, point host pool and workspace diagnostics at a Log Analytics workspace, and connect session hosts with the Azure Monitor Agent and a data collection rule. This guide follows the Microsoft Learn article on Insights. It covers setup. The page read does not describe the individual monitoring tabs.

## Prerequisites

- Monitored environments must be based on the latest release of Azure Virtual Desktop that is compatible with Azure Resource Manager.
- Use a **designated Log Analytics workspace** for your session hosts, so that counters and events come only from your Azure Virtual Desktop deployment.
- Enable data collection for diagnostics from the environment, recommended performance counters from session hosts, and recommended Windows Event Logs from session hosts.

**Minimum RBAC roles for anyone monitoring Insights**

| Role | Scope |
| --- | --- |
| Desktop Virtualization Reader | Resource group or subscription with the host pools, workspaces and session hosts |
| Log Analytics Reader | Any Log Analytics workspace used with Insights |

Read access lets admins view data only. Managing Azure Virtual Desktop resources needs different permissions.

## Open Insights and the configuration workbook

1. Open Insights in the Azure portal at `aka.ms/avdi`.
2. Select **Workbooks**, then **Check Configuration**.
3. Choose an environment from the **Subscription**, **Resource Group** and **Host Pool** lists.

Create a Log Analytics workspace first if you do not have one.

## Resource diagnostic settings

Open the **Resource diagnostic settings** tab and select **Log Analytics workspace** as the destination.

- **Host pool.** If you see the message that no existing diagnostic configuration was found, enable these tables: Management Activities, Feed, Connections, Errors, Checkpoints, HostRegistration and AgentHealthStatus. Select **Configure host pool**, then **Deploy**, and refresh the workbook.
- **Workspace.** For the same message, enable Management Activities, Feed, Errors and Checkpoints. Select **Configure workspace**, then **Deploy**, and refresh.

## Session host data settings

Session hosts use the **Azure Monitor Agent** and a **data collection rule (DCR)**.

1. From the host pool overview, select **Insights**, then **Open Configuration Workbook**.
2. Open the **Session host data settings** tab.
3. Set **Workspace destination** to your Log Analytics workspace.
4. Set the **DCR resource group**.
5. Select **Create data collection rule**. It appears only after both fields are set.

If hosts are not sending data, the **Session hosts** section appears:

1. Select the DCR.
2. Select **Deploy association**.
3. Select **Add extension** to deploy the Azure Monitor Agent.
4. Select **Add system managed identity**.
5. After the agent installs and the identity is added, refresh the workbook.

Automated deployment is limited to 1,000 session hosts or fewer. For larger pools or deployment problems, install the agent when you create session hosts with an ARM template.

## Performance counters and event logs

- **Performance counters.** Check **Configured counters** and **Missing counters**. If counters are missing, select **Configure performance counters**, then **Apply Config**, refresh, and confirm that the Missing counters list is empty.
- **Windows Event Logs.** Check **Configured Event Logs** and **Missing Event Logs**. If logs are missing, select **Configure Events**, then **Deploy**, refresh and confirm. If automatic deployment fails, select **Open agent configuration** and add them manually.

## Alerts, costs and retention

- Azure Monitor log alerts are set up separately from Insights.
- Standard Log Analytics data storage charges apply. Start with pay-as-you-go and adjust as you scale. You can turn off other items that send data to the workspace to save cost.
- The page gives no retention periods.

## What the page does not cover

The page names only two configuration workbook tabs, Resource diagnostic settings and Session host data settings. It does not describe monitoring tabs such as connection diagnostics, connection performance, host diagnostics, utilization or client versions, so this guide does not explain how to read them. It also lists no known issues and points to a separate troubleshooting guide for Insights.

## A setup checklist

The checklist applies the steps above. The order is practical advice.

1. Create a dedicated Log Analytics workspace for session hosts.
2. Assign Desktop Virtualization Reader and Log Analytics Reader to the people who monitor.
3. Open the configuration workbook and select the host pool.
4. Enable host pool and workspace diagnostics.
5. Create the DCR and deploy the association and agent to session hosts.
6. Close the gaps in performance counters and event logs until Missing lists are empty.
7. Review cost after a few days of data.

## Typical mistakes

- Mixing unrelated data into the same Log Analytics workspace.
- Giving only the Desktop Virtualization Reader role and forgetting Log Analytics Reader.
- Enabling diagnostics for the host pool but not for the workspace.
- Forgetting the system managed identity after adding the agent.
- Ignoring the 1,000 session host limit for automated deployment.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/)
- [Azure Monitor Workbooks](https://www.m365.fm/entity/azure-monitor-workbooks/)

## Sources

- [Use Azure Virtual Desktop Insights to monitor your deployment (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/insights)
