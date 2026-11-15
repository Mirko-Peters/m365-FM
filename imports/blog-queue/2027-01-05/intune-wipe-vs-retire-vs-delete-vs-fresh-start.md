---
title: "Intune Wipe vs Retire vs Delete vs Fresh Start: Which Device Action to Use"
summary: "Compare Intune device actions Wipe, Retire, Delete and Fresh Start: what each removes, platforms, admin center paths, roles, daily tenant limits, precedence and caveats such as BitLocker and Apple ADE release."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [intune]
keypoints:
  - "Wipe restores factory settings and removes all data. Retire removes company data and keeps personal data. Delete removes the device from Intune and initiates a Retire for MDM devices."
  - "Fresh Start reinstalls the latest Windows and removes manufacturer-installed apps. It is not in the bulk action or daily limit lists."
  - "Daily tenant limits on the Learn page: 500 for Wipe and 1,000 for Retire and Delete, counted across single, bulk and Graph requests."
  - "Retire, Wipe and Delete take precedence over other pending actions, and only one of them runs."
  - "Retiring an Entra-joined Windows device unjoins it, and Entra sign-in no longer works. Back up BitLocker keys and local admin credentials first."
faq:
  - q: "What is the difference between Wipe and Retire?"
    a: "Per Microsoft Learn, Wipe restores a device to factory settings and removes all data and settings. Retire removes company data and settings and leaves personal data intact."
  - q: "What does Delete do?"
    a: "Learn says it removes a device from Intune management, removes company data and retires the device. For MDM devices it hides the device immediately in the admin center and initiates a Retire. A Completed status does not confirm that the device finished the Retire."
  - q: "What is Fresh Start?"
    a: "Learn says it reinstalls the latest version of Windows on a device and removes apps that the manufacturer installed. The page lists it under the Windows actions and not in the bulk action lists."
  - q: "What are the daily limits?"
    a: "Wipe 500, Retire 1,000, Delete 1,000 per tenant per day. The limit is cumulative across individual actions, bulk actions and Microsoft Graph requests. Bulk actions handle up to 100 devices at a time."
  - q: "Where do I start a Wipe or Retire?"
    a: "In the Intune admin center go to Devices > All devices, select the device and choose Remove data > Wipe or Remove data > Retire."
---

Pick the action by what must happen to the data. Wipe erases everything. Retire removes company data and keeps personal data. Delete removes the record from Intune and starts a Retire. Fresh Start reinstalls Windows. This guide follows three Microsoft Learn pages: the device actions overview, the Wipe page and the Retire page. Dedicated pages for Fresh Start and Delete were not read.

## Side by side

| Action | What it does on Learn | Bulk | Daily tenant limit |
| --- | --- | --- | --- |
| Wipe | Restores factory settings and removes all data and settings | Yes | 500 |
| Retire | Removes company data and settings and leaves personal data intact | Yes | 1,000 |
| Delete | Removes the device from Intune management, removes company data and retires the device | Yes | 1,000 |
| Fresh Start | Reinstalls the latest Windows and removes manufacturer-installed apps | No | Not listed |

Bulk actions handle up to 100 devices at a time. The limits are cumulative across individual actions, bulk actions and Microsoft Graph requests. Retire, Wipe and Delete take precedence over all other actions, and a device with several pending actions carries out only one of these.

## Wipe

- **Purpose:** a factory reset for retirement, repurposing, troubleshooting or lost or stolen devices.
- **Platforms:** Android Enterprise COSU, COBO and COPE, AOSP, ChromeOS, iOS and iPadOS, macOS, tvOS 10.2 or later, visionOS 1.1 or later, and Windows.
- **Path:** **Devices** > **All devices** > the device > **Remove data** > **Wipe**.
- **Roles:** Help Desk Operator, School Administrator, or a custom role with Remote tasks/Wipe plus visibility permissions.
- **Windows options:** **Keep enrollment state and user account** keeps user data and accounts and removes MDM policies, and the device stays enrolled. **Continue wipe if power is lost** deletes all data and can leave the device unbootable, so use it on corporate devices with recovery procedures. With no option, all data and settings are deleted, and an interrupted wipe may need a Windows reinstall.
- **Caveats:** on Samsung fully managed devices, a Factory Reset restriction set to Block can make the wipe fail. Zebra devices need StageNow or OEM Config for a factory reset. Intune's admin wipe does not preserve Factory Reset Protection data by default.
- **Cleanup:** deregister from Windows Autopilot if applicable and remove the device record from Microsoft Entra ID.

## Retire

- **Effect:** unenrolls the device and removes managed apps, settings and profiles deployed through MDM. It runs the next time the device checks in.
- **Platforms:** Android device administrator, Android Enterprise personally-owned work profile, iOS and iPadOS, macOS, tvOS, visionOS and Windows.
- **Path:** **Devices** > **All devices** > the device > **Remove data** > **Retire**.
- **Roles:** Help Desk Operator, School Administrator, or a custom role with Remote tasks/Retire.
- **Windows:** Intune-installed apps are uninstalled. Microsoft 365 Apps are not removed. Entra-joined devices are unjoined, and Entra sign-in then no longer works. Learn describes Safe Mode with a local admin account for local data access.
- **Entra device record:** kept if the device is registered in Autopilot, removed if it is Entra-joined or registered. For iOS, macOS and others the page states per platform whether it stays.
- **BitLocker:** retiring or deleting an Entra-joined protected device removes key protectors and suspends BitLocker on the OS volume. Back up the recovery key and local admin credentials first.
- **Apple ADE:** Retire does not release the device from Apple Business Manager.

## Delete

Learn says Delete hides an MDM device immediately in the admin center and initiates a Retire. A **Completed** status means the server side is done, not that the client finished. Retire's page suggests Delete for immediate removal, but explains no further how Delete works. The page does not say whether personal data is affected.

## Fresh Start

Learn describes a reinstall of the latest Windows that removes manufacturer-installed apps. It is not in the bulk list and has no listed daily limit. The pages read give no prerequisites beyond the general list: the device is enrolled in Intune and connected to the internet.

## Choosing

The choices below combine Learn's definitions with common sense.

| Situation | Action to consider |
| --- | --- |
| Lost or stolen device with company and personal data | Wipe |
| Device being repurposed to a new user | Wipe |
| Personal device leaves the program, keep personal data | Retire |
| Stale record of a device that is gone | Delete |
| Windows device with preinstalled manufacturer apps to clean | Fresh Start |

## What the pages do not say

A per-platform support matrix for all four actions, whether a pending action can be cancelled, behavior when a device is offline, and Fresh Start prerequisites. If a Multiple Administrative Approval policy applies, a second administrator must approve Wipe and Retire.

## Typical mistakes

- Using Retire on an Entra-joined Windows device and locking users out.
- Skipping the BitLocker key backup.
- Expecting Delete to confirm that the device is clean.
- Forgetting the Apple Business Manager release after Retire.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Device Actions - Wipe, Lock, Locate, and More - Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-management/actions/)
- [Wipe devices with Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-management/actions/wipe)
- [Device action: Retire (Microsoft Learn)](https://learn.microsoft.com/intune/device-management/actions/retire)
