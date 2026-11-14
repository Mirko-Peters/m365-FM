---
title: "Build a File Plan and Declare Records With Retention Labels in Microsoft Purview"
summary: "Use Microsoft Purview Records Management: retention labels that declare records, the difference between locked, unlocked and regulatory records, what each label type blocks, tenant settings and how to validate migrated records."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [microsoft-purview-records-management, retention-labels]
keypoints:
  - "Records management in Microsoft Purview is typically done with retention labels that can declare items as records, applied by users or automatically."
  - "A regulatory record label cannot be removed once applied, even by a global administrator. Its retention period cannot be shortened, only extended."
  - "Regulatory record labels are not available by default and must be enabled with PowerShell. Auto-labeling policies do not support them."
  - "Tenant settings are under Settings > Solutions settings > Records Management > Retention Labels: Allow editing of record properties and Deletion of items."
  - "To validate migrated files, compare the vti_writevalidationtoken value with a Base64-encoded QuickXorHash of the original file."
faq:
  - q: "What does declaring a record do?"
    a: "According to Microsoft Learn, an item that a retention label declares as a record gets restrictions, additional activities are logged, and you have proof of disposition at deletion."
  - q: "How is a regulatory record different?"
    a: "Learn says that after a regulatory record label is applied, nobody, not even a global administrator, can remove it. The retention period cannot be shortened after the label is saved, only extended."
  - q: "Can auto-labeling apply regulatory record labels?"
    a: "No. Learn says auto-labeling policies do not support them. They must be applied with retention label policies."
  - q: "Where are the tenant settings for records?"
    a: "In the Microsoft Purview portal under Settings > Solutions settings > Records Management > Retention Labels, with Allow editing of record properties and Deletion of items."
  - q: "How do I prove a migrated file did not change?"
    a: "Learn says file size or hash may not be reliable after upload, because SharePoint updates file metadata. Compare the Base64-encoded QuickXorHash of the original with the vti_writevalidationtoken of the uploaded file."
---

Records management in Microsoft Purview uses retention labels to declare items as records, and a file plan is the page's way to bring in an existing retention plan or build a new one. This guide follows Microsoft Learn's records management overview and focuses on what the labels do and where the settings are. The page links to separate articles for step-by-step label creation, which it does not repeat.

## What records management offers

Learn lists these capabilities:

- Label items as a record, with labels applied by users or automatically by identifying sensitive information, keywords or content types.
- Migrate and manage retention requirements with a file plan, by bringing in an existing plan or building a new one.
- Configure retention and deletion settings with labels, based on date last modified or date created.
- Start different retention periods when an event occurs, using event-based retention.
- Review and validate disposition, and export information about disposed items.
- Set specific permissions for records manager functions.

The overview only links to the articles for file plan import and export, event-based retention, disposition review and permissions.

## Record or regulatory record

When a label declares an item as a record, the item gets restrictions, additional activities are logged and you have proof of disposition at deletion. A regulatory record is stricter: after it is applied, nobody, not even a global administrator, can remove the label.

Further restrictions for regulatory record labels:

- The retention period cannot be shortened after the label is saved, only extended.
- Auto-labeling policies do not support these labels. Use retention label policies.
- The label cannot be applied to a document checked out in SharePoint.
- The option is not available by default and must first be enabled with PowerShell. The page does not include the commands.

## What each label type blocks

| Action | Standard label | Record (locked) | Record (unlocked) | Regulatory record |
| --- | --- | --- | --- | --- |
| Edit contents | Allowed | Blocked | Allowed | Blocked |
| Edit properties, including rename | Allowed | Allowed, can be blocked by a tenant setting | Allowed | Blocked |
| Delete | Allowed, can be blocked by a tenant setting in SharePoint and OneDrive | Blocked | Blocked | Blocked |
| Copy | Allowed | Allowed | Allowed | Allowed |
| Move within container | Allowed | Allowed | Allowed | Allowed |
| Move across containers | Allowed | Allowed if never unlocked | Blocked | Blocked |
| Change or remove label | Allowed | Container admin only | Blocked | Blocked |

Record - unlocked is for SharePoint and OneDrive only. For Exchange, all records map to the Record - locked column, because record versioning is not supported for Exchange items.

## Tenant settings

Sign in to the Microsoft Purview portal at purview.microsoft.com, then go to **Settings** > **Solutions settings** > **Records Management** > **Retention Labels**. Two settings are named: **Allow editing of record properties** and **Deletion of items**.

## Validate migrated records

If you migrate files to SharePoint or OneDrive and must keep chain of custody, file size or hash may not be reliable, because SharePoint updates file metadata on upload. Learn describes this check:

1. Generate the XOR hash of the original file with the QuickXorHash algorithm.
2. Base64-encode the hash.
3. After migration, retrieve the `vti_writevalidationtoken` value from the uploaded file.
4. Compare the two values. If they match, the file has not changed.

## Where the restrictions come from

Two notes under the table matter in practice. Editing properties of a locked record can be blocked by a tenant setting, and deleting items with a standard label in SharePoint and OneDrive can be blocked by a tenant setting. Both are in the Retention Labels settings named above, so review them before you roll out labels.

## A planning order

This order is a suggestion, not from the page. Decide which content needs regulatory record labels first, because they cannot be removed and need PowerShell enablement. Then decide whether unlocked records suit working documents. Check the two tenant settings before publishing, since they change whether users can edit properties or delete items.

## Not covered

The overview does not give step-by-step label creation or publishing, event-based retention setup, disposition review details, file plan import and export, specific roles, licensing or record versioning details.

## Related

- [Records management](https://www.m365.fm/entity/microsoft-purview-records-management/)
- [Retention labels](https://www.m365.fm/entity/retention-labels/)

## Sources

- [Records management for documents and emails in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/purview/records-management)
