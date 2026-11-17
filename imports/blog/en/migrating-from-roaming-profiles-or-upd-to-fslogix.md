---
title: "Migrating from roaming profiles or UPD to FSLogix"
summary: "Microsoft's FSLogix FAQ says there is no direct migration path from other roaming profile solutions. It points to OneDrive known folder move for user data and to the frx utility, which it describes for copying local profiles."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix, fslogix-profile-container]
keypoints:
  - "The FSLogix FAQ states that FSLogix does not provide a direct migration path from other roaming profile solutions. It points to OneDrive with known folder move for user data and to the frx utility, which it describes for copying local profiles in smaller cases."
  - "frx copy-profile copies one user's profile into a VHD or VHDX. If the local profile is larger than 5 GB, you must set -size-mbs above 5000. frx migrate-vhd mirrors an existing VHD into a new one."
  - "Learn says FSLogix by default honors an existing local profile instead of the container, and that enabling DeleteLocalProfileWhenVHDShouldApply deletes the local profile at sign-in and creates or attaches the container. Learn warns to review which local profiles exist first. Our suggestion: copy and back up before you enable it."
  - "Prepare storage first: share and NTFS permissions, VHDLocations, VolumeType and SizeInMBs. Learn says SizeInMBs can be increased but not decreased, and its configuration reference warns that changing FlipFlopProfileDirectoryName after containers exist makes FSLogix create new profile folders and containers."
  - "Run a pilot with a few users, verify with frx list-redirects and by finding the VHDX on the share, and, as our suggestion, keep the old profile data until users have signed in successfully for a defined period."
faq:
  - q: "Is there a Microsoft tool that converts all roaming profiles or UPD files to FSLogix?"
    a: "Learn's FSLogix FAQ says FSLogix does not provide a direct migration path from other roaming profile solutions and mentions the frx command-line utility for smaller cases. The frx page documents copy-profile, which copies one user's profile into a VHD(x), and migrate-vhd, which mirrors an existing VHD into a new one. A Nerdio help center article describes an FSLogix migration PowerShell module with the functions Convert-RoamingProfile, Convert-UPDProfile and Convert-UPMProfile, which it calls actively supported and maintained. The Learn FAQ and frx pages do not mention that module, and the README of its GitHub repository calls it private preview and not recommended for production workloads, so test it on copies of the data."
  - q: "What happens to a user's local profile when FSLogix is enabled?"
    a: "By default nothing is deleted, and Learn says FSLogix honors an existing local profile instead of creating or looking for a container. With DeleteLocalProfileWhenVHDShouldApply set to 1, Learn says FSLogix permanently deletes a local profile that exists when the user should have a profile container, at sign-in. Learn's Configure profile containers article recommends the setting so users do not use local profiles and lose data unexpectedly. Learn warns to review which local profiles exist before enabling it, which is why the order of your migration steps matters."
  - q: "Can I just start users with new FSLogix profiles?"
    a: "Yes. Nerdio's help center article says starting with a fresh profile may be beneficial, especially when deploying a new Azure Virtual Desktop environment. Learn's FAQ says OneDrive with known folder move or similar storage gives users a location to save data outside their profile. Our reading: application settings that live only in the old profile are not carried over, so check which matter to your users."
---

Learn's FSLogix FAQ says FSLogix does not provide a direct migration path from other roaming profile solutions. It does not name roaming profiles or user profile disks (UPD); our reading is that both fall under that wording. The FAQ points to OneDrive known folder move for keeping data outside the profile and describes the `frx` utility only for copying local profiles into a new [FSLogix profile container](/entity/fslogix-profile-container/) VHD(x).

## What you are moving from, and to

Learn's [roaming user profiles article](https://learn.microsoft.com/en-us/windows-server/storage/folder-redirection/deploy-roaming-user-profiles) says roaming user profiles redirect user profiles to a file share so users receive the same settings on multiple computers, with separate profile versions for different operating system versions.

An FSLogix profile container works differently. Learn's [container types article](https://learn.microsoft.com/en-us/fslogix/concepts-container-types) says all the data of the user's profile is stored in a VHD(x), and that the function may be compared to UPD, roaming profiles or Citrix User Profile Management, although "the underlying method and technology is different".

## Choose a migration path

| Path | What it does | Fits | Watch for |
|---|---|---|---|
| Fresh profiles plus OneDrive | Users start with new containers; OneDrive known folder move or similar storage gives data a location outside the profile | New environments; our reading: users with little profile state | Our reading: app settings that were only in the old profile are not carried over; known folder move has a condition after Folder Redirection (see "Common problems") |
| `frx copy-profile` | Copies one user's profile into a new VHD(x) | A handful of users | One profile per command, per Nerdio; the FAQ describes frx for local profiles |
| `frx migrate-vhd` | Creates and formats a VHD(x) and mirrors the contents of a source VHD | Existing VHD(x) files you want to place in a new container | The frx page does not say that it converts UPD or Citrix files; test it |
| FSLogix migration PowerShell module (described by Nerdio) | Functions `Convert-RoamingProfile`, `Convert-UPDProfile` and `Convert-UPMProfile` | Roaming profiles, UPD and UPM in larger environments, per Nerdio | The repository README calls it private preview and not recommended for production workloads; UPM conversion has had minimal testing, per Nerdio |

Nerdio's help center article [How can I migrate local user profiles to Azure Files and FSLogix?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074356798349-How-can-I-migrate-local-user-profiles-to-Azure-Files-and-FSLogix) says its methods suit simple environments where a full profile migration is unnecessary. It asks for a backup first and describes `frx copy-profile` for a handful of profiles, one at a time.

For larger environments Nerdio's article names an FSLogix migration PowerShell module, calls it actively supported and maintained, and describes it as a fork of the Microsoft FSLogix Migration Private Preview Module. It links the [FSLogixMigration repository](https://github.com/gregdod/FSLogixMigration) for syntax. That README states the status differently: the module is "currently private preview", provided without a service level agreement and "not recommended for production workloads", and FSLogix Profile Container may not support all functionality. We cannot reconcile the two statements, so test with copies of the data. The README requires at least read access to all files in the source profile.

In the README syntax, `Convert-RoamingProfile` takes a parent path, a single profile path or a CSV list; `Convert-UPDProfile` converts a user profile disk; `Convert-UPMProfile` converts a UPM profile, which Nerdio says "has undergone minimal testing in small environments". The README's syntax and examples name parameters differently in places (`-VHDMaxSizeGB` against `-MaxVHDSize`), so read the module's help in a lab first.

## Prepare before the first conversion

### Storage and permissions

Learn's [storage permissions article](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions) for Azure Files recommends the Storage File Data SMB Share Contributor role for all authenticated identities and the Storage File Data SMB Share Elevated Contributor role for the identities that set Windows ACLs. The recommended NTFS ACLs are CREATOR OWNER with Modify on subfolders and files only, your admin group with Full Control, and your user group with Modify on this folder only. That article and the Entra ID article listed under Sources carry a notice, which Learn still words as an upcoming change in the April 2026 Windows Server update: the default Kerberos encryption type is changing from RC4 to AES-SHA1, and file shares hosting FSLogix containers that are not upgraded might have access issues. See [Azure Files](/entity/azure-files/) and, for cloud-only or hybrid sign-in without domain controller line-of-sight, [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/).

### FSLogix settings

Learn's [Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers) article lists the values under `HKLM\SOFTWARE\FSLogix\Profiles`, among them:

| Value | Setting in that article | Note |
|---|---|---|
| `Enabled` | 1 | Required |
| `VHDLocations` | SMB share path | If no VHD(x) is found, one is created in the first listed location |
| `VolumeType` | VHDX | Recommended over VHD for supported size and fewer corruption cases; the configuration reference gives `vhd` as the default |
| `SizeInMBs` | 30000 | Default; the reference says it can be increased at any time, but not decreased |
| `FlipFlopProfileDirectoryName` | 1 | Recommended for easier browsing; changing it in an existing environment can cause users to get new profiles |
| `DeleteLocalProfileWhenVHDShouldApply` | 1 | Recommended so users do not use local profiles and lose data unexpectedly; the reference says its default is 0 and that FSLogix permanently deletes a local profile when this is 1. At 0, Learn says an existing local profile is honored instead of the container. Our suggestion: enable it for a user only after that user's profile is copied and backed up |

Two settings matter for the order of work. Pick the `FlipFlopProfileDirectoryName` value before you copy any profile, because the folder name is part of how FSLogix finds the container. `DeleteLocalProfileWhenVHDShouldApply` comes after the copy (steps 5 and 6), because a user's local profile on a host otherwise takes precedence over the copied container.

## Procedure

1. **Inventory.** List users, profile sizes, the profile solution, Windows versions, and what users keep outside the profile (Group Policy folder redirection, OneDrive). Learn describes separate profile versions per operating system version, so our reading is to migrate the version that matches your new session hosts.
2. **Back up.** The Nerdio help center article asks for a backup before migration; our suggestion: keep the old profile store read-only after cutover.
3. **Build storage and permissions.** Create the share, the roles and the NTFS ACLs above, and test with one standard user.
4. **Configure FSLogix on a test session host.** Set the registry values from the table, except `DeleteLocalProfileWhenVHDShouldApply` (step 6). Learn's verification steps: sign in as a standard user, run `frx.exe list-redirects` from `C:\Program Files\FSLogix\Apps`, then browse to the `VHDLocations` path and find the VHDX in the user's folder. Learn's Entra ID article says a user who signed in before has a local profile that is used instead, so test with a new account.
5. **Convert the pilot users.** The command depends on the source.
   - **Local profiles: `frx copy-profile`.** Learn's example is `frx copy-profile -filename C:\Profile.vhd -username CONTOSO\msmith`. Learn says that if the local profile exceeds 5 GB you must specify `-size-mbs` with a value greater than 5000. That example uses `.vhd`, but the Configure profile containers article prefers VHDX, so our suggestion is `.vhdx` with `VolumeType` set to `vhdx`.
   - **Roaming profiles and UPD.** The Learn FAQ describes `copy-profile` for local profiles, and the frx page describes `-profile-path` only as "Specify the profile path", so neither the FAQ nor the frx reference says how a roaming profile or a UPD reaches `copy-profile`. The route Nerdio names is the migration module, which its README calls private preview. Its README example for UPD is `Convert-UPDProfile -ParentPath F:\Shares\UPDs -Target F:\Shares\FSLogixProfiles -VHDMaxSizeGB 30 -VHDLogicalSectorSize 4K -SwapDirectoryNameComponents -LogPath F:\LogFiles\UPDtoFSLogixMigration\Log.txt`. The README does not explain `-VHDLogicalSectorSize`. For the FSLogix `VHDXSectorSize` setting, Learn cautions: "Don't use this setting unless directed by Microsoft Support. A mismatch in disk sector sizes can lead to a system BSOD." That caution names a registry setting, not the module parameter; test the module's value in a lab. The README says the switch names folders username_SID to match the GPO setting "Swap directory name components"; our reading: this fits `FlipFlopProfileDirectoryName` 1. Both syntaxes include `-WhatIf`; start there on a copy of the data. `Convert-RoamingProfile` has no `-SwapDirectoryNameComponents` switch in the README syntax.
   - **Fresh profiles plus OneDrive.** Our reading: known folder move acts on the device where its policy runs, so a fresh container has nothing to move; enable it before cutover, while the data is still in the old profile, and let uploads finish. Learn says to roll out the configuration slowly.
   - **Where the file goes.** The configuration reference gives the default names: the folder is `%sid%_%username%`, or `%username%_%sid%` when `FlipFlopProfileDirectoryName` is 1, and the file is `Profile_%username%` with the type set by `VolumeType`. Confirm in the pilot that a standard user's sign-in attaches the container.
6. **Enable local profile removal, sign in and verify.** Learn says FSLogix honors an existing local profile by default, so with the value at 0 a pilot user who still has a local profile on the host gets that profile, not the copied container. Learn says enabling `DeleteLocalProfileWhenVHDShouldApply` deletes the local profile at sign-in and creates or attaches the container, and warns to review which local profiles exist first to limit data loss. Our suggestion: back up the local profile, check that the copy exists, then set the value to 1 on the test host. The user should then reach the same files and settings, and `list-redirects` should show the redirection.
7. **Plan the cutover.** Set `Enabled` to 1 on the production hosts in waves (our suggestion) and keep the old profile store untouched. Our reading: because the setting deletes local profiles for every user who signs in on that host, enable it there only after the local profiles that matter are copied and backed up.

## Common problems to expect

- **Duplicate containers.** Learn's configuration reference says that changing `FlipFlopProfileDirectoryName` after containers exist makes FSLogix look for a different folder name and create a new folder and container. The original data is not lost; recovery requires reverting the setting or manually moving the container to the new folder.
- **User data in the wrong place.** Learn's [known folder move article](https://learn.microsoft.com/en-us/sharepoint/redirect-known-folders) names five folders: Desktop, Documents, Pictures, Screenshots and Camera Roll. The same article says the known folder move Group Policy objects do not work if Windows Folder Redirection Group Policy objects previously redirected Documents, Pictures or Desktop to a location other than OneDrive. For folders redirected to a network file share it describes copying the contents to OneDrive with Migration Manager, disabling Folder Redirection, then enabling known folder move. See [OneDrive](/entity/onedrive/).
- **User gets the local profile, not the container.** Learn's [article on old, temp or local profiles](https://learn.microsoft.com/en-us/fslogix/troubleshooting-old-temp-local-profiles) says the default is to honor the local profile and that enabling `DeleteLocalProfileWhenVHDShouldApply` deletes it at sign-in. The Entra Kerberos article notes the same for test users who signed in before; it also suggests a new test account.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: FSLogix overview FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: frx command-line utility](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: FSLogix profile container and Office container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: FSLogix SMB storage permissions for Azure Files](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Microsoft Learn: Deploy roaming user profiles](https://learn.microsoft.com/en-us/windows-server/storage/folder-redirection/deploy-roaming-user-profiles)
- [Microsoft Learn: Issues with old, temp or local profiles](https://learn.microsoft.com/en-us/fslogix/troubleshooting-old-temp-local-profiles)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Microsoft Learn: Redirect and move Windows known folders to OneDrive](https://learn.microsoft.com/en-us/sharepoint/redirect-known-folders)
- [GitHub: FSLogixMigration repository README (gregdod/FSLogixMigration)](https://github.com/gregdod/FSLogixMigration)
- [Nerdio Manager for MSP help center: How can I migrate local user profiles to Azure Files and FSLogix?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074356798349-How-can-I-migrate-local-user-profiles-to-Azure-Files-and-FSLogix)
