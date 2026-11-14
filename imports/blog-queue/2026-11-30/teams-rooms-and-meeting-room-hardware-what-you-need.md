---
title: "Teams Rooms and Meeting Room Hardware: What You Need"
summary: "What a Microsoft Teams Rooms system consists of, how Windows and Android systems differ, when Teams panels make sense and how Basic and Pro licensing works, based on Microsoft Learn documentation."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [teams-rooms, teams-certified-devices, teams-admin-center]
keypoints:
  - "A Teams Rooms system consists of a touchscreen console, a compute module, the Teams Rooms app, peripherals (camera, microphone, speaker) and up to two front-of-room screens."
  - "Only devices certified for Microsoft Teams are listed by Microsoft, with separate lists for Teams Rooms on Windows, Teams Rooms on Android, panels, phones and displays."
  - "Teams Rooms Basic is free for up to 25 licenses and covers Teams Rooms systems only. Teams Rooms Pro is paid and also covers Teams panels."
  - "Windows systems run Windows 11 and Android systems run Android 10 or later. Most core features are shared, but several advanced features exist only on Windows."
  - "A Teams panel mounts outside a room and handles booking and check-in. It needs Power over Ethernet and a Pro or Shared Device license."
faq:
  - q: "What hardware does a Teams Rooms system include?"
    a: "Microsoft Learn lists a touchscreen console, a compute module, the Microsoft Teams Rooms application, peripherals such as camera, microphone and speaker, front-of-room screens (maximum of two) and an HDMI input."
  - q: "Do I need a license for every meeting room?"
    a: "Yes. According to Microsoft Learn, each meeting room needs a Teams Rooms license, either Basic or Pro. Enterprise per-user Microsoft 365 suite licenses are not authorized on shared meeting devices."
  - q: "What is the difference between Teams Rooms Basic and Pro?"
    a: "Basic is free, limited to 25 licenses and covers scheduling, joining, content sharing and basic management. Pro is paid, has no cap and adds features such as meeting chat, multi-camera support, Phone System and Conditional Access, per Microsoft Learn."
  - q: "Can I buy any camera or speaker for a Teams Rooms system?"
    a: "Microsoft maintains lists of certified systems and peripherals. Its certification program tests audio and video quality, user interface, device management and security, and only devices that pass receive the Certified for Microsoft Teams designation."
  - q: "What does a Teams panel do?"
    a: "Microsoft Learn says a Teams panel lets people find, book and manage a space. Users can reserve a room, check in, release it early or extend the reservation. Installation needs Power over Ethernet and a network connection."
---

A Teams Rooms setup needs a certified Teams Rooms system, a room license, a resource account for the room and a room that suits the equipment. The system itself bundles a touchscreen console, a compute module, the Teams Rooms app, a camera, a microphone, a speaker and one or two front-of-room screens. Which platform and license you pick depends on room count and features.

## What a Teams Rooms system consists of

Microsoft's planning guide lists these key components:

- **Touchscreen console** for joining and controlling meetings
- **Compute module** that runs the Microsoft Teams Rooms application
- **Microsoft Teams Rooms application**
- **Peripherals:** camera, microphone and speaker
- **Front-of-room screens:** a maximum of two
- **HDMI input** for connecting a laptop

You do not have to choose each part yourself. Microsoft's certification program tests personal and shared devices against specifications for audio and video quality, user interface, device management and security. Only devices that pass receive the designation **Certified for Microsoft Teams**.

Microsoft keeps separate certified lists:

| Category | Where listed |
|---|---|
| Teams Rooms on Windows | Certified hardware list for Windows |
| Teams Rooms on Android | Certified hardware list for Android |
| Teams panels | Certified panels list |
| Teams phones | Certified phones list |
| Teams displays | Certified displays list |
| Personal devices | USB devices list |

## Windows or Android

Microsoft's feature comparison says core functionality, including audio and video, one-touch join and inclusive features, is available on all platforms. Both platforms also support proximity join, QR code meeting join, live captions, PowerPoint Live and digital signage.

| | Teams Rooms on Windows | Teams Rooms on Android |
|---|---|---|
| Operating system | Windows 11 | Android 10 or later |
| Exclusive examples | Front Row, breakout rooms, multi-camera send, Spatial Audio, coordinated meetings, Miracast, Microsoft Defender for Endpoint, tenant restrictions, Autopilot | Meeting controls on touch-enabled front-of-room displays, local pan-tilt-zoom (PTZ) controls |
| Cross-cloud meeting join | Available | Limited |
| Front of room | 21:9 and single display only options | Not listed |

The page also notes that features may roll out on Windows before Android, and advises confirming support with your hardware vendor. If you rely on one of the Windows-only items, such as tenant restrictions or Defender for Endpoint, check that list first.

## Licensing

Each meeting room needs a Teams Rooms license. Microsoft Learn describes two:

| | Teams Rooms Basic | Teams Rooms Pro |
|---|---|---|
| Maximum licenses | 25 | Unlimited |
| Cost | No charge, but payment details are required in the Microsoft 365 admin center | Paid |
| Devices covered | Teams Rooms systems only, not Teams panels | Teams Rooms systems and Teams panels |
| Purchase | Microsoft 365 admin center only | Admin center or other sales channels |

**Basic** includes scheduling, joining meetings, content sharing, collaborative whiteboarding and basic security and management. It is the default for organizations that buy a certified system, and systems beyond 25 need Pro.

**Pro** adds, among others: meeting chat, front row, large gallery (up to 50 videos), dual screen support, Microsoft 365 Phone System, end-to-end call encryption, speaker identification, multi-camera support, AI noise suppression, people counting, Microsoft Entra Conditional Access policies and richer device management such as remote configuration, device history and ITSM integration.

Per-room rules matter:

- Basic and Pro licenses are intended for a single room. Signing in to more than one system in a room with the same resource account needs a Pro license.
- Using one account across devices in different rooms violates the license terms.
- Enterprise per-user Microsoft 365 suite licenses are not authorized on shared meeting devices.
- Teams Shared Space licenses are not supported on Teams Rooms devices.
- Legacy Standard and Premium licenses stay valid until they expire and do not convert automatically. Licensing status can take up to 48 hours to update after a switch.
- Microsoft recommends avoiding OneDrive for Business licenses on IT-managed room accounts, so recordings and transcripts are not saved to the room's OneDrive.

## Teams panels

A Teams panel is mounted outside a room. According to Microsoft Learn, users tap **Reserve** to book, can scan a QR code to book a scheduled meeting, check in so unused rooms are released, and release early or extend a reservation. Panels also show whether a room is in use or full.

Requirements: Power over Ethernet and a network connection, with IT installing the panel. A room device is not required, so panels work in spaces without equipment. For licenses, use Teams Rooms Pro where the room already has a Teams Rooms or Surface Hub device. Use a Teams Shared Device license for spaces without a room device. The Basic license does not cover panels.

## Room planning

Microsoft's planning guide includes a sample inventory with these size categories:

| Room | Dimensions | People |
|---|---|---|
| Focus | 10 ft by 9 ft | 2 to 4 |
| Small | 16 ft by 16 ft | 4 to 6 |
| Medium | 18 ft by 20 ft | 6 to 12 |
| Large | 15 ft by 32 ft | 12 to 16 |

Treat these as sample values from a template, not hard rules. The guide says to select devices based on room size, layout and the capabilities you want. It also recommends a room assessment covering acoustics, layout (chairs must not block the camera), echo, air-conditioning noise and power for screens and devices.

## Checklist before buying

1. List rooms by size and how they are used.
2. Choose Windows or Android after checking the feature comparison.
3. Select hardware from the certified lists.
4. Decide Basic or Pro. More than 25 systems, or the need for Pro features, means Pro.
5. Plan resource accounts, which the guide assigns to the IT project team.
6. Check network readiness, and Power over Ethernet if you add panels.
7. Plan management in the Teams admin center or the Pro Management portal.

## Common mistakes

- **One account for several rooms.** That violates the license terms.
- **Counting on Basic for panels.** Basic does not cover Teams panels.
- **Skipping the room assessment.** Acoustics and camera sightlines affect meetings as much as the hardware.
- **Using per-user licenses on a room device.** They are not authorized on shared meeting devices.

## Related

- [Teams Rooms](https://www.m365.fm/entity/teams-rooms/)
- [Teams certified devices](https://www.m365.fm/entity/teams-certified-devices/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)

## Sources

- [Microsoft Learn: Plan Microsoft Teams Rooms](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-plan)
- [Microsoft Learn: Teams Rooms licensing](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-licensing)
- [Microsoft Learn: Teams Rooms and Devices feature comparison](https://learn.microsoft.com/en-us/microsoftteams/rooms/teams-devices-feature-comparison)
- [Microsoft Learn: Overview of Teams panels](https://learn.microsoft.com/en-us/microsoftteams/devices/overview-teams-panels)
- [Microsoft Learn: Teams device certification](https://learn.microsoft.com/en-us/microsoftteams/devices/teams-ip-phones)
