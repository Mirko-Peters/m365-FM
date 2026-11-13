---
title: "Teams Rooms Devices Stuck on Windows 10 or Not Updating: What to Check"
summary: "Some Teams Rooms on Windows devices moved to Windows 11 and others show no update. Check edition, app version, update blockers and hardware in this order, and avoid pushing feature updates by hand."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams-rooms, windows-update-for-business]
keypoints:
  - "Learn says Windows 10 support ended on October 14, 2025. Devices on build 10.0.19045 or lower must move to Windows 11 if eligible, or be replaced."
  - "Teams Rooms holds new Windows feature updates for validation and updates devices during the nightly maintenance reboot. Learn says not to push the next Windows release by any means during that period."
  - "Each Teams Rooms app version supports only certain Windows feature updates. An old app version can block a newer Windows release."
  - "The manual update process is described for the Teams Rooms app. It cannot install a new app or downgrade it, and Learn does not describe a Windows upgrade with it."
  - "Learn does not support LTSB or LTSC editions for Teams Rooms, which contradicts a clean-install suggestion given in the community thread."
faq:
  - q: "Does the manual update script upgrade Windows 10 to Windows 11?"
    a: "Learn does not describe it that way. The manual update page is about updating a Teams Rooms device to a newer version of the Teams Rooms app. It says the process cannot do a new installation and cannot downgrade the app. The page does not mention a Windows upgrade, so do not plan a Windows 10 to 11 move around it. In the September 2025 thread, the asker had the same doubt and the thread did not resolve it."
  - q: "Can I install Windows 11 LTSC on a Teams Rooms device?"
    a: "Learn says Teams Rooms requires Windows IoT Enterprise or Windows Enterprise on the Global Availability Channel servicing option and does not support LTSB or LTSC editions. A responder in the community thread said that LTSC devices need a clean installation of Windows 11 IoT Enterprise LTSC. That conflicts with Learn, and Learn wins. Ask the device maker for a supported image."
  - q: "How do I find out which of my rooms are still on Windows 10?"
    a: "Learn names two tools: the Room Inventory export in the Teams Rooms Pro Management portal and the Windows 11 readiness checker. Learn also says that certified devices which cannot upgrade are listed on the end-of-service tab of the certified devices page, and that you should contact the manufacturer for affected models."
  - q: "Why does a device not get the newest Windows release even when it could?"
    a: "Learn says that new Windows feature updates are delayed by up to six months or more while Microsoft validates them with the app, hardware and certified peripherals. Each app version supports only specific Windows releases, and a newer release stays blocked until the app version that supports it is installed."
---

An administrator runs 50 to 60 Teams Rooms on Windows devices. All have Teams Rooms Pro licenses, the Teams Rooms app is the latest version and the BIOS is current. Some devices upgraded from Windows 10 IoT to Windows 11 IoT without help. Others stay on Windows 10 and show no upgrade prompt.

That is the scenario of a Microsoft Q&A thread from September 2025. The asker confirmed that TPM 2.0 and Secure Boot were enabled, tried the suggestions and opened a support ticket. No fix was published in the thread. By November 2026, Windows 10 support has ended, so this matters more than it did then. This article combines the thread's questions with what Microsoft Learn says today. It is not an official Microsoft procedure.

## How Teams Rooms handles updates

Learn describes this model:

- The Teams Rooms app is updated through the Teams Rooms Pro Management portal. It has an evergreen lifecycle, and only the current major version and the previous one are supported.
- New Windows feature updates are held back for up to six months or more after general availability, to validate them with the app, hardware and certified peripherals. During that time, the app uses Windows Update for Business group policies to hold feature updates. Devices move to an appropriate Windows release during the nightly maintenance reboot.
- Teams Rooms requires Windows IoT Enterprise or Windows Enterprise on the Global Availability Channel servicing option. LTSB and LTSC editions, IoT Enterprise LTSB and LTSC editions, and editions such as Pro or Home are not supported.
- Windows 10 support ended on October 14, 2025. Teams Rooms and the Pro Management portal no longer update, support or test the app on Windows 10. Devices on Windows 10.0.19045 or lower must be upgraded to Windows 11 if eligible, or replaced.
- Learn says most Windows 10 devices were upgraded to Windows 11 automatically. Some certified devices cannot upgrade and must be replaced. Those are listed on the end-of-service tab of the certified devices page.

That last point may explain the thread: some of the devices in a fleet can be eligible and some not. Learn does not say that is the case for this asker, so treat it as something to rule out.

## Step 1: Sort the fleet by OS build and edition

Start with data. Learn names the Room Inventory export in the Pro Management portal and the Windows 11 readiness checker as the tools for finding devices that still run Windows 10. Build a list with the OS build for each device and note which ones are on 10.0.19045 or lower.

Then check the edition on a few of them. The Windows Settings About page shows it (this is a general Windows step, not from Learn). If a device runs an LTSB or LTSC edition, Learn says it is not supported for Teams Rooms.

On the LTSC point, a responder in the 2025 thread said LTSC devices are not upgraded through Windows Update and need a clean install of Windows 11 IoT Enterprise LTSC. This does not match Learn, which does not support LTSC editions. Do not plan a fleet around that advice. Ask the device maker which image is supported for the model.

## Step 2: Check the Teams Rooms app version

Each app version supports only specific Windows feature updates. Learn gives these minimum app versions in its table:

| Windows version | Status | Minimum app version |
|---|---|---|
| 25H2 | Supported, recommended | 5.6.210.0 |
| 24H2 | Supported | 5.3.205.0 |
| 23H2 and 22H2 | Not supported | none |

On the device, from an elevated PowerShell window, Learn shows how to read the installed version:

```powershell
Get-AppxPackage -AllUsers Microsoft.SkypeRoomSystem
```

Compare the result with the Microsoft Teams Rooms release notes. Learn also notes that when you set up a device that shipped with an older app version, you should update the app manually after setting the account, so that the correct OS version and Windows updates are installed.

The asker in the thread had the latest app, so this step may not apply there. It still belongs in the checklist, because the app version is a common blocker.

## Step 3: Know what the manual update does and does not do

In the thread, the asker was pointed to the manual update article and asked whether it covers only the app and not Windows. The thread did not answer that. Learn's page is about updating the Teams Rooms app: it needs an app that is already installed, and it cannot do a new installation or downgrade the app. It does not mention a Windows upgrade. The script has to run from an elevated command prompt in Admin Mode while the Skype user is still signed in:

```
PowerShell -ExecutionPolicy Unrestricted "<path to script>"
```

If the script fails, Learn says to include the log file from `C:\Users\Skype\AppData\Local\Packages\Microsoft.SkypeRoomSystem_8wekyb3d8bbwe\LocalState\Tracing\MTR-Update` when you contact Microsoft Support. This is the app update path. Learn does not present it as a Windows 10 to 11 upgrade path.

## Step 4: Check what blocks Windows Update

Learn has a page on Windows Update issues on Teams Rooms Pro devices. Its checks:

1. **Disk space.** Enrolled devices run automatic cleanup. If that is not enough, use Disk Cleanup or run `DISM /ONLINE /CLEANUP-IMAGE /STARTCOMPONENTCLEANUP /RESETBASE` from an elevated Command Prompt.
2. **Date and time.** The offset must be within two minutes.
3. **Blocking policies.** Group Policy, MDM or registry settings can block updates. Learn gives one example: `NoAutoRebootWithLoggedOnUsers` set to 1 under `HKLM\Software\Policies\Microsoft\Windows\WindowsUpdate\AU` stops automatic restarts when a user is signed in. A Teams Rooms Pro device always has the Skype user signed in, so this blocks updates that need a restart, such as feature updates. Active hours can also delay monthly cumulative updates by eight days or more.
4. **Connectivity.** Check access to the Windows Update servers. If small updates work but large ones fail, check that the proxy supports the Content-Range header and that antivirus does not block HTTP range requests.
5. **Error 0x800f0831 or 0x80073701.** Search `%Windir%\logs\CBS\CBS.log` for the code. Learn describes a case with orphaned language pack files and a repair with `DISM /ONLINE /ADD-PACKAGE` using the matching language pack cab file.
6. **Other error codes.** Learn points to its page on common Windows Update errors.

A responder in the thread also named three Windows Update policies to check on devices running the Enterprise edition: turning off Windows Updates completely, disabling access to the Windows Update user experience, and disabling automatic Windows Updates. That list comes from the thread and refers to the Windows IoT Enterprise update documentation. It is not on the Teams Rooms pages I read. It still fits Learn's point that policies can block updates.

## Step 5: Do not push the update by hand

It is tempting to force Windows 11 or the newest feature update onto a stubborn room. Learn warns against it. During the validation period, do not push the next Windows release to Teams Rooms devices by any means, including overriding the policies or using other device management services. A feature update that is not validated against the app and the peripherals can break a room that works today.

Windows 10 is a separate problem. It is out of support, and Learn says eligible devices must move to Windows 11 and ineligible ones must be replaced. Learn does not describe a manual way to do that upgrade, so this is not a license to force it. If a device is eligible but stays on Windows 10 after the checks above, do what the thread's asker did and open a support case.

## Step 6: Verify

- The OS build in the Room Inventory export no longer shows Windows 10 for the device.
- If you enabled Defender for Endpoint integration in the Pro Management portal, the **Security KBs** and **Vulnerabilities** signals are not **Unhealthy**. Learn lists these signals as a symptom of devices that cannot install updates.
- The device is on a Windows release that your app version supports, according to the table above.

## Limits

- The September 2025 thread has no confirmed result. The asker said all suggestions failed, and that Microsoft Support had been contacted.
- The thread named TPM 2.0 and Secure Boot as readiness checks. The Learn lifecycle page does not list hardware requirements and refers to the Windows 11 readiness checker instead. Use that tool.
- Learn does not describe an in-place upgrade or clean install path from Windows 10 to Windows 11 for Teams Rooms on the pages I read. If a device does not upgrade on its own, ask the device maker.

## Related

- [Microsoft Teams Rooms](https://www.m365.fm/entity/teams-rooms/)
- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)

## Sources

- [Microsoft Learn: Teams Rooms app and Windows versioning support](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-lifecycle-support)
- [Microsoft Learn: Resolve Windows Update issues on Teams Rooms Pro devices](https://learn.microsoft.com/en-us/microsoftteams/troubleshoot/teams-rooms-and-devices/teams-rooms-device-windows-update-issues)
- [Microsoft Learn: Manually update a Microsoft Teams Rooms device](https://learn.microsoft.com/en-us/microsoftteams/rooms/manual-update)
- [Microsoft Q&A: Microsoft Teams Rooms doesn't (automatically) update to Windows 11 (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5549516/microsoft-teams-rooms-doesnt-automatically-update)
