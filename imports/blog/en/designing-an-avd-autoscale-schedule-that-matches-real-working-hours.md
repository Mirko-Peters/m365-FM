---
title: "Designing an AVD autoscale schedule that matches real working hours"
summary: "Build an Azure Virtual Desktop autoscale schedule from measured session counts, not from office hours on paper. This guide takes you from hourly session data to the four phase start times, the minimum percentage of hosts and capacity threshold you enter in ramp-up and ramp-down, and a check with Insights."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-autoscale-schedule-phases, avd-scaling-plan]
keypoints:
  - "Start with data: hourly connection counts from the WVDConnections table or session counters from Insights show where sessions rise, hold and fall. Phase start times come from those turning points."
  - "The ramp-up start must leave time for hosts to power on before the first users arrive. Measure how long hosts take to start in your environment; the scenarios and create-and-assign pages give no figure."
  - "A ramp-down wait time must be shorter than the ramp-down phase. Learn's FAQ example is a 15-minute phase with a 20-minute wait, where forced sign-out never happens."
  - "Autoscale cannot ramp down on specific dates and a plan runs in one time zone. Use separate schedules for weekdays and weekends, and plan holidays by hand."
  - "Disconnected sessions keep hosts running. A time limit policy that signs them out, combined with a minimum of 0 percent, is the documented way to reach zero hosts after hours."
faq:
  - q: "How early should ramp-up start before the first users sign in?"
    a: "Time how long a session host takes to power on in your own environment, then start ramp-up that much earlier plus a margin. The autoscale scenarios and create-and-assign pages give no figure for the start-up time or a minimum lead time."
  - q: "Can one scaling plan have different schedules for weekdays and weekends?"
    a: "Yes. Microsoft Learn says a plan can contain multiple schedules, such as separate weekday and weekend schedules, each with its own Repeat on days. On days you do not select, the last off-peak settings carry over until the next ramp-up."
  - q: "Can autoscale handle public holidays?"
    a: "Not on its own. The autoscale FAQ says autoscale does not currently support ramping down on specific dates such as holidays. Nerdio's help pages describe alternative schedules for specific dates in Nerdio Manager, which is a separate product."
---

A good autoscale schedule starts from measured session counts: find the hours where sessions rise, hold and fall, and place the four phase start times at those turning points. Then set the minimum percentage of hosts and the capacity threshold in ramp-up and ramp-down, keep the ramp-down wait shorter than its phase, and verify the result with Insights. This guide follows that order.

The sibling articles explain what the phases are ("Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained") and how to click through plan creation ("How to create and assign an AVD scaling plan step by step"). This one covers the step before both: deciding the values.

## Step 1: Collect real usage data

Office hours on a wall poster rarely match sign-in behavior. Measure at least a few typical weeks.

1. Turn on diagnostic settings for the host pool and its workspace and send them to a Log Analytics workspace. On the host pool, include **Autoscale logs for pooled host pools**; Learn's Insights page lists it among the minimum categories. Viewing and querying the data takes the Desktop Virtualization Reader and Log Analytics Reader roles. Data may take a few hours to appear after first set-up.
2. Query `WVDConnections`. Learn describes the connection states Started, Connected and Completed. This example adapts Learn's per-day pattern to hourly counts. Check the column names in your workspace before relying on it:

```kusto
WVDConnections
| where State == "Connected"
| summarize Connections = dcount(CorrelationId) by bin(TimeGenerated, 1h)
| order by TimeGenerated asc
```

3. If [Azure Virtual Desktop Insights](/entity/avd-insights/) is set up, its default counters include Terminal Services Active Sessions and Total Sessions, sampled every 60 seconds according to Learn's cost page. Learn's scenarios page calculates required hosts from total sessions, active plus disconnected.
4. After a plan is assigned to a pooled host pool and its Autoscale logs reach Log Analytics, the Autoscale tab in Insights shows the power-state changes of the session hosts over time and summary information. The underlying table, `WVDAutoscaleEvaluationPooled`, has the columns `SessionCount`, `SessionOccupancyPercent`, `ActiveSessionHostCount` and `ConfigSchedulePhase`, so you can read these values per schedule phase. Insights monitors autoscale for pooled host pools only.

Write down four numbers per weekday: when sessions first appear, when they reach the daily maximum, when they start to fall, and when they reach the evening floor.

## Step 2: Place the four phase start times

Learn defines the phases by session behavior: ramp-up is when sessions climb, peak is when they hold steady, ramp-down is when they fall, and off-peak is the daily minimum. See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/).

- **Ramp-up start:** before your first sign-in wave. Learn's field description says this time is when autoscale starts "preparing session hosts" for peak hours. Time how long a deallocated host takes to accept connections in your environment and add a margin, because the page states no start-up duration.
- **Peak start:** where the curve flattens. This is also the end of ramp-up. Use the time zone you set for the plan.
- **Ramp-down start:** where concurrent sessions begin to fall steadily, not at the official finish time.
- **Off-peak start:** where the curve reaches the evening floor. This is the end of ramp-down.

Learn says a plan operates only in its configured time zone, and the peak start must be in that zone. Learn's scenarios and create-and-assign pages give no guidance on daylight saving time, so check Insights during the first weeks after a clock change.

## Step 3: Set minimum percentage and capacity threshold

This step covers power management autoscaling for pooled host pools. Dynamic autoscaling, which needs a host pool with session host configuration, has different fields (for example "Minimum percentage of active hosts" and minimum and maximum host pool size) in its own section of Learn's create-and-assign page.

The [capacity threshold](/entity/avd-capacity-threshold/) and the [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) are entered in ramp-up and ramp-down. Learn's create-and-assign page says:

- It lists "Minimum percentage of hosts" only for ramp-up and ramp-down.
- The ramp-up capacity threshold carries over to peak, and the ramp-down value carries over to off-peak. Peak and off-peak have no threshold or minimum field of their own.
- Learn's off-peak scenario and its troubleshooting page apply a minimum percentage of hosts during ramp-down and off-peak, but the create-and-assign page states the carry-over only for the capacity threshold. After a schedule change, check in Insights that hosts really reach zero.

Use your data like this:

- **Ramp-up minimum:** the number of hosts needed for the first wave, divided by total hosts. Autoscale rounds a non-whole result up.
- **Ramp-up threshold:** how full hosts may get before another starts. Learn says autoscale does not turn on VMs until the used host pool capacity is greater than the capacity threshold.
- **Ramp-down threshold and minimum:** Learn's third scenario pairs a high capacity threshold with a low minimum percentage of hosts in ramp-down, which it says decreases the need to turn on new session hosts at the end of the workday.
- **Ramp-down minimum:** the floor you accept while load falls. Set it to 0 percent if hosts should be able to reach zero after hours, because Learn's FAQ says autoscale can turn off all VMs if the minimum percentage of hosts is 0 and no sessions remain.

Choosing the threshold value is covered in "Choosing the right capacity threshold for pooled host pools". Set a custom maximum session limit first: Learn's create-and-assign page says a pooled host pool must have a configured MaxSessionLimit and that you should not use the default value. The scenarios page works out available host pool capacity as the number of available session hosts times the maximum session limit, so the limit feeds every threshold calculation.

## Step 4: Fit the ramp-down to the exit pattern

Learn's scenarios page calculates the hosts needed in ramp-down as total sessions (active plus disconnected) divided by the maximum session limit times the capacity threshold. From that formula, hosts can only be removed when the sessions fit on fewer hosts without exceeding the threshold. The ramp-down field **Force logoff of users** decides what happens to users on hosts that autoscale wants to remove:

- **On.** Autoscale picks the host with the fewest sessions, puts it in [drain mode](/entity/avd-drain-mode/), sends a notification, signs users out after the wait time and then deallocates the VM. See [force sign-out](/entity/avd-force-logoff/).
- **Off.** You must choose **VMs have no active or disconnected sessions** or **VMs have no active sessions**. The autoscale FAQ recommends the second ("Stop VMs when no active sessions") and treats forced sign-out as optional. The worked example below uses it with **Force logoff of users** off.

Forced sign-out happens only in ramp-down. Learn's FAQ gives this trap: with a 15-minute ramp-down and a 20-minute wait time, the schedule moves to off-peak before the sign-out occurs. Make the phase longer than the wait.

To reach zero hosts, Learn's FAQ says you need zero sessions including disconnected ones, a 0 percent minimum during off-peak hours, and a Group Policy time limit for disconnected sessions (for example 15 to 30 minutes) that completes before the end of ramp-down. Learn's create-and-assign page gives the Intune route: a Windows 10 and later profile of type Session Time Limits with **Set time limit for disconnected sessions**, followed by a restart of the session hosts.

## Step 5: Cover days, weekends and holidays

- Create separate schedules where behavior differs. Learn says a plan can have several, for example weekday and weekend schedules, and each has a "Repeat on" setting.
- On unselected days, the last off-peak settings of the selected days carry over until the next ramp-up.
- Autoscale does not support ramping down on specific dates such as holidays. Learn documents no holiday workaround. Because changes to an assigned plan apply immediately, one option is to edit the plan by hand on the day. The [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) keeps individual hosts out of scaling if you manage them yourself.
- Nerdio's help pages for Nerdio Manager describe a Default schedule and an Alternative schedule for off-peak days or specific dates such as holidays. That is a separate product with its own scheduling model; see [Nerdio auto-scaling](/entity/nerdio-auto-scaling/).

## Worked example: three user groups

The numbers are invented. A pooled host pool has 15 hosts, a maximum session limit of 10 and a threshold of 75 percent in both phases. Learn's formula (sessions divided by limit times threshold, rounded up) gives the host count for each load.

| Time | Concurrent sessions | Hosts needed | Reasoning |
|---|---|---|---|
| 06:30 to 08:00 | 20 (support team) | 20 / 7.5 = 2.7, so 3 | A 20 percent minimum of 15 hosts is also 3 |
| 08:00 to 08:30 | 20 rising to 100 | 3 rising to 14 | Autoscale adds hosts as sessions climb |
| 08:30 to 17:00 | 100 (office staff) | 100 / 7.5 = 13.3, so 14 | Peak, threshold carried over from ramp-up |
| 17:00 to 20:00 | 20 (finance team) | 20 / 7.5 = 2.7, so 3 | Load-based, no floor needed |
| 20:00 to 21:00 | 0 | 0 once the disconnected-session limit has run | Ramp-down is still running; the limit completes at 20:30 |
| After 21:00 | 0 | 0 | Needs 0 percent and no disconnected sessions |

The "hosts needed" column is a capacity calculation, not a forecast of running hosts. With **Force logoff of users** off, more than 3 hosts can stay on in the evening if the finance team's sessions are spread across them. That is the price of not signing anyone out.

A schedule from this table:

1. **Ramp-up 06:00:** breadth-first, minimum 20 percent, threshold 75 percent. The 06:00 start leaves a margin before the 06:30 sign-ins, sized from your measured start-up time.
2. **Peak 08:30:** breadth-first. The 75 percent threshold carries over from ramp-up; the algorithm is chosen in the peak phase itself.
3. **Ramp-down 17:00:** depth-first, minimum 0 percent, threshold 75 percent. The stop condition is **VMs have no active sessions** and **Force logoff of users** is off, so the finance team is not signed out.
4. **Off-peak 21:00:** depth-first, with the threshold carried over from ramp-down and a 30-minute disconnected-session limit applied through policy. Sessions end at 20:00, so the limit completes at 20:30, before the ramp-down phase ends; size it against your own phase length.

Learn's create-and-assign page recommends breadth-first for ramp-up and depth-first for off-peak, and leaves peak and ramp-down to you. Its FAQ example uses breadth-first for ramp-up and peak and depth-first for ramp-down and off-peak.

## Step 6: Verify and adjust

Run the Insights queries from Learn's autoscale monitoring page after a week:

```kusto
WVDAutoscaleEvaluationPooled
| where ResultType == "Succeeded"
| summarize max(SessionOccupancyPercent), max(SessionCount), max(ActiveSessionHostsPercent), max(ActiveSessionHostCount) by _ResourceId, bin(TimeGenerated, 1d), ConfigScheduleName, ConfigSchedulePhase
| order by _ResourceId asc, TimeGenerated asc, ConfigScheduleName, ConfigSchedulePhase asc
```

Phases where occupancy stays far below the threshold suggest hosts started too early; phases where it touches the threshold suggest a late ramp-up. `ScalingReasonMessage` states why autoscale acted. Change one setting at a time.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Troubleshoot autoscale in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Use Log Analytics for the diagnostics feature](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: Monitor autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Nerdio: Enable dynamic host pool auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
