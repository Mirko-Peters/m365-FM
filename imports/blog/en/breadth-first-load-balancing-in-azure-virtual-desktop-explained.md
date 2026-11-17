---
title: "Breadth-first load balancing in Azure Virtual Desktop explained"
summary: "Breadth-first load balancing sends each new session to a randomly chosen host among the half of available session hosts that have the fewest sessions. It needs no maximum session limit, but autoscale needs a custom one."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-breadth-first-load-balancing, avd-host-pool]
keypoints:
  - "Breadth-first queries the session hosts that allow new connections and picks one at random from the half with the fewest sessions, so distribution is balanced but not strictly even."
  - "A maximum session limit is optional for breadth-first. When a pool is created with breadth-first, the default is 999999, the highest value possible."
  - "Learn describes breadth-first as optimizing session performance because host resources are generally less contended, and depth-first as the choice for cost-conscious organizations."
  - "Both algorithms still route a returning user to the host that holds their active or disconnected session, even if drain mode is on, and skip drained hosts for new users."
  - "With autoscale, Learn recommends breadth-first for ramp-up, and the autoscale FAQ names ramp-up and peak as phases where it can be used. The ramp-up algorithm in the schedule overrides the host pool setting, and you must set a custom maximum session limit."
faq:
  - q: "Is breadth-first the default load balancing algorithm?"
    a: "The portal offers both algorithms when you create a pooled host pool, where Learn's deployment page says to choose either breadth-first or depth-first based on your usage pattern. Learn's load balancing page does not name a default algorithm. It does say that if you use breadth-first when first creating a host pool, the maximum session limit defaults to 999999, which is also the highest value you can set."
  - q: "Does breadth-first distribute sessions exactly evenly?"
    a: "No. Microsoft Learn says the algorithm picks randomly from half the set of available hosts with the fewest sessions, so a new session does not automatically go to the single least loaded host and some sessions may not be evenly distributed."
  - q: "Do personal host pools use breadth-first?"
    a: "No. Learn says load balancing does not apply to personal host pools, because users always have a 1:1 mapping to a session host. Only pooled host pools use breadth-first or depth-first."
---

Breadth-first load balancing in Azure Virtual Desktop sends each new user session to a session host chosen at random from the half of available hosts that currently have the fewest sessions. It aims to spread users across the pool so that CPU, memory and disk on each host are generally less contended, and it does not require a maximum session limit. The side-by-side decision between breadth-first and depth-first is covered in a separate article of this series.

## How a host is chosen

Learn describes the algorithm in two steps. First it queries the session hosts in the host pool that allow new connections. Then it selects a host randomly from half of that set, taking the hosts with the fewest sessions.

Learn's own example: nine session hosts have 11, 12, 13, 14, 15, 16, 17, 18 and 19 sessions. A new session does not automatically go to the host with 11. It can go to any of the first five hosts, those with the fewest sessions, at random. Learn states the consequence: because of the randomization, some sessions may not be evenly distributed across all session hosts.

## Rules shared with depth-first

Learn lists three behaviors that both algorithms share. The ones that matter most for breadth-first: a user who already has an active or disconnected session is redirected to the host with that session when signing in again, even if [drain mode](/entity/avd-drain-mode/) is on for that host, while for a user without a session the load balancer does not consider a drained host. The comparison article in this series walks through all three rules. You can configure one algorithm at a time per pooled host pool and change it at any time.

## The maximum session limit

Learn says you do not have to specify a maximum session limit for breadth-first. The [maximum session limit](/entity/avd-maximum-session-limit/) still exists, though. If you use breadth-first when first creating a host pool, the default value is 999999, which is also the highest possible number. The deployment page says to enter the maximum number of users that you want load-balanced to a single session host, and the terminology page adds that under high concurrent connection load, when several users connect at the same time, the number of sessions on a session host can exceed the limit. Learn also says that if you lower the limit on a session host while it has active user sessions, the change doesn't affect those sessions.

Autoscale changes this. The create-and-assign page says that when you use autoscale for a pooled host pool, you must configure a custom MaxSessionLimit and must not use the default. Learn's autoscale glossary defines the numbers involved: available host pool capacity is the maximum session limit multiplied by the number of available session hosts, and used host pool capacity is the number of active and disconnected sessions divided by that capacity. The create-and-assign page's own example: two session hosts with a limit of 20 sessions give an available capacity of 40 sessions; with a capacity threshold of 75 percent, autoscale turns on a third host once the hosts have more than 30 sessions, and the capacity becomes 60.

## Breadth-first and autoscale

A scaling plan sets a load balancing algorithm per phase. The scenarios page says that for pooled host pools autoscale ignores the algorithm in the host pool settings and applies load balancing based on the schedule, and the create-and-assign page says the preference chosen in the schedule overrides the one in the original host pool settings. That page also recommends breadth-first for ramp-up, to distribute users across existing hosts and keep access times fast. The autoscale FAQ gives an example for the whole day: breadth-first in ramp-up and peak, depth-first in ramp-down and off-peak so autoscale can consolidate sessions.

See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/) for how the phases of a schedule are defined.

Learn's first autoscale scenario uses breadth-first in ramp-up. The pool has six session hosts, a 30 percent capacity threshold, a 30 percent minimum percentage of hosts and a maximum session limit of 5. Autoscale starts two hosts to meet the minimum, because 30 percent of six is 1.8, rounded up to two. Available capacity is 10.

1. Three users sign in. Because the algorithm is breadth-first, their sessions are distributed across the two running hosts. Used capacity is 30 percent, which does not exceed the threshold, so autoscale starts nothing.
2. A fourth user signs in. Used capacity is 40 percent, above the threshold, so autoscale starts a third host. Capacity rises to 15 and used capacity falls to 27 percent.
3. A fifth user brings it to 33 percent, so a fourth host starts. At 5 sessions on 4 hosts capacity is 20 and use is 25 percent.

Learn's table continues from there: 6 sessions on 4 hosts is 30 percent, so nothing starts, and 7 sessions on 4 hosts is 35 percent, so a fifth host starts and capacity becomes 25 (28 percent). Because the limit is 5 in this example, each host adds 5 to the available capacity.

## Cost and performance

Learn frames the trade-off directly. Breadth-first is described as ideal for organizations that want to prioritize the user experience, because host resources such as CPU, memory and disk are generally less contended. Depth-first is described as ideal for cost-conscious organizations, because saturating one host at a time makes it easier to scale down the number of powered-on hosts when fewer users are signed in.

The two algorithms can also be combined in one scaling plan. The autoscale FAQ gives breadth-first in ramp-up and peak as an example, and depth-first in ramp-down and off-peak to help autoscale consolidate user sessions until it reaches the minimal possible number of session hosts. What autoscale does in ramp-down, including forced sign-out and running zero hosts after hours, is covered in the depth-first and scaling plan articles of this series; see also the [scaling plan](/entity/avd-scaling-plan/) entity.

## How to configure it

You need the **Desktop Virtualization Host Pool Contributor** role. In the Azure portal:

1. Search for and select **Azure Virtual Desktop**, then select **Host pools** and the host pool.
2. Select **Properties**.
3. For **Load balancing algorithm**, choose breadth-first from the drop-down, and for **Max session limit** enter a value.
4. Select **Save**.

In PowerShell, `Update-AzWvdHostPool` takes `-LoadBalancerType` and `-MaxSessionLimit`. Learn's load balancing page shows how to set breadth-first without changing the maximum session limit:

```powershell
$parameters = @{
    Name              = '<HostPoolName>'
    ResourceGroupName = '<ResourceGroupName>'
    LoadBalancerType  = 'BreadthFirst'
}
Update-AzWvdHostPool @parameters
```

To check the result, the same page uses `Get-AzWvdHostPool @parameters | Format-Table Name, LoadBalancerType, MaxSessionLimit`. The Azure CLI equivalent is `az desktopvirtualization hostpool update --resource-group <ResourceGroupName> --name <HostPoolName> --load-balancer-type BreadthFirst`. Learn introduces the PowerShell block as setting breadth-first "without adjusting the maximum session limit", so the existing limit stays as it was. To set a limit as well, add `-MaxSessionLimit` with your own value. Learn's depth-first examples set it to 10, as `MaxSessionLimit = '10'` in PowerShell and `--max-session-limit 10` in the Azure CLI. Learn's depth-first section says you can use Azure Virtual Desktop Insights to monitor the number of sessions on each session host and review session host performance to help determine the maximum session limit. For local use, Learn lists the `desktopvirtualization` Azure CLI extension or the `Az.DesktopVirtualization` PowerShell module as prerequisites.

## When to expect surprises

- **Uneven counts.** Random selection from half of the hosts will produce differences; Learn describes this as expected.
- **Drain mode under autoscale.** For pooled host pools, Learn says autoscale overwrites drain mode on the VMs included in scaling, so use exclusion tags for VMs you want left alone, for example while updating them.

## Related

- [Breadth-first load balancing](/entity/avd-breadth-first-load-balancing/)
- [Depth-first load balancing](/entity/avd-depth-first-load-balancing/)
- [AVD host pool](/entity/avd-host-pool/)
- [Pooled host pool](/entity/avd-pooled-host-pool/)
- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)

## Sources

All retrieved on 2026-11-17.

- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Update-AzWvdHostPool](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdhostpool)
