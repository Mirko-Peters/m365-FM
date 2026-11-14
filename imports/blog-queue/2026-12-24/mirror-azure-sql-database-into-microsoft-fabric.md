---
title: "Mirror an Azure SQL Database Into Microsoft Fabric: Prerequisites and Steps"
summary: "Set up Fabric mirroring for Azure SQL Database: tenant settings, managed identity, database permissions, networking, the portal steps to create a mirrored database, monitoring replication and known limits."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [fabric-mirroring]
keypoints:
  - "Mirroring creates a read-only, continuously replicated copy of Azure SQL Database data in OneLake. A paused or deleted Fabric capacity stops replication."
  - "Enable the tenant settings Service principals can call Fabric public APIs and Users can access data stored in OneLake with apps external to Fabric."
  - "Turn on the system-assigned managed identity of the logical server and make it the primary identity. Create a login and user with SELECT, ALTER ANY EXTERNAL MIRROR and two VIEW permissions."
  - "Create the item through Create > Data Warehouse > Mirrored Azure SQL Database, connect, keep Mirror all data or pick tables, then Mirror database."
  - "Wait 2 to 5 minutes, then Monitor replication. Source granular security must be reconfigured on the mirrored copy."
faq:
  - q: "What is mirroring for Azure SQL Database?"
    a: "Microsoft Learn describes it as creating a read-only, continuously replicated copy of your Azure SQL Database data in OneLake. You can use that copy in Fabric analytics scenarios."
  - q: "Which tenant settings must be enabled?"
    a: "Two: Service principals can call Fabric public APIs, and Users can access data stored in OneLake with apps external to Fabric."
  - q: "What database permissions are needed?"
    a: "Learn shows creating a login in the master database and a mapped user in the database to mirror, then granting SELECT, ALTER ANY EXTERNAL MIRROR, VIEW DATABASE PERFORMANCE STATE and VIEW DATABASE SECURITY STATE. It also covers Entra, service principal and workspace identity logins."
  - q: "What workspace role do I need?"
    a: "Member or Admin. Learn says Contributors cannot complete the step that grants the server's managed identity Read and write permission on the mirrored database."
  - q: "What stops replication?"
    a: "A paused or deleted Fabric capacity stops replication, according to the page. Keep the capacity running."
---

Fabric mirroring keeps a read-only copy of an Azure SQL Database in OneLake, updated continuously, without building a pipeline. This guide follows Microsoft Learn's tutorial and lists the prerequisites that most often block the first run.

## What mirroring gives you

A read-only, continuously replicated copy of your Azure SQL Database data in OneLake. It works with a single database or one in an elastic pool. Learn suggests using a copy or test database where possible.

## Prerequisites

- **Fabric capacity:** an active, running capacity. A paused or deleted capacity stops replication. A Fabric trial works if you have no capacity.
- **Tenant settings:** enable both **Service principals can call Fabric public APIs** and **Users can access data stored in OneLake with apps external to Fabric**.
- **Workspace role:** Member or Admin. Contributors can't complete the step that grants the server's managed identity Read and write permission on the mirrored database.
- **Managed identity:** enable the system-assigned managed identity on the logical server. Under **Security**, select **Identity** and set **System assigned managed identity** **Status** to **On**. It must be the primary identity. Check with `SELECT * FROM sys.dm_server_managed_identities;`.
- **Database principal:** create a login in `master` and a mapped user in the database to mirror.

```sql
-- in master
CREATE LOGIN [fabric_login] WITH PASSWORD = '<strong password>';
-- in the user database to be mirrored
CREATE USER [fabric_user] FOR LOGIN [fabric_login];
GRANT SELECT, ALTER ANY EXTERNAL MIRROR, VIEW DATABASE PERFORMANCE STATE, VIEW DATABASE SECURITY STATE TO [fabric_user];
```

The page also covers Microsoft Entra, service principal and workspace identity logins.

- **Networking:** if the database isn't publicly accessible and doesn't allow Azure services, use a virtual network data gateway or an on-premises data gateway, and confirm connectivity through a private endpoint or firewall rule.
- **Restricted OneLake access:** if inbound access is restricted, a workspace admin must add the server's Azure resource ID to the workspace's Resource Instance Rules.

## Create the mirrored database

1. Open the Fabric portal and pick or create a workspace.
2. Select the **Create** icon.
3. Under **Data Warehouse**, select **Mirrored Azure SQL Database**, enter a name and select **Create**.

## Connect to the database

1. Under **New sources**, select **Azure SQL Database**, or choose an existing connection from the OneLake hub.
2. For a new connection enter the **Server**, for example `server-name.database.windows.net`, and the **Database**. Choose **Create new connection**, the data gateway (default None or your gateway) and the **Authentication kind**: Basic (SQL authentication), Organization account, Service principal or Workspace identity.
3. Select **Connect**.

## Start mirroring

1. On **Configure mirroring**, **Mirror all data** is selected by default, and new tables created later are mirrored too. To choose tables, turn it off and select them.
2. Select **Mirror database**.
3. Wait 2 to 5 minutes, then select **Monitor replication**.

## Monitor replication

The status changes to **Running** when tables are synchronizing. A date in the **Last refresh** column appears when the initial copy finishes. After you configure mirroring, you land on the **Mirroring Status** page.

## Limits and notes

- The mirrored copy is read-only.
- Granular security from the source must be reconfigured in the mirrored database.
- A paused or deleted capacity stops replication.
- Tier and purchasing model support is on the separate Mirroring Azure SQL Database page, which I did not read.
- The tutorial doesn't document the SQL analytics endpoint.

## Checklist

1. Confirm the capacity is running and the tenant settings are on.
2. Enable the managed identity and verify it is primary.
3. Create the login and user with the four permissions.
4. Check networking and OneLake access rules.
5. Create the item, connect and select tables.
6. Check **Monitor replication** after a few minutes.

## If replication does not start

The tutorial does not include a dedicated troubleshooting section, so the following order is a suggestion built from the prerequisites above, not a Microsoft procedure.

1. Check that the Fabric capacity is running, because a paused or deleted capacity stops replication.
2. Check that both tenant settings are enabled and that your workspace role is Member or Admin.
3. Run the managed identity query on the server and confirm the system-assigned identity is the primary one.
4. Confirm the database user holds all four permissions listed in the SQL example.
5. Check the gateway, private endpoint or firewall rule if the database is not publicly accessible.

Work through these in order before you recreate the mirrored item.

## Related

- [Fabric mirroring](https://www.m365.fm/entity/fabric-mirroring/)

## Sources

- [Tutorial: Configure Microsoft Fabric mirrored databases from Azure SQL Database](https://learn.microsoft.com/fabric/mirroring/azure-sql-database-tutorial)
