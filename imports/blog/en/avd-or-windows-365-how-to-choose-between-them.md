---
title: "AVD or Windows 365: how to choose between them"
summary: "Azure Virtual Desktop suits pooled, multi-session or highly customized environments that the organization builds and runs itself. Windows 365 Enterprise and Business suit one dedicated Cloud PC per user, licensed per user per month."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, windows-365]
keypoints:
  - "Windows 365 Enterprise and Business assign each Cloud PC to one user and are licensed per user per month. Flex is the exception: its licenses are pooled at tenant level. Azure Virtual Desktop uses consumption-based pricing and offers multi-session."
  - "Windows 11 and Windows 10 Enterprise multi-session is exclusive to Azure Virtual Desktop. Windows Server session hosts are also an AVD option."
  - "Windows 365 Enterprise can run on a Microsoft-hosted network without an Azure subscription. AVD in Azure needs an Azure subscription, a virtual network for the session hosts and the relevant Azure RBAC roles for deployment."
  - "Windows 365 Cloud PC connectivity is provided by Azure Virtual Desktop, but Cloud PCs are hosted in a Microsoft-owned subscription and do not support third-party connection brokers."
  - "Learn notes that some organizations use both services, because each suits particular workloads. Which workloads go where is the administrator's own assessment."
faq:
  - q: "Is Windows 365 the same as Azure Virtual Desktop?"
    a: "No. Microsoft Learn describes Windows 365 as a service that creates Cloud PCs. In Windows 365 Enterprise, Business and Government, each end user has a 1:1 relationship with a Cloud PC, as their own personal PC in the cloud. Windows 365 Flex is the exception: multiple users can access a single Cloud PC, but not at the same time. Learn describes Azure Virtual Desktop as a desktop and app virtualization service that runs on Azure. Windows 365 uses Azure Virtual Desktop for connectivity, and its Cloud PCs are hosted in a subscription owned by Microsoft."
  - q: "Can I run multi-session Windows 11 on Windows 365?"
    a: "No. Microsoft Learn describes Windows 11 and Windows 10 Enterprise multi-session as exclusive to Azure Virtual Desktop, and an Enterprise or Business Cloud PC is a single-user device. Windows 365 Flex (formerly Frontline) is a different model: in Dedicated mode one license provisions up to three Cloud PCs for three users, and in Shared mode one Cloud PC is shared by a group, one user at a time."
  - q: "Which one costs less?"
    a: "It depends on the workload. Windows 365 Enterprise and Business licenses are priced per user per month. With an Azure network connection, Azure network costs come on top. On the Microsoft-hosted network, Learn ties the monthly outbound data to the Cloud PC's RAM size, and bandwidth may be restricted above that. AVD cost varies with the compute, storage and other Azure services in use, and pooled multi-session can reduce the number of VMs. Compare both with your own numbers on the current Microsoft pricing pages."
---

Choose Azure Virtual Desktop (AVD) when you need pooled multi-session hosts, Windows Server, or control over the image, network and scaling. Choose Windows 365 Enterprise or Business when each user should get one dedicated Cloud PC that Microsoft provisions automatically and licenses per user per month. This article compares the two using Microsoft Learn.

## The short version

| Criterion | Azure Virtual Desktop | Windows 365 |
|---|---|---|
| Model | Desktop and app virtualization service that runs on Azure | Cloud PCs, each assigned to one user (Flex: see below) |
| Operating systems | Windows 11, Windows 10, Windows Server | Windows 11, Windows 10 |
| Multi-session | Yes. Windows 11 and 10 Enterprise multi-session is exclusive to AVD | No, single user per Cloud PC (Flex shares one Cloud PC one user at a time) |
| Billing | Consumption based | Per user, per month (Flex: pooled licenses at tenant level) |
| Management | Azure portal, Azure CLI, PowerShell, REST API; Intune | Intune (Enterprise), web self-service (Business) |
| Azure subscription | Required | Enterprise: not needed on the Microsoft-hosted network, required for an Azure network connection. Business: uses the Microsoft-hosted network |

## What each service is

Microsoft Learn describes [Azure Virtual Desktop](/entity/azure-virtual-desktop/) as "a desktop and app virtualization service that runs on Azure." The environment is created in the organization's own Azure subscription.

[Windows 365](/entity/windows-365/) Enterprise is, in Learn's words, "a cloud-based service that automatically creates a new type of Windows virtual machine (Cloud PCs) for your end users." Each Cloud PC is assigned to an individual user. Admins do not create Cloud PCs by hand. After Cloud PC support is set up in Microsoft Intune, a Cloud PC is provisioned automatically whenever a user with a Cloud PC license is assigned to an appropriate Microsoft Entra user group, and the Cloud PC is enrolled in Intune.

The two services are connected. The Windows 365 architecture page states that Cloud PC connectivity is provided by Azure Virtual Desktop and that no inbound connections from the internet are made to the Cloud PC. It also says Cloud PCs do not support third-party connection brokers. For AVD, Learn names Citrix and Omnissa as Approved Providers (see criterion 1).

## Decision criteria

### 1. Dedicated desktop or shared host

- An Enterprise or Business Cloud PC belongs to one user. Flex is the exception (see below).
- AVD offers both. Learn says single-session assigns devices to one user, and multi-session provides scalability. Windows 11 and Windows 10 Enterprise multi-session is "exclusive to Azure Virtual Desktop" and can "greatly reduce the number of virtual machines and operating system overhead." The multi-session FAQ adds that running Windows Enterprise multi-session in production outside the AVD service violates the licensing agreement. Only Microsoft and the Approved Providers Citrix and Omnissa may provide access. See [pooled host pools](/entity/avd-pooled-host-pool/) and [personal host pools](/entity/avd-personal-host-pool/).

Only AVD supports several users signed in at the same time on one host (multi-session). Windows 365 Flex lets users share Cloud PCs one at a time. If every user needs a persistent personal desktop with no host sizing, Windows 365 fits more directly. AVD covers that case through personal host pools, but the hosts must be managed.

### 2. Operating system and application scope

Learn lists Windows 11, Windows 10 and Windows Server for AVD, and Windows 10 and Windows 11 for Windows 365. AVD can publish a full desktop or individual applications (see [RemoteApp](/entity/avd-remoteapp/)). If an application requires Windows Server session hosts, only AVD applies.

### 3. How billing works

Learn's comparison lists AVD with a "consumption-based pricing model" and Windows 365 with "per-user, per-month subscriptions." Three details change the picture:

- Windows 365 Enterprise on an Azure network connection (ANC): the network is not part of the license, and Azure bandwidth and virtual network costs fall on the organization's subscription.
- Microsoft-hosted network: outbound data per month depends on the Cloud PC's RAM (for example 20 GB for 4 or 8 GB RAM), and bandwidth may be restricted above that. The comparison page lists this under Business, and says the same charges apply to Enterprise on a Microsoft-hosted network.
- Windows 365 Flex licenses are pooled licenses applied at the tenant level, not assigned directly to users (see below). Each Flex user still needs Windows Enterprise, Intune and Microsoft Entra ID P1.

A practical comparison method:

1. List users by profile: dedicated, shared, part-time, occasional.
2. For AVD, estimate VM size per session count, storage for profiles and images, networking and operations effort. Autoscale can help manage compute cost, see [power management autoscaling](/entity/avd-power-management-autoscaling/).
3. For Windows 365, take the per-user price for the Cloud PC size each profile needs, plus network costs if ANC is used.
4. Compare totals per profile, not for the whole company.

### 4. Licensing prerequisites

AVD users need an eligible license. Learn's prerequisites list, for Windows 11 and Windows 10 Enterprise (including multi-session), Microsoft 365 E3, E5, A3, A5, F3, Business Premium or Student Use Benefit, Windows Enterprise E3 or E5, Windows Education A3 or A5, or Windows VDA per user. Windows Server session hosts need RDS Client Access Licenses with Software Assurance or RDS User Subscription Licenses. For external commercial use, per-user access pricing applies to the Windows client operating systems and is not available for Windows Server.

According to the Learn page comparing Business and Enterprise, Windows 365 Enterprise requires each user to be licensed for Windows 11 or Windows 10 Enterprise, Microsoft Intune and Microsoft Entra ID P1, and has no user limit per tenant. Business has no licensing prerequisites and is capped at 300 users per tenant.

### 5. Azure skills and network control

AVD in Azure requires an Azure subscription, the relevant Azure RBAC roles for deployment (the prerequisites page leaves the specific roles to the deployment articles; Learn's built-in roles article describes them) and the `Microsoft.DesktopVirtualization` resource provider registered, which needs Contributor or Owner on the subscription. A virtual network and subnet in the same Azure region as the session hosts are required. Round-trip time from the client network to the Azure region should be below 150 ms. Session hosts can join Microsoft Entra ID or an Active Directory domain (AD DS or Microsoft Entra Domain Services).

Windows 365 Enterprise has two network options, per the Learn deployment options page:

- **Microsoft-hosted network:** no Azure subscription needed, "all you need is the required licenses." There is no control of the virtual network and no direct access to on-premises resources, so a VPN or private access solution is required. It supports Microsoft Entra join, not hybrid join. Learn calls it the recommended option and says Microsoft recommends it for Windows 365 deployments.
- **Azure network connection (ANC):** the Cloud PC's network interface sits in a virtual network in the organization's own subscription. This gives direct line of sight to on-premises resources and supports both Entra join and Entra hybrid join. Egress and network infrastructure costs fall on that subscription. Hybrid join requires this option.

Windows 365 Business has no virtual network option: Learn's comparison lists Microsoft Entra join without VNet support, and the training unit lists the Microsoft-managed network for Business. Enterprise can use both options side by side, for example ANC for legacy requirements only.

### 6. Management model

For AVD, the overview lists the Azure portal, Azure CLI, Azure PowerShell and REST API, the Learn comparison with Windows 365 also lists Intune, and AVD Insights covers monitoring. Windows 365 Enterprise Cloud PCs are enrolled in and managed through Intune. Business Cloud PCs are managed in the Microsoft 365 admin center or the Windows App. Intune is optional for Business, and enrolling in it does not unlock Enterprise-only capabilities such as custom images or provisioning policies. Third-party AVD tools such as [Nerdio](/entity/nerdio/) are a separate decision.

### 7. Image and customization

Learn's comparison lists AVD provisioning as manual and fully customizable, Windows 365 provisioning as automatic, with no customization for Business and a fully customizable image for Enterprise (gallery or custom images). AVD is fully customizable, with profile solutions such as [FSLogix](/entity/fslogix/). Windows 365 offers several CPU, RAM and storage sizes.

### 8. Where the desktop runs

Windows 365 Cloud PCs exist in a subscription owned by Microsoft ("hosted on behalf of"), and the region of the virtual network determines where the Cloud PC is created. AVD session hosts run in the organization's subscription. For on-premises hosting, Learn names [AVD Hybrid and AVD for Azure Local](/entity/avd-for-azure-local/) for this.

## Windows 365 Flex

Windows 365 Frontline was renamed Windows 365 Flex in the week of May 4, 2026, according to Learn's What's new page: "The product, licensing, and capabilities are unchanged—only the name is different." In short:

- **Dedicated mode:** one license provisions up to three Cloud PCs used non-concurrently, each assigned to one user, with one concurrent session.
- **Shared mode:** one license provisions one Cloud PC shared non-concurrently by a group. All user data is deleted at sign-out, unless User Experience Sync is enabled for user-specific app data and Windows settings. Learn notes Shared mode is available only for Azure Global Cloud.
- **Status:** the Flex page gives no preview or GA label. What's new records Frontline Shared mode as generally available since the week of March 31, 2025, and Dedicated mode concurrency management since the week of June 2, 2025.

Flex is not multi-session: only one user is signed in to a given Cloud PC at a time.

## A practical selection checklist

1. Do several users need to be signed in on one host at the same time to control cost? If yes, AVD multi-session. Flex Shared mode is the one-at-a-time alternative.
2. Is Windows Server required? If yes, AVD.
3. Does each user need one persistent personal desktop with a per-user license? Evaluate Windows 365.
4. Is there no Azure subscription or Azure team? Windows 365 on the Microsoft-hosted network.
5. Is direct network access to on-premises systems or Entra hybrid join required? Windows 365 with ANC, or AVD.
6. Do desktops have to run on-premises? Check AVD Hybrid or AVD for Azure Local.
7. Pilot each profile on both options and compare support effort, not only price.

## Example scenarios

- **Call center, 150 agents on shifts, one application set.** Shared hosts are an option, so AVD multi-session with autoscale is worth pricing. Windows 365 Flex Shared mode is the other candidate. Because Shared mode deletes user data at sign-out, this article's own assessment is that profile data would have to be kept elsewhere; Learn does not discuss this case.
- **Consultancy, 40 contractors who need a persistent Windows 11 desktop for a project.** Business Cloud PCs are provisioned and run without Intune, but with no image customization. Enterprise Cloud PCs are created from provisioning policies assigned to Microsoft Entra groups, and each user needs a license. Both use a per-user license.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Windows 365](/entity/windows-365/)
- [Windows 365 Flex (formerly Frontline)](/entity/windows-365-frontline/)
- [FSLogix](/entity/fslogix/)
- [Intune](/entity/intune/)

## Sources

Retrieved on 2026-11-17.

- [Microsoft Learn: What is Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Windows Enterprise multi-session FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq)
- [Microsoft Learn: What is Windows 365 Enterprise?](https://learn.microsoft.com/en-us/windows-365/enterprise/overview)
- [Microsoft Learn: Windows 365 architecture](https://learn.microsoft.com/en-us/windows-365/enterprise/architecture)
- [Microsoft Learn: Windows 365 deployment options](https://learn.microsoft.com/en-us/windows-365/enterprise/deployment-options)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Learn: What's new in Windows 365 Enterprise and Windows 365 Flex](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Learn: Create a provisioning policy for Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/create-provisioning-policy)
- [Microsoft Learn: Windows 365 Flex licensing](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-flex-license)
- [Microsoft Learn: Compare Windows 365 Business and Enterprise](https://learn.microsoft.com/en-us/windows-365/business-enterprise-comparison)
- [Microsoft Learn: Manage Windows 365 Business Cloud PCs](https://learn.microsoft.com/en-us/windows-365/business/device-management)
- [Microsoft Learn: Compare Windows 365 Cloud PCs to Azure Virtual Desktop (training unit)](https://learn.microsoft.com/en-us/training/modules/examine-windows-365/3-compare-windows-365-azure-virtual-desktop)
- [Microsoft Learn: Examine Windows 365 editions (training unit)](https://learn.microsoft.com/en-us/training/modules/examine-windows-365/2-examine-windows-365-editions)
