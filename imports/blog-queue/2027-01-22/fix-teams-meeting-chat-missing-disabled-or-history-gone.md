---
title: "Fix Teams Meeting Chat: Missing Chat Icon, Disabled by Administrator or History Gone"
summary: "Three documented causes for a missing Teams meeting chat, the message The Administrator has disabled the Chat, or lost chat history: the Meeting chat policy, the 1,000 attendee limit and joining by link without being on the invitation. Checks and fixes for users, organizers and admins."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [teams, teams-admin-center]
keypoints:
  - "Learn lists three causes: the Meeting chat policy is Off, the meeting has more than 1,000 attendees, or you joined by link and were not on the original invitation."
  - "As a first check, leave and rejoin the meeting to rule out a transient issue."
  - "Admins fix the policy in the Teams admin center under Meetings, Meeting policies, Meeting engagement, by setting Meeting chat to an On value."
  - "Anyone who joined by a forwarded link loses chat, files and notes after the meeting ends. The organizer must add them to the original invitation or recurring series."
  - "For meetings hosted by other organizations, External meeting chat must be On, and the host must allow chat."
faq:
  - q: "Why is the Chat icon missing in my Teams meeting?"
    a: "Microsoft Learn names three causes. The Meeting chat setting in your assigned meeting policy is Off for everyone, the meeting has more than 1,000 attendees, which is the chat maximum, or you joined with a meeting link and were not added to the original invitation. First leave and rejoin the meeting to rule out a transient problem."
  - q: "What does the message The Administrator has disabled the Chat mean?"
    a: "Learn lists it as a symptom that appears when you select the Chat icon. One cause is the Meeting chat setting in your meeting policy. An admin should open the policy in the Teams admin center and set Meeting chat to On for everyone or On for everyone but anonymous users."
  - q: "Why can I not see the chat after the meeting ended?"
    a: "If you were added to the meeting through a link, for example in a forwarded invitation, but not through the original invitation, Learn says you have access to chats, files, notes and other meeting content only during the meeting. For recurring meetings you also lack the chat in later meetings. The organizer must add you to the original invitation or recurring series."
  - q: "Which meeting chat values exist for admins?"
    a: "The Manage chat in Teams meetings page lists five values: On for everyone, On for everyone but anonymous users, Off, In-meeting only for everyone, and In-meeting only for everyone but anonymous users. Their PowerShell names are Enabled, EnabledExceptAnonymous, Disabled, EnabledInMeetingOnlyForAll and EnabledInMeetingOnlyForAllExceptAnonymous."
  - q: "What about meetings hosted by another organization?"
    a: "For meetings hosted by organizations you have no trust relationship with, Learn says the External meeting chat setting must be On, which is the default. You must also set Meeting chat to On for everyone, and the organizer must allow meeting chat as Enabled or In meeting only."
---

Meeting chat problems in Teams usually come down to a policy, a limit or the way someone joined. The Microsoft Learn troubleshooting page for meeting chat lists three causes and three resolutions. This article puts them in a checklist, and adds the admin settings from the Manage chat in Teams meetings page so you can see which value applies.

## Symptoms

As an attendee you might see one of these:

- The **Chat** icon is missing.
- Selecting **Chat** shows the message "The Administrator has disabled the Chat".
- You cannot see the meeting chat history.

## First check

To rule out a transient issue, leave the meeting and rejoin. If the symptom stays, continue with the causes below.

## Cause 1: The meeting policy turns chat off

The **Meeting chat** setting in the meeting policy assigned to you is **Off for everyone**.

### Fix for admins

1. In the Microsoft Teams admin center, go to **Meetings** > **Meeting policies**.
2. Select the policy that is assigned to the affected user.
3. Open the **Meeting engagement** section.
4. Set **Meeting chat** to **On for everyone** or **On for everyone but anonymous users**.
5. Select **Save**.

If you use Teams for Education, Learn says to manage meeting policies with policy packages or the Teams for Education policy wizard.

### What the values do

The Manage chat page describes the setting as per-user and per-organizer, and says it does not apply to channel meetings. It lists these values:

| Admin center value | PowerShell value | Behavior in short |
| --- | --- | --- |
| On for everyone | `Enabled` | All participants can read and send. The organizer controls the experience |
| On for everyone but anonymous users | `EnabledExceptAnonymous` | Anonymous participants cannot read or send |
| Off | `Disabled` | Chat is off. Organizers cannot override it |
| In-meeting only for everyone | `EnabledInMeetingOnlyForAll` | Chat only during the meeting. Organizers cannot override it |
| In-meeting only for everyone but anonymous users | `EnabledInMeetingOnlyForAllExceptAnonymous` | Same, and anonymous users have no access to chat |

Admins can also set the value with PowerShell:

```powershell
Set-CsTeamsMeetingPolicy -Identity <policy name> -MeetingChatEnabledType EnabledExceptAnonymous
```

The page also says that when the admin policy is not Off, organizers can set chat to **On**, **Off** or **In meeting only** in their meeting options. The admin policy does not change what organizers see in Meeting options, but it enforces the experience. For example, with **In-meeting only for everyone**, the organizer still sees the option **On**, yet chat is only available during the meeting.

### Meetings hosted by other organizations

For meetings hosted by other organizations, the troubleshooting page notes that **External meeting chat** must be **On**. The Manage chat page explains this setting, shown as **Chat in external meetings**, applies to organizations without a trusted relationship in external access, which treat your users as anonymous. **On** is the default. You must also set **Meeting chat** to **On for everyone**, and the organizer must set **Allow meeting chat** to **Enabled** or **In meeting only**. In PowerShell the parameter is `-AllowExternalNonTrustedMeetingChat`.

## Cause 2: More than 1,000 attendees

Learn says 1,000 is the maximum number of attendees that is supported for chat. The meeting organizer must make sure the number of attendees stays below the limit. The page links to the Teams limits and specifications article for the details of meetings and calls.

## Cause 3: You joined by link, not by invitation

If you were added as an attendee with a meeting link, such as one in a forwarded invitation, and were not added to the original invitation, Learn says:

- Attendees have access to chats, files, notes and other meeting content only during the meeting, and lose access after it ends.
- For a recurring meeting, they also do not have the meeting chat in later meetings.

### Fix for organizers

Add the attendee to the original meeting invitation, or to the original recurring meeting series, as appropriate. This is how post-meeting chat access is restored.

## A related setting: lobby chat

The Manage chat page also describes **Organizers can chat with lobby participants**, which is **On** by default. It lets organizers chat with people who cannot bypass the lobby. Before you turn it on, set **Meeting chat** to **On for everyone** or **On for everyone but anonymous users**. That is only relevant when the complaint is about the lobby, not the meeting chat itself.

The page lists one limitation: Microsoft Teams Rooms on Windows with a Pro license cannot use chat when they join meetings as a presenter.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Ask the user how they joined. A forwarded link points to Cause 3, and a meeting from another company points to the external meeting chat setting.
2. Ask whether anyone else sees the chat icon in the same meeting. If everyone is missing it, check the organizer's policy and the attendee count.
3. For one user, check which meeting policy is assigned before you change a shared policy.
4. Tell organizers to invite people directly, or to add them to the series, if they need the chat after the meeting.
5. If you set an In-meeting only value on purpose, tell users, since chat will not be available before or after the meeting.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Chat issues in Teams meeting (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/meetings/meeting-chat-issues)
- [Manage chat in Teams meetings (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/manage-meeting-chat)
