---
title: "Hibernation for AVD personal desktops: saving cost without losing the session"
summary: "Hibernation writes a personal desktop's memory to its OS disk and deallocates the VM, so compute billing stops while open apps come back on the next start. It saves the same compute as deallocation, so the case for it is user state, weighed against a larger disk and some operational limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-hibernation, avd-personal-host-pool]
keypoints:
  - "Hibernation stores the VM's memory on the OS disk and then deallocates the VM. Learn says a hibernated VM is not billed for VM usage, while disks and networking resources attached to it are."
  - "Compute is not billed in either the deallocated or the hibernated state, so hibernation does not save more compute than deallocation. What it adds is the restored session state, and what it costs is a larger OS disk."
  - "In a personal scaling plan, hibernate is one of three actions (deallocate, hibernate, do nothing) for the disconnect and sign-out timers, each set to 0 to 360 minutes."
  - "Learn lists limits that matter for planning: listed VM series with up to 64 GB RAM (general purpose) or 112 GB (GPU), no ephemeral OS disks, no Azure Backup, no capacity guarantee on resume."
  - "Hibernation for personal host pool session hosts and for autoscale reached general availability in May 2024, according to Learn's What's new page."
faq:
  - q: "Does hibernation cost less than deallocating a personal desktop?"
    a: "Not on compute. Learn's billing table lists the deallocated state, which includes a hibernated VM, as not billed for instance usage, and disks and networking continue to incur charges in both cases. In our reading, hibernation can add cost through the larger OS disk it needs to hold the memory contents, so its benefit is the preserved session, not a bigger discount."
  - q: "Is hibernation for AVD generally available?"
    a: "Learn's What's new page lists two May 2024 entries: hibernate support for session hosts in a personal host pool and hibernate support for autoscale are both generally available. It applies to personal host pools only."
  - q: "What happens if a hibernated VM cannot start because of capacity?"
    a: "Learn says there is no capacity assurance when starting hibernated VMs, and that in rare cases you can try again later. The troubleshooting page suggests trying again later or, as an alternative, stop-deallocating the VM and starting it again. Learn describes a stop (deallocate) as a shutdown that does not persist the memory contents, so in our reading expect a normal boot rather than a resume."
---

Hibernation lets Azure save a personal desktop's memory to its OS disk and then deallocate the VM, so you stop paying for compute while the user's open applications return on the next start. It does not save more compute than a plain deallocation. The reason to use it is the preserved session, and the price is a larger OS disk plus several platform limits. This article covers the concept, the cost model and the decision. The portal and PowerShell steps are in the companion article "How to configure hibernate with autoscale for personal host pools".

The basics of when hibernation applies are already in "Personal host pools in Azure Virtual Desktop: when one desktop per user makes sense": it is available only for [personal host pools](/entity/avd-personal-host-pool/), FSLogix and App Attach do not support it, and the OS disk must hold the memory contents. This article repeats only what the hibernation decision needs.

## What hibernation does to a session host

Microsoft's [hibernation overview](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume) describes the sequence. Azure signals the guest operating system to perform a suspend-to-disk action (S4). The VM's memory contents are stored on the OS disk, then the VM is deallocated and releases the lease on the underlying hardware. When the VM starts again, the memory contents are transferred back from the OS disk, and applications and processes resume from their previous state.

Other effects from the same page:

- Data on the temporary disk is not persisted.
- The OS disk, data disks and network interfaces stay attached, and static IP addresses stay unchanged.
- In the portal the VM shows **Hibernated (deallocated)**. Learn's Windows page shows the instance view status code `HibernationState/Hibernated` next to `PowerState/deallocated`.
- Hibernation must be triggered through the Azure portal, CLI, PowerShell, SDKs or APIs. Hibernating from inside the guest does not move the VM to a hibernated state, and the VM continues to be billed.

On status: Learn's [What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) lists two entries under May 2024. Deploying session hosts in a personal host pool with hibernate support is generally available, and autoscale support for VMs that use hibernate is generally available. [Hibernation](/entity/avd-hibernation/) in AVD is therefore not a preview feature, although individual Azure VM limits still apply.

## Hibernate, deallocate or keep running

The table sets the two stopped states side by side, using Learn's [states and billing](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing) page and the hibernation FAQ.

| | Stop (deallocate) | Hibernate |
|---|---|---|
| Compute (instance usage) | Not billed | Not billed |
| Disks and networking | Continue to incur charges | Continue to incur charges |
| Memory contents | Not persisted | Written to the OS disk, restored on start |
| Resize | Possible | Not possible while hibernated |
| Attach or detach disks and NICs | Possible | Not possible while hibernated |

The states and billing page also says a VM that has entered hibernation is shown as *Hibernated (deallocated)* and is not billed for instance usage. A running VM, and a VM that is stopped but still allocated, are billed. This is why timers matter more than the action: the compute saving starts when the VM reaches the deallocated or hibernated (deallocated) state, whichever of the two actions you choose. A VM that is stopping or stopped but still allocated is billed.

## What you pay for while a desktop is hibernated

Learn says that once a VM is hibernated, your account is billed only for the storage (OS disk, data disks) and networking resources (such as IPs) attached to it. Two consequences follow.

First, hibernation does not change the compute arithmetic. Take an illustrative personal desktop that a user needs 10 hours a day on 5 days a week, an assumption chosen only for this example. The week has 168 hours, so at least 50 hours are running (the user needs them, and the VM also runs through the timer delay) and at most 118 hours are not billed for compute. That figure is the same whether the VM is deallocated or hibernated in those hours. The real saving comes from how soon after the user leaves the VM stops, which is set by the scaling plan timers.

Second, hibernation raises the disk requirement. Learn's prerequisites call for a persistent OS disk large enough to store the contents of the RAM, the OS and the running applications. The creation flow in Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) repeats this for the **OS disk size** field. The troubleshooting page lists a creation error that says the OS disk size must be greater than the VM memory.

Learn's [sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines) list a minimum of 4 vCPUs, 16 GB RAM and 32 GB OS storage for a Medium single-session workload, with D4s_v5 as an example. In our reading, a 32 GB OS disk leaves little room once 16 GB of memory must also fit, so budget for a larger disk on hibernating hosts. Learn gives no sizing formula, so validate the disk size against your own image and applications. Disk charges apply in every stopped state, so the larger disk adds to the cost that continues while the VM is off.

## When the preserved session is worth it

Learn describes two use cases for hibernation on the Azure side: virtual desktops and other VMs that do not need to run 24/7, and systems with long boot times caused by memory-intensive applications, which can be initialised once and hibernated as "prewarmed" VMs.

Assessment, not a Learn statement: for a personal desktop, hibernation is most useful where users keep many applications and documents open, disconnect at the end of the day and expect to continue. It is less useful where users sign out fully, because after a sign-out there are no user applications left to preserve. Deallocation is then enough and avoids the larger disk.

## What triggers hibernation in AVD

Hibernation can be triggered by an administrator in the portal, CLI or PowerShell, or by autoscale. In a [scaling plan](/entity/avd-scaling-plan/) for personal host pools, each phase has **Disconnect settings** (**When disconnected for (min)**) and **Sign out settings** (**When logged off for (min)**). Both accept 0 to 360 minutes, and **Perform** offers deallocate, hibernate or do nothing, according to Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan). That page's PowerShell example mixes the actions across phases, for instance hibernate after 10 minutes of disconnection in peak hours and hibernate after 15 minutes of sign-out in ramp-down.

Two cautions from Learn's [autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq):

- If the plan says hibernate but the hosts do not have hibernation enabled, autoscale does nothing to them: no hibernate and no deallocate.
- Autoscale for personal desktops does not force users to sign out, and the FAQ words the deallocation condition in two ways (after sign-out, and "signed out or disconnected"). Check how your timers behave in a pilot pool before you rely on one reading.

[Start VM on Connect](/entity/avd-start-vm-on-connect/) powers on an existing personal session host that is assigned or can be assigned to the user. Learn's [Start VM on Connect page](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) does not mention hibernated VMs, so test that a hibernated desktop starts and resumes through that path before you depend on it for the first connection of the day.

## Limits to check before you choose it

The [hibernation overview](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume) names the following, and the list changes, so read the current page:

- **VM series and memory.** Listed general purpose series (Dasv5, Dadsv5, Dsv5, Ddsv5, Easv5, Eadsv5, Esv5, Edsv5) support hibernation up to 64 GB RAM, and the NVv4 and NVadsA10v5 GPU series up to 112 GB RAM.
- **Unsupported Azure features.** Ephemeral OS disks, shared disks, availability sets, Uniform-mode scale sets, Spot VMs, managed images, Azure Backup and capacity reservations. The AVD deployment flow lets you choose availability zones, availability sets or no redundancy, so confirm that your choice is compatible.
- **Windows guest.** The page file cannot be on the temp disk, and Learn's Windows page lists supported versions that include Windows 11 Enterprise and Enterprise multi-session.
- **Capacity.** No capacity assurance when a hibernated VM starts. The troubleshooting page lists `AllocationFailed` and `OverconstrainedResumeFromHibernatedStateAllocationRequest` for this case and suggests trying again later or stop-deallocating the VM and starting it again.

Because Azure Backup is on the list, decide up front how you protect the data on hibernating personal desktops.

## A decision checklist

1. Do users keep applications open across disconnects, or do they sign out? Hibernate on disconnect only for the first group.
2. Are the planned VM sizes in a supported series and within the RAM limit?
3. Is the OS disk large enough for memory plus OS plus applications, and is the extra disk cost acceptable?
4. Do you need Azure Backup, ephemeral OS disks, availability sets or FSLogix on these hosts? If yes, plan for deallocation instead.
5. Have you tested a hibernate and a resume with a real user profile before enabling it for the pool?

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Hibernation overview, Azure Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume)
- [Microsoft Learn: Learn about hibernating your Windows virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hibernate-resume-windows)
- [Microsoft Learn: States and billing status, Azure Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing)
- [Microsoft Learn: Troubleshoot hibernation in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume-troubleshooting)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Configure Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
