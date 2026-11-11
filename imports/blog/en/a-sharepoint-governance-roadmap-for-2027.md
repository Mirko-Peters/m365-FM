---
title: "A SharePoint governance roadmap for 2027"
summary: "A practical SharePoint governance roadmap for 2027: define ownership, put site lifecycle policies in place, review oversharing and treat Copilot as a reason to check permissions, with pilots first."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [sharepoint-governance, sharepoint-site-lifecycle, copilot-governance]
faq:
  - q: "Where should a SharePoint governance plan start?"
    a: "Start with people and decisions, not tools. Microsoft Learn advises starting governance planning early and reviewing it regularly. Form a team with business and IT, define site ownership with a primary and secondary contact, and write down which rules are policies and which are only guidelines."
  - q: "Do site lifecycle policies delete SharePoint sites?"
    a: "According to Microsoft, site lifecycle management policies do not delete SharePoint sites directly. Depending on configuration, a policy can take no action, set a site to read-only, or archive it after a read-only period. Disabling a policy does not undo actions already taken, so test first."
  - q: "How does Copilot change SharePoint governance?"
    a: "Copilot governance covers permissions, data access and oversight in a tenant. It does not replace SharePoint governance; it adds a reason to review who can reach which content. Clear ownership, sharing rules and regular reviews are the foundation. Check Microsoft Learn for the current Copilot controls."
---

Many SharePoint environments grow faster than the rules around them. Sites get created, shared and forgotten. A year later nobody can say who owns what, or who still needs access.

This roadmap is for 2027 planning. It does not assume a big project. It suggests an order of work: people first, then policies, then automation. Everything that changes access or content should be tested on a pilot site first.

## Start with what governance actually is

[SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) is the set of policies, roles, responsibilities and processes that control how an organization uses SharePoint: who owns sites, how sites are created and shared, and how content is reviewed. Microsoft defines governance in general as the set of policies, roles, responsibilities and processes that control how an organization's business divisions and IT teams work together to achieve its goals. That sentence comes from the SharePoint Server documentation, which says it does not cover SharePoint in Microsoft 365. The idea still carries over, and the guidance for Microsoft 365 is on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/intranet-governance).

Three points from that guidance are worth taking into any plan:

- Start governance planning early and review it regularly.
- The governance team should include business and IT, and it should stay in place after launch.
- The business is responsible, not IT alone.

If your current "governance" is a document nobody has opened since the rollout, the first step is not a new tool. It is a decision about who is accountable.

## Q1: Decide ownership and the rulebook

Begin with ownership. Microsoft suggests defining site ownership, for example with a primary and a secondary contact per site. This sounds small, but it is the basis for every later step. A notification about an inactive site, a request to confirm that a site is still needed, a question about an external guest: all of them need a person to receive them.

Next, separate **policies** from **guidelines**. Microsoft Learn describes policies as requirements and guidelines as recommendations. Mixing them up causes trouble in both directions. If everything is a "policy", nobody follows the list. If everything is a "guideline", nothing is enforced.

Topics that Microsoft names for a governance plan include:

- external sharing
- default sharing links
- metadata
- how sites are created (by request or by self-service)

Imagine a company that allows self-service site creation but has never written down who may invite external guests. In that case the first two weeks of the year are better spent on a one-page rulebook than on any technical project. Decide, write it down, and name the people who can approve exceptions.

One more principle from Microsoft's guidance: policies work best when site owners do not have to think about them. Site designs are one example of how to build rules into new sites so owners do not have to remember them.

## Q2: Put the site lifecycle on rails

Once ownership exists, you can automate part of the upkeep. [SharePoint site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) management is a set of policies in SharePoint Advanced Management, described on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management), that is designed to keep sites active, properly owned and regularly reviewed. It names three policy types:

- **Site ownership policy:** makes sure a site has a minimum number of owners or admins, for example at least two.
- **Inactive site policy:** detects sites without meaningful activity across SharePoint and connected workloads such as Teams, Exchange and Viva Engage.
- **Site attestation policy:** asks at regular intervals for an explicit confirmation that the site is still needed.

Policies can run in two modes. In simulation mode a policy runs once and creates a report. In active mode it runs regularly, creates reports and sends notifications. Recipients can respond from the e-mail, for example by confirming that the site is still in use.

If nobody responds after several notices, the policy can take no action, set the site to read-only, or archive it after a configurable read-only period with Microsoft 365 Archive. Microsoft states that site lifecycle management policies don't delete SharePoint sites directly.

A sensible approach is to begin in simulation mode and read the report before anything sends notifications. Then try an active policy on a limited scope, such as a pilot group of sites. Two cautions matter here:

- Read-only and archive actions change how people can work with a site. Test them on a pilot set first, and make sure you know how to reverse them in your tenant.
- According to Microsoft, disabling or deleting a policy stops future actions but does not undo actions already taken.

Check the licensing requirements and current feature details for SharePoint Advanced Management on Microsoft Learn before planning, since these policies are part of it.

## Q3: Look at oversharing and content sprawl

Microsoft describes the tools in SharePoint Advanced Management as covering three areas: content sprawl, the content lifecycle and oversharing. The lifecycle policies above address the middle one. Sprawl and oversharing deserve their own pass in the roadmap.

Oversharing is rarely one big mistake. It is usually many small ones: a sharing link that was convenient once, a group with too many members, a site that was open "temporarily". Your governance plan should say what the default sharing link should be and who may change it, because default sharing links are one of the topics Microsoft names for governance.

A practical way to work through this:

1. List your most sensitive or most visited sites and check who has access.
2. Compare the actual sharing settings with what your rulebook says.
3. Fix the gaps site by site, starting with a pilot.

Removing permissions or changing sharing settings can cut people off from content they need. Make a record of the current state before you change anything, test on a pilot site, and have a way back, for example by documenting the previous settings so they can be restored. Where removed permissions or changed sharing cannot be reversed in your tenant, plan for that before you start.

The Learn guide also mentions that a review cycle can be automated, for example with Power Automate. If your organization already uses Power Automate, this is one way to remind owners to review their sites regularly.

## Q4: Treat Copilot as a reason to check, not a separate project

[Copilot governance](https://www.m365.fm/entity/copilot-governance/) means controls for permissions, data access and oversight when using Copilot in a Microsoft 365 tenant. It is not a replacement for SharePoint governance. It is another reason to do it properly.

The reasoning is simple. Tools that search and summarize content work within what a user can reach. If permissions are loose, more content is reachable, which can make loose permissions more visible. Check Microsoft Learn for how Copilot handles permissions. That makes ownership, sharing rules and regular review more relevant, not less. The exact Copilot controls and their requirements change over time, so check Microsoft Learn for the current state before you plan around specific settings.

For the roadmap, that means no separate "Copilot governance track" with its own owners. Add Copilot as a question to the work you already do:

- Does this site have owners who know what is stored here?
- Is the sharing setting on this site what the rulebook says?
- Does the content still need to be here?

Imagine a department site that was shared broadly for a project and never narrowed again. A governance review would ask whether that access is still intended. That question matters for Copilot, and it matters without it too.

## Practical takeaways

- Start with people: form a governance team with business and IT, and name a primary and secondary contact for each site.
- Write a short rulebook that separates policies (requirements) from guidelines (recommendations).
- Cover external sharing, default sharing links, metadata and site creation in that rulebook.
- Use site lifecycle policies to keep sites owned, active and reviewed. Begin in simulation mode and read the report first.
- Remember that lifecycle policies do not delete sites directly, but read-only and archive actions still change how a site works, and disabling a policy does not undo them.
- Test every change that affects access or content on a pilot site, and keep a backup or documented previous state.
- Review oversharing and sprawl as a regular task, not a one-time cleanup.
- Fold Copilot into existing reviews instead of creating a separate track, and check Microsoft Learn for current controls.
- Schedule a review of the governance plan itself, because Microsoft's guidance is clear that it should be revisited regularly.
