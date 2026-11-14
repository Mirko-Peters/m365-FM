---
title: "Fix AADSTS53004: Proof-Up Blocked Due to Risk, Register MFA Before Accessing the Content"
summary: "AADSTS53004 (ProofUpBlockedDueToRisk) appears when a risky sign-in meets a sign-in risk policy and the user has not registered for MFA. Learn how the policy works, what users and admins can do, and how to avoid the lockout."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [entra-id, mfa, conditional-access, microsoft-entra-id-protection]
keypoints:
  - "The error text says the user must complete multifactor authentication registration before accessing the content, and the user should register for MFA."
  - "Learn ties it to sign-in risk-based Conditional Access: users cannot register MFA during a risky session, so unregistered users with risky sign-ins are blocked."
  - "Users must register for Entra multifactor authentication before they face a situation that needs remediation; unregistered users need administrator intervention."
  - "Sign-in risk policies use ID Protection detections and need Microsoft Entra ID P2 or the Entra Suite license for full access."
  - "Legacy ID Protection risk policies had a retirement date of October 1, 2026 on Learn, so check that your policies live in Conditional Access."
faq:
  - q: "What does AADSTS53004 mean?"
    a: "The Microsoft Entra error reference lists it as ProofUpBlockedDueToRisk: the user needs to complete the multifactor authentication registration process before accessing this content, and should register for multifactor authentication."
  - q: "Why does the sign-in risk policy cause it?"
    a: "Microsoft Learn says a sign-in risk-based policy prevents users from registering MFA during risky sessions. If a user is not registered for MFA, the risky sign-in is blocked and the user receives AADSTS53004."
  - q: "Can the user fix this alone?"
    a: "Usually not during the blocked sign-in. Learn says users must register for Microsoft Entra multifactor authentication before they face a situation requiring remediation, and that unregistered users are blocked and require administrator intervention."
  - q: "How is sign-in risk normally remediated?"
    a: "Learn says a successful strong authentication, usually multifactor authentication or passwordless authentication, is the only way to self-remediate sign-in risk. That works only for users who already have a registered method."
  - q: "Which license is needed for the policy?"
    a: "Learn says organizations with Microsoft Entra ID P2 licenses can create Conditional Access policies that use ID Protection sign-in risk detections. The risk policies page says P2 or the Microsoft Entra Suite license is required for full access to ID Protection features."
---

AADSTS53004 means a sign-in was judged risky, and the user has no multifactor authentication method registered to resolve that risk. The Microsoft Entra error reference calls it ProofUpBlockedDueToRisk and says the user must register for multifactor authentication before accessing the content. Microsoft Learn explains the mechanism on its page about sign-in risk-based multifactor authentication: the policy prevents MFA registration during risky sessions, so unregistered users with risky sign-ins are blocked. This guide separates what a user can do from what an admin must do.

## What triggers the error

Learn describes sign-in risk as the likelihood that an authentication request is not from the identity owner. Organizations with Microsoft Entra ID P2 licenses can create Conditional Access policies that use Microsoft Entra ID Protection sign-in risk detections. In Learn's walkthrough, the policy applies to sign-ins with medium and high risk and requires the built-in Multifactor authentication strength, with the sign-in frequency session control set to every time.

Put the pieces together and the error follows:

1. A sign-in is flagged with a risk level that the policy covers.
2. The policy asks for MFA.
3. The user has not registered an MFA method.
4. The policy does not let the user register during a risky session.
5. The sign-in is blocked, and the user gets AADSTS53004.

## If you are the user

The Learn pages cited here give no user-side workaround for the blocked session itself. What they state is that users must register for MFA before a situation arises that needs remediation, and that unregistered users are blocked and require administrator intervention. So the practical steps are these (my advice, derived from that):

1. Do not retry in a loop. Each risky attempt can give the same result.
2. Contact your administrator and give the time of the sign-in, the error code AADSTS53004 and the app you tried to open.
3. After access is restored, register your MFA methods right away, so the next risk event can be solved by you.

## If you are the administrator

### Find out why the user is unregistered

A likely situation is a new or never-registered user (my reading). Learn's page on controlling security information registration with Conditional Access describes a related setup: a policy that targets the **Register security information** user action, and Temporary Access Pass credentials issued by administrators so that new users can satisfy the MFA requirement and register. It says Temporary Access Pass credentials satisfy Conditional Access requirements for multifactor authentication, and let users register from any device or location. It also says Temporary Access Pass does not work for guest users.

None of the cited pages says whether a Temporary Access Pass clears an active risky sign-in. My advice: treat that as untested in your tenant and check it with one test user.

### Review the risk and the policy

- **Investigate and remediate active risks first.** Learn says to investigate and remediate any active risks before enabling risk policies.
- **Check the risk levels.** Choosing High reduces how often a policy triggers and reduces friction, but leaves Low and Medium risks outside the policy. Medium and Low usually cause more interruptions. This is a trade-off for your organization to choose.
- **Prefer self-remediation over blocking.** Learn says blocking can stop legitimate users and that user and sign-in risk policies that let users self-remediate are a better solution. Self-remediation needs a registered method, and for hybrid users synced from on-premises, password writeback must be enabled.
- **Do not combine conditions.** Learn warns against putting sign-in risk and user risk in the same Conditional Access policy. Create separate policies.
- **Exclude emergency access accounts** from the policies, as Learn recommends, so a misconfiguration cannot lock out all administrators.
- **Test in report-only mode** and then switch the policy to On.

The least privileged role Learn names to create or edit Conditional Access policies is Conditional Access Administrator.

### Check where your risk policies live

Learn's risk policies page says legacy risk policies configured in Microsoft Entra ID Protection were to be retired on October 1, 2026. That date has passed. If you still rely on policies from the old ID Protection interface, check that equivalent policies exist in Conditional Access. Learn's migration steps are to create equivalent user risk and sign-in risk policies in Conditional Access in report-only mode, move them to On, then set **Enforce policy** to **Disabled** on the old policies under **ID Protection** > **Dashboard**.

## Prevent it

This section is my advice, not a Microsoft statement.

1. Make MFA registration part of onboarding, with a Temporary Access Pass handed over by a person you trust, before the first day the user signs in from an unusual place.
2. Run a sign-in log query for users with no registered method who are targeted by the risk policy. Fix those accounts first.
3. Add a short instruction to your help desk page: AADSTS53004 means register MFA first, and the help desk needs the sign-in time.
4. Review blocked sign-ins in the sign-in logs after each policy change, so that you notice a rise in this error early.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multi-factor authentication](https://www.m365.fm/entity/mfa/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID Protection](https://www.m365.fm/entity/microsoft-entra-id-protection/)

## Sources

- [Sign-in risk-based multifactor authentication - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/policy-risk-based-sign-in)
- [Risk policies - Microsoft Entra ID Protection (Microsoft Learn)](https://learn.microsoft.com/entra/id-protection/howto-identity-protection-configure-risk-policies)
- [Control security information registration with Conditional Access - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-security-info-registration)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
