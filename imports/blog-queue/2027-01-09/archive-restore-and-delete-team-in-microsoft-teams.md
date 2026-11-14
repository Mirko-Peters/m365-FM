---
title: "How to Archive, Restore and Delete a Team in Microsoft Teams"
summary: "Archive, reactivate and delete a team in the Teams admin center: roles, what archiving does, the read-only SharePoint option, what deletion removes, restoring a deleted team through its Microsoft 365 group within 30 days, and gaps in the page."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [teams, teams-admin-center]
keypoints:
  - "Archiving needs a Teams service admin. In the Teams admin center select the team, then Archive, with an optional read-only SharePoint site setting."
  - "Archiving ends all activity but you can still add or remove members, update roles and view all activity, files and chats. Archived teams can be restored."
  - "Deleting a team is permanent from the Teams side. Learn says you cannot directly restore a deleted team, so consider archiving first."
  - "A deleted team can be recovered by restoring its Microsoft 365 group. By default a deleted group is kept for 30 days."
  - "The Microsoft Graph PowerShell restore can take up to 24 hours to complete."
faq:
  - q: "Who can archive or restore a team?"
    a: "Microsoft Learn says you must be a Teams service admin to make these changes in the admin center. It notes that team owners can also archive a team and links to a separate article for that."
  - q: "What happens when I archive a team?"
    a: "All activity for the team ceases, and private channels and their site collections are archived. You can still add or remove members, update roles and view activity in channels, files and chats. The team moves to Hidden teams and later shows as Archived in Manage teams."
  - q: "Can I restore an archived team?"
    a: "Yes. Select the team in the admin center and select Restore. The status can take some time to change to Active, and the team is not moved back into Your teams automatically."
  - q: "Can I restore a deleted team?"
    a: "Not directly. Learn says restoration works by restoring the associated Microsoft 365 group, which restores team content. By default a deleted group is retained for 30 days."
  - q: "How long does a restore take?"
    a: "Learn says the PowerShell restore process can take up to 24 hours before the team and its content appear in Teams."
---

Archiving is the safe way to retire a team. Deleting is final from the Teams side, although a group restore can bring a team back within a retention window. This guide follows the Microsoft Learn page on archiving and deleting a team in the Teams admin center.

## Roles

- Archive and restore: you must be a Teams service admin. Team owners can also archive a team, and the page links to a separate support article for their steps.
- Delete: the page states no role.
- Restore a deleted team through PowerShell: the page names the Graph scopes GroupMember.Read.All and Group.ReadWrite.All and no Entra role.

## Archive a team

1. In the Teams admin center select **Teams**.
2. Select the team by its name.
3. Select **Archive**.
4. Optionally select **Make the SharePoint site read-only for team members**. Teams owners can still edit this content.
5. Select **Archive**.

**What it does.** All activity for the team ceases. Archiving also archives private channels and their site collections. You can still add or remove members, update roles and view all activity in standard and private channels, files and chats. The status changes to **Archived**. The team is temporarily in **Hidden teams** at the bottom of the teams list. After it leaves, it appears in **Manage teams** under **Archived**.

## Reactivate an archived team

1. Select **Teams** in the admin center.
2. Select the team.
3. Select **Restore**.

The status may take some time to return to **Active**. The team is not moved back inside **Your teams** automatically.

## Delete a team

1. Select **Teams**, then the team.
2. Select **Delete** and confirm with **Delete** to permanently delete the team.

Team activity in standard and private channels, their site collections, files and chats are also deleted. If the deleted team has sites under retention, those are not deleted until the retention period expires. Learn says archived teams can be reactivated, but a deleted team cannot be restored directly. It advises archiving first and postponing deletion until you are sure the team is no longer needed.

## Restore a deleted team

Restoration works by restoring the associated Microsoft 365 group. That restores team content, including tabs, standard channels and private channels with their site collections. By default a deleted Microsoft 365 group is retained for 30 days. Learn calls this soft-delete.

The page shows Microsoft Graph PowerShell steps:

```powershell
Connect-MgGraph -Scopes 'GroupMember.Read.All, Group.ReadWrite.All'
Get-MgDirectoryDeletedItem -DirectoryObjectId [Id]
Restore-MgDirectoryDeletedItem -DirectoryObjectId [Id]
Get-MgGroup -GroupId [Id]
```

It can take up to 24 hours for the restore to complete before the team and its content show up in Teams. The page says to list soft-deleted groups with the first command. That cmdlet normally takes a specific object ID, so check the current Graph PowerShell documentation before relying on it for listing. The page also mentions restoration in the Teams admin center and links to a separate article without describing it.

## What the page does not say

- Whether chats, files and channel posts become read-only on archive. Only the SharePoint site and Wiki tab setting is described.
- Whether owners keep the ability to change membership in an archived team.
- Whether the Microsoft 365 group is affected when a team is archived.
- How to archive from the Teams client.
- The role needed to delete.
- What happens after the 30-day soft-delete period.
- How retention policies interact with the deletion timeline, beyond the sentence about sites under retention.

## A retirement outline

This outline is practical advice built on the page.

1. Archive the team first and tick the read-only SharePoint option if the content should not change.
2. Wait until you are sure nobody needs the team.
3. Delete from the admin center.
4. If someone asks for it back, act within the 30-day group retention window.

## Typical mistakes

- Deleting a team when archiving would have been enough.
- Expecting a restored team to reappear under Your teams at once.
- Waiting past the retention window.
- Assuming the read-only option covers chats and files.

## Quick reference

| Action | Where | Result on the page |
| --- | --- | --- |
| Archive | Teams admin center > Teams > select team > Archive | Activity ceases, status Archived, optional read-only SharePoint site |
| Restore an archived team | Teams > select team > Restore | Status returns to Active after some time |
| Delete | Teams > select team > Delete | Content is deleted, a deleted team cannot be restored directly |
| Restore a deleted team | Restore the Microsoft 365 group | Possible within the default 30-day soft-delete period |

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Archive or delete a team in Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/archive-or-delete-a-team)
