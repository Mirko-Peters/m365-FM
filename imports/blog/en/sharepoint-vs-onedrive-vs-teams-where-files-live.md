---
title: "SharePoint vs OneDrive vs Teams: Where Your Files Actually Live"
summary: "Teams is where you work, but the files sit in SharePoint or OneDrive. Learn where channel files, chat files and meeting recordings are stored, who can see them and which tool to use when."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams, sharepoint, onedrive]
keypoints:
  - "Teams does not store files itself. Channel files are stored in the SharePoint site of the team, chat files in the sender's OneDrive."
  - "Meeting recordings of regular meetings go to the organizer's OneDrive. Recordings of channel meetings go to a Recordings folder in the channel's SharePoint site."
  - "OneDrive files are private until you share them. SharePoint access follows site permissions, so people with site access can open the documents in it."
  - "Use OneDrive for work in progress, SharePoint for files a team or the organization owns, and the Teams Files tab as a window onto both."
  - "Before you move a file, check who has access. Moving a file from OneDrive to a channel changes who can open it."
faq:
  - q: "Where are files stored when I upload them to a Teams channel?"
    a: "In the SharePoint document library of the team. Microsoft Support says files you upload to a channel are stored in your team's SharePoint folder. Open the channel and select the Shared tab to see them."
  - q: "Where are files stored when I send them in a Teams chat?"
    a: "In the sender's OneDrive for Business, shared only with the people in that conversation, according to Microsoft Support. Open the chat and select the Shared tab to see them."
  - q: "Where is a Teams meeting recording saved?"
    a: "Microsoft Learn says recordings of regular meetings are uploaded to the organizer's OneDrive. Recordings of channel meetings are stored in the Recordings folder of the channel's SharePoint site. Events use video on demand and have their own publishing process."
  - q: "Can Teams use my personal OneDrive?"
    a: "No. Microsoft Support says the OneDrive files in Teams are OneDrive for Business files tied to your work or school account. Teams can't connect to a personal OneDrive."
  - q: "Should I keep a file in OneDrive or SharePoint?"
    a: "Keep files you are still working on alone in OneDrive. Put files a team, department or the whole company needs in a SharePoint site, so access doesn't depend on one person's account."
---

People ask "Where is this file?" more often than any other Teams question. The short answer is that Teams is a front door. It shows files, but the storage behind it is SharePoint for team content and OneDrive for personal and chat content. If you know which one holds your file, you know who can open it, what happens when someone leaves and where to look when it vanishes.

## The short version

| | Teams | SharePoint | OneDrive |
|---|---|---|---|
| What it is | Place to chat, meet and call | Storage and sites for teams and organizations | Personal storage for work files |
| Who sees files by default | Members of the team or chat | People with access to the site | Only you, until you share |
| Who owns the files | Teams stores none itself | The team or site | You |

Microsoft Support describes the three the same way. Teams is for conversations, calls, meetings and file collaboration in one place. SharePoint is cloud storage for files shared with a team, group or organization, plus team sites. OneDrive is personal cloud storage for work in progress, and documents placed there are private until you share them.

## Where files go in Teams

### Channel files

Files you upload to a channel are stored in the SharePoint folder of your team. Microsoft says every Teams team has a SharePoint team site, and the site is created automatically when you create a team or a private channel. In the channel, the **Shared** tab shows the files.

Permissions are granted at site level, not per document. Microsoft says that if people have access to the team site, they have access to the documents in it. So adding someone to the team gives them the channel files.

### Chat files

Files you send in a chat are stored in your **OneDrive for Business** and shared only with the people in that conversation. Open the chat and select the **Shared** tab to find them. The **OneDrive** icon on the left side of Teams shows your own OneDrive, where you can search and filter.

This has a practical effect: the file sits in one person's OneDrive, not in the team's storage. What happens to it when that person leaves depends on your organization's rules for departed users, so ask your admin before you rely on chat files for anything important.

### Meeting recordings

Microsoft Learn is clear about where recordings go:

- **Regular meetings:** uploaded to the organizer's OneDrive. People invited to the meeting can view the recording. Guests and external attendees can view it only if it is explicitly shared with them.
- **Channel meetings:** saved to a **Recordings** folder in the channel's SharePoint site. File permissions follow the channel's SharePoint permissions.
- **Events:** use video on demand to publish recordings, and have their own process.

Learn also says that for regular meetings you should make sure the organizer's OneDrive is available and has enough storage. If a recording can't be uploaded, it is stored temporarily and must be downloaded within 21 days, otherwise it is deleted. For more on recording see our article on recording a Teams meeting.

### Your OneDrive inside Teams

You can add a file from your OneDrive to a channel using the **Files** tab. The OneDrive files in Teams are OneDrive for Business files tied to your work or school account. Teams can't connect to a personal OneDrive.

## When to use which

**Use OneDrive when** the file is yours: a draft, a personal notes file, something you are not ready to show. It is private until you share it, you can co-author Office documents with the people you share it with, and it syncs to your devices.

**Use SharePoint when** the file belongs to a team or the company: policies, project documents, templates, finished deliverables. Access follows the site, ownership can be spread across several people and features such as retention policies and document workflows are available.

**Use Teams** as the place where people find both. Post the file in a channel or chat so the conversation and the document stay together.

A simple rule: draft in OneDrive, publish in SharePoint, discuss in Teams.

## Mistakes to avoid

- **Treating a chat as an archive.** Chat files sit in one person's OneDrive. Move anything important to the team site.
- **Sharing a OneDrive file with "everyone" instead of moving it.** A link to a personal file still depends on the owner's account. If the file is a team asset, move it to SharePoint.
- **Assuming a channel file is only for people in the channel.** Access follows the site, as described above. Check the team's permissions, especially for private or shared channels, before putting sensitive files in.
- **Ignoring storage on OneDrive for recordings.** If the organizer's OneDrive is full, recordings can fail to upload.

## Quick checks when a file is missing

1. Open the **Shared** tab of the channel or chat where you saw it.
2. Check the **OneDrive** icon in Teams for files shared in chats.
3. Open the team's site in SharePoint and look in the document library, including the **Recordings** folder for channel meetings.
4. Ask the sender whether they moved or deleted it, or whether their account changed.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Microsoft Support: Collaborating with Teams, SharePoint and OneDrive](https://support.microsoft.com/en-us/office/collaborating-with-teams-sharepoint-and-onedrive-9ea6aa07-6e5e-4917-9267-d4d361da3dea)
- [Microsoft Support: File storage in Microsoft Teams](https://support.microsoft.com/office/file-storage-in-teams-df5cc0a5-d1bb-414c-8870-46c6eb76686a)
- [Microsoft Learn: Teams meeting recording](https://learn.microsoft.com/en-us/microsoftteams/cloud-recording)
