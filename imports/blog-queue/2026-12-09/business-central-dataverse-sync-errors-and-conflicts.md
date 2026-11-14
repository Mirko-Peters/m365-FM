---
title: "Business Central and Dataverse Sync Errors and Record Conflicts: How to Resolve Them"
summary: "Fix failed or conflicting synchronization between Business Central and Dataverse: read the sync errors, set conflict rules on table mappings, check couplings, privileges and job queues. Also clarifies where dual-write fits, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [dynamics-365-business-central, dataverse, dual-write]
keypoints:
  - "Microsoft Learn describes dual-write as bidirectional integration between finance and operations apps and Dataverse. The page read does not mention Business Central."
  - "Business Central syncs with Dataverse through integration table mappings and job queue entries. Check the Coupled Data Synchronization Errors and Integration Synchronization Errors pages."
  - "Set Resolve Update Conflicts and Resolve Deletion Conflicts on the table mapping, then choose Retry All to resolve existing conflicts."
  - "Typical setup errors include a missing privilege on the integration user, a dependent record that is not coupled, and Dataverse administration mode."
  - "Bidirectional jobs sync Business Central to Dataverse first, then Dataverse to Business Central, so run order and dependencies matter."
faq:
  - q: "Does Business Central use dual-write to sync with Dataverse?"
    a: "The Microsoft Learn dual-write overview describes dual-write as tightly coupled, bidirectional integration between finance and operations apps and Dataverse. It does not mention Business Central. Business Central's own documentation describes synchronization through integration table mappings and job queue entries, so check which integration you actually run."
  - q: "Where do I see synchronization errors in Business Central?"
    a: "Microsoft Learn names the Integration Synchronization Errors page for setup errors and the Coupled Data Synchronization Errors page for errors on coupled records. The Integration Synchronization Log shows a Failed count per job, and Show Error Call Stack gives diagnostic detail to include in a support request."
  - q: "How do I resolve a conflict where a record changed in both apps?"
    a: "On the Coupled Data Synchronization Errors page, Learn says the Synchronize action tries to resolve a conflict where data changed in both apps and lets you choose which data to use. You can also set the Resolve Update Conflicts column on the integration table mapping and then choose Retry All."
  - q: "Why does synchronization not run at all?"
    a: "Learn lists Dataverse administration mode as one cause, because data synchronization does not run in environments in administration mode. It also notes that a job queue entry can show On Hold Due to Inactivity after a run without changes, and that Business Central changes reactivate it but Dataverse changes do not."
---

If synchronization between Business Central and Dataverse fails or throws conflicts, start on the **Integration Synchronization Errors** and **Coupled Data Synchronization Errors** pages. They show whether the problem is a setup error, such as a missing privilege, or a record error, such as a change made in both apps. One point first: the term "dual-write" is often used for this scenario, but the Microsoft Learn page read for this article ties dual-write to finance and operations apps, not Business Central.

## Which integration do you have?

Microsoft Learn describes dual-write as an infrastructure for tightly coupled, bidirectional integration between finance and operations apps and Dataverse. It lists synchronization with play, pause and catchup modes, a combined view of activity and error logs, and custom alerts. The page does not mention Business Central.

Business Central's own documentation describes a different mechanism: integration table mappings that define which Business Central table syncs with which Dataverse table, run by job queue entries. This article covers that mechanism. If you run dual-write between finance and operations apps and Dataverse, its error handling lives in the dual-write documentation instead. The pages read here do not describe "deadlocks" as a documented error category, so the steps below focus on the documented errors and conflicts.

## Step 1: Find the errors

- **Integration Synchronization Errors.** Use search (`Alt`+`Q`) and open it to see setup errors. Learn says setup errors typically need an administrator.
- **Coupled Data Synchronization Errors.** Learn says users can usually resolve coupled record errors themselves. They often result from deleting data in one app but not both.
- **Integration Synchronization Log.** Open it from search, then check the **Failed** column and select the number to see errors. From **Integration Table Mappings** you can also choose **Integration Synch. Job Log**.
- **Show Error Call Stack** on the errors page gives details for diagnosis. Include them in a support request.

## Step 2: Fix common setup errors

Microsoft Learn's troubleshooting table lists these:

| Issue | Documented resolution |
|---|---|
| Integration user missing a privilege (error text names a privilege) | Find the integration user on **Dataverse Connection Setup**, sign in to Dataverse as an administrator and edit that user's security role. |
| A record references an uncoupled record, such as a customer with an uncoupled currency | Couple the dependent record first, then retry. |
| Connection paused during sync after a session timeout | Refresh the page. For code issues, contact your Microsoft partner or support and use **Copy details**. |
| Only System Administrator or System Customizer roles can sign in | Disable administration mode. |
| Synchronization does not run in a Dataverse environment in administration mode | Disable administration mode. |

The page also offers **Delete Entries Older than 7 Days** and **Delete All Entries** to clean up the error list after fixing a cause that affected many records. Learn cautions that these can remove errors that still matter.

## Step 3: Resolve record conflicts

On the **Coupled Data Synchronization Errors** page, Learn describes these actions:

- **Retry** and **Retry All**: for each record with an error, synchronization is skipped until you fix the issue. Retry includes the record in the next run.
- **Synchronize**: tries to resolve a conflict where data changed in both apps. You choose which data to use.
- **Restore Records** and **Delete Records**: useful when a record was deleted in one app. Restore recreates it where it was deleted, and Delete removes it where it still exists.
- **Remove Coupling**: stops the records from synchronizing until you couple them again.

## Step 4: Set automatic conflict rules

Open **Integration Table Mappings** from search. Learn says the **Resolve Deletion Conflicts** column lets Business Central automatically restore deleted records, remove the coupling or do nothing. The **Resolve Update Conflicts** column lets it automatically send an update to the integration table, get an update from the integration table or do nothing. If you do nothing, you must resolve conflicts manually. After choosing a strategy, select **Retry All** on the Coupled Data Synchronization Errors page.

An archived Microsoft release plan note adds that synchronization recognizes conflicts better, enforces business rules for unidirectional field mappings and detects changes only in fields with bidirectional mappings. Because that page is archived, treat it as background.

New field mappings added to an existing mapping are disabled by default. Choose **Edit List** to enable them.

## Step 5: Check the schedule and the order

Learn lists the default job queue entries, in the order they run to avoid coupling dependencies: currency, vendor, contact, customer and salespeople. Bidirectional jobs sync Business Central to Dataverse first, then Dataverse to Business Central. Later runs update only records modified or added after the last successful run.

If a job found no changes in its last run, its status can show **On Hold Due to Inactivity**. It reactivates when changes happen in Business Central, but not when changes happen in Dataverse. If data seems stuck after changes only in Dataverse, check this status on the **Job Queue Entries** page.

By default **Sync. Only Coupled Records** is selected. Clear it on the table mapping if uncoupled rows should create new coupled records.

## What the pages read do not cover

They do not describe locking or deadlock behavior, a restart procedure for a stopped job queue entry, or the full list of Direction values. Before you change mapping rules in production, test on a sandbox environment, because mapping and conflict settings affect every user of that integration.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Dual-write](https://www.m365.fm/entity/dual-write/)

## Sources

- [Microsoft Learn: Troubleshoot synchronization between Business Central and Dataverse](https://learn.microsoft.com/en-us/dynamics365/business-central/admin-troubleshoot-sales-synchronization)
- [Microsoft Learn: View the status of a synchronization](https://learn.microsoft.com/en-us/dynamics365/business-central/admin-how-to-view-synchronization-status)
- [Microsoft Learn: Modify table mappings for synchronization](https://learn.microsoft.com/en-us/dynamics365/business-central/admin-how-to-modify-table-mappings-for-synchronization)
- [Microsoft Learn: Scheduled synchronization using job queue entries](https://learn.microsoft.com/en-us/dynamics365/business-central/admin-scheduled-synchronization-using-the-synchronization-job-queue-entries)
- [Microsoft Learn: Dual-write overview](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/dual-write-overview)
- [Microsoft Learn release plan: Fewer synchronization conflicts between Business Central and Dataverse](https://learn.microsoft.com/en-gb/dynamics365-release-plan/2020wave2/smb/dynamics365-business-central/integrate-business-central-microsoft-dataverse-fewer-synchronization-conflicts)
