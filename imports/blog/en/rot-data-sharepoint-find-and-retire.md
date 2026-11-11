---
title: "ROT data in SharePoint: how to find and retire redundant, outdated files"
summary: "ROT data in SharePoint is redundant, outdated or trivial content. Learn how to find it with built-in reports, decide what to retire and archive it safely."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [content-lifecycle-management, sharepoint, copilot-grounding, sharepoint-essentials-toolkit]
keypoints:
  - "ROT stands for redundant, outdated and trivial content, and the cheapest first step is to find whole inactive or ownerless sites rather than single files."
  - "Microsoft's content management assessment reports inactive sites with no activity in 180 days, sites with no or one owner, broken inheritance and open sharing."
  - "Microsoft says Copilot and agents work best when content is up to date and well governed, so stale content weakens the answers they give."
  - "Archiving is not deletion: archived sites keep content, permissions and metadata, but users cannot open them until they are reactivated."
  - "Check retention before you retire anything, because archiving changes storage and access and does not replace retention requirements."
faq:
  - q: "What is ROT data in SharePoint?"
    a: "ROT stands for redundant, outdated and trivial content. Redundant means copies or duplicates, outdated means content that is no longer correct or needed, and trivial means content with no business value. It sits in old sites, forgotten libraries and personal copies. Finding it starts with inactive sites, ownerless sites and storage reports."
  - q: "How do I find inactive SharePoint sites?"
    a: "Run the content management assessment in the SharePoint admin center under Advanced Management. Microsoft says its inactive sites report covers sites with no activity in the past 180 days, and the reports can take 2 to 72 hours. You can also create an inactive site policy that notifies owners and can set silent sites to read-only or archive them."
  - q: "Is archiving the same as deleting SharePoint content?"
    a: "No. Microsoft says an archived site moves to an archive storage tier, no longer uses active SharePoint storage quota, and keeps its content, permissions and metadata. Users cannot open it until it is reactivated. Archiving also does not replace retention requirements, so check legal and policy holds before you archive."
---

ROT data in SharePoint is content that is redundant, outdated or trivial. You find it by looking first for whole sites that nobody owns or uses, then for old files inside active sites, and you retire it by archiving or deleting in a safe order. This article is for Microsoft 365 admins who want a repeatable cleanup instead of a one-off purge. You will learn what ROT means, why it matters for Copilot, which built-in tools find it, and see a worked example with invented numbers.

## What is ROT data, and why does it matter now?

ROT stands for redundant, outdated and trivial. The three words describe different problems:

- **Redundant:** copies and duplicates of the same file, in several libraries or in personal folders.
- **Outdated:** content that was right once and is wrong or unused now, such as last year's price list.
- **Trivial:** content with no lasting business value, such as drafts, test files and old exports.

ROT costs storage, and it costs trust. Duplicate and obsolete files pile up in Microsoft 365, and the share of ROT in a tenant tends to grow when nobody owns the cleanup. People find old files in search and use them by mistake. Since Copilot answers from your content, which is the idea behind [Copilot grounding](https://www.m365.fm/entity/copilot-grounding/), old files can also shape its answers. Microsoft's guidance on [getting ready for Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/get-ready-copilot-sharepoint-advanced-management) says that Copilot and agents work best when your content is up to date and well governed. It also says site lifecycle policies help ensure that Copilot and agentic experiences reference current content, and that they can reduce storage costs.

Reduce ROT early, because the older a stale file is, the less anyone remembers its business value. Good [content lifecycle management](https://www.m365.fm/entity/content-lifecycle-management/) therefore has two goals: less clutter for people and better source material for Copilot.

## Where do you start looking?

Start with whole sites, not single files. A single run of a report finds hundreds of [SharePoint](https://www.m365.fm/entity/sharepoint/) sites faster than a review finds hundreds of files.

Microsoft's page on the [content management assessment](https://learn.microsoft.com/en-us/sharepoint/content-management-assessment) describes a built-in feature of SharePoint Advanced Management. It runs a set of reports across the organization and shows the findings in a dashboard with recommended steps. The reports are:

- **Inactive sites:** sites with no activity in the past 180 days.
- **Site ownership:** sites with no owners or only one owner.
- **Broken inheritance:** sites where permission inheritance is broken.
- **Unrestricted internal sharing:** content shared with Everyone except external users.
- **Unrestricted sharing via links:** content shared through overly permissive links.

To run it, sign in to the SharePoint admin center, select Advanced Management, and then Start assessment. The reports take 2 to 72 hours, depending on tenant size, and they take no action without your consent. Microsoft's Copilot readiness page suggests rerunning the assessment every 30 days. Check the prerequisites page for licensing, because the assessment page does not list it.

The page does not mention large files, file versions or storage use. For those you need other reports, such as the storage views in the admin center, or a metadata report from a script or tool.

## How do you retire sites that nobody uses?

Microsoft's lifecycle policies give you three building blocks. According to its page on [site lifecycle management](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management), they do not delete sites directly. They notify site owners and administrators and take actions based on your configuration.

- **Site ownership policy:** helps ensure that sites have the required number of owners, for example at least two.
- **Inactive site policy:** finds sites that are not active for a period you set, and asks owners to confirm that the site is still in use.
- **Site attestation policy:** asks owners to confirm periodically that a site is still needed.

The inactive site policy can run in simulation mode, which runs once and generates a report, or in active mode, which runs on a schedule. If owners do not respond after several notices, the policy can do nothing, set the site to read-only, or archive it after a read-only period using Microsoft 365 Archive. Start with simulation, read the report with a few owners, and only then switch on enforcement.

Microsoft's Copilot page states what archiving does. An archived site moves to an archive storage tier and no longer uses active SharePoint storage quota. Its content, permissions and metadata are preserved. Users cannot access it until it is reactivated, and Copilot is not trained on archived content.

## What about old files inside active sites?

Site-level cleanup is simple. File-level cleanup is harder, because every library has its own habits. Microsoft's page on the [inactive files policy](https://learn.microsoft.com/en-us/microsoft-365/archive/manage-inactive-files?view=o365-worldwide) describes a way to archive eligible files by their last access date. The page says that the policy covers SharePoint sites only, and that archiving changes storage and access state but does not replace retention requirements.

Key details from the page:

- The last access date records when a human last accessed a file. AI agent, application, script and system access do not update it.
- The threshold ranges from 6 to 48 months, with a default of 24 months.
- Updates to the last access date can take up to 30 days.
- Human access before July 2025 might not have been captured, so a file can look inactive for longer than it was.
- The page gives a public preview planned for October 2026 and general availability planned by the end of 2026. These dates are targets and may change, so check the current status.
- The preview supports PowerShell only, and the policy has a simulation mode controlled by the IsWhatIfMode setting.

Retention policies decide what must stay, so involve records managers before you classify data as trivial or redundant. A short data classification of the top libraries, with labels such as keep, review and delete, makes later steps easier. Treat the simulation result as an estimate. The page warns that an empty report or a zero count is not proof that the full scope was evaluated.

Retention and deletion belong in the same plan. Microsoft's Purview page on data risk assessments lists a retention policy as one possible fix: for content that has not been accessed for at least 3 years, Microsoft Purview Data Lifecycle Management can delete it automatically. That fits trivial data on your list, but only after legal and records managers confirm the retention rules, because deletion is the one step you cannot reverse. Treat such rules as part of your data governance for SharePoint Online and Microsoft 365 Copilot readiness, and add one line to your best practices: archive first, delete last.

## What is a safe order of work?

Use a fixed order so that every step is reversible until the last one.

1. **Check retention and holds.** Ask legal and records managers what must stay. Archiving does not replace retention.
2. **Run the assessment and sort the findings.** Separate ownerless sites, inactive sites and active sites with old content.
3. **Ask the owners.** A short list per owner, with a deadline and a default action.
4. **Simulate.** Run the inactive site policy in simulation mode and review the report.
5. **Set read-only.** Use read-only as the first enforcement step, so people can still ask for changes.
6. **Archive.** After the read-only period, archive the site. Content and permissions stay.
7. **Delete only with approval.** Deletion comes last, and only for content that has no retention need.
8. **Repeat.** Run the assessment again after 30 days and then on a schedule.

## Example: 400 sites and a six-month plan

The numbers are invented to show the method. A company has 400 SharePoint sites. The content management assessment shows 85 inactive sites with no activity in 180 days, 60 sites with no owner or one owner, and 22 sites with broken inheritance. Some sites appear in more than one list.

The admin does the following:

1. Asks legal for any retention needs. Legal names 9 inactive sites with holds.
2. Starts an inactive site policy in simulation mode for all sites. The report confirms the 85 sites.
3. Sends owners a notice. 31 owners certify that their site is still needed. 54 do not respond.
4. Activates the policy with read-only enforcement. 54 sites go read-only. 9 of these have holds, so the admin excludes them and handles them with legal.
5. After a three-month read-only period, 45 sites are archived.

Count the result: 85 inactive sites become 31 certified, 45 archived, 9 on hold. The company also assigns owners to 40 of the 60 sites with weak ownership. Active storage drops, and Copilot has fewer old sites to draw on. No file was deleted without an owner decision.

## Common mistakes

- **Deleting first.** Archive and read-only steps give you a way back.
- **Ignoring retention.** Archiving does not replace retention requirements.
- **Starting with files.** Start with sites. File-level work comes later.
- **Trusting one simulation.** Treat results as estimates and check with owners.
- **No owners in the loop.** Owners know whether a site still matters.
- **One-off purge.** ROT returns. Schedule the assessment.

## How software can help

Start with the content management assessment, site lifecycle policies and Microsoft 365 Archive. For file-level work across many sites, a reporting tool can add detail. Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is one example. According to its product page, it offers metadata reports that list items, files, folders and pages with sizes and version counts, a report on outdated content with open access, and scheduled reports that can be exported to Excel or CSV. These are the vendor's statements and M365.FM did not test them. Other tools and scripts can do similar work, so compare them with the built-in reports first.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Run the content management assessment this week and list the inactive and ownerless sites. Pick the ten oldest, ask their owners for a decision, and start your ROT data cleanup in SharePoint with them.
