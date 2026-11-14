---
title: "Microsoft Teams Mistakes Most People Make (and How to Fix Them)"
summary: "Common Microsoft Teams mistakes with fixes, each tied to Microsoft documentation: chat versus channels, where files are stored, notifications, team owners, channel names and lifecycle."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [teams, teams-channels, onedrive, sharepoint]
keypoints:
  - "Use channels for topics that the whole team should see. Microsoft describes chats as private conversations that are not relevant to the members of a team or channel."
  - "Files sent in chat are stored in the sender's OneDrive for Business. Files uploaded to a channel are stored in the team's SharePoint folder."
  - "Microsoft recommends at least two team owners to cover absence or reassignment."
  - "Renaming a channel does not rename its SharePoint folder, so choose channel names carefully before you create them."
  - "Notification defaults are described differently on two Microsoft pages, so check Settings > Notifications yourself."
faq:
  - q: "When should I use a channel instead of a chat?"
    a: "Microsoft Learn says channels hold conversations visible to a team's members, dedicated to a topic, department or project. Chats are private one-on-one or group conversations for discussions that are not relevant to the members of a team or channel."
  - q: "Where are files stored when I share them in chat?"
    a: "Microsoft Support says files you send in chat are stored in your OneDrive for Business and shared only with the people in that conversation. Files you upload to a channel are stored in your team's SharePoint folder."
  - q: "How many owners should a team have?"
    a: "Microsoft Learn says it is optimal to identify at least two team owners, to account for absence or reassignment. It also states that a team can have as many as 100 owners."
  - q: "Does renaming a channel rename the SharePoint folder?"
    a: "No. Microsoft Learn warns that renaming a channel in the team does not rename the corresponding folder in the SharePoint document library, which can confuse users."
  - q: "How can I stop notification overload?"
    a: "Microsoft Support describes global settings under Settings and more > Settings > Notifications and activity, and per-channel settings under More channel options > Manage notifications. An @mention still notifies you even if you muted a channel or conversation, according to Microsoft Learn."
---

Most Teams problems come from a few habits: private chats for team topics, files scattered across personal storage, unmanaged notifications, teams with one owner and no lifecycle plan. The fixes below are limited to what Microsoft documents. The claim that nearly everyone uses Teams wrong is a video hook, not a Microsoft statement, so this article treats each item as a checkable practice.

## Mistake 1: Using chat for topics the team needs to see

Microsoft Learn describes channels as conversations visible to a team's members, with teams built around projects or topics and channels dedicated to a specific topic, department or project. Conversations, files and meetings all take place in channels. Chats are private one-on-one or group conversations for discussions "that aren't relevant to the members of a team or channel."

**Fix:** Post project updates, decisions and questions in the channel, so new members can find them. Keep chat for side conversations that do not concern the wider team.

## Mistake 2: Not knowing where files end up

Microsoft Support states that files you upload to a channel are stored in your team's SharePoint folder and appear in the **Shared** tab at the top of the channel. Files you send in chat are stored in your OneDrive for Business and only shared with the people in that conversation, and appear in the **Shared** tab of the chat.

| Where you share | Where the file is stored | Who sees it |
|---|---|---|
| Channel | Team's SharePoint folder | Per Microsoft Support, others get access to the content through the team. The page does not detail channel access rules. |
| Chat | Sender's OneDrive for Business | People in that conversation |

**Fix:** Put shared working files in the channel, so they sit in the team's SharePoint folder and not in one person's storage. Microsoft Support also notes that the OneDrive files you see in Teams are OneDrive for Business files tied to your Microsoft 365 account, and that Teams cannot connect to your personal OneDrive.

## Mistake 3: Leaving notifications on defaults

Microsoft documents several controls. According to Microsoft Support:

- **Global:** select **Settings and more** (...), then **Settings > Notifications and activity**.
- **Per channel:** select **More channel options** (...) next to the channel name, then **Manage notifications**.
- **Threads layout:** **Include thread replies** and **Follow all new threads** control what you follow.
- **Quick views** at the top of your list, such as @mentions and Followed threads, can be set to **Always** or **When unread**.

A Microsoft Learn training unit adds channel notification choices of **All activity**, **Mentions & replies** and **Custom**, and says an @mention still notifies you even when you muted a channel or conversation. It also says notifications expire from the activity feed after 14 days.

The two pages disagree on defaults. The training unit says by default you receive desktop and activity feed alerts for @mentions, direct messages and all new conversations in your teams list, and then also says channel @mentions are off by default and new posts appear only in Activity. The Support article does not state defaults. Check your own settings rather than assuming.

**Fix:** Decide which channels need alerts, mute the rest and rely on @mentions for urgent items.

## Mistake 4: Teams with a single owner

Microsoft Learn says it is optimal to identify at least two team owners to account for absence or reassignment. It lists a maximum of 100 owners per team, and notes that the creator automatically becomes an owner.

**Fix:** Add a second owner to every team, so one absence does not leave the team without someone who can manage it.

## Mistake 5: Naming channels carelessly

Microsoft Learn advises considering channel names before you create them, because renaming a channel does not rename the corresponding folder in the SharePoint document library. Users then see a channel name that no longer matches its folder.

**Fix:** Agree on channel names with the team first. Deleting a channel does not delete the folder or its contents from the SharePoint document library either, per the same page.

## Mistake 6: Creating teams without a purpose or access decision

The lifecycle page lists decision points before creation: the team's purpose, its members, private or public access, whether members can add themselves or owners add them, and who can create channels or add tabs, bots and connectors. It describes private teams, with owner-approved membership, as typical for project teams. It calls public teams, which anyone in the organization can join, a good default for smaller organizations.

**Fix:** Write down purpose and access before the team exists. Microsoft also says governance items such as naming conventions and expiration policies are much easier to implement before scaling a deployment.

## Mistake 7: No plan for inactive teams

Microsoft Learn says you can use expiration and retention policies together with archiving to reduce exposure from teams that are no longer active or whose owners have left. Deleted teams are soft deleted and IT can reverse that for up to 30 days. Channels can also be restored for up to 30 days. Retention policies may prohibit deleting a team.

**Fix:** Ask admins whether expiration, retention and archiving policies exist in your tenant, and archive finished teams instead of leaving them open.

## Quick checklist

1. Team topics go in channels, side topics in chats.
2. Working files go in the channel.
3. Review **Settings > Notifications** and the per-channel settings.
4. Every team has at least two owners.
5. Channel names are agreed before creation.
6. Each team has a stated purpose and an access type.
7. Finished teams are archived under the tenant's lifecycle policy.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams channels](https://www.m365.fm/entity/teams-channels/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: How to collaborate with Microsoft Teams](https://learn.microsoft.com/en-us/training/modules/introduction-to-collaborating-microsoft-teams/3-how-to-collaborate)
- [Microsoft Learn: Manage notifications (Collaborate in teams and channels)](https://learn.microsoft.com/en-us/training/modules/collaborate-teams-channels-microsoft-teams/7-manage-notifications)
- [Microsoft Learn: Plan for lifecycle management in Teams](https://learn.microsoft.com/microsoftteams/plan-teams-lifecycle)
- [Microsoft Support: File storage in Microsoft Teams](https://support.microsoft.com/office/file-storage-in-teams-df5cc0a5-d1bb-414c-8870-46c6eb76686a)
- [Microsoft Support: Manage channel notifications in Microsoft Teams](https://support.microsoft.com/office/customize-channel-notifications-in-teams-c72b8c07-37e1-4a0b-82c9-fdfda04f15b2)
