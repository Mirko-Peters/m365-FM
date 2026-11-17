---
title: "Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained"
summary: "An Azure Virtual Desktop scaling plan schedule is split into four phases, and each phase has its own settings and its own rules for starting and stopping session hosts. This article walks through the parameters of each phase for pooled and personal host pools, with example values."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-autoscale-schedule-phases, avd-scaling-plan]
keypoints:
  - "A schedule has four phases: ramp-up, peak hours, ramp-down and off-peak hours. Each phase start time is also the end time of the previous phase."
  - "In a pooled plan, the capacity threshold is set in ramp-up and ramp-down. Peak carries over the ramp-up value and off-peak carries over the ramp-down value."
  - "Pooled autoscale does not turn hosts off during ramp-up. Forced sign-out is possible only during ramp-down."
  - "Personal plans do not use a capacity threshold. They act on the session state (disconnected or signed out) after a number of minutes between 0 and 360."
faq:
  - q: "Which phase can force users to sign out?"
    a: "Only ramp-down. Microsoft Learn says the force logoff setting does not sign out users in any other phase. If the wait time is longer than the ramp-down phase, the schedule moves to off-peak and the sessions are not forced to sign out."
  - q: "Why can I not change the capacity threshold in the peak and off-peak phases?"
    a: "Learn says the peak phase takes the value from ramp-up and the off-peak phase takes the value from ramp-down. To change them, edit ramp-up or ramp-down."
  - q: "What happens on days that I do not select in a schedule?"
    a: "Learn says the last off-peak parameters of the selected days carry over to the unselected days until the next ramp-up phase."
---

A scaling plan schedule in Azure Virtual Desktop divides a day into four phases: ramp-up, peak hours, ramp-down and off-peak hours. Each phase has its own start time and settings, and the start time of one phase ends the previous one.

For the general concept of a [scaling plan](/entity/avd-scaling-plan/) and its assignment to a [host pool](/entity/avd-host-pool/), see "Azure Virtual Desktop scaling plans explained: schedules, phases and host pools". This article stays with the phase parameters.

## What each phase stands for

Microsoft Learn describes the phases as follows:

- **Ramp-up**: the start of the day; active sessions grow quickly but have not yet reached the daily maximum.
- **Peak**: the pool reaches its daily maximum of active sessions. The number usually holds steady.
- **Ramp-down**: the end of the working day; active sessions fall quickly. VMs are usually shut down now to save cost.
- **Off-peak**: the lowest number of sessions. A small amount of resources may stay on for late workers.

The phase definitions give no clock times; you define them. Learn's pooled PowerShell example uses 6:30 AM, 8:30 AM, 4:00 PM and 10:45 PM for the four phases, and the page says the default values shown in the portal are suggested values for weekdays. Start times use the time zone set in the scaling plan.

One rule applies to all phases of a pooled plan: for pooled host pools, autoscale ignores the load-balancing algorithm in the host pool settings and applies the one from the schedule. You also need a custom maximum session limit on the host pool, and Learn says not to use the default value.

## Ramp-up

In a pooled host pool with power management autoscaling, the ramp-up tab has these settings:

| Setting | What Learn says |
|---|---|
| Start time | The time when autoscale starts preparing session hosts for peak business hours. |
| Load-balancing algorithm | Breadth-first is recommended. It distributes users across existing session hosts to keep access times fast. |
| Minimum percentage of hosts | The percentage of session hosts that should stay on in this phase. A value that is not a whole number is rounded up. |
| Capacity threshold | The percentage of available host pool capacity that triggers a scaling action. |

Learn's first scenario uses six session hosts, a 30 percent capacity threshold, a 30 percent minimum and a maximum session limit of 5. Thirty percent of six is 1.8, which autoscale rounds up, so two hosts are on, with a capacity of 10 sessions. Three sessions equal the threshold, so nothing happens; four make 40 percent, so a third host starts. The rounding is covered in "Minimum percentage of hosts in AVD autoscale explained".

Autoscale can turn hosts on in any phase when used capacity exceeds the threshold, but pooled autoscale does not turn hosts off during ramp-up.

## Peak hours

The peak tab asks for a start time, which is also the end of ramp-up, and for a load-balancing choice between breadth-first and depth-first. Breadth-first spreads new sessions across all available hosts. Depth-first sends them to the available host with the most connections that has not reached its session limit. The capacity threshold cannot be edited here. The value from ramp-up carries over. The peak tab has no minimum-percentage field either, but Learn's peak example lists a minimum of 30 percent.

Peak is not static: autoscale can turn hosts on and off. In Learn's second scenario, five of six hosts run with a 30 percent threshold and a session limit of 5, so capacity is 25. With five sessions (20 percent), turning off one host would give 25 percent, below the threshold, so autoscale drains a host without sessions and turns it off.

## Ramp-down

The ramp-down tab has the largest set of fields: start time, load-balancing algorithm, minimum percentage of hosts, capacity threshold and force logoff. Off-peak takes over the capacity threshold entered here.

Autoscale shuts a host down only when all existing sessions, active and disconnected, fit on fewer hosts without exceeding the capacity threshold. Learn's formula for the hosts needed is total sessions (active plus disconnected) divided by the product of the maximum session limit and the capacity threshold, rounded up to the nearest whole number.

You have two ways to handle users still signed in:

1. **Force sign-out on.** Autoscale chooses the host with the fewest sessions, active and disconnected, and puts it in drain mode. It notifies the users that they will be signed out and ends the sessions after the wait time. Then it deallocates the VM. Only ramp-down supports this; Learn says the force logoff setting does not sign out users in any other phase.
2. **Force sign-out off.** You choose either "VMs have no active or disconnected sessions" or "VMs have no active sessions". Learn's scenarios page describes the "no active sessions" behavior as autoscale waiting for users to sign out voluntarily. The FAQ adds that with that option, disconnected sessions are still treated as active sessions in capacity calculations.

The consolidation arithmetic in Learn's third scenario, the sequence users see and the trade-offs between the two choices are covered in "Forcing users to sign out during AVD ramp-down: what happens and what users see" and "Force sign out vs wait for sign-out: choosing the ramp-down behaviour".

Learn's FAQ adds a timing trap: if the ramp-down phase is 15 minutes long and the wait time before sign-out is 20 minutes, the schedule moves to off-peak first. Autoscale does not force sign-outs during off-peak, so the sessions stay, and autoscale waits until all users have signed out before it deallocates the VM. Keep the wait time shorter than the phase.

The wait time and the notification text are settings of the schedule. In Azure PowerShell they are `RampDownWaitTimeMinute` and `RampDownNotificationMessage`; in the ARM template reference they are `rampDownWaitTimeMinutes` and `rampDownNotificationMessage`, next to `rampDownForceLogoffUsers` and `rampDownStopHostsWhen`. Both Learn examples use 30 minutes, but the message differs: the create-and-assign page's PowerShell example uses "Please log out of your session.", and the example in the [New-AzWvdScalingPlanPooledSchedule](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpooledschedule) cmdlet reference uses "Log out now, please." The cmdlet and ARM references describe the wait time as the number of minutes to wait to stop hosts during the ramp-down period and list no default, minimum or maximum for either value.

## Off-peak hours

The off-peak tab has a start time, which ends ramp-down, and a load-balancing choice. Learn recommends depth-first here, so hosts empty out gradually. The capacity threshold again cannot be edited and comes from ramp-down.

For power management plans, the off-peak tab has no field for the minimum percentage of hosts. The create-and-assign page lists that field only in ramp-up and ramp-down, and the cmdlet and ARM references define only `RampUpMinimumHostsPct` and `RampDownMinimumHostsPct`. For these plans Learn states a carry-over only for the capacity threshold, none for the minimum percentage. Its examples do apply a minimum in off-peak: with six hosts and 10 percent, one host stays on even when the last users sign out. Confirm on a test host pool which value applies. According to the FAQ, autoscale can turn all VMs off only if the minimum percentage is 0 percent and no sessions, including disconnected ones, remain. The FAQ suggests the Group Policy setting "Set time limit for disconnected sessions", for example 15 to 30 minutes, finishing before ramp-down ends.

If you tag hosts with the plan's [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/), autoscale does not turn them on or off in any phase. In Learn's fourth scenario, five of six hosts carry the tag, so a fourth session pushes usage to 80 percent without starting any host. If the last untagged host is also tagged and turned off, a new user sees "No resources available". "Exclusion tags in AVD autoscale: keeping individual VMs out of scaling" walks through it.

## Schedule days

On days that a schedule does not select, the last off-peak parameters of the selected days carry over until the next ramp-up. Autoscale does not support ramping down on specific dates, according to Learn's FAQ.

## Personal host pools

A personal plan has no capacity threshold or minimum percentage. Each phase has a start time and a pair of rules based on the state of the user session. Learn lists these settings:

1. **Start VM on Connect** can be turned on per phase. Learn highly recommends it if you do not start hosts during ramp-up.
2. **Ramp-up only: VMs to start.** Choose assigned VMs only, assigned and unassigned VMs, or no VMs at the start time.
3. **Disconnect settings.** "When disconnected for (min)" accepts a number from 0 to 360. Choose the action: deallocate the VM, hibernate the personal desktop, or do nothing.
4. **Sign-out settings.** "When logged off for (min)" also accepts 0 to 360, with the same three actions.

According to the FAQ, autoscale cannot force users to sign out of personal desktops. Deallocate or hibernate follows the disconnect and sign-out rules above. The FAQ's short answer says autoscale deallocates only after sign-out, which reads narrower than those rules, so check disconnect-based actions on one personal host pool. If you choose hibernate but the desktop does not have hibernate enabled, autoscale does nothing to that host. Learn notes that FSLogix and App Attach do not currently support hibernate. See [personal](/entity/avd-personal-host-pool/) and [pooled](/entity/avd-pooled-host-pool/) host pools. A scaling plan can be assigned only to host pools of the type set in the plan.

## Dynamic autoscaling

Dynamic autoscaling uses the same four phases, but only for pooled host pools with session host configuration, and only in Azure, not Azure Government. It adds the minimum host pool size, the maximum host pool size and the minimum percentage of active hosts. In ramp-down it can deallocate or delete the VM. For these plans the create-and-assign page is explicit about carry-over: it recommends higher "Minimum percentage of active hosts (%)" and "Minimum host pool size" values in the ramp-up phase, "which is carried over to the peak phase". The page makes no equivalent statement for ramp-down and off-peak. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. Power management autoscaling is also generally available. See [dynamic autoscaling](/entity/avd-dynamic-autoscaling/).

## Worked example schedule

A weekday schedule for ten pooled hosts with a session limit of 10 might look like this. These values are examples, not Microsoft recommendations:

1. Ramp-up at 07:00: breadth-first, 20 percent minimum (two hosts), 60 percent threshold.
2. Peak at 09:00: breadth-first, threshold 60 percent (carried over).
3. Ramp-down at 17:00: depth-first, 10 percent minimum (one host), 75 percent threshold, force sign-out on with a wait time shorter than the two-hour phase.
4. Off-peak at 19:00: depth-first, threshold 75 percent (carried over).


## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: New-AzWvdScalingPlanPooledSchedule (Az.DesktopVirtualization)](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpooledschedule)
- [Microsoft Learn: Microsoft.DesktopVirtualization/scalingPlans/pooledSchedules template reference](https://learn.microsoft.com/en-us/azure/templates/microsoft.desktopvirtualization/scalingplans/pooledschedules)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
