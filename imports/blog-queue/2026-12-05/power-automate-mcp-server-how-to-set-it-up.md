---
title: "Power Automate MCP Server: How to Set It Up and What to Check"
summary: "The Power Automate plugin from Microsoft's power-platform-skills repository connects Claude Code or GitHub Copilot CLI to flows through a FlowAgent MCP server. Setup steps, prerequisites and source gaps."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [power-automate, mcp, claude-code, governance]
keypoints:
  - "Microsoft's power-platform-skills repository contains a Power Automate plugin for GitHub Copilot CLI and Claude Code, powered by the FlowAgent MCP server."
  - "Install it with two commands, /plugin marketplace add and /plugin install power-automate@power-platform-skills."
  - "It needs Node.js 18 or newer and an Azure CLI sign-in with az login."
  - "The README lists flows, runs, connections, authoring and desktop flow capabilities, and says nothing about limitations or support status."
  - "Microsoft Learn has no single Power Automate MCP server setup page that I could find, so treat this as thin documentation and test in a non-production environment."
faq:
  - q: "Is there an official Power Automate MCP server?"
    a: "Microsoft publishes a Power Automate plugin in its power-platform-skills GitHub repository. According to its README, the plugin is powered by the FlowAgent MCP server, bundled as a self-contained engine. I could not find a separate Microsoft Learn setup page for a Power Automate MCP server, and the README states no support or preview status."
  - q: "What do I need to install it?"
    a: "The README lists Node.js 18 or newer and the Azure CLI signed in with az login. The setup skill of the plugin covers first-time prerequisite setup. The host must be GitHub Copilot CLI or Claude Code."
  - q: "How do I install the plugin?"
    a: "In a GitHub Copilot CLI or Claude Code session, run /plugin marketplace add microsoft/power-platform-skills, then /plugin install power-automate@power-platform-skills. The README says the engine runs offline with no npm install or remote host."
  - q: "What can the plugin do with flows?"
    a: "The README lists listing, getting, creating, editing at action level, copying within or across environments, updating, publishing, disabling and deleting flows. It also lists run history, loop iteration drill-down, cancel and resubmit, connection management and expression help."
  - q: "Does it collect telemetry?"
    a: "The README says plugin session logs are written under ~/.power-platform-skills/telemetry/power-automate/sessions/ and pruned after 14 days. The FlowAgent engine writes to ~/.flowagent/telemetry.jsonl, which is not pruned automatically, and the path can be changed with FLOWAGENT_TELEMETRY_LOG."
---

For Power Automate, the setup route Microsoft documents is a plugin, not a hosted MCP endpoint. The Power Automate plugin in Microsoft's power-platform-skills GitHub repository connects GitHub Copilot CLI or Claude Code to cloud flows through a bundled MCP server called FlowAgent. The steps are short. The documentation is also thin, so the sections below mark what is stated and what is not.

Note on sources: I did not find a Microsoft Learn page that describes a Power Automate MCP server as a product. The facts here come from the plugin's README in Microsoft's GitHub repository. Microsoft Learn pages on neighboring topics are named where they apply.

## What the plugin is

According to the README, it is a plugin for building, editing, running and debugging Power Automate cloud flows from GitHub Copilot CLI or Claude Code. It is powered by the FlowAgent MCP server, bundled as a self-contained engine. The server is described as a single stdio-transport bundle with more than 50 tools.

## Prerequisites

- **Node.js 18 or newer.** The engine needs only Node, with no npx or npm package.
- **Azure CLI**, signed in with `az login`, for authentication.
- **A host:** GitHub Copilot CLI or Claude Code.

The plugin's `setup` skill covers first-time prerequisite setup.

## Install

1. In a GitHub Copilot CLI or Claude Code session, run:
   `/plugin marketplace add microsoft/power-platform-skills`
2. Then run:
   `/plugin install power-automate@power-platform-skills`

The README says it runs offline, with no remote host required. Authentication uses `az login` plus MSAL for connectivity endpoints. Details sit in `references/connection-patterns.md` inside the plugin folder, which I did not read.

## What it can do

| Area | Capabilities listed in the README |
|---|---|
| Flows | List, get, create, edit at action level, copy within or across environments, update, publish, disable, delete |
| Runs | History, details, actions, loop iteration drill-down, cancel, cancel all, resubmit, diagnose |
| Connections | Create, read, update, delete, fix, auto-discovery, dynamic value resolution |
| Authoring | Templates, scaffolding, batch deploy, preflight validation, expression help |
| Other | Desktop (RPA) flows and environment routing |

The plugin ships skills such as `browse-flows`, `create-flow`, `build-flow`, `debug-flow`, `diagnose-flow`, `manage-flows`, `manage-desktop-flows` and `route-environments`. Skills with "build" and "diagnose" in the name are described as autonomous.

## What the README does not say

- It lists no limitations.
- It has no dedicated security section.
- It states no preview or support status.

Because of that, review carefully before using it on production flows. The only security points stated are the use of local `az login` authentication and the telemetry controls. Telemetry logs go to `~/.power-platform-skills/telemetry/power-automate/sessions/`, pruned after 14 days, and the engine writes `~/.flowagent/telemetry.jsonl`, which is not pruned automatically.

## Safe first steps

1. Use a development environment with test flows, not production.
2. Sign in with an account that has only the roles needed for that environment.
3. Start with read actions: browse flows and read run history.
4. Review any edit the agent proposes before you publish.
5. Check the telemetry files and decide whether they may stay on the machine.

These are cautious practices, not requirements from the README.

## Other Microsoft MCP options around flows

Two Microsoft Learn pages cover related MCP scenarios. They are not the same as the plugin above.

- **Copilot Studio.** Learn explains how to add an MCP server to an agent: open the agent's **Tools** page, select **Add a tool**, select **Model Context Protocol**, choose a connector, authorize and select **Add and configure**. Access relies on Power Platform connectors, so a data policy on connectors also governs MCP access. The page does not describe any role for Power Automate flows.
- **Process Mining MCP server (preview).** Learn documents a server that exposes Process Mining analytics to MCP clients such as Copilot Studio, through the Process Mining connector. It lists nine tools, needs an active Process Mining license and uses Azure AD authentication.

## Control which tools an agent can use in Copilot Studio

If the goal is to give a Copilot Studio agent MCP tools rather than to use the plugin, Learn adds details worth knowing. MCP is described as an open protocol that exposes resources, tools and prompts, and Copilot Studio supports tools and resources. Generative orchestration must be turned on. After adding an MCP server, all tools are enabled by default through the **Allow all** toggle. To limit the agent, turn **Allow all** off, switch off the tools it does not need, then select **Save** and **Publish**. With **Allow all** off, tools added to the server later are disabled by default. The page also says that when you connect to a non-Microsoft MCP server, you are responsible for the tools and resources you access.

## Typical mistakes

- Looking for a remote MCP endpoint URL. The plugin runs locally.
- Skipping `az login`, then reading authentication errors as a plugin bug.
- Giving the agent production access before testing in a development environment.
- Assuming the plugin has the same support terms as a Microsoft Learn documented feature. The README does not state them.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)
- [Claude Code](https://www.m365.fm/entity/claude-code/)
- [Governance](https://www.m365.fm/entity/governance/)

## Sources

- [Power Automate plugin README (microsoft/power-platform-skills on GitHub)](https://github.com/microsoft/power-platform-skills/blob/main/plugins/power-automate/README.md)
- [Add tools and resources from an MCP server to your agent (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-components-to-agent)
- [Process Mining MCP server reference (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/process-mining-mcp-server-reference)
