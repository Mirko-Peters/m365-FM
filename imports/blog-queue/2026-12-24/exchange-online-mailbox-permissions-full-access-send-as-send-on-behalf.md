---
title: "Exchange Online Mailbox Permissions: Full Access vs Send As vs Send on Behalf"
summary: "Compare Full Access, Send As and Send on Behalf in Exchange Online, with supported recipient types, the exact Exchange admin center paths, PowerShell cmdlets, automapping behavior and gaps such as propagation time."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [exchange-online]
keypoints:
  - "Full Access opens and edits a mailbox but cannot send from it. Send As and Send on Behalf send messages but cannot read the mailbox."
  - "Send As shows no sign that the delegate sent the message. Send on Behalf shows the delegate in the From line as on behalf of the mailbox or group."
  - "If a user has both Send As and Send on Behalf on the same mailbox or group, Send As is always used."
  - "Full Access uses Add-MailboxPermission, Send As uses Add-RecipientPermission and Send on Behalf uses GrantSendOnBehalfTo on the Set cmdlets."
  - "Automapping is on by default for Full Access and works only for individual users. Use -AutoMapping $false to turn it off."
faq:
  - q: "What is the difference between Send As and Send on Behalf?"
    a: "According to Microsoft Learn, Send As messages appear to come directly from the mailbox or group with no indication the delegate sent them. With Send on Behalf the From line reads the delegate on behalf of the mailbox or group, and replies go to the mailbox or group."
  - q: "Does Full Access let a delegate send mail?"
    a: "No. Learn lists Full Access as opening the mailbox and viewing, adding and removing its contents, and not sending messages from it."
  - q: "How do I stop the mailbox appearing automatically in Outlook?"
    a: "Learn gives two options: add the permission with -AutoMapping $false, or assign Full Access to a mail-enabled security group, in which case members' mailboxes do not open in their Outlook profiles."
  - q: "Which wins if a user has both Send As and Send on Behalf?"
    a: "Learn says Send As is always used."
  - q: "How long do permission changes take?"
    a: "The Learn page does not say how long changes take to apply, so do not assume an exact delay."
---

Full Access lets a delegate open and manage a mailbox. Send As and Send on Behalf let a delegate send messages for a mailbox or group, but not read it. This article follows Microsoft Learn's page on managing permissions for recipients in Exchange Online.

## The three permissions

| Permission | What the delegate can do | What it does not allow |
| --- | --- | --- |
| Full Access | Open the mailbox and view, add and remove its contents | Sending messages from the mailbox |
| Send As | Send messages that appear to come directly from the mailbox or group, with no sign the delegate sent them | Reading the mailbox contents |
| Send on Behalf | Send messages with a From line reading the delegate on behalf of the mailbox or group. Replies go to the mailbox or group. | Reading the mailbox contents |

If a user has both Send As and Send on Behalf, Send As is always used.

## Where each permission applies

- **Full Access:** user, resource and shared mailboxes in the EAC. Discovery mailboxes in PowerShell only.
- **Send As:** user, resource and shared mailboxes, plus distribution, dynamic distribution, mail-enabled security and Microsoft 365 groups.
- **Send on Behalf:** user and resource mailboxes and the same group types in the EAC. Shared mailboxes in PowerShell only.

Delegates can be mailboxes with user accounts, mail users with accounts and mail-enabled security groups. For Send on Behalf, distribution groups are accepted too.

## Permissions you need

The page does not name admin roles. It points to the Mailbox settings entry in the Exchange Online feature permissions article.

## Exchange admin center steps

**One mailbox**

1. Go to **Recipients** > **Mailboxes**, or **Resources** for room and equipment mailboxes.
2. Select the mailbox and choose **Mailbox Delegation**.
3. Under the permission, select **Edit**, then **Add members**.
4. Select users or groups, then **Save** and **Confirm**.

**Several mailboxes:** select them on **Recipients** > **Mailboxes**, choose **Mailbox delegation**, enter the delegate under **Add a delegate**, pick the permission types and select **Save**.

**Groups:** go to **Recipients** > **Groups**, select the group, choose **Settings**, then **Edit manage delegates** under **Manage delegates**. The EAC offers only Send As and Send on Behalf for groups.

## PowerShell

```powershell
# Full Access
Add-MailboxPermission -Identity <Mailbox> -User <Delegate> -AccessRights FullAccess -InheritanceType All [-AutoMapping $false]
Remove-MailboxPermission -Identity <Mailbox> -User <Delegate> -AccessRights FullAccess -InheritanceType All

# Send As
Add-RecipientPermission -Identity <MailboxOrGroup> -Trustee <Delegate> -AccessRights SendAs

# Send on Behalf
Set-Mailbox -Identity <Mailbox> -GrantSendOnBehalfTo @{Add="<Delegate>"}
```

For Send on Behalf, the same parameter exists on `Set-DistributionGroup`, `Set-DynamicDistributionGroup` and `Set-UnifiedGroup`. A single value replaces all delegates, `@{Add=...; Remove=...}` changes some, and `$null` removes all.

Verify with `Get-MailboxPermission`, `Get-RecipientPermission` and `Get-Mailbox | Format-List GrantSendOnBehalfTo`.

## Automapping

For Full Access, the mailbox automatically appears in the delegate's Outlook profile through Autodiscover. This works only for individual users, not groups. To avoid it, use `-AutoMapping $false`, or grant Full Access to a mail-enabled security group.

## Hidden mailboxes

Full Access and Send As do not work on a mailbox hidden from address lists. Discovery mailboxes are hidden by default, so a delegate cannot open one with Full Access.

## Outlook notes from the page

When you add a mailbox to Outlook using Advanced Settings, only the primary mailbox is added. To access the archive, add it as a second account in the same profile. The page links to Microsoft Support articles for the delegate side, such as opening a shared mailbox and sending on behalf, and does not describe those steps itself.

## Removing a delegate

In the EAC, select the delegate under the permission and choose **Delete**, then **Confirm**. For groups, select the close (X) button next to the delegate and save. In PowerShell, use `Remove-MailboxPermission` and `Remove-RecipientPermission` for Full Access and Send As, and the `Remove` or `$null` forms of the Send on Behalf parameter.

## Choosing a permission

This is a suggestion based on the table above. Use Full Access when someone must read and manage the mailbox. Use Send As when messages must look like they come from the mailbox. Use Send on Behalf when the recipient should see who sent it.

## What the page does not cover

It gives no propagation time and no roles. It also does not cover hybrid or on-premises Exchange, Outlook for Mac or mobile behavior, or licensing.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Manage permissions for recipients in Exchange Online](https://learn.microsoft.com/exchange/recipients-in-exchange-online/manage-permissions-for-recipients)
