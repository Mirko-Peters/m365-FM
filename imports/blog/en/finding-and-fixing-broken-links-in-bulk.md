---
title: "Finding and fixing broken links in bulk"
summary: "Broken links in SharePoint usually come from address changes, moves and deleted redirects. This article explains where they hide, what Microsoft documents, and how to plan a bulk fix safely."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [sharepoint-broken-links, sharepoint-essentials-toolkit, cognillo]
faq:
  - q: "Why do links break in SharePoint after a site address change?"
    a: "SharePoint creates a redirect at the old address, so favorites and sharing links keep working. Embedded URLs in web parts such as News or List are not updated and may break. Once a redirect is deleted, bookmarks and links to the old address stop working. Check Microsoft Learn for the current behavior."
  - q: "Does Microsoft provide a general tool to find all broken links in SharePoint Online?"
    a: "The Microsoft Learn pages on site address changes and redirects explain when links break, but they do not describe a general tool for finding broken links across SharePoint Online. Admins often combine manual review with search, scripts or third-party tools. Check Microsoft Learn for any newer options before you decide."
  - q: "How should I approach a bulk fix of broken links?"
    a: "First build an inventory of affected links and group them by cause. Fix a small sample on a pilot site or in a test tenant, and make sure you have a backup or a way back. Only then roll out changes in batches and re-check the results with a fresh scan."
---

A broken link is a link that points to an address that no longer works. In SharePoint this is rarely a single dramatic event. It builds up slowly: a site is renamed, a library is moved, a page is rebuilt, and somewhere a document or a web part still points to the old address.

The problem is hard to see from the admin side. Nobody files a ticket for a link they never clicked. This article explains where [broken links in SharePoint](https://www.m365.fm/entity/sharepoint-broken-links/) come from, what Microsoft documents about them, and how to plan a bulk clean-up without creating new problems.

## Where broken links come from

The most documented cause is a changed site address. According to Microsoft Learn, SharePoint creates a redirect at the previous address when a site address is changed. People who saved the site as a favorite or select a link to the site are sent to the new address, and sharing links redirect automatically.

That sounds reassuring, and for many links it is. But the same documentation lists what is not covered:

- Embedded URLs in SharePoint web parts (News, List and others) are not updated and may break.
- Custom solutions keep their old address dependencies.
- Power Apps custom forms must be recreated.
- SharePoint 2013 workflows must be republished.
- The site must be connected to its hub site again.

Imagine a team site that is renamed after a reorganization. The redirect keeps bookmarks working. But the home page has a Quick links web part with hard-coded addresses to a library on that site, and a handful of Word documents contain links to pages on it. Whether each of those still works is unclear until someone checks.

Moves and deletions are other common causes. A link to a file or page that was deleted or moved to a new location can stop reaching its target. Check Microsoft Learn for how links behave in your specific scenario, as the details depend on what was moved and how.

## Redirects are a temporary safety net

A redirect is not a repair. Microsoft Learn states that a redirect stays until someone deletes it. After deletion, requests to the old address are no longer forwarded. Bookmarks, links and "Shared With Me" references stop working.

This has a practical consequence. If a redirect hides broken links today, the problem is still there. It surfaces later, for example when someone cleans up old redirects. The Learn documentation also notes that a site cannot be renamed this way if it is a hub site, so hub scenarios need their own planning.

A useful mindset: treat a redirect as time bought, not as a fix. The time is best spent finding the links that depend on it and updating them to the current address.

For the exact behavior and current limits, read the Microsoft Learn pages on [changing a site address](https://learn.microsoft.com/en-us/sharepoint/change-site-address) and [managing site redirects](https://learn.microsoft.com/en-us/sharepoint/manage-site-redirects).

## Building an inventory before you fix anything

Before you change a single link, you need to know what is broken and where. The Microsoft Learn pages checked for this article describe how addresses change and when links break. They do not describe a general tool for finding broken links in SharePoint Online. So admins usually combine several approaches:

- **Manual review of high-traffic places:** home pages, navigation, hub sites, and pages with Quick links or News web parts.
- **Search and reports:** looking for the old address or old site name in pages and documents.
- **Scripts:** custom checks that crawl pages or lists. Scripts that change content need the same pilot and backup precautions as any bulk change.
- **Third-party tools:** vendors offer tools built for link inventories and monitoring.

Whatever you choose, record the result in a simple structure. A table with these columns is usually enough: where the link lives (site, page, library, document), what it points to, why it is broken, who owns the content, and the planned fix.

Grouping by cause matters more than it seems. If fifty links are broken because one site was renamed, that is one fix pattern, not fifty separate problems. If they are broken because content was deleted, the fix is a content decision, not a text replacement.

## One example of a dedicated tool

[Cognillo](https://www.m365.fm/entity/cognillo/), a software company from Jersey City, New Jersey, offers the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) for SharePoint administrators and site owners. Cognillo sponsors M365.FM, and the following points are the vendor's own statements, which M365.FM has not tested.

According to the product page, the toolkit's broken link functions include a link inventory, a monitor for broken links, checks of links in Office documents and modern pages, and scans of pages, web parts and navigation. Beyond links, the page lists content tools such as search in pages and web parts and find and replace text, and reports and tasks that can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV. Cognillo's [product page](https://www.cognillo.com/sharepoint-essentials-toolkit) lists the details, and its video page lists demo videos, for example on finding and fixing broken links.

Pricing and editions are the vendor's information and can change. As of November 2026, the vendor names an annual subscription starting at 2,995 US dollars, cloud licenses from 20 US dollars per user per month, and a free Community Edition limited to 20 SharePoint sites. Check the product page for current terms.

This is one option among others. The review site TrustRadius names ShareGate and LinkFixer Advanced as common alternatives. Whether a dedicated tool is worth it depends on the size of your environment, how often addresses change, and how much of the work you can cover with native features and your own scripts. In a small tenant with few address changes, native features and your own checks may be enough; in a larger one with many site owners and frequent restructuring, the decision may differ.

## Fixing links in bulk without making things worse

Bulk changes are where a clean-up can turn into an incident. Find-and-replace across many pages or documents changes content at scale, and a wrong pattern can damage links that were fine.

**Test first and keep a way back.** Before any bulk change, run it on a pilot site or in a test tenant. Make sure you have a backup or another way to restore the previous state, for example saved copies of the affected pages or the version history of the items you change. Do not start a bulk replacement on production content without both.

A sensible order of work:

1. **Define scope.** Pick one cause, such as links to a renamed site, and limit the first run to a small set of sites.
2. **Run a pilot.** Apply the fix on a test site or a copy that resembles production. Open the changed pages and click through the links.
3. **Confirm the way back.** Check that you can undo the change, whether through version history, exported copies or a backup.
4. **Fix in batches.** Roll out in small groups, not all at once. Tell site owners before their content is touched.
5. **Re-scan.** Run the same inventory again and compare. A link that still fails after the change needs a closer look.
6. **Document the pattern.** Write down what broke and why, so the next rename or move includes a link check.

Some fixes are not text replacements at all. Per Microsoft Learn, Power Apps custom forms must be recreated and SharePoint 2013 workflows must be republished after an address change. These need the owners of those solutions, not a bulk tool.

## Practical takeaways

- A site address change creates a redirect, but embedded URLs in web parts such as News or List are not updated and may break. Plan a link check after every rename.
- Redirects stay only until someone deletes them. Do not treat them as a permanent fix.
- Microsoft Learn explains when links break but does not describe a general tool for finding broken links in SharePoint Online. Decide early how you will build your inventory: manual, scripted or with a third-party tool.
- Group broken links by cause. One cause usually means one fix pattern.
- Before any bulk change, test on a pilot site or in a test tenant and make sure you have a backup or a way back.
- Re-scan after every batch and document what you learned.
- If you evaluate tools, compare them against your own needs and check current features and prices on the vendor's site. Vendor claims, including those summarized here, are the vendor's statements until you test them yourself.
