---
title: "How to Sync Teams and SharePoint Files to File Explorer (Sync or OneDrive Shortcut)"
summary: "Step-by-step: sync a Teams or SharePoint library to File Explorer with the Sync button, choose folders or stop syncing, and learn when a OneDrive shortcut is the better option. Includes limits and admin controls."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [onedrive, sharepoint, teams]
keypoints:
  - "Open the site from the Microsoft 365 app launcher, go to Documents or a subfolder and select Sync. This is needed once per computer."
  - "Synced files appear in a folder named after your organization, which is added to the File Explorer left pane. You can't choose a different location."
  - "Microsoft recommends OneDrive shortcuts as the more versatile option. They work across devices and perform better than the Sync button."
  - "To stop syncing, open OneDrive settings, go to the Account tab and select Stop sync next to the site. Local copies stay until you delete them."
  - "Admins can hide the Sync button with Set-SPOTenant -HideSyncButtonOnTeamSite $true. Existing syncs continue."
faq:
  - q: "How do I sync Teams files to File Explorer?"
    a: "Microsoft Support starts from the Microsoft 365 app launcher. Choose SharePoint or Teams, select the site, open Documents or the subfolder you want, and select Sync. Approve the Microsoft OneDrive prompt if the browser asks. The library then appears in File Explorer."
  - q: "Where do the synced files appear?"
    a: "Microsoft Support says files sync to a folder named after your organization, for example %userprofile%\\Contoso, and that folder is added to the File Explorer left pane. You can't choose a different sync location."
  - q: "What is the difference between Sync and a OneDrive shortcut?"
    a: "Microsoft Learn says both let you reach files in File Explorer or Finder, but shortcuts let you access content on all devices, while sync is tied to one device. Microsoft adds that shortcuts perform better and recommends them as the more versatile option."
  - q: "How do I stop syncing a library?"
    a: "Per Microsoft Support, select the OneDrive cloud icon, then Help and Settings and Settings. On the Account tab, select Stop sync next to the site. Local copies remain and can be deleted manually."
  - q: "Why is the Sync button missing?"
    a: "An admin can remove it. Microsoft Learn says Set-SPOTenant -HideSyncButtonOnTeamSite $true blocks new syncs from starting but doesn't affect existing syncs. Other reasons are not described on the pages I read."
---

To sync Teams files to File Explorer, open the team's site in SharePoint or Teams from the Microsoft 365 app launcher, go to Documents, and select **Sync**. The OneDrive sync app then adds a folder named after your organization to File Explorer. Microsoft also recommends a second route, OneDrive shortcuts, which work on all your devices.

A note on sources: the Microsoft pages I read start from the site in a browser and don't describe the **Open in SharePoint** button in the Teams Files tab, or the steps to add a OneDrive shortcut. I describe those only where Microsoft does.

## Before you start

Microsoft Support lists these requirements:

- A Microsoft 365 work or school subscription, or SharePoint Server 2019 with Teams.
- Permission to use the new OneDrive sync app. Admins have separate guidance for enabling it.

Microsoft Learn adds that Windows 10 devices come with the OneDrive sync app installed, and that Office 2016 and later installations also have it.

## Sync a Teams or SharePoint library

1. Open the Microsoft 365 app launcher near the upper left of the browser page.
2. Choose **SharePoint** or **Teams**, then select the site with the files.
3. Select **Documents**, or open the subfolder you want to sync.
4. Select **Sync**. You need to do this once per computer.
5. If the browser asks to allow Microsoft OneDrive, approve it.

If a screen asks **Which library do you want to sync?**, Microsoft says the site isn't set up for the new sync app and an IT admin must enable it.

## What you get in File Explorer

- Files sync to a folder named after your organization, for example `%userprofile%\Contoso`.
- That folder is added to the File Explorer left pane.
- You can't choose a different sync location.
- A lock icon on a synced file means it is read-only, and changes to it won't sync.

Microsoft Learn explains that changes you make on the site apply to your computer and the other way around. You can copy or move files into the folder in File Explorer to upload them, and create folders, move and rename files there. All of these changes sync automatically.

## Sync or OneDrive shortcut: which one?

Microsoft Learn gives two options for libraries and Teams files: add shortcuts to libraries and folders in your OneDrive, or use the Sync button in the document library.

| | Sync button | OneDrive shortcut |
|---|---|---|
| Access in File Explorer or Finder | Yes | Yes |
| Available on | One specific device | All devices |
| Performance | Baseline | Improved, per Microsoft |
| Microsoft's recommendation | Works | Recommended as more versatile |

Choose Sync if the folder should be on one computer only. Choose a shortcut if you move between devices. The pages I read don't list the exact shortcut steps, so use the **Add shortcut to OneDrive** option where your library offers it, and check Microsoft's dedicated shortcut article.

## Choose folders or stop syncing

1. Select the OneDrive cloud icon in the notification area. Use **Show hidden icons** if needed. If it's missing, start OneDrive from the Start menu.
2. Select the **Help and Settings** gear, then **Settings**.
3. Open the **Account** tab to see the syncing sites.
4. To change folders, select **Choose folders** for the library. To stop, select **Stop sync** next to the site.

Local copies remain after you stop sync. Delete them manually if you don't want them.

## Tips for teams that sync many libraries

- Sync only the subfolder you actually need. Microsoft's steps allow you to open a subfolder under **Documents** and select **Sync** there, and **Choose folders** lets you narrow a library later.
- Keep the files you edit often in a library you sync, and use links for files you only read.
- Tell colleagues that deleting a file in File Explorer applies to the site as well, because Microsoft Learn says changes sync in both directions.
- If you work on several computers, prefer a OneDrive shortcut, because Microsoft says sync is tied to one specific device.

## Known limits and gotchas

From Microsoft Support:

- Sites with characters that Windows doesn't allow in folder names, such as ":", can't sync.
- Moving Office files between sites on your computer loses version history. Use the site's **Move to** or **Copy to** command instead.
- OneNote notebooks can't be moved between sites on your computer.
- For files protected with Information Rights Management, stop syncing with the previous sync app, install the Rights Management Service client, then select **Sync** again.
- If you moved from the previous sync app, the folder structure may change.
- The old OneDrive for Business sync app is no longer supported.

Microsoft Learn also points to a separate article on invalid file names and file types in OneDrive and SharePoint. The pages I read give no file count, size or path-length limits.

## For admins: hide the Sync button

You can remove the Sync button from all SharePoint libraries in your organization:

1. Install the latest SharePoint Online Management Shell. Uninstall an older version first.
2. Connect as a SharePoint Administrator or higher.
3. Run `Set-SPOTenant -HideSyncButtonOnTeamSite $true`.

Microsoft says this blocks new syncs but doesn't affect existing ones.

## Troubleshooting

If files don't sync after setup, Microsoft's pages link to the article **Fix OneDrive sync problems** and give no further steps. Start there.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive shortcuts](https://www.m365.fm/entity/onedrive-shortcuts/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Sync SharePoint and Teams files with your computer, Microsoft Support](https://support.microsoft.com/office/6de9ede8-5b6e-4503-80b2-6190f3354a88)
- [Sync in SharePoint and OneDrive, Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/sharepoint-sync)
