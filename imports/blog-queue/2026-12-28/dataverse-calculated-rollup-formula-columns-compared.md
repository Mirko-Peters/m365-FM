---
title: "Calculated vs Rollup vs Formula Columns in Dataverse: Differences, Limits and When to Use Which"
summary: "Compare Dataverse calculated, rollup and formula columns using three Microsoft Learn pages: how each is defined, when values are computed, supported data types, documented limits and the cases where mixing them is restricted or not recommended."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [dataverse]
keypoints:
  - "Formula columns use Power Fx. Calculated columns use a condition and action editor. Rollup columns aggregate related rows with SUM, COUNT, MIN, MAX or AVG."
  - "Rollups are calculated by scheduled system jobs. The first mass calculation runs 12 hours after you create or update the column, and the incremental job recurs at least hourly by default."
  - "Limits include 1,000 characters and dependency depth 10 for formula columns, 5 chained calculated columns and 50 rollup columns per table by default."
  - "Learn does not recommend mixing calculated and formula columns, and a rollup cannot aggregate another rollup."
  - "No Learn page I read gives a direct side-by-side comparison, so the table below is assembled from three pages."
faq:
  - q: "What is the main difference between the three column types?"
    a: "According to Microsoft Learn, formula columns use Power Fx formulas, calculated columns are defined with a condition and an action in an editor, and rollup columns aggregate values over related rows. Rollup values are computed by system jobs in the background."
  - q: "Can a rollup use a formula or calculated column?"
    a: "A rollup requires a simple formula column that uses only columns from the same record or hard-coded values. It cannot use a formula column that depends on UTCNow or UTCToday in rollups, and it cannot reference a calculated column that uses another calculated column."
  - q: "How often are rollups recalculated?"
    a: "The Mass Calculate Rollup Field job runs 12 hours after you create or update the column, and the Calculate Rollup Field job does incremental calculations with a default minimum recurrence of one hour. You can also select Recalculate on a form."
  - q: "Should I mix calculated and formula columns?"
    a: "Learn says Microsoft does not recommend mixing calculated and formula columns, and formula columns treat null numeric values as 0 in intermediate operations while calculated columns return null."
  - q: "Are there limits on how many I can create?"
    a: "Learn gives 50 rollup columns per table and 200 per environment by default, a maximum of 5 chained calculated columns, and formula columns with maximum length of 1,000 characters and dependency depth of 10."
---

Dataverse offers three kinds of computed columns. Microsoft Learn documents each on its own page and none of those pages compares them directly. This article puts the documented facts side by side and does not add rules of its own.

## Definition and where each is built

| Aspect | Formula | Calculated | Rollup |
| --- | --- | --- | --- |
| How defined | A Power Fx formula typed or suggested in the column editor | A CONDITION and an ACTION in the calculated column editor | Source table, related table and an aggregate function |
| Typical use | Price times units | Weighted revenue, follow-up dates | Total estimated revenue of open opportunities for an account |
| Built in | Tables, Columns, New column, Data type Formula | Behavior set to Calculated in an unmanaged solution | Column type Rollup in the column editor |
| Functions | Scalar Power Fx functions and operators | Date add and subtract, DIFFIN, CONCAT, TRIMLEFT, TRIMRIGHT | SUM, COUNT, MIN, MAX, AVG |

## When values are computed

- Calculated columns integrate with forms, views, charts and reports in real time, but the page does not state exactly when values are recomputed.
- Rollups run in background system jobs. The Mass Calculate Rollup Field job runs 12 hours after you create or update the column and recalculates all rows. The Calculate Rollup Field job handles incremental changes with a default minimum recurrence of one hour. Users can select Recalculate on a form, limited to 50,000 related rows and a hierarchy depth of 10.
- The page for formula columns does not describe a recalculation schedule.

## Limits

| Type | Documented limits |
| --- | --- |
| Formula | Maximum length 1,000 characters. Dependency depth 10. No cyclic references. Currency not supported as a result type. Minimum and Maximum value cannot be set. |
| Calculated | Up to 5 chained calculated columns. Saved queries and charts can have up to 50 unique calculated columns. Cannot trigger workflows or plug-ins. Cannot convert an existing simple column. |
| Rollup | 50 per table and 200 per environment by default. No workflow triggers. No rollup over a rollup. Only 1:N relationships. |

## Interactions

- Rollup columns require a simple formula column, meaning one that uses only columns from the same record or hard-coded values. Formula columns using UTCNow or UTCToday cannot be used in rollups.
- A rollup cannot reference a calculated column that uses another calculated column.
- Microsoft does not recommend mixing calculated and formula columns. A formula column treats null numeric columns as 0 in intermediate operations, so a null plus 2 plus 3 gives 5, while calculated columns return null.
- Duplicate detection rules are not triggered by formula or calculated columns.
- Rollups run under the system user context, so all users see the same value. Use column-level security to restrict access.
- A rollup column creates accessory columns ending in _date and _state, and the state values explain errors such as hierarchy recursion limits.

## Data types

Formula columns can display Text, Decimal Number, Whole Number, Float, Boolean Choice, Choice and Datetime. Calculated columns support Text, Choice, Yes/No, Whole Number, Decimal Number, Currency and Date Time.

## Rollup details worth knowing

Each rollup column adds a _state column. A value of 1 means Calculated, 0 means NotCalculated, and other values report problems such as OverflowError, RetryLimitExceeded, HierarchicalRecursionLimitReached, LoopDetected or CurrencyMissing. If the aggregated column has more precision than the rollup column, values are rounded down to the rollup precision before aggregation, so 1000.0041 and 2000.0044 with two decimals give 3000.00. A rollup counts only direct relationships, so totals can differ from the counts in associated grids. More than 100 rollup columns in an environment might degrade performance and increase storage use.

## Choosing

This guidance is a suggestion based on the facts above.

1. Need a value from the same row, written like an Excel formula: formula column.
2. Need conditions, parent-row lookups or the date functions: calculated column.
3. Need totals or counts over related rows: rollup column.
4. Avoid mixing calculated and formula columns, as Learn advises.

## Not covered

The formula columns page does not compare the types. The calculated columns page does not use the term formula columns.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Formula columns](https://learn.microsoft.com/power-apps/maker/data-platform/formula-columns)
- [Calculated columns](https://learn.microsoft.com/power-apps/maker/data-platform/define-calculated-fields)
- [Rollup columns](https://learn.microsoft.com/power-apps/maker/data-platform/define-rollup-fields)
