---
title: "Three Conditional Access Policies to Set Up in a New Microsoft 365 Tenant"
summary: "Start with MFA for all users, blocking legacy authentication and phishing-resistant MFA for admins. Steps, exclusions, report-only rollout and the security defaults and license rules from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [conditional-access, microsoft-entra, security-defaults, legacy-authentication]
keypoints:
  - "Microsoft has separate Learn articles for three starter policies: MFA for all users, blocking legacy authentication, and phishing-resistant MFA for admins."
  - "New tenants have security defaults on. You must disable security defaults before you can use Conditional Access, which needs at least Microsoft Entra ID P1."
  - "Create every policy in Report-only mode first, review the impact, then switch it to On."
  - "Exclude emergency access accounts from each policy to avoid lockout, and register phishing-resistant methods before requiring them for admins."
  - "Microsoft also offers Microsoft-managed policies, created in report-only state and enabled no sooner than 30 days later if you leave them."
faq:
  - q: "Do I need Conditional Access in a new tenant?"
    a: "Not necessarily at first. Microsoft Learn says security defaults are available at no cost and are enabled on all new tenants at creation, enforcing MFA registration, admin MFA and blocking legacy authentication. Learn suggests considering Conditional Access if you have Entra ID P1 or P2, complex requirements or need granular exceptions."
  - q: "Which license does Conditional Access need?"
    a: "Microsoft Learn says using Conditional Access requires Microsoft Entra ID P1 licenses, and that Microsoft 365 Business Premium customers can also use it. Risk-based policies need Microsoft Entra ID Protection, which is an Entra ID P2 feature."
  - q: "Can I use security defaults and Conditional Access together?"
    a: "No. Learn says you must disable security defaults before you can use Conditional Access, and recommends enabling the Microsoft-managed Conditional Access policies right away afterwards to keep the same protections. Disabling needs at least the Conditional Access Administrator role."
  - q: "What should I exclude from these policies?"
    a: "Learn recommends excluding emergency access (break-glass) accounts. For the all-users MFA policy it also suggests excluding Directory Synchronization Accounts if you use Entra Connect or Cloud Sync. Service accounts and service principals aren't blocked by user-scoped policies and are covered by Conditional Access for workload identities."
  - q: "Why use report-only mode?"
    a: "Learn's policy articles tell you to create the policy in Report-only, review the impact, and then switch Enable policy to On. This lets you see who would be affected, for example which sign-ins still use legacy protocols, before anyone is blocked."
---

If you start a new Microsoft 365 tenant, three Conditional Access policies give you a sound base: MFA for all users, a block on legacy authentication, and phishing-resistant MFA for admins. Microsoft doesn't call these "the three every tenant needs", but each one has its own Learn article and together they cover the baseline Microsoft describes. This article gives the order, the exclusions and the traps.

## Step zero: security defaults and licenses

Microsoft Learn says security defaults are a free baseline that is enabled on all new tenants at creation, with a 24-hour grace period before enforcement. They require MFA registration, require MFA for admins, block legacy authentication and block device code flow.

Conditional Access needs at least **Microsoft Entra ID P1**, and Microsoft 365 Business Premium customers can also use it. Learn says you must disable security defaults first:

1. Sign in to the Microsoft Entra admin center as at least Conditional Access Administrator.
2. Go to **Entra ID** > **Overview** > **Properties**.
3. Select **Manage security defaults**.
4. Set **Security defaults** to **Disabled (not recommended)** and select **Save**.

Microsoft recommends enabling the Microsoft-managed Conditional Access policies right afterwards, so you keep the same protection while you build your own.

## Before any policy: emergency access accounts

Learn recommends two cloud-only emergency access accounts with permanent Global Administrator assignment, not tied to individuals and used only when normal accounts aren't available. Exclude them from each policy below. Without that exclusion, a misconfiguration can lock everyone out.

## Policy 1: Require MFA for all users

Learn's template uses an authentication strength.

1. Go to **Entra ID** > **Conditional Access** > **Policies** > **New policy**.
2. **Users:** include **All users**. Exclude emergency access accounts, and Directory Synchronization Accounts if you use Entra Connect or Cloud Sync.
3. **Target resources:** include **All resources**, with no exclusions.
4. **Grant:** select **Grant access** > **Require authentication strength** > **Multifactor authentication strength**.
5. Set **Enable policy** to **Report-only** and select **Create**.

Learn notes that user-scoped policies don't block service principals. Use Conditional Access for workload identities for those, and replace scripted service accounts with managed identities where possible.

## Policy 2: Block legacy authentication

Learn says Microsoft's analysis found over 97 percent of credential stuffing and over 99 percent of password spray attacks use legacy authentication. Legacy protocols don't support MFA.

First check who still uses them: **Entra ID** > **Monitoring & health** > **Sign-in logs**, add the **Client App** column, filter for legacy protocols, and repeat on the **User sign-ins (non-interactive)** tab.

Then create the policy:

- **Users:** include **All users**. Exclude emergency access accounts and any account that must keep legacy auth for now.
- **Target resources:** **All resources**.
- **Conditions** > **Client apps:** configure **Yes** and select only **Exchange ActiveSync clients** and **Other clients**.
- **Grant:** **Block access**.
- Start in **Report-only**.

## Policy 3: Require phishing-resistant MFA for admins

1. **Users:** include **Directory roles** and choose at least the roles Microsoft recommends: Global Administrator, Application Administrator, Authentication Administrator, Billing Administrator, Cloud Application Administrator, Conditional Access Administrator, Exchange Administrator, Helpdesk Administrator, Password Administrator, Privileged Authentication Administrator, Privileged Role Administrator, Security Administrator, SharePoint Administrator and User Administrator. Exclude emergency access accounts.
2. **Target resources:** **All resources**.
3. **Grant:** **Require authentication strength** > **Phishing-resistant MFA strength**.
4. **Report-only** first, then **On**.

Learn's built-in phishing-resistant strength includes FIDO2 security keys, Windows Hello for Business or platform credentials, and certificate-based authentication (multifactor). Microsoft Authenticator phone sign-in is not part of it.

Two cautions from the article. Admins must register phishing-resistant methods before you enable the policy, using a Temporary Access Pass or a passkey with a security key, or they risk lockout. And the policy applies to built-in roles only, not administrative unit-scoped or custom roles.

## Roll out in the right order

1. Disable security defaults and create the emergency access accounts.
2. Register phishing-resistant methods for admins.
3. Create all three policies in report-only mode.
4. Review the impact. For legacy authentication, check the sign-in logs for apps that would break.
5. Switch policies to On one at a time.

## Microsoft-managed policies

Learn describes Microsoft-managed policies such as Block legacy authentication, Multifactor authentication for all users and MFA for admins accessing Microsoft admin portals. Each is created in report-only state. If left that way, Microsoft enables it no sooner than 30 days after introduction, with notices two weeks before. You can change the state and exclusions but can't rename or delete them. Use Duplicate to make broader changes.

## How to check the result

After a policy has been in report-only mode for a while, review the results in the sign-in logs and the policy's report-only details before you switch it on. Look for three things: sign-ins that would have been blocked and belong to real people, sign-ins from apps or devices you didn't know about, and service accounts that still sign in like users. Fix those first. The Conditional Access overview page shows how many policies are enabled versus report-only, which makes a quick status check easy.

## Common mistakes

- Forgetting emergency access accounts.
- Skipping report-only and breaking a scanner or old mail client.
- Requiring phishing-resistant MFA before admins have registered a method.
- Assuming a user-scoped policy covers service principals.
- Combining Require multifactor authentication and Require authentication strength in one policy. Learn says they can't be used together.

## Related

- [Conditional Access report-only mode](https://www.m365.fm/entity/conditional-access-report-only-mode/)
- [Emergency access accounts](https://www.m365.fm/entity/emergency-access-accounts/)
- [Phishing-resistant MFA](https://www.m365.fm/entity/phishing-resistant-mfa/)
- [Authentication strength](https://www.m365.fm/entity/authentication-strength/)

## Sources

- [Security defaults in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults)
- [Require MFA for all users with authentication strength (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-mfa-strength)
- [Block legacy authentication with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication)
- [Require phishing-resistant MFA for administrators (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/how-to-policy-phish-resistant-admin-mfa)
- [Microsoft-managed Conditional Access policies (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/managed-policies)
- [Conditional Access overview (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
- [Authentication strengths (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths)
