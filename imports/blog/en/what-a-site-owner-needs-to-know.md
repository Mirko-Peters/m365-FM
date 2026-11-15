---
title: "What a site owner needs to know"
summary: "A SharePoint site owner has more duties than the Full Control permission suggests. This article covers the role, how it differs from site administrator, and what governance expects from owners."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [sharepoint-site-owner, sharepoint-governance]
faq:
  - q: "What is the difference between a site owner and a site administrator in SharePoint?"
    a: "Site owners are members of the Owners group, which has Full Control and manages permissions, settings and appearance. A site administrator is a separate role with full control of the site root and any subsites and can audit all site content. A site can have several site admins, but it must have one primary administrator."
  - q: "Who is the site owner on a team site connected to a Microsoft 365 group?"
    a: "On a team site connected to a Microsoft 365 group, the owners of that group become the site owners and the group members become site members. In the SharePoint admin center, admins can add and remove group owners and additional site admins in the Membership panel of the site. Check Microsoft Learn for how ownership works for your site type."
  - q: "What should site owners be trained on?"
    a: "Microsoft's intranet governance guide notes that site management is only a small part of the job for some site owners, and that training should include the organization's policies and guidelines. The governance guide names topics such as external sharing and default sharing links; site attestation covers reviewing whether a site is still needed."
---

Many people become a SharePoint site owner without anyone explaining what that means. Someone creates a team, adds a colleague as owner, and the new owner gets Full Control over the site. What the role expects of them is often left unsaid.

This article describes what the role includes, how it differs from similar roles, and what a site owner should know about the rules of their organization. For exact, current behaviour, check Microsoft Learn, which is linked below.

## What a site owner is and what the role can do

A [SharePoint site owner](https://www.m365.fm/entity/sharepoint-site-owner/) is a person who manages a SharePoint site. Members of the Owners group have the permission level **Full Control**. Microsoft Learn describes them as people who must be able to manage site permissions, settings and appearance. The details are in the documentation on [default SharePoint groups](https://learn.microsoft.com/en-us/sharepoint/default-sharepoint-groups).

In practice, that covers three areas:

- **Permissions:** who can see and edit the site, and who is added or removed.
- **Settings:** how the site is configured.
- **Appearance:** how the site looks and is navigated.

Full Control is a broad permission level. An owner can change things that affect everyone using the site, so owners should understand the consequences before they change access or settings.

## Site owners on team sites connected to Microsoft 365 groups

On a team site connected to a Microsoft 365 group, group owners become site owners and group members become site members (Microsoft Learn). In the SharePoint admin center, the Membership panel of a group-connected team site lets admins add and remove group owners and additional site admins. Channel sites for private and shared channels are managed in Teams.

Imagine a project team site that was created together with a Microsoft 365 group. If the project lead leaves the company and nobody adds a new group owner, the site loses the person who can manage it. The site still exists, but it may be left without anyone in the team who can manage its permissions and settings.

This is why it helps to look at ownership regularly and not only when something breaks. Check Microsoft Learn for how ownership works for the specific type of site you use, as communication sites and group-connected team sites can differ.

## Site owner versus site administrator

The two roles sound similar but are separate.

| | Site owner | Site administrator |
|---|---|---|
| Who | Member of the Owners group | Assigned as site admin |
| Scope | Full Control on the site: permissions, settings, appearance | Full control of the site root and any subsites, can audit all site content |
| Count | Several owners are possible | Several site admins are possible, but a site must have one primary administrator |

For site owners the practical consequence is that the owner role is a business role: someone who knows what the site is for and who should have access. The administrator role is more technical and broader. If you are unsure which of the two you hold, check with your IT team before you change anything.

## What governance expects from site owners

Owners work inside the rules of their organization. [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) is the set of policies, roles, responsibilities and processes that control how SharePoint is used: who owns sites, how sites are created and shared, and how content is reviewed.

Microsoft's [intranet governance guide](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) for SharePoint in Microsoft 365 makes several points that matter for owners:

- Governance should reflect the goals of business stakeholders, not just the expectations of IT.
- Policies are requirements; guidelines are recommendations. Owners should know which is which.
- Topics include external sharing, default sharing links and metadata.
- Site ownership is a typical policy topic. The guide's example policy reads: all SharePoint sites have a primary and a secondary contact responsible for the site and its content.
- Policies work best when site owners do not have to think about them, for example through site designs, according to the guide.

The guide also lists site owners among roles for whom intranet site management is a small part of their job, and says that training should include the organization's policies and guidelines. If you are a site owner, ask for these. If you are an admin, write them down and hand them over when you assign someone as owner.

## Reviews and tools that involve owners

With [SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management), Microsoft offers tools in three areas: content sprawl, the content lifecycle and oversharing. Three of them involve site owners directly:

- **Site ownership policy:** identifies sites that do not meet your ownership requirements, for example a minimum owner or admin count, notifies owners, admins or others, and reports on the result. Hard enforcement such as read-only applies only to sites without any owner. (An administrator sets it up, but it affects owners.)
- **Site attestation:** a recurring review (every 3, 6 or 12 months) in which site owners or site admins confirm whether the site is still needed and whether its ownership, membership, permissions and sharing settings remain appropriate.
- **Site access reviews:** administrators can hand reports on overshared sites to site owners for review.

These are designed to help organizations keep ownership and access current. Availability of these features can depend on your licensing and tenant setup, so check Microsoft Learn before planning around them.

The governance guide also raises Power Automate flows as one way to trigger an intranet content review at a set interval.

## A caution on changing access

Many owner actions change who can reach content: removing people, changing groups, breaking permission inheritance, or restoring items. These can lock people out or expose content to people who should not see it, and some are hard to undo.

Before you make larger changes, test them on a pilot or test site and make sure you have a backup or another way back. If you are not sure what a change affects, ask your SharePoint admin first. For bulk changes or scripts, treat the test step as mandatory.

## Practical takeaways

- Know what you hold: Full Control on the site through the Owners group. On group-connected team sites, you hold it through ownership of the Microsoft 365 group.
- Do not confuse the owner role with the site administrator role. They have different scope.
- Make sure every site has more than one person who can manage it. The intranet governance guide gives a primary and a secondary contact as an example policy, and the ownership policy documentation uses a minimum of two owners as its example.
- Ask for your organization's policies and guidelines, especially on external sharing and default sharing links, and learn which are requirements and which are recommendations.
- If your organization uses SharePoint Advanced Management, expect notifications and reviews such as site attestation, and plan time to answer them.
- Test permission changes on a pilot site first, and keep a backup or a way back before bulk changes.
- When you leave a role or a project, hand over ownership before you go.

## Sources

- [Default SharePoint groups (Microsoft Learn)](https://learn.microsoft.com/sharepoint/default-sharepoint-groups)
- [Manage site admins (Microsoft Learn)](https://learn.microsoft.com/sharepoint/manage-site-collection-administrators)
- [Planning intranet governance (Microsoft Learn)](https://learn.microsoft.com/sharepoint/intranet-governance)
- [SharePoint Advanced Management overview (Microsoft Learn)](https://learn.microsoft.com/sharepoint/advanced-management)
- [Create a SharePoint site ownership policy (Microsoft Learn)](https://learn.microsoft.com/sharepoint/site-ownership-policy)
- [Request recurring site attestations for SharePoint sites (Microsoft Learn)](https://learn.microsoft.com/sharepoint/request-site-attestations)
- [Site access review (Microsoft Learn)](https://learn.microsoft.com/sharepoint/site-access-review)
- [Sharing & permissions in the SharePoint modern experience (Microsoft Learn)](https://learn.microsoft.com/sharepoint/modern-experience-sharing-permissions)
