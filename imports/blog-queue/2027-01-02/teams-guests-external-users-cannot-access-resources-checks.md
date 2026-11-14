---
title: "Teams Guests and External Users Cannot Access Resources: Checks Across Entra, Teams and SharePoint"
summary: "A layered checklist for Teams guests who cannot access a team or files: Entra external collaboration, Teams guest access, Microsoft 365 Groups, SharePoint sharing and invitation rules."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [teams, entra-external-id]
keypoints:
  - "Guest access works only when each layer allows it: Microsoft Entra, the Teams admin center, Microsoft 365 Groups and SharePoint."
  - "Teams guest access must be On. Learn says changes in the Teams admin center can take up to 24 hours to take effect."
  - "SharePoint site sharing cannot be more permissive than the organization-level setting, so check both levels."
  - "Guests with a work or school account must be invited by UPN. Learn says other email formats are not supported."
  - "The Learn checklist page is archived and retired. Microsoft points to shared channels as a simpler external collaboration option."
faq:
  - q: "Why can a guest see the team but not the files?"
    a: "Microsoft Learn's checklist says SharePoint external sharing must be set to Anyone or New and existing guests at the organization level, and at the site level for the team's site. The site setting cannot exceed the organization setting. Also check that Let guest group members access group content is selected in Microsoft 365 Groups settings."
  - q: "Where is guest access switched on in Teams?"
    a: "Learn lists the Teams admin center path Users > Guest access, where Guest access must be On. It adds that changes can take up to 24 hours."
  - q: "Can any email address be invited as a guest?"
    a: "The Learn checklist says guests with a work or school account must be invited by UPN, for example adele@contoso.com. EAS IDs and other email formats are not supported."
  - q: "Which Entra setting controls who can invite guests?"
    a: "Learn points to External identities > External collaboration settings in the Microsoft Entra admin center, where Who can invite guests must allow members and certain admin roles, or anyone in the organization, to invite. Collaboration restrictions must not block the guest's domain."
  - q: "Is this checklist still current?"
    a: "The checklist page itself says it is archived and retired and recommends shared channels as a simpler option for external collaboration. Use it as a map of settings and confirm the labels in your admin centers."
---

When a guest cannot reach a team, a channel or its files, the cause is almost always one setting in one of four layers: Microsoft Entra external collaboration, the Teams admin center, Microsoft 365 Groups settings, or SharePoint sharing. Check them in that order, then check how the guest was invited. The checklist below follows the Microsoft Learn guest access checklist. That page is marked archived and retired, so treat labels as a guide and verify them in your tenant.

## Layer 1: Microsoft Entra external collaboration

Path on Learn: Microsoft Entra admin center > **External identities** > **External collaboration settings**.

- **Who can invite guests:** must be set to either members and users with specific admin roles, or anyone in the organization, including guests and non-admins.
- **Collaboration restrictions:** confirm the guest's domain is not blocked.
- **Guest user access restrictions (optional):** the options are limited access to directory object properties and memberships, or access restricted to their own directory objects.
- Select **Save** if you changed anything.

A related article on this site covers how Conditional Access can block guests. If this layer looks right and sign-in still fails, check Conditional Access policies that target guests.

## Layer 2: Teams admin center

Path on Learn: Microsoft 365 admin center > **Show all** > **Admin centers** > **Teams** > **Users** > **Guest access**.

- **Guest access** must be **On**. Learn marks this as required.
- Review the additional guest settings and select **Save**.
- Changes can take up to 24 hours to take effect.

If you changed this setting minutes ago, wait before concluding the fix failed.

## Layer 3: Microsoft 365 Groups

Path on Learn: Microsoft 365 admin center > **Settings** > **Org settings** > **Microsoft 365 Groups**.

- **Let group owners add people outside your organization to Microsoft 365 Groups as guests** must be selected.
- **Let guest group members access group content** must be selected.
- Select **Save changes**.

Both are marked required on the checklist.

## Layer 4: SharePoint sharing

Every team has a SharePoint site, so sharing settings affect file access.

**Organization level:** SharePoint admin center > **Policies** > **Sharing**.

- External sharing must be **Anyone** or **New and existing guests**. Site settings cannot exceed this.
- Review the default **File and folder links** and the default link permission (View or Edit).
- Optionally set an expiration for Anyone links.

**Site level:** SharePoint admin center > **Sites** > **Active sites** > select the team's site > **Settings** tab > **More sharing settings**.

- External sharing must be **Anyone** or **New and existing guests**, and not broader than the organization level.

Sensitivity labels can also control guest access per team and its SharePoint site. If a label is applied, check what it allows.

## Layer 5: How the guest was added

Learn lists these rules for adding guests in Teams:

1. Create the team (**Join or create a team** > **Create a team** > **From scratch**).
2. Add a guest with **More options** > **Add member**, enter the email, select **Edit guest information**, enter a full name and select **Add**.
3. A guest with a work or school account must be invited by UPN, for example adele@contoso.com. EAS IDs and other email formats are not supported.
4. Each guest must belong to at least one team before guest features are available.

## A quick order of checks

| Symptom | Check first |
| --- | --- |
| Cannot invite the guest at all | Entra **Who can invite guests** and domain restrictions |
| Invited but no guest features | Teams **Guest access** is On, 24 hours passed, guest belongs to a team |
| Sees the team but not files | SharePoint org and site sharing, Microsoft 365 Groups content access |
| Invitation works for some domains only | Collaboration restrictions in Entra |
| Wrong address type | Invite by UPN |

## What the checklist does not cover

The page I read does not describe sign-in errors, Conditional Access or MFA for guests, or cross-tenant access settings, so this article does not cover them either. Learn also notes that for a simpler external collaboration option you can use shared channels.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Guest access checklist (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/guest-access-checklist)
