---
title: "Teams Channel Moderation: Best Practices and Setup"
summary: "How to set up channel moderation in Microsoft Teams, who can moderate, which posting permissions you can restrict, where it does not work, and which use cases Microsoft documents, with notes where its pages disagree."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [teams, teams-channels]
keypoints:
  - "Channel moderation is configured by team owners. When it is on, only moderators can start new posts in that channel."
  - "Team owners are moderators by default and cannot be removed. Owners and moderators can add or remove other moderators."
  - "With moderation on you can allow or block member replies, pinning, bot messages and connector messages."
  - "Moderation is not available for private channels. Microsoft's pages disagree on the General channel, so check what your client offers."
  - "Microsoft's documented scenarios are announcement channels where leads post and replies are off, and class channels where teaching assistants moderate."
faq:
  - q: "Who can set up channel moderation in Teams?"
    a: "According to Microsoft Learn, moderation must be activated and configured by a team owner. It is independent of the owner and member roles and can recognize all owners, individual users and even guests as moderators. Microsoft Support adds that team owners are moderators by default and cannot be removed."
  - q: "What can a moderator do that a normal member cannot?"
    a: "Microsoft Support says that when moderation is on, only moderators can start new posts. Moderators can post, react and reply, add or remove other moderators and control whether members can reply to existing messages and whether bots and connectors can submit messages."
  - q: "Can I moderate a private channel or the General channel?"
    a: "Not a private channel. Microsoft Learn says moderation is not available for private or shared channels. For the General channel, the pages differ. Microsoft Support says it is not available, while the Microsoft Learn module describes General channel options such as Only owners can post messages. Check the channel settings in your own client."
  - q: "How do I stop guests from starting new posts without turning moderation on?"
    a: "Microsoft Support says that under Who can start a new post, you can choose Everyone except guests can start a new post. Microsoft Learn also says that with moderation off you can still configure a restriction that excludes guests from starting new posts."
  - q: "Does Microsoft publish channel moderation best practices?"
    a: "The pages I read do not include a formal best-practices section. They describe two scenarios: an announcement channel where team leads are moderators and member replies are turned off, and a class channel where teaching assistants moderate so they can start and drive discussions."
---

Channel moderation lets team owners decide who can start conversations in a channel. When it is on, only moderators can start new posts, and owners can also restrict replies, pinning, bot messages and connector messages. It is the right tool for announcement channels and large channels that need to stay focused. It does not work for private channels.

## What channel moderation does

Microsoft Learn describes moderation as independent from the owner and member roles. A team owner turns it on and configures it. Moderators can be all owners, individual users and even guests. Once on, it can restrict four things:

- Who can start new posts. Only moderators can.
- Whether members can reply to posts.
- Whether bots can send channel messages.
- Whether connectors can send channel messages.

Non-private channels are unmoderated by default, so anyone can post, react and reply.

## Set it up

Microsoft Support and Microsoft Learn describe the path slightly differently. Both lead to the same setting.

1. Go to the channel in a team you own.
2. Select **More options** (the ellipsis) > **Manage channel**.
3. Under **Channel moderation**, select **On**. Microsoft Learn places this on the **Channel settings** tab under **Permissions**.
4. Under **Who are the moderators?**, select **Manage**, then add or remove team members.
5. Under the team member permissions, tick what members may do. The listed options are replying to channel messages, pinning channel messages, bots submitting channel messages and connectors submitting channel messages.

Moderation is available in Teams for desktop or web, for standard channels.

## Who moderates

Team owners are moderators by default and cannot be removed. Owners and existing moderators can add and remove other moderators. Moderators can post, react and reply, and can control reply, bot and connector permissions.

### What each role can do when moderation is on

| Action | Member | Moderator | Owner |
|---|---|---|---|
| Start a new post | No | Yes | Yes, owners are moderators by default |
| Reply to a post | Only if replies are allowed | Yes | Yes |
| Pin a message | Only if pinning is allowed | Not stated on the pages I read | Not stated on the pages I read |
| Control whether bots or connectors can post | Not stated on the pages I read | Yes | Yes, as a default moderator |
| Add or remove moderators | No | Yes | Yes |

## Moderation or a guest restriction?

If the only goal is to keep guests from opening new threads, the guest restriction is the lighter option because members can still post. If the goal is a channel where only a few people publish, turn moderation on. Owners can combine moderation with the reply, pinning, bot and connector permissions to shape how much conversation the channel allows.

## Where it does not work

- **Private channels.** Both pages say moderation is not available.
- **Shared channels.** Microsoft Learn says it is not available for private or shared channels.
- **General channel.** The pages disagree. Microsoft Support says moderation is not available for the General channel. The Microsoft Learn module describes three General channel options: **Anyone can post messages**, **Anyone can post; show alert that posting will notify everyone** and **Only owners can post messages**. The Learn module page carries a 2023 publication date and was last updated in March 2024, so it may be older than the Support page. Look at the channel's settings in your client to see which applies to you.

The pages I read give no numeric limits for moderation. Microsoft points to the separate Limits and specifications for Microsoft Teams article.

## Guests

You do not have to turn moderation on to keep guests from starting posts. With moderation off, choose **Everyone except guests can start a new post** under **Who can start a new post?**. This leaves everyone else free to post.

## Use cases Microsoft documents

Microsoft does not publish a best-practices checklist in the pages I read. It does describe two scenarios, and these are the closest thing to documented guidance:

- **Announcement channel.** A marketing team adds its leads as moderators so they can post announcements, and turns off member replies so the channel stays focused on key updates.
- **Class discussions.** In Teams for Education, a teacher lets teaching assistants moderate the channel so they can start and drive discussions with students.

## Practical guidance (inference, not Microsoft text)

The following points follow from how the settings work. They are not statements from Microsoft.

- Turn moderation on only where a channel has a clear single purpose. Because new posts are limited to moderators, it will slow ordinary discussion.
- Add more than one moderator beyond the owners if announcements need to go out when owners are away.
- Decide on replies deliberately. Turning replies off keeps a channel clean but blocks questions under an announcement. If people need to ask questions, leave replies on or point them to another channel.
- Review bot and connector permissions. If a channel receives automated messages, switching those off will silence them.
- Tell members what the channel is for, since the moderation setting will otherwise look like a bug when posting is blocked.

## Common problems

- **Members cannot start a post.** That is the expected result when moderation is on. Add the person as a moderator, or turn moderation off.
- **No moderation option visible.** Check that the channel is a standard channel and that you are a team owner.
- **Moderation unavailable on a private channel.** This is by design. Use a standard channel or manage posting through team structure.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams channels](https://www.m365.fm/entity/teams-channels/)

## Sources

- [Microsoft Support: Change moderator roles and settings in a channel in Microsoft Teams](https://support.microsoft.com/en-us/topic/6ac54758-3440-4f6a-9bd5-cebf97cb7ea6)
- [Microsoft Learn: Manage channel moderation](https://learn.microsoft.com/en-us/training/modules/manage-collaboration-experiences-for-chat-channels/06-manage-channel-moderation)
