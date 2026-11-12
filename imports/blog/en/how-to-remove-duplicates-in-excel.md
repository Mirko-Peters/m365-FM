---
title: "How to Remove Duplicates in Excel: Command, Formulas, Power Query"
summary: "How to remove duplicates in Excel: use Data, Remove Duplicates, or keep the original data with UNIQUE, formulas and Power Query. Steps, limits and mistakes."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, power-query, vba]
keypoints:
  - "Select your data, open Data, then Remove Duplicates, tick the columns that define a duplicate and select OK. Excel deletes the whole row and keeps the first match."
  - "The deletion is permanent, so copy the data to another sheet first. Ctrl+Z only works until you do something else."
  - "Excel compares what is displayed in the cell, so 3/8/2006 and Mar 8, 2006 count as different values. Clean up formats first."
  - "If you want to look at duplicates before deleting them, highlight them with conditional formatting or flag them with a COUNTIF helper column."
  - "UNIQUE and Power Query give you a clean list without touching the source data, and Power Query repeats the cleanup on every refresh."
faq:
  - q: "How do I remove duplicates in Excel without deleting the original data?"
    a: "Leave the source alone and create a clean copy. In Excel for Microsoft 365, enter =UNIQUE(A2:A100) in an empty cell and the distinct values spill below it. In older versions, use Data, Advanced, Copy to another location and tick Unique records only. Both leave your original list unchanged."
  - q: "Does Remove Duplicates keep the first or last entry?"
    a: "The Remove Duplicates command keeps the first occurrence and deletes the later matches. If you want the newest or best row to survive, sort the data so that row comes first before you run the command. Power Query is different: Microsoft says it does not guarantee which row it keeps."
  - q: "Can I undo Remove Duplicates in Excel?"
    a: "Yes, press Ctrl+Z straight after you run it. Once you have saved and closed the file, the deleted rows are gone, because Excel deletes them permanently. That's why Microsoft recommends copying the original data to another sheet or workbook before you start."
---
To remove duplicates in Excel, select your data, go to **Data** > **Remove Duplicates**, tick the columns that decide what counts as a duplicate and select **OK**. Excel deletes every row that repeats the values in those columns and keeps the first one. This article is for Excel users who clean lists, exports and reports and want to pick the right method. You'll find the command first, then ways to check duplicates before deleting them, then options that keep your source data intact, and finally a few automation routes for repeat jobs.

[Excel](https://www.m365.fm/entity/excel/) has more than one tool for this because "duplicate" can mean different things. Sometimes it's a fully identical row. Sometimes it's the same customer ID with a different phone number. Decide which one you mean before you click anything.

## Remove duplicates with the Data tab command

This is the fastest route and the one most people need. It follows Microsoft's article on [filtering for unique values or removing duplicate values](https://support.microsoft.com/en-us/office/filter-for-unique-values-or-remove-duplicate-values-ccf664b0-81d6-449b-bbe1-8daaec1e83c2).

1. **Back up the data.** Copy the range to another sheet or workbook. Microsoft is blunt about it: the duplicates are permanently deleted.
2. **Select the range.** Click any cell in your data, or in an Excel Table, or select the range yourself. Only the selected range or table is changed. Cells outside it stay where they are.
3. **Open the command.** Go to **Data** and select **Remove Duplicates** in the Data Tools group.
4. **Choose the columns.** In the dialog, tick the columns Excel should compare. You can use **Select All** or **Unselect All**. If your first row holds column names, keep **My data has headers** ticked.
5. **Select OK.** Excel shows a message with the number of duplicate values removed and the number of unique values left.

Pay attention to step 4, because it trips people up. A row is only a duplicate when all the columns you ticked match. Take a list with ID, Name and Price. If you tick ID and Name but not Price, two rows with the same ID and name are duplicates even when their prices differ, and Excel deletes the entire second row, price included. If you want to keep every row where something differs, tick every column. If the ID alone defines a record, tick only the ID, and be aware of what you throw away.

Press **Ctrl+Z** right after the command if the result looks wrong. Don't rely on it later.

### Which row stays: sort first

Microsoft states that the first occurrence stays and the later identical rows are deleted. That means row order decides the outcome. If you have a contact list with several entries per person and you want the most recent one, sort by date, newest first, and then run Remove Duplicates. If you want the row with a filled-in email address, sort so those rows come first. Sorting is a normal part of cleanup here, not a nice extra.

### What counts as identical

Excel compares what's shown in the cell, not what's stored. Microsoft's example: 3/8/2006 and Mar 8, 2006 are treated as different values, even though the date is the same. The same goes for numbers formatted differently or text with a trailing space. The article on finding and removing duplicates also notes that the counts Excel shows afterward can include empty cells or spaces.

Before you remove anything, make the cells look the same. Apply one date format, trim stray spaces (the `TRIM` function does that), and check that numbers aren't stored as text. Microsoft's pages don't say whether the command ignores upper and lower case, so test it on a small range if case matters to you.

### When the command refuses

You can't remove duplicates from data that has outlines or subtotals. Remove the outline and the subtotals first, then run the command.

## Look at the duplicates before you delete them

Microsoft's advice is to filter or highlight first, then delete. That costs a minute and avoids most regrets.

### Highlight duplicates with conditional formatting

1. Select the cells you want to check.
2. On the **Home** tab, open **Conditional Formatting**, then **Highlight Cells Rules**, then **Duplicate Values**.
3. Pick a highlight style and select **OK**.

Every repeated value is now colored. You can't apply this to the Values area of a PivotTable. This method checks one column at a time, so a row that repeats only across several columns won't light up. For that, you need a helper column.

### Flag duplicate rows with a helper column

A helper column puts a TRUE or FALSE next to every row. It lets you filter, review and then delete.

1. Insert a column next to your data and add a header such as "Duplicate?".
2. If you're checking column A, enter this in B2: `=COUNTIF(A$2:A2,A2)>1`
3. Fill the formula down. The first time a value appears you get FALSE. Every later appearance gets TRUE.
4. Filter the helper column for TRUE. Review those rows. Delete them if they really are duplicates.

Because the range A$2:A2 grows as you copy the formula down, only the later entries are flagged and the first one is left alone. That matches what Remove Duplicates does.

To check several columns at once, build a key column that joins them: `=A2&"|"&B2&"|"&C2`. Run the COUNTIF on that key. Put a separator such as the pipe between the fields. Without one, "12" plus "34" and "1" plus "234" both become "1234" and look like the same record.

Filtering also has a drawback. If you delete filtered rows by selecting them, check that only the visible, flagged rows are selected, and do it on a copy. When in doubt, sort the helper column instead and delete the block of TRUE rows in one go.

## Get a list without duplicates and keep the source

Sometimes you don't want to delete anything. You just need a clean list for a drop-down, a summary or an import. Three options fit here.

### The UNIQUE function

In Excel for Microsoft 365, Excel 2024 and Excel 2021, `=UNIQUE(A2:A100)` returns every distinct value from the range, and the result spills into the cells below. Microsoft lists the function as available in Excel for the web and in the mobile apps too. The syntax is `=UNIQUE(array,[by_col],[exactly_once])`:

- `array` is the range to check. If it holds several columns, UNIQUE compares whole rows.
- `by_col` is TRUE if you want to compare columns instead of rows. Leave it out for the usual row comparison.
- `exactly_once` is TRUE if you want only the rows that occur once in the data. Leave it out and you get every distinct row.

The result updates when the source changes. If the source is an Excel Table and you use structured references, the spill range resizes as you add or remove rows. For a sorted list, wrap it: `=SORT(UNIQUE(A2:A100))`.

The second argument pair matters more than people think. `=UNIQUE(A2:A100,,TRUE)` gives you the values that appear exactly once, which is a different question from "remove the extra copies". Ask which one you need.

One limit: the older Excel versions (2019 and earlier) don't have UNIQUE. Microsoft's page lists only the versions mentioned above.

### Advanced Filter

This works in every desktop version and copies the result elsewhere.

1. Select your data.
2. Go to **Data** > **Advanced** in the Sort & Filter group.
3. Choose **Copy to another location**.
4. Enter a cell in the **Copy to** box and tick **Unique records only**.
5. Select **OK**.

Your original data stays where it is, and the unique rows appear at the new location.

### The older formula pattern

If you can't use UNIQUE, enter `=IF(COUNTIF($A$2:A2,A2)=1,A2,"")` in a new column and fill it down. Each value shows up once and the repeats turn into empty strings. Copy the column and paste it as values, then filter out the blanks. It's clumsy, but it works everywhere.

## Handle partial matches and different cases

Real data is rarely a clean copy. Three situations come up again and again.

**Exact duplicates.** Every ticked column matches. The command handles this fine.

**Partial matches.** The key column repeats but other fields differ, for example the same customer ID with two different addresses. Here you must decide which version is right. Sort so the right one comes first and then remove duplicates on the key column only. Or flag the repeats with the helper column and review them by hand. No tool can tell you which address is correct.

**Differences in case.** Power Query is case-sensitive, according to Microsoft's documentation, so "Apple" and "apple" are not duplicates there. The suggested workaround is to change the column to upper or lower case with a transform before you remove duplicates. That changes the stored values, so keep the original column if you still need the exact spelling.

## Automate it: Power Query and VBA

For a one-off cleanup, the command is enough. For a file you clean every week, set up something that repeats.

### Power Query

If your data comes from a CSV file, a database or another workbook, remove the duplicates during the import. [Power Query](https://www.m365.fm/entity/power-query/) records the step and runs it again on every refresh.

1. Load the data into the Power Query Editor. If it's already in a worksheet, select a cell in the data and choose **Query** > **Edit**, or use **Data** > **Get Data** to load a new source.
2. Click the column header to select a column. Hold Shift or Ctrl to select more. The columns don't have to be next to each other.
3. Go to **Home** > **Remove Rows** > **Remove Duplicates**.
4. Close and load the result.

Microsoft's page on [keeping or removing duplicate rows in Power Query](https://support.microsoft.com/en-us/excel/keep-or-remove-duplicate-rows-power-query) lists these steps. Its guidance on duplicates is worth knowing: the selected columns decide what counts as a duplicate, and Power Query does not guarantee it keeps the first row of a set. If which row survives matters, don't rely on sorting alone. Microsoft points to its "Preserve sort" guidance in the common issues article for Power Query. A related option, **Keep Duplicates**, does the opposite: it keeps only rows whose values appear more than once, which is a quick way to audit a list.

If you merge two tables, think about where the deduplication belongs. Removing duplicates from each source before the merge keeps the merge small and predictable. Removing them after the merge cleans up what the merge created. Choose based on where your duplicates come from, and check the row count in the preview before you load.

### VBA macro

If you repeat the same cleanup on workbooks you open every day, a macro is an option. The Range object has a `RemoveDuplicates` method, documented in Microsoft's VBA reference. It takes the columns to compare and says whether the first row holds headers. Microsoft's own example is:

`ActiveSheet.Range("A1:C100").RemoveDuplicates Columns:=Array(1,2), Header:=xlYes`

That compares the first two columns of the block A1:C100 and treats the first row as a header. To use it, press **Alt+F11**, insert a module, paste the line inside a `Sub`, and save the file as a macro-enabled workbook (`.xlsm`). Run it on a copy first. A macro deletes just as permanently as the command, and Ctrl+Z won't bring the rows back. Your IT team may also block macros, so check before you build something your colleagues can't run. If you want to learn more about the language, the [VBA](https://www.m365.fm/entity/vba/) page collects related material.

### Excel for the web and mobile

Microsoft's articles on removing duplicates list only the desktop versions of Excel (Microsoft 365, 2024, 2021, 2019 and 2016) and say nothing about the web or the mobile apps. Microsoft doesn't describe the Remove Duplicates command for those versions, so don't build a process on it. What Microsoft does document for the web and mobile is the UNIQUE function, so use that to get a clean list on those devices and do the permanent deletion on the desktop.

## Common mistakes

- Running the command without a backup. Close the file and the rows are gone for good.
- Ticking the wrong columns. Leaving out a column changes which rows count as duplicates, and the whole row is deleted, not just the repeated cell.
- Forgetting to sort first, then wondering why the old record survived instead of the new one.
- Comparing cells that look the same but are formatted differently, such as dates written two ways or text with trailing spaces.
- Trying to run the command on outlined or subtotaled data. Remove those first.
- Treating `UNIQUE` with `exactly_once` set to TRUE as a way to delete the extras. It returns only values that occur once, so repeated values vanish completely from the result.

## Related topics to explore

- Highlight duplicates with conditional formatting and flag repeated rows with a COUNTIF helper column before you delete anything. Both are covered above.
- Clean data on import. A [Power Query](https://www.m365.fm/entity/power-query/) step keeps duplicates out of every refresh, and works well for CSV files and other systems.
- Prevent duplicates at entry. Data validation with a custom formula can be set up to stop users from typing a value that already exists. Test it on a small sheet first.
- Automate repeat jobs with a macro, and learn how to run it safely on a copy.
- Merging data from several sources, where duplicates often come from. Plan the order of cleanup and merge.

## Next step

Before your next cleanup, copy the data, highlight the duplicates with conditional formatting and see how many there are. Then run Remove Duplicates on the copy, and compare the counts to the numbers Excel reports.
