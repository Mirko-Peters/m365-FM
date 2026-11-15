---
title: "Auto-Expanding Archive Delays and Mailbox Quota Caps in Exchange Online: Troubleshooting"
summary: "Why an auto-expanding archive seems slow to appear and why a primary mailbox stops at its quota: the 30-day provisioning window, 100 GB archive start, 1 GB per day growth limit and the PowerShell checks to run."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [exchange-online, exchange-online-powershell, purview]
keypoints:
  - "Enabling an archive gives up to 100 GB. The archive converts to auto-expanding when it reaches its quota, and extra storage can take up to 30 days to provision."
  - "Auto-expanding archiving needs Exchange Online PowerShell. Enable-Mailbox -AutoExpandingArchive works per user, Set-OrganizationConfig -AutoExpandingArchive for the organization."
  - "After an org-wide enable, user mailboxes still show AutoExpandingArchiveEnabled as False. Microsoft says this is expected."
  - "The license determines the primary mailbox size. The Exchange Online limits page lists 50 GB for Exchange Online Plan 1 and 100 GB for Plan 2."
  - "Growth is supported up to 1 GB per day. A full archive can leave the primary mailbox at quota, which can stop sending and receiving."
faq:
  - q: "How long does an auto-expanding archive take to provision?"
    a: "Microsoft Learn says it can take up to 30 days for the additional storage to be provisioned. The archive converts to auto-expanding when it reaches its quota, which the enable article puts at 90 GB for the archive including Recoverable Items. The overview page words the trigger as reaching the archive storage quota, so the two pages differ in wording."
  - q: "Why does Get-Mailbox show AutoExpandingArchiveEnabled False after I enabled it for the organization?"
    a: "Learn states that Set-OrganizationConfig -AutoExpandingArchive does not change the AutoExpandingArchiveEnabled property on user mailboxes to True, and that you do not have to run Enable-Mailbox on individual mailboxes afterwards. Verify with Get-OrganizationConfig and check AutoExpandingArchiveEnabled there."
  - q: "Why is my primary mailbox stuck at 50 GB?"
    a: "The Exchange Online limits page says the mailbox type and the user's subscription license determine the available mailbox storage. It lists 50 GB for Exchange Online Plan 1 and for Office 365 E1, and 100 GB for Plan 2, the E3 and E5 plans and Business Basic or Standard. It does not describe a specific cause for a mailbox stuck at 50 GB, so check the assigned license first."
  - q: "Can I turn auto-expanding archiving off again?"
    a: "No. The enable article says that once it is enabled, for the organization or for a user, it cannot be turned off. Administrators also cannot set a custom storage quota for auto-expanding archives."
  - q: "What happens if the archive and primary mailbox both fill up?"
    a: "Learn warns that if the main archive fills, the primary mailbox can reach its quota, which can stop sending and receiving. Microsoft recommends retention policies that delete items after a set period."
---

If an auto-expanding archive does not show up, check three things in order: the archive exists, auto-expanding archiving is enabled, and the archive has reached its quota, because expansion starts then and can take up to 30 days. If the primary mailbox is full, check the license, since the license determines the mailbox size.

## How the pieces fit

- An archive mailbox gives up to **100 GB** of extra storage, per the auto-expanding overview. The Exchange Online limits page lists 50 GB archives for some licenses (for example Plan 1 and Business Basic or Standard) and 1.5 TB for others, so check the license.
- **Auto-expanding archiving** raises the archive up to 1.5 TB. Microsoft is raising the maximum to 3 TB for eligible licenses, starting mid-October 2026 and expected to complete by late October, and other licenses stay at 1.5 TB.
- The archive converts to auto-expanding when the archive, including Recoverable Items, reaches its quota. Learn says it can take **up to 30 days** to provision the additional storage.
- Supported growth is no more than **1 GB per day**.

When you enable auto-expanding archiving for a specific user whose mailbox is on hold or has a retention policy, the archive quota is raised from 100 GB to 110 GB (warning 90 GB to 100 GB) to bridge the time until the extra storage is provisioned. Learn says this extra space is not added when you enable it for the entire organization.

## Step 1: Confirm the archive exists

In the Exchange admin center go to **Recipients** > **Mailboxes**, select the user, then in the flyout select **Others** and under **Mailbox archive** select **Manage mailbox archive**. Turn on **Mailbox archive** and save. The **Archive status** column shows **Active** when it is ready.

In Exchange Online PowerShell:

```powershell
Enable-Mailbox -Identity <username> -Archive
```

Auto-expanding archiving cannot be enabled in the Exchange admin center or the Microsoft Purview portal. The user's mailbox must already have an archive.

## Step 2: Enable auto-expanding archiving

You need Exchange Online PowerShell and the right role: Global administrator or Organization Management for the whole organization, or a role group with the Mail Recipients role for specific users.

```powershell
# Whole organization
Set-OrganizationConfig -AutoExpandingArchive

# One user
Enable-Mailbox <user mailbox> -AutoExpandingArchive
```

For hybrid users whose primary mailbox is on-premises and archive is in the cloud, the per-user command does not work. Run `Set-OrganizationConfig -AutoExpandingArchive` instead. For eligible E5 licenses, check that **Records Management** is selected and enabled in the license settings.

## Step 3: Verify, and read the result correctly

```powershell
Get-OrganizationConfig | FL AutoExpandingArchiveEnabled
Get-Mailbox <user mailbox> | FL AutoExpandingArchiveEnabled
```

After an org-wide enable, individual mailboxes still show `False`. Microsoft says this is expected. `ArchiveQuota` and `ArchiveWarningQuota` are not changed, and they are ignored when a mailbox shows `True`. Do not judge success by the per-user value alone.

## Step 4: Check why expansion looks delayed

| Observation | Explanation from Learn |
|---|---|
| Archive is under its quota | Conversion happens at quota, so nothing expands yet |
| Quota just reached | Provisioning can take up to 30 days |
| Archive grows very fast | Supported growth is no more than 1 GB per day |
| Search in classic Outlook misses items | Search is limited to the current scope, so primary searches do not return auto-expanded items |
| Item counts look wrong | Counts and unread counts may be inaccurate in Outlook and Outlook on the web |

Also note folder behavior: folders can move to the extra storage, and subfolders named like `<folder name>_yyyy (Created on ...)` may appear.

## Step 5: Check the primary mailbox quota

```powershell
Get-Mailbox <user> | FL ProhibitSendReceiveQuota
Get-MailboxStatistics <user>
```

Compare the quota with `TotalItemSize`. These two commands are my own suggestion, and the Learn pages I read do not show them. The Exchange Online limits page says the license determines the mailbox size and lists 50 GB for Exchange Online Plan 1 and 100 GB for Plan 2. For archive quota use `Get-Mailbox <user> | FL ArchiveQuota`. Learn says ArchiveQuota and ArchiveWarningQuota are ignored when AutoExpandingArchiveEnabled is True. The pages I could read say nothing about per-shard quotas or about how Get-MailboxStatistics behaves with several shards.

The pages I read do not say how long a quota change takes after a license change, so recheck after the license has propagated.

## Limits that explain surprises

- Auto-expanding archiving cannot be disabled and has no custom quota.
- Once the expanded area exists, users cannot delete folders in the archive, and after auto-expanding archiving is enabled for their mailbox they cannot use Recover Deleted Items to recover items.
- Auto-expanding archiving prevents recovering or restoring an inactive mailbox. Learn says the only way to recover data then is a content search export and an import into another mailbox.
- Journaling, transport rules or auto-forwarding to copy mail into an archive are not permitted.
- If the main archive fills, the primary mailbox can reach quota. Use retention policies that delete items after a set period.

## A short triage order

1. Is there an archive? Check the **Archive status** column or `ArchiveStatus` in PowerShell.
2. Is auto-expanding archiving enabled at organization or user level?
3. Has the archive, including Recoverable Items, reached its quota yet?
4. Was it enabled less than 30 days ago?
5. Does the license allow the size you expect? Compare the quota with the plan.
6. Is the mailbox growing faster than 1 GB per day, for example after a large import?

If all six look right and the storage still has not appeared after the documented window, collect the mailbox identity, the output of the commands above and the dates you enabled each setting before you ask Microsoft Support. The pages I read do not describe any other diagnostic for a stuck expansion.

## When the archive was disabled

Disabling an archive and re-enabling within 30 days restores the original contents. After 30 days, contents are permanently deleted. If enabling fails with a `MissingDisconnectReceiptsException`, Learn says to run `Set-Mailbox` with `-RemoveDisabledArchive` and then enable again. Learn also describes an automated archive mailbox diagnostic: a button on the page opens a flyout in the Microsoft 365 admin center, where you enter the mailbox address and select **Run Tests**. It needs a Microsoft 365 global admin and is not available in Government clouds, Microsoft 365 operated by 21Vianet or Microsoft 365 Germany.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Learn about auto-expanding archiving](https://learn.microsoft.com/en-us/purview/autoexpanding-archiving)
- [Enable auto-expanding archiving](https://learn.microsoft.com/en-us/purview/enable-autoexpanding-archiving)
- [Enable archive mailboxes](https://learn.microsoft.com/en-us/purview/enable-archive-mailboxes)
- [Exchange Online limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)
