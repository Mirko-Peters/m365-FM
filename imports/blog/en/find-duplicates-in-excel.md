---
title: "Find Duplicates in Excel: Highlight, Count and List Them"
summary: "Find duplicates in Excel with conditional formatting, COUNTIF flags, UNIQUE, Power Query and cross-sheet checks, plus how to spot near matches before deleting."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, power-query]
keypoints:
  - "The quickest way to find duplicates in Excel is Home, Conditional Formatting, Highlight Cells Rules, Duplicate Values. It colors repeated values and deletes nothing."
  - "A COUNTIF helper column tells you how often each value appears, and with COUNTIFS you can check several columns together."
  - "COUNTIF ignores letter case and treats ? and * as wildcards, so the count can differ from what you expect."
  - "To compare two sheets, count each value against the other list with COUNTIF, and open both workbooks if the second list lives in another file."
  - "Near matches such as Jon and John won't show up as duplicates. Clean spaces and case first, then review the rest by eye or with the Fuzzy Lookup add-in."
faq:
  - q: "How do I find duplicates in Excel?"
    a: "Select the column, open Home, Conditional Formatting, Highlight Cells Rules and choose Duplicate Values. Excel colors every repeated value. For a count instead of a color, enter =COUNTIF(A$2:A$100,A2) next to the data and fill it down. A result above 1 means the value appears more than once."
  - q: "How do I find duplicates in Excel without deleting them?"
    a: "Highlighting and counting don't change your data. Conditional formatting only colors the cells, and a COUNTIF helper column only adds numbers beside them. Delete nothing until you've reviewed the flagged rows, and copy the sheet first, because Remove Duplicates deletes permanently."
  - q: "How do I find duplicates between two Excel sheets?"
    a: "Put =COUNTIF(Sheet2!A:A,A2)>0 next to the first list and fill it down. TRUE means the value also appears on Sheet2. If the second list is in another workbook, keep that workbook open, because a closed workbook can make the formula return a #VALUE! error."
---
To find duplicates in Excel without deleting anything, select your data and use **Home** > **Conditional Formatting** > **Highlight Cells Rules** > **Duplicate Values**. Excel colors every value that appears more than once. If you want numbers instead of colors, add a helper column with a COUNTIF formula. This article is for Excel users who inherit messy lists and need to see the problem before they fix it. You'll get the highlight method, counting and flagging formulas, a way to list only the repeated values, a Power Query option, cross-sheet checks and a plan for near matches.

Finding comes before removing. If you already know which rows you want to delete, our companion guide on how to remove duplicates in Excel covers the delete step. Here the goal is to look first, in [Excel](https://www.m365.fm/entity/excel/), so you decide what counts as a duplicate and what to keep.

## Highlight duplicates with conditional formatting

This is the fastest check, and Microsoft recommends it as a review step before you remove anything. It follows Microsoft's article on [filtering for unique values or removing duplicate values](https://support.microsoft.com/en-us/office/filter-for-unique-values-or-remove-duplicate-values-ccf664b0-81d6-449b-bbe1-8daaec1e83c2).

1. Select the cells, column or range you want to check. Usually one column is enough.
2. On the **Home** tab, open **Conditional Formatting**.
3. Choose **Highlight Cells Rules**, then **Duplicate Values**.
4. Pick a format, such as a light red fill, and select **OK**.

Every cell whose value appears more than once is now colored. Scroll through the sheet, or filter the column by color to see only the highlighted cells. To undo it, go back to Conditional Formatting and clear the rules from the range.

There's a second way that gives you more control. Open **Conditional Formatting** > **Manage Rules**, create a **New Rule** and choose **Format only unique or duplicate values**. In the **Format all** list you can pick **unique** or **duplicate**, and you can set the number format, font, border or fill. This is handy when you want to color the values that appear only once and leave the repeated ones alone.

Two limits to know. Microsoft says Excel can't highlight duplicates in the Values area of a PivotTable. And the rule looks at one column at a time when you select one column. A row that repeats only when you look at several columns together won't light up. For that you need a formula.

## Count and flag duplicates with COUNTIF

A helper column gives you a number you can sort and filter. It's also the right tool when two rows are only duplicates if two or three columns match.

### Flag every repeat

Suppose your values are in A2:A100. In B2, enter:

`=COUNTIF($A$2:$A$100,A2)`

Fill it down. A result of 1 means the value is unique. A 2 means it appears twice, and so on. Every copy of a repeated value gets the same number, including the first one. To turn the count into TRUE or FALSE, add a comparison: `=COUNTIF($A$2:$A$100,A2)>1`.

### Flag only the later copies

When you plan to delete rows, you usually want to keep the first one. Use an expanding range instead:

`=COUNTIF(A$2:A2,A2)>1`

The range A$2:A2 grows as you copy the formula down. The first time a value appears you get FALSE. Every later appearance gets TRUE. This matches what Excel's Remove Duplicates command does, since it keeps the first occurrence.

### Check several columns with COUNTIFS

For a record that is only a duplicate when, say, first name and last name both match, use COUNTIFS with one pair of range and criterion per column:

`=COUNTIFS($A$2:$A$100,A2,$B$2:$B$100,B2)`

A result above 1 means the combination appears more than once. Add more pairs for more columns. Don't try to build the same check by joining the ranges inside COUNTIF, as in `COUNTIF($A$2:$A$100&$B$2:$B$100,A2&B2)`. COUNTIF expects a real range as its first argument, so that formula doesn't do what it appears to do. COUNTIFS is the clean answer.

### What COUNTIF does that surprises people

Microsoft's [COUNTIF page](https://support.microsoft.com/en-us/office/countif-function-e0de10c6-f885-4e71-abb4-1f464816df34) lists some behaviors that matter when you hunt for duplicates:

- Text matching ignores letter case. "apples" and "APPLES" count as the same value. Excel treats them as duplicates here.
- The characters `?` and `*` act as wildcards. If your data contains them, for example in product codes, COUNTIF may match more than you expect. Put a tilde before the character to search for it literally.
- COUNTIF returns incorrect results for strings longer than 255 characters.
- Leading or trailing spaces, mixed straight and curly quotation marks and nonprinting characters can all throw the count off. Microsoft suggests the TRIM and CLEAN functions to clean the data first.

That last point is where most "Excel misses my duplicates" complaints come from. Two cells that look identical can differ by a trailing space. Clean first, then count.

### Filter and review

Once the helper column is in place, filter it for TRUE, or for values above 1, and read the rows. You can sort by the helper column to group all repeated rows together. Take a look at a sample before you delete anything. Often a "duplicate" turns out to be two real records that share a name.

## List only the duplicate values

Sometimes you want a short list of what repeats, not a flag next to every row.

**In Excel for Microsoft 365, 2024 and 2021**, the UNIQUE function can do the work. According to Microsoft's UNIQUE page, `=UNIQUE(array,[by_col],[exactly_once])` returns the distinct values from a range, and setting `exactly_once` to TRUE returns only the values that occur once. So `=UNIQUE(A2:A100)` gives each value once, and `=UNIQUE(A2:A100,,TRUE)` gives the values that are not duplicated at all. For the repeated values only, combine UNIQUE with FILTER and COUNTIF:

`=UNIQUE(FILTER(A2:A100,COUNTIF(A2:A100,A2:A100)>1))`

This keeps the rows where the count is above 1 and shows each of them once. It needs an Excel version with dynamic arrays. Test it on a few rows before you trust it on a big list.

**In older versions**, use a helper column. Enter `=IF(COUNTIF($A$2:$A$100,A2)>1,A2,"")` and fill it down. The column now shows each repeated value and leaves blanks for the rest. Filter out the blanks. You'll see each repeated value as often as it occurs, which is fine for a review.

**With Advanced Filter**, you can copy only the unique records to a new place. Go to **Data** > **Advanced**, choose **Copy to another location**, enter a cell in the **Copy to** box and tick **Unique records only**. Comparing this list with your original shows what was repeated.

## Use Power Query to keep only the duplicates

If your data is large or arrives every week, let [Power Query](https://www.m365.fm/entity/power-query/) find the duplicates. Microsoft's Power Query documentation describes a **Keep duplicates** command, the opposite of Remove duplicates. It filters the table to the rows whose values in the selected columns appear more than once, and unlike Remove duplicates it returns all matching rows, not one per value.

Microsoft's article on [keeping or removing duplicate rows](https://support.microsoft.com/en-us/excel/keep-or-remove-duplicate-rows-power-query) gives the steps for the removing side. The start is the same for both:

1. Select a cell in your data and choose **Query** > **Edit**, or load it with **Data** > **From Table/Range**.
2. Click a column header to select it. Hold Shift or Ctrl to select more columns.
3. Apply the command. Microsoft's steps for removing use **Home** > **Remove Rows** > **Remove Duplicates**. Look for the matching Keep Duplicates command with the other row commands on the Home tab, and check the preview.

Microsoft also notes that Power Query is case-sensitive, so "Apple" and "apple" are different values there, unlike in COUNTIF. That's a real difference between the two methods. If your goal is a repeatable weekly check, you'll want to decide on one behavior and stick with it, for example by transforming the column to upper case first.

## Find duplicates between two sheets or lists

A common job is to check whether a list on one sheet also appears on another: a new customer list against the old one, or this month's orders against last month's.

1. Put the two lists on separate sheets, say Sheet1 and Sheet2, with the values in column A.
2. On Sheet1, in B2, enter `=COUNTIF(Sheet2!A:A,A2)>0`.
3. Fill the formula down. TRUE means the value also appears on Sheet2.
4. Filter for TRUE to see the overlap, or for FALSE to see what is new.

For two columns that must match together, use COUNTIFS with a pair for each column and the other sheet's ranges.

If the second list is in a different workbook, Microsoft warns that a formula referring to a closed workbook can return a #VALUE! error. Keep both workbooks open while you work, or bring the second list into the first with Power Query. After the check, remember that the result depends on the data at that moment. If either list changes, the flags change.

## Near matches: Jon Smith and John Smith

Everything above finds exact matches only, aside from case. Real lists also contain typos and different spellings. Excel has no built-in function that scores how similar two text values are, so you handle these in two steps.

**Step one: remove the false differences.** Use `TRIM` to strip extra spaces and `CLEAN` to remove nonprinting characters, and build the check on the cleaned values. In a helper column, `=TRIM(A2)` shows the cleaned text. Count duplicates on that column, not on the original. Because COUNTIF ignores case, you don't need to change case there. In Power Query, where case matters, transform the column to upper or lower case.

**Step two: look at what's left.** Sort the cleaned list alphabetically and read through neighbors. Near matches such as "Jon Smith" and "John Smith" end up next to each other, so a human can see them. For larger lists, Microsoft Research published the [Fuzzy Lookup add-in for Excel](https://www.microsoft.com/en-ca/download/details.aspx?id=15011). It can find fuzzy duplicate rows within one table or match similar rows across two tables, and it gives each match a similarity score. Check the requirements before you plan around it: the download page lists Windows, with Excel 2007, 2010, 2013 and 2016, and a release from 2020. It may not install on a current Microsoft 365 setup, and it's not available on Mac.

Whatever you use, review fuzzy results by hand. Two people with similar names are not necessarily the same person.

## Common mistakes

- Checking one column when the duplicate is defined by two. A repeated last name alone isn't a duplicate record.
- Trusting COUNTIF counts on data with stray spaces or odd characters. Clean the data with TRIM and CLEAN first.
- Forgetting that COUNTIF ignores case while Power Query respects it, then getting different results from the two.
- Using `COUNTIF($A$2:$A$100,A2)>1` and deleting every TRUE row. That flags the first copy too, so you would delete all copies. Use the expanding range to flag only the later ones.
- Searching whole columns for strings longer than 255 characters, where COUNTIF gives wrong answers.
- Deleting straight after highlighting. Copy the sheet first, since Microsoft says removed duplicates are permanently deleted.

## Related topics to explore

- **Remove the duplicates you found.** The Data tab's Remove Duplicates command keeps the first match and deletes the rest. Sort first to control which row stays.
- **Keep the best record, not the first.** Sort by date or value so the row you want comes first, then flag the later copies with the expanding COUNTIF.
- **Compare lists across files.** Power Query can combine several workbooks into one table so you can check them together.
- **Prevent new duplicates.** Data validation with a custom formula can block a value that already exists. Try it on a test sheet.
- **Keep an audit trail.** Leave the helper column in a copy of the sheet so you can show later what was flagged and why.

## Next step

Pick one column in your current file, highlight its duplicates with conditional formatting and count how many cells light up. Then add a COUNTIF helper column and compare the numbers. If they differ, you've just found hidden spaces or case differences, and you now know how to find duplicates in Excel before you delete anything.
