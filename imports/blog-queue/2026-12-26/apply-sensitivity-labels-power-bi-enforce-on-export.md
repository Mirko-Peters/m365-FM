---
title: "Apply Sensitivity Labels in Power BI and Enforce Them on Export"
summary: "Understand how Power BI applies Microsoft Purview sensitivity labels: supported items, inheritance, default and mandatory label policies, which export paths carry the label and encryption, enforcement differences and documented limitations."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [power-bi, sensitivity-labels]
keypoints:
  - "Labels can be applied to semantic models, reports, dashboards, dataflows and paginated reports in the service, and before publishing in Power BI Desktop."
  - "Protection is applied only on supported export paths. Export to Excel, PDF and PowerPoint, Analyze in Excel and downloading the pbix are covered. CSV is not."
  - "Export fails if the label cannot be applied. Admins can block non-supported export paths."
  - "In the service, labels do not restrict access and encryption applies only to exported data. In Desktop, encryption restricts who can open the pbix."
  - "Do Not Forward, user-defined permissions and HYOK labels are not supported. Parent labels cannot be applied."
faq:
  - q: "What can I label in Power BI?"
    a: "According to Microsoft Learn, semantic models, reports, dashboards and dataflows in the service, plus paginated reports. Workbooks are not supported. In Power BI Desktop you can apply a label before publishing."
  - q: "Does the label follow data when exported?"
    a: "On supported export paths, yes. Learn lists export to Excel, PDF and PowerPoint, Analyze in Excel, PivotTables in Excel with a live connection and downloading the pbix. Labels and encryption are not applied to CSV or other unsupported export paths."
  - q: "What if the label cannot be applied on export?"
    a: "The export fails, according to Learn. Admins can also block non-supported export paths."
  - q: "Do labels restrict who can open a report in the service?"
    a: "No. Learn says Power BI permissions control access in the service, and encryption applies only to exported data. In Desktop, encryption restricts who can open the labeled pbix."
  - q: "Which label types are unsupported?"
    a: "Do Not Forward, user-defined permissions and HYOK. Learn also says parent labels cannot be applied and exports from an item with a parent label fail."
---

Power BI can apply Microsoft Purview sensitivity labels to its content, and the label can follow data when it is exported. This article summarizes how labels are applied, how inheritance and policies work and where enforcement stops, using the Microsoft Learn overview. That page does not include the tenant prerequisites, so check the linked enablement article first.

## What you can label

In the Power BI service, labels can be applied to semantic models, reports, dashboards and dataflows. Paginated reports are also supported. Workbooks are not. In Power BI Desktop, you apply a label before publishing, it appears in the status bar and it is saved into the pbix file.

## Inheritance

- **New content:** new reports and dashboards inherit the label of their parent semantic model or report. If the label cannot be applied, Power BI does not block creation.
- **From data sources:** semantic models can inherit labels from labeled data in Azure Synapse Analytics and Azure SQL Database.
- **Downstream:** a label on a semantic model or report can flow to content built from it.
- **Analyze in Excel and live-connection PivotTables:** the Excel file inherits the semantic model's label. A later, more restrictive label updates the file on refresh. Manually set Excel labels are not overwritten, and an Excel file never inherits a less restrictive label.

## Policies

- **Default label policy:** applies default labels to unlabeled content, in Desktop and the service.
- **Mandatory label policy:** requires users to apply labels to sensitive content. Items with a parent label escape it.
- **Admin APIs:** set or remove labels on many items at once with `InformationProtection SetLabelsAsAdmin` and `RemoveLabelsAsAdmin`.

## Export and protection

Protection is applied only on supported export paths:

- Export to Excel, PDF and PowerPoint. For PowerPoint, labels apply only with **Export as image**. **Embed to live data** is not supported.
- Analyze in Excel.
- PivotTable in Excel with a live connection, for users with Microsoft 365 E3 and above.
- Download the pbix from the service. If the report and semantic model have different labels, the more restrictive label is applied.

Labels and encryption are not applied to CSV or other unsupported export paths. The export fails if the label cannot be applied. Admins can block non-supported export paths.

## Enforcement

- **Service:** labels do not restrict access. Power BI permissions control access, and encryption applies only to exported data.
- **Desktop:** encryption restricts access. Users without sufficient usage rights cannot open the labeled pbix.
- Exported files do not get owner permissions. Users get only the access the label allows.

## Limitations

- Do Not Forward, user-defined permissions and HYOK labels are not supported.
- Parent labels cannot be applied, and an export from an item with a parent label fails.
- Template app labels are removed on install, and labels added by consumers are reset on update.
- Labels from a deleted label can block export. Analyze in Excel exports an odc file with no label instead.
- B2B and multi-tenant scenarios are not supported.
- Protected pbix files cannot be opened by free-license users, and cannot be published by service principals, so remove the label first.
- Export to pbix may fail if the file exceeds 6 GB.
- Guest users cannot publish directly from a protected pbix file.

## Supported clouds and keywords

The page lists the supported clouds as global, GCC, GCC High, DoD and China, and says other national clouds are not supported. The step-by-step application instructions and the exact tenant setting names are in separate articles that the overview links to, so follow those when you configure the tenant.

## A test plan

This plan is a suggestion built from the limitations, not a Microsoft procedure.

1. Label a test semantic model and report, and export to Excel, PDF and CSV.
2. Confirm the label carries over on supported paths and that CSV carries none.
3. Try a pbix download as a user with limited usage rights.
4. Decide whether to block unsupported export paths for sensitive labels.

## Not covered

The page does not include tenant settings, licensing and prerequisites, step-by-step label application, configuration details for inheritance and policies, the audit log schema or deployment pipeline handling. It lists supported clouds as global, GCC, GCC High, DoD and China.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)

## Sources

- [Sensitivity Labels in Power BI (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/powerbi/service-security-sensitivity-label-overview)
