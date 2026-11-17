---
title: "FSLogix profile corruption: causes and recovery"
summary: "A failed attach, a temporary profile or a hung sign-out can point to a damaged FSLogix container, but look-alikes such as locks, permissions, full disks or a changed naming setting are more common. This article sorts the documented causes, shows how to tell them apart from the logs and status codes, and compares the recovery options Learn supports."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-profile-container]
keypoints:
  - "Triage first: locks, permissions, a full container or share, and a changed folder-naming setting all look like corruption but have documented fixes that leave the VHD(x) intact. Learn says the user's data is not lost after a naming change."
  - "Learn ties container corruption to antivirus scanning, the older VHD format and deleting the wrong data inside a container. A misconfigured redirections.xml is documented on the same page as a source of unexpected results. Abrupt sessions, a sector size mismatch and unsupported concurrent access are documented as attach failures or crashes, not as damage."
  - "The FSLogix status and reason codes in the Profile log and under HKLM\\Software\\FSLogix\\Profiles\\Sessions\\<SID> separate attach, open, format and lock failures."
  - "Recovery options with Learn support are restoring the share or single files with Azure Backup, and attaching or copying a container with the frx utility. The FSLogix pages listed under Sources describe no repair procedure for a damaged VHD(x), so work on copies."
  - "Prevention is mostly configuration: VHDX, the antivirus exclusion list, enough free space, single sessions per user and a current FSLogix version."
faq:
  - q: "Does FSLogix repair a corrupted VHDX automatically?"
    a: "The FSLogix pages listed under Sources do not describe automatic repair of a damaged container. The troubleshooting pages cover attach, lock, size and naming problems, and the frx utility can attach or copy containers, but none of these pages documents a repair of the file itself. The documented options are therefore restoring from a backup or moving the data into a new container."
  - q: "Is a temporary profile a sign of a corrupted container?"
    a: "Not necessarily. Learn lists many other causes of a temporary or local profile: FSLogix not enabled, a wrong VHDLocations value, missing storage permissions, a container in use on another computer, an existing local profile and a full storage provider. Read the Profile log and the status code before you touch the container."
  - q: "Does VHDX reduce the risk compared with VHD?"
    a: "Learn's profile container configuration page recommends VHDX because of its supported size and reduced corruption scenarios. The VolumeType default is vhd, and the setting applies to newly created files, so, in our reading, existing VHD containers stay as they are until they are migrated."
---

A damaged FSLogix container does not announce itself. Users get a temporary profile, a blank desktop, a failed sign-out or a profile that will not attach, and the cause can just as well be a lock, a full container, a permission problem or a changed naming setting. This article separates real container damage from its look-alikes, lists the causes that Microsoft Learn documents, and compares the recovery options. The sign-in symptoms of a local profile are covered in the article on users who get a local profile instead of the container, so this one concentrates on damaged or inconsistent containers.

One limit up front. The FSLogix troubleshooting pages on Learn describe attach, lock, size and naming problems, and the page on container corruption names causes and points to configuration. None of them describes a procedure to repair a damaged VHD(x) file. What follows is the documented set of causes and tools, and where Learn is silent the article says so.

## Step 1: Rule out the look-alikes

Learn's troubleshooting pages list causes that give the same symptom as a damaged [profile container](/entity/fslogix-profile-container/) and have simple fixes:

| Symptom in the log or on screen | Cause documented by Learn | Fix documented by Learn |
|---|---|---|
| `Operation 'AcquireExclusiveLock' failed`, error 0xa7, `FrxStatus: 33` | Container in use on another computer; FSLogix keeps an exclusive lock while a user is connected | Learn lists allowing a temporary profile, teaching users to sign out first, or enabling concurrent connections (not supported on session hosts in an Azure Virtual Desktop host pool; see Step 3) |
| `Attach vhd(x) failed, file is locked ... (Access is denied.)`, `FrxStatus: 31` | Missing NTFS, share or Azure RBAC permissions. In Learn's example the text in brackets is `Access is denied`; its wrong-credentials example also ends in `FrxStatus: 31`, so read the bracket text | Configure SMB storage permissions |
| Access problems on a share that worked before | Learn's Important note on its troubleshooting pages, which still words it as an upcoming change: the April 2026 Windows Server update changes the default Kerberos encryption type from RC4 to AES-SHA1, and shares hosting containers that are not upgraded might have access issues | Upgrade to AES-SHA1 before installing the update; Learn links an FSLogix blog post on the change |
| Container fails to attach, user sees errors | Size on disk reached SizeInMBs; Learn says the container must have more than 200 MB to attach | Raise SizeInMBs; FSLogix extends existing containers at sign-in |
| New empty profile, no temporary profile | A naming setting (`FlipFlopProfileDirectoryName`, `SIDDirNameMatch`, `SIDDirNamePattern`, `VHDNameMatch`, `VHDNamePattern`) changed after containers existed | Revert the setting or rename the folders; Learn says the data is not lost |
| Hung session, failed mount or detach | Storage provider is full | Add capacity |

Increasing `SizeInMBs` affects all users with dynamic disks, can be raised at any time and cannot be lowered. If a naming setting was changed, the original data is still at the old path on the share.

## Step 2: Read the status and reason codes

The Profile log is the main evidence. Learn says it is `Profile_%date%.log` in `C:\ProgramData\FSLogix\Logs\Profile`, with `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` lines whose codes come from Windows. Search for `LoadProfile: <username>` and follow the process ID.

FSLogix also stores a Status, a Reason and an Error value per session in the registry, for profile containers under `HKLM\Software\FSLogix\Profiles\Sessions\<SID>`. The status codes that matter for a suspect file include 11 (cannot open the virtual disk), 12 (cannot attach), 15 (cannot initialize the disk), 17 (error while formatting) and 27 (cannot find the disk at the given location). Reason code 3 means a local profile exists, 7 a Windows temporary profile and 9 a failed profile load. In our reading, a cannot-open or cannot-initialize status that stays after locks, permissions and space are ruled out points toward the file itself. Learn does not say that these codes indicate corruption, so treat them as a pointer, not a verdict.

## Step 3: Separate documented corruption causes from other failure causes

Learn's page on container corruption or missing data says antivirus products are "one of the most common occurrences of container corruption" and, in a second section, warns about redirections.xml. Other pages tie corruption to a few more conditions. A second group leaves containers in a bad state without Learn calling it damage.

### Documented as corruption or data loss

**Antivirus and security tools.** The corruption page says that scanning or processing data into or out of a container can lead to corruption. Learn's prerequisites page lists exclusions for container files on SMB shares (`*.VHD`, `*.VHDX` and the `.lock`, `.meta` and `.metadata` files) and says that without them security tools can lock or corrupt files. It lists `ERROR_SHARING_VIOLATION`, temporary profiles and logoff hangs as symptoms and says to apply the exclusions in all layers: endpoint AV, network scanning and data loss prevention.

**The VHD format.** The profile container configuration page recommends VHDX over VHD because of its supported size and reduced corruption scenarios. The `VolumeType` default is `vhd`.

**Editing contents.** Learn warns that deleting the wrong data from a user's container can cause data loss or profile corruption.

### Documented as other failure causes

**redirections.xml.** The corruption page advises caution when excluding directories: a misconfigured redirections.xml file can give unexpected results, the profile folders are not random, and the file should stay simple. Learn does not call this corruption.

**Sessions that end abruptly.** The `CleanupInvalidSessions` description says the mounted VHD(x) might not be detached properly and the next sign-in may not attach it. Learn describes enabling the setting (under `HKLM\SOFTWARE\FSLogix\Apps`, default 0) as a way to let FSLogix clean up invalid sessions. The known issues page lists a fixed bug in version 26.01 (3.26.102.18413), where the setting stopped Office containers from being created or mounted when profile and Office containers were both enabled.

**Concurrent access.** The default is a single connection with an exclusive lock. Learn warns that concurrent connections are not supported on session hosts in an Azure Virtual Desktop host pool, that multiple connections to one container need differencing disks with `ProfileType` 3, that sessions should not mix `0` with any other value, and that OneDrive does not support multiple simultaneous connections using the same container. None of this is described as a cause of damage.

**A sector size mismatch.** `VHDXSectorSize` should not be used unless Microsoft Support directs it, because a mismatch in disk sector sizes can lead to a BSOD.

**Product bugs.** The known issues page lists fixed defects in 25.02: containers that did not detach, and a message that the Recycle Bin was corrupted. Learn does not describe either as damage to the container file and names the latest FSLogix version as the resolution.

**Cloud Cache.** Learn warns that if a read cannot be hydrated from any remote provider, the result can be a session hang or a system crash. See [FSLogix Cloud Cache](/entity/fslogix-cloud-cache/) for the design.

## Step 4: Recover, from least to most invasive

Learn gives no repair recipe, so the order below combines documented tools with ordinary file handling. Our own steps are marked.

1. **Stop users and sessions touching the file.** FSLogix holds an exclusive lock while the user is connected, so make sure no session of that user remains.
2. **Work on a copy** (own recommendation, not from Learn). Copy the VHD(x) to a separate location before you try anything.
3. **Inspect with the frx utility.** From `C:\Program Files\FSLogix\Apps`, `frx edit-profile -filename <path>` attaches the file and opens Explorer and the Registry Editor on its contents. `begin-edit-profile` attaches the VHD(x) and its registry hive, and `end-edit-profile` detaches both again using the cookie that `begin-edit-profile` prints. Learn does not claim these commands fix a damaged file; they show whether the data can be read.
4. **Restore from backup.** For [Azure Files](/entity/azure-files/) shares protected by [Azure Backup](/entity/azure-backup/), the portal offers restoring the full share or individual files, to the original or an alternate location, and lets you skip or overwrite on conflict. Learn says vaulted backup supports full-share recovery only, and that a vault-tier restore needs 20 percent more free space on the target share than the size of the data being restored.
5. **Move the data into a new container.** `frx migrate-vhd -src <old> -dest <new>` creates and formats a VHD(x) and mirrors the contents of the source. `frx copyto-vhd` copies a folder into a VHD(x), and `frx copy-profile` copies a local profile. Learn says `migrate-vhd` creates a VHD(x) that defaults to 30 GB and dynamic sizing, and that `copy-profile` needs `-size-mbs` above 5000 when the local profile exceeds 5 GB. Learn does not say how these copy utilities behave on a damaged source, so test first.
6. **Let FSLogix create a fresh container** (own reading of the naming behaviour above): Learn says that when FSLogix cannot find an existing container it creates a new empty one. Moving the old folder aside for data recovery follows from that, but Learn does not present it as a recovery procedure.

## Comparing the options

| Option | Keeps data | Learn documents it for corruption | Main limit |
|---|---|---|---|
| Restore from Azure Backup | Data as of the restore point | Backup restore is documented; the link to FSLogix damage is not | Needs a backup; vault restore needs 20 percent free space |
| Inspect and copy with frx | Whatever is readable | Tools are documented, repair is not | Unknown behavior on a damaged file |
| New empty container | None, unless copied in | Behavior implied by the naming section | Users lose settings and cached data |
| Cloud Cache | Writes go to every provider | Learn describes it as resiliency and high availability against short-term storage issues, and as an option in a BCDR plan; it does not document it as protection for a damaged container | Data is written to all providers, so in our reading a damaged container may be written to all of them as well |

## Step 5: Reduce the chance of a repeat

1. Use `VolumeType` `vhdx` for new containers and plan the migration of old VHD files.
2. Apply the antivirus, DLP and network-scanner exclusions from the prerequisites page, and keep redirections.xml simple.
3. Learn's profile container configuration page recommends `LockedRetryCount` 3, `LockedRetryInterval` 15, `ReAttachRetryCount` 3 and `ReAttachIntervalSeconds` 15 as a faster fail scenario; the defaults are 12, 5, 60 and 10. Learn gives no corruption benefit for these values, so they shorten the wait on a locked or detached container and do not prevent damage.
4. Monitor the share's capacity and the size of containers against `SizeInMBs`.
5. Keep `ProfileType` at 0 for single connections and avoid `VHDXSectorSize`.
6. Run a current FSLogix version, and read the known issues page before you update.
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
- [Microsoft Learn: Restore Azure Files](https://learn.microsoft.com/en-us/azure/backup/restore-afs)
