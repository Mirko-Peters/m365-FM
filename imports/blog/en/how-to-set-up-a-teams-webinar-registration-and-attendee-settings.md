---
title: "How to Set Up a Teams Webinar: Registration, Event Link and Attendee Settings"
summary: "Step-by-step guide to set up a Teams webinar in the Events app: create the event, turn on registration, share the event link and let registered people skip the lobby."
status: approved
publish: true
author: mirko-p
date: 2026-11-18
topics: [teams, teams-premium]
keypoints:
  - "Create the webinar in the Events app: Events > Create event. Turn on registration before you publish, because you can't switch it on or off afterwards."
  - "Keep Optimize for large audience off for a webinar-style event with up to 1,000 attendees. Turn it on for a town hall style broadcast. It can't be changed once the event is saved."
  - "Registration settings sit under Registration > Configuration: event capacity, manual approval, waitlist and a registration date window. Support marks the last three as advanced features."
  - "Copy the event page link from Events > Manage > Published > your event > Share. The access level (people and groups, your organization, or public) is locked after publishing."
  - "To let registered people skip the lobby, turn on Attendees with a registration link can bypass the lobby in Meeting options. Microsoft Learn lists this for public events but not for in-org events."
  - "If Registration or the event options are missing for you, Microsoft says to contact your IT admin. Capacity depends on license and interaction: with registration and attendee mic and camera it is 1,000 for every license, and with registration but without attendee mic and camera only advanced (enterprise) licenses reach 3,000, while foundational licenses stay at 1,000."
faq:
  - q: "Where do I create a webinar in Teams now?"
    a: "In the Events app. Select Events on the left side of Teams (or View more apps and search for Events), then Create event. Microsoft Learn says the app was called Meet before and organizers now use one creation flow. You can start from scratch or from a webinar or town hall template."
  - q: "What is the difference between a webinar and a town hall in Teams?"
    a: "Microsoft Learn describes webinar-style events as interactive: attendees can use microphone, camera and chat, for up to 1,000 attendees. Town hall style events are broadcast style with Optimize for large audience turned on: attendees can't turn on mic or camera on demand. Capacity goes up to 3,000 depending on license and interaction, and 10,000 for view-only events without registration."
  - q: "Can I turn registration on after I published the event?"
    a: "No. The Microsoft Support article on creating events says you can't change the access level or turn registration on or off after publishing. Decide before you select Publish event."
  - q: "Do registered attendees have to wait in the lobby?"
    a: "Not if you change the meeting option. In your Teams calendar, open the webinar, select View event, Manage event, then Meeting options. Under Meeting access, turn on Attendees with a registration link can bypass the lobby, then select Save. Microsoft Learn lists this option for public events but not for in-org events, so it may be missing depending on your access level."
---

You want to run a webinar in Microsoft Teams: a registration page, a link people can share, and control over who gets in. This guide follows the current Events app flow described by Microsoft and says where Microsoft's pages stop.

## Before you start

Check three things first.

1. **Is the Events app there?** Select **Events** on the left side of Teams. If it isn't pinned, select **View more apps**, search for **Events** and open it. Microsoft Learn says the app (formerly Meet) is preinstalled for all Teams users.
2. **Are you allowed to schedule events?** Microsoft Learn says admins can disable events for users and groups, control which organizers can schedule events and decide whether organizers can schedule public events. If **Registration** or the event options are missing, Microsoft Support says to contact your IT admin.
3. **Which size and license?** Two Microsoft Learn pages cover this.
   - The plan page lists capacity by event type: up to 1,000 attendees with microphone, camera and chat, up to 3,000 with chat, reactions, raise hand, polls and Q&A, and up to 10,000 for view-only events with Q&A. An Attendee Capacity Pack raises the limit to 100,000. It ties these tiers to Teams Enterprise but doesn't list individual license SKUs.
   - The events features page ties it to licenses. With registration and attendee microphone and camera, both tiers reach 1,000. Without attendee mic and camera, foundational licenses (Business Basic, Standard and Premium, Teams Essentials, F1 and F3, among others) stay at 1,000, while advanced licenses (Office 365 E1, E3, E5 and Microsoft 365 E3, E5, E7, among others) reach 3,000. View-only events without registration reach 10,000 with both.
   - Since April 1, 2026, some features that needed Teams Premium are included with Teams Enterprise. Premium licenses bought before that date keep their features until they expire. Premium licenses bought after April 2026 don't directly provide access to the event features: you need a license from the advanced event category. Premium still offers advanced meeting protection and branding.

## Step 1: Create the event

1. In Teams, select **Events** > **Create event**.
2. Choose **Create an event from scratch** or start from a webinar or town hall template.
3. Fill in the name, start and end date and time, an optional location and the description.
4. Under **Send invites from this mailbox**, pick your own, an event, a delegate or a shared mailbox. You can't change this after the draft is saved. Co-organizers get full scheduling and editing capabilities with an event mailbox and limited capabilities with your own mailbox.
5. Add **co-organizers and presenters**. They receive invites when you save.

## Step 2: Set who can attend and turn on registration

In the same flow, set the access level and invite people or groups. Turn on **registration** if you want people to sign up. Learn says in-org events don't support anonymous registration, while public events do. Decide now: both are locked after you publish.

## Step 3: Choose the experience

This is where webinar and town hall differ.

- **Webinar style:** leave **Optimize for large audience** off. The event is interactive and uses the webinar policy.
- **Town hall style:** turn **Optimize for large audience** on. The event is broadcast style and uses the town hall policy. Learn says this is required above 1,000 attendees.

You can also set **Event capacity** and turn on **Enable Green room**, which gives organizers and presenters a place to check audio, video and screen setup before the event starts. Optimize for large audience can't be changed once the event is saved, so decide before you select **Save and Continue**.

When you are done with all sections, select **Save and Continue** at the end of the creation flow. The event is now a draft. Organizers and presenters get invites. Attendees get nothing until you publish.

## Step 4: Configure registration

Microsoft Support says to open the webinar from your Teams calendar and go to **Registration** > **Configuration**. It doesn't describe reaching Registration from a draft or from **Events** > **Manage**, or say whether to do this before or after you publish. The options are:

- **Event capacity:** limits how many people can register.
- **Require manual approval of all event registrations:** you approve or deny each request.
- **Enable waitlist for this event:** overflow registrants wait once capacity is full. The waitlist is as large as the capacity.
- **Limit registration date:** sets a start and end date. By default registration stays open until the event ends.

To add questions, go to **Registration** > **Configuration**, select **Add field** under **Form**, choose a preset or **Custom question** and select **Required**. To approve people, open **Registration** > **Attendee status**, select **Pending approval**, tick the names and select **Approve** or **Reject**.

Microsoft Support marks manual approval, the waitlist and the registration date limit as advanced features for events up to 3,000 attendees. Bigger events need attendee capacity packs. For each of the three, Support's notes add that if you had Teams Premium before April 1, 2026, you keep access in events up to 100,000 attendees until the license expires. Support names no other license for these options. If they are missing, contact your IT admin.

## Step 5: Publish and share the link

1. Open your draft from the **Manage** area of the Events app.
2. Turn on the **Preview** toggle to see what attendees see.
3. Select **Publish event**. Invites go to attendees automatically.

After publishing, a screen offers four options. You can find them again at **Events** > **Manage** > **Published** > your event > **Share**:

- **Allow attendees to discover the event** shows the event in the **Discover** feed of the Events app. Only invited people see it if you restricted the event to specific people or groups.
- **Copy join details** copies the meeting link, ID, passcode and meeting options link.
- **Copy event page link** copies the URL of the event page. Microsoft says the link works for anyone within your event's access level.
- **Copy embed code** gives you code for SharePoint or other Microsoft 365 sites. Embedding needs the access setting **Your organization** or **Public** before you publish.

Test the event page link in a private browser window before you announce it.

## Step 6: Let registered attendees skip the lobby

1. In your Teams calendar, select the webinar.
2. Select **View event**, then **Manage event**.
3. Select **Meeting options**.
4. Under **Meeting access**, turn on **Attendees with a registration link can bypass the lobby**.
5. Optionally turn on **Reject anyone who can't bypass the lobby**. Microsoft Support says this one is available only when the first toggle is on.
6. Select **Save**.

If you change this setting during the event, it affects attendees who enter the lobby after the change.

Microsoft Learn's feature table lists this lobby bypass for **public** events and not for **in-org** events, so the option may be missing depending on your access level.

## Step 7: External presenters and the registration report

You can add up to 20 external presenters. Go to **Events** > **Manage** > your event > **Edit details** > **Who's planning the event?**, enter email addresses under **Presenters** and select **Save and send invites**. Each presenter gets a unique join link that skips the lobby. Tell them not to forward it. The link works on up to three devices. A guest who hasn't successfully authenticated when joining is placed in the lobby instead, and an organizer or presenter then approves or denies entry.

After the event, open **Calendar**, select the webinar, then **Manage event** > **Reports** > **Download** > **Registration report**.

## Common problems

- **No Registration tab or options:** Microsoft says to contact your IT admin.
- **Registration or access level is locked:** you can't change either after publishing. **Duplicate** (under **Manage** > **More options**) copies details, people, groups and settings. Microsoft doesn't say whether you can switch registration on in the copy.
- **Shared mailbox missing from the list:** if it was created in classic Outlook, Microsoft Support suggests turning on shared calendar improvements in Outlook on the web, restarting Outlook, re-adding the calendar and reopening the Events app.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)

## Sources

- [Microsoft Support: Create an event in the Microsoft Teams Events app](https://support.microsoft.com/en-us/teams/meetings-events/create-event-teams-events-app)
- [Microsoft Support: Publicize an event in the Microsoft Teams Events app](https://support.microsoft.com/en-us/teams/meetings-events/publicize-events-teams-app)
- [Microsoft Support: Manage webinar registration in Microsoft Teams](https://support.microsoft.com/office/manage-webinar-registration-in-microsoft-teams-923f382a-0cca-433a-b38d-7461971192d1)
- [Microsoft Learn: Plan for Teams events](https://learn.microsoft.com/en-us/microsoftteams/plan-webinars)
- [Microsoft Learn: Teams events features, capacity and licensing](https://learn.microsoft.com/microsoftteams/events-features)
