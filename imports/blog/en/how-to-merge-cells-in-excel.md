---
title: "How to Merge Cells in Excel (and Unmerge Without Losing Data)"
summary: "How to merge cells in Excel with Merge & Center, what happens to your data, how to unmerge safely, and what to use instead, such as CONCAT and TEXTJOIN."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel]
keypoints:
  - "Select the cells, then choose Home, Merge & Center, Merge Cells. Excel joins them into one cell."
  - "Only the upper-left cell's content survives a merge. Excel deletes the contents of the other cells, so move or combine them first."
  - "To unmerge, select the merged cell and choose Unmerge Cells from the Merge & Center arrow. This doesn't bring back the deleted contents."
  - "Sorting a range with merged cells of different sizes fails with the message that the merged cells must be identically sized."
  - "To combine text from several cells without losing any, use CONCAT or TEXTJOIN in a new cell and keep the source cells unmerged."
faq:
  - q: "How do I merge cells in Excel?"
    a: "Select the cells you want to join, go to the Home tab, open Merge & Center and choose Merge Cells. Excel creates one cell and keeps only the content of the upper-left cell. Choose Merge & Center instead if you also want the text centered across the new cell."
  - q: "Can I merge cells in Excel without losing data?"
    a: "Not with the merge command, because Excel deletes the contents of every cell except the upper-left one. To keep everything, first combine the text with a formula such as TEXTJOIN in another cell, paste the result as values into the top-left cell, and then merge."
  - q: "How do I unmerge cells in Excel?"
    a: "Select the merged cell, open the arrow next to Merge & Center on the Home tab and choose Unmerge Cells. The cell splits back into its original grid. The text stays in the upper-left cell, and the other cells are empty, because Excel deleted their contents when you merged."
---
To merge cells in Excel, select the cells you want to join, go to the **Home** tab and choose **Merge & Center** > **Merge Cells**. The cells become one, and only the content of the upper-left cell stays. Everything else in the range is deleted. This article is for Excel users who format reports, headers and forms and want to merge without wrecking their data. You'll learn the merge options, what happens to your data, how to unmerge, why merged cells break sorting, and what to do instead when you only need text from several cells in one place.

Merging is a layout tool, not a data tool. Keep that in mind and most of the trouble goes away. Microsoft's page on how to [merge and unmerge cells](https://support.microsoft.com/en-us/excel/get-started/merge-and-unmerge-cells-in-excel) covers [Excel](https://www.m365.fm/entity/excel/) for Microsoft 365, 2024, 2021, 2019, 2016 and Excel for the web.

## Merge cells step by step

1. **Check the cells first.** Look at every cell in the block you plan to merge. If more than one holds data, copy what you need somewhere else, because Excel will remove it.
2. **Select the cells.** Drag across the range, for example A1:D1 for a title over four columns.
3. **Open the Home tab.** Find the **Merge & Center** button in the Alignment group.
4. **Choose Merge Cells.** Select **Merge & Center**, then **Merge Cells**, as Microsoft describes it. The cells become one cell.

In Microsoft's words, the contents of the other merged cells are deleted. When the range holds several values, Excel normally asks you to confirm that only the upper-left value will be kept. Don't click OK out of habit.

Formatting also follows the top-left cell. If that cell has a fill color or a border, the merged cell inherits it.

### Which merge option to pick

The Merge & Center button has a drop-down arrow with several choices. The Microsoft page above only describes Merge Cells and Unmerge Cells, so the other entries here come from the drop-down itself:

- **Merge & Center** joins the cells and centers the text. This is the one you click most often for a title.
- **Merge Across** merges each row of your selection separately. Use it when you select a block of several rows and want one merged cell per row.
- **Merge Cells** joins the cells without centering, so the text keeps its alignment.
- **Unmerge Cells** reverses the merge.

You can merge cells next to each other, across or down. Don't expect to merge a selection with gaps in it. Merge each separate block on its own.

### What happens to the data

Take a row with a first name in B2 and a last name in C2. If you merge B2:C2, only the first name remains, and the last name is deleted. That isn't a bug. It's how the command is documented. If you need both values, use the approach in the section on formulas below, or put the data in separate columns and don't merge at all.

## Unmerge cells and fix a mistake

Select the merged cell, open the arrow next to **Merge & Center** on the Home tab, and choose **Unmerge Cells**. That's the whole procedure in Microsoft's article. The merged cell goes back to separate cells. The text stays in the upper-left cell, and the others are empty.

Unmerging doesn't bring back what the merge deleted. If you merged by accident and lost data, press **Ctrl+Z** immediately, before you do anything else. If you've saved and closed the file, check whether your storage keeps earlier versions of the workbook and open the one from before the merge. That depends on where the file lives, so don't count on it.

Two related points from Microsoft's page. You can't split a single, unmerged cell. If you want a cell to look split, merge the cells above it instead. And if the real goal is to spread the contents of one cell over several columns, that's a different task. Microsoft points to a separate article about distributing the contents of a cell into adjacent columns.

### Find merged cells

Merged cells are easy to miss in a sheet you didn't build. Microsoft's page says to use the **Find** command to locate them. In the Find and Replace dialog, you can search by format, and "Merge cells" is one of the alignment options. Do this before you sort or filter a sheet you've inherited.

## Why merged cells cause trouble

The honest advice is to merge only where nothing will sort, filter or calculate on that range. Here is what goes wrong.

**Sorting fails.** Microsoft documents [an error when you sort a range that contains merged cells](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/error-sort-a-range-merged-cell). The message reads: "This operation requires the merged cells to be identically sized." It happens when you merged some but not all of the cells in the range, or when you merged all of them but the merged cells differ in size. The workaround is to unmerge the cells or make every merged cell the same size. The general fix is:

1. Select the whole range you want to sort.
2. On the **Home** tab, open the **Alignment** dialog box launcher in the Alignment group.
3. On the **Alignment** tab, clear the **Merge cells** check box and select **OK**.
4. Sort again.

Microsoft notes that this can change the layout of the data in the range.

**Only one cell holds a value.** A merged block has one value, in the upper-left position. The other cells in the block are empty. A formula that reads across that block, such as a lookup over the whole range, runs into empty cells. Keep merged cells out of the data region and use them only for titles above it.

**Tables.** Merging inside an Excel Table isn't allowed in practice. The Merge command is greyed out, and a table needs one value per cell to keep its columns consistent. If you want a title above a table, put it in the rows above the table, not in the table itself.

## A worked example: a report header and a name column

Two jobs come up more than any other, and they need opposite answers.

**A title over a table.** You have a monthly sales table in A3:D20 and want the title "Sales, October" across the top. Type the title in A1. Select A1:D1, then choose **Merge & Center** > **Merge Cells** (or **Merge & Center** if you want it centered). The title now spans four columns. The table below it is a normal range, so sorting and filtering are unaffected. This is the case merging was made for: one label, above the data, nothing reads from it.

**Full names from two columns.** You have first names in A and last names in B, and you want one full name per row. Merging A2:B2 would delete the last name, and you'd have to do it row by row anyway. Instead:

1. In C2, enter `=CONCAT(A2," ",B2)`, or `=TEXTJOIN(" ",TRUE,A2:B2)` if some cells may be empty.
2. Fill the formula down the column.
3. If you need the names as plain text, copy column C and use **Paste Special** > **Values**. Then you can delete columns A and B if they are no longer needed.

The rule of thumb: merge to arrange what the sheet looks like, and use formulas to change what it contains.

### A short checklist before you merge

1. Does more than one cell in the selection hold data? If yes, combine or move it first.
2. Will anyone sort, filter or build a table on this range? If yes, don't merge in it.
3. Could Center Across Selection give the same look? If yes, use that.
4. Is the file shared? Tell the others that the header cell is merged, so nobody is surprised when they try to select a single column.

## Combine text without merging

A lot of people search for "merge cells" when what they want is to put the contents of two cells into one. Use a formula for that. Nothing is deleted, the sources stay editable, and sorting keeps working.

**CONCAT.** `=CONCAT(A2," ",B2)` joins a first name, a space and a last name. Microsoft describes CONCAT as the replacement for CONCATENATE, which stays in Excel for compatibility. CONCAT also accepts ranges. It has no delimiter argument, and Microsoft suggests TEXTJOIN when you need separators or want to skip empty cells.

**TEXTJOIN.** Microsoft's [TEXTJOIN page](https://support.microsoft.com/en-us/excel/functions/textjoin-function) gives the syntax as `=TEXTJOIN(delimiter, ignore_empty, text1, [text2], …)`. For example, `=TEXTJOIN(", ", TRUE, A2:C2)` joins three cells with a comma and a space. With `ignore_empty` set to TRUE, empty cells are skipped, so you don't get stray commas. Set it to FALSE and blank cells appear as consecutive delimiters. Microsoft lists TEXTJOIN for Excel 2019, 2021, 2024 and Microsoft 365, and for Microsoft365.com. If the result is longer than 32,767 characters, it returns #VALUE!.

If you really need a merged cell that contains both values, do it in this order:

1. Combine the text with `TEXTJOIN` or `CONCAT` in a spare cell.
2. Copy that cell and use **Paste Special** > **Values** in the upper-left cell of the range you will merge.
3. Merge the cells.

The merged cell now shows the combined text, and the helper cell can go.

### A look-alike without merging

If you only want a title to appear centered over several columns, there's an alignment setting that does it without joining the cells: **Center Across Selection** under **Format Cells** > **Alignment** > **Horizontal**. Microsoft's merge page doesn't describe it, so check that it behaves the way you want in your version. Because the cells stay separate, sorting and selecting columns still work.

## Common mistakes

- Merging a range that contains several values and assuming Excel keeps all of them. It keeps the upper-left one.
- Merging inside the data area, then finding that sorting returns the identically-sized error.
- Merging whole columns for layout when column widths or a header row would do the job.
- Trying to split an unmerged cell. You can't. Merge the cells above it, or distribute the contents into columns.
- Merging first and combining text afterward. Build the combined text first.
- Not checking inherited sheets for merged cells before sorting, filtering or building a table.

## Related topics to explore

- **Recovering data after a mistaken merge.** Ctrl+Z works only straight away. Look at whether your file storage keeps versions.
- **Why you can't sort merged cells.** The Alignment dialog fix above is the quick route. The cleaner one is a sheet design that avoids merging in the data region.
- **Merged cells and formulas.** Learn how lookups behave when part of the range is empty, and compare the options before you build a lookup.
- **Merge columns during import.** Power Query can combine columns before data reaches the sheet. Test the result before you rely on it.
- **Building tables without merged headers.** Use one header row with a clear label per column, and a title above the table.

## Next step

When you next need to merge cells in Excel, ask whether it's for layout or for data. For layout above a data range, merge or use Center Across Selection. For data, combine the text with TEXTJOIN in a new cell and leave the source cells alone.
