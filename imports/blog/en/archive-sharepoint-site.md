---
title: "How to archive a SharePoint site without losing the content"
summary: "Archive a SharePoint site without losing content: choose read-only, Microsoft 365 Archive or a move, check hubs, Teams and retention, and plan reactivation."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-site-lifecycle, content-lifecycle-management, retention-policies, sharepoint]
keypoints:
  - "You have three options for an old site: lock it as read-only, archive it in Microsoft 365 Archive, or move the content you need and retire the site."
  - "An archived site is no longer directly accessible to anyone, so tell the owners and users before you start."
  - "Microsoft states that a site keeps its metadata and permissions on reactivation, and that archived content stops using the active storage quota."
  - "Hub sites must be unregistered first, and Teams-connected sites with private or shared channels cannot be archived in the admin center."
  - "Archiving does not replace retention: content marked for deletion by a retention policy is still deleted while the site is archived."
faq:
  - q: "What is the difference between a read-only site and an archived site?"
    a: "A read-only site stays in active storage and users can still open it, but they cannot add, update or delete content. An archived site moves to Microsoft 365 Archive, no longer counts toward the active storage quota and is not directly accessible to anyone until an admin reactivates it. Read-only is quick to reverse, archive saves storage."
  - q: "Can I get an archived SharePoint site back?"
    a: "Yes. A SharePoint administrator or Global administrator selects the site on the Active sites page and chooses Reactivate. The site passes through a Reactivating state and then returns to the active list. Microsoft states that permissions, lists, pages, files and metadata revert to their pre-archive state. For some archived sites, the admin center shows an estimated reactivation price."
  - q: "Does archiving a SharePoint site delete anything?"
    a: "Archiving does not delete the site content. Retention still applies, though: Microsoft states that content marked for deletion by retention policies is deleted as normal, and the recycle bin continues to expire items while the site is archived. Check retention policies and holds before you archive, because the archive does not pause them."
---

To archive a SharePoint site without losing content, decide first whether the content must stay available, then choose between a read-only lock, Microsoft 365 Archive, or a move of the needed content before you retire the site. This guide is for the SharePoint admin who has to deal with old project sites and wants a safe order of steps. It explains the three options, what Microsoft documents about archived sites, what to check before you start, and how to bring a site back.

## How to archive a SharePoint site: the three options

Archiving can mean three different things, and people mix them up. Choose by asking who might still need the content, and how fast.

- **Read-only lock.** Users can still open the site, but they cannot add, update or delete content. It is quick and fully reversible, and the site stays in active storage.
- **Microsoft 365 Archive.** The site moves to a cold storage tier. Nobody can open it directly until an admin reactivates it. It frees active SharePoint storage.
- **Move and retire.** You copy or move the content that is still needed to another [SharePoint](https://www.m365.fm/entity/sharepoint/) site, and then retire the old one.

The right choice depends on the site. A project that ended last month and may be asked about next week suits read-only. A site from five years ago, kept only for the record, suits the archive. A site with ten useful files among thousands of useless ones suits a move.

All three belong to the [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) of a site: create, use, review, close. If you have no closing step yet, this guide gives you one.

## Option 1: make the site read-only

Microsoft's article on [locking and unlocking sites](https://learn.microsoft.com/sharepoint/manage-lock-status) describes three lock states for the `Set-SPOSite` cmdlet with the `-LockState` parameter:

- **Unlock** makes the site available to users again.
- **ReadOnly** prevents users from adding, updating or deleting content. A message on the site says that it is under maintenance and read-only.
- **NoAccess** prevents users from accessing the site. If you set a redirect URL for your organization, traffic goes there. Otherwise users see a 403 error.

Two notes from the same article: you cannot set a lock state on the root site, and if a site was closed through a site closure policy, the PowerShell unlock command does not work. A read-only lock is a good first step, because it stops changes, costs nothing and can be undone in one command. It is also the status that Microsoft's lifecycle policies use before archiving.

## Option 2: use Microsoft 365 Archive

According to Microsoft's [overview of Microsoft 365 Archive](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-overview), the service moves inactive content into a cold storage tier inside SharePoint. Four points matter for your plan:

- **Access.** Content in this tier is no longer directly accessible to anyone, so the owners and users must be told before you archive.
- **Search and compliance.** Purview Content Search, end-user search and eDiscovery can still find the content, but exports of archived content may take longer.
- **Metadata and permissions.** A site retains all of its metadata and permissions upon reactivation.
- **Storage.** Archived content no longer consumes the tenant's active storage quota and is counted as archive storage instead.

According to Microsoft's [guide to managing Microsoft 365 Archive](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-manage), a SharePoint administrator or Global administrator opens Active sites in the SharePoint admin center, selects one or more sites, chooses Archive and confirms. Archived sites then appear on the Archived sites page. You can also use `Set-SPOSiteArchiveState` in PowerShell. When a group-connected site is archived, only the site is archived and the rest of the group remains active.

### Restrictions you must check

- Hub sites must be unregistered before you archive them.
- Publishing sites, channel sites and some legacy site templates cannot be archived.
- Teams-connected sites with only standard channels are supported. For sites with private or shared channels, the admin center blocks the action with the message that the group connected site with channel sites associated cannot be archived. PowerShell and Graph archive only the main site and its standard channels, and the private and shared channel sites stay active.
- OneDrive accounts cannot be archived by admins.

### Cost and reactivation

Microsoft describes a lower list price for archive storage beyond your license-allocated storage. To reactivate, you select the site on Active sites, choose Archive and then Reactivate. For a site in the Archived state, a pop-up shows an estimated reactivation price. The site passes through a Reactivating state and cannot be deleted until it finishes. The documentation does not give a fixed reactivation time, and it depends on whether the site is Recently archived or Archived. Ask your Microsoft contact for current prices before you archive at scale.

### File-level archive as a smaller alternative

If only parts of a site are old, you do not have to archive the whole site. The same overview describes file-level archive for files in SharePoint Online sites. Reactivated files cannot be archived again for 120 days, and OneNote files and SharePoint pages cannot be archived at all. Microsoft also describes inactive files policies in SharePoint Advanced Management, which were in preview when this guide was written and are configured through PowerShell. File-level and site-level archive states are independent: archiving a site does not change whether individual files were already archived, and archived files must be reactivated separately. For a quick look at SharePoint storage used by archived files, the `ArchivedFileDiskUsed` property of `Get-SPOSite` shows the bytes for one site.

## Option 3: move what is needed, then retire the site

Sometimes the site is mostly clutter. Review the libraries with the owner, copy or move the few items that people still need to a living site, and then lock or archive the old site. This is the best option when the old site has a bad structure, because the useful content lands where people look for it. It takes more work than the other two, so use it for sites with a clear owner and a small set of valuable files.

Deleting is the last step, not the first. Microsoft states that its lifecycle policies do not delete sites directly. Treat deletion as a separate decision with an owner's confirmation and a check of [retention policies](https://www.m365.fm/entity/retention-policies/) and holds.

## Check before you archive

Work through this list for every site:

1. **Owner and purpose.** Who owns the site, and why does it exist? If nobody answers, the decision goes to your governance group.
2. **Retention and holds.** Microsoft states that compliance features such as eDiscovery and retention labels continue to apply to archived sites. Content marked for deletion by retention policies is still deleted as normal, and the recycle bin continues to expire items. Archiving is not a pause button.
3. **Hub association.** Unregister the hub site before archiving it, and tell the owners of associated sites, because their navigation changes.
4. **Teams and channels.** Check whether a team and channels with private or shared sites are connected.
5. **Links and automation.** Look for flows, links and pages in other sites that point to the old one. They will fail after archiving.
6. **Notice.** Tell owners and users what happens, when, and how to ask for reactivation.

This is [content lifecycle management](https://www.m365.fm/entity/content-lifecycle-management/) in practice: stages with owners, review dates and clear rules, not a one-time cleanup.

## Example: 40 old project sites

This example uses invented numbers. A tenant uses 5.5 TB of active storage. A review finds 40 project sites that ended more than two years ago, with an average of 25 GB each, which is 1,000 GB in total, or about 18 percent of the active storage.

- **Week 1:** the admin sends a notice to the owners and sets all 40 sites to read-only. Six owners reply that they still need parts of the site.
- **Week 3:** for those six sites, the owners move about 2 GB of files each to a living site, which is 12 GB in total. The six sites then follow the same path.
- **Week 5:** the admin unregisters two hub-associated sites, finds three Teams-connected sites with private channels that the admin center will not archive, and sets those three aside for a separate decision.
- **Week 6:** the admin archives the remaining 37 sites, about 925 GB.

The result is that around 925 GB leaves the active storage, nobody lost a file, and the three exceptions have an owner and a date. Reactivation requests go to the same admin queue and are answered within the agreed time.

## Common mistakes

- **Archiving without a notice.** An archived site is not directly accessible, so users find out when they click a link.
- **Forgetting the hub.** Hub sites must be unregistered first, and associated sites lose the shared navigation.
- **Expecting retention to stop.** Archiving does not pause retention deletion.
- **Archiving every site by default.** A read-only lock is cheaper and easier to reverse for sites that might be needed soon.
- **No reactivation process.** Someone will ask for the site back. Define who decides, who executes and who pays.

## How software can help

The Active sites list, the read-only lock and the archive action in the admin center are enough for a first round. A script that reads a CSV of site URLs can lock many sites in one run. Tools that report last activity, owners and storage per site help you pick candidates, and lifecycle policies can automate the notice. Check each tool for how it handles hubs and Teams-connected sites.

## Next step

Pick five sites that nobody has opened for two years, set them to read-only and send a notice to their owners. After two weeks, you will know how to archive a SharePoint site in your tenant without surprises.
