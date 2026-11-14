---
title: "Teams Shared Channels: How They Work and When to Use Them"
summary: "What shared channels are, how they differ from standard and private channels, who can join (including B2B direct connect), how to create one, the documented limits, and what is not supported."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [shared-channels, teams-channels, private-channels]
keypoints:
  - "A shared channel lets people join without being added to the team, including people in other organizations through B2B direct connect. Guests cannot be added."
  - "Only members of the shared channel can see it. It stays linked to its host team and cannot be moved or converted to a standard or private channel."
  - "Each shared channel has its own SharePoint site, and its messages live in a dedicated system mailbox, not the team's group mailbox."
  - "Documented limits: up to 1,000 shared channels per team, 50 teams a channel can be shared with, and 5,000 direct members per shared channel."
  - "Standard channels keep moderation, Planner and app integrations. Shared channels do not, and they are not supported in class teams."
faq:
  - q: "What is a shared channel in Microsoft Teams?"
    a: "Microsoft Learn describes shared channels as collaboration spaces where you can invite people who are not in the team. Only owners and members of the shared channel can access it. It links to its parent team and cannot be moved to a different team or converted to a standard channel."
  - q: "How is a shared channel different from a private channel?"
    a: "Microsoft's comparison table says people can be added to a shared channel without adding them to the team, and it can be shared with other teams. A private channel cannot. External participants through B2B direct connect can join only shared channels, while guests can join private but not shared channels. Private channels lack scheduled meetings, which shared channels support."
  - q: "Can guests and external people join a shared channel?"
    a: "External people can join through B2B direct connect, which needs cross-tenant access settings in Microsoft Entra ID configured by both organizations. Guest accounts in your own tenant cannot be added. External users are found by searching ext: followed by their email address, or by UPN if the UPN and email differ."
  - q: "Who can create a shared channel?"
    a: "Microsoft Support says only team owners can create shared channels, and that an owner who does not see the option should check with the admin. A Microsoft Learn page says creation is controlled through a channel policy, and its text and permissions table disagree on whether members can create them. Check the policy in your tenant."
  - q: "What are the limits for shared channels?"
    a: "Microsoft Learn's limits page lists up to 1,000 shared channels per team, a channel shared with up to 50 teams excluding the parent team, and 5,000 direct members per shared channel, where each team counts as one member. Real-time updates reach only 25,000 users at a time."
---

A shared channel is a Teams channel you can open to people outside the team, and even outside your organization, without adding them to the team. It is the right tool when a project spans teams or partners and you want one place for conversation, meetings and files without handing out team access.

This guide follows Microsoft Learn pages on shared channels, channel types and limits, plus the Microsoft Support steps for creating one. It also notes places where Microsoft's pages disagree.

## How shared channels work

According to Microsoft Learn:

- Only owners and members of a shared channel can access it. Other members of the parent team cannot see it unless they are added.
- A shared channel links to its parent team. It cannot be moved to another team.
- It cannot be converted to a standard channel, and a standard channel cannot be converted to a shared channel.
- Shared channels are enabled by default. A channel policy controls creation, external sharing and participation in external shared channels.
- Each shared channel has its own SharePoint site, created in the same geographic region as the parent team's site. The site has a document library and the template ID `TEAMCHANNEL#1`.
- Access to that site is limited to channel owners and members. Membership stays synced with the channel, and permissions cannot be managed independently in SharePoint.
- The site inherits the parent team's sensitivity label, even when the channel is shared with another team.
- Messages are stored in a dedicated system mailbox, not the group mailbox.

## Standard, private or shared

Microsoft Learn publishes this comparison:

| Feature | Standard | Private | Shared |
|---|---|---|---|
| Add people without adding them to the team | No | No | Yes |
| Limit membership to a subset of the team | No | Yes | Yes |
| Share directly with other teams | No | No | Yes |
| Guests can participate | Yes | Yes | No |
| External participants (B2B direct connect) | No | No | Yes |
| Moderation | Yes | No | No |
| Dedicated SharePoint site | No | Yes | Yes |
| Scheduled meetings | Yes | No | Yes |
| Planner | Yes | No | No |
| Bots, connectors, messaging extensions | Yes | No | No |
| Supported in class teams | Yes | Yes | No |
| Analytics | Yes | Yes | No |

Microsoft gives no explicit rule for choosing. Reading the table, a standard channel fits open team-wide topics that need Planner, bots or moderation. A private channel fits a sensitive subset of the same team. A shared channel fits work with people outside the team or other organizations. That is an interpretation, not Microsoft's wording.

## Who can be added

- **People in your organization.** A shared channel owner can add anyone from the organization.
- **People in other organizations.** This uses B2B direct connect. Both organizations must configure cross-tenant access settings in Microsoft Entra ID, and guest access in Teams must be enabled to invite external participants. External participants do not use guest accounts.
- **Guests.** Microsoft Entra guest accounts in your organization cannot be added, including guests converted to members by user type.

External users are found by searching `ext:user@domain.com`. If the UPN and email address differ in Entra ID, add them by UPN.

## Create one

From Microsoft Support, on the desktop app:

1. Select **Chats**, or **Teams** if you use the separate view.
2. Select **New items** and then **New channel**. Alternatively, find the team, select **More options** > **Add channel**.
3. Choose the host team, enter a name and optional description, and choose **Shared** as the channel type.
4. Add people in your organization by name, or outside people by email address, and select **Share**.
5. To make a member an owner, open the arrow next to **Member**, choose **Owner** and select **Done**.

The default setting is to share the channel with everyone on the team. The creator becomes the channel owner. The channel inherits labels such as its description from the host team, and you cannot change the host team afterward. External people can only be members, not owners.

Only team owners can create shared channels, according to Support. The Learn page says creation is controlled by policy, and its text and table disagree on whether team members can create them. Check your tenant's channel policy.

## Limits

From the Microsoft Learn limits page:

| Item | Limit |
|---|---|
| Shared channels per team | Up to 1,000, including deleted channels in their 30-day recovery window |
| Teams a channel can be shared with | 50, excluding the parent team |
| Members in a shared channel | 5,000 direct members, with each shared team counting as one |
| Members in a team | 25,000, including direct members in shared channels |

Real-time updates reach only 25,000 users at a time. The same page is inconsistent on private channels: its table puts them inside the 1,000 channel total, while a footnote mentions a separate 30 private channel limit. Confirm that figure before planning around it.

## Admin controls and compliance

- **Policies** control who can create shared channels, who can share them externally and who can join external ones.
- **Deletion:** deleted shared channels can be restored within 30 days with memberships. Archiving a team removes sharing with teams other than the parent.
- **Purview:** Learn lists communication compliance, Conditional Access, DLP, retention, sensitivity labels, information barriers, eDiscovery, legal hold and audit logs. External participants cannot be placed on legal hold, and information barrier policies do not apply to external participants in another organization's shared channel.
- **Apps:** only the tab capability of allowlisted apps is supported by default.

## What is not supported

- Guests in shared channels.
- Moving a shared channel to another team, or converting between channel types.
- Cloning a team does not clone its shared channels.
- Team templates cannot create shared channels.
- SharePoint and the SharePoint pages app in GCC, GCC High and DoD.
- Managing the channel site's permissions independently in SharePoint.

## When to choose a shared channel

1. You need partners or another tenant in one channel and do not want to give them team access.
2. Several internal teams need one shared workspace.
3. You want scheduled meetings in the channel.
4. You do not need Planner, bots, connectors or moderation there.

If you need guests, moderation or Planner, use a standard channel. Plan the cross-tenant settings with the other organization first.

## Related

- [Shared channels](https://www.m365.fm/entity/shared-channels/)
- [Microsoft Teams channels](https://www.m365.fm/entity/teams-channels/)
- [Private channels](https://www.m365.fm/entity/private-channels/)

## Sources

- [Microsoft Learn: Shared channels in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/shared-channels)
- [Microsoft Learn: Overview of teams and channels in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/teams-channels-overview)
- [Microsoft Learn: Limits and specifications for Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/limits-specifications-teams)
- [Microsoft Support: Create a shared channel in Teams](https://support.microsoft.com/office/80712457-579e-42b2-b54f-112329578aaa)
- [Microsoft Learn: Get started with team templates in the Teams admin center](https://learn.microsoft.com/en-us/microsoftteams/get-started-with-teams-templates-in-the-admin-console)
