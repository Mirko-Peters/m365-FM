---
title: "SharePoint Managed Metadata Default Values in Nested Folders: What Works and What Does Not"
summary: "How location-based default column values behave for managed metadata in nested SharePoint library folders, how to set them in the UI or with PnP PowerShell, and why a default is not enforcement."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [sharepoint, sharepoint-managed-metadata, sharepoint-document-libraries, pnp-powershell]
keypoints:
  - "Column default value settings in library settings let you set defaults per folder. A child folder inherits its parent's value unless a value is set on the child itself."
  - "A default fills the field when a new item is created or uploaded, and the user can still change it. It does not enforce a value."
  - "Per Microsoft Q&A, defaults fill files but not the folders themselves, and a Document Set with shared columns is the documented alternative for the first folder level."
  - "The built-in screen accepts one value. For per-folder taxonomy or multi-value defaults, Microsoft staff in Q&A point to Set-PnPDefaultColumnValues."
  - "Microsoft's own documentation for these rules is an archived SharePoint Server 2010 page, so test the behavior in your library before you rely on it."
faq:
  - q: "Do default values apply to nested subfolders?"
    a: "An archived Microsoft page for SharePoint Server 2010 says folders inherit default values unless you specify a particular default for the child folder. It does not state a depth limit, and it describes an older product version, so confirm the behavior in your own SharePoint Online library."
  - q: "Do defaults change files that are already in the library?"
    a: "The pages read describe defaults being applied when users create or upload a new item. They do not say defaults apply retroactively, so assume existing items keep their current values and fix them with a bulk edit or a script."
  - q: "Can I force a managed metadata value instead of just defaulting it?"
    a: "A default can be changed by the user in the edit properties form. To make a value mandatory, Microsoft Support describes the column option Require that this column contains information. Combine a default with that option."
  - q: "How do I set a default term for a specific folder with PowerShell?"
    a: "The PnP PowerShell reference shows Set-PnPDefaultColumnValues with -List, -Field, -Value and -Folder. Taxonomy values can be given as a label path such as Company|Locations|Stockholm or as a term GUID, and the term must be valid for the field."
---

Default values are the cheapest way to get consistent metadata into a document library. The catch is that they are easy to over-trust. A folder default fills a column for new files, it does not force anyone to keep that value, and it behaves differently for folders than for files. This guide explains the documented behavior, how to set defaults for managed metadata, and where the evidence is thin.

A note on sources: the rules for location-based defaults come from an archived Microsoft page about SharePoint Server 2010 and from Microsoft Q&A answers. The pages I read for SharePoint Online do not restate them in a current reference. The behavior below is documented, but test it in your own library.

## How folder defaults work

Microsoft's archived ECM blog for SharePoint Server 2010 says metadata defaults can be set at site, list and folder level. In a library, open **Library settings** and select **Column default value settings**. A tree control lets you pick the library root or any folder and set a default per column.

The documented rules:

- Defaults inherit from each other, and the child default always overrides.
- If a folder has no value of its own, an item added to that folder gets the list default, then the site column default.
- Folders inherit default values unless you specify a particular default for the child folder.
- When users create or upload a new item, the default is applied and displayed in the edit properties form, where the user can change it.
- Supported column types include single line of text, choice, number, currency, date and time, yes/no and managed metadata.

A companion Microsoft page on the object model adds precedence rules. If an uploaded document already carries a value equal to the list default, the location-based default overwrites it. If the document carries a value that differs from the list default, that value is kept even if a location default exists. Defaults apply on single upload, bulk upload, saves from Office clients and when a workflow creates a document.

The same page shows inheritance by branch: setting a default on one subfolder does not affect its sibling folders, only its own children.

## What defaults do not do

Microsoft Q&A answers add limits:

- A Microsoft Q&A answer from Microsoft external staff says a default fills in files automatically but not folders. Folders must be filled in manually. The same answer concludes that copying one column value from a top folder through all nested folders and files could not be achieved with defaults.
- A Document Set is the suggested alternative at the first level. Add the column to the Document Set content type and select it under **Shared Columns**, and files inside the set receive the value. The asker reported this worked, but the thread did not confirm behavior for folders nested inside a set.
- The built-in screen accepts one text value. A Q&A answer notes that only a single choice can be set as a default, even for a multi-value column.
- Defaults do not remove the need for validation. They are suggestions the user can overwrite.

## Set a default term on a managed metadata column

When you create the column, Microsoft Support describes a **Default Value** section where you can type the term or use the tag icon to browse for it. That sets the list-level default. The same page lists related options:

- **Display format**, term label only or term with full path.
- **Allow users to type new values**, unavailable if the term set is closed.
- **Multiple Value field**. With multiple values allowed, users cannot sort the column in list views.
- **Require that this column contains information**, which makes the column mandatory.
- **Enforce Unique values**.

For lists or libraries you need the Manage Lists permission level. Creating site columns requires Site Collection Administrator rights.

## Set per-folder defaults with PnP PowerShell

The PnP PowerShell reference documents `Set-PnPDefaultColumnValues` with `-List`, `-Field`, `-Value` and optional `-Folder`. If `-Folder` is omitted, defaults go to the library root. Examples from the reference:

```powershell
# Label path format for an Enterprise Keywords default
Set-PnPDefaultColumnValues -List Documents -Field TaxKeyword -Value "Company|Locations|Stockholm"

# Term GUID format
Set-PnPDefaultColumnValues -List Documents -Field TaxKeyword -Value "15c4c4e4-4b67-4894-a1d8-de5ff811c791"

# Text default for one folder
Set-PnPDefaultColumnValues -List Documents -Field MyTextField -Value "DefaultValue" -Folder "My folder"
```

The reference warns that you must ensure the term is valid for the field. It does not say how defaults apply to subfolders or existing items. A Microsoft Q&A answer that recommended this cmdlet used it to set a multi-value choice default for a specific folder, which the screen cannot do.

## Known problem reports

A 2019 Microsoft Q&A thread described default managed metadata values on Office documents disappearing after about a minute in a Teams-provisioned library, while PDF, JPG and TXT files kept theirs. The Microsoft responder could not reproduce it and called it not a bug. The poster found that creating a new managed metadata site column and applying it instead kept the defaults. That is one report with no confirmed root cause, so treat it as a hint rather than a rule. If you see the same pattern, test with a fresh site column.

## Design recommendations

1. **Keep the folder tree shallow.** Fewer levels means fewer places where an override can hide.
2. **Set the default at the highest level that is always right.** Override only where a branch really differs.
3. **Pair defaults with Require that this column contains information** when a value must exist.
4. **Use a Document Set** if the whole bundle shares metadata and users should not edit it per file.
5. **Script folder defaults** with PnP PowerShell if you maintain many folders, and keep the script in source control.
6. **Test with an Office file and a PDF** in the target folder, uploaded from the browser and from Teams.
7. **Fix existing items separately.** The pages read describe defaults at creation or upload only.

## Typical mistakes

- Expecting a default to change files already in the folder.
- Expecting the folder itself to receive the value.
- Setting a term in the UI for a multi-value need that the screen cannot express.
- Treating a default as validation.
- Relying on a deep tree without testing inheritance at the actual depth.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint managed metadata](https://www.m365.fm/entity/sharepoint-managed-metadata/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)
- [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/)

## Sources

- [Microsoft Learn (archive): Metadata defaults in SharePoint Server 2010](https://learn.microsoft.com/en-us/archive/blogs/ecm/metadata-defaults-in-sharepoint-server-2010)
- [Microsoft Learn: Location-based metadata defaults in SharePoint Server 2010 (ECM)](https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee557925(v=office.14))
- [Microsoft Support: Create a managed metadata column](https://support.microsoft.com/en-us/sharepoint/data-and-lists/create-a-managed-metadata-column)
- [Microsoft Q&A: Copy through column data to subfolders](https://learn.microsoft.com/en-us/answers/questions/805828/copy-through-column-data-to-sub-folders-sharepoint)
- [Microsoft Q&A: SharePoint Online list column default value setting](https://learn.microsoft.com/en-us/answers/questions/689497/sharepoint-online-list-column-default-value-settin)
- [Microsoft Q&A: Default managed metadata values on Office documents](https://learn.microsoft.com/en-us/answers/questions/5008479/sharepoint-online-microsoft-teams-assigned-default)
- [PnP PowerShell: Set-PnPDefaultColumnValues](https://pnp.github.io/powershell/cmdlets/Set-PnPDefaultColumnValues.html)
