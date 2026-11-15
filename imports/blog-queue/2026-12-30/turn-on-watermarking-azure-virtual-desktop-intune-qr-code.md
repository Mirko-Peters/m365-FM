---
title: "Turn On Watermarking in Azure Virtual Desktop With Intune: QR Code Settings and Client Support"
summary: "Enable watermarking for Azure Virtual Desktop using Microsoft Learn: prerequisites, supported clients, the Intune settings catalog path, QR code option defaults, the Connection ID versus Device ID choice, how to trace a session from a QR code, and the limits for RemoteApp."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [azure-virtual-desktop]
keypoints:
  - "Watermarking shows QR codes in remote desktops that contain the Connection ID or Device ID of the session, so admins can trace a screenshot back to a session."
  - "Configure it on session hosts with Intune or Group Policy. Once enabled, only clients that support watermarking can connect, with a non-specific error for others."
  - "It applies to remote desktops only. RemoteApp and direct mstsc.exe connections to a session host are not watermarked and are allowed."
  - "In Intune, use a settings catalog profile and choose Enable watermarking, not the deprecated entry which lacks the QR code content option."
  - "Screen capture protection is configured separately under the same Intune path. It is not DRM-level protection."
faq:
  - q: "What is in the QR code?"
    a: "According to Microsoft Learn, the Connection ID or Device ID of the remote session. Device ID is only for personal host pool session hosts joined to Microsoft Entra ID or Entra hybrid joined."
  - q: "Which clients support watermarking?"
    a: "Learn lists the Remote Desktop client for Windows version 1.2.3317 or later, web, macOS 10.9.5 or later and iOS or iPadOS 10.5.4 or later, and Windows App on Windows, macOS, iOS and iPadOS, web and Android or Chrome OS (preview)."
  - q: "Does it apply to RemoteApp?"
    a: "No. Watermarking applies to remote desktops only, and RemoteApp connections are allowed without it."
  - q: "How do I find which session a QR code belongs to?"
    a: "Use Azure Virtual Desktop Insights, Connection Diagnostics tab, or run a Log Analytics query on WVDConnections filtered by CorrelationId."
  - q: "Which roles do I need?"
    a: "Desktop Virtualization Host Pool Contributor on the host pool, as a minimum, plus Policy and Profile manager in Intune, or Domain Admins for Group Policy."
---

Watermarking in Azure Virtual Desktop adds a QR code watermark to remote desktops. If someone photographs the screen, the code identifies the session. Learn pairs it with screen capture protection to protect sensitive information on client endpoints. This guide follows the Learn watermarking article.

## How it behaves

Watermarking is configured on session hosts with Microsoft Intune or Group Policy and enforced by Windows App or the Remote Desktop client. After you enable it on a session host, only clients that support it can connect. Unsupported clients fail with an error message that is not specific. Watermarking applies to remote desktops only. With RemoteApp it is not applied and the connection is allowed, and a direct connection to a session host with mstsc.exe is also not watermarked.

## Prerequisites

- A host pool with session hosts.
- An Entra ID account with the Desktop Virtualization Host Pool Contributor role on the host pool, at least.
- A supported client.
- Azure Virtual Desktop Insights configured for your environment.
- For Intune, the Policy and Profile manager role and a group with the devices. For Group Policy, a Domain Admins account and a group or OU holding the session hosts.

## Supported clients

| Client | Versions |
| --- | --- |
| Remote Desktop client, Windows | 1.2.3317 or later on Windows 10 and later |
| Remote Desktop client, macOS | 10.9.5 or later |
| Remote Desktop client, iOS and iPadOS | 10.5.4 or later |
| Remote Desktop client, web | Supported, no version given |
| Windows App | Windows, macOS, iOS and iPadOS, web, and Android or Chrome OS in preview |

## Enable it with Intune

1. In the Intune admin center create or edit a configuration profile for Windows 10 and later with the **Settings catalog** profile type.
2. In the settings picker browse to **Administrative templates**, **Windows Components**, **Remote Desktop Services**, **Remote Desktop Session Host**, **Azure Virtual Desktop**.
3. Select **Enable watermarking**. Do not select the entry marked Deprecated, because it lacks the option for the QR code content.
4. Set **Enable watermarking** to **Enabled** and adjust the options.
5. Assign the group that contains the session hosts, then review and create.
6. Sync the session hosts with Intune so the settings take effect.

| Option | Range (default) |
| --- | --- |
| QR code bitmap scale factor | 1 to 10 (4) |
| QR code bitmap opacity | 100 to 9999 (2000) |
| Width of grid box, percent of QR code width | 100 to 1000 (320) |
| Height of grid box, percent of QR code width | 100 to 1000 (180) |
| QR code embedded content | Connection ID (default) or Device ID |

Learn recommends testing opacity values to balance readability of the session with scannability of the code, and keeping the other defaults. Its description of opacity says 100 is fully transparent.

## Enable it with Group Policy

Make the Administrative template for Azure Virtual Desktop available in Group Policy, then in the Group Policy Management console create or edit a policy that targets the session hosts. Go to **Computer Configuration**, **Policies**, **Administrative Templates**, **Windows Components**, **Remote Desktop Services**, **Remote Desktop Session Host**, **Azure Virtual Desktop**, open **Enable watermarking** and set it to **Enabled**. The options and defaults are the same as in Intune, and the Group Policy table describes opacity as 100 fully transparent and 9999 fully opaque. Refresh Group Policy on the session hosts or restart them, then connect with a supported client. Existing sessions must sign out and back in.

## Find the session behind a QR code

In Azure Virtual Desktop Insights open the **Connection Diagnostics** tab and look for the connection ID in the list under the connection success chart. Alternatively, in the Log Analytics workspace connected to your environment run:

```kusto
WVDConnections
| where CorrelationId contains "<connection ID>"
```

The connection ID appears as CorrelationId, and a partial value works.

## Pitfalls

This section is my advice, not Microsoft guidance.

- A mixed estate of clients will break for those that do not support the feature, so check client versions first. Learn says unsupported clients fail with a non-specific error.
- Because RemoteApp is not watermarked, do not rely on the feature to protect published apps.
- Test opacity and the other values in a pilot. Learn also suggests trying different opacity values.

## Add screen capture protection

Learn presents screen capture protection (SCP) as the companion to watermarking. When enabled, remote content is blocked in screenshots and screen sharing, for Azure Virtual Desktop VMs and Windows 365 Cloud PCs. Learn warns that it does not provide DRM-level protection and is not a substitute for DRM solutions. Users can still share their desktop in supported collaboration tools such as Microsoft Teams, and unsupported configurations may show protected content as a black screen.

There are two modes. **Block screen capture on client** prevents capture from the local device of applications running in the session. **Block screen capture on client and server** also prevents tools inside the VM or Cloud PC from capturing the screen.

Prerequisites include VMs on Windows 11 22H2 or later, or Windows 10 22H2 or later. In Intune the setting sits in the same settings catalog folder as watermarking, under **Azure Virtual Desktop**, as **Enable screen capture protection**. The mode is set with the **Screen Capture Protection Options (Device)** toggle: off for Block screen capture on client, on for Block screen capture on client and server. In Group Policy the same setting sits under Azure Virtual Desktop in Computer Configuration, Policies, Administrative Templates, with a drop-down for the two modes. Restart the session hosts after the policy applies, and note that changes apply only to new sessions.

For iOS, iPadOS, Android and web clients, Learn uses Intune app protection policies and a Conditional Access policy that requires an app protection policy. It advises against adding Require device to be marked as compliant to that policy. Learn's screen capture protection page also recommends disabling clipboard, drive and printer redirection.

## Not covered

The watermarking page gives no registry values and no session host OS requirements, and neither page covers licensing.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [Watermarking in Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/watermarking)
- [Screen capture protection in Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/screen-capture-protection)
