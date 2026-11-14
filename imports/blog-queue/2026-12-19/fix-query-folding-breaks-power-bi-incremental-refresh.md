---
title: "Fix Query Folding Breaks in Power BI Incremental Refresh Models"
summary: "How to find the step that stops query folding in a Power BI incremental refresh model, verify that RangeStart and RangeEnd reach the source, and fix slow or timed-out refreshes using Microsoft's documented checks."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [power-bi, query-folding, incremental-refresh, power-query]
keypoints:
  - "RangeStart and RangeEnd must be Date/Time parameters with those exact case-sensitive names, and the filter column must also be Date/Time unless you convert for an integer key."
  - "If the filter step does not fold, the engine can retrieve all rows and filter locally. Learn says this can make refresh slow or run out of resources, and defeats incremental refresh."
  - "Use query folding indicators or the query plan in Power Query Online, View Native Query where available, or a trace tool at the source such as SQL Profiler."
  - "Find the first step that stops folding and, where possible, move later steps earlier. Alternatively use Value.NativeQuery with EnableFolding on supported connectors."
  - "Initial refresh limits are two hours for Pro and five hours for Premium capacity. Bootstrapping, Large model storage format and XMLA refresh are documented ways around timeouts."
faq:
  - q: "Why does my incremental refresh model load slowly after I select Apply?"
    a: "Microsoft Learn names two causes. The RangeStart and RangeEnd parameters and the filtered column are not the same Date/Time type, which prevents folding, or the data source does not support folding. Test with a short range of a few thousand rows to see whether the query folds."
  - q: "Does the final query need to fold?"
    a: "Learn says there is no requirement for the final query to support folding. What matters is that the filter on RangeStart and RangeEnd is combined with the initial source query so that it runs at the source. A non-folding Value.NativeQuery with the parameters embedded in the SQL is described as an accepted alternative."
  - q: "How do I check whether a step folds?"
    a: "In Power Query Online, folding indicators beside applied steps and the query plan show which steps fold. Where available, View Native Query shows the request sent to the source. In Power BI Desktop, Learn suggests Power Query Diagnostics or a trace tool at the source."
  - q: "Why does the initial refresh time out?"
    a: "Learn lists unfolded partition queries, partitions that are too large and a data source query timeout. Scheduled refresh has a two hour limit for Pro models and five hours for Premium capacity. XMLA endpoint refresh on Premium has no time limit."
  - q: "Can I republish the model from Power BI Desktop after the first refresh?"
    a: "No. Learn says that after publishing you cannot publish the same model again from Power BI Desktop, because republishing removes existing partitions and data in the model. Use the XMLA endpoint for metadata changes."
---

When incremental refresh is slow or times out, the usual cause is that the filter on `RangeStart` and `RangeEnd` does not reach the data source. Microsoft Learn says that without folding, the engine might compensate by retrieving all rows and filtering locally, which makes refresh slow and can exhaust resources in the service or gateway. The fix is to find the step that stops folding, restore it, or push the filter into a native query.

## Step 1: Check the basics

Learn's requirements for the parameters:

- The names are `RangeStart` and `RangeEnd`, reserved and case-sensitive.
- Both must be of the **Date/Time** data type.
- You must reference them manually in a filter expression. The standard Custom Filter dialog cannot use them.
- The filtered column must also be Date/Time, and the format must be the same. If not, the query cannot be folded.
- For an integer surrogate key such as `yyyymmdd`, create a function that converts `RangeStart` and `RangeEnd` to match the key.

A typical filter pair, from Learn's example:

```powerquery-m
#"Filtered Rows" = Table.SelectRows(Data, each [OrderDateKey] >= Int32.From(DateTime.ToText(RangeStart,[Format="yyyyMMdd"]))),
#"Filtered Rows1" = Table.SelectRows(#"Filtered Rows", each [OrderDateKey] < Int32.From(DateTime.ToText(RangeEnd,[Format="yyyyMMdd"])))
```

Use `>=` on one side and `<` on the other, so that rows are not loaded twice in neighboring partitions. Learn's example uses exactly that pattern.

Also confirm the source supports the pattern. Learn says incremental refresh works best for structured relational sources such as SQL Database and Azure Synapse. File-based and web sources can work if the parameters can be passed into the file selection or the HTTP request. All partitions must query a single source.

## Step 2: See whether the filter folds

Query folding translates supported M transformations into operations the data source performs. Learn describes three outcomes: full, partial or no folding. CSV and Excel files have no query engine and do not fold.

Ways to check:

- **Folding indicators** in Power Query Online show which applied steps fold. The indicators and the query plan are available only in Power Query Online. Learn explains that a not-folding indicator means some part of the query up to that step is evaluated outside the source, and that generally everything up to the last folding indicator folds.
- **View Native Query** or **View data source query**, where the connector offers it.
- **Power Query Diagnostics** or a trace at the source, such as SQL Profiler. Learn says Power BI Desktop shows a warning in the incremental refresh policy dialog if it cannot confirm the queries.
- **A short test range.** Learn suggests setting `RangeStart` and `RangeEnd` to a period with no more than a few thousand rows. If loading is still slow, the query probably is not folding.

Learn also says the query with filters on the parameters must run as a single query.

## Step 3: Find the first step that breaks folding

Learn's guidance for Power BI models: when not all steps can be folded, find the step that prevents it and, when possible, move later steps earlier so they can become part of the folded query. The mashup engine may also reorder steps itself.

The pages read do not list specific transformations that break folding. They say support depends on the connector, the data source and the transformations. Folding can also depend on step order: in Learn's example, removing a column that a "Capitalize Each Word" step modified let the final step fold again.

A working method:

1. Open the table in Power Query and select the first step.
2. Go down the applied steps and note where the indicator changes to not folding.
3. Try to move the date filter above that step, or remove the step and do the work in the source.
4. Re-check the indicators and the native query.

If you control the source, Learn's other advice is to prepare data there, for example with a database view that does the transformation, so Power Query only filters.

## Step 4: Use a native query when needed

For supported connectors, `Value.NativeQuery` with `EnableFolding` keeps folding active for later steps:

```powerquery-m
Value.NativeQuery(Source, "SELECT DepartmentID, Name FROM HumanResources.Department WHERE GroupName = 'Research and Development'", null, [EnableFolding = true])
```

Learn lists Amazon Redshift, Dataverse with enhanced compute, Google BigQuery, PostgreSQL, SAP HANA, Snowflake and SQL Server as supported. Two cautions:

- The Power BI guidance says the mashup engine cannot fold later steps after a native query, so include the transformation logic in the SQL. It also says that for DirectQuery or hybrid tables the statement must be a `SELECT` without CTEs or stored procedures.
- Use a read-only account. A native query can run any valid statement, including ones that modify or delete data.

The Power BI guidance says incremental refresh cannot use a native SQL query without forcing the engine to retrieve all rows. The incremental refresh article says the final query need not fold and accepts a non-folding `Value.NativeQuery` with the parameters embedded in the SQL. The pages differ in emphasis, so test both the SQL text and the partition queries at the source before relying on either.

## Step 5: Fix the refresh itself

Learn's troubleshooting items for the service:

- **Initial refresh times out.** Check that every partition query is a single query with a `RangeStart` and `RangeEnd` filter. Pro models have a two-hour scheduled refresh limit, and Premium capacity five hours. Premium options are enabling Large model storage format before the first refresh, bootstrapping the initial refresh so partitions are created without loading history, and XMLA endpoint refresh, which has no time limit.
- **Data source timeout.** Many sources allow overriding the limit in the query, for example `CommandTimeout=#duration(0, 2, 0, 0)` for relational sources.
- **Duplicate values.** Post dates should not change. If past data must change, use SSMS to refresh partitions from the change point to the current one.
- **Data truncated.** Azure Data Explorer, Log Analytics and Application Insights have a 64 MB compressed limit for external queries. Try a smaller refresh period, such as 12 months.
- **Partition-key conflicts.** An updated date is treated as insert plus delete, and a delete in the historical range is not picked up. Learn gives no solution for this cause.

Remember the publishing rules: after the first publish you cannot publish the same model again from Power BI Desktop, because republishing removes the partitions and data, and you cannot download the model as a PBIX.

## Optional tuning in the policy

- **Detect data changes** uses a separate date/time column to refresh only changed periods. Do not use the partition column.
- **Only refresh complete days** ensures full days are loaded, and is required if you enable real-time DirectQuery.
- The time zone for refresh defaults to UTC, and XMLA TMSL refresh ignores the configured time zone.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Query folding](https://www.m365.fm/entity/query-folding/)
- [Incremental refresh](https://www.m365.fm/entity/incremental-refresh/)
- [Power Query](https://www.m365.fm/entity/power-query/)

## Sources

- [Incremental refresh and real-time data for semantic models (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview)
- [Troubleshoot incremental refresh and real-time data (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-troubleshoot)
- [Query folding basics (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/query-folding-basics)
- [Query folding indicators (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/step-folding-indicators)
- [Query folding on native queries (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/native-query-folding)
- [Power Query query folding guidance for Power BI (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/guidance/power-query-folding)
