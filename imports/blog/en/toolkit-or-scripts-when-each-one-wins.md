---
title: "Toolkit or scripts? When each one wins"
summary: "Scripts and a packaged toolkit solve different problems in SharePoint administration. This article compares PnP PowerShell and the SharePoint Essentials Toolkit and shows where each approach fits, so you can choose by task, team and risk."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [sharepoint-essentials-toolkit, pnp-powershell, cognillo]
faq:
  - q: "Can I use PnP PowerShell and a toolkit together?"
    a: "Yes. They are not mutually exclusive. One possible split is scripts for repeatable, automated jobs and a graphical tool for ad hoc reports and reviews with site owners. Choose per task. Whichever you use, test changes on a pilot site first and make sure you have a way back."
  - q: "Is PnP PowerShell free to use?"
    a: "PnP PowerShell is an open-source module maintained by the community. Free in terms of licence does not mean free of effort: you need PowerShell skills, time to write and maintain scripts, and a process for testing and reviewing them before they touch production."
  - q: "When does a script beat a graphical tool?"
    a: "Scripts tend to fit best when a task must run the same way many times, needs to be versioned and reviewed like code, or is too specific for a general tool. A graphical tool tends to fit when people without scripting skills need reports or one-off fixes. Which fits depends on your tasks and team."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

Every SharePoint admin eventually faces the same choice. A task shows up, such as finding broken links, reviewing who has access to what, or cleaning up sharing links, and you have to decide: write a script, or use a tool that already has a screen for it?

There is no universal winner. The better question is which approach fits the task, the person doing it and the risk involved. This article compares scripting with [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/) and a packaged tool, using the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) as one example of the second group.

## Start with native features

Before you pick either, check what Microsoft 365 already gives you. SharePoint Online has built-in sharing settings, site permission pages and reporting options, and Microsoft documents them on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/). Which of these are available can depend on your licences and tenant settings, so check the documentation for your setup.

Native features often cover a lot of everyday needs. Scripts and tools earn their place where the built-in options stop: bulk operations, cross-site reports, scheduled exports or tasks that need custom logic. Knowing that boundary keeps you from adding tooling you do not need.

## What scripts do well

PnP PowerShell is an open-source PowerShell module maintained by the community. It is used to manage SharePoint, Teams and Microsoft 365 through Microsoft Graph and CSOM. Scripts have some clear strengths:

- **Repeatability.** A script runs the same way every time, and you can schedule it with the automation platform you already use.
- **Review and versioning.** Script files can live in source control, be peer reviewed and be rolled back like any other code.
- **Fit to your case.** If your tenant has a specific naming convention, template or approval step, you can encode exactly that.
- **Open source.** The module itself is open source, so the cost sits mainly in skills and time. Check the module's licence terms on its project page.

Imagine a company that provisions a new project site each week and always needs the same libraries, columns and permission groups. That is a strong script candidate: the steps are known, the result is checkable, and the job repeats.

## Where scripts get expensive

The costs of scripting are mostly hidden. Someone has to write the script, understand authentication and permissions for the module, handle errors and keep it working as the module and Microsoft 365 change. Check the module's current documentation and requirements before you build on it, because details such as authentication methods can change over time.

Other costs are about people. A script that only one admin understands becomes a risk when that person is away. Output from a script is also plain data unless you build the reporting layer yourself, which may not suit a site owner or a compliance reviewer who just wants to see who has access.

Risk deserves its own mention. A script that changes permissions or deletes content can do a lot of damage quickly, including across many sites, if it has a bug or runs against the wrong target. Treat every changing script like a production change:

- Run it first on a pilot site or in a test tenant.
- Use a read-only or "what-if" mode where you can, and review the output before the real run.
- Make sure you have a backup or a documented way back before touching production.

## What a packaged tool does well

A packaged tool trades flexibility for convenience. According to the vendor's product page, the SharePoint Essentials Toolkit from [Cognillo](https://www.m365.fm/entity/cognillo/) is aimed at SharePoint site owners and Microsoft 365 administrators and offers reports, permission management, content tools and automation for audits, troubleshooting and routine tasks. Cognillo sponsors M365.FM, and the statements below are the vendor's own, not tested by M365.FM.

The vendor lists these areas:

- **Permission reports** for sites, folders and items, including showing everything one person can access and replacing one user with another.
- **Oversharing and Copilot readiness reports**, covering sharing links, content open to everyone and heavily shared files that are not labelled.
- **Broken link tools**, with a link inventory and monitor, plus checks of links in Office documents and modern pages.
- **Governance monitors**, such as a monitor for permission changes, e-mail notifications and a monitor for storage growth.
- **SharePoint-to-SharePoint migration**, where the vendor says item IDs, version history and metadata are kept and verification reports follow the migration.
- **Scheduled reports and exports** to SharePoint, e-mail, Excel or CSV.

The main benefit is the audience. Someone who does not write PowerShell, such as a helpdesk member or a site owner, can open a report and act on it. For recurring reviews, such as a monthly look at sharing links, a ready-made report and a schedule are designed to reduce the effort of building both yourself.

The product page also names prices as of November 2026: an annual subscription starting at 2,995 US dollars, cloud licenses from 20 US dollars per user per month, and a free Community Edition limited to 20 SharePoint sites. Prices and editions change, so confirm them on the [vendor's product page](https://www.cognillo.com/sharepoint-essentials-toolkit) before you plan a budget.

## Where tools fall short

A general tool cannot know your organisation's specific rules. If your process needs an unusual approval chain or a custom data transformation, you may end up working around the tool or writing a script anyway.

There is also the question of fit and trust. Any tool that reads or changes permissions needs access to your tenant, so review how it authenticates, what permissions it requests and what your security team requires. Compare more than one option as well: the review site TrustRadius names ShareGate and LinkFixer Advanced as common alternatives to Cognillo's offering, and your own requirements should decide, not a feature list from any single vendor.

The same safety rule applies. Bulk actions launched from a report, such as fixing permissions or sharing links in bulk, change access. Try them on a pilot site first and have a way back before you run them in production.

## A simple way to decide

You do not need a grand strategy. Ask a few questions per task:

1. **Who runs it?** If the answer includes non-scripters, lean toward a tool or a built-in feature.
2. **How often?** A job that repeats on a fixed schedule favours automation, whether script or tool-based scheduling.
3. **How specific is it?** The more your process deviates from the standard, the more a script helps.
4. **How risky is it?** Anything that deletes, restores, migrates or changes access needs a pilot, a backup and review, whatever you use.
5. **Who maintains it?** Scripts need an owner. Tools need a licence, a vendor review and an owner too.

A mix is a possible outcome: scripts for the repeatable provisioning and automation jobs, a tool or native reports for audits and reviews with business owners. That is not a failure to choose.

## Practical takeaways

- Check native Microsoft 365 features first and note where they stop.
- Use scripts such as PnP PowerShell when a task is repeatable, specific to you and worth maintaining as code.
- Consider a packaged tool, such as the SharePoint Essentials Toolkit, when non-scripters need reports or fixes, and compare it with other options.
- Treat vendor claims on speed, features and prices as claims until you have checked them in your own tenant.
- Test every change that touches permissions, sharing or content on a pilot site or test tenant first.
- Have a backup or a documented way back before any bulk change.
- Assign an owner to every script and every tool so nothing depends on one person's memory.
