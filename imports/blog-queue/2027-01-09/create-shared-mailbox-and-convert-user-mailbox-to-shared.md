---
title: "How to Create a Shared Mailbox and Convert a User Mailbox to Shared"
summary: "Create a shared mailbox in Exchange Online and convert a user mailbox to shared: creation paths, Full Access, Send As and Send on Behalf, license and 50 GB limits, password and sign-in notes, deleted-user case and converting back."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [exchange-online]
keypoints:
  - "A shared mailbox lets a group read and send from a common address. Creating one also creates a user account with a system-generated password."
  - "Full Access opens the mailbox. Send As or Send on Behalf is also needed to send from it. Send on Behalf cannot be granted in the Exchange admin center."
  - "To convert a user mailbox, go to Users > Active users, select the user, then Mail > Convert to shared mailbox. The mailbox must be licensed first."
  - "Unlicensed shared mailboxes are limited to 50 GB. Holds need an Exchange Online Plan 2 license, or Plan 1 with the Archiving add-on."
  - "Do not delete the old user account. It anchors the shared mailbox. The original password keeps working unless you reset it."
faq:
  - q: "How do I create a shared mailbox?"
    a: "Microsoft Learn recommends the Microsoft 365 admin center. In the Exchange admin center, go to Recipients > Mailboxes, select Add a shared mailbox, enter Display Name, Email address and Alias, select Create, then add users. PowerShell uses New-Mailbox -Shared."
  - q: "What permissions do users need?"
    a: "Full Access lets a user open the mailbox. Send As lets them send as the mailbox, and Send on Behalf lets them send on behalf of it. Full Access alone cannot send."
  - q: "How do I convert a user mailbox to shared?"
    a: "In the admin center go to Users > Active users, select the user, open the Mail tab, select Convert to shared mailbox and then Convert. The mailbox needs a license before conversion, or the option does not appear."
  - q: "Can I remove the license afterward?"
    a: "Learn says you can remove the license after converting, and the steps add that this applies if the mailbox is smaller than 50 GB. Holds and larger mailboxes need Exchange Online licensing."
  - q: "How do I convert it back?"
    a: "In the Exchange admin center select Recipients > Mailboxes, select the shared mailbox, and on the Others tab select Convert to regular mailbox. Then assign a license and reset the password for the account."
---

Shared mailboxes let a team monitor and send from one address, such as support@contoso.com. Replies look like they come from the shared mailbox, not the person. This guide follows two Microsoft Learn pages: one on shared mailboxes in Exchange Online and one on converting a user mailbox to a shared mailbox.

## Create a shared mailbox

- **Microsoft 365 admin center.** Learn says you should create it there and links to a separate article. No steps are on the page read.
- **Exchange admin center.** Go to **Recipients** > **Mailboxes** and select **Add a shared mailbox**. Enter **Display Name**, **Email address** and **Alias**, then select **Create**. Under next steps, select **Add users to this mailbox**, add users and select **Save**.
- **Hybrid.** In a hybrid environment, use the on-premises Exchange admin center to create and manage shared mailboxes.
- **PowerShell.** Learn's example creates the mailbox, grants Send on Behalf to a group and adds Full Access:

```powershell
New-Mailbox -Shared -Name "Sales Department" -DisplayName "Sales Department" -Alias Sales | Set-Mailbox -GrantSendOnBehalfTo MarketingSG | Add-MailboxPermission -User MarketingSG -AccessRights FullAccess -InheritanceType All
```

The example assumes the mail-enabled security group MarketingSG exists.

Creating a shared mailbox also creates an active user account with a system-generated, unknown password.

## Permissions

- **Full Access** lets a user open the mailbox and act as its owner: calendar items, email and tasks and contacts. Full Access alone does not allow sending.
- **Send As** lets a user impersonate the shared mailbox when sending.
- **Send on Behalf** lets a user send on behalf of the mailbox. You cannot grant it in the Exchange admin center. Use `Set-Mailbox` with the GrantSendOnBehalfTo parameter.

The page's EAC steps say both Full Access and Send As are required for the mailbox to work properly, while the permissions section says Send As or Send on Behalf is needed to send. Plan for both and test sending.

## Convert a user mailbox to shared

1. In the admin center go to **Users** > **Active users** and select the user.
2. On the **Mail** tab select **Convert to shared mailbox**, then **Convert**.

The user mailbox needs a license before conversion. Otherwise the option does not appear. The only PowerShell example on the page is for on-premises Exchange: `Set-Mailbox -Identity mailbox1@contoso.com -Type Shared`. The page shows no Exchange Online command.

**After the conversion**

- Inbox rules are preserved.
- You do not need to reset the password, but the original username and password keep working on the shared mailbox if you do not.
- Do not delete the old user account, because it anchors the shared mailbox.
- For a departing employee, the page refers to its article on removing a former employee. It does not say to block sign-in itself.

## Licenses and size

- Without a license, shared mailboxes are limited to 50 GB.
- If the mailbox is smaller than 50 GB, you can remove the user's license and stop paying for it.
- With Exchange Online Plan 2 assigned to the shared mailbox, the limit rises to 100 GB.
- In-Place Hold or Litigation Hold needs Plan 2, or Plan 1 plus the Exchange Online Archiving add-on.
- With Plan 1 plus the add-on you can turn on auto-expanding archiving. The page gives no size.
- If a mailbox is over 50 GB, you may need to delete large messages to shrink it before removing the license.

## A deleted user's mailbox

Restore the user account, assign a license, reset the password, wait up to 24 hours for the mailbox to be re-created, remove the license, and add members. Do not delete the old mailbox, because the shared mailbox needs it as an anchor.

## Convert back to a user mailbox

1. In the Exchange admin center select **Recipients** > **Mailboxes** and the shared mailbox.
2. On the **Others** tab select **Convert to regular mailbox** and confirm.
3. In the admin center under **Users**, assign a license and reset the password.

It takes a few minutes for the mailbox to be set up.

## What the pages do not say

- Steps to create the mailbox in the Microsoft 365 admin center, and steps to block sign-in.
- A time for a normal conversion.
- A cloud PowerShell command for conversion.
- Details of automapping.
- Hybrid conversion steps.

## A conversion routine

This routine is practical advice built on the pages.

1. Check that the mailbox has a license, and check its size.
2. Convert it and add the members with Full Access and Send As.
3. Decide about the original password and sign-in for the old account.
4. Remove the license only if the mailbox is under 50 GB and has no holds.

## Typical mistakes

- Giving only Full Access and wondering why users cannot send.
- Deleting the old user account.
- Removing the license from a mailbox over 50 GB or on hold.
- Trying to grant Send on Behalf in the Exchange admin center.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Shared mailboxes in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/collaboration-exo/shared-mailboxes)
- [Convert a user mailbox to a shared mailbox (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/email/convert-user-mailbox-to-shared-mailbox)
