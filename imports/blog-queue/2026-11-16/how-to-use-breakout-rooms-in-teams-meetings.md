---
title: "How to Use Breakout Rooms in Microsoft Teams Meetings: Create, Assign, Manage"
summary: "How breakout rooms work in Teams meetings: who can create them, how to create and assign rooms before or during a meeting, time limits, managers, joining, attendance reports, limits and fixes."
status: review
publish: false
author: mirko-p
date: 2026-11-16
topics: [teams, teams-meeting-apps, teams-admin-center]
keypoints:
  - "The organizer, or a presenter appointed as a breakout room manager, creates rooms in Teams for desktop. Up to 50 rooms are allowed."
  - "Create rooms before a meeting from the calendar event, or during it with Rooms in the meeting controls. Assign people manually, randomly or let them self-select."
  - "Rooms close automatically when a time limit ends. Ending the main meeting does not close rooms, so select Close rooms first."
  - "Participants signed in with a Teams (free) account cannot be added or assigned to rooms."
  - "Breakout rooms are available for up to 1,000 participants. Rooms and pre-assignments expire if not opened within 60 days."
faq:
  - q: "Who can create breakout rooms in Teams?"
    a: "According to Microsoft Support, the meeting organizer, or a presenter from the organizer's organization who was appointed as a breakout rooms manager, can create rooms. Presenters are appointed in the Rooms settings by turning on Assign presenters to manage rooms and choosing the presenters."
  - q: "Why is the Rooms button missing in my meeting?"
    a: "Microsoft Support lists reasons: you are not the organizer or a manager, you did not join from Windows (including VDI) or macOS, you are outside the organizer's organization, the meeting was organized in a private or shared channel, or an admin policy disables breakout rooms. Microsoft's troubleshooting guide lists these causes."
  - q: "Do breakout rooms close when I end the meeting?"
    a: "No. Microsoft Support states that End meeting closes only the main meeting. Select Close rooms in the breakout rooms panel to close them. A room shows Closed when it is closed."
  - q: "How many people and rooms are supported?"
    a: "Microsoft Support says up to 50 rooms and a meeting size of up to 1,000 people. Once a meeting goes over 1,000 participants, breakout rooms stay disabled even if the number drops later. Microsoft's Teams limits page says breakout rooms are not supported in events optimized for large audiences."
---
In Microsoft Teams, the meeting organizer creates breakout rooms, assigns people and opens them so groups can talk separately before returning to the main meeting. You can prepare rooms before the meeting or create them during it. This guide covers the steps, the rules that trip people up and what Microsoft says about limits.

## Before you start

Microsoft Support documents these prerequisites:

- Rooms are created by the organizer or by a presenter from the organizer's organization who is a breakout rooms manager.
- Use Teams for desktop. Microsoft's troubleshooting guide says the Rooms icon appears when you join from Windows (including VDI) or macOS.
- The meeting can have up to 1,000 people and up to 50 rooms.
- Participants signed in with a Teams (free) account cannot be added or assigned to rooms.
- The Breakout rooms option appears in a calendar event only after invites have been sent.
- Rooms are not offered in meetings organized in private or shared channels, and an admin policy can turn the feature off.

## Create rooms before the meeting

1. In Teams, go to **Calendar** and select the meeting.
2. Select **View event**, then **More options**, then **Breakout rooms**.
3. Select **Create rooms**, choose the number of rooms and select **Add rooms**.
4. Select **Assign participants**, pick an assignment method, then **Next** and **Save**.

The Breakout rooms option appears in the calendar event only after invites have been sent.

## Create rooms during the meeting

1. Select **Rooms** in the meeting controls, or **More actions**, then **Rooms**.
2. Choose the number of rooms and an assignment method.
3. Select **Create rooms**.

To add a room later, open **Rooms** and select **Add room**. You cannot automatically assign people after the meeting has started.

## Assignment methods

Microsoft lists three: manual, random and self-select. With manual or random assignment, people move to open rooms right away unless you turn off **Automatically move people to rooms**. With self-select, participants view the open rooms and join one themselves.

## Settings: time limit and managers

Open **Rooms settings** (from **Breakout rooms** before the meeting or **Rooms** during it) to change the assignment method, time limit, automatic move and manager options, then select **Save**.

- **Time limit:** turn on **Set a time limit** and choose a duration. Rooms close automatically at the end and participants return to the main meeting. A timed room also closes early if all participants leave the meeting.
- **Managers:** turn on **Assign presenters to manage rooms** and choose presenters. Managers can add and delete rooms, set limits, assign people, send announcements, open and close rooms and join any room. Microsoft Support says only one manager can control the rooms at a time.

## Open, close, rename and delete

Select **Rooms**, then **Open rooms** or **Close rooms** to affect all rooms. For one room, hover over it and use **More options**, then **Open** or **Close**. Reopening rooms returns participants to their assigned rooms. A room must be closed before it can be deleted, and anyone inside it moves to the main meeting when it closes.

To broadcast a message, select **Rooms**, then **Make an announcement**, type it and select **Send**. It appears in each room's chat marked IMPORTANT.

## Joining a room as a participant

If the organizer assigned you a room, you join automatically when it opens. Otherwise select **Rooms**, hover over a room, choose **More options**, then **Join**. Your camera and microphone are off when you enter a room until you turn them on. After you switch rooms you can still view the earlier room's chat history if settings allow, but cannot send or receive new messages there. Room chats end when the room closes.

## Attendance report

Only organizers can see attendance reports. Go to **Chat**, **Meeting chats**, the meeting, then **Attendance**. Under **Participants**, select a person to see their room, join time and leave time. The report can be downloaded as CSV and does not include data from deleted rooms.

## Troubleshooting

Microsoft's troubleshooting guide lists these causes and fixes:

- **Rooms icon missing:** see the prerequisites above, including organizer role, supported client and admin policy.
- **People not moved:** free accounts, unsupported devices such as CVI, people not currently in the meeting or older Teams versions. Reassign them, or hover over the name, select **More options** and choose **Ask to join**.
- **Some rooms did not open:** empty rooms do not open, and timed rooms do not open if no one joins.
- **Error closing all rooms:** right-click the failing room and select **Close room**.
- **Rooms still open after End meeting:** select **Close rooms**.
- **Phone participants:** dial-in users join the main room and must be reassigned if they drop and rejoin. Both the organizer and manager should have an audio conferencing license.
- **Rooms disappeared:** rooms expire if not opened within 60 days, and expired rooms cannot be recovered.
- **Disabled above 1,000 participants:** the feature stays disabled once the count exceeds 1,000.

## Other limits

The pages read for this article do not describe how recording works with breakout rooms. They also do not state a maximum number of breakout room managers.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams meeting apps](https://www.m365.fm/entity/teams-meeting-apps/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Support: Manage breakout rooms in Microsoft Teams](https://support.microsoft.com/en-us/office/use-breakout-rooms-in-teams-meetings-7de1f48a-da07-466c-a5ab-4ebace28e461)
- [Microsoft Support: Join a breakout room in Microsoft Teams](https://support.microsoft.com/en-us/teams/meetings/join-a-breakout-room-in-microsoft-teams)
- [Microsoft Support: Breakout rooms troubleshooting guide in Microsoft Teams](https://support.microsoft.com/teams/meetings/breakout-rooms-troubleshooting-guide-in-microsoft-teams)
- [Microsoft Learn: Limits and specifications for Microsoft Teams](https://learn.microsoft.com/microsoftteams/limits-specifications-teams)
