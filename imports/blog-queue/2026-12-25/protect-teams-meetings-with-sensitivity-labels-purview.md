---
title: "Protect Teams Meetings With Sensitivity Labels: Setup, Client Versions and Limits"
summary: "Configure Microsoft Purview sensitivity labels with the Meetings scope to protect Teams meetings: required scopes, Teams meeting options, publishing settings, minimum client versions, how organizers apply labels and documented limitations."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [sensitivity-labels, teams]
keypoints:
  - "Select all three label scopes: Files and other data assets, Emails and Meetings. A meeting includes the calendar event, invites, attachments, emails and the Teams meeting itself."
  - "Under Choose protection settings for labeled items, select Protect Teams meetings and chat to enforce Teams-specific settings. Some options need a Teams Premium license."
  - "Labels that apply S/MIME or Double Key Encryption cannot protect calendar items, Teams meetings or chat."
  - "If organizers or participants run older Teams clients, the label's meeting options cannot be enforced for them."
  - "Automatic and recommended labeling is not supported. Settings enforced by the label show a lock in Teams and cannot be changed there."
faq:
  - q: "Which scopes must the label have?"
    a: "According to Microsoft Learn, Files and other data assets, Emails and Meetings, all three, because a meeting includes the calendar event, invites, attachments, emails and the Teams meeting itself."
  - q: "Do I need a Teams Premium license?"
    a: "Learn says some Teams options require a Teams Premium license. Without it you see an information bar in the Microsoft Purview portal. It refers to the Purview service description for full licensing."
  - q: "Which Teams clients are supported?"
    a: "Teams on the web in Edge or Chrome, Windows client 1.5.00.32158 or later, macOS client 1.5.00.32154 or later, iOS 5.23.0 or later and Android 1416/1.0.0.2023235001 or later."
  - q: "Does the label stop screen captures or copying?"
    a: "The copy prevention setting blocks right-click Copy, Ctrl+C, forwarding, Share to Outlook and Copy link. Learn says it does not block screen captures, developer tools or third-party apps."
  - q: "Can the label stop people inviting others during the meeting?"
    a: "No. Learn lists as a limitation that during a meeting a label cannot stop participants from inviting others through the link or the Share invite option."
---

To protect Teams meetings with sensitivity labels, create a label with the Files, Emails and Meetings scopes, turn on protection for Teams meetings and chat, set the meeting options and publish the label. Organizers then apply it to meeting invites in Outlook or Teams. This guide follows Microsoft Learn.

## Prerequisites

- **Licensing:** check the sensitivity labeling licensing in the Microsoft Purview service description. Some Teams options require Teams Premium, and without it an information bar appears in the Purview portal.
- **Scopes:** select **Files & other data assets**, **Emails** and **Meetings**.
- **Unsupported protection:** labels that apply S/MIME or Double Key Encryption cannot protect calendar items, Teams meetings or chat.
- **Client versions:** Teams on the web (Edge or Chrome), Teams for Windows 1.5.00.32158 or later, macOS 1.5.00.32154 or later, iOS 5.23.0 or later, or Android 1416/1.0.0.2023235001 or later. If participants or organizers do not meet these, the meeting options cannot be enforced for them.

## Configure the label

The page gives no exact portal menu path and points to the general label creation instructions.

1. Create or edit the label and select the three scopes.
2. On **Choose protection settings for labeled items**, select any of: **Apply or remove encryption**, **Apply content marking** or **Protect Teams meetings and chat**.
3. Configure the Teams options on the following pages. They are:
   - Who can bypass the lobby
   - Who can present
   - Who can record and transcribe
   - Encryption for meeting video and audio
   - Automatically record
   - Video watermark for screen sharing and camera streams
   - Prevent copying and forwarding of meeting chat, live caption and transcripts
   - Detect sensitive content during screen sharing

The page refers to Teams documentation for what each option means.

The copy prevention setting blocks right-click Copy, Ctrl+C, forwarding, Share to Outlook and Copy link. It does not block screen captures, developer tools or third-party apps. It also applies to AI-generated meeting recap content.

## Publish the label

Publish the label to organizers and participants, then configure these policy settings:

- **Apply a default label to meetings and calendar events**
- **Require users to apply a label to their meetings and calendar events**
- **Inherit label from files shared to meetings**
- **Apply meeting label to artifacts** (preview, requires MP4 support enabled for recordings)

For channel meetings, edit an existing groups and sites label to set a default label. Its scope must include files, emails and meetings.

## How organizers apply a label

Organizers apply, change and view labels on meeting invites in Outlook on the web or in Microsoft 365 Apps for enterprise on supported platforms, and in Teams on the web or the listed clients. The meeting inherits the label of the invite and is protected before it starts. When it starts, the label enforces its options. Settings enforced by the label show a lock and a message, and cannot be changed in Teams.

## Limitations

- Calendar items support only the default Azure Rights Management encryption.
- Automatic and recommended labeling is not supported.
- Mailboxes must be in Exchange Online. On-premises mailboxes are not supported.
- In Outlook, group calendar invites are not supported, shared mailbox calendars cannot apply or change meeting labels, and for a series the organizer can label the series but not single occurrences. Forwarding from non-Outlook clients removes label information from headers, though encryption persists.
- In Teams, changes to recording, encryption, auto-record or watermark settings made mid-meeting apply only after the organizer ends and restarts the meeting. Those options do not apply to Meet Now meetings. Labels cannot be applied to live events, and labeling invites through Graph APIs is not supported.

## Rollout checklist

This checklist is a suggestion based on the prerequisites above, not a Microsoft procedure.

1. Confirm the licensing, including Teams Premium for the options you need.
2. Check that organizers use supported Teams and Outlook clients, and that their mailboxes are in Exchange Online.
3. Create the label with all three scopes, and choose the Teams options.
4. Publish it and set the default or required label policy settings.
5. Test with one organizer and one participant on supported clients before a wider rollout.

## Not covered

The page does not give the exact portal path, explain each Teams option in detail, or describe troubleshooting. It links to Teams documentation for templates and admin policies.

## Related

- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Use sensitivity labels to protect calendar items, Teams meetings, and chat](https://learn.microsoft.com/purview/sensitivity-labels-meetings)
