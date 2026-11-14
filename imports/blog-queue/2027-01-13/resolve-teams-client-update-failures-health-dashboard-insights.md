---
title: "Teams Will Not Update: Resolve Client Update Failures Using Health Dashboard Insights"
summary: "When the Teams client fails to update, the Teams client health dashboard names an insight such as MSIX GPO block or Delivery Optimization disabled. Match the insight to the fix Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [teams, teams-admin-center]
keypoints:
  - "Update failures show up as Update failure in the Teams client health dashboard, and the Insight column on the Issues tab points to the likely cause."
  - "Learn lists seven insights, from MSIX GPO block to Network failure - External DNS, each with its own resolution."
  - "For an MSIX GPO block, Microsoft says to bulk deploy the Teams client to the devices."
  - "If the cause stays unclear, force an update with the Add-AppxPackage command Learn provides, then collect logs for Microsoft Support."
  - "The article covers failures caused by Group Policy, network connectivity or Delivery Optimization settings."
faq:
  - q: "Where do I find why Teams failed to update?"
    a: "Microsoft Learn says that update failures are categorized as Update failure in the Teams client health dashboard in the Teams admin center. Admins can check the Insight column on the Issues tab to find a potential cause. The suggested actions column gives mitigation guidance."
  - q: "What does the MSIX GPO block insight mean?"
    a: "Learn says this insight indicates that the update failure is caused by specific Group Policy settings. The documented fix is to bulk deploy the Teams client to the devices, following the Learn article on bulk installing the new Teams client."
  - q: "What if Delivery Optimization is the problem?"
    a: "For the insight DO service disabled by admin, Learn says to make sure Delivery Optimization is enabled and configured correctly. It links to its Delivery Optimization article for Microsoft 365 Apps updates."
  - q: "How do I force a Teams update on one device?"
    a: "Learn gives a PowerShell command for the Network failure - External DNS insight: Add-AppxPackage with the Microsoft fwlink address, the ForceUpdateFromAnyVersion switch and the ForceTargetApplicationShutdown switch. It closes the Teams app and forces an update to the latest version."
  - q: "Who should I contact if the steps do not help?"
    a: "Learn says to collect Windows diagnostic logs and, if the update works after the forced update, also Teams diagnostic logs. Then contact Microsoft Support, using the Contact Support menu option in the Help pane of the Teams admin center for the second case."
---

When Teams does not update, start in the Teams admin center. The Teams client health dashboard reports the problem as **Update failure** and gives an insight that points to the likely cause. Microsoft Learn lists the insights and a resolution for each one. Match your insight to the table below. If no insight fits or the fix fails, force an update on one device, collect logs and open a support case.

## Find the insight

1. Go to the Teams admin center.
2. Select **Teams client health** in the navigation pane.
3. Open the **Issues** tab and look at the **Insight** column for the update failure entry.

According to the Learn page on the dashboard, the table of issues shows the issue, the insight, the number and percentage of impacted devices and affected users over seven and 28 days, and suggested actions. The dashboard's top issues widget includes device reported update failures, with counts for the last seven and 28 days. The details page for an issue also shows the client version, version status, ring and device for affected users.

The update failure article says it explains how to resolve failures caused by Group Policy, network connectivity or Delivery Optimization settings.

## Insights and what Learn says to do

| Insight | Documented resolution |
| --- | --- |
| MSIX GPO block | Specific Group Policy settings cause the failure. Bulk deploy the Teams client to the devices. |
| Network failure data corruption - External | See the Windows Update error 0x8007000D entry in Learn's common Windows Update errors article. |
| Network failure - Connection time out | See the Windows Update error 0x80072EE2 entry in the same article. |
| Network/Connectivity failure, external | See Learn's article on Windows Update error 0x80072EFE with cipher suite configuration. |
| DO service disabled by admin | Make sure Delivery Optimization is enabled and configured correctly. |
| Network failure or server not supporting range request | Make sure the device meets the system requirements for the new Teams client. |
| Network failure - External DNS | Check for network connection issues and fix them. If Teams still cannot update, force an update and collect logs, as below. |

I read the update failure article. I did not read the linked Windows Update error pages, so follow those links for the steps behind the three network insights.

## What the insights tell you

Three of the network insights send you to Windows Update error pages rather than to Teams-specific steps. In my experience that means the network path matters more than the Teams client itself. Practically, if the insight is a network or DNS one, test the same device against other apps that download from the internet and check whether a proxy, firewall or TLS setting is involved.

## Fix 1: MSIX GPO block

If the insight is MSIX GPO block, Learn says the cause is specific Group Policy settings. The documented fix is to bulk deploy the Teams client. The article links to its page on bulk installing the new Teams client. Use that page for the exact commands, since I did not read it for this article.

## Fix 2: Delivery Optimization disabled

For DO service disabled by admin, check that Delivery Optimization is enabled and configured correctly. If your organization turned the service off by policy, a device that depends on it for Teams updates can fail. Review that policy together with your endpoint management team.

## Fix 3: Range request and system requirements

The insight Network failure or server not supporting range request has a short resolution in Learn. Make sure the device meets the system requirements for the new Teams client. Also look at the network path. A proxy or caching layer in between might be involved. That second point is my suggestion, not Learn text.

## Fix 4: Force an update and collect logs

Learn gives these steps for the External DNS insight, and they also work as a general fallback when the cause stays unclear:

1. Fix any network connection issues first.
2. On the device that runs the outdated Teams client, open Windows PowerShell and run the following command. It closes Teams and forces an update to the latest version.

   ```powershell
   Add-AppxPackage https://go.microsoft.com/fwlink/?linkid=2196060 -ForceUpdateFromAnyVersion -ForceTargetApplicationShutdown
   ```

3. If Teams does not update successfully, Learn says the cause might be the Windows version on the device. Collect Windows diagnostic logs and contact Microsoft Support.
4. If Teams does update successfully, the cause might be the automatic update process. Collect Teams diagnostic logs and Windows diagnostic logs, and contact Microsoft Support by using the **Contact Support** menu option in the **Help** pane of the Microsoft Teams admin center.

Warn users before you run the command, because it shuts the Teams app down.

## A simple working order

This order is my advice.

1. Read the insight and the number of affected devices. A single device and a whole site call for different responses.
2. If many devices share one insight, fix the shared cause: a Group Policy setting, a Delivery Optimization policy or a network rule.
3. If one device fails, run the forced update and test again.
4. Keep the Teams and Windows logs for support.

## Limits of this article

Learn's update failure page lists the insights above and says that if the issue persists after the resolution, you should contact Microsoft Support. It does not give versions, timelines or retry counts, so I do not give any either.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Resolve Teams Client Update Failures - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-administration/resolve-teams-client-update-failures)
- [The Teams client health dashboard in the Teams admin center - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/teams-client-health)
