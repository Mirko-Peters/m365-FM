---
title: "New SharePoint Files Missing From Search: What to Check Before You Reindex"
summary: "New files in a SharePoint library do not show up in search, while older ones do. Check crawl timing, search visibility settings, permissions and the group size limit first, and reindex only as a last step."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [sharepoint, microsoft-search, sharepoint-document-libraries]
keypoints:
  - "Search depends on a crawl schedule, and Microsoft Learn gives no fixed time for new content to appear."
  - "Check that the site and the library are allowed to appear in search results, and that subsites with unique permissions do not hide their page content."
  - "Items can be missing from results when a SharePoint group used for permissions has more than 2,000 users."
  - "Reindexing queues a full recrawl at the next scheduled crawl and can load the search system, so Microsoft says to do it only when you need all items reindexed."
  - "The Recent section is a different thing from search, and the thread's explanation for it is not confirmed in Learn."
faq:
  - q: "How long does it take for a new SharePoint file to appear in search?"
    a: "Microsoft Learn says content is crawled on a defined schedule and gives no exact duration. A moderator in one community thread said 24 hours to several days, but the thread did not source that range. If content is still missing after a few days, check the settings in this article."
  - q: "Where do I turn search visibility on or off for a site or library?"
    a: "For a site: Settings, Site settings, then Search and offline availability, and set Allow this site to appear in Search results. For a library: Library settings, Advanced settings, and set Allow items from this document library to appear in search results. Site settings need Manage Permissions, library settings need Manage Lists."
  - q: "Does reindexing a library fix missing search results?"
    a: "It can help when the index is stale, but it only queues the content for the next scheduled crawl. Learn warns that reindexing a site can cause a massive load on the search system and says to do it only if you made changes that require all items to be reindexed. In the thread discussed here, an administrator reported that reindexing and the other steps did not help."
  - q: "Why do shared items not appear in search for some users?"
    a: "Learn describes one cause: if a SharePoint group that defines permissions for the item has more than 2,000 users, search results are not available for that item. The fix in Learn is to keep the group under 2,000 users, or to add a security group to the SharePoint group instead of adding people one by one."
---

A team uploads new documents to a library. They open fine, but a search for the exact file name returns nothing, while files from two or three weeks ago show up. This was the question in a Microsoft Q&A thread from February 2026. A second thread from April 2026 describes an eight-person office whose SharePoint "does not show recent documents". Neither asker confirmed a fix. This article puts the replies next to Microsoft Learn and gives you an order of checks that does not start with a reindex. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- New items in a document library are missing from search results. Older items are found.
- The asker has already looked at crawl and search settings and followed general advice online.
- In the second thread, files from 2024 to 2026 did not appear in the **Recent** list on a site.

One of the replies in the first thread said that new uploads can take a while to appear, and recommended a library reindex. A later comment from another administrator said they had done all of the suggested steps without success, and the moderator asked them to open a new question with details. So there is no confirmed solution in either thread.

## Step 1: Separate search from the Recent list

The moderator's reply in the second thread says the **Recent** list is personal to each viewer and shows what that viewer opened or worked on, so newly added files can be absent there even when search works. I did not find that statement in the Learn pages I read, so verify it on your own site. The practical test is simple: open the library itself, and search for a file name there. If the file is in the library but not in the Recent list, you do not have a search problem.

## Step 2: Allow time for the crawl

Learn says SharePoint in Microsoft 365 crawls automatically on a defined schedule, and the crawler picks up content that changed since the last crawl. The pages give no duration. In the first thread, the moderator named 24 hours to several days for new uploads, without a source. Compare the modified date of an older file that search finds with your newest file that it does not find. That tells you how big the gap is.

## Step 3: Check the site and library search settings

Learn's page on missing search results lists these checks. You need the right permission level to see them: Learn says the site-level settings need **Manage Permissions** (included in the site Owners group), and list or library settings need **Manage Lists**.

**Site level**

1. Open **Settings**, then **Site settings**. If you do not see it, select **Site information**, then **View all site settings**.
2. Under **Search**, select **Search and offline availability**.
3. Make sure **Allow this site to appear in Search results** is set to **Yes**.

You can also open `<site address>/_layouts/srchvis.aspx` to reach the same page.

**Library level**

1. In the library, open **Settings**, then **Library settings**, then **Advanced settings**.
2. Make sure **Allow items from this document library to appear in search results** is set to **Yes**.

Learn says that after you set either value to Yes, the site or library should be indexed during the next scheduled crawl.

## Step 4: Check pages on subsites with unique permissions

This applies to pages (.aspx) more than to files. On the same **Search and offline availability** page, the section **Indexing ASPX Page Content** has three options:

- **Do not index Web Parts if this site contains fine-grained permissions** (the default)
- **Always index all Web Parts on this site**
- **Never index any Web Parts on this site**

Learn says that if a subsite does not inherit permissions, its .aspx pages will not appear in results under the default setting. The two fixes it gives are to select **Always index all Web Parts on this site**, or to make the subsite inherit permissions from the parent. Think about the second option before you choose the first. Always indexing means content from all ASPX pages can appear in results regardless of their permissions, as Learn describes the option.

## Step 5: Check the size of the SharePoint groups

Learn has a separate troubleshooting page for items that are shared with many people. It says search results are not available for a resource when more than 2,000 users are in a SharePoint group that defines permissions for it. Keep the membership below that number. If you must give access to many individuals, create a security group, add the people to it, and add the security group to the SharePoint group. This does not match a "new files only" pattern, but it is quick to check if your library uses such a group.

## Step 6: Check draft items

Learn's missing-results page also points to a separate support article about draft items that are not crawled. If your library uses draft versions or content approval, read that article. I did not review it for this guide.

## Step 7: Reindex the library, and only then

If all the settings are right and the gap does not close, reindex the library. Learn's steps:

1. Open the library and select **Settings**, then **Library settings**.
2. Under **General Settings**, select **Advanced settings**.
3. Scroll to **Reindex Document Library** and select the button. A warning appears, so select the button again to confirm.

The content is reindexed during the next scheduled crawl. Learn says reindexing marks all content as changed and that it can cause a massive load on the search system, so Microsoft advises not to reindex a site unless changes require it. Learn gives no duration. The first thread's reply said up to 24 hours, but also noted that it only queues the library. For a whole site, use **Site settings**, **Search and offline availability**, and **Reindex site**, then tick the confirmation box.

Learn's search schema page adds one more reason to reindex: schema changes, such as a new or changed managed property, do not trigger a crawl on their own, so you request the reindex yourself.

## Step 8: Look for custom search settings

The moderator in the first thread suggested a few more checks if the problem lasts 24 to 48 hours: look in the SharePoint admin center under **More features** and **Search** for sites that are excluded from results, create a new modern search results page to rule out custom configuration, and use the Search Query Tool to see what the index contains. I did not verify these three items in the Learn pages above, so use them as leads.

## Step 9: Collect details for support

If everything above checks out, open a Microsoft 365 support request through your admin center. Include the site and library address, the file name and upload time (UTC), what search returns for an older file, and the result of each step you tried. The second thread's moderator also noted that community moderators cannot reach admin tools or start remote sessions, which is why a support case is the next step.

## Limits and open points

- The two threads have no confirmed answer, so this is a checklist from documentation, not a verified fix.
- Learn's reindex page shows a visible update date of April 2025. Its missing-results page shows July 2025. Compare with the current portal text.
- No time range for crawling is documented. Treat day counts from community replies as estimates.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Search](https://www.m365.fm/entity/microsoft-search/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)

## Sources

- [Microsoft Learn: Search results missing in SharePoint Online](https://learn.microsoft.com/en-us/sharepoint/troubleshoot/search/search-results-missing)
- [Microsoft Learn: Enable content on a site to be searchable](https://learn.microsoft.com/en-us/sharepoint/make-site-content-searchable)
- [Microsoft Learn: Manually request crawling and reindexing of a site, library or list](https://learn.microsoft.com/en-us/sharepoint/crawl-site-content)
- [Microsoft Learn: Items shared with many individual users are missing from search results](https://learn.microsoft.com/en-us/sharepoint/troubleshoot/search/items-missing-from-search-results)
- [Microsoft Learn: Manage the search schema in SharePoint Online](https://learn.microsoft.com/en-us/sharepoint/manage-search-schema)
- [Microsoft Q&A: SharePoint Online Search Not Indexing Recent Content (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5757323/sharepoint-online-search-not-indexing-recent-conte)
- [Microsoft Q&A: Sharepoint not showing recent documents (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5855233/sharepoint-not-showing-recent-documents)
