---
title: "Fix SharePoint permissions in bulk from a report, not item by item"
summary: "Fix SharePoint permissions in bulk: export a report, mark each row keep, remove or reset, test a PnP PowerShell script on one site first, then verify."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, sharepoint-reporting, sharepoint-essentials-toolkit, pnp-powershell]
keypoints:
  - "To fix SharePoint permissions in bulk, start from a report: every change in a script should trace back to one row that a person has marked keep, remove or reset."
  - "Microsoft's site sharing report lists every unique file, user, permission and link, but it leaves out Anyone links and the individual people inside SharePoint groups."
  - "Three PnP PowerShell cmdlets cover most bulk fixes: Remove-PnPGroupMember, Set-PnPListItemPermission and Remove-PnPSiteCollectionAdmin."
  - "Resetting an item to inherit permissions from its list removes its unique permissions and is often the cleanest fix for permission creep."
  - "Test the script on one site, keep a log of every change, and run a second report afterwards to prove that the problem is gone."
faq:
  - q: "How do I change SharePoint permissions for many items at once?"
    a: "Export a permissions report, mark the rows to change, and run a script that reads that list. With PnP PowerShell, Set-PnPListItemPermission adds or removes a role on an item, and its -InheritPermissions switch resets the item to its list's permissions. Test on one library first and log every change."
  - q: "How do I remove a user from many SharePoint sites?"
    a: "Run a report of what the person can access, then remove them where they are a direct member of a SharePoint group with Remove-PnPGroupMember, and where they are a site collection administrator with Remove-PnPSiteCollectionAdmin. Check Microsoft 365 group membership separately, because that is managed outside the site's own groups."
  - q: "Does the SharePoint sharing report show everything?"
    a: "No. Microsoft says the report lists every unique file, user, permission and link on a site, but it does not include Anyone links, links that were emailed and never clicked, or the individual users inside SharePoint groups. A site admin runs it from Site usage, and the CSV is saved to a location they choose."
---

To fix SharePoint permissions in bulk, you export a report of who has access, mark each row as keep, remove or reset, and then run a script that reads your decisions. This guide is for SharePoint admins who face hundreds of items with unique permissions and do not want to click through them one by one. You will see how to build the decision list, which PnP PowerShell cmdlets do the work, what the Microsoft report leaves out, and how to test, log and check a run. A worked example with made-up numbers shows the full cycle.

## Why item-by-item fixing fails

Most [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) problems build up slowly. Someone shares a single file with a colleague. Someone else chooses to break permission inheritance on a folder for a project that ended long ago. After a few years, some document libraries hold hundreds of items with unique permissions, and nobody can say which ones still matter.

Fixing these one at a time has three problems. It is slow. It is easy to miss items. And it leaves no record of what you changed, so you cannot undo a mistake or answer an auditor.

A bulk fix flips the order. First you collect the facts in a report. Then a person decides. Only then does a script act, and it acts only on rows that have a decision. That keeps the speed of automation and the care of a manual review.

## How to fix SharePoint permissions in bulk: five steps

Follow these steps in order.

1. **Export the facts.** Create a report for the site. Microsoft's guide to the [file and folder sharing report](https://learn.microsoft.com/en-us/sharepoint/sharing-reports) says a site admin runs it from **Settings, Site usage**, in the **Shared with external users** section, with **Run report**. You choose where to save the CSV, and you get an email when it finishes.
2. **Add a decision column.** Open the CSV in Excel and add a column with three allowed values: keep, remove, reset. Add a second column for the reason. Ask the site owner to review the rows that you cannot judge yourself.
3. **Write the script around the decisions.** Read the file with `Import-Csv`, loop over the rows, and run one cmdlet per decision type. Skip every row with no decision.
4. **Test on one site, then one library.** Run the script on a test site or a single library first. Compare the result with what you expected.
5. **Check with a second report.** After the real run, create the report again. The rows you removed should be gone, and the rows you kept should be unchanged.

Do not skip step 2. A script is only as safe as the list it reads.

## How permission inheritance works before you reset anything

Microsoft's support page on [customizing permissions for a SharePoint list or library](https://support.microsoft.com/office/customize-permissions-for-a-sharepoint-list-or-library-02d770f3-59eb-4910-a608-5f84cc297782) explains that folders, lists and documents normally inherit permissions from the site that contains them. To give a list or library its own permissions, an owner chooses Stop Inheriting Permissions, and the items below it then inherit the new settings. To go back, the Permissions tab offers Delete unique permissions, which removes the custom permissions you set.

Three warnings from the same page matter for bulk work:

- **The 100,000-item limit.** You cannot break or restore inheritance on a list, library or folder that holds more than 100,000 items. A single file in a large library can still have its inheritance broken.
- **Removing a user reaches child items.** Removing a user or group also removes them from child items, including those with broken inheritance, and restoring them is not possible. Read your log before you run a removal.
- **Limited access stays.** A person with whom only one item was shared gets limited access to the site, and unsharing the item does not take that away.

Microsoft recommends SharePoint groups and calls item-level permissions supported within reasonable use. Our own rule of thumb is to assign access through a group, not to individual users, so that site permissions stay readable and fewer unique permissions are left to fix.

## Which cmdlet fixes which problem?

[PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/) has cmdlets for most bulk fixes. These three come up most often.

**Remove a person from a SharePoint group.** The reference for [Remove-PnPGroupMember](https://pnp.github.io/powershell/cmdlets/Remove-PnPGroupMember.html) shows the syntax: `Remove-PnPGroupMember -LoginName user@company.com -Group 'Marketing Site Members'`. Use it for group membership problems, such as a leaver who is still in a Members group.

**Change or reset permissions on an item.** The reference for [Set-PnPListItemPermission](https://pnp.github.io/powershell/cmdlets/Set-PnPListItemPermission.html) lists these options:

- `-AddRole` and `-RemoveRole` add or remove a permission level for a user or a group on one item. Use `Get-PnPRoleDefinition` to see the available roles.
- `-ClearExisting` removes all existing permissions on the item before the new role is added.
- `-InheritPermissions` resets the item so that it inherits permissions from its list and removes its unique permissions.
- `-SystemUpdate` changes permissions without creating a new version or triggering Power Automate.

Resetting is often the cleanest fix. If an item only has unique permissions because someone shared it once, a reset returns it to the rules of the library.

**Remove a site collection administrator.** The reference for Remove-PnPSiteCollectionAdmin shows `Remove-PnPSiteCollectionAdmin -Owners "user@contoso.onmicrosoft.com"`. Administrators that you do not name keep their access. A list of users can also be passed in.

To replace one user with another, run two steps: add the new person where the old person had access, then remove the old person. Do the add first, so nobody loses access in between.

## What the report does not show

A report is a start, not the full truth. Microsoft's sharing report page states what the CSV excludes:

- Individual users inside SharePoint groups. The group appears, but not its members.
- Links that were emailed but never clicked.
- Anyone (anonymous) links.

This has real consequences. If your goal is to find where a person has access, the report will show the group, so you must read the group's members separately. If your goal is to remove public sharing, the report will not list Anyone links at all, so you need another source, such as the Data access governance reports in the SharePoint admin center. Those need SharePoint Advanced Management, according to Microsoft.

For a single SharePoint site in SharePoint Online, also review the site permissions and the permission levels in use under Site settings before you touch items. Then check [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) options for the whole tenant, not only one site. A per-site CSV does not scale to hundreds of sites.

For Microsoft 365 group-connected sites, group membership is managed through the group, not in the site's own groups. A script that edits site groups will not fix a person who is in the Microsoft 365 group.

## Make the script safe to run

A bulk script can do a lot of damage in a short time. Build in these protections before the first real run:

1. **Add a dry-run switch.** Your own script can take a `-DryRun` parameter that prints each planned action and changes nothing. Review that output with the site owner.
2. **Log before you change.** For each row, write the old state to the log first: the item path, the user, and the permission level, such as Full Control, Edit or Read. That log is your way back.
3. **Work in batches.** Run 50 items, check them, then run the next 500. A small first batch catches a wrong assumption early.
4. **Keep the original report.** Store the CSV with your decisions and the log in a folder that only site owners can open. Microsoft suggests the same for the report itself, because it lists who has access to what.
5. **Change group membership in a separate run.** Fix item permissions in one run and group membership in another, so you can check each kind of change on its own.

## Example: cleaning up one document library

The numbers are made up.

A project site has one document library. The report has 620 rows. After sorting, an admin and the site owner mark them:

- 410 rows: keep. These are the normal group-based permissions.
- 150 rows: reset. They are single files with unique permissions from old shares.
- 40 rows: remove. They give a former contractor direct access.
- 20 rows: unclear. They go back to the owner with a question.

The admin writes a script with two branches. The reset branch runs `Set-PnPListItemPermission` with `-InheritPermissions` for each file. The remove branch runs `Remove-PnPGroupMember` for the contractor in the groups where they appear. The script writes one log line per action: the date, the item, the old state and the new state.

First, the admin runs the script on a copy of the library with 20 rows. The result matches the plan. The full run takes one evening. A second report shows 410 plus 20 rows, which is what the admin expected. The log is saved next to the report, so anyone can see what happened.

## Common mistakes

- **Running a script without a decision list.** You cannot explain later why an item changed.
- **Resetting inheritance on a library where unique permissions are intended.** Some folders are restricted on purpose. Mark them as keep.
- **Trusting the report as complete.** It leaves out Anyone links and members of SharePoint groups.
- **Removing before adding.** When you replace one user with another, add first.
- **Granting access person by person.** Assign permissions through a group, not to one user per item, so the next review is shorter.
- **Forgetting the Microsoft 365 group.** A person can keep access through group membership even after you clean the site.
- **No log and no second report.** Without them, you cannot prove the fix or undo it.

## How software can help

Start with tools you already have. The site sharing report and the admin center reports give you the facts. PnP PowerShell makes the changes, and a spreadsheet holds the decisions and the log.

Some third-party tools combine reporting and fixing in one screen. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). According to the vendor's product page, it offers permission reports for sites, folders and items, shows everything one person can access, replaces one user with another, and fixes permissions and sharing links from reports. The vendor also says reports and tasks can be scheduled and exported. These are the vendor's statements and were not tested by M365.FM. The manual route above works without any of these tools.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Pick one site with a known permission problem, run the sharing report, and add a decision column to the CSV. Then use that list to fix SharePoint permissions in bulk on a test library first, and keep the log.
