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
  - "Sources disagree on encoded versus decoded counting and on the starting point, so count from /sites and keep a safety margin in your checks."
  - "Measure paths on the source, fix the longest ones first by shortening folder names, and rename files before you copy, not after."
faq:
  - q: "What is the SharePoint URL length limit?"
    a: "Microsoft states that the entire decoded file path, including the file name, cannot exceed 400 characters for OneDrive and SharePoint in Microsoft 365. The limit covers the combination of folder path and file name after decoding. Windows adds a separate limit of 260 characters for opening files in Office desktop apps and File Explorer."
  - q: "Do spaces and special characters count more than one character?"
    a: "It depends on the source. Microsoft's help article says encoded forms such as %20 count toward the limit, while its main rule and a Microsoft Q&A answer say the decoded path counts. Because the sources disagree, count spaces as one character, keep a margin of a few dozen characters and test an edge case."
  - q: "Which characters are not allowed in SharePoint file names?"
    a: "Microsoft lists the double quote, asterisk, colon, less-than and greater-than signs, question mark, forward slash, backslash and pipe as invalid characters. Leading and trailing spaces are also not allowed. Names such as CON, PRN, AUX, NUL, desktop.ini and anything starting with ~$ are blocked, and the number sign and percent sign need an admin to enable them."
---

The SharePoint URL length limit is 400 characters for the decoded file path, including the file name. Anything longer fails to upload, copy or sync, and users see an error instead of the file. This checklist is for leads of a [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) who want to find long paths and invalid names on the source before the first copy, because renaming after the migration is slower and riskier. You will learn what Microsoft documents, what it leaves unclear, and how to fix the longest paths in order.

## SharePoint URL length limit: what Microsoft documents

Microsoft states the 400 character limit for SharePoint Online in two places. The service description [SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits) says that the entire decoded file path, including the file name, cannot contain more than 400 characters for OneDrive and SharePoint in Microsoft 365. The help article [What are the file path length limits?](https://support.microsoft.com/en-us/onedrive/what-are-file-path-length-limits) gives the same number and adds details. Neither page describes a setting that raises the limit, so plan around it.

Key points from that article:

- Every folder in the hierarchy and the file name with its extension count. Every character counts, including separators, spaces and the extension.
- Office for the web uses the same 400 characters.
- Special characters, spaces and accented characters are URL-encoded in SharePoint. A space becomes `%20`.

The encoding point is where the pages disagree. The help article says encoded forms count toward the limit, yet its main rule refers to the decoded path. The service description only mentions the decoded path. The next section shows what else points in different directions.

## How SharePoint counts the characters

Three sources answer the counting question, and they do not match completely.

- **Decoded or encoded?** An accepted answer on Microsoft Q&A, written by Microsoft external staff, says the path length is calculated on the decoded path and points to the restrictions article. The 2017 announcement said the same: [Redmondmag](https://redmondmag.com/articles/2017/05/10/microsoft-expands-sharepoint-online-url-path-lengths.aspx) quotes Microsoft's Bill Baer with "There is no limit to encoded URLs in SharePoint Online and OneDrive for Business." The help article's note that `%20` counts is the outlier.
- **Where does counting start?** Another Microsoft Q&A answer by Microsoft external staff says to start at the `/sites` segment and to ignore query-string parameters. For a link such as `/sites/SiteName/Shared Documents/Forms/AllItems.aspx?FolderCTID=...`, only the part before the question mark counts. By that answer the site name and the library name count. The help article's own example starts at the library root, so treat the Q&A answer as support guidance, not as documentation.
- **What about the server name?** The formula that Redmondmag reported in 2017 reads: protocol plus server name plus folder or file path plus folder or file name plus parameters. That differs from the support answer, which is one more reason not to run a tight count.

A safe rule follows from this. Count from `/sites`, include the site name, the library name, every folder and the file name, and keep a margin of a few dozen characters until you have tested a real edge case in your tenant.

## Did Microsoft increase the path limit?

Once, according to Redmondmag. In May 2017 the article reported that Microsoft had expanded the maximum URL path length for SharePoint Online and OneDrive for Business from 256 to 400 Unicode code units. Since then the number has stayed at 400 in the Microsoft pages quoted above. If an older guide or a migration tool still says 256 or 260, it describes the old limit or the Windows limit, not the current cloud limit.

## Hyperlink columns have their own 255-character limit

A second limit often gets mixed up with the path limit. In a [Microsoft Q&A thread](https://learn.microsoft.com/en-us/answers/questions/539652/hyperlink-columns-does-not-allow-more-than-255), a Microsoft support answer says that the Hyperlink column in a SharePoint list or library has a limit of 255 characters, and that this is by design. A deep folder structure can easily produce a link that is longer, because the link to a file repeats every folder name.

The suggested workaround is a Multiple lines of text column with enhanced rich text, where the link is added with the hyperlink option of the editor. Commenters on the thread name two drawbacks: the link may not update when the target file is renamed or moved, and the enhanced rich text option is not available in document libraries. Shorter folder names avoid the problem at its root.

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
2. **Calculate the target path.** Remove the part of the source path that does not exist in the library, then add the new library-relative prefix. Count from `/sites`, so the site name and the name of the [document library](https://www.m365.fm/entity/sharepoint-document-libraries/) are part of the total.
3. **Flag everything over 300.** The 400 limit is the hard limit. A flag at 300 leaves room for the sync folder and for later renames.
4. **List invalid characters and reserved names.** Search for the characters above, leading and trailing spaces, and names such as `~$` files.
5. **Fix in order of impact.** Shorten the folder name that sits highest in a long tree first. One shorter folder name shortens every path below it.
6. **Re-measure.** Run the same count again. Only then plan the copy.

Microsoft's migration scans also help. Migration Manager scans every file for known potential issues, and the SharePoint Migration Tool offers an option that only scans, so you can see problems before you move anything. Use them as a second check, not as your only check.

## Example: one long path, two limits

This example uses invented names and numbers. A file sits on a file share at a path of 247 characters below the share root, for example `2019/Customer Contracts and Offers/Northwind Rollout Phase 2/Technical Specification and Requirements/Approved Versions/Final Signed Copies/` followed by a file name of 107 characters. The target is a library named Projects, and the example ignores the site name to keep the numbers simple: the library adds 9 characters for `Projects/` and the total is 256.

- **Cloud limit:** 256 is below 400, so SharePoint accepts the file.
- **Windows limit:** a typical synced path starts with a local folder of 62 characters, such as `C:\Users\anna.example\OneDrive - Contoso\Projects - Team Site\`. The local total is 62 + 247 = 309, which is above 260. Office desktop apps cannot open the file from the sync folder.

The fix is to shorten names, not to raise limits. The migration lead renames the folders to `Contracts`, `Northwind Phase 2`, `Tech Spec`, `Approved` and `Signed`, and the file to `Northwind Phase 2 - Tech Spec v3 signed.docx`. The path below the root falls from 247 to 103 characters. The local total falls from 309 to 165, which is well below 260 and leaves room for a longer user name.

Check the business side before you rename. Contracts and technical specifications often follow naming rules, and file names may need to stay identical for legal reasons. In that case, shorten the folders and keep the file names.

## Options when a path is too long

You have four choices, in this order of preference:

- **Shorten folder names.** It is the cheapest way to shorten the URL and it helps every file below.
- **Flatten the structure.** Remove levels that only repeat information, such as `Final` inside `Approved`. Microsoft's file share guide also suggests splitting large drives into smaller, more focused libraries.
- **Use metadata instead of folders.** A column such as Year or Customer in the library replaces two folder levels.
- **Leave the file behind.** If nobody has opened it in years, archive it elsewhere.

Do not rely on a workaround such as moving the file one level up after the migration. Without the cause fixed, the next restructuring fails too.

Agree the rules with the content owners before you rename anything. A short naming convention, for example no more than 40 characters per folder name and no more than 8 folder levels, gives people a target and keeps new content from drifting back over the limit after the move. Repeat it in the migration announcement, so that people know why their familiar folder names changed.

## Common mistakes

- **Counting from the wrong point.** The path in the source is not the path in the library. Calculate the target path.
- **Forgetting the local sync folder.** A path that works in the browser can fail in Office desktop apps.
- **Ignoring the counting rules.** Sources disagree on encoding and on the starting point, so keep a margin. A migration request that fails on a single long item can hide the real cause among many similar errors.
- **Fixing names after the copy.** Renames in the cloud sync to every client, and a rename after the move repeats work you could have done on the source.
- **Trusting a single check.** Run your own measurement and the migration scan.

## How software can help

PowerShell and a spreadsheet are enough to start: list all paths with their length, sort by length and group by top-level folder. Microsoft's migration scans give a second view. Some third-party tools offer path and name reports as well. Judge any tool by whether it counts from the right starting point and shows the files and folders that block the copy.

## Next step

Export the paths of one share this week and sort them by length. Then write down how many files exceed 300 characters, because that number sets the effort for your SharePoint URL length limit clean-up.
