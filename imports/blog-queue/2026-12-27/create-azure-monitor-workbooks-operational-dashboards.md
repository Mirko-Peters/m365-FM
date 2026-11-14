---
title: "Create Azure Monitor Workbooks for Operational Dashboards: Elements and Tips"
summary: "Build an Azure Monitor workbook step by step with Microsoft Learn: edit mode, text, query, parameter, metric, link and group elements, tabs with conditional visibility, query performance guidance and what the article does not cover about saving."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [azure-monitor-workbooks, azure-monitor]
keypoints:
  - "Start from the Azure Workbooks page with an empty template or New in the top toolbar. Use Edit mode to add elements."
  - "Element types are text, queries, parameters, metric charts, links and tabs, groups, and images and videos."
  - "For resource-based queries, if you have read permission on a resource but not on its Log Analytics workspace, select the resource for Resource type to see data."
  - "Groups default to lazy loading. Parameters created inside a group are visible only inside it, and group content from a template cannot be changed in edit mode."
  - "The article does not describe saving, permissions for sharing or service limits."
faq:
  - q: "How do I start a workbook?"
    a: "According to Microsoft Learn, from the Azure Workbooks page select an empty template or New in the top toolbar. The article does not give the full navigation path."
  - q: "How do I add elements?"
    a: "Make sure you are in Edit mode by selecting Edit in the toolbar. Use Add below an existing element or at the bottom, or the ellipsis next to Edit on an element, then Add."
  - q: "Why does my query show no data?"
    a: "Learn says that for resource-based queries, if you have read permission for a resource but not for the Log Analytics workspace it sends telemetry to, you must select the resource for Resource type to see data."
  - q: "How do tabs work?"
    a: "Add links, set Style to Tabs, use the same parameter name with a different value per tab, then make content visible by selecting Make this item conditionally visible."
  - q: "Does the page explain saving or sharing?"
    a: "No. The article does not describe the save dialog, subscription, resource group, location, shared versus private options or the permissions to share workbooks."
---

An Azure Monitor workbook combines text, queries, parameters and charts into one interactive page. This guide follows the Microsoft Learn article on creating workbooks and lists what the article covers and what it leaves out.

## Start and edit

From the Azure Workbooks page, select an empty template or **New** in the top toolbar. To add elements, make sure you are in **Edit** mode by selecting **Edit** in the toolbar. Then use **Add** below an existing element or at the bottom of the workbook, or the ellipsis to the right of **Edit** next to an element, then **Add**.

## Element types

### Text

Enter markdown in the editor. **Text Style** can be plain, info, error, success, upsell or warning. Check output on the **Preview** tab and select **Done Editing**. Text can reference parameter values, which update as parameters change.

### Queries

Select a data source and a visualization. Enter a query or pick one from **Samples**, select **Run Query**, then **Done editing**. If you have read permission for a resource but not for the Log Analytics workspace it sends telemetry to, select the resource for **Resource type** to see data.

### Parameters

Set a **Parameter name** (no spaces or special characters), a **Display name** (spaces and special characters allowed), a **Parameter type** and whether it is **Required**. Then select **Done editing**.

### Metric charts

Select a **Resource type**, **Resources**, **Namespace**, **Metric** and **Aggregation**. Optionally set **Time Range**, **Visualization** (Area, Bar, Line, Scatter or Grid), **Split By**, **Size** and **Color palette**.

### Links and tabs

Choose a link style (Bullet List, List, Paragraph, Navigation, Tabs or Toolbar) and a link look (Link, Button Primary or Button Secondary). Link actions include **Set a parameter value** and **Scroll to a step**. For tabs, select **Add** > **Add links/tabs**, set **Style** to **Tabs**, and use the same parameter name with a different value per tab. Then select **Make this item conditionally visible** for the content of each tab.

### Groups

Select **Add group**, choose a type (**Editable** or **From a template**) and a load type (**Lazy loading** is the default, plus **Explicit loading** and **Always**). A group is a scope, so parameters created inside it are visible only inside it. Group contents from a template cannot be modified in edit mode. Because they load from the template again, changes belong in the source template (my reading).

### Images and video

Enter a URL, then set the title, size and alternative text.

## Query performance guidance

The article suggests using the smallest possible time ranges. For dynamic scopes it gives a heuristic: individual resources if five or fewer are selected, resource groups if more than five resources span three or fewer resource groups, and subscriptions otherwise. These are query design guidelines, not platform limits. The same section also suggests predefining summary rules, using an All item in dropdown parameters and protecting queries against missing columns or tables.

## A dashboard recipe

This outline is my advice, built from the elements above, not a Microsoft procedure.

1. Add parameters first for time range and resource scope, so every query uses them.
2. Add a text element at the top that explains the dashboard.
3. Add metric charts or queries for the key health signals.
4. Group detail views and use lazy loading so the page opens fast.
5. Use tabs to separate views, such as overview and diagnostics.

## Editing an existing workbook

To change a workbook, make sure you are in **Edit** mode by selecting **Edit** in the toolbar, make the changes and select **Done editing**. The page capitalizes this button inconsistently and has no separate section for editing saved workbooks. It says that group contents loaded from a template cannot be modified in edit mode.

## Parameter and text interplay

Text elements can reference parameter values, and the displayed text updates as parameters change. This lets one explanation block reflect the selected scope or time range. Because parameter names cannot contain spaces or special characters while display names can, choose a short parameter name for use in queries and a readable display name for users (my advice).

## Not covered

The article does not describe the save workflow, including subscription, resource group, location or shared versus private options. It also does not cover role-based access control for creating or sharing workbooks, service limits, quotas, pricing or the details of data sources and link actions, which are in linked articles.

## Related

- [Azure Monitor Workbooks](https://www.m365.fm/entity/azure-monitor-workbooks/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Create or edit an Azure Workbook (Microsoft Learn)](https://learn.microsoft.com/azure/azure-monitor/visualize/workbooks-create-workbook)
