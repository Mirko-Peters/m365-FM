---
title: "Deploy Microsoft 365 Apps to Windows Devices With Intune: Settings and Limits"
summary: "Add the Microsoft 365 Apps suite to Windows devices in Intune: the exact menu path, configuration designer or XML, architecture and channel settings, Remove MSI, assignment types and the limits and warnings Microsoft Learn lists."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [intune, microsoft-365-apps]
keypoints:
  - "Go to Apps > All Apps > Create, choose Windows 10 and later under Microsoft 365 Apps, then Select. Only the Microsoft 365 Apps suite is supported."
  - "Configure the suite with the configuration designer or enter XML. The XML Product ID can be O365BusinessRetail or O365ProPlusRetail. Business edition must use XML."
  - "If MSI-based Office apps are present, use Remove MSI. Otherwise the Intune-delivered apps fail to install."
  - "Only one Microsoft 365 deployment is delivered to a device. Open apps during install can cause failure and data loss."
  - "For devices tracked by the Autopilot enrollment status page, Microsoft recommends deploying Microsoft 365 Apps as a Win32 app."
faq:
  - q: "Where do I add the Microsoft 365 Apps in Intune?"
    a: "According to Microsoft Learn, go to Apps > All Apps > Create, select Windows 10 and later in the Microsoft 365 Apps section of the Select app type pane, then choose Select."
  - q: "What happens if the device has MSI-based Office?"
    a: "Learn says you must use the Remove MSI feature to uninstall those apps safely. Otherwise the Intune-delivered Microsoft 365 apps fail to install."
  - q: "Can I deploy two different Microsoft 365 configurations to one device?"
    a: "No. Learn says multiple Microsoft 365 deployments are not currently supported. Only one deployment is delivered to the device."
  - q: "Which license activates the apps?"
    a: "Learn says you must use Microsoft 365 Apps licenses to activate Microsoft 365 Apps deployed through Microsoft Intune."
  - q: "What about Autopilot?"
    a: "For devices tracked during the enrollment status page, Learn recommends deploying Microsoft 365 Apps as a Win32 app, because the Microsoft 365 Apps app type is not managed by the Intune Management Extension and can cause an installation concurrency issue that makes ESP fail."
---

Intune can install the Microsoft 365 Apps suite on Windows devices through a dedicated app type. You create the suite in the admin center, choose a configuration format, assign it to groups and let the device download the package. This guide follows the Microsoft Learn article on adding Microsoft 365 apps.

## Requirements and limits

These are worded as on the page, shortened:

- Devices must run the Windows Creators Update or later.
- Intune supports adding Microsoft 365 apps from the Microsoft 365 Apps suite only.
- The method is not supported on Windows Home, Windows Team, Windows Holographic or Windows Holographic for Business.
- Multiple Microsoft 365 deployments are not currently supported. Only one deployment is delivered to the device.
- If any Microsoft 365 app is open during install, the installation might fail, and users might lose unsaved data.
- Installing the Microsoft Store desktop apps (Office Centennial) on a device that already has Intune-deployed Microsoft 365 apps is not supported and might cause data loss or corruption.
- If MSI-based Office apps are on the device, you must use **Remove MSI**. Otherwise the Intune-delivered apps fail to install.
- Installing OneDrive through the Office Deployment Tool in Intune is not supported. OneDrive can still install as a component of some Microsoft 365 App installations.
- Settings catalog configurations must not conflict with the deployment, for example Update Channel and version, because conflicts might lead to unexpected behavior, including app reinstallation.
- You must use Microsoft 365 Apps licenses to activate the apps.

## Create the app

1. Go to **Apps** > **All Apps** > **Create**.
2. In the **Select app type** pane, under **Microsoft 365 Apps**, select **Windows 10 and later**, then **Select**.
3. **App suite information:** enter a unique suite name (duplicate names mean only one app shows in the Company Portal) and a description. Publisher, developer and owner show Microsoft. Category, URLs and notes are optional.
4. **Configure app suite:** choose one of two formats, described next.
5. **Scope tags:** optional, controls who sees client app information.
6. **Assignments:** choose **Required**, **Available for enrolled devices** or **Uninstall** for groups.
7. **Review + create:** select **Create**.

## Configuration designer settings

- **Select Office apps** and optionally **other Office apps** that need a license, such as Project Online desktop client and Visio Online Plan 2.
- **Architecture:** 32-bit or 64-bit. The 32-bit version installs on both 32-bit and 64-bit devices. The 64-bit version installs on 64-bit devices only.
- **Default file format:** Office Open Document Format or Office Open XML Format.
- **Update Channel:** how Office is updated on devices.
- **Remove other versions:** Yes removes all Office (MSI) apps from the device, not only the selected ones.
- **Version to install**, and **Specific version** when set to Specific. For devices that update a pinned version and are deployed as available, the status may show Installed until the next check-in, when it temporarily changes to Unknown.
- **Use shared computer activation** for shared computers.
- **Automatically accept the app end user license agreement**.
- **Languages:** Office installs in supported languages installed with Windows. You can add more.

## XML format

You can enter a custom configuration XML for the Office Deployment Tool. The Product ID can be Business (`O365BusinessRetail`) or Proplus (`O365ProPlusRetail`). The page also says Microsoft 365 Apps for business edition is supported, but its app suite must be configured using XML data.

## What happens on the device

After assignment through the Office configuration service provider, the device downloads the package from officecdn.microsoft.com. Two folders appear in Program Files: Microsoft Office and Microsoft Office 15. Required assignments install silently and start automatically, and downloaded files are deleted after success. Available assignments appear in the Company Portal.

## Autopilot note

For devices tracked during the enrollment status page, deploy Microsoft 365 Apps as a Win32 app instead. The Microsoft 365 Apps app type is not managed by the Intune Management Extension and can cause an installation concurrency issue that makes ESP fail.

## A pre-flight check

This list is my advice, built from the limits above, not a Microsoft procedure.

1. Inventory devices for MSI-based Office and plan for Remove MSI.
2. Check settings catalog policies for conflicting channel or version settings.
3. Pilot with a small group, and warn users to save work and close apps.
4. Decide architecture and channel before you create the suite, since only one deployment applies.

## Not covered

The page does not give Office Deployment Tool XML option details, channel definitions, shared computer activation details, the full network endpoint list, Win32 packaging steps, license procurement or the full error code tables in this summary.

## Related

- [Intune](https://www.m365.fm/entity/intune/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)

## Sources

- [Add Microsoft 365 Apps to Windows Devices Using Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/app-management/deployment/add-microsoft-365-windows)
