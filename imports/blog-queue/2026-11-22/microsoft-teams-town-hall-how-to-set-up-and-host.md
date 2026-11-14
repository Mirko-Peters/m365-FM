---
title: "Microsoft Teams Town Hall: How to Set Up and Host One"
summary: "How to set up and host a Microsoft Teams town hall: the Events app and calendar routes, the Optimize for large audience setting, capacity tiers, roles, green room, starting and ending the event, and admin policy limits."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [teams, teams-premium, teams-admin-center]
keypoints:
  - "A town hall is an event with Optimize for large audience turned on. Learn says it then uses the town hall settings in the Teams events policy (CsTeamsEventsPolicy)."
  - "Create it in the Events app (Events > Create event) or schedule it from the Teams calendar. The setting can't be changed after the event is saved."
  - "Capacity tiers: up to 1,000 interactive, 3,000 with large-event chat, 10,000 view-only with Q&A, and 100,000 with an Attendee Capacity Pack."
  - "Above 1,000 attendees Optimize for large audience is on and can't be turned off."
  - "Host from the green room, start the meeting, and use End event to end it for everyone. Leave does not end it."
faq:
  - q: "What is a Teams town hall?"
    a: "Microsoft Learn does not define it as a separate product. It describes events with Optimize for large audience turned on, which use the town hall policy settings. Attendees can't turn on microphone or camera on demand, they watch with a slight delay and they can pause and rewind the live video."
  - q: "How many people can attend a town hall?"
    a: "According to Microsoft Learn, the tiers under Teams Enterprise are up to 1,000 attendees with microphone, camera and interactive chat, up to 3,000 with meeting chat for large events, up to 10,000 view-only with Q&A, and up to 100,000 with an Attendee Capacity Pack. Learn recommends Teams Events Services for events above 20,000 attendees."
  - q: "Can I change the large-audience setting after saving?"
    a: "No. Microsoft Support says the Optimize for large audience setting and the mailbox selection can't be changed once the event is saved as a draft. After publishing you also can't change the access level or turn registration on or off."
  - q: "Why can I not create a town hall?"
    a: "Learn says admins control who can schedule events and whether public events are allowed, through the Teams events and meeting policies. Customers in China can't create events optimized for large audiences. Ask your Teams admin which policy applies to you."
---

A Teams town hall is an event with **Optimize for large audience** turned on. You can create it in the **Events** app or from the **Teams calendar**, add presenters, choose who can attend, publish it and then host it from a green room. Microsoft Learn does not treat town hall as a separate product. It is the broadcast-style setting of the events system, governed by town hall settings in the Teams events policy.

## Before you start

1. **Check the Events app.** Learn says the Events app (formerly Meet) is preinstalled for all Teams users. If it is not pinned, select **View more apps** and search for it.
2. **Check policy.** Admins can disable events for users and groups, control which organizers can schedule events and decide whether public events are allowed. If options are missing, the policy is the likely cause.
3. **Check capacity and license.** Learn lists the tiers under Teams Enterprise:

| Experience | Capacity |
|---|---|
| Interactive: microphone, camera, chat, reactions, raise hand, polls, Q&A | Up to 1,000 |
| Meeting chat for large events, reactions, raise hand, polls, Q&A | Up to 3,000 |
| View-only with Q&A | Up to 10,000 |
| With Attendee Capacity Pack add-on | Up to 100,000 |

Microsoft recommends Teams Events Services above 20,000 attendees. Since April 1, 2026, some features that used Teams Premium are included with Teams Enterprise. Premium still covers advanced meeting protection, advanced communication, branding and personalization, and intelligence features. Customers who bought Premium before that date keep their features until the licenses expire.

## Route 1: create it in the Events app

1. In Teams, select **Events** > **Create event**.
2. Start from scratch or use the **town hall** template.
3. Under **Add event details**, enter the name, start and end times, optional location and description.
4. Under **Who's planning this event**, choose the mailbox that sends invites and add co-organizers and presenters.
5. Under **Who can attend**, set access, invite people and groups and turn on registration if needed.
6. Under **Set up experience and options**, turn on **Optimize for large audience**, set capacity and configure attendee features.
7. Select **Save and Continue**. Nobody is invited until you publish.

Learn's rules for the large-audience setting:

- Up to 1,000 attendees it is off by default and you can turn it on.
- Above 1,000 attendees it is on and can't be turned off.
- The town hall template uses town hall settings unless the setting is off.
- After saving, you can't change it.

Turn on **Enable Green room** here if presenters should check audio, video and screen sharing before the start.

## Route 2: schedule it from the Teams calendar

Microsoft Support describes a separate path for a town hall scheduled in the calendar:

1. Open **Calendar** in Teams.
2. Select the dropdown arrow next to **New** and choose the town hall option.
3. Under **Details**, enter title, dates and description. The maximum duration is 30 hours.
4. Under **Event group**, add co-organizers and presenters, including up to 20 external presenters.
5. Select **Save and send invites**.
6. Under **Event access**, choose your organization, public, or people and groups. People and groups allow up to 500 individuals and 20 groups. Dynamic and federated groups aren't supported.
7. Select **Meeting options** for more settings, then **Publish**.

That article does not mention Optimize for large audience. An event scheduled in the calendar can only be edited in the calendar, not in the Events app.

## Roles

- **Organizer:** creates and configures the event within admin policy.
- **Co-organizer:** has most organizer capabilities but can't change details such as date and time. Can export Q&A to CSV and see real-time insights. In the Events app, full editing parity needs an event mailbox.
- **Presenter:** speaks and shares content. External presenters get a unique join link that skips the lobby, and it works on up to three devices.
- **Attendee:** on a large-audience event can't turn on microphone or camera on demand.

The pages read do not describe a separate producer role.

## Host the event

According to the Events app hosting article:

1. Open the event from **Calendar** and select **Join** > **Join now**. Attendees wait in the lobby until you start.
2. Prepare in the green room, then select **Start meeting** and confirm. Recording and transcription begin automatically.
3. Promote an attendee with **More options** > **Make a presenter**, or request a presenter from **People** > **Participants**.
4. Add the Polls app before the event starts. Poll data stays available for up to 36 hours after large-audience events.
5. To end it, select **End event**. **Leave** does not end it for everyone.
6. If something breaks, use the dropdown next to **Leave** and select **Restart event**. Presenters return to the green room and attendees rejoin from the join screen.

Q&A is switched on in event options. The hosting article does not describe moderation steps.

## Network and test

Without eCDN, Learn suggests planning about 2 Mbps per viewer at each location, or 3 Mbps for 1080p. Microsoft eCDN is on by default for organizers of large-audience events. Always schedule a dry run, and run an eCDN silent test where it applies. Attendees can't dial in to in-org or public events.

## Common mistakes

- **Deciding the setting too late.** Large-audience mode and the mailbox are locked after the first save.
- **Using Leave instead of End event.** The event keeps running.
- **Expecting an interactive crowd.** Large-audience attendees can't take the microphone on demand.
- **Ignoring policy.** Lobby, recording, Q&A and registration defaults come from admin policy.

## Limits of the sources

The Microsoft pages read give no town hall definition of their own and do not describe a producer role. Details of Q&A moderation were not available in the retrieved text.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Plan for Teams events](https://learn.microsoft.com/en-us/microsoftteams/plan-town-halls)
- [Microsoft Learn: Plan for Teams webinars and events](https://learn.microsoft.com/en-us/microsoftteams/plan-webinars)
- [Microsoft Support: Create an event in the Microsoft Teams Events app](https://support.microsoft.com/en-us/teams/meetings-events/create-event-teams-events-app)
- [Microsoft Support: Schedule a town hall in Microsoft Teams](https://support.microsoft.com/en-us/teams/meetings/schedule-a-town-hall-in-microsoft-teams)
- [Microsoft Support: Host an event in Microsoft Teams](https://support.microsoft.com/en-us/teams/meetings-events/events-app-host-event)
