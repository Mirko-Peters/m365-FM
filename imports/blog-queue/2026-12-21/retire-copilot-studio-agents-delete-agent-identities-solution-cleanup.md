---
title: "Retire Copilot Studio Agents: Lifecycle Stage, Deleting the Agent, Entra Agent ID Cleanup and Solution Gaps"
summary: "What Microsoft Learn documents for decommissioning a Copilot Studio agent: the Retire lifecycle stage, the delete steps and known issues, what happens to the agent identity in Microsoft Entra, and what is not documented about orphaned solution components."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [copilot-studio, microsoft-entra, copilot-governance]
keypoints:
  - "The Center of Excellence lifecycle ends with Retire: decommission agents that no longer add value and remove their access and dependencies cleanly. An owner stays named until then."
  - "Deleting an agent in Copilot Studio needs the agent name typed to confirm. After a few minutes all data associated with the agent is deleted permanently."
  - "Learn says deleting an agent removes its Agent ID or app registration from Microsoft Entra ID. Conditional Access policies can block this, and then you may have to remove resources manually."
  - "Entra soft deletes agent identities for 30 days and cascade cleanup runs asynchronously, possibly hours or days later. Soft-deleted objects keep counting toward quota."
  - "Learn does not describe a cleanup of leftover solution components after deleting an agent. Review the solution in the solution explorer yourself."
faq:
  - q: "How do I delete a Copilot Studio agent?"
    a: "Learn says to go to the Agents page, select the agent, open the three dots next to Settings and select Delete, then enter the agent's name and select Delete agent. After a few minutes, all data associated with the agent is deleted permanently. If the license is expired, you can select Permanently delete your agents."
  - q: "Why did deleting an agent fail?"
    a: "Learn names Microsoft Entra Conditional Access policies. When Copilot Studio deletes an agent it removes several resources provisioned in your tenant, such as the app registration and service principals, and Conditional Access can block those operations. You might then need to remove the affected resources from your tenant manually."
  - q: "Can I stop an agent without deleting it?"
    a: "For Entra agent identities, Learn describes disabling as the temporary option: it prevents the identity from authenticating but leaves all objects in place and counting toward quota. Whether this fits a Copilot Studio agent is not stated on the pages read, because Copilot Studio manages those identities automatically."
  - q: "How long can I restore a deleted agent identity?"
    a: "For agent identity blueprints and their child identities, Learn says soft-deleted objects can be restored within 30 days and are permanently deleted after that. The page covers blueprint deletion, and it does not say whether a deleted Copilot Studio agent itself can be restored."
  - q: "Which identity does my Copilot Studio agent have?"
    a: "New agents automatically get Entra Agent IDs. Agents created before Entra Agent ID was implemented in May 2026 continue using app registrations. In Copilot Studio, Settings, Advanced, Metadata shows the Entra Agent ID or the Application ID."
---

Microsoft Learn covers decommissioning an agent in pieces: a lifecycle model that includes a Retire stage, the Copilot Studio delete steps, and Microsoft Entra pages on identity deletion. It does not provide one end-to-end retirement checklist, and it says nothing about cleaning leftover solution components. This article connects the documented pieces and marks the gaps.

## Retire is a lifecycle stage

The Center of Excellence guidance describes seven lifecycle stages: Intake, Triage, Build, Deploy, Monitor, Improve and Retire. Retire means to decommission agents that no longer add value and remove their access and dependencies cleanly. The page adds that retirement is a healthy outcome, not a failure, because an unwatched agent costs money and risk.

The same page expects every agent to have a named owner, kept visible in the agent registry, a monitoring plan, and a path to improvement or retirement. The CoE defines the lifecycle and review cadence, while the owner decides what to change and when. The page does not give a retirement trigger such as an inactivity threshold. How you define a deprecated agent is your decision.

## Step 1: Find the agent and its owner

Per the Copilot Studio identity page, the agent owner is added to the agent identity for governance traceability. For Entra Agent IDs the owner is added as a sponsor with limited permissions, and some preexisting agents might not have sponsors yet. For legacy app registrations the owner is added as owner of the app registration.

To find the identity: in Copilot Studio, **Settings** > **Advanced** > **Metadata** shows the Entra Agent ID, or the Application ID for legacy agents. Use that GUID to find the identity in the Microsoft Entra admin center.

Agent Builder agents are a different case. Learn says they currently do not use or require app registration IDs or Agent IDs, so the steps below on identities do not apply to them.

## Step 2: Delete the agent

From the Copilot Studio page, for the web app:

1. Go to the **Agents** page and select the agent.
2. On the top menu bar, select the three dots next to **Settings** and select **Delete**.
3. Enter the agent's name and select **Delete agent**. After a few minutes all data associated with the agent is deleted permanently.

For the Teams app, classic chatbots are deleted under **Settings** > **Details** > **Delete** with the chatbot name as confirmation. If a license is expired, Learn says you can use **Permanently delete your agents**. The Learn page implies no undo for the agent data, because the deletion is called permanent.

### Known issue: Conditional Access

Deleting an agent removes several resources provisioned in the tenant, such as app registration and service principals. Conditional Access policies can block those operations. If deletion fails, you might need to manually remove the affected resources from your tenant.

## Step 3: Understand the identity side

The Copilot Studio identity page says deleting an agent removes the associated Agent ID, or app registration, from Microsoft Entra ID, and refers to an article on deleting agents for details. That article was not read for this piece.

The Entra page on agent identity deletion describes the general behavior for blueprints, and it states what applies to the objects:

| Object | Type | Relationship |
|---|---|---|
| Agent identity blueprint | Application | Parent of the blueprint principal |
| Blueprint principal | Service principal | Principal for the blueprint |
| Agent identity | Service principal | Child of the blueprint principal |
| Agent's user account | User | Paired 1:1 with an agent identity |

- Deleting a blueprint or its principal triggers cascade cleanup: Entra soft deletes child agent identities and agents' user accounts. The cleanup is asynchronous and can be delayed by hours or days. Each deletion shows in the audit log as **Delete service principal** by the actor **Delete Agent Identities Task**.
- Soft-deleted objects are restorable for 30 days. If you restore the blueprint principal before the background cleanup has run, children are unaffected. After it ran, each child must be restored individually.
- Learn contrasts **Disable** (identity cannot authenticate, objects stay in place and count toward quota) with **Delete**.
- Soft-deleted objects keep counting toward quota until permanently deleted.

Important context from the Copilot Studio page: the blueprint used for Copilot Studio agents is Microsoft-owned, and the 250 agent-identity-per-blueprint cap on the Entra page does not apply to Copilot Studio. Tenant quota still applies, with 50,000 directory objects by default or 300,000 with a verified domain, and agents cannot be created if the quota is reached at creation time.

The Entra page does not say which of these steps Copilot Studio performs for its Microsoft-owned blueprint, and it does not say whether an individual Copilot Studio agent identity can be restored after deletion. Treat the 30-day restore window as documented for Entra objects in general.

## Step 4: Look at the solution

Copilot Studio agents are created inside a Power Platform solution. Learn describes the solution as a carrier, and gives these ways to see which one holds an agent: **View solution** from the agent's overview or settings. The solution explorer lets you add or remove components and export, import and upgrade solutions. It also lets you remove an unmanaged layer from a managed agent.

What the pages read do not describe:

- Whether components that are in a solution, such as connection references, flows or other tables, are removed when the agent is deleted.
- A procedure or report to find orphaned solution artifacts.
- Cleanup for components other makers added to a shared solution.

As the author's practical suggestion, which is not a Learn procedure: before deleting, open **View solution** and note the components, and after deletion, check the solution again in the solution explorer and remove what is left, using the roles Learn says the solution explorer inherits from the user.

## What the documentation does not say

- No page read gives a single retirement checklist for a Copilot Studio agent.
- There is no documented inactivity rule for deciding that an agent is deprecated.
- The pages do not describe how channel registrations or published links behave after deletion, beyond the data deletion statement above.
- The delete-agents administration page that Learn references was not read, so administrator-level deletion options are not covered here.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)
- [Agent registry](https://www.m365.fm/entity/agent-registry/)

## Sources

- [Manage the agent lifecycle (Microsoft Learn)](https://learn.microsoft.com/en-us/agents/center-of-excellence/agent-lifecycle)
- [Create and delete agents, Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-first-bot)
- [App registration, agent identities, and authentication, Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/govern-agents-identities-overview)
- [Learn how agent identity deletion works, Microsoft Entra Agent ID (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/agent-id/concept-agent-identity-deletion)
- [Create and manage custom solutions, Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)
