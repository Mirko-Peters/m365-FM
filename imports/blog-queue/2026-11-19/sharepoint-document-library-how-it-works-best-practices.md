---
title: "SharePoint Document Library: How It Works and Best Practices"
summary: "What a SharePoint document library is, how to create one, and the documented limits and settings that matter: versioning, list view threshold, permissions, columns and sync."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [sharepoint, sharepoint-document-libraries, sharepoint-list-view-threshold]
keypoints:
  - "A document library is a secure place to store files that people can find, co-author and open from any device. A new site comes with one by default."
  - "Use a separate library when a group of files needs different access. Permissions can be set at library, folder or file level."
  - "Versioning is on by default for new libraries in Microsoft 365 and keeps the last 500 versions. Microsoft recommends keeping at least 100."
  - "The list view threshold is 5,000 items for views and cannot be changed in SharePoint Online. A library itself can hold up to 30 million items."
  - "Don't require check-out if people co-author. Co-authors can't work on a checked-out file."
faq:
  - q: "What is a document library in SharePoint?"
    a: "According to Microsoft Support, a document library is a secure place to store files where you and your co-workers can find them, work on them together and open them from any device. A new SharePoint site includes a default library, and you can add more."
  - q: "How many files can a SharePoint document library hold?"
    a: "The SharePoint Online limits page says a library can have up to 30 million files and folders. That is separate from the list view threshold of 5,000 items, which limits how many items a single database operation or view may process."
  - q: "Should I use folders or columns in a library?"
    a: "Microsoft Support describes both. Folders are supported, and details columns such as created by or last modified help you organize and find files. For large libraries Microsoft's list view threshold article recommends indexed columns and filtered views to return fewer items. The pages I read don't give a single rule that picks one over the other."
  - q: "Does a library keep old versions of a file?"
    a: "Yes. Microsoft Support says versioning is on by default for new libraries in Microsoft 365 and automatically saves the last 500 versions of a document. Admins with permission to manage the library can change the limits in Library Settings."
  - q: "What is the maximum file size I can upload to a library?"
    a: "The SharePoint Online limits page lists 250 GB per file for uploads to SharePoint document libraries. An older Microsoft Support article on the list view threshold still lists 10 GB, so check the limits page for the current value."
---
A SharePoint document library is the part of a site where files live. Microsoft describes it as a secure place to store files so that you and your co-workers can find them, work on them together and open them from any device. It works through a few building blocks: the library itself, details columns, views, versions and permissions. Most problems with libraries come from ignoring one of these, usually permissions or size limits.

## What a library gives you

Microsoft Support lists these features of a document library:

- Add, edit, delete and download files, folders and links, and co-author files.
- Permissions at library, folder or file level.
- Activity tracking, with notifications about changes.
- Custom views of the library.
- Sharing of files or folders.
- Links to content stored outside the library, including web pages.
- Highlighting (pin to top) for files, folders or links.
- Metadata in the details pane, such as required properties and recent activity.

A new site includes a default document library. You can add more, and Microsoft gives one reason for it: separate libraries help if you need to restrict access to a set of files.

## How to create a library

Per Microsoft Support, the steps are:

1. Go to the team site where you want the library.
2. On the menu bar, select **New**, then **Document library**.
3. In the **Create new document library** dialog, choose a blank library, an existing library or a template.
4. Enter a name and an optional description.
5. Select **Create**.

Site owners can create or manage lists. Other team members might not be able to. Pick a name and description that help others find and use the library.

## Columns, views and navigation

Each library lists its files and folders with details such as who created or last modified an item. You can add columns with **+ Add columns** in list view. At the top right you can switch between List, Compact and Tiles views and save a custom view.

Metadata navigation is the documented way to filter with a navigation tree built from folders, managed metadata terms and other column types. The support article says it requires Site Owner or Site Collection Administrator rights to turn on, is enabled on most sites, and lists the Key Filter column types: Managed Metadata, Content Type, Choice, Person or Group, Date and Time, and Number. A list allows a maximum of 20 indexes. If a view exceeds the list view threshold, the query runs against part of the list, so results can be partial or empty.

## Versioning

Microsoft Support says versioning is on by default for new libraries and lists in Microsoft 365 and saves the last 500 versions of a document. Libraries can be set to keep 100 to 50,000 major versions, with an exception noted for communication sites, and Microsoft recommends at least 100. Each major version can have up to 511 minor versions. When a limit is reached, the oldest versions are deleted. If your organization must keep every version for legal or other reasons, Microsoft says not to apply limits.

Check-out has a side effect. If check-out is required, a version is created only when a file is checked in, and Microsoft says not to require check-out if people will co-author, because co-authors can't work on checked-out files. Without required check-out, a version is created on the first save after opening a file.

## Limits to know

| Item | Documented value |
|---|---|
| Files and folders per library | 30 million |
| List view threshold | 5,000 items (cannot be changed in SharePoint Online) |
| Upload size per file | 250 GB |
| File path including file name | 400 characters |
| Lists and libraries per site collection | 2,000 combined |
| Unique permission scopes per library | 50,000 supported, 5,000 recommended |
| Files in a library you sync | 300,000 recommended maximum |

Sources: the SharePoint Online limits page and the list view threshold article. Two more limits from the limits page: inheritance can't be broken or restored on a library, list or folder with more than 100,000 items, and the Recycle Bin counts toward storage.

The list view threshold deserves a plain explanation. It does not cap library size. It blocks database operations that process more than 5,000 items at once, such as a view with no filter. Microsoft says a warning can appear on the List Settings page once a list passes 3,000 items. To avoid the error, use indexed columns and filtered views, folders, search and personal views, and prefer the modern experience for views with many items.

## Best practices that Microsoft's pages support

1. **Separate libraries by audience.** If different groups need different access, use different libraries. Keep unique permissions well below 5,000 scopes per library.
2. **Describe files with columns.** Details columns make files easier to find than a deep folder tree alone. Folders are still supported.
3. **Filter large views.** Index the columns you filter or sort on and save a view that returns fewer items.
4. **Keep versioning on.** Reduce the count only if storage matters and you have no legal duty to keep versions.
5. **Skip required check-out when people co-author.**
6. **Keep paths short.** The 400-character limit includes the folder path and the file name.
7. **Sync what you need.** Microsoft recommends staying under 300,000 files in a single synced library.

## Common mistakes

- Treating the 5,000 threshold as a library size limit.
- Breaking permission inheritance on many individual files.
- Requiring check-out in a library where people co-author.
- Building very deep folder structures, which pushes paths toward the 400-character limit.
- Disabling versioning to save space. Microsoft advises against it because it removes recovery protection.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)
- [List view threshold (SharePoint)](https://www.m365.fm/entity/sharepoint-list-view-threshold/)
- [SharePoint managed metadata](https://www.m365.fm/entity/sharepoint-managed-metadata/)

## Sources

- [Microsoft Support: What is a document library?](https://support.microsoft.com/en-US/SharePoint/documents-and-library/what-is-a-document-library)
- [Microsoft Support: Create a document library in SharePoint](https://support.microsoft.com/office/create-a-document-library-in-sharepoint-306728fe-0325-4b28-b60d-f902e1d75939)
- [Microsoft Support: How versioning works in lists and libraries](https://support.microsoft.com/en-US/SharePoint/lists/documents-and-library/how-versioning-works-in-lists-and-libraries)
- [Microsoft Support: List View Threshold for large lists and libraries](https://support.microsoft.com/office/B8588DAE-9387-48C2-9248-C24122F07C59)
- [Microsoft Support: Set up metadata navigation for a list or library](https://support.microsoft.com/en-us/office/set-up-metadata-navigation-for-a-list-or-library-c222a75d-8b18-44e2-9ed8-7ee4e0d23cfc)
- [Microsoft Learn: SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits)
