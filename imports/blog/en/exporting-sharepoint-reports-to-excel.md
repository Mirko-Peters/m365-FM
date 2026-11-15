---
title: "Exporting SharePoint reports to Excel"
summary: "SharePoint's built-in sharing report creates a CSV file that can be analysed in Excel. This guide covers what the data access governance reports and the site sharing CSV contain, what they leave out, and how to work with the exported data safely."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [sharepoint-reporting, excel]
faq:
  - q: "Can I export SharePoint permission and sharing reports to Excel?"
    a: "A site admin can create a CSV report of files, users, permissions and links for a single site, which Excel opens directly. For organization-wide data, the data access governance reports in the SharePoint admin center require the SharePoint administrator role and the licensing from the SharePoint Advanced Management prerequisites. Microsoft Learn documents that the site permissions for your organization report can be downloaded as a CSV file; check Microsoft Learn for the download options of the other reports."
  - q: "What does the site sharing CSV report not include?"
    a: "According to Microsoft Learn, the report for a single site does not include Anyone links or links that were e-mailed but not clicked. It also lists SharePoint groups without the individual people inside them. Keep these gaps in mind before treating the export as a complete picture of access."
  - q: "Where should I store an exported sharing report?"
    a: "Microsoft suggests saving the report in a folder that only site owners can access. The file lists unique files, users, permissions and links, so it is itself sensitive. Limit access, and delete or archive working copies in Excel once the review is finished."
---

SharePoint admins regularly need answers to questions like "Who has access to this site?" or "Which files are shared outside the organization?". The built-in [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) options give you data to answer them, but the raw reports are rarely the end product. To sort, filter and summarise the results, most admins end up in a spreadsheet.

This article explains which built-in reports exist, what they contain and what they leave out, and how to work with the exported data in [Excel](https://www.m365.fm/entity/excel/). Details can change, so check Microsoft Learn for the current state of each feature.

## Two kinds of built-in reports

Microsoft Learn describes two kinds of built-in reports for permissions and sharing. They serve different purposes, so it helps to know which one you need before you start.

**Data access governance reports** live in the SharePoint admin center under Reports, Data access governance. They cover the whole organization and need the SharePoint administrator role plus the licensing listed in the prerequisites for SharePoint Advanced Management. They come in two flavours:

- **Snapshot reports** show data as of the day they were created. The documentation names site permissions across the organization and sensitivity labels applied to files.
- **Activity reports** cover the last 28 days. The documentation names sharing links and content shared with "Everyone except external users".

**The site sharing report** is for a single site. A site admin can create a CSV file of every unique file, user, permission and link on a SharePoint site or OneDrive. The file is saved on the site itself.

In short: use the organization-wide reports to find where to look, and the single-site report to see the detail once you know which site needs attention. The documentation for each is on Microsoft Learn: [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) and [sharing reports](https://learn.microsoft.com/en-us/sharepoint/sharing-reports).

## What the reports do not tell you

Before you build anything on an export, read the limits. A report that looks complete can mislead if you do not know what is missing.

For the single-site CSV report, Microsoft Learn states:

- It does not include Anyone links.
- It does not include links that were e-mailed but not clicked.
- It shows SharePoint groups, but not the individual people inside them.

The last point matters most for permission reviews. Imagine a team site where a row shows "Marketing Members" with Edit permission. The CSV tells you the group has access, but not who belongs to it. To answer "Does this person have access?", you have to look up the group membership separately.

For the data access governance reports, timing is the main limit. Snapshot reports reflect one day. Activity reports reflect the last 28 days. Neither is a live view, so a conclusion drawn from last month's snapshot may not hold today.

Two more points from the documentation. For organizations without SharePoint Advanced Management, activity reports need data collection to be enabled, and data collection pauses if no report is generated for three months. And Microsoft recommends snapshot reports quarterly and activity reports monthly.

## Getting the data into Excel

The site sharing report is already a CSV file, so Excel can open it directly. For the data access governance reports, Microsoft Learn documents that the site permissions for your organization report can be downloaded as a CSV file (the page names up to 1 million sites for offline analysis), with one row per site and columns such as the number of users with access, Anyone link count, EEEU permission count and items with unique permissions. Check the report page in the SharePoint admin center and Microsoft Learn for the options offered for the other reports, because they can change over time.

A few habits make the import cleaner:

1. **Use Power Query instead of double-clicking the file.** In Excel, Microsoft Support describes the path Data, Get Data, From File, From Text/CSV. In my experience, Power Query lets you set column types and keeps the steps so you can refresh later with a new export.
2. **Keep the original export untouched.** Work on a copy or load the data into a query. If a filter goes wrong, you can start again from the source.
3. **Turn the result into a table.** Excel tables make sorting, filtering and PivotTables more stable and easier to read.

Excel's desktop app is the most complete version for this kind of work. Excel for the web covers common tasks in the browser, but features can differ from the desktop app, so check which version you have before planning a recurring process.

## Useful ways to analyse the export

Once the data is in a table, a few simple techniques cover most review needs. These are my own suggestions, not documented Microsoft procedures, and function availability depends on your Excel version.

**PivotTables for a quick overview.** Summarise the export by permission level, by user or group, or by link type. A pivot can help with questions like "How many items on this site have unique permissions?" without manual counting, depending on the columns in your export, so look at the headers first.

**Filters for exceptions.** Filter for links that are open to a broad audience, or for items shared with external users. Build a short list of items for the site owner to review, rather than sending the whole file.

**Dynamic array functions for clean lists.** Functions such as FILTER, SORT and XLOOKUP can build a review list that updates when the data changes. For example, you could use FILTER to show only rows for one site owner's folders, and XLOOKUP to add a separate list of group members next to the group names. That helps with the groups gap described above.

**Copilot in Excel, with care.** Copilot in Excel can suggest formulas and analyse tables. If you use it, check the results against the data yourself. The export contains information about who can see what, so also confirm that your organization's policies allow this kind of data to be processed that way.

## Handling the exported file safely

An export of permissions and links is sensitive. It shows exactly where access is broad or unusual, which is useful to an admin and to anyone who should not have it.

Microsoft suggests saving the site report in a folder that only site owners can access. Follow that advice, and extend it to your working copies:

- Store Excel files derived from the report in a location with limited access.
- Share findings with site owners as filtered extracts, not the full export.
- Delete or archive working copies when the review is finished.

A related caution: finding a problem in a report is not the same as fixing it. If your review leads to removing permissions, changing links or deleting content, treat that as a separate step. Test the change on a pilot site first, and make sure you have a backup or another way back, such as a record of the original permissions from the export, before you apply it more widely. Bulk changes in particular can cut off people who legitimately need access.

For analysis beyond what a single export can support, the sharing reports page points to Microsoft Graph Data Connect. That is a different tool with its own setup and requirements, so read the documentation before deciding if it fits your scenario.

## Practical takeaways

- **Pick the right report.** Use the data access governance reports for the organization-wide view and the CSV site report for the detail on one site.
- **Check the prerequisites.** The data access governance reports need the SharePoint administrator role and the licensing from the SharePoint Advanced Management prerequisites.
- **Know the blind spots.** The site CSV excludes Anyone links and e-mailed links that were never clicked, and it does not list the people inside SharePoint groups.
- **Remember the time frame.** Snapshot reports show one day, activity reports the last 28 days. Note the date in your spreadsheet.
- **Keep a rhythm.** Microsoft recommends snapshot reports quarterly and activity reports monthly. Without SharePoint Advanced Management, generating nothing for three months pauses data collection.
- **Use Power Query and tables in Excel.** They keep the source clean and make repeat reviews easier.
- **Protect the export.** Store it where only the right people have access, and delete working copies when done.
- **Test before you change.** Pilot any permission or link changes on a test site, and keep a backup of the original state.

Always confirm current details on Microsoft Learn, because report names, prerequisites and options can change.

## Sources

- [Data access governance reports for SharePoint sites (Microsoft Learn)](https://learn.microsoft.com/sharepoint/data-access-governance-reports)
- [Data access governance reports - get site permission states snapshot report for SharePoint sites (Microsoft Learn)](https://learn.microsoft.com/sharepoint/data-access-governance-site-permissions-report)
- [Prerequisites for SharePoint Advanced Management (Microsoft Learn)](https://learn.microsoft.com/sharepoint/sharepoint-advanced-management-prerequisites)
- [Report on file and folder sharing in a SharePoint site (Microsoft Learn)](https://learn.microsoft.com/sharepoint/sharing-reports)
- [Import data from a CSV, HTML, or text file (Microsoft Support)](https://support.microsoft.com/office/import-data-from-a-csv-html-or-text-file-b62efe49-4d5b-4429-b788-e1211b5e90f6)
