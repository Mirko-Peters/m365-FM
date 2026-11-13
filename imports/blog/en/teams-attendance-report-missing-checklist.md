---
title: "Teams Attendance Report Missing? A Checklist for Organizers and Admins"
summary: "Attendance tab empty or webinar report missing? Check the organizer account, the Allow attendance report option, the meeting policy and the known exclusions in this order."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams, teams-admin-center]
keypoints:
  - "Organizers turn the attendance report on for meetings they create. Co-organizers can view it with limits, and webinar reports are organizer-only."
  - "Two settings must both allow it: the per-meeting option Allow attendance report and the Attendance and engagement report setting in the organizer's meeting policy."
  - "The report appears in the meeting chat on the Attendance tab about five minutes after the meeting ends. Lobby-only guests and view-only attendees are never listed."
  - "If the organizer leaves the organization, the reports are deleted for good. Admins can see participant details only within 24 hours after the meeting."
faq:
  - q: "Who can see the attendance report in Teams?"
    a: "According to Microsoft, organizers and co-organizers can view and download it. Co-organizers can access reports only for events scheduled in Teams, not in Outlook, and not for channel meetings. For webinars, the Microsoft page says only organizers can view reports. Admins cannot open the report of a meeting they did not organize."
  - q: "Why is my attendance report empty or missing some people?"
    a: "Common reasons from Microsoft's documentation: people who waited in the lobby and were never admitted, view-only attendees, attendees who turned off Identify me in attendance reports, or a meeting policy that excludes attendees. In meetings with more than 120 participants, the in-meeting report lists only some people, while the post-meeting report should list everyone."
  - q: "Can an admin get the report if the organizer cannot?"
    a: "Not the report itself. Within 24 hours after the meeting, an admin can look at participant details in the Teams admin center under Users, Manage users, the organizer, Meetings & calls. Microsoft's page describes this view only for that 24-hour window."
  - q: "How long does it take until the report is available?"
    a: "Microsoft says the report shows up in the event chat about five minutes after the event ends. Recurring meetings get a separate report for each instance."
---

You organized a Teams meeting, switched on the attendance report, and afterwards the **Attendance** tab is empty or not there at all. Or you ran a webinar and a week later there is still no CSV. These questions came up again and again in Microsoft Q&A threads in 2026, from meetings with a few people up to events with more than a hundred participants. This article puts the answers into one order you can follow. It is a troubleshooting guide, not an official Microsoft procedure. The rules below come from Microsoft's pages on the [attendance and engagement report](https://learn.microsoft.com/en-us/microsoftteams/teams-analytics-and-reports/meeting-attendance-report) and [attendance reports for organizers](https://support.microsoft.com/en-US/Teams/meetings/manage-meeting-attendance-reports-in-microsoft-teams). Where a statement only comes from a community thread, the text says so.

## Symptoms in the threads

- The **Attendance** tab does not appear in any meeting, although the option was on. One person reported that this started after switching between classic and new Teams.
- After a meeting with more than 100 people, the only report showed who accepted or declined the invitation. The report with join and leave times was missing. A later comment described a 65-person external briefing where the file icon appeared in the chat but opened as "not available, try again later".
- A webinar report was still empty days after the event.

None of these threads has a confirmed fix from the person who asked. In the first two, a moderator asked for more details or an AI-generated answer and an anonymous answer listed settings, and nobody came back to say what worked. So treat the steps below as a way to find the cause, not as a promise.

## Step 1: Sign in as the organizer

The most common cause is simply the wrong account. Microsoft says only organizers and co-organizers can view or download attendance reports. There are limits for co-organizers:

- They can access reports only for events scheduled in Teams, not for events scheduled in Outlook.
- They cannot access attendance reports for channel meetings.

For webinars the rule is stricter. The Microsoft page on [webinar reports](https://support.microsoft.com/en-us/topic/a29785c1-6b0f-437d-b03f-49506d0a7fa6) says only organizers can view them and that co-organizer access is currently unavailable. A moderator gave the same answer in the webinar thread.

Admins are not a way around this. The Learn page says admins cannot view the report for meetings or events they did not organize.

## Step 2: Check the per-meeting option

Microsoft says organizers can turn attendance reports on or off in meetings they create. It describes two places.

Before the meeting, in the Teams desktop app:

1. Select **Calendar**, open the event and select **View event**.
2. Select **Options**.
3. Under **Participation**, switch **Allow attendance report** on.
4. Select **Apply**.

During the meeting: open **Controls** (or **More actions**, then **Controls**), select **View more options**, and switch **Allow attendance report** on under **Participation**. Select **Apply**.

If the option was off, there is nothing to recover afterwards. Switch it on for the next meeting. For a recurring series, set it once on the series and check that it stayed on.

## Step 3: Look in the right place

After the meeting:

1. In Teams, select **Chat** and open the chat of the past meeting or event.
2. Select the **Attendance** tab.
3. Select **Download** to get a `.csv` file.

Microsoft says the report appears about five minutes after the event ends. Recurring meetings get a separate report for each instance in the series. During a meeting, organizers can use **People**, then **More actions**, then **Download attendance list**.

One moderator in a 2026 thread also named the **Tracking** area of a past calendar event as a second download path. I did not find that on the Microsoft pages above, so check it in your own client.

For webinars, the path is different: open the webinar in your Teams calendar, select **View event**, then **Manage event**, then the **Attendance** tab. Microsoft also lists a **Reports** route from the past webinar in the calendar.

## Step 4: Check the meeting policy (admins)

If the per-meeting option is missing or greyed out, or the Attendance tab is absent for everybody, look at the organizer's policy. In the Teams admin center, go to **Meetings**, then **Meeting policies**, open the policy that is assigned to the organizer and find the **Meeting scheduling** section. Microsoft lists three settings there.

**Attendance and engagement report**

- **On, but organizers can turn it off** (default): organizers see reports and can turn them off per meeting.
- **On**: organizers see reports and cannot turn them off.
- **Off**: organizers cannot view or download reports.

**Include attendees in the report**

- **Yes, but attendees can opt out** (default)
- **No, but attendees can opt in**
- **Always**
- **Never**: all attendees are excluded and cannot opt in.

**Attendee information**

- **Show everything** (default): join time, leave time and duration.
- **Only show who attended**: no times and no duration.

The settings map to `Set-CsTeamsMeetingPolicy` with the parameters `-AllowEngagementReport`, `-AllowTrackingInReport` and `-InfoShownInReportMode`. The Learn page gives only a few example values, for instance `-AllowEngagementReport Disabled` for off, so look at the cmdlet reference before you script anything. The page gives no propagation time for policy changes, so allow some time before you test again, and check that the policy is really assigned to the organizer.

## Step 5: Know who is never in the report

Microsoft lists these exclusions and limits:

- People who wait in the lobby and are never admitted.
- View-only attendees.
- Attendees who set **Identify me in attendance reports** to off in **Settings and more**, **Settings**, **Privacy**, when the policy allows opting out.
- Insights from deleted breakout rooms.
- Instant channel meetings. Attendance reports are not supported for them.
- If someone starts a second meeting in the same channel conversation while one is running, only the second meeting gets a report.

If the organizer leaves the organization, the reports are permanently deleted and cannot be recovered. This matters when you offboard people who run recurring meetings or webinars.

## Step 6: Large meetings

Microsoft says that in meetings with more than 120 participants, the report you download during the meeting includes only some attendees, while the report after the meeting includes everyone. In the June 2026 thread, the organizer had more than 100 participants and still did not find the full report afterwards. The Learn page does not explain that case, and the thread has no confirmed answer. If everything above is in order and the file is still missing after a day, collect the meeting date, the time and the organizer, and open a support case.

## Step 7: What an admin can still do

Within 24 hours after the meeting, an admin can look at attendee details: in the Teams admin center, open **Users**, then **Manage users**, select the organizer, open the **Meetings & calls** tab, choose the meeting ID or call ID and select **Participant details**. Microsoft names only this 24-hour window, so act quickly.

A moderator in the webinar thread also said that a tenant admin can ask Microsoft Support to recover a missing webinar report through **Help & support** in the Microsoft 365 admin center. This is a community-thread statement. Microsoft's own pages do not describe a recovery service, so treat it as something to try, not a guarantee. An anonymous answer in the June 2026 thread said the admin center has an **Export data as CSV** option for the meeting. I could not confirm that on Microsoft Learn either.

## Quick checklist

1. Are you signed in as the organizer (and is it a webinar or channel meeting with extra limits)?
2. Was **Allow attendance report** on for this meeting?
3. Is **Attendance and engagement report** set to On or On, but organizers can turn it off?
4. Does **Include attendees in the report** exclude people?
5. Did you look in the meeting chat under **Attendance**, at least five minutes after the end?
6. Is the organizer still in the organization?
7. For an admin: was it less than 24 hours ago?

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Attendance and engagement report for meetings and events](https://learn.microsoft.com/en-us/microsoftteams/teams-analytics-and-reports/meeting-attendance-report)
- [Microsoft Support: Manage meeting attendance reports in Microsoft Teams](https://support.microsoft.com/en-US/Teams/meetings/manage-meeting-attendance-reports-in-microsoft-teams)
- [Microsoft Support: View webinar reports in Microsoft Teams](https://support.microsoft.com/en-us/topic/a29785c1-6b0f-437d-b03f-49506d0a7fa6)
- [Microsoft Q&A: Attendance report tab missing (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5791944/attendance-report-tab-missing)
- [Microsoft Q&A: Attendance Report Missing on Large Meeting (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5909177/attendance-report-missing-on-large-meeting)
- [Microsoft Q&A: Teams attendance report never populated (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5835451/teams-attendance-report-never-populated)
- [Microsoft Q&A: How I can get list of attendees after meeting ends (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5768527/how-i-can-get-list-of-attendees-after-meeting-ends)
