---
title: "Version history is filling SharePoint storage: how to trim it safely"
summary: "SharePoint version history storage can be trimmed safely: check the limits, run a what-if report, then trim with Automatic mode while retention stays protected."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [intelligent-versioning, sharepoint-document-libraries, sharepoint-reporting, sharepoint-essentials-toolkit]
keypoints:
  - "Version history keeps old copies of files for recovery, and those copies count toward the storage of a site, so busy libraries can use far more space than their visible files."
  - "Microsoft recommends the Automatic setting, which keeps all versions of the last 30 days and then thins older ones to hourly, daily and weekly versions."
  - "Organization and site limits apply to new libraries, so existing libraries need a separate trim job to shrink what is already stored."
  - "Versions removed by limits or trim jobs are permanently deleted and skip the recycle bin, so run a what-if analysis before every trim."
  - "Retention policies and eDiscovery holds take priority over trimming, which is why the freed space can be smaller than the report predicted."
faq:
  - q: "Does SharePoint version history count toward storage?"
    a: "Yes. Microsoft's guidance on version storage says that version history offers data recovery at a storage cost, and the versions of a file add to the storage used by the library and the site. A library can therefore use much more space than the current files shown in it."
  - q: "Is Automatic or Manual better for SharePoint version limits?"
    a: "Microsoft recommends Automatic for most libraries, because it keeps recent versions in full and thins older ones without you estimating counts or ages. Manual suits cases with fixed rules, such as a maximum number of major versions or an expiration period. The interface does not accept fewer than 100 versions or 30 days."
  - q: "Can I restore versions after a trim job?"
    a: "No, not from the recycle bin. Microsoft states that versions deleted by trim jobs are permanently deleted and bypass the normal recycle bin. They can be recovered only if a backup exists, for example from Microsoft 365 Backup. That is why Microsoft recommends a what-if analysis before every trim."
---

To trim SharePoint version history safely, first measure how much storage versions use, then run a what-if analysis, and only then queue a trim job, because trimmed versions are permanently deleted and cannot be restored from the recycle bin. This guide is for the SharePoint admin who sees libraries growing faster than their content explains. It covers the default limits, the Automatic and Manual modes, the order of the steps for a safe version history cleanup, and the checks that keep protected content safe.

## SharePoint version history storage: why versions take so much space

Every time a file is saved and a new version is created, SharePoint Online keeps the earlier state so people can go back. Microsoft's [overview of version history](https://learn.microsoft.com/en-us/sharepoint/version-overview) describes the benefit: a user can view a previous version without overwriting the current one, restore it, and see when and by whom a file was changed. It also supports audit and legal requirements. The cost is storage. Each file version counts toward the storage of the SharePoint site, so the number of versions per file drives storage consumption as much as the file size.

Microsoft's [Mission Critical blog](https://techcommunity.microsoft.com/t5/microsoft-mission-critical-blog/sharepoint-automatic-version-history-cleanup-intelligent/ba-p/4514011) names the usual cause: every edit saved by AutoSave or co-authoring creates a new version, so a single editing session can generate dozens of versions. By default, SharePoint Online allows up to 500 versions per item in a document library, with no expiration. The blog gives one analysis as an example: a library of 250 files with about 150 versions each used roughly 37.5 GB.

This explains a common support case. The SharePoint admin center reports a full tenant, the library looks small, and nobody can say where the space went. The visible files are only the latest version of each item, and the older versions sit behind them in the version history of every file. Before you buy storage space or ask users to delete files, check whether versions are the cause.

## SharePoint version limit: how many versions are kept by default?

Up to 500 per item, with no expiration, according to the blog. The blog adds that SharePoint will not keep more than 500 versions of a file: when a file reaches the cap under heavy editing, the oldest versions are trimmed to honor it. Microsoft also describes what happens when you lower a limit. The trimming is gradual: for a file at 500 versions and a new limit of 300, the system purges up to 20 of the oldest versions on each save until the file complies.

Two consequences follow. First, a high count limit alone does not protect your storage, because 500 versions of a large file can be a lot of space. Second, lowering a limit does not free space at once. It works through the files over time, as they are saved, which is why a separate trim job exists for existing content.

## SharePoint version history limits: Automatic and Manual modes

Microsoft's page on [version history limits](https://learn.microsoft.com/en-us/sharepoint/document-library-version-history-limits) describes where limits can be set. Global and SharePoint admins can set them for the whole organization. A site owner can override the organization setting for their site, and a library owner can override site or organization settings in the library settings. One detail matters for planning: the organization version history limits apply to new libraries, both on existing and on new sites. They do not shrink the versions that already exist, and the settings of a single library can differ from the default for new document libraries.

There are two modes:

- **Automatic.** Microsoft recommends it for most cases. The blog calls it Automatic Version History Cleanup, also known as [intelligent versioning](https://www.m365.fm/entity/intelligent-versioning/), and says it was introduced in SharePoint Online in late 2024. It keeps all versions from the first 30 days, up to the cap of 500. It then keeps about one version per hour for days 31 to 60, about one per day for days 61 to 180, and about one per week beyond 180 days. Current versions are never deleted by the system, and version expiration dates for older versions appear in the version history view.
- **Manual.** The admin sets a major version limit with an expiration period, which deletes versions that exceed either the count or the age, or a major version limit without an expiration period. The interface does not accept fewer than 100 major versions or fewer than 30 days. Microsoft advises against lower values in the version settings, because user activity could cause inadvertent data loss.

The blog advises using Automatic for most scenarios and manual limits only for a specific reason.

## Measure before you trim: the version storage usage report

The first step is a report, not a deletion. Microsoft's article on [trimming existing versions](https://learn.microsoft.com/sharepoint/trim-versions) lays out the order: generate a version storage usage report for the site or library, run a what-if analysis on that report, queue the trim job, and track the job until it completes. The what-if analysis shows the impact of the trim mode you selected before anything is deleted.

Microsoft's [tutorial for the version usage report](https://learn.microsoft.com/en-us/sharepoint/tutorial-generate-version-usage-report) explains the mechanics. You queue the report job with the SharePoint Online Management Shell, for example `New-SPOSiteFileVersionExpirationReportJob` for a site, and check progress with `Get-SPOSiteFileVersionExpirationReportJobProgress`. For a library, the equivalent cmdlets carry List in the name. The report is written as a CSV file to a location inside a SharePoint document library, and each row is one file version, with columns such as the file URL, major and minor version, size, modified by, last modified date and expiration dates. The page lists no version count column, so you get counts by counting the rows per file.

To analyze the file, Microsoft provides an Excel template, with views such as Summary, Version Count and File Level Analysis, and a PowerShell script that outputs tables such as the files with fewer than 10 versions and the users impacted. Set the target expiration date column to the dates you want to test. Microsoft warns that a date in the past marks a version as already expired, so it is deleted right away after you start the trim.

A good measuring routine has five steps:

1. Rank your sites by storage used, as in a normal storage review.
2. Pick the five largest sites and generate the version storage usage report for each.
3. Find the libraries where version data is a large share of the total.
4. Run the what-if analysis for Automatic mode on those libraries, and write down the predicted space.
5. Mark the libraries that contain legal, finance or contract content, and ask their owners about retention.

Treat the output as a [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) baseline and keep the exports. After the trim you can compare the before and after numbers and show what the change achieved.

## Trim existing versions step by step

Microsoft documents trimming through PowerShell, not through a site settings page, and the article covers sites, document libraries and OneDrive accounts. For a single site, the Automatic mode uses `New-SPOSiteFileVersionBatchDeleteJob` with the `-Automatic` parameter and the site URL. For a single library, the equivalent cmdlet is `New-SPOListFileVersionBatchDeleteJob`. You track a running job with `Get-SPOSiteFileVersionBatchDeleteJobProgress`.

Four points from the article deserve attention:

- **Start small.** Trim one library, wait for the result, and review the effect before you extend the change to the site.
- **Expect delays.** Depending on the size of the site or library, a job can take a few days. It is a background job, and Microsoft notes it is subject to off-peak processing.
- **Be careful with the manual expiration mode.** It does not delete versions created in the last 30 days, and it always deletes all versions created before January 1, 2023. Read this before you choose a number of days.
- **Know the tenant option.** A tenant-level trim exists as a public preview. It requires a SharePoint Advanced Management or Copilot license. Only one job is allowed per tenant at a time, and it skips read-only, locked and archived sites and sites with a broken version policy inheritance. Multi-Geo tenants must run it for each geo location.

The same article notes that a changed tenant policy is not applied again to sites that the job has already processed.

## What happens to deleted file versions

The safety rules are the part you must explain to site owners. Microsoft's page on version history limits makes these statements:

- When a user deletes a version, it moves to the site's recycle bin and can be recovered for a period.
- A version removed by a limit or by a trim job bypasses the normal recycle bin and cannot be recovered from it. The trim article adds that such versions can be recovered only if the data was backed up before, for example with Microsoft 365 Backup.
- For items under a retention policy or an eDiscovery hold, the versioning limits of the library are ignored. According to the blog, a trim job that reaches such a version does not delete it and extends the expiration until the hold is released.
- Deleting versions on documents marked as records is blocked.

Audit events for changes to limits and for trim jobs are available in the Microsoft Purview portal, so check that trail after each job. Because trimmed versions are gone for good, the blog's advice is plain: use the usage report, run the what-if analysis before large trims, and coordinate with your compliance team.

## Example: three sites, one trim plan

This example uses invented numbers and a planning assumption. An admin reviews three sites in a [document library](https://www.m365.fm/entity/sharepoint-document-libraries/) report.

- **Site A:** 300 GB in total, of which 210 GB is version data.
- **Site B:** 150 GB in total, of which 90 GB is version data. The site is under a retention policy.
- **Site C:** 80 GB in total, of which 20 GB is version data.

The what-if analysis for Automatic mode predicts that about 60 percent of the version data could be removed where no retention applies. That figure is an assumption for this example, not a Microsoft number.

- **Site A:** 0.6 × 210 GB = 126 GB.
- **Site B:** 0 GB, because retention wins and nothing is deleted.
- **Site C:** 0.6 × 20 GB = 12 GB.

The total is 126 + 0 + 12 = 138 GB. The three sites hold 300 + 150 + 80 = 530 GB, so the trim frees about 26 percent of their storage. Site B needs another route, such as a review of its retention scope. The admin trims Site C first because it is small and low risk, checks the result, and then queues Site A.

## Common mistakes

- **Trimming without a what-if analysis.** Microsoft recommends it, because trimmed versions cannot be recovered from the recycle bin.
- **Expecting the organization limit to clean up existing document libraries.** It applies to new libraries, so existing ones need a trim job.
- **Choosing a manual limit that is too low.** The interface blocks values below 100 versions and 30 days for a reason.
- **Forgetting retention.** Versions under a policy or a hold stay, so the space you free can be smaller than you expected.
- **Not telling site owners.** People who rely on old versions should hear about the change before the job runs.

## How software can help

Microsoft's own tools show storage per site and the what-if results for trim jobs. Some teams also use a reporting tool to look at libraries over time. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). According to the vendor's product page, it offers metadata reports that include file sizes and version counts, a monitor for storage growth, and scheduled exports to SharePoint, by email, or to Excel or CSV. These are the vendor's statements, and M365.FM has not tested them. Compare any tool's numbers with the Microsoft reports before you base a trim on them.

## Next step

To reduce SharePoint storage safely, start managing version history with one report: generate the version storage usage report for your largest site this week and run the what-if analysis for Automatic mode. That one report shows how much of your SharePoint version history storage you could recover and which libraries need an owner conversation first.
