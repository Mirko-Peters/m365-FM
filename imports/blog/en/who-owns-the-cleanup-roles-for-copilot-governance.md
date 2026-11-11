---
title: "Who owns the cleanup? Roles for Copilot governance"
summary: "Copilot surfaces what users can already access, so oversharing cleanup needs clear owners. This article explains how business, IT and site owners can split the work and which SharePoint Advanced Management tools support it."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [copilot-governance, sharepoint-governance, sharepoint-site-owner]
faq:
  - q: "Who is responsible for cleaning up oversharing before rolling out Copilot?"
    a: "Not IT alone. Microsoft's intranet governance guidance says the business is responsible, with a governance team that includes business and IT. IT provides tools and reports, site owners review their own sites, and the governance team sets the policies and keeps the process running after launch."
  - q: "What can site owners actually review with SharePoint Advanced Management?"
    a: "Site attestation lets site owners regularly review whether a site is still needed, who its owners and members are, and its permissions and sharing settings. Site access reviews let administrators send reports on overshared sites to site owners. Check Microsoft Learn for current licensing and availability."
  - q: "Is a site owner the same as a site administrator?"
    a: "No. Site owners are members of the Owners group with Full Control, managing permissions, settings and appearance. Site administrators are a separate role with full control of the site root and any subsites, and they can audit all site content. A site can have several site admins but only one primary administrator."
---

Copilot works with the content a user can already access, based on the permissions that user has. It does not add new permissions, but it can make old permission problems easier to notice. A file shared too widely years ago may suddenly show up in an answer.

That is why the cleanup question comes up before and after a Copilot rollout. The harder question is who owns it. This article looks at the roles involved and how they can share the work. It builds on [Copilot governance](https://www.m365.fm/entity/copilot-governance/) as the set of controls for permissions, data access and oversight in a Microsoft 365 tenant.

## Why "IT will fix it" does not work

It is tempting to hand the whole cleanup to the IT team. IT has the admin roles, the reports and the PowerShell access. But IT usually does not know whether a project site is still active, whether an external partner should still have access, or whether a document library contains material meant for a small group.

Microsoft's intranet governance guide on Microsoft Learn makes the point directly: the business is responsible, not IT alone. A governance team should include both business and IT representatives, and it should stay in place after launch rather than disbanding once the project is done.

For Copilot governance, this means the cleanup is not a one-time IT project. It is an ongoing responsibility shared across roles.

## Governance gives the work a frame

[SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) is the set of policies, roles, responsibilities and processes that control how an organization uses SharePoint. Microsoft's general definition describes governance as the policies, roles, responsibilities and processes that control how business divisions and IT teams work together to achieve their goals. (That exact sentence appears on the SharePoint Server page, which does not cover SharePoint in Microsoft 365, but it describes the idea well.)

For SharePoint in Microsoft 365, the intranet governance guide names topics a governance team typically needs to decide, including external sharing, default sharing links and metadata. It also draws a useful distinction:

- **Policies** are requirements.
- **Guidelines** are recommendations.

This distinction matters for Copilot cleanup. If "no organization-wide sharing links on sensitive sites" is a policy, someone can check against it. If it is only a guideline, cleanup becomes a matter of persuasion.

The guide also recommends starting governance planning early and reviewing it regularly. If you already run a governance team, add Copilot-related oversharing to its agenda rather than creating a parallel structure.

## The roles and what each one owns

A workable split could look like this. Treat it as a starting point and adapt it to your organization.

**Governance team (business and IT).** Sets the policies and guidelines, decides what counts as overshared, defines the review cycle and decides how exceptions are handled. It does not review every site itself.

**IT and tenant administrators.** Provide the tools, reports and settings. They configure policies, produce lists of sites that need attention and support site owners. They also handle changes that need admin rights.

**Site owners.** Know their sites and decide whether content and access are still appropriate. This is the role that most often gets overlooked.

**Content owners and users.** Follow the guidelines when they share files and flag content that looks misplaced.

Imagine a project site that finished some time ago. IT can see that the site has broad access, but only the former project lead can say whether the content is still needed. If nobody has been named as owner, the question may go unanswered, and the access stays in place. That gap is what role definitions are meant to close.

## Site owners: the role that decides most cleanups

The [SharePoint site owner](https://www.m365.fm/entity/sharepoint-site-owner/) is someone who manages a SharePoint site. On a team site, members of the Owners group have the Full Control permission level. Microsoft Learn describes them as people who must be able to manage site permissions, settings and appearance. On a team site connected to a Microsoft 365 group, the group owners become the site owners.

A site administrator is a different role. Site administrators have full control of the site root and any subsites and can audit all site content. A site can have several site admins, but only one primary administrator. Do not assume that a site owner and a site administrator are the same person.

Two practical points from Microsoft's intranet governance guide:

- Managing a site is often only a small part of a site owner's job. Expect limited time, and keep review tasks short and clear.
- Training for site owners should include your organization's policies and guidelines. An owner who does not know the rules cannot apply them.

The guide also suggests defining ownership explicitly, for example with a primary and a secondary contact per site. That reduces the chance that a site ends up with nobody responsible when someone leaves.

## Tools that support the split

SharePoint Advanced Management offers tools in three areas: content sprawl, the content lifecycle and oversharing. Several of them map directly to the roles above. Check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/advanced-management) for current licensing, requirements and availability before planning around them.

- **Site ownership policy.** Defines who is responsible for each site, sets minimum owner or admin counts and automates notifications. This supports the "every site has an owner" rule.
- **Site attestation.** A regular review by site owners of whether the site is still needed, who its owners and members are, and its permissions and sharing settings. This puts the review with the people who know the site.
- **Site access reviews.** Lets administrators hand reports on overshared sites to site owners for review. IT finds the candidates, owners decide.

The intranet governance guide adds that policies work best when site owners do not have to think about them, for example through site designs, and that a review cycle can be automated, for example with Power Automate. The aim is to reduce manual effort, not to replace the owner's judgement.

Third-party tools exist for similar tasks. If you consider them, compare them against the native features first and against your own role model, not the other way round.

A note on safety: reviews can lead to removed permissions, changed sharing settings or deleted content. Test any new review process or bulk change on a pilot site or in a test tenant first, and make sure you have a backup or another way back (for example, a documented way to restore access) before applying changes widely. Removing access from a site that is still actively used can disrupt work, so give owners a way to object before changes take effect.

## Practical takeaways

- Treat Copilot governance as shared work. The business is responsible, with IT in a supporting role.
- Put cleanup on the agenda of an existing governance team, or form one with both business and IT members, and keep it running after launch.
- Write down which rules are policies (requirements) and which are guidelines (recommendations), so reviews have something to check against.
- Make sure every site has a primary and a secondary contact, and do not confuse site owners with site administrators.
- Give site owners short, clear review tasks and training on your policies. Remember that site management is often a small part of their job.
- Look at SharePoint Advanced Management features such as the site ownership policy, site attestation and site access reviews, and verify licensing and availability on Microsoft Learn.
- Pilot any review process or permission change on a test site or tenant first, and keep a way back before rolling it out.
- Start with the [intranet governance guide](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) on Microsoft Learn if you need a framework for the first governance team meeting.
