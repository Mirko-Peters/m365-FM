---
title: "Add Bookmarks in Microsoft Search: Fields, Publishing and the 5,000 Limit"
summary: "Create Microsoft Search bookmarks in the Microsoft 365 admin center: who can add them, the methods, field guidance for title, keywords and reserved keywords, draft and scheduled states, CSV import and the limit of 5,000 bookmarks."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [microsoft-search]
keypoints:
  - "Search admins and editors can add bookmarks in the Microsoft 365 admin center and publish them or save them to draft."
  - "Methods are manual entry, importing SharePoint results, default and suggested bookmarks and CSV import. The page names a limit of 5,000 bookmarks."
  - "A reserved keyword triggers one specific bookmark and can be associated with one answer only. Use them sparingly."
  - "Publishing immediately refreshes the search index. A bookmark is available right after publishing and a deleted one is removed from work results immediately."
  - "The page does not cover acronyms or Q and A answers, the exact menu path, targeted variations or device and OS settings."
faq:
  - q: "Who can add bookmarks?"
    a: "According to Microsoft Learn, search admins and editors can add bookmarks in the Microsoft 365 admin center and either publish them or save them to draft. No other roles are named."
  - q: "How many bookmarks can I create?"
    a: "The page says there is a limit of 5,000 bookmarks."
  - q: "How long until a bookmark appears?"
    a: "Learn says a bookmark is available in Microsoft Search immediately after publishing, and that publishing immediately refreshes the search index."
  - q: "What is a reserved keyword?"
    a: "A unique term or phrase that triggers one specific bookmark. It can be associated with one answer only, and Learn says to use reserved keywords sparingly."
  - q: "Can I add bookmarks in bulk?"
    a: "Yes, with CSV import. Add details in the template file and import it, or export bookmarks, edit the file and import it. You cannot import or save any bookmarks until all errors are resolved."
---

Bookmarks in Microsoft Search let admins promote a link when users search for certain words. You manage them in the Microsoft 365 admin center. This guide follows the Microsoft Learn article on adding bookmarks, and it states clearly what that page does not describe.

## Who can add bookmarks and where

Search admins and editors can add bookmarks in the Microsoft 365 admin center and either publish them or save them to draft. The page links to the Bookmarks page in the admin center. It does not give a menu path such as Settings and Search and intelligence, and it mentions a Search and intelligence portal only for importing results.

## Ways to create bookmarks

- Add bookmarks manually.
- Import SharePoint results.
- Add default and suggested bookmarks.
- Import bookmarks from a CSV file.

A browser extension, Microsoft Search content creator, can add bookmarks from the current site. The page links to the Chrome Web Store.

## Field guidance

| Field | What the page says |
| --- | --- |
| Title | Aim for no more than eight words or about 60 characters. |
| Description | A succinct description, about 300 characters, that summarizes the purpose or functionality of the linked resource. |
| URL | Required for Published, Suggested, Scheduled and Draft bookmarks, and also for Excluded bookmarks. |
| Keywords | Suggested minimum of at least five keywords, including variations users might search for. |
| Categories | Used to sort and filter bookmarks in the admin center. Users never see them. |
| State | Published, Draft or Scheduled when adding in the admin center. Import also supports Suggested and Excluded. |
| Reserved keywords | A unique term or phrase that triggers one specific bookmark, associated with one answer only. Use sparingly. |
| Countries or regions | With Use Microsoft Entra locations selected, the bookmark appears only to users whose Usage location matches. Otherwise RevIP-based location is used. |

## Publish states

- **Published:** available to users through Microsoft Search.
- **Draft:** not available to users, useful for review.
- **Scheduled:** published at a specified date and time.

Publishing immediately refreshes the search index, making the bookmark discoverable right away. Deleted bookmarks are removed from work results immediately. Bookmarks can appear in Microsoft Teams search too, but results are ranked by machine learning and may be suppressed if they do not meet the ranker threshold.

## Import from CSV

- **Bulk add:** add details in the bookmark template file, then import it.
- **Bulk edit:** export bookmarks to a CSV file, edit the details, then import the edited file.
- Do not edit the ID, Last Modified or Last Modified By columns. Including an existing ID replaces that bookmark.
- Errors block the import. You cannot import or save any bookmarks until all errors are resolved, and a log file details the problem rows and columns.
- Do not reuse a URL that is already in an existing bookmark.

## Behavior summary

In short, a published bookmark is live as soon as you publish, a draft is invisible to users, and a scheduled bookmark appears at the date and time you set. When you import a CSV, one error in any row stops the whole import, so fix the log file entries and import again. Keep the keyword list varied, because a reserved keyword is reserved for one bookmark and should stay rare.

## Limit

There is a limit of 5,000 bookmarks. The page also says the Graph API can create bookmarks, without describing it.

## A simple routine

This routine is a suggestion built from the field guidance, not a Microsoft procedure.

1. Start from the pages users search for most, and write a short title and description.
2. Add at least five keyword variations, including the acronyms your users type.
3. Save as Draft, review, then publish. Use Scheduled for time-bound pages.
4. Export to CSV periodically to review and clean up.

## Not covered

The page does not cover acronyms or Q and A answers, which the topic title mentions, so check the separate Microsoft pages on those. It also does not give the exact menu path, targeted variations, device and OS settings or the roles beyond search admins and editors.

## Related

- [Microsoft Search](https://www.m365.fm/entity/microsoft-search/)

## Sources

- [Manage bookmarks for Microsoft Search](https://learn.microsoft.com/microsoftsearch/manage-bookmarks)
