---
title: "Fix Exchange Online Mailbox Move Failures: Corrupted Items, Large Items and Skipped Items"
summary: "How to read skipped items and the data consistency score during an Exchange Online mailbox move, approve them with SkippedItemApprovalTime, and what to do about corrupted and oversized items, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [exchange-online, exchange-online-powershell, migration-cutover, exchange-server]
keypoints:
  - "Microsoft documents BadItemLimit and LargeItemLimit as deprecated from the cloud service. Admins must review the data consistency score and skipped items before a move completes."
  - "The score has four grades: Perfect, Good, Investigate and Poor. Investigate needs approval for moves with a finalization phase, such as hybrid remote moves."
  - "Approve skipped items with Set-MoveRequest -SkippedItemApprovalTime, or Set-MigrationBatch and Set-MigrationUser with -ApproveSkippedItems."
  - "A Poor score cannot be forced through with approval. Learn says to contact Microsoft Support."
  - "Skipped items can be corrupted items, items above the tenant maximum message size, or items missing from the target when the move is ready to complete."
faq:
  - q: "Why does a mailbox move stop with skipped items in Exchange Online?"
    a: "Microsoft Learn says items might be skipped because they are corrupted in the source mailbox and cannot be copied, because they are larger than the maximum message size configured for the tenant, or because they are missing from the target when the move is ready to complete. If the detected data loss is significant, the move cannot complete without approving the skipped items."
  - q: "Can I still set BadItemLimit or LargeItemLimit for Exchange Online?"
    a: "The New-MoveRequest and Set-MoveRequest reference pages say these parameters are available only in on-premises Exchange and are deprecated from the cloud-based service. Admins must review the data consistency score and skipped items before the move completes. A separate troubleshooting page for TooManyBadItemsPermanentException still shows baditemlimit steps, so treat the cmdlet reference as the current guidance."
  - q: "How do I approve skipped items?"
    a: "Microsoft Learn documents Set-MoveRequest with -SkippedItemApprovalTime for move requests. For migration batches and users, it names the -ApproveSkippedItems parameter on Set-MigrationBatch and Set-MigrationUser. Approval applies to items discovered before the time you specify."
  - q: "What can I do if the score is Poor?"
    a: "According to Microsoft Learn, a Poor score means major data loss was detected. For an individual user you cannot force the migration to succeed, and the page tells you to contact Microsoft Support. In a batch, approval will not approve any migration scored Poor."
  - q: "Where do I see which items were skipped?"
    a: "In the Exchange admin center, go to Migration, select the batch, choose View details, select the user and open Skipped item details. In Exchange Online PowerShell, Get-MigrationUserStatistics with -IncludeSkippedItems lists the skipped items and their scoring classifications."
---

When an Exchange Online mailbox move stops on corrupted or large items, the cause is usually skipped items that the service will not leave behind silently. Microsoft Learn says the old `BadItemLimit` and `LargeItemLimit` parameters are deprecated from the cloud service. Instead, admins must review the data consistency score and the skipped items before the move completes, and approve them when the score allows it.

## What counts as a skipped item

The Set-MoveRequest reference lists three reasons an item is skipped:

1. It is corrupted in the source mailbox and cannot be copied to the target.
2. It is larger than the maximum message size configured for the tenant.
3. It was detected as missing from the target mailbox when the migration is ready to complete.

Learn defines a large item as a message in the source mailbox that exceeds the maximum message size allowed in the target mailbox. If the target has no specific maximum, the organization-wide value is used.

If the data loss is significant, the move cannot complete without approving skipped items.

## Step 1: Read the data consistency score

The migration process tracks possible data loss and produces a DataConsistencyScore. Learn lists four grades:

| Grade | Meaning | Approval |
|---|---|---|
| Perfect | No inconsistencies noted | Not required, the move completes |
| Good | At least one inconsistency, but the loss was not impactful | Not required, the move completes |
| Investigate | A small amount of noticeable data loss from common inconsistency types | Required for types with a finalization phase, such as remote move in hybrid and Google Workspace |
| Poor | Major data loss detected | Contact Microsoft Support. Approval is still needed for types with a finalization phase but does not force success |

For a batch, the score equals the worst score of any user in it. Microsoft adjusts the thresholds over time and does not publish the values. The score appears in the Exchange admin center and as the `DataConsistencyScore` property on migration batch, migration user and request statistics objects.

## Step 2: Look at the skipped items

In the Exchange admin center:

1. Go to **Migration**.
2. Select the batch and choose **View details**.
3. Select the user, then **Skipped item details**.

You see the date, subject, kind of error and folder for each item. The **Kind** column states the error type that caused the skip.

In Exchange Online PowerShell:

```powershell
$userStats = Get-MigrationUserStatistics -Identity user@contoso.com -IncludeSkippedItems
$userStats.SkippedItems | ft -a Subject, Sender, DateSent, ScoringClassifications
```

The user details pane also offers **Download the report for this user**, which contains diagnostic information that you or Microsoft Support can use for failed migrations.

## Step 3: Fix what you can in the source

- **Corrupted items:** the `BadItemLimit` description in the Set-MoveRequest reference (a parameter marked on-premises only and deprecated from the cloud service) suggests `New-MailboxRepairRequest` to attempt to fix corrupted items in the source mailbox, and then trying the request again. Learn gives no equivalent Exchange Online workflow, so treat this as a starting point.
- **Large items:** compare the item size with the maximum message size configured for the tenant and target mailbox. The pages read do not describe a workflow for resizing or removing such items, so decide per item whether to reduce it, move it out or accept the loss.

## Step 4: Approve skipped items when the loss is acceptable

For a move request:

```powershell
Set-MoveRequest -Identity user@contoso.com -SkippedItemApprovalTime $(Get-Date).ToUniversalTime()
```

This approves all skipped items discovered before that time. Learn says to give the date and time in UTC, for example `"2021-05-06 14:30:00z"`. For batches and users, the data consistency page names `-ApproveSkippedItems` on `Set-MigrationBatch` and `Set-MigrationUser`. That page words the batch command loosely, so check the cmdlet reference for the exact syntax.

What approval does:

- **Batch scored Investigate:** migrations with Perfect, Good or Investigate can complete.
- **Batch scored Poor:** approval does not approve any migration scored Poor.
- **User scored Poor:** you cannot force success. Contact Microsoft Support.

Approval is not needed for third-party IMAP, PST and on-premises cutover or staged Exchange migrations.

## Step 5: Control when the move completes

Instead of `SuspendWhenReadyToComplete` or `PreventCompletion`, Learn recommends `CompleteAfter`. The request starts but does not complete until the date and time you specify. In Exchange Online PowerShell, a value without a time zone is read as UTC. This gives you a window to review the score and approve items before completion.

`AcceptLargeDataLoss` is still listed for Exchange Online, but Learn says that in Exchange Online it has no dependency on `BadItemLimit` or `LargeItemLimit`, because those parameters are not available.

## About the older bad item advice

A Learn troubleshooting page for `TooManyBadItemsPermanentException` describes the error during a migration in Microsoft 365. It says the cause is a bad item count above the set limit and shows a way to read the move report with `Get-MailboxStatistics -IncludeMoveReport` and raise `baditemlimit` before `Resume-MoveRequest`. The same page notes that missing items count toward the bad item limit. It does not say it is deprecated, while the cmdlet reference does. When you see this error, use the report to count the items and then follow the score and approval flow described above. If a command fails, confirm with the cmdlet reference.

## Typical mistakes

- Raising limits instead of reviewing the score.
- Approving a batch and expecting Poor users to complete.
- Entering a local time in the approval parameter instead of UTC.
- Ignoring items in the source that are above the tenant message size.
- Letting a move complete without checking the skipped items list.

## What the sources do not say

The pages read do not list the exact error kinds shown in the Kind column, do not publish score thresholds, and do not describe the move report entries in detail.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Cutover migration](https://www.m365.fm/entity/migration-cutover/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)

## Sources

- [Track and prevent migration data loss in Exchange Online](https://learn.microsoft.com/en-us/exchange/mailbox-migration/track-prevent-data-loss-dcs)
- [Set-MoveRequest](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-moverequest)
- [New-MoveRequest](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/new-moverequest)
- [Migration users status report in Exchange Online](https://learn.microsoft.com/en-us/exchange/mailbox-migration/migration-users-status-report)
- [TooManyBadItemsPermanentException during migration](https://learn.microsoft.com/en-us/troubleshoot/exchange/administration/toomanybaditemspermanentexception-during-migration)
