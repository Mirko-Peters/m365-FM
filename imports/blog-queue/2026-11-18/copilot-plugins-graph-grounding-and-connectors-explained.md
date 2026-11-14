---
title: "Copilot Plugins, Graph Grounding and Copilot Studio Connectors Explained"
summary: "What plugins, API plugins, grounding through Microsoft Graph, Copilot connectors and Copilot Studio connectors each mean in Microsoft 365 Copilot, how they differ, and which one to use for which job."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [copilot, copilot-connectors, api-plugins, copilot-studio, copilot-grounding]
keypoints:
  - "Microsoft now uses plugin for an installable package that can bundle a declarative agent, a skill, a Copilot connector and an MCP integration."
  - "MCP and API plugins are custom actions for declarative agents. They are not enabled as standalone experiences in Microsoft 365 Copilot."
  - "Grounding means the data a response is based on: the public web and, for licensed users, organizational data through Microsoft Graph and Work IQ, always scoped by user permissions."
  - "Copilot connectors bring external data in as synced (indexed into Microsoft Graph) or federated (fetched live over MCP) content."
  - "Copilot Studio connectors are Power Platform connectors that agents use as tools or actions. Standard ones are in all plans, premium ones only in select plans."
faq:
  - q: "What is the difference between a plugin and an API plugin?"
    a: "Microsoft Learn defines a Microsoft 365 Copilot plugin as an installable package that can include a declarative agent, a skill, a Copilot connector and an MCP integration. An API or MCP plugin is narrower: a custom action that lets a declarative agent call a REST API with an OpenAPI description or an MCP server."
  - q: "What does grounding mean in Microsoft 365 Copilot?"
    a: "Microsoft Learn uses grounding for the data a response is based on. Copilot is grounded in web and or organizational data, which is Microsoft Graph and Work IQ, and access is scoped by user permissions. The architecture page does not give a separate formal definition."
  - q: "What is the difference between synced and federated Copilot connectors?"
    a: "According to Microsoft Learn, synced connectors ingest and index external content into Microsoft Graph, while federated connectors retrieve content in real time over Model Context Protocol without indexing it. Federated connectors do not support semantic indexing."
  - q: "Do Copilot Studio connectors cost extra?"
    a: "Microsoft Learn says standard connectors are included with all Copilot Studio plans and premium connectors are available in select plans. The page gives no prices and points to the Copilot Studio requirements and licensing article."
  - q: "Can an API plugin run on its own in Copilot Chat?"
    a: "No. Microsoft Learn states that MCP and API plugins are supported as actions within declarative agents and are not enabled as standalone experiences in Microsoft 365 Copilot."
---

These terms overlap, and Microsoft has changed some of them. In short: grounding is where Copilot gets its facts, connectors bring in outside data, API plugins let an agent take actions in other systems, and a plugin is now the installable package that can hold several of these. Copilot Studio connectors are a different thing again: Power Platform connectors used by agents you build in Copilot Studio.

## Grounding: where answers come from

Microsoft Learn says all Copilot experiences are powered by large language models, grounding in web and or organizational data (Microsoft Graph and Work IQ), and access scoped by user permissions. How grounding works depends on the license:

| License | Grounding |
|---|---|
| Copilot Chat (Basic) | Mainly public web. You must provide organizational content with your prompt. |
| Microsoft 365 Copilot (Basic) | Web, unless the user uploads content or uses open content in Teams and Outlook |
| Microsoft 365 Copilot (Premium) | Web and organizational data automatically through Microsoft Graph and Work IQ |

Admins manage web grounding with the **Allow web search in Copilot** policy. Microsoft's privacy page adds that Copilot only surfaces organizational data the user can at least view. Data from Graph connectors can appear in responses if the user has permission to it.

## Copilot connectors: more knowledge

Copilot connectors bring external line-of-business data into Copilot. Microsoft names two models:

- **Synced connectors** ingest and index external content into Microsoft Graph. Semantic indexing helps with matches beyond keywords and with relationships between data points. Citations let users preview the items.
- **Federated connectors** retrieve content in real time over Model Context Protocol (MCP). Nothing is synced or stored in Microsoft Graph, and semantic indexing is not supported.

The synced and federated models also power Microsoft Search, Copilot in Excel and the Researcher agent. A gallery lists more than 100 Microsoft and partner connectors, including Box, Confluence, Salesforce and ServiceNow. For a custom synced connector you can use the Microsoft 365 Agents Toolkit, the connector SDK or the Copilot connector APIs.

For setup, an AI administrator registers an app and grants admin consent for the required Graph permissions in the Microsoft Entra admin center. Deployed connectors are tenant-wide unless external item security is restricted.

## API plugins: actions in other systems

Microsoft Learn describes MCP and API plugins as custom actions that let declarative agents work with MCP servers or REST APIs that have an OpenAPI description. Users can query data and, where the API supports it, create, update or delete it.

Details worth knowing:

- A plugin manifest tells Copilot what the plugin can do.
- Copilot asks before sending data to a plugin for the first time. After that, tools that only read data need no confirmation, and tools that change data do.
- With five or fewer plugins, all are injected into the prompt. With more, semantic matching uses the plugin description.
- Quality might degrade with more than 10 functions or tools.
- API plugins are only supported as actions in declarative agents, not as standalone Copilot features.

## Plugins: the new package term

Microsoft's current plugin overview defines a plugin as an installable package for a specific task. It can include a declarative agent, a skill, a Copilot connector and an MCP integration, and it can use one capability or several. Users may still need approval, installation or connection setup before using a shared plugin. Microsoft points to Microsoft Agent 365 for administering plugins.

The API plugin page itself separates the two: it uses plugin for the technical action a declarative agent calls, and refers readers to the plugin pages for the customer-facing package. Read the term in context.

## Copilot Studio connectors

In Copilot Studio, connectors are Power Platform connectors that act as wrappers around APIs. Categories are prebuilt standard, prebuilt premium and custom connectors. Agents can use them as tools, as actions in agent flows, or as knowledge sources (preview).

To add one at agent level:

1. Select **Agents** and open the agent.
2. Open **Tools** and select **Add a tool**.
3. Select **Connector** and pick the service.
4. Create a connection if needed and select **Add and configure**.

By default the connection uses the user's credentials. To use maker credentials, set **Credentials to use** to **Maker-provided credentials** on the tool's overview page. One limit: single sign-on is not supported for connectors when an agent uses custom Active Directory authentication and is deployed to Teams.

## Which one do you need?

- Copilot should answer from documents or records outside Microsoft 365: use a **Copilot connector**, synced or federated.
- An agent should do something in another system: use an **API or MCP plugin** as an action.
- You build an agent in Copilot Studio and need a SaaS service: use a **Copilot Studio connector**.
- You want to ship several pieces together: package them as a **plugin**.

## Common mistakes

- Expecting an API plugin to appear in Copilot Chat on its own.
- Assuming a connector overrides permissions. Users still need access to see results.
- Mixing up the authentication guidance. Microsoft warns that MCP and API plugin authentication guidance does not automatically apply to Copilot connectors.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot connectors](https://www.m365.fm/entity/copilot-connectors/)
- [API plugins for Microsoft 365 Copilot](https://www.m365.fm/entity/api-plugins/)
- [Grounding (Copilot)](https://www.m365.fm/entity/copilot-grounding/)

## Sources

- [What is a plugin for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/plugins-overview)
- [MCP and API plugins overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-api-plugins)
- [Microsoft 365 Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-copilot-connector)
- [Copilot extensibility ecosystem](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/ecosystem)
- [Microsoft 365 Copilot architecture](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture)
- [Microsoft 365 Copilot privacy and permissions](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy)
- [Connectors in Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-connectors)
