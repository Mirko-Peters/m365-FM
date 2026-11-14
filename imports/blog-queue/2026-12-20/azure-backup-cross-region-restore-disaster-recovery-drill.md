---
title: "Test Azure Backup Cross Region Restore as a Disaster Recovery Drill"
summary: "How to enable Cross Region Restore on a Recovery Services vault, restore an Azure VM in the paired region, monitor the job and check the result, plus the limits Microsoft Learn documents and what it does not cover."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [azure-backup, azure-region-pairs, azure-storage-redundancy]
keypoints:
  - "Learn says Cross Region Restore can be used to conduct drills when there is an audit or compliance requirement, and to restore data after a disaster in the primary region."
  - "The vault must use geo-redundant storage (GRS). After enabling the feature, backup items can take up to 48 hours to appear in the secondary region, and it incurs extra charges."
  - "Secondary region restores are vault tier restores only. For Azure VMs you can create a VM or restore disks. Replace existing is not supported."
  - "For Azure VM backups the worst-case secondary region RPO is up to 36 hours, so a drill should check which recovery point is actually available."
  - "The pages read describe restoring backup data. They do not describe application failover, a drill scheduler or how often to run drills."
faq:
  - q: "What do I need before I can run a Cross Region Restore drill?"
    a: "Learn says the Recovery Services vault must use the GRS replication type and Cross Region Restore must be enabled under Properties and Backup Configuration. The backup items can take up to 48 hours to become available in the secondary region after you enable it."
  - q: "Where do I find the restore in the Azure portal?"
    a: "Per Learn, go to the Recovery Services vault, open Backup items and select Secondary Region. To follow the restore job, open Backup Jobs and select Secondary Region."
  - q: "Can I use Replace existing for a Cross Region Restore?"
    a: "No. The Azure VM restore article lists Create a VM and Restore Disks as the options for Cross Region Restore and says the Replace existing disks option is not supported."
  - q: "How old can the recovery point in the secondary region be?"
    a: "Learn says the secondary region RPO for Azure VM backups can be up to 36 hours in the worst case. With the Standard policy, the primary region RPO is up to 24 hours and replication to the secondary region can take up to 12 hours."
  - q: "Can I cancel a Cross Region Restore job?"
    a: "The Azure VM restore article notes that Cross Region Restore jobs, once triggered, cannot be canceled. Check the staging location, network settings and recovery point before you start the restore."
---

Azure Backup can restore data in the paired region through Cross Region Restore. Microsoft Learn says this feature can be used to conduct drills when there is an audit or compliance requirement, and to restore data if there is a disaster in the primary region. A drill therefore means three things: enable the feature on a GRS vault, restore a recovery point in the secondary region, and check the restored resource. This article follows the Learn pages for the vault setup, the Azure VM restore and the support matrix.

## What the drill tests

Cross Region Restore restores backup data in the Azure paired region. Learn explains that snapshots are not replicated to the secondary region. Only the data stored in the vault is replicated, so secondary region restores are vault tier restores only. Learn also says the restore time in the secondary region is almost the same as the vault tier restore time in the primary region.

That scope matters. The drill proves that a recovery point can be read and restored in the paired region. The pages read for this article do not describe application failover, DNS changes or network design in the secondary region. Those parts of a disaster recovery plan need their own test.

## Prerequisites

From the vault article and the support matrix:

- The Recovery Services vault must use the GRS replication type.
- Azure VMs created through Azure Resource Manager and encrypted Azure VMs are supported. Classic VMs are not. The support matrix also lists legacy recovery points from VMs with unmanaged disks as unsupported.
- SQL Server and SAP HANA databases on Azure VMs, Azure file shares and PostgreSQL are listed as supported. The MARS agent is in preview. DPM and MABS are listed as not supported.
- Cross Region Restore incurs extra charges.
- Storage replication type should be changed before you configure a backup. After a backup is configured, the option is disabled.
- Learn says Cross Region Restore currently cannot be reverted to GRS or LRS after protection starts for the first time.

On Ultra Disks, the two pages disagree. The vault article says Cross Region Restore is also supported for machines running on Ultra Disks, while the VM restore article says it is currently not supported. Check the Ultra Disk section of the Azure VM backup support matrix before you depend on it.

## Step 1: Enable Cross Region Restore

1. In the Azure portal, open the Recovery Services vault and select **Settings** > **Properties**.
2. Under **Backup Configuration**, select **Update**.
3. Under **Cross Region Restore**, select **Enable**.

If you have access to restricted paired regions and still do not see the setting, Learn suggests re-registering the resource provider. In the subscription, open **Resource provider** and select **Microsoft.RecoveryServices** > **Re-register**.

After enabling, Learn says it might take up to 48 hours for the backup items to be available in secondary regions. Plan the drill after that window.

## Step 2: Find the items in the secondary region

1. Open the **Recovery Services vault** and select **Backup items**.
2. Select **Secondary Region**.

Only backup management types that support Cross Region Restore appear in this list. Learn adds that restoring secondary region data to a secondary region is the supported case.

## Step 3: Restore in the secondary region

The experience is similar to the primary region restore. In the **Restore Configuration** pane you are asked only for secondary region parameters. For Azure VMs, the options are **Create a VM** and **Restore Disks**.

Points from Learn that often decide whether the drill succeeds:

- The **Staging Location**, which is the storage account, must be in the region that the vault treats as secondary. Learn gives an example: a vault in East US 2 has Central US as its secondary region, so the storage account must be in Central US.
- Azure Backup configures virtual network settings in the secondary region automatically when you restore a VM. If you restore disks and deploy the template, provide virtual network settings that match the secondary region.
- If a VNet or subnet is not available in the primary region or not configured in the secondary region, the portal does not auto-populate defaults.
- Customer-managed key enabled VMs that were not backed up in a CMK enabled vault are restored as non-CMK VMs in the secondary region.
- The Azure roles needed in the secondary region are the same as in the primary region.

## Step 4: Monitor the job

Open the vault, select **Backup Jobs** and then **Secondary Region**. Once triggered, the job cannot be canceled.

## Step 5: Check the restored VM

The Learn post-restore list is a good checklist for the drill:

- Extensions present at backup time are installed but not enabled. Reinstall them if you see an issue.
- A restored VM created through Create a VM is a new resource. RBAC role assignments scoped to the original VM do not carry over.
- A static IP address on the source becomes a dynamic address on the restored VM to avoid conflicts.
- A restored VM has no availability set.
- On cloud-init-based Linux distributions, the password is blocked after restore. Learn points to the VMAccess extension to reset it.
- If the VM cannot be reached because of a broken relationship with the domain controller, Learn describes an offline repair that includes attaching the OS disk as a data disk and disjoining the VM from the domain.

## Judge the result against the RPO

Learn states that for Azure VM backups the secondary region RPO can be up to 36 hours in the worst case. A drill is the natural moment to record how old the newest recovery point in the secondary region really is and whether that is acceptable.

## A drill checklist (author's suggestion)

This list is a suggestion, not a Learn procedure:

1. Record the vault, region pair and Cross Region Restore status.
2. Pick one representative VM and note the newest recovery point shown under **Secondary Region**.
3. Restore into an isolated resource group and network.
4. Note start time, end time and any errors from the job.
5. Check the post-restore items above.
6. Record the findings and the next drill date.

## What the documentation does not say

The pages read do not describe a built-in drill scheduler, a recommended drill frequency, or a way to test application-level failover. They also do not say how long a restore takes for a given VM size in the secondary region, beyond the statement that it is almost the same as the primary region vault tier restore.

## Related

- [Azure Backup](https://www.m365.fm/entity/azure-backup/)
- [Azure region pairs](https://www.m365.fm/entity/azure-region-pairs/)
- [Azure storage redundancy](https://www.m365.fm/entity/azure-storage-redundancy/)

## Sources

- [Create and configure Recovery Services vaults, including Set Cross Region Restore (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/backup/backup-create-recovery-services-vault)
- [Restore VMs by using the Azure portal, including Cross Region Restore (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/backup/backup-azure-arm-restore-vms)
- [Azure Backup support matrix, Cross Region Restore section (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/backup/backup-support-matrix)
