---
title: "Cognillo: the company behind the toolkit"
summary: "Who is Cognillo? A look at the Jersey City software company behind the SharePoint Essentials Toolkit and Genta Automation, what it says about itself, and what to check before you evaluate its tools."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [cognillo, sharepoint-essentials-toolkit, genta-automation]
faq:
  - q: "Who is behind the SharePoint Essentials Toolkit?"
    a: "The SharePoint Essentials Toolkit is a product of Cognillo, the trade name of Tendero, Inc., a software company based in Jersey City, New Jersey. On its website, the company says it has provided enterprise IT solutions since 2012. That is the company's own statement, and M365.FM did not verify it independently."
  - q: "What is the difference between the SharePoint Essentials Toolkit and Genta Automation?"
    a: "According to Cognillo, the SharePoint Essentials Toolkit is aimed at SharePoint Online administrators and site owners and covers reports, permissions, broken links, content tools and migration. Genta Automation is a generative AI platform for quality assurance, where testers describe in plain language what an application should do. They serve different audiences."
  - q: "Does Cognillo sponsor M365.FM, and can I trust the product descriptions?"
    a: "Yes, Cognillo sponsors M365.FM, and content about it is marked as sponsored. Statements on features, prices and speed come from the vendor's own pages and were not tested by M365.FM. Check the vendor pages and test any tool in a pilot environment before relying on it."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

Choosing a tool for SharePoint administration usually starts with a feature list. It is just as useful to ask who builds the tool, what they say about themselves, and which of those statements you can check yourself.

This article looks at [Cognillo](https://www.m365.fm/entity/cognillo/), the company behind the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) and [Genta Automation](https://www.m365.fm/entity/genta-automation/). It sticks to what the company states publicly and is clear about where that stops.

## Who Cognillo is

Cognillo is the trade name of Tendero, Inc. The legal name appears as "Tendero, Inc. d/b/a Cognillo". The company is a software company located at 201 Montgomery Street, 2nd Floor, in Jersey City, New Jersey, USA.

On its website, Cognillo says: "Since 2012, we've provided solutions for the constantly evolving world of enterprise IT." That is the company's own statement. The sources do not name a founding year, so this article does not give one either.

Cognillo names two products on its video page: the SharePoint Essentials Toolkit and Genta Automation. The review site TrustRadius lists five further parts of the suite under their own names: SharePoint Permissions Management, Copy & Migration, Broken Link Manager, Analytics and Site Auditing, and Governance & User Activity. Cognillo does not present these as separate products on its own pages, so M365.FM does not list them as separate entries.

A transparency note: Cognillo sponsors M365.FM. Everything in this article about the company's products comes from the vendor's own pages and was not tested by M365.FM.

## The SharePoint Essentials Toolkit

According to the product page, the toolkit is aimed at SharePoint site owners and Microsoft 365 administrators. It is described as offering reports, permission management, content tools and automation for audits, troubleshooting and routine tasks. The page names SharePoint Online, and its feature table also lists support for SharePoint on-premises versions.

The vendor names these functional areas:

- **Permissions:** reports for sites, folders and items; a view of everything one person can access; replacing one user with another; fixing permissions and sharing links from reports.
- **Oversharing and Copilot readiness:** a report on sharing links, sites and content open to everyone, heavily shared files that are not labelled, and outdated content with open access.
- **Broken links:** a link inventory, a monitor for broken links, checks of links in Office documents and modern pages, and scans of pages, web parts and navigation.
- **Content tools:** search in pages and web parts, find and replace text, copying lists, and bulk actions from reports.
- **Governance:** monitors, a dashboard, a monitor for permission changes, e-mail notifications and a monitor for storage growth.
- **Migration:** SharePoint-to-SharePoint migration. The page says item IDs, version history and metadata are kept, with verification reports after the migration.
- **Metadata reports and scheduling:** lists of items, files, folders and pages with sizes and version counts; reports and tasks can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV.

The product page also states a migration speed of 2 to 3 GB per hour. That is a vendor figure. Real throughput in a Microsoft 365 tenant depends on many factors, so treat it as a claim to verify in your own pilot.

## Genta Automation: a different product for a different audience

Genta Automation is a different kind of product from the toolkit. The vendor describes it as a generative AI platform for quality assurance, aimed at QA leads, software development engineers in test (SDETs) and automation engineers.

According to the product page, users describe in plain language what an application should do. Genta then controls a browser, runs the test on a clean cloud virtual machine and reports pass or fail, with screenshots, logs and failure artifacts. The page says that selectors, unstable waits and idle runners are not needed.

Further functions named by the vendor include test case and suite management, scheduled runs, triggers by webhook or API, environments such as development, staging and production, dashboards with export, role-based access control, API keys and an audit log. Deployment is described as cloud-hosted or on-premises, with self-hosted agents for regulated or air-gapped environments.

For a SharePoint admin, the practical point is mostly one of orientation: Genta is not part of the toolkit, and you can evaluate the toolkit without it. On Cognillo's video page, the Genta walkthrough videos are marked as "coming soon", so demo material for it may be thinner than for the toolkit.

## Prices and editions: what the vendor says

As of November 2026, Cognillo names these prices for the SharePoint Essentials Toolkit:

- an annual subscription starting at 2,995 US dollars,
- cloud licenses from 20 US dollars per user per month,
- a free Community Edition limited to 20 SharePoint sites.

For Genta Automation, the vendor names a free plan and paid plans starting at 29 US dollars per month.

These are vendor statements and can change. Check the current product pages before you plan a budget, and confirm in writing what a license covers for your tenant size and use case.

TrustRadius names ShareGate and LinkFixer Advanced as common alternatives to the toolkit. Whether any of them fits depends on your requirements, so compare them against your own checklist rather than against a ranking.

## How to evaluate a tool like this

Native Microsoft 365 features come first. Before adding any third-party tool, check what the SharePoint admin center, its sharing settings and the Microsoft documentation already cover. The [Microsoft Learn SharePoint documentation](https://learn.microsoft.com/en-us/sharepoint/) is the right place to start, and [Microsoft 365 documentation](https://learn.microsoft.com/en-us/microsoft-365/) covers the wider platform.

If you then consider a third-party tool, a few steps keep the evaluation honest:

1. Write down the specific tasks you need, such as a sharing report or a broken link scan, and the gap in native features you are trying to close.
2. Run the tool in a pilot site or test tenant first. Reporting features are low-risk to try, but features that change things, such as replacing users, fixing permissions, bulk actions or migration, can alter access or content.
3. Before any change-making feature touches production, make sure you have a backup or another way back, and that you know how to undo the action.
4. Verify vendor figures, such as speed, in your own environment.

Cognillo's video page lists demo videos, for example on cleaning up sharing links in bulk and on finding and fixing broken links. Demos are useful for understanding the workflow, but they are not a substitute for a pilot with your own data. More information is available on the [Cognillo website](https://www.cognillo.com).

## Practical takeaways

- Cognillo is the trade name of Tendero, Inc., a software company from Jersey City, New Jersey. It says it has offered enterprise IT solutions since 2012; that is its own statement.
- The SharePoint Essentials Toolkit targets SharePoint admins and site owners. Genta Automation is a separate QA product for a different audience.
- Prices, speed and feature claims on vendor pages are the vendor's statements and were not tested by M365.FM. Cognillo sponsors M365.FM.
- Check native Microsoft 365 capabilities first, then decide whether a gap justifies a third-party tool.
- Pilot any tool in a test site or test tenant. Features that delete, change permissions, bulk edit or migrate need a backup or a clear way back before they go near production.
- Compare options against your own requirements, not against a vendor's feature list alone.
