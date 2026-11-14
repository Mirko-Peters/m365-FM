---
title: "How to Turn On and Use Teams Meeting Transcription"
summary: "How to start, stop, download and delete a Teams meeting transcript, who is allowed to do it, where transcripts are stored and which admin policy turns transcription on or off."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [teams, teams-meeting-transcription]
keypoints:
  - "In a meeting, select More actions, then Transcribe, confirm the spoken language and select Confirm. Starting a recording also starts transcription."
  - "Everyone in the meeting is notified when transcription starts."
  - "Organizers, co-organizers and presenters can stop and restart it. Other-tenant and anonymous users can't start it."
  - "Transcripts are stored in the organizer's OneDrive for Business. Download them from Chat, Recap, Transcript as .docx or .vtt."
  - "Admins control it in the Teams admin center under Meetings, Meeting policies, with the Transcription toggle. The organizer and the person starting it both need it on."
faq:
  - q: "How do I start transcription in a Teams meeting?"
    a: "According to Microsoft Support, select More actions in the meeting controls, select Transcribe, confirm the language spoken in the meeting and select Confirm. All participants get a notification. Recording a meeting also starts transcription automatically."
  - q: "Who can see and download the transcript?"
    a: "Microsoft Support lists the organizer as able to start, stop, view live, view after the meeting and download. People from the same organization can start, stop and view but can't download by default. Users from another tenant can only view it in real time, and anonymous users can't view it. Dial-in callers can't view it either."
  - q: "Where is the Teams transcript stored?"
    a: "Microsoft Support says transcripts are stored in the meeting organizer's OneDrive for Business and stay available through the meeting chat and the Recap tab until the organizer deletes them. Microsoft Learn adds that transcripts are stored together with meeting recordings in OneDrive and SharePoint storage."
  - q: "Why is the Transcribe option missing?"
    a: "Microsoft Learn says transcription is a per-organizer and per-user policy setting. The organizer must have it turned on, and so must the person who starts the transcript. If the organizer used Teams Premium or Copilot options to limit who can record and transcribe, only the allowed roles can start it. Users from another tenant and anonymous participants can't start it."
  - q: "Does Teams translate the transcript live?"
    a: "Only with Teams Premium. Microsoft Support says live translated transcription requires it, and that only the original transcript is stored. Translated transcripts are not stored."
---
To turn on transcription in a Teams meeting, select **More actions**, then **Transcribe**, confirm the spoken language and select **Confirm**. Recording a meeting starts transcription automatically. Whether the option appears depends on a Teams meeting policy, and the transcript ends up in the organizer's OneDrive for Business. This article covers the steps for participants, the permission rules and the admin settings behind them.

## Start transcription

Microsoft Support gives these steps for transcription on its own, without a recording:

1. In the meeting controls, select **More actions**.
2. Select **Transcribe**.
3. Confirm the language being spoken in the meeting.
4. Select **Confirm**.

All participants get a notification that the meeting is being transcribed. Participants can hide their identities in captions and transcripts. Obscenities are obscured by asterisks.

## Change the spoken language

Teams detects language mismatches and prompts the organizer, a co-organizer, the transcript initiator or the feature initiator. To change it yourself:

1. Select **More actions**.
2. Select the dropdown arrow next to **Transcribing**.
3. Select **Show transcript**.
4. In the transcript pane, select **Language settings**.
5. Under **Spoken language in this meeting**, pick the language and select **Update**.

Only those same roles can open this setting. Everyone else must turn transcription off and on again first. The change affects the transcript and captions for everyone. Microsoft Learn lists the supported transcription languages, including English variants, German, French, Spanish, Japanese and many more.

## Show, hide and stop

- **Show or hide:** More actions, the arrow next to **Transcribing**, then **Show transcript** or **Hide transcript**.
- **Stop:** More actions, then **Recording** or **Transcribing**. Either stops transcription.
- **Who may stop:** the organizer, co-organizers and presenters. They can also restart it.
- Transcription also stops when all participants leave.

## Download, share and delete

A transcript is available right after the meeting. Microsoft Support describes the path:

1. Select **Chat** in Teams.
2. Open the past meeting chat.
3. Select **Recap**, then **Transcript**.
4. Open the arrow next to **Download** and choose **.docx** or **.vtt**.

By default, organizers and co-organizers can download. Others may be able to if the IT admin grants permission. Mobile participants can't open the transcript directly, so download it and attach it to the meeting chat with **Attach**.

To delete a transcript, the organizer or a co-organizer selects **Chat**, opens the past meeting chat, selects **Recap** and then **Delete** above the transcript.

## Who can do what

| Participant | Start or stop | View live | View after | Download after |
|---|---|---|---|---|
| Organizer | Yes | Yes | Yes | Yes |
| Same organization | Yes | Yes | Yes | No (organizers can configure this in Stream) |
| Another tenant | No | Yes | No | No |
| Anonymous | No | No | No | No |

This table follows Microsoft Support. The same page says that only the organizer, co-organizers and presenters can stop and restart transcription during a meeting, so assume the presenter role is needed to stop it. Dial-in callers can't view the transcript. With Teams Premium or Copilot, organizers can set who may record and transcribe when they schedule: organizers and co-organizers, organizers, co-organizers and presenters, or no one.

## Where the transcript is stored

Transcripts are stored in the meeting organizer's OneDrive for Business and stay reachable through the meeting chat and **Recap** until the organizer deletes them. Microsoft Learn says they are stored together with meeting recordings. If recording is on but transcription is off, no transcript file is stored next to the recording.

How long a transcript is kept is an admin decision. Microsoft Learn points to the Teams recording expiration policy and states no default period on the pages I read.

## Admin settings

For admins, Microsoft Learn lists this path: **Meetings** > **Meeting policies** > select a policy > turn **Transcription** on or off. The setting is on by default for new policies. In PowerShell, the parameter is `-AllowTranscription` on `Set-CsTeamsMeetingPolicy`.

Two points are easy to miss:

- Transcription is both a per-organizer and a per-user setting. For a meeting to include a transcript, the organizer must have it on, and so must the user who starts it.
- Events have their own switches. Under **Meetings** > **Events policies**, **Transcription for webinar** and **Transcription for town hall** are separate toggles, both on by default.

Microsoft's recording and transcription overview adds that in the global policy for meetings and events, recording and transcription are on by default. The **Record and transcribe automatically** setting is off by default for meetings and on for events, if you allow auto recording. Changes to the global policy apply to everyone except users with an assigned custom meeting or calling policy. Meeting policies, events policies and voice calling policies are separate, so align them. 1:1 calls follow the calling policy.

## When Transcribe is missing

Work through this list in order:

1. Check that you are in a Teams meeting and not an anonymous or other-tenant participant. Those users can't start transcription.
2. Ask the organizer whether they limited who can record and transcribe in the meeting options.
3. Ask the admin whether the **Transcription** toggle is on for both the organizer's policy and your own.
4. For webinars and town halls, check the event policy toggles.
5. For live translation, check that the organizer has Teams Premium.

## Common mistakes

- Expecting a transcript when only the user, not the organizer, has the policy turned on.
- Looking for the transcript in the starter's OneDrive. It is in the organizer's.
- Expecting translated transcripts to be saved. Only the original is stored.
- Forgetting that dial-in and anonymous participants can't view it.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams meeting transcription](https://www.m365.fm/entity/teams-meeting-transcription/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)

## Sources

- [Microsoft Support: Start, stop, and download live transcripts in Microsoft Teams meetings](https://support.microsoft.com/teams/meetings/start-stop-and-download-live-transcripts-in-microsoft-teams-meetings)
- [Microsoft Learn: Admins - Manage transcription and captions for Teams meetings](https://learn.microsoft.com/microsoftteams/meeting-transcription-captions)
- [Microsoft Learn: Recording and transcription overview for Teams](https://learn.microsoft.com/en-us/microsoftteams/recording-transcription-overview)
