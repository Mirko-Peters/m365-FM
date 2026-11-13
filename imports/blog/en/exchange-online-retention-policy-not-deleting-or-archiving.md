---
title: "Exchange Online Retention Policy Not Deleting or Archiving Items: What to Check"
summary: "Items stay in Deleted Items or the primary mailbox although a retention policy should delete or archive them. Check holds, tags, Managed Folder Assistant, Recoverable Items and the Deleted Items default."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [exchange-online, exchange-online-powershell, retention-policies, microsoft-purview-data-lifecycle-management]
keypoints:
  - "Start with the mailbox flags: RetentionHoldEnabled, ElcProcessingDisabled and any hold. Learn lists them as the first common causes."
  - "The Managed Folder Assistant processes each mailbox at least once every seven days and can take that long. You can force a run with Start-ManagedFolderAssistant."
  - "A hold does not stop a user or policy from deleting an item. It keeps the copy in Recoverable Items, so the mailbox can look unchanged in size."
  - "Learn does not describe a default 14-day purge of Deleted Items. Community answers say none exists unless you create a custom tag."
faq:
  - q: "How often does the Managed Folder Assistant process a mailbox?"
    a: "Microsoft Learn says the Managed Folder Assistant is set to process mailboxes at least once every seven days. It usually runs daily, but the process can take up to seven days to finish. You can force it with Start-ManagedFolderAssistant and the mailbox identity."
  - q: "Does Litigation Hold stop Deleted Items from being emptied?"
    a: "Not according to Microsoft Learn or the thread answers. A deleted item moves to the Deletions subfolder of Recoverable Items. With Litigation Hold it is preserved there instead of being purged. The user no longer sees it, but the data still counts toward Recoverable Items."
  - q: "Why does a 30-day archive policy not shrink my 100 GB mailbox?"
    a: "Several things can block it: a retention hold, ElcProcessingDisabled, a disabled or never-move tag, or simply slow processing of a very large mailbox. Learn lists these causes and the diagnostic commands. A community answer also says auto-expanding archive can take up to 30 days; that figure comes from a linked Tech Community FAQ and is not on the Learn pages I checked."
  - q: "Is there a default policy that deletes Deleted Items after some days?"
    a: "Two answers in a June 2026 thread say no: Exchange Online does not purge Deleted Items by default and you need a custom retention tag. A third-party analysis from 2023 reports that the Default MRM Policy has no Deleted Items tag. I did not find this stated in the Learn pages I checked, so verify it in your tenant with Get-RetentionPolicy."
---

A retention policy is assigned. Weeks later, old mail is still in the primary mailbox, Deleted Items keeps growing, and the user gets a storage warning.

Three Microsoft Q&A threads from 2025 and 2026 describe this. None of them ended with a confirmed root cause, so this article uses them as scenarios and builds the checklist from current Microsoft Learn pages. It is not an official Microsoft procedure. It covers Exchange Online retention tags and policies (MRM). Microsoft 365 retention policies from Purview behave differently and are covered only where they interact.

## What the threads reported

- **August 2025.** A mailbox at about 100 GB with an online archive and auto-expansion. A policy to move items older than 30 days to the archive had been applied a week earlier, and the Managed Folder Assistant had been run. Nothing moved. A moderator posted a checklist: verify the policy and its move-to-archive tag, look for holds, look for personal tags, force the assistant and wait. A volunteer moderator said auto-expansion can take up to 30 days. The person who asked never replied.
- **May 2026.** A one-year archive rule worked, but a three-year delete rule never did. The administrator ruled out a litigation hold by showing `LitigationHoldEnabled` as false and `InPlaceHolds` as empty. An anonymous answer blamed a newer seven-year retention policy for a former employee. The person who asked pointed out that the problem was four years old. Nobody found the cause.
- **June 2026.** Items in Deleted Items were not removed after 14 days. A moderator and an MVP both said that a hold does not block deletion, and that Deleted Items has no automatic purge by default unless a retention tag is configured. The MVP added that a custom tag should take effect, that the assistant runs on a weekly cadence, and that you can check the assigned policy on the folder properties in Outlook on the web. The person who asked reported that it still did not work.

## Symptoms

- Items older than the tag's age limit stay in the folder.
- The archive does not grow, or the primary mailbox does not shrink.
- Deleted Items is never emptied.
- The Recoverable Items folder is full, calendar invites cannot be accepted, or items cannot be deleted.

## Step 1: Check the mailbox flags and holds

```powershell
Get-Mailbox <mailbox> | Format-List RetentionPolicy,RetentionHoldEnabled,ElcProcessingDisabled,LitigationHoldEnabled,InPlaceHolds
```

Microsoft Learn names the first common causes:

- `RetentionHoldEnabled` is `True`. Learn mentions a mailbox migrated with the PST Import service as an example.
- `ElcProcessingDisabled` is `True`. This stops the assistant from processing the mailbox at all.

If either is `True` and you did not intend that, set it to `False` as described on the Learn page. Also check that the mailbox is larger than 10 MB, because Learn says MRM does not process smaller mailboxes, and that the account is not disabled with a regular mailbox type, which MRM also skips.

For holds, run `Get-Mailbox <mailbox> | Format-List LitigationHold*`. Be careful when you remove a hold. It is a compliance decision, so ask the owner first.

## Step 2: Read the policy and the tags

Learn gives these commands:

```powershell
Get-RetentionPolicy
Get-RetentionPolicy -Identity <policy name> | Select-Object -ExpandProperty RetentionPolicyTagLinks
Get-RetentionPolicyTag <tag name> | Format-List
```

Look for disabled tags, and tags with the action never move to archive or never delete. Learn says these take precedence over other tags. It also says a policy that contains only personal tags may never act unless users apply those tags.

Learn's tag overview adds the rules that explain odd results:

- A default policy tag (DPT) applies to the whole mailbox, including untagged items. A retention policy tag (RPT) applies to one default folder, such as Deleted Items.
- A policy can link only one RPT per default folder, and only one DPT per action type. So you cannot stack two folder tags on Deleted Items. Replace the old one.
- Move to Archive is available only for default policy tags and personal tags, not for folder tags.

Learn lists the missing-tag case too. If a tag is missing from the roaming settings stream in the mailbox, its fix is to delete a configuration message with MFCMAPI and then run the assistant with `-FullCrawl`. That is an advanced step. Back up first and use support if you are unsure.

## Step 3: The Deleted Items case

The June thread is the clearest example of a wrong assumption. Two answers said Deleted Items is not purged automatically in Exchange Online unless an administrator creates a tag for it. I found no Learn page that states the default policy's contents, and the Learn pages I opened do not describe a default 14-day purge. A 2023 article by a third party reports that the Default MRM Policy has no Deleted Items tag, and that adding a newly created custom tag to it works in the author's tests. Treat both as community reports.

What Learn does say:

- A retention policy tag can apply to Deleted Items, with the actions Delete and Allow Recovery or Permanently Delete.
- Delete and Allow Recovery behaves like the user emptying Deleted Items, so the item goes to Recoverable Items.
- A policy cannot link more than one RPT for the same folder.

So to purge Deleted Items after 14 days you need a custom retention policy tag for that folder, linked to the policy that the mailbox really uses. Check which policy is assigned with `Get-Mailbox <mailbox> | Format-List RetentionPolicy`. The MVP also suggested looking at the policy shown for the folder in Outlook on the web.

## Step 4: Understand what holds do

Litigation Hold does not stop deletion. Learn describes the flow:

- An item deleted by the user, or by a deletion policy, moves to the **Deletions** subfolder of **Recoverable Items**.
- When it is purged or its deleted-item period ends, it moves to **Purges**. Without a hold, the next run of the assistant removes it for good.
- With Litigation Hold, items in Purges are preserved for the hold duration, or without end if no duration is set.
- The hold setting can take up to 60 minutes to apply.

Purview retention behaves alike in principle. Learn says retention wins over deletion: the delete action may start, but permanent deletion is suspended and the retained copy sits in Recoverable Items. The same page says Exchange retention tags and policies (the older MRM features) usually work side by side with Purview retention. In the May thread, a longer policy could only be the reason if it applied to that mailbox. The person who asked showed that no hold existed, and no one proved a conflicting policy. Run Step 1 for the mailbox as it is, and check retention policies in the Purview portal if you use them.

## Step 5: Run the assistant and give it time

```powershell
Start-ManagedFolderAssistant -Identity <mailbox>
```

Learn says the assistant processes mailboxes at least once every seven days. It usually runs daily, but a pass can take up to seven days. The cmdlet page lists `-FullCrawl` (recalculates how tags apply across the whole mailbox) in Exchange Online. Use it after you change tags. The page does not give an expected duration, so check results after a day or two, not after an hour.

Community answers gave 24 to 48 hours for archiving, and up to 30 days for auto-expansion of the archive. Neither number is on the Learn pages I checked.

## Step 6: Measure what happened

Learn suggests folder statistics for primary and archive:

```powershell
Get-MailboxFolderStatistics -Identity <mailbox> -IncludeOldestAndNewestItems | Export-Csv -NoTypeInformation -Path .\primaryfolderstats.csv
Get-MailboxFolderStatistics -Identity <mailbox> -Archive -IncludeOldestAndNewestItems | Export-Csv -NoTypeInformation -Path .\archivefolderstats.csv
```

Compare `OldestItemReceivedDate` with the age limit of the tag. Learn says to leave out Deleted Items, Contacts, recurring Calendar items and recurring Tasks in this comparison. Check `DeletePolicy` and `ArchivePolicy` for folders that carry their own tags.

For the assistant's own record:

```powershell
Export-MailboxDiagnosticLogs <mailbox> -ComponentName MRM
```

Learn explains that "resource unhealthy" means throttling, so a very large mailbox is processed slowly. Extended properties such as `ElcLastSuccessTimestamp` show the last error-free run. If the problem remains after this, Learn directs you to Microsoft Support.

## Step 7: If Recoverable Items is full

Learn has a separate page for a mailbox on hold with archiving enabled where Recoverable Items fills up after a policy deletes many items. Its cause is the default tag **Recoverable Items 14 days Move to Archive**, which keeps items for 14 days. Its fix lowers the age limit:

```powershell
Get-RetentionPolicyTag | Format-Table Name,Type,RetentionAction,AgeLimitForRetention
Set-RetentionPolicyTag "<tag applied to Recoverable Items>" -AgeLimitForRetention 1
Start-ManagedFolderAssistant -Identity <mailbox>
```

A tag is a shared object, so the change affects every policy that links it. Test on one mailbox first. Learn's best-practice note also says to enable the archive right after you place a mailbox on Litigation Hold, and not to let Recoverable Items sit at its quota.

## Limits and open points

- None of the three threads has a confirmed cause. The checklist is Learn's, not a proven fix for those cases.
- The Deleted Items default and the 30-day auto-expansion figure are community statements. Verify them in your tenant.
- The dates on the Learn pages range from 2025 to mid-2026. Recheck before you change tags in production.

## Related

- [Retention policies](https://www.m365.fm/entity/retention-policies/)
- [Microsoft Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Microsoft Learn: Resolve email archive and deletion issues when using retention policies](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/purview/retention/troubleshoot-mrm-email-archive-deletion)
- [Microsoft Learn: Retention tags and retention policies in Exchange Online](https://learn.microsoft.com/en-us/exchange/security-and-compliance/messaging-records-management/retention-tags-and-policies)
- [Microsoft Learn: Start-ManagedFolderAssistant](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/start-managedfolderassistant?view=exchange-ps)
- [Microsoft Learn: Place a mailbox on Litigation Hold](https://learn.microsoft.com/en-us/exchange/policy-and-compliance/holds/litigation-holds)
- [Microsoft Learn: Recoverable Items folder not emptied for mailbox on litigation or retention hold](https://learn.microsoft.com/en-us/troubleshoot/exchange/antispam-and-protection/recoverable-items-folder-full)
- [Microsoft Learn: Learn about retention for Microsoft Purview](https://learn.microsoft.com/en-us/purview/retention)
- [Office 365 for IT Pros (third party): Exchange Online retention policies and the Deleted Items folder, December 2023](https://office365itpros.com/2023/12/12/default-mrm-policy-issue/)
- [Microsoft Q&A: O365 Exchange online archive and retention policy (August 2025)](https://learn.microsoft.com/en-us/answers/questions/5515785/o365-exchange-online-archive-and-retention-policy)
- [Microsoft Q&A: Purview MRM retention policies not working (May 2026)](https://learn.microsoft.com/en-sg/answers/questions/5899844/purview-mrm-retention-policies-not-working)
- [Microsoft Q&A: Items in Deleted Items are not automatically deleted after 14 days (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5915540/items-in-deleted-items-are-not-automatically-delet)
