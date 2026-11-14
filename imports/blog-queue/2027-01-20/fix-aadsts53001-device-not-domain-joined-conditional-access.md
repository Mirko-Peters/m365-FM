---
title: "Fix AADSTS53001: Device Not Domain Joined and Blocked by Conditional Access"
summary: "AADSTS53001 DeviceNotDomainJoined means a Conditional Access policy requires a hybrid joined device and the device is not. What the grant control supports, how to find the policy in the sign-in logs, and what to avoid in policy scope."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [entra-id, conditional-access, hybrid-entra-join]
keypoints:
  - "The error reference describes AADSTS53001 as DeviceNotDomainJoined: the policy requires a domain joined device and the device is not. The listed action is to use a domain joined device."
  - "The grant control is named Require Microsoft Entra hybrid joined device. It supports domain-joined Windows down-level and Windows 10 or later devices."
  - "Microsoft Edge in InPrivate mode is not considered a Microsoft Entra hybrid joined device."
  - "The device code OAuth flow does not support the managed device grant control. Learn says to use Require multifactor authentication there."
  - "Find the blocking policy under Entra ID > Monitoring & health > Sign-in logs, on the Conditional Access tab of the failed sign-in."
faq:
  - q: "What does AADSTS53001 mean?"
    a: "The Microsoft Entra error code reference lists it as DeviceNotDomainJoined: a Conditional Access policy requires a domain joined device, and the device is not domain joined. The page's action is to have the user use a domain joined device. Microsoft's Conditional Access troubleshooting page lists it as sign-in error code 53001."
  - q: "Which devices satisfy the Require Microsoft Entra hybrid joined device control?"
    a: "According to Microsoft Learn, the control only supports domain-joined Windows down-level devices, meaning versions before Windows 10, and Windows current devices, meaning Windows 10 or later. It does not consider Microsoft Edge in InPrivate mode a Microsoft Entra hybrid joined device."
  - q: "Can this error appear when I sign in with the device code flow?"
    a: "Learn says that with the device code OAuth flow, the required grant control for the managed device or a device state condition is not supported, because the device that performs authentication cannot provide its device state to the device that provides the code. Use the Require multifactor authentication control instead."
  - q: "How do I find which policy blocked the sign-in?"
    a: "Sign in to the Microsoft Entra admin center as at least a Reports Reader, browse to Entra ID, Monitoring & health, Sign-in logs, find the failed event and open its Conditional Access tab. The Troubleshooting and support tab and the policy name give further detail. You can also use the What If tool."
  - q: "What if the policy blocks every user, including admins?"
    a: "Learn warns that requiring a hybrid joined device for all users and all resources can block everyone who lacks such a device. If you are locked out, another admin who is not blocked can disable the policy. If no admin can, submit a support request and Microsoft support reviews and, after confirming, updates the policies."
---

AADSTS53001 means a Conditional Access policy requires a device that is Microsoft Entra hybrid joined, and the device used for sign-in is not. The fix is either to sign in from a device that meets the control, or to correct the policy, if the policy is broader than intended. This article follows the Microsoft Entra error code reference and the Conditional Access pages on Microsoft Learn.

## What the reference says

The error code reference lists AADSTS53001 as `DeviceNotDomainJoined`: the Conditional Access policy requires a domain joined device, and the device is not domain joined. The action it gives is to have the user use a domain joined device.

The Conditional Access troubleshooting page lists the same code, 53001 DeviceNotDomainJoined, in its table of common Conditional Access error codes, next to related codes such as 53000 DeviceNotCompliant and 53003 BlockedByConditionalAccess. It says the codes appear with the `AADSTS` prefix, for example `AADSTS53002`.

## What the policy control requires

In a Conditional Access policy, the grant control **Require Microsoft Entra hybrid joined device** lets an organization use device identity as part of the policy. The documented properties:

- It only supports domain-joined Windows down-level devices, which are versions before Windows 10, and Windows current devices, which are Windows 10 and later.
- It does not consider Microsoft Edge in InPrivate mode a Microsoft Entra hybrid joined device. A user who opens a private window can therefore trigger this error on an otherwise correct device.
- When you use the device code OAuth flow, the managed device grant control or a device state condition is not supported. The device doing the authentication cannot provide its device state to the device that provides the code, and the device state in the token is locked to the device performing authentication. Learn says to use **Require multifactor authentication** instead.

Learn also explains how grant controls combine. By default Conditional Access requires all selected controls. An admin can instead choose **Require one of the selected controls**, which can let a user satisfy a policy with multifactor authentication when the device is not hybrid joined. That choice is a policy design decision, so involve whoever owns the policy.

## Step 1: Identify the policy in the sign-in logs

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Browse to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Find the failed sign-in. Useful filters are **Correlation ID**, **Conditional Access** (limited to failures), **Username**, **Date** and **Resource**.
4. Open the event and select the **Conditional Access** tab to see the policies that interrupted the sign-in.
5. Check the **Troubleshooting and support** tab for a clear reason, and select the **Policy Name** to see the configuration.
6. The **Device Info** and other tabs show the device details that Conditional Access used in its assessment.

If the event does not explain the result, Learn names the sign-in diagnostic under **Basic info** > **Troubleshoot Event**, and the What If tool for testing policies. When you open a support incident, include the request ID, time and date from the sign-in event.

## Step 2: Decide what is wrong

| Finding in the log | Likely direction |
| --- | --- |
| The device is a corporate Windows PC but is not hybrid joined | Fix the device, or the policy's control, depending on intent |
| The user used InPrivate in Edge | Sign in with a regular window |
| The sign-in used the device code flow | The grant control is not supported for that flow, so a different control is needed |
| The device is personal or non-Windows | Learn says the hybrid control supports only Windows devices, so the policy may need a platform condition or another control |

The last row is my inference from the supported-device list, not a statement on the page. Check the policy's conditions in your tenant.

## Step 3: Check the policy scope

Learn's troubleshooting page warns about policies that select everything. For all users and all resources, do not use **Require Hybrid Microsoft Entra domain joined device**: it can block access for everyone in the organization who lacks a hybrid joined device. The same warning covers block access, requiring a compliant device and requiring an app protection policy.

If you are locked out because of a setting like this, check whether another admin who is not blocked can disable the policy. If no admin can update it, submit a support request. Learn says Microsoft support reviews the request and, after confirming, updates the policies that prevent access.

## Related codes, so you do not mix them up

- **AADSTS53000, DeviceNotCompliant:** the policy requires a compliant device. That is an Intune compliance matter, not hybrid join.
- **AADSTS53003, BlockedByConditionalAccess:** a block policy applied.
- **AADSTS50097, DeviceAuthenticationRequired:** the reference only says device authentication is required.

## A short checklist (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Check the sign-in log first and note the policy name, device info and application.
2. Ask whether the user was in a private browser window or used a device code sign-in.
3. Confirm the device type against the supported list, Windows only.
4. Only then decide whether the device or the policy needs to change.
5. Test policy changes with report-only mode or the What If tool, which Learn recommends for block-type controls.

## What the pages leave open

The error reference gives one line for this code. The pages I read do not describe how to join a device to Microsoft Entra hybrid, so this article does not either. See the Microsoft Entra hybrid join documentation for that.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)

## Sources

- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [How to Configure Grant Controls in Microsoft Entra (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-grant)
- [Troubleshooting sign-in problems with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
