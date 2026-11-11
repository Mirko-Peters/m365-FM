---
title: "Migrating lists and libraries without breaking links"
summary: "Migrating SharePoint lists and libraries goes more smoothly when you know which links can break, how redirects behave, and how to check links before and after the move."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [sharepoint-migration, sharepoint-broken-links, sharepoint-essentials-toolkit]
faq:
  - q: "Does a SharePoint migration delete the source files?"
    a: "No. Microsoft Learn describes migration as copying content into SharePoint and OneDrive in Microsoft 365, and states that the source files are not deleted. That gives you a fallback, but you should still keep the source untouched until you have verified the migrated content and its links."
  - q: "Why do links break after a site address change?"
    a: "SharePoint creates a redirect at the previous address, so favorites and sharing links keep working. Embedded URLs in web parts such as News or List are not updated and may break. Redirects also stop forwarding requests once someone deletes them."
  - q: "Which tools does Microsoft name for SharePoint migration?"
    a: "Microsoft Learn names the Migration Manager in the SharePoint admin center for sources such as file shares and other cloud services, and the SharePoint Migration Tool (SPMT) for SharePoint Server 2010, 2013 and 2016. Third-party tools exist as well. Check Microsoft Learn for the current state."
---

A [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) moves content from file shares, other cloud services or older SharePoint Server versions into SharePoint and OneDrive in Microsoft 365. According to Microsoft Learn, migrating copies the files and the source files are not deleted. That is a useful safety net, but it says nothing about whether the links to and inside that content still work afterwards.

Links are one place where migrations can cause problems in daily work. A library arrives complete, yet a news page points to the old address, a document refers to a folder that moved, and a navigation entry leads nowhere. This article looks at where links break, what to prepare, and how to verify the result.

## Where links break during and after a migration

A [broken link in SharePoint](https://www.m365.fm/entity/sharepoint-broken-links/) is a link that no longer reaches its target. Microsoft Learn describes the typical trigger: an address changes. When a site address is changed, SharePoint creates a redirect at the previous address. People who saved the site as a favorite or select a link to the site are sent to the new address, and sharing links redirect automatically.

The limit is stated just as clearly. Embedded URLs in SharePoint web parts, for example News or List, are not updated and may break. Microsoft Learn also lists further consequences of an address change: custom solutions keep their old address dependencies, Power Apps custom forms must be recreated, SharePoint 2013 workflows must be republished, and a site must be connected to its hub site again.

Redirects are not permanent by default. A redirect stays until someone deletes it. After deletion, requests to the old address are no longer forwarded, and bookmarks, links and "Shared With Me" references stop working.

Imagine a team site whose home page has a List web part and a News web part that both point to the old site address. After the move, the site itself opens through a redirect, so nobody notices at first. Months later the redirect is cleaned up, and the web parts quietly stop working. That delayed failure is why a one-time check right after the move is not enough.

## Know your source before you move anything

Before choosing a tool, take stock of what you actually have. Microsoft names different tools for different sources: the Migration Manager in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares, and the SharePoint Migration Tool (SPMT) for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages. The Microsoft Learn page also says that the Mover tool is retired for admin-led migrations. Check [Microsoft Learn on migrating to SharePoint](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) for the current state, because tools and supported scenarios change.

A practical inventory for lists and libraries could cover:

- **Internal links:** links between documents, pages and lists in the same site or collection
- **Embedded URLs:** web parts, navigation, quick links and page content that contain absolute addresses
- **Links in Office documents:** references to other files, often forgotten
- **Workflows and forms:** classic SharePoint Server workflows should be rebuilt as Power Automate flows, according to Microsoft
- **External references:** bookmarks, emails and other systems that point at the old location

Write down which of these are in scope. Links in other systems are outside the scope of what the Microsoft documentation used here describes, so plan separately for them, for example with a communication plan.

## Plan the target structure and the redirect strategy

Links can break when the structure changes: new site names, flattened folder trees, merged libraries. Each change is a place where a link can lose its target. Decide early whether you can keep the structure stable. If you cannot, build a simple mapping from old locations to new ones. Even a spreadsheet with old path, new path and owner can help with the later link check.

For address changes inside Microsoft 365, rely on the documented redirect behaviour, but treat it as a bridge, not a permanent solution. Microsoft Learn describes how [changing a site address](https://learn.microsoft.com/en-us/sharepoint/change-site-address) works and how [site redirects](https://learn.microsoft.com/en-us/sharepoint/manage-site-redirects) behave, including the point that a redirect remains until someone deletes it. Note that a site cannot be renamed this way if it is a hub site. Plan the fixing of embedded URLs while the redirect is still in place, so that you can delete the redirect later without side effects.

For large data volumes over a limited network connection, Microsoft names Azure Data Box as an option. For migration teams that should not have full SharePoint admin access, Microsoft describes a Migration Administrator role.

## Run a pilot and test with real content

Any migration that changes data or access should start with a pilot. Choose a test site or a test tenant, migrate a representative library and list, and check the result with the people who use it. Pick content that contains the awkward cases: deep folder structures, pages with web parts, documents with internal links, and items with custom metadata.

Keep the source in place until the result is verified. Since migration copies rather than moves, you have a way back, but only if nobody edits the source in the meantime or if you have a plan for syncing changes. For anything beyond the pilot, make sure a backup or a documented way back exists before you start bulk actions, and do not delete redirects or source content until the checks are done.

A simple pilot checklist:

1. Open a sample of migrated pages and follow every link on them.
2. Open documents with links to other files and test those links.
3. Check navigation, quick links and hub site connections.
4. Verify that sharing links and permissions behave as expected.
5. Ask pilot users to work normally for a few days and collect problems.

## Checking links before and after, and where a tool can help

Microsoft Learn explains how addresses change and when links break. The pages used for this article do not describe a general tool for finding broken links across SharePoint Online, so manual checks, scripts or third-party tools are options for that job.

One example is the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/). According to the vendor's product page, it includes a link inventory, a monitor for broken links, checks of links in Office documents and modern pages, and scans of pages, web parts and navigation. The vendor also names content tools such as find and replace text, and SharePoint-to-SharePoint migration that keeps item IDs, version history and metadata, with verification reports afterwards. These are the vendor's statements and were not tested by M365.FM; Cognillo sponsors M365.FM. The vendor also names a free Community Edition limited to 20 SharePoint sites. Check the current terms on the product page. Other tools exist as well, and the review site TrustRadius names ShareGate and LinkFixer Advanced as common alternatives.

Whatever you use, apply the same rule. Run the link check before the migration to know your baseline, and again afterwards to compare. Fix issues in a test environment first, and be careful with find-and-replace or bulk actions on live content: test on a pilot site and make sure you can go back.

## Practical takeaways

- Migration copies content; whether links keep working has to be checked.
- Embedded URLs in web parts are not updated when an address changes and may break.
- Redirects help only until someone deletes them, so fix links while the redirect still exists.
- Take an inventory of internal links, embedded URLs, Office document links, workflows and external references before you start.
- Keep the structure stable where you can, and keep a mapping of old to new locations where you cannot.
- Run a pilot on a test site or tenant, and keep the source and a way back until everything is verified.
- Check links before and after the move, manually or with a tool, and compare the results.
- Check Microsoft Learn for the current tools and supported scenarios before you plan.
