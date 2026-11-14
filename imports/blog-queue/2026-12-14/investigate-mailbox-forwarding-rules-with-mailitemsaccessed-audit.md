---
title: "Investigate a Compromised Mailbox: Forwarding Rules and the MailItemsAccessed Audit"
summary: "How to find and remove malicious forwarding and inbox rules, and use the MailItemsAccessed audit record to judge what an attacker read, following Microsoft's compromised account guidance for Exchange Online."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [exchange-online, exchange-online-powershell, microsoft-purview-audit, defender-for-office-365]
keypoints:
  - "Contain first: disable the account or reset the password, then revoke sessions. A password reset does not revoke app passwords."
  - "Check three forwarding layers: mailbox forwarding properties, inbox rules including hidden ones, and the tenant outbound spam policy for external forwarding."
  - "MailItemsAccessed records sync and bind access. A sync means all items in the synced folder are assumed compromised."
  - "Bind events within a 2-minute interval are aggregated into one audit record, and duplicates within an hour are filtered, so a missing record does not prove no access."
  - "Forwarding rules show what leaves the mailbox from now on. MailItemsAccessed helps show what was read in the past. Use both."
faq:
  - q: "What is MailItemsAccessed?"
    a: "Microsoft Learn describes it as a mailbox audit action that records access to mail data by all mail protocols, including POP, IMAP, MAPI, EWS, Exchange ActiveSync and REST. It records two access types, sync and bind, and audits access even when nothing indicates a message was actually read."
  - q: "Is MailItemsAccessed on by default?"
    a: "The Learn page on mailbox auditing lists MailItemsAccessed as logged by default for admin, delegate and owner sign-ins, subject to the user having the appropriate license. The investigation page says it is enabled by default for users with an Office 365 or Microsoft 365 E3 or E5 license."
  - q: "How do I see forwarding rules that users cannot see in Outlook?"
    a: "Microsoft Learn's compromised account article uses Get-InboxRule with the -IncludeHidden switch and lists the properties Name, Enabled, RedirectTo, Forward* and Identity. It also checks the mailbox itself with Get-Mailbox and Forwarding*Address and DeliverTo* properties."
  - q: "Does a password reset stop the attacker?"
    a: "Not completely. Learn says app passwords aren't revoked by a password reset, so the user must delete existing app passwords and create new ones. It also recommends revoking sessions and refresh tokens with Revoke-MgUserSignInSession."
---

Attackers who take over a mailbox often do two things: they read what is already there, and they set up a way to keep receiving mail. The second is usually a forwarding rule or a mailbox forwarding address. This guide shows the documented way to find and remove those, and how the MailItemsAccessed audit record helps you judge what was read.

## Step 1: Contain the account

Microsoft's compromised account article starts with these actions, in this order:

1. Disable the affected account until the investigation ends. If you cannot, reset the password. Do not send the new password by email, because the attacker may still have the mailbox. For accounts synced from Active Directory, Learn says to reset the password in Active Directory twice.
2. Revoke sessions and refresh tokens:

```powershell
Connect-MgGraph -Scopes User.RevokeSessions.All
Revoke-MgUserSignInSession -UserId <UPN>
```

3. Review MFA registered devices and methods, user-consented applications, and administrative roles.

App passwords are not revoked by a password reset. The user must delete them and create new ones.

## Step 2: Find forwarding on the mailbox

Connect to Exchange Online PowerShell, then read the three forwarding properties:

```powershell
Get-Mailbox -Identity <Identity> | Format-List Forwarding*Address,DeliverTo*
```

Learn explains the values:

- `ForwardingAddress` set means mail goes to an internal recipient.
- `ForwardingSmtpAddress` set means mail goes to an external address. If both are set, mail goes only to the `ForwardingAddress` recipient.
- `DeliverToMailboxAndForward` of `True` delivers to the mailbox and forwards. `False` forwards only, so the owner sees nothing.

The `Set-Mailbox` reference gives the default for both forwarding parameters as blank (`$null`), meaning none is configured. To clear them, set the properties back to that default and review the result:

```powershell
Set-Mailbox -Identity <Identity> -ForwardingAddress $null -ForwardingSmtpAddress $null -DeliverToMailboxAndForward $false
```

The `$null` form follows from the documented defaults. The Learn examples I read only set forwarding, so run it with `-WhatIf` support in a test mailbox first if you are unsure.

## Step 3: Find inbox rules, including hidden ones

```powershell
Get-InboxRule -Mailbox <Identity> -IncludeHidden | Format-List Name,Enabled,RedirectTo,Forward*,Identity
```

Learn's reading guide:

- `RedirectTo` set means mail is redirected and not delivered to the mailbox.
- `ForwardTo` set means mail is forwarded.
- `ForwardAsAttachmentTo` set means mail is forwarded as an attachment.
- `Identity` is the unique rule value. Use `Get-InboxRule -Identity "<Identity>" -IncludeHidden | Format-List` to see full details.

The same article lists symptoms to look for: rules that forward to unknown addresses, or that move messages to Notes, Junk Email or RSS Subscriptions, plus recently added external forwarding and suspicious signatures.

To remove a rule, `Remove-InboxRule` accepts the rule name or the rule identity:

```powershell
Remove-InboxRule -Mailbox <Identity> -Identity "<rule name or identity>"
```

One warning from the reference: when you create, modify, remove, enable or disable an inbox rule in Exchange PowerShell, client-side rules created by Outlook are removed, and a confirmation prompt warns you. Export the rule list first. The reference does not say whether hidden rules can be targeted by `-Identity`, so check the result with `Get-InboxRule -IncludeHidden` afterwards.

## Step 4: Check the tenant forwarding control

Learn's outbound spam policy page explains the automatic forwarding setting:

| Mode | Behavior |
|---|---|
| Automatic, system-controlled | The default. It changed to behave like Off for new organizations and for those not actively using forwarding in 2021. |
| On | Automatic external forwarding is allowed and not restricted. |
| Off | External forwarding is disabled and results in a non-delivery report to the sender. |

The setting covers user inbox rules and admin mailbox forwarding that go to external addresses. Forwarding between internal users is not affected. The NDR code is 5.7.520. Microsoft recommends configuring On or Off explicitly. If the block applies, an attacker's external rule may still exist but will not deliver, so keep removing the rule anyway.

## Step 5: Use MailItemsAccessed to scope the exposure

Mailbox auditing is on by default in all organizations. Learn lists `MailItemsAccessed` as logged by default for admin, delegate and owner sign-ins, and `UpdateInboxRules` ("an inbox rule was added, removed, or changed") the same way. The `Send` action is logged for admin and owner, not delegate. Audit log retention is now managed in Purview, and the page I read does not give a day count.

The investigation page explains the two access types:

| | Sync | Bind |
|---|---|---|
| Meaning | A client downloads sets of messages | One access to one message |
| Recorded | Only by desktop Outlook for Windows or Mac | Individual message access |
| Granularity | One event for the folder that was synced | Aggregated per message |
| Assumption | All items in the synced folder are compromised | Accessed messages are identified individually |

Search with Exchange Online PowerShell. The examples from the page:

```powershell
Search-UnifiedAuditLog -StartDate 01/06/2020 -EndDate 01/20/2020 -UserIds <user> -Operations MailItemsAccessed -ResultSize 1000 | Where {$_.AuditData -like '*"MailAccessType","Value":"Sync"*'} | FL
```

Replace `Sync` with `Bind` for the second pass. Use your own incident dates. Learn's workflow is to identify the mailboxes, define the time frame, check sync activity first, then bind activity.

Compare the attacker's context with the records using `ClientIPAddress`, `ClientInfoString` and `SessionId`. If a sync shares the attacker's context, assume the whole mailbox is compromised. Otherwise, the `Folders` field of bind records lists accessed messages by `InternetMessageId`, which you can review for sensitive content.

Limits to remember, all from the page:

- Bind operations within a 2-minute interval are aggregated into one record, and `OperationCount` shows how many were combined.
- Duplicate bind records within an hour are filtered unless certain fields differ, so a missing duplicate is not proof of no access.
- If an attacker syncs mail and disconnects, mailbox auditing cannot audit later activity on the copy.
- Where access is uncertain, assume the data is compromised.

## Step 6: Review sign-ins and sent mail

Learn also tells you to review Entra sign-in logs and risk reports, search the Defender portal audit log from just before the suspicious activity without filtering on specific activities at first, and use message trace and Sent Items to see what was sent. If the account sent spam, remove it from the Restricted entities page after cleanup.

## Checklist

1. Disable or reset, revoke sessions, remove app passwords.
2. Read and clear mailbox forwarding properties.
3. List all inbox rules with `-IncludeHidden`, export them, remove the bad ones.
4. Confirm the tenant external forwarding mode.
5. Run the sync search, then the bind search.
6. Record what you assumed was exposed and why.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Microsoft Learn: Responding to a compromised email account](https://learn.microsoft.com/en-us/defender-office-365/responding-to-a-compromised-email-account)
- [Microsoft Learn: Use MailItemsAccessed to investigate compromised accounts](https://learn.microsoft.com/en-us/purview/audit-log-investigate-accounts)
- [Microsoft Learn: Manage mailbox auditing](https://learn.microsoft.com/en-us/purview/audit-mailboxes)
- [Microsoft Learn: Control automatic external email forwarding](https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-policies-external-email-forwarding)
- [Microsoft Learn: Set-Mailbox](https://learn.microsoft.com/en-us/powershell/module/exchange/set-mailbox)
- [Microsoft Learn: Remove-InboxRule](https://learn.microsoft.com/en-us/powershell/module/exchange/remove-inboxrule)
