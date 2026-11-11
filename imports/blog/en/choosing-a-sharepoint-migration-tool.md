---
title: "Choosing a SharePoint migration tool"
summary: "How to pick a SharePoint migration tool: start with the source system and scope, check native Microsoft options first, then compare third-party tools on what you actually need to move."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [sharepoint-migration, sharegate, sharepoint-essentials-toolkit]
faq:
  - q: "Does a SharePoint migration delete the source files?"
    a: "According to Microsoft Learn, migrating copies the files and the source files are not deleted. That gives you a way back if something looks wrong, but you should still test with a pilot first and keep a backup of important content before any cutover or cleanup of the old location."
  - q: "Which Microsoft tool should I use for file shares or Google Workspace?"
    a: "Microsoft names the Migration Manager in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares. For SharePoint Server 2010, 2013 and 2016, it names the SharePoint Migration Tool (SPMT). Check Microsoft Learn for the current list and limits."
  - q: "Do I need a third-party migration tool?"
    a: "Not always. Native Microsoft tools cover many common sources. Third-party tools, such as ShareGate or the SharePoint Essentials Toolkit, are one option if your scenario needs something the native tools do not offer. Define your requirements first, then test the shortlist on a pilot site."
---

Picking a migration tool is easier once you know what you are moving, where it comes from, and what has to arrive intact. Many migration projects start with a tool demo and only later discover that the scope was unclear. Reversing that order saves time.

This article gives a practical way to choose: define the source and scope, look at the native Microsoft options first, then compare third-party tools against your own requirements. Check the current details on Microsoft Learn before you commit, because supported sources and limits can change.

## Start with the source and the scope

[SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) means moving content from file shares, other cloud services or older SharePoint Server versions into SharePoint and OneDrive in Microsoft 365. Microsoft Learn is explicit that migrating copies the files: the source files are not deleted. That is useful, because the original remains as a fallback while you verify the result.

Before you look at any tool, write down:

- **Source:** file shares, a cloud service such as Box or Dropbox, Google Workspace, or an older SharePoint Server version.
- **Scope:** which libraries, folders or sites really need to move. Old, unused content may not be worth migrating at all.
- **What must be preserved:** permissions, version history, metadata, classic pages or workflows.
- **Constraints:** your network connection, your cutover window, and who is allowed to run the migration.

Imagine a team with a large file share where half of the folders have not been touched for years. Deciding what to leave behind or archive reduces the volume, which in turn makes every later step simpler to test and verify.

## Look at the native Microsoft options first

Microsoft documents its own tools on the [migrate to SharePoint page on Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online). Two are central:

- **Migration Manager** in the SharePoint admin center, named for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares.
- **SharePoint Migration Tool (SPMT)**, named for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages.

Microsoft also states that the Mover tool is retired for admin-led migrations, so older guidance that mentions it may be outdated. For large data volumes over a limited network connection, Microsoft names Azure Data Box as an option.

Two further points from the documentation matter for planning. Classic SharePoint Server workflows should be rebuilt as Power Automate flows rather than expected to move over unchanged. And a Migration Administrator role lets a migration team work without full SharePoint admin access, which helps if you want to limit who holds broad permissions during the project.

Moving between two Microsoft 365 tenants is a separate topic with its own tooling and constraints. Microsoft's documentation describes PowerShell for moving OneDrive content between tenants and a cross-tenant SharePoint solution that was in private preview at the time of checking. Verify the current status on Microsoft Learn.

## When a third-party tool enters the picture

Native tools cover many common scenarios, but not every project fits neatly. Teams sometimes look at third-party tools when they have requirements the native tools do not cover, for example around reporting or work surrounding the migration. That is a requirements question, not a quality ranking. Check each tool's documentation for what it actually offers.

[ShareGate](https://www.m365.fm/entity/sharegate/) is a vendor of Microsoft 365 migration, consolidation and governance tools. Microsoft Learn also notes that third-party tools exist, ShareGate being one example. Others exist, and the right one depends on your scenario.

The [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/) is another option, though it is broader than a migration tool. According to the vendor's product page, it covers permission reports, oversharing and sharing link reports, broken link monitoring, content tools, metadata reports and scheduled exports, plus SharePoint-to-SharePoint migration. The page states that item IDs, version history and metadata are kept, with verification reports after the migration, and gives a throughput of 2 to 3 GB per hour. These are the vendor's own statements and were not tested by M365.FM. Cognillo sponsors M365.FM, so this section is sponsored content.

Note the scope: the product page describes migration from SharePoint to SharePoint. If your source is a file share or another cloud service, check whether the tool you are evaluating supports it. This applies to any tool on your shortlist.

## Compare tools on your requirements, not on feature lists

A long feature table is less useful than a short list of your own must-haves. A simple way to compare:

1. **Source and target support.** Does the tool handle your actual source, and your actual target?
2. **Preservation.** Are permissions, version history and metadata kept, and how is that verified? Look for reporting after the migration.
3. **Incremental runs.** Can you run a first pass, then a delta before cutover? Check the documentation of each tool rather than assuming.
4. **Roles and access.** Who needs which permissions to run it?
5. **Cost and licensing.** Vendors publish their own pricing models, which can change. Compare current figures directly on the vendor pages rather than from older articles. Some tools also offer free or limited editions; check whether their limits fit a pilot.
6. **Work around the migration.** Do you need reports on permissions, sharing links or broken links before or after the move? That may favour a tool that covers those tasks, or it may be better handled separately.

The last point deserves a moment. Migrations can bring up problems that were already there, such as broken links, overshared content or inconsistent permissions. Deciding whether to clean up before, during or after the move is a planning decision. Cleaning up first can mean less to migrate and fewer surprises, but it also delays the start. Any cleanup that deletes content or changes permissions should be tested on a pilot site first, with a backup or a way back.

## Run a pilot before the real move

Whatever tool you choose, test first. Pick a pilot site or a test tenant, migrate a small but representative slice of content, and compare the result with the source. Because migration copies rather than deletes, the source stays in place, but bulk operations, permission changes and any cleanup of the old location can still cause problems if done too early. Keep a backup and a documented way back before you switch users over or retire the source.

On the pilot, check at least:

- Do file counts and sizes match what you expected?
- Are version history and metadata present where you need them?
- Do permissions behave as intended for a few test users?
- Do links inside documents and pages still work, or do they point to the old location?
- How long did it take, and what does that mean for your cutover window?

Treat any speed figure, from a vendor or from documentation, as a rough indication. Real throughput depends on your network, the content and the source, so measure it on your own pilot.

## Practical takeaways

- Define source, scope and must-preserve items before you look at any tool.
- Check the native Microsoft options first: Migration Manager and SPMT, as documented on Microsoft Learn.
- Remember that migration copies content and does not delete the source, but do not retire the source until the result is verified.
- Rebuild classic SharePoint Server workflows as Power Automate flows rather than expecting them to carry over.
- Treat third-party tools such as ShareGate or the SharePoint Essentials Toolkit as options, and compare them on your own requirements, including which sources they support.
- Verify vendor claims about speed, features and prices yourself; they were not tested by M365.FM.
- Always pilot on a small slice, in a test site or tenant, and keep a backup and a way back.
