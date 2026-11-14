---
title: "eDiscovery Search Shows Partially Indexed Items: What It Means and What to Do"
summary: "What partially indexed items are in Microsoft Purview content search, why mail and files end up partially indexed, the documented email indexing limits, how results and exports treat them, and the scope note that the Learn page applies to 21Vianet."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [ediscovery, purview]
keypoints:
  - "Partially indexed items are mailbox items and SharePoint or OneDrive files that were not fully indexed. They are included automatically in estimated search results."
  - "Causes include unsupported file types, attachments that cannot be opened, more than 250 attachments, oversized attachments, password-protected files and S/MIME encrypted mail."
  - "Partially indexed items cannot be previewed. To view them, export them, using the Only items that have an unrecognized format option under Output options."
  - "The Learn page applies only to Microsoft 365 operated by 21Vianet. Classic Content Search and classic eDiscovery were retired on August 31, 2025."
  - "The page gives no steps to reduce partially indexed items and no word limit. It uses tokens and character limits for email."
faq:
  - q: "What is a partially indexed item?"
    a: "An Exchange mailbox item or a SharePoint or OneDrive document that was not fully indexed for search. Microsoft Learn says most organizations have less than 1 percent of content by volume and less than 12 percent by size partially indexed."
  - q: "Why do items become partially indexed?"
    a: "Examples are unrecognized or unsupported file types, disabled full-text indexing for a type, an attachment that cannot be opened, indexing errors, more than 250 attachments, oversized attachments, password-protected or non-Microsoft encrypted files and S/MIME email."
  - q: "Can I preview them?"
    a: "No. Partially indexed items cannot be previewed. You must export them to view them."
  - q: "How do I export them?"
    a: "Select Only items that have an unrecognized format, are encrypted, or weren't indexed for other reasons under Output options when you export. SharePoint items are exported to a folder named Uncrawlable."
  - q: "Does this page apply to the new eDiscovery experience?"
    a: "The page says it applies only to organizations in Microsoft 365 operated by 21Vianet. Classic Content Search and eDiscovery were retired on August 31, 2025, and other organizations should use the new eDiscovery experience in the Microsoft Purview portal."
---

A content search can report items that were not fully indexed. These partially indexed items are included in the estimated results, but a keyword search cannot see inside them. This guide follows the Microsoft Learn article on partially indexed items in content search. Read the scope note first, because it limits who the article applies to.

## Scope of the Learn page

The article applies only to organizations hosted in Microsoft 365 operated by 21Vianet. It states that Microsoft retired classic Content Search, classic eDiscovery (Standard) and classic eDiscovery (Premium) on August 31, 2025. Other organizations should use the new eDiscovery experience in the Microsoft Purview portal. The article does not describe how the new experience handles partially indexed items. It points to a separate article for that.

## What they are

Partially indexed items are Exchange mailbox items and SharePoint or OneDrive documents that were not fully indexed for search. They are included automatically in estimated search results. Most organizations have less than 1 percent of content by volume and less than 12 percent by size partially indexed.

## Why items are partially indexed

- The file type is unrecognized or unsupported, for example .bmp or .mp3.
- Full-text indexing is disabled for the file type, by default or by an administrator.
- An email attachment cannot be opened. This is the most common cause for email.
- The file type is supported but an indexing error occurred.
- A message has more than 250 attachments, or an attachment is too large.
- The file is encrypted with non-Microsoft technology or is password-protected.
- Email is encrypted with S/MIME, or files are encrypted with Microsoft encryption in SharePoint or OneDrive.

Email protected with Azure Rights Management is indexed, not partially indexed. It can be previewed and exported with the RMS Decrypt role, which the eDiscovery Manager role group includes by default.

## Email indexing limits

| Limit | Maximum |
| --- | --- |
| Attachment size, excluding Excel | 150 MB |
| Excel file size | 4 MB |
| Attachments per message | 250 |
| Attachment nesting depth | 30 |
| Parse time per item | 30 seconds |
| Parser output indexed | 2 million characters |
| Body size in the index, body plus attachments | 67 million characters |
| Unique tokens in the body | 1 million |

Attached images are skipped. The article gives no word count limit. SharePoint limits are on a separate page.

## How search results treat them

- An item is returned only if an indexed property matches, such as subject, dates, sender, recipient, attachment file name or body text. For documents these include file name, title, author and dates.
- If a keyword appears only inside an unindexed file, the item is returned as partially indexed.
- Partially indexed items cannot be previewed.
- The search statistics flyout labels partially indexed Exchange items as unindexed items. It does not count SharePoint or OneDrive items.
- A mailbox item moved to an unindexed folder is flagged and removed from the index. Moving it back does not reset the flag.

## Export them

Select **Only items that have an unrecognized format, are encrypted, or weren't indexed for other reasons** under **Output options** when you export. Exports include unindexed items only from locations that had matching results. To export from all locations, remove the keywords so the query returns all items. Partially indexed SharePoint items go to a folder named Uncrawlable.

| Export option | Indexed, matching | Partially indexed, matching | Partially indexed, not matching |
| --- | --- | --- | --- |
| Only indexed items | Exported | Exported with indexed items | Not exported |
| Only partially indexed items | Not exported | Exported | Exported |
| Indexed and partially indexed | Exported | Exported with indexed items | Exported |

Date ranges cannot exclude partially indexed items. A query-based hold holds all partially indexed items, including those that do not match the query.

## What the page does not say

- How to reduce the number of partially indexed items.
- A full export walkthrough. It names only the Output options setting.
- A word limit. It describes tokens.
- How the new eDiscovery experience treats these items.

## A handling outline

This outline is practical advice built on the page.

1. Confirm whether your organization is in scope of this article.
2. Look at the estimate and note how many items are partially indexed.
3. Export them with the partially indexed option and review them outside the search.
4. Remember that holds cover all partially indexed items.
5. For the new experience, read the article the page links to.

## Typical mistakes

- Expecting a keyword search to find text inside unsupported files.
- Trying to preview partially indexed items.
- Assuming a date range excludes them.
- Applying this page to the new eDiscovery experience without checking the scope note.

## Related

- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Partially indexed items in Content search (Microsoft Learn)](https://learn.microsoft.com/purview/ediscovery-partially-indexed-items-in-content-search)
