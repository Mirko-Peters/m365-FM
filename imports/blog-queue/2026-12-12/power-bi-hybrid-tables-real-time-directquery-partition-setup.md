---
title: "Power BI Hybrid Tables: Set Up Real-Time Data With a DirectQuery Partition"
summary: "Configure a Power BI hybrid table with incremental refresh plus a real-time DirectQuery partition: RangeStart and RangeEnd, policy settings, query folding, Premium requirements and limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [power-bi, power-bi-premium, power-bi-desktop]
keypoints:
  - "A hybrid table is incremental refresh with an optional DirectQuery partition for the newest rows, so recent data is fetched live and older data stays in import partitions."
  - "The real-time DirectQuery option needs a Premium workspace. Pro models have a two-hour refresh limit and no real-time option."
  - "Create Date/Time parameters named RangeStart and RangeEnd, filter with an equal-to on only one of them, and make sure the query folds."
  - "Enabling Get the latest data in real time with DirectQuery turns on Only refresh complete days automatically."
  - "Republishing removes the existing partitions and data, and all partitions must query a single data source."
faq:
  - q: "Which license do I need for real-time data with DirectQuery?"
    a: "Microsoft Learn says a real-time DirectQuery partition is supported only for models in Premium capacities, and such models can be published only to a Premium workspace. Pro models do not support it and have a two-hour refresh limit. The page lists Premium per user inconsistently, so verify it before you plan."
  - q: "Why is the Incrementally refresh this table switch disabled?"
    a: "Per Microsoft Learn, the switch is disabled when the Power Query expression has no filter on the RangeStart and RangeEnd parameters. Create both parameters as Date/Time and filter the date column with them."
  - q: "Why do some rows appear twice after refresh?"
    a: "Microsoft Learn warns that using an equal-to on both RangeStart and RangeEnd lets a row fall into two partitions and creates duplicates. Use equal-to on only one of the two."
  - q: "Can I use transformations that do not fold?"
    a: "Not with the real-time option. Microsoft Learn states that if the policy includes getting real-time data with DirectQuery, nonfolding transformations cannot be used."
---

A hybrid table keeps older rows in imported partitions and reads the newest rows from the source with DirectQuery at query time. In Power BI Desktop you build it with incremental refresh and one extra option. Microsoft's pages do not use the term hybrid table in the incremental refresh articles, so this article describes the feature by its documented name: incremental refresh with real-time data.

## What the feature does

Microsoft says the real-time option adds a DirectQuery partition for rows with a date and time later than the incremental refresh period. Those rows are fetched from the source with every model query. The import partitions hold the archive and refresh periods. This reduces the amount of data to refresh while the latest source changes still appear in results.

Benefits Microsoft lists:

- Fewer refresh cycles for fast-changing data.
- Faster and more reliable refreshes, because only recent data is processed and long connections to volatile sources are not needed.
- Less memory and resource use in Power BI and the source system.

Microsoft gives one example: with a refresh period of three days and about 10,000 new rows a day, expect roughly 30,000 rows to refresh each time.

## Requirements

- Incremental refresh works with Power BI Premium, Premium per user, Pro and Embedded models.
- The real-time DirectQuery partition is supported only for models in Premium capacities. The page lists Premium, Premium per user and Embedded, but the interface label says Premium only and the publish section says such models can be published only to a Premium workspace. Check your license against the current page.
- Pro models have a refresh time limit of two hours and do not support real-time data with DirectQuery.
- The source should be a structured, relational source such as SQL Database or Azure Synapse. It must support date filtering with `RangeStart` and `RangeEnd`.

The pages read do not mention Fabric capacity, so check the current licensing documentation if you use Fabric.

## Step 1: Create the parameters

1. In Power BI Desktop, select **Transform data** on the **Home** ribbon.
2. Select **Manage Parameters** > **New Parameter**.
3. Name it `RangeStart` (case-sensitive), set **Type** to **Date/Time** and enter a current value.
4. Create `RangeEnd` the same way.

The values only filter data in Desktop. After publishing, the policy overrides them. Use a small slice of recent data while you build.

## Step 2: Filter the table

Select the date column, then **Date Filters** > **Custom Filter**. Use **is after or equal to** `RangeStart` and **is before** `RangeEnd`, both as parameters. Select **Close & Apply**.

Microsoft is explicit: use an equal-to on either `RangeStart` or `RangeEnd`, never both. If both include it, a row can fall into two partitions and appear twice.

If the table has only an integer date key in `yyyymmdd` form, the configuration article shows a function that converts `RangeStart` and `RangeEnd` to the key format, so the filter still folds. Converting the column directly to Date/Time usually breaks folding.

## Step 3: Check query folding

With the real-time option, Microsoft says non-folding transformations cannot be used. For SQL-based sources such as SQL Database, Azure Synapse, Oracle and Teradata, the folding check is reliable. For other sources, a warning can appear in the policy dialog. Slow loading in Desktop is a sign the query is not folding.

## Step 4: Define the policy

1. In Table view, right-click the table and select **Incremental refresh**.
2. Turn **Incrementally refresh this table** on. If the switch is disabled, the query lacks the `RangeStart` and `RangeEnd` filter.
3. Set **Archive data starting** to the history you want to keep.
4. Set **Incrementally refresh data starting** to the window that refreshes each time.
5. Select **Get the latest data in real time with DirectQuery (Premium only)**. This automatically enables **Only refresh complete days**.
6. Optionally use **Detect data changes** with an audit column that is not the partitioning column.
7. Select **Apply**. This does not load data.

Microsoft notes that deleted rows are not detected by change detection. Only soft deletes, rows marked deleted with an updated date, are noticed.

## Step 5: Publish and refresh

Save and publish to a Premium workspace. If the model will be large, enable the large model storage format before the first refresh. The policy takes effect only after the first manual or scheduled refresh in the service, and that first refresh can take a long time because it loads the full archive. Later refreshes reload only the refresh period.

Microsoft says that on each refresh the service rolls the periods forward and updates the DirectQuery partition filter. The partitions are not visible in the service.

## Limits to know

- **Single source.** All partitions, import or DirectQuery, must query one data source.
- **Republishing.** It removes existing partitions and the data already in the model.
- **Time zone.** The current date and time default to UTC at refresh. You can configure another time zone for on-demand, scheduled and REST refreshes. Refreshes not started through the service, such as an XMLA TMSL refresh, use UTC.
- **Composite models.** The incremental refresh pages read do not mention them.

## Keep the report responsive

For reports on a real-time model, Microsoft suggests enabling automatic page refresh at a fixed interval or on change detection, so reports pick up the latest data. The pages read give no performance figures for DirectQuery partitions, so test with realistic data volumes. Keep the DirectQuery window small by choosing a short refresh period and complete-day refresh, and make sure the source has an index on the date column used by the filter. The index advice is general database practice and is not stated on the Microsoft pages.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Premium](https://www.m365.fm/entity/power-bi-premium/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [Power BI Performance Analyzer](https://www.m365.fm/entity/power-bi-performance-analyzer/)

## Sources

- [Microsoft Learn: Incremental refresh and real-time data for semantic models](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview)
- [Microsoft Learn: Configure incremental refresh and real-time data](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-configure)
