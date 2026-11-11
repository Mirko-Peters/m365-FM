---
title: "Renaming and moving sites without breaking links"
summary: "Renaming or moving a SharePoint site creates a redirect, but embedded URLs in web parts and custom solutions are not updated. Here is what breaks, what stays intact, and how to plan a change safely."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [sharepoint-broken-links, sharepoint-hub-sites, sharepoint]
faq:
  - q: "Do links break when I change a SharePoint site address?"
    a: "Not all of them. SharePoint creates a redirect at the old address, so favorites, links to the site and sharing links are forwarded. Embedded URLs in web parts such as News or List are not updated and may break. Check Microsoft Learn for the current behaviour before you start."
  - q: "How long does the redirect from the old address stay active?"
    a: "According to Microsoft Learn, a redirect stays until someone deletes it. Once it is deleted, requests to the old address are no longer forwarded, and bookmarks, links and Shared With Me references stop working. Keep redirects until you have verified that nothing still depends on the old address."
  - q: "Can I change the address of a hub site?"
    a: "No. Microsoft Learn states that a site cannot be renamed this way if it is a hub site. For other sites, a site that is part of a hub must be connected to its hub site again after the address change. Plan this step in your change checklist."
---

A site rename in [SharePoint](https://www.m365.fm/entity/sharepoint/) looks harmless. You change an address, SharePoint forwards visitors, and everyone carries on. For many links that is true. For some it is not, and those are the ones that tend to surface weeks later.

This article explains what SharePoint does for you when a site address changes, which [broken links](https://www.m365.fm/entity/sharepoint-broken-links/) you still have to expect, and how to plan a rename or move so that the surprises are small.

## What SharePoint does when a site address changes

According to [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/change-site-address), SharePoint creates a redirect at the previous address when you change a site address. The redirect covers the common cases:

- People who saved the site as a favorite are sent to the new address.
- People who select a link to the site are sent to the new address.
- Sharing links redirect automatically.

This is why a rename often feels uneventful. The visible entry points keep working.

The important detail is that this redirect works on requests to the old address. It does not rewrite addresses that are stored somewhere else. That difference explains almost every problem described below.

## What the redirect does not fix

Microsoft Learn states that embedded URLs in SharePoint web parts, such as News and List, are not updated and may break. If a page on another site contains a web part that points to the old address, the web part keeps pointing there.

The same documentation lists further consequences of a changed address:

- Custom solutions keep their old address dependencies.
- Power Apps custom forms must be recreated.
- SharePoint 2013 workflows must be republished.
- A site must be connected to its hub site again.

Imagine a project site that is renamed because the project got a new name. A communication site elsewhere shows a News web part that pulls from the old address. A document contains a hand-typed link in its body text. A Power Apps custom form is attached to a list. After the rename, the News web part and the form need attention, and the document link may too. Embedded URLs in web parts and Power Apps custom forms are documented as not being updated by an address change.

## Redirects are not permanent

According to the [Microsoft Learn page about site redirects](https://learn.microsoft.com/en-us/sharepoint/manage-site-redirects), the redirect stays until someone deletes it. Once it is deleted, requests to the old address are no longer forwarded. Bookmarks, links and Shared With Me references stop working.

This matters for two reasons.

First, a rename can look successful for a long time because the redirect hides every problem. Links that still use the old address keep working, so nobody notices them. The day the redirect is removed, all of them fail at once.

Second, the redirect can be deleted. Deleting it changes how every old link behaves, so treat it as a change with consequences. Test it first on a pilot site or in a test tenant, and make sure you have a way back, for example by documenting the old and new addresses so that the links can be corrected if needed. Check the current options for managing redirects on Microsoft Learn before you act.

A practical consequence: do not remove a redirect just because the rename went smoothly. Remove it only after you have checked where the old address is still in use.

## Hub sites need special attention

[Hub sites](https://www.m365.fm/entity/sharepoint-hub-sites/) group related sites into a cluster with shared navigation, branding and search scope. Two rules from the documentation are relevant when you plan a rename:

- A site cannot be renamed this way if it is a hub site.
- A site that is part of a hub must be connected to its hub site again after the address change.

The second point is easy to miss. Imagine a department site that belongs to a hub. You rename it, the redirect works, and visitors reach it. But Microsoft Learn says the site must be connected to its hub site again, so until you reconnect it, hub navigation and the shared branding you expect may not apply. Include the reconnect step in the plan, and verify afterwards that the site shows up as expected.

Associating a site with a hub does not change its permissions. Still, check the details on [Microsoft Learn about hub sites](https://learn.microsoft.com/en-us/sharepoint/planning-hub-sites) for the current behaviour.

## Finding the links that will break

The Microsoft Learn pages on address changes describe what happens to links, but they do not describe a general tool for finding broken links in SharePoint Online. So the preparation is largely manual, or based on tools you choose yourself. Vendors such as [Cognillo](https://www.cognillo.com/) offer their own tools for this; evaluate any such tool like any other option, next to a manual review.

A manual review can be structured by where old addresses tend to hide:

- **Web parts:** News, List and similar web parts on pages in other sites.
- **Pages and navigation:** hand-typed links in page text, quick links and navigation entries.
- **Documents:** links written into the body of files.
- **Metadata:** link or hyperlink columns in lists and libraries.
- **Custom solutions and automation:** anything built with code, Power Apps custom forms and older workflows.

Start with the sites that are most connected to the one you plan to rename. A site that feeds news to the intranet home page deserves more checking than an archived project site.

## A safe way to plan a rename or move

Changing an address can affect people and dependencies, so treat it as a planned change rather than a quick fix.

1. **Check the preconditions.** Is the site a hub site? If so, it cannot be renamed this way. Is it connected to a hub? Plan to reconnect it.
2. **Inventory old-address dependencies.** Use the list in the previous section and write down what you find.
3. **Test first.** Run the change on a pilot site or in a test tenant that resembles the real one. Observe which links keep working and which do not.
4. **Have a way back.** Record the old and new addresses and the state of web parts, forms and workflows before you start, so you can correct or reverse the change.
5. **Communicate.** Tell site owners and users that the address will change and that favorites and links are forwarded for now.
6. **Fix the embedded items.** Update web parts, recreate Power Apps custom forms, republish SharePoint 2013 workflows and review custom solutions.
7. **Verify, then decide about the redirect.** Only after you are confident that nothing depends on the old address should you consider deleting the redirect.

Moving content between sites is a different operation from changing an address. If you plan to move content in bulk, apply the same rule: pilot first, backup or rollback path ready, and a check of Microsoft Learn for the current behaviour of the method you use.

## Practical takeaways

- A site address change creates a redirect. Favorites, links to the site and sharing links are forwarded.
- Embedded URLs in web parts such as News and List are not updated and may break.
- Custom solutions keep old address dependencies, Power Apps custom forms must be recreated, and SharePoint 2013 workflows must be republished.
- The redirect stays until someone deletes it. After deletion, bookmarks, links and Shared With Me references stop working.
- Hub sites cannot be renamed this way, and a site that belongs to a hub must be connected to it again after the change.
- Inventory where the old address is used before you rename, test on a pilot site or in a test tenant, and keep a way back.
- Delete a redirect only after you have verified that the old address is no longer needed, and check Microsoft Learn for current guidance first.
