---
title: "Migration waves and cutover for SharePoint"
summary: "A SharePoint migration works best in sequenced waves with a planned cutover window. This article explains how to group content, rehearse, and switch users over with a way back."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [migration-cutover, migration-wave, sharepoint-migration]
faq:
  - q: "What is the difference between a migration wave and a cutover?"
    a: "A migration wave is a group of workloads or sites migrated together as one batch. The cutover is the moment users stop working in the old location and start working in the new one. A project usually has several waves, and each wave can have its own cutover."
  - q: "Are the source files deleted after a SharePoint migration?"
    a: "No. Microsoft Learn describes migration into SharePoint and OneDrive as copying content, and states that your source files are not deleted. Because of that, the old location can stay available as a way back until the new location is confirmed. Whether you make it read-only depends on your setup, so test it first."
  - q: "Which Microsoft tools can be used for SharePoint migration waves?"
    a: "Microsoft Learn names Migration Manager in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares, and the SharePoint Migration Tool (SPMT) for SharePoint Server 2010, 2013 and 2016. Third-party tools exist too. Check Microsoft Learn for the current state."
---

Moving content into SharePoint is rarely a single event. Most estates contain sites with different owners, different sizes and different tolerance for downtime. Treating all of it as one big move makes the plan fragile.

A calmer approach is to split the work into waves and give each wave its own cutover. This article explains how those two ideas fit together for a [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/), and what to prepare so the switch is routine rather than stressful.

## What a migration wave is, and what the cutover is

A [migration wave](https://www.m365.fm/entity/migration-wave/) is a group of applications and workloads migrated together. A large estate moves in sequenced batches, and the lessons from each wave carry into the next.

The [migration cutover](https://www.m365.fm/entity/migration-cutover/) is a different thing. It is the moment when users stop working in the old system or tenant and switch to the new one. It is typically scheduled for a quiet window such as a weekend.

Put simply: waves describe how you divide the work, and the cutover describes when people actually change where they work. A project with four waves usually has four cutovers, one per batch.

## Why copying changes the plan

Microsoft Learn describes SharePoint migration as moving content into Microsoft 365, meaning SharePoint and OneDrive, and stresses that migrating copies the files: "Your source files are not deleted."

This has practical consequences:

- The old location still exists after the copy, so you have something to compare against.
- You can run an initial copy well before the cutover and treat the cutover window as the point where users switch, not the point where all the data has to travel.
- A problem found after the switch does not automatically mean lost content, because the source is still there, provided you have not changed or removed it.

Do not rely on this alone. Whether a second copy, a read-only source or a backup is needed depends on your tool, your source system and your retention requirements. Check what your chosen tool does with changes made in the source after the first copy, and confirm it in a pilot before you depend on it.

## Choosing what goes into each wave

There is no single correct grouping. The common thread is to make the first wave small enough to learn from and representative enough to teach you something.

Imagine an organization with a file share, a Google Workspace environment and a few older SharePoint Server sites. A reasonable first wave might be one low-risk department with modest content and a willing owner. It can help surface problems such as naming, permissions or long paths before they affect many people.

Useful questions when assigning content to waves:

- **Who owns it?** Content with an active owner who can validate the result is a good early candidate.
- **How is it connected?** Sites that link to each other, or share a workflow, should move together or have a plan for broken links.
- **How much downtime can it take?** Business-critical libraries may need a tighter cutover window than an archive.
- **Does it depend on workflows?** Microsoft Learn says classic SharePoint Server workflows should be rebuilt as Power Automate flows. Those rebuilds take time and belong in the plan, not as a surprise during cutover.

Later waves can take the larger or more complex content, once the team has a repeatable routine.

## Tools and roles to line up before the first wave

Microsoft Learn names specific tools depending on the source. The Migration Manager in the SharePoint admin center covers sources such as Box, Dropbox, Google Workspace, Egnyte and file shares. The SharePoint Migration Tool (SPMT) covers SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages. The same page notes that the Mover tool is retired for admin-led migrations. Third-party tools exist too, for example ShareGate, and can be one option to evaluate next to the Microsoft tools. Tool capabilities change, so confirm the current state on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) before you commit.

Two further points from that documentation matter for wave planning:

- **Network limits.** For large amounts of data over a limited network connection, Microsoft names Azure Data Box. If bandwidth is your bottleneck, that affects how you size waves and when the initial copy can start.
- **Roles.** A role called Migration Administrator lets a migration team work without full SharePoint admin access. That is useful when an external or temporary team runs the waves and you want to keep their rights narrow.

If your project is a move between two Microsoft 365 tenants, that is a separate topic. It follows different rules and tooling, so do not assume the same plan applies.

## Running a cutover

A cutover is easier when most of the work is done before the window opens. A practical sequence looks like this:

1. **Rehearse on a pilot.** Run the migration for a representative site or library into a test location or pilot site. Check permissions, links, metadata and anything that depended on the old system.
2. **Define the freeze.** Agree when users stop editing in the old location. Tell them what to expect and who to ask.
3. **Run the final copy.** Capture changes made since the initial copy, using the method your tool supports.
4. **Validate.** The owner checks a short, agreed list: key documents open, permissions look right, links work, shared content is reachable.
5. **Switch users.** Update shortcuts, bookmarks, sync settings and any redirects you planned. Communicate that the new location is the one to use.
6. **Keep the way back.** Leave the source in place, ideally read-only, until the owner confirms the new location.

Several of these steps change access or move content at scale. Always test on a pilot site or test tenant first, and make sure you have a backup or another way back before you run anything against production. If you use PowerShell or bulk operations to change permissions or redirect users, the same rule applies: pilot first, with a rollback path.

Decide in advance what would cause you to stop. For example, if validation fails on a critical item, the agreed answer might be to keep users on the old location and reschedule. Having that decision made before the window removes pressure in the moment.

## Practical takeaways

- Treat waves as the way you divide work and the cutover as the moment users switch. Plan both.
- Use the fact that migration copies content: keep the source available as a way back until the owner confirms the result.
- Start with a small, representative first wave and write down what it teaches you before planning the second.
- Rebuild classic SharePoint Server workflows as Power Automate flows and schedule that work early.
- Check which tool fits each source on Microsoft Learn, and consider whether a third-party tool is worth evaluating alongside the Microsoft options.
- Consider the Migration Administrator role to keep a migration team's rights narrow.
- If bandwidth is limited, look at Azure Data Box as Microsoft describes it, and size waves accordingly.
- Rehearse every cutover on a pilot site or test tenant, with a backup or rollback path, and agree stop criteria before the window opens.
