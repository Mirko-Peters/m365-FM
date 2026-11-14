---
title: "Shrink Large Power BI Models With DAX Studio and VertiPaq Analyzer"
summary: "How to open View Metrics in DAX Studio, read table and column sizes, and apply Microsoft's documented data reduction techniques to cut memory in Import models, with the limits of what the tool pages explain."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [power-bi, vertipaq, dax, power-bi-desktop]
keypoints:
  - "In DAX Studio, Advanced, View Metrics analyzes the connected model and lists the tables and columns that use the most memory first."
  - "Export metrics as a .vpax file to share a model's size profile, or as an obfuscated .ovpax with a .dict file that maps the names back."
  - "Microsoft's data reduction guide: remove columns and rows, group and summarize, optimize data types, prefer Power Query columns, disable query load and disable auto date/time."
  - "Group by and summarize is called perhaps the most effective technique, but it removes detail below the new grain."
  - "Metrics show memory when the model is loaded. The saved file can be smaller because of extra compression."
faq:
  - q: "How do I see which columns use the most memory in a Power BI model?"
    a: "Connect DAX Studio to the model and use the Advanced tab, View Metrics. The default Table Metrics view sorts so the tables and columns using the most memory appear first, and the Column Metrics tab shows the same information as one flat list of columns."
  - q: "What permissions does View Metrics need?"
    a: "The DAX Studio documentation lists none needed for Power BI Desktop, Contributor for Power BI Premium over the XMLA endpoint, and Database Admin for Azure Analysis Services and SSAS."
  - q: "What is the most effective way to reduce an Import model's size?"
    a: "Microsoft Learn calls group by and summarize perhaps the most effective technique, because it raises the grain of fact tables. It also warns of a distinct trade-off, loss of detail, and says the reduction could reach 99 percent if day level or order line reporting is no longer needed."
  - q: "Does auto date/time make a model bigger?"
    a: "Microsoft Learn's data reduction guide says that with auto date/time enabled, Power BI creates hidden tables for each date column, and that these hidden calculated tables increase the size of the model. You can turn it off in File, Options and settings, Options, under Time intelligence."
---

A Power BI model that refreshes slowly, hits memory limits or exceeds a size cap usually has a few columns doing most of the damage. You do not have to guess which. DAX Studio's View Metrics shows the storage footprint of every table and column in the model, and Microsoft's data reduction guide lists what to change. This guide connects the two.

## Step 1: Open View Metrics

In DAX Studio, connect to the model and go to the **Advanced** tab. The metrics section has **Import Metrics**, **Export Metrics** and **View Metrics**. View Metrics analyzes the current model and produces a report.

Required permissions, from the DAX Studio documentation:

| Environment | Minimum permission |
|---|---|
| Power BI Desktop, SSDT, Power Pivot | None needed |
| Power BI Premium over the XMLA endpoint | Contributor |
| Azure Analysis Services and SSAS | Database Admin |

The report has tabs:

- **Table Metrics**, the default view. Tables can be expanded to show their columns, and the largest memory users appear first.
- **Column Metrics**, a flat list of columns across all tables.
- **Relationships** and **Partitions**. Partitions matter for models with incremental processing.
- **Summary**, with total memory usage, compatibility mode, the last processed time and when the analysis ran.

The **Include** options dialog controls how statistics are read. **Read Statistics from data** is on by default and scans data for accurate column, table and relationship statistics. Reading statistics from DirectQuery data is off by default, and the page describes it as a lot more expensive and not recommended.

## Step 2: Understand the numbers

The DAX Studio page does not define each column. SQLBI's article on the VertiPaq Analyzer does:

- **Cardinality** is the number of rows in a table or unique values in a column.
- **Data Size** is the compressed data in segments and partitions, excluding dictionaries and hierarchies.
- **Dictionary Size** is the bytes used by dictionary structures.
- **Columns Hierarchies Size** is for automatically generated column hierarchies.
- **Columns Total Size** adds those three together for a column.
- **Table Size** adds Columns Total Size, user hierarchies and relationship size.
- **Table Size %** and **Database Size %** give the share of the table and of the whole database.
- **Encoding** shows HASH or VALUE.

SQLBI says the Columns view makes it easy to find the most expensive columns regardless of table. It does not discuss high cardinality or give reduction advice, so for the reduction side use Microsoft's guide below. Note also the accuracy remark in the DAX Studio documentation: all metrics reflect memory used when the model is loaded. Saving to disk applies extra compression, so the saved file may be smaller than the number you see.

## Step 3: Apply Microsoft's data reduction techniques

Learn's guide for Import models lists these techniques. Work through the biggest columns first.

1. **Remove unnecessary columns.** Learn calls this vertical filtering. You can probably remove any column that is not used for reporting, grouping, filtering or sorting, or for a relationship. Removing columns can break reports.
2. **Remove unnecessary rows.** Load as few rows as possible. Learn recommends not loading all available history unless it is a known reporting requirement, and filtering by entity, such as one sales region.
3. **Group by and summarize.** Perhaps the most effective technique, since it raises the grain of fact tables. The trade-off is loss of detail, and Learn says a reduction of up to 99 percent is possible when day level or order line reporting is no longer needed.
4. **Optimize column data types.** Learn says the data structures achieve their highest optimization for numeric data, which uses value encoding, while text and other non-numeric data uses hash encoding. Its example: a sales order number with a text prefix such as `SO123456` can have the prefix removed and be converted to a whole number. For large tables with unique or high-cardinality values, this can give significant reduction. Set the default summarization of such columns to `Do Not Summarize`.
5. **Prefer Power Query columns.** Learn says it is less efficient to add table columns as calculated columns than as Power Query computed columns, so create custom columns in Power Query when possible. Model calculated columns can be better when the formula evaluates measures or needs DAX-only functionality.
6. **Disable Power Query query load** for intermediate queries that only support other queries.
7. **Disable auto date/time.** When enabled, it creates a hidden auto date/time table for each date column in Import mode. The hidden tables are calculated tables that increase the size of the model.
8. **Use DirectQuery storage mode** for the largest fact tables, creating a composite model. Learn warns of many security and performance implications.

## Step 4: Turn off auto date/time safely

The auto date/time page gives the path: **File > Options and settings > Options**, then the **Global** or **Current File** page, under **Time intelligence**. Each hidden table has rows for full calendar years covering all dates in the column, plus six calculated columns. Learn warns that turning off the current file option removes the tables, so fix any report filters or visuals that used them. It also says these tables cannot be used with Analyze in Excel or non-Power BI report designers. The page does not discuss model size directly, so verify the gain by comparing View Metrics before and after.

## Step 5: Re-measure and compare

1. Export metrics before changes, as `.vpax`.
2. Change one thing, refresh, and run View Metrics again.
3. Compare Summary total memory and the top columns.
4. Keep the exports so the team can see what each change saved.

If you need to share metrics without exposing names, the `.ovpax` format randomizes object names and writes a `.dict` file to map them back. Import Metrics looks for a matching `.dict` in the same folder.

## Capacity limits to keep in mind

Learn's large semantic model page states a default size limit of 1 GB, and that with the large storage format the limit equals the capacity size or the maximum set by the administrator. The Power BI Desktop upload limit remains 10 GB. For refresh, models close to half the capacity size may exceed available memory during refresh. A smaller model gives you more headroom, which is the practical reason to do this work.

## Mistakes to avoid

- Removing columns without checking dependent reports and relationships.
- Summarizing facts when users still need row-level detail.
- Converting types without checking that the values still sort and join correctly.
- Judging success by file size alone. Use memory in View Metrics.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [VertiPaq](https://www.m365.fm/entity/vertipaq/)
- [DAX](https://www.m365.fm/entity/dax/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)

## Sources

- [DAX Studio documentation: View Metrics](https://daxstudio.org/docs/features/model-metrics)
- [SQLBI: Data model size with VertiPaq Analyzer](https://www.sqlbi.com/articles/data-model-size-with-vertipaq-analyzer/)
- [Microsoft Learn: Data reduction techniques for Import modeling](https://learn.microsoft.com/en-us/power-bi/guidance/import-modeling-data-reduction)
- [Microsoft Learn: Auto date/time guidance in Power BI Desktop](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-auto-date-time)
- [Microsoft Learn: Large semantic models in Power BI Premium](https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-large-models)
