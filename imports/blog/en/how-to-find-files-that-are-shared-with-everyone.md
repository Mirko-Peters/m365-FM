---
title: "How to find files that are shared with everyone"
summary: "Files shared with everyone often go unnoticed until someone searches for them. Learn where to look with built-in Microsoft 365 reports, what those reports leave out, and when a third-party tool can help."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [oversharing, sharepoint-reporting, sharepoint-essentials-toolkit]
faq:
  - q: "What does 'Everyone except external users' mean in SharePoint?"
    a: "It is a built-in group that covers internal users in your organization. If a site, folder or file is shared with this group, internal users can open it, whether or not that was intended. External users are not included, which is where the name comes from. Check Microsoft Learn for the exact scope in your tenant."
  - q: "Which built-in report shows content shared with everyone?"
    a: "The activity reports in the data access governance area of the SharePoint admin center name content shared with 'Everyone except external users'. They require SharePoint Advanced Management and the SharePoint administrator role. Check Microsoft Learn for the current requirements and what each report contains."
  - q: "Does the single-site CSV report show all sharing links?"
    a: "No. According to Microsoft Learn, the report for a single site does not include Anyone links or links that were e-mailed but not clicked. It also shows SharePoint groups but not the individual people inside them. Treat it as a useful starting point, not a complete inventory."
---

Some files are open to far more people than anyone intended. A document gets shared with the whole organization for a quick review, a link is created for convenience, and months later nobody remembers it exists. The file is still there, still reachable, and nobody is watching it.

This article shows how to find that content with built-in Microsoft 365 reports, what those reports do not tell you, and where a third-party tool can fit in.

## What "shared with everyone" actually means

In practice, the term covers several situations. The best known is content shared with the group **Everyone except external users**, which covers internal users in the organization (check Microsoft Learn for the exact scope). Others are organization-wide sharing links and anonymous links, which work for anyone who has the URL.

[Oversharing](https://www.m365.fm/entity/oversharing/) is the broader concept: content shared more widely than intended. It matters for security and privacy, and it matters more with AI assistants. AI assistants such as Copilot can surface content to users who already have access to it, so content that is open too widely can show up in places the owner never expected.

Imagine a team site for a project that ended two years ago. The team shared a planning folder with the whole organization to collect feedback once. Nobody removed the permission. Depending on how the permission was set, a search by an unrelated employee could surface those files. No one did anything wrong recently, but the exposure may still be real.

## Start with the built-in reports

[SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) is the natural first step because it uses Microsoft's own features. Note that the data access governance reports need SharePoint Advanced Management. Microsoft Learn describes two kinds of reports.

**Data access governance reports** live in the SharePoint admin center under Reports, Data access governance. They require SharePoint Advanced Management and the SharePoint administrator role. There are two types:

- **Snapshot reports** show data as of the day they were created. Microsoft Learn names site permissions across the organization and sensitivity labels applied to files.
- **Activity reports** cover the last 28 days. Microsoft Learn names sharing links and content shared with "Everyone except external users".

Microsoft recommends running snapshot reports quarterly and activity reports monthly. Data collection pauses if no report is generated for three months, so a one-off run will not give you a continuous picture. Check the [SharePoint documentation on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) for the current requirements and report list, since licensing and features can change.

## Use the single-site report for a closer look

When you already suspect a specific site, a site admin can create a CSV report of every unique file, user, permission and link on that SharePoint site or OneDrive. The file is saved on the site itself, and Microsoft suggests keeping it in a folder that only site owners can access. The details are in the [sharing reports page on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/sharing-reports).

Read the limits before you rely on it:

- It does **not** include Anyone links.
- It does **not** include links that were e-mailed but not clicked.
- It shows SharePoint groups, but **not the individual people inside them**.

That last point matters. A report line that says a folder is shared with a group tells you the group, not who is in it. If that group is large, the real exposure is hidden one level down. For wider analysis across many sites, Microsoft Learn points to Microsoft Graph Data Connect.

## Where a third-party tool can fit

Built-in reports give you a view. Acting on what you see, across many sites, is a different task, and some organizations look at third-party tools for it. These are one option among several; whether one is needed depends on your size, licensing and how much work you want to do with scripts and the admin center.

One example is the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/), which sponsors M365.FM. According to the vendor's product page, it includes a report on oversharing and Copilot readiness covering sharing links, sites and content open to everyone, heavily shared files that are not labelled, and outdated content with open access. The page also describes permission reports for sites, folders and items, a view of everything one person can access, and the ability to fix permissions and sharing links from reports. Reports can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV. Any fixes made from reports change access, so the test-first and way-back advice below applies to them as well.

These are the vendor's own statements and were not tested by M365.FM. The vendor also names a free Community Edition limited to 20 SharePoint sites, which could be one way to try a tool on a small scope. Prices and editions change, so check the [product page](https://www.cognillo.com/sharepoint-essentials-toolkit) for current details. The review site TrustRadius lists ShareGate and LinkFixer Advanced as common alternatives, so compare options against your own requirements.

## Clean up carefully

Finding the content is the easy part. Removing access is where things go wrong.

Removing a link or permission can immediately cut off people who depend on it: a department that reads a shared folder, a process that relies on a link, or a partner who needs a document. Bulk changes multiply that risk.

Before you change anything:

- **Test first** on a pilot site or in a test tenant, not on production content.
- **Keep a way back.** Export the current permissions and links before you change them, and make sure you know how you would restore access if something breaks. Check Microsoft Learn for what your tenant's backup and restore options cover, and do not assume a removed permission or link can be restored automatically.
- **Change in small batches** and tell site owners what you are doing and why.

A sensible order is to start with the sites where the content is most sensitive, ask the owner whether the sharing is still needed, and only then remove it. Owners know the context; reports do not.

## Practical takeaways

- **Define the problem:** "shared with everyone" can mean the Everyone except external users group, organization-wide links or Anyone links. Search for each separately.
- **Start with the admin center:** data access governance reports need SharePoint Advanced Management and the SharePoint administrator role. Run snapshot reports quarterly and activity reports monthly, as Microsoft recommends.
- **Use the single-site CSV report for detail**, but remember it omits Anyone links, unclicked e-mailed links and the members of SharePoint groups.
- **Do not rely on one report.** Combine sources to get a fuller picture.
- **Consider a tool only if you need one.** Compare options against your size, licensing and workload, and test any tool on a small scope first.
- **Test and keep a way back** before removing permissions or links, and involve site owners before you change anything.
