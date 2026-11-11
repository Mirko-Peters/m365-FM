---
title: "SharePoint migration planning: inventory before you move"
summary: "Most SharePoint migration problems start before the first file moves. This article shows what to inventory first, how to sort content into migration waves, and where Microsoft's tools fit."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [sharepoint-migration, migration-wave, sharepoint]
faq:
  - q: "Does a SharePoint migration delete the files at the source?"
    a: "No. According to Microsoft Learn, migrating copies the content into SharePoint and OneDrive, and the source files are not deleted. That gives you a way back during a pilot, but you should still keep a backup and verify the copy before anyone retires the old location."
  - q: "Which Microsoft tools are used for a SharePoint migration?"
    a: "Microsoft names the Migration Manager in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares. For SharePoint Server 2010, 2013 and 2016 it names the SharePoint Migration Tool (SPMT). Check Microsoft Learn for the current list, because tools and supported sources change."
  - q: "Why do I need an inventory before migrating?"
    a: "An inventory shows what exists, who owns it, how large it is and what depends on it, such as classic workflows or old permissions. Without it you cannot sort content into waves, decide what to leave behind, or estimate effort realistically. It also helps you avoid carrying clutter into the new environment."
---

A [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) is often treated as a tooling question: which tool, which account, which weekend. In practice, the hard part is knowing what you are moving. Tools copy what you point them at, including content nobody has opened in years and permissions nobody remembers granting.

This article is about the work that comes before the first copy job: building an inventory, deciding what each item needs, and sorting it into waves. It assumes you move content into [SharePoint](https://www.m365.fm/entity/sharepoint/) and OneDrive in Microsoft 365 from file shares, other cloud services or older SharePoint Server versions.

## What a migration actually does

According to [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online), SharePoint migration means moving content into Microsoft 365, meaning SharePoint and OneDrive. The page is explicit that migrating copies the files: your source files are not deleted.

That has two consequences worth planning around.

First, the source stays available as a way back during a pilot. You can compare source and target, fix problems and run the copy again. Still, keep a backup and confirm with owners before anyone retires the old location.

Second, nothing in the copy decides whether the content deserves to move. A tool does not know that a folder is a decade-old archive or that a share is used by one person. Those decisions need information, and the inventory is where it comes from.

## Build the inventory first

An inventory is a list of what you have, in a form you can sort and filter. A spreadsheet is enough to start. What matters is the columns. For each source location (a file share, a cloud storage account, a SharePoint Server site collection), try to record:

- **Location and type:** where it lives and what kind of source it is.
- **Owner:** a named person or team who can say whether it is still needed.
- **Size and file count:** to estimate effort and plan network capacity.
- **Last activity:** whether people still use it.
- **Permissions model:** who has access and how that access is organized.
- **Dependencies:** anything that relies on this content.
- **Target:** which site or library it should land in.

Imagine a finance file share with one folder per year. The owner may tell you that only the last two years are used daily, while the rest must be kept for records. That one conversation already splits one source into two different migration decisions: move and use, or archive in a deliberate way.

Do not guess at owners. If nobody claims a location, record that fact. Unowned content is a risk item for your plan, not a detail to skip.

## Look for what does not copy cleanly

Some content needs more than a copy. Microsoft Learn gives a few examples that are worth checking against your inventory.

**Classic workflows.** Microsoft states that classic SharePoint Server workflows should be rebuilt as Power Automate flows. If your inventory shows workflows on lists or libraries you plan to move, list them as separate work items. Someone has to understand what each workflow does and rebuild it.

**Classic pages.** For SharePoint Server 2010, 2013 and 2016, Microsoft names the SharePoint Migration Tool (SPMT), including classic workflows and classic pages. Check Microsoft Learn for what the tool does with them and what remains for you to rebuild.

**Permissions.** Old environments often carry years of one-off sharing. Decide in advance whether you reproduce the old structure or design a simpler one in the target. SharePoint permissions affect what people, and Copilot on their behalf, can find, so review a messy structure before importing it unchanged.

**Large volumes over slow links.** For large amounts of data over a limited network connection, Microsoft names Azure Data Box. Your size column is what tells you whether this is relevant.

## Sort the inventory into waves

Once you know what exists, group it. A [migration wave](https://www.m365.fm/entity/migration-wave/) is a group of applications and workloads migrated together, so a large estate moves in sequenced batches and each wave's lessons carry into the next.

Ways to group content depend on your situation. Common criteria include:

- **Risk:** start with content where a mistake is cheap to fix.
- **Ownership:** keep one team's content together so one owner can review the result.
- **Complexity:** separate plain document libraries from content with workflows or special permissions.
- **Source type:** content from the same source usually uses the same tool and the same checks.

Imagine three waves. Wave one is a small, low-risk team share with an engaged owner, used as a pilot. Wave two is a set of departmental shares with straightforward permissions. Wave three is the SharePoint Server content with classic workflows to rebuild. Each wave ends with a short review: what broke, what surprised people, what should change in the next batch.

The review is the point. If wave one shows that users cannot find their files in the new structure, you fix the structure before wave three, not after.

## Match sources to tools, then pilot

With sources and waves defined, tool choice becomes simpler. Microsoft Learn names:

- The **Migration Manager** in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares.
- The **SharePoint Migration Tool (SPMT)** for SharePoint Server 2010, 2013 and 2016.

The same page says the Mover tool is retired for admin-led migrations. Tools and supported sources change, so confirm the current state on Microsoft Learn before you commit to a plan.

Third-party tools exist as well, ShareGate being one example. They are one option among others; compare them against your inventory and your requirements rather than choosing first and fitting the plan afterwards. Moving between two Microsoft 365 tenants is a separate topic with its own considerations, so do not assume the same approach applies.

Microsoft also describes a Migration Administrator role that lets a migration team work without full SharePoint admin access. Consider it if you want to limit what the migration team can change.

Run every wave as a pilot first. Migrations create content and can change access in the target, so test with a small set in a pilot site or a test tenant before bulk runs, and make sure you have a backup and a way back. Because the source is copied rather than deleted, keep it intact until owners have signed off on the result.

## Practical takeaways

- Treat migration as a copy, not a cleanup. Decide what is worth moving before you move it.
- Build the inventory before choosing tools: location, owner, size, last activity, permissions, dependencies and target.
- Record unowned content as a risk and resolve ownership before the wave that contains it.
- List classic workflows as separate work items to rebuild as Power Automate flows.
- Decide deliberately whether to reproduce old permissions or design a simpler structure in SharePoint.
- Group content into waves by risk, ownership, complexity and source type, and review each wave before starting the next.
- Check Microsoft Learn for the current tool for each source before you commit to a plan.
- Pilot first, keep a backup, and do not retire the source until owners have confirmed the result.
