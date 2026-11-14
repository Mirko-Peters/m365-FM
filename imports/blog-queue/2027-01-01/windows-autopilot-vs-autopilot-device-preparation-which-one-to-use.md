---
title: "Windows Autopilot vs Autopilot Device Preparation: Which One to Use"
summary: "Compare classic Windows Autopilot and Windows Autopilot device preparation using the Microsoft Learn comparison page: modes, join types, app limits, supported Windows versions, the factors Learn lists for choosing between them, and how they behave side by side."
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
  - "Both can run in one organization, but a device uses only one. For a device registered with classic Autopilot, association with the tenant for device preparation takes precedence."
faq:
  - q: "Which one does Microsoft recommend?"
    a: "According to Microsoft Learn, the page gives no single recommendation. It says the choice depends on many factors and lists which solution supports which scenario. It also says device preparation in its initial offering is not as feature rich as classic Autopilot."
  - q: "Do I need to register devices for device preparation?"
    a: "According to Microsoft Learn, no. Device registration is not required for device preparation but is required for classic Autopilot."
  - q: "Can both run in the same tenant?"
    a: "Yes. According to Microsoft Learn, both can run side by side, but each device runs only one. For a device registered with classic Autopilot, the classic profile takes precedence if the device is not associated with the tenant, and device preparation takes precedence if it is."
  - q: "Does device preparation support hybrid join?"
    a: "No. According to Microsoft Learn, device preparation supports Microsoft Entra join only, while classic Autopilot supports Entra join and Entra hybrid join."
---

Microsoft Learn does not name a winner between Windows Autopilot device preparation and classic Windows Autopilot. Its comparison page says the choice depends on many factors and lists which solution supports which scenario. Read from that table, device preparation covers user-driven and automatic deployments of Windows 11 with Microsoft Entra join without device registration, while only classic Autopilot has modes such as pre-provisioning or self-deploying, hybrid join, Windows 10, or more than 10 apps and scripts during OOBE. This guide follows that Microsoft Learn comparison page.

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

## How Learn frames the choice

The requirement table on the page gives **device preparation** a check mark for GCCH and DoD environments, automatic deployment, a simpler deployment configuration and experience, no requirement to pre-stage devices, LOB and Win32 apps in one deployment, and near real-time monitoring.

The table gives **classic Autopilot** a check mark for pre-provisioned, self-deploying and existing-device scenarios, hybrid join, Windows 10, HoloLens, Teams Meeting Room, Autopilot Reset, DFCI management, co-management, extensive customization, more than 10 apps or scripts during OOBE, and blocking desktop access until user-based configurations are applied.

The page gives no single recommendation. It says which solution to use depends on many factors and that each environment has different needs. It adds that device preparation in its initial offering is not as feature rich as classic Autopilot, but has some advantages not available there.

## Running both at once

Both can run side by side in one organization, but a device runs only one:

- For a device that is registered with classic Autopilot and not associated with the tenant, the classic Autopilot profile takes precedence.
- If the registered device is associated with the tenant, device association takes precedence and the device preparation deployment runs.
- To use device preparation on a device that is already registered for classic Autopilot without associating it, first deregister the device.

## Suggestion: a decision check

This section is a practical suggestion and not a Microsoft statement.

1. Do you need hybrid join, Windows 10, pre-provisioning or self-deploying? If yes, classic Autopilot.
2. Are all devices on a supported Windows 11 version and Entra joined? If yes, device preparation is a candidate.
3. Count the apps and scripts needed during setup against the 25 and 10 limits.
4. Pilot device preparation with a small group before you move the rest.

## Not covered

The page I read does not describe the following:

- A single recommendation between the two.
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

- [Compare Windows Autopilot device preparation and Windows Autopilot (Microsoft Learn)](https://learn.microsoft.com/autopilot/device-preparation/compare)
