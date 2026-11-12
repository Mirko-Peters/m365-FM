---
title: "SharePoint unique permissions limit: what happens when you hit it"
summary: "SharePoint unique permissions limit: 50,000 per library, 5,000 recommended. Learn how scopes are counted, what happens near the limit and how to stay below it."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [permission-inheritance, sharepoint-permissions, sharepoint-document-libraries, sharepoint-list-view-threshold]
keypoints:
  - "Microsoft supports up to 50,000 unique permission scopes in one list or library, but recommends staying under 5,000 for best performance."
  - "Every file or folder that stops inheriting permissions adds one scope, and files shared one by one each add a scope even when the people are identical."
  - "SharePoint does not clean up unique permissions for you, so scope counts only go up unless someone restores inheritance."
  - "A list, library or folder with more than 100,000 items cannot break or restore inheritance, so decide on unique folder permissions while the folder is small."
  - "Share folders instead of single files, use groups, and review direct shares on a schedule to stay well below the recommended 5,000."
faq:
  - q: "What is the SharePoint unique permissions limit?"
    a: "Microsoft states that the supported limit of unique permissions for items in a list or library is 50,000, and the recommended general limit is 5,000. Staying under 5,000 gives the best performance. Small access control lists can go beyond 5,000 without trouble, but large ones can slow things down earlier."
  - q: "What happens when you reach the unique permissions limit?"
    a: "Microsoft's documentation describes degraded performance above the recommended 5,000 and warns that unmanaged sharing can lead to performance issues or even operational failure near the 50,000 limit. SharePoint does not restore inheritance by itself, so you must remove unneeded unique permissions yourself."
  - q: "Does sharing one file with a person create a unique permission?"
    a: "Yes. Sharing a file or folder breaks inheritance and creates a new permission scope that adds one to the count. Files that inherit from a shared folder count only once, through the folder. Files shared one by one each add a scope, even when the people and rights are identical."
---

The SharePoint unique permissions limit is 50,000 unique permission scopes in one list or library, and Microsoft recommends staying under 5,000. Past the recommended number, performance can degrade, and near the supported limit unmanaged sharing can cause operational problems. This article is for SharePoint admins who run large libraries and want to know how the count works and how to keep it low. You will learn what a scope is, which actions add to it, what Microsoft says about the limit, and how to clean up.

## What is a unique permission scope?

Microsoft explains the idea on its page about [managing permission scopes](https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope). A permission scope is a uniquely secured object. Its access control list, or ACL, can differ from its parent. An ACL is a list of entries, and each entry pairs a person or group with a right, such as read or edit.

By default, a file or folder inherits permissions from the library or folder that holds it. This is [permission inheritance](https://www.m365.fm/entity/permission-inheritance/). When an item gets unique permissions, it stops inheriting and has its own scope. A new library starts with one scope. Each time inheritance breaks on a file or folder, the count goes up by one.

Two counting rules from the page matter most:

- Files that inherit from a shared folder share its ACL. Only the parent folder counts. Microsoft's example: a folder shared with a user and holding 75,000 files has a scope count of 2.
- Files shared one by one each add a scope, even if the ACLs are identical. Microsoft says it does not matter that you shared two files with the same user.

So the number of scopes depends on how people share, not on how many files you have.

## What is the SharePoint unique permissions limit, exactly?

Microsoft's [SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits) page lists the figures. The supported limit of unique permissions for items in a list or library is 50,000. The recommended general limit is 5,000.

A second rule concerns size. The same page says that when a list, library or folder contains more than 100,000 items, you cannot break permissions inheritance on it, and you cannot restore inheritance either. You can still break inheritance on single items inside it, up to the maximum number of unique permissions in the library. The permission scopes page adds a consequence: a folder can only break inheritance if it has 100,000 or fewer items, and if it exceeds that without being uniquely shared, it can't be uniquely shared later.

For design in [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/), this means timing. Decide which folders need their own access while they are small. Microsoft suggests sharing a folder when it contains zero items, if you know it needs unique sharing.

## How do items end up with unique permissions?

Most scopes are not created on purpose. There are two routes, and Microsoft documents both.

The first is manual. A person with enough rights stops inheritance in the library settings and sets custom access. This is deliberate, and it is usually rare.

The second is sharing. Microsoft's page on [permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels) states that a user can interrupt the default inheritance by sharing a document or item with someone who does not have access. In that case SharePoint automatically stops inheritance on the item. The person who shared the file never sees this step. They click Share, type a name and send. The result is a new scope.

This explains why the count grows quietly. Hundreds of people share files every week, each click can create a scope, and nobody sees a counter. It also explains why training matters as much as settings. If staff learn to share a folder that already has the right group, the library stays in order. If they share each file, the library fills with scopes.

Because the system never restores inheritance on its own, old shares stay forever. A file shared with a colleague in 2022 keeps its scope today, even if the colleague left long ago.

## What happens when you get close to the limit?

Microsoft does not describe a single fixed failure point. It describes a slope:

- Above the recommended 5,000, performance can degrade.
- The size of each ACL matters. With small ACLs, fewer than 10 entries each, you can exceed 5,000 scopes without problems. With larger ACLs, up to 5,000 entries, you might see performance problems before you reach the limit.
- The system does not clean up for you. It does not restore inheritance on its own, so the count only grows unless someone acts.
- Microsoft warns that unmanaged sharing could lead to performance issues or even operational failure once the 50,000 limit is reached.

In practice, expect slow permission checks and slow screens long before any hard stop. Treat 5,000 as your alarm line. Note that this is a separate topic from the [list view threshold](https://www.m365.fm/entity/sharepoint-list-view-threshold/), which concerns how many items a view can show. The two limits are easy to confuse, because both appear in large libraries.

## How do you stay under the limit?

Microsoft's tips are short, and they work:

1. **Use inheritance as the default.** Minimize the number of unique scopes by leaving inheritance on wherever you can.
2. **Share folders, not files.** One shared folder is one scope, no matter how many files it holds.
3. **Use groups.** Give access to SharePoint groups or Microsoft Entra groups, not to individuals. It keeps each ACL small.
4. **Plan unique folders early.** Share before the folder passes 100,000 items.
5. **Audit on a schedule.** Review direct shares and access requests regularly, and restore inheritance where unique rights are not needed.

Because Microsoft's page gives no method to count scopes, you need a proxy. The per-user [data access governance report](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-site-permissions-users-report) shows an "items with direct access" count per user and site. It is not a scope count, but a high number points to the sites that need a closer look.

## Example: a library that grows toward 5,000

The numbers are invented to show the method. A project library holds 12,000 files. Over three years, staff shared 3,200 files one by one. The scope count is 1 for the library plus 3,200 shared files, so 3,201. That is under the recommended 5,000. But staff share about 150 more files each month. After 12 months, the count is 3,201 + 1,800 = 5,001. The library crosses the recommended line.

You check the sharing pattern and find that the 3,200 files sit in 80 project folders, with the same people on all files of a project. Your plan:

1. Share each of the 80 folders with the right project group.
2. Restore inheritance on the 3,200 files, so they take the folder's ACL.
3. Tell staff to share the folder, not single files.

The new count is 1 + 80 = 81 scopes. Monthly growth drops, because new files in a shared folder add nothing. Check the plan against the access of each project first, because folder-level sharing may give some people more files than before.

## Common mistakes

- **Sharing single files by default.** Each one adds a scope, even with identical people.
- **Ignoring the size of the ACL.** Large ACLs slow things down before the count reaches 5,000.
- **Waiting too long on large folders.** Above 100,000 items, you cannot break or restore inheritance on the folder.
- **Assuming SharePoint cleans up.** It does not restore inheritance for you.
- **Mixing up two limits.** The unique permissions limit and the list view threshold are different problems.

## How software can help

Start with what Microsoft 365 offers: library settings to restore inheritance, data access governance reports to spot sites with many direct shares, and scripts that list items with unique permissions. Scripts work well for a single library, but they take time to write and to run on big libraries. A reporting tool that lists items with unique permissions and lets you reset them in bulk can save work. Compare options against these built-in methods before you buy.

## Next step

Pick your largest library today and find out how many items have their own permissions, using a script or a report. If the SharePoint unique permissions limit of 5,000 is within reach, share folders instead of files, and restore inheritance on the items you no longer need to protect separately.
