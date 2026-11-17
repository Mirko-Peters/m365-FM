---
title: "New Teams on AVD with FSLogix: what to know"
summary: "New Teams on Azure Virtual Desktop needs FSLogix 2210 hotfix 3 or later, and Microsoft recommends hotfix 4 or later. If you use a separate Office container, you must also set IncludeTeams so Teams data stays in the container."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-teams-media-optimization, fslogix]
keypoints:
  - "Learn's Teams on AVD page requires FSLogix 2210 hotfix 3 (2.9.8716.30241) or later for new Teams. Learn's Teams for VDI page recommends 2210 hotfix 4 (2.9.8884.27471), and the FSLogix release notes say customers are required to use the latest version, currently 26.08 (3.26.826.17182, published on 31 August 2026)."
  - "Learn recommends the single Profile container and calls a dual Profile plus ODFC setup neither necessary nor recommended. If you do use ODFC, Learn says to add IncludeTeams (DWORD 1), a value that the tutorial's PowerShell sample does not set."
  - "Folder Redirection and Roaming User Profiles are not supported for new Teams in VDI, because they cannot roam the MSTeams_8wekyb3d8bbwe LocalCache folder. Learn names FSLogix, Citrix Profile Manager or Omnissa DEM as complementary tools."
  - "In a pooled host pool, Teams must be installed per machine. Learn recommends the teamsbootstrapper.exe -p command for VDI, which provisions the latest client for all users on the machine."
  - "Classic Teams on VDI ended support on 1 October 2026 and reaches end of availability on 1 April 2027. Learn splits cache exclusions into recommended ones and ones that trade profile size against launch speed. FSLogix pages also say LocalCache contents are deleted at sign-out, which Learn does not reconcile with Teams guidance, so test sign-out and sign-in."
faq:
  - q: "Do I need IncludeTeams if I only use a Profile container?"
    a: "Learn's Teams for VDI page asks only customers using Profile and ODFC, or ODFC only, to add IncludeTeams. The ODFC configuration page says: \"All benefits of the ODFC container are automatic when using profile containers in a single container configuration.\" One caveat: FSLogix's container types page lists AppData\\Local\\Packages\\*\\LocalCache among folders deleted at sign-out, and Learn does not explain how that fits with Teams data under LocalCache. Test sign-out and sign-in in a pilot."
  - q: "Which FSLogix version should I run for new Teams?"
    a: "Learn's two Teams pages differ: the Teams on AVD page names 2210 hotfix 3 (2.9.8716.30241) or later as the requirement, and the Teams for VDI page recommends 2210 hotfix 4 (2.9.8884.27471) for proper integration with Teams in VDI. The FSLogix release notes say customers are required to install and use the latest version and list 26.08 (3.26.826.17182, 31 August 2026) as the newest release. Hotfix 4 is the release whose notes list the new Teams fixes."
  - q: "Can I roam new Teams with Roaming User Profiles or Folder Redirection?"
    a: "No. Learn says Folder Redirection and Roaming User Profiles are not supported for Teams in VDI, because they cannot roam AppData\\Local\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams. Use a complementary tool such as FSLogix, Citrix Profile Manager or Omnissa DEM."
---

New Teams on Azure Virtual Desktop works with FSLogix, but only from a minimum FSLogix version and with the right container settings: Microsoft documents FSLogix 2210 hotfix 3 or later as a requirement, recommends hotfix 4 or later, and asks for the `IncludeTeams` setting when an Office container is in use. This article covers what to check in the profile layer. How the audio and video offload works and how to troubleshoot calls are separate topics.

## Why the profile layer matters for new Teams

New Teams is installed as an MSIX package, and its user data sits under `C:\Users\<username>\AppData\Local\Packages\MSTeams_8wekyb3d8bbwe`. On a pooled [session host](/entity/avd-session-host/) a user can land on a different VM at every sign-in, so that data has to follow the user, or Teams starts from scratch each time. [FSLogix](/entity/fslogix/) is the tool Microsoft names for this. Learn's Teams for VDI page says Folder Redirection and Roaming User Profiles are not supported for Teams in VDI, because they cannot roam `AppData\Local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams`. It lists FSLogix, Citrix Profile Manager and Omnissa DEM as complementary tools.

The media offload itself, covered in the entry for [Teams media optimization](/entity/avd-teams-media-optimization/), is independent of the profile. Optimization is switched on per session host with the `IsWVDEnvironment` registry value under `HKLM\SOFTWARE\Microsoft\Teams`. The profile only decides whether sign-in state, settings and cache persist.

## FSLogix version requirements

Learn's two Teams pages give two different numbers, so state both in your design document:

| Source | Statement |
|---|---|
| Teams on AVD | If you use FSLogix for profile management and want new Teams, you need FSLogix 2210 hotfix 3 (2.9.8716.30241) or later |
| Teams for VDI, profile section | Microsoft recommends FSLogix 2210 hotfix 4 (2.9.8884.27471) "in order to guarantee proper integration with the Teams client in VDI" |
| Teams for VDI, Windows Server 2019 section | Teams on Windows Server 2019 needs 2210 hotfix 4 or higher (Microsoft recommends the latest available version); the same page lists Windows Server 2019 as no longer supported and says to plan upgrades |
| FSLogix release notes | "Customers are required to install and use the latest version" |

The FSLogix release notes explain why hotfix 4 matters. Under 2210 hotfix 4, published on 14 May 2024, they list a "comprehensive set of changes to support new Microsoft Teams in virtual desktop environments". Examples from the list:

- the launch errors "The parameter is incorrect" and "Invalid function";
- new Teams not registering on demand at sign-in when the ODFC container is used;
- Teams data in `%LocalAppData%\Publishers\8wekyb3d8bbwe\TeamsSharedConfig` now roaming with the ODFC container;
- MSIX folders under `%LocalAppData%\Packages\<package-name>\` being created automatically when an ODFC container is created.

The newest release in the notes is FSLogix 26.08, version 3.26.826.17182, published on 31 August 2026. Hotfix 4 is the Teams-specific recommendation; the release notes require the latest version, so plan on a current release rather than stopping at the hotfix.

## Profile container, ODFC container and IncludeTeams

FSLogix has two container types. Learn describes the Profile container as holding nearly all files and folders under the user's profile folder, minus exclusions. The Office Data File Container (ODFC) holds content unique to Office applications; its default content list covers Office activation, Outlook, SharePoint, OneDrive and legacy Skype for Business. Teams is not in that default list. See also the entities for the [profile container](/entity/fslogix-profile-container/) and the [Office container](/entity/fslogix-office-container/).

By default the Profile container holds both profile and ODFC content in one VHD(x) file, and Learn calls that the recommended configuration. The ODFC configuration page goes further: "If you've already configured a profile container, you don't need to configure an ODFC container", and "Using the ODFC container in a dual container configuration isn't necessary or recommended." It recommends single-container ODFC with third-party roaming profile solutions. If you still split them, Learn's Teams for VDI page says customers using Profile and ODFC, or ODFC only, must add the setting `IncludeTeams` so Teams user data and cache persist.

Learn's ODFC configuration page shows where. In Registry Editor, go to `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\FSLogix\ODFC` and add the DWORD `IncludeTeams` with value `1`, alongside `Enabled` = 1 and `VHDLocations` pointing to your SMB share, for example an Azure Files share. The page marks `IncludeTeams` as recommended, to keep Teams data in the container. Classic Teams data sits under `AppData\Local\Microsoft\Teams` and `AppData\Roaming\Microsoft\Teams`; new Teams uses `%LocalAppData%\Packages\MSTeams_8wekyb3d8bbwe\LocalCache`.

The ODFC page's verification step is useful for a pilot: sign in as a standard user, run `frx list-redirects` from `C:\Program Files\FSLogix\Apps`, then check the `VHDLocations` path in File Explorer for the user's profile and ODFC VHDX files. Two cautions about that page's PowerShell sample. It uses `HKLM:\SOFTWARE\FSLogix\ODFC\`, while the registry steps use the `Policies` path. And it does not set `IncludeTeams` at all: its list covers `Enabled`, `FlipFlopProfileDirectoryName`, `LockedRetryCount`, `LockedRetryInterval`, `ReAttachIntervalSeconds`, `ReAttachRetryCount`, `SizeInMBs`, `VHDLocations` and `VolumeType`. If you script the setup, add the value yourself for the path you use:

```powershell
New-ItemProperty -Path HKLM:\SOFTWARE\FSLogix\ODFC\ -Name IncludeTeams -PropertyType dword -Value 1 -Force
```

Our advice, not a Learn statement: use one registry location consistently and confirm with `frx list-redirects`.

## What must roam and what you can leave out

Learn's Teams for VDI page lists what to persist:

- `C:\Users\<username>\AppData\Local\Packages\MSTeams_8wekyb3d8bbwe\`, including `Settings\settings.dat`;
- `AppData\Local\Publishers\8wekyb3d8bbwe\TeamsSharedConfig\app_switcher_settings.json` and `tma_settings.json`.

Inside the package folder, the subfolders `AC`, `AppData`, `LocalCache`, `LocalState`, `RoamingState`, `Settings`, `SystemAppData` and `TempState` must exist as real directories, not files or reparse points. Do not persist the `meeting-addin` folder under `TeamsSharedConfig`, which can cause problems with default meeting coordinates in Outlook meeting templates.

One conflict matters before you design exclusions. The Teams page says the folders under `MSTeams_8wekyb3d8bbwe`, including `LocalCache`, must roam with the profile. FSLogix's container types page lists `AppData\Local\Packages\*\LocalCache` under nonroamable MSIX application data that is deleted from the container at sign-out. The AppX troubleshooting page lists it under nonroamable folders and says "The contents of these folders are deleted at sign out regardless of any redirections.xml configuration." The AppX page also says hotfix 4 or later provides "special handling for new Teams", and the 25.02 release notes say LocalCache and TempState folders for MSIX packages are cleaned up during sign-out. Learn does not reconcile these statements. Test it: sign in, use Teams, sign out, sign in on another session host, and check what persisted.

For non-persistent setups where storage footprint matters, the Teams page splits exclusions into two groups. Recommended for exclusion:

| Exclusion | Effect named by Learn |
|---|---|
| `LocalCache\Microsoft\MSTeams\Logs` and `PerfLog` | No impact |
| `EBWebView\WV2Profile_tfw\GPUCache` | No impact |
| `EBWebView\WV2Profile_tfw\WebStorage` | Slower reloads of SharePoint, OneDrive and Office apps |
| `AppData\Local\Packages\Microsoft.Windows.StartMenuExperienceHost_cw5n1h2txyewy\TempState` | No impact; recommended to solve a missing Teams icon in the Start menu (Windows Server 2019 also lists the ShellExperienceHost equivalent) |

Review as trade-offs, with evaluation and testing:

| Exclusion | Effect named by Learn |
|---|---|
| Service Worker `CacheStorage` and `Code Cache` | Slower launches, no offline access |
| `IndexedDB` | Significantly slower launches, higher network use, "We're setting things up for you" splash |
| `Cache` | Profile pictures are downloaded again |

Learn gives no disk sizes and says: "Other than the folders in this section, we don't recommend excluding additional directories." Start with the first group, measure container size and sign-in time, and treat the second group as a decision to test.

## Installing new Teams on the session host

The profile settings sit on top of a correct installation. From Learn:

1. Use the per-machine approach. For session hosts in a pooled host pool, Teams must be installed per machine.
2. Use bulk deployment with `teamsbootstrapper.exe -p`, which installs the latest client and provisions it for all users on the machine. For offline installs, `teamsbootstrapper.exe -p -o "c:\path\to\teams.msix"` uses a downloaded MSIX; use a full local path, because relative paths return error 0x80070057 and UNC paths can return 0x80070032.
3. In non-persistent VDI, set `disableAutoUpdate` (DWORD `1`) under `HKLM\SOFTWARE\Microsoft\Teams` if you do not want in-place updates. Only builds higher than 23306.3314.2555.9628 process the key, and with it set the MSIX installer does not install or upgrade the Teams Meeting add-in, so you must provision that separately. Learn's Teams for VDI page describes `teamsbootstrapper.exe -p --installTMA` for a machine-wide install.
4. Keep the host on a supported operating system: Windows 10.0.19041 or higher (not LTSC), and Windows Server 2022 or 2025. Windows Server 2016 and 2019 are listed as not supported for the Teams desktop app. The Teams on AVD page lists Windows 10 or 11 multi-session or Enterprise, and not the N or KN editions.
5. If you publish new Teams as a RemoteApp, use the path `shell:appsFolder\MSTeams_8wekyb3d8bbwe!MSTeams`.

Classic Teams is on a short timeline: end of support was 1 October 2026 and end of availability is 1 April 2027 for Windows endpoints with AVD, so profiles that still hold classic data should be planned for migration.

## Known FSLogix-related issues to test for

Learn's Teams for VDI page lists several items that touch the profile layer:

- **On-demand registration at first sign-in.** Teams does not register on demand during FSLogix profile creation, even with hotfix 4, because of a race condition between PLM and AppxSvc (error 0x80004001). Learn says customers who hit it must deploy KB5043067 (Windows 11 21H2), KB5042881 (Windows Server 2022) or KB5043050 (Windows Server 2019); for Windows 10 it is addressed with KB5037849, and it is not present on Windows 11 22H2 or higher. Test a brand-new user, not only existing profiles.
- **Autostart in non-persistent VDI.** The `TeamsTfwStartupTask` setting must roam, and the page says an FSLogix ODFC container does not roam it. Another profile tool is needed if you want autostart preserved.
- **Citrix drivers.** "The parameter is incorrect" at launch can be caused by the Citrix drivers UPMAction and upmjit, which `fltmc` lists; they come from `profilemgt_x64.msi`, and Learn says removing that MSI can fix the error even with hotfix 4. Citrix recommends Citrix Profile Manager 2402 or 2203 CU5.
- **Sysprepped images.** A greyed-out Teams icon (error 0x80073CF1) can occur and is not seen on Windows 11 22H2 or higher; Learn lists KB5039299 (Windows 10), KB5040437 (Windows Server 2022) and KB5040431 (Windows 11 21H2).

## A short checklist for the pilot

1. Record the FSLogix version on the image and compare it with the two Learn minimums above.
2. Prefer one container, as Learn recommends. With two, add `IncludeTeams` and confirm it with `frx list-redirects`.
3. Install Teams per machine with the bootstrapper and set `IsWVDEnvironment` to `1`; the Teams on AVD page lists the further media optimization components.
4. Sign in a new user and an existing user on two different session hosts, and check that settings and sign-in state follow them.
5. Compare container size and sign-in time with and without the exclusions from the tables, and check what survives sign-out given the LocalCache conflict above.
6. Remove or migrate any Folder Redirection or Roaming User Profiles setting that still covers the Teams package folder.

## Sources

- [Microsoft Learn: Use Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd)
- [Microsoft Learn: Microsoft Teams for Virtualized Desktop Infrastructure (VDI)](https://learn.microsoft.com/en-us/microsoftteams/teams-client-vdi-requirements-deploy)
- [Microsoft Learn: Configure ODFC containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-odfc-containers)
- [Microsoft Learn: Types of containers (FSLogix)](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: Issues with AppX, MSIX, or Microsoft store applications (FSLogix)](https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues)
- [Microsoft Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
