---
title: "How to Enable Soft Delete for Azure Blobs and Recover Deleted Data"
summary: "Turn on blob soft delete in the Azure portal, PowerShell or CLI, pick a retention period, and restore deleted blobs with Undelete. Includes limits, billing effects and what soft delete does not protect."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [azure-storage-account, azure-blob-storage]
keypoints:
  - "In the portal: storage account > Data Protection under Data management > Turn on soft delete for blobs, retention 1 to 365 days, then save."
  - "Microsoft recommends a minimum retention period of seven days."
  - "Deleted blobs are hidden by default; toggle Show deleted blobs on the container Overview page and use Undelete to restore."
  - "With versioning enabled, Undelete does not restore the base blob; you promote a previous version with Make current version."
  - "Blob soft delete does not protect containers or accounts, and soft-deleted data is billed like active data."
faq:
  - q: "How long can I keep soft-deleted blobs?"
    a: "Microsoft Learn says you specify a retention period between 1 and 365 days. The retention period can be updated at any time, but once it elapses the object is permanently deleted and the retention cannot be extended. Learn also states that Microsoft recommends a minimum of seven days."
  - q: "Is blob soft delete on by default?"
    a: "According to Learn, it is enabled by default when you create a new storage account in the Azure portal, with the setting on the Data protection tab. It is not enabled when you create a new account with PowerShell or Azure CLI, so you enable it afterwards."
  - q: "How do I restore a soft-deleted blob in the portal?"
    a: "Learn says to open the container Overview page, toggle Show deleted blobs, select the blob and select Undelete on the Overview tab. If versioning is enabled, Undelete restores soft-deleted versions and snapshots but not the base blob, so you select a version on the Versions tab and choose Make current version."
  - q: "Does soft delete protect a deleted container or storage account?"
    a: "No. Learn states that blob soft delete does not protect at container or account level. Container soft delete restores deleted containers, and Microsoft recommends enabling both. For broader losses such as account deletion or ransomware, Learn suggests also considering Azure Backup."
  - q: "Does soft delete cost extra?"
    a: "Learn says all soft-deleted data is billed at the same rate as active data until the retention period elapses. You are not billed for transactions that create snapshots or versions automatically on overwrite or delete, but calls to Undelete Blob are billed at the write transaction rate."
---

Blob soft delete keeps deleted or overwritten blob data for a retention period you set, so you can restore it. In the Azure portal, open the storage account, go to **Data Protection** under **Data management**, select **Turn on soft delete for blobs**, enter a retention period from 1 to 365 days and save. To recover data later, show deleted blobs in the container and select **Undelete**. This guide follows three Microsoft Learn pages: enable soft delete, manage and restore soft-deleted blobs, and the soft delete overview.

## What blob soft delete protects

Learn says blob soft delete protects an individual blob, snapshot or version from accidental deletes or overwrites by keeping the data for a specified time. During retention you can restore the object to its state at deletion. After retention expires, the object is permanently deleted. You cannot permanently delete a soft-deleted blob before the retention period expires, unless the Permanent Delete feature is enabled on the account.

Its limits matter as much as its features:

- It does not protect containers or accounts. Container soft delete covers deleted containers, and Learn recommends enabling both.
- It does not protect metadata or property writes, and no soft-deleted snapshot is created for those.
- On accounts with a hierarchical namespace, it protects against deletes only. Overwrites are not captured.
- Blobs deleted through the ADLS-only Set Blob Expiry operation are not recoverable.

## Turn it on

The Learn page says you can enable or disable soft delete at any time with Azure built-in policy, the Azure portal, PowerShell or Azure CLI. To enable it at scale, it points to the built-in policy Configure soft delete for blobs and containers on storage accounts.

### Azure portal

New accounts created in the portal have blob soft delete on by default. The setting is on the **Data protection** tab. For an existing account:

1. In the Azure portal, open your storage account.
2. Under **Data management**, select **Data Protection**.
3. In the **Recovery** section, select **Turn on soft delete for blobs**.
4. Enter a retention period between 1 and 365 days. Microsoft recommends at least seven days.
5. Save.

### PowerShell

Blob soft delete is not enabled when you create an account with PowerShell. Afterwards run:

```powershell
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -RetentionDays 7
```

Check the settings with `Get-AzStorageBlobServiceProperty` and read `DeleteRetentionPolicy.Enabled` and `.Days`.

### Azure CLI

The same applies to CLI: not enabled at creation. Use:

```azurecli
az storage account blob-service-properties update --account-name <storage-account> \
    --resource-group <resource-group> \
    --enable-delete-retention true \
    --delete-retention-days 7
```

### Accounts with a hierarchical namespace

Learn gives separate steps. In the portal, the path is the same Data Protection option. The PowerShell and CLI steps in the article use a preview module and the `storage-preview` extension, so check the page before you script them.

## Restore deleted blobs

Soft-deleted blobs are invisible in the portal by default.

1. Open the container **Overview** page.
2. Toggle **Show deleted blobs**. Deleted blobs show a status of **Deleted**.
3. Select the blob. The properties show the number of days until permanent deletion.
4. To also see deleted snapshots, open the **Snapshots** tab and toggle **Show deleted snapshots**.

### Versioning disabled

Select **Undelete** on the **Overview** tab. This also restores snapshots deleted during the retention period. To promote a soft-deleted snapshot to the base blob, first undelete, then select the snapshot and use **Promote snapshot**.

### Versioning enabled

Select the blob, open the **Versions** tab, choose the version to make current and select **Make current version**. Learn notes that **Undelete** in this case restores soft-deleted versions and snapshots but not the base blob, so you must promote a previous version.

### Hierarchical namespace accounts

Learn says you can restore blobs and directories with **Undelete**. Soft-deleted items do not appear in the portal if your principal relies only on ACL entries. You need to be the account owner or hold Storage Blob Data Owner, Contributor or Reader. If you rename a directory that contains soft-deleted items, they become disconnected, so revert the name to restore them. You also cannot restore an item to a path that already holds an item of that name.

## Cost and behavior changes to plan for

From the overview page:

- Soft-deleted data is billed at the same rate as active data and stays in the same tier.
- Overwrite-heavy workloads can accumulate soft-deleted snapshots when versioning is off.
- Listing with an all flag in code now returns soft-deleted blobs. Learn says to audit your code and use `BlobStates.None` to list active blobs only.
- On flat-namespace accounts, enabling soft delete blocks the DFS endpoint; calls fail with `EndpointUnsupportedAccountFeatures`.
- Enabling blob or container soft delete on a flat-namespace account blocks an upgrade to hierarchical namespace.

To permanently remove already soft-deleted blobs sooner, Learn describes this order: undelete them, turn off blob soft delete and delete the blobs again.

## My short checklist

This is my advice. Pick a retention period that matches how quickly you notice mistakes, but not longer than your budget allows. Enable container soft delete too. Test one restore before you need it, and write down who may use Undelete.

## Related

- [Azure Storage account](https://www.m365.fm/entity/azure-storage-account/)
- [Azure Blob Storage](https://www.m365.fm/entity/azure-blob-storage/)

## Sources

- [Enable soft delete for blobs - Azure Storage (Microsoft Learn)](https://learn.microsoft.com/azure/storage/blobs/soft-delete-blob-enable)
- [Manage and restore soft-deleted blobs - Azure Storage (Microsoft Learn)](https://learn.microsoft.com/azure/storage/blobs/soft-delete-blob-manage)
- [Soft Delete for Blobs to Recover Data - Azure Storage (Microsoft Learn)](https://learn.microsoft.com/azure/storage/blobs/soft-delete-blob-overview)
