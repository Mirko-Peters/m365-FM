---
title: "Power Automate with MCP and Claude: What Finance Teams Should Know"
summary: "What Microsoft documents about connecting Claude to Power Platform through MCP: the Dataverse MCP server, Copilot Studio MCP tools, a Power Automate plugin for Claude Code, and the governance and billing points finance teams should check."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [power-automate, mcp, dataverse-mcp-server, claude]
keypoints:
  - "Learn lists Claude desktop and Claude Code as supported non-Microsoft clients for the Dataverse MCP server, after an admin enables the server and allowed clients for the environment."
  - "Dataverse MCP tools used by agents built outside Copilot Studio are charged since December 15, 2025, with exceptions for Dynamics 365 Premium and Microsoft 365 Copilot licensed users."
  - "A Microsoft power-platform-skills plugin lets Claude Code or GitHub Copilot CLI build, run and debug cloud flows through a local FlowAgent MCP server that signs in via Azure CLI."
  - "In Copilot Studio, MCP servers are governed by Power Platform data policies, and only the streamable transport is supported."
  - "The pages I read contain nothing finance-specific. Treat approvals, ownership and cost controls as your own design work."
faq:
  - q: "Can Claude connect to Power Platform through MCP?"
    a: "Microsoft Learn's Dataverse MCP page lists non-Microsoft clients such as Claude desktop and Claude Code among supported clients. An admin must first enable and configure the MCP server and allowed clients for the Power Platform environment. The server URL has the form https://{dataverseOrgName}.crm.dynamics.com/api/mcp."
  - q: "Is there an official Power Automate MCP server?"
    a: "I found no Learn page that documents a dedicated server for Power Automate flows. A community thread answer said the same and said MCP integration was listed in the 2026 release wave 1 plan but not fully released. That is a community statement, not Microsoft documentation. Microsoft's power-platform-skills repository does ship a Power Automate plugin with a FlowAgent MCP server."
  - q: "Does using Dataverse MCP from Claude cost money?"
    a: "Learn says that since December 15, 2025, Dataverse MCP tools are charged when accessed by AI agents built outside Copilot Studio. Users with Dynamics 365 Premium licenses or a Microsoft 365 Copilot user subscription license are not charged for accessing Dynamics 365 data. search_data uses the Tenant graph grounding rate, and other tools use 10 response Copilot credits."
  - q: "How do data policies apply to MCP in Copilot Studio?"
    a: "Learn says access to MCP servers relies on Power Platform connectors. If a data policy regulates Power Platform connectors, it also regulates the MCP server and its tools for your agent. Admins configure data policies in the Power Platform admin center."
  - q: "What should finance teams check before enabling this?"
    a: "The pages I read give no finance guidance, so this is a checklist drawn from what they do say: who enables the MCP server, which tools are allow-listed, whose credentials run the flow, whether unattended runs are billed, and whether flows have an owner that is not an individual user."
---

Claude can reach Power Platform data through MCP, and a Microsoft plugin lets Claude Code build and debug Power Automate cloud flows. The documented paths are narrower than the headlines suggest, and none of the Microsoft pages I read are written for finance. This article sets out what is documented, what is not, and which governance questions a finance team should settle first.

## The documented paths

**1. Dataverse MCP server, with Claude as the client.** Microsoft Learn says Dataverse can act as an MCP server and lists Microsoft Copilot Studio, GitHub Copilot in VS Code and Copilot CLI, and non-Microsoft clients such as Claude desktop and Claude Code. The server must first be enabled and configured, with allowed clients, for the Power Platform environment. That is an admin task.

The page lists tools such as `search_data`, `read_query`, `create_record`, `update_record` and `describe`. It says `delete_record` and `delete_table` run only after explicit user approval. A tool surface change renamed some tools, so allow or deny lists by tool name need an update.

**2. Power Automate plugin for Claude Code.** Microsoft's power-platform-skills repository describes a Power Automate plugin that lets you build, edit, run and debug cloud flows. It runs a FlowAgent MCP server locally over stdio, with more than 50 tools. Supported clients are GitHub Copilot CLI and Claude Code. Prerequisites listed: Node.js 18 or later and Azure CLI with `az login`. Install commands: `/plugin marketplace add microsoft/power-platform-skills` and `/plugin install power-automate@power-platform-skills`.

The README describes local telemetry logs, with session logs pruned after 14 days and a separate FlowAgent log that is not pruned automatically. It does not state a preview status or known limitations.

**3. MCP tools inside a Copilot Studio agent.** This is the other direction: an agent calls an MCP server. On the agent's **Tools** page, select **Add a tool**, then **New tool**, then **Model Context Protocol**. Enter a server name, description and URL, choose **None**, **API key** or **OAuth 2.0**, then select **Create** and add it to the agent. Only the streamable transport is supported, and SSE isn't supported after August 2025.

## What is not documented

I found no Learn page for a dedicated Power Automate flows MCP server. A Power Platform community thread, where Super Users answered a question about Claude and Power Automate, said "there is no specific Power Automate flows MCP server in public docs yet" and that MCP integration for Power Automate was listed in the 2026 release wave 1 plan but not fully released. Those are community replies, not Microsoft statements, and the thread was still under moderator review when I read it.

The same thread described calling the Anthropic API from a flow with an HTTP action or a community-maintained connector. That is an unofficial pattern. Check licensing and the connector's maintainer before using it for anything that touches financial data.

## Governance questions to settle first

| Question | What the documentation gives you |
|---|---|
| Who may connect a client? | The Dataverse MCP server needs admin enablement per environment, with allowed clients |
| Which operations can run? | Tools are listed, and deletes need explicit approval. Learn's training path mentions allow-listed tools |
| Whose credentials run the flow? | Local plugin: it signs in through Azure CLI (`az login`). The pages read do not say whose credentials Copilot Studio flows use |
| Who owns production flows? | Learn's resilient flows module recommends a Microsoft Entra ID service principal for ownership instead of individual user accounts |
| What does it cost? | Dataverse MCP tools used by agents outside Copilot Studio are charged. Agent flow actions consume Copilot Studio capacity. When prepaid capacity runs out, new runs are blocked, but Microsoft 365 Copilot licensed users and test runs are not affected |
| How do data policies apply? | In Copilot Studio, a data policy on connectors also governs the MCP server and its tools |

## Human review in the flow

Agent flows can include human-in-the-loop actions, such as approval requests or information requests, according to the agent flows overview. For any step that moves or changes money-related records, keep a human approval step in the design. The pages I read do not prescribe a pattern for this. It is a design choice, not a Microsoft rule.

## A cautious rollout

1. Start in a non-production environment with test data.
2. Ask the admin to enable the Dataverse MCP server only there, with the one client you intend to use.
3. Review the tool list and decide which tools stay available.
4. Use a service principal as owner for flows that will go live.
5. Check billing rules before running anything unattended.

## Reading the headlines carefully

Vendor and community posts often blur three different things: Claude calling Power Platform (a client reaching Dataverse or a plugin driving flows), a flow calling Claude (an HTTP call or a connector), and an agent in Copilot Studio calling an MCP server. Each has a different owner, credential and billing path. Before you approve any of them, write down which direction the call goes and who pays for it. For finance teams, that single question often settles whether a pilot can proceed.

## Common mistakes

- Assuming an official Power Automate MCP server exists because plugins and community servers do.
- Giving a coding agent an interactive credential and leaving it to run flows.
- Forgetting that agent flow actions consume Copilot Studio capacity and that Dataverse MCP tools used by agents built outside Copilot Studio are charged.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [MCP](https://www.m365.fm/entity/mcp/)
- [Dataverse MCP server](https://www.m365.fm/entity/dataverse-mcp-server/)
- [Claude](https://www.m365.fm/entity/claude/)

## Sources

- [Dataverse MCP server (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp)
- [Connect an agent to an existing MCP server (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent)
- [Power Automate plugin, microsoft/power-platform-skills (GitHub)](https://github.com/microsoft/power-platform-skills/blob/main/plugins/power-automate/README.md)
- [Build automation and agent integrations learning path (Microsoft Learn)](https://learn.microsoft.com/en-us/training/paths/build-automation-agent-integrations/)
- [Agent flows overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
- [Claude Power Automate API and MCP server thread (Power Platform Community)](https://community.powerplatform.com/forums/thread/details/?threadid=277f249c-c564-f111-a826-000d3a5747e9)
