---
title: "Agent 365 and Microsoft Entra Agent ID Explained: Registry, Identity and Licensing"
summary: "How Microsoft Agent 365 and Microsoft Entra Agent ID fit together: the agent registry, identity blueprints, Conditional Access, roles to assign, licensing and where to find all agents in the admin center."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [agent-365, agent-id, microsoft-entra, agent-registry]
keypoints:
  - "Agent 365 is the unified registry and control plane for agents in the Microsoft 365 admin center. Entra Agent ID remains the identity foundation underneath it."
  - "Agent ID creates and manages agent identities and agent identity blueprints. It is available to all Microsoft Entra customers."
  - "Extending Entra security features such as Conditional Access to agents requires Agent 365, which is per user and included in Microsoft 365 E7."
  - "To see every agent, use the Microsoft 365 admin center, then Agents, then All agents. The Entra admin center shows only agents that have an Entra Agent ID."
  - "Learn names AI Reader for viewing the inventory and Agent ID Administrator for managing agent identities."
faq:
  - q: "What is Microsoft Agent 365?"
    a: "Microsoft Learn describes Agent 365 as the observability platform for AI. It gives one view of the agents in an organization, from Microsoft and other companies, with an agent registry, an Agent Map, access control through Microsoft Entra, risk signals from Defender, Entra and Purview, audit through Purview, and cost management for Copilot Credit usage."
  - q: "What is Microsoft Entra Agent ID?"
    a: "Learn describes it as the part of the Microsoft agent identity platform that creates and manages agent identities and agent identity blueprints. The platform covers an agent identity blueprint, an agent identity and an agent's user account, with OAuth 2.0 and OpenID Connect based authentication, and is available to all Microsoft Entra customers."
  - q: "How do Agent 365 and Agent ID relate?"
    a: "Learn's convergence article says agent registry experiences that were spread across the Entra and Microsoft 365 admin centers are being consolidated under Agent 365. Entra keeps its role as identity foundation through Agent ID, and agent registration APIs, governance and security controls remain unchanged."
  - q: "Do I need a license to view agents?"
    a: "Learn says viewing the full inventory needs no specific license. Applying Conditional Access or identity governance to agents needs the appropriate Entra Agent ID licensing. Learn also says extending Entra security features to agents requires Agent 365, which needs a per-user license."
  - q: "Where do I find all agents in my organization?"
    a: "Learn says to go to the Microsoft 365 admin center at admin.microsoft.com, then Agents, then All agents. The Entra admin center shows only agents that have an Entra Agent ID, so use the Microsoft 365 admin center for the complete inventory."
---

Agent 365 is where administrators see and govern all agents, and Entra Agent ID is the identity layer that gives each agent its own identity. They are two parts of one picture, and Microsoft has been merging the registry views under Agent 365. This explainer sets out what each does, how they connect, and what you need to license and assign.

## Agent 365 in one paragraph

Microsoft Learn calls Agent 365 the observability platform for AI. It gives IT, security and business teams one view of the agents in the organization, including agents from Microsoft and other companies. Learn names four pillars: management, governance, security and business value.

Features named on the overview page:

| Area | Feature |
|---|---|
| Registry | Agent registry in the Microsoft 365 admin center, with owner, usage and risk per agent |
| Visualization | Agent Map, which groups agents by build platform, and an agent overview page |
| Interoperability | Connected platforms for agents built elsewhere, and partner agents |
| Access control | Entra controls what each agent can access. Policy templates for new agents |
| Security | Risk signals from Defender, Entra and Purview. Agents can be blocked |
| Audit and cost | Purview records agent activity. Cost management shows Copilot Credit usage with spending limits |

## Entra Agent ID in one paragraph

Learn describes Entra Agent ID as the part of the agent identity platform that creates and manages **agent identities** and **agent identity blueprints**. The platform distinguishes agents from application identities for web services and from user identities for humans. Three constructs are named: the agent identity blueprint, the agent identity, and the agent's user account.

Capabilities listed include an OAuth 2.0 and OpenID Connect compliant authentication service, SDKs (Microsoft Identity Web for .NET and the Microsoft Entra ID Auth SDK sidecar), an admin interface in the Entra admin center with an agent registry, and interoperability for non-Microsoft platforms such as AWS Bedrock and n8n through the sidecar or workload identity federation.

## How they fit together

A separate Learn article on agent registry convergence says visibility used to be spread across the Entra admin center and the Microsoft 365 admin center. Microsoft is consolidating the registry under Agent 365 as the unified registry and control plane for all agents, Microsoft and non-Microsoft. Entra remains the identity foundation through Agent ID.

What stays the same: agent identity capabilities in Entra Agent ID, agent registration APIs, and identity governance and security controls. What changes: Agent 365 is the place to discover all agents, while the Entra admin center shows only agents that have an Entra Agent ID. The page gives no dates for the convergence.

## What admins should do

From the convergence article:

1. **Assign roles.** Use **AI Reader** for least-privilege viewing of the full inventory, and **Agent ID Administrator** to manage or change agent identities. AI Administrator also grants inventory access.
2. **View all agents.** Go to the Microsoft 365 admin center at admin.microsoft.com, then **Agents**, then **All agents**.
3. **Register blueprints.** Register agent identity blueprints in the Agent 365 registry so admins can discover and govern them. Some earlier blueprints may not appear automatically.
4. **Keep identity controls in Entra.** Conditional Access, identity governance, network controls and identity signals for agents stay in the Entra admin center.

## Licensing

The statements below are from Learn, and plan details should be checked in the service description.

- Agent ID is available to all Microsoft Entra customers.
- Agent 365 is generally available for the Commercial segment and licensed per user. At least one user must hold a qualifying license to enable it. Learn says Microsoft E5 works best as a prerequisite.
- Extending Entra security features, such as Conditional Access, to agents requires Agent 365. It is included in Microsoft 365 E7 and available as an add-on to E5, A5 and Business Premium, or to Defender Suite plus Purview Suite.
- Viewing the inventory needs no specific license.

The Conditional Access overview adds that agent identities are a signal option in Preview. The Microsoft-managed policy list includes a preview policy that blocks high-risk agents.

## A simple way to remember the split

Think of Agent ID as the identity layer and Agent 365 as the management layer. Identity answers "who is this agent and what may it access?" and lives in Entra, with Conditional Access and identity governance. Management answers "which agents exist, who owns them, what do they cost and what risks do they carry?" and lives in the Microsoft 365 admin center. Learn's convergence article describes exactly this division of work, with Entra as the identity foundation and Agent 365 as the control plane.

## What the pages do not say

The Agent 365 overview does not mention Entra Agent ID by name, and the Agent ID page does not state a preview or general availability status, define a sponsor role or list limitations. Where the Learn pages are silent, check the current service description before you promise a feature to stakeholders.

## Common mistakes

- Looking for all agents in the Entra admin center. It shows only agents with an Entra Agent ID.
- Granting broad roles when AI Reader is enough for viewing.
- Assuming Agent ID alone gives Conditional Access for agents. Learn ties extended Entra security features to Agent 365.
- Leaving older blueprints unregistered.

## Related

- [Agent 365](https://www.m365.fm/entity/agent-365/)
- [Agent ID](https://www.m365.fm/entity/agent-id/)
- [Agent registry](https://www.m365.fm/entity/agent-registry/)
- [Agent identity blueprint](https://www.m365.fm/entity/agent-identity-blueprint/)

## Sources

- [Microsoft Agent 365 overview (Microsoft Learn)](https://learn.microsoft.com/microsoft-agent-365/overview)
- [What is the Microsoft Entra Agent ID platform (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/agent-id/what-is-agent-id-platform)
- [Agent registry convergence with Agent 365 (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/agent-id/agent-registry-convergence)
- [Microsoft-managed Conditional Access policies (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/managed-policies)
- [Conditional Access overview (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
