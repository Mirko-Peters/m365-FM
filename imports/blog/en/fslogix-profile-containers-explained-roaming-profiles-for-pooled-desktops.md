---
title: "FSLogix profile containers explained: roaming profiles for pooled desktops"
summary: "An FSLogix profile container keeps a user's whole Windows profile in a VHD(x) file on SMB storage and attaches it at sign-in, so pooled desktop users get the same profile on any host. Covers how it works and prerequisites."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-profile-container, fslogix]
keypoints:
  - "A profile container is a VHD(x) file attached at sign-in, so the profile appears like a local profile. Learn contrasts this with copy-based roaming profile solutions."
  - "Pooled host pools are the reason it matters: Learn says a user may connect to a different session host at each sign-in, so profile data has to live outside the operating system."
  - "Only Enabled and VHDLocations are required. SizeInMBs defaults to 30000, IsDynamic to 1 and VolumeType to vhd, although Learn's how-to recommends vhdx."
  - "Plan storage before you plan the container: Learn's rule of thumb is 10 IOPS per user at steady state and 50 per user at sign-in and sign-out, so 100 users need about 1,000 and 5,000 IOPS."
  - "Prerequisites: an eligible licence, SMB storage in the same region with correct permissions, antivirus exclusions and, with AD Kerberos shares, a setup that supports AES-SHA1."
faq:
  - q: "Do I need a separate Office container with a profile container?"
    a: "No. Learn's how-to for configuring profile containers says the profile container includes all Microsoft 365 application data, so a separate ODFC container is not needed, and it recommends the single-container configuration. The container types article says that by default the profile container holds both profile and ODFC content in the same VHD(x). Learn lists reasons to use both, such as isolating loss to one container or sizing them differently; those are covered in the Office container articles of this series."
  - q: "Which licences make me eligible to use FSLogix?"
    a: "Learn's prerequisites say you are eligible to use FSLogix with one of these licences, for example Microsoft 365 E3/E5, A3/A5, F1/F3 or Business, Windows 10 Enterprise E3/E5 or Education A3/A5, a Remote Desktop Services CAL or SAL, or the Azure Virtual Desktop per-user access license. The page describes eligibility through these licences and does not list a separate FSLogix price. It adds that FSLogix can run in any public or private data center or cloud, provided the user is properly licensed. Check the current licence list on the page before you plan."
  - q: "Can I make a container smaller after I set SizeInMBs too high?"
    a: "No. Learn says you can increase SizeInMBs at any time but cannot decrease it, and that lowering the value does not shrink existing VHD(x) files. With IsDynamic set to 1, which is the default, a container takes only the disk space it needs, up to the SizeInMBs ceiling."
---

An FSLogix profile container stores a user's complete Windows profile in one VHD or VHDX file on SMB storage and attaches that file at sign-in, so the profile looks local to the session. On a pooled host pool, where a user may land on a different session host each time, this gives the same profile everywhere without copying files at sign-in and sign-out. This article covers the mechanism, the contents, and the prerequisites; settings detail, Cloud Cache and the Office container each have their own articles in the series.

## Why pooled desktops need a roaming profile

By default Windows stores a profile locally and ties it to the operating system. Learn's [FSLogix profile containers in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/fslogix-profile-containers) article says a remote profile separates user data from the OS, which matters when the OS is upgraded, a session host is replaced, or a user connects to a different session host in a [pooled host pool](https://www.m365.fm/entity/avd-pooled-host-pool/) at each sign-in. Microsoft recommends profile containers for managing and roaming profiles and personalization there. Learn highlights three key benefits. Performance: profile containers "can resolve" performance issues that historically blocked cached Exchange mode in Outlook. OneDrive: Learn says that without FSLogix profile containers, OneDrive isn't supported in non-persistent VDI environments. Additional folders: user profiles can be extended to include other folders.

## How it works: mount instead of copy

Learn's [What is FSLogix?](https://learn.microsoft.com/en-us/fslogix/overview-what-is-fslogix) page describes the mechanism in two points:

- The profile is mounted from a storage provider instead of being copied to and from a network location, which removes the delays Learn associates with copy-based roaming profile solutions.
- A filter driver redirects the profile at the file system level, so applications use it as if it were on the local disk. Learn notes this matters because many applications do not work properly with a remotely stored profile.

Learn's "Configure profile containers" how-to shows the result. After a sign-in, `frx.exe list-redirects` (in `C:\Program Files\FSLogix\Apps`) lists the active redirections: the user's profile folder points to a volume of the attached container, and a few paths such as `AppData\Roaming\Microsoft\Protect` and `Credentials` point to a local folder. In the share, the how-to expects a folder per user inside the `VHDLocations` path holding the VHDX file; the Entra setup article describes the folder name as `<user SID>_<username>`, and `FlipFlopProfileDirectoryName` set to 1 reverses the order.

If no container exists, the configuration reference says one is created in the first listed location. `DeleteLocalProfileWhenVHDShouldApply` defaults to 0, meaning no action on an existing local profile; set to 1 it deletes a matching local profile permanently when a container should apply. Learn's how-to still lists 1 as recommended, so that users do not work in a local profile and lose data unexpectedly. Our suggestion: try the setting with a test account first.

## What the container holds

Learn's [container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types) article says the profile container stores the data of the profile, typically `C:\Users\%username%`, except content on the exclusion list. It compares the function to Microsoft User Profile Disk, roaming profiles and Citrix User Profile Management, adding that the underlying technology differs.

Two kinds of exclusion exist:

- **Redirection-based.** Content that cannot live inside the VHD(x) goes to `C:\Users\local_%username%`, which is deleted at sign-out. Examples are `AppData\Roaming\Microsoft\Protect`, `AppData\Roaming\Microsoft\Credentials`, `AppData\Local\Microsoft\Credentials` and `AppData\Local\Microsoft\Office\16.0\OfficeFileCache`.
- **Deletion-based.** Content not designed to roam between VMs is deleted at sign-out, for example non-roamable MSIX application data and non-roamable identity data such as `TokenBroker`, `OneAuth` and `IdentityCache`. Learn says roaming identity data through the `RoamIdentity` setting is not recommended.

By default the profile container also holds the Office data (for example Outlook, OneDrive, Teams, SharePoint and OneNote), and Learn calls this the recommended configuration. Splitting it into an [Office container](https://www.m365.fm/entity/fslogix-office-container/) is optional. Custom exclusions and bulky folders are the subject of the [redirections.xml](https://www.m365.fm/entity/fslogix-redirections-xml/) article.

## The FSLogix parts around the container

| Component | What Learn says it does |
|---|---|
| [Profile container](https://www.m365.fm/entity/fslogix-profile-container/) | Redirects the full user profile to a storage provider |
| ODFC container | Redirects only the Office data portion; under most circumstances not used with a profile container at the same time |
| [Cloud Cache](https://www.m365.fm/entity/fslogix-cloud-cache/) | Works with profile containers for high availability and disaster recovery; an optional configuration, not a container type |
| [Application masking](https://www.m365.fm/entity/fslogix-app-masking/) | Rule sets that control access to applications, fonts, printers and more by user, group, IP address and other criteria |
| Filter driver | Virtualizes and redirects the profile at file system level |

## What must be in place first

**Licence.** Learn lists eligible licences, including Microsoft 365 E3/E5, A3/A5, F1/F3 and Business, Windows 10 Enterprise E3/E5, RDS CAL or SAL, and the Azure Virtual Desktop per-user access license. **Operating systems.** FSLogix runs on Microsoft-supported systems, including Windows 10 and 11 and Windows Server 2016 to 2025.

**Storage.** The standard design mounts a container from an SMB share, such as `\\<storage-account-name>.file.core.windows.net\<share-name>`. Learn's [storage options](https://learn.microsoft.com/en-us/fslogix/concepts-container-storage-options) page gives a planning estimate of 10 steady-state IOPS and 50 sign-in/sign-out IOPS per user, so 100 users need about 1,000 and 5,000. It compares [Azure Files](https://www.m365.fm/entity/azure-files/) (redundancy options LRS to GZRS, 10,000 open handles per file share), [Azure NetApp Files](https://www.m365.fm/entity/azure-netapp-files/) (select regions) and self-managed Storage Spaces Direct, and says that outside Azure the most important factor is latency to your desktops. In Azure, Learn's AVD page says the storage account must be in the same region as the session hosts and that handle limits apply to root directories, directories and files. Permissions follow Learn's storage permissions article and have two levels. At share level, for Azure Files Learn recommends the default share-level permission Storage File Data SMB Share Contributor for all authenticated identities. To set the Windows ACLs, a user or group needs the Storage File Data SMB Share Elevated Contributor role, or you mount the share with the storage account key. At NTFS level, the recommended ACLs are CREATOR OWNER with Modify on subfolders and files only, an admin group with Full Control, and users with Modify on this folder only. Azure NetApp Files relies on Windows ACLs alone.

**Identity.** The session host needs a way to authenticate to the share. [Microsoft Entra Kerberos](https://www.m365.fm/entity/entra-kerberos-azure-files/) is one of the options; the setup article in this series walks through it.

**Antivirus.** Learn's prerequisites list exclusions: `frxsvc.exe` and `frxccds.exe`, the drivers `frxdrv.sys`, `frxdrvvt.sys` and `frxccd.sys`, the FSLogix program and data folders, and `.VHD`/`.VHDX` files with their `.lock`, `.meta` and `.metadata` companions on the share. It says missing exclusions can produce delayed logons, mount timeouts, temporary profiles, sharing violations and logoff hangs.

**Kerberos encryption.** A notice on the FSLogix pages describes a Windows change in which the default Kerberos encryption type moves from RC4 to AES-SHA1, and says file shares hosting FSLogix containers that are not upgraded to AES-SHA1 might have access issues. The notice is still worded as upcoming, but the [FSLogix blog post](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378) of 27 March 2026 gives a timeline that has already run. From the April 2026 cumulative update, accounts without an explicit encryption type (null) get AES-SHA1 only. In April 2026 enforcement mode is the default on domain controllers, with audit mode kept as a manual rollback; from July 2026 audit mode is removed, leaving enforcement as the only option. The post recommended remediation by the end of June 2026 for non-Azure Files SMB storage and for Azure Files with AD DS. The scope is SMB storage integrated with Active Directory where the relevant AD objects are RC4-only or unset; Azure Virtual Desktop service behaviour is not being modified. Nerdio's notice gives the same timeline but narrows the impact to customers who explicitly configured RC4, and expects most not to be affected. Our reading: if your shares use AD-based Kerberos, check the encryption settings of the storage account objects before you rely on the share, and look here first if users cannot reach it.

**Version.** Learn says to run the latest FSLogix version, and that upgrading is required before opening a support request. The newest release in the release notes is 26.08 (3.26.826.17182, published 31 August 2026), which lists fixes for locked or unresponsive containers and a stuck storage provider.

## The minimum configuration

Learn's [configuration reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings) marks two values as required under `HKLM\SOFTWARE\FSLogix\Profiles`:

| Value | Default | Meaning |
|---|---|---|
| `Enabled` | 0 | 1 turns profile containers on |
| `VHDLocations` | none | SMB path or paths to search for the user's VHD(x) |

Other values with defaults worth knowing: `SizeInMBs` 30000 (increase only), `IsDynamic` 1 (the file grows as needed, never beyond `SizeInMBs`) and `VolumeType` `vhd`. Learn's how-to recommends `vhdx`, preferred over VHD for its supported size and fewer corruption scenarios. It lists `ProfileType` 0 (single connections) as the default, not as a recommendation. The how-to also marks other values as recommended, such as `DeleteLocalProfileWhenVHDShouldApply` 1, `FlipFlopProfileDirectoryName` 1 and reduced retry counts and intervals for locked and re-attached containers, so treat Enabled and VHDLocations as the minimum to understand, not the full production set.

A small worked example, our arithmetic from Learn's numbers: 200 users on pooled hosts need about 2,000 IOPS at steady state and about 10,000 if all 200 sign in or out at the same moment. The 30,000 MB ceiling times 200 users is 6,000,000 MB, about 6 TB in decimal terms, as an upper bound. Because containers are dynamic, the real figure starts far lower. In our reading, plan share capacity against the ceiling and monitor the space actually used.

## If you manage the hosts with Nerdio

Nerdio's FSLogix settings article for Nerdio Manager for Enterprise says it installs FSLogix by default when a session host is created or re-imaged. To add an FSLogix profile storage configuration, go to **Cloud Desktops > Azure Virtual Desktop > Host Pool Profiles**, select **New profile**, then **FSLogix**, and under FSLogix Profiles storage select **Add**. The default configuration is set under **System > Settings > Integrations**. The profile path can be an Azure Files share or a UNC path; Nerdio's [storage option article](https://nmehelp.getnerdio.com/hc/en-us/articles/44790523136269-Which-FSLogix-Profile-storage-option-should-I-choose) adds Azure NetApp Files as a choice and, with Cloud Cache enabled, up to four paths. Each host pool can carry its own FSLogix customization. Nerdio says session hosts should not receive conflicting FSLogix settings from Group Policy. The same Nerdio documentation treats Cloud Cache as an option for designs that need resiliency across storage locations, not as the default.

## Where to go next

Sizing and locking settings, the Office container and Cloud Cache each have their own articles in this series. Each adds configuration on top of the minimum above.

## Sources

- [Microsoft Learn: What is FSLogix?](https://learn.microsoft.com/en-us/fslogix/overview-what-is-fslogix)
- [Microsoft Learn: Types of FSLogix containers](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: FSLogix prerequisites](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Microsoft Learn: Container storage options for FSLogix](https://learn.microsoft.com/en-us/fslogix/concepts-container-storage-options)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: Configure SMB storage permissions for FSLogix](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Microsoft Learn: FSLogix profile containers in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/fslogix-profile-containers)
- [Microsoft Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
- [FSLogix blog: Action required: Windows Kerberos hardening (RC4) may affect FSLogix profiles on SMB storage](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378)
- [Nerdio: FSLogix settings and configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/25499417371661)
- [Nerdio: Which FSLogix Profile storage option should I choose?](https://nmehelp.getnerdio.com/hc/en-us/articles/44790523136269-Which-FSLogix-Profile-storage-option-should-I-choose)
- [Nerdio: 2026-04-01 Kerberos Encryption Enforcement (RC4 Deprecation)](https://nmehelp.getnerdio.com/hc/en-us/articles/44790485692813-2026-04-01-Kerberos-Encryption-Enforcement-RC4-Deprecation)
