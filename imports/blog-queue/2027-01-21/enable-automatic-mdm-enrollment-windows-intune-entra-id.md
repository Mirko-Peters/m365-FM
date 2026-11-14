---
title: "How to Enable Automatic MDM Enrollment for Windows With Intune and Microsoft Entra ID"
summary: "Set up Intune automatic MDM enrollment for Windows: prerequisites, the MDM user scope options None, Some and All, default URLs, the WIP scope conflict, the work or school account setting, MFA advice and the duplicate-record fix, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [intune, entra-id, mfa]
keypoints:
  - "Automatic enrollment lets Windows devices enroll in Intune when they join or register in Microsoft Entra ID. It needs Intune plus Microsoft Entra ID P1 or P2."
  - "You need the built-in Global Administrator role. The setting is in Devices, Device onboarding, Enrollment, Windows tab, Automatic Enrollment."
  - "MDM user scope has three options: None (users start enrollment themselves), Some (selected users) and All."
  - "Keep the MDM terms of use, discovery and compliance URLs at their defaults. Set the WIP user scope to None, or keep users out of both scopes."
  - "Learn recommends requiring multifactor authentication during device registration, because two-factor is not enabled for automatic enrollment by default."
faq:
  - q: "What does automatic MDM enrollment do?"
    a: "According to Microsoft Learn, devices enroll in Intune automatically when a Microsoft Entra user adds their work or school account to a personal device, or when a corporate-owned device joins Microsoft Entra ID. It can be used with BYOD, bulk enrollment, Group Policy, Windows Autopilot in user-driven and self-deploying modes, and co-management with Configuration Manager."
  - q: "What do I need before I start?"
    a: "Learn lists a Microsoft Intune subscription and Microsoft Entra ID P1 or P2 (a free Premium trial can be activated during setup). You sign in to the Microsoft Intune admin center with the built-in Global Administrator Microsoft Entra role."
  - q: "What is the difference between None, Some and All for the MDM user scope?"
    a: "None disables automatic MDM enrollment for all users, and users must start MDM enrollment themselves, though you can still manage devices in Intune. Some enables it for the users you select. All enables it for all users, whose devices enroll automatically when they join or register with Microsoft Entra ID."
  - q: "What happens if a user is in both the MDM and the WIP user scope?"
    a: "Learn says the MDM user scope takes precedence on a corporate-owned device, so the device enrolls in Intune. On a bring-your-own device the WIP user scope takes precedence, the device does not enroll for device management, and Microsoft Purview Information Protection policies are applied if you configured them. The page tells you to set the WIP user scope to None."
  - q: "Why do I see two device records after enrollment?"
    a: "Learn says you see two records in the Intune admin center if automatic MDM enrollment is disabled and devices are joined to Microsoft Entra ID. To stop duplicates, tell users on joined devices to go to Settings, Accounts, Access work or school, and select Connect using the same account."
---

Automatic MDM enrollment lets Windows devices enroll in Microsoft Intune the moment they join or register in Microsoft Entra ID, with no separate enrollment step for the user. The setting lives in the Intune admin center and has a few options that change who gets enrolled. This article follows the Microsoft Learn page on enabling Windows automatic enrollment.

## When enrollment happens

Learn says enrollment occurs when either of these happens:

- A Microsoft Entra user adds their work or school account to their personal device.
- A corporate-owned device joins your Microsoft Entra ID.

The page lists these scenarios where automatic enrollment can be used: bring-your-own-device (BYOD) personal devices, bulk enrollment, Group Policy, Windows Autopilot (user-driven and self-deploying) and co-management with Configuration Manager.

## Prerequisites

| Requirement | Detail from Learn |
| --- | --- |
| Licensing | A Microsoft Intune subscription, plus Microsoft Entra ID P1 or P2 (a Premium trial can be activated during setup) |
| Role | Built-in Global Administrator Microsoft Entra role, signed in to the Microsoft Intune admin center |

Automatic MDM enrollment is described as a premium Microsoft Entra feature. If you do not see the automatic enrollment settings, the page says to select the link that says it is available only for Microsoft Entra ID Premium subscribers to activate a free trial.

## Steps in the admin center

1. Sign in to the Microsoft Intune admin center.
2. Go to **Devices**.
3. Expand **Device onboarding** and select **Enrollment**.
4. Open the **Windows** tab and select **Automatic Enrollment**.
5. Configure the **MDM user scope** (see the next section).
6. Use the default values for the **MDM terms of use URL**, **MDM discovery URL** and **MDM compliance URL**.
7. Optionally set **Disable MDM enrollment when adding work or school account** (see below).
8. Set the **WIP user scope** to **None**, or make sure its users are not in the MDM user scope.
9. Select **Save**.

## The MDM user scope

| Option | Effect |
| --- | --- |
| None | Automatic MDM enrollment is off for all users. You can still manage devices in Intune, but users must start MDM enrollment |
| Some | On for the users you select |
| All | On for all users. Their devices enroll automatically when they join or register with Microsoft Entra ID |

For Windows BYOD, the page's tip says to choose **All** or **Some** for the MDM user scope, make sure the WIP user scope is **None** or **Some**, and make sure users are not members of both scopes.

### If a user is in both scopes

Learn spells out the precedence:

- On a corporate-owned device, the MDM user scope wins. The device enrolls in Intune when the user sets it up for work.
- On a bring-your-own device, the WIP user scope wins. The device does not enroll for device management, and Microsoft Purview Information Protection policies are applied if configured.

The page tells you to select None for the WIP user scope, or, if you use another value, to make sure those users are not part of the MDM user scope.

## The work or school account setting

The setting **Disable MDM enrollment when adding work or school account** controls whether users on Microsoft Entra registered devices are prompted to MDM enroll in the work or school account registration flow. Learn marks it as public preview and says it is off by default. Details:

- If you enforce Windows MAM for work or school accounts, enable this setting.
- It applies to users in the Some or All category, on Entra registered and workplace joined devices, who add their account for the first time via Microsoft Edge or a native app such as Teams. It does not apply when users add the account through the Settings flow.
- It only removes the MDM option from the registration flow. Users can still MDM enroll through Windows Settings if they are in scope, and through prompts when they try to reach a resource that requires MDM enrollment.

Because the feature is in preview, check the page for its current status before you rely on it.

## Multifactor authentication

The page says two-factor authentication is not enabled for automatic enrollment by default, and recommends requiring multifactor authentication during device registration. It links an older article on the Azure Multi-Factor Authentication Server, so use your current MFA or Conditional Access setup for the actual configuration. That is my reading of the link, not a statement on the page.

## What users do

Per Learn, users on personal Windows devices can enroll automatically by adding their work or school account, or by using the Intune Company Portal app. Devices with earlier Windows versions must enroll using the Company Portal app. Users who reach apps assigned for specific Windows versions through the Company Portal website must use Microsoft Edge, because Learn says other browsers do not support that filtering.

## Duplicate device records

If automatic MDM enrollment is disabled and devices are joined to Microsoft Entra ID, you see two records after enrollment. Tell users on joined devices to open **Settings** > **Accounts** > **Access work or school** and **Connect** with the same account. That stops the duplicates, according to the page.

## Rollout order (my advice)

This is my suggestion, not a Microsoft procedure:

1. Start with **Some** and a pilot group, then widen to **All** once enrollment looks right.
2. Check the WIP user scope before saving, since a user in both scopes behaves differently on corporate and personal devices.
3. Decide on MFA at registration before you go to All. It is easier than adding it later.
4. Write one help desk sentence for the duplicate record case.

## What the page says about problems

The page lists no known issues for MDM automatic enrollment for Windows. For failing individual enrollments, it does not give error codes, so look at other Intune troubleshooting pages for that.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)

## Sources

- [Enable MDM automatic enrollment for Windows (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/windows/enable-automatic-mdm)
