---
title: "Intune iOS Profile Installation Failed: Causes and Fixes"
summary: "Learn lists three Profile Installation Failed messages on iOS and iPadOS enrollment: a network error, no connection to the server, and an MDM payload mismatch. Find each cause in Microsoft's order, from restore and re-enroll to enrollment restrictions, licenses and leftover profiles."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [intune, microsoft-365-admin-center]
keypoints:
  - "Run the general checks first: license assigned, no other MDM provider, no existing management profile, and Safari as default browser with cookies enabled."
  - "A network error message points to an unspecified iOS or iPadOS problem, and Learn's fix is back up, restore in recovery mode as a new device, and re-enroll."
  - "Connection to the server could not be established has four scenarios: corporate-only restriction, a previous user not removed, another MDM provider, or a missing Intune license."
  - "The new MDM payload does not match the old payload means a management profile is already installed; remove it under General, VPN and Device Management."
  - "Restoring iOS or iPadOS deletes all data on the device, so Learn says to back up first."
faq:
  - q: "What should I check before the scenario steps?"
    a: "Learn's general checks: the user has an appropriate license, the device is not enrolled with another MDM provider, the device has no management profile installed, and on iOS or iPadOS Safari is the default browser with cookies enabled."
  - q: "What does a network error mean?"
    a: "Learn says the message Profile Installation Failed. A Network Error Has Occurred indicates an unspecified problem with iOS or iPadOS on the device. The steps are to back up data, put the device in recovery mode and restore it as new, then re-enroll."
  - q: "Why would the connection to the server fail?"
    a: "Learn lists four scenarios: the tenant only allows corporate-owned devices, the device was previously enrolled by another user who was not removed, the device is enrolled with another MDM provider, or the user has no Intune license."
  - q: "How do I remove an existing management profile?"
    a: "On the device open Settings, then General, then VPN and Device Management, tap the existing management profile and tap Remove Management. Then re-enroll."
  - q: "Does restoring the device delete data?"
    a: "Yes. Learn says restoring iOS or iPadOS deletes all data on the device, so back up to another storage location first."
---

A Profile Installation Failed message on an iPhone or iPad during Intune enrollment has three variants in Microsoft Learn's troubleshooting page, each with its own cause: a network error, a failed connection to the server, and a mismatch between the new and old MDM payload. Learn tells you to run the general checks first, then follow the scenario for the exact message. This article keeps Learn's order.

## Step 0: general checks

Learn's page on the iOS and iPadOS error points to the general enrollment troubleshooting page, which lists these checks for Profile installation failed:

1. Confirm the user is assigned an appropriate license for the version of the Intune service you use.
2. Confirm the device is not already enrolled with another MDM provider.
3. Confirm the device does not already have a management profile installed.
4. For iOS and iPadOS, confirm Safari is the default browser and cookies are enabled.

The same general page suggests collecting basic information: the exact error message, where you see it, when the problem started, how many users and devices are affected, and how enrollment is performed, for example BYOD or Apple Automated Device Enrollment. It also suggests checking that the device date and time are set close to GMT standards (plus or minus 12 hours) for the user's time zone, and offers the Intune iOS/iPadOS enrollment diagnostic in the Microsoft 365 admin center under Help and support. Learn notes these diagnostics are not available for GCC High, DoD or Microsoft 365 operated by 21Vianet.

## Message 1: A network error has occurred

The text: Profile Installation Failed. A Network Error Has Occurred.

Learn says this indicates an unspecified problem with iOS or iPadOS on the device. The steps:

1. Back up device data to an alternative storage or cloud location. Restoring iOS or iPadOS deletes all data on the device.
2. Put the device in recovery mode and restore it, setting it up as a new device. Learn points to an Apple support article for how to restore.
3. Re-enroll the device.

This is the most disruptive fix on the page, so Learn places it as a response only to this exact message.

## Message 2: Connection to the server could not be established

The text: Profile Installation Failed. Connection to the server could not be established. Learn says it can indicate a few issues and lists four scenarios.

### Scenario 1: only corporate-owned devices allowed

Your tenant is configured to allow only corporate-owned devices. The fix in the Microsoft Intune admin center:

1. Select **Devices** > **Enroll devices** > **Enrollment restrictions**.
2. Under **Device Type Restrictions**, select the restriction to change and then **Properties**.
3. Choose **Edit** > **Select platforms** and select **Allow** for **iOS**, then **OK**.
4. Select **Configure platforms**, select **Allow** for personally owned iOS/iPadOS devices, then **OK**.
5. Re-enroll the device.

### Scenario 2: previous user not removed

The device was enrolled with a different account and that user was not appropriately removed from Intune. Cancel any current profile installation, open `https://portal.manage.microsoft.com` in Safari, and re-enroll. If enrollment still fails, Learn says to remove cookies in Safari without blocking cookies, then re-enroll.

### Scenario 3: another MDM provider

The device is already enrolled with another MDM provider. On the device, open **Settings** > **General** > **VPN & Device Management**, remove any existing management profile, and re-enroll.

### Scenario 4: no Intune license

The user has no Microsoft Intune license. In the Microsoft 365 admin center go to **Users** > **Active Users**, select the user, choose **Product licenses** > **Edit**, switch on the license, choose **Save**, and re-enroll.

## Message 3: The new MDM payload does not match the old payload

This indicates a management profile is already installed on the device. Learn says to open **Settings** > **General** > **VPN & Device Management**, tap the existing management profile, tap **Remove Management**, and re-enroll.

## Related notes on the general page

Learn's general page has a note on expired certificates: the `IOSProfileSigning.manage.microsoft.com` certificate is needed to install the management profile on iOS and iPadOS during enrollment, and it stays on devices after use because of how iOS works. Enrolled devices work as expected and new enrollments receive the same certificate with a new date, so some expired, unverified certificates might appear without affecting existing enrollments. It also covers other messages, such as DeviceCapReached, Company Portal Temporarily Unavailable and MDM authority not defined, each with its own cause and fix. I did not repeat those here, since they are different errors.

## How I would work through it

This section is my advice, not a Microsoft statement.

1. **Read the exact message on the screen.** The three messages have different fixes, and the restore for the network error is destructive, so do not apply it to the other two.
2. **Check the cheap causes first.** For the connection message, a license check and the management profile check take a minute and rule out two of the four scenarios.
3. **Look at the enrollment restrictions for the user group** before blaming the device, if several people report the same message.
4. **Write down what the device was used for before.** A device with a previous owner or another MDM profile is a common case in the scenarios Learn lists.
5. **Warn the user before any restore.** Learn says it deletes all data, so confirm a backup exists.

## What the pages do not say

The profile installation page is short and does not list how long fixes take, any Apple version requirements, or what to do if re-enrollment still fails after the steps. For persistent cases, use the Intune support options and the diagnostics on the general page.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Intune Profile installation failed on iOS/iPadOS device in Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/profile-installation-failed)
- [Troubleshoot device enrollment in Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/troubleshoot-device-enrollment-in-intune)
