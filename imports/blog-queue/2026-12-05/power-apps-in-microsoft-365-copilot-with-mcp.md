---
title: "Power Apps in Microsoft 365 Copilot with MCP: What Works Today"
summary: "How MCP connects Power Apps and Microsoft 365 Copilot: the Power Apps MCP Server for agents, MCP app widgets for interactive UI, and the preview limits and permissions that Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [power-apps, mcp, copilot, copilot-studio]
keypoints:
  - "The Power Apps MCP Server is in preview and gives agents three tools: log_for_review, request_assistance and invoke_data_entry."
  - "Starting May 1, 2026, the agent feed only supports agents that use the Power Apps MCP Server to create tasks."
  - "MCP apps are interactive widgets that render inside Microsoft 365 Copilot chat. Power Apps support for MCP apps in declarative agents is in public preview."
  - "invoke_data_entry never creates records automatically. A user must review and approve each record."
  - "By default, agent feed access is limited to the System Administrator and System Customizer roles."
faq:
  - q: "What is the Power Apps MCP Server?"
    a: "Microsoft Learn describes it as a way for an agent to communicate with Power Apps, for human-in-the-loop supervision or agentic workflows. It is in preview. Agents can automate repetitive app tasks and hand control to humans through the agent feed. The page says it is English only."
  - q: "How do I add it to an agent?"
    a: "According to Microsoft Learn, open the agent in Copilot Studio, select Add tool, search for Power Apps MCP Server, select Add and configure, update the agent instructions to use each tool, then save and publish. Autonomous agents that run from a trigger need Maker-provided credentials."
  - q: "What are MCP apps in Microsoft 365 Copilot?"
    a: "Microsoft Learn describes MCP apps as interactive UI widgets that run inside Microsoft 365 Copilot chat, powered by MCP servers. Declarative agents use them to return rich experiences instead of text only. Copilot supports widgets built with MCP Apps and part of the OpenAI Apps SDK."
  - q: "Is it ready for production?"
    a: "Not according to the pages. Microsoft Learn labels the Power Apps MCP Server preview, and says Power Apps support for MCP apps in declarative agents is still in public preview, even though MCP apps in Microsoft Copilot Chat became generally available in March 2026. Preview features are not meant for production use."
  - q: "Who can see the agent feed?"
    a: "Microsoft Learn says access to the agent feed and supervision features is limited by default to the System Administrator and System Customizer roles. To extend access, grant organization-level read and write permissions on the Agent Hub Goal, Agent Hub Insight, Agent Hub Metric, Agent Task and Copilot tables."
---

MCP connects Power Apps and Microsoft 365 Copilot in two different ways, and the names are easy to mix up. The Power Apps MCP Server lets an agent hand tasks to people inside model-driven apps. MCP apps are interactive widgets that appear inside Copilot chat. Both are described by Microsoft Learn as preview or partly preview, so treat them as features to pilot, not to roll out.

## Path 1: the Power Apps MCP Server (agent supervision)

Microsoft Learn presents it as a way for an agent to talk to Power Apps, giving human-in-the-loop supervision or agentic workflows. It lets agents automate repetitive app tasks and pass control to people through the agent feed. The page states that the feature is in preview and English only. It replaces the earlier Copilot Studio activity-based agent feed, and starting May 1, 2026, the agent feed supports only agents that use the Power Apps MCP Server to create tasks.

**The three tools:**

| Tool | Purpose |
|---|---|
| `log_for_review` | Logs completed, low-risk actions for passive oversight, shown in the Completed tab |
| `request_assistance` | Escalates errors or exceptions to a human, shown in Needs Attention, and the agent run waits |
| `invoke_data_entry` | Extracts data from unstructured input such as emails and documents into Dataverse records, which users must review and approve |

**Add it to an agent:**

1. Open the agent in Copilot Studio and select **Add tool**.
2. Search for **Power Apps MCP Server**.
3. Select **Add and configure**.
4. Update the agent instructions so each tool is used at the right point.
5. Save and publish.

For autonomous agents that run from a trigger, the tool must use Maker-provided credentials. The user needs permission to create records in the target table, and columns must be referenced by logical name.

**Limits of invoke_data_entry:** it supports PDF, XLSX, DOCX, JPEG, JPG, PNG, GIF and BMP files. It populates only single line of text, whole number and decimal columns. It never creates records on its own.

**Access:** by default, the agent feed and supervision features are limited to the System Administrator and System Customizer roles. To extend access, grant organization-level read and write on the tables Agent Hub Goal, Agent Hub Insight, Agent Hub Metric, Agent Task and Copilot.

## Path 2: MCP apps in Microsoft 365 Copilot (interactive UI)

Microsoft Learn describes MCP apps as interactive widgets that run inside Microsoft 365 Copilot chat. A declarative agent includes an MCP server-based plugin whose tools return interactive UI. Copilot supports widgets built with MCP Apps, an MCP extension, and with part of the OpenAI Apps SDK.

For model-driven Power Apps, a second Learn page explains how to generate widgets:

1. Create and test a custom tool in the model-driven app designers, with its output type set to JSON, and copy the full JSON output.
2. Run the `generate-mcp-app-ui` skill from GitHub Copilot CLI or Claude Code, with a description and the real JSON.
3. Review the self-contained HTML file the skill writes and preview it in a browser.
4. Copy the HTML into the **UX input** of the tool, so the widget returns as the tool's UI response.

The page warns to use real JSON rather than mock data. Deployment depends on the host. For Microsoft Copilot Chat, it names sideloading for testing, deployment through the Microsoft 365 admin center, or publishing to the Microsoft 365 agent store.

**Status:** the page says MCP apps in Microsoft Copilot Chat became generally available in March 2026, but Power Apps support for MCP apps in declarative agents remains in public preview.

**Server requirements from the plugin article:** OAuth 2.1 or Microsoft Entra SSO for production, with anonymous access only for development, and allowed URLs for the widget host and redirect URIs. Unsupported capabilities include file upload and modal requests.

## How to test

1. Open `https://m365.cloud.microsoft/chat`.
2. Select your agent in the left sidebar, or **All agents** if it is not listed.
3. Ask for something that triggers your MCP server.
4. Allow the connection when prompted and check that the widget renders.

## Which path to choose

| Goal | Path |
|---|---|
| Let an agent log work or ask a human for help inside a model-driven app | Power Apps MCP Server |
| Extract data from emails or files into Dataverse with human approval | `invoke_data_entry` |
| Show a card, chart or map inside Copilot chat | MCP app widget |

## A third option: the Dataverse MCP server

If the agent needs the data behind a Power Apps solution rather than the app itself, Microsoft Learn describes Dataverse as an MCP server too. MCP clients named on the page include Copilot Studio agents, GitHub Copilot in Visual Studio Code, GitHub Copilot CLI, Claude desktop and Claude Code. The server and allowed clients must be enabled and configured for each Power Platform environment. The tools cover searching data, describing tables, running read queries, creating and updating records, and, only after explicit user approval, deleting rows and tables. The page also notes that, from December 15, 2025, Dataverse MCP tools are charged when accessed by AI agents built outside Copilot Studio, with exceptions for users who have Dynamics 365 Premium or a Microsoft 365 Copilot user subscription license for Dynamics 365 data. Check the billing page before a rollout.

## Typical mistakes

- Building widgets from mock JSON. They can break against the live tool.
- Forgetting that agent feed access needs permissions on the Agent Hub tables.
- Planning production use of preview features.
- Expecting the widget HTML to handle authentication. The host handles it.

## What the pages do not say

The Power Apps MCP Server page does not mention Microsoft 365 Copilot, so its use there is not confirmed by that page. The pages I read give no licensing details.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)

## Sources

- [Power Apps MCP Server (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/power-apps-mcp-server)
- [Generate MCP app widgets for model-driven apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/generate-mcp-app-widgets)
- [MCP apps in Microsoft 365 Copilot (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-mcp-apps)
- [Dataverse MCP server (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp)
