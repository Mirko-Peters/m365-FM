---
title: "Teams Noise Suppression: What It Does and How to Turn It On or Off"
summary: "What Teams noise suppression does, where to switch it on or off before and during a meeting, what Auto, High and Low mean, when to turn it off, and the separate admin controls for dial-in callers and voice isolation."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [teams, teams-admin-center, teams-rooms]
keypoints:
  - "Noise suppression reduces background sounds such as shuffling papers, slamming doors or barking dogs. Microsoft says it is on by default and your setting carries over to the next meeting."
  - "On desktop, set it under Settings and more, Settings, Devices before a meeting, or under More actions, Settings, Audio settings during one."
  - "Microsoft describes Auto as best for most situations, High as suppressing all background sound that is not speech, and Low as suppressing persistent noise such as a fan."
  - "Turn it off, or choose Low, when you want to share music or use a high-fidelity microphone in a quiet room."
  - "Admins have a separate policy for dial-in participants and a separate voice isolation feature that needs a voice profile. The pages read describe no tenant-wide switch for the desktop toggle."
faq:
  - q: "Is Teams noise suppression on by default?"
    a: "Yes. Microsoft Support says noise suppression is turned on by default and that your setting carries over to your next meeting or call. On iOS the default level is Auto."
  - q: "Where do I turn noise suppression off in a Teams meeting?"
    a: "Microsoft Support gives two desktop paths. Before a meeting, go to Settings and more, then Settings, then Devices, and use the Noise suppression toggle. During a meeting, select More actions, then Settings, then Audio settings, and use the same toggle."
  - q: "What is the difference between Auto, High and Low?"
    a: "Microsoft Support says Auto lets Teams optimize for most situations, High suppresses all background sound that is not speech, and Low suppresses low levels of persistent noise, such as a computer fan or air conditioner. Those descriptions are given for the iOS app, where you choose them under Settings, Calling, Noise suppression."
  - q: "Can I play music in a Teams meeting with noise suppression on?"
    a: "Microsoft Support recommends the Low level for playing music for participants, for example while waiting for a meeting to start. For better music quality it points to a separate article on sharing sound from your computer."
  - q: "Can an admin control noise suppression?"
    a: "Partly. The Set-CsTeamsMeetingPolicy reference lists NoiseSuppressionForDialInParticipants with the values MicrosoftDefault, Enabled and Disabled for PSTN callers. Voice isolation has its own VoiceIsolation setting. The pages read here do not describe an admin switch for the standard desktop noise suppression toggle."
---

Teams noise suppression filters out background sound picked up by your microphone, so other people hear your voice instead of a fan or a barking dog. It is on by default. You can change it in the Teams device settings, or from the audio settings inside a meeting.

## What it does

Microsoft Support describes noise suppression as reducing background noise such as shuffling papers, slamming doors or barking dogs, so participants can stay focused. The setting you choose carries over to the next meeting or call.

It is supported on the Teams desktop app, the mobile apps (iOS and Android), Microsoft Teams Rooms on Windows and Windows Azure Virtual Desktop.

## Turn it on or off

**On desktop, before a meeting**

1. Select **Settings and more** next to your profile picture.
2. Select **Settings** and then **Devices**.
3. Turn the **Noise suppression** toggle on or off.

**On desktop, during a meeting**

1. In the meeting controls, select **More actions**.
2. Select **Settings**, then **Audio settings**.
3. Turn the **Noise suppression** toggle on or off.

**On iOS**

1. Tap your profile picture.
2. Select **Settings** and then **Calling**.
3. Select **Noise suppression** and choose a level.

The Microsoft page describes the iOS choices as Auto, High and Low. It lists Auto as the iOS default, and it does not list Off as an iOS option. It says nothing about Mac-specific behavior, so test on your own device if you use a Mac.

## Which level to pick

| Level | What Microsoft says it does |
|---|---|
| Auto | Teams optimizes for some level of suppression. Best for most situations. |
| High | Suppresses all background sound that is not speech |
| Low | Suppresses low levels of persistent background noise, such as a computer fan or air conditioner |
| Off | Advised for high-fidelity microphones in a low-noise environment, such as a quiet studio |

Use Low when you play music for participants. Microsoft gives the example of music while people wait for a meeting to start.

## When to turn it off

- You use a high-fidelity microphone in a quiet room, for example a studio.
- You want to share music or other sound where quality matters. Use Low for casual playback, and see Microsoft's separate article on sharing sound from your computer for better quality.

If your voice sounds clipped or quiet to others, trying Auto or Low before switching it off is a reasonable first step. That is a troubleshooting suggestion, not a Microsoft statement.

## Admin controls

The standard noise suppression toggle is a user setting. Admins do have two related controls.

**Dial-in participants.** The `Set-CsTeamsMeetingPolicy` cmdlet has the parameter `NoiseSuppressionForDialInParticipants`. Microsoft describes it as controlling the noise suppression feature for PSTN legs joining a meeting. The possible values are `MicrosoftDefault`, `Enabled` and `Disabled`. The Audio & video section of the meeting policy in the Teams admin center (**Meetings** > **Meeting policies**) lists other audio settings, but the page read for this article did not include a noise suppression option there.

**Voice isolation.** This is a separate feature. Microsoft describes it as reducing noise and using a personalized AI model to separate the user's voice from other sounds and voices in calls and meetings. It relies on a voice profile stored on the user's device. Admin controls:

| Parameter | Cmdlet | Purpose |
|---|---|---|
| `VoiceIsolation` | `Set-CsTeamsMeetingPolicy` | Allows or blocks voice isolation |
| `EnrollVoice` | `Set-CsTeamsAIPolicy` | Allows voice profile capture and enrollment through the **Recognition** tab |
| `PassiveVoiceEnrollment` | `Set-CsTeamsAIPolicy` | Allows enrollment through Express enrollment or the Recognition tab |

Example from Microsoft Learn: `Set-CsTeamsMeetingPolicy -Identity <policy name> -VoiceIsolation Disabled`. Microsoft's voice isolation page lists the default for all three settings as Enabled, so check your current value.

## More about voice isolation

Voice isolation applies to meetings, events and calls. Microsoft says a user's voice profile is used only for the purpose the user consented to, and that Microsoft does not use voice profiles for anything else. To use the feature, users must have a voice profile. They can create one through the **Recognition** tab in their Teams settings. The Learn page does not say how users switch voice isolation on or off during a call, so point users to Microsoft Support for that.

## What the Microsoft pages do not say

The pages read for this article leave several questions open, so test them yourself rather than relying on a rumor:

- Device or CPU requirements for noise suppression
- Behavior on Mac and in the new Teams client
- How noise suppression interacts with echo cancellation
- Any tenant-wide switch for the standard desktop toggle

A Microsoft Tech Community reply dated January 27, 2021 said there was no global policy for all users and that Microsoft was experimenting with enabling ML-based noise suppression by default for people with capable devices. That post is old, so treat it as history, not as current guidance.

## Common mistakes

- Leaving noise suppression on while playing music, then wondering why the music cuts out.
- Switching it off in a noisy room because the voice sounds slightly processed.
- Expecting the admin policy for dial-in participants to change the desktop toggle for everyone.
- Confusing voice isolation with noise suppression. Voice isolation needs a voice profile.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams Rooms](https://www.m365.fm/entity/teams-rooms/)

## Sources

- [Reduce background noise in Microsoft Teams meetings (Microsoft Support)](https://support.microsoft.com/en-us/office/reduce-background-noise-in-microsoft-teams-meetings-1a9c6819-137d-4b3b-a1c8-4ab20b234c0d)
- [Manage voice isolation for Teams calls and meetings](https://learn.microsoft.com/en-us/microsoftteams/voice-isolation)
- [Set-CsTeamsMeetingPolicy](https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy)
- [Teams meeting policies: audio and video](https://learn.microsoft.com/en-us/microsoftteams/meeting-policies-audio-and-video)
- [Teams policies reference](https://learn.microsoft.com/en-us/microsoftteams/settings-policies-reference)
- [Microsoft Tech Community: AI-based noise suppression in Teams meetings](https://techcommunity.microsoft.com/t5/microsoft-teams-blog/reduce-background-noise-in-microsoft-teams-meetings-with-ai/bc-p/2102701/highlight/true)
