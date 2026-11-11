---
title: "What to clean up before you migrate"
summary: "Migrating to SharePoint copies everything you bring along, including clutter and orphaned sites. This guide shows what to review, archive or retire before the move starts."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [sharepoint-migration, orphaned-sites, content-lifecycle-management]
faq:
  - q: "Does a SharePoint migration delete the source files?"
    a: "According to Microsoft Learn, migrating copies the files into SharePoint and OneDrive in Microsoft 365, and the source files are not deleted. That makes cleanup a separate decision: you choose what to bring along and what to retire at the source once the migration is verified."
  - q: "Why should I deal with orphaned sites before a migration?"
    a: "Orphaned sites have no active owner, so nobody can confirm whether their content is still needed. If you migrate them anyway, you copy content and permissions that nobody is responsible for. Assigning an owner first, or deciding to archive or retire the site, avoids that."
  - q: "Which tools does Microsoft name for SharePoint migration?"
    a: "Microsoft names Migration Manager in the SharePoint admin center for sources such as file shares, Box, Dropbox, Google Workspace and Egnyte, and the SharePoint Migration Tool (SPMT) for SharePoint Server 2010, 2013 and 2016. Third-party tools exist too. Check Microsoft Learn for the current state."
---

A migration is often planned as a technical project: pick a tool, map the sources, schedule the cutover. The content itself gets less attention. That is a missed opportunity, because a [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) copies whatever you point it at. Microsoft Learn is explicit that the source files are not deleted, so the old problems do not stay behind on their own. They travel along.

This article looks at what is worth reviewing before you start: what you are really moving, who owns it, how old it is and who can access it. It does not replace the Microsoft documentation, so check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) for the current state of tools and limits.

## Understand what a migration actually does

According to Microsoft Learn, SharePoint migration means moving content from file shares, other cloud services or older SharePoint Server versions into SharePoint and OneDrive in Microsoft 365. The content is copied. The source stays as it is.

That has two consequences. First, you have a way back: the original is still there while you verify the result. Second, the migration itself does not decide what should happen to the source afterwards. If you skip that decision, you end up with two copies and no clear answer about which one is the real one.

Microsoft names several tools depending on the source:

- **Migration Manager** in the SharePoint admin center, for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares.
- **SharePoint Migration Tool (SPMT)**, for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages.
- **Azure Data Box**, which Microsoft names for large amounts of data over a limited network connection.

Third-party tools such as ShareGate exist as well. Whichever you use, the tool moves what you select. It does not judge whether the content is still useful.

## Take inventory before you decide anything

You cannot clean up what you have not seen. A useful first step is a simple inventory of the source: locations, rough size, who uses them and who is responsible for them.

Imagine a file share with a top-level folder for each department. One department has a clear owner who can say which subfolders are active. Another has folders named after projects that ended years ago, and nobody on the current team recognises half of them. These two folders need different handling, and you only see the difference if you look.

Questions that help sort the inventory:

- Is there a named person who can decide what stays?
- Is the content still used, or only kept "just in case"?
- Does the content contain sensitive information that needs special handling in the target?
- Is it a duplicate of something that already exists in Microsoft 365?

Keep the inventory readable. A spreadsheet with a location, an owner, a proposed action (migrate, archive, retire) and a status is often enough. Its purpose is to force a decision for every location before the migration starts.

## Deal with ownerless content and orphaned sites

[Orphaned sites](https://www.m365.fm/entity/orphaned-sites/) are SharePoint or Teams sites that no longer have an active owner, typically because the original owner left the organization. The content and permissions stay in the tenant, but nobody is responsible for them.

This matters for a migration in two ways. If the orphaned site is part of the source, nobody can tell you whether it should move. If it already sits in your Microsoft 365 tenant, it may be a target or neighbour of your migration, and its unclear permissions may affect how you plan access.

A practical approach:

1. List sites and shares without a confirmed owner.
2. Try to assign a current owner who can decide what happens next.
3. If no one takes responsibility, decide who in IT or governance makes the call.
4. Record the decision: migrate, archive or retire.

Imagine a team site for a project that finished two years ago, where the only owner has left the company. Migrating it unchanged would copy a site nobody can vouch for. Asking a former project member or a department lead to confirm "archive" or "delete" can help you avoid carrying it forward.

If any of these decisions involve deleting content or changing who has access, test the approach on a pilot site or in a test tenant first, and make sure you have a backup or another way back. Retiring a source location is not something to do before you have verified the migrated copy.

## Apply content lifecycle thinking to what moves

[Content lifecycle management](https://www.m365.fm/entity/content-lifecycle-management/) means managing documents through defined stages of creation, review, archiving and deletion, with owners, review dates and expiration rules so that outdated content does not linger. You do not need a complete lifecycle programme to benefit from the idea before a migration.

A migration is a natural review point. Ask of each major content area:

- **Active:** used regularly, owned, belongs in the new structure.
- **Reference:** rarely changed but still needed. It may belong in a clearly marked, read-only or lightly accessed location.
- **Archive:** needed only for retention or history. Consider whether it should be migrated at all, or stored elsewhere under your retention rules.
- **Expired:** no business or legal reason to keep it. Check your retention requirements before anyone deletes anything.

Be careful with the last category. Retention and legal obligations differ by organisation and content type, so confirm with the people responsible for compliance before you treat anything as expired. If deletion is on the table, test on a pilot first and keep a backup.

The value of doing this before the move is that you set up the new environment with rules from day one. Owners are named, review dates exist and expiration is considered, instead of building a fresh pile of undefined content.

## Check permissions, structure and legacy features

Old environments accumulate permission exceptions. A file share may have folders where access was granted to individual people years ago. Moving those as they are can reproduce the complexity in the new place.

Before you migrate, look at:

- **Access patterns:** Can groups replace individual assignments? Are there folders that only one person can open for no clear reason?
- **Structure:** Does a deep folder hierarchy fit how people work today, or would several sites or libraries be a better fit? File paths and structure are worth reviewing against the limits in Microsoft's documentation.
- **Legacy workflows:** Microsoft Learn states that classic SharePoint Server workflows should be rebuilt as Power Automate flows. Make a list of existing workflows and decide which are still needed.
- **Classic pages and customisations:** Microsoft names SPMT for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages, but it is still worth asking whether anyone uses them.

Changing permissions or breaking inheritance can affect who can see content, so plan those changes carefully, try them on a pilot site first, and keep a record of the original state so you can return to it.

Also consider who runs the migration. Microsoft Learn describes a Migration Administrator role that lets a migration team work without full SharePoint admin access. Assigning the right role is designed to give the project team the access it needs without full SharePoint admin rights.

## Practical takeaways

- Remember that migration copies; the source remains. Decide separately what happens to the source after you verify the result.
- Build an inventory of locations with an owner, a proposed action and a status.
- Identify ownerless content and orphaned sites early, and get a decision on each before migration.
- Use a simple lifecycle view (active, reference, archive, expired) to decide what actually needs to move, and confirm retention requirements before treating anything as expired.
- Review permissions, structure and legacy workflows, and plan to rebuild classic workflows as Power Automate flows where they are still needed.
- Test cleanup and migration steps on a pilot site or test tenant, and keep a backup or a way back before deleting or changing access.
- Check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) for current tool capabilities, since they change over time.
