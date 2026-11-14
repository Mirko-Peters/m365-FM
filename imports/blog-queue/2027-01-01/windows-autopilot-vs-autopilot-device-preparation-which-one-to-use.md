---
title: "Windows Autopilot vs Autopilot Device Preparation: Which One to Use"
summary: "Compare classic Windows Autopilot and Windows Autopilot device preparation using the Microsoft Learn comparison page: modes, join types, app limits, supported Windows versions, when to choose each, and how they behave side by side."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [windows-autopilot, windows-autopilot-device-preparation, intune]
keypoints:
  - "Device preparation supports user-driven and automatic modes with Microsoft Entra join only. Classic Autopilot adds pre-provisioned, self-deploying and existing devices modes and supports hybrid join."
  - "Device preparation does not require device registration. Classic Autopilot does."
  - "Device preparation allows up to 25 essential apps and up to 10 essential PowerShell scripts during OOBE. Classic Autopilot lists up to 100 applications."
  - "Device preparation needs Windows 11 24H2 or later, or 23H2 and 22H2 with KB5035942 or later. Classic Autopilot covers supported Windows 11 and Windows 10 GA Channel versions."
  - "Both can run in one organization, but a device uses only one. A device associated with the tenant for device preparation uses that, and association takes precedence."
faq:
  - q: "Which one does Microsoft recommend?"
    a: "According to Microsoft Learn, device preparation suits user-driven or automatic deployments on Windows 11, especially in GCCH or DoD, and classic Autopilot suits scenarios such as pre-provisioned, self-deploying, hybrid join and Windows 10. The page also says device preparation in its initial offering is not as feature rich."
  - q: "Do I need to register devices for device preparation?"
    a: "According to Microsoft Learn, no. Device registration is not required for device preparation but is required for classic Autopilot."
  - q: "Can both run in the same tenant?"
    a: "Yes. According to Microsoft Learn, both can run side by side, but each device runs only one. If a device is not associated with the tenant, the classic Autopilot profile takes precedence."
  - q: "Does device preparation support hybrid join?"
    a: "No. According to Microsoft Learn, device preparation supports Microsoft Entra join only, while classic Autopilot supports Entra join and Entra hybrid join."
---

Use Windows Autopilot device preparation for user-driven or automatic deployments of Windows 11 with Microsoft Entra join, especially if you cannot pre-register devices. Use classic Windows Autopilot if you need modes such as pre-provisioning or self-deploying, hybrid join, Windows 10, or more than 10 apps and scripts during setup. This guide follows the Microsoft Learn comparison page, which applies to Windows 11.

## Side-by-side comparison

| Row | Device preparation | Classic Autopilot |
|---|---|---|
| Features | GCCH and DoD environment support, faster and more consistent provisioning, near real-time monitoring and troubleshooting information | Multiple device types (HoloLens, Teams Meeting Room), many customization options |
| Supported modes | User-driven, Automatic | User-driven, Pre-provisioned, Self-deploying, Existing devices |
| Join types | Microsoft Entra join only | Microsoft Entra join, Microsoft Entra hybrid join |
| Device registration required | No | Yes |
| Binding devices before enrollment | Yes, by associating devices | Yes, by registering devices |
| Admin configuration | Device preparation policy, plus a device security group with Intune Provisioning Client as owner | Deployment profile and Enrollment Status Page |
| Configuration during provisioning | Device-based only, during OOBE. Up to 25 essential apps (LOB, Win32, Microsoft Store, Microsoft 365) and up to 10 essential PowerShell scripts | Device-based during device ESP, user-based during user ESP. Up to 100 applications |
| Reporting | Deployment report shows all device preparation deployments, with more data and near real-time | Deployment report shows only registered devices and is not real-time |
| LOB and Win32 apps in one deployment | Yes | No |
| Windows versions | Windows 11 24H2 or later. 23H2 and 22H2 with KB5035942 or later | All currently supported Windows 11 and Windows 10 GA Channel versions |

The page has no row about ESP versus enrollment time grouping. The closest content is the configuration row: classic Autopilot applies device settings in the device ESP and user settings in the user ESP, while device preparation applies only device settings during OOBE.

## What only one of them supports

Only device preparation: GCCH and DoD support, automatic deployment, no need to pre-stage devices, Win32 and LOB apps in the same deployment, and near real-time monitoring.

Only classic Autopilot: the pre-provisioned, self-deploying and existing-devices scenarios, Autopilot Reset, Entra hybrid join, Windows 10, HoloLens, Teams Meeting Room, DFCI management, co-management, extensive customization, more than 10 apps or scripts during OOBE, and blocking user desktop access until user-based configurations finish.

Both support the user-driven scenario, Microsoft Entra join and Windows 11.

## When to use which

Learn recommends **device preparation** for user-driven or automatic deployments on Windows 11, especially in GCCH or DoD. It fits organizations that cannot pre-stage devices, want a simpler setup, need LOB and Win32 apps in one deployment, or want near real-time monitoring.

Learn recommends **classic Autopilot** for pre-provisioned, self-deploying or existing-device scenarios, hybrid join, Windows 10, HoloLens or Teams Rooms, Autopilot Reset, DFCI or co-management, heavy customization, or more than 10 apps or scripts during OOBE.

The page says device preparation in its initial offering is not as feature rich as Windows Autopilot, so the choice depends on what your environment needs.

## Running both at once

Both can run side by side in one organization, but a device runs only one:

- A device that is not associated with the tenant for device preparation uses the classic Autopilot profile.
- A device that is associated with the tenant runs device preparation, and the association takes precedence.
- To use device preparation on a device that is already registered for classic Autopilot without associating it, first deregister the device.

## Suggestion: a decision check

This section is a practical suggestion and not a Microsoft statement.

1. Do you need hybrid join, Windows 10, pre-provisioning or self-deploying? If yes, classic Autopilot.
2. Are all devices on a supported Windows 11 version and Entra joined? If yes, device preparation is a candidate.
3. Count the apps and scripts needed during setup against the 25 and 10 limits.
4. Pilot device preparation with a small group before you move the rest.

## Not covered

The page I read does not describe the following:

- Licensing and pricing.
- Migration guidance from classic Autopilot to device preparation.
- A definition of essential apps or scripts.
- Timing figures for near real-time reporting.
- A roadmap for missing features.
- Troubleshooting steps.

## Related

- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Windows Autopilot device preparation](https://www.m365.fm/entity/windows-autopilot-device-preparation/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Windows Autopilot device preparation compared with Windows Autopilot](https://learn.microsoft.com/autopilot/device-preparation/compare)
