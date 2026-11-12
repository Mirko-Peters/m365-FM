---
title: "How to Create a Pivot Table in Excel: Steps, Fields and Refresh"
summary: "How to create a pivot table in Excel: prepare the data, use Insert > PivotTable, drag fields, add slicers, then refresh and fix problems. Steps for beginners."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, power-query, power-pivot]
keypoints:
  - "To create a pivot table, select your data, go to Insert, then PivotTable, choose a new or existing worksheet and select OK."
  - "Clean data comes first: one header row, a unique non-blank header in every column, no merged cells and no subtotals in the source."
  - "Drag fields into Rows, Columns and Values. Number fields default to Sum, but a column that Excel reads as text defaults to Count."
  - "A pivot table does not update by itself in every case. Right-click it and select Refresh, or press Alt+F5, after the source data changes."
  - "Format the source as an Excel table so new rows are included when you refresh the pivot table."
faq:
  - q: "How do I make a pivot table in Excel step by step?"
    a: "Select a cell in your data, go to Insert and select PivotTable. Confirm the range, choose New Worksheet or Existing Worksheet and select OK. In the PivotTable Fields pane, tick the fields you want, then drag them between Rows, Columns and Values until the summary shows what you need."
  - q: "Why is my pivot table counting instead of summing?"
    a: "Excel defaults to Count when it reads a value field as text. Usually the column has a few text cells, such as N/A, or numbers stored as text. Clean the column, refresh, or open Value Field Settings and set Summarize Values By to Sum. Keeping one data type per column avoids this."
  - q: "How do I refresh a pivot table in Excel?"
    a: "Right-click anywhere in the pivot table and select Refresh, or select the table and press Alt+F5. To update every pivot table in the workbook, open the arrow under Refresh on the PivotTable Analyze tab and choose Refresh All. You can also tick Refresh data when opening the file in PivotTable Options."
---
To create a pivot table in Excel, click any cell in your data, go to **Insert** > **PivotTable**, choose where the table should go (**New Worksheet** or **Existing Worksheet**) and select **OK**. Then tick or drag fields in the **PivotTable Fields** pane to build the summary. This article is for [Excel](https://www.m365.fm/entity/excel/) users who have a long list of rows, such as sales, tickets or hours, and want totals by customer, region or month without writing a single formula. You'll prepare the data, build the table, change how the numbers are calculated, filter with slicers, keep the table up to date and fix the usual errors.

A pivot table doesn't change your data. It reads the source and shows a summary of it. That's why you can drag fields around as often as you like without risking the original rows.

## Prepare your source data

Most pivot table trouble starts here, before the first click. Microsoft's article on how to [create a PivotTable to analyze worksheet data](https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-bfe9-40a9-a8e9-f99134456576) asks for clean, tabular data with these properties:

- One header row, and every column has a header that is unique and not blank.
- No double header rows and no merged cells.
- No subtotals in the source. Microsoft's overview of PivotTables says to remove existing subtotals before you create the PivotTable.
- No blank rows or columns inside the list.
- One kind of data per column. Don't mix numbers and text.

The last point has a real effect on your results. Microsoft explains that numeric value fields default to **Sum**, but if Excel reads the field as text, it defaults to **Count**. One cell with "N/A" or "n/a" in a column of amounts is enough to cause it. If your pivot table shows counts where you expected totals, look at the source column first.

Next, turn the list into an Excel table: click a cell in the data and press **Ctrl+T**. Microsoft recommends a table as the source, and the overview page adds that tables pick up new data when you refresh the PivotTable. A plain range stops at the last row it was created with. A dynamic named range can also expand, per the same page, but a table is simpler to set up and easier for the next person to understand.

If the data needs reshaping first, for example columns per month that should be rows, Microsoft points to Power Query for unpivoting before you build the table. Our [Power Query](https://www.m365.fm/entity/power-query/) page covers that tool.

## How to create a pivot table in Excel step by step

These steps are for Excel on Windows, as described on Microsoft's page.

1. Select the cells you want to use, or click one cell inside your table or list. Excel picks the surrounding block.
2. Go to **Insert** and select **PivotTable**.
3. In the **Create PivotTable** dialog, check the table or range shown in the Table/Range box. If it's wrong, correct it.
4. Choose where to put the report: **New Worksheet** or **Existing Worksheet**. A new sheet keeps the source and the summary apart, which is easier to read and harder to break.
5. Select **OK**. Excel opens the **PivotTable Fields** pane on the right. Until you add fields, the PivotTable area on the sheet is empty. That's normal.

The dialog has an optional checkbox, **Add this data to the Data Model**. Leave it off for a first pivot table. It's meant for cases where you combine several tables or work with very large data, and the arrow on the PivotTable button also offers **Get from External Data Source**, **Get from Data Model** and **Get from Power BI**. If you reach the point where you need relationships between tables, look at [Power Pivot](https://www.m365.fm/entity/power-pivot/).

### Let Excel suggest a layout

If you don't know what to build, **Insert** > **Recommended PivotTables** shows a few ready-made layouts for your data. Microsoft's PivotTable page I opened doesn't walk through this feature, but it states that PivotTable recommendations are part of Microsoft 365's connected experiences and use AI services to analyze your data. If your organization has turned off connected experiences, you won't get them. The manual route above always works.

## Build the layout with the PivotTable Fields pane

The pane lists every column header from your source as a field. You can tick a field's checkbox, or drag it into one of the areas. Microsoft's defaults when you tick:

- Non-numeric fields go to **Rows**.
- Date and time fields go to **Columns** as a hierarchy.
- Numeric fields go to **Values**.

You can drag any field to another area afterwards. A quick example: with a sales list, tick **Region** (goes to Rows) and **Amount** (goes to Values), and you have a total per region. Drag **Product** into Columns and the same totals split by product.

Here is what the areas do:

- **Rows** lists items down the left side, one row for each unique value.
- **Columns** lists items across the top.
- **Values** holds the numbers that get summed, counted or averaged.
- **Filters** puts a field above the table so you can show one value at a time. Microsoft's separate page on filtering PivotTables describes this as a report filter.

The overview page also mentions that you can switch the form of the report between **Compact**, **Outline** and **Tabular**. If the default layout squeezes several fields into one column, try Tabular, which is easier to read when you copy the result somewhere else. Check what each form looks like on your own data.

### Change the calculation

To change how a value is calculated, click the arrow next to the field in the Values area and choose **Value Field Settings**. On the **Summarize Values By** tab you can switch between Sum, Count, Average, Max, Min and the other options listed there. Excel updates the Custom Name automatically, and you can edit it. A name like "Sum of Amount" is fine for yourself, but if you share the report, rename it to something readable. Microsoft recommends renaming only after you're done setting up, because changing the calculation changes the name again.

The **Number Format** button in the same dialog sets the format for the whole field, such as currency or a fixed number of decimals. Do this once here instead of formatting cells by hand, because manual cell formatting can vanish when the layout changes. If you want to keep your formatting, open **Options** on the PivotTable Analyze tab and, under **Layout & Format**, tick **Preserve cell formatting on update**. The same tab has **Autofit column widths on update**, which you might want to turn off if your column widths keep jumping.

### Show values as percentages

The **Show Values As** tab in Value Field Settings changes what the number means. It can display each value as a share of a total, for example **% of Grand Total**. To show an amount and its percentage side by side, drag the same field into Values twice and give each copy its own setting. That's a good trick for a "Revenue" and "Share of revenue" pair.

## Filter with slicers and report filters

Once the table works, the next question is usually how to look at one part of it. There are three tools, and all of them are on Microsoft's pages.

**Slicers** are buttons that stay visible next to the table. Click anywhere in the PivotTable, go to **Insert** > **Slicer**, tick the fields you want in the Insert Slicers dialog and select **OK**. You get one slicer for each field. Click a button to filter, hold **Ctrl** and click to select more than one item, and use **Clear Filter** to reset. Microsoft's page on [using slicers to filter data](https://support.microsoft.com/en-us/office/use-slicers-to-filter-data-249f966b-a9d5-4b0f-b31a-12651785d29d) adds a useful detail: a slicer can control more than one PivotTable, but only if they share a data source. Select the slicer, go to the **Slicer** tab, choose **Report Connections** and tick the PivotTables.

**Filter drop-downs.** The arrow in a row or column label opens a menu with **Label Filters** and **Value Filters**. Under Value Filters you'll find **Top 10**, which can show the top or bottom items by number, percentage or sum. In the item list you clear **Select All** and tick only what you need, or type in the **Search** box.

**Right-click filtering.** Select items in the table, right-click, choose **Filter**, and then **Keep Only Selected Items** or **Hide Selected Items**. **Clear Filter** removes it.

Report filters (the Filters area) have a nice extra: **Show Report Filter Pages** creates one worksheet per value of the filter field. That's a quick way to produce a separate sheet per region.

## Refresh a pivot table when the data changes

A pivot table is a snapshot of the source at the moment it was built or last refreshed. If a new row lands in the source, the table may not show it right away. Microsoft's page on [refreshing PivotTable data](https://support.microsoft.com/en-us/excel/refresh-pivottable-data) lists these options:

1. **Refresh one table.** Select the PivotTable, go to **PivotTable Analyze** and select **Refresh** in the Data group, or press **Alt+F5**. Right-clicking the table and choosing **Refresh** works too.
2. **Refresh everything.** Open the arrow under **Refresh** and select **Refresh All**. This updates every PivotTable in the workbook.
3. **Refresh on open.** Select the table, open **Options** on the PivotTable Analyze tab, go to the **Data** tab and tick **Refresh data when opening the file**.

Microsoft's page also describes an Auto Refresh setting, where PivotTables built from workbook data update when the source changes. It states that this is currently limited to participants in the Microsoft 365 Insider program, and that older Excel versions don't refresh automatically, though they can refresh on open. So don't count on it unless you've confirmed that your build has it. Until then, a manual refresh or refresh on open is the safe route.

### What if the new rows still don't show?

The source range is probably too small. If your data is an Excel table, new rows are included automatically on refresh. If it's a plain range, the PivotTable still points at the old cells. Fix it as Microsoft describes in its article on [changing the source data for a PivotTable](https://support.microsoft.com/en-us/excel/change-the-source-data-for-a-pivottable): select the PivotTable, go to the **Analyze** tab, select **Change Data Source** twice (the button and then the menu item), select **Select a table or range**, enter the range in the Table/Range box and select **OK**. Microsoft adds that if the data changes a lot, for example by gaining or losing columns, a new PivotTable is often the cleaner choice.

If the PivotTable uses the Workbook Data Model, you can't change the data source this way.

## Delete or clean up a pivot table

Microsoft's article on deleting a PivotTable gives two ways. First, select the entire PivotTable and press **Delete**. If you see "Cannot change this part of a PivotTable report," press **Ctrl+A** to select everything and press Delete again. Second, click a cell in the PivotTable, go to **PivotTable Analyze** > **Select** > **Entire PivotTable**, and delete it from there. If the PivotTable sits alone on a sheet, you can delete the whole sheet.

Be careful with that last route when the sheet also holds your source data. Microsoft's page doesn't say what happens to the source, so check that your data lives on a different sheet before you delete anything. Slicers are separate objects. Select a slicer and press **Delete** to remove it.

## When a pivot table gives wrong results

- **Counts instead of sums.** A text cell in the value column. Clean the data or set Summarize Values By to Sum, then check that no cells still show numbers as text.
- **A field is missing from the list.** The column may have no header, or the range doesn't include it. Check the first row of your source and the Table/Range box in Change Data Source.
- **Old numbers.** You haven't refreshed. Use Alt+F5.
- **Dates behave like text.** If a date column is stored as text, Excel can't treat it as a date. Convert it to real dates in the source and refresh.
- **The layout looks scrambled.** Check the source for merged cells or a second header row. Microsoft's data requirements rule out both.

For work you'll hand to others, give the pivot table a clear sheet name, such as "Sales by Region", and a short note above it saying which data it reads. It costs a minute and saves the next person from guessing.

## Common mistakes

- Building the table from a range with blank rows, so only the part above the gap is included.
- Leaving subtotal rows in the source and then double-counting in the summary.
- Typing numbers over the pivot table. It's a report, so change the source and refresh.
- Renaming fields before the calculation is final, which makes Excel reset the name.
- Forgetting to refresh before sending the file.
- Pointing a slicer at tables that use different data sources, then wondering why it can't connect.

## Related topics to explore

- **Group dates by month or quarter.** A common next step for sales and time data.
- **Slicers for several tables.** Connect one slicer to a family of PivotTables for a simple dashboard.
- **PivotCharts.** A chart linked to the pivot table, which changes when the table changes.
- **Power Query before the pivot.** Unpivot or merge data first with [Power Query](https://www.m365.fm/entity/power-query/) when your export has one column per month.
- **Data Model and measures.** Combine several tables with [Power Pivot](https://www.m365.fm/entity/power-pivot/) once a single list isn't enough.

## Next step

Take one of your own lists, press Ctrl+T to make it a table, and create a pivot table from it with only one field in Rows and one in Values. When that works, add a slicer and refresh once after you change a number in the source. That's the whole loop for how to create a pivot table in Excel: prepare, build, filter and refresh.
