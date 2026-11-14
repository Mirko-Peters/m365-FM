---
title: "Restore OneDrive to a Previous Point in Time After Ransomware"
summary: "How the OneDrive restore feature works: where to find it, the 30-day activity chart, choosing a restore point, what happens to newer files, limits, and when to use the Recycle Bin or version history instead."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [onedrive]
keypoints:
  - "OneDrive restore covers the last 30 days and returns files to the state before the first activity you select."
  - "For a work or school account open OneDrive on the web, select Settings, then Restore OneDrive. Choose a date or Custom date and time."
  - "The daily activity chart and activity feed help you spot unusual activity before you pick the restore point."
  - "Files created after the restore point go to the Recycle Bin. Files permanently deleted from the Recycle Bin can never be recovered."
  - "SharePoint and Teams files are restored at document library level, not through this OneDrive feature."
faq:
  - q: "How far back can I restore OneDrive?"
    a: "Microsoft Support says the feature lets you undo actions within the last 30 days. The daily activity chart shows the volume of file activity for each of those 30 days."
  - q: "What happens to files created after the restore point?"
    a: "According to Microsoft Support, files or folders created after the restore point date go to the OneDrive Recycle Bin. You can restore them from there regardless of the restore point date."
  - q: "Can I undo a restore?"
    a: "Yes. Support says to run Restore again and select the restore action you just performed to reverse it."
  - q: "Does it restore SharePoint or Teams files?"
    a: "No. The page says SharePoint and Microsoft Teams files are handled by restoring a document library, which is described on a separate page."
  - q: "What if only a few files were affected?"
    a: "For partial recovery, the Support page suggests using the Recycle Bin or restoring previous file versions instead of restoring the whole OneDrive."
---

If ransomware or a bad sync has damaged files in OneDrive, the built-in restore feature can return the whole OneDrive to an earlier point. It looks back 30 days. This guide follows Microsoft Support's page on restoring your OneDrive. One limit up front: the page I read describes the user-facing flow. It does not describe how an admin restores another person's OneDrive, so this article does not either.

## When to use it

Use full restore when many files changed or were deleted and you can name a time before the problem began. If only a handful of files are affected, Microsoft suggests the Recycle Bin or restoring a previous version of a file. Before restoring after ransomware, stop the cause first. The detection flow below makes cleaning every device an explicit step before the restore, because otherwise the files can be encrypted again.

## Ransomware detection flow

A second Microsoft Support page describes what happens when Microsoft 365 detects an attack. You receive a notification on your device and an email. On the OneDrive website you may see a screen titled Signs of ransomware detected (the page spells it differently). Select **Get started**, then:

1. **Confirm the files are infected.** On the **Do these files look right?** screen, open suspicious files in the online viewer. Select **My files are infected** to continue or **My files are ok** to exit.
2. **Clean all devices.** Use antivirus software on every device that uses OneDrive, then select **All my devices are clean**. If you cannot clean them all, select **Antivirus can't clean all my devices** to reach the **Reset devices** page.
3. **Restore your OneDrive.** The detection date and time are selected for you.

The page says non-subscribers get their first notification and recovery free. It does not list plans, so check the plan page it links to. It also does not mention the 30-day window, file version counts or Recycle Bin behavior. Those come from the restore page.

## Who can use it

The page lists a Microsoft 365 subscription as the prerequisite. For a work or school account, the option appears in OneDrive settings on the web. The page does not list admin roles or further licensing details for work accounts.

## Steps

1. Sign in to OneDrive on the web.
2. Work or school account: select **Settings** and then **Restore OneDrive**. Personal account with Microsoft 365: select **Settings**, then **Options**, then **Restore your OneDrive** in the left navigation.
3. Choose a restore point from the date drop-down, such as **Yesterday**, or choose **Custom date and time**. If the restore follows automatic ransomware detection, a suggested date is already filled in.
4. Review the activities with the **activity chart** and **activity feed**.
5. For a custom date and time, select the earliest activity you want to undo.
6. Select **Restore**.

## Read the activity chart

The daily activity chart shows the volume of file activity for each of the last 30 days. The page says the chart can help you spot unusual activity. The activity feed lists individual file and folder operations in reverse chronological order, and you can expand or collapse each day. A slider below the chart jumps to a specific day.

When you choose a custom point, selecting one activity also selects every later activity. The page notes that more recent activities may be hidden in the feed after you pick a day in the chart, but they stay selected.

## What restore does

Your files return to the state before the first activity you selected. My advice: pick the earliest unwanted activity, not a later one, or you may leave encrypted copies behind.

## Limits

- Files or folders created after the restore point go to the OneDrive Recycle Bin. You can restore them from there.
- Files permanently deleted from the Recycle Bin can never be recovered.
- Albums are not restored.
- The window is the last 30 days.
- SharePoint and Teams files need a separate document library restore.

## Undo a restore

Run **Restore** again and select the restore action you just performed. This matters if you picked a point that is too early and lost recent good work.

## After the restore (my advice)

1. Check a sample of important folders and open files to confirm they are readable.
2. Look in the Recycle Bin for files created after the restore point that you still need.
3. Let the sync client catch up before you resume work.
4. Review how the infection happened, and treat the original cause as an incident.

This whole list is my own suggestion, not from the Support page.

## Gaps in the sources

The Support page does not describe how restore interacts with retention policies or legal holds, how long a restore takes, or what admins can do for other users. For those questions, check the SharePoint and OneDrive admin documentation before you rely on restore as a recovery plan. My advice: do not treat the 30-day window as a backup.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Restore your OneDrive (Microsoft Support)](https://support.microsoft.com/office/restore-your-onedrive-fa231298-759d-41cf-bcd0-25ac53eb8a15)
- [How to detect ransomware and recover files using OneDrive (Microsoft Support)](https://support.microsoft.com/onedrive/how-to-detect-ransomware-and-recover-files-using-onedrive)
