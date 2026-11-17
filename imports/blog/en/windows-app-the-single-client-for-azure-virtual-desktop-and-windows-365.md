---
title: "Windows App: the single client for Azure Virtual Desktop and Windows 365"
summary: "Windows App is Microsoft's client for Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services and remote PCs on Windows, macOS, iOS/iPadOS, Android/Chrome OS, web browsers and Meta Quest. This article explains what it replaces, what it connects to, and which behavior comes from the client rather than the host."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-app, azure-virtual-desktop]
keypoints:
  - "Learn says Windows App replaces the Remote Desktop client. For Azure Virtual Desktop and Windows 365 it is the client to migrate to; Learn's connection table lists Remote Desktop Services as not supported on Windows and says to keep using the Remote Desktop app there."
  - "As of March 27, 2026, the Remote Desktop client for Windows (MSI) and the Remote Desktop web client are no longer supported for public cloud environments. The Microsoft Store Remote Desktop app reached end of support in September 2025."
  - "Features differ by platform. In the comparison table for Azure Virtual Desktop, integrated apps are listed for Windows and macOS only, and USB redirection, serial redirection, multimedia redirection and token protection for Windows only."
  - "Redirection depends on administrator configuration, the local platform, the hosting service and where the behavior is controlled; the more restrictive setting wins. Drive, clipboard, printer and USB redirection are disabled by default."
  - "Windows App in a browser opens at windows.cloud.microsoft. For Azure Virtual Desktop, Learn lists Edge 131, Chrome 130, Safari 18 and Firefox 128 as minimums, and the browser must be no more than 12 months old, support the AVC codec and have WebGL enabled."
faq:
  - q: "Does Windows App replace the Remote Desktop client for everything?"
    a: "Not for everything. Learn's client overview says Windows App replaces the Remote Desktop client and tells users to migrate to keep access to Azure Virtual Desktop and Windows 365. The Windows App overview lists Remote Desktop Services as not supported on Windows and says to continue using the Remote Desktop app there. Learn's pages are not fully consistent on which Windows package that means, so confirm it before planning a Remote Desktop Services rollout."
  - q: "Can users sign in to Windows App with a personal Microsoft account?"
    a: "No. Learn says sign-in for Azure Virtual Desktop, Windows 365, Microsoft Dev Box and Remote Desktop Services needs a work or school account provided by the administrator; a personal Microsoft account does not work. Connecting to a remote PC does not require signing in to Windows App."
  - q: "Is Windows App the same on every platform?"
    a: "No. Learn publishes a comparison per service. On Windows it offers the widest set, including integrated apps, USB and serial redirection, token protection and the Windows 365 Boot and Switch features; the web browser, iOS/iPadOS and Android/Chrome OS clients each lack several of these. Check the comparison for your service before you promise a feature to a user group."
---

Windows App is the client Microsoft documents for reaching Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services and remote PCs from one app. For Azure Virtual Desktop and Windows 365 it replaces the Remote Desktop clients, but it is not identical on every platform, and some features that users expect depend on the platform they connect from. This article explains the concept and the decisions that follow from it. Rollout settings and the mobile feature detail are covered in separate articles.

## What Windows App connects to

Learn's [overview](https://learn.microsoft.com/en-us/windows-app/overview) (last updated July 2026) says Windows App connects remotely to Windows devices and apps from Azure Virtual Desktop, Windows 365 Cloud PCs, Microsoft Dev Box, Remote Desktop Services and PCs. It runs on Windows, macOS, iOS/iPadOS, Android/Chrome OS, web browsers and the Meta Quest headset. The matrix of services and platforms:

| Service | Windows | macOS | iOS/iPadOS | Android/Chrome OS | Web browser | Meta Quest |
|---|---|---|---|---|---|---|
| [Azure Virtual Desktop](/entity/azure-virtual-desktop/) | Yes | Yes | Yes | Yes | Yes | Yes |
| [Windows 365](/entity/windows-365/) | Yes | Yes | Yes | Yes | Yes | Yes |
| Microsoft Dev Box | Yes | Yes | Yes | Yes | Yes | Yes |
| Remote Desktop Services | No (use the Remote Desktop app) | Yes | Yes | Yes | No | Yes |
| Remote PC | Yes | Yes | Yes | Yes | No | Yes |

Two details matter for planning. First, the [get-started page](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps) labels Meta Quest support as preview, while the overview page carries no preview label; treat Quest as preview until the pages agree. Second, remote PC connections need no Windows App sign-in, whereas the four hosted services do, and Learn says a personal Microsoft account cannot be used. Remote PC connections on Windows became generally available with Windows App 2.0.1482.0 on 6 October 2026, according to the [Windows App release notes](https://learn.microsoft.com/en-us/windows-app/whats-new).

Users see what an administrator assigned to them. The Learn connect steps say the **Devices** and **Apps** tabs are hidden when no resource of that type is assigned, so an empty app is usually an assignment question, not a client fault. See [the workspace](/entity/avd-workspace/) for how published resources reach users.

## What it replaces

Learn's [client overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/remote-desktop-clients-overview) states that Windows App is the new way to connect all cloud and remote resources and replaces the Remote Desktop client. It also records the status of each older client:

- **Remote Desktop client for Windows (MSI) and the Remote Desktop web client:** as of 27 March 2026, no longer supported for public cloud environments. Support for the MSI client was extended until 28 September 2026 for Azure Government, Azure operated by 21Vianet and AVD Classic, a date that has now passed. For the web client in Azure Government and Azure operated by 21Vianet, Learn says no end-of-support date is announced.
- **Remote Desktop app for Windows (Microsoft Store):** no longer supported and no longer available for download; end of support was September 2025. The same page's matrix still contains an older line about availability until 27 May 2025, so read the body text, which is the newer statement.
- **macOS and iOS/iPadOS:** the matrix says the Remote Desktop clients are not available to download and were replaced by Windows App.
- **Android:** the Azure Virtual Desktop what's new page (April 2025) says Windows App replaces the Remote Desktop client on Android and that existing installations change to Windows App on the next update.

One more behavior to know: the connect article says external identities in the Azure cloud require Windows App, while the Remote Desktop client supports external identities only for Azure for US Government.

The exception in the table is Remote Desktop Services on Windows. The Windows App overview says to continue using the Remote Desktop app on Windows for it, and the get-started page links that note to the MSI pivot of the connect article, while the client matrix lists the MSI client as not connecting to Remote Desktop Services. Because the pages do not line up, confirm this case with Microsoft before you plan around it.

## Where the client changes the experience

A remote session has two sides: the host, which an administrator configures, and the client, which the user chooses. [Windows App's comparison page](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features) (updated November 2026) warns that redirection depends on administrator configuration, the local platform, the hosting service and where the behavior is controlled, and that the more restrictive setting takes precedence. It also says drive, clipboard, printer and USB redirection are disabled by default. The page does not label its tables by service; the rows below are from the Azure Virtual Desktop variants of its tables.

| Area | Windows | macOS | iOS/iPadOS | Android/Chrome OS | Web browser |
|---|---|---|---|---|---|
| Integrated apps (RemoteApp as if local) | Yes | Yes | No | No | No |
| USB and serial redirection | Yes | No | No | No | No |
| Multimedia redirection | Yes | No | No | No | No |
| Token protection | Yes (2.0.379.0 or later) | No | No | No | No |
| RDP Shortpath for managed networks | Yes | Yes | Yes | Yes | No |
| Private Link | Yes | Yes | Yes | Yes | No |
| Smart card with SSO off | Yes | Yes | No | No | No |

Three groups of rows deserve a closer look.

**Sign-in.** Signing in to the service itself accepts passwords and Microsoft Authenticator on all listed platforms, and Windows Hello for Business only on Windows and in a browser on a local Windows device. Once the session starts, the picture changes. With [single sign-on](/entity/avd-single-sign-on/) disabled, the remote-session table lists password on every platform, passkeys and Authenticator on none, and smart cards on Windows and macOS. If your plan relies on passwordless sign-in, turn SSO on and test each client type.

**Protection features.** [Screen capture protection](/entity/avd-screen-capture-protection/) is listed for Windows, macOS, iOS/iPadOS, Android/Chrome OS and the browser. On iOS/iPadOS and Android it requires Intune mobile application management (not available for Chrome OS), and in a browser it requires Microsoft Edge for Business with an Intune app protection policy and a Conditional Access policy. [Display Protection](/entity/avd-display-protection/) and Input Protection are labeled preview, available only on Windows with Windows App 2.0.1236.0 or later when connecting to Windows 365 or Azure Virtual Desktop, and the Windows release notes describe Display Protection as public preview from August 2026. [Watermarking](/entity/avd-watermarking/) is listed for all five of those platforms.

**Media.** For [Teams media optimization](/entity/avd-teams-media-optimization/), the WebRTC rows are listed for Windows, macOS, iOS/iPadOS and Android/Chrome OS and not for the browser. The SlimCore row is listed for Windows and macOS only, although the Windows 365 what's new page for March 2026 describes SlimCore on macOS as preview, so check the current status before you rely on it. Multimedia redirection is a Windows-only row, which matters if browser video playback is part of your workload.

For mobile specifics such as minimum OS versions and Intune settings, see the separate article on connecting from Mac, iOS and Android.

## Windows 365 behavior in the same app

The same app also exposes Cloud PC actions that Azure Virtual Desktop does not have. Learn's [device actions](https://learn.microsoft.com/en-us/windows-app/device-actions) page lists nine actions in Windows App on Windows. For Windows 365 Enterprise and Windows 365 Flex (Dedicated) all nine apply, including **Restart**, **Restore**, **Reset**, **Rename** and **Inspect connection**. For Azure Virtual Desktop only **Pin to** and **Settings** apply. Windows 365 Flex (Shared) gets **Reset**, **Settings** and **View details**.

Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026; Learn says the product, licensing and capabilities are unchanged and only the name is different. See [Windows 365 Flex, formerly Frontline](/entity/windows-365-frontline/). In the feature comparison, Flex is listed for every platform except Meta Quest, while [Windows 365 Boot](/entity/windows-365-boot/) and Windows 365 Switch (which switches between the local device and a Cloud PC in Task view) are listed for Windows only. If shared devices or a fast switch between local and cloud desktops are part of the design, the client platform is therefore not a free choice.

The Windows 365 what's new page also says that eligible users can start Cloud PC provisioning for Windows 365 Reserve from Windows App; the entry for the week of 14 September 2026 is labeled generally available, and the earlier April 2026 entry was public preview.

## The web client

The browser version needs no installation. Learn gives `https://windows.cloud.microsoft/` as the address and shows that `?tenant=<domainName>&loginHint=<email>` can pre-fill the organization and account. For Azure Virtual Desktop the get-started page lists these minimums: Microsoft Edge 131, Google Chrome 130, Apple Safari 18 (macOS) and Mozilla Firefox 128. Since 15 June 2025 the browser must also be no more than 12 months old, support the AVC codec and have WebGL enabled. Mobile browsers are not supported. The Windows 365 tab of the same page lists its own version minimums, so read the tab that matches your service.

The table above shows the cost of the browser option: no RDP Shortpath, no Private Link, no USB redirection, and file transfer limited to uploading and downloading. Check these rows before you choose the browser for users who need those features.

## Choosing a client

Use these checks, in this order:

1. **Service first.** For Azure Virtual Desktop, Windows 365 and Dev Box, Windows App covers every platform in the first table. For Remote Desktop Services on Windows, follow Learn's note on the Remote Desktop app.
2. **Required features second.** Check each must-have feature (integrated apps, USB, multimedia redirection, Windows 365 Boot) against the platform columns before assigning users to a device type.
3. **Identity third.** Decide whether users need passkeys, smart cards or Windows Hello for Business in the remote session, and check the single sign-on columns.
4. **Network last.** Shortpath and Private Link are not available in the browser, so use an installed client where those are required.
5. **Version and cloud.** On Windows the supported operating systems are Windows 11, Windows 10 version 1809 or later (Windows 10 versions out of mainstream support need Extended Security Updates) and Windows Server 2019 or later. Windows App ships through the Microsoft Store or as a standalone MSIX installer, and the release notes list public and Insider channels.

The Windows App page for [what's new](https://learn.microsoft.com/en-us/windows-app/whats-new) lists frequent Windows releases; the public build 2.0.1485.0 was released on 23 October 2026, and the Insider build 2.0.1592.0 on 2 November 2026. Several rows in the comparison carry minimum version numbers, so record the Windows App version when you test a feature.

## Limits of this article

Several comparison rows are labeled preview or beta, for example RDP Multipath with UDP on macOS (beta build 11.3.8) and in-session passwordless authentication on macOS, iOS and Android, and Meta Quest support is labeled preview on the get-started page. Treat every preview row as subject to change.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: What is Windows App?](https://learn.microsoft.com/en-us/windows-app/overview)
- [Microsoft Learn: Get started with Windows App to connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features)
- [Microsoft Learn: What's new in Windows App](https://learn.microsoft.com/en-us/windows-app/whats-new)
- [Microsoft Learn: Device actions in Windows App](https://learn.microsoft.com/en-us/windows-app/device-actions)
- [Microsoft Learn: Remote Desktop clients overview, connection matrix and status](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/remote-desktop-clients-overview)
- [Microsoft Learn: Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-windows)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
