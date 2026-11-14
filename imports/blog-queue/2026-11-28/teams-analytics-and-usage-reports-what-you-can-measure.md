---
title: "Teams Analytics and Usage Reports: Where to Find Them and What Each Measures"
summary: "Teams analytics explained: the usage and user activity reports in the Microsoft 365 admin center, the 21 reports in the Teams admin center, roles needed, date ranges, latency and metric definitions."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [teams, teams-admin-center, microsoft-365-admin-center]
keypoints:
  - "Teams reports live in two places: Reports > Usage in the Microsoft 365 admin center, and Analytics & reports in the Teams admin center. They are separate."
  - "The Teams admin center lists 21 reports, from Teams usage and user activity to PSTN, devices and security detections."
  - "The Team usage report shows trends for 7, 30, 90 or 180 days. Data for a given day appears within 48 hours, and dates use UTC."
  - "Reports cover active users and active channels only. Inactive users are not included for the selected date range."
  - "User names are hidden by default. Showing them is a tenant setting, and Global Reader sees only tenant-level aggregates."
faq:
  - q: "Where do I find Teams usage reports?"
    a: "Microsoft Learn gives two paths. In the Microsoft 365 admin center, select Reports > Usage and then Microsoft Teams. In the Teams admin center, select Analytics & reports and choose a report under View Reports. Learn says the two sets of reports are separate."
  - q: "Who can view Teams reports in the Teams admin center?"
    a: "The Teams reporting reference lists the Teams administrator role. Global Reader is also listed, but with tenant-level aggregate data only and no per-user or team data."
  - q: "How long does it take for Teams usage data to appear?"
    a: "For the Team usage report, Microsoft Learn says data for a given day appears within 48 hours. The system also validates the past three days daily and fills gaps, so you may see differences in historical data. Activity dates are based on UTC."
  - q: "Which time ranges can I choose?"
    a: "The Team usage and User activity reports in the Microsoft 365 admin center show trends over the last 7, 30, 90 or 180 days. If you select a particular day, the table shows data for up to 28 days from the current date."
  - q: "Can I see individual user names in the reports?"
    a: "By default, Microsoft says user-specific information such as usernames, display names, groups and sites is hidden in usage reports. A Global administrator controls the setting that decides whether concealed names are shown."
---

Teams analytics come from two sets of reports. The first set is under **Reports** > **Usage** in the Microsoft 365 admin center. The second is the **Analytics & reports** area of the Teams admin center. Microsoft says the two are separate, so a number in one place may not match the other. This article shows what each report measures and what the documentation says about roles, time ranges and delays.

## Where the reports live

**Microsoft 365 admin center**

1. Select **Reports**. If you do not see it, select **Show all**, then **Reports**.
2. Select **Usage**.
3. Under **Reports**, select **Microsoft Teams**.
4. Choose the **Team usage** or **User activity** tab.

**Teams admin center**

1. In the left navigation, select **Analytics & reports**.
2. Under **View Reports**, choose the report you want.

Microsoft's reporting reference says the reports in the Teams admin center are separate from the Teams activity reports in the Microsoft 365 admin center.

## Who can view them

For the Teams admin center, the reporting reference lists the Teams administrator role (the Skype for Business administrator role is also named). Global Reader can view tenant-level aggregates only, with no per-user or team data. For the Microsoft 365 admin center reports, the Teams usage page does not list roles and points to the usage reports overview under "Before you begin".

## The 21 reports in the Teams admin center

The reference lists 21 reports. Some are public cloud only. Grouped by purpose:

| Purpose | Reports |
|---|---|
| Core usage | Teams usage, Teams user activity, Teams client usage, Teams app usage |
| Devices | Teams device usage, Walkie Talkie usage and performance |
| Events and appointments | Teams events usage, Teams live event usage, Virtual Appointments usage, Advanced Virtual Appointments activity, EHR connector Virtual Appointments |
| Calling | PSTN blocked users, PSTN minute pools, PSTN usage for Calling Plans, PSTN usage for Direct Routing |
| Licensing and premium | Teams Premium feature usage, Teams information protection license |
| Other | Frontline usage, SMS notifications usage |
| Security | User reported security submissions, Security detections |

There is no separate meetings report. Meeting figures appear in the user activity report.

## What the Team usage report measures

Channel usage chart:

- **Active channel users:** internal active users, active guests and external active users combined.
- **Active channels:** valid channels in active teams with at least one active user in the period. This includes public, private and shared channels.
- **Channel messages:** unique messages posted. Note that Learn defines this metric differently in two places on the same page, so check the definition if you compare it with the details table.

Team usage chart: private teams, public teams, active private teams and active public teams.

The per-team details table includes active users, active guests, external active users, active channels, active shared channels, total organized meetings, posts, replies, mentions, reactions, urgent messages and last activity date.

The page also says counts include built-in Teams client features but not chat and channel changes made through service integration, such as app posts or emails in a channel.

## What the User activity report measures

Per user, Microsoft lists:

- Chat messages (private chat) and channel messages (team chat, including posts and replies).
- 1:1 calls.
- Total organized meetings and total participated meetings, broken down by ad hoc, scheduled one-time and scheduled recurring. Learn says the older "Total meetings" metric is being phased out in favor of total participated meetings.
- Urgent messages, last activity date (UTC), whether the user is licensed and other activity.
- Audio, video and screen share time. These measure participation in meetings or calls where audio, video or screen share was enabled, not active speaking or camera-on time.

## Date ranges, delay and time zone

- Trends cover the last 7, 30, 90 or 180 days. Selecting a day shows up to 28 days from the current date in the table.
- Data for a given day appears within 48 hours.
- The system checks the past three days daily and fills gaps, so historical numbers can shift.
- Activity dates are based on UTC. A post at 11 pm local time may count on a different day.

## Active users only

The reference says the Teams reports show data for active users and active channels. An active user performs an action in Teams during the date range. A user who is inactive in that range is not in the report. Do not read the user list as a list of everyone with a license.

## Exporting

Select **Export** to download a .csv file. Learn says it contains the usage data of all users and allows sorting and filtering. Audio, video and screen share time are exported in ISO 8601 duration format, so convert them before charting. Use **Choose columns** to add or remove table columns.

## Privacy

By default user names, display names, groups and sites are hidden. The reference names the setting "Display concealed user, group, and site names in all reports", says a Global administrator manages it, and says it has been enabled by default for everyone since September 1, 2021. Check your own tenant setting before you share an export.

## What the pages do not cover

The pages I read do not describe how long data is retained beyond the 180 day range, and the reporting reference gives no retention or latency figure. For Microsoft Viva Insights or Copilot reporting, use the documentation for those products.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Microsoft Learn: Microsoft Teams analytics and reporting](https://learn.microsoft.com/en-us/microsoftteams/teams-analytics-and-reports/teams-reporting-reference)
- [Microsoft Learn: Microsoft Teams Team usage report](https://learn.microsoft.com/en-us/microsoftteams/teams-analytics-and-reports/teams-usage-report)
- [Microsoft Learn: Teams user activity report](https://learn.microsoft.com/en-us/microsoftteams/teams-analytics-and-reports/user-activity-report)
