---
title: "XLOOKUP in Excel: Syntax, Examples and How It Beats VLOOKUP"
summary: "XLOOKUP in Excel explained: the syntax, each argument, examples for exact, wildcard and last matches, multiple columns, and how it differs from VLOOKUP."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, excel-online]
keypoints:
  - "XLOOKUP takes a lookup value, a lookup range and a return range: =XLOOKUP(lookup_value, lookup_array, return_array). It finds the first match and returns the item from the return range."
  - "It can look to the left of the lookup column and defaults to an exact match, two things VLOOKUP cannot do or does not do by default."
  - "The fourth argument, if_not_found, replaces the #N/A error with text you choose. Without it, an unmatched search returns #N/A."
  - "match_mode 2 turns on wildcards, -1 and 1 find the next smaller or larger item, and search_mode -1 searches from the last item to the first."
  - "Microsoft's page lists XLOOKUP for Microsoft 365, 2021 and 2024, and its notes on Excel 2016 and 2019 conflict, so test shared files before you rely on it."
faq:
  - q: "What is XLOOKUP in Excel?"
    a: "XLOOKUP is a lookup function that searches a range or array for a value and returns the matching item from another range. Its basic form is =XLOOKUP(lookup_value, lookup_array, return_array). It replaces many VLOOKUP and HLOOKUP uses, works in either direction and returns an exact match unless you tell it otherwise."
  - q: "What is the difference between XLOOKUP and VLOOKUP?"
    a: "VLOOKUP needs the lookup value in the first column of the range and returns a column by number, with approximate match as the default. XLOOKUP takes separate lookup and return ranges, so it can look left or right, and it defaults to an exact match. It also has a built-in not-found argument."
  - q: "Why does XLOOKUP return #N/A?"
    a: "XLOOKUP returns #N/A when it finds no match and you haven't set the if_not_found argument. Common causes are a typo, an extra space, a number stored as text, or a match_mode that doesn't fit the data. Add a fourth argument such as \"Not found\" to show text instead."
---
XLOOKUP in Excel finds a value in one range and returns the matching item from another range: `=XLOOKUP(lookup_value, lookup_array, return_array)`. Type an employee ID, point at the ID column, point at the name column, and you get the name. This article is for Excel users who still write VLOOKUP out of habit, or who have just seen XLOOKUP in a colleague's file. You'll get the syntax, the six arguments, worked examples for the cases that come up at work, the comparison with VLOOKUP, and a list of the errors you're likely to hit.

The syntax and options below follow Microsoft's page on the [XLOOKUP function](https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929). Where a pattern isn't on that page, the text says so. It's a function for [Excel](https://www.m365.fm/entity/excel/), and it's the one Microsoft itself suggests as the better choice when you open the VLOOKUP help page.

## The syntax and the six arguments

The full formula looks like this:

`=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`

The first three arguments are required. The last three are optional.

- `lookup_value` is what you're looking for, for example an ID in cell D2. If you leave it out, XLOOKUP returns blank cells it finds in the lookup array.
- `lookup_array` is the range or array to search, such as A2:A100.
- `return_array` is the range or array to return from, such as B2:B100.
- `if_not_found` is the text to show when there's no valid match. If you omit it, you get #N/A.
- `match_mode` sets how matching works. `0` is an exact match and the default. `-1` means an exact match or, if there is none, the next smaller item. `1` means an exact match or the next larger item. `2` is a wildcard match, where `*`, `?` and `~` have special meaning.
- `search_mode` sets the search direction. `1` searches from the first item to the last and is the default. `-1` searches from last to first. `2` and `-2` are binary searches on data sorted in ascending or descending order. Microsoft warns that unsorted data returns invalid results with the binary modes.

Keep the lookup array and the return array the same size. If the lookup array covers rows 2 to 100, the return array should cover rows 2 to 100 too. Microsoft's page doesn't spell this out as a rule, but ranges that don't line up are the usual reason a lookup returns the wrong row or an error.

## Basic lookups and the not-found argument

Say employee IDs are in A2:A100 and names are in B2:B100. You type the ID you want in D2.

1. Click the cell where the result should appear, for example E2.
2. Enter `=XLOOKUP(D2,A2:A100,B2:B100)`.
3. Press **Enter**.

You get the name that belongs to the ID. XLOOKUP returns the item for the first match it finds. If the ID isn't there, you get #N/A.

To show something friendlier, add the fourth argument:

`=XLOOKUP(D2,A2:A100,B2:B100,"No record found")`

Now an unlisted ID shows "No record found". Use this on sheets that other people read. One caution: a message like that can hide a real problem. If every row says "No record found", something is wrong with the ranges, not with the data, so test a known ID first.

### Looking to the left

VLOOKUP can't return a value from a column to the left of the lookup column. XLOOKUP can, because the lookup and return ranges are separate. If the name is in column C and the ID you want back is in column A:

`=XLOOKUP(F2,C2:C100,A2:A100)`

Microsoft's page says it directly: the lookup column can be on either side of the return column.

## Match modes: wildcards and nearest values

### Wildcard matches

Set `match_mode` to 2 to use wildcards. The asterisk stands for any number of characters, and the question mark for exactly one. A tilde lets you search for a literal asterisk or question mark.

`=XLOOKUP("Jan*",B2:B100,A2:A100,"Not found",2)`

This returns the first entry that starts with "Jan". Forget the 2 and Excel looks for the literal text "Jan*" and returns your not-found message. That is the most common wildcard mistake. Keep wildcards as specific as you can, because XLOOKUP returns only the first match, and a loose pattern may match something you didn't intend.

### Next smaller or larger item

Modes `-1` and `1` are for scales: tax rates, commission tiers, price breaks. Put the thresholds in A2:A6 and the rates in B2:B6, and look up an income in E2:

`=XLOOKUP(E2,$A$2:$A$6,$B$2:$B$6,,-1)`

With `-1` Excel returns the exact match, or the next smaller threshold if there is none. The empty slot before the `-1` skips the not-found argument. Microsoft's own example for the approximate match uses `1` to return a tax rate for the next larger income value, so choose the direction that fits your table. Unlike old-style approximate VLOOKUP, you don't have to sort the thresholds for these modes. Binary search modes are the ones that need sorted data.

## Search from the bottom: the last match

When a value appears several times, XLOOKUP returns the first one it meets. To get the last one, search from the end by setting `search_mode` to `-1`:

`=XLOOKUP(D2,A2:A100,C2:C100,"Not found",0,-1)`

If the sheet lists orders in date order, this returns the latest entry for a customer. The `0` keeps the match exact. This is the pattern for "latest price", "last contact" and similar questions that were awkward with VLOOKUP.

## Return several columns at once

Microsoft's page notes that, unlike VLOOKUP, XLOOKUP can return multiple columns as one array. Make the return range wider:

`=XLOOKUP(D2,A2:A100,B2:D100)`

The formula puts the match from column B in the cell and spills the values from columns C and D into the cells to the right. Leave room for them. If cells on the right already contain data, Excel shows a spill error instead of overwriting them. Microsoft's example returns an employee name and a department from a single formula.

## Two-way lookups

Microsoft shows how to nest two XLOOKUP functions to find a value at the crossing of a row and a column. The pattern, from its page, is:

`=XLOOKUP(D2,$B6:$B17,XLOOKUP($C3,$C5:$G5,$C6:$G17))`

The inner function picks the column that matches the header in C3. The outer function then looks for D2 in the row labels and returns the value from that column. Microsoft compares this to an INDEX and MATCH combination. If you have a report with products down the side and months across the top, this is the replacement for a more complicated formula.

## Several criteria

XLOOKUP takes one lookup value, and Microsoft's page has no multiple-criteria example. A common pattern is to let Excel test two conditions at once. Suppose category is in A, status is in B and the price in C. To find the price for the category in F2 and the status in G2:

`=XLOOKUP(1,(A2:A100=F2)*(B2:B100=G2),C2:C100,"Not found")`

Each comparison returns TRUE or FALSE. Multiplying them gives 1 only in rows where both are true, and XLOOKUP looks for the first 1. It's a pattern that works in current Microsoft 365 versions, but it's not on Microsoft's function page, so test it on a small sample. A helper column that joins the two fields is the older alternative. Put a separator between the values, for example `=A2&"|"&B2`, and look up the same joined text.

## XLOOKUP and VLOOKUP side by side

Microsoft's [VLOOKUP page](https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1) gives the syntax as `VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`, and says the lookup value must be in the first column of the range. If you leave out `range_lookup`, VLOOKUP does an approximate match, which assumes the first column is sorted. Set it to FALSE for an exact match. The same page suggests trying XLOOKUP and says it works in any direction and returns exact matches by default.

The same job in both functions, with IDs in column A and names in column B:

- `=VLOOKUP(D2,A2:B100,2,FALSE)`
- `=XLOOKUP(D2,A2:A100,B2:B100)`

The differences that matter in daily use:

- VLOOKUP refers to the result by column number, so inserting a column in the table changes what the number means. XLOOKUP refers to the return range directly.
- VLOOKUP can't look to the left. XLOOKUP can.
- VLOOKUP defaults to approximate match. XLOOKUP defaults to exact.
- XLOOKUP has a not-found argument and the search direction built in.

You don't have to rewrite old workbooks. If a VLOOKUP works, leave it. Use XLOOKUP for new formulas, and for lookups that need a left lookup, a last match or several return columns.

## Which Excel versions support XLOOKUP

This is where you need to be careful. Microsoft's page lists XLOOKUP for Excel for Microsoft 365 on Windows and Mac, Excel 2024, Excel 2021, and the iPad, iPhone and Android apps. A note on the page says it isn't available in Excel 2016 or 2019 but may appear in workbooks created in newer versions, and the page also lists 2016 and 2019 in its applies-to line. It contradicts itself, so don't treat Excel 2016 and 2019 as safe. Excel for the web isn't listed on that page either.

If you send a workbook to someone on an older version, the formula may show an error where it should show a value. Ask which version your recipients use, and for files that go to many people, test on the oldest version in use. If you can't test, use a classic lookup for that file.

## Common mistakes and errors

- Forgetting `match_mode` 2 when you use wildcards. The search then looks for the literal characters.
- Using a binary `search_mode` (2 or -2) on unsorted data. Microsoft says the results are invalid.
- Different-sized lookup and return ranges. Make them the same length.
- Hidden spaces and numbers stored as text. "100" and 100 are different, so the lookup fails and you see #N/A. Clean the data with TRIM, or convert the numbers.
- Hiding problems with a friendly not-found message. Test one known value before you rely on it.
- Pointing the return array into cells where the result needs to spill, and leaving them occupied.
- Full-column references on very large sheets. Use a bounded range or an Excel Table, so Excel works through fewer cells.

## Related topics to explore

- **XLOOKUP versus INDEX and MATCH.** Both do left lookups, and the INDEX and MATCH pair works in older Excel versions too. Read up on it if you share files with people on Excel 2016 or 2019.
- **Multiple results.** XLOOKUP returns the first match only. To get all matches, look at the FILTER function instead.
- **XLOOKUP with Excel Tables.** Structured references make ranges grow with the data, and they read well in formulas.
- **Data from Power Query.** After you load data into a table, XLOOKUP can look it up like any other table. Refresh the query first and check the results afterward.
- **[Excel for the web](https://www.m365.fm/entity/excel-online/).** Microsoft's XLOOKUP page doesn't list it, so check in your own environment whether the function works for your colleagues before you share a file.

## Next step

Take one VLOOKUP from your current workbook and rewrite it as XLOOKUP. Add a not-found message, and compare the two results on a few IDs you know. If both agree, you have a pattern you can reuse for every new XLOOKUP in Excel.
