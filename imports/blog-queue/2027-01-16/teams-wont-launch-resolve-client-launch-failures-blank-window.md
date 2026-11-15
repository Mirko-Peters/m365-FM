---
title: "Teams Will Not Launch: Resolve Client Launch Failures"
summary: "When the Teams window opens blank and closes, the Teams client health dashboard can report a launch failure with an insight. Learn maps four insights to fixes: blocked endpoints, timeouts, script errors and unsupported operating systems. Here is how to read the dashboard and act."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [teams, teams-admin-center, entra-id]
keypoints:
  - "The typical symptom on Learn is a blank Teams window that opens and then closes, and the Teams client health dashboard reports it as Launch failure."
  - "Open Teams client health in the Teams admin center and read the Insight column to see why a device or user failed to launch."
  - "Learn lists four insights: unable to navigate to the Teams endpoint, timed out waiting for the Teams endpoint, script error and unsupported OS version."
  - "Network insights point to firewalls or proxies blocking Teams endpoints; a script error is handled by signing out and back in; an unsupported OS needs an update."
  - "Launch failure data covers Windows (non-VDI) and Mac clients over the last 28 days, and Learn says to contact Microsoft Support if the issue persists."
faq:
  - q: "What does a Teams launch failure look like?"
    a: "Microsoft Learn describes a blank window that opens and then closes when a user starts the Teams client. The Teams client health dashboard in the Teams admin center then reports the problem as Launch failure."
  - q: "Where do I find the reason for a launch failure?"
    a: "In the Teams admin center, select Teams client health and open the Issues view. The Insight column gives the likely reason, and the Suggested Actions column or the mitigation link on the details page points to guidance."
  - q: "Which clients does the launch failure data cover?"
    a: "The client health page says launch failures are supported for Windows (non-VDI) and Mac applications. The trend widget covers the last 28 days across all devices in the tenant."
  - q: "What do I do about a script error?"
    a: "Learn says to ask the user to sign out of Teams and sign back in."
  - q: "What if none of the fixes work?"
    a: "Learn says to contact Microsoft Support if the issue persists."
---

When the Microsoft Teams client opens a blank window and then closes, the Teams client health dashboard in the Teams admin center can report it as a launch failure and give an insight that names the likely reason. Microsoft Learn lists four insights and a fix for each: a blocked or unreachable Teams endpoint, a timeout waiting for the endpoint, a script error, or an unsupported operating system. This guide follows Learn's page on resolving Teams client launch failures and its page on the client health dashboard.

## What the failure looks like

Learn describes the symptom as a blank window that opens and then disappears immediately when a user starts the Teams app. A blank window gives the user nothing to report, which is why the dashboard matters: its Insight column names a potential cause.

## Open the dashboard

The client health page gives these steps:

1. Go to the Teams admin center.
2. Select **Teams client health** in the navigation pane.

The page shows a **Client health** widget with the trends for crashes and launch failures over the last 28 days for all devices in your tenant. Learn notes that this widget surfaces only health markers that affect end users and that administrators can act on. The page says both crash and launch failure data are supported for Windows (non-VDI) and Mac applications. My reading: launch failures on virtual desktops are therefore not covered by this view.

A **Top issues** widget counts devices with reported crashes, launch failures and update failures in the last seven and 28 days. Below it, a table lists each issue with these columns:

| Column | What it holds |
| --- | --- |
| Issue | The problem affecting devices and users in the tenant |
| Insights | Possible reasons behind the problem |
| Impacted devices, last seven days | Number and percentage of devices |
| Affected users, last seven days | Number and percentage of users |
| Impacted devices, last 28 days | Number and percentage of devices |
| Affected users, last 28 days | Number and percentage of users |
| Suggested Actions | Mitigation guidance to troubleshoot and fix the issue |

You can export the table to CSV, filter by issue or insight, and change the column settings.

## Read the details page

Select an issue and the details page shows the issue type, the insight and a mitigation link. Learn describes that link as pointing to Microsoft recommended mitigation and guidance. Below it, a table lists the affected users with these fields: client version, version status, ring, device, device crashes, device launch failures and the time stamp of the last refresh in UTC. You can export it, filter and search by version, and manage columns.

The client version, ring and version status are useful for one purpose: seeing whether the failures cluster on one version or ring. The page does not say this is their intended use, so treat it as my reading of the columns.

## The four insights and their fixes

Learn's launch failure page says to check the **Insight** column on the Issues tab, then lists these cases.

| Insight | Fix from Learn |
| --- | --- |
| Unable to navigate to Teams endpoint | Review the network configuration so a firewall or proxy does not block Teams endpoints |
| Timed out waiting for Teams endpoint | Same network review, and allow all Teams-related network requests |
| Teams application contains a script error | Ask the user to sign out and sign back in |
| Unsupported OS version | Update to a supported Windows or macOS version, as listed in the new Teams system requirements |

If the issue persists after these steps, Learn says to contact Microsoft Support.

### Network insights

Both network insights point at the same place: traffic between the client and Teams. Learn's wording is about the firewall or proxy configuration and about allowing all Teams-related requests. The page links to the Microsoft Teams section of Microsoft's page on Microsoft 365 URLs and IP address ranges for the endpoint list, and it does not describe how to test connectivity, so use your network team's tooling for that.

### Script error

The fix is a sign-out and sign-in, and Learn says nothing further. The page does not say why the script error occurs or how to clear any local data.

### Unsupported operating system

The fix is to update to a supported Windows or macOS version. Learn refers to the system requirements for new Teams rather than quoting version numbers on the page, so check the requirements page for the numbers that apply to your devices.

## What the pages do not say

The launch failure page is short, and neither page names required admin roles or licenses, how long data takes to appear, or how the data is collected. If you need those details, check the Teams admin center role documentation for your tenant before you rely on the dashboard.

## A practical routine

This section is my advice, not a Microsoft statement.

1. **Start with the dashboard, not the user.** Open Teams client health, filter the table to launch failures and read the Insight value before you touch a device.
2. **Group affected users by insight.** If most failures share a network insight, one firewall or proxy rule is the likely cause, and fixing it once is quicker than visiting machines.
3. **Check what changed.** If failures began on a given day, ask whether a proxy, firewall or security tool change went out around then. The dashboard shows counts for seven and 28 days, which helps date the start.
4. **Handle script errors one by one.** A sign-out and sign-in is cheap, so ask the user to try it first, as Learn says.
5. **Use the version columns.** Look at client version and ring in the details table to see whether failures cluster, and compare against devices that launch fine.
6. **Keep an inventory of unsupported operating systems.** Devices with the unsupported OS insight will keep failing until updated, so list them and plan the upgrade instead of repeating support calls.
7. **Export before you escalate.** Download the CSV so Microsoft Support receives the issue, insight and device data together, if you reach that step.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Resolve Microsoft Teams Client Launch Failures - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-administration/resolve-teams-client-launch-failures)
- [The Teams client health dashboard in the Teams admin center - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/teams-client-health)
