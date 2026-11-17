---
title: "Windows App: the single client for Azure Virtual Desktop and Windows 365"
summary: "Windows App is Microsoft's client for Azure Virtual Desktop, Windows 365 and Microsoft Dev Box on Windows, macOS, iOS/iPadOS, Android/Chrome OS, web browsers and Meta Quest, with narrower platform support for Remote Desktop Services and remote PCs. This article explains what it replaces, what it connects to, and which behavior comes from the client rather than the host."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-app, azure-virtual-desktop]
keypoints:
  - "Learn says Windows App replaces the Remote Desktop client. For Azure Virtual Desktop and Windows 365 it is the client to migrate to; Learn's connection table lists Remote Desktop Services as not supported on Windows and says to keep using the Remote Desktop app there."
  - "As of March 27, 2026, the Remote Desktop client for Windows (MSI) and the Remote Desktop web client are no longer supported for public cloud environments. The Microsoft Store Remote Desktop app reached end of support in September 2025."
  - "Features differ by platform. In the comparison table for Azure Virtual Desktop, integrated apps are listed for Windows and macOS only, and USB redirection, serial redirection, multimedia redirection and token protection for Windows only."
  - "Redirection depends on administrator configuration, the local platform, the hosting service and where the behavior is controlled; the more restrictive setting wins. Drive, clipboard, printer and USB drive redirection are disabled by default."
  - "Windows App in a browser opens at windows.cloud.microsoft. For Azure Virtual Desktop, Learn lists Edge 131, Chrome 130, Safari 18 and Firefox 128 as minimums, and the browser must be no more than 12 months old, support the AVC codec and have WebGL enabled."
faq:
  - q: "Does Windows App replace the Remote Desktop client for everything?"
    a: "Not for everything. Learn's client overview says Windows App replaces the Remote Desktop client and tells users to migrate to keep access to Azure Virtual Desktop and Windows 365. The Windows App overview lists Remote Desktop Services as not supported on Windows and says to continue using the Remote Desktop app there."
  - q: "Can users sign in to Windows App with a personal Microsoft account?"
    a: "No. Learn says sign-in for Azure Virtual Desktop, Windows 365, Microsoft Dev Box and Remote Desktop Services needs a work or school account provided by the administrator; a personal Microsoft account does not work. Connecting to a remote PC does not require signing in to Windows App."
  - q: "Is Windows App the same on every platform?"
    a: "No. Learn publishes a comparison per service. On Windows it offers the widest set, including integrated apps, USB and serial redirection, token protection and the Windows 365 Boot and Switch features; the web browser, iOS/iPadOS and Android/Chrome OS clients each lack several of these. Check the comparison for your service before you promise a feature to a user group."
---

Windows App is the client Microsoft documents for reaching Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services and remote PCs from one app. For Azure Virtual Desktop and Windows 365 it replaces the Remote Desktop clients, but it is not identical on every platform, and some features that users expect depend on the platform they connect from. This article explains the concept and the decisions that follow from it.

## What Windows App connects to

Learn's [overview](https://learn.microsoft.com/en-us/windows-app/overview) (last updated July 2026) says Windows App connects remotely to Windows devices and apps from Azure Virtual Desktop, Windows 365 Cloud PCs, Microsoft Dev Box, Remote Desktop Services and PCs. It runs on Windows, macOS, iOS/iPadOS, Android/Chrome OS, web browsers and the Meta Quest headset. The matrix of services and platforms:

| Service | Windows | macOS | iOS/iPadOS | Android/Chrome OS | Web browser | Meta Quest |
|---|---|---|---|---|---|---|
| [Azure Virtual Desktop](/entity/azure-virtual-desktop/) | Yes | Yes | Yes | Yes | Yes | Yes |
| [Windows 365](/entity/windows-365/) | Yes | Yes | Yes | Yes | Yes | Yes |
| Microsoft Dev Box | Yes | Yes | Yes | Yes | Yes | Yes |
| Remote Desktop Services | No (use the Remote Desktop app) | Yes | Yes | Yes | No | Yes |
| Remote PC | Yes | Yes | Yes | Yes | No | Yes |

Two details matter for planning. First, the [get-started page](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps) labels Meta Quest support as preview, while the overview page carries no preview label. Second, remote PC connections need no Windows App sign-in, whereas the four hosted services do, and Learn says a personal Microsoft account cannot be used. Remote PC connections on Windows became generally available with Windows App 2.0.1482.0 on 6 October 2026, according to the [Windows App release notes](https://learn.microsoft.com/en-us/windows-app/whats-new).

Users see what an administrator assigned to them. The Learn connect steps say the **Devices** and **Apps** tabs are hidden when no resource of that type is assigned. See [the workspace](/entity/avd-workspace/) for how published resources reach users.

## What it replaces

Learn's [client overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/remote-desktop-clients-overview) states that Windows App is the new way to connect all cloud and remote resources and replaces the Remote Desktop client. It also records the status of each older client:

- **Remote Desktop client for Windows (MSI) and the Remote Desktop web client:** as of 27 March 2026, no longer supported for public cloud environments. Support for the MSI client was extended until 28 September 2026 for Azure Government, Azure operated by 21Vianet and AVD Classic, a date that has now passed. For the web client in Azure Government and Azure operated by 21Vianet, Learn says no end-of-support date is announced.
- **Remote Desktop app for Windows (Microsoft Store):** no longer supported and no longer available for download; end of support was September 2025. The same page's matrix still contains an older line about availability until 27 May 2025, while the body text gives September 2025.
- **macOS and iOS/iPadOS:** the matrix says the Remote Desktop clients are not available to download and were replaced by Windows App.
- **Android:** the Azure Virtual Desktop what's new page (April 2025) says Windows App replaces the Remote Desktop client on Android and that existing installations change to Windows App on the next update.

The exception in the table is Remote Desktop Services on Windows. The Windows App overview says to continue using the Remote Desktop app on Windows for it, while the client matrix lists the MSI client as not connecting to Remote Desktop Services. The get-started page's prerequisites say Windows App on Windows does not yet support connecting to Remote Desktop Services, so test that path before you plan a migration around it.

## Where the client changes the experience

[Windows App's comparison page](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features) (updated November 2026) warns that redirection depends on administrator configuration, the local platform, the hosting service and where the behavior is controlled, and that the more restrictive setting takes precedence. It also says drive, clipboard, printer and USB drive redirection are disabled by default. The page has a service selector with separate tables for Azure Virtual Desktop, Windows 365, Microsoft Dev Box and Remote PC; the rows in the next table are from the Azure Virtual Desktop view. Meta Quest is left out of the table; Learn lists RDP Shortpath for managed networks for it, but not Private Link or integrated apps.

| Area | Windows | macOS | iOS/iPadOS | Android/Chrome OS | Web browser |
|---|---|---|---|---|---|
| Integrated apps (RemoteApp as if local) | Yes | Yes | No | No | No |
| USB and serial redirection | Yes | No | No | No | No |
| Multimedia redirection | Yes | No | No | No | No |
| Token protection | Yes (2.0.379.0 or later) | No | No | No | No |
| RDP Shortpath for managed networks | Yes | Yes | Yes | Yes | No |
| Private Link | Yes | Yes | Yes | Yes | No |
| Smart card with SSO off | Yes | Yes | No | No | No |

**Sign-in.** Learn has three tables: service sign-in, remote session sign-in with single sign-on off, and in-session authentication. First, signing in to the service itself accepts passwords and Microsoft Authenticator on all listed platforms, passkeys (FIDO2) on every platform except Meta Quest, and Windows Hello for Business only on Windows and in a browser on a local Windows device. On macOS, iOS and Android, passkeys need minimum Windows App versions.

Second, when [single sign-on](/entity/avd-single-sign-on/) is enabled, Learn says the credentials used to sign in to the service are passed through automatically when you connect to the remote session. Third, with SSO disabled, the remote-session table lists password on every platform, passkeys and Authenticator on none, and smart cards on Windows (with smart card redirection) and macOS (with smart card redirection and Network Level Authentication disabled). Windows Hello for Business certificate trust and key trust are listed for Windows only; cloud trust is listed for no platform.

A separate table covers authenticating within a remote session. It lists passkeys on Windows, macOS, iOS/iPadOS and Android/Chrome OS, but not in a browser or on Meta Quest, and Windows Hello for Business certificate, cloud and key trust on Windows, each with WebAuthn redirection. In the redirection table, Learn marks WebAuthn redirection as preview on macOS (version 11.4.2 or higher), iOS (11.3.7 or higher) and Android (11.0.0.119 or higher), for Windows 365 and Azure Virtual Desktop connections and passkey sign-ins to Entra ID only. On Android, passkeys from other devices, such as a security key, are not supported.

**Protection features.** [Screen capture protection](/entity/avd-screen-capture-protection/) is listed for Windows, macOS, iOS/iPadOS, Android/Chrome OS and the browser; Learn's feature description adds that it requires session host configuration. On iOS/iPadOS and Android it requires Intune mobile application management (not available for Chrome OS), and in a browser it requires Microsoft Edge for Business on Windows, version 134.0.3124.51 or later, with an Intune MAM app protection policy that targets Edge and a Conditional Access policy that requires app protection. [Display Protection](/entity/avd-display-protection/) and Input Protection are labeled preview, available only on Windows with Windows App 2.0.1236.0 or later, and only for Windows 365 or Azure Virtual Desktop connections (not Microsoft Dev Box). The Windows release notes describe Display Protection as public preview from August 2026. [Watermarking](/entity/avd-watermarking/) is listed for all five of those platforms in the comparison table, although [Learn's watermarking page](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking) lists Windows App on Android/Chrome OS as preview; check that page before you promise it to Android users.

**Media.** For [Teams media optimization](/entity/avd-teams-media-optimization/), the WebRTC rows are listed for Windows, macOS, iOS/iPadOS and Android/Chrome OS and not for the browser. The SlimCore row is listed for Windows and macOS only; the Windows 365 what's new page for March 2026 describes SlimCore on macOS as preview.

## Windows 365 behavior in the same app

The same app also exposes Cloud PC actions that Azure Virtual Desktop does not have. Learn's [device actions](https://learn.microsoft.com/en-us/windows-app/device-actions) page lists nine actions in Windows App on Windows. For Windows 365 Enterprise and Windows 365 Flex (Dedicated) all nine apply, including **Restart**, **Restore**, **Reset**, **Rename** and **Inspect connection**. For Azure Virtual Desktop only **Pin to** and **Settings** apply. Windows 365 Flex (Shared) gets **Reset**, **Settings** and **View details**.

Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026; Learn says the product, licensing and capabilities are unchanged and only the name is different. See [Windows 365 Flex, formerly Frontline](/entity/windows-365-frontline/). In the feature comparison, Flex is listed for every platform except Meta Quest, while [Windows 365 Boot](/entity/windows-365-boot/) and Windows 365 Switch (which switches between the local device and a Cloud PC in Task view) are listed for Windows only. These rows come from the Windows 365 view of the comparison page.

## The web client

The browser version needs no installation. Learn gives `https://windows.cloud.microsoft/` as the address and shows that `?tenant=<domainName>&loginHint=<email>` can pre-fill the organization and account. For Azure Virtual Desktop the get-started page lists these minimums: Microsoft Edge 131, Google Chrome 130, Apple Safari 18 (macOS) and Mozilla Firefox 128. Since 15 June 2025 the browser must also be no more than 12 months old, support the AVC codec and have WebGL enabled. Mobile browsers are not supported. The Windows 365 tab of the same page lists older minimums (Edge 79, Chrome 57, Safari 11, Firefox 55); the 12-month, AVC and WebGL requirements appear on all three tabs. Read the tab for your service and test the browser build users run.

The table above shows the cost of the browser option: no RDP Shortpath, no Private Link and no USB redirection. In the device redirection table, Learn limits local drive/storage in a browser to uploading and downloading files.

## Choosing a client

Use these checks, in this order:

1. **Service first.** For Azure Virtual Desktop, Windows 365 and Dev Box, Windows App covers every platform in the first table; Learn labels Meta Quest preview. For Remote Desktop Services on Windows, follow Learn's note on the Remote Desktop app.
2. **Required features second.** Check each must-have feature (integrated apps, USB, multimedia redirection, Windows 365 Boot) against the platform columns before assigning users to a device type.
3. **Identity third.** Decide whether users need passkeys, smart cards or Windows Hello for Business, and check Learn's remote session authentication table (single sign-on off) and in-session authentication table (WebAuthn redirection, which is preview outside Windows and not available in a browser).
4. **Network last.** Shortpath and Private Link are not available in the browser, so use an installed client where those are required.
5. **Version and install source.** For Azure Virtual Desktop, Windows 365 and remote PCs, Windows App on Windows supports Windows 11, Windows 10 version 1809 or later and Windows Server 2019 or later (Windows 10 versions out of mainstream support must be enrolled in the Extended Security Updates program); for Microsoft Dev Box, Learn lists Windows 11 and Windows 10 version 21H2 or later. Windows App ships through the Microsoft Store or as a standalone MSIX installer, and the release notes list public and Insider channels.

The Windows App page for [what's new](https://learn.microsoft.com/en-us/windows-app/whats-new) lists frequent Windows releases; its latest-release table lists public version 2.0.1489.0 and Insider version 2.0.1595.0, both available 10 November 2026. Record the Windows App version when you test a feature, because several rows carry minimum versions.

## Sources


- [Microsoft Learn: What is Windows App?](https://learn.microsoft.com/en-us/windows-app/overview)
- [Microsoft Learn: Get started with Windows App to connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features)
- [Microsoft Learn: What's new in Windows App](https://learn.microsoft.com/en-us/windows-app/whats-new)
- [Microsoft Learn: Device actions in Windows App](https://learn.microsoft.com/en-us/windows-app/device-actions)
- [Microsoft Learn: Remote Desktop clients overview, connection matrix and status](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/remote-desktop-clients-overview)
- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
