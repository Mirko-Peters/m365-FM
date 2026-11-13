---
title: "Purview eDiscovery Export Missing or Stuck: Roles, Process Manager and Mailbox Checks"
summary: "The Export command is missing in a review set, or an export hangs at assessing request. Check eDiscovery roles first, then the process manager, job limits, mailbox health and the download setup."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [ediscovery, ediscovery-review-sets, purview]
keypoints:
  - "Microsoft Learn assigns the Export role only to the eDiscovery Manager and Administrator role group, so Compliance Administrator alone does not give users Export. A 2025 thread ended with exactly that fix."
  - "A person who is not an eDiscovery Administrator sees only the cases where they are a member, so check case membership as well as role group membership."
  - "Learn lists limits that explain many hanging exports: 50 concurrent jobs per organization, automatic cancellation after seven days, and a 30-day download window for review set exports."
  - "A stuck export for a few mailboxes was never confirmed as fixed in the thread, so use the mailbox checks as a diagnostic path, not as a guaranteed cure."
faq:
  - q: "Why can't a Compliance Administrator see Export or Download in eDiscovery?"
    a: "Microsoft Learn's permission table shows the Export role only in the eDiscovery Manager and Administrator role group. In a January 2025 Q&A thread, the poster confirmed that the missing command was caused by a missing eDiscovery Manager or Administrator permission. Holding the Compliance Administrator role group alone did not expose it."
  - q: "Where do I add a user to the eDiscovery Manager role group?"
    a: "Microsoft Learn says to sign in to the Microsoft Purview portal, go to Settings, then Role groups, select eDiscovery Manager, choose Edit, and pick users or groups for the subgroup you need. You need to be in Organization Management or hold the Role Management role to do this."
  - q: "How long can I wait for an export before I treat it as failed?"
    a: "Learn says an export that runs for more than seven days without completing is canceled automatically, and it recommends splitting large exports into smaller batches. A stuck state long before that, for example 24 hours with no progress as in a January 2026 thread, is a reason to start the diagnostic checks rather than wait."
  - q: "How long do I have to download an export?"
    a: "For review set exports, Learn says you must download the content within 30 days after the export completes. For exports made from a search, it says the packages expire 14 days after you create the export. After that, the data in the package is deleted and cannot be recovered."
---

Two different eDiscovery problems keep showing up in Microsoft Q&A. In one, a user opens a review set and cannot find **Export** or **Download**. In the other, an export starts, shows the message that it is assessing the request, and then never moves.

This article collects both. The scenarios come from three Microsoft Q&A threads from 2025 and 2026. The fixes come from Microsoft Learn. It is a troubleshooting checklist, not an official Microsoft procedure, and I mark what is only reported in a thread.

## Symptoms

- A user was added to the case and holds the Compliance Administrator role group, but the review set menu has no **Export** or **Download**. The browser was Microsoft Edge. (January 2025 thread, with a later comment from another user in July 2026 who reported the same.)
- An export that includes Exchange stays at "Assessing request, 2 locations and 0 items identified" for more than 24 hours for a few custodians, while SharePoint-only exports for the same people finish and other custodians export normally. (January 2026 thread.)
- Search and export jobs fail with an internal server error after a Microsoft service problem. (March 2025 thread.)

## Step 1: Check the roles

Microsoft Learn's page on [eDiscovery permissions](https://learn.microsoft.com/en-us/purview/edisc-permissions) was updated in September 2026. It says the **Export** role lets users export search results to a local computer, and its role table lists that role only for the eDiscovery Manager and Administrator role group. The table shows Compliance Administrator with the Case Management, Compliance Search and Hold roles, not Export. When premium eDiscovery features are on, users need both **Preview** and **Export** to preview and export content.

In the 2025 thread, a responder suggested the same check, and the poster confirmed the fix: the account lacked the eDiscovery Manager or Administrator permission, even with Compliance Administrator.

To add someone, Learn gives these steps:

1. Sign in to the Microsoft Purview portal.
2. Go to **Settings**, then **Role groups**.
3. Select **eDiscovery Manager**.
4. Select **Edit**, then use **Choose users** or **Choose groups** for the subgroup you need.
5. Select **Next** and **Save**.

You need Organization Management, or the Role Management role, to change role groups.

## Step 2: Check case membership

Roles say what a person can do. Case membership says which cases they see. Learn says that users who are not eDiscovery Administrators see only the cases in which they are members, and that an eDiscovery Administrator can manage any case after adding themselves as a member. A role group can be a case member. A mail-enabled security group cannot.

Also note: an eDiscovery Manager can only manage the cases they created. If the person built the case themselves, this does not matter. If someone else owns it, they must be added.

## Step 3: Use the documented export path and browser

For a review set, [Learn](https://learn.microsoft.com/en-us/purview/edisc-review-set-export) says: open the case, select the **Review sets** tab, open the review set, select the **All items** tab, select the items, then use **Action**, then **Export** on the command bar. The thread's responder used the word "Actions", but Learn's page uses **Action**. Follow Learn's label.

After you start the export, Learn says to use the **Process manager** to track progress and download the content. The **Exports** tab in a case lists completed exports.

For downloads, [the search export page](https://learn.microsoft.com/en-us/purview/edisc-search-export) recommends the latest Microsoft Edge. If nothing downloads, it lists these fixes:

- Allow pop-ups from Microsoft Purview.
- Set automatic downloads to **Allow**.
- Allow first-party and third-party cookies for the download proxy sites, and turn off tracking prevention for the site.
- Allowlist the Purview export and Azure storage endpoints. Tools such as Zscaler or Microsoft Defender for Endpoint may need configuration.
- Use 7-Zip or WinZip instead of the built-in Windows zip tool, and enable **Condense paths to fit within 259 characters** if unzipping fails on long names.

The July 2026 comment in the first thread asked whether another browser had helped, and nobody replied, so that point is still open.

## Step 4: Look for job limits and timeouts

[Learn's troubleshooting page](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/ediscovery/resolve-ediscovery-issues) says that when an organization reaches the limit of 50 concurrent jobs, new requests fail with a message that the maximum number of jobs is running. Exports are more likely to fill that limit. It suggests waiting for jobs to finish or removing unneeded ones with `Remove-ComplianceSearchAction`.

The same page gives a script that lists export jobs in progress, using `Get-ComplianceSearchAction -Export -ResultSize Unlimited`. To run it you need to be a member of the eDiscovery Manager role group and an eDiscovery administrator in that group.

In the January 2026 thread, a moderator suggested cancelling stuck jobs with the same cmdlet family:

```powershell
Get-ComplianceSearchAction -Identity "<ExportJobName>" | Remove-ComplianceSearchAction -Confirm:$false
```

Learn names `Remove-ComplianceSearchAction` for removing jobs. It does not show this exact one-liner, so check the cmdlet help before you run it, and make sure you pick only the stuck job.

For review set exports, Learn says you must download the content within 30 days after the export completes. It also says exports that run for more than seven days without completing are canceled automatically, and recommends smaller batches by date range or filter. The poster in the thread had 32 GB and 57 GB exports stuck while 53 GB and 58 GB exports worked, so size was not the pattern there. The default maximum .zip package size in the export options is 10 GB, and you can raise it to 40 GB, with the PST size default at 5 GB.

## Step 5: Check the mailboxes that hang

In the January 2026 thread, only some custodians were stuck. Two moderator replies suggested these checks, which are in line with Learn's troubleshooting table:

1. Check that the user is found with `Get-Recipient`. Learn says that if the recipient is not found, there may be a synchronization delay. If no user object comes back, wait 30 minutes and check again, then retry.
2. If Learn's "location is ambiguous" error appears, a duplicate or conflicting object uses the same identifier. Run `Get-Recipient` and remove the duplicate.
3. Preview Exchange alone for one custodian. The moderator said zero items might point to a sync problem. This is from the thread only.
4. Check mailbox statistics and the size of the Recoverable Items folder, and look for an inactive mailbox, as the moderator suggested.

The moderator also named `Set-Mailbox -EwsHealthCheck` and removing and re-adding the Exchange license. I could not confirm that parameter in documentation, and a license change is disruptive. I would not do either without Microsoft Support confirming it first.

The thread shows that the first answer was marked as accepted by the poster. It does not show a final result, so I cannot say what fixed the stuck exports, or if anything did.

## Step 6: Rule out a service problem and a license gap

In the March 2025 thread, the search and export failures turned out to be a Microsoft service incident that the poster found in Service Health. Before you change anything else, check Service Health for eDiscovery. One community member in the same thread, months later, reported that their failure was caused by the account running the search having no license. That is a single report, but it is cheap to check.

## Step 7: Collect data before you call support

Learn says to run `Get-ComplianceSearch` or `Get-ComplianceSearchAction` and keep the output before opening a case. It also points to a page about collecting eDiscovery diagnostic information. Note the export name, the time it started, the custodians affected, and the text of the status shown in the Process manager.

## Quick verification

After a role fix, have the user open the review set again and check that **Action** now offers **Export**. After a stuck export, start a small export for one affected custodian and watch the **Process manager**. If it completes, split the large export into batches and keep each one well below seven days of run time.

## Related

- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [eDiscovery review sets](https://www.m365.fm/entity/ediscovery-review-sets/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Microsoft Learn: Assign permissions in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-permissions)
- [Microsoft Learn: Export from a review set](https://learn.microsoft.com/en-us/purview/edisc-review-set-export)
- [Microsoft Learn: Export search results in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-search-export)
- [Microsoft Learn: Resolve search errors in eDiscovery (Standard)](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/ediscovery/resolve-ediscovery-issues)
- [Microsoft Q&A: Unable to export eDiscovery Review Set Results (January 2025)](https://learn.microsoft.com/en-us/answers/questions/2146698/unable-to-export-ediscovery-review-set-results)
- [Microsoft Q&A: MS Purview eDiscovery Export Stuck (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5700284/ms-purview-ediscovery-export-stuck)
- [Microsoft Q&A: Purview eDiscovery Content Search failing with CS019-001 (March 2025)](https://learn.microsoft.com/en-us/answers/questions/2239709/purview-ediscovery-content-search-failing-with-cs0)
