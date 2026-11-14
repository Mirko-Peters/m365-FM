---
title: "Set Up Windows 365 Boot: Sign In Directly to a Cloud PC From a Physical Device"
summary: "Configure Windows 365 Boot with the Intune guided scenario or manually: license and role, Windows 11 build requirements, shared or dedicated mode, settings catalog options, application control notes and what the Learn pages leave out."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [windows-365]
keypoints:
  - "Windows 365 Boot lets users sign in directly to a Cloud PC from a Windows 11 physical device. Shared PC and Dedicated modes are available."
  - "The guided scenario requires Windows 11 Enterprise or Professional, version 22621.3374 or later, a Windows 365 Enterprise license and the Intune Service Administrator role."
  - "In the Intune admin center the guided scenario is under Devices > Cloud PC Overview > Windows 365 Boot."
  - "The return-to-physical-device feature requires Windows 11 version 23H2, OS build 22621.4249 or later."
  - "Windows 365 Boot does not apply the CSP policies that fully restrict users from the physical device. Admins must review and apply them."
faq:
  - q: "What do I need to create Windows 365 Boot provisioning policies?"
    a: "According to Microsoft Learn, a Windows 365 Enterprise license and the Intune Service Administrator role. Devices and Cloud PCs must run Windows 11 Enterprise or Professional, version 22621.3374 or later."
  - q: "Where is the guided scenario?"
    a: "In the Intune admin center, go to Devices > Cloud PC Overview > Windows 365 Boot, under Windows 365 guides."
  - q: "What is the difference between Shared PC and Dedicated mode?"
    a: "Shared PC mode lets multiple users sign in to the same physical device, each reaching their own Cloud PC. In Dedicated mode the device is assigned to one user. Windows Hello for Business is supported only in Dedicated mode."
  - q: "Does Boot lock down the physical device?"
    a: "No. Learn says it does not automatically apply the CSP policies that fully restrict users from the physical device. Admins must review and apply them to meet their security needs."
  - q: "Does the page state Microsoft Entra join requirements?"
    a: "No explicit join requirement is stated on the guided scenario page. It references a Microsoft Entra device group and Windows Autopilot registration."
---

Windows 365 Boot lets users sign in to a Windows 11 physical device and go straight to their Windows 365 Cloud PC. You set it up with a guided scenario in the Microsoft Intune admin center, or manually with a Settings catalog profile. This guide follows two Microsoft Learn pages.

## What it does

Admins configure Windows 11 physical devices so users skip signing in to the device and sign in directly to the Cloud PC. With single sign-on enabled on the Cloud PC, users do not sign in a second time.

- **Shared PC mode:** multiple users sign in to the same device and each reaches their own Cloud PC. Signing out returns the device to the Windows 11 sign-in screen.
- **Dedicated mode:** the device is assigned to one user. Windows Hello is supported in this mode.

| Sign-in method | Dedicated | Shared |
| --- | --- | --- |
| Username and password | Yes | Yes |
| Windows Hello for Business | Yes | No |
| FIDO key | Yes | Yes |
| Convenience PIN | No | No |

## Requirements

- Windows 11 Enterprise or Professional, version 22621.3374 or later, on each physical device and Cloud PC.
- A Windows 365 Enterprise license to create Boot provisioning policies.
- The Intune Service Administrator role.
- Devices that meet the separate physical device requirements before you add them to the group.

The page does not state a Microsoft Entra join requirement.

## Guided scenario

In the Intune admin center go to **Devices** > **Cloud PC Overview** > **Windows 365 Boot**.

1. **Basics:** optionally apply a device name template (15 characters or less, letters, numbers and hyphens, not only numbers, no spaces, macros `%SERIAL%` and `%RAND:x%`), set a resource name prefix and choose **Shared PC mode** or **Dedicated mode**.
2. **Endpoint updates:** set Windows Update options. Windows Autopatch is supported but configured outside the scenario.
3. **Settings (optional):** VPN profile, Wi-Fi profile, language, security baseline, maximum connection time-out and sign-in branding. Existing All Users or All Devices assignments for the VPN and Wi-Fi profiles are removed and replaced by an assignment to the scenario group.
4. **Assignments:** create or choose a device group, and optionally a physical device access policy for the CTRL-ALT-DEL screen, error screens, neither or both.
5. **Review + create.**

You can finish the scenario before devices are in the group. Devices added later with internet access receive the settings automatically. The scenario creates a user-driven Autopilot profile. For self-deploying, create a new profile with **Deployment mode** set to **Self-Deploying** and move the group assignment.

## Manual setup

The manual path creates three resources:

1. **Windows App** from the Microsoft Store (new), package identifier `9N1F85V9T8BN`, install behavior **System**, assigned as **Required**. Installation can take up to several hours.
2. **A Settings catalog profile** for Windows 10 and later. Under **Cloud Desktop**, set **Boot To Cloud PC Enhanced** to shared mode or dedicated mode. **Set Max Connection Timeout** is optional, from 5 to 20 minutes.
3. **An optional user-targeted Settings catalog profile** for physical device access on the CTRL-ALT-DEL and error screens. It requires Windows 11 version 23H2, OS build 22621.4249 or later.

## User experience notes from the overview

If a user has more than one Cloud PC and no default is set, the Connection Center appears at sign-in, and users can choose **Connect automatically** from the menu to set a default. In the web client, the default can be changed under **Integrated experiences** with **Connect while signed in to device** under **Boot to this Cloud PC**. Captive portals are supported for Wi-Fi networks that need browser-based sign-in, provided the user connected once to a network without a captive portal on that device. Cross-region disaster recovery is supported.

## Security notes

Windows 365 Boot does not automatically apply the CSP policies that fully restrict users from the physical device. The page links to a separate article with examples, such as disabling Task Manager on the CTRL-ALT-DEL screen. If you enable the return-to-physical-device option and use App Control for Business or AppLocker, any allowlist must allow the Windows App. Test in audit mode before enforcing.

## Not covered

The pages do not give full device model requirements, Entra join steps, the full list of hardening policies, Autopatch configuration or pricing.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)

## Sources

- [Windows 365 Boot overview](https://learn.microsoft.com/windows-365/enterprise/windows-365-boot-overview)
- [Configure Windows 365 Boot](https://learn.microsoft.com/windows-365/enterprise/windows-365-boot-guide)
