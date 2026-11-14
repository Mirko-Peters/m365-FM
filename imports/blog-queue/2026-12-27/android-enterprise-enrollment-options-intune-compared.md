---
title: "Android Enterprise Enrollment Options in Intune Compared: Fully Managed, Work Profile, Dedicated"
summary: "Compare Android enrollment options in Intune using Microsoft Learn: corporate-owned work profile, fully managed, dedicated, AOSP, zero-touch and personal work profile enrollment paths, the Managed Google Play requirement and the deprecation of device administrator."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [intune]
keypoints:
  - "Android Enterprise options are corporate-owned work profile, fully managed, dedicated devices and personally owned work profile. AOSP covers corporate-owned devices without Google Mobile Services."
  - "All Android Enterprise options need a Managed Google Play connection. Check regional availability before creating an enrollment profile."
  - "Device administrator management is deprecated and no longer available for devices with access to Google Mobile Services."
  - "Fully managed, dedicated and corporate-owned work profile devices need a factory reset to enroll. Personal work profile does not."
  - "Learn recommends zero-touch enrollment for bulk enrollments and remote workers. It also describes web-based and app-based enrollment for personal work profile."
faq:
  - q: "What is the difference between fully managed and work profile?"
    a: "According to Microsoft Learn, fully managed is corporate-owned and work only, with one user per device, letting you manage the entire device and enforce controls not available with the work profile method. A corporate-owned work profile creates a separate work profile so users can switch between personal and work apps."
  - q: "What are dedicated devices for?"
    a: "Single-use or kiosk scenarios. Learn says dedicated devices limit apps and web links and prevent use outside the intended scope, for example digital signage or inventory management."
  - q: "Do I need Managed Google Play?"
    a: "Yes for Android Enterprise management options. Learn says the connection is required for personally owned work profile, corporate-owned work profile, fully managed and dedicated."
  - q: "Is device administrator still an option?"
    a: "Learn says device administrator management is deprecated and no longer available for devices with access to Google Mobile Services. It recommends switching to another management option."
  - q: "Which options need a factory reset?"
    a: "Corporate-owned work profile, fully managed and dedicated. Personally owned work profile and device administrator do not, according to the page's table."
---

Android enrollment in Intune starts with device ownership and purpose: personal or corporate, shared or single-user, with or without Google Mobile Services. This article compares the options using two Microsoft Learn pages and states plainly where those pages stop. The Android enrollment page does not include a side-by-side comparison table, so the tables below summarize its descriptions.

## Corporate and personal options

| Option | Ownership | What the page says |
| --- | --- | --- |
| Corporate-owned work profile | Corporate-owned, also approved for personal use | A separate work profile lets users switch between personal and work apps. The user enrolls through the Intune app. |
| Fully managed | Corporate-owned, work only | One user per device. You manage the entire device and can enforce controls not available with the work profile method. |
| Dedicated device | Corporate-owned, single-use or kiosk | Limits apps and web links and prevents use outside the intended scope, such as digital signage or inventory management. |
| AOSP, userless | Corporate-owned, without Google Mobile Services | No associated user, intended to be shared, for example in a library or lab. |
| AOSP, user associated | Corporate-owned, without Google Mobile Services | Associated with a single user, exclusively for work use. |
| Zero-touch enrollment | Corporate-owned | Devices are prepared ahead of time and enroll automatically as fully managed when turned on. Recommended for bulk enrollments and remote workers. |
| Personally owned work profile | Personal (BYOD) | Work profile on an employee's own device. Leaving the profile returns the user to the personal side, which Intune policies do not affect. |

## Personal work profile enrollment paths

The work profile page compares three paths:

| Aspect | Corporate-owned | Personal, app-based | Personal, web-based |
| --- | --- | --- | --- |
| Who initiates | IT or the user | The user | The user |
| Start method | QR code, token or app | Install Company Portal from Google Play | Open an enrollment URL in a browser such as Chrome or Edge |
| Policy delivery | Android Management API | Custom DPC | Android Management API |
| Company Portal role | Hidden or redirects to Intune | Required for enrollment and the app catalog | Installed for the app catalog, not required for enrollment |

## Requirements

- Connect your Intune tenant to a Managed Google Play account. The page says this is required for all Android Enterprise options, and all work profile apps come from Managed Google Play.
- Check regional availability before you create an enrollment profile. The page links to Android Enterprise Help.
- The page does not state whether AOSP options or device administrator need the Managed Google Play connection, and it does not say they do not.

## Factory reset

| Option | Reset required |
| --- | --- |
| Personally owned work profile | No |
| Corporate-owned work profile | Yes |
| Fully managed | Yes |
| Dedicated | Yes |
| Device administrator | No |

## Device administrator

Learn says device administrator management is deprecated and no longer available for devices with access to Google Mobile Services. Support and help documentation remain for some Android 15 and earlier devices without Google Mobile Services. Microsoft recommends switching to another management option.

## A selection guide

This guide is a suggestion built from the descriptions, not a Microsoft decision tree.

1. Personal device, user brings their own: personally owned work profile.
2. Company device that staff may also use personally: corporate-owned work profile.
3. Company device for work only, one user: fully managed.
4. Shared or single-purpose device such as a kiosk: dedicated.
5. Company device without Google Mobile Services: AOSP.
6. Many devices to roll out: consider zero-touch with fully managed.

## Not covered

The pages do not describe QR code, token or NFC enrollment steps for each option, Google Account enrollment, supported Android versions, step-by-step procedures or the Managed Google Play connection steps. The work profile page does not cover fully managed and dedicated scenarios, and the enrollment page does not describe the personally owned work profile enrollment method.

## Related

- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Set up enrollment of Android devices in Intune](https://learn.microsoft.com/intune/intune-service/enrollment/android-enroll)
- [Set up enrollment of Android Enterprise work profile devices](https://learn.microsoft.com/intune/intune-service/enrollment/android-enterprise-overview)
