---
title: "How to use the exclusion tag for maintenance windows and special session hosts"
summary: "To patch an Azure Virtual Desktop session host without autoscale interfering, tag the VM with the scaling plan's exclusion tag first, then turn on drain mode, wait for sessions to end, do the work, and undo both. This article gives the sequence, the commands and the capacity check to run before you tag."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scaling-plan-exclusion-tag, avd-scaling-plan]
keypoints:
  - "Tag the VM before you turn on drain mode. Autoscale overrides drain mode on every VM it scales, so drain mode alone does not protect a host in a pooled host pool."
  - "Drain mode blocks new sessions only. A user who already has an active or disconnected session in the pool is still routed back to that host, and existing connections stay until the user signs out or an administrator ends them."
  - "Tag with the Azure portal or Update-AzTag with the Merge operation, and remove the tag with the Delete operation or in the portal when the work is done."
  - "Check the capacity of the remaining untagged hosts first. Tagged hosts still count toward the minimum percentage of hosts, but autoscale cannot start them."
  - "Learn documents the tag for maintenance. Using it for test or always-on hosts follows from its definition and is not described as a use case."
faq:
  - q: "Do I need drain mode if the VM carries the exclusion tag?"
    a: "For maintenance, yes. The tag only stops autoscale from changing the host. It does not stop new sessions, so you still turn on drain mode so that new connections go to other session hosts and the host can empty out."
  - q: "What happens if I turn on drain mode without the tag?"
    a: "In a pooled host pool, Microsoft Learn says autoscale overrides drain mode on all VMs included in scaling, no matter who set it. Autoscale can turn drain mode off again or turn the host on or off while you work."
  - q: "Which roles do I need?"
    a: "Learn lists the Desktop Virtualization Session Host Operator role for drain mode. For adding tags it names the Tag Contributor role for users who lack permission. Turning a VM on or off is a separate Azure permission that these pages do not cover."
---

To take a pooled Azure Virtual Desktop session host out of service without autoscale interfering, tag the VM with the scaling plan's exclusion tag first, then turn on drain mode, wait for the sessions to end, do the maintenance, and undo both steps. Order matters, because autoscale overwrites drain mode on any VM it manages. The concept is explained in the companion article "Exclusion tags in AVD autoscale: keeping individual VMs out of scaling"; this one is the runbook. Sources are listed at the end, retrieved on 17 November 2026.

## Before you start

You need three things in place.

- **An exclusion tag name on the scaling plan.** In the Azure portal open **Azure Virtual Desktop**, select **Scaling plans**, open the plan and check the **Properties** tab. If the field is empty, enter a name there. Learn's example is `excludeFromScaling`. Changes to an assigned plan apply immediately.
- **Permissions.** Learn lists the **Desktop Virtualization Session Host Operator** role for drain mode. For tags, Learn says to assign the **Tag Contributor** role to a user who lacks permission to add them. Powering the VM on or off is a separate Azure permission that these pages do not cover.
- **Spare capacity.** Work this out before tagging; the example below shows how.

## Check capacity first

Tagged hosts still count toward the minimum percentage of hosts, but autoscale cannot turn them on. If you tag too many, autoscale cannot add capacity. Learn's example has six hosts, five of them tagged; the pool could not grow past one host and new users got "No resources available".

A worked check with invented numbers: a pool of eight hosts has a maximum session limit of 10 and a 75 percent capacity threshold. Learn defines available capacity as the limit times the number of available hosts, and autoscale starts another host when used capacity exceeds the threshold. If you take two hosts out for patching, six untagged hosts remain. Six hosts carry 6 x 10 x 0.75 = 45 sessions before autoscale would want a seventh host, and it could not start one if every other host is tagged. If peak is 60 sessions, patch outside peak or take only one host at a time. The same check applies to the minimum percentage of hosts. With eight hosts and a 25 percent minimum, autoscale keeps two running, and Learn rounds fractions up. Learn's example shows that when the tagged hosts are the ones switched off, autoscale cannot start them to meet the minimum, so confirm that enough untagged hosts remain that autoscale can start.

## Maintenance runbook

1. **Tag the VM.** In the Azure portal open the VM, select **Add tags**, enter the plan's tag name and a value, and select **Save**. The autoscale pages define the match by tag name and do not say whether the value is compared. For several VMs, select them in a resource list and use **Assign tags**. Tags are not inherited from the resource group, so each VM needs its own. In PowerShell, merge the tag into the existing ones:

   ```powershell
   $vm = Get-AzResource -Name "avd-host-03" -ResourceGroup "rg-avd"
   Update-AzTag -ResourceId $vm.Id -Tag @{ "excludeFromScaling" = "maintenance" } -Operation Merge
   ```

   Learn notes that `Update-AzTag` needs the `Az.Resources` module, version 1.12.0 or later. The names `avd-host-03` and `rg-avd` are examples.

2. **Turn on drain mode.** In the portal select **Azure Virtual Desktop**, then **Host pools**, the host pool, then **Session hosts**. Tick the host and select **Turn drain mode on**. In PowerShell, use `Update-AzWvdSessionHost`:

   ```powershell
   Update-AzWvdSessionHost -ResourceGroupName "rg-avd" -HostPoolName "hp-pooled-01" `
       -Name "avd-host-03.contoso.com" -AllowNewSession:$false
   ```

   `-Name` takes the session host name as the host pool lists it; the names in the example are placeholders. If you refresh the portal right after changing drain mode, the status can look out of sync. Learn says to wait at least 60 seconds.

3. **Let the host empty.** Learn says a host in drain mode accepts no new user sessions and new connections go to the next available host, while existing connections stay active until the user signs out or an administrator ends the session. One more detail comes from the load balancing page: if a user already has an active or disconnected session in the pool and signs in again, the load balancer redirects them to the host with that session, even when drain mode is on. Disconnected sessions can therefore keep a host busy. End them as an administrator once users have been warned.

4. **Do the maintenance.** Learn notes that administrators can still connect to the server directly, without going through the Azure Virtual Desktop service. Start the VM yourself if it is off; autoscale will not do it for a tagged host.

5. **Turn drain mode off.** Select the host and **Turn drain mode off**, or run the same cmdlet with `-AllowNewSession:$true`. Learn's own example shows only `$false`; `-AllowNewSession` is a switch parameter, so `$true` sets it back.

6. **Remove the tag.** Delete the tag in the portal, or use the Delete operation:

   ```powershell
   Update-AzTag -ResourceId $vm.Id -Tag @{ "excludeFromScaling" = "maintenance" } -Operation Delete
   ```

   From that moment autoscale manages the host again. If the phase calls for consolidation, it can put the host in drain mode and turn it off, so do not leave the tag off a host you meant to keep running.

7. **Verify.** In the host pool open **Insights**, then the **Autoscale** tab. The `ExcludedSessionHostCount` column of the `WVDAutoscaleEvaluationPooled` table is described as the number of session hosts excluded from autoscale. Compare it with the number of hosts you tagged, before and after step 6.

Learn does not say how quickly autoscale notices a new tag. Tagging first and draining second is the safe order, and the Insights check confirms the result.

## Special session hosts

Learn documents one purpose for the tag: keeping autoscale from overriding drain mode during maintenance. Other uses follow from its definition, and you should treat them as inference.

- **A host you are testing.** A new image or a changed configuration on one host can be kept out of power changes while you test. Put it in drain mode too, or ordinary users may land on it.
- **A host that must stay on.** Autoscale will not turn a tagged host off, so a running host stays running. It still counts toward the minimum percentage, so it does not lower the number of other hosts autoscale starts.
- **A host that must stay off.** Autoscale will not start it. Learn does not describe what Start VM on Connect does with a tagged host that is off, so test that before depending on it.

In a personal host pool the picture differs slightly. Learn's FAQ says autoscale does not put personal desktops into drain mode when it deallocates them, so the tag protects the power state. Learn also says that if a personal desktop is deallocated just as a user connects, the user can see "No resources available".

## Mistakes to avoid

- **Tagging the resource group.** Tags are not inherited, so VMs stay unprotected.
- **Draining first, tagging second.** In a pooled pool autoscale can switch drain mode off again, whoever set it.
- **Forgetting the tag afterwards.** A host that stays tagged never scales. It either stays on and costs money or stays off and removes capacity, and it still counts toward the minimum percentage.
- **Putting personal data in the tag.** Learn asks you to keep user principal names and similar data out of exclusion tags.
- **Assuming dynamic autoscaling behaves the same.** Dynamic autoscaling, which can create and delete session hosts, is labeled preview on Learn's scenarios and glossary pages. The pages retrieved do not say how it treats tagged hosts.

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
- [Microsoft Learn: Set drain mode for Azure Virtual Desktop session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Configure host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-load-balancing)
- [Microsoft Learn: Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)
- [Microsoft Learn: Use the Azure portal to manage tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-portal)
- [Microsoft Learn: Manage tags with Azure PowerShell](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-powershell)
- [Microsoft Learn: Monitor autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
