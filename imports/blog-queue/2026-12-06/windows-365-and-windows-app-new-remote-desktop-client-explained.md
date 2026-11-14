---
title: "Windows 365 and Windows App: The New Remote Desktop Client Explained"
summary: "How to connect to Windows 365 Cloud PCs with Windows App, the web client and what happened to the old Remote Desktop clients, with retirement dates, supported platforms and setup steps from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [windows-365, windows-app, azure-virtual-desktop]
keypoints:
  - "Microsoft Learn calls Windows App the recommended application to connect to Windows 365 Cloud PCs. It runs on Windows, macOS, iOS, Android, ChromeOS and in a browser."
  - "The Remote Desktop client for Windows (MSI) lost public cloud support on March 27, 2026. The Microsoft Store Remote Desktop app is no longer available."
  - "Windows App on Windows does not support Remote Desktop Services. Keep using the Remote Desktop app for that."
  - "The web client at windows.cloud.microsoft works with Windows 365 Business, Enterprise, Flex and Government."
  - "Sign-in needs a work or school account. Personal Microsoft accounts are not supported."
faq:
  - q: "Is Windows App the replacement for the Remote Desktop app?"
    a: "For Azure Virtual Desktop and Windows 365, yes. Microsoft Learn says Windows App replaces the Remote Desktop client for these services. It does not replace the Remote Desktop app for Remote Desktop Services on Windows, where Microsoft says to keep using the Remote Desktop app."
  - q: "When did the old Remote Desktop clients stop being supported?"
    a: "Microsoft Learn says the Remote Desktop client for Windows (MSI) is no longer supported for the public cloud from March 27, 2026, with later dates for Azure Government, Azure operated by 21Vianet and AVD Classic. The Microsoft Store app is no longer available. The sources give slightly different wording for the Store app's dates."
  - q: "Can I still use mstsc.exe with a Cloud PC?"
    a: "The Windows 365 access page says the Remote Desktop Connection client (mstsc.exe) is not a supported connection method. It may work for troubleshooting but should not be used for daily access."
  - q: "Can I connect without installing anything?"
    a: "Yes. Microsoft Learn lists the web client at windows.cloud.microsoft for all four editions it names, using Microsoft Edge, Google Chrome, Safari or Mozilla Firefox 55.0 or later on Windows, macOS, ChromeOS or Linux."
  - q: "Which devices can run Windows App?"
    a: "Microsoft Learn lists Windows 11, Windows 10 version 1809 or later and Windows Server 2019 or later, plus macOS, iOS and iPadOS, Android and ChromeOS, web browsers and Meta Quest. Windows 10 devices out of mainstream support must be enrolled in Extended Security Updates."
---
To connect to a Windows 365 Cloud PC, use Windows App. It is the client Microsoft recommends, and it replaces the older Remote Desktop clients for Windows 365 and Azure Virtual Desktop. You can also connect from a browser. This article covers the options, the retirement dates and the first-time setup.

## The access options for Windows 365

Microsoft's Windows 365 end-user access page lists these methods:

| Edition | Windows App | Web client | Microsoft Remote Desktop |
|---|---|---|---|
| Business | Yes | Yes | Yes, but the page says support will end in March 2026 |
| Enterprise | Yes | Yes | Yes, but the page says support will end in March 2026 |
| Flex | Yes | Yes | No |
| Government | Yes | Yes | No |

The page calls Windows App the recommended application, usable on any device. The web client is at `windows.cloud.microsoft`. The page also lists LG webOS 23 for Business and Enterprise.

## What happened to the old clients

The Remote Desktop client overview on Microsoft Learn states the status:

- **Remote Desktop client for Windows (MSI):** support for the public cloud ends March 27, 2026. Support is extended to September 28, 2026 for Azure Government, Azure operated by 21Vianet and AVD Classic.
- **Remote Desktop app from the Microsoft Store:** no longer supported and no longer available to download. The Windows 365 page gives May 27, 2025 as the date from which it was no longer available. The client overview gives September 2025 for end of support. Treat these as two different milestones and check the live pages.
- **Remote Desktop web client:** not supported for the public cloud as of March 27, 2026.
- **macOS and iOS or iPadOS:** the old app is not available to download. Windows App replaced it.
- **Android and ChromeOS:** available from Google Play, with no retirement date on that page.

The Windows 365 page adds that `mstsc.exe` is not a supported method. It may work for troubleshooting, but it should not be used daily.

## What Windows App connects to

Windows App connects to Azure Virtual Desktop, Windows 365 Cloud PCs, Microsoft Dev Box, Remote Desktop Services and remote PCs. Supported platforms are Windows, macOS, iOS and iPadOS, Android and ChromeOS, web browsers and Meta Quest. Features listed include a home screen with pinned devices and apps, switching between accounts, multiple monitors, dynamic resolution and scaling, redirection for webcams, audio, storage and printers, and Microsoft Teams optimizations.

One important limit: on Windows, Windows App does not support Remote Desktop Services. Microsoft says to continue using the Remote Desktop app on Windows for that.

## Set up Windows App on Windows

Prerequisites from Microsoft Learn:

- Internet access to download from the Microsoft Store and to connect. If your network blocks access, allow the endpoints listed for Azure Virtual Desktop end-user devices.
- A work or school account with devices or apps assigned by your administrator. Personal Microsoft accounts are not supported.
- Windows 11, Windows 10 version 1809 or later, or Windows Server 2019 or later. Windows 10 devices out of mainstream support must be enrolled in Extended Security Updates.

Steps:

1. Install Windows App from the Microsoft Store. A standalone `.msix` installer is also available through the "What's new in Windows App" page.
2. Open Windows App and select **Sign in**. On a managed device signed in with a work or school account, sign-in is automatic.
3. Select the **Devices** or **Apps** tab. A tab is hidden if nothing of that type is assigned to you.
4. Find the device or app, then select **Connect**. Depending on your administrator's configuration, you may be asked for your password again.
5. Add favorites to the **Favorites** tab. Cloud PCs and Dev Boxes can also be added to **Task view** in Windows 11.

Microsoft notes that your administrator must have set up the resources and made them available to you.

## Web client notes

The web client needs Microsoft Edge, Google Chrome, Safari or Mozilla Firefox 55.0 or later. Microsoft says that turning on the keyboard shortcuts option, which is a public preview feature, opens the web client in full-screen mode, that the shortcuts work only in full-screen mode, and that full screen through F11 is not supported. On LG TV some features such as file transfer and clipboard are unavailable.

## Migration checklist for admins

This checklist is my own summary of the dates and limits above, not a Microsoft procedure.

1. Find users still on the Remote Desktop MSI client or the old Store app.
2. Move them to Windows App and test sign-in with the work or school account.
3. Keep the Remote Desktop app only for Remote Desktop Services on Windows.
4. Check your network rules against the endpoint list.
5. Stop using `mstsc.exe` as the daily path to Cloud PCs.

## What the pages do not say

The pages do not describe a separate "new Remote Desktop client" product beyond Windows App, and they give no Windows 365-specific setup steps apart from the general flow. The two Learn pages differ on the Store app dates, so verify them before you publish dates to users.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Windows App](https://www.m365.fm/entity/windows-app/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [Access a Cloud PC (Windows 365)](https://learn.microsoft.com/en-us/windows-365/end-user-access-cloud-pc)
- [What is Windows App?](https://learn.microsoft.com/en-us/windows-app/overview)
- [Get started with Windows App](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Remote Desktop client overview](https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/overview)
