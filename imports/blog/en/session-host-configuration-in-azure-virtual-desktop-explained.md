---
title: "Session host configuration in Azure Virtual Desktop explained"
summary: "A session host configuration, a sub-resource of the session host configuration management approach, stores what the session hosts of a pooled host pool should look like: image, size, disk, domain join, network and more. The service builds and updates hosts from it, but the choice is made at host pool creation and cannot be reversed."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-session-host-configuration, avd-host-pool]
keypoints:
  - "A host pool uses either standard management or a session host configuration. The approach is set when the pool is created, and a pool created without one cannot get one later."
  - "Session host configuration works only with pooled host pools on Azure. Learn lists it as not supported on Azure Local, and tools built for standard management do not work with it."
  - "The configuration says what hosts look like, the session host management policy says how they are created and updated, and session host update applies changes in batches."
  - "The management policy defaults in the portal are UTC, a batch size of 1, a 2-minute logoff delay, and keeping all failed hosts."
  - "Microsoft announced general availability of enhanced host pool management, including session host configuration and update, in July 2026. Some Learn pages and the PowerShell module version 5.4.2-preview still carry preview wording."
faq:
  - q: "Can I add a session host configuration to an existing host pool?"
    a: "No. Microsoft Learn says the management approach is set when you create the host pool and cannot be changed later. If you create a pool without a session host configuration you cannot add one afterwards."
  - q: "Does session host configuration work with personal host pools?"
    a: "No. Learn says the approach works only with pooled host pools, and the portal sets the host pool type to pooled when you choose a session host configuration."
  - q: "What happens to the configuration when I update it?"
    a: "Existing hosts are not changed until you schedule a session host update. New hosts are built from the saved configuration. If the pool has no hosts, you can change any property without scheduling an update."
---

A session host configuration is, in Learn's words, a sub-resource of the session host configuration management approach, which works with pooled Azure Virtual Desktop host pools only. It records what the pool's session hosts should look like. The service creates new hosts from it, and a scheduled session host update brings existing hosts in line with it. You decide at host pool creation whether a pool uses one, and the decision cannot be changed later. This article explains what the configuration holds, the objects around it, the limits, the general availability status and the remaining preview wording on Learn, and how to decide between it and standard management. Sources were retrieved on 17 November 2026.

## Two management approaches

Microsoft Learn's article on host pool management approaches defines a [host pool](/entity/avd-host-pool/) as a logical grouping of session host VMs that share one configuration and serve one workload. It names two approaches:

- **Standard management.** You create, update and scale session hosts yourself, for example with pipelines or scripts. You register hosts with a registration token.
- **Session host configuration.** Four integrated features work together: the configuration, the session host management policy, session host update, and autoscale.

Learn adds a caution that matters before anything else: the approach is set at creation and cannot be changed. A pool created without a configuration cannot get one later.

## What the configuration contains

The [session host configuration](/entity/avd-session-host-configuration/) persists for the life of the pool. Learn lists these properties:

- VM image
- VM name prefix
- VM resource group
- VM size
- OS disk information
- Domain join information
- VM network configuration
- VM location and availability zones
- VM security type
- VM admin credentials
- Boot diagnostics information
- A custom configuration PowerShell script
- VM tags

New hosts are always built from the saved configuration. To change existing hosts, you update the configuration and then schedule a session host update. If the pool has no hosts yet, you can change any property without scheduling an update. The update article also lists what persists across updates: Azure properties such as availability configuration, network configuration and location.

## The management policy

The session host management policy is a single policy per host pool and cannot be deleted without the pool. The portal creates a default one. You can override its values when creating or updating hosts, or change it at any time with PowerShell. Learn gives these parameters and portal defaults:

| Parameter | Meaning | Portal default |
|---|---|---|
| Time zone | Used when scheduling an update | UTC |
| Max VMs removed during update | Hosts updated at once (batch size) | 1 |
| Logoff delay in minutes | Wait before signed-in users are signed out, 0 to 60 | 2 |
| Logoff message | Text shown to users | "You will be signed out" |
| Leave in drain mode | Whether new hosts stay in drain mode for post-creation actions. Does not apply to session host update | False |
| Failed session host cleanup policy | Whether to keep none, some or all hosts that fail during creation. Does not apply to session host update | KeepAll |

In effect the configuration is the "what" and the policy is the "how". Both are separate from the image in your [Azure Compute Gallery](/entity/azure-compute-gallery/), which only supplies the image that the configuration points to.

## Creating a pool with a configuration

In the Azure portal, search for Azure Virtual Desktop, select **Host pools** and **Create**. On the Basics tab, **Host pool type** is set to Pooled automatically because it is the only type supported, and **Use a session host configuration** is set to **Yes**. The Session hosts tab then asks for:

- The number of hosts, 0 to 500 at creation, subject to quota. Entering 0 still creates the configuration.
- A name prefix of at most 10 characters. Prefix plus hyphen and suffix, such as `hp01-sh-0`, may not exceed 15.
- VM location, which must match the virtual network's region, plus availability zones, security type (Standard, Trusted launch as the default, or Confidential), image, size and OS disk type. Learn recommends Premium SSD for production.
- Network, subnet and network security group type.
- Domain to join. The deploy page names Active Directory (including Microsoft Entra hybrid join) as the only option here, with a key vault holding the credentials and an optional domain name and OU path. The pages do not agree on Entra join, covered below.
- The local administrator account, again through a key vault secret, and an optional custom configuration script URL that must be resolvable from the public internet.

Credentials therefore live in [Azure Key Vault](/entity/azure-key-vault/), not in the pool. The Management tab offers a [managed identity](/entity/avd-managed-identity/), system assigned or user assigned. Learn lists roles for the account that creates the pool (Desktop Virtualization Contributor, Virtual Machine Contributor, Key Vault Secrets User) and, for the managed identity, Desktop Virtualization Virtual Machine Contributor plus Key Vault Secrets User on the vault.

**Learn contradicts itself on the managed identity requirement.** The deploy page says you can choose whether to assign a managed identity at creation. The What's new entry of September 2025 gave an estimated progression: from September 19, 2025, new pools created in the portal must use one; from October 15, 2025, pools without one cannot update their configuration; from November 15, 2025, they cannot create hosts. The September 2026 entry announces generally available managed identity support and says that in a future service update a configuration will require one to add hosts, which reads as if the requirement were not yet in force. The pages do not reconcile this, so check the Management tab of a new pool and the state of your existing pools in your own tenant.

## Limits and restrictions

Collecting the statements on Learn's pages:

- **Pooled pools only.** Personal pools cannot use it.
- **Azure only.** The deploy page says a session host configuration on Azure Local is not supported.
- **No outside tools.** You cannot create, update or scale hosts outside the service with tools built for standard management, and you cannot retrieve a registration token to add externally created hosts. Teams that rely on pipelines, scripts or a third-party management console for host lifecycle should check that tool's documentation before choosing this approach.
- **Adding hosts:** the add page says PowerShell cannot add hosts to a pool with a configuration, and gives the portal steps. The What's new entry of June 2025 adds that increasing the pool size through the API or custom ARM templates triggers the service to create hosts. The troubleshooting page, the oldest source here (21 January 2025), says only the portal is supported.
- **Session host update** is available in the global Azure cloud and not in Azure US Government or Azure operated by 21Vianet. It keeps the same directory. The update page still lists a gallery image from a different subscription as unsupported, while the What's new entry of September 2025 announces cross-subscription image support, so verify the current state before you plan a shared gallery.
- **Resource locks** must be removed from hosts and their resource group before an update.
- **PowerShell** support for the configuration cmdlets requires a version of Az.DesktopVirtualization (5.3.0 or later) that Learn still labels preview.

## Microsoft Entra join: pages disagree

The deploy page's session host configuration branch says Active Directory is the only available option for the directory, including Microsoft Entra hybrid join. The update configure page offers "Microsoft Entra or Active Directory" under **Domain to join**, and the What's new entry of June 2025 says Entra-joined devices are supported and that you can configure a pool for Entra join without assigning the Virtual Machine User role to a user. Treat Entra-only deployments as something to confirm in the portal before you choose the approach.

## Preview or generally available?

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community, 9 July 2026). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. What each Learn page says:

- The What's new entry of November 2024 announces the configuration and session host update as preview.
- Entries for June 2025, August 2025 and September 2025 extend it (host creation, managed identity, cross-subscription images) without a label. The June 2026 entry "Automated Host Pools" says they are now available and describes enforcing settings by setting a single session host configuration, with links to this feature's pages, so Learn's name for the capability appears to be automated host pools. September 2026 marks the managed identity support as generally available.
- The troubleshooting page still opens with a note that session host update is in preview. The configure page labels the PowerShell cmdlets preview. The host pool management approaches page and the session host update page carry no label.

Practical reading: the general availability announcement covers session host configuration and update, and dynamic autoscale and ephemeral OS disks each require a pool with a configuration. The announcement does not list remaining preview parts, and Learn has not been fully updated, so verify limits such as cloud and PowerShell support on the current pages.

## Relation to autoscale

Dynamic autoscaling, which can create and delete hosts, can only be used with pooled pools that have a configuration. Dynamic autoscale is part of the July 2026 general availability announcement, although Learn's scenarios page still carries preview wording. The autoscale FAQ says that autoscale creates hosts with the latest valid and stable image version defined in the default configuration if you have no active one. Power management autoscaling, which only starts and stops hosts, works with either approach. See [dynamic autoscaling](/entity/avd-dynamic-autoscaling/). During a session host update, disable autoscale.

## Choosing between the approaches

| Situation | Leans towards |
|---|---|
| Pooled pool on Azure, one image for all hosts, you want enforced consistency | Session host configuration |
| You want the service to roll images out in batches | Session host configuration |
| Personal host pools | Standard management |
| Azure Local hosts | Standard management |
| Existing pipelines or scripts create hosts | Standard management |
| Entra join only, no directory | Confirm in the portal first; the pages disagree |
| You need to add externally created hosts | Standard management |

Neither is better in general. The configuration trades flexibility for consistency, and the trade is permanent for that pool, so the safer path for a first trial is a new test pool, not a migration of production.

## When creation fails

Extended validation checks the configuration at creation, but resources live in your subscription and can change afterwards. Learn lists error groups such as `VmSkuNotAvailableInRegion` and `ComputeSkuIncompatibleWithImageHyperVGeneration`. If creation of the configuration failed, the portal cannot create it later for that pool. Use the `New-AzWvdSessionHostConfiguration` cmdlet or delete and re-create the pool.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts using session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Troubleshoot session host configuration and session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-session-host-update)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Autoscale scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
