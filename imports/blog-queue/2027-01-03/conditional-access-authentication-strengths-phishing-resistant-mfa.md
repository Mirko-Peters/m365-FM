---
title: "Conditional Access Authentication Strengths: Require Phishing-Resistant MFA"
summary: "Use authentication strengths in Entra Conditional Access to require phishing-resistant MFA: which methods each built-in strength allows, how to select it in a policy, and the documented limitations."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [conditional-access, mfa]
keypoints:
  - "An authentication strength is a Conditional Access control that specifies which authentication method combinations can satisfy a policy."
  - "Built-in strengths are Multifactor authentication, Passwordless MFA and Phishing-resistant MFA. They cannot be modified."
  - "Phishing-resistant MFA allows FIDO2 security keys, Windows Hello for Business or platform credential, and certificate-based authentication (multifactor)."
  - "In a policy, select Require authentication strength under Grant controls. It cannot be combined with Require multifactor authentication."
  - "Learn lists Microsoft Entra ID P1 as the license prerequisite."
faq:
  - q: "Which methods does the phishing-resistant MFA strength allow?"
    a: "According to Microsoft Learn, the Phishing-resistant MFA built-in strength includes FIDO2 security key, Windows Hello for Business or platform credential, and certificate-based authentication (multifactor). Microsoft Authenticator phone sign-in is in the Passwordless MFA strength but not in the phishing-resistant one."
  - q: "How do I require it in Conditional Access?"
    a: "Learn says to create a Conditional Access policy, then under Grant controls select Require authentication strength and choose a built-in or custom strength."
  - q: "Can I use it together with Require multifactor authentication?"
    a: "No. Microsoft Learn says Require multifactor authentication and Require authentication strength cannot be used together in the same policy, because the built-in multifactor authentication strength equals the MFA grant control."
  - q: "What license do I need?"
    a: "The Learn page lists Microsoft Entra ID P1 as the prerequisite and mentions a free trial."
  - q: "Does the strength stop users from entering a password first?"
    a: "No. Learn says initial authentication is not restricted. Conditional Access evaluates after it, so a user can enter a password but must then complete a method the strength allows, for example FIDO2."
---

To require phishing-resistant MFA, create a Conditional Access policy for the users and apps you want to protect, open the **Grant** controls, select **Require authentication strength** and choose the built-in **Phishing-resistant MFA** strength. The strength decides which method combinations are accepted. This guide follows the Microsoft Learn concept page on authentication strengths.

## What an authentication strength is

Learn describes it as a Conditional Access control that specifies which combinations of authentication methods users can use to access a resource. A user satisfies it with any allowed combination. It builds on the authentication methods policy and adds control by scenario, such as sensitive resource access, user risk and location.

## Built-in strengths

Built-in strengths are predefined by Microsoft, always available and cannot be modified. Microsoft updates them when new methods become available.

| Method combination | MFA | Passwordless MFA | Phishing-resistant MFA |
| --- | --- | --- | --- |
| FIDO2 security key | Yes | Yes | Yes |
| Windows Hello for Business or platform credential | Yes | Yes | Yes |
| Certificate-based authentication (multifactor) | Yes | Yes | Yes |
| Microsoft Authenticator (phone sign-in) | Yes | Yes | No |
| Temporary Access Pass (one-time and multiple use) | Yes | No | No |
| Password plus something the user has | Yes | No | No |
| Federated single-factor plus something the user has | Yes | No | No |
| Federated multifactor | Yes | No | No |

Learn defines something the user has as one of: text message, voice, push notification, software OATH token or hardware OATH token. Not included in any built-in strength: certificate-based authentication (single-factor), SMS sign-in, password, federated single-factor and QR code.

How Learn describes the three:

- **Multifactor authentication strength:** the same combinations that satisfy the Require multifactor authentication setting.
- **Passwordless MFA strength:** MFA methods that do not require a password.
- **Phishing-resistant MFA strength:** methods that require interaction between the authentication method and the sign-in surface.

## Use a strength in a policy

1. Create a Conditional Access policy.
2. Under **Grant** controls, select **Require authentication strength**.
3. Choose a built-in or custom strength.

Learn lists these scenarios: sensitive resources, a specific method for sensitive actions within an app (with Conditional Access authentication context), sensitive apps accessed outside the corporate network, high-risk users, and guest users (with cross-tenant settings).

## Custom strengths

You can create custom strengths that allow only the method combinations you choose. The concept page does not describe the steps or settings and links to a separate article on custom authentication strengths. This guide therefore covers the built-in strengths only.

## Prerequisites

Learn lists **Microsoft Entra ID P1**, with a free trial available.

## Limitations from the page

- **Initial authentication is not restricted.** Conditional Access evaluates after initial authentication. A user can still enter a password but must then complete a phishing-resistant method before continuing.
- **Grant control combination.** Require multifactor authentication and Require authentication strength cannot be used together in one policy.
- **Unsupported method.** Email one-time pass for guests is not supported in the available combinations.
- **Windows Hello for Business.** If the primary sign-in is another method, such as a password, the user is not prompted for Windows Hello for Business. The user must restart the session, select **Sign-in options** and choose a method the strength requires.
- **Known issue.** A strength and sign-in frequency can be satisfied at different times. For example, a passkey sign-in 24 hours ago can satisfy a strength while a Windows Hello unlock today satisfies a 1-hour sign-in frequency.

## Rolling it out safely

Learn does not give a rollout plan, so use common admin practice:

1. Check that users have a registered method that the strength allows before you enforce it. A user without FIDO2, Windows Hello or certificate-based authentication cannot satisfy phishing-resistant MFA.
2. Start with a small group or a report-only approach to see the impact. This guide did not read the page about report-only mode, so confirm the option in your tenant.
3. Exclude emergency access accounts according to your organization's standard.
4. Expand to admins first, then to broader groups.

These are suggestions, not statements from the Learn page.

## Not covered by the page

The concept page does not detail per-method restrictions, how external users are handled, or step-by-step creation and assignment. Learn links a separate article for custom strengths.

## Typical mistakes

- Selecting both Require multifactor authentication and Require authentication strength in one policy.
- Enforcing phishing-resistant MFA before users have a compatible method.
- Expecting the strength to block the first password prompt.
- Assuming Microsoft Authenticator phone sign-in counts as phishing-resistant. In the built-in tables, it does not.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Overview of Conditional Access Authentication Strengths (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths)
