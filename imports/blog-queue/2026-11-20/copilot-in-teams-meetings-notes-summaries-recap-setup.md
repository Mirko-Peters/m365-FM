---
title: "Copilot in Teams Meetings: Notes, Summaries and Recap Setup"
summary: "How to set up and use Microsoft 365 Copilot in Teams meetings: organizer options, admin policy values, how transcription changes what Copilot can do, intelligent recap without saved transcripts, prompt tips and limits."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [copilot, teams, teams-meeting-transcription]
keypoints:
  - "Organizers choose Allow Copilot and Facilitator under Online meeting options > Copilot and other AI, with During and after the meeting, Only during the meeting or Off."
  - "Admins set the Copilot value in the meeting policy under Meetings > Meeting policies > Recording & transcription. The default is On with saved transcript required."
  - "During and after the meeting needs a transcript. Only during the meeting uses temporary speech-to-text data that is not kept after the meeting ends."
  - "Intelligent recap without saved transcripts works for scheduled meetings only and saves a read-only Word summary in the organizer's OneDrive."
  - "Copilot is not available in end-to-end encrypted meetings, in GCC High or in meetings hosted outside your organization."
faq:
  - q: "How do I start Copilot in a Teams meeting?"
    a: "According to Microsoft Support, select Copilot in the meeting controls to open a private chat with Copilot. Transcription is not required to turn Copilot on, but to prompt it about the meeting or see its history after the meeting ends, live transcription must be on during the meeting."
  - q: "What are the Copilot options an organizer can choose?"
    a: "Microsoft Support lists three values for Allow Copilot and Facilitator. During and after the meeting requires transcription, and stopping transcription also stops Copilot. Only during the meeting starts when Copilot is selected and uses speech-to-text data that is unavailable after the meeting. Off disables Copilot and also disables recording and transcription."
  - q: "What is the default admin policy for Copilot in meetings?"
    a: "Microsoft Learn lists four values for the Copilot meeting policy: On, On with saved transcript required, On with transcript saved by default and Off. The default is On with saved transcript required, which enforces During and after the meeting and does not let organizers change it."
  - q: "Can I get a meeting recap without saving a transcript?"
    a: "Yes, for scheduled meetings. Microsoft Learn says intelligent recap without saving transcripts is available to licensed users with a Copilot-enabled meeting policy. It saves a read-only Word document in the organizer's OneDrive Meetings folder and no transcript or recording is saved. Guests and external attendees cannot access it."
  - q: "What license is needed for Copilot in Teams meetings?"
    a: "Microsoft Learn says an add-on Microsoft Copilot license is needed for each intended user. Microsoft Support says intelligent recap requires either the Teams Premium add-on or a Microsoft Copilot license."
---

Copilot in Teams meetings is controlled at two levels. The organizer chooses how it behaves for each meeting, and an admin sets the default in a meeting policy. The key rule is that Copilot can work with a saved transcript, with temporary speech-to-text data that is discarded afterward, or not at all. What you can ask after the meeting depends on that choice.

## Start Copilot in a meeting

Select **Copilot** in the meeting controls to open your private chat with it. Microsoft Support says transcription is not required to turn Copilot on. To prompt Copilot about the meeting, or to see its conversation history after the meeting ends, turn on live transcription during the meeting. Copilot does not work in meetings hosted outside your organization.

During the meeting, Copilot summarizes key points, including who said what, suggests action items and answers questions. If you join more than five minutes late and Copilot is active, select **Open Copilot** in the notification for a catch-up summary.

### Prompt tips

Select **View prompts** in the Copilot pane for suggestions, or type your own in the compose box. Microsoft's sample prompts include "Where do we disagree on this topic?" and "Create a table with the ideas discussed and their pros and cons." The Copilot Prompt Gallery offers more. Microsoft's page does not give a longer list of tips, so the guidance here is limited to those samples and to a few working rules:

- Ask about what was said, since spoken content requires a transcript.
- Use the export options for long answers. **Open in Word** is offered for responses over 1,300 characters and **Open in Excel** for tables.
- Prompts and responses are visible only to the person who asks.

## Organizer setting

In the meeting scheduler:

1. Select **Settings**.
2. Select **Online meeting options** > **Copilot and other AI**.
3. Choose a value for **Allow Copilot and Facilitator**.

| Value | What happens |
|---|---|
| **During and after the meeting** | Transcription is required. Copilot starts when someone begins transcribing, and stopping transcription stops Copilot. |
| **Only during the meeting** | Copilot uses speech-to-text. Untranscribed data and Copilot interactions are unavailable after the meeting. Any part that is transcribed stays available. |
| **Off** | Copilot is disabled. Recording and transcription are also disabled. |

## Admin policy

Microsoft Learn describes the **Copilot** setting in the Teams meeting policy. To change it, go to **Meetings** > **Meeting policies**, select or create a policy, find **Copilot** in the **Recording & transcription** section, choose a value and select **Save**.

| Admin center value | PowerShell `-Copilot` | Default organizer option | Organizer can change |
|---|---|---|---|
| On | Enabled | Only during the meeting | Yes |
| On with saved transcript required (default) | EnabledWithTranscript | During and after the meeting | No |
| On with transcript saved by default | EnabledWithTranscriptDefaultOn | During and after the meeting | Yes |
| Off | Disabled | Off | Yes |

Copilot also depends on the transcription policy. With transcription policy off and the organizer option **During and after the meeting**, licensed users cannot use Copilot unless a participant with transcription permission turns it on. Setting Copilot to Off removes recording and transcription for the meeting too.

## Intelligent recap without saving transcripts

Microsoft Learn describes a recap mode that keeps no transcript. The conditions are:

- A Microsoft Copilot license and a meeting policy with Copilot enabled.
- Scheduled meetings only. It does not apply to events, calls or unscheduled meetings.
- Organizers in your organization with a license can generate it. Licensed attendees in your organization can view it on the **Recap** tab. Guests and external attendees cannot.
- The summary is saved as a read-only Word document in the organizer's OneDrive Meetings folder.

Admins can turn the feature off with `Set-CsTeamsMeetingPolicy -Identity <policyname> -AllowIntelligentRecap $false`, which disables intelligent recap for all meetings. The summary document expires after 120 days by default. In the admin center, set this under **Meetings** > **Meeting policies** > **AI memory and archive**, with a value from 1 to 9999 days or -1 for no expiration. During generation, transcription data sits in a service-managed cache that is purged within one day. Organizers can delete the summary from the Recap tab or from OneDrive, and the deletion applies to both. These summaries support Microsoft Purview eDiscovery and legal hold.

## After the meeting

From the meeting chat, select **Open Copilot** in the upper-right corner. Copilot uses chat messages and the transcript if one exists, and cites its sources. The **Recap** tab shows the same history if transcription was on. Asking about spoken content needs an available transcript.

## Limits and licensing

- No Copilot in end-to-end encrypted meetings or in GCC High.
- In recurring meetings, earlier Copilot history is lost when a later meeting in the series is transcribed.
- Export to Word or Excel is blocked if a sensitivity label prevents exporting meeting content, or if the option that turns off copying and forwarding of chat, captions and transcripts is on.
- Under Purview retention policies, prompts and responses might be retained even when recording and transcription are off.
- Learn says an add-on Microsoft Copilot license is needed for each user. Microsoft Support says intelligent recap needs the Teams Premium add-on or a Copilot license.

## Common mistakes

- **Expecting history after the meeting without a transcript.** The Only during the meeting option does not keep it.
- **Setting Off and wondering why recording is gone.** Off also disables recording and transcription.
- **Assuming organizers can pick any option.** The default policy enforces a saved transcript.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams meeting transcription](https://www.m365.fm/entity/teams-meeting-transcription/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)

## Sources

- [Microsoft Support: Use Copilot in Microsoft Teams meetings](https://support.microsoft.com/en-us/office/use-copilot-in-microsoft-teams-meetings-0bf9dd3c-96f7-44e2-8bb8-790bedf066b1)
- [Microsoft Learn: Manage Copilot in Teams meetings and events](https://learn.microsoft.com/microsoftteams/copilot-teams-transcription)
- [Microsoft Learn: Intelligent recap without saving transcripts](https://learn.microsoft.com/en-us/microsoftteams/intelligent-recap-without-saving-transcripts)
