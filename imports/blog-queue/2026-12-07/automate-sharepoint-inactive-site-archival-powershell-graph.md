---
title: "Automate SharePoint Inactive Site Archival with PowerShell and Graph"
summary: "How to find inactive SharePoint sites with the Graph usage report and archive them with Set-SPOSiteArchiveState or the Graph archive call, plus the limits, states and built-in policy alternative."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [sharepoint, sharepoint-site-lifecycle, powershell]
keypoints:
  - "Archiving needs Microsoft 365 Archive enabled. Set-SPOSiteArchiveState sets a site to Archived or Active and supports -WhatIf."
  - "The Graph usage report getSharePointSiteUsageDetail returns a CSV with Last Activity Date for periods of D7, D30, D90 or D180."
  - "The Graph call POST /sites/{site-id}/archive is a beta endpoint. It needs Sites.Archive.All and returns 204 No Content."
  - "Sites reactivated within seven days of archiving (RecentlyArchived) are free and instant. Later reactivation is charged and takes time."
  - "The built-in inactive site policy can do the same without scripts, but PowerShell activity only counts as activity if the UserAgent parameter is passed."
faq:
  - q: "What do I need to run Set-SPOSiteArchiveState?"
    a: "Microsoft Learn says you must be at least a SharePoint Online administrator and be a site collection administrator, and that Microsoft 365 Archive must be enabled for the organization. The ArchiveState parameter accepts Archived and Active."
  - q: "How do I list sites by last activity with Graph?"
    a: "Use GET /reports/getSharePointSiteUsageDetail(period='D180'). Microsoft Learn says it returns a 302 redirect to a CSV report that includes Site URL and Last Activity Date. Reports.Read.All is the least privileged permission."
  - q: "Can I archive a site through Graph?"
    a: "Yes, with the beta endpoint POST /sites/{site-id}/archive. Learn lists Sites.Archive.All as the least privileged permission and states the call returns 204 No Content. The page is a beta reference."
  - q: "Which sites cannot be archived?"
    a: "Per Microsoft Learn, publishing sites, channel sites and some legacy site templates cannot be archived. OneDrive accounts cannot be archived by admins. Hub sites must be unregistered first, and private or shared channel sites stay active when a Teams-connected site is archived through PowerShell or Graph."
  - q: "Does my script count as site activity?"
    a: "The inactive site policy article says SharePoint Online PowerShell activity through a user token is considered only when the UserAgent parameter is passed, while PnP PowerShell activity through a user token and app-token activity are not considered."
---

Automated archival of inactive SharePoint sites needs three pieces: a list of candidates, a decision rule, and a call that archives. Microsoft provides the Graph site usage report for the list, the cmdlet `Set-SPOSiteArchiveState` or the Graph archive endpoint for the action, and a built-in inactive site policy as the no-script option. This article describes the scripted route and its documented limits.

## Prerequisites

- **Microsoft 365 Archive** must be enabled. The overview page's note for GCC tenants says to configure a pay-as-you-go billing policy in the Billing node of the Microsoft 365 admin center and then enable SharePoint Site Archive from the Settings page. The pages read give no step-by-step screens and do not say whether other tenants need the same sequence.
- The cmdlet requires at least the SharePoint Administrator role and site collection administrator rights on each site.
- Graph calls need an app or user with the right permissions, listed below.

## Step 1: Build the candidate list from the Graph usage report

The report call is:

```http
GET https://graph.microsoft.com/v1.0/reports/getSharePointSiteUsageDetail(period='D180')
```

Learn lists `D7`, `D30`, `D90` and `D180` as period values. The response is a 302 redirect to a preauthenticated CSV download link that is valid for a few minutes and needs no Authorization header. Columns include Site Id, Site URL, Owner Principal Name, Is Deleted, Last Activity Date, File Count, Storage Used (Byte) and Root Web Template. The least privileged permission is `Reports.Read.All`, for delegated and application access.

A script can download the CSV, filter on an empty or old Last Activity Date, skip deleted rows and write the result to a review file. This workflow is my suggestion, not a Microsoft procedure. The page does not explain how this activity date relates to the inactivity definition of the built-in policy, so treat it as a candidate list and not as proof.

## Step 2: Review before acting

Learn advises administrators to notify site owners and users before archiving. Exclude:

- Hub sites, which must be unregistered first.
- Publishing sites, channel sites and some legacy templates, which cannot be archived.
- OneDrive accounts (template 21), which admins cannot archive.
- Teams-connected sites with private or shared channels. PowerShell and Graph do not block archiving, but only the main site and standard channels are archived, and the channel sites stay active.

## Step 3: Archive with PowerShell

Syntax from the reference:

```powershell
Set-SPOSiteArchiveState -Identity <site url> -ArchiveState Archived [-NoWait] [-Force] [-WhatIf]
```

A safe first run uses `-WhatIf`:

```powershell
Import-Csv .\archive-candidates.csv | ForEach-Object {
    Set-SPOSiteArchiveState -Identity $_.'Site URL' -ArchiveState Archived -WhatIf
}
```

Remove `-WhatIf` after reviewing the output. `-Force` skips the confirmation prompt, and `-NoWait` does not wait for the operation to finish. The loop above is an example built from the documented parameters.

To reactivate, use `-ArchiveState Active`. The cmdlet reference explains the states:

- For seven days after archiving, a site stays in the `RecentlyArchived` state. Reactivation is free and instant.
- After seven days, or from `FullyArchived`, reactivation is charged and may take time.

## Step 4: Archive with Graph

The beta endpoint is:

```http
POST https://graph.microsoft.com/beta/sites/{site-id}/archive
```

Do not send a request body. Learn lists `Sites.Archive.All` as the least privileged permission, with `Sites.FullControl.All` as a higher one, for delegated and application use. For delegated calls the signed-in user needs a supported role, with SharePoint Administrator the least privileged. Success returns 204 No Content. The reactivation call is named `site: unarchive` in the beta reference. The pages read do not describe status polling or limits for these calls.

## What changes after archiving

According to the Microsoft 365 Archive pages:

- The site stops consuming active storage quota and starts consuming Microsoft 365 Archive storage.
- Compliance features such as eDiscovery and retention labels continue to apply.
- Reactivation returns the site to its pre-archive state, including permissions, lists, pages and files. The recycle bin continues to expire while archived, and content marked for deletion by retention policies is still deleted.
- Files archived individually before stay archived and must be reactivated separately.
- Archived content is no longer directly accessible to anyone.

## The no-script alternative

The inactive site policy in the SharePoint admin center (**Policies** > **Site lifecycle management** > **Inactive site policies**) notifies owners and can archive after a mandatory read-only period of 3, 6, 9 or 12 months. A policy scope can be a CSV of up to 10,000 URLs. It runs monthly in active mode and needs Microsoft 365 Archive for the archive action. It is part of SharePoint Advanced Management.

One scripting detail is useful here. The policy article says SharePoint Online PowerShell activity through a user token counts as activity only if the `UserAgent` parameter is passed. PnP PowerShell activity through a user token is not considered, and app-token activity is not considered either. Maintenance scripts therefore do not necessarily keep a site looking active.

## Typical mistakes

These points are my own reading of the documented limits, not a list from Microsoft.

- Archiving without a `-WhatIf` pass.
- Archiving a Teams-connected site and assuming the private channel sites were archived too.
- Forgetting that reactivation after seven days costs money.
- Combining a script with an active inactive site policy over the same sites without a clear owner for the decision.

## Related

- [SharePoint site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/)
- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)
- [PowerShell](https://www.m365.fm/entity/powershell/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)

## Sources

- [Manage Microsoft 365 Archive (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-manage)
- [Overview of Microsoft 365 Archive (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-overview)
- [Set-SPOSiteArchiveState (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/set-spositearchivestate?view=sharepoint-ps)
- [site: archive, Microsoft Graph beta (Microsoft Learn)](https://learn.microsoft.com/en-us/graph/api/site-archive?view=graph-rest-beta)
- [reportRoot: getSharePointSiteUsageDetail (Microsoft Learn)](https://learn.microsoft.com/en-us/graph/api/reportroot-getsharepointsiteusagedetail?view=graph-rest-1.0)
- [Manage inactive sites by using inactive site policies (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/inactive-site-policy)
- [Site lifecycle management (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management)
