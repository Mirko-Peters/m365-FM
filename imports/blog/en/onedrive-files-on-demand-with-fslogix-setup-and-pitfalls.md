---
title: "OneDrive Files On-Demand with FSLogix: setup and pitfalls"
summary: "Microsoft Learn supports the OneDrive sync app on non-persistent virtual desktops that use FSLogix, with a Microsoft 365 subscription, a per-machine install and the latest FSLogix version. Files On-Demand keeps files online-only until they are opened; in our reading, opened files are then stored in the user's container, so container size, disk-space policies and concurrent sessions need attention."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix, onedrive]
keypoints:
  - "Learn lists the OneDrive sync app as supported on non-persistent virtual desktops with FSLogix Apps or the Office container, but requires a per-machine install and the latest FSLogix version. The OS list on that page names Windows 11 and Windows Server 2025 or newer."
  - "Files On-Demand is a OneDrive setting, not an FSLogix one. The FilesOnDemandEnabled policy turns it on for new users; Learn recommends keeping it enabled and says the feature needs Windows 10 version 1709 or later."
  - "The FSLogix FAQ says that with the default OneDrive location, all the data is saved to the user's container, and that OneDrive's disk-space policies check the FSLogix VHD, not the operating system disk. Our reading is that files a user opens are therefore downloaded into the container."
  - "The documented pitfalls are an old FSLogix version (error FSLogix_unsupported_environment before 2009 hotfix 1), several concurrent connections to the same container, a full container, and fixes in FSLogix 26.08 for cloud-only placeholder corruption and OneDrive data loss."
  - "A single profile container is the default advice; a separate Office container (ODFC) includes OneDrive data by default and allows a different container size for it."
faq:
  - q: "Does FSLogix handle OneDrive Files On-Demand by itself?"
    a: "FSLogix redirects the OneDrive data into the container, and the FAQ says it handles the file system redirection behind the scenes. Turning Files On-Demand on or off is a OneDrive setting, controlled by the FilesOnDemandEnabled policy. The FAQ and the configuration reference do not list a separate FSLogix switch for it."
  - q: "Can a user work in two sessions at once with OneDrive and FSLogix?"
    a: "Learn says no. The sync app page states that the OneDrive sync app with FSLogix does not support running multiple instances of the same container at the same time, and the FSLogix reference repeats that OneDrive does not support multiple concurrent connections that use the same profile under any circumstances."
  - q: "Where do I check that a host has a supported FSLogix version?"
    a: "Run C:\\Program Files\\FSLogix\\Apps\\frx.exe version, or read the InstallVersion value under HKLM:\\SOFTWARE\\FSLogix\\Apps. Learn's error page for FSLogix_unsupported_environment names both methods and says versions before FSLogix 2009 hotfix 1 block the OneDrive sync client."
---

Microsoft Learn supports the OneDrive sync app on non-persistent virtual desktops that use FSLogix when the sync app is installed per machine, FSLogix is the latest version and the user has a Microsoft 365 subscription. Files On-Demand keeps files online-only until they are opened. In our reading, whatever a user opens is then stored in the [FSLogix](/entity/fslogix/) container, which makes container size, free-space policies and the one-session-per-container rule the main things to plan. This article sets out what Microsoft Learn documents, a setup sequence, and the pitfalls that are written down.

## What Learn says is supported

The [sync app on virtual desktops](https://learn.microsoft.com/en-us/sharepoint/sync-vdi-support) page lists three supported cases for the [OneDrive](/entity/onedrive/) sync app: virtual desktops that persist between sessions, non-persistent virtual desktops that use [Azure Virtual Desktop](/entity/azure-virtual-desktop/), and non-persistent virtual desktops with FSLogix Apps or the FSLogix Office container plus a Microsoft 365 subscription. For the last case, the page names two operating systems: Windows 11, 32-bit or 64-bit, which it says supports VMDK files, and Windows Server 2025 or newer, which supports VHDX. It does not list other Windows versions in that sentence, so check the page before you plan a different host operating system. For Windows Server the SMB protocol is also required.

Two conditions apply to every non-persistent case. The sync app must be installed per machine, and FSLogix must be the latest version; the page says all non-persistent VDI environments require it. Learn also states that the sync app with FSLogix does not support running multiple instances of the same container simultaneously.

## What Files On-Demand adds

[OneDrive Files On-Demand](/entity/onedrive-files-on-demand/) shows files in File Explorer as online-only entries and downloads content when a file is opened. In Learn's OneDrive policy reference, the setting is **Use OneDrive Files On-Demand**, with the policy name `FilesOnDemandEnabled`. Learn describes three states:

- **Enabled**: new users who set up the sync app see online-only files by default, and file contents do not download until a file is opened.
- **Disabled**: users have the earlier sync behaviour and cannot turn Files On-Demand on.
- **Not configured**: users can turn it on or off themselves.

Enabling the policy sets `HKLM\SOFTWARE\Policies\Microsoft\OneDrive` `FilesOnDemandEnabled` to 1. Learn says the feature is available on Windows 10 Fall Creators Update (version 1709) or later, and recommends keeping it enabled. If the option is missing even though Windows and sync app requirements are met, Learn says to check that the Windows Cloud Files Filter Driver is set to start automatically, which is the registry value `Start` = 2 under `HKLM\SYSTEM\CurrentControlSet\Services\CldFlt`.

## Setup sequence

Learn's numbered list for setting up OneDrive with FSLogix sits in the Citrix section of the sync app page and has four steps: install the sync app per machine, install the latest FSLogix, add the Run entry, and silently configure user accounts. The Horizon section lists the same Run entry and silent sign-in value. Learn does not say there whether every step applies unchanged to Azure Virtual Desktop. The list below is our own compilation: steps 1 to 4 follow Learn's list, step 5 comes from the OneDrive policy page and step 6 from the FSLogix FAQ. Test it on a pilot host.

1. **Install OneDrive per machine.** Learn's per-machine page gives `OneDriveSetup.exe /allusers`, run from a command prompt or through Configuration Manager. It installs under Program Files rather than the user's local app data folder, and Learn says automated migration back to per-user is not supported.
2. **Install the latest FSLogix** on every session host. The FSLogix FAQ says FSLogix does not update through Windows Update and that Microsoft supports only the latest version.
3. **Start the sync app at sign-in.** The Citrix steps add a Run value that launches `OneDrive.exe /background`. The policy list also contains **Start OneDrive automatically when signing in to Windows** (`EnableAutoStart`).
4. **Silently configure user accounts.** The Horizon section sets `SilentAccountConfig` to 1 under `HKLM\Software\Policies\Microsoft\OneDrive` and notes that silent sign-in can take several seconds, so a second attempt may be needed. The Citrix section says silent sign-in should work if the machine is connected to Microsoft Entra ID and that the setting should be turned off for computers that are not Entra joined. The linked [silent configuration page](https://learn.microsoft.com/en-us/sharepoint/use-silent-account-configuration) adds that it will not work on devices for users who require multifactor authentication.
5. **Enable Files On-Demand** with the policy above.
6. **Tell users to keep the default location** when OneDrive asks where to store files. The FSLogix FAQ says to choose `C:\Users\%username%\`; FSLogix uses that location and saves all the data to the user's container.

## Where the data goes

The last point decides the sizing. With Files On-Demand, online-only placeholders take little space, but files a user opens are downloaded. The FAQ does not mention Files On-Demand; in our reading, opened files end up in the container because the FAQ says all OneDrive data is saved there. Two documented facts matter for sizing:

- When profile containers or ODFC containers are in use, OneDrive's disk-space policies check the FSLogix VHD, not the operating system disk. The policy list includes **Block file downloads when users are low on disk space** (`MinDiskSpaceLimitInMB`, 0 to 10,240,000 MB) and **Warn users who are low on disk space** (`WarningMinDiskSpaceLimitInMB`).
- The FAQ says that when a container reaches its `SizeInMBs` limit, users may see odd application behaviour or trouble reaching files. It advises planning at least 30% free space and monitoring warning events at less than 2 GB and less than 500 MB free. With dynamic disks, raising `SizeInMBs` enlarges the container at the next sign-in.

In our reading, a Files On-Demand deployment shifts the sizing question from "how much does a user have in OneDrive" to "how much does a user open in a typical period". Neither the FAQ nor the configuration reference gives a formula. The FAQ also says container size does not affect sign-in time, so a generous limit is not a sign-in penalty.

## Single container or profile plus ODFC

| Question | Single profile container | Profile container plus ODFC |
|---|---|---|
| Learn's default advice | Always use a single profile container unless business or workload needs require separation | Optional configuration |
| OneDrive cache | Part of the [profile container](/entity/fslogix-profile-container/) | In the [Office container](/entity/fslogix-office-container/), which includes OneDrive by default |
| Container size | One size for everything | Allows a different size for data synced from OneDrive |
| Failure isolation | One container | Isolation from loss or corruption in one of the two |

In the ODFC case the setting `IncludeOneDrive` controls whether the OneDrive cache is redirected to the container; its default is 1. The same reference says OneDrive does not support multiple concurrent connections that use the same profile under any circumstances.

## Pitfalls

| Symptom or risk | Cause | What to do |
|---|---|---|
| "FSLogix_unsupported_environment", sync client closes | FSLogix earlier than 2009 hotfix 1 | Install the latest FSLogix; check with `frx.exe version` |
| Sync errors or crash loop with cloud-only files | Fixed in FSLogix 26.08: placeholders could be corrupted during container mirror-back | Run a release that includes the fix |
| Data loss after unlinking OneDrive | Fixed in 26.08: unlinking during a session could lead to data loss | Same |
| OneDrive or Entra sign-in blocked, or certificates missing from the Personal store | Fixed in 26.08: two identity data exclusion issues that could remove certificates from the Personal store or prevent OneDrive/Entra sign-in | Same |
| Files stuck in pending delete | Fixed in 26.08 for `IncludeOneDrive` disabled | Same |
| Container fills up | In our reading, files opened under Files On-Demand are stored in it; the FAQ says all OneDrive data is | Free-space policies, 30% headroom, monitoring |
| Errors with two sessions | Same container used twice | Avoid concurrent sessions for one user |

FSLogix 26.08 was published on 31 August 2026 (version 3.26.826.17182). Check the release notes for a newer version before you roll out, because Microsoft supports only the latest.

## Known folders as an alternative to migration

The FAQ notes that FSLogix has no direct migration path from other roaming-profile solutions, and that implementing OneDrive with known folder move or similar cloud or network storage gives users a location to save their data outside of their profile. In the OneDrive policy reference, the policies **Silently move Windows known folders to OneDrive** and **Prompt users to move Windows known folders to OneDrive** (`KFMOptInWithWizard`) control the move. For the silent policy, the policy's own section sets `KFMSilentOptIn` under `HKLM\SOFTWARE\Policies\Microsoft\OneDrive` to the tenant ID, while the policy list at the top of the page labels it `KFMOptInNoWizard`. Learn does not say what known folder move does to container usage with Files On-Demand, so measure it on a pilot.

## A short test plan

1. Confirm the FSLogix version on each host.
2. Check that OneDrive runs from Program Files and starts at sign-in.
3. Sign in as a test user, confirm silent sign-in and online-only files.
4. Open a large folder and compare container free space before and after.
5. Sign out and sign in on a different host to confirm the sync state follows the user.
6. Try a second session for the same user to see the behaviour before users do.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Use the sync app on virtual desktops](https://learn.microsoft.com/en-us/sharepoint/sync-vdi-support)
- [Microsoft Learn: Install the sync app per-machine (Windows)](https://learn.microsoft.com/en-us/sharepoint/per-machine-installation)
- [Microsoft Learn: Silently configure user accounts](https://learn.microsoft.com/en-us/sharepoint/use-silent-account-configuration)
- [Microsoft Learn: Use OneDrive policies to control sync settings](https://learn.microsoft.com/en-us/sharepoint/use-group-policy)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: Container types in FSLogix](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: OneDrive sync error FSLogix_unsupported_environment on VMs](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/sync/fslogix-unsupported-environment-sync-error-vm)
