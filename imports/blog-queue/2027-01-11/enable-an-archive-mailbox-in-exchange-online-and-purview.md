---
title: "How to Enable an Archive Mailbox in Exchange Online and Microsoft Purview"
summary: "Enable and disable archive mailboxes in Exchange Online with the Exchange admin center and PowerShell: permissions, auto-enable at 90 percent, bulk commands, the 30-day reconnect window, the two-year default archive policy and gaps in the Learn page."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [exchange-online, microsoft-purview-data-lifecycle-management]
keypoints:
  - "You need the Mail Recipients role. In the Exchange admin center go to Recipients > Mailboxes, select the user, then Others > Manage mailbox archive and turn on Mailbox archive."
  - "PowerShell: Enable-Mailbox -Archive. Auto-enable creates an archive at 90 percent of primary mailbox quota if the license includes archiving and the mailbox is not synced."
  - "Disabling keeps the archive for 30 days. Reconnecting within 30 days restores the content. After 30 days the content is permanently deleted."
  - "Items move by the default archive policy of the retention policy, which moves items two years after delivery or creation."
  - "The page gives no license list, no Purview portal path, no archive size limits and no auto-expanding archive commands."
faq:
  - q: "What permission do I need?"
    a: "The Mail Recipients role in Exchange Online. By default it is assigned to the Recipient Management and Organization Management role groups."
  - q: "How do I enable an archive in the admin center?"
    a: "Go to Recipients > Mailboxes, select the user, select Others, then under Mailbox archive select Manage mailbox archive, turn on Mailbox archive and select Save. When ready, Active appears in the Archive status column."
  - q: "How do I enable it with PowerShell?"
    a: "Connect to Exchange Online PowerShell and run Enable-Mailbox -Identity with the user name and the -Archive switch. The page also shows a bulk command for users without an archive."
  - q: "What does auto-enable do?"
    a: "With Set-OrganizationConfig -AutoEnableArchiveMailbox set to true, an archive is created when the primary mailbox reaches 90 percent of its quota, for user or shared mailboxes whose license includes archiving and that are not synced from on-premises."
  - q: "What happens when I disable an archive?"
    a: "Items are not moved and stay in the primary mailbox. You can reconnect within 30 days to restore the original contents. After 30 days the contents are permanently deleted."
---

An archive mailbox gives a user extra storage next to the primary mailbox. Items move there by retention policy. This guide follows the Microsoft Learn page on enabling archive mailboxes. The page covers the Exchange admin center and PowerShell. It has no Purview portal path and no list of licenses.

## Permissions

You need the Mail Recipients role in Exchange Online. By default it is assigned to the Recipient Management and Organization Management role groups on the Permissions page of the Exchange admin center.

## Enable in the Exchange admin center

1. Go to **Recipients** > **Mailboxes**.
2. Select the user.
3. In the flyout select **Others**, then under **Mailbox archive** select **Manage mailbox archive**.
4. Turn on **Mailbox archive** and select **Save**.

Creation can take a few moments. When ready, **Active** appears in the **Archive status** column. You may need to refresh.

## Auto-enable

```powershell
Set-OrganizationConfig -AutoEnableArchiveMailbox $true
```

An archive is created automatically when the primary mailbox reaches 90 percent of its quota, but only if all of these are true:

- It is a user mailbox or shared mailbox in Exchange Online.
- Archiving is included in the assigned license.
- It is not synced from on-premises (`IsDirSynced` is False).

## Enable with PowerShell

Connect to Exchange Online PowerShell first.

```powershell
Enable-Mailbox -Identity <username> -Archive
```

For all user mailboxes without an active or disabled archive:

```powershell
Get-Mailbox -Filter {ArchiveGuid -Eq "00000000-0000-0000-0000-000000000000" -AND DisabledArchiveGuid -Eq "00000000-0000-0000-0000-000000000000" -AND RecipientTypeDetails -Eq "UserMailbox"} | Enable-Mailbox -Archive
```

If the archive was disabled more than 30 days ago, the command fails with a `MissingDisconnectReceiptsException` error. Run `Set-Mailbox -Identity <username> -RemoveDisabledArchive` and then enable it again.

Users with a hold or retention policy: enabling archiving raises the Recoverable Items quota of the primary mailbox by 5 GB, from 100 GB to 105 GB, and the warning quota from 90 GB to 95 GB. This applies even if auto-expanding archive is not enabled.

## Disable

- In the Exchange admin center turn **Mailbox archive** off.
- In PowerShell use `Disable-Mailbox -Identity <username> -Archive`. The page also shows a command for all archived user mailboxes.
- You can reconnect within 30 days, which restores the original archive contents. After 30 days the contents are permanently deleted, and enabling again creates a new archive.
- Disabling does not move or change items. They stay in the primary mailbox.

## How items move

Items move according to the default archive policy in the retention policy assigned to the mailbox. That policy moves items two years after they were delivered or created. Enabling the archive moves items older than the archiving policy into the new archive.

## Verify

Check that **Archive status** shows **Active**. For a deeper check, the page offers an automated diagnostic on a user's archive mailbox. You must be a Microsoft 365 global admin, and the page recommends roles with the fewest permissions. A flyout opens in the Microsoft 365 admin center. Enter the mailbox address and select **Run Tests**. The diagnostic is not available in Government clouds, 21Vianet or Germany.

The page also says to explain to users how their archive works in Outlook on Windows, macOS and the web, and it links basic end-user instructions on the Microsoft support site.

## Auto-expanding archiving

The page does not describe auto-expanding archiving. It mentions it only in passing, in the note that the Recoverable Items quota increase applies even if auto-expanding archive is not enabled. It links no separate article about it.

## What the page does not say

- Which licenses include archiving. The only licensing reference is the auto-enable condition.
- A Purview portal path. The page does not give one.
- Archive size limits or per-user numbers beyond the quota figures above.
- Provisioning time beyond a few moments.
- Auto-expanding archiving commands.
- The bulk enable command covers user mailboxes only, while auto-enable also covers shared mailboxes.

## A rollout outline

This outline is my advice, built on the page.

1. Check that the license includes archiving.
2. Enable one pilot mailbox in the Exchange admin center and confirm Archive status Active.
3. Use the bulk command for user mailboxes, or turn on auto-enable.
4. Review the retention policy that moves items after two years.
5. Look for guidance on auto-expanding archiving elsewhere if mailboxes grow past quota, since this page has none.

## Typical mistakes (my advice)

- Disabling an archive and waiting more than 30 days before reconnecting.
- Expecting the bulk command to include shared mailboxes.
- Assuming Purview has its own enable path on this page.
- Forgetting the Recoverable Items quota increase for users on hold.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Enable archive mailboxes for Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/purview/enable-archive-mailboxes)
