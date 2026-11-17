---
title: "Depth-first load balancing and autoscale: how the schedule overrides the host pool setting"
summary: "When a scaling plan is assigned to a pooled host pool, the load balancing algorithm in each schedule phase overrides the one on the host pool, according to Microsoft Learn. This guide shows where to set depth-first in the schedule, what autoscale does with it during ramp-down, and which settings must agree for consolidation to work."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-depth-first-load-balancing, avd-host-pool]
keypoints:
  - "Learn says the load balancing preference chosen in the scaling plan schedule overrides the one in the original host pool settings, and that autoscale on pooled pools overrides drain mode and load balancing settings."
  - "Each pooled schedule phase has its own algorithm field. Learn recommends breadth-first for ramp-up and depth-first for off-peak, and offers either for peak."
  - "Depth-first lets autoscale consolidate sessions onto fewer hosts. It only turns a host off if all sessions can be consolidated without exceeding the capacity threshold and the minimum percentage of hosts is kept."
  - "Pooled host pools with autoscale need a custom maximum session limit. Learn says not to use the default value."
  - "Autoscale changes drain mode on every host in scope, whoever set it. Use an exclusion tag to keep a host out of scaling."
faq:
  - q: "If I set depth-first on the host pool, will it still apply once a scaling plan is assigned?"
    a: "Microsoft Learn says the preference selected in the schedule overrides the host pool setting, and that autoscale on pooled pools applies load balancing from its own schedule configuration. The sources used here do not say whether the host pool Properties page then shows the schedule's value, so check it on a test pool."
  - q: "Which phases should use depth-first?"
    a: "Learn's scaling plan article recommends depth-first for off-peak and breadth-first for ramp-up, and allows either for peak. Its FAQ suggests depth-first for ramp-down and off-peak so autoscale can consolidate sessions to the minimum number of hosts."
  - q: "Does this apply to personal host pools?"
    a: "No. Learn says load balancing does not apply to personal host pools. Personal schedules instead set the action to take when a session is disconnected or signed out."
---

With a scaling plan assigned to a pooled host pool, the load balancing algorithm that runs is the one in the schedule phase, not the one on the host pool. Microsoft Learn says so for the ramp-up phase ("the load balancing preference you select here overrides the one you selected for your original host pool settings") and states more generally that autoscale on pooled pools overrides load balancing settings and applies them from its own schedule. This guide shows how to use that for depth-first.

It covers power management autoscaling on pooled pools. Dynamic autoscaling is labeled preview in Learn's autoscale glossary and is not the subject here. Sources are listed at the end and were retrieved on 17 November 2026. The article "Depth-first load balancing in Azure Virtual Desktop explained" covers the algorithm itself.

## Where the override happens

A [scaling plan](/entity/avd-scaling-plan/) holds schedules, and each schedule has four phases. In the Azure portal, each pooled phase has its own field:

| Phase | Algorithm field | What Learn says |
|---|---|---|
| Ramp-up | Load balancing algorithm | Recommends breadth-first, and says the choice overrides the host pool setting |
| Peak hours | Load balancing | Breadth-first or depth-first |
| Ramp-down | Load-balancing algorithm | No recommendation on the page |
| Off-peak hours | Load-balancing algorithm | Recommends depth-first, to gradually reduce the number of hosts based on sessions on each VM |

The autoscale FAQ explains the reasoning: breadth-first in the first two phases gives an even distribution of sessions, which Learn says optimizes performance, and depth-first in the last two helps autoscale consolidate sessions until it reaches the minimal possible number of [session hosts](/entity/avd-session-host/).

Learn's [scenarios page](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) says it differently in its overview: for pooled host pools, autoscale overrides drain mode and load-balancing settings and applies load balancing from the schedule. The examples there use breadth-first for ramp-up, peak and off-peak, and depth-first for ramp-down. They are examples, not a rule, so follow the recommendation text when you design a schedule.

### What the sources do not say

No page used here says whether the host pool's **Properties** page changes when a plan takes over, or what is shown there. Treat the host pool value as not authoritative while a plan is assigned, and read the schedule when you need to know which algorithm applies. If you need certainty, create a test pool, assign a plan with depth-first in off-peak and observe where new sessions land.

Learn also says that changes to a plan already assigned to host pools apply immediately. A schedule edit is therefore a live change.

## Settings that must agree with depth-first

Depth-first only consolidates well if the neighboring settings fit. Learn's prerequisites and scenarios give these.

- **Custom maximum session limit.** Learn says that autoscale on pooled pools needs a configured [maximum session limit](/entity/avd-maximum-session-limit/) and not the default value. Depth-first also requires one. A pool created with breadth-first carries the default of 999999, which would make the capacity calculation meaningless; this is an inference from the formula, so replace it.
- **[Capacity threshold](/entity/avd-capacity-threshold/).** Entered in ramp-up and carried over to peak, where Learn says you cannot change it separately. Ramp-down has its own field. Autoscale only turns hosts off if used capacity stays at or below the threshold.
- **[Minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/).** The lowest share of hosts that must stay on. Learn says the result is rounded up to a whole number: in a pool of seven hosts, 10% in ramp-up keeps one host on.
- **[Force sign-out](/entity/avd-force-logoff/).** Applies only in ramp-down. Without it you choose between waiting for no active and disconnected sessions, or for no active sessions.
- **Disconnected sessions.** They count as sessions. Learn's FAQ says reaching zero hosts requires zero sessions including disconnected ones, and recommends a Group Policy timeout for disconnected sessions.

## What autoscale does with depth-first in ramp-down

Learn's scenario 3 sets the case: six hosts, depth-first, capacity threshold 75%, minimum 10% of hosts, maximum session limit 5, four hosts available, four users (20% used) and force sign-out on.

The consolidation formula on the page is: required hosts = total sessions (active plus disconnected) divided by (maximum session limit times capacity threshold).

Here, 4 sessions divided by (5 times 0.75, which is 3.75) is about 1.07, so two hosts are required. Autoscale can turn off two of the four. Because the sessions are split evenly, it picks two hosts at random, puts them in [drain mode](/entity/avd-drain-mode/), notifies the users, signs them out after the wait time and turns the hosts off. With two hosts and four users (40%), turning off a third would push use to 80%, above 75%, so it does not.

When it later has three users on two hosts (30%), autoscale can turn one more off. It selects the host with the fewest sessions, drains it, notifies users and forces sign-out after the set time. One host remains. A user signing back in raises use to 60%, and the last host stays on, because turning it off would leave capacity below the 10% minimum.

Two consequences for depth-first design:

1. **Consolidation works through sign-out.** In the scenario, hosts are drained and users are signed out after the wait time. Depth-first keeps sessions from spreading in the first place, so the sign-out step should affect fewer users; this is an inference, not a Learn statement.
2. **The limit is part of the math.** A limit of 10 instead of 5 in the same example gives 4 divided by 7.5, about 0.53, so a single host would be enough.

### A second worked example

Learn's FAQ gives the disconnected-session case: 6 disconnected users, a limit of 5 and a threshold of 90% give a capacity of 4.5 sessions per host and 6 divided by 4.5, which is 1.33, rounded up to 2 hosts. The same formula applies to any mix of active and disconnected sessions.

## Steps: set depth-first for off-peak

The pooled schedule has these tabs per Learn. You need rights to edit scaling plans.

1. In the Azure portal open **Azure Virtual Desktop** and then **Scaling plans**, and select the plan.
2. Go to **Schedules** and select **Add schedule** for a new one, or open the existing schedule. Learn describes these tabs in the creation wizard, so the labels in the edit view may differ slightly.
3. On **Ramp up**, set the start time, the algorithm (breadth-first), the minimum percentage of hosts and the capacity threshold.
4. On **Peak hours**, choose breadth-first or depth-first.
5. On **Ramp-down**, set the start time, the algorithm, the minimum percentage, the capacity threshold and force logoff of users.
6. On **Off-peak hours**, set the start time and choose depth-first.
7. Save. If the plan is already assigned, the change applies immediately.

Learn adds that on days not selected in a schedule, the last off-peak settings carry over until the next ramp-up. A Friday off-peak depth-first setting is therefore also what runs over the weekend if no weekend schedule exists.

## Keeping a host out of the logic

Autoscale puts hosts into drain mode and takes them out again, whoever set it. Learn's FAQ says it still turns drain mode on or off no matter who put a host in drain mode, and that to exclude a VM you must use an [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/). Learn's example tag name is `excludeFromScaling`. Tagged hosts are not started, stopped or drained by autoscale, but still count toward the minimum percentage.

A tagged host is also outside the consolidation that depth-first enables. If a tagged host holds sessions, plan around it.

## Checks after the change

1. Confirm the maximum session limit on the host pool is a custom value.
2. In off-peak, look at sessions per host in [Insights](/entity/avd-insights/). Sessions should concentrate on few hosts.
3. In ramp-down, watch whether hosts reach drain mode and shut down.
4. Look for disconnected sessions that keep hosts on.
5. Review the schedule whenever someone edits the host pool algorithm, so the two are not assumed to match.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
