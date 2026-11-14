---
title: "How to Share a Calendar and Set Folder Permissions With Exchange Online PowerShell"
summary: "Grant, change and understand mailbox folder permissions with Add-MailboxFolderPermission and Set-MailboxFolderPermission in Exchange Online PowerShell. Covers access roles, calendar delegates with SharingPermissionFlags, sharing invitations and the pitfall with SendNotificationToUser."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [exchange-online, exchange-online-powershell]
keypoints:
  - "Use Add-MailboxFolderPermission to give a user access to a folder, and Set-MailboxFolderPermission to change an existing entry."
  - "The Identity syntax is MailboxID:\\ParentFolder, for example ayla@contoso.com:\\Calendar, and AccessRights accepts roles such as Reviewer, Editor and Owner."
  - "In Exchange Online, SharingPermissionFlags Delegate makes the user a calendar delegate, and CanViewPrivateItems must be used together with Delegate."
  - "SendNotificationToUser sends a normal sharing invitation, applies only to calendar folders and works only with AvailabilityOnly, LimitedDetails, Reviewer and Editor."
  - "Learn warns that using SendNotificationToUser on Set can remove delegate status, because SharingPermissionFlags then defaults to None."
faq:
  - q: "When do I use Add and when Set?"
    a: "Add-MailboxFolderPermission adds permissions for a user on a folder. Set-MailboxFolderPermission modifies existing permission entries, and the values you specify replace the existing permissions for that user on the folder."
  - q: "How do I make someone a calendar delegate?"
    a: "Use AccessRights Editor with SharingPermissionFlags Delegate. Learn says in Exchange Online this makes the user a delegate who receives meeting invites and responses. Add CanViewPrivateItems with a comma to allow private items."
  - q: "Which roles exist for calendar folders only?"
    a: "AvailabilityOnly, which views only availability data, and LimitedDetails, which views availability data with subject and location."
  - q: "What does SendNotificationToUser do?"
    a: "It sends the user a normal calendar sharing invitation that the recipient can accept. The default is false. It applies only to calendar folders and only to AvailabilityOnly, LimitedDetails, Reviewer and Editor."
  - q: "Can I give access to a group?"
    a: "The User parameter accepts mail-enabled security principals. Learn lists user mailboxes, mail users and mail-enabled security groups, including nested mail-enabled security groups, on the Add page."
---

To share a calendar or any mailbox folder in Exchange Online, run `Add-MailboxFolderPermission` with the folder, the user and an access role. To change an existing entry, run `Set-MailboxFolderPermission`. For calendar delegates, add `-SharingPermissionFlags Delegate`. This guide uses Microsoft Learn's pages for both cmdlets, with Learn's own example mailboxes.

## Folder identity and the user

The `Identity` parameter takes `MailboxID:\ParentFolder[\SubFolder]`. For `MailboxID`, any value that uniquely identifies the mailbox works, for example an email address or alias. Learn's examples: `john@contoso.com:\Calendar` and `John:\Inbox\Reports`.

The `User` parameter names who gets the permission. On the Add page, Learn says valid values are mail-enabled security principals: user mailboxes, mail users and mail-enabled security groups, including nested ones. For best results it recommends the UPN, for example `user@contoso.com` (users only), or `Domain\SamAccountName`.

## Access roles

You can give individual permissions or roles, separated by commas. Learn lists these roles and their permissions:

| Role | Permissions |
| --- | --- |
| Reviewer | FolderVisible, ReadItems |
| Contributor | CreateItems, FolderVisible |
| Author | CreateItems, DeleteOwnedItems, EditOwnedItems, FolderVisible, ReadItems |
| NonEditingAuthor | CreateItems, DeleteOwnedItems, FolderVisible, ReadItems |
| Editor | CreateItems, DeleteAllItems, DeleteOwnedItems, EditAllItems, EditOwnedItems, FolderVisible, ReadItems |
| PublishingAuthor | Author permissions plus CreateSubfolders |
| PublishingEditor | Editor permissions plus CreateSubfolders |
| Owner | All of the individual permissions, including FolderContact and FolderOwner |

Two roles apply only to calendar folders: **AvailabilityOnly**, which views only availability data, and **LimitedDetails**, which views availability data with subject and location. Learn adds that when the Editor role is applied to a calendar folder, delegates can accept or decline meetings by manually selecting the meeting request in the mailbox. In Exchange Online, to send meeting requests to delegates so they can accept or decline them, also use `SharingPermissionFlags` with the value `Delegate`.

## Add permissions

Learn's examples for Add-MailboxFolderPermission:

```powershell
Add-MailboxFolderPermission -Identity ayla@contoso.com:\Marketing -User ed@contoso.com -AccessRights Owner
```

This grants Ed the Owner role on the Marketing folder in Ayla's mailbox.

```powershell
Add-MailboxFolderPermission -Identity ayla@contoso.com:\Calendar -User julia@contoso.com -AccessRights Editor -SharingPermissionFlags Delegate
```

In Exchange Online, this adds Julia as a calendar delegate on Ayla's mailbox, without access to private items.

```powershell
Add-MailboxFolderPermission -Identity ayla@contoso.com:\Calendar -User laura@contoso.com -AccessRights Editor -SharingPermissionFlags Delegate,CanViewPrivateItems
```

This adds Laura as a delegate with access to private items.

## Change permissions

Learn says Set-MailboxFolderPermission modifies existing entries. The `AccessRights` values you specify replace the existing permissions for the user on that folder. Learn's examples, with Ed already holding permissions on Ayla's mailbox:

```powershell
Set-MailboxFolderPermission -Identity ayla@contoso.com:\Marketing -User ed@contoso.com -AccessRights Owner
```

This overwrites Ed's existing permissions on the Marketing folder with the Owner role.

```powershell
Set-MailboxFolderPermission -Identity ayla@contoso.com:\Calendar -User ed@contoso.com -AccessRights Editor -SharingPermissionFlags Delegate
```

Learn says this removes access to private items for an existing delegate.

```powershell
Set-MailboxFolderPermission -Identity ayla@contoso.com:\Calendar -User ed@contoso.com -AccessRights Editor -SharingPermissionFlags None
```

This changes an existing calendar delegate to Editor, without delegate status.

```powershell
Set-MailboxFolderPermission -Identity ayla@contoso.com:\Calendar -User ed@contoso.com -AccessRights Editor
```

This changes an existing user to Editor without changing their delegate status.

## Sharing flags and invitations

`SharingPermissionFlags` applies only to calendar folders and only when `AccessRights` is Editor. Values: `None`, `Delegate`, and `CanViewPrivateItems`, which must be used together with `Delegate`. You can combine values with commas. Notes by cmdlet:

- On Add, `None` has no effect and is the default.
- On Set, `None` removes delegate permissions and updates the meeting message rule so the user stops receiving meeting invites and responses. It is the default when you use `SendNotificationToUser` without a value for `SharingPermissionFlags`.

`SendNotificationToUser` sends the user a normal calendar sharing invitation that they can accept. The default is `$false`. It applies only to calendar folders and works only with AvailabilityOnly, LimitedDetails, Reviewer and Editor.

### The delegate pitfall

Learn's description of Set-MailboxFolderPermission warns about this. If you do not use `SendNotificationToUser` or `SharingPermissionFlags`, nothing changes in how the cmdlet works, and an existing delegate changed to Editor stays a delegate. But if you use `SendNotificationToUser`, with `$true` or `$false`, then `SharingPermissionFlags` has the default value None, which can affect delegate access for existing users. In Learn's example, changing a delegate to Editor with `SendNotificationToUser $true` leaves the user with only Editor permissions and not a delegate. To resend the invitation to an existing delegate without changing effective permissions, Learn's example adds `-SharingPermissionFlags Delegate -SendNotificationToUser $true`.

## Related cmdlets and notes

Learn lists Get-MailboxFolderPermission and Remove-MailboxFolderPermission as related cmdlets for viewing and removing permissions. The Add page also notes that you cannot configure the Outlook setting for delivering meeting requests addressed to you in PowerShell, and points to Exchange Web Services. Learn also says you need assigned permissions to run these cmdlets, and points to its page on finding the permissions required for any Exchange cmdlet.

## Practical routine

This section is my advice, not a Microsoft statement.

1. **Check first, then change.** View the current entries before you run Set, because Set replaces the access rights for that user.
2. **Use WhatIf** (both cmdlets support it) to preview a command when you work on many mailboxes.
3. **Pick the least role that works.** For availability sharing, AvailabilityOnly or LimitedDetails is narrower than Reviewer.
4. **Keep delegates and plain sharing apart.** If someone only needs to view a calendar, do not use Delegate.
5. **Be careful with notification switches on Set.** After Learn's warning, always state `SharingPermissionFlags` explicitly when you add `SendNotificationToUser` for a delegate.
6. **Log the commands you run** with the mailbox, user and role, so permission changes can be reversed.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Set-MailboxFolderPermission (ExchangePowerShell) (Microsoft Learn)](https://learn.microsoft.com/powershell/module/exchangepowershell/set-mailboxfolderpermission)
- [Add-MailboxFolderPermission (ExchangePowerShell) (Microsoft Learn)](https://learn.microsoft.com/powershell/module/exchangepowershell/add-mailboxfolderpermission)
