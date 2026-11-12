---
title: "How to Sync OneDrive: Set Up, Choose Folders, Files On-Demand"
summary: "How to sync OneDrive on Windows: sign in, pick the folder location, choose which folders sync, use Files On-Demand and sync a SharePoint library the right way."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [onedrive, onedrive-selective-sync]
keypoints:
  - "Open the OneDrive app, sign in with your personal or work or school account and accept the folder location on the This is your OneDrive folder screen."
  - "Anything you add, change or delete in your OneDrive folder is added, changed or deleted on the OneDrive website too, and the other way round."
  - "To sync only some folders, go to Settings > Account > Choose folders and clear the folders that should stay online only."
  - "Files On-Demand shows all your files in File Explorer without downloading them. Right-click a file to keep it on the device or free up space."
  - "For a SharePoint library, the Sync button works, but Microsoft recommends a OneDrive shortcut when it's available."
faq:
  - q: "How do I start syncing OneDrive on Windows?"
    a: "Open the OneDrive app, which is already installed on Windows 11, and sign in with your Microsoft account or your work or school account. Accept the folder location on the This is your OneDrive folder screen, or choose a different one. After setup, your files show up in the OneDrive folder in File Explorer."
  - q: "How do I sync only some OneDrive folders?"
    a: "Select the OneDrive cloud icon, then the gear icon and Settings. Open the Account tab, select Choose folders, clear the folders you don't want on this PC and select OK. Those folders are removed from the computer but stay in OneDrive online. The choice applies to each computer and account separately."
  - q: "What is the difference between Sync and Add shortcut for a SharePoint library?"
    a: "Sync copies the library to the one device where you set it up. A OneDrive shortcut gives access on all your devices and, according to Microsoft, performs better than the Sync button. Microsoft recommends the shortcut when it's available. Use Sync when you need the library on this PC only."
---
To sync OneDrive on Windows, open the OneDrive app, sign in with your Microsoft account or your work or school account, accept the folder location and let the first sync finish. From then on, whatever you add, change or delete in the OneDrive folder in File Explorer happens on the OneDrive website too, and the other way round. This article is for Windows users who set up OneDrive for the first time, or who want to choose what lands on their PC. It covers setup, folder choices, Files On-Demand and syncing a SharePoint library.

## Set up OneDrive sync on a Windows PC

Microsoft's page [Sync your computer's files and folders with OneDrive](https://support.microsoft.com/en-us/onedrive/sync-your-computer-s-files-and-folders-with-onedrive) lists the first-time setup. On Windows 11, [OneDrive](https://www.m365.fm/entity/onedrive/) is already installed. On other versions you download it first.

1. Open OneDrive. Press the Windows key, type OneDrive and open the app.
2. Sign in with your personal Microsoft account or your work or school account.
3. On the **This is your OneDrive folder** screen, accept the default location or select **Change location**. Microsoft recommends making any change of location at this step, so decide now.
4. On the **All your files, ready and on-demand** screen, read how files are marked as online-only, locally available or always available, then select **Next**.
5. Wait for the first sync. A OneDrive cloud icon appears on the taskbar.

After the sync, you can optionally choose which OneDrive folders sync to your PC, back up your Desktop, Documents, Music, Pictures and Videos folders and add another account. You can have multiple work or school accounts, but only one personal OneDrive account.

Your files appear in File Explorer in the OneDrive folder. With more than one account, the personal files are under **OneDrive - Personal** and the work or school files under **OneDrive - [CompanyName]**.

### What syncing really means

Sync is a two-way copy. Microsoft says it plainly: if you add, change or delete a file or folder in your OneDrive folder, the same happens on the OneDrive website, and vice versa. Changes sync automatically while you're online, and synced files stay accessible offline.

That is also the main trap. Deleting a file from the OneDrive folder deletes it online. If you only want to free space on this PC, don't delete. Use **Free up space**, described below.

## Choose which folders sync

By default OneDrive can bring every folder to your PC. If your OneDrive is large, or you only need the project folder, restrict it.

1. Select the OneDrive cloud icon in the notification area.
2. Select the gear icon (Help and Settings), then **Settings**.
3. Open the **Account** tab.
4. Select **Choose folders**.
5. In the dialog, clear the checkbox for each folder you want to keep online only, then select **OK**.

Microsoft's page [Choose which OneDrive folders you want to sync](https://support.microsoft.com/en-us/onedrive/choose-which-onedrive-folders-you-want-to-sync-on-windows-or-macos) says what happens next: the folder is removed from your computer, and the folder and its contents stay in OneDrive online. A few limits matter:

- You can only select folders that are already in your OneDrive. Folders on an external drive, such as a USB drive, can't be synced this way.
- On Windows, you can't clear Documents, Desktop, Pictures or the Personal Vault folder.
- The choices apply to each computer and each account separately. Set them again on your second PC.
- The web and mobile apps always show all your folders.

This is the setting behind [selective sync in OneDrive](https://www.m365.fm/entity/onedrive-selective-sync/). If you cleared a folder and later want it back, open **Choose folders** again and tick it. The folder downloads again.

## Back up Desktop, Documents and Pictures

If you want the usual folders to be in OneDrive, use folder backup. In OneDrive **Settings**, open the **Sync and backup** tab and select **Manage backup**. Turn on the toggle for each folder labeled **Not backed up**, then select **Save changes**. Once files finish syncing, they're available from Documents and Desktop on any device that runs OneDrive.

Microsoft's page "Back up your folders with OneDrive" lists conditions that block it. Check these if the backup fails:

- The full file path, including the file name, must be under 260 characters.
- Files over 250 GB can't sync and must be removed from the folder first.
- File names can't start with a space or contain `\ : / * ? < > " |`.
- Folders with reparse points (junction points or symlinks) can't be protected.

Folder backup is a sensible default for a laptop that might get lost, because the files are then available on any device that runs OneDrive. Keep in mind that everything in those folders is uploaded.

## Use Files On-Demand to save disk space

Files On-Demand lets you see all your files in File Explorer without keeping them all on the disk. Microsoft's page [Save disk space with OneDrive Files On-Demand for Windows](https://support.microsoft.com/en-us/office/sync-files-with-onedrive-files-on-demand-62e8d748-7877-420f-b600-24b56562aa70) lists the requirements: Windows 10 version 1709 or later, or Windows Server 2019. From OneDrive build 23.066 on, it's on by default. To check or turn it on, open **Settings**, go to **Sync and back up**, expand **Advanced settings** and use the **Files On-Demand** toggle.

Right-click a file or folder to choose:

- **Always keep on this device.** The file is downloaded and stays available offline.
- **Free up space.** The file becomes online-only again and no longer uses local storage.

The status icons tell you which state a file is in. A blue cloud means online-only: it takes no local space and needs an internet connection to open. A green check means it's locally available. A green circle with a white check mark means it's always available, uses space and stays available offline.

Three notes from the same page that save trouble:

- New cloud files appear as online-only. New files in a folder marked **Always keep on this device** download automatically.
- Desktop search finds online-only files by name but can't search their contents.
- Moving an online-only file outside the OneDrive folder downloads it to the new location and removes it from OneDrive. Copy instead of move if you want a local duplicate.

Deleting an online-only file deletes it from OneDrive everywhere. You can restore deleted items from the OneDrive recycle bin for up to 30 days (personal accounts) or 93 days (work or school accounts).

Before a flight or a train ride, mark the folders you need as **Always keep on this device**, and open one file from each to check it opens offline.

## Sync a SharePoint library

For work files in a SharePoint site, there are two ways. Microsoft's page [Sync SharePoint files and folders](https://support.microsoft.com/en-us/onedrive/sync/sharepoint-training/sync-sharepoint-files-and-folders) describes the Sync button:

1. In your browser, open the SharePoint site and go to the library.
2. Select the ellipsis (...) and choose **Sync**.
3. If the browser asks for permission to use OneDrive, approve it.
4. Sign in to OneDrive and complete the setup.

The library appears in File Explorer under your organization's name, each library in its own subfolder. The alternative is a shortcut to the library in your OneDrive. Microsoft says shortcuts give access on all your devices, while sync applies only to the device where you set it up, that shortcuts perform better than the Sync button and that Microsoft recommends them when available. The page doesn't include shortcut steps. It points to a separate article called "Add shortcuts to shared folders in OneDrive for work or school".

If a library is big, sync only the folders you work in, or use the web. The SharePoint site stays the source for everyone else.

## Common mistakes

- **Choosing a folder location later.** Microsoft recommends making any location change during first-time setup, so decide on the screen where it asks.
- **Deleting to free space.** Delete in the OneDrive folder removes the file online. Use **Free up space**.
- **Expecting selective sync to be global.** The choice is per computer and per account.
- **Syncing a USB drive.** Folders on external drives can't be synced this way.
- **Syncing a whole SharePoint library for one document.** Open it in the browser or sync a shortcut to the folder.
- **Forgetting that Desktop search can't read online-only files.** It finds names, not contents.

## Related topics to explore

- **Syncing stuck or paused.** If the icon shows a problem, read how to troubleshoot OneDrive that isn't syncing and check pause, sign-in and open files.
- **Resetting OneDrive.** Microsoft's reset page explains how to restart the sync from scratch without losing files. Selective sync choices must be made again afterward.
- **Stopping sync.** Pausing for 2, 8 or 24 hours, quitting OneDrive and unlinking a PC are separate options, each with a different effect.
- **Adding a second account.** You can sign in with multiple work or school accounts and one personal account.
- **Moving to a new PC.** Microsoft has a page for moving files to a new Windows PC using OneDrive.

## Next step

Open OneDrive **Settings**, check **Choose folders** and clear one large folder you don't need on this PC. Then right-click a project folder and choose **Always keep on this device**. That shows you in two minutes how to sync OneDrive the way you actually work.
