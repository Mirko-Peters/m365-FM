---
title: "Connect On-Premises SQL Server to a Fabric Lakehouse: Gateway, Connection and Copy Pipeline Steps"
summary: "Step by step: install the on-premises data gateway, create a SQL Server connection in Fabric, copy tables into a lakehouse with a pipeline or copy job, and the gateway, authentication and destination settings Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [fabric, fabric-lakehouse, fabric-data-pipelines, on-premises-data-gateway]
keypoints:
  - "Fabric pipelines need an on-premises data gateway of version 3000.214.2 or later and outbound access to *.frontend.clouddatahub.net."
  - "Create the connection under Manage connections and gateways, choose On-premises, and use Windows authentication, which is available only through a gateway."
  - "Copy data in a pipeline reads SQL Server as a source only. Copy job supports SQL Server as source and destination and several load modes."
  - "In the lakehouse destination, Tables is the managed area. Choose Append, Overwrite or Upsert as the table action."
  - "Local access to the gateway machine is not allowed in pipelines."
faq:
  - q: "Which gateway version do Fabric pipelines need?"
    a: "According to Microsoft Learn, you need an on-premises data gateway version 3000.214.2 or later to support Fabric pipelines. The gateway machine must also allow outbound connections to *.frontend.clouddatahub.net."
  - q: "Which authentication works for on-premises SQL Server?"
    a: "The SQL Server connector overview lists Basic, Organizational account and Windows authentication for pipelines. Windows authentication is available only through an on-premises gateway. Service principal authentication applies only to SQL Server on Azure VMs."
  - q: "Should I use a pipeline or a copy job?"
    a: "Learn describes both. A pipeline copy activity supports SQL Server as a source only. A copy job supports SQL Server as source and destination, and its load modes include full load, incremental load, append, override, upsert and CDC. The pages I read do not recommend one over the other, so choose by the load mode you need."
  - q: "What does Overwrite do to a lakehouse table?"
    a: "Learn says Overwrite replaces the table's data and schema. Previous versions remain in the Delta log and can be read with Delta Lake time travel. Append adds rows, and Upsert inserts new rows and updates existing ones using key columns."
---

To load an on-premises SQL Server database into a Fabric lakehouse you need three things: an on-premises data gateway that can reach the server, a connection in Fabric that uses that gateway, and a pipeline or copy job that writes to the lakehouse. This article lays out the steps and the settings Microsoft documents.

## What you need first

From the Learn article on accessing on-premises data in Fabric Data Factory:

- An on-premises data gateway installed in your local network.
- Gateway version **3000.214.2 or later** for Fabric pipelines.
- You sign in to the gateway with your user account, after which it is ready to use.
- A firewall rule that allows outbound connections to **\*.frontend.clouddatahub.net** from the gateway.

The article does not describe the database permissions the SQL Server login needs, so agree those with your DBA. A read-only login on the source tables is a sensible principle, but it is not stated in the pages I read.

## Step 1: Create the connection

1. In the Fabric portal, select the settings gear at the top right.
2. Choose **Manage connections and gateways**.
3. In **New connection**, select **On-premises**.
4. Enter the gateway cluster, the resource type and the remaining details.
5. Choose the authentication method.

The SQL Server connector overview lists these for pipelines: Basic, Organizational account, service principal and Windows. Windows authentication is only available through an on-premises gateway, so it is the relevant option here. Service principal authentication applies only to SQL Server on Azure VMs.

## Step 2: Copy the data with a pipeline

1. In your workspace, create a pipeline.
2. On the **Home** tab select **Copy data**, then **Use copy assistant**.
3. On **Choose data source**, add a new source and select the connection you created.
4. Select the lakehouse as the destination.
5. Select **Run** in the pipeline editor.

In pipelines, the SQL Server connector supports the copy activity as a source only, plus the Lookup, Get Metadata, Script and Stored procedure activities.

## Alternative: Use a copy job

A copy job is also documented. Select **New item** and then **Copy job**. On **Choose data source**, go to **New sources** and select **SQL Server**. Enter the connection details, and the gateway connection is filled in automatically. Choose the destination, review the mapping and settings, then select **Save + Run** on **Review + Save**.

Copy job supports SQL Server as source and destination. Its load modes are full load, CDC, incremental load, append, override, upsert and CDC merge. If you need recurring incremental loads, review these modes before you build a pipeline by hand.

## Step 3: Configure the lakehouse destination

The lakehouse destination page describes these settings:

**Root folder.** Choose **Tables** (managed) or **Files** (unmanaged).

For **Tables**:

- **Table:** pick an existing table or type a new name. In a schema-enabled lakehouse, use schema.table. Without a schema the service uses dbo.
- **Table action:** **Append** adds rows. **Overwrite** replaces data and schema, and earlier versions stay in the Delta log for time travel. **Upsert** inserts and updates, and needs one or more key columns.
- **Partitioning (advanced):** writes a folder structure such as year=2000/month=01. Supported partition column types are string, integer, boolean and datetime. Partition columns cannot overlap with key columns.
- **Apply V-Order (advanced):** on by default.

For **Files**, you choose a path and a format such as Parquet, Delimited text, JSON or others. Copy behavior options apply when the source is file-based, which does not describe a SQL Server source.

Table name rules from the same page: at least one character, no slash or backslash, no trailing dot and no leading or trailing spaces. If source columns have special characters or spaces, use Delta column mapping with delta.columnMapping.mode set to name. The service can create such tables automatically for Append or Overwrite.

## Limits and gotchas

- **Gateway machine access:** local access to the machine with the gateway installed is not allowed in pipelines.
- **Firewall:** pipelines need outbound access to \*.frontend.clouddatahub.net. A missing rule is an obvious first check when the run cannot start.
- **Private link:** for a workspace with a private link and an on-premises data gateway version 3000.286.12 or later, add \*.dfs.fabric.microsoft.com to the gateway's allow list so the connector can reach OneLake.
- **Decimal source columns:** editing the destination column type is not supported.
- **Binary format:** mapping is not supported.

## A short test plan

1. Create the connection and use the connection test in the dialog if available.
2. Copy one small table to a new lakehouse table with Overwrite.
3. Check the row count and column types in the lakehouse.
4. Change to Append or Upsert for the production table, with key columns if needed.
5. Schedule the pipeline only after a full run succeeds.

## Common mistakes

- Using an old gateway version that does not support pipelines.
- Choosing Service principal for an on-premises SQL Server.
- Forgetting the outbound firewall rule for the pipeline service.
- Writing to Files when you wanted a Delta table in Tables.
- Using Overwrite on a table that downstream reports read during the run.

## What the pages I read do not cover

The articles do not cover virtual network gateway support for this scenario, the permissions of the SQL Server login or throughput tuning. Treat those as questions for the connector reference pages and your own tests.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Fabric Data Pipelines](https://www.m365.fm/entity/fabric-data-pipelines/)
- [On-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/)

## Sources

- [Microsoft Learn: How to access on-premises data in Data Factory for Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-factory/how-to-access-on-premises-data)
- [Microsoft Learn: SQL Server database connector overview](https://learn.microsoft.com/en-us/fabric/data-factory/connector-sql-server-database-overview)
- [Microsoft Learn: Configure Lakehouse in a copy activity](https://learn.microsoft.com/en-us/fabric/data-factory/connector-lakehouse-copy-activity)
