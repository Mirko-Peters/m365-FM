---
title: "Microsoft Entra ID Free vs P1 vs P2 vs ID Governance: Licensing Compared"
summary: "Which Entra edition covers which feature, from the Learn licensing page: MFA and SSPR options, Conditional Access, risk-based policies, PIM, access reviews, entitlement management, lifecycle workflows, logs, and what happens when a license expires."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [entra-id, microsoft-entra-id-p2, entra-id-governance, conditional-access, privileged-identity-management, microsoft-entra-id-protection]
keypoints:
  - "Entra ID Free comes with Microsoft cloud subscriptions. P1 is standalone or in plans such as Microsoft 365 E3, E5 and E7 and Business Premium. P2 is in E5 and E7 among others."
  - "Conditional Access needs P1. Risk-based Conditional Access and ID Protection risk policies need P2."
  - "PIM needs Entra ID P2 or Entra ID Governance licenses for eligible users, approvers and reviewers."
  - "Entitlement management, access reviews and lifecycle workflows need Entra ID Governance for member users. Some capabilities also work with P2."
  - "When Conditional Access licenses expire, policies are not disabled or deleted. They can be viewed and deleted but no longer updated."
faq:
  - q: "What do I need for Conditional Access?"
    a: "The Learn licensing page says Conditional Access requires Microsoft Entra ID P1 licenses. Microsoft 365 Business Premium customers also have access. Risk-based policies need Microsoft Entra ID Protection, which is a P2 feature. Security defaults are available for all customers."
  - q: "What happens when the license for Conditional Access expires?"
    a: "The page says policies are not automatically disabled or deleted, so customers can migrate away without a sudden change in security posture. Remaining policies can be viewed and deleted, but no longer updated."
  - q: "Do I need P2 or ID Governance for PIM?"
    a: "Either one. The page says you need Microsoft Entra ID Governance or Entra ID P2 licenses to use PIM and all of its settings, for users with eligible or time-bound assignments, users who approve or reject activations, users assigned to an access review and users who perform reviews."
  - q: "Which edition gives me self-service password reset with writeback?"
    a: "In the authentication table on the page, SSPR is marked for the Free security defaults column, the Global Administrators only column, Office 365, P1 and P2. SSPR with writeback is marked for P1 and P2 only."
  - q: "What is in the Entra Suite?"
    a: "The page lists five products: Microsoft Entra Private Access, Internet Access, ID Governance, ID Protection and Verified ID premium capabilities. It requires Entra ID P1 or a package that includes it, and is available standalone or included in Microsoft 365 E7."
---

Microsoft Entra licensing is spread over editions, add-ons and suites, and the question that comes up in every project is which edition covers which feature. This article condenses the Microsoft Learn licensing page. It does not list prices. The page itself says its options are not comprehensive and points to the Microsoft Entra pricing page for details, so check there before a purchase. Where I add my own advice, I mark it.

## The editions on the page

- **Microsoft Entra ID Free:** included with Microsoft cloud subscriptions such as Microsoft Azure and Microsoft 365.
- **Microsoft Entra ID P1:** standalone, and included in Microsoft 365 E3, E5 and E7, Microsoft 365 F1 and F3, and Enterprise Mobility + Security E3. Also in Microsoft 365 Business Premium for small and medium businesses.
- **Microsoft Entra ID P2:** standalone, and included in Microsoft 365 E5 and E7, Microsoft Defender Suite (formerly Microsoft 365 E5 Security), the Defender Suite FLW and Defender + Purview Suite FLW plans, and Enterprise Mobility + Security E5. Also in the Defender and Purview suites for Business Premium.
- **Microsoft Entra Suite:** five products: Private Access, Internet Access, ID Governance, ID Protection, and Verified ID premium capabilities. It requires Entra ID P1 or a package that includes it, and is available standalone or in Microsoft 365 E7.
- **Microsoft Entra ID Governance:** the governance feature set, also included in the Entra Suite and in Microsoft 365 E7.

User and group license assignments are managed in the Microsoft 365 admin center.

## Authentication and password reset

The page compares the Free tier with security defaults, the Free tier for Global Administrators only, Office 365, P1 and P2. Highlights from its table:

| Feature | Free, security defaults | Free, Global Admins only | Office 365 | P1 | P2 |
| --- | --- | --- | --- | --- | --- |
| MFA for tenant admin accounts | Yes | Yes (Global Administrators only) | Yes | Yes | Yes |
| Phone call as second factor | No | No | Yes | Yes | Yes |
| SMS as second factor | No | Yes | Yes | Yes | Yes |
| Fraud alert, MFA reports, trusted IPs | No | No | No | Yes | Yes |
| MFA for on-premises applications | No | No | No | Yes | Yes |
| Conditional Access | No | No | No | Yes | Yes |
| Risk-based Conditional Access | No | No | No | No | Yes |
| SSPR | Yes | Yes | Yes | Yes | Yes |
| SSPR with writeback | No | No | No | Yes | Yes |

One caveat from the page: although Free provides security defaults with MFA, only Microsoft Authenticator can be used for the prompt there, including text and voice calls. That can be a limit if you cannot be sure that Authenticator is installed on a user's personal device. Microsoft 365 E7 includes the Entra Suite, which gives all P2 authentication features in the table.

The Learn tutorial for enabling SSPR says a tenant needs at least a Microsoft Entra ID P1 license for password reset, while this table marks SSPR in every column. The two statements differ. The tutorial links a separate article on licensing requirements for SSPR, so check that article for the exact cases before you plan (my advice).

## Conditional Access

The page says Conditional Access requires Entra ID P1. The Entra Suite and Microsoft 365 E7 include it, and Business Premium customers have access too. Risk-based policies need ID Protection, which is a P2 feature. Conditional Access for agents requires a Microsoft Agent 365 license. Security defaults are available for all customers.

When the licenses for Conditional Access expire, policies are not disabled or deleted, so you can migrate without a sudden change of security posture. Remaining policies can be viewed and deleted but not updated.

## ID Protection

ID Protection requires P2. The page has a capability table: risk policies and MFA registration policy need P2, and the Risky users and Risky sign-ins reports show only limited information on Free and P1. Risk detections show limited information on P1 and nothing on Free. Notifications such as users at risk alerts and the weekly digest are P2.

## Privileged Identity Management

You need Entra ID Governance or Entra ID P2 licenses to use PIM and all its settings. The page lists the users who need a license:

- Users with eligible or time-bound assignments to Entra ID or Azure roles managed with PIM.
- Users with eligible or time-bound assignments as members or owners of PIM for Groups.
- Users who can approve or reject activation requests.
- Users assigned to an access review, and users who perform reviews.

Its examples: five administrators made eligible need five licenses. 14 eligible administrators plus three approvers need 17.

If a P2, Governance or trial license expires, PIM features are no longer available: permanent role assignments are unaffected, but eligible assignments of Entra roles are removed, ongoing access reviews of roles end, PIM settings are removed and PIM stops sending emails.

## Identity governance features

The page has a long matrix. In short:

- **Provisioning:** automated user provisioning to SaaS apps is marked for all editions including Free. HR-driven and API-driven provisioning, group provisioning and on-premises app provisioning are P1 and up. Account Discovery and cross-tenant sync for groups need Governance.
- **Access reviews:** the capabilities that were generally available in P2 are in P2, Governance and the Suite. Items such as machine learning assisted reviews, catalog access reviews and reviews scoped to inactive users without active users are marked for Governance and the Suite. Reviews of active and inactive users with decision helpers for inactive users are also marked for P2.
- **Entitlement management:** core capabilities that were in P2 stay in P2. Auto assignment policies, custom extensions with Logic Apps, Verified ID integration, ID Protection integration and sponsors from the assignee's user profile as approvers are Governance. Internal and external sponsors from connected organizations as approvers are also marked for P2.
- **Lifecycle Workflows:** Governance and the Suite. The page says you can create up to 50 workflows and up to 100 custom task extensions.
- **My Access portal:** P2, Governance and the Suite.

For counting licenses, the page says entitlement management needs licenses for member users who can request the access packages, not only those who do. Its example: 2,000 employees who can request, 2,000 licenses. For access reviews, it counts the member users in the review plus reviewers who are not already counted.

## Monitoring and other features

| Capability | Free | P1 or P2 or Suite |
| --- | --- | --- |
| Audit logs | Yes | Yes |
| Sign-in logs | Yes | Yes |
| Provisioning logs | No | Yes |
| Microsoft Graph activity logs | No | Yes |
| Health | No | Yes |
| Usage and insights | No | Yes |

Other points from the page: application proxy needs P1 or P2. Entra Connect is free. Entra Connect Health needs P1. Managed identities have no licensing requirement. Custom roles need P1 for each user with a custom role assignment, and built-in roles are free. Administrative units need P1 for each administrator over the unit's scope and Free for members, unless dynamic membership rules are used, which need P1 for each member. Verified ID is included with any Entra subscription, and Face Check is a premium add-on, included in the Entra Suite.

## Choosing an edition (my advice)

This is my suggestion, not guidance from the page:

1. Start from the features you must have, not from the edition names. Write the list, then mark each item in the page's tables.
2. Check what you already own. P1 is inside several Microsoft 365 plans, so a separate P1 purchase may be unnecessary.
3. If the list contains Conditional Access with sign-in risk, or PIM, plan for P2 or the E5 level for the users concerned.
4. For governance, count licenses by the page's examples before you ask for budget, since the count follows who can request or review, not only who does.
5. For a license that will expire, plan the exit first. The page's behavior for Conditional Access and PIM is different, and PIM loses eligible assignments.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra ID P2](https://www.m365.fm/entity/microsoft-entra-id-p2/)
- [Microsoft Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra Privileged Identity Management (PIM)](https://www.m365.fm/entity/privileged-identity-management/)
- [Microsoft Entra ID Protection](https://www.m365.fm/entity/microsoft-entra-id-protection/)

## Sources

- [Microsoft Entra licensing (Microsoft Learn)](https://learn.microsoft.com/entra/fundamentals/licensing)
