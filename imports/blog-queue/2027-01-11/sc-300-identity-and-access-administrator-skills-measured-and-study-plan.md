---
title: "SC-300 Identity and Access Administrator: Skills Measured and Study Plan"
summary: "The SC-300 skills outline with four skill areas and their percentage weights, the sub-skills in the Microsoft study guide, change notes, scoring, practice assessment and a study plan built on the outline. No exam questions."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [sc-300]
keypoints:
  - "The study guide lists skills as of October 28, 2026. The page footer shows Last updated on 2026-08-30, and no retirement notice appears on the page."
  - "Four areas: user identities 20-25%, authentication and access management 25-30%, workload identities 20-25%, identity governance 20-25%."
  - "The authentication area includes Global Secure Access, Conditional Access, ID Protection and Windows Hello for Business. Governance covers entitlement management, access reviews and PIM."
  - "A score of 700 or greater is required to pass. Learn recommends the new Practice Assessment on AI Skills Navigator."
  - "Changes in the October 28, 2026 version are marked Minor for user authentication, Global Secure Access and privileged access."
faq:
  - q: "What are the SC-300 skill areas and weights?"
    a: "Implement and manage user identities 20-25%, implement authentication and access management 25-30%, plan and implement workload identities 20-25%, plan and automate identity governance 20-25%."
  - q: "Which version of the skills does the guide show?"
    a: "Skills measured as of October 28, 2026. The page footer shows Last updated on 2026-08-30."
  - q: "What changed in the latest version?"
    a: "The change log marks three areas as Minor: Microsoft Entra user authentication, Global Secure Access and privileged access. Other areas are marked No change."
  - q: "What score do I need?"
    a: "A score of 700 or greater is required to pass."
  - q: "How do I renew the certification?"
    a: "Associate, expert and specialty certifications expire annually. You renew by passing a free online assessment on Microsoft Learn."
---

SC-300 covers identity and access administration with Microsoft Entra. This guide summarizes the skills outline from the Microsoft study guide. It contains no exam questions and no claims beyond the published outline.

## About the guide

- Skills measured as of October 28, 2026.
- The page footer shows Last updated on 2026-08-30.
- No retirement notice appears on the page.
- The audience profile is an identity and access administrator who designs, implements and operates identity and access management with Microsoft Entra and applies Zero Trust principles. Candidates should know Azure, Microsoft 365, AD DS, PowerShell and KQL.

## Skills at a glance

| Area | Weight |
| --- | --- |
| Implement and manage user identities | 20-25% |
| Implement authentication and access management | 25-30% |
| Plan and implement workload identities | 20-25% |
| Plan and automate identity governance | 20-25% |

## User identities (20-25%)

- **Tenant:** built-in and custom roles, administrative units, effective permissions, domains, company branding, tenant, user, group and device settings.
- **Identities:** users, groups, custom security attributes, bulk operations in the admin center and PowerShell, device join and registration, licenses.
- **External users and tenants:** external collaboration settings, invitations, cross-tenant access settings and synchronization, external identity providers with SAML and WS-Fed.
- **Hybrid identity:** Entra Connect Sync, Cloud Sync, password hash synchronization, pass-through authentication, seamless SSO, migration from AD FS, Connect Health.

## Authentication and access management (25-30%)

- **Authentication:** planning, authentication methods including certificate-based authentication, Temporary Access Pass, Microsoft Authenticator and passkeys, tenant-wide MFA, SSPR, Windows Hello for Business, disabling accounts and revoking sessions, password protection, Kerberos for hybrid identities.
- **Conditional Access:** planning, assignments, controls, testing and troubleshooting, session management, device-enforced restrictions, continuous access evaluation, authentication context, protected actions, templates.
- **ID Protection:** user risk, sign-in risk, MFA registration campaigns, investigating risky users, sign-ins and workload identities.
- **Global Secure Access:** clients, Private Access, Internet Access and the Microsoft traffic profile for Microsoft 365.

## Workload identities (20-25%)

- **Applications and Azure workloads:** choosing between managed identities, service principals, user accounts and managed service accounts, and creating and assigning managed identities.
- **Enterprise applications:** settings, roles, Application Proxy, SaaS integration, users, groups and app roles, consent, application collections.
- **App registrations:** planning, creating, authentication, API permissions, app roles.
- **Defender for Cloud Apps:** cloud discovery, connected apps, app-enforced restrictions, Conditional Access app control, access and session policies, OAuth app policies, the cloud app catalog.

## Identity governance (20-25%)

- **Entitlement management:** catalogs, access packages, requests, terms of use, external user lifecycle, connected organizations.
- **Access reviews:** planning, creating, monitoring and responding.
- **Privileged access:** PIM for Entra roles, Azure resources and groups, requests and approvals, audit history, emergency access accounts.
- **Monitoring:** sign-in, audit and provisioning logs, diagnostic settings with Log Analytics, storage and Event Hubs, KQL queries, workbooks, Identity Secure Score.

## Change notes

Compared with the version before October 28, 2026, the change log marks user authentication, Global Secure Access and privileged access as Minor. The audience profile and the other groups are marked No change.

## Scoring and resources

A score of 700 or greater is required to pass. Most questions cover generally available features, and Preview features may appear. English is updated first and localized versions follow about eight weeks later. The new Practice Assessment is on AI Skills Navigator. The legacy assessment is no longer updated. Certifications renew annually through a free online assessment.

## A study plan

This plan is practical advice built on the weights.

1. Start with authentication and access management, the largest area at 25-30%.
2. Build a test tenant and practice Conditional Access, authentication methods and ID Protection.
3. Cover workload identities and app registrations with hands-on labs.
4. Work through governance, especially PIM and access reviews.
5. Take the practice assessment and revisit weak areas.

## Typical mistakes

- Studying with material for the skills before October 28, 2026.
- Skipping Global Secure Access, which the outline lists in the authentication area.
- Reading only about portals and skipping PowerShell and KQL.
- Not checking the guide again before the exam date.

## Related

- [SC-300](https://www.m365.fm/entity/sc-300/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)

## Sources

- [Study guide for Exam SC-300 (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/sc-300)
