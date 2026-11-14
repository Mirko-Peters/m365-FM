---
title: "AADSTS53000 DeviceNotCompliant: Why Conditional Access Blocks a Device and How to Check Compliance"
summary: "AADSTS53000 means a Conditional Access policy requires a compliant device and the device is not compliant. Check the sign-in log, then the Intune side: policy assignment, the setting for devices with no policy, the validity period and check-in, and the policy exclusions."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [entra-id, conditional-access, intune]
keypoints:
  - "Learn lists AADSTS53000 as DeviceNotCompliant: a Conditional Access policy requires a compliant device, but the device is not. The user must enroll with an approved MDM provider such as Intune."
  - "Find the policy in Entra ID, Monitoring and health, Sign-in logs, on the Conditional Access tab of the failed event. The Troubleshooting and support tab may name the reason."
  - "In Intune, devices without an assigned compliance policy count as compliant by default. Learn says to switch the setting to Not compliant when you use Conditional Access."
  - "Devices that fail to report compliance within the validity period are noncompliant. The default is 30 days, configurable from 1 to 120 days."
  - "Without an Intune compliance policy the Conditional Access policy will not work as intended. Start in report-only mode and exclude break-glass accounts."
faq:
  - q: "What does AADSTS53000 mean?"
    a: "The Microsoft Entra error code reference lists it as DeviceNotCompliant: a Conditional Access policy requires a compliant device, and the device is not compliant. The user must enroll the device with an approved MDM provider like Intune. The Conditional Access troubleshooting page lists 53000 among its common error codes."
  - q: "Where do I see which policy blocked the sign-in?"
    a: "Sign in to the Microsoft Entra admin center as at least a Reports Reader, go to Entra ID, Monitoring and health, Sign-in logs, find the event and open the Conditional Access tab. The Troubleshooting and support tab might give a clear reason such as a device that did not meet compliance requirements, and device details appear in the Device Info tab of the event."
  - q: "Why would a device without any policy be treated as compliant?"
    a: "Learn says the Intune setting Mark devices with no compliance policy assigned as defaults to Compliant, so devices that are not sent a policy are considered compliant. If you use Conditional Access with compliance policies, Learn says to change it to Not compliant so only devices confirmed as compliant reach your resources. The setting is under Endpoint security, Device compliance, Compliance policy settings."
  - q: "Can a device become noncompliant just by not checking in?"
    a: "Yes. The compliance status validity period requires devices to report on all their received compliance policies. If a device does not report before the period expires, it is treated as noncompliant. The default is 30 days and you can set 1 to 120 days. Learn also says evaluations depend on when the device checks in with Intune and on the policy refresh cycles."
  - q: "Does requiring a compliant device block Intune enrollment?"
    a: "No. The Conditional Access page says you can enroll new devices in Intune even when Require device to be marked as compliant is applied to all users and all resources. The control also does not block the Microsoft Authenticator app from the scope it needs during Authenticator registration."
---

AADSTS53000, DeviceNotCompliant, means a Conditional Access policy requires a compliant device and the device the user signed in from is not compliant. The error reference says the user must enroll the device with an approved MDM provider such as Intune. This article follows the Conditional Access troubleshooting page, the page on requiring device compliance, and the Intune compliance overview, in the order I would check them.

## Step 1: Confirm the code and the policy

The Conditional Access troubleshooting page lists 53000 as DeviceNotCompliant, next to 53001 DeviceNotDomainJoined and 53003 BlockedByConditionalAccess. The error appears in the browser with the prefix AADSTS. If the user sees a message that the app can only be used from devices or client apps that meet the company's mobile device management policy, that is the same family.

To see which policy applied:

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Find the event, filtering by correlation ID, username, date, resource or the **Conditional Access** filter.
4. Open the **Conditional Access** tab to see the policies that interrupted the sign-in. The **Troubleshooting and support** tab might name the reason, such as a device that did not meet compliance requirements.
5. Check the **Device Info** tab for the device details used in the evaluation. Select the policy name to open its configuration.

If the event does not explain it, the page points to the sign-in diagnostic under **Basic info** > **Troubleshoot Event** and to the What If tool.

## Step 2: Check the device in Intune

The Intune overview says that when a device enrolls, it registers in Microsoft Entra ID and its compliance status is reported to Entra ID. With *Require device to be marked as compliant*, Conditional Access uses that status to grant or block access. Check these points:

### Is a compliance policy assigned?

The tenant-wide setting **Mark devices with no compliance policy assigned as** has two values:

| Value | Effect |
| --- | --- |
| Compliant (default) | Devices without an assigned policy count as compliant |
| Not compliant | Devices without a policy count as noncompliant |

Learn says that if you use Conditional Access with device compliance policies, you should change it to **Not compliant**, so only devices confirmed as compliant reach your resources. The setting sits under **Endpoint security** > **Device compliance** > **Compliance policy settings**. A user who is not compliant because no policy is assigned sees "No compliance policies have been assigned" in the Company Portal app.

### Did the device report in time?

The **Compliance status validity period (days)** setting requires devices to report on all their received compliance policies. A device that does not report before the period ends is treated as noncompliant. The default is 30 days, configurable from 1 to 120. The setting named **Is active** under **Devices** > **Monitor** > **Setting compliance** shows details.

The overview also says evaluations depend on device check-in and the policy refresh cycles, and for Windows it mentions client-driven compliance evaluation, which is described as a preview capability.

### Which rule fails?

Compliance policies hold platform-specific rules, such as a minimum OS version, jailbreak or root state, or a threat level. For many settings, the overview's table says the OS either enforces the rule (remediated, for example forcing a PIN) or leaves the device quarantined, which means a Conditional Access policy blocks it and the Company Portal tells the user about the problem. Check the failing setting in the Intune device compliance views.

The Company Portal enters an enrollment remediation flow when the device has not checked in with Intune for 30 days or more, or is noncompliant due to a *Lost contact* reason. Intune tries one more check-in, and if that fails it issues a retire command so the user can re-enroll manually.

## Step 3: Review the Conditional Access policy

The page on requiring device compliance gives these points:

- Without a compliance policy created in Intune, the Conditional Access policy will not work as intended. Create a compliance policy first and have at least one compliant device before you proceed.
- Exclude emergency access accounts, and service accounts and service principals such as the Entra Connect Sync account. For hybrid setups, exclude the Directory Synchronization Accounts role.
- Set the policy to **Report-only** first, then move it to **On** after reviewing the results.
- Requiring a compliant device does not block Intune enrollment.
- On iOS, Android, macOS and some non-Microsoft browsers, Entra identifies the device by a client certificate provisioned at registration. The user is prompted to select it at first browser sign-in and must select it to continue.
- For B2B guests, you can trust the device compliance claims of organizations you trust, through cross-tenant access settings.

Also from the grant controls page: the control supports Windows 10 and later, iOS, Android, macOS and Linux Ubuntu devices registered with Entra ID and enrolled with Intune, and treats Microsoft Edge in InPrivate mode on Windows as a noncompliant device.

## Locked out admins

The troubleshooting page warns that requiring a compliant device for all users and all resources blocks users who have not enrolled yet, including access to the Intune portal. An admin without an enrolled device can be blocked from changing the policy. Learn's advice: ask another admin who is not blocked to disable the policy. If no admin can, open a support request.

## A short checklist (my advice)

This is my experience, not a Microsoft procedure:

1. Read the log first to see whether the device is unknown, noncompliant, or compliant but not evaluated in time.
2. Check the device in Intune: last check-in, assigned policies and failing rules.
3. Ask whether the user is on a managed device at all. A personal browser profile is a common reason in my experience.
4. Roll compliance requirements out in report-only mode and exclude break-glass accounts before you enable them.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Troubleshooting sign-in problems with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
- [How to Require Device Compliance with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-device-compliance)
- [Device compliance policies in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-security/compliance/overview)
