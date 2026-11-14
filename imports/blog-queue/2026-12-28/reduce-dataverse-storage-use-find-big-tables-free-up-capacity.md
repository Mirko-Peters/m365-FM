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
  - "Learn lists removing data and apps, removing unused environments, data governance policies, long-term retention, purchasing capacity, pay-as-you-go and a capacity extension."
  - "A capacity extension is 25 percent of consumption for up to 45 days, with up to three requests in any 365 day period."
  - "Restore, copy, create and recover need at least 1 GB of available capacity, so they can be blocked even when the tenant is not over its overall position."
faq:
  - q: "Where do I see how much Dataverse storage I use?"
    a: "According to Microsoft Learn, in the Power Platform admin center under Licensing, Capacity add-ons for the summary, or under Licensing, Dataverse. The Dataverse tab and its Details button show database, file and log use by environment and the top tables."
  - q: "What counts as log storage?"
    a: "Learn lists AuditBase, PlugInTraceLogBase and elastic tables as log. Attachment, AnnotationBase, tables with file or image columns, WebResourceBase and RibbonClientMetadataBase are file and database. All other tables are database only."
  - q: "How do I free up space?"
    a: "Learn names removing data and apps you no longer need, removing unused environments, data governance policies, long-term retention for inactive data, and, in the storage advisor preview, an archival policy or bulk delete. The page does not list audit log deletion or attachment removal as steps."
  - q: "What happens when I exceed capacity?"
    a: "Create, copy, restore and recover are blocked first. After 30 days unresolved, affected sandbox environments go to administration mode, and after 90 days sign-in to them is blocked. Production environments do not enter administration mode or become disabled."
  - q: "Do trial environments count?"
    a: "No. Learn says trial, preview, support and developer environments do not count, and the Teams and Trial tabs show usage that does not count toward Dataverse usage."
---

Dataverse storage is tracked as database, file and log capacity. This guide follows the Microsoft Learn page on capacity-based storage and keeps to the cleanup options it names. A separate Learn page on freeing up storage space exists, but I did not read it, so this article does not give step-by-step cleanup for individual tables.

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

- Remove data and apps you no longer need, and remove unused environments.
- Establish data governance policies in Dataverse (Power Platform admin center, Manage, Dataverse).
- Use long-term retention for eligible inactive data you must keep. Policy processing and reporting are not immediate.
- In the Dataverse storage advisor (preview), review cleanable data per table and either create an archival policy, run a bulk delete or adjust environment allocation.
- Buy capacity of the matching type, since file capacity cannot resolve a database deficit.
- Use pay-as-you-go for variable demand. Linking a sandbox environment removes overage restrictions, even if the tenant remains in overage.

## Allocate capacity to an environment

Go to **Licensing**, **Dataverse**, **Summary**, **Manage capacity**, select the environment, enter Database, File and Log values, optionally opt in to alerts and save. Allocation moves capacity from the tenant pool and does not change the tenant total.

## What blocks first

Create, copy, restore, convert trial to paid and recover need at least 1 GB available in the native storage type. Notifications use borrowing, so these operations can be blocked even when the report shows no deficit. Borrowing flows only Database to Log to File.

| Stage | When | Effect |
| --- | --- | --- |
| Early notification | Over 85 percent | Informational notifications |
| Restricted | First exceeds 100 percent | Create, copy, restore and recover blocked |
| Administration mode | 30 days unresolved | Affected sandboxes limited to administrators |
| Disabled | 90 days unresolved | Sign-in to affected sandboxes blocked |

Production environments and sandboxes with active pay-as-you-go do not enter administration mode or become disabled.

## Capacity extension

On the Dataverse Licenses page select Enable capacity extension. It applies at tenant level, can be requested after consumption exceeds 80 percent, and is granted for 25 percent of consumption for up to 45 days, with up to three requests in any 365 days. It is temporary.

## Notifications and extras

Banners and emails appear at less than 15 percent remaining, less than 5 percent remaining and when entitled capacity is exceeded after borrowing. Capacity is evaluated about every 24 hours, and a banner can take up to seven days to disappear after the issue is resolved. Every environment consumes 1 GB, whether or not it has a database. Reallocating capacity between environments does not resolve a tenant overage, because it only redistributes existing capacity. A tenant admin can exit administration mode for one affected sandbox at a time, but that does not resolve the overage or pause the timeline.

## Not covered

This page does not give audit log deletion or attachment removal steps, and it does not give the org-level default entitlement amounts from sign-up. The default environment includes 3 GB database, 3 GB file and 1 GB log.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Dataverse capacity-based storage details](https://learn.microsoft.com/power-platform/admin/capacity-storage)
