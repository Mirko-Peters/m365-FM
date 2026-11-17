---
title: "SharePoint vs OneDrive vs Teams: Where Your Files Actually Live"
summary: "Teams is where you work, but the files sit in SharePoint or OneDrive. Learn where channel files, chat files and meeting recordings are stored, who can see them, what happens when someone leaves and which tool to use when."
status: approved
publish: true
author: mirko-p
date: 2026-11-18
topics: [teams, sharepoint, onedrive]
keypoints:
  - "Teams does not store files itself. Files in a standard channel go to the team's SharePoint folder. Private and shared channels each have their own SharePoint site. Chat files go to the sender's OneDrive."
  - "Recordings of regular meetings go to the organizer's OneDrive. Recordings of channel meetings go to the Recordings folder in the channel's SharePoint site, or to Recordings\\View only if your admin blocks channel recording downloads."
  - "OneDrive files are private until you share them. SharePoint permissions are normally granted per site, not per document."
  - "Use OneDrive for work in progress and SharePoint for files a team or the organization owns. In a standard channel, every member of the team can reach the channel files, so check who that is before you upload."
  - "If someone leaves, their OneDrive (including the chat files in it) follows the OneDrive deletion process: by default the manager gets access and the content is kept 30 days, then moved to the site collection recycle bin for a further 93 days."
faq:
  - q: "Where are files stored when I upload them to a Teams channel?"
    a: "For a standard channel, in your team's SharePoint folder, according to Microsoft Support. Private and shared channels each have a dedicated SharePoint site, according to Microsoft Learn. Open the channel and look at the Shared tab (Microsoft Support) or Files tab (Microsoft Learn) to see them."
  - q: "Where are files stored when I send them in a Teams chat?"
    a: "In the sender's OneDrive for Business, shared only with the people in that conversation, according to Microsoft Support. Open the chat and select the Shared tab to see them."
  - q: "Where is a Teams meeting recording saved?"
    a: "Microsoft Learn says recordings of regular meetings are uploaded to the organizer's OneDrive. Recordings of channel meetings are saved to a Recordings folder in the channel's SharePoint site by default. If your admin sets ChannelRecordingDownload to Block, they go to a Recordings\\View only folder instead. Events use video on demand and have their own publishing process."
  - q: "Can Teams use my personal OneDrive?"
    a: "Not currently. Microsoft Support says Teams can't currently connect to your personal OneDrive. The OneDrive files in Teams are OneDrive for Business files tied to your work or school account."
  - q: "Should I keep a file in OneDrive or SharePoint?"
    a: "Keep files you are still working on alone in OneDrive. Put files a team, department or the whole company needs in a SharePoint site, so access doesn't depend on one person's account."
  - q: "What happens to a file in OneDrive when its owner leaves?"
    a: "Microsoft Learn says the OneDrive cleanup starts when the user account is deleted from Microsoft Entra ID. Blocking sign-in or removing the license doesn't start it. By default the user's manager gets access, and the default retention period is 30 days, which admins can change. Retention policies and holds can change this."
---

People ask "Where is this file?" more often than any other Teams question. The short answer is that Teams is a front door. It shows files, but the storage behind it is SharePoint for team content and OneDrive for personal and chat content. If you know which one holds your file, you know who can open it, what happens when someone leaves and where to look when it vanishes.

## The short version

| | Teams | SharePoint | OneDrive |
|---|---|---|---|
| What it is | Place to chat, meet and call | Storage and sites for teams and organizations | Personal storage for work files |
| Where its files are | Teams stores none itself | In the site | In your own storage |
| Who sees files by default | Depends on where the file is stored | People with access to the site | Only you, until you share |

Microsoft Support describes the three differently. Documents shared in Teams are stored in SharePoint. Microsoft Support recommends granting SharePoint permissions on a site basis instead of on individual documents. Documents you place in OneDrive are private until you share them.

## Where files go in Teams

### Channel files

Files you upload to a standard channel are stored in your team's SharePoint folder, according to Microsoft Support. Microsoft Learn says a team site in SharePoint is created automatically when you create a team or a private or shared channel.

Private and shared channels are different. Learn's channel comparison says each of them has a dedicated SharePoint site, and a standard channel does not. Their membership can be limited to a subset of the team, and a shared channel can include people outside the team. So the people who can open files in a private or shared channel depend on that channel, not on the whole team.

Permissions are normally granted at site level, not per document, although SharePoint can also set permissions on single files. For a standard channel, adding someone to the team gives them the channel files. For a private or shared channel, adding someone to the team does not.

In a channel, Microsoft Support points you to the **Shared** tab at the top. Microsoft Learn and another Support page still say **Files** tab. You may see either name, depending on your Teams version.

### Chat files

Files you send in a chat are stored in your **OneDrive for Business** and shared only with the people in that conversation. Open the chat and select the **Shared** tab to find them. The **OneDrive** icon on the left side of Teams shows your own OneDrive, where you can search and filter.

The file sits in one person's OneDrive, not in the team's storage. That matters when someone leaves, as the next section shows.

### What happens when someone leaves

Because chat files live in the sender's OneDrive, they follow the OneDrive deletion process. Microsoft Learn describes it like this:

- The cleanup starts when the user account is deleted from Microsoft Entra ID. Blocking sign-in or removing the license does not start it.
- By default, the user's manager gets access to the OneDrive and receives an email about it. If no manager is set but a secondary owner is, that person gets the email.
- The default retention period is 30 days, and admins can change it in the SharePoint admin center. Seven days before it ends, a reminder email is sent.
- Microsoft 365 retention policies and retention labels take precedence, so content can be deleted earlier or kept longer. An eDiscovery hold stops the deletion until the hold is removed.

Files in a team's SharePoint site are stored with the team's site, not in one person's OneDrive. Ask your admin how your organization handles departed users.

### Meeting recordings

Microsoft Learn is clear about where recordings go:

- **Regular meetings:** uploaded to the organizer's OneDrive. People invited to the meeting can view the recording. Guests and external attendees can view it only if it is explicitly shared with them.
- **Channel meetings:** saved by default to a **Recordings** folder in the channel's SharePoint site. File permissions follow the channel's SharePoint permissions. If your admin sets the policy parameter `ChannelRecordingDownload` to `Block`, recordings go to a **Recordings\View only** folder instead. Channel owners have full access there, and channel members can only view them, without download or edit.
- **Events:** use video on demand to publish recordings, and have their own process.

Learn also says that for regular meetings you should make sure the organizer's OneDrive is available and has enough storage. If a recording can't be uploaded, it is stored temporarily and must be downloaded within 21 days, otherwise it is deleted.

### Your OneDrive inside Teams

Microsoft Support says a file stored in OneDrive can also be added to a Teams channel by using the **Files** tab in Teams. The OneDrive files in Teams are OneDrive for Business files tied to your work or school account. Teams can't currently connect to a personal OneDrive.

## When to use which

**Use OneDrive when** the file is yours: a draft, a personal notes file, something you are not ready to show. It is private until you share it.

**Use SharePoint when** the file belongs to a team or the company: policies, project documents, templates, finished deliverables. Access normally follows the site, so it doesn't depend on one person's account.

**Use Teams** as the place where people find both. Post the file in a channel or chat so the conversation and the document stay together.

A simple rule: draft in OneDrive, publish in SharePoint, discuss in Teams.

## Mistakes to avoid

- **Treating a chat as an archive.** Chat files sit in one person's OneDrive. Move anything important to the team site.
- **Sharing a OneDrive file with "everyone" instead of moving it.** A link to a personal file still depends on the owner's account. If the file is a team asset, move it to SharePoint.
- **Assuming a channel file is only for people in the channel.** In a standard channel, files are in the team's SharePoint folder, so check who is in the team before you upload anything sensitive. Private and shared channels have their own site, so check that channel's members instead.
- **Ignoring storage on OneDrive for recordings.** If the organizer's OneDrive is full, recordings can fail to upload.

## Quick checks when a file is missing

1. Open the **Shared** (or **Files**) tab of the channel or chat where you saw it.
2. Check the **OneDrive** icon in Teams for files shared in chats.
3. Open the team's site in SharePoint and look in the document library, including the **Recordings** folder (or **Recordings\View only**) for channel meetings. Private and shared channels have their own sites.
4. Ask the sender whether they moved or deleted it, or whether their account changed.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Microsoft Support: Collaborating with Teams, SharePoint and OneDrive](https://support.microsoft.com/en-us/office/collaborating-with-teams-sharepoint-and-onedrive-9ea6aa07-6e5e-4917-9267-d4d361da3dea)
- [Microsoft Support: File storage in Microsoft Teams](https://support.microsoft.com/office/file-storage-in-teams-df5cc0a5-d1bb-414c-8870-46c6eb76686a)
- [Microsoft Learn: Teams channels overview](https://learn.microsoft.com/en-us/microsoftteams/teams-channels-overview)
- [Microsoft Learn: Teams meeting recording](https://learn.microsoft.com/en-us/microsoftteams/cloud-recording)
- [Microsoft Learn: OneDrive retention and deletion](https://learn.microsoft.com/en-us/onedrive/retention-and-deletion)
