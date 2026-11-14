---
title: "Intune Enrollment Restrictions by Platform and Ownership: How to Set Them"
summary: "How to create Intune device platform and device limit restrictions: admin center path, OS version, manufacturer and personal-device blocks, priority, assignments and known limits."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [intune]
keypoints:
  - "Intune has two restriction types: device platform restrictions and device limit restrictions. Each type has one default policy that you can edit."
  - "Create a platform restriction under Devices > Device onboarding > Enrollment > Device platform restriction, then pick the platform tab."
  - "A restriction takes effect only when assigned to at least one group. Drag policies in the table to change priority."
  - "Restrictions apply to user-driven enrollments. Scenarios such as Autopilot self-deploying, Windows 365 and co-management use the default policy."
  - "Microsoft says enrollment restrictions are not security features. They are a best-effort barrier for non-malicious users."
faq:
  - q: "Where do I create enrollment restrictions in Intune?"
    a: "According to Microsoft Learn, sign in to the Intune admin center and select Devices > Device onboarding > Enrollment. Under Enrollment options, select Device platform restriction, choose the platform tab and select Create restriction."
  - q: "How many devices can I allow per user?"
    a: "Microsoft Learn says the device limit can be set from 1 to 15. This is configured under Enrollment device limit restrictions."
  - q: "Do enrollment restrictions affect devices that are already enrolled?"
    a: "No. Learn says changes apply only to new enrollments and do not affect enrolled devices."
  - q: "How do I block personal devices?"
    a: "Set Personally-owned to Block in the platform restriction. Learn explains what counts as corporate-owned per platform. For example, iOS devices count as corporate only if registered with a serial number or IMEI or enrolled through Automated Device Enrollment."
  - q: "Are enrollment restrictions a security control?"
    a: "Microsoft Learn says they are not security features, because compromised devices can misrepresent their character. They are a best-effort barrier for non-malicious users."
---

To restrict enrollment in Intune, open the Intune admin center, go to **Devices** > **Device onboarding** > **Enrollment** and use **Device platform restriction** for platform, OS version, manufacturer and ownership rules, or **Enrollment device limit restrictions** for the number of devices per user. Assign the policy to a group, and it applies to new, user-driven enrollments. This guide follows Microsoft Learn.

## Know the two restriction types

Microsoft Learn describes two types:

- **Device platform restrictions** limit enrollment by platform, version, manufacturer or ownership type.
- **Device limit restrictions** limit how many devices a user can enroll.

Each type has one default policy that you can edit. Intune applies the default policy to all user and userless enrollments until you assign a higher-priority policy. Learn also notes that enrollment restrictions are not security features. A compromised device can misrepresent itself, so treat them as a best-effort barrier for non-malicious users.

The supported platforms are Android device administrator, Android Enterprise personally owned work profile, iOS/iPadOS, macOS and Windows. Availability varies by restriction type. Learn also warns that Android device administrator management is deprecated and no longer available on devices with Google Mobile Services.

## What you can restrict

| Restriction | What it does | Platforms named by Learn |
| --- | --- | --- |
| Platform | Blocks devices on a platform | Android device administrator, Android Enterprise work profile, iOS/iPadOS, macOS, Windows |
| OS version | Sets minimum and maximum versions | Android device administrator, Android work profile, iOS/iPadOS, Windows |
| Device manufacturer | Blocks listed manufacturers | Android only |
| Personally owned | Blocks personal devices | Android, iOS/iPadOS, macOS, Windows |
| Device limit | Caps devices per user, 1 to 15 | Configured separately |

Version restrictions on Android work profile, Android device administrator and iOS/iPadOS work only for devices enrolled through the Intune Company Portal.

## Create a device platform restriction

1. Sign in to the Microsoft Intune admin center and select **Devices**.
2. Under **Device onboarding**, select **Enrollment**.
3. Under **Enrollment options**, select **Device platform restriction**.
4. Select the platform tab, for example **Windows restrictions** or **iOS/iPadOS restrictions**.
5. Select **Create restriction**.
6. On **Basics**, enter a name and an optional description.
7. On **Platform settings**, choose **Allow** or **Block** for the platform (labelled **Platform** for Android and **MDM** for the others). Set **Personally-owned**, enter blocked manufacturers for Android as a comma-separated list, or set **Allow min/max range** for versions.
8. Optionally add **Scope tags**.
9. On **Assignments**, select **Add groups** or **Add all users**. For macOS, iOS and Windows you can select **Edit filter**.
10. On **Review + create**, select **Create**.

Version formats matter. Learn gives Windows as major.minor.build.rev, with 0 for the revision because Intune does not receive it during enrollment. Android uses major.minor.rev.build. iOS/iPadOS uses major.minor.rev.

## Set priority and the default policy

Drag a restriction in the **Device type restrictions** table to change its priority. You can have up to 25 device platform restriction policies. Only the Intune Administrator role can create, edit, delete and reprioritize restrictions. Other built-in roles are read-only. A restriction takes effect only if it is assigned to at least one group.

## Block personal devices correctly

How Intune decides what is personal differs by platform, according to Learn:

- **iOS/iPadOS and macOS:** classified as personal by default. A device counts as corporate-owned if it is registered with a serial number (or IMEI for iOS) or enrolled through Automated Device Enrollment.
- **Windows:** when personal devices are blocked, Intune checks that each new enrollment is authorized as corporate. Authorized methods include Windows Autopilot, GPO or Configuration Manager co-management enrollment, a bulk provisioning package and a device enrollment manager account.
- **Android Enterprise:** blocking work profile enrollment on personal devices leaves only corporate-owned devices able to enroll with personally owned work profiles.

Learn also says Windows personal-device blocks apply to enrollment through the Company Portal, MDM-only enrollment from Windows Settings and enrollment through the Allow my organization to manage my device prompt in Microsoft 365 apps.

## Limits you should know

- Restrictions apply to user-driven enrollments. These scenarios use the default policy: Windows Autopilot self-deploying and pre-provisioned modes, bulk enrollment with Windows Configuration Designer, co-managed enrollments, userless Apple Automated Device Enrollment, Azure Virtual Desktop, Windows 365 and Android Enterprise corporate-owned dedicated devices.
- Device limit restrictions cannot apply to some Windows scenarios that use shared device mode, such as co-management, GPO, Microsoft Entra join and Autopilot. Learn says to configure a hard limit in Microsoft Entra ID for these.
- Filters cannot be used with Android enrollment restrictions.
- Assignments can take around 15 minutes to process. Wait several minutes after adding users to a group before enrolling.
- The OS version range does not apply to devices enrolled through Apple ADE, Apple School Manager or Apple Configurator.

## Edit an existing restriction

Go to **Devices** > **Enrollment** > **Device platform restrictions**, select the platform and policy, then **Properties** > **Edit**. Make the changes, select **Review + save** and then **Save**. Changes apply to new enrollments only.

## Typical mistakes

- Creating a policy and forgetting the assignment.
- Expecting restrictions to stop Autopilot self-deploying or Windows 365 enrollments.
- Testing right after a group change, before assignment processing finishes.
- Treating restrictions as a security boundary.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Overview of enrollment restrictions (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/restrictions)
- [Create device platform restrictions (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/create-platform-restrictions)
