---
title: "Teams Channel vs Chat vs Team: What Is the Difference?"
summary: "What a team, a channel and a chat are in Microsoft Teams, how standard, private and shared channels differ, where files are stored, and the documented size limits that help you choose."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [teams, teams-channels, standard-channels, private-channels, shared-channels]
keypoints:
  - "A team is the container: a Microsoft 365 group with a SharePoint site and more. Channels are the topic sections inside it, where team work happens."
  - "Chats (1:1 and group) are outside any team. Files you send in a chat go to the sender's OneDrive and are shared only with people in that conversation."
  - "Files shared in a channel are stored in the team's SharePoint. Private and shared channels each get their own SharePoint site."
  - "Channel types differ in access: standard is all team members, private is selected members, shared can include people from other teams and organizations."
  - "Documented limits include 25,000 members per team, 1,000 channels per team and 250 people in a private chat."
faq:
  - q: "What is the difference between a team and a channel?"
    a: "According to Microsoft Learn, a team is a collection of people, content and tools around a project or outcome, and channels are sections within the team that organize conversations by topic, project or discipline. Creating a team creates a Microsoft 365 group, a SharePoint site and more."
  - q: "When should I use chat instead of a channel?"
    a: "Microsoft's pages read here do not give a rule. They do document the structural difference: channel conversations and files are visible to the channel's members, while files sent in a chat are shared only with the people in that conversation and are stored in the sender's OneDrive. Use that difference to decide who should see the content later."
  - q: "Where are files stored in a chat versus a channel?"
    a: "Microsoft Support says files you upload to a channel are stored in your team's SharePoint folder, while files you send in a chat go to the sender's OneDrive for Business and are shared only with the people in that conversation. Both appear under the Shared tab."
  - q: "What are the three channel types?"
    a: "Microsoft Learn lists standard channels, which all team members can access, private channels, which are limited to selected team members, and shared channels, which can include selected people inside and outside the team. Private and shared channels each have a dedicated SharePoint site."
  - q: "Are there size limits I should know about?"
    a: "Microsoft Learn's limits page lists 25,000 members per team, 1,000 channels per team including deleted ones, 5,000 members in a private channel and 250 people in a private chat. In chat, file size is limited to 100 MB and file attachments to 10 per message."
---

A team is the container, a channel is a topic area inside a team, and a chat is a conversation between specific people that sits outside any team. Pick a channel when the work belongs to a team and should stay visible to its members. Pick a chat when the conversation is for specific people only. Files follow the choice: channel files live in SharePoint, chat files in the sender's OneDrive.

## Team

Microsoft Learn describes a team as a collection of people, content and tools around a project or outcome. A team can be private (invited users only) or public (anyone in the organization can join, up to 10,000 members for public teams). Conversations, files and notes across a team's channels are visible only to team members.

Creating a team creates a Microsoft 365 group, a SharePoint site with a document library for team files, an Exchange Online shared mailbox and calendar, and a OneNote notebook. Microsoft says you can also add people from outside the organization as guests or external users, depending on settings.

## Channel

Channels are sections within a team that organize conversations by topic, project or discipline. Microsoft Learn calls them where the work actually gets done. There are three types:

| Feature | Standard | Private | Shared |
|---|---|---|---|
| Who can access | All team members | Selected team members | Selected people inside and outside the team |
| Membership limited to a subset of the team | No | Yes | Yes |
| Guests can participate | Yes | Yes | No |
| External participants (B2B direct connect) | No | No | Yes |
| Dedicated SharePoint site | No | Yes | Yes |
| Scheduled meetings | Yes | No | Yes |
| Planner | Yes | No | No |
| Bots, connectors, messaging extensions | Yes | No | No |

Microsoft's guidance in that comparison: standard channels suit open, team-wide work and offer the most extensibility. Private channels restrict access to a subset of the team and have fewer integrations. Shared channels reach people in other teams and outside the organization but do not allow guests and do not support analytics or class teams.

## Chat

Chats are one-to-one or group conversations. The Microsoft pages read here do not define the chat types in detail, so this guide limits itself to what they document:

- Files you send in chat go to the sender's OneDrive for Business and are shared only with the people in that conversation.
- A private chat can have 250 people, but only 200 members can be added to a group chat at the same time, according to Microsoft Learn's limits page.
- If a private chat has more than 20 people, features such as Outlook automatic replies, Teams status messages, typing indicators, video and audio calling, sharing and read receipts are turned off.
- Chat file size is limited to 100 MB, and a message can carry up to 10 file attachments.
- A chat post is approximately 100 KB, and Microsoft recommends keeping the message within 80 KB.
- A video or audio call from chat supports up to 20 people.

## Where files live

Microsoft Support states: files you upload to a channel are stored in your team's SharePoint folder, and files you send in a chat go to the sender's OneDrive for Business. In both cases you find them under the **Shared** tab at the top. Teams cannot connect to a personal OneDrive. Creating a new team, or a private or shared channel, creates a SharePoint team site, and each private and shared channel has its own dedicated site.

This matters for ownership. A file shared in a chat belongs to the sender's OneDrive, so it depends on that person's account. A file in a channel belongs to the team's site.

## Limits that affect your choice

From Microsoft Learn's Teams limits page:

- 25,000 members in a team. Shared channel members from outside the team count toward it. Team and channel mentions are blocked in teams over 10,000 members.
- 1,000 channels per team, including deleted channels, across standard, private and shared types.
- 5,000 members in a private channel.
- A shared channel can be shared with up to 50 teams, excluding the parent team, and has up to 5,000 direct members.
- A user is subject to a 250 object limit for creating teams, with exceptions for global admins and apps.

## How to decide

1. **Is this work for a defined group that will keep working together?** Use a team, and a channel for each topic.
2. **Should only some team members see it?** Use a private channel. It gets its own SharePoint site but has fewer integrations.
3. **Do people from other teams or organizations need to join without joining your team?** Use a shared channel.
4. **Is it a quick question or a conversation for specific people?** Use a chat. Remember that its files sit in the sender's OneDrive.
5. **Do you need guests, moderation, Planner or bots?** Standard channels support these. Shared channels do not allow guests.

## Common mistakes

- Using chats for project work, then losing the files when the sender's account is removed.
- Creating a private channel when a standard one would do. It cuts integrations such as Planner, bots and connectors.
- Expecting guests in a shared channel. Microsoft says guests cannot participate there, and external participants use B2B direct connect.
- Treating a channel count as unlimited. The limit is 1,000 per team, and deleted channels count.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams channels](https://www.m365.fm/entity/teams-channels/)
- [Private channels](https://www.m365.fm/entity/private-channels/)
- [Shared channels](https://www.m365.fm/entity/shared-channels/)

## Sources

- [Microsoft Learn: Teams and channels overview](https://learn.microsoft.com/en-us/microsoftteams/teams-channels-overview)
- [Microsoft Learn: What is Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/teams-overview)
- [Microsoft Learn: Limits and specifications for Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/limits-specifications-teams)
- [Microsoft Support: File storage in Microsoft Teams](https://support.microsoft.com/en-US/teams/files/file-storage-in-microsoft-teams)
