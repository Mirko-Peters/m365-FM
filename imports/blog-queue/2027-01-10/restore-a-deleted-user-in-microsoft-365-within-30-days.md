---
title: "How to Restore a Deleted User in Microsoft 365 Within 30 Days"
summary: "Restore a deleted user in the Microsoft 365 admin center: the User Administrator role, the 30-day window, Deleted users steps, password and license handling, name and proxy address conflicts, and what the Learn page does not say."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [microsoft-365-admin-center]
keypoints:
  - "Restoring within 30 days of deletion brings back the account and all associated data. The mailbox is fully restored. You need the User Administrator role."
  - "In the admin center go to Users > Deleted users, select the user, select Restore user, set a password and select Restore."
  - "Add a license after the restore if the user should use Microsoft 365. Make sure enough licenses are available."
  - "On a user name conflict, rename the active user or enter a new primary email address for the restored user. Conflicting proxy addresses are removed automatically."
  - "The page shows no PowerShell, does not say what happens to OneDrive and gives no way to see the time left. For that it says to contact support."
faq:
  - q: "How long can I restore a deleted user?"
    a: "Microsoft Learn says that restoring within 30 days of deleting brings back the account and all associated data. To check how much time remains for a specific account, the page says to contact support."
  - q: "What role do I need?"
    a: "You must be a User Administrator."
  - q: "How do I restore the user?"
    a: "In the Microsoft 365 admin center go to Users > Deleted users, select the user name, select Restore user, follow the prompts to set a password and select Restore. Then add a license."
  - q: "What if the user is not in the Deleted users list?"
    a: "The page says too much time may have passed since the account was deleted. In that case it directs you to get support."
  - q: "What about a name conflict?"
    a: "If a new account with the same user name was created after the deletion, either rename the active user and retry, or enter a new primary email address for the restored user and select Restore."
---

Deleted users stay recoverable for a limited time. Within 30 days an admin can restore the account from the Microsoft 365 admin center. This guide follows the Microsoft Learn page on restoring a user. The page covers the portal path only and shows no PowerShell.

## Requirements

- Role: User Administrator.
- Time: when you restore within 30 days of deletion, the account and all associated data are restored.
- Licenses: make sure enough Microsoft 365 licenses are available to assign to the account.

## Steps

1. In the Microsoft 365 admin center go to **Users** > **Deleted users**.
2. Select the user's name, then select **Restore user**. To restore several accounts, select multiple users.
3. Follow the prompts to set a password, then select **Restore**.
4. If the restore succeeds, select **Print** to print the user name and password information and send it to the user securely.
5. Add a license if the user should use Microsoft 365.

Tell the user that their password changed and follow up with them.

## What is restored

- The account and all associated data.
- The mailbox, which Learn says is fully restored.
- The user can sign in with the same work or school account.

## Conflicts

- **User name conflict.** The page defines it as deleting an account, creating a new account with the same user name (for the same or a different user), and then trying to restore the deleted one. If a message appears saying there is a problem restoring the account, either cancel the restore, rename the current active user and try again, or type a new primary email address for the restored user and select **Restore**. If two or more accounts fail to restore, an error message says so. View the log to see which users were not restored, then restore the failed accounts one at a time.
- **Proxy address conflict.** Conflicting proxy addresses are removed automatically from the user you restore.

## If the user is not listed

If the account does not appear on the Deleted users page, too much time may have passed since the deletion. The page directs you to support in that case.

## Synced users

The page has only a tip: if your business uses Active Directory on-premises, see a separate article on restoring deleted user accounts in Microsoft 365, Azure and Intune. It describes no process for synced accounts.

## What the page does not say

- Whether OneDrive content is restored. It names only the mailbox and all associated data.
- PowerShell commands.
- How to see the time that remains in the portal.
- What happens to license assignments during the deletion period or on restore.
- Sign-in, MFA or device registration behavior beyond the password reset.

## A restore routine

This routine is my advice, built on the page.

1. Check the role and the license count before you start.
2. Open Deleted users and look for the account.
3. Restore it, set the password and print the details.
4. Assign a license.
5. Tell the user and check that they can sign in.

## Typical mistakes (my advice)

- Waiting beyond 30 days.
- Forgetting the license, so the user cannot use Microsoft 365 after the restore.
- Not telling the user about the new password.
- Assuming OneDrive content is covered. The page does not say so.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Role | User Administrator |
| Window | 30 days after deletion |
| Portal path | Users > Deleted users > Restore user |
| After restore | Add a license, tell the user about the new password |
| Mailbox | Fully restored |
| Not on the page | PowerShell, OneDrive, time remaining, license retention |

## What to prepare (my advice)

Before you open the Deleted users page, check the license count. The page asks you to make sure enough Microsoft 365 licenses are available to assign to the account. Decide who will pass on the password. The portal can print the user name and password information, and the page says to send it to the user securely. Plan a follow-up with the user, because the password changes during the restore.

## If several restores fail

In the user name conflict procedure the page says that if two or more accounts fail to restore, an error message tells you the restore failed for some users. You can view the log to see which users were not restored, and then restore the failed accounts one at a time.

## Related

- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Restore a user (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/add-users/restore-user)
