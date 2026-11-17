---
title: "What to back up in an AVD environment"
summary: "In an Azure Virtual Desktop environment the data worth backing up is mostly outside the session hosts: FSLogix profile containers, the VMs of personal host pools and, if you cannot rebuild them, the storage accounts that hold MSIX packages. This article lists what Microsoft's guidance says to protect, what it says to skip, and the Azure Files backup limits that shape the policy."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, fslogix-profile-container]
keypoints:
  - "Pooled session hosts are stateless, so state sits in the profile and data stores. Whether to back up profile containers is a decision: Learn's FSLogix guidance says roaming profiles are not commonly described as business-critical and points to OneDrive or SharePoint for critical data. Personal session hosts hold state, and Microsoft's multiregion article says to use replication and backup for them."
  - "If you use separate Office containers, which Learn calls an advanced scenario, give them their own storage account. Learn says an Office container that holds only cached data you can rebuild from Microsoft 365 needs no backup."
  - "Azure Files backup in the snapshot tier allows 200 recovery points per share. A schedule of six daily snapshots with 30 days of daily retention, 11 monthly and 8 yearly points adds up to 205 and breaks that limit. In the snapshot tier the snapshots stay in the same storage account as the share."
  - "Microsoft operates the service components. Learn lists session hosts, image customizations, applications, network connectivity, the resiliency, backup and recovery of session hosts, and user identities as customer responsibilities. User and app data sits in the region you choose and is not managed by the service."
  - "MSIX package storage is covered by storage replication and its own storage account, with backup if you cannot rebuild the repository. Test restores and record the limits in the runbook."
faq:
  - q: "Do I need to back up pooled session hosts?"
    a: "Microsoft's multiregion article describes pooled session hosts as stateless, with profiles and data in external storage or OneDrive. Our reading is that this points to rebuilding hosts from the golden image, which the article says to keep identical in both regions in Azure Compute Gallery, and to protect the storage instead. Personal session hosts differ because each user's VM can store state."
  - q: "Should the FSLogix Office container be backed up?"
    a: "Only if it holds more than rebuildable cache. The multiregion article says that if the content is only cached data you can rebuild from an online data store such as Microsoft 365, you do not need to back it up, and that if you do, you can use less expensive storage or a different frequency and retention. The same article calls separate Office containers an advanced scenario, so an environment with only a Profile container has nothing to separate."
  - q: "Is the Azure Virtual Desktop service configuration backed up for me?"
    a: "Learn says the service stores metadata such as host pool, application group and workspace names and replicates it as part of its data storage design. Our reading is that this describes resilience and not a restore you can run yourself, so keep your own record of how objects were deployed."
---

Back up the places where Azure Virtual Desktop users' state actually lives: the FSLogix profile storage, the VMs of personal host pools and, if you cannot rebuild them, the storage accounts that hold MSIX packages. Pooled session hosts and the Microsoft-run service components need a different treatment: in our reading, rebuild hosts from a golden image and keep a recorded configuration. Whether profile storage needs a backup at all is a decision, because Learn's FSLogix guidance describes a design with no profile recovery.

This article sorts the parts of an environment into back up, replicate, rebuild and not covered, based on Microsoft Learn and the Azure Architecture Center, then covers the Azure Files backup limits that matter for profile shares. Disaster recovery to a second region is covered elsewhere in this series.

## Who owns what

Learn's service architecture article says most components are Microsoft-managed. The customer is responsible for session hosts, including image customizations and applications, for virtual network connectivity, for the resiliency, backup and recovery of those session hosts, and for user identities and access control. The data locations article adds that the service stores metadata such as host pool, application group and workspace names and user principal names, and that user data and app settings reside in the region you choose and are not managed by the service. Learn names Azure Backup, Azure Site Recovery and availability zones as helpful services. The disaster recovery concepts article also lists profile management, usually with FSLogix, applications and user data as customer-managed or partner-managed. See [Azure Backup](/entity/azure-backup/) and [Azure Site Recovery](/entity/azure-site-recovery/).

## The inventory

| Item | Approach in the sources | Notes |
|---|---|---|
| FSLogix profile containers on Azure Files | Back up with Azure Backup, or accept recreated profiles | Decide per the next section; pooled hosts keep no state |
| FSLogix profile containers on Azure NetApp Files | Use the built-in Azure NetApp Files backup | Check regional feature availability, per the multiregion article. The FSLogix storage article also lists Azure NetApp Files snapshots |
| FSLogix Office containers | No backup needed if the content is only rebuildable cache | A separate Office container is an advanced scenario per the multiregion article |
| MSIX App Attach packages | Use Azure Storage replication (ZRS, or GRS for Azure Files), in a storage account separate from the profile and Office accounts | Back up that account if you cannot easily rebuild the package repository | The article recommends one account per region over a single GRS account, which does not suit local access after a failover |
| Pooled session hosts | Treat as stateless, rebuild from image | Profiles and data are in external storage or OneDrive |
| Personal session hosts | Back up at VM level, replicate with Azure Site Recovery for DR | Each user's VM can store state |
| Golden images | Store in Azure Compute Gallery with replicas | Our reading: a recorded, versioned image is the backup |
| Files redirected to OneDrive | Not covered by this article | The multiregion article says its scenario does not include OneDrive backup |
| Service metadata | Microsoft-managed | No customer backup described in the sources |
| Identity (Microsoft Entra ID, AD DS) | Own design, outside this article | Learn lists identities as customer-managed |

The multiregion article says backing up primary-region storage addresses typical needs and that the disaster recovery environment usually needs none. See [FSLogix profile container](/entity/fslogix-profile-container/), [FSLogix Office container](/entity/fslogix-office-container/), [MSIX app attach](/entity/msix-app-attach/), [Azure NetApp Files](/entity/azure-netapp-files/) and [Azure Compute Gallery](/entity/azure-compute-gallery/).

## Back up profiles or let users start over

Learn's FSLogix business continuity article says roaming profiles are not commonly described as a business or mission-critical component of a BCDR strategy, that business-critical data should not be stored in a profile if possible, and that OneDrive or SharePoint protect data without relying on the profile. Its first option is no profile recovery: users create new profiles after a disaster, which it calls the lowest infrastructure cost but with a user experience penalty. Whether a profile share earns a backup policy is therefore a recovery time and recovery point decision; the rest of this article assumes it does.

## Profile containers on Azure Files

Learn's FSLogix storage article recommends Azure Files for most customers and lists Azure backup snapshot integration as the backup option. Its workload guidance: light workloads below 200 users use Standard shares, light workloads above 200 users use Premium or Standard with multiple shares, and medium, heavy and power workloads use Premium. See [Azure Files](/entity/azure-files/).

Azure Backup for Azure Files has two tiers. The snapshot tier creates a share snapshot through the file share API and stores only the snapshot URL in the metadata store. In the vault-standard tier, once the snapshot exists, the changed files and data blocks since the last backup are identified and transferred to a Recovery Services vault. Azure Backup enables soft delete at the storage account level with a 14-day retention period, and it locks the snapshots from scheduled and on-demand backups with a lease of infinite duration. The FAQ adds that the snapshot tier keeps snapshots in the same storage account as the file share, so deleting the account deletes the snapshots, which is why Azure Backup takes a delete lock on the account. Those snapshots follow the replication setting of the storage account, not of the vault.

The support matrix lists limits separately for the two tiers. These are the values that shape policy design in the snapshot tier, the one the FAQ examples below use:

| Setting (snapshot tier) | Limit |
|---|---|
| Total recovery points per file share at any time | 200 |
| Scheduled snapshots per day | 24 |
| On-demand backups per day (both tiers) | 10 |
| Daily retention, daily frequency | 200 days |
| Daily retention, hourly frequency | floor(200 / snapshots per day) - 1 days |
| Weekly / monthly / yearly retention | 200 weeks / 120 months / 10 years |
| Items per item-level restore | 99 |
| Restores per day (both tiers) | 20 |
| File shares protected per vault | 2,000 |
| File shares protected per vault per day | 200 |

Vault-standard tier values differ: a 10 TB maximum share size, snapshot retention up to 30 days, daily retention up to 9,999 days, full-share restore only, and only the last scheduled snapshot of the day is transferred to the vault. Check the tab for your tier before copying a number.

The Azure Files backup FAQ says you can have up to 200 snapshots for a file share at any point in time, and that this includes snapshots taken by Azure Backup under your policy. It shows how the limit bites. A daily policy of 30 daily, 40 weekly, 4 monthly and 6 yearly points is 80 snapshots and fits. A policy with six daily snapshots, 30 days of daily retention, 11 monthly and 8 yearly points comes to (6 x 31) + 11 + 8 = 205, because the FAQ adds a one-day buffer for each daily snapshot. That is over the limit. For daily retention alone, the support matrix formula gives floor(200 / 6) - 1 = 32 days with six snapshots per day. With monthly and yearly points in the same policy the total must still stay at or below 200, so usable daily retention is lower. If backups fail at the limit, the FAQ says to delete on-demand snapshots.

As a worked example, a pooled host pool for 300 users on Premium shares might protect the profile share with the FAQ's daily policy of 80 recovery points. That leaves 120 points of headroom under the 200 limit. Our suggestion is to keep some of it for on-demand snapshots before changes such as an image or FSLogix update.

Redundancy has two separate parts. For the snapshot tier, the support matrix says Azure Files in storage accounts with any replication type are supported. For vaulted backups, the multiregion article says to set the Recovery Services vault storage redundancy to ZRS if you need zone resilience but not an off-site copy, and to use GRS if backup copies must be replicated to the storage account's recovery Azure region, which might differ from the deployment's DR region. The same article notes that Azure Files Premium does not support GRS and points to FSLogix Cloud Cache for cross-region copies.

## Restore planning

A backup is only useful if the restore fits the outage. From the same sources:

- Restore options include the full share or, in the snapshot tier, individual files and folders, to the original or an alternate location.
- In the snapshot tier, restore time for the original location depends on the number of files and directories in the share. For an alternate location it also depends on the available IOPS of the source and target storage accounts.
- A permanently deleted share cannot be restored with its snapshots. A soft-deleted share must be undeleted before a restore.
- The FAQ says to enable key access on both source and target storage accounts, even with identity-based access configured.
- In the snapshot tier, the maximum recommended restore size is 15 TiB and a restore job can run for up to 7 days.

Learn's Azure Files backup overview, FAQ and support matrix do not describe how a profile VHD that is open and mounted is handled during a backup. Test a restore of a real profile before you rely on the policy.

## Personal host pools and images

For personal host pools, each user has a dedicated VM that can store data, so the multiregion article says to use replication and backup. It says to run backup at the session-host VM level, which applies only when the data is stored locally. For disaster recovery it uses Azure Site Recovery to replicate personal session host VMs to the secondary region. The support matrix adds that Azure VM backup does not adjust for daylight saving time, so update those policies manually.

For rebuildable parts, keep golden images in Azure Compute Gallery. The multiregion article says Compute Gallery is a regional resource, so you create at least one secondary gallery in the secondary region and set up multiple image replicas in both locations.

## A short procedure

1. List every storage account and VM in the environment and mark each as state or rebuildable. Decide whether profiles are backed up or recreated, and keep critical data out of the profile.
2. If you use separate Office containers, which Learn calls an advanced scenario, keep them in their own storage account so each gets its own retention.
3. Decide whether the Office container needs any backup. Learn says none is needed when it holds only rebuildable cache.
4. Enable Azure Backup on the profile shares that need it, choose the tier, and set retention so the total stays under 200 recovery points in the snapshot tier.
5. Keep MSIX packages in their own storage account with ZRS or GRS replication as the multiregion article describes, and back that account up if you cannot easily rebuild the repository. Keep images in Azure Compute Gallery.
6. For personal host pools, choose VM backup, replication or both, per VM.
7. Run a restore test and write down the time and the steps.
8. Record how host pools, workspaces and application groups were deployed, so they can be recreated.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Data locations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Azure Virtual Desktop disaster recovery concepts](https://learn.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery-concepts)
- [Microsoft Learn: Business continuity and disaster recovery options for FSLogix](https://learn.microsoft.com/en-us/fslogix/concepts-container-recovery-business-continuity)
- [Microsoft Learn: Storage options for FSLogix profile containers](https://learn.microsoft.com/en-us/azure/virtual-desktop/store-fslogix-profile)
- [Microsoft Learn: About Azure Files backup](https://learn.microsoft.com/en-us/azure/backup/azure-file-share-backup-overview)
- [Microsoft Learn: Azure Files backup support matrix](https://learn.microsoft.com/en-us/azure/backup/azure-file-share-support-matrix)
- [Microsoft Learn: Azure Files backup FAQ](https://learn.microsoft.com/en-us/azure/backup/backup-azure-files-faq)
