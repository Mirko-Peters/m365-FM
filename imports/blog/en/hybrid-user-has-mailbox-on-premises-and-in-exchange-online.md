---
title: "Hybrid Exchange: User Has a Mailbox Both On-Premises and in Exchange Online"
summary: "A license assigned too early can create a second, cloud-only mailbox for a user who still has an on-premises mailbox. Learn how to detect the duplicate, choose which mailbox to keep and fix the move."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [exchange-online, exchange-server, exchange-online-powershell]
keypoints:
  - "Two mailboxes for one user in a hybrid setup split mail by sender location: on-premises senders reach the on-premises mailbox, cloud senders reach the cloud one."
  - "Learn names a premature Exchange Online license as one cause. Assign the license after the mailbox move, not before."
  - "Learn offers two paths: keep the Exchange Online mailbox and restore the old content into it, or remove the Exchange Online mailbox data."
  - "The cross-premises restore job always ends as FailedOther. Learn says to check the copied item counts in the report instead."
faq:
  - q: "How can I tell that a user has two mailboxes in a hybrid setup?"
    a: "Microsoft Learn describes the effect: mail goes to the mailbox that matches the sender's location. Senders in the on-premises organization reach the on-premises mailbox, and senders in the Exchange Online tenant reach the Exchange Online mailbox. Compare Get-Mailbox in Exchange Online with the on-premises object and compare the ExchangeGuid values."
  - q: "Can an Exchange Online license create a second mailbox?"
    a: "Learn lists a license that is assigned prematurely as one possible cause. A new cloud-only mailbox is then created while the user already has a mailbox on-premises. A community thread from October 2025 describes the same sequence."
  - q: "Which mailbox should I keep?"
    a: "That depends on where the mail you need is. Learn describes keeping the Exchange Online mailbox and copying the old content into it, or removing the Exchange Online mailbox data if it is no longer needed. If the cloud mailbox is new and empty, the second path is usually what you want, but check first."
  - q: "Why does my mailbox move fail with 'Cannot find a recipient that has mailbox GUID'?"
    a: "Learn says this error appears when a mailbox created in Exchange Online is offboarded and the ExchangeGUID is not stamped on the on-premises remote mailbox. The fix is to set the cloud mailbox's ExchangeGUID on the remote mailbox with Set-RemoteMailbox and then run directory synchronization."
---

In a hybrid setup, an administrator assigns an Exchange Online license to a synced user whose mailbox is still on-premises. A short time later the move fails, or mail seems to go to two places. The user, in effect, has two mailboxes.

This article uses a Tech Community thread from October 2025 as the scenario and Microsoft Learn as the source for the fix. It is a troubleshooting guide, not an official Microsoft procedure. Nothing here is a substitute for a backup. The thread had no replies, so its steps are the author's report only.

## What the thread reported

- The environment was Exchange 2016 on-premises, Exchange Online and Azure AD Connect (the name used in the post; the product is now called Microsoft Entra Connect).
- The poster said that an Exchange Online Plan 2 license was assigned before the migration. Synchronization then produced a cloud mailbox for a user who already had an on-premises mailbox. The migration then failed with mailbox lookup errors.
- The poster's fix, as they described it: remove the license, force a directory synchronization, confirm the mailbox exists only on-premises, check that the cloud copy is gone, and run the migration batch again.
- Nobody replied, and no one confirmed the steps. The "Resolved" label is in the title, written by the author. The poster also said connectors and mail flow settings were not the cause, which no one checked.

The scenario itself is not unusual. Microsoft Learn describes it in a dedicated article, and that is the better guide.

## Symptoms

- Mail to the user lands in different mailboxes depending on where the sender is.
- A move request to Exchange Online fails because the recipient already exists, or with a mailbox lookup error.
- The same user shows a mailbox in both the Exchange Online admin center and the on-premises Exchange admin center.

Learn describes the effect this way: messages go to the mailbox that matches the sender's location. Senders in the on-premises organization reach the on-premises mailbox, senders in the tenant reach the cloud mailbox.

## Step 1: Confirm and collect facts

Do this first, and write the values down.

On-premises, in the Exchange Management Shell:

```powershell
Get-Mailbox "<user>" | Format-List Name,RecipientTypeDetails,ExchangeGuid,Database,LegacyExchangeDN
```

In [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/):

```powershell
Get-Mailbox "<user>" | Format-List Name,RecipientTypeDetails,ExchangeGuid
Get-MailboxStatistics -Identity "<user>" | Format-List TotalItemSize,ItemCount,LastLogonTime
```

If Exchange Online returns a mailbox for a user whose mailbox is still on-premises, and the two `ExchangeGuid` values differ, you have two separate mailboxes. The statistics show whether the cloud mailbox already holds real data. A new, empty cloud mailbox is a much simpler case than one that has been in use.

Learn's article says to save the full on-premises mailbox information to a file before you change anything. It uses a format enumeration limit of -1 so that no values are cut off:

```powershell
$formatenumerationlimit = -1
Get-Mailbox "<user>" | Format-List > mailboxinfo.txt
```

## Step 2: Decide which mailbox to keep

Learn offers two paths and says other recovery methods are not guaranteed to work.

- **Scenario 1: keep the Exchange Online mailbox.** Learn describes this as the fit when a mailbox was migrated earlier and an old one was reconnected or a new one was created on-premises. It also names the premature license as another possible cause.
- **Scenario 2: remove the Exchange Online mailbox data.** Learn says the data in Microsoft 365 may no longer be needed, and points to a linked Exchange Team Blog post (its URL slug reads "Permanently Clear Previous Mailbox Info") for the details. The Learn page itself gives no commands for this path, and I could not open the blog post while writing this, so read it yourself before you act.

The thread's approach (remove the license, resync, confirm the cloud copy is gone) looks like Scenario 2. It is the author's account, and the license removal and the cleanup of leftover cloud data are separate things. Learn does not describe license removal alone as sufficient, so check that no soft-deleted or leftover cloud mailbox is still attached to the user.

## Step 3: Keep the Exchange Online mailbox (Scenario 1)

Learn's steps, in order. Run them only after Step 1.

1. Disconnect the on-premises mailbox. Learn says `Disable-Mailbox` strips attributes, which is why Step 1 matters:

```powershell
Disable-Mailbox "<user>"
```

2. Turn the on-premises user into a remote mailbox that routes to the cloud:

```powershell
Enable-RemoteMailbox "<user>" -RemoteRoutingAddress "<user>@<tenant>.mail.onmicrosoft.com"
```

3. Restore custom proxy addresses and other attributes that were stripped. Compare with your saved file.
4. Add the old `LegacyExchangeDN` as an x500 address on the remote mailbox:

```powershell
Set-RemoteMailbox -Identity "<user>" -EmailAddresses @{add="x500:<legacy exchange DN from your file>"}
```

5. Collect three GUIDs: the disconnected mailbox's `ExchangeGUID` from your file, the on-premises database GUID (`Get-MailboxDatabase "<database>" | Format-List *GUID*`), and the cloud mailbox GUID (`Get-Mailbox "<user>" | Format-List *ExchangeGUID*` in Exchange Online).
6. Optional, but Learn says it is needed if you may offboard the mailbox to on-premises later: stamp the cloud GUID on the remote mailbox.

```powershell
Set-RemoteMailbox "<user>" -ExchangeGuid "<cloud mailbox ExchangeGuid>"
```

7. Restore the old content into the cloud mailbox. Learn gives this command for Exchange Online PowerShell:

```powershell
$cred = Get-Credential
New-MailboxRestoreRequest -RemoteHostName "<hybrid host name>" -RemoteCredential $cred -SourceStoreMailbox "<GUID of disconnected mailbox>" -TargetMailbox "<GUID of cloud mailbox>" -RemoteDatabaseGuid "<GUID of on-premises database>" -RemoteRestoreType DisconnectedMailbox
```

The account must be in Domain Admins, in the Exchange Recipients Administrators group in Active Directory, or in Organization Management or Recipient Management. Learn says remote restore is not supported on Exchange Server 2010.

**The restore will look like it failed.** Learn explains that `New-MailboxRestoreRequest` was built for a single Exchange organization, so the source and target GUIDs cannot match. The job ends as `FailedOther` with `RecipientNotFoundPermanentException`. Treat it as successful if the second-to-last report entry shows all items copied, for example a copy progress line with equal counts. Learn gives these commands for reading the report:

```powershell
Get-MailboxRestoreRequest "<ID>" | Get-MailboxRestoreRequestStatistics -IncludeReport | Select-Object -ExpandProperty Report | Select-Object -ExpandProperty Entries | Select-Object -Last 2 | Select-Object -First 1
```

Use `-Last 1` at the end of the same pipeline to see the final error entry. Handle bad, large and missing items as you would for a normal move.

## Step 4: Fix a move that fails with a GUID error

If the move fails with `MigrationPermanentException: Cannot find a recipient that has mailbox GUID`, Learn describes a different problem with a related cause. A mailbox that was created in Exchange Online does not pass its `ExchangeGUID` back to the remote mailbox on-premises. A move needs both to match. The steps from Learn:

1. On-premises: `Get-RemoteMailbox <alias> | Format-List ExchangeGUID`. All zeros means the value is not stamped.
2. In Exchange Online: `Get-Mailbox <alias> | Format-List ExchangeGUID`.
3. On-premises: `Set-RemoteMailbox <alias> -ExchangeGUID "<GUID from step 2>"`.
4. Force a directory synchronization. Learn gives no command for this step.

## Step 5: Prevent it

- Do not assign an Exchange Online license to a synced user before the mailbox move is done. This is the thread's own lesson, and Learn lists the early license as a cause.
- Create new mailboxes on-premises first, then move them. Learn says this stamps the GUID and syncs it to Exchange Online, so a later move back works.
- Check where a mailbox lives before you license, using PowerShell or the admin centers.

## Verify

- `Get-Mailbox` in Exchange Online shows one mailbox for the user, and the on-premises object is a remote mailbox.
- Mail from an on-premises sender and from a cloud sender reaches the same mailbox.
- The `ExchangeGuid` values match on both sides.

## Limits and open points

- The thread is a single post without replies. Its steps are not confirmed, and the claim that connectors were not involved was not checked.
- Learn gives no commands for Scenario 2, and the Exchange Team Blog post it links to could not be opened for this article.
- Learn's pages were last updated in 2025. Re-read them before you run the restore, since the commands change data.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Microsoft Learn: How to recover when a mailbox exists in both Exchange Online and on-premises](https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/mailbox-exists-exo-onpremises)
- [Microsoft Learn: MigrationPermanentException when moving mailboxes](https://learn.microsoft.com/en-us/troubleshoot/exchange/move-mailboxes/migrationpermanentexception-when-moving-mailboxes)
- [Microsoft Community Hub: Resolved: Hybrid Exchange duplicate (ghost) mailbox created after assigning Exchange Online license (October 2025)](https://techcommunity.microsoft.com/discussions/exchange_general/resolved-hybrid-exchange-duplicate-ghost-mailbox-created-after-assigning-exchang/4461666)
