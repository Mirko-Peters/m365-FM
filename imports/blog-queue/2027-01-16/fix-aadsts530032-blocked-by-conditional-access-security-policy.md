---
title: "Fix AADSTS530032: Blocked by Conditional Access on a Security Policy"
summary: "AADSTS530032 (BlockedByConditionalAccessOnSecurityPolicy) says a tenant admin configured a security policy that blocks the request. Learn lists no steps for this code, so this guide shows how to identify the policy from the sign-in log and what to check at tenant level."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [entra-id, conditional-access, microsoft-entra-id-protection, security-defaults]
keypoints:
  - "The Entra error reference lists AADSTS530032 as BlockedByConditionalAccessOnSecurityPolicy: a tenant admin configured a security policy that blocks the request."
  - "The reference tells you to check the security policies defined at tenant level against your request; it does not name a specific policy type or give steps."
  - "The sign-in log Conditional Access tab lists the policies that interrupted a sign-in, and selecting a policy name opens its configuration."
  - "Conditional Access policies are enforced after first-factor authentication, and Block access is the most restrictive decision."
  - "If no admin can change the blocking policy, Learn says to submit a support request."
faq:
  - q: "What does AADSTS530032 mean?"
    a: "The Microsoft Entra error reference lists it as BlockedByConditionalAccessOnSecurityPolicy and says the tenant admin has configured a security policy that blocks this request. It advises checking the security policies defined at the tenant level to determine whether the request meets the policy requirements."
  - q: "Which policy caused it?"
    a: "The code does not say. Open the failed event in the Entra sign-in logs, select the Conditional Access tab and read which policies resulted in the interruption. Selecting a policy name opens its configuration."
  - q: "Can a user fix this alone?"
    a: "The reference describes a tenant-level configuration, so the fix lies with an admin. A user can give the admin the time, correlation ID and the details shown by More Details on the error page."
  - q: "What if every admin is blocked?"
    a: "Learn says to check for another admin who is not blocked, who can disable the policy. If no admin can update the policy, submit a support request. Microsoft support reviews the case and, after confirming, updates the policies that prevent access."
  - q: "Does Conditional Access need a license?"
    a: "Learn says it requires Microsoft Entra ID P1 licenses, and that Microsoft 365 Business Premium customers can also use it. Risk based policies need Microsoft Entra ID Protection, which is a P2 feature. When the licenses expire, policies are not automatically disabled or deleted."
---

AADSTS530032, named BlockedByConditionalAccessOnSecurityPolicy, means the tenant admin configured a security policy that blocks the request. The Microsoft Entra error reference gives one instruction: check the security policies defined at tenant level to see whether your request meets their requirements. It does not name the policy type. To find the actual policy, read the Conditional Access tab of the failed sign-in event in the Entra sign-in logs. This guide uses the error reference, Learn's Conditional Access troubleshooting page and its Conditional Access overview.

## What the reference says, and what it leaves open

The reference row reads: BlockedByConditionalAccessOnSecurityPolicy, the tenant admin has configured a security policy that blocks this request, check the security policies that are defined on the tenant level to determine if your request meets the policy requirements.

Three things follow from that wording.

1. The decision was made by policy, not by a fault in the app.
2. The policy lives at tenant level, so a change needs an admin.
3. The row gives no list of causes, no steps and no specific policy type, so this guide does not guess one.

## Step 1: capture the failed sign-in

Ask the affected person for the time of the attempt, the user name, the application and the details behind **More Details** on the error page. Learn says that link shows troubleshooting information that helps when you search the sign-in events or open a support case. If the error came from an app you develop, keep the correlation ID from the error text.

## Step 2: open the event in the sign-in logs

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Filter by **Correlation ID**, **Username**, **Date**, **Resource** or the **Conditional Access** failure filter.
4. Open the event and select the **Conditional Access** tab. Learn says it lists the policies that resulted in the interruption.
5. Select the **Policy Name** to open the configuration.
6. Read the **Troubleshooting and support** tab, which might give a clear reason.

Learn adds that the event's other tabs hold the user, location, device and authentication details that were used in the policy assessment.

## Step 3: understand why that policy applied

Learn says Conditional Access policies apply only when all conditions are satisfied or not configured. The overview adds that they are enforced after first-factor authentication is completed.

The overview lists the signals a policy can use: user, group or agent, IP location, device, application, real-time and calculated risk from Microsoft Entra ID Protection, and Microsoft Defender for Cloud Apps. It lists Block access as the most restrictive decision. My reading: the block you see may be an explicit Block access policy, or a grant control that the sign-in could not meet. The sign-in log shows which policy and decision applied.

The **What If** tool, under **Entra ID** > **Conditional Access** > **Policies** > **What If**, simulates a sign-in and shows the policies that apply. Separately, Learn's troubleshooting page notes that users can be blocked because a cloud app depends on a resource that a policy blocks. To check this, look at the application and the resource called in the sign-in log.

## Step 4: decide what to change

The right change depends on the finding. These options are my advice, not a Microsoft statement.

| Finding in the log | Sensible action |
| --- | --- |
| A Block access policy, and the user should be allowed | Adjust the policy's conditions or exclusions, after review |
| A policy using location or device state | Check whether the sign-in came from an expected network or device, and fix the device or location |
| A risk based policy | Review the risk event with the identity protection team before changing the policy |
| A policy that is correct for this user | Explain the rule, and use the proper access route |

My advice: test any policy change in report-only mode first, then enforce it. Keep emergency access accounts excluded from policies that could lock everyone out.

## When tenant-level policy blocks everyone

Learn's troubleshooting page says to look for other admins who are not blocked yet, since one of them can disable the policy. If no admin in the organization can update the policy, submit a support request. Microsoft support reviews the request and, after confirming, updates the policies that prevent access. Include the request ID, time and date from the sign-in event.

## Licensing facts that matter here

Per the overview, Conditional Access needs Microsoft Entra ID P1 licenses, and Microsoft 365 Business Premium customers can also use it. Risk based policies, sign-in risk and user risk, need Microsoft Entra ID Protection, which is a P2 feature. When the licenses expire, policies are not disabled or deleted automatically. You can view and delete them, but you cannot update them. The overview also says security defaults are available to all customers.

Because the reference says only that a tenant admin configured a security policy, I would include these in a tenant-level check: Conditional Access policies, any risk based policies from Identity Protection, and whether security defaults are on. That list is my own, drawn from the overview, not from the error row.

## A short checklist

1. Record time, user, app and correlation ID.
2. Open the sign-in event and read the Conditional Access tab.
3. Name the policy and its decision.
4. Decide whether the user, the device, or the policy is wrong.
5. Change the policy in report-only mode first.
6. Document the exclusion or change, with a reason and a reviewer.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID Protection](https://www.m365.fm/entity/microsoft-entra-id-protection/)
- [Security defaults](https://www.m365.fm/entity/security-defaults/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Troubleshooting sign-in problems with Conditional Access - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Microsoft Entra Conditional Access: Zero Trust Policy Engine - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/overview)
