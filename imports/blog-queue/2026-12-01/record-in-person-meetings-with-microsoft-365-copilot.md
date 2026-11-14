---
title: "Record In-Person Meetings with Microsoft 365 Copilot: Facilitator Notes on Teams Mobile"
summary: "Copilot does not record a room by itself. Microsoft documents Facilitator in Teams on mobile and in Teams Rooms for in-person notes and transcripts. Steps, licensing, speaker limits and the difference between recording and transcription."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [facilitator-agent, copilot, teams-meeting-transcription, teams-rooms]
keypoints:
  - "In person, use Facilitator: on Teams mobile go to Calendar, tap Meeting, then Take notes with Facilitator."
  - "Facilitator in Teams Rooms turns on transcription but does not record the meeting, according to Microsoft Learn."
  - "A Microsoft Copilot license is needed to add Facilitator to a meeting or turn it on."
  - "Notes are stored in a Microsoft Loop page and appear in the meeting chat under Recap > Notes."
  - "Speaker separation from one device is limited. Teams Rooms attributes only the person who scans the QR code, and only if enrolled."
faq:
  - q: "Can Microsoft 365 Copilot record an in-person meeting?"
    a: "Microsoft documents Facilitator for in-person notes. The Teams Rooms article says Facilitator does not record the meeting and only turns on transcription. The Teams mobile support article describes capturing, transcribing and organizing in-person notes."
  - q: "How do I start it on my phone?"
    a: "According to Microsoft Support, open Calendar in the Teams mobile app, tap Meeting, then tap Take notes with Facilitator. On iOS, first set Control Center > Mic Mode to Standard to turn off voice isolation."
  - q: "Where are the notes saved?"
    a: "Microsoft Support says notes are stored in a Microsoft Loop page that participants can edit. After the meeting, find them in the meeting chat under Recap > Notes. For unscheduled Teams Rooms meetings, open the meeting in your calendar and go to Recap > Notes."
  - q: "Does it tell the speakers apart?"
    a: "Support says the mobile experience offers speaker distinction. The Teams Rooms article says only the person who scans the QR code is attributed, and only if enrolled, while others appear as Speaker 1, Speaker 2. A Microsoft Q&A thread notes community answers conflict, so test it in your room."
  - q: "What license do I need?"
    a: "Microsoft Support states a Microsoft Copilot license is required to add Facilitator to a meeting or turn it on. Unscheduled Teams Rooms meetings also need a Teams Rooms Pro license on each room resource account."
---

Copilot does not simply record a meeting room. For in-person meetings, Microsoft documents a specific route: the Facilitator agent, either in the Teams mobile app or in a Teams Rooms device. Facilitator transcribes the conversation, writes live notes with decisions and follow-ups, and saves them in Microsoft Loop. It is worth being precise about the word record. Microsoft's Teams Rooms article says Facilitator does not record the meeting and only turns on transcription.

## Option 1: Facilitator on Teams mobile

Microsoft Support says the Teams mobile app can capture, transcribe and organize in-person notes, with speaker distinction and recaps.

### Steps

1. Open the Teams app on your phone and go to **Calendar**.
2. Tap **Meeting**, then tap **Take notes with Facilitator**.
3. On iOS, first turn off voice isolation: **Control Center** > **Mic Mode** > **Standard**. Support says this setting persists for future meetings.
4. Confirm the meeting language if asked.
5. Place the phone where it can hear everyone in the room.
6. When you finish, end the meeting. Live notes take a few minutes to appear.

A Tech Community post on in-person note-taking describes the same flow with a plus button in Calendar, and says the notes are saved to Loop and a calendar event is created. It also says commenters report the entry point varies and that the feature depended on admin enablement at the time. Treat those details as community-reported.

### What you get

- Notes in a Loop page that participants can edit before, during and after the meeting.
- After the meeting, open it in your calendar or chat list. Notes sit in the meeting chat under **Recap** > **Notes**, and the **AI summary** tab holds a summary of the full transcript.
- Follow-up tasks, which sync to Planner when you select **Accept to sync**.

## Option 2: Facilitator in Teams Rooms

Microsoft Learn describes two modes. Scheduled meetings use Facilitator in Teams, and a Teams Rooms console can be added as a participant. Unscheduled, in-person discussions in a room with a Teams Rooms device use Facilitator as note taker. This mode is documented as public preview on Teams Rooms on Windows only.

### How an unscheduled meeting starts

1. Someone in the room signs in to Teams on a phone within the same organization.
2. When the room is free, the presence detector shows a banner for 10 minutes. Scan the QR code on the display, or press **Facilitator** on the console home screen and scan the code.
3. In Teams on the phone, invite Facilitator with the room as the attendee.
4. Transcription turns on automatically and the display shows that Facilitator is listening.
5. End with the **End** button on the room device.

Muting the room microphone prevents Facilitator or transcription from capturing content, and tapping Facilitator in the console roster removes it.

### Admin setup for Teams Rooms

In the Teams Rooms Pro Management portal: assign a **Teams Rooms Pro** license to each resource account, enable **Rooms > [room] > Settings > Meetings > Facilitator QR Code**, and enable **Room > Settings > Account > Enable public preview**.

## Option 3: A scheduled Teams meeting with Facilitator

If the meeting has a Teams link, even if everyone sits in one room, Microsoft Support describes this setup:

1. In Calendar, create a Teams meeting.
2. Select **Options** > **Copilot and other AI**.
3. Set Copilot to **Only during the meeting** or **During and after the meeting**.
4. Turn on **Facilitator**.

During the meeting, an organizer or presenter can use **More actions** > **Turn on Facilitator**. Facilitator works only with scheduled meetings, not channel meetings, instant meetings or Teams calls.

## Which option fits your situation

| Situation | Documented option |
|---|---|
| Ad hoc conversation, you and a phone | Facilitator on Teams mobile |
| Ad hoc discussion in a room with a Teams Rooms Windows device | Facilitator in Teams Rooms, admin setup needed |
| Planned meeting with a calendar invite | Scheduled Teams meeting with Facilitator turned on |
| You need a video or audio recording file | Not covered here. Facilitator transcribes and does not record in Teams Rooms |

## Before the meeting

1. Confirm you have a Copilot license and that Copilot and other AI is not locked by policy.
2. Tell attendees that transcription is on. The Tech Community post says you receive a notification that transcription and note-taking are active, and Microsoft Learn says the Teams Rooms display shows that Facilitator is listening. Check your own organization's policy on informing participants, since the pages read do not cover consent rules.
3. On iOS, set Mic Mode to Standard.
4. Pick the meeting language when Facilitator asks.
5. Decide who will own the Loop notes page afterward, since any participant can edit it.

## After the meeting

Open the meeting from your calendar and review **Recap** > **Notes**. Microsoft Support says Facilitator can also create Word documents that upload to your OneDrive several minutes after the request, and that tasks sync to Planner when you select **Accept to sync**. For a follow-up summary, the Tech Community post suggests asking Copilot for items from your Facilitator notes, such as a prioritized action list.

## Licensing and prerequisites

- Microsoft Support: a Microsoft Copilot license is required to add Facilitator to a meeting or turn it on.
- Microsoft Learn (Teams Rooms): scheduled meetings need an eligible Microsoft 365 base license, a Teams license, a Copilot license, Teams Public Preview membership and Loop components enabled. Unscheduled in-person meetings need Teams Rooms Pro on each room account.
- If "Allow Copilot and other AI" is locked by policy, you cannot turn Facilitator on and must ask your admin. A Microsoft Q&A answer describes this case.

## Limits to know

- **Speakers.** Teams Rooms attributes only the scanning person, if enrolled. A Q&A thread says standard transcription does not reliably separate local speakers from a single device, and the answers there conflict with each other, so test before relying on it.
- **Audio.** The same thread says several people joining separately from one room can cause echo or screeching.
- **Languages.** Support says you pick the meeting language when you turn Facilitator on, and does not list supported languages.
- **Preview.** Parts of Facilitator are in public preview and may change.

## Related

- [Facilitator agent (Microsoft Teams)](https://www.m365.fm/entity/facilitator-agent/)
- [Microsoft Teams meeting transcription](https://www.m365.fm/entity/teams-meeting-transcription/)
- [Microsoft Teams Rooms](https://www.m365.fm/entity/teams-rooms/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Microsoft Support: Facilitator in Microsoft Teams meetings](https://support.microsoft.com/en-US/teams/copilot/facilitator-in-microsoft-teams-meetings)
- [Microsoft Learn: Facilitator in Microsoft Teams Rooms](https://learn.microsoft.com/en-gb/microsoftTeams/rooms/facilitator-teams-rooms)
- [Microsoft Tech Community: Take notes automatically in in-person meetings with Microsoft Teams](https://techcommunity.microsoft.com/t5/healthcare-and-life-sciences/take-notes-automatically-in-in-person-meetings-with-microsoft/ba-p/4436749)
- [Microsoft Q&A: Transcribing in face-to-face meetings](https://learn.microsoft.com/en-us/answers/questions/5849526/transcribing-in-face-to-face-meetings)
