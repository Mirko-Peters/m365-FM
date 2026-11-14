---
title: "Azure Bastion SKUs Compared: Developer, Basic, Standard and Premium"
summary: "Azure Bastion has four SKUs. Developer is free and shared, Basic is dedicated with two fixed instances, Standard adds host scaling, native client, shareable links and custom ports, and Premium adds session recording and private-only deployment. A comparison based on Microsoft's SKU page."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [azure-bastion, azure-virtual-network, virtual-network-peering]
keypoints:
  - "Developer is free, uses shared infrastructure, supports one VM connection at a time and is not suitable for production according to Learn."
  - "Basic is a dedicated host with a fixed two instances, which Learn gives as 40 RDP and 80 SSH sessions."
  - "Standard adds host scaling from 2 to 50 instances, native client, IP-based connections, shareable links, custom ports and file transfer."
  - "Premium adds session recording and private-only deployment without a public IP address."
  - "Upgrades from lower to higher SKUs are supported and take about 10 minutes; downgrading is not supported and needs delete and recreate."
faq:
  - q: "How many SKUs does Azure Bastion have?"
    a: "Four: Developer, Basic, Standard and Premium. Developer uses shared infrastructure and is free. Basic, Standard and Premium are dedicated deployments that need an AzureBastionSubnet, and Premium can also be deployed private-only without a public IP address."
  - q: "What does Standard add over Basic?"
    a: "Per Learn, native client connections, IP-based connections, shareable links, custom inbound ports, file upload and download with the native client, RDP to Linux and SSH to Windows, disabling copy and paste in web clients, and host scaling with 2 to 50 instances."
  - q: "What does Premium add over Standard?"
    a: "Session recording and private-only deployment, which needs no public IP address. Learn says the cost difference between Standard and Premium is marginal and calls Premium the recommended choice for production deployments."
  - q: "Can I downgrade a SKU?"
    a: "No. Learn says upgrading from lower to higher SKUs is supported, upgrades take approximately 10 minutes, and downgrading is not supported, so you must delete and recreate Azure Bastion."
  - q: "What subnet and public IP do I need?"
    a: "For Basic, Standard and Premium, a subnet named AzureBastionSubnet of /26 or larger, plus a Standard SKU public IP with static allocation, except private-only Premium, which needs no public IP. Developer needs neither."
---

Azure Bastion comes in four SKUs: Developer, Basic, Standard and Premium. Developer is a free, shared option for development and test, Basic is a dedicated host with two fixed instances, Standard adds scaling and advanced connection features, and Premium adds session recording and private-only deployment. Microsoft Learn says you can upgrade to a higher SKU but cannot downgrade. This article compares the SKUs using Learn's SKU comparison page, with the configuration settings and overview pages for context.

## The four SKUs in short

Learn's overview describes them like this:

- **Developer:** a free SKU on shared infrastructure, recommended for development and testing, supporting one VM at a time and available in select regions.
- **Basic:** dedicated deployment with fixed capacity for production environments with moderate connection requirements.
- **Standard:** all Basic features plus scalability and advanced features: native client, shareable links, IP-based connections, custom ports and file transfer.
- **Premium:** all Standard features plus session recording and private-only deployment.

## Feature comparison

The table below condenses Learn's comparison. Values are as the page gives them.

| Feature | Developer | Basic | Standard | Premium |
| --- | --- | --- | --- | --- |
| AzureBastionSubnet required | No | Yes | Yes | Yes |
| Public IP required | No | Yes | Yes | No, with private-only |
| Dedicated host | No | Yes | Yes | Yes |
| VNet peering support | No | Yes | Yes | Yes |
| Concurrent connections | No | Yes | Yes | Yes |
| RDP to Linux, SSH to Windows | No | No | Yes | Yes |
| Native client (Azure CLI) | No | No | Yes | Yes |
| Custom inbound port | No | No | Yes | Yes |
| IP-Connect | No | No | Yes | Yes |
| Shareable link | No | No | Yes | Yes |
| File transfer, native client | No | No | Yes | Yes |
| Disable copy and paste, web clients | No | No | Yes | Yes |
| Session recording | No | No | No | Yes |
| Private-only deployment | No | No | No | Yes |
| Hourly charge | Free | Paid | Paid | Paid |

Features that all four share include portal-based connections, Kerberos authentication, access to Linux VM private keys in Azure Key Vault, VM audio output and copy and paste in web clients.

## Capacity

Learn gives these capacity figures:

| Metric | Developer | Basic | Standard and Premium |
| --- | --- | --- | --- |
| Instances | Shared | 2, fixed | 2 to 50, configurable |
| Concurrent RDP sessions | 1 | 40 | 1,000 at 50 instances |
| Concurrent SSH sessions | 1 | 80 | 2,000 at 50 instances |

Each instance handles 20 RDP and 40 SSH sessions, which is how the page arrives at these totals. The configuration settings page says Basic creates two instances, while Standard or higher can set the instance count through host scaling.

## Network requirements

For the dedicated SKUs, the subnet must be named AzureBastionSubnet and be /26 or larger, in the same virtual network and resource group as the Bastion resource, with no other resources in it. The public IP must be Standard SKU with static allocation. Developer needs neither, and private-only Premium needs no public IP. Learn's configuration page says the /26 requirement applies to deployments on or after November 2, 2021.

## Developer: where it fits

Learn's decision framework says to choose Developer for dev and test, when you do not need virtual network peering or concurrent connections, and when you are in a supported region. It warns that Developer is not suitable for production workloads because it gives access to only one VM at a time and does not support virtual network peering. The page lists the regions where it is available.

## Upgrades and downgrades

Learn says upgrades from Developer to Basic, Standard or Premium need a new AzureBastionSubnet and a public IP. Upgrades from Basic or higher are done in the Azure portal, and you can add features at the same time. Upgrades take approximately 10 minutes. Downgrading is not supported: you must delete and recreate Azure Bastion.

This matters for planning. If you start on Basic and later need shareable links or custom ports, you can upgrade. If you start on Premium and want to save money, you must rebuild.

## Choosing a SKU

This section is my advice, not a Microsoft statement, except where I quote Learn.

1. **Start from required features.** If you need session recording or no public IP, only Premium works. If you need the native client, shareable links, custom ports or file transfer, Standard is the minimum.
2. **Check capacity against your admin team.** Basic's 40 RDP and 80 SSH sessions is Learn's figure for two instances. Count how many people connect at the same time.
3. **Treat Developer as a lab tool.** It is free, but Learn calls it unsuitable for production.
4. **Weigh Learn's recommendation.** The page says the cost difference between Standard and Premium is marginal and that Premium is the recommended choice for production. Check Microsoft's Azure Bastion pricing page for your region before you decide, since the SKU pages give no prices.
5. **Plan the downgrade you cannot do.** Because downgrades are not supported, choose the SKU you can live with for a while.
6. **Note regional limits.** Learn lists regions for Developer, and says the other SKUs are available in all regions where Azure Bastion is supported.

## What the pages do not say

The SKU comparison page, the overview and the configuration settings page give no prices, so this article gives none. The comparison page only states that Developer is free, the other SKUs have an hourly charge, and outbound data transfer is charged for them, with the first 5 GB per month free. The configuration page also marks some features, such as availability zones and IPv6 dual stack, as preview with conditions, which this article does not cover in depth. For networking rules such as NSG entries, use the configuration settings page directly.

## Related

- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Virtual network peering](https://www.m365.fm/entity/virtual-network-peering/)

## Sources

- [Choose the right Azure Bastion SKU to meet your needs (Microsoft Learn)](https://learn.microsoft.com/azure/bastion/bastion-sku-comparison)
- [What is Azure Bastion? (Microsoft Learn)](https://learn.microsoft.com/azure/bastion/bastion-overview)
- [About Azure Bastion configuration settings (Microsoft Learn)](https://learn.microsoft.com/azure/bastion/configuration-settings)
