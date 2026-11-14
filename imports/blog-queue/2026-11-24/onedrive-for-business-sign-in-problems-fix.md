---
title: "OneDrive for Business Sign In Problems: Fixes for Work or School Accounts"
summary: "Fix OneDrive for Business sign-in problems: check the account, firewall, unlink and relink, reset the app, and verify licenses for errors like 0x8004de85, using Microsoft documentation."
status: review
publish: false
author: mirko-p
date: 2026-11-24
topics: [onedrive, onedrive-sync-engine, entra-id]
keypoints:
  - "A grayed-out OneDrive icon with a line through it means the account is signed out. Select it and sign in again."
  - "Errors 0x8004de85 and 0x8004de8a point to a missing account or a personal and work account mismatch."
  - "Unlink the PC, delete PreSignInSettingsConfig.json and sign in again if a normal sign-in fails."
  - "Resetting OneDrive with onedrive.exe /reset disconnects all sync connections. Microsoft says it doesn't lose files or data."
  - "Admins should confirm a OneDrive license is assigned in the Microsoft 365 admin center under Users, Active users."
faq:
  - q: "Why can't I sign in to OneDrive for Business?"
    a: "Microsoft Learn lists several causes: a missing account, a mismatch between a personal Microsoft account and work or school credentials, a firewall blocking OneDrive, or a missing license. Start by checking which account the app shows under Help and Settings, Settings, Account."
  - q: "What do errors 0x8004de85 and 0x8004de8a mean?"
    a: "Microsoft Learn says these errors might occur when a problem affects the OneDrive account, such as a missing account, or when someone signs in to a personal Microsoft account with work or school credentials or the other way round."
  - q: "Does resetting OneDrive delete my files?"
    a: "Microsoft Support says a reset disconnects all sync connections, including a personal OneDrive if one is set up, and that you won't lose files or data. After the reset, sign in again and the files sync back."
  - q: "Who can fix a license problem?"
    a: "A Microsoft 365 administrator. Microsoft Learn says to open the Microsoft 365 admin center, go to Users, Active users, select the user, open Licenses and apps and confirm that a OneDrive for Business license is assigned."
---
When OneDrive for Business won't sign in, the cause is usually the wrong account, a blocked connection, damaged local sign-in data or a missing license. Work through the checks in order, from least to most disruptive. The steps below come from Microsoft Support and Microsoft Learn and apply to the Windows sync app unless noted.

## First check: the icon and the account

A grayed-out OneDrive icon with a line through it means the account is signed out. Select the icon. On the **Set up OneDrive** screen, enter the email address and password.

- **Work or school account:** if the password is forgotten, reset it or contact the organization's IT admin.
- **Personal account:** Microsoft points to the sign-in helper for Microsoft accounts. Only one personal Microsoft account can be added.

Then confirm which account the app is using:

1. Select the OneDrive icon in the taskbar notification area. If it is missing, select the **Show hidden icons** arrow. If it still isn't there, OneDrive might not be running. Select **Start**, type OneDrive and open it.
2. Select **Help & Settings**, then **Settings**.
3. On the **Account** tab, check that the expected account is shown. Otherwise sign in with the correct one.

Also sign in to the Microsoft 365 account online first. If that fails, the problem is the account and not the sync app. Microsoft's work sync article suggests selecting **View online** from the OneDrive icon and says to contact the network administrator if the account isn't reachable online.

## Error 0x8004de85 or 0x8004de8a

Microsoft Learn documents these two codes together. The issue might occur when a problem affects the OneDrive account, such as a missing account, or when the credentials belong to the wrong kind of account, for example work credentials entered for a personal Microsoft account. The documented fixes are, in order:

1. Make sure the correct account is used, as above.
2. Reset OneDrive.
3. Ask an administrator to check the license.

## Check for a blocked connection

If sign-in works but OneDrive still can't connect, the internet provider's firewall might be blocking it. Microsoft suggests testing with a phone as a hotspot or asking the provider whether it supports Microsoft 365 access. If the app reports that OneDrive isn't connected, restart OneDrive. On Windows, search for OneDrive in the Start menu. On a Mac, search in Finder. If it isn't installed, download the latest version.

## Unlink the PC and clear sign-in data

This sequence is from Microsoft Support's work sync article (Windows):

1. Select the OneDrive cloud icon, then the **Help and Settings** gear, then **Settings**.
2. On the **Account** tab, select **Unlink this PC**, then **Unlink account**.
3. Press Windows key + R, enter `%localappdata%\Microsoft\OneDrive\settings` and select **OK**.
4. Delete the file **PreSignInSettingsConfig.json**.
5. Open OneDrive from the Start menu and sign in.
6. When asked about an existing folder, select **Use this folder**, or **Choose new folder** to move it.
7. Wait for the files to sync back. Initially only placeholders download.
8. After the re-sync, choose which folders to sync on the PC.

Plan time for step 7, since a large library takes a while to come back.

## Reset OneDrive

If unlinking doesn't help, Microsoft Learn documents a reset:

1. Right-click the OneDrive icon in the notification area, select **Help & Settings**, then **Quit OneDrive**.
2. Select **Start**, enter cmd, right-click **Command Prompt** and select **Run as administrator**.
3. Run `%localappdata%\Microsoft\OneDrive\onedrive.exe /reset`
4. Restart OneDrive and sign in with the work or school account.

Microsoft Support says a reset disconnects all sync connections, including a personal OneDrive if configured, and that no files or data are lost.

## Check the license (admin task)

A missing license can block sign-in. The steps for the Microsoft 365 admin center are:

1. Select **Users**, then **Active users**.
2. Select the affected user.
3. Open **Licenses and apps**.
4. Expand **Licenses** and make sure a OneDrive for Business license is assigned.

If many users have the problem, the subscription might have expired. Check **Billing**, then **Your products**.

## Browser sign-in to onedrive.cloud.microsoft

Two error messages on the work or school web site mean a personal account is being used:

- "Selected user account does not exist in tenant 'Microsoft Services'"
- "cannot access the application '00000003-0000-0ff1-ce00-000000000000'"

The fix from Microsoft is to sign in with the work or school Microsoft Entra ID account. If that still fails, contact the helpdesk or admin.

## Suggested order of work

1. Check the icon state and the account shown under Settings.
2. Confirm the account works online, and that it is the right type of account.
3. Rule out a blocked connection with a different network.
4. Unlink the PC, remove the pre-sign-in file and sign in again.
5. Reset the app if the unlink didn't help.
6. Escalate to the administrator for the license and subscription checks.

Each step is more disruptive than the one before it, so stop as soon as sign-in works.

## Common mistakes

- Using a personal Microsoft account where a work or school account is required, or the reverse.
- Resetting before checking the account and license.
- Deleting local sign-in files without unlinking first. Microsoft lists unlinking before the file removal.
- Treating a license gap as a client problem when several users are affected.

## What these pages don't cover

The pages read for this article don't explain conditional access blocks, multifactor prompts or tenant restrictions as sign-in causes. If sign-in fails only on certain devices or networks, ask the administrator to review the Entra sign-in logs. That is a general admin step and isn't described in the pages used here.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)
- [Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Can't sign in to OneDrive, Microsoft Support](https://support.microsoft.com/en-US/onedrive/can-t-sign-in-to-onedrive)
- [Fix OneDrive sync problems (work or school), Microsoft Support](https://support.microsoft.com/en-US/onedrive/fix-onedrive-work-sync-problems)
- [Error 0x8004de85 or 0x8004de8a when signing in to OneDrive, Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/troubleshoot/sync/sign-into-onedrive-error-0x8004de85-or-0x8004de8a)
