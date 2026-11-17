---
title: "Setting up Azure Virtual Desktop on Azure Local: prerequisites and pitfalls"
summary: "Before you add session hosts on Azure Local you need a registered instance on 23H2 or later, a Windows image, a logical network, an Active Directory domain join account and the right Azure roles. This guide walks through those prerequisites, the portal fields for the host pool and session hosts, and the constraints that cause rework."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-for-azure-local, azure-virtual-desktop]
keypoints:
  - "Prerequisites per Learn: an Azure Local instance registered with Azure on version 23H2 or later, a stable connection to Azure, at least one Windows image on the instance, and a logical network (DHCP, or static with automatic IP allocation)."
  - "Roles: Azure Stack HCI VM Contributor for session hosts on Azure Local, and Desktop Virtualization Contributor for creating the host pool, workspace and application group."
  - "In the portal you choose Azure Local as the virtual machine type and a custom location. The vCPU and memory values are not validated against the instance, and domain join offers Active Directory only."
  - "Pitfalls: standard management only (no session host configuration), no mixing Azure and Azure Local hosts in one pool, logical network settings that cannot be changed after creation, and VMs that must be licensed and activated before use."
  - "Do not delete the Azure Arc resource bridge unless you plan to reimage or decommission the instance: Learn says that removes the Azure control plane for Azure Local VMs."
faq:
  - q: "Which Azure Local version do I need for Azure Virtual Desktop?"
    a: "Learn says the Azure Local instance must run a minimum of version 23H2 and be registered with Azure. Azure Arc VM management is installed automatically. The Azure Government and Azure operated by 21Vianet versions are labeled preview on Learn."
  - q: "Can I use Microsoft Entra join for session hosts on Azure Local?"
    a: "The portal flow offers Active Directory only, which includes Microsoft Entra hybrid join. The Azure Local overview says native Microsoft Entra join is supported through PowerShell and other deployment methods, while the prerequisites page says Azure Local session hosts can only be joined to AD DS. Test your join method in a pilot and re-read both pages before committing."
  - q: "How long can the session host name prefix be?"
    a: "The prefix can be a maximum of 11 characters because it is used in the computer name, and the prefix and suffix combined can be a maximum of 15 characters. Session host names must be unique."
---

To add session hosts on Azure Local you need an instance on version 23H2 or later that is registered with Azure, at least one Windows image on it, a logical network, a domain account that can join computers to Active Directory, and the right Azure roles. This guide lists each prerequisite with its source, shows the portal fields for [Azure Virtual Desktop for Azure Local](/entity/avd-for-azure-local/), and collects the constraints that tend to force rework. For the decision whether Azure Local is the right place for session hosts, see the companion article on when to keep session hosts close to the data.

## Prerequisites

[Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) lists these items for session hosts on [Azure Local](/entity/azure-local/):

- An Azure Local instance registered with Azure, running at least version 23H2. Azure Arc VM management is installed automatically.
- A stable connection to Azure from your on-premises network.
- At least one Windows OS image on the instance. Image sources are Azure Marketplace, an Azure Storage account, or a local share.
- A logical network created on the instance. DHCP logical networks and static logical networks with automatic IP allocation are supported.
- Azure roles: the Azure Stack HCI VM Contributor role for session hosts on Azure Local, and Desktop Virtualization Contributor to create the host pool, workspace and application group.

Learn's general [prerequisites page](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) adds the identity side. You need a domain account that can join computers to your Active Directory domain, and the account used for the join cannot have multifactor authentication enabled. For hybrid identities, the UserPrincipalName or the Security Identifier must match across Active Directory Domain Services and Microsoft Entra ID, and you configure Microsoft Entra Connect to synchronize identities. The domain name, the join credentials and an optional organizational unit are the deployment parameters.

### Check the Arc components

The portal needs the Arc resource bridge and the custom location. Learn's Azure Local VM management overview says one Arc resource bridge is installed per cluster during the Azure Local deployment and a custom location is created with it. Each instance has one custom location. The [VM management prerequisites](https://learn.microsoft.com/en-us/azure/azure-local/manage/azure-arc-vm-management-prerequisites) give a quick check: open the Azure Local resource, go to **Overview > Server**, and verify that **Azure Arc** shows as **Connected**, with a custom location and an Arc resource bridge listed.

Two further rules from that page: all related entities (the instance, resource bridge, custom location, VM operator and the VMs) must be registered or created in the same Azure region, though they can be in different resource groups in that region; and the firewall requirements in Learn's "Required firewall URLs for Azure Local deployments" must be met so Arc VMs on Azure Local can communicate with Azure Arc.

### Prepare an image

If you need a Marketplace image on the instance, Learn's [Azure Marketplace image article](https://learn.microsoft.com/en-us/azure/azure-local/manage/virtual-machine-image-azure-marketplace) lists these prerequisites:

1. Assign the **Azure Connected Machine Resource Manager** role to the `Microsoft.AzureStackHCI` resource provider app for the resource group where the image is downloaded.
2. Register your subscription with the `Microsoft.EdgeMarketplace` resource provider.

The Azure CLI command has this shape (the page uses variables for each value):

```
az stack-hci-vm image create --resource-group <resource-group> --custom-location <custom-location-id> --name <image-name> --os-type <os-type> --offer <offer> --publisher <publisher> --sku <sku> --version <version>
```

For Windows 11 Enterprise multi-session the page lists publisher `microsoftwindowsdesktop`, offer `windows-11` and SKUs such as `win11-24h2-avd`; the multi-session image with Microsoft 365 apps uses offer `office-365` and, for example, `win11-24h2-avd-m365`. The `--version` value is optional and defaults to the latest. Use only English (en-us) VHDs for VM images, per the prerequisites page.

On the supported operating systems, the [overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview) lists Windows 11 and Windows 10 Enterprise (with and without multi-session) and Windows Server 2025, 2022 and 2019, in each case versions still in support.

## Create the host pool and session hosts in the portal

The steps follow the portal flow in Learn's deployment article.

1. **Create the host pool.** On the **Basics** tab, set the subscription, resource group, host pool name, location, validation environment, preferred app group type and host pool type (pooled or personal). Keep in mind that a host pool holds session hosts on Azure or on Azure Local, not both.
2. **Management approach.** Standard management is available for pooled and personal host pools with session hosts on Azure Local. Session host configuration is currently not supported with Azure Local.
3. **Virtual machines tab.** Set **Add virtual machines** to **Yes**, then expand the Azure Local section.
4. **Name prefix.** Use a prefix such as `hp01-sh`. The prefix is at most 11 characters, and prefix plus suffix at most 15 characters, because it becomes the computer name in the operating system. Names must be unique.
5. **Virtual machine type.** Select **Azure Local**, then pick the **Custom location**, which is the Azure Local instance that receives the session hosts.
6. **Image.** Select an image from the list, or **Manage VM images** to manage the images on that instance.
7. **Size.** Enter the number of VMs, the virtual processor count per host, and the memory type. **Static** gives a fixed allocation; **Dynamic** asks for a minimum and maximum memory. Learn says the processor and memory values are not validated against the resources available in the instance.
8. **Network.** Select an existing network to connect each session host to.
9. **Domain join.** **Active Directory** is the only option shown, including Microsoft Entra hybrid join. Enter the UPN and password of an account that can join computers, and choose whether to specify a domain or OU; if you answer no, the UPN suffix is used as the domain.
10. **Local administrator.** Enter a username and password for the local administrator account.
11. Complete the remaining tabs as for a host pool in Azure, then review and create.

Afterwards, license and activate the VMs before use. Learn says to use Azure verification for VMs for Windows 10 and 11 Enterprise multi-session and Windows Server 2022 Datacenter: Azure Edition, and your existing activation methods for other images.

## Plan the FSLogix profile storage

FSLogix profile containers need an SMB share. For smaller deployments Learn describes a VM-based file share cluster using Storage Spaces Direct on the instance (deploy VMs, set up Storage Spaces Direct in guest VM clusters, configure SMB permissions, configure [FSLogix](/entity/fslogix/)). For large deployments it recommends a separate SMB share on the same network so storage can scale independently. See the [profile container](/entity/fslogix-profile-container/) entity for the container concept.

## Pitfalls

| Pitfall | What the source says | What to do |
|---|---|---|
| Resource sizing is not checked | vCPU and memory values are not validated against the instance | Check free capacity on the instance yourself before entering the VM count |
| Logical network settings are fixed | After creation you cannot update the default gateway, IP pools, IP address space, VLAN ID or virtual switch name | Plan the address space and VLAN before creating the network |
| IPv4 only | Azure Local VMs support only IPv4 | Do not plan IPv6 for session hosts |
| Changes inside the VM do not sync | A static IP or data disk change made inside the VM or with local tools is not reflected in Azure | Make those changes through Azure management tools |
| Image updates are not in place | An update creates a separate image resource with an incremented name | Create a test VM from the new image, verify, then delete the old image |
| Resource bridge deletion | Deleting it removes the Azure control plane for Azure Local VMs; delete the custom location only after the bridge | Treat both as protected resources |
| Identity assumptions | Portal flow offers Active Directory only; the overview mentions native Entra join through PowerShell and other methods | Pilot the join method you need |
| Mixed pools | Azure and Azure Local hosts cannot share a host pool | Create separate pools |
| Azure Government and 21Vianet | Learn labels these versions preview; portal provisioning is not available for Azure Government | Check the page for the current status |

Two more points. The Azure Local VM management page says moving a resource group is not supported for these VMs and their associated resources, and that taking a VM checkpoint locally is supported only on Azure Local 2504 and later. Both bear on how you design resource groups and image rollbacks.

### Connectivity and the agent

Session hosts must reach the Azure Instance Metadata Service through the Azure Connected Machine agent, which the portal installs automatically when you add hosts. Learn's overview points to the "Required FQDN endpoints" list for the Azure Virtual Desktop URLs but does not list them. Treat them like any other deployment: confirm the URLs are not blocked by a firewall or network filtering.

## Verify the result

After deployment, confirm the following before assigning users:

- The session hosts show as available in the host pool.
- A test user can connect with a Remote Desktop client.
- Activation succeeded for the OS image you chose.
- The FSLogix share is reachable from the session hosts and permissions work.
- Monitoring and backup are in place (Azure Monitor and Azure Backup are among the services the Architecture Center lists for this design).

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Azure Virtual Desktop on Azure Local](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: What is Azure Local VM management?](https://learn.microsoft.com/en-us/azure/azure-local/manage/azure-arc-vm-management-overview)
- [Microsoft Learn: Azure Local VM management prerequisites](https://learn.microsoft.com/en-us/azure/azure-local/manage/azure-arc-vm-management-prerequisites)
- [Microsoft Learn: Create Azure Local VM images from Azure Marketplace](https://learn.microsoft.com/en-us/azure/azure-local/manage/virtual-machine-image-azure-marketplace)
- [Azure Architecture Center: Azure Virtual Desktop on Azure Local](https://learn.microsoft.com/en-us/azure/architecture/hybrid/azure-local-workload-virtual-desktop)
