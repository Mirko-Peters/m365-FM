---
title: "Connect an MCP Server to a Copilot Studio Agent: Wizard, Authentication and Limits"
summary: "Add an existing Model Context Protocol server to a Copilot Studio agent with the onboarding wizard or a custom connector: Streamable transport, authentication options, the SSE retirement and the data policy behavior documented on Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [copilot-studio, mcp]
keypoints:
  - "Copilot Studio supports the Streamable transport type. It no longer supports SSE for MCP after August 2025."
  - "Use the agent's Tools page, Add a tool, New tool, then Model Context Protocol. Enter server name, description and URL, then choose the authentication."
  - "Authentication options are None, API key and OAuth 2.0, with Dynamic discovery, Dynamic or Manual for OAuth."
  - "The alternative is a custom connector in Power Apps, imported from an OpenAPI file that carries the x-ms-agentic-protocol value mcp-streamable-1.0."
  - "If a data policy regulates connectors, it also regulates the MCP server and its tools for your agent."
faq:
  - q: "Which MCP transport does Copilot Studio support?"
    a: "According to Microsoft Learn, the Streamable transport type. The page says SSE is deprecated and Copilot Studio no longer supports SSE for MCP after August 2025."
  - q: "Where do I add the server?"
    a: "On the agent's Tools page, select Add a tool, then New tool, and under Create new select Model Context Protocol."
  - q: "Which authentication options exist?"
    a: "None, API key (a header or query parameter) and OAuth 2.0 with three types: Dynamic discovery, Dynamic and Manual. For Manual you add the callback URL that appears to your identity provider app registration, and for Dynamic you do the same if one appears."
  - q: "Do data policies apply to MCP servers?"
    a: "Yes. Learn says access to MCP servers relies on Power Platform connectors, so a data policy that regulates connectors also regulates the MCP server and its tools for your agent."
  - q: "Does the page describe tool approval or limits?"
    a: "No. The page does not cover tool approval settings, numeric limits such as tool counts or rate limits, or licensing requirements."
---

To connect an existing Model Context Protocol (MCP) server to a Copilot Studio agent, use the MCP onboarding wizard on the agent's Tools page, or import a custom connector from an OpenAPI file in Power Apps. This guide follows the Microsoft Learn page on adding an existing MCP server to an agent.

## Scope and prerequisites

The page applies to agents and agent flows powered by the standard harness. You need an existing MCP server. If you do not have one, the page links to creating a new one. As an alternative, a server can be registered in Agents 365 with the Agents 365 CLI and the Microsoft 365 admin center, described as bring your own MCP server. Once registered and approved it becomes available in Copilot Studio.

## Transport

Copilot Studio supports the **Streamable** transport type. The page says that because SSE transport is deprecated, Copilot Studio no longer supports SSE for MCP after August 2025. If your server still uses SSE, my advice is to plan a change before you connect.

## Option 1: the onboarding wizard

1. Go to the agent's **Tools** page, select **Add a tool**, then **New tool**.
2. Under **Create new**, select **Model Context Protocol**.
3. Enter the **Server name**, **Server description** and **Server URL**. The orchestrator uses the description to decide when to call the server, so write it clearly.
4. Choose authentication: **None**, **API key** or **OAuth 2.0**.
5. Select **Create** to open the **Add tool** dialog.
6. Select **Create a new connection** or use an existing one, then **Add to agent**.

### Authentication choices

- **API key:** choose a **Type** of **Header** or **Query** and enter the name. The user of the agent provides the key.
- **OAuth 2.0, Dynamic discovery:** for servers that support dynamic client registration with discovery. The page calls it the simplest method.
- **OAuth 2.0, Dynamic:** for servers with dynamic client registration but no discovery. You enter the **Authorization URL** and **Token URL template**. Depending on the configuration, a callback URL might appear.
- **OAuth 2.0, Manual:** you enter **Client ID**, **Client secret**, **Authorization URL**, **Token URL template**, **Refresh URL** and optionally **Scopes**, separated by spaces.

For Manual, a callback URL appears. For Dynamic, one might appear. Copy it and add it to your application's registration with your identity provider.

## Option 2: a custom connector

1. Go to **Tools** > **Add a tool** > **New tool**.
2. Select **Custom connector**, which opens Power Apps.
3. Select **New custom connector** > **Import OpenAPI file**, choose your schema file, then **Import** and **Continue**.

You need an OpenAPI YAML schema for your server. The page's sample sets `x-ms-agentic-protocol: mcp-streamable-1.0` on a `/mcp` POST path with the `operationId` `InvokeMCP`. To edit a connection later, open **Custom connectors** in the Power Apps or Power Automate portal.

## What an MCP server can provide

A second Learn page on MCP in Copilot Studio describes three capabilities of an MCP server. **Resources** are file-like data the agent can read for more context, such as API responses or file contents. **Tools** are functions a language model can call to perform an action. **Prompts** are predefined prompt templates. The same page says Copilot Studio currently supports MCP tools and resources. It does not say that prompts are supported.

Each tool or resource that a connected server publishes is automatically available in Copilot Studio, and the server provides the name, description, inputs and outputs. When you update or remove tools and resources on the server, Copilot Studio dynamically reflects these changes.

## Requirements and responsibility

You must turn on generative orchestration to use MCP. You can optionally publish your MCP connector to allow cross-tenant use. The page also says that when you connect to a non-Microsoft product, including an external MCP server, you are responsible for the tools and resources you access from within Copilot Studio. Review a third-party server before you add it, which is a suggestion and not from the page.

## Data policies

Access to MCP servers relies on Power Platform connectors. If a data policy regulates connectors, it also regulates the MCP server and its tools for your agent. Check your data policies before you blame the server if a connection is blocked, which is a suggestion and not a Microsoft statement.

## Not covered

The pages I read do not describe tool approval, numeric limits, billing, licensing, tool naming rules or server-side requirements beyond the sample schema.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [MCP](https://www.m365.fm/entity/mcp/)

## Sources

- [Connect your agent to an existing Model Context Protocol (MCP) server (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/mcp-add-existing-server-to-agent)
- [Extend your agent with Model Context Protocol (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/agent-extend-action-mcp)
