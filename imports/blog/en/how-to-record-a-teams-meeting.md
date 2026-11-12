---
title: "How to Record a Teams Meeting: Steps, Rules, Storage"
summary: "How to record a Teams meeting: start and stop it, who may record, where the file is saved, how to share it, and what to check when the Record button is missing."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [teams, teams-meeting-transcription]
keypoints:
  - "Join the meeting, select More actions, then Record, choose what to record and select Confirm. Everyone in the meeting is notified when the recording starts."
  - "Only one person can record a meeting at a time. Guests, anonymous users and people from other organizations can't start or stop a recording."
  - "Recordings of regular meetings go to the organizer's OneDrive. Recordings of channel meetings go to the SharePoint site of the team."
  - "If Record is missing or grayed out, the cause is almost always the license, the organizer's meeting policy or the Who can record and transcribe option."
  - "Admins set the expiration. New recordings expire after 120 days by default, and an expired file sits in the recycle bin before it's gone for good."
faq:
  - q: "Who can record a Teams meeting?"
    a: "A person from the organizer's own organization who has an eligible license and whose admin has turned recording on. Guests, anonymous users and people from other organizations can't start or stop a recording. With Teams Premium or Copilot, the organizer can also limit recording to organizers and co-organizers, or to presenters as well."
  - q: "Where is a Teams meeting recording saved?"
    a: "For a regular meeting, the file is saved in the Recordings folder in the meeting organizer's OneDrive. For a channel meeting, it's saved in the SharePoint site of the team. The recording is also linked in the meeting chat or channel conversation, and under Recap in your calendar."
  - q: "Does Teams tell people when a meeting is being recorded?"
    a: "Yes. When recording starts, Teams notifies everyone in the meeting on the desktop, web and mobile apps. Depending on where you are, you might need everyone's permission before you record them. Admins can also require explicit consent through a meeting policy."
---
To record a Teams meeting, join the meeting, select **More actions** in the meeting controls, select **Record**, choose what to capture and select **Confirm**. Everyone in the meeting gets a notice that recording has started. This article is for meeting organizers and anyone who has to answer the question "why can't I record?" for their colleagues. You'll find the steps to start and stop a recording, the rules about who is allowed to do it, where the file ends up, how to share it and what to check when the button is missing.

## Start a recording

The steps below are the ones Microsoft documents on its page [Start, stop, and find meeting recordings in Microsoft Teams](https://support.microsoft.com/en-us/teams/meetings/start-stop-and-find-meeting-recordings-in-microsoft-teams) for the Teams desktop app.

1. Start or join the meeting.
2. In the meeting controls, select **More actions**, then **Record**.
3. Choose your spoken language and what you want to record.
4. Select **Confirm**.

If you only need the sound, for example for a podcast-style discussion, open **More actions** > **Record** and pick **Audio only** from the **Choose what to record** list before you select **Confirm**.

Two things are worth knowing before you press the button. Recording takes a few seconds to begin, so don't click again if nothing seems to happen. And only one person can record a meeting at a time. If a colleague has already started, you'll see that the recording is running.

Microsoft's page shows a Desktop and a Mobile tab, but the text gives no separate mobile or browser steps beyond the ones above. If your menu looks different on a phone or in a browser, I couldn't confirm the exact path from Microsoft's pages, so check the meeting controls for **More actions** and **Record** first.

### What a recording doesn't capture

A recording captures audio, video and screen sharing. Microsoft lists a few things it leaves out:

- Video streams from more than four people at once
- Whiteboards and annotations
- Shared notes
- Content shared by an app
- Videos or animations embedded in PowerPoint Live presentations

If the whiteboard is the outcome of the meeting, export or save it separately. Don't rely on the recording to keep it.

## Who can record a Teams meeting

This is where most "I can't record" tickets begin. To start or stop a recording, a person needs all of the following:

- An eligible license. Microsoft names Office 365 Enterprise E1, E3, E5, F3, A1, A3 and A5, plus Microsoft 365 Business, Business Premium and Business Essentials.
- Recording turned on by an IT admin.
- Membership of the organizer's organization. Guests, anonymous users and people from other organizations can't start or stop a recording.
- A meeting organizer whose cloud recording policy is turned on. The organizer doesn't need to be in the meeting.

Both the organizer and the person who records need recording permission. That is the detail people miss: you might have the right license, but if the organizer's policy blocks recording, the button stays unavailable.

The organizer can narrow it further. With Teams Premium or a Copilot license, the organizer can open the meeting, go to **Options** and, under **Recording and transcription**, set **Who can record and transcribe** to one of three choices: organizers and co-organizers, organizers, co-organizers and presenters, or no one. The path on Microsoft's page is **Calendar** > select the event > **View event** > **Options**. Select **Apply** when you're done.

If you want more people to record without opening it up to everyone, make them co-organizers. That's simpler than changing the policy.

### Personal Teams accounts

Teams for personal use works differently. Recording there is available for Microsoft 365 Personal, Family or Premium subscribers with a Teams personal account. After the recording stops, it's saved in the meeting chat for 30 days. Watching it doesn't extend that, so download it if you want to keep it. Only the person who started the recording can delete it.

## What participants see and what the law may require

When recording starts, Teams notifies all participants in the desktop, web or mobile app. Microsoft adds that depending on your region, you may need everyone's permission before you record them. That's a legal question and not a Teams setting, so ask your compliance or legal contact if you record meetings with people in several countries or with customers.

Admins can enforce consent in Teams. The `-ExplicitRecordingConsent` parameter of `Set-CsTeamsMeetingPolicy` makes participants agree to recording and transcription in meetings created by organizers who have that policy. If your organization has a privacy page, the admin can link it in the meeting invitation settings.

One more rule that surprises people: if any participant has a compliance recording policy, the meeting is recorded under that policy, even if that participant belongs to another organization.

## Stop, forget and end a recording

To stop, open **More actions** in the meeting controls and select **Recording**. You then pick one of two options:

- **Recording** stops both the recording and the live transcription.
- **Transcribing** stops only the live transcription. The recording keeps running until you stop it with **Recording**.

If nobody stops it, Teams has a few built-in behaviors:

- The recording continues even if the person who started it leaves.
- It stops automatically when everyone has left.
- If someone forgets to leave, the recording ends and restarts automatically every four hours until the last participant leaves.

That last point matters if somebody stays on a call overnight. You may end up with several files for one meeting.

## Where the recording goes and how to find it

After you stop the recording, Teams needs a few minutes to process it. Where it ends up depends on the type of meeting:

- **Regular meetings:** the file is saved in the **Recordings** folder in the organizer's OneDrive.
- **Channel meetings:** the file is saved on the channel's **Files** tab, in the SharePoint site of the team.

The meeting organizer owns the recording. Teams also posts a link in the meeting chat or channel conversation. To find it later:

1. From a chat: select **Chat**, open the meeting chat, select **Shared**, select the recording and then **Play**.
2. From your calendar: select **Calendar**, select the past meeting, select **Recap**, then **Play**.
3. From a channel: select **Teams**, select the channel, select **Shared**, find the file marked as a recording and play it.

If Teams can't upload the file, for example because the organizer's OneDrive account doesn't exist or is full, the recording may sit in temporary storage for up to 21 days. Download it or fix the storage problem before then. After that it's deleted. For regular meetings, the first check is: does the organizer have a OneDrive and free space? Our overview of [OneDrive](https://www.m365.fm/entity/onedrive/) covers where those files live in a tenant.

### Share and download

By default, everyone who was invited can view the recording, but only organizers and co-organizers can download or delete it. Microsoft's page on playing and downloading recordings says only the organizer can download it.

- **Share a link:** in the meeting chat, open the **Shared** tab, hover over the recording, select **More options** > **Copy link**. Use **Settings** in the **Link** dialog to manage access.
- **Download:** open the **Shared** tab in the chat or channel, find the recording and select **More options** > **Download**.
- **Guests and external attendees** can view a recording only if it's explicitly shared with them, for example with a direct link.

For a channel meeting, the admin setting `ChannelRecordingDownload` decides whether members can download. With the default `Allow`, the file lands in the **Recordings** folder with the normal permissions of the team's SharePoint site. With `Block`, it lands in a **View only** subfolder where members can watch but not download or edit.

## When Record is missing or grayed out

Microsoft's page [I can't record a meeting in Microsoft Teams](https://support.microsoft.com/en-US/teams/meetings/i-can-t-record-a-meeting-in-microsoft-teams) lists the tooltips Teams shows and their causes. Match your message to the cause:

- **"Only people in this org can start recording."** You're anonymous or you belong to another organization. Sign in with an account from the organizer's organization, or ask someone from that organization to record and share the file.
- **"Unavailable in this meeting."** The organizer's meeting policy doesn't allow recording, or the meeting was created through the Graph API with recording turned off. Ask your admin, or have the organizer end the meeting, enable recording and start a new one.
- **"Only meeting organizer and co-organizer can start recording for this meeting."** The organizer limited recording through **Who can record and transcribe**. Ask to be made a co-organizer.
- **"Unavailable because the meeting organizer has disabled recording for this meeting."** The same option is set to no one.
- **"Only meeting organizers and presenters can start recording."** You joined as an attendee. Ask the organizer to make you a presenter.
- **"Unavailable because Copilot is turned off for this meeting."** The meeting option for Copilot is off. Turning off Copilot in Teams meetings also turns off recording and transcription.
- **"Unavailable for this meeting due to organization policy."** For admins: recording isn't allowed for the person, or a recent policy change hasn't taken effect yet. Turn on meeting recording and give the change time to apply.

Federated users can record calls but not meetings. That's another reason a person from a partner company sees no Record button.

### For admins: turn recording on

In the Teams admin center, go to **Meetings** > **Meeting policies**, select or create a policy, turn **Meeting recording** on and select **Save**. A user has one meeting policy at a time, and users without a custom policy get the global one. In PowerShell, the setting is `Set-CsTeamsMeetingPolicy -AllowCloudRecording $true`. Microsoft stresses that this switch only controls whether people can record. It doesn't set up or check the storage. Policy changes can take time to reach users.

## How long a recording is kept

Recordings don't live forever. Admin settings decide when a file expires. Microsoft documents a default of 120 days for new meeting recordings and transcripts in [Manage Teams recording expiration policy](https://learn.microsoft.com/en-us/microsoftteams/manage-teams-recording-expiration-policy). The value can range from 1 to 99999 days, and -1 (PowerShell only) means never. For A1 licenses the maximum default is 30 days. A policy change affects only new recordings.

The organizer or a co-organizer with edit permission can change the date for a single recording:

1. Open the recording from the meeting chat in your browser.
2. Select the expiration countdown below the video.
3. Pick a time frame from the list or select **Remove expiration**.

Watching a recording doesn't change its expiration date. When a file expires, the owner gets an email. It moves to the recycle bin of the place where it was saved, either the organizer's OneDrive or the SharePoint site of the team. Microsoft's support page says the owner has up to 90 days to recover it. The admin page says items in the recycle bin of a work or school account are deleted after 93 days unless the administrator changed it. Once it is purged from the recycle bin, it can't be recovered. If a meeting matters, don't wait for the email. Remove the expiration or download the file when you save the meeting notes.

## Common mistakes

- **Assuming anyone can record.** Guests and people from other organizations can't, and the organizer's policy decides too.
- **Forgetting the organizer's OneDrive.** Recordings of regular meetings go there. A missing or full OneDrive is the usual reason a recording doesn't show up.
- **Leaving the meeting open.** A forgotten participant keeps the recording going. It restarts every four hours until the last person leaves.
- **Not telling people.** Teams shows a notice, but depending on your region you may need permission. Say it at the start and write it in the invitation.
- **Ignoring expiration.** The default is 120 days. If you need the file for a year, remove the expiration or download it.
- **Searching in the wrong place.** Channel meetings save to SharePoint and everything else to OneDrive. Start with the **Shared** tab of the chat.

## Related topics to explore

- **Transcripts of the same meeting.** You can start live transcription during the meeting. Read how [Teams meeting transcription](https://www.m365.fm/entity/teams-meeting-transcription/) works if you want a searchable text version next to the video.
- **Who owns the file.** The recording lives in OneDrive or SharePoint, so permissions, sharing and retention follow those rules. Check your sharing settings before you send a link.
- **Compliance and eDiscovery.** Recordings and transcripts can be found in Microsoft Purview with an eDiscovery case. Ask your compliance team if you have retention requirements.
- **Events and webinars.** These have their own recording switches in the events policy. Recordings of events optimized for large audiences aren't available through chat.
- **Recording failed or didn't save.** Check licensing, the organizer's OneDrive and whether the 21-day temporary storage applies. Details are in Microsoft's troubleshooting page.

## Next step

Open a test meeting with a colleague, record 30 seconds and look for the file in the organizer's OneDrive, in the **Recordings** folder. That one test shows you whether the policy, the license and the storage are in order, before you need to record a meeting that matters. Then you know how to record a Teams meeting, where it goes and who can get to it.
