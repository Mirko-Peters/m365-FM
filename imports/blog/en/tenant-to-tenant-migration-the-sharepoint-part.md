---
title: "Tenant-to-tenant migration: the SharePoint part"
summary: "Moving SharePoint content between two Microsoft 365 tenants is its own workstream inside a tenant-to-tenant migration. Here is how to scope it, what Microsoft documents, and which questions to settle early."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [tenant-to-tenant-migration, sharepoint-migration]
faq:
  - q: "Is a tenant-to-tenant migration the same as a SharePoint migration?"
    a: "No. A SharePoint migration, as Microsoft Learn describes it, moves content from sources such as file shares, other cloud services or older SharePoint Server versions into Microsoft 365. Moving between two Microsoft 365 tenants is a separate topic. SharePoint content is one part of a wider tenant-to-tenant project that also covers users, mailboxes and Teams."
  - q: "Does Microsoft offer a native way to move SharePoint sites between tenants?"
    a: "Yes, under conditions. The Microsoft Learn page on cross-tenant SharePoint site migration, updated in October 2026, describes a solution that SharePoint admins run with SharePoint Online PowerShell. The Cross-Tenant Shared Data Migration feature and licenses are currently only available to Enterprise Agreement customers. Microsoft's general migration page still calls the SharePoint solution a private preview, so check the current wording and test on a pilot site first. Moving OneDrive content between tenants is possible with PowerShell as well."
  - q: "Are source files deleted when content is migrated?"
    a: "It depends on the method. For SharePoint migration into Microsoft 365 from file shares and similar sources, Microsoft Learn states that migrating copies the files and your source files are not deleted. The cross-tenant SharePoint solution is different: it moves the content, leaves a redirect at the source and cannot run incremental or delta passes. Keep a backup or another way back before you start."
---

Moving two organisations into one Microsoft 365 environment, or splitting one apart, usually gets summarised as a single task. In practice it breaks into several workstreams: identities, mailboxes, Teams, OneDrive and SharePoint sites. Each has its own constraints and its own owners.

This article looks at the SharePoint part of a [tenant-to-tenant migration](https://www.m365.fm/entity/tenant-to-tenant-migration/). It does not give a click-by-click procedure. It explains how to scope the work, what Microsoft documents today, and which questions are worth answering before any tool is chosen.

## Why SharePoint needs its own plan

A tenant-to-tenant migration, also called T2T migration or tenant migration, means moving users, mailboxes, files, Teams and settings from one Microsoft 365 tenant to another. A merger or a divestiture is a typical trigger.

SharePoint content is rarely a single block. Imagine a company with a handful of communication sites, many team sites behind Microsoft 365 groups and Teams, and a few old sites nobody has opened in years. A team site is typically connected to a Microsoft 365 group and often to a Teams team. A communication site is not tied to a group in the same way. An unused site may not need to move at all.

That is why the SharePoint part benefits from its own inventory, owner list and test plan, even when one project manager runs the whole migration.

## What Microsoft documents, and what it does not

Be careful with the term "SharePoint migration". Microsoft Learn describes [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) as moving content from file shares, other cloud services or older SharePoint Server versions into SharePoint and OneDrive in Microsoft 365. The content is copied, and the source files are not deleted.

The tools Microsoft names for that scenario are:

- **Migration Manager** in the SharePoint admin center, for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares.
- **SharePoint Migration Tool (SPMT)**, for SharePoint Server 2010, 2013 and 2016 environments only.
- **Azure Data Box**, named to avoid depending on the WAN link when you copy large amounts of file-server data; the data lands in Azure and SPMT then migrates it to SharePoint.

The same page states that the Mover tool is retired for admin-led migrations. It also says that moving between two Microsoft 365 tenants is a separate topic.

For that separate topic, Microsoft documents two routes. Moving OneDrive content between tenants is possible with PowerShell. For SharePoint sites, there is a dedicated [cross-tenant SharePoint migration page on Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/migration/cross-tenant-sharepoint-migration), updated in October 2026, which says sites can now be moved from one tenant to another with SharePoint Online PowerShell. The same page says the Cross-Tenant Shared Data Migration feature and its licenses, offered per 100 GB of data moved, are currently only available to Enterprise Agreement customers. Microsoft's general [page on migrating to SharePoint](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) still calls the SharePoint solution a private preview, so the two pages disagree. Treat the dedicated page as the more detailed and more recent one, and confirm the current status with your Microsoft account team before you commit to an approach.

Three characteristics of the cross-tenant solution shape the plan. It moves content rather than copying it, and leaves a redirect at the source. Incremental and delta passes cannot be performed, so it is a one-time move per site. Up to 4,000 sites can be queued at a time, and Microsoft says the content does not leave the Microsoft 365 cloud during the move.

Third-party tools exist as well. ShareGate is one example of a third-party tool for SharePoint migration. Whether a given tool covers your cross-tenant scenario is something to verify with the vendor and in a pilot, not something to assume.

## Build the inventory before you pick a tool

Whatever approach you end up with, the preparation looks similar. A useful inventory answers these questions for every site:

- Who owns it, and is that person still with the company?
- Is it connected to a Microsoft 365 group or a Teams team?
- Is it still used, or can it be archived or left behind?
- Does it contain classic workflows, classic pages or custom solutions?
- Does it use external sharing, and with whom?
- Does it contain content with retention labels or other compliance settings?

Imagine a divestiture where a business unit leaves a group. The unit's team sites are obvious candidates. Less obvious are shared sites that contain content for both sides. Someone has to decide, site by site, whether content is moved, copied, split or left alone. That decision is a business decision, not a technical one, and it takes time.

The ownership question matters more than it looks. If a site has no active owner, nobody can confirm what is in scope or sign off the result after the move.

## Prerequisites Microsoft lists for the cross-tenant solution

If you plan to use it, the dedicated page names conditions that belong in your inventory:

- Service encryption with Microsoft Purview Customer Key must not be enabled on the source tenant, otherwise the migration fails.
- Source sites must be in Read/Write mode. Read-only sites fail.
- Target sites must not exist before the migration. An existing site cannot be overwritten or merged. Target Microsoft 365 groups for group-connected sites must be precreated in a specific way.
- Each site can hold no more than 5 TB or 1 million items, counting files including versions, folders and list entries.
- All users and groups must be precreated on the target tenant, and an identity mapping step is part of the procedure.
- The path length limit is 400 characters, and the source path is combined with the new site or user name on the target.
- Sites with sensitivity labels that use user-defined permissions cannot be migrated until those labels are removed from the files.

## Content is more than files

Files are the easy part to picture. A SharePoint site also carries permissions, sharing links, metadata, versions, navigation, pages, lists, and sometimes automations. Which of these a given approach can carry over to a different tenant depends on the method and on its current state. Do not assume a property survives a move because the files do.

Pay particular attention to the following:

- **Permissions and identities.** Users and groups in the target tenant are separate identities from those in the source tenant. Permissions that reference people or groups need a mapping plan.
- **Sharing links.** For the cross-tenant solution, Microsoft says existing sharing links for the migrated files are redirected automatically. For other methods, check on Microsoft Learn how links are handled and plan how users will find content in its new place.
- **Workflows, apps and automations.** For the cross-tenant solution, Microsoft says SharePoint 2010 and 2013 workflows must be recreated and republished on the target, apps must be republished and may need changes, and Power Apps and automation tasks must be recreated and reconnected. Web parts that reference content in other sites or services may need to be modified or recreated. Treat them as something to rebuild and test, not something that moves on its own.
- **Sensitivity labels.** Microsoft says labels on migrated files may not display correctly and that the protection or policy of the original label will not be present after migration. Its recommendation is to remove labels before the migration and reapply new labels afterwards.
- **Teams-connected sites.** The cross-tenant feature does not migrate Teams content, channels or structure. If a Teams-connected site is migrated, only the SharePoint site content moves. Coordinate with the Teams workstream so that chat, channels and files end up consistent.

Azure Data Box is documented for copying file-server data into Azure ahead of an SPMT migration. It is not part of the cross-tenant solution, which Microsoft says keeps the content inside the Microsoft 365 cloud.

## Test, roll back, and cut over carefully

Moving content between tenants can lose data or change who has access, so treat every step as risky until it has been tested. Run the first pass on a pilot site or in a test tenant. Choose a pilot that is small but representative: one team site with a few libraries, some unique permissions and at least one automation.

Before any production move, make sure you have a backup or another way back. For migrations from file shares and similar sources, Microsoft Learn notes that the files are copied and the source is not deleted, but that is not a reason to skip your own safety net. The cross-tenant SharePoint solution is a move: content leaves the source and a redirect is left behind, and incremental or delta passes are not possible. That makes your own backup and a small first batch more important, and it means you cannot count on the source as a fallback. Keep the source tenant itself intact until the site owners have validated the target.

For the validation itself, agree in advance what "done" means for each site, for example:

- Libraries and folders are present and open correctly.
- Owners and members can access what they should, and nobody else can.
- Key pages, lists and navigation work.
- Rebuilt automations run as expected.

Bulk changes, such as changing permissions or removing access in the source after the move, belong at the very end and should be done in small batches, tested first on a pilot site and with a backup or another way back.

One more organisational point: Microsoft Learn describes a Migration Administrator role that gives access to Migration Manager in the Microsoft 365 admin center without the broader SharePoint administrator role. The cross-tenant page describes SharePoint admins running the migration with SharePoint Online PowerShell, so do not assume that the role covers that route.

## Practical takeaways

- Treat the SharePoint part of a tenant-to-tenant migration as its own workstream with its own inventory and owners.
- Remember that Microsoft Learn describes moving between two Microsoft 365 tenants as separate from a standard SharePoint migration, so tools documented for file shares or SharePoint Server do not automatically apply.
- Check Microsoft Learn for the current status of cross-tenant options before you plan. The dedicated page describes a cross-tenant SharePoint solution that is currently only available to Enterprise Agreement customers with the matching licenses, while Microsoft's general migration page still calls it a private preview. OneDrive content can be moved with PowerShell.
- Remember that the cross-tenant SharePoint solution moves content and leaves a redirect behind, with no incremental passes, so plan the backup and the first batch accordingly.
- Decide per site whether content moves, is archived or stays behind, and make sure every site has an active owner.
- Plan for permissions, sharing links, workflows and Teams-connected sites, not just files.
- Pilot first on a representative site or in a test tenant, keep a backup or another way back, and keep the source tenant intact until the target is validated.
- Verify any third-party tool against your cross-tenant scenario in a pilot instead of assuming coverage.

## Sources

- [Cross-tenant SharePoint site migration overview (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/migration/cross-tenant-sharepoint-migration)
- [Migrate to Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/sharepointmigration/migrate-to-sharepoint-online)
