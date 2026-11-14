---
title: "eDiscovery Search for Microsoft 365 Copilot Prompts and Responses in Microsoft Purview"
summary: "How to find Copilot prompts, responses, memories and Pages with Microsoft Purview eDiscovery: where each data type lives, the Copilot activity condition and item classes, premium review options, holds and the documented limits."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [copilot, ediscovery, microsoft-purview-audit, copilot-governance]
keypoints:
  - "Copilot prompts and responses are stored in the user's Exchange Online mailbox, so you search them by adding the mailbox as a data source."
  - "Use the Copilot activity condition. It applies all relevant item classes, equivalent to ItemClass:IPM.SkypeTeams.Message.Copilot.*."
  - "Audit logs record that an interaction happened but not the prompt or response text. Use eDiscovery to retrieve the content."
  - "Copilot Pages live in SharePoint Embedded and Facilitator notes in OneDrive, so a mailbox search or hold does not cover them."
  - "Copilot memories are not preserved under a legal hold or retention policy, and deleting a conversation does not delete the memory derived from it."
faq:
  - q: "Where are Microsoft 365 Copilot prompts and responses stored?"
    a: "Microsoft Learn says all user prompts and responses from AI applications are stored in the user's mailbox, and each Microsoft 365 Copilot interaction is stored in the user's Exchange Online mailbox as an individual message-class item. That is why eDiscovery searches use the mailbox as the data source."
  - q: "Which condition finds all Copilot interactions?"
    a: "Learn says to use the Item class condition and select the Copilot activity option, which includes all Copilot and other AI application data. A Microsoft Security Community post describes it as applying all relevant Copilot item classes, and gives ItemClass:IPM.SkypeTeams.Message.Copilot.* as the KQL form."
  - q: "Do audit logs show what users asked Copilot?"
    a: "No. Learn states that auditing captures the Copilot activity but not the actual user prompt or response, and tells you to use eDiscovery for that. The audit data is meant for security and compliance, not for usage reporting."
  - q: "Will a legal hold on a mailbox preserve Copilot Pages?"
    a: "No. The Microsoft Security Community post says Pages are stored in a user-owned SharePoint Embedded container and are not stored in the user's mailbox, so a mailbox search will not find them. Target the SharePoint Embedded container separately."
---

Compliance teams increasingly get asked for what a user asked Copilot and what Copilot answered. The data is retrievable, but it is spread across several stores, and a search that only targets the mailbox misses part of it. This guide explains where each type of Copilot data sits and how to collect it with Microsoft Purview eDiscovery, based on Microsoft's documentation.

## Where Copilot data lives

Learn's compliance pages and a Microsoft Security Community post describe these locations:

| Data | Location | How to search |
|---|---|---|
| Prompts and responses | Exchange mailbox, as message-class items | Add the user's mailbox, use the Copilot activity condition |
| Memories | Exchange contacts | Add the mailbox, item class Contacts |
| Copilot Pages | SharePoint Embedded | Add the user-owned container URL as a data source manually |
| Facilitator notes and documents | OneDrive | Add the OneDrive URL, filter by file type loop |
| Facilitator tasks | Exchange mailbox | Item class Tasks |

Copilot app identities in message headers, such as Microsoft 365 Chat or WebChat, are service-principal display names. Learn says they are not routable mailboxes and can't receive mail.

## Step 1: Get the roles right

Learn names two roles for the related search work:

- To create a case and search, you must be a member of the **eDiscovery Manager** role group.
- To delete data, you need the **Search And Purge** role, which the Data Investigator and Organization Management role groups have by default.

The pages read do not state license requirements for the collection itself. They do say review set review and HTML export are Premium features in the Loop compliance material, and the Security Community post lists premium options for Copilot searches.

## Step 2: Build the collection

In Purview eDiscovery, create a case and a search or collection, then add the data source.

1. Add the user's Exchange mailbox as a data source.
2. Add the condition **Item class contains any of Copilot activity**.
3. Narrow with a date range or keywords.

Learn says the Copilot activity option includes all Copilot and other AI application data. If you want a KQL form, the Security Community post gives `ItemClass:IPM.SkypeTeams.Message.Copilot.*` for all Copilot apps, and `-ItemClass:IPM.SkypeTeams.Message.Copilot.*` to exclude Copilot items from mailbox searches. Learn also lists individual item classes, for example:

| Source | Item class |
|---|---|
| Microsoft 365 Copilot Chat | `IPM.SkypeTeams.Message.Copilot.BizChat` |
| Word, Excel, PowerPoint, Outlook, OneNote | `IPM.SkypeTeams.Message.Copilot.Word`, `.Excel`, `.Powerpoint`, `.Outlook`, `.OneNote` |
| Teams chat, channel, meeting | `IPM.SkypeTeams.Message.Copilot.Teams` |
| WebChat | `IPM.SkypeTeams.Message.Copilot.WebChat` |
| Copilot Studio | `IPM.SkypeTeams.Message.Copilot.Studio.*` |
| Copilot personalization and memory | `IPM.Contact` |

The post notes that more item classes may be added over time, and the condition is updated accordingly. Use the condition rather than a hard-coded list.

## Step 3: Collect the full conversation

Keyword conditions may return only part of an interaction. The post lists premium options for Copilot, Teams and Viva Engage messages:

- **Organize conversations into HTML transcripts** groups messages for review.
- **Include full conversation** adds messages within a 12-hour window around each hit.
- **Access links (cloud attachments) in messages** collects referenced files and adds them to the export. This can significantly increase export size and processing time.

For Pages in a review set, the post says full-text search of `.page` content is not currently available. Use Subject or Title and Native File Type filters instead.

## Step 4: Cover the other stores

A mailbox-only collection will not find everything.

- **Pages** need the SharePoint Embedded site. Learn's Loop material says Loop's My workspace shares a single user-owned SharePoint Embedded container with Copilot Pages and Copilot Notebooks, shown with the application name Loop in admin tools. It says to retrieve the container URL with PowerShell or the SharePoint admin center and add it as a data source manually.
- **Facilitator meeting notes** sit in OneDrive. Use the OneDrive URL and a file type filter.
- Pages and Facilitator notes are not stored in the mailbox, so plan holds and retention for those locations separately. The retention scopes are listed below.

## Step 5: Retention and holds

The post's table maps data to retention scopes: prompts and responses use the Microsoft Copilot experiences scope, memories are not supported, Pages use SharePoint classic and communications sites with static scopes only, Facilitator interactions use Teams chats, and notes and documents use OneDrive accounts.

Two limits matter:

- Copilot memories will not be preserved under a legal hold or retention policy.
- Deleting a prompt and response does not delete any memory derived from that conversation.

Learn's compliance considerations page adds that retention policies for Copilot interactions do not tell users when messages are deleted, and that Copilot cannot retain returned referenced files as cloud attachments. For Teams, if transcripts are off, auditing, eDiscovery and retention are not supported for those capabilities.

## Audit versus eDiscovery

The audit data records that Copilot activity happened. It does not contain the prompt or the response, and it is not designed for usage reporting. For usage, Learn points to the Copilot usage report in the Microsoft 365 admin center or the Copilot Dashboard. For content, use eDiscovery. DSPM for AI offers an AI interaction view in Activity explorer for security posture.

## Deleting Copilot data after a spill

Learn's search and delete page describes removing sensitive Copilot content through a Graph purge call on an eDiscovery search. Holds and retention policies must be removed first, or the data is retained, and you must record and reapply them. The page states a limit of up to 10 items per mailbox at one time. A separate page for Microsoft 365 operated by 21Vianet gives both 100 and 10 items, so confirm the current limit before you rely on a number. Deleted data moves to the SubstrateHolds folder for at least one day and is permanently deleted when a timer job runs, typically between 1 and 7 days. The user gets no notification.

## Checklist

1. Confirm role membership.
2. Add the mailbox, apply Copilot activity, set the date range.
3. Turn on conversation and attachment options in review.
4. Add OneDrive and SharePoint Embedded locations where relevant.
5. Extend holds to those locations.
6. Document that memories are outside holds.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Learn: Search and delete Copilot data with eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-search-copilot-data)
- [Microsoft Learn: Search and delete Copilot data, classic eDiscovery for 21Vianet](https://learn.microsoft.com/en-us/purview/ediscovery-search-and-delete-copilot-data)
- [Microsoft Learn: Purview considerations for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/purview/ai-m365-copilot-considerations)
- [Microsoft Learn: Loop compliance summary](https://learn.microsoft.com/microsoft-365/loop/loop-compliance-summary)
- [Microsoft Tech Community: Collecting Microsoft 365 Copilot data with Microsoft Purview eDiscovery](https://techcommunity.microsoft.com/t5/microsoft-security-community/collecting-microsoft-365-copilot-data-with-microsoft-purview/ba-p/4516489)
