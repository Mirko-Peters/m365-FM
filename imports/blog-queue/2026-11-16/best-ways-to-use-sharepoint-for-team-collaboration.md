---
title: "Best Ways to Use SharePoint for Team Collaboration: A Setup Guide"
summary: "How to use SharePoint for collaboration: pick a team site, connect it to a Microsoft 365 group and Teams, manage access with groups, co-author files and share links safely."
status: review
publish: false
author: mirko-p
date: 2026-11-16
topics: [sharepoint, teams, sharepoint-document-libraries]
keypoints:
  - "Use a team site for collaboration and a communication site for broadcasting news, reports and status to a wide audience."
  - "A team site connected to a Microsoft 365 group gives the team a shared calendar, OneNote, Planner and a Teams connection. Members added to either side are added to the other."
  - "Assign permissions to groups (Owners, Members, Visitors), not to individual people. Microsoft's defaults are Full Control, Contribute and Read."
  - "Co-authoring needs files in OneDrive or SharePoint in .docx, .pptx or .xlsx format, and every co-author needs edit access."
  - "Classic SharePoint alerts were announced for retirement in July 2026. Use rules or Power Automate for change notifications."
faq:
  - q: "Should I use a team site or a communication site for collaboration?"
    a: "Use a team site. Microsoft Support describes a team site as a place to store and co-author files, post announcements and track tasks, and it points you to a communication site if you need to broadcast information to others."
  - q: "Who can edit files in a SharePoint document library?"
    a: "Files inherit the permissions of their library. Microsoft Support explains that if everyone has read and write access to a team site library, anyone can co-author there. You can give specific people more access than the library default, but you cannot restrict them below it."
  - q: "Are SharePoint alerts still available?"
    a: "A note on the Microsoft Support alert page says that starting July 2026 SharePoint alerts for SharePoint in Microsoft 365 will be fully retired and stop working. The page points to rules and Power Automate instead. A Microsoft Q&A answer from a moderator says rules work at list or library level and cannot target one file, while Power Automate can."
  - q: "Is it safe to share files with the Anyone link?"
    a: "Microsoft Support describes the Anyone link as giving access to anyone who receives it, whether you send it directly or someone forwards it, and recommends avoiding it unless absolutely necessary. Links for people in your organization or for specific people keep access narrower. If a sharing option is greyed out, your organization's admins may have restricted it."
---
The best way to use SharePoint for team collaboration is to create a team site, connect it to a Microsoft 365 group and Teams, keep working files in its document library and control access through groups. Everything else in this guide builds on those four decisions. Together they are the best practice for secure collaboration in Microsoft SharePoint: one SharePoint site for the team, document management in a library, and access that team members get through groups. The guide describes what Microsoft documents, so menu names can differ slightly in your tenant if an admin has changed settings.

## Start with the right type of site

Microsoft Support separates two site types. A **team site** connects a team to shared content and resources. People use it to store and co-author files, keep a SharePoint list, track project status for project management and post announcements. A **communication site** is the choice when you need to broadcast information out to others.

For day-to-day collaboration, pick the team site. Use a communication site only when the goal is to inform people rather than work together. If you need a single home for several sites, Microsoft's planning page describes a hub site as a frame that connects and organizes team and communication sites. It also recommends creating site collections for each workload in your organization.

## Connect the site to a Microsoft 365 group and Teams

When an admin has enabled Microsoft 365 groups, creating a team site also creates a group. Microsoft Support says members added to either the site or the group are added to the other. Microsoft's project example says a connected group gives the team access to shared resources such as a group calendar, OneNote and Planner.

The project collaboration page adds that a connected group gives the team a group calendar, OneNote, Planner and an email address, and that you can create a connected Microsoft Team. A typical use case: weekly status posts written as news appear in the Teams channel too. If your tenant does not offer group-connected sites, ask your SharePoint admin whether Microsoft 365 groups are turned on.

## Set up access with groups

Add team members at the group level so you can manage permissions and access in one place:

1. Select **Settings**, then **Site Permissions**.
2. Select **Add members**, then **Add members to group**.
3. Select **Add members**, enter names and select **Save**.

Microsoft's default SharePoint groups map to permission levels as follows.

| Group | Permission level |
|---|---|
| Owners | Full control |
| Members | Contribute |
| Visitors | Read |

Microsoft's advice is to avoid assigning permission levels directly to individuals. Assign permissions to groups, then place people in the right group. The same page notes that the "Everyone except external users" security group is automatically granted access as a Member in SharePoint. Check which groups have access to your site before you store anything sensitive there.

## Keep files in the library and co-author

Put working files in the site's document library (one of the SharePoint libraries) so the team can access documents in one place instead of sending attachments. Microsoft Support describes co-authoring as several people working on the same Word, Excel or PowerPoint file at once, which is real-time collaboration on documents. To collaborate on documents this way and share documents without copies, the requirements are:

- The file is stored in OneDrive or SharePoint.
- The file is a modern format: .docx, .pptx or .xlsx.
- Every co-author can access and edit the file.
- The file is not protected with Information Rights Management.

Files inherit the permissions of their library. That is why a library everyone can edit supports co-authoring, while a read-only library lets only the author change a file unless someone is invited.

## Share links with care

To share one file or folder, select it, then **Share**. For SharePoint security, the link type matters most. Under the link settings, Microsoft Support lists these options:

- **Anyone:** whoever has the link, including people outside your organization. Microsoft recommends avoiding it unless necessary.
- **People in your organization with the link:** gives anyone in your organization who has the link access to the file.
- **People with existing access:** does not change any permissions.
- **Specific people:** limits access to the people you name.

You can also choose **Can edit**, **Can review** (Word documents only) or **Can view**, and prevent downloads. Microsoft Support says that setting an expiration date or a password is only available for Anyone links. You cannot share several items at once, so put them in a folder and share the folder. If an option is greyed out, an admin has restricted it.

## Make the work visible

A team site home page can show news, Quick Links, an activity feed and a document library web part. The project collaboration page suggests a Planner web part for progress, a News web part for milestones, a group calendar web part for availability and Quick Links for frequently used items. In its example, the team site is reviewed semi-monthly to keep project deadlines and news up to date.

These web parts are SharePoint features that improve collaboration because the team sees status without asking for it. For ongoing care, Microsoft Support suggests establishing a schedule to review site content so it stays accurate and relevant.

## Notifications: alerts versus rules and Power Automate

Many teams relied on "Alert me" for files. A note on Microsoft Support's alert page says that starting July 2026 SharePoint alerts for SharePoint in Microsoft 365 will be fully retired and stop working. The page points to rules and Power Automate. A Microsoft Q&A answer from a moderator explains the difference. Rules are created at list or library level and work on column conditions, so they cannot select one specific file. Use Power Automate when only one specific file matters: it can notify only when that file changes, for example with the trigger "When a file is created or modified (properties only)" plus a condition on the file.

## Common mistakes

- Using a communication site for a working team.
- Giving permissions to individuals instead of groups.
- Using Anyone links by habit.
- Splitting files between chat attachments and the library.
- Relying on alerts that Microsoft has retired.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)
- [SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/)

## Sources

- [Microsoft Support: Use the SharePoint team collaboration site template](https://support.microsoft.com/office/use-the-sharepoint-team-collaboration-site-template-75545757-36c3-46a7-beed-0aaa74f0401e)
- [Microsoft Support: Plan sites and manage users](https://support.microsoft.com/en-US/SharePoint/sites-pages/plan-sites-and-manage-users-1)
- [Microsoft Support: Create a project collaboration space in SharePoint](https://support.microsoft.com/en-au/office/create-a-project-collaboration-space-in-sharepoint-4c777ba7-61c2-440f-b27f-4b34352d3b83)
- [Microsoft Support: Document collaboration and co-authoring](https://support.microsoft.com/en-gb/sharepoint/get-started-with-sharepoint/document-collaboration-and-co-authoring)
- [Microsoft Support: Share SharePoint files or folders](https://support.microsoft.com/office/share-sharepoint-files-or-folders-1fe37332-0f9a-4719-970e-d2578da4941c)
- [Microsoft Support: Create an alert to get notified when a file or folder changes in SharePoint](https://support.microsoft.com/en-US/SharePoint/documents-and-library/create-an-alert-to-get-notified-when-a-file-or-folder-changes-in-sharepoint)
- [Microsoft Q&A: SharePoint alerts being discontinued](https://learn.microsoft.com/en-us/answers/questions/5826376/sharepoint-alerts-being-discontinued)
