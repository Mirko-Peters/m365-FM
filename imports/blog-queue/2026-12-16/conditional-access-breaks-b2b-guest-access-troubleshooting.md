---
title: "Conditional Access Breaking B2B Guest Access: How to Find and Fix the Policy"
summary: "Guests are blocked or looping on MFA after a Conditional Access change? Read the sign-in log, check guest targeting, cross-tenant trust settings and unsupported controls, in the order Microsoft's pages support."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [conditional-access, guest-access, cross-tenant-access-settings]
keypoints:
  - "Start in Entra ID > Monitoring & health > Sign-in logs, filter on Conditional Access failures and open the Conditional Access tab of the event."
  - "Without trust settings, B2B collaboration guests are prompted for MFA in your tenant. B2B direct connect users are blocked."
  - "Device-based controls need cross-tenant trust for compliant or hybrid joined claims, because only the home tenant can manage the device."
  - "Require approved client app, app protection policy and password change are not supported for guests."
  - "User risk policies that require a password change block guests. Microsoft suggests excluding a group of external users from risk policies."
faq:
  - q: "Why are my B2B guests suddenly blocked after a new policy?"
    a: "Microsoft Learn lists causes: a device grant control that guests cannot satisfy, a grant or session control that is not supported for the guest type, MFA required for direct connect users without inbound trust, or a risk policy that requires a password change. Open the sign-in event and read the Conditional Access tab to see which policy applied."
  - q: "Do guests have to do MFA in my tenant?"
    a: "It depends on trust settings. Learn says that when MFA trust is enabled and the session carries an MFA claim from the home tenant, the user signs in seamlessly. Without trust, B2B collaboration users are challenged by the resource tenant. Non-Microsoft Entra users always do MFA in the resource tenant."
  - q: "Can I require a compliant device for guests?"
    a: "Only with trust. Learn says devices can be managed only by the home tenant, so you must trust compliant device or hybrid joined claims in cross-tenant access settings. Unless you trust them, Microsoft does not recommend policies that require managed devices for external users."
  - q: "Which error codes does Microsoft list for Conditional Access?"
    a: "The troubleshooting page lists 53000 DeviceNotCompliant, 53001 DeviceNotDomainJoined, 53002 ApplicationUsedIsNotAnApprovedApp, 53003 BlockedByConditionalAccess, 53004 ProofUpBlockedDueToRisk and 53009. They appear with the AADSTS prefix."
  - q: "What if an admin policy locks everyone out?"
    a: "Learn says to check whether another admin who is not blocked can disable the policy. If none can, submit a support request. Microsoft support reviews it and updates the blocking policies after confirmation."
---

When Conditional Access breaks guest sign-in, find the exact policy in the Microsoft Entra sign-in log first, then compare it with how Microsoft says policies treat guests. Most cases come down to four things: the guest type is in scope, a control is unsupported for guests, device claims are not trusted, or MFA trust is missing.

## Step 1: Read the sign-in event

1. Sign in to the Microsoft Entra admin center as at least Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Filter by user name, correlation ID, date, resource, or **Conditional Access** failures.
4. Open the event and select the **Conditional Access** tab. It lists the policies involved. The **Troubleshooting and support** tab may state the reason, for example a device that does not meet compliance requirements.
5. Select the policy name to open its configuration.

Learn notes that policies apply only when all conditions are satisfied or not configured. If the event does not explain the result, use **Basic info** > **Troubleshoot Event**, or the What If tool. When you open a support case, include request ID, time and date.

The troubleshooting page lists these codes, shown with the `AADSTS` prefix:

| Code | Meaning |
|---|---|
| 53000 | DeviceNotCompliant |
| 53001 | DeviceNotDomainJoined |
| 53002 | ApplicationUsedIsNotAnApprovedApp |
| 53003 | BlockedByConditionalAccess |
| 53004 | ProofUpBlockedDueToRisk |
| 53009 | Application needs to enforce Intune protection policies |

Also check dependencies. A sign-in to one app can request several resources, and a policy can block a resource that the app calls. Look at both the application and the resource in the log.

## Step 2: Check which guest type the policy targets

In a Conditional Access policy, **Guest and external users** has sub-types: B2B collaboration guest users, B2B collaboration member users, B2B direct connect users, local guest users, service provider users and other external users. A policy aimed at one sub-type does not touch the others. Check that your failing user is of the type you think. A B2B direct connect user, for example, has no presence in your directory.

## Step 3: Check whether the control is supported

Learn's table shows what works for guests.

- **Not supported for either type:** Require approved client app, Require app protection policy, Require password change. Custom controls are not supported for cross-tenant trusts.
- **Not supported for B2B direct connect:** Terms of Use, app enforced restrictions, Conditional Access App control, sign-in frequency and persistent browser session.
- **Supported for guests:** Block, Require MFA, Require compliant device and Require hybrid joined device (the last two with trust), plus Terms of Use for B2B collaboration.

Microsoft does not recommend requiring an app protection policy for external users, because that needs a device registered in the resource tenant, which guests cannot do.

## Step 4: Check MFA and trust settings

The flow, according to Learn: Entra ID evaluates your policies and the cross-tenant access settings, checks whether you trust MFA and device claims from the partner, and looks for those claims in the session. If a claim is missing, it challenges the user in the home tenant. With no trust settings and MFA required:

- B2B collaboration users are prompted for MFA in your tenant.
- B2B direct connect users are blocked.

To change this, open **Entra ID** > **External Identities** > **Cross-tenant access settings**. Use **Default settings** or an entry under **Organizational settings**, then adjust the inbound trust settings: trust MFA, trust compliant devices, trust Microsoft Entra hybrid joined devices. Targeting specific users, groups or applications there needs a Microsoft Entra ID P1 or P2 subscription. Note that setting default inbound or outbound access to Block can interrupt business-critical access.

For users who do not sign in with Microsoft Entra ID, such as Google, SAML or email one-time passcode users, your tenant is always responsible for MFA. It needs licenses that support MFA, and the guest uses one from the resource tenant.

If you use authentication strengths, remember they apply only to Microsoft Entra ID users. For other identity types use the MFA grant control. If trust is off, the user must meet MFA in your tenant using the methods allowed there, which are fewer than the home-tenant methods.

## Step 5: Check device requirements

Intune-based requirements can block external users, because their devices are managed only by the home tenant. Choose between two paths. Trust the partner's compliant or hybrid joined claims, or stop requiring managed devices for guests. A device filter in the policy can target devices from other organizations, once you trust their device claims and assign a supported extension attribute.

## Step 6: Check risk policies

Sign-in risk policies are enforced when a guest satisfies the grant control. If the guest has not registered MFA in your tenant, they are blocked. This is intended, to stop attackers registering their own MFA. User risk cannot be resolved in the resource tenant, so a policy that needs a password change blocks high-risk guests. Admins in your organization cannot dismiss or remediate a risky external user. Microsoft's workaround: create a group of all external users and exclude it from user risk and sign-in risk policies.

## Step 7: Avoid lockouts when you fix it

Learn warns against broad settings for all users and all resources: Block access, Require compliant device, Require hybrid joined device and Require app protection policy can lock out an organization, including admins. Use report-only mode for testing. If a policy locks out all admins, another admin who is not blocked can disable it, or you open a support request.

## Checklist

1. Which policy does the Conditional Access tab show?
2. Is the guest type in scope?
3. Is the control supported for this type?
4. Are MFA and device claims trusted for the partner tenant?
5. Can the guest register and satisfy MFA in your tenant?
6. Does a risk policy need a password change?

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Guest access](https://www.m365.fm/entity/guest-access/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Authentication and Conditional Access for External ID (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/external-id/authentication-conditional-access)
- [Troubleshoot Conditional Access (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Cross-tenant access settings for B2B collaboration (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-settings-b2b-collaboration)
