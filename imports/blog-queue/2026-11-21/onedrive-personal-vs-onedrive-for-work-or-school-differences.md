---
title: "OneDrive Personal vs OneDrive for Work or School: What Is Different"
summary: "OneDrive Personal and OneDrive for work or school (formerly OneDrive for Business) share an app but differ in sign-in, management, storage, recovery periods and admin control. A comparison based on Microsoft documentation."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [onedrive, sharepoint, microsoft-365]
keypoints:
  - "Personal OneDrive uses a Microsoft account and is self-managed. OneDrive for work or school uses an account from your employer or school and is managed by the organization."
  - "OneDrive for Business is the former name of OneDrive for work or school. Both account types use the same sync app."
  - "Deleted items can be restored for 30 days on personal accounts and for 93 days on work or school accounts, unless an administrator changed the setting."
  - "Storage differs: personal accounts list 5 GB free, 100 GB or 1 TB by plan. Work or school storage depends on the plan and the administrator."
  - "The two accounts cannot be linked. To move files, sync both to a computer and copy between the folders."
faq:
  - q: "What is the difference between OneDrive personal and OneDrive for Business?"
    a: "According to Microsoft Support, personal OneDrive uses a Microsoft account, is self-managed and is meant for personal files. OneDrive for work or school, formerly called OneDrive for Business, uses an account provided by an employer or school and is managed by the organization. Administrators control sharing, sync and storage for the work or school version."
  - q: "Is OneDrive for Business the same as SharePoint?"
    a: "Not exactly, but they are connected. Microsoft Support says OneDrive for work or school is part of your organization's SharePoint environment, and Microsoft Learn says the SharePoint admin center holds its sharing, sync, storage and retention settings. A user's OneDrive is personal storage, while SharePoint sites hold shared team content."
  - q: "Can I link or merge my personal and work OneDrive?"
    a: "No. Microsoft Support says the two accounts cannot be linked. To move files between them, sync both to your computer, copy the files between the two OneDrive folders, and let them sync again. Check your employer's policy before moving work files to a personal account."
  - q: "How long can I recover deleted files?"
    a: "Microsoft Support says personal accounts can restore items deleted in the last 30 days. Work or school accounts can restore items deleted in the last 93 days, unless the administrator changed the retention setting. Items deleted from the Recycle bin cannot be restored."
  - q: "Is Personal Vault available in OneDrive for work or school?"
    a: "The Microsoft Support page I read describes Personal Vault for personal accounts with a OneDrive Basic, Personal or Family subscription. It does not mention work or school accounts, so do not assume it is available there."
---

OneDrive is one app with two kinds of account behind it. The personal version belongs to you and uses a Microsoft account. OneDrive for work or school belongs to your organization and uses the account your employer or school gave you. The app looks similar, but ownership, rules and recovery options differ.

## The naming first

Microsoft Support calls the work version OneDrive for work or school and notes that it was formerly called OneDrive for Business. If you see either name in an article or admin screen, it refers to the same product. The personal version is described as OneDrive for home or personal use.

## Side-by-side comparison

| Area | OneDrive personal | OneDrive for work or school |
|---|---|---|
| Sign-in | Microsoft account | Work or school account |
| Typical use | Personal files, photos, sharing with friends | Work documents, collaboration with colleagues or classmates |
| Who manages it | You | Your organization |
| Free storage | 5 GB with no subscription | Not applicable, set by plan or administrator |
| Paid storage | 100 GB with Microsoft 365 Basic, 1 TB with Microsoft 365 Personal | Not stated on the storage quota page, which covers personal and home plans |
| Recycle bin retention | 30 days | 93 days unless the administrator changed it |
| Admin controls | None, you set your own options | Sharing, sync, storage, retention, access control and compliance settings |
| Personal Vault | Described for Basic, Personal and Family subscriptions | Not mentioned on Microsoft's Personal Vault page |

The storage and retention rows come from Microsoft's storage quota page and from the support articles on restoring deleted files. Family, Premium and Pro plans have their own storage amounts, and Microsoft has announced changes for subscriptions starting October 8, 2026, so check the quota page for your plan.

## Who controls what

For work or school accounts, Microsoft Support says your organization manages the OneDrive, and site collection administrators control what users can do in their library. Microsoft Learn lists the admin settings in the SharePoint admin center:

- **Sharing:** organization-level sharing settings.
- **Sync:** options such as requiring synced computers to be joined to a domain or blocking uploads by file type.
- **Storage limit:** the default storage for licensed users.
- **Retention:** how long a deleted user's data is kept. The default is 30 days.
- **Access control:** access from unmanaged devices or by network location.
- **Compliance:** compliance and risk management through Microsoft Purview.

Learn also says that deleted files in work or school accounts are purged after 93 days unless configured otherwise, and that users can restore files to any point in the past 30 days with Files Restore.

For a personal account, none of this applies. You decide who you share with, and you handle your own backups and recovery.

## What stays the same

- **The sync app.** Both account types use the OneDrive sync app on Windows and Mac. Microsoft Learn also lists iOS and Android apps.
- **Files On-Demand.** The same markers show online-only and downloaded files in File Explorer.
- **Privacy by default.** Files are private until you share them.
- **Web access.** Browser access is also available, according to Microsoft Learn.

## Moving files between the two

The accounts cannot be linked. Microsoft's guidance is to sync both to your computer, copy the files from one OneDrive folder to the other, and let both sync again. Before you copy work files into a personal account, check your organization's data policy. Administrators set sharing and compliance rules for a reason, and personal storage sits outside them.

## Sharing differs in practice

Microsoft Support says you can share work OneDrive files with co-workers and, with Microsoft 365, with people outside your organization depending on company policy. The organization-level rules sit on the Sharing page of the SharePoint admin center, so a sharing option you used last week can disappear when an administrator changes the policy. Outlook attachments from a work OneDrive are shared as links, with permissions you can adjust in Outlook. Microsoft says that in Outlook on the web, attaching a OneDrive file as a link gives recipients edit permission to the same copy, so check the permission before you send.

With a personal account you are the only administrator. You decide who gets a link and what they can do, because no organization policy sits above your account.

## How to tell which account you are in

Look at two things. First, the sign-in: a Microsoft account is personal, and an address from your employer or school is a work or school account. The pages I read do not describe how the two accounts are labelled in File Explorer, so rely on the sign-in.

## Which one should you use?

Microsoft does not rank the two, so this is a practical reading of what it documents:

1. **Work files belong in the work account.** Only there do the organization's retention, sharing and compliance settings apply, and the longer 93-day recovery window applies by default.
2. **Personal files belong in the personal account.** A work account is managed by your employer, so its settings and lifetime are not yours to decide. Microsoft Learn says a deleted user's data is kept for 30 days by default, unless the administrator changed it.
3. **Do not treat either as a backup of the other.** Because the accounts cannot be linked, a file in one is not protected by the other.

## Common mistakes

- Saving work files to the personal account because it was the one you signed in with first.
- Expecting a 93-day recovery window on a personal account. It is 30 days.
- Assuming Personal Vault exists in the work account. Microsoft's page describes it for personal subscriptions.
- Forgetting that a work OneDrive depends on the work account staying active.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)
- [SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/)

## Sources

- [Microsoft Support: What is OneDrive for work or school?](https://support.microsoft.com/en-us/office/what-is-onedrive-for-work-or-school-187f90af-056f-47c0-9656-cc0ddca7fdc2)
- [Microsoft Learn: OneDrive overview for admins](https://learn.microsoft.com/sharepoint/onedrive-overview)
- [Microsoft Support: Storage quotas](https://support.microsoft.com/en-us/onedrive/microsoft-storage-quotas)
- [Microsoft Support: Restore deleted files or folders in OneDrive](https://support.microsoft.com/office/949ada80-0026-4db3-a953-c99083e6a84f)
- [Microsoft Support: Protect your OneDrive files in Personal Vault](https://support.microsoft.com/onedrive/protect-your-onedrive-files-in-personal-vault)
