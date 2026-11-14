---
title: "Dynamics 365 Sales With Teams and SharePoint: Where Files Live and What Is Deprecated"
summary: "How Dynamics 365 Sales documents are stored in SharePoint, what the Teams integration does with channel folders, permission rules, known limits, and the 2026 deprecation of linking records to Teams channels."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [dynamics-365-sales, sharepoint, teams]
keypoints:
  - "Documents for Dynamics 365 records are stored in SharePoint. Teams files and Dynamics documents share one SharePoint root site per tenant, though subsites can differ."
  - "Microsoft's release notes say linking Dynamics 365 records to Teams channels is deprecated effective May 2026, and it stays supported until officially removed."
  - "Files added from a Teams channel go to Team > Documents > Channel. Files added through the default site location do not show in the channel Files tab."
  - "Access depends on SharePoint permissions. Guests and unlicensed Teams members get an error on pinned records."
  - "A library with 5,000 or more documents can hit throttling, and the OneNote integration stops working there."
faq:
  - q: "Where are files stored when a Dynamics 365 record is linked to a Teams channel?"
    a: "Microsoft Learn says files added from a channel or a linked record are stored at Team Name, Documents, Channel Name in SharePoint. Files added to the record through the default site document location stay on the default SharePoint site and do not show in the channel Files tab."
  - q: "Is the Teams channel linking still supported?"
    a: "The Dynamics 365 Sales release page says that effective May 2026 the ability to link Dynamics 365 records to Microsoft Teams channels is deprecated and that Dynamics 365 should be used directly in the browser. Deprecated means the feature continues to work and is supported until it is officially removed. Check the current state before you plan around it."
  - q: "Can guests open a pinned Dynamics 365 record in Teams?"
    a: "No. Learn says guest users get an error message when they try to access a pinned record, and so do chat or channel participants without a Dynamics 365 license."
  - q: "Does removing someone from a channel remove their file access?"
    a: "Not completely. Learn says a removed member with record access can still edit the record in Dynamics 365 but cannot access the files. Access to files depends on SharePoint permissions, so to restrict a user you remove them from the SharePoint site."
  - q: "Are there size limits for documents?"
    a: "The pages I read state no file size limit for Dynamics 365 document management. They do state that a library with 5,000 or more documents might experience throttling, and that sorting on non-default columns can return a throttling error."
---

Documents in Dynamics 365 Sales live in SharePoint, and Teams files live there too. That shared storage explains most boundary problems: where a file appears, who can open it and why a limit is hit. A separate point matters for planning in late 2026. Microsoft has deprecated the feature that links Dynamics 365 records to Teams channels.

The pages I read do not describe a synchronization of the sales pipeline itself with Teams or SharePoint. They describe documents, record linking and permissions. This article covers those.

## Step 1: Understand the storage model

Microsoft's document management page explains the basis. Document management with SharePoint lets users manage Word, Excel, PowerPoint and OneNote files and folders for records in customer engagement apps, such as Dynamics 365 Sales. For each tenant there is a single SharePoint instance. Documents in Dynamics 365 and files in Teams are on the same SharePoint site. Subsites may differ, but the root site is the same.

For Dynamics 365 Sales, the SharePoint integration page lists a SharePoint Online or Microsoft 365 subscription as the prerequisite and sends you to the general instructions for configuring the integration. Administrators set up document management, specify permissions and ensure the SharePoint site URLs are correct. Document management is not supported for users with Power Apps for Microsoft 365 licenses.

## Step 2: Know where a file lands

Learn's FAQ gives these rules:

- **Channel folder.** A file added from a Teams channel or from a linked record is stored at Team Name > Documents > Channel Name. It appears in the channel Files tab and in the record's document grid.
- **Default site.** A file added through the default site document location goes to the default SharePoint site that came with the Dynamics 365 environment. It does not appear in the channel Files tab.
- **No SharePoint integration for the table.** Files from a channel go to the channel folder. A record that is not pinned to a channel cannot get documents.
- **Linking later.** When you link a record to a channel, files already in the channel show up in the record's document grid. Files already on the default site stay there and are not visible in the channel.
- **Several records on one channel.** The file is visible for all records associated with the channel.
- **Switching channels.** Another document location is added for the new channel, and users can switch between locations.

## Step 3: Plan for the deprecation

The Dynamics 365 Sales release page states: effective May 2026, linking Dynamics 365 records to Microsoft Teams channels is deprecated, and Microsoft recommends using Dynamics 365 directly in the browser. It also says that effective January 2026 the option to add chat messages from Teams to Dynamics 365 records is deprecated. Deprecated means the feature continues to work and is fully supported until it is officially removed.

The pages I read give no removal date. If your design depends on record linking, plan an alternative, such as working in Dynamics 365 and keeping documents on the SharePoint locations of the records.

## Step 4: Get permissions right

- There is no automatic relationship between SharePoint permissions and Dynamics 365 permissions. Users need explicit permission for document management in the app and for SharePoint.
- Access to files in Teams or Dynamics 365 depends on access to the SharePoint site that holds the file.
- Guests get an error on pinned records. So do chat or channel participants without a Dynamics 365 license.
- A member added to a channel gets read, write and delete rights on the files in Dynamics 365, SharePoint and Teams. If that user has record access they can also edit the record.
- A removed member with record access can edit the record but cannot access its files. To block file access, remove the user from the SharePoint site.
- If a Teams account is deleted, the files are removed from Dynamics 365 and SharePoint, according to the FAQ.

## Step 5: Watch the documented limits

From the known issues page:

- A library with 5,000 or more documents might be throttled. Sorting on columns other than the default can return the throttling error. OneNote integration does not work at that size.
- The document grid row limit is 5,000, and the maximum rows setting is ignored.
- The relationship must be one-to-many between the table and the SharePoint document table.
- Document management works only for tables selected in the Document Management Settings wizard. The site for which the wizard was last run becomes the default site. A new site needs the wizard, or you get a File not found error.
- The Filter by Name operators such as begins with or ends with are not supported.
- The Next and Previous arrows in the SharePoint grid do not work. Use Load More or Open Location.
- SharePoint integration does not work with the editable grid.
- Since March 2025, connecting to the `sharepointdocument` virtual table with the Microsoft default service principal is no longer supported. Use a user account.
- Third-party solutions that create, rename or move record-level folders can cause unexpected behavior.

The pages state no limits for file size, file name length or path length. Use the SharePoint documentation for those.

## Checklist

1. Which SharePoint site holds the files, the channel folder or the default site?
2. Do all users have both app and SharePoint permissions?
3. Does the design depend on Teams record linking?
4. Will any library exceed 5,000 documents?

## Related

- [Dynamics 365 Sales](https://www.m365.fm/entity/dynamics-365-sales/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Teams](https://www.m365.fm/entity/teams/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)

## Sources

- [Document management with Teams integration (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/teams-integration/teams-doc-management)
- [Dynamics 365 Sales deprecations: enable record linking (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/sales/teams-integration/enable-record-linking)
- [Integrate Dynamics 365 Sales with SharePoint (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/sales/connect-with-sharepoint)
- [Manage documents using SharePoint (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint)
- [SharePoint document management known issues (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/doc-management-known-issues)
