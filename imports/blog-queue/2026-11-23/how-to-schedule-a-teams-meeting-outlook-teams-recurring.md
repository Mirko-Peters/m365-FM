---
title: "How to Schedule a Teams Meeting: From Teams, From Outlook and as a Recurring Series"
summary: "Step-by-step ways to schedule a Microsoft Teams meeting from the Teams calendar, a chat, a channel and Outlook, how to make it recurring, which accounts work, and what to check when the option is missing."
status: review
publish: false
author: mirko-p
date: 2026-11-23
topics: [teams, outlook, teams-admin-center]
keypoints:
  - "In the Teams calendar, select New or click a time slot, add details and attendees, turn on the Teams meeting toggle and save."
  - "In new Outlook, select New event, turn on the Teams meeting toggle next to Title and select Send. Saving a draft creates the event without Teams join details."
  - "For a recurring meeting, open the dropdown that reads Does not repeat and pick a pattern or Custom."
  - "The Outlook add-in supports Microsoft 365 Business Exchange accounts only. Personal accounts and POP or IMAP accounts such as Gmail are not supported."
  - "If scheduling options are missing, an admin may have turned them off in Teams admin center > Meetings > Meeting policies > Meeting scheduling."
faq:
  - q: "How do I schedule a Teams meeting in the Teams app?"
    a: "According to Microsoft Support, open the Calendar tab, click a time slot or select New, add the meeting details and attendees, turn on the Teams meeting toggle and select Save. You can also schedule from a chat through More chat options and Schedule a meeting."
  - q: "How do I make a Teams meeting recurring?"
    a: "The Microsoft Support scheduling articles give no recurring steps. A Microsoft Q&A thread, which is a community answer and not official documentation, says to open the dropdown next to Does not repeat, below the date, and choose a frequency or Custom to set your own schedule. When you add invitees later, Microsoft Support advises inviting them to the series rather than a single occurrence, or they will not appear in the people selection menus in Meeting options."
  - q: "Why is the Teams meeting button missing in Outlook?"
    a: "Microsoft Support says the Outlook add-in does not support personal accounts, scheduling is available only for Microsoft 365 Business Exchange accounts, and POP or IMAP accounts such as Gmail, Yahoo and iCloud are not supported. An admin can also turn off the Outlook add-in in the meeting policy."
  - q: "Can I remove Teams from a meeting after I sent the invite?"
    a: "No. Microsoft Support says you can remove Teams only while creating the meeting. In new Outlook turn off the Teams meeting toggle. In classic Outlook select More commands and then Don't Host Online. After the invitation is sent you cannot remove it."
  - q: "How many people can join a scheduled Teams meeting?"
    a: "Microsoft Support states that up to 1,000 invitees can join and participate. Up to 10,000 can join as view-only attendees if the meeting already has 1,000 attendees."
---

The fastest way to schedule a Teams meeting is in the Teams calendar: select **New**, add attendees, turn on the **Teams meeting** toggle and save. In Outlook the steps are nearly the same. For a repeating meeting, use the **Does not repeat** dropdown and pick a pattern.

Below are the routes Microsoft documents, the requirements for each and the checks to run when something is missing.

## Schedule from the Teams calendar

1. Open the **Calendar** tab in Teams.
2. Click a time slot, or select **New**.
3. Add the title, meeting details and attendees.
4. Turn on the **Teams meeting** toggle.
5. Select **Save**.

Enter names in the **Required attendees** field. For optional attendees use **Response options** in the new calendar or **Optional** in the classic one. To invite someone outside your organization, enter the full email address. Guests receive an email with a meeting link.

Select **Send** (or **Send update** when editing) so invitees get the link. The Scheduler section shows each attendee's time zone and availability. Shaded areas are busy or tentative.

## Schedule from a chat

1. Open the **Chat** tab and select **More chat options** at the top of the chat.
2. Select **Schedule a meeting**, add the details and select **Send**.

The chat's participants are added as attendees.

## Schedule a channel meeting

1. Open **Teams** and select the team.
2. Open the dropdown arrow next to **Meet now** and select **Schedule a meeting**.
3. Add any attendees from outside the team and select **Send**.

Points from Microsoft Support:

- Everyone on the team gets a personal invite to a channel meeting.
- Channel meetings are not available in private channels.
- You cannot change or add the channel after the invite is sent. Send a new invite instead.
- Outside invitees do not get access to the channel calendar.

## Schedule from Outlook

### New Outlook for Windows and Outlook on the web

1. Go to **Calendar** and select **New event**.
2. Turn on the **Teams meeting** toggle next to Title.
3. Add details and invitees.
4. Select **Send**.

Teams join details are added when you send. A saved draft creates the event without them.

### Classic Outlook

1. On the **Home** tab, open the dropdown beside **New Email** and select **Meeting**.
2. On the **Meeting** tab, open the dropdown beside **Teams Meeting** and select **Schedule meeting**.
3. Add details and invitees. To change options, select **Set up**, then **All options**.
4. Select **Send**.

Meetings scheduled from Outlook include dial-in details automatically, according to Microsoft Support.

## Make it a recurring meeting

In the Teams scheduling form, open the dropdown next to **Does not repeat**, below the date. Choose a default frequency or select **Custom** to set your own schedule. A Microsoft Q&A thread, which is a community answer and not official documentation, lists the defaults as Daily, Weekly and Monthly.

Microsoft's Outlook article gives no separate steps for recurring meetings. It does add one rule: if you add invitees to a single occurrence, the people selection menus in **Meeting options** will not show them. Invite people to the series instead.

## Requirements and limits

- **Accounts:** The Outlook add-in does not support personal accounts. Scheduling is available only for Microsoft 365 Business Exchange accounts. POP and IMAP accounts such as Gmail, Yahoo and iCloud are not supported. New Outlook for Windows has Teams built in.
- **Size:** Up to 1,000 invitees can join and participate. Up to 10,000 can join view-only if the meeting already has 1,000 attendees.

- **Meeting options in Outlook on the web:** After you add invitees in Outlook, select **Send Update** so they appear in Meeting options.

## When scheduling options are missing

Admins control scheduling in the Teams admin center under **Meetings** > **Meeting policies** > **Meeting scheduling**. Microsoft Learn lists these settings, all on by default:

| Setting | Effect |
|---|---|
| Private meeting scheduling | Organizers can schedule private meetings |
| Channel meeting scheduling | Organizers can schedule channel meetings in channels they belong to |
| Meet now in private meetings | Organizers can start instant private meetings |
| Meet now in channel meetings | Organizers can start instant channel meetings |
| Outlook add-in | Organizers can schedule private meetings from Outlook |

Meeting policies are assigned to users and apply to the meetings those users organize. If a user cannot schedule, ask the admin to check which policy is assigned to them.

## Common mistakes

- Saving a draft in Outlook and expecting join details. They appear when you send.
- Trying to remove Teams after sending. It is only possible before.
- Scheduling a channel meeting in a private channel. It is not available.
- Using a Gmail or other POP or IMAP account for the Outlook add-in.
- Adding invitees to one occurrence of a series.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)
- [Outlook on the web](https://www.m365.fm/entity/outlook-web/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Schedule a meeting in Microsoft Teams (Microsoft Support)](https://support.microsoft.com/office/schedule-a-meeting-in-teams-943507a9-8583-4c58-b5d2-8ec8265e04e5)
- [Schedule a Microsoft Teams meeting from Outlook (Microsoft Support)](https://support.microsoft.com/en-us/topic/883cc15c-580f-441a-92ea-0992c00a9b0f)
- [Schedule a meeting in Teams, second Microsoft Support article](https://support.microsoft.com/en-us/office/schedule-a-meeting-in-teams-8aff907f-7163-4736-8202-a0b4a5504fba)
- [Meeting policies in Teams, general settings (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/meeting-policies-in-teams-general)
- [How do I create a recurring meeting in Microsoft Teams? (Microsoft Q&A)](https://learn.microsoft.com/en-us/answers/questions/2125269/how-do-i-create-a-recurring-meeting-in-microsoft-t)
