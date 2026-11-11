---
title: "Post-migration checks: a validation list"
summary: "A post-migration validation list for SharePoint: confirm content, check permissions and sharing, find broken links and rebuilt workflows, and keep the source intact until sign-off."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [sharepoint-migration, sharepoint-broken-links, sharepoint-permissions]
faq:
  - q: "Are the source files deleted when a SharePoint migration finishes?"
    a: "No. According to Microsoft Learn, migrating copies the files and the source files are not deleted. That is a useful safety net: you can compare source and target and keep the source untouched until your checks are complete and the business has signed off."
  - q: "Do links keep working after content has been migrated?"
    a: "It depends on the link. Links that point to the old location do not automatically point to the new one, and embedded addresses inside documents, pages and web parts are usually not rewritten. Check a sample of links in each content type and look at Microsoft Learn for what your migration tool handles."
  - q: "What happens to classic SharePoint Server workflows after migration?"
    a: "Microsoft Learn says classic SharePoint Server workflows should be rebuilt as Power Automate flows. So after a migration, list every workflow that existed in the source, rebuild the ones still needed, and test each flow with realistic data before users depend on it."
---

A migration tool reporting "completed" tells you that a job ran. It does not tell you that people can work in the new place. Post-migration validation closes that gap: you check that content, access, links and automations behave the way the business expects.

This article gives you a validation list you can adapt. It is built around [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) into SharePoint and OneDrive in Microsoft 365, and it points to Microsoft Learn wherever behaviour depends on your tooling or tenant settings.

## Start with the safety net: the source is still there

Microsoft Learn describes SharePoint migration as moving content into Microsoft 365, meaning SharePoint and OneDrive, and stresses that migrating copies the files: "Your source files are not deleted."

That sentence shapes the whole validation phase. As long as the source stays untouched, you have a baseline to compare against and a way back if something turns out wrong. So agree on one rule before you start checking: the source is not retired, archived or switched to read-only without a decision, and that decision comes after the checks below.

Also note which tool did the work, because it affects what you validate. Microsoft names the Migration Manager in the SharePoint admin center for sources such as Box, Dropbox, Google Workspace, Egnyte and file shares, and the SharePoint Migration Tool (SPMT) for SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages. Read the report your tool produces and treat every warning or skipped item as a work item, not as noise.

If you can, run your first validation on a pilot site or a test tenant. Findings from a pilot are cheap. The same findings after a full cutover are not.

## Check content: did everything arrive, and in usable form?

Begin with the basics, because they are the easiest to measure.

- **Structure:** Do the sites, libraries and folder hierarchies match the plan? Imagine a file share with a folder per department. Check that each one landed in the intended library, not merged into a single one by accident.
- **Completeness:** Compare item counts and a sample of files between source and target. Use the tool's report as a starting point, then spot-check manually, especially the largest folders and the oldest files.
- **Opening files:** Open a sample of each file type in the target. Files that depend on external references, such as spreadsheets with links to other workbooks, deserve extra attention.
- **Metadata and dates:** If your project promised to preserve authors, modified dates or column values, verify a sample against the source. Whether a given tool keeps them depends on the tool and its settings, so check the documentation of the tool you used.
- **Unusual names and paths:** Very long paths, special characters and unsupported file types are common causes of skipped items. Look for them in the migration report and decide per item: rename, fix, or accept.

Keep a short log of what you found and what you did about it. When a user later asks "where is my file?", that log is your first stop.

## Check permissions: the new site must not be wider or narrower than intended

Access is where a technically successful migration can still fail the business. A file share and SharePoint model access differently, so do not assume the old permissions map one to one.

Start from how [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) work, as described on Microsoft Learn:

- Team sites are by default connected to a Microsoft 365 group. The group owners become site owners and the group members become site members.
- Communication sites are not connected to a Microsoft 365 group and use the standard SharePoint groups Owners, Members and Visitors.
- On a team site, those groups carry the permission levels Full Control (Owners), Edit (Members) and Read (Visitors).
- A Microsoft 365 group has no view-only access. People who should only read must be added directly to the Visitors group.
- Permissions on a site give access to all content in it. Single files and folders are shared through sharing links of three types: Anyone, People in your organization and Specific people.

Now turn that into checks. Imagine a project folder on a file share that only five people could open. After migration it sits in a library of a team site with fifty members. Nothing failed technically, but the audience grew tenfold. For each migrated area, ask who could access it before, who can access it now, and whether the difference is intended.

Also review sharing: whether links were carried over at all depends on the tool, so check the documentation of the tool you used. External sharing is only possible on a site if it is allowed at organization level first. Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible and advises against nested security groups because they can cause performance problems.

A caution on fixing what you find: changing permissions, removing access or breaking inheritance can lock people out or expose content. Do it first on a pilot site or test tenant, record the current state so you can restore it, and make changes in small, documented steps rather than in bulk.

## Check links and references: address changes do not fix embedded URLs

Migration changes where content lives, and anything that stored the old address can stop working. This is the area of [broken links in SharePoint](https://www.m365.fm/entity/sharepoint-broken-links/), and it is easy to underestimate.

Microsoft Learn explains the behaviour for site address changes, which is a good model for what can go wrong generally. SharePoint creates a redirect at the previous address, so saved favorites and links to the site are forwarded, and sharing links redirect automatically. But embedded addresses are not updated: in Microsoft's words, "Any embedded URLs in any SharePoint web parts (News, List, etc.) won't be updated and may break." Further, a redirect stays until someone deletes it, and after deletion requests to the old address are no longer forwarded.

Apply that to your validation list:

- **Pages and web parts:** Open migrated pages and click through News, Quick Links, List and other web parts that contain addresses.
- **Documents:** Check a sample of Word, Excel and PowerPoint files that link to other files, such as a workbook that references another workbook or a document with hyperlinks to a former file share path.
- **Navigation and hub sites:** Check site navigation, and note that Microsoft Learn says a site must be connected to its hub site again after an address change and that a hub site cannot be renamed this way.
- **Old bookmarks and shortcuts:** Test a few that users actually have. Decide how long the old location, or any redirect, must stay available, and write that date down.

Microsoft's pages on changing site addresses and site redirects describe when links break, but they do not describe a general tool for finding broken links across SharePoint Online. For a systematic scan you will need a script of your own or a vendor tool; vendors such as [Cognillo](https://www.cognillo.com/) offer their own tools for finding broken links. Evaluate whatever you choose on a test site first.

## Check workflows, forms and customisations

Automations are the quiet casualties of migrations, because nobody notices them until a process stops.

Microsoft Learn says classic SharePoint Server workflows should be rebuilt as Power Automate flows. For an address change it adds that Power Apps custom forms must be recreated, SharePoint 2013 workflows must be republished, and custom solutions keep their old address dependencies. Use this as a prompt, even if your migration is not an address change: anything that stores an address or runs on the source platform needs a deliberate check.

Build a simple inventory from the source: every workflow, custom form, approval process, scheduled task and integration that touched the migrated content. For each one record whether it is still needed, who owns it, how it was rebuilt, and who tested it. Test with realistic data in a pilot site, not with the live library.

## Close out with people, not just tools

Technical checks tell you the content is there. Users tell you whether it works.

Ask a few real users per team to perform their normal tasks in the new location: find a file, edit it, share it, open an old link. Collect what they report in one place and triage it.

Then set an exit criterion for the source. Microsoft states that source files are not deleted, so the removal of the source is always your decision. Make it explicit: who signs off, on what evidence, and what the way back is if a late problem appears.

## Practical takeaways

- Treat the migration report as the start of validation, not the end. Every warning is a work item.
- Keep the source untouched until sign-off. Microsoft Learn confirms migration copies files and does not delete the source.
- Compare structure, counts and samples of files and metadata between source and target.
- Review who has access before and after. Check team site, group and Visitors membership, and sharing links, against what the business intended.
- Test links in pages, web parts and documents. Embedded addresses are not updated automatically.
- Inventory workflows and custom forms, rebuild what is still needed, and test each with realistic data.
- Try every change that touches access or content on a pilot site or test tenant first, with a backup or a documented way back.
- Close with user acceptance and a written decision about when the source is retired.

For the exact behaviour of your tool and tenant, check [Microsoft Learn](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) before you rely on any assumption in this list.
