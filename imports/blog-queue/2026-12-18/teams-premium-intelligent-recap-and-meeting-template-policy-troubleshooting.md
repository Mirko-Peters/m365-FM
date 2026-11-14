---
title: "Troubleshoot Teams Premium Intelligent Recap and Custom Meeting Template Policies"
summary: "Check licenses, transcription and recording policies, meeting type and expiry settings when intelligent recap is missing, and check template policies, defaults and the 24 hour delay when custom meeting templates do not show."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [teams-premium, intelligent-recap, teams-admin-center, teams-templates]
keypoints:
  - "Intelligent recap needs a Teams Premium or Microsoft Copilot license, and transcription must be on in the matching policy."
  - "With recording turned off, users get recap without the recording, speakers, topics and chapters. Video recap needs a recording and a meeting of at least 10 minutes."
  - "Recap without saving transcripts needs a Copilot license for the organizer and can only be switched off by disabling intelligent recap for all meetings in the meeting policy."
  - "Custom meeting templates are a Teams Premium feature, you can create up to 50, and it can take up to 24 hours before users see a new one."
  - "A template becomes visible or hidden through a meeting template policy, and only a custom template can be set as the default."
faq:
  - q: "Which license does a user need to see intelligent recap?"
    a: "According to Microsoft Learn, users need a Teams Premium license or a Microsoft Copilot license. Audio recap needs a Copilot license. Recap for PSTN calls also needs a Teams Phone license and a calling plan."
  - q: "Why does the recap show no recording, speakers or chapters?"
    a: "Microsoft Learn says that if the recording policy turns recording off, users get recap without the recording, speakers, topics and chapters. Transcription alone still allows recap insights, but video highlights are not available for meetings that are transcribed but not recorded."
  - q: "How do I turn off recap without saving transcripts only?"
    a: "Microsoft Learn states there is no separate policy setting for it. Setting AllowIntelligentRecap to false in the Teams meeting policy blocks it, but that disables intelligent recap for all meetings, including those with saved transcripts."
  - q: "Why do users not see a new custom meeting template?"
    a: "Microsoft Learn says it may take up to 24 hours for users to see a new custom template. A second cause is the meeting template policy. A template listed under Hidden templates in the user's assigned policy is not shown, and the Global policy shows all templates."
  - q: "Can a predefined Teams template be the default?"
    a: "No. Microsoft Learn says only custom templates can be set as the default, the policy must be assigned to users, and organizers need a Teams Premium license."
---

When intelligent recap or a custom meeting template does not appear in Teams, check four things in order: the license, the policy that controls the feature, the meeting type, and the wait time after a change. Recap depends on transcription and recording policies. Custom templates depend on the Teams Premium license and on the meeting template policy assigned to the user. This article follows Microsoft Learn.

## Part 1: Intelligent recap does not appear

### Check the license

Learn says users need a Teams Premium license or a Microsoft Copilot license for intelligent recap. Audio recap needs a Copilot license. For PSTN calls, users also need a Teams Phone license and a calling plan. The base requirement is a Microsoft 365 subscription that includes Teams, or one without Teams plus a separate Teams license.

### Check transcription

Learn states that transcription must be on for users to use intelligent recap. The policy depends on the scenario:

- **PSTN and one to one peer-to-peer VoIP calls:** call recording, transcription and captions settings.
- **Meetings, events and group VoIP calls:** the transcription and captions settings in the meeting policy.

### Check recording

For the full experience in meetings and events, a policy must allow recording. If recording is turned off, users get recap without the recording, speakers, topics and chapters. That is expected behavior, not a fault.

### Check the meeting type and the limits

Learn lists these conditions that explain a missing item:

| Symptom | Documented reason |
|---|---|
| No recap for an event attendee | In events, recap is available only to organizers, co-organizers and presenters |
| No audio recap | Audio recap is only available for scheduled meetings, and a transcript that is too short is left out |
| No video recap | The meeting must be at least 10 minutes long and recorded. Transcribed but not recorded meetings do not support video highlights |
| Missing chapters | Chapters can fail because of transcription quality or technical issues and are then skipped in the audio recap |

Audio recaps are kept for 60 days in the user's OneDrive under Recordings > AudioRecaps. A video recap is stored as part of the meeting recording file, with up to 100 highlights per recording.

### Recap without saving transcripts

This mode applies to scheduled meetings only, not to events or calls. The organizer needs a Copilot license, and the user must have a Teams meeting policy with Copilot enabled. Attendees in the organizer's organization need a Copilot license to open the summary on the Recap tab. Guests and external attendees cannot.

Learn says there is no separate policy setting for this feature. To block it while keeping Copilot enabled, run:

```powershell
Set-CsTeamsMeetingPolicy -Identity <policyname> -AllowIntelligentRecap $false
```

This disables intelligent recap for all meetings, including those where transcripts are saved.

The summary is saved as a read-only Word document in the Meetings folder of the organizer's OneDrive. It expires after 120 days by default. You can set 1 to 9999 days, or -1 for no expiry. In the Teams admin center, go to **Meetings** > **Meeting policies**, select the policy, and set **Set a default expiration time for Intelligent recap docx** under **AI memory and archive**. In PowerShell, use `-IntelligentRecapDocxFileExpirationDays`. If a summary has vanished, check this value first. Deleting the summary from the Recap tab or from OneDrive deletes it from both places.

## Part 2: Custom meeting templates do not appear

### Check the license and the limits

Custom meeting templates are a Teams Premium feature. You can create up to 50. Each option has a default value, a visibility setting and a lock status. Hidden options are not shown to organizers, and locked options cannot be changed.

### Wait for propagation

Learn says it may take up to 24 hours for users to see a new template. Edits to a template affect new meetings and meetings already scheduled with it.

### Check the template policy

A template is created under **Meetings** > **Meeting templates**. Visibility for users is controlled in **Meetings** > **Meeting template policies**:

1. Open the policy and check the **Viewable templates** and **Hidden templates** lists.
2. To show a hidden template, select it under **Hidden templates** and select **Show**.
3. Make sure the policy is assigned to the user or group.

The Global (Org-wide default) policy lets users see all available templates, including custom ones. Any other policy assigned to the user can hide templates.

In PowerShell, `Set-CsTeamsMeetingTemplatePermissionPolicy` has the parameters `-HiddenMeetingTemplates` and `-DefaultMeetingTemplateId`. The ID must use the `customtemplate_<GUID>` format. Setting it to null applies no default.

### Check the default template

To make a template apply to new meetings automatically, open a meeting template policy, choose the custom template and select **Set as default**. A Default tag then appears. Learn lists these conditions:

- Only custom templates can be default. Predefined Teams templates cannot.
- Organizers need a Teams Premium license.
- The policy must be assigned to the users.
- It applies to new meetings scheduled in the Teams calendar or Outlook. Learn lists Outlook on Teams desktop and web, including new Outlook and classic Outlook.

Learn also lists a known issue. Users may see errors in some meeting scenarios when the Copilot setting in the meeting policy is **On with saved transcript required**. Microsoft recommends a different Copilot setting until it is fixed.

### Check for conflicts with labels and options

If a sensitivity label sets options such as watermarks, end-to-end encryption, meeting chat, automatic recording or lobby bypass, the label overrides the template. End-to-end encryption in a template also means recording and transcription do not work. The option to pick a custom template is not available in Outlook for Mac or Outlook on the web.

## What the sources do not say

The pages read do not document a recap troubleshooting flow, so the checks above come from the stated conditions. The template pages do not state how long a policy assignment takes, and the page on using templates, labels and policies together could not be retrieved.

## Related

- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Intelligent recap](https://www.m365.fm/entity/intelligent-recap/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams templates](https://www.m365.fm/entity/teams-templates/)

## Sources

- [Intelligent recap for Teams calls, meetings and events](https://learn.microsoft.com/microsoftteams/intelligent-recap-calls-meetings)
- [Intelligent recap in Teams meetings without saving transcripts](https://learn.microsoft.com/microsoftteams/intelligent-recap-without-saving-transcripts)
- [Overview of custom meeting templates in Microsoft Teams](https://learn.microsoft.com/microsoftteams/custom-meeting-templates-overview)
- [Create a custom meeting template in Microsoft Teams](https://learn.microsoft.com/microsoftteams/create-custom-meeting-template)
- [Manage meeting templates in Microsoft Teams](https://learn.microsoft.com/microsoftteams/manage-meeting-templates)
- [Set a custom meeting template as the default in Microsoft Teams](https://learn.microsoft.com/microsoftteams/custom-meeting-templates-set-default)
- [Set-CsTeamsMeetingTemplatePermissionPolicy](https://learn.microsoft.com/powershell/module/teams/set-csteamsmeetingtemplatepermissionpolicy)
