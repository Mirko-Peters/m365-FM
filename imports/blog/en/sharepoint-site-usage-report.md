---
title: "SharePoint usage reports: what Microsoft gives you and what is missing"
summary: "The SharePoint site usage report shows files, storage, owner and last activity per site. See what it covers, where Microsoft's views stop and how to fill gaps."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-reporting, microsoft-365-admin-center, sharepoint, sharepoint-governance]
keypoints:
  - "The site usage report in the Microsoft 365 admin center lists each site's files, active files, page views, storage, owner and last activity date, with trends over 7, 30, 90 or 180 days."
  - "Reports typically appear within 24 to 72 hours, and usernames, site names and groups are hidden by default until a Global Administrator changes the setting."
  - "The last activity date combines five event groups, including page views, so a site that is only read can still look active."
  - "Site owners get a separate Site usage view and page analytics, which use other time ranges, exclude some activity and need a Viva license for some views."
  - "Keep dated monthly exports to build the history that the reports do not give you, and compare numbers only within one report."
faq:
  - q: "Where do I find the SharePoint site usage report?"
    a: "In the Microsoft 365 admin center, open Reports, then Usage, and select the SharePoint site usage report. You need a role such as Global Administrator, SharePoint Administrator or Reports Reader. Site owners can see their own site's data by opening Site usage from the settings gear on the site."
  - q: "Why are the usernames and site names hidden in usage reports?"
    a: "Microsoft hides user information such as usernames, display names, groups and sites in all usage reports by default, to help organizations meet local privacy laws. A Global Administrator can clear the conceal setting under Org Settings, Services, Reports. Microsoft notes that showing identifiable information is a logged event in the audit log."
  - q: "How current is the data in the usage reports?"
    a: "Microsoft states that reports typically become available within 24 to 72 hours, but sometimes need several days. The site usage trends cover the last 7, 30, 90 or 180 days. The site owner view excludes activity from the last 60 minutes, so neither source is a live view."
---

The SharePoint site usage report in the Microsoft 365 admin center lists each site with its files, active files, page views, storage, owner and last activity date, and it shows trends for 7, 30, 90 or 180 days. It is a good start for an inventory, but it is not a full analytics system and it does not show user activities one by one. This guide is for the SharePoint admin who wants to know what Microsoft's usage views answer, where their numbers differ, and which gaps you must fill yourself.

## SharePoint site usage report: what the admin center shows

You find the report in the Microsoft 365 admin center under Reports and Usage. Microsoft's article on the [SharePoint site usage report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/sharepoint-site-usage-ww?view=o365-worldwide) describes these columns:

- **Site URL and template:** the full URL of the site and the root web template, which you can use to filter after an export.
- **Site owner and owner principal name:** the primary owner of the site and the email address of the owner.
- **Last activity date (UTC):** the date of the last user action from five event groups, explained below.
- **Files and active files:** the number of files, and the number of files saved, synced, modified or shared in the chosen period.
- **Page views and pages visited:** the number of views, and the number of unique pages visited.
- **Storage used and storage allocated:** both in MB.
- **Deleted:** the deletion status, shown after at least seven days.

The report displays trends over the last 7, 30, 90 or 180 days. If you select a particular day, the table shows data for up to 28 days from the current date. You can export the data to a CSV file for sorting and filtering. Microsoft also notes that the site URL does not display if Bring Your Own Key or Customer Lockbox is enabled.

The overview page on [usage reports](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports) lists who may view them: roles such as Global Administrator, SharePoint Administrator and Reports Reader, plus limited roles that see no user details. It also states that reports typically become available within 24 to 72 hours.

For [SharePoint](https://www.m365.fm/entity/sharepoint/), the same Reports and Usage area has three reports: site usage, activity and storage. Microsoft lists all three as available in the public cloud, GCC, GCC High, DoD and the 21Vianet cloud. Microsoft documents each of them in its own article. Use the site usage report when the question is about a single site, and check the activity and storage reports for questions about behavior across SharePoint or about space.

## Hidden names and the privacy setting

By default, all reports hide user information such as usernames, display names, groups and sites. Microsoft explains that this supports local privacy laws. Only a Global Administrator is named as able to change it: in Org Settings, under Services and Reports, clear the option to conceal user, group and site names. Microsoft notes that showing identifiable user information is a logged event in the audit log.

This matters for governance work. An owner column full of anonymous values cannot start an owner conversation. Decide with your privacy officer whether the names may be shown, and who may open the exported file. Treat the CSV as personal data if the setting is off.

## Reports in SharePoint for site owners: site usage and page analytics

Site owners have their own views, and they use other rules. Microsoft's article on [site usage data](https://support.microsoft.com/en-US/SharePoint/sites-in-sharepoint/view-usage-data-for-your-sharepoint-site) says you open it from the settings gear and choose Site usage. It shows unique viewers, site visits, average time spent, popular content in the last seven days, visits by device and by time, and files shared with external users. Microsoft notes that site admins, owners, members and visitors can see it, and that the report does not include usage data collected in the last 60 minutes.

Page and news analytics go further down. The article on [page and news analytics](https://support.microsoft.com/en-us/sharepoint/sites-pages/view-usage-data-for-sharepoint-pages-and-news) lists unique viewers, total views, average time spent, page traffic by time and, for some cases, promotions and reactions. It states that guest and anonymous usage is not included, and that the hourly trends, 365-day daily data, reactions, promotions, link clicks and exports require a Microsoft Viva suite or Viva Communications and Communities license.

## What is missing

Taken together, Microsoft's built-in SharePoint usage reports leave gaps that matter to admins in SharePoint Online. These come from the documented behavior, so check each one in your tenant.

- **No difference between reading and editing in the last activity date.** Microsoft defines the date from five groups: active files, anonymous link shared, company link shared, files synced and pages viewed. A viewed page counts. A site that people only read can look active.
- **A short history.** The trends run for up to 180 days. For a longer view, you must keep your own dated exports.
- **Different numbers in different places.** The site owner view aggregates some metrics in UTC, excludes the last 60 minutes and excludes some file types. Page analytics exclude guests and anonymous users. Do not compare a number from one view with a number from another view.
- **Delay.** Reports can take 24 to 72 hours, so they are not a live view.
- **Hidden names.** The default setting hides names, so ownership questions need a deliberate change.
- **No verdict.** The reports give numbers, not a decision about what to do with an idle site.

The first point is the one that surprises admins most often. If your governance rule says that a site without activity for 90 days is a candidate for review, define whether page views count. Otherwise the rule contradicts the data.

## Get site usage data with the Microsoft Graph reports API

When the admin center is too manual, the Graph reports API returns the same site usage data as a file. According to Microsoft's reference for [getSharePointSiteUsageDetail](https://learn.microsoft.com/en-us/graph/api/reportroot-getsharepointsiteusagedetail?view=graph-rest-1.0), you call `GET /reports/getSharePointSiteUsageDetail(period='D7')` with a period of D7, D30, D90 or D180, or with a date from the past 30 days. The permission is Reports.Read.All for delegated and application access. For delegated access, the user also needs an appropriate Microsoft Entra limited administrator role.

The call returns a 302 redirect to a download URL that stays valid for only a few minutes. The file is a CSV with one row per site: Site Id, Site URL, owner, Is Deleted, Last Activity Date, File Count, Active File Count, Page View Count, Visited Page Count, storage used and allocated, Root Web Template and Report Period.

Two practical points follow. The page documents the plain REST call, so a script, a Power BI query or an app can use it, whichever tool you prefer. And because the file holds every site, you narrow it to one specific site by filtering on Site URL, since the documented call has no site parameter. The storage columns are in bytes, while the admin center report shows MB, so convert before you compare.

## Fill the gaps without a project

You do not need a new platform to close most gaps. Use these steps:

1. Export the site usage report every month, with the longest period, and save the file with the date.
2. Add the site list from the SharePoint admin center, so that you can match sites by URL.
3. Keep a short definition page for each metric, including the time zone and the exclusions mentioned above.
4. For thousands of users, Microsoft advises exporting the report to Excel or Power BI, or using the Microsoft Graph reports API.
5. Review the numbers each month with the site owners of the largest and the idlest sites.

This is the foundation for [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) in general. The dated files become your history, and they give you trends beyond 180 days. For the bigger picture of ownership, access and lifecycle, the usage numbers belong in your [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) metrics, next to the data from the other reports.

## Example: 600 sites and 150 quiet ones

This example uses invented numbers. A SharePoint admin exports the site usage report from the [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/) for 600 sites, with the last activity date and the active files count.

- **Zero active files in the 90-day view:** 150 sites, which is 25 percent of 600.
- **Of these, last activity older than 90 days:** 90 sites, with no views either.
- **Of these, still viewed:** 60 sites, where only page views keep the last activity date recent.

The check: 90 + 60 = 150. The 90 sites without any activity go to a review with their owners. The 60 sites that people only read stay in the list with a flag, because the last activity date counts page views in its definition and the site may still serve its audience. After the next monthly export, the admin compares the 150 with the new number.

## Common mistakes

- **Reading last activity as editing.** The date includes page views and other event groups.
- **Comparing numbers across views.** Each view has its own time zone, exclusions and delay.
- **Ignoring the hidden-names setting.** The owner column can look empty or anonymous.
- **Expecting live data.** Reports need 24 to 72 hours, and the site view skips the last 60 minutes.
- **Keeping no history.** Without dated exports, you cannot see a trend beyond 180 days.

## How software can help

Microsoft's built-in reports cover the basics, and the Graph reports API and Power BI cover larger tenants. For a long-term history, a scheduled export into a library or a spreadsheet is often enough. A reporting tool becomes interesting when you need ownership, storage and activity in one view. Judge any tool by whether it uses the same definitions, documents its time zone and exclusions, and keeps your history.

## Next step

Open your SharePoint site usage report today and export the 180-day view. Then write down how your team defines an idle site, so the usage numbers support your governance rules and not the other way around.
