---
title: "How to Investigate and Remediate Risky Users in Entra ID Protection"
summary: "Investigate and remediate risky users in Microsoft Entra ID Protection: roles, license, investigation order, self-remediation, password reset, confirm compromised or safe, dismiss, block and revoke sessions, with caveats from Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [microsoft-entra-id-protection]
keypoints:
  - "Learn names Global Reader to view risk reports and Reports Reader for sign-in and audit logs. It names no role for remediation actions."
  - "Full ID Protection access needs Microsoft Entra ID P2 or Microsoft Entra Suite."
  - "Investigate in this order: sign-in logs, other security tools, contacting the user, then mark compromised, safe or dismissed, and add risk-based Conditional Access."
  - "Try self-remediation first when available. Reset the password when activity looks compromised. Block only when the attacker can still reset the password or pass MFA."
  - "Revoking refresh and access tokens is described as critical when there is evidence of active compromise."
faq:
  - q: "Which roles and license do I need?"
    a: "Learn names Global Reader as the least privileged role to view risk reports and Reports Reader for sign-in and audit logs. Microsoft Entra ID P2 or Microsoft Entra Suite is required for full access to ID Protection features. The page names no role for dismissing risk or confirming compromise."
  - q: "What should I check first for a risky user?"
    a: "The sign-in logs. Compare application, device, location, IP address and user agent with the user's past activity. Then check other tools such as Microsoft Sentinel or Defender XDR, and contact the user."
  - q: "When should I block a user?"
    a: "Learn says blocking is recommended when an attacker can still reset the password or complete MFA. Pair it with a password reset and token revocation. Otherwise a password reset is enough."
  - q: "What does confirming a sign-in as safe mean?"
    a: "Learn uses it when location, IP, app, user agent or travel match the user's expected behavior, or when a sanctioned VPN is involved."
  - q: "How do I reduce false positives?"
    a: "Add corporate VPN and IP ranges to named locations. Learn says to add them in both Microsoft Entra ID and Microsoft Defender for Cloud Apps."
---

For a risky user, investigate in a fixed order: read the sign-in logs, check other security tools, ask the user, then decide between self-remediation, a password reset, blocking and token revocation. This guide follows the Microsoft Learn article on investigating risk in ID Protection. The article does not give the portal path to the Risky users report or step-by-step admin center instructions, and this guide does not invent them.

## Roles and license

| Task | Role named on Learn |
| --- | --- |
| View risk reports | Global Reader, the least privileged role |
| View sign-in and audit logs | Reports Reader, the least privileged role |
| Confirm compromise, dismiss risk, reset passwords, revoke sessions | Not named on the page |

Full access to ID Protection features needs **Microsoft Entra ID P2** or **Microsoft Entra Suite**.

## Investigation order

1. **Check the sign-in logs.** Decide whether the activity is normal for the user. Compare the application, the device (registered or compliant), the location, the IP address and the user agent string with the user's past activity.
2. **Check other security tools.** Examples on the page are Microsoft Sentinel alerts, Microsoft Defender XDR incidents, and the Defender portal under **Incidents & alerts** > **Alerts**, filtered by Product name AAD Identity Protection.
3. **Contact the user.** Confirm the sign-in. Learn warns that email or Teams might be compromised, so use another channel when in doubt.
4. **Mark the result.** Mark the user or sign-in as confirmed compromised, confirmed safe, or dismiss the risk. You can confirm compromise in the Microsoft Entra admin center or through Microsoft Graph.
5. **Prevent a repeat.** Set up risk-based Conditional Access policies.

## Remediation options

| Option | When Learn uses it |
| --- | --- |
| Self-remediation | The first step when available. Through self-service password reset or the remediation flow of a risk-based Conditional Access policy. Use when the account is not compromised and no other indicators exist |
| Password reset | When activity looks like compromise, or the user is marked compromised and has not self-remediated. A Conditional Access password reset fully remediates user risk for leaked-credential detections |
| Require MFA re-registration | Listed as an administrator option |
| Confirm compromised | When the legitimate user did not perform the activity. Follow with a password reset |
| Confirm safe | When location, IP, app, user agent or travel match expected behavior, or a sanctioned VPN is involved |
| Dismiss risk | Listed as an option after investigation. The page does not describe its effects in detail |
| Block the user | When an attacker can reset the password or complete MFA. Pair with password reset and token revocation |
| Revoke sessions and tokens | When an attacker may be impersonating the user. Learn calls it critical when there is evidence of active compromise |

## Caveats from the page

- Try self-remediation first when it is an option. Otherwise an admin must act.
- Block only when the attacker can still reset the password or pass MFA. Otherwise a password reset is enough.
- Password spray detections fire only in tenants where a successful password match was confirmed. Failed spray attempts do not create detections.
- Leaked-credential detections are always high risk.
- Use Microsoft Entra smart lockout to avoid unnecessary lockouts during password spray response.
- Add corporate VPN and IP ranges to named locations in both Microsoft Entra ID and Microsoft Defender for Cloud Apps to reduce false positives.
- Investigation can continue after containment. You may still need to mark the user or sign-in as safe, compromised or dismissed.

## What the page does not cover

The portal path to the Risky users report, a full list of risk states or levels, the roles for remediation, the exact effects of dismissing risk, Graph endpoints or code samples, and click-by-click admin center steps. For report details, Learn links to its risk reports article.

## A decision flow

The flow combines the Learn guidance. The order of questions is a suggestion.

1. Does the activity match the user's normal pattern? If yes, confirm safe.
2. Can the user self-remediate? If yes, let them.
3. Does the activity look like compromise? Confirm compromised and reset the password.
4. Can an attacker still reset the password or pass MFA? Block the user and revoke tokens.
5. Is there evidence of active compromise? Revoke refresh and access tokens.
6. Afterwards, review Conditional Access policies that react to risk.

## Typical mistakes

- Contacting the user over a channel the attacker may control.
- Blocking when a password reset would do.
- Forgetting to revoke tokens after a confirmed compromise.
- Dismissing risk without a documented reason.
- Leaving VPN ranges out of named locations and chasing false positives.

## Related

- [Microsoft Entra ID Protection](https://www.m365.fm/entity/microsoft-entra-id-protection/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)
- [Microsoft Entra ID P2](https://www.m365.fm/entity/microsoft-entra-id-p2/)

## Sources

- [Investigate risk in Microsoft Entra ID Protection (Microsoft Learn)](https://learn.microsoft.com/entra/id-protection/howto-identity-protection-investigate-risk)
