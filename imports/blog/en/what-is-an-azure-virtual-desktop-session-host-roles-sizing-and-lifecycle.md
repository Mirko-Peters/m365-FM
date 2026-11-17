---
title: "What is an Azure Virtual Desktop session host? Roles, sizing and lifecycle"
summary: "A session host is a virtual machine registered to Azure Virtual Desktop where users' desktop and app sessions run. This article covers what makes a VM a session host, how Microsoft sizes multi-session and single-session hosts, and the stages of a host's life from creation to retirement."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-session-host, azure-virtual-desktop]
keypoints:
  - "A session host is a VM registered to Azure Virtual Desktop. Learn says all session hosts in a host pool should come from the same image for a consistent user experience."
  - "The Azure Virtual Desktop agent, its bootloader, the side-by-side stack and the Geneva Monitoring agent turn a VM into a session host. A registration key authorizes it to join a host pool and can be valid for up to 27 days."
  - "Learn's sizing guidance lists maximum users per vCPU for multi-session hosts: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. It calls the figures generic starting estimates to validate with a pilot."
  - "Host pools are managed either with a session host configuration, where the service manages the host lifecycle, or in the standard way, where you create, update and scale hosts yourself."
  - "Retiring a host safely starts with drain mode, which stops new sessions while existing ones continue. Deleting VMs can leave orphaned records, for example in Intune."
faq:
  - q: "What operating systems can a session host run?"
    a: "Per Microsoft Learn's prerequisites: Windows 11 Enterprise multi-session and Enterprise, Windows 10 Enterprise multi-session and Enterprise, and Windows Server 2025, 2022, 2019 and 2016, all 64-bit. N, KN and LTSC editions and Arm64-based Azure VMs are listed as not supported."
  - q: "How many users fit on one multi-session session host?"
    a: "It depends on the workload. Learn lists up to 6 users per vCPU for light, 4 for medium, 2 for heavy and 1 for power workloads, so 8 vCPUs at the light level give 48 as an upper bound (our arithmetic, not a Learn figure). Learn says doubling cores does not double capacity and describes the figures as generic estimates for initial planning, and it recommends a pilot or simulation."
  - q: "How long is the registration key valid?"
    a: "You choose the duration. Learn's page on adding session hosts says a registration key is valid only for the time you specify, up to a maximum of 27 days, and suggests 1 to 4 hours for an interactive rollout."
---

An Azure Virtual Desktop session host is a virtual machine that is registered to the service and that users connect to for their desktop or application sessions. A host pool is a collection of these machines. Desktops and applications run on session hosts, while in pooled host pools the user profile is stored separately, typically in FSLogix. That is why sizing, health and replacement of hosts are central tasks for an AVD administrator.

## What a session host is

Microsoft Learn's [terminology page](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) describes a [host pool](/entity/avd-host-pool/) as a collection of Azure virtual machines that are registered to [Azure Virtual Desktop](/entity/azure-virtual-desktop/) as session hosts. All session hosts in a host pool should come from the same image, so that users get a consistent experience. You control which resources users see through application groups.

The role of the host depends on the pool type:

| | [Pooled](/entity/avd-pooled-host-pool/) | [Personal](/entity/avd-personal-host-pool/) |
|---|---|---|
| Users on one host | Several at once | One assigned user |
| User profile | Should be in [FSLogix](/entity/fslogix/), because the next sign-in can reach another host | Can sit on the VM's OS disk |
| Default patching | Redeploy hosts from updated images | Windows Update, Configuration Manager or other tools |
| Maximum sessions | The configured maximum session limit, which can be exceeded under high concurrent connection load | One |

Learn names two management approaches for host pools. With a [session host configuration](/entity/avd-session-host-configuration/), Azure Virtual Desktop manages the lifecycle of the hosts for you. With standard management, you create, update and scale the hosts yourself. Learn's whats-new page lists automated host pools, which use a session host configuration, as "now available" in June 2026, and Microsoft announced general availability of enhanced host pool management, which includes session host configuration, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## What makes a VM a session host

Learn's agent overview describes the pieces that sit on the VM:

- The **Azure Virtual Desktop agent**, which acts as the intermediary between the service and the VM, and the **agent bootloader** that loads it.
- The **side-by-side stack**, which users need to establish reverse server-to-client connections securely.
- The **Geneva Monitoring agent**, which monitors the health of the agent.

Learn says the agent installs the other two components and that all three are essential for end-to-end connectivity. VMs provisioned through the Azure portal or Azure Marketplace get the agent automatically. If you provision with PowerShell, you install the `.msi` files yourself. On Windows Server, Learn also has you install the Remote Desktop Session Host role first. After a manual installation Learn expects four applications to appear: Remote Desktop Agent Boot Loader, Remote Desktop Services Infrastructure Agent, Remote Desktop Services Infrastructure Geneva Agent and Remote Desktop Services SxS Network Stack. See the entity page for the [agent](/entity/avd-agent/).

A **registration key** authorizes a host to join the pool. Per Learn it is valid only for the duration you set. Learn suggests 1 to 4 hours for an interactive rollout and says the lifetime can go up to 27 days for staged rollouts. It also says pre-provisioned hosts that stay powered off for more than 90 days have their machine token expire, and that you should power them on for at least 20 minutes every 90 days.

## Requirements for a session host

The [prerequisites page](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) sets the following:

- **Operating systems (64-bit):** Windows 11 Enterprise multi-session and Enterprise, Windows 10 Enterprise multi-session and Enterprise, Windows Server 2025, 2022, 2019 and 2016.
- **Not supported:** 32-bit systems, N, KN and LTSC editions, ultra disks for the OS disk, ephemeral OS disks for Azure VMs, Virtual Machine Scale Sets and Arm64-based Azure VMs. The ephemeral OS disk entry differs from Microsoft's July 2026 announcement, which lists ephemeral OS disks as part of enhanced host pool management. Learn's [ephemeral OS disks page](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks) says they are supported only in pooled host pools configured with a session host configuration, and it still carries preview wording for some details, such as the disk type. Read both pages before planning ephemeral disks.
- **Identity:** hosts must be joined to the same Microsoft Entra tenant as the users or to an Active Directory domain (AD DS or Microsoft Entra Domain Services). For session hosts on Azure Local, Learn says they can only join an AD DS domain. The account used to join a domain cannot have multifactor authentication enabled.
- **Network:** a virtual network and subnet in the same Azure region as the session host. Learn recommends not opening inbound port 3389 and not assigning public IP addresses.
- **Licensing:** your Windows license must be correctly assigned in Azure and the OS activated. Windows Server hosts use RDS client access licenses with Software Assurance or RDS User Subscription Licenses.

Name and count limits depend on the management approach. For standard management, the [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) gives a name prefix of at most 11 characters, prefix plus suffix of at most 15, and up to 400 session hosts at creation, depending on quota. For a host pool with a session host configuration, the same article gives a prefix of at most 10 characters (prefix plus suffix still 15) and up to 500 session hosts when you create the pool. The ephemeral OS disks page gives 11 for the prefix in that case, so use 10 if you want a prefix that fits both.

## Health and status

Learn's status page lists six statuses and the health checks behind them. A host is *Available* when it passes all health checks, and it stays *Available* even when it has reached its maximum session limit. *Needs Assistance* means a non-fatal check failed (Geneva Monitoring Agent, metadata service or URL checks), and users can still connect with a possibly degraded experience. *Unavailable* means the host is off or failed a fatal health check, and *Shutdown* means it was shut down. Neither receives new sessions. *Upgrading* and *Upgrade Failed* describe the agent upgrade. In the health check table, the side-by-side stack listener and domain trust checks are called fatal, and if the domain joined check fails users cannot connect. The Geneva Monitoring Agent check is called semi-fatal, and the App Attach and metadata service checks are not fatal.

## Sizing

Learn's [sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines) give these starting points. For single-session hosts: light 2 vCPU and 8 GB RAM, medium 4 vCPU and 16 GB, heavy 8 vCPU and 32 GB. For multi-session:

| Workload | Maximum users per vCPU | Minimum vCPU / RAM |
|---|---|---|
| Light | 6 | 8 vCPU, 16 GB |
| Medium | 4 | 8 vCPU, 16 GB |
| Heavy | 2 | 8 vCPU, 16 GB |
| Power | 1 | 6 vCPU, 56 GB |

Learn adds several cautions. It says to limit multi-session VMs to between 6 and 24 vCPUs, although later on the same page it calls 4 to 24 cores the recommended range and 4 cores the lowest number for a stable multi-session VM. It says VMs should not have more than 32 cores. Doubling the cores does not double capacity, because the scaling factor is typically 1.5 to 1.9. For 20 or more users per VM, several smaller VMs perform better than one or two large ones, and smaller VMs are easier to patch and to shut down when idle. Sign-in is CPU-intensive, so plan for peak logon times. Treat all figures as generic and check them with a pilot. Separately, the page on adding session hosts recommends using only Premium SSD for production workloads.

The sizing result feeds the [maximum session limit](/entity/avd-maximum-session-limit/) on the pool and the load balancing choice.

## The lifecycle

1. **Create.** With a session host configuration you set the number of hosts to add in the portal, and the service creates them. With standard management you create VMs through the service or outside it and register them. The portal path is **Host pools**, the pool, **Session hosts**, **+ Add**.
2. **Register and verify.** The host appears as *Unavailable* at first and should become *Available*. Learn says to restart manually registered VMs once it does.
3. **Operate.** Autoscale can start and stop pooled hosts. [Drain mode](/entity/avd-drain-mode/) isolates a host for maintenance. The service updates the agent, and [scheduled agent updates](/entity/avd-scheduled-agent-updates/) let you set maintenance windows.
4. **Update.** Learn's session host update replaces hosts from a new configuration in batches, and it is only available for host pools with a session host configuration. Learn says to disable autoscale during such an update.
5. **Retire.** Put the host in drain mode (**Session hosts**, select the host, **Turn drain mode on**). It then accepts no new sessions and existing connections stay until users sign out or an administrator ends them. Remove it after the last session ends.

Retirement can leave traces. During session host update, Learn says AD computer objects are not deleted: the replacement VM keeps the host name and inherits the existing object, and you only need to remove orphaned objects from the previous domain if you change the domain. Intune's multi-session page says that deleting VMs in Azure leaves orphaned device records which it tries to delete after 60 inactive days, without a guarantee.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Azure Virtual Desktop agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Session host statuses and health checks in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
- [Microsoft Learn: Enable drain mode in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Windows Enterprise multi-session remote desktops in Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
