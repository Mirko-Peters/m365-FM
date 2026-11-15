---
title: "SharePoint Library Will Not Sync or Syncs as Read-Only: Check These Library Settings First"
summary: "OneDrive says it can't add your folder, or a synced SharePoint library shows lock icons and read-only files? Four library settings are the usual cause, and the fix has a price for the library."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [sharepoint, onedrive, onedrive-sync-engine, sharepoint-document-libraries]
keypoints:
  - "Require Check Out, required columns, Draft Item Security and content approval can stop a library from syncing, or make it sync as read-only."
  - "The Learn troubleshooting article lists guest accounts as a cause and says to sign in with an internal account. A newer Microsoft Support page says OneDrive supports guest sync under B2B requirements."
  - "Changing these settings affects everyone who uses the library. Ask the owner and weigh the loss of approval or metadata rules."
  - "If the settings must stay, a moderator in one thread advised using the browser for that library instead of the sync client."
faq:
  - q: "What does 'Sorry, OneDrive can't add your folder right now' mean?"
    a: "Microsoft Learn ties this error to library settings, not to a broken client. The listed causes are Require Check Out turned on, required columns, Draft Item Security set to only users who can edit items, and syncing with a guest or external account."
  - q: "Why are all files in my synced SharePoint library read-only?"
    a: "Learn says libraries with check-out, required-column or approval-related settings can sync their items as read-only. In a March 2026 thread, the cause was content approval, and the moderator said it has to be switched off to remove the lock."
  - q: "Can I keep content approval and still edit files in the sync client?"
    a: "According to the moderator in the March 2026 thread, no. The asker also found that turning approval off removes the Approval Status column. Learn names turning the setting off as the way to lift the restriction. Test this on a copy of the library first."
  - q: "Does it matter if I use the Sync button or Add shortcut to OneDrive?"
    a: "One community answer from July 2026 blamed a conflict between syncing a library and adding a shortcut to the same library, and advised choosing one method. That claim was not confirmed in the thread, so treat it as a test to try, not as a rule."
---

You open a SharePoint library and choose **Sync**. OneDrive answers with "Sorry, OneDrive can't add your folder right now." Or the sync works, but every file carries a lock and cannot be saved from Word or Excel. In the browser, everything works.

This article collects what three Microsoft Q&A threads from March and July 2026 and the current Microsoft Learn pages say about it. It is a troubleshooting guide, not an official Microsoft procedure. Be careful with the fixes: they change the rules of a shared library.

## What the symptoms look like

- The error "Sorry, OneDrive can't add your folder right now" appears when you try to sync a library or team site.
- A library that did sync shows a lock icon, and files are read-only in File Explorer.
- Files open and save normally in the browser.
- Other people who sync the same library have the same problem.

The last point matters. If only one user is affected, look at the user, the account and the client. If several users are affected, look at the library.

## Step 1: Rule out the account and the client

Do these quick checks first.

1. Check which account the person used. The Learn troubleshooting article states that syncing with an external or guest account is not supported and says to use an internal account. A newer Microsoft Support page on restrictions says OneDrive supports syncing as an external or guest user and points to its B2B sync requirements, so the two pages differ. In one thread, a commenter reported that some external accounts still failed after the library settings were changed.
2. Check permissions. In the content approval thread, a moderator asked the asker to check the Contribute permission level. The asker's file-move error was a separate permissions problem, solved with a custom permission level, and it was not the cause of the read-only sync.
3. Reset the sync relationship. Stop syncing the library in the OneDrive app and start the sync again from the library page. A moderator in the content approval thread suggested stopping and re-syncing as a first step. Learn does not describe this step.

If all of this changes nothing, move on to the library.

## Step 2: Open the library settings

Changing library settings needs rights to manage the library. The Learn pages name no specific role, and the Support page says to get the library owner's approval first. Learn describes the path in the classic library view: open the settings (gear) menu, turn on the ribbon if needed, select the **Library** tab, then **Library Settings**, then **Versioning Settings**. In the modern view, a moderator in the "can't add your folder" thread named **Library settings**, then **More library settings**, then **Versioning settings**.

Write down the current values before you change anything. You will want to restore them if the change does not help.

## Step 3: Check the four settings

Microsoft Learn names these causes for the "can't add your folder" error:

1. **Require Check Out.** In **Versioning Settings**, Learn says to change it from Yes to No.
2. **Required columns.** Go through the columns in **Library Settings**. For each column marked as required, set **Require this column to contain information** to No.
3. **Draft Item Security.** If it is set to only users who can edit items, change it to **Any user who can read items**.
4. **Guest or external account.** Covered in step 1.

The Learn page on restrictions and limitations adds the read-only case. For libraries that use check-out, validation columns, or a Draft Item Security value of "only users who can edit" or "only users who can approve", it says affected items sync as read-only, and a OneDrive library can show a lock icon. It names content approval as a related setting: **Require content approval for submitted items** should be No, which is the default. If content type management is on, required-column information may not be visible, and Learn suggests turning it off only with the owner's approval.

## Step 4: Handle content approval on its own

The March 2026 thread is the clearest example. A library used the built-in content approval feature. The synced copy was read-only for everyone who tried it. Contribute rights were correct, and the files worked on the web.

The moderator's explanation was that the sync client cannot enforce an approval workflow locally, so it blocks editing. The final advice was that content approval has to be turned off to remove the lock. In **Versioning Settings**, set **Require content approval for submitted items** to No.

The asker tested this and confirmed two things:

- Turning approval off removed the lock icon.
- It also removed the **Approval Status** column from the library.

So you trade one feature for the other. Before you switch it off, decide whether the team really needs approval in that library. If yes, you have three options:

- Keep approval and ask users to work in the browser.
- Split the library. Keep the approval library without sync and give editing teams a second library without approval. This is my own suggestion, not from Learn or the thread, so test it first.

## Step 5: Restart the sync

After you change the settings:

1. Close the OneDrive app and open it again.
2. If the library is still marked, stop syncing it from the app and start it again from the library page.
3. Give large libraries time to finish before you judge the result.

Learn describes the changes as library-wide. They affect everyone who uses the library, so tell the users and the owner first. Learn also says to confirm these changes with the library owner first.

## Step 6: If it still fails

Try the points below, in this order:

1. Check for a mix of sync and shortcut. In a July 2026 thread, files from a library did not show up in OneDrive for several users. A community answer said to remove the sync and any shortcut to the same library, wait until it vanished from File Explorer and the web, and then use only one method. The thread did not confirm that this fixed the problem, so use it as a test.
2. Check whether many users are affected. A moderator in that thread advised that a Global Admin open a service request when the issue affects users across the tenant.
3. Collect the exact error text, the account type and the library settings. Support will ask for them.

A commenter on the "can't add your folder" thread, who had the issue for external accounts, was told to open a new question. That is a good reminder: a different root cause can produce the same message.

## Limits and open points

- None of the three threads ended with a clear confirmation from the asker. The Learn pages are the stronger evidence here, and the March 2026 thread confirms the content approval trade-off.
- Learn lists the settings that block sync, but it does not say that content approval always produces a read-only sync. The thread reports it. Test on one library before a tenant-wide change.
- The page on the "can't add your folder" error was last updated in July 2025. The restrictions page was updated in October 2026. If they differ, follow the newer page.
- Turning off required columns or approval can weaken your governance. Document the decision.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)

## Sources

- [Microsoft Learn: OneDrive sync error "Sorry, OneDrive can't add your folder right now"](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/sync/cant-add-folder-right-now)
- [Microsoft Support: Restrictions and limitations in OneDrive and SharePoint](https://support.microsoft.com/en-us/onedrive/restrictions-and-limitations-in-onedrive-and-sharepoint)
- [Microsoft Q&A: SharePoint Document Library permission and OneDrive sync (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5836769/sharepoint-document-library-permission-onedrive-sy)
- [Microsoft Q&A: Error "Sorry, OneDrive can't add your folder right now" (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5836843/error-sorry-onedrive-cant-add-your-folder-right-no)
- [Microsoft Q&A: Issues with SharePoint-OneDrive Sync (July 2026)](https://learn.microsoft.com/en-us/answers/questions/5955841/issues-with-sharepoint-onedrive-sync)
