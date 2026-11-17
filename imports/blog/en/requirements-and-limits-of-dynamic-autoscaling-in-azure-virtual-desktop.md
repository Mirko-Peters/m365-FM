---
title: "Requirements and limits of dynamic autoscaling in Azure Virtual Desktop"
summary: "Dynamic autoscaling in Azure Virtual Desktop only works for pooled host pools that use a session host configuration, in Azure but not Azure Government. This article lists the prerequisites, roles, limits and restrictions that Microsoft Learn documents, and marks where the documentation disagrees with itself."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-dynamic-autoscaling, avd-scaling-plan, avd-managed-identity]
keypoints:
  - "Dynamic autoscaling needs a pooled host pool with a session host configuration. That choice is made when the host pool is created and cannot be added later."
  - "Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, in July 2026. Some Learn pages, such as the glossary and scenarios pages, still carry preview wording, so check the current page before relying on a limit."
  - "Learn gives two different statements on the managed identity requirement for host pools with a session host configuration: an estimated schedule from September 2025 and 'a future service update' in September 2026 and on the configuration page. Check the current state."
  - "A custom max session limit is required, session hosts must reach one extra storage endpoint, and one scaling plan can be assigned per host pool."
  - "Autoscale overrides drain mode and ignores the host pool's load balancing setting. Use the exclusion tag for hosts you want to keep out of scaling."
faq:
  - q: "Can I use dynamic autoscaling on an existing host pool?"
    a: "Only if that host pool was created with a session host configuration. Microsoft Learn says the management approach is set when you create the host pool and cannot be changed later. A host pool created without a session host configuration can only use power management autoscaling."
  - q: "Is dynamic autoscaling generally available?"
    a: "Yes, according to Microsoft. A Tech Community post of 9 July 2026 announces general availability of enhanced host pool management, which includes dynamic autoscale, session host configuration and update, and ephemeral OS disks. Some Learn pages still carry preview wording, for example the glossary and scenarios pages, and the scaling plan page names a preview version (5.4.2-preview) of the Az.DesktopVirtualization module. Check the current page before relying on a limit."
  - q: "Which roles does dynamic autoscaling need?"
    a: "Desktop Virtualization Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor, assigned to the Azure Virtual Desktop service principal with the subscription as assignable scope. Learn warns that a lower scope, such as a resource group, host pool or VM, prevents autoscale from working properly."
---

Dynamic autoscaling in Azure Virtual Desktop can start, stop, create and delete session hosts, but only for pooled host pools that use a session host configuration, and only in Azure, not Azure Government. This article lists what Microsoft Learn documents as requirements and limits, so you can check a design before you build it.

## Status: generally available, with preview wording left on some pages

An [AVD scaling plan](/entity/avd-scaling-plan/) uses one of two methods:

- **Power management autoscaling** starts and stops (deallocates) session hosts. The scaling plan page calls it "already generally available". It is available in Azure and Azure Government.
- **Dynamic autoscaling** also creates and deletes session hosts. It is only available in Azure.

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community, 9 July 2026). The post names no cloud, region or remaining preview component. Some Learn pages, for example the scenarios and glossary pages, still carry preview wording, and the scaling plan page requires version 5.4.2-preview or later of the Az.DesktopVirtualization PowerShell module for dynamic autoscaling. What's new announced dynamic autoscaling as preview in November 2024; its June 2026 entry says it is "now available" without a label. Check the current page before relying on a limit.

## Host pool requirements

[Dynamic autoscaling](/entity/avd-dynamic-autoscaling/) can only be used for pooled host pools with a session host configuration. The details come from the page on host pool management approaches:

- The management approach is set when you create the host pool. It cannot be changed later.
- A session host configuration works with [pooled host pools](/entity/avd-pooled-host-pool/) only. [Personal host pools](/entity/avd-personal-host-pool/) can use power management autoscaling, not dynamic autoscaling.
- Once a pool has a [session host configuration](/entity/avd-session-host-configuration/), you cannot create, update or scale its session hosts outside the Azure Virtual Desktop service with tools built for standard management. You also cannot retrieve a registration token to add hosts created outside the service.
- On the deployment page, Learn says the session host configuration is not supported with Azure Local.

If you want to scale a standard [host pool](/entity/avd-host-pool/) without a session host configuration, use power management autoscaling.

The deployment page names one number: the portal lets you deploy up to 500 session host VMs at creation time for a pool with a session host configuration, depending on quota, and 400 for standard management. These are limits of the deployment form, not of autoscale.

## Managed identity

What's new announces a [managed identity](/entity/avd-managed-identity/) requirement for host pools with a session host configuration. The September 2025 entry introduces it with "In upcoming service updates" and gives an "estimated progression":

- Starting 19 September 2025, new such host pools created in the Azure portal must use a managed identity.
- Starting 15 October 2025, existing pools cannot update their session host configuration until a managed identity is added.
- Starting 15 November 2025, existing pools cannot create session hosts until one is added.

These are estimated dates, not confirmed ones, and the later entry does not match them. The page "Configure managed identity in Azure Virtual Desktop" (updated 4 November 2026) says in an Important note that host pools configured with a session host configuration "will require a managed identity in a future service update". The September 2026 What's new entry announces managed identity support as generally available and says: "In a future service update, host pools configured with a session host configuration will require a managed identity in order to add session hosts". Whether it is already enforced is open. The September 2025 entry says that creating a new host pool with a session host configuration in the portal requires a managed identity, while the deployment page says you can choose at creation time whether to assign one.

The deployment page says the managed identity performs create, delete and update operations for session hosts in place of the service principal, and the configuration page lists autoscale among the features that can use a managed identity. Check the current state of both statements before you rely on one.

## Region rules

- Scaling plan configuration data must be stored in the same Azure region as the host pool configuration.
- Session host VMs can be in any supported Azure region, also a different one than the host pool and scaling plan data (FAQ).
- Autoscale only scales existing VMs within their region and does not move capacity to a secondary region during an outage. Learn tells customers to set up their own disaster recovery strategy.

## Roles and permissions

The scaling plan page names two built-in roles for dynamic autoscaling, Desktop Virtualization Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor. Both go to the Azure Virtual Desktop service principal, with the Azure subscription as assignable scope. The configuration page lists autoscale among the features that can use a managed identity, but the dynamic-scaling section names the roles for the service principal only. The power management section of the same page says the Desktop Virtualization Power On Off Contributor role goes to "a managed identity assigned to your host pool or the Azure Virtual Desktop service principal". For the other role, the deployment page names Desktop Virtualization Virtual Machine Contributor for a host pool's managed identity, and the configuration page names Desktop Virtualization Host Pool Contributor for the person who sets the identity up.

The page warns that an assignment below the subscription, such as the resource group, host pool or VM, prevents autoscale from working properly. Assigning the roles requires `Microsoft.Authorization/roleAssignments/write` on the subscription, which User Access Administrator and Owner include. The troubleshooting page is looser and lists "host pool, resource group, or subscription scope" for the Power On Off Contributor role. The two pages conflict, so assign at subscription scope, as the scaling plan page documents.

## Settings to configure

- **Custom max session limit.** For dynamic autoscaling, the host pool must have a custom max session limit for load balancing. Learn says not to use the default value. It does not give a recommended number.
- **Minimum host pool size, maximum host pool size and minimum percentage of active hosts.** The minimum host pool size in the scaling plan overrides the number of session hosts defined in the host pool (FAQ). Above the maximum, autoscale deletes active, deallocated session hosts with no sessions.
- **Capacity threshold.** The scaling plan page gives an example: with a threshold of 60% and a host pool capacity of 100 sessions, autoscale turns on more session hosts once the load exceeds 60 sessions.

## Network requirement

Dynamic autoscaling currently needs access to `wvdhpustgr0prod.blob.core.windows.net` to deploy the Azure Virtual Desktop Agent when it creates session hosts (scaling plan page), until it migrates to a required endpoint. Hosts that cannot reach it fail with `CustomerVmNoAccessToDeploymentPackageException`.

## Limits and unsupported scenarios

Learn lists these limits for autoscale in general:

- You can only associate one scaling plan per host pool. One plan can be assigned to one or more host pools of the same type.
- A scaling plan can only be assigned to host pools that match the host pool type in the plan. A dynamic plan only goes to pooled host pools with a session host configuration.
- The scaling plan type, pooled or personal, cannot be changed after the plan is created (glossary).
- Host pools must be in the same Azure region as the scaling plan (scaling plan page, section on editing a plan).
- A scaling plan operates only in its configured time zone.
- You cannot use autoscale together with other Microsoft or third-party scaling tools on the same host pool. This includes scaling with Azure Automation and Azure Logic Apps. Disable the others first.
- Autoscale does not support ramping down on specific dates, such as holidays.
- Autoscale cannot be configured with the Azure CLI, and it does not track availability zones, so it may not scale evenly across them (FAQ).
- Forced sign-out is only possible in the ramp-down phase, and only if you enabled the force logoff setting.

## Behavior that affects other settings

- **[Drain mode](/entity/avd-drain-mode/).** For pooled host pools, autoscale overwrites drain mode. Use the exclusion tag when updating VMs.
- **Load balancing.** For pooled host pools, autoscale ignores the load balancing algorithm in the host pool settings and applies load balancing based on the schedule configuration.
- **[Exclusion tag](/entity/avd-scaling-plan-exclusion-tag/).** Learn's example is `excludeFromScaling`. Autoscale does not start, stop or change the drain mode of tagged hosts, in all phases of the schedule.
- **Disconnected sessions.** They count toward capacity. The FAQ formula is required hosts = disconnected sessions / (max session limit x capacity threshold). With 9 disconnected users, a limit of 5 and a threshold of 90%, 9 / 4.5 gives 2 hosts that stay on. To reach zero hosts after hours, no sessions may remain, including disconnected ones, and the minimum percentage must be 0%. The FAQ suggests a Group Policy timeout of 15 to 30 minutes.

## Check before you create the plan

1. Confirm that the host pool is pooled and was created with a session host configuration. In the portal, the Scaling method option only appears when you choose Pooled as the host pool type.
2. Confirm that the host pool is not on Azure Local and not in Azure Government.
3. Decide on a managed identity: the deployment page words it as optional at creation, What's new says portal creation requires one, and the timing of the general requirement differs between pages. If you use one, give it Desktop Virtualization Virtual Machine Contributor on the resource group or subscription of the session hosts.
4. Set a custom max session limit instead of the default.
5. Assign both roles to the Azure Virtual Desktop service principal at subscription scope, or to the host pool's managed identity if you use one (the scaling plan page names the Power On Off Contributor role for a managed identity in its power management section).
6. Allow outbound access to `wvdhpustgr0prod.blob.core.windows.net` from the session host subnet.
7. Install the Az.DesktopVirtualization 5.4.2-preview module or later if you use PowerShell.
8. Check that no Azure Automation or Logic Apps scaling still runs on the pool, and that no other plan is assigned.
9. Create the plan in the same region as the host pool configuration, then assign it. Changes to an assigned plan apply immediately.

## Open points

The 500 and 400 session host figures belong to the deployment form, not to a plan. The scaling plan creation page and the autoscale FAQ give no number for the maximum host pool size of a dynamic plan or for the number of schedules. The scenarios page also contradicts itself: scenario 4 shows a minimum percentage of hosts of 19% in its table and 10% in its text.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [AVD scaling plan](/entity/avd-scaling-plan/)
- [AVD dynamic autoscaling](/entity/avd-dynamic-autoscaling/)
- [AVD session host configuration](/entity/avd-session-host-configuration/)
- [AVD power management autoscaling](/entity/avd-power-management-autoscaling/)
- [AVD managed identity](/entity/avd-managed-identity/)

## Sources

Retrieved on 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Troubleshoot autoscale issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Configure managed identity in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-managed-identity)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
