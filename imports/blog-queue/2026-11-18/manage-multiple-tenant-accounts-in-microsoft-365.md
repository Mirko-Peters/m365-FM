---
title: "How to Manage Multiple Tenant Accounts in Microsoft 365: Users and Admins"
summary: "Work with several Microsoft 365 tenants: switch organizations in Teams, understand guest versus member access, use the tenant switcher in the admin center, and decide when a multitenant organization is worth setting up."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [microsoft-entra-tenant-governance, cross-tenant-access-settings, microsoft-365-admin-center, teams]
keypoints:
  - "Each Microsoft 365 work account belongs to one tenant. Access to another organization usually means a guest account in that tenant."
  - "In Teams, select your profile picture to see your organizations and switch. Teams reloads, and it does not show notifications from organizations you are not actively in."
  - "Admins who govern several tenants use the Tenants page in the Microsoft 365 admin center and the tenant switcher in the command bar."
  - "A multitenant organization needs Microsoft Entra ID P1 or above in all tenants, supports up to 100 tenants and relies on the new Teams desktop client."
  - "Synchronized users in a multitenant organization are B2B users with a member type, and they can take up to seven days to appear in search."
faq:
  - q: "How do I switch between organizations in Teams?"
    a: "A Microsoft Tech Community article describes selecting your profile picture on desktop, reviewing the list of organizations under your name and choosing one, after which Teams reloads in that environment. On mobile you tap your profile picture and the dropdown arrow under your name."
  - q: "Why do I miss notifications from my other organization?"
    a: "The same Microsoft article says Teams does not show notifications from organizations you are not actively in, so you should check the Activity feed in each. On mobile you can enable notifications for all organizations under Settings, Notifications, Accounts."
  - q: "How does an admin switch between tenants in the Microsoft 365 admin center?"
    a: "According to Microsoft Learn, sign in with an account in the governing tenant, select Tenants in the left navigation, or use the tenant switcher next to the current tenant name in the command bar. This is for partners using Partner Center and GDAP, and for enterprise IT using Microsoft Entra Tenant Governance."
  - q: "What do I need for a multitenant organization in Microsoft 365?"
    a: "Microsoft Learn lists Microsoft Entra ID P1 licenses or above in all tenants, a global administrator in the owner tenant and in each member tenant, external access configured for chats and calls between tenants, and the new Teams desktop client. A maximum of 100 tenants is supported."
  - q: "Is a multitenant organization the same as B2B guest access?"
    a: "No. Microsoft Learn says it is a layer on top of B2B collaboration for tenants your organization owns. It assumes high trust, and synchronized users are typically provisioned as members rather than guests, while ordinary B2B collaboration is described as low to mid trust."
---

Managing multiple tenant accounts means two different jobs. A user who belongs to several organizations needs a clean way to switch and not miss messages. An admin who looks after several tenants needs one place to see and manage them. Microsoft has separate tools for each, and a third option, the multitenant organization, for tenants that belong to one company.

## Understand the basics: one account, one tenant

A Microsoft Tech Community article on this topic puts it simply: each Microsoft 365 account is tied to one organization, or tenant. When you are added to another organization's Teams environment, you are technically a guest there. That is why you switch organizations instead of signing in twice.

## For users: switch organizations in Teams

**Desktop**

1. Open Teams.
2. Select your profile picture in the top-right area.
3. Under your name, review the list of organizations.
4. Select the organization you want. Teams reloads in that environment.

**Mobile**

1. Tap your profile picture in the top-left area.
2. Tap the dropdown arrow under your name.
3. Select the organization.

Switching refreshes Teams, so expect a few seconds of delay. Microsoft's article says Teams does not show notifications from organizations you are not actively in. After switching, check the **Activity** feed in each. On mobile, enable notifications for all organizations under **Settings** > **Notifications** > **Accounts**.

To remove access to a tenant you no longer use, the article points to `myaccount.microsoft.com/organizations`.

A reader comment on that article says a warning triangle beside an organization name usually means you are not signed in to that tenant, so you will not receive its notifications. That comment is not part of the article text, so verify it in your own client.

## For admins: the Tenants page and tenant switcher

Microsoft Learn describes multitenant management in the Microsoft 365 admin center for two groups: partners and managed service providers that administer customer tenants through Partner Center, and central IT teams that administer subsidiaries, regions or business units through Microsoft Entra Tenant Governance.

Prerequisites:

- A supported tenant relationship. Partners use a customer relationship and Granular Delegated Admin Privileges (GDAP). Enterprises use a directional governance relationship in Entra Tenant Governance, established pairwise for each tenant.
- A suitable delegated role in each governed tenant. Pages and actions can differ if role assignments differ between tenants.
- The least-privileged role that completes the task.

To work with several tenants:

1. Sign in to the Microsoft 365 admin center with an account in the governing tenant.
2. In the left navigation, select **Tenants**.
3. To work inside one tenant, use the tenant switcher next to the current tenant name in the command bar, select an eligible tenant and confirm.

Switching keeps the signed-in administrator's identity and delegated access, and you can return to the governing tenant afterward. Microsoft's page does not state a maximum number of tenants for this feature.

## When tenants belong to one company: multitenant organization

If your company runs several tenants, a multitenant organization in Microsoft 365 can improve collaboration. Microsoft Entra describes it as a boundary around the tenants your organization owns, with each pair of tenants governed by cross-tenant access settings.

| Topic | What Microsoft states |
|---|---|
| Roles | A global administrator in the owner tenant creates it and invites members. A global administrator in each member tenant joins. |
| License | Microsoft Entra ID P1 or above in all tenants |
| Size | Up to 100 tenants. More requires contacting Microsoft support. |
| Teams | External access must be configured for each tenant and allow all tenant domains. New Teams desktop client recommended for the best experience. |
| Not supported | Teams on the web, Teams Rooms and VDI/AVD. On mobile, switching tenants and granting notification permission are not supported. |
| Not available | Microsoft 365 operated by 21Vianet |
| Timing | Synchronized users can take up to seven days to appear in search |

Synchronized users are provisioned as B2B collaboration users with the member type rather than guest, which Teams requires for this scenario. The admin center syncs the same users to all tenants, and syncing different users to different tenants must be configured in Microsoft Entra ID. Microsoft recommends starting with a small set of users.

How it differs from regular B2B collaboration, per Microsoft's comparison: B2B collaboration is for access to external tenants, usually with limited guest privileges and low to mid trust. A multitenant organization assumes high trust within one organization.

## Which approach fits your case

- **You work with a few outside organizations as a guest:** use the Teams organization switcher and check the Activity feed in each.
- **You administer customer tenants as a partner:** use the Tenants page with GDAP relationships from Partner Center.
- **You administer subsidiaries or business units of one company:** use the Tenants page with Entra Tenant Governance, and consider a multitenant organization if users need smoother collaboration across those tenants.

These map directly to the audiences Microsoft names on each page. The pages read do not recommend one approach over another beyond that.

## Common mistakes

- Expecting notifications from a tenant you have not opened recently.
- Setting up a multitenant organization without Entra ID P1 in every tenant.
- Forgetting external access for chats and calls between the tenants.
- Using Global Administrator everywhere when a narrower delegated role would do.
- Relying on mobile or Teams on the web for a multitenant organization setup, which Microsoft lists as unsupported.

## Related

- [Microsoft Entra Tenant Governance](https://www.m365.fm/entity/microsoft-entra-tenant-governance/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Multi-tenant management in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/multi-tenant/manage)
- [Multitenant organization in Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/enterprise/plan-multi-tenant-org-overview)
- [What is a multitenant organization in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/multi-tenant-organizations/overview)
- [How to switch between multiple organizations in Microsoft Teams (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/nonprofittechies/how-to-switch-between-multiple-organizations-in-microsoft-teams/4426537)
