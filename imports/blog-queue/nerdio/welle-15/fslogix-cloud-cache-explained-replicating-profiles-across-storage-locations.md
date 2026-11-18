---
title: "FSLogix Cloud Cache explained: replicating profiles across storage locations"
summary: "Cloud Cache keeps a local copy of the user's container and replicates changes in the background to up to four storage providers. This article explains the mechanics, the settings that control sign-in and sign-out, and what the feature does not do."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-cloud-cache, fslogix]
keypoints:
  - "Cloud Cache is not a container type but an option for profile and Office containers: sessions use a local cache, and changes are flushed to up to four providers in CCDLocations (SMB or page blob)."
  - "Reads come from the first listed provider unless it becomes unhealthy; writes go to all providers. Order providers by proximity, then preference."
  - "At sign-out Cloud Cache holds the user until providers match. HealthyProvidersRequiredForUnregister defaults to 1 and CcdUnregisterTimeout to 0, which can hold a sign-out indefinitely."
  - "Cloud Cache needs VM resources for extra I/O and the local cache. If a read cannot be hydrated from any provider, Learn warns of a session hang or a system crash."
  - "Microsoft's FAQ says Cloud Cache is not required for high availability and standard containers on zone-redundant Azure Files are acceptable; another page calls Cloud Cache preferred."
faq:
  - q: "Is Cloud Cache a different kind of profile container?"
    a: "No. Learn says Cloud Cache is not a type of container but an optional configuration for the profile and Office container types. You switch it on by using CCDLocations instead of VHDLocations; the two must not both be present."
  - q: "How many storage providers can Cloud Cache use, and which types?"
    a: "The settings reference says CCDLocations supports SMB and Azure Blob types with up to four remote container locations. The storage options page adds that Azure page blobs are used in Cloud Cache containers only. For a page blob provider, Learn says to use a protected connection string rather than plain text."
  - q: "Why can sign-out take long with Cloud Cache?"
    a: "Learn's FAQ says Cloud Cache updates providers lazily during the session, and at sign-out it merges all data from the local cache to all listed providers. Under-performing or high-latency providers take longer, and FSLogix holds the sign-out until the operation is complete."
---

Cloud Cache is an FSLogix configuration in which each session works against a locally mounted copy of the user's container, while changes are replicated in the background to one or more remote storage providers. Microsoft Learn says it exists to insulate users from short-term or intermittent storage issues, and, with providers in different regions, it can form part of a business continuity or disaster recovery plan. This article explains how it works; the comparison with standard containers, including cost and caveats, is in the companion article "Cloud Cache vs standard profile containers: resilience, cost and caveats".

## What it is, and what it is not

[Cloud Cache](https://www.m365.fm/entity/fslogix-cloud-cache/) works with the [profile container](https://www.m365.fm/entity/fslogix-profile-container/) and the [Office container](https://www.m365.fm/entity/fslogix-office-container/). Learn says it is not a container type but an optional configuration of those two. You enable it by listing providers in `CCDLocations` instead of `VHDLocations`, and the two settings must not both be present.

Learn also names the cost: Cloud Cache puts a performance and storage requirement on the virtual machine, to accommodate the extra I/O and the local cache. FSLogix is not a storage provider itself and relies on the architecture of the providers you choose.

## The moving parts

### The local cache

On a first sign-in, FSLogix creates the container locally, stores data read from the remote provider and data written by the session, and the User Profile Service builds the profile in that local cache. On later sign-ins FSLogix looks for an existing local cache. Learn notes that looking for a local cache is the default and might lead to low disk space events; the `ClearCacheOnLogoff` setting (default 0) removes the cache at sign-out. The Cloud Cache tutorial recommends 1 for pooled desktops, to save local disk space and reduce the risk of data loss.

The default cache location is `C:\ProgramData\FSLogix\Cache`, set by the `CacheDirectory` value under `HKLM\SYSTEM\CurrentControlSet\Services\frxccd\Parameters`. Learn says the location must be highly available and high performing, with characteristics similar to SSD or NVMe storage. In the reference configuration on the high availability page, the cache sits on the same disk as the operating system; a managed data disk or a temporary disk are named as alternatives, and the page says temporary disks have many caveats to review before production use. `CacheDirectory` is set before Group Policy is applied, so in gold-image environments Group Policy cannot be relied on to set it, and it must differ from `ProxyDirectory` (default `C:\ProgramData\FSLogix\Proxy`).

### Proxy file, queue files and index files

Learn describes a proxy file named `Profile_<username>.vhd` that is not a true VHD. It processes all writes destined for the local cache; its size on disk is zero. Writes are buffered and tracked, then written as `*.index` objects, which hold batches of block-level changes. A `*.queue` file exists per remote provider and tracks the index files that have not yet flushed. Two auxiliary files control sequence and ownership. A lock file on the remote providers shows which VM holds the I/O lock, and a meta file uses sequence numbers to show which provider has the most recent data. Learn says these two auxiliary files are not meant to be opened or used outside the product, and that relevant information from them is made available through log files and event log entries.

### Hydrate, flush and clone

Three operations describe the data flow:

- **Hydrate**: when the local cache lacks data the file system asks for, Cloud Cache reads and copies it from one remote provider.
- **Flush**: changes go to all providers at the same time, each on its own thread. Learn says FSLogix does not throttle this and uses as much throughput as the system allows. A flush also happens at sign-out, and after an unhealthy provider recovers.
- **Clone**: if at sign-in a provider is not at the same sequence, a full VHD(x) clone runs, and pending writes stay in the local cache until all providers match.

## Providers and their order

`CCDLocations` takes one entry per provider. Within an entry, the `type`, an optional `name` and the `connectionString` are separated by commas, and the entries for several providers are joined with a semicolon. The reference describes the delimiter only as a semicolon; the Learn examples show this structure. The type is `smb` or `azure`, and a name containing a space goes in double quotes. Learn's example mixes an Azure Files share and a page blob account:

```
type=smb,name="AZURE FILES PROVIDER",connectionString=\\<storage-account>.file.core.windows.net\<share>;type=azure,name="AZURE BLOB PROVIDER",connectionString="|fslogix/<key-name>|"
```

Rules from the reference page: do not use spaces around delimiters; parameters and values are case sensitive, so `type=smb` is correct and `type=SMB` is not; the `smb` connection string must be the full UNC path; the `azure` connection string must name a protected key. Learn cautions against a plain-text connection string for page blob providers, and says the key or connection string must be stored in the VM's credential manager. The setting supports up to four locations.

Order matters. The first location is the primary provider and the only one used for reads, unless it becomes unhealthy; all providers are used for writes. Learn says to list providers in order of proximity, then preference. Only one provider is used when data is hydrated, but data is written to all, and a provider that lags behind the local copy can indicate an under-performing storage provider. Learn also warns that `Ping` and `Test-NetConnection` results are not transactional I/O and are poor indicators of provider performance.

Learn's example for same-region resilience uses Azure Files with zone-redundant storage plus Azure NetApp Files. It says that combination isolates failures better than two Azure Files shares, two Azure NetApp Files volumes or two page blob accounts, and that Azure Files and page blobs together are not different enough to give sufficient isolation.

## Sign-in and sign-out behaviour

These settings decide what happens when providers are unhealthy. Learn marks them as needing care, because some combinations can discard local data without any provider being updated.

| Setting | Default | What it does |
|---|---|---|
| `HealthyProvidersRequiredForRegister` | 0 | Number of healthy providers needed to sign in. At 0, users can sign in even with no providers available. |
| `HealthyProvidersRequiredForUnregister` | 1 | Number of healthy providers needed to sign out. Below that, sign-out is prevented for the time in `CcdUnregisterTimeout`. 0 is not recommended. |
| `CcdUnregisterTimeout` | 0 | Seconds a sign-out is delayed. At 0 the sign-out is held until enough providers are available, which Learn says may be infinite. |
| `ClearCacheOnForcedUnregister` | 0 | At 0 the local cache is kept when the timeout expires and the session closes, so data can be recovered, then the cache must be deleted manually. At 1 it is removed. |
| `ClearCacheOnLogoff` | 0 | Removes the local cache at sign-out when set to 1. |

The configuration examples and the tutorial set `HealthyProvidersRequiredForRegister` to 1. The reference defines the setting as the number of healthy providers required for a successful sign-in, so at 1 one healthy provider is enough: a user can still sign in when one of two providers is down, and the sign-in fails only when no provider is healthy. To require more providers, set a higher number. The tutorial's footnote says the value prevents a local cache when at least one provider is unhealthy; our reading, based on the reference, is that it is a minimum count, not an all-providers rule. When you set it to anything other than 0, Learn says to also use `PreventLoginWithFailure` or `PreventLoginWithTempProfile` to shape the user experience. The setting `CcdMaxCacheSizeInMBs` was retired on 11 February 2025.

If all providers become unhealthy mid-session, the local cache continues to operate and grow, up to the container maximum set by `SizeInMBs`. The warning to remember: if a read cannot be hydrated from any provider, Learn says this causes a session hang or worse a system crash.

## Setting it up

Per the tutorial, under `HKLM\SOFTWARE\FSLogix\Profiles` set `Enabled` to 1 and `CCDLocations` to the string above, plus the values it marks as recommended: `ClearCacheOnLogoff` 1, `HealthyProvidersRequiredForRegister` 1, `DeleteLocalProfileWhenVHDShouldApply` 1, `FlipFlopProfileDirectoryName` 1 and `VolumeType` vhdx. The tutorial also recommends shorter retry timing for a faster failure: `LockedRetryCount` 3, `LockedRetryInterval` 15, `ReAttachRetryCount` 3 and `ReAttachIntervalSeconds` 15. These are the tutorial's recommendations, not defaults; the profile container defaults are 12, 5, 60 and 10 for the same four settings. Remove `VHDLocations`. For an Office container use the same approach under `HKLM\SOFTWARE\Policies\FSLogix\ODFC`.

Two of the recommended values need care. `DeleteLocalProfileWhenVHDShouldApply` makes FSLogix permanently delete a local profile when a user should have a profile container. If you enable or change `FlipFlopProfileDirectoryName` after containers exist, FSLogix looks for folders under the new naming, does not find them and creates new empty profiles; the original data stays in the old folder until the setting is reverted or the container is moved. Learn's configuration examples say the `FlipFlopProfileDirectoryName` recommendation applies to new deployments; our reading is to apply the whole list as is only to a new deployment and to check the effect on existing profiles first.

The tutorial lists a page blob connection string stored in a credential manager with the `frx` utility as a prerequisite. Learn's FSLogix pages also carry a notice that the April 2026 Windows Server update changes the default Kerberos encryption type from RC4 to AES-SHA1, and that file shares hosting containers not upgraded to AES-SHA1 might have access issues, which is relevant for SMB providers.

To verify, open Event Viewer at **Applications and Services Logs > Microsoft > FSLogix > CloudCache > Operational**. Event ID 56 shows which providers are online and event ID 5 shows the lock on the proxy file. Also check the per-user cache folder under `C:\ProgramData\FSLogix\Cache`.

## Behaviour that surprises administrators

- **Sign-out time.** The FAQ lists remedies for slow sign-outs: review network latency to every provider, move a provider to a higher tier, disable `VHDCompactDisk`, and avoid `ProfileType` 3 or `VHDAccessMode` 1, 2 or 3. With Cloud Cache, compaction downloads the full disk at sign-out, evaluates it and, if or when compaction completes, uploads it to the providers.
- **Concurrent sessions.** The overview calls the lock file critical when `ProfileType` is 3, while the FAQ lists `ProfileType` 3 among the settings to avoid when sign-out is slow. The reference says all sessions using a VHD concurrently should use matching `ProfileType` values, and that OneDrive does not support multiple concurrent connections to the same profile.
- **Disaster recovery.** Learn's BCDR page says replication to the providers is asynchronous, failover is started manually, and fail-back should wait until all users have signed out of the failover location. It also warns that such events are rarely graceful and profile data may not be intact.
- **High availability.** The FAQ says Cloud Cache is not required for it, while the high availability page lists Cloud Cache containers as the preferred option. The companion article weighs the two.

## Sources

- [Microsoft Learn: Cloud Cache overview](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-cloud-cache)
- [Microsoft Learn: Types of containers](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: Tutorial: Configure profile containers with Cloud Cache](https://learn.microsoft.com/en-us/fslogix/tutorial-cloud-cache-containers)
- [Microsoft Learn: Container high availability](https://learn.microsoft.com/en-us/fslogix/concepts-container-high-availability)
- [Microsoft Learn: Business continuity and disaster recovery for FSLogix containers](https://learn.microsoft.com/en-us/fslogix/concepts-container-recovery-business-continuity)
- [Microsoft Learn: Container storage options](https://learn.microsoft.com/en-us/fslogix/concepts-container-storage-options)
- [Microsoft Learn: FSLogix configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
