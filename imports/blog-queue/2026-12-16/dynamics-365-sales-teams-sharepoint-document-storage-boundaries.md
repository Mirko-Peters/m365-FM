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
  - "The Dynamics 365 Sales deprecations page says linking records to Teams channels is deprecated effective May 2026. Deprecated features stay supported until officially removed."
  - "Files added from a Teams channel go to Team Name > Documents > Channel Name. With SharePoint integration on, files added via the default site location do not show in the channel Files tab."
  - "Access depends on SharePoint permissions. Guests and participants without a Dynamics 365 license get an error on pinned records."
  - "A library with 5,000 or more documents can hit throttling, and the OneNote integration stops working there."
faq:
  - q: "Where are files stored when a Dynamics 365 record is linked to a Teams channel?"
    a: "Microsoft Learn says files added from a Teams channel are stored at Team Name, Documents, Channel Name in SharePoint, and so are files added from a linked record through the channel's document location. If SharePoint integration is enabled for the table, files added through the default site document location stay on the default SharePoint site and do not show in the channel Files tab."
  - q: "Is the Teams channel linking still supported?"
    a: "The Dynamics 365 Sales page on removed or deprecated features says that effective May 2026 the ability to link Dynamics 365 records to Microsoft Teams channels is deprecated and recommends using Dynamics 365 directly in the browser. Its note says deprecated means the feature continues to work and is fully supported until it is officially removed, and that the notification might span a few years. It gives no removal date. Check the current state before you plan around it."
  - q: "Can guests open a pinned Dynamics 365 record in Teams?"
    a: "No. Learn says guest users get an error message when they try to access a pinned record, and so do chat or channel participants without a Dynamics 365 license."
  - q: "Does removing someone from a channel remove their file access?"
    a: "The Learn FAQ is not consistent here. One answer says a removed member with record access can still edit the record in Dynamics 365 but cannot access the files from Dynamics 365, SharePoint or Teams. Another answer, for a user who still has access from Dynamics 365 after removal, says access to files depends on SharePoint permissions and that you restrict the user by removing them from the SharePoint site. My own advice: check the SharePoint site permissions after you remove someone."
  - q: "Are there size limits for documents?"
    a: "The pages I read state no file size limit for Dynamics 365 document management. They do state that a library with 5,000 or more documents might experience throttling, and that sorting on non-default columns can return a throttling error."
---

Documents in Dynamics 365 Sales live in SharePoint, and Teams files live there too. That shared storage explains most boundary problems: where a file appears, who can open it and why a limit is hit. A separate point matters for planning in late 2026. Microsoft has deprecated the feature that links Dynamics 365 records to Teams channels.

The pages I read do not describe a synchronization of the sales pipeline itself with Teams or SharePoint. They describe documents, record linking and permissions. This article covers those.

## Step 1: Understand the storage model

The Power Platform admin page on document management explains the basis. Document management with SharePoint lets users manage common document types such as Word, Excel, PowerPoint and OneNote, and create folders to save and manage them for records in customer engagement apps, such as Dynamics 365 Sales. The Teams integration page adds the storage point: for each tenant there is a single SharePoint instance, documents in Dynamics 365 and files in Teams are all on the same SharePoint site, and the subsites may be different but the root site is the same.

For Dynamics 365 Sales, the SharePoint integration page lists a SharePoint Online or Microsoft 365 subscription as the prerequisite. For the Sales Hub app it sends you to the general instructions for configuring the integration. For the Sales Professional app it has its own steps: in the site map select Sales Settings, then Connect SharePoint under Standard settings, and enter your organization's SharePoint address. The Power Platform page says administrators set up document management, specify permissions for managing tasks and ensure the SharePoint site URLs are correct. It also notes that document management is not supported for users with Power Apps for Microsoft 365 licenses, who should upgrade to the appropriate licensing.

## Step 2: Know where a file lands

The FAQ on the Teams integration page gives these rules. It separates the case where SharePoint integration is not enabled for the table from the case where it is enabled.

- **Channel folder.** A file added from a Teams channel that is linked to a record is stored at Team Name > Documents > Channel Name. It appears in the channel Files tab and in the record's document grid. A file added from a linked record is stored there too when SharePoint integration is off for the table, or when you use the channel's document location with integration on. A file added from a channel that is not linked to a record appears only in the channel Files tab.
- **Default site (integration enabled).** A file added to a linked record through the default site document location goes to the default SharePoint site that was set up with the Dynamics 365 environment. It does not appear in the channel Files tab. The same default site is used for a file added from a record that is not linked to a channel.
- **No SharePoint integration for the table.** A record that is not linked to a Teams channel cannot get documents. With SharePoint integration enabled, you can add a document without a channel link.
- **Linking later.** When you link a record to a channel, files already in the channel show up in the record's document grid. Files already on the default site stay there and are not visible in the channel (integration enabled case).
- **Several records on one channel.** The file is stored in the channel folder and is visible in the channel and in the document grid of all records associated with the channel.
- **Switching channels.** If a record was linked to one channel and is then associated with a new channel, another document location is added for the new channel, and users can switch between the locations.

## Step 3: Plan for the deprecation

The Dynamics 365 Sales page "Removed or deprecated features" states: effective May 2026, the ability to link Dynamics 365 records to Microsoft Teams channels is deprecated, and it is recommended to use Dynamics 365 directly in the browser. It also says that effective January 2026 the ability to add chat messages from Teams to Dynamics 365 records is deprecated. The note at the top of that page defines deprecated: the feature continues to work and is fully supported until it is officially removed, and the notification might span a few years.

The page is not fully consistent. For the chat message feature it says that after the deprecation you can no longer use the Add to Dynamics 365 option in Teams chat messages, which reads like a removal. For channel linking it gives no such statement. The document management page for the Teams integration contains no deprecation notice.

The pages I read give no removal date for either feature. My own suggestion: if your design depends on record linking, plan an alternative, such as working in Dynamics 365 and keeping documents on the SharePoint locations of the records.

## Step 4: Get permissions right

- There is no automatic relationship between SharePoint permissions and Dynamics 365 permissions. Users need explicit permission for document management in the app and for SharePoint.
- Access to files in Teams or Dynamics 365 depends on access to the SharePoint site that holds the file.
- Guests get an error on pinned records. So do chat or channel participants without a Dynamics 365 license.
- A member added to a channel that has pinned records gets read, write and delete rights on the files in Dynamics 365, SharePoint and Teams. If that user has record access they can also edit the record. Without record access they get an error on the record but, per the FAQ, still have those file permissions. Another FAQ answer says users get read and write permission on a folder created in a Teams channel, so the delete right is not stated consistently.
- A removed member with record access can edit the record but, per one FAQ answer, cannot access the files from Dynamics 365, SharePoint or Teams. Another answer says a removed user may still reach the files from Dynamics 365 and that you restrict this by removing the user from the SharePoint site. My own reading: SharePoint site permissions decide, because the page says file access depends on them.
- The FAQ says that when you delete the Microsoft Teams account, the files are removed from Dynamics 365 and SharePoint. It does not say whether this means a team, a channel or a user, so test before relying on it.

## Step 5: Watch the documented limits

From the known issues page:

- A library with 5,000 or more documents might be throttled. Sorting on columns other than the default can return the throttling error. OneNote integration does not work at that size. The page says you can still view the documents in the default grid view.
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

- [Document management with Microsoft Teams integration (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/teams-integration/teams-doc-management)
- [Removed or deprecated features in Dynamics 365 Sales (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/sales/deprecations-sales)
- [Integrate with SharePoint (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/sales/connect-with-sharepoint)
- [Use SharePoint and Dynamics 365 apps to manage your documents (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint)
- [Known issues with document management (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-apps/integrate-products/doc-management-known-issues)
