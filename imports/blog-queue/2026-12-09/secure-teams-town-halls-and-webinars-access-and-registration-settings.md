---
title: "Securing Microsoft Teams Town Halls and Webinars: Attendee Access and Registration Settings"
summary: "Control who can attend Teams town halls and webinars: set attendee access in the Events policy, choose in-org or public events, manage registration, anonymous access, lobby, watermarks and presenter verification, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [teams, teams-premium]
keypoints:
  - "In the Teams admin center, open Meetings > Events policies. Separate settings control who can attend events up to 1,000 attendees and events optimized for a large audience."
  - "Both attendee access settings default to Everyone. Restrict them to the organization, with or without guests, if the event is internal."
  - "Public events allow anyone with a registration link to join. In-org events do not."
  - "Organizers can require registration approval, limit registration times and auto-reject people who cannot bypass the lobby."
  - "Watermarks and blocking copy or forward of chat, captions and transcripts need Teams Premium."
faq:
  - q: "Where do admins restrict who can attend a town hall?"
    a: "Microsoft Learn says in the Teams admin center under Meetings, Events policies. The setting Who can attend events optimized for a large audience maps to the TownhallEventAttendeeAccess parameter with the values Everyone, EveryoneInOrganization and EveryoneInOrganizationAndGuests. The default is Everyone."
  - q: "What is the difference between public and in-org events?"
    a: "Microsoft Learn says that in a public event anyone with a registration link can join and anonymous users can register. In an in-org event they cannot. Both types include guests and unique join links per attendee, and organizers can auto-reject people who cannot bypass the lobby."
  - q: "Can I require approval for webinar registrations?"
    a: "Yes. Learn says organizers can decide how many people can register, require manual registration approval, enable a waitlist and limit registration start and end time. Admins manage who can register and which questions organizers can require on the form."
  - q: "Do watermarks require a license?"
    a: "Yes. Microsoft Learn labels watermarks for attendee video and shared content, and preventing copying or forwarding of chat, captions and transcripts, as Teams Premium features. The tenant needs at least one active Teams Premium license, and the page notes some features moved to Teams Enterprise on April 1, 2026."
---

To secure Teams town halls and webinars, start with the Events policy in the Teams admin center, where you decide who may schedule events and who may attend them. Then use the event options organizers can set: in-org or public access, registration approval, lobby behavior, anonymous access and presenter verification. Teams Premium adds watermarks and limits on copying content. The steps below follow Microsoft Learn's pages on town halls, webinars and event policies.

## Step 1: Know which event type you are securing

Microsoft Learn describes two groups of settings. **Events up to 1,000 attendees** use webinar policy settings. **Events optimized for a large audience** use town hall policy settings. The switch **Optimize for large audience** decides which applies. Under 1,000 attendees it is off by default and can be turned on. Above 1,000 attendees it is on and cannot be turned off.

## Step 2: Set who can schedule events

In the **Teams admin center**, select **Meetings** > **Events policies**, then open or create a policy. Two toggles, both on by default, control who can create events:

- **Events up to 1k attendees**, parameter `-AllowWebinars`.
- **Events optimized for a large audience**, parameter `-AllowTownhalls`.

Learn warns that if you turn a toggle off after someone scheduled an event, that person can no longer run or start it.

## Step 3: Restrict who can attend

In the same policy, set attendee access. Both settings default to **Everyone**.

| Event type | Admin center setting | PowerShell parameter | Values |
|---|---|---|---|
| Up to 1,000 attendees | Who can attend events up to 1k attendees | `-EventAccessType` | `Everyone`, `EveryoneInCompanyExcludingGuests`, `EveryoneInCompany` |
| Large audience | Who can attend events optimized for a large audience | `-TownhallEventAttendeeAccess` | `Everyone`, `EveryoneInOrganization`, `EveryoneInOrganizationAndGuests` |

For an internal town hall, choose the organization option. In the admin center the labels read "Everyone in my organization excluding guests" and "Everyone in my organization including guests". Example from Learn:

```powershell
Set-CsTeamsEventsPolicy -Identity <policy name> -TownhallEventAttendeeAccess EveryoneInOrganizationAndGuests
```

The pages read here do not state how long a policy change takes to apply. Check with a test event after you change it.

## Step 4: Understand public and in-org events

Admins control whether organizers can schedule public or only in-org events. Learn's comparison:

| Capability | In-org | Public |
|---|---|---|
| Anyone with a registration link can join | No | Yes |
| Anonymous users can register | No | Yes |
| Unique join links per attendee | Yes | Yes |
| Organizer can let registration-link holders bypass the lobby | No | Yes |
| Organizer can auto-reject people who cannot bypass the lobby | Yes | Yes |
| Attendees can dial in | No | No |

If the event is not meant for the public, an in-org event removes the open registration link path.

## Step 5: Control registration

Per Microsoft Learn, admins manage who can register for events and which question types an organizer can require. Organizers can then:

- set how many people can register,
- require manual registration approval,
- enable a waitlist, and
- limit the registration start and end time.

Registration is not labeled a Teams Premium feature on the webinar planning page.

## Step 6: Set lobby, anonymous and presenter controls

- **Anonymous participants.** Admins manage how anonymous attendees access Teams meetings in the organization. If the admin allows it, organizers can prevent anonymous users from joining specific events.
- **Lobby.** Admins set defaults for new events, and organizers choose lobby settings for certain events.
- **External presenters.** Admins can require anonymous and unverified external presenters to verify their identity before joining.
- **Presenter permissions.** Admins can limit presenter role permissions for the tenant.

## Step 7: Add Teams Premium protections where needed

Learn lists these as Teams Premium: watermarks for attendee video and shared content, and preventing copying or forwarding of chat, captions and transcripts through a meeting template or sensitivity label. Admins can allow or prevent watermarks, and organizers can enforce them if allowed. The tenant needs at least one active Teams Premium license. Learn adds that as of April 1, 2026, some features previously limited to Teams Premium are included in Teams Enterprise, so check the current license comparison.

## Step 8: Review recording and Q&A

- Admins can allow or prevent recording and set an expiration time. Organizers can set who can record (Teams Premium) and automatic recording.
- Admins can apply an automatic compliance recording policy.
- Admins decide whether organizers can use Q&A. Organizers and co-organizers can export questions and answers to CSV.

## Checklist before a large event

1. Confirm the Events policy assigned to the organizers.
2. Choose in-org or public deliberately.
3. Turn on registration approval for sensitive audiences.
4. Decide on anonymous access and the lobby.
5. Verify external presenters.
6. Enable watermarks if you have Teams Premium.
7. Run a dry run and a silent test. Learn recommends both for large-audience events.

## What the pages read do not cover

They do not describe end-to-end encryption or DRM for town halls. Learn's town hall planning page states neither. If your requirements include them, check Microsoft's current feature comparison for meetings and events.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)

## Sources

- [Microsoft Learn: Manage who can schedule and attend events in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/set-up-events)
- [Microsoft Learn: Plan for Teams town halls](https://learn.microsoft.com/en-us/microsoftteams/plan-town-halls)
- [Microsoft Learn: Plan for Teams webinars](https://learn.microsoft.com/en-us/microsoftteams/plan-webinars)
