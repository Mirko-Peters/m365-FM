---
title: "FSLogix profile corruption: causes and recovery"
summary: "A failed attach, a temporary profile or a hung sign-out can point to a damaged FSLogix container, but look-alikes such as locks, permissions, full disks or a changed naming setting are often the real cause and should be ruled out first. This article sorts the documented causes, shows how to tell them apart from the logs and status codes, and compares the recovery options Learn supports."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-profile-container]
keypoints:
  - "Triage first: locks, permissions, a full container or share, and a changed folder-naming setting all look like corruption but have documented fixes that leave the VHD(x) intact. Learn says the user's data is not lost after a naming change."
  - "Learn ties container corruption to antivirus scanning, the older VHD format, deleting the wrong data inside a container and, in Cloud Cache failover designs, ungraceful disaster events. A misconfigured redirections.xml is documented on the same page as a source of unexpected results. Abrupt sessions, a sector size mismatch and unsupported concurrent access are documented as lock, sign-in or crash problems, not as damage."
  - "The FSLogix status and reason codes in the Profile log and under HKLM\\Software\\FSLogix\\Profiles\\Sessions\\<SID> separate attach, open, format and lock failures."
  - "Learn documents the tools, Azure Backup restore and the frx utility, but no recovery procedure for a damaged VHD(x). The options below are our combination of those tools, so work on copies."
  - "Prevention is mostly configuration: VHDX, the antivirus exclusion list, enough free space, single sessions per user, critical data outside the profile and a current FSLogix version."
faq:
  - q: "Does FSLogix repair a corrupted VHDX automatically?"
    a: "The FSLogix pages listed under Sources do not describe automatic repair of a damaged container. The troubleshooting pages cover attach, lock, size and naming problems, and the frx utility can attach or copy containers, but none of these pages documents a repair of the file itself. Practical options, combined by us from general tools, are restoring from a backup or moving readable data into a new container."
  - q: "Is a temporary profile a sign of a corrupted container?"
    a: "Not necessarily. Learn lists many other causes of a temporary or local profile: FSLogix not enabled, a wrong VHDLocations value, missing storage permissions, a container in use on another computer, an existing local profile and a full storage provider. Read the Profile log and the status code before you touch the container."
  - q: "Does VHDX reduce the risk compared with VHD?"
    a: "Learn's profile container configuration page recommends VHDX because of its supported size and reduced corruption scenarios. The VolumeType default is vhd, and the setting applies to newly created files, so, in our reading, existing VHD containers stay as they are until they are migrated."
---

A damaged FSLogix container does not announce itself. Users get a temporary profile, a blank desktop, a failed sign-out or a profile that will not attach, and the cause can just as well be a lock, a full container, a permission problem or a changed naming setting. This article separates real damage from look-alikes, lists the causes Microsoft Learn documents, and compares recovery options.

One limit up front. The FSLogix pages listed under Sources cover attach, lock, size and naming problems, and name corruption causes. None of them describes a procedure to repair a damaged VHD(x) file. Where Learn is silent, the article says so.

## Step 1: Rule out the look-alikes

Learn's troubleshooting pages list causes that give the same symptom as a damaged [profile container](/entity/fslogix-profile-container/) and have simple fixes:

| Symptom in the log or on screen | Cause documented by Learn | Fix documented by Learn |
|---|---|---|
| `Operation 'AcquireExclusiveLock' failed`, error 0xa7, `FrxStatus: 33` | Container in use on another computer; FSLogix keeps an exclusive lock while a user is connected | Allow a temporary profile, teach users to sign out first, or enable multiple or concurrent connections (limits in Step 3). After an abrupt disconnect the SMB handle can stay open: confirm the user is signed out everywhere (`qwinsta`, Task Manager Users tab), then on a Windows file server close the container's file under Computer Management > Shared Folders > Open Files. For Azure Files Learn points to orphaned file handles or leases |
| `Attach vhd(x) failed, file is locked ... (Access is denied.)`, `FrxStatus: 31` | Missing NTFS, share or Azure RBAC permissions; Learn's wrong-credentials example also ends in `FrxStatus: 31`, so read the bracket text | Configure SMB storage permissions |
| Access problems on a share that worked before | Learn's Important note, still worded as an upcoming change: the April 2026 Windows Server update changes the default Kerberos encryption type from RC4 to AES-SHA1, and shares hosting containers that are not upgraded might have access issues | Upgrade to AES-SHA1 before installing the update |
| Container fails to attach, user sees errors | Size on disk reached SizeInMBs; the container must have more than 200 MB to attach | Raise SizeInMBs (it cannot be lowered); FSLogix extends existing containers at sign-in |
| New empty profile, no temporary profile | A naming setting (`FlipFlopProfileDirectoryName`, `SIDDirNameMatch`, `SIDDirNamePattern`, `VHDNameMatch`, `VHDNamePattern`) changed after containers existed | Revert the setting or rename the folders; the data is not lost and stays at the old path |
| Hung session, failed mount or detach | Storage provider is full | Add capacity |

## Step 2: Read the status and reason codes

The Profile log is the main evidence: `Profile_%date%.log` in `C:\ProgramData\FSLogix\Logs\Profile`, with `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` lines whose codes come from Windows. Search for `LoadProfile: <username>` and follow the process ID.

FSLogix also stores a Status, Reason and Error value per session, for profile containers under `HKLM\Software\FSLogix\Profiles\Sessions\<SID>`. The status codes that matter for a suspect file include 11 (cannot open the virtual disk), 12 (cannot attach), 15 (cannot initialize the disk) and 17 (error while formatting). Status 27 (cannot find the disk at the given location) points to path, name or access instead: Learn's example pairs it with error 1326, the user name or password is incorrect. Reason codes clarify normal status codes and are not used with error status codes. In our reading, a cannot-open, cannot-attach or cannot-initialize status that stays after locks, permissions and space are ruled out points toward the file itself. Learn does not say these codes indicate corruption, so treat them as a pointer.

## Step 3: Separate documented corruption causes from other failure causes

Learn's page on container corruption or missing data says antivirus products are "one of the most common occurrences of container corruption". Other pages add a few more conditions; a second group leaves containers in a bad state without Learn calling it damage.

### Documented as corruption or data loss

**Antivirus and security tools.** Scanning or processing data into or out of a container can lead to corruption. Learn's prerequisites page lists exclusions (`*.VHD`, `*.VHDX` and the `.lock`, `.meta` and `.metadata` files) and says that without them security tools can lock or corrupt files. For the mount points it lists `ERROR_SHARING_VIOLATION`, temporary profiles and logoff hangs as symptoms, and says to apply the exclusions in every layer, including network scanning and data loss prevention.

**The VHD format.** The profile container configuration page recommends VHDX over VHD because of its supported size and reduced corruption scenarios. The `VolumeType` default is `vhd`.

**Editing contents.** Deleting the wrong data from a container can cause data loss or profile corruption.

**Ungraceful failover.** In its Cloud Cache failover options, Learn says disaster events are rarely graceful and users who sign in to session hosts in the failover region could experience data loss or, in worse cases, container corruption. It advises keeping business-critical data out of the profile and using OneDrive, SharePoint or similar.

**OneDrive placeholder files.** FSLogix 26.08 fixed OneDrive cloud-only placeholder files that could be corrupted during container mirror-back, causing sync errors or a sync client crash loop, and a case where unlinking OneDrive during a session could lead to data loss.

### Documented as other failure causes

**redirections.xml.** A misconfigured file can give unexpected results; Learn advises keeping it simple and does not call this corruption.

**Sessions that end abruptly.** The `CleanupInvalidSessions` description says the mounted VHD(x) might not be detached properly and the next sign-in may not attach it. Enabling the setting (under `HKLM\SOFTWARE\FSLogix\Apps`, default 0) lets FSLogix clean up invalid sessions. The known issues page lists a bug in version 26.01 (3.26.102.18413) where the setting stopped Office containers from being created or mounted when profile and Office containers were both enabled; the release notes list the fix in 26.01 CU1 (3.26.126.19110).

**Concurrent and multiple access.** The default is a single connection with an exclusive lock. Concurrent connections (a second session on the same computer) are not supported on session hosts in an Azure Virtual Desktop host pool. Multiple connections (a session on a different computer) need differencing disks with `ProfileType` 3 and, per Learn, no other configuration. Learn does not describe any of this as a cause of damage.

**A sector size mismatch.** `VHDXSectorSize` should not be used unless Microsoft Support directs it, because a mismatch can lead to a BSOD.

**Product bugs.** The known issues page lists defects in 25.02: containers that did not detach, and a message that the Recycle Bin was corrupted. Learn does not call either damage to the container file; the release notes list the fixes in 25.04. FSLogix 26.08 (3.26.826.17182) fixed a locked or unresponsive container that could block all sign-ins and sign-outs on a host until reboot, and a stuck storage provider that could hang sign-out and leave containers attached. In our reading, an old build can cause hangs and attach problems on its own. Learn says customers are required to install and use the latest version.

**Cloud Cache.** If a read cannot be hydrated from any remote provider, Learn warns of a session hang or a system crash. See [FSLogix Cloud Cache](/entity/fslogix-cloud-cache/) for the design.

## Step 4: Recover, from least to most invasive

Learn gives no repair recipe, so this order combines documented tools with ordinary file handling. Our own steps are marked.

1. **Stop users and sessions touching the file.** FSLogix holds an exclusive lock while the user is connected, so confirm the user is signed out everywhere and clear orphaned handles as described in Step 1.
2. **Work on a copy** (own recommendation, not from Learn). Copy the VHD(x) to a separate location before you try anything.
3. **Inspect with the frx utility.** From `C:\Program Files\FSLogix\Apps`, `frx edit-profile -filename <path>` attaches the file and opens Explorer and the Registry Editor on its contents. `begin-edit-profile` and `end-edit-profile` attach and detach the VHD(x) and its registry hive, the latter using the cookie that the former prints. They show whether the data can be read; Learn does not claim they repair a file.
4. **Restore from backup.** For [Azure Files](/entity/azure-files/) shares protected by [Azure Backup](/entity/azure-backup/), the portal offers full-share and item-level recovery, to the original or an alternate location, with skip or overwrite on conflict. Learn says vaulted backup supports full-share recovery only. A restore to the original location needs a recovery point with the Snapshot or Snapshot and Vault-tier recovery tier, otherwise it fails; in our reading, a vault-only recovery point therefore needs an alternate location, where the target share needs 20 percent more free space than the restored data. Because overwrite on a full-share restore touches every container, in our reading restore to an alternate location and copy back the one file.
5. **Move the data into a new container.** `frx migrate-vhd -src <old> -dest <new>` creates and formats a VHD(x) and mirrors the source; it defaults to 30 GB and dynamic sizing. `frx copyto-vhd` copies a folder into a VHD(x); `frx copy-profile` copies a local profile and needs `-size-mbs` above 5000 when the profile exceeds 5 GB. Learn does not say how these utilities behave on a damaged source, so test first.
6. **Let FSLogix create a fresh container** (own recommendation, not from Learn). With the user signed out and a copy kept, move or rename the damaged VHD(x) out of the user's folder. Learn says FSLogix creates a new empty container when it cannot find an existing one, but only in connection with a changed naming setting, so test with one user first.

## Comparing the options

| Option | Keeps data | Learn documents it for corruption | Main limit |
|---|---|---|---|
| Restore from Azure Backup | Data as of the restore point | Restore is documented; the link to FSLogix damage is not | Needs a backup; original-location restore needs a snapshot recovery point |
| Inspect and copy with frx | Whatever is readable | Tools are documented, repair is not | Unknown behavior on a damaged file |
| New empty container | None, unless copied in | Documented only for a container that cannot be found (naming change) | Users lose settings and cached data |

## Step 5: Reduce the chance of a repeat

1. Use `VolumeType` `vhdx` for new containers and plan the migration of old VHD files.
2. Apply the antivirus, DLP and network-scanner exclusions, and keep redirections.xml simple.
3. Keep business-critical data out of the profile; Learn advises OneDrive, SharePoint or similar.
4. Monitor the share's capacity and the size of containers against `SizeInMBs`.
5. Keep `ProfileType` at 0 for single connections.
6. Run a current FSLogix version. Learn's release notes say customers are required to install and use the latest version; read them before you update.
7. Back up the share, and test a restore of one container.

## Sources

Accessed 17 November 2026.

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
