---
title: "How to schedule AVD agent updates to avoid disruption"
summary: "To keep non-critical Azure Virtual Desktop agent updates out of working hours, enable Scheduled Agent Updates on each host pool, place the windows where the session hosts are powered on, and check the first run in Log Analytics. This guide covers window planning, time zones, staggering several host pools and diagnosing a run that went wrong."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scheduled-agent-updates, avd-agent]
keypoints:
  - "A window only works if the session hosts are running in it. With autoscale, give the window day a scaling plan schedule that keeps the hosts on, then confirm it on the first run."
  - "Each window is two hours long, set as a day of the week and an hour from 0 to 23. You need one window and may add a second on another day or hour."
  - "Choose between one fixed Windows time zone for the pool and each host's own local time. VMs created in the Azure portal default to UTC, so check what your hosts actually use."
  - "The windows belong to one host pool each. You stagger several pools by giving them different days or hours; Learn describes no setting that staggers hosts inside a pool."
  - "Learn documents the portal steps. For scripts, the REST host pool update takes an agentUpdate body, the Az.DesktopVirtualization module lists four agent update parameters without an example, and the Azure CLI host pool update reference lists none."
faq:
  - q: "Which day and hour should I pick for the window?"
    a: "One when users are away and the hosts are running. Learn gives no recommended time; it only says the window is two hours long and that the hosts must be on. Pick the quietest slot in your own session data, then make sure autoscale keeps the hosts on at that time."
  - q: "Can I check the result without waiting for the window?"
    a: "Only after an update exists. The setting moves the install of an available update into the window, so there is nothing to see until a new agent version has reached production. Then read the agent version and upgrade state of a pilot host in the WVDAgentHealthStatus table after the window. The agent what's new page on Learn lists the current versions."
  - q: "Do I have to set this up for every host pool?"
    a: "Yes. Learn describes Scheduled Agent Updates as a host pool setting, so each pool has its own windows and time zone. The same windows on several pools mean the pools update at the same time, so decide deliberately whether that is what you want."
---

To keep routine Azure Virtual Desktop agent updates out of working hours, enable Scheduled Agent Updates on each host pool and give it one or two two-hour windows in which the session hosts are running. This guide is the practical companion to the [explainer on scheduled agent updates](/entity/avd-scheduled-agent-updates/), which covers what the feature does and what it does not control. Behaviours are restated here only where they affect a decision.

## Before you start: what to have ready

Per Learn, the feature can be configured only for existing host pools, and each maintenance window is two hours long. The setting belongs to the [host pool](/entity/avd-host-pool/), so the time zone and windows apply to all its session hosts.

Collect for each pool the time zone its hosts use, the hours when users are signed in, and the schedule of any scaling plan that powers the hosts on and off.

## Step 1: Make sure the hosts are on during the window

Learn says the update does not succeed if the session host is shut down or deallocated during the window, and its autoscale glossary says that when autoscale shuts down a VM it deallocates and stops it. A deallocated host cannot take the update.

Learn's autoscale pages (scenarios, glossary, and create and assign a scaling plan) describe the settings you can use to handle this:

1. A scaling plan can have one or multiple schedules, for example different schedules for weekdays and the weekend. Each schedule has a **Repeat on** field for the days it applies to.
2. Unselected days inherit the last off-peak parameters until the next ramp-up phase. A plan with one Monday to Friday schedule keeps the Friday off-peak configuration until Monday's ramp-up, so, our reading, hosts that autoscale deallocated on Friday evening are not brought back for a Saturday window.
3. In the ramp-up phase, **Minimum percentage of hosts** is the percentage of session hosts you want to always remain on in that phase.
4. A scaling plan operates only in its own configured time zone, and the start times you enter must be in that zone.

Our reading: for a Saturday window, add a Saturday schedule whose ramp-up starts shortly before the window and whose minimum percentage keeps every host that needs the update running. For the whole pool, that is all of them. Learn does not say how long hosts started in ramp-up stay on through the following phases; the first run in step 6 is the test. Without autoscale, check that no manual shutdown routine or cost script switches the hosts off.

Learn says [Start VM on Connect](/entity/avd-start-vm-on-connect/) powers on a VM when a user connects. In a pooled host pool it powers one on only when none are turned on, and further VMs only when the first reaches the session limit. Our reading: it does not bring every host up for a window, so do not use it as a substitute for the schedule above.

## Step 2: Choose the day, the hour and the second window

In the portal you pick a day and a time. The REST API shows what is stored: each window is a day of the week (Monday to Sunday) and an hour from 0 to 23, and the `maintenanceWindows` description says windows are two hours long. A window at hour 6 on Saturday therefore covers 06:00 to 08:00 in the chosen time zone.

Practical guidelines, based on Learn's rules:

- **Pick the window from your own data.** Learn gives no recommended time. Use the hours when users are actually signed in and leave a margin around the two hours.
- **Make the second window a real retry.** Learn says the optional second window gives the components another chance if the first attempt is unsuccessful. Put it on another day or hour, and make sure the hosts are on then too.
- **Do not treat the window as a guarantee.** Learn says the broker tries up to four times in each window and then installs the update by force, and that a critical agent component update is installed by force for security purposes. Learn does not say when a forced install happens, so plan for it instead of relying on a specific moment.

## Step 3: Pick the time zone mode

The portal offers two options, and the REST API stores them as `maintenanceWindowTimeZone` and `useSessionHostLocalTime`.

| Situation | Option | Check before you rely on it |
|---|---|---|
| All hosts and users in one time zone | Specify one time zone for the windows | The zone must be a Windows time zone ID as .NET defines it; the Learn REST example uses `Alaskan Standard Time` |
| Hosts and users spread over several zones | Use session host local time | Each host runs the window in its own local time; the REST reference says the time zone must be set when this flag is true, which the portal text does not say, so test it |
| Hosts created in the Azure portal | Either, but verify | Learn says the local time zone of VMs created in the Azure portal is UTC by default |

Learn says VMs created in the Azure portal default to UTC. Our reading: with the local time option, a host that still runs on UTC would take the window in UTC, which can fall in the middle of a user's day in another part of the world. On a host, `Get-TimeZone` shows the current zone and `Get-TimeZone -ListAvailable` lists the zones that exist. Learn names `Set-TimeZone` as the way to change the VM's time zone. Our reading: changing a guest's clock affects more than updates, so a fixed pool-wide zone is the smaller change. Learn does not say how daylight saving time is handled for a window, so check the hour after the clocks change.

## Step 4: Enable the setting

The Learn page documents the Azure portal path:

1. Open **Azure Virtual Desktop** in the Azure portal and select **Host pools**, then your host pool.
2. Select **Scheduled Agent Updates**. The feature is disabled by default, so select the **Scheduled agent updates** checkbox.
3. Choose **Use local session host time zone** or specify a time zone.
4. Select a day and time for the **Maintenance window**. Add a second window if you want one.
5. Select **Apply**.

For [Nerdio Manager](/entity/nerdio/), Nerdio's help describes the same setting after you locate the host pool, in its action menu under **Settings**, then **AVD**, with the toggle **Use Scheduled AVD Agent Update**, a time zone, **Use local session host time zone** and an optional additional maintenance window. Check which label your version shows.

If you manage many pools by script, the documentation is uneven. The REST API's host pool update (reference version 2024-04-03) accepts an `agentUpdate` object; the Learn sample sets `type` to `Scheduled`, `useSessionHostLocalTime` to `false`, a `maintenanceWindowTimeZone` and two windows, one on Friday at hour 7 and one on Saturday at hour 8. The `Update-AzWvdHostPool` reference lists `-AgentUpdateType`, `-AgentUpdateMaintenanceWindow`, `-AgentUpdateMaintenanceWindowTimeZone` and `-AgentUpdateUseSessionHostLocalTime`, but it gives no example of them and does not list the accepted values for the type. The `az desktopvirtualization hostpool update` reference lists no agent update parameter. Test a script on one pool and read the setting back in the portal.

## Step 5: Stagger several host pools

Every pool has its own windows, so identical windows mean every pool updates at the same time. Learn describes a window as pool-wide and gives no per-host stagger inside a pool, so spacing is a per-pool decision. Our reading: once an update has reached production, the next window of each pool decides when it installs, so the order of the windows can serve as a rollout order.

An example for four pools, built only from the documented window rules:

| Pool | Role | Window (pool time zone) | Reason |
|---|---|---|---|
| Pilot | Small group of volunteers | Saturday, hour 6 | First to take the update |
| Production A | Largest group | Sunday, hour 6 | A day to read the pilot result first |
| Production B | Second region or department | Sunday, hour 9 | Does not overlap A's two-hour window |
| Validation | Sees new agent versions before production | Leave the setting off | Our reading, explained below |

The last row is our reading, built from two statements. Learn says pools with the setting enabled receive the agent update after it has been fully flighted to production. The agent what's new page says Microsoft monitors the rollout in validation environments first, that the rollout can take several weeks, and that validation versions are repacked with a new version number before production. Together they suggest that a [validation host pool](/entity/avd-validation-environment/) with the setting enabled would take an update only at the production stage and lose its earlier view, so we would leave the setting off there.

Our reading: if your pools are spread over several zones and use local session host time, the same day and hour already fall at different real times by geography, as in Learn's Saturday 9:00 PM example.

## Step 6: Diagnose the first run

The queries and the event 3277 caveat are in the explainer. This section reads the result against the window.

- **Convert the clock.** The `WVDAgentHealthStatus` reference says `TimeGenerated` is in UTC. Convert your window before comparing it with `LastUpgradeTimeStamp`. The reference defines that column as the time recorded when the upgrade status changed.
- **Look at the state values you actually have.** The table reference describes `UpgradeState` only as the last known state from a previous update and lists no values. Summarize `Status` and `UpgradeState` for your hosts to see which values appear.
- **Read the error column's contents.** The reference text for `UpgradeErrorMsg` repeats the description of `SxSStackVersion`, so do not rely on its description.

When a host did not update, work from the symptom:

| Symptom | Documented cause or check |
|---|---|
| Host was off during the window | Learn's diagnostics guide says to turn the host back on; then fix the power schedule from step 1 |
| Host shows **Upgrading** or **Unavailable** | The agent or stack did not install. The troubleshooting guide reinstalls the side-by-side stack with `qwinsta.exe` checks, and has a clean reinstall as the last resort |
| Event 3389 with `MissingMethodException: Method not found` | The agent reverted to an earlier version; the guide names .NET Framework below 4.7.2 and tells you to upgrade it |
| Event 3277 with `DownloadMsiException` or `InstallMsiException` | Not enough disk space for the agent, or the installer is already running, or group policy blocks `msiexec.exe` |
| Update landed outside the window | Learn does not say whether a forced install stays inside the window; compare with the four-try rule and the critical-update rule in step 2 |

The troubleshooting guide also names the event sources **WVD-Agent-Updater** and **MsiInstaller** in Event Viewer. Learn gives two to three minutes for an update on a new VM and no figure for hosts that carry sessions, so test one such host before a window overlaps work.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Scheduled Agent Updates for Azure Virtual Desktop host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates)
- [Microsoft Learn: Scheduled Agent Updates diagnostics guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics)
- [Microsoft Learn: Getting started with the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Configure Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Autoscale scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Agent issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent)
- [Microsoft Learn: Host Pools REST API, Update](https://learn.microsoft.com/en-us/rest/api/desktopvirtualization/host-pools/update?view=rest-desktopvirtualization-2024-04-03)
- [Microsoft Learn: Update-AzWvdHostPool](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdhostpool)
- [Microsoft Learn: az desktopvirtualization hostpool](https://learn.microsoft.com/en-us/cli/azure/desktopvirtualization/hostpool?view=azure-cli-latest)
- [Microsoft Learn: WVDAgentHealthStatus table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdagenthealthstatus)
- [Microsoft Learn: Get-TimeZone](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-timezone)
- [Microsoft Learn: What's new in the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent)
- [Nerdio Manager help: Schedule Updates for AVD Agent](https://nmehelp.getnerdio.com/hc/en-us/articles/26124375859853)
