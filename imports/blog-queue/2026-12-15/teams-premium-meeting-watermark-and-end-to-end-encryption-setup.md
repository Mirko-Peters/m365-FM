---
title: "Teams Premium Meeting Watermark and End-to-End Encryption: Policy Setup"
summary: "How to turn on watermarks and end-to-end encryption for Teams meetings, which policy, label or template controls each, the features E2EE disables, and the licensing and client limits Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [teams-premium, teams, teams-admin-center, sensitivity-labels]
keypoints:
  - "Both features need Teams Premium for the meeting organizer. Attendees do not need a license for E2EE."
  - "Watermarks are set in Meetings > Meeting policies > Content Protection. E2EE is set under Enhanced encryption policies."
  - "A sensitivity label can enforce watermarks and E2EE even when the organizer's policy is off, but templates cannot enforce them."
  - "E2EE disables recording, live captions, breakout rooms, PowerPoint Live, PSTN dial-in and Copilot in meetings, and allows at most 200 participants."
  - "Web, VDI and CVI participants are blocked from E2EE meetings. Watermarked meetings give some clients an audio-only experience."
faq:
  - q: "Do attendees need Teams Premium for these features?"
    a: "Microsoft Learn says organizers who schedule E2EE meetings need a Teams Premium license and attendees do not. For watermarks, organizers with a Teams Premium license can turn them on once the admin policy allows it."
  - q: "Where do I enable watermarks in the Teams admin center?"
    a: "Go to Meetings > Meeting policies, select a policy, and use the Content Protection section: Watermark videos and Watermark shared content. Select Edit settings to adjust the pattern or transparency, then Save. PowerShell uses Set-CsTeamsMeetingPolicy with AllowWatermarkForCameraVideo and AllowWatermarkForScreenSharing."
  - q: "How do I enable end-to-end encryption for meetings?"
    a: "In the Teams admin center open Enhanced encryption policies, edit or add a policy and set End-to-end meeting encryption, then assign it. Learn says the Global policy has meeting E2EE enabled by default, so organizers with Teams Premium can schedule E2EE meetings unless you assigned a different policy."
  - q: "Which wins when policy, label and template disagree?"
    a: "Learn gives this order. Admin policies decide whether a feature is available, sensitivity labels override templates and organizer settings for what they control, templates apply only to settings a label does not control, and organizers change what is not enforced. Labels can enforce E2EE and watermarks even if the policy is off for the organizer."
  - q: "Are watermarks in recordings?"
    a: "According to Learn, playback in Microsoft Stream applies the watermark per viewer with their own email address. Downloaded .mp4 files do not contain a watermark, and download is turned off by default for watermarked recordings."
---

Turn the two features on in different places. Watermarks live in the meeting policy under Content Protection. End-to-end encryption lives in its own Enhanced encryption policy. If you want to enforce them per meeting type, use a sensitivity label for meetings. Both need Teams Premium for the organizer.

## What each feature does

**Watermark.** Each participant sees their own email address overlaid on shared content, on participants' video, or both. The purpose, per Microsoft Learn, is to deter unauthorized screenshots. The page notes that it adds little when everyone already has direct access to the content.

**End-to-end encryption (E2EE).** Meeting audio and video are protected end to end, which removes server-side features that need access to the stream. The trade-off list below is the part admins most often miss.

## Set up watermarks

1. In the Teams admin center, go to **Meetings** > **Meeting policies**.
2. Select a policy or create one.
3. In **Content Protection**, set **Watermark videos** and **Watermark shared content**.
4. To change the pattern or transparency, select **Edit settings** and **Apply**.
5. Select **Save**.

PowerShell:

```powershell
Set-CsTeamsMeetingPolicy -Identity Global -AllowWatermarkForCameraVideo $True
Set-CsTeamsMeetingPolicy -Identity Global -AllowWatermarkForScreenSharing $True
```

Learn states the default for watermarked video as On and gives no default for shared content. Check your tenant. Organizers with Teams Premium can add watermarks once the policy allows it. Watermarks apply in meetings and in events of up to 1,000 attendees.

Side effects when a watermark is in use: large gallery and content from camera are turned off. PowerPoint Live, Excel Live and live share are supported. Participants on VDI, anonymous participants, overflow participants, older clients and Direct Guest Join on Teams Rooms get an audio-only experience.

## Set up end-to-end encryption

1. In the Teams admin center, open **Enhanced encryption policies**.
2. Select the Global policy or choose **Add** and name a new one.
3. Set **End-to-end meeting encryption** to **Not enabled, but users can enable** or **Not enabled**.
4. Select **Save** and assign the policy to users or groups.

Learn describes the Global policy defaults: meetings enabled, one-to-one calls disabled. Each user can hold only one encryption policy. PowerShell cmdlets are `New-`, `Set-`, `Get-`, `Grant-` and `Remove-CsTeamsEnhancedEncryptionPolicy`. The page shows the call-encryption parameter but not the meeting one, so use the admin center for meetings.

### What E2EE turns off

For meetings, Learn lists: live captions and transcription, recording (including compliance recording), Real-Time Text, breakout rooms, Excel Live, PowerPoint Live, request control, companion mode and large gallery, PSTN dial-in, and Microsoft 365 Copilot in meetings. Apps cannot access media streams.

Other limits:

- Maximum 200 participants
- Needs current Teams desktop for Windows and Mac, iOS and Android, and Teams Rooms on Windows and Android
- Web, VDI and CVI participants are blocked

Plan communication for users. Microsoft recommends education, because people may not realize these features disappear.

## Enforce with a label and templates

For consistent protection, use the guidance for highly sensitive meetings.

1. In the Microsoft Purview portal, create a label under **Solutions** > **Information protection** > **Labels**. Keep **Meetings** in scope and select **Protect Teams meetings and chats**.
2. Set **Apply end-to-end encryption**, **Apply watermark to shared content**, **Apply watermark to everyone's video feed** and lobby and presenter controls as needed.
3. Publish the label in a label policy.
4. In the Teams admin center, go to **Meetings** > **Meeting templates** > **Add**, apply the label and lock it, then set options such as automatic recording off and meeting chat.

Learn's precedence rules are the key to avoiding surprises:

1. Admin policies decide availability. If E2EE is Not enabled for the organizer, a template that enables it has no effect.
2. Sensitivity labels override templates and organizers for settings they control.
3. Templates apply to the rest.
4. Organizers change what remains.

Labels can enforce E2EE and watermarks even when the organizer's policy has them off. Templates cannot enforce E2EE, watermarks or automatic recording. The same page warns that watermarks and encryption still need admin policy support to be used, so confirm the policies as well.

Combining both: the pages I read do not describe a conflict or special interaction between watermarks and E2EE. The E2EE page does not mention watermarks, and the watermark page does not mention E2EE. Test your exact combination with a pilot meeting before you rely on it.

## Quick checklist

- Organizers hold Teams Premium
- Meeting policy: watermark settings as intended
- Encryption policy: End-to-end meeting encryption allowed for the right users
- Label and template published and tested
- Users told about the disabled features and client requirements
- Recording expectations set: downloaded .mp4 files carry no watermark

## Settings that only the policy controls

Some options cannot be set in templates or labels. The lobby setting **Who can admit from lobby** lives in **Meetings** > **Meeting policies** > **Meeting join & lobby**, with the options Organizers and presenters (default) or Organizers and co-organizers. Organizers can change their own default through Meeting options.

Other points from the highly sensitive protection guidance:

- Meeting options in sensitivity labels and custom templates require Teams Premium, and sensitivity labeling of Teams meetings has its own Purview licensing to review.
- If a label that prevents copying chat content is the default channel label in a container label, every channel in the team restricts copying from chat.
- The guidance suggests two templates, one for interactive meetings and one for presentations, both using the same label.

## Related

- [Teams Premium](https://www.m365.fm/entity/teams-premium/)
- [Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)

## Sources

- [Require a watermark for sensitive Teams meetings](https://learn.microsoft.com/MicrosoftTeams/watermark-meeting-content-video)
- [Require end-to-end encryption for sensitive Teams meetings](https://learn.microsoft.com/en-us/MicrosoftTeams/end-to-end-encrypted-meetings)
- [Meeting templates, sensitivity labels and admin policies](https://learn.microsoft.com/en-us/microsoftteams/meeting-templates-sensitivity-labels-policies)
- [Configure Teams meetings with protection for highly sensitive data](https://learn.microsoft.com/en-us/microsoftteams/configure-meetings-highly-sensitive-protection)
