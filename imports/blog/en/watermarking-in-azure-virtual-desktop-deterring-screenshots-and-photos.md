---
title: "Watermarking in Azure Virtual Desktop: deterring screenshots and photos"
summary: "Watermarking overlays QR codes on Azure Virtual Desktop remote desktops. Each code carries a Connection ID or Device ID, so it deters photos of the screen and lets an admin trace a leaked image back to a session, but it does not block capture."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-watermarking, azure-virtual-desktop]
keypoints:
  - "Watermarking shows QR codes across a remote desktop. Each code contains the Connection ID (default) or the Device ID, which an admin can look up to trace the session."
  - "It deters and traces. It does not block screenshots or photos; blocking screen capture on the client is the job of screen capture protection, and Learn's screen capture protection page suggests enabling watermarking alongside it."
  - "It applies to remote desktops only. RemoteApp sessions and direct connections with mstsc.exe are allowed without a watermark."
  - "Once enabled on a session host, only clients that support watermarking can connect; an unsupported client gets an error message that is not specific."
  - "It is configured on the session hosts with Intune or Group Policy, and the lookup of a code uses Azure Virtual Desktop Insights or Log Analytics."
faq:
  - q: "Does watermarking stop someone from taking a screenshot or photo?"
    a: "No. Learn says watermarking, alongside screen capture protection, helps prevent sensitive information from being captured on client endpoints, and the screen capture protection page suggests it for discouraging methods such as taking a photo of a screen with a physical camera. The QR code stays visible in the image and lets an admin trace the session. Blocking screenshots and screen sharing on the client is done by screen capture protection, which is a separate feature."
  - q: "What is in the QR code?"
    a: "The Connection ID of the remote session (the default) or the Device ID. Learn says to select Device ID only for session hosts in a personal host pool that are joined to Microsoft Entra ID or are Microsoft Entra hybrid joined."
  - q: "Are RemoteApp sessions watermarked?"
    a: "No. Learn says watermarking is for remote desktops only. With RemoteApp it is not applied and the connection is allowed. The same applies to a direct connection to a session host with the Remote Desktop Connection app (mstsc.exe)."
---

Watermarking in [Azure Virtual Desktop](/entity/azure-virtual-desktop/) draws QR codes over a remote desktop session. Each code contains an identifier that an administrator can use to trace the session, so a photo or screenshot of the desktop can be tied back to a connection. It is a deterrent and a tracing aid, not a block: it does not stop anyone from capturing the screen. This article explains what [watermarking](/entity/avd-watermarking/) does, where it applies, which clients support it, and what it leaves uncovered. The step-by-step configuration is in the companion article on configuring QR-code watermarking for session hosts.

## What watermarking does

Learn's [Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking) page describes the feature as working alongside screen capture protection to help prevent sensitive information from being captured on client endpoints. When it is on, QR code watermarks appear as part of the remote desktop. The setting lives on the session hosts, which you manage with Microsoft Intune or Group Policy, and the client app enforces it. The page names Windows App and the Remote Desktop client as the enforcing clients.

The effect is visible. A user, or anyone looking over a shoulder, sees a grid of QR codes over the session; how opaque they are is a policy setting. If someone photographs the screen or shares a screenshot taken by other means, the codes are in the picture. An admin who receives that picture can read a code, find the connection it belongs to, and see which user was signed in. In our reading, that traceability is what gives the feature its deterrent value: a leaked image can be tied to a connection.

## What the code contains

The QR code holds one of two values, chosen in the policy:

- **Connection ID**, the default. It identifies one remote session. In Log Analytics the same value is the `CorrelationId` of a connection.
- **Device ID**. Learn says to select it only for session hosts that are in a personal host pool and joined to Microsoft Entra ID or Microsoft Entra hybrid joined.

The codes carry an identifier, not a user name. The link from identifier to person comes from your own monitoring data, which is why Learn lists [Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights) as a prerequisite. For pooled host pools this means keeping the default, Connection ID: Learn limits Device ID to personal host pools, and the page does not explain the reason for that limit.

## Where it applies and where it does not

Learn's Important box lists three boundaries that matter for planning:

1. **Unsupported clients cannot connect.** Once watermarking is enabled on a session host, only clients that support it can connect. An unsupported client fails with an error message that is not specific, so help-desk staff should know to check the client first when a user reports a generic failure after the policy goes live.
2. **RemoteApp is not covered.** Watermarking is for remote desktops only. With RemoteApp it is not applied and the connection is allowed.
3. **Direct RDP is not covered.** If someone connects to a session host directly, not through Azure Virtual Desktop, with `mstsc.exe`, no watermark is applied and the connection is allowed.

The second and third points decide whether the control is meaningful in your environment. A host pool that publishes only RemoteApps gets no watermark at all. A pool with open inbound RDP to the session hosts offers a path around it. Restricting direct access to the hosts is a network and access decision that lies outside this feature, but it determines whether the watermark can be bypassed.

## Supported clients

The page lists the clients that support watermarking:

| Client | Platform | Minimum version or note |
|---|---|---|
| Remote Desktop client | Windows Desktop, Windows 10 and later | 1.2.3317 or later |
| Remote Desktop client | Web browser | Listed without a version |
| Remote Desktop client | macOS | 10.9.5 or later |
| Remote Desktop client | iOS/iPadOS | 10.5.4 or later |
| [Windows App](/entity/windows-app/) | Windows, macOS, iOS and iPadOS, web browser | Listed without a version |
| Windows App | Android/Chrome OS | Marked as preview |

Windows App's own comparison page, [Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features), shows watermarking as supported on Windows, macOS, iOS/iPadOS, Android/Chrome OS and web browser for Azure Virtual Desktop. It does not repeat the preview label for Android/Chrome OS, so treat Android and ChromeOS as preview where the watermarking page says so, and confirm the current wording before you rely on it.

## Watermarking compared with screen capture protection

The two features are designed as a pair, and Learn's [screen capture protection](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection) page says so directly. That page says screen capture protection helps prevent capture using specific operating system features and APIs, and that it is not DRM-level protection. In a tip it recommends watermarking to discourage other methods, "such as taking a photo of a screen with a physical camera".

| | Screen capture protection | Watermarking |
|---|---|---|
| Purpose | Block capture through OS features and APIs | Deter capture and trace a session |
| What the user sees | Screenshots and screen sharing show blocked or hidden content | A grid of QR codes over the desktop |
| Covers a photo with a phone | No | Deters it and makes it traceable |
| Applies to RemoteApp | Learn lists RemoteApp sessions as supported on native clients | No |
| Configured on | Session hosts (Intune or Group Policy) for native clients; Intune MAM for mobile and web | Session hosts (Intune or Group Policy) |

Neither feature is a complete answer. The same Learn tip suggests disabling clipboard, drive and printer redirection to stop users from copying content out of the session. A reasonable layered setup for a sensitive pool is screen capture protection for the capture methods the operating system exposes, watermarking for everything it cannot stop, and redirection restrictions for copy and print. The companion articles on screen capture protection in this series cover the first layer in detail.

## Tracing a leaked image

The lookup is short. Read the code, then match its value to a connection:

- In **Azure Virtual Desktop Insights**, open the Connection Diagnostics tab and look for the Connection ID in the list of connections, which also shows first attempt time, user and number of attempts.
- In **Log Analytics**, query the `WVDConnections` table, filtering `CorrelationId` on the full or a partial value from the code.

Both routes depend on connection data reaching your workspace, which is why Insights is a prerequisite. If monitoring is not configured before an incident, the code in a leaked image has nothing to match against. The exact steps and the query are in the configuration article.

One practical limit is not addressed on the page: The watermarking page does not say how legible a code stays in a photograph taken from a distance, at an angle or at a given opacity. Take a real photo of a test session with the settings you plan to use and confirm that a phone camera can read the code.

## Tuning without losing the deterrent

Learn lists five options for the watermark: QR code bitmap scale factor, QR code bitmap opacity, the width and height of the grid box as a percentage of the QR code width, and the embedded content. The defaults are scale 4, opacity 2000, width 320 and height 180. Learn recommends trying different opacity values to find a balance between the readability of the remote session and being able to scan the QR code, while keeping the default values for the other parameters. The step-by-step values, including the ranges for each option, are in the configuration article.

## Before you roll it out

- **Pick the pools.** Use watermarking where a leaked image would matter and where users connect to full desktops. Skip it, or add other controls, where the pool publishes RemoteApps.
- **Inventory the clients.** Any user on a client that does not support it will fail to connect with a vague error. Check the minimum versions in the table above.
- **Turn on monitoring first.** Insights must be set up before the code is useful.
- **Tell users.** A visible QR grid will prompt questions. As our recommendation, involve privacy and HR stakeholders as your jurisdiction requires, since the identifiers link a session to a person through your logs.
- **Pair it.** Combine it with screen capture protection and redirection limits; none of them replaces the others.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features)
- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
