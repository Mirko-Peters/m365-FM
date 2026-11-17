---
title: "Disaster recovery for Azure Virtual Desktop: options and trade-offs"
summary: "Azure Virtual Desktop has no native disaster recovery feature. Microsoft's guidance offers three patterns: active-active or active-passive pooled host pools with FSLogix Cloud Cache, and Azure Site Recovery for personal host pools, each with different recovery time, cost and effort."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, fslogix-cloud-cache]
keypoints:
  - "Azure Virtual Desktop has no native disaster recovery features. Microsoft runs the control plane, and you own session hosts, profiles, apps, user data and identities."
  - "Microsoft's multiregion article estimates active-active with Cloud Cache at near-zero RTO, active-passive at 15 to 60 minutes, and Azure Site Recovery for personal pools at minutes per VM plus domain rejoin time. It calls these estimates, not guarantees."
  - "Cloud Cache replicates profiles asynchronously to a second storage account. Azure Files Premium does not support geo-redundant storage, so Cloud Cache is the cross-region route."
  - "Availability zones are not disaster recovery, a reservation does not reserve capacity, and Site Recovery test failover must not be used on session hosts."
  - "In an active-passive pooled design, failover works through user assignments: you remove users from the primary application groups and assign them to the secondary groups."
faq:
  - q: "Does Azure Virtual Desktop have built-in disaster recovery?"
    a: "No. Microsoft Learn says the service has no native features for managing disaster recovery scenarios. Microsoft operates the control plane across regions, while you are responsible for session hosts, profile management, applications, user data and identities."
  - q: "Can I use Azure Site Recovery for pooled host pools?"
    a: "Microsoft's multiregion article uses Site Recovery for personal host pools, where each VM holds user data. For pooled host pools it describes a second host pool with FSLogix Cloud Cache instead. It also says not to use Site Recovery test failover on session hosts."
  - q: "Are regional host pools generally available?"
    a: "Yes. Microsoft's Tech Community post "Now generally available: Regional resiliency for Azure Virtual Desktop" (updated 1 October 2026) announces general availability, and the What's new page lists them as generally available in September 2026. The multiregion article may still describe them as public preview, so check the current pages and region list before you design around them."
---

Azure Virtual Desktop has no native disaster recovery feature, so recovery is something you assemble from Azure services. Microsoft's guidance describes three patterns: two live pooled host pools in two regions (active-active), a mostly switched-off second pool (active-passive), or Azure Site Recovery for personal desktops. The choice is a trade between recovery time, cost and operational effort.

This article compares the options using Microsoft Learn and the Azure Architecture Center. The RPO and RTO figures quoted are Microsoft's own estimates, and the source says to validate them through DR testing.

## What Microsoft runs and what you run

Learn's [disaster recovery concepts](https://learn.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery-concepts) article says the service has no native DR features. It splits responsibility. You or a partner manage the session hosts, profile management (usually FSLogix), applications, user data and identities. Microsoft manages the control plane. The [service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience) article says that if a web or gateway service instance, or a whole region, becomes unavailable, traffic is redirected to the next closest instance, and that the gateway is reached through Azure Front Door. It also says there is a short period during a database failover when new connections fail, without affecting existing connections. Microsoft's multiregion article adds that you do not need to set up control plane redundancy yourself.

Microsoft's terms: high availability keeps smaller, local outages from interrupting the deployment, business continuity keeps the organization operating during outages of any size, and disaster recovery is getting back to operation after a full outage. Design for availability first, so that fewer events become disasters.

## The patterns side by side

From the [multiregion BCDR article](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr):

| Pattern | RPO (estimate) | RTO (estimate) | What drives cost and effort |
|---|---|---|---|
| Active-active, pooled, Cloud Cache | Seconds to a few minutes | Near zero | Compute and storage in both regions. Limit users to one host pool at a time. |
| Active-passive, pooled, Cloud Cache | Seconds to a few minutes | 15 to 60 minutes | Secondary compute can stay deallocated, but capacity is not guaranteed. An admin triggers failover. |
| Personal host pool, Site Recovery | 5 to 15 minutes (replication frequency) | Minutes per VM, plus domain rejoin and extension reapplication | Replication is configured per VM. No Cloud Cache. |

The same article says a single host pool spread across regions is not recommended for most cases: for pooled pools you cannot enforce regional connection preferences, and drain mode or offline hosts add complexity and waste.

Relative cost in the article: high for active-active, medium for active-passive, medium for personal with Site Recovery.

## Profiles: Cloud Cache or storage replication

User profiles are the data that makes a pooled desktop feel like the user's own. Learn's [FSLogix high availability](https://learn.microsoft.com/en-us/fslogix/concepts-container-high-availability) page is about the same region or data center only: it recommends zone-redundant storage for Azure Files and says standard containers (`VHDLocations`) provide no resiliency of their own. For cross-region recovery the multiregion article uses [FSLogix Cloud Cache](/entity/fslogix-cloud-cache/), which lets you specify several profile storage locations and replicates data asynchronously without relying on storage replication. The article gives this reason: Azure Files Premium does not support geo-redundant storage.

Configuration from the article, under `HKEY_LOCAL_MACHINE > SOFTWARE > FSLogix > Profiles`, value `CCDLocations`:

`type=smb,connectionString=\\primarystgprofiles\profiles;type=smb,connectionString=\\secondarystgprofiles\profiles`

On the secondary host pool you reverse the order, so local storage comes first. Cloud Cache writes to the first reachable provider and replicates to the next. Set it up twice, once for the [profile container](/entity/fslogix-profile-container/) and once for the Office container, whose key is under `SOFTWARE > Policy > FSLogix > ODFC`. You can leave the Office setting off, but the article warns it can misalign data between regions. Learn's Cloud Cache tutorial shows another provider mix, an SMB share plus an Azure page blob account, in the same `CCDLocations` value.

Points that cost people time:

- Only one process can open the same profile file in read-write mode. If a user signs in to the secondary pool while the primary holds the lock, FSLogix logs `ERROR_LOCK_VIOLATION 33 (0x21)` and sign-in fails. Keep `ProfileType` at `0` (the default) so concurrent sessions stay prevented.
- Cloud Cache can lengthen sign-in and sign-out compared with `VHDLocations`, especially on slow storage.
- Size the local cache disk at least as large as the biggest profile, and start with 30 GB per concurrent user. Too small a disk causes sign-in failures. The article recommends Premium managed disks for it.
- Use separate storage accounts for profile and Office containers, plus one for MSIX packages. The article notes Office containers hold rebuildable cache, so you may not need to back them up.

For file storage with [Azure NetApp Files](/entity/azure-netapp-files/), the article says cross-region and cross-zone replication are mutually exclusive per volume, that failover is not transparent, and that failback needs storage reconfiguration. [Azure Files](/entity/azure-files/) can use ZRS for zone resilience where available.

## Session hosts

Microsoft's guidance for compute:

- Spread hosts across [availability zones](/entity/availability-zones/), or use an availability set where zones are missing. The article says not to treat zones as DR, because they do not protect against region-wide disasters.
- Use the same golden image in both regions, replicated through [Azure Compute Gallery](/entity/azure-compute-gallery/).
- Use [scaling plans](/entity/avd-scaling-plan/) to keep most secondary hosts deallocated.
- Remember that quota and reservations do not guarantee physical capacity. Azure reservations lower the price but do not reserve capacity, so on-demand capacity reservations are the route to guaranteed startup.
- A deallocated session host must be started for a few hours at least once every 90 days to refresh its authentication token.

## Personal host pools and Azure Site Recovery

For personal pools each VM stores user data, so the article uses [Azure Site Recovery](/entity/azure-site-recovery/) with the Azure-to-Azure architecture. There is no direct Azure Virtual Desktop integration, so protection is configured per VM, and recovery plans orchestrate groups of VMs. Failover is manual, from the portal, API or PowerShell, and can be scripted.

Specific cautions from Microsoft:

- Do not use test failover. It creates a duplicate VM that registers with the Azure Virtual Desktop control plane and conflicts with the original session host. Start the secondary hosts on a schedule and rehearse with a test group instead.
- Extensions are not maintained during replication, so reapply custom extensions after failover or failback. The `joindomain` and `Microsoft.PowerShell.DSC` extensions apply only at first creation.
- After failover the VM is unprotected, and you must reprotect it before failing back.
- Site Recovery does not guarantee capacity in the target region.

## Failing over active-passive pooled pools

Users keep one workspace in active-passive. The article's procedure, in its own group names:

1. Remove the user groups from the application groups of the primary host pool.
2. Connected users are force disconnected from the primary pool.
3. Assign the same groups to the matching application groups in the secondary pool.
4. Raise secondary capacity by starting session hosts through autoscale or manually.

Fail over every application group, since a partial failover causes profile conflicts. Active-active uses separate workspaces per region and users see duplicate feed entries, so the article says to name them clearly. See [application groups](/entity/avd-application-group/) and [workspaces](/entity/avd-workspace/).

## The control plane scope

Whether the metadata survives a regional database problem depends on the deployment scope. A [regional host pool](/entity/avd-regional-host-pools/) stores metadata in its own region with replicas across availability zones and replication to a paired region where applicable, and the service architecture article says geographical and regional objects cannot be mixed. The multiregion article labels regional host pools public preview and recommends them for new pools. Learn's What's new page lists them as generally available in September 2026, and a Tech Community post announces general availability of regional resiliency. Learn pages can lag behind the announcement, so check the current status before you rely on either. The data locations article lists Central US and East US 2 as supported regions for regional scope; check the announcement for the current region list.

## Checks outside the host pool

- Network: Deploy each host pool in its own spoke VNet and connect the hubs, and confirm that DNS, domain controllers and application back ends are reachable from the secondary region.
- Identity: Microsoft Entra ID is multiregion and needs no action. For AD DS, the article advises at least two domain controllers in the primary region and at least one in the secondary.
- Backup: Use [Azure Backup](/entity/azure-backup/) for Azure Files. The article says you usually need no backup of the DR environment itself.

## Choosing

If a short outage is acceptable and cost matters, active-passive with Cloud Cache is the middle option. If near-zero RTO is required, accept the cost of two live pools. If users have personal desktops, use Site Recovery and plan for per-VM work. Whichever you choose, test it on a schedule with a dedicated test group.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop business continuity and disaster recovery concepts](https://learn.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery-concepts)
- [Microsoft Learn: Multiregion business continuity and disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Azure Virtual Desktop data locations](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: FSLogix high availability options](https://learn.microsoft.com/en-us/fslogix/concepts-container-high-availability)
- [Microsoft Learn: Configure Cloud Cache for FSLogix profile containers](https://learn.microsoft.com/en-us/fslogix/tutorial-cloud-cache-containers)
- [Microsoft Tech Community: Now generally available: Regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
