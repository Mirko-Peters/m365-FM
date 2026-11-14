---
title: "Copilot Agent Builder: Build Your First Agent Step by Step"
summary: "Step-by-step guide to building a declarative agent with Agent Builder in Microsoft 365 Copilot: open it, describe or configure the agent, add knowledge, test with Try it, and share it, including documented limits."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [copilot-agent-builder, copilot, declarative-agent, copilot-studio]
keypoints:
  - "Select New agent in Microsoft 365 Copilot, then describe the agent in natural language, skip to Configure, or start from a template."
  - "Configure limits: name 30 characters, description 1,000 characters, instructions 8,000 characters."
  - "Knowledge can include SharePoint items, public websites, Teams chat messages, Outlook emails and Copilot connectors, depending on license."
  - "Test on the Try it tab, select Create, then Share. Roles are Can edit and Can chat, and org-wide sharing is a toggle."
  - "Agent Builder cannot author actions that call external services. Copy the agent to Copilot Studio for connectors and workflows."
faq:
  - q: "Where do I open Agent Builder?"
    a: "According to Microsoft Learn, select New agent in Microsoft 365 Copilot. The overview page says you can build at microsoft365.com/chat, office.com/chat and in the Teams desktop and web clients, but not on mobile."
  - q: "How long can the instructions be?"
    a: "Microsoft Learn lists 8,000 characters for instructions, 1,000 for the description and 30 for the name on the Configure tab."
  - q: "Can an agent built in Agent Builder call external services?"
    a: "No. Microsoft Learn states that authoring actions that integrate external services is not supported. For low-code actions, connectors or workflows, copy the agent to Microsoft Copilot Studio."
  - q: "How do I share the agent with colleagues?"
    a: "Microsoft Learn says to select Create, then Share, add people or groups and pick Can edit or Can chat. Groups can only be added as Can chat. You can also turn on Org-wide sharing for chat access, unless an admin restricts it."
  - q: "Can the agent be used in Teams chats?"
    a: "The Learn overview lists as a limitation that agents built in Agent Builder cannot be used in Teams group chats or 1:1 chats. Sharing through the Agent Store is the documented route, and a downloaded ZIP can be sideloaded into Teams."
---

Agent Builder is the no-code way to create a declarative agent inside Microsoft 365 Copilot. You give it instructions and knowledge, test it, and share it. According to Microsoft Learn it suits quick, straightforward builds, such as a writing coach that follows your standards or an onboarding helper for a new team. This guide walks through the first build in the order Microsoft documents it.

## Before you start

- **Where it works.** Learn says you can build at microsoft365.com/chat, office.com/chat and in the Teams desktop and web clients. Mobile is not supported.
- **Licenses.** Access and capabilities depend on the licenses assigned in your tenant. The overview page does not name them and links to the agent licensing pages, so check those or ask your admin.
- **Network.** Admins must allow HTTPS access to `*.api.powerplatform.com` for authoring, configuration, publishing and sharing.
- **Admin control.** Admins can control whether Agent Builder is available in the organization.

## Step 1: Start a new agent

In Microsoft 365 Copilot, select **New agent**. Learn lists three paths:

1. **Describe in natural language.** Recommended. Type what you want in the chat box.
2. **Configure manually.** Select **Skip to configure** on the New agent page.
3. **Start from a template.** Under **Start with a template**, pick one. The agent is created automatically.

## Step 2: Describe the agent

When you describe the agent, Agent Builder fills in the name, description and instructions and keeps updating them as you refine. It also adds knowledge sources and capabilities from your wording. Learn's example: "Summarize my daily emails" adds **My emails** as a knowledge source. To add sources yourself, select the **+** in the chat box.

You can refine later by describing changes, such as asking the agent to summarize Teams chats instead of emails. The natural-language experience works only in supported Microsoft 365 languages. Otherwise, configure manually.

## Step 3: Check the Configure tab

Review each field. Learn gives these details:

| Field | What it does | Limit |
|---|---|---|
| Name | Descriptive and unique | 30 characters |
| Icon | Generate with AI, pick from the library or upload | PNG, 192 x 192 px, 1 MB |
| Model | Default response mode, users can override | n/a |
| Description | Helps the model decide when to use the agent | 1,000 characters |
| Instructions | Directs behavior and tasks | 8,000 characters |
| Knowledge | Websites, work content, embedded files, connectors | Varies by source |
| Starter prompts | Show common scenarios | None stated |

Response modes are **Auto** (default), **Quick response** and **Think deeper**.

Write instructions that cover guidelines, steps, error handling and examples, which is how Learn describes the autogenerated instructions.

## Step 4: Add knowledge and capabilities

Knowledge sources listed by Learn include SharePoint items, public websites, Teams chat messages, Outlook emails and Copilot connectors enabled in your tenant. Availability depends on the user's license. The page does not state a maximum number of sources.

Capabilities:

- **Code interpreter**, toggled next to **Create documents, charts, and code**.
- **Image generator**, toggled next to **Create images**.
- **Skills**, by adding a skill package or describing one in natural language.

If a tenant admin disables web content through the Allow web search in Copilot policy, web content is blocked as a knowledge source even though the **Web content** toggle stays on.

## Step 5: Test with Try it

The **Try it** tab becomes available once the agent has a name, description and instructions. It updates on each turn as you change the agent. Select **New chat** to see the suggested prompts again. Sharing, feedback and @mentioning other agents work only after the agent is created.

## Step 6: Create and share

Select **Create**. The agent stays private until you share it.

1. Select **Share**.
2. Enter a name, group or email and choose **Can edit** (owner) or **Can chat**. Groups can only be **Can chat**.
3. Keep **Send notification** on if you want the new users emailed, then select **Add**.
4. For everyone in the tenant, turn on **Org-wide sharing for chat access**. Users can then find the agent in the Agent Store.

Edits save automatically but are not visible to users until you select **Update** at the top right, which can take several minutes to reach them. Deleting an agent is permanent.

### Sharing caveats from Learn

- SharePoint files you add as knowledge are shared automatically only for the specific files and folders, and you need permission to share them. If sharing fails, the agent is still shared and the file owners or site admin must grant access.
- Admins can choose All users (default), Specific users or groups, or No users for sharing. If sharing is restricted, an admin must approve and deploy the agent first.
- Users need the Copilot license required by the agent's capabilities, otherwise using it may cause an error.

## What Agent Builder cannot do

- Author actions that integrate external services. Copy the agent to Copilot Studio for connectors, low-code actions and workflows.
- Support customer-managed keys.
- Run in Teams group chats or 1:1 chats, per the overview page.

Learn also notes that Copilot Studio processes Agent Builder capabilities, and that agents built here do not consume the tenant's Dataverse storage entitlement.

## Related

- [Agent Builder (Microsoft 365 Copilot)](https://www.m365.fm/entity/copilot-agent-builder/)
- [Declarative agent (Microsoft 365 Copilot)](https://www.m365.fm/entity/declarative-agent/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Microsoft Learn: Build agents in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-builder-build-agents)
- [Microsoft Learn: Agent Builder overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder)
- [Microsoft Learn: Share and manage agents built in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-share-manage-agents)
