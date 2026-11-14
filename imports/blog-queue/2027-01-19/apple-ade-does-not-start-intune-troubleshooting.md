---
title: "Apple ADE Devices Don't Start Auto-Enrollment in Intune: Causes and Fix"
summary: "When an Apple automated device enrollment device with an assigned profile does not start enrollment in Intune, the profile may predate the token upload or no profile is assigned. Learn's fix is to assign a profile, refresh it and sync the token. This guide adds the current setup rules."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [intune]
keypoints:
  - "Learn names two causes: the enrollment profile was created before the ADE token was uploaded, or no MDM profile is assigned to the device in Intune."
  - "The fix is to make sure a profile exists and is assigned, edit it to update the modification time, sync the token, and then turn on the device."
  - "A device synced from Apple without an enrollment policy fails enrollment, so assign a policy and consider setting a default."
  - "Changes to a policy need a factory reset of the device to take effect, except for the device name template."
  - "Do not block the iOS platform for All Users in enrollment restrictions, or the device shows Invalid Profile."
faq:
  - q: "Why does a device with a profile not start enrollment?"
    a: "Learn lists two causes: the enrollment profile was created before the ADE token was uploaded to Intune, or no MDM profile is assigned to the device."
  - q: "What is the fix?"
    a: "Confirm a profile exists and is assigned to the device. Edit the profile, with any change, so its modification time updates. Sync the enrollment program token, then turn on the device."
  - q: "Where do I sync the token?"
    a: "The troubleshooting page describes the older path: Devices, iOS/iPadOS, iOS/iPadOS enrollment, Enrollment Program Tokens, select the token, then Devices, Sync. The current setup page uses Devices, Device onboarding, Enrollment, Apple mobile, Enrollment program tokens."
  - q: "Do policy changes apply to enrolled devices?"
    a: "Learn's setup page says changes to an enrollment policy apply only after a factory reset of the device, with the exception of the device name template."
  - q: "What about the Setup Assistant authentication method?"
    a: "For ADE with user affinity the setup page now offers Company Portal and Setup Assistant with modern authentication, and recommends the latter with just-in-time registration. It says legacy Setup Assistant authentication ended with the October 2026 (2610) service release, with existing profiles updated automatically."
---

If an Apple device in automated device enrollment (ADE) does not start enrollment when you turn it on, Learn's troubleshooting article points to two causes. The enrollment profile was created before the ADE token was uploaded to Intune, or no MDM profile is assigned to the device. The fix is to make sure a profile exists and is assigned, edit it so its modification time updates, sync the token and turn the device on again. This article adds the surrounding rules from Learn's ADE setup article for iOS and iPadOS.

## The symptom and the causes

The symptom is that enrollment does not start on a device that is in ADE and has an enrollment profile assigned. Learn gives these causes:

1. The enrollment profile was created before the ADE token was uploaded.
2. No MDM profile is assigned to the device in Intune.

## The fix on the troubleshooting page

1. Make sure that an enrollment profile exists and that it is assigned to the device.
2. Edit the profile. Any change works, because the goal is to update the profile's modification time.
3. Sync the token. The page describes going to Devices, iOS/iPadOS, iOS/iPadOS enrollment, Enrollment Program Tokens, selecting the token, and then Devices and Sync.
4. Turn on the device and check whether enrollment starts.

The menu names on the troubleshooting page are older than the ones on Learn's current setup article. The setup article describes Devices, Device onboarding, Enrollment, Apple mobile, Enrollment program tokens, then the token, then Enrollment policies. The setup article also says the older experience (Enrollment program tokens, Profiles) will eventually be retired and that new policies should be created under Enrollment policies. If your admin center looks different from the older page, my advice is to follow the current navigation and keep the intent the same: a policy edit followed by a token sync.

## Rules from the setup article

The setup article adds points that explain many failed starts:

- **A policy must be assigned.** Devices become active only after an enrollment policy is assigned. A device synced from Apple without a policy fails enrollment. You can set a default policy for new devices.
- **Policy changes need a factory reset.** Except for the device name template, changes to a policy do not apply until the device is factory reset.
- **Limit.** The page states a limit of 1,000 enrollment policies per token.
- **Company Portal.** Deploy the Company Portal app through Intune with Apple volume purchase rather than from the App Store.
- **Enrollment restrictions.** Do not block the iOS platform for All Users, or the device shows Invalid Profile.
- **Setup Assistant authentication.** The page says Intune ended support for legacy Setup Assistant authentication with the October 2026 (2610) service release, that existing profiles using it are updated to Setup Assistant with modern authentication automatically, and that already-enrolled devices are not affected.
- **Passcode and biometric screens.** The page says the passcode and Touch ID or Face ID screens can misbehave on iOS 14.5 and later, and suggests hiding them.
- **Prerequisites.** Access to the Apple Business portal or Apple School Manager portal, an active Apple token (.p7m file) and an Apple MDM push certificate in Intune. The devices should be new or wiped and bought from Apple Business or Apple School Manager.

## A troubleshooting order

This section is my advice, not a Microsoft statement.

1. **Confirm the device is in the right token.** In the Apple portal, check which MDM server the device is assigned to, and in Intune check that it appears under the token you expect.
2. **Check the assignment.** In Intune, open the device and confirm it has a policy. Many failed starts come down to an unassigned device.
3. **Check the token status.** An expired or unhealthy token blocks syncs. Renew it before you edit anything.
4. **Edit the policy, sync and wait.** Follow the Learn steps and allow time for the sync to finish before you power on the device.
5. **Check enrollment restrictions.** Look for a rule that blocks iOS or iPadOS for the group that the user belongs to.
6. **Factory reset a device that was previously set up.** The setup article says policy changes apply to assigned devices only after a reset to factory settings. My reading: a device that already passed Setup Assistant needs that reset to show the enrollment screens again.
7. **Test with one device.** Reproduce on a single device before you change settings for a whole group.
8. **Check connectivity.** The device needs a network connection during Setup Assistant to reach Apple and Intune.

## Habits that prevent the problem

This section is my advice, not a Microsoft statement.

- Set a default enrollment policy so that new devices are never left unassigned.
- Upload or renew the token before creating policies, and keep a calendar note for the token's expiry.
- Keep one named owner for the Apple portal and Intune pairing.
- Document the profile settings, so a factory reset does not surprise a user with different behavior.

## Checklist before you call support

This section is my advice, not a Microsoft statement.

Gather the serial number of the device, the name of the enrollment program token, the name of the assigned policy, the time of the last token sync and what the device screen shows. Add whether the device was ever set up before and whether you edited the policy after the last sync. With these facts, an engineer can tell in a few minutes whether the cause is the assignment, the token or the device state. Keep the Learn fix as your first step, and do not change several settings at once, so you can tell which change made the difference.

## What the pages do not cover

The troubleshooting article is short: two causes and one resolution. It does not cover macOS, the Apple portal or token renewal, and this article does not describe those steps. The troubleshooting article is older in its wording than the setup article, so follow the setup article for current menu names.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Apple ADE devices don't start auto-enrollment in Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/apple-dep-device-fails-auto-enrollment)
- [Set up automated device enrollment (ADE) for iOS/iPadOS - Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/apple/setup-automated-ios)
