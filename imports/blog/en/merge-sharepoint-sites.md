---
title: "How to merge two SharePoint sites into one without losing content"
summary: "Merge SharePoint sites without losing content: pick the target site, move libraries with version history, rebuild pages and permissions, retire the old one."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-migration, sharepoint-site-lifecycle, sharepoint-hub-sites, sharepoint-essentials-toolkit]
keypoints:
  - "Microsoft documents move and copy actions for files, but no one-step command that merges two sites, so a merge is a planned restructuring project."
  - "Move to copies the version history to the destination, while Copy to keeps only the latest version, and managed metadata values are not retained."
  - "Plan each copy or move operation below the documented limits of 100 GB and 30,000 files."
  - "If the sites only need to appear together, a hub site with shared navigation and search may be enough, and it does not change permissions."
  - "Keep the source site read-only for a grace period before you retire it, and check pages, navigation, flows and shared links that point to the old address."
faq:
  - q: "Is there a built-in way to merge two SharePoint sites?"
    a: "Microsoft's documentation does not describe a one-step merge of two sites. The documented building blocks are the Move to and Copy to actions for files and folders, hub site association and site address changes. In practice, you choose a target site, move the libraries, rebuild pages and navigation, and retire the source site afterward."
  - q: "Does moving files between sites keep the version history?"
    a: "With Move to, Microsoft states that the history of the document is copied to the new destination. With Copy to, only the latest version is copied. Metadata is kept only for properties that exist at the destination, and managed metadata values are not retained, so create the columns first and plan to reapply tagged values."
  - q: "Can a hub site replace a merge?"
    a: "Sometimes. A hub site groups related sites with shared navigation, theme and search and rolls up content, but each site keeps its own content and permissions. If people only need to find the content together, association is far cheaper than a merge. If you need one library structure and one set of owners, merge."
---

To merge two SharePoint sites without losing content, choose the site that survives, move each library with its version history, rebuild pages and navigation, map permissions deliberately, and retire the source site only after a grace period. This guide is for the SharePoint admin who has to consolidate two sites after a reorganization or merger. It covers what Microsoft documents, what survives a move, how to plan the operations, and what to check before you switch the old site off.

## Merge SharePoint sites: choose the surviving site first

Everything else depends on one decision: which site is the target. Compare the two sites on these points:

- **Site type and connections.** Is one site connected to a Microsoft 365 group or a team? Consolidating into the connected site avoids breaking that link.
- **Address.** The target keeps its address. Users of the other site will need a new bookmark.
- **Owners and audience.** The target should have the owners who will be responsible afterward.
- **Hub association.** Check whether either site belongs to a hub.

Also ask whether you need a merge at all. According to Microsoft's [hub site planning guide](https://learn.microsoft.com/en-us/sharepoint/planning-hub-sites), a [hub site](https://www.m365.fm/entity/sharepoint-hub-sites/) connects related sites with shared navigation and theme, rolls up content and provides a common search scope. Associating a site does not change its permissions. If people only need to find both sites together, association is far cheaper and safer than a merge. Merge when you want to combine the content into a single library structure, with one set of owners and one place to manage. A hub is the lighter option, and a merge is the heavier one.

Microsoft's documentation does not describe a one-step merge of two sites. What it documents are the building blocks: moving and copying files, associating hubs and changing a site address. A merge is therefore a restructuring project with several moves.

## Take stock of both sites

List what each site contains before you touch anything:

- Document libraries and folders, with item counts and sizes
- Lists and their columns, plus any template or flow that depends on them
- Site pages and news posts
- Navigation, including links that point to either site
- Permissions, especially folders and files with unique permissions
- Flows, apps and forms that reference the site address
- Retention, label and sharing settings on each site
- Shared links that people sent by e-mail or chat, and OneDrive shortcuts to the site
- The single owner or team that knows each area

The inventory shows the size of the job and the risks. Content with unique permissions and automated flows are the usual surprises. Ask the owners of both sites to confirm the list, because they know which libraries are dead and which pages the team still opens every week. Anything that nobody claims is a candidate for archiving instead of moving, which makes the merge smaller and the result cleaner.

## What survives a move

Microsoft's article on [moving and copying files in SharePoint](https://support.microsoft.com/en-us/SharePoint/libraries/move-or-copy-files-in-sharepoint) states the main rules:

- With **Move to**, the history of the document is copied to the destination. With **Copy to**, only the latest version is copied.
- Metadata is kept only for properties that the destination supports. A column that does not exist in the destination library is lost, and managed metadata values are not retained.
- A move fails across libraries when the destination enforces unique values.
- Move to is not available in the Site Pages library.
- If other sites do not appear as destinations, your organization does not allow cross-site operations, and an admin can enable them in the SharePoint admin center.
- The file stays at the source until the move completes, and it then goes to the source site's recycle bin.

Microsoft also documents limits on large operations in the [SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits). A copy or move operation is limited to 100 GB in total and 30,000 files, so split larger libraries into several operations.

## Plan the merge in steps

1. **Prepare the target structure.** Create the libraries, columns, content types and list templates you need before you move any file. Create columns first, so that the metadata has somewhere to land.
2. **Pilot one library.** Move a small library, then check version history, metadata, permissions and links in a saved view that shows the columns you care about.
3. **Move in batches.** Keep each operation below the documented limits, and move during quiet hours so that nobody edits files during the move.
4. **Rebuild pages and navigation.** Pages are not moved with Move to in the page library. Copy or recreate them, and update links that pointed to the source.
5. **Map permissions.** Do not merge groups blindly, and do not rely on automation to guess who needs access. Decide which user groups need access to the combined content and assign them accordingly. Unique permissions on folders need a decision for each case.
6. **Cut over.** Announce the change, set the old site to read-only for editors, and watch for questions.
7. **Retire the source.** After a grace period, archive or delete the old site as part of normal [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) management.

Treat the whole sequence as a small [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) with an inventory, a pilot and a verification step.

## Example: two sales sites become one

This example uses invented numbers. The EMEA sales site has 4 libraries and 62,000 files. The Nordics sales site has 2 libraries: Contracts with 7,100 files and Marketing with 2,300 files, 14 GB in total. EMEA is the surviving site.

- **Operations:** Contracts and Marketing each fit in one operation, because 7,100 and 2,300 files are far below 30,000, and 14 GB is far below 100 GB. That makes 2 operations and 9,400 files in total.
- **Metadata:** Contracts has a Region column that exists in the EMEA library, and a managed metadata column Customer on all 7,100 files. Because managed metadata values are not retained, the admin exports the Customer values before the move and reapplies them afterward.
- **Pages:** the Nordics site has 12 pages and 5 news posts, which are recreated by hand in EMEA.
- **Permissions:** Nordics has 3 folders with unique permissions. The owner confirms that 2 are still needed. They become folders with their own access in the Contracts library, and the third is dropped.

The result is that 9,400 files arrive in two new EMEA libraries with version history, the Customer values are reapplied, and the Nordics site is read-only for a grace period of 30 days before retirement.

## Verify the result before you retire the source

Compare numbers, not impressions. For every moved library, compare the item count in the source with the item count in the target, and keep both counts in a separate migration log, together with the other data you collect. Open the version history of five files that had many versions and confirm that the history arrived. Check that the managed metadata columns are filled again, and that the test accounts of each team can open what they should and cannot open what they should not. Click through the navigation and the pages of the target and note every link that still points to the source. Only when this list is clean should you decide on the retirement date. Keep the log, because it also answers the question "where did my file go?" quickly.

## Optional: change the address of the surviving site

Sometimes the surviving site should have a neutral name, for example Sales instead of Sales EMEA. Microsoft's [change a site address](https://learn.microsoft.com/en-us/sharepoint/change-site-address) article describes the effects. A redirect is created at the old address, and sharing links redirect to the new URL. The site is read-only during the change, which can take about 10 minutes. Embedded URLs in web parts are not updated and may break, and hub sites cannot be changed in the admin center, so check these points before you rename. Do the rename after the merge, not during it, so you can tell which problem comes from which change.

## Common mistakes

- **Starting without a target.** Moving files in both directions creates a new mess.
- **Ignoring managed metadata.** The values are not retained with Move to, so tagged content arrives untagged.
- **Moving too much at once.** Operations above the documented limits fail or stall.
- **Forgetting pages and flows.** Files move, but pages, navigation and flows still point to the source.
- **Retiring the source too early.** Keep it read-only first, because users will find links you missed.

## How software can help

Microsoft's built-in Move to and Copy to actions are enough for small sites. For larger merges, scripts and migration tools can handle batches, metadata and reports. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/), which lists SharePoint-to-SharePoint migration among its functions. According to the product page, item IDs, version history and metadata are kept, and verification reports are available after the migration. These are the vendor's statements and M365.FM has not tested them. Compare any tool with your inventory.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Write down which site survives and why, and list the libraries, pages and permissions of the other one. With that list in hand, you can decide whether to merge SharePoint sites or simply connect them through a hub.
