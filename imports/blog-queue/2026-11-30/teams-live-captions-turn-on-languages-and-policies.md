---
title: "Teams Live Captions: Turn On, Languages and Who Can Use Them"
summary: "How live captions work in Teams meetings, which admin policy controls them, what translated captions need, how captions differ from transcription and what the available Microsoft pages leave open."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [teams, teams-meeting-transcription, teams-premium, teams-admin-center]
keypoints:
  - "Live captions show real-time subtitles with speaker attribution during a meeting. Teams does not save them with the recording."
  - "The Live captions meeting policy has two options: Not enabled, but users can enable, and Off. Users on the first option can turn captions on in a meeting."
  - "Translated captions need Teams Premium (admin docs) or a Teams Premium or Copilot add-on license (end-user article)."
  - "Transcription is a separate setting. It is saved with the recording and needs the Transcription policy to be on."
  - "Spoken language is set under Meeting spoken language in caption settings. The admin reference does not cover it."
faq:
  - q: "How do I turn on live captions in a Teams meeting?"
    a: "The Microsoft Learn admin reference describes a Turn on live captions option that users with the right policy can use during a meeting. If the option is missing, the Live captions meeting policy may be set to Off."
  - q: "Are Teams live captions saved?"
    a: "No. Microsoft Learn says Teams does not save captions and that they are not saved alongside the video file. Transcription is the feature that creates a saved record."
  - q: "Do translated captions need a special license?"
    a: "Yes. The Microsoft Learn admin reference says the meeting or event organizer must have a Teams Premium license for attendees to use live translated captions. The end-user support article says a Teams Premium or Microsoft Copilot add-on license is required, that an organizer's license lets all participants use translated captions, and that if only individual participants are licensed, only they see the Translate to option."
  - q: "Why is the live captions option missing for my users?"
    a: "According to Microsoft Learn, users whose meeting policy sets Live captions to Off cannot use captions. Admins change this under Meetings, then Meeting policies in the Teams admin center."
  - q: "What are CART captions?"
    a: "Microsoft Learn calls human-generated captions CART captions. Organizers create them, and an admin policy parameter, AllowCartCaptionsScheduling, controls whether users can add a CART captioner link."
---

Live captions in Teams are real-time subtitles with speaker attribution during a meeting or event. Users whose meeting policy allows it can turn them on in the meeting. Teams does not save the captions, so they are not the same thing as a transcript. Translated captions need a Teams Premium license (the Learn admin page names the organizer's license; the end-user article also names a Microsoft Copilot add-on).

**A note on sources.** The admin details come from Microsoft Learn. The end-user steps, spoken language and translation details come from the Microsoft Support article "Use live captions in Microsoft Teams meetings". Where both are silent, this article says so.

## What live captions are

Microsoft Learn says Teams can detect what was said in a meeting or event and present real-time captions with speaker attribution. Captions apply to both meetings and events. Two facts shape how you use them:

- They are a **per-user policy** that applies during a meeting.
- They are **not saved**. Learn says Teams does not save captions and that they are not stored alongside the video file.

## How users turn them on

The admin reference points to a **Turn on live captions** option in the meeting's more actions menu (the ellipsis). That option is available to users whose meeting policy allows it. The Microsoft Support article gives the desktop steps: in the meeting controls select **More actions**, then **Captions**. To change the look, hover over the captions pane and open caption settings. Changes apply automatically.

If a user cannot find the option, check the policy before reinstalling anything.

## Admin setting: Live captions

In the Teams admin center, go to **Meetings** > **Meeting policies**, select a policy and set **Live captions**. Learn lists two values:

| Admin center option | PowerShell value | Behavior |
|---|---|---|
| Not enabled, but users can enable | `DisabledUserOverride` | Captions are off by default, but users can turn them on during meetings or events |
| Off | `Disabled` | Users cannot use live captions |

The PowerShell parameter is `-LiveCaptionsEnabledType` on `Set-CsTeamsMeetingPolicy`. After you save the policy, assign it to users or groups. Users without an assignment get the global policy.

Two Learn pages describe the default slightly differently. The captions admin reference calls the default "Not enabled, but users can enable". The general meeting policies page describes it as "Off, but organizers and co-organizers can turn them on". Check the value in your own admin center before relying on either wording.

## Languages

The Learn admin pages do not document spoken language settings for live captions. The only language list there sits under live transcription, with 57 locale entries. The Microsoft Support article lists about 57 caption languages and about 31 translation languages, and describes the spoken-language behavior:

- Set the meeting's spoken language to match what people speak, for more accurate captions.
- If Teams detects a mismatch, the organizer, co-organizer or transcript initiator is prompted to update it. Those roles can change it any time under **Meeting spoken language** in caption settings.
- Others can reach this setting only when transcription is off. If transcription is running, turn it off first and then back on.

**Translated captions** are documented as follows:

- Captions can be translated into the language users are most comfortable with. By default captions appear in the language spoken.
- The organizer of the meeting or event must have a **Teams Premium** license for attendees to use live translated captions.
- For events optimized for large audiences, such as town halls, organizers can preselect up to six languages for attendees. With Teams Premium the limit increases to 10 languages.
- The setting that enables them is the same **Live captions** policy: **Not enabled, but users can enable**.
- The Support article adds that translated captions need a Teams Premium or Microsoft Copilot add-on license. If the organizer has one, all participants can use translated captions. If only some participants have one, only they see the **Translate to** option.
- In regular meetings, the Support article says to turn on RTT, turn on the Live Captions toggle and choose a language under **Translate to**. In town halls and live events, organizers preselect the languages and attendees see one of them.

## Captions vs transcription

| | Live captions | Transcription |
|---|---|---|
| Purpose | Real-time subtitles with speaker attribution | Written record, viewable after the meeting with timestamps |
| Saved | No | Yes, stored with the meeting recording in OneDrive and SharePoint |
| Policy | Per user, Live captions | Per organizer and per user, Transcription |
| PowerShell | `-LiveCaptionsEnabledType` | `-AllowTranscription` |

Learn adds that if recording is on but transcription is off, the recording has no transcript file, and captions cannot be turned on during playback in Stream. The meeting policies page describes Transcription as controlling whether captions and transcription features are available during recording playback, with a default of On.

## Related controls

- **CART captions:** human-generated captions created by organizers. The `AllowCartCaptionsScheduling` parameter, default `DisabledUserOverride`, controls whether a user can add a URL for a CART captioner.
- **Live events:** the **Transcription for attendees** setting under Meetings > Live events policies, default Off, lets attendees of Teams-produced events see captions and subtitles.
- **Copying captions:** organizers can prevent participants from copying or forwarding meeting chat messages, live captions, transcripts and AI-generated recap insights. Learn says this per-organizer setting is on by default.

## What the pages do not say

The pages read do not state who in a meeting sees the captions once one person turns them on, and they do not describe a formal privacy statement for captions. Because captions are described as a per-user policy, test with two accounts before you tell users what others will see.

## Troubleshooting order

1. Check whether the user's meeting policy has **Live captions** set to **Off**.
2. Confirm which policy is assigned: a custom policy, a group assignment or the global policy.
3. For translated captions, confirm that the organizer has Teams Premium or the Copilot add-on.
4. For captions in a recording, check that **Transcription** is on for the person who started the recording.
5. For events, check **Transcription for attendees**.

## Common mistakes

- **Expecting captions to be saved.** Use transcription for a record.
- **Checking only the attendee's license.** An organizer's Teams Premium license covers all attendees. Without it, only participants who hold a license themselves see the Translate to option.
- **Changing the policy for one user but not assigning it.** Assignment is a separate step.
- **Assuming defaults.** The documented default wording differs between pages.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams meeting transcription](https://www.m365.fm/entity/teams-meeting-transcription/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Manage transcription and captions for Teams meetings](https://learn.microsoft.com/en-us/microsoftteams/meeting-transcription-captions)
- [Microsoft Learn: Teams settings and policies reference](https://learn.microsoft.com/en-us/microsoftteams/settings-policies-reference)
- [Microsoft Support: Use live captions in Microsoft Teams meetings](https://support.microsoft.com/en-us/office/use-live-captions-in-microsoft-teams-meetings-4be2d304-f675-4b57-8347-cbd000a21260)
