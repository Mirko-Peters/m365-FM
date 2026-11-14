---
title: "MFA vs Conditional Access: What Is the Difference in Microsoft Entra?"
summary: "MFA is a second sign-in check. Conditional Access is the policy engine that decides when to require it. Compare MFA, security defaults and Conditional Access, with license notes from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [mfa, conditional-access, entra-id, security-defaults]
keypoints:
  - "MFA is the verification step. Conditional Access is the policy engine that decides whether, when and for whom to require it."
  - "In Conditional Access, MFA is one of the grant controls, next to authentication strength, compliant device and others."
  - "Security defaults are a free, fixed baseline. Conditional Access needs at least Microsoft Entra ID P1 and is fully customizable."
  - "Organizations that replace security defaults with Conditional Access policies must disable security defaults first."
  - "Risk-based Conditional Access policies need Microsoft Entra ID Protection, a P2 feature."
faq:
  - q: "Is Conditional Access the same as multifactor authentication?"
    a: "No. According to Microsoft Learn, multifactor authentication prompts for an additional form of identification during sign-in, while Conditional Access is a policy engine that makes access decisions from signals. MFA is one of the grant controls a Conditional Access policy can require."
  - q: "How can MFA be turned on in Microsoft Entra?"
    a: "Microsoft Learn lists three ways: security defaults, which is the quickest option, enabling MFA for users and groups, and Conditional Access, which is the more granular option where policies define which events or apps require MFA."
  - q: "Do I need a license for Conditional Access?"
    a: "Microsoft Learn says Conditional Access requires Microsoft Entra ID P1, and that Microsoft 365 Business Premium customers can also use its features. Risk-based policies need Microsoft Entra ID Protection, which is a P2 feature."
  - q: "Can security defaults and Conditional Access run together?"
    a: "Microsoft Learn says organizations that implement Conditional Access policies replacing security defaults must disable security defaults. After disabling them, the page says organizations should immediately enable Conditional Access policies."
  - q: "Where do I find Conditional Access in the portal?"
    a: "Microsoft Learn gives the path Microsoft Entra admin center, then Entra ID, then Conditional Access. Viewing needs at least the Security Reader role. The area has Overview, Coverage and Policies pages."
---

MFA and Conditional Access are not alternatives. MFA is the extra check at sign-in, such as an authenticator prompt. Conditional Access is the rule engine that decides when a sign-in needs that check, or whether it should be blocked. Between them sits a third option, security defaults, which switches on a fixed set of protections for free. This article compares the three using Microsoft Learn.

## The short version

| | MFA | Security defaults | Conditional Access |
|---|---|---|---|
| What it is | A second verification factor | A fixed baseline of protections | A policy engine with signals and decisions |
| Customizable | Methods are chosen by admins | No, on or off | Fully |
| License | Page gives no license details | No extra cost | Microsoft Entra ID P1 or higher |
| Typical use | The check itself | Small tenants starting out | Granular control |

## What MFA is

Microsoft Learn explains that MFA prompts users for an additional form of identification during sign-in, such as a code on a phone or a fingerprint scan. It combines two or more categories: something you know, something you have and something you are. The methods listed include Microsoft Authenticator, Windows Hello for Business, passkeys (FIDO2), certificate-based authentication, Temporary Access Pass, OATH tokens, SMS and voice call. Users can manage their methods at myprofile.microsoft.com.

MFA prompts are part of the Entra sign-in, so apps and services do not need to change.

## What Conditional Access is

Learn describes it as the Zero Trust policy engine: an if-then statement that says if a user wants a resource, then an action is required. Policies are enforced after first-factor authentication.

**Signals** include user, group or agent, IP location, device platform and state, application, Entra ID Protection risk and Defender for Cloud Apps session controls.

**Decisions** are to block access or to grant it, optionally with requirements such as MFA, authentication strength, a compliant device, a hybrid joined device, an approved client app, an app protection policy, a password change or terms of use.

So MFA is a grant control inside a policy. The Learn page gives examples of requiring MFA for administrative roles and for Azure management tasks.

## Three ways to require MFA

Learn lists them in this order:

1. **Security defaults:** the quickest option. It enables Microsoft Authenticator for all users in the tenant.
2. **MFA for users and groups:** prompts selected users and groups at sign-in.
3. **Conditional Access:** policies define which events or apps need MFA. For example, sign-in may proceed normally from the corporate network but require extra verification when the user is remote.

## What security defaults enforce

According to Microsoft Learn, security defaults:

- require all users to register for MFA, with no registration grace period since July 29, 2024;
- require MFA at every sign-in for administrators in roles such as Global Administrator and Security Administrator;
- prompt other users when Microsoft decides it is necessary, based on location, device, role and task;
- block legacy authentication and device code flow;
- require MFA for Azure management tools such as the Azure portal, the Microsoft Entra admin center, Azure PowerShell and Azure CLI.

Security defaults are free and cannot be customized. Learn says that if you have Microsoft Entra ID P1 or P2, they are probably not right for you, and that complex requirements point to Conditional Access.

To enable or disable them, sign in to the Microsoft Entra admin center as at least a Conditional Access Administrator and browse to **Entra ID** > **Overview** > **Properties** > **Manage security defaults**. Set the value and select **Save**.

## When to move to Conditional Access

Learn states that organizations that replace security defaults with Conditional Access must disable security defaults. After disabling them, administrators should immediately enable Conditional Access policies. Microsoft-managed policies can give the same protections: block legacy authentication, require MFA for Azure management, for admins and for all users. Organizations with Entra ID P2 and Entra ID Protection can add user risk and sign-in risk policies. Microsoft recommends two cloud-only emergency access accounts with a permanent Global Administrator assignment.

Two cautions from the security defaults page:

- Do not disable authentication methods while using security defaults, because that can lock you out of the tenant.
- Admins must stop using legacy protocols before enabling.

## Where to find Conditional Access

Open the Microsoft Entra admin center, then **Entra ID** > **Conditional Access**. Viewing needs at least the Security Reader role. The area has **Overview**, **Coverage** (apps with and without policy coverage over the past seven days) and **Policies**, where you can use "What if" scenarios and create policies from scratch, from a template or through Microsoft Graph.

## Licensing

Conditional Access requires Microsoft Entra ID P1. Microsoft 365 Business Premium customers can also use it. Risk-based policies need Entra ID Protection (P2). If licenses expire, policies are not disabled or deleted automatically. You can view and delete them, but not update them.

## Which one to choose

- A tenant with no Entra ID P1 and no complex needs: security defaults.
- A tenant with P1 or Business Premium and different rules for admins, guests or locations: Conditional Access.
- Any tenant: MFA stays the control being enforced.

## Typical mistakes

- Running both in parallel and expecting both to apply. Disable security defaults when you switch.
- Disabling security defaults without turning on replacement policies.
- Forgetting emergency access accounts before creating a policy that applies to everyone.
- Confusing the license: P1 for Conditional Access, P2 for risk-based policies.

## Related

- [Multifactor authentication](https://www.m365.fm/entity/mfa/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Security defaults](https://www.m365.fm/entity/security-defaults/)

## Sources

- [What is Conditional Access? (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
- [How Microsoft Entra multifactor authentication works (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks)
- [Security defaults in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults)
