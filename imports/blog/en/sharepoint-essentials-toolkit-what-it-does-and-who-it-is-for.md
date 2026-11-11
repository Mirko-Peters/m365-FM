---
title: "SharePoint Essentials Toolkit: what it does and who it is for"
summary: "The SharePoint Essentials Toolkit from Cognillo bundles reports, permission fixes, broken link checks and migration for SharePoint admins. Here is what the vendor says it does, who it suits and what to check first."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [sharepoint-essentials-toolkit, cognillo, oversharing]
faq:
  - q: "Who is the SharePoint Essentials Toolkit meant for?"
    a: "According to the vendor's product page, it is aimed at SharePoint site owners and Microsoft 365 administrators. It offers reports, permission management, content tools and automation for audits, troubleshooting and routine tasks. These are the vendor's statements and were not tested by M365.FM."
  - q: "Do I have to buy a third-party tool to find oversharing in SharePoint?"
    a: "No. Microsoft 365 includes native reporting and administration options for sharing and permissions, and Microsoft Learn describes them. A third-party tool is one option when you want consolidated reports or bulk fixes from a report. Compare it with the native features first, and test any changes in a pilot."
  - q: "What does the vendor say the toolkit costs?"
    a: "As of November 2026, the vendor names an annual subscription starting at 2,995 US dollars, cloud licenses from 20 US dollars per user per month, and a free Community Edition limited to 20 SharePoint sites. Prices and editions can change, so check the vendor's website for current terms."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

Imagine a SharePoint environment that has grown for years before anyone looks at it closely. Permissions get layered, sharing links pile up, and pages carry links to content that no longer exists. At some point an admin or site owner has to get an overview.

The [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is a product of [Cognillo](https://www.m365.fm/entity/cognillo/) aimed at exactly that kind of work. This article describes what the vendor says it does, who it may suit, and what to check before you choose any tool for this job. The functions, speeds and prices below are the vendor's statements and were not tested by M365.FM. Cognillo sponsors M365.FM.

## What the toolkit is, according to the vendor

Cognillo is the trade name of Tendero, Inc., a software company based in Jersey City, New Jersey. On its website, the company says it has provided enterprise IT solutions since 2012. That is the company's own statement.

The SharePoint Essentials Toolkit is described on the product page as a tool for SharePoint site owners and Microsoft 365 administrators. It offers reports, permission management, content tools and automation for audits, troubleshooting and routine tasks. The page names SharePoint Online and also lists support for SharePoint on-premises versions in its feature table.

Cognillo also names a second product on its video page, Genta Automation, a generative AI platform for quality assurance. It is a separate topic and not part of this article.

## The main functions at a glance

The vendor's product page groups the functions into several areas.

**Permissions**
- Permission reports for sites, folders and items
- Showing everything one person can access
- Replacing one user with another
- Fixing permissions and sharing links from reports

**Oversharing and Copilot readiness**
- A report on sharing links, sites and content open to everyone
- Heavily shared files that are not labelled
- Outdated content with open access

**Broken links**
- A link inventory and a monitor for broken links
- Checks of links in Office documents and modern pages
- Scans of pages, web parts and navigation

**Content tools**
- Search in pages and web parts
- Find and replace text
- Copying lists and bulk actions from reports

**Governance**
- Monitors, a dashboard and a monitor for permission changes
- E-mail notifications
- A monitor for storage growth

**Migration and reporting**
- SharePoint-to-SharePoint migration, where the page states 2 to 3 GB per hour and says item IDs, version history and metadata are kept, with verification reports afterwards
- Metadata reports listing items, files, folders and pages with sizes and version counts
- Scheduled reports and tasks, exported to SharePoint, by e-mail, or to Excel or CSV

The migration speed is a vendor figure. Real throughput depends on your environment, so treat it as a claim to check in a pilot.

## Why oversharing is the use case to look at first

[Oversharing](https://www.m365.fm/entity/oversharing/) means content that is shared more broadly than intended, for example through organization-wide or anonymous links. It matters more with AI assistants like Copilot, because they can surface content to users who already have access, even if nobody noticed that access.

Imagine a team site where a project folder was shared with "everyone in the organization" for a one-off review and never closed again. Nobody has opened the folder in a long time, but a search or an AI assistant can still bring its contents to people who were never meant to see them.

Finding such cases is the first problem. The toolkit's oversharing report is described as covering sharing links, sites and content open to everyone, heavily shared files that are not labelled, and outdated content with open access. Whether that fits your tenant is something a pilot will show.

Microsoft 365 has native features for this as well, and they come first. Microsoft Learn documents the sharing and permission options in SharePoint and the related admin reporting. Start from the [SharePoint documentation on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/) and check what your licenses already include before you consider anything else.

## Who might benefit, and who might not

Based on the vendor's description, the toolkit is built for two groups.

- **Microsoft 365 admins** who need tenant-wide views of permissions, sharing links and storage, and want scheduled exports for audits.
- **Site owners** who need to understand who can access their site and fix problems such as broken links without writing scripts.

A small tenant with a few sites may get by with native features. The vendor's free Community Edition, limited to 20 SharePoint sites, could be a way to try the tool on a small scope. Larger tenants with many sites, frequent restructuring or audit requirements may find consolidated reports and scheduled exports more useful, but that depends on your situation.

Pricing as named by the vendor in November 2026: an annual subscription starting at 2,995 US dollars, cloud licenses from 20 US dollars per user per month, and the Community Edition mentioned above. Check the vendor's website for current terms, since prices and editions can change.

The review site TrustRadius names ShareGate and LinkFixer Advanced as common alternatives. Other options include native Microsoft features and PowerShell scripts maintained in-house. The right choice depends on your size, skills and requirements.

## Test before you change anything

Reports are generally lower risk than changes. Fixes are not. Several functions the vendor lists can change access or content: fixing permissions and sharing links from reports, replacing one user with another, find and replace, bulk actions, and migration.

Before you run any of them:

- **Test first** on a pilot site or in a test tenant, not on production content.
- **Have a way back.** Know how you would restore the previous state, for example through a backup, an export of the original permissions report, or the recycle bin and restore options described on Microsoft Learn.
- **Start narrow.** Apply a bulk change to a small group of items, check the result, then widen the scope.
- **Tell the owners.** Removing a sharing link can break a workflow for someone who relied on it.

After a migration, use the verification reports the vendor describes and compare the result with the source yourself.

## Practical takeaways

- Start with visibility. Reports on permissions, sharing links and broken links change nothing by themselves and help show how big the problem is.
- Use native Microsoft 365 features first and see what Microsoft Learn documents for your licenses. Add a third-party tool only if a gap remains.
- If you try the SharePoint Essentials Toolkit, the Community Edition (up to 20 sites, per the vendor) is a low-commitment way to test it on a limited scope.
- Treat the vendor's figures, such as migration speed, as claims to verify in your own pilot.
- Put oversharing on your list before a Copilot rollout, because AI assistants can surface content that is open more widely than intended.
- Never run bulk permission or content changes without a pilot and a way back.
