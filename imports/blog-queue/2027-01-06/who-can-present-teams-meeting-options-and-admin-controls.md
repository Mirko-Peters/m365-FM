---
title: "Who Can Present in a Teams Meeting: Roles, Presenter Options and Admin Controls"
summary: "Who can present in a Teams meeting: the three Who can present options, organizer, co-organizer, presenter and attendee roles, the admin policy in Meetings > Meeting policies, request control settings and documented gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [teams, teams-admin-center]
keypoints:
  - "Learn lists three Who can present options: Only organizers and co-organizers, People in my org and guests, and Everyone, which is the default."
  - "Admins set the default under Meetings > Meeting policies > Content sharing. Organizers can change it per meeting in Meeting options."
  - "The policy affects all meetings and events, including Meet Now meetings."
  - "Participants can give or request control is a per-user policy. External participants have a separate policy and the organizer's Who can present setting decides what they can do."
  - "The page does not cover channel meetings, webinars, or the handling of anonymous users under Who can present."
faq:
  - q: "What are the Who can present options?"
    a: "According to Microsoft Learn: Only organizers and co-organizers, People in my org and guests, and Everyone. Everyone is the default. The page does not use the labels Specific people or Only me."
  - q: "Where does the admin set the default?"
    a: "In the Teams admin center go to Meetings > Meeting policies, select or create a policy, open the Content sharing section and set Who can present. Organizers can change it per meeting in Meeting options."
  - q: "What does Only organizers and co-organizers do?"
    a: "Only the organizer and chosen co-organizers can present. All other participants join as attendees."
  - q: "Can external participants take control of my screen?"
    a: "Only if the policy External participants can give or request control is on for the person who organizes. Learn says it covers anonymous participants, guests and external access users. It does not control what external participants can do when they attend."
  - q: "Which PowerShell settings are documented?"
    a: "Set-CsTeamsMeetingPolicy with AllowParticipantGiveRequestControl and AllowExternalParticipantGiveRequestControl. The page uses one parameter name inconsistently in text and examples, so check the cmdlet reference."
---

To decide who can present, set the Who can present option in the meeting policy and let organizers adjust it per meeting in Meeting options. Everyone is the default. This guide follows the Microsoft Learn page on managing who can present and request control. It lists what the page says about roles and settings and where it stays silent.

## Roles on the page

The page refers to four roles and links to its Roles in a Teams meeting article for full definitions.

| Role | What the page says |
| --- | --- |
| Organizer | Sets Meeting options, including Who can present |
| Co-organizer | Chosen by the organizer. Under Only organizers and co-organizers, the organizer and the chosen co-organizers can present |
| Presenter | A participant who can present. Under People in my org and guests, authenticated org users and guests join as presenters |
| Attendee | A participant who is not a presenter. Under Only organizers and co-organizers, all other participants join as attendees |

## The Who can present options

| Option | Behavior |
| --- | --- |
| Only organizers and co-organizers | Only the organizer and chosen co-organizers can present. Everyone else is an attendee |
| People in my org and guests | Authenticated users in your org, including guests, join as presenters |
| Everyone (default) | Everyone attending joins as a presenter |

The admin policy sets the default that organizers see in Meeting options. Organizers can change it for each meeting. The policy affects all meetings and events, including Meet Now meetings.

## Set the policy in the Teams admin center

1. Go to **Meetings** > **Meeting policies**.
2. Select an existing policy or create a new one.
3. Open the **Content sharing** section.
4. Set **Who can present**, **Participants can give or request control** and **External participants can give or request control**.
5. Select **Save**.

## Request control rules

**Participants can give or request control** is a per-user policy.

- On: the **Give Control** option appears in the top bar during sharing, and users can hover at the top of the screen to give control.
- Off: the option is not available.

**External participants can give or request control** is a per-user policy that applies to meetings and events the policy holder organizes.

- It controls whether external participants can give, be given or request control of the sharer's screen.
- It does not control what external participants can do when they attend. The organizer's **Who can present** and **Who can bypass the lobby** settings in Meeting options decide that.
- External categories on the page: anonymous participants, guests and external access users.
- For external access users to give control to other external participants, both your organization and the other organization's admin must set this policy to On.

## PowerShell for control settings

```powershell
Set-CsTeamsMeetingPolicy -Identity <policy name> -AllowParticipantGiveRequestControl $True
Set-CsTeamsMeetingPolicy -Identity <policy name> -AllowExternalParticipantGiveRequestControl $True
```

Use `$False` to turn them off. The page's intro names one parameter, but its examples use another for the participant setting, so confirm names in the cmdlet reference. The page gives no PowerShell parameter for Who can present.

## Limits and gaps

- The feature is available only in events with up to 1,000 attendees.
- The page describes Who can present as a per-user policy and also as affecting all meetings and events, and does not reconcile the two.
- It gives no behavior for channel meetings and webinars, no specific handling of anonymous users under Who can present, no default values for the control settings, no client version requirements and no licensing details.

## Choosing an option

The guidance below is practical advice built on the option descriptions.

| Situation | Option to consider |
| --- | --- |
| Large presentation with one speaker | Only organizers and co-organizers |
| Internal workshop with invited guests | People in my org and guests |
| Small informal call | Everyone |

For sensitive meetings, set the policy default to the most restrictive option that your users can live with, and let organizers loosen it per meeting. Learn links a separate page on the presentation experience for sensitive meetings, which was not read here.

## Typical mistakes

- Assuming the external control policy decides who may present.
- Expecting an Only me option, which the page does not list.
- Changing the policy and expecting it to affect only some meetings. Learn says it affects all meetings and events.
- Forgetting that both organizations must allow control between external access users.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams meeting lifecycle events](https://www.m365.fm/entity/teams-meeting-lifecycle-events/)

## Sources

- [Manage who can present and request control in Teams meetings and events (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/meeting-who-present-request-control)
