---
title: "Best Practices for Teams Chat Management: Organize Chats and Set Policies"
summary: "Practical Teams chat management for users and admins, built from Microsoft documentation: pin, mute and hide chats, know the group chat limits, set messaging policies, and understand how chat retention really works."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [teams, teams-admin-center, microsoft-purview-data-lifecycle-management]
keypoints:
  - "Users can pin, mute and hide chats from the More options menu in the chat list. A hidden chat returns when someone posts a new message."
  - "Group chats have documented limits: up to 250 people in a private chat, with only 200 members added at the same time, and typing indicators and read receipts switch off above 20 people."
  - "Admins control chat behavior in the Teams admin center under Messaging policies: chat on or off, delete and edit sent messages, read receipts, URL previews and more."
  - "Retention for chats needs a Purview retention policy that includes the Teams chats location, and deletion can take days or weeks to complete."
  - "Microsoft's pages read here give no rule for choosing chat or channel, so write down your own team rule rather than assuming one."
faq:
  - q: "How do I stop a noisy group chat without leaving it?"
    a: "Microsoft Learn says to select Chat, find the conversation, choose More options and then Mute. You stay in the conversation but get no notifications from it. To bring the chat back to normal, select More options and then Unmute."
  - q: "Can I delete a Teams chat?"
    a: "A Microsoft Learn training module says you cannot delete a chat but you can hide it, and it stays hidden until someone posts a new message. The messaging policies reference lists a Delete chat setting that is on by default, so the behavior may depend on your Teams version. Check in your own tenant."
  - q: "How many people can be in a Teams group chat?"
    a: "The Microsoft Learn limits page lists 250 people in a private chat, with a footnote that only 200 members can be added to a group chat at the same time. With more than 20 people, features such as typing indicator, read receipts and video and audio calling are turned off."
  - q: "How do admins turn read receipts off for everyone?"
    a: "According to Microsoft Learn, open Messaging policies in the Teams admin center, edit the policy and set Read receipts to Turned off for everyone. The options are User controlled, Turned on for everyone and Turned off for everyone."
  - q: "How long does a chat retention policy take to delete messages?"
    a: "Microsoft Learn says an Exchange timer job that evaluates the hidden folder typically takes 1 to 7 days to run, and one example shows a delete action after one day taking up to 16 days before the message is permanently gone. Holds suspend permanent deletion."
---

Good Teams chat management comes down to three layers: how each person organizes their own chat list, how large groups behave, and which policies the admin sets for the whole tenant. This article sticks to what Microsoft documents. Where Microsoft gives no guidance, it says so.

## Organize your own chat list

The chat list is where clutter builds up. Microsoft Learn documents four actions, all from the chat list.

**Pin a chat.** Select **Chat**, find the conversation, then **More options** > **Pin**. A pinned chat stays at the top. Select the option again to unpin.

**Mute a chat.** Select **Chat**, find the conversation, then **More options** > **Mute**. You remain in the conversation, but you get no notifications from it. An icon next to the participants' names shows that the chat is muted.

**Hide a chat.** Select **More options** > **Hide** next to the chat. The chat stays hidden until someone posts a new message to it.

**Unhide a chat.** Type a word from the chat, such as a participant's name, in the search box. Open the hidden chat, select **Chat** in the left toolbar, then **More options** > **Unhide**.

A simple routine: pin the three or four chats you answer daily, mute large project chats you only skim, and hide finished conversations.

The Microsoft Learn page does not describe marking a chat as unread or favorites, and it does not state a limit on pinned chats. The limits page does not list one either.

## Know the group chat limits

From the Microsoft Learn limits and specifications page:

| Item | Limit |
|---|---|
| People in a private chat | 250 (only 200 members can be added to a group chat at the same time) |
| People in a video or audio call from chat | 20 |
| File attachments per message | 10 |
| File size | 100 MB |
| Chat message size | Approximately 100 KB per post |

With more than 20 people in a chat, Microsoft says Outlook automatic replies and Teams status messages, typing indicator, video and audio calling, sharing and read receipts are turned off. That is a practical reason to move large conversations out of chat. The pages read here do not give a formal rule for chat versus channel, so agree one in your team.

## Set messaging policies (admins)

In the Teams admin center, open **Messaging policies**. Select **Add** for a custom policy, or select the global policy and then **Edit**. Documented settings that shape chat behavior:

- **Chat:** when off, chat is disabled for new one-on-one and group chats.
- **Delete sent messages** and **Edit sent messages:** let users delete or edit what they sent.
- **Owners can delete sent messages:** lets owners delete messages by others, but not their own unless Delete sent messages is on.
- **Read receipts:** User controlled, Turned on for everyone, or Turned off for everyone.
- **URL previews:** automatic previews on or off.
- **Translate messages:** translate into the user's personal language setting.
- **Use Giphy in conversations** with a content rating of No restriction, Moderate or Strict.
- **Chat permission role:** the supervised chat role of the user.

The settings above are the ones this guide lists. Check the current defaults in your own policy before you rely on them.

Supervised chat is a separate control. It lets designated supervisors start chats and blocks restricted users from starting new chats unless a supervisor is present. Per Microsoft, it applies to new private chats only, must be enabled for all users in the tenant, and new users default to the restricted role.

## Retention: what actually happens to old chats

To delete or keep chats, use a Microsoft Purview retention policy with the **Teams chats** location. Chats are not covered by policies set only on Exchange mailboxes. Key points from Microsoft Learn:

- Chat data sits in a hidden folder in each participant's mailbox.
- Deletion is applied by a timer job that typically takes 1 to 7 days to run. A one-day delete example can take 16 days end to end.
- Holds suspend permanent deletion.
- What users see in Teams is not a reliable sign of what is retained.
- Code snippets, voice memos recorded in the Teams mobile client and emoticon reactions from others are not retained.
- Files shared in chats need a policy that includes the organizer's OneDrive account.

## A short rule set to adopt

Microsoft's documentation gives the building blocks, and each team still has to choose its own habits. A reasonable set: pin only the chats you answer daily, mute chats you only skim and review them on a fixed schedule, move chats that grow beyond 20 people into a channel, and tell people that hiding a chat is not the same as deleting it. Admins should also decide centrally whether read receipts, message editing and message deletion are allowed, instead of leaving it to each user.

## Common mistakes

- Muting everything and missing real requests. Muting removes notifications, so check muted chats on a schedule.
- Adding 30 people to a chat and expecting read receipts and typing indicators.
- Assuming a chat disappears from Teams means it is deleted for compliance.
- Setting a retention policy without including the Teams chats location.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams channels](https://www.m365.fm/entity/teams-channels/)
- [Microsoft Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/)

## Sources

- [Organize your teams, channels and chats (Microsoft Learn training)](https://learn.microsoft.com/en-us/training/modules/collaborate-teams-channels-microsoft-teams/6-organize-teams-channels-chats)
- [Manage messaging policies in Teams](https://learn.microsoft.com/en-us/microsoftteams/messaging-policies-in-teams)
- [Limits and specifications for Microsoft Teams](https://learn.microsoft.com/microsoftteams/limits-specifications-teams)
- [Supervised chats for non-educational tenants](https://learn.microsoft.com/microsoftteams/supervised-chat-non-edu)
- [Retention policies for Teams](https://learn.microsoft.com/en-us/purview/retention-policies-teams)
