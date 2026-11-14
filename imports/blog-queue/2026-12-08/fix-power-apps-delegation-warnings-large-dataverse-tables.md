---
title: "Power Apps delegation warnings on large Dataverse tables: how to fix them"
summary: "A delegation warning means Power Apps cannot send part of your formula to Dataverse. Learn what triggers it, how to test for it, and how to rewrite formulas so large tables return complete results."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [power-apps-delegation, dataverse, power-apps]
keypoints:
  - "A yellow triangle and a blue wavy underline mark the part of a formula that Dataverse cannot process. Power Apps then works on a local subset only."
  - "Nondelegable formulas read only the first 500 records by default. Settings > General > Data row limit can raise this to 10,000, but that hides the problem instead of fixing it."
  - "Set the Data row limit to 1 while testing. Any nondelegable query then returns a single record, which makes gaps easy to see."
  - "For Dataverse, Search works on text columns only, and comparisons with < or > do not delegate on choice columns."
  - "Sum, Min, Max, Average and CountIf are limited to 50,000 rows, and aggregate functions are not supported on views."
faq:
  - q: "What does a delegation warning in Power Apps actually mean?"
    a: "According to Microsoft Learn, Power Apps delegates a query when the whole formula can be translated into a query the data source runs. If any part is nondelegable, none of it is delegated, and the app processes only a local subset of records. The warning is the yellow triangle, and the blue wavy underline shows the part that is not delegable."
  - q: "Can I just raise the Data row limit to 2,000?"
    a: "You can raise it, but it is not a fix. Microsoft Learn states the default is 500 and the maximum is 10,000, and warns that higher limits can hurt performance, especially on wide tables. Results from a nondelegable formula can still be silently incomplete once the table grows beyond the limit."
  - q: "Is the Search function delegable for Dataverse?"
    a: "Only for text columns. The Dataverse connector page on Microsoft Learn lists Search as delegable for Text and not delegable for Number, Choice or DateTime. Filter with StartsWith is the usual alternative when you need to match the start of a value."
  - q: "Why does CountRows behave differently on Dataverse?"
    a: "Microsoft Learn notes that CountRows on Dataverse uses a cached value. For a non-cached count where the record count is under 50,000, the page suggests CountIf(table, True). It also says users need suitable permissions to get totals for the table."
  - q: "Can I filter with a Dataverse view to avoid delegation limits?"
    a: "Microsoft's 2019 announcement describes views that run on the server, with additional delegable conditions appended. That post covers an experimental feature and the current Learn pages I read do not document it step by step, so test it in your own app before relying on it."
---

A delegation warning means Power Apps cannot hand part of your formula to Dataverse. When that happens, the app works on a local subset of rows, so galleries, counts and searches can be wrong without any error. The fix is to rewrite the formula with functions and operators that Dataverse can process, and to test with a low row limit so gaps show up early.

## What delegation does

Microsoft Learn describes delegation like this: when a Power Fx query translates into an equivalent query the data source can run, Power Apps delegates it. The data source filters the rows and returns only the matches. A query is nondelegable if it uses a feature the data source does not support. If any part of the expression is nondelegable, Power Apps delegates none of it.

The visible signs are a **yellow triangle** on the formula and a **blue wavy underline** under the part that is not delegable. Warnings appear only for data sources that support delegation, such as Dataverse, SharePoint, SQL Server and Salesforce. Imported Excel data, collections and context variables live in memory and need no delegation.

## The risk: silent, incomplete results

Nondelegable formulas read only the first 500 records by default. Learn gives the example that Filter will not find record 501 or record 500,001. You get no error, just missing rows. The same applies to aggregates: Learn's example is Average over a nondelegable expression, which averages only the first 500 records.

## Step 1: Find and test the warnings

1. Open the app in Power Apps Studio and look for yellow triangles in the formula bar and blue underlines inside formulas.
2. Select **Settings**, then **General**, and set **Data row limit** to **1**.
3. Run the app. Every nondelegable query now returns a single record, so a gallery that shows one row has a delegation problem.
4. Set the limit back afterwards. Learn says the range is 1 to 10,000 and the default is 500.

Raising the limit to 10,000 is not a repair. Learn warns that higher limits can degrade performance, especially for wide tables, and recommends delegating as much as possible.

## Step 2: Rewrite the formula

Learn lists these delegable items inside Filter and LookUp: And, Or, Not, the comparison operators, `+` and `-`, TrimEnds, IsBlank, StartsWith, EndsWith and constants. Sort and SortByColumns are delegable, but Sort accepts only a single column name.

Patterns that commonly break delegation, according to the same page:

- Functions such as `If`, `*`, `/`, `Mod`, `Text`, `Value`, `Concatenate` and `&` inside the condition.
- `FirstN`, `Last`, `LastN`, `Choices`, `Concat`, `GroupBy` and `Ungroup`.
- Comparisons where the table column is on the right side of the operator. Put the column on the **left**.

A practical rewrite is to compute constants first and compare the column against them. Expressions that are constant across all records, such as `Today()`, do not block delegation, and control properties and variables are sent to the source as constants.

## Step 3: Check the Dataverse-specific rules

The Dataverse connector page on Microsoft Learn has a table by data type. Key points:

| Item | What the page says |
|---|---|
| Search | Delegable for Text only |
| `<`, `<=`, `>`, `>=` | Not delegable for Choice columns |
| IsBlank | Not delegable for Choice columns |
| In (membership) | Delegable, but subject to the 15-table query limit of Dataverse |
| Sum, Min, Max, Avg | Limited to 50,000 rows, and not supported on views |
| CountRows | Uses a cached value |
| Arithmetic in a condition | `Filter(table, field + 10 > 100)` is not delegable |
| Casting | `Text(column)` is not supported for delegation |

The page also says Dataverse text columns do not support Trim[Ends] or Len, while functions such as Left, Mid, Right, Upper, Lower, Replace and Substitute are supported. This differs from the general list, so check your exact formula against the connector table.

For lookups, Learn says a query can include at most two lookup levels, and you can expand or join up to 20 entities in one query. If you need more, the page suggests a view on the data server.

## Step 4: Use views carefully

The title of this topic mentions filter views. Microsoft's 2019 announcement says the Filter function can take a Dataverse view as a parameter, that the view always runs on the server, and that extra delegable conditions are appended on the server. It also lists caveats: it was an experimental setting, non-delegable conditions still run on the client, and results follow the view's order unless you use Sort.

That post and a 2019 release note are archived. The current Learn pages I read do not document the syntax step by step, and the connector page says only that aggregate functions are not supported on views. Treat views as an option to test, not a guaranteed way around delegation.

## Common mistakes

- Wrapping a column in `Text()` or `Value()` inside Filter.
- Using Search on a choice or number column.
- Comparing a choice column with `>` or `<`.
- Counting with CountRows and expecting a live number.
- Raising the data row limit and calling the problem solved.

## A short checklist

1. Fix every yellow triangle you can.
2. Set the row limit to 1 and test each screen.
3. Replace Search with Filter plus StartsWith where it fits.
4. Keep aggregates under 50,000 rows by filtering first.
5. Re-test after the table grows.

## Related

- [Power Apps delegation](https://www.m365.fm/entity/power-apps-delegation/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)

## Sources

- [Understand delegation in a canvas app](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview)
- [Delegation list](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-list)
- [Connect to Microsoft Dataverse from a canvas app](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/connections/connection-common-data-service)
- [Improved data source selection and Common Data Service views (Power Platform blog, 2019)](https://www.microsoft.com/en-us/power-platform/blog/power-apps/improved-data-source-selection-and-common-data-service-views/)
- [Leverage views from Common Data Service in canvas apps (archived release note)](https://learn.microsoft.com/en-us/business-applications-release-notes/april19/microsoft-powerapps/leverage-views-common-data-service-canvas-apps)
