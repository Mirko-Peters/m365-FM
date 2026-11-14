---
title: "Build a Date Table in Power BI for Time Intelligence: Requirements and Methods"
summary: "Build a date table in Power BI with the requirements Microsoft Learn lists, compare auto date/time, Power Query, CALENDAR, CALENDARAUTO and cloning with DAX, and see when to mark a date table."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [power-bi-desktop, dax-time-intelligence]
keypoints:
  - "A date table needs a date column with unique values, no blanks, no missing dates and full years. The model needs at least one date table for DAX time intelligence."
  - "Marking is required for Classic time intelligence. With Calendar-based time intelligence marking is not necessary except in specific circumstances."
  - "Methods are auto date/time, connecting or generating with Power Query, generating with CALENDAR or CALENDARAUTO in DAX, or cloning with DAX."
  - "CALENDARAUTO covers all dates in the model, returns full years and extends automatically when a refresh loads a new year."
  - "Cloning a date table with DAX creates columns only. It does not copy formats, descriptions or hierarchies."
faq:
  - q: "What must a date table contain?"
    a: "According to Microsoft Learn, a date or date/time column with unique values, no blanks, no missing dates and full years. A year is not necessarily January to December."
  - q: "Do I need to mark the table as a date table?"
    a: "Learn says marking is required for Classic time intelligence, and not necessary with the recommended Calendar-based time intelligence except in specific circumstances that it links to."
  - q: "Should I use CALENDAR or CALENDARAUTO?"
    a: "CALENDAR suits a range you define with start and end dates. CALENDARAUTO covers all dates in the model, returns full years and extends when a refresh loads dates for a new year."
  - q: "When is auto date/time enough?"
    a: "Learn says it suits calendar periods, simple time requirements, ad hoc models and data exploration. It does not support a single date table design that propagates filters to multiple tables."
  - q: "How do I create a role-playing date table?"
    a: "Create a calculated table that references the existing date table, for example Ship Date = 'Date'. Learn notes this creates only columns and does not copy model properties or hierarchies."
---

Power BI's DAX time intelligence functions need a date table: one row per date, with a clean date column. This guide follows the Microsoft Learn guidance on date tables and compares the five ways it lists for adding one.

## Requirements

A date table must:

- Have a column of data type date or date/time, called the date column.
- Contain unique values in that column.
- Contain no BLANKs.
- Contain no missing dates.
- Span full years. A year is not necessarily January to December.
- Be marked as a date table if you use Classic time intelligence. Marking is not necessary with the recommended Calendar-based time intelligence, except in specific circumstances the page links to.

Your model needs at least one date table to use DAX time intelligence functions.

## Choose a method

| Method | When Learn says it fits |
| --- | --- |
| Auto date/time | Calendar periods, simple time requirements, ad hoc models and data exploration. Does not support one date table that propagates filters to multiple tables. |
| Connect with Power Query | The source already has a date table, such as a data warehouse date dimension. Use it as the single source of truth. For DirectQuery models whose source lacks one, add it to the source first. |
| Generate with Power Query | Possible, but DAX is often easier. If your organization lacks a consistent definition of time, publish a dataflow all modelers connect to. |
| Generate with DAX | A calculated table using CALENDAR or CALENDARAUTO. |
| Clone with DAX | A role-playing dimension, such as a ship date next to an order date. |

## CALENDAR or CALENDARAUTO

- **CALENDAR** is for a range you define with start and end dates. The dates can come from expressions such as the minimum and maximum of a sales order date column.
- **CALENDARAUTO** covers all dates in the model and returns full years. It takes an optional end month of the year, which is not needed for a year ending in December. It extends automatically when a refresh loads dates for a new year.

## Clone for role-playing dates

For a role-playing dimension, create a calculated table that references the existing date table:

```dax
Ship Date = 'Date'
```

Cloning creates only columns. It does not copy model properties such as formats or descriptions, and it does not clone hierarchies. Set these again on the clone.

## Share one definition

Learn suggests building a fully configured date table in a Power BI Desktop template and sharing it across your organization, so every new model starts from the same definition.

## Why the details matter

A date table with gaps or blanks breaks time intelligence, which is why the page lists unique values, no blanks and no missing dates as hard requirements. Because a year need not be a calendar year, a fiscal year works as long as the table covers full years. With auto date/time, Power BI does the work for you, but the page says it does not support a single date table design that propagates filters to multiple tables, so a shared, explicit date table is the better base for larger models.

For DirectQuery models whose source has no date table, the page says to add one to the source and then connect to it with Power Query. For models where several teams need the same definition of time, publishing a dataflow keeps every modeler on the same table.

## A practical order

This order is a suggestion, not from the page.

1. Check whether your source already has a date dimension. If yes, connect to it.
2. If not, generate one with CALENDARAUTO or CALENDAR and verify that there are no gaps.
3. Decide which time intelligence mode you use, and mark the table if you use the Classic one.
4. Add clones for each additional date role and reapply formats.
5. Move the finished table into a template or dataflow.

## Not covered

The page does not give step-by-step instructions or menu names for marking a date table, details on relationships between the date table and other tables, full explanations of the time intelligence functions or full CALENDAR and CALENDARAUTO code. It links to separate articles and a training module for those.

## Related

- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [DAX time intelligence](https://www.m365.fm/entity/dax-time-intelligence/)

## Sources

- [Set and use date tables in Power BI Desktop (guidance)](https://learn.microsoft.com/power-bi/guidance/model-date-tables)
