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
    a: "No. Microsoft says SAP sets stronger infrastructure conditions for HANA than for NetWeaver, so only a smaller number of Azure VM types qualify. For HANA, Microsoft points to SAP's HANA hardware directory of certified IaaS platforms; for NetWeaver-based systems, it points to SAP Note 1928533. A large, fast VM that works well for other workloads can still be missing from those lists."
  - q: Does Microsoft Entra ID replace Active Directory for SAP on Azure?
    a: "Not as a general rule. Microsoft recommends single sign-on and/or MFA for all SAP applications, and shows SSO with Entra ID. That is a separate question from the directory your SAP servers rely on: Microsoft's planning guide says Windows Server Active Directory may need to be accessible to SAP VMs or services. Whether your system needs a domain depends on the SAP product and OS, so check with your SAP team and plan it before the first system."
  - q: What is Azure Center for SAP solutions?
    a: "It is an Azure service that treats SAP as a top-level workload. It can deploy the infrastructure and install SAP software for new systems or register existing SAP systems on Azure, and it represents each system as a Virtual Instance for SAP solutions, a single view for health, start and stop of the application tier, quality checks and monitoring."
---

As a Microsoft MVP I spend most of my time with people who know Azure, Entra ID and Microsoft 365 inside out, and who suddenly get asked to "support the SAP move". For many of them SAP feels like a separate universe with its own vocabulary. The good news: SAP on Azure is far more ordinary than it sounds. It comes down to two rules. Stay inside certified configurations, and build the foundation before the first SAP system lands. This post walks through both, in the order you would actually work.

## What SAP on Azure actually means

SAP on Azure means your SAP systems run on Microsoft Azure. The SAP HANA database, the application servers and the central services sit on Azure virtual machines and use Azure storage and networking. The SAP software itself does not change: SAP S/4HANA is still S/4HANA, SAP NetWeaver is still NetWeaver. Only the ground underneath changes.

That split tells you who owns what. Microsoft provides the platform: virtual machines, disks, networks, identity and monitoring. SAP provides the application and the database, and you operate them the way SAP expects. Where the two meet is the certified infrastructure in the middle.

It helps to separate this from a second, related topic. Copying SAP data into Azure for reports in Power BI or Microsoft Fabric is data integration, a useful but different job. Running SAP on Azure means the production system itself lives there, processes its transactions there and serves its users from there.

If you want the bigger picture of the SAP product family first, the [SAP topic page on M365.FM](https://www.m365.fm/entity/sap/) collects our related content.

## Why "certified" decides everything

In the SAP world, "runs on Azure" really means "runs on a configuration SAP supports on Azure". Microsoft's pages list the supported SAP software and Azure VM types, and say that the VM types certified for an SAP workload don't use over-provisioning of CPU and memory. The pages cited here don't put it as one blanket rule, but SAP support depends on those lists in practice. Microsoft documents the [SAP certifications and configurations for Azure](https://learn.microsoft.com/azure/sap/workloads/certifications) and the [SAP software supported on Azure](https://learn.microsoft.com/azure/sap/workloads/supported-product-on-azure). For [SAP HANA](https://www.m365.fm/entity/sap-hana/), Microsoft links to SAP's HANA hardware directory of certified IaaS platforms and says its own tables might deviate here and there from the official SAP lists; for NetWeaver-based systems, SAP Note 1928533 lists the supported Azure VM types.

In our reading, certification is not a property of Azure as a whole. It applies to a specific VM type for a specific SAP product. Microsoft notes that fewer Azure VM types qualify for HANA than for NetWeaver, so a generous VM that is perfect for a web application may simply not be on the list. If you pick it anyway, you have not saved money; you have built a system that SAP may not support.

Storage follows the same logic. Azure managed disks are the everyday building block, Azure NetApp Files provides NFS storage used in several SAP architectures, and Azure Files SSD can host the shares for SAP central services. Microsoft says Azure Files HDD isn't supported for those high-availability shares, so the cheap option is the wrong option there. Microsoft lists these boundaries in its [supported scenarios for SAP workloads on Azure VMs](https://learn.microsoft.com/azure/sap/workloads/planning-supported-configurations).

The habit that prevents most trouble: before you size a single machine, open the certified list for your SAP product and scenario and design around it.

## The landing zone you build first

An [Azure landing zone](https://www.m365.fm/entity/azure-landing-zone/) is the foundation that gives every workload identity, network, security and governance before anything is deployed into it. Microsoft's Cloud Adoption Framework splits it into two parts:

- **Platform landing zone:** the shared base with management groups, central connectivity, identity, security and management services.
- **Application (workload) landing zones:** the individual environments, for SAP typically a production subscription and a non-production one for sandbox, development, quality assurance or pre-production systems, each inheriting the platform guardrails.

For SAP this matters more than for most workloads, because SAP carries finance, supply chain and operations. Policies, network rules and identity should exist before the first SAP system lands. Bolting them on later means moving resources around a live business system.

Microsoft's [SAP on Azure landing zone accelerator](https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/sap/enterprise-scale-landing-zone) describes workload landing zones inside an enterprise-scale landing zone, with a hub-spoke topology in its example. That page is marked deprecated and scheduled for removal on October 30, 2026, and points to the SAP on Azure architectures and product documentation instead. Microsoft's SAP planning guide says the network most often is a hub-spoke topology or a global virtual WAN. Azure Policy and the management group hierarchy set the guardrails, and every SAP system then lands inside them. That is what lets the second and third SAP system arrive without a fresh debate about naming, access and network rules.

## Keeping SAP connected to your data center

Moving SAP to Azure rarely means leaving everything behind. Most landscapes stay hybrid for a long time, so connectivity is the bridge that holds them together.

The main private option is [Azure ExpressRoute](https://www.m365.fm/entity/azure-expressroute/), a dedicated private connection between your data center and Azure instead of traffic over the public internet. Microsoft recommends a private connection over ExpressRoute for on-premises SAP deployments. For smaller SAP workloads, remote regions or smaller offices, Microsoft says VPN connectivity is available, and ExpressRoute with a site-to-site VPN as a failover path is a possible combination. Either way, the connection usually terminates in the central hub or Virtual WAN, and the SAP virtual network reaches it from there. Inside Azure, a typical SAP design separates application and database tiers into their own subnets, protected by network security groups, route tables and a firewall.

Identity deserves a careful look, because this is where Microsoft teams make assumptions. Microsoft recommends single sign-on and/or MFA for all SAP applications and documents SSO to SAP NetWeaver with Microsoft Entra ID. Sign-on is only one part, though. Microsoft's planning guide says that identity management, meaning Windows Server Active Directory domains or Microsoft Entra ID, is a central service the SAP VMs depend on, and that Windows Server Active Directory may need to be accessible to SAP VMs or services. Which directory your Windows-based SAP systems need depends on the SAP product and your design, and the Microsoft pages cited here don't settle it, so clarify it with your SAP team early.

## Your three deployment options

There is no single right way to deploy SAP on Azure. Pick the path that matches how your team operates.

1. **Plain Azure virtual machines.** You manage the operating system, SAP installation, patching and monitoring yourself. Maximum control, maximum work. A good fit when deep SAP and Azure skills are in house.
2. **Azure Center for SAP solutions.** An Azure service that makes SAP a top-level workload. It can create the infrastructure and install SAP software for single-server, distributed and distributed high-availability systems, or register SAP systems that already run on Azure. Each system becomes a *Virtual Instance for SAP solutions*, a logical view of the SID, the ABAP central services instance, the database and the application servers. From there you see health and status, start and stop the SAP application tier, run quality checks against best practices and watch monitoring data. Details are in the [Azure Center for SAP solutions overview](https://learn.microsoft.com/azure/sap/center-sap-solutions/overview).
3. **SAP Deployment Automation Framework.** Microsoft describes it as an open-source orchestration tool that can deploy, install and maintain SAP environments, using Terraform to create the infrastructure. It suits teams that want scripted, repeatable deployments.

A simple decision rule: full control and strong skills point to plain VMs; a guided setup with one place to manage the system points to Azure Center for SAP solutions; many systems deployed the same way point to the automation framework.

## Common mistakes

Most painful first migrations share a pattern: a step that felt optional.

- **Treating certification as paperwork.** An uncertified VM or storage type turns a supported system into an unsupported one, and you usually find out at the worst moment.
- **Skipping the landing zone.** "We add governance later" rarely happens, and retrofitting identity and network rules around a live SAP system is slow and risky.
- **Assuming Entra ID settles identity for the whole SAP landscape.** Single sign-on and the directory your SAP servers rely on are separate questions.
- **Designing connectivity last.** Splitting the SAP application tier and the database tier between on-premises and Azure, or across Azure regions, is not supported.
- **Assuming everything runs on Azure.** Microsoft's page says Azure VMware services are in general not supported by SAP for hosting SAP workloads, and defers to SAP Note 2138865. The HANA Large Instance service is in sunset mode and no longer accepts new customers.
- **Using Azure Site Recovery for the database.** Microsoft says Azure Site Recovery isn't supported for the DBMS layer of SAP systems. Use the database's native asynchronous replication for disaster recovery, such as SAP HANA System Replication, one of the options Microsoft lists.

Each of these is a point where the Microsoft and SAP support boundaries stop agreeing. The limits are not there to slow you down; they mark the area where both vendors will stand behind your system.

## Conclusion: the order of operations

If you remember one thing, remember the sequence. Define what the SAP system needs in performance, availability and recovery. Build the landing zone. Connect network and directory back to your data center. Choose how much you want managed: plain VMs, Azure Center for SAP solutions or the SAP Deployment Automation Framework. Pick certified compute and storage. Then design high availability and disaster recovery around the database's own capabilities.

You do not have to move everything at once. Starting with one system shows you where your landing zone is thin and where your team needs support, while the stakes are still small. For Microsoft professionals, SAP on Azure is not a foreign world. It is a set of normal engineering decisions, with certification as the one rule you never bend.

## Sources

- [SAP on Azure: Supported Scenarios with Azure VMs (Microsoft Learn)](https://learn.microsoft.com/azure/sap/workloads/planning-supported-configurations)
- [SAP certifications and configurations running on Microsoft Azure (Microsoft Learn)](https://learn.microsoft.com/azure/sap/workloads/certifications)
- [SAP software supported on Azure (Microsoft Learn)](https://learn.microsoft.com/azure/sap/workloads/supported-product-on-azure)
- [Plan and implement an SAP deployment on Azure (Microsoft Learn)](https://learn.microsoft.com/azure/sap/workloads/planning-guide)
- [SAP on Azure landing zone accelerator (Microsoft Learn)](https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/sap/enterprise-scale-landing-zone)
- [Network topology and connectivity for an SAP migration (Microsoft Learn)](https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/sap/eslz-network-topology-and-connectivity)
- [Identity and access management for SAP on Azure (Microsoft Learn)](https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/sap/eslz-identity-and-access-management)
- [Azure Center for SAP solutions overview (Microsoft Learn)](https://learn.microsoft.com/azure/sap/center-sap-solutions/overview)
- [About SAP Deployment Automation Framework (Microsoft Learn)](https://learn.microsoft.com/azure/sap/automation/deployment-framework)
