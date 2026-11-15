---
title: "Use JSON Column Formatting to Customize SharePoint Lists"
summary: "Open Format this column in a SharePoint list, paste JSON, preview and save. Covers the basic pattern, conditional formatting, date rules, links, data bars, multi-value fields, supported column types and how column formatting differs from the Field Customizer."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [sharepoint, microsoft-lists]
keypoints:
  - "Column formatting changes only how a field is displayed, not the data in the list item or file."
  - "Anyone who can create and manage views in a list can apply it: open the column menu, choose Column Settings, then Format this column, paste JSON, Preview and Save."
  - "Start from an example: elmType, txtContent and @currentField form the basic pattern, and Excel-style =if expressions drive conditional styling."
  - "Person fields need @currentField.title and lookup fields need @currentField.lookupValue to show text."
  - "It allows predefined elements and attributes only; for custom code, Learn points to the SharePoint Framework Field Customizer."
faq:
  - q: "Does column formatting change my list data?"
    a: "No. Microsoft Learn says it does not change the data in the list item or file; it only changes how the data is displayed to people who browse the list."
  - q: "Who can apply it?"
    a: "Anyone who can create and manage views in the list can use column formatting to configure how view fields are displayed. When you save, anyone who views the list sees the customization."
  - q: "How do I show a person or lookup value?"
    a: "Person fields are objects, so use @currentField.title for the display name. Lookup fields are objects too, and the display text is in @currentField.lookupValue."
  - q: "How do I refer to another column in a rule?"
    a: "Use the [$FieldName] syntax with the internal name of the field. Spaces in the internal name are written as _x0020_, so a field named Due Date is referenced as $Due_x0020_Date."
  - q: "When should I use a Field Customizer instead?"
    a: "When you need custom code. Column formatting allows only predefined elements and attributes, static hyperlinks that do not launch script, and simple visualizations expressed in HTML and CSS."
---

To customize a SharePoint list column with JSON, open the menu under the column, choose **Column Settings** and then **Format this column**, paste the JSON, select **Preview** and then **Save**. The formatting changes how the field looks in the view and does not change the data. Learn says anyone who can create and manage views in the list can do this. The easiest way in is to copy an example and edit it. This guide follows the Microsoft Learn page on column formatting.

## What it can and cannot do

Column formatting describes the elements shown for a field in a list view and the styles applied to them. Learn compares it with the SharePoint Framework Field Customizer. Column formatting is easier and more broadly applied, but less flexible because it allows no custom code, only predefined elements and attributes.

| Capability | Column formatting | Field Customizer |
| --- | --- | --- |
| Conditional formatting by value or range | Supported | Supported |
| Action links | Static hyperlinks that do not launch script | Any hyperlink, including custom script |
| Data visualizations | Simple ones expressed in HTML and CSS | Arbitrary |

Learn says that if column formatting can cover your scenario it is typically quicker and easier. Use a Field Customizer for more advanced cases.

## Apply a format

1. Open the drop-down menu under the column.
2. Under **Column Settings**, choose **Format this column**.
3. Type or paste the JSON in the pane. A column with no formatting uses default rendering.
4. Select **Preview** to check it, then **Save** to commit.

When you save, anyone who views the list sees the change. The pane's editor has validation and autocomplete, and **Ctrl+Space** gives property and value suggestions. Learn says to start adding JSON after the first line, which defines the schema location.

A schema note from the page: its examples use the JSON schema of SharePoint Online and SharePoint Server Subscription Edition from the Version 22H2 feature update. For SharePoint 2019 or earlier Subscription Edition builds, use the v1 schema address given on the page.

## The basic pattern

The simplest format puts the field value in a `div`. It works for number, text, choice and date fields:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "txtContent": "@currentField"
}
```

Some types need a property. A person field is an object, so show the name with `@currentField.title`. A lookup field is an object whose display text is `@currentField.lookupValue`.

## Conditional formatting

Learn's number range example applies a class when the value is 70 or less, using an Excel-style `=if` expression:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "attributes": {
    "class": "=if(@currentField <= 70,'sp-field-severity--warning', '')"
  },
  "children": [
    {
      "elmType": "span",
      "style": { "display": "inline-block", "padding": "0 4px" },
      "attributes": { "iconName": "=if(@currentField <= 70,'Error', '')" }
    },
    { "elmType": "span", "txtContent": "@currentField" }
  ]
}
```

The predefined classes include `sp-field-severity--good`, `--low`, `--warning`, `--severeWarning` and `--blocked`, plus `sp-field-dataBars`, `sp-field-trending--up`, `sp-field-trending--down` and `sp-field-quickActions`. Learn notes that the icons in its screenshots are not part of the class; add icons with the `iconName` attribute, using Fluent UI icons. For text or choice fields, nest `if` expressions to map each value to a class and icon.

## Rules based on dates and other columns

Reference another column with `[$FieldName]`, using the internal name. Spaces become `_x0020_`. The special value `@now` is the current date and time when the view loads. This pattern colors the field red when the due date is within a day:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "txtContent": "@currentField",
  "style": {
    "color": "=if([$DueDate] <= @now + 86400000, '#ff0000', '')"
  }
}
```

Dates can be added to as milliseconds, so one day is 86,400,000. To compare with a fixed date, convert it with `Date('3/22/2017')`.

## Links, data bars and multi-value fields

**Links.** Use `elmType` `a` with an `href` attribute. Learn says column formatting cannot output links to protocols other than `http://`, `https://`, `mailto:` and `tel:`, and `tel:` allows only digits, `*+#` and `.-/()` separators. In a List web part, add the `data-interception` attribute set to `on` to navigate in the same tab.

**Data bars.** Set `class` to `sp-field-dataBars` and a `width` expression, for example `=if(@currentField >= 20, '100%', (@currentField * 5) + '%')`. Adjust the boundary to the maximum value you expect.

**Multi-value fields.** Learn shows the `length` and `join` operators, `forEach` to repeat an element per value, and `loopIndex` to find the position in the loop, for Person, Lookup and Choice fields.

## Supported column types

Supported: Calculated, Choice, ContentType, Counter (ID), Currency, Date/Time, Hyperlink, Image, Location, Lookup, Multi-Choice, Multi-Line Text, Multi-Person, Number, Person or Group, Picture, Single line of text, Title in lists, Yes/No, Managed Metadata, Average Rating, Likes, Approval Status and Attachments.

Not supported: Filename in document libraries, Retention Label, sealed columns, and Multi-Line Text with enhanced rich text.

## How I would work

This section is my advice, not a Microsoft statement.

1. **Copy a Learn example** closest to your goal, then change one thing at a time and use **Preview** before **Save**.
2. **Use internal names in rules.** If a rule does nothing, a display name in `[$...]` is a likely cause.
3. **Test on a copy of the view or list** first, since Save changes what everyone sees.
4. **Keep the JSON in a file** with the list name, so you can restore it later.
5. **Do not rely on formatting for security.** Learn says it changes only the display, so the underlying data is still there for anyone with access.
6. **Check the samples repository** the page links for community formats before writing long JSON.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Lists](https://www.m365.fm/entity/microsoft-lists/)

## Sources

- [Use column formatting to customize SharePoint (Microsoft Learn)](https://learn.microsoft.com/sharepoint/dev/declarative-customization/column-formatting)
