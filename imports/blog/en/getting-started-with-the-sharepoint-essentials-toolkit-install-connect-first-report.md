---
title: "Getting started with the SharePoint Essentials Toolkit: install, connect, first report"
summary: "A practical walkthrough for SharePoint admins: what to check before installing the SharePoint Essentials Toolkit, how to connect it safely, and how to run a first read-only permissions report."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [sharepoint-essentials-toolkit, cognillo]
faq:
  - q: "Should I test the SharePoint Essentials Toolkit before using it in production?"
    a: "Yes. Start with a pilot site or a test tenant, run read-only reports first, and only then move to actions that change permissions or content. Make sure you have a backup or another way back before any fix, replacement or bulk action touches production data."
  - q: "What can the SharePoint Essentials Toolkit report on?"
    a: "According to the vendor's product page, it covers permission reports for sites, folders and items, sharing links, oversharing, broken links, metadata with sizes and version counts, and scheduled exports. Features and prices are vendor statements and were not tested by M365.FM, so verify them against your needs."
  - q: "Is there a way to try the toolkit without a paid license?"
    a: "The vendor names a free Community Edition limited to 20 SharePoint sites, as of November 2026. Check the product page for current terms, prices and edition details before you plan a trial, because these can change."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

A new admin tool is easiest to judge when you start small. Before you point anything at your whole tenant, you want to know what the tool can see, which account it uses and what its first report actually tells you.

This article walks through that first session with the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/): what to prepare, how to think about the connection, and how to run and read a first report without changing anything. Cognillo sponsors M365.FM. Statements about features, prices and speed come from the vendor and were not tested by M365.FM, so check the [product page](https://www.cognillo.com/sharepoint-essentials-toolkit) for current details.

## What the toolkit is, and what to check first

According to the vendor, the SharePoint Essentials Toolkit is aimed at SharePoint site owners and Microsoft 365 administrators. The product page describes reports, permission management, content tools and automation for audits, troubleshooting and routine tasks. It names SharePoint Online and also lists support for SharePoint on-premises versions in its feature table.

Before you install anything, settle a few basics (for example in a test tenant or on a pilot site):

- **Which environment?** SharePoint Online, on-premises, or both. The vendor's feature table is the place to confirm what is supported for your version.
- **Which edition?** The vendor lists a free Community Edition limited to 20 SharePoint sites, as of November 2026. Prices and editions can change, so confirm them on the vendor's site rather than relying on a blog post.
- **Who approves it?** An external tool that reads permissions and content is a security and compliance topic. Involve whoever owns that in your organisation before the first connection.

Also check the vendor's current installation and system requirements. This article does not describe individual install steps, because the available facts do not cover them. Follow the vendor's own instructions for the setup itself.

## Prepare a pilot scope

The most useful preparation is choosing what the tool may look at first. Do not begin with the whole tenant.

Imagine a team site that has existed for a few years. It has a handful of document libraries, a few folders with unique permissions and some sharing links created by different people. A site like this is a good pilot: it is small enough to review by hand, and it is typical enough that the report will show something worth reading.

If you have a test tenant, use it. If you do not, pick a pilot site that is not business critical and whose owners know that you are reviewing it. Write down the questions you want the first report to answer, for example:

- Who has access to this site, and through which groups or direct assignments?
- Are there folders or items with their own permissions?
- Are there sharing links, and who can use them?

Having questions in advance keeps the session from turning into scrolling through output. It also gives you a way to judge whether the report is useful for your work.

## Think about the connection and the account

Any tool that reads SharePoint needs an identity and permissions in your tenant. The details depend on the vendor's setup and on your environment, so follow the vendor's documentation for the exact mechanism. What you can decide on your side is the principle.

As a general principle, give the tool the least access that lets you do the task at hand. If your first goal is reporting, avoid connecting with an account that can change everything unless the vendor's setup requires it. Where the setup lets you choose, a dedicated account or identity that is documented and reviewable is generally easier to audit than a personal admin account, for example when you want to see later what was done or revoke access. Check the vendor's documentation for what its setup supports.

For background on how access works in Microsoft 365 itself, see the [Microsoft 365 documentation on Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/) and the [SharePoint documentation](https://learn.microsoft.com/en-us/sharepoint/). Understanding the native permission model first makes any report easier to interpret.

Also note who can see the results. A permissions report is itself sensitive: it can reveal who has access to what. Decide where reports are stored and who may open them.

## Run a first read-only report

The vendor's product page lists permission reports for sites, folders and items, and a view of everything one person can access. A permissions report on your pilot site is a sensible first run because it only reads data.

A simple first session could look like this:

1. Select the pilot site only.
2. Run a permissions report for the site and its libraries.
3. Export the result, if the tool allows it, so you can compare it later.
4. Compare the output with what you already know about the site.

The comparison in step 4 matters. If the report matches what you expect, that builds trust in the tool for this kind of question. If it shows something you did not expect, such as a person you did not know had access, you have found either a useful finding or a gap in your understanding. Either is worth knowing before you scale up.

The vendor also describes reports on sharing links, oversharing, broken links and metadata with sizes and version counts. Once the permissions report makes sense, you can try one of these on the same pilot site. Run them one at a time so you can tell which output belongs to which question.

## Read the output, then decide about changes

Reading a report and acting on it are two different steps, and they carry different risk.

According to the vendor, reports can be used to fix permissions and sharing links, replace one user with another, and run bulk actions. Those are changes. They can alter who has access to content, and a wrong change can lock people out or expose content more widely than intended.

Before you use any action that changes access or content:

- **Test first.** Run the action on a pilot site or in a test tenant, not on production.
- **Have a way back.** Export the current permissions or take a backup before the change, so you have a way to restore the previous state if something goes wrong. Restoring itself is a risky action, so rehearse it on a pilot site as well.
- **Start small.** Apply a change to a handful of items and verify the result before you repeat it more widely.
- **Check native options.** Many changes can also be made with built-in SharePoint features. Check Microsoft Learn for what the native options cover, and compare the effort and the audit trail of each route.

Read the output with a critical eye, too. A report shows a snapshot. Decide with the site owner whether an unusual permission is a mistake or a deliberate choice before you change it.

## Scheduling, migration and the bigger picture

After a successful first report, you may want to repeat it. The vendor describes reports and tasks that can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV. A recurring permissions or sharing report is designed to help you see how a site changes over time. Decide who receives scheduled exports and where they land, since they contain access information.

The vendor also lists SharePoint-to-SharePoint migration, stating that item IDs, version history and metadata are kept and that verification reports follow a migration. It names a throughput of 2 to 3 GB per hour; that is a vendor figure that was not tested by M365.FM, and real results depend on your environment. Treat migration as a separate project. It changes data, so it needs its own pilot, a backup and a rollback plan.

The vendor's [video page](https://www.cognillo.com/videos) lists demo videos, for example on cleaning up sharing links in bulk and on finding and fixing broken links. They may give an impression of the interface before you commit time to a trial.

The review site TrustRadius lists ShareGate and LinkFixer Advanced as common alternatives. Native Microsoft features and other tools are also options, so compare them against your own requirements, such as supported versions, reporting needs, price model and how the tool fits your governance process. Check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/) for what the native features cover.

## Practical takeaways

- Start with a pilot site or test tenant, not the whole tenant.
- Write down the questions you want the first report to answer.
- Connect with the least access that lets you do the task, and document the account.
- Run a read-only permissions report first and compare it with what you already know.
- Before any fix, replacement or bulk action, test on a pilot and make sure you can restore the previous state.
- Treat reports and scheduled exports as sensitive, and decide who may see them.
- Confirm editions, prices, supported versions and setup steps on the vendor's site; they can change, and the figures here are vendor statements that M365.FM did not test.
