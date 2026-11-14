---
title: "SharePoint Storage Licensing: How Much You Get, Limits and What Extra Costs"
summary: "How SharePoint storage is calculated in Microsoft 365: 1 TB base plus 10 GB per license, the 25 TB site limit, OneDrive quotas, read-only mode and the ways to add storage."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [sharepoint, microsoft-365-admin-center, onedrive]
keypoints:
  - "Tenant SharePoint storage starts at 1 TB and grows by 10 GB for each eligible license purchased. F1 and F3 plans are listed with 1 TB and no per-license increment."
  - "Storage is pooled. A single site can grow up to 25 TB, but only as far as the organization's total pool allows."
  - "Version history counts. Storage reports show more than the size of the current files because they include versions and related data."
  - "The OneDrive created for each licensed user is excluded from the organization total. Per-user OneDrive storage is a separate setting."
  - "More storage comes from more licenses, Office 365 Extra File Storage in 1 GB steps, or pay-as-you-go through Azure. Microsoft Learn names no prices."
faq:
  - q: "How much SharePoint storage does a Microsoft 365 tenant get?"
    a: "According to the SharePoint limits page on Microsoft Learn, most Microsoft 365 and Office 365 plans get 1 TB plus 10 GB per license purchased. Microsoft 365 F1 and F3 and Office 365 F3 are listed with 1 TB and no per-license increment."
  - q: "What is the maximum size of one SharePoint site?"
    a: "Microsoft Learn lists 25 TB per site collection for every plan. The admin documentation adds that this may be more space than your organization actually has, because all sites draw on the same tenant pool."
  - q: "What happens if the tenant runs out of storage?"
    a: "The limits page says a tenant that exceeds its limits risks being placed in read-only mode. To restore editing you can reduce usage, buy more SharePoint storage or buy eligible licenses. The storage planning page also says classic site creation and site creation through PowerShell is blocked when the quota is exceeded."
  - q: "Does OneDrive storage count against the SharePoint pool?"
    a: "No. The limits page states that the total excludes the OneDrive created for each licensed user. Learn describes the default OneDrive limit per user as 1 TB for most plans, with an option to raise it up to 5 TB depending on plan and license count."
  - q: "Do deleted files and old versions use storage?"
    a: "Yes, to a degree. Microsoft Learn says storage reports reflect version history and related data. The limits page says the Recycle Bin counts toward the organization total, while deleted sites in the Recycle Bin do not."
---

A Microsoft 365 tenant gets 1 TB of SharePoint storage plus 10 GB for each eligible license purchased. All sites draw from that single pool, and one site can grow to 25 TB if the pool allows it. When the pool is full, you reduce usage, buy more licenses or buy extra storage. This article explains where the numbers come from, what counts and what does not, and which options exist to add capacity.

## How the tenant total is calculated

The SharePoint limits page on Microsoft Learn lists the total storage per organization by plan:

| Plan family | Total storage per organization |
|---|---|
| Microsoft 365 Business, Teams Essentials | 1 TB + 10 GB per license purchased |
| Microsoft 365 Enterprise (E3, E5, A3, A5, G3, G5) | 1 TB + 10 GB per license purchased |
| Office 365 (E1, E3, E5, A1, A3, A5, G1, G3, G5) | 1 TB + 10 GB per license purchased |
| SharePoint Plan 1 or 2 | 1 TB + 10 GB per license purchased |
| Microsoft 365 F1/F3, Office 365 F3 | 1 TB |

The page gives its own example: a 1 TB base with 100 users gives 2 TB in total, 1 TB from the base and 1 TB from users. It also notes that Visio Plan 2 and Project Plan 3 or 5 each add roughly 10 GB per license to the pool, and that OneDrive standalone plans contribute 0.50 GB per license.

Storage is calculated in binary gigabytes, where 1 GB equals 2 to the power of 30 bytes.

## Pooled storage and site limits

By default SharePoint storage sits in one central pool. Learn says administrators do not need to divide the space or reallocate it. Sites use what they need when they need it.

- The maximum per site collection is 25 TB (25,600 GB) on every plan.
- If you previously set limits manually and switch back to pooled storage, SharePoint resets all limits to 25 TB. The total for your organization may be less than that.
- You can switch modes in the SharePoint admin center under **Settings** > **Site storage limits**, then choose **Automatic** or **Manual** and select **Save**.
- In manual mode, open **Active sites**, select a site, go to the **General** tab and select **Edit** under **Storage limit**. Turn on notifications to email site owners when the site approaches its limit.

To see usage, open **Active sites** in the SharePoint admin center. The upper right of the page shows used and total storage for the subscription. Learn notes that usage does not include changes from the last 24 to 48 hours.

## What counts toward storage

Microsoft's storage planning page says storage reports show the total consumed by content, which can include version history and other related data. A library can therefore show smaller file sizes than the site reports. The same page recommends setting organization version history limits to **Automatic** and trimming low-value versions.

Two statements about recycle bins appear on different Learn pages:

- The limits page says the Recycle Bin counts toward the organization's total storage and recommends emptying it regularly.
- The site storage page says deleted sites in the Recycle Bin do not count toward total usage.

The pages do not explain the difference in detail. In practice, treat items deleted from sites as still using space until the bin is emptied, and treat a deleted site as no longer counted.

## OneDrive is separate

The limits page states that the organization total excludes the OneDrive created for each licensed user. Microsoft Learn describes the default per-user OneDrive limit as 1 TB for most subscription plans, with the option to raise it up to 5 TB depending on plan and number of licensed users. The page does not list which plans qualify for 5 TB.

Admins change the default in the SharePoint admin center under **Settings** by selecting the OneDrive **Storage limit** setting and entering a value in GB. Learn warns that lowering the limit below a user's current usage makes that OneDrive read-only.

## When storage runs out

Learn's footnotes on the limits page describe read-only mode as a risk when a tenant exceeds its limits. To restore editing you can:

1. Reduce storage usage.
2. Buy additional SharePoint storage.
3. Buy eligible licenses.

If **Confirm purchase** is available after a purchase, it temporarily removes read-only mode for up to 14 days. It can be used only once in a 365-day period. The storage planning page adds that when the quota is exceeded, classic site creation and site creation through PowerShell are blocked.

A site admin who needs more room can use **Site Settings** > **Site Collection Administration** > **Storage Metrics** > **Request more quota**. That sends a request email to the Global Administrators.

## Ways to add storage

| Option | What Learn says |
|---|---|
| More user licenses | Each eligible license adds 10 GB to the tenant total. |
| Office 365 Extra File Storage | Added in 1 GB increments through the Microsoft 365 admin center Marketplace or Billing. You can buy an unlimited amount, and amounts add to the subscription. Not available directly if you bought through Volume Licensing or a Cloud Solution Provider. |
| Pay-as-you-go (Microsoft 365 SharePoint Storage) | Billed through an Azure subscription for usage above the tenant quota. The page I read describes it as a public preview for commercial tenants and says it is not available for education, GCC or Microsoft 365 operated by 21Vianet. |

Buying needs billing roles. For Extra File Storage under a Microsoft Customer Agreement you need to be a billing account or billing profile owner or contributor. For pay-as-you-go you need an Azure subscription and resource group, plus the SharePoint Administrator or Global Administrator role. While a tenant is enrolled in pay-as-you-go, it does not receive quota-related email and banner notifications.

Microsoft Learn gives no dollar amounts on these pages. Prices live in the Microsoft 365 admin center and your agreement, so check them there before you plan a budget.

## Practical order of operations

1. Open **Active sites** and note used and total storage.
2. Sort sites by size and check the largest ones for old versions and recycle bin content.
3. Set version history limits to Automatic if you have not already.
4. Empty recycle bins you no longer need.
5. Only then decide between more licenses, Extra File Storage or pay-as-you-go.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Microsoft Learn: SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits)
- [Microsoft Learn: Manage site storage limits](https://learn.microsoft.com/en-us/sharepoint/manage-site-collection-storage-limits)
- [Microsoft Learn: SharePoint storage planning](https://learn.microsoft.com/en-us/sharepoint/sharepoint-storage-planning)
- [Microsoft Learn: Add storage space for your subscription](https://learn.microsoft.com/en-us/microsoft-365/commerce/add-storage-space)
- [Microsoft Learn: Set the default storage space for OneDrive](https://learn.microsoft.com/en-us/sharepoint/set-default-storage-space)
