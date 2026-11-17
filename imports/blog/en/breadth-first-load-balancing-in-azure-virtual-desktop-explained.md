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

Breadth-first load balancing in Azure Virtual Desktop sends each new user session to a session host chosen at random from the half of available hosts that currently have the fewest sessions. It aims to spread users across the pool so that CPU, memory and disk on each host are less contended, and it does not require a maximum session limit. The side-by-side decision between breadth-first and depth-first is covered in a separate article of this series.

## How a host is chosen

Learn describes the algorithm in two steps. First it queries the session hosts in the host pool that allow new connections. Then it selects a host randomly from half of that set, taking the hosts with the fewest sessions.

Learn's own example: nine session hosts have 11, 12, 13, 14, 15, 16, 17, 18 and 19 sessions. A new session does not automatically go to the host with 11. It can go to any of the first five hosts, those with the fewest sessions, at random. Learn states the consequence: because of the randomization, some sessions may not be evenly distributed across all session hosts.

Our reading: breadth-first keeps the most heavily loaded hosts from receiving new sessions, but it does not guarantee equal counts.

## Rules shared with depth-first

Learn lists three behaviors that both algorithms share. The ones that matter most for breadth-first: a user who already has an active or disconnected session is redirected to the host with that session when signing in again, even if [drain mode](/entity/avd-drain-mode/) is on for that host, while for a user without a session the load balancer does not consider a drained host. The comparison article in this series walks through all three rules. You can configure one algorithm at a time per pooled host pool and change it at any time.

## The maximum session limit

Learn says you do not have to specify a maximum session limit for breadth-first, and the load balancing page describes the breadth-first selection without mentioning it. The [maximum session limit](/entity/avd-maximum-session-limit/) still exists, though. When you create a host pool with breadth-first, the default is 999999, which is also the highest value you can set. The deployment page says to enter the maximum number of users that you want load-balanced to a single session host, and the terminology page adds that under high concurrent connection load the number of sessions on a host can exceed it. Learn does not say how breadth-first uses the limit when it picks a host.

Autoscale changes this. The create-and-assign page says that when you use autoscale for a pooled host pool, you must configure a custom MaxSessionLimit and must not use the default. Learn's autoscale glossary defines the numbers involved: available host pool capacity is the maximum session limit multiplied by the number of available session hosts, and used host pool capacity is the number of active and disconnected sessions divided by that capacity. With two hosts and a limit of 20, the create-and-assign page's own example gives a capacity of 40 sessions. Learn gives no reason for the custom-limit rule; our inference is that the capacity threshold only means something when the limit is a real figure, because capacity is built from it. One more Learn rule applies to the limit: if you lower it on a host that has active sessions, the change does not affect those existing sessions.

## Breadth-first and autoscale

A scaling plan sets a load balancing algorithm per phase. The scenarios page says that for pooled host pools autoscale ignores the algorithm in the host pool settings and applies load balancing based on the schedule, and the create-and-assign page says the preference chosen in the schedule overrides the one in the original host pool settings. That page also recommends breadth-first for ramp-up, to distribute users across existing hosts and keep access times fast. The autoscale FAQ gives an example for the whole day: breadth-first in ramp-up and peak, depth-first in ramp-down and off-peak so autoscale can consolidate sessions. Learn does not say whether the host pool's own **Load balancing algorithm** property changes when a plan takes over; what it states is that the schedule is what autoscale applies.

Autoscale logs can be sent to a storage account or an event hub from the scaling plan's **Diagnostic Settings** (**Add diagnostic setting**, then **Autoscale logs**). Learn's sample log, dated 2021, shows a `HostPoolLoadBalancerTypeUpdated` entry with `PreviousLoadBalancerType` set to `BreadthFirst` and `NewLoadBalancerType` set to `DepthFirst`; Learn does not say when autoscale writes such an entry. See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/).

Learn's first autoscale scenario uses breadth-first in ramp-up. The pool has six session hosts, a 30 percent capacity threshold, a 30 percent minimum percentage of hosts and a maximum session limit of 5. Autoscale starts two hosts to meet the minimum, because 30 percent of six is 1.8, rounded up to two. Available capacity is 10.

1. Three users sign in. Because the algorithm is breadth-first, their sessions are distributed across the two running hosts. Used capacity is 30 percent, which does not exceed the threshold, so autoscale starts nothing.
2. A fourth user signs in. Used capacity is 40 percent, above the threshold, so autoscale starts a third host. Capacity rises to 15 and used capacity falls to 27 percent.
3. A fifth user brings it to 33 percent, so a fourth host starts. At 5 sessions on 4 hosts capacity is 20 and use is 25 percent.

## Cost and performance

Learn frames the trade-off directly. Breadth-first is described as ideal for organizations that want to prioritize the user experience, because host resources such as CPU, memory and disk are generally less contended. Depth-first is described as ideal for cost-conscious organizations, because saturating one host at a time makes it easier to scale down the number of powered-on hosts when fewer users are signed in.

Ramp-down is where the cost side is decided, and the schedule's own algorithm applies there; Learn's FAQ example uses depth-first for ramp-down and off-peak. Learn says that, with or without forced sign-out, autoscale only shuts down hosts if all existing sessions (active and disconnected) can be consolidated onto fewer hosts without exceeding the capacity threshold, and the minimum percentage of hosts is still respected. With forced sign-out, autoscale takes the host with the fewest sessions, puts it in drain mode, notifies the users, signs them out after the wait time and then deallocates the VM. Without forced sign-out, you choose between **VMs have no active or disconnected sessions** and **VMs have no active sessions**.

For the second option, the autoscale FAQ says disconnected sessions are still treated as active sessions in capacity calculations, so hosts that hold only disconnected sessions can stay running, while autoscale consolidates disconnected users onto fewer hosts. The scenarios page says autoscale waits for users to sign out voluntarily, then consolidates and deallocates hosts with no sessions. Our reading: Learn does not spell out what happens to disconnected sessions on a host that autoscale wants to remove without forced sign-out, so test it on a pilot pool before you plan costs around it.

To run zero hosts after hours, the FAQ says there must be zero user sessions, disconnected ones included, and the minimum percentage of hosts must be 0%. It suggests the group policy **Set time limit for disconnected sessions** (Session Time Limits under Remote Desktop Session Host) with a timeout such as 15 to 30 minutes that completes before ramp-down ends. For the cost side, see the [scaling plan](/entity/avd-scaling-plan/) articles in this series; the decision itself is in the comparison with depth-first.

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

To check the result, the same page uses `Get-AzWvdHostPool @parameters | Format-Table Name, LoadBalancerType, MaxSessionLimit`. The Azure CLI equivalent is `az desktopvirtualization hostpool update --resource-group <ResourceGroupName> --name <HostPoolName> --load-balancer-type BreadthFirst`. Learn introduces the PowerShell block as setting breadth-first "without adjusting the maximum session limit", so the existing limit stays as it was. To set a limit as well, add `-MaxSessionLimit` with your own value, for example `-MaxSessionLimit 12`; in the Azure CLI, Learn's depth-first example adds `--max-session-limit 10`. The 12 is only an example. Learn's depth-first section says you can use Insights to monitor the number of sessions on each session host and review session host performance to help determine the limit; our inference is that the same data can help for breadth-first. For local use, Learn lists the `desktopvirtualization` Azure CLI extension or the `Az.DesktopVirtualization` PowerShell module as prerequisites.

## When to expect surprises

- **Personal pools.** There is no algorithm to set. Learn says users map 1:1 to a session host.
- **Uneven counts.** Random selection from half of the hosts will produce differences; Learn describes this as expected.
- **Autoscale.** Under an assigned scaling plan for a pooled host pool, the schedule's algorithm is the one autoscale applies, not the host pool setting.
- **The limit.** Outside autoscale, the load balancing page does not describe how the limit enters breadth-first selection, and a host can exceed it under concurrent sign-in load. Test in a pilot pool before you rely on it as a cap.
- **Disconnected sessions.** They can keep hosts running after hours; see the zero-hosts note above.

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
- [Microsoft Learn: Set up diagnostics for Autoscale](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: Update-AzWvdHostPool](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdhostpool)
