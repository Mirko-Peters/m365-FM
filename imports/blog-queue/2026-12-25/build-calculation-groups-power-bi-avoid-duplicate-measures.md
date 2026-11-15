---
title: "Build Calculation Groups in Power BI to Avoid Duplicate Measures"
summary: "Create calculation groups in Power BI Desktop: Model view steps, calculation items with SELECTEDMEASURE, precedence, dynamic format strings, a time intelligence report example and the documented limits such as variant data types."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [calculation-groups, dax]
keypoints:
  - "A calculation group replaces many near-identical measures. Create it in Model view with the Calculation group button, and accept the prompt to discourage implicit measures."
  - "A calculation item is a DAX expression. The first item is typically SELECTEDMEASURE(), a placeholder for the measure the item applies to."
  - "Calculation items apply only to explicit measures. Once a calculation group exists, Power BI stops offering implicit measures in visuals."
  - "With a calculation group, measures use the variant data type, which can break dynamic format strings. Learn gives a FORMAT workaround."
  - "Set precedence when a model has several calculation groups. The page does not cover compatibility level or DirectQuery behavior."
faq:
  - q: "What do I need before creating a calculation group?"
    a: "According to Microsoft Learn, you edit a semantic model in Power BI and the discourage implicit measures property must be enabled. If it is off, Power BI prompts you to turn it on and you select Yes."
  - q: "Where do I create one?"
    a: "In Model view, select the Calculation group button in the ribbon. You can also use a TMDL script."
  - q: "What is SELECTEDMEASURE?"
    a: "Learn describes it as a DAX placeholder for the measure the calculation item is applied to."
  - q: "Why did my implicit measures disappear?"
    a: "Learn says that once a calculation group exists, Power BI stops showing the summation symbol next to data columns and blocks adding them directly to visuals as values. Existing implicit measures still work."
  - q: "How do I handle a Cannot convert value of type Text to type Numeric error?"
    a: "Learn says a math calculation item can raise this error on non-numeric measures, and shows guarding the operation with ISNUMERIC."
---

A calculation group lets one set of calculation items, such as year-to-date or year-over-year, apply to many measures, so you do not write a separate measure for each combination. This guide follows the Power BI documentation on calculation groups.

## Requirements

You edit a semantic model in Power BI. **Discourage implicit measures** must be enabled. If it is off, Power BI prompts you to turn it on when you create the calculation group, and you select **Yes**. The page does not cover compatibility level requirements, Tabular Editor workflows or Power BI Desktop version requirements.

## Create a calculation group

1. Go to **Model view** and select the **Calculation group** button in the ribbon.
2. Accept the prompt to enable discourage implicit measures. The calculation group is added.
3. Enter the DAX for the first calculation item in the formula bar. The first item is typically `SELECTEDMEASURE()`.

You can also edit the semantic model with a TMDL script that creates a calculation group with `precedence: 1` and a calculation item set to `SELECTEDMEASURE()`.

To rename the group, its column or an item, double-click in the **Data** pane or use the **Properties** pane. To add an item, right-click the **Calculation items** section and choose **New calculation item**. Reorder items in the **Properties** pane or by right-clicking an item.

## Dynamic format strings

Select the calculation item, turn on **Dynamic format string** in the **Properties** pane and enter a format expression. For example, `#,##0.00%` displays the item as a percentage.

## Use SELECTEDMEASURE

`SELECTEDMEASURE` is a placeholder for the measure the item is applied to. An item expression can also ignore measures by name or data type.

To use a group in a report:

1. In **Report** view, create a **Matrix** visual.
2. Add the **Month** column from the **Date** table to **Rows**.
3. Add the calculation group column, for example **Time Calculation**, to **Columns**.
4. Add a measure such as **Orders** to **Values**.

To apply one item to several measures, add the group column to a **Slicer**. To use an item inside a measure, filter with the group column:

```dax
Orders YOY% =
    CALCULATE(
        [Orders],
        'Time Intelligence'[Time Calculation] = "YOY%"
    )
```

## Precedence

If the model has several calculation groups, set the order in which they apply with the **precedence** property in the properties pane of the **Calculation groups** section.

## Time intelligence example

The page's example works with any model that has a **Date** table. It can also use the Adventure Works DW 2020 sample. The author renamed a table from DimDate to Date to clear red error icons.

## Working order

This order is a suggestion, not from the page.

1. List the measures you currently duplicate, for example one per time calculation.
2. Create the calculation group and one item per variant, each written around `SELECTEDMEASURE()`.
3. Add a dynamic format string where an item changes the unit, such as a percentage.
4. Test in a matrix with the group column in **Columns**, then remove the duplicated measures.
5. Check for measures with non-numeric results before you publish.

## Limitations

- **Implicit measures:** once a calculation group exists, Power BI stops showing the summation symbol next to data columns and blocks adding them directly to visuals as values. Existing implicit measures still work. Items apply only to explicit measures.
- **Variant data type:** with a calculation group, measures use the variant data type, and revert when all groups are removed. This can break dynamic format strings. The page suggests `FORMAT([Dynamic format string], "")` or a DAX user-defined function.
- **Non-numeric measures:** a math item can raise **Cannot convert value of type Text to type Numeric**. Guard it:

```dax
Calculation item safe =
    IF (
        ISNUMERIC( SELECTEDMEASURE() ),
        SELECTEDMEASURE() * 2,
        SELECTEDMEASURE()
    )
```

## Selection expressions

They control what a group returns when users make multiple, invalid or no selections. The page refers to the Analysis Services article for details.

## Implicit and explicit measures

Learn defines an implicit measure as what you get when you use a data column from the **Data** pane directly in a visual and let the visual aggregate it, for example as a `SUM`, `AVERAGE`, `MIN` or `MAX`. An explicit measure is one you create with **New measure** and a DAX expression. Explicit measures can also have conditional logic and filters. Because calculation items only apply to explicit measures, this difference decides whether a calculation group changes a number in a visual.

## Not covered

The page does not cover Live connection or DirectQuery behavior, detailed selection expression syntax, or performance considerations.

## Related

- [Calculation groups](https://www.m365.fm/entity/calculation-groups/)
- [DAX](https://www.m365.fm/entity/dax/)
- [Tabular Editor](https://www.m365.fm/entity/tabular-editor/)

## Sources

- [Create calculation groups in Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/transform-model/calculation-groups)
