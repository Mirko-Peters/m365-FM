---
title: "Who deleted this file? Searching SharePoint audit logs in Purview"
summary: "Who deleted a file? The SharePoint audit log in Microsoft Purview answers it: set the date range, search the file operations and read the acting user."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [microsoft-purview-audit, audit-logs, sharepoint, compliance]
keypoints:
  - "Search the audit log in the Microsoft Purview portal under Audit and Search, and filter on the file operations and on the file, folder or site."
  - "You need the Audit Logs or View-Only Audit Logs role, and audit log search is turned on by default for enterprise organizations."
  - "A user deletion often appears as FileRecycled, so search FileRecycled and the two recycle bin deletion operations as well as FileDeleted."
  - "The default date range is seven days and the maximum is 180 days, while the retention period is 180 days or one year for SharePoint activity with E5 licenses."
  - "The acting account can be a service account, so check who or what the account is before you draw a conclusion."
faq:
  - q: "Where can I see who deleted a file in SharePoint?"
    a: "Open the Microsoft Purview portal, go to Audit and Search, set the date range and select the file operations such as FileRecycled and FileDeleted. Enter part of the file name or the site URL in the file, folder or site field. The results show the date, the operation and the user."
  - q: "Which permissions do I need to search the audit log?"
    a: "Microsoft states that you must be assigned the Audit Logs or View-Only Audit Logs role in the Microsoft Purview portal. Audit log search is turned on by default for Microsoft 365 and Office 365 enterprise organizations, and you can verify the setting with the UnifiedAuditLogIngestionEnabled property in Exchange Online PowerShell."
  - q: "How far back can I find a deleted file in the audit log?"
    a: "A single search can cover at most 180 days. The audit records themselves are kept for 180 days with non-E5 licenses. With E5 licenses, Microsoft states that SharePoint activity is retained for one year by default. If the deletion is older than your retention period, the log cannot answer the question."
---

To find out who deleted a file in SharePoint, open the audit log in the Microsoft Purview portal, set the date range, search for the file operations and the file name, and read the user and the time in the results. This guide is for the security admin who gets the question after a document goes missing. It explains the permissions, the operations to search, the limits that can hide the answer, and what to do once you have a name.

## Who deleted the file? Use the SharePoint audit log in Microsoft Purview

[Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/) records user and admin activity across Microsoft 365 in the unified audit log, and [SharePoint](https://www.m365.fm/entity/sharepoint/) file events are part of it. Microsoft's article on [searching the audit log](https://learn.microsoft.com/en-us/purview/audit-search) names two prerequisites. You must be assigned the Audit Logs or View-Only Audit Logs role in the Microsoft Purview portal. And audit log search must be turned on, which it is by default for Microsoft 365 and Office 365 enterprise organizations. To verify it, run `Get-AdminAuditLogConfig | Format-List UnifiedAuditLogIngestionEnabled` in Exchange Online PowerShell. The value True means the search is on.

The steps in the portal:

1. Sign in to the Microsoft Purview portal, select the Audit solution and open the Search page.
2. Set the date and time range in UTC. Seven days are selected by default, and the maximum range is 180 days.
3. Choose the activities. You can pick friendly names or enter operation names.
4. Enter part or all of the file name, folder name or site URL in the file, folder or site field. A wildcard at the end of a URL is allowed.
5. Leave the user box blank to see all users and service accounts, or enter a user you suspect.
6. Select Search and wait for the job to finish.

Keep one detail in mind: terms in the keyword field are searched only within indexed content, not in the audit data content. For a file name, the file, folder or site field is the more reliable choice.

## Which operations to search

Deleting a file can leave several records, and searching only one of them is the usual reason for an empty result. Microsoft's list of [audit log activities](https://learn.microsoft.com/purview/audit-log-activities) describes the file events:

- **FileRecycled:** the user moves a file into the SharePoint Recycle Bin.
- **FileDeleted:** the user deletes a document from a site.
- **FileDeletedFirstStageRecycleBin:** the user deletes a file from the recycle bin of a site.
- **FileDeletedSecondStageRecycleBin:** the user deletes a file from the second-stage recycle bin of a site.
- **FileRestored:** the user restores a document from the recycle bin of a site.
- **FolderRecycled and FolderDeleted:** the same events for folders.

Tony Redmond reported in 2023 that SharePoint Online does not delete an item until it passes through the two-stage recycle bin, and that a user's deletion is therefore logged as FileRecycled, an event he first saw in March 2023. Microsoft did not announce the change, according to his article on the [FileRecycled audit event](https://office365itpros.com/2023/08/18/filerecycled-audit-event/). He warns that scripts looking only for FileDeleted can miss deletions. The practical rule: search FileRecycled first, then the recycle bin deletions, then FileDeleted, and check FileRestored to see whether someone already recovered the file.

Operation names must be entered exactly as named. According to Microsoft, if operation names are entered incorrectly, no results are returned.

## Read the result and find the user

Open a record to see the date and time, the operation, the user and the item. The item is identified by its URL in the object ID. Export the results when you need to filter or share them. Microsoft states that export supports up to 50,000 rows for Audit (Standard).

Two cautions apply to the user field. First, a blank user filter includes service accounts, so the acting account can be an app or an automation rather than a person. Check who owns the account before you conclude that someone deleted the file by hand. Second, the log shows who performed the action, not why. Ask the person and the site owner for the context before anyone is held responsible.

Timing matters too. Microsoft does not guarantee a specific time after an event for the record to appear in a search. For core services, including SharePoint, OneDrive and Teams, availability is typically 60 to 90 minutes. If you search for a deletion from the last hour, wait and search again.

## Limits that can hide the answer in the unified audit log

Four limits explain most cases in which the Microsoft 365 audit log seems to say nothing.

- **Retention.** Microsoft states that audit records are retained for 180 days by default, and for one year for Microsoft Entra ID, Exchange and SharePoint activity with E5 licenses. A deletion older than that cannot be found.
- **Date range.** A single search covers at most 180 days, and the default is only seven.
- **Search job time.** Search jobs keep running after you close the browser window, and broadly scoped searches in large tenants can take up to 48 hours. Narrow the date range and the site first.
- **Role.** Without the Audit Logs or View-Only Audit Logs role, the search is not available to you.

If the file is also needed back, the audit record is only the first step. The events above show whether it sits in the first-stage or second-stage recycle bin, and the FileRestored event shows whether someone has already restored it. Compare with [audit logs](https://www.m365.fm/entity/audit-logs/) for the other kinds of records that help in an incident.

## Find who shared a file

The same search works for sharing questions. Microsoft's article on [sharing auditing](https://learn.microsoft.com/purview/audit-log-sharing) says that sharing is a two-user action: an acting user shares a resource with a target user. In the portal, select Sharing and access request activities under the friendly names. The page lists these operations:

- **SharingSet:** logged when the target user already has a directory account, for example a guest account, and access is granted immediately.
- **SharingInvitationCreated:** an invitation goes to an external user and grants no access at this point.
- **AnonymousLinkCreated:** an anonymous link, also called an Anyone link, is created.
- **SecureLinkCreated and AddedToSecureLink:** a specific people link is created, and a person is added to it.

For external recipients, Microsoft describes a three-step method: export the results, split the AuditData column with the Power Query JSON transform in Excel, and filter the target user type to Guest. The object ID column names the shared item. Use this method for audits that your [compliance](https://www.m365.fm/entity/compliance/) team requests.

## Example: 38 records, one service account

This example uses invented numbers. A department reports that a budget workbook is missing 40 days after it was last used. The tenant has non-E5 licenses, so the audit retention is 180 days, and 40 is below 180. The admin searches the last 45 days, which is inside the maximum of 180, and enters the folder URL with a wildcard in the file, folder or site field.

- **Records in the folder:** 1,240.
- **After filtering on FileRecycled:** 38.
- **By a service account:** 31, from a cleanup app.
- **By people:** 7.

The check: 31 + 7 = 38. The missing workbook is among the seven records from people, and the user shows a colleague in the department. A FileRestored search finds nothing, so nobody has restored the file yet. The admin checks the recycle bin, restores the workbook from there and asks the cleanup app's owner why the app touches that folder. The 31 records from the service account would have hidden the real event if the admin had not filtered.

## Common mistakes

- **Searching only FileDeleted.** User deletions are often logged as FileRecycled, so search the recycle bin operations too.
- **Keeping the default seven days.** An older deletion needs a wider range, up to 180 days.
- **Using the keyword field for file names.** It searches only indexed content, so use the file, folder or site field.
- **Blaming the account.** A service account or an automation can be the acting user.
- **Waiting too long.** Retention is 180 days for most licenses, and the records disappear after that.

## How software can help

The Purview portal is enough for an occasional question. For repeated questions, a saved search, a PowerShell script or a reporting tool can save time. Judge any tool by whether it uses the same audit records, shows the retention period it can reach, and lets you export the evidence in a form your compliance team accepts.

## Next step

Run one test search today. Delete a test file, wait for 90 minutes, and search for who deleted the file in the SharePoint audit log, so you know which operations appear in your tenant before the next incident.
