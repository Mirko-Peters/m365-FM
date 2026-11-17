---
title: "Rolling out Windows App to users: settings and tips"
summary: "To roll out Windows App on Windows PCs, install it from the Microsoft Store or as a standalone MSIX, then set the five Windows App policies in the Intune settings catalog or the Group Policy template. This guide covers the install options, the policies, updates and release rings, and the move away from the old Remote Desktop client."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-app, azure-virtual-desktop]
keypoints:
  - "Learn lists two ways to get Windows App onto a Windows PC: the Microsoft Store, or a standalone .msix installer. Intune can deploy it as a Microsoft Store app (new), and device groups install it before the user signs in."
  - "Five Windows App policies exist in the Intune settings catalog and in the windowsapp.admx template: release ring, desktop shortcuts for RemoteApps, auto logoff after inactivity, skip first run experience, and turn off automatic updates. They are device-scoped."
  - "Store installs cannot have automatic updates disabled; standalone MSIX installs can. Learn does not recommend disabling updates and says Microsoft can block outdated clients."
  - "Redirection cannot be configured in Windows App on Windows. The administrator sets it for the session, and Learn lists clipboard, drive and printer redirection as disabled by default."
  - "The Remote Desktop client (MSI) reached end of support on March 27, 2026 for public cloud customers, so plan to uninstall it after users have moved."
faq:
  - q: "How do I install Windows App on managed Windows PCs?"
    a: "Learn's install page for Intune uses an app of type Microsoft Store app (new): in the Intune admin center go to Apps, All apps, Add, search for Windows app, and assign it. Required assignments go to device groups and install before the user signs in. Where the Store is not reachable, Learn describes a standalone .msix installer and a winget-based offline route."
  - q: "Can I stop Windows App from updating itself?"
    a: "Only for standalone MSIX installs. Learn says apps installed from the Microsoft Store cannot have automatic updates disabled and follow the Store update settings. For MSIX installs the DisableAutomaticUpdates registry value or the matching policy controls it, but Learn does not recommend disabling updates because they contain security fixes."
  - q: "Does the auto logoff policy end the user's remote session?"
    a: "No. Learn says it signs the user out of Windows App only and does not affect active Azure Virtual Desktop or Windows 365 sessions. It does remove cached sign-in data, RDP files and other app data, and it erases local logs, so use it for shared devices and kiosks and not as a security control."
---

Roll out [Windows App](/entity/windows-app/) to Windows PCs by installing it from the Microsoft Store (or as a standalone MSIX), then setting its five policies in the Intune settings catalog or the Group Policy template. Plan for update sources, locked settings and the retirement of the old Remote Desktop client.

This article covers Windows PCs; the sibling article on connecting from Mac, iOS and Android covers the other platforms.

## What to decide before the first install

| Decision | What Learn says |
|---|---|
| Supported systems | Windows 11, Windows 10 version 1809 and later (including LTSC and IoT Enterprise), Windows Server 2019 or later. Windows 10 devices out of mainstream support need Extended Security Updates enrollment. |
| Install source | Microsoft Store, or a standalone `.msix` installer (64-bit, 32-bit and Arm64 downloads are linked from What's new). |
| Accounts | A work or school account. Personal Microsoft accounts are not supported. |
| Network | Devices need the end-user endpoints for [Azure Virtual Desktop](/entity/azure-virtual-desktop/), including `*.cdn.office.net` for automatic updates. Learn says blocking them is not supported. |
| Remote Desktop Services | Windows App on Windows does not yet support it; Learn says to keep using the Remote Desktop app for those connections. |

The endpoint list also contains `login.microsoftonline.com`, `windows.cloud.microsoft` and UDP 3478 to `51.5.0.0/16` for relayed RDP connectivity. Hand the full table on the required FQDNs page to the network team.

## Step-by-step: a managed rollout with Intune

1. **Confirm the OS and network.** Check the table above and test the endpoints from a pilot PC on the corporate network.
2. **Create the app.** In the [Microsoft Intune](/entity/intune/) admin center go to **Apps** > **All apps** > **Add**. Set **App type** to **Microsoft Store app (new)**, search for **Windows app**, select it and keep the defaults on the **App information** page.
3. **Assign it.** Under **Required**, add device groups so the app installs automatically. Under **Available for enrolled devices**, add user groups if users should install it from the Company Portal. Learn notes that a user-group assignment on a Cloud PC installs only after the user has signed in, while a device-group assignment installs before sign-in.
4. **Create the settings policy.** Go to **Devices** > **Configuration** > **Create** > **New policy**, set **Platform** to **Windows 10 and later** and **Profile type** to **Settings catalog**. On **Configuration settings** select **Add settings**, search for **Windows App**, and pick the settings from the next section. Assign the policy to the same device groups.
5. **Verify.** Open the policy under **Devices** > **Configuration** and review the **Device status**, **User status** and **Per-setting status** reports.
6. **Pilot, then widen.** Start with a small ring; update behavior is covered below.

Blocking the Store is an optional step on the same Learn page: a settings catalog policy with **Microsoft App Store** > **Require Private Store Only**. Our reading, not a Learn statement: because Store-installed apps follow Store update settings, check that this does not also stop Windows App updates on those devices.

Domain-joined PCs without Intune can use Group Policy instead. Download the template from `https://aka.ms/avdgpo`, extract the `.cab` and `.zip`, and copy `windowsapp.admx` and `en-US\windowsapp.adml` to `C:\Windows\PolicyDefinitions\` or to your Central Store. The settings then appear under **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows App**. Learn lists membership in **Domain Admins** as a prerequisite for this step.

## The five Windows App policies

Intune added these settings to the Windows settings catalog in service release 2607 (week of July 27, 2026). Learn describes them as device-scoped, so they apply no matter who signs in, and says that if both a policy and a legacy registry value exist, Windows App uses the policy.

| Setting | Values | What to know |
|---|---|---|
| Admin Release Ring Policy | Public (0), Insider (3), Not configured | When set, users cannot change the ring in the app. |
| Automatically create Windows App shortcuts to desktop | Enabled (1), Disabled (0) | Creates desktop shortcuts for RemoteApps that are configured for shortcut creation in Azure Virtual Desktop. Shortcuts appear after sign-in and resource discovery. A shortcut the admin manages can no longer be pinned or unpinned by the user. |
| Automatically log off users after inactive interval | Enabled (1), Disabled (0), plus Inactivity timeout (minutes), minimum 1 | For shared devices and kiosks. Signs the user out of Windows App only. |
| Skip First Run Experience (FRE) | Enabled (1), Disabled (0) | Users go straight to the Connection Center. |
| Turn off automatic updates for Windows App | 0 to 3, see below | Restricts update sources. |

The shortcut policy has two halves: [RemoteApp](/entity/avd-remoteapp/) resources must be enabled for shortcut creation on the Azure Virtual Desktop side, and the device must receive the policy. Learn's device actions page says shortcuts appear after the user signs in to Windows App again or refreshes it.

### Auto logoff in practice

Learn's auto logoff page gives behavior that matters before you use it on a shared PC:

- It removes all credentials, RDP files and other identifiable data from the app caches on the device, not just for the current user, and it erases local logs. Logging resumes only when the app reopens, which limits troubleshooting.
- Windows App checks OS inactivity every N minutes. With N = 5 the logoff can take up to 9 minutes 59 seconds, or up to twice the interval.
- Closing Windows App by hand triggers the logoff immediately.
- It is intended for connections from the Windows App connection center. It is not supported for Windows 365 Boot, Windows 365 Switch or connections pinned to the taskbar, and Learn says it is for operational convenience and data hygiene, not a security control. See [Windows 365 Boot](/entity/windows-365-boot/) for that scenario.

Legacy registry equivalents sit under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsApp` (`AutoLogoffEnable`, `AutoLogoffOnSuccessfulConnect`, `AutoLogoffTimeInterval`, REG_DWORD). The skip-FRE value `SkipFRE` is documented under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows365`. For managed devices Learn recommends the settings catalog over editing the registry.

## Updates and release rings

Learn's [update configuration page](https://learn.microsoft.com/en-us/windows-app/configure-updates-windows) separates the two install sources:

| Install source | Update delivery | Background check | Install timing |
|---|---|---|---|
| Microsoft Store | Store, non-disruptive | Every 8 hours | Only when Windows App is closed |
| Standalone MSIX | CDN by default; users can also update from the Store | Every 8 hours | Only when Windows App is closed |

Store installs cannot have automatic updates disabled. Standalone installs can, through the `DisableAutomaticUpdates` registry value (0 enables updates, 1 disables all, 2 disables Store updates only, 3 disables CDN updates only) or the matching policy. Learn does not recommend disabling updates, because they include security fixes, and says Microsoft reserves the right to block outdated clients. Two version notes from the What's new page: policy handling of `DisableAutomaticUpdates` was fixed in version 2.0.1246.0, and the skip-first-run policy not always applying was fixed in 2.0.1373.0. Check that pilot devices run at least those builds before you judge the policies.

On the Windows tab of What's new, the public ring was at version 2.0.1484.0 (October 13, 2026), with rollouts phased over two weeks, and the same page lists 2.0.1484.0 as the minimum supported version. That makes a policy that freezes updates a decision with a deadline.

The **Insider** ring is an early look at the next public release, typically about two weeks ahead. Users can opt in in the Windows App settings panel unless you set the ring by policy (`AdminReleaseRing`, 0 for Public and 3 for Insider). Insider updates do not arrive if CDN updates are blocked.

### Installing without the Store

Learn's troubleshooting page covers devices with the Store disabled, offline devices and Windows 10 Enterprise LTSC 2019. On a machine with internet and WinGet, `winget download --id 9N1F85V9T8BN` fetches the package and its dependencies. Install the dependencies first with `Add-AppxPackage`: `Microsoft.VCLibs.140.00` and `Microsoft.VCLibs.140.00.UWPDesktop` at 14.0.30035.0 or later, and `Microsoft.WindowsAppRuntime.2` at 2.1.3.0 or later. Then install the `.msix` itself. Learn says the runtime version can change in future releases, so check the page again before each wave. The Windows App Runtime requirement moved to 2.1.3 in version 2.0.1314.0 (August 4, 2026).

## What users see, and what you cannot set

On a managed Windows device where the user is signed in with a work or school account, Learn says they are signed in to Windows App automatically. The **Devices** and **Apps** tabs appear only if resources of that type are assigned, so an empty window usually points to a missing assignment, not a client fault.

Two things surprise admins:

- **Redirection is not set in the client.** Learn says you cannot configure redirection settings in Windows App on Windows. The administrator decides which devices, clipboard and drives are available, and the more restrictive setting wins. The same page lists clipboard, drive and printer redirection as disabled by default.
- **Display settings are per device, per user.** A user opens **Devices**, selects **...** on the device card, then **Settings**, and turns **Use default settings** off. Options are **All displays**, **Single display** or **Select displays** (selected displays must be next to each other). Custom display settings are available for devices, not for apps. For Cloud PCs, Learn's Windows 365 What's new lists default display settings chosen by the admin as a preview feature (week of July 27, 2026).

The device actions on the card depend on the service. For example, **Inspect connection** and **Restore** apply to Windows 365 Enterprise and Windows 365 Flex (Dedicated), which [Learn renamed from Windows 365 Frontline](/entity/windows-365-frontline/) in the week of May 4, 2026; the product, licensing and capabilities are unchanged. Azure Virtual Desktop users get **Pin to** and **Settings**, but not the Cloud PC actions.

## Retire the old client

The Remote Desktop client for Windows (MSI) and the Remote Desktop web client ended support on March 27, 2026 for public cloud customers. Learn lists an extension to September 28, 2026 for the MSI in Azure Government, Azure operated by 21Vianet and AVD Classic, which has now passed. The Remote Desktop app from the Microsoft Store reached end of support in September 2025 and is no longer available for download. Learn also says that an external identity in the Azure cloud must use Windows App.

The Windows IT Pro blog post on the transition recommends reviewing the Windows App documentation, identifying the clients in use, and uninstalling the old client after users have moved. Remote Desktop Connection (mstsc) remains a supported application. A practical order:

1. Inventory devices that still have the MSI client.
2. Deploy Windows App and the policies to a pilot ring.
3. Confirm the resources users rely on appear under **Devices** or **Apps**.
4. Remove the old client from each ring after its users have moved.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Windows App overview](https://learn.microsoft.com/en-us/windows-app/overview)
- [Microsoft Learn: Connect to Windows devices and apps with Windows App](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: What's new in Windows App (Windows tab)](https://learn.microsoft.com/en-us/windows-app/whats-new?tabs=windows)
- [Microsoft Learn: Configure Windows App updates on Windows](https://learn.microsoft.com/en-us/windows-app/configure-updates-windows)
- [Microsoft Learn: Configure Windows App settings using Microsoft Intune or Group Policy](https://learn.microsoft.com/en-us/windows-app/configure-windows-app-settings-intune-gpo)
- [Microsoft Learn: Configure auto logoff for Windows App](https://learn.microsoft.com/en-us/windows-app/windowsautologoff)
- [Microsoft Learn: Windows App device actions](https://learn.microsoft.com/en-us/windows-app/device-actions)
- [Microsoft Learn: Windows App display settings](https://learn.microsoft.com/en-us/windows-app/display-settings)
- [Microsoft Learn: Redirect local devices, audio, and folders in Windows App](https://learn.microsoft.com/en-us/windows-app/device-audio-folder-redirection-teams?tabs=windows)
- [Microsoft Learn: Basic troubleshooting for Windows App](https://learn.microsoft.com/en-us/windows-app/troubleshoot-basic?tabs=windows)
- [Microsoft Learn: Install Windows App on physical devices with Intune](https://learn.microsoft.com/en-us/windows-365/enterprise/install-windows-365-app-intune)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint?tabs=azure#end-user-devices)
- [Microsoft Learn: Use the administrative template for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/administrative-template)
- [Microsoft Learn: Connect to Azure Virtual Desktop with the Remote Desktop client for Windows (MSI)](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-windows?pivots=remote-desktop-msi)
- [Microsoft Learn: What's new in Microsoft Intune](https://learn.microsoft.com/en-us/intune/whats-new/)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Tech Community (Windows IT Pro Blog): Remote Desktop client for Windows retirement and Windows App transition](https://techcommunity.microsoft.com/blog/windows-itpro-blog/-/4397724)
