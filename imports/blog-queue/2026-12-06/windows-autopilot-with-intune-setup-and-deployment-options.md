---
title: "Windows Autopilot with Intune: Requirements, Setup Steps and Which Mode to Use"
summary: "How to set up Windows Autopilot with Intune: requirements, the eight-step user-driven Entra join workflow, device preparation versus classic Autopilot, hybrid join caveats and network needs."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [windows-autopilot, intune, windows-autopilot-device-preparation, enrollment-status-page]
keypoints:
  - "Autopilot transforms the OEM-installed Windows into a business-ready state, so IT does not maintain custom images and drivers per model."
  - "It needs Microsoft Entra automatic MDM enrollment, which requires Entra ID P1 or P2, plus Intune licenses assigned to users."
  - "The user-driven Entra join workflow has eight steps, from automatic enrollment to deploying the device. Steps can be reordered."
  - "Autopilot device preparation supports only Microsoft Entra join and Windows 11 versions with a minimum update level."
  - "Microsoft does not recommend deploying new devices as hybrid joined, including through Autopilot."
faq:
  - q: "What do I need before I can use Windows Autopilot?"
    a: "Microsoft Learn lists a supported Windows version and edition, network access to the Autopilot and Entra services, a qualifying subscription that provides Entra ID and Intune features, and configuration of Microsoft Entra automatic enrollment. Licenses still have to be assigned to users so they can enroll devices."
  - q: "What is the difference between Windows Autopilot and Autopilot device preparation?"
    a: "Microsoft Learn describes device preparation as a separate product with its own overview. It uses a single profile for policies and OOBE settings, adds the device to a predefined security group at enrollment, supports only Microsoft Entra join and applies to Windows 11."
  - q: "Can Autopilot join devices to on-premises Active Directory?"
    a: "Yes, through Microsoft Entra hybrid join with the Intune Connector for Active Directory, according to the Windows enrollment guide. The Autopilot requirements page adds that Microsoft recommends Entra join for new devices and does not recommend hybrid join, including through Autopilot."
  - q: "Does Autopilot work for personal or BYOD devices?"
    a: "No. The Windows enrollment guide says Autopilot is for organization-owned devices and is not suitable for personal or BYOD devices. It points to Windows automatic enrollment or user enrollment instead."
  - q: "Which ports and URLs does Autopilot need?"
    a: "Microsoft Learn says the simple case is DNS resolution plus access to ports 80, 443 and UDP 123. The Autopilot Deployment Service uses ztd.dds.microsoft.com and login.live.com. Self-deploying and pre-provisioning modes also need access to TPM attestation URLs under microsoftaik.azure.net."
---
Windows Autopilot lets a new Windows PC reach a business-ready state without IT reimaging it. The user connects to a network and signs in, and Intune applies settings, policies and apps. This article covers the requirements, the user-driven Microsoft Entra join workflow, how Autopilot device preparation differs, and the mistakes worth avoiding.

## What Autopilot does

Microsoft Learn describes Autopilot as a collection of technologies that set up and pre-configure new devices. It uses the OEM-optimized Windows client already on the device. IT does not maintain a custom image or drivers for each model. Autopilot can apply settings and policies, install apps and change the Windows edition. It can also join the device to Microsoft Entra ID, enroll it in Intune and run Windows Autopilot Reset to prepare a device for a new user.

Autopilot is for organization-owned devices. The Windows enrollment guide says it is not suitable for personal or BYOD devices, for devices that another MDM already manages, or together with a device enrollment manager account.

## Requirements to check first

- **Windows:** a supported version of Windows 11 or Windows 10. Supported editions include Pro, Pro Education, Pro for Workstations, Enterprise, Education and Enterprise LTSC. Products past their lifecycle end date are not supported.
- **Licensing:** a subscription that provides Entra ID and MDM functionality, such as Microsoft 365 Business Premium, F1 or F3, Academic A1, A3 or A5, Microsoft 365 E3 or E5, EMS E3 or E5, or Entra ID P1 or P2 with Intune. Licenses still need to be assigned to users so they can enroll devices.
- **Configuration:** Microsoft Entra automatic enrollment must be configured. The first signing-in user needs permission to join devices to Microsoft Entra ID, except in self-deploying mode.
- **Hardware:** no requirements beyond those for running Windows.
- **Network:** DNS resolution and access on ports 80 and 443 and UDP 123 in the simple case. The Autopilot Deployment Service uses `ztd.dds.microsoft.com` and `login.live.com`. Configure proxy settings on the proxy server, because Microsoft says applying them through Intune policy is not fully supported.

Self-deploying and pre-provisioning modes also rely on TPM attestation and need access to `*.microsoftaik.azure.net`. Firmware TPMs from Intel, AMD and Qualcomm must be able to fetch certificates from the manufacturer on first use.

## The user-driven Entra join workflow

Microsoft's tutorial lists eight steps for the user-driven Microsoft Entra join scenario:

1. Set up Windows automatic Intune enrollment.
2. Allow users to join devices to Microsoft Entra ID.
3. Register devices as Windows Autopilot devices.
4. Create a device group.
5. Configure and assign the Autopilot Enrollment Status Page (ESP).
6. Create and assign the Autopilot profile.
7. Optionally assign the Autopilot device to a user.
8. Deploy the device.

Microsoft says this workflow is designed for a lab but can be used in production, and that steps can be reordered. Creating the device group before registering devices may suit production better. For automatic enrollment in the Intune admin center, the Windows enrollment guide points to **Windows Enrollment** > **Automatic Enrollment**, where you set the **MDM user scope** to **Some** or **All**.

In the ESP, the device phase applies settings, apps and policies assigned to the device. The user phase applies those assigned to the user. The ESP can keep users from using the device until configuration finishes. Registered devices appear under **Devices** > **By platform** > **Windows**.

## Deployment scenarios

Microsoft's scenarios page lists user-driven mode, self-deploying mode, Windows Autopilot Reset, pre-provisioning and existing devices. It does not map organizations to a single best choice. It says the right scenario depends on organization type, progress toward the latest Windows and the state of the move to modern management.

## Autopilot device preparation

Autopilot device preparation is described as a separate product with its own overview. Differences listed by Microsoft:

- A single profile provisions policies plus deployment and OOBE settings.
- At enrollment the device joins a predefined device security group. Microsoft says direct assignment to this group is faster than a dynamic group.
- Line-of-business and Win32 apps can be deployed together.
- Reports are near real time.

Limits to know: only Microsoft Entra join is supported, and it applies to Windows 11 (version 24H2 or later, or 23H2 and 22H2 with KB5035942 or later). Only the apps and scripts selected in the profile install during OOBE. Others assigned to the group install after deployment. If a device is registered for classic Autopilot and not associated with the tenant, the classic profile takes precedence.

## Hybrid join with Autopilot

Autopilot can deploy hybrid joined devices and needs the Intune Connector for Active Directory for that. The device should be on the internal network for hybrid join to work. Microsoft recommends cloud-native Entra join for new devices and does not recommend new hybrid joined deployments, including through Autopilot.

## Common mistakes

- Using Autopilot for BYOD devices.
- Skipping the automatic enrollment scope, so devices join but are not enrolled.
- Forgetting to assign Intune licenses to users.
- Blocking `ztd.dds.microsoft.com` or ports 80 and 443 on a restricted network.
- Expecting every app and policy to finish during OOBE with device preparation.

## What the pages do not say

The Learn pages I could read did not give the menu paths of the profile and ESP settings, nor timeout values. Check the linked tutorial pages for those before you build a runbook.

## Related

- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Windows Autopilot device preparation](https://www.m365.fm/entity/windows-autopilot-device-preparation/)
- [Enrollment Status Page](https://www.m365.fm/entity/enrollment-status-page/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Windows Autopilot overview](https://learn.microsoft.com/en-us/autopilot/overview)
- [Windows Autopilot requirements](https://learn.microsoft.com/en-us/autopilot/requirements)
- [Windows Autopilot scenarios](https://learn.microsoft.com/en-us/autopilot/windows-autopilot-scenarios)
- [User-driven Microsoft Entra join workflow](https://learn.microsoft.com/en-us/autopilot/tutorial/user-driven/azure-ad-join-workflow)
- [Windows Autopilot device preparation overview](https://learn.microsoft.com/en-us/autopilot/device-preparation/overview)
- [Windows device enrollment guide for Intune](https://learn.microsoft.com/en-us/intune/device-enrollment/windows/guide)
