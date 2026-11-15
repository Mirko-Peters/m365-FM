---
title: "Migrate from the Log Analytics Agent to Azure Monitor Agent Without Losing Data"
summary: "A migration order for moving machines from the retired Log Analytics agent (MMA) to Azure Monitor Agent with data collection rules, covering inventory, dependent services, pilot, validation and removal, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [azure-monitor-agent, azure-monitor, azure-arc]
keypoints:
  - "The migration is about the agent, not the workspace. Azure Monitor Agent still sends data to Log Analytics workspaces, but it is configured through data collection rules instead of workspace settings."
  - "Learn says the Log Analytics agent was retired on August 31, 2024, and that after March 2, 2026 data upload can stop at any time without notice."
  - "Two Microsoft tools help: the Migration Helper workbook for inventory and progress, and the DCR Config Generator that converts workspace configuration into data collection rules."
  - "Learn lists dependent services to handle first, such as Update Management (use Azure Update Manager), Change Tracking, Defender for Cloud and Microsoft Sentinel."
  - "Avoid double ingestion in the pilot by removing the old agent's workspace configuration without uninstalling it, then validate with KQL before expanding."
faq:
  - q: "Is the Log Analytics agent still supported?"
    a: "No. Microsoft Learn says Microsoft does not support the Log Analytics agent, which was retired on August 31, 2024. It also says that after March 2, 2026, data upload from the agent can stop at any time without further notice."
  - q: "Do I have to move my Log Analytics workspaces?"
    a: "The migration article describes moving agents to Azure Monitor Agent and suggests using the migration as an opportunity to consolidate unused workspaces. It does not describe moving workspace data as part of the agent migration."
  - q: "How do I convert my existing workspace configuration?"
    a: "Learn points to the DCR Config Generator, which converts your existing Log Analytics agent workspace configuration into data collection rules automatically. Deploy the generated rules to a pilot group first."
  - q: "How do I avoid duplicate data during testing?"
    a: "Learn says to remove the Log Analytics agent's workspace configurations on pilot servers without uninstalling the agent, so you avoid double ingestion while you compare data."
  - q: "What about servers managed by System Center Operations Manager?"
    a: "Learn says the retirement does not apply to a Log Analytics agent connected exclusively to an on-premises SCOM installation. Keep the agent on machines managed by SCOM, or evaluate SCOM Managed Instance if you plan to continue using SCOM."
---

Moving from the Log Analytics agent to Azure Monitor Agent (AMA) is an agent migration. The Log Analytics workspace usually stays. What changes is how collection is configured: AMA uses data collection rules (DCRs) instead of workspace-based settings. Microsoft Learn describes a four-part process: assess, configure and deploy, validate, and remove the old agent. The agent is also called MMA or OMS agent.

## Why the timeline matters

Learn states that the Log Analytics agent was retired on August 31, 2024. For anyone who has not migrated, it lists these impacts:

- **Data upload.** Cloud ingestion services for the agent are being shut down. After March 2, 2026, data upload can stop at any time without further notice.
- **Installation.** You cannot install it from the Azure portal, but offline and extension-based installation still work.
- **Support.** Microsoft does not support the agent.
- **OS support.** It no longer receives new distributions or service packs.

The retirement does not apply to a Log Analytics agent connected exclusively to an on-premises System Center Operations Manager (SCOM) installation.

## Step 1: Inventory

Learn names two tools:

| Tool | Purpose |
|---|---|
| Azure Monitor Agent Migration Helper workbook | Inventory agents, audit workspaces, identify dependent services and track progress. |
| DCR Config Generator | Converts the existing workspace configuration into data collection rules. |

Questions Learn asks before you start:

- How many agents need to migrate?
- Are agents deployed outside Azure? For on-premises and other cloud servers, install the Azure Arc Connected Machine agent first. Learn says this makes the servers visible to Azure as targetable resources at no extra cost.
- Do you use SCOM? If so, keep the agent on SCOM-managed machines.
- How are agents deployed today? If deployment is automated, stop deploying the old agent to new servers so the backlog does not grow.

Review the workspaces too. The Migration Helper workbook shows which workspaces exist, which solutions you use and when you last used each. Learn calls migration a good opportunity to consolidate unused workspaces. For deeper analysis it describes a Workspace Auditing workbook from a GitHub repository that shows data sources, agents sending heartbeats, resources and Application Insights resources sending data.

## Step 2: Handle dependent services

| Service | Learn's migration action |
|---|---|
| Azure Automation Update Management | Use Azure Update Manager, which does not use Azure Monitor Agent. |
| Change Tracking and Inventory | Create a data collection rule for the Azure Monitor Agent change tracking solution. |
| Microsoft Defender for Cloud | With Defender for Servers Plan 2, change the agent deployment from the Log Analytics agent to agentless scanning. To collect security events, create a custom data collection rule. |
| Microsoft Sentinel | Solutions that used the old agent now support AMA. Update them to the latest versions. |

## Step 3: Pilot with data collection rules

Learn's order:

1. Identify a small pilot group of servers.
2. Generate DCRs with the DCR Config Generator and deploy them to the pilot group.
3. If you use VM insights, migrate VM insights to AMA for the pilot group.
4. To avoid double ingestion, remove the Log Analytics agent's workspace configurations on the pilot servers without uninstalling the agent.
5. Deploy at scale with built-in Azure Policy definitions for the AMA extension and DCR associations. This also covers new machines.

The prerequisites include reviewing the AMA installation requirements and the permissions needed on target machines.

## Step 4: Validate

Learn recommends three checks before expanding:

1. **Compare ingested data.** Run KQL queries to compare data from both agents. For example, query the `Heartbeat` table and filter by `Category` to confirm AMA heartbeats arrive.
2. **Check for gaps.** Verify performance counters, Windows events, Syslog and custom logs. Compare record counts and data types over the same period.
3. **Validate dependent services.** Confirm that Defender for Cloud, Microsoft Sentinel and Change Tracking still work.

Because the old agent's workspace configuration was removed on pilot servers, compare against a period before the cutover or against machines not yet in the pilot. That point is the author's note, not a Learn statement.

## Step 5: Remove the old agent

After validation across the environment, remove the Log Analytics agent to avoid duplicate collection. Learn names the MMA Discovery and Removal tool for removal at scale. For SCOM, keep the agent on SCOM-managed machines. The Operations Manager Admin Management Pack helps remove workspace configurations at scale while keeping the SCOM management group configuration intact.

## Known issues from the article

- **IIS logs.** AMA might not populate the `sSiteName` column of the `W3CIISLog` table. Enable the **Service Name (s-sitename)** field in W3C logging for IIS to collect it.
- **SQL Assessment solution.** The deployment policies require one Log Analytics workspace per subscription, which differs from the recommended AMA deployment approach.

## What the documentation does not say

The page read does not give a recommended pilot size, a duration for validation or a comparison of ingestion cost between the two agents. It also does not describe how to move historical data between workspaces. If cost is a concern, check the ingestion volume per table during the pilot.

## Related

- [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Arc](https://www.m365.fm/entity/azure-arc/)

## Sources

- [Log Analytics agent migration to Azure Monitor Agent (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-migration)
