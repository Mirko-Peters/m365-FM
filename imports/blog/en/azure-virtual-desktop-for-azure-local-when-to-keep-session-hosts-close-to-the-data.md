---
title: "Azure Virtual Desktop for Azure Local: when to keep session hosts close to the data"
summary: "Azure Virtual Desktop for Azure Local runs session hosts on your own Azure Local hardware while host pools, workspaces and application groups stay in Azure. This article sets out the cases Microsoft names for it, the constraints that come with it and a short decision procedure."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-for-azure-local, azure-virtual-desktop]
keypoints:
  - "Only the session hosts run on-premises. Host pools, workspaces and application groups stay in Azure, and session hosts must be able to reach the Azure Virtual Desktop service for brokering."
  - "Learn names three drivers: users with poor connectivity to Azure, data locality, and access to legacy on-premises apps and data. If none applies, session hosts in Azure are the simpler default."
  - "A host pool holds session hosts either in Azure or on Azure Local, never both. Portal deployment supports standard management and Active Directory domain join; session host configuration is not supported with Azure Local."
  - "Cost has three parts: user access rights, the Azure Local service fee, and an Azure Virtual Desktop for Azure Local fee per active vCPU. The Azure Local pages give no density figures of their own and describe the generic sizing guidelines as initial estimates only, so pilot before sizing."
  - "FSLogix profiles need an SMB share. The Learn overview recommends a Storage Spaces Direct guest cluster on the Azure Local instance and an external share for large deployments with high resource requirements; the Architecture Center calls the on-instance option more suitable for smaller deployments."
faq:
  - q: "Does Azure Virtual Desktop for Azure Local work without an internet connection to Azure?"
    a: "No. Microsoft Learn says the service requires a connection to the Azure Virtual Desktop service hosted in Azure for brokering connections and connecting users. An outage of that connection would be expected to affect new connections, so plan the network path and monitoring for it. The overview and Architecture Center pages describe no offline mode."
  - q: "Can one host pool contain session hosts in Azure and on Azure Local?"
    a: "No. Learn says each host pool must contain only session hosts on Azure or only on Azure Local. Both kinds can exist in the same subscription, each in its own host pool."
  - q: "Is the old name Azure Virtual Desktop for Azure Stack HCI still correct?"
    a: "No. Learn's what's new page records that Azure Virtual Desktop for Azure Stack HCI became Azure Virtual Desktop for Azure Local in November 2024, and that existing features and pricing carry over to the supported versions."
---

Use Azure Virtual Desktop for Azure Local when session hosts need to sit physically near users, legacy systems or data that cannot move to an Azure region, and keep everything else in Azure. The control plane stays in Azure either way, so the real question is where the compute should run. This article covers what the offering is, the three drivers Microsoft names, the constraints, and a way to decide.

## What runs where

According to [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview), the Azure Virtual Desktop control-plane components (host pools, workspaces and application groups) stay in Azure. Only the session hosts run on your [Azure Local](/entity/azure-local/) instance. The service is called [Azure Virtual Desktop for Azure Local](/entity/avd-for-azure-local/); until November 2024 it was named Azure Virtual Desktop for Azure Stack HCI, and the existing features and pricing carried over, per Learn's what's new page.

Two details matter for design. First, Learn says the service is not an Azure Arc-enabled service and is not supported as a standalone service outside Azure, in a multicloud environment or on other Arc-enabled servers. Second, each session host VM runs the Azure Connected Machine agent so that it can reach the Azure Instance Metadata Service, which Learn calls a required endpoint for [Azure Virtual Desktop](/entity/azure-virtual-desktop/). The portal installs the agent automatically when you add session hosts. The Azure Architecture Center adds that the session hosts run the [Azure Virtual Desktop agent](/entity/avd-agent/) and the Azure Arc agent, and that the Arc resource bridge orchestrates VM lifecycle on the instance.

Users connect with the same Remote Desktop clients as for session hosts in Azure.

## The three drivers Microsoft names

Learn lists these supported scenarios and benefits:

- **Performance for users far from Azure.** Placing session hosts closer improves the experience for users with poor connectivity to the Azure public cloud. Learn recommends [RDP Shortpath](/entity/rdp-shortpath/) for low-latency access.
- **Data locality.** App and user data can stay on-premises, including in the session host VMs and in associated services such as file servers.
- **Proximity to legacy apps and data sources.** Desktops sit next to systems that are hard to move.

Learn also lists cost and management benefits that apply to any Azure Virtual Desktop deployment, such as Windows 10 and Windows 11 Enterprise multi-session and portal-based management. They are not reasons to choose Azure Local over Azure by themselves.

One caution on data locality: Learn says some customer data, diagnostic data and service-generated data is still stored in Azure. If a regulation covers more than your own application data, check which data the service stores before you rely on "on-premises". The article on regional host pools in this series covers where host pool metadata lives.

## Constraints to weigh

| Area | What Learn says |
|---|---|
| Host pool membership | One host pool holds session hosts on Azure or on Azure Local, not both |
| Connectivity | A connection to the Azure Virtual Desktop service is required for brokering and for connecting users |
| Management approach | Standard management is available for pooled and personal host pools; session host configuration is currently not supported with Azure Local |
| Identity | The portal joins session hosts to Active Directory Domain Services only, including Microsoft Entra hybrid join. The overview page adds that native Microsoft Entra join is supported through PowerShell and other deployment methods; the prerequisites page says Azure Local session hosts can only be joined to AD DS, so test the join method you need |
| Performance and density | The overview says performance and user density might vary compared with session hosts in Azure. It points to the VM sizing guidelines for initial estimates, then monitoring |
| Operating systems | Windows 11 and Windows 10 Enterprise (including multi-session), and Windows Server 2025, 2022 and 2019 on the overview page. The Architecture Center page lists Windows Server 2022 and 2019 but not 2025 |
| Minimum version | Azure Local 23H2 or later, registered with Azure |

Two of these shape operations most. First, session host configuration is not supported. Learn's autoscale page says dynamic autoscaling can only be used for pooled host pools with session host configuration, and Microsoft's July 2026 general availability announcement for enhanced host pool management says session host update, dynamic autoscale and ephemeral OS disks require a host pool with session host configuration. Some Learn pages, including the autoscale scenarios page, still carry preview wording for dynamic autoscaling, so check the current page before relying on a limit. Our reading is that none of the three is available for Azure Local session hosts. Power management autoscaling is the standard-management option; the autoscale page states it for Azure and Azure Government and does not mention Azure Local, so confirm it before you plan around it. The [session host configuration](/entity/avd-session-host-configuration/) article explains what that approach adds. Second, performance varies by hardware. Learn's VM sizing guidelines list maximum users per vCPU for multi-session hosts (6 light, 4 medium, 2 heavy, 1 power), but they are based on Azure VMs and described as generic guidelines for initial estimates only, so treat them as a starting point for a pilot, not a commitment.

### Status

Learn marks Azure Virtual Desktop on Azure Local for Azure Government and for Azure operated by 21Vianet as preview, and says portal provisioning is not available for Azure Government. For Azure Local session hosts in the public cloud, those preview banners do not apply, but the deployment page still labels the Azure PowerShell cmdlets for host pools with a session host configuration as preview. In September 2026 Learn's what's new page listed managed identity support as generally available for session host configuration, autoscale, Start VM on Connect and Azure Virtual Desktop for Azure Local; read the current page for what that covers on Azure Local session hosts.

## Cost structure

Learn names three components:

1. **User access rights.** The same licenses that grant access to Azure Virtual Desktop in Azure.
2. **Azure Local service fee.** See the Azure Local pricing page.
3. **Azure Virtual Desktop for Azure Local service fee.** Charged for each active virtual CPU on session hosts running on Azure Local.

The Azure Architecture Center's reference design uses a pricing calculator estimate for a three-node Azure Local cluster running 10 multi-session hosts for roughly 50 to 100 medium-workload users. That estimate excludes the per-user access fees, on-premises hardware, physical networking equipment and Windows Server licensing, so it is a sizing illustration, not a total cost. Comparing with an Azure deployment needs your own hardware and licensing numbers.

## Where profiles live

FSLogix profile containers need an SMB share. The overview page gives two options:

- **Same Azure Local instance.** A VM-based file share cluster using Storage Spaces Direct, built from VMs on the instance, with SMB permissions and FSLogix configured afterwards. The overview says Microsoft recommends this approach. The Architecture Center describes it as simpler and faster but possibly limiting scalability, more suitable for smaller deployments, and suggests all-flash storage rather than hybrid storage because storage requirements increase.
- **Separate share outside Azure Local.** For large deployments with high resource requirements, the overview recommends a separate SMB file share on the same network as the session hosts so storage can scale independently of the instance. The Architecture Center says this share must provide high availability and minimal latency, and mentions [Azure Files](/entity/azure-files/) or [Azure NetApp Files](/entity/azure-netapp-files/) for scale beyond on-premises capacity, with attention to latency, bandwidth and throughput.

Profile traffic is part of the logon path, so the share's distance to the session hosts matters. See the [FSLogix profile container](/entity/fslogix-profile-container/) entity and the article on finding the FSLogix logon bottleneck.

## Resiliency

The Architecture Center says Azure Local supports clustering across physical machines, so virtual desktops can keep running if one node goes offline. For business-critical workloads it suggests two or more separate Azure Local instances, ideally in separate locations, plus Azure Backup or similar tools, optionally Azure Site Recovery to replicate VMs to an Azure region, and Azure Monitor for CPU, memory and storage. It gives no threshold values.

## Which approach fits

1. **Write down the reason.** If it is none of the three drivers above, session hosts in Azure are the simpler baseline.
2. **Measure the user experience first.** For latency, compare real sessions from the affected site against an Azure region before buying hardware.
3. **Check the data requirement.** Decide whether the requirement is about user data at rest, about processing next to a legacy system, or about all service data. Learn says some service data stays in Azure.
4. **Check identity and management constraints.** Confirm domain join, standard management and the minimum Azure Local version fit your environment.
5. **Plan the profile share and its network path** before the first session host.
6. **Pilot** with one workload type and compare density and cost against your estimate.

A different on-premises option, Azure Virtual Desktop Hybrid, is a separate offering covered elsewhere in this series: see [Azure Virtual Desktop Hybrid](/entity/avd-hybrid/).

## Third-party management

Nerdio's documentation states that Nerdio Manager supports Azure Virtual Desktop for Azure Local with 23H2 and later starting with version 5.7, requires a cluster with at least one node, and requires the Azure Local cluster to use the Arc resource bridge. It lists Active Directory or Microsoft Entra Domain Services as the identity requirement (Learn's prerequisites page names only AD DS for Azure Local), says Entra ID-joined VMs are not supported, and says cost management is not supported for these hosts. The page also says linked Azure Local instances must be relinked and the Azure Virtual Desktop objects recreated after certain upgrades or Resource Bridge changes, and that images cannot be created directly on Azure Local, so a local image repository is needed. Version 5.7 is the lower bound the page names, not necessarily the current release; check the vendor page before planning around it.

## Sources

- [Microsoft Learn: Azure Virtual Desktop on Azure Local](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Azure Architecture Center: Azure Virtual Desktop on Azure Local](https://learn.microsoft.com/en-us/azure/architecture/hybrid/azure-local-workload-virtual-desktop)
- [Nerdio: AVD for Azure Local and Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/25499377328909)
