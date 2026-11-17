---
title: "How to use the exclusion tag for maintenance windows and special session hosts"
summary: "To patch an Azure Virtual Desktop session host without autoscale interfering, tag the VM with the scaling plan's exclusion tag first, then turn on drain mode, wait for sessions to end, do the work, and undo both. This article covers the tag mechanics, the commands and the capacity check to run before you tag."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scaling-plan-exclusion-tag, avd-scaling-plan]
keypoints:
  - "Tag the VM before you turn on drain mode. Autoscale overrides drain mode on every VM it scales, so drain mode alone does not protect a host in a pooled host pool."
  - "Tag with the Azure portal or Update-AzTag with the Merge operation, and remove the tag with the Delete operation or in the portal when the work is done. The Tag Contributor role cannot tag resources in the portal, only through PowerShell or REST."
  - "Check the capacity of the remaining untagged hosts first. Tagged hosts are still part of the minimum percentage calculation, but autoscale cannot start them, and Learn does not say whether a running tagged host satisfies the minimum."
  - "The tag applies in all phases of the schedule and Learn describes no time limit for it, so removing it after the work is your step."
  - "Learn documents the tag for maintenance. Using it for test or always-on hosts follows from its definition and is not described as a use case."
faq:
  - q: "Do I need drain mode if the VM carries the exclusion tag?"
    a: "For maintenance, yes. The tag only stops autoscale from changing the host. It does not stop new sessions, so you still turn on drain mode so that new connections go to other session hosts and the host can empty out."
  - q: "What happens if I turn on drain mode without the tag?"
    a: "In a pooled host pool, Microsoft Learn says autoscale overrides drain mode on all VMs included in scaling, no matter who set it. Autoscale can therefore change the drain mode you set or turn the host on or off while you work."
  - q: "Which roles do I need?"
    a: "Learn lists the Desktop Virtualization Session Host Operator role for drain mode. For tags it names the Tag Contributor role, which supports tag operations through Azure PowerShell and REST but not on resources in the Azure portal. Turning a VM on or off is a separate Azure permission that these pages do not cover."
---

To take a pooled Azure Virtual Desktop session host out of service without autoscale interfering, tag the VM with the scaling plan's exclusion tag first, then turn on drain mode, wait for the sessions to end, do the maintenance, and undo both steps. Order matters, because autoscale overwrites drain mode on any VM it manages. What the tag is and where Learn leaves questions open is explained in "Exclusion tags in AVD autoscale: keeping individual VMs out of scaling". The drain mode side of a single-host patch, including how to message and end sessions, is the runbook in "How to use drain mode for patching and maintenance of session hosts". This article covers the tag mechanics and the checks around them.

## Before you start

You need three things in place.

- **An exclusion tag name on the scaling plan.** In the Azure portal open **Azure Virtual Desktop**, select **Scaling plans**, open the plan and check the **Properties** tab. If the field is empty, enter a name there. Learn's example is `excludeFromScaling`. Changes to an assigned plan apply immediately.
- **Permissions.** Learn lists the **Desktop Virtualization Session Host Operator** role for drain mode. For tags, Learn says to assign the **Tag Contributor** role to a user who lacks permission to add them. Learn's tagging page adds a limit: that role cannot apply tags to resources through the Azure portal, but it supports all tag operations through Azure PowerShell and the REST API. With only that role, use the PowerShell commands in step 1. Powering the VM on or off is a separate Azure permission that these pages do not cover.
- **Spare capacity.** Work this out before tagging; the example below shows how.

## Check capacity first

Tagged hosts are still part of the calculation of the minimum percentage of hosts, but autoscale cannot turn them on. If you tag too many, autoscale cannot add capacity. The consequences, including Learn's six-host scenario, are walked through in the concept article; here is the check you run before a window.

A worked example with invented numbers: a pool of eight hosts has a maximum session limit of 10 and a 75 percent capacity threshold, and peak load is 50 sessions. Learn defines available host pool capacity as the maximum session limit times the number of available session hosts, and says autoscale turns on or creates more session hosts when used capacity goes over the capacity threshold. Learn does not say whether a running host in drain mode counts as an available session host. The calculation below is the article's own cautious model, not documented behavior: it counts hosts in maintenance as zero capacity, which fits the fact that a host in drain mode accepts no new sessions. On that assumption, if you take two hosts out for patching and all six remaining hosts are running, they carry 6 x 10 x 0.75 = 45 sessions before the threshold is crossed and autoscale would need another host. At 50 sessions it would need one and could not start a tagged host. With one host out, 7 x 10 x 0.75 = 52.5 sessions, which covers the peak of 50. So in this pool, patch one host at a time during peak, or both outside peak.

The same check applies to the minimum percentage of hosts. With eight hosts and a 25 percent minimum, autoscale keeps two running, and Learn rounds fractions up. Make sure that enough untagged hosts remain for autoscale to start. Learn does not say whether a running tagged host counts as one of the hosts that satisfies the minimum, so do not plan on it.

## Maintenance runbook

1. **Tag the VM.** In the Azure portal open the VM, select **Add tags** (if the VM already has tags, Learn's edit section says to select **change**), enter the plan's tag name and a value, and select **Save**. The autoscale pages define the match by tag name and do not say whether the value is compared. For several VMs, select them in a resource list and use **Assign tags**. Tags are not inherited from the resource group, so each VM needs its own. In PowerShell, merge the tag into the existing ones:

   ```powershell
   $vm = Get-AzResource -Name "avd-host-03" -ResourceGroup "rg-avd"
   Update-AzTag -ResourceId $vm.Id -Tag @{ "excludeFromScaling" = "maintenance" } -Operation Merge
   ```

   Learn notes that `Update-AzTag` needs the `Az.Resources` module, version 1.12.0 or later. The names `avd-host-03` and `rg-avd` are examples; `Get-AzResource` can return several resources with the same name, so check the result.

2. **Turn on drain mode.** In the portal select **Azure Virtual Desktop**, then **Host pools**, the host pool, then **Session hosts**. Tick the host and select **Turn drain mode on**. In PowerShell, `Update-AzWvdSessionHost` from the `Az.DesktopVirtualization` module does the same:

   ```powershell
   Update-AzWvdSessionHost -ResourceGroupName "rg-avd" -HostPoolName "hp-pooled-01" `
       -Name "avd-host-03.contoso.com" -AllowNewSession:$false
   ```

   The names in the example are placeholders; use the session host name of your own host. If you refresh the portal right after changing drain mode, the status can look out of sync. Learn says to wait at least 60 seconds.

3. **Let the host empty.** Learn says a host in drain mode accepts no new user sessions and new connections go to the next available host, while existing connections stay active until the user signs out or an administrator ends the session. If a user already has an active or disconnected session in the pool and signs in again, the load balancer redirects them to the host with that session, even when drain mode is on, so disconnected sessions can keep a host busy. The commands to list sessions, send a warning and end what is left are in the drain mode runbook linked above.

4. **Do the maintenance.** Learn notes that administrators can still connect to the server directly, without going through the Azure Virtual Desktop service. Start the VM yourself if it is off; autoscale will not do it for a tagged host.

5. **Turn drain mode off.** Select the host and **Turn drain mode off**, or run the same cmdlet with `-AllowNewSession:$true`. Learn's drain-mode page shows both directions with the same cmdlet: `AllowNewSession = $False` turns drain mode on and `$True` turns it off.

6. **Remove the tag.** Delete the tag in the portal, or use the Delete operation with the same name and value pair that you added:

   ```powershell
   Update-AzTag -ResourceId $vm.Id -Tag @{ "excludeFromScaling" = "maintenance" } -Operation Delete
   ```

   From that moment autoscale manages the host again. If the phase calls for consolidation, it can put the host in drain mode and turn it off, so do not remove the tag from a host you meant to keep running before you are ready for that.

7. **Verify.** Learn's Insights page for autoscale (pooled host pools only) documents the `WVDAutoscaleEvaluationPooled` Log Analytics table, whose `ExcludedSessionHostCount` column is described as the number of session hosts excluded from autoscale management. Query that table in the workspace that receives the autoscale logs. Learn does not tie the column to the exclusion tag, so treat a count that matches the hosts you tagged as a plausibility check, not proof.

## Planning around the schedule

The tag applies in all phases of the schedule: ramp-up, peak, ramp-down and off-peak. A host that you tag in the afternoon is therefore left alone through the evening ramp-down and the overnight off-peak phase, and a host you forget to untag stays out of every phase. Learn describes no time limit for the tag, so plan the window as a pair of actions: tag and drain before it starts, undo both after it ends. Run the capacity check above with the settings of the phase your window falls in; Learn's glossary defines the minimum percentage of hosts for each phase of the schedule.

## Special session hosts

Learn documents one purpose for the tag: keeping autoscale from overriding drain mode during maintenance. Other uses follow from its definition, and you should treat them as inference.

- **A host you are testing.** A new image or a changed configuration on one host can be kept out of power changes while you test. Put it in drain mode too, or ordinary users may land on it.
- **A host that must stay on.** Autoscale will not turn a tagged host off, so a running host stays running. Learn does not say whether it satisfies the minimum percentage of hosts.
- **A host that must stay off.** Autoscale will not start it. Learn does not describe what Start VM on Connect does with a tagged host that is off, so test that before depending on it.

For a personal host pool, the tag most likely protects the power state, because autoscale does not put personal desktops into drain mode; that is an inference from the FAQ, and the concept article covers it and the "No resources available" case.

## Mistakes to avoid

- **Tagging the resource group.** Tags are not inherited, so VMs stay unprotected.
- **Draining first, tagging second.** In a pooled pool autoscale can override the drain mode you set, whoever set it.
- **Forgetting the tag afterwards.** A host that stays tagged never scales. It either stays on and costs money or stays off and removes capacity, and it is still part of the minimum percentage calculation.
- **Putting personal data in the tag.** Learn asks you to keep user principal names and similar data out of exclusion tags.
- **Assuming dynamic autoscaling behaves the same.** Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. Learn does not say whether dynamic autoscaling, which can delete session hosts, treats tagged hosts differently.

## Related

- [Exclusion tag](/entity/avd-scaling-plan-exclusion-tag/)
- [Drain mode](/entity/avd-drain-mode/)
- [AVD scaling plan](/entity/avd-scaling-plan/)
- [Azure resource tags](/entity/azure-resource-tags/)
- [AVD session host](/entity/avd-session-host/)

## Sources

All retrieved on 2026-11-17.

- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Drain session hosts for maintenance in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)
- [Microsoft Learn: Use the Azure portal to manage tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-portal)
- [Microsoft Learn: Manage tags with Azure PowerShell](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-powershell)
- [Microsoft Learn: Monitor autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
