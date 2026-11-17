---
title: "Choosing the right capacity threshold for pooled host pools"
summary: "Pick the capacity threshold of an Azure Virtual Desktop pooled host pool by working out how many sessions must fit between the trigger point and the session limit while the next host starts. As a rule of thumb, start lower in ramp-up and higher in ramp-down, and confirm with Insights."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-capacity-threshold, avd-scaling-plan]
keypoints:
  - "Microsoft Learn gives example thresholds (30, 60, 75, 80 and 90 percent) but no recommended value. The right number depends on your session limit, sign-in pattern and host start-up time."
  - "Set a custom maximum session limit first. The threshold is a percentage of limit times hosts, and the default of 999999 makes it meaningless."
  - "The buffer between the trigger point and the session limit has to absorb sign-ins while the next host starts. Start-up time varies by environment, so measure it."
  - "As a rule of thumb, which is our inference and not a Learn statement, use a lower threshold in ramp-up, which carries over to peak, and a higher one in ramp-down, which carries over to off-peak."
  - "Each 15 points of threshold can change the host count at steady load. By our calculation, 200 sessions at a limit of 32 need at least 11, 9 and 7 hosts at 60, 75 and 90 percent."
faq:
  - q: "What capacity threshold does Microsoft recommend?"
    a: "Microsoft Learn recommends no single value. Its examples use 30, 60, 75, 80 and 90 percent in different scenarios, and the scenarios page says that a high threshold with a low minimum percentage of hosts in ramp-down decreases the need to start new hosts at the end of the workday. Treat these as illustrations, not defaults."
  - q: "Why does a high threshold risk a poor sign-in experience?"
    a: "Because a new host is requested only after usage passes the threshold, and the remaining capacity must absorb sign-ins while that host starts. Measure the start-up duration in your environment. The outcome is an inference from the capacity formula, not a Learn statement."
  - q: "Do I need to retune the threshold when I add hosts?"
    a: "The percentage stays the same, but the trigger point moves because capacity is the maximum session limit times the available hosts. Recalculate the buffer in sessions after you change the limit or the pool size."
---

Choose the capacity threshold by working out how many sessions must still fit between the trigger point and the maximum session limit while the next host starts. A higher threshold uses fewer hosts but leaves a smaller buffer for sign-ins, so as a rule of thumb (our inference) use a lower value in ramp-up and a higher one in ramp-down, then adjust with measurements. Microsoft Learn does not recommend a single number, so this guide gives a method and marks which statements are inferences.

How the threshold works is explained in "Capacity threshold in AVD autoscale: how the percentage decides when another host starts". Here we assume you know that autoscale starts hosts when used capacity goes above the [capacity threshold](/entity/avd-capacity-threshold/) and that in ramp-down and off-peak it consolidates using the formula sessions divided by (limit times threshold), rounded up.

## Step 1: Fix the maximum session limit

The threshold is a percentage of capacity, and capacity is the [maximum session limit](/entity/avd-maximum-session-limit/) times the available hosts. Learn says to set a custom limit for pooled pools using autoscale and not to keep the default. For a breadth-first pool created with the default, the load-balancing page states the limit is 999999. With that value, capacity is enormous, usage stays near 0 percent, and by the arithmetic no threshold would ever trigger a new host.

Derive the limit from your workload. Learn's sizing table gives maximum users per vCPU: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads, as generic starting points to be refined with your own data. For an 8 vCPU host that means up to 48 (light), 32 (medium), 16 (heavy) sessions. Learn also says to keep multi-session VMs between 6 and 24 vCPUs. Test with a pilot group before fixing the value, because both the limit and the threshold depend on it.

## Step 2: Turn the percentage into sessions

The threshold only matters through the sessions it implies. Take 6 running hosts with a limit of 32 (medium workload on 8 vCPUs). Capacity is 192 sessions.

| Threshold | Trigger point (a host starts once sessions exceed this) | Buffer to the limit |
|---|---|---|
| 60 percent | 115.2 | 76.8 |
| 75 percent | 144 | 48 |
| 90 percent | 172.8 | 19.2 |

The trigger point is capacity times threshold, and the buffer is capacity minus that number. At exactly the threshold nothing happens, so with a 75 percent threshold the 145th session is the first to start another host. The buffer is what absorbs new sign-ins between the moment autoscale decides to start a host and the moment that host accepts sessions.

Start-up time depends on your image, VM size and region, and the FAQ says evaluations are triggered by sign-in and sign-out events and batched when many arrive together. So the check is yours to run:

1. Measure the start time of a deallocated host in your environment, from the start request to the first accepted session.
2. Measure your sign-in rate during the busiest ramp-up minutes. Learn documents the `WVDConnections` table as connection activity, with `TimeGenerated`, `State`, `UserName` and `CorrelationId` columns. One approach, ours and not a Learn procedure, is to count distinct `CorrelationId` values per minute in ramp-up, after checking which `State` values your workspace records.
3. Multiply the two. This is the number of sessions that arrive while a host starts. It is an inference, not a Learn formula.
4. Compare it with the buffer. If the buffer is smaller, lower the threshold or raise the minimum percentage of hosts in ramp-up so hosts are already running.

For example, with an invented sign-in rate of 30 per minute and an invented start time of 5 minutes, 150 sessions arrive during the wait. No row in the table covers that, which tells you the threshold is the wrong tool for that surge: start hosts ahead of time with the [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) and an earlier ramp-up. The threshold then handles the slower growth afterward.

## Step 3: Use different values per phase

You enter the threshold in ramp-up and ramp-down. Peak takes the ramp-up value and off-peak takes the ramp-down value; neither tab lets you edit it. See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/).

- **Ramp-up and peak: lower threshold (our rule of thumb).** Sessions arrive quickly, and Learn says pooled autoscale does not turn hosts off during ramp-up. A lower value starts hosts earlier and leaves a bigger buffer. The FAQ gives breadth-first as an example for these phases, so sessions spread across hosts.
- **Ramp-down and off-peak: higher threshold.** For ramp-down, the scenarios page says a high threshold and a low minimum percentage of hosts decrease the need to start new hosts at the end of the workday; off-peak takes the ramp-down value. The FAQ gives depth-first as an example here, to consolidate sessions.

Learn's example values show the range, not a recommendation: 30 percent in a six-host ramp-up and peak scenario with a limit of 5, 75 percent in the ramp-down and off-peak scenarios and in the create-and-assign example, 80 percent in the glossary's consolidation example (8 disconnected users, limit 10), 90 percent in the FAQ's disconnected-session example, and 60 percent in the dynamic autoscaling field description.

## Step 4: See what the choice costs

Learn gives the formula sessions divided by (limit times threshold), rounded up, for consolidation in ramp-down and off-peak. Applying it at peak is our inference: it gives the minimum number of hosts that keeps usage at or below the threshold, and the real count can be higher, because autoscale does not turn hosts off in ramp-up and the minimum percentage of hosts sets a floor. For 200 sessions with a limit of 32, the minimum is:

| Threshold | Calculation | At least |
|---|---|---|
| 60 percent | 200 / 19.2 = 10.4 | 11 |
| 75 percent | 200 / 24 = 8.33 | 9 |
| 90 percent | 200 / 28.8 = 6.94 | 7 |

Moving from 90 to 60 percent adds at least four hosts for the same sessions. If the peak lasts eight hours on 22 weekdays, that is at most about 4 x 8 x 22 = 704 host-hours a month, to be multiplied by your own rate. The cost model is in "What Azure Virtual Desktop really costs: the full cost model". Whether the extra buffer is worth it depends on how much slower sign-ins hurt your users.

## A worked example

An invented pool: 12 hosts, a limit of 32 and a peak of 200 concurrent sessions. In ramp-up and peak, a 60 percent threshold needs at least 11 hosts at the peak by our inference (200 / 19.2 = 10.4, rounded up). The pool has room for that, and the trigger point at 11 hosts is about 211 sessions. In ramp-down and off-peak, an 80 percent threshold and 40 remaining sessions need 40 / 25.6 = 1.56, so 2 hosts, and the minimum percentage of hosts sets the floor beneath that. Both numbers are examples to test, not advice for your tenant.

If the pool's host count is too small for the peak at the chosen threshold, no threshold setting fixes it: the capacity itself, meaning the limit, the VM size or the host count, has to change. A threshold only decides when capacity is added, not how much exists.

## Step 5: Check the interactions

- **Disconnected sessions count.** Learn's FAQ says autoscale treats them as active for capacity because users may reconnect, so lingering disconnected sessions push usage up. A time limit policy for disconnected sessions lowers used capacity.
- **Excluded hosts.** Hosts with the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) never start. If all remaining hosts are tagged, a threshold breach starts nothing, and Learn warns that new users may see "No resources available".
- **Forced sign-out.** In ramp-down, a high threshold means more consolidation, which means more users on hosts that autoscale removes. With [force sign-out](/entity/avd-force-logoff/) on, those users are signed out after the wait time. With it off, hosts stay on until users leave.
- **Minimum percentage.** It sets a floor regardless of the threshold, so a threshold that looks too high may be hidden behind a high minimum.
- **Power management or dynamic.** The threshold also applies in [dynamic autoscaling](/entity/avd-dynamic-autoscaling/), where hosts are created and deleted. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026. Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Step 6: Validate with Insights

Insights shows autoscale decisions for pooled pools, if a few things are in place first. Learn lists a pooled host pool with a scaling plan assigned (personal pools are not supported), and Insights configured for the host pool and its workspace. In the host pool's diagnostic settings, send the "Autoscale logs for pooled host pools" category to the same Log Analytics workspace. You need the Desktop Virtualization Contributor role to configure diagnostics, and Desktop Virtualization Reader plus Log Analytics Reader to query. Learn's `WVDAutoscaleEvaluationPooled` table includes `SessionOccupancyPercent`, `SessionCount`, `ActiveSessionHostsPercent` and `ScalingReasonMessage`. Run Learn's query for peak occupancy per day, schedule and phase after a week:

```kusto
WVDAutoscaleEvaluationPooled
| where ResultType == "Succeeded"
| summarize max(SessionOccupancyPercent), max(SessionCount), max(ActiveSessionHostsPercent), max(ActiveSessionHostCount) by _ResourceId, bin(TimeGenerated, 1d), ConfigScheduleName, ConfigSchedulePhase
| order by _ResourceId asc, TimeGenerated asc, ConfigScheduleName, ConfigSchedulePhase asc
```

Read it this way, as a practical heuristic and not a Learn rule: peak occupancy far below the threshold in a phase suggests the value or the minimum is too cautious, while occupancy that regularly sits at the threshold with user complaints about sign-in times suggests too little buffer. Change one number at a time. See [Azure Virtual Desktop Insights](/entity/avd-insights/) and [scaling plans](/entity/avd-scaling-plan/).

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Configure host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: WVDConnections table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdconnections)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Monitor autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
