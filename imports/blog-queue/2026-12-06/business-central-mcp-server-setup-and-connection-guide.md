---
title: "Business Central MCP Server: What It Is, How to Configure It and Connect Clients"
summary: "The Business Central MCP server explained: what it exposes, how admins create a configuration, which clients connect, the mcp.json for VS Code, authentication, limits and the planned pricing notice."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [dynamics-365-business-central, mcp, github-copilot, copilot-studio]
keypoints:
  - "The Business Central MCP server exposes Business Central data and actions to MCP-compliant AI clients, always under the signed-in user's own permissions."
  - "By default it gives read-only dynamic discovery of API pages and queries. Admins add API tools, dynamic tool mode and, in preview, data query tools."
  - "Configure it on the page Model Context Protocol (MCP) Server Configurations. You need at least the MCP - Admin permission set."
  - "The endpoint is https://mcp.businesscentral.dynamics.com. Headers TenantId, EnvironmentName and Company are optional for VS Code."
  - "Microsoft says it plans to introduce charges for Business Central MCP tools. Details are not announced on the pages read."
faq:
  - q: "What does the Business Central MCP server do?"
    a: "According to Microsoft Learn, it implements the Model Context Protocol and exposes Business Central data and functionality to MCP-compliant AI clients. Agents can view and manage records, run business process actions and, with the preview data query tools, run read-only database queries."
  - q: "Which permission do I need to configure it?"
    a: "Microsoft Learn says you need at least the MCP - Admin permission set or equivalent permissions. You then create configurations on the Model Context Protocol (MCP) Server Configurations page."
  - q: "Can an agent change data by default?"
    a: "No. Microsoft Learn says the default configuration is read-only dynamic discovery. To allow create, modify, delete or action operations, an admin turns on Unblock Edit Tools and sets the Allow Create, Modify, Delete and Actions permissions per API."
  - q: "Which clients can connect?"
    a: "Microsoft Learn lists Visual Studio Code with GitHub Copilot, Copilot Studio and GitHub Copilot CLI, plus other MCP-compliant clients such as Claude, ChatGPT and MCP Inspector. Non-Microsoft clients must register their own application."
  - q: "Is the MCP server free?"
    a: "The overview page says Microsoft plans to introduce charges for Business Central MCP tools and that pricing, affected tools and rollout will be announced later. Current availability and usage guidance are unchanged on that page."
---
The Business Central MCP server lets AI clients such as GitHub Copilot in VS Code or a Copilot Studio agent work with Business Central through the Model Context Protocol. An admin decides which API objects an agent can use. The agent then acts under the signed-in user's identity and permissions. This article covers what the server exposes, how to configure it and how to connect a client.

## What it is and what it exposes

Microsoft Learn describes the server as an implementation of MCP, an open standard for how AI applications talk to data sources and tools. It applies to Business Central online. It exposes Business Central data and logic so users can work with them conversationally.

The default configuration offers dynamic discovery tools with read-only API access. Agents can find API pages and API queries that the signed-in user has permission to use. Admins can enable more **Server Features**:

- **API Tools:** choose the API pages and queries agents can use, with read, create, modify, delete and action operations.
- **Dynamic Tool Mode:** agents discover tools at runtime instead of each tool being configured by hand. Useful with many API objects.
- **Data Query Tools (Preview):** read-only queries against the Business Central database.

Typical agent actions include viewing and managing customers, items and sales orders, posting documents and running actions. What an agent can do depends on the enabled features and on permissions for each API.

## Create a configuration

You need at least the **MCP - Admin** permission set.

1. Search for **Model Context Protocol (MCP) Server Configurations** and open it.
2. Select **New** and enter a **Name** and **Description**. The name appears in Copilot Studio when you assign the configuration to an agent.
3. Leave **Active** off while you configure. An active configuration is read-only.
4. Turn on **Unblock Edit Tools** only if agents may create, update, delete or run actions.
5. Under **Server Features**, activate **API Tools**, and optionally **Dynamic Tool Mode** and **Data Query Tools (Preview)**.
6. Under **Available APIs**, add API objects by type, ID and version, select **Add All Standard APIs**, or select **Add APIs by API Group**. Set **Allow Read**, **Allow Create**, **Allow Modify**, **Allow Delete** and **Allow Actions** per object.
7. Select **Validate** to check for missing API objects, missing parent pages and Allow Modify without Allow Read.
8. Turn **Active** on.

Notes from the page: API queries are read-only, only top-level API pages work (not `ListPart` or `CardPart` subtypes), and disabling API Tools also turns off Dynamic Tool Mode. **Discover Read-Only Objects** is off by default. When on, agents get read-only access to eligible objects even if you did not add them.

Under **Advanced** you can export or import a configuration as JSON and copy a connection string. A configuration can be set as the default, and the built-in default has a blank name.

## Connect VS Code with GitHub Copilot

1. In VS Code press `Ctrl`+`Shift`+`P` and select **MCP: Open User Configuration**.
2. Add the server inside `"servers"` in `mcp.json`.
3. Select **Start** above the server entry until the status is `Running`.
4. Open GitHub Copilot Chat in Agent mode and try a prompt such as "list my customers".

The minimal entry from Microsoft Learn uses only the URL and type:

```json
{
  "servers": {
    "businesscentral": {
      "url": "https://mcp.businesscentral.dynamics.com",
      "type": "http"
    }
  }
}
```

To pin a tenant, environment, company or configuration, add a `headers` object with `TenantId`, `EnvironmentName`, `Company` and `ConfigurationName`. Only `ConfigurationName` is always optional. VS Code with GitHub Copilot can omit all four. GitHub Copilot CLI can omit `TenantId` and `Company`. Copilot Studio does not require `TenantId` but needs `EnvironmentName` and `Company`. Non-ASCII values must be Base64-encoded in the form `=?base64?<value>?=`.

## Authentication and security

The server follows the MCP authorization specification with OAuth 2.0 Authorization Code flow with PKCE, using Microsoft Entra ID. All operations run under the user's own identity, so audit trails show who did what. VS Code and Copilot Studio use a preregistered application. Other clients must register their own.

Microsoft's release plan page for the enhanced server adds telemetry for configuration lifecycle events and MCP calls, and a Microsoft Purview audit trail for configuration changes. That page is archived as of October 2026 and gives general availability as April 1, 2026.

## Limits and cost

- Copilot Studio has a 70-tool limit. Dynamic Tool Mode helps when you have many API objects.
- Data Query Tools are in preview and may change.
- The overview page gives no numeric rate limits or quotas.
- Microsoft plans to introduce charges for Business Central MCP tools. Pricing and rollout are not given.

## Common mistakes

- Giving write access before testing read-only behavior.
- Forgetting that the user also needs Business Central permissions for each API.
- Editing an active configuration without turning **Active** off first.
- Using more than 70 tools in Copilot Studio without Dynamic Tool Mode.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)
- [GitHub Copilot](https://www.m365.fm/entity/github-copilot/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)

## Sources

- [Business Central MCP server overview](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/ai/mcp-overview)
- [Configure the Business Central MCP server](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/ai/configure-mcp-server)
- [Use the MCP server in Visual Studio Code](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/ai/use-mcp-server-in-vscode)
- [Enhanced MCP server, 2026 release wave 1](https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/smb/dynamics365-business-central/create-agentic-experiences-enhanced-mcp-server)
