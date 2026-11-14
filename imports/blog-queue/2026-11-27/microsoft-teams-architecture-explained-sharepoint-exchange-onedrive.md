---
title: "Microsoft Teams Architecture Explained: Where Teams Uses SharePoint, Exchange and OneDrive"
summary: "How Teams is built on Microsoft 365 groups, and where chats, channel files, private files and meeting recordings are stored across SharePoint, Exchange and OneDrive, with the admin consequences."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [teams, sharepoint, exchange-online, onedrive]
keypoints:
  - "Teams is built on Microsoft 365 groups and Microsoft Graph, and uses identities in Microsoft Entra ID."
  - "Creating a team creates a Microsoft 365 group, a SharePoint site and document library, an Exchange Online shared mailbox and calendar, and a OneNote notebook."
  - "Files on a channel's Files tab are stored in SharePoint. Standard channels share the team's site, while private and shared channels each get their own site."
  - "Chat and channel messages use an Azure-powered chat service as primary storage, with copies in hidden Exchange mailbox folders for compliance."
  - "Meeting recordings go to the organizer's OneDrive, or to SharePoint for channel meetings."
  - "Microsoft recommends managing all permissions for a team's SharePoint site through Teams."
faq:
  - q: "What gets created when I create a team?"
    a: "According to Microsoft Learn, creating a team creates a new Microsoft 365 group, a SharePoint site and document library for team files, an Exchange Online shared mailbox and calendar, and a OneNote notebook. Teams also ties into other Microsoft 365 apps such as Planner and Power BI."
  - q: "Where are files shared in a Teams channel stored?"
    a: "In SharePoint. Microsoft Learn says the Files tab on each standard channel is a folder in the parent site's default document library, while each private or shared channel has its own SharePoint site and its Files tab is connected to that site's default document library."
  - q: "Where are Teams chat messages stored?"
    a: "Microsoft Learn states that Teams uses an Azure-powered chat service as primary storage for chats and channel messages. Data copied from chats is also stored in a hidden folder in each participant's mailbox, and channel message data in a hidden folder in a group mailbox, which compliance administrators can search with eDiscovery tools."
  - q: "Where do Teams meeting recordings go?"
    a: "Microsoft Learn says a recording is uploaded to the meeting organizer's OneDrive for private meetings, or to SharePoint for channel meetings. Channel meeting recordings are saved to a Recordings folder in the channel's SharePoint site."
---

Teams does not store everything in one place. It is a front end on top of Microsoft 365 services. Team membership lives in a Microsoft 365 group, channel files live in SharePoint, personal and chat-related files live in OneDrive, and message data is held by an Azure-powered chat service with compliance copies in Exchange mailboxes. Knowing which service holds what explains most permission, retention and recovery questions.

## The base layer: groups and identities

Microsoft Learn says Teams is built on Microsoft 365 groups, Microsoft Graph and the same security, compliance and manageability as the rest of Microsoft 365. Teams uses identities stored in Microsoft Entra ID.

When you create a team, these items are created:

- A new Microsoft 365 group.
- A SharePoint site and document library for team files.
- An Exchange Online shared mailbox and calendar.
- A OneNote notebook.

Teams also ties into Planner and Power BI. If you create a team from an existing group, the group's membership, site, mailbox and notebook appear in Teams.

## SharePoint: channel files and team sites

The Teams and SharePoint integration article calls the site a Teams-connected site. Each team's membership is stored in the Microsoft 365 group, and that group also gives people access to the parent SharePoint site.

How channel types map to sites:

| Channel type | SharePoint site | Who has site access |
|---|---|---|
| Standard | Shares the team's parent site. Each channel is a folder in the default document library | Team owners and members |
| Private | Its own channel site, with the Files tab connected to the default library | Only channel members |
| Shared | Its own channel site | Only channel members |

Four events connect a site: creating a team from scratch, creating a team from an existing group, adding Teams to an existing SharePoint site, and creating a private or shared channel.

### Permissions follow Teams

For the parent site, team permissions are synced with the site. Team and site owners can add people directly to the site, but Microsoft recommends managing all permissions through Teams. Channel site permissions are inherited from the channel and shown read-only in SharePoint. A private channel site cannot be shared separately.

Some settings are managed elsewhere:

| Setting | Where |
|---|---|
| Site permissions | Teams (read-only in SharePoint for channel sites) |
| Guest access expiration | SharePoint admin center |
| Site quota and default sharing link type | SharePoint admin center |
| Sensitivity | Applied to the team or the parent site, and inherited by channel sites |

## Exchange: mailbox, calendar and message data

The team's shared mailbox and calendar are part of the group. For messages, Microsoft Learn describes two layers. Teams uses an Azure-powered chat service as primary storage for all chats and channel messages. Exchange mailboxes also hold data copied from these messages. Chat data goes to a hidden folder in the mailbox of each user in the chat. Channel message data goes to a similar hidden folder in a group mailbox. The folders are not designed to be accessed directly by users or administrators. They hold data that compliance administrators can search with eDiscovery tools.

Mailbox types hold different data, per the retention article:

- **UserMailbox:** cloud users, and private channels before migration.
- **MailUser:** on-premises Teams users.
- **GroupMailbox:** standard channels, and private channels after migration.
- **SubstrateGroup:** shared channels.

When messages are deleted by a retention policy, they are removed from both the Exchange mailboxes and the chat service.

## OneDrive: personal and chat-related files

Microsoft Learn describes OneDrive as the place for files shared with people a user invites. Content a user saves there is private until it is shared, which makes it suited to personal and draft documents. The retention article adds that for files and meeting recordings and transcripts from user chats, a retention policy must include the organizer's OneDrive account as the location. Files from channels follow the group or SharePoint locations instead.

## Meeting recordings

The recording page states that a recording is uploaded to the organizer's OneDrive for private meetings, or to SharePoint for channel meetings. Channel meeting recordings and transcripts go to a **Recordings** folder in the channel's SharePoint site. If the channel recording download is blocked, they go to **Recordings\View only**. If an upload fails, the recording is stored temporarily in async media storage and must be downloaded within 21 days, otherwise it is deleted.

## What this means in practice

- **Access problems with files:** check the SharePoint site and the Microsoft 365 group, not only Teams.
- **Private channel files:** they are in a separate site. Look there, not in the parent site.
- **Retention and eDiscovery:** messages and files need separate policies. Retention policies for Teams do not cover files, which have their own policies on Microsoft 365 group and SharePoint locations, plus OneDrive for chat files.

## Common mistakes

- Adding people directly to the parent SharePoint site and expecting them to see the team.
- Looking for private channel files in the team's site.
- Assuming a Teams retention policy also governs files.
- Expecting to browse the hidden Exchange folders. They are for compliance search.

## What the documentation does not say

The Learn pages read do not name exact OneDrive folders for chat files, and the Teams overview page does not describe channel types. The architecture diagram that the training module refers to is not available as text. The one-page view above combines several Microsoft pages, so confirm details for your own tenant in the Teams admin center and SharePoint admin center.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Teams overview (Microsoft Learn)](https://learn.microsoft.com/en-us/MicrosoftTeams/Teams-overview)
- [Illustrate Microsoft Teams architecture (Microsoft Learn training)](https://learn.microsoft.com/en-us/training/modules/explore-teams/5-architecture)
- [Overview of Teams and SharePoint integration](https://learn.microsoft.com/en-us/sharepoint/teams-connected-sites)
- [How Teams interacts with SharePoint and OneDrive](https://learn.microsoft.com/en-us/microsoftteams/sharepoint-onedrive-interact)
- [Learn about retention for Microsoft Teams](https://learn.microsoft.com/en-us/purview/retention-policies-teams)
- [Teams meeting recording](https://learn.microsoft.com/en-us/microsoftteams/cloud-recording)
- [Teams channels overview](https://learn.microsoft.com/en-us/microsoftteams/teams-channels-overview)
