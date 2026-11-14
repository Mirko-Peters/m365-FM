---
title: "How to Set Up Virtual Network Support for Power Platform Environments"
summary: "Plan virtual network support for Power Platform: subnet delegation, paired regions, supported environment types and services, subnet sizing examples, limitations and the setup steps that the Learn overview page leaves to a separate article."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [power-platform-admin-center, dataverse]
keypoints:
  - "VNet support lets Power Platform make outbound calls to private resources in Azure or on-premises through Azure subnet delegation. It needs an Azure subscription associated with the tenant."
  - "Virtual networks and subnets must be in the paired Azure regions of the environment region. A dedicated, new subnet must be delegated to Power Platform."
  - "Production, Default, Sandbox and Developer environments are supported. Trial and Dataverse for Teams environments are not."
  - "Size subnets with 25 to 30 IPs per production environment and 6 to 10 per nonproduction environment, plus five reserved addresses per subnet."
  - "The page is an overview. It names no license or Managed Environments requirement and gives no policy creation or linking steps."
faq:
  - q: "What does VNet support do?"
    a: "It lets Power Platform make outbound calls to resources in your private network, in Azure or on-premises, without exposing them to the internet. It uses Azure subnet delegation."
  - q: "Which environments are supported?"
    a: "Production, Default, Sandbox and Developer. Trial and Microsoft Dataverse for Teams environments are not supported."
  - q: "Which regions do I use?"
    a: "The virtual network and subnets must be in the paired Azure regions for the environment region. For example, an environment in the United Kingdom needs uksouth and ukwest. Failover needs delegated networks in both regions."
  - q: "How big must the subnet be?"
    a: "Learn says to allocate 25 to 30 IPs for production and 6 to 10 for nonproduction, plus five reserved addresses per subnet. Its examples give a /25 for four production environments and a /24 for twenty nonproduction environments."
  - q: "Where are the setup steps?"
    a: "The overview points to a separate Set up VNet support article. The overview names only Get-EnvironmentRegion, Disable-SubnetInjection and Enable-SubnetInjection."
---

Virtual network support lets Power Platform reach private resources. It matters for admins who must keep SQL servers, key vaults or storage accounts off the public internet while still using them from plug-ins and connectors. This guide follows the Microsoft Learn overview page. The page is an overview. The setup itself is described on a separate page that was not read.

## What it does

VNet support lets Power Platform make outbound calls to resources in your private network, whether hosted in Azure or on-premises. Protected resources do not need to be available over the internet. It uses Azure subnet delegation.

## Prerequisites on the page

- An Azure subscription associated with the Power Platform tenant.
- An environment in a supported region. Use `Get-EnvironmentRegion` from the subnet diagnostics PowerShell module to find the region.
- Virtual networks and subnets in the paired Azure regions of the environment region. An environment in the United Kingdom needs uksouth and ukwest. An environment in Canada needs CanadaCentral and CanadaEast. Failover requires delegated networks in both regions.
- A single new subnet delegated to Power Platform only. It cannot be used for other purposes.
- Production, Default, Sandbox or Developer environment types. Trial and Microsoft Dataverse for Teams are not supported.
- Endpoints that present a full TLS certificate chain from a well-known root CA.

## Supported services

- **Dataverse:** plug-ins (generally available).
- **Connectors (generally available):** SQL Server, Azure SQL Data Warehouse, Azure Queues, custom connectors, Azure Key Vault, Azure File Storage, Azure Blob Storage, HTTP with Microsoft Entra ID (preauthorized), Snowflake, Databricks and AI Search.

Power Automate is not listed by name. The page mentions Power Apps, Power Automate and Dynamics 365 apps as consumers of the connectors. It does not state that flows get VNet support in their own right.

## Subnet sizing

- Production: allocate 25 to 30 IPs.
- Nonproduction: 6 to 10 IPs.
- Each subnet reserves five IP addresses.
- Environments start with at least four containers, typically within 10 to 30.

The page's examples: four production environments at 30 IPs plus 5 reserved gives 125, so a /25 with 128 addresses. Twenty nonproduction environments at 10 IPs plus 5 reserved gives 205, so a /24 with 256 addresses.

## Limitations

- Dataverse low-code plug-ins that use connectors are not supported until those connectors use subnet delegation.
- Copy, backup and restore have constraints. Restores work within the same virtual network, across environments on the same network and from non-VNet environments into VNet environments.
- SQL Server connections through an on-premises data gateway are not supported in VNet-linked environments.
- For US Government only GCC High and DoD are supported. GCC is not.
- Azure-aware plug-ins do not support VNet.
- Early release cycle environments cannot share an enterprise policy with other environments.
- You cannot change a delegated subnet's IP range or the DNS settings of the network while the feature is in use. Run Disable-SubnetInjection first. After a DNS change wait 30 minutes before you re-enable.
- A subnet cannot be reused across several enterprise policies.
- Public calls from plug-ins and connectors can break unless you update URLs or add private endpoints before enabling VNet support.

## What the page does not say

- Licensing requirements.
- Whether Managed Environments are required.
- How to create the enterprise policy and link an environment, or any portal steps.
- A way to monitor subnet IP consumption. The team is working on it.
- The DoD region row looks like a typo, so verify it before use.

## A planning outline

This outline is practical advice built on the page.

1. Look up the environment region and the paired Azure regions.
2. Size the delegated subnets with the page's IP guidance.
3. Check every connector and plug-in against the supported list and the limitations.
4. Add private endpoints or update URLs before you enable the feature.
5. Read the separate setup article for the creation and linking steps.

## Typical mistakes

- Creating the network in the wrong region.
- Reusing a subnet for another purpose or policy.
- Changing DNS settings without disabling subnet injection first.
- Assuming Trial or Dataverse for Teams environments qualify.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)

## Sources

- [Virtual Network support overview for Power Platform (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/vnet-support-overview)
