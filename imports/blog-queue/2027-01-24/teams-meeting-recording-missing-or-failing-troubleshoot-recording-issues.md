---
title: "Teams Meeting Recording Missing or Failing: Troubleshoot Recording Issues"
summary: "Two problems from Microsoft Learn: the Record button is missing, or the recording link is not in the chat or recap. Checks for call type, meeting role, meeting options and account context, where recordings are stored in OneDrive and SharePoint, and the admin diagnostics to run."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [teams, onedrive, sharepoint]
keypoints:
  - "Learn names two symptoms: the Record button is missing, or a completed recording is missing in the meeting recap or chat."
  - "Causes can be the user account, the assigned license, or configured meeting policies. Run the Teams Meeting Recording Test for the account."
  - "If the button is missing, check meeting versus 1:1 call, meeting role, organizer meeting options and account or tenant context. Calls use the AllowCloudRecordingForCalls policy."
  - "Non-channel meeting recordings go to the Recordings folder under My files in the recorder's OneDrive. Channel meeting recordings go to the Recordings folder in the team SharePoint site."
  - "Admins can run the Meeting Recording Support Diagnostic and the Missing Recording Diagnostic in the Microsoft 365 admin center. They are not available for Government, 21Vianet or Germany."
faq:
  - q: "Why is the Record button missing in a Teams meeting?"
    a: "Microsoft Learn lists four checks: whether it is a meeting and not a 1:1 or PSTN call, the meeting role of the user (organizer, co-organizer, presenter or attendee), the organizer's meeting options under Recording and transcription, and the account and tenant context, since anonymous, guest or external users might not be allowed to record in the organizer's tenant. A lock icon on the button has a tooltip that explains why it is unavailable."
  - q: "Where is a Teams meeting recording saved?"
    a: "For non-channel meetings, in the Recordings folder under My files in the OneDrive for Business of the person who recorded. For channel meetings, in the Recordings folder of the Teams site document library in SharePoint. In the channel you can use Files, Recordings, Open in SharePoint."
  - q: "The recording link does not show in the chat. What can I try?"
    a: "Learn describes a known issue in high-volume chats that can stop the link appearing for some users. Scroll to the top of the chat window and back to the bottom, which might trigger a chat service event and restore the link. If it does not, look in the storage locations, then run the Missing Recording Diagnostic."
  - q: "How do I record a 1:1 call that has no Record button?"
    a: "Call recording is controlled by the AllowCloudRecordingForCalls parameter of Teams calling policies, which is a different path from meeting recording. Admins can run the Teams 1:1 Call Recording diagnostic by typing Diag: Teams 1:1 Call Recording in the Need Help search box in the Microsoft 365 admin center."
  - q: "What do the admin diagnostics check?"
    a: "The Meeting Recording Support Diagnostic validates license assignment, meeting policy eligibility and tenant-level recording prerequisites for a user. The Missing Recording Diagnostic takes the meeting URL and date and confirms that the recording finished and was uploaded to SharePoint or OneDrive."
---

Recording problems in Teams meetings fall into two groups: users who cannot start a recording because the button is missing, and users who recorded but cannot find the result. The Microsoft Learn page on meeting recording problems covers both. This article keeps its order, starting with the quick checks and then going through the two issues.

## Symptoms

- The meeting recording button is missing.
- The recording is complete, but it is missing in the meeting recap.

## Likely causes

Learn says the problems might come from the user account, the license assigned to the user, or configured meeting policies.

Start with what users can do themselves:

- Run the **Teams Meeting Recording Test** (Learn links it), which checks whether the account meets the requirements to record a meeting in Teams.
- If you see a **lock icon** on the recording button, hover over it. The tooltip explains why the button is unavailable.
- Make sure the latest Teams updates are installed.

## Admin diagnostic: Meeting Recording Support Diagnostic

Microsoft 365 administrators can run this diagnostic in the tenant. It validates license assignment, meeting policy eligibility and tenant-level recording prerequisites. Learn says it is not available for Microsoft 365 Government, Microsoft 365 operated by 21Vianet, or Microsoft 365 Germany.

1. Select the **Run Tests** link on the Learn page, which adds the diagnostic to the Microsoft 365 admin center.
2. In the **Run diagnostic** pane, enter the email address of the user who cannot record in **Username or Email** and select **Run Tests**.

The tests suggest next steps for tenant or policy configuration. For the requirements behind them, Learn points to its page on the prerequisites for Teams cloud meeting recording.

## Issue 1: The Record button is missing

| Check | Why it matters | Action |
| --- | --- | --- |
| Meeting versus 1:1 call | Meeting recording and 1:1 call recording use different policy paths | Confirm the user is in a meeting. For a 1:1 or PSTN call, troubleshoot calling policy (`AllowCloudRecordingForCalls`) and run the 1:1 call recording diagnostic |
| Meeting role | Recording can be restricted by role, and attendees might not be allowed to start it | Verify whether the user is organizer, co-organizer, presenter or attendee. If needed, the organizer assigns presenter or co-organizer |
| Organizer meeting options | Meeting options can block recording and transcription for participants or everyone | The organizer reviews **Meeting options** > **Recording & transcription** and adjusts **Who can record and transcribe** |
| Account and tenant context | Anonymous, guest or external users might not be allowed to start recording in the organizer's tenant | Make sure the user is signed in with the expected account. If needed, a participant from the organizer's organization starts the recording |

Further steps from the page:

- Leave and rejoin the meeting, which might restore recording.
- Join and record with the Teams web client.
- Make sure it is a meeting and not a 1:1 call.
- Run the 1:1 Call Recording Diagnostic: in the Microsoft 365 admin center type **Diag: Teams 1:1 Call Recording** in the **Need Help?** search box, enter the user's email address in **Username or Email**, and select **Run Tests**.

Try to record again. If it still fails, Learn says to open a service request with Microsoft Support.

## Issue 2: The recording link is not visible in the chat

In high-volume chats, a known issue prevents the recording link from appearing for one or more users. Scroll up to the top of the chat window and back to the bottom. This might trigger a chat service event and restore the link.

If the link is still missing, find the recording by hand:

- **Non-channel meetings:** the recording is in the **Recordings** folder under **My files**. That is in the OneDrive for Business of the user who recorded, for example `<Recording user's OneDrive for Business>/My files/Recordings`.
- **Channel meetings:** the recording is in the **Recordings** folder in the Teams site document library in SharePoint. In Teams select **Files** > **Recordings** > **Open in SharePoint**. Administrators can also find it in SharePoint under **Documents** in the **Recordings** folder for the channel.

If you still cannot find it, run the **Missing Recording Diagnostic**. It is also unavailable for Government, 21Vianet and Germany. Select **Run Tests** to add it to the admin center. In the pane enter the **URL of the meeting that was recorded**, usually found in the meeting invitation, and the date in **When was the meeting recorded?**, then select **Run Tests**. The tests confirm that the recording finished and was uploaded to SharePoint or OneDrive.

## Which path to follow

| What the user says | Start here |
| --- | --- |
| There is no Record button | Issue 1, and the lock icon tooltip |
| There is a lock icon on the button | Hover for the tooltip, then Issue 1 |
| I recorded, but there is no link in the chat | Issue 2, scroll, then the storage folders |
| The link is missing everywhere | Missing Recording Diagnostic |
| It is a phone or 1:1 call | Calling policy and the 1:1 diagnostic |

## Support desk habits (my advice)

This is my suggestion, not guidance from the page:

1. Ask first what kind of event it was, meeting, channel meeting or call, and who organized it. That answers half of the checks.
2. Ask who started the recording, since the file is stored for that person.
3. Ask for the meeting URL and date before the user leaves the chat, because the Missing Recording Diagnostic needs both.
4. When many users report the same missing button for one organizer, check that organizer's meeting options before you look at licenses.
5. Collect the diagnostic results in the ticket. Support will ask for them.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Troubleshoot Meeting Recording Problems (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/meetings/troubleshoot-meeting-recording-issues)
