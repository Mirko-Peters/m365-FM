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
  - "Prepare storage first: share and NTFS permissions, VHDLocations, VolumeType and SizeInMBs. Learn says SizeInMBs can be increased but not decreased, and its configuration reference warns that changing FlipFlopProfileDirectoryName after containers exist makes FSLogix create new profile folders and containers."
  - "Run a pilot with a few users, verify with frx list-redirects and by finding the VHDX on the share, and keep the old profile data until users have signed in successfully for a defined period."
faq:
  - q: "Is there a Microsoft tool that converts all roaming profiles or UPD files to FSLogix?"
    a: "Learn's FSLogix FAQ says FSLogix does not provide a direct migration path from other roaming profile solutions and mentions the frx command-line utility for smaller cases. The frx page documents copy-profile, which copies one user's profile into a VHD(x), and migrate-vhd, which mirrors an existing VHD into a new one. A Nerdio help center article describes an FSLogix migration PowerShell module with the functions Convert-RoamingProfile, Convert-UPDProfile and Convert-UPMProfile, which it calls actively supported and maintained and a fork of the Microsoft FSLogix Migration Private Preview Module. The Learn FAQ and frx pages do not mention that module, so treat it as a Nerdio-described tool and check its repository and syntax before you run it."
  - q: "What happens to a user's local profile when FSLogix is enabled?"
    a: "By default nothing is deleted. With DeleteLocalProfileWhenVHDShouldApply set to 1, Learn says FSLogix permanently deletes a local profile that exists when the user should have a profile container. Learn's Configure profile containers article recommends the setting so users do not use local profiles and lose data unexpectedly, which is why the order of your migration steps matters."
  - q: "Can I just start users with new FSLogix profiles?"
    a: "Yes. Nerdio's help center article says starting with a fresh profile may be beneficial, especially when deploying a new Azure Virtual Desktop environment, and that MSPs and IT teams commonly favor it. Learn's FAQ says OneDrive with known folder move or similar storage gives users a location to save data outside their profile. Our reading: the trade-off is that application settings that live only in the old profile are not carried over, so check which of them matter to your users."
---

FSLogix has no one-click conversion from roaming profiles or user profile disks (UPD). Learn's FSLogix FAQ says FSLogix does not provide a direct migration path from other roaming profile solutions. You can start users with fresh [FSLogix profile containers](/entity/fslogix-profile-container/) and move their files with OneDrive known folder move, or you can copy existing profiles into VHD(x) files with the `frx` utility. This article compares those routes, lists what to prepare, and gives a pilot-first procedure.

## What you are moving from, and to

A roaming user profile, according to Learn's [roaming user profiles article](https://learn.microsoft.com/en-us/windows-server/storage/folder-redirection/deploy-roaming-user-profiles), redirects user profiles to a file share so users receive the same settings on multiple computers. The article lists limitations that matter on shared hosts: the Start menu layout does not roam on Windows 10, Windows Server 2019 or 2016 across several PCs, session hosts or VDI servers, and a separate profile is kept for each operating system version. It names two workarounds: a Start layout applied through Group Policy, or user profile disks.

User profile disks belong to Remote Desktop Services. Learn's [storage article for RDS](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment) says RDS requires a domain-joined file server for UPDs.

An FSLogix profile container works differently. Learn's [container types article](https://learn.microsoft.com/en-us/fslogix/concepts-container-types) says all the data of the user's profile is stored in a VHD(x), and that the function may be compared to UPD, roaming profiles or Citrix User Profile Management, although "the underlying method and technology is different". By default the profile container also holds the Office data, which Learn calls the recommended configuration.

## Choose a migration path

| Path | What it does | Fits | Watch for |
|---|---|---|---|
| Fresh profiles plus OneDrive | Users start with new containers; files come from OneDrive known folder move or other storage | New environments, users with little profile state | Our reading: app settings that were only in the old profile are not carried over |
| `frx copy-profile` | Copies one user's profile into a new VHD(x) | A handful of users | One profile per command, per Nerdio; the FAQ describes frx for local profiles |
| `frx migrate-vhd` | Creates and formats a VHD(x) and mirrors the contents of a source VHD | Existing VHD(x) files you want to place in a new container | The frx page does not say that it converts UPD or Citrix files; test it |
| FSLogix migration PowerShell module (described by Nerdio) | Functions `Convert-RoamingProfile`, `Convert-UPDProfile` and `Convert-UPMProfile` | Roaming profiles, UPD and UPM in larger environments, per Nerdio | Not mentioned in the Learn FSLogix FAQ or frx reference; UPM conversion has had minimal testing in small environments, according to Nerdio |

For the first two rows the FAQ says OneDrive with known folder move or similar storage gives users a location outside their profile, and that for smaller use cases frx can help copy local profiles into a new VHD(x).

Nerdio's help center article [How can I migrate local user profiles to Azure Files and FSLogix?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074356798349-How-can-I-migrate-local-user-profiles-to-Azure-Files-and-FSLogix) says its migration methods suit environments with a simple design, where a full profile migration is unnecessary. The article covers three scenarios: local machine profiles, profiles on an on-premises file server and UPD from an RDSH environment. It asks for a backup first and describes `frx copy-profile` for a handful of profiles, one profile at a time.

For larger environments the article names an FSLogix migration PowerShell module and calls it actively supported and maintained. It says the module is a fork of the Microsoft FSLogix Migration Private Preview Module, which it describes as a script maintained by Microsoft engineers, and points to the FSLogixMigration repository on GitHub for syntax and troubleshooting. `Convert-RoamingProfile` converts all profiles under `C:\Users` in bulk or a single profile path; `Convert-UPDProfile` converts a user profile disk; `Convert-UPMProfile` converts a UPM profile, and the article says that conversion "has undergone minimal testing in small environments". The Learn FAQ and frx pages do not mention this module. The article's syntax lines and examples also use different parameter names (`-VHDMaxSizeGB` against `-MaxVHDSize`, `-IncludeRobocopyDetail` against `-IncludeRobocopyDetails`) and give no syntax for `Convert-UPDProfile`, so read the module's own help in a lab before you rely on it.

## Prepare before the first conversion

### Storage and permissions

Learn's [storage permissions article](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions) for Azure Files recommends the Storage File Data SMB Share Contributor role for all authenticated identities and the Storage File Data SMB Share Elevated Contributor role for the identities that set Windows ACLs. The recommended NTFS ACLs are CREATOR OWNER with Modify on subfolders and files only, your admin group with Full Control, and your user group with Modify on this folder only. Learn's profile container pages also carry a notice about the April 2026 Windows Server update, which changes the default Kerberos encryption type from RC4 to AES-SHA1: file shares that are not upgraded might have access issues. Check your shares before you convert profiles. See [Azure Files](/entity/azure-files/) and, for cloud-only or hybrid sign-in without domain controller line-of-sight, [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/).

### FSLogix settings

Learn's [Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers) article lists the values under `HKLM\SOFTWARE\FSLogix\Profiles`, among them:

| Value | Setting in that article | Note |
|---|---|---|
| `Enabled` | 1 | Required |
| `VHDLocations` | SMB share path | If no VHD(x) is found, one is created in the first listed location |
| `VolumeType` | VHDX | Recommended over VHD for supported size and fewer corruption cases; the configuration reference gives `vhd` as the default |
| `SizeInMBs` | 30000 | Default; the reference says it can be increased at any time, but not decreased |
| `FlipFlopProfileDirectoryName` | 1 | Recommended for easier browsing; changing it in an existing environment can cause users to get new profiles |
| `DeleteLocalProfileWhenVHDShouldApply` | 1 | Recommended so users do not use local profiles and lose data unexpectedly; the reference says it permanently deletes a matching local profile |

The [configuration reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings) says `IsDynamic` defaults to 1, so the VHD(x) only grows on disk as needed.

The two warnings that matter for migration are in that table. First, with `DeleteLocalProfileWhenVHDShouldApply` on, a local profile on a session host is permanently deleted when the user should get a container. Check each pilot user for a local profile on the host before you enable it. Second, pick the `FlipFlopProfileDirectoryName` value before you copy any profile, because the folder name is part of how FSLogix finds the container.

## Procedure

1. **Inventory.** List users, profile sizes, the profile solution, the Windows versions behind the profiles, and what users keep outside the profile (redirected folders, OneDrive). The roaming profile article says separate profiles exist per operating system version, so our reading is to migrate the version that matches your new session hosts; the sources do not say whether the Nerdio module handles the version folders.
2. **Back up.** The Nerdio help center article asks for a backup before migration; keep the old profile store read-only after cutover.
3. **Build storage and permissions.** Create the share, the roles and the NTFS ACLs above, and test with one standard user.
4. **Configure FSLogix on a test session host.** Set the registry values from the table. Learn's verification steps: sign in as a standard user, run `frx.exe list-redirects` from `C:\Program Files\FSLogix\Apps` (output should begin with "Active redirections" and end with "Operation completed successfully!"), then browse to the `VHDLocations` path and find the VHDX in the user's folder.
5. **Convert the pilot users.** The command depends on the source.
   - **Local profiles: `frx copy-profile`.** The Learn examples are `frx copy-profile -filename C:\Profile.vhd -username CONTOSO\msmith` for a profile under 5 GB, and the same with `-size-mbs 30000` for a larger one. Learn says that if the local profile exceeds 5 GB you must specify `-size-mbs` with a value greater than 5000. Learn's examples use a `.vhd` file name, but the Configure profile containers article prefers VHDX, so our suggestion is a `.vhdx` file name with `VolumeType` set to `vhdx`. Nerdio's example does the same: `frx copy-profile -filename C:\Profile.vhdx -username CONTOSO\msmith -size-mbs 30000 -dynamic 1 -verbose`.
   - **Roaming profiles and UPD.** The Learn FAQ describes `copy-profile` for local profiles, and the frx page describes the `-profile-path` parameter only as "Specify the profile path", so Learn does not document how a roaming profile or a UPD reaches `copy-profile`. The route Nerdio names is the migration module (`Convert-RoamingProfile`, `Convert-UPDProfile`). Its examples point `-ParentPath` at `C:\Users\` and `-ProfilePath` at `C:\Users\User1`; the article shows no roaming profile share path, so test with a copy of the data.
   - **Where the file goes.** The frx page does not say which names FSLogix expects on the share, but the configuration reference gives the defaults. The folder is `%sid%_%username%` (`SIDDirNamePattern` and `SIDDirNameMatch`), or `%username%_%sid%` when `FlipFlopProfileDirectoryName` is 1, which overrides both. The file is `Profile_%username%` (`VHDNamePattern`, matched by `VHDNameMatch` `Profile*`) with the extension from `VolumeType`. Our reading from those defaults: with FlipFlop set to 1, a container for `msmith` would sit at `<VHDLocations>\msmith_<SID>\Profile_msmith.vhdx`. Copy to a local path first, move the file there, and confirm in the pilot that a sign-in attaches it and that the user can access the folder and file.
6. **Sign in and verify.** The user should reach the same files and settings, and `list-redirects` should show the redirection. Check the share for a single container per user.
7. **Plan the cutover.** Set `Enabled` to 1 on the production hosts in waves, communicate a sign-out window, and keep the old profile store untouched.
8. **Slim down later.** If you add `redirections.xml` exclusions after migration, the FAQ says that exclusion does not remove data already in existing profiles. See [redirections.xml](/entity/fslogix-redirections-xml/) for the follow-up.

## Common problems to expect

- **Duplicate containers.** Learn's configuration reference says that changing `FlipFlopProfileDirectoryName` after containers exist makes FSLogix look for a different folder name and create a new folder and container. The original data is not lost; recovery requires reverting the setting or manually moving the container to the new folder.
- **User data in the wrong place.** If files lived only in the profile, OneDrive known folder move moves them out first. The FAQ describes OneDrive known folder move as a way to keep data outside the profile, and says that when users sign in to OneDrive they should accept the default location `C:\Users\%username%\`; see [OneDrive](/entity/onedrive/).
- **Concurrent sessions during the pilot.** The configuration reference says that if the VHD is not accessed concurrently, `ProfileType` should be 0, and that hosts using the same VHD should not mix 0 with other values.
- **Test user already has a local profile.** The Entra Kerberos article notes that a user who signed in before has a local profile used for the session, unless you enable `DeleteLocalProfileWhenVHDShouldApply` or use a new test account.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: FSLogix overview FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: frx command-line utility](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: FSLogix profile container and Office container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: FSLogix SMB storage permissions for Azure Files](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Microsoft Learn: Deploy roaming user profiles](https://learn.microsoft.com/en-us/windows-server/storage/folder-redirection/deploy-roaming-user-profiles)
- [Microsoft Learn: Deploy a two-node Storage Spaces Direct SOFS for UPD storage in Azure](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Nerdio Manager for MSP help center: How can I migrate local user profiles to Azure Files and FSLogix?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074356798349-How-can-I-migrate-local-user-profiles-to-Azure-Files-and-FSLogix)
