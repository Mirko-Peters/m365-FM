---
title: "How to Create a Dashboard With Copilot in Excel and Track Copilot Adoption"
summary: "Build dashboard pieces with Copilot in Excel using charts and PivotTables, then track Copilot adoption with the Microsoft 365 admin center usage report and the Copilot Dashboard in Viva Insights."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [copilot, copilot-analytics, excel]
keypoints:
  - "Copilot in Excel can create charts and PivotTables from prompts. Microsoft's page does not describe building a complete dashboard, so assemble the final layout yourself and review every result."
  - "The Microsoft 365 admin center usage report is at Reports > Usage > Microsoft Copilot. It offers 7, 28, 90 and 180 day views and exports to .csv."
  - "The Copilot Dashboard in Viva Insights shows readiness, adoption, impact and sentiment. It needs at least 1 Copilot license to process data, and some features need 50 licenses."
  - "Adoption metrics use defined levels: power users average 15 or more actions per week, habitual users 1 to 14, and active means use in the previous 28 days."
  - "Copilot assisted hours and value are estimates. The default hourly rate is $72 and can be changed in settings."
faq:
  - q: "Can Copilot create a dashboard in Excel?"
    a: "Microsoft Support documents Copilot in Excel creating charts and PivotTables from a prompt, plus highlighting, sorting and filtering. The page states nothing about dashboard requirements, so treat Copilot as a builder of individual visuals that you arrange on a sheet and verify yourself."
  - q: "Where do I see Copilot usage in the Microsoft 365 admin center?"
    a: "Microsoft Learn says to go to Reports, then Usage, and under Reports select Microsoft Copilot, then Copilot, and open the Usage tab. You can view the last 7, 28, 90 or 180 days and export to .csv."
  - q: "How current is the Copilot usage report?"
    a: "Microsoft Learn says activity for a given day typically becomes available within 48 hours of the end of that day in UTC. The system validates the past three days daily and fills gaps, so historical numbers can change."
  - q: "Do I need Viva Insights licenses to see the Copilot Dashboard?"
    a: "Microsoft Learn says a paid Viva Insights license and a Copilot license are not required to view the dashboard. Data processing starts with at least 50 Viva Insights licenses or at least 1 Copilot license. Features such as benchmarks and agent insights need at least 50 Copilot or Viva Insights licenses."
  - q: "What does the Copilot Dashboard count as an active user?"
    a: "According to Microsoft Learn, active Copilot users are those who used Copilot in the previous 28 days. Power users average 15 or more actions per week and used Copilot in at least 9 of the past 12 weeks. Habitual users average 1 to 14 actions per week with the same 9-of-12-week condition."
---

"Dashboard with Copilot" means two different jobs. One is using Copilot in Excel to build charts and PivotTables for your own data. The other is tracking how people use Copilot, which Microsoft covers with the usage report in the admin center and the Copilot Dashboard in Viva Insights. This article covers both and states what Microsoft's pages do and do not say.

## Part 1: Build dashboard pieces with Copilot in Excel

Microsoft Support documents these Copilot in Excel abilities: creating charts, creating PivotTables, and highlighting, sorting and filtering data. The page does not describe dashboards or give data requirements, so Copilot is a helper for the parts. You arrange them and check the numbers.

### Create a chart

1. Select the **Copilot** icon in the lower-right corner of Excel.
2. Describe the chart in the Copilot pane.

Examples from Microsoft's page: "Create a line chart showing change over time. Show data labels and gridlines." and "Create a chart with vendor budget on the X axis and headcount on the Y axis."

### Create a PivotTable

Describe the summary you want. Examples: "Create a PivotTable with the sum of sales, with month in rows and category in columns." If a suggestion does not match, add more detail and ask Copilot to generate again.

### Highlight, sort and filter

Ask Copilot to highlight, sort or filter. Copilot describes the change in the pane, and you select **Apply** to see it in the sheet. Examples include "Highlight the lowest values in units sold" and "Filter to show items that are due next week."

### Tips that match the documentation

- Name the columns or ranges you want Copilot to use, as Microsoft advises.
- Copilot makes direct changes to the workbook. You can undo or view earlier versions, and you can turn autosave off to test.
- Review, edit and verify everything Copilot creates. Microsoft's FAQ says it can make mistakes and advises against relying on it for finance, legal or medical decisions.
- Editing needs calculation options set to Automatic. Files from a SharePoint site that requires check-out do not work in Excel on Windows or Mac, though Excel for the web works.

Then put the charts and PivotTables on one sheet, set a consistent layout and add slicers or filters yourself. The pages I read give no steps for that part.

## Part 2: Track Copilot with the admin center usage report

This is the quickest view for admins.

1. Open the Microsoft 365 admin center.
2. Select **Reports** (or **Show all**, then **Reports**).
3. Select **Usage**.
4. Under **Reports**, select **Microsoft Copilot**, then **Copilot**.
5. Select the **Usage** tab.

Metrics, as Microsoft defines them:

- **Enabled users:** unique users with Copilot licenses in the period.
- **Active users:** enabled users who tried a user-initiated Copilot feature in one or more apps.
- **Active users rate:** active users divided by enabled users.
- **Total prompts submitted** and **average prompts per user** for Copilot Chat.

You also get adoption by app and a per-user table with active days and last activity date. Period options are 7, 28, 90 or 180 days. Note that 30 days is not an option for this report. Export with **Export**, or from a chart with the ellipsis and **Export**.

User names, display names, groups and sites are hidden by default. Data typically appears within 48 hours of the end of the UTC day.

Microsoft's admin reporting overview lists the **AI Administrator** role for this report and also names a Readiness report alongside it.

## Part 3: The Copilot Dashboard in Viva Insights

In the Viva Insights web app, select **Copilot Dashboard** on the left. Access works like this, according to Microsoft Learn:

- No paid Viva Insights license and no Copilot license is needed to view it.
- Access is automatic for some users, such as senior leaders in large tenants (at least 2,500 users with a Microsoft Entra ID, and other conditions) and Global Administrators. Others are assigned, such as Viva Insights Analysts, delegates and enabled managers.
- Data processing starts with at least 50 Viva Insights licenses or at least 1 Copilot license, and takes up to seven days after assignment.
- Tenants with at least 50 Copilot or Viva Insights licenses also get benchmarks, agent insights, survey sentiment and trendlines.

Pages and metrics:

| Page | What it shows |
|---|---|
| Readiness | Activation progress and recommendation cards |
| Adoption | Licensed and active users, usage levels, returning users, app breakdowns |
| Impact | Actions taken, assisted hours, assisted value, satisfaction rate |
| Sentiment | Survey results from Viva Pulse, Viva Glint or an uploaded CSV |

Definitions to quote correctly: an active user used Copilot in the previous 28 days. Power users average 15 or more actions per week and used Copilot in at least 9 of the past 12 weeks. Habitual users average 1 to 14 actions per week with the same 9-of-12 condition. Novice users average at least one action but do not meet that condition.

Copilot assisted hours are an estimate based on action counts and assistance factors, for example 6 minutes per search or summary action. Assisted value is hours multiplied by an hourly rate, with a default of $72 that you can change. The satisfaction rate appears only with at least 30 feedback responses from at least five unique users in 28 days.

The dashboard refreshes daily, shows the previous 28 days and can lag by up to six days. Metrics are hidden for groups below the minimum group size.

## Which view for which question

| Question | Use |
|---|---|
| How many licensed users tried Copilot? | Admin center usage report |
| Which apps are used most? | Usage report, Adoption by app |
| Are people forming a habit? | Copilot Dashboard usage levels |
| What is the estimated time saved? | Copilot Dashboard Impact, treated as an estimate |
| What did one user do, for compliance? | Purview audit logs |

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Analytics](https://www.m365.fm/entity/copilot-analytics/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Microsoft Viva Insights](https://www.m365.fm/entity/viva-insights/)

## Sources

- [Microsoft Support: Visualize your data with Copilot in Excel](https://support.microsoft.com/en-us/Excel/copilot/visualize-your-data-with-copilot-in-excel)
- [Microsoft Support: Frequently asked questions about Copilot in Excel](https://support.microsoft.com/office/7a13758f-d61e-4a56-8440-f2c9a07802ec)
- [Microsoft Learn: Microsoft 365 Copilot usage report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage)
- [Microsoft Learn: Microsoft Copilot Dashboard](https://learn.microsoft.com/en-us/viva/insights/org-team-insights/copilot-dashboard)
- [Microsoft Learn: Copilot reports for admins](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-reports-for-admins)
