---
title: "Power Query in Excel: Import, Clean, Merge and Refresh Data"
summary: "Power query in Excel imports and cleans data without formulas. Learn where to find it, From Table/Range, Applied Steps, merge vs append, loading and refresh."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, power-query, power-query-m, power-bi-desktop]
keypoints:
  - "Power Query in Excel is on the Data tab in the Get & Transform Data group. It connects to data, shapes it and loads it into a worksheet or the Data Model."
  - "Every change you make is recorded as a step in Applied Steps. The original source is not changed, and the steps run again at each refresh."
  - "Append stacks rows from tables with the same columns. Merge joins two tables on matching key columns, and the matching columns need the same data type."
  - "Use Data, Refresh All to rerun queries. In Connection Properties you can refresh at an interval or when the file opens."
  - "Excel for Mac and Excel for the web support parts of Power Query, and Microsoft's pages differ on what each can author, so check your own build."
faq:
  - q: "Where is Power Query in Excel?"
    a: "On the Data tab, in the Get & Transform Data group. Use Get Data to connect to a source, or From Table/Range to start from data already in your workbook. In Excel 2010 and 2013 on Windows it was a separate add-in with its own ribbon tab, which Microsoft has since deprecated."
  - q: "What is the difference between merge and append in Power Query?"
    a: "Append stacks the rows of one query under another, which suits monthly files with identical columns. Merge joins two tables side by side on matching key columns, like a lookup. For a merge, the paired key columns must have the same data type, and you choose a join kind such as left outer or inner."
  - q: "Does Power Query change my original data?"
    a: "No. Microsoft says the transformations in Power Query don't modify the source data. Each step is recorded in Applied Steps and runs again when you refresh, and the result is loaded to a worksheet or the Data Model. Your source file or table stays as it was."
---
Power Query in Excel is the tool on the **Data** tab, in the **Get & Transform Data** group, that connects to data, cleans and reshapes it, and loads the result into a worksheet. The steps you click are recorded and run again at every refresh, so a monthly cleanup becomes one click. This article is for [Excel](https://www.m365.fm/entity/excel/) users who copy, paste and fix the same exports every week and want to stop. You'll find where to start, how to clean a table, how to append and merge, how to load and refresh, and where the limits are on Mac and the web.

Microsoft describes four phases: connect to the data, transform it, combine it with other sources, and load it. The original source stays unchanged throughout. That last point is what makes it safe to experiment. You can't break the export you started from.

## What Power Query is and where to find it

[Power Query](https://www.m365.fm/entity/power-query/) is a data preparation engine with a graphical editor. According to Microsoft's page on [what Power Query is](https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query), it does extract, transform and load work, has no storage of its own, and leaves the destination to the host product. Excel is one host. [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/) is another, and the two share the core editor. Connectors and destinations can differ by host, so don't assume that a query you saw in one product looks identical in the other.

Where it lives depends on the Excel version, per Microsoft's [overview of Power Query in Excel](https://support.microsoft.com/en-us/excel/about-power-query-in-excel):

- **Excel 2016, 2019 and Microsoft 365 for Windows.** Built in. Go to **Data** and look at the **Get & Transform Data** group.
- **Excel 2010 and 2013 for Windows.** Power Query was a free add-in with its own ribbon tab. Microsoft says it has been deprecated, though it may still work.
- **Excel for Mac.** Supported for refreshing from several sources. It isn't available in Excel 2016 or 2019 for Mac.
- **Excel for the web.** Supported in part. More on that below.

On Windows, Microsoft also lists .NET Framework 4.7.2 or later, and the WebView2 Runtime for the web connector, as requirements. If the commands are missing on a work PC, ask IT whether the build is current before you assume the feature is removed.

## How to use Power Query in Excel: your first query

The easiest start is data you already have in a workbook.

1. Click any cell in your Excel table. If your data is a plain range, press **Ctrl+T** first to turn it into a table.
2. Go to **Data** > **Get & Transform Data** > **From Table/Range**.
3. The **Power Query Editor** opens with a preview of your data.
4. Make your changes (see the next section).
5. Select **Home** > **Close & Load**.

Microsoft's page on importing from an Excel table says the result goes to a new worksheet by default and the original sheet isn't changed. Use **Load To** if you want a different destination. Rename the new sheet so nobody confuses it with the source.

To connect to something else, use **Data** > **Get Data** and choose a source: a file, a database, an online service, the web. After you select it, you get a preview and a choice between **Load** (straight to Excel) and **Transform Data** (open the editor first). My advice is to pick **Transform Data** nearly every time, even when you think the data is clean. The editor is where you set the column types, and wrong types cause most refresh errors later.

If you want a blank start, the same page lists **Data** > **Get Data** > **From Other Sources** > **Blank Query**, or **Launch Power Query Editor** under Get Data.

### The editor in plain words

- The **data preview** shows your table and updates after each change.
- The **Query Settings** pane lists the **APPLIED STEPS**. Each action you take adds a step, such as Source or Changed Type. You can select a step to see the data at that point, change a step, or delete it.
- The **Queries** pane lists all queries in the workbook. Open it with the arrow beside the preview.
- The **Advanced Editor** lets you see and edit the underlying script in the [Power Query M](https://www.m365.fm/entity/power-query-m/) language. Microsoft notes that every step you build in the interface is written in M. You don't need to touch it to get value from the tool.

## Clean and reshape data with steps

Typical cleanup jobs in the editor: filtering rows, removing columns, changing data types, splitting a column, replacing values. The editor records each of them as a step. The commands sit on the editor's ribbon and in the menu you get when you right-click a column header, and which ones you see depends on the column type, so check the header menu before you hunt through the ribbon.

A routine that works for most exports:

1. **Set the types first.** Check the type icon next to each column header. Dates, numbers and text behave differently in later steps and in merges.
2. **Remove what you don't need.** Fewer columns mean a smaller, faster result and fewer surprises when the source changes.
3. **Filter rows.** Use the arrow in the column header to remove blanks or values you don't want.
4. **Fix text.** Replace typos and old codes, trim, or split a column that holds two pieces of information.
5. **Rename the query** in the Query Settings pane so you can find it later.

Because Applied Steps is a list, you can fix an earlier mistake without starting over. If a step fails after the source changes, look at the first step with an error. Most of the time it points to a column whose name or type changed.

One caution about renamed columns: Microsoft's refresh page notes that new source columns appear in Power Query only after you review the **Source** step, and a yellow bar saying the preview may be out of date means you should refresh the local cache. If a new column doesn't show up, look at those two things first.

## Combine data: append and merge

These two commands do different jobs, and people mix them up.

**Append** stacks rows. Use it when you have the same kind of table many times, for example one export per month. Microsoft describes an append as stacking the rows of one query onto another. There are two flavors: an inline append builds on the existing query, and an intermediate append creates a new query each time.

**Merge** joins two tables side by side based on matching values, like a lookup. Microsoft's page on [merging queries](https://support.microsoft.com/en-us/office/merge-queries-power-query-fd157620-5470-4c0f-b132-7ca2616d17f9) gives the steps:

1. Make sure you have at least two queries with a column to match on. The matching columns need the same data type, such as Text or Number.
2. In the editor, go to **Home** > **Merge Queries**. The result becomes a new step in the current query. If you want a separate query instead, open the arrow next to Merge Queries and choose **Merge Queries as New**.
3. Choose the primary table and its key column, then the related table and its key column. For several key columns, select them in the same order in both tables.
4. Check the match count shown in the dialog. If it's lower than you expect, the key columns probably differ in spelling, spacing or type.
5. Choose a **Join Kind** (below) and select **OK**.
6. A new column appears. Select the **Expand** icon next to its header and tick the related columns you want to add.

The join kinds, per Microsoft:

- **Left outer** keeps all rows of the primary table and the matches from the related table.
- **Right outer** keeps all rows of the related table and the matches from the primary table.
- **Full outer** keeps all rows from both.
- **Inner** keeps only rows that match in both.
- **Left anti** keeps primary rows that have no match. **Right anti** keeps related rows that have no match.
- **Cross** pairs every primary row with every related row.

The position of a table matters, because left and right depend on which one you picked first. The checkbox **Use fuzzy matching to perform the merge** matches approximate values, and Microsoft says it only works on text columns. If a lookup was your habit before, a merge with a left outer join is the closest match, and a left anti join is a quick way to see which rows have no match, say orders without a customer record.

Microsoft also mentions privacy levels. Power Query classes each source as Public, Organizational or Private, and uses these to prevent accidental combining of data in ways that could expose private information to another source. If a merge asks you about privacy levels, read the message before you click through.

## Load a query and refresh it

Close the editor with **Home** > **Close & Load**. Microsoft's page on creating, loading and editing a query explains these destinations:

- **Close & Load** sends the result to a worksheet.
- **Close & Load To** lets you pick another destination, such as the Data Model. In the Import Data dialog, tick **Add this data to the Data Model** when you plan to build PivotTables over several tables.
- If Load To is disabled, use Close & Load, then go to **Data** > **Queries & Connections**, right-click the query on the Queries tab and choose **Load To**.

To change the defaults, go to **File** > **Options and settings** > **Query Options** > **Data Load**. You can use standard load settings or set custom defaults to load to a worksheet or to the Data Model.

To edit a query later, select a cell in its data and choose **Query** > **Edit**, or right-click the query in **Queries & Connections** and choose **Edit**.

### Refresh

Refreshing reruns every step against the current source. The ways, from Microsoft's [refresh page](https://support.microsoft.com/en-us/excel/refresh-an-external-data-connection-in-excel):

- **Data** > **Refresh All** updates everything in the workbook (**Ctrl+Alt+F5**). The arrow beside it offers **Refresh** for the selected item (**Alt+F5**). **Esc** stops a refresh.
- For automatic refresh, go to **Data** > **Queries & Connections**, open the **Connections** tab, right-click a connection and choose **Properties**. On the **Usage** tab you can set **Refresh every** (in minutes) and **Refresh data when opening the file**.
- **Enable background refresh** on the same tab lets you keep working while the query runs. It isn't available for OLAP queries or connections that feed the Data Model.

Stored passwords aren't encrypted, and Microsoft advises against saving them. Clear **Save password** on the Definition tab and Excel asks once per session.

If you send the workbook to someone, they may need access to the source. A query that reads a file on your drive or a site they can't open will fail on their machine. Put the data source in a shared location, or send the loaded results as values.

## Power Query on Mac and in Excel for the web

The two platforms support some of the tool, but Microsoft's pages don't line up completely.

**Excel for the web.** Microsoft's page says you can import from sources including an Excel workbook, Text/CSV, XML, JSON, SQL Server, a SharePoint Online list and OData, plus a blank table or blank query. You can open the **Power Query Editor** (**Data** > **Get Data** > **Launch Power Query Editor**), load with **Close & Load**, and refresh with **Data** > **Refresh All**. Viewing and refreshing queries is available to all Microsoft 365 subscribers, while more functionality needs a business plan or an enterprise plan (E3 and above). Some features need third-party cookies enabled in the browser.

**Excel for Mac.** One Microsoft page says you start with **Data** > **Get Data** > **Get Data (Power Query)**, that shaping needs Microsoft 365 and version 16.69 or later, and that **Transform Data** opens the editor. On the same page, a separate section states that authoring queries in the editor isn't available in Excel for Mac, and describes writing queries in VBA on Windows and importing the module on Mac. I can't reconcile those two statements, so test on your own Mac before you build a process around it. SQL Server import is described as Insiders Beta only.

## When Power Query isn't enough

I'll be direct about this: Power Query is for preparing data, not for storing it. Microsoft says the host product determines where results go, which in Excel means a worksheet or the Data Model. A worksheet has a fixed row limit, so a very large query result won't fit on a sheet. Load it to the Data Model instead, or move the work to a database or a dedicated pipeline.

Other limits worth knowing:

- Queries read the source when they run. They don't stream live changes into the workbook.
- Collaboration is awkward. Two people editing the same query in a shared workbook is a bad idea. Agree on one owner and give queries clear names.
- If you handle regulated data, remember that a workbook is easy to copy. Follow your organization's rules for where such files may be stored.

## Common mistakes

- Skipping the data types, then wondering why a merge matches nothing.
- Merging on columns of different types or with trailing spaces.
- Using merge when you meant append, or the other way round.
- Loading everything to a worksheet when a connection-only query or the Data Model fits better.
- Saving the source password in the connection.
- Forgetting to refresh before sending a report.
- Moving the source file and then not understanding why the query fails.

## Related topics to explore

- **Remove duplicates in the editor.** Power Query can dedupe a table as a step, which is repeatable, unlike the one-off command on the ribbon.
- **Unpivot columns.** Turn month columns into rows before you build a PivotTable. Microsoft mentions Power Query for exactly this.
- **Parameters.** Microsoft has a page on parameter queries for reusing a query with different inputs.
- **The M language.** Learn how to read the script in the Advanced Editor, starting with the [Power Query M](https://www.m365.fm/entity/power-query-m/) page.
- **Power BI.** Learn how the same editor works in [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/) when your data outgrows Excel.

## Next step

Pick one export you clean by hand every week. Turn it into a table, run it through From Table/Range, set the column types and load it to a new sheet. Next week, paste the new export into the table and press Refresh All. That is Power Query in Excel doing its job.
