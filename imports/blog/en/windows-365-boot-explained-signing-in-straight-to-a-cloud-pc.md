---
title: "Windows 365 Boot explained: signing in straight to a Cloud PC"
summary: "Windows 365 Boot configures a Windows 11 physical device so that the user signs in to the Cloud PC instead of the local desktop. It comes in a dedicated mode for one user and a shared mode for several users, and Intune policy does the configuring."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365-boot, windows-365]
keypoints:
  - "Windows 365 Boot is a setup for Windows 11 physical devices: after the user signs in at the device sign-in screen, the device connects straight to their Cloud PC. With single sign-on turned on for the Cloud PC, they do not sign in again."
  - "Dedicated mode assigns the device to one user. Shared mode lets several users each sign in to their own Cloud PC, and signing out returns the device to the Windows 11 sign-in screen. Windows Hello for Business is supported in dedicated mode only."
  - "Learn's What's new lists Boot as preview from May 2023 and generally available from the week of September 25, 2023, with shared and dedicated modes generally available in the week of February 26, 2024. The Boot overview page itself carries no status label."
  - "The Boot setting applies a bundle of device policies, but Learn's pages differ on how much it restricts the local device, so check a pilot device. A return-to-physical-PC option can be offered on the Ctrl+Alt+Del and error screens."
  - "Windows 365 Boot, Windows 365 Link and Windows App are different ways to reach a Cloud PC. Boot reuses existing Windows 11 hardware and keeps the local OS present, which Link does not."
faq:
  - q: "Is Windows 365 Boot generally available?"
    a: "Yes, according to Learn's What's new page for Windows 365. It records Boot as preview in the week of May 22, 2023 and as generally available in the week of September 25, 2023, not available for Windows 365 Government at that time. Shared and dedicated device modes moved out of preview in the week of February 26, 2024. The Boot overview page does not carry a status label of its own."
  - q: "Does the user sign in twice?"
    a: "Not when single sign-on is turned on for the Cloud PC. Learn's overview says that with single sign-on turned on the user does not have to sign in again to the Cloud PC after signing in to the physical device. Learn's overview does not describe the sign-in without it, so check that case in a pilot. Single sign-on is a provisioning policy setting (Use Microsoft Entra single sign-on) described on Learn's Windows 365 single sign-on page."
  - q: "Can users get back to the local Windows desktop?"
    a: "Only if you allow it. Learn's restriction page says Boot does not automatically set the policies that fully restrict access to the physical device, and describes two user policies, one for the Ctrl+Alt+Del screen and one for error screens, that show a Return to physical PC sign in button. The default for both is that no access is offered. Learn says the primary intention is that users cannot sign in to the physical PC."
---

Windows 365 Boot lets an administrator configure a Windows 11 physical device so that the user signs in directly to their Windows 365 Cloud PC and skips the local desktop. It is a device setup driven by Intune, not a new type of Cloud PC. This article explains how it behaves, what the two modes mean and where it sits among the ways to reach a Cloud PC. Planning and setup steps are in the rollout article that follows in this series.

## What happens at sign-in

Learn's overview says Windows 365 Boot lets admins configure Windows 11 physical devices so that users can avoid signing in to the physical device and sign in directly to their [Windows 365](/entity/windows-365/) Cloud PC. If single sign-on is turned on for the Cloud PC, the user does not have to sign in to the Cloud PC again.

At the core of Boot is one device setting. In the Intune Settings Catalog it is **Boot To Cloud PC Enhanced**, which Learn's guided scenario page says to find by searching for **Cloud Desktop**. It maps to the CloudDesktop CSP node `BootToCloudPCEnhanced` with the values 0 (not configured, the default), 1 (**Enable Boot to Cloud Shared PC Mode**) and 2 (**Enable Boot to Cloud Dedicated Mode (Cloud only)**). The CSP page says that enabling it applies multiple policies, among them `CloudDesktop/BootToCloudMode` = 1 and `WindowsLogon/OverrideShellProgram` = 1 (Apply Lightweight Shell), and advises not setting those enforced policies to different values. A cloud provider application must be installed (the policy page's example is Win365), and the guide's manual steps install the Windows App in System context.

`BootToCloudMode` has its own policy node: it is device-scoped with the values 0 and 1, and its description says `OverrideShellProgram` must be configured as well. `SetMaxConnectionTimeout` is a separate, optional setting (5 to 20 minutes, default 5) for how long the device waits for the connection after sign-in.

The versions differ by page. The `BootToCloudPCEnhanced` node lists 22H2 with KB5035942 (10.0.22621.3374) and later, and Learn's device requirements page asks for build 22621.3374 or later on each physical device and Cloud PC, running Windows 11 Enterprise, Windows 11 Professional or Windows IoT Enterprise. The restriction page says the return-to-physical-PC policies need Windows 11 23H2 (build 22621.4249, as Learn writes it) or later. The CloudDesktop CSP page, however, lists the two user nodes for those policies under Windows Insider Preview and notes that some of its settings apply to Insider Preview builds only, so test this option on a pilot device.

## Two modes

| | Dedicated mode | Shared mode |
|---|---|---|
| Who uses the device | One assigned user | Several users, each signing in to their own Cloud PC |
| Typical case | One person, one device; CSP page: keeps profile picture and username on the device and supports fast account switching | Nursing, sales and call center staff who share company devices |
| After sign-out | Not described on the overview page | Device returns to the Windows 11 sign-in screen for the next user |
| Settings Catalog value | Enable Boot to Cloud Dedicated Mode (Cloud only) | Enable Boot to Cloud Shared PC Mode |
| Windows Hello for Business | Supported | Not supported |

Learn's authentication table for the Boot overview reads as follows.

| Sign-in method | Dedicated | Shared |
|---|---|---|
| Username and password | Yes | Yes |
| Windows Hello for Business | Yes | No |
| FIDO key | Yes | Yes |
| Convenience PIN | No | No |

The Windows App comparison page for Windows 365 connection methods lists more methods for Boot with single sign-on enabled, including Microsoft Authenticator and smart card, without separating the modes. The two pages are not identical, so confirm the methods you need in a pilot before promising them. The CSP page describes dedicated sign-in through methods such as PIN and biometrics, while the overview lists Convenience PIN as No. The restriction page calls Boot designed for shared PC mode, which requires username and password, while the overview also lists FIDO keys for shared mode. The CSP page and the guided scenario do not explain the "(Cloud only)" suffix of the dedicated value, and the comparison in the section below marks Boot as working with Entra hybrid joined devices, so check your join type in a pilot.

In shared mode, Learn's guided scenario page says the Cloud Desktop configuration applies the required SharedPC CSP settings, such as fast user switching and account cleanup, so a separate shared multi-user device profile is not needed.

## Status and history

Learn's What's new page for Windows 365 gives the timeline:

- Week of May 22, 2023: Windows 365 Boot announced as preview.
- Week of September 25, 2023: Boot generally available. At that point it was not available for Windows 365 Government; that followed in the week of December 4, 2023 for US Government Community Cloud customers.
- Week of January 8, 2024: shared and dedicated modes, sign-in page customization, fail-fast notifications and local PC settings management announced as preview.
- Week of February 26, 2024: those four moved to general availability.
- Week of March 26, 2024: shared mode announced as supporting FIDO.
- Week of March 31, 2025: users can switch back to the physical device desktop from the Ctrl+Alt+Del and error screens.
- Week of September 15, 2025: latest Boot updates rolling out to general availability with a streamlined connection experience, and cross-region disaster recovery support.
- Week of March 9, 2026: captive portal support.

Learn's overview, guided scenario and device requirements pages do not label Boot as preview or generally available. The overview and device requirements pages do not state which Cloud PC types Boot supports. The guided scenario page states that a Windows 365 Enterprise license is required to create Boot provisioning policies, and a Tech Community article from July 2026 describes a call center proof of concept with Windows 365 Flex Dedicated Cloud PCs. Windows 365 Flex is the name Windows 365 Frontline has carried since the week of May 4, 2026, with product, licensing and capabilities unchanged. If you plan Boot with Flex, ask Microsoft or test it, because the Learn Boot pages do not settle it.

## What the user sees

Several behaviors come from Learn's overview page:

- **More than one Cloud PC.** With several Cloud PCs and no default, the user sees the Connection Center at sign-in. Selecting **Connect automatically** sets a default. To change it later, use the web client: on the Cloud PC card select the ellipsis (**...**) > **Settings** > **Integrated experiences** tab, and under **Boot to this Cloud PC** choose **Connect while signed in to device**.
- **Hotkeys.** Ctrl + Windows key + Up Arrow opens the Connection Center, and Ctrl + Windows key + Down Arrow shows connection details.
- **Local hardware.** Bluetooth devices are paired through **Quick Settings** > **Bluetooth** in the Cloud PC session, and the taskbar shows the local PC's battery status.
- **Captive portals.** When a captive portal is detected, sign-in asks the user to complete network authentication before continuing. The user must have connected once to a network that is not a captive portal before relying on this.
- **Branding.** If no company name is set, a Tech Community article says the sign-in screen shows "Cloud PC"; the guided scenario offers company name, logo URL and lock screen image URL.

## What Boot does not do

Boot changes where the user lands. Learn's pages differ on how much it restricts by itself.

Learn's restriction page (last dated May 2025) says Boot does not automatically set the policies that fully restrict access to the physical device and that administrators should review them. It lists `DisableTaskMgr`, `DisableChangePassword`, `DisableNotificationCenter` and `NoToastNotification`, and notes that blocking the physical drive from being redirected into the Cloud PC needs a Group Policy or Settings Catalog assignment. The CloudDesktop CSP page, dated October 2026, shows `BootToCloudPCEnhanced` setting several local policies itself. In both modes these include Remove Change Password, Turn off toast notifications, Remove Notifications and Action Center, Do not process the legacy run list and Turn off Windows Copilot. Shared mode also sets Remove Task Manager and turns off Windows Hello for Business, biometrics, convenience PIN and picture password sign-in. The restriction page and the CSP page do not reconcile this between them, so check the effective policies on a pilot device.

Two consequences are easy to miss. First, the local OS stays installed. Learn's guided scenario says the Cloud Desktop CSPs alone do not restrict what users can launch on the local desktop, and describes App Control for Business (called the recommended modern application control technology on Windows 11) or AppLocker as an optional extra layer if you enable the return option. Any allowlist must allow the Windows App, because blocking it stops the device from connecting to the Cloud PC. Second, without the return-to-physical-PC option, users have no local fallback if they cannot reach their Cloud PC, for example during an internet outage.

## Boot compared with Link and Windows App

Learn's comparison of Windows 365 connection methods on Windows covers three options. A Windows IT Pro Blog post also names Windows 365 Switch, which lets users move between the local desktop and the Cloud PC without rebooting.

| Question | Windows 365 Link | Windows 365 Boot | Windows App |
|---|---|---|---|
| Connect from the sign-in screen | Yes | Yes | No |
| Shared, multi-user devices | Yes | Yes | No (kiosk mode plus auto logoff is possible) |
| Reuse existing Windows 11 devices | No | Yes | Yes |
| Access local apps and browser | No | Yes, admin configurable | Yes |
| Purpose-built OS for Cloud PC connections | Yes | No | No |
| Entra hybrid joined local device | No | Yes | Yes |
| Self-deployment with Autopilot | No | Yes | Not applicable |

The blog post summarizes Boot as a fit for repurposed PCs, frontline workers, and shared or dedicated devices. In Learn's comparison table, [Windows 365 Link](/entity/windows-365-link/) is the purpose-built OS for Cloud PC connections, and [Windows App](/entity/windows-app/) runs on an existing device that is also used for other tasks.

## Boot and Windows 365 Reserve

Windows 365 Reserve provides temporary access to a Cloud PC, and Learn's What's new records Reserve as generally available since the week of November 17, 2025. A Windows IT Pro Blog post of February 2026 describes pairing the two: IT keeps Windows 11 devices preconfigured with Boot, and when a user's own device is lost, delayed or otherwise unavailable, assigns a Reserve license and hands over a Boot device so the user signs in straight to the Reserve Cloud PC. That post states Reserve gives up to 10 days of Cloud PC access per year and does not state a preview or general availability label for the combination.

## Where to go next

This article covers the concept. Requirements, the guided scenario steps, Autopilot registration and pilot design are in the rollout article. For problems after rollout, Learn's troubleshooting page lists registry values and minimum app versions to check (Windows App 2.0.285, Azure Virtual Desktop HostApp 1.2.4159) and the log folders to collect for Microsoft Support.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: What is Windows 365 Boot?](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-overview)
- [Microsoft Learn: Guided scenario, deploy Windows 365 Boot to physical devices](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-guide)
- [Microsoft Learn: Restrict user access to Windows 365 Boot physical devices](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-restrict-user-access-physical-device)
- [Microsoft Learn: Troubleshoot Windows 365 Boot](https://learn.microsoft.com/en-us/troubleshoot/windows-365/troubleshoot-windows-365-boot)
- [Microsoft Learn: Windows 365 Boot physical device requirements](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-physical-device-requirements)
- [Microsoft Learn: CloudDesktop CSP](https://learn.microsoft.com/en-us/windows/client-management/mdm/clouddesktop-csp)
- [Microsoft Learn: Policy CSP, CloudDesktop](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-clouddesktop)
- [Microsoft Learn: Compare Windows 365 connection methods on Windows](https://learn.microsoft.com/en-us/windows-app/compare-windows-365-connection-methods-on-windows)
- [Microsoft Learn: Configure single sign-on for Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/configure-single-sign-on)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Microsoft Tech Community: Windows 365 Boot (Core Infrastructure and Security Blog)](https://techcommunity.microsoft.com/blog/coreinfrastructureandsecurityblog/windows-365-boot/4533696)
- [Microsoft Tech Community (Windows IT Pro Blog): Windows 365, how to choose the connection method](https://techcommunity.microsoft.com/blog/windows-itpro-blog/windows-365-how-to-choose-the-best-connection-method-for-your-team/4463228)
- [Microsoft Tech Community (Windows IT Pro Blog): Extending Windows 365 Reserve with Windows 365 Boot](https://techcommunity.microsoft.com/blog/windows-itpro-blog/extending-windows-365-reserve-with-windows-365-boot/4491985)
