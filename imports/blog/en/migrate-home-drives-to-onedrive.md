---
title: "Moving home drives to OneDrive: a rollout plan that keeps users calm"
summary: "Migrate home drives to OneDrive in waves: copy the H drive with Migration Manager, move known folders, retire the old mapping, brief users and the help desk."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [onedrive, onedrive-sync-engine, sharepoint-migration, microsoft-365-admin-center]
keypoints:
  - "Personal home drive content belongs in the user's OneDrive, which is private by default, while shared team content belongs in shared libraries."
  - "Known Folder Move covers Desktop, Documents, Pictures, Screenshots and Camera Roll, and it does not work for folders still redirected to a non-OneDrive location."
  - "Microsoft describes a three-step path for network share redirection: copy with Migration Manager, disable Folder Redirection, then enable Known Folder Move."
  - "Microsoft recommends rolling out Known Folder Move slowly and limiting the upload rate of the sync app for users with many files."
  - "Run a pilot, migrate in waves, make one cut-over, and brief the help desk before users see the change."
faq:
  - q: "What is the difference between Known Folder Move and Folder Redirection?"
    a: "Folder Redirection points Windows folders to a network location, usually a file share. Known Folder Move redirects Desktop, Documents, Pictures, Screenshots and Camera Roll to the user's OneDrive. Microsoft states that Known Folder Move policies do not work while those folders are redirected to a non-OneDrive location, so you disable Folder Redirection first."
  - q: "How do I move an H drive on a file share to OneDrive?"
    a: "Microsoft describes three steps for folders redirected to a network share. Use Migration Manager to copy the share contents into the user's OneDrive folders, without preserving file share permissions if Migration Manager creates the folders. Then disable Folder Redirection, leaving the content on the share, and enable Known Folder Move so the folders merge."
  - q: "Can I roll out Known Folder Move to everyone at once?"
    a: "Microsoft recommends rolling it out slowly. For the prompt policy it suggests no more than 5,000 devices a day and 20,000 a week across macOS and Windows. For silent moves on existing devices the figures are 1,000 a day and 4,000 a week. For users with many files, temporarily limit the sync app upload rate."
---

To migrate home drives to OneDrive without a revolt, treat it as a user project rather than a file copy: copy each home drive into the person's OneDrive in planned waves, move the known folders, switch off the old drive mapping at one clear date, and tell users and the help desk what will happen before it happens. This guide is for the migration lead who owns a Windows Server file server full of H drives and needs a rollout plan for the move from the file server to OneDrive. A bulk migration of many home folders needs a plan, not a script. This guide covers the target model, the Microsoft tools, the limits that pace the waves, and a worked example.

## How to migrate home drives to OneDrive: the target model

A home drive holds personal content: documents, desktop files, scans, and sometimes things that were never meant to be shared. Microsoft's [file share migration guide](https://learn.microsoft.com/en-us/sharepointmigration/fileshare-to-odsp-migration-guide) recommends that personal content goes to [OneDrive](https://www.m365.fm/entity/onedrive/), the product many admins still call OneDrive for Business, which is private by default, and that team content goes to shared libraries. A home drive is therefore the simplest part of a file server migration, as long as you resist the urge to sort every file.

Set the rules before you start:

- **Everything in the user's home folder (the H drive) goes to the owner's OneDrive.** No sorting by the migration team.
- **Shared content found in H drives is the exception.** Ask users to move it to a team site themselves after the migration, and publish a short guide.
- **The old drive becomes read-only at cut-over,** and stays available for a defined period.

## Prepare accounts, clients and the migration tool

Three things must be in place before the first wave:

1. **Users exist in your Microsoft 365 tenant and are licensed.** Microsoft's guide advises pre-provisioning users before the migration, so that every OneDrive can be provisioned in time.
2. **The sync app, the OneDrive client, is current.** Microsoft advises upgrading to the latest build before you deploy Known Folder Move. Known Folder Move does not work for users who sync OneDrive files in SharePoint Server.
3. **The source is readable.** Microsoft's migration tool options are the SharePoint Migration Tool (SPMT) and Migration Manager. Migration Manager works with agents and migration tasks, stages data in Azure Blob Storage on its way into OneDrive, and can take a CSV file with many users in one migration task. The migration agent needs a service account with read access to the shares, and the agent machine must reach the source over SMB. Microsoft's Migration Manager overview lists global admin or OneDrive and SharePoint admin roles for the person who sets up the tasks in the [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/) and SharePoint admin center.

Also clean up what you can. Remove temporary files, old installers and duplicate backups from the H drives, because every gigabyte you do not copy shortens the waves.

## Known Folder Move, Folder Redirection and GPO settings

The [OneDrive sync app](https://www.m365.fm/entity/onedrive-sync-engine/) can take over the well-known Windows folders. Microsoft's page on [redirecting known folders to OneDrive](https://learn.microsoft.com/sharepoint/redirect-known-folders) says Known Folder Move (KFM) covers Desktop, Documents, Pictures, Screenshots and Camera Roll. The Documents folder is the one most people care about. Music and Videos are not affected and can stay on Folder Redirection. There are two main OneDrive policy settings:

- **Prompt users to move Windows known folders to OneDrive.** Users see a prompt, and a reminder stays in the activity center until all folders are moved. Microsoft recommends it for existing devices, with at most 5,000 devices a day and 20,000 a week across macOS and Windows.
- **Silently move Windows known folders to OneDrive.** The folders move without user interaction. Microsoft recommends it for existing and new devices, with at most 1,000 existing devices a day and 4,000 a week.

Known Folder Move does not work if Documents, Pictures or Desktop are redirected to a non-OneDrive location with Windows Folder Redirection, and extending OneDrive with Folder Redirection is not supported.

### From a network share to OneDrive using Migration Manager

For a folder redirected to a network file share, Microsoft describes three steps in the migration process:

1. Use Migration Manager to copy the share contents into the user's OneDrive Documents, Pictures or Desktop folders. If Migration Manager creates those folders, do not select Preserve file share permissions.
2. Disable Folder Redirection, leaving the content on the share.
3. Enable Known Folder Move. The folders move to OneDrive and merge with the migrated content.

The data migration itself and the client policy are two separate jobs. Microsoft says the policies can be set with Group Policy, Intune administrative templates or registry settings, so you can manage the GPO settings in the same way as other user policy settings. The same page recommends a slow rollout and, for users with many files, temporarily limiting the upload rate of the sync app to a percentage of throughput, then removing the limit after the uploads finish.

## Plan the waves

The number of users per wave depends on upload capacity, not on tool limits. Microsoft's Migration Manager page on speed explains that the typical bottleneck is reading the source, so disk, memory, antivirus and network at the source decide the pace. Throttling can also slow background apps during business hours, and Microsoft states that evenings and weekends allow higher throughput.

A workable plan has four parts:

- **Pilot:** 20 to 50 users from IT and friendly departments, one week, with a feedback channel.
- **Waves:** equal groups, scheduled for the end of the working week so the bulk of the upload runs overnight and on weekends.
- **One cut-over per wave:** after the final incremental copy, set the home share to read-only and enable Known Folder Move.
- **Buffer:** one empty week at the end for stragglers, absent users and failed items.

Microsoft's migration guide also recommends a single cut-over event, which applies to any [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/), so that users do not update duplicate copies.

## Example: 600 users, 6 waves

This example uses invented numbers. A company has 600 users, and the home drives average 8 GB, which is 4.8 TB in total. The migration lead plans waves of 100 users.

- **Data per wave:** 100 × 8 GB = 800 GB.
- **Upload rate:** the agent's usable uplink is assumed at 25 MB/s, which is about 90 GB per hour. One wave then needs 800 ÷ 90 ≈ 9 hours of pure transfer.
- **Planning factor:** the lead allows two days per wave to cover scans, retries and throttling.
- **Schedule:** 6 waves × 2 days = 12 working days, plus a one-week pilot and a one-week buffer, so about five working weeks in total.
- **Policy pacing:** 100 devices per wave is far below the 1,000 devices a day that Microsoft recommends for silent moves, so the policy is not the limit. The uplink is.

The numbers show where to look when the schedule slips: the source reads and the uplink, not the number of users.

## Communicate before, during and after

Users stay calm when they know what to expect. Send three messages: before the wave, on cut-over day and a week later. State the date, what changes, where the files will be, what to do if something is missing, and who to call. Microsoft's guide notes that existing OneDrive content is not overwritten, so reassure users who already use OneDrive. Train the help desk before the first wave, as the guide recommends, and give it a list of the most common questions: where did my H drive go, why is my desktop slow in the first hours, and how do I share a file with a colleague?

Tell users who offer to migrate data themselves to wait for their wave, because two copies of the same files cause confusion. Keep the old share read-only for a defined period, for example 30 days, so that nobody feels trapped.

## After the cut-over

Watch the first days closely. Check the migration reports for failed items and send each affected user a short list of what could not be copied and why, because names, characters and paths that break the rules are the usual cause. Check that Known Folder Move reports a healthy state on the devices of the wave, and that the old mapping and the Folder Redirection policy are gone, not just hidden. Then close the wave in your tracker, record the lessons, and adjust the next wave. Small corrections between waves, such as a better message or one more FAQ entry, cost little and save many calls.

## Common mistakes

- **Sorting files for users.** It takes months and nobody thanks you.
- **Enabling Known Folder Move while Folder Redirection is active.** The policy does not work in that case.
- **Starting all users at once.** Uploads saturate the uplink and the help desk.
- **Skipping the pilot.** The pilot shows the errors that you can still fix cheaply.
- **Cutting over without a read-only share.** Users keep saving to the old drive and the copies diverge.

## How software can help

Migration Manager in the SharePoint admin center, the SharePoint Migration Tool for some cases, a little PowerShell for reports, and the Known Folder Move policies, set with Group Policy or Intune, cover the core of this project. A spreadsheet with users, sizes and waves, plus a status column, is enough to track it. Judge any additional tool by whether it reports per-user results and failed items, because those reports tell the help desk what to say.

## Next step

Export the size of every home drive this week and divide the users into waves by total size and upload capacity. That plan is the backbone of your effort to migrate home drives to OneDrive.
