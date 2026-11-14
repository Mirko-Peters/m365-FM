---
title: "Create a Virtual Network Data Gateway for Power BI and Fabric: Subnet, Delegation and Setup"
summary: "Create a virtual network (VNet) data gateway for Power BI and Microsoft Fabric using Microsoft Learn: licensing prerequisites, resource provider registration, subnet delegation and sizing, the creation form in Manage connections and gateways, supported regions and documented gaps."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [virtual-network-data-gateway, power-bi, fabric]
keypoints:
  - "A VNet data gateway needs Power BI Premium A4 or higher, any P SKU or any Fabric SKU, and an Azure VNet in a supported region. Cross-tenant creation is not supported."
  - "Register Microsoft.PowerPlatform as a resource provider, then delegate a dedicated subnet to Microsoft.PowerPlatform/vnetaccesslinks."
  - "The subnet is not shared, has no IPv6 address space and is not named gatewaysubnet or AzureBastionSubnet. Reserve 5 IPs plus 1 per gateway member."
  - "Create the gateway under the settings gear, Manage connections and gateways, Virtual network (VNet) data gateway, New."
  - "Gateway metadata is stored in the Power BI home region, while the gateway runs in the region of your Azure VNet."
faq:
  - q: "What licensing do I need?"
    a: "According to Microsoft Learn, a Power BI Premium capacity of SKU A4 or higher, any P SKU, or a Fabric license of any SKU."
  - q: "Who registers the resource provider?"
    a: "A subscription owner registers Microsoft.PowerPlatform in the Azure portal under Resource providers for the subscription that contains the virtual network."
  - q: "How many IP addresses must the subnet have?"
    a: "Five are reserved for basic functionality, plus one for each gateway member. Learn's example is two clusters of three members, which needs 2 x 3 + 5 = 11 addresses, and it advises adding extra for future gateways."
  - q: "Which permission is needed to delegate and create?"
    a: "The Microsoft.Network/virtualNetworks/subnets/join/action permission on the VNet, for example through the Network Contributor role."
  - q: "When might the Microsoft.Storage service endpoint matter?"
    a: "Learn says workloads that depend on Azure Storage, such as Azure Databricks queries with Cloud Fetch, may fail without it. It also helps when an Azure Virtual Hub with Propagate Default Route blocks access to a storage account in the same region."
---

A virtual network (VNet) data gateway lets Power BI and Fabric reach data sources inside an Azure virtual network without a gateway server of your own. This guide follows the Microsoft Learn article on creating VNet data gateways.

## Prerequisites and considerations

- A Power BI Premium capacity of SKU A4 or higher, any P SKU, or any Fabric SKU.
- An Azure VNet in a supported region. Learn lists regions including West Europe, North Europe, East US, East US 2, UK South, Germany West Central, Australia East and Japan East, among others. Check the article for the full current list.
- No creation across tenant boundaries.
- The gateway runs in the region of your Azure VNet. Its metadata, meaning name, details, data sources and encrypted credentials, is stored in the default region of your Power BI home. Learn notes that the default region of Power Platform can differ from that of Power BI, which may affect your region choice.

## Step 1: register the resource provider

As a subscription owner, open the Azure portal, go to the subscription that contains the virtual network, select **Resource providers**, search for **Microsoft.PowerPlatform** and select **Register**.

## Step 2: delegate a subnet

A user with the `Microsoft.Network/virtualNetworks/subnets/join/action` permission, for example Network Contributor, adds a subnet to the VNet and selects **Microsoft.PowerPlatform/vnetaccesslinks** as the subnet delegation, then saves. The subnet should have connectivity to the data service. Rules from the page:

- The subnet is used entirely by the Power Platform VNet service and cannot be shared.
- Five IP addresses are reserved, plus one per gateway member. Two clusters of three need 11.
- Gateways within a cluster must communicate, so do not block the subnet's own IP range if you restrict reachable IPs.
- Do not name it gatewaysubnet or AzureBastionSubnet, which cannot be used to create a gateway.
- The subnet must not have an IPv6 address space.
- Depending on workload you may need the Microsoft.Storage service endpoint on the subnet.

## Step 3: create the gateway

1. Sign in to Power BI and select the settings gear.
2. Select **Manage connections and gateways**.
3. Select **Virtual network (VNet) data gateway**, then **New**.
4. Choose the license capacity, subscription, resource group, VNet and subnet. Only subnets delegated to Power Platform appear. Depending on permissions you may be asked for the capacity before the subscription.
5. Keep or change the default unique name, then select **Save**.

The gateway then appears on the Virtual network data gateways tab. The user creating it needs the same subnets/join/action permission.

## Workloads and limits

Learn's overview page lists the supported workloads: Fabric Dataflow Gen2, Fabric data pipelines, Fabric Copy Job, Fabric Mirroring, Power BI semantic models and Power BI paginated reports. Power BI dataflows and datamarts are not supported. It lists these considerations:

- SKUs are P, F and A4 or higher. For F SKUs Learn recommends F8 and above, although all F SKUs work.
- The feature is not supported in GCC L2, while GCC L4, L5 and some air-gapped clouds are listed as supported.
- You cannot change the region, subscription or resource group of the VNet the gateway was created on.
- With OAuth2 credentials the gateway does not refresh tokens automatically. Tokens typically expire one hour after the refresh starts, and you may see InvalidConnectionCredentials or AccessUnauthorized errors.
- Users are limited to 1,000 data sources on each gateway.
- For Power Platform dataflows, only admin roles are supported, and writing to a privatized data lake or Dataverse is not supported.

## Why use it

Learn describes it as a network security option that works with private endpoints and Private Link, with fully managed hardware that can be more cost effective than an on-premises data gateway, and with compute isolation against cross-tenant attacks.

## Check after creation

This section is a suggestion. Add a test data source, assign a pilot user, and run one manual refresh before moving production models.

## Not covered

The page does not say where to set the number of members or clusters in the form, how to add users or data sources, network security group or firewall requirements, how to change or delete the gateway, or troubleshooting beyond the Storage and virtual hub notes. For management it links to the article on managing VNet data gateways.

## Related

- [Virtual network data gateway](https://www.m365.fm/entity/virtual-network-data-gateway/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [Create virtual network (VNet) data gateways (Microsoft Learn)](https://learn.microsoft.com/data-integration/vnet/create-data-gateways)
- [What is a virtual network (VNet) data gateway (Microsoft Learn)](https://learn.microsoft.com/data-integration/vnet/overview)
