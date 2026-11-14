---
title: "OneDrive Known Folder Move Errors: Folders Blocked or Stuck in Redirect"
summary: "Troubleshoot OneDrive Known Folder Move that is blocked or stuck: existing folder redirection, another organization, rollout limits, long paths, large files, junctions, open files and the Outlook PST case."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [onedrive]
keypoints:
  - "Known Folder Move policies do not work if Windows Folder Redirection sent Documents, Pictures or Desktop somewhere other than OneDrive. Disable that redirect first and leave the content."
  - "If folders were redirected to another organization, redirecting to your tenant creates new, empty folders, so disable the old redirect first if possible."
  - "Stay within Learn's rollout limits for the prompt and silent policies, for example 1,000 existing devices per day for the silent policy."
  - "Per Microsoft Support, paths must be under 260 characters, files over 250 GB cannot sync, and junctions, symlinks and open files block protection."
  - "Remove an Outlook PST file from OneDrive if the status stays at Processing changes while Outlook is open."
faq:
  - q: "Why does Known Folder Move not start on some PCs?"
    a: "Microsoft Learn says the Known Folder Move policies do not work if you previously used Windows Folder Redirection group policy objects to redirect Documents, Pictures or Desktop to a location other than OneDrive. Disable the redirection policy, leave the content where it is (for a network share, copy it into OneDrive with Migration Manager first), then enable Known Folder Move."
  - q: "What if users already redirected folders to another organization's OneDrive?"
    a: "Learn says redirecting to your organization's OneDrive creates new Documents, Pictures or Desktop folders, so the user sees an empty desktop and has to migrate files manually from the other organization's OneDrive. Disable the redirect to the other organization first if possible."
  - q: "Are there rollout limits?"
    a: "Yes. For the prompt policy Learn says use it for existing devices only, up to 5,000 devices per day and 20,000 per week across macOS and Windows. For the silent policy on existing devices the limits are 1,000 per day and 4,000 per week."
  - q: "What errors does Microsoft Support list for folder protection?"
    a: "Support lists causes such as file paths of 260 characters or more, files over 250 GB, file names with unsupported characters, a folder that contains another important folder, reparse points such as junctions or symlinks, open files, and an Outlook PST file in the folder while the status stays at Processing changes."
  - q: "Does Known Folder Move cover Music and Videos?"
    a: "No. Learn says Music and Videos are unaffected, so they can stay redirected through Windows group policy. The scope is Desktop, Documents, Pictures, Screenshots and Camera Roll."
---

Known Folder Move redirects Desktop, Documents and Pictures to OneDrive. When it is blocked or stuck, the cause is usually an older redirect, a rollout limit or a specific file problem. This guide combines Microsoft Learn's Known Folder Move page and Microsoft Support's folder protection troubleshooting. 

## Scope and baseline

Learn lists these folders in scope: Desktop, Documents, Pictures, Screenshots and Camera Roll. Policies can be set with Group Policy, Intune Windows 10 administrative templates or registry settings. Learn says to upgrade to the latest available OneDrive sync app build before deployment and gives no specific minimum version. Known Folder Move does not work for users syncing OneDrive files in SharePoint Server.

## Blocked by an existing redirect

### Windows Folder Redirection

Learn says the Known Folder Move policies don't work if you previously used Windows Folder Redirection group policy objects to redirect Documents, Pictures or Desktop to a location other than OneDrive. It also says extending the scope of folders synced by OneDrive with Windows Folder Redirection Group Policy isn't supported. Learn gives these steps, depending on where the folders point:

1. Redirected to OneDrive: disable the Windows Folder Redirection policy, leave the folders and contents in OneDrive, then enable the Known Folder Move policy. The folders remain in OneDrive.
2. Redirected to a local PC: disable the Windows Folder Redirection policy, leave the contents at the redirected location, then enable Known Folder Move. The folders move to OneDrive.
3. Redirected to a network file share: first use Migration Manager to copy the share contents into the existing Documents, Pictures or Desktop folders in the user's OneDrive. If Migration Manager creates those folders, do not select **Preserve file share permissions**. Then disable the Windows Folder Redirection policy, leave the content on the share, and enable Known Folder Move, which merges the folders with the migrated content.

### Folders redirected to another organization

If folders are currently redirected to OneDrive in a different organization, redirecting to your organization's OneDrive creates new Documents, Pictures or Desktop folders and the user sees an empty desktop. The user has to migrate files manually from the other organization's OneDrive. Learn recommends disabling the redirect to the other organization first, if possible.

## Stuck because of rollout volume

Learn recommends these limits for a staged rollout. They are recommendations in prose, not enforced blocks, and the page does not say that exceeding them causes stuck redirects:

| Policy | Scope | Limit |
| --- | --- | --- |
| Prompt users to move Windows known folders to OneDrive | Existing devices | 5,000 per day, 20,000 per week across macOS and Windows |
| Silently move Windows known folders to OneDrive | Existing devices | 1,000 per day, 4,000 per week across macOS and Windows |

New devices can be included with the silent policy. For large file sets, temporarily enable **Limit the sync app upload rate to a percentage of throughput**, then disable it after uploads finish. If users dismiss the prompt, a reminder notification appears until all known folders are moved or an error occurs, and then the reminder can be dismissed. When the silent policy does not succeed, users are prompted to correct the error and continue.

## Problems tied to specific files and folders

Microsoft Support's folder protection page lists these causes:

- **Path too long.** The whole path including the file name must be under 260 characters in Windows.
- **File too large.** OneDrive can't sync files over 250 GB.
- **File name not allowed.** Names can't start with a space or include reserved characters. Rename or move the file.
- **Folder not selected for syncing.** Open OneDrive settings, select **Choose Folders** and select it. For Pictures, make sure Pictures, Screenshots and Camera Roll are all selected, or do not exist.
- **Nested important folder.** A folder that contains another important folder (Documents, Desktop, Pictures, Screenshots, Camera Roll or the OneDrive folder) can't be protected until the contained folder is moved.
- **Reparse points.** Junctions or symlinks can cause the problem. Support says to remove the link, but only one you know is safe to change, because some applications depend on it.
- **Open files.** Save and close the file, then try again.
- **Cloud-only files when stopping backup.** Change these files to **Always keep on this device** first, then stop the backup.
- **Error code 0x80070005.** Files may have moved into identically named folders in OneDrive. Move them back, and ask whether the policy **Prohibit User from manually redirecting Profile Folders** can be changed.
- **Outlook PST files.** If OneDrive shows Processing changes while Outlook is open, remove the PST data file from OneDrive.
- **macOS.** Use the standalone sync app, not the Mac App Store version, and give OneDrive Full Disk Access. Work or school admins may have disabled this.

The page also notes that folders connected to a domain can't be protected in a personal account signed in with a Microsoft account.

## Admin troubleshooting order (my advice)

1. Confirm the sync app is current.
2. Check for Windows Folder Redirection policies and for redirects to another organization.
3. Look at rollout size against the daily limits.
4. Check one affected device for long paths, large files, junctions, PST files and open files.
5. Review the user's error notification text and match it against the list above.

## Not covered

The two pages do not describe a way to view Known Folder Move errors centrally, for example in an admin center report, and they name no minimum sync app version.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Redirect and move Windows known folders to OneDrive (Microsoft Learn)](https://learn.microsoft.com/sharepoint/redirect-known-folders)
- [Back up your folders with OneDrive (Microsoft Support)](https://support.microsoft.com/office/back-up-your-folders-with-onedrive-d61a7930-a6fb-4b95-b28a-6552e77c3057)
