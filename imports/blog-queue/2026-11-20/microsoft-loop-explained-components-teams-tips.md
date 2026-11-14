---
title: "Microsoft Loop Explained: What It Is, Loop Components in Teams and Tips"
summary: "What Microsoft Loop is, how components, pages and workspaces differ, how to send a Loop component in Teams and where the content is stored, plus tips for using Loop effectively and the admin controls behind it."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [microsoft-loop, loop-workspaces, teams]
keypoints:
  - "Loop has three building blocks. Components are portable pieces of content, pages are flexible canvases in the Loop app and workspaces group everything for a project."
  - "In a Teams chat, select the Loop components icon in the compose box, choose a type, add content and select Send. Everyone in the chat can edit it inline."
  - "Type / to insert an @mention, date or component, and type // to comment instead of editing. Select Copy link to share a component in another chat or channel."
  - "Where Loop content lives depends on where it was created: OneDrive for private chats, a SharePoint site for channels and SharePoint Embedded for the Loop app."
  - "Admins control Loop components in Teams with Set-SPOTenant -IsLoopEnabled and other Loop experiences with Cloud Policy settings."
faq:
  - q: "What is Microsoft Loop?"
    a: "Microsoft Support describes Loop as a co-creation experience built from three parts. Loop components are portable pieces of content that stay in sync across the places they are shared. Loop pages are flexible canvases in the Loop app. Loop workspaces are shared spaces that group what matters for a project. You sign in at loop.cloud.microsoft with a personal or work account."
  - q: "Where are Loop components in Teams stored?"
    a: "Per Microsoft Learn, components sent in a private Teams chat are stored in the sender's OneDrive in the Microsoft Teams Chat files folder, and components in a channel are stored in the team's SharePoint site. Teams chat notes and Loop app content are stored in SharePoint Embedded containers. Components are .loop files."
  - q: "Why don't I see the Collaborate with Loop option in Teams?"
    a: "Microsoft Support says people without a valid OneDrive license will not see the Collaborate with Loop option. If you were recently assigned a OneDrive license, restart Teams. Microsoft Learn also lists an Exchange Online mailbox as required for @mentions."
  - q: "Can I share a Loop page with external guests?"
    a: "The Microsoft Support getting-started page says Loop does not currently support external sharing for guests or external users. The pages I read do not give a date for any change, so check the current page before you plan around it."
  - q: "How can an admin turn Loop off?"
    a: "Microsoft Learn says Loop components in Teams chats and channels are controlled with the SharePoint PowerShell setting Set-SPOTenant -IsLoopEnabled, which is tenant-wide and on by default. Loop workspaces and components in Outlook, OneNote and Whiteboard are controlled with Cloud Policy settings. These controls govern creation and do not restrict access to existing Loop files."
---

Microsoft Loop is a co-creation tool made of three parts: Loop components that you can drop into Teams, Outlook, OneNote and Whiteboard, Loop pages in the Loop app, and Loop workspaces that collect a project's pages. In Teams, the part most people meet first is the component: a table, checklist or paragraph that everyone in a chat can edit and that stays in sync wherever it is pasted.

## The three building blocks

Microsoft Support defines them this way:

- **Loop components** are portable pieces of content that stay in sync across all the places they are shared. They can be lists, tables, notes and more, and they work in Teams, Outlook, OneNote, Whiteboard and the Loop app.
- **Loop pages** are flexible canvases in the Loop app where you combine people, components, links, tasks and data.
- **Loop workspaces** are shared spaces that group everything important to a project.

You reach the Loop app at loop.cloud.microsoft with a personal or work account. It is also available as a web, iOS and Android app.

## Send a Loop component in a Teams chat

The Teams support article gives these desktop steps:

1. Open **Chat** and select the chat.
2. In the compose box, select the **Loop components** icon.
3. Choose the component type, such as a paragraph, table or checklist.
4. Add your content.
5. Select **Send**.

Everyone in the chat can then edit the content inline. Changes appear for all of them.

### Tips that make components useful

- **Comment instead of editing.** Type **//** to comment on existing text. The comment is attributed to you. Type **/** to insert an @mention, a date or another component.
- **Share into another place.** Select **Copy link** in the upper-right corner of the component and paste it into another chat or channel. People in both places can edit.
- **Check who sees it.** The **See who has access** button shows who can view or edit.
- **Keep it visible.** Microsoft suggests pinning the message that holds the component, using **More options** > **Pin**.
- **Open the file.** Select the linked name at the top of the component to open it on Office.com for viewing and co-editing.

One setting surprises admins. Microsoft Learn says Loop components are always shared as editable by others, even when the tenant defaults other file types to view-only.

## Loop workspaces in a Teams channel

A workspace in a standard channel keeps documents next to the conversation. To create one, select the plus sign in a standard channel header, choose **Apps**, search for **Loop**, enter a workspace name and select **Create**. To reuse one, follow the same path and pick it under **Workspaces**.

According to Microsoft Support, channel members automatically get access, team owners become workspace owners, and the workspace inherits the team's sensitivity label. Invites and workspace links are not available for channel workspaces, and a channel workspace cannot be deleted on its own. Deleting the team deletes it, and you can delete individual pages. This feature is limited to standard channels.

## Where Loop content is stored

Loop content is not in one place. Microsoft Learn says it depends on where you create it.

| Created in | Stored in |
|---|---|
| Loop app, any workspace | SharePoint Embedded container |
| Teams chat notes | SharePoint Embedded container |
| Teams private chat | User's OneDrive, Microsoft Teams Chat files folder |
| Teams private meeting | User's OneDrive, Meetings folder |
| Teams channel or channel meeting | SharePoint site, channel folder or Meetings folder |
| Outlook email | User's OneDrive, Attachments folder |
| OneNote | User's OneDrive, OneNote Loop files folder |
| Whiteboard | User's OneDrive, Whiteboard\Components folder |

Components are .loop files. Earlier releases used .fluid. All Loop storage counts against the organization's SharePoint quota, and each Loop workspace has a maximum size of 25 TB that cannot be changed.

## Requirements and typical problems

- **Licenses.** Loop components need a OneDrive or SharePoint license. Loop workspaces need a license with the Loop workspaces service plan.
- **Mailbox.** An Exchange Online mailbox is required for @mentions and workspace sharing.
- **Network.** Real-time collaboration needs WebSocket traffic to *.svc.ms and *.office.com.
- **Missing Collaborate with Loop option.** This usually means no valid OneDrive license. Restart Teams after a new license.
- **"We couldn't save the Loop workspace and pages you've created."** Microsoft Support says a personal account must sign in to outlook.com once. A work or school account needs an Exchange Online mailbox, not a shared mailbox, and at least read access to the organization's SharePoint Online root site.
- **Guests.** Loop does not currently support external sharing for guests or external users.

## Admin controls

Learn says Loop components need both Cloud Policy and SharePoint PowerShell for full control. Components in Teams chats and channels use `Set-SPOTenant -IsLoopEnabled`, which is tenant-wide and on by default. Collaborative meeting notes use `-IsCollabMeetingNotesFluidEnabled`. Loop workspaces use the Cloud Policy setting **Create Loop workspaces in Loop**, which can also be set under **Org settings** > **Services** > **Loop** in the admin center. Cloud Policy changes can take up to 90 minutes, or up to 24 hours if no policies existed before. These controls only govern creation. To restrict access to existing content, Microsoft points to Conditional Access, and to restrict collaboration between groups it points to Information Barriers.

Availability also varies by cloud. Loop workspaces are listed as unavailable in US government clouds, while Loop components in Teams are available in commercial and US government clouds.

The Learn Loop overview page itself did not load when I wrote this, so the admin and storage details come from the requirements, storage and manage-components pages.

## Related

- [Microsoft Loop](https://www.m365.fm/entity/microsoft-loop/)
- [Loop workspaces](https://www.m365.fm/entity/loop-workspaces/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Microsoft Support: Get started with Microsoft Loop](https://support.microsoft.com/en-us/loop/get-started-with-microsoft-loop)
- [Microsoft Support: Get to know Loop components](https://support.microsoft.com/en-us/loop/get-to-know-loop-components)
- [Microsoft Support: Send a Loop component in Microsoft Teams chats](https://support.microsoft.com/en-us/topic/ee2a584b-5785-4dd6-8a2d-956131a29c81)
- [Microsoft Support: Loop workspaces in Teams channels](https://support.microsoft.com/en-US/Loop/loop-workspaces-in-teams-channels)
- [Microsoft Learn: Loop requirements](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements)
- [Microsoft Learn: Loop storage](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-storage)
- [Microsoft Learn: Manage Loop components](https://learn.microsoft.com/en-us/sharepoint/manage-loop-components)
