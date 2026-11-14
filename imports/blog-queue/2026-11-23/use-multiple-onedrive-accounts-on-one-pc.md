---
title: "How to Use Multiple OneDrive Accounts on One PC: Work, School and Personal"
summary: "How to add and manage several OneDrive accounts on one Windows PC or Mac: the one personal account rule, adding accounts, choosing folders per account, unlinking and fixing the different account error."
status: review
publish: false
author: mirko-p
date: 2026-11-23
topics: [onedrive, onedrive-sync-engine, onedrive-selective-sync]
keypoints:
  - "You can sync several work or school accounts in the OneDrive app, but only one personal OneDrive account on the same computer."
  - "Add an account in OneDrive Settings > Account tab > Add an account, then sign in with the email address of the account."
  - "Microsoft says personal and work or school OneDrive cannot be merged. Use them side by side and copy files between them."
  - "Folder choices made with Choose folders are unique to each account and each computer."
  - "The You're syncing a different account error usually comes from stale saved credentials. Microsoft's fix deletes a cached sign-in file or keychain entry."
faq:
  - q: "How many OneDrive accounts can I add on one PC?"
    a: "According to Microsoft Support you can sync multiple work or school accounts, but you can only have one personal account. To sync a different personal account you must unlink the current one first."
  - q: "How do I add a second OneDrive account on Windows?"
    a: "Select the OneDrive cloud icon in the notification area, then the Help and Settings icon, then Settings. Open the Account tab, select Add an account, enter the email address and sign in. The steps come from Microsoft Support's article on syncing with multiple accounts."
  - q: "Can I merge my personal OneDrive with my work OneDrive?"
    a: "No. Microsoft Support says the two cannot be merged but can be used side by side. Each keeps its own storage. You can copy or drag files between them, but you cannot sync or share work folders into personal folders."
  - q: "Will unlinking an account delete my files?"
    a: "Microsoft Support says you do not lose files or data by removing OneDrive from your computer, and you can still reach them by signing in to OneDrive on the web. The page does not say whether local copies stay on the PC after you unlink, so check your OneDrive folder before you do it."
  - q: "What does the You're syncing a different account error mean?"
    a: "Microsoft Support says it usually means OneDrive is holding stale saved credentials, and it may also appear after a Microsoft account password change. On Windows the documented fix is to delete PreSignInSettingsConfig.json in the OneDrive settings folder. If that fails, reinstalling OneDrive keeps your files safe."
---

OneDrive on one computer can hold several accounts at once, with one limit. Microsoft Support says you can sync multiple work or school accounts, but only one personal account. Add each account in the OneDrive app, and each one syncs into its own folder.

This guide shows how to add accounts, how to keep their files apart and what to do when sign-in goes wrong.

## What is allowed

| Account type | How many on one PC |
|---|---|
| Work or school | Several |
| Personal (OneDrive for home) | One |

If you need a different personal account, unlink the current one first. Microsoft's pages describe this as one personal account syncing at a time.

Microsoft's articles do not describe how the sync folders are named, so do not rely on a naming pattern in scripts. Open File Explorer or Finder after you add an account and check the folder that was created.

## Add another account

The steps are the same for personal and work or school accounts.

### Windows

1. Select the OneDrive cloud icon in the notification area.
2. Select the **Help and Settings** icon, then **Settings**.
3. Open the **Account** tab.
4. Select **Add an account**.
5. Enter the email address of the account and sign in.

### Mac

1. Select the OneDrive cloud icon in the menu bar.
2. Open the three-dot menu and select **Preferences**.
3. Open the **Account** tab.
4. Select **Add an account**.
5. Enter the email address and sign in.

Repeat the steps for each additional work or school account. If you try to add a second personal account, OneDrive does not allow it.

## Keep the accounts separate

Microsoft states that a personal OneDrive and a work or school OneDrive cannot be merged. They can be used side by side, and each keeps its own storage.

In practice:

- Copy or drag files between the two folders when you need to move something across.
- Do not expect to sync or share work folders into personal folders. Microsoft says you cannot.
- If you want to use a work email address to reach OneDrive through Outlook.com, you can create an Outlook.com alias. Microsoft says an address already tied to a work or school account cannot be added as an alias.

A practical rule is to keep company data in the work or school account only. The pages used here do not cover company policy, so check yours.

## Choose folders per account

To save disk space on a PC that carries several accounts, choose which folders to sync.

1. Open OneDrive settings and go to the **Account** tab.
2. Select **Choose folders**.
3. Clear the checkboxes for folders you do not want on the computer and confirm.

Microsoft says these settings are unique to each computer and each account, so you set them again for every account. You can only select or clear folders that already exist in your OneDrive. Documents, Desktop, Pictures and Personal Vault cannot be cleared. Clearing a synced folder removes it from the computer but leaves it available online.

## Unlink an account you no longer need

1. Select the OneDrive cloud icon in the taskbar or menu bar.
2. Select the gear icon, then **Settings** on Windows or **Preferences** on Mac.
3. Open the **Account** tab.
4. Select **Unlink this PC** for the account.

Microsoft says you do not lose files or data by removing OneDrive from your computer, and that you can reach them on the OneDrive website. The page does not say whether local copies remain, so look at the folder before you unlink.

## Fix the "You're syncing a different account" error

Microsoft Support says this error usually means OneDrive holds stale saved credentials. It may also happen after you change your Microsoft account password.

On Windows:

1. Press Windows key + R.
2. Enter `%localappdata%\Microsoft\OneDrive\settings` and select **OK**.
3. Delete the file `PreSignInSettingsConfig.json`.

On Mac, the article says to open Keychain Access, search for "OneDrive" and delete the entry called "OneDrive Cached Credential", then open OneDrive. For the related "You're already syncing this account" message on Mac, the article adds deleting two plist files in the Group Containers folder and restarting OneDrive.

If these steps do not help, Microsoft says to uninstall and reinstall OneDrive. Your files stay safe and remain available on the web.

## Checklist for a new setup

1. Decide which accounts belong on this PC. Count one personal account at most.
2. Add the accounts one at a time through **Settings** > **Account** > **Add an account**.
3. Open File Explorer or Finder and confirm that each account has its own folder.
4. Use **Choose folders** for each account if disk space is tight.
5. Test with one small file per account before you move real data.
6. Note which account holds which files, because Microsoft does not merge them for you.

## Common mistakes

- Trying to add a second personal account. Only one is allowed.
- Expecting to merge a personal and a work OneDrive.
- Setting Choose folders once and assuming it applies to every account. It does not.
- Unlinking without checking the local folder first.
- Treating a sign-in error as a lost account. Cached credentials are the usual cause.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive selective sync](https://www.m365.fm/entity/onedrive-selective-sync/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)
- [OneDrive Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/)

## Sources

- [Sync with multiple accounts (Microsoft Support)](https://support.microsoft.com/en-us/office/sync-with-multiple-accounts-8ba5d09d-12f6-484c-af08-ce9da19163ad)
- [How to add an account in OneDrive (Microsoft Support)](https://support.microsoft.com/office/how-to-add-an-account-in-onedrive-31b59063-5a94-4847-b846-c13b9e7635e2)
- [How do I merge my OneDrive for home with my OneDrive for work or school? (Microsoft Support)](https://support.microsoft.com/en-US/onedrive/how-do-i-merge-my-onedrive-for-home-with-my-onedrive-for-work-or-school)
- [Choose which OneDrive folders you want to sync (Microsoft Support)](https://support.microsoft.com/en-us/office/sync-onedrive-files-and-folders-d9262485-9bf8-4ceb-bac2-e83f68cb6a97)
- [How to cancel or stop sync in OneDrive (Microsoft Support)](https://support.microsoft.com/en-us/onedrive/how-to-cancel-or-stop-sync-in-onedrive)
- [OneDrive shows "You're syncing a different account" error (Microsoft Support)](https://support.microsoft.com/en-us/office/onedrive-shows-you-re-syncing-a-different-account-error-88e73727-8b99-40ce-9229-0c5b173953dd)
