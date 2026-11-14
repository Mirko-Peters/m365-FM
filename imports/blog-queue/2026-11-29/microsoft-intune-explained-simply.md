---
title: "Microsoft Intune Explained Simply: What It Does and How It Works"
summary: "Microsoft Intune explained in plain terms: what it manages, the difference between device and app management, how it works with Entra ID and Conditional Access, compliance policies, licensing and how to start."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [intune, device-compliance, conditional-access]
keypoints:
  - "Intune is a cloud-based endpoint management service that enrolls, configures, secures and updates devices and protects apps. It runs entirely in the cloud."
  - "It supports Android, iOS and iPadOS, Linux, macOS, tvOS, visionOS and Windows, and you manage it in the Microsoft Intune admin center."
  - "Mobile device management controls the whole device. Mobile application management controls only work apps and their data, which suits personal devices."
  - "Intune relies on Microsoft Entra ID for sign-in and groups, and sends device compliance state to Conditional Access."
  - "Devices with no compliance policy are marked compliant by default. Microsoft advises setting this to Not compliant if you use Conditional Access."
faq:
  - q: "What is Microsoft Intune in simple terms?"
    a: "According to Microsoft Learn, Intune is a cloud-based endpoint management service that secures and manages your organization's devices and apps. You use it to enroll, configure, secure and update devices, deploy and protect apps, and control which users and devices can access organization resources."
  - q: "What is the difference between MDM and MAM in Intune?"
    a: "With mobile device management, devices are enrolled and Intune manages the whole device, including settings, security and apps. With mobile application management, Intune manages only the work apps and the data inside them, which is typical for personal devices. Microsoft says the two can be combined."
  - q: "Does Intune store user identities?"
    a: "No. Microsoft Learn says Intune doesn't store user identities or perform authentication. It relies on Microsoft Entra ID for authentication, users and groups, and Conditional Access."
  - q: "Do I need a license to use Intune?"
    a: "Each managed user or device needs an Intune license, but administrators can manage Intune without one, per Microsoft Learn. Capabilities are available through Microsoft 365 plans, Microsoft Intune Suite or standalone subscriptions."
  - q: "How can I try Intune?"
    a: "Microsoft Learn points to a free 30-day trial to evaluate Intune in your environment, and to the Microsoft Intune admin center as the web console."
---

Microsoft Intune is a cloud service that lets an organization manage its devices and the apps on them from one web console. It can enroll devices, apply settings, check security, deploy apps and decide, together with Microsoft Entra ID, whether a device may reach company data. No on-premises server is needed.

## What Intune does

Microsoft Learn describes Intune as a cloud-based endpoint management service that secures and manages your organization's devices and apps. It covers the lifecycle of a managed device: enrolling devices, configuring settings, securing endpoints, deploying and protecting apps, and keeping everything up to date.

Supported platforms are Android, iOS and iPadOS, Linux, macOS, tvOS, visionOS and Windows. You manage everything in the Microsoft Intune admin center. Every admin center action is backed by a Microsoft Graph API call, so you can automate the same operations.

Microsoft describes Intune as built around three pillars: the identities that sign in, the devices they sign in from, and the apps they use.

## Two ways to manage: devices or apps

### Mobile device management (MDM)

The device is enrolled. Users enroll through the Company Portal, or enrollment happens automatically through Windows Autopilot, Apple Automated Device Enrollment or Android Enterprise. Intune then manages settings, security and apps for the whole device. If a device is lost or stolen, you can wipe it.

### Mobile application management (MAM)

Intune manages only the work apps and the data inside them, not the rest of the device. It is typical for personal devices (bring your own device), though it also runs alongside MDM on corporate devices. The user keeps control of personal apps and content. When the user leaves, you can selectively wipe organization data.

### Which to choose

| Situation | Typical choice |
|---|---|
| Company-owned laptop or phone | MDM |
| Personal phone used for email and Teams | MAM |
| Company phone with especially sensitive apps | MDM plus MAM |

Microsoft states you can combine the two. The example it gives is an enrolled corporate phone with app protection policies on apps that handle sensitive data.

## How Intune works with Microsoft Entra ID

Intune doesn't store identities or perform authentication. It relies on Microsoft Entra ID for three things:

1. **Authentication:** users sign in to managed devices with Entra credentials.
2. **Users and groups:** Entra security groups are the foundation for assigning policies, profiles and apps. You target a group of users, devices or both, and Intune applies the configuration on check-in.
3. **Conditional Access:** Intune sends device compliance state to Entra. Conditional Access combines it with user, app, location and risk signals to allow or block access.

This is how access decisions can be based on current device posture instead of whether a device is on the corporate network.

## Compliance policies in plain words

A compliance policy is a set of platform-specific rules you deploy to groups of users or devices. Devices evaluate the rules and report a status. A noncompliant status can trigger actions.

Microsoft's examples of rules include a minimum OS version, no jailbreak or root, and a maximum threat level as set by threat management software. Settings include device encryption, minimum and maximum OS version, PIN or password configuration and Windows health attestation. Actions for noncompliance include sending email alerts, remotely locking devices and retiring devices.

If Conditional Access requires a device to be marked as compliant, the compliance status decides whether access to email and other resources is granted.

### The setting that surprises people

In the Microsoft Intune admin center, go to **Endpoint security** > **Device compliance** > **Compliance policy settings**. These are tenant-wide settings that act like a built-in compliance policy every device receives. One of them is **Mark devices with no compliance policy assigned as**. The default is **Compliant**, which means devices without a compliance policy are considered compliant. Microsoft advises: if you use Conditional Access with compliance policies, change this to **Not compliant**, so only devices confirmed as compliant can reach your resources.

Also note the **Compliance status validity period (days)**. A device that fails to report its compliance status for a policy before the period expires is treated as noncompliant. The default is 30 days, and you can configure 1 to 120 days.

## Licensing

Entra users and groups are also used to assign Intune licenses. Each managed user or device needs an Intune license, but admins can manage Intune without one. Advanced capabilities are available through Microsoft 365 plans, Microsoft Intune Suite or standalone subscriptions. The pages I read do not list which Microsoft 365 plans include which Intune features, so check the Intune licensing comparison before you plan a rollout.

Microsoft also describes Copilot in Intune as an AI assistant built into the admin center, powered by Microsoft Security Copilot.

## How to get started

1. Sign up for the free 30-day trial, or use your existing Microsoft 365 subscription if it includes Intune.
2. Open the [Microsoft Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431).
3. Create Entra security groups for pilot users and devices.
4. Choose an enrollment method for each platform.
5. Create a compliance policy and assign it to the pilot group.
6. Review the no-policy setting, then connect compliance to a Conditional Access policy.
7. Expand to more groups once the pilot is stable.

Microsoft's page does not give click-by-click steps for these items. It links to separate sign-up and enrollment articles.

## Common mistakes

- Treating Intune as an identity system. It uses Entra ID for that.
- Leaving the default for devices with no compliance policy while using Conditional Access.
- Using MDM on personal phones when MAM would respect privacy and still protect work data.
- Forgetting group targeting. Policies apply only to the groups you assign.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [What is Microsoft Intune, Microsoft Learn](https://learn.microsoft.com/en-us/intune/fundamentals/what-is-intune)
- [Device compliance policies in Microsoft Intune, Microsoft Learn](https://learn.microsoft.com/en-us/intune/device-security/compliance/overview)
