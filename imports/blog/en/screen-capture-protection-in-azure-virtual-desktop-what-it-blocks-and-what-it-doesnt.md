---
title: "Screen capture protection in Azure Virtual Desktop: what it blocks and what it doesn't"
summary: "Screen capture protection blocks remote content in screenshots and screen sharing on the client by using operating system features and APIs. It is not DRM, it does not stop a photo of the screen, and it does not control copy and paste or file transfer."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-screen-capture-protection, azure-virtual-desktop]
keypoints:
  - "Screen capture protection blocks or hides remote content in local screenshots and screen sharing. Learn says it uses standard OS features and APIs, provides no DRM-level protection and is not a substitute for DRM."
  - "The session host setting has two values: Block screen capture on client, and Block screen capture on client and server. Only the second also stops tools and services inside the VM or Cloud PC from capturing the screen."
  - "Native Windows and macOS clients follow the session host setting. Android, iOS/iPadOS and web connections additionally need an Intune MAM app protection policy and a Conditional Access policy, and a client without them is blocked."
  - "It does not stop a photo of the monitor or copying through the clipboard, drives and printers. Learn points to watermarking for the photo and to disabling redirection for copying. Keyloggers on the endpoint are a different problem, covered by Input protection (preview)."
  - "Learn warns that Teams screen sharing can show black content in unsupported configurations, and lists known limitations for macOS, where some native apps may not respect the protection."
faq:
  - q: "Does screen capture protection stop someone from photographing the screen?"
    a: "No. Learn says the feature blocks capture through standard OS features and APIs and does not provide DRM-level protection. To discourage photos of the screen, Learn suggests watermarking, which shows a QR code that lets an administrator trace the session. Watermarking deters rather than blocks."
  - q: "Is a user who shares their screen in Teams blocked?"
    a: "Learn says users can keep sharing their remote desktop or individual apps in supported collaboration experiences such as Teams when a supported client configuration is used. With unsupported configurations the protected content might appear as a black screen during sharing. On macOS, Learn says protection might make shared windows appear blank, and that protection might need to be temporarily disabled on the device if Teams-based collaboration is required."
  - q: "Do I need Intune to use screen capture protection?"
    a: "Not for the MAM part on native Windows and macOS clients, but the session hosts still need the setting, either through an Intune device configuration profile or through Group Policy. Learn's Group Policy steps are written for an Active Directory domain, so hosts without a domain use the Intune profile (our reading). For Android, iOS/iPadOS and web connections, Learn describes Intune MAM app protection policies plus a Conditional Access policy as the supported model, so Intune is needed for those clients."
---

Screen capture protection tells the connecting client to block remote content in screenshots and screen sharing, using operating system features and APIs. It does not stop a camera pointed at the monitor, it is not digital rights management (DRM), and it does not control what a user can copy out of the session. This article explains what the feature covers, where it stops, and which gaps need other controls. The steps to turn it on are in the companion how-to article for Group Policy and Intune.

[Screen capture protection](/entity/avd-screen-capture-protection/) applies to [Azure Virtual Desktop](/entity/azure-virtual-desktop/) virtual machines and to [Windows 365](/entity/windows-365/) Cloud PCs, according to the Learn page. The page, last updated 8 October 2026, carries no preview label. Learn's What's new for Azure Virtual Desktop lists screen capture protection for web connections as now available in its August 2026 section, so check the current page before you rely on a particular client.

## What it blocks

When protection is on, Learn says remote content is automatically blocked in screenshots and screen sharing. In practice that means:

- A screenshot taken on the local device shows blocked or hidden content where the remote session would be.
- A screen share of the local device, for example in a Teams call, does not show the protected remote content.
- With the second session host setting (below), tools and services running inside the VM or Cloud PC cannot capture the screen either.

Learn's own test for a deployment is to connect to a new session, take a screenshot or share your screen from the local device, and confirm that the content is blocked or hidden. Its configuration steps say to restart the VMs or Cloud PCs once the policy applies, and the verification steps say you must sign out of any existing session and sign back in for a change to take effect. Users must connect from a supported device, otherwise they see an error saying screen capture protection is enabled.

## Two modes on the session host

The session host policy has two values:

| Value | What it prevents |
|---|---|
| Block screen capture on client | Capture from the local device of applications running in the remote session. |
| Block screen capture on client and server | The same, and also tools and services inside the VM or Cloud PC capturing the screen. |

The second value matters if the threat is not only the endpoint but also a process on the session host, for example a screenshot tool a user starts inside the session. Learn's verification steps include trying exactly that on Windows and macOS clients when the second value is set. Learn does not say which value to pick for a given risk, so treat the choice as a policy decision and test it on one host first.

## What each client gets

Where enforcement happens depends on the client. Learn's tables, simplified:

| Client | Session host policy set | Intune MAM policy only |
|---|---|---|
| Windows | Connects, capture blocked | Connects, capture not blocked |
| macOS | Connects, capture blocked | Connects, capture not blocked |
| iOS/iPadOS | Connects only if a MAM policy blocks screen capture; then blocked | Connects, capture blocked |
| Android | Connects only if a MAM policy blocks screen capture; then blocked | Connects, capture blocked |
| Web | Connects only in Microsoft Edge for Business on Windows with a MAM policy; then blocked | Connects, capture blocked |

Read the right-hand column carefully. If you configure only the MAM policy and nothing on the session hosts, Learn's table shows capture not blocked on native Windows and macOS clients; Learn's deployment patterns say those clients enforce the session host policy. The mobile and web clients are protected by the MAM policy, but that is a client-side control, not a server-side one: Learn says it does not prevent tools and services inside the VM or Cloud PC from capturing the screen.

Version floors from Learn: Windows App on Windows and on macOS has no minimum ("Any"), Windows App on iOS/iPadOS 11.2.4, Windows App on Android 11.0.0.94, and Microsoft Edge for Business on Windows, 134.0.3124.51 or later, for web (147 or later on devices managed by a different organization). The Remote Desktop client is listed as a supported native client too, with 1.2.1672 as the minimum on Windows (desktop client) and 10.7.0 on macOS. Learn lists no web path for browsers on macOS or Linux. The session host itself needs Windows 11 or Windows 10, version 22H2 or later. On Windows, [RemoteApp](/entity/avd-remoteapp/) sessions also need a local device running Windows 11, version 22H2 or later. Android means Windows App on Android, not ChromeOS or Meta Quest, because Intune MAM is not supported there.

The mobile and web paths use two policies: an Intune MAM app protection policy that blocks screen capture (set **Screen capture** to **Block** on Android and iOS/iPadOS; for web, an Edge policy restricting copy and paste to org sources and destinations) and a [Conditional Access](/entity/conditional-access/) policy that requires an app protection policy. Learn says Conditional Access itself does not block screen capture; it only makes sure the protected app is the one connecting. For the web path, the Edge app protection policy uses the Windows platform and the setting **Allow cut, copy, and paste for** = **Org data destinations and org data sources**, which Learn says activates protection across the whole Edge work profile, including all tabs, not only the Windows App tab. Learn also says to create the web Conditional Access policy (Windows platform, Browser client app) separately from the Android and iOS/iPadOS policy, and not to add **Require device to be marked as compliant** to it. The web path has extra limits too: it does not support Windows devices managed by the same tenant, which should connect with the native [Windows App](/entity/windows-app/) instead.

## What it does not block

Learn is direct about the limit: screen capture protection "doesn't provide Digital Rights Management (DRM)-level protection" and is not a substitute for DRM solutions. Several gaps follow.

**A photo of the screen.** The feature works through OS capture APIs, so a phone camera is outside its reach. Learn suggests [watermarking](/entity/avd-watermarking/) for this case: an admin can use a QR code shown in the session to trace it. Watermarking discourages; it does not prevent.

**Copying content out through redirection.** Learn's tip says to disable clipboard, drive and printer redirection as well, because disabling redirection helps prevent users from copying content from the remote session. Learn describes this as an additional step, so the redirection settings on the [host pool](/entity/avd-host-pool/) need their own review. Per Learn's What's new for July 2025, clipboard, drive, USB and printer redirection are disabled by default for newly created host pools, so check older pools in particular.

**Deliberate disclosure.** Learn recommends using screen capture protection as part of a defense-in-depth strategy that includes Conditional Access, data loss prevention and endpoint management. The Learn page does not discuss typing out data, reading it aloud or exporting it through an allowed application; our reading is that the feature does not address these.

**A connection from a client that cannot comply.** This is a blocking behavior rather than a gap, but it affects planning: once the session host setting is on, a client that cannot meet it is refused with an error. Learn applies the setting to the computers you target, either through an Intune device configuration profile assigned to a group of the VMs or Cloud PCs, or through Group Policy linked to a security group or organizational unit that contains the devices. Which session hosts get the setting is therefore decided by that assignment. Mobile and web clients are the exception: with the setting on, they connect only if an Intune MAM policy that blocks screen capture applies to the user's app, which Learn calls hybrid enforcement.

**Capture malware on the endpoint and keyloggers.** Screen capture protection is a separate feature from Input and Output Protection, which Learn describes as two independently configured components for Windows 365 Cloud PCs and Azure Virtual Desktop session hosts. [Display protection](/entity/avd-display-protection/) targets unauthorized screen capture and recording on the endpoint device and needs an updated Windows App there. Input protection addresses keyloggers with a kernel-level driver installed through an MSI on the endpoint; Learn marks it as public preview. For Display protection the Learn sources differ: What's new for Azure Virtual Desktop lists "Display Protection for Azure Virtual Desktop (Public Preview)" in its September 2026 section, while the Display protection feature page carries no preview label for it. Confirm the current status before you plan around it. Learn says the two components have separate availability and supported configurations, so check their own pages before comparing them with screen capture protection. Screen capture protection does not cover keystrokes at all.

## Known limits to plan for

- **Teams sharing.** Users can keep sharing their remote desktop or apps in Teams when supported client configurations are used. With unsupported configurations, protected content might appear black while sharing. Learn links to the Teams page on screen capture protection compatibility for current requirements.
- **macOS.** Learn calls out two limits: screen capture protection might interfere with Teams screen sharing, so shared windows can appear blank, and some native apps might not fully respect the protection because of macOS API restrictions. For highly sensitive content, Learn recommends Windows endpoints for full enforcement.
- **Hybrid enforcement on mobile.** With the session host setting on, Android and iOS/iPadOS connections are blocked if the MAM policy is not applied or does not block screen capture. Learn's remedy: confirm assignment, restart or sign out and back in to Windows App, and check the app version.
- **Web profile requirements.** The user must access Windows App from an Edge work profile signed in with the organization's work account. Signing in to the Windows App website alone is not enough. Learn adds two limits: if device-level Endpoint DLP is enabled, the app protection policy cannot be applied to the Edge work profile until the organization that manages the device configures the `MAMWithDeviceDLPEnabled` policy for Edge, and in Edge 149 and later a Microsoft Defender for Cloud Apps DLP policy, if one applies, is enforced instead of the app protection policy.

## How to scope it

A practical order of questions, based on the Learn tables:

1. Which clients connect to this host pool? If the answer includes Windows and macOS only, a session host policy is enough. If it includes mobile or web, add MAM and Conditional Access; for web, that means Edge for Business on Windows only.
2. Is the threat limited to the endpoint, or can a user run capture tools inside the session? That decides between the two session host values.
3. Do Teams screen sharing and macOS collaboration matter for these users? Pilot first, because Learn lists both as known limits.
4. What other path would the same user use to take data out? Add watermarking and disable the redirections that are not needed.
5. Is the data sensitive enough that a screenshot block is not the real control? Learn says to treat it as one layer.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Input and Output Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-cloud-io-protection)
- [Microsoft Learn: Display Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/display-protection)
