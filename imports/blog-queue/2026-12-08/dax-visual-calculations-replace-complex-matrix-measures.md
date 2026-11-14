---
title: "DAX visual calculations in Power BI: replace complex matrix measures"
summary: "Learn how visual calculations work in Power BI, how to create one on a matrix, which templates and functions replace running totals and percent-of-parent measures, and what limits to check first."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [power-bi, dax, power-bi-desktop, semantic-model]
keypoints:
  - "A visual calculation is a DAX calculation that runs on the visual instead of in the semantic model, so it uses the data the visual shows."
  - "Create one with New visual calculation on the Home tab of Power BI Desktop. Edit mode shows a preview, a formula bar and a visual matrix."
  - "Templates cover running sum, moving average, percent of parent, percent of grand total, versus previous, next, first and last, plus lookups."
  - "The Axis and Reset parameters control direction and where the calculation restarts, for example per year in a date hierarchy."
  - "Check limits before you commit: no slicers or custom visuals, no reuse across visuals, no pinning to dashboards, and no Publish to web."
faq:
  - q: "What is a visual calculation in Power BI?"
    a: "Microsoft Learn defines it as a DAX calculation that runs directly on a visual instead of in the semantic model. It uses the data shown in the visual, so you can build running totals, moving averages and period-over-period comparisons without managing filter context or model relationships."
  - q: "How do I create a visual calculation?"
    a: "Select the visual, then on the Home tab of the ribbon select New visual calculation. Learn says you can choose a template from the bottom part of the button. Edit mode opens with a preview, a formula bar and a visual matrix. Select Back to report to leave. To change it later, right-click it in the Visualizations pane and select Edit calculation."
  - q: "Do I need SUM or CALCULATE in a visual calculation?"
    a: "Usually not. Learn says most visual calculations evaluate each row of the visual matrix, much like a calculated column, so aggregation functions such as SUM are usually unnecessary. Functions that depend on model relationships, such as USERELATIONSHIP, RELATED and RELATEDTABLE, are not available."
  - q: "Are visual calculations faster than measures?"
    a: "Learn says they operate on aggregated data rather than detail-level data, so they often perform better than equivalent measures. That is a general statement, so test your own report with Performance analyzer rather than assuming a gain."
  - q: "Which visuals and features do not support visual calculations?"
    a: "The overview page lists slicers, R and Python visuals, Key Influencers, Decomposition Tree, Q&A, Smart Narrative and custom visuals among the unsupported visuals. It also lists no copy and paste across visuals, no pinning to dashboards, no Publish to web, and no inclusion of calculation results in data exports."
---

A visual calculation lets you build running totals, percent of parent, moving averages and period-over-period comparisons directly on a matrix, without writing a separate measure with filter context logic. If your matrix is held together by long CALCULATE and ALL patterns, a visual calculation is often simpler. Check the limits first, because the calculation lives on one visual only.

## What a visual calculation is

Microsoft Learn defines a visual calculation as a Data Analysis Expressions (DAX) calculation that runs on a visual instead of in the semantic model. It uses the data shown in the visual and can refer to columns, measures and other visual calculations in the same visual. Add a model field to the visual before you refer to it in a visual calculation. It applies to Power BI Desktop and the Power BI service.

Learn compares the options like this:

- It combines the simplicity of context from calculated columns with the on-demand flexibility of measures.
- It is stored on the visual, not in the model.
- It works on aggregated data, so it often performs better than an equivalent measure.

## Create one on a matrix

1. Select the matrix or table visual. It needs at least one numeric column or measure.
2. On the **Home** tab, select **New visual calculation**. To start from a template, use the bottom part of the button.
3. In the formula bar, enter the expression, for example:

```dax
Running sum = RUNNINGSUM([Sales Amount])
```

4. Select **Back to report**.

To edit later, right-click the calculation in the **Visualizations** pane and select **Edit calculation**. In edit mode you can also hide fields from the visual. Hidden fields stay in the visual matrix, so calculations can still use them.

## Templates for common patterns

Learn lists these templates:

| Pattern | Function |
|---|---|
| Running sum | RUNNINGSUM |
| Moving average | MOVINGAVERAGE |
| Percent of parent | COLLAPSE |
| Percent of grand total | COLLAPSEALL |
| Average of children | EXPAND |
| Versus previous, next, first, last | PREVIOUS, NEXT, FIRST, LAST |
| Lookup with context or totals | LOOKUP, LOOKUPWITHTOTALS |

Examples from the page:

```dax
Percent of parent = DIVIDE([Sales Amount], COLLAPSE([Sales Amount], ROWS))
Versus first = [Profit] - FIRST([Profit])
Moving average = MOVINGAVERAGE([Sales Amount], 2)
```

## Axis and reset

Two parameters exist only in visual calculations.

- **Axis** controls how the calculation moves through the visual matrix. It defaults to the first axis, usually ROWS. Other values include COLUMNS, ROWPAGES for small multiples, and combinations. If you name an axis the visual does not have, the calculation ignores it.
- **Reset** controls when the calculation restarts. The default is NONE. You can pass an integer, a column, or HIGHESTPARENT or LOWESTPARENT.

For a Year, Quarter, Month, Day hierarchy, these three restart per year:

```dax
RUNNINGSUM([Sales Amount], HIGHESTPARENT)
RUNNINGSUM([Sales Amount], 1)
RUNNINGSUM([Sales Amount], [Year])
```

`RUNNINGSUM([Sales Amount], LOWESTPARENT)` restarts per immediate parent. Learn says to prefer Axis and Reset for behavior that follows the visual's structure, and OrderBy and PartitionBy when you want to pin the calculation to specific fields.

## Formatting and conditional formatting

Format a visual calculation with its data type or a custom format string, using **Data format** in the **General** section of the formatting pane. Learn's example builds a text calculation that returns a hex color with `IF`, sets its data format to Text, hides it and uses it for conditional formatting.

## Limits to check first

Learn lists these.

**Unsupported visuals:** slicer, R visual, Python visual, Key Influencers, Decomposition Tree, Q&A, Smart Narrative, Metrics, paginated report, Power Apps, Power Automate and custom visuals.

**Unsupported features:** filtering, sorting or changing aggregations on the calculation, self-reference, copy and paste or reuse across visuals, data categories, data limits, show items with no data, dynamic format strings, personalization of visual calculations and hidden fields, and the See records drill-through. You can set alerts on visual calculations, but changes to their values do not trigger the alerts.

**Other limits:** field parameters work with visual calculations but have some limitations, and live connections to SQL Server Analysis Services require version 2025 or later.

**Sharing:** you cannot pin them to dashboards or use Publish to web. Data exports exclude visual calculation results.

Because a calculation belongs to one visual, a measure is still better when several visuals need the same logic, or when other reports will reuse the model.

## When to switch from a measure

Use a visual calculation when:

- The logic depends on the layout of one matrix, such as percent of parent.
- You want a running total without filter-context gymnastics.
- The result is only needed on that visual.

Keep a measure when other visuals or reports reuse it, when you need a slicer or dynamic format string, or when the calculation must appear on a dashboard tile.

## Common mistakes

- Wrapping everything in SUM. Most calculations work row by row.
- Relying on RELATED, RELATEDTABLE or USERELATIONSHIP. They are not available.
- Expecting reuse by copy and paste. It is not supported.
- Forgetting that styling applied to the visual is not applied in the visual matrix in the editor.

## A short migration checklist

1. List the measures in the matrix that only exist to support one visual, such as running totals or percent of parent.
2. Rebuild one of them as a visual calculation with a template and compare the numbers with the old measure.
3. Check the matrix against the unsupported features list, in particular dashboards, Publish to web and exports.
4. Remove the old measure only after you confirm that no other visual or report uses it.
5. Document the calculation on the report page, because it is stored on the visual and is not visible in the model view.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [DAX](https://www.m365.fm/entity/dax/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)

## Sources

- [Visual calculations overview](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-visual-calculations-overview)
- [Create visual calculations](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-visual-calculations-create)
