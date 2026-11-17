---
title: "Planning a Windows 365 Boot rollout"
summary: "A six-stage plan for rolling out Windows 365 Boot: prerequisites, mode, Intune configuration, decisions on local PC access, Autopilot device preparation and pilot rings. Stages 1 to 5 follow the Learn pages; the pilot rings in Stage 6 are our own example."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365-boot, windows-365]
keypoints:
  - "Every physical device and every Cloud PC must run Windows 11 Enterprise, Windows 11 Professional or Windows IoT Enterprise, version 22621.3374 or later, and Learn's troubleshooting page lists Windows App 2.0.285 and Azure Virtual Desktop (HostApp) 1.2.4159 or later. Learn's manual steps install only the Windows App. The guided scenario needs the Intune Service Administrator role, and each user needs a Windows 365 license and a provisioned Cloud PC."
  - "Learn calls the Intune guided scenario (Devices > Cloud PC Overview > Windows 365 Boot) the recommended way. It sets device naming, updates, VPN or Wi-Fi, language, security baseline, connection timeout, branding and group assignment. A manual Settings Catalog setup is documented for environments where the guided scenario is unavailable or does not complete, and it does not cover Autopilot profiles, enrollment status pages, update rings, Wi-Fi, VPN, language packs or baselines."
  - "Autopilot self-deploying mode needs TPM 2.0 with attestation, works for Microsoft Entra join only, and fails on virtual machines including Hyper-V virtual TPMs. The guided scenario creates a user-driven profile."
  - "Devices that are in the group and online start receiving the Boot policies automatically, so decide the Ctrl+Alt+Del and error-screen return option, task manager, password change, drive redirection and application control first. Learn's pages differ on how much Boot restricts by itself, so check a pilot device."
  - "Learn's recovery path for a misbehaving device is to check the default Cloud PC and registry values, confirm Windows App 2.0.285 or later, and remove and re-add the device in the Windows 365 Boot group. Intune can take up to 8 hours to remove the policies."
faq:
  - q: "Which role and licenses does a Windows 365 Boot rollout need?"
    a: "Learn's guided scenario page lists the Intune Service Administrator role, and says a Windows 365 Enterprise license is required to create Boot provisioning policies. For the manual setup, it says each user needs a Windows 365 license and a provisioned Cloud PC. The Boot overview and device requirements pages do not state which Cloud PC types are supported, so test Flex Cloud PCs in your pilot if you plan to use them."
  - q: "Can I use Autopilot self-deploying mode for Boot devices?"
    a: "Yes, as an optional step. The guided scenario creates a user-driven Autopilot profile, and Learn describes how to swap it for a self-deploying profile assigned to the same group. Autopilot's own page says self-deploying mode needs TPM 2.0 with attestation, is supported for Microsoft Entra join only, and fails on virtual machines. A Tech Community article adds that you cannot use Hyper-V VMs for it."
  - q: "How do I take a device out of Boot again?"
    a: "Remove the device from the Windows 365 Boot group in Intune (Groups > All groups > the group > Members), then go to Devices > All devices, select the device and choose Overview > Sync. Learn says Intune can take up to 8 hours to remove the policies. To re-add, add the device to the group, wait about 10 minutes and sync again."
---

Plan a Windows 365 Boot rollout in six stages: confirm the prerequisites, choose Dedicated or Shared mode, build the Intune configuration (guided scenario or Settings Catalog), decide how much of the local PC to expose, prepare and add devices through Windows Autopilot, and pilot with an exit path. Learn says devices that are in the group and online start receiving the policies automatically, so the decisions in Stage 4 come before the devices join. This article covers the stages for [Windows 365 Boot](/entity/windows-365-boot/); behavior, modes and history are in [the explainer before it in this series](/community/u/mirko-p/blog/windows-365-boot-explained-signing-in-straight-to-a-cloud-pc/).

## Stage 1: check the prerequisites

Learn's guided scenario, device requirements, restriction and troubleshooting pages give these conditions:

| Item | Requirement |
|---|---|
| Operating system | Windows 11 Enterprise, Professional or IoT Enterprise, version 22621.3374 or later, on the physical device and the Cloud PC |
| Intune role | Intune Service Administrator for the guided scenario and for adding devices |
| Licensing | A Windows 365 Enterprise license to create Boot provisioning policies; each user needs a Windows 365 license and a provisioned Cloud PC |
| Windows App | Windows App 2.0.285 or later and Azure Virtual Desktop (HostApp) 1.2.4159 or later, on the latest Windows 11 (troubleshooting page) |
| Return option | Windows 11 23H2 (build 22621.4249) or later for the two return-to-physical-PC user policies (guided scenario and restriction pages) |

Two caveats. Learn's manual steps (Stage 3, Option B) deploy only the Windows App. The guided scenario's example resource name, Windows 365 Boot Azure Virtual Desktop (HostApp), suggests it also creates a HostApp resource (our reading), but Learn does not describe it or say how the HostApp reaches a device in the manual setup, so check the version on a pilot device. And the CloudDesktop CSP page lists the two return-option user nodes under Windows Insider Preview, so confirm on your build that the return buttons appear.

Single sign-on is a setting on the [Windows 365](/entity/windows-365/) provisioning policy (**Use Microsoft Entra single sign-on**). Learn's Boot overview describes only the case with it turned on, so test the case without it in the pilot.

Learn's Boot overview and device requirements pages do not state which Cloud PC types Boot supports; a July 2026 Tech Community article describes Flex Dedicated Cloud PCs in a call center proof of concept. Windows 365 Flex is the name for Windows 365 Frontline since the week of May 4, 2026; pilot that combination first if you use it.

## Stage 2: choose the mode

Dedicated mode is for a device used by one specific user, Shared PC mode for devices shared by several users. Windows Hello for Business is supported in dedicated mode only. Learn's pages differ on other sign-in methods, as the explainer sets out, so test every method you promise in Ring 0.

In the Settings Catalog the choice is a single value, **Enable Boot to Cloud Shared PC Mode** or **Enable Boot to Cloud Dedicated Mode (Cloud only)**. Learn does not explain the suffix, so check your join type in the pilot. One device receives one value, so with both kinds of device we would run two groups and two configurations (our suggestion, not Learn's).

## Stage 3: build the configuration

### Option A: the guided scenario

Learn calls the guided scenario the recommended way. In the Intune admin center go to **Devices** > **Cloud PC Overview** > **Windows 365 Boot** (under Windows 365 guides). That is Learn's path; Learn's What's new records a Windows 365 navigation update in the admin center in the week of April 6, 2026, so the menu may differ. After an Introduction page, the wizard has these pages:

1. **Basics.** Optionally set a device name template (15 characters or fewer; macros `%SERIAL%` and `%RAND:x%`, for example `Contoso-%RAND:7%`), a resource name prefix and **Shared PC mode** or **Dedicated mode**.
2. **Endpoint updates.** Windows Update options; Windows Autopatch is supported but configured outside the scenario.
3. **Settings.** Optional VPN and Wi-Fi profiles, language, security baseline, **Set Max Connection time-out** and branding. Learn says an existing VPN or Wi-Fi profile assigned to All Users or All Devices has that assignment replaced with one targeting only the scenario's group, so check what else uses it first.
4. **Assignments.** Create or pick an Entra group, and optionally set the physical device access policy for user groups (Stage 4).
5. **Review + create.**

You can finish the scenario before any device exists.

### Option B: the manual setup

Learn documents this route for when the guided scenario is unavailable or does not complete. It creates the core resources by hand:

1. The Windows App: **Apps** > **All apps** > **Create**, platform **Windows**, app type **Microsoft Store app (new)**, package identifier 9N1F85V9T8BN, install behavior **System**, assigned as **Required** to the device group. Installation can take up to several hours, Learn says.
2. A device-targeted Settings Catalog policy (**Devices** > **Manage devices** > **Configuration** > **Create** > **New policy**, platform **Windows 10 and later**, profile type **Settings catalog**): search for **Cloud Desktop**, add **Boot To Cloud PC Enhanced** with the value from Stage 2, and optionally **Set Max Connection Timeout** (5 to 20 minutes).
3. Optionally, a user-targeted Settings Catalog policy enabling the return-option settings (Stage 4), assigned to a user group.

Autopilot profiles, enrollment status pages, update rings, Wi-Fi, VPN, language packs and baselines are not covered.

## Stage 4: decide how much of the local PC to expose

Learn's restriction page says Boot does not automatically set the policies that fully restrict the physical device, while the CloudDesktop CSP page lists local policies that **Boot To Cloud PC Enhanced** sets itself. Learn does not reconcile the two, so set explicitly what you rely on and check a pilot device. Decide before Stage 5. The restriction page lists:

| Decision | Setting |
|---|---|
| Way back to the local sign-in | **Enable Physical Device Access On Ctrl Alt Del (User)** and **On Error Screens (User)**, targeted at a user group; default is neither, so without them users cannot use the device if the Cloud PC is unreachable |
| Task Manager | `DisableTaskMgr`; applies to everyone including admins |
| Password change | `DisableChangePassword`; Learn says changing passwords is not supported on Boot devices |
| Sign-in method, notifications, startup apps, touch keyboard | `DefaultCredentialProvider` (Learn suggests username and password), `DisableNotificationCenter`, `NoToastNotification`, `DisableExplorerRunLegacy_1`, `EnableTouchKeyboardAutoInvokeInDesktopMode` |
| Drive redirection into the Cloud PC | Learn says you can include the Cloud PC in a Group Policy or Settings Catalog assignment |

Application control is a separate, conditional decision from the guided scenario page. If you enable the return option, users can reach the local Windows 11 desktop, and the Cloud Desktop CSPs alone do not restrict what they can launch there. Learn names App Control for Business (recommended) and AppLocker. Any allowlist must allow the Windows App (package family name `MicrosoftCorporationII.Windows365_8wekyb3d8bbwe`), or the device cannot connect to the Cloud PC. Test in audit mode first.

## Stage 5: Autopilot and device preparation

The guided scenario creates a **User-Driven** Autopilot profile. To switch to self-deploying mode, Learn says to create a profile under **Devices** > **Enrollment** > **Windows Autopilot** > **Deployment Profiles** with **Deployment mode** **Self-Deploying** and no groups, remove the group from the user-driven profile, then assign it to the new one.

Check Autopilot's limits first. Self-deploying mode requires TPM 2.0 with attestation, supports Microsoft Entra join only, fails on virtual machines (error 0x800705B4, including Hyper-V virtual TPMs), cannot re-enroll a device automatically and does not set a primary user automatically.

For each physical device, the device requirements page gives this sequence:

1. In Windows Update, turn on **Get the latest updates as soon as they're available**.
2. In Intune, **Devices** > **All devices** > select the device > **Wipe** > **Wipe**, selecting none of the boxes in the confirmation. Learn says the device is wiped the next time it connects to the internet, which can take several minutes. It does not say whether this applies to a device never enrolled, so check with a test device.
3. If the device is not yet registered with Autopilot, press Shift+F10 at the sign-in screen and run Learn's commands, then sign in as an Intune Administrator when prompted:

   ```
   PowerShell.exe -ExecutionPolicy Bypass
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   Install-Script -name Get-WindowsAutopilotInfo -Force
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
   Get-WindowsAutopilotInfo -Online
   ```
4. Add the device to the group by serial number under **Members** > **Add members**, then wait several minutes for assignments. For devices already registered with Autopilot, Learn says to add them to the group before they enroll or receive any policies.
5. Complete the out-of-box experience, restart, and sign in with a user who has a Cloud PC.

Learn also says to unassign unnecessary apps and profiles from the device.

## Stage 6: pilot with an exit path

The ring sizes and most test cases are our own example, not Microsoft guidance; the captive portal and default Cloud PC cases come from Learn.

1. **Ring 0, IT only (3 to 5 devices).** Test each mode and each sign-in method you promised. Review existing Shared PC policies for conflicts, as Learn advises. Check the Windows App and HostApp versions and the return buttons.
2. **Ring 1, one site or shift (10 to 20 devices).** Test captive portal Wi-Fi (the user must have connected to a normal network once), a user with two Cloud PCs (Connection Center, default Cloud PC), multiple monitors and printing.
3. **Ring 2, broader groups.** Add devices in batches, keep the exit path below ready, and move on only when your own criteria are met, for example sign-in times within the timeout.

For each ring, record the time from sign-in to Cloud PC desktop and compare it with the default connection timeout of 5 minutes.

## When a device does not behave

Learn's troubleshooting page orders the checks:

1. Confirm the user can reach the Cloud PC from windows365.microsoft.com and from Windows App on another device.
2. Set a default Cloud PC if the user has several (web client, **Settings**, **Boot to this Cloud PC**).
3. Select **Device sync** in Intune and have the user restart.
4. Compare the registry values: `BootToCloudMode` = 1 under `HKLM\Software\Microsoft\PolicyManager\current\device\CloudDesktop`, `OverrideShellProgram` = 1 under `HKLM\Software\Microsoft\PolicyManager\current\device\WindowsLogon`, and the values `18` and `01` = 1 under `HKLM\Software\Microsoft\Windows\CurrentVersion\SharedPC\NodeValues`. Learn says to create or update them if necessary, without separating modes. The guide ties the SharedPC configuration to shared mode, so on dedicated devices compare the last two against a working pilot device first (our reading).
5. Check versions with `Get-AppxPackage -AllUsers -name *MicrosoftCorporationII*` against the minimums in Stage 1.
6. If the cause stays unclear, remove the device from the group, sync, wait up to 8 hours for policy removal, re-add, wait about 10 minutes and sync again.

For captive portal problems, Learn says to disconnect, reconnect and sign in again, or cancel and select **Connect**. For support cases, collect the Session ID, Correlation ID or ActivityID and the logs in `C:\Users\<username>\AppData\Local\Temp\DiagOutputDir\Windows365\Logs` and `...\RdClientAutoTrace`.

## Sources

- [Microsoft Learn: Guided scenario, deploy Windows 365 Boot to physical devices](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-guide)
- [Microsoft Learn: Windows 365 Boot physical device requirements](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-physical-device-requirements)
- [Microsoft Learn: What is Windows 365 Boot?](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-overview)
- [Microsoft Learn: Restrict user access to Windows 365 Boot physical devices](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-boot-restrict-user-access-physical-device)
- [Microsoft Learn: Troubleshoot Windows 365 Boot](https://learn.microsoft.com/en-us/troubleshoot/windows-365/troubleshoot-windows-365-boot)
- [Microsoft Learn: Windows Autopilot self-deploying mode](https://learn.microsoft.com/en-us/autopilot/self-deploying)
- [Microsoft Learn: Configure single sign-on for Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/configure-single-sign-on)
- [Microsoft Learn: CloudDesktop CSP](https://learn.microsoft.com/en-us/windows/client-management/mdm/clouddesktop-csp)
- [Microsoft Learn: Policy CSP, CloudDesktop](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-clouddesktop)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Microsoft Tech Community: Windows 365 Boot (Core Infrastructure and Security Blog)](https://techcommunity.microsoft.com/blog/coreinfrastructureandsecurityblog/windows-365-boot/4533696)
