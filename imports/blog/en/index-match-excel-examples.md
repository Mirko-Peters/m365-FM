---
title: "INDEX MATCH in Excel: Formula, Examples and Common Errors"
summary: "INDEX MATCH in Excel explained: the formula, how each function works, left and two-way lookups, multiple criteria and common errors, plus a VLOOKUP comparison."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel]
keypoints:
  - "INDEX MATCH is two functions in one formula: =INDEX(return_range, MATCH(lookup_value, lookup_range, 0)). MATCH finds the position and INDEX returns the item at that position."
  - "Use 0 as the third argument of MATCH for an exact match. Left at its default of 1, MATCH assumes the data is sorted in ascending order."
  - "Because the lookup and return ranges are separate, INDEX MATCH can look to the left of the lookup column, which VLOOKUP cannot do."
  - "For two conditions, either join the columns in a helper column or use a formula that multiplies two comparisons inside MATCH."
  - "Wrap the formula in IFNA to replace #N/A with a message while other errors still show up, so real mistakes don't get hidden."
faq:
  - q: "How does INDEX MATCH work in Excel?"
    a: "MATCH searches a range for your lookup value and returns its position, for example 5 for the fifth item. INDEX then uses that number to return the item at the same position in another range. Put together, =INDEX(C2:C100,MATCH(F2,A2:A100,0)) finds F2 in column A and returns the value from column C."
  - q: "Is INDEX MATCH better than VLOOKUP?"
    a: "It's more flexible. VLOOKUP needs the lookup value in the first column of its range and counts columns by number, while INDEX MATCH uses two separate ranges, so it can look left and isn't affected by inserted columns. For a simple lookup to the right, either works. XLOOKUP is a third option in newer versions."
  - q: "Why does INDEX MATCH return #N/A?"
    a: "MATCH returns #N/A when it finds no match. Check for typos, extra spaces, numbers stored as text, and the match type. Use 0 for an exact match. With the default of 1, the lookup range must be sorted in ascending order, and with -1 it must be sorted in descending order."
---
INDEX MATCH in Excel is a lookup formula built from two functions: `=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))`. MATCH finds where your value sits in a list, and INDEX returns the item from the same position in another list. This article is for Excel users who write VLOOKUP formulas and run into its limits, or who inherited a workbook full of INDEX MATCH and want to understand it. You'll see each function on its own, how they fit together, how to look left, how to do a two-way lookup, how to use two criteria, and what the errors mean.

You'll find INDEX MATCH in many older workbooks, because it worked in every version of [Excel](https://www.m365.fm/entity/excel/) long before XLOOKUP existed. It still does, which is the main reason to learn it. The details below come from Microsoft's pages on [MATCH](https://support.microsoft.com/en-us/office/match-function-e8dffd45-c762-47d6-bf89-533f4a37673a), [INDEX](https://support.microsoft.com/en-us/excel/functions/index-function) and VLOOKUP.

## What INDEX does

INDEX returns a value from a position inside a range. Microsoft's page gives the array form as `INDEX(array, row_num, [column_num])`.

- `array` is the range to take the value from.
- `row_num` is the row inside that range.
- `column_num` is the column inside that range. If the range has only one column, you can leave it out.

The numbers count from the top-left cell of the range, not from the sheet. Microsoft's example uses a block with Apples and Bananas in the first column and Lemons and Pears in the second. `=INDEX(A2:B3,2,2)` returns Pears, and `=INDEX(A2:B3,2,1)` returns Bananas.

Two rules from the same page are worth remembering. If row_num or column_num points outside the range, INDEX returns a #REF! error. And if you set row_num or column_num to 0, INDEX returns the whole column or row. In current Microsoft 365 you press Enter as usual. In older versions you enter it as an array formula with Ctrl+Shift+Enter.

On its own, INDEX needs you to know the position already. That's where MATCH comes in.

## What MATCH does

MATCH searches a range and returns a position. Microsoft gives the syntax as `MATCH(lookup_value, lookup_array, [match_type])`. It does not return the item itself, only its relative position in the range.

The third argument decides how it matches:

- `0` finds the first exact match. The range can be in any order. This is the one you'll use most of the time.
- `1`, which is also the default if you leave the argument out, finds the largest value that is less than or equal to the lookup value. The range must be sorted in ascending order.
- `-1` finds the smallest value that is greater than or equal to the lookup value. The range must be sorted in descending order.

Microsoft's examples use the values 25, 38, 40 and 41 in B2:B5. `=MATCH(39,B2:B5,1)` returns 2, the position of 38, the next lowest value. `=MATCH(41,B2:B5,0)` returns 4. And `=MATCH(40,B2:B5,-1)` returns #N/A, because those values aren't in descending order.

Some more behavior from the page: text matching ignores case, so "apple" and "APPLE" are the same. With match type 0 and a text lookup value, `?` matches any single character and `*` matches any run of characters, and a tilde before either one searches for the literal character. If MATCH finds nothing, it returns #N/A.

The default of 1 trips people up. If you forget the third argument, MATCH silently assumes sorted data and can return a wrong position without any error. In nearly every lookup of IDs, names or codes, type the 0.

## Put them together

The pattern is always the same: MATCH goes inside INDEX and supplies the row number.

`=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))`

Take a sheet with employee IDs in A2:A100, names in B2:B100 and departments in C2:C100. You type an ID in F2 and want the department.

1. Click the cell for the result, for example G2.
2. Type `=INDEX(C2:C100,` to say where the answer comes from.
3. Add `MATCH(F2,A2:A100,0))` to say where to find the ID.
4. Press **Enter**.

The finished formula is `=INDEX(C2:C100,MATCH(F2,A2:A100,0))`. MATCH finds F2 in A2:A100 and says, for example, 14. INDEX then returns the 14th item in C2:C100.

Keep the ranges the same length and starting row. If MATCH searches A2:A100 and INDEX reads C3:C101, the position points to the wrong row and the answer is silently wrong. Use the same start and end rows for both, and lock them with dollar signs, `$A$2:$A$100`, if you plan to copy the formula down.

## Looking left, and what changes against VLOOKUP

Microsoft's [VLOOKUP page](https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1) gives the syntax as `VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`. It says the lookup value must be in the first column of the range, and that leaving out range_lookup gives an approximate match, which assumes sorted data. The page also suggests trying XLOOKUP.

Here is the same job both ways, with IDs in column A and names in column B:

- `=VLOOKUP(F2,A2:B100,2,FALSE)`
- `=INDEX(B2:B100,MATCH(F2,A2:A100,0))`

INDEX MATCH has two real advantages. First, it can look left. If the names are in column B and you want the ID back from column A, you simply swap the ranges: `=INDEX(A2:A100,MATCH(F2,B2:B100,0))`. VLOOKUP can't, because its lookup value has to be in the first column. Second, it points to the return column directly, rather than counting. In a VLOOKUP, the `2` in the formula means "second column of the range". Insert a column inside the range and the number points to a different column. With INDEX MATCH, the reference adjusts like any other reference.

You'll also read that INDEX MATCH is faster. Microsoft's pages make no such claim, and any difference only matters in very large workbooks, so don't choose it for speed. Choose it for flexibility.

## Two-way lookups

A two-way lookup finds the value where a row and a column meet, for example sales for one product in one month. Use two MATCH functions, one for the row and one for the column:

`=INDEX(B2:M20,MATCH(P1,A2:A20,0),MATCH(Q1,B1:M1,0))`

Here `B2:M20` holds the numbers, `A2:A20` has the product names, `B1:M1` has the month headings, and P1 and Q1 hold the product and the month you want. The first MATCH gives the row, the second gives the column, and INDEX returns the number where they cross. Note that the return range starts in B2, not A1, so the positions line up with the label ranges: both MATCH ranges also start at the same row or column as the numbers.

## Matching on two criteria

MATCH takes one lookup value. If a record is only identified by two fields, such as category and status, you have two options.

**A helper column.** Add a column that joins the two fields, for example `=A2&"|"&B2` in D2, and fill it down. Then look up the joined text:

`=INDEX(C2:C100,MATCH(F2&"|"&G2,D2:D100,0))`

The separator matters. Without it, "AB" plus "C" and "A" plus "BC" both become "ABC". The helper column is easy to read and to check, and it works in every version.

**An array formula.** Without a helper column, you can multiply two comparisons:

`=INDEX(C2:C100,MATCH(1,(A2:A100=F2)*(B2:B100=G2),0))`

Each comparison gives TRUE or FALSE. Multiplying turns them into 1 only where both are true, and MATCH looks for the first 1. This isn't in Microsoft's INDEX and MATCH pages, so test it on a small range. In older versions of Excel you may need to enter it with Ctrl+Shift+Enter, the same way Microsoft describes for array results from INDEX. In current Microsoft 365, Enter is enough.

## Wildcards and nearest values

With match type 0 and text, MATCH accepts wildcards. `=INDEX(B2:B100,MATCH("Jan*",A2:A100,0))` returns the item beside the first entry that starts with "Jan". That is useful for partial codes. Keep your pattern specific, because MATCH stops at the first hit.

For tiers such as tax brackets or commission bands, use the default match type 1 on purpose, with thresholds sorted in ascending order. Put 0, 1000 and 5000 in A2:A4 and the rates in B2:B4, and `=INDEX(B2:B4,MATCH(E2,A2:A4,1))` returns the rate of the largest threshold that doesn't exceed E2. This is one of the few jobs where the sorted default is the right choice.

## Fix the errors

- **#N/A.** MATCH found nothing. Look for typos, trailing spaces and numbers stored as text, since "100" and 100 are different. Check that the match type is 0, and that sorted-data match types (1 or -1) really have sorted data.
- **#REF!.** INDEX was asked for a row or column outside the range. This also happens when you delete a row or column that the formula uses. Check that the MATCH range and the INDEX range have the same size.
- **A wrong answer without any error.** Usually a missing 0 in MATCH, or ranges that start on different rows.
- **A wrong answer after copying down.** The ranges moved because they were not locked. Add `$` to the ranges.

To replace an error with a message, Microsoft's IFNA function returns a value you choose when a formula gives #N/A, and it passes any other error through unchanged:

`=IFNA(INDEX(C2:C100,MATCH(F2,A2:A100,0)),"Not found")`

Prefer IFNA over IFERROR for lookups. IFERROR hides every error, including a #REF! caused by a broken range, so a real fault looks like an ordinary "Not found". IFNA only covers the case you expect. Microsoft lists IFNA for Excel 2016 and later.

## INDEX MATCH or XLOOKUP

If everyone who opens your file has current Microsoft 365, XLOOKUP does the same job with one function and a built-in not-found message. We cover it in our guide to XLOOKUP in Excel. But Microsoft's own XLOOKUP page is not clear about Excel 2016 and 2019, and it doesn't list Excel for the web. INDEX MATCH works in all of them. So the choice is practical: use XLOOKUP in files for current versions, and INDEX MATCH when the file travels to people on older ones or when you're maintaining a workbook that already uses it.

## Common mistakes

- Leaving out the `0` in MATCH and trusting the default.
- Using ranges of different sizes or starting rows for INDEX and MATCH.
- Forgetting to lock ranges with `$` before copying the formula down.
- Joining criteria without a separator in a helper column.
- Wrapping everything in IFERROR, so that broken formulas look like missing data.
- Expecting INDEX MATCH to return all matches. It returns the first one only.

## Related topics to explore

- **XLOOKUP.** The newer lookup function, with search direction and a not-found argument built in.
- **Several results at once.** INDEX MATCH returns the first match only. The FILTER function is the tool for returning every match in versions that have it.
- **Tables and named ranges.** Structured references and names make lookups easier to read and let the range grow with your data.
- **Performance on big sheets.** Use bounded ranges instead of whole columns, and keep the ranges tight.
- **Case-sensitive lookups.** MATCH ignores case, so a case-sensitive lookup needs a different approach. Test any workaround before you rely on it.

## Next step

Rewrite one of your VLOOKUP formulas as INDEX MATCH and compare the result on a few known values. Then try the same formula with a lookup to the left. Once you've done both, you'll know when INDEX MATCH in Excel is the better tool for the job.
