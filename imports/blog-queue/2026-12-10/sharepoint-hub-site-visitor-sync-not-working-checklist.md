---
title: "SharePoint hub site visitor sync not working: checklist for associated sites"
summary: "What hub permissions sync does, its documented limits (visitors only, up to 10, up to 4 hours), and a checklist for when hub visitors do not appear on associated sites. Covers what Microsoft documents and what only community threads report."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [sharepoint, sharepoint-hub-sites, sharepoint-permissions]
keypoints:
  - "Hub permissions sync grants visitor access only, for individuals, Microsoft 365 groups or security groups. Microsoft documents a limit of 10 visitors and recommends groups over individuals."
  - "Changes can take up to 4 hours to appear on associated sites after they are visited. Existing site permissions are not changed."
  - "Sync is opt-in per associated site. The hub owner enables hub permissions first, then the associated site chooses to sync."
  - "A site leaving the hub loses the hub-granted permissions (Support). A community reply also advises keeping the local Visitors group members in place."
  - "Separate from sync, Microsoft says hub association itself does not change permissions and hub content rollup is security trimmed."
faq:
  - q: "What does the hub permissions sync actually do?"
    a: "Microsoft Support says enabling hub permissions syncs site permissions to give access to all sites in the hub, and that hub permissions apply to individuals, Microsoft 365 groups or security groups as visitors on associated sites. Only visitor access can be granted for now."
  - q: "Where do I turn it on?"
    a: "On the hub site, select Settings, then Site Permissions, open the Hub tab and turn on the toggle to sync hub site permissions with associating sites, then enter the people or groups. You need edit access on the hub site. The associated site's admin then opts in, with a checkbox when associating or later in site permissions."
  - q: "How long does a change take to show up?"
    a: "Microsoft Support says changes can take up to 4 hours to appear on associated sites after they are visited. A community reply in a Microsoft Tech Community thread also reports delays of up to about four hours."
  - q: "Why does a Hub Visitors group appear on sites where sync is off?"
    a: "A Tech Community reply from an MVP says the Hub Visitors group is created on any site joined to the hub, and that sync does not happen if it is disabled on that site. This is community guidance, not a Microsoft Learn statement."
  - q: "What if sync stopped working for one site?"
    a: "The Learn and Support pages I read give no troubleshooting steps. In a community thread the original poster tried re-associating the site and toggling sync with no success. A later poster reported success after removing all associations, unregistering the hub and setting it up again, and an MVP advised opening a Microsoft support ticket."
---

Hub visitor sync works only as an opt-in, visitor-only grant with documented limits, and the documentation gives no troubleshooting steps for failures. The checklist below covers what Microsoft Support and Learn state about the feature, then marks which advice comes only from community threads so it can be weighed accordingly.

## What the feature is

Microsoft Support describes hub permissions as a toggle to automatically sync hub site permissions with sites that associate to the hub. Enabling it grants access to all sites in the hub. The people or groups you add become visitors on associated sites.

Documented points:

- Only visitor access can be granted for now.
- Up to 10 visitors can be synced. Microsoft 365 groups or security groups are recommended over individuals.
- Associated sites do not have to sync permissions to join the hub, so sensitive sites can stay associated without being shared widely.
- Existing site permissions do not change when hub permissions sync.
- Changes can take up to 4 hours to appear on associated sites after they are visited.
- When a site leaves the hub, the hub permissions are removed from it.

Separately, Learn's hub planning page says association does not change a site's permissions, and information surfaced on the hub is security trimmed. If a site with restricted access is associated, only users who have access to it see its content rolled up on the hub.

## Check 1: Is hub permissions enabled on the hub?

On the hub site, select **Settings** > **Site Permissions**, open the **Hub** tab, and confirm the toggle is on and the people or groups are listed. You need edit access on the hub site to change it. The pages I read do not say what a missing **Hub** tab means. In one community thread, the poster saw the Hub tab disappear from the Site Permissions page of one associated site that had stopped syncing.

## Check 2: Did the associated site opt in?

Syncing is the choice of the associated site. The Support page says the hub owner must enable hub permissions first, then the associated site's admin can sync. When associating through **Settings** > **Site information** > **Hub site association**, a checkbox appears if the hub enabled hub permissions, and you can change it later under site permissions. Support says to use **Site permissions** on the associated site to turn the sync toggle on or off, so open **Settings** > **Site permissions** there and check the toggle.

You must be a site owner or higher to associate a site. Learn's create-hub-site page adds that the SharePoint admin can restrict who may associate sites with the hub, and that any user can do so if that list is left empty. Only site collections can be associated, and subsites inherit the association of their parent. If **Hub site association** is greyed out, Support says you may lack permission or your organization may not use hubs.

## Check 3: Is the hub list within the limits?

- More than 10 individual visitors is above the documented sync limit. Replace individuals with one Microsoft 365 group or security group.
- Hubs allow only visitors, so a request for members or owners will never sync.
- If the approval flow is on (**Settings** > **Hub site settings** > **Require approval for associated sites to join**), the association takes effect only after approval.

## Check 4: Allow for the delay

Support says changes can take up to 4 hours after the associated site is visited. Visit the site, wait, and test again with a user who is only in the hub visitor group before concluding that sync failed.

## Check 5: Look at what is already on the site

Sync adds access and does not override existing site permissions, according to Support. My own reasoning, not from the pages: a hub visitor can therefore still lack access to content with unique permissions, such as a library that does not inherit from the site. A user who can open the site but not a library points to library permissions rather than hub sync.

## What only the community reports

These points come from Microsoft Tech Community threads and not from Learn or Support, so verify them in your tenant:

- A reply from an MVP says the **Hub Visitors** group is created on any site joined to the hub even when sync is off, and that sync does not occur if disabled on the site. The poster had deleted the group on sensitive sites and it reappeared about a day later.
- Another MVP described the hub visitors group as additive: it adds a permission group next to Visitors, Members and Owners, and she advised not removing members of the local Visitors group, because access ends when a site leaves the hub. She also said not every associated site has to sync.
- For one site that stopped syncing, the poster's own attempts to re-associate the site and toggle sync did not help. One later poster reported success after undoing all associations, unregistering the hub and rebuilding it, and an MVP recommended a Microsoft support ticket because Microsoft manages the backend services.

The full rebuild is disruptive for a hub with many sites, so treat it as a last resort, and prefer a support ticket.

## A safer design

If you share read access across many sites, a single Microsoft 365 or security group added to each site's Visitors group avoids depending on sync timing. The same MVP suggested a directory group for this purpose. Check the nesting rules for your group type first. The pages I read do not cover them.

## What the documentation does not say

The pages I read do not explain why sync fails for a single site, how to see the sync status, or whether the Hub Visitors group can be removed from a site that opted out. Do not assume any of these.

## Typical mistakes

- Granting more than 10 individuals.
- Expecting hub members or owners to sync.
- Testing before the 4-hour window has passed.
- Removing the local Visitors group and then removing the site from the hub.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint hub sites](https://www.m365.fm/entity/sharepoint-hub-sites/)
- [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/)

## Sources

- [Set up your SharePoint hub site (Microsoft Support)](https://support.microsoft.com/office/set-up-your-sharepoint-hub-site-e2daed64-658c-4462-aeaf-7d1a92eba098)
- [Associate a SharePoint site with a hub site (Microsoft Support)](https://support.microsoft.com/en-US/SharePoint/sites-in-sharepoint/associate-a-sharepoint-site-with-a-hub-site)
- [Planning your SharePoint hub sites](https://learn.microsoft.com/en-us/sharepoint/planning-hub-sites)
- [Create a SharePoint hub site](https://learn.microsoft.com/en-us/sharepoint/create-hub-site)
- [Tech Community: Hub visitors added to associated sites even though sync is not enabled](https://techcommunity.microsoft.com/discussions/sharepoint_general/hub-visitors-added-to-associated-sites-even-though-sync-hub-permissions-is-not-e/3812275)
- [Tech Community: Hub associated site not syncing permissions](https://techcommunity.microsoft.com/discussions/sharepoint_general/hub-associated-site-not-syncing-permissions/3295050)
- [Tech Community: Questions about syncing hub site with associated sites](https://techcommunity.microsoft.com/discussions/sharepoint_general/questions-about-syncing-hub-site-with-associated-sites/3591483)
