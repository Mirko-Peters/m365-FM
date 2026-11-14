---
title: "Audit the Agent Inventory in the Microsoft 365 Admin Center and Control Agent Sprawl"
summary: "How to find and review every agent in your tenant using the Agent Registry in the Microsoft 365 admin center, which filters and tiles matter for an audit, and which actions and settings limit uncontrolled agents."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [copilot-control-system, agent-registry, agent-sprawl, shadow-ai]
keypoints:
  - "The registry is under Agents > All agents > Registry in the Microsoft 365 admin center and lists agents available to your organization."
  - "Start with the summary tiles: Total agents, Agents without owners, Unmanaged agents and Agents at risk."
  - "One Copilot Studio agent can appear several times, for example as Shared by creator and Published by your org. This is by design."
  - "Agent settings control which agent types users can install and who can share agents. Agent management rules automate cleanup of ownerless agents."
  - "Risk signals need an E7 or Agent 365 license. Governance actions need the AI Administrator or Global Administrator role."
faq:
  - q: "Where do I find the agent inventory?"
    a: "According to Microsoft Learn, sign in to the Microsoft 365 admin center and select Agents > All agents > Registry. Another Learn page describes the same list as the Agent inventory tab under Copilot controls. The navigation wording differs between pages, so use whichever matches your admin center."
  - q: "Why does the same agent show up twice?"
    a: "Learn says a single Copilot Studio agent can appear with different publisher types because each entry is a separate lifecycle and publisher record. Removing one entry does not remove the other."
  - q: "What can I do with agents that have no owner?"
    a: "Learn says shared agents become ownerless when the creator is deleted. The registry recommends blocking or deleting them. Agent management rules can also reassign ownerless Agent Builder agents to the previous owner's manager or block ownerless agents without usage."
  - q: "Can I export the inventory?"
    a: "Yes. The registry offers Export to CSV for all agents or filtered agents. A Microsoft Graph preview endpoint, with the CopilotPackages.Read.All scope, lists agents programmatically."
  - q: "Do I need a special license to see risk signals?"
    a: "Learn says the tenant needs an E7 or Agent 365 license for risk signals. Risk counts can lag the security portals by up to one hour."
---

To audit agents in your tenant, open the agent registry in the Microsoft 365 admin center, read the four summary tiles, filter by publisher type, channel and platform, export the list, and then tighten the settings that decide who can build, share and install agents. Microsoft Learn documents each of these pieces. It does not give one single end-to-end audit procedure, so this article joins the documented parts.

A naming note: Microsoft describes an integrated framework called Copilot controls for governing Copilot and agents. The Learn overview page does not use the label Copilot Control System in its body text, and it does not name an agent inventory as a feature of that framework. The inventory itself is documented on the agent pages cited below.

## Open the registry

1. Sign in to the Microsoft 365 admin center.
2. Select **Agents** > **All agents** > **Registry**.

An older-looking Learn page describes the same list as the **Agent inventory** tab. Select an agent to review its data and tools (capabilities, knowledge and actions) and its security and compliance details.

Governance actions such as approving requests and assigning ownership can only be done by users in the **AI Administrator** or **Global Administrator** roles. Other roles can see governance gaps but cannot act.

## Read the summary tiles first

| Tile | Meaning on Learn |
|---|---|
| Total agents | Agents in the tenant. Filters do not change it. |
| Agents without owners | Agents with no current owner |
| Unmanaged agents | Created or managed outside Agent 365, without its risk protection and observability |
| Agents at risk | Agents with one or more risk signals |

Shared agents become ownerless when the creator is deleted. The count updates in real time when you hard delete a user.

## Filter and understand the list

Filters are Status, Publisher Type, Channel (Copilot, Teams, Outlook, Microsoft 365 apps, SharePoint), Platform and Data source. Publisher types are Microsoft agents, External partner-built agents, Published by your org and Shared by creator.

If expected agents are missing, check for an active filter.

Expect duplicates. Publishing in Copilot Studio alone might not make the agent visible in the admin center. **See agent in Microsoft 365** creates a Shared by creator entry. Showing the agent to everyone and submitting it for approval, then publishing as admin, creates a Published by your org entry. Available actions differ per entry: some offer Delete, some Remove, some only Block.

## Export for the audit record

Use **Export** to produce a CSV of all or filtered agents. Learn says exports can include more than 30 fields per agent, and the Instructions column is available in the export.

For scripting, Learn shows a Microsoft Graph preview call against `https://graph.microsoft.com/v1.0/copilot/admin/catalog/packages` with the `CopilotPackages.Read.All` scope and the AI Administrator role. It is preview, so do not build critical reporting on it without a fallback.

## Review risk and ownership

The Risks column aggregates signals from Microsoft Purview, Microsoft Entra, Microsoft Defender and connected third-party platforms. Selecting the count opens a pane with high, medium and low severity sections. Requirements and limits from Learn:

- E7 or Agent 365 license in the tenant
- Counts can lag the security portals by up to one hour
- Deep links need roles such as Security Reader or AI Administrator for Entra and Defender, and IRM Analyst or IRM Investigator for Purview alerts. Global Administrator alone is not enough for Purview.

For ownerless agents, Learn recommends block or delete. The registry page does not describe an assign-owner action, though the overview page says admins can assign owners from the Agents without owners card.

## Limit new sprawl with settings

Under **Agents** > **Settings**, Learn lists:

- **Agent and plugin access:** toggles for agents built by Microsoft, by your organization and by external publishers. Disabled types do not appear in the Agent store.
- **Sharing:** for Agent Builder agents, choose All users, No users or Specific users.
- **User access:** All users (default), No users, or specific users or groups.
- **Agent management rules:** bulk rules such as installing Microsoft agents, reassigning ownerless Agent Builder agents to the owner's manager, blocking ownerless agents without usage, and rejecting publish requests older than a set number of days. A rule runs after you review the impacted agents.
- **Tags:** up to 50 organization-wide labels.

The settings article does not state which admin roles can change them, and it does not cover who can create agents. Check your role design separately.

## A repeatable review

1. Export the registry and record the tile counts.
2. Review ownerless and at-risk agents first. Block or delete what you cannot justify.
3. Check Shared by creator agents that reached broad audiences.
4. Confirm the agent access and sharing settings match your policy.
5. Schedule the same review monthly and compare counts.

Third-party MCP servers and tools used by agents are Non-Microsoft Products, per Learn. Review their data flows before allowing external publishers.

## Deploy, assign and pin deliberately

Assign and deploy are separate actions. **Available to** controls who can find and install an agent. **Deployed to** installs it for chosen users. To assign, open the agent, select the **Users** tab, choose **Assign to** (Just me, Entire organization or Specific users/groups) and select **Update**.

Admins can pin up to three agents per user. Only deployed agents can be pinned, blocked agents must be unblocked first, and a pin can take up to six hours to reach users. Pinning needs the AI Administrator role. Custom agents can be added as a .zip package through **Add agent**, then published, optionally deployed and given a security template.

## Related

- [Copilot Control System](https://www.m365.fm/entity/copilot-control-system/)
- [Agent registry](https://www.m365.fm/entity/agent-registry/)
- [Agent sprawl](https://www.m365.fm/entity/agent-sprawl/)
- [Shadow AI](https://www.m365.fm/entity/shadow-ai/)

## Sources

- [Agent Registry in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-registry)
- [Agent management in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-365-overview)
- [Agent settings](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-settings)
- [Agent inventory](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/manage-copilot-agents-integrated-apps)
- [Assign, deploy and block agents](https://learn.microsoft.com/en-us/copilot/microsoft-365/agent-essentials/agent-lifecycle/agent-assign-deploy)
- [Copilot controls overview](https://learn.microsoft.com/en-us/copilot/microsoft-365/copilot-control-system/overview)
