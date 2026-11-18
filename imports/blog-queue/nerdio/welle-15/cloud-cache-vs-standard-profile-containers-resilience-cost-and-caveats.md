---
title: "Cloud Cache vs standard profile containers: resilience, cost and caveats"
summary: "Standard profile containers (VHDLocations) rely on one storage provider, while FSLogix Cloud Cache (CCDLocations) replicates to several from a local cache. Learn says Cloud Cache is not required for high availability; it costs storage and effort."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-cloud-cache, fslogix]
keypoints:
  - "Standard containers use VHDLocations with no FSLogix-level resiliency. Learn says Cloud Cache is not needed with a highly available provider such as Azure Files with ZRS."
  - "Cloud Cache works from a local cache, writes to all providers asynchronously and hydrates from one. It targets short-term storage problems and, across regions, can be part of a BCDR plan."
  - "Costs: a second storage location, a local cache disk (Learn suggests at least 30 GB per concurrent user to start), more I/O on the VM and longer sign-in and sign-out times."
  - "Learn's caveats: failover to another region is a manual decision, replication is asynchronous, and ungraceful failovers can cause data loss or container corruption."
  - "In Nerdio Manager, Cloud Cache allows up to four paths. Nerdio advises using it only for a clear resiliency requirement, accepting added complexity as the trade-off."
faq:
  - q: "Do I need Cloud Cache for high availability of profile containers?"
    a: "No. Microsoft's FSLogix FAQ says a standard container on a highly available provider can be an acceptable solution, and names Azure Files with zone-redundant storage as a recommended provider. Cloud Cache is the option when you want FSLogix itself to keep replicas on several providers, for example across regions."
  - q: "Is Cloud Cache a backup?"
    a: "Learn describes it as a resiliency and high availability feature; its BCDR page uses \"backup\" only for the standby storage provider. The multiregion article says to use Azure Backup to protect user profile data from data loss or logical corruption. Our reading: because Cloud Cache flushes changes to every provider, a deletion or corruption can be replicated too, so replication does not replace a backup."
  - q: "Can I use Azure page blobs for standard containers?"
    a: "No. Learn's container storage options page lists Azure page blob storage accounts as supported only with Cloud Cache, not with standard containers. It also says the connection string or key is protected security information and must be stored in the VM's credential manager."
---

Standard profile containers keep one copy of the VHD(x) on one storage provider and depend on that provider for availability. Cloud Cache keeps a local copy on the session host and replicates it to several providers. Microsoft's FSLogix FAQ says Cloud Cache is not required for high availability, so the question is whether you need FSLogix-level replication enough to pay for it in storage, VM resources, sign-out time and complexity.

The sources give no prices, so this article compares cost drivers, not amounts. For the mechanics of Cloud Cache itself, see the entity page for [FSLogix Cloud Cache](https://www.m365.fm/entity/fslogix-cloud-cache/).

## The two setups side by side

Learn's page on [high availability options](https://learn.microsoft.com/en-us/fslogix/concepts-container-high-availability) names two options: Cloud Cache (preferred) and standard containers.

| | Standard containers | Cloud Cache |
|---|---|---|
| Registry value | `VHDLocations` | `CCDLocations` |
| Copies of the profile | One, on one provider | A full copy on each listed provider, plus a local cache |
| FSLogix resiliency | None; relies entirely on the provider | Yes, across providers |
| Storage types | SMB shares (Azure Files, Azure NetApp Files, others) | SMB shares, and Azure page blob accounts (Cloud Cache only) |
| Added VM load | Network I/O to the share | Extra I/O and a local cache; Learn calls it a performance and storage requirement |
| Typical resilience design | Azure Files with ZRS | Two or more providers, same region or different regions |

Learn warns that any network, connection, configuration or dependent-resource issue affecting access to an Azure file share can make a session unstable or unresponsive. See also [Azure Files](https://www.m365.fm/entity/azure-files/) and [Azure NetApp Files](https://www.m365.fm/entity/azure-netapp-files/).

## What resilience each one actually gives

### Standard containers on a redundant provider

For Azure Files, Learn strongly recommends zone-redundant storage, which replicates data across three availability zones in the region (not every region supports zones). That protects against the loss of one zone. Our reading: it does not protect against a configuration error on the share or an SMB access problem, and Learn's multiregion article says not to treat availability zones as a disaster recovery solution for region-wide disasters. Several entries in `VHDLocations` are not resiliency either: the settings reference says FSLogix searches them and, if it finds no container, creates one in the first listed location. For Azure NetApp Files, Learn says availability zone placement is the only high availability option and does not provide enough redundancy for standard containers.

### Cloud Cache in one region

Learn says Cloud Cache is designed to insulate users from short-term or intermittent storage issues inside a region or in close proximity. Its example uses two providers in the same region, one Azure Files share and one Azure NetApp Files volume, both listed in `CCDLocations`.

The providers should be unique enough that one outage does not hit both: Azure Files and page blobs together are not. If every provider becomes unhealthy, the local cache keeps working and growing, up to `SizeInMBs`, until one recovers.

### Cloud Cache across regions

With providers in different regions, Cloud Cache can be part of a business continuity and disaster recovery plan. Learn's BCDR page describes primary/failover and active/active layouts. Microsoft's multiregion architecture article recommends Cloud Cache over storage-specific replication because of the many combinations of storage types, replication options and regional limits. GRS cannot be used for regions without a region pair or for the Azure Files Premium tier; for Premium performance with cross-region copies, it says to rely on Cloud Cache. For GRS the article also says RPO and RTO are higher than with Cloud Cache and that production failover and failback testing is not simple. Azure NetApp Files cross-region replication is not available in all regions, excludes cross-zone replication on the same volume, is not transparent on failover and needs storage reconfiguration on failback. The full regional design is in the article "Disaster recovery for Azure Virtual Desktop: options and trade-offs".

## What it costs

### Storage in two places

Learn's BCDR page lists extra cost for storing profile data in two locations, and each provider holds a full copy. If you enable Cloud Cache for both the [profile container](https://www.m365.fm/entity/fslogix-profile-container/) and the [Office container](https://www.m365.fm/entity/fslogix-office-container/), both are replicated; the multiregion article suggests separate storage accounts for the two.

### A local cache disk

Cloud Cache stages data by default in `C:\ProgramData\FSLogix\Cache` on every session host. The multiregion article says to size that disk at least as large as the largest expected profile VHD(x), because an undersized disk causes sign-in failures, and to start with at least 30 GB per concurrent user on Premium managed disks. Our arithmetic: 10 concurrent users start at 300 GB.

Learn's Cloud Cache page says that reusing an existing local cache at the second and later sign-ins is the default and "may lead to low disk space events". The [configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples) set `ClearCacheOnLogoff` to 1, recommended to save disk space and reduce the risk of data loss with pooled desktops.

In Learn's high availability example the local cache sits on the OS disk, with a managed data disk or the temporary disk as alternatives; Learn says temporary disks have many caveats. Nerdio's help strongly recommends Premium SSD and ephemeral OS disks with Cloud Cache, and Standard SSD only for very small environments or testing. Our reading: with [ephemeral OS disks](https://www.m365.fm/entity/avd-ephemeral-os-disks/), check that the VM size's local storage can hold the cache.

### Slower sign-in and sign-out

The multiregion article says Cloud Cache can increase sign-in and sign-out times compared with `VHDLocations`, especially on low-performance storage. The FSLogix FAQ explains that Cloud Cache merges the local cache into all providers and holds the sign-out until the merge finishes. With the reference defaults (`HealthyProvidersRequiredForUnregister` 1, `CcdUnregisterTimeout` 0), a sign-out can be held indefinitely when fewer healthy providers are available than `HealthyProvidersRequiredForUnregister` requires (default 1, so when no provider is available). Remedies are covered in the article "FSLogix Cloud Cache explained: replicating profiles across storage locations".

### More to operate

Learn's prerequisites list `frxccds.exe`, `frxccd.sys`, `%ProgramData%\FSLogix\Cache\*` and `%ProgramData%\FSLogix\Proxy\*` among the antivirus exclusions for Cloud Cache.

## Caveats to plan around

- **Asynchronous replication.** Writes go to all providers in the background, so a provider can trail the local cache. Learn's BCDR page lists latency or inconsistency in profile data as a risk.
- **Two levels of failover.** Learn's multiregion article says that when the first storage location fails or cannot be reached, Cloud Cache automatically fails over to the secondary region. Our reading: the storage failover is automatic, while moving users to a failover region is a separate step. Learn's BCDR page says you have to initiate it manually, which may need business stakeholder approval, and the multiregion article says the active-passive model needs admin intervention.
- **Hydration failure.** If a read cannot be hydrated from any provider, Learn warns of a session hang or possibly a system crash.
- **Ungraceful events.** Learn says BCDR events are rarely or never graceful; users could lose data or see container corruption. Before users fail back, make sure everyone has signed out of the failover location.
- **Restored-location load.** Cloud Cache is I/O intensive and can easily cause network or storage bottlenecks at a restored location.
- **Concurrent access.** The multiregion article says to keep FSLogix's default of no concurrent access to the same profile and to set `ProfileType` to `0`. Users should not connect to both host pools at once: by default the second sign-in fails with `ERROR_LOCK_VIOLATION 33 (0x21)` in the FSLogix log, because Cloud Cache on the first pool's host locks the container files.
- **Not a backup.** The multiregion article recommends Azure Backup against data loss or logical corruption (design area J). See also the article "What to back up in an AVD environment".

Several Learn FSLogix pages, including the BCDR page, carry a notice, still worded as upcoming, about an April 2026 Windows update that changes the default Kerberos encryption type from RC4 to AES-SHA1. The [FSLogix blog](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378) post of 27 March 2026 schedules enforcement from the April 2026 Windows update, with audit mode as a manual rollback until July 2026, when audit mode is removed and enforcement is the only option. It affects Active Directory-integrated SMB shares whose Kerberos encryption is RC4-only or unset; the Azure Virtual Desktop service is not changed.

## Settings that differ

Learn's configuration examples 1 (Standard) and 2 (Standard + High Availability with Cloud Cache) differ in three values:

| Value | Standard example | Cloud Cache example |
|---|---|---|
| Location | `VHDLocations`, one UNC path | `CCDLocations`, a provider list |
| `ClearCacheOnLogoff` | Cloud Cache setting, not listed | 1 (reference default: 0) |
| `HealthyProvidersRequiredForRegister` | Cloud Cache setting, not listed | 1 (reference default: 0) |

`Enabled` (1), `ProfileType` (0) and `VolumeType` (VHDX), among others, are identical in both examples. `CCDLocations` replaces `VHDLocations`; the two must not both be present. Providers are listed in order of proximity, then preference; Cloud Cache reads from the first unless it is unhealthy and writes to all.

The reference defines `HealthyProvidersRequiredForRegister` as the number of healthy providers required for a successful sign-in; at 0, users can always sign in, even with no providers available. Our reading: at 1, a sign-in fails only when no provider is healthy. The examples' footnote words it differently.

## Where Nerdio Manager fits

In [Nerdio](https://www.m365.fm/entity/nerdio/) Manager you go to **Cloud Desktops > Azure Virtual Desktop > Host Pool Profiles**, select **New profile** at the bottom right, choose **FSLogix**, select **Add** in the **FSLogix Profiles storage** area and select **Use Cloud Cache**. You can enter up to four paths and reorder them. The default FSLogix storage is set under **System > Settings > Integrations**, where Nerdio also lists **Use Azure page blobs**. Nerdio's storage comparison says to start with Azure Files Premium. Its guidance says to use Cloud Cache only when there is a clear resiliency requirement, and describes accepting added complexity as the trade-off. Nerdio says replication is asynchronous and that, if one location is unavailable, the session host automatically fails over to an alternate location. Our reading: this is the provider-level failover described above, not a region switch for users.

## How to decide

1. **Name the failure you must survive.** A zone outage points to ZRS and standard containers. For a regional outage, Learn's multiregion article recommends Cloud Cache over storage-specific replication; it also describes GRS (not for Azure Files Premium) and Azure NetApp Files cross-region replication, with the limits above. Learn's configuration examples advise the simplest configuration that fits.
2. **Price the second location.** Add storage, cache disks sized from your largest profile, and the VM sizes needed for the extra I/O.
3. **Test sign-out times** with a pilot group on your actual providers before you roll out.
4. **Decide on regional failover.** Provider failover is automatic; if a person must approve moving users to another region, write the runbook and rehearse it, including fail back.
5. **Consider doing without.** Learn's BCDR page lists "no profile recovery" as an option: lowest infrastructure cost, but users build new profiles after a disaster, which can hurt the user experience.

## Sources

- [Microsoft Learn: High availability options for FSLogix](https://learn.microsoft.com/en-us/fslogix/concepts-container-high-availability)
- [Microsoft Learn: FSLogix Cloud Cache](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-cloud-cache)
- [Microsoft Learn: FSLogix business continuity and disaster recovery options](https://learn.microsoft.com/en-us/fslogix/concepts-container-recovery-business-continuity)
- [Microsoft Learn: FSLogix configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples)
- [Microsoft Learn: FSLogix container storage options](https://learn.microsoft.com/en-us/fslogix/concepts-container-storage-options)
- [Microsoft Learn: FSLogix prerequisites](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: Multiregion business continuity and disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [FSLogix blog: Action required: Windows Kerberos hardening (RC4) may affect FSLogix profiles on SMB storage](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378)
- [Nerdio: FSLogix settings and configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/25499417371661)
- [Nerdio: Which FSLogix profile storage option should I choose?](https://nmehelp.getnerdio.com/hc/en-us/articles/44790523136269-Which-FSLogix-Profile-storage-option-should-I-choose)
