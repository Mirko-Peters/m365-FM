---
title: "How to Set Up a Teams Webinar: Registration, Event Link and Attendee Settings"
summary: "Step-by-step guide to set up a Teams webinar in the Events app: create the event, turn on registration, set capacity and approval, share the event link and let registered people skip the lobby."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams, teams-premium, teams-admin-center]
keypoints:
  - "Create the webinar in the Events app: Events > Create event. Turn on registration before you publish, because you can't switch it on or off afterwards."
  - "Keep Optimize for large audience off for a webinar-style event with up to 1,000 attendees. Turn it on for a town hall style broadcast. It can't be changed once the event is saved."
  - "Registration settings sit under Registration > Configuration: event capacity, manual approval, waitlist and a registration date window."
  - "Copy the event page link from Events > Manage > your event > Share. The access level (people and groups, your organization, or public) is locked after publishing."
  - "If Registration or the event options are missing for you, your Teams admin controls them through the webinar, town hall and events policies."
faq:
  - q: "Where do I create a webinar in Teams now?"
    a: "In the Events app. Select Events on the left side of Teams (or View more apps and search for Events), then Create event. According to Microsoft Learn, the Events app was called Meet before and organizers now use one creation flow instead of choosing a fixed event type. You can start from scratch or from a webinar or town hall template."
  - q: "What is the difference between a webinar and a town hall in Teams?"
    a: "Microsoft Learn describes webinar-style events as interactive: attendees can use microphone, camera and chat if the organizer allows it, for up to 1,000 attendees. Town hall style events are broadcast style with Optimize for large audience turned on: attendees watch, can't turn on mic or camera on demand, and the capacity goes up to 3,000, with 10,000 for view-only with Q&A and 100,000 with an Attendee Capacity Pack."
  - q: "Can I turn registration on after I published the event?"
    a: "No. The Microsoft Support article on creating events says you can't change the access level or turn registration on or off after publishing. Duplicate the event, turn registration on in the copy and publish that one."
  - q: "Do registered attendees have to wait in the lobby?"
    a: "Not if you change the meeting option. In your calendar, open the webinar, select View event, then Manage event, then Meeting options. Under Meeting access, turn on the toggle that lets registered attendees bypass the lobby. You can also reject anyone who isn't registered. The change works before or during the event."
---

You want to run a webinar in Microsoft Teams: a registration page, a link people can share, and control over who gets in. This guide walks through the setup in the order you do it. It uses the current Events app flow described by Microsoft, and it says where Microsoft's pages stop and where your own admin settings take over.

## Before you start

Check three things first.

1. **Is the Events app there?** Select **Events** on the left side of Teams. If it isn't pinned, select **View more apps**, search for **Events** and open it. Microsoft Learn says the app (formerly called Meet) is preinstalled for all Teams users.
2. **Are you allowed to schedule events?** Admins can switch events off for users and groups, and they decide whether you may schedule public events. If **Registration** or the event options are missing, ask your Teams admin. Learn says registration options, the registration form questions and the policies behind them are managed in the Teams admin center.
3. **Which size and license?** According to Learn, interactive events with microphone, camera and chat support up to 1,000 attendees. Large-audience events support up to 3,000, and view-only events with Q&A up to 10,000. An Attendee Capacity Pack add-on raises the limit to 100,000. Since April 1, 2026, some features that used to need Teams Premium are included in Teams Enterprise. Premium licenses bought before that date keep their features until they expire.

## Step 1: Create the event

1. In Teams, select **Events** > **Create event**.
2. Choose **Create an event from scratch** or start from a webinar or town hall template.
3. Fill in the name, start and end date and time, an optional location and the description.
4. Under **Send invites from this mailbox**, pick your own mailbox, an event mailbox, a delegate mailbox or a shared mailbox. You can't change this after the draft is saved. Co-organizers have full editing parity only when you use an event mailbox.
5. Add **co-organizers and presenters**. They receive invites when you save.

## Step 2: Set who can attend and turn on registration

In the same flow, set the access level and invite people or groups. Turn on **registration** if you want people to sign up. Learn says in-org events don't support anonymous registration, while public events allow anonymous registration and a registration link. Decide this now. After you publish, the access level and the registration switch are locked.

## Step 3: Choose the experience

This is where webinar and town hall differ.

- **Webinar style:** leave **Optimize for large audience** off. The event is interactive and uses the webinar policy.
- **Town hall style:** turn **Optimize for large audience** on. The event is broadcast style and uses the town hall policy. Learn says this is required above 1,000 attendees.

You can also set **Event capacity**, turn attendee participation features on or off and preview them, use **Manage what attendees see** and turn on the **Green room**, which lets organizers and presenters check audio, video and screen sharing before the event. Optimize for large audience can't be changed once the event is saved, so decide before you select **Save and Continue**.

The event is now a draft. Organizers and presenters get invites. Attendees get nothing until you publish.

## Step 4: Configure registration

Open the webinar in your Teams calendar and go to **Registration** > **Configuration**. Microsoft Support lists these options:

- **Event capacity:** limits how many people can register.
- **Require manual approval of all event registrations:** you approve or deny each request.
- **Enable waitlist for this event:** overflow registrants wait once capacity is full. The waitlist is as large as the capacity.
- **Limit registration date:** sets a start and end date. By default registration stays open until the event ends.

To add questions, go to **Registration** > **Configuration**, select **Add field** under **Form**, choose a preset field or **Custom question** and select **Required** to add it. To approve people, open **Registration** > **Attendee status**, select **Pending approval**, tick the names and select **Approve** or **Reject**.

Date limits, approval and waitlist are available for events up to 3,000 attendees. Bigger events need attendee capacity packs. If you can't see these options, your admin has not enabled them.

## Step 5: Publish and share the link

1. Open the draft under **Events** > **Manage** > **Drafts**.
2. Turn on the **Preview** toggle to see what attendees see.
3. Select **Publish event**. Invites go to attendees automatically.

After publishing, a screen offers four options. You can find them again at **Events** > **Manage** > **Published** > your event > **Share**:

- **Allow attendees to discover the event** shows the event in the **Discover** feed of the Events app. Only invited people see it if you restricted the event to specific people or groups.
- **Copy join details** copies the meeting link, meeting ID and passcode and the meeting options link.
- **Copy event page link** copies the URL of the event page. Anyone within your event access level can view it.
- **Copy embed code** gives you code for SharePoint or other Microsoft 365 sites. Embedding needs the access setting **Your organization** or **Public** before you publish.

The Microsoft pages I used do not describe how to design the registration page itself. Treat the event page link as the thing you share, and test it with a colleague or a private browser window before you announce it.

## Step 6: Let registered attendees skip the lobby

1. In your Teams calendar, select the webinar.
2. Select **View event**, then **Manage event**.
3. Select **Meeting options**.
4. Under **Meeting access**, turn on the toggle for registered attendees to bypass the lobby.
5. Optionally turn on the toggle that rejects anyone who isn't registered. It appears only after the first toggle is on.
6. Select **Save**.

You can do this before or during the event. During the event it affects only people who enter the lobby afterwards.

## Step 7: External presenters and the registration report

You can add up to 20 external presenters. Go to **Events** > **Manage** > your event > **Edit details** > **Who's planning the event?**, enter email addresses under **Presenters** and select **Save and send invites**. Each presenter gets a unique join link that skips the lobby. Tell them not to forward it. The same link works on up to three devices.

After the event, open **Calendar**, select the webinar, then **Manage event** > **Reports** > **Download** > **Registration report**.

## Common problems

- **No Registration tab:** the admin policy probably does not allow it. Ask for the webinar and events policy settings.
- **You turned registration on too late:** duplicate the event under **Manage** > **More options** > **Duplicate** and turn registration on in the copy. Details, people and settings are copied.
- **Shared mailbox missing from the list:** the Microsoft Support article suggests turning on shared calendar improvements in classic Outlook, restarting Outlook, re-adding the calendar and reopening the Events app.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Support: Create an event in the Microsoft Teams Events app](https://support.microsoft.com/en-us/teams/meetings-events/create-event-teams-events-app)
- [Microsoft Support: Publicize an event in the Microsoft Teams Events app](https://support.microsoft.com/en-us/teams/meetings-events/publicize-events-teams-app)
- [Microsoft Support: Manage webinar registration in Microsoft Teams](https://support.microsoft.com/office/manage-webinar-registration-in-microsoft-teams-923f382a-0cca-433a-b38d-7461971192d1)
- [Microsoft Learn: Plan for Teams events](https://learn.microsoft.com/en-us/microsoftteams/plan-webinars)
