---
title: "OneDrive Sync Client Explained: How Syncing Works and Common Problems"
summary: "What the OneDrive sync client does, how a change travels between Microsoft 365 and your PC, how Files On-Demand saves space, which limits matter and which problems show up most often, based on Microsoft documentation."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [onedrive, onedrive-sync-engine, onedrive-files-on-demand, onedrive-selective-sync]
keypoints:
  - "The OneDrive sync app for Windows and Mac keeps a folder on your device in step with Microsoft 365 storage. Microsoft calls the iOS and Android apps mobile apps, not sync apps."
  - "Changes in Microsoft 365 reach the sync app through Windows Push Notification Services, not through polling on a schedule."
  - "Files under 8 MB go in one HTTPS request. Larger files are split into chunks and sent one at a time through a BITS session."
  - "Files On-Demand shows a cloud icon for online-only files and a green checkmark for downloaded ones. Right-click offers Always keep on this device and Free up space."
  - "Documented limits include 250 GB per file, a recommended 300,000 items in total and a list of characters and names that cannot be synced."
faq:
  - q: "How does OneDrive know that a file changed in the cloud?"
    a: "According to Microsoft Learn, the sync app uses Windows Push Notification Services. When a change occurs in Microsoft 365, WNS alerts the sync app, the change enters the Internal Server Changes Queue, and changes are processed in the order they are received. The older Groove.exe client polled on a schedule."
  - q: "What is the difference between online-only and always-available files?"
    a: "Microsoft Learn describes three Files On-Demand states: Always available (pinned), Locally available and Online-only. A cloud icon marks files that are not yet downloaded, and a green checkmark marks downloaded files. Pinning an online-only file makes the sync app download it."
  - q: "Which file names does OneDrive refuse to sync?"
    a: "Microsoft Support lists the characters \" * : < > ? / \\ | and reserved names such as .lock, CON, PRN, AUX, NUL, COM0 to COM9, LPT0 to LPT9, _vti_ and desktop.ini. Any name starting with ~$ is also blocked. Leading and trailing spaces are not allowed either."
  - q: "How many items can the sync client handle?"
    a: "Microsoft Support recommends keeping the total under 300,000 items. It also describes a public preview, rolled out on April 22, 2026, that allows up to 1,000,000 items per sync instance on supported Windows and macOS devices with specific hardware, such as at least 8 GB of RAM and an SSD."
  - q: "Where do admins control sync behavior?"
    a: "Microsoft Learn lists the SharePoint admin center under Settings and then Sync, where you can require synced computers to be domain-joined and block uploads by file type. Group Policy sets the update ring and silent account configuration."
---

The OneDrive sync client is the app on Windows and Mac that keeps a local folder in step with your files in Microsoft 365. You edit locally or in the browser, and the client carries the change to the other side. Most problems come from a short list of causes: file names, item counts, file size, storage state and a stuck client.

## What the sync client is

Microsoft calls the Windows and Mac apps "sync apps" and the iOS and Android apps "mobile apps". Its overview page says the best OneDrive experience comes from using these apps rather than a browser alone.

The client does more than copy files. It also supports Known Folder Move, which redirects folders such as Desktop and Documents to OneDrive, and Files On-Demand, which controls what is stored on disk.

## How a change travels

Microsoft Learn describes the flow in order:

1. A change occurs in Microsoft 365.
2. Windows Push Notification Services (WNS) alerts the sync app.
3. OneDrive adds the change to the Internal Server Changes Queue. Metadata changes, such as a rename or delete, happen immediately.
4. Downloading content starts a separate session with the client.
5. Changes are processed in the order they are received.

The older client, Groove.exe, polled for changes on a schedule. Microsoft says push notifications remove redundant polling and save computing power.

For uploads, the size matters. Files under 8 MB are sent inline in a single HTTPS request. Files of 8 MB or more are split into chunks and sent one at a time through a Background Intelligent Transfer Service (BITS) session. Other changes are batched into HTTPS requests. For Office 2016 and 2019 files, Office and OneDrive cooperate. If the Office app is running it handles the sync, and if not, OneDrive does.

Microsoft also says file chunks are stored in multiple Azure containers, each with its own key, and a separate master key encrypts each chunk key.

The page does not describe how conflicting edits are resolved, so this article does not either.

## Files On-Demand

Files On-Demand lets you see, search and use OneDrive files in File Explorer without downloading all of them. Files you have not opened show a cloud icon. Downloaded files show a green checkmark. By default, files download when you open them.

- To keep a file offline, right-click it and select **Always keep on this device**.
- To free space, right-click a downloaded file and select **Free up space**.

Microsoft's admin reference maps these to three states: Always available (pinned), Locally available and Online-only (unpinned). The `attrib` command can read and set them, for example `attrib +p` to pin and `attrib +u` to unpin. To make an online-only file locally available, you first set it to always available.

Microsoft's recommended configuration keeps Files On-Demand on. It is on by default for Windows 10 and Mac. If the option is missing from Settings even though you meet the requirements, Microsoft documents setting the Windows Cloud Files Filter Driver (`CldFlt`) service start value to 2.

## Limits that matter

| Area | What Microsoft Support states |
|---|---|
| File size | 250 GB per file for sync, upload and download |
| Item count | Keep the total under 300,000 items |
| Large libraries | Public preview of up to 1,000,000 items per sync instance on supported hardware, no VDI |
| Bulk copy in the browser | Up to 2,500 files at one time |
| Path length | No number on that page. It points to a separate article |

Names and types:

- Not allowed in names: `" * : < > ? / \ |`, plus leading and trailing spaces.
- Reserved names: `.lock`, `CON`, `PRN`, `AUX`, `NUL`, `COM0` to `COM9`, `LPT0` to `LPT9`, `_vti_`, `desktop.ini` and anything starting with `~$`.
- TMP files do not sync. Outlook PST files sync, but less often than other types.
- Admins can block specific file types.

## Common problems and where to look

**A file will not sync.** Check the name against the lists above. A Microsoft Q&A thread on the error "The name contains characters that aren't allowed" recommends renaming, trying the upload in OneDrive for the web, and resetting the app. The same thread shows users who still got the error without any listed character, and no confirmed cause.

**Sync is slow or the library is huge.** Compare your item count to the 300,000 figure. Microsoft notes performance can suffer above it even if you do not sync everything.

**Disk space is tight.** Use **Free up space** on files you do not need offline. Microsoft's recommended configuration also names the policy to use Storage Sense on PCs.

**Updates.** Microsoft recommends a few IT staff in the Insiders update ring and everyone else in Production. Computers must reach `oneclient.sfx.ms` and `g.live.com`.

## For admins

In the SharePoint admin center, go to **Settings** and then **Sync**. There you can require that synced computers are joined to your domain and block uploads by file type. Microsoft's recommended configuration adds silent account configuration and Known Folder Move for Desktop, Documents and Pictures.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)
- [OneDrive Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/)
- [OneDrive selective sync](https://www.m365.fm/entity/onedrive-selective-sync/)

## Sources

- [How sync works](https://learn.microsoft.com/en-us/onedrive/sync-process)
- [Overview of OneDrive in Microsoft 365](https://learn.microsoft.com/en-us/sharepoint/onedrive-overview)
- [Files On-Demand for Windows (admin reference)](https://learn.microsoft.com/en-us/sharepoint/files-on-demand-windows)
- [Recommended sync app configuration](https://learn.microsoft.com/en-us/sharepoint/ideal-state-configuration)
- [Restrictions and limitations in OneDrive and SharePoint](https://support.microsoft.com/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa)
- [Microsoft Q&A: name contains characters that aren't allowed](https://learn.microsoft.com/en-us/answers/a/11071719)
