---
title: "Restore Permanently Deleted SharePoint Files: Options Beyond the Recycle Bin Retention"
summary: "What to try when a SharePoint file is gone from the site recycle bin: the second-stage bin, the 93-day limit, Restore this library, a Microsoft Support site restore, and Microsoft 365 Backup, with the limits of each."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [sharepoint, onedrive, microsoft-365-admin-center]
keypoints:
  - "Deleted items stay recoverable for 93 days in total. Items removed from the first-stage bin move to the second-stage site collection bin for the rest of that period."
  - "The second-stage bin is allotted 200% of the site collection quota, and the oldest items are purged first when it overflows."
  - "Restore this library rolls a library back up to 30 days, but it can't restore files deleted from the site collection recycle bin."
  - "A Microsoft Support restore covers 14 extra days, only for entire site collections, and only to a new URL."
  - "Microsoft 365 Backup gives longer protection, but file and folder restore reaches back 14 days and it is a paid pay-as-you-go service."
faq:
  - q: "How long can I recover a deleted SharePoint file?"
    a: "According to Microsoft Support, deleted items are kept for 93 days from the time they were removed from their original location. Items deleted from the site recycle bin move to the second-stage bin and stay there for the rest of the 93-day period. After that, or if you delete them manually from the second stage, they are permanently deleted."
  - q: "Who can see the second-stage recycle bin?"
    a: "Site collection administrators can view and restore items from it. You need administrator or owner permissions to access it. Global admins and SharePoint admins can also restore entire site collections."
  - q: "Can Microsoft restore a single file after the 93 days?"
    a: "The Microsoft Support article says SharePoint Online keeps backups for 14 extra days after deletion, and an admin can ask Microsoft Support for a restore within that window. These restores go only to a new URL and apply to entire site collections, not to individual files, lists or libraries."
  - q: "Does Microsoft 365 Backup restore single files?"
    a: "Microsoft Learn says it offers granular file and folder restore for SharePoint and OneDrive for the last 14 days only. Full site restores can reach back through the policy's recovery window. It is billed pay-as-you-go at $0.15 per GiB per month, according to the overview, and restores are free."
---

A file that is gone from the site recycle bin is not always lost. Several layers exist, each with a time window and a scope. This article orders them from cheapest to most involved and states what each cannot do, based on Microsoft's own pages.

## Know the windows first

SharePoint has two recycle bin stages. Microsoft Support describes them like this:

- **First-stage (site) recycle bin.** Deleted items land here first, including OneDrive files. They count toward storage.
- **Second-stage (site collection) recycle bin.** Items deleted from the first stage move here. They do not count toward storage.

Deleted items are kept for **93 days** from the time they were removed from their original location. Moving an item to the second stage does not restart the clock. The second-stage bin is allotted 200% of the site collection quota, and this cannot be changed. If it exceeds the quota, the oldest items are purged. Items are permanently deleted when deleted manually from this bin or when they pass 93 days.

Deleted subsites skip the first stage and go directly to the second-stage bin, and they count toward storage until purged.

## Step 1: Check the second-stage recycle bin

Most "permanently deleted" cases are only items someone removed from the first-stage bin or emptied it.

1. Open the site. For modern team sites and classic subsites, select **Recycle bin** in the left pane. For communication sites, go to **Site contents** and select **Recycle bin** in the top navigation. If missing, use **Settings** (gear) > **Site settings**, then under **Site Collection Administration** select **Recycle bin**. If **Site settings** is hidden, try **Site information** > **View all site settings**.
2. At the bottom of the page, select **second-stage recycle bin**.
3. Hover over the item, select the check icon on its right, then select **Restore**.

You need to be a site collection administrator or owner for the second stage. If an item came from a deleted folder, SharePoint recreates the folder in its original location and restores the item into it. Restoring a list, library, folder or Document Set brings back all of its contents and versions. You generally must restore a container before restoring an item that was deleted with it.

## Step 2: Use Restore this library for mass deletions

If many files were deleted, overwritten or corrupted, for example by malware, the library-level restore may be better. Microsoft Support says:

- It rolls an entire shared library back to a previous point in time, covering the **last 30 days**.
- Only site admins can start it. If the **Restore this library** command is missing, you lack permission or you are in a classic library.
- It is available in the modern experience only and cannot restore a library that was entirely deleted.

Steps: open the library (in Teams, the channel's **Files** tab, then **More** > **Open in SharePoint**), select **Settings** > **Restore this library**, choose a preset or **Custom date and time**, review the activity chart and feed, select the earliest activity to undo and select **Restore**. You can reverse a restore from the same page.

Limits that matter here:

- Restores rely on version history and the recycle bin. If version history is off, files cannot be restored to an earlier version.
- Files deleted from the site collection recycle bin, manually or by emptying it, cannot be restored this way.
- If you re-upload a file or folder after deleting it, its restore is skipped.
- Failed items produce a log file named RestoreLog followed by an ID, which you can share with support.

## Step 3: Ask Microsoft for a site collection restore

Microsoft Support says SharePoint Online keeps backups for **14 extra days** after deletion, and an admin can contact Microsoft Support to request a restore within that window. Be clear about the limits:

- These restores go only to a **new URL**.
- They apply to **entire site collections**, not individual files, lists or libraries.

So this is a recovery of last resort for a deleted or badly damaged site, and it is a poor fit if you need one file back. After such a restore you would copy the needed content from the restored site.

## Step 4: Microsoft 365 Backup

For longer protection, Microsoft 365 Backup is a backup and restore service for SharePoint sites, OneDrive accounts and Exchange mailboxes. From the overview:

- **SharePoint backup granularity** is the site. Recovery windows are 3 months, 6 months, or 1 to 10 whole years. Existing policies default to 1 year.
- **Recovery points** are 10-minute points for the prior 2 weeks, then weekly snapshots up to the window.
- **Full restore** rolls the site back to a prior point, overwriting all content and metadata changed since. It can restore to the same or a new URL.
- **Granular restore** of files and folders reaches back only 14 days.
- **Billing** is pay-as-you-go, $0.15 per GiB per month for protected data, and restores are free.
- Backups use append-only storage, and Purview retention and deletion policies do not affect the backup recovery window.

Setup requires the SharePoint Administrator or Global Administrator role, with a dedicated Microsoft 365 Backup Administrator role available. You need a valid Azure subscription for billing. Policies are created in the admin center under **Settings** > **Microsoft 365 Backup**.

The pages I read do not say whether content deleted before a backup policy was activated can be recovered. Restore points are created as soon as a policy is activated, which suggests backup protects from that point onward. Confirm with Microsoft before you rely on it for past deletions.

## Which option for which case

| Situation | First choice |
|---|---|
| One or a few files deleted in the last 93 days | Recycle bins, second stage included |
| Many files changed or deleted in the last 30 days | Restore this library |
| A whole site was deleted and the usual bins failed | Microsoft Support site restore within 14 extra days |
| Long retention and ransomware readiness | Microsoft 365 Backup, set up in advance |

## Habits that prevent a repeat

- Keep version history on, because library restore needs it.
- Limit who can empty the first-stage bin and delete from the second stage.
- Decide on a backup policy before an incident, since several options only work for recent deletions.

## Common mistakes

- Waiting. The 93-day period starts at deletion, not at the second-stage move.
- Using Restore this library after the files left the site collection bin.
- Expecting Microsoft Support to restore a single file.
- Counting on 30-day library restore for content you also need to keep for months.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Microsoft Support: Restore deleted items from the site collection recycle bin](https://support.microsoft.com/en-us/office/restore-deleted-items-from-the-site-collection-recycle-bin-5fa924ee-16d7-487b-9a0a-021b9062d14b)
- [Microsoft Support: Restore a shared library](https://support.microsoft.com/office/restore-a-document-library-317791c3-8bd0-4dfd-8254-3ca90883d39a)
- [Microsoft Learn: Overview of Microsoft 365 Backup](https://learn.microsoft.com/microsoft-365/backup/backup-overview)
- [Microsoft Learn: Set up Microsoft 365 Backup](https://learn.microsoft.com/microsoft-365/backup/backup-setup)
