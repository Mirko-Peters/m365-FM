---
title: "How to Collect Teams Logs and Check Microsoft 365 Service Health"
summary: "Collect Microsoft Teams debug and support logs with a keyboard shortcut or menu, know what each log type is for, and check Microsoft 365 service health and Call Analytics before opening a support case."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [teams, teams-admin-center, microsoft-365-admin-center]
keypoints:
  - "On Windows, press Ctrl + Alt + Shift + 1 or use the Teams tray icon and Collect support files. On Mac, press Option + Command + Shift + 1."
  - "Logs are saved to the Downloads folder by default. Wait until the Downloading web logs banner disappears before you pick them up."
  - "Debug logs are the ones support engineers require and are read from the bottom up. Media logs can only be inspected by Microsoft."
  - "Log times are in UTC, so tell the support agent the difference to your local time. Collect logs as soon as the issue happens."
  - "Check Health > Service health in the Microsoft 365 admin center first, then use Call Analytics in the Teams admin center before you open a case."
faq:
  - q: "How do I collect Teams logs on Windows?"
    a: "According to Microsoft Learn, select the Microsoft Teams icon in the system tray and choose Collect support files, or press Ctrl + Alt + Shift + 1. The files are saved to the Downloads folder by default. Wait until the banner showing Downloading web logs disappears before you retrieve them."
  - q: "What is the difference between debug, media and desktop logs?"
    a: "Microsoft's troubleshooting module describes debug logs as the ones used most often and the ones a support engineer will require. Media logs hold diagnostic data about audio, video and screen sharing and can only be inspected by Microsoft. Desktop logs, also called bootstrapper logs, cover events between the desktop client and the browser and are needed only if Microsoft asks for them."
  - q: "Why are the times in the Teams logs wrong?"
    a: "They are not wrong. Microsoft Learn says times in logs are recorded in Coordinated Universal Time. When you open a support case, tell the agent the difference between the local time the issue occurred and UTC."
  - q: "Where do I check whether Teams has a service problem?"
    a: "Sign in to the Microsoft 365 admin center and go to Health and then Service health. Microsoft Learn says the Overview tab lists each service with its health state and any active incidents or advisories. If you cannot sign in to the admin center, Microsoft points to status.cloud.microsoft."
  - q: "Can I get call quality details without collecting logs?"
    a: "Yes, for calls and meetings in the last 30 days. Microsoft Learn describes Call Analytics in the Teams admin center: under Users, select the user and open the Meetings & Calls tab, then select a session. The Advanced tab marks yellow and red items, and red is likely the main cause. You need a Teams Administrator or Teams communications support role."
---

Teams logs can be collected in a few seconds with a keyboard shortcut. On Windows press Ctrl + Alt + Shift + 1, and on Mac press Option + Command + Shift + 1. Before you do that, check service health, because a Microsoft-side incident explains many problems without any logs. This article covers both, in the order that saves the most time.

## Step 1: Rule out a service problem

Microsoft Learn describes service health in the Microsoft 365 admin center. Users with the Service Support admin or Helpdesk admin role can view it.

1. Sign in at admin.microsoft.com.
2. Go to **Health** > **Service health**, or select the **Service health** card on the Home dashboard.
3. On the **Overview** tab, find Microsoft Teams and read its health column.
4. Select an issue title to see its status, start time, affected services, user impact and the **All Updates** feed.

Other tabs are **Issue history**, for resolved incidents and advisories, and **Reported issues**, for problems your organization reported through **Report an issue**.

Microsoft separates two issue types. An **advisory** means a problem affects some users but the service is still available, often with a workaround. An **incident** means a service or major function is unavailable or has noticeable user impact. Statuses include Investigating, Service degradation, Service interruption, Restoring service, Extended recovery and Service restored.

If you cannot sign in to the admin center, use status.cloud.microsoft. Planned maintenance is not shown in Service health. Use the Message center and filter to **Plan for change**. To be told about problems, select **Customize** > **Email** and choose incidents, advisories or both, for up to two addresses.

If your problem is not listed, select **Report an issue**. Microsoft reviews related data from other organizations and may add it as a new incident or advisory.

## Step 2: Look at Call Analytics for calls and meetings

For poor call or meeting quality, Call Analytics can answer the question without logs. The roles that apply are Teams Administrator, Teams communications support specialist and Teams communications support engineer.

1. Open the Teams admin center at admin.teams.microsoft.com.
2. Under **Users**, select the person.
3. Open the **Meetings & Calls** tab and select the call or meeting.
4. Select the **Advanced** tab and look for yellow and red items.

Microsoft says yellow is outside the normal range but unlikely to be the main cause, and red is a significant problem and likely the main cause. The list covers the last 30 days. Specialists see fewer details than engineers, and a session does not appear if no media sessions were generated. Microsoft notes that the article describes an earlier experience that has since been updated, so menus may look different.

## Step 3: Collect the Teams logs

### Which logs exist

Microsoft's troubleshooting module names three client log types:

| Log | Use | Readable by |
|---|---|---|
| Debug | Troubleshooting login, connections and calls. The one support requires. | Teams administrators, read from the bottom up |
| Media | Audio, video and screen sharing diagnostics. Needed only when requested. | Microsoft only |
| Desktop (bootstrapper) | Events between the desktop client and the browser. Needed only when requested. | Read top-down |

Debug logs come from the Windows, Mac and Linux clients and from the browser. Media and desktop logs come from Windows, Mac and Linux. The module lists no debug, media or desktop logs for iOS and Android. The generated debug files use the words diagnostic logs in their names.

A separate Microsoft Learn page uses different names: **MS Teams Support Log Files** (media, signaling and platform logs) and **Weblogs** (application event logs). The weblog file name depends on the account type, for example Prod-Weblogs for public enterprise accounts. The browser client produces only one log.

### How to collect them

| Client | Method | Where files go |
|---|---|---|
| Windows | Tray icon > **Collect support files**, or Ctrl + Alt + Shift + 1 | %userprofile%\Downloads |
| Mac | **Help** menu > **Collect support files**, or Option + Command + Shift + 1 | Downloads |
| Linux | Ctrl + Alt + Shift + 1 | ~/Downloads |
| Browser | Ctrl + Alt + Shift + 1 | You are prompted to save the debug log |

Wait until the **Downloading web logs** banner is dismissed before you retrieve the files. Prod-Weblogs are already compressed, but the MS Teams Support Log Files must be compressed before you upload them to Microsoft Support.

### Habits that make the logs useful

- Collect them as soon as the issue occurs.
- Note the local time of the problem. Log times are in UTC.
- Expect logs for all signed-in accounts, because Microsoft says logs include diagnostic information for every account in the client.
- On VDI clients, turn on **Extended Logging** in Teams Privacy settings before you reproduce the issue, because log size is limited by default.
- For a browser trace, sign in to Teams before you start the trace so it does not capture sign-in details.

### A note on media logging

The troubleshooting module says media logs are enabled by default on certain processors, and describes a Teams admin center option under **Settings** > **General** to enable logging for meeting diagnostics, followed by a Teams restart. The newer log-files page says performance improvements allow media logging to be always on, and that the administrative policy to control it has been deprecated. The two pages do not reconcile this, so treat the newer statement as current and check your own admin center.

## What the pages do not cover

The pages I read do not give mobile log steps, and they do not separate new Teams from classic Teams behavior. Check the Teams support documentation if you need those.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft 365 message center](https://www.m365.fm/entity/microsoft-365-message-center/)

## Sources

- [Microsoft Learn: Teams log files](https://learn.microsoft.com/en-us/microsoftteams/log-files)
- [Microsoft Learn: Collect and identify logs](https://learn.microsoft.com/en-us/training/modules/troubleshoot-audio-video-client-issues/03-collect-identify-logs)
- [Microsoft Learn: How to check Microsoft 365 service health](https://learn.microsoft.com/en-us/microsoft-365/enterprise/view-service-health)
- [Microsoft Learn: Use Call Analytics to troubleshoot poor call quality](https://learn.microsoft.com/en-us/microsoftteams/use-call-analytics-to-troubleshoot-poor-call-quality)
