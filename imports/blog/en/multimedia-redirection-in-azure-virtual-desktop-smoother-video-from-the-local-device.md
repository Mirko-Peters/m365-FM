---
title: "Multimedia redirection in Azure Virtual Desktop: smoother video from the local device"
summary: "Multimedia redirection moves browser video playback and WebRTC audio calls from the remote session to the user's local Windows device, so the device does the decoding and rendering. It needs a service on the session host, a browser extension for Edge or Chrome, and a Windows client."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-multimedia-redirection, azure-virtual-desktop]
keypoints:
  - "Multimedia redirection has two parts on the session host: the Remote Desktop Multimedia Redirection Service and a browser extension for Microsoft Edge or Google Chrome. It covers two things only, embedded video playback and WebRTC audio calls."
  - "It works from Windows App on Windows 2.0.297.0 or later, or the Remote Desktop app on Windows 1.2.5709 or later. Learn's troubleshooting page says it does not work on macOS, iOS, Android or in a browser-based remote session."
  - "Only listed sites are redirected by default, for example YouTube, Vimeo and LinkedIn Learning for video, or Dialpad, Five9 and Genesys for calls. You can add sites with an allow list, but Learn says that does not guarantee compatibility. Protected content is not supported."
  - "Multimedia redirection is a different mechanism from Teams media optimization. Teams uses SlimCore or the WebRTC Redirector Service, while Learn lists Teams for the web as unsupported in VDI."
  - "The service does not update itself. The extension does. Learn lists service version 1.0.2604.16004, published on 14 July 2026, as the latest release in its version history."
faq:
  - q: "Does multimedia redirection also redirect Microsoft Teams calls?"
    a: "No. Multimedia redirection handles browser-based video and WebRTC calls on the sites Learn lists. Teams calling and meetings in the Teams app use Teams media optimization, with SlimCore or the WebRTC Redirector Service. Learn's Teams on VDI page also says Teams for the web is not supported in VDI."
  - q: "Do users need to install anything on their local device?"
    a: "Learn lists the client apps and versions (Windows App on Windows 2.0.297.0 or later, or the Remote Desktop app on Windows 1.2.5709 or later) and requires the Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later, on local Windows devices. The service and extension are installed on the session host, not the client. The local device must also meet the Teams hardware requirements for a Windows PC."
  - q: "Is multimedia redirection available in Azure US Government?"
    a: "No. Learn says it is not supported on Azure Virtual Desktop for Azure US Government, on Windows 365 for Microsoft 365 Government (GCC, GCC-High) or on Microsoft 365 DoD."
---

Multimedia redirection (MMR) moves two kinds of browser media work from a remote session to the user's local Windows device: video playback and WebRTC audio calls. The session host still runs the browser, but the local device decodes and renders the video, which Microsoft Learn describes as faster processing and rendering. This article explains what is redirected, what it needs and where it stops. Enabling it step by step is a separate how-to.

## What multimedia redirection does

In a normal remote session, a browser plays a video on the session host, and the result reaches the user as screen updates over the remote connection. [Multimedia redirection](/entity/avd-multimedia-redirection/) changes who does the work. Learn says it redirects video playback and calls in a remote session from [Azure Virtual Desktop](/entity/azure-virtual-desktop/), a Windows 365 Cloud PC or a Microsoft Dev Box to the local device for faster processing and rendering. For video, the bitstream is sent to the local device, which decodes and renders it in the correct place on the screen. For calls, WebRTC is offloaded from the session host to the local device, which Learn says reduces latency and improves quality.

There are two features, and each has its own list of supported sites:

- **Video playback redirection** for embedded videos on supported sites.
- **Call redirection** for audio calls in WebRTC-based calling web apps.

Both depend on the same two components, described next. Learn's page carries no GA or preview label for the feature as a whole; it marks two optional extension toggles as beta and experimental (see the limits below).

## The two components

Two components make it work on the session host:

1. **The Remote Desktop Multimedia Redirection Service**, installed with local administrator rights.
2. **A browser extension** for [Microsoft Edge](/entity/microsoft-edge/) or Google Chrome.

Users are prompted to enable the extension when they open the browser, unless you manage it centrally. Learn lists the benefits of central management: silent enablement, restricting which web pages use redirection, showing or hiding advanced settings and pinning the extension to the toolbar. You can manage it with [Microsoft Intune](/entity/intune/), [Group Policy](/entity/group-policy/) or, for Edge only, the Microsoft Edge management service. The extension IDs are `joeclbldhdmoijbaagobkhlpfjglcihd` for Edge and `lfmemoeeciijgkjkgbgikoonlkabmlno` for Chrome.

The service and the extension update differently. The extension updates automatically. The service does not: Learn says you must install the new version manually, using the same installer, which replaces the previous version.

## Requirements at a glance

| Item | What Learn requires |
|---|---|
| Host side | An existing host pool with session hosts, and local administrator rights to install and update the service |
| Browser on the host | The latest Microsoft Edge or Google Chrome |
| Runtime | Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later, on the remote host and on local Windows devices |
| Client app | Windows App on Windows 2.0.297.0 or later, or Remote Desktop app on Windows 1.2.5709 or later |
| Local device | Meets the Teams hardware requirements for a Windows PC |
| Intune management | A Microsoft Entra ID account with the Policy and Profile manager role, and a group with the target devices |
| Group Policy management | A domain account that can create or edit GPOs, and a group or OU with the target devices |

On [Windows 365](/entity/windows-365/), Learn says the feature is already installed on Microsoft gallery images, so you only install it on a Cloud PC that uses a custom image. For a [Microsoft Dev Box](/entity/microsoft-dev-box/), Learn documents one `.msi` that installs both the service and the extension.

## Which sites are redirected

Redirection is allow-list based. A site only benefits if the extension recognises it.

**Video playback**, default sites per Learn: AWS Training, BBC, Big Think, CNBC, Coursera, Daily Mail, Facebook, Fidelity, Fox Sports, Fox Weather, IMDB, Infosec Institute, LinkedIn Learning, Microsoft Learn, Microsoft Stream, Pluralsight, Skillshare, The Guardian, Twitch, Udemy, UMU, U.S. News, Vimeo, Yahoo, Yammer and YouTube, including embedded YouTube videos.

**Calls**, default sites per Learn: WebRTC Sample Site, Content Guru Storm, Twilio Flex, 8x8, Dialpad, Five9, Genesys, Sprinklr, Ringover, Amazon Connect Customer and Puzzel.

Learn lists these as sites that work by default, and the list can change, so check the current page before you build a plan around a specific site. To add your own sites, you set the `AllowedVideoRedirectionSites` or `AllowedCallRedirectionSites` registry value on the session host. Each entry is a fully qualified domain name with at most one subdirectory and no URL scheme, for example `contoso.com/training`; entries are separated by semicolons. Learn adds that a site on an allow list gets the feature but "doesn't guarantee compatibility", so test each one.

There is also an opt-in route for everything else. The extension's advanced settings include **Enable video playback for all sites (beta)** and, for calls, **Enable call redirection for all sites (experimental)**. Learn says both might not work as expected. Treat them as test switches, not as a production baseline.

## What multimedia redirection does not do

The limits matter more than the feature list when you decide whether to roll this out:

- **Protected content is not redirected.** Learn says it plays through regular, non-redirected playback.
- **Windows clients only.** The troubleshooting page says it does not work on macOS, iOS, Android or in a browser-based remote session on any platform, and gives no workaround. Windows App on the web, for example, is therefore not covered.
- **Not in government clouds.** Azure US Government, Windows 365 for Microsoft 365 Government (GCC, GCC-High) and Microsoft 365 DoD are listed as unsupported.
- **Call quality after connection.** Once a call is set up, Learn says quality depends on the web page or app provider, as it would for a call without redirection.
- **WebRTC audio calls only.** The troubleshooting page says call redirection supports WebRTC-based audio calls on the listed sites.
- **Blocking cmd.exe breaks it.** If session hosts block `cmd.exe`, redirection does not work as expected, according to the troubleshooting page.

That page was last updated on 3 February 2025 according to its footer, while the main page was updated on 20 October 2026. Check the troubleshooting page for newer wording before relying on a limit, especially on client platforms.

## How it differs from Teams media optimization and plain RDP

Three things are easy to confuse, and each has a different job.

**Teams media optimization** redirects calling and meetings media of the Teams app. Learn's Teams on AVD page names SlimCore for the new Teams app and the WebRTC Redirector Service for classic Teams, and recommends installing the WebRTC Redirector Service with new Teams too, as a fallback. See [Teams media optimization](/entity/avd-teams-media-optimization/) and [Microsoft Teams](/entity/teams/). MMR has no role there. Learn's Teams for VDI page states that Teams for the web is not supported in VDI, so do not expect MMR to cover a Teams browser session.

**Device redirection over the [Remote Desktop Protocol](/entity/remote-desktop-protocol/)** is a third path. Learn's Teams page lists the RDP properties `audiocapturemode:i:1`, `audiomode:i:0` and `camerastoredirect:s:*` for microphone and camera redirection, and says device redirection is not required when media optimization is in use. It is a different feature from moving media rendering to the client.

**Browser video on an unlisted site** is simply rendered on the session host and sent as screen content. That is the case MMR is meant to improve, and it is the case you fall back to for protected content or unlisted sites.

A practical way to place MMR: it applies when the media app is a web page in Edge or Chrome and the page is on a list. If the app is Teams, look at media optimization. If it is a desktop softphone or another native app, MMR does not apply, because it works through the browser extension.

## When a pilot is worth running

Learn does not publish performance figures for MMR, so any gain has to be measured in your own environment. A reasonable pilot, which is our suggestion and not Microsoft guidance, follows this outline:

1. Pick one or two user groups that watch training video or use a supported browser-based softphone, for instance e-learning on a listed site such as LinkedIn Learning or Pluralsight.
2. Confirm the clients are Windows App on Windows 2.0.297.0 or later, or the Remote Desktop app on Windows 1.2.5709 or later. If a large share of the group uses Macs or thin clients, the benefit is smaller, because those clients are not covered.
3. Install the service and extension on a test host pool, then check the extension icon: Learn describes a blue border when redirection is available on the page and a video playback or call icon while redirection is active.
4. Compare session host CPU use and user-reported smoothness with and without redirection for the same video.

The comparison in step 4 is the one Learn does not provide, and it is the number you need before you decide whether to maintain the service on every session host.

## Keeping the service current

The service has an explicit version history. The latest entry in Learn's what's new page is 1.0.2604.16004, published on 14 July 2026, with fixes for crashes, looping video and seeking on certain sites, and RestartIce support for sites that need it. Earlier entries include a February 2025 release that added support for more codecs: VP9, AV1 and HEVC, along with a WebM parser. Because the service does not self-update, add it to the same image or patch process as your browsers. Learn says installing the new version with the same steps replaces the previous one.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Multimedia redirection for video playback and calls in a remote session](https://learn.microsoft.com/en-us/azure/virtual-desktop/multimedia-redirection-video-playback-calls)
- [Microsoft Learn: What's new in multimedia redirection](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-multimedia-redirection)
- [Microsoft Learn: Troubleshoot multimedia redirection](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-multimedia-redirection)
- [Microsoft Learn: Use Microsoft Teams on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/teams-on-avd)
- [Microsoft Learn: Install Teams for Virtualized Desktop Infrastructure (VDI)](https://learn.microsoft.com/en-us/microsoftteams/new-teams-vdi-requirements-deploy)
