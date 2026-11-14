---
title: "Recover inactive mailboxes and hold data with Exchange Online PowerShell"
summary: "How to find, recover or restore an inactive mailbox with Exchange Online PowerShell, what Microsoft says about purged mailboxes and the 30-day countdown, and how to get back items purged from a mailbox on hold."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [exchange-online-powershell, exchange-online, retention-policies, ediscovery]
keypoints:
  - "An inactive mailbox is a soft-deleted mailbox kept because a hold was applied before the account was deleted. Recover and restore are two different operations."
  - "Recover converts the inactive mailbox into a new active mailbox and the inactive mailbox no longer exists. Restore copies the content into an existing mailbox and leaves the inactive mailbox in place."
  - "Both need Exchange Online PowerShell. The Exchange admin center and the Microsoft Purview portal cannot do it."
  - "Once the last hold is removed, a 30-day soft-deleted countdown starts. After permanent deletion, Microsoft says the mailbox cannot be recovered."
  - "An inactive mailbox with an auto-expanding archive cannot be recovered or restored. Content search and export is the documented route, for eDiscovery only."
faq:
  - q: "Can I recover an inactive mailbox that was already purged?"
    a: "Not according to Microsoft Learn. The page on deleting an inactive mailbox says that after permanent deletion the mailbox can't be recovered. Before the final hold is removed, copy the content to another mailbox or recover the mailbox while it is still soft-deleted."
  - q: "What is the difference between recover and restore?"
    a: "Microsoft Learn says recovering converts the inactive mailbox into a new active mailbox linked to a new user account, and the inactive mailbox no longer exists. Restoring copies the content to an existing mailbox, and the inactive mailbox stays inactive."
  - q: "Why does New-Mailbox -InactiveMailbox fail for a mailbox deleted recently?"
    a: "Learn says that if the mailbox was soft-deleted less than 30 days ago, you can't use New-Mailbox -InactiveMailbox. You recover it by restoring the user account instead. If ExternalDirectoryObjectId has no value, the soft-deleted retention period has expired and New-Mailbox -InactiveMailbox applies."
  - q: "Which tool do I use to get back items purged from a mailbox on Litigation Hold?"
    a: "Microsoft Learn describes Get-RecoverableItems and Restore-RecoverableItems for active mailboxes. Items deleted by a user are kept in Recoverable Items while single item recovery or Litigation Hold is on, and administrators can recover purged items if the deleted item retention period has not expired. You need the Mailbox Import Export role."
  - q: "Why is the mailbox still inactive after I removed all holds?"
    a: "Learn says Microsoft 365 applies a delay hold after another hold is removed, and the mailbox stays inactive until the delay hold is removed or expires. The delay hold expires on its own after 30 days. Removing it needs the Legal Hold role."
---

An inactive mailbox can be recovered into a new active mailbox with `New-Mailbox -InactiveMailbox`, or restored into an existing mailbox with `New-MailboxRestoreRequest`. Both run only in Exchange Online PowerShell. Once a mailbox is permanently deleted, Microsoft Learn says it cannot be recovered, so the work is mostly about acting before the countdown ends. This article follows what the Learn pages describe and notes what they leave out.

## What an inactive mailbox is

Learn describes an inactive mailbox as a soft-deleted mailbox used to retain a former employee's email. A mailbox becomes inactive when a hold is applied before the Microsoft 365 account is deleted. Without a hold, the mailbox data of a deleted account is kept for 30 days and then permanently removed.

Microsoft recommends Microsoft 365 retention policies or retention labels for this. Litigation Hold stays supported but Learn calls it an older technology. Retention settings must retain content, or retain and then delete it. A policy that only deletes content does not make the mailbox inactive.

## Step 1: Find the inactive mailbox

Connect to Exchange Online PowerShell and list inactive mailboxes:

```powershell
Get-Mailbox -InactiveMailboxOnly -ResultSize Unlimited | FT DisplayName,PrimarySMTPAddress,WhenSoftDeleted
```

An inactive mailbox can share its SMTP address with an active mailbox. Learn says to identify it with `DistinguishedName` or `ExchangeGuid`, not the address:

```powershell
$InactiveMailbox = Get-Mailbox -InactiveMailboxOnly -Identity <identity of inactive mailbox>
```

The Microsoft Purview portal also lists inactive mailboxes, up to 5,000. Use PowerShell for more.

## Step 2: Choose recover or restore

| | Recover | Restore |
|---|---|---|
| Result | New active mailbox with a new user account | Content merged into an existing mailbox |
| Inactive mailbox afterwards | No longer exists | Stays inactive |
| Cmdlet | `New-Mailbox -InactiveMailbox` | `New-MailboxRestoreRequest` |

Learn lists one limit for both. An inactive mailbox with an auto-expanding archive can't be recovered or restored. For that case, use content search and export, which Learn says is for eDiscovery purposes only and not a backup solution.

## Step 3a: Recover to a new mailbox

Use the ExchangeGuid of the stored object. The name and the `MicrosoftOnlineServicesID` must be unique in the organization.

```powershell
New-Mailbox -InactiveMailbox $InactiveMailbox.ExchangeGuid -Name annbeebe -FirstName Ann -LastName Beebe -DisplayName "Ann Beebe" -MicrosoftOnlineServicesID Ann.Beebe@contoso.com -Password (ConvertTo-SecureString -String '<password>' -AsPlainText -Force) -ResetPasswordOnNextLogon $true
```

Learn adds these points about the result:

- The new user account must be activated by assigning a license.
- Single item recovery is set to 30 days instead of the usual 14.
- Retention hold is enabled for 30 days, then the Managed Folder Assistant starts processing policies. You can extend it with `Set-Mailbox -EndDateForRetentionHold`.
- A retention policy with Preservation Lock is kept. Without Preservation Lock the mailbox leaves the policy and Litigation Hold is enabled on the recovered mailbox. A Litigation Hold on the inactive mailbox is removed.

To keep the original content safe from the new owner or from retention, Learn suggests placing the recovered mailbox on Litigation Hold.

## Step 3b: Restore into an existing mailbox

`New-MailboxRestoreRequest` checks that the `LegacyExchangeDN` of source and target match, so add the source value to the target as an X500 address first:

```powershell
$InactiveMailbox.LegacyExchangeDN
Set-Mailbox <target mailbox> -EmailAddresses @{Add="X500:<LegacyExchangeDN of inactive mailbox>"}
New-MailboxRestoreRequest -SourceMailbox $InactiveMailbox.DistinguishedName -TargetMailbox <target mailbox> -TargetRootFolder "Inactive Mailbox"
```

Without `-TargetRootFolder`, items merge into the matching folders. With it, everything lands under the named folder. For archives, add `-SourceIsArchive` and `-TargetIsArchive`. Wait for the request to finish before removing the X500 address. Learn warns that retention policies could delete restored items from an old mailbox, so put the target on retention hold or apply a retention policy or Litigation Hold first.

The restore page does not cover required roles, `Get-MailboxRestoreRequest` for monitoring, or size limits. Check the cmdlet reference for those.

## Recently deleted accounts: the 30-day rule

If the mailbox was soft-deleted less than 30 days ago, Learn says `New-Mailbox -InactiveMailbox` does not work and you restore the user account instead. To check:

```powershell
Get-Mailbox -InactiveMailboxOnly <identity> | Format-List ExternalDirectoryObjectId
```

No value means the soft-deleted retention period has expired and the recover command applies. A value means restore the user account.

## The purged mailbox problem

Removing the last hold ends the inactive state. Learn says the mailbox becomes soft-deleted and a 30-day period starts. The `InactiveMailboxRetireTime` property records the date, and the mailbox is purged after that date plus 30 days. Check the state with:

```powershell
Get-Mailbox -SoftDeletedMailbox -Identity <identity> | FL Name,WhenSoftDeleted,IsInactiveMailbox,WasInactiveMailbox,InactiveMailboxRetireTime
```

`IsInactiveMailbox` False with `WasInactiveMailbox` True means the countdown is running. Inside the window you can still recover the mailbox. After permanent deletion Microsoft says it can't be recovered. The pages I read describe no other route.

## Hold data in an active mailbox

For a mailbox that is still active, Learn describes `Get-RecoverableItems` and `Restore-RecoverableItems`. Items deleted by a person or by a retention policy move to Recoverable Items, and administrators can recover purged items if the deleted item retention period has not expired. You need the Mailbox Import Export role.

```powershell
Get-RecoverableItems -Identity laura@contoso.com -SubjectContains "FY17 Accounting" -FilterItemType IPM.Note -FilterStartTime "2/1/2018 12:00:00 AM" -FilterEndTime "2/5/2018 11:59:59 PM"
```

Run the search first, then `Restore-RecoverableItems` with the same filters. The Learn page I read does not describe the full folder structure or retention limits, so read the Litigation Hold and single item recovery pages before relying on a specific period.

## Typical mistakes

- Deleting the account before confirming a hold, so the mailbox never becomes inactive.
- Changing the UPN before deleting the account. Learn warns you may then be unable to delete the inactive mailbox later.
- Removing a hold and forgetting the delay hold, or the reverse: expecting instant deletion.
- Using an eDiscovery case hold to make a mailbox inactive. Learn advises against it, because closing the case or releasing the hold permanently deletes the inactive mailbox.

## Related

- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Retention policies](https://www.m365.fm/entity/retention-policies/)
- [eDiscovery](https://www.m365.fm/entity/ediscovery/)

## Sources

- [Inactive mailboxes in Microsoft 365](https://learn.microsoft.com/en-us/purview/inactive-mailboxes-in-office-365)
- [Create and manage inactive mailboxes](https://learn.microsoft.com/en-us/purview/create-and-manage-inactive-mailboxes)
- [Recover an inactive mailbox](https://learn.microsoft.com/en-us/purview/recover-an-inactive-mailbox)
- [Restore an inactive mailbox](https://learn.microsoft.com/en-us/purview/restore-an-inactive-mailbox)
- [Delete an inactive mailbox](https://learn.microsoft.com/en-us/purview/delete-an-inactive-mailbox)
- [Recover deleted messages in a user's mailbox](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-user-mailboxes/recover-deleted-messages)
