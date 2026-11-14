---
title: "eDiscovery Premium indexing and Teams conversation exports in Microsoft Purview"
summary: "How indexing and Teams conversation threading work in the current Microsoft Purview eDiscovery experience, which options to set when adding results to a review set, and how to export conversations. Classic custodian steps no longer apply."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [ediscovery, purview, microsoft-purview-content-search, teams]
keypoints:
  - "Microsoft retired classic eDiscovery on August 31, 2025. Learn describes advanced indexing in the new experience as automatic, so you no longer reindex data sources before searching."
  - "Threading is set when you add search results to a review set. Include Teams and Viva Engage conversations collects up to 12 hours of related conversation."
  - "The review set export flyout has Expand selected documents to include with Associated family items and Associated conversation items."
  - "Exports run in the Process manager. Download within 30 days after completion, and an export running more than seven days is canceled automatically."
  - "The pages I read for the new experience do not describe a separate custodian page. The classic custodian instructions apply only to 21Vianet tenants."
faq:
  - q: "Do I still have to index custodians before searching?"
    a: "Not in the current experience, according to Microsoft Learn. It says advanced indexing runs automatically during each search scoped for statistics and when you add results to a review set or export, depending on indexing options, and that you no longer need to reindex data sources separately."
  - q: "Where do I turn on conversation threading?"
    a: "In the Add items to review set flyout, under the section for messages and related items from mailboxes. Learn lists Organize conversation into HTML transcript and Include Teams and Viva Engage conversations, which collects up to 12 hours of related conversation around a matching message."
  - q: "How do I export the whole conversation and not just the matching message?"
    a: "In the review set export flyout, use Expand selected documents to include and select Associated conversation items. Learn also lists Associated family items for attachments."
  - q: "How long can I download an export?"
    a: "Learn says to download content within 30 days after the export completes, and that export processes are kept for the life of the case. An export running more than seven days without completing is canceled automatically, so split large exports."
  - q: "Where are Teams messages stored for eDiscovery?"
    a: "The classic Teams workflow page, which now applies only to 21Vianet tenants, says 1:1 chat messages are stored in the mailboxes of all participants, channel messages in the mailbox associated with the team, and shared channel messages in a system mailbox. Microsoft says eDiscovery never operates against the real Teams data in Azure Cosmos DB."
---

In the current Microsoft Purview eDiscovery experience, there is no separate custodian indexing step to run. Advanced indexing runs automatically during searches and when you add results to a review set. The choices that decide whether you get full Teams conversations are made in two places: the **Add to review set** flyout and the review set **Export** flyout.

## What changed

Microsoft Learn says classic eDiscovery experiences, including classic eDiscovery (Premium), were retired on August 31, 2025. The pages that describe custodians, **Data sources** > **Add new custodians** and the classic Teams workflow now say they apply only to organizations hosted in Microsoft 365 operated by 21Vianet. Everyone else uses the new experience.

In the new experience, Learn says cases are the central unit and you still add people, groups and data sources. It says advanced indexing runs automatically during each search scoped for statistics results and when you add results to a review set or export, and that you no longer need to reindex data sources before searching. The pages I read for the new experience do not describe a separate custodian page, so use the case and search scoping instead.

Premium features such as review sets, analytics and enhanced data source mapping need an E5 subscription or related add-on, according to the overview page.

## Where Teams data lives

The classic Teams workflow page explains storage, which still helps you scope searches:

- 1:1 chat messages are stored in the Exchange Online mailbox of all participants.
- Standard channel messages are stored in the mailbox associated with the team, and files in the team's SharePoint site.
- Private channel messages are in the mailboxes of all private channel members, with files in a dedicated SharePoint site.
- Shared channel messages are stored in a system mailbox, so you must specify the parent team's mailbox to search them.

Learn adds that eDiscovery never operates against the real Teams message data in Azure Cosmos DB, only the compliance records in Exchange Online.

## Step 1: Add results to a review set with threading

On the **Searches** tab of the case, select the search, then **Add to review set**. In the **Add items to review set** flyout:

1. Choose **Add to a new review set** or an existing one.
2. Under the indexing section, choose which items to add, such as indexed items that match, or also partially indexed items. Learn describes advanced indexing on partially indexed items as an option.
3. Choose sampling or keep **Add all search results to review set**. Sampling needs **Generate statistics** to have completed.
4. Under messages and related items from mailboxes, set **Organize conversation into HTML transcript** and **Include Teams and Viva Engage conversations**. Learn says the second option collects up to 12 hours of related conversation around a matching message.
5. For links in messages, **Access links (cloud attachments) in messages** takes version choices from latest only to all versions. Learn says cloud attachments are treated as message attachments, and compliance boundaries are not reflected.
6. Select **Add to review set** and follow progress in the **Process manager**.

Learn notes the search reruns when you add results, so final counts can differ from the estimate. OCR works only at this step and must be enabled per case. Encrypted email attachments are decrypted, which requires the RMS Decrypt role.

For reviewing, the classic conversation page describes group by conversation, a summary view and a text view, and says all Teams conversation dates are shown in UTC. The classic Teams workflow page describes grouping with the Group control: **Group Teams or Viva Engage conversations** shows each conversation as a top-level line. I did not confirm that the new experience uses the identical control names.

## Step 2: Export the conversation

In the case, go to **Review sets**, open the review set, select items on **All items**, then **Action** > **Export**. In the **Export** flyout, Learn lists:

- **Select items to include:** selected documents only, all filtered documents, or all documents in the review set.
- **Expand selected documents to include:** **Associated family items** and **Associated conversation items**.
- **Export type:** **Export item report only** or **Export items with item report**, with sub-options such as **Export text files** and **Export tags**.
- **Export format:** **Create PSTs for messages where possible** or **Create .msg files for messages**.
- **Package size settings**, including friendly names and folder structure.

To get thread context, select **Associated conversation items**. The export page I read does not list conversation-specific export options such as a PDF transcript format, and says PDF only in the context of redacted files. The classic page says each transcript was exported as an HTML message file in a Conversations folder, which applies to classic only.

Learn's limits and timing for exports:

| Item | Value |
|---|---|
| PST package size | 1, 2, 5 (default) or 10 GB |
| ZIP package size | 2, 10 (default), 20 or 40 GB |
| Download window | 30 days after completion |
| Automatic cancel | Export running more than seven days |
| Tracking | **Process manager**, and the case **Exports** tab |

If a large export fails, Learn suggests splitting it into smaller batches or narrowing with date ranges or filters.

## What the documentation does not say

The pages I read do not describe how to run a custodian-style hold flow in the new experience, a limit on case size, or the exact layout of the exported conversation files. Run a small test export first and check the output before a legal deadline.

## Typical mistakes

- Following classic custodian steps that apply only to 21Vianet tenants.
- Leaving threading options off, so only the matching message arrives.
- Exporting only the selected items without expanding to conversation items.
- Waiting past 30 days to download an export.

## Related

- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Microsoft Purview content search](https://www.m365.fm/entity/microsoft-purview-content-search/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Learn about eDiscovery in Microsoft Purview](https://learn.microsoft.com/en-us/purview/edisc)
- [eDiscovery workflow](https://learn.microsoft.com/en-us/purview/edisc-workflow)
- [Add search results to a review set](https://learn.microsoft.com/en-us/purview/edisc-search-add-to-review-set)
- [Export items from a review set](https://learn.microsoft.com/en-us/purview/edisc-review-set-export)
- [eDiscovery (Premium) workflow for content in Microsoft Teams (classic, 21Vianet only)](https://learn.microsoft.com/en-us/purview/ediscovery-teams-workflow)
- [Conversation review sets (classic, 21Vianet only)](https://learn.microsoft.com/en-us/purview/ediscovery-conversation-review-sets)
