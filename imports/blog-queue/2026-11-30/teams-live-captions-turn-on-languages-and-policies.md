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
  - "Translated captions need a Teams Premium license for the meeting or event organizer."
  - "Transcription is a separate setting. It is saved with the recording and needs the Transcription policy to be on."
  - "Microsoft's admin reference does not document spoken language settings for live captions, so check the end-user article and test in your tenant."
faq:
  - q: "How do I turn on live captions in a Teams meeting?"
    a: "The Microsoft Learn admin reference describes a Turn on live captions option that users with the right policy can use during a meeting. If the option is missing, the Live captions meeting policy may be set to Off."
  - q: "Are Teams live captions saved?"
    a: "No. Microsoft Learn says Teams does not save captions and that they are not saved alongside the video file. Transcription is the feature that creates a saved record."
  - q: "Do translated captions need a special license?"
    a: "Yes. Microsoft Learn says the meeting or event organizer must have a Teams Premium license for attendees to use live translated captions."
  - q: "Why is the live captions option missing for my users?"
    a: "According to Microsoft Learn, users whose meeting policy sets Live captions to Off cannot use captions. Admins change this under Meetings, then Meeting policies in the Teams admin center."
  - q: "What are CART captions?"
    a: "Microsoft Learn calls human-generated captions CART captions. Organizers create them, and an admin policy parameter, AllowCartCaptionsScheduling, controls whether users can add a CART captioner link."
---

Live captions in Teams are real-time subtitles with speaker attribution during a meeting or event. Users whose meeting policy allows it can turn them on in the meeting. Teams does not save the captions, so they are not the same thing as a transcript. Translated captions need a Teams Premium license for the organizer.

**A note on sources.** Microsoft's end-user support article for captions could not be opened for this page. The details below come from Microsoft Learn admin documentation. Where that documentation is silent, this article says so.

## What live captions are

Microsoft Learn says Teams can detect what was said in a meeting or event and present real-time captions with speaker attribution. Captions apply to both meetings and events. Two facts shape how you use them:

- They are a **per-user policy** that applies during a meeting.
- They are **not saved**. Learn says Teams does not save captions and that they are not stored alongside the video file.

## How users turn them on

The admin reference points to a **Turn on live captions** option in the meeting's more actions menu (the ellipsis). That option is available to users whose meeting policy allows it. The reference does not list end-user steps and links to the Microsoft Support article for those, which could not be read for this page.

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

Learn does not document spoken language settings for live captions on the admin pages read. The only language list there sits under live transcription, with 57 locale entries, and the page presents it for transcription, not captions. For caption spoken-language behavior, use the end-user article and test in a meeting.

**Translated captions** are documented as follows:

- Captions can be translated into the language users are most comfortable with. By default captions appear in the language spoken.
- The organizer of the meeting or event must have a **Teams Premium** license for attendees to use live translated captions.
- For events optimized for large audiences, such as town halls, organizers can preselect up to six languages for attendees. With Teams Premium the limit increases to 10 languages.
- The setting that enables them is the same **Live captions** policy: **Not enabled, but users can enable**.

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
3. For translated captions, confirm that the organizer has Teams Premium.
4. For captions in a recording, check that **Transcription** is on for the person who started the recording.
5. For events, check **Transcription for attendees**.

## Common mistakes

- **Expecting captions to be saved.** Use transcription for a record.
- **Licensing the attendee instead of the organizer.** Translated captions depend on the organizer's Teams Premium license.
- **Changing the policy for one user but not assigning it.** Assignment is a separate step.
- **Assuming defaults.** The documented default wording differs between pages.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams meeting transcription](https://www.m365.fm/entity/teams-meeting-transcription/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Manage transcription and captions for Teams meetings](https://learn.microsoft.com/en-us/microsoftteams/meeting-transcription-captions)
- [Microsoft Learn: Teams meeting policy settings](https://learn.microsoft.com/en-us/microsoftteams/meeting-policies-in-teams-general)
