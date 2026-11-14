---
title: "Build Paginated Reports With Power BI Report Builder: Install, Create, Publish"
summary: "Create paginated reports with Power BI Report Builder using Microsoft Learn: what they are, where to install it, the wizards, data sources, publishing permissions, export formats and limits such as the multivalue and null parameter rule."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [power-bi-report-builder]
keypoints:
  - "Paginated reports are print-friendly, multipage, pixel-precise reports that show all rows in a table. Install Power BI Report Builder from the Microsoft Download Center. Installing needs no license."
  - "A free license can publish only to My Workspace. Pro or PPU lets you publish to other workspaces with at least the contributor role. All users need Build permission for the dataset."
  - "The Table, Matrix or Chart wizard creates a data source connection, a dataset query, a layout and style and accessibility row properties. A Map wizard covers geographic data."
  - "A parameter cannot be both Multivalue and Allow null, but Multivalue can combine with Allow blank."
  - "Report Builder is fully supported on Azure Virtual Desktop and Windows 365. Running it as a virtualized application, such as a Citrix published app, is not supported."
faq:
  - q: "What is a paginated report?"
    a: "According to Microsoft Learn, a print-friendly, multipage, pixel-precise report that displays all rows in a table. You design a report definition, preview it locally and publish it to the Power BI service."
  - q: "Do I need a license to install Report Builder?"
    a: "No. Learn says you can install Power BI Report Builder from the Microsoft Download Center, and installing it does not require a license."
  - q: "Who can publish where?"
    a: "A free license can publish to My Workspace only. Power BI Pro or PPU can publish to other workspaces with at least the contributor role. All users need Build permission for the dataset."
  - q: "Which formats can I export to?"
    a: "PDF, Excel, Word, CSV, XML, MHTML and web view."
  - q: "Can I use Multivalue and Allow null together?"
    a: "No. Learn says you cannot set a parameter to be both at once. You can combine Multivalue with Allow blank, and in paginated reports a blank value is different from a null value."
---

Paginated reports are for output that has to print or export cleanly, such as invoices and long tables. You build them in Power BI Report Builder, preview them locally and publish them to the Power BI service. This guide follows the Microsoft Learn overview and lists what it does not detail.

## What you are building

Learn describes paginated reports as print-friendly, multipage, pixel-precise reports that display all rows in a table. The report definition specifies what data to use, where to get it and how to lay it out. You can preview it locally and publish it to the Power BI service.

## Get Report Builder

Install Power BI Report Builder from the Microsoft Download Center. Installing it does not require a license. System requirements are on the download page. The page also says Report Builder is fully supported on Azure Virtual Desktop and Windows 365, and that running it as a virtualized application, such as a Citrix published app, is not supported.

## Create a report

- **Table, Matrix or Chart wizard:** create a data source connection, build a dataset query, select a layout and style, add accessibility row properties and customize the report.
- **Map wizard:** displays aggregated data on geographic backgrounds such as SQL spatial data, ESRI shapefiles or Bing map tiles.
- **Design features:** table, matrix, chart and free-form layouts, charts, gauges, sparklines and indicators, document maps, drillthrough and show or hide toggles, parameters for user filtering, and embedded or referenced images.
- **Data sources:** SQL Server, Analysis Services, Oracle and Power BI semantic models, and others. The key capabilities table also lists Azure SQL and OData.
- **Existing reports:** you can open and refine reports originally authored in SQL Server Data Tools.

The interface is updated regularly, so button locations can differ from the screenshots on the page.

## Publish and distribute

Save the report definition locally or to the service. After publishing you can schedule email delivery through subscriptions. Deployment pipelines support a Development, Test and Production flow, and the page links to a getting-started guide.

### Who can publish

- **Free license:** My Workspace only.
- **Power BI Pro or PPU:** other workspaces, with at least the contributor role in that workspace.
- **All users:** Build permission for the dataset.

The page says paginated report licensing is the same as for Power BI reports, and links to the service feature license page. It does not mention Premium or Fabric capacity licensing.

## Export formats

PDF, Excel, Word, CSV, XML, MHTML and web view.

## Limits

You cannot set a report parameter to be both **Multivalue** and **Allow null** at the same time. You can combine **Multivalue** with **Allow blank**. In paginated reports a blank value is different from a null value.

## A first-report outline

This outline is a suggestion built from the page, not a Microsoft tutorial.

1. Install Report Builder and open the Table or Matrix wizard.
2. Create the data source connection and write the dataset query.
3. Choose the layout, style and accessibility properties.
4. Add parameters for filters, remembering the Multivalue rule.
5. Preview, save and publish to a workspace where you have the contributor role.
6. Check Build permission on the dataset for the people who run it.

## Checks before you publish

This checklist is a suggestion assembled from the statements above, not a Microsoft procedure.

- **Licensing:** confirm who will publish. A free license ends at My Workspace, so a team workspace needs a Pro or PPU license and at least the contributor role.
- **Dataset access:** confirm that every person who runs the report has Build permission for the dataset it uses. The page lists this as a requirement for all users.
- **Parameters:** review each parameter once more. If a parameter must accept multiple values and also an empty one, use Allow blank rather than Allow null, because Learn says a parameter cannot be both Multivalue and Allow null, while Multivalue with Allow blank is possible. A blank value and a null value behave differently in paginated reports.
- **Export targets:** decide which formats readers need. Learn lists PDF, Excel, Word, CSV, XML, MHTML and web view, so test the format that matters most, because pixel-precise layout is the main reason to use a paginated report.
- **Environment:** if authors work on virtual desktops, Learn names Azure Virtual Desktop and Windows 365 as fully supported. Do not plan on a Citrix published app.
- **Interface differences:** the page warns that button locations can differ from its screenshots, because the interface is updated regularly. Expect small differences when you follow older walkthroughs.

## Where paginated reports fit

The page positions paginated reports for print-friendly, multipage output. It does not give a decision guide against regular Power BI reports, so treat any rule of thumb beyond that statement as your own judgment and test it with your users.

## Not covered

The page does not give Premium or Fabric capacity licensing, code examples or expression syntax, step-by-step tablix setup, detailed parameter, grouping and sorting steps, detailed publishing and subscription steps, deployment pipeline configuration, system requirements or the full Map wizard workflow.

## Related

- [Power BI Report Builder](https://www.m365.fm/entity/power-bi-report-builder/)

## Sources

- [Power BI Report Builder](https://learn.microsoft.com/power-bi/paginated-reports/report-builder-power-bi)
