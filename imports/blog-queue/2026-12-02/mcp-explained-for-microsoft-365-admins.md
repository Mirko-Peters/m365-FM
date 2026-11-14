---
title: "MCP Explained for Microsoft 365 Admins: What It Is and Where Microsoft Uses It"
summary: "Model Context Protocol (MCP) in plain terms for Microsoft 365 admins: what an MCP server is, how Copilot Studio, Work IQ and Agent 365 use it, and where to find and block tools in the admin center."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [mcp, copilot-studio, agent-365, microsoft-365-admin-center]
keypoints:
  - "Microsoft describes MCP servers as standardized servers that expose tools and resources an agent can dynamically discover and use."
  - "Copilot Studio connects agents to MCP servers. It currently supports tools and resources, not prompts, and needs generative orchestration turned on."
  - "Work IQ MCP is a single MCP endpoint for Microsoft 365 data. It is generally available as part of the Work IQ API, while the Copilot Studio integration is in preview."
  - "Admins find registered MCP servers under Agents > Tools > Registry in the Microsoft 365 admin center and can block or unblock tools."
  - "Microsoft's older per-workload Microsoft 365 MCP servers are marked preview and backward compatibility only."
faq:
  - q: "What is MCP in simple terms?"
    a: "Microsoft's admin center documentation says MCP servers are standardized servers that expose tools and resources an agent can dynamically discover and use. The Copilot Studio blog describes MCP as a way to connect to existing knowledge servers and APIs directly from Copilot Studio."
  - q: "Where does Microsoft use MCP?"
    a: "Microsoft Learn describes MCP in Copilot Studio, in Work IQ MCP for Microsoft 365 data, and in Agent 365 tooling servers. The Agent 365 overview also lists other Microsoft-hosted servers such as Windows 365 for Agents and Microsoft Dataverse as examples."
  - q: "Can admins block an MCP server?"
    a: "Yes. According to Microsoft Learn, in the Microsoft 365 admin center under Agents > Tools > Registry, a Block action prevents agents or workflows from using the selected tool, and Unblock restores access."
  - q: "Does Copilot Studio support every MCP feature?"
    a: "No. Microsoft Learn states that MCP servers can publish resources, tools and prompts, but Copilot Studio currently supports tools and resources only."
  - q: "Is Work IQ MCP generally available?"
    a: "The Agent 365 tooling servers overview says Work IQ MCP is generally available as part of the Work IQ API. It says the Work IQ integration in Copilot Studio is in preview and requires an agent powered by the Microsoft Copilot harness."
---

Model Context Protocol, or MCP, is a standard way for an AI agent to discover and call tools and data sources. Microsoft's admin documentation defines MCP servers as standardized servers that expose tools and resources an agent can dynamically discover and use. For a Microsoft 365 admin, the practical questions are where agents get MCP tools, which servers Microsoft provides, and where to approve or block them. This guide answers those with Microsoft documentation only.

## What MCP means in Microsoft documentation

The Microsoft 365 admin center article on tools for agents describes MCP servers in one sentence, as above. The Copilot Studio documentation adds detail. An MCP server can publish three kinds of components:

- **Resources:** file-like data that gives context.
- **Tools:** functions a model can call.
- **Prompts:** predefined templates.

Copilot Studio currently supports tools and resources only, according to Microsoft Learn. Each tool or resource that a connected server publishes becomes available in Copilot Studio automatically, with name, description, inputs and outputs supplied by the server. Changes on the server, such as updated or removed tools, are reflected dynamically.

The March 2025 Copilot Studio blog puts it in maker terms: MCP lets makers connect to existing knowledge servers and APIs directly from Copilot Studio.

## Where Microsoft uses MCP

### Copilot Studio

Per Microsoft Learn, the flow is: use the MCP onboarding wizard to connect an agent to an existing server, or create an MCP server if you have none, add the server's tools and resources to the agent, and optionally publish your MCP connector through the custom connector certification process for use across tenants. Generative orchestration must be turned on, and the page applies to agents that use the standard harness. Microsoft also states that using a non-Microsoft product, including an external MCP server, makes you responsible for the tools and resources you access.

The 2025 blog notes that MCP servers use connector infrastructure, which supports Virtual Network integration, Data Loss Prevention controls and multiple authentication methods. It gives these as part of the original announcement, so check the current Learn pages for today's details.

### Work IQ

Work IQ is described as an intelligence layer that grounds Microsoft Copilot and agents in shared context across the organization. In Copilot Studio, the **Work IQ** tool is how an agent connects to the unified Microsoft 365 tool surface. To add it, open the agent, go to the **Build** tab, select **Work IQ** under **Tools**, create or review a connection, choose the workloads under **Sources** and select **Done**. Workloads include SharePoint, OneDrive, Outlook mail, Teams, Calendar and People. Preview workloads need **Enable preview workloads** under **Settings > Work IQ**.

The Learn page states that billing is usage-based through Copilot Credits, that write operations are on by default subject to organizational permissions and policies, and that workload selection does not override permissions.

### Agent 365 tooling servers

The Agent 365 tooling servers overview lists:

| Server group | Status as stated by Microsoft |
|---|---|
| Work IQ MCP, a single endpoint with 10 generic tools | Generally available as part of the Work IQ API |
| Work IQ in Copilot Studio | Preview, needs an agent on the Microsoft Copilot harness |
| Legacy Microsoft 365 workload servers (Copilot, Calendar, Mail, SharePoint, OneDrive, Teams, User, Word) | Preview, backward compatibility only, not for production or new projects |
| Other Microsoft-hosted servers, for example Windows 365 for Agents, Fabric IQ Ontology, Microsoft Dataverse | Listed as examples, not a complete list |
| Custom and third-party servers | Registered through the bring-your-own process |

The page says availability varies by tenant, region, rollout status, licensing, administrator approval and organizational policy. It does not describe licensing requirements, and it notes Microsoft MCP server certification is in preview.

## How admins manage MCP servers

In the Microsoft 365 admin center, go to **Agents > Tools > Registry**. The **Registry** tab lists the tools in your tenant, and the **Requests** tab is where user requests for tools are reviewed. Microsoft documents these controls:

- **Block** prevents agents or workflows from using a selected tool. **Unblock** restores access.
- Filter by **Status** (Available or Blocked) and **Publisher** (Microsoft or other providers).
- Columns show Name, Status, Type (for example, MCP Server) and Publisher.

The Agent 365 overview says the Tools registry is the source of truth for the servers available in a tenant, and that for supported servers admins can control individual tools. It points to separate articles for managing plugins, skills and MCP servers, the Tools Gateway and bring-your-own MCP servers. The Tools page article does not name required admin roles. The Work IQ page notes that the ability to allow or disallow tooling and MCP servers in the admin center may not be available in every region.

## Admin checklist

1. Open **Agents > Tools > Registry** and review which MCP servers exist and who publishes them.
2. Decide who can request new tools, and review the **Requests** tab regularly.
3. Block legacy preview servers if they are not needed, since Microsoft says not to use them in production.
4. For Copilot Studio agents, review Data Loss Prevention and connector policies in the Power Platform admin center. The MCP overview page itself does not describe DLP, so confirm the current rules there.
5. Treat external MCP servers as third-party software, as Microsoft's responsibility note says.

## What is not documented

The pages read do not explain the underlying protocol in depth, and the Agent 365 overview does not define MCP. They also do not list admin roles for registry actions. For protocol details, use the MCP specification itself.

## Related

- [Model Context Protocol (MCP)](https://www.m365.fm/entity/mcp/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft Agent 365](https://www.m365.fm/entity/agent-365/)
- [Work IQ](https://www.m365.fm/entity/work-iq/)

## Sources

- [Microsoft Learn: Manage tools for agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-tools-for-agent)
- [Microsoft Learn: Extend your agent with Model Context Protocol (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp)
- [Microsoft Learn: Work IQ MCP overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/use-work-iq)
- [Microsoft Learn: Agent 365 tooling servers overview](https://learn.microsoft.com/en-us/microsoft-agent-365/tooling-servers-overview)
- [Microsoft Copilot Blog: Introducing Model Context Protocol (MCP) in Copilot Studio](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/introducing-model-context-protocol-mcp-in-copilot-studio-simplified-integration-with-ai-apps-and-agents/)
