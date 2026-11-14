---
title: "Microsoft Entra Built-in Roles and Privileged Identity Management (PIM) Explained"
summary: "What Microsoft Entra built-in roles are, how they are grouped, how Privileged Identity Management makes them eligible and time-bound, the role settings that matter, and the best practices Microsoft recommends."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [privileged-identity-management, microsoft-entra, role-based-access-control, global-administrator]
keypoints:
  - "Microsoft Entra ID has about 60 built-in roles with fixed permissions, plus custom roles where you pick the permissions."
  - "Teams, SharePoint and Managed Desktop have no separate role system. Administrative access to them uses Microsoft Entra roles."
  - "PIM makes a role eligible instead of permanently active. The user activates it for a limited time, with MFA, justification or approval if configured."
  - "Microsoft recommends fewer than five Global Administrators, two cloud-only emergency access accounts, and fewer than 10 privileged role assignments."
  - "Activation maximum duration is set per role under PIM > Microsoft Entra roles > Roles > Role settings, from 1 to 24 hours."
faq:
  - q: "What are Microsoft Entra built-in roles?"
    a: "According to Microsoft Learn, Microsoft Entra ID has about 60 built-in roles, each with a fixed set of permissions. It also supports custom roles, where you select the specific permissions. Examples of built-in roles include Global Administrator, User Administrator, Application Administrator, Conditional Access Administrator, Security Administrator and Teams Administrator."
  - q: "What does Privileged Identity Management do?"
    a: "Microsoft Learn describes PIM as a service in Microsoft Entra ID to manage, control and monitor access to important resources. It provides just-in-time, time-bound privileged access, can require approval, MFA and justification for activation, sends notifications, supports access reviews and keeps audit history. It covers Microsoft Entra roles, Azure resource roles and PIM for Groups."
  - q: "What is the difference between eligible and active assignments?"
    a: "Microsoft Learn defines an eligible assignment as one that requires the user to perform actions, such as MFA, a business justification or approval, to use the role. An active assignment requires no action, and the user has the role's privileges. Both can be permanent or time-bound."
  - q: "How many Global Administrators should an organization have?"
    a: "Microsoft recommends fewer than five Global Administrators. It also recommends two cloud-only emergency access accounts that are permanently assigned the Global Administrator role and not tied to specific people. A Global Administrators alert card appears on the Microsoft Entra Overview page if there are five or more privileged Global Administrator assignments."
  - q: "How do I activate an eligible role?"
    a: "Sign in to the Microsoft Entra admin center and go to ID Governance, Privileged Identity Management, My roles, then Microsoft Entra roles. Select Activate next to the role, complete any additional verification, enter a reason and select Activate. If approval is required, the request shows as pending."
---

Microsoft Entra built-in roles define what an administrator can do. Privileged Identity Management (PIM) controls when they can do it. The usual pattern is simple: give people the smallest role that fits, make it eligible rather than permanent, and let them activate it for a short time when needed. This article explains both parts using Microsoft Learn.

## Built-in roles in plain terms

Microsoft's concepts page says Microsoft Entra ID has about 60 built-in roles, each with a fixed set of permissions. The best-practices page says over 65, so treat the count as approximate. Custom roles let you select specific permissions, for example to manage particular applications or service principals.

Microsoft groups the built-in roles in three informal categories. The names are arbitrary and imply nothing beyond the documented permissions.

| Category | Examples from Microsoft |
|---|---|
| Entra-specific | Application Administrator, Groups Administrator, User Administrator, Conditional Access Administrator, Privileged Role Administrator |
| Service-specific | Exchange, Intune, SharePoint and Teams Administrator roles |
| Cross-service | Global Administrator, Global Reader, Security Administrator, Security Reader, Compliance Administrator, Service Support Administrator |

Several Microsoft 365 services have their own role systems, including Exchange, Intune, Defender for Cloud Apps and the compliance portal. Teams, SharePoint and Managed Desktop do not. They use Microsoft Entra roles. Azure role-based access control for Azure resources, such as virtual machines, is a separate system and is not the same thing as Entra roles.

Some service roles exist in Entra for convenience. The Exchange Administrator role, for instance, is equivalent to the Organization Management role group in Exchange.

## What PIM adds

Microsoft describes PIM as a service to manage, control and monitor access to important resources in Microsoft Entra ID, Azure and other Microsoft online services such as Microsoft 365 and Intune. The aim is to reduce the number of people with standing access to sensitive resources.

Its features include:

- Just-in-time privileged access.
- Time-bound assignments with start and end dates.
- Approval to activate roles.
- Multifactor authentication on activation.
- Justification and notifications on activation.
- Access reviews and downloadable audit history.
- Protection against removing the last active Global Administrator and Privileged Role Administrator.

PIM requires licenses. Microsoft points to its ID Governance licensing article, and its role best practices page says PIM requires Microsoft Entra ID P2 or ID Governance. It manages Microsoft Entra roles, Azure resource roles and PIM for Groups.

### The terms that cause confusion

| Term | Meaning |
|---|---|
| Eligible | The user must act first, for example MFA, justification or approval, to use the role |
| Active | No action needed, the user has the privileges |
| Activate | Performing those actions to use an eligible role |
| Permanent | No end date |
| Time-bound | Valid only between a start date and an end date |

For Microsoft Entra roles, only a user in Privileged Role Administrator or Global Administrator can manage assignments for other administrators.

## How activation works

1. Sign in to the Microsoft Entra admin center as a user with an eligible assignment.
2. Go to **ID Governance** > **Privileged Identity Management** > **My roles**.
3. Select **Microsoft Entra roles** and find the role.
4. Select **Activate**. If prompted, select **Additional verification required** and complete MFA. Microsoft says you authenticate only once per session.
5. Optionally narrow the **Scope** and set a custom start time.
6. Enter a **Reason** and select **Activate**.

If the role needs approval, a notification shows that the request is pending. Check it under **My requests**. Microsoft says PIM creates the active assignment within seconds, but a role cannot be deactivated within five minutes of activation. Some applications cache role state, so signing out and in again may be needed.

## Role settings an admin should review

At least the Privileged Role Administrator role is needed. Go to **Privileged Identity Management** > **Microsoft Entra roles** > **Roles**, select a role, then **Role settings** > **Edit**. The page lists these options:

- **Activation maximum duration:** from one to 24 hours. The page gives no default, so check your tenant.
- **On activation, require multifactor authentication.**
- **On activation, require Conditional Access authentication context.** A policy must exist for the context, otherwise MFA is required as a backup.
- **Require justification on activation.**
- **Require ticket information on activation.** This is information only and is not checked against a ticket system.
- **Require approval to activate.** Microsoft recommends at least two approvers. With none selected, active Privileged Role Administrators or Global Administrators become the default approvers.
- **Assignment duration** for eligible and active assignments, either permanent or expiring.
- **Notifications**, including a Critical emails only option.

## Best practices from Microsoft

- **Least privilege.** Grant specific permissions, over a specific scope, for a specific period. Avoid broader roles at broader scopes for convenience.
- **Use PIM.** Make users eligible and let access expire.
- **MFA for all administrators.** Microsoft says an account is 99.9 percent less likely to be compromised with MFA.
- **Recurring access reviews** to remove assignments that are no longer needed.
- **Fewer than five Global Administrators**, plus two cloud-only emergency access accounts.
- **Fewer than 10 privileged role assignments.** Privileged roles carry a PRIVILEGED label.
- **Cloud-native accounts** for role assignments, not on-premises synced accounts.
- **Role-assignable groups**, managed in PIM, so there are no standing members.

## Common mistakes

- Leaving roles permanently active because activation seems like extra work.
- Using a broad role such as Global Administrator when a narrower one fits.
- Enabling approval without naming approvers, which sends requests to the default approvers.
- Forgetting that Teams and SharePoint administration also use Entra roles.

## Related

- [Privileged Identity Management](https://www.m365.fm/entity/privileged-identity-management/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)
- [Role-based access control](https://www.m365.fm/entity/role-based-access-control/)
- [Global Administrator](https://www.m365.fm/entity/global-administrator/)

## Sources

- [Microsoft Learn: Overview of role-based access control in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/concept-understand-roles)
- [Microsoft Learn: Best practices for Microsoft Entra roles](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices)
- [Microsoft Learn: What is Privileged Identity Management?](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure)
- [Microsoft Learn: Activate Microsoft Entra roles in PIM](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-how-to-activate-role)
- [Microsoft Learn: Configure Microsoft Entra role settings in PIM](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-how-to-change-default-settings)
