---
title: "How to Create and Monitor Emergency Access Break-Glass Accounts in Entra ID"
summary: "Create emergency access accounts in Microsoft Entra ID: why you need them, account requirements, Conditional Access exclusion, sign-in log alerts with Azure Monitor, validation every 90 days and credential storage."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [entra-id, conditional-access]
keypoints:
  - "Create two or more emergency access accounts. They should be cloud-only on the onmicrosoft.com domain, with a permanent, active Global Administrator assignment."
  - "Do not tie the accounts to one person or to employee devices. Learn recommends a passkey (FIDO2) or certificate-based authentication that differs from your other admins."
  - "Exclude the accounts from Conditional Access policies that block or restrict sign-in, for example through a dedicated EmergencyAccess group."
  - "Monitor with Entra sign-in logs sent to Azure Monitor and an alert rule with severity 0 - Critical that fires when the query returns more than 0 results."
  - "Validate the accounts at least every 90 days and when IT staff or Entra subscriptions change."
faq:
  - q: "How many emergency access accounts do I need?"
    a: "Microsoft Learn says to create two or more, and to maintain at least two for redundancy."
  - q: "What should the accounts look like?"
    a: "Cloud-only accounts on the onmicrosoft.com domain that are not federated or synchronized, assigned the Global Administrator role as active permanent in Privileged Identity Management, and not tied to an individual user or employee-supplied device."
  - q: "How should they sign in?"
    a: "Learn recommends a passkey (FIDO2) or certificate-based authentication if you already have a PKI. The method should differ from your other admin accounts, and the device or credential must not expire or be removed by automated cleanup."
  - q: "How do I monitor them?"
    a: "Send Entra sign-in logs to Azure Monitor, then create a Log Analytics alert rule on a query for the accounts' object IDs with threshold greater than 0, severity 0 - Critical and an action group."
  - q: "How often should I test them?"
    a: "At least every 90 days, after IT staff changes and when Entra subscriptions change. Learn also suggests testing Conditional Access sign-in quarterly."
---

Emergency access, or break-glass, accounts are the way back into your tenant when normal administration fails. They are cloud-only accounts that are excluded from blocking policies, kept in a safe place and watched closely. This guide follows the Microsoft Learn page on managing emergency access accounts in Microsoft Entra ID.

## Why you need them

The page says it is important to prevent locking yourself out because you cannot sign in or activate a role. Scenarios it lists:

- A federation outage, for example a cell-network break or an identity provider outage.
- Administrators' multifactor devices or the MFA service being unavailable.
- The last Global Administrator leaving. Entra ID prevents deletion of the last Global Administrator, but not deletion or disabling on-premises.
- Natural disasters.
- All Global Administrator and Privileged Role Administrator assignments being eligible with approval required, and no active approvers.

## How many

Create two or more accounts and keep at least two for redundancy.

## Account requirements

- **Cloud-only on onmicrosoft.com.** Not federated and not synchronized from on-premises.
- **Global Administrator.** Assign it and, in Privileged Identity Management, make the assignment active permanent, not eligible.
- **Not tied to a person.** Do not associate them with an individual or with employee-supplied devices such as phones. Learn allows individual emergency accounts for administrators as an alternative.
- **Authentication.** Passwordless methods that satisfy MFA: a passkey (FIDO2), which is marked recommended, or certificate-based authentication if you have a PKI. Use a method different from your other administrative accounts. The device or credential must not expire or fall under automated cleanup for lack of use.
- **Workstation.** A designated, secure workstation, such as a Privileged Access Workstation.
- **Separation.** Keep emergency access for on-premises systems and for cloud services distinct, with no dependency on each other.

## Conditional Access

Exclude the accounts from Conditional Access policies that block or restrict sign-in, because an enforced policy could stop sign-in during the emergency. Report-only policies do not block access and need no exclusion. Learn suggests a dedicated group, such as EmergencyAccess, to exclude. It also says to test regularly, for example every quarter, that the accounts can sign in with your current Conditional Access configuration, and to prepare contingency policies for outages.

## Monitor sign-ins

1. Send Microsoft Entra sign-in logs to Azure Monitor.
2. Get the object ID of each emergency account.
3. Create an alert rule on the Log Analytics workspace with a custom log search.
4. Use a query such as the one on the page:

```kusto
SigninLogs
| where UserId == "00aa00aa-bb11-cc22-dd33-44ee44ee44ee" or UserId == "11bb11bb-cc22-dd33-ee44-55ff55ff55ff"
| project TimeGenerated, UserPrincipalName, UserId, IPAddress, ResultType, ResultDescription
```

5. Set threshold type static, operator Greater than, threshold value 0 and severity **0 - Critical**.
6. Notify through an action group by email, SMS, push or voice.

Add another `or UserId ==` clause for more accounts. After an alert, preserve the logs and run a post-mortem to decide whether it was a drill, a real emergency or misuse.

## Validate regularly

Do this at least every 90 days, and after IT staff changes or changes to the Entra subscriptions. Each check should confirm that:

- The accounts can sign in and perform administrative tasks.
- No one has registered MFA or self-service password reset to personal devices or details.
- The monitoring and alerts fire.
- The list of authorized people is current.

## Store the credentials

Keep credentials secure and known only to authorized people. Learn says to store them in secure, fireproof safes in separate locations, in a known secure place available to several members of the administration team, and to change safe combinations regularly and after someone with access leaves. Examples include FIDO2 keys for Entra ID and smartcards for Windows Server Active Directory.

## What the page does not say

- A query or alert for audit logs, although it says to monitor sign-in and audit activity. Only SigninLogs is shown.
- Recommended alert evaluation frequency or granularity.
- The number of authorized people.
- A procedure for a lost key or a failed secure workstation.
- How the secure workstation requirement fits with remote use for individual accounts.

## A setup order

This order is practical advice built on the page.

1. Create two cloud-only accounts and assign permanent Global Administrator.
2. Register a passkey or certificate on each, using a different method than your other admins.
3. Create the EmergencyAccess group and exclude it from blocking policies.
4. Send sign-in logs to Azure Monitor and create the alert.
5. Store the credentials and schedule 90-day checks.

## Typical mistakes

- Making the role assignment eligible instead of active.
- Registering MFA on a personal phone.
- Forgetting the exclusion after adding a new blocking policy.
- Never testing the alert.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Privileged Identity Management](https://www.m365.fm/entity/privileged-identity-management/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Manage emergency access admin accounts in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access)
