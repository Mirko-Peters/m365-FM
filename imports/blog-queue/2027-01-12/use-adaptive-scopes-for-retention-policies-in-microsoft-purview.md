---
title: "How to Use Adaptive Scopes for Retention Policies in Microsoft Purview"
summary: "Adaptive scopes give retention and other Purview policies dynamic, query-based membership: scope types, builders and operators, limits, roles, creation path, query timing, validation with PowerShell and viewing membership, plus the gaps in the Learn page."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [retention-policies, microsoft-purview-data-lifecycle-management]
keypoints:
  - "Adaptive scopes are dynamic, query-based memberships used by retention, communication compliance and auto-labeling policies. The query runs once daily."
  - "Scope types are Users, SharePoint sites and Microsoft 365 Groups. Records Center sites (legacy) are not supported."
  - "Create under Microsoft Purview portal > Settings > Roles and scopes > Adaptive scopes > Create scope. Queries can take up to five days to fully populate."
  - "Typed attribute values are not validated at entry. Validate advanced queries with PowerShell (users, groups) or SharePoint search (sites)."
  - "The page gives no retention policy UI path, no per-tenant policy limit and no licensing statement beyond a link to the service description."
faq:
  - q: "What is an adaptive scope?"
    a: "A dynamic, query-based membership that you can use in retention, communication compliance and auto-labeling policies. The query runs once a day, so membership follows changes in the directory or on sites."
  - q: "Which scope types exist?"
    a: "Users, SharePoint sites and Microsoft 365 Groups. A User scope covers mailboxes, OneDrive accounts, Teams chats and Copilot interactions, among others."
  - q: "Who can create adaptive scopes?"
    a: "Members of a role group that holds the Scope Manager role, such as Compliance Administrator, Compliance Data Administrator, Organization Management, Records Management, Communication Compliance and Communication Compliance Admins."
  - q: "How long until a scope is populated?"
    a: "Learn says queries can take up to five days to fully populate."
  - q: "How do I check which members a scope has?"
    a: "Open the scope, select Details > Scope details and review the State column (Added or Removed). You can export to CSV, or use Get-AdaptiveScopeMembers for 1,000 or more members."
---

A static retention policy covers locations you pick. An adaptive scope instead selects users, sites or groups by a query, so the policy follows changes automatically. This guide follows the Microsoft Learn page on adaptive scopes. The page covers the scope itself well and says little about the retention policy wizard.

## What an adaptive scope is

Adaptive scopes use queries that you define. Membership is dynamic. The query runs once a day. They can be used in communication compliance, retention and auto-labeling policies. A single policy can have one or many adaptive scopes. The page lists these advantages: no limit on the number of items per policy (the maximum number of policies per tenant still applies), more targeted policies without maintaining groups, resilience against business changes that group membership does not reflect, one policy that can cover both Teams and Viva Engage, and support for Microsoft Entra administrative units.

## Scope types

- **Users.** Covers mailboxes, OneDrive accounts, Teams chats, Copilot interactions and other locations.
- **SharePoint sites.** Attributes include Site URL, name, template and RefinableString00 to RefinableString99.
- **Microsoft 365 Groups.**

Records Center sites (legacy) are not supported. For communication compliance policies, SharePoint sites and OneDrive accounts are not supported.

## Query builders

- **Simple builder.** Operators are is equal to, is not equal to, starts with and not starts with.
- **Advanced builder.** OPATH for users and groups, with operators such as and, or, not, eq, ne, lt, gt, like and notlike. KeyQL for sites, with templates such as SITEPAGEPUBLISHING, GROUP, TEAMCHANNEL, STS and SPSPERS.
- **Inactive mailboxes** need the advanced builder, for example `(IsInactiveMailbox -eq "False")` or `"True"`.

## Limits on the page

| Item | Limit |
| --- | --- |
| Scopes per policy | No limit. The per-tenant policy maximum still applies and is not quantified |
| String length | 200 |
| Attributes per group and groups | 10 attributes per group, 10 groups |
| Advanced query | 10,000 characters |
| Attributes per scope | 100 |
| Sites per auto-labeling policy | 50,000 |
| Added and removed members shown in details | 1,000,000 (a scope can apply to more members) |

## Roles

You need a role group that holds the Scope Manager role: Compliance Administrator, Compliance Data Administrator, Organization Management, Records Management, Communication Compliance or Communication Compliance Admins.

## Create a scope

1. In the Microsoft Purview portal go to **Settings** > **Roles and scopes** > **Adaptive scopes** > **Create scope**.
2. Choose an administrative unit or the default Full directory. If your account is assigned administrative units, you must select one. Administrative units do not yet support SharePoint sites, so you cannot create a SharePoint sites scope with one.
3. Choose the scope type, then the attributes or properties, or the advanced builder.
4. When you create the policy, select the adaptive scopes you want.

## Timing

Queries can take up to five days to fully populate, and changes are not immediate. The page advises waiting a few days before you add a newly created scope to a policy. The portal does not validate values you type, because the query does not run immediately.

## Validate a query

- Users: `Get-Recipient -RecipientTypeDetails UserMailbox,MailUser -Filter {Department -eq "Marketing"} -ResultSize Unlimited`
- Groups: `Get-Mailbox -RecipientTypeDetails GroupMailbox -Filter {CustomAttribute15 -eq "Marketing"} -ResultSize Unlimited`. Get-Mailbox does not support MailUser.
- SharePoint KeyQL: with an account that has the SharePoint admin role, test at `https://<tenant>.sharepoint.com/search`.

The page adds that the PowerShell output can differ from the member list in Scope details, which includes arbitration mailboxes. A higher count than expected can come from users without a valid license for adaptive scopes. A query on EmailAddresses generally needs the smtp: prefix.

## View membership

Open the scope, then **Details** > **Scope details**. The State column shows Added or Removed. Select **Export** for a CSV. For 1,000 or more members use `Get-AdaptiveScopeMembers`.

## What the page does not say

- The retention policy UI path. It says only to select scopes when you create the policy.
- The per-tenant policy limit.
- Details on retention label policies. The page only links to the retention article.
- A licensing statement. The page only links the Microsoft Purview service description.

## A rollout outline

This outline is my advice, built on the page.

1. Pick a stable attribute, such as a department field that the directory maintains.
2. Build the query, then validate it with PowerShell before you rely on it.
3. Check Scope details for the Added and Removed states.
4. Allow time for the query to populate before you judge the result.
5. Attach the scope to the policy and review membership again later.

## Typical mistakes (my advice)

- Mistyping an attribute value, since the portal does not validate it.
- Expecting immediate membership, when population can take up to five days.
- Using the simple builder for inactive mailboxes.
- Using Get-Mailbox to validate a MailUser query.

## Quick reference

| Scope type | Where the query looks | Advanced language |
| --- | --- | --- |
| Users | Mailboxes, OneDrive accounts, Teams chats, Copilot interactions and more | OPATH |
| SharePoint sites | Site URL, name, template, RefinableString00 to 99 | KeyQL |
| Microsoft 365 Groups | Group properties | OPATH |

The query runs once a day, and the portal does not validate typed values.

## Choosing a builder

This section is my advice. Start with the simple builder when one attribute and one of the four operators are enough. Move to the advanced builder when you need and, or, not, comparison or like operators, or when you need inactive mailboxes. Keep the advanced query well below the 10,000 character limit and test it with PowerShell or SharePoint search first.

## Related

- [Retention policies](https://www.m365.fm/entity/retention-policies/)
- [Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Adaptive scopes (Microsoft Learn)](https://learn.microsoft.com/purview/purview-adaptive-scopes)
