---
title: "SharePoint permission levels: Read, Edit, Contribute, Full Control"
summary: "SharePoint permission levels explained: what Read, Contribute, Edit, Design and Full Control allow, which group gets which level, and when a custom level helps."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, sharepoint-site-owner, least-privilege]
keypoints:
  - "SharePoint permission levels are bundles of single permissions. Full Control, Design, Edit, Contribute and Read form a ladder from most to least power."
  - "Contribute lets a person add, update and delete items and documents. Edit adds the right to add, edit and delete whole lists, so it gives more than most editors need."
  - "By default the Owners group holds Full Control, Members hold Edit and Visitors hold Read. On group-connected team sites the Microsoft 365 group sets this."
  - "Limited Access is assigned by SharePoint itself when someone gets access to one item. It adds no rights to the rest of the site and you cannot assign it by hand."
  - "Create a custom permission level by copying an existing one, never by editing a default level, because a change reaches every site in the site collection."
faq:
  - q: "What is the difference between Contribute and Edit in SharePoint?"
    a: "Contribute lets a person view, add, update and delete list items and documents. Edit does the same and also lets the person add, edit and delete lists. For a document library where people only work with files, Contribute is the smaller and safer choice. Give Edit only if people must manage lists."
  - q: "Is Full Control the same as being a site owner?"
    a: "Nearly. Full Control is the permission level with every SharePoint permission, and by default the Owners group holds it. So a site owner is a member of a group that has Full Control. You can also give the level to another group, but doing so makes those people owners in practice."
  - q: "Can I change the default SharePoint permission levels?"
    a: "You can edit most default levels, but Microsoft advises against it. Full Control and Limited Access cannot be changed at all. Edits to a default level affect every built-in group in the site collection. Copy a level instead, change the copy and assign it to a group."
---

SharePoint permission levels decide what a person can do on a site, library or item. The five levels most site owners use are Full Control, Design, Edit, Contribute and Read. Each one is a bundle of single permissions, and you assign it to a group. This article is for site owners who need to pick the right level and explain the choice. You will learn what each level allows, how Contribute differs from Edit, how Full Control relates to the Owners group, and when a custom level makes sense.

## What do the default SharePoint permission levels allow?

Microsoft describes the levels on its page about [understanding permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels). Here are the main ones, from most to least power:

- **Full Control:** all available SharePoint permissions. By default the Owners group has it. You cannot customize or delete it.
- **Design:** create lists and document libraries, edit pages, and apply themes, borders and style sheets. No group gets it by default.
- **Edit:** add, edit and delete lists, and view, add, update and delete list items and documents. The Members group has it by default.
- **Contribute:** view, add, update and delete list items and documents.
- **Read:** view pages and items in existing lists and libraries, and download documents. The Visitors group uses it.

Four more levels are less common. **Limited Access** is assigned by SharePoint itself, not by you. **Restricted Read** lets people see pages and documents, but not earlier versions or user permissions. **View Only** lets people view documents in the browser. Files that have no browser viewer, such as video or .png files, can still be downloaded. **Approve** and **Manage Hierarchy** serve special groups for approvals and for creating sites.

Levels are the basic building block of [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/). Every level is a set of smaller permissions, such as "Add Items" or "Manage Permissions". The page notes that a permission can depend on another one. If you clear "View Items", SharePoint also clears "Manage Lists", because nobody can manage a list they cannot see.

## Contribute vs Edit: which permission level should people get?

This is the question site owners ask most. Compare the two descriptions word by word. Contribute covers list items and documents. Edit covers the same, and adds the right to add, edit and delete lists.

In a document library, that gap matters. A Contribute user can upload, change and delete files. An Edit user can do the same and can also add or delete lists on the site. Most people who work with files do not need that. If you apply [least privilege](https://www.m365.fm/entity/least-privilege/), meaning the smallest role that still lets a person do the job, Contribute is the better default for people who only handle documents.

Remember that Microsoft's group page lists the Members group with "Edit or Contribute". It says the level depends on the site template used to create the site. So do not assume. Open **Site permissions**, then **Advanced permissions settings**, and read the level your Members group holds.

## Full Control vs owner: what is the link with the Owners group?

Full Control is the level with every permission. Microsoft's page on [default SharePoint groups](https://learn.microsoft.com/en-us/sharepoint/default-sharepoint-groups) describes the Owners group as people who must be able to manage site permissions, settings and appearance. A [site owner](https://www.m365.fm/entity/sharepoint-site-owner/) is therefore a member of a group that holds Full Control. The level does not belong to a person. It belongs to a group, and the person gets it through membership.

That has two practical effects. First, an owner can change who has access, so keep the owner list short. Two or three named people per site are usually enough. Second, you can grant Full Control to another group, but you should treat that group as owners.

On a team site that is connected to a Microsoft 365 group, Microsoft states that you cannot change the permissions of the default Owners, Members and Visitors groups from SharePoint. You manage them through the group. The page also warns against deleting the default groups.

## How does Limited Access work?

Limited Access confuses many admins because it appears in permission lists but nobody assigns it. SharePoint adds it when you give someone access to one specific item. The person then needs a way to reach that item, so SharePoint grants Limited Access on the containers, such as the site or the library, so the page can display correctly.

Microsoft says Limited Access adds no extra permissions. The person cannot see or open anything else. You also cannot assign it directly to a user or a group. If you see many people with Limited Access on a site, it simply means many items were shared one by one. That is a hint to review direct shares, not a reason to delete the entries.

## When should you create a custom permission level?

Create one when no default level fits. A common case is people who may add and edit files but must not delete them. Microsoft's steps in [how to create and edit permission levels](https://learn.microsoft.com/en-us/sharepoint/how-to-create-and-edit-permission-levels) are short:

1. Open **Site permissions** on the top-level site of the site collection, then **Advanced permissions settings**.
2. On the **Permissions** tab, choose **Permission Levels**.
3. Select the name of an existing level, for example **Contribute**.
4. Select **Copy Permission Level**, then give the copy a name and a description.
5. Add or remove single permissions, then select **Create**.
6. Assign the new level to a SharePoint group, not to individual people.

You need the Manage Permissions permission to do this, which the Owners group has by default. Microsoft lists several cautions. Do not edit or delete default levels, because changes reach all built-in groups in the site collection. Remember that a level applies to the whole site collection. Do not remove "Use Remote Interfaces", because the modern experience needs it and its removal causes Access Denied errors. Assign levels to groups, because that is easier to track. And on team sites, manage access through the Microsoft 365 group instead of custom levels.

## How do permission levels relate to inheritance and unique permissions?

A level only matters where it is applied. By default, a library, folder or item inherits the permissions of its parent site, so the groups and their levels carry down. When you break permission inheritance, the item gets unique permissions, and you can assign permissions to users or groups for that item alone. Microsoft's page on [permission scopes](https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope) recommends staying under 5,000 unique scopes per library and names 50,000 as the supported limit.

For site permissions in SharePoint Online, a sound best practice is to keep the groups at the top of the SharePoint site simple and to use unique permissions only for real exceptions. Default permissions on a new site come from the site template, and the default permission levels stay as they are until you copy one. Good permission management therefore means reading three things together: the level, the group that holds it and the place where it applies. That is also how you grant permissions without losing track of them, and it is the core of understanding SharePoint permission levels in practice.

## Example: four audiences for one policy library

The numbers are invented to show the method. A company keeps its policies in one library, "Policy Documents". There are 6 HR staff who upload and update policies, 1 HR lead who also adds new libraries for new topics, 180 employees who read policies, and 3 auditors who should view but not copy them.

1. **HR staff (6 people):** Contribute. They add, update and delete documents. They do not need to create lists.
2. **HR lead (1 person):** Edit, because adding and editing lists is part of the job.
3. **Employees (180):** Read. They can view and download.
4. **Auditors (3):** View Only. They view documents in the browser. Microsoft notes that files without a browser viewer can still be downloaded, so this level does not stop every copy.

Result: four groups, four levels, no custom level and only 7 people who can change content. The setup is easy to explain to an auditor: each audience has one group, each group has one level, and the level matches the job. When a new person joins HR, you add them to one group and nothing else. Add Design only if someone must change pages and themes.

## Common mistakes

- **Giving Edit by default.** It is wider than Contribute. Start with the smaller level.
- **Editing a default level.** One change hits every built-in group in the site collection. Copy the level instead.
- **Assigning levels to individual users.** It works, but it is hard to review later. Use groups.
- **Making many owners.** Full Control lets a person change access for everyone. Keep the list short.
- **Trusting View Only to stop copies.** Files that cannot open in the browser can still be downloaded.
- **Deleting the default groups.** Microsoft warns that it can make the system unstable.

## How software can help

Start with the built-in tools: **Site permissions**, **Advanced permissions settings** and **Check Permissions** show which group holds which level, and the SharePoint admin center shows site owners across the tenant. For many sites, PowerShell or an export from a reporting tool can list groups and their levels in one table, which is easier to review than a click through each site. Whatever you use, write the result into a short permissions standard: which audience gets which level and who approves exceptions.

## Next step

Open your busiest site today and list which group holds which of the SharePoint permission levels. Write down any group with Edit or Full Control that could work with Contribute or Read, and change one of them this week.
