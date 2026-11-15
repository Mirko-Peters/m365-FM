---
title: "Connect Dynamics 365 Customer Service Knowledge Articles and Dataverse Tables to a Copilot Studio Agent"
summary: "Two documented ways to give a Copilot Studio agent access to Dynamics 365 knowledge articles (the Search Dynamics 365 knowledge articles action and a Power Automate template), plus adding Dataverse tables as a knowledge source, with prerequisites, filters and limits."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [dynamics-365-customer-service, copilot-studio, dynamics-365-knowledge-management, knowledge-source]
keypoints:
  - "Learn describes two paths for knowledge articles: the Search Dynamics 365 knowledge articles action in a topic, or a Power Automate flow template. Both need Dataverse search turned on."
  - "The documented knowledge article integration applies to Dynamics 365 Customer Service and Contact Center, standalone only, and searches published external articles by default."
  - "Connection references for Microsoft Dataverse and Content Conversion must be set before the flow works, and again after a solution moves from test to production."
  - "Dataverse tables as a knowledge source need the Authenticate with Microsoft option, up to 15 tables per knowledge source, and the maker needs permission to the underlying data."
  - "Glossary and synonym changes can take up to 15 minutes. Multiline text and file column search is a preview feature and adds Dataverse capacity cost."
faq:
  - q: "Why does the agent return no knowledge articles?"
    a: "Learn says the search runs on external published articles by default (statecode eq 3 and isinternal eq false), so internal or unpublished articles are not returned. It also lists Dataverse search being enabled as a prerequisite. If a search returns nothing, change the search terms or add a filter."
  - q: "Do I need Dataverse search turned on?"
    a: "Yes. Learn lists Dataverse search as a prerequisite for the knowledge article integration, and says Dataverse tables as a knowledge source also require Dataverse search. A system administrator is needed to enable it."
  - q: "What authentication does a Dataverse knowledge source need?"
    a: "Learn says the agent's authentication must be set to Authenticate with Microsoft. No authentication and Authenticate manually are not supported for Dataverse tables as a knowledge source."
  - q: "How many Dataverse tables can I add?"
    a: "You can add up to 15 Dataverse tables per knowledge source, according to the Copilot Studio page. Table recommendations are based on the name of your agent."
  - q: "Why does the flow break after moving the solution to production?"
    a: "Learn says that when the solution is imported from a test environment to production, you must set up the connection references again as a system administrator."
---

Microsoft Learn documents two separate ways to connect Dynamics 365 knowledge to a Copilot Studio agent. One searches knowledge articles with a dedicated action. The other adds Dataverse tables as a knowledge source in Copilot Studio. This article puts the steps side by side, and it points out the conditions that cause the usual "no results" or "cannot add the table" problems.

## Which path to use

| Path | What it searches | Documented in |
|---|---|---|
| Search Dynamics 365 knowledge articles action | Knowledge articles, by default external published articles | Dynamics 365 Customer Service page on integrating knowledge management with Copilot agents |
| Power Automate flow template | Dataverse knowledge articles, using the unrecognized trigger phrase | Same page |
| Dataverse tables as a knowledge source | Dataverse tables you select, up to 15 per source | Copilot Studio page on Dataverse knowledge |

The Customer Service page says it applies to Dynamics 365 Customer Service and Dynamics 365 Contact Center, standalone only. It also notes that the terms Copilot Studio bot and human agent are being renamed to Copilot agent and customer service representative, so you may see both in product and documentation.

## Prerequisites for knowledge articles

- Dataverse search must be enabled. You need the system administrator role to enable it.
- Knowledge articles must be created and published to a portal built with Power Apps, set up before integrating. Learn says you can create and manage articles with the **Internal** field set to **No** in the Dataverse Web API.
- A Copilot agent and a topic must exist.

## Path 1: The Search Dynamics 365 knowledge articles action

### Set connection references

The flow uses connections such as **Content Conversion** and **Microsoft Dataverse**, and you must configure the connection references before you turn the flow on.

1. Go to make.powerapps.com and open **Solutions**. A notification with a link to configure connection references is shown there. If it is missing, go to **Default Solutions** > **Connection references**.
2. Select the connections for **Microsoft Dataverse** and **Content Conversion**, then **Save and Close**.
3. Go to **Default Solution** > **Cloud flows** and turn on **Search Dynamics 365 knowledge article flow**.

Learn adds two notes. If you have the Environment Maker role and cannot see the notification or the cloud flow, you lack permission, and a system administrator or system customizer must set the references and enable the flow. After importing the solution from test to production, you must set up the connection references again as a system administrator.

### Add the action to a topic

1. In Copilot Studio, select **Topics** > **New Topic**.
2. Add a question node that asks for the search text, and a question node for the filter. Learn suggests a sample filter value such as `statecode eq 3`.
3. Select **Add node** (+), then **Call an action**, then the **Search Dynamics 365 knowledge article flow** action. Provide the inputs. Learn says an error might appear if the filter is not provided.
4. Add a message node to show the results, then save and run the topic with a trigger phrase.
5. When it works, replace the flow with the **Search Dynamics 365 knowledge articles** action, remove the filter question node, update the message node with the action's output and save. Learn says any agent in the organization can then use the action.
6. Publish the agent. Learn notes that a cross-linked, modified dialog causes a validation error on publish and blocks it, and that the topic checker shows errors that must be fixed before publishing.

### Work with filters

- By default the search runs on external published articles (`statecode eq 3` and `isinternal eq false`). Extra filtering goes into the Filter (text) input variable.
- To filter on a string attribute such as keywords, append the string value to the search text.
- Learn points to the knowledgearticle entity reference for attributes, and to the Dataverse search configuration page for filter conditions Dataverse search does not support.

### Render results

Learn suggests thumbnail cards or an adaptive card, and gives a sample adaptive card that shows the first article's title, modified date, description and a link to open the article in the Dynamics app.

## Path 2: Power Automate flow template

1. In Power Automate, search templates for **Generate answers from Dataverse knowledge articles to Power Virtual Agent**, select **Continue** and save the template.
2. Create a new solution under **Solutions**, then use **Add existing** > **Cloud Flow** to add the flow from **Outside solutions**.
3. In the topic, use **Call an action**, select the new flow, and set its input variable to `bot.UnrecognizedTriggerPhrase`.
4. Render the results as above.

## Path 3: Dataverse tables as a knowledge source

From the Copilot Studio page:

1. Open the agent and select **Add knowledge** from the **Overview** or **Knowledge** page, then **Dataverse**.
2. Select one or more tables, up to 15 per knowledge source.
3. Review the name and description. Learn says to provide a detailed description, especially if generative AI is enabled, because it helps generative orchestration.
4. Optionally add synonyms for columns and glossary terms for domain terminology.
5. Select **Add to agent**.

Conditions from the notes on that page:

- Agents must use Dataverse search. If you cannot add a table, ask your administrator to turn it on.
- The agent's authentication must be **Authenticate with Microsoft**. **No authentication** and **Authenticate manually** are not supported.
- You need permissions to the underlying data. Missing permissions might prevent tables from being visible or selectable.
- For numeric columns, add a synonym or description so the AI understands them. Learn's example explains a flight code column.
- It might take up to 15 minutes for updated glossary terms and definitions to become available. Learn says to test your agent to verify which descriptions give the best result.

### Multiline text and file columns (preview)

Learn describes search over **Multiline Text** and **File** columns as prerelease documentation. You must set the table and those columns as searchable in the Quick Find View in Power Apps and publish the view. Creating a search index incurs extra Dataverse capacity costs. If you add the knowledge source before configuring the columns, it might take up to two days for the system to backfill. Tables, images and text in non-organization-based languages in file attachments are not supported, and for virtual tables only those from the Finance and Operations data provider are available.

## What the documentation does not say

The pages read do not describe how to combine knowledge article search and a Dataverse table source in one agent, how Dataverse knowledge sources treat the knowledge article table specifically, or how article security (such as internal articles and roles) maps to the signed-in user. Test with an account that has the lowest role your customers or representatives will use. That test is the author's suggestion.

## Related

- [Dynamics 365 Customer Service](https://www.m365.fm/entity/dynamics-365-customer-service/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Dynamics 365 knowledge management](https://www.m365.fm/entity/dynamics-365-knowledge-management/)
- [Knowledge source](https://www.m365.fm/entity/knowledge-source/)

## Sources

- [Integrate knowledge management in Dynamics 365 with Copilot agents (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/integrate-km-with-pva)
- [Add Dataverse tables as a knowledge source, Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-dataverse)
