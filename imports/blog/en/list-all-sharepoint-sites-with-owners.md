---
title: "How to list all SharePoint sites with owners and last activity"
summary: "List all SharePoint sites with owners and last activity: export the Active sites list, add the usage report and PowerShell, then merge them into one inventory."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-reporting, sharepoint-site-owner, sharepoint-site-lifecycle, sharepoint]
keypoints:
  - "The fastest start is the Active sites page in the SharePoint admin center: customize the columns and select Export to get a CSV file."
  - "The Site usage report adds the site owner, the last activity date and the file counts for each site URL, but user and site names are hidden by default."
  - "Get-SPOSite with -Limit ALL returns more than the default 200 sites, and its filters include Owner, Template, LockState and Url."
  - "Merge the exports on the site URL and keep a dated copy, so that you can compare the inventory from month to month."
  - "The primary admin is not always the only owner, so check the owners and admins of group-connected sites before you act on the list."
faq:
  - q: "How do I export all SharePoint sites to Excel?"
    a: "Open the Active sites page in the SharePoint admin center, show the columns you need through Customize columns, and select Export on the command bar. Microsoft states that you get a CSV file that opens in Excel. The file lists the hub as a GUID and the template as an ID, for example STS#0."
  - q: "How can I see the owner of every SharePoint site?"
    a: "Use the Site usage report in the Microsoft 365 admin center, which has a Site owner column with the primary owner and the owner's email address. Usernames and site names are hidden by default, so change that setting first. For group-connected sites, also check the owners of the Microsoft 365 group."
  - q: "Why does Get-SPOSite return only 200 sites?"
    a: "The -Limit parameter of Get-SPOSite has a default value of 200. Microsoft states that you can pass ALL to retrieve all site collections. Personal sites are excluded unless you set -IncludePersonalSite to true, and sites in the recycle bin are not returned by the cmdlet at all."
---

To list all SharePoint sites with owners and last activity, combine three Microsoft sources: the Active sites export in the SharePoint admin center, the Site usage report in the Microsoft 365 admin center, and `Get-SPOSite` in PowerShell. Merge them on the site URL into one table and save it with the date. This guide is for the SharePoint admin who needs a first inventory before any lifecycle, cleanup or ownership work starts, and it shows what each source can and cannot tell you.

## List all SharePoint sites with owners: three Microsoft sources

No single page gives you everything. Each source has a different strength, so it helps to know them before you start.

- **Active sites page.** Microsoft's article on [customizing the site list](https://learn.microsoft.com/sharepoint/customize-admin-center-site-list) names columns such as Primary admin, Last activity, Files, Page views and Storage used, and you can show, hide and rearrange them. Microsoft also states that the data for Last activity, Files and Storage used is not available for US Government GCC High and DoD customers.
- **Site usage report.** The [SharePoint site usage report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/sharepoint-site-usage-ww?view=o365-worldwide) lists the site URL, the site owner, the owner's email address, the last activity date in UTC, files, active files, page views, storage used and the root web template. It covers trends over 7, 30, 90 or 180 days.
- **PowerShell.** The [Get-SPOSite cmdlet](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/Get-SPOSite) returns site collections and lets you filter on properties such as Owner, Template, LockState and Url. It is the best choice when you want a repeatable script.

Use the admin center for a quick look, the usage report for owner and activity, and PowerShell when you need to automate or filter on the server side.

## SharePoint admin center export sites: the quickest start

The Active sites page of the [SharePoint](https://www.m365.fm/entity/sharepoint/) Online admin center is the fastest way to get a list. Go to the page, and then:

1. Select the arrow next to a column header and choose Customize columns.
2. Show Primary admin, Last activity, Files and Storage used, and hide what you do not need.
3. Filter if you want only one kind of site, for example by template.
4. Select Export on the command bar.

Microsoft states that the result is a CSV file you can open in Excel. The file lists the hub as a GUID and the template as an ID, for example STS#0, so keep a short lookup table for both. The article does not say whether the export contains hidden columns or only the current view. Open the file once and check the header before you build anything on it.

A caveat for the usage report: it can list sites that do not appear on the Active sites page, because some site templates and URLs are not included there. That is a reason to use both sources and compare the counts.

## Who counts as the owner?

The word owner hides three different roles, and a good inventory keeps them apart. Microsoft's article on [managing site admins](https://learn.microsoft.com/en-us/sharepoint/manage-site-collection-administrators) describes primary and additional site admins. It notes that when you remove a person as primary admin, that person is still listed as an additional admin. For a group-connected team site, you can add and remove group owners and additional site admins. In the details panel opened with Membership on the Active sites page, you can see and change owners, members and site admins.

For team sites connected to a Microsoft 365 group, the group owners become the site owners, as the entity page for the [SharePoint site owner](https://www.m365.fm/entity/sharepoint-site-owner/) explains. A site can have several site admins but only one primary administrator. The result for your inventory: record the primary admin from the list, and add the group owners for group-connected sites as a second column. The usage report defines the site owner column as the username of the primary owner of the site, so it does not replace the group owner list.

One more point on privacy. Microsoft states that user-specific information, such as usernames, display names, groups and sites, is hidden in usage reports by default. If the owner column shows only anonymous values, change the report setting before you export, and treat the file as personal data.

## What the last activity date means

The two admin center sources show a last activity value, and both are easy to misread. The usage report page defines the last activity date as the date on which any event from five groups was logged as a user action: active files, anonymous link shared, company link shared, files synced and pages viewed. A viewed page counts, so a site that only people read can look active while nobody edits a file. Microsoft's pages do not state that the Active sites column uses the same definition, so compare a sample of ten sites in both sources before you rely on one.

Use the date as a signal, not as a verdict. A site with no activity for 90 days might still be an archive that people open once a year, and that is a question for the owner. If you have SharePoint Advanced Management, the [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) policies can ask owners for confirmation and set a minimum number of owners, so the inventory is the input for those policies.

## Build the inventory with PowerShell

A script gives you a repeatable list. After you connect with the SharePoint Online Management Shell, a pipeline like this writes a first file:

`Get-SPOSite -Limit ALL | Select-Object Url, Owner, Template | Export-Csv sites.csv -NoTypeInformation`

Microsoft's page for the cmdlet explains the details you need to know:

- The default value of `-Limit` is 200, and you pass ALL to retrieve all site collections.
- If you provide Limit or Filter, some site collection properties are not populated and can contain a default value, so check the columns of your own output.
- Personal sites are not returned unless you set `-IncludePersonalSite` to true.
- Sites in the recycle bin are not retrieved by the cmdlet.
- You need to be a SharePoint Online administrator and a site collection administrator to run it.
- The filter operators are -eq, -ne, -like and -notlike, and they are case-sensitive.

Treat the Owner value with care. For group-connected sites, test a few examples against the Membership panel to see what the property returns in your tenant.

## Merge and save the SharePoint site inventory

With the three files in hand, the work is a merge on the site URL. Keep one row per site, and use these columns: URL, template, primary admin, group owners, last activity date, files, storage used, hub. Add three flag columns: no activity in 90 days, no active owner, and a site that appears in only one source. Save the result as a dated file, for example a copy per month, because the comparison between two months is more useful than any single list. Link the saved files to the [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) you already do, so the same people see the numbers.

For the check on owners, compare the owner email addresses with the list of current users from your identity system. A primary admin whose account is gone is the typical start of an orphaned site.

## Example: 1,030 sites and three flags

This example uses invented numbers. The Active sites export holds 1,000 sites. The usage report lists 1,030 site URLs, and 30 of them do not appear on the Active sites page. The merged inventory has 1,030 rows.

- **No activity in 90 days:** 220 sites, which is about 21 percent of 1,030.
- **No active owner:** 60 of those 220 sites have a primary admin whose account no longer exists.
- **Active owner:** the other 160 of the 220 sites still have an owner who can answer.

The check: 60 + 160 = 220. The admin sends a confirmation request to the site owners of the 160 sites and puts the 60 sites into an admin review with a deadline. The 30 sites that appear only in the usage report get a short investigation to find out why the Active sites page does not show them. After the next month's export, the admin compares the counts: if the 220 falls, the process works.

## Common mistakes

- **Using only one source.** The usage report and the Active sites page can differ, so compare the counts.
- **Forgetting the 200 limit.** A `Get-SPOSite` call without `-Limit ALL` returns only the first 200 sites.
- **Reading the primary admin as the only owner.** Group-connected sites also have group owners, and a site can have several site admins.
- **Ignoring hidden names.** Usage reports hide usernames and site names by default, so the owner column can look empty.
- **Treating last activity as proof.** A site that people only read or open rarely still needs the owner's decision.

## How software can help

Microsoft's exports and PowerShell are enough for a first inventory, and most admins can build the merge in a spreadsheet in an afternoon. A scheduled script or a reporting tool becomes useful when you repeat the inventory every month and want the history. Judge any tool by whether it shows owners and admins separately, includes group-connected sites, and exports the data in a format you can compare month to month.

## Next step

Export the Active sites list today and open the CSV to check its columns. Then add the owner and last activity data, so that you can list all SharePoint sites with owners in one table and decide which sites need an owner conversation first.
