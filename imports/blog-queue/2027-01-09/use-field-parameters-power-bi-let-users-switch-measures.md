---
title: "How to Use Field Parameters in Power BI to Let Users Switch Measures"
summary: "Create field parameters in Power BI Desktop so report readers can switch measures or dimensions with a slicer: creation steps, the generated table, adding fields in DAX, slicer options, hierarchy persistence and documented limitations."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [power-bi-desktop, power-bi]
keypoints:
  - "Field parameters let readers change the measures or dimensions in visuals by selecting fields in a slicer. Create one in Power BI Desktop under Modeling > New parameter > Fields."
  - "A parameter is a table of three-column tuples: display name, a NAMEOF field reference and an order number. Extra columns are unsupported."
  - "Use a column-based parameter in axis wells and a measure-based parameter in values wells. Several selected measures can appear side by side."
  - "Limitations include no AI visuals or Q&A, no none option, no implicit measures, and no use as linked fields for drill-through or tooltip pages."
  - "You cannot create parameters on live connection sources without a local model."
faq:
  - q: "How do I create a field parameter?"
    a: "In Power BI Desktop go to the Modeling tab and select New parameter > Fields. Name the parameter, select the fields, drag to set the order and double-click a field to change its display name."
  - q: "What does the generated table look like?"
    a: "Learn shows a DAX table of tuples with three values per field: a display name, a NAMEOF reference to the column or measure, and an order number."
  - q: "How do I add a field later?"
    a: "Edit the DAX directly. Press Shift + Enter for a new entry, add a comma between entries and keep the same three-column format with unique values. Extra columns are unsupported."
  - q: "Can I mix measures and dimensions?"
    a: "Yes. Learn says a parameter can mix measures and dimensions, for example a dynamic table whose columns can be either."
  - q: "What are the main limitations?"
    a: "AI visuals and Q&A are not supported, selecting no fields is the same as selecting all, implicit measures are not supported, and field parameters cannot be linked fields for drill-through or tooltip pages."
---

A field parameter lets report readers decide what a visual shows. They pick a measure or a dimension in a slicer, and every visual bound to the parameter updates. This guide follows the Microsoft Learn page on field parameters in Power BI.

## What it is

Field parameters let readers dynamically change the measures or dimensions they analyze. The reader selects fields in a slicer, and visuals that use the parameter respond.

## Create one in Power BI Desktop

1. Go to the **Modeling** tab and select **New parameter** > **Fields**.
2. Name the parameter and select the fields to include. The page's example uses the dimensions Customer, Color, Category and Product.
3. Drag fields to set the order. Double-click a selected field to change its display name.
4. Mix measures and dimensions if you need to.

## What the parameter is

Learn shows the DAX of an existing parameter. It is a table of three-column tuples: display name, a `NAMEOF` reference and an order number.

```dax
Parameter = {
    ("Customer", NAMEOF('Customer'[Customer]), 0),
    ("Category", NAMEOF('Product'[Category]), 1),
    ("Color", NAMEOF('Product'[Color]), 2),
    ("Product", NAMEOF('Product'[Product]), 3)
}
```

To add a field, edit the DAX. Press Shift + Enter for a new entry, add a comma between entries and use the same format. The number sets the order. Use three columns per field with unique values. Extra columns are unsupported and can cause unexpected results. The page does not say whether display names can be edited in the DAX, and it does not show the DAX that the dialog generates at creation.

## Use it in visuals

- Use a column-based parameter in axis field wells and a measure-based parameter in values field wells.
- If the visual supports several measures, selecting several in the parameter shows them side by side.
- Field order in a visual follows selection order, unless a hierarchy slicer decides it.

## Use it in slicers

By default, the slicer shows field names. Readers pick a name to control the bound visuals. To show values instead, right-click the parameter in the **Build** pane and select **Show values of the selected field**. The slicer becomes a hierarchy slicer. This works for the slicer and list slicer. The button slicer shows only the first field's values. Select **Show selected field** to revert. Showing values works only for column-based parameters, not measure-based ones.

Learn's use cases: force a selection before other slicers show values, with single select on, or show a natural hierarchy such as Year, Month and Day of week in one slicer.

## Hierarchy level persistence

By default, Power BI keeps a matrix's expanded hierarchy level when the selection changes. To turn this off, go to **Options and settings** > **Options** > **Current File** > **Report settings** > **Field Parameters** > **Persist hierarchy level** in Desktop. In the Fabric report settings it is under **Field parameter options**.

## Limitations

- With auto date/time, a date column in a field parameter loses its link to the Date Hierarchy. Use explicit Year, Quarter, Month and Day columns instead.
- AI visuals and Q&A are not supported.
- Readers cannot choose a none option. Selecting nothing is the same as selecting all fields.
- You cannot create parameters on live connection sources without a local model. With DirectQuery for Power BI semantic models and Analysis Services, you can add a local model.
- Implicit measures are not supported. Create an explicit DAX measure for an aggregated column.
- Field parameters cannot be linked fields for drill-through or tooltip pages. Link the individual fields inside the parameter instead.
- With Copilot, responses reflect the current state of the visuals.

## What the page does not say

Whether the feature is in preview or generally available, maximum field counts, performance guidance and the minimum Power BI Desktop version.

## A build routine

This routine is practical advice built on the page.

1. Create explicit measures for every aggregated field you want readers to switch between.
2. Create the parameter and set the order.
3. Add a slicer on the parameter and bind visuals to it.
4. Test with a single measure, several measures and no selection.
5. Check pages that use drill-through or tooltips, because the parameter cannot be a linked field there.

## Typical mistakes

- Using implicit measures in a parameter.
- Adding extra columns to the generated table.
- Expecting a none choice.
- Relying on auto date/time columns inside the parameter.

## Related

- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)

## Sources

- [Use field parameters in Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/create-reports/power-bi-field-parameters)
