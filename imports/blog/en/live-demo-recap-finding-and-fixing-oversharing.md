---
title: "Live demo recap: finding and fixing oversharing"
summary: "A practical recap of how to find oversharing in SharePoint Online: what to look for, how native Microsoft tools help, and where Cognillo's SharePoint Essentials Toolkit fits in as one option."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [sharepoint-essentials-toolkit, oversharing, cognillo]
faq:
  - q: "What is oversharing in Microsoft 365?"
    a: "Oversharing means content is shared more broadly than intended, for example through organization-wide or anonymous links, or sites open to everyone. It matters more with AI assistants like Copilot, because they can surface content a user is technically allowed to access, even if nobody intended that."
  - q: "Can I fix oversharing with native Microsoft tools alone?"
    a: "In part, yes. SharePoint admin center settings, sharing policies, sensitivity labels and the permissions UI address many cases. Third-party tools can add reporting or bulk actions. What fits depends on your tenant size and licensing, so check Microsoft Learn for current capabilities."
  - q: "Is it safe to remove sharing links in bulk?"
    a: "Only with preparation. Removing links or permissions can cut off people who legitimately need access. Test the cleanup on a pilot site first, document the current state so you can restore it, and tell site owners before you change anything."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

Oversharing is one of those problems that grows quietly. Someone shares a document with a broad link to get a task done, the task finishes, and the link stays. Multiply that across thousands of files and many years, and a tenant ends up with content that is open to far more people than anyone intended.

This article recaps a typical live-demo flow for finding and fixing [oversharing](https://www.m365.fm/entity/oversharing/): what to look for, what Microsoft gives you natively, and where a tool such as the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/) can fit. Cognillo sponsors M365.FM, and statements about the product come from the vendor and were not tested by M365.FM.

## What oversharing actually looks like

Oversharing means content in Microsoft 365 is shared more broadly than intended. The common forms are easy to recognize:

- Sharing links that work for everyone in the organization.
- Anonymous links ("anyone with the link") that are still active.
- Sites or libraries that are open to broad groups.
- Files with many individual permissions that nobody reviews.

Imagine a project team site where a manager once shared a budget spreadsheet with an organization-wide link so a colleague from another department could open it. The project ended, the team moved on, and the link is still valid. Nobody did anything malicious. The access simply outlived its purpose.

This has become more visible because AI assistants like Copilot can surface content to users based on what they are allowed to access. If access is wider than intended, results can show content the owner assumed was effectively private. The assistant does not change who has access; it can make existing access more visible.

## Start with the native tools

Before adding anything, see how far Microsoft's own features take you. The documentation on [Microsoft Learn](https://learn.microsoft.com/) describes the current options, and they change over time, so check there for what applies to your licensing.

The areas worth reviewing are:

- **Tenant and site sharing settings** in the SharePoint admin center, which define the maximum sharing level and the default link type.
- **Sensitivity labels**, which can apply protection and sharing restrictions to content and sites.
- **Site-level permissions and sharing views**, which show who has access to a site, library or item.
- **Link expiration and default link settings**, which reduce the number of long-lived broad links created in the first place.

Native settings are good at prevention: they shape what happens from now on. They are less convenient for the backlog, meaning the years of links and permissions that already exist. That is where reporting and bulk actions come in.

## Inventory before you fix anything

A cleanup that starts with deleting is a cleanup that causes outages. Start by answering three questions:

1. Which sharing links exist, and how broad are they?
2. Which sites and content are open to everyone?
3. Which of that content is actually sensitive or heavily used?

The third question is the one that sets priorities. A broad link to a public cafeteria menu is not the same problem as a broad link to an HR file. Sorting by sensitivity and by how widely something is shared lets you work on the highest risk first instead of trying to fix everything at once.

You can build an inventory with native options and PowerShell, though that takes scripting effort and care. A dedicated tool is one option if reporting is what you need.

## Where the SharePoint Essentials Toolkit fits

According to Cognillo's product page, the SharePoint Essentials Toolkit is aimed at SharePoint site owners and Microsoft 365 administrators and offers reports, permission management, content tools and automation. For this topic, the relevant functions named by the vendor are:

- An oversharing and Copilot readiness report covering sharing links, sites and content open to everyone, heavily shared files that are not labelled, and outdated content with open access.
- Permission reports for sites, folders and items, plus a view of everything one person can access.
- The ability to fix permissions and sharing links directly from reports.
- Governance monitors, including a monitor for permission changes with e-mail notifications.
- Scheduled reports and tasks that can be exported to SharePoint, by e-mail, or to Excel or CSV.

Cognillo's video page lists demo videos, including one on cleaning up sharing links in bulk. The product page also describes fixing permissions and sharing links from reports. When you watch any demo of this kind, pay attention to how safely you can move from "found" to "fixed".

On pricing, the vendor names an annual subscription starting at 2,995 US dollars, cloud licenses from 20 US dollars per user per month, and a free Community Edition limited to 20 SharePoint sites (as of November 2026). Check the product page for current terms. The review site TrustRadius lists ShareGate and LinkFixer Advanced as common alternatives, so it is reasonable to compare options against your own requirements.

## Fixing safely: test first, keep a way back

Whichever route you take, fixing oversharing means changing access, and that carries risk. Removing a link or a permission can lock out people who legitimately depend on it. Bulk actions amplify that effect.

Follow these rules:

- **Test on a pilot site first.** Use a non-critical site or a test tenant and confirm the result before touching production.
- **Record the current state.** Export the report or permission list before changes, so you know what existed and can restore it if needed.
- **Know your way back.** Understand how you would re-grant access, and check what backup or restore options apply to your content.
- **Involve site owners.** Tell them what you plan to change and why. They know which links are still in use.
- **Change in small batches.** Start with the clearest cases, such as old anonymous links on content nobody has opened recently, and check for complaints before widening the scope.

A bulk action that works as designed can still produce the wrong outcome if the underlying assumption was wrong. A report tells you what is shared. It cannot tell you what is still needed.

## Practical takeaways

- Treat oversharing as a backlog problem and a prevention problem. Native sharing settings, default link types and sensitivity labels address the future. Reports and cleanup address what already exists.
- Inventory first: links, open sites, and content that is both broadly shared and sensitive.
- Prioritize by sensitivity and reach, not by volume alone.
- Check Microsoft Learn for the current native capabilities in your licensing before buying anything.
- If you evaluate a tool such as the SharePoint Essentials Toolkit, test it on a pilot site, compare it with alternatives, and remember that vendor statements on functions, speed and price are not independently verified.
- Never run bulk removals without a recorded starting state and a way back.
- Repeat the review on a schedule. Scheduled reports and permission-change monitoring are designed to help with that.
