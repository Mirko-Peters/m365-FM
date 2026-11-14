---
title: "How to Create an Azure Virtual Desktop Host Pool and Session Hosts in the Azure Portal"
summary: "Create an Azure Virtual Desktop host pool and session hosts in the Azure portal: RBAC roles, network checks, Basics and Virtual machines tab settings, recommended values and documented caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [azure-virtual-desktop, avd-host-pool]
keypoints:
  - "Learn requires Desktop Virtualization Contributor for host pool, workspace and application group, and Virtual Machine Contributor for session hosts."
  - "Deployment scope (Regional or Geographical) cannot be changed after the host pool is created."
  - "Check that the subnet reaches the required FQDNs. Learn calls skipping this the most common cause of registration failures such as EXPIRED_MACHINE_TOKEN."
  - "Learn recommends Premium SSD for production OS disks, no public inbound ports and an NSG on the subnet instead of on the VMs."
  - "The page content read ended before the standard-path Workspace tab and the application group assignment steps, so those are not covered here."
faq:
  - q: "Which roles do I need to create a host pool with session hosts?"
    a: "Learn lists Desktop Virtualization Contributor for the host pool, workspace and application group, and Virtual Machine Contributor for session hosts, each on the resource group or subscription. Assigning users needs role assignment write permission, granted by User Access Administrator or Owner."
  - q: "Can I change Regional or Geographical later?"
    a: "No. Learn says the deployment scope cannot be changed after the host pool is created."
  - q: "What is the maximum number of VMs I can add in the wizard?"
    a: "Learn says up to 400 at this point, subject to the quota of your subscription."
  - q: "Why do session hosts fail to register?"
    a: "Learn says the most common cause is skipping the network check. Run the Azure Virtual Desktop Agent URL Tool from the first session host after it joins the network. It gives EXPIRED_MACHINE_TOKEN as an example error."
  - q: "Do I need WinRM on session hosts?"
    a: "Learn says not to disable Windows Remote Management, because PowerShell DSC requires it."
---

To create a host pool in the Azure portal, search for Azure Virtual Desktop, select Host pools and then Create. Fill in the Basics tab, optionally add virtual machines, then review and create. This guide follows the Microsoft Learn article on the standard management path. The part of the article read for this guide ended before the standard-path Workspace tab and the user assignment steps, so those are marked as gaps.

## Prerequisites from Learn

**Network.** Before you deploy session hosts, confirm the subnet can reach the required FQDNs and endpoints. After the first session host joins the network, run the Azure Virtual Desktop Agent URL Tool from that host. Learn calls skipping this the most common cause of registration failures, for example `EXPIRED_MACHINE_TOKEN`.

**RBAC for Azure session hosts.**

| Scope of work | Role |
| --- | --- |
| Host pool, workspace and application group | Desktop Virtualization Contributor |
| Session hosts | Virtual Machine Contributor |
| Session hosts on Azure Local | Azure Stack HCI VM Contributor |
| Assigning users to the application group | `Microsoft.Authorization/roleAssignments/write`, granted by User Access Administrator or Owner |

Roles can be granted on the resource group or the subscription.

**Azure Local, if you use it.** The instance must be registered with Azure and run version 23H2 or later, with a stable Azure connection, at least one Windows OS image and a logical network.

**Active Directory join.** The account that joins machines needs these permissions on the OU for session hosts: Reset password, Validated write to DNS host name, Validated write to service principal name, Read account restrictions and Write account restrictions. Learn also points to KB5020276 for computer account reuse rules.

**Other.** Do not disable Windows Remote Management, because PowerShell DSC requires it. For scripted work, use Azure Cloud Shell or install the Az.DesktopVirtualization module.

## Create the host pool

1. Sign in to the Azure portal and search for **Azure Virtual Desktop**.
2. Select **Host pools**, then **Create**.

### Basics tab

| Field | Value |
| --- | --- |
| Subscription, Resource group | Select or create |
| Host pool name | For example `hp01` |
| Location | Region for host pool metadata |
| Deployment scope | Regional or Geographical (default). Cannot be changed after creation |
| Validation environment | No (default) or Yes |
| Preferred app group type | Desktop or RemoteApp |
| Host pool type | Pooled or Personal |

For a **Pooled** host pool, choose the load balancing algorithm, **breadth-first** or **depth-first**, and the **Max session limit** per session host. For a **Personal** host pool, choose the assignment type, **Automatic** or **Direct**. Assigning multiple desktops to one user is available only with Direct.

Select **Next: Virtual machines**.

### Virtual machines tab (optional)

Set **Add virtual machines** to **Yes** to create session hosts now.

| Field | What Learn says |
| --- | --- |
| Name prefix | For example `hp01-sh`. Maximum 11 characters in this path. Suffixes are `-0`, `-1` and so on |
| Virtual machine type | Azure virtual machine |
| Location | Same region as the virtual network |
| Availability options | Availability zones, availability set, or no infrastructure redundancy required |
| Security type | Standard, Trusted launch or Confidential |
| Image | From the list or **See all images**, which includes Azure Compute Gallery and managed images |
| Hibernate | Personal pools only. Do not enable together with FSLogix or App Attach |
| Number of VMs | Up to 400 at this point, subject to subscription quota |
| OS disk type | Premium SSD recommended for production |
| OS disk size | Larger if hibernation is enabled |
| Network security group | Recommended: None, and use an NSG on the subnet instead |
| Public inbound ports | No, recommended |
| Domain to join | Microsoft Entra ID or Active Directory |
| Administrator account | Local admin username and password |
| Custom configuration script URL | Optional PowerShell script |

### Finish

Learn lists a **Management** tab (optional) for a managed identity and diagnostic settings, an optional **Tags** tab, and then **Review + create**. Confirm that validation passes, select **Create**, then **Go to resource** and **Properties**.

## Notes from the article

- The portal creates a **Desktop** application group automatically, based on your preferred application group type.
- If you create the host pool and workspace in one process but do not register the default desktop application group, create an application group separately.
- Session hosts can run in any Azure region, but the virtual network must be in the same region as the VM location you select.
- For Azure Local session hosts, license and activate the VMs before use.
- Session host configuration is a separate path. There the admin credentials come from a Key Vault, the name prefix is limited to 10 characters, and the service creates the session hosts.

## What this guide does not cover

The article content read ended before the standard-path **Workspace** tab and the steps for application group and user assignment. In the session host configuration path, Learn says you select **Register desktop app group: Yes** and then choose or create a workspace. For user assignment, follow the linked steps in the article.

## Typical mistakes

- Choosing the wrong deployment scope, which cannot be changed later.
- Placing the VMs in a region that differs from the virtual network.
- Leaving public inbound ports open or attaching an NSG to each VM against the recommendation.
- Skipping the URL tool check and then debugging registration errors.
- Enabling hibernation together with FSLogix or App Attach.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [AVD host pool](https://www.m365.fm/entity/avd-host-pool/)
- [FSLogix](https://www.m365.fm/entity/fslogix/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Deploy Azure Virtual Desktop: create a host pool and session hosts (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/create-host-pools-azure-marketplace)
