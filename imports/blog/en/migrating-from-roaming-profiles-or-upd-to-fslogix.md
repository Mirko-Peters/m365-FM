---
title: "Migrating from roaming profiles or UPD to FSLogix"
summary: "Microsoft's FSLogix FAQ says there is no direct migration path from other roaming profile solutions. In practice you choose between starting with fresh profiles and moving data with OneDrive, or copying existing profiles into VHD(x) containers with the frx utility."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix, fslogix-profile-container]
keypoints:
  - "The FSLogix FAQ states that FSLogix does not provide a direct migration path from other roaming profile solutions. It points to OneDrive with known folder move for user data and to the frx utility for smaller cases."
  - "frx copy-profile copies one user's profile into a VHD or VHDX. If the local profile is larger than 5 GB, you must set -size-mbs above 5000. frx migrate-vhd mirrors an existing VHD into a new one."
  - "Set DeleteLocalProfileWhenVHDShouldApply only when you accept the consequence: Learn says FSLogix then permanently deletes a local profile that exists when the user should get a container."
  - "Prepare storage first: share and NTFS permissions, VHDLocations, VolumeType and SizeInMBs. Learn says SizeInMBs can be increased but not decreased, and that changing FlipFlopProfileDirectoryName after containers exist makes FSLogix create new ones."
  - "Run a pilot with a few users, verify with frx list-redirects and by finding the VHDX on the share, and keep the old profile data until users have signed in successfully for a defined period."
faq:
  - q: "Is there a Microsoft tool that converts all roaming profiles or UPD files to FSLogix?"
    a: "Learn's FSLogix FAQ says FSLogix does not provide a direct migration path from other roaming profile solutions and mentions the frx command-line utility for smaller cases. The frx page documents copy-profile, which copies one user's profile into a VHD(x), and migrate-vhd, which mirrors an existing VHD into a new one. A Nerdio knowledge base article describes a 'FSLogix migration PowerShell module' for bulk conversion; the frx page does not document such a module, so check its source and support status yourself."
  - q: "What happens to a user's local profile when FSLogix is enabled?"
    a: "By default nothing is deleted. With DeleteLocalProfileWhenVHDShouldApply set to 1, Learn says FSLogix permanently deletes a local profile that exists when the user should have a profile container. Learn's tutorial recommends the setting so users do not use local profiles and lose data unexpectedly, which is why the order of your migration steps matters."
  - q: "Can I just start users with new FSLogix profiles?"
    a: "Yes, and for a new Azure Virtual Desktop environment it can be the simplest option. Learn's FAQ recommends keeping user data in OneDrive with known folder move or similar storage, so that data is outside the profile. The Nerdio knowledge base article also names fresh profiles as a possible choice for new environments. The trade-off is that users lose application settings that live only in the old profile."
---

FSLogix has no one-click conversion from roaming profiles or user profile disks (UPD). Learn's FSLogix FAQ says FSLogix does not provide a direct migration path from other roaming profile solutions. You can start users with fresh [FSLogix profile containers](/entity/fslogix-profile-container/) and move their files with OneDrive known folder move, or you can copy existing profiles into VHD(x) files with the `frx` utility. This article compares those routes, lists what to prepare, and gives a pilot-first procedure.

## What you are moving from, and to

A roaming user profile, according to Learn's [roaming user profiles article](https://learn.microsoft.com/en-us/windows-server/storage/folder-redirection/deploy-roaming-user-profiles), redirects user profiles to a file share so users receive the same settings on multiple computers. The article lists limitations that matter on shared hosts: the Start menu layout does not roam on Windows 10, Windows Server 2019 or 2016 if users use more than one PC, Remote Desktop Session Host or VDI server, and a separate profile is maintained for each operating system version, so profiles double in number if you support two versions. It suggests user profile disks as a workaround for the Start menu on session hosts.

User profile disks belong to Remote Desktop Services. Learn's [storage article for RDS](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment) says RDS requires a domain-joined file server for UPDs.

An FSLogix profile container works differently. Learn's [container types article](https://learn.microsoft.com/en-us/fslogix/concepts-container-types) says all the data of the user's profile is stored in a VHD(x), and that the function may be compared to UPD, roaming profiles or Citrix User Profile Management, although "the underlying method and technology is different". By default the profile container also holds the Office data, which Learn calls the recommended configuration. Some content is redirected to a local `local_<username>` folder or deleted at sign-out, according to the exclusion lists on that page.

The sibling article on pooled and personal host pools explains why [pooled](/entity/avd-pooled-host-pool/) desktops need profile data that follows the user.

## Choose a migration path

| Path | What it does | Fits | Watch for |
|---|---|---|---|
| Fresh profiles plus OneDrive | Users start with new containers; files come from OneDrive known folder move or other storage | New environments, users with little profile state | App settings that were only in the old profile are not carried over |
| `frx copy-profile` | Copies one user's profile into a new VHD(x) | A handful of users | One profile per command; the FAQ describes it for local profiles |
| `frx migrate-vhd` | Creates and formats a VHD(x) and mirrors the contents of a source VHD | Existing VHD(x) files you want to place in a new container | The frx page does not say that it converts UPD or Citrix files; test it |
| Third-party or scripted bulk tools | Automate many conversions | Large estates | Check source, support and testing status yourself |

The FAQ's wording for the first two rows is: implementing OneDrive with known folder move or a similar cloud or network storage solution gives users a location to save data outside their profile, and for smaller use cases the frx utility can help copy local profiles into a new VHD(x).

A Nerdio knowledge base article, [How can I migrate local user profiles to Azure Files and FSLogix?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074356798349-How-can-I-migrate-local-user-profiles-to-Azure-Files-and-FSLogix), covers local profiles, on-premises file server profiles and UPD from an RDSH environment. It recommends a backup first, describes `frx copy-profile` for a handful of profiles, mentions an FSLogix migration PowerShell module for roaming profiles, UPD and UPM in larger environments, and says that the built-in command handles one profile at a time. It also says UPM conversion has had minimal testing in small environments. Treat the module as a tool to evaluate on its own merits, because Learn's frx page does not document it.

## Prepare before the first conversion

### Storage and permissions

Learn's [storage permissions article](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions) for Azure Files recommends the Storage File Data SMB Share Contributor role for all authenticated identities and the Storage File Data SMB Share Elevated Contributor role for the identities that set Windows ACLs. The recommended NTFS ACLs are CREATOR OWNER with Modify on subfolders and files only, your admin group with Full Control, and your user group with Modify on this folder only. Learn also warns about an April 2026 Windows update that changes the default Kerberos encryption type from RC4 to AES-SHA1: file shares that are not upgraded might have access issues, so complete the upgrade before installing the update. See [Azure Files](/entity/azure-files/) and, for cloud-only or hybrid sign-in without domain controller line-of-sight, [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/).

### FSLogix settings

Learn's [profile container tutorial](https://learn.microsoft.com/en-us/fslogix/tutorial-configure-profile-containers) lists the values under `HKLM\SOFTWARE\FSLogix\Profiles`, among them:

| Value | Tutorial setting | Note from the reference |
|---|---|---|
| `Enabled` | 1 | Required |
| `VHDLocations` | SMB share path | If no VHD(x) is found, one is created in the first listed location |
| `VolumeType` | VHDX | Recommended over VHD for supported size and fewer corruption cases |
| `SizeInMBs` | 30000 | Default; can be increased at any time, but not decreased |
| `FlipFlopProfileDirectoryName` | 1 | Recommended for easier browsing; changing it after containers exist makes FSLogix look for a different folder name and create new containers |
| `DeleteLocalProfileWhenVHDShouldApply` | 1 | Recommended so users do not use local profiles; permanently deletes a matching local profile |

The [configuration reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings) says `IsDynamic` defaults to 1, so the VHD(x) only grows on disk as needed, and the container still cannot grow past `SizeInMBs` without users seeing errors.

The two warnings that matter for migration are in that table. First, with `DeleteLocalProfileWhenVHDShouldApply` on, a local profile on a session host is permanently deleted when the user should get a container. Our reading, not a Learn statement: roaming profiles and UPDs are not local profiles on the session host, but a user who signed in to a host without them may have one, so decide deliberately. Second, pick the `FlipFlopProfileDirectoryName` value before you copy any profile, because the folder name is part of how FSLogix finds the container.

## Procedure

1. **Inventory.** List users, profile sizes, the profile solution, the Windows versions behind the profiles, and what users keep outside the profile (redirected folders, OneDrive). The roaming profile article says separate profiles exist per operating system version, so migrate the version that matches your new session hosts.
2. **Back up.** The Nerdio article asks for a backup before migration; keep the old profile store read-only after cutover.
3. **Build storage and permissions.** Create the share, the roles and the NTFS ACLs above, and test with one standard user.
4. **Configure FSLogix on a test session host.** Set the registry values from the table. Learn's tutorial verification: sign in as a standard user, run `frx.exe list-redirects` from `C:\Program Files\FSLogix\Apps` (output should begin with "Active redirections" and end with "Operation completed successfully!"), then browse to the `VHDLocations` path and find the VHDX in the user's folder.
5. **Convert the pilot users.** With `frx copy-profile`, the pattern from Learn is `frx copy-profile -filename C:\Profile.vhd -username CONTOSO\msmith` for a profile under 5 GB, and `frx copy-profile -filename C:\Profile.vhd -username CONTOSO\msmith -size-mbs 30000` for a larger one. Learn says that if the local profile exceeds 5 GB you must specify `-size-mbs` with a value greater than 5000. The command also takes `-dynamic`, `-profile-path` and `-redirections`. The frx page does not say which folder naming FSLogix expects for the resulting file on the share. Our reading: copy to a local path first, then move the file into the user's folder on the share, and confirm in the pilot that a sign-in attaches it. Do not assume it.
6. **Sign in and verify.** The user should reach the same files and settings, and `list-redirects` should show the redirection. Check the share for a single container per user.
7. **Plan the cutover.** Set `Enabled` to 1 on the production hosts in waves, communicate a sign-out window, and keep the old profile store untouched.
8. **Slim down later.** If you add `redirections.xml` exclusions after migration, the FAQ says that exclusion does not remove data already in existing profiles. See [redirections.xml](/entity/fslogix-redirections-xml/) for the follow-up.

## Common problems to expect

- **Large profiles.** Learn says a local profile above 5 GB needs `-size-mbs` greater than 5000; set the size on purpose, and remember that `SizeInMBs` can only be increased.
- **Duplicate containers.** Changing `FlipFlopProfileDirectoryName` after the first containers exist causes new containers; the original data stays in the old folder and recovery means reverting the setting or moving the container.
- **User data in the wrong place.** If files lived only in the profile, OneDrive known folder move moves them out first. The FAQ recommends storage outside the profile; see [OneDrive](/entity/onedrive/).
- **Concurrent access.** Keep `ProfileType` at 0 unless you have a reason, as in Learn's tutorial.
- **Share authentication.** The Entra Kerberos article notes that a user who signed in before has a local profile used for the session, unless you enable `DeleteLocalProfileWhenVHDShouldApply` or use a new test account.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: FSLogix overview FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: frx command-line utility](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: Configure profile containers using FSLogix](https://learn.microsoft.com/en-us/fslogix/tutorial-configure-profile-containers)
- [Microsoft Learn: FSLogix profile container and Office container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: FSLogix SMB storage permissions for Azure Files](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Microsoft Learn: Deploy roaming user profiles](https://learn.microsoft.com/en-us/windows-server/storage/folder-redirection/deploy-roaming-user-profiles)
- [Microsoft Learn: Deploy a Storage Spaces Direct scale-out file server for UPD storage in Azure](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment)
- [Microsoft Learn: Create a profile container with Azure Files and Microsoft Entra Kerberos](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-azure-ad)
- [Nerdio: How can I migrate local user profiles to Azure Files and FSLogix?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074356798349-How-can-I-migrate-local-user-profiles-to-Azure-Files-and-FSLogix)
