---
title: "Copilot Studio Updates, Database Connections and Getting Started"
summary: "How to start in Copilot Studio, what Microsoft's What's new page lists for 2026, and which options connect an agent to database data: Dataverse tables, Azure SQL and real-time connectors."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [copilot-studio, dataverse, azure-sql-database]
keypoints:
  - "Copilot Studio is a low-code studio at copilotstudio.microsoft.com for building agents and workflows and publishing them to Teams, Microsoft Copilot, websites and mobile apps."
  - "Microsoft's What's new page, last updated 2026-11-12, lists Azure SQL tables (August 2026) and Dataverse tables (September 2026) as knowledge sources."
  - "Dataverse as a knowledge source needs Dataverse search turned on, the Authenticate with Microsoft setting, and permissions to the underlying data."
  - "Real-time connectors as knowledge (preview) query the source at runtime with the user's own token, so source access controls still apply."
  - "The older knowledge source article does not list Azure SQL, so check which documentation and feature status applies to your environment."
faq:
  - q: "Where do I start with Copilot Studio?"
    a: "Microsoft Learn says you use the web app at copilotstudio.microsoft.com with a current browser. You describe the agent in plain language or create a blank agent, then test it before you publish."
  - q: "Can a Copilot Studio agent use data from a database?"
    a: "Yes, in defined ways. Microsoft Learn lists Dataverse tables as a knowledge source, and the What's new page lists Azure SQL tables. Real-time connectors for sources such as Azure SQL are documented as a preview."
  - q: "Do agents respect user permissions on database data?"
    a: "For Dataverse, Microsoft Learn says only Authenticate with Microsoft is supported. For real-time connectors, it says queries run with the user's own authentication token, so source access controls still apply."
  - q: "How many Dataverse tables can I add as knowledge?"
    a: "Microsoft Learn states up to 15 Dataverse tables per knowledge source. It also says updated glossary terms can take up to 15 minutes to become available."
  - q: "Where can I see what changed recently?"
    a: "Microsoft keeps a What's new in Copilot Studio page on Learn. The version read for this article was last updated on 2026-11-12 and lists entries by month, with October 2026 as the newest section."
---

Copilot Studio is Microsoft's low-code studio for building AI agents and workflows. You start at copilotstudio.microsoft.com, create an agent by describing it or by starting blank, add knowledge sources and tools, test it and publish it. Database data reaches an agent through Dataverse tables, Azure SQL tables or real-time connectors, and each route has its own prerequisites.

## What Copilot Studio is

Microsoft Learn describes Copilot Studio as a graphical, low-code studio for building and managing agents and workflows. You connect them to organizational data and systems and publish them to channels such as Microsoft Teams, Microsoft Copilot, websites and mobile apps. Agents can follow instructions, use connected knowledge sources, call tools and work in multiple languages.

The overview also names three harnesses, the engines that run an agent. They affect reasoning, features and billing:

- **GitHub Copilot harness:** reasoning-heavy, multi-step work.
- **Customer Conversation harness:** customer-facing agents over voice and chat, with escalation to a human.
- **Standard harness:** rule-based agents built around topics.

The step-by-step articles cited below apply to the standard harness.

## Getting started in six steps

Based on Microsoft's "Create your first agent" article:

1. **Check access.** You need a Microsoft account with access to Copilot Studio and permission to at least one environment. If you see "You don't have permissions to any environments", create a new environment or ask an administrator.
2. **Sign in** at copilotstudio.microsoft.com. Supported browsers are Microsoft Edge 122+, Chrome 122+, Firefox 127+ or Safari 17+.
3. **Choose how to create.** Describe the agent on the **Home** or **Agents** page (up to 1,024 characters), or create a blank agent. You cannot change the primary language after creation.
4. **Review the Overview page.** If you used a description, the AI generates a name, description and instructions and suggests triggers, knowledge and tools. Select **Add** or **Dismiss** for each. The suggestions do not persist beyond the current session.
5. **Set the basics.** The name can have up to 42 characters. The description can have up to 1,024 characters. Instructions can have up to 8,000 characters. Test after editing instructions, because they change behavior.
6. **Test, then publish.** The first-agent article links to a separate testing article and does not cover publishing. For deployment, it points to the quickstart for creating and deploying an agent.

Copilot Studio configures Microsoft Entra ID authentication automatically. You can also set up single sign-on with Entra ID.

## What changed recently

Microsoft's What's new page was last updated on 2026-11-12 in the version read for this article. Entries are grouped by month. Items relevant to data and knowledge:

| Month | Item |
|---|---|
| October 2026 | Knowledge source controls in the Power Platform admin center (restrict local file uploads, SharePoint and OneDrive, or public websites) |
| October 2026 | OneDrive for Business as a knowledge source, with Microsoft Purview sensitivity label support |
| September 2026 | Dataverse tables as a knowledge source, including a preview of unstructured reasoning over Multiline Text and File columns |
| August 2026 | Azure SQL tables as a knowledge source, for Azure SQL Database or SQL Server |
| August 2026 | Preview: Fabric IQ connection for Microsoft Fabric business data |
| June 2026 | Preview: Foundry IQ connection for a knowledge base built in Azure AI Foundry |

Other October 2026 entries include the Customer Conversation harness (preview), Work IQ (general availability), Copilot Studio MCP and MCP and Agent2Agent channels (preview).

A Microsoft 365 message center post dated August 7, 2026 announced Azure SQL as a knowledge source, with preview planned for August and general availability for September 2026. That post described the status as in development at the time, so verify the current state in your tenant.

## Connecting an agent to database data

### Option 1: Dataverse tables

Steps from Microsoft Learn:

1. Open the agent.
2. Select **Add knowledge** on the **Overview** or **Knowledge** page.
3. Select **Dataverse** and pick your tables. Use the search field to narrow the list.
4. Review the knowledge name and description. A detailed description helps generative orchestration.
5. Optionally add synonyms and glossary terms through **Edit**.
6. Select **Add to agent**.

Prerequisites: Dataverse search is turned on in the environment, authentication is set to **Authenticate with Microsoft**, and you have permissions to the underlying data. Limits: up to 15 tables per knowledge source. Virtual tables are supported only for the Finance and Operations data provider. The multiline text and file search preview can take up to two days to backfill and creates a search index that incurs extra Dataverse capacity costs.

### Option 2: Real-time connectors (preview)

Microsoft documents real-time connectors as a preview. Only metadata such as table and column names is indexed. No data moves between systems. Each question runs against the source at runtime with the user's own token, so source access controls still apply. The connections are created in Power Platform, so the same data policies govern them.

The documented connector list includes Salesforce, ServiceNow, AzureSQL, Azure AI Search, SharePoint, Dataverse, Dynamics 365, Snowflake, Databricks, Zendesk, Confluence (Cloud only), Oracle Database, SAP OData and Google Sheets. It does not list SQL Server. The page says preview documentation is not meant for production use and publishes no quantitative limits.

### Option 3: Azure SQL tables as knowledge

The What's new page lists this feature. The dedicated Learn article could not be loaded for this page, so no setup steps are given here. Community threads on Microsoft Q&A describe users seeing "There was a problem connecting to Azure SQL" with no accepted answer, so test early with a small table.

## A discrepancy to be aware of

The general knowledge sources article read for this page lists five types: public websites, documents, SharePoint, Dataverse and enterprise data using connectors. It does not mention Azure SQL, while the What's new page does. Learn pages are updated at different times, so rely on the newest page and on what you see in your own environment.

## Common mistakes

- **Missing Dataverse search.** If tables cannot be added, ask an administrator to enable it.
- **Wrong authentication mode.** Dataverse supports only Authenticate with Microsoft. No authentication and manual authentication are not supported.
- **Skipping the description.** A vague knowledge description makes it harder for the agent to choose the source.
- **Using preview features in production.** Real-time connectors are documented as preview.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Azure SQL Database](https://www.m365.fm/entity/azure-sql-database/)
- [Copilot Credits](https://www.m365.fm/entity/copilot-credits/)

## Sources

- [Microsoft Learn: What is Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
- [Microsoft Learn: Create your first agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-first-bot)
- [Microsoft Learn: What's new in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new)
- [Microsoft Learn: Knowledge sources overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)
- [Microsoft Learn: Add Dataverse tables as knowledge](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-dataverse)
- [Microsoft Learn: Real-time connectors as knowledge](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-real-time-connectors)
- [Microsoft 365 message center RM568930: Azure SQL knowledge source](https://mc.merill.net/message/RM568930)
- [Microsoft Q&A: Unable to connect Azure SQL database as knowledge](https://learn.microsoft.com/en-us/answers/questions/5655505/unable-to-connect-azure-sql-database-as-knowledge)
