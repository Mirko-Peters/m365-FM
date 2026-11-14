---
title: "AADSTS50142 Password Change Is Required Due to a Conditional Access Policy: Causes and Admin Checks"
summary: "AADSTS50142 appears when a Conditional Access policy requires a password change. How the Require password change grant control works with user risk, why it is not SSPR, which restrictions apply to the policy, and what to check when users get stuck."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [entra-id, conditional-access, mfa, self-service-password-reset]
keypoints:
  - "The error reference lists AADSTS50142 as: Password change is required due to a Conditional Access policy."
  - "The Require password change grant control works with user risk conditions: after sign-in, the user completes MFA and then changes the password."
  - "Learn says this process does not use the self-service password reset flow, and users must have registered for MFA before the user risk policy triggers."
  - "The policy must target All resources, cannot be combined with other grant controls, and can only use user, group, cloud app and user risk conditions."
  - "Troubleshoot in Entra ID, Monitoring and health, Sign-in logs, on the Conditional Access tab, and test changes with report-only mode and What If."
faq:
  - q: "What does AADSTS50142 mean?"
    a: "The Microsoft Entra error code reference lists it as: Password change is required due to a Conditional Access policy. It points to the Require password change grant control of a Conditional Access policy, where the user must change the password to continue."
  - q: "Is this the same as self-service password reset?"
    a: "No. The grant controls page says that when user risk is detected, the Require password change control has the user perform a secure password change after successful authentication, and that this process does not use the self-service password reset flow. The user must complete multifactor authentication and then change the password to remediate the risk."
  - q: "Why can users get stuck at this step?"
    a: "Learn warns that users must have previously registered for multifactor authentication before triggering the user risk policy. It also says to make sure all users register for MFA so they are prepared if risk is detected for their account. A user without a registered method cannot complete the MFA part of the remediation."
  - q: "Which settings does a password change policy allow?"
    a: "Per Learn, the policy must be assigned to All resources, which stops an attacker from using a different app to change the password and reset the account risk. Require password change cannot be used with other controls such as a compliant device. It only works with user and group assignments, the cloud app condition set to all, and user risk conditions."
  - q: "Is there a newer way to remediate user risk?"
    a: "The grant controls page also describes Require risk remediation. With it, users self-remediate by completing the appropriate flow regardless of authentication method, and the Microsoft-managed remediation policy covers password-based and passwordless methods. Selecting it applies authentication strength and a sign-in frequency of every time automatically."
---

AADSTS50142 is documented in the Microsoft Entra error code reference as: password change is required due to a Conditional Access policy. The one-line row tells you which feature is involved, and the Conditional Access grant controls page explains how it works. This article puts the two together and adds a check list for admins.

## What the policy does

The grant controls page describes **Require password change** like this. When user risk is detected, you can use the user risk policy conditions to have the user perform a secure password change after successful authentication. Key points from the page:

- The process does not use the self-service password reset (SSPR) flow.
- The user must complete multifactor authentication and then change the password to remediate the risk.
- Completing it closes the user risk event, which prevents unnecessary alerts for admins.
- For this to work, all users should register for multifactor authentication, so they are ready if risk is detected for their account.

Learn adds a warning: users must have previously registered for multifactor authentication before they trigger the user risk policy.

## Restrictions on the policy

When you configure a policy with this control, Learn lists these restrictions:

| Restriction | Reason or detail |
| --- | --- |
| Assigned to **All resources** | Prevents an attacker from changing the password through another app and resetting the account risk by signing in elsewhere |
| Cannot be combined with other controls | For example, it cannot be used together with requiring a compliant device |
| Limited conditions | Only the user and group assignment, the cloud app assignment (which must be set to all) and user risk conditions |

If your policy contains more than that, such as a device condition or a second grant control, the page says the control cannot be used that way. Treat that as a configuration problem to fix, not as a user problem.

## A newer option: Require risk remediation

The same page describes **Require risk remediation**. When user risk is detected, users can self-remediate by completing the appropriate remediation flow regardless of their authentication method. The Microsoft-managed remediation policy accommodates all methods, including password-based and passwordless. Selecting it automatically applies:

- **Require authentication strength**
- **Sign-in frequency - Every time**

With this control, users are prompted to sign in again right after their sessions are revoked. If the user just signed in but is at risk, they are asked to sign in a second time, and the risk is remediated after the second successful sign-in. The Learn page for it is the Identity Protection policies article, which I did not read for this post, so I do not describe how to migrate to it.

## Checks for the admin

Use the Conditional Access troubleshooting article for the log work:

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Find the event, for example by correlation ID, username, date, resource, or the **Conditional Access** filter.
4. Select the **Conditional Access** tab to see the policies that applied, then the policy name to open its configuration.
5. For more detail, use the ellipsis next to a policy for the policy details, the sign-in diagnostic under **Basic info** > **Troubleshoot Event**, or the What If tool.

For the support path, Learn says to include the request ID, time and date from the sign-in event in the incident.

## Common reasons for trouble

These are the situations the Learn pages point to:

1. **No MFA registration.** The user cannot finish the MFA step of the remediation. Check the user's registered methods.
2. **Policy scope.** The policy must cover all resources, so it applies to the user in every app, not only the one they tried first.
3. **Unexpected combination.** A password change control mixed with another control or condition is not a supported setup.
4. **Several policies at once.** The grant controls page explains that Conditional Access validates controls in a fixed order, MFA first, then device state, then terms of use. When more than one policy applies, the log can show an interrupt for one control and success for another in the same sign-in, so read all entries of a sign-in before concluding.

## How I would roll it out (my advice)

This section is my experience, not a Microsoft procedure:

1. Check MFA registration coverage before you turn on a user-risk-based policy, and give users a clear registration path.
2. Start in report-only mode. The grant controls page recommends report-only mode and the What If tool when you change policies that can block users.
3. Keep break-glass accounts out of risk-based policies according to your own emergency access design.
4. Tell the help desk what users will see, so a password prompt after sign-in is not mistaken for an attack or for SSPR.
5. Review whether Require risk remediation fits your sign-in methods better than a password-only remediation.

## What the sources leave open

The one-line error code row does not say whether the code shows in the browser, in the log or both, so I do not claim either. The exact user prompt is not described in the pages I used, beyond the MFA and password change steps above.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)
- [Self-service password reset](https://www.m365.fm/entity/self-service-password-reset/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [How to Configure Grant Controls in Microsoft Entra (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-grant)
- [Troubleshooting sign-in problems with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
