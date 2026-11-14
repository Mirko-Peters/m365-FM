---
title: "Intune Compliance Policies: Common Mistakes and How to Fix Them"
summary: "Intune compliance policy mistakes that Microsoft documents: the default for devices without a policy, no grace period, missing notifications, user versus device assignment, validity period and conflicting results."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [intune, device-compliance, conditional-access]
keypoints:
  - "Devices with no compliance policy are treated as compliant by default. With Conditional Access, Microsoft recommends switching this to Not compliant."
  - "Mark device noncompliant runs at 0 days by default. Raise the schedule to create a grace period before access is blocked."
  - "Compliance actions do not block anything. Microsoft Entra Conditional Access does the blocking."
  - "A device that does not report within the validity period (default 30 days, range 1 to 120) is treated as noncompliant."
  - "When several policies disagree, Intune uses the status with the highest severity, so one Error or NonCompliant result wins."
faq:
  - q: "Why does a device show as compliant when no policy applies to it?"
    a: "Microsoft Learn explains that the tenant-wide setting Mark devices with no compliance policy assigned as is set to Compliant by default. Devices without any assigned policy are therefore compliant. If you use Conditional Access, Microsoft recommends changing the setting to Not compliant."
  - q: "How do I give users time to fix a compliance problem?"
    a: "Change the schedule of the built-in action Mark device noncompliant. Microsoft Learn says the default is 0 days and that a value above 0 creates a grace period. You can add actions such as an email to the user on later days."
  - q: "Does a compliance policy block access to email or SharePoint?"
    a: "No. Microsoft Learn states that the actions for noncompliance do not block access by themselves. Blocking comes from a Microsoft Entra Conditional Access policy that uses the control Require device to be marked as compliant."
  - q: "What happens when two compliance policies give different results?"
    a: "According to Microsoft Learn, Intune assigns the status with the highest severity. The documented order from lowest to highest is Unknown, NotApplicable, Compliant, InGracePeriod, NonCompliant and Error."
  - q: "Can I send a push notification or email to users when they are noncompliant?"
    a: "Microsoft Learn lists email for all platforms and push notifications for some Android and iOS or iPadOS management types, not for macOS or Windows. Email needs a notification template and uses the address from the user profile, not the UPN."
---
The most common Intune compliance policy mistakes are settings that look harmless but change what happens at enforcement time. Examples are leaving the default for devices without a policy untouched, using no grace period, assuming a policy blocks access on its own, and mixing up user and device assignments. This article walks through each one in the order of the Microsoft documentation, with the menu paths to check it.

## What a compliance policy does and does not do

A compliance policy is a set of rules a managed device must meet, such as a minimum OS version or a threat level from integrated threat management software. Each platform needs its own policy, because platforms support different settings.

Microsoft Learn is clear about one point that causes many wrong assumptions: compliance actions do not block access. They mark the device and can send messages. Microsoft Entra Conditional Access is what blocks access, through the control **Require device to be marked as compliant**. Conditional Access with compliance needs Microsoft Entra ID P1 or P2, while Intune compliance alone does not.

## Mistake 1: Keeping the default for devices without a policy

In the Intune admin center, go to **Endpoint security** > **Device compliance** > **Compliance policy settings**. The setting **Mark devices with no compliance policy assigned as** is **Compliant** by default. A device that no policy reaches counts as compliant.

If you use Conditional Access with compliance, Microsoft recommends changing the setting to **Not compliant**. Then a device that slipped through your assignments is not trusted by default. If a user is noncompliant for this reason, Company Portal shows the message *No compliance policies have been assigned.*

## Mistake 2: No grace period

Every compliance policy includes the action **Mark device noncompliant**. It runs after **0 days**, so a device is noncompliant immediately. You can't remove this action, but you can change its schedule.

To give users time to fix a problem:

1. Go to **Devices** > **Compliance** and select the policy.
2. Open **Properties** and edit **Actions for noncompliance**.
3. Set the schedule of **Mark device noncompliant** to one or more days.

A value above 0 creates a grace period. During it, Intune reports the effective status **InGracePeriod**. Schedules accept whole numbers and 0.25 steps (0.25 is 6 hours), from 0 to 365 days. Other values need Microsoft Graph.

## Mistake 3: Marking noncompliant but telling nobody

Without a notification, users only notice the problem when access stops. Add the action **Send email to end user** and create a notification template first under **Endpoint security** > **Device compliance** > **Notifications** > **Create notification**.

Facts from Microsoft Learn that avoid surprises:

- Mail is sent from `microsoft-noreply@microsoft.com`, so check mail filtering rules.
- The address comes from the user profile, not the UPN.
- The subject can be up to 78 characters and the message up to 2,000 characters.
- Emails are expected within 6 hours after the device is marked noncompliant.
- Push notifications are not guaranteed and the text can't be customized. Don't use them for urgent messages.

You can add the same action more than once, for example an email on day 2 and another on day 5.

## Mistake 4: Assigning to users when devices would be clearer

You can assign a policy to user groups or device groups. A policy assigned to a user checks all of that user's devices. Microsoft Learn notes that device groups help with compliance reporting. Linux policies support device groups only.

Whichever you choose, keep the assignment pattern the same across policies, or reports become hard to read.

## Mistake 5: Ignoring check-in timing and the validity period

Intune evaluates devices when they check in. Users can open Company Portal and sync the device to pick up changes sooner. Supported Windows devices can use client-driven compliance evaluation, which Microsoft Learn describes as a preview on the overview page.

The tenant setting **Compliance status validity period (days)** defaults to 30 and accepts 1 to 120. A device that does not report compliance for all received policies in that period is treated as noncompliant. You can see the result under **Devices** > **Monitor** > **Setting compliance**, where it appears as **Is active**.

Learn also describes a related case: if a device has not checked in for 30 days or more, Intune tries one more check-in when the user signs in to Company Portal. If that fails, Intune issues a retire command so the user can re-enroll.

## Mistake 6: Misreading conflicting results

When a device has several policies with different results, Intune takes the status with the highest severity:

| Status | Severity |
|---|---|
| Unknown | 1 |
| NotApplicable | 2 |
| Compliant | 3 |
| InGracePeriod | 4 |
| NonCompliant | 5 |
| Error | 6 |

A device with Unknown, Compliant and InGracePeriod results is shown as InGracePeriod. One failing policy is enough to make the device noncompliant.

## Mistake 7: Over-long custom compliance scripts

For custom compliance settings on Windows, macOS and Linux, the discovery script output is limited to 2,048 characters. Longer output can be truncated, which produces invalid JSON and error 65009 during evaluation. Keep the output short or split rules across several policies.

## What the pages do not say

The pages I read do not describe a "Not evaluated" state, and they do not give a duration for the remote lock or retire actions beyond "for some time". Treat advice that gives exact numbers for these as unverified. For troubleshooting a specific noncompliant device, see the separate article on Intune non-compliant devices.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Intune device compliance policies](https://learn.microsoft.com/en-us/intune/intune-service/protect/device-compliance-get-started)
- [Actions for noncompliance in Intune](https://learn.microsoft.com/en-us/intune/intune-service/protect/actions-for-noncompliance)
- [Create a compliance policy in Microsoft Intune](https://learn.microsoft.com/en-us/intune/intune-service/protect/create-compliance-policy)
