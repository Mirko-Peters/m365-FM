---
title: "OneDrive Sync Hangs, Processing Changes and Disk Space: What to Check"
summary: "A practical checklist for OneDrive sync that hangs on Processing changes, files that stay locked or open, and desktops running low on disk space, using Microsoft Support guidance."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [onedrive, onedrive-sync-engine, onedrive-files-on-demand]
keypoints:
  - "Microsoft lists open files, many files, very large files, signed-out state and a recent update as causes of a long Processing changes status."
  - "Microsoft Support recommends syncing no more than 300,000 items across cloud storage and names 250 GB as the limit for an individual file."
  - "Files On-Demand keeps files online-only. It is on by default from OneDrive build 23.066 and needs Windows 10 1709 or later."
  - "Move PST files out of OneDrive. Outlook data files cannot be removed from sync while Files On-Demand is on."
  - "Reset OneDrive is the last step. It disconnects sync connections, resets settings and triggers a full sync, but does not delete files."
faq:
  - q: "Why is OneDrive stuck on Processing changes?"
    a: "Microsoft Support lists these causes: a file is open, many files were added, a very large file was added, the user is not signed in, or the user just signed in or updated the computer. For many files or a recent update, Microsoft says OneDrive re-syncs on its own and can take a while."
  - q: "How many files should a OneDrive sync have?"
    a: "The Microsoft Support article on invalid names and limits says the standard recommendation is no more than 300,000 items across cloud storage for optimum performance. It is described as a recommendation, not a hard cap."
  - q: "How do I free local disk space without deleting files?"
    a: "Microsoft Support says to right-click a file or folder and select Free up space. With Files On-Demand, the file becomes online-only and is not deleted from OneDrive. Storage Sense can do this automatically for locally available files after a chosen time period."
  - q: "Does resetting OneDrive delete my files?"
    a: "No. Microsoft Support states that resetting OneDrive only disconnects sync connections and resets settings. A full sync follows. If only some folders were synced before, those folders must be selected again."
  - q: "Do the Microsoft pages explain CPU or memory hangs of the sync app?"
    a: "The pages read for this article do not. The performance article focuses on sync speed and network factors and gives no CPU or memory diagnostics. Treat tips about those symptoms from other sources with care."
---

A OneDrive sync that seems to hang is usually not frozen. In most documented cases it is working through a large queue, waiting on an open file, or blocked by a limit or a disk-space problem. The checks below follow what Microsoft Support and Learn publish. They start with the least invasive and end with a reset.

One honest limit first: the Microsoft pages read for this article do not describe diagnosing high CPU or memory use of the sync app. They cover sync status, limits, Files On-Demand and reset.

## Step 1: Read the status

Start with the status that OneDrive shows. The Microsoft Support index of sync problems names these states: Processing changes, Paused, account nearly full, account full or locked, not signed in and file locked. Each has its own article.

## Step 2: Identify why Processing changes does not finish

Microsoft Support lists these causes and fixes:

| Cause | What Microsoft says |
|---|---|
| A file is open | Close the file once editing is finished |
| Many files added | No action needed. OneDrive uploads everything, which can be slow on a slow connection |
| A very large file | Move large files, such as email data files, out of your OneDrive storage folders |
| Not signed in | Sign in again, for example after a password change |
| Recent sign-in or computer update | OneDrive re-syncs all files on its own and this can take a while |
| Hidden or temporary files | Temporary or hidden files may also be blocking sync |

Support adds that log files titled "aria-debug" can be safely deleted. It also recommends running an internet speed test when uploads look slow. If the status stays stuck, the article's last step is to unlink and re-link OneDrive.

## Step 3: Check limits that stall a sync

The Support article on invalid file names and file types says:

- 250 GB as the limit for syncing, uploading and downloading an individual file.
- A recommendation of no more than 300,000 items across your cloud storage for optimum performance. A public preview allows up to 1,000,000 items per sync instance on certain hardware, and it does not support VDI environments.
- Characters not allowed in names: " * : < > ? / \ |, plus leading or trailing spaces.
- Reserved names such as .lock, CON, PRN, AUX, NUL, desktop.ini and any name starting with ~$.
- Temporary TMP files and local system files such as desktop.ini do not sync.
- A network or mapped drive, symbolic links and junction points cannot be the sync location.

Each device can have one OneDrive for home account and nine work or school accounts.

For file path length, the article says different apps and Office versions have different limits and points to a separate article.

## Step 4: Move PST files and choose folders

The sync performance article suggests four tips: use Files On-Demand, move large files such as PST files out of OneDrive, account for slower uploads and strengthen the Wi-Fi connection. Pausing sync and resuming later is also suggested when the network is busy. Admins can limit connection speed for work or school accounts.

One catch from the Processing changes article: with Files On-Demand on, Outlook data files cannot be removed from sync, because Outlook needs local access to them.

## Step 5: Fix desktop storage problems with Files On-Demand

Files On-Demand shows all OneDrive files in File Explorer without downloading them. Microsoft Support says it is enabled by default starting with OneDrive build 23.066 and requires Windows 10 1709 or later or Windows Server 2019. To check it:

1. Select the OneDrive cloud icon, then **Help and Settings** and **Settings**.
2. Open the **Sync and back up** tab.
3. Expand **Advanced settings** and turn on Files On-Demand.

Icons mean the following:

- Blue cloud: online-only, uses no local space.
- Green check: locally available after opening.
- Green circle with a white check: **Always keep on this device**.

Right-click a file or folder and choose **Free up space** to return it to online-only. The advanced options **Free up disk space** and **Download all files** decide the default. With Storage Sense turned on, locally available files become online-only after the time period you select. The page does not describe what OneDrive does when the disk is nearly full.

Mind the notes from the same page: online-only files are searchable by name but not by content, and moving an online-only file outside the OneDrive folder downloads it there and removes it from OneDrive. Files On-Demand may not be compatible with some third-party antivirus software and is not supported when Windows Information Protection is enabled.

## Step 6: Reset OneDrive as the last step

Microsoft Support documents this procedure for Windows:

1. Press **Windows + R**, enter `wsreset.exe` and select **OK**. Ignore any windows that flash up.
2. Press **Windows + R** again and enter `%localappdata%\Microsoft\OneDrive\onedrive.exe /reset`.
3. If Windows cannot find it, try `C:\Program Files\Microsoft OneDrive\onedrive.exe /reset`, then `C:\Program Files (x86)\Microsoft OneDrive\onedrive.exe /reset`.
4. Start OneDrive again from the Start menu.

The reset disconnects all sync connections, resets all OneDrive settings and starts a full sync. Selective sync choices must be made again. Microsoft states that no files or data are lost. It does not state how long the full sync takes.

## What to avoid

- Resetting before checking for an open file or a very large file.
- Syncing PST files.
- Counting on a fixed duration for Processing changes. Microsoft gives none.
- Quoting old file size or path limits from memory. The Support article gives 250 GB for a file and says path limits differ by app and Office version.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)
- [OneDrive Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/)
- [OneDrive selective sync](https://www.m365.fm/entity/onedrive-selective-sync/)

## Sources

- [OneDrive stuck on Processing changes (Microsoft Support)](https://support.microsoft.com/en-us/office/b386b813-9b66-4e47-8c4c-2b45533edccd)
- [Fix OneDrive sync problems (Microsoft Support)](https://support.microsoft.com/en-us/office/fix-onedrive-sync-problems-0899b115-05f7-45ec-95b2-e4cc8c4670b2)
- [Tips to improve OneDrive sync performance (Microsoft Support)](https://support.microsoft.com/en-US/onedrive/tips-to-improve-onedrive-sync-performance)
- [Invalid file names and file types in OneDrive and SharePoint (Microsoft Support)](https://support.microsoft.com/en-us/office/invalid-file-names-and-file-types-in-onedrive-onedrive-for-business-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa)
- [Save disk space with OneDrive Files On-Demand for Windows (Microsoft Support)](https://support.microsoft.com/onedrive/save-disk-space-with-onedrive-files-on-demand-for-windows)
- [Reset OneDrive (Microsoft Support)](https://support.microsoft.com/en-us/onedrive/reset-onedrive)
