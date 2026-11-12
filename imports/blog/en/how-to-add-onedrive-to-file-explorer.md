---
title: "How to Add OneDrive to File Explorer (and Fix It When Missing)"
summary: "How to add OneDrive to File Explorer: start the app, sign in, show the navigation pane, pin the folder and fix a missing OneDrive entry, step by step."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [onedrive, onedrive-files-on-demand, onedrive-selective-sync]
keypoints:
  - "OneDrive shows up in File Explorer once the OneDrive app is running and you're signed in. Press the Windows key, type OneDrive and open the app."
  - "If the cloud icon is missing from the taskbar, check the Show hidden icons arrow before you reinstall anything."
  - "Turn the left pane back on with View, Show, Navigation Pane. Pin the OneDrive folder to Quick access (File Explorer Home) for one-click access."
  - "A OneDrive folder you hid in its Properties stays hidden, and an admin policy can remove OneDrive from the navigation pane."
  - "With Files On-Demand, files appear in File Explorer without using disk space until you open them or choose Always keep on this device."
faq:
  - q: "Why is OneDrive missing from File Explorer?"
    a: "Usually the OneDrive app isn't running or you're not signed in. Press the Windows key, type OneDrive and open the app. Also check the Show hidden icons arrow in the taskbar, the Navigation Pane setting under View, and whether the OneDrive folder was hidden in its Properties. On a work PC, an admin policy can remove it."
  - q: "How do I pin OneDrive to Quick access in File Explorer?"
    a: "Open File Explorer, right-click the OneDrive folder and select Pin to Quick access. Microsoft says Quick access is called Home from Windows 11, version 22H2. To remove the pin later, right-click the folder and select Unpin from Quick access. The folder itself is not affected."
  - q: "How do I get OneDrive back after I uninstalled it?"
    a: "Open Start, search for Programs, check whether Microsoft OneDrive is still listed and reinstall it from the Microsoft OneDrive download page, then sign in. Microsoft says uninstalling doesn't delete your data and your files remain at OneDrive.com. If you synced only some folders before, choose them again."
---
To add OneDrive to File Explorer, start the OneDrive app (press the Windows key, type OneDrive and open it) and sign in with your Microsoft account or your work or school account. The OneDrive folder then shows up in File Explorer, and files you add there sync with the cloud. If the entry is already supposed to be there and isn't, the cause is usually one of five things: the app isn't running, the navigation pane is off, the folder is hidden, OneDrive is uninstalled or a policy removed it. This article is for Windows users who lost the OneDrive entry in File Explorer and for help desk staff who need a short, ordered check.

## Start OneDrive and sign in

The OneDrive entry in File Explorer comes from the sync app. If the app isn't running, there is nothing to show. Microsoft's page [I can't see any OneDrive icons](https://support.microsoft.com/en-us/office/i-can-t-see-any-onedrive-icons-a377ac56-f885-4854-9763-d6bcdceafcf1) names two causes: the icon moved into the hidden icons area of the taskbar, or OneDrive isn't running.

1. Look for the white or blue [OneDrive](https://www.m365.fm/entity/onedrive/) cloud icon at the far right of the taskbar.
2. If you don't see it, select the **Show hidden icons** arrow next to the notification area.
3. If it still isn't there, OneDrive may not be running. Select **Start**, type OneDrive in the search box and select **OneDrive** in the results.
4. For the latest features and fixes, download and install the latest OneDrive app.

If this is a new setup, the app walks you through it. Sign in with your personal Microsoft account or your work or school account. On the **This is your OneDrive folder** screen, accept the default location or select **Change location**. Microsoft recommends making that change at this step. After the first sync, your files appear in File Explorer in the OneDrive folder. With more than one account, personal files are under **OneDrive - Personal** and work or school files under **OneDrive - [CompanyName]**.

Microsoft's setup page also says that on Windows 11 the OneDrive app is already installed. On a clean Windows 11 PC, starting it is all you have to do.

## Show the navigation pane

If OneDrive is running but you see no left pane at all, the navigation pane is turned off. Microsoft documents the way back:

1. Open File Explorer from Start or the taskbar. The shortcut is the Windows logo key + E.
2. Select **View** on the command bar.
3. Select **Show**, then select **Navigation Pane**.

The left pane lists your OneDrive folders next to Home, Desktop and the other places. If you can't find the folder after that, scroll the pane, because with several accounts you get one entry for each.

## Pin the OneDrive folder for one-click access

Pinning isn't the same as adding, but it solves the usual complaint: "I never find OneDrive when I open File Explorer." Microsoft's page [File Explorer in Windows](https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows) describes it. Starting with Windows 11, version 22H2, Quick access is renamed **Home**. To pin a folder, right-click it and select **Pin to Quick access**. To unpin it, right-click and select **Unpin from Quick access**.

A pinned entry is a shortcut. It doesn't move your files. If you pin a subfolder of OneDrive, such as the project folder you use every day, you skip two clicks every morning.

### Unhide a hidden OneDrive folder

If you followed Microsoft's steps to hide OneDrive when you tried to get rid of it, the folder is still hidden. In File Explorer, enable **Show hidden items** on the **View** menu, right-click the **OneDrive** folder, select **Properties** and clear **Hidden** on the **General** tab. Microsoft documents the check box for hiding the folder; clearing it is the logical reverse. Hiding also required unlinking and quitting OneDrive, so after you unhide it, start the app and sign in again.

## Reinstall OneDrive if it's gone

If you uninstalled OneDrive, or Start can't find it, reinstall it. Microsoft's page [Reinstall OneDrive](https://support.microsoft.com/en-us/onedrive/reinstall-onedrive) lists the steps:

1. Open the Start menu, search for "Programs" and open **Add or remove programs**.
2. Check whether **Microsoft OneDrive** is in the list. If it's there, uninstall it first and confirm if asked for an administrator password.
3. Download OneDrive from the Microsoft OneDrive download page.
4. Run the downloaded file and follow the prompts to sign in.

Uninstalling doesn't delete your data, and your files stay at OneDrive.com. Microsoft notes that some versions of Windows 10 and 11 include the OneDrive app already. It also warns that you may see two OneDrive apps: the Microsoft Store version lets you view files but doesn't back up or sync them. If you previously synced only selected folders, you need to choose them again after the sync finishes. Work or school OneDrive folders must be set up again.

## Why files look empty or "cloud only"

Once OneDrive appears, you might see files with a cloud icon and wonder where they are. That's Files On-Demand. Microsoft's page [Save disk space with OneDrive Files On-Demand for Windows](https://support.microsoft.com/en-us/office/sync-files-with-onedrive-files-on-demand-62e8d748-7877-420f-b600-24b56562aa70) explains the icons:

- **Blue cloud.** The file is online-only. It takes no local space and needs an internet connection to open.
- **Green check.** The file is locally available, which means it's downloaded and can be opened offline.
- **Green circle with a white check mark.** The file is always available, uses space and stays available offline.

Right-click a file or folder and choose **Always keep on this device** to download it, or **Free up space** to make it online-only again. With [Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/) you see all your files in File Explorer without downloading them all. The setting is under **Settings**, **Sync and back up**, **Advanced settings**. From OneDrive build 23.066 on, it's on by default.

## Add a second account or a SharePoint library

"Add OneDrive to File Explorer" sometimes means "add my work files". Two cases:

- **A second account.** In OneDrive **Settings**, you can add another account after the first sync. Microsoft says you can have multiple work or school accounts but only one personal OneDrive account. Each shows up under its own name in File Explorer.
- **A SharePoint library.** Open the SharePoint site in your browser, go to the library, select the ellipsis (...) and choose **Sync**. Approve the browser prompt to use OneDrive and sign in. The library then appears in File Explorer under your organization's name, each library in its own subfolder. Microsoft's page "Sync SharePoint files and folders" recommends a OneDrive shortcut when it's available, because a shortcut gives access on all your devices and performs better than the Sync button.

If the library you need is huge, don't sync it all. Choose only the folders you work in, or open the rest in the browser.

## When an admin policy removes OneDrive

On a managed PC, OneDrive may be missing on purpose. The Windows policy **Prevent the usage of OneDrive for file storage** (MDM setting `System/DisableOneDriveFileSync`) has these effects, according to Microsoft's documentation: users can't access OneDrive from the OneDrive app and the file picker, OneDrive doesn't appear in the navigation pane in File Explorer, files aren't kept in sync with the cloud and the camera roll upload stops. If your PC belongs to your employer and OneDrive never showed up, ask the help desk before you try to "fix" it. A policy wins over every setting on your side.

## Common mistakes

- **Reinstalling first.** Check the hidden icons arrow and Start before you uninstall anything.
- **Confusing the Store app with the sync app.** The Store version shows files but doesn't sync.
- **Searching only This PC.** Starting with Windows 11, version 22H2, Microsoft calls Quick access Home and recommends it as your landing page. The OneDrive entry is in the left pane.
- **Moving files out of the OneDrive folder to "pin" them.** Moving an online-only file out of the folder downloads it and removes it from OneDrive. Pin the folder instead.
- **Forgetting the second account.** A work account and a personal account have separate entries.
- **Ignoring a policy.** On a company PC, the setting can be managed by your admin.

## Related topics to explore

- **Seeing only some folders.** [Selective sync](https://www.m365.fm/entity/onedrive-selective-sync/) decides which folders are on this PC. Microsoft's page on choosing folders lists the limits.
- **Resetting OneDrive.** If the app runs but nothing appears, a reset restarts the sync from scratch. It doesn't delete your files.
- **Adding a SharePoint library.** You can sync a library from the browser with the **Sync** button or add a shortcut to your OneDrive, which Microsoft recommends when available.
- **Moving the OneDrive folder.** Microsoft says you unlink OneDrive, move the folder and link again.
- **Turning OneDrive off.** If you came here because you want less of it in File Explorer, read the options to disable, hide or uninstall it.

## Next step

Start OneDrive from the Start menu, sign in and open File Explorer. If the left pane is missing, turn it on under **View**, **Show**, **Navigation Pane**. To add OneDrive to File Explorer in a way you will actually use, right-click the folder you open most and choose **Pin to Quick access**.
