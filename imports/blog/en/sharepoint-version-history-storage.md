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

To trim SharePoint version history safely, first measure how much storage versions use, then run a what-if analysis, and only then queue a trim job, because trimmed versions are permanently deleted and cannot be restored from the recycle bin. This guide is for the SharePoint admin who sees libraries growing faster than their content explains. It covers the limits Microsoft documents, the Automatic and Manual modes, the order of the steps, and the checks that keep protected content safe.

## SharePoint version history storage: why versions take so much space

Every time a file is saved and a new version is created, SharePoint Online keeps the earlier state so people can go back. Microsoft describes this recovery benefit in its guidance on [planning version storage](https://learn.microsoft.com/en-us/sharepoint/plan-version-storage), and the same page treats the storage cost as the reason to set limits. Each file version counts toward the storage of the SharePoint site, so the number of versions per file matters as much as the file size. The version count grows quickly when many people edit a file, when it is large, or when an app saves it often, and older versions stay until a limit removes them. In practice, a library that holds a few hundred active files can use more space for old versions than for the files you see.

This explains a common support case. The admin center reports a full tenant, the library looks small, and nobody can say where the space went. The visible files are only the latest version of each item, and the older versions sit behind them in the version history of every file. Before you buy storage space or ask users to delete files, check whether versions are the cause. A short export of version storage per library (see the measuring section below) shows the answer within a day.

## SharePoint version history limits: Automatic and Manual modes

Microsoft's page on [version history limits](https://learn.microsoft.com/en-us/sharepoint/document-library-version-history-limits) describes where limits can be set. Global and SharePoint admins can set them for the whole organization. Site owners can override the organization setting for their site, and library owners can override site or organization settings for a library. One detail matters for planning: the organization-level settings apply to new libraries, both on existing and on new sites. They do not shrink the versions that already exist, and the library settings of a single library can differ from the default for new document libraries.

The count limit works per file. If a file reaches 500 versions under a count limit of 500, the next save removes the oldest version, so the number of versions per file stays at the limit.

There are two modes:

- **Automatic.** Microsoft recommends it for most cases. This setting is also known as [intelligent versioning](https://www.m365.fm/entity/intelligent-versioning/). It keeps all versions created in the first 30 days, up to a count limit of 500. It then keeps hourly versions for days 30 to 60, daily versions for days 60 to 180, and weekly versions beyond 180 days, until the maximum of 500 is reached. Users keep access to more versions from the recent past and fewer older versions from far back.
- **Manual.** The admin sets a major version limit with an expiration period, which deletes versions that exceed either the count or the age, or a major version limit without an expiration period. The interface does not accept fewer than 100 major versions or fewer than 30 days. Microsoft advises against lower values, because user activity could cause inadvertent data loss.

Microsoft's page on version storage gives two scenarios in which Automatic mode reduced version storage by about 94 percent and 96 percent compared with count limits only. Treat them as examples of the algorithm, not as a promise for your tenant. The result depends on how often your files change.

## Measure before you trim

The first step is a report, not a deletion. Microsoft's article on [trimming existing versions](https://learn.microsoft.com/sharepoint/trim-versions) lays out the order: generate a version storage usage report for the site or library, run a what-if analysis on that report, queue the trim job, and track the job until it completes. The what-if analysis shows the impact of the trim mode you selected before anything is deleted.

A good measuring routine has five steps:

1. Rank your sites by storage used, as in a normal storage review.
2. Pick the five largest sites and generate the version storage usage report for each.
3. Find the libraries where version data is a large share of the total.
4. Run the what-if analysis for Automatic mode on those libraries, and write down the predicted space.
5. Mark the libraries that contain legal, finance or contract content, and ask their owners about retention.

Treat the output as a [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) baseline and keep the exports. After the trim you can compare the before and after numbers and show what the change achieved. The comparison also helps when a site owner asks why versions disappeared.

## Trim existing versions step by step

Microsoft documents trimming through PowerShell, not through a site settings page. For a single site, the Automatic mode uses `New-SPOSiteFileVersionBatchDeleteJob` with the `-Automatic` parameter and the site URL. For a single library, the equivalent cmdlet is `New-SPOListFileVersionBatchDeleteJob`. You track a running job with `Get-SPOSiteFileVersionBatchDeleteJobProgress`, and you can stop it with the matching remove cmdlet. Check the article for the current syntax before you run anything, because the cmdlets change over time.

Four points from the article deserve attention:

- **Start small.** Trim one library, wait for the result, and review the effect before you extend the change to the site.
- **Expect delays.** Depending on the size of the site or library, a job can take a few days. It is a background job, and Microsoft notes it is subject to off-peak processing.
- **Be careful with the manual expiration mode.** It does not delete versions created in the last 30 days, and it always deletes all versions created before January 1, 2023. Read this before you choose a number of days.
- **Know the tenant option.** A tenant-level trim exists as a public preview. It requires the SharePoint Administrator role and a SharePoint Advanced Management or Copilot license. Only one job is allowed per tenant at a time, and it skips read-only, locked and archived sites and sites with a broken version policy inheritance. Multi-Geo tenants must run it for each geo location.

The same article notes that a changed tenant policy is not applied again to sites that the job has already processed. If you change your mind in the middle of a job, plan a second run.

## What happens to deleted file versions

The safety rules are the part you must explain to site owners. Microsoft's [FAQ on version history limits](https://learn.microsoft.com/en-us/sharepoint/faqs-for-versions) makes three statements:

- When a user deletes a version, it moves to the recycle bin, where it can be restored.
- When Automatic mode or a manual expiration removes a version, it is permanently deleted and cannot be restored from the recycle bin.
- When a retention policy or an eDiscovery hold applies, retention wins. The trim job does not delete the version and stamps an expiration date instead.

The FAQ also says that purging expired versions can take a couple of days, so the storage figure does not drop at once. The limits page adds that deletion of versions on items that are marked as records is blocked, and that audit events for changes to limits and for trim jobs are available in the Microsoft Purview portal. If you run trims regularly, check that audit trail after each job.

One caveat: community reports and Microsoft pages are not fully consistent on how retention labels interact with trimming. Test a trim on a library that holds a label before you rely on it, and keep a backup for content you cannot afford to lose.

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
- **Expecting the organization limit to clean up old libraries.** It applies to new libraries, so existing ones need a trim job.
- **Choosing a manual limit that is too low.** The interface blocks values below 100 versions and 30 days for a reason.
- **Forgetting retention.** Versions under a policy or a hold stay, so the space you free can be smaller than you expected.
- **Not telling site owners.** People who rely on old versions should hear about the change before the job runs.

## How software can help

Microsoft's own tools show storage per site and the what-if results for trim jobs. Some teams also use a reporting tool to look at libraries over time. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). According to the vendor's product page, it offers metadata reports that include file sizes and version counts, a monitor for storage growth, and scheduled exports to SharePoint, by email, or to Excel or CSV. These are the vendor's statements, and M365.FM has not tested them. Compare any tool's numbers with the Microsoft reports before you base a trim on them.

## Next step

Generate the version storage usage report for your largest site this week and run the what-if analysis for Automatic mode. That one report shows how much of your SharePoint version history storage you could recover and which libraries need an owner conversation first.
