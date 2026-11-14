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
    a: "Use a team site. According to Microsoft Support, a team site is for storing and co-authoring files, posting announcements, tracking tasks and keeping lists, and it is open only to people who are invited. A communication site is meant for sharing news, reports and status, usually with a few contributors and many readers."
  - q: "Who can edit files in a SharePoint document library?"
    a: "Files inherit the permissions of their library. Microsoft Support explains that if everyone has read and write access to a team site library, anyone can co-author there. You can give specific people more access than the library default, but you cannot restrict them below it."
  - q: "Are SharePoint alerts still available?"
    a: "Microsoft Support shows a banner that SharePoint alerts in Microsoft 365 are fully retired and stop working starting July 2026. The page points to rules and Power Automate instead. A Microsoft Q&A answer from a moderator says rules work at list or library level and cannot target one file, while Power Automate can."
  - q: "Is it safe to share files with the Anyone link?"
    a: "Microsoft Support describes the Anyone link as giving access to whoever receives it, including people outside your organization, and recommends avoiding it unless absolutely necessary. Links for people in your organization or for specific people keep access narrower. Admins can also remove the Anyone option."
---
The best way to use SharePoint for team collaboration is to create a team site, connect it to a Microsoft 365 group and Teams, keep working files in its document library and control access through groups. Everything else in this guide builds on those four decisions. It describes what Microsoft documents, so menu names can differ slightly in your tenant if an admin has changed settings.

## Start with the right type of site

Microsoft Support separates two site types. A **team site** connects a team to shared content and resources. People use it to store and co-author files, keep lists, track project status and post announcements. A **communication site** is for sharing news, reports and status, typically with a small number of contributors and many readers.

For day-to-day collaboration, pick the team site. Use a communication site only when the goal is to inform people rather than work together. If you need a single home for several sites, Microsoft's planning page describes a hub site as a frame that connects and organizes team and communication sites. It recommends one site collection per workload, each associated with a hub.

## Connect the site to a Microsoft 365 group and Teams

When an admin has enabled Microsoft 365 groups, creating a team site also creates a group. Microsoft Support says members added to either the site or the group are added to the other. The group brings Outlook conversations and calendar, SharePoint files, Planner tasks and a shared OneNote notebook into one space.

The project collaboration page adds that a connected group gives the team a group calendar, OneNote, Planner and an email address, and that you can create a connected Microsoft Team. Weekly status posts written as news appear in the Teams channel too. If your tenant does not offer group-connected sites, ask your SharePoint admin whether Microsoft 365 groups are turned on.

## Set up access with groups

Add people at the group level so permissions stay manageable:

1. Select **Settings**, then **Site Permissions**.
2. Select **Add members**, then **Add members to group**.
3. Select **Add members**, enter names and select **Save**.

Microsoft's default SharePoint groups map to permission levels as follows.

| Group | Permission level | Typical use |
|---|---|---|
| Owners | Full Control | People who manage the site |
| Members | Contribute | The working team |
| Visitors | Read | Stakeholders who only need to view |

Microsoft's advice is to avoid assigning permission levels directly to individuals. Assign permissions to groups, then place people in the right group. The same page notes that by default the "Everyone except external users" group has Member access in some setups, so anyone in the directory could edit content. Check what applies to your site before you store anything sensitive there.

## Keep files in the library and co-author

Put working files in the site's document library instead of sending attachments. Microsoft Support describes co-authoring as several people working on the same Word, Excel or PowerPoint file at once. The requirements are:

- The file is stored in OneDrive or SharePoint.
- The file is a modern format: .docx, .pptx or .xlsx.
- Every co-author can access and edit the file.
- The file is not protected with Information Rights Management.

Files inherit the permissions of their library. That is why a library everyone can edit supports co-authoring, while a read-only library lets only the author change a file unless someone is invited.

## Share links with care

To share one file or folder, select it, then **Share**. Under the link settings, Microsoft Support lists these options:

- **Anyone:** whoever has the link, including people outside your organization. Microsoft recommends avoiding it unless necessary.
- **People in your organization with the link:** anyone inside the organization, even if the link was forwarded.
- **People with existing access:** sends a link without changing permissions.
- **Specific people:** limits access to the people you name.

You can also choose **Can edit**, **Can review** (Word documents only) or **Can view**, and block download. Expiration dates and passwords are available only for Anyone links. You cannot share several items at once, so put them in a folder and share the folder. If an option is greyed out, an admin has restricted it.

## Make the work visible

A team site home page can show news, Quick Links, an activity feed and a document library web part. The project collaboration page suggests a Planner web part for progress, a News web part for milestones, a group calendar web part for availability and Quick Links for frequently used items. Editors enter edit mode with **Edit** in the top right and use **Republish** or **Publish** to make changes visible.

For ongoing care, Microsoft Support suggests a regular review schedule, regular news posts, checking links and web parts, using the built-in usage report and reviewing site permissions periodically.

## Notifications: alerts versus rules and Power Automate

Many teams relied on "Alert me" for files. Microsoft Support's alert page shows a banner that SharePoint alerts in Microsoft 365 are fully retired and stop working starting July 2026, and recommends rules or Power Automate. A Microsoft Q&A answer from a moderator explains the difference. Rules are created at list or library level and work on column conditions, so they cannot select one specific file. Power Automate can notify only when a specific file changes, for example with the trigger "When a file is created or modified (properties only)" plus a condition on the file.

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
