---
title: "Troubleshooting Teams audio and video on Azure Virtual Desktop"
summary: "Start with the status Teams shows under Settings and About, because it tells you which of four states a session is in and which checks apply. This article walks through those states, the SlimCore error codes Learn documents, missing audio devices, and the known video and sharing issues."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-teams-media-optimization, azure-virtual-desktop]
keypoints:
  - "Read the status first: Settings, About shows 'AVD SlimCore Media Optimized', 'AVD Media Optimized' (WebRTC) or a 'Not connected' banner. The first answer is whether the session is optimized at all, and with which engine."
  - "If users get WebRTC when you expected SlimCore, Learn's most likely causes are error 2000 (plugin missing or not loaded) and 2003 (a Citrix policy). On Azure Virtual Desktop, check that msrdc.exe loads MsTeamsPluginAvd.dll and restart Teams once."
  - "'SlimCore Media Not Connected' is mostly an MSIX deployment problem on the endpoint. Press Ctrl+Alt+Shift+1 in Teams, read loadErrc and deployErrc in the logs, and map the code in Learn's connection error table. BlockNonAdminUserInstall and AppLocker are the usual policy causes."
  - "If local devices are missing or the menu shows 'Remote audio', quit and restart Teams, then check the Windows privacy settings for microphone and camera on the local PC. Device redirection is not needed with media optimization."
  - "Several known issues depend on the engine, for example incoming video missing on Windows 11 24H2 or 25H2 when UAC is off and the user is on WebRTC. Check the engine before you change anything else."
faq:
  - q: "Users hear nobody in Teams calls on a virtual desktop. Where do I start?"
    a: "Open Teams, then Settings, About, and read the banner. If the device menu shows Remote audio, Learn says to quit and restart Teams, then check Settings, Privacy, App permissions, Microphone on the local PC and grant camera access for video. If the banner shows a Not Connected state, collect the logs with Ctrl+Alt+Shift+1 and look up the error code."
  - q: "What does 'Optimize virtual desktop and restart' do?"
    a: "Per Learn, it appears under the three dots when Teams is not optimized. It restarts Teams, which can solve some known issues. If the user is still not optimized, Teams shows an error code that an admin can look up in the connection error table, and users get a link with more information about the error."
  - q: "Do I still need device redirection for microphones and cameras?"
    a: "Learn says enabling device redirections is not required when Teams uses media optimization. Only if you run Teams without media optimization does it suggest the RDP properties audiocapturemode:i:1, audiomode:i:0 and camerastoredirect:s:*."
---

When Teams audio or video fails on an Azure Virtual Desktop session, open **Settings** and then **About** in Teams first. The banner tells you whether the session is optimized and with which engine, and Learn's troubleshooting steps depend on that answer. If the session is optimized and devices are missing, check the local device and privacy settings. If it is not optimized, the cause is usually the plugin or the SlimCore package on the user's device.

The architecture, version minimums and ports are covered in the article "Teams media optimization for Azure Virtual Desktop: how the offload works". This article is the troubleshooting path, built on Learn pages dated between June 2025 and November 2026.

## Step 1: read the status

Learn says Teams shows the optimization status, and hovering over the **Optimized** banner shows whether the user has the WebRTC or the SlimCore engine. A warning icon means Teams is not optimized. Users can select the three dots and choose **Optimize virtual desktop and restart**, which restarts Teams and can solve some known issues. If the user is still not optimized, Teams shows an error code for IT admins, plus a link with more information.

| What the user sees | Meaning per Learn | Go to |
|---|---|---|
| AVD SlimCore Media Optimized | Optimized with SlimCore | Devices or network sections |
| AVD Media Optimized | Optimized with WebRTC | Case A |
| AVD SlimCore Media Not Connected | Fallback, usually MSIX or AppX errors | Case B |
| AVD Media not connected | Learn's Teams on Azure Virtual Desktop page: quit Teams and try again | Case A, then B |

Learn's troubleshooting page words the banners slightly differently from the Azure Virtual Desktop page, so go by the error code. An optimized endpoint runs `MsTeamsVdi.exe` as a child process of `msrdc.exe`.

## Case A: WebRTC when you expected SlimCore

Learn names error 2000 ("No Plugin") and 2003 ("Virtual Channel not allowed") as the most likely causes. Code 2003 refers to a Citrix Studio policy, so on Azure Virtual Desktop code 2000 is the one to check:

1. On the endpoint, start Process Explorer, enable the lower pane and open the DLL tab.
2. Select `msrdc.exe` and confirm `MsTeamsPluginAvd.dll` is loaded. If not, the endpoint lacks the plugin or it did not load. The plugin ships with the [Windows App](/entity/windows-app/).
3. Restart Teams. Learn says one restart is needed to move from WebRTC to SlimCore when the plugin is detected for the first time.
4. If it persists, open Event Viewer on the VM and look for Microsoft Teams VDI errors (Teams 24123.X.X.X or higher). Event Viewer can filter by that source only after you run `New-EventLog -LogName Application -Source "Microsoft Teams VDI"` in an elevated PowerShell window. Then filter by Event ID 0 under Windows Logs, Application.

Two more codes explain a permanent WebRTC state:

- **2005**: Teams runs as a RemoteApp and the user does not meet the minimum version, so SlimCore is not loaded and the user is always on WebRTC. Learn's supported-features page, last updated in March 2026, still labels optimization for Teams as a [RemoteApp](/entity/avd-remoteapp/) as preview.
- **2008**: the Windows App for Mac comes from the App Store, which is not supported. Only the non-Store build works.

## Case B: SlimCore Media Not Connected

Learn calls MSIX or AppX errors the most likely reason. First get the code:

1. In Teams on the session host, press **Ctrl+Alt+Shift+1**. This writes a ZIP file to the Downloads folder.
2. Open `PROD-WebLogs-*.zip` and go to the **Core** folder.
3. In `Vdi_debug.txt`, check `vdiConnectedState`. Learn's monitoring section says `connectedStack` is `remote` when optimized and `local` when not, and lists version fields such as `pluginVersion`.
4. In `Diagnostics-logs.txt`, search for `vdiBridgeEventsHandler`, then find the log line containing `loadErrc` and `deployErrc`.

A deploy error means the plugin failed to download the SlimCore MSIX package from Microsoft's CDN or to stage it with the App Readiness Service. A load error means the plugin could not start `MsTeamsVdi.exe` or establish an RPC connection to it. Learn maps the logged code to a standard error code. Selected rows:

| Code | Learn's definition | Documented direction |
|---|---|---|
| 5, 16389 | ERROR_ACCESS_DENIED, E_FAIL | BlockNonAdminUserInstall is the most likely cause; also AppLocker or WDAC |
| 1260 | Blocked by policy (0x800704EC) | AppLocker: disable it or add an exception for SlimCoreVdi packages |
| 15615 | Install policy failure | Check the MSIX signature, AllowAllTrustedApps and sideloading settings |
| 403, 404 | HTTP forbidden, not found | Proxy or network rules blocking or interfering with the MSIX download |
| 110 | Blocked by background access policy | For Windows App, set background app permission to Always |
| 1460, 1722 | 60-second time-out; RPC server unavailable | Slow MSIX registration or an unavailable App Readiness Service; transient if optimization eventually works |
| 3005, 3007 | Download or load time-out | MSIX not downloaded within 2 minutes; slow internet or busy App Readiness Service |
| 3021 | No usable SlimCore package | Framework present, Host missing; a user setting may block the Host install |
| 4390, 6 | Thin client write filter or RAM disk | See the RAM disk workaround below |

Learn lists more codes; use its full table for the rest.

### Endpoint checks

- List the SlimCore packages with `Get-AppxPackage Microsoft.Teams.SlimCore*`.
- Check Event Viewer under **Applications and Services Logs, Microsoft, Windows**, in `AppXDeployment-Server` (Operational) and `AppxPackagingOM` (Operational). Review AppXDeployment-Server first.
- Look for blocking policies. Learn names the keys `BlockNonAdminUserInstall`, `AllowAllTrustedApps` and `AllowDevelopmentWithoutDevLicense` under `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock` and `HKLM\SOFTWARE\Policies\Microsoft\Windows\Appx`. In Intune, BlockNonAdminUserInstall sits in the Settings Catalog under App Package Deployment.
- For managed endpoints that must keep BlockNonAdminUserInstall on, Learn says KB5052094 (Windows 11 23H2 and 22H2), KB5052093 (Windows 11 24H2) or KB5055612 (Windows 10 22H2), or a later update, lets SlimCore packages install. The alternative is the group policy "Allowed package family names for non-admin user install" under Computer Configuration, Administrative Templates, Windows Components, App Package Deployment, with the two SlimCore package family names.
- On thin clients where TEMP and TMP point to a RAM disk, Learn's workaround is a new system variable `MSTEAMSVDI_BITS_TMP_PATH` pointing to a physical location such as `C:\TMP`.
- Learn says code 2 and some 16389 causes are fixed in plugin 2026.29.1.4 or higher. The pages read do not map that number to a Windows App version, so compare `pluginVersion` in `Vdi_debug.txt`.

Admins can also use **Teams client health** in the Teams admin center. Under the Issues tab, "VDI optimization failure" errors come with descriptions and remediation actions.

## Devices missing, or "Remote audio" in the device menu

This is the symptom behind most "no audio" tickets. Learn's verification steps say that with optimization loaded, the audio devices and cameras available locally appear in the device menu in Teams Settings. If the menu shows **Remote audio**, quit Teams and try again. If devices still do not appear:

1. Check the privacy settings on the local PC: under **Settings, Privacy, App permissions, Microphone**, "Allow apps to access your microphone" must be On.
2. Grant permission for apps to access the camera if users join with video.
3. Disconnect from the remote session, reconnect and check the devices again.
4. If media optimization does not load at all, Learn suggests uninstalling and reinstalling Teams.

Device redirection is not needed with media optimization. Learn suggests the RDP properties `audiocapturemode:i:1`, `audiomode:i:0` and `camerastoredirect:s:*` only when Teams runs without it.

Other device-related items from Learn's known issues:

- On a Mac with the Remote Desktop client or Windows App, Teams lists only the device selected at the macOS level, labeled with the Mac device name.
- If a local machine has a HID peripheral connected and the user also starts Teams in the virtual desktop, calls on the local machine can drop. Learn lists this for Azure Virtual Desktop and Windows 365 with both engines.
- With some peripherals, two unified communications apps side by side can cause HID collisions. On Teams 25060.205.3499.6849 or higher, HID can be disabled with `DisableHidManagerV1` set to 1 under `HKEY_CURRENT_USER\Software\Microsoft\Teams\HID`.

## Video and screen sharing symptoms

Check the engine before anything else, because Learn says WebRTC does not support 1080p, QoS, user-uploaded backgrounds or the 3x3 and 7x7 gallery views, and that most of these limitations are addressed by SlimCore. An older Learn page, last updated in June 2025, still lists 720p and no custom backgrounds.

- **Incoming video or screen sharing missing**: Learn says users on WebRTC fail to see it on Windows 11 24H2 or 25H2 (26100.6725 and 26200.6725 or higher) when UAC is disabled. The workaround is to enable UAC on the VM.
- **Video streams that sometimes do not appear**: Learn's WebRTC Redirector Service history lists this as fixed in version 1.54.2408.19001. Version 1.56.2603.20001, published 17 September 2026, fixes the wrong monitor being shared with Teams as a RemoteApp and clipped video on rotating devices. Compare the installed service version with that list.
- **Black screen when sharing**: with [screen capture protection](/entity/avd-screen-capture-protection/), Learn requires Teams 25060.205.3499.6849 and Remote Desktop client 1.2.6081 or Windows App 2.0.379. Lower versions share a black screen.
- **Redirector service missing**: Learn says it is not pre-installed on two older marketplace images (Windows 11 Enterprise multi-session with Microsoft 365 Apps 23H2 build 22631.3593 and 22H2 build 22621.3593). Install it or redeploy from a newer image.

If browser video is the problem and not Teams, [multimedia redirection](/entity/avd-multimedia-redirection/) is a separate feature.

## Network and sign-in effects

SlimCore's `MsTeamsVdi.exe` makes all the network connections, so the endpoint needs UDP and TCP connectivity to Microsoft 365 endpoint IDs 11, 12, 47, 127 and 184. Learn does not recommend packet inspection, proxies or packet shapers for Teams media.

Authentication is evaluated at the endpoint IP. With Conditional Access and Continuous Access Evaluation (CAE) using strict location enforcement, users can see repeated Teams sign-in prompts or failed calls from untrusted networks. Learn says this is by design and suggests relaxing CAE or adding endpoint or ISP ranges to trusted locations.

In the Call Quality Dashboard, Learn says the dimension "Second Client VDI Is Optimized" is the accurate way to see whether a call was optimized. "Inactive" means an admin disabled the optimization policy.

## Fallback control and what to collect

Teams 24257.x.x.x or higher reads the `DisableFallback` DWORD under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams`. Value 1 disables fallback, 2 enables audio only, and 0 or absent leaves it enabled. With fallback on, an unoptimized user can still join, and the media is rendered on the [session host](/entity/avd-session-host/).

Before you contact support, gather the Teams ZIP, the error code, the banner text, the Windows App and Teams versions, and the AppXDeployment-Server events. Learn sends support requests through the Microsoft 365 admin center.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Troubleshoot Microsoft Teams for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-teams)
- [Microsoft Learn: Use Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd)
- [Microsoft Learn: Supported features for Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-supported-features)
- [Microsoft Learn: What's new in the Remote Desktop WebRTC Redirector Service](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-webrtc)
- [Microsoft Learn: New VDI solution for Teams](https://learn.microsoft.com/en-us/microsoftteams/vdi-2)
- [Microsoft Learn: Troubleshooting the new VDI optimization for Teams](https://learn.microsoft.com/en-us/microsoftteams/vdi-2-troubleshooting)
- [Microsoft Learn: Install Teams for Virtualized Desktop Infrastructure](https://learn.microsoft.com/en-us/microsoftteams/new-teams-vdi-requirements-deploy)
- [Microsoft Learn: Teams for Virtualized Desktop Infrastructure](https://learn.microsoft.com/en-us/microsoftteams/teams-for-vdi)
