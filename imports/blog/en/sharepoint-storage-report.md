---
title: "SharePoint storage full? How to find what is using your quota"
summary: "Build a SharePoint storage report: read the quota, rank sites by storage used, check versions and recycle bins, then free space with Microsoft's own options."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-reporting, sharepoint-document-libraries, sharepoint, sharepoint-essentials-toolkit]
keypoints:
  - "The tenant quota starts at 1 TB and grows by 10 GB for each SharePoint license, and the Active sites page shows the total and the available storage."
  - "Rank sites by storage used, export the list and work from the biggest sites down to libraries and folders."
  - "Storage reported for a site, library or folder can be larger than the files you see, because version history and related data count too."
  - "Microsoft lists ways to recover space: version limits and trimming, emptying recycle bins, retention-based deletion, Microsoft 365 Archive and the inactive site policy."
  - "Storage figures do not include changes of the last 24 to 48 hours, so compare reports over weeks, not hours."
faq:
  - q: "How much SharePoint storage does my organization have?"
    a: "Microsoft states that the tenant quota starts at 1 TB, and each SharePoint license you buy adds 10 GB. The Active sites page in the SharePoint admin center shows the storage available and the total storage for your subscription at the top right. You can buy more storage in one-gigabyte increments or use the pay-as-you-go option."
  - q: "Why is a library bigger than the files I can see?"
    a: "Microsoft explains that storage consumption can include version history and other storage-related data associated with a file. The storage reported for a site, library or folder can therefore be larger than the combined size of the current files in the document library. Check the version limits first when a library looks too big."
  - q: "What happens when the tenant quota is exceeded?"
    a: "Microsoft states that when the quota is exceeded, classic site creation and site creation through PowerShell are blocked. Site admins can request more quota from Site Settings, Storage Metrics, which sends an email to the Global Administrators. Free space with version trimming, recycle bin cleanup, retention and archive, or buy additional storage."
---

To find what is using your SharePoint quota, start at the tenant level, rank all sites by storage used, then look inside the biggest sites for version history, recycle bins and large libraries, and only then decide what to trim, archive or buy. This guide is for the SharePoint admin who got the warning that SharePoint Online storage is almost full. It shows how to check SharePoint storage usage with a simple report built from Microsoft's own pages, what the numbers include, which options Microsoft lists for recovering space, and how to avoid deleting the wrong thing.

## SharePoint storage report: three places to look

Microsoft already gives you a built-in storage usage report. In the Microsoft 365 admin center, open Reports, then Usage, select SharePoint under Reports and choose the Storage tab. According to Microsoft's page on the [SharePoint storage report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/sharepoint-storage-reports?view=o365-worldwide), it answers three questions: how much SharePoint storage is used, available and allocated, how fast it grows, and what to do to delay or plan a storage purchase. The report shows total usage, a usage trend with an estimate of future usage, and links to site storage limits, version history limits and Microsoft Graph Data Connect. It refreshes every 48 to 72 hours, and a banner appears when SharePoint usage exceeds 80 percent of the quota. It is not available to Education tenants, which use the pooled storage report instead.

The storage report tells you how full the tenant is, but not which sites are responsible. For that, use the per-site table of the [SharePoint site usage report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/sharepoint-site-usage-ww?view=o365-worldwide), which sits on the Site usage tab of the same page. Its columns include Storage used (MB), Storage allocated (MB), Files, Active files, the site owner and the last activity date. You can choose columns and export all data to a CSV file. Two details matter. By default, usernames, group names and site names are hidden in usage reports, and you must change that setting to see them. And the report can list sites that do not appear under Active sites in the SharePoint admin center, because some site templates and URLs are not included there.

The third place is the Active sites page in the SharePoint admin center. Microsoft's article on [managing site storage limits](https://learn.microsoft.com/en-us/sharepoint/manage-site-collection-storage-limits) says that the upper right of the page shows the amount of storage available and the total storage for your subscription, and the site list can show columns such as Storage used and Last activity and can be exported as a CSV file. With these three views, you have a [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) baseline in five minutes:

1. Read the Storage tab: used, available and trend.
2. Open the Site usage tab, choose Storage used and Last activity date, and export the table.
3. Sort the export by storage used, largest first, and save it with the date.
4. In a spreadsheet, add the cumulative share: how much of the total do the top 10 sites use?
5. Mark sites with large storage and old last activity. They are the first candidates.

Two caveats from Microsoft's pages. Storage usage does not include changes made within the last 24 to 48 hours, so a cleanup shows its effect with a delay. And deleted sites in the recycle bin do not count toward the organization's total storage usage, while it takes up to 48 hours for the figure to update.

## What the SharePoint storage quota is made of

Microsoft's [storage planning page](https://learn.microsoft.com/en-us/sharepoint/sharepoint-storage-planning) states the basics for SharePoint Online: the tenant quota starts at 1 TB, and each additional SharePoint license adds 10 GB, which is 10 GB per licensed user. Storage is calculated in binary gigabytes, so 1 GB is 2 to the power of 30 bytes. A single site can hold much more than most sites need, so the quota is shared in a pool by default: all [SharePoint](https://www.m365.fm/entity/sharepoint/) sites use what they need when they need it. If you switch from manual to pooled management, SharePoint resets all limits to 25 TB.

The same page makes a point that explains most surprises: storage consumption can include version history and other storage-related data associated with a file. As a result, the storage reported for a site, library or folder might be larger than the combined size of the current files shown in a [document library](https://www.m365.fm/entity/sharepoint-document-libraries/). If a library looks too big for its content, look at versions before you blame the users.

## Site usage report and storage metrics: drill down from the site to the library

Once you know the biggest sites, go inside them. Site admins can open Site Settings and then Storage Metrics under Site Collection Administration. Microsoft mentions this page for requesting more quota, and it is the site-level place to start your drill-down. Compare these storage metrics with what users see in the library, and keep the site storage report you create from them with the date.

For a tenant-wide view of files, Microsoft names Microsoft Graph Data Connect: its SharePoint dataset covers site lifecycle, ownership and storage for sites and OneDrive accounts, and its SharePoint Files dataset adds file-level data. The planning page also mentions a storage skill in the SharePoint Admin Agent that provides insights on storage usage. Both need setup, so use them when your tenant is large enough to justify it.

For most admins, a manual routine is enough. For each of the top 10 sites, ask four questions:

- **Is the site still used?** Check the last activity and the owners.
- **Which library is the largest?** Compare library storage with the visible content.
- **Do versions explain the gap?** A big difference suggests many versions.
- **Is there old content that retention or archive could handle?**

## Check SharePoint storage with PowerShell

Admins who prefer scripts can read the same numbers with the SharePoint Online Management Shell. A Microsoft Q&A thread answered by Microsoft support runs `Get-SPOSite -Limit All` and exports three properties for every site collection to a CSV file: `StorageQuota` for the allocated storage, `StorageUsageCurrent` for the used storage and `StorageQuotaWarningLevel`. A community reply on the same thread names `Get-SPOTenant` for the tenant-wide `StorageQuota`.

Microsoft's reference for [Get-SPOSite](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/Get-SPOSite) adds three details. The default for `-Limit` is 200, and `ALL` returns every site collection. Some properties may not be populated when you use `-Limit`, so compare a few values with the admin center before you trust the file. And you need to be a SharePoint Online administrator and a site collection administrator to run the cmdlet. These pages do not state the unit of the storage values, so check your own output before you report totals to managers.

## Ways to recover storage space in the SharePoint admin center

Microsoft's planning page lists the options for SharePoint Online, and one metric decides which ones you need: how many GB you must free. Use them in this order, from least risky to most:

1. **Empty site recycle bins.** Microsoft recommends recovering storage from deleted items this way.
2. **Set version history limits to Automatic** at the organization level, and trim low-value versions.
3. **Use retention settings** to delete files automatically after a set period, where your policy allows it.
4. **Archive inactive content** with Microsoft 365 Archive.
5. **Apply an inactive site policy.** Microsoft notes that this requires SharePoint Advanced Management and that additional licensing may apply.
6. **Set a site storage limit.** Under Settings, Site storage limits, you choose the storage management mode. Automatic is the default pooled mode. Manual mode lets you set a SharePoint storage limit per site, with 25,600 GB as the maximum storage, and site owners get an email notice when a site approaches its limit.

If none of that is enough, you can buy more storage capacity. Each license adds 10 GB, additional storage can be bought in one-gigabyte increments at a cost per GB and month, and a pay-as-you-go option covers usage above the quota. Check the storage costs against the effort of a cleanup before you decide, and set a reminder to repeat the storage usage check every month.

## Protect the content before you trim

Space recovery has one irreversible step: trimming versions. Microsoft's FAQ on version history limits states that when a user deletes a previous version, SharePoint moves it to the recycle bin, where it can be restored. Versions trimmed by the Automatic setting, or removed because they exceed manual time limits, are tagged for permanent deletion and are not available for restoration from the recycle bin once purged. The same page says that the retention setting always wins: when a trim job meets a version under a retention policy or an eDiscovery hold, it stamps an expiration date on the version instead of deleting it.

Three habits make this safe. First, tell site owners which libraries you plan to change and when. Second, start with one library that has many versions and check the result before you extend the change. Third, keep the before-and-after exports of your storage report, so that you can show what the cleanup achieved.

## Example: 500 licenses and a 95 percent full tenant

This example uses invented numbers. A company has 500 SharePoint licenses. The quota is 1 TB plus 500 × 10 GB, which is 1,024 GB + 5,000 GB = 6,024 GB. The admin center shows 5,700 GB used, which is about 95 percent.

- **Ranking:** the top 10 sites use 3,100 GB, which is 54 percent of the used storage.
- **Versions:** one project site of 800 GB turns out to have about 55 percent version data, which is 440 GB. Automatic version limits and a trim job free most of it.
- **Recycle bins:** emptying them in 6 sites frees 120 GB.
- **Archive:** 5 inactive sites of 120 GB each move to Microsoft 365 Archive, which frees 600 GB.

The check: 440 + 120 + 600 = 1,160 GB. The used storage falls from 5,700 GB to 4,540 GB, which is 75 percent of 6,024 GB. The admin would have needed to buy about 1,200 GB without the cleanup, and now has room for the next year.

## Common mistakes

- **Cleaning the wrong layer.** Deleting visible files rarely helps when versions hold the space.
- **Expecting instant results.** Storage figures lag by 24 to 48 hours.
- **Trimming without a safety net.** Run a what-if analysis first and check retention, because Microsoft recommends it for version limits.
- **Skipping the owners.** Only the people who know the content can say what is safe to remove, so ask them before you trim.
- **Buying first.** Extra storage costs money every month, while a cleanup is a one-time effort.

## How software can help

Microsoft's own tools show storage per site and the tenant total. For a view of file storage down to files and folders, some teams add a reporting tool. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). According to the vendor's product page, it provides metadata reports that list items, files, folders and pages with their sizes and version counts, a monitor for storage growth, and scheduled reports that can be exported to SharePoint, by email, or to Excel or CSV. These are the vendor's statements, and M365.FM has not tested them. Compare any tool's totals with the admin center before you rely on it.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Export the Active sites list today, sort it by storage used and note the share of the top 10 sites. That list is the start of your SharePoint storage report, and it tells you where to look first to manage SharePoint storage.
