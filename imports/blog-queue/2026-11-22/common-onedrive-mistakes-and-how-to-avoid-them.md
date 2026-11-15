---
title: "Common OneDrive Mistakes and How to Avoid Them"
summary: "The OneDrive mistakes that Microsoft documentation addresses: long paths, invalid file names, syncing too much, disabling Files On-Demand, skipping Known Folder Move planning and misjudging the recycle bin."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [onedrive, onedrive-files-on-demand, sharepoint]
keypoints:
  - "Paths over the limits cause sync errors. Microsoft lists 260 characters for File Explorer and desktop Office, 400 for the cloud and 520 for sync."
  - "Names can't contain \" * : < > ? / \\ | or reserved names such as CON, PRN or desktop.ini, and files starting with ~$ are blocked."
  - "Keep Files On-Demand on and prefer shortcuts to shared folders over syncing whole libraries."
  - "Known Folder Move needs a plan: existing Folder Redirection policies or another organization's OneDrive must be handled first."
  - "Deleted items are recoverable from the recycle bin for 30 days on personal accounts and 93 days on work or school accounts, unless an admin changed it."
faq:
  - q: "What is the maximum path length in OneDrive?"
    a: "Microsoft Support lists several limits. File Explorer and Office desktop apps allow 260 characters, OneDrive and SharePoint in the cloud allow 400 characters, and OneDrive sync allows 520 characters, made of the local path of up to 400 plus a root folder of up to 120. The article says enabling the Windows long path policy does not help File Explorer or Office desktop apps."
  - q: "Which characters are not allowed in OneDrive file names?"
    a: "Microsoft Support says file and folder names can't contain \" * : < > ? / \\ or |, and can't have leading or trailing spaces. Reserved names include .lock, CON, PRN, AUX, NUL, COM0 to COM9, LPT0 to LPT9, _vti_ and desktop.ini. Any name starting with ~$ is also blocked. The page adds that some organizations don't yet support # and %."
  - q: "How long can I restore deleted OneDrive files?"
    a: "According to Microsoft Support, personal accounts can restore items deleted within the last 30 days. Work or school accounts can restore items deleted within the last 93 days unless the administrator changed the retention setting. Items permanently deleted from the recycle bin can't be restored."
  - q: "Should I sync entire SharePoint libraries to my PC?"
    a: "Microsoft's recommended sync configuration prefers shortcuts to shared folders. Learn says shortcuts sync only the specific folder, not the whole library, and are available across devices. Admins can also hide the Sync button on team sites with Set-SPOTenant -HideSyncButtonOnTeamSite $true."
---

Most OneDrive trouble comes from a handful of repeatable mistakes: paths that are too long, file names that the service rejects, syncing far more than needed, turning off defaults that protect disk space, and rolling out folder backup without a plan. Microsoft documents limits and recommendations for each. This list follows those pages and says where they stop.

## Mistake 1: Long folder paths

Microsoft Support lists these limits:

| Where | Limit |
|---|---|
| Windows File Explorer and Office desktop apps | 260 characters |
| OneDrive and SharePoint in the cloud, and Office for the web | 400 characters |
| OneDrive sync (local path up to 400 plus root folder up to 120) | 520 characters |
| macOS Finder / macOS Office apps | 1,024 characters / 1,024 UTF-8 bytes |
| One file or folder name in File Explorer or Finder | 255 characters |

The full path counts every character, including the sync folder name such as `OneDrive - Organization Name`. A file can be fine in the browser and fail on the PC. Office also creates temporary lock files by adding characters, so a path near 260 can fail on save.

**Avoid it:** shorten names, reduce nesting, rename on the OneDrive website and let it sync, or move files closer to the root. If a path is too long to handle in File Explorer, Microsoft says to rename or move the item on the OneDrive or SharePoint website, and it syncs normally once the path is short enough. The article says the Windows long path policy does not help File Explorer or Office desktop apps. The error "The action can't be completed" can indicate a too-long path.

## Mistake 2: Names and file types that don't sync

Microsoft Support says names can't contain `" * : < > ? / \ |` and can't start or end with a space. Reserved names include `.lock`, `CON`, `PRN`, `AUX`, `NUL`, `COM0` to `COM9`, `LPT0` to `LPT9`, `_vti_` and `desktop.ini`. Names starting with `~$` are blocked. Temporary TMP files don't sync, and admins can block file types. Outlook PST files are supported but sync less often.

**Avoid it:** rename before you move files in.

## Mistake 3: Syncing too much

Microsoft's guidance is to keep total cloud storage under 300,000 items for good performance, even if you don't sync all of it. A public preview allows up to 1,000,000 items per sync instance on Windows and macOS with specific hardware and software, excluding VDI. The website copy function handles up to 2,500 files at once. Upload and download are capped at 250 GB per file.

**Avoid it:** do not use Sync on every library. Learn recommends shortcuts to shared folders because they sync only that folder. Admins can hide the Sync button on team sites with `Set-SPOTenant -HideSyncButtonOnTeamSite $true`.

## Mistake 4: Turning off Files On-Demand

Learn's recommended configuration says to keep Files On-Demand enabled. It lets users reach all files without downloading them or using local storage, and it is on by default on Windows 10 and Mac. Learn also recommends Storage Sense policies on PCs, which clean up locally available files that users have not pinned as always available.

**Avoid it:** leave the defaults unless there is a documented reason.

## Mistake 5: Rolling out Known Folder Move without a plan

Known Folder Move redirects Desktop, Documents and Pictures to OneDrive. Learn also lists Screenshots and Camera Roll as folders that can be moved. Pitfalls Learn names:

- **Folder Redirection by Group Policy.** Disable the Windows policy first, leave the content where it is, then enable Known Folder Move.
- **Another organization's OneDrive.** Redirecting creates new, empty folders. Users must migrate files manually, so disable the other redirect first if possible.
- **Rollout speed.** The silent policy on existing devices is limited to 1,000 devices a day and 4,000 a week. The prompt policy is limited to 5,000 a day and 20,000 a week. Large organizations should roll out slowly and may temporarily limit the sync upload rate.
- **Music and Videos.** They are not affected by the OneDrive policies.

**Avoid it:** pair the silent policy with the prompt policy so users can fix errors, as Learn recommends.

## Mistake 6: Not knowing what recovery covers

Microsoft Support says personal accounts can restore items deleted within the last 30 days. Work or school accounts can restore items deleted within 93 days unless the administrator changed it. Permanently deleted items can't be restored. Microsoft 365 subscribers can also restore the entire OneDrive to any point in the last 30 days.

**Avoid it:** use the **Recycle bin** on the OneDrive website and do not wait, because the retention windows above are fixed unless your admin changed them.

## Mistake 7 (admins): Leaving the sync app half configured

Learn's recommended configuration includes allowing access to `oneclient.sfx.ms` and `g.live.com` for updates, keeping Production and Insiders rings separate, silently configuring accounts, starting OneDrive at Windows sign-in, keeping offline mode and Office co-authoring enabled and turning on sync health reporting. Learn notes co-authoring and in-app sharing have been enabled by default for all tenants as of May 2025.

## Limits of the sources

The Microsoft Support page on Files On-Demand status icons could not be retrieved. The Known Folder Move page read does not state file size limits or how to move folders back. Check those details in the sync app help before a large rollout.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/)
- [OneDrive shortcuts](https://www.m365.fm/entity/onedrive-shortcuts/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Support: What are the file path length limits?](https://support.microsoft.com/en-us/onedrive/what-are-file-path-length-limits)
- [Microsoft Support: Restrictions and limitations in OneDrive and SharePoint](https://support.microsoft.com/en-US/onedrive/restrictions-and-limitations-in-onedrive-and-sharepoint)
- [Microsoft Learn: Recommended sync app configuration](https://learn.microsoft.com/sharepoint/ideal-state-configuration)
- [Microsoft Learn: Redirect and move Windows known folders to OneDrive](https://learn.microsoft.com/sharepoint/redirect-known-folders)
- [Microsoft Support: Restore deleted files or folders in OneDrive](https://support.microsoft.com/en-us/office/restore-deleted-files-or-folders-in-onedrive-949ada80-0026-4db3-a953-c99083e6a84f)
