---
title: "OneDrive Known Folder Move Errors: Folders Blocked or Stuck in Redirect"
summary: "Troubleshoot OneDrive Known Folder Move that is blocked or stuck: existing folder redirection, another organization, rollout limits, long paths, large files, junctions, open files and the Outlook PST case."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [onedrive]
keypoints:
  - "Known Folder Move policies do not work if Documents, Pictures or Desktop are redirected with Windows Folder Redirection group policy. Remove that redirect first and leave the content in place."
  - "If folders were redirected to another organization, redirecting to your tenant creates new, empty folders, so disable the old redirect first if possible."
  - "Stay within Learn's rollout limits for the prompt and silent policies, for example 1,000 existing devices per day for the silent policy."
  - "Per Microsoft Support, paths must be under 260 characters, files over 250 GB cannot sync, and junctions, symlinks and open files block protection."
  - "Remove an Outlook PST file from OneDrive if the status stays at Processing changes while Outlook is open."
faq:
  - q: "Why does Known Folder Move not start on some PCs?"
    a: "Microsoft Learn says the policies do not work if Documents, Pictures or Desktop are redirected with Windows Folder Redirection group policy objects. Remove those policies and leave the content in place, then enable Known Folder Move."
  - q: "What if users already redirected folders to another organization's OneDrive?"
    a: "Learn says redirecting to your tenant creates new, empty Documents, Pictures or Desktop folders, so the user sees an empty desktop and must migrate files manually. Disable the redirect to the other organization first if possible."
  - q: "Are there rollout limits?"
    a: "Yes. For the prompt policy Learn says use it for existing devices only, up to 5,000 devices per day and 20,000 per week across macOS and Windows. For the silent policy on existing devices the limits are 1,000 per day and 4,000 per week."
  - q: "What errors does Microsoft Support list for folder protection?"
    a: "Support lists causes such as file paths of 260 characters or more, files over 250 GB, file names with unsupported characters, nested important folders in non-default locations, reparse points such as junctions or symlinks, open files, and an Outlook PST file held open."
  - q: "Does Known Folder Move cover Music and Videos?"
    a: "No. Learn says Music and Videos are unaffected, so they can stay redirected through Windows group policy. The scope is Desktop, Documents, Pictures, Screenshots and Camera Roll."
---

Known Folder Move redirects Desktop, Documents and Pictures to OneDrive. When it is blocked or stuck, the cause is usually an older redirect, a rollout limit or a specific file problem. This guide combines Microsoft Learn's Known Folder Move page and Microsoft Support's folder protection troubleshooting. For setting it up with Intune, see the separate configuration guide on this site.

## Scope and baseline

Learn lists these folders in scope: Desktop, Documents, Pictures, Screenshots and Camera Roll. Policies can be set with Group Policy, Intune Windows 10 administrative templates or registry settings. Learn says to upgrade to the latest available OneDrive sync app build before deployment and gives no specific minimum version. Known Folder Move does not work for users syncing OneDrive files in SharePoint Server.

## Blocked by an existing redirect

### Windows Folder Redirection

Learn says the Known Folder Move policies don't work if Documents, Pictures or Desktop are redirected with Windows Folder Redirection group policy. Extending the scope of folders synced by OneDrive through Windows Folder Redirection isn't supported. Learn's steps:

1. Remove the conflicting Folder Redirection policies and leave the content in place.
2. If the folders were redirected to OneDrive, keep the folder and contents in OneDrive.
3. If they were redirected to a local PC, keep the content at the redirected location. Known Folder Move then moves it to OneDrive.
4. If they were redirected to a network file share, use Migration Manager to copy the share contents into the user's OneDrive folders. Do not select **Preserve file share permissions** if Migration Manager creates the folders. Keep the share contents in place, then enable Known Folder Move.

### Folders redirected to another organization

Redirecting to your tenant creates new, empty Documents, Pictures or Desktop folders. Users see an empty desktop and have to migrate files themselves. Disable the redirect to the other organization first, if possible.

## Stuck because of rollout volume

Learn gives limits for staged rollout:

| Policy | Scope | Limit |
| --- | --- | --- |
| Prompt users to move Windows known folders to OneDrive | Existing devices | 5,000 per day, 20,000 per week across macOS and Windows |
| Silently move Windows known folders to OneDrive | Existing devices | 1,000 per day, 4,000 per week across macOS and Windows |

New devices can be included with the silent policy. For large file sets, temporarily enable **Limit the sync app upload rate to a percentage of throughput**, then disable it after uploads finish. Users see reminder notifications, and if a move fails a dismissable error appears. When the silent policy fails, users are prompted to fix the error and continue.

## Problems tied to specific files and folders

Microsoft Support's folder protection page lists these causes:

- **Path too long.** The whole path including the file name must be under 260 characters in Windows.
- **File too large.** OneDrive can't sync files over 250 GB.
- **File name not allowed.** Names can't start with a space or contain `\ : / * ? < > " |`.
- **Folder not selected for syncing.** Open OneDrive settings, select **Choose Folders** and select it. For Pictures, make sure Pictures, Screenshots and Camera Roll are all selected, or do not exist.
- **Important folder in a non-default location.** A nested Documents, Desktop, Pictures, Screenshots, Camera Roll or OneDrive folder must be moved first.
- **Reparse points.** Junctions and symlinks can't be protected. Remove the link only if you know it is safe, because some applications depend on it.
- **Open files.** Save and close the file, then try again.
- **Cloud-only files.** You may be told to set files to **Always keep on this device** first.
- **Error code 0x80070005.** Files may have moved into identically named folders in OneDrive. Move them back, and ask whether the policy **Prohibit User from manually redirecting Profile Folders** can be changed.
- **Outlook PST files.** If OneDrive shows Processing changes while Outlook is open, remove the PST data file from OneDrive.
- **macOS.** Use the standalone sync app, not the Mac App Store version, and give OneDrive Full Disk Access. Work or school admins may have disabled this.

The page also notes that folders connected to a domain can't be protected in a personal account signed in with a Microsoft account.

## Admin troubleshooting order

1. Confirm the sync app is current.
2. Check for Windows Folder Redirection policies and for redirects to another organization.
3. Look at rollout size against the daily limits.
4. Check one affected device for long paths, large files, junctions, PST files and open files.
5. Review the user's error notification text and match it against the list above.

## Not covered

The pages I read do not give a way to view Known Folder Move errors centrally, and they do not list a minimum sync client version. A page on OneDrive sync health in the Microsoft 365 Apps admin center describes monitoring Known Folder Move rollout, but I did not read its steps, so verify them before relying on it.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Redirect and move Windows known folders to OneDrive](https://learn.microsoft.com/sharepoint/redirect-known-folders)
- [Back up your folders with OneDrive (Microsoft Support)](https://support.microsoft.com/office/back-up-your-folders-with-onedrive-d61a7930-a6fb-4b95-b28a-6552e77c3057)
