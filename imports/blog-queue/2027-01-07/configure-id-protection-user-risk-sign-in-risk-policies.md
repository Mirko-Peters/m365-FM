---
title: "How to Configure Entra ID Protection Risk Policies for User Risk and Sign-In Risk"
summary: "Create user risk and sign-in risk policies in Conditional Access for Entra ID Protection: license and role, recommended risk levels, grant and session controls, exclusions, report-only testing and the October 1, 2026 retirement of legacy policies."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [microsoft-entra-id-protection, conditional-access]
keypoints:
  - "Risk policies are set up in Conditional Access as a user risk policy and a sign-in risk policy. Learn says not to combine the two risk conditions in one policy."
  - "Recommended: require risk remediation when user risk is High, and require multifactor authentication when sign-in risk is Medium or High."
  - "Exclude emergency access accounts and service accounts. Use Conditional Access for workload identities for service principals."
  - "Users must register for multifactor authentication before a remediation situation, or they are blocked. Hybrid users need password writeback."
  - "Learn says legacy risk policies in ID Protection will be retired on October 1, 2026, so migrate them to Conditional Access."
faq:
  - q: "What do I need to create risk policies?"
    a: "Per Microsoft Learn, a Microsoft Entra ID P2 or Microsoft Entra Suite license for full access to ID Protection features. The least privileged role to create or edit Conditional Access policies is Conditional Access Administrator."
  - q: "What risk levels does Learn recommend?"
    a: "For the user risk policy, require risk remediation at High. For the sign-in risk policy, require multifactor authentication at Medium and High."
  - q: "Can I put user risk and sign-in risk in one policy?"
    a: "No. Learn says not to combine sign-in risk and user risk conditions in the same Conditional Access policy. Create separate policies."
  - q: "What happened to the legacy risk policies?"
    a: "Learn says the legacy risk policies configured in ID Protection will be retired on October 1, 2026. Create equivalent Conditional Access policies in report-only mode, turn them on, then disable the old ones."
  - q: "Who should be excluded?"
    a: "Emergency access or break-glass accounts, and service accounts and service principals. Learn recommends managed identities for scripts and code that use service accounts."
---

Entra ID Protection risk policies now live in Conditional Access. You create one policy for user risk and one for sign-in risk, start in report-only mode and then turn them on. The legacy policies in ID Protection are scheduled for retirement on October 1, 2026, a date that is now close. This guide follows the Microsoft Learn page on configuring risk policies.

## Licenses and roles

- **License:** Microsoft Entra ID P2 or Microsoft Entra Suite is required for full access to ID Protection features.
- **Role:** Conditional Access Administrator is the least privileged role to create or edit Conditional Access policies.

Conditional Access templates are an alternative way to deploy the policies. Before you enable anything, Learn says to investigate and remediate active risks.

## Choose risk levels

- **High only:** fewer triggers and less user friction. But Low and Medium risks are excluded and may not block an attacker.
- **Medium and Low:** usually more interruptions for users.

Learn prefers self-remediation policies over blocking. It does not define Low, Medium or High on this page.

## Recommended settings

**User risk policy**

- Require risk remediation when user risk is **High**.
- Passwordless users have sessions revoked and must sign in again. Password users are prompted for a secure password change after successful multifactor authentication.
- Require authentication strength and **Sign-in frequency - Every time** are applied automatically.

**Sign-in risk policy**

- Require multifactor authentication when sign-in risk is **Medium** or **High**.
- Add the sign-in frequency session control so risky sign-ins must reauthenticate.
- Learn says strong authentication is the only way to self-remediate sign-in risk, regardless of level.

## Create the user risk policy

1. In the Microsoft Entra admin center, go to **Entra ID** > **Conditional Access** > **New policy**.
2. Under **Users or workload identities**, include **All users** and exclude your break-glass accounts.
3. Under **Target resources**, include **All resources (formerly 'All cloud apps')**.
4. Under **Conditions** > **User risk**, set **Configure** to **Yes** and select **High**.
5. Under **Access controls** > **Grant**, select **Grant access** and **Require risk remediation**. Choose an authentication strength.
6. Confirm the session control **Sign-in frequency - Every time**.
7. Set **Enable policy** to **Report-only** and select **Create**.

## Create the sign-in risk policy

1. Select **New policy** again. Include **All users** and exclude break-glass accounts.
2. Under **Cloud apps or actions**, include **All resources (formerly 'All cloud apps')**.
3. Under **Conditions** > **Sign-in risk**, set **Configure** to **Yes** and select **High** and **Medium**.
4. Under **Grant**, select **Require authentication strength** and the built-in **Multifactor authentication**.
5. Under **Session** > **Sign-in frequency**, make sure **Every time** is selected.
6. Set **Enable policy** to **Report-only** and select **Create**.

For passwordless users, Learn gives a variant. Target those users, use sign-in risk High and Medium, and require the built-in **Passwordless MFA** or **Phishing-resistant MFA** strength.

## Exclusions

- Emergency access or break-glass accounts, to prevent lockout.
- Service accounts and service principals. Calls by service principals are not blocked by policies scoped to users. Use Conditional Access for workload identities. Replace service accounts in scripts or code with managed identities.

## Registration and password requirements

- Users must register for multifactor authentication before a remediation situation. Unregistered users are blocked and need administrator help.
- Hybrid users synced from on-premises need password writeback enabled.
- A password change made outside the risky-user remediation flow does not meet the secure password change requirement.

## Test in report-only mode

Confirm the settings with policy impact or report-only mode before you move **Enable policy** from **Report-only** to **On**. The page links to results guidance but gives no review steps.

## Migrate legacy policies

Learn says the legacy risk policies configured in ID Protection will be retired on October 1, 2026.

1. Create equivalent user and sign-in risk policies in Conditional Access in report-only mode. Switch them to **On** after confirmation.
2. Disable the old policies. In **ID Protection** > **Dashboard**, select the **User risk** or **Sign-in risk** policy and set **Enforce policy** to **Disabled**.
3. Create other risk policies in Conditional Access as needed.

If you need help, Learn describes a support request path called Migrate legacy ID Protection policy.

## What the page does not say

- How Low, Medium and High are defined, or which detections map to which level.
- Which authentication strength to pick for the user risk policy.
- How to map each legacy setting to a Conditional Access equivalent, or what happens to active sessions.
- Whether a coverage gap exists between disabling the old policies and enabling the new ones.
- Which risk policy features are missing at lower license tiers.
- The page also uses different labels in different steps, such as Target resources and Cloud apps or actions. Follow what your portal shows.

## Typical mistakes

- Combining user risk and sign-in risk in one policy.
- Skipping break-glass exclusions.
- Enabling the policy before users have registered for multifactor authentication.
- Leaving migration until after the retirement date.

## Related

- [Microsoft Entra ID Protection](https://www.m365.fm/entity/microsoft-entra-id-protection/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)

## Sources

- [Configure and enable risk policies (Microsoft Learn)](https://learn.microsoft.com/entra/id-protection/howto-identity-protection-configure-risk-policies)
