---
title: "VDI vs DaaS: the terms explained"
summary: "VDI and DaaS are industry terms, not Microsoft product names. This guide maps them to Azure Virtual Desktop, Windows 365 and Windows 365 Flex by asking who runs which layer."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [virtual-desktop-infrastructure, azure-virtual-desktop]
keypoints:
  - "VDI describes an architecture of central VMs with remote access; DaaS describes buying desktops as a service. Learn labels Windows 365 SaaS and AVD PaaS, and also calls AVD VDI."
  - "Azure Virtual Desktop splits the work: Microsoft runs web, broker and gateway; you manage session hosts, image, network, backup and identities. Learn calls it PaaS and cloud VDI."
  - "Learn calls Windows 365 a SaaS with Cloud PCs in a Microsoft-owned subscription and per-user monthly licenses. Our reading: Microsoft's product closest to the common DaaS definition."
  - "Windows 365 Frontline was renamed Flex in May 2026. Flex Dedicated mode offers up to three Cloud PCs per license, so in our reading a DaaS label does not say if a desktop is personal or shared."
  - "Nerdio Manager for Enterprise deploys, manages and auto-scales AVD and Windows 365 Cloud PCs from the customer's own Azure subscription. Our reading: it manages them, not replaces them."
faq:
  - q: "Is Azure Virtual Desktop VDI or DaaS?"
    a: "Learn calls it a PaaS model and a cloud VDI platform, and says Microsoft provides the VDI components (web, broker and gateway services) as a service while the customer creates and manages the session hosts, image, network connectivity, backup and identities. Nerdio's DaaS page says Azure Virtual Desktop is not truly a DaaS service, but covers it alongside Windows 365 because Microsoft groups both under Windows Cloud. Our reading: the split of responsibilities answers the question better than either label."
  - q: "Is Windows 365 a DaaS?"
    a: "Learn's wording is SaaS: a cloud-based service that creates Cloud PCs, which exist in a subscription owned by Microsoft under a per-user per-month license model. Our reading: that matches the common DaaS definition, a provider hosting virtual desktops, so DaaS works as shorthand, but it is not Learn's own label for the product."
  - q: "Does a Windows 365 Flex license mean one desktop per user?"
    a: "No. In Dedicated mode, one Flex license lets you provision up to three Cloud PCs for non-concurrent use, each assigned to one user. In Shared mode, one license provisions one Cloud PC shared by a group, one user at a time. The number of licenses caps concurrent sessions. In Dedicated mode a concurrency buffer lets you exceed that cap a limited number of times per day; Shared mode has no buffer."
---

VDI (virtual desktop infrastructure) and DaaS (desktop as a service) are industry terms, not Microsoft product names, and sources define them differently. In our reading, VDI describes an architecture in which user desktops run as virtual machines on central infrastructure, and DaaS describes how that architecture is bought: a provider operates it and you pay for the desktops as a service. Because the two overlap, the useful question is who runs which layer.

## What the two terms usually mean

Published definitions do not line up exactly. Nerdio's DaaS page describes VDI as "the on-premises model where your organization owns and runs the servers, storage, and hypervisor" and DaaS as "a cloud model where a provider hosts virtual desktops". A Microsoft blog post on its placement in the 2023 Gartner Magic Quadrant for Desktop as a Service quotes Gartner's definition of DaaS as "the provision of virtual desktops by a public cloud or service provider". Microsoft Learn uses "VDI" more widely, including for cloud services, as the next section shows.

Our working reading: the [virtual desktop infrastructure](https://www.m365.fm/entity/virtual-desktop-infrastructure/) is the set of components that host desktops on central servers or in the cloud and connect users to them: hosts, a connection broker, a gateway, storage for [profiles](https://www.m365.fm/entity/fslogix/), identity and network. DaaS moves the operation of those layers to a provider and turns the cost into a subscription.

In practice the line is blurred. Between "you run everything" and "the provider runs everything" there are many mixed models, and vendors place their products at different points. A label such as "VDI" or "DaaS" in a requirements document therefore tells you little until it is tied to a responsibility list.

## What Microsoft's own pages say

Learn's wording differs by page. The Windows 365 overview calls Windows 365 a SaaS, and the training unit that compares the two services calls Azure Virtual Desktop a "PaaS model". The same unit calls Azure Virtual Desktop "a cloud VDI platform" and says Windows 365 needs "no virtual desktop infrastructure (VDI) expertise". The service architecture page for [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) says most components are Microsoft-managed and that "Microsoft provides the virtual desktop infrastructure (VDI) components for core functionality as a service". It lists:

- a **web service** that returns connection information to the user's device,
- a **broker service** that orchestrates incoming connections,
- a **gateway service**, a websocket service that provides [Remote Desktop Protocol](https://www.m365.fm/entity/remote-desktop-protocol/) connectivity from the user's device to the session hosts,
- a resource directory, a geographical database and a regional database.

The customer side is listed separately. You are responsible for creating and managing [session hosts](https://www.m365.fm/entity/avd-session-host/), including image customizations and applications, virtual network connectivity, resiliency, and backup and recovery of those hosts. You also provide and manage user identities and control access. The Azure Virtual Desktop overview condenses this to: you manage "the image and virtual machines you use for the sessions in your Azure subscription, not the infrastructure", and you do not need to run a gateway or broker as you would with Remote Desktop Services.

[Windows 365](https://www.m365.fm/entity/windows-365/) is described differently. Learn calls it "a cloud-based software-as-a-service (SaaS)" that automatically creates Cloud PCs. The architecture page says the Cloud PCs exist in a subscription owned by Microsoft, which carries the cost of running that infrastructure, and that Windows 365 sizes the VM from the license you assign. Cloud PC connectivity is provided by Azure Virtual Desktop, and Microsoft Intune manages the Cloud PCs.

## Mapping the products to the terms

Learn's training unit that compares the two services labels Windows 365 "SaaS: complete end-to-end Microsoft service" and Azure Virtual Desktop "PaaS: granular controls over configuration and management". The table combines that unit with the Windows 365 and Azure Virtual Desktop pages.

| Layer | Azure Virtual Desktop | Windows 365 Enterprise | Windows 365 Business |
|---|---|---|---|
| Service label (Learn training unit) | PaaS | SaaS | SaaS |
| Where the VMs run | Customer's Azure subscription | Subscription owned by Microsoft | Microsoft-managed |
| Network | Customer-managed virtual network | Microsoft-hosted network, or a customer virtual network through an Azure network connection | Microsoft-managed |
| Provisioning and image | Manual provisioning, fully customizable | Fully customizable image | Automatic, no customization |
| Management tool | Azure portal, Microsoft Intune, PowerShell | Microsoft Intune | Web self-service |
| Users per VM | Single-session or multi-session | Single user | Single user |
| Pricing | Consumption-based | Per user per month; additional costs may apply for network usage | Per user per month |

Two details change how the table reads. First, Windows 11 and Windows 10 Enterprise multi-session is exclusive to Azure Virtual Desktop. Learn lists it among the key capabilities, saying it can "greatly reduce the number of virtual machines and operating system overhead". Second, Windows 365 Business is made for smaller companies, up to 300 seats according to Learn, while Enterprise has no seat limit.

Our reading: if you take "DaaS" to mean "the provider runs the hosts and I pay per user", Windows 365 matches. If you take "VDI" to mean "I build and run the hosts", Azure Virtual Desktop matches, with the difference that Microsoft runs the broker and gateway for you. Learn also describes hybrid options: Azure Virtual Desktop Hybrid hosts session hosts on-premises on a hypervisor of your choice, in Learn's overview wording, and Azure Virtual Desktop for Azure Local runs them as VMs on Azure Local. In our reading, that is closer to VDI hosted on-premises, with a Microsoft-run service in front of it.

## Windows 365 Flex: one license, several users

[Windows 365 Frontline](https://www.m365.fm/entity/windows-365-frontline/) was renamed Windows 365 Flex in the week of 4 May 2026. Learn's what's new page says the product, licensing and capabilities are unchanged and only the name is different.

Flex has two modes, and a license can be applied to either:

- **Dedicated mode**: one license lets you provision up to three Cloud PCs for non-concurrent use, each assigned to a single user, with one concurrent session. User data persists between sessions.
- **Shared mode**: one license lets you provision one Cloud PC that a group of users share non-concurrently, with one concurrent session. User data is deleted after each session, and Learn says Shared mode is currently only available for Azure Global Cloud.

Learn's example: with 10 licenses in Dedicated mode you can provision up to 30 Cloud PCs, but only 10 of them can be active at a given time. A concurrency buffer lets you exceed that maximum a limited number of times per day, in Dedicated mode only and not for GPU-enabled Cloud PCs. In our reading, this shows why "DaaS" alone does not describe a desktop model: a provider-run desktop can be personal or shared depending on the mode. In [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) the comparable question is answered by the host pool type: [pooled](https://www.m365.fm/entity/avd-pooled-host-pool/) lets sessions be load balanced to any session host with several users on one host, and [personal](https://www.m365.fm/entity/avd-personal-host-pool/) assigns each session host to one user.

## Third-party DaaS and where Nerdio fits

The word DaaS also appears as a vendor product name. Learn's Azure architecture getting-started page lists "Citrix DaaS" as "a desktop and app virtualization service that you can use to provision Windows desktops and apps on Azure with Citrix and Azure Virtual Desktop". Learn lists it alongside Azure Virtual Desktop, Windows 365 and Omnissa Horizon Cloud on Microsoft Azure as an Azure virtual desktop solution. This article does not compare it feature by feature.

Nerdio Manager sits on another axis. Nerdio's documentation describes Nerdio Manager for Enterprise as "a deployment, management, and auto-scaling platform" for Azure Virtual Desktop and Windows 365 Cloud PCs, "deployed as an all-PaaS, secure Azure application inside the customer's own subscription". Nerdio's own blog says it provides a single console for both Windows 365 and Azure Virtual Desktop environments. Our reading: it is a management layer on top of those services. The desktops remain Azure Virtual Desktop session hosts or Windows 365 Cloud PCs, so the service-model question in this article is the same with or without it. See [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) and [Nerdio](https://www.m365.fm/entity/nerdio/).

## Using the terms in a requirements conversation

Replace the labels with questions, and note the answers in a sheet before comparing vendors:

1. **Who creates and patches the image?** With Azure Virtual Desktop you own the image and the session hosts. With Windows 365 Business, provisioning is automatic and cannot be customized; Enterprise allows a custom image.
2. **Does the user need a private desktop or a shared host?** Windows 11 and Windows 10 Enterprise multi-session is exclusive to Azure Virtual Desktop. Windows 365 Enterprise and Business are single-user Cloud PCs. Flex licenses are used non-concurrently.
3. **Whose subscription and network carry the VMs?** Azure Virtual Desktop VMs run in your subscription and virtual network. Learn's Windows 365 architecture page says that if you use Microsoft Entra join and a Microsoft-hosted network, you do not need to bring an Azure subscription or manage the NIC; if you bring your own network and use an Azure network connection, the NICs are created by Windows 365 in your Azure subscription.
4. **How is cost metered?** Consumption for Azure Virtual Desktop, per user per month for Windows 365. Learn says the more cost-effective option depends on planning and forecasting usage, so use your own user counts and current Microsoft price pages.
5. **Which licenses entitle users?** Learn's prerequisites list entitlements such as Microsoft 365 E3, E5, A3, A5, F3 and Business Premium for internal use of Windows client images on Azure Virtual Desktop. For Windows 365 Enterprise, Learn's requirements page says users must have licenses for Windows E3, Intune, Microsoft Entra ID P1 and Windows 365; for Windows 365 Flex, licenses for Windows E3, Intune and Microsoft Entra ID P1, and membership in the Microsoft Entra security group in the provisioning policy. Windows 365 is billed per user per month.
6. **Which identity and device management do you already run?** Microsoft Entra ID is always used to authenticate Azure Virtual Desktop users; Learn's Windows 365 architecture page says [Intune](https://www.m365.fm/entity/intune/) is used to manage Cloud PCs.

A short example: a company has 300 knowledge workers who each need a personal desktop and a team of 40 call-center agents on shifts. The first group maps to single-user desktops, where Windows 365 Enterprise and a personal [host pool](https://www.m365.fm/entity/avd-host-pool/) are both candidates. The second group is a candidate for Flex or a pooled host pool. In our reading, the answers to questions 1 to 4 decide, not the label. The article "AVD or Windows 365: how to choose between them" goes deeper into that decision.

## Sources

Last checked 17 November 2026.

- [Microsoft Learn: What is Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: What is Windows 365?](https://learn.microsoft.com/en-us/windows-365/overview)
- [Microsoft Learn: Windows 365 requirements](https://learn.microsoft.com/en-us/windows-365/enterprise/requirements)
- [Microsoft Learn: What is Windows 365 Enterprise?](https://learn.microsoft.com/en-us/windows-365/enterprise/overview)
- [Microsoft Learn: Windows 365 architecture](https://learn.microsoft.com/en-us/windows-365/enterprise/architecture)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Learn: What's new in Windows 365 Enterprise and Windows 365 Flex](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Learn: Compare Windows 365 Cloud PCs to Azure Virtual Desktop (training unit)](https://learn.microsoft.com/en-us/training/modules/examine-windows-365/3-compare-windows-365-azure-virtual-desktop)
- [Microsoft Learn: Get started with virtual desktop architecture design](https://learn.microsoft.com/en-us/azure/architecture/virtual-desktop/virtual-desktop-get-started)
- [Nerdio: Desktop as a Service (DaaS) explained](https://getnerdio.com/daas/)
- [Microsoft 365 Blog: Microsoft recognized as a Leader in the 2023 Gartner Magic Quadrant for Desktop as a Service](https://www.microsoft.com/en-us/microsoft-365/blog/2023/09/13/microsoft-recognized-as-a-leader-in-2023-gartner-magic-quadrant-for-desktop-as-a-service/)
- [Nerdio: About Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124301747213-About-Nerdio-Manager)
- [Nerdio: Windows 365 vs. Azure Virtual Desktop: how to decide](https://getnerdio.com/blog/windows-365-vs-azure-virtual-desktop/)
