---
title: "Scheduled agent updates in Azure Virtual Desktop explained"
summary: "Scheduled agent updates is a host pool setting that confines non-critical updates of the Azure Virtual Desktop agent, the side-by-side stack and the Geneva Monitoring agent to one or two two-hour maintenance windows. It is off by default, it cannot stop critical updates, and it only works if the session hosts are running during the window."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scheduled-agent-updates, avd-agent]
keypoints:
  - "The setting covers three components together: the Azure Virtual Desktop agent, the side-by-side stack and the Geneva Monitoring agent. It does not apply to the initial installation of these components."
  - "You set one required and one optional maintenance window. Every window is two hours long, and the time zone is either one fixed zone for the pool or the local time of each session host."
  - "The setting is disabled by default and can be configured only for existing host pools, not while you create a new one."
  - "An update does not succeed if the session host is shut down or deallocated during the window. After four tries in a window the broker installs the update by force, and a critical update is installed by force at any time."
  - "Learn points to the WVDAgentHealthStatus table in Log Analytics and to event ID 3277 in the VM's Application log to tell a failed update from a host that is simply in a later flight."
faq:
  - q: "What does the Scheduled Agent Updates setting actually schedule?"
    a: "Updates of the Azure Virtual Desktop agent, the side-by-side stack and the Geneva Monitoring agent. Learn says the feature updates all three if any one of them needs an update, and that it does not apply to the initial installation of the components."
  - q: "Can a maintenance window guarantee that no agent update happens during business hours?"
    a: "No. Learn says the broker tries up to four times per maintenance window and then installs the update by force, and that a critical agent component update is installed by force for security purposes. Our reading is that a window is a preferred time for routine updates, not a hard block."
  - q: "Do I need to enable it for every host pool?"
    a: "Learn describes it as a host pool setting that is disabled by default, so it is configured per host pool. Whether you need it depends on whether the default flighting timing is acceptable for that pool's users."
---

Scheduled agent updates is a setting on an Azure Virtual Desktop host pool that confines non-critical updates of three agent components to one or two maintenance windows of two hours each. Without it, Microsoft's flighting system installs those updates whenever a new version reaches your subscription. This article explains what is covered, how the windows and time zones work, what the setting does not control and how to check that it is doing its job. The click path is a separate topic; here the focus is on how the feature behaves.

## What gets updated, and what the default looks like

Learn names three components that this feature updates: the Azure Virtual Desktop agent, the side-by-side stack and the Geneva Monitoring agent. The [Azure Virtual Desktop agent](/entity/avd-agent/) acts as the intermediate communicator between the service and the virtual machines. The side-by-side stack is required for users to securely establish reverse server-to-client connections. The Geneva Monitoring agent monitors the health of the agent.

Without the setting, the process works like this, according to Learn's agent overview. After the first installation, the agent regularly queries the service to see whether a newer version of the agent, stack or monitoring agent exists. If one does, the flighting system installs it automatically. New versions are deployed in five-day periods to all Azure subscriptions, and these periods are called flights. It takes 24 hours for all VMs in a single broker region to receive the update in a flight, so hosts in one pool can update at different times, and hosts in different regions can update on different days within the five days.

The what's-new page for the agent adds the wider picture: new versions are rolled out progressively, validation environments see them first, and the whole rollout can take several weeks across all environments. Not every validation version reaches production, because updates are repacked and given a new version number before they go to production. A [validation host pool](/entity/avd-validation-environment/) therefore tells you about changes early, while scheduled agent updates tells the service when your production hosts may take them. The two address different questions.

Learn gives the typical effect of an update on a new VM: it normally lasts two to three minutes and should not cause the VM to lose connection or shut down. The page does not give a figure for hosts that already carry user sessions, so do not assume one.

## What the setting changes

Scheduled agent updates is a [host pool](/entity/avd-host-pool/) setting and is disabled by default. Learn states the consequence directly: unless you enable it, the agent can be updated at any time by the agent update flighting service. Once it is enabled, the agent installs updated components only during the maintenance windows you specify.

Four boundaries follow from the Learn text:

- **Existing pools only.** You can configure the feature only for existing host pools, not while creating a new one.
- **No effect on first install.** When you install the agent on a VM, it installs the side-by-side stack and the Geneva Monitoring agent regardless of any maintenance window. Only non-critical updates after installation wait for a window.
- **All three components move together.** The feature updates the three components if any one or more of them needs an update.
- **Pool-wide.** Because it is a host pool setting, the time zone and windows apply to all session hosts in the pool.

Learn also says that host pools with the feature enabled receive the agent update after the agent has been fully flighted to production. Our reading: enabling the setting does not bring an update forward; it moves the install of an update that has already reached production into your window.

## Maintenance windows and time zones

The rules for windows, as Learn lists them:

- You must specify at least one maintenance window. The second is optional, and having two gives the components another opportunity to update if the first attempt is unsuccessful.
- All windows are two hours long, to cover the case where all three components must be updated at once. A window on Saturday at 9:00 AM PST means updates happen between 9:00 AM and 11:00 AM PST.
- In the portal you pick a day and a time for each window. The REST API describes the same data: the `agentUpdate` object of a host pool has a `type` (`Default` or `Scheduled`), `maintenanceWindows` with a day of the week and an hour from 0 to 23, a `maintenanceWindowTimeZone` and a `useSessionHostLocalTime` flag. In the REST reference the window length is stated as two hours. Our reading: a window is a weekly slot, a day and an hour, that repeats.

Time zone choice matters more than it looks. By default **Use session host local time** is not selected, and then you must specify one time zone for all windows. That suits pools where hosts or users share a time zone. If you select it, each session host updates in its own local time zone. Learn's example: hosts in West US (Pacific) and East US (Eastern), with a window on Saturday at 9:00 PM. With the local-time option, each group updates at 9:00 PM in its own zone. Without it, and with Central Standard Time chosen, all hosts update at 9:00 PM Central.

One detail catches people out. Learn says the local time zone of VMs created in the Azure portal is UTC by default. If you rely on local session host time, check what zone your hosts actually carry. Learn points to the `Get-TimeZone` cmdlet to list available time zones on a VM and `Set-TimeZone` to change the VM's zone.

## What happens when an update does not go through

This is the section that decides whether the setting protects your users. Learn describes three rules:

1. **Hosts must be running.** The update does not succeed if the session host VM is shut down or deallocated at the scheduled time. Learn tells you to make sure all session hosts are on during the window.
2. **Four tries, then force.** The broker attempts the update during each window up to four times. After the fourth try it installs the update by force. Learn gives the reason: it allows time for retries if an update is unsuccessful, and it prevents hosts from running outdated component versions.
3. **Critical updates are forced.** If a critical agent component update is available, the broker installs it by force for security purposes.

Our reading of the three rules together: the windows control timing for routine updates, but they are not a guarantee that nothing changes outside them. If a host keeps missing its window, for example because it is deallocated, the forced install can land at a time you did not choose. The Learn page does not say when a forced install happens, so do not plan around a specific moment.

### Interaction with autoscale

The first rule matters most for pools that use [autoscale](/entity/avd-scaling-plan/). A scaling plan can deallocate hosts after hours, as the [power management](/entity/avd-power-management-autoscaling/) schedules describe. A window placed in a phase where the plan has turned hosts off meets rule 1. Our reading: place at least one window in a period when your plan keeps the affected hosts running, or check that the minimum percentage of hosts is high enough to cover the pool at that time. Learn does not describe this combination; it is a consequence of the two documented behaviours, so test it on a non-production pool first.

## Checking that it works

Learn's diagnostics guide uses Log Analytics. You create a workspace, send diagnostics to it, and query the `WVDAgentHealthStatus` table. Query results cover the last 30 days. The guide gives two queries, both filtered on `SessionHostName`:

- The first projects `TimeGenerated`, `AgentVersion`, `SessionHostName`, `LastUpgradeTimeStamp`, `UpgradeState` and `UpgradeErrorMsg`, sorts by `TimeGenerated` descending and takes the newest row. It shows the current agent version and the state of the last upgrade.
- The second summarizes the first row per `AgentVersion` in ascending time order. Learn says to use it to confirm that updates are occurring or that Scheduled Agent Updates is working.

The guide also notes that `NewPackagesAvailable` shows data only if Scheduled Agent Updates is enabled. If an update fails, the guide says the session host may have been turned off during the update, in which case you turn it back on.

On the VM itself, the agent overview names one signal. In Event Viewer, under Windows Logs and Application, an event with ID 3277 means the agent update did not work. If you do not see it, Learn says the VM is in a different flight and will be updated later. That distinction is useful. Our reading: a host that is still on the old version shortly after a flight began is not necessarily broken, because Learn says VMs in one pool can receive the update at different times.

## Deciding whether to enable it

The feature adds a dependency (hosts running in the window) in exchange for predictability. A rough way to decide, based only on the behaviours above:

| Situation | Reading |
|---|---|
| Hosts run around the clock or on a schedule that includes a fixed quiet slot | A weekly window is easy to satisfy. The setting fits. |
| Hosts are deallocated by autoscale or by hand outside business hours | Plan a window inside a running period, or accept that the default flighting applies. |
| Users work across several time zones | Decide between one fixed zone and local session host time; test with one host per zone. |
| You need to see changes before production | A validation host pool addresses this; the setting does not. |

A few limits to keep in view. Scheduled agent updates covers only the three agent components. Learn's agent overview says the agent update is not connected to Azure Virtual Desktop infrastructure build updates, and nothing on the feature page ties it to Windows updates of the guest operating system. It therefore cannot replace a patching plan. Our reading: treat it as one control among several, next to your [session host](/entity/avd-session-host/) patching approach.

The scheduled agent updates page carries no preview label. The scheduled agent updates page shows a last-updated date of 20 June 2025, while the agent what's-new page was updated in September 2026. Check the live page before relying on details such as the number of windows.

The practical order is: confirm your hosts are running during the intended window, choose the time zone mode, enable the setting, then watch the next flight with the diagnostics queries. The steps themselves are covered in a companion how-to.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Scheduled Agent Updates for Azure Virtual Desktop host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates)
- [Microsoft Learn: Scheduled Agent Updates diagnostics guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics)
- [Microsoft Learn: Getting started with the Azure Virtual Desktop agent (agent update process)](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview)
- [Microsoft Learn: What's new in the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent)
- [Microsoft Learn: Create a validation host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-validation-host-pool)
- [Microsoft Learn: Host Pools REST API, AgentUpdateProperties](https://learn.microsoft.com/en-us/rest/api/desktopvirtualization/host-pools/get?view=rest-desktopvirtualization-2024-04-03)
