---
title: "Shared Mailbox Auto-Mapping: Not Appearing in Outlook, or Not Going Away"
summary: "Full Access is granted but the mailbox does not show up in Outlook, or it stays after access was removed. Check how access was granted, re-add it with AutoMapping set on purpose, and test Autodiscover."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [exchange-online, exchange-online-powershell, shared-mailbox, outlook]
keypoints:
  - "Auto-mapping uses Autodiscover and the msExchDelegateListBL attribute. Autodiscover does not expand security groups, so access granted through a group never auto-maps."
  - "To change auto-mapping for an existing permission, remove Full Access and add it again with -AutoMapping set to the value you want."
  - "Microsoft Learn says AutoMapping defaults to true. Community answers in 2025 said you must set it in PowerShell. Setting it explicitly costs nothing."
  - "Allow time, restart Outlook, and use Test E-mail AutoConfiguration to see whether Autodiscover returns the mailbox."
faq:
  - q: "Why does a shared mailbox not appear in Outlook although Full Access shows correctly?"
    a: "Microsoft Learn explains that auto-mapping depends on Autodiscover reading the msExchDelegateListBL attribute, and that Autodiscover does not expand security group membership. If access was granted through a group, the mailbox never auto-maps. Grant Full Access to each user directly, or add the mailbox manually."
  - q: "Is AutoMapping on by default in Add-MailboxPermission?"
    a: "Microsoft Learn says the default is $true. In two November 2025 threads, community answers said the parameter is not set by default in PowerShell. The Learn page is the documented behavior, but specifying -AutoMapping $true removes any doubt."
  - q: "How do I stop a mailbox from auto-mapping for one user?"
    a: "Microsoft Learn says to remove the user's Full Access permission with Remove-MailboxPermission and add it again with Add-MailboxPermission and -AutoMapping $false. You cannot change auto-mapping on an existing permission in place."
  - q: "How long does auto-mapping take to show up?"
    a: "Learn gives no figure. Several answers in the threads, including one from a Microsoft moderator, say classic Outlook can take up to about 30 minutes to pick up the change from Autodiscover. Close Outlook fully and reopen it after you change the permission."
---

You gave a user Full Access to a shared mailbox. The permission shows in the Exchange admin center and in PowerShell, but the mailbox does not appear in the user's Outlook. Or the opposite: you removed access and the mailbox still sits in the folder list and shows an error when opened.

Both versions came up repeatedly in Microsoft community threads in 2025 and 2026. This article collects what Microsoft Learn documents and what the threads added. It is a troubleshooting guide, not an official Microsoft procedure.

## What the threads reported

- **November 2025, thread one.** Permissions were set in the admin center and PowerShell showed AutoMapping as true. The user restarted Outlook, cleared the cache and tried a new profile. The mailbox only worked when added by hand. An anonymous Microsoft Q&A answer carrying an accepted label advised removing and re-adding Full Access with `-AutoMapping $true` and restarting Outlook. The person replied with thanks, but the page does not show a confirmed result.
- **November 2025, thread two.** The same symptom for several users of one shared mailbox. A moderator gave the remove-and-re-add steps. A volunteer moderator added that the parameter has to be specified in PowerShell, that Autodiscover can take about 30 minutes to update in classic Outlook, that you can test with the Test E-mail AutoConfiguration tool and the Remote Connectivity Analyzer, and that hybrid setups are not fully supported for auto-mapping. Both answers carry an accepted label, but the person who asked did not confirm a fix.
- **April 2026.** A new shared mailbox for more than 30 users appeared in new Outlook and Outlook on the web, but not in classic Outlook. A moderator said access granted through a group will not auto-map and gave the remove-and-re-add steps. The person who asked later said that Full Access was granted directly to himself and several others and that classic Outlook still did not show the mailbox, so he planned to contact support. That conflicts with the group explanation for this case.
- **September 2026.** Full Access granted a few hours earlier, nothing in Outlook. An independent advisor suggested the same remove and re-add. There was no reply.
- **August 2024, the reverse case.** After a delegation was removed, the mailbox stayed in Outlook. The accepted answer said the Autodiscover response keeps telling Outlook to open the mailbox until it is updated, and advised changing the permission to `-AutoMapping $false`. The person who asked then added the permission again with `-AutoMapping $false`, waited for Autodiscover to update, and removed the permission. He confirmed that the mailbox disappeared from Outlook.

So only the removal case has a clear confirmation. The "not appearing" case has a documented cause and a common fix, but few confirmed results.

## Symptoms

- Full Access shows in the admin center and in `Get-MailboxPermission`, but the mailbox is missing in classic Outlook.
- The mailbox opens in Outlook on the web, or when added manually.
- A mailbox stays in Outlook after access was removed and shows an error when opened.

## Step 1: Check how access was granted

Microsoft Learn is direct about the main cause. Autodiscover reads the `msExchDelegateListBL` attribute to decide which mailboxes to add, and it does not expand security group membership. A mailbox granted to a group is never auto-mapped. The `Add-MailboxPermission` page says the same: when a mail-enabled security group holds Full Access, auto-mapping does not add the mailbox for the group's members.

List who has what:

```powershell
Get-MailboxPermission -Identity <shared mailbox> | Format-List
Get-MailboxPermission -Identity <shared mailbox> -User <user>
```

In Exchange Online, Learn points to `Get-EXOMailboxPermission` as the preferred cmdlet. Look for the user as a direct entry, not only a group. Learn's resolution for the group case is to give each user Full Access to each mailbox they want auto-mapped. Learn also notes that non-mail-enabled security groups can be selected but do not work for this permission.

## Step 2: Remove and re-add the permission

If access is direct but the mailbox does not appear, the threads' common fix is to reset the permission. Test with one user first.

```powershell
Remove-MailboxPermission -Identity "<shared mailbox>" -User "<user>" -AccessRights FullAccess
Add-MailboxPermission -Identity "<shared mailbox>" -User "<user>" -AccessRights FullAccess -AutoMapping $true
```

`Remove-MailboxPermission` asks for confirmation. Learn's page on removing auto-mapping notes that you can add `-Confirm:$false` to skip the prompt.

About the default: Microsoft Learn says `-AutoMapping` defaults to `$true`. Two answers in the November 2025 threads said it is not set by default in PowerShell and that the admin center sets it. That does not match the Learn page. The documented default holds as far as I can tell, but there is no harm in writing `-AutoMapping $true`. Learn documents the remove-and-re-add method for turning auto-mapping off. Using it to turn auto-mapping on again is what the threads recommend, and it follows from the same parameter description. The Learn pages do not describe that case as such.

## Step 3: Wait, restart, and test Autodiscover

Close Outlook fully, then reopen it. Learn gives no propagation time. Several thread answers say classic Outlook can take up to about 30 minutes, so test after that.

If it still does not appear, check what Autodiscover returns. Microsoft's support article on hybrid auto-mapping describes this test:

1. Hold Ctrl and right-click the Outlook icon in the notification area.
2. Select **Test E-mail AutoConfiguration**.
3. Clear **Use Guessmart** and **Secure Guessmart Authentication**, then select **Test**.
4. On the **XML** tab, look for an `AlternativeMailbox` entry for the shared mailbox.

If the entry is there and Outlook still does not show the mailbox, the issue is on the client side. The same article says the Outlook version must be recent enough, and names Outlook 2013 with a May 2015 update as the minimum. If the entry is missing, Autodiscover is not returning the mailbox, and Steps 1 and 2 or the hybrid notes below apply. The Remote Connectivity Analyzer, as one community answer suggested, tests Autodiscover from outside.

## Step 4: Hybrid environments

One thread answer says hybrid setups are not fully supported for auto-mapping. Microsoft's support article is more specific:

- If the user already had permission before the mailbox moved to the cloud, the auto-mapping attributes sync through directory sync and the permissions are carried over by the move.
- If permissions are added after the move, for a user who is a mail user on-premises, the attributes are not created automatically. They must be added by hand on the on-premises object, and the article names `Set-ADUser` and the attributes `msExchDelegateListLink` and `msExchDelegateListBL` for this.

That article was updated in September 2026 according to its metadata, but its text carries no visible date. Read it before you change Active Directory attributes, and involve Microsoft Support if the attributes exist on-premises and auto-mapping still fails, as the article advises.

## Step 5: Make a mailbox disappear, or never appear

To stop auto-mapping for one user and one mailbox, Microsoft Learn describes the sequence. Remove the Full Access permission, then add it again with `-AutoMapping $false`:

```powershell
Remove-MailboxPermission -Identity <mailbox> -User <user> -AccessRights FullAccess
Add-MailboxPermission -Identity <mailbox> -User <user> -AccessRights FullAccess -AutoMapping $false
```

Learn says to repeat this for every mailbox where you want auto-mapping off. It does not say how an already configured Outlook profile reacts, and it gives no timing. Learn gives a reason to do this: when a user has Full Access to many mailboxes, Outlook can start slowly because it tries to open all of them.

For the stuck mailbox after access was removed, the person in the 2024 thread did this, following the accepted answer's advice to set `-AutoMapping $false`:

1. Add the permission again with `-AutoMapping $false`. This updates the Autodiscover response.
2. Wait until Outlook receives it.
3. Remove the permission again once the user no longer needs it.

The person who asked reported that the mailboxes were gone from Outlook afterward. This is a single thread and is not on the Learn pages I read.

## Step 6: The manual fallback

Posters in several threads said the mailbox works when added by hand, and Learn's auto-map page says the same for the group case. In Outlook on the web, the users in the threads added it as a shared folder. In classic Outlook they added it in the account settings, under the advanced options of the primary account. The exact menu labels in the threads were not checked against Learn, so use the current Microsoft Support article on opening a shared mailbox for the steps. A manual add is a stopgap. It will not help the next user.

## Limits and open points

- Most "not appearing" threads have no confirmed result. The April and September 2026 answers are advice, not proof.
- The default value of `-AutoMapping` is documented as `$true`. The community statement that it is not set by default is unconfirmed.
- Learn gives no timing for Autodiscover updates. The 30-minute figure is a community statement.
- Hybrid auto-mapping needs directory attributes and may need support. Do not edit Active Directory without a backup.

## Related

- [Shared mailbox](https://www.m365.fm/entity/shared-mailbox/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Microsoft Learn: Mailboxes to which your account has full access aren't automapped to Outlook profile](https://learn.microsoft.com/en-us/outlook/troubleshoot/profiles-and-accounts/full-access-mailbox-not-automapped-outlook-profile)
- [Microsoft Learn: How to remove automapping for a shared mailbox](https://learn.microsoft.com/en-us/office365/troubleshoot/administration/remove-automapping-for-shared-mailbox)
- [Microsoft Learn: Add-MailboxPermission](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/add-mailboxpermission?view=exchange-ps)
- [Microsoft Learn: Get-MailboxPermission](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-mailboxpermission?view=exchange-ps)
- [Microsoft Support: Auto-mapping doesn't work as expected in an Office 365 hybrid environment](https://support.microsoft.com/en-US/servicing/Exchange/online/troubleshooting/auto-mapping-doesn-t-work-as-expected-in-an-office-365-hybrid-environment)
- [Microsoft Q&A: Shared mailbox auto-mapping enabled but mailbox not appearing in Outlook (November 2025)](https://learn.microsoft.com/en-us/answers/questions/5611456/shared-mailbox-auto-mapping-enabled-but-mailbox-no)
- [Microsoft Q&A: Shared mailbox in Exchange Online not auto-mapping for delegated users (November 2025)](https://learn.microsoft.com/en-us/answers/questions/5608279/shared-mailbox-in-exchange-online-not-auto-mapping)
- [Microsoft Q&A: New shared mailboxes are not appearing for users in Outlook classic (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5870683/new-shared-mailboxes-are-not-appearing-for-users-i)
- [Microsoft Q&A: Shared mailbox auto-mapping not working (September 2026)](https://learn.microsoft.com/en-ie/answers/questions/6017004/shared-mailbox-auto-mapping-not-working)
- [Microsoft Community Hub: Mailbox not removed from Outlook after delegation is removed (August 2024)](https://techcommunity.microsoft.com/discussions/exchange_general/mailbox-not-removed-from-outlook-after-delegation-is-removed/4213994)
