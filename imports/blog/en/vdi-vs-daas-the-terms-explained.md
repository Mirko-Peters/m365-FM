---
title: "VDI vs DaaS: the terms explained"
summary: "VDI and DaaS are industry terms, not Microsoft product names. This guide maps them to Azure Virtual Desktop, Windows 365 and Windows 365 Flex by asking who runs which layer."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [virtual-desktop-infrastructure, azure-virtual-desktop]
keypoints:
  - "VDI describes the architecture: desktops run as virtual machines on central infrastructure and users connect remotely. DaaS describes a purchase model: a provider operates that infrastructure and you pay for the desktops as a service. Both labels are industry usage, not Microsoft product categories."
  - "Azure Virtual Desktop sits between the two. Microsoft provides the web, broker and gateway services; you create and manage the session hosts, image, network connectivity, backup and identities in your own Azure subscription. Learn's training unit labels it PaaS."
  - "Windows 365 is the most DaaS-like product in Microsoft's range: Learn calls it SaaS, hosts the Cloud PCs in a subscription owned by Microsoft and bills per user per month. Additional costs may apply based on network usage."
  - "Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026. Flex Dedicated mode provisions up to three Cloud PCs per license for non-concurrent use, so a DaaS label does not tell you whether a desktop is personal or shared."
  - "Nerdio Manager is a management platform for Azure Virtual Desktop and Windows 365. It runs in the customer's own Azure subscription and does not replace either service."
faq:
  - q: "Is Azure Virtual Desktop VDI or DaaS?"
    a: "Both labels are used for it. Learn says Microsoft provides the VDI components (web, broker and gateway services) as a service, while the customer creates and manages the session hosts, image, network connectivity, backup and identities. Learn's training unit calls Azure Virtual Desktop a PaaS. The practical answer is the split of responsibilities, not the label."
  - q: "Is Windows 365 a DaaS?"
    a: "It is the closest fit among Microsoft's products to what most people mean by DaaS. Learn describes Windows 365 as a cloud-based SaaS that creates Cloud PCs, which exist in a subscription owned by Microsoft and are billed per user per month. Learn's own wording is SaaS, so treat DaaS as shorthand rather than a Microsoft category."
  - q: "Does a Windows 365 Flex license mean one desktop per user?"
    a: "No. In Dedicated mode, one Flex license lets you provision up to three Cloud PCs for non-concurrent use, each assigned to one user. In Shared mode, one license provisions one Cloud PC shared by a group, one user at a time. Concurrency is capped by the number of licenses."
---

VDI (virtual desktop infrastructure) describes an architecture: user desktops run as virtual machines on central infrastructure, and users connect to them remotely. DaaS (desktop as a service) describes how that architecture is bought: a provider operates the infrastructure, and you pay for the desktops as a service. Neither is a Microsoft product name, and the two overlap, so the useful question is who runs which layer.

This article uses Microsoft Learn and Nerdio's own documentation. The two working definitions above are our reading of common usage, not quotations from Microsoft.

## What the two terms usually mean

**VDI** is the older and broader term. The [virtual desktop infrastructure](/entity/virtual-desktop-infrastructure/) is the set of components that host desktops on central servers or in the cloud and connect users to them: hosts, a connection broker, a gateway, storage for [profiles](/entity/fslogix/), identity and network. If you operate all of those layers yourself, on your own hardware or in your own cloud subscription, most people call it VDI.

**DaaS** shifts the operation of those layers to a provider and turns the cost into a subscription. In its strict form you receive desktops and never see the hosts.

In practice the line is blurred. Between "you run everything" and "the provider runs everything" there are many mixed models, and vendors place their products at different points. A label such as "VDI" or "DaaS" in a requirements document therefore tells you little until it is tied to a responsibility list.

## What Microsoft's own pages say

Learn describes its products by service model (SaaS, PaaS) rather than as VDI or DaaS, but its service architecture page for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) touches the VDI idea directly. That page says most components are Microsoft-managed, and that "Microsoft provides the virtual desktop infrastructure (VDI) components for core functionality as a service". It lists:

- a **web service** that returns connection information to the user's device,
- a **broker service** that orchestrates incoming connections,
- a **gateway service**, a websocket service that provides [Remote Desktop Protocol](/entity/remote-desktop-protocol/) connectivity from the user's device to the session hosts,
- a resource directory, a geographical database and a regional database.

The customer side is listed separately. You are responsible for creating and managing [session hosts](/entity/avd-session-host/), including image customizations and applications, virtual network connectivity, resiliency, and backup and recovery of those hosts. You also provide and manage user identities and control access. The Azure Virtual Desktop overview condenses this to: you manage "the image and virtual machines you use for the sessions in your Azure subscription, not the infrastructure", and you do not need to run a gateway or broker as you would with Remote Desktop Services.

[Windows 365](/entity/windows-365/) is described differently. Learn calls it "a cloud-based software-as-a-service (SaaS)" that automatically creates Cloud PCs. The architecture page says the Cloud PCs exist in a subscription owned by Microsoft, which carries the cost of running that infrastructure, and that Windows 365 sizes the VM from the license you assign. Cloud PC connectivity is provided by Azure Virtual Desktop, and Microsoft Intune manages the Cloud PCs.

## Mapping the products to the terms

Learn's training unit that compares the two services labels Windows 365 "SaaS: complete end-to-end Microsoft service" and Azure Virtual Desktop "PaaS: granular controls over configuration and management". The table combines that unit with the Windows 365 pages.

| Layer | Azure Virtual Desktop | Windows 365 Enterprise | Windows 365 Business |
|---|---|---|---|
| Service label (Learn) | PaaS | SaaS | SaaS |
| Where the VMs run | Customer's Azure subscription | Subscription owned by Microsoft | Subscription owned by Microsoft |
| Network | Customer-managed virtual network | Microsoft-hosted network, or a customer virtual network through an Azure network connection | Microsoft-managed |
| Provisioning and image | Manual provisioning, fully customizable | Fully customizable image | Automatic, no customization |
| Management tool | Azure portal, Microsoft Intune, PowerShell | Microsoft Intune | Web self-service |
| Users per VM | Single-session or multi-session | One user (1:1) | One user (1:1) |
| Pricing | Consumption-based | Per user per month; additional costs may apply for network usage | Per user per month |

Two details change how the table reads. First, Windows 11 and Windows 10 Enterprise multi-session is exclusive to Azure Virtual Desktop, which is the main reason to accept the extra operating work: fewer VMs for many users. Second, Windows 365 Business is made for smaller companies, up to 300 seats according to Learn, while Enterprise has no seat limit.

If you read "DaaS" as "the provider runs the hosts and I pay per user", Windows 365 matches. If you read "VDI" as "I build and run the hosts", Azure Virtual Desktop matches, with the difference that Microsoft runs the broker and gateway for you. Learn also describes hybrid options: Azure Virtual Desktop Hybrid and Azure Virtual Desktop for Azure Local host desktops and apps on-premises using the hypervisor of your choice. That is VDI on your own hardware with a Microsoft-run service in front of it.

## Windows 365 Flex: shared desktops under a DaaS label

Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026. Learn's what's new page says the product, licensing and capabilities are unchanged and only the name is different. Older articles and the [Windows 365 Frontline](/entity/windows-365-frontline/) entity page still use the former name.

Flex shows why "DaaS" does not describe a desktop model. It has two modes, and a license can be applied to either:

- **Dedicated mode**: one license lets you provision up to three Cloud PCs for non-concurrent use, each assigned to a single user, with one concurrent session.
- **Shared mode**: one license lets you provision one Cloud PC that a group of users share non-concurrently, with one concurrent session.

Learn's example: with 10 licenses in Dedicated mode you can provision up to 30 Cloud PCs, but only 10 of them can be active at a given time. So a provider-run desktop can be personal, shared or pooled by license, and the term DaaS says nothing about it. In [Azure Virtual Desktop](/entity/azure-virtual-desktop/) the same question is answered by the host pool type: [pooled](/entity/avd-pooled-host-pool/) lets sessions be load balanced to any session host with several users on one host, and [personal](/entity/avd-personal-host-pool/) assigns each session host to one user.

## Third-party DaaS and where Nerdio fits

The word DaaS also appears as a vendor product name. Learn's Azure architecture getting-started page lists "Citrix DaaS" as "a desktop and app virtualization service that you can use to provision Windows desktops and apps on Azure with Citrix and Azure Virtual Desktop". It is a different kind of offer: the vendor's service in front, Azure and Azure Virtual Desktop underneath. This article does not compare it feature by feature.

Nerdio Manager sits on another axis. Nerdio's documentation describes Nerdio Manager for Enterprise as "a deployment, management, and auto-scaling platform" for Azure Virtual Desktop and Windows 365 Cloud PCs, "deployed as an all-PaaS, secure Azure application inside the customer's own subscription". Nerdio's own blog says it provides a single console for both Windows 365 and Azure Virtual Desktop environments. Our reading: it is a management layer on top of those services. The desktops remain Azure Virtual Desktop session hosts or Windows 365 Cloud PCs, so the service-model question in this article is the same with or without it. See [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) and [Nerdio](/entity/nerdio/).

## Using the terms in a requirements conversation

Replace the labels with questions, and note the answers in a sheet before comparing vendors:

1. **Who creates and patches the image?** With Azure Virtual Desktop you own the image and the session hosts. With Windows 365 Business, provisioning is automatic and cannot be customized; Enterprise allows a custom image.
2. **Does the user need a private desktop or a shared host?** Multi-session is exclusive to Azure Virtual Desktop. Windows 365 Enterprise and Business give each user a 1:1 Cloud PC. Flex shares licenses non-concurrently.
3. **Whose subscription and network carry the VMs?** Azure Virtual Desktop VMs run in your subscription and virtual network. Windows 365 Enterprise can use a Microsoft-hosted network, and with Microsoft Entra join you do not need to bring an Azure subscription, or your own network.
4. **How is cost metered?** Consumption for Azure Virtual Desktop, per user per month for Windows 365. Neither is cheaper in general, so use your own user counts and current Microsoft price pages.
5. **Which licenses entitle users?** Learn's prerequisites list entitlements such as Microsoft 365 E3, E5, A3, A5, F3 and Business Premium for internal use of Windows client images on Azure Virtual Desktop. Windows 365 is licensed per user as its own subscription.
6. **Which identity and device management do you already run?** Microsoft Entra ID is always used to authenticate Azure Virtual Desktop users; Windows 365 Cloud PCs are managed by [Intune](/entity/intune/).

A short example: a company has 300 knowledge workers who each need a personal desktop and a team of 40 call-center agents on shifts. The first group maps to 1:1 desktops, where Windows 365 Enterprise and a personal [host pool](/entity/avd-host-pool/) are both candidates. The second group is a candidate for Flex or a pooled host pool. The answers to questions 1 to 4 decide, not the label. The article "AVD or Windows 365: how to choose between them" goes deeper into that decision.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: What is Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: What is Windows 365?](https://learn.microsoft.com/en-us/windows-365/overview)
- [Microsoft Learn: What is Windows 365 Enterprise?](https://learn.microsoft.com/en-us/windows-365/enterprise/overview)
- [Microsoft Learn: Windows 365 architecture](https://learn.microsoft.com/en-us/windows-365/enterprise/architecture)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-frontline)
- [Microsoft Learn: What's new in Windows 365 Enterprise and Windows 365 Flex](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Learn: Compare Windows 365 Cloud PCs to Azure Virtual Desktop (training unit)](https://learn.microsoft.com/en-us/training/modules/examine-windows-365/3-compare-windows-365-azure-virtual-desktop)
- [Microsoft Learn: Get started with virtual desktop architecture design](https://learn.microsoft.com/en-us/azure/architecture/virtual-desktop/virtual-desktop-get-started)
- [Nerdio: About Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124301747213-About-Nerdio-Manager)
- [Nerdio: Windows 365 vs. Azure Virtual Desktop: how to decide](https://getnerdio.com/blog/windows-365-vs-azure-virtual-desktop/)
