---
title: "Copilot in Power BI: What AI Can Do for DAX Queries and Report Building"
summary: "What Copilot in Power BI does for DAX and reports, how to open it in DAX query view and the service, the capacity and tenant requirements, and the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [copilot-in-power-bi, power-bi, dax, semantic-model]
keypoints:
  - "Copilot in DAX query view writes DAX queries from a prompt, explains queries and DAX topics, and refines a query when you select it and ask for a change."
  - "Copilot can create report pages and visuals in the Power BI service, but it does not support custom visuals or styling changes."
  - "It needs a paid Fabric capacity (F2 or higher) or Power BI Premium (P1 or higher). A Pro or PPU license alone is not enough."
  - "Copilot reads model metadata, not your table data, so descriptive names and descriptions improve results."
  - "Microsoft says generated queries can be wrong. Run the query and check the result against known figures before you rely on it."
faq:
  - q: "Can Copilot write DAX for me?"
    a: "Yes, as DAX queries. Microsoft Learn says Copilot in DAX query view can write DAX queries from natural language, explain existing queries and answer questions about DAX functions. The pages I read describe queries and explanations, and they do not describe Copilot creating measures in DAX query view."
  - q: "Where do I find Copilot in DAX query view?"
    a: "In Power BI Desktop, open DAX query view, create a query tab and select the Copilot button or press Ctrl and I. In the service, open the context menu of a published semantic model, choose Write DAX queries and open Copilot the same way. The Learn page for Desktop also mentions a preview feature setting."
  - q: "What do I need to use Copilot in Power BI?"
    a: "Microsoft Learn lists a paid Fabric capacity of F2 or higher, or Power BI Premium P1 or higher, a supported region, and the tenant setting that allows Copilot and other features powered by Azure OpenAI. Trial capacities and free SKUs are not supported, and a Pro or Premium Per User license alone is not sufficient."
  - q: "Does Copilot look at my data?"
    a: "Microsoft Learn says Copilot in DAX query view uses model metadata such as tables, columns and measures. In Import mode it may use minimum and maximum values to get sample values, but it cannot read other table data."
  - q: "Can I trust the DAX Copilot generates?"
    a: "Treat it as a draft. Microsoft Learn states that generated queries and explanations can be wrong, that Copilot may not know recently added DAX functions, and that you should run a query and verify the results before relying on it."
---
Copilot in Power BI can write and explain DAX queries, create report pages from a prompt, summarize reports and answer questions about data. It helps most when the semantic model is well described, and it always needs a human check. This article covers what Microsoft documents for DAX and for report building, where to open each feature, the requirements that stop most first attempts and the limits you should know.

## What Copilot does in Power BI

Microsoft Learn lists these capabilities by audience:

- **Business users.** A Copilot pane on reports that answers questions and summarizes insights (generally available), a standalone Copilot experience (preview) and Copilot in apps (preview).
- **Report authors.** Create and edit reports with prompts, summarize the semantic model, create narrative summary visuals, write DAX queries and add descriptions to measures.
- **Semantic model authors.** Copilot in web modeling (preview) spots unclear structures and inconsistent naming, gives best-practice recommendations and helps refine DAX business measures.

[Copilot in Power BI](https://www.m365.fm/entity/copilot-in-power-bi/) is documented for both Power BI Desktop and the Power BI service. Some of these features are labeled preview on Learn, so check the label before you plan production use.

## Requirements to check first

| Requirement | Detail from Microsoft Learn |
|---|---|
| Capacity | Paid Fabric F2 or higher, or Power BI Premium P1 or higher. Trial capacities and free SKUs are not supported |
| Tenant setting | Users can use Copilot and other features powered by Azure OpenAI, on at tenant level |
| Region | The Fabric capacity must be in a supported region |
| License | A Power BI Pro or Premium Per User license alone is not sufficient |
| Sovereign clouds | Not supported |

For Desktop, you need write access to a workspace on paid Fabric or Premium capacity where you plan to publish. After you buy or scale up capacity, Learn says it can take up to 24 hours before Copilot is available. Outside the US or EU data boundary, Copilot is off by default unless the Fabric admin allows data to be processed outside the tenant's region.

## Write DAX queries with Copilot

### Open Copilot in DAX query view

In Power BI Desktop:

1. Go to **Options** > **Preview features** and turn on **DAX query view with Copilot**, as the Learn page describes it.
2. Open a report or connect to a published semantic model.
3. Select **DAX query view**, the fourth view on the left.
4. Create a new query tab.
5. Select the **Copilot** button or press `Ctrl+I`.

In the Power BI service:

1. Select a published semantic model in a workspace.
2. Open its context menu and choose **Write DAX queries**.
3. If the option is greyed out, turn on **Users can edit data models in the Power BI service (preview)** under **General** in workspace settings.
4. Create a query tab and open Copilot.

The Learn article on DAX query view was last updated on 2024-12-10, so the preview toggle may have changed. If you do not see it in Options, check the current release notes.

### Prompt, run, refine, keep

1. Type a request such as "Write a DAX query to show profit by product" and press `Enter`.
2. Select **Run** or press `F5` to see the results.
3. Refine in conversation, for example "Add in Orders", and run again.
4. Select **Keep query** to add it to the tab, or discard it.

To change an existing query, select the query text, type the request and review the changes in the diff highlighting. To learn, select a query and choose **Explain this query**, or ask for a topic such as "Explain what SUMMARIZECOLUMNS is for". Select **Show more** for the longer explanation.

Generated queries are syntax-checked and the prompt is retried once. If the query still has errors, Copilot says so and asks you to rephrase or fix it yourself.

## Build report pages with Copilot

Learn documents this flow for the Power BI service:

1. Open a report and select a semantic model.
2. Select **Edit**.
3. Select the **Copilot** icon in the ribbon.
4. Choose **Suggest content for this report** or type a prompt describing the report or visuals.
5. Review the new page, then prompt Copilot to add, change or delete visuals.

Prerequisites listed on that page: Copilot is enabled by your admin, the semantic model has the **Q&A** feature switch on and **implicit measures** enabled, and the model is not a real-time streaming model or a live connection to Analysis Services. Limits: no custom visuals, no styling or formatting changes, and changing complex visuals can lose detail. A saved Copilot-generated report reopens in Reading view without the Copilot pane. Select **Edit** to bring it back.

## Prepare the semantic model

Copilot depends on the model's metadata. Learn says Copilot reads only the first 200 characters of a description, so put the key meaning first. Give tables, columns and measures clear names and descriptions. Learn also warns that without preparing the [semantic model](https://www.m365.fm/entity/semantic-model/) for AI, Copilot may misread data and return generic or inaccurate results. Very large models can get reduced metadata. Learn lists model-size limits for DAX query view, so check the current article if your model is large.

## Limits to remember

- Prompt limit: 10,000 characters.
- Identical prompts on an unchanged model within a rolling 24 hours return a cached response. Change the prompt or refresh the model for a fresh answer.
- Copilot may not know recently added DAX functions, so explanations can be wrong.
- Non-English prompts may work, but multilingual use is not officially supported.
- Billing is driven by token consumption. Downstream actions such as DAX queries and refreshes are billed through standard Fabric paths.

## Typical mistakes

- Trying Copilot on a trial capacity or with only a Pro license.
- Skipping the tenant setting. Enabling Copilot only at capacity level is not enough, according to Learn.
- Keeping a generated query without running it.
- Expecting Copilot to see table data. It sees metadata.
- Asking vague questions. Learn advises naming the measures, columns and grouping you want.

## Related

- [Copilot in Power BI](https://www.m365.fm/entity/copilot-in-power-bi/)
- [DAX](https://www.m365.fm/entity/dax/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)

## Sources

- [Overview of Copilot for Power BI (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction)
- [Use Copilot to write and explain DAX queries (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/transform-model/dax-query-copilot-create)
- [DAX Copilot (Microsoft Learn)](https://learn.microsoft.com/en-us/dax/dax-copilot)
- [Create a report page with Copilot in the Power BI service (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-create-report-service)
