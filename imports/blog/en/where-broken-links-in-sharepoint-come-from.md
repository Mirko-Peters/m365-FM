---
title: "Where broken links in SharePoint come from"
summary: "Broken links in SharePoint usually start with an address change, a move or a deleted redirect. Learn where they come from, which embedded links Microsoft says will not update, and how to plan around it."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [sharepoint-broken-links, sharepoint]
faq:
  - q: "Why do links break after a SharePoint site address change?"
    a: "SharePoint creates a redirect at the old address, so favorites, selected links to the site and sharing links are forwarded. Embedded URLs, for example in web parts such as News or List, are not updated according to Microsoft Learn and may break. Custom solutions also keep their old address dependencies."
  - q: "Do SharePoint redirects stay forever?"
    a: "A redirect stays until someone deletes it. After deletion, requests to the old address are no longer forwarded, and bookmarks, links and Shared With Me references stop working. Check the redirect documentation on Microsoft Learn before removing any redirect, and test the effect first."
  - q: "Does Microsoft provide a tool to find all broken links in SharePoint Online?"
    a: "The Microsoft Learn pages on changing site addresses and managing redirects explain how addresses change and when links break, but they do not describe a general tool for finding broken links in SharePoint Online. Vendors such as Cognillo offer their own tools for that purpose."
---

A broken link points to an address that no longer works. In [SharePoint](https://www.m365.fm/entity/sharepoint/), that can happen in documents, pages, web parts and metadata, and it rarely happens at random. Most of the time there is a specific event behind it: an address change, a move, or a redirect that someone removed.

Knowing these causes helps you plan changes so that fewer links break, and helps you find the ones that do. This article follows what Microsoft Learn documents about site addresses and redirects, and what that means for [broken links in SharePoint](https://www.m365.fm/entity/sharepoint-broken-links/).

## What a broken link is in SharePoint

A link breaks when its target no longer answers at the address stored in the link. SharePoint content stores many such addresses in many places:

- Links inside Office documents that point to other files or sites
- Hyperlinks on pages and in web parts, such as News or List
- Navigation links in site menus and hub navigation
- Address values stored in list columns or other metadata
- Links in custom solutions, forms and workflows

Each of these places holds its own copy of an address. When the target changes, the copy does not necessarily change with it. That is the core of the problem: the link and the target are separate things, and only some mechanisms keep them in sync.

## Site address changes: what SharePoint forwards and what it does not

Microsoft Learn describes what happens when a site address is changed. SharePoint creates a redirect at the previous address. People who saved the site as a favorite, or who select a link to the site, are sent to the new address. Sharing links also redirect automatically.

That covers a lot, and it is the reason many address changes go unnoticed by end users. But the documentation is equally clear about the limit: embedded addresses are not updated. In the words of Microsoft Learn, any embedded URLs in SharePoint web parts (News, List and so on) won't be updated and may break.

Imagine a team site called "Projects-2023" that is renamed to "Programs". Someone who opens a bookmarked link to the site lands on the new address through the redirect. But a News web part on the intranet home page that contains a hard-coded link to a page on the old address is not updated and may break, as Microsoft Learn notes for embedded URLs. Whether such a link keeps working in practice can depend on the redirect, which brings us to the next point.

The Microsoft Learn page on changing a site address lists further effects of a change. The following consequences are documented:

- Custom solutions keep their old address dependencies.
- Power Apps custom forms must be recreated.
- SharePoint 2013 workflows must be republished.
- A site must be connected to its hub site again.

These are not broken links in the narrow sense, but they show the same pattern: an address change reaches some things automatically and others only when someone acts. Before you change an address, read the current documentation on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/change-site-address) and check whether any of these apply to your site.

Also note a documented restriction: a site cannot be renamed this way if it is a hub site.

## Redirects only help while they exist

A redirect stays until someone deletes it. That sentence from the documentation matters more than it looks.

While the redirect exists, old links to the site keep working. Once it is deleted, requests to the old address are no longer forwarded. Bookmarks, links and "Shared With Me" references stop working. Links that were quietly being rescued by the redirect now fail all at once.

Imagine an admin who tidies up old redirects after a reorganisation, because the list looks cluttered. If nobody checked which links still depend on those redirects, the clean-up can produce a wave of "page not found" messages weeks after the rename, when nobody connects the two events.

Deleting a redirect changes how links behave, so it should not be assumed to be harmless. Treat it like any other change that affects access to content:

1. Try the change first on a pilot site or in a test tenant.
2. Note down which redirects you remove, so you have a way back and can recreate the old address situation if needed.
3. Review the steps on the [redirect management page](https://learn.microsoft.com/en-us/sharepoint/manage-site-redirects) of Microsoft Learn before you act, because the exact behaviour and options are described there.

## Other places where links go stale

The Microsoft Learn pages used for this article focus on address changes and redirects. The same general logic can apply to other situations in which the target of a link changes while the link itself stays untouched. Whether and how a specific situation is handled depends on the feature, so check Microsoft Learn for the details of the one you use.

Typical situations to think about:

- **Content that is moved or deleted.** A link that points to a file path may stop working when the file lands somewhere else or is removed. How links behave after a move depends on the feature used, so check Microsoft Learn.
- **Structural reorganisations.** Merging or splitting sites changes many addresses at once, and every copy of the old address in documents, pages and metadata is a candidate for failure.
- **Copied content.** A page or document copied from one site to another carries its links along. If those links were absolute, they still point to the original location.
- **Old documents.** Files that were written years ago may contain links to locations that were reorganised several times since.

None of these is specific to one tool. They follow from the simple fact that links store addresses and that SharePoint content is rarely static.

## Finding broken links

The Microsoft Learn pages checked for this article describe how addresses change and when links break. They do not describe a general tool for finding broken links in SharePoint Online. So if you want a systematic overview, you either check by hand, build something yourself, or look at tools from other vendors.

Vendors such as Cognillo offer their own tools for finding broken links in SharePoint; see [www.cognillo.com](https://www.cognillo.com) for what they offer. If you consider any third-party tool, evaluate it as you would any other: test it on a pilot site first, check what permissions it needs, and compare it with your requirements and with other options.

A manual check is realistic for small, important areas, such as the start page of an intranet, a few hub navigation menus and the web parts that editors maintain. For larger environments the effort grows quickly, which is why planning address changes carefully matters more than cleaning up afterwards.

## Practical takeaways

- **Know what the redirect covers.** Favorites, selected site links and sharing links are forwarded after an address change. Embedded URLs in web parts such as News or List are not updated.
- **Do not delete redirects casually.** A redirect stays until deleted, and after deletion old links, bookmarks and "Shared With Me" references stop working. Test first on a pilot site or in a test tenant, and keep a record so you have a way back.
- **Check the follow-up work for an address change.** Custom solutions, Power Apps custom forms, SharePoint 2013 workflows and hub site connections can need attention. A hub site cannot be renamed this way at all.
- **List high-value pages before a change.** Home pages, hub navigation and pages with News or List web parts are good candidates for a manual link check after a rename.
- **Check how the features you use store links,** and read Microsoft Learn for the behaviour of the specific feature before you rely on it.
- **Decide how you will find broken links.** Microsoft Learn does not describe a general tool for SharePoint Online, so choose a manual, scripted or vendor approach on purpose, and pilot it first.
