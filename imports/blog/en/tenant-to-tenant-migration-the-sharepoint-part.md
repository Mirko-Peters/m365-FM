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
    a: "At the time Microsoft Learn was checked in November 2026, a cross-tenant SharePoint solution was in private preview, and moving OneDrive content between tenants was possible with PowerShell. Availability can change, so check Microsoft Learn for the current status before you plan, and test any approach on a pilot site first."
  - q: "Are source files deleted when content is migrated?"
    a: "For SharePoint migration into Microsoft 365, Microsoft Learn states that migrating copies the files and your source files are not deleted. Even so, keep the source tenant intact until you have validated the target, and keep a backup or another way back before you decommission anything."
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
- **SharePoint Migration Tool (SPMT)**, for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages.
- **Azure Data Box**, named for large amounts of data over a limited network connection.

The same page states that the Mover tool is retired for admin-led migrations. It also says that moving between two Microsoft 365 tenants is a separate topic.

For that separate topic, the page gave two hints when it was checked in November 2026. Moving OneDrive content between tenants was possible with PowerShell, and a cross-tenant SharePoint solution was in private preview. A private preview is not a general availability announcement, so do not build a project plan on it without confirming its status. Open the [Microsoft Learn page on migrating to SharePoint](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) and check the current wording before you commit to an approach.

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

## Content is more than files

Files are the easy part to picture. A SharePoint site also carries permissions, sharing links, metadata, versions, navigation, pages, lists, and sometimes automations. Which of these a given approach can carry over to a different tenant depends on the method and on its current state. Do not assume a property survives a move because the files do.

Pay particular attention to the following:

- **Permissions and identities.** Users and groups in the target tenant are separate identities from those in the source tenant. Permissions that reference people or groups need a mapping plan.
- **Sharing links.** Sharing links created in the source tenant may not work against content in the target tenant. Check on Microsoft Learn how links are handled in your approach and plan how users will find content in its new place.
- **Workflows.** Microsoft Learn says classic SharePoint Server workflows should be rebuilt as Power Automate flows. The same thinking applies to automations in the source tenant: treat them as something to rebuild and test, not something that moves on its own.
- **Teams-connected sites.** The files of a team live in SharePoint, but the team itself is part of the Teams workstream. Coordinate the two so that the chat, channels and files end up consistent.

If content crosses a limited network link, Microsoft names Azure Data Box for large data volumes in the SharePoint migration scenario. Check on Microsoft Learn whether that applies to your situation.

## Test, roll back, and cut over carefully

Moving content between tenants can lose data or change who has access, so treat every step as risky until it has been tested. Run the first pass on a pilot site or in a test tenant. Choose a pilot that is small but representative: one team site with a few libraries, some unique permissions and at least one automation.

Before any production move, make sure you have a backup or another way back. Keep the source tenant and its content intact until the target has been validated by the site owners. Microsoft Learn notes for SharePoint migration that the files are copied and the source is not deleted, but that is not a reason to skip your own safety net. A copy that is incomplete or wrongly permissioned is only useful if the original is still there.

For the validation itself, agree in advance what "done" means for each site, for example:

- Libraries and folders are present and open correctly.
- Owners and members can access what they should, and nobody else can.
- Key pages, lists and navigation work.
- Rebuilt automations run as expected.

Bulk changes, such as changing permissions or removing access in the source after the move, belong at the very end and should be done in small batches, tested first on a pilot site and with a backup or another way back.

One more organisational point: Microsoft Learn describes a Migration Administrator role that lets a migration team work without full SharePoint admin access. It is documented in the context of SharePoint migration into Microsoft 365, so check Learn for how, or whether, it applies to your cross-tenant scenario.

## Practical takeaways

- Treat the SharePoint part of a tenant-to-tenant migration as its own workstream with its own inventory and owners.
- Remember that Microsoft Learn describes moving between two Microsoft 365 tenants as separate from a standard SharePoint migration, so tools documented for file shares or SharePoint Server do not automatically apply.
- Check Microsoft Learn for the current status of cross-tenant options before you plan. In November 2026 a cross-tenant SharePoint solution was in private preview, and OneDrive content could be moved with PowerShell.
- Decide per site whether content moves, is archived or stays behind, and make sure every site has an active owner.
- Plan for permissions, sharing links, workflows and Teams-connected sites, not just files.
- Pilot first on a representative site or in a test tenant, keep a backup or another way back, and keep the source intact until the target is validated.
- Verify any third-party tool against your cross-tenant scenario in a pilot instead of assuming coverage.
