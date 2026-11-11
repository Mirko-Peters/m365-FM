---
title: "Cleaning up orphaned users and direct access"
summary: "Orphaned users and direct permissions pile up quietly in SharePoint. Learn where they come from, how to find them, and how to clean up safely with group-based access and a tested offboarding routine."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [sharepoint-permissions, user-offboarding, permission-debt]
faq:
  - q: "What is an orphaned user in SharePoint?"
    a: "Usually it is a person who has left the organization but still appears in permission lists, groups or sharing entries on sites and content. Microsoft does not define it as a single formal object, so the term is practical shorthand. Check your own sites for entries that no longer map to active, current accounts."
  - q: "Why is direct access to single items a problem?"
    a: "Permissions on a site, group or team give access to all content in it, while direct entries on single files and folders sit outside that model. They are easy to forget, hard to review, and can leave data reachable long after the original reason ended. Microsoft recommends managing access through the Microsoft 365 group or team where possible."
  - q: "Is it safe to delete a former employee's account right away?"
    a: "Not without preparation. Microsoft Learn describes that deleted accounts can be restored for 30 days by default, and OneDrive data is kept only for a limited time. Accounts with forwarding or a converted shared mailbox should not be deleted. Hand over files first, and check the current Microsoft Learn pages on removing a former employee."
---

Every organization has people who leave. Their accounts get handled, their mailboxes get archived or forwarded, and their licenses get reduced. What often stays behind is quieter: entries in permission lists, sharing links on single files, and group memberships that nobody reviewed afterwards.

This article looks at how orphaned users and direct access arise in SharePoint, how to find them, and how to clean up without creating new problems. It builds on the way [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) are documented by Microsoft, and it connects them to a proper offboarding routine.

## How SharePoint access is meant to work

Microsoft Learn describes the permission model by site type. Team sites are by default connected to a Microsoft 365 group: the group owners become site owners, and the group members become site members. Communication sites are not connected to a Microsoft 365 group and use the standard SharePoint groups Owners, Members and Visitors. For private and shared channel sites, permissions are managed in Teams.

On a team site, the three groups map to the permission levels Full Control (Owners), Edit (Members) and Read (Visitors). A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the Visitors group.

Permissions on a site, group or team give access to all content in it. That is the intended model: a small number of groups, a clear owner, and access that follows group membership. Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible, and advises against nested security groups because they can cause performance problems.

For single files and folders, SharePoint offers sharing links of three types: Anyone, People in your organization and Specific people. A site can allow external sharing only if it is allowed at organization level first. For the exact current behaviour, see the [Microsoft Learn page on sharing and permissions](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions) and the page on [default SharePoint groups](https://learn.microsoft.com/en-us/sharepoint/default-sharepoint-groups).

## Where orphaned users and direct access come from

"Orphaned user" is practical shorthand rather than a formal Microsoft term. In this article it means an entry in a permission list or group that belongs to a person who has left, or whose account no longer exists in a usable form. "Direct access" means access granted to a person or a link on an individual item, outside the group-based model.

Imagine a team site for a project. The group owners and members manage the day-to-day access. During the project, someone shares a single folder with a contractor through a Specific people link, and another colleague gets Edit rights on one document library because it was quicker than adding them to the group. A year later, the project is over, the colleague has moved on, and the contractor's engagement has ended. The site still looks tidy from the top, because the group membership is clean. The direct entries are still there.

Typical sources include:

- Sharing links created for single files and folders that were never removed.
- Individual users added directly to a site or library to avoid changing group membership.
- Entries for people who have left, left over because the account was removed but nobody checked where it had been granted access.
- Members of the Visitors group who were added for read-only access and never reviewed.

None of this is unusual. It is what happens when access is granted for a reason that later disappears.

## Why this matters beyond tidiness

Leftover access makes reviews harder. When someone asks "who can see this folder?", the answer should not require opening five dialogs and reading link lists. The more access sits outside the group model, the less reliable any review becomes.

There is also a growing concern around [permission debt](https://www.m365.fm/entity/permission-debt/): the accumulated backlog of overly broad, inherited or outdated access rights, such as content shared with everyone, that stays latent until AI tools like Copilot surface the data at machine speed. Old access decisions can stay latent until a search or assistant surfaces the content quickly. Cleaning up direct access and orphaned entries is one practical way to reduce that backlog.

## Offboarding: the step that decides what stays behind

A good [user offboarding](https://www.m365.fm/entity/user-offboarding/) routine finds and hands over a person's files and access first, and removes the account afterwards. Microsoft Learn describes several points that matter for cleanup:

- If only the license is removed and the account is not deleted, an admin can get access to the user's OneDrive files directly.
- If the account is deleted, it can be restored for 30 days; after that the data is permanently deleted.
- For OneDrive, the default retention for deleted users is 30 days. After that, the OneDrive moves to the site collection recycle bin, where it is kept for 93 days. While it sits there, content shared from that OneDrive is not accessible to other people. The retention time can be increased.
- To give another person access, an admin can add that person as site collection administrator of the former employee's OneDrive, or create a link to the files and download or move them. When documents with version history are moved or copied this way, only the latest version is moved.
- SharePoint files do not need to be moved, because they stay with the sites.
- Files that were synced to the person's computer stay there; an admin cannot wipe them.
- Deleting the account does not stop the license cost; licenses are reduced separately.
- Accounts with e-mail forwarding or a converted shared mailbox should not be deleted.

The list above focuses on the account and its OneDrive. A review of every place the person was granted access on SharePoint sites is not part of it, so consider adding that review as an extra step in your own routine. The pages on [removing a former employee](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee-step-5) and [deleting a user](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/delete-a-user) describe the current details and are worth re-reading before you change your process.

## A careful cleanup approach

Cleanup can remove access that someone still legitimately needs, so it should be done in small, reversible steps.

**1. Pick a pilot site.** Choose a site with a known owner and moderate complexity. Do not start with the most sensitive site in the tenant.

**2. Collect what exists.** For the pilot site, list site owners, members and visitors, any individual users with direct permissions, and the sharing links on files and folders. The site's permissions and sharing settings in the SharePoint interface show part of this. For larger reviews, other options such as reports or PowerShell exist; check Microsoft Learn for what fits your environment.

**3. Classify each entry.** For every direct entry, decide: does it belong in a group (move it there), is it still needed as an exception (document it with an owner and a reason), or is it obsolete (remove it)?

**4. Involve the site owner.** The owner knows whether the contractor is still working on the project. Admins usually do not.

**5. Change one thing at a time.** Removing permissions, deleting sharing links, breaking or restoring inheritance, and bulk changes can all lock people out or expose content in ways that are hard to see afterwards. Test on a pilot site or in a test tenant first, and make sure you have a backup or a documented way back, such as an export of the current permission state, before you change anything.

**6. Re-check after a short time.** Ask the owner whether anyone lost access they needed, and fix gaps by adding people to the appropriate group rather than granting new direct permissions.

## Keeping it clean afterwards

Cleanup is a one-off effort unless the routine changes. A few habits help:

- Prefer group membership over direct entries, as Microsoft recommends.
- Avoid nested security groups for site access, since Microsoft advises against them because of possible performance problems.
- Consider Specific people links rather than broader link types when sharing single items, and remove links when the collaboration ends.
- Consider giving every site more than one owner, so access decisions do not depend on one person who may leave.
- Add an access check for the person's sites and shared items to your offboarding checklist, before the account is deleted.

## Practical takeaways

- Treat "orphaned user" and "direct access" as two separate problems: entries for people who left, and access granted outside groups.
- The offboarding points described above focus on the account and OneDrive; consider adding your own check for SharePoint permissions and sharing links.
- Do the access review and handover before deleting the account. Deleted accounts can be restored for 30 days by default, and OneDrive data is kept only for a limited time.
- Do not delete accounts with e-mail forwarding or a converted shared mailbox.
- Prefer group-based access, and document every exception with an owner and a reason.
- Test cleanup on a pilot site first, and keep a backup or a way back before removing permissions or links.
- Reducing outdated and overly broad access lowers your permission debt, which matters more once search and AI tools can surface content quickly.
- Check the linked Microsoft Learn pages regularly; behaviour and defaults can change.
