---
title: "How to size the maximum session limit per session host"
summary: "Microsoft Learn gives no formula for the maximum session limit, so you derive a starting value from the session host's vCPU count and workload type, then correct it with monitoring data. This guide shows the steps, a worked example and the points where the value affects load balancing and autoscale."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-maximum-session-limit, avd-host-pool]
keypoints:
  - "Learn gives no sizing formula for the maximum session limit. It points to Azure Virtual Desktop Insights for choosing the value, and its VM sizing guidance lists maximum users per vCPU: 6 light, 4 medium, 2 heavy, 1 power."
  - "Learn calls its sizing numbers initial estimates only, so multiply users per vCPU by your vCPU count to get a starting value, then validate with a pilot and watch users per core, input delay, CPU and memory."
  - "Capacity is the limit multiplied by the number of available hosts. As this article's arithmetic, a limit of 32 on two hosts gives 64 sessions, and a 75 percent threshold starts a third host above 48."
  - "Depth-first load balancing requires a limit. A breadth-first pool starts at 999999, and Learn says not to use the default value when autoscale manages a pooled pool."
  - "Lowering the limit on a host that has active sessions does not affect those sessions."
faq:
  - q: "Is there a recommended maximum session limit value?"
    a: "No. Microsoft Learn gives no recommended value. It says to use Azure Virtual Desktop Insights to find a value that suits your environment, and it lists maximum users per vCPU by workload type as a starting point."
  - q: "What happens if I leave the default of 999999?"
    a: "With breadth-first, a pool created without a custom value starts at 999999, the highest value you can set. Learn says not to use the default when autoscale manages a pooled pool, but it does not give a reason. A reasonable inference is that a capacity of that size can never reach a capacity threshold. Depth-first needs a real limit."
  - q: "Does changing the limit disconnect users?"
    a: "No. Learn says that lowering the maximum session limit on a session host that has active user sessions does not affect those existing sessions."
---

Microsoft Learn does not publish a formula for the maximum session limit. The practical method is to take a starting value from the VM's vCPU count and the workload type, set it on the host pool, and correct it with monitoring data. This guide walks through that in six steps, using Learn's pages on [load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing), [session host sizing](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs) and [autoscale](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan). What the value means and how it defines capacity is covered in "Maximum session limit in Azure Virtual Desktop: how it defines host pool capacity", so this guide concentrates on choosing a number.

## What the value controls

The [maximum session limit](/entity/avd-maximum-session-limit/) is a host pool property that sets how many user sessions one [session host](/entity/avd-session-host/) accepts. [Depth-first](/entity/avd-depth-first-load-balancing/) load balancing requires it, a pool created with [breadth-first](/entity/avd-breadth-first-load-balancing/) starts at 999999, and Learn says not to use the default value when autoscale manages a pooled [host pool](/entity/avd-host-pool/). Learn's [autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary) defines available capacity as the limit multiplied by the number of available session hosts.

Learn states the autoscale requirement without giving a reason. The consequences below are this article's reading of the formula, not Learn statements: a limit that is too high lets a host fill beyond what its CPU and memory support, and a limit that is too low reduces capacity and makes autoscale start hosts earlier.

## Step 1: Classify the workload

Learn's sizing page defines four workload types:

| Workload | Example users | Example apps |
|---|---|---|
| Light | Basic data entry | Database entry apps, command-line interfaces |
| Medium | Consultants, market researchers | Light apps plus Microsoft Word, static web pages |
| Heavy | Software engineers, content creators | Medium plus Outlook, PowerPoint, dynamic web pages, software development |
| Power | Graphic designers, 3D modelers, machine learning researchers | Heavy plus photo and video editing, CAD and CAM |

Pick the type that matches most of your users. Learn does not say how to size a mixed group. Splitting the groups across host pools is a practical option, and it is a judgment rather than a Learn rule.

## Step 2: Choose a VM size

For multi-session hosts, Learn recommends limiting the VM size to between 6 and 24 vCPUs. It says four cores is the lowest recommended count for a stable multi-session VM and that VMs should not have more than 32 cores. Return on investment drops at around 16 cores, and user experience is better with two 16-core VMs than with one 32-core VM. For 20 or more users on one host, Learn says several smaller VMs would perform better than one or two large ones.

The page is not fully consistent: a later sentence recommends a range of 4 to 24 cores, and the workload table lists 8 vCPUs as the minimum for light, medium and heavy. Treat the figures as guidance and test your own size.

Capacity scales less than linearly. Learn says the scaling factor typically ranges between 1.5 and 1.9, so an extra core adds proportional but not linear user capacity. It also states a 15 to 20 percent capacity cost for running on virtual machines compared with bare metal.

## Step 3: Calculate a starting value

Learn's multi-session table gives maximum users per vCPU:

| Workload | Maximum users per vCPU | Minimum vCPU / RAM / OS storage |
|---|---|---|
| Light | 6 | 8 vCPUs, 16 GB, 32 GB |
| Medium | 4 | 8 vCPUs, 16 GB, 32 GB |
| Heavy | 2 | 8 vCPUs, 16 GB, 32 GB |
| Power | 1 | 6 vCPUs, 56 GB, 340 GB |

Multiply the users per vCPU by the vCPUs of your VM size. The multiplication is this article's arithmetic, not a Learn figure. Learn describes all of these numbers as generic guidelines for initial performance estimates only.

Worked example: a medium workload on an 8-vCPU host gives 4 x 8 = 32 as a starting limit. A heavy workload on the same host gives 2 x 8 = 16. A light workload on a 16-vCPU host gives 6 x 16 = 96, which is a case to test carefully, because memory can become the limit. Learn says that raising memory from 8 GB to 16 GB can more than double the number of users when memory is the constraint. It gives no memory-per-user figure, so record memory use in the pilot.

## Step 4: Set the limit on the host pool

You need an existing pooled host pool and the **Desktop Virtualization Host Pool Contributor** role. In the Azure portal the setting is under the host pool's **Properties**, next to **Load balancing algorithm**. The portal steps are listed in the explainer, so here is the scripted path from Learn, which also reads the value back. Learn's example is titled for depth-first with a limit of 10: it sets `LoadBalancerType = 'DepthFirst'` as well, so change or remove that line if your pool uses breadth-first.

```powershell
$parameters = @{
    Name = '<HostPoolName>'
    ResourceGroupName = '<ResourceGroupName>'
    LoadBalancerType = 'DepthFirst'
    MaxSessionLimit = '10'
}
Update-AzWvdHostPool @parameters

Get-AzWvdHostPool -Name '<HostPoolName>' -ResourceGroupName '<ResourceGroupName>' |
    Format-Table Name, LoadBalancerType, MaxSessionLimit
```

The Azure CLI equivalent is `az desktopvirtualization hostpool update` with `--max-session-limit`, and `az desktopvirtualization hostpool show` reads it back. The value 10 is Learn's placeholder; use the number from step 3.

## Step 5: Check the effect on autoscale

Autoscale turns on a host when used capacity exceeds the capacity threshold, and used capacity counts active and disconnected sessions. Apply that to the starting value from step 3. With a limit of 32, two hosts give 64 sessions of capacity, and a 75 percent threshold means a third host starts when the sessions exceed 48. If that is too early or too late for your logon pattern, change the limit or the threshold, but not both at once, so you can see which change did what. The [capacity threshold](/entity/avd-capacity-threshold/) and phase settings are covered in the [scaling plan](/entity/avd-scaling-plan/) articles.

The same arithmetic gives a rough host count. For 200 concurrent medium-workload users and a limit of 32, the pool needs at least 200 / 32 = 6.25, so 7 hosts, if every host runs full. At 7 hosts the capacity is 224 sessions and 200 sessions is about 89 percent, above a 75 percent threshold. Keeping used capacity at or below 75 percent needs 200 / (32 x 0.75) = 8.3, so 9 hosts. This applies the consolidation formula from Learn's autoscale scenarios page, which Learn uses for the ramp-down phase, to peak sizing. The use for sizing is this article's, not a Learn example, and it shows why the limit, the threshold and the number of hosts have to be planned together.

Learn's sizing page says logon is CPU-intensive and tells you to plan for peak logon times such as the start of a work day at 9 AM. Its example: if 30 or more users sign in within 10 minutes on a 16-core host, two 8-core VMs would handle the load better.

## Step 6: Validate with Insights and adjust

Learn recommends [Azure Virtual Desktop Insights](/entity/avd-insights/) to monitor the number of sessions on each session host and the host's performance. Insights needs diagnostics, performance counters and Windows event logs collected into a Log Analytics workspace, and the monitoring users need the Desktop Virtualization Reader and Log Analytics Reader roles.

Useful measures from the Insights glossary:

- **Users per core**: the number of users per VM core. Learn suggests tracking the maximum over time to see whether the environment runs consistently high, low or fluctuating.
- **Input delay**: sampled every 30 seconds per session. Learn's bands are below 150 ms good, 150 to 500 ms acceptable, 500 to 2,000 ms poor and above 2,000 ms bad.
- **Performance counters**: processor time and memory counters such as available MBytes and percent committed bytes in use, collected every 30 seconds.

Learn gives no CPU or memory threshold for the limit. A working rule, which is this article's suggestion, is to compare input delay at peak with the bands above after each change. If peak input delay moves out of the good band while users per core sits at your limit, lower the value. If CPU and memory stay low at the limit, raise it in small steps. Learn says only that lowering the limit does not affect existing sessions. It does not describe how the new value is applied afterwards, so confirm the result in Insights after the next logon peak.

## Common mistakes

- **Keeping 999999 on a depth-first pool.** Depth-first requires a limit, Learn says not to use the default value when autoscale manages the pool, and it points to Insights for finding a value that fits your environment.
- **Reading the table's minimums as sizes.** The Power row lists a minimum of 6 vCPUs, and its example sizes, such as D16ds_v5 and NV6, differ in vCPU count. Check the vCPU count of the size you deploy.
- **Ignoring disconnected sessions.** Autoscale counts them as used capacity, so a limit that is too tight combined with long-lived disconnected sessions starts hosts earlier than expected.
- **Treating the number as fixed.** Learn describes its figures as initial estimates, so pilot before you commit.

## Related

- [AVD host pool](/entity/avd-host-pool/)
- [Maximum session limit](/entity/avd-maximum-session-limit/)
- [Azure Virtual Desktop Insights](/entity/avd-insights/)

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Configure host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [Microsoft Learn: Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Update-AzWvdHostPool](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdhostpool)
