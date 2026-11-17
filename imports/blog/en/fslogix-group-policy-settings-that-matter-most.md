---
title: "FSLogix Group Policy settings that matter most"
summary: "To configure FSLogix with Group Policy you copy fslogix.admx and fslogix.adml into a policy store, then set at least Enabled and VHDLocations. This article uses Learn's registry value names to cover the profile container settings Microsoft marks as required or recommended, the ones that need a decision, and what Group Policy does not reset."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix]
keypoints:
  - "FSLogix ships fslogix.admx and fslogix.adml. For a domain, copy them to the SYSVOL central store (PolicyDefinitions and the language folder), then edit a GPO under Computer Configuration > Policies > Administrative Templates > FSLogix."
  - "Learn marks only Enabled and VHDLocations as required for a profile container. It recommends several more, including DeleteLocalProfileWhenVHDShouldApply, FlipFlopProfileDirectoryName and VolumeType set to vhdx."
  - "Settings under HKLM\\SOFTWARE\\FSLogix are treated as preferences: removing the GPO or setting it to Not Configured leaves the registry value on the machine. ODFC settings under Policies reset correctly."
  - "Some settings change data handling for good. DeleteLocalProfileWhenVHDShouldApply permanently deletes a matching local profile, and changing FlipFlopProfileDirectoryName on a live system makes FSLogix create new containers."
  - "GroupPolicyState cannot be set with Group Policy, and RoamSearch is applied before GPOs on hosts that start from a gold image. Many settings have defaults and need no entry."
faq:
  - q: "Which FSLogix settings are required to use profile containers?"
    a: "Microsoft Learn's configuration reference marks Enabled and VHDLocations as required settings for profile containers. Enabled defaults to 0, so profile containers stay off until you set it to 1, and VHDLocations has no default; it holds one or more SMB locations."
  - q: "Why does an FSLogix setting stay on the VM after I remove the GPO?"
    a: "Learn says Group Policy settings stored under HKEY_LOCAL_MACHINE\\SOFTWARE\\FSLogix are considered preferences and not policies, so the registry value remains when the policy is removed or set to Not Configured. This mainly affects Apps, Logging and Profiles settings. ODFC settings under SOFTWARE\\Policies\\FSLogix\\ODFC reset themselves."
  - q: "Can I change FlipFlopProfileDirectoryName on an existing deployment?"
    a: "Learn warns against it without a plan. FSLogix then looks for profile folders with a different naming convention, and when it cannot find the folder it creates a new profile directory and containers. The original data is not lost, but recovery means reverting the setting or moving the user's container to the new folder."
---

FSLogix is configured with Group Policy by copying two template files, fslogix.admx and fslogix.adml, into a policy store and then setting values under **Administrative Templates > FSLogix**. Only two profile container settings are required, Enabled and VHDLocations; a handful more are worth setting deliberately, and some deserve a decision before you roll them out. This guide follows Microsoft Learn's FSLogix documentation. One point Learn makes repeatedly is that a setting with a default value does not need to be created, so you only set what you want to change.

One scope note: the Learn configuration reference lists registry value names such as VHDLocations, not the display names you see in the Group Policy editor, and Learn does not map one to the other. This article therefore uses the registry value names and covers profile container settings only. Our reading: open the template files from the FSLogix download you installed, search the editor for each value name or its description, and use templates and agent from the same release.

## Get the template files in place

The [Group Policy template article](https://learn.microsoft.com/en-us/fslogix/how-to-use-group-policy-templates) describes the steps. For a domain:

1. Download FSLogix and extract the archive.
2. Find fslogix.admx and fslogix.adml.
3. On a domain controller, copy fslogix.admx to `%systemroot%\sysvol\domain\policies\PolicyDefinitions` and fslogix.adml to the language folder below it, for example `...\PolicyDefinitions\en-us`.
4. On a domain-joined machine with the Group Policy Management tools (on a Windows client, add the optional feature RSAT: Group Policy Management Tools), create a GPO on the OU that holds the session host computer accounts and choose **Edit**.
5. Go to **Computer configuration > Policies > Administrative Templates > FSLogix**, open each setting, enable it, fill in values and select **OK**.
6. Wait for the next refresh cycle, or run `GPUPDATE /Target:Computer /force` on a host.

For a single machine, copy the files to `%systemroot%\policyDefinitions` (and the language subfolder) and use gpedit.msc. Learn notes that local policy applies only to that machine, not to other virtual machines, and its configuration options article says local Group Policy does not scale and is meant for test or development environments. The same article lists Intune (settings catalog) as another way to apply FSLogix settings on Windows 10 or 11 multi-session hosts, which suits Entra-joined hosts that have no domain GPO.

## The minimum: what Learn marks required

In the [profile container tutorial](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers), the table of values to add has one required entry, Enabled, set to 1. The [configuration reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles) also marks VHDLocations as a required setting. Everything else is optional or recommended.

| Setting | Default | Learn's tutorial value | Role |
|---|---|---|---|
| Enabled | 0 | 1 | Turns profile containers on (required) |
| VHDLocations | none | an SMB share path | Where FSLogix looks for the container; creates one in the first listed location if none is found (required) |
| VolumeType | vhd | vhdx | New containers are VHDX; recommended because of supported size and fewer corruption scenarios |
| SizeInMBs | 30000 | 30000 | Maximum container size |
| DeleteLocalProfileWhenVHDShouldApply | 0 | 1 | Recommended so users do not keep using local profiles and lose data unexpectedly |
| FlipFlopProfileDirectoryName | 0 | 1 | Recommended; makes container folders easier to browse |
| LockedRetryCount | 12 | 3 | Recommended; faster failure |
| LockedRetryInterval | 5 | 15 | Recommended; same stated aim as the other retry values |
| ReAttachRetryCount | 60 | 3 | Recommended; faster failure |
| ReAttachIntervalSeconds | 10 | 15 | Recommended; faster failure |
| ProfileType | 0 | 0 | Normal profile behavior |

VHDLocations accepts a REG_SZ with locations separated by semicolons or a MULTI_SZ list. Both it and the naming settings accept FSLogix variables such as `%username%`, `%sid%` and `%userdomain%`.

Note the interplay in the retry rows. Learn's recommended values lower the retry count and raise the interval for locking and reattach alike; the stated aim is a faster fail scenario. Whether that suits a slow file share is a judgement for your environment, so pilot it.

## Settings that need a decision

### DeleteLocalProfileWhenVHDShouldApply

Learn's wording is blunt: when FSLogix determines that a user should have a profile container and a local profile exists, FSLogix permanently deletes the local profile. That is the point of the setting, but only turn it on once you have checked that nothing valuable lives in local profiles on those hosts.

### FlipFlopProfileDirectoryName and the naming family

The default folder name is `%sid%_%username%`; setting FlipFlop to 1 makes it `%username%_%sid%`. The reference lists a strict priority order: NoProfileContainingFolder overrides FlipFlopProfileDirectoryName, which in turn overrides SIDDirNameMatch and SIDDirNamePattern. Learn also says SIDDirNameMatch and SIDDirNamePattern have no effect when FlipFlopProfileDirectoryName or NoProfileContainingFolder is enabled, so setting them alongside FlipFlop changes nothing. If you do set them, Learn says the value of each must match its partner: the match value finds what the pattern value creates. Both SIDDirName settings default to `%sid%_%username%`, but VHDNameMatch defaults to `Profile*` and VHDNamePattern to `Profile_%username%`, so match and pattern are not necessarily identical strings. Learn's warning about changing the setting after containers exist is attached to FlipFlopProfileDirectoryName: FSLogix then looks for folders under a different naming convention and, when it cannot find the folder, creates a new profile directory and containers. For the other naming settings, our reading is that the same caution applies.

### SizeInMBs and IsDynamic

SizeInMBs sets the maximum size of the user's container. You can increase it at any time but cannot decrease it, and lowering it does not shrink existing containers. IsDynamic defaults to 1, so the file grows only as needed up to that maximum, and Learn states that dynamic does not let a container grow past SizeInMBs. If a user outgrows it, the user sees errors, so size with the largest realistic profile in mind. Separately, VHDCompactDisk (default enabled) tries to compact the disk at sign-out.

### Failure behavior

PreventLoginWithFailure and PreventLoginWithTempProfile both default to 0. When set to 1, FSLogix loads the FRXShell after a failure to attach or use an existing container, or when a temporary profile has been created, and the user can only sign out. Decide whether a visible failure is preferable to a silent temporary profile. CleanupInvalidSessions (default 0) lets FSLogix try to clean up a VHD(x) that was not detached after an abrupt session end, which can block the next sign-in otherwise. Learn lists it under `HKLM\SOFTWARE\FSLogix\Apps` rather than Profiles, and it affects both profile and ODFC containers.

### Identity, Outlook and search

RoamIdentity defaults to 0, which Learn calls the recommended setting. Learn says not to enable it if you use Microsoft Intune to manage devices or your devices are Microsoft Entra joined. OutlookCachedMode defaults to 1 and temporarily enables cached mode while the container is attached; Outlook must be configured for online mode for this to work. RoamSearch defaults to 0, and Learn says search roaming is no longer necessary on newer Windows versions, including Windows 10 and 11 multi-session.

## Settings to leave alone unless told otherwise

Learn attaches explicit cautions to three values. RedirectType should not be used unless directed by Microsoft Support. VHDXSectorSize should not be used unless directed by Microsoft Support, because a sector size mismatch can lead to a BSOD. AccessNetworkAsComputerObject attaches containers as the computer instead of the user and should be used only when the storage provider cannot work with user-level permissions, because it lets the VM access all VHD(x) files on the share. ProfileType values 1 to 3 are for concurrent access scenarios; Learn says not to mix 0 with any other value, and that OneDrive does not support multiple simultaneous connections using the same profile.

## What Group Policy does not do for you

Three behaviors catch administrators out.

1. **Preferences, not policies.** Settings under `HKLM\SOFTWARE\FSLogix` persist when the GPO is removed or set to Not Configured. Learn says this mainly affects Apps, Logging and Profiles. ODFC settings under `HKLM\SOFTWARE\Policies\FSLogix\ODFC` do reset. Our reading: to undo a change, set the opposite value explicitly rather than unlinking the GPO.
2. **Two exceptions.** Learn states that GroupPolicyState cannot be set using Group Policy, and that RoamSearch is applied before GPOs, so you cannot rely on a GPO for it where a gold image is applied at boot.
3. **Defaults need no entry.** After installation FSLogix creates a base set of registry keys but no configuration value names. Any setting with a default value does not need to be created to take effect.

## Check the result

Sign in as a standard user, open a terminal, go to `C:\Program Files\FSLogix\Apps` and run `.\frx.exe list-redirects`. Learn shows an example of the output, a list headed "Active redirections", and does not interpret it. The check that decides the result is the next step: open the VHDLocations path in File Explorer, open the user's folder and confirm that the VHDX container exists.

## A storage note: Kerberos encryption

Learn's FSLogix pages carry a notice about a change to Windows, included in the April 2026 Windows Server update: the default Kerberos encryption type changes from RC4 to AES-SHA1. File shares hosting FSLogix containers that are not upgraded to AES-SHA1 might have access issues after the change is applied, and Learn advises completing the AES-SHA1 upgrade before installing the update. Customers who have already upgraded are not affected. Learn still words this as an upcoming change, so check the current page and the linked FSLogix blog post for the status before you plan.

## Sources

- [Microsoft Learn: Using FSLogix Group Policy Template Files](https://learn.microsoft.com/en-us/fslogix/how-to-use-group-policy-templates)
- [Microsoft Learn: Configuration Setting Reference (FSLogix)](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles)
- [Microsoft Learn: Configure profile containers using FSLogix](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Learn: Configuration Options (FSLogix)](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-options)
