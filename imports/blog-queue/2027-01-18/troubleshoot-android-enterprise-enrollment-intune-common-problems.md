---
title: "Troubleshoot Android Enterprise Device Enrollment in Intune: Common Problems"
summary: "Learn's page on Android Enterprise enrollment in Intune covers expected behaviors and a few real problems: stale Managed Google Play sync time, mandatory encryption, work profile creation failures, missing wipe and passcode reset options, and Duo enrollment quirks. Each with its documented answer."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [intune, conditional-access]
keypoints:
  - "Managed Google Play Last Sync time not updating for days is expected behavior; you must trigger a sync manually."
  - "Encryption cannot be turned off when a device is enrolled, because Google requires encryption to create a work profile."
  - "If a work profile cannot be created, check Settings, Passwords and accounts, Work for an existing profile, and test with the Test DPC app."
  - "Wipe is not offered for work profile enrolled devices; Retire removes the work profile, while wipe is supported for corporate-owned work profile devices."
  - "Passcode reset rules differ by ownership: personally owned work profile needs Android 8.0 or later, a managed passcode and user permission."
faq:
  - q: "Why has the Managed Google Play Last Sync time not changed in days?"
    a: "Learn says this is expected behavior and that you must manually trigger a sync. The timestamp does not update on its own, so a stale value alone does not indicate a fault."
  - q: "Can I enroll without encryption?"
    a: "No. Learn says you cannot turn encryption off, because Google requires the device to be encrypted to create a work profile. Encryption being required at enrollment is expected behavior."
  - q: "What do I do if a work profile cannot be created?"
    a: "Learn says the cause may be an existing profile on the device or OEM restrictions. Check Settings, Passwords and accounts, Work for an existing profile, remove it if unexpected and enroll again. Install the Test DPC app to see whether the device can create a sample work profile."
  - q: "Why is there no Wipe option for my work profile device?"
    a: "Learn says this is expected: in the work profile scenario the MDM provider does not have full control over the device. The available action is Retire, which removes the whole work profile and its contents. Wipe is supported for corporate-owned work profile devices."
  - q: "Can I reset the device passcode?"
    a: "It depends. For personally owned work profile devices, only the work profile passcode on Android 8.0 or later, if it is managed and the user allowed it. Corporate-owned work profile devices allow only the work profile passcode. Dedicated and fully managed devices support device passcode reset."
---

Microsoft Learn's page on troubleshooting Android Enterprise enrollment in Intune is short, and several of its entries describe expected behavior rather than faults. Managed Google Play sync time that does not update, mandatory encryption and a missing Wipe option are all documented as expected behavior, and passcode reset is documented as limited. Real problems on the page are failing to create a work profile and a few quirks on Duo devices. This article goes through the page in its own order.

## Device management

### Managed Google Play Last Sync time has not updated in days

Learn calls this expected behavior and says you must manually trigger a sync. If the timestamp is old, run the sync and check the result. My reading, not Learn's: a stale timestamp alone is then not a sign of a fault.

### Encryption is required at enrollment

Also expected. Learn says you cannot turn encryption off, because Google requires the device to be encrypted to create a work profile. If a user objects to encryption, there is no setting that removes it for this scenario.

### Cannot create a work profile

Learn says a device may meet the Android Enterprise and OS version requirements for a personally owned work profile and still fail, because of an existing profile on the device or OEM restrictions. Its checks:

1. Look for an existing work profile in **Settings** > **Passwords & accounts** > **Work**. If a work profile is not expected, remove it and try again. The location of the setting may vary by manufacturer.
2. Install the **Test DPC** app from Google Play and follow its setup instructions, to see whether the device can create a sample work profile.
3. If Test DPC also fails, contact the device manufacturer for details on work profile support.

In my view, the Test DPC step helps separate a device limitation from an Intune configuration problem.

## Remote actions

### Wipe (factory reset) is not available for work profile enrolled devices

Learn says this is expected. In the work profile scenario, the MDM provider does not have full control over the device. The available option is **Retire** (Remove Company Data), which removes the whole work profile and all its contents. Wipe is supported for Android Enterprise corporate-owned work profile devices.

### Device passcode reset is not supported

The page distinguishes by ownership:

- **Personally owned work profile:** you can reset only the work profile passcode, on Android 8.0 or later, and only if the work profile passcode is managed and the device user has allowed it.
- **Corporate-owned work profile:** you can reset only the work profile passcode.
- **Dedicated and fully managed devices:** device passcode reset is supported.

## Duo devices

Learn has three entries for Duo devices.

- **Company Portal does not prompt users to enroll.** The enrollment checklist may not appear. Users can open it by tapping the notification bell at the upper right of the Company Portal app and then the notification.
- **Users cannot find or launch Microsoft Launcher.** It is the default launcher on Duo devices, so its icon is hidden from the apps list and from the personal and work Google Play stores. Learn says this will be fixed in a coming update. I cannot tell from the page whether that has happened, so check the current state.
- **Microsoft Edge sign-in prompt during enrollment.** When an unenrolled user tries to reach corporate data in an app protected by Conditional Access, they are guided to enroll, and Microsoft Edge opens the Company Portal website. Edge may ask the user to sign in, which diverts the enrollment flow. Learn says to tell users to enroll in the Company Portal before accessing organization data, or to skip the Edge sign-in step.

## Service issues

For Google service problems that may affect Android Enterprise management, Learn points to Google's service announcements on the Android Enterprise community site.

## Using the page

This section is my advice, not a Microsoft statement.

1. **Sort the entry before you act.** Three of the entries are labeled expected behavior on the page. Tell the user or colleague so, and close the ticket with a short explanation.
2. **Capture ownership type first.** Passcode reset and wipe depend on whether the device is personally owned, corporate-owned, dedicated or fully managed, so record this in the ticket.
3. **Run Test DPC early for profile failures.** It is a quick check that can help you decide whether to look at the device or at your tenant.
4. **Write a user note about Retire.** Users on personal devices should know that Retire removes the work profile and its data, and that the personal side is outside the MDM's control, as Learn describes.
5. **Make the Company Portal the first step.** The Duo entries show that starting from a protected app can derail enrollment. A pre-enrollment message to users avoids that.
6. **Check Google's service announcements** if a problem hits many devices at once and your configuration did not change.

## A quick triage table

This section is my advice, not a Microsoft statement.

| Symptom | First thing to check |
| --- | --- |
| Sync date is old | Trigger a manual sync |
| Encryption prompt | Nothing to change, it is required |
| Work profile fails | Existing profile, then Test DPC |
| No Wipe button | Check the ownership type |
| Passcode reset refused | Check ownership, Android version and managed passcode |
| Duo enrollment stalls | Use the Company Portal notification bell |

## What the page does not cover

The page does not cover error codes for failed enrollment, enrollment profile tokens, Google account setup or Managed Google Play binding. It also does not list OS versions for each enrollment type beyond the Android 8.0 note on passcode reset. For those topics, use Intune's enrollment documentation for the specific Android scenario.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Troubleshoot Android Enterprise device enrollment in Microsoft Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/troubleshoot-android-enrollment)
