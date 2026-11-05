---
title: "Azure meets SAP: SAP on Azure Explained for Microsoft Teams"
summary: "What running SAP on Microsoft Azure really means: certified virtual machines and storage, the landing zone you build first, hybrid connectivity, the three deployment paths and the mistakes that turn a supported SAP system into an unsupported one."
status: approved
publish: true
author: mirko-p
date: 2026-11-05
topics: [sap, sap-s4hana, sap-hana, azure-virtual-machines, azure-landing-zone, azure-expressroute, entra-id, azure-netapp-files]
faq:
  - q: Can any Azure virtual machine run SAP HANA?
    a: "No. Only VM types and storage that SAP and Microsoft have certified for a specific SAP product and scenario are supported. For HANA the authoritative list is the SAP HANA Hardware Directory; for NetWeaver-based systems it is SAP Note 1928533. A large, fast VM that works well for other workloads can still be unsupported for HANA."
  - q: Does Microsoft Entra ID replace Active Directory for SAP on Azure?
    a: "Not for the SAP application on Windows. Entra ID works well for single sign-on to SAP, but SAP NetWeaver and S/4HANA systems on Windows still expect Active Directory Domain Services, either extended from on-premises or provided by Microsoft Entra Domain Services. Plan the directory before you deploy the first system, not during go-live."
  - q: What is Azure Center for SAP solutions?
    a: "It is an Azure service that treats SAP as a top-level workload. It can deploy the infrastructure and install SAP software for new systems or register existing SAP systems on Azure, and it represents each system as a Virtual Instance for SAP solutions, a single view for health, start and stop, quality checks and monitoring."
---

As a Microsoft MVP I spend most of my time with people who know Azure, Entra ID and Microsoft 365 inside out, and who suddenly get asked to "support the SAP move". For many of them SAP feels like a separate universe with its own vocabulary. The good news: SAP on Azure is far more ordinary than it sounds. It comes down to two rules. Stay inside certified configurations, and build the foundation before the first SAP system lands. This post walks through both, in the order you would actually work.

## What SAP on Azure actually means

SAP on Azure means your SAP systems run on Microsoft Azure. The SAP HANA database, the application servers and the central services sit on Azure virtual machines and use Azure storage and networking. The SAP software itself does not change: SAP S/4HANA is still S/4HANA, SAP NetWeaver is still NetWeaver. Only the ground underneath changes.

That split tells you who owns what. Microsoft provides the platform: virtual machines, disks, networks, identity and monitoring. SAP provides the application and the database, and you operate them the way SAP expects. Where the two meet is the certified infrastructure in the middle.

It helps to separate this from a second, related topic. Copying SAP data into Azure for reports in Power BI or Microsoft Fabric is data integration, a useful but different job. Running SAP on Azure means the production system itself lives there, processes its transactions there and serves its users from there.

If you want the bigger picture of the SAP product family first, the [SAP topic page on M365.FM](https://www.m365.fm/entity/sap/) collects our related content.

## Why "certified" decides everything

In the SAP world, "runs on Azure" really means "runs on certified Azure". SAP and Microsoft test specific virtual machine types and storage options against specific SAP products and scenarios, and only those combinations are supported. Microsoft documents the [SAP certifications and configurations for Azure](https://learn.microsoft.com/azure/sap/workloads/certifications) and the [SAP software supported on Azure](https://learn.microsoft.com/azure/sap/workloads/supported-product-on-azure). For [SAP HANA](https://www.m365.fm/entity/sap-hana/), SAP's own HANA Hardware Directory is the authoritative list; for NetWeaver-based systems, SAP Note 1928533 lists the supported Azure VM types.

Certification is not a property of Azure as a whole. It is a property of a specific VM, a specific storage option and a specific SAP scenario lined up together. A generous VM that is perfect for a web application may simply not be on the list for HANA. If you pick it anyway, you have not saved money; you have built a system that neither vendor has to stand behind.

Storage follows the same logic. Azure managed disks are the everyday building block, Azure NetApp Files provides NFS storage used in several SAP architectures, and Azure Files on premium (SSD) storage can host shared directories. The cheaper standard tier of Azure Files is not supported for the SAP central services high-availability shares, so the cheap option is the wrong option there. Microsoft lists these boundaries in its [supported scenarios for SAP workloads on Azure VMs](https://learn.microsoft.com/azure/sap/workloads/planning-supported-configurations).

The habit that prevents most trouble: before you size a single machine, open the certified list for your SAP product and scenario and design around it.

## The landing zone you build first

An [Azure landing zone](https://www.m365.fm/entity/azure-landing-zone/) is the foundation that gives every workload identity, network, security and governance before anything is deployed into it. Microsoft's Cloud Adoption Framework splits it into two parts:

- **Platform landing zone:** the shared base with management groups, central connectivity, identity, security and management services.
- **Application (workload) landing zones:** the individual environments, typically development, test and production, each made of subscriptions that inherit the platform guardrails.

For SAP this matters more than for most workloads, because SAP carries finance, supply chain and operations. Policies, network rules and identity should exist before the first SAP system lands. Bolting them on later means moving resources around a live business system.

Microsoft offers an [SAP on Azure landing zone accelerator](https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/sap/enterprise-scale-landing-zone) with reference designs based on a hub-and-spoke or Azure Virtual WAN network topology. Azure Policy and the management group hierarchy set the guardrails, and every SAP system then lands inside them. That is what lets the second and third SAP system arrive without a fresh debate about naming, access and network rules.

## Keeping SAP connected to your data center

Moving SAP to Azure rarely means leaving everything behind. Most landscapes stay hybrid for a long time, so connectivity is the bridge that holds them together.

The main private option is [Azure ExpressRoute](https://www.m365.fm/entity/azure-expressroute/), a dedicated private connection between your data center and Azure instead of traffic over the public internet. Where ExpressRoute is not available, a site-to-site VPN is the alternative. Either way, the connection usually terminates in the central hub or Virtual WAN, and the SAP virtual network reaches it from there. Inside Azure, a typical SAP design separates application and database tiers into their own subnets, protected by network security groups, route tables and a firewall.

Identity deserves a careful look, because this is where Microsoft teams make assumptions. Microsoft Entra ID is excellent for single sign-on to SAP applications. But SAP NetWeaver and S/4HANA systems running on Windows do not use Entra ID accounts for the SAP application itself. They still expect Active Directory Domain Services, either extended from on-premises or provided by Microsoft Entra Domain Services. Sign-on and the operating-system directory are two different stories.

## Your three deployment options

There is no single right way to deploy SAP on Azure. Pick the path that matches how your team operates.

1. **Plain Azure virtual machines.** You manage the operating system, SAP installation, patching and monitoring yourself. Maximum control, maximum work. A good fit when deep SAP and Azure skills are in house.
2. **Azure Center for SAP solutions.** An Azure service that makes SAP a top-level workload. It can create the infrastructure and install SAP software for single-server, distributed and distributed high-availability systems, or register SAP systems that already run on Azure. Each system becomes a *Virtual Instance for SAP solutions*, a logical view of the SID, central services, database and application servers. From there you see health and status, start and stop the system, run quality checks against best practices and watch monitoring data. Details are in the [Azure Center for SAP solutions overview](https://learn.microsoft.com/azure/sap/center-sap-solutions/overview).
3. **SAP on Azure deployment automation framework.** An open-source, infrastructure-as-code approach for teams that want repeatable, version-controlled deployments and a DevOps workflow.

A simple decision rule: full control and strong skills point to plain VMs; a guided setup with one place to manage the system points to Azure Center for SAP solutions; many systems deployed the same way point to the automation framework.

## Common mistakes

Most painful first migrations share a pattern: a step that felt optional.

- **Treating certification as paperwork.** An uncertified VM or storage type turns a supported system into an unsupported one, and you usually find out at the worst moment.
- **Skipping the landing zone.** "We add governance later" rarely happens, and retrofitting identity and network rules around a live SAP system is slow and risky.
- **Assuming Entra ID replaces Active Directory** for Windows-based SAP systems. It does not.
- **Designing connectivity last.** Splitting the SAP application tier and the database tier between on-premises and Azure, or across Azure regions, is not supported.
- **Assuming everything runs on Azure.** Azure VMware Solution is generally not a supported platform for hosting SAP workloads, and SAP HANA Large Instances are no longer offered to new customers.
- **Using Azure Site Recovery for the database.** Azure Site Recovery is not supported for the SAP database layer; use the database's native replication, such as SAP HANA System Replication, for disaster recovery.

Each of these is a point where the Microsoft and SAP support boundaries stop agreeing. The limits are not there to slow you down; they mark the area where both vendors will stand behind your system.

## Conclusion: the order of operations

If you remember one thing, remember the sequence. Define what the SAP system needs in performance, availability and recovery. Build the landing zone. Connect network and directory back to your data center. Choose how much you want managed: plain VMs, Azure Center for SAP solutions or the automation framework. Pick certified compute and storage. Then design high availability and disaster recovery around the database's own capabilities.

You do not have to move everything at once. Starting with one system shows you where your landing zone is thin and where your team needs support, while the stakes are still small. For Microsoft professionals, SAP on Azure is not a foreign world. It is a set of normal engineering decisions, with certification as the one rule you never bend.
