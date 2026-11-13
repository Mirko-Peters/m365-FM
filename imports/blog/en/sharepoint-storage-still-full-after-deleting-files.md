---
title: "SharePoint Storage Still Full After Deleting Files: What Counts and What Does Not"
summary: "You deleted files or a whole site, but SharePoint still reports full storage or read-only sites. Check what counts against the quota, how long reports lag, and which limits apply before you buy more."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [sharepoint, onedrive, intelligent-versioning, preservation-hold-library, retention-policies]
keypoints:
  - "Storage reports can lag by up to 48 hours, so compare numbers only after that wait."
  - "According to Microsoft Support, the first-stage recycle bin counts toward storage, the second-stage bin does not (subsites are the exception), so emptying only the second stage frees nothing."
  - "Version history is part of the storage a library reports, so large libraries often shrink more from version trimming than from deleting files."
  - "In Manual storage mode every site has its own limit, so one site can be full while the tenant still has room."
  - "A read-only tenant has documented options: buy storage, archive, or delete. The Tenant Storage diagnostic shows how your quota is calculated."
faq:
  - q: "Why does SharePoint still show full storage after I deleted files?"
    a: "Three common reasons: the usage report lags by up to 48 hours, deleted items still sit in the first-stage recycle bin (which counts toward storage), and version history of the remaining files keeps using space. Check each of them in that order."
  - q: "Do I have to empty the second-stage recycle bin to free storage?"
    a: "Community answers often say to empty both bins. The Microsoft Support article on the site collection recycle bin says the first-stage bin contributes to the storage-used metric and the second-stage bin does not. Deleted subsites are the exception: they go straight to the second-stage bin and count until they are purged. Emptying the second stage also makes items unrecoverable, so do it only when you are sure."
  - q: "Does Microsoft force me to buy storage after a second overage?"
    a: "In one thread the asker relayed that claim from an outsourced IT provider. The two replies in the thread, an independent advisor and an AI-generated answer, said they know of no published policy like that. I also did not find one in the Learn pages listed below. The Learn page on out-of-storage tenants names three options: buy add-on storage or licenses, archive inactive content, or delete content you no longer need."
  - q: "How is the tenant storage quota calculated?"
    a: "Microsoft Learn says that for non-EDU organizations the quota is 1 TB plus 10 GB per license for the eligible plan, plus any Microsoft 365 Extra File Storage add-ons. Archived data does not count toward the active quota. The Tenant Storage diagnostic can show how your own quota is allocated."
---

You deleted a large library, or even a whole site. The storage bar in the SharePoint admin center barely moved, or users still see "read-only" messages. Several Microsoft Q&A threads from mid and late 2026 describe exactly this, and most of them end without a confirmed answer. This article puts the replies next to the current Microsoft documentation, so you can see which steps are backed by Microsoft and which are only community advice. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- You deleted a site and its files, and the storage still shows as full (reported in August 2026).
- A tenant of about 3.2 TB went read-only twice. The admin deleted roughly 1.2 to 1.5 TB and emptied both recycle bin stages, but sites stayed read-only (reported in October 2026).
- A main site with a "storage exceeded" warning and more than 2,000 users depending on it (reported in June 2026).

In the second thread, the asker relayed that the outsourced IT provider said Microsoft requires a storage purchase after a second overage. The replies, from an independent advisor and an AI-generated answer, did not confirm this. No asker wrote what fixed the problem (in the June thread two answers carry an accepted label, but the asker added nothing). So the steps below follow the documentation, not a verified thread outcome.

## Step 1: Wait for the report to catch up

Microsoft Learn says usage figures do not include changes from the last 24 to 48 hours. The storage planning page says it takes up to 48 hours for storage usage to update. Check the number again two days after a big deletion, before you change anything else.

## Step 2: See where the storage actually sits

In the SharePoint admin center, open **Active sites**. According to Learn, the upper right side of that page shows storage used across all sites and the total storage for your subscription. Sort the site list by storage to find the large ones.

For a single library, remember that Learn says reported storage can include version history and other data tied to a file. The storage of a site, library or folder can therefore be larger than the sum of the files you see.

## Step 3: Empty the first-stage recycle bin

Deleted items stay in the site recycle bin (first stage) for 93 days, according to Learn's data deletion page. After that, or after you empty the first stage, items move to the site collection recycle bin (second stage) for the rest of their retention period.

Here the community advice and the documentation differ. Replies in the threads say to empty both bins. The Microsoft Support article on the site collection recycle bin says:

- The first-stage bin contributes to the storage-used metric. The second-stage bin does not.
- Subsites are the exception. They go directly to the second-stage bin and still count until they are purged.
- The second-stage bin gets space equal to 200% of the site collection quota, and you cannot configure this.

So go to the site, open **Recycle bin**, and delete the items there. For a deleted site, Learn says it does not count while it sits in the recycle bin, so if the number has not moved after 48 hours, look at the other causes below. Open the second-stage bin only if you deleted subsites or need to purge items for another reason. On the Recycle bin page, the link to the second stage sits at the bottom. Purging from the second stage cannot be undone.

If you deleted a whole site collection, Learn says deleted sites in the recycle bin do not count toward the organization's total storage. It also says deleted site collections are kept for 93 days and then removed permanently.

## Step 4: Trim version history

Learn's storage planning page lists trimming low-value versions as a way to reduce storage, and it recommends setting the organization version limits to Automatic. Trimmed versions are permanently deleted and do not go to the recycle bin, so test on one site first. The Learn page on trimming versions describes how the trimming works.

## Step 5: Check Manual versus Automatic storage management

Learn describes two modes. In Automatic mode (the default), all sites draw from a central pool. In Manual mode, you set a limit per site. A thread reply points out that under Manual management one site can reach its own limit while the tenant still has room.

To check, open the SharePoint admin center, then **Settings**, then **Site storage limits**. For a single site in Manual mode, open **Active sites**, select the site, and on the **General** tab look for **Storage limit**. The maximum is 25600 GB.

Be careful when you switch from Manual to Automatic: Learn says SharePoint resets all site limits to 25 TB, even if your organization's total storage is smaller.

## Step 6: Look at retention

In the October thread an independent advisor and the AI-generated answer say that retention policies, labels or holds can keep deleted content in the Preservation Hold Library, so deleting does not free space. Learn's storage planning page only mentions that version trimming does not touch the Preservation Hold Library. I did not find a Learn statement in the pages I read about whether this library counts toward the quota, so treat the retention point as a lead to check. Ask your compliance team before you weaken any retention setting.

## Step 7: Run the tenant storage diagnostic

If you think the quota should be higher than the Microsoft 365 admin center shows, Microsoft Learn points to the **Run Tests: Tenant Storage** diagnostic. It shows how your quota is allocated. It needs a Microsoft 365 administrator account and is not available for GCC High, DoD or Microsoft 365 operated by 21Vianet.

For reference, Learn gives the quota for non-EDU organizations as 1 TB plus 10 GB per license for the eligible plan, plus any Extra File Storage add-ons. Archived data does not count toward the active quota. One reply in the June thread said frontline licenses do not add to the pool. I did not verify that point against Learn, so check your license plan details.

## Step 8: Handle a read-only tenant

When the tenant is out of storage, the admin email says that sites are in read-only mode and changes cannot be saved. Learn's options are:

1. Buy add-on storage or extra licenses.
2. Archive inactive content you must keep.
3. Delete content you no longer need.

If your usage is below the quota after the reporting delay and sites are still read-only, collect the evidence and open a support request: the entitlement and usage figures, deletion dates and sizes, which recycle bins you emptied, affected site URLs and the exact error text.

## Special case: OneDrive accounts

A OneDrive account has its own per-user quota based on license entitlement. When usage goes over it, Learn says the site becomes read-only. In the Microsoft 365 admin center, open **Users**, then **Active users**, select the user and open the **OneDrive** tab to see usage and quota. If the license allows it, you can raise the quota there, or with `Set-SPOSite -Identity <OneDriveSiteUrl> -StorageQuota <QuotaInMB>`. Learn adds that deleted files can keep counting until they are permanently removed.

## Limits and open points

- None of the three threads has a confirmed fix. The steps above come from Learn and Microsoft Support, not from a solved case.
- Learn's data deletion page does not say whether recycle bin contents count toward the quota. The Support article describes the two stages, and Learn's storage pages mention deleted sites, so read them together.
- The 24 to 72 hour range in the August thread (independent advisor reply and AI-generated answer) is longer than Learn's 48 hours. If your numbers do not change after three days, contact support.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Intelligent versioning](https://www.m365.fm/entity/intelligent-versioning/)
- [Preservation Hold Library](https://www.m365.fm/entity/preservation-hold-library/)
- [Retention policies](https://www.m365.fm/entity/retention-policies/)

## Sources

- [Microsoft Learn: Manage site storage limits](https://learn.microsoft.com/en-us/sharepoint/manage-site-collection-storage-limits)
- [Microsoft Learn: SharePoint storage planning](https://learn.microsoft.com/en-us/sharepoint/sharepoint-storage-planning)
- [Microsoft Learn: SharePoint Online out of storage space](https://learn.microsoft.com/en-us/sharepoint/troubleshoot/administration/out-of-storage)
- [Microsoft Learn: OneDrive site is read-only because storage quota was exceeded](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/sites/site-storage-quota-exceeded)
- [Microsoft Learn: SharePoint data deletion in Microsoft 365](https://learn.microsoft.com/en-us/sharepoint/sharepoint-data-deletion)
- [Microsoft Support: Restore deleted items from the site collection recycle bin](https://support.microsoft.com/office/restore-deleted-items-from-the-site-collection-recycle-bin-5fa924ee-16d7-487b-9a0a-021b9062d14b)
- [Microsoft Q&A: SharePoint Storage Still Full After Deleting Files (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5979641/sharepoint-storage-still-full-after-deleting-files)
- [Microsoft Q&A: SharePoint Remains Read-Only After Freeing Up Storage (October 2026)](https://learn.microsoft.com/en-gb/answers/questions/6052148/sharepoint-remains-read-only-after-freeing-up-stor)
- [Microsoft Q&A: Sharepoint storage running out of space (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5911145/sharepoint-storage-running-out-of-space)
