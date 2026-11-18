---
title: "Azure Spot VMs for AVD: where they work and where they don't"
summary: "Azure Spot VMs can be evicted at any time with 30 seconds' notice and carry no SLA, so they fit disposable, interruption-tolerant session hosts, not ordinary user desktops. Covers eviction, host pools and autoscale."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-spot-virtual-machines, azure-virtual-desktop]
keypoints:
  - "Azure Spot VMs run on unused capacity and can be evicted whenever Azure needs the capacity back, or when the price passes your maximum price. Azure gives 30 seconds' notice, and there is no SLA."
  - "Learn's article on adding session hosts does not list Spot. Our reading: a Spot host means creating and registering the VM yourself, which does not fit a session host configuration."
  - "A Microsoft employee answering on Microsoft Q&A in April 2024 called VDI not a valid workload for Spot VMs and pointed to autoscale. That is an opinion, not a Learn policy statement."
  - "Candidates are short-lived, stateless or test session hosts with profiles in FSLogix. Personal desktops, shared production pools and anything that must be available at a fixed time are poor fits."
  - "Check the eviction rate of the VM size and region first, decide between Deallocate and Delete, and test with a simulated eviction before real users connect."
faq:
  - q: "Can I create Azure Virtual Desktop session hosts as Spot VMs in the portal?"
    a: "Microsoft Learn's article on adding session hosts lists availability options, security type, image, VM size, hibernate for personal pools, OS disk type and size, boot diagnostics and network security group, and does not list Azure Spot. In April 2024 a Microsoft Q&A asker reported the same gap. The route described there is to create the Spot VM yourself and register it to the host pool with a registration key."
  - q: "What happens to users on a Spot session host when it is evicted?"
    a: "Azure evicts the VM with 30 seconds' notice, announced through Scheduled Events without a delivery guarantee. The sessions on that host end, and unsaved work in them can be lost. With the Deallocate policy the VM and its disks remain, but Learn says there is no guarantee that a later allocation succeeds; with Delete the VM and its disks are removed."
  - q: "Does a reservation or savings plan apply to Spot VMs?"
    a: "The Learn Spot VM article does not say whether either applies to Spot VMs, so confirm coverage in the Azure billing documentation before mixing them. Reservations and savings plans for AVD are compared in a separate article of this series."
---

Azure Spot VMs are cheaper because Azure can take them back: they run on unused capacity, can be evicted at any time with 30 seconds' notice, and have no SLA. For Azure Virtual Desktop that makes them suitable for interruption-tolerant, disposable [session hosts](https://www.m365.fm/entity/avd-session-host/), and a poor fit for a desktop a user relies on all day. This guide covers the eviction rules, how Spot hosts interact with host pool setup and autoscale, and a way to decide.

The Learn articles on adding session hosts and on autoscale do not mention Spot VMs, and no Learn page found describes a Spot workflow for Azure Virtual Desktop. Where this article goes beyond Learn, it says so ("our reading").

## What a Spot VM promises, and what it does not

[Azure Spot Virtual Machines](https://www.m365.fm/entity/azure-spot-virtual-machines/) are described on Microsoft Learn as a way to use unused capacity at a significant cost saving, with eviction possible at any time. The facts that matter for a desktop service:

- **Two causes of eviction.** Capacity: Azure needs the capacity back. Price: the Spot price exceeds the maximum price you set.
- **Notice.** Azure evicts with 30 seconds' notice. In-VM notification through Azure Scheduled Events is not guaranteed and arrives up to 30 seconds before.
- **No SLA.** Learn says there is no SLA and no high availability guarantee. A Spot VM is otherwise the same as a standard VM.
- **Creation-time setting.** Learn says the Spot flag can only be set when the VM is created, and a Spot VM cannot be converted to a standard VM.
- **Size limits.** B-series and promo versions of sizes are not supported.
- **Separate quota.** Spot VMs use a separate quota pool, shared between VMs and scale-set instances.

Two policies decide what is left after an eviction:

| Setting | Deallocate (default) | Delete |
|---|---|---|
| VM after eviction | Stopped-deallocated, can be redeployed | Deleted |
| Disks | Kept; storage is charged and the VM counts against quota | Deleted with the VM |
| Restart | No guarantee that allocation will succeed | Not applicable |

For the maximum price, a value of `-1` means the VM is not evicted for pricing reasons; you are charged the current price, never above the standard price. Changing the maximum price requires deallocating the VM. After a price-based eviction the VM does not restart by itself.

## What Azure Virtual Desktop documents

The Learn article on [adding session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool) lists availability options, security type, image, VM size, hibernate (personal pools only), OS disk type and size, boot diagnostics and network security group. It does not list Azure Spot. In a Microsoft Q&A thread from April 2024 the asker reported that the portal showed no Spot option.

The same article describes the alternative: if you create VMs by another method, you register them separately by installing the Azure Virtual Desktop Agent and the Agent Boot Loader and using a registration key. The key is valid only for the time you set, up to 27 days.

That route depends on the management approach. Learn's [host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches) article says that with standard management you manage creating, updating and scaling session hosts, while with a session host configuration you cannot add session hosts created outside the service, and the approach cannot be changed after creation. Our reading: a Spot host belongs in a [host pool](https://www.m365.fm/entity/avd-host-pool/) with standard management. Dynamic autoscaling and session host update need a session host configuration, so they are not part of the documented route for Spot hosts. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages still carry preview wording; check the current page before relying on a limit.

## What the Microsoft Q&A thread says

The Microsoft Q&A thread asked how to run AVD session hosts on Spot. A volunteer moderator answered that a Spot VM can be created separately and registered, that evictions can lose user data, and that a VM size with a low eviction percentage (0-5%) is advisable. In a follow-up comment the moderator wrote that Spot with AVD is only for a special use case. A Microsoft employee wrote that Spot instances are risky for AVD because availability cannot be predicted, that users may be disconnected and lose unsaved work, that the product team recommended autoscale to manage cost, and that in their opinion VDI is not a valid workload for Azure Spot VMs. This is forum guidance from 2024, not a Learn policy.

## Where Spot hosts can work

Our reading, based on the eviction rules above: Spot suits hosts where losing a session costs little.

- **Test and lab pools.** A validation or training host pool where users expect occasional interruption, and where nothing business-critical runs.
- **Stateless pooled hosts with profiles in FSLogix.** On a pooled pool, Learn says users can connect to a different host each time, so they should keep profile data in [FSLogix](https://www.m365.fm/entity/fslogix/). An off-host profile does not depend on the evicted VM's disk. This does not remove the disconnect; unsaved work in the open session can be lost. Learn does not describe how a profile container behaves after a hard eviction; test that.
- **Extra capacity beside standard hosts.** Our reading: a small pool of Spot hosts for non-critical users, separate from a pool of standard VMs. Within one pool, load balancing can place sessions on a Spot host.

## Where Spot hosts do not work well

- **Personal desktops.** A [personal host pool](https://www.m365.fm/entity/avd-personal-host-pool/) assigns one host to one user, and Learn says user data can sit on the OS disk. With the Delete policy that disk goes with the VM. With Deallocate the disk stays, but the user cannot work until the VM is allocated again, and Learn gives no guarantee that it will be.
- **Production pooled hosts that carry the whole workload.** If every host can be evicted, a capacity event can leave nobody a host to connect to. Learn's advice is to use standard VMs if you need capacity right away.
- **Scheduled or contractual availability.** There is no SLA for Spot VMs.
- **Users who cannot lose a session.** Eviction is signalled to the VM through the Scheduled Events `Preempt` event, which Learn says is delivered without a guarantee, with a minimum notice of 30 seconds. The Learn pages used here describe no sign-out message to users. Autoscale ramp-down, by contrast, puts a host in drain mode and sends a notification before signing users out after the wait time you set, if you enable forced sign-out during ramp-down.

## How eviction meets autoscale

Power management autoscale starts and deallocates session hosts. A Spot VM evicted with the Deallocate policy ends in the same state as a VM autoscale has deallocated. Learn's scaling plan article recommends using autoscale with session hosts deployed with AVD ARM templates or first-party Microsoft tools, and does not state whether manually created VMs are supported. Our reading: for Spot hosts, test the scaling plan before trusting it.

Two details from Learn matter here. First, [Start VM on Connect](https://www.m365.fm/entity/avd-start-vm-on-connect/) on a pooled host pool starts a VM at most every five minutes, and users who try to sign in during that period without available resources get "No resources available". Second, Learn's Spot article says allocation of a deallocated Spot VM may not succeed. Our reading: if the only powered-off hosts in a pool are evicted Spot VMs, a start attempt can fail and users may find no host to connect to. Learn does not document which message they see. A [scaling plan](https://www.m365.fm/entity/avd-scaling-plan/) can leave a VM out of scaling with an exclusion tag, and power management is covered in [power management autoscaling](https://www.m365.fm/entity/avd-power-management-autoscaling/).

Also note that autoscale and the Azure Automation or Logic Apps scaling method cannot run on the same host pool.

## Check before you commit

1. **Look up the eviction rate.** In the portal, under **Run with Azure Spot discount**, select **View pricing history and compare prices in nearby regions**. Learn quotes eviction rates per hour from the last 7 days; 10% means a 10% chance of eviction within the next hour. Azure Resource Graph holds 90 days of pricing history and 28 days of eviction rates in the `SpotResources` table.
2. **Do the arithmetic for a workday.** Illustration, not a Microsoft figure: if a size showed 5% per hour and that stayed constant and independent, the chance that one host is evicted at least once in an 8-hour day is 1 − 0.95^8, about 34%.
3. **Choose the policy.** Deallocate keeps the disk and charges storage; Delete removes both.
4. **Set the maximum price.** `-1` removes price-based eviction. Capacity eviction remains.
5. **Check quota.** Spot quota is separate from standard quota.
6. **Create the VM as Spot.** In PowerShell, Learn's example uses `New-AzVMConfig` with `-Priority "Spot" -MaxPrice -1 -EvictionPolicy Deallocate`. In Azure CLI, `az vm create` takes `--priority Spot --max-price -1 --eviction-policy Deallocate`. The Learn page for Windows PowerShell has a sample with an older Windows Server image, so use your own AVD image. One sentence on the CLI page says that `-1` means the VM is evicted based on price; its own example and the other Spot pages say it is not.
7. **Register the host.** Install the agent and boot loader with a registration key, as described above.
8. **Rehearse an eviction.** Learn documents `Set-AzVM -SimulateEviction` and a REST `simulateEviction` call. Inside the VM, the Scheduled Events endpoint shows a `Preempt` event, and Learn recommends polling it once per second. Test what a user sees, how fast the session can be saved, and whether the profile opens cleanly on another host.

## Alternatives to compare first

Spot discounts apply per VM, while the other cost levers keep the VM standard. Consider them before Spot:

- **Autoscale.** Ramp-down deallocates unused hosts; if you enable forced sign-out, it warns signed-in users first. See [dynamic autoscaling](https://www.m365.fm/entity/avd-dynamic-autoscaling/) and power management.
- **Commitments.** [Azure Reservations](https://www.m365.fm/entity/azure-reservations/) and [Azure savings plans](https://www.m365.fm/entity/azure-savings-plans/) lower the price of steady compute use; Learn's Spot article does not say if they apply to Spot.
- **Right-sizing.** A host that is too large costs more on any pricing model.

Spot can sit beside these, for example a standard baseline pool plus a small Spot pool, but this article does not claim that Microsoft supports any particular combination.

## Summary

Use Spot where an eviction is an inconvenience: test pools, short-lived training hosts, or stateless pooled hosts for users who tolerate reconnecting. Avoid it for personal desktops and for hosts you rely on at a fixed time. Because the Azure Virtual Desktop pages used here do not describe Spot hosts, the practical test is a pilot with a small user group, a simulated eviction, and a look at the eviction rate for your size and region.

## Sources

- [Microsoft Learn: Use Azure Spot Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms)
- [Microsoft Learn: Deploy Spot VMs using the Azure portal](https://learn.microsoft.com/en-us/azure/virtual-machines/spot-portal)
- [Microsoft Learn: Deploy Spot VMs using Azure PowerShell](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/spot-powershell)
- [Microsoft Learn: Deploy Spot VMs using the Azure CLI](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/spot-cli)
- [Microsoft Learn: Scheduled Events for Windows VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/scheduled-events)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Understand Azure Reserved VM Instances discount](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges)
- [Microsoft Q&A: Using Azure Virtual Desktop with Spot Instances (April 2024)](https://learn.microsoft.com/en-us/answers/questions/1654330/using-azure-virtual-desktop-with-spot-instances)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
