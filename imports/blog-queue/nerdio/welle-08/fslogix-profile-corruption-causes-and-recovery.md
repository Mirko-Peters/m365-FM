---
title: "FSLogix profile corruption: causes and recovery"
summary: "A failed attach, temporary profile or hung sign-out can point to a damaged FSLogix container, but locks, permissions, full disks or a changed naming setting are often the cause. Sorts causes, logs and recovery options."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-profile-container]
keypoints:
  - "Triage first: locks, permissions, a full container or share and a changed naming setting look like corruption but have fixes that keep the VHD(x) intact."
  - "Learn ties corruption to antivirus scanning, the older VHD format, deleting data inside a container and ungraceful Cloud Cache failovers. Abrupt sessions are documented as lock problems, not damage."
  - "FSLogix status and reason codes in the Profile log and the Sessions registry key separate open, attach, initialize and format failures (codes 11, 12, 15, 17); locks show in the Windows error code."
  - "Azure Backup restore and frx are documented, but Learn gives no recovery procedure for a damaged VHD(x). The options here are our combination of those tools, so work on copies."
  - "Prevention is mostly configuration: VHDX, the antivirus exclusion list, a simple redirections.xml, monitored capacity, a current FSLogix version and a tested backup."
faq:
  - q: "Does FSLogix repair a corrupted VHDX automatically?"
    a: "The Learn pages listed under Sources do not describe an automatic repair of a damaged container. The frx utility reference describes attaching and copying containers, not repair. Practical options, combined by us from general tools, are restoring from a backup or moving readable data into a new container."
  - q: "Is a temporary profile a sign of a corrupted container?"
    a: "Not necessarily. Learn lists many other causes of a temporary or local profile: FSLogix not enabled, a wrong VHDLocations value, missing storage permissions, a container in use on another computer, an existing local profile and a full storage provider. Read the Profile log first."
  - q: "Does VHDX reduce the risk compared with VHD?"
    a: "Learn's profile container configuration page recommends VHDX because of its supported size and reduced corruption scenarios. The VolumeType default is vhd, and the setting applies to newly created files, so, in our reading, existing VHD containers stay as they are until they are migrated."
---

A damaged FSLogix container does not announce itself. Users get a temporary profile, a blank desktop, a failed sign-out or a profile that will not attach, and the cause can just as well be a lock, a full container, a permission problem or a naming change. This article separates real damage from look-alikes, lists the causes Microsoft Learn documents, and compares recovery options.

One limit up front. Learn's page on container corruption covers antivirus scanning and redirections.xml and gives no repair steps; the attach, lock and naming pages describe no repair of the VHD(x) file either.

## Step 1: Rule out the look-alikes

These causes, listed on Learn's troubleshooting pages, give the same symptom as a damaged [profile container](https://www.m365.fm/entity/fslogix-profile-container/):

| Symptom in the log or on screen | Cause documented by Learn | Fix documented by Learn |
|---|---|---|
| `Operation 'AcquireExclusiveLock' failed`, error 0xa7, `FrxStatus: 33` | Container in use on another computer; FSLogix keeps an exclusive lock while a user is connected | Allow a temporary profile, teach users to sign out first, or use multiple connections (conditions and a OneDrive warning in Step 3). After an abrupt disconnect the SMB handle can stay open: confirm the user is signed out everywhere (`qwinsta`, Task Manager Users tab), then on a Windows file server close the container's file under Computer Management > Shared Folders > Open Files. For Azure Files, Learn points to orphaned handles or leases |
| `Attach vhd(x) failed, file is locked ... (Access is denied.)`, `FrxStatus: 31` | Missing NTFS, share or Azure RBAC permissions; Learn's wrong-credentials example also ends in `FrxStatus: 31` | Configure SMB storage permissions |
| Access problems on a share that worked before | Learn's Important note is still worded as an upcoming change (default Kerberos encryption type from RC4 to AES-SHA1). The FSLogix blog of 27 March 2026 says it applies from the April 2026 Windows cumulative update to SMB storage with Active Directory when the relevant AD objects or service accounts are RC4-only or unset; audit mode stayed available as a manual rollback until July 2026 | Per the blog: find RC4-only or unset settings, move them to AES-SHA1, check sign-in and profile access |
| Container fails to attach, user sees errors | Size on disk reached SizeInMBs; the container must have more than 200 MB to attach | Raise SizeInMBs (it cannot be lowered); FSLogix extends existing containers at sign-in |
| New empty profile, no temporary profile | A naming setting (`FlipFlopProfileDirectoryName`, `SIDDirNameMatch`, `SIDDirNamePattern`, `VHDNameMatch`, `VHDNamePattern`) changed after containers existed | Revert the setting or rename the folders; the data is not lost and stays at the old path |
| Hung session, failed mount or detach | Storage provider is full | Add capacity |

## Step 2: Read the status and reason codes

The Profile log is the main evidence: `Profile_%date%.log` in `C:\ProgramData\FSLogix\Logs\Profile`, with `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` lines whose codes come from Windows. Search for `LoadProfile: <username>` and follow the process ID.

FSLogix also stores a Status, Reason and Error value per session, for profile containers under `HKLM\Software\FSLogix\Profiles\Sessions\<SID>`. The status codes that matter for a suspect file include 11 (cannot open the virtual disk), 12 (cannot attach), 15 (cannot initialize the disk) and 17 (error while formatting). Status 27 (cannot find the disk at the given location) points, in our reading, to path, name or access instead: Learn's example pairs it with error 1326. Reason codes clarify normal status codes and are not used with error status codes. In our reading, a cannot-open, cannot-attach or cannot-initialize status that stays after locks, permissions and space are ruled out points toward the file itself. Learn does not say these codes indicate corruption.

## Step 3: Separate documented corruption causes from other failure causes

Learn's page on container corruption or missing data says antivirus products are "one of the most common occurrences of container corruption". Other pages add a few more conditions; a second group leaves containers in a bad state without Learn calling it damage.

### Documented as corruption or data loss

**Antivirus and security tools.** Scanning data into or out of a container can lead to corruption. Learn's prerequisites page lists exclusions (`*.VHD`, `*.VHDX` and the `.lock`, `.meta` and `.metadata` files) and says that without them security tools can lock or corrupt files. For the mount points it lists `ERROR_SHARING_VIOLATION`, temporary profiles and logoff hangs as symptoms, and says to apply them in every layer, including network scanning and data loss prevention.

**The VHD format.** The profile container configuration page recommends VHDX over VHD because of its supported size and reduced corruption scenarios. The `VolumeType` default is `vhd`.

**Editing contents.** Deleting the wrong data from a container can cause data loss or profile corruption.

**Ungraceful failover.** In its Cloud Cache failover options, Learn says disaster events are rarely graceful and users who sign in to session hosts in the failover region could experience data loss or, in worse cases, container corruption. It advises keeping business-critical data out of the profile and using OneDrive, SharePoint or similar.

**OneDrive placeholder files.** FSLogix 26.08 fixed OneDrive cloud-only placeholder files that could be corrupted when files were mirrored back, causing sync errors or a sync client crash loop, and a case where unlinking OneDrive during a session could lead to data loss.

### Documented as other failure causes

**redirections.xml.** A misconfigured file can give unexpected results; Learn advises keeping it simple.

**Sessions that end abruptly.** The `CleanupInvalidSessions` description says the mounted VHD(x) might not be detached properly and the next sign-in may not attach it. Enabling the setting (under `HKLM\SOFTWARE\FSLogix\Apps`, default 0) lets FSLogix clean up invalid sessions. The known issues page lists a bug in version 26.01 (3.26.102.18413) where the setting stopped Office containers from being created or mounted when profile and Office containers were both enabled; the release notes list the fix in 26.01 CU1 (3.26.126.19110).

**Concurrent and multiple access.** Concurrent connections (a second session on the same computer) are not supported on session hosts in an Azure Virtual Desktop host pool. Multiple connections (a session on a different computer) need differencing disks with `ProfileType` 3 and, per Learn, no other configuration. Learn warns that OneDrive does not support concurrent or multiple connections using the same container, under any circumstance, and repeats this for `ProfileType` and `IncludeOneDrive`. Learn does not describe any of this as a cause of damage.

**A sector size mismatch.** `VHDXSectorSize` should not be used unless Microsoft Support directs it, because a mismatch can lead to a BSOD.

**Product bugs.** The known issues page lists 25.02 defects, among them containers that did not detach and a Recycle Bin corrupted message; the release notes list fixes in 25.04. FSLogix 26.08 (3.26.826.17182) fixed a locked or unresponsive container that could block all sign-ins and sign-outs on a host until reboot, and a stuck storage provider that could hang sign-out and leave containers attached. Learn says customers are required to install and use the latest version.

**Cloud Cache.** If a read cannot be hydrated from any remote provider, Learn warns of a session hang or a system crash. See [FSLogix Cloud Cache](https://www.m365.fm/entity/fslogix-cloud-cache/).

## Step 4: Recover, from least to most invasive

This order combines documented tools with ordinary file handling. Our own steps are marked.

1. **Stop users and sessions touching the file.** FSLogix holds an exclusive lock while the user is connected, so confirm the user is signed out everywhere and clear orphaned handles as described in Step 1.
2. **Work on a copy** (own recommendation, not from Learn). Copy the VHD(x) to a separate location before you try anything.
3. **Inspect with the frx utility.** From `C:\Program Files\FSLogix\Apps`, `frx edit-profile -filename <path>` attaches the file and opens Explorer and the Registry Editor on its contents. `begin-edit-profile` and `end-edit-profile` attach and detach the VHD(x) and its registry hive, the latter using the cookie that the former prints. They show whether the data can be read.
4. **Restore from backup.** For [Azure Files](https://www.m365.fm/entity/azure-files/) shares protected by [Azure Backup](https://www.m365.fm/entity/azure-backup/), the portal offers full-share and item-level recovery, to the original or an alternate location, with skip or overwrite on conflict. Vaulted backup supports full-share recovery only. A full-share restore to the original location needs a recovery point with the Snapshot or Snapshot and Vault-tier recovery tier; in our reading, a vault-only recovery point therefore needs an alternate location, where the target share needs 20 percent more free space than the restored data. Because overwrite on a full-share restore touches every container, in our reading restore to an alternate location and copy back the one file.
5. **Move the data into a new container.** `frx migrate-vhd -src <old> -dest <new>` creates and formats a VHD(x) and mirrors the source; it defaults to 30 GB and dynamic sizing. `frx copyto-vhd` copies a folder into a VHD(x); `frx copy-profile` copies a local profile and needs `-size-mbs` above 5000 for profiles over 5 GB. Learn does not say how they behave on a damaged source, so test first.
6. **Let FSLogix create a fresh container** (own recommendation, not from Learn). With the user signed out and a copy kept, move or rename the damaged VHD(x) out of the user's folder. Learn's `VHDLocations` description says that if no container is found, one is created in the first listed location, and the naming-setting page describes the same for a changed naming setting. Neither presents this as a recovery step for a damaged container, so test with one user first.

## Comparing the options

| Option | Keeps data | Learn documents it for corruption | Main limit |
|---|---|---|---|
| Restore from Azure Backup | Data as of the restore point | Restore is documented; the link to FSLogix damage is not | Needs a backup; original-location restore needs a snapshot recovery point |
| Inspect and copy with frx | Whatever is readable | Tools are documented, repair is not described on these pages | Unknown behavior on a damaged file |
| New empty container | None, unless copied in | Creation of a missing container is documented (`VHDLocations`, naming change); use after damage is not described on these pages | Users lose settings and cached data |

## Step 5: Reduce the chance of a repeat

1. Use `VolumeType` `vhdx` for new containers.
2. Apply the antivirus, DLP and network-scanner exclusions, and keep redirections.xml simple.
3. Monitor the share's capacity and the size of containers against `SizeInMBs`.
4. Run a current FSLogix version, and read the release notes before you update.
5. Back up the share, and test a restore of one container.

## Sources

Accessed 17 November 2026.

- [FSLogix blog: Action required: Windows Kerberos hardening (RC4) may affect FSLogix profiles on SMB storage](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378)
- [Microsoft Learn: Troubleshooting with Logging and Diagnostics (FSLogix)](https://learn.microsoft.com/en-us/fslogix/troubleshooting-events-logs-diagnostics)
- [Microsoft Learn: FSLogix Codes and what they mean](https://learn.microsoft.com/en-us/fslogix/troubleshooting-error-codes)
- [Microsoft Learn: Issues with container attach or detach](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-attach-detach)
- [Microsoft Learn: Issues with container corruption or missing data](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-corruption)
- [Microsoft Learn: Issues with container lock or in use](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-locked)
- [Microsoft Learn: Issues with old, temp or local profiles](https://learn.microsoft.com/en-us/fslogix/troubleshooting-old-temp-local-profiles)
- [Microsoft Learn: FSLogix known issues](https://learn.microsoft.com/en-us/fslogix/troubleshooting-known-issues)
- [Microsoft Learn: FSLogix configuration settings](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: Prerequisites for FSLogix](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Microsoft Learn: Concurrent or multiple connections to a single container](https://learn.microsoft.com/en-us/fslogix/concepts-multi-concurrent-connections)
- [Microsoft Learn: Cloud Cache overview](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-cloud-cache)
- [Microsoft Learn: frx command-line utility reference](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
- [Microsoft Learn: Issues with SMB file share open handles](https://learn.microsoft.com/en-us/fslogix/troubleshooting-open-file-handles)
- [Microsoft Learn: Business continuity and disaster recovery options](https://learn.microsoft.com/en-us/fslogix/concepts-container-recovery-business-continuity)
- [Microsoft Learn: Restore Azure Files](https://learn.microsoft.com/en-us/azure/backup/restore-afs)
