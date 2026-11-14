---
title: "How to Deploy Azure File Sync to Cache a File Server in Azure"
summary: "Deploy Azure File Sync step by step: prerequisites, storage sync service, agent install, server registration, sync group, cloud and server endpoints, cloud tiering policies, initial sync choices and documented limits."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [azure-file-sync, azure-files]
keypoints:
  - "Order of work: prepare the Azure file share, deploy a storage sync service, install the agent, register the server, create a sync group and add a server endpoint."
  - "Cloud tiering has two policies: Volume Free Space Policy and Date Policy. The Azure file share always keeps a complete copy."
  - "Server endpoints must be local paths. Mounted shares and NAS are not supported, and endpoints on the system volume cannot use cloud tiering."
  - "A server can register with only one storage sync service, and a sync group can have only one server endpoint per registered server."
  - "Changes made directly to the cloud endpoint can take up to 24 hours to be discovered."
faq:
  - q: "What do I need before I start?"
    a: "An Azure file share in the same region as the storage sync service with SMB 3.1.1, NTLM v2 and AES-128-GCM allowed, Allow storage account key access enabled, a supported Windows Server, .NET Framework 4.7.2 or later and the listed Windows updates. The registering admin needs Azure File Sync Administrator, Owner or Contributor on the sync service."
  - q: "What are the deployment steps?"
    a: "Deploy a storage sync service, install the Azure File Sync agent on the server, register the server, create a sync group (which creates the cloud endpoint) and add a server endpoint with cloud tiering and initial sync options."
  - q: "How does cloud tiering decide what to tier?"
    a: "Volume Free Space Policy reserves a share of free space on the volume. Date Policy tiers files not accessed for a set number of days. The Azure file share keeps a complete copy regardless."
  - q: "Can I use the system volume?"
    a: "A server endpoint on the system volume cannot use cloud tiering."
  - q: "How quickly are cloud changes picked up?"
    a: "Learn says changes made directly to the cloud endpoint can take up to 24 hours to be discovered, because change detection runs once every 24 hours per cloud endpoint."
---

Azure File Sync keeps a Windows file server and an Azure file share in sync, and cloud tiering turns the server into a cache for frequently used files. The deployment is a fixed sequence: share, sync service, agent, registration, sync group, server endpoint. This guide follows the Microsoft Learn deployment guide for Azure File Sync and reports only what that page states.

## Prerequisites

**Azure**

- An Azure file share in the same region as the storage sync service. The page requires a classic file share in the prerequisites yet also recommends provisioned v2 shares for new deployments. Check which applies before you start.
- Storage account SMB settings must allow SMB 3.1.1, NTLM v2 authentication and AES-128-GCM encryption.
- **Allow storage account key access** must be **Enabled** under **Configuration** in **Settings**.

**Windows Server**

- A supported Windows Server instance. The full list is on a separate page.
- .NET Framework 4.7.2 or later. Windows Server 2019 and later include it, and you verify it on 2016.
- Updates: KB5040562 for Windows Server 2016, and KB5005112 and KB5040430 for Windows Server 2019.
- For failover clusters, configure the **File Server for general use** role before installing the agent on each node. Only clustered disks are supported.
- PowerShell 5.1 or PowerShell 6 and later for PowerShell management.
- Turn off **Internet Explorer Enhanced Security Configuration** for administrators and users during initial registration. Skip this on Server Core.

**Permissions**

- The admin who registers the server and creates the cloud endpoint needs **Azure File Sync Administrator**, **Owner** or **Contributor** on the storage sync service.
- Without managed identity: the listKeys and ListAccountSas actions on the storage account. With managed identity: roles such as **Reader and Data Access** or **Storage File Data Privileged Contributor**.
- Read-only access to the storage account is not enough to create or update a cloud endpoint.

## Step 1: deploy the storage sync service

1. In the Azure portal select **Create a resource**, search for **Azure File Sync** and select **Create**.
2. On the **Deploy Storage Sync** tab enter **Name** (unique per region), **Subscription**, **Resource group** and **Location**.
3. Select **Create**.

## Step 2: install the agent

Download the agent from the Microsoft Download Center and run the MSI. Keep the default path `C:\Program Files\Azure\StorageSyncAgent`, set proxy settings if needed, choose Microsoft Update (recommended) and select **Install**. The **Server Registration** dialog opens when setup finishes. Azure File Sync needs Microsoft Update for the agent to update automatically.

## Step 3: register the server

In **Server Registration** choose your Azure environment, sign in, select the **Azure Subscription**, **Resource Group** and **Storage Sync Service**, and select **Register**. Cloud Solution Providers enable the CSP option and enter the tenant ID. You can reopen the dialog with `ServerRegistration.exe` in the agent folder.

## Step 4: create a sync group and cloud endpoint

1. Open the storage sync service and go to **Sync** > **Sync groups** > **Create a sync group**.
2. Enter a **Sync group name**, the **Subscription**, **Storage account** and **Azure File Share**.
3. Check that the group is **Healthy**.

The cloud endpoint is created with the sync group. If it does not appear, Learn says insufficient permissions may be the cause. Add it with **Add cloud endpoint**.

## Step 5: add a server endpoint

Open the sync group, select **Add server endpoint** and enter the **Registered Server**, the **Path** (folder, volume root or mount point such as `D:\Data`), the **Cloud Tiering** switch and the **Initial Sync** choice. Select **Create**.

**Cloud tiering policies**

- **Volume Free Space Policy:** free space to keep on the volume. With 50% on a volume with one server endpoint, about half the data tiers.
- **Date Policy:** files not read or written for the given number of days are tiered. The example uses 15 days.

**Initial sync choices.** For the first server endpoint, you either merge the server path with the share content (conflicts are stored side by side) or authoritatively overwrite the share with the server content. For additional endpoints, the choices cover downloading the namespace first and recalling content as space allows, downloading the namespace only, or avoiding tiered files.

## Limits and caveats

- A server registers with only one storage sync service. Servers in different services cannot sync with each other.
- A sync group has only one server endpoint per registered server.
- Server endpoints must be local paths. Mounted shares and NAS are not supported.
- A system volume endpoint cannot use cloud tiering.
- You cannot change a server endpoint's path or drive letter after creation.
- Cloud-side changes can take up to 24 hours to be discovered.
- Do not use or delete the `.SystemShareInformation` folder.
- Azure File Sync takes a share snapshot before creating a server endpoint. It is not removed automatically.
- Unregistering a server removes its access and stops sync.

## What the page does not say

Steps to create the storage account or file share, numeric scale limits, defaults for the cloud tiering policies, the full supported Windows Server list, and complete PowerShell or CLI commands. The page also covers optional topics such as firewalls, self-service restore, proactive recall, SMB over QUIC, Azure Arc and DFS-R migration, which this guide does not describe in full.

## A deployment checklist

This list is practical advice.

1. Confirm region, SMB settings and key access on the storage account.
2. Patch the server and check .NET.
3. Deploy the service, install the agent and register the server.
4. Create the sync group and confirm Healthy.
5. Add the server endpoint on a data volume, not the system volume, if you want tiering.
6. Decide initial sync direction before you select Create.

## Typical mistakes

- Choosing a system volume path and expecting tiering.
- Pointing the endpoint at a NAS path.
- Editing the cloud share directly and expecting immediate sync.
- Registering a server with a second storage sync service.

## Related

- [Azure File Sync](https://www.m365.fm/entity/azure-file-sync/)
- [Azure Files](https://www.m365.fm/entity/azure-files/)
- [Windows Server](https://www.m365.fm/entity/windows-server/)

## Sources

- [Deploy Azure File Sync (Microsoft Learn)](https://learn.microsoft.com/azure/storage/file-sync/file-sync-deployment-guide)
