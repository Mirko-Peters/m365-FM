---
title: "How to Unhide All Rows in Excel (Including Row 1)"
summary: "How to unhide all rows in Excel: select the whole sheet, then Home, Format, Hide & Unhide, Unhide Rows. Also row 1, filtered rows, a macro and stubborn cases."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, vba]
keypoints:
  - "To unhide all rows, click the Select All corner of the sheet, then choose Home, Format, Hide & Unhide, Unhide Rows."
  - "To unhide a few rows, select the rows on either side, right-click and choose Unhide, or double-click the double line between the two row numbers."
  - "Row 1 can't be selected from above. Type A1 in the Name Box, press Enter, then use Format, Hide & Unhide, Unhide Rows."
  - "Rows hidden by a filter come back with Data, Clear, not with Unhide. Look for a filter icon in the column headers."
  - "If rows still look hidden after you unhide them, a row height of zero or a protected sheet may be the cause."
faq:
  - q: "How do I unhide all rows in Excel?"
    a: "Click the small triangle in the top-left corner of the sheet, where the row numbers and column letters meet, to select everything. Then go to Home, Format, Hide & Unhide and choose Unhide Rows. Every row that was hidden by the Hide command appears again."
  - q: "How do I unhide row 1 in Excel?"
    a: "You can't select row 1 from above, so select cell A1 another way. Type A1 into the Name Box next to the formula bar and press Enter. Then go to Home, Format, Hide & Unhide and choose Unhide Rows. The first row comes back."
  - q: "Why can't I unhide rows in Excel?"
    a: "The rows may be hidden by a filter, which needs Data, Clear instead. Other causes are a row height set so small it looks hidden, a protected sheet, or selecting only one side of the hidden rows. Select the rows on both sides before you use Unhide."
---
To unhide all rows in Excel, click the **Select All** triangle in the top-left corner of the sheet, then go to **Home** > **Format** > **Hide & Unhide** > **Unhide Rows**. Every row that was hidden with the Hide command comes back. This article is for Excel users who open a workbook with row numbers that skip, and want the data back. You'll learn how to unhide a few rows, all rows, row 1, rows hidden by a filter and rows hidden across a whole workbook, plus what to check when nothing seems to work.

First, work out how the rows disappeared. Row numbers that jump, say from 14 to 20, point to rows hidden by hand. A filter button in a column header points to a filter. The fix is different for each, and [Excel](https://www.m365.fm/entity/excel/) won't tell you which one you have.

## Unhide a few rows

Microsoft's article on how to [hide or show rows or columns](https://support.microsoft.com/en-us/excel/get-started/hide-or-show-rows-or-columns) gives two ways. A double line between two row numbers is the sign that a row is hidden there.

**With the right-click menu:**

1. Select the rows on both sides of the hidden rows. If row 7 is hidden, click the row number 6, hold **Shift** and click the row number 8.
2. Right-click the selection.
3. Choose **Unhide**.

**With a double-click:** Double-click the double line between the two row numbers where the hidden rows are.

The same steps work for columns: select the columns on both sides, right-click and choose **Unhide**, or double-click the double line between them.

The selection must include both neighbors. If you select only row 6, the Unhide command has nothing to act on, and it may be missing from the menu. This is the most common reason people think the feature is broken.

## Unhide all rows on a sheet

When rows are hidden in many places, don't hunt for each one.

1. Click the triangle in the top-left corner, where the row numbers and column letters meet. This selects every cell on the sheet. **Ctrl+A** does the same.
2. Go to the **Home** tab. In the **Cells** group, select **Format**.
3. Under **Visibility**, choose **Hide & Unhide**, then **Unhide Rows**.
4. For hidden columns, repeat step 3 and choose **Unhide Columns**.

The menu path appears on Microsoft's page for the first row and column, which I'll get to next. The Select All step is the usual way to apply it to the whole sheet. Microsoft's hide-and-show page doesn't describe it, so check the result by looking at the row numbers afterward. The numbers should run in order without gaps.

You can also right-click a row number after selecting the whole sheet and choose **Unhide**.

### Why the result may still look wrong

A row that was shrunk to a tiny height instead of being hidden still looks hidden. If the row numbers run in order but a row is a thin line, select it, then use **Format** > **Row Height** under Cell Size and enter a value. Microsoft's first-row page mentions the same option as an alternative: under Cell Size, choose Row Height or Column Width and enter a value that makes the row or column visible again.

## Unhide row 1 or column A

Row 1 is a special case. To unhide a row you normally select the rows above and below it, but nothing sits above row 1. So the right-click method fails. Microsoft's article on [unhiding the first column or row](https://support.microsoft.com/en-us/excel/unhide-the-first-column-or-row-in-a-worksheet) gives the fix:

1. Select cell A1. Type `A1` in the **Name Box** next to the formula bar and press **Enter**. Or use **Home** > **Find & Select** > **Go To**, enter `A1` in the Reference box and select **OK**.
2. On the **Home** tab, in the **Cells** group, select **Format**.
3. Under **Visibility**, choose **Hide & Unhide**, then **Unhide Rows** to show row 1, or **Unhide Columns** to show column A.

Selecting A1 works even though row 1 is hidden, because the cell still exists. Excel then unhides the row that contains the selected cell.

## Rows hidden by a filter

A filter hides rows too, but unhiding them doesn't work. You must clear the filter.

How to tell: a filter button sits in the header of the filtered column. Microsoft's filter article says the drop-down arrow changes to a filter icon when a filter is applied. Rows that don't match are hidden.

The steps from Microsoft's page on [clearing or removing a filter](https://support.microsoft.com/en-us/excel/clear-or-remove-a-filter):

1. To clear one column, click the filter button in its header and choose **Clear Filter from** the column name.
2. To clear every filter on the sheet, go to the **Data** tab and select **Clear**.
3. To remove the filter buttons entirely, select the **Filter** button on the Data tab.

Microsoft also notes that data hidden by a filter may be why you can't find a value you know is there. A filter can sit on any column, so check every header. A second filter on a different column is easy to miss.

## Check what is hidden before you change it

Sometimes you want to see where the hidden rows are before you reveal them, for example when you inherit a file and don't know why parts are missing.

**Locate hidden cells.** Microsoft's page on [locating hidden cells](https://support.microsoft.com/en-au/office/locate-hidden-cells-on-a-worksheet-94d66405-2d11-486d-925b-3575da95e5d8) describes this: press **Ctrl+G**, select **Special**, choose **Visible cells only** and select **OK**. The visible cells are selected, and the rows and columns next to hidden ones show a white border that marks where the hidden sections are.

**Document Inspector.** If you are about to share a file and want to know what you are hiding in it, use **File** > **Info** > **Check for Issues** > **Inspect Document**. Microsoft's general instructions for the inspector recommend running it on a copy, because removed content may not be recoverable. Microsoft's page that I checked does not list hidden rows and columns for Excel, so confirm in the dialog that this option exists in your version.

## Unhide with keyboard shortcuts

Microsoft's shortcut list for Excel includes **Ctrl+9** to hide the selected rows and **Ctrl+0** to hide the selected columns. The unhide counterparts are widely used: **Ctrl+Shift+9** for rows and **Ctrl+Shift+0** for columns. Microsoft's page doesn't list them, and the column shortcut may not respond on some Windows setups, so if it does nothing, use the ribbon. Select rows on both sides of the hidden ones first, just like with the menu.

## Unhide all rows with a macro

If you open many workbooks that hide rows, a short macro saves time. Microsoft's VBA documentation describes the `Hidden` property of a Range. You set it to False to show rows and columns, and the range has to span entire rows or columns. A macro that goes through every sheet is made of these lines, in this order:

- `Sub UnhideAllRowsCols()`
- `Dim ws As Worksheet`
- `For Each ws In ThisWorkbook.Worksheets`
- `ws.Rows.Hidden = False`
- `ws.Columns.Hidden = False`
- `Next ws`
- `End Sub`

To use it, press **Alt+F11**, insert a module with **Insert** > **Module**, paste the code, close the editor, press **Alt+F8**, pick the macro and select **Run**. Save a copy before you run it, since it changes every sheet. Macros are blocked in files from untrusted sources, and your IT team may block them altogether. On a protected sheet the macro may fail, so unprotect the sheet first. If you want to learn more about writing macros, see our [VBA](https://www.m365.fm/entity/vba/) page.

Note that this macro also reveals things that someone hid on purpose, such as helper rows or sensitive figures. Ask before you unhide something in a file that isn't yours.

## When nothing works

- **Unhide is missing from the menu.** You selected only one side of the hidden rows. Select the rows above and below.
- **Rows come back but one still looks hidden.** Its height is tiny. Set a row height.
- **A filter is active.** Use **Data** > **Clear**.
- **The sheet is protected.** Excel only lets people change row visibility there if the protection settings allow formatting rows. Go to **Review** > **Unprotect Sheet**, enter the password if there is one, and try again. If you don't know the password, ask the person who owns the file.
- **The workbook has hidden sheets.** Hidden sheets are a different thing from hidden rows. Right-click a sheet tab and look for Unhide.
- **Grouped rows.** Rows collapsed in an outline look hidden. Look for plus signs next to the row numbers, and click them to expand.

## Common mistakes

- Selecting only the row above the hidden rows, or only below, and then looking for Unhide.
- Trying to unhide filtered rows with Unhide Rows. Clear the filter instead.
- Forgetting row 1 and column A need the Name Box method.
- Unhiding everything in a file that someone hid rows in on purpose, without asking.
- Assuming the Document Inspector or any other tool covers every hidden item. White text on a white background, for example, is not found by it.

## Related topics to explore

- **Hidden versus filtered rows.** Learn to spot a filter icon and clear filters with Data, Clear.
- **Unhiding on protected sheets.** Why format commands are disabled and who can unprotect the sheet.
- **Conditional unhide with VBA.** Showing only rows that meet a rule, such as a status column that says Active.
- **Finding hidden data before sharing a file.** Use Document Inspector on a copy, and look at what it can and cannot find.
- **Hiding rows the right way.** Right-click the row numbers and choose Hide, or group rows when you want a clear sign that data is collapsed.

## Next step

Open your file, select the whole sheet and run Unhide Rows once. Then scan the row numbers for gaps and check the headers for filter icons. If you need to unhide all rows in Excel regularly, keep the macro in a copy of your workbook, not in the original.
