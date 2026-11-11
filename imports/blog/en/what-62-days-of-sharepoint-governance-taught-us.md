---
title: "What 62 days of SharePoint governance taught us"
summary: "A 62-day SharePoint governance effort is a useful frame for asking what to fix first: ownership, sharing defaults, oversharing and review cycles, and where tooling can help."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [cognillo, sharepoint-governance, oversharing]
faq:
  - q: "Where should SharePoint governance start?"
    a: "Microsoft Learn advises starting governance planning early and reviewing it regularly. A practical start is a governance team with business and IT, defined site ownership such as a primary and secondary contact, and clear rules for external sharing and default sharing links. Check the intranet governance guide on Microsoft Learn."
  - q: "What is oversharing in SharePoint and Microsoft 365?"
    a: "Oversharing means content is shared more broadly than intended, for example through organization-wide or anonymous links. It matters more with AI assistants such as Copilot, which can surface content that users can already access. Reviewing sharing links and open permissions is a common first step."
  - q: "Do I need a third-party tool for SharePoint governance?"
    a: "Not necessarily. Governance starts with policies, roles and processes, and Microsoft offers native options such as SharePoint Advanced Management. Third-party tools are one option when you want additional reports or bulk fixes. Compare what your licenses already include before adding anything."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

Governance projects often start with a big plan and stall in the first weeks. This article uses a fixed 62-day window as a thought exercise: if you had roughly two months to get SharePoint governance moving, what would you tackle, and in what order? The window is a planning frame, not a benchmark, and nothing here is drawn from a real project. The week ranges below are illustrative, not a documented Microsoft timeline.

The answer depends on your tenant, so treat the sequence below as a starting point. Where Microsoft documents behaviour, check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) for the current state, since features and licensing change.

## Governance is policies and people, not a tool

Microsoft describes governance in general as "the set of policies, roles, responsibilities, and processes that control how an organization's business divisions and IT teams work together to achieve its goals." That sentence comes from the SharePoint Server documentation, which says it does not cover SharePoint in Microsoft 365, but the idea carries over.

For SharePoint in Microsoft 365, the Microsoft Learn guide on intranet governance adds some useful principles:

- Start governance planning early and review it regularly.
- Include business and IT in the governance team, and keep the team in place after launch.
- The business is responsible, not IT alone.
- Policies are requirements; guidelines are recommendations.

That last distinction is easy to skip and it matters. If everything is called a policy, nothing can be enforced. If everything is a guideline, nothing changes.

For a deeper definition, see the page on [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) and the [governance overview on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/governance/what-is-governance-in-sharepoint).

## Weeks 1 to 2: ownership before everything else

Imagine a tenant with several hundred team sites. Some were created years ago by people who have since left. Nobody can say who decides whether a site is still needed or who may share its content externally.

Every later governance step depends on knowing who is responsible. Microsoft Learn suggests defining ownership of sites, for example with a primary and a secondary contact per site. That small rule helps because a single owner who leaves the company leaves the site orphaned.

Practical questions for this phase:

- Which sites have no active owner?
- Who is allowed to create sites, and how: by request or by self-service?
- Who decides on exceptions?

Both site creation models are named in Microsoft's guidance. Neither is automatically right. Request-based creation gives more control; self-service is faster. Pick one deliberately and write it down.

## Weeks 3 to 4: decide your sharing rules

Next, decide what the rules are before you measure anything against them. The Microsoft Learn governance guide names external sharing, default sharing links and metadata as typical policy topics.

A few decisions to make explicit:

- Who may share content with people outside the organization?
- What should the default sharing link type be?
- Which sites hold content sensitive enough to need stricter settings?

Microsoft's guidance also notes that policies work best when site owners do not have to think about them, for example when they are built into site designs. A rule that depends on every owner remembering it will drift. A rule built into how a site is created is more likely to hold.

## Weeks 5 to 7: look for oversharing

Once rules and owners exist, you can measure. [Oversharing](https://www.m365.fm/entity/oversharing/) means content in Microsoft 365 is shared more broadly than intended, for example through organization-wide or anonymous links.

It has become a more visible topic because AI assistants such as Copilot can surface content to users. According to Microsoft's documentation, Copilot works with content a user already has access to, so overly broad access can become more noticeable. Check Microsoft Learn for the current details. That makes a review of sharing links and open access a sensible step before or alongside a Copilot rollout.

On the native side, Microsoft offers SharePoint Advanced Management, with tools in three areas: content sprawl, the content lifecycle and oversharing. Check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/advanced-management) for what it includes and what licensing it needs in your tenant.

Imagine you find a project site where a folder of draft contracts is reachable through a link open to everyone in the organization. Typical questions are: who owns the site, was the link intended, and can it be narrowed without breaking a legitimate use?

### Where optional tooling can fit

Some organizations add third-party tools for reporting or bulk work. One option is [Cognillo](https://www.m365.fm/entity/cognillo/), a software company (legal name Tendero, Inc.) that offers the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). This section is sponsored content: Cognillo sponsors M365.FM.

According to the vendor's product page, the toolkit is aimed at SharePoint site owners and Microsoft 365 administrators. For this phase, the page names reports on sharing links, sites and content open to everyone, heavily shared files that are not labelled, and outdated content with open access. It also lists permission reports for sites, folders and items, and fixing permissions and sharing links from reports. These are the vendor's statements and were not tested by M365.FM.

On prices, the vendor names an annual subscription starting at 2,995 US dollars, cloud licenses from 20 US dollars per user per month, and a free Community Edition limited to 20 SharePoint sites, as of November 2026. Verify current terms on the [Cognillo product page](https://www.cognillo.com/sharepoint-essentials-toolkit). Other tools exist as well; the review site TrustRadius, for example, names ShareGate and LinkFixer Advanced as common alternatives. Compare them against what your Microsoft 365 licenses already provide.

### A note on fixing what you find

Removing sharing links, changing permissions or running bulk changes can break access that people rely on, and some changes are hard to reverse. Before any bulk change, test it on a pilot site or in a test tenant, and make sure you have a backup or another documented way back. Start with a small, low-risk set of sites, tell the owners, and review the result before widening the scope.

## Weeks 8 to 9: make it repeat

A cleanup is a snapshot. Governance is what keeps the snapshot from decaying. Microsoft Learn notes that a review cycle can be automated, for example with Power Automate, and that governance should be reviewed regularly.

For a recurring cycle, decide:

- How often owners must confirm that their site and its sharing are still appropriate.
- What happens if an owner does not respond.
- Who receives reports on permission changes, sharing and storage growth, and who acts on them.

If you use a tool for scheduled exports, the vendor's product page states that reports and tasks can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV (vendor statement, not tested by M365.FM). Whether you use that or native options, the point is the same: a report no one reads is not a control.

## Practical takeaways

- **Start with owners.** Define a primary and a secondary contact per site before you measure anything.
- **Write rules before reports.** Decide on external sharing, default links and exceptions first, and separate policies (requirements) from guidelines (recommendations).
- **Build rules into site creation** where you can, so owners do not have to remember them.
- **Review oversharing early,** especially before a Copilot rollout, and start with native options such as SharePoint Advanced Management.
- **Test every bulk change first** on a pilot site or test tenant, and keep a way back.
- **Add tools only for a reason.** Compare native features with third-party options, and check vendor claims yourself.
- **Make the review recurring.** A governance team that stays in place after launch matters more than the initial cleanup.
