---
title: "Fabric Data Agents: What They Are and How to Set One Up"
summary: "A Fabric data agent answers plain-English questions over lakehouses, warehouses, semantic models and more. Learn prerequisites, setup steps, security behavior and the documented limits."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [fabric-data-agents, fabric, onelake, data-governance]
keypoints:
  - "A Fabric data agent turns plain-English questions into SQL, DAX or KQL and returns answers over data in OneLake. It is generally available."
  - "It needs a paid F2 or higher Fabric capacity, or Power BI Premium P1 or higher, plus a tenant setting for cross-geo processing and storing for AI."
  - "One agent supports up to five data sources, and instructions can hold up to 15,000 characters."
  - "Agents are read-only and use the requesting user's identity, so sharing an agent does not grant access to the underlying data."
  - "Documented limits include English only, no unstructured data, and responses capped at 25 rows and 25 columns."
faq:
  - q: "What is a Fabric data agent?"
    a: "According to Microsoft Learn, it is a generally available Fabric feature for building conversational question and answer systems over data in OneLake using generative AI. Users ask questions in plain English and the agent chooses a source, generates a query and returns a readable result."
  - q: "Which data sources can a data agent use?"
    a: "Microsoft Learn lists warehouses, lakehouses, Power BI semantic models, KQL databases including Eventhouse, mirrored databases, ontologies and Microsoft Graph. A single agent supports up to five data sources in any combination."
  - q: "What do I need before I create a data agent?"
    a: "Learn lists a paid F2 or higher Fabric capacity or a Power BI Premium capacity of P1 or higher with Fabric enabled, the tenant setting for cross-geo processing and cross-geo storing for AI, and at least one supported data source with data that you can read."
  - q: "Can a data agent change my data?"
    a: "No. Microsoft Learn says the agent enforces read-only access. It generates only read queries and does not create, update or delete data, and it does not trigger notebooks or other action workflows."
  - q: "Does sharing a data agent give colleagues access to the data?"
    a: "Learn says agents use the requesting user's identity and permissions, and that configuring or sharing an agent does not grant access to its underlying data. For semantic models, users need Read permission, and row-level and column-level security still apply."
---

A Fabric data agent lets people ask questions about governed data in plain English. The agent picks the right source, writes a read-only query in SQL, DAX or KQL, runs it with the user's permissions and returns a readable result. Microsoft Learn lists the data agent as generally available. The steps below follow the Learn pages for the concept and the creation guide.

## What a data agent does

When a user asks a question, Learn describes this flow:

1. The question is checked against security rules, responsible AI policies and the user's permissions.
2. The agent reads the schema with the user's credentials and decides which configured source fits best, guided by the instructions you wrote.
3. The question is routed to a tool: NL2SQL for lakehouses and warehouses, NL2DAX for Power BI semantic models, NL2KQL for KQL databases, or Microsoft Graph queries for organizational data.
4. The query is validated and run, and the result comes back as a table, summary or key insights.

## Prerequisites

- A paid **F2 or higher** Fabric capacity, or **Power BI Premium P1 or higher** with Fabric enabled.
- The tenant setting for **cross-geo processing and cross-geo storing for AI**, described on the data agent tenant settings page.
- At least one supported data source with data and read access to it.

For the in-product chat, Learn says no Azure OpenAI key, token or service principal is needed. Fabric uses a Microsoft-managed Azure OpenAI Assistant and your Entra ID identity.

## Set up an agent

1. In your workspace, select **+ New Item**. On the **All items** tab, search for **Fabric data agent** and enter a name.
2. The **OneLake catalog** opens. Select a source and then **Add**. Add each source on its own. Up to five are allowed.
3. In the **Explorer** pane, tick the tables the AI may use. For lakehouses, select tables, not files. CSV or JSON files must first be loaded into tables.
4. Select **Data agent instructions** and write guidance of up to 15,000 characters. Use it to route question types to sources and to define acronyms and business terms.
5. Select **Example queries** and add question and query pairs per source. This works for lakehouses, warehouses and KQL databases. It is not supported for Power BI semantic models or ontologies. Only examples with valid syntax that match the schema are used.
6. Test in the chat. Expand the steps dropdown to read the generated query. **Clear chat** resets the session and deletes the history permanently.
7. Select **Publish** and enter a detailed description. Publishing creates a draft version you keep refining and a published version for colleagues.

## Security and governance

- Agents use the requesting user's identity. Sharing does not grant data access.
- For semantic models, **Read** permission is enough. Build and workspace roles are not required. Row-level and column-level security still apply.
- Microsoft Purview DLP and access restriction policies apply and can block queries or give incomplete answers.
- Workspace administrators control permitted outbound connections with outbound access protection, which Learn labels preview in the creation guide.
- The Purview risk and compliance controls for data agents, such as auditing and Insider Risk Management, are currently in preview.
- Git integration and deployment pipelines support moving agents from development to production.

## Documented limits

| Area | Limit from Microsoft Learn |
|---|---|
| Operations | Read-only |
| Data types | No unstructured files such as PDF, DOCX or TXT |
| Language | Non-English languages not currently supported |
| Model | You cannot change the LLM |
| Result size | 25 rows and 25 columns per response |
| Example queries | Up to 100 per data source |
| Region | Queries fail if source and agent capacities are in different regions |
| Analytics | No machine learning, causal inference or root-cause analysis |

Learn also says conversation history may not persist and can be reset during service updates.

## Writing good instructions

Learn's examples of suitable questions are ones that translate directly to a query, such as total sales in California in 2023. Questions like "What is the root cause of our sales spike?" are out of scope. Write instructions that name which source holds financial metrics, which holds raw data and which holds logs, and spell out company terms. Test with real questions from users before publishing.

## Typical mistakes

- Adding files from a lakehouse and expecting the agent to read them.
- Skipping the cross-geo tenant setting and then wondering why the agent does not work.
- Expecting answers longer than 25 rows.
- Assuming a published agent shows everyone all data. It does not.

## How instructions are weighed

Learn describes a precedence model for guidance, from highest to lowest: organizational intent, role-based intent, developer intent and user intent. Higher layers always override lower ones. In practice, the instructions you write as the developer sit below organizational policy, so a Purview rule or workspace policy wins over a routing hint.

The concept page also notes that data agents can integrate with Microsoft 365 Copilot, Microsoft Copilot Studio, Azure AI Foundry, Microsoft Teams and other tools outside Fabric, and that when an agent is surfaced through Microsoft 365 Copilot, Purview policies still apply to the underlying data sources. If an agent gives an incomplete answer in one of those places, check DLP and access restriction policies before changing the instructions.

## Before you publish

- Run the same ten questions you expect from users and read the generated query for each.
- Check that every selected table has a clear name, since the agent reads the schema.
- Confirm that source and agent capacities are in the same region.
- Write the publish description for the people who will find the agent, not for yourself.

## Related

- [Fabric Data Agents](https://www.m365.fm/entity/fabric-data-agents/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [OneLake](https://www.m365.fm/entity/onelake/)
- [Data governance](https://www.m365.fm/entity/data-governance/)

## Sources

- [Fabric data agent concept (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent)
- [Create a Fabric data agent (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/data-science/how-to-create-data-agent)
