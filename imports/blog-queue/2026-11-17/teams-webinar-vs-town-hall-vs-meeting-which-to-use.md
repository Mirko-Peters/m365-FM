---
title: "Teams Webinar vs Town Hall vs Meeting: Which One to Use"
summary: "How Microsoft documents the difference between Teams meetings, webinars and town halls: attendee limits, registration, interaction, large-audience features and licensing, with a simple way to choose."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [teams, teams-premium, teams-admin-center]
keypoints:
  - "Microsoft's comparison has three columns: Meetings, Events up to 1,000 attendees (webinar settings), and Events optimized for large audiences (town hall settings)."
  - "Meetings allow 1,000 interactive participants on Enterprise and 300 on Business, plus up to 10,000 view-only on Enterprise. Meetings do not offer registration."
  - "Events up to 1,000 attendees support registration and attendee mic and camera. Above 1,000 attendees, the large-audience (town hall) setting is on and cannot be turned off."
  - "Large-audience events replace chat with a comment stream, remove attendee mic and camera, and add eCDN and Ultra-Low Latency. 1080p is not in events up to 1,000."
  - "Since April 1, 2026, some features once limited to Teams Premium are included with Teams Enterprise. Microsoft says Premium still covers protection, branding and intelligence features."
faq:
  - q: "What is the difference between a Teams webinar and a town hall?"
    a: "According to Microsoft Learn, both are created in the Events app. Interactive events of up to 1,000 attendees use webinar policy settings. Events with the Optimize for large audience option use town hall policy settings, which give broadcast-style delivery without attendee microphones and cameras."
  - q: "Can a Teams meeting have registration?"
    a: "No. Microsoft's feature comparison lists registration as not available for meetings. It is available for events up to 1,000 attendees. For events optimized for large audiences it is listed as available, with the 1,000-attendee scale limit applying."
  - q: "How many people can attend?"
    a: "Microsoft Learn lists meetings at 1,000 interactive participants on Enterprise and 300 on Business, plus 10,000 view-only on Enterprise. Events can reach 100,000 attendees with an Attendee Capacity Pack, and Microsoft recommends Teams Events Services for more than 20,000 attendees."
  - q: "Do I need Teams Premium for town halls?"
    a: "Microsoft Learn says Teams Enterprise supports the listed capacities and that an Attendee Capacity Pack add-on scales events to 100,000. Features once limited to Teams Premium are included with Teams Enterprise from April 1, 2026, while Premium still covers advanced protection, branding and intelligence. Check your own plan before you schedule."
  - q: "Can people in China create town halls?"
    a: "According to Microsoft Learn, customers in China cannot create Teams events optimized for large audiences, such as town halls. They can join them if hosted outside China, either as guests or anonymously if the organizer enables anonymous access."
---

Use a meeting for collaboration, a webinar for an interactive presentation with registration for up to 1,000 people, and a town hall for broadcast-style delivery to a large audience. In Microsoft's current model, webinar and town hall are not separate products. Both are events created in the Teams Events app. What changes is the **Optimize for large audience** option, which switches an event from webinar settings to town hall settings.

## How Microsoft frames the three options

Microsoft Learn's feature comparison has three columns: **Meetings**, **Events up to 1,000 attendees** and **Events optimized for large audiences**. The words "webinar" and "town hall" map to the second and third columns through the policy settings. Microsoft Learn's events planning page says:

- Interactive events of up to 1,000 attendees use **webinar policy settings**.
- Events that use **Optimize for large audience** use **town hall policy settings**.
- Up to 1,000 attendees, Optimize is off by default and the organizer can turn it on.
- Above 1,000 attendees, Optimize is on and cannot be turned off.
- The webinar template uses webinar settings, and the town hall template uses town hall settings, unless the organizer changes Optimize.

## Side-by-side comparison

| Topic | Meeting | Event up to 1,000 (webinar settings) | Event for large audiences (town hall settings) |
|---|---|---|---|
| Interactive participants | 1,000 Enterprise, 300 Business | Up to 1,000 | Up to 100,000 with an Attendee Capacity Pack |
| View-only attendees | 10,000 (Enterprise only) | Not available | 10,000 |
| Registration | Not available | Available | Available, with the 1,000-attendee scale limit |
| Attendee mic and camera | Yes | Yes, up to 1,000 | Not available |
| Chat | Meeting chat | Meeting chat | Comment stream, up to 20,000 attendees |
| Q&A, polls, reactions | See the comparison page | Q&A, polls, reactions | Q&A up to 100,000, others up to 20,000 |
| Lobby | Yes | Yes | Not available |
| Breakout rooms | Yes, with limits | Up to 1,000 attendees | Not available |
| eCDN, Ultra-Low Latency | No | No | Yes |
| 1080p video resolution | Yes | No | Yes |
| Co-organizers, presenters | 10 co-organizers | 10 co-organizers, 100 presenters | 10 co-organizers, 100 presenters |

All three share a maximum duration of 30 hours. Recording is capped at four hours or 1.5 GB, after which the recording ends and restarts automatically.

Microsoft also lists feature thresholds inside large events: registration and attendee mic and camera only up to 1,000 attendees, chat, reactions, raise hand, polls, Ultra-Low Latency and 1080p up to 20,000, and Q&A up to 100,000. Above a threshold, the feature is turned off in the scheduling form and cannot be turned on for a subset of attendees.

## When to use a meeting

Choose a meeting when people need to talk to each other: working sessions, team calls, workshops. Meetings support the lobby, breakout rooms, whiteboard and PowerPoint Live. They are the only type with channel meeting scheduling and language interpretation, according to Microsoft's comparison. They have no registration.

## When to use a webinar (event up to 1,000)

Choose this for a presentation with a defined audience that signs up. It supports registration and email customization, attendee mic and camera, a lobby and green room, breakout rooms and recording with compliance recording. Microsoft's planning page recommends webinar settings when you need an interactive session of up to 1,000 attendees.

## When to use a town hall (large-audience event)

Choose this for one-to-many broadcasts. With Optimize on:

- Attendees cannot turn on microphones and cameras on demand.
- Attendees view the event with a slight delay and can pause and rewind the live video.
- Attendees use an enterprise content delivery network (eCDN) if applicable.

Microsoft recommends Teams Events Services for events with more than 20,000 attendees. For physical sites with many viewers, it recommends an eCDN solution. Without eCDN, plan about 2 Mbps per viewer at each location, or 3 Mbps for 1080p. Run a silent test and a dry run before a large event.

## Licensing in short

Microsoft Learn states that as of April 1, 2026, some features previously limited to Teams Premium are included with Teams Enterprise. Teams Premium continues to cover advanced meeting protection, advanced communication, branding and personalization, and intelligence capabilities. Customers who bought Teams Premium before April 1, 2026 keep the previously included features until their licenses expire. The Attendee Capacity Pack add-on scales events to 100,000 attendees. Which license a specific feature needs is marked per row on Microsoft's comparison page, so check the row before you promise a feature to an organizer.

## Admin controls

The Events app, formerly the Meet app, is preinstalled for all Teams users. Creation is governed by existing webinar and town hall policies. Admins can disable events for users and groups, control which organizers can schedule events, and decide whether organizers can schedule public events. In China, organizers cannot create large-audience events.

## A quick decision path

1. Does the audience need to speak or share video? Use a meeting or a webinar of up to 1,000.
2. Do you need registration? Use an event, not a meeting.
3. More than 1,000 attendees, or broadcast with delay and eCDN? Use a large-audience event.
4. Over 20,000 attendees? Microsoft recommends Teams Events Services.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Meetings and events feature and capacity comparison](https://learn.microsoft.com/en-us/microsoftteams/meetings-events-feature-comparison)
- [Microsoft Learn: Plan for Teams events](https://learn.microsoft.com/en-us/microsoftteams/plan-events)
