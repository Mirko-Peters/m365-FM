---
title: "Teams Tags: How to Create and Use Tags to Reach Groups of People"
summary: "How Microsoft Teams tags work: create a custom tag, @mention it in a channel or chat, who is allowed to manage tags, the documented limits, and the admin settings behind them."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [teams, teams-admin-center]
keypoints:
  - "Tags let you reach a subset of a team with one @mention, for example everyone with a role, project or location."
  - "Create a custom tag via the team's More options > Manage tags. Name it, add a description and assign members."
  - "Three kinds exist: custom tags, shift-based tags from the Shifts app, and automatic tags from job title or department."
  - "Limits per Microsoft Learn: 200 tags per team, 200 members per tag, and 25 tags per user in the same team."
  - "Admins set who can manage tags in the Teams admin center under Teams > Teams settings > Tagging."
  - "Tags cannot be managed with PowerShell, according to the Learn article."
faq:
  - q: "How do I create a tag in Microsoft Teams?"
    a: "Microsoft Support says to hover over the team, select More options, and choose Manage tags. Then name the tag, add a description and assign team members. Custom tags are created by team owners, or by members if owners allow it."
  - q: "How do I use a tag once it exists?"
    a: "In a channel conversation, type @ followed by the tag name and select it, and everyone assigned to the tag gets a notification. To start a chat, select New message, type the tag name in the To field and select it. Microsoft Support says all tag members are then added to the To field."
  - q: "Why can I not create tags?"
    a: "Microsoft Support says your organization may not have the feature enabled, and suggests asking the team owner for permissions. On the admin side, Microsoft Learn lists the Who can manage tags setting, which can restrict tags to team owners or turn tags off."
  - q: "How many tags can a team have?"
    a: "Microsoft Learn lists up to 200 tags per team, up to 200 team members assigned to one tag, and up to 25 tags in the same team assigned to a single user. An older Teams blog post mentions lower numbers (100 tags per team and 100 members per tag), so use the current Learn page."
---

A Teams tag is a named group of people inside a team. Type @ and the tag name, and everyone assigned to that tag is notified, without listing names one by one. This guide covers how to create and use tags, who is allowed to do it, and what the admin settings control.

## What tags are

Microsoft Learn describes three kinds of tags:

- **Custom tags.** Team owners, and members if they have permission, create these and assign people manually. Typical attributes are role, project, skill or location.
- **Shift-based tags.** The Shifts app assigns these automatically based on a person's schedule and shift group name. Only people on shift are notified when the tag is used.
- **Automatic tags.** Created and assigned by department or job title, using values mapped from Microsoft Entra attributes. They are set up through the deploy frontline dynamic teams experience in the Teams admin center.

Custom and shift-based tags work on the **To** line of a new chat and in posts on any standard channel. Tags are also supported in private and shared channels. In shared channels, only direct members can be added to a shared channel tag. People who are members through the team cannot.

## Create a custom tag

1. Hover over the team in the team list.
2. Select **More options** (the three dots).
3. Choose **Manage tags**.
4. Name the tag, add a description and assign team members.

Microsoft Support states that custom tags are created and managed by team owners, or by members if owners allow it. The Support article does not describe steps for editing or deleting a tag, or for changing members of an existing tag. If you need those, check the Teams admin documentation or ask the team owner.

## Use a tag

**In a channel:**

1. Open a channel conversation.
2. Type **@** followed by the tag name.
3. Select the tag from the list. Everyone assigned to it gets a notification.

**In a new chat:**

1. Select **New message**.
2. Type the tag name in the **To** field and select it. All tag members are added.
3. Write the message.

To see where you were tagged, select **Tag mentions** under **Quick views** above the chat or channel list, or check **Activity** on the left side of Teams.

## Team owner settings

Team owners can control tag behavior for their own team, if the admin allows it.

- **Let members create tags:** find the team, select **More options** > **Manage team**, open the **Settings** tab and go to the **@mention** section. Choose who can use team, channel and group @mentions.
- **Turn on shift-based tags:** in **Settings**, go to **Tags** and turn on the **Shifts** toggle.
- **Allow @mentions by job title or department:** in the **@mention** section, select the option to show members the choice to @mention groups based on job title or department.

## Admin settings

Admins configure tags in the Teams admin center under **Teams** > **Teams settings** > **Tagging**.

**Who can manage tags** has four values:

| Value | Effect |
|---|---|
| Team owners, members, and guests | All three can manage tags |
| Team owners and members | Owners and members can manage tags |
| Team owners | Only owners can manage tags |
| Not enabled | Tags are turned off |

If nothing is selected, Microsoft default applies, which covers owners and members. Microsoft recommends choosing an explicit value so your settings do not change if the default changes. A separate toggle, **Team owners can change who can manage tags**, lets owners set the value for their own team.

Other settings on the same page:

- **Suggested tags:** up to 25 default tags, each up to 25 characters. Microsoft notes this is available in classic Teams only, not in new Teams.
- **Custom tags:** when off, people can only use suggested tags, so add at least one suggested tag first.
- **Shifts app can apply tags:** when on, Shifts assigns tags to people on shift in real time.

The Learn article says tags cannot be managed with PowerShell. They are managed only in the Teams admin center.

## Limits

According to the current Learn page:

- Up to 200 tags per team.
- Up to 200 team members assigned to a tag.
- Up to 25 tags in the same team assigned to a single user.

For Teams for Education, non-owner students cannot manage tags when the setting is Team owners or Microsoft default.

## Common problems

- **No Manage tags option.** The feature may be off, or the setting may limit it to owners. Check **Who can manage tags**.
- **Tag works in one place but not another.** Shift-based tags need the Shifts app, and automatic tags need Entra attributes mapped through the frontline dynamic teams experience.
- **Cannot add someone to a shared channel tag.** Only direct members of the shared channel are allowed.
- **Tags unavailable in a special environment.** Microsoft Support says tags are not yet available in Air Gap.

## What the documentation does not say

The pages read do not explain how long it takes for a new tag to appear for members. They also do not give a naming convention. Pick one for your team, for example by project or role, and keep tag names short.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Manage tags in Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/MicrosoftTeams/manage-tags)
- [Using tags in Microsoft Teams (Microsoft Support)](https://support.microsoft.com/office/using-tags-in-teams-667bd56f-32b8-4118-9a0b-56807c96d91e)
- [Reach the right people faster with tags in Microsoft Teams (Microsoft Teams blog)](https://techcommunity.microsoft.com/blog/microsoftteamsblog/reach-the-right-people-faster-with-tags-in-microsoft-teams/1302986)
