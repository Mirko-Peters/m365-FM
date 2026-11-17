---
title: "What to back up in an AVD environment"
summary: "In an Azure Virtual Desktop environment the data worth backing up is mostly outside the session hosts: FSLogix profile containers, the VMs of personal host pools and, if you cannot rebuild them, the storage accounts that hold MSIX packages. This article lists what Microsoft's guidance says to protect, what it says to skip, and the Azure Files backup limits that shape the policy."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, fslogix-profile-container]
keypoints:
  - "Pooled session hosts are stateless, so the profile and data stores are the main backup target. Personal session hosts hold state, and Microsoft's multiregion article says to use replication and backup for them."
  - "Split Profile and Office containers into separate storage accounts so each can have its own backup policy. Office containers hold cached data that can often be rebuilt from Microsoft 365, so backing them up may be unnecessary."
  - "Azure Files backup in the snapshot tier allows 200 recovery points per share. A schedule of six daily snapshots with 30 days of daily retention, 11 monthly and 8 yearly points adds up to 205 and breaks that limit."
  - "Microsoft operates the service components. Learn lists session hosts, image customizations, applications, network connectivity, the resiliency, backup and recovery of session hosts, and user identities as customer responsibilities. User and app data sits in the region you choose and is not managed by the service."
  - "MSIX package storage is covered by storage replication and its own storage account, with backup if you cannot rebuild the repository. A backup that has not been restored is not a plan, so record restore limits in the runbook."
faq:
  - q: "Do I need to back up pooled session hosts?"
    a: "Microsoft's multiregion article describes pooled session hosts as stateless, with profiles and data in external storage or OneDrive. The practical approach it implies is to rebuild hosts from a golden image in Azure Compute Gallery and to protect the storage instead. Personal session hosts differ because each user's VM can store state."
  - q: "Should the FSLogix Office container be backed up?"
    a: "Usually not, according to the multiregion article: Office containers hold cached data that can often be rebuilt from Microsoft 365, so skipping the backup can reduce cost. Keeping them in a separate storage account lets you apply a different policy from the one for profile containers, or a less expensive one if you decide to back them up."
  - q: "Is the Azure Virtual Desktop service configuration backed up for me?"
    a: "Learn says the service stores metadata such as host pool, application group and workspace names and replicates it as part of its data storage design. It does not describe a restore feature for that metadata. Keep your own record of how objects were deployed."
---

Back up the places where Azure Virtual Desktop users' state actually lives: the FSLogix profile storage, the VMs of personal host pools and, if you cannot rebuild them, the storage accounts that hold MSIX packages. Pooled session hosts and the Microsoft-run service components need a different treatment, which is to rebuild hosts from a golden image and keep a recorded configuration.

This article sorts the parts of an environment into back up, replicate, rebuild and not covered, based on Microsoft Learn and the Azure Architecture Center. It then covers the Azure Files backup features and limits that matter for profile shares. Sources are listed at the end and were retrieved on 17 November 2026. Disaster recovery to a second region has its own coverage in this series, so this article stays with backup.

## Who owns what

Learn's service architecture article says most components are Microsoft-managed. The customer is responsible for creating and managing session hosts, including operating system image customizations and applications, for virtual network connectivity, for the resiliency, backup and recovery of those session hosts, and for providing and managing user identities and access control. The data locations article adds that the service stores metadata such as host pool, application group and workspace names and user principal names, and that user-created or app-related information, such as app settings and user data, resides in the region you choose and is not managed by the service. Learn names Azure Backup, Azure Site Recovery and availability zones among the Azure services that can help with these tasks. See [Azure Backup](/entity/azure-backup/) and [Azure Site Recovery](/entity/azure-site-recovery/).

## The inventory

| Item | Approach in the sources | Notes |
|---|---|---|
| FSLogix profile containers on Azure Files | Back up with Azure Backup | Main target for pooled host pools |
| FSLogix profile containers on Azure NetApp Files | Use the built-in Azure NetApp Files backup | Check regional feature availability, per the multiregion article. The FSLogix storage article also lists Azure NetApp Files snapshots |
| FSLogix Office containers | Often no backup needed | Cache that can be rebuilt from Microsoft 365 |
| MSIX App Attach packages | Use Azure Storage replication (ZRS, or GRS for Azure Files), in a storage account separate from the profile and Office accounts | Back up that account if you cannot easily rebuild the package repository |
| Pooled session hosts | Treat as stateless, rebuild from image | Profiles and data are in external storage or OneDrive |
| Personal session hosts | Back up at VM level, replicate with Azure Site Recovery for DR | Each user's VM can store state |
| Golden images | Store in Azure Compute Gallery with replicas | A recorded, versioned image is the backup |
| Files redirected to OneDrive | Not covered by this article | The multiregion article says its scenario does not include OneDrive backup |
| Service metadata | Microsoft-managed | No customer backup described in the sources |
| Identity (Microsoft Entra ID, AD DS) | Own design, outside this article | Learn lists identities as customer-managed |

The multiregion article says to back up the primary-region storage. In most cases the disaster recovery environment does not need backup. See [FSLogix profile container](/entity/fslogix-profile-container/), [FSLogix Office container](/entity/fslogix-office-container/), [MSIX app attach](/entity/msix-app-attach/), [Azure NetApp Files](/entity/azure-netapp-files/) and [Azure Compute Gallery](/entity/azure-compute-gallery/).

## Profile containers on Azure Files

Learn's FSLogix storage article recommends Azure Files for most customers and lists Azure backup snapshot integration as the backup option. Its workload guidance for Azure Files: light workloads below 200 users use Standard shares, light workloads above 200 users use Premium shares or Standard with multiple shares, and medium, heavy and power workloads use Premium shares. See [Azure Files](/entity/azure-files/).

Azure Backup for Azure Files has two tiers. The snapshot tier creates a share snapshot through the file share API and stores only the snapshot URL in the metadata store. In the vault-standard tier, once the snapshot exists, the changed files and data blocks since the last backup are identified and transferred to a Recovery Services vault. Learn announces vaulted backup for Azure Files as generally available. Azure Backup enables soft delete at the storage account level with a 14-day retention period, and it locks the snapshots from scheduled and on-demand backups with a lease of infinite duration.

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

Vault-standard tier values differ. The matrix lists, for example, a 10 TB maximum file share size, a maximum snapshot retention of 30 days, daily retention up to 9,999 days, and full-share restore only, because file-level recovery is not supported. It also notes that with several backups per day only the last scheduled snapshot of the day is transferred to the vault. Check the tab for the tier you use before you copy a number into a policy.

The Azure Files backup FAQ says you can have up to 200 snapshots for a file share at any point in time, and that this includes snapshots taken by Azure Backup under your policy. It shows how the limit bites. A daily policy of 30 daily, 40 weekly, 4 monthly and 6 yearly points is 80 snapshots and fits. A policy with six daily snapshots, 30 days of daily retention, 11 monthly and 8 yearly points comes to (6 x 31) + 11 + 8 = 205, because the FAQ adds a one-day buffer for each daily snapshot. That is over the limit. With six snapshots per day, the support matrix formula gives floor(200 / 6) - 1 = 32 days as the longest daily retention. If backups fail at the limit, the FAQ says to delete on-demand snapshots.

As a worked example, a pooled host pool for 300 users that uses Premium shares might protect the profile share with the daily policy from the FAQ: 30 daily, 40 weekly, 4 monthly and 6 yearly recovery points, 80 in total. That leaves 120 points of headroom under the 200 limit for on-demand snapshots before changes such as an image or FSLogix update. The Office container shares would carry no policy, or a short one, if the team accepts rebuilding them from Microsoft 365.

Redundancy has two separate parts. For the snapshot tier, the support matrix says Azure Files in storage accounts with any replication type are supported. For vaulted backups, the multiregion article says to set the Recovery Services vault storage redundancy to ZRS if you need zone resilience but not an off-site copy, and to use GRS if backup copies must be replicated to the storage account's recovery Azure region, which might differ from the deployment's DR region. The same article notes that Azure Files Premium does not support GRS, so Premium profile shares need another approach to cross-region copies, such as FSLogix Cloud Cache.

## Restore planning

A backup is only useful if the restore fits the outage. Points from the same sources:

- Restore options include the full share or, in the snapshot tier, individual files and folders, to the original or an alternate location. Instant restore from snapshots lets you select just the files you want.
- In the snapshot tier, restore time for the original location depends on the number of files and directories in the share. For an alternate location it also depends on the available IOPS of the source and target storage accounts.
- A permanently deleted share cannot be restored with its snapshots. A soft-deleted share must be undeleted before a restore.
- For authentication, the FAQ says to enable key access on both source and target storage accounts, even when identity-based access is configured.
- In the snapshot tier, the maximum recommended restore size is 15 TiB and a restore job can run for up to 7 days.

The retrieved pages say nothing about how Azure Backup treats a profile VHD that is open and mounted during a backup. Test a restore of a real profile before you rely on the policy.

## Personal host pools and images

For personal host pools, each user has a dedicated VM that can store data, so the multiregion article says to use replication and backup. It says to run backup at the session-host VM level, which applies only when the data is stored locally. If you use OneDrive with known-folder redirection, you might no longer need to store data inside the container. For disaster recovery it uses Azure Site Recovery to replicate personal session host VMs to the secondary region. The support matrix adds a scheduling point for VM backups: Azure Backup does not adjust automatically for daylight saving time for Azure VM backups, so update those backup policies manually.

For rebuildable parts, keep golden images in Azure Compute Gallery. The multiregion article says Compute Gallery is a regional resource, so you create at least one secondary gallery in the secondary region and set up multiple image replicas in both locations. Each replica supports a maximum number of VMs deploying in parallel, so large deployment batches may need more than one.

## A short procedure

1. List every storage account and VM in the environment and mark each as state or rebuildable.
2. Separate Profile and Office containers into different storage accounts, so each gets its own retention.
3. Decide whether the Office container needs any backup at all.
4. Enable Azure Backup on profile shares, choose the tier, and set retention so the total stays under 200 recovery points in the snapshot tier.
5. Keep MSIX packages in their own storage account with ZRS or GRS replication as the multiregion article describes, and back that account up if you cannot easily rebuild the repository. Keep images in Azure Compute Gallery.
6. For personal host pools, choose VM backup, replication or both, per VM.
7. Run a restore test and write down the time and the steps.
8. Record how host pools, workspaces and application groups were deployed, so they can be recreated.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Data locations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery)
- [Microsoft Learn: Storage options for FSLogix profile containers](https://learn.microsoft.com/en-us/azure/virtual-desktop/store-fslogix-profile)
- [Microsoft Learn: About Azure Files backup](https://learn.microsoft.com/en-us/azure/backup/azure-file-share-backup-overview)
- [Microsoft Learn: Azure Files backup support matrix](https://learn.microsoft.com/en-us/azure/backup/azure-file-share-support-matrix)
- [Microsoft Learn: Azure Files backup FAQ](https://learn.microsoft.com/en-us/azure/backup/backup-azure-files-faq)
