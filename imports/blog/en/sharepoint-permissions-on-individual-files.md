---
title: "Item-level permissions in SharePoint: when to use them and when not"
summary: "SharePoint permissions on individual files are possible but costly. See how item-level permissions work, when they pay off, and which options are safer."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, permission-inheritance, permission-debt, least-privilege]
keypoints:
  - "Item-level permissions work by stopping inheritance on one file or folder, so that item no longer follows changes made to its parent."
  - "Microsoft calls breaking inheritance discouraged but supported within reasonable limits, and advises using sharing methods for individual files and folders."
  - "Use item-level permissions for a few sensitive items. Use a separate folder, library or site when the same restriction applies to many items."
  - "Every item with its own permissions adds a permission scope, which makes audits harder and moves a library toward the recommended limit of 5,000 scopes."
  - "Before you restore inheritance, remember it removes all custom permissions on the item, and removing a person from a parent also removes them from all children."
faq:
  - q: "Can you set permissions on a single file in SharePoint?"
    a: "Yes. Sharing a file with a person who has no access automatically stops inheritance for that file, and the file then has its own permissions. You can also stop inheritance by hand in the library settings. It works, but Microsoft discourages broad use and recommends sharing methods for single files."
  - q: "Is breaking permission inheritance bad practice?"
    a: "Microsoft says breaking inheritance is discouraged but supported within reasonable use limits. A few well-documented cases are fine. Problems start when hundreds of items carry their own permissions, because audits get slow, reviews miss exceptions and the library moves toward the recommended limit of 5,000 unique permission scopes."
  - q: "How do you restore inheritance on a SharePoint item?"
    a: "On the item's permissions page, select Delete unique permissions and confirm. The item then inherits from its parent again. This removes all custom permissions on the item, so write down who had access first. The status line should read that the item inherits permissions from its parent."
---

SharePoint permissions on individual files are possible, but they are an exception tool. SharePoint Online allows granular control down to a single file, but granular control has a cost. Use it for a small number of sensitive items. When the same limit applies to many items, move them into their own folder, library or site instead. This article is for site owners who are asked, "Can you give only these three people access to this one file?" You will learn how item-level permissions work, a short test for when they are justified, the safer options, and how to undo them.

## How do item-level permissions work?

[SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) flow downward by default. A file inherits permissions from its folder, the folder from its library, and the library from its site. When you stop inheritance on a file, it gets its own list of who can do what. This is called unique permissions, and it creates a new permission scope.

There are two ways to get there. The first is on purpose: open the item's permissions and choose **Stop Inheriting Permissions**. Microsoft's article on [customizing permissions for a list or library](https://support.microsoft.com/en-us/sharepoint/lists/sharepoint-sharing-and-permissions/customize-permissions-for-a-sharepoint-list-or-library) describes the steps for lists and libraries, and the same logic applies to items. The second is by accident: sharing an individual item breaks inheritance for that item automatically. After that, changes to the parent no longer apply to it.

That last point is the heart of the matter. Suppose a folder is open to the finance group, and a file inside it has unique permissions. If you later remove a person from the folder, the file does not follow the change in the way you may expect. The file has its own list.

Microsoft's position is clear. Breaking inheritance is discouraged but supported within reasonable limits. For single files or folders, Microsoft advises using the sharing methods in Microsoft 365, because they are easier to administer.

## When are SharePoint permissions on individual files justified?

Use this four-question test before you break inheritance on an item.

1. **Is it only a few items?** One to ten sensitive files in a large library can justify unique permissions. Hundreds cannot.
2. **Is the audience small and stable?** A fixed group of three people is easy to describe. A changing list of 40 is not.
3. **Is it temporary?** Item-level access for a one-off review is fine if you plan the date you will undo it.
4. **Would a separate place be too heavy?** If a new library for two files is clearly overkill, item-level access is reasonable.

If you answer no to the first two questions, create a separate place. A new folder with its own group, a separate library or a separate site gives you one scope that is easy to review. Compare that with 40 files, each with its own list.

The reason is audit cost. Each item with its own list is an exception that someone must remember. This is how [permission debt](https://www.m365.fm/entity/permission-debt/) grows: small, well-meant exceptions that nobody removes. Each one also adds a scope. Microsoft's page on [permission scopes](https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope) recommends staying under 5,000 unique scopes in a library, with 50,000 as the supported limit.

## Best practice: which folder permissions and options are safer?

Best practice in Microsoft 365 is to keep permissions at the folder or library level and to assign a permission level, such as Read or Edit, to a group instead of a person. You have four choices, from simplest to heaviest.

- **Share the file with specific people.** This is the sharing method Microsoft recommends for single files. It works for a short-term need, but it still creates a scope for that file.
- **Move the file to a folder that already has the right audience.** One folder, one group, many files. The files inherit from the folder, so there are no extra scopes. This is the simplest way to limit access without touching single files.
- **Create a folder with unique permissions.** One scope covers all files inside. Microsoft's guidance is to share a folder rather than many files, and to decide on unique folder permissions while the folder is still small. A folder with more than 100,000 items cannot have inheritance broken or restored.
- **Create a separate library or site.** Use this when the sensitive content is a whole category, such as HR cases or board papers. For team sites, Microsoft recommends managing site permissions through the Microsoft 365 group.

Any of these supports the principle of [least privilege](https://www.m365.fm/entity/least-privilege/): people get the smallest access that lets them work, and the structure makes it visible.

## Which permission level should a file or folder get?

When you grant access on a file or folder, you choose a permission level. Microsoft's page on [permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels) describes the main ones. **Read** lets people view pages and items and download documents. **Contribute** lets them view, add, update and delete items and documents. **Edit** adds the right to add, edit and delete lists. **Full Control** holds every permission, and by default only the Owners group has it.

For a restricted folder, Read or Contribute is almost always enough. Give Full Control only to the people who manage the site collection or the site. Assign the level to a SharePoint group or a Microsoft Entra security group, so that one change updates everyone. If you must grant access to a single person, note the reason and the date.

## How can you tell whether an item has its own permissions?

Open the permissions page of the library, folder or item. The page shows a status line. When an item inherits, the status reads that it inherits permissions from its parent. When it does not, the page shows its own list of people and groups, and the option to **Delete unique permissions** appears. Check this before you promise anyone that "the whole folder is locked down". One item with its own list can be wide open while its folder is closed.

Also check items that people shared by link. Sharing an item breaks inheritance automatically, so every shared file is a candidate. If a library has many shared files, you may have more scopes than you think. This is why a short, regular review of direct shares matters more than any single setting.

## How do you set and undo permissions on files and folders?

The steps on Microsoft's page, written for a list or library, run like this.

1. Open the library, then select **Settings** and **Library settings**.
2. Under **Permissions and Management**, choose **Permissions for this document library**.
3. Select **Stop Inheriting Permissions**.
4. Use **Grant Permissions** to add people. The default level is Edit, and you can choose Read under **Show options**.
5. To change a person, tick the checkbox and select **Edit User Permissions**. To remove, select **Remove User Permissions**.

To restore inheritance, select **Delete unique permissions** on the Permissions tab and confirm. The page notes that restoring inheritance removes all custom permissions you set. It also warns that removing a user or group from a parent removes them from all children, including items with broken inheritance, and that this cannot be undone.

Both warnings argue for the same habit: write down who had access before you change anything. A small sheet with the item, the people, the reason and the review date takes a minute and saves an incident. Only owners or administrators of the library can do these steps.

## Should you grant access to groups or to individual users?

Prefer groups. Microsoft's page on [sharing and permissions in the modern experience](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions) says that on a communication site you can add users, security groups or Microsoft 365 groups to the Owners, Members or Visitors group. It calls Visitors a good place for security groups and advises against nested security groups, which can cause performance issues. On a team site, access flows from the Microsoft 365 group.

For one item, a group named after the reason, such as a project or a case, can be removed in a single step when the reason ends. That is easier than tracking named people.

The same page lists three link types: Anyone, People in your organization and Specific people. It says Anyone links cannot be audited, and it recommends keeping sensitive data in a site with external sharing turned off. Keep such files out of document libraries where people routinely share by link.

## Example: twelve salary letters in a library of 900 files

The numbers are invented to show the method. An HR library holds 900 files. Twelve of them are salary letters that only two HR managers and the payroll lead may read. Everything else is open to the HR team.

**Option A: item-level permissions.** You break inheritance on 12 files and grant three people access. The library now has 1 + 12 = 13 scopes. Next year, another 12 letters arrive, and the year after, another 12. Each year, someone must remember which files carry exceptions. If a payroll lead leaves, you must edit 36 items.

**Option B: a separate folder.** You create the folder "Salary letters", break inheritance on that one folder, and add a group "Payroll and HR managers" with three people. The library now has 1 + 1 = 2 scopes. New letters go into the folder and inherit from it. When the payroll lead leaves, you edit the group once.

The result favors Option B on every count: fewer scopes, simpler reviews and one place to explain. Option A is only better if the two files are truly isolated and short-lived.

## Common mistakes

- **Sharing single files by habit.** Each share creates a scope that nobody tracks.
- **Using item-level access for a category.** If twelve files share one rule, the rule belongs to a folder.
- **Forgetting that children do not follow.** A file with its own list ignores later parent changes.
- **Restoring inheritance without a record.** The step removes all custom permissions, so you cannot see what you removed.
- **Leaving temporary access in place.** Set the review date on day one.

## How software can help

Microsoft's tools cover the basics: the library permissions page shows whether an item inherits, and sharing options show who has access to a file. The gap is overview. Nobody can click through thousands of files to find those with unique permissions. Scripts or reports that list items with unique permissions per library, and bulk actions to restore inheritance, close that gap. Pick what fits your size, and test it on a copy of a library first.

## Next step

Choose one library today and list which files carry their own permissions. For each, decide whether it belongs in a folder or library of its own, and restore inheritance where nobody can explain the exception. That is how you keep SharePoint permissions on individual files rare and visible.
