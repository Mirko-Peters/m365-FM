---
title: "Depth-first load balancing and autoscale: how the schedule overrides the host pool setting"
summary: "When a scaling plan is assigned to a pooled host pool and enabled, the load balancing algorithm in each schedule phase overrides the one on the host pool, according to Microsoft Learn. This guide shows the algorithm field in each schedule phase, where to set depth-first, which values carry over between phases and days, and how to check the result."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-depth-first-load-balancing, avd-host-pool]
keypoints:
  - "Learn says the load balancing preference chosen in the scaling plan schedule overrides the one in the original host pool settings, and that for pooled pools autoscale overwrites drain mode and ignores the host pool load balancing algorithm. This applies while autoscale is enabled for the host pool."
  - "Each pooled schedule phase has its own algorithm field. Learn recommends breadth-first for ramp-up and depth-first for off-peak, and offers either for peak."
  - "Depth-first lets autoscale consolidate sessions onto fewer hosts. It only turns a host off if all sessions can be consolidated without exceeding the capacity threshold and the minimum percentage of hosts is kept."
  - "Pooled host pools with autoscale need a custom maximum session limit. Learn says not to use the default value."
  - "Autoscale changes drain mode on every host in scope, whoever set it. Use an exclusion tag to keep a host out of scaling."
faq:
  - q: "If I set depth-first on the host pool, will it still apply once a scaling plan is assigned and enabled?"
    a: "Microsoft Learn says the preference selected in the schedule overrides the host pool setting, and that for pooled host pools autoscale ignores the host pool algorithm and applies load balancing from its schedule configuration. Learn also says a scaling plan takes effect once you enable it, and describes a checkbox to disable autoscale for a host pool. While autoscale is enabled, read the schedule, not the host pool setting; to confirm it in your environment, create a test pool and watch where new sessions land."
  - q: "Which phases should use depth-first?"
    a: "Learn's scaling plan article recommends depth-first for off-peak and breadth-first for ramp-up, and allows either for peak. Its FAQ suggests depth-first for ramp-down and off-peak so autoscale can consolidate sessions to the minimum number of hosts."
  - q: "Does this apply to personal host pools?"
    a: "No. Learn says load balancing does not apply to personal host pools. Personal schedules instead set the action to take when a session is disconnected or signed out."
---

With a scaling plan assigned to a pooled host pool and enabled, the load balancing algorithm that runs is the one in the schedule phase, not the one on the host pool. Microsoft Learn says so for the ramp-up phase ("the load balancing preference you select here overrides the one you selected for your original host pool settings") and states more generally that for pooled host pools autoscale ignores the load-balancing algorithm in the host pool settings and applies load balancing based on the schedule configuration. This guide is the field-by-field reference for that: the algorithm field in each phase, the values that carry over, and the checks to run afterwards.

It covers power management autoscaling on pooled pools, which is generally available. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, in July 2026 (Tech Community), but some Learn pages still carry preview wording, for example the scenarios and glossary pages; check the current page before relying on a limit. Related articles in this series: "Depth-first load balancing in Azure Virtual Desktop explained" covers the algorithm itself, and "Forcing users to sign out during AVD ramp-down: what happens and what users see" covers the sign-out behaviour.

## Where the override happens

A [scaling plan](/entity/avd-scaling-plan/) holds schedules, and each schedule has four phases. In the Azure portal, each pooled phase has its own field:

| Phase | Algorithm field | What Learn says |
|---|---|---|
| Ramp-up | Load balancing algorithm | Recommends breadth-first, and says the choice overrides the host pool setting |
| Peak hours | Load balancing | Breadth-first or depth-first |
| Ramp-down | Load-balancing algorithm | No recommendation on the page |
| Off-peak hours | Load-balancing algorithm | Recommends depth-first, to gradually reduce the number of hosts based on sessions on each VM |

The autoscale FAQ explains the reasoning: breadth-first in the first two phases gives an even distribution of sessions, which Learn says optimizes performance, and depth-first in the last two helps autoscale consolidate sessions until it reaches the minimal possible number of [session hosts](/entity/avd-session-host/).

Learn's [scenarios page](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) uses breadth-first for ramp-up, peak and off-peak in its examples, and depth-first for ramp-down. They are examples, not a rule, so follow the recommendation text when you design a schedule.

### Which value to trust

Learn documents the override in the schedule, so the host pool's own load balancing field is not the setting that runs while autoscale is enabled for the pool. Learn says a scaling plan takes effect as soon as you enable it, and its edit steps describe an **Enable autoscale** checkbox in the **Scaling plan** menu of the host pool, which disables the plan for that pool when you unselect it. Our reading: while autoscale is disabled for a pool, the schedule is not applied, so check the host pool's setting then. This matters when you disable autoscale temporarily, for example before a maintenance task.

Do not use the host pool's **Properties** page to tell which algorithm applies while the plan is enabled; read the schedule. To confirm it in your environment, create a test pool, assign a plan with depth-first in off-peak and observe where new sessions land.

Learn also says that changes to a plan already assigned to host pools apply immediately. A schedule edit is therefore a live change.

## Settings that must agree with depth-first

Depth-first only consolidates well if the neighboring settings fit. Learn's prerequisites and scenarios give these.

- **Custom maximum session limit.** Learn says that autoscale on pooled pools needs a configured [maximum session limit](/entity/avd-maximum-session-limit/) and not the default value. Depth-first also requires one. A pool created with breadth-first carries the default of 999999, which would make the capacity calculation meaningless; this is an inference from the formula, so replace it.
- **[Capacity threshold](/entity/avd-capacity-threshold/).** Entered in ramp-up and carried over to peak, where Learn says you cannot change it separately. Ramp-down has its own field, and off-peak takes that value. Autoscale only turns hosts off if used capacity stays at or below the threshold.
- **[Minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/).** The lowest share of hosts that must stay on. Learn says the result is rounded up to a whole number: in a pool of seven hosts, 10% in ramp-up keeps one host on.
- **[Force sign-out](/entity/avd-force-logoff/).** Applies only in ramp-down. Without it you choose between waiting for no active and disconnected sessions, or for no active sessions.
- **Disconnected sessions.** They count as sessions. Learn's FAQ says reaching zero hosts requires zero sessions including disconnected ones, and recommends a Group Policy timeout for disconnected sessions.

## What depth-first adds to consolidation

Learn describes session consolidation as the process autoscale uses during ramp-down and off-peak to reduce the number of running hosts: it divides total sessions, active plus disconnected, by the maximum session limit times the capacity threshold and rounds up. Its scenario 3 works this through with depth-first, six hosts, a 75% threshold and a limit of 5; the walkthrough is in "Forcing users to sign out during AVD ramp-down: what happens and what users see", and the threshold arithmetic is in "Choosing the right capacity threshold for pooled host pools".

Learn presents that calculation without tying it to one algorithm. Our reading: the algorithm decides where new sessions land, and consolidation decides which hosts can be switched off, so depth-first helps because fewer hosts hold sessions when the calculation runs. Learn does not state this.

Two points are specific to the schedule design:

1. **Forced sign-out stops at ramp-down.** The FAQ says autoscale does not force users to sign out during off-peak hours. If a host is in drain mode in ramp-down and users are still connected when the phase changes to off-peak, autoscale waits until all users have signed out before it deallocates the VM. Our reading: depth-first in off-peak therefore consolidates only as far as users sign out on their own.
2. **Ramp-up does not turn hosts off.** Learn's scenario 2 says pooled autoscale does not turn off session hosts in ramp-up, so the breadth-first choice there is about spreading load, not saving cost.

## Steps: set depth-first for off-peak

Learn lists these tabs for creating or changing a pooled schedule.

1. In the Azure portal open **Azure Virtual Desktop** and then **Scaling plans**, and select the plan.
2. Under the **Manage** heading, select **Schedules**, then open the schedule you want to change. If the plan has no schedule yet, create one first.
3. On **Ramp up**, set the start time, the algorithm (breadth-first), the minimum percentage of hosts and the capacity threshold.
4. On **Peak hours**, choose breadth-first or depth-first.
5. On **Ramp-down**, set the start time, the algorithm, the minimum percentage, the capacity threshold and force logoff of users.
6. On **Off-peak hours**, set the start time and choose depth-first. The capacity threshold is not set here; the value from Ramp-down carries over.
7. Confirm the change. If the plan is already assigned, the change applies immediately.

Learn adds that on days not selected in a schedule, the last off-peak settings carry over until the next ramp-up. A Friday off-peak depth-first setting is therefore also what runs over the weekend if no weekend schedule exists.

## Keeping a host out of the logic

Learn says that for pooled host pools autoscale overwrites drain mode, and its FAQ says this holds no matter who put a host in drain mode. To exclude a host, use an [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/); the setup is covered in "Exclusion tags in AVD autoscale: keeping individual VMs out of scaling". For depth-first, note that a tagged host is outside the consolidation: autoscale does not start, stop or drain it. Our reading: sessions that land on it are not consolidated away.

## Checks after the change

1. Confirm the maximum session limit on the host pool is a custom value.
2. In off-peak, look at sessions per host in [Insights](/entity/avd-insights/). Our recommendation: sessions should concentrate on few hosts; this is a practical check, not a Learn statement.
3. In ramp-down, watch whether hosts reach drain mode and shut down.
4. Look for disconnected sessions that keep hosts on.
5. Check that autoscale is enabled for the host pool; if it is disabled, the schedule is not what places sessions.
6. Review the schedule whenever someone edits the host pool algorithm, so the two are not assumed to match.

## Sources

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
