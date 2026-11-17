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
  - "It does not stop a photo of the monitor, deliberate disclosure, or copying through the clipboard, drives and printers. Learn points to watermarking and to disabling redirection for those cases."
  - "Learn lists known limits: Teams screen sharing can show black content in unsupported configurations, and on macOS some native apps may not respect the protection."
faq:
  - q: "Does screen capture protection stop someone from photographing the screen?"
    a: "No. Learn says the feature blocks capture through standard OS features and APIs and does not provide DRM-level protection. To discourage photos of the screen, Learn suggests watermarking, which shows a QR code that lets an administrator trace the session. Watermarking deters rather than blocks."
  - q: "Is a user who shares their screen in Teams blocked?"
    a: "Learn says users can keep sharing their remote desktop or individual apps in supported collaboration experiences such as Teams when a supported client configuration is used. With unsupported configurations the protected content might appear as a black screen during sharing. On macOS, Learn says protection might make shared windows appear blank, and that it may need to be disabled on the device if Teams-based collaboration is required."
  - q: "Do I need Intune to use screen capture protection?"
    a: "Not for native Windows and macOS clients: you can set it with Group Policy on the session hosts. For Android, iOS/iPadOS and web connections, Learn describes Intune MAM app protection policies plus a Conditional Access policy as the supported model, so Intune is needed for those clients."
---

Screen capture protection tells the connecting client to block remote content in screenshots and screen sharing, using operating system features and APIs. It does not stop a camera pointed at the monitor, it is not digital rights management (DRM), and it does not control what a user can copy out of the session. This article explains what the feature covers, where it stops, and which gaps need other controls. The steps to turn it on are in the companion how-to article for Group Policy and Intune.

[Screen capture protection](/entity/avd-screen-capture-protection/) applies to [Azure Virtual Desktop](/entity/azure-virtual-desktop/) virtual machines and to [Windows 365](/entity/windows-365/) Cloud PCs, according to the Learn page. The page, last updated 8 October 2026, carries no preview label. Learn's What's new for Azure Virtual Desktop lists screen capture protection for web connections as now available in its August 2026 section, so check the current page before you rely on a particular client.

## What it blocks

When protection is on, Learn says remote content is automatically blocked in screenshots and screen sharing. In practice that means:

- A screenshot taken on the local device shows blocked or hidden content where the remote session would be.
- A screen share of the local device, for example in a Teams call, does not show the protected remote content.
- With the second session host setting (below), tools and services running inside the VM or Cloud PC cannot capture the screen either.

Learn's own test for a deployment is to connect to a new session, take a screenshot or share your screen from the local device, and confirm that the content is blocked or hidden. It also says you must sign out of any existing session and sign back in for a change to take effect, and that users must connect from a supported device, otherwise they see an error saying screen capture protection is enabled.

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
| Web | Connects only in Microsoft Edge for Business with a MAM policy; then blocked | Connects, capture blocked |

Read the right-hand column carefully. If you configure only the MAM policy and nothing on the session hosts, Learn says native Windows and macOS clients are not protected, because those platforms are enforced from the session host policy. The mobile and web clients are protected by the MAM policy, but "the policy stops capture on the client" is not the same as a server-side control: Learn says client-side protection does not prevent tools and services inside the VM or Cloud PC from capturing the screen.

Version floors from Learn: Windows App on iOS/iPadOS 11.2.4, Windows App on Android 11.0.0.94, Microsoft Edge for Business 134.0.3124.51 or later for web (147 or later on devices managed by a different organization). The session host itself needs Windows 11 or Windows 10, version 22H2 or later. On Windows, [RemoteApp](/entity/avd-remoteapp/) sessions also need a local device running Windows 11, version 22H2 or later. Android means Windows App on Android, not ChromeOS or Meta Quest, because Intune MAM is not supported there.

The mobile and web paths use two policies: an Intune MAM app protection policy that blocks screen capture (set **Screen capture** to **Block** on Android and iOS/iPadOS; for web, an Edge policy restricting copy and paste to org sources and destinations) and a [Conditional Access](/entity/conditional-access/) policy that requires an app protection policy. Learn says Conditional Access itself does not block screen capture; it only makes sure the protected app is the one connecting. The web path has extra limits, for example it does not support Windows devices managed by the same tenant, which should connect with the native [Windows App](/entity/windows-app/) instead.

## What it does not block

Learn is direct about the limit: screen capture protection "doesn't provide Digital Rights Management (DRM)-level protection" and is not a substitute for DRM solutions. Several gaps follow.

**A photo of the screen.** The feature works through OS capture APIs, so a phone camera is outside its reach. Learn suggests [watermarking](/entity/avd-watermarking/) for this case: an admin can use a QR code shown in the session to trace it. Watermarking discourages; it does not prevent.

**Copying content out through redirection.** Learn's tip says to disable clipboard, drive and printer redirection as well, because disabling redirection helps prevent users from copying content from the remote session. These controls are RDP properties on the [host pool](/entity/avd-host-pool/); the screen capture setting does not touch them.

**Deliberate disclosure.** Typing out data, reading it aloud, or exporting it through an allowed application is not covered. Learn recommends using screen capture protection as part of a defense-in-depth strategy that includes Conditional Access, data loss prevention and endpoint management.

**Unprotected clients for server-side capture.** As shown above, a mobile or web client protected only by MAM does not stop capture tools inside the session host.

**A connection from a client that cannot comply.** This is a blocking behavior rather than a gap, but it affects planning: once the session host setting is on, a client that cannot meet it is refused with an error. The feature is therefore all-or-nothing per VM or Cloud PC, and Learn describes the setting on the session hosts, not per user. If two groups need different treatment, our reading is that they need separate host pools, but Learn does not state this.

## Known limits to plan for

- **Teams sharing.** Users can keep sharing their remote desktop or apps in Teams when supported client configurations are used. With unsupported configurations, protected content might appear black while sharing. Learn links to the Teams page on screen capture protection compatibility for current requirements.
- **macOS.** Learn calls out two limits: screen capture protection might interfere with Teams screen sharing, so shared windows can appear blank, and some native apps might not fully respect the protection because of macOS API restrictions. For highly sensitive content, Learn recommends Windows endpoints for full enforcement.
- **Hybrid enforcement on mobile.** The connection is blocked if the MAM policy does not block screen capture, so a user whose app protection policy has not yet synced can be refused. Learn's remedy: confirm assignment, restart or sign out and back in to Windows App, and check the app version.
- **Web profile requirements.** The user must access Windows App from an Edge work profile signed in with the organization's work account. Signing in to the Windows App website alone is not enough.

## How to scope it

A practical order of questions, based on the Learn tables:

1. Which clients connect to this host pool? If the answer includes Windows and macOS only, a session host policy is enough. If it includes mobile or web, add MAM and Conditional Access.
2. Is the threat limited to the endpoint, or can a user run capture tools inside the session? That decides between the two session host values.
3. Do Teams screen sharing and macOS collaboration matter for these users? Pilot first, because Learn lists both as known limits.
4. What other path would the same user use to take data out? Add watermarking and disable the redirections that are not needed.
5. Is the data sensitive enough that a screenshot block is not the real control? Learn says to treat it as one layer.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Add the administrative template for Azure Virtual Desktop to Group Policy](https://learn.microsoft.com/en-us/azure/virtual-desktop/administrative-template)
