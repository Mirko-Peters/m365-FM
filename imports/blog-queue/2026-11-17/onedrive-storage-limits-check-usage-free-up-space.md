---
title: "OneDrive Storage: Limits, How to Check Usage and Free Up Space"
summary: "OneDrive storage limits for personal and work or school accounts, how to check what you use, what happens when you go over, and how to free up cloud space versus local disk space with Files On-Demand."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [onedrive, onedrive-files-on-demand, microsoft-365-admin-center]
keypoints:
  - "Personal accounts: 5 GB free, 100 GB Basic, 1 TB Personal. Newer Family, Premium and Pro quotas change from October 8, 2026, per Microsoft Support."
  - "Work or school accounts: the default is 1 TB for most plans, and admins can raise it up to 5 TB depending on plan and licensed users."
  - "Over quota, personal OneDrive files become read-only and you cannot upload, edit or sync. After 3 months the account is frozen. After 6 months files may be deleted."
  - "The OneDrive Recycle Bin counts toward the personal quota, so empty it after deleting."
  - "'Free up space' in File Explorer saves local disk space only. It does not change how much cloud storage you use."
faq:
  - q: "How much OneDrive storage do I get?"
    a: "It depends on the account type. Microsoft Support lists 5 GB for free personal accounts, 100 GB for Basic and 1 TB for Personal. Microsoft Learn says the default for most work or school plans is 1 TB per user, which admins can increase up to 5 TB depending on plan and number of licensed users."
  - q: "What happens when OneDrive is full?"
    a: "According to Microsoft Support, for personal accounts you cannot upload, edit or sync new files, including camera roll files, and existing files become read-only. After 3 months over the limit the account is frozen, and after 6 months Microsoft may delete the OneDrive and its files, which cannot be recovered."
  - q: "Does the recycle bin count toward my storage?"
    a: "For personal accounts, yes. Microsoft's storage FAQ lists items in the OneDrive Recycle Bin as part of the Microsoft storage quota. Microsoft Support also states recycle bin retention of 30 days for personal accounts and 93 days for work or school accounts."
  - q: "Does 'Free up space' give me more OneDrive storage?"
    a: "No. According to Microsoft Support, Free up space makes a file online-only so it takes no space on your computer. The file stays in OneDrive and still counts toward your cloud quota."
  - q: "How does an admin check or change a user's OneDrive limit?"
    a: "Microsoft Learn describes checking it in the Microsoft 365 admin center under Users > Active users, then the OneDrive tab. The default limit is set in the SharePoint admin center under Settings, in the OneDrive Storage limit setting, or with Set-SPOTenant -OneDriveStorageQuota."
---

OneDrive storage depends on the account. A free personal account has 5 GB, while the default for most work or school plans is 1 TB per user, which admins can raise up to 5 TB. To check usage, personal users open the Microsoft storage page of their account, and admins check the user's OneDrive tab in the Microsoft 365 admin center. Freeing cloud space means deleting files and emptying the recycle bin. Freeing disk space on a PC is a different task.

## Storage limits for personal accounts

Microsoft Support lists these quotas for personal Microsoft accounts:

| Plan | Storage |
|---|---|
| Free, no subscription | 5 GB |
| Basic | 100 GB |
| Personal | 1 TB |
| Family, Premium, Pro (subscriptions started before October 8, 2026) | 1 TB per person, up to 6 people |
| Family and Premium (new subscriptions from October 8, 2026, and renewals from May 2, 2027) | 2 TB shared, up to 6 people |
| Pro (new subscriptions from October 8, 2026, and existing subscriptions from November 1, 2027) | 5 TB shared, up to 6 people |

Shared storage is available to all members, while each person's files stay private. Personal, Family, Premium and Pro subscriptions can be extended up to 10 TB. New quotas can take up to 24 hours to appear, and Microsoft says to contact support if yours has not updated after 48 hours.

The quota covers more than OneDrive files. For a personal account it includes OneDrive files and photos, the OneDrive Recycle Bin, Outlook.com attachments, Teams message attachments and recordings, Loop meeting notes and Designer images. Mailbox storage is a separate limit.

## Storage limits for work or school accounts

For work or school accounts, Microsoft Learn says each user's OneDrive default is 1 TB for most subscription plans. Depending on the plan and the number of licensed users, an admin can increase it up to 5 TB. The page refers to the OneDrive service description for the per-plan eligibility and does not list thresholds itself.

If an admin changes a user's license, Microsoft says the available storage updates automatically within 24 hours after the user accesses OneDrive.

## How to check your usage

**Personal account.** Open the Microsoft storage area of your account dashboard. Microsoft Support also shows status icons: a yellow warning triangle on the cloud icon means storage is nearly full, and a red circle with a white minus sign means you have exceeded your allowance.

**Work or school account (admin view).** According to Microsoft Learn:

1. Sign in to admin.microsoft.com as an IT administrator.
2. Select **Users**, then **Active users**.
3. Select the user, then the **OneDrive** tab.
4. Next to "Storage used", check the maximum value, for example "3 GB of 1024 GB".

## What happens when you go over the limit

For personal accounts, Microsoft Support describes this sequence:

- You cannot upload, edit or sync new files, including camera roll files. Existing files stay but become read-only.
- Outlook.com stops sending and receiving, and Teams cannot send or receive messages with attachments.
- After 3 months over the OneDrive limit, the account is frozen.
- After 6 months, Microsoft may delete your OneDrive and its files, and they cannot be recovered.

The pages read for this article do not describe the equivalent timeline for work or school accounts. Admins should not assume it matches.

## How to free up cloud storage

1. **Find the large files.** Microsoft Support points to a view of your largest OneDrive files in the storage management page.
2. **Delete what you do not need.** Deleting an online-only file removes it from OneDrive on all devices.
3. **Empty the Recycle Bin.** For personal accounts, Microsoft lists Recycle Bin items as part of your quota, so deleted files still count until they are permanently removed.
4. **Clean other services that share the quota.** In Loop, delete unneeded pages and page version history. In Designer, open a project, hover over an image, select the three-dot icon and choose **Delete**.
5. **Add storage if needed.** Subscribers can add OneDrive storage, and only the account holder can add it.

## How to free up space on your PC

This is a separate goal. Files On-Demand keeps files in OneDrive and removes the local copy. Per Microsoft Support:

1. In File Explorer, right-click the file or folder.
2. Select **Free up space**.

The item becomes online-only and keeps a blue cloud icon. A green check means the file is locally available, and a solid green circle with a white check means it is always available. To keep something offline, select **Always keep on this device**. Requirements are Windows 10 version 1709 or later, or Windows Server 2019. OneDrive build 23.066 or later has Files On-Demand on by default.

Caveats from the same page: online-only files cannot be opened without an Internet connection, desktop search finds them by name but not by content, and Files On-Demand is not supported when Windows Information Protection is enabled.

## For admins: changing the default limit

In the SharePoint admin center, go to **Settings**, select the OneDrive **Storage limit** setting, enter the amount in GB in **Default storage limit** and select **Save**. The minimum is 1 GB. Microsoft warns that if you lower the limit and a user is over the new limit, their OneDrive becomes read-only.

In PowerShell, Microsoft documents `Set-SPOTenant -OneDriveStorageQuota <quota>`, with the quota in megabytes: 1048576 equals 1 TB and 5242880 equals 5 TB. If the value exceeds a user's license allowance, that user's storage is rounded down to what the license allows.

## Common mistakes

- Reading a personal-account article for a work account, or the reverse. The limits and rules differ.
- Expecting Free up space to reduce the cloud quota.
- Forgetting the Recycle Bin on a personal account.
- Lowering the default limit below current use, which makes OneDrive read-only for affected users.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Microsoft Support: About storage, storage quotas](https://support.microsoft.com/en-us/onedrive/microsoft-storage-quotas)
- [Microsoft Support: Microsoft storage FAQs](https://support.microsoft.com/en-us/onedrive/microsoft-storage-faqs)
- [Microsoft Learn: Set the default storage space for OneDrive users](https://learn.microsoft.com/en-us/sharepoint/set-default-storage-space)
- [Microsoft Support: Save disk space with OneDrive Files On-Demand for Windows](https://support.microsoft.com/en-us/office/0e6860d3-d9f3-4971-b321-7092438fb38e)
