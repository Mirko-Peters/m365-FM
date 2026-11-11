---
title: "Large libraries and the list view threshold"
summary: "The list view threshold limits how many items one query can process, not how many a library can hold. Learn what triggers it, how indexed columns and filtered views help, and what to check first in Microsoft's documentation."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [sharepoint-list-view-threshold, sharepoint-document-libraries]
faq:
  - q: "Does the list view threshold mean a library can only hold 5,000 files?"
    a: "No. The threshold, 5,000 items by default, limits how many items a single database operation such as a view query can process at once. It does not cap how many items a list or library can store. Large libraries are possible, but views and queries need to be designed so they stay within the limit."
  - q: "Why does a view fail even though it only shows a few items?"
    a: "A view can display few items but still make SharePoint scan many to find them. If the filter or sort works on a column that is not indexed, the query may touch more items than the threshold allows. Indexing the columns used for filtering and sorting is the usual native approach to check."
  - q: "Is it safe to change a large library's structure to avoid the threshold?"
    a: "Changes such as restructuring, moving files in bulk or altering permissions can affect users and access. Test them first on a pilot site or in a test tenant, and make sure you have a backup or a way back. Check Microsoft Learn for the current guidance before you start."
---

Many admins first hear about the list view threshold when a user reports an error in a document library that used to work. The library grew, a view stopped loading, and the word "threshold" appears in a message or a support thread. It sounds like a hard ceiling on library size. It is not.

The [list view threshold](https://www.m365.fm/entity/sharepoint-list-view-threshold/) is a limit on how many items a single database operation can process at once. This article explains what that means for [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/), why views fail even when they show few items, and which native options to look at first.

## What the threshold is, and what it is not

By default, the list view threshold is 5,000 items. It applies to how many list items a single database operation, such as a view query, can process at once. It does not limit how many items a list or library can store.

That distinction matters because the two ideas are often mixed up:

- **Storage:** a library can hold more items than the threshold.
- **Processing:** a single query that needs to evaluate more items than the threshold can be blocked.

So the practical question is not "how many files do we have?" but "how many items does this query have to look at to answer the request?"

Microsoft describes the behaviour in its troubleshooting article [on items that exceed the list view threshold](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold). Because limits and defaults can change over time, treat that page as the reference and check it when you plan a design.

## Why a small view can still hit the limit

A common surprise: a view that displays ten items fails with a threshold message. The reason is that the number of items shown and the number of items scanned are different things.

Imagine a library with a large number of contracts. A user opens a view filtered to "Status = Open", sorted by modified date. Only a few contracts are open, so the result looks small. But if "Status" is not indexed, SharePoint may need to evaluate every item in the library to find the open ones. The query touches more items than the threshold allows, even though the output is tiny.

The same applies to sorting. A sort on a column that has no index can force the query to process the whole set before it can return the first page.

Things that commonly contribute:

- Filters on columns that are not indexed
- Sorting on columns that are not indexed
- Grouping a very large set of items
- Views without any filter that try to cover everything

Which of these apply depends on your library and configuration, so use Microsoft's documentation to confirm the specifics for your case.

## Indexed columns and filtered views

The native approach most admins start with is to design views so that the query can narrow the result set early. Two building blocks are involved.

**Indexed columns.** Document libraries support columns for metadata, and you can index columns that are used for filtering and sorting. An index is designed to help SharePoint find matching items without scanning everything, though it does not remove every limit; see Microsoft's documentation for the details. The effect depends on choosing the right column: an index only helps if the view actually filters on it in a way that narrows the result.

**Filtered views.** Instead of one "All Documents" view, create views that answer real questions: "My open documents", "Documents modified this quarter", "Documents for client X". Each view filters on a metadata column that is indexed.

A practical order of work could look like this:

1. List the views people actually use in the library.
2. Note which columns each view filters and sorts on.
3. Check whether those columns are indexed.
4. Adjust the views so that the first filter narrows the set.
5. Retest with a realistic number of items.

Remember that indexing an already large library and changing views can take effect for many users at once. Do this first on a pilot site or in a test tenant, and make sure you can revert view and column changes if something behaves unexpectedly. Check Microsoft Learn for current guidance on adding indexes to large lists before you start.

## Designing libraries that grow well

The threshold is easier to live with when libraries are designed with growth in mind from the start. [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/) offer columns for metadata, custom views and permissions at library, folder or file level. Those features are the toolbox.

Consider these design habits:

- **Use metadata instead of deep folder trees.** Metadata columns can drive filtered views and give indexes something useful to work with. Folders still have a place, but a structure that relies only on folders can make it harder to answer cross-cutting questions.
- **Define the default view carefully.** The view users land on should be filtered and sorted on indexed columns, not an unfiltered list of everything.
- **Separate content with different life cycles.** Imagine one library that mixes active project files with ten years of archived material. Splitting active and archive content into separate libraries or sites can keep working views small. Whether this is right depends on your governance and retention needs.
- **Be careful with unique permissions.** Library, folder and file level permissions are supported, but many individually permissioned items can add complexity of their own. Review Microsoft's guidance on permission limits and plan access around groups rather than individual items where you can.

None of these habits is a fix for every case. They are ways to reduce the chance that a query needs to process more items than the threshold allows.

## Handling a library that has already grown

If a library has already reached the point where views fail, the order of actions matters. Some steps are low risk, such as viewing which columns a view uses. Others change how users work or what they can access.

Low-risk checks:

- Review the failing view's filters and sorts.
- Check which columns are indexed.
- Read the Microsoft troubleshooting article for the message users see.

Higher-risk changes:

- Moving large numbers of files between libraries or sites
- Restructuring folders in bulk
- Changing or removing permissions
- Running PowerShell that modifies items, columns or views

For anything in the second list, test first on a pilot site or in a test tenant with a copy of representative content, and confirm you have a backup or a documented way back. Bulk moves in particular can affect links, version history and sharing, so verify in Microsoft Learn what is preserved in your scenario before you commit.

If you need visibility across many libraries to decide where to start, check Microsoft Learn for the native reporting and admin options that are currently available. Third-party tools are another option for some organisations. One example is the SharePoint Essentials Toolkit from Cognillo; see [www.cognillo.com](https://www.cognillo.com) for details, and evaluate any tool against your own requirements.

## Practical takeaways

- The list view threshold (5,000 items by default) limits what a single query can process, not how many items a library can store.
- A view can fail even if it shows few items, because the number scanned can be much larger than the number displayed.
- Index the columns your views filter and sort on, and design views so the first filter narrows the result set.
- Prefer metadata and purpose-built views over one large "All Documents" view and over folder structures alone.
- Make the default view of every large library filtered and sorted on indexed columns.
- Treat bulk moves, restructuring and permission changes as risky: use a pilot site or test tenant first and keep a backup or a way back.
- Check the [Microsoft troubleshooting article](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold) and Microsoft Learn for the current behaviour and defaults before you design or change anything.
