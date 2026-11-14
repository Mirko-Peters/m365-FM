---
title: "Find Inactive Microsoft 365 Copilot Licenses With Graph Usage Reports and Power BI"
summary: "Identify licensed users with no recent Copilot activity using the admin center usage report or the Graph usage detail API, load the data into Power BI, and reassign licenses safely."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [copilot, power-bi, microsoft-365]
keypoints:
  - "The Copilot usage report lists every user licensed in the past 180 days with a last activity date, so users with old or empty dates are candidates."
  - "A user counts as active only after submitting a prompt or taking an intentional AI action. Opening the Copilot pane alone does not count."
  - "The Graph endpoint getMicrosoft365CopilotUsageUserDetail returns per-user last activity dates and needs Reports.Read.All. The documented version is beta."
  - "User names are concealed by default. A Global Administrator can show them under Settings, Org Settings, Services, Reports."
  - "Unassigning a license holds Exchange Online data for 30 days. OneDrive files are not deleted unless the user is deleted."
faq:
  - q: "What counts as an active Copilot user?"
    a: "Microsoft Learn says a user is active in an app if they perform an intentional action for an AI-powered capability. Selecting the Copilot icon to open the chat pane does not count, but submitting a prompt in the pane does."
  - q: "How current is the usage data?"
    a: "Microsoft Learn says Copilot activity for a day typically becomes available within 48 hours of the end of that day in UTC. The report also runs daily validation for the past three days, so recent history can change slightly."
  - q: "Why are user names hashed in my export?"
    a: "By default, Microsoft 365 usage reports conceal user names. A Global Administrator can change this in the Microsoft 365 admin center under Settings, Org Settings, Services, Reports, by selecting Display concealed user, group, and site names in all reports. The change also affects Graph and Power BI reports."
  - q: "What happens to a user's data when I remove the Copilot license?"
    a: "The Microsoft 365 license removal page covers a whole license removal. It says Exchange Online data is held for 30 days after a license is removed, and OneDrive files are not deleted unless the user is deleted. It does not describe Copilot add-on specifics, so check the Copilot licensing documentation."
---

To find inactive Copilot licenses, pull the per-user last activity dates from the Microsoft 365 admin center usage report or from the Microsoft Graph usage detail API, decide what inactive means for your organization, load the data into Power BI to review it, and then unassign licenses from the users you choose. The details below come from Microsoft Learn and Microsoft Support documentation.

## What the usage report gives you

The Microsoft Copilot usage report is under **Reports** > **Usage** > **Microsoft Copilot** > **Copilot** in the Microsoft 365 admin center. Microsoft says you can view 7, 28, 90 or 180 days. The summary shows Enabled Users, Active Users and the active users rate, and the per-user table shows last activity dates by app.

Two details matter for this task:

- **Licensed in the last 180 days.** The user table shows everyone licensed at any point in that window, even if they later lost the license or never used Copilot.
- **Empty dates.** A last activity date can be empty if the user used Copilot within 24 hours of getting the license and then never again. Microsoft also notes that last activity dates for Word, Excel, PowerPoint, OneNote and Outlook can be blank or newer than the actual date, because upload of client events can be delayed.

The overall last activity date stays fixed when you change the report timeframe. Per-app dates are not affected by the selected timeframe either.

## Define active

Microsoft's definition: a user is active in an app if they perform an intentional action for an AI-powered capability. Opening the chat pane from the ribbon does not count. Submitting a prompt does. Decide your rule before you filter, for example no activity in the last 60 or 90 days, and apply it consistently. Microsoft does not define a recommended inactivity threshold in the pages read, so this is your policy choice.

Data is typically available within 48 hours of the end of the day in UTC. The report also validates the past three days, so the latest figures can shift.

## Get the data

**Option 1: Export from the admin center.** Select **Export** on the report page. It exports usage data for all users as a CSV file that you can sort and filter. You need an appropriate role. The Copilot reports page names AI Administrator, and the general usage reports page lists several others, including Global Reader and Reports Reader, with some of them seeing no user details.

**Option 2: Graph API.** Microsoft documents this request:

```http
GET https://graph.microsoft.com/beta/reports/getMicrosoft365CopilotUsageUserDetail(period='D90')?$format=text/csv
```

Details from the API page:

- Permission: `Reports.Read.All`, delegated or application.
- The `period` values are `D7`, `D30`, `D90`, `D180` and `ALL`.
- CSV returns `302 Found` with a preauthenticated download URL in the `Location` header, valid for only a few minutes and needing no Authorization header.
- JSON returns `200 OK` with a `value` array.
- Fields include `userPrincipalName`, `displayName`, `lastActivityDate` and last activity dates for Teams, Word, Excel, PowerPoint, Outlook, OneNote, Loop and Copilot Chat.

The documentation marks the endpoint as beta, and says beta APIs are subject to change and not supported in production applications. It also says to use the Microsoft 365 Copilot usage APIs under the `/copilot` path going forward. Check that path before you build anything lasting.

## Reveal user names

By default, usage reports hide user names. A Global Administrator can change this in the admin center under **Settings** > **Org Settings** > **Services** > **Reports**, by selecting **Display concealed user, group, and site names in all reports**. The change takes a few minutes, also applies to Microsoft Graph and Power BI reports, and is logged in the Microsoft Purview audit log. The `adminReportSettings` resource in Graph can change the same setting.

## Load into Power BI

Microsoft's usage reports page says that for large user counts you can export a report to Excel or Power BI, or use the Graph reports API. The pages read do not provide a step-by-step Power BI connector setup for the Copilot endpoint, so the simplest documented route is to export the CSV and import it with **Get data** > **Text/CSV**.

Useful measures once loaded:

1. Convert `Last Activity Date` to a date and compute days since the last activity.
2. Create a flag for users beyond your threshold.
3. Add a flag for blank dates, which cover users who never used Copilot or who used it only briefly.
4. Build a table with user, department (from your directory data) and the flag.

Keep the export protected, because it contains identifiable user information and handling it counts as a privacy decision.

## Cross-check before removing licenses

Microsoft warns that the Viva Insights Copilot Dashboard can differ from the admin center report, because the user population and timeframe might differ. It also says audit log data is not intended as the basis for Copilot usage reporting. Compare the admin center export with the dashboard and tell managers before taking licenses away.

## Unassign the license

Per Microsoft's license removal article, you need at least the License Administrator or User Administrator role. There are two routes:

1. **By product:** **Billing** > **Licenses**, select the product, select the users, then **Unassign licenses**.
2. **By user:** **Users** > **Active users**, select the user, open **Licenses and Apps**, clear the license and **Save changes**.

If the license comes from a group, the group name appears instead of individual users, and you change group membership instead. Microsoft's page does not describe how removing a user from a licensed group affects the license, so test with one user first. Also note that Exchange Online data is held for 30 days after a license is removed, and OneDrive files are not deleted unless the user is deleted. The page covers general license removal, not Copilot add-on details.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)
- [Viva Insights](https://www.m365.fm/entity/viva-insights/)

## Sources

- [Microsoft Learn: Microsoft Copilot usage report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage)
- [Microsoft Learn: Microsoft 365 Copilot reports for admins](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-reports-for-admins)
- [Microsoft Learn: getMicrosoft365CopilotUsageUserDetail](https://learn.microsoft.com/en-us/graph/api/reportroot-getmicrosoft365copilotusageuserdetail)
- [Microsoft Learn: Microsoft 365 admin center activity reports](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/activity-reports)
- [Microsoft Learn: Remove licenses from users](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/remove-licenses-from-users)
