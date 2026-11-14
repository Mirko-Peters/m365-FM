---
title: "Troubleshoot Dynamics 365 Finance data export to Fabric, Synapse Link and Direct Lake"
summary: "A checklist for missing tables, stuck sync status, unauthorized errors and slow Direct Lake reports when you export Dynamics 365 finance and operations data with Fabric link or Azure Synapse Link."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [dynamics-365, azure-synapse-analytics, fabric, power-bi]
keypoints:
  - "Finance and operations tables are not auto-selected when you create a Fabric link. Open Manage tables on the Microsoft OneLake profile and add them."
  - "Kernel tables refresh once a day, so InitialSyncInProgress for them is expected and does not mean the sync is stuck."
  - "An Unauthorized error in Fabric often traces back to the data connection that the link wizard created with the creator's credentials."
  - "Direct Lake has guardrails per Fabric SKU. When they are exceeded, Direct Lake on SQL can fall back to DirectQuery, while Direct Lake on OneLake fails the refresh."
  - "Learn says Export to Data Lake was scheduled to stop permanently on November 30, 2026, so remaining pipelines need a move to Fabric link or Synapse Link."
faq:
  - q: "Why are my finance and operations tables missing after I created a Fabric link?"
    a: "Microsoft Learn's Fabric troubleshooting page says the link auto-selects only nonsystem tables with change tracking set to Yes, and that finance and operations tables are not auto-selected. Open the Microsoft OneLake profile in Synapse Link, select Manage Tables, and add the tables you need."
  - q: "Is a kernel table stuck if it shows InitialSyncInProgress?"
    a: "Not necessarily. The Fabric link FAQ on Microsoft Learn explains that kernel tables do not take part in ongoing incremental sync. A job refreshes them daily, so the interface shows InitialSyncInProgress, which the page says is expected and does not indicate a stuck sync."
  - q: "What does the error 'Unauthorized. Access to target location ... denied' mean?"
    a: "Learn links this to the data connection that the Link to Fabric wizard creates with the creator's credentials. It lists a changed or expired password, an inactive creator account, or other users lacking access to the connection. The fix is to share the data connection with the users who need access."
  - q: "How often does data arrive in Fabric?"
    a: "The Fabric link FAQ says incremental updates typically take up to one hour to appear, depending on table size, update volume, number of tables and system load. After a schema change, metadata can take up to one hour to propagate, and delta sync operations may fail intermittently during that time."
  - q: "Why would a Direct Lake report become slow after the export works?"
    a: "Microsoft Learn describes DirectQuery fallback and capacity guardrails. If a table exceeds the Parquet file, row group or row limits for your Fabric SKU, Direct Lake on SQL can fall back to DirectQuery with slower queries. Direct Lake on OneLake fails the refresh instead until the Delta tables are optimized."
---

Most export problems with Dynamics 365 finance and operations data come from four places: table selection, change tracking, the data connection behind the link, and the Direct Lake model on top. Work through them in that order. Start by confirming which export service you actually use, because the Learn pages treat Fabric link and Azure Synapse Link differently.

## Know which service you use

Microsoft Learn's transition FAQ says Link to Fabric and Azure Synapse Link for Dataverse both remain supported. It also says the older Export to Data Lake service was retired on November 1, 2024 and would stop permanently on November 30, 2026, with no extensions after that date. If a pipeline still depends on Export to Data Lake, it no longer exports new and changed data. Files already exported stay in place. The FAQ recommends Link to Fabric for Power BI and Fabric users.

## Step 1: Missing finance and operations tables

The Fabric troubleshooting page explains that a new Fabric link auto-selects only nonsystem tables with **Change tracking** set to Yes. Finance and operations tables are not auto-selected.

1. In Power Apps (make.powerapps.com), open **Synapse Link**.
2. Open the **Microsoft OneLake** profile.
3. Select **Manage Tables** and add the finance and operations tables.

For Azure Synapse Link, Learn lists extra prerequisites. You need a finance and operations sandbox (Tier-2) or higher environment, or one built from an ERP template. Supported versions include 10.0.38 (PU62) with cumulative update 7.0.7120.59 or later. You must enable the Delta lake feature in the Synapse Link profile, and you cannot add finance and operations tables to an existing profile that contained Dataverse tables, so you create a new profile.

## Step 2: Change tracking and unsupported tables

Learn states that custom tables need change tracking enabled. Enabling it can fail, or the **Track changes** checkbox can be disabled, for some tables. The page points to the **Data entity row version change tracking validation report** in finance and operations apps.

Some content is not exported at all: special fields such as `TimeZoneID` and binary fields, and staging, temporary and deprecated tables whose names begin with `del_`. Memo fields of type `nVarchar(Max)` are truncated to 2,000 characters. Derived tables do not include fields from the base table, so select the base table too.

## Step 3: A sync that looks stuck

- **Kernel tables.** `InitialSyncInProgress` is expected, because a daily job refreshes them.
- **Unidentified tables.** In the lakehouse, tables show as unidentified until the initial sync finishes. If it persists for several hours, select the OneLake or Synapse Link profile and choose **Refresh Fabric Links**.
- **Error state.** For Synapse Link, check the Dataverse table **Synapse Link Profile Entity State** and its `InitialSyncState` field. An **Error** status means the sync paused. To reinitialize a table, delete it from the profile and add it again.
- **After a restore.** Learn says tables in a Synapse Link profile need reinitializing when a finance and operations database is restored, and Dataverse restore removes the enabled entities.
- **Schema changes.** Changing the data type or precision of a synced column is not supported and causes permanent delta sync failures. Remove and re-add the table.

## Step 4: Authorization and connection errors

If users see **Unauthorized. Access to target location ... denied**, or **Refresh Fabric tables** fails with a message that the connection ID is not valid for this user, look at the data connection. The wizard creates it with the creator's credentials. Learn lists these causes:

- The creator's password changed or expired.
- The creator's account is inactive.
- The user lacks access to the data connection.
- The connection was deleted or its creator no longer exists. It cannot be repaired in that case. Unlink the Fabric link and create it again.

Other creation errors have tenant-setting causes. For example, workspace creation needs the Power BI admin setting **Create workspaces**, and you need the Dataverse **system administrator** role. Power BI Premium Per User is not sufficient, so a Fabric or Premium capacity is required.

Known limits include a maximum of 2,000 change-tracking-enabled tables, and a 200 MiB cap on the uncompressed size of a single record.

## Step 5: Direct Lake reports

Direct Lake reads Delta tables from OneLake into memory. Learn lists guardrails per Fabric SKU, for example F64 allows 5,000 Parquet files and 1,500 million rows per table. If a query exceeds a guardrail:

- **Direct Lake on SQL** falls back to DirectQuery if fallback is enabled. Queries return results but more slowly.
- **Direct Lake on OneLake** fails the refresh until the Delta tables are optimized.

The behavior is controlled by the semantic model property **Direct Lake behavior**. SQL views and SQL-based granular access control also cause fallback in Direct Lake on SQL. For table health, Learn recommends V-Order, few Parquet files, and row groups of 1 to 16 million rows. Running optimization invalidates in-memory segments and causes a short cold-state penalty, and vacuum must keep the Delta version that the framed model references.

## What the pages do not say

The Learn pages I read do not describe a dedicated Direct Lake setup for finance and operations data, and the Fabric link page does not list steps for building the semantic model. Check your own environment against the tenant and capacity settings before you open a support case.

## Related

- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)
- [Azure Synapse Analytics](https://www.m365.fm/entity/azure-synapse-analytics/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Troubleshoot Link to Microsoft Fabric](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/fabric-troubleshoot)
- [Fabric link FAQ](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/fabric-link-faq)
- [Select finance and operations tables in Azure Synapse Link](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-select-fno-data)
- [Azure Synapse Link transition FAQ](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-transition-faq)
- [Direct Lake overview](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview)
- [Understand Direct Lake query performance](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-understand-storage)
