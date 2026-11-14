---
title: "OneDrive and SharePoint Path Too Long or Invalid File Name: Limits and Fixes"
summary: "Find which limit you hit when OneDrive or SharePoint rejects a name or path: invalid characters and reserved names, a 400-character cloud path, 256 or 260 characters in Windows and Office, and the 520-character sync limit. Includes how to check path length and shorten paths."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [onedrive, sharepoint, onedrive-sync-engine]
keypoints:
  - "Names cannot contain these characters: double quote, asterisk, colon, less than, greater than, question mark, slash, backslash and pipe, and leading or trailing spaces are not allowed."
  - "Microsoft Support lists reserved names such as CON, PRN, AUX, NUL, desktop.ini, _vti_ and names starting with ~$, and forms cannot be used at the root of a library."
  - "The cloud limit is 400 characters for the entire decoded path, while Windows Office desktop apps and File Explorer are limited to about 260."
  - "OneDrive sync allows 520 characters in total: the local path up to 400 plus the OneDrive root folder up to 120."
  - "Fix by shortening names, keeping folders shallow, renaming from the web and shortening the OneDrive root folder name."
faq:
  - q: "What is the path length limit in OneDrive and SharePoint?"
    a: "Per Microsoft Support, 400 characters for the entire decoded path including the file name, in OneDrive, SharePoint and Office for the web. Special characters and spaces are URL-encoded in the web address, and the encoded forms count toward the 400."
  - q: "Why can a file open online but not on my PC?"
    a: "Windows Office desktop apps and File Explorer follow a limit of about 260 characters. A file in a deeply nested cloud folder can exceed that once it syncs under the longer local path."
  - q: "Which characters are invalid in file names?"
    a: "The support page lists double quote, asterisk, colon, less than, greater than, question mark, forward slash, backslash and pipe, plus leading or trailing spaces. It adds that some organizations do not yet support the number sign and percent sign."
  - q: "What happens when the sync path is too long?"
    a: "If a synced path exceeds 520 characters, OneDrive shows a path is too long notification, and syncing stops until the item is fixed."
  - q: "Does enabling Windows long paths solve it?"
    a: "The page says the LongPathAware Group Policy raises the file system limit, but each application must opt in, and File Explorer and Office desktop apps do not currently do so."
---

When OneDrive or SharePoint refuses a file or folder, there are two separate causes: the name contains something not allowed, or the full path is longer than a limit somewhere in the chain. Microsoft Support publishes both sets of rules. The cloud limit is 400 characters for the whole path, but Windows apps and OneDrive sync have their own limits, so a file can work in the browser and still fail on a PC. This guide uses two Microsoft Support pages: restrictions and limitations in OneDrive and SharePoint, and file path length limits.

One note on sourcing: I retrieved both pages through a summarising fetch, not as full verbatim text, so check the figures below against the pages before you put them into policy.

## Invalid names

The restrictions page lists these as not allowed in file and folder names: double quote, asterisk, colon, less than, greater than, question mark, forward slash, backslash and pipe. Leading and trailing spaces are not allowed either. The page adds that some organizations do not yet support the number sign and percent sign.

It also lists names that are not allowed: `.lock`, `CON`, `PRN`, `AUX`, `NUL`, `COM0` to `COM9`, `LPT0` to `LPT9`, `_vti_` and `desktop.ini`. File names starting with `~$` are blocked, and `forms` cannot be used for a file or folder at the root of a library.

If an upload or rename fails and the name is short, check it against this list first.

## Path length limits

The path length page gives these limits:

| Where | Limit |
| --- | --- |
| OneDrive and SharePoint (cloud) | 400 characters for the entire decoded path, including the file name |
| Office for the web | 400 characters |
| Windows Office desktop apps | 256 characters (260 UTF-16 units); they cannot open files with longer paths, even when stored locally |
| Windows file system (default) and File Explorer | 260 characters, with individual names up to 255 |
| OneDrive sync | 520 characters in total: local path up to 400 plus the OneDrive root folder up to 120 |
| macOS Office desktop apps | 1,024 UTF-8 bytes |
| macOS Finder | 1,024 characters, with individual names up to 255 |
| Windows with long paths enabled | 32,767 characters |

The page calls the 260-character limit the most restrictive one most users meet. It says a path includes every folder, the file name and extension, and that separators and spaces count. For a work or school account, the local path includes the organization name, for example OneDrive - Contoso, which leaves fewer characters than a personal account. Paths in OneDrive for the web start at the root of the library, so they are shorter than the local path for the same file.

## Where the errors show up

The page lists these patterns:

- **Online files that will not open on desktop.** A file created in a deeply nested folder can pass 260 characters once it syncs.
- **Folders that do not sync.** A folder name over 255 characters works in the browser but will not sync to File Explorer or Finder.
- **OneDrive sync errors.** A synced path over 520 characters triggers a path is too long notification and sync stops until you fix the item.
- **SharePoint shortcuts.** Shortcuts to deeply nested libraries or Teams channel folders can push local paths over 260.
- **Migrations.** Moving files from other cloud services can create unexpectedly deep structures.
- **Misleading messages.** The action cannot be completed can sometimes mean the path is too long.
- **Office lock files.** Temporary files such as `~$Budget_Report_v3.xlsx` add characters, so a path near 260 can fail on save or open.

## Check the length

On Windows, copy the path from the File Explorer address bar and count, or add the file name length to the folder path under Properties > Location. PowerShell can report `.Length` of a path string. On macOS, use Get Info and add the file name length. For the web, check the breadcrumb and URL, remembering that the encoded forms count toward 400.

## Fix it

The page recommends:

- Use shorter names for files and folders.
- Keep folder structures shallow.
- Check shared libraries before adding a shortcut: sync only a subfolder, ask the owner to flatten the structure, or rename the shortcut.
- Rename from the web when a path is too long for File Explorer.
- Keep frequently used files near the root of your OneDrive folder.
- Shorten the OneDrive root folder name. IT admins can set a custom folder name by using Group Policy.
- Use OneDrive Files On-Demand to browse in File Explorer, and open long-path files in the browser, where the limit is 400.
- Check the sync notifications in the system tray or menu bar to see which files are affected.

The page does not tell you that enabling Windows long paths solves it. It says the LongPathAware Group Policy raises the file system limit to 32,767 characters, but each application must opt in, and File Explorer and Office desktop apps do not currently do so.

## Other limits on the restrictions page

The restrictions page also lists: 250 GB for sync, individual files and files in a zip; a recommendation of no more than 300,000 items across cloud storage; copy on the OneDrive website of up to 2,500 files at a time; no thumbnails or PDF previews for files over 100 MB; and 2 GB for OneNote notebooks. Temporary .TMP files do not sync, and admins can block specific file types.

## A practical order of checks

This section is my advice, not a Microsoft statement.

1. **Read the error text.** If it names a character or reserved name, fix the name. If it mentions length, count the path.
2. **Count the local path, not only the web path.** The web path is shorter, so a file that looks fine online may be too long locally.
3. **Shorten the deepest folders first.** One long folder name repeated through the tree costs more than one long file name.
4. **Rename from the web** to get past File Explorer limits, as the page suggests.
5. **For a team structure, agree a depth limit** before a migration, so the structure does not recreate the problem.
6. **Review the organization name length** in the local root folder when many users hit the limit.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)

## Sources

- [Restrictions and limitations in OneDrive and SharePoint (Microsoft Support)](https://support.microsoft.com/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa)
- [What are the file path length limits? (Microsoft Support)](https://support.microsoft.com/onedrive/what-are-file-path-length-limits)
