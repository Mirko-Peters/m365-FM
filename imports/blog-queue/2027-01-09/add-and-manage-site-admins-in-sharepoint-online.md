---
title: "How to Add and Manage Site Collection Administrators in SharePoint Online"
summary: "Add and manage site admins, formerly called site collection admins, in the SharePoint admin center: required role, Active sites steps, group-connected versus other sites, the primary admin caveat and what the Learn page does not cover."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [sharepoint]
keypoints:
  - "Learn calls the role site admin, previously called site collection admin. You need the SharePoint Administrator role or above in Microsoft 365."
  - "In the SharePoint admin center go to Active sites, select a site and choose Membership on the command bar."
  - "For a group-connected team site you manage group owners and additional site admins. For other sites you manage site admins and can change the primary admin."
  - "Removing someone as primary admin does not remove them entirely. They are still listed as an additional admin."
  - "The page has no Permissions tab, no PowerShell steps, no eligibility rules and no limit on the number of site admins."
faq:
  - q: "What are site collection administrators called now?"
    a: "Microsoft Learn says site admins were previously called site collection admins. The page does not define the role further and links to About site permissions."
  - q: "Who can add or remove site admins?"
    a: "A SharePoint Administrator and above in Microsoft 365. Learn recommends roles with the fewest permissions and limiting Global Administrator to emergency scenarios."
  - q: "How do I add a site admin?"
    a: "In the SharePoint admin center go to Active sites, select the site, select Membership on the command bar, and in the details panel add or remove site admins. For other sites you can also change the primary admin."
  - q: "What about group-connected team sites?"
    a: "For a group-connected team site you add or remove group owners and additional site admins. Membership of the Microsoft 365 group is managed in the Microsoft 365 admin center."
  - q: "Can I use PowerShell?"
    a: "The page does not mention PowerShell. This guide does not give a cmdlet because none is documented on the page read."
---

Every SharePoint site has people who can administer it. In current Microsoft documentation these are called site admins. They were previously called site collection admins. This guide follows the Microsoft Learn page on managing site admins and reports only what it states. The page does not cover PowerShell, so neither does this guide.

## Who can change them

A SharePoint Administrator and above in Microsoft 365 can add and remove site admins. The page does not list the roles above SharePoint Administrator. It recommends roles with the fewest permissions and says Global Administrator is highly privileged and should be limited to emergency scenarios when no existing role works.

## Steps in the SharePoint admin center

1. Go to **Active sites** in the SharePoint admin center and sign in with an account that has admin permissions. Users of Office 365 operated by 21Vianet sign in to the Microsoft 365 admin center first and then open Active sites.
2. In the left column select a site.
3. Select **Membership** on the command bar to open the details panel.
4. In the panel, add or remove owners, members, site admins, site owners, site members and site visitors.

What you can change depends on the site type:

- **Group-connected team site.** Add or remove group owners and additional site admins.
- **Other sites.** Add or remove site admins and change the primary admin.

## Caveats from the page

- Removing someone as primary admin does not remove them entirely. They remain listed as an additional admin.
- The new SharePoint admin center can change owners for sites that use the new team site and communication site templates.
- Membership of Microsoft 365 groups is managed in the Microsoft 365 admin center, through adding or removing members of Microsoft 365 groups.
- Owners of communication sites and Microsoft 365 group sites manage access through a linked support article, not through this admin process.
- Classic site admins are pointed to a separate support article.

## Owner and site admin

The page does not define the difference between an owner and a site admin. It only shows that they appear as separate categories in the details panel and links to About site permissions for details.

## What the page does not say

- A **Permissions** tab. The control is **Membership** on the command bar.
- PowerShell steps, including any Set-SPOUser usage.
- Who is eligible to be a site admin.
- A limit on the number of site admins.
- Whether you can add yourself, or what to do if you lack access to the site.
- A list of roles above SharePoint Administrator.

## A routine for access reviews

This routine is practical advice built on the page.

1. Open **Active sites** and pick the site.
2. Open **Membership** and read the site admins and the primary admin.
3. Remove people who should no longer hold the role.
4. If the primary admin changes, check that the former primary admin is not still listed as an additional admin.
5. For group-connected sites, review group ownership in the Microsoft 365 admin center as well.

## Typical mistakes

- Assuming that removing the primary admin removes all their admin rights.
- Managing group membership in the SharePoint admin center when it belongs in the Microsoft 365 admin center.
- Using Global Administrator for a task that SharePoint Administrator can do.
- Looking for a Permissions tab that the page does not describe.

## Quick reference

| Question | Answer on the page |
| --- | --- |
| Old name of the role | Site collection admin |
| Where to manage | SharePoint admin center > Active sites > select a site > Membership |
| Minimum role | SharePoint Administrator |
| Group-connected team site | Group owners and additional site admins |
| Other sites | Site admins, and the primary admin can be changed |
| Group membership | Microsoft 365 admin center |
| PowerShell | Not covered |

## Reading the details panel

After you select Membership, the details panel opens on the right side of the page. The panel groups people by category. For a group-connected team site the panel shows the group owners and the additional site admins. For other sites it shows the site admins, and it offers a way to change the primary admin. Changes to the Microsoft 365 group itself, such as adding members, do not happen in this panel. The page sends you to the Microsoft 365 admin center for that.

## Guidance for 21Vianet

If your tenant is Office 365 operated by 21Vianet, the page gives one extra step. Sign in to the Microsoft 365 admin center first, then open the Active sites page from there. The other steps are the same.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Manage site admins (Microsoft Learn)](https://learn.microsoft.com/sharepoint/manage-site-collection-administrators)
