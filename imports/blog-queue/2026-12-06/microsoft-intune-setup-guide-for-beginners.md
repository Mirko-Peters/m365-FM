---
title: "Microsoft Intune Setup Guide for Beginners: Steps in the Right Order"
summary: "A beginner's Intune setup guide following Microsoft's five-step sequence: set up the tenant, protect apps, plan compliance, configure devices and enroll them, with prerequisites and pilot advice."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [intune, entra-id, device-compliance, windows-autopilot]
keypoints:
  - "Microsoft's deployment sequence has five steps: set up Intune, add and protect apps, create compliance policies, configure device features, then enroll devices."
  - "Before users can enroll, set the MDM authority to Intune and assign an Intune license to each user or userless device."
  - "The free trial provides 25 Intune licenses and sets the MDM authority to Intune by default."
  - "All device platforms can enroll by default. Use a device platform restriction to block some."
  - "Pilot first: assign enrollment policies to a small test group and expand in stages."
faq:
  - q: "What is the first thing to do when setting up Intune?"
    a: "Microsoft Learn says to review the planning guide, check supported configurations and network endpoints, then sign up or sign in. If you already have a work or school account, you sign in with it and add Intune to the subscription."
  - q: "Do I need to set an MDM authority?"
    a: "Yes. The setup article says the MDM authority must be set before users can enroll devices. The free trial sets it to Intune by default. The enrollment guide adds that it must be Intune even when you use co-management."
  - q: "How many licenses does the free trial include?"
    a: "The Microsoft Learn setup article states that the free trial provides 25 Intune licenses. Each user or userless device needs a license assigned before enrollment."
  - q: "Can I stop certain platforms from enrolling?"
    a: "Yes. Microsoft Learn says all device platforms can enroll by default. You can block specific platforms with a device platform restriction, called an enrollment restriction policy in the enrollment guide."
  - q: "Which admin role do I need to create enrollment policies?"
    a: "The enrollment guide names the built-in Policy and Profile Manager role and notes that some platforms may require the more privileged Intune Administrator role in Microsoft Entra ID."
---
Setting up Microsoft Intune goes best in a fixed order: tenant and licenses first, then apps, compliance and configuration, and enrollment last. This guide follows the five-step sequence Microsoft uses in its Intune documentation and adds the checks that beginners tend to skip.

## The five steps in Microsoft's order

Microsoft's "Get started" page lists these steps:

1. Set up Intune.
2. Add and protect apps.
3. Create compliance policies and Conditional Access.
4. Configure device features.
5. Enroll devices.

Enrollment comes last on purpose. If devices enroll before policies exist, they receive nothing useful, and your first users meet an unfinished setup.

## Step 1: Set up the tenant

You start in the Microsoft Intune admin center. Microsoft Learn lists these tasks:

- **Review supported configurations.** Check supported platforms, supported browsers for the admin center, bandwidth and the network endpoints needed for proxy settings.
- **Sign up or sign in.** With an existing work or school account, sign in and add Intune to the subscription. Otherwise sign up.
- **Custom domain (optional).** A default `onmicrosoft.com` domain is created automatically. If you evaluate with the free trial, you can skip this.
- **Add users.** Required unless you use userless kiosk devices. You need the License Administrator or User Administrator role. You can add users singly, in bulk or by syncing Active Directory.
- **Create groups.** Use Microsoft Entra groups to organize users and devices and to target policies and apps.
- **Assign licenses.** Each user, or each userless device, needs an Intune license before enrollment. The free trial provides 25 licenses.
- **Set roles.** Assign built-in roles such as Policy and Profile Manager, use custom roles for least privilege, and use scope tags to limit what admins see. Multi Admin Approval can require a second admin for high-impact actions such as wipes.
- **Set the MDM authority.** It must be set before users can enroll. The free trial sets it to Intune.
- **Customize Company Portal.** Users use it to enroll devices, install apps and find help.

Tenants created after July 2021 allow unlicensed admins by default. Microsoft says this applies to all administrators.

## Step 2: Add and protect apps

Microsoft's guidance is to assign baseline apps during enrollment, use app protection policies (MAM) for personal devices and use multifactor authentication. The page I read gives only this summary, so use the linked deployment article for detail.

## Step 3: Plan compliance and Conditional Access

Create compliance policies, assign them during enrollment and enable Conditional Access to enforce them. Compliance policies are platform specific, and each platform needs its own policy. Conditional Access needs Microsoft Entra ID P1 or P2.

## Step 4: Configure device features

Create device configuration and endpoint security profiles for Android, iOS and iPadOS, macOS and Windows. The Intune documentation points to the settings catalog and endpoint security policies for this.

## Step 5: Enroll devices

Enrollment installs an MDM certificate on the device so Intune can apply policy. Microsoft's enrollment guide lists these prerequisites:

- Intune set up, with the **MDM authority set to Intune**.
- Intune licenses assigned.
- User and device groups ready to receive enrollment policies.
- The Policy and Profile Manager role, or Intune Administrator for some platforms.
- For Apple platforms, an MDM push certificate from Apple. iOS and iPadOS also need an Apple ID.

Enrollment is enabled for all platforms by default. To block platforms, create a platform restriction. Unenroll devices from any other MDM provider first. Factory reset is required for some platforms, such as iOS, iPadOS and macOS, and not for Windows.

For Windows, the guide lists automatic enrollment, Windows Autopilot, user enrollment and co-management. For automatic enrollment you set the MDM user scope under **Windows Enrollment** > **Automatic Enrollment**. Autopilot is intended for organization-owned devices and needs Entra ID P1 or P2.

## Pilot before you expand

Microsoft advises assigning enrollment policies to a small test group first, then expanding in stages. The guide also notes that the MDM certificate renews automatically while a device communicates with Intune, and that Intune deletes idle device records 180 days after the certificate expires.

## Common beginner mistakes

- Enrolling devices before compliance and configuration policies exist.
- Forgetting to assign licenses to users.
- Leaving the compliance default for devices without a policy unchanged when Conditional Access is in use.
- Enrolling devices that another MDM still manages.
- Skipping the pilot group.

## What the pages do not say

The Get started page does not cover the free trial sign-up steps, and the setup article gives no click-by-click menu paths for most tasks. For these, follow the linked Learn articles.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)

## Sources

- [Get started with Microsoft Intune](https://learn.microsoft.com/en-us/intune/fundamentals/get-started)
- [Set up Intune, step 1](https://learn.microsoft.com/en-us/intune/fundamentals/deploy-setup-step-1)
- [Intune device enrollment guide](https://learn.microsoft.com/intune/device-enrollment/guide)
- [Windows device enrollment guide](https://learn.microsoft.com/en-us/intune/device-enrollment/windows/guide)
- [Intune device compliance policies](https://learn.microsoft.com/en-us/intune/intune-service/protect/device-compliance-get-started)
