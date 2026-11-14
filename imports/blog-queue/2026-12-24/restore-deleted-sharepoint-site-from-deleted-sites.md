---
title: "Restore a Deleted SharePoint Site From the Deleted Sites List"
summary: "Restore a deleted SharePoint site in the admin center: steps, the 93-day retention, what happens to Microsoft 365 groups, the 30-day limit for group resources, permanent deletion and when to use the recycle bin instead."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [sharepoint]
keypoints:
  - "Go to Deleted sites in the SharePoint admin center, select one site and select Restore. The button does not show if several sites are selected."
  - "Deleted sites are kept for 93 days. After that the site and all its content and settings are permanently deleted."
  - "Restoring a site that belongs to a Microsoft 365 group restores the group and all its resources. Other group resources are kept for only 30 days."
  - "If the other group resources are gone, Learn recommends permanently deleting the site instead of restoring it."
  - "To recover items inside a site rather than the site itself, use the site recycle bin."
faq:
  - q: "How long can I restore a deleted SharePoint site?"
    a: "Microsoft Learn says deleted sites are retained for 93 days. After that, the site and all content and settings, including lists, libraries, pages and subsites, are permanently deleted unless a retention policy preserved a copy."
  - q: "How do I restore a site in the admin center?"
    a: "Open Deleted sites in the SharePoint admin center with an admin account, select one site and select Restore. The Restore button does not appear if more than one site is selected. You can sort and filter the list, including by Time deleted."
  - q: "What happens to the Microsoft 365 group?"
    a: "Learn says restoring a site that belongs to a Microsoft 365 group restores the group and all its resources. Other group resources are retained for only 30 days while the site is retained for 93, so after 30 days the restore may not bring everything back."
  - q: "Can I keep content longer than 93 days?"
    a: "Learn says to create a retention policy that keeps a copy in the Preservation Hold library if you must keep content longer for regulatory or policy reasons."
  - q: "Which PowerShell command permanently deletes a deleted site?"
    a: "Learn shows Remove-SPODeletedSite with the site URL as Identity. The page I read does not document Restore-SPODeletedSite, so verify that command in the SharePoint Online Management Shell documentation before using it."
---

A deleted SharePoint site is not gone immediately. Admins can restore it from the **Deleted sites** list for 93 days. This guide follows Microsoft Learn's article and flags the group-related limits that catch people out.

## Restore the site

1. Go to **Deleted sites** in the SharePoint admin center and sign in with an account that has admin permissions. For Office 365 operated by 21Vianet, sign in through the Microsoft 365 admin center first, then open the SharePoint admin center and Deleted sites.
2. Select one site. The **Restore** button doesn't appear if several sites are selected.
3. Select **Restore**.

You can sort and filter the list like Active sites, and also by **Time deleted**.

## Retention period

Deleted sites are retained for 93 days. After that, the site and all its content and settings, including lists, libraries, pages and subsites, are permanently deleted.

To keep content longer for regulatory or policy reasons, Learn says to create a retention policy that keeps a copy in the **Preservation Hold** library.

## Sites connected to a Microsoft 365 group

Restoring a site that belongs to a Microsoft 365 group restores the group and all its resources. There is a catch: other group resources are retained for only 30 days, while the site is retained for 93. If the other resources have already been deleted, Learn recommends permanently deleting the site instead of restoring it.

So the decision depends on how long ago the site was deleted:

| Deleted | Site | Other group resources |
| --- | --- | --- |
| Within 30 days | Restorable | Still retained |
| 31 to 93 days ago | Restorable | No longer retained, per the page |
| Over 93 days ago | Permanently deleted | Not applicable |

The table applies the page's numbers. Confirm what actually came back after a restore.

## After the restore

The page has no post-restore checklist. At minimum, check that the group and its resources returned as expected. The page does not cover Microsoft Teams, so do not assume the state of a connected team from this article. Check it directly.

## PowerShell

The page does not document `Restore-SPODeletedSite`. Check its syntax in the SharePoint Online Management Shell documentation before use. To permanently delete a deleted site, Learn shows:

```powershell
Remove-SPODeletedSite -Identity https://contoso.sharepoint.com/sites/ProjectX
```

For SharePoint Server, the page points to `Restore-SPDeletedSite`.

## How a site ends up in the list

Learn's article on deleting a site says a SharePoint Administrator or higher can delete a site from **Active sites**: select the site, select **Delete** and confirm. The site is kept as a deleted site for 93 days. Deleting removes everything in the site, including document libraries, lists, settings, history and subsites. Special cases from that article:

- **Group-connected sites.** Deleting the site deletes the group and its resources, including the Outlook mailbox and calendar and any Teams channels. Deleted Microsoft 365 groups are retained for only 30 days.
- **Hub sites.** Unregister the site as a hub before deleting it.
- **Root site.** Microsoft does not recommend deleting it, because all SharePoint sites become inaccessible until it is restored or replaced.
- **Storage.** Deleted sites in the recycle bin do not count toward storage, and storage updates can take up to 48 hours.

## Permanent deletion

You can permanently delete a site from the **Deleted sites** page: select it, then **Delete** and confirm. Permanent deletion is required before a site URL can be reused, and the URL can take up to 24 hours to become available. Learn says all sites except Microsoft 365 group-connected sites can be permanently deleted from the admin center. For group-connected team sites, use `Remove-SPODeletedSite` as a Global Administrator or SharePoint Administrator. Choose this when the group resources are already gone and you do not want a half-restored site, or when the content must be gone for good.

## Limits

- Restore works on one selected site at a time.
- Sites are unrecoverable after 93 days unless preserved by a retention policy.
- Group resources can be recovered only for 30 days.
- To restore items inside a site rather than the site, use the site's recycle bin.

## Checklist

1. Note when the site was deleted and whether it was group-connected.
2. Select the single site under **Deleted sites** and restore it.
3. Check the group, mail, Planner and any Teams connection.
4. If the group resources are gone, decide between a partial restore and permanent deletion.
5. If you need long-term preservation, create a retention policy for the future.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Restore a deleted site](https://learn.microsoft.com/sharepoint/restore-deleted-site-collection)
- [Delete a site](https://learn.microsoft.com/sharepoint/delete-site-collection)
