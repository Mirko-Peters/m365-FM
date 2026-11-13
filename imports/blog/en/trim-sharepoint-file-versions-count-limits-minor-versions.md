---
title: "Trim SharePoint File Versions with Count Limits: What MajorWithMinorVersionsLimit Really Means"
summary: "A trim job with -MajorVersionLimit 100 and -MajorWithMinorVersionsLimit 5 left every minor version in place. Here is how Microsoft describes the two limits, how to run a safe trim, and what stays unclear."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [sharepoint, intelligent-versioning, sharepoint-document-libraries, sharepoint-advanced-management]
keypoints:
  - "Microsoft Learn describes -MajorWithMinorVersionsLimit as the number of major versions for which all minor versions are kept, not as a cap on the number of minor versions."
  - "Both count parameters must be given together, and the Learn tutorial uses -MajorWithMinorVersionsLimit 0 when only major versions should be counted."
  - "Trimmed versions are deleted permanently and bypass the recycle bin, so run the what-if analysis first and test on one site."
  - "Trim jobs run in the background in batches over the following days, and you can check or cancel them with the progress and Remove cmdlets."
  - "Learn does not say how files that only have minor versions (for example 0.192) are handled, so verify that case on a test library."
faq:
  - q: "What does -MajorWithMinorVersionsLimit do in New-SPOSiteFileVersionBatchDeleteJob?"
    a: "Microsoft Learn describes it as the number of major versions for which all minor versions will be kept. The cmdlet reference says that in count-limit mode you must specify it together with -MajorVersionLimit. The Learn tutorial example sets it to 0 together with -MajorVersionLimit 100."
  - q: "Can I undo a version trim job?"
    a: "No. Learn says trimmed versions are permanently deleted and cannot be recovered from the recycle bin, unless you have a backup such as Microsoft 365 Backup. You can cancel a running job, but versions that were already deleted do not come back."
  - q: "How long does a trim job take?"
    a: "Microsoft describes trim jobs as asynchronous background jobs that delete versions in batches over the upcoming days. Learn gives no fixed duration. Check progress with Get-SPOSiteFileVersionBatchDeleteJobProgress for a site."
  - q: "Do I need a special license to trim versions?"
    a: "For the tenant-level trim cmdlets, which are in public preview, Learn requires a SharePoint Advanced Management license or a Copilot license. The Learn page lists that requirement only for the tenant-level section. The site and library cmdlets in this article are described without a license statement."
---

A SharePoint administrator wanted to cut storage by trimming file versions across all sites. They ran a script that read site URLs from a CSV file and called `New-SPOSiteFileVersionBatchDeleteJob` with `-MajorVersionLimit 100` and `-MajorWithMinorVersionsLimit 5`. The expectation was: keep the last 100 major versions and the last 5 minor versions. What happened: the major versions were trimmed, but all minor versions of the remaining major versions stayed.

That question was posted in the Microsoft Community Hub in February 2026. It has no answer. This article does not claim to solve it. It shows what Microsoft Learn says about the two parameters, gives you a careful way to run a trim, and marks the points where documentation and the thread leave a gap. It is not an official Microsoft procedure.

## What the two parameters are documented to do

The Learn page "Trim existing versions" lists the count-limit command like this: `New-SPOSiteFileVersionBatchDeleteJob -Identity $siteUrl -MajorVersionLimit <n> -MajorWithMinorVersionsLimit <n>`. The placeholder text for the second parameter reads "number of major versions for which all minor versions will be kept". The Learn page for library version limits uses almost the same words for `Set-SPOListVersionPolicy`: the number of major versions for which all minor versions are kept.

The page also says the manual count-limit mode deletes the oldest versions that exceed the specified count limit.

Three more details from the documentation:

1. In the cmdlet reference, the count-limit syntax requires both `-MajorVersionLimit` and `-MajorWithMinorVersionsLimit`. Each page says you need the other one as well.
2. The Learn tutorial "Queue a trim job" shows `-MajorVersionLimit 100 -MajorWithMinorVersionsLimit 0` and labels it as keeping 100 major versions.
3. The cmdlet reference example uses `-MajorVersionLimit 30 -MajorWithMinorVersionsLimit 10`.

My reading of this wording is that the second number is not "how many minor versions to keep". It is closer to "for how many major versions do you want to keep every minor version". That reading differs from what the poster expected. It does not fully explain the poster's result either. With a value of 5, you would expect all minor versions to survive only for a limited number of major versions, not for each retained major. Microsoft's pages do not describe the exact pattern, so I cannot say whether the poster saw a delay, a different rule, or a bug. Treat that as open.

## Step 1: Decide which trim mode you need

Learn describes three trim modes for existing versions:

- **Age:** `-DeleteBeforeDays <days>` deletes versions older than the number of days you give.
- **Count limit:** `-MajorVersionLimit` and `-MajorWithMinorVersionsLimit`, as above.
- **Automatic:** `-Automatic` applies the logic of the Automatic version setting to existing versions.

The Learn page on version history limits recommends the Automatic setting for optimized version storage. It says the Automatic setting combines the recovery value of version history with lower storage use, without you having to guess count or age limits. The plan version storage page says Automatic keeps the versions created in the first 30 days (within a 500 count limit), then thins them out to hourly, daily and weekly versions as they age.

For age-based trimming, Learn lists two limits. The job does not delete versions created in the last 30 days, so the input must be at least 30 days. It also always deletes all versions created before January 1, 2023, so the number of days you choose must produce a date after that. Check the current page before you rely on these two points.

## Step 2: Generate the report and run the what-if analysis

Learn recommends a what-if analysis before any trim. The tutorials describe a version storage usage report for the site or library, which you download as a CSV file. You then run a script against the report with PowerShell 7. For the count-limit case, the what-if script in the tutorial takes `-ImportPath`, `-ExportPath` and `-MajorVersionLimit`. It does not take a minor-version limit. So the what-if result for count limits only models the major version limit.

The tutorial pages do not name the cmdlet that creates the report, so follow the Learn tutorial for that step. Learn says a what-if run on a large site or library can take a few days.

## Step 3: Queue the job on one site first

Connect as a SharePoint Administrator with the current SharePoint Online Management Shell, then queue a job for one test site:

```powershell
New-SPOSiteFileVersionBatchDeleteJob -Identity https://contoso.sharepoint.com/sites/site1 -MajorVersionLimit 100 -MajorWithMinorVersionsLimit 0
```

For one library, use the library variant:

```powershell
New-SPOListFileVersionBatchDeleteJob -Site https://contoso.sharepoint.com/sites/site1 -List "Documents" -MajorVersionLimit 100 -MajorWithMinorVersionsLimit 0
```

Learn warns that versions deleted this way are permanently deleted and do not go to the recycle bin. The cmdlet reference also lists `-WhatIf` and `-Confirm` as parameters. I did not find a description of what `-WhatIf` prints for these cmdlets, so do not treat it as a replacement for the report-based what-if analysis.

## Step 4: Watch the job

Trim jobs are asynchronous. According to Learn, the deletion happens in batches over the upcoming days, and volume, service health and farm workload affect the timing. Check a site-level job with:

```powershell
Get-SPOSiteFileVersionBatchDeleteJobProgress -Identity https://contoso.sharepoint.com/sites/site1
```

For a library job, the Learn trim page lists `Get-SPOListFileVersionBatchDeleteJobProgress -Site <url> -List <name>`. To stop a job, use `Remove-SPOSiteFileVersionBatchDeleteJob` or `Remove-SPOListFileVersionBatchDeleteJob`. Cancelling stops further deletion but does not restore versions that were already deleted.

Do not expect the storage report to change at once. Learn says usage figures can lag by up to 48 hours.

## Step 5: Set limits for new versions

A trim job only handles versions that exist today. To control future versions, set the version policy on the site or library:

- Site: `Set-SPOSite -Identity <url> -EnableAutoExpirationVersionTrim $true` for Automatic limits. Learn lists `-ApplyToNewDocumentLibraries` and `-ApplyToExistingDocumentLibraries` to choose the scope.
- Library: `Set-SPOListVersionPolicy -Site <url> -List <name> -EnableAutoExpirationVersionTrim $true`.

Learn adds that when you lower a count limit on a library, existing versions above the new limit are trimmed gradually, up to 20 per newly created version. The admin center UI does not accept fewer than 100 major versions or an expiration shorter than 30 days. Learn says lower values are possible through public APIs but not recommended, because they can cause inadvertent data loss.

## Step 6: Tenant-wide trimming

Learn lists tenant-level cmdlets such as `New-SPOTenantApplyFileVersionPolicyJob` (with `-CollectVersionData`, `-TrimVersions` and `-SetVersionPolicy`). They are in public preview, need a SharePoint Advanced Management license or a Copilot license, and exclude read-only, locked and archived sites. Only one tenant job can run at a time. If you manage many sites, compare this route with a CSV loop like the one in the thread.

## What stays unclear

- **Minor-only files:** The poster asked about files that were never published as a major version and have hundreds of minor versions, such as 0.192. Learn does not say how count-limit trimming treats them. Create a test library, add such a file and run a small job before you touch production.
- **Result mismatch:** The poster's observation that all minor versions of every retained major version stayed is not explained by the pages I read.
- **Retention:** The Learn trim page refers to an FAQ for versions under retention policies or eDiscovery holds. It does not describe the behavior on the page itself.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Intelligent versioning](https://www.m365.fm/entity/intelligent-versioning/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)
- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)

## Sources

- [Microsoft Learn: Trim existing versions from site, library, or OneDrive](https://learn.microsoft.com/en-us/sharepoint/trim-versions)
- [Microsoft Learn: Queue a trim job for a site or document library](https://learn.microsoft.com/en-us/sharepoint/tutorial-queue-a-trim-job)
- [Microsoft Learn: Run a what-if analysis](https://learn.microsoft.com/en-us/sharepoint/tutorial-run-what-if-analysis)
- [Microsoft Learn: New-SPOSiteFileVersionBatchDeleteJob](https://learn.microsoft.com/en-us/powershell/module/sharepoint-online/new-spositefileversionbatchdeletejob)
- [Microsoft Learn: Set version limits for an individual document library](https://learn.microsoft.com/en-us/sharepoint/library-version-limits)
- [Microsoft Learn: Overview of version history limits](https://learn.microsoft.com/en-us/sharepoint/document-library-version-history-limits)
- [Microsoft Learn: Plan version storage on document libraries](https://learn.microsoft.com/en-us/sharepoint/plan-version-storage)
- [Microsoft Community Hub: Trimming SharePoint Version History - Minor Versions (February 2026)](https://techcommunity.microsoft.com/discussions/sharepoint_general/trimming-sharepoint-version-history---minor-versions/4491609)
