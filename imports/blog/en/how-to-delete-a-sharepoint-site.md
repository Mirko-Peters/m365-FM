---
title: "How to Delete a SharePoint Site and Restore It Within 93 Days"
summary: "How to delete a SharePoint site as a site owner or admin, what disappears with it, how the 93-day Deleted sites list works and how to restore a site fast."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [sharepoint, sharepoint-site-lifecycle]
keypoints:
  - "A site owner deletes a site under Settings, Site information, Delete site. An admin can do it in the SharePoint admin center under Active sites."
  - "Deleting a site removes its libraries, files, lists, pages and subsites. Deleted sites are kept for 93 days before they are permanently deleted."
  - "Deleting a group-connected team site also deletes the Microsoft 365 group and its resources, such as the Outlook mailbox and calendar and any Teams channels."
  - "To restore a site, a SharePoint administrator opens Deleted sites in the admin center, selects exactly one site and selects Restore."
  - "A deleted file is a different case: the site Recycle Bin restores single items, while Deleted sites restores whole sites."
faq:
  - q: "How do I delete a SharePoint site?"
    a: "Open the site, select the Settings gear, then Site information, and select Delete site at the bottom of the panel. Check the box in the confirmation dialog and select Delete. You must be a site administrator or SharePoint administrator. Admins can also select the site under Active sites in the SharePoint admin center and select Delete."
  - q: "Can I restore a deleted SharePoint site?"
    a: "Yes, for 93 days. A SharePoint administrator opens Deleted sites in the SharePoint admin center, selects the site and selects Restore. The button only works when one site is selected. After 93 days, the site and its content are permanently deleted. For group-connected sites, other group resources are kept for only 30 days."
  - q: "What happens to Teams when I delete a SharePoint team site?"
    a: "For a Microsoft 365 group-connected site, Microsoft says deleting the site deletes the group and all its resources, including the Outlook mailbox and calendar and any Teams channels. Check which team is connected to the site before you delete it, and tell the members first."
---
To delete a SharePoint site as a site owner, open the site, select the **Settings** gear, select **Site information**, select **Delete site** at the bottom, check the box in the dialog and select **Delete**. An admin deletes it from **Active sites** in the SharePoint admin center. A deleted site stays recoverable for 93 days. This article is for site owners and admins who want to remove a site without surprises. You'll find the steps for both roles, what disappears with the site, how to restore it and how it differs from deleting a single file.

## Check this before you delete

Deleting a site is bigger than it looks. Microsoft's page [Delete a SharePoint site or subsite](https://support.microsoft.com/en-us/sharepoint/sites-pages/delete-a-sharepoint-site-or-subsite) says deleting a team or communication site also deletes its subsites, pages, content and user information, including documents, document libraries, lists and list data. Go through this short list first:

1. **Is it the right site?** Open the address, look at the owners and the last edited files.
2. **Is it connected to a Microsoft 365 group or a Teams team?** Microsoft says deleting a group-connected site deletes the group and all its resources, including the Outlook mailbox and calendar and any Teams channels. That's a team-wide loss, not a file cleanup.
3. **Does anyone still use it?** Tell site admins and subsite owners beforehand so they can move their data, and tell users when the site will be deleted.
4. **Is it a hub site?** You must unregister it as a hub site first.
5. **Do you need a copy?** Download or move what you need. If content has to be kept for regulatory reasons, ask your compliance team about a retention policy. Microsoft says a retention policy can keep a copy in the Preservation Hold library.

The root site (the one at the top address of your tenant) is a special case. Microsoft doesn't recommend deleting it. If you do, all SharePoint sites become inaccessible until you restore it or create a new root site. Replace it instead.

## Delete a site as the site owner

You must be a site administrator or a SharePoint administrator. For team sites, the owners of the team's group are automatically site admins. These are the steps from Microsoft's support page:

1. Go to the team or communication site you want to delete.
2. Select the **Settings** gear at the top of the site, then **Site information**. If **Site information** doesn't appear, ask your SharePoint administrator for access.
3. At the bottom of the panel, select **Delete site**.
4. In the confirmation dialog, check the box and select **Delete**.

Communication sites show a confirmation about permanent deletion. Team sites show a dialog stating that the site and all its content will be deleted. Read it. If you're a site admin and the button doesn't work, your administrator may have turned off that ability.

Deleting a group-connected team site can take some time before the site is removed from SharePoint, so don't be alarmed if it's still listed for a while.

## Delete a site as a SharePoint admin

Admins use the SharePoint admin center. Microsoft's page [Delete a site](https://learn.microsoft.com/en-us/sharepoint/delete-site-collection) lists the steps. You need at least the SharePoint Administrator role.

1. Go to **Active sites** in the SharePoint admin center.
2. Select the site in the list.
3. Select **Delete**, then select **Delete** again to confirm.

This works for classic and modern sites. For group-connected team sites, you can also delete through the Microsoft 365 admin center, the Active sites page or PowerShell. In PowerShell, `Remove-SPOSite` deletes a site without removing it permanently.

Storage figures change after a deletion: deleted sites in the recycle bin don't count toward total storage usage, and the number can take up to 48 hours to update.

## What happens in the 93 days afterward

A deleted site isn't gone. Microsoft says it's retained as a deleted site for 93 days, and a deleted Microsoft 365 group is retained for only 30 days. That difference matters for group-connected sites, because the other group resources can disappear before the site does.

You find deleted sites on the **Deleted sites** page of the SharePoint admin center. They stay there for the retention period, then the site and its content and settings are permanently deleted, including lists, libraries, pages and subsites.

### Restore a deleted site

You need a SharePoint Administrator or a higher Microsoft 365 admin role. Microsoft's page [Restore deleted sites](https://learn.microsoft.com/en-us/sharepoint/restore-deleted-site-collection) describes the steps:

1. Go to **Deleted sites** in the SharePoint admin center.
2. Select the site you want to restore. You can sort and filter by **Time deleted**.
3. Select **Restore**. The button appears only when exactly one site is selected.

Restoring a group-connected site restores the Microsoft 365 group and all its resources. Because those resources are kept for 30 days and the site for 93, the resources may already be gone. In that case Microsoft says you can use `Remove-SPODeletedSite` to permanently delete the site. Microsoft's support page says a site collection administrator can usually restore an accidentally deleted site from the site collection recycle bin, so ask your admin quickly and name the site address and the time of deletion.

## Reusing the address: permanent deletion

If you want to create a new site at the old address, the deleted site blocks it until it's permanently deleted. Microsoft says permanent deletion is required before you can reuse a URL. After permanent deletion, the URL may take up to 24 hours to become available.

In the admin center, go to **Deleted sites**, select the site and select **Delete**, then **Delete** again. The Deleted sites page can permanently delete all sites except those that belong to Microsoft 365 groups. For group-connected team sites, PowerShell is the only option:

1. Install the latest SharePoint Online Management Shell.
2. Connect as a Global Administrator or SharePoint Administrator.
3. Run `Remove-SPODeletedSite` with the site address as identity.

Treat permanent deletion as the point of no return, because the 93-day safety net ends there.

## Deleting a file is not deleting a site

Many people search for "delete SharePoint site recycle bin" because they deleted a file and want it back. The two things work in different places. A deleted file goes to the Recycle Bin of that site, where you can restore single items. A deleted site goes to the Deleted sites page of the admin center, and only admins can restore it. If you need a file, don't restore the whole site. Open the site Recycle Bin.

If the question is not "delete" but "clean up", consider the alternatives. Remove unused libraries or tidy the navigation instead. Our [SharePoint](https://www.m365.fm/entity/sharepoint/) overview shows where sites fit, and the page on the [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) covers what happens to a site between its creation and its deletion.

## Common mistakes

- **Deleting a Teams-connected site as if it were only files.** The group, mailbox, calendar and Teams channels go with it.
- **Forgetting the hub.** A hub site must be unregistered before you delete it.
- **Deleting the root site.** Microsoft doesn't recommend it, because all sites become inaccessible until you restore it or create a new one.
- **Assuming 93 days applies to everything.** The group is kept for 30 days.
- **Trying to reuse the address right away.** Permanent deletion comes first, then up to 24 hours of waiting.
- **Telling nobody.** Notify members and owners before the deletion date.

## Related topics to explore

- **Restoring single files.** Use the Recycle Bin of the site for items that were deleted by mistake.
- **Creating the replacement site.** If you delete a site to start over, read how to create a site and choose the type and the language carefully, because the language can't be changed later.
- **Group and Teams deletion.** Deleting a group has its own 30-day window and its own admin pages.
- **Retention.** Microsoft says a retention policy can keep a copy of content in the Preservation Hold library.
- **Hub sites.** Associated sites can be deleted like any other site, but the hub itself must be unregistered first.

## Next step

Write down the site address, the owners and the connected group or team, notify the members and take a copy of what you need. Then delete the site with the steps above. If you're still unsure, wait: with the 93-day Deleted sites window, how to delete a SharePoint site safely means being able to restore it.
