---
title: "Teams Meet Now, Lobby and Waiting Room: Settings Explained"
summary: "How the Teams lobby works for Meet now and scheduled meetings: who bypasses it, who can admit people, the admin policy settings and their defaults, and how to turn the lobby off."
status: review
publish: false
author: mirko-p
date: 2026-11-25
topics: [teams, teams-admin-center]
keypoints:
  - "Teams documentation calls the waiting room the lobby. People who do not bypass it wait there until an organizer, co-organizer or presenter admits them."
  - "The admin setting Who can bypass the lobby defaults to People in my org and guests. Organizers can change it in Meeting options."
  - "Dial-in callers wait in the lobby by default. The setting People dialing in can bypass the lobby is Off unless you change it."
  - "Meet now is controlled by two policy toggles, Meet now in private meetings and Meet now in channel meetings, both on by default."
  - "There is no single switch to turn the lobby off. Microsoft says to set Who can bypass the lobby to Everyone and let dial-in callers bypass it."
faq:
  - q: "Is the Teams waiting room the same as the lobby?"
    a: "Yes in practice. The Microsoft Learn pages read for this article use the word lobby for the place where people wait until they are admitted. They do not use the term waiting room, so search for lobby settings in the Teams admin center."
  - q: "Who can admit people from the lobby by default?"
    a: "According to Microsoft Learn, the default for Who can admit from lobby is Organizers and presenters. Organizers can change this in Meeting options. Templates and sensitivity labels do not support this setting."
  - q: "Why do dial-in callers always wait in the lobby?"
    a: "Microsoft Learn lists People dialing in can bypass the lobby with a default of Off. When it is Off, dial-in users wait until an organizer, co-organizer or presenter admits them. Organizers can change it in Meeting options."
  - q: "How do I turn the lobby off completely?"
    a: "Microsoft Learn says no single control does this. Set Who can bypass the lobby to Everyone and People dialing in can bypass the lobby to On. Anonymous users and dial-in callers still wait if the meeting has not started, unless Anonymous users and dial-in callers can start a meeting is On, which Microsoft does not recommend."
  - q: "Does the lobby setting for Meet now come from the policy?"
    a: "A 2021 Microsoft Tech Community answer says Meet now defaults to the settings in the organizer's meeting policy, and that changes made in a running meeting do not persist. The Learn pages read for this article do not describe the lobby for Meet now, so verify this in your tenant."
---

Teams uses the term lobby for the place where people wait until someone admits them. Who skips the lobby is set in a meeting policy in the Teams admin center, and organizers can change some of it in Meeting options. The default is that people in your organization and guests join directly, while everyone else waits. Meet now follows the organizer's meeting policy, according to one Microsoft community answer, so the policy is the place to start.

## Where the settings live

In the Teams admin center, the lobby controls are under **Meetings** > **Meeting policies** > select a policy > **Meeting join & lobby**. Microsoft says changes can take up to 24 hours. The org-wide **Meetings** > **Meeting settings** page has no lobby settings, but it holds the anonymous join switch under **Participants**.

| Setting | Default | What it does |
|---|---|---|
| Who can bypass the lobby | People in my org and guests | Sets who joins directly. Organizers can change it in Meeting options. |
| People dialing in can bypass the lobby | Off | Dial-in callers wait until admitted. |
| Who can admit from lobby | Organizers and presenters | Sets who can admit people from the lobby. |
| Anonymous users and dial-in callers can start a meeting | Off | When Off, they wait until a verified participant joins, then are admitted automatically. |
| Anonymous users can join a meeting | On | When anonymous join is off in the org-wide settings, anonymous users cannot join any meeting. |

Microsoft recommends leaving **Anonymous users and dial-in callers can start a meeting** Off. It only works if anonymous join is on in both the org-wide settings and the policy, and **Who can bypass the lobby** is **Everyone**.

## The values of "Who can bypass the lobby"

| Value | Joins directly | Waits in the lobby |
|---|---|---|
| Everyone | All, including anonymous | None |
| People in my org, trusted orgs, and guests | Org, trusted orgs, guests | Anonymous |
| People in my org and guests | Org, guests | Trusted orgs, anonymous |
| People in my org | Org | Guests, trusted orgs, anonymous |
| People who were invited | Anyone sent or forwarded an invite | Everyone else, including people with only the link |
| Only organizers and co-organizers | Organizers and co-organizers | Everyone else |

Organizers and co-organizers always bypass the lobby. Under **People who were invited**, distribution lists of up to 10,000 users count as invited, and in channel meetings only directly invited channel members bypass. In the older community answer this setting was called "Automatically admit people". The current Learn pages name it **Who can bypass the lobby**.

## Prerequisites for external people

Learn says that if one of these is off, that type of participant cannot join, whatever the lobby settings are:

- **Guest access** for guests.
- **External access** for users from trusted organizations. Mutual trust must be set up.
- **Anonymous meeting join** for anonymous participants.

## What organizers can change

Organizers can change **Who can bypass the lobby**, **People dialing in can bypass the lobby** and **Who can admit from lobby** in **Meeting options**. To enforce a value so that organizers cannot change it, Microsoft says to use a meeting template or a sensitivity label, which needs a Teams Premium license. Templates and labels do not support **Who can admit from lobby**.

## Meet now

Meet now starts an instant meeting. Two toggles under **Meetings** > **Meeting policies** > **Meeting scheduling** control it:

- **Meet now in private meetings**: whether a user can start an instant private meeting.
- **Meet now in channel meetings**: whether a user can start an instant meeting in a channel.

Both are on by default. If you turn one off, Microsoft says users assigned to the policy cannot start meetings of that type, and the join links and conference IDs of existing meetings of that type that the user started or scheduled stop working. Content such as chats, files, recordings and transcripts is retained. If the setting is turned back on, previously scheduled meetings become active again.

For the lobby in a Meet now meeting, the best source found is a 2021 answer on Microsoft Tech Community. A teacher asked how students in the same domain could join a Meet now meeting without waiting. The accepted answer said that Meet now uses the settings of the organizer's policy, that the admin should create a policy with the automatic admission setting and assign it to the user, and that the policy applies per organizer. The Learn pages read for this article do not describe Meet now and the lobby together, so test with a pilot user.

## How to turn the lobby off

Microsoft says no single control does it. Use both:

1. Set **Who can bypass the lobby** to **Everyone**.
2. Set **People dialing in can bypass the lobby** to **On**.

Anonymous users and dial-in callers still wait if the meeting has not started. Setting **Anonymous users and dial-in callers can start a meeting** to **On** avoids that, but Microsoft does not recommend it, because a meeting could then run with no verified participant.

## Check what a user will experience

Learn points to the **Run Tests: Lobby Access** tool in the Microsoft 365 admin center. Sign in as a Teams administrator, and the tool explains the expected lobby experience for a specific user in a specific meeting. It is the quickest way to test a policy before users complain.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)

## Sources

- [Microsoft Learn: Manage who can bypass the meeting lobby in Teams](https://learn.microsoft.com/en-us/microsoftteams/who-can-bypass-meeting-lobby)
- [Microsoft Learn: Meeting policy settings for participants and guests](https://learn.microsoft.com/en-us/microsoftteams/meeting-policies-participants-and-guests)
- [Microsoft Learn: Manage meeting settings in Teams](https://learn.microsoft.com/en-us/microsoftteams/meeting-settings-in-teams)
- [Microsoft Learn: Manage who can start instant meetings and schedule meetings](https://learn.microsoft.com/en-us/microsoftteams/manage-who-can-schedule-meetings)
- [Microsoft Tech Community: Meet button and bypass the lobby](https://techcommunity.microsoft.com/t5/microsoft-teams/meet-button-bypass-the-lobby/td-p/2121290)
