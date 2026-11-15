---
title: "Configure the OneDrive Sync Client With Group Policy: ADMX Setup and Key Policies"
summary: "Configure the OneDrive sync app with Group Policy: where the ADMX and ADML files are, how to copy them to the Central Store, six key policies with scope and registry names, limits for silent known folder move and the registry behavior of Not configured."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [onedrive, onedrive-sync-engine]
keypoints:
  - "Install the OneDrive sync app first. The adm folder of the build holds the ADMX and ADML files, and you copy them to the Central Store or the local PolicyDefinitions folder."
  - "Policies write registry keys under HKLM or HKCU SOFTWARE Policies Microsoft OneDrive. Setting a policy back to Not configured does not change the key, so use Enabled or Disabled."
  - "Silent known folder move needs the tenant ID. Learn recommends limiting deployment on existing devices to 1,000 devices a day and 4,000 a week."
  - "Use OneDrive Files On-Demand requires Windows 10 Fall Creators Update version 1709 or later. Microsoft recommends keeping it enabled."
  - "The default for the automatic download size threshold is 500 MB. Users above it choose folders before download."
faq:
  - q: "Where do I find the ADMX files?"
    a: "According to Microsoft Learn, install the OneDrive sync app, which downloads the files. They are in the adm folder of the build, for example under %localappdata%\\Microsoft\\OneDrive\\<BuildNumber>\\adm for a per-user install. The build number is on the About tab in the sync app settings."
  - q: "Where do I copy them?"
    a: "Copy the ADMX file to the Central Store at \\\\<domain>\\sysvol\\<domain>\\Policies\\PolicyDefinitions and the ADML file to the language subfolder such as en-us. If no Central Store exists, create one or use the local store at %windir%\\policydefinitions."
  - q: "Why did setting a policy to Not configured not undo it?"
    a: "Learn says setting a policy back to Not configured does not modify the registry key, so the change does not take effect. After you configure a setting, set it to Enabled or Disabled."
  - q: "What do I need for silent known folder move?"
    a: "The tenant ID. If none of the folder policies is set, all three folders, Desktop, Documents and Pictures, move. The page recommends limiting existing-device deployment to 1,000 devices a day and 4,000 a week."
  - q: "What is the default download size threshold?"
    a: "500 MB for the policy that sets the maximum size of a user's OneDrive that can download automatically. Users above the threshold choose folders before download."
---

Group Policy is the usual way to configure the OneDrive sync app across a domain. You install the sync app to get the ADMX files, copy them to your policy store and then configure the settings. This guide follows the Microsoft Learn article on using OneDrive policies to control sync settings.

## Get and install the policy files

1. Install the OneDrive sync app for Windows. Installing it downloads the ADML and ADMX files into the `adm` folder of the build.
   - Per-user install: `%localappdata%\Microsoft\OneDrive\<BuildNumber>\adm\`
   - Per-machine install: under `%ProgramFiles(x86)%` or `%ProgramFiles%`, in `Microsoft OneDrive\<BuildNumber>\adm\`, depending on OS architecture.
   - The build number is on the **About** tab in the sync app settings.
2. Copy the ADMX file to `\\<domain>\sysvol\<domain>\Policies\PolicyDefinitions` and the ADML file to the language subfolder such as `en-us`. If the folder does not exist, create the Central Store as described in the Microsoft support article the page names, or use the local store at `%windir%\policydefinitions`.
3. Configure the settings from a domain controller or a Windows computer with Remote Server Administration Tools, and link the GPO to a site, domain or OU. Use security filtering to narrow the scope.

## Registry behavior

The policies write registry keys under `HKLM\SOFTWARE\Policies\Microsoft\OneDrive` for computer settings or `HKCU\SOFTWARE\Policies\Microsoft\OneDrive` for user settings. Setting a policy back to **Not configured** does not modify the key, so the change does not take effect. After you configure a setting, set it to **Enabled** or **Disabled**.

## Six key computer policies

| Policy | Notes from the page |
| --- | --- |
| Silently sign in users to the OneDrive sync app with their Windows credentials | Works for computers joined to Microsoft Entra ID. Registry value `SilentAccountConfig`. |
| Silently move Windows known folders to OneDrive | Needs the tenant ID. If no folder policy is set, Desktop, Documents and Pictures all move. Recommended limit for existing devices is 1,000 devices a day and 4,000 a week. The user policy **Prohibit User from manually redirecting Profile Folders** must be Disabled or Not configured. |
| Prevent users from moving Windows known folders to OneDrive | Does not take effect if Prompt or Silently move is enabled. Registry value `KFMBlockOptIn`, and the page says setting it to 2 redirects folders back to the PC. |
| Set the maximum size of a user's OneDrive that can download automatically | Used with silent sign-in on devices without Files On-Demand. Default is 500 MB, range 0 to 4294967295 MB. |
| Use OneDrive Files On-Demand | Needs Windows 10 Fall Creators Update (1709) or later. Microsoft recommends keeping it enabled. Registry value `FilesOnDemandEnabled`. |
| Prompt users to move Windows known folders to OneDrive | Needs the tenant ID. Users who close the window get a reminder in the Activity Center until all known folders move. |

The page marks all six as applying to Group Policy and Intune.

## Other policies named on the page

Computer policies include allowing or blocking syncing for specific organizations, excluding file types, limiting the upload rate, requiring confirmation of large deletes, setting the sync app update ring and warning users who are low on disk space. User policies include continuing to sync on metered networks, limiting download and upload speed, preventing users from changing the OneDrive folder location, preventing personal OneDrive sync and starting OneDrive automatically at sign-in. The page lists about 55 policies in its string ID index.

## A rollout order

This order is a suggestion built from the page, not a Microsoft procedure.

1. Install the sync app on a test machine and copy the ADMX and ADML files to the store.
2. Enable silent sign-in and Files On-Demand first, because they are low risk.
3. Plan known folder move separately, with the tenant ID and the per-day device limits.
4. Link policies to a pilot OU before the domain.

## A note on the registry example

The page's example for the download threshold uses a value written as `dword:0005000` for 5000 MB. Registry DWORD values in this syntax are hexadecimal, so verify the value before deploying.

## Not covered

The page does not cover Intune configuration, which it links separately, full detail on each policy, known folder move planning, silent account configuration troubleshooting, bandwidth planning, tenant ID lookup, creating the Central Store or sync app deployment methods beyond the file location.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)

## Sources

- [IT Admins - Use OneDrive policies to control sync settings (Microsoft Learn)](https://learn.microsoft.com/sharepoint/use-group-policy)
