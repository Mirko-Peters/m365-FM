---
title: "How rounding up works with the minimum percentage of hosts, with worked examples"
summary: "Learn says a minimum percentage that is not a whole number is rounded up to the nearest whole number, and by the rounding rule any value above 0 percent keeps at least one host on. This article works through the rule with tables, Learn's own examples and the separate round-up in the ramp-down consolidation formula."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-minimum-percentage-of-hosts, avd-scaling-plan]
keypoints:
  - "Learn's wording is: if the percentage you enter is not a whole number, it is rounded up to the nearest whole number. In its examples this means hosts: 30 percent of six is 1.8 and autoscale turns on two."
  - "It follows from the rounding rule, and is not a Learn quotation, that any percentage above 0 keeps at least one host on and that the effective share can be well above the typed value in small pools."
  - "A second round-up exists in the ramp-down and off-peak consolidation formula, Required Hosts = CEILING(sessions / (maximum session limit x capacity threshold)). Learn's troubleshooting article says autoscale uses the higher of that result and the 'Minimum percentage of active hosts' setting, which this article reads as the minimum percentage of hosts."
  - "To get exactly k hosts out of N, choose a percentage greater than (k-1)/N and at most k/N. The tables in this article are arithmetic from the Learn rule, not Learn tables."
  - "The Azure resource reference types the ramp-up and ramp-down minimum host percentage as an integer from 0 to 100. The scaling plan and scenarios articles do not say whether the portal field accepts decimals, whether unhealthy hosts count, or how the dynamic autoscaling field rounds, so test those on a pilot pool."
faq:
  - q: "Which percentage keeps exactly N hosts on?"
    a: "For k hosts in a pool of N, use a percentage greater than (k-1)/N and at most k/N, times 100. In a pool of 7, 1 to 14 percent keeps one host, 15 to 28 keeps two and 29 to 42 keeps three. This is arithmetic from Learn's rounding rule, not a Learn table."
  - q: "Why does a low percentage still keep a host running in a small pool?"
    a: "Because any result above zero rounds up to at least one host, which follows from the rounding rule. Ten percent of six hosts is 0.6, and Learn's scenarios show one host staying on. Only 0 percent, together with no user sessions, lets autoscale turn off every host."
  - q: "Is the consolidation formula rounded the same way?"
    a: "It also rounds up. Learn gives Required Hosts = CEILING(Total User Sessions / (Max Session Limit x Capacity Threshold)). During ramp-down and off-peak, the troubleshooting article says autoscale uses the higher of that result and the 'Minimum percentage of active hosts' setting. Applying that to the minimum percentage of hosts is an inference."
---

Learn says that if the percentage you enter for the minimum percentage of hosts is not a whole number, it is rounded up to the nearest whole number. In Learn's examples that means hosts: thirty percent of six hosts is 1.8, so two hosts stay on. By that rule, any percentage above 0 keeps at least one host running. This article shows the rule with tables you can check by hand, then covers the second round-up in the ramp-down consolidation formula and the cases where Learn is silent. Sources are listed at the end and were retrieved on 17 November 2026. For the concept itself, see the sibling article "Minimum percentage of hosts in AVD autoscale explained".

## The rule as Learn states it

Two statements carry the rule:

- The [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) describes the ramp-up field: "If the percentage you enter isn't a whole number, it's rounded up to the nearest whole number." Its example is a host pool of seven session hosts with 10 percent, where one session host stays on and is not turned off by autoscale.
- The [scenarios article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) shows six hosts, a 30 percent minimum and two hosts turned on. In its words, 30 percent of six is not a whole number, so autoscale rounds up.

The [glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary) defines the base: the percentage applies to all session hosts in the host pool. In formula form, which is a restatement and not a Learn formula:

hosts kept on = CEILING(total session hosts x percentage / 100)

Learn states the rounding on the ramp-up field and in scenario 1. Its ramp-down and off-peak scenarios are consistent with the same rule: ten percent of six hosts is 0.6, and the scenarios keep one host on. Applying the rule to those phases is an inference from the scenarios. The Learn sentence also says "percentage", not "hosts"; reading it as rounding the host count follows from its seven-host example and from scenario 1. The [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) entity page has the short definition.

## Table: hosts kept on

The table below is calculated with the formula above. It is not copied from Learn, and the cells that match Learn's own examples are the 6-host 30 percent cell (2) and the 7-host 10 percent cell (1).

| Hosts in pool | 0% | 5% | 10% | 15% | 20% | 25% | 30% | 50% |
|---|---|---|---|---|---|---|---|---|
| 3 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 2 |
| 6 | 0 | 1 | 1 | 1 | 2 | 2 | 2 | 3 |
| 7 | 0 | 1 | 1 | 2 | 2 | 2 | 3 | 4 |
| 10 | 0 | 1 | 1 | 2 | 2 | 3 | 3 | 5 |
| 12 | 0 | 1 | 2 | 2 | 3 | 3 | 4 | 6 |
| 15 | 0 | 1 | 2 | 3 | 3 | 4 | 5 | 8 |
| 20 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10 |
| 40 | 0 | 2 | 4 | 6 | 8 | 10 | 12 | 20 |
| 100 | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 50 |

Three patterns follow from the table:

1. **The first host is cheap to trigger.** Every percentage above 0 keeps at least one host on, whatever the pool size. Only 0 percent gives zero hosts.
2. **Small pools drift upward.** In a pool of 6 hosts, a typed 10 percent keeps 1 host, an effective 16.7 percent. In a pool of 3 hosts, a typed 5 percent keeps 1 host, an effective 33 percent.
3. **Exact results do not round.** Ten percent of 10 hosts is exactly 1, and 25 percent of 20 is exactly 5. Rounding only matters when the product has a fraction.

## Going the other way: which percentage gives k hosts

If you want exactly k hosts out of N, the percentage must be greater than (k-1)/N and at most k/N, all times 100. Using whole-number percentages:

| Pool size | Hosts wanted | Percentages that give it |
|---|---|---|
| 7 | 1 | 1 to 14 |
| 7 | 2 | 15 to 28 |
| 7 | 3 | 29 to 42 |
| 12 | 2 | 9 to 16 |
| 12 | 3 | 17 to 25 |

The 7-host rows can be checked by hand. Fourteen percent of 7 is 0.98 and rounds to 1. Fifteen percent is 1.05 and rounds to 2. The Azure resource reference types the schedule properties `rampUpMinimumHostsPct` and `rampDownMinimumHostsPct` as integers from 0 to 100, and the scaling plan article does not say whether the portal field accepts decimals, so this article stays with whole numbers. With integer percentages the rounding always acts on the product of host count and percentage, which is why it ends up as a whole number of hosts.

The result is sensitive to pool size. If you add hosts to the pool, the same percentage can keep more hosts on. A pool that grows from 20 to 21 hosts moves a 30 percent minimum from 6 hosts (exactly 6.0) to 7 hosts (6.3 rounds up). Recheck the percentage whenever the pool size changes.

## The second round-up: consolidation

Rounding up also appears in how autoscale decides how many hosts are needed for the sessions that exist during ramp-down and off-peak. The glossary describes session consolidation. Autoscale counts all user sessions, active and disconnected, assumes disconnected users will reconnect, calculates the minimum hosts needed and deallocates the excess hosts. The troubleshooting article gives the formula:

Required Hosts = CEILING(Total User Sessions / (Max Session Limit x Capacity Threshold))

with the capacity threshold written as a decimal. Rows 1 to 3 are Learn's examples, and row 4 is the calculation for Learn's scenario 3:

| Sessions | Max session limit | Capacity threshold | Calculation | Result |
|---|---|---|---|---|
| 8 disconnected | 10 | 80% | 8 / (10 x 0.8) = 1 | 1 host |
| 6 disconnected | 5 | 90% | 6 / 4.5 = 1.33 | 2 hosts |
| 9 disconnected | 5 | 90% | 9 / 4.5 = 2 | 2 hosts |
| 4 sessions | 5 | 75% | 4 / 3.75 = 1.07 | 2 hosts |

The first row is the glossary's session consolidation example. The second is the autoscale FAQ's example and the third appears in both the FAQ and the troubleshooting article. The last row uses the inputs of scenario 3 on the scenarios page (limit 5, threshold 75 percent, 4 sessions), where Learn says autoscale can turn off two of four hosts. The division is calculated for this article and does not appear on Learn's page. The 1.07 shows how little it takes: a value just above a whole number costs one more host.

## Combining both: the higher value wins

The troubleshooting article says that during ramp-down and off-peak autoscale uses the higher of two values: the formula result and the "Minimum percentage of active hosts" setting in the scaling plan phase. That is also the name of the dynamic autoscaling field, and the page says its guidance covers both power management autoscaling and dynamic autoscaling. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. The troubleshooting page never uses the portal label "Minimum percentage of hosts". Applying the rule to the power management field is therefore an inference. It is consistent with the scaling plan article, which says the minimum percentage of hosts is still respected during ramp-down, and with scenario 3, where a 10 percent minimum keeps the last host on. The examples below use the "Minimum percentage of hosts" field on that basis; they are calculated, not taken from Learn.

| Pool | Sessions | Max session limit | Threshold | Formula | Minimum | Hosts kept on |
|---|---|---|---|---|---|---|
| 20 hosts | 8 disconnected | 10 | 80% | 1 | 10% = 2 | 2, minimum wins |
| 12 hosts | 9 disconnected | 5 | 90% | 2 | 25% = 3 | 3, minimum wins |
| 20 hosts | 40 | 8 | 75% | 40 / 6 = 6.67, so 7 | 30% = 6 | 7, formula wins |
| 20 hosts | 0 | 10 | 75% | 0 | 5% = 1 | 1 |
| 20 hosts | 0 | 10 | 75% | 0 | 0% = 0 | 0 |

The last two rows depend on the FAQ statement that autoscale can turn off all VMs only when the minimum is 0 percent and no sessions remain. Disconnected sessions count as sessions, so the zero-host case also needs a time limit for disconnected sessions, which the FAQ configures through Group Policy and the scaling plan article also describes with Microsoft Intune.

## What the scaling plan and scenarios articles leave open

- **Decimals.** The Azure resource reference gives integers from 0 to 100 for the ramp-up and ramp-down properties. The scaling plan article gives no range for the portal field and does not say whether decimal percentages are accepted.
- **Unhealthy hosts.** The glossary defines the percentage against all session hosts. It does not say whether a host that fails agent health checks, and so is not an available session host, changes the count.
- **Tagged hosts.** The portal text says hosts with the exclusion tag still count in the calculation of the minimum percentage. Because autoscale cannot turn them on, an excluded host that is off cannot help meet the minimum. See [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/).
- **The dynamic field.** For dynamic autoscaling, the field "Minimum percentage of active hosts (%)" is based on the minimum host pool size. Learn's example, 10 percent of a minimum size of 10, gives exactly one host, so it shows no rounding. The scenarios article does not state how a fractional result is handled.
- **A typo.** The final table of scenario 4 shows 19 percent where the text shows 10 percent.

## Checking your own pool

1. Write down the number of session hosts, including tagged ones.
2. Compute CEILING(hosts x percentage / 100) for each phase and compare it with the number you intended.
3. For ramp-down and off-peak, compute the consolidation formula with your [maximum session limit](/entity/avd-maximum-session-limit/) and [capacity threshold](/entity/avd-capacity-threshold/) for a few session counts, and note which value is higher.
4. Run a test day and compare the number of running hosts in each phase with the calculation.
5. Repeat the check whenever the pool size changes.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Troubleshoot autoscale in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Microsoft.DesktopVirtualization scalingPlans template reference](https://learn.microsoft.com/en-us/azure/templates/microsoft.desktopvirtualization/scalingplans)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
