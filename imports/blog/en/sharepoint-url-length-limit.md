---
title: "SharePoint path length and file name limits: fix them before you migrate"
summary: "The SharePoint URL length limit is 400 characters for the decoded file path. Find long paths and invalid names before you migrate with this checklist."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-migration, sharepoint-document-libraries, sharepoint]
keypoints:
  - "Microsoft documents a limit of 400 characters for the entire decoded file path, including the file name, in OneDrive and SharePoint."
  - "Windows adds its own limits: Office desktop apps cannot open files whose full path exceeds 260 characters, even if the cloud accepts the file."
  - "Invalid characters include the double quote, asterisk, colon, angle brackets, question mark, slashes and pipe, and leading or trailing spaces are not allowed."
  - "Microsoft's pages do not say clearly whether site and library names count toward the 400 characters, so keep a safety margin in your checks."
  - "Measure paths on the source, fix the longest ones first by shortening folder names, and rename files before you copy, not after."
faq:
  - q: "What is the SharePoint URL length limit?"
    a: "Microsoft states that the entire decoded file path, including the file name, cannot exceed 400 characters for OneDrive and SharePoint in Microsoft 365. The limit covers the combination of folder path and file name after decoding. Windows adds a separate limit of 260 characters for opening files in Office desktop apps and File Explorer."
  - q: "Do spaces and special characters count more than one character?"
    a: "Microsoft's help article says special characters, spaces and accented characters are URL-encoded and that these encoded forms count toward the limit, for example a space becomes %20. The same page and the service description also say the decoded path is what counts. Because the pages disagree, plan with a margin and test an edge case."
  - q: "Which characters are not allowed in SharePoint file names?"
    a: "Microsoft lists the double quote, asterisk, colon, less-than and greater-than signs, question mark, forward slash, backslash and pipe as invalid characters. Leading and trailing spaces are also not allowed. Names such as CON, PRN, AUX, NUL, desktop.ini and anything starting with ~$ are blocked, and the number sign and percent sign need an admin to enable them."
---

The SharePoint URL length limit is 400 characters for the decoded file path, including the file name. Anything longer fails to upload, copy or sync, and users see an error instead of the file. This checklist is for leads of a [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) who want to find long paths and invalid names on the source before the first copy, because renaming after the migration is slower and riskier. You will learn what Microsoft documents, what it leaves unclear, and how to fix the longest paths in order.

## SharePoint URL length limit: what Microsoft documents

Microsoft states the 400 character limit for SharePoint Online in two places. The service description [SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits) says that the entire decoded file path, including the file name, cannot contain more than 400 characters for OneDrive and SharePoint in Microsoft 365. The help article [What are the file path length limits?](https://support.microsoft.com/en-us/onedrive/what-are-file-path-length-limits) gives the same number and adds details. It is a service limitation with no setting that increases it, so plan around it instead of waiting for a change.

Key points from that article:

- Every folder in the hierarchy and the file name with its extension count. Every character counts, including separators, spaces and the extension.
- Office for the web uses the same 400 characters.
- Special characters, spaces and accented characters are URL-encoded in SharePoint. A space becomes `%20`.

The encoding point is where the pages disagree. The help article says encoded forms count toward the limit, yet it also refers to the decoded path. The service description only mentions the decoded path. Microsoft's pages also do not say whether the site name and the library name count. Do not guess. Count from the library root as a minimum, and keep a margin of a few dozen characters until you have tested a real edge case in your tenant.

## The limits that bite in Windows

A path can be fine in [SharePoint](https://www.m365.fm/entity/sharepoint/) and still break on a desktop. The same help article lists the Windows side:

- Office desktop apps cannot open files whose full path exceeds 260 characters, even if the file is stored locally.
- File Explorer uses the 260-character limit for opening, renaming and moving files. It does not use the Windows long path policy.
- OneDrive sync allows a total local path of 520 characters: a local path of up to 400 characters plus a OneDrive root folder of up to 120 characters.
- Individual file or folder names can be up to 255 characters in File Explorer and in the macOS Finder.

The local path includes the folder that holds the synced library, which is longer than most people expect. So a path of 250 characters in the cloud can be 310 characters on a user's laptop. Treat 260 as the working limit for any content that people open from synced folders.

## Names that SharePoint rejects

Length is only half of the checklist. Microsoft's article [Restrictions and limitations in OneDrive and SharePoint](https://support.microsoft.com/en-us/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa) lists what to look for:

- **Invalid characters:** double quote, asterisk, colon, less-than, greater-than, question mark, forward slash, backslash and pipe.
- **Spaces:** leading and trailing spaces are not allowed.
- **Reserved names:** .lock, CON, PRN, AUX, NUL, COM0 to COM9, LPT0 to LPT9, _vti_ and desktop.ini.
- **Prefix and fragments:** a file name that starts with `~$` is not allowed, and `_vti_` cannot appear anywhere in a name. The name `forms` is not allowed at the root of a library.
- **Number sign and percent sign:** some organizations do not yet support them in names. Global admins and SharePoint admins can enable them.

These restrictions apply to the files and to the folders. A folder with a trailing space blocks everything below it, so one bad folder name can cause thousands of failed items.

## Pre-migration checklist

Use this order on every share or site before you copy.

1. **Measure path length on the source.** Export a list of full paths and compute the length of each. For a file share, `Get-ChildItem -Recurse` in PowerShell returns the full name of every item, and a short script can count characters.
2. **Calculate the target path.** Remove the part of the source path that does not exist in the library, then add the new library-relative prefix. Count from the root of the [document library](https://www.m365.fm/entity/sharepoint-document-libraries/), and add the library name for safety.
3. **Flag everything over 300.** The 400 limit is the hard limit. A flag at 300 leaves room for the sync folder and for later renames.
4. **List invalid characters and reserved names.** Search for the characters above, leading and trailing spaces, and names such as `~$` files.
5. **Fix in order of impact.** Shorten the folder name that sits highest in a long tree first. One shorter folder name shortens every path below it.
6. **Re-measure.** Run the same count again. Only then plan the copy.

Microsoft's migration scans also help. Migration Manager scans every file for known potential issues, and the SharePoint Migration Tool offers an option that only scans, so you can see problems before you move anything. Use them as a second check, not as your only check.

## Example: one long path, two limits

This example uses invented names and numbers. A file sits on a file share at a path of 247 characters below the share root, for example `2019/Customer Contracts and Offers/Northwind Rollout Phase 2/Technical Specification and Requirements/Approved Versions/Final Signed Copies/` followed by a file name of 107 characters. The target is a library named Projects, so the cloud path adds 9 characters for `Projects/` and totals 256.

- **Cloud limit:** 256 is below 400, so SharePoint accepts the file.
- **Windows limit:** a typical synced path starts with a local folder of 62 characters, such as `C:\Users\anna.example\OneDrive - Contoso\Projects - Team Site\`. The local total is 62 + 247 = 309, which is above 260. Office desktop apps cannot open the file from the sync folder.

The fix is to shorten names, not to raise limits. The migration lead renames the folders to `Contracts`, `Northwind Phase 2`, `Tech Spec`, `Approved` and `Signed`, and the file to `Northwind Phase 2 - Tech Spec v3 signed.docx`. The path below the root falls from 247 to 103 characters. The local total falls from 309 to 165, which is well below 260 and leaves room for a longer user name.

Check the business side before you rename. Contracts and technical specifications often follow naming rules, and file names may need to stay identical for legal reasons. In that case, shorten the folders and keep the file names.

## Options when a path is too long

You have four choices, in this order of preference:

- **Shorten folder names.** It is the cheapest fix and helps every file below.
- **Flatten the structure.** Remove levels that only repeat information, such as `Final` inside `Approved`. Microsoft's file share guide also suggests splitting large drives into smaller, more focused libraries.
- **Use metadata instead of folders.** A column such as Year or Customer in the library replaces two folder levels.
- **Leave the file behind.** If nobody has opened it in years, archive it elsewhere.

Do not rely on a workaround such as moving the file one level up after the migration. Without the cause fixed, the next restructuring fails too.

Agree the rules with the content owners before you rename anything. A short naming convention, for example no more than 40 characters per folder name and no more than 8 folder levels, gives people a target and keeps new content from drifting back over the limit after the move. Publish the convention on the landing page of the library and repeat it in the migration announcement, so that people know why their familiar folder names changed. Shared links to renamed items can break, which is another reason to avoid late renames. A deep structure also produces a long link, because the link to a file repeats every folder name in its address, and long links are harder to paste into e-mails and chats. A short, flat solution avoids both problems.

## Common mistakes

- **Counting from the wrong point.** The path in the source is not the path in the library. Calculate the target path.
- **Forgetting the local sync folder.** A path that works in the browser can fail in Office desktop apps.
- **Ignoring encoding.** Spaces and special characters can be longer than they look, so keep a margin. A migration request that fails on a single long item can hide the real cause among many similar errors.
- **Fixing names after the copy.** Renames in the cloud take effect in every sync client and break links that people saved.
- **Trusting a single check.** Run your own measurement and the migration scan.

## How software can help

PowerShell and a spreadsheet are enough to start: list all paths with their length, sort by length and group by top-level folder. Microsoft's migration scans give a second view. Some third-party tools offer path and name reports as well. Judge any tool by whether it counts from the right starting point and shows the files and folders that block the copy.

## Next step

Export the paths of one share this week and sort them by length. Then write down how many files exceed 300 characters, because that number sets the effort for your SharePoint URL length limit clean-up.
