---
title: "Fix the Excel #SPILL! Error: Causes and How to Clear It"
summary: "A #SPILL! error means a formula returns several results and Excel cannot place them on the sheet. The seven causes from the Microsoft Support page: obstructing cells, unknown size, whole-column references, memory, tables, merged cells and unrecognized, with a fix for each and the VLOOKUP examples."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [excel, microsoft-365-apps]
keypoints:
  - "A #SPILL! error appears when a formula returns multiple results, or a PivotTable range is not blank, and Excel cannot place the results in the grid."
  - "If the spill range is not blank, select the cell to see the dashed border, choose Select Obstructing Cells in the error alert, then delete or move what is in the way."
  - "Whole-column references can return more rows than the grid holds. Limit the reference, or use a single cell or the at operator and copy the formula down."
  - "Spilled array formulas are not supported in Excel tables. Move the formula outside the table or convert the table to a range."
  - "Spilled formulas cannot spill into merged cells. Unmerge them or move the formula."
faq:
  - q: "What does #SPILL! mean?"
    a: "Microsoft Support says it appears when a formula returns multiple results, or a PivotTable range is not blank, and Excel cannot place the results in the grid. The page notes that PivotTable #SPILL! is currently limited to Microsoft 365 Insider participants."
  - q: "How do I find the cells that block the spill?"
    a: "Select the cell with the error to see a dashed border that shows the intended spill range. You can also use the error checking alert and choose Select Obstructing Cells. Then delete or move the obstructing entry, and the formula fills in automatically."
  - q: "Why does a whole-column VLOOKUP cause #SPILL!?"
    a: "A formula such as VLOOKUP with A:A as the lookup value can return one result per row, up to 1,048,576 results, which extends beyond the edge of the worksheet. The page offers three fixes: limit the lookup values to a range like A2:A7, which returns a dynamic array but does not work in tables, use a single cell like A2 and copy down, or use the at operator on the column and copy down."
  - q: "Can I spill a formula inside an Excel table?"
    a: "No. Spilled array formulas are not supported in Excel tables. Move the formula outside the table, or convert the table to a range with Table Design, Tools, Convert to range."
  - q: "What if the error shows up as unrecognized or fallback?"
    a: "The page says Excel cannot determine the cause in that case. Check that the formula includes all required arguments for its scenario."
---

A #SPILL! error is Excel telling you that a formula wants to put several results on the sheet, and it cannot. Microsoft's Support page on correcting a #SPILL! error lists seven causes with a fix for each. This article keeps the page's order of causes and keeps my own advice separate.

## What the error means

#SPILL! appears when a formula returns multiple results, or when a PivotTable range is not blank, and Excel cannot place the results in the grid. The page says the PivotTable variant is currently limited to Microsoft 365 Insider participants.

## Cause 1: The spill range is not blank

Something occupies cells that the formula needs.

1. Select the cell with the error. A dashed border shows the intended spill range.
2. Open the error checking alert and choose **Select Obstructing Cells**.
3. Delete or move the obstructing entry. The formula or PivotTable fills in automatically.

The page does not say how common each cause is. In my experience this is the quickest one to rule out, so I check it first.

## Cause 2: Indeterminate size

Excel cannot tell the size of the result because it changes between calculation passes. Random functions are the typical reason, such as `RAND`, `RANDARRAY` or `RANDBETWEEN`. The page's example is `=SEQUENCE(RANDBETWEEN(1,1000))`. It adds that `OFFSET`, `INDIRECT` and `TODAY` do not cause this, because they do not return different values on each pass. The page gives no fix steps for this cause. My reading: avoid volatile functions in whatever decides the size of the result, so the size stays the same between calculation passes.

## Cause 3: Extends beyond the edge of the worksheet

A whole-column reference can return more rows than the grid holds. In the page's example, `=VLOOKUP(A:A,A:C,2,FALSE)` entered in E2 would return 1,048,576 results. Three options:

| Option | Formula | Result |
| --- | --- | --- |
| 1. Limit the lookup values | `=VLOOKUP(A2:A7,A:C,2,FALSE)` | Returns a dynamic array. Does not work in Excel tables |
| 2. Use one value and copy down | `=VLOOKUP(A2,A:C,2,FALSE)` | Works in tables. Does not return a dynamic array |
| 3. Use the implicit intersection operator | `=VLOOKUP(@A:A,A:C,2,FALSE)` | Works in tables. Does not return a dynamic array. The @ is the implicit intersection operator |

For options 2 and 3 you copy the formula down.

## Cause 4: Out of memory

The array is too large for Excel to calculate. Reference a smaller array or range.

## Cause 5: The formula is in a table

Spilled array formulas are not supported in Excel tables. Either move the formula outside the table, or convert the table to a range with **Table Design** > **Tools** > **Convert to range**.

## Cause 6: The spill would run into merged cells

A spilled formula cannot spill into merged cells. Unmerge the cells, or move the formula to a range that does not intersect them. **Select Obstructing Cells** also finds merged cells.

## Cause 7: Unrecognized or fallback

When Excel cannot determine the cause, the page says to check that the formula includes all required arguments for its scenario.

## Related functions

The page links documentation for the functions `FILTER`, `RANDARRAY`, `SEQUENCE`, `SORT`, `SORTBY` and `UNIQUE`, and for dynamic arrays, spilled array behavior and the implicit intersection operator.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Click the error cell and look at the dashed border. If it is clearly blocked, clear the obstruction, and you are done.
2. If the border runs far down or off the sheet, look for whole-column references first.
3. If the formula sits in a table, decide whether it needs to be there. Moving the formula next to the table is often simpler than changing the logic.
4. Check merged cells in the area below and to the right of the formula, since they are easy to overlook in old workbooks.
5. For formulas that mix several functions, test with a small range before you use whole columns.
6. When you share a workbook, tell colleagues who use older Excel versions that dynamic array results can look different there. The page does not discuss this, so test it with your own versions.

## Related

- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)

## Sources

- [How to correct a #SPILL! error (Microsoft Support)](https://support.microsoft.com/office/how-to-correct-a-spill-error-ffe0f555-b479-4a17-a6e2-ef9cc9ad4023)
