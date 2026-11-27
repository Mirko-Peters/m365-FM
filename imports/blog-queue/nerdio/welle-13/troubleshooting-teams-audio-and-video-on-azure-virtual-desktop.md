---
title: "Troubleshooting Teams audio and video on Azure Virtual Desktop"
summary: "Start with the status Teams shows under Settings and About, because it tells you which state a session is in and which checks apply. This article walks through those states, the SlimCore error codes Learn documents, missing audio devices, and the known video and sharing issues."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [avd-teams-media-optimization, azure-virtual-desktop]
keypoints:
  - "Read the status first: Settings, About shows whether the session is optimized, with SlimCore or WebRTC, or not connected."
  - "WebRTC instead of SlimCore: check that msrdc.exe loads MsTeamsPluginAvd.dll (error 2000), then restart Teams once. On Windows, WebRTC stops working on 1 April 2027."
  - "'SlimCore Media Not Connected' is mostly an MSIX problem: press Ctrl+Alt+Shift+1, read loadErrc or deployErrc in the logs, and look the code up in Learn's table."
  - "Devices missing or 'Remote audio' shown: quit and restart Teams, then check microphone and camera privacy settings on the local PC."
  - "Some video issues depend on the engine, for example missing incoming video on Windows 11 24H2 or 25H2 with UAC off on WebRTC."
faq:
  - q: "Users hear nobody in Teams calls on a virtual desktop. Where do I start?"
    a: "Open Teams, then Settings, About, and read the banner. If the device menu shows Remote audio, Learn says to quit and restart Teams, then check Settings, Privacy, App permissions, Microphone on the local PC and grant camera access for video. If the banner shows Not Connected, collect logs with Ctrl+Alt+Shift+1 and look up the error code."
  - q: "What does 'Optimize virtual desktop and restart' do?"
    a: "Per Learn, when the warning icon shows, users can select the three dots and choose it. It restarts Teams, which can solve some known issues. If the user is still not optimized, Teams shows an error code that an admin can look up in the connection error table, and users get a link with more information about the error."
  - q: "Do I still need device redirection for microphones and cameras?"
    a: "Learn says enabling device redirections is not required when Teams uses media optimization. If Teams runs without media optimization, it suggests the RDP properties audiocapturemode:i:1, audiomode:i:0 and camerastoredirect:s:*."
---

When Teams audio or video fails on an Azure Virtual Desktop session, open **Settings** and then **About** in Teams first. The banner tells you whether the session is optimized and with which engine. If devices are missing in an optimized session, check the local device and privacy settings. If it is not optimized, look at the plugin or the SlimCore package on the user's device.

The architecture, version minimums and ports are covered in the article "Teams media optimization for Azure Virtual Desktop: how the offload works".

## Step 1: read the status

Hovering over the **Optimized** banner shows whether the user has the WebRTC or SlimCore engine. A warning icon means Teams is not optimized. Users can select the three dots and choose **Optimize virtual desktop and restart**, which restarts Teams and can solve some known issues. If the user is still not optimized, Teams shows an error code for admins and a link.

| Banner text | Meaning per Learn | Go to |
|---|---|---|
| AVD SlimCore Media Optimized | Optimized with SlimCore | Devices or network sections |
| AVD Media Optimized (troubleshooting page: "Azure Virtual Desktop Media Optimized") | Optimized with WebRTC | Case A |
| Azure Virtual Desktop SlimCore Media Not Connected (troubleshooting page) | Fallback mode; MSIX or AppX errors are the most likely reason | Case B |
| AVD Media not connected (Teams on Azure Virtual Desktop page) | Quit Teams and try again | Setup steps in the offload article |

The Optimized banners carry no error code, so use the hover text there. An endpoint optimized with SlimCore runs `MsTeamsVdi.exe` as a child process of `msrdc.exe`.

## Case A: WebRTC when you expected SlimCore

Learn names error 2000 ("No Plugin"; logged as 16002) and 2003 (a Citrix Studio policy blocks the virtual channels; logged as 16026) as the most likely causes. WebRTC is not a lasting state on Windows endpoints: Learn lists end of support on 1 October 2026 and end of availability on 1 April 2027, when WebRTC stops working and a user who fails to optimize falls back to server-side rendering. On Azure Virtual Desktop, check code 2000:

1. On the endpoint, start Process Explorer, enable the lower pane and open the DLL tab.
2. Select `msrdc.exe` and confirm `MsTeamsPluginAvd.dll` is loaded. The plugin ships with the [Windows App](https://www.m365.fm/entity/windows-app/).
3. Restart Teams. One restart moves WebRTC to SlimCore when the plugin is first detected.
4. If it persists, look for Microsoft Teams VDI errors in Event Viewer on the VM (Teams 24123.X.X.X or higher). To filter by that source, first run `New-EventLog -LogName Application -Source "Microsoft Teams VDI"` in elevated PowerShell, then filter Windows Logs, Application by Event ID 0.

Two more codes explain permanent WebRTC:

- **2005** (logged as 16043): Teams runs as a [RemoteApp](https://www.m365.fm/entity/avd-remoteapp/) and the user does not meet the minimum version, so SlimCore is not loaded and the user is always on WebRTC. Microsoft's VDI 2.0 article lists Windows App 2.0.964.0 and Teams 26043.2016.4478.2773 for RemoteApp without a preview label, while the supported-features article labels it preview.
- **2008** (logged as 16066): the Windows App for Mac comes from the App Store, which is not supported. Only the non-Store build works.

## Case B: SlimCore Media Not Connected

Learn calls MSIX or AppX errors the most likely reason. Get the code:

1. In Teams on the session host, press **Ctrl+Alt+Shift+1**. This writes a ZIP file to the Downloads folder.
2. Open `PROD-WebLogs-*.zip` and go to the **Core** folder.
3. In `Vdi_debug.txt`, check `vdiConnectedState`. `connectedStack: remote` means the virtual channel is connected, but not necessarily that the calling stack initialized. `connectedStack: local` means the virtual channel failed and the user is in fallback mode. The file also lists `pluginVersion`.
4. In `Diagnostics-logs.txt`, search for `vdiBridgeEventsHandler`, then find the log line containing `loadErrc` and `deployErrc`.

A deploy error means the plugin failed to download the SlimCore MSIX package or stage it with the App Readiness Service. A load error means it could not start `MsTeamsVdi.exe` or connect to it over RPC. Learn's example `deployErrc=24002` maps to standard code 3000, "SlimCore Deployment not needed", which is not an error. Selected rows:

| Logged loadErrc or deployErrc | Standard code | Learn's definition | Documented direction |
|---|---|---|---|
| 43 | 5 | ERROR_ACCESS_DENIED | BlockNonAdminUserInstall could cause this; or the endpoint is still registering several MSIX packages after logon |
| none listed | 16389 | E_FAIL reported by Package Manager | Usually BlockNonAdminUserInstall (like code 5); also AppLocker or WDAC and temp folder access. Registration mismatch and shared-kiosk causes: fixed in plugin 2026.29.1.4 |
| 10083 | 1260 | ERROR_ACCESS_DISABLED_BY_POLICY | AppLocker: disable it or add an exception for SlimCoreVdi packages |
| 1951 | 15615 | ERROR_INSTALL_POLICY_FAILURE | Check the MSIX signature, AllowAllTrustedApps and sideloading settings |
| 3227, 3235 | 403, 404 | HTTP forbidden, not found | 403: involve the network and proxy teams, something blocks the MSIX download. 404: package not found on the CDN, possible proxy interference |
| none listed | 110 | ERROR_OPEN_FAILED | For Windows App, set background app permission to Always |
| 11683, 13779 | 1460, 1722 | Time-out; RPC server unavailable | Slow MSIX registration or an unavailable App Readiness Service; transient if optimization eventually works |
| 24043 | 3005 | Plugin time-out while downloading | Failure to download the MSIX within 2 minutes |
| 24058 | 3007 | Load time-out | SlimCore download or installation timed out (slow internet or busy App Readiness Service) |
| 24170 | 3021 | No usable SlimCore package | Framework present, Host missing; a user setting may block the Host install |
| none listed, 51 | 4390, 6 | ERROR_NOT_A_REPARSE_POINT, ERROR_INVALID_HANDLE | RAM disk (TEMP/TMP) workaround and Unified Write Filter exclusions, see Endpoint checks |

### Endpoint checks

- List the SlimCore packages with `Get-AppxPackage Microsoft.Teams.SlimCore*`.
- Check Event Viewer under **Applications and Services Logs, Microsoft, Windows**, in `AppXDeployment-Server` (Operational) and `AppxPackagingOM` (Operational). Start with AppXDeployment-Server.
- Look for blocking policies. Learn names `BlockNonAdminUserInstall`, `AllowAllTrustedApps` and `AllowDevelopmentWithoutDevLicense` under `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock` and `HKLM\SOFTWARE\Policies\Microsoft\Windows\Appx`. In Intune, BlockNonAdminUserInstall sits in the Settings Catalog under App Package Deployment.
- For endpoints that must keep BlockNonAdminUserInstall on, Learn gives two steps. First install KB5052094 (Windows 11 23H2 and 22H2), KB5052093 (Windows 11 24H2) or KB5055612 (Windows 10 22H2), or any subsequent KB. That update adds the group policy "Allowed package family names for non-admin user install" (Computer Configuration, Administrative Templates, Windows Components, App Package Deployment). Then allow-list the two SlimCore packages there: `Microsoft.Teams.SlimCoreVdiHost.win-x64_8wekyb3d8bbwe` and `Microsoft.Teams.SlimCoreVdiFwk.*_8wekyb3d8bbwe`.
- On thin clients where TEMP and TMP point to a RAM disk, Learn's workaround is a system variable `MSTEAMSVDI_BITS_TMP_PATH` pointing to a physical location such as `C:\TMP`. Plugin 2025.24.1.3 or higher fixes this for Unified Write Filter (UWF) with RAM overlay. For UWF thin clients, Learn lists two exclusions: `uwfmgr.exe file Add-Exclusion` for `C:\Program Files\WindowsApps` and for `C:\Users\User\AppData\Local\Packages\Microsoft.Teams.SlimCoreVdiHost.win-x64_8wekyb3d8bbwe`.
- Learn says code 2 and some 16389 causes are fixed in plugin 2026.29.1.4 or higher (Windows, July 2026). Compare with `pluginVersion`.

In the Teams admin center, **Teams client health** lists "VDI optimization failure" errors under the Issues tab, with descriptions and remediation actions.

## Devices missing, or "Remote audio" in the device menu

With optimization loaded, local audio devices and cameras appear in the Teams device menu. If it shows **Remote audio**, quit Teams and try again. If devices still do not appear:

1. Check the privacy settings on the local PC: under **Settings, Privacy, App permissions, Microphone**, "Allow apps to access your microphone" must be On.
2. Grant permission for apps to access the camera if users join with video.
3. Disconnect from the remote session, reconnect and check the devices again.
4. If media optimization does not load at all, Learn suggests uninstalling and reinstalling Teams.

Other device-related items from Learn's known issues:

- The VM's volume mixer (System, Sound) cannot control levels while Teams is optimized. Users must use the sliders in Teams audio settings or the mixer on the endpoint.
- On a Mac with the Remote Desktop client or Windows App, Teams lists only the device selected in macOS, labeled with the Mac's name.
- With a HID peripheral on the local machine, starting Teams in the virtual desktop (or in a second one) can drop calls on the local machine. Learn says this is fixed in Teams 26276.x.x.x, currently only for Public Preview and Early Access users.
- With some peripherals, two unified communications apps side by side can cause HID collisions. On Teams 25060.205.3499.6849 or higher, HID can be disabled with `DisableHidManagerV1` set to 1 under `HKEY_CURRENT_USER\Software\Microsoft\Teams\HID`. Create the key on the endpoint (on the VM only with Remote Desktop client 1.2.6275 or Windows App 2.0.550.0 or higher). Without the key, or at 0, HID stays enabled.

## Video and screen sharing symptoms

Check the engine first: Learn says WebRTC does not support 1080p, QoS, user-uploaded backgrounds or the 3x3 and 7x7 gallery views. The older troubleshoot-teams page (June 2025) lists 720p and no custom backgrounds.

- **Incoming video or screen sharing missing**: WebRTC users do not see it on Windows 11 24H2 or 25H2 (26100.6725 and 26200.6725 or higher) when UAC is disabled. The workaround is to enable UAC on the VM.
- **Video streams that sometimes do not appear**: fixed in WebRTC Redirector Service 1.54.2408.19001. Version 1.56.2603.20001 (17 September 2026) fixes the wrong shared monitor in a Teams RemoteApp and clipped video on rotating devices.
- **Black screen when sharing**: with [screen capture protection](https://www.m365.fm/entity/avd-screen-capture-protection/), Learn requires Teams 25060.205.3499.6849 and Remote Desktop client 1.2.6081 or Windows App 2.0.379. Lower versions share a black screen.
- **Redirector service missing**: not pre-installed on marketplace images 22631.3593 and 22621.3593. Install it or use a newer image.

Browser video uses [multimedia redirection](https://www.m365.fm/entity/avd-multimedia-redirection/), a separate feature.

## Network and sign-in effects

SlimCore's `MsTeamsVdi.exe` makes all the network connections, so the endpoint needs UDP and TCP connectivity to Microsoft 365 endpoint IDs 11, 12, 47, 127 and 184. Learn does not recommend packet inspection, proxies or packet shapers.

Authentication is evaluated at the endpoint IP. With Conditional Access and Continuous Access Evaluation (CAE) using strict location enforcement, users can see repeated Teams sign-in prompts or failed calls from untrusted networks. Learn says this is by design and suggests relaxing CAE or adding endpoint or ISP ranges as trusted locations.

In the Call Quality Dashboard, Learn calls "Second Client VDI Is Optimized" the accurate way to see whether the user was optimized. The "Second Client VDI Mode" value x2xx covers both SlimCore optimized and SlimCore not connected (unoptimized fallback), so poor fallback quality can look like a SlimCore problem. "Is Optimized" combines the mode with the connected state. Learn says Second is the client endpoint and First the server endpoint when a server is in the stream; in person-to-person calls the order follows the user agent category. In the VDI report, SlimCore users appear as "VDI 2.0 Optimized" and WebRTC users as "Optimized".

## Fallback control

Teams 24257.x.x.x or higher reads the `DisableFallback` DWORD under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams`. Value 1 disables fallback, 2 enables audio only, and 0 or absent leaves it enabled. With fallback on, an unoptimized user can still join; media is rendered on the [session host](https://www.m365.fm/entity/avd-session-host/).

## Sources

- [Microsoft Learn: Troubleshoot Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-teams)
- [Microsoft Learn: Use Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd)
- [Microsoft Learn: Supported features for Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-supported-features)
- [Microsoft Learn: What's new in the Remote Desktop WebRTC Redirector Service](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-webrtc)
- [Microsoft Learn: New VDI solution for Teams](https://learn.microsoft.com/en-us/microsoftteams/vdi-2)
- [Microsoft Learn: Troubleshooting the VDI 2.0 solution for Teams](https://learn.microsoft.com/en-us/microsoftteams/vdi-2-troubleshooting)
- [Microsoft Learn: Microsoft Teams for Virtualized Desktop Infrastructure (VDI)](https://learn.microsoft.com/en-us/microsoftteams/teams-client-vdi-requirements-deploy)
