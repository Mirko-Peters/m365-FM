---
title: "FSLogix profile corruption: causes and recovery"
summary: "A damaged FSLogix container usually shows up as a failed attach, a temporary profile or a hung sign-out, and many look-alike problems such as locks, full disks or a changed naming setting are not corruption at all. This article sorts the documented causes, shows how to tell them apart from the logs and status codes, and compares the recovery options Learn supports."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-profile-container]
keypoints:
  - "Triage first: locks, permissions, a full container or share, and a changed folder-naming setting all look like corruption but have documented fixes that leave the VHD(x) intact. Learn says the user's data is not lost after a naming change."
  - "Documented risk factors for damaged containers are scanning by antivirus tools, the older VHD format, sessions that end abruptly, a sector size mismatch, unsupported concurrent access and deleting the wrong data inside a container."
  - "The FSLogix status and reason codes in the Profile log and under HKLM\\Software\\FSLogix\\Profiles\\Sessions\\<SID> separate attach, open, format and lock failures."
  - "Recovery options with Learn support are restoring the share or single files with Azure Backup, and attaching or copying a container with the frx utility. Learn does not describe a repair procedure for a damaged VHD(x), so work on copies."
  - "Prevention is mostly configuration: VHDX, the antivirus exclusion list, sensible retry values, enough free space, single sessions per user and a current FSLogix version."
faq:
  - q: "Does FSLogix repair a corrupted VHDX automatically?"
    a: "Learn does not describe automatic repair of a damaged container. The FSLogix troubleshooting pages cover attach, lock, size and naming problems, and the frx utility can attach or copy containers, but none of these pages documents a repair of the file itself. Recovery therefore means restoring from a backup or moving the data into a new container."
  - q: "Is a temporary profile a sign of a corrupted container?"
    a: "Not necessarily. Learn lists many other causes of a temporary or local profile: FSLogix not enabled, a wrong VHDLocations value, missing storage permissions, a container in use on another computer, an existing local profile and a full storage provider. Read the Profile log and the status code before you touch the container."
  - q: "Does VHDX reduce the risk compared with VHD?"
    a: "Learn's profile container configuration page recommends VHDX because of its supported size and reduced corruption scenarios. The VolumeType default is vhd, and the setting applies to newly created files, so existing VHD containers stay as they are until they are migrated."
---

A damaged FSLogix container rarely announces itself. Users get a temporary profile, a blank desktop, a failed sign-out or a profile that will not attach, and the cause is often something else: a lock, a full container, a permission problem or a changed naming setting. This article separates real container damage from its look-alikes, lists the causes that Microsoft Learn documents, and compares the recovery options. The sign-in symptoms of a local profile are covered in the article on users who get a local profile instead of the container, so this one concentrates on damaged or inconsistent containers.

One limit up front. The FSLogix troubleshooting pages on Learn describe attach, lock, size and naming problems. They do not describe a procedure to repair a damaged VHD(x) file. What follows is the documented set of causes and tools, and where Learn is silent the article says so.

## Step 1: Rule out the look-alikes

Learn's troubleshooting pages list causes that give the same symptom as a damaged [profile container](/entity/fslogix-profile-container/) and have simple fixes:

| Symptom in the log or on screen | Cause documented by Learn | Fix documented by Learn |
|---|---|---|
| `Attach vhd(x) failed, file is locked` or `AcquireExclusiveLock` failed | Container in use in another session; FSLogix keeps an exclusive lock while a user is connected | Sign out the other session; review concurrent-connection options |
| `Access is denied`, `FrxStatus: 31` | Missing NTFS, share or Azure RBAC permissions | Configure SMB storage permissions |
| Container fails to attach, user sees errors | Size on disk reached SizeInMBs; Learn says the container must have more than 200 MB to attach | Raise SizeInMBs; FSLogix extends existing containers at sign-in |
| New empty profile, no temporary profile | A naming setting (`FlipFlopProfileDirectoryName`, `SIDDirNameMatch`, `SIDDirNamePattern`, `VHDNameMatch`, `VHDNamePattern`) changed after containers existed | Revert the setting or rename the folders; Learn says the data is not lost |
| Hung session, failed mount or detach | Storage provider is full | Add capacity |

Increasing `SizeInMBs` affects all users with dynamic disks, can be raised at any time and cannot be lowered. If a naming setting was changed, the original data is still at the old path on the share.

## Step 2: Read the status and reason codes

The Profile log is the main evidence. Learn says it is `Profile_%date%.log` in `C:\ProgramData\FSLogix\Logs\Profile`, with `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` lines whose codes come from Windows. Search for `LoadProfile: <username>` and follow the process ID.

FSLogix also stores a Status, a Reason and an Error value per session in the registry, for profile containers under `HKLM\Software\FSLogix\Profiles\Sessions\<SID>`. The status codes that matter for a suspect file include 11 (cannot open the virtual disk), 12 (cannot attach), 15 (cannot initialize the disk), 17 (error while formatting) and 27 (cannot find the disk at the given location). Reason code 3 means a local profile exists, 7 a Windows temporary profile and 9 a failed profile load. A cannot-open or cannot-initialize status that stays after locks, permissions and space are ruled out points toward the file itself. Learn does not say that these codes prove corruption, so treat them as a pointer, not a verdict.

## Step 3: Know the documented causes of damage and inconsistency

Learn names several conditions that can leave containers in a bad state.

**Antivirus and security tools.** Learn's prerequisites page lists exclusions for container files on SMB shares (`*.VHD`, `*.VHDX` and the `.lock`, `.meta` and `.metadata` files) and says that without them security tools can lock or corrupt files. For the attach points it lists `ERROR_SHARING_VIOLATION`, temporary profiles and logoff hangs. It tells you to apply the exclusions in all layers: endpoint AV, network scanning and data loss prevention.

**The VHD format.** The configuration page recommends VHDX over VHD because of its supported size and reduced corruption scenarios. The `VolumeType` default is `vhd`.

**Sessions that end abruptly.** If a session terminates abruptly, the mounted container may not be detached properly, and the next sign-in may fail. Learn recommends enabling `CleanupInvalidSessions` (under `HKLM\SOFTWARE\FSLogix\Apps`, default 0) and first looking for an operational cause. The known issues page lists a fixed bug in version 26.01 (3.26.102.18413), where the setting stopped Office containers from being created or mounted when profile and Office containers were both enabled. The mitigation was to disable it, and the resolution is a current version.

**Concurrent access.** The default is a single connection with an exclusive lock. Learn warns that concurrent connections are not supported on session hosts in an Azure Virtual Desktop host pool, that multiple connections to one container need differencing disks with `ProfileType` 3, that all sessions using the container should have a matching `ProfileType`, and that `0` should not be mixed with any other value. OneDrive does not support multiple simultaneous connections using the same container.

**A sector size mismatch.** `VHDXSectorSize` should not be used unless Microsoft Support directs it, because a mismatch can lead to a BSOD.

**Editing contents.** Learn warns that deleting the wrong data from a user's container can cause data loss or profile corruption.

**Product bugs.** The known issues page lists fixed defects in 25.02 where containers did not detach and where users saw a message that the Recycle Bin was corrupted. Learn names installing the latest FSLogix version as the resolution, and it is also the first requirement for a support request.

**Cloud Cache.** Learn warns that if a read cannot be hydrated from any remote provider, the result can be a session hang or a system crash. See [FSLogix Cloud Cache](/entity/fslogix-cloud-cache/) for the design.

## Step 4: Recover, from least to most invasive

Learn gives no repair recipe, so the order below combines documented tools with ordinary file handling. Steps that are my reasoning, not Learn text, are marked.

1. **Stop users and sessions touching the file.** FSLogix holds an exclusive lock while the user is connected, so make sure no session of that user remains.
2. **Work on a copy** (my recommendation, not from Learn). Copy the VHD(x) to a separate location before you try anything.
3. **Inspect with the frx utility.** From `C:\Program Files\FSLogix\Apps`, `frx edit-profile -filename <path>` attaches the file and opens Explorer and the Registry Editor on its contents. `begin-edit-profile` and `end-edit-profile` do the same in two steps. Learn does not claim these commands fix a damaged file; they let you see whether the data can be read.
4. **Restore from backup.** For [Azure Files](/entity/azure-files/) shares protected by [Azure Backup](/entity/azure-backup/), the portal offers restoring the full share or individual files, to the original or an alternate location, and lets you skip or overwrite on conflict. Restoring to an alternate location keeps the current share unchanged, which suits a comparison. Learn says vaulted backup supports full-share recovery only, and that a vault-tier restore needs 20 percent more free space on the target share than the size of the data being restored.
5. **Move the data into a new container.** `frx migrate-vhd -src <old> -dest <new>` creates and formats a VHD(x) and mirrors the contents of the source. `frx copyto-vhd` copies a folder into a VHD(x), and `frx copy-profile` copies a local profile. Learn says a new VHD(x) defaults to 30 GB and dynamic sizing, and that `copy-profile` needs `-size-mbs` above 5000 when the local profile exceeds 5 GB. These tools are documented as copy utilities, and Learn does not say how they behave on a damaged source, so test first.
6. **Let FSLogix create a fresh container** (my reading of the naming behaviour above): Learn says that when FSLogix cannot find an existing container it creates a new empty one. Moving the old folder aside and keeping it for data recovery follows from that, but Learn does not present it as a recovery procedure.

## Comparing the options

| Option | Keeps data | Learn documents it for corruption | Main limit |
|---|---|---|---|
| Restore from Azure Backup | Data as of the restore point | Backup restore is documented; the link to FSLogix damage is not | Needs a backup; vault restore needs 20 percent free space |
| Inspect and copy with frx | Whatever is readable | Tools are documented, repair is not | Unknown behavior on a damaged file |
| New empty container | None, unless copied in | Behavior implied by the naming section | Users lose settings and cached data |
| Cloud Cache | Replicates writes to every provider | Documented as resilience for storage issues, not as a backup | Learn says it writes data to all providers, so do not assume it protects against a damaged container |

## Step 5: Reduce the chance of a repeat

1. Use `VolumeType` `vhdx` for new containers and plan the migration of old VHD files.
2. Apply the antivirus, DLP and network-scanner exclusions from the prerequisites page.
3. Learn's configuration page recommends `LockedRetryCount` 3, `LockedRetryInterval` 15, `ReAttachRetryCount` 3 and `ReAttachIntervalSeconds` 15 for a faster failure; the defaults are 12, 5, 60 and 10.
4. Monitor the share's capacity and the size of containers against `SizeInMBs`.
5. Keep `ProfileType` at 0 for single connections and avoid `VHDXSectorSize`.
6. Run a current FSLogix version, and read the known issues page before you update.
7. Back up the share, and test a restore of one container.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Troubleshooting with Logging and Diagnostics (FSLogix)](https://learn.microsoft.com/en-us/fslogix/troubleshooting-events-logs-diagnostics)
- [Microsoft Learn: FSLogix Codes and what they mean](https://learn.microsoft.com/en-us/fslogix/troubleshooting-error-codes)
- [Microsoft Learn: Issues with container attach or detach](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-attach-detach)
- [Microsoft Learn: Issues with container lock or in use](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-locked)
- [Microsoft Learn: Issues with old, temp or local profiles](https://learn.microsoft.com/en-us/fslogix/troubleshooting-old-temp-local-profiles)
- [Microsoft Learn: FSLogix known issues](https://learn.microsoft.com/en-us/fslogix/troubleshooting-known-issues)
- [Microsoft Learn: FSLogix configuration settings](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: Prerequisites for FSLogix](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Microsoft Learn: Concurrent or multiple connections to a single container](https://learn.microsoft.com/en-us/fslogix/concepts-multi-concurrent-connections)
- [Microsoft Learn: Cloud Cache overview](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-cloud-cache)
- [Microsoft Learn: frx command-line utility reference](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: Restore Azure Files](https://learn.microsoft.com/en-us/azure/backup/restore-afs)
