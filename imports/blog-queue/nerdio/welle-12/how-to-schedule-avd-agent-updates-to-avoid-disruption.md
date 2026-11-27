---
title: "How to schedule AVD agent updates to avoid disruption"
summary: "To keep non-critical Azure Virtual Desktop agent updates out of working hours, enable Scheduled Agent Updates per host pool, set windows when hosts are on and check the first run in Log Analytics."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [avd-scheduled-agent-updates, avd-agent]
keypoints:
  - "A window only works if the session hosts are running in it. With autoscale, give the window day a scaling plan schedule that keeps the hosts on, then confirm it on the first run."
  - "Each window is two hours long, set as a day of the week and an hour from 0 to 23. You need one window and may add a second on another day or hour."
  - "Choose between one fixed Windows time zone for the pool and each host's own local time. VMs created in the Azure portal default to UTC, so check what your hosts actually use."
  - "The windows belong to one host pool each. You stagger several pools by giving them different days or hours; Learn describes no setting that staggers hosts inside a pool."
  - "Learn documents the portal steps. For scripts, the REST update takes an agentUpdate body; the PowerShell module lists four parameters without an example, the Azure CLI none."
faq:
  - q: "Which day and hour should I pick for the window?"
    a: "One when users are away and the hosts are running. Learn gives no recommended time; it only says the window is two hours long and that the hosts must be on. Pick the quietest slot in your own session data, then make sure autoscale keeps the hosts on at that time."
  - q: "Can I check the result without waiting for the window?"
    a: "Not before an update is available. The setting moves the install of an available update into the window, so a run without a new agent version changes nothing. After a window, read the agent version and upgrade state of a pilot host in the WVDAgentHealthStatus table; a new update shows up as a changed version. The agent what's new page on Learn lists the current versions."
  - q: "Do I have to set this up for every host pool?"
    a: "Yes. Learn describes Scheduled Agent Updates as a host pool setting, so each pool has its own windows and time zone. The same windows on several pools mean the pools update at the same time, so decide deliberately whether that is what you want."
---

To keep routine Azure Virtual Desktop agent updates out of working hours, enable Scheduled Agent Updates on each host pool and give it one or two two-hour windows in which the session hosts are running. This guide is the practical companion to the [explainer on scheduled agent updates](https://www.m365.fm/entity/avd-scheduled-agent-updates/), which covers what the feature does and what it does not control.

## Before you start: what to have ready

Per Learn, the feature can be configured only for existing host pools, and each window is two hours long. The setting belongs to the [host pool](https://www.m365.fm/entity/avd-host-pool/), so the time zone and windows apply to all its session hosts.

Collect for each pool the time zone its hosts use, the hours when users are signed in, and any scaling plan schedule.

## Step 1: Make sure the hosts are on during the window

Learn says the update does not succeed if the session host is shut down or deallocated during the window, and its glossary says autoscale deallocates and stops a VM when it shuts it down. The numbered settings below are for pooled host pools with power management autoscaling; personal host pools and dynamic autoscaling follow them.

Learn's autoscale pages (scenarios, glossary, create and assign a scaling plan) describe these settings:

1. A scaling plan can have several schedules, for example for weekdays and the weekend. Each has a **Repeat on** field for its days.
2. Unselected days inherit the last off-peak parameters until the next ramp-up phase. A plan with one Monday to Friday schedule keeps the Friday off-peak configuration until Monday's ramp-up, so, our reading, hosts that autoscale deallocated on Friday evening are not brought back for a Saturday window.
3. In the ramp-up phase, **Minimum percentage of hosts** is the percentage of session hosts you want to always remain on in that phase. The ramp-down tab has a field of the same name. The peak and off-peak tabs list no such field, and the glossary defines the value as the lowest percentage that must be on for each phase, so read those phases back on a test pool.
4. Pooled autoscale does not turn off session hosts in the ramp-up phase (scenarios page, scenario 2).
5. A scaling plan operates only in its own configured time zone, and the start times you enter must be in that zone.

Our reading: for a Saturday window, add a Saturday schedule whose ramp-up starts shortly before the window, set the minimum percentage to 100 so every host stays on, and keep the whole two hours inside ramp-up, which ends where peak hours start. Ramp-down has its own minimum, so a window that runs into it is not covered by the ramp-up value. Learn says autoscale does not start or stop hosts that carry the exclusion tag, so our reading is that a tagged host that is off stays off; start it yourself. Without autoscale, check that no shutdown routine or cost script switches the hosts off.

For personal host pools, Learn's ramp-up tab has **VMs to start**: **Assigned VMs only** starts desktops with an assigned user, **Assigned and unassigned VMs** starts all of them. The disconnect and sign-out settings can deallocate or hibernate VMs in each phase. Our reading: set them to do nothing in the phases the window touches; Learn does not say how a hibernated host treats the update. Dynamic autoscaling also creates and deletes session hosts, and its ramp-up fields **Minimum percentage of active hosts** and **Minimum host pool size** carry over to peak. Our reading: a deleted host cannot take the update, so test the first run on one pool.

Learn says that in a pooled host pool [Start VM on Connect](https://www.m365.fm/entity/avd-start-vm-on-connect/) powers on a VM only when none are on, and further VMs only when the first reaches the session limit. Our reading: it does not bring every host up for a window.

## Step 2: Choose the day, the hour and the second window

The REST API shows what is stored: each window is a day of the week and an hour from 0 to 23, and the `maintenanceWindows` description says windows are two hours long. A window at hour 6 on Saturday therefore covers 06:00 to 08:00 in the chosen time zone.

Guidelines based on Learn's rules:

- **Pick the window from your own data.** Learn gives no recommended time. Use the hours when users are signed in and leave a margin.
- **Make the second window a real retry.** Learn says the optional second window gives the components another chance if the first attempt fails. Put it on another day or hour, with the hosts on.
- **Do not treat the window as a guarantee.** Learn says the broker tries up to four times in each window and then installs the update by force, and that a critical agent component update is installed by force for security purposes. Learn does not say when a forced install happens, so do not rely on a specific moment.

## Step 3: Pick the time zone mode

The portal offers two options, and the REST API stores them as `maintenanceWindowTimeZone` and `useSessionHostLocalTime`.

| Situation | Option | Check before you rely on it |
|---|---|---|
| All hosts and users in one time zone | Specify one time zone for the windows | The zone must be a Windows time zone ID as .NET defines it; the Learn REST example uses `Alaskan Standard Time` |
| Hosts and users spread over several zones | Use session host local time | Each host runs the window in its own local time; the REST reference says the time zone must be set when this flag is true, which the portal text does not say, so test it |
| Hosts created in the Azure portal | Either, but verify | Learn says VMs created in the Azure portal default to UTC |

Our reading: with the local time option, a host still on UTC would take the window in UTC, which can fall in a user's working day elsewhere. On a host, `Get-TimeZone` shows the current zone and `Get-TimeZone -ListAvailable` lists the zones that exist. Learn names `Set-TimeZone` for changing a VM's time zone; our reading: that changes the guest's clock for everything, so a fixed pool-wide zone is the smaller change. Learn does not say how daylight saving time is handled, so check the hour after the clocks change.

## Step 4: Enable the setting

The Learn page documents the Azure portal path:

1. Open **Azure Virtual Desktop** in the Azure portal and select **Host pools**, then your host pool.
2. Select **Scheduled Agent Updates**. The feature is disabled by default, so select the **Scheduled agent updates** checkbox.
3. Choose **Use local session host time zone** or specify a time zone.
4. Select a day and time for the **Maintenance window**. Add a second window if you want one.
5. Select **Apply**.

For [Nerdio Manager](https://www.m365.fm/entity/nerdio/), Nerdio's help describes the same setting after you locate the host pool, in its action menu under **Settings**, then **AVD**, with the toggle **Use Scheduled AVD Agent Update**, a time zone, **Use local session host time zone** and an optional additional maintenance window. Check which label your version shows.

For scripts, the documentation is uneven. The REST host pool update (reference version 2024-04-03) accepts an `agentUpdate` object; the Learn sample sets `type` to `Scheduled`, `useSessionHostLocalTime` to `false`, a `maintenanceWindowTimeZone` and two windows, Friday at hour 7 and Saturday at hour 8. The `Update-AzWvdHostPool` reference lists `-AgentUpdateType`, `-AgentUpdateMaintenanceWindow`, `-AgentUpdateMaintenanceWindowTimeZone` and `-AgentUpdateUseSessionHostLocalTime` without an example or accepted type values. The `az desktopvirtualization hostpool update` reference lists no agent update parameter. Test on one pool and read the setting back in the portal.

## Step 5: Stagger several host pools

Identical windows mean every pool updates at the same time. Learn describes a window as pool-wide and gives no per-host stagger, so spacing is a per-pool decision. Our reading: once an update has reached production, the next window of each pool decides when it installs, so the order of the windows can serve as a rollout order.

An example for four pools, built only from the documented window rules:

| Pool | Role | Window (pool time zone) | Reason |
|---|---|---|---|
| Pilot | Small group of volunteers | Saturday, hour 6 | First to take the update |
| Production A | Largest group | Sunday, hour 6 | A day to read the pilot result |
| Production B | Second region or department | Sunday, hour 9 | Does not overlap A's two-hour window |
| Validation | Sees new agent versions before production | Leave the setting off | Our reading, explained below |

The last row is our reading of two statements. Learn says pools with the setting enabled receive the agent update after it has been fully flighted to production. The agent what's new page says Microsoft monitors the rollout in validation environments first, which can take several weeks, and repacks validation versions with a new version number before production. Together they suggest that a [validation host pool](https://www.m365.fm/entity/avd-validation-environment/) with the setting enabled would take an update only at the production stage, so we would leave it off there.

## Step 6: Diagnose the first run

The queries and the event 3277 caveat are in the explainer.

- **Convert the clock.** The `WVDAgentHealthStatus` reference says `TimeGenerated` is in UTC, so convert your window before comparing it with `LastUpgradeTimeStamp`, the time recorded when the upgrade status changed.
- **Look at the state values you actually have.** The table reference describes `UpgradeState` only as the last known state from a previous update and lists no values. Summarize `Status` and `UpgradeState` for your hosts to see which values appear.
- **Read the error column's contents.** The reference text for `UpgradeErrorMsg` repeats the description of `SxSStackVersion`.

When a host did not update, work from the symptom:

| Symptom | Documented cause or check |
|---|---|
| Host was off during the window | Learn's diagnostics guide says to turn the host back on; then fix the power schedule from step 1 |
| Host shows **Upgrading** or **Unavailable** | The agent or stack did not install. The troubleshooting guide reinstalls the side-by-side stack with `qwinsta.exe` checks, and has a clean reinstall as the last resort |
| Event 3389 with `MissingMethodException: Method not found` | The agent reverted to an earlier version; the guide names .NET Framework below 4.7.2 and tells you to upgrade it |
| Event 3277 with `DownloadMsiException` or `InstallMsiException` | Not enough disk space for the agent, or the installer is already running, or group policy blocks `msiexec.exe` |
| Update landed outside the window | Learn does not say whether a forced install stays inside the window; compare with the four-try rule and the critical-update rule in step 2 |

The troubleshooting guide names the event sources **WVD-Agent-Updater** and **MsiInstaller** in Event Viewer. Learn gives two to three minutes for an update on a new VM and no figure for hosts that carry sessions, so test one such host first.

## Sources

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
