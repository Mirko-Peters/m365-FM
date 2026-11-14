---
title: "Connect Microsoft 365 Copilot to Power BI Data with a Fabric Data Agent"
summary: "How to make governed Power BI and Fabric data answer questions in Microsoft 365 Copilot: create a data agent, publish it to the Agent Store, and know when built-in Power BI data answering is enough."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [fabric-data-agents, copilot, power-bi, fabric]
keypoints:
  - "Two routes exist: built-in Power BI data answering in Copilot Chat, and a Fabric data agent that you publish to the Agent Store."
  - "A data agent needs a paid F2 or higher Fabric capacity (or Power BI Premium P1 or higher with Fabric enabled) and a Copilot license for each user."
  - "Create the agent with + New Item > Fabric data agent, add up to five data sources, then Publish and select Publish to Agent Store."
  - "Users see only what their own access allows. Row-level and column-level security are respected, and recipients need access to the data sources too."
  - "Responses may leave Fabric's compliance boundary or region once Copilot processes them, so check cross-geo tenant settings first."
faq:
  - q: "Can Microsoft 365 Copilot answer questions from Power BI without a data agent?"
    a: "Yes. Microsoft Learn describes Power BI data answering in Copilot Chat, which uses reports and semantic models the user can access. It needs a Microsoft 365 Copilot Premium license per user. Learn also says Fabric data agents and ontologies cannot answer in Copilot Chat unless a Microsoft 365 agent is explicitly published."
  - q: "What capacity does a Fabric data agent need?"
    a: "According to Microsoft Learn, a paid F2 or higher Fabric capacity, or a Power BI Premium per capacity P1 or higher with Microsoft Fabric enabled. The Fabric trial does not support the data agent."
  - q: "Which data sources can a data agent use?"
    a: "Learn lists warehouses, lakehouses, Power BI semantic models, KQL databases, mirrored databases and ontologies, and the concept page adds Microsoft Graph. A single agent supports up to five data sources in any combination."
  - q: "Do other people see data they should not see?"
    a: "Learn says users see only results based on their own access, and row-level and column-level security are fully respected. People you share the agent with need access to both the agent and the underlying data sources."
  - q: "Is the Copilot answer always the same as the agent output?"
    a: "No. Learn explains that the published agent runs in Copilot's own orchestrator, so the final response can differ. Adding an instruction that output should be delivered as-is reduces variation but does not remove it."
---

To get Power BI and Fabric data into Microsoft 365 Copilot, you can use one of two routes. The built-in route lets Copilot Chat answer from Power BI reports and semantic models that a user can already open. The data agent route lets you build a Fabric data agent over chosen sources, publish it to the Agent Store and have people ask it questions from Copilot. This article covers both, with the steps for the agent route as Microsoft Learn documents them.

## Choose the route first

| | Power BI data answering in Copilot Chat | Fabric data agent published to the Agent Store |
|---|---|---|
| What it uses | Power BI reports and their semantic models | Up to five sources you pick, such as lakehouses, warehouses, semantic models, KQL databases |
| Who sets it up | Admins turn on tenant settings | A Fabric user creates, tests and publishes the agent |
| License named by Learn | Microsoft 365 Copilot Premium for every user | A paid F2 or higher capacity, plus a Copilot or Office 365 commercial license and a user license for each person |
| Status stated by Learn | Generally available | Described on a separate Learn page with a data-handling warning |

Learn states that data answering from Power BI content in Copilot Chat is generally available and that embedded capacities (A or EM SKUs) are not supported. It also states that Fabric data agents and ontologies cannot answer in Copilot Chat without an explicitly published Microsoft 365 agent. So if you want a curated agent with your own instructions, use the agent route. If you only want Copilot to find and use existing reports, the built-in route may be enough.

## Route 1: Power BI data answering (admin setup)

Learn gives these admin steps:

1. In the Microsoft 365 admin center, select **Copilot** > **Settings**, then **View all**.
2. Select **Fabric data in Microsoft Copilot**.
3. Under Step 1, choose **No users**, **All users** or **Specific groups**, then **Save**.
4. Optionally, a Fabric administrator enables **Share Fabric data with your Microsoft 365 services** in the Fabric admin portal under Tenant settings, so Power BI content appears in Copilot search and the attachment menu.

Users can then ask without naming a report, paste a long-form report link, use the **+** attachment menu under **Other**, or name the report. Learn notes that answers reflect the last successful semantic model refresh, that paginated reports and dashboards are not supported, and that sensitivity labels and row-level security apply.

## Route 2: Create and publish a Fabric data agent

### Prerequisites from Learn

- A paid F2 or higher Fabric capacity, or Power BI Premium P1 or higher with Fabric enabled.
- A Microsoft Copilot license or an Office 365 commercial subscription, and a user license for each person who uses the agent in Copilot.
- Cross-geo processing and cross-geo storing for AI enabled in the Fabric tenant settings, depending on your requirements.
- At least one data source with data, and read access to it. For a Power BI semantic model, Learn says Read permission is enough.
- The data agent and Copilot in the same tenant, and the same account signed in to both.

### Steps

1. In your Fabric workspace, select **+ New Item**, search for **Fabric data agent** and select it. Enter a name.
2. In the OneLake catalog that opens, select a data source and choose **Add**. Repeat for each source, up to five.
3. In the **Explorer**, tick the tables the agent may use.
4. Optional: select **Data agent instructions** and write plain-English guidance, up to 15,000 characters. Learn suggests routing question types to specific sources and defining business terms.
5. Optional: add example queries. Learn says these are supported for lakehouses, warehouses and KQL databases, but not for Power BI semantic models or ontologies.
6. Test in the chat and expand the steps dropdown to check the generated query.
7. Select **Publish**, write a detailed description, and during publishing select **Publish to Agent Store**. The description is used by orchestrators to decide when to call the agent.

Publishing creates a draft version for refinement and a published version for sharing.

### Use it in Copilot

Wait a few seconds for the agent to appear. If it does not, select the **Expand Navigation** button on the left to refresh the list. Find the agent in the **Agent Store**, then either chat with it directly or type `@` in the main Copilot chat and pick it. To share, select the agent name, then **Share**, copy the link and send it in a chat or channel. If agents do not appear at all, ask your Microsoft 365 admin to confirm that Copilot extensibility is enabled.

## Limits to know before rollout

From the concept page:

- The agent is read-only. It generates read queries only and cannot change data.
- It works with structured data. Unstructured files such as PDF or Word are not supported unless ingested as tables.
- Responses are capped at 25 rows and 25 columns, and English gives the best results.
- Queries fail if the data source's capacity and the agent's capacity are in different regions.
- Purview policies can block queries or produce incomplete answers.

From the Copilot page: responses might be sent outside Fabric's compliance boundary or geographic region, and Copilot processes and stores them under its own terms. Treat that as a decision for your compliance team before you publish.

## Typical problems

- **The agent does not appear in the Agent Store.** Refresh the list as described above, then check Copilot extensibility with your admin.
- **A colleague gets no answers.** Recipients need access to the agent and the data sources.
- **The trial capacity does not work.** Learn's trial page lists the data agent as unsupported, so use a paid F capacity.
- **Output is reworded.** Add an instruction to return the agent output as-is. Learn says this lowers variation but cannot remove it.

## Related

- [Fabric data agents](https://www.m365.fm/entity/fabric-data-agents/)
- [Copilot in Power BI](https://www.m365.fm/entity/copilot-in-power-bi/)
- [Fabric IQ](https://www.m365.fm/entity/fabric-iq/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Microsoft Learn: Consume a Fabric data agent in Microsoft 365 Copilot](https://learn.microsoft.com/fabric/data-science/data-agent-microsoft-365-copilot)
- [Microsoft Learn: Fabric data agent concept](https://learn.microsoft.com/fabric/data-science/concept-data-agent)
- [Microsoft Learn: Create a Fabric data agent](https://learn.microsoft.com/en-us/fabric/data-science/how-to-create-data-agent)
- [Microsoft Learn: Use Power BI data in Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-powerbi-copilot-chat)
- [Microsoft Learn: Fabric IQ in Microsoft 365 Copilot Chat](https://learn.microsoft.com/en-us/fabric/iq/connectors/microsoft-365-copilot-overview)
- [Microsoft Learn: Microsoft Fabric trial capacity](https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial)
