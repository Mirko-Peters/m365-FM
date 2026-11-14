---
title: "Power Apps Modern Data Grid vs Gallery: When to Use Which Control"
summary: "Power Apps modern Data grid versus Gallery in canvas apps: what each control is, documented properties and limits, row virtualization, delegation, and a decision guide based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [power-apps, canvas-app, dataverse]
keypoints:
  - "Microsoft Learn recommends the Data grid, not the Table control, for tabular data in canvas apps. The page does not compare it with Gallery."
  - "Gallery holds other controls in a template, so each record can have custom layout. The Data grid shows fixed columns and rows."
  - "The Data grid turns on row virtualization for large datasets (more than 2,000 records). Text wrapping on any column turns it off."
  - "The Data grid has no per-column font, no zebra rows and one shared row height. Attachment columns from Dataverse are not rendered."
  - "Delegation still matters: the data row limit is 500 by default and can be raised to 10,000."
faq:
  - q: "What is the modern Data grid control?"
    a: "Microsoft Learn describes it as a column-and-row grid built on Fluent UI that shows records from a data source, with optional search, sortable columns and selectable rows. Microsoft says it is the recommended control for tabular data in canvas apps, instead of the Table control."
  - q: "How do I turn on modern controls?"
    a: "According to Microsoft Learn, open the app for editing, select Settings > Updates, open the New tab and turn on Modern controls and themes. The app then refreshes with the new authoring menu, and classic controls move into the Classic categories."
  - q: "Which data sources work with the Data grid?"
    a: "Microsoft Learn says Items accepts a Dataverse table, a collection or an inline table expression. AI row summaries work only with a directly connected Dataverse table."
  - q: "What can't the Data grid do?"
    a: "Microsoft Learn lists these limits: attachment columns from Dataverse aren't rendered, no per-column font size or color, no alternating row colors, no variable row height, and no custom search placeholder text. Search might not be delegable on all data sources."
  - q: "Is there a limit on how many rows a canvas app reads?"
    a: "Yes. Microsoft Learn says the data row limit defaults to 500 records and can be set up to 10,000 under Settings > General. Nondelegable queries run locally on only that many records, which can give incorrect results."
---
Use the Data grid when you need rows and columns that users can scan, sort, search and select. Use a Gallery when each record needs its own layout, with images, buttons and nested controls. That is the practical split, and this article shows where Microsoft Learn supports it and where the documentation says nothing.

## What Microsoft documents

Microsoft Learn describes the modern **Data grid** as a Fluent UI grid that displays records from a data source, with optional search, sortable columns and selectable rows. It states that the Data grid is the recommended control for tabular data in canvas apps, instead of the **Table** control, for better performance and usability in data-dense scenarios.

The page does not compare the Data grid with the **Gallery** control, and it does not give a preview or general availability label. So the comparison below puts two separate pages side by side. It is not a Microsoft ruling.

## Side-by-side view

| Topic | Data grid (modern) | Gallery |
|---|---|---|
| Purpose | Tabular display of records | Container that shows a set of data, one template per record |
| Layout | Columns, one shared row height | Any layout you build in the template |
| Columns or fields | Text, Number, Phone, Email, URL, Button; Image column supported | Any controls in the template |
| Search and sort | Built-in properties `Searchable` (false by default) and `Sortable` (true by default) | Build with `Filter` and your own controls |
| Selection | `Selected`, `SelectedItems`, `SelectMultiple`, `ShowSelector` | `Selected`, `Default` |
| Large data | Row virtualization for datasets with more than 2,000 records; `Pagination` and `PageSize` properties | `DelayItemLoading` and `LoadingSpinner` are listed as properties; Microsoft links them from a performance tip |
| Known limits | No zebra rows, no per-row height, no per-column font | Nesting depth of 2, some unsupported child controls |

## Data grid details to know

- **Items** accepts a Dataverse table, a collection or an inline table expression. Changing the data source refreshes the columns.
- Columns are locked by default. Select a column and choose **Unlock** to customize it. Column text is a Power Fx formula evaluated per row with `ThisItem`.
- Row virtualization turns on automatically for large datasets. Wrapping text on any column disables it, and the app checker flags this.
- `Reset(DataGrid1)` clears the grid and its selection.
- **Pagination** accepts `Pagination.None` (the default, one fetch limited by the app's data row limit), `Pagination.Auto` and `Pagination.Number`. **PageSize** sets the records per fetch or numbered page, and an invalid value falls back to 100. Pagination does not bypass delegation limits.
- **Searchable** is false by default. With **DelegateSearch** set to true, the grid exposes `SearchText` and you filter in the **Items** formula instead. Built-in search checks only the loaded records, so a search with no match does not prove the remote table has none.
- AI row summaries need a Dataverse table with a configured row summary and an admin setting for **Summary in canvas data grid**. Microsoft says summaries can be incomplete or incorrect, so users should verify them.

## Gallery details to know

- Each field in a record is its own control in the template, and changes to the template apply to all items.
- **Flexible height** galleries can shift the visible item if a user scrolls before all items load.
- Display form, Edit form, PDF viewer, Power BI tile, Rich text editor, Scrollable screen and Web barcode scanner are not supported inside a gallery.
- A gallery can be nested to a depth of 2 only.
- Avoid `OnChange` rules on ComboBox, DatePicker, Slider or Toggle controls inside a gallery when they patch the gallery's data source. This can cause a patch-and-reload cycle.

## Delegation applies to both

Neither control removes the data row limit. The default is 500 records and the maximum is 10,000, set under **Settings** > **General**. If any part of a query is nondelegable, Power Apps delegates none of it and runs it locally on the first 500 records by default. Setting the limit to 1 while testing makes nondelegable formulas easy to spot. Delegable sources named by Microsoft include Dataverse, SharePoint, SQL Server and Salesforce. The Data grid page adds that search might not be delegable on all data sources and that a delegation warning might not appear.

## Decision guide

1. **Many columns, scanning and selecting rows:** Data grid.
2. **Cards, images, buttons or mixed content per record:** Gallery.
3. **Replacing an old Table control:** Data grid, as Microsoft recommends.
4. **Need zebra rows, variable row heights or per-column fonts:** the Data grid page lists these as limitations. The Gallery page does not describe equivalent built-in options, so you would build them yourself in the template. Check this in your own app.
5. **Large Dataverse tables:** either control needs delegable filters. The Data grid adds virtualization after the data arrives.

## What the pages do not say

The Data grid page does not describe in-grid editing, row or column count limits beyond the virtualization threshold, or a preview or general availability label. The modern controls overview explains how to turn on modern controls but does not name individual controls in text. Test inline editing needs in your own app before you commit.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Canvas app](https://www.m365.fm/entity/canvas-app/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Data grid modern control](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/modern-control-data-grid)
- [Gallery control in canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-gallery)
- [Modern controls and theming in canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/overview-modern-controls)
- [Understand delegation in canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview)
