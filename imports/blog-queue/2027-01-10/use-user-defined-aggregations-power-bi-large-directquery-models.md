---
title: "How to Use User-Defined Aggregations in Power BI for Large DirectQuery Models"
summary: "Create user-defined aggregations in Power BI Desktop: the aggregation table, the Manage aggregations dialog fields, storage modes, relationship-based and GroupBy-based aggregations, row-level security, how to check cache hits and documented limitations."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [power-bi, power-bi-desktop]
keypoints:
  - "Aggregations cache data at an aggregated level so queries they can answer come from memory instead of the DirectQuery source. The detail table must use DirectQuery."
  - "In Power BI Desktop right-click the aggregation table in the Data pane, select Manage aggregations and set Summarization, Detail Table, Detail Column, GroupBy and Precedence."
  - "Relationship-based aggregations suit star and snowflake models. GroupBy-based aggregations suit denormalized big data models and need GroupBy entries."
  - "Once the aggregation table storage mode is set to Import, it cannot be changed again. Since August 2022 Power BI ignores Import-mode aggregation tables on SSO-enabled sources."
  - "The page covers SQL Profiler and an extended event to check hits. It does not mention Performance analyzer or say whether manual aggregations need Premium."
faq:
  - q: "What do aggregations do?"
    a: "They cache data at an aggregated level in memory. Queries that an aggregation can answer are served from the cache instead of the DirectQuery source, which speeds up large models."
  - q: "How do I create one?"
    a: "Create the aggregation table, preferably as an import table from Power Query. In the Data pane of Power BI Desktop right-click it, select Manage aggregations, set the fields for each column and select Apply all."
  - q: "What are the main requirements?"
    a: "The detail table must use DirectQuery storage mode. The detail column must match the aggregation column data type, except for Count and Count table rows. Chained aggregations over three or more tables are not allowed."
  - q: "How do I know a query hit the aggregation?"
    a: "The page names SQL Profiler and the extended event Query Processing Aggregate Table Rewrite Query. It does not mention Performance analyzer."
  - q: "What are known limitations?"
    a: "No support for Dynamic M Query Parameters, Import aggregation tables on SSO-enabled sources are ignored since August 2022, USERELATIONSHIP on inactive foreign-key relationships is not supported, and relationships between aggregation tables cannot be authored in Desktop."
---

Aggregations make large DirectQuery models faster. You keep a smaller, summarized table in memory, and Power BI answers matching queries from it instead of the source. This guide follows the Microsoft Learn page on user-defined aggregations. The page describes a workflow in prose and gives no numbered procedure.

## What aggregations are

You cache data at an aggregated level. A query that the aggregation can answer is served from the cache. Other queries go to the DirectQuery source. You can configure aggregations manually in the data model. For Premium subscriptions, the page also mentions Automatic aggregations in model settings.

## Requirements

- The detail table must use DirectQuery storage mode, not Import.
- The detail column must match the aggregation column data type. Count and Count table rows are exceptions. They are available only for integer aggregation columns and need no matching type.
- Chained aggregations over three or more tables are not allowed.
- Two entries cannot use the same summarization and point to the same detail table and column.
- All Import and non-multidimensional DirectQuery sources work with aggregations.

## Create the aggregation table

1. Create the table. The page recommends an import table created in Power Query. It can also be a table, view or native query at the source.
2. In the **Data** pane of Power BI Desktop right-click the aggregation table and select **Manage aggregations**.
3. For each column set:
   - **Summarization**, the aggregate function.
   - **Detail Table**, the table with the detail data.
   - **Detail Column**, the matching column.
   - **GroupBy**, the grouping columns. Optional for relationship-based aggregations, except for DISTINCTCOUNT. Required for GroupBy-based aggregations.
   - **Precedence**, used when several aggregation tables cover the same detail table. Higher values are considered first.
4. Select **Apply all**. The dialog hides the table if it is not hidden yet.
5. Optionally set the storage mode to Import: in Model view select the table, expand **Advanced** in the **Properties** pane and choose **Import**. Once set to Import, it cannot be changed again.

## Summarizations mentioned

The page names Sum, Min, Max, Count and Count table rows. It says a complex calculation is broken into subqueries for each SUM, MIN, MAX and COUNT. AVERAGE is folded internally into SUM divided by COUNT, so it needs both. DISTINCTCOUNT can hit an aggregation in some cases when there is a GroupBy entry for the column. The page does not list every option in the dialog.

## Storage modes

For regular relationships between tables from one source, the page gives these pairs: Dual with Dual, Import on the many side with Import or Dual on the one side, and DirectQuery on the many side with DirectQuery or Dual on the one side. Cross-source relationships are regular only if both tables are Import. Many-to-many relationships are always limited. When you set the aggregation table to Import, a dialog suggests setting the related dimension tables to Dual.

## Two styles

- **Relationship-based.** For dimensional models such as star or snowflake schemas. An aggregation table such as Sales Agg grouped by CustomerKey, DateKey and ProductSubcategoryKey can reduce billions of rows to millions. A query hits it only if its grouping is at a granularity the aggregation covers. Grouping by a product column that is finer than the subcategory misses it.
- **GroupBy-based.** For big data models that denormalize dimension attributes into fact tables without relationships. GroupBy entries are required. Without them the aggregation is not hit.

## Row-level security

RLS on the detail table should also apply to the aggregation table. An RLS filter on only the detail table is allowed but not recommended, because those users get no aggregation hits. An RLS filter on only the aggregation table is not allowed.

## Check for hits

SQL Profiler shows whether a query comes from the in-memory cache or goes to the source. The extended event `Query Processing\Aggregate Table Rewrite Query` has fields such as matchingResult, dataRequest and mapping.

## Limitations

- Dynamic M Query Parameters are not supported.
- Since August 2022 Power BI ignores Import-mode aggregation tables on sources with single sign-on enabled. Disable SSO to get the performance.
- USERELATIONSHIP on an inactive foreign-key relationship is not supported for hits. Use TREATAS with no active relationships between the tables.
- You cannot author relationships between aggregation tables in Power BI Desktop. Use a third-party tool or XMLA scripting.
- A DirectQuery aggregation table from a different source is supported only for SQL Server, Azure SQL or Azure Synapse Analytics.
- Keep the cache in sync with the source, or results can differ.

## What the page does not say

- A numbered step-by-step procedure.
- A full list of Summarization values.
- Performance analyzer as a way to check hits.
- Whether manual aggregations need Premium.
- Whether composite models are required. It only links to composite model documentation.

## A planning outline

This outline is practical advice built on the page.

1. Identify the grain your most common visuals need.
2. Build the aggregation table at that grain in Power Query.
3. Map it in Manage aggregations and apply.
4. Test with SQL Profiler before you widen the rollout.
5. Check SSO and RLS settings first, since they can switch aggregations off.

## Typical mistakes

This list is my own advice, not from the page.

- Using an Import detail table.
- Forgetting GroupBy entries on a GroupBy-based aggregation.
- Setting Import storage mode and expecting to undo it.
- Leaving SSO on and wondering why aggregations are not used.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [Power BI relationships](https://www.m365.fm/entity/power-bi-relationships/)

## Sources

- [User-defined aggregations - Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/transform-model/aggregations-advanced)
