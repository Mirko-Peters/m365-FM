---
title: "Coexistence while you migrate"
summary: "Migration coexistence keeps old and new environments linked while users move in batches. This article explains what to plan, what to test, and how SharePoint content migration fits into a phased move."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [migration-coexistence, sharepoint-migration]
faq:
  - q: "What is migration coexistence?"
    a: "Migration coexistence is a phase in which the old and new environments, for example two Microsoft 365 tenants, run side by side and are linked. Mail and collaboration keep working while users move in batches, so the business does not have to switch everyone on a single day."
  - q: "Does a SharePoint migration delete the source files?"
    a: "No. Microsoft Learn describes SharePoint migration as copying content into SharePoint and OneDrive in Microsoft 365 and states that your source files are not deleted. That means the source stays available during a coexistence phase, but you still need a plan for which copy is authoritative."
  - q: "Which Microsoft tools support SharePoint migration?"
    a: "Microsoft Learn names Migration Manager in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares, and the SharePoint Migration Tool (SPMT) for SharePoint Server 2010, 2013 and 2016. Third-party tools exist too. Check Microsoft Learn for current details."
---

A migration to Microsoft 365 is rarely a single event. Users, mailboxes and content move in stages, and for a while some people work in the new environment while others still work in the old one. That in-between period needs deliberate planning.

This article looks at **migration coexistence**: what it means, what usually has to keep working during it, and how content moving into SharePoint and OneDrive fits into the picture.

## What migration coexistence means

[Migration coexistence](https://www.m365.fm/entity/migration-coexistence/) is a migration phase in which the old and new environments run side by side and are linked. An example is two Microsoft 365 tenants. The link exists so that mail and collaboration keep working while users move in batches.

The idea is simple: instead of switching everyone on one day, you move groups of users over time. During that time, people in different batches still need to reach each other and work together.

Coexistence is not a product you switch on. It is a phase with a start, an end and a set of agreements about how the two sides behave in between. What exactly has to be linked depends on your scenario, for example a move between tenants or a move from an on-premises environment. Check Microsoft Learn for the documentation that matches your situation.

## Why a big-bang cutover is not always an option

A single cutover is attractive because it is short. It also concentrates risk: if something goes wrong, everyone is affected at once.

Batches spread that risk. A pilot group moves first, problems surface on a small scale, and later groups benefit from what was learned. Coexistence is what makes this approach possible, because the business keeps running while the move is in progress.

Imagine a company with several departments. A small pilot team goes first. Their feedback shapes the instructions for the next departments. The most business-critical teams move last, when the process is better understood. None of this works unless the teams can still send mail to each other and find shared information throughout.

## What should keep working during coexistence

Define, before the first batch, what "keeps working" means for your organization. A practical checklist of questions:

- **Mail and calendars:** Can users in different batches still communicate and schedule meetings with each other?
- **Finding people:** Can users still look up colleagues regardless of which side they are on?
- **Shared files and sites:** Where do users find the content they need, and do links they already use still lead somewhere useful?
- **Identity and access:** Do people sign in the way they expect, and is access to content consistent on both sides?
- **Support:** Does the help desk know which batch a user belongs to and what that user can currently do?

The answers differ by scenario, so treat the list as a starting point. For the technical details of linking environments, rely on the Microsoft Learn documentation for your specific migration type rather than on assumptions.

## Where SharePoint migration fits in

Content is often the part users notice most. [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) means moving content from file shares, other cloud services or older SharePoint Server versions into SharePoint and OneDrive in Microsoft 365. Microsoft Learn is explicit about one point: migrating copies the files, and your source files are not deleted.

That has a direct consequence for coexistence. As long as the source stays in place, there are two copies. If users keep editing in the old location after the copy was made, the new location is already out of date. If they start editing in the new location while others still use the old one, the two diverge.

So agree on a rule for each content area:

1. When is the content copied?
2. From which moment is the new location the only place to edit?
3. What happens to the old location, for example read-only access, and when?

Setting a source to read-only or restricting access changes who can do what, so test that on a pilot area first and make sure you have a way back before applying it broadly.

### Tools named by Microsoft

Microsoft Learn names several options for moving content into Microsoft 365:

- **Migration Manager** in the SharePoint admin center, for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares.
- **SharePoint Migration Tool (SPMT)**, for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages.
- **Azure Data Box**, named for large amounts of data over a limited network connection.

The same page notes that the Mover tool is retired for admin-led migrations. Third-party tools exist as well, for example ShareGate. Tool capabilities and availability change, so confirm the current state on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) before you choose.

Two further points from the documentation are relevant for planning. Classic SharePoint Server workflows should be rebuilt as Power Automate flows rather than expected to carry over as they are. And a role called Migration Administrator lets a migration team work without full SharePoint admin access, which helps keep permissions narrow during the project.

A note on scope: moving between two Microsoft 365 tenants is a separate topic from the scenarios above. According to the SharePoint migration page on Microsoft Learn, moving OneDrive content between tenants was possible with PowerShell at the time of checking, and a cross-tenant SharePoint solution was in private preview. Any PowerShell that moves content should be tested first in a test tenant or pilot, with a backup or way back in place. Because this changes over time, verify the current status before you rely on it.

## Communication and ownership

Technical linking is only half of coexistence. The other half is that people need to know what is happening to them.

Tell each batch, in plain language and ahead of time:

- When their move happens and what changes for them.
- Where to work afterwards, and where not to.
- What to do if something looks wrong, and whom to ask.

Also decide who owns decisions during the phase. Someone should be able to say whether a batch goes ahead, pauses or rolls back. Without a named owner, small issues turn into long discussions while two environments keep running side by side, which costs effort and creates confusion.

## Practical takeaways

- Treat coexistence as a planned phase with a start, an end and clear rules, not as a side effect of migrating.
- Define what "keeps working" means for mail, calendars, people lookup, files and access before the first batch.
- Remember that SharePoint migration copies content and, per Microsoft Learn, does not delete the source. Decide which copy is authoritative and from when.
- Start with a small pilot group and use what you learn for later batches.
- Test any change to access or any bulk action, such as making a source read-only, on a pilot area first, and keep a backup or another way back.
- Check the current Microsoft Learn documentation for your scenario and your tooling, since capabilities and previews change.
- Name an owner for go, pause and rollback decisions, and give every batch clear, early communication.
