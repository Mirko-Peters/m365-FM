---
title: "Fix Teams Audio and Video Redirection Problems in Azure Virtual Desktop Sessions"
summary: "A checklist for choppy or missing Teams audio and video in Azure Virtual Desktop: verify media optimization, the redirector and registry key, client versions, SlimCore errors, network ports and the fallback to server-side rendering."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [azure-virtual-desktop, teams, virtual-desktop-infrastructure]
keypoints:
  - "First confirm optimization in Teams: Settings, About Teams should show AVD SlimCore Media Optimized or AVD Media Optimized. Without it, media runs on the VM."
  - "Each session host needs the IsWVDEnvironment registry value set to 1 and the Remote Desktop WebRTC Redirector Service installed for the WebRTC path."
  - "New Teams can use SlimCore or WebRTC. Classic Teams support ended on October 1, 2026 and availability ends on April 1, 2027."
  - "Media needs UDP to the Teams endpoints, with UDP 3478 to 3481 listed. VPN, proxies and packet shapers are not recommended for media."
  - "Learn's SlimCore troubleshooting maps error codes such as 2000, 2003, 1260 and 16389 to specific causes and actions."
faq:
  - q: "How do I know whether Teams media optimization is working in an AVD session?"
    a: "Microsoft Learn says to open More options, Settings, About Teams, and look for the banner AVD SlimCore Media Optimized or AVD Media Optimized. If it shows AVD Media not connected, quit Teams and try again. The device menu should list local audio devices and cameras, not Remote audio."
  - q: "Which registry value turns on media optimization for the WebRTC path?"
    a: "Learn names the DWORD IsWVDEnvironment under HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Teams, set to 1 on each session host. The Remote Desktop WebRTC Redirector Service must also be installed on each session host."
  - q: "Do I still need RDP device redirection for audio and video?"
    a: "Learn says device redirection isn't required with media optimization. Only without media optimization does it list the RDP properties audiocapturemode:i:1, audiomode:i:0 and camerastoredirect:s:*."
  - q: "Why is Teams slow and uses a lot of CPU on the virtual desktop?"
    a: "If the user is not optimized, Learn says media falls back to server-side rendering, where all multimedia is handled by the virtual machine with no offloading to the endpoint. Large-scale events are also not optimized for attendees and default to server-side rendering."
---

When Teams audio and video stutter inside an Azure Virtual Desktop (AVD) session, the cause is usually that media is not being offloaded to the user's device. In that case the virtual machine encodes and decodes every stream, and quality depends on the VM and the path to it. This checklist follows Microsoft Learn's order: verify optimization, fix the components, check the client, read the error code, then look at the network.

## Step 1: Verify whether media is optimized

In the Teams desktop app inside the session:

1. Quit and restart Teams.
2. Select **More options (...)** > **Settings** > **About Teams**.
3. Read the banner. **AVD SlimCore Media Optimized** (new architecture) or **AVD Media Optimized** (WebRTC) means optimization loaded. **AVD Media not connected** means quit Teams and try again.
4. Open **Settings** and check the device menu. Local audio devices and cameras should appear. **Remote audio** means redirection is not working.

Learn's Teams for VDI page adds more signals. The VDI status indicator at the top left of Teams shows an Optimized banner, and hovering shows WebRTC or SlimCore. A warning icon means not optimized. On the endpoint, `MsTeamsVdi.exe` should run as a child of `msrdc.exe`. `Get-AppxPackage Microsoft.Teams.SlimCore*` lists installed SlimCore packages.

If the user is not optimized, Learn says Teams reverts to server-side rendering, where the VM handles all multimedia with no offloading. Large-scale events are also not optimized for attendees and default to server-side rendering with high resource use on the desktop.

## Step 2: Check session host prerequisites

From Learn's Teams on AVD page:

- Windows 10 or 11 multi-session, or Enterprise. N and KN SKUs are not supported.
- The latest Microsoft Visual C++ Redistributable on session hosts and client devices.
- Teams installed per machine for pooled host pools.
- For new Teams with FSLogix profile management, FSLogix 2210 hotfix 3 (2.9.8716.30241) or later.

For the WebRTC path, set the registry value on every session host:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Microsoft\Teams" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Teams" -Name IsWVDEnvironment -PropertyType DWORD -Value 1 -Force
```

Then install the Remote Desktop WebRTC Redirector Service from the MSI Learn links (`https://aka.ms/msrdcwebrtcsvc/msi`). One known gap: the service is not pre-installed on Windows 11 Enterprise multi-session with Microsoft 365 Apps images at version 23H2 build 22631.3593 and 22H2 build 22621.3593. Redeploy from a current marketplace image, or install it separately. New Teams can use SlimCore or WebRTC, and Microsoft recommends also installing the WebRTC Redirector Service so users on devices without SlimCore support can fall back to WebRTC.

## Step 3: Check Teams version and clients

Learn states that classic Teams reached end of support on October 1, 2026, and end of availability is April 1, 2027. Move to new Teams, which installs as an MSIX package. If you publish it as a RemoteApp, the path is `shell:appsFolder\MSTeams_8wekyb3d8bbwe!MSTeams`.

Media optimization needs a supported client. Learn lists minimums such as Remote Desktop client for Windows 1.2.1026.0 or later, Windows App on iOS and iPadOS 11.2.5 or later, and on Android and ChromeOS 11.0.0.78 or later. For SlimCore on Windows, Windows App 1.3.252 or later or the Remote Desktop client 1.2.5405.0 or later. On macOS, SlimCore needs Windows App 11.13.2 from the MAU client, and the App Store version is not supported (error 2008). Teams chat works everywhere, but other platforms do not get optimized calls.

The supported features page states that Teams must be within 90 days of the current version and that feature minimum versions differ, for example application window sharing needs Remote Desktop client 1.2.3770 or later.

## Step 4: Read the SlimCore error code

When SlimCore fails, Learn's troubleshooting page tells you to find the log line with `loadErrc` and `deployErrc` and map it. Useful entries:

| Code | Meaning | Documented action |
|---|---|---|
| 2000 | No plugin | Confirm the Teams plugin is installed and loaded. For AVD, `msrdc.exe` should load `MsTeamsPluginAvd.dll`. |
| 2003 | Custom virtual channels blocked | Citrix policy blocks MSTEAMS channels. Review the Citrix allow list. |
| 1260 | Access disabled by policy | Usually AppLocker. Disable it or add an exception for the SlimCore packages. |
| 16389 | E_FAIL from Package Manager | Usually BlockNonAdminUserInstall. Check the Intune Settings Catalog policy. |
| 3005 | Plugin time-out while downloading | The MSIX was not downloaded within 2 minutes. |
| 403 or 404 | Blocked or missing MSIX download | Check proxies and the CDN path. |
| 15615 | Install policy failure | Verify the MSIX signature, and allow sideloading from trusted sources. |

If users show **SlimCore Media Not Connected**, check the MSIX errors first. In the logs, `vdiConnectedState.connectedStack` of `remote` means connected through the virtual channel, and `local` means fallback mode.

## Step 5: Check the network

Learn's Teams for VDI page lists the endpoints and ports:

- Endpoint ID 11 (optimize required): UDP 3478, 3479, 3480 and 3481 for STUN, audio, video and screen share.
- Endpoint ID 12: TCP 443 and 80, UDP 443.
- Endpoint ID 47: TCP 443 and 80, used for SlimCore downloads and background effects.
- Endpoint ID 184: TCP 443 and UDP 443, used for ringtones and noise suppression models.

Media must use the most direct path and UDP, not TCP. TCP tunneling is a last resort that Learn does not recommend because of bad quality. VPN is not recommended for media traffic, and proxies and packet shapers can degrade quality significantly. Initial QoS ranges on the client are audio 50,000 to 50,019 (DSCP 46), video 50,020 to 50,039 (DSCP 34) and sharing 50,040 to 50,059 (DSCP 18), applied to `MsTeamsVdi.exe`. When bandwidth is short, Teams prioritizes audio over video.

## Step 6: Know the documented limits

- A Learn page for the WebRTC path lists incoming and outgoing video limited to 720p, while the SlimCore page says up to 1080p when bandwidth is not limited. Check which path your users are on.
- Conditional Access with continuous access evaluation and strict location enforcement can cause repeated sign-in prompts or failed calls. Learn says this is by design.
- Without media optimization, set `audiocapturemode:i:1`, `audiomode:i:0` and `camerastoredirect:s:*` in the RDP properties. With optimization they are not required.

## Collecting logs

Press Ctrl+Alt+Shift+1 in Teams on the VM to start diagnostic logging. Learn says the file lands in the user's Downloads folder. For older WebRTC issues, the desktop app log is `%appdata%\Microsoft\Teams\logs.txt`. Escalate through the Microsoft 365 admin center.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Virtual desktop infrastructure](https://www.m365.fm/entity/virtual-desktop-infrastructure/)

## Sources

- [Microsoft Learn: Use Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd)
- [Microsoft Learn: Supported features for Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-supported-features)
- [Microsoft Learn: Troubleshoot Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-teams)
- [Microsoft Learn: Teams for Virtualized Desktop Infrastructure](https://learn.microsoft.com/en-us/microsoftteams/teams-for-vdi)
- [Microsoft Learn: Teams VDI 2.0 troubleshooting](https://learn.microsoft.com/en-us/microsoftteams/vdi-2-troubleshooting)
