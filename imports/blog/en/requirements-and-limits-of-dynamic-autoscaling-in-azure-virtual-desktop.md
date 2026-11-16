---
title: "Requirements and limits of dynamic autoscaling in Azure Virtual Desktop"
summary: "Dynamic autoscaling in Azure Virtual Desktop only works for pooled host pools that use a session host configuration, in Azure but not Azure Government. This article lists the prerequisites, roles, limits and restrictions that Microsoft Learn documents, and marks where the documentation disagrees with itself."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [avd-dynamic-autoscaling, avd-scaling-plan, avd-managed-identity]
keypoints:
  - "Dynamic autoscaling needs a pooled host pool with a session host configuration. That choice is made when the host pool is created and cannot be added later."
  - "Glossary, scenarios and troubleshooting label dynamic autoscaling preview. What's new says preview (Nov 2024) and 'now available' (June 2026), and no Learn page calls it generally available."
  - "What's new announces a managed identity requirement for host pools with a session host configuration, with an estimated schedule starting 19 September 2025; its September 2026 entry says the requirement to add session hosts comes in a future service update, so check the current state."
  - "A custom max session limit is required, session hosts must reach one extra storage endpoint, and one scaling plan can be assigned per host pool."
  - "Autoscale overrides drain mode and ignores the host pool's load balancing setting. Use the exclusion tag for hosts you want to keep out of scaling."
faq:
  - q: "Can I use dynamic autoscaling on an existing host pool?"
    a: "Only if that host pool was created with a session host configuration. Microsoft Learn says the management approach is set when you create the host pool and cannot be changed later. A host pool created without a session host configuration can only use power management autoscaling."
  - q: "Is dynamic autoscaling generally available?"
    a: "No Learn page calls it generally available (checked on 2026-11-16). The glossary, the scenarios page and the troubleshooting page label it preview. What's new announced it as preview in November 2024 and says in June 2026 that it is now available, without a GA label. The scaling plan page requires a preview version of the Az.DesktopVirtualization module."
  - q: "Which roles does dynamic autoscaling need?"
    a: "Desktop Virtualization Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor, assigned to the Azure Virtual Desktop service principal with the subscription as assignable scope. Learn warns that a lower scope, such as a resource group, host pool or VM, prevents autoscale from working properly."
---

Dynamic autoscaling in Azure Virtual Desktop can start, stop, create and delete session hosts, but only for pooled host pools that use a session host configuration, and only in Azure, not Azure Government. This article lists what Microsoft Learn documents as requirements and limits, so you can check a design before you build it.

## Status: preview or generally available?

An [AVD scaling plan](/entity/avd-scaling-plan/) uses one of two methods:

- **Power management autoscaling** starts and stops (deallocates) session hosts. The scaling plan page calls it "already generally available". It is available in Azure and Azure Government.
- **Dynamic autoscaling** also creates and deletes session hosts. It is only available in Azure.

The glossary, the scenarios page and the troubleshooting page label dynamic autoscaling preview. What's new announced it as preview in November 2024, and its June 2026 entry says "Dynamic autoscaling is now available for pooled host pools with session host configuration" without a generally available label. No Learn page calls it generally available. The scaling plan page requires version 5.4.2-preview or later of the Az.DesktopVirtualization PowerShell module for dynamic autoscaling. Check the status again before production use.

## Host pool requirements

[Dynamic autoscaling](/entity/avd-dynamic-autoscaling/) can only be used for pooled host pools with a session host configuration. The details come from the page on host pool management approaches:

- The management approach is set when you create the host pool. It cannot be changed later. A host pool created without a session host configuration cannot get one afterwards.
- A session host configuration works with [pooled host pools](/entity/avd-pooled-host-pool/) only. [Personal host pools](/entity/avd-personal-host-pool/) can use power management autoscaling, not dynamic autoscaling.
- Once a pool has a [session host configuration](/entity/avd-session-host-configuration/), you cannot create, update or scale its session hosts outside the Azure Virtual Desktop service with tools built for standard management. You also cannot retrieve a registration token to add hosts created outside the service.
- On the deployment page, Learn says the session host configuration is not supported with Azure Local.

If you want to scale a standard [host pool](/entity/avd-host-pool/) without a session host configuration, use power management autoscaling.

The deployment page names one number: for a pool with a session host configuration, the portal lets you deploy up to 500 session host VMs at creation time, depending on quota. For standard management it says 400. These are limits of the deployment form, not of autoscale.

## Managed identity

What's new announces a [managed identity](/entity/avd-managed-identity/) requirement for host pools with a session host configuration. The September 2025 entry introduces it with "In upcoming service updates" and gives an "estimated progression":

- Starting 19 September 2025, new such host pools created in the Azure portal must use a managed identity.
- Starting 15 October 2025, existing pools cannot update their session host configuration until a managed identity is added.
- Starting 15 November 2025, existing pools cannot create session hosts until one is added.

These are estimated dates, not confirmed ones, and the later entry does not match them. The September 2026 entry announces managed identity support as generally available and says: "In a future service update, host pools configured with a session host configuration will require a managed identity in order to add session hosts". That suggests the requirement had not taken effect a year after the estimated dates. The deployment page says you can choose at creation time whether to assign a managed identity, so it is optional there.

Dynamic autoscaling creates session hosts, so it would presumably be affected; Learn does not say so explicitly. Check the current state before you rely on either reading.

If you use a managed identity, it needs Desktop Virtualization Virtual Machine Contributor on the resource group or subscription of the session hosts (deployment page).

## Region rules

Learn separates where the configuration data lives from where the VMs run:

- Scaling plan configuration data must be stored in the same Azure region as the host pool configuration.
- Session host VMs can be deployed in any supported Azure region. According to the autoscale FAQ, they can be in a different region than the host pool and scaling plan data.
- Autoscale only scales existing VMs within the region where they were created. It does not move capacity to a secondary region if the primary region has an outage. Learn tells customers to set up their own disaster recovery strategy.

## Roles and permissions

The scaling plan page names two built-in roles for dynamic autoscaling, Desktop Virtualization Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor. Both go to the Azure Virtual Desktop service principal, with the Azure subscription as assignable scope. For dynamic autoscaling the page names only the service principal.

The page warns that an assignment below the subscription, such as the resource group, host pool or VM, prevents autoscale from working properly. Assigning the roles requires `Microsoft.Authorization/roleAssignments/write` on the subscription, which User Access Administrator and Owner include. The troubleshooting page is looser and lists "host pool, resource group, or subscription scope" for the Power On Off Contributor role. The two pages conflict, so assign at subscription scope, as the scaling plan page documents.

## Settings to configure

- **Custom max session limit.** For dynamic autoscaling, the host pool must have a custom max session limit for load balancing. Learn says not to use the default value. It does not give a recommended number.
- **Minimum host pool size, maximum host pool size and minimum percentage of active hosts.** The FAQ says the minimum host pool size in the scaling plan overrides the number of session hosts defined in the host pool. If the host count exceeds the maximum host pool size, autoscale deletes active, deallocated session hosts with no sessions.
- **Capacity threshold.** The scaling plan page gives an example: with a threshold of 60% and a host pool capacity of 100 sessions, autoscale turns on more session hosts once the load exceeds 60 sessions.

The FAQ gives two special cases: to only turn hosts on and deallocate them, set the same value for minimum and maximum host pool size. To only create and delete hosts, set the minimum percentage of active hosts to 100.

## Network requirement

Dynamic autoscaling currently needs access to `wvdhpustgr0prod.blob.core.windows.net` to deploy the Azure Virtual Desktop Agent when it creates session hosts (scaling plan page), until it migrates to a required endpoint. Hosts that cannot reach it fail with `CustomerVmNoAccessToDeploymentPackageException`.

## Limits and unsupported scenarios

Learn lists these limits for autoscale in general:

- You can only associate one scaling plan per host pool. One plan can be assigned to one or more host pools of the same type.
- A scaling plan can only be assigned to host pools that match the host pool type in the plan. A dynamic plan only goes to pooled host pools with a session host configuration.
- A scaling plan operates only in its configured time zone.
- You cannot use autoscale together with other Microsoft or third-party scaling tools on the same host pool. This includes scaling with Azure Automation and Azure Logic Apps. Disable the others first.
- Autoscale does not support ramping down on specific dates, such as holidays.
- Autoscale cannot be configured with the Azure CLI (FAQ).
- Autoscale does not track availability zones, so it may not scale evenly across zones.
- Pooled autoscale does not turn off hosts in the ramp-up phase.
- Forced sign-out is only possible in the ramp-down phase, and only if you enabled the force logoff setting.

## Behavior that affects other settings

- **[Drain mode](/entity/avd-drain-mode/).** For pooled host pools, autoscale overwrites drain mode. Use the exclusion tag when updating VMs.
- **Load balancing.** For pooled host pools, autoscale ignores the load balancing algorithm in the host pool settings and applies load balancing based on the schedule configuration.
- **[Exclusion tag](/entity/avd-scaling-plan-exclusion-tag/).** Learn's example is `excludeFromScaling`. Autoscale does not start, stop or change the drain mode of tagged hosts, in all phases of the schedule.
- **Disconnected sessions.** They count toward capacity. The FAQ formula is required hosts = disconnected sessions / (max session limit x capacity threshold). With 9 disconnected users, a limit of 5 and a threshold of 90%, 9 / 4.5 gives 2 hosts that stay on. To reach zero hosts after hours, no sessions may remain, including disconnected ones, and the minimum percentage must be 0%. The FAQ suggests a Group Policy timeout of 15 to 30 minutes for disconnected sessions.
- **Image version.** Per the FAQ, autoscale creates session hosts with the latest valid image version defined in the default session host configuration, if there is no active session host configuration.

## Check before you create the plan

1. Confirm that the host pool is pooled and was created with a session host configuration. In the portal, the Scaling method option only appears when you choose Pooled as the host pool type.
2. Confirm that the host pool is not on Azure Local and not in Azure Government.
3. Decide on a managed identity: optional at creation per the deployment page, announced as required later. If you use one, give it Desktop Virtualization Virtual Machine Contributor on the resource group or subscription of the session hosts.
4. Set a custom max session limit, for example 10, instead of the default.
5. Assign both roles to the Azure Virtual Desktop service principal at subscription scope.
6. Allow outbound access to `wvdhpustgr0prod.blob.core.windows.net` from the session host subnet.
7. Install the Az.DesktopVirtualization 5.4.2-preview module or later if you use PowerShell.
8. Check that no Azure Automation or Logic Apps scaling still runs on the pool, and that no other plan is assigned.
9. Create the plan in the same region as the host pool configuration, then assign it. Changes to an assigned plan apply immediately.

## Open points

The pages checked give no maximum host pool size for a dynamic plan beyond the deployment form values above, and no limit for the number of schedules or host pools per plan. The scenarios page also contradicts itself: scenario 4 shows a minimum percentage of hosts of 19% in its table and 10% in its text.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [AVD scaling plan](/entity/avd-scaling-plan/)
- [AVD dynamic autoscaling](/entity/avd-dynamic-autoscaling/)
- [AVD session host configuration](/entity/avd-session-host-configuration/)
- [AVD power management autoscaling](/entity/avd-power-management-autoscaling/)
- [AVD managed identity](/entity/avd-managed-identity/)

## Sources

All retrieved on 2026-11-16.

- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Troubleshoot autoscale issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
