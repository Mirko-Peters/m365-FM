---
title: "How to Search for and Delete Phishing Emails With Microsoft Purview"
summary: "Search and purge with eDiscovery and Security and Compliance PowerShell: roles, limits (10 items per mailbox, 100 with premium and Graph, 50,000 mailboxes), search, soft or hard delete, holds, Teams and unindexed items. Defender for Office 365 Plan 2 has its own path."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [ediscovery, microsoft-purview-content-search, exchange-online, defender-for-office-365, purview-data-security-investigations]
keypoints:
  - "The classic Content Search page now applies only to Microsoft 365 operated by 21Vianet. Classic eDiscovery retired on August 31, 2025, so other tenants use the eDiscovery page."
  - "You need eDiscovery Manager or Compliance Search to search and Organization Management or Search And Purge in the Purview portal to delete. Exchange Online Organization Management does not count."
  - "The limits are 10 items per mailbox (100 with premium cases and Graph), 50,000 mailboxes per purge, Exchange Online mailboxes and public folders only."
  - "Soft delete moves items to Recoverable Items. Hard delete marks them for permanent removal, and a purge cannot be undone. Holds keep deleted items until the hold ends."
  - "With Defender for Office 365 Plan 2, Learn tells you to use its Remediate malicious email procedure instead."
faq:
  - q: "Which page do I follow in 2027?"
    a: "The page that the older Learn guidance pointed to now says classic eDiscovery experiences retired on August 31, 2025, and that its guidance applies only to organizations hosted by 21Vianet. Other organizations use Find and delete email messages in eDiscovery in the Microsoft Purview portal, which this article follows."
  - q: "Which permissions do I need?"
    a: "To create and run a search, membership in the eDiscovery Manager role group or the Compliance Search role in the Microsoft Purview portal. To delete, membership in Organization Management or the Search And Purge role in the Purview portal. The Exchange Online Organization Management role group is a separate group and does not grant the right to delete."
  - q: "How many items can I delete at once?"
    a: "Up to 10 items per mailbox at a time with PowerShell. For cases with eDiscovery premium features, Microsoft Graph can purge up to 100 items per location. The page says the feature is for incident response, not for cleaning up mailboxes, and strongly advises against working around the limit by running the command again and again."
  - q: "What is the difference between soft delete and hard delete?"
    a: "A soft-deleted message moves to the user's Recoverable Items folder and is kept until the deleted item retention period expires. A hard-deleted message is marked for permanent removal, goes to the Purges folder and cannot be reached by the user. With single item recovery it is removed after the deleted item retention period. The page warns that after permanent deletion nothing can be restored."
  - q: "Why did the purge not remove everything?"
    a: "Possible reasons on the page: more matching items than the per-mailbox limit, a litigation hold, delay hold or retention policy that keeps items in Recoverable Items, items that are not indexed, or items in Teams or a review set, which this process does not delete."
---

Phishing messages that have already reached mailboxes can be found and removed with the search and purge process in Microsoft Purview. It is a powerful tool and the Learn page is full of warnings. This article follows the current page, adds the needed context, and points out where another procedure fits better. One point first, because it changes which page counts: the older Learn page on the classic Content Search says that classic eDiscovery experiences were retired on August 31, 2025, and that its guidance now applies only to organizations hosted by 21Vianet. Everyone else follows the eDiscovery page used here. My own advice is marked.

## Choose the right tool first

- If your organization has **Defender for Office 365 Plan 2**, the page tells you to use the procedure in Remediate malicious email delivered in Office 365 instead of this one. This article does not describe that procedure.
- The page also names the purge feature in **Data Security Investigations** as a way to search for and permanently delete Exchange mailbox and Teams items, with a purge queue dashboard.
- The eDiscovery purge is meant for **data spillage and incident response**. The page says it is not for reducing mailbox quota, clearing mailboxes or enforcing retention. For those, use retention policies, archive policies, or manual deletion by the mailbox owner.

## Before you begin

1. **Know your case type.** The page says cases without eDiscovery premium features can only purge email with PowerShell, up to 10 items per location. Cases with premium features, for E5 organizations, can use PowerShell or Microsoft Graph, and Graph purges up to 100 items per location. Do not mix PowerShell and Graph to purge email.
2. **Purge is final.** After data is permanently deleted it cannot be recovered, and a purge command cannot be undone. Validate the search scope first.
3. **Unsupported conditions.** For cases without premium features, search conditions such as identifier (including message ID), sensitivity label and sensitive information type are not supported for search and delete. The page says using them results in unexpected data loss.
4. **Export a report first.** The page recommends running an export in report-only format to review the metadata of all matching items before the purge.
5. **Permissions.** To search: member of the eDiscovery Manager role group or assigned the Compliance Search role in the Microsoft Purview portal. To delete: member of Organization Management or assigned the Search And Purge role in the Purview portal. The Exchange Online role group with the same name is separate and does not give the delete right. Without the role you get the error that no parameter matches the name Purge in step 3.
6. **PowerShell.** Deleting needs Security and Compliance PowerShell. The page requires Exchange Online PowerShell module 3.9.0 or later (August 2025) and running Connect-IPPSSession with the EnableSearchOnlySession switch.
7. **Scope limits.** Exchange Online mailboxes and public folders only, not SharePoint or OneDrive. Not Teams chat, which has its own article. Not items in a review set. At most 50,000 mailboxes in the search, counting primary, archive and other locations separately, even if fewer contain matches.

## Step 1: Connect to Security and Compliance PowerShell

Connect as described in the Microsoft article on connecting to Security and Compliance PowerShell, with the module version and switch from the list above.

## Step 2: Create a search that finds only the message

You can create the search in the Microsoft Purview portal or with `New-ComplianceSearch` and `Start-ComplianceSearch`. Tips from the page:

- Use **Subject** if you know the exact text or phrase.
- Use **Received** if you know the date or range.
- Use **From** if you know the sender.
- Preview the results, and use the estimate statistics to see the item count.

The page's example queries:

```powershell
(Received:4/13/2024..4/14/2024) AND (Subject:'Action required')
(From:user@contoso.com) AND (Subject:"Update your account information")
```

And an example that creates and starts a search over all mailboxes:

```powershell
$Search=New-ComplianceSearch -Name "Remove Phishing Message" -ExchangeLocation All -ContentMatchQuery '(Received:4/13/2016..4/14/2016) AND (Subject:"Action required")'
Start-ComplianceSearch -Identity $Search.Identity
```

The dates are examples from the page. Use your own. If you validated the scope with a search in the eDiscovery portal, the page says to rerun it in PowerShell and wait until it completes, because a portal search shows an ItemCount of 0 in PowerShell until you do. Check that the results match before you purge.

## Step 3: Delete the message

Soft delete moves the items to the user's Recoverable Items folder, where they stay until the deleted item retention period expires:

```powershell
New-ComplianceSearchAction -SearchName "Remove Phishing Message" -Purge -PurgeType SoftDelete
```

Hard delete marks them for permanent removal:

```powershell
New-ComplianceSearchAction -SearchName "Remove Phishing Message" -Purge -PurgeType HardDelete
```

The page's warning: hard-deleted messages cannot be recovered by the user. With single item recovery, which is on by default for new mailboxes in Microsoft 365, hard-deleted items are removed after the deleted item retention period. Without it, they go at the next Managed Folder Assistant run.

Check progress with `Get-ComplianceSearchAction`. The object is named after the search with `_Purge` added.

## When the purge does not remove everything

The page's FAQ gives these reasons:

- **More than the limit.** If a mailbox has more than 10 matching items (100 with Graph), deleting only that number is normal. Repeating is possible, but the page strongly recommends against working around the limit by running the command over and over. For larger removals it points to the Defender for Office 365 remediation article and to zero-hour auto purge.
- **Holds.** A litigation hold, delay hold, or a retention policy keeps items. After a purge, items go to the Purges folder and are kept until the hold ends. Items in Recoverable Items may stay visible in the export report. The page gives `Get-Mailbox | fl *Hold*,*Recovery*` and `Get-OrganizationConfig | fl *Hold*` for checks, and names Priority Cleanup as the recommended way to remove items from a hold.
- **Unindexed items.** The purge does not delete them.
- **Teams and review sets.** Teams items returned by the search are not deleted. Items in a review set are not deleted either, since they are stored in Azure Storage. Deleting the case deletes the review set.
- **More than 50,000 mailboxes.** Create temporary search permissions filters to reduce the scope, for example by department or country, and repeat per subset.

## Working order for an incident (my advice)

This is my suggestion, not guidance from the page:

1. First stop the delivery: block the sender or the URL in your mail protection, so the purge does not chase new copies.
2. Check whether Defender for Office 365 Plan 2 applies, and prefer its remediation path if it does.
3. Build the narrowest query you can, preview it, and export a report. Have a second person look at the report.
4. Start with a soft delete when the situation allows it. It leaves a way back until the retention period ends.
5. Check holds for the affected mailboxes before you start, so you know what will remain.
6. Record what you ran: search name, query, time, type of delete, and who approved. This is also useful for an audit later.

## Related

- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [Microsoft Purview Content search](https://www.m365.fm/entity/microsoft-purview-content-search/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Microsoft Purview Data Security Investigations](https://www.m365.fm/entity/purview-data-security-investigations/)

## Sources

- [Find and delete email messages in eDiscovery (Microsoft Learn)](https://learn.microsoft.com/purview/edisc-search-mailbox-data)
- [Search for and delete email messages in your organization (Microsoft Learn)](https://learn.microsoft.com/purview/ediscovery-search-for-and-delete-email-messages)
