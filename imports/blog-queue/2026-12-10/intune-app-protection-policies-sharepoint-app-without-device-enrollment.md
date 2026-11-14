---
title: "Intune app protection policies for the SharePoint app without device enrollment"
summary: "How to protect SharePoint data on unenrolled phones with Intune app protection policies and Conditional Access, including the Company Portal and Authenticator broker requirements and what the policies cannot do."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [intune, sharepoint, conditional-access, microsoft-entra]
keypoints:
  - "App protection policies protect data inside apps and work without MDM enrollment. The policy follows the user's Entra identity, not the device."
  - "Users need an Entra account, an Intune license, membership in a targeted security group, and must sign in to the app with that account."
  - "Android needs the Intune Company Portal to receive policies. Conditional Access with Require app protection policy needs a broker app: Authenticator on iOS or Company Portal on Android."
  - "Create the policy under Apps > Protection > Create policy. Core Microsoft Apps includes SharePoint, OneDrive, Outlook and Teams."
  - "Without enrollment, apps are not deployed, and certificates, Wi-Fi and VPN settings are not provisioned. Apply app protection policies before the Conditional Access rule."
faq:
  - q: "Do I need to enroll devices to use app protection policies?"
    a: "No. Microsoft Learn says you can use Intune app protection policies independent of any mobile device management solution. For BYOD devices not enrolled in any MDM, the limits are that apps are not deployed, certificate profiles are not provisioned, and company Wi-Fi and VPN settings are not provisioned."
  - q: "Is the SharePoint app supported?"
    a: "Yes. Learn lists Microsoft SharePoint among the apps in the Core Microsoft Apps group and in the Conditional Access supported apps list. It also says the Office mobile apps currently only support SharePoint Online, not SharePoint on-premises."
  - q: "What does a user need to receive a policy?"
    a: "Learn lists four requirements: a Microsoft Entra account, an Intune license on that account, membership in a security group targeted by the policy for the specific app, and signing in to the app with the Entra account. On Android the Intune Company Portal is required."
  - q: "How do I force users onto protected apps?"
    a: "Learn recommends pairing app protection policies with Conditional Access. The grant control Require app protection policy checks that a policy is present on the client app. It needs the device registered in Entra ID through a broker app."
  - q: "Which grant should I use now, approved client app or app protection policy?"
    a: "The Learn page I read says the approved client app grant was retiring in early March 2026, that policies using only that grant must move to Require Approved Client App or Application Protection Policy, and that new policies should apply only the Require application protection policy grant. That date has passed, so check the current status on Learn."
---

SharePoint data on personal phones can be protected without enrolling the device. Create an Intune app protection policy that targets the SharePoint app for a user group, then add a Conditional Access policy that requires an app protection policy so users cannot reach SharePoint from an unprotected app. The policy works at the app and identity level, which is also its limit.

## What works without enrollment

Learn says app protection policies can be used independently of any mobile device management solution. For devices not enrolled in any MDM, Learn lists these limits: apps are not deployed (users get them from the store), certificate profiles are not provisioned, and company Wi-Fi and VPN settings are not provisioned.

Per Learn, the policy follows the user's identity, so one policy can cover both enrolled and unenrolled devices. You can also split them with filters: a strict policy for unmanaged devices and a relaxed one for managed devices.

## Prerequisites

From the app protection policy page:

- The user has a Microsoft Entra account.
- The user has an Intune license on that account.
- The user is in a security group targeted by an app protection policy, and the policy targets the specific app.
- The user signs in to the app with that Entra account.
- On Android, the Intune Company Portal must be installed to receive policies. Learn says unmanaged Android users are prompted to install it.

The Office mobile apps support SharePoint Online but not SharePoint on-premises.

## Step 1: Create the app protection policy

In the Intune admin center, go to **Apps** > **Protection** > **Create policy**, then choose **iOS/iPadOS** or **Android**. You pick the platform when you create the policy. The tabs are:

1. **Basics:** name and optional description.
2. **Apps:** set **Target policy to**. The options are **All Apps**, **Microsoft Apps**, **Core Microsoft Apps** and **Selected apps**. Learn says Core Microsoft Apps includes Microsoft Edge, Excel, Office, OneDrive, OneNote, Outlook, PowerPoint, SharePoint, Teams, To Do and Word. You must add at least one app.
3. **Data protection:** cut, copy, paste and save-as restrictions and similar controls.
4. **Access requirements:** PIN and credential requirements.
5. **Conditional launch:** choose a **Setting**, a **Value** and an **Action** for users who do not meet it.
6. **Assignments:** include or exclude groups. The policy does nothing until it is assigned.

Learn notes the settings apply only in the work context, and newly created files are considered personal. The pages I read do not list the individual conditional launch settings, so check the iOS and Android data protection references for current values.

## Step 2: Target unmanaged devices if needed

If you want a policy only for unenrolled devices, use filters. On **Assignments**, select **Edit filter**. For iOS/iPadOS, Learn defines **Unmanaged** as devices where Intune MDM, or a third-party MDM, does not pass the `IntuneMAMUPN` key. For Android, unmanaged means Intune MDM is not detected.

To enforce a policy only on Intune managed iOS devices, Learn says `IntuneMAMUPN` and `IntuneMAMOID` must be configured for all MDM-managed apps. A device with only `IntuneMAMDeviceID` is treated as unmanaged.

## Step 3: Understand policy delivery

Policies do not arrive instantly. Learn's delivery page lists retry intervals by user state: typically about 30 minutes for a registered user, 12 hours when a user has no assigned policy or is not licensed, and 24 hours when the tenant is not onboarded. Retries may require active use of the app. Apps that have not checked in with the Intune MAM service for 90 days may be deregistered and register again on next launch.

Learn's create-policy page says it can take time to apply policies to existing devices, and to apply app protection policies before Conditional Access rules.

## Step 4: Require protection with Conditional Access

An app protection policy alone does not stop users from opening SharePoint in an unprotected app. Learn recommends Conditional Access to ensure enforcement. In a Conditional Access policy, include the users, choose the target resources, and under the grant controls select **Require app protection policy**. The grant control page I read does not give the portal path for creating the policy.

Points from Learn's grant control page:

- The device must be registered in Entra ID, which needs a broker app: Microsoft Authenticator on iOS or Company Portal on Android. If it is missing, the user is sent to the store to install it.
- SharePoint, OneDrive, Outlook and Teams appear on the supported app list, which Learn says is not exhaustive.
- By default, Conditional Access requires all selected controls. You can choose one of them instead.
- Kaizala, Skype for Business and Visio do not support this grant.
- The Learn page says the approved client app grant was retiring in early March 2026, which has passed, so check its current status. New policies should use only the app protection policy grant.

I did not read a page on setting the device platform condition for this scenario. My own suggestion, not from the pages above: start in report-only mode and review the sign-in impact before turning the policy on. Learn's grant controls page recommends report-only mode and the What If tool for **Block access** policies.

## What this does not protect

App protection policies protect data inside protected apps. They do not manage the device, so you cannot require a device passcode through them in the way MDM can, and unmanaged devices still receive no certificates or Wi-Fi settings. Learn does not describe how mobile browser access to SharePoint is handled in this setup, so confirm it with a test account.

## Typical mistakes

- Targeting the policy at a group but not including the SharePoint app.
- Turning on Conditional Access before the policies reached devices.
- Forgetting that Android needs Company Portal and iOS needs Authenticator for the broker.
- Testing with a user who has no Intune license.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)

## Sources

- [App protection policies overview](https://learn.microsoft.com/en-us/intune/app-management/protection/overview)
- [Create and deploy app protection policies](https://learn.microsoft.com/en-us/intune/app-management/protection/create-policy)
- [Understand app protection policy delivery and timing](https://learn.microsoft.com/en-us/intune/app-management/protection/policy-delivery-timing)
- [Conditional Access grant controls: Require app protection policy](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-grant)
