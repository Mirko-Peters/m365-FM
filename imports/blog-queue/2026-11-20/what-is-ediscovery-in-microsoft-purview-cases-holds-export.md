---
title: "What Is eDiscovery in Microsoft Purview? Cases, Holds and Export"
summary: "What eDiscovery in Microsoft Purview is, how cases, searches, holds, review sets and exports fit together, which roles and licenses apply, and the limits that matter, such as the 14-day search export expiry."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [ediscovery, purview]
keypoints:
  - "eDiscovery in Microsoft Purview searches Exchange Online, Teams, Microsoft 365 Groups, OneDrive, SharePoint and Viva Engage, then lets you hold, review and export the content."
  - "Cases are the central unit. A case holds the searches, holds and review sets for one investigation, and its members control who can see them."
  - "To create a case, open the Purview portal, select the eDiscovery card, then Cases, then Create case. Holds are created on the case's Hold policies tab."
  - "Search export packages expire 14 days after creation and are then deleted automatically. Download them before that."
  - "An eDiscovery hold can take up to 24 hours to take effect. Closing or deleting a case releases its holds."
faq:
  - q: "What is eDiscovery in Microsoft Purview?"
    a: "According to Microsoft Learn, eDiscovery is the process of identifying and delivering electronically stored information that can be used as evidence in investigations and legal cases. Purview eDiscovery identifies, reviews and manages content in Exchange Online, Teams, Microsoft 365 Groups, OneDrive, SharePoint and Viva Engage, and lets you export results."
  - q: "What is the difference between a search, a hold and a review set?"
    a: "Microsoft Learn describes a search as the way to find content and view statistics, a hold as a way to preserve content in locations so it cannot be deleted, and a review set as a secure Microsoft-provided Azure Storage location where you filter, tag and analyze content. Holds are optional but recommended."
  - q: "Which roles do I need for eDiscovery?"
    a: "Microsoft Learn names the eDiscovery Manager role group with an eDiscovery Manager subgroup and an eDiscovery Administrator subgroup, plus Reviewer. Managers can only access cases they created. Administrators can access all cases, must add themselves as a member before managing a case and are the only role that can remove case members."
  - q: "Do I need an E5 license for eDiscovery?"
    a: "Microsoft Learn says people working with eDiscovery cases need a Microsoft 365 Enterprise E3 or E5 license, and that premium eDiscovery features require an Office 365 E5 or Microsoft 365 E5 subscription or a related E5 add-on. Query-based, time-bound and custodian-scoped holds require higher tiers such as E5."
  - q: "How long are export packages available?"
    a: "Microsoft Learn says search export packages expire 14 days after you create the export, after which the export and its data are deleted and cannot be recovered. This applies to search exports, not review set exports. An export that runs for more than seven days without finishing is cancelled."
---

eDiscovery in Microsoft Purview is the set of tools for finding, preserving, reviewing and exporting content from Microsoft 365 for legal or investigative needs. The unit of work is the case. Inside a case you run searches, place holds, optionally build review sets and export results. Access is controlled by role groups and by case membership.

## What it covers

Microsoft Learn says Purview eDiscovery searches content in Exchange Online, OneDrive, SharePoint, Microsoft Teams, Microsoft 365 Groups and Viva Engage, and exports the results. Searches can cover mailboxes and sites together.

Microsoft retired the classic eDiscovery experiences, including classic Content search, eDiscovery (Standard) and eDiscovery (Premium), on August 31, 2025. The current experience runs in the Microsoft Purview portal at purview.microsoft.com. In it, Microsoft's comparison page lists some capabilities for both eDiscovery and premium eDiscovery, such as searching, keyword queries, case management, holds and exporting, and others as premium-only, such as review sets, tagging and analytics. Premium features need an E5 subscription or related E5 add-on.

## The workflow

Microsoft's workflow page describes these steps.

1. **Trigger.** An internal or external request, or an integrated alert such as an Insider Risk Management case, starts the work.
2. **Case.** A case contains all searches, holds and review sets for one investigation. Members control who can access the case.
3. **Search.** Search content locations, view statistics, preview results and refine the query.
4. **Holds.** Optional but recommended. A hold preserves content in the locations tied to a case.
5. **Review.** Add results to a review set, then filter, tag, analyze and run queries.
6. **Export.** Export search results or review set items out of the organization.

## Create a case

Microsoft Learn gives these steps:

1. Open the Microsoft Purview portal and sign in with an account that has eDiscovery permissions. Members of **Organization Management** can also create cases.
2. Select the **eDiscovery** solution card, then **Cases**.
3. Select **Create case**.
4. Enter a **Case name**, which must be unique in your organization, and an optional description.
5. Select **Create**.

The creator is added as a member automatically. The case dashboard also has **Case settings** for access, data sources, search and review set settings.

## Create a hold

1. Open the case and select the **Hold policies** tab.
2. Select **Create policy** and enter a unique **Policy name**.
3. On **Manage data sources**, add at least one user, group or organization location, then select **Save**.
4. Define the hold with the **Condition builder** or **Keyword Query Language (KeyQL)** if you want a query-based hold.
5. Select **Apply hold**.

Facts to know before you rely on a hold:

- A hold can take up to 24 hours to take effect.
- Teams channel content is held through the team mailbox and SharePoint site. One-to-one and group chats are held through each participant's mailbox and OneDrive, so add participants separately.
- A Microsoft 365 group hold covers the group mailbox and site, not the members' mailboxes or OneDrive accounts unless you add them.
- Distribution list expansion is limited to 100 members.
- A query-based hold first holds everything in the locations, then clears non-matching content every seven to 14 days. It does not clear content if more than five holds of any type apply to a location.
- Removing a location or closing a case applies a 30-day delay hold before content can be purged.

Closing or deleting a case turns off all its holds. Microsoft warns this can result in data loss.

## Export search results

1. In a case, open the **Searches** tab and select a search.
2. Select **Export**, enter an **Export name** and choose the options.
3. Track progress in **Process manager**, then download from the **Export packages** list.

Key options and limits from Microsoft Learn:

- PST package sizes are 1, 2, 5 (default) or 10 GB. Zip package sizes are 2, 10 (default), 20 or 40 GB.
- Search export packages expire 14 days after creation.
- An export running more than seven days is cancelled. Split large exports using date ranges or filters.
- Files restricted by a DLP action, and content in locked SharePoint sites, cannot be exported.
- Use the latest Microsoft Edge, allow pop-ups from Purview and unzip with a tool such as 7-Zip rather than the built-in Windows utility.
- Pre-authorized download links work like bearer tokens, so treat them as passwords.

## Roles and licenses

The primary role group is **eDiscovery Manager**. Its **eDiscovery Manager** subgroup can create and manage only its own cases. The **eDiscovery Administrator** subgroup accesses all cases but must add itself as a member before managing one, and is the only role that can remove members from a case. **Reviewer** can open review sets in cases where the user is a member. Microsoft advises limiting the number of administrators because they can reach sensitive search results.

To assign roles, go to **Settings** > **Role groups** in the Purview portal, select **eDiscovery Manager**, then **Edit**. You need Organization Management or the Role Management role to do this.

For licensing, Learn says people working with eDiscovery cases need a Microsoft 365 Enterprise E3 or E5 license. SharePoint export also needs a SharePoint E3 license. Holds need an eligible license for every user whose content is preserved, and Frontline plans such as F1 and F3 cannot be the target of a hold.

## Common mistakes

- **Forgetting delay holds.** Releasing a hold does not purge content for 30 days.
- **Missing Teams chats.** Chats sit in participants' mailboxes, not in the team.
- **Letting an export expire.** The 14-day expiry cannot be undone.
- **Closing a case too early.** It releases the holds.
- **Too many administrators.** Keep the role narrow.

## Related

- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Audit logs](https://www.m365.fm/entity/audit-logs/)

## Sources

- [Microsoft Learn: Microsoft Purview eDiscovery](https://learn.microsoft.com/en-us/purview/ediscovery)
- [Microsoft Learn: Learn about eDiscovery](https://learn.microsoft.com/en-us/purview/edisc)
- [Microsoft Learn: Learn about the eDiscovery workflow](https://learn.microsoft.com/en-us/purview/edisc-workflow)
- [Microsoft Learn: Get started with eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-get-started)
- [Microsoft Learn: Create and manage eDiscovery cases](https://learn.microsoft.com/en-us/purview/edisc-cases-manage)
- [Microsoft Learn: Assign permissions in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-permissions)
- [Microsoft Learn: Create holds in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-hold-create)
- [Microsoft Learn: Export search results in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-search-export)
