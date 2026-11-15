---
title: "Migrating permissions to SharePoint: what to keep, map or drop"
summary: "Plan how to migrate permissions to SharePoint: which NTFS rights the tools carry over, which you map to groups, and which you drop before the cut-over."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-migration, sharepoint-permissions, least-privilege, permission-inheritance]
keypoints:
  - "Migration tools translate NTFS rights to SharePoint permission levels, but advanced NTFS permissions are removed and explicit deny entries are not carried over."
  - "Users must exist in the target tenant, so synchronize the directory with Microsoft Entra ID before you migrate, or files fall back to the default permissions of the target."
  - "A library or list can hold up to 50,000 unique security scopes, but Microsoft recommends staying under 5,000 for good performance."
  - "Keep access that is based on groups and real business need, map it to a few SharePoint groups, and drop individual entries, duplicates and deny rules."
  - "Review the permission inventory with the data owners before the cut-over, because the migration is the cheapest moment to apply least privilege."
faq:
  - q: "Does SharePoint keep NTFS permissions after a migration?"
    a: "Only in a translated form. Microsoft's migration guidance maps Full control to Full control, Modify and Write to Contribute, and Read and execute, List and Read to Read. Advanced NTFS permissions are removed, explicit deny entries are not carried over, and the stricter of the share and NTFS level wins."
  - q: "What happens if a user does not exist in the target tenant?"
    a: "The Migration tool can only assign permissions to users who exist in the target. Microsoft advises synchronizing your Active Directory with Microsoft Entra ID first. Without a user mapping, migrated files receive the default permissions of the destination, so the original access is not reproduced and must be reviewed afterward."
  - q: "How many unique permissions can a SharePoint library hold?"
    a: "Microsoft states that a library or list cannot have more than 50,000 unique security scopes and recommends fewer than 5,000 per library for migration. Each time inheritance is broken, a new scope is created. A folder with more than 100,000 items also cannot break its inheritance."
---

To migrate permissions to SharePoint without carrying over years of clutter, keep access that is group-based and still needed, map it to a small set of SharePoint groups, and drop individual entries, duplicates and deny rules. This article is written for the migration lead who moves an on-premises file server to SharePoint Online in a Microsoft 365 tenant and must decide what the target should look like. You will see what the tools translate, which limits shape the design, and how to sort every folder into keep, map or drop.

## How to migrate permissions to SharePoint: the three decisions

Every access rule on the source ends up in one of three buckets.

- **Keep:** the rule describes a real business need, it uses a group, and it can be reproduced in SharePoint. Example: the Finance group can edit the Finance library.
- **Map:** the rule is valid, but the source model does not exist in the target. NTFS levels, share-level permissions and local server groups all need a SharePoint equivalent.
- **Drop:** the rule is outdated, duplicated, based on a single person, or cannot be expressed. Example: an explicit entry for a colleague who left two years ago.

The point of the exercise is [least privilege](https://www.m365.fm/entity/least-privilege/). A move from a file server to SharePoint is the best chance to reset access, because permissions on a file server grow over decades and a migration that copies everything faithfully also copies every mistake. Treat the move as the one moment when owners are willing to answer questions, because they want their data to arrive.

## What the tools carry over

Microsoft's [file share migration guide](https://learn.microsoft.com/en-us/sharepointmigration/fileshare-to-odsp-migration-guide) and the article on [understanding permissions when migrating](https://learn.microsoft.com/en-us/sharepointmigration/understanding-permissions-when-migrating) describe what the SharePoint Migration Tool (SPMT) and Migration Manager do with access rules. Both are meant for moving content to SharePoint and OneDrive. The main points:

- Permissions are migrated at user level for Read, Write and Full control. Write becomes Contribute.
- When the share permission and the NTFS permission differ, the more restrictive level is applied.
- All advanced NTFS permissions are removed, and explicit deny entries are not migrated.
- The mapping is Full control to Full control, Modify to Contribute, Read and execute, List and Read to Read, and Write to Contribute.
- Users must exist in the target. Microsoft advises synchronizing Active Directory with Microsoft Entra ID before you start.
- Without a user mapping, migrated files receive the default permissions of the target. A setting called Preserve user permissions controls whether existing permissions are replaced or added to.

In practice, this means the tools translate the simple cases and silently flatten the complicated ones. A folder that relied on a deny entry will arrive more open than before, unless you redesign it. That is the main risk, and it is why you inventory first.

## Limits that shape the design

Permission design in the target is bounded by numbers. Microsoft's [migration permission guidance](https://learn.microsoft.com/en-us/sharepoint/dev/apis/migration-perm-guidance) lists them:

- A library or list cannot have more than 50,000 unique security scopes. For migrations, Microsoft recommends fewer than 5,000 per library.
- The maximum number of role assignments per security scope is 5,000.
- A library or list with more than 100,000 items cannot have permission inheritance broken on the list itself, and permission changes then fail with a throttling error.

Each time you break [permission inheritance](https://www.m365.fm/entity/permission-inheritance/) and grant a new user or group access, a new scope is created. The page on [managing permission scope](https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope) adds that sharing 10,000 files one by one costs 10,000 scopes, while sharing one folder costs one. It also notes that moving individually shared files into a common folder does not restore inheritance on its own. The lesson for the migration: every folder with its own permissions is a cost, so use unique permissions only where the business need justifies it.

## Sort each folder: keep, map or drop

Work from a permission inventory, not from the folder tree. Export the access control list of every folder that differs from its parent. Folders that simply inherit need no decision.

1. **Keep** the top-level rules that grant a department group access to its own area. They map cleanly to a SharePoint site or library.
2. **Map** NTFS levels to the SharePoint levels listed above, and map local groups to groups that exist in your directory.
3. **Drop** entries for users who left, entries that duplicate the parent, and entries for accounts that no longer resolve.
4. **Redesign** every explicit deny. A deny usually means that one broad group has access and a few people must be excluded. Replace it with an allow rule for the people who should have access, or move the sensitive content into its own library or site.
5. **Isolate** truly restricted content, such as HR files, in a separate site or library instead of a deep folder with unique permissions. A separate container is easier to audit.

For [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) in the target, prefer groups over individuals. People change roles often, and a group means you change one membership instead of hundreds of folder entries.

## Example: Finance share with 312 explicit folders

This example uses invented numbers. A Finance share contains 4,200 folders. The inventory shows 312 folders whose access list differs from the parent.

- **190 folders** repeat the parent's groups with a different order. These are duplicates and are dropped.
- **70 folders** have entries for single people, mostly former project members. After checking with the owners, 66 are dropped. Four remain valid and are mapped to a Finance project group.
- **40 folders** contain deny entries. The owner explains that 30 of them exist only because a contractor group once had access. That group is gone, so the deny entries are dropped. The other 10 are redesigned as allow rules.
- **12 folders** hold payroll and audit material with a real restriction. They are moved into a separate library with its own owners group.

The result: 190 + 66 + 30 = 286 entries disappear, 4 + 10 = 14 become group-based rules, and 12 folders move into their own container. The Finance library ends with about 15 unique scopes (the root plus 14 group-based folders), and the new payroll library has its own small set. Both are far below the recommended 5,000 and nowhere near the 50,000 maximum. The target is also easier to explain, because there are a handful of groups rather than 312 exceptions.

The numbers add up, but the real work in such a project is the conversation with the owners of the 70 person-based folders. Plan time for it.

## Plan the migration steps

1. **Inventory** folder permissions on the source and record owner, groups, entries and deny rules.
2. **Clean up** the source or the plan: remove dead accounts and agree the keep, map and drop decisions with the owners.
3. **Prepare the target:** create each SharePoint site or document library, create the groups, and make sure all users are synchronized to Microsoft Entra ID.
4. **Pilot** with a small group of users and one share. Compare access for five sample users on the source and in the target.
5. **Migrate incrementally**, then run one cut-over so that people do not edit duplicate copies, as Microsoft's file share guide recommends.
6. **Validate** access after the migration with a list of test accounts and spot checks, and keep the inventory as evidence. Treat this post-migration check as part of the migration process, not as an optional extra.

Brief the service desk before the cut-over, as the Microsoft guide suggests for the whole migration. Give the team the list of keep, map and drop decisions, so that a call such as "I can no longer open the old project folder" can be answered quickly. Tell users in the announcement that access was reviewed, that some old entries were removed on purpose, and whom to ask when they need access. This keeps the clean-up from looking like a fault.

Put the permission model into your [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) plan as its own work package. It often takes longer than the file transfer itself.

## Common mistakes

- **Copying everything faithfully.** Years of clutter arrive in the new tenant, and the 5,000 scope recommendation is exceeded quickly.
- **Forgetting that deny entries disappear.** Content that was protected by a deny can be open to everyone with access to the parent.
- **Migrating before users are synchronized.** Without the user in the target, the tool cannot assign the permission.
- **Using individuals instead of groups.** Every staff change then becomes a permission project.
- **Skipping validation.** If nobody compares real access before and after, errors are found by users, not by you.

## How software can help

A short PowerShell script can export folder access lists from the file server into a spreadsheet, together with metadata such as owner and last modified date. Microsoft's migration tools scan for known issues and report what they could not carry over, so use their reports as a checklist. Whatever tool you choose, check that it shows deny entries and unresolved accounts, because those are the cases that silently change access.

## Next step

Export the folder access lists of one file share this week and count the folders with explicit entries, deny rules and single-person entries. Bring that list to the data owners, because the decisions they make there define how you migrate permissions to SharePoint.
