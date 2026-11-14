---
title: "Configure a Windows Kiosk with Intune: Single-App and Multi-App Modes"
summary: "Intune can lock a Windows device to one app or to a set of apps with a kiosk configuration profile. This guide covers how to create the profile, the single-app and multi-app options, the one-profile-per-device rule, the standard-user behavior and where Windows 11 multi-app kiosks are documented."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [intune, microsoft-edge]
keypoints:
  - "Create the kiosk profile in Intune with platform Windows 10 and later and profile type Templates, then Kiosk."
  - "Two modes exist: single app full-screen kiosk and multi app kiosk."
  - "Learn says a device can have only one kiosk profile; use a custom OMA-URI profile if you need more."
  - "Single-app kiosks can run Microsoft Edge, a kiosk browser app or a Store app, with Edge in public browsing or digital signage style."
  - "Multi-app kiosk settings in Intune are described for Windows 10; Learn points to a separate article for Windows 11 multi-app kiosks."
faq:
  - q: "Where do I create a kiosk profile in Intune?"
    a: "In the admin center, go to Devices, Manage devices, Configuration, then Create and New policy. Choose Windows 10 and later as the platform, and Templates as the profile type, then select Kiosk."
  - q: "What is the difference between single-app and multi-app?"
    a: "Single-app runs one app full screen. Multi-app shows a restricted Start experience with the apps you allow. Learn lists different settings for each mode."
  - q: "Can a device have two kiosk profiles?"
    a: "No. Learn says a device can have only one kiosk profile. If you need more complex setups, you can use a custom profile with OMA-URI settings."
  - q: "Does the kiosk profile apply to administrators?"
    a: "Learn says the kiosk profile loads for standard users and not for local administrators."
  - q: "Where are Windows 11 multi-app kiosks covered?"
    a: "The Intune reference page describes multi-app kiosk settings for Windows 10 and points to a separate article for Windows 11 multi-app kiosks. The Windows article on multi-app kiosks with assigned access covers the XML approach."
---

An Intune kiosk profile restricts a Windows device to one app or to a chosen set of apps. You create it as a device configuration template, choose single-app or multi-app mode, and assign it to devices. Learn limits a device to one kiosk profile and says the profile loads for standard users, not for local administrators. This article follows three Learn pages: the kiosk profile article for Windows and Holographic devices, the kiosk settings reference for Windows, and the Windows article on configuring a multi-app kiosk with assigned access.

## Create the profile

Per Learn, in the Microsoft Intune admin center:

1. Go to Devices, Manage devices, Configuration.
2. Select Create, then New policy.
3. For Platform, choose Windows 10 and later. For Profile type, choose Templates, then Kiosk.
4. Choose the kiosk mode: single app full-screen kiosk or multi app kiosk.
5. Configure the settings, assign the profile and save.

A device can have only one kiosk profile. If you need more, Learn says to use a custom profile with OMA-URI settings.

## Single-app kiosk settings

The reference page lists these settings for the single app mode:

- **User logon type.** Auto logon (the page notes Windows 10 version 1803 and later), Local user account, or a Microsoft Entra user or group.
- **Application type.** Microsoft Edge (the page notes version 87 and later), Edge Legacy, a kiosk browser app or a Store app.
- **Edge kiosk URL.** The address the browser opens.
- **Edge kiosk mode type.** Public browsing (InPrivate), or Digital or interactive signage.
- **Refresh browser after idle time.** A value from 0 to 1440.
- **Maintenance window.** A time window for restarts.

Learn adds that a kiosk browser with automatic sign-in needs an offline license.

## Multi-app kiosk settings

For the multi-app mode on Windows 10, the reference lists options such as:

- **Targeting Windows 10 in S mode devices.**
- **Browsers.** Settings for which browsers are available.
- **Applications.** Add Store apps, Win32 apps by path, or apps by Application User Model ID (AUMID).
- **AutoLaunch.** One app can start automatically.
- **Start menu tile size**, and an alternative Start layout in XML.
- **Taskbar** settings.
- **Downloads folder access.**

The page says the kiosk profile loads for standard users and does not load for local administrators. For Windows 11 multi-app kiosks, the page points to a different article rather than listing the settings itself.

## Assigned access and XML

Learn's article on configuring a multi-app kiosk with assigned access describes the XML-based method:

- You can deliver the XML through the AssignedAccess configuration service provider, using a custom policy with the OMA-URI `./Vendor/MSFT/AssignedAccess/Configuration`, or through a provisioning package, or with PowerShell using the WMI bridge, run as SYSTEM.
- The configuration takes effect at the next sign-in of the assigned account.
- The default breakout sequence is Ctrl+Alt+Del.
- An idle timeout can be set through a registry value, which the article describes.
- Removing the configuration does not revert changes the kiosk made to the Start menu.

## Windows 10 note

The Intune reference page includes a note about Windows 10 end of support, which was October 14, 2025. It says Windows 10 devices are still allowed in Intune but that this is not guaranteed. For a new kiosk project, I would plan on a currently supported Windows version, which is my advice and not part of the page.

## Planning and testing a kiosk

This section is my advice, not a Microsoft statement.

1. **Write down the one task.** A kiosk is easiest when it does one thing, such as a visitor check-in page or a single line-of-business app.
2. **Choose the mode from the task.** One app or one website suggests single app. A few approved apps suggest multi-app.
3. **Pick the sign-in model.** Learn lists auto logon, local user and Entra user or group. Choose the one that fits how the device is managed and who uses it.
4. **Test with a standard account.** Because the profile loads only for standard users, an admin test will mislead you.
5. **Plan for the breakout.** Decide who can get out of the kiosk and how, for example for maintenance.
6. **Set the maintenance window deliberately.** Restarts and updates on a public-facing device should happen at a quiet time.
7. **Keep the one-profile rule in mind.** Combine all the settings you need into the single kiosk profile, or use the custom route.
8. **Pilot on one device first.** Confirm sign-in, the app launch and the behavior after a restart.

## Common problems

This section is my advice, not a Microsoft statement.

- **The kiosk does not start when testing as an admin.** This matches Learn's note that it loads for standard users.
- **A change does not appear.** The XML method takes effect at the next sign-in, so sign out and in, or restart.
- **A removed configuration leaves a changed Start menu.** Learn says removing the configuration does not revert Start menu changes, so plan a clean-up or a reset.
- **An app needs a path or AUMID.** For Win32 apps you provide the path, and for others the AUMID, so collect them before you build the profile.

## What I did not read

I read the three Learn pages in the order above but not the separate Windows 11 multi-app article that the reference page points to. I did not read the Microsoft Edge kiosk documentation, the Holographic settings or the custom OMA-URI how-to in detail.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Edge](https://www.m365.fm/entity/microsoft-edge/)

## Sources

- [Kiosk settings for Windows and Holographic devices in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-configuration/templates/configure-kiosk)
- [Kiosk settings for Windows in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-configuration/templates/ref-kiosk-settings-windows)
- [Configure a Multi-App Kiosk With Assigned Access (Microsoft Learn)](https://learn.microsoft.com/windows/configuration/assigned-access/configure-multi-app-kiosk)
