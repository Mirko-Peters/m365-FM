---
title: "Keeping version history and metadata during a migration"
summary: "Version history and metadata do not always survive a SharePoint migration unchanged. Learn what to check in the source, which Microsoft tools to evaluate, and how to test a pilot library first."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [sharepoint-migration, sharepoint-managed-metadata, sharepoint-document-libraries]
faq:
  - q: "Are version history and metadata always kept when I migrate to SharePoint?"
    a: "It depends on the source, the tool and its settings. Migration copies content, and the source files are not deleted, but what carries over differs between file shares, other cloud services and SharePoint Server. Check the current Microsoft Learn documentation for your tool and verify the result in a pilot library."
  - q: "Should I migrate all old versions of every file?"
    a: "Not necessarily. Decide per content type which history has business or compliance value. Older versions can add volume and migration time. Document the decision, test it on a pilot library and confirm what your chosen tool supports before the main run."
  - q: "How do I check that metadata arrived correctly?"
    a: "Compare a sample of files between source and target: column values, created and modified information, and term-based columns. Check that the terms exist in the term store and that the target library's columns match what the source data needs. Do this in a pilot before the full migration."
---

A [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) can look finished when the last file has copied and the report shows no errors. The real test comes a week later, when someone opens a contract and cannot find its earlier versions, or filters a library by department and gets half the results.

Version history and metadata are the two things users notice most when they are missing. Both need decisions before the migration starts, not cleanup afterwards. This article walks through what to check and how to test it safely.

## What "migrating" actually means

Microsoft Learn describes SharePoint migration as moving content into Microsoft 365, meaning SharePoint and OneDrive. The content is copied, and the source files are not deleted. That is useful for planning: your source stays available as a reference while you verify the target.

It also means the target is a new place with its own structure. A file that was a plain document on a file share becomes an item in a [SharePoint document library](https://www.m365.fm/entity/sharepoint-document-libraries/), which has columns, views, versioning settings and permissions. How much of the original information fits into that structure depends on the source, the tool and the configuration.

Microsoft names different tools for different sources:

- **Migration Manager** in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares.
- **SharePoint Migration Tool (SPMT)** for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages.
- **Azure Data Box** for large amounts of data over a limited network connection.

Third-party tools such as ShareGate also exist. Whichever you evaluate, the questions in this article apply. Check the current Microsoft Learn page on [migrating to SharePoint](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) for the latest tool guidance, since tools and their status change over time (the Mover tool, for example, is described as retired for admin-led migrations).

## Version history: decide, then verify

Not every source has version history in the way SharePoint does. A file share typically holds one current file per path, perhaps with backups or "final_v2" naming habits. A SharePoint Server library may have a long list of major and minor versions. Other cloud services have their own version concepts.

So the first question is not "can the tool carry versions?" but "what history exists, and what do we need?" Consider asking:

- Which content has legal, contractual or audit value in its history, and which is only the latest state?
- Do users actually go back to old versions, or only to the current one?
- Is it acceptable to keep older versions in the source or an archive, and migrate only the current file?

Imagine a finance team library with signed agreements. Prior drafts may matter there. Now imagine a marketing library of working slide decks. The current version is probably what people need. Treating both the same wastes either safety or effort.

Whether and how a tool carries versions, and whether you can limit the number of versions, depends on the tool and its current version. Check the documentation for your chosen tool rather than assuming. Then confirm in a pilot: open a migrated file with a known history and look at its version history in the target library.

Also review the target library's own versioning settings before you migrate, so you know how versions will be handled once users start editing. Those settings live in the library, and your migration plan should not be the first time anyone looks at them.

## Metadata: prepare the target first

Metadata is where migrations most often disappoint, because a library can only hold values for columns that exist. If your source data carries department, document type or project information, the target library needs matching columns before files arrive.

Two kinds of information are worth separating:

- **System information** such as who created a file and when it was last modified. Whether this is preserved depends on the tool and its settings. Test it on sample files.
- **Business metadata** such as customer, contract type or status. This usually has to be mapped to columns in the target library on purpose.

For choice-style values that must stay consistent, [SharePoint managed metadata](https://www.m365.fm/entity/sharepoint-managed-metadata/) is the native option. It lets you define centrally managed term sets in the term store and use them in managed metadata columns across sites. That gives you one controlled vocabulary for tagging, navigation and search instead of free-text variations.

The practical consequence: **create or review your term sets before migrating.** If the source holds values like "HR", "Human Resources" and "Personnel", decide which term is correct and map the others to it. Otherwise you carry the inconsistency into the new environment, where it will affect filtering and search just as it did before.

Imagine a legal team library migrated from a file share where the folder name was the only metadata: `Contracts/Supplier/2022/ACME`. In the target, you might replace that folder path with columns for document type, party and year, with the party chosen from a term set. This needs a mapping plan, and someone to decide on the terms, but the resulting library is easier to filter than a deep folder tree.

Microsoft Learn has an overview of [managed metadata in SharePoint](https://learn.microsoft.com/en-us/sharepoint/managed-metadata) that covers the term store concepts.

## Plan the target library structure

Before you migrate, sketch the target document library as deliberately as the source. A few decisions have lasting effect:

- **Columns:** Which columns are required, which optional, which tied to a term set? Making a column required after files already exist can leave existing items without a value in that column.
- **Views:** If users used folders for navigation, provide views grouped or filtered by the new columns so the move feels like an improvement, not a loss.
- **Permissions:** Libraries support permissions at library, folder or file level. Migrating a source with complex folder permissions into one flat library can change who sees what. Decide whether to keep the same permission structure or simplify it. Changing or breaking inheritance affects access, so test it in a pilot site first (or a test tenant) and keep a record of the original permissions and a backup so you have a way back.
- **Limits:** Check the current SharePoint limits and restrictions on Microsoft Learn (for example for path length and file names), since source content can contain names or structures the target does not accept.

Where the source contains classic SharePoint Server workflows, Microsoft's guidance is to rebuild them as Power Automate flows. Those are not metadata or versions, but they often depend on both, so check that the columns your flow reads or writes exist in the target.

## Run a pilot and compare

A pilot is the cheapest safeguard you have. Create a test site or a clearly marked pilot library, migrate a representative sample, and compare source and target.

Choose files on purpose, not at random. Include:

- a file with a long version history,
- a file with unusual characters or a long path,
- items with every metadata column filled in, and some with gaps,
- content from different parts of the source, such as different departments.

Then compare, item by item:

1. Is the file complete and does it open?
2. Does the version history match what you decided to carry over?
3. Are created and modified details as expected for your tool and settings?
4. Are column values correct, and do term-based columns show valid terms?
5. Do users in a test group see only what they should?

Only after the pilot passes should you plan the main run. Because migration copies content and leaves the source files in place, you can fix mapping problems and run the sample again without losing the original. Keep it that way: do not delete or lock the source until users have confirmed the target. If a migration step or a PowerShell script changes data or access in the target, test it in a pilot site or test tenant first and make sure you have a backup or another way back, for example by being able to remove the pilot content and start over.

If you use a dedicated migration team, the Migration Administrator role lets them work without full SharePoint admin access, which keeps the pilot and the main run within a limited set of permissions.

## Practical takeaways

- Treat version history and metadata as planning topics, not afterthoughts.
- Ask what history each content area really needs, then check what your chosen tool supports in its current documentation.
- Prepare the target [document library](https://www.m365.fm/entity/sharepoint-document-libraries/) first: columns, views, versioning settings and permissions.
- Define term sets in the term store before migrating, and map inconsistent source values to agreed terms.
- Run a pilot with a deliberately varied sample and compare source and target item by item.
- Keep the source until the target is confirmed. Test any change to permissions or data in a pilot site first and have a way back.
- Recheck [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) before starting, because tool status and capabilities change over time.
