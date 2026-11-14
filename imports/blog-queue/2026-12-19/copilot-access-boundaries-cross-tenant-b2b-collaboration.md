---
title: "Microsoft 365 Copilot in Cross-Tenant B2B Collaboration: Which Access Boundaries Microsoft Documents"
summary: "What Microsoft Learn says about Copilot with B2B members and guests: permission-based grounding, the Allow Copilot for B2B members Teams setting, cross-tenant access settings and the gaps the documentation leaves open."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [copilot, cross-tenant-access-settings, b2b-collaboration]
keypoints:
  - "Copilot only surfaces organizational data a user has at least view permission to. That includes access given to outside users through inter-tenant collaboration such as Teams shared channels."
  - "For Teams, Learn documents B2B member access to Copilot in multitenant organizations. It is not available to external or federated users, and both tenants must allow access in both directions."
  - "The Teams setting Allow Copilot for B2B members is on by default and sits under Users > B2B member access in the Teams admin center."
  - "Cross-tenant access settings scope inbound and outbound B2B collaboration by user, group and application. They need Microsoft Entra ID P1 for scoping and trust settings."
  - "The Learn pages read do not state whether B2B guests can be licensed for Copilot. Verify this in your own tenant before promising anything."
faq:
  - q: "Does Copilot show data from another tenant?"
    a: "Learn says Copilot presents only data that each individual can access using the same controls as other Microsoft 365 services, and that the permission model helps prevent leaks between users, groups and tenants. The page does not describe specific guest scenarios."
  - q: "Can B2B members use Copilot in Teams meetings of another organization?"
    a: "Learn says Microsoft supports B2B member access to Copilot in Teams for licensed users in multitenant organizations. It is available only to B2B members within the multitenant organization, not to external or federated users, and both organizations must allow access to and from each other."
  - q: "How do I turn Copilot for B2B members off?"
    a: "In the Teams admin center, expand Users, select B2B member access, open a policy and switch Allow Copilot for B2B members to Off, then save. Learn also documents Set-CsTeamsMultiTenantOrganizationConfiguration with the CopilotFromHomeTenant parameter."
  - q: "Can a B2B guest account get a Microsoft 365 Copilot license?"
    a: "The Learn requirement pages read do not say. A moderator answer in Microsoft Q&A states that licenses cannot be assigned to B2B guests, but it cites no documentation, so treat it as unverified community input."
  - q: "Which Entra settings control what external users can reach?"
    a: "Learn describes cross-tenant access settings with inbound and outbound controls for B2B collaboration, scoped to users, groups and applications, plus trust settings for MFA, compliant device and Entra hybrid joined claims. External collaboration settings separately limit who can invite and which domains are allowed."
---

Microsoft documents Copilot's boundaries for cross-tenant work in three separate places, and none of them is a single guide for B2B. Copilot itself follows the permissions of the signed-in user. Teams has a specific setting for B2B members in multitenant organizations. Microsoft Entra cross-tenant access settings decide what external users can reach in the first place. This article joins those parts and states where the documentation stops.

## Rule 1: Copilot follows existing permissions

Learn says Copilot only surfaces organizational data to which individual users have at least view permissions. It names permissions given to outside users through inter-tenant collaboration, such as shared channels in Microsoft Teams, as part of that model. It also says the tenant permission model helps ensure data does not unintentionally leak between users, groups and tenants, and that grounding only accesses content the current user is authorized to see.

The practical consequence: Copilot does not add a second layer of access control. If a guest or external member can reach a SharePoint site, a Teams channel or a file, that content is within what Copilot can use for that person, as far as the user has Copilot at all. Oversharing in the resource tenant is therefore the first thing to fix. Learn's security page makes the same point: overshared or poorly governed content can affect Copilot results.

## Rule 2: Check who has Copilot at all

The Copilot requirements page says users must have a work or school account in Microsoft Entra ID, and that Copilot needs a license plus a qualifying prerequisite license. The page does not mention guests, B2B or cross-tenant scenarios.

A Microsoft Q&A thread asks whether B2B guests can be assigned Copilot licenses. The accepted answer says no, and suggests member accounts or using Copilot from the user's own licensed tenant. The answer cites no documentation, and it is community content, not official guidance. Check license assignment for a test guest in your own tenant before you design around it.

## Rule 3: Teams has a B2B member setting

For Teams, Learn documents support for B2B member access to Copilot for licensed users in multitenant organizations. The key statements:

- It is only available to B2B members within the multitenant organization. It is not available to external or federated users.
- B2B members collaborate through Microsoft Entra External ID B2B collaboration with member-level access.
- Access is possible only when both organizations allow access to and from each other. You need to coordinate with the other organization's admin.
- The example features are AI-generated summaries in chats and suggested action items after a meeting.

The related admin setting is **Allow Copilot for B2B members**. It is on by default. When on, external members with Copilot licenses can use Copilot when they join meetings hosted by your organization.

To change it:

1. Sign in to the Teams admin center.
2. Expand **Users** and select **B2B member access**.
3. Select an existing policy or create a new one.
4. Switch **Allow Copilot for B2B members** to **On** or **Off**.
5. Select **Save**.

With PowerShell, `Get-CsTeamsMultiTenantOrganizationConfiguration` reads the configuration. `Set-CsTeamsMultiTenantOrganizationConfiguration -Identity Global -CopilotFromHomeTenant Disabled` turns it off, and `Enabled` turns it back on.

The page is internally unclear on scope. The introduction mentions Team channels and meetings, while the setting description mentions meetings hosted by your organization. The page does not reconcile the two, and it does not describe license SKUs or data handling.

## Rule 4: Entra decides what externals can reach

Cross-tenant access settings sit before everything else. According to Learn:

- **Inbound** settings control whether users from external Entra organizations can access your resources. **Outbound** settings control whether your users can access resources in an external organization. Both can be scoped to everyone or to specific users, groups and applications.
- By default, B2B collaboration is enabled for all internal users, MFA and device claims from other tenants are not trusted, and B2B direct connect is blocked.
- Organizational settings take precedence over defaults.
- **Trust settings** let your Conditional Access policies accept MFA, compliant device or Entra hybrid joined claims that external users already satisfied in their home tenants.
- Scoping by users, groups and applications, trust settings and redemption order changes need Microsoft Entra ID P1. Direct connect needs P1 in both tenants.
- Configuring them needs at least the Security Administrator role.
- Conflicting settings are not allowed. Changing defaults to block access can block existing business-critical access.

External collaboration settings are separate. They limit who can invite external users, allow or block domains and restrict guest access.

## A short review routine

1. List the organizations with organizational settings under cross-tenant access, and note which inbound B2B collaboration rules apply to them.
2. Decide whether partner tenants should be trusted for MFA and compliant device claims, and test with Conditional Access report-only before enforcing.
3. Review which sites, teams and channels external users can reach. Remove access that is no longer needed, since Copilot inherits it.
4. Confirm in the Teams admin center whether **Allow Copilot for B2B members** matches your policy.
5. Test with a real guest and a real B2B member account, and write down what each can and cannot do with Copilot. The Learn pages read do not cover this level of detail.

## What the documentation does not say

The pages read for this article do not describe guest licensing for Copilot, do not list which Copilot experiences work for B2B guests outside Teams, and do not explain how Copilot treats content from another tenant's shared resources beyond the permission statements above. Anything beyond that needs your own test results.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [Microsoft Entra B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft 365 Copilot privacy and data protection (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-privacy)
- [Copilot for B2B members in multitenant organizations (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/copilot-mto)
- [Cross-tenant access overview (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview)
- [Microsoft 365 Copilot requirements (Microsoft Learn)](https://learn.microsoft.com/en-us/copilot/plan/microsoft-copilot-requirements)
- [Microsoft 365 Copilot security (Microsoft Learn)](https://learn.microsoft.com/en-us/copilot/plan/security-microsoft-copilot)
- [Can external B2B guest accounts be assigned a Copilot license (Microsoft Q&A, community answer)](https://learn.microsoft.com/en-us/answers/questions/5847621/can-external-b2b-guest-accounts-be-assigned-a-copi)
