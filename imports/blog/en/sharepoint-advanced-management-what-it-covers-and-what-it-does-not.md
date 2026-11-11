---
title: "SharePoint Advanced Management: what it covers and what it does not"
summary: "SharePoint Advanced Management adds governance tools for content sprawl, lifecycle and oversharing, but it does not replace the policies, roles and ownership an organization still has to define itself."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [sharepoint-advanced-management, sharepoint-governance, oversharing]
faq:
  - q: "What is SharePoint Advanced Management?"
    a: "SharePoint Advanced Management (SAM) is a set of governance and lifecycle tools for SharePoint, such as site access reviews, inactive site policies, restricted access control and oversharing reports. Microsoft includes it with Microsoft 365 Copilot. Check Microsoft Learn for the current licensing details that apply to your tenant."
  - q: "Does SharePoint Advanced Management replace a governance plan?"
    a: "No. The tools help you find and act on issues like content sprawl, outdated sites and oversharing. Governance itself means policies, roles, responsibilities and processes, such as who owns a site and how sharing is handled. Those decisions need people from the business and IT, not just a tool."
  - q: "How does it relate to oversharing and Copilot?"
    a: "Oversharing means content is shared more broadly than intended, for example through organization-wide or anonymous links. AI assistants like Copilot can surface such content to users. SAM includes oversharing-related tools, such as reports, to help you find these cases so you can review and fix them."
---

Many teams hear "SharePoint Advanced Management" and assume it is the answer to their SharePoint governance questions. It is a useful set of tools, but it is only one part of the answer.

This article explains what [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/) (SAM) is designed to help with, what it deliberately does not do, and how it fits with the governance work your organization still has to do itself.

## What SharePoint Advanced Management is

SAM is a set of governance and lifecycle tools for SharePoint. Examples are site access reviews, inactive site policies, restricted access control and oversharing reports. Microsoft includes it with Microsoft 365 Copilot.

Microsoft groups these tools into three areas:

- **Content sprawl:** too many sites, many of them unowned or forgotten.
- **Content lifecycle:** what happens to sites and content as they age or become inactive.
- **Oversharing:** content that is available to more people than intended.

The product documentation is on [Microsoft Learn](https://learn.microsoft.com/sharepoint/advanced-management). Licensing conditions and the exact feature list can change, so check that page for what applies to your tenant instead of relying on a summary like this one.

## What the tools help you do

Think of SAM as a way to see problems and act on them at scale, instead of finding them one site at a time.

Imagine a tenant that has grown for several years. Hundreds of team sites were created for projects that ended long ago. Some have no active owner. Some contain files shared through broad links. Looking at each site by hand is not realistic.

The areas SAM addresses map to that situation:

- **Inactive site policies** are designed to help with sites that are no longer used.
- **Site access reviews** are designed to help review who has access to a site.
- **Oversharing reports** are designed to help you find content shared more broadly than intended.
- **Restricted access control** is designed to help limit access to a site. Check Microsoft Learn for how it works.

These are detection and control tools. They give you information and levers. They do not tell you what the right answer is for your organization.

## What it does not cover

SAM does not replace [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/). Microsoft describes governance in general as the set of policies, roles, responsibilities and processes that control how an organization's business divisions and IT teams work together to achieve its goals. (That sentence appears on a page for SharePoint Server, which says it does not cover SharePoint in Microsoft 365. It is still a fair general definition.)

For SharePoint in Microsoft 365, the [intranet governance guide on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) makes several points a tool cannot make for you:

- Start governance planning early and review it regularly.
- A governance team should include business and IT, and it should stay in place after launch.
- The business is responsible, not IT alone.
- Policies are requirements; guidelines are recommendations. Decide which is which.
- Define site ownership, for example with a primary and a secondary contact per site.
- Decide how sites are created, by request or by self-service.
- Decide topics such as external sharing, default sharing links and metadata.

None of these decisions is made by switching on a feature. SAM can help you enforce or check a decision once you have made it. It cannot make the decision.

The guide also notes that policies work best when site owners do not have to think about them, for example through site designs, and that a review cycle can be automated, for example with Power Automate. Those are design choices in your own processes.

## Oversharing and why it gets attention

[Oversharing](https://www.m365.fm/entity/oversharing/) means content in Microsoft 365 is shared more broadly than intended, for example through organization-wide or anonymous links. AI assistants like Copilot can surface such content to users.

The underlying issue is not new: a file with a broad link was always reachable by anyone who had the link or the permission. What changes is discoverability. If content is accessible to a user, an assistant such as Copilot may surface it to that user.

Imagine a project folder with an organization-wide link created for a one-off review. Nobody remembered to remove it. Few people may have stumbled on it before. With an assistant that can surface what a user can access, it may appear for someone who never knew it existed.

SAM's oversharing tools are meant to help you find situations like this. What you do next is a governance decision: who reviews the findings, who is allowed to change sharing, how owners are informed, and what the default sharing settings should be going forward.

## A note on acting on the findings

Reports are low risk. Acting on them is not always. Removing links, changing permissions, deleting inactive sites or applying bulk changes can break access that people rely on, and some changes are hard to undo.

Before you act on any finding:

- **Test first** on a pilot site or in a test tenant.
- **Have a way back**, such as a backup or a documented process for restoring access or content. Check Microsoft Learn for the retention and restore options that apply to what you are changing.
- **Involve the owners** so that a site that looks inactive is not removed while it is still needed for a seasonal task.

Changing access across many sites at once multiplies any mistake, so start small and expand once the result is what you expected.

## Practical takeaways

- Treat SAM as a toolset that supports governance, not as governance itself.
- Read the [SAM documentation](https://learn.microsoft.com/sharepoint/advanced-management) to confirm which features and licensing apply to your tenant.
- Decide the policies first: ownership, site creation, external sharing, default sharing links, review frequency.
- Make sure every site has a primary and a secondary contact, as Microsoft's intranet governance guidance suggests.
- Involve the business. Microsoft's guidance is clear that the business is responsible, not IT alone.
- Use oversharing reports to find broadly shared content, then agree who reviews it and how it gets fixed.
- Before changing permissions, deleting sites or running bulk changes, test on a pilot site and make sure you can go back.
- Revisit your governance regularly. Microsoft's intranet governance guide says to review governance regularly and to keep the governance team in place after launch.
