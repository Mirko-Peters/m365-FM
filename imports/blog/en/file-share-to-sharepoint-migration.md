---
title: "File share to SharePoint migration: a step-by-step plan"
summary: "File share to SharePoint migration in five phases: sort shares into OneDrive or SharePoint, scan and clean the source, pilot, run incrementally, then cut over."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-migration, sharepoint-document-libraries, sharepoint, onedrive]
keypoints:
  - "Microsoft's file share migration guide has five phases: planning, assess and remediate, prepare the target, migrate, and onboard users."
  - "Decide the destination for each share first: content owned by one person goes to OneDrive, team content goes to a shared library on a SharePoint site."
  - "Scan before you move anything. Migration Manager scans every file, even if you choose not to migrate, and checks access and known potential issues."
  - "Run a pilot with a small group, migrate incrementally in the background, then use a single cut-over so users do not edit duplicate copies."
  - "Permissions do not move one to one. Advanced NTFS permissions are removed and the most restrictive share or NTFS level decides the result."
faq:
  - q: "Which tool should I use to migrate a file share to SharePoint?"
    a: "Microsoft offers the SharePoint Migration Tool and Migration Manager. Migration Manager sits in the SharePoint admin center, uses agents on Windows machines you control, and spreads tasks across them. It supports file shares and needs SMB 2.0 or higher on the source. Choose it for larger projects with several servers, and the SharePoint Migration Tool for smaller ones."
  - q: "Should a file share go to SharePoint or OneDrive?"
    a: "It depends on who owns the content. Microsoft advises that a file belonging to a single user goes into that person's OneDrive, which is private by default. Content for team use and collaboration belongs in a shared library, where team members get default access. Home drives usually map to OneDrive and department shares to SharePoint."
  - q: "What is the largest file Migration Manager can move?"
    a: "Microsoft states that Migration Manager supports files up to 250 GB for file share to Microsoft 365 migrations. Other limits still apply at the destination, so run a scan before you start. Files that exceed SharePoint restrictions and limits are not migrated, so find them early and fix or exclude them."
---

A file share to SharePoint migration moves the content of a Windows file server into [SharePoint](https://www.m365.fm/entity/sharepoint/) sites and OneDrive accounts in your Microsoft 365 tenant. The safest plan has five phases: plan where each share goes, assess and clean the source, prepare the target, migrate in steps, and onboard end users with one cut-over. This guide is for migration leads who must turn a long list of shares into a [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) project they can explain to management and to users. It follows Microsoft Learn and adds a worked example with invented numbers.

## File share to SharePoint migration: the five phases

Microsoft's guide to how you migrate file shares, titled [migrating file shares to SharePoint and OneDrive](https://learn.microsoft.com/en-us/sharepointmigration/fileshare-to-odsp-migration-guide) names five phases. Plan the migration, assess and remediate the source, prepare your OneDrive and SharePoint environment, migrate, and onboard users. The guide says success depends on all five, not only on the copy.

Treat these as five lines on your project plan:

1. **Plan.** List every share, its owner and its size. Decide the destination for each one.
2. **Assess and remediate.** Scan the source, read the report and fix what blocks the copy.
3. **Prepare.** Create the sites and libraries, and make sure every user already exists in Microsoft 365. Microsoft says you must pre-provision users before you migrate.
4. **Migrate.** Start with a pilot, run incremental passes and finish with a final pass.
5. **Onboard.** Tell users what changes, train the help desk and switch everyone at once.

The content migration itself is the shortest part of the plan for most teams. Most of the work is deciding, cleaning and communicating.

## Where each share should go

Not every share belongs in SharePoint Online. Microsoft's guide asks one question: does the file belong to a single user, even if that person shares it with others? If yes, it goes into that person's OneDrive, which is private by default. If a file or folder is meant for team use and collaboration, it goes into a shared library, where team members have default access.

In practice:

- **Home drives** (one folder per person) map to [OneDrive](https://www.m365.fm/entity/onedrive/).
- **Department and project shares** map to a document library on a site for that team. A shared library is a [SharePoint document library](https://www.m365.fm/entity/sharepoint-document-libraries/) with its own permissions and sharing.
- **Archives** that nobody changes need a decision from the business: migrate, store elsewhere, or delete.

Microsoft's guide does not prescribe a mapping for home drives or department shares. It leaves that to your plan, so write the mapping down and have the business owners approve it.

## Assess and clean the source first

Scanning comes before moving. In the SharePoint Migration Tool, the guide points to the setting Only perform scanning, which produces assessment reports without copying. Migration Manager always scans, too. Microsoft's page on [how Migration Manager works](https://learn.microsoft.com/en-us/sharepointmigration/mm-how-it-works) says a scan runs on every file, even if you decide not to migrate your files. It checks access to the source and write access to the destination, and it looks for known potential issues.

Use the report to decide what to fix and what to leave behind. Microsoft's migration speed guide asks the same questions: what must be migrated, what can stay behind, and how many file versions to bring. The usual fixes are:

- **Old content.** Archive or delete what nobody has opened for years.
- **File names and path length.** Rename items that SharePoint does not accept, and shorten deep folder trees. Microsoft's remediation advice for long paths is to reorganize the file and folder structure and to split large drives into smaller, more focused ones.
- **Unsupported items.** Microsoft says some items are not migrated: Windows hidden attributes, explicit deny permissions, inaccessible or corrupted documents, and files or folders that exceed SharePoint limits.
- **Duplicate content.** One share is often a copy of another. Migrate it once.
- **Folder structure.** Flatten very deep trees and keep a clear top-level structure, so each document library has an owner and a purpose.

## Choose between the migration tools

Microsoft names two migration tools for file shares. The SharePoint Migration Tool (SPMT) scans and migrates from a Windows computer. [Migration Manager](https://learn.microsoft.com/en-us/sharepointmigration/mm-get-started) lives in the SharePoint admin center and uses agents. An agent is a lightweight service that you install on a Windows computer or virtual machine. It signs in to both the source and the destination, and Migration Manager hands tasks to the next free agent.

For the source, Migration Manager needs a server that supports SMB 2.0 or higher and Windows credentials with read access to the shares. For the destination, which can be a SharePoint site, a OneDrive account or a Microsoft Teams site, you need to be a Global admin or a OneDrive or SharePoint admin. The page says it supports files up to 250 GB for file share migrations, and that you can add a CSV file to create many user migrations at once.

Pick Migration Manager when you have many shares or several servers, because you can add more agents. Pick SPMT for a small, one-time job. Microsoft also lists FastTrack help for customers with 500 or more licenses, which performs data migration activities on their behalf.

## Example: sorting six shares

This example uses invented numbers. A company with 800 employees has six shares:

- **Home drives:** 800 folders averaging 12 GB, so 9,600 GB or about 9.4 TB. Destination: OneDrive.
- **Finance:** 600 GB of Office files. Destination: a Finance site library.
- **Sales:** 450 GB. Destination: a Sales site library.
- **Marketing media:** 1,800 GB of video and images. Destination: a Marketing site library, with a check of file sizes against the 250 GB limit.
- **Projects:** 700 GB in 40 project folders. Destination: one site per active project.
- **Archive:** 2,500 GB, untouched for three years. Destination: decision needed.

The total is 9,600 + 600 + 450 + 1,800 + 700 + 2,500 = 15,650 GB. Before any copying, the project lead asks the business about the archive. If the owners agree to delete or move 2,500 GB elsewhere, the migration shrinks by about 16 percent. The home drives are the bulk of the work at 61 percent. A pilot with 20 users covers 240 GB of those drives, which is enough to test speed and user messages.

## Pilot, incremental runs and the cut-over

Microsoft recommends a pilot with a small set of users to validate the process, including performance and user communication. The pilot should use an incremental method, in which migration happens in the background with no user impact. After the pilot, repeat incremental passes while people keep working on the old share.

At the end, Microsoft recommends a single cut-over event for all users, so nobody updates duplicate copies. On cut-over day:

1. Set the old share to read-only.
2. Run the final incremental pass.
3. Check the report for failed items.
4. Publish the new locations.
5. Keep the old share available for reading for an agreed period.

Tell users before the cut-over that content already in their OneDrive is safe and is not overwritten. Train the help desk before the event, as Microsoft advises. Say clearly whether people can opt out, because Microsoft's guide lists that as a point to communicate.

## Timing, throttling and speed

Plan the heavy passes for evenings and weekends. Microsoft's [migration performance guide](https://learn.microsoft.com/en-us/sharepointmigration/sharepoint-online-and-onedrive-migration-speed) says tighter throttling limits apply to background apps such as migration tools during weekday daytime hours, and that throughput is highest during off-peak hours. It also says throttling rules cannot be disabled or suspended, and that a support ticket does not lift them.

The same page gives best practices for the migration process. The typical bottleneck is reading from the source, so check disk performance, memory and antivirus load on the file server and the agent. Larger files and larger numbers of files in a task migrate faster than many small ones, and parallel tasks against different site collections improve throughput. Microsoft advises against queuing more than 5,000 migration jobs at once. For a rough duration, see our separate article on how long a SharePoint migration takes.

## Common mistakes

- **Starting with the copy.** Plan the destinations and scan the source first.
- **Moving everything to SharePoint.** Personal content belongs in OneDrive.
- **Expecting permissions to move unchanged.** Advanced NTFS permissions are removed, and the most restrictive share or NTFS level decides the result.
- **Skipping the pilot.** A pilot shows speed and user problems while the risk is small.
- **Several cut-overs.** Users end up with duplicate copies and lose track of the latest version.

## How software can help

Microsoft's own SharePoint Migration Tool and Migration Manager cover the copy, the scan and the reports. PowerShell can list folder sizes, file counts and the longest paths before you scan. For tracking, one sheet with share, owner, size, destination, wave and status is enough. Third-party migration products exist as well. Compare them against the same checklist: scan quality, permission handling, reporting and incremental passes.

## Next step

Make the list of your shares this week, with owner, size and destination for each. Then run a scan on one share to see what a file share to SharePoint migration will really involve.
