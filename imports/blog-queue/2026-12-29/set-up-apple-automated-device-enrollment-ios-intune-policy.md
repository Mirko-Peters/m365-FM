---
title: "Set Up Apple Automated Device Enrollment for iOS and iPadOS in Intune: Enrollment Policy Steps"
summary: "Create an iOS and iPadOS Automated Device Enrollment policy in Intune using Microsoft Learn: prerequisites, the path to Enrollment policies, user affinity and authentication choices, supervision, locked enrollment, Await final configuration, Setup Assistant screens and assigning a default policy."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [intune]
keypoints:
  - "ADE needs new or wiped devices from Apple Business or Apple School Manager, an active Apple token and an Apple MDM push certificate in Intune."
  - "Create the policy under Devices, Device onboarding, Enrollment, Apple mobile, Enrollment program tokens, Enrollment policies, Create policy. One token supports up to 1,000 enrollment policies."
  - "With the October 2026 (2610) service release, Intune ended support for Setup Assistant (legacy) authentication and updated existing ADE profiles to Setup Assistant with modern authentication."
  - "Changes to an existing policy do not reach assigned devices until they are reset and reactivated. Only the device name template applies at the next check-in."
  - "Assign a policy or set a default before devices are turned on, otherwise enrollment of a synced device without a policy fails."
faq:
  - q: "What do I need before creating an ADE policy?"
    a: "According to Microsoft Learn, new or wiped iOS or iPadOS devices from Apple Business or Apple School Manager, access to that portal, an active Apple token (.p7m file) and an Apple MDM push certificate in Intune."
  - q: "Where do I create the policy?"
    a: "In the Intune admin center go to Devices, expand Device onboarding, select Enrollment, open the Apple mobile tab, choose Enrollment program tokens, pick a token, select Enrollment policies and Create policy, then iOS/iPadOS."
  - q: "Which authentication method is recommended?"
    a: "Learn recommends Setup Assistant with modern authentication with just-in-time registration. Intune ended Setup Assistant (legacy) support with the October 2026 (2610) service release."
  - q: "What does Await final configuration do?"
    a: "When set to Yes, it locks the end of Setup Assistant until device configuration policies install. Learn says most test devices reached the home screen within 15 minutes, and that apps are not included during this screen."
  - q: "Why is the Passcode screen a problem?"
    a: "Learn says the Passcode and Touch ID and Face ID screens do not work correctly on iOS and iPadOS 14.5 and later, so hide both and require a passcode through a configuration or compliance policy."
---

Automated Device Enrollment (ADE) enrolls corporate iOS and iPadOS devices without user interaction beyond Setup Assistant. In Intune the behavior is defined by an enrollment policy. This guide follows the Microsoft Learn article on setting up ADE for iOS and iPadOS and the related article on authentication methods.

## Prerequisites

- New or wiped iOS or iPadOS devices bought from Apple Business or Apple School Manager. Learn advises wiping devices first, because ADE applies configuration the user may not be able to remove.
- Access to business.apple.com or school.apple.com.
- An active Apple token (.p7m file) and an Apple MDM push certificate in Intune.
- The Intune Company Portal deployed through Intune, not the App Store. The App Store version is not compatible with ADE. Deploy it as a required VPP app with device licensing and set Automatic app updates to Yes in the token settings.

## Create the enrollment policy

1. In the Microsoft Intune admin center go to **Devices**, expand **Device onboarding** and select **Enrollment**.
2. Select the **Apple mobile** tab and **Enrollment program tokens**.
3. Choose a token, select **Enrollment policies**, then **Create policy** and **iOS/iPadOS**.
4. Enter a name and description on **Basics**.
5. Optionally pick a static Microsoft Entra security group on **Device group** for enrollment time grouping.
6. On **Configuration settings** choose **User Affinity**: enroll with user affinity, without user affinity (for kiosk, point-of-sale or shared devices) or with Microsoft Entra ID shared mode.
7. For user affinity choose Company Portal or **Setup Assistant with modern authentication**, which Learn recommends.
8. Set **Supervised** to Yes for more management options. Learn recommends ADE for supervision, and a device enrolled unsupervised can later be supervised only with Apple Configurator on a Mac over USB.
9. Set **Locked enrollment** to Yes to hide the button that removes the management profile. Shared mode devices must use Yes.
10. Optionally configure Shared iPad, **Await final configuration**, a device name template (up to 63 characters, for example `{{DEVICETYPE}}-{{SERIAL}}`), cellular data plan and Setup Assistant screens.
11. Select **Create**.

Limit: 1,000 enrollment policies per enrollment token. The older Profiles experience will be retired, so create new policies under Enrollment policies.

## Settings worth understanding

- **Await final configuration:** Yes is the default for new policies. It holds Setup Assistant so device configuration policies install before the home screen. There is no minimum or maximum wait, and apps are not included.
- **Shared iPad:** only with enroll without user affinity and supervised. It needs iOS or iPadOS 13.4 or later. Cached users go up to 24 on a 32 GB or 64 GB device.
- **Setup Assistant screens:** Hide skips a screen, and users can configure the feature later in Settings.

## Authentication change in October 2026

With the 2610 service release, Intune ended support for Setup Assistant (legacy) authentication for iOS/iPadOS and macOS ADE with user affinity. This comes from Learn's authentication methods article, not from the setup article. Existing profiles are updated automatically to Setup Assistant with modern authentication, and the legacy option is no longer available when creating or editing profiles. Enrolled devices are not affected. Review your profiles and test the modern authentication enrollment experience.

## Assign policies

To assign, open the token, select **Devices**, pick devices and **Assign policy**. For a default, select **Set Default Policy** on the token. Assign a policy before devices become active, because a synced device without a policy fails to enroll when turned on. Changes to an existing policy apply only after a reset and reactivation, except the device name template. Make sure Device Type Restrictions does not block iOS and iPadOS for the default All Users policy, or the device shows Invalid Profile.

## Limitations

The Passcode and Touch ID and Face ID screens do not work correctly on iOS and iPadOS 14.5 and later. Hide them and deploy a passcode requirement through a device configuration or compliance policy.

## Choosing user affinity and authentication

The user affinity setting decides how a device is tied to a person. With user affinity, the device is associated with the user who signs in during setup. Without user affinity, the device is not tied to a person, which fits kiosk, point-of-sale or shared devices. Microsoft Entra shared mode is meant for devices used by several people. For user affinity, Learn recommends Setup Assistant with modern authentication, which supports just-in-time registration. The Company Portal option remains available as the alternative.

## Other configuration settings

- **Department and department phone:** optional contact details you can set in the policy.
- **Device name template:** supports the `{{DEVICETYPE}}` and `{{SERIAL}}` variables and applies at the next check-in even to enrolled devices.
- **Cellular data plan:** an optional setting in the policy.

## A suggested rollout order

This list is a suggestion, not a Microsoft procedure. Test with one wiped device and a pilot token policy first. Confirm that the Company Portal is deployed as a required VPP app. Then assign the policy to the remaining devices, and keep one default policy as a safety net.

## Not covered

The page does not state a token validity period. Intune alerts you before a token expires, and devices cannot enroll if it does.

## Related

- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Set up automated device enrollment (ADE) for iOS/iPadOS (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/apple/setup-automated-ios)
- [Authentication methods for Apple automated device enrollment (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/apple/ref-automated-authentication-methods)
