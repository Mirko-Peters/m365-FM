---
title: "Reduce Dataverse Storage Use: See Capacity, Find Large Tables and Free Up Space"
summary: "Check Dataverse capacity in the Power Platform admin center, find which tables use database, file or log storage, and the cleanup options Microsoft Learn names: storage advisor, bulk delete, long-term retention, environment deletion, pay-as-you-go and capacity extension."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [dataverse, power-platform-admin-center]
keypoints:
  - "Open the Power Platform admin center, then Licensing, then Capacity add-ons or Dataverse. Environment Details show actual database, file and log use and the top tables."
  - "Dataverse has three storage types. The Log type includes AuditBase and PlugInTraceLogBase, and Attachment and AnnotationBase count toward file and database storage."
  - "Learn names deleting unused data, deleting unwanted environments, buying capacity, pay-as-you-go, a capacity extension and, in the storage advisor preview, archival policies."
  - "A capacity extension adds 25 percent, based on capacity used, for 45 days. Learn allows up to three requests in the last 365 days."
  - "Restore, copy, create and recover need at least 1 GB of available capacity, so they can be blocked even when the tenant is not over its overall position."
faq:
  - q: "Where do I see how much Dataverse storage I use?"
    a: "According to Microsoft Learn, in the Power Platform admin center under Licensing, Capacity add-ons for the summary, or under Licensing, Dataverse. The Dataverse tab and its Details button show database, file and log use by environment and the top tables."
  - q: "What counts as log storage?"
    a: "Learn lists AuditBase, PlugInTraceLogBase and elastic tables as log. Attachment, AnnotationBase, tables with file or image columns, WebResourceBase and RibbonClientMetadataBase are file and database. All other tables are database only."
  - q: "How do I free up space?"
    a: "Learn names freeing up storage, deleting unwanted environments, buying more capacity and pay-as-you-go. In the storage advisor preview you can create an archival policy or run a bulk delete. The separate Free up storage space page lists methods such as deleting audit logs, removing email and note attachments, and cleaning up bulk import, workflow and bulk deletion system jobs."
  - q: "What happens when I exceed capacity?"
    a: "Tenant admins get notifications when less than 15 percent or less than 5 percent of a capacity type remains and when capacity is exceeded after borrowing. Creating, copying, restoring, recovering and converting environments, and adding a Dataverse database, can become unavailable when the required capacity type has too little space. Learn says exceeding entitlements currently does not affect service availability and data stays durable, but the licensing terms allow Microsoft to suspend the service after reasonable notice."
  - q: "Do trial environments count?"
    a: "No. Learn says trial, preview, support and developer environments do not count, and the Teams and Trial tabs show usage that does not count toward Dataverse usage."
---

Dataverse storage is tracked as database, file and log capacity. This guide follows the Microsoft Learn page on capacity-based storage, the page on freeing up storage space, the capacity extension page and the capacity-based storage overview.

## See your capacity

1. Sign in to the Power Platform admin center.
2. Select **Licensing**, then **Capacity add-ons**. The Summary tab shows storage by type and by source, plus the top environments by usage. Roles needed: tenant admin, Power Platform admin or Dynamics 365 admin.
3. For per-environment numbers, use the **Dataverse** tab and select **Details**, or go to **Licensing**, then **Dataverse** under Products.

Details show actual database, file and log use, with the top tables and their growth over time. In Licensing, Dataverse, the consumption per table grid can be filtered by Database, File or Log, and a table's trend covers up to the past three months.

## Which tables are which

| Storage type | Tables |
| --- | --- |
| File and database | Attachment, AnnotationBase, tables with file or image (full size) columns, tables ending in Analytics used by Insights applications, WebResourceBase and RibbonClientMetadataBase |
| Log | AuditBase, PlugInTraceLogBase and elastic tables |
| Database only | All other tables |

Database storage includes row data and indexes. Quick Find lookups add indexes, which you can reduce by removing unneeded columns or tables, or by excluding multiline text columns. Dataverse search stores indexes in the DataverseSearch table, billed at the database capacity rate. Learn warns not to turn Dataverse search off, because dependent generative AI experiences are affected.

## Cleanup options on the page

- Free up storage, delete unwanted environments or buy more capacity. The overview page also names deleting unused data.
- In the Dataverse storage advisor (preview), review cleanable data per table and either create an archival policy, run a bulk delete or adjust environment allocation.
- Buy capacity of the matching type, since file capacity cannot resolve a database deficit.
- In Manage capacity you can draw from the tenant pool or link the environment to a pay-as-you-go billing plan, where any overage is charged to the associated Azure subscription.

## Methods from the Free up storage space page

That page describes 15 methods and warns that deleted data cannot be restored. The system can take up to 72 hours to update storage information, so wait before judging the result.

- **File:** remove email attachments with Advanced Find, remove emails with attachments or notes with attachments with a bulk deletion job, and delete audit logs. The new audit process is under Auditing, Free up capacity, Delete audit logs, by table, by access type or up to a date, and runs as a system job that can take up to 72 hours.
- **Database:** delete bulk email and workflow instances, evaluate suspended workflows, delete duplicate detection jobs, delete bulk import instances and bulk deletion job instances, remove unrequired tables and columns from Dataverse search, remove unrequired activity and Activity Feeds records, change Item Level Monitoring settings and remove unrequired trace (alert) records.
- **Log:** delete plug-in trace logs with a bulk deletion job.

The page also notes that storage consumption does not match the size shown in the app, because metadata and encryption add storage.

## Allocate capacity to an environment

Go to **Licensing**, **Dataverse**, **Summary**, **Manage capacity**, select the environment, enter Database, File and Log values, optionally opt in to alerts and save. Allocation moves capacity from the tenant pool and does not change the tenant total.

## What blocks first

Create, copy, restore, convert trial to paid and recover need at least 1 GB available in the native storage type. Notifications use borrowing, so these operations can be blocked even when the report shows no deficit. Borrowing flows only Database to Log to File.

| Notification tier | Trigger |
| --- | --- |
| Approaching limit | Less than 15 percent of a capacity type available after borrowing |
| Admin operations could be impacted | Less than 5 percent available |
| Final tier | Allocated capacity exceeded after borrowing |

Tenant admins, Power Platform admins and Dynamics 365 admins receive these emails weekly, and there is no opt-out. For capacity allocated to an environment, the FAQ says only soft enforcement through email is on, with notifications starting above 85 percent of the allocated capacity.

## Capacity extension

Go to Licensing, Dataverse, Summary and select Enable capacity extension, review the overage details and confirm. The extension applies at tenant level, adds 25 percent calculated on capacity used for each capacity type, and lasts 45 days. The overview page says you can request it after 80 percent overall consumption, up to three times in the last 365 days and after an existing extension has expired. During the extension admins can create, copy and restore environments. Afterwards copying and restoring are blocked again if the tenant has no available capacity.

## Notifications and extras

Banners appear in Dataverse-only tenants when any capacity type has less than 15 percent remaining or is exceeded after borrowing. If a user dismisses the banner and less than 15 percent is still left, it reappears after seven days, or on every refresh in model-driven apps. Every environment consumes 1 GB, whether or not it has a database. Default, production and sandbox environments count toward consumption, while trial, preview, support and developer environments do not.

## Not covered

The capacity page does not give per-table cleanup steps or the org-level default entitlement amounts from sign-up. The default environment includes 3 GB database, 3 GB file and 1 GB log.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Dataverse capacity-based storage details (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/capacity-storage)
- [Free up storage space (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/free-storage-space)
- [Extend Dataverse capacity for 45 days (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/extend-capacity)
- [Dataverse capacity-based storage overview (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/whats-new-storage)
