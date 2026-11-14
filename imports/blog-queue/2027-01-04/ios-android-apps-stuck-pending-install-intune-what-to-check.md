---
title: "iOS and Android Apps Stuck on Pending Install in Intune: What to Check"
summary: "What to check when Intune apps on iOS or Android do not install: assignment intent, device sync, VPP token and license errors, user prompts and Android download causes, based on Learn error codes."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [intune]
keypoints:
  - "The Learn error code page does not define a Pending state. Pending behavior is described as retry on the next device sync."
  - "Check the assignment intent first. Required apps install at check-in, while Available apps need the user to install from Company Portal."
  - "On iOS, expired VPP tokens, no remaining VPP licenses and mismatched license types are documented causes of install failures."
  - "Android failures often come from network, low battery, long downloads, bad or unsigned APKs, or users canceling the prompt."
  - "The dedicated Learn troubleshooting article for this topic could not be read, so this guide uses the error code reference and app assignment page."
faq:
  - q: "Why is my iOS app not installing from Intune?"
    a: "Microsoft Learn's error code reference lists documented causes such as an expired VPP token, no VPP licenses remaining, a device that is locked or busy, Lost Mode, kiosk mode, a disabled App Store, a user who declined app management, and a VPP app assigned with device licensing to a User Enrollment device."
  - q: "What do I do when Intune says it will try again on the next sync?"
    a: "For error 0x87D13B9B, Learn says Intune will try again the next time the device syncs, and to sync the device to retry. For Android download failures such as 0xC7D15078, it says the policy is retried on the next sync."
  - q: "Do Required apps install without user action?"
    a: "Learn says iOS Store apps with Required intent are enforced at device check-in and also appear in the Company Portal. It adds that some platforms might show more prompts that the user must acknowledge before installation begins."
  - q: "Why does the app not appear in Company Portal?"
    a: "For Available for enrolled devices, Learn says the app shows only if the signed-in Company Portal user is the primary user who enrolled the device and the app applies to the device."
  - q: "What if a VPP license cannot be retrieved?"
    a: "For 0x87D1313D, Learn says to sync the VPP token and then the device. If that fails, it lists removing the group assignment and reassigning as device-licensed, revoking the app license, and as a last step revoking licenses from the device, retiring it and re-enrolling."
---

When an iOS or Android app seems stuck in Intune, check four things in order: the assignment type, the device's last sync, the app's license or token (iOS) or download conditions (Android), and what the user was asked to do. The Learn error code reference documents specific causes and fixes. It does not define a Pending status, so this guide works from the error codes and the app assignment documentation. The dedicated Learn troubleshooting article could not be opened during research.

## Step 1: Check the assignment intent

From the Learn page on assigning apps:

- **Available for enrolled devices:** users install from the Company Portal. The app shows only if the signed-in Company Portal user is the primary user who enrolled the device and the app applies to the device.
- **Required:** the app is installed on devices in the selected groups. Some platforms may show more prompts the user must acknowledge before installation starts. iOS Store apps with Required intent are enforced at device check-in and also appear in the Company Portal.
- **Available with or without enrollment:** for unenrolled devices. Required and Uninstall are not supported there. Managed Google Play apps with this intent appear in the Play Store app, not the Company Portal.

Also check for assignment conflicts. Learn does not recommend them and says assignment filters might not work as expected because the intent is evaluated before the filter. Soft-deleted groups do not apply their assignments until restored.

## Step 2: Sync the device

Learn's error references repeat one pattern: Intune retries at the next sync. For iOS error 0x87D13B9B, Learn says Intune will try again the next time the device syncs and to sync the device. For Android download problems, 0xC7D15078 is retried on the next sync, and for 0xC7D1507C Learn says to sync manually or wait 24 hours.

## Step 3: iOS causes from the error reference

**User and device state**

| Code | Meaning on Learn | Fix |
| --- | --- | --- |
| 0x87D11388 | Device is busy, locked | The user unlocks it |
| 0x87D13B94 | App Store is disabled | Enable the App Store |
| 0x87D13B97 | Device is in Lost Mode | Disable Lost Mode |
| 0x87D13B98 | Device is in kiosk mode | Exclude the device from the kiosk configuration policy |
| 0x87D13B99 | User must sign in to the App Store | The user signs in first |
| 0x87D13B62, 0x87D13B68 | User rejected the install offer or declined app management | Ask the user to accept next time |

**VPP token and licenses**

| Code | Meaning on Learn | Fix |
| --- | --- | --- |
| 0x87D13B7D | Unknown error that can be caused by an expired VPP token | Verify the token is current |
| 0x87d13b7e | No VPP licenses remaining | Buy more licenses or reclaim from users no longer targeted |
| 0x87D13B95 | Cannot find VPP license | Revoke and reassign the app license |
| 0x87D1313D | Could not retrieve the license | Sync the VPP token, then the device. Then follow the escalation steps on Learn |
| 0x87D13BA9 | VPP app assigned with device licensing to a User Enrollment device | User Enrollment supports only user licensing. Change the licensing type or create a separate assignment |

Learn also lists 0x87D13B60, where the app needs a redemption code, typically for paid Store apps, and 0x87D13B9C, where 32-bit apps cannot be installed and you must deploy a 64-bit version. For unknown or generic failures, Learn says to collect iOS console logs and check the VPP token.

## Step 4: Android causes from the error reference

| Code | Meaning on Learn | Fix |
| --- | --- | --- |
| 0xC7D14FB5 | Install failed, root cause unknown. Common causes are a bad APK, a Google Play Protect block or an unsupported API level | The retry never resolves if the APK is bad |
| 0xC7D15078 | Download failed, usually Wi-Fi or a slow connection | Retried on next sync. Device administrator only |
| 0xC7D1507C | Download service stopped, low battery or long download | Sync manually or wait 24 hours |
| 0xC7D14FBB | Process restarted during install | Retry after the reboot |
| 0xC7D14FB1, 0xC7D14FB9 | The user canceled the install | Ask the user to accept the prompt |
| 0xc7d14fb7 | Upgrade APK signature does not match the installed app | Uninstall the existing app, then deploy the new one |
| 0xc7d14fb6 | APK not signed | Sign the app before deployment |

Learn notes the Android table lists two codes twice with different descriptions, and that several download entries apply to device administrator scenarios only. Learn also says Intune has ended support for Android device administrator on devices with Google Mobile Services, so check that your Android enrollment type is still supported.

## Step 5: Look at the user side

Prompts matter. A user who cancels the OS prompt, rejects the app management offer or never signs in to the App Store leaves the app waiting. Ask the user what they saw before you change policy.

## What the sources do not say

Neither Learn page defines a Pending status or gives a fixed time after which a pending install is considered stuck. The Q&A threads found in a search for this topic were not used as sources.

## A short routine

1. Confirm the assignment intent and that the user is the primary user for Available apps.
2. Sync the device and wait for the next check-in.
3. For iOS, check the VPP token, license counts and licensing type.
4. For Android, check network, battery, APK signing and whether the user canceled.
5. If the code is unknown, collect device or Company Portal logs.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [App installation error codes for Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/app-management/app-install-error-codes)
- [Assign apps to groups in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/intune-service/apps/apps-deploy)
