---
title: "Azure Virtual Desktop Hybrid explained: session hosts on-premises, managed from Azure"
summary: "Azure Virtual Desktop Hybrid keeps the Azure Virtual Desktop service in Azure and puts the session hosts on your own on-premises hypervisor or hardware, connected through Azure Arc. You trade Azure-side lifecycle features such as autoscale and multi-session for local placement, so check the limits before you choose it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-hybrid, azure-virtual-desktop]
keypoints:
  - "Azure Virtual Desktop Hybrid runs session hosts on-premises while host pools, workspaces and the brokering service stay in Azure. Each session host must be Azure Arc-enabled, and an Arc extension installs the AVD components and registers it."
  - "Microsoft announced general availability on 1 September 2026. The public preview had started in May 2026."
  - "Power management, autoscale, Start VM on Connect and session host configuration are not supported. You provision, patch and power on the machines with your own tools."
  - "Windows 11 and Windows 10 Enterprise multi-session are not supported. Supported are Windows Server 2016 to 2025 and single-session Windows 11 and Windows 10 Enterprise."
  - "Azure Virtual Desktop for Azure Local is a separate offer with its own limits and its own fee model. Learn says it is not an Azure Arc-enabled service."
faq:
  - q: "Is Azure Virtual Desktop Hybrid generally available?"
    a: "Yes. Microsoft's Tech Community post 'Microsoft Azure Virtual Desktop Hybrid is now generally available' was published on 1 September 2026 and updated on 2 September 2026. An earlier Windows IT Pro post from 4 May 2026 described it as being in public preview. The Learn overview page carries no preview notice. Nerdio's AVD Hybrid page does not state a status."
  - q: "Can I use Windows 11 multi-session with Azure Virtual Desktop Hybrid?"
    a: "No. The Learn overview lists Windows 11 Enterprise multi-session and Windows 10 Enterprise multi-session as not supported on Azure Virtual Desktop Hybrid. Windows Server, Windows 11 Enterprise and Windows 10 Enterprise are supported, with conditions on physical devices."
  - q: "How is Azure Virtual Desktop Hybrid different from Azure Virtual Desktop for Azure Local?"
    a: "Hybrid uses Azure Arc-enabled Windows machines on a hypervisor or headless physical device that you choose. Azure Virtual Desktop for Azure Local runs session hosts on Azure Local instances (version 23H2 or later), supports multi-session images and bills per active vCPU. Learn says it is not an Azure Arc-enabled service. Both keep the service components in Azure."
---

Azure Virtual Desktop Hybrid keeps the Azure Virtual Desktop service in Azure and runs the session hosts on infrastructure you operate yourself. Each host is a Windows virtual machine or a headless physical device that is Azure Arc-enabled. The choice is worth it when the desktops must sit next to local data or hardware, and it costs you the Azure-side lifecycle features.

This article explains the concept and the decision. It does not repeat the setup steps or the network and licensing prerequisites, which a separate article covers. It is based on Microsoft Learn, a Microsoft Tech Community announcement and Nerdio's own pages.

## What Azure Virtual Desktop Hybrid is

Microsoft Learn describes it as an extension of cloud-native desktop virtualization to existing on-premises infrastructure. The service stays in Azure, and the applications and desktops are hosted on-premises. Learn gives the flow in four steps:

1. You deploy a Windows virtual machine or headless physical device on your on-premises infrastructure.
2. You install the Azure Arc connected machine agent, which registers the machine in Azure as an Arc-enabled server.
3. You run the Azure Virtual Desktop Arc extension on that machine. It installs the AVD software and registers the machine with a host pool.
4. Users connect through [Windows App](/entity/windows-app/), the same way they connect to any other Azure Virtual Desktop session host.

Learn states the split of duties plainly: Microsoft manages the Azure Virtual Desktop service in Azure, and you manage the on-premises machines, the networking and the hosting infrastructure. The Tech Community announcement adds that all communication is outbound over HTTPS, so no inbound connectivity is needed. The Learn page on required endpoints says the same for Azure Virtual Desktop in general: all entries are outbound.

The product page for the entity is [Azure Virtual Desktop Hybrid](/entity/avd-hybrid/). The service itself is [Azure Virtual Desktop](/entity/azure-virtual-desktop/), and the connection layer is [Azure Arc](/entity/azure-arc/).

## Status and naming

Microsoft announced the general availability of Azure Virtual Desktop Hybrid in a Tech Community post published on 1 September 2026 and updated on 2 September 2026. Before that, a Windows IT Pro post of 4 May 2026 described it as being in public preview. The Learn overview and deployment pages are dated 2 September 2026 and show no preview notice. Nerdio's AVD Hybrid page, last modified in October 2026, gives no status.

Two names are easy to confuse. "Hybrid" in this article means the Azure Arc-based offer above. It is not the same as a hybrid-joined session host, which means a machine joined to both Active Directory and Microsoft Entra ID, and it is not Azure Virtual Desktop for Azure Local.

## What Hybrid does not do

Learn lists what Azure Virtual Desktop Hybrid does not support, because the service does not provision or manage virtual machine state:

- Power management
- Autoscale
- Start VM on Connect
- Session host configuration

The deployment page repeats the last point: when you create the host pool, it must be a standard host pool without added virtual machines, and session host configuration is not supported. If you came from Azure-hosted pools, this removes the features behind [power management autoscaling](/entity/avd-power-management-autoscaling/), [Start VM on Connect](/entity/avd-start-vm-on-connect/) and the [session host configuration](/entity/avd-session-host-configuration/). Learn says organizations deploy and manage their on-premises session hosts with hypervisor tools, scripts, partner solutions or other tools. A Microsoft representative said in a reply in the announcement comments that customers can use any tools they want, including scripts, to provision and manage session host states. That reply is a comment, not documentation.

Practical result: patching, image replacement, power-on schedules and capacity for the day are your job, or your partner tool's job. Nothing in the Azure portal will start a powered-off host for you.

## Operating systems and licensing

| Operating system | Support on Hybrid, per Learn |
|---|---|
| Windows Server 2025, 2022, 2019, 2016 | Supported on virtual machines and headless physical servers |
| Windows 11 Enterprise, Windows 10 Enterprise | Supported on virtual machines; physical devices only as dedicated, headless session hosts (rack-mounted or similar); laptops and personal PCs not supported |
| Windows 11 or Windows 10 Enterprise multi-session | Not supported |

Learn says licensing consists of the user entitlement and an Azure Virtual Desktop Hybrid service user license. For Windows Server, the entitlement is a Remote Desktop Services (RDS) Client Access License with Software Assurance (per user or per device) or RDS User Subscription Licenses. For the client operating systems it is, for example, Microsoft 365 E3, E5, A3, A5, F3 or Business Premium, Windows Enterprise E3 or E5, or Windows VDA per user. The announcement describes the model as per-user and refers to the Azure Virtual Desktop pricing page for the amounts. This article gives no price, because the sources read here do not state one.

Identity is a second filter. Windows client session hosts can be Microsoft Entra ID-joined, Active Directory Domain Services (AD DS)-joined or hybrid-joined. Windows Server session hosts must be AD DS-joined or hybrid-joined, because Learn says Entra-only join is not supported due to the Remote Desktop Services licensing server dependency.

## Hybrid compared with the neighbouring options

| | Session hosts in Azure | AVD for Azure Local | AVD Hybrid |
|---|---|---|---|
| Where hosts run | Azure virtual machines | Azure Local instances, version 23H2 or later and registered with Azure | Your hypervisor or headless physical device, Arc-enabled |
| Multi-session Windows 11 | Yes | Yes | No |
| Autoscale, Start VM on Connect | Yes, with their own conditions | Not covered by the sources read for this article | No |
| Fee beyond user rights | Azure compute and storage | Azure Local service fee plus a fee per active vCPU | Hybrid service user license; compute, storage and networking stay in your environment |
| Arc relationship | Not required | Learn: "isn't an Azure Arc-enabled service" | Required for every session host |

The Azure Local column comes from the [Azure Virtual Desktop on Azure Local](/entity/avd-for-azure-local/) overview page. It lists Windows 11 and Windows 10 Enterprise multi-session among the supported images, an Azure Local service fee, a fee per active vCPU, and the rule that one host pool holds hosts either in Azure or on Azure Local. Learn also says that offer is not supported as a standalone service outside Azure or on other Arc-enabled servers. The Azure Arc prerequisites page, on the other hand, lists Azure Local among the environments where the Connected Machine agent can be installed. The Hybrid sources read here name VMware vSphere, Nutanix AHV and Hyper-V as platforms, and none of them says whether Hybrid is intended for hosts on Azure Local. If your hardware is Azure Local, start from the Azure Local offer and confirm with Microsoft before planning Hybrid on it.

## When it fits and when it does not

The Learn overview pitches the offer as using current datacenter resources and the hypervisor you already run, with a consistent client experience across Azure Virtual Desktop, Hybrid and Windows 365. Nerdio's page lists the use cases it sees: existing investment in supported on-premises infrastructure, specific performance or latency needs, data residency or regulatory requirements, legacy VDI modernization and phased cloud adoption. That is a vendor view, and the Learn pages do not make those claims.

A short test for an admin:

1. **Does the workload have to run on your hardware?** If not, Azure-hosted session hosts keep autoscale and session host configuration.
2. **Do you need multi-session?** If yes, Hybrid is out. Look at Azure-hosted pools or the Azure Local offer.
3. **Can you provision and power-manage hosts yourself?** If you cannot, plan a partner tool or scripts before the pilot, not after.
4. **Can Windows Server hosts join AD DS?** If your design is Entra-only, Windows Server hosts do not qualify.
5. **Are the licenses in place?** The user entitlement and the Hybrid service user license are both required.

## Tools around it

The announcement names Login VSI, Nerdio and Nutanix as launch partners. Nerdio's help page says Nerdio Manager manages on-premises session hosts through Azure Arc alongside Windows 365, Azure VMs and Azure Local VMs, handles image management and patching, and automates VM lifecycle and power management. Its documented scope is narrower than Microsoft's: supported hypervisors are Nutanix AHV (through Prism Central) and VMware vSphere (through vCenter Server), the operating systems are Windows Server (virtual or physical) and single-session Windows 11 Enterprise (virtual only), and the session host VMs must be domain joined before the Arc extension is installed. Hyper-V is named in the Microsoft announcement but not in Nerdio's help page. If you use another tool, ask the same questions of it. The help page states no version number or release status.

## Sources

All pages retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop Hybrid overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/hybrid-overview)
- [Microsoft Learn: Deploy Azure Virtual Desktop Hybrid on-premises](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop-hybrid)
- [Microsoft Learn: Azure Virtual Desktop on Azure Local](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview)
- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Microsoft Learn: Azure Arc-enabled servers prerequisites](https://learn.microsoft.com/en-us/azure/azure-arc/servers/prerequisites)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Tech Community: Microsoft Azure Virtual Desktop Hybrid is now generally available (1 September 2026)](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-azure-virtual-desktop-hybrid-is-now-generally/ba-p/4550523)
- [Tech Community: Windows 365 and Azure Virtual Desktop expanding access (4 May 2026)](https://techcommunity.microsoft.com/blog/windows-itpro-blog/windows-365-and-azure-virtual-desktop-expanding-access/4515931)
- [Nerdio: AVD Hybrid](https://getnerdio.com/avd-hybrid/)
- [Nerdio Manager help: AVD Hybrid Support](https://nmehelp.getnerdio.com/hc/en-us/articles/45272022792461-AVD-Hybrid-Support)
