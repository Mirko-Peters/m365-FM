---
title: "Copilot Agent Builder vs Copilot Studio: Which One Should You Use?"
summary: "Agent Builder or Copilot Studio? Microsoft's decision order, the real differences in actions, channels, sharing and lifecycle, and how to copy an agent from one to the other."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [copilot-agent-builder, copilot-studio, ai-agent]
keypoints:
  - "Microsoft says to choose by required capabilities and operating model, not by audience size alone, and to ask three questions in a fixed order."
  - "Agent Builder configures declarative agents in plain language for users inside your organization, and it cannot author actions that call external services."
  - "Copilot Studio is the choice for external channels, external-service actions, workflow logic and separate development, test and production environments."
  - "Copying an agent to Copilot Studio creates a separate snapshot. Connectors, embedded files, Teams chats and emails as knowledge must be set up again."
  - "Licensing depends on capabilities, users, channel, billing and harness, so check the Learn licensing pages before you promise a rollout."
faq:
  - q: "What is the main difference between Agent Builder and Copilot Studio?"
    a: "According to Microsoft Learn, Agent Builder is a guided way to configure declarative agents in Microsoft 365 Copilot with natural language and no source-code project. Copilot Studio is a managed authoring environment with workflow, integration, publishing and lifecycle capabilities. The deciding factors are the capabilities you need and how the agent will be operated."
  - q: "Can an agent built in Agent Builder call external services?"
    a: "No. Microsoft Learn states that Agent Builder does not support authoring actions that integrate external services. If you need low-code actions, connectors or workflows, copy the agent to Copilot Studio. If the scenario needs pro-code, Learn points to a separate development route."
  - q: "Do I lose my original agent when I copy it to Copilot Studio?"
    a: "No. Microsoft Learn says the original stays in Agent Builder and remains available in Microsoft 365 Copilot. The copy is a separate Copilot Studio agent created as a snapshot, so later changes to the original do not reach it. After testing and publishing the copy, you decide whether to delete the original."
  - q: "Do I need Copilot Studio just because many departments will use the agent?"
    a: "Not by itself. Microsoft Learn says that needing users across several departments does not by itself require Copilot Studio, because Agent Builder supports organization-wide sharing and submission to the org catalog, subject to policies and approvals."
  - q: "Which licenses do the two tools need?"
    a: "The Learn pages I read give no fixed license tiers. They say requirements depend on the configured capabilities, target users, publishing channel, tenant billing and, for Copilot Studio, the harness. For copying an agent, Learn lists a Copilot Studio license or a Microsoft 365 Copilot license plus the Dataverse entitlement."
---
Use Agent Builder when an agent only needs instructions and supported Microsoft 365 knowledge for people inside your organization. Use Copilot Studio when the agent needs external actions, workflow logic, an external channel or separate development, test and production environments. That is the order of questions in Microsoft's own decision guide on Learn, last updated on 2026-10-27. This article walks through the differences that matter in practice, how sharing and publishing differ, and how to move an agent from one tool to the other without starting over.

## What each tool is

[Agent Builder](https://www.m365.fm/entity/copilot-agent-builder/) provides, in Microsoft's words, an easy way to build declarative agents for Microsoft 365. You describe the agent in natural language, add knowledge sources, test it, and share it. Microsoft lists a writing coach or a team onboarding agent as typical examples. It is available on the Work and Web options of the Microsoft 365 Copilot app toolbar, at microsoft365.com/chat, at office.com/chat and in the Teams desktop and web client. It is not available on mobile.

[Copilot Studio](https://www.m365.fm/entity/copilot-studio/) is a graphical, low-code studio for building and managing agents and workflows, connecting them to organizational data and systems, and publishing them to channels such as Microsoft Teams, Microsoft Copilot and websites. You open it at copilotstudio.microsoft.com. Learn describes three harnesses, which are the engines that run the work: the GitHub Copilot harness, the Customer Conversation harness and the standard harness. The harness you choose affects billing, features and capabilities.

## The decision order Microsoft gives

Microsoft says to choose based on required capabilities and operating model, not audience size alone. Work through three questions in this order:

1. Do users need an external channel, such as a customer-facing website? If yes, evaluate Copilot Studio and confirm that the selected experience supports the channel and authentication you need.
2. Do you need external-service actions, workflow logic, or structured development, test and production environments? If yes, evaluate Copilot Studio's tools, workflows and lifecycle features.
3. Can instructions plus supported knowledge and capabilities in Microsoft 365 Copilot meet the scenario? If yes, start with Agent Builder and confirm its sharing and publishing options.

## Side-by-side comparison

The table below follows Microsoft's comparison table and adds the limits from the Agent Builder pages.

| Area | Agent Builder | Copilot Studio |
|---|---|---|
| Authoring | Natural-language configuration, no source-code project | Logic, tools and workflows supported by the selected harness |
| Actions | Cannot author actions that integrate external services | Integrations and workflows through tools and connectors |
| Audience | Users in your organization | Internal or external users, depending on the harness channels |
| Distribution | Sharing and org-catalog submission, subject to policy and approval | Channels supported by the harness, plus Microsoft 365 agent and channel controls |
| Lifecycle | Configure, test, share and submit in one experience | Environments, application lifecycle management, deployment and analytics |
| Governance | Microsoft 365 agent controls and data-source permissions | Power Platform environment and connector controls, plus Microsoft 365 controls |

## Limits to know before you start in Agent Builder

The Agent Builder overview lists several limits that often decide the question:

- Agents built in Agent Builder cannot be used in Teams group or one-to-one chats.
- Customer Managed Keys are not supported.
- Automatic sharing of SharePoint files and folders works only when you share with specific security groups, not with everyone in the organization. Otherwise the owner must fix permissions manually.
- If the tenant admin turns off web content with the "Allow web search in Copilot" policy, web content is blocked as a knowledge source, even though the Web content toggle in the Knowledge pane stays visible.
- Agent Builder agents do not consume the tenant's Dataverse storage entitlement.

The knowledge page adds numbers per agent: up to 4 public website URLs, up to 100 SharePoint files, folders or sites, one SharePoint list (up to 20,000 items), up to 50 OneDrive files and up to 20 embedded files. Microsoft also notes that "Only use specified sources" prioritizes your sources but does not block general AI knowledge. Blocking it requires Copilot Studio.

## Sharing and publishing in Agent Builder

A new agent is private. In the share dialog you add people or groups and give them a role. **Can edit** owners can change the agent. **Can chat** users can only use it. Groups can only be chat users. You can also turn on **Org-wide sharing for chat access**, which makes the agent findable in the Agent Store, unless an admin has limited that setting to specific users or no users.

For wider reach, an owner submits the agent to the org catalog. An admin reviews it in the Microsoft 365 admin center and, if approved, deploys it to the **Built by your org** section of the Agent Store. Users still need the Microsoft 365 Copilot license that the agent's capabilities require.

## Signs you have outgrown Agent Builder

Learn does not give a formal checklist, but its text points to these signals:

- You need actions that call external services.
- You need a customer-facing or other external channel.
- You need workflow logic or approvals, such as an IT request flow.
- You need separate development, test and production environments.
- You need environment-level policies or connector governance.

## How to copy an agent to Copilot Studio

1. In Agent Builder, open the agent.
2. Select **More options (...)**, then **Copy to Copilot Studio**.
3. Select the Power Platform environment that will store the agent definition. If environment routing is on, the admin's routed environment is preselected.
4. Wait for the copy to finish. Each copy operation creates a new agent.
5. In Copilot Studio, save the agent, then test it before you publish.

Learn lists these prerequisites: a Copilot Studio license or a Microsoft 365 Copilot license, the Common Data Service (Dataverse) entitlement in the user's license, an environment with a Dataverse data store in a supported data location, and the right security role.

What is copied: name, description, instructions, suggested prompts, icon, and SharePoint files, folders, sites and websites added as knowledge. What is not copied:

- Copilot connectors: set them up again. Scoped connectors are not currently supported in Copilot Studio.
- Embedded files: upload them again.
- Teams chats and meetings, and emails as knowledge: add the Power Platform connectors for Teams and Outlook.
- Creating documents, charts and code: add the code interpreter in the agent settings.
- Creating images from prompts: not currently supported.

The copy is a snapshot. Later edits to the original do not affect it.

## Typical mistakes

- Choosing Copilot Studio only because many people will use the agent. Learn says audience size alone does not decide it.
- Assuming every Copilot Studio feature exists in every agent. Learn warns that capabilities, channels and billing vary by harness.
- Expecting the copy to be a synchronized upgrade. It is a one-time snapshot, and some knowledge needs reconfiguration.
- Ignoring license checks. Confirm maker access separately from end-user access and consumption.

## Related

- [Agent Builder (Microsoft 365 Copilot)](https://www.m365.fm/entity/copilot-agent-builder/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)
- [Declarative agent (Microsoft 365 Copilot)](https://www.m365.fm/entity/declarative-agent/)

## Sources

- [Choose between Agent Builder and Copilot Studio to build your agent (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-studio-experience)
- [Agent Builder overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder)
- [Add knowledge to agents in Agent Builder (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge)
- [Share and manage agents built in Agent Builder (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish)
- [Copy an agent from Agent Builder to Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copy-agent-to-copilot-studio)
- [What is Copilot Studio? (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
