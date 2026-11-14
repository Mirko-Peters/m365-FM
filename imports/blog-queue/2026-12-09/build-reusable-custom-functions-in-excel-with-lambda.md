---
title: "Excel LAMBDA: Build Reusable Custom Functions With Dynamic Arrays Step by Step"
summary: "Create reusable Excel functions with LAMBDA: test the formula, call it in a cell, save it in Name Manager, then combine it with MAP, BYROW, REDUCE and LET. Includes the errors Microsoft documents and how to avoid #SPILL!."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [excel]
keypoints:
  - "A LAMBDA function takes up to 253 parameters, and its last argument is the calculation. It needs no VBA, macros or JavaScript."
  - "Test the formula first, then test the LAMBDA in a cell by calling it there, for example =LAMBDA(number, number + 1)(1)."
  - "Save the function under Formulas > Name Manager > New, with workbook scope and a comment of up to 255 characters."
  - "MAP, BYROW, BYCOL, REDUCE, SCAN and MAKEARRAY take a LAMBDA as an argument and work well with dynamic arrays."
  - "A #CALC! error means a LAMBDA was created in a cell but not called. #SPILL! means something blocks the output range."
faq:
  - q: "How do I save a LAMBDA so I can reuse it?"
    a: "Microsoft Support says to move the finished LAMBDA into Name Manager. On Windows, choose Formulas, Name Manager, then New, enter a name, scope, an optional comment and the LAMBDA in Refers to. On Mac, the path is Formulas, Define Name. Once saved, you call it from any cell in the workbook like a native function."
  - q: "Why does my LAMBDA return #CALC!?"
    a: "Per Microsoft Support, #CALC! appears when a LAMBDA is created in a cell without also being called from that cell. Add the call to test it, such as =LAMBDA(number, number + 1)(1), which returns 2."
  - q: "What causes #SPILL! with dynamic array formulas?"
    a: "Microsoft Support lists several causes, including a spill range that is not blank, an indeterminate size, a result that extends beyond the worksheet edge, a formula inside an Excel table, merged cells in the spill range and not enough memory. For a blocked range, select the error alert and choose Select Obstructing Cells."
  - q: "Is there a limit on how many parameters a LAMBDA can have?"
    a: "Yes. Microsoft Support states that you can use up to 253 parameters. Entering more returns a #VALUE! error, as does passing the wrong number of arguments to the function."
---

To build a reusable function in Excel, write the calculation as a normal formula, wrap it in `LAMBDA`, test it by calling it in the same cell, and then save it in Name Manager under a name you choose. After that, any cell in the workbook can call it like a built-in function. Combined with dynamic array functions, the same LAMBDA can work on a whole range at once. The steps below follow Microsoft's documentation for LAMBDA, its helper functions, LET and #SPILL! errors.

## What LAMBDA does

According to Microsoft Support, LAMBDA creates custom functions that you call by a name you choose. They are available throughout the workbook and need no VBA, macros or JavaScript. The page applies to Excel for Microsoft 365 and Excel 2024 on Windows and Mac.

The syntax is:

```
=LAMBDA([parameter1, parameter2, …,] calculation)
```

Parameters are optional values such as cell references, text or numbers, with up to 253 allowed. The calculation is required, must be the last argument and must return a result. Parameter names follow Excel's naming rules, with one exception: they cannot contain a period.

## Step 1: Test the plain formula

Make sure the calculation works before you wrap it. Then any later error comes from the LAMBDA itself.

## Step 2: Test the LAMBDA in a cell

A LAMBDA created in a cell without being called returns `#CALC!`. To test, add the call directly after it:

```
=LAMBDA(number, number + 1)(1)
```

This returns 2. The arguments in the second set of parentheses go to the parameters.

## Step 3: Save it in Name Manager

1. On Windows, select **Formulas** > **Name Manager**. On Mac, select **Formulas** > **Define Name**.
2. Select **New**.
3. Enter the **Name**, which becomes the function name.
4. Choose the **Scope**. Workbook is the default. Sheet-level scope is also available, except in Excel for the web.
5. Add a **Comment**. It is optional but recommended, up to 255 characters, and it shows in the Insert Function dialog and as a tooltip during autocomplete. Describe the purpose and the arguments.
6. Enter the LAMBDA in **Refers to**.
7. Select **OK**, then **Close**.

Microsoft's own example is a hypotenuse function. Name it `Hypotenuse`, and set Refers to as `=LAMBDA(a, b, SQRT((a^2+b^2)))`. Then `=HYPOTENUSE(3,4)` returns 5.

## Step 4: Make it work on arrays

Microsoft's Excel blog describes the helper functions that take a LAMBDA as an argument:

| Function | What it does |
|---|---|
| MAP | Applies a LAMBDA to each value in one or more arrays and returns a new array |
| BYROW | Calls a LAMBDA on each row and returns one result per row |
| BYCOL | Does the same for each column |
| REDUCE | Collapses an array into one accumulated value |
| SCAN | Like REDUCE, but returns each intermediate value |
| MAKEARRAY | Builds an array with a given number of rows and columns |

Examples from Microsoft Support:

```
=MAP(A1:C2, LAMBDA(a, IF(a>4,a*a,a)))
=BYROW(A1:C2, LAMBDA(array, MAX(array)))
```

BYROW's LAMBDA must return a single value. If it returns anything else, or no LAMBDA is given, the result is `#CALC!`. MAP with an invalid LAMBDA or the wrong number of parameters returns `#VALUE!`. These formulas return several values, so they spill into neighboring cells.

You can also use MAP inside another function. Microsoft shows `=FILTER(D2:E11,MAP(D2:D11,E2:E11,LAMBDA(s,c,AND(s="Large",c="Red"))))` to filter rows that meet two conditions.

## Step 5: Keep LAMBDAs readable with LET

LET assigns names to calculation results inside one formula. Microsoft says this helps performance, because a repeated expression is calculated once, and readability. Names must start with a letter, and the last argument must be a calculation that returns a result. LET supports up to 126 name and value pairs. In its example, the LET version of a FILTER formula computes twice as fast as the original.

## Fixing the errors you will meet

| Error | Documented cause |
|---|---|
| `#CALC!` | A LAMBDA is created in a cell but not called from it |
| `#VALUE!` | More than 253 parameters, or the wrong number of arguments |
| `#NUM!` | The function calls itself in a circle, with too many recursive calls |
| `#SPILL!` | Something blocks or prevents the output range |

For #SPILL!, Microsoft Support lists these causes and fixes:

- **Spill range isn't blank.** Select the error alert and choose **Select Obstructing Cells**, then delete or move the data.
- **Indeterminate size.** Functions such as RAND, RANDARRAY or RANDBETWEEN inside the size calculation make the result size change. The page gives no specific fix.
- **Extends beyond the worksheet's edge.** Reference only the values you need, for example `=VLOOKUP(A2:A7,A:C,2,FALSE)`, or use the `@` operator and copy down.
- **Table formula.** Spilled array formulas are not supported in Excel tables. Move the formula out of the table or use **Table Design** > **Convert to range**.
- **Merged cells.** Unmerge them or move the formula.
- **Out of memory.** Reference a smaller array or range.

The Evaluate command returns a LAMBDA result immediately, but you cannot step into the function.

## Habits that help

- Name functions for what they do and write the comment as if someone else will use it.
- Use workbook scope for functions you want everywhere in the file.
- Test with a few known inputs before you copy the function elsewhere.

The pages read for this article do not describe how to share named LAMBDAs across workbooks. Check Microsoft's current guidance before you rely on a specific method.

## Related

- [Excel](https://www.m365.fm/entity/excel/)
- [Excel for the web](https://www.m365.fm/entity/excel-online/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)

## Sources

- [Microsoft Support: LAMBDA function](https://support.microsoft.com/en-us/office/lambda-function-bd212d27-1cd1-4321-a34a-ccbf254b8b67)
- [Microsoft Support: MAP function](https://support.microsoft.com/en-US/excel/functions/map-function)
- [Microsoft Support: BYROW function](https://support.microsoft.com/en-us/office/byrow-function-2e04c677-78c8-4e6b-8c10-a4602f2602bb)
- [Microsoft Support: LET function](https://support.microsoft.com/en-us/office/let-function-34842dd8-b92b-4d3f-b325-b8b8f9908999)
- [Microsoft Support: How to correct a #SPILL! error](https://support.microsoft.com/en-us/Excel/how-to-correct-a-spill-error)
- [Microsoft Support: Dynamic array formulas and spilled array behavior](https://support.microsoft.com/en-us/office/dynamic-array-formulas-and-spilled-array-behavior-205c6b06-03ba-4151-89a1-87a7eb36e531)
- [Microsoft Excel Blog: Announcing LAMBDA helper functions](https://techcommunity.microsoft.com/blog/excelblog/announcing-lambda-helper-functions-lambdas-as-arguments-and-more/2576648)
