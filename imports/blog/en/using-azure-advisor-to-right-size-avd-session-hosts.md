---
title: "Using Azure Advisor to right-size AVD session hosts"
summary: "Azure Advisor flags under-used VMs from CPU, memory and outbound network data, but it does not see Azure Virtual Desktop sessions. This article shows how to turn its recommendations into a safe resize: collect, cross-check with session data, pick a size, apply it and verify."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-advisor, azure]
keypoints:
  - "Advisor's resize recommendation targets a size on which P95 of CPU and outbound network stays at 40 percent or lower and P99 of memory at 60 percent or lower for user-facing workloads. Learn says the last seven days are analyzed and lets you change the lookback to 7, 14, 21, 30, 60 or 90 days."
  - "The right-size page does not mention Azure Virtual Desktop. A smaller VM changes how many sessions fit, so recalculate the maximum session limit and the host count before you accept a suggestion."
  - "In a pool with a session host configuration, session host update changes the VM size for all hosts in batches. Disable autoscale before it starts and keep it off until it finishes."
  - "Savings in Advisor use retail rates and ignore reservations and savings plans, so a size change can cost more than shown if a reservation covers the current series."
  - "Verify after the change with AVD Insights data and give Advisor at least one lookback period before judging the new recommendation list."
faq:
  - q: "Does Azure Advisor know how many users are on a session host?"
    a: "No. The right-size page describes CPU, memory and outbound network utilization of the VM and does not mention Azure Virtual Desktop sessions. Check session counts and the maximum session limit in AVD Insights or your own data before applying a suggestion."
  - q: "Can I resize AVD session hosts without recreating them?"
    a: "Yes, for a single VM. Learn says changing the size of a running VM restarts it, and in some cases it must be deallocated. Hosts in a pool with a session host configuration can instead be changed through session host update, which replaces the VMs in batches."
  - q: "How long should I wait after a resize before trusting Advisor again?"
    a: "Learn does not say how data from before a resize is treated. Learn analyzes the last seven days unless you change the lookback, which can be as long as 90 days, so allow at least one full lookback period and compare against AVD Insights data in the meantime."
---

To right-size AVD session hosts with Azure Advisor, open the cost recommendations, list the "Right-size or shutdown underutilized virtual machines" items for your session host resource groups, and treat each one as a candidate, not an instruction. Check the host against its session data, choose a size inside Microsoft's sizing guidance, apply the change in a controlled way and verify the result. Advisor sees a VM; AVD admins also have to think about sessions. The background on categories, scores and permissions is in the companion explainer on Azure Advisor.

## What Advisor measures, and what it does not

Learn's right-size page describes two recommendation types for VMs and scale sets.

**Shutdown.** Advisor recommends it for resources that were not used at all over the last seven days: P95 of the maximum CPU utilization (summed across cores) below 3 percent, P100 of average CPU over the last 3 days at 2 percent or less, and outbound network below 2 percent over seven days. Memory is not considered.

**Resize.** Advisor looks at CPU, memory and outbound network and searches for a cheaper size, based on retail rates, that would fit the same load. The target thresholds on the recommended size are:

| Workload type | CPU and outbound network | Memory |
|---|---|---|
| User-facing | P95 of 40 percent or lower | P99 of 60 percent or lower |
| Non user-facing | P95 of 80 percent or lower | P99 of 80 percent or lower |

Advisor decides whether a workload is user-facing from its CPU utilization characteristics. The new size must have the same Accelerated Networking and Premium Storage capabilities, be supported in the VM's region and be cheaper. A suggestion can be a smaller size in the same family, a newer version or a different family. Metrics are sampled every 30 seconds and aggregated to 30-minute values. Learn says the last seven days of data are analyzed and that the lookback period can be changed in the configurations to 7, 14, 21, 30, 60 or 90 days, with updates taking up to 48 hours.

The page does not mention Azure Virtual Desktop. It says a recommendation may not apply when a VM was provisioned for upcoming traffic, uses resources Advisor does not consider, is under test or is used for disaster recovery. Learn does not say how deallocated hours are treated, which matters when [autoscale](/entity/avd-power-management-autoscaling/) deallocates hosts in ramp-down.

The opposite direction exists too. The performance recommendation "Upgrade size of most active virtual machines to prevent resource exhaustion and improve performance" fires when CPU and memory are both at 90 percent or more of the current size's limits (P50 of the 30-minute averages), or when cached IOPS or uncached bandwidth reach 95 percent, each with an extra condition on disk limits. Learn's page for highly used VMs gives the observation period as the past seven days and says metrics are aggregated over a minimum of seven days. In a [pooled host pool](/entity/avd-pooled-host-pool/) with depth-first load balancing, in our reading the first hosts can appear here while the last ones appear in the cost list, because depth-first fills one host at a time up to the limit.

## Step 1: collect the candidates

1. In the Azure portal, open **Advisor**. Reading recommendations needs Reader on the resource or above.
2. On the **Overview** page, set **Resource Group** to the groups that hold your session hosts and keep **Recommendation Status** at Active.
3. Select the **Cost** tile and open "Right-size or shutdown underutilized virtual machines". Select **Impacted resources**.
4. Select **Download as CSV**. The export respects your filters. Add the **Performance** list the same way.
5. Optional: under **Configuration**, open the **VM/VMSS right sizing** tab and set the average CPU filter per subscription. Learn says this only changes which recommendations are shown, not how they are generated.

New VMs can take up to 24 hours to appear.

## Step 2: cross-check each host with AVD data

Advisor sees one VM. For each candidate, collect what it cannot see:

- Peak concurrent sessions per host and pool, and the [maximum session limit](/entity/avd-maximum-session-limit/).
- The pool's [capacity threshold](/entity/avd-capacity-threshold/) and scaling plan phases.
- The workload type (light, medium, heavy or power) of the users on that pool.

[Azure Virtual Desktop Insights](/entity/avd-insights/) is the usual source for sessions per host and host performance, and the load balancing page recommends it for choosing a limit. It needs the Azure Monitor Agent on every session host, a data collection rule and a Log Analytics workspace, with standard storage charges.

Then check the arithmetic. Learn's autoscale scenarios page gives, for ramp-down consolidation, Required Hosts = Total Sessions (Active + Disconnected) / (Max Session Limit x Capacity Threshold %), where autoscale assumes disconnected users may reconnect immediately. Using it for a peak check, and rounding up to whole hosts, is our own arithmetic.

**Example (hypothetical numbers, not Advisor output).** A pool has four D16s_v5 hosts (16 vCPUs each), a maximum session limit of 16, a capacity threshold of 80 percent and 50 peak sessions. Required hosts: 50 / (16 × 0.8) = 3.9, rounded up to 4. Advisor suggests D8s_v5 (8 vCPUs). Two ways to read it:

- **Keep four hosts and a limit of 16.** The pool then runs 2 sessions per vCPU at the limit, instead of 1. Learn's multi-session table gives maximum users per vCPU of 6 (light), 4 (medium), 2 (heavy) and 1 (power) as initial estimates. For a heavy workload, 2 per vCPU sits at the ceiling, so pilot it.
- **Halve the limit to keep the experience.** With a limit of 8, hosts required are 50 / (8 × 0.8) = 7.8, rounded up to 8, so eight 8-vCPU hosts. Total vCPUs stay at 64, so the per-VM saving Advisor shows no longer describes the pool.

Pick the reading that matches measured use, not the larger number in the cost list.

## Step 3: choose the target size

Learn's sizing guidance for multi-session hosts says to limit VM size to between 6 and 24 vCPUs, calls four cores the lowest recommended number for a stable multi-session VM and later names 4 to 24 cores as the recommended range. It does not reconcile the figures; in our reading, treat 4 as the floor and 6 or more as the target. It also says VMs should not exceed 32 cores and that two 16-core VMs give a better experience than one 32-core VM. Learn's examples for light, medium and heavy multi-session workloads include D8s_v5, D16s_v5 and F8s_v2.

Check three practical limits first:

- **Temp disk:** Windows VMs can only resize between sizes that both have a local temp disk or both have none.
- **Availability:** if a running VM does not list the size you want, stopping it can reveal more sizes.
- **Quota:** confirm subscription quota before an update on a whole pool.

If a reservation or savings plan covers the current series, Learn warns that a cross-series change might raise cost, because the recommendations ignore them; see [Azure Reservations](/entity/azure-reservations/) and [savings plans](/entity/azure-savings-plans/).

## Step 4: apply the change

**Pools with a session host configuration.** Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages still carry preview wording, and Learn's page on updating session hosts says the Azure PowerShell cmdlets for these pools are in preview, so check the current page before relying on a limit. In the portal:

1. Open **Azure Virtual Desktop**, then **Host pools**, and select the pool.
2. Select **Session hosts**, then **Manage session host update** and **New update**.
3. On **Basics**, review the batch size. On **Session hosts**, pick a size under **Virtual machine size** (or **See all sizes**).
4. Set the schedule, the sign-out timing and message, review and select **Update**.

Learn's cautions: disable autoscale before the update and keep it disabled until it finishes, or the update can fail with a runtime error. Only one update can run or be scheduled per pool. One host is updated first, then batches. Hosts go into drain mode, and replacement VMs are created and the originals deleted. Manually added files, registry keys and certificates are lost, and the Azure Monitor agent is not installed automatically on updated hosts, which leaves a gap in Insights data. The feature is available only in global Azure.

**Other pools.** Resize each VM: under **Virtual machines**, select the VM, then **Availability + scale**, **Size**, choose a compatible size and select **Resize**. Learn says a running VM restarts, calls it a disruptive operation, and says that after a failed resize the VM model shows the requested size while the VM keeps running on its previous size. Our recommendation, not a Learn step: work in rolling groups, each host in drain mode and empty, so the pool keeps capacity.

## Step 5: verify and record

1. Re-enable autoscale and confirm the maximum session limit and capacity threshold match your recalculation.
2. Watch sessions per host and CPU and memory in Insights through the next peak.
3. Wait at least one lookback period before judging Advisor's new list.
4. For suggestions you decline, use **Postpone** or **Dismiss** (Contributor or better on the resource) and record the reason; the companion explainer covers the score effect.

## An AVD-aware alternative

Nerdio Manager has a similar rule, "Right-size AVD pooled desktops", described on its help site; its recommendations appear on Nerdio's own Advisor > Recommendations page, not in Azure Advisor. It recommends size increases or decreases from the guest counters Processor Information/% Processor Time and Memory/Available MBytes over the last 30 days, with default triggers of 80 percent (increase) and 60 percent (decrease). The help page describes the triggers in two ways: the rule settings speak of average CPU and RAM use, the calculation section of a 90th-percentile baseline. It is also unclear for "Active session only": the rule settings say enabled by default, while the calculation section says periods with any sessions count by default, and always when the active period is under 72 hours. Check the flag in your rule. The VM should be powered on for at least 72 hours (not necessarily continuous); with 24 to 72 hours of data, recommendations show a warning; data from before a resize is not used. A and B-series sizes are excluded, and optional settings respect quota and limit allowed VM sizes. The rule requires a dynamic host pool with auto-scale on and CPU and RAM data collection enabled. It recommends only; the help page does not describe automatic resizing. See [Nerdio host pool and VM right-sizing](/entity/nerdio-right-sizing/). The trade-off: Advisor needs no additional product but ignores sessions; the Nerdio rule needs Nerdio Manager and session-aware data collection.

## Sources

Last checked 17 November 2026.

- [Microsoft Learn: Right-size or shut down underutilized virtual machines](https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations)
- [Microsoft Learn: Improve the performance of highly used VMs using Azure Advisor](https://learn.microsoft.com/en-us/azure/advisor/advisor-how-to-performance-resize-high-usage-vm-recommendations)
- [Microsoft Learn: Azure Advisor portal basics](https://learn.microsoft.com/en-us/azure/advisor/advisor-get-started)
- [Microsoft Learn: Permissions in Azure Advisor](https://learn.microsoft.com/en-us/azure/advisor/permissions)
- [Microsoft Learn: Performance recommendations (Advisor reference)](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-performance-recommendations)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts in a host pool with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Change the size of a virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/resize-vm)
- [Microsoft Learn: Remote Desktop workloads and VM sizing recommendations](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Configure host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Enable Insights for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio Manager help: Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124363575053)
