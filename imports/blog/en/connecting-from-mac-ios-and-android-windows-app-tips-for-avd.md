---
title: "Connecting from Mac, iOS and Android: Windows App tips for AVD"
summary: "Windows App connects to Azure Virtual Desktop from macOS, iOS/iPadOS and Android/Chrome OS, but several features that work on Windows are missing there. This guide covers requirements, sign-in steps, the feature gaps that surprise users, and the security settings that differ on mobile."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-app, azure-virtual-desktop]
keypoints:
  - "Learn's requirements for Azure Virtual Desktop: macOS 12.0 or later, iOS or iPadOS 17.0 or later, Android 10 or later, Chrome OS 126 or later. The Windows 365 tab of the same page lists different minimums for macOS and iOS."
  - "Several features are Windows-only or limited elsewhere: multimedia redirection, USB and serial redirection, scanners, third-party virtual channel plugins and Display Protection. Dynamic resolution is missing on iOS/iPadOS and Android."
  - "Integrated RemoteApps are listed for Windows and macOS only; on iOS/iPadOS and Android, a RemoteApp opens inside Windows App."
  - "Screen capture protection on iOS/iPadOS and Android works through an Intune MAM policy that blocks screen capture, and a connection is blocked if that policy is missing."
  - "With single sign-on off, iOS and Android can authenticate to the remote session with a password only; smart cards and Windows Hello for Business are not listed there."
faq:
  - q: "Which Windows App versions and operating systems do I need on Mac, iPhone and Android?"
    a: "For Azure Virtual Desktop, Learn lists macOS 12.0 or later, iOS or iPadOS 17.0 or later, and Android 10 or later (Chrome OS 126 or later). The page also notes that the Windows 365 tab lists macOS 14.0 and iOS/iPadOS 16.0 as minimums, so check the tab that matches your service."
  - q: "Can users on mobile devices use RemoteApp, USB devices or multiple monitors?"
    a: "Learn's comparison lists multiple monitors for Windows, macOS and Android/Chrome OS (ChromeOS devices only for Android), USB redirection for Windows only, and integrated apps for Windows and macOS only. Test each case on the platform in question."
  - q: "Why is a user on iOS or Android blocked when screen capture protection is enabled?"
    a: "When screen capture protection is enabled on the session hosts, Learn says Android and iOS/iPadOS connections are allowed only if an Intune MAM app protection policy that blocks screen capture applies to Windows App. Without it, the connection is blocked."
---

Windows App connects to [Azure Virtual Desktop](/entity/azure-virtual-desktop/) from macOS, iOS/iPadOS and Android/Chrome OS, with the same account and the same workspace as on Windows. What differs is the feature set: several things that users know from a Windows PC are not offered on a Mac, an iPad or an Android phone, and a few security controls depend on Intune settings that only apply to mobile apps. This article lists the requirements, the sign-in steps, the gaps that cause support tickets, and what an admin should check before assigning pools to these devices. The general overview of the client belongs to other articles in this series; this one covers the non-Windows platforms.

## Platform requirements

Microsoft Learn's [Connect to Windows devices and apps with Windows App](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps) page lists these requirements for Azure Virtual Desktop:

| Platform | Source of the app | Minimum OS (Azure Virtual Desktop tab) |
|---|---|---|
| macOS | Mac App Store, or a standalone `.pkg` installer | macOS 12.0 |
| iOS/iPadOS | App Store | iOS or iPadOS 17.0 |
| Android/Chrome OS | Google Play Store | Android 10, Chrome OS 126 |

The device must be actively supported by its manufacturer, and users need a work or school account: Learn says you can't sign in to [Windows App](/entity/windows-app/) with a personal Microsoft account. The same page shows different minimums on its Windows 365 tab (macOS 14.0 and iOS/iPadOS 16.0), so use the tab that matches the service. Learn also says visionOS is supported only in compatibility mode, and that Meta Quest support is in preview. Windows App in a web browser does not support mobile browsers.

Unlike on Windows, the Remote Desktop client is not the only route. On the platforms covered here, Windows App is the client that the connect page documents, and the watermarking page lists the older Remote Desktop client for macOS (10.9.5 or later) and iOS/iPadOS (10.5.4 or later) next to it. This article covers Windows App only.

## Signing in on each platform

The steps differ slightly from Windows:

1. **macOS.** Install and open Windows App. It opens on the **Devices** tab. Select the plus (**+**) icon, then **Add Work or School Account**, and sign in. Double-click a device or app to connect.
2. **iOS/iPadOS.** On first start, iOS may ask permission to use Bluetooth and to connect to devices on the local network; Learn says to allow both if users need Bluetooth devices or local PCs. Tap **Work or School Account**, sign in, then tap a device or app.
3. **Android/Chrome OS.** Tap **Sign in** when prompted to add a connection. When connecting, Android shows a trust prompt, "Make sure you trust the remote PC before you connect", with toggles for the local resources the session may use and a **Never ask again for connections to this PC** box. Android may also ask for camera, microphone, location and file access.

For a remote session hosted in another cloud, use the workspace option instead of the account option. Learn lists the feed discovery URLs: `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` for Azure for US Government and `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` for Azure operated by 21Vianet.

If users see an empty list, Learn's advice is to contact the administrator: the **Devices** and **Apps** tabs show only what the account has been assigned.

## Feature gaps to expect

[Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features) (updated November 2026) gives a feature table per service. For Azure Virtual Desktop, these rows matter most:

| Feature | macOS | iOS/iPadOS | Android/Chrome OS |
|---|---|---|---|
| Integrated apps (RemoteApp as local apps) | Yes | No | No |
| Dynamic resolution | Yes | No | No |
| Multiple monitors | Yes | No | Yes (ChromeOS devices only) |
| Selected monitors | No | Yes | No |
| Smart sizing | Yes | No | No |
| Multimedia redirection (video, calls) | No | No | No |
| Teams media optimizations (WebRTC) | Yes | Yes | Yes |
| Teams media optimizations (SlimCore) | Yes | No | No |
| Printers | Yes, with limits | No | No |
| Scanners | No | No | No |
| USB and serial ports | No | No | No |
| Smart cards | Yes | Yes, preview, YubiKey only | No |
| Location | No | Yes | Yes |
| Touch and pen | No | Yes | Yes |

Details that matter in practice:

- **Printing on macOS.** Windows App supports the Publisher Imagesetter printer driver by default (CUPS only); native printer drivers are not supported.
- **Clipboard.** Bidirectional clipboard is listed for all three, but text and images only on iOS/iPadOS and text only on Android. Learn says macOS supports a one-way clipboard natively, while other platforms need remote session configuration for it.
- **Keyboard language.** Keyboard input language redirection is listed for macOS but not for iOS/iPadOS or Android.
- **Interface language.** The user interface is English (United States) only on macOS and iOS/iPadOS; Android offers many more locales.
- **WebAuthn.** Passkey redirection into the session is in preview on all three, with minimum Windows App versions: macOS 11.4.2, iOS 11.3.7, Android 11.0.0.119. On Android the passkey must be stored on the device by a software provider such as Microsoft Authenticator; passkeys from a physical key or QR code are not supported.

The practical consequence for pool design: a workload that needs USB tokens, scanners, serial devices or heavy video playback with multimedia redirection has to be limited to Windows clients. Users on tablets who need a "real" desktop feel will notice the missing dynamic resolution and smart sizing.

## Authentication differences

For sign-in to the service, Learn lists passwords, Microsoft Authenticator and passkeys as available on all three platforms (passkeys with minimum app versions). Smart card with Microsoft Entra certificate-based authentication is listed for macOS and iOS/iPadOS, and smart card with Active Directory Federation Services for macOS only among these three. Windows Hello for Business is not listed for any of them.

For the remote session itself, with single sign-on disabled, Learn lists only a password for iOS/iPadOS and Android. macOS adds smart card, which needs smart card redirection with Network Level Authentication disabled. If your session hosts rely on smart cards or Windows Hello for Business certificates for in-session sign-in, mobile users are not covered. Single sign-on avoids the problem by passing the cloud credentials to the session, which makes it the practical default for these devices.

External identities (guest users) are listed as generally available on macOS from 11.4.2, on iOS from 11.3.9 and on Android from 11.0.0.119, with a limit on iOS and Android: you can only sign in as a work or school account, or a Microsoft account that is signed in to Authenticator as a connected account.

## Security settings that behave differently

Learn lists these security features for Azure Virtual Desktop: screen capture protection and watermarking on all of the platforms here, and Display Protection and Input Protection on Windows only (in preview).

**Screen capture protection** needs more setup on mobile, as described on Learn's [screen capture protection](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection) page:

- On macOS, the setting on the session host or Cloud PC is enforced by Windows App itself. Learn also warns that on macOS it might interfere with screen sharing in Microsoft Teams and that some native apps might not fully respect it.
- On iOS/iPadOS and Android, it works through hybrid enforcement. With protection enabled on the session hosts, Windows App connects only if an Intune MAM app protection policy that blocks screen capture applies. Minimum app versions: Windows App 11.2.4 on iOS/iPadOS, 11.0.0.94 on Android. ChromeOS is not covered because Intune MAM is not supported there.
- In the MAM policy, set **Screen capture** to **Block** for the platform.

An iPhone user without the policy is blocked, not silently unprotected. Check that the policy is assigned before you roll the session host setting out to a mixed fleet.

**Watermarking** is listed for all platforms, with Android/Chrome OS marked preview on Learn's [watermarking](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking) page. It applies to remote desktops only.

## A short checklist for admins

1. Decide per host pool which platforms you support, using the table above.
2. Confirm minimum OS and app versions on the device fleet, and which service tab of the connect page applies.
3. Enable single sign-on, so mobile users do not depend on password or smart card prompts in the session.
4. If you enable screen capture protection on session hosts, assign the Intune MAM policy and a matching Conditional Access policy before allowing mobile connections.
5. Test one device per platform: sign-in, RemoteApp launch, printing, clipboard and Teams.
6. Tell users what will not work on their device, in plain words, before the first ticket.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Connect to Windows devices and apps with Windows App](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features)
- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
