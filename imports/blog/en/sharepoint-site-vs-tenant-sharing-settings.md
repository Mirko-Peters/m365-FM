---
title: "Tenant and site sharing settings in SharePoint: which one wins?"
summary: "SharePoint site sharing settings vs tenant: the stricter value wins. Learn how both levels work, how to change one site, and how to plan exceptions safely."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint, sharepoint-sharing-links, guest-access, sharepoint-governance]
keypoints:
  - "When a site setting and the organization setting differ, the more restrictive value always applies, so a site can be tightened but never loosened beyond the tenant."
  - "Only a SharePoint Administrator or Global Administrator can change a site's external sharing setting in the admin center. Site owners cannot."
  - "Turning external sharing off at the organization level makes site-level sharing unavailable, and existing shared links stop working until you turn it back on."
  - "Group-connected sites also depend on Microsoft 365 Groups and Teams guest settings, so a site setting alone may not decide whether a guest gets in."
  - "Set the tenant to the loosest level you truly need, then tighten sensitive sites one by one and record each exception with an owner."
faq:
  - q: "Which wins, the site or the tenant sharing setting in SharePoint?"
    a: "The more restrictive value wins. Microsoft states that each site has its own setting, which must be the same as or more restrictive than the organization setting. If the two do not match, the stricter one applies. A site can therefore limit sharing further than the tenant, but it cannot allow more."
  - q: "Can a site owner change the external sharing setting of their site?"
    a: "No. Microsoft says site owners cannot change these settings. You need at least the SharePoint Administrator role in Microsoft 365, and Global Administrators can also do it. Site owners can only share within the level that the admin has set for the site, so they should ask an admin for any change."
  - q: "What happens to shared links if I turn off external sharing for the organization?"
    a: "Site-level external sharing becomes unavailable and existing shared links stop working. Microsoft adds that guests typically lose access within one hour. If you turn sharing on again, the site setting returns to its earlier value and the links resume working, so plan any short switch-off carefully."
---

When a site setting and the tenant setting disagree, the stricter one wins. That is the short answer to SharePoint site sharing settings vs tenant settings. This article is for SharePoint admins who must decide where to set the limit and where to allow exceptions. You will learn how the two levels relate, what a site cannot do, how to change one site step by step, how the settings interact with groups and Teams, and see a worked example with invented numbers.

## SharePoint site sharing settings vs tenant: which one wins?

Microsoft explains the relationship on its page about [external sharing overview](https://learn.microsoft.com/sharepoint/external-sharing-overview). SharePoint has external sharing settings at two levels: the organization level, often called the tenant level, and the site level. To allow external sharing on any site, you must allow it at the organization level first. Then you can restrict sharing on other sites.

If a site setting and the organization setting do not match, the most restrictive value always applies. Microsoft's page on [turning external sharing on or off](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off) says the same in other words: each site has its own sharing setting, and it must be the same as or more restrictive than the organization setting.

Think of the tenant setting as a ceiling in your [SharePoint](https://www.m365.fm/entity/sharepoint/) estate. No site can rise above it. A site can sit lower, and the lowest setting in the chain decides. The OneDrive setting follows a similar rule, because it can be more restrictive than the SharePoint setting but not more permissive.

## What are the four sharing levels?

Both levels use the same four choices. Microsoft describes them like this:

- **Anyone.** Links work without sign-in. Sites can also be shared with new and existing guests who authenticate.
- **New and existing guests.** Invitees must sign in or verify with a code, and they are added to the directory.
- **Existing guests.** Sharing is limited to people who are already in your directory.
- **Only people in your organization.** External sharing is off.

The choices run from loosest to strictest. Whatever you choose, the stricter functions stay available. If Anyone links are allowed, users can still share with guests who sign in and with colleagues. This is why the order matters when you plan exceptions: you pick the loosest level the company really needs for the tenant, and the stricter levels become your tools for single sites.

The same page notes that the default link changes with the level. The option "Anyone with the link" is available only when the setting is Anyone. If the site allows only guests who sign in or verify, the default link becomes "Only people in your organization". So a tighter site setting changes what users see in the Share dialog, not only what they may do.

## How do you change the sharing setting for one site?

Use the steps from Microsoft's article on [changing the external sharing setting for a site](https://learn.microsoft.com/sharepoint/change-external-sharing-site). You need at least the SharePoint Administrator role, and Microsoft states that site owners cannot change these settings.

1. In the SharePoint admin center, go to **Active sites** and sign in with an admin account.
2. Select the site in the list. For a channel site, select the link in the Channel sites column first.
3. On the **Settings** tab, select **More sharing settings**.
4. Choose one of the sharing options.
5. Optional: under the advanced settings, limit sharing by domain and add the allowed or blocked domains.
6. Optional: clear **Same as organization-level setting** for guest access expiration and set values for this site.
7. Optional: clear **Same as organization-level setting** for the default link type or permissions.
8. Select **Save**.

The steps apply to team sites, communication sites and classic sites. OneDrive is handled separately. The available site options depend on the organization setting, so if the tenant is on "Existing guests", you will not see "Anyone" on a site.

For the default link type of a site, Microsoft's page on [changing the default sharing link](https://learn.microsoft.com/sharepoint/change-default-sharing-link) lists the link types: Anyone with the link, People in your organization with the link, People with existing access, and Specific people. It also notes that the setting applies only to libraries that use the new experience. For a Teams private or shared channel site, you must use PowerShell to change the default link type.

## What happens when the tenant setting changes?

Changes at the top flow down, and this is where surprises happen. Microsoft documents three effects.

- **Turning sharing off for the organization.** Site-level external sharing becomes unavailable and existing shared links stop working. Guests typically lose access within one hour.
- **Turning sharing back on.** The site setting returns to its previous value and the links resume working. That includes guests, who regain access. If you do not want that for specific sites, turn off external sharing for those sites first.
- **Restricting the level.** Guests typically lose access within one hour when you restrict or turn off external sharing.

Microsoft's pages do not describe what happens to an existing site setting when the tenant becomes stricter than the site, other than the rule that the most restrictive value applies. So test a change on a pilot site and check what users see, before you roll it out wide.

A practical lesson: avoid using the tenant switch as a quick fix for an incident. A short switch-off breaks active work with customers and partners and can re-open access when it is switched on again. For a single problem site, change the site setting instead.

## How do groups and Teams affect the site setting?

Group-connected sites add a second set of controls. Microsoft states that the guest sharing settings of Microsoft 365 Groups and Teams also affect the connected SharePoint site. Group-connected sites, including Teams sites, default to New and existing guests if the Microsoft 365 Groups setting that lets group owners add people outside the organization is on. Otherwise the default is Existing guests only.

There is a trap here. If a group blocks guest members from group resources, guests may not reach site content even when external sharing is on for the site. The reverse also holds: a loose group setting does not help if the site is set to Only people in your organization.

Microsoft also lists defaults by site type:

- **Classic sites:** Only people in your organization.
- **OneDrive:** Anyone.
- **Group-connected sites, including Teams:** New and existing guests, or Existing guests only.
- **Communication sites:** Only people in your organization.
- **Modern sites with no group:** Only people in your organization.

The root communication site of the tenant defaults to Anyone. Many admins forget this one, because it is the site people use for the intranet home page. Check it.

Finally, Microsoft Entra external collaboration settings decide who can invite guests for site sharing, and they also apply to files and folders if Microsoft Entra B2B integration is on. Read the [sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/) and [guest access](https://www.m365.fm/entity/guest-access/) topics together when you plan your policy, because the SharePoint setting is only one of the layers.

## Example: one tenant level, three site exceptions

The numbers are invented to show the method. A company has 120 SharePoint sites. The admin sets the tenant to "New and existing guests", because about 25 project sites need to work with customers and guests must sign in.

Then the admin looks at the exceptions:

1. **Legal and HR sites, 6 in total.** Set to "Only people in your organization". They hold confidential content, and no outside sharing is needed.
2. **Finance site, 1 in total.** Set to "Existing guests", because two auditors already have accounts and the admin does not want new ones created from this site.
3. **Marketing site, 1 in total.** Set to "Anyone", but this is not possible because the tenant is on "New and existing guests". The admin has two choices: raise the tenant to Anyone for everybody, or keep the tenant and put public brochures in a copy on a separate site that gets its own approval. They choose the second option, to avoid loosening 119 other sites.

Count the result: 7 sites tightened, 1 site solved without touching the tenant, and 112 sites on the tenant default. Each of the 7 tightened sites has a named owner and a line in the exception list. Next quarter, the admin reviews the list as part of [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/): 2 of the legal sites now host a joint project, so one moves to "Existing guests".

The lesson is the direction of travel. The tenant is set for the loosest need that applies to many sites, and exceptions go down, not up.

## Common mistakes

- **Setting the tenant too loose for convenience.** Every site below it must then be tightened one by one.
- **Expecting a site to allow more than the tenant.** A site cannot be more permissive than the organization setting.
- **Switching sharing off globally as a quick fix.** Links stop working, and guests regain access when you switch it back on.
- **Ignoring the group and Teams settings.** For group-connected sites the guest setting of the group also counts.
- **Forgetting the root site.** The root communication site defaults to Anyone.
- **No record of exceptions.** Without an owner and a reason, nobody can tell later why a site is different.

## How software can help

The built-in route is the SharePoint admin center, where the Active sites list and the sharing settings are enough to set and review exceptions. For many sites, a PowerShell export of the sharing setting per site, or a reporting tool, can show which sites differ from the tenant and which allow guests. Whatever you use, compare the output with the settings in the admin center on a few sites before you trust it, and keep the exception list in one place.

## Next step

Open the SharePoint admin center today, write down the tenant level, and list every site whose setting differs. Then apply the rule for SharePoint site sharing settings vs tenant: keep the tenant as strict as your work allows and give each exception an owner.
