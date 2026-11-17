---
title: "Teams media optimization for Azure Virtual Desktop: how the offload works"
summary: "With media optimization, Teams keeps running on the session host while the audio and video of calls and meetings are processed on the user's local device. Microsoft now offers two engines for this, SlimCore and the older WebRTC Redirector Service, and the WebRTC path has fixed end dates on Windows endpoints."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-teams-media-optimization, azure-virtual-desktop]
keypoints:
  - "Teams itself runs on the session host. With media optimization, calling and meeting media is redirected to the local device, using either SlimCore or the WebRTC Redirector Service. Without it, Teams falls back to server-side rendering."
  - "For Windows endpoints, Learn says WebRTC-based optimization lost official support on 1 October 2026 and stops working on 1 April 2027, when SlimCore-based optimization is enforced."
  - "On the session host you set the IsWVDEnvironment registry value to 1 and, for new Teams, install the WebRTC Redirector Service as a fallback. On the SlimCore path, the plugin comes with the Windows App and the media engine downloads from Microsoft's CDN."
  - "Learn's pages disagree on the minimum Windows App version for SlimCore (1.3.252, 2.0.352.0 and 2.0.360.0), and the SlimCore page names higher minimums for the split package (2.0.550.0) and published apps (2.0.964.0). Choose the baseline by the features you use."
  - "You confirm the result in Teams under Settings and About: 'AVD SlimCore Media Optimized' means SlimCore, 'AVD Media Optimized' means WebRTC."
faq:
  - q: "Does media optimization move the whole Teams app to the user's PC?"
    a: "No. Per Learn, Teams keeps running on the session host. Only calling and meeting functionality is redirected to the local device. On the SlimCore path, msteams.exe in the virtual desktop talks over a bidirectional channel to the media engine on the endpoint."
  - q: "Do I still need the WebRTC Redirector Service if I use SlimCore?"
    a: "Learn's Teams on Azure Virtual Desktop page says new Teams can use either engine and advises installing the WebRTC Redirector Service as well, so users can fall back to WebRTC when they roam to a device that does not support the new architecture. Learn's SlimCore page says the plugin comes with the Windows App, while the media engine is downloaded from Microsoft's CDN."
  - q: "What happens if optimization is not active?"
    a: "Teams still works, but the media is handled on the session host (server-side rendering). The Teams for VDI page says this degrades the user experience. The SlimCore page says the VDI status indicator in Teams then shows a warning, offers an Optimize virtual desktop and restart repair, and shows an error code if that does not help."
---

Media optimization keeps the Teams app on the Azure Virtual Desktop session host but moves the audio and video work of calls and meetings to the user's local device. Microsoft Learn names two engines for that: SlimCore, a media engine on the endpoint, and the older WebRTC Redirector Service. On Windows endpoints the WebRTC path loses support on fixed dates, so most new designs should start from SlimCore.

This article explains the architecture and the decisions around it. Profile settings for new Teams and call troubleshooting are separate topics. Version numbers below come from Learn pages that do not agree with each other in places, and the article says where.

## What is offloaded and what is not

Learn's [Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd) page says Teams chat and collaboration work on all platforms. With media optimization, calling and meetings are redirected to the local device when the user connects with the Windows App or the Remote Desktop client on a supported platform. On other platforms Teams works without optimized calls and meetings.

So the split looks like this:

- **On the session host**: the Teams app (`msteams.exe`), which supports chat and collaboration.
- **On the endpoint**: the calling and meeting media. On the SlimCore path, the media engine `MsTeamsVdi.exe` on the endpoint executes all network activity of a call.

Without optimization, the media work happens on the [session host](/entity/avd-session-host/), and the Teams for VDI page describes the result as server-side rendering with a degraded user experience.

This is a different feature from [multimedia redirection](/entity/avd-multimedia-redirection/), which offloads browser video playback and WebRTC audio calls from Edge or Chrome. Media optimization is a separate feature for the Teams app itself.

## Two engines: SlimCore and WebRTC

Learn says redirection uses one extra component, either SlimCore or the WebRTC Redirector Service. New Teams can use either one. Classic Teams uses the WebRTC Redirector Service.

| | SlimCore | WebRTC Redirector Service |
|---|---|---|
| Where it runs | Media engine on the endpoint (`MsTeamsVdi.exe`) | Redirector service on the session host, working with the client |
| Delivered with | Plugin with the Windows App; engine downloaded from Microsoft's CDN | MSI installed on each session host |
| 1080p | Yes | No |
| Hardware acceleration on the endpoint | Yes (DirectX 9 or later, WDDM 2.0 or later on Windows 10) | No |
| Quality of Service | Yes | No |
| Gallery view 3x3 and 7x7 | Yes | No |
| Presenter mode, user-uploaded backgrounds | Yes | No |
| Noise suppression | Yes | Yes (AVD) |

The feature rows are from the SlimCore page ("New VDI solution for Teams"). The Teams on Azure Virtual Desktop page says more simply that SlimCore's components come bundled with new Teams and the client; the SlimCore page gives the detail. The same page lists more differences, so read its matrix before you promise a feature to users.

### SlimCore components

According to the SlimCore page, the architecture has four parts:

1. **vdiBridge**, a server-side virtual channel module that ships with Teams.
2. A **custom virtual channel** owned by Teams, with a stable API.
3. A small client **plugin** (about 600 KB). For Azure Virtual Desktop and Windows 365 it is `MsTeamsPluginAvd.dll`, bundled with the Windows App. It also downloads and cleans up SlimCore.
4. **SlimCore** itself, the media engine (about 50 MB). It is an MSIX package that updates with each Teams version and is hosted on Microsoft's public CDN.

Learn also describes a split package for the 64-bit installer: a small host package (about 100 KB) and a framework package (about 60 MB) that holds the real-time media libraries. Multiple framework versions can sit side by side, and Microsoft stores up to 12 of them so that persistent and non-persistent pools can both find a matching version.

### How a call flows with SlimCore

The SlimCore page walks through the sequence:

1. The user starts Teams, which authenticates to Teams services and receives tenant policies.
2. Teams detects a virtual desktop and starts the internal vdiBridge service, which opens a secure virtual channel.
3. The remote display protocol carries the request to the Windows App, which already loaded the plugin.
4. The client starts `MsTeamsVdi.exe`, the SlimCore media engine. All network activity of the call runs in this process.
5. On a call, the engine signals through Teams services and, after connectivity checks, media (SRTP) flows directly between `MsTeamsVdi.exe` and the other peer, or Transport Relays and conference servers.

Our reading, not a Learn statement: because `MsTeamsVdi.exe` makes the connections, the call traffic leaves from the user's endpoint network, so the network checks belong there and not on the session host's subnet.

## The timeline for WebRTC-based optimization

Learn's Teams for VDI page gives these dates:

| Endpoint | End of support | End of availability |
|---|---|---|
| Windows (Azure Virtual Desktop, Windows 365, Citrix) | 1 October 2026 | 1 April 2027 |
| macOS (Azure Virtual Desktop, Windows 365, Citrix) | 1 April 2027 | 1 September 2027 |

"End of support" means WebRTC keeps working but is not officially supported. At end of availability, WebRTC stops working and SlimCore-based optimization is enforced. If Teams cannot optimize, it falls back to server-side rendering. Linux thin clients are not affected by these dates; Learn says existing optimization continues there until Microsoft releases a Linux VDI solution.

The Teams on Azure Virtual Desktop page adds that classic Teams on Windows endpoints in VDI has the same two dates: end of support on 1 October 2026 and end of availability on 1 April 2027. The first date has passed; the second is 1 April 2027.

## What to set up

### Session hosts

Per Learn, a session host needs Windows 10 or 11 multi-session or Windows 10 or 11 Enterprise; N and KN SKUs are not supported. The latest Microsoft Visual C++ Redistributable must be present on session hosts and Windows clients. Then:

1. Set the registry value `IsWVDEnvironment` (DWORD, `1`) under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams` on each session host, creating the `Teams` key if needed. Learn gives `New-Item` and `New-ItemProperty` commands for this.
2. Install the Remote Desktop WebRTC Redirector Service MSI (`aka.ms/msrdcwebrtcsvc/msi`) on each session host. Learn advises this for new Teams too, as the fallback path. Its latest public version on the version history page is 1.56.2603.20001, published 17 September 2026.
3. Deploy Teams with bulk deployment. Learn's Teams for VDI page recommends `teamsbootstrapper.exe -p`, which Learn describes as always installing the latest Teams client.

Device redirection is not needed with media optimization. Without it, Learn suggests the RDP properties `audiocapturemode:i:1`, `audiomode:i:0` and `camerastoredirect:s:*` instead.

### Client devices

Learn's pages give different minimum Windows App versions for Windows endpoints, and some minimums depend on the feature:

| Page | Statement |
|---|---|
| Teams on Azure Virtual Desktop | SlimCore needs Windows App for Windows 1.3.252 or later, or Remote Desktop client 1.2.5405.0 or later |
| New VDI solution for Teams (SlimCore) | Minimum Windows App 2.0.352.0; Remote Desktop client "no longer supported" |
| Teams for VDI | Windows App 2.0.360.0; Remote Desktop client for Windows and Mac "no longer supported" |
| SlimCore page, split 64-bit package | Teams 25153.x.x.x and Windows App 2.0.550.0 (Remote Desktop client 1.2.6278) |
| SlimCore page, published apps (RemoteApp) | Windows App 2.0.964.0 and Teams 26043.2016.4478.2773 |

The SlimCore page also lists a minimum Teams version of 24193.1805.3040.8975 for Azure Virtual Desktop and Windows 365.

Our reading, not a Microsoft statement: there is no single number on these pages. The three general minimums rise from 1.3.252 to 2.0.360.0, but 2.0.360.0 is below the split-package and published-app minimums, so pick the baseline from the features you use, and plan around the Windows App rather than the Remote Desktop client. The SlimCore page also lists endpoint requirements: Windows 10 1809 as the SlimCore minimum, a CPU equivalent to an Intel Celeron at 1.10 GHz with four cores, and 4 GB of RAM. Group policies must not block MSIX installation, because the plugin stages SlimCore as an MSIX package. Learn names "Prevent non-admin users from installing packaged Windows apps" as one such policy.

For macOS, the SlimCore page asks for the non-Store Windows App (the MAU client). The Store version stays on WebRTC.

### Policy and verification

A Teams policy controls SlimCore use: `VDI2Optimization` in `CsTeamsVdiPolicy` defaults to `Enabled`. For Azure Virtual Desktop, Learn's Teams on Azure Virtual Desktop page advises installing the WebRTC Redirector Service as well, so users can fall back to WebRTC when they roam to a device that does not support the new architecture. After 1 April 2027 that WebRTC path ends on Windows endpoints. Learn's example for restricting it for a user is `New-CsTeamsVdiPolicy -Identity RestrictedUserPolicy -VDI2Optimization "Disabled"` followed by `Grant-CsTeamsVdiPolicy`.

To check a session, connect, restart Teams, and open **More options (...)**, **Settings**, **About Teams**. The banner reads **AVD SlimCore Media Optimized** for SlimCore or **AVD Media Optimized** for WebRTC. **AVD Media not connected** means quit Teams and try again. In **Settings**, local audio devices and cameras should appear; **Remote audio** means the offload is not active. On the endpoint, `MsTeamsVdi.exe` should run as a child of `msrdc.exe`.

## Network requirements

The SlimCore page lists Microsoft 365 endpoint ID 11, marked Optimize and required: the ranges 52.112.0.0/14 and 52.122.0.0/15 (and 2603:1063::/38) on UDP ports 3478 to 3481. Port 3478 is STUN, 3479 audio, 3480 video and 3481 screen share. Teams prefers UDP; TCP tunneled over HTTP is a last resort and not recommended. The page does not recommend VPNs, proxies or packet shapers for media traffic. Learn states that `MsTeamsVdi.exe` makes all connections, so these rules apply to the endpoint network. The same page lists endpoint ID 47 (default required, `*.office.net` and `graph.microsoft.com`, TCP 443 and 80) as used for SlimCore downloads and background effects, so the endpoint must reach it.

## Status labels and limits to check

- **macOS**: the SlimCore page says Mac is rolled out to general availability for Azure Virtual Desktop and Windows 365. The "Supported features for Teams on Azure Virtual Desktop" page, last updated in March 2026, still labels macOS as preview. Treat the SlimCore page as newer, and check both.
- **Teams as a RemoteApp**: the supported-features page says optimization for Teams as a [RemoteApp](/entity/avd-remoteapp/) is supported with the Windows App for Windows (new Teams), in preview. The SlimCore page lists published apps as supported with Windows App 2.0.964.0 or later and Teams 26043.2016.4478.2773 or later. Verify the current label before you publish Teams as an app.
- **Large-scale event attendees**: optimization for town hall attendees is labeled public preview for Windows endpoints (Windows App 2.0.1186.0, Teams 26225.1803.5037.3180).
- **Mac endpoints** lack several features, among them cross-cloud on Azure Virtual Desktop, system audio sharing and RemoteApp.
- **Profiles**: Learn does not support Roaming User Profiles or Folder Redirection for Teams data in VDI; [FSLogix](/entity/fslogix/) is one of the named tools. Details are in a separate article.

## A decision checklist

1. Inventory endpoints: Windows App version, macOS client type, Linux thin clients.
2. Move Windows clients to a Windows App version at or above the highest minimum Learn lists for the features you use (for example 2.0.550.0 for the split package, 2.0.964.0 for published apps).
3. Set `IsWVDEnvironment` on every host image and decide on the WebRTC Redirector Service as fallback.
4. Open UDP 3478 to 3481 on endpoint networks.
5. Verify with the About page on a pilot group, then check call quality in the Teams Call Quality Dashboard, where SlimCore calls appear as "VDI 2.0 Optimized".

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Use Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd)
- [Microsoft Learn: New VDI solution for Teams](https://learn.microsoft.com/en-us/microsoftteams/vdi-2)
- [Microsoft Learn: Teams for VDI (requirements and deployment of new Teams)](https://learn.microsoft.com/en-us/microsoftteams/new-teams-vdi-requirements-deploy)
- [Microsoft Learn: Supported features for Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-supported-features)
- [Microsoft Learn: What's new in the Remote Desktop WebRTC Redirector Service](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-webrtc)
