---
title: "How to Create a Site-to-Site VPN Connection to Azure in the Portal"
summary: "Create a site-to-site VPN to Azure in the portal: virtual network, GatewaySubnet, VPN gateway, local network gateway, VPN device settings, connection, verification and cleanup."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [azure-virtual-network]
keypoints:
  - "You need a compatible VPN device with a public IPv4 address, plus on-premises address ranges that do not overlap with the virtual network."
  - "The gateway subnet must be named GatewaySubnet and be /27 or larger. NSGs on the gateway subnet are not supported."
  - "Gateway creation takes 45 minutes or more. The Basic SKU is not available in the portal."
  - "In active-active mode, create tunnels to each gateway instance. A tunnel to only one drops the connection during maintenance."
  - "Use a complex shared key of at least 32 characters, identical on the connection and the VPN device."
faq:
  - q: "How long does it take to create a VPN gateway?"
    a: "According to Microsoft Learn, deployment takes 45 minutes or more. You can track the status on the gateway's Overview page."
  - q: "What size must the gateway subnet be?"
    a: "Learn says to use a /27 or larger range, with the subnet named GatewaySubnet. Network security groups on the gateway subnet are not supported."
  - q: "Can the on-premises network overlap with the Azure virtual network?"
    a: "No. Learn says no on-premises subnet can overlap with the virtual network subnets you connect to. Address spaces also cannot overlap across multiple connections."
  - q: "Do I have to use active-active mode?"
    a: "Learn recommends active-active but says the VPN device must support it. If it does not, set Enable active-active mode to Disabled. In active-active, you create tunnels to each gateway instance."
  - q: "How do I check that the tunnel works?"
    a: "Per Learn, open the virtual network gateway, select Connections and open the connection. The connection should show a status of Succeeded and Connected."
---

To create a site-to-site VPN to Azure in the portal: create a virtual network, add a gateway subnet, create the VPN gateway, create a local network gateway that describes your on-premises side, configure your VPN device, and create the connection with a shared key. The gateway takes the longest, at 45 minutes or more. This guide follows the Microsoft Learn tutorial. Names and ranges below are the tutorial's examples.

## Prerequisites

- An Azure account with an active subscription.
- On-premises IP address ranges, coordinated with whoever manages your network. No on-premises subnet can overlap with the virtual network subnets you connect to.
- A compatible VPN device and someone who can configure it. Learn points to the About VPN devices article.
- An externally facing public IPv4 address for the VPN device.
- For active-active mode, a device that supports it. If it does not, set **Enable active-active mode** to **Disabled**.

## Step 1: Create the virtual network

Search for **virtual network**, select **Create**, and fill in **Basics**, **Security** and **IP Addresses**. The tutorial uses resource group TestRG1, name VNet1, region East US, IPv4 address space 10.1.0.0/16 and a FrontEnd subnet of 10.1.0.0/24. Select **Review + create**, then **Create**.

## Step 2: Add the gateway subnet

Add a subnet with the purpose **Virtual Network Gateway**. The name becomes **GatewaySubnet** automatically. The example range is 10.1.255.0/27, and Learn says to use /27 or larger. Network security groups on the gateway subnet are not supported.

## Step 3: Create the VPN gateway

Example values from Learn:

| Setting | Example |
| --- | --- |
| Name | VNet1GW |
| Gateway type | VPN |
| SKU | VpnGw2AZ (AZ SKUs support availability zones) |
| Generation | Generation2 |
| Virtual network | VNet1 |
| Public IP address | Create new, Standard SKU, Static assignment |
| Enable active-active mode | Enabled, with a second public IP |
| Configure BGP | Disabled |

Select **Review + create**, then **Create**. Learn says deployment takes 45 minutes or more. The gateway region must match the virtual network region. The Basic SKU is not available in the portal, so use PowerShell or CLI for it. To see the gateway IP addresses, open the gateway's **Properties** page. Active-active shows two public IPs, one per gateway instance.

## Step 4: Create the local network gateway

The local network gateway represents your on-premises site. Example: name Site1, same resource group, East US.

- **Endpoint:** an IP address (static) or an FQDN (dynamic).
- **Address space:** the on-premises prefixes routed to the VPN device. They must not overlap with other connected networks.
- **Advanced** tab: BGP settings, if needed.

For FQDN endpoints, Learn lists constraints: one IPv4 address per FQDN, no IPv6, DNS cache refresh every 5 minutes for disconnected tunnels only (resetting the gateway also triggers resolution), and multiple FQDNs must resolve to different addresses.

## Step 5: Configure the VPN device

You need the shared key and the public IP addresses of the gateway instances. The key must match the connection's shared key. Learn says to use a complex key of at least 32 characters.

For active-active gateways, create tunnels to **each** gateway instance. A tunnel to only one instance drops the connection during maintenance. If your device cannot do that, use active-standby mode.

## Step 6: Create the connection

1. Open the virtual network gateway and select **Connections** > **+ Add**.
2. On **Basics**, set **Connection type** to **Site-to-site (IPSec)**, then a name and region.
3. On **Settings**, select the virtual network gateway and local network gateway and enter the shared key.
4. Defaults in the tutorial: **IKE Protocol** IKEv2, **IPsec/IKE policy** Default, **Use policy based traffic selector** Disable, **DPD timeout in seconds** 45, **Connection Mode** Default. Azure private IP, BGP and FastPath are not selected, and NAT rule associations stay at 0.
5. Select **Review + create**, then **Create**.

The status changes from Unknown to Connecting to Succeeded.

## Step 7: Verify

Open **All resources**, select the virtual network gateway, select **Connections** and open the connection. Learn says success shows **Succeeded** and **Connected** in the Essentials view.

## Day-two tasks

- **Reset the gateway:** use **Help** > **Reset**. This causes a connectivity gap and reboots the active instance.
- **Add another site:** create a local network gateway for it and add a connection. Address spaces cannot overlap across connections.
- **Change the shared key:** edit it on the connection's **Authentication** page, then update the VPN device.
- **Upgrade the SKU:** rules limit which SKUs you can upgrade to. See the gateway SKU upgrade article.

## Clean up

If this was a test, delete the resource group. Search for it, select **Delete resource group**, type the name and select **Delete**.

## Typical mistakes

- Overlapping address ranges between Azure and on-premises.
- Putting an NSG on the gateway subnet.
- Building tunnels to one instance only in active-active mode.
- A shared key that differs between Azure and the device.
- Expecting the gateway to be ready within minutes.

## Related

- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure DNS](https://www.m365.fm/entity/azure-dns/)
- [Azure Portal](https://www.m365.fm/entity/azure-portal/)

## Sources

- [Tutorial: Create a site-to-site VPN connection in the Azure portal (Microsoft Learn)](https://learn.microsoft.com/azure/vpn-gateway/tutorial-site-to-site-portal)
