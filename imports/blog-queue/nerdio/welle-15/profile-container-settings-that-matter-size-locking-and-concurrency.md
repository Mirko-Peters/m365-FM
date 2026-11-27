---
title: "Profile container settings that matter: size, locking and concurrency"
summary: "An FSLogix profile container is capped by SizeInMBs, held under an exclusive lock while the user is connected, and meant for one connection at a time by default. This article explains the settings behind those three behaviors and what Microsoft Learn says about each."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [fslogix-profile-container, fslogix]
keypoints:
  - "SizeInMBs (default 30000) is the container's ceiling; you can raise it but not lower it. IsDynamic (default 1) controls up-front allocation, not maximum size."
  - "Learn advises at least 30% free space in a container and warns at less than 2 GB and 500 MB free. Learn's pages differ on whether container size affects sign-in time, so measure."
  - "FSLogix locks the container exclusively while the user is connected. LockedRetryCount and LockedRetryInterval only set retries on a locked VHD(x); they do not allow sharing."
  - "Concurrent connections (second session on the same computer) are not supported on AVD hosts. Multiple connections need differencing disks and ProfileType 3, and not within one host pool."
  - "VHD disk compaction runs at sign-out for dynamic containers over 1 GB with at least 20% recoverable space, for up to 5 minutes. A reconnect during compaction finds the disk in use."
faq:
  - q: "Can I make a profile container smaller by lowering SizeInMBs?"
    a: "No. Microsoft Learn says you can increase SizeInMBs at any time but cannot decrease it, and that lowering the value does not shrink existing containers. Learn documents VHD disk compaction at sign-out as the mechanism that decreases the size on disk of a dynamic container; it only runs when its thresholds are met."
  - q: "Does a longer lock retry make two sessions of the same user work?"
    a: "No. LockedRetryCount and LockedRetryInterval only control how long FSLogix waits for a locked VHD(x) before giving up. Two simultaneous sessions need a configuration Learn documents for concurrent or multiple connections. Learn says concurrent connections are not supported on Azure Virtual Desktop host pool session hosts, and its configuration examples say Azure Virtual Desktop does not support multiple connections within the same host pool."
  - q: "Can the same user use OneDrive in two sessions that share a container?"
    a: "Learn says OneDrive does not support concurrent or multiple connections that use the same container under any circumstance. If users run OneDrive inside the container, plan for one connection per user."
---

A profile container has a size ceiling, an exclusive lock and, by default, one connection per user. Three groups of settings control those behaviors: SizeInMBs and IsDynamic for size, the LockedRetry values for locking (plus ReAttach for unexpected disconnects), and ProfileType for concurrency. It covers free-space planning, the compaction rule, lock wait arithmetic and the concurrency cases, with the values Microsoft Learn gives.

For Group Policy templates, the full settings list and recovery, see the site's articles on [FSLogix Group Policy settings](https://www.m365.fm/community/u/mirko-p/blog/fslogix-group-policy-settings-that-matter-most/), [profile corruption](https://www.m365.fm/community/u/mirko-p/blog/fslogix-profile-corruption-causes-and-recovery/) and [users who get a local profile](https://www.m365.fm/community/u/mirko-p/blog/fslogix-users-get-local-profile-instead-of-container/).

## Size: the ceiling

The [profile container](https://www.m365.fm/entity/fslogix-profile-container/) is a VHD(x) file, and its maximum size comes from Learn's [configuration reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles). SizeInMBs defaults to 30000. New containers are created at that size and existing ones are extended to it at sign-in. You can increase it at any time but not decrease it, and lowering it does not shrink existing containers. IsDynamic defaults to 1, a file that grows on disk as needed; 0 means a fixed size that is fully allocated. VHDCompactDisk defaults to 1 and tries to compact the VHD at sign-out.

Learn states that IsDynamic set to 1 does not let a container grow beyond SizeInMBs. If a user outgrows the limit, the user sees errors. Dynamic therefore saves storage; it does not give headroom.

The reference lists VHDCompactDisk and CleanupInvalidSessions under HKLM\SOFTWARE\FSLogix\Apps, not under the Profiles key like the other settings here.

A worked example, using our arithmetic and ignoring snapshots and overhead: 100 users with fixed 30000 MB containers allocate 3,000,000 MB, roughly 3 TB, on the share once all 100 users have signed in at least once. Learn does not say whether MB in SizeInMBs means 10^6 or 2^20 bytes; read as binary, the figure is about 2.9 TiB or 3.1 TB. The same 100 users on dynamic containers start small and grow as profile data accumulates, up to the same 30000 MB ceiling, and shrink when compaction runs (rules below).

### How much free space to plan

Learn's [FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq) says that a container reaching its limit can cause strange application behavior or trouble reaching files. It advises planning for at least 30% free space and monitoring the event logs or log files for warning events at less than 2 GB and less than 500 MB of free space. With dynamic disks, raising SizeInMBs enlarges the container at the next sign-in. Learn's [VM sizing guidance](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines) lists 30 GB as the minimum profile storage for each workload type; it is a starting point and not a measured value for your users.

On sign-in time, Learn's pages differ. The FAQ answers "No" to whether container size affects sign-in performance. The [Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary) says that how long profile loading takes depends on user profile size, and that large profile sizes can slow launch times. The pages do not reconcile this, so measure sign-in on your own hosts.

With the [Office container](https://www.m365.fm/entity/fslogix-office-container/) in a dual-container setup, both containers carry their own SizeInMBs, which also defaults to 30000. In our reading, splitting therefore lifts the combined ceiling per user; set the two values deliberately.

### Compaction and what it needs

Learn's [VHD disk compaction page](https://learn.microsoft.com/en-us/fslogix/concepts-vhd-disk-compaction) describes how a container shrinks on disk. It runs at every sign-out, is enabled by default, and covers profile and Office containers, including Cloud Cache setups. FSLogix compacts only if both conditions hold:

1. The container is larger than 1 GB on disk.
2. The space that can be recovered, consumed size minus the minimum supported size, is at least 20% of the consumed size.

Learn's examples: 6 GB consumed with a 2.5 GB minimum recovers 3.5 GB against a 1.2 GB threshold, so compaction runs. 12 GB consumed with a 10 GB minimum recovers 2 GB against a 2.4 GB threshold, so it does not. Fixed-size disks cannot be compacted, and the Optimize Drives service (defragsvc) must not be set to Disabled. The FAQ says the threshold is not configurable.

Compaction can add time to sign-out. Learn gives an average of 20 to 30 seconds, a maximum of 5 minutes per sign-out with work resuming at the next one, and says Winlogon warnings for sign-outs over 60 seconds are normal. The FAQ adds a side effect for locking, covered next: if a user disconnects during sign-out and reconnects before compaction ends, the disk is in use and, under default conditions, the user is signed in with a temporary profile.

## Locking: what the retry settings do

By default FSLogix prohibits a user from using their container in more than one connection. Learn's [lock troubleshooting page](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-locked) says FSLogix keeps an exclusive lock on the container while the user is connected and concurrent connections are disabled.

A repeat sign-in inside one pooled host pool usually does not reach that lock. Learn's [load balancing page](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) says a user with an active or disconnected session in the host pool who signs in again is redirected to the session host with the existing session, so it is a reconnect. LockedRetry applies when a VHD(x) is open by another process or computer, for example (our reading) a sign-out or compaction still running, or a host outside the pool that uses the same share.

LockedRetryCount × LockedRetryInterval defaults to 12 × 5 s, about 60 s of retrying by our multiplication. Learn's recommended value is 3 × 15 s, about 45 s. The recommended values appear in Learn's [configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples) and in its [how-to for configuring profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers), which describes them as decreasing the retry timing to enable a faster fail scenario. Treat both results as estimates and measure on your own hosts.

ReAttachRetryCount × ReAttachIntervalSeconds (default 60 × 10 s, recommended 3 × 15 s) applies when a container disconnects unexpectedly, not to a second sign-in. The [Group Policy article](https://www.m365.fm/community/u/mirko-p/blog/fslogix-group-policy-settings-that-matter-most/) lists the same values next to other settings.

Two related settings, **PreventLoginWithFailure** and **PreventLoginWithTempProfile** (both default 0), decide what the user sees when the wait ends. Set to 1, FSLogix loads the FRXShell and the user's only option is to sign out. Learn's lock page spells the first one PreventLogonWithFailure; the reference spells it PreventLoginWithFailure, so use the reference name in your policy. Which is better, a visible failure or a temporary profile, is a policy choice. A temporary profile lets the user keep working but is not the user's container; blocking sign-in avoids that and, in our reading, creates helpdesk calls. The [local profile article](https://www.m365.fm/community/u/mirko-p/blog/fslogix-users-get-local-profile-instead-of-container/) covers the symptom in detail.

A different lock cause is a session that ended abruptly, so the VHD(x) is not cleanly detached and the next sign-in may not be able to attach it. For that, Learn's lock page points to **CleanupInvalidSessions** (default 0), but also says to prioritize environmental or system issues that address the root cause rather than the symptom. The [profile corruption article](https://www.m365.fm/community/u/mirko-p/blog/fslogix-profile-corruption-causes-and-recovery/) covers abrupt session ends.

## Concurrency: standard, concurrent and multiple connections

Learn's [concurrent and multiple connections page](https://learn.microsoft.com/en-us/fslogix/concepts-multi-concurrent-connections) separates three cases:

| Case | Meaning | Supported how |
|---|---|---|
| Standard | One remote session on one Windows computer | Default, ProfileType 0 |
| Concurrent | A second session for the same user on the same computer | Extra registry entries; not supported on session hosts in an Azure Virtual Desktop host pool |
| Multiple | A new session on a different computer for the same user | Differencing disks only; the configuration examples page says Azure Virtual Desktop does not support multiple connections within the same host pool |

On [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/), concurrent connections are out. For multiple connections, Example 6 lists separate pools of virtual machines as a prerequisite and says multiple connections within the same host pool are not supported. The concurrent and multiple connections page names the Azure Virtual Desktop limit only for concurrent connections, and the two pages do not reconcile this. Example 6 is also inconsistent: a table says ProfileType 3 while the registry tables show 0. Check the live page before copying a value.

### ProfileType values

| Value | Learn's meaning |
|---|---|
| 0 | Normal profile behavior (default) |
| 1 | This machine should only be the read/write instance |
| 2 | This machine should only be the read-only instance |
| 3 | Try to take the read/write role; fall back to read-only |

Learn's guidance: sessions that use the VHD concurrently should have matching ProfileType settings, 0 must not be mixed with any other value, and if the VHD is not accessed concurrently ProfileType should be 0. For concurrent or multiple connections the page requires 3, and concurrent connections additionally need fDenyTSConnections and fSingleSessionPerUser set to 0 under HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server.

With ProfileType 3, the first client takes the read/write role, and the read/write difference disk RW.VHD(x) sits next to the parent file on the share. Later clients take the read-only role, with a local difference disk named %usersid%_RO.VHD(x) in the temp directory. Learn says merges can be interrupted and continued, and only happen when no open handles remain on either disk. The concurrent and multiple connections page describes the read-only difference disk and the merge rules but not what happens to changes made in a read-only session, and Example 6 on the configuration examples page says only that one session allows writes to the base VHD disk. Test the behavior before promising users anything. The reference describes DiffDiskParentFolderPath (default %TEMP%) as the path where difference disks are created; neither page says how that relates to the RW disk's location on the share.

The Office container uses a different setting, VHDAccessMode, with its own values and a session-VHD cap of 10; the [Office container article](https://www.m365.fm/community/u/mirko-p/blog/fslogix-office-container-when-to-separate-office-data-from-the-profile/) covers it. For both container types, Learn is explicit that OneDrive does not support concurrent or multiple connections to the same container. For Cloud Cache, the FAQ's sign-out guidance says not to use ProfileType = 3 or VHDAccessMode = 1, 2 or 3.

## A short pilot plan

1. Record SizeInMBs and IsDynamic on the hosts, and pick a ceiling from measured profile sizes, not from the 30 GB sizing minimum.
2. Create a test user with a profile over 1 GB on a dynamic container, with defragsvc not Disabled, delete data, sign out, and check whether size on disk shrinks. Compare the result with the 20% rule.
3. Plan for at least 30% free space in each container, as the FAQ advises, and watch the event logs or log files for the FSLogix warnings at less than 2 GB and less than 500 MB free.
4. While a test user's first session is still connected, sign the same user in on a host outside that host pool that uses the same share (our suggestion for a lab). Note how long the second sign-in waits and what it shows with your PreventLogin settings. Inside one pool, expect a reconnect instead.
5. Decide whether any user group needs multiple connections; if so, test ProfileType 3 in a lab first, bearing in mind the Azure Virtual Desktop limits above, and keep OneDrive out of that scenario.

## Sources

- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles)
- [Microsoft Learn: Concurrent and multiple connections to a single container](https://learn.microsoft.com/en-us/fslogix/concepts-multi-concurrent-connections)
- [Microsoft Learn: VHD disk compaction](https://learn.microsoft.com/en-us/fslogix/concepts-vhd-disk-compaction)
- [Microsoft Learn: Issues with container lock or in use](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-locked)
- [Microsoft Learn: FSLogix frequently asked questions](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: FSLogix configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: Session host VM sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
