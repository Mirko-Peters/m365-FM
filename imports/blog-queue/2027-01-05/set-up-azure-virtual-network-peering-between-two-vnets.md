---
title: "How to Set Up Azure Virtual Network Peering Between Two VNets"
summary: "Set up Azure virtual network peering in the portal: roles, the Add peering fields, Initiated and Connected status, non-overlapping address space, transitivity, DNS, gateway settings, Basic load balancer limits and deletion behavior."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [azure-virtual-network]
keypoints:
  - "Peered VNets must have non-overlapping IP address spaces. Peering works within one region or across regions."
  - "Each peering must be configured on both VNets. The first shows Initiated, and both show Connected after the second is created."
  - "Peerings are not transitive. If A is peered with B and B with C, A and C cannot communicate through B."
  - "Default Azure name resolution does not work across peered VNets. Use Azure Private DNS or a custom DNS server."
  - "Deleting a peering from one VNet also deletes it from the remote VNet. A VNet cannot be moved while peered."
faq:
  - q: "Which role do I need?"
    a: "Learn names the Network Contributor built-in role. A custom role needs the virtualNetworkPeerings write, read and delete actions. To remove the remote peering, the account needs rights on the remote VNet too."
  - q: "Where do I create a peering in the portal?"
    a: "Search for Virtual networks, select the VNet, then under Settings select Peerings and select + Add. Enter the values and select Add. After a few seconds, refresh. The status changes from Updating to Connected."
  - q: "Why is my peering stuck at Initiated?"
    a: "Learn says the status is Initiated after the first peering is created and Connected for both after the second. The peering is not established until both are Connected, so check that the other side exists."
  - q: "Can I peer VNets in different tenants?"
    a: "Yes. Learn says VNets can be in different subscriptions and different Microsoft Entra tenants. For different tenants, a user from each tenant must be added as a guest user in the opposite tenant."
  - q: "Can I peer across clouds?"
    a: "No. Learn says global peerings can span public, China and Government cloud regions, but you cannot peer across clouds."
---

To peer two virtual networks, create a peering on each VNet. In the Azure portal the Add peering form creates both directions at once. Check first that the address spaces do not overlap. This guide follows the Microsoft Learn article on creating, changing and deleting virtual network peerings. It says where the page leaves things open.

## Prerequisites and permissions

- An Azure account with an active subscription.
- Portal, PowerShell or Azure CLI.
- The built-in **Network Contributor** role, or a custom role with these actions:
  - `Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write`
  - `Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read`
  - `Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete`
- To remove the remote peering, you need Network Contributor, or the read and delete actions, on the **remote** VNet.

## Requirements

- The VNets must have **non-overlapping** IP address spaces.
- Peering works in one region or across regions (global virtual network peering).
- Both VNets can be in the same or different subscriptions, and in the same or different Microsoft Entra tenants.
- For different tenants, a user from each tenant must be added as a guest user in the opposite tenant.
- For VNets in different subscriptions, or different resource groups, PowerShell and CLI need the full resource URI of the remote VNet.
- You cannot peer across clouds.

## Create a peering in the portal

1. Search for **Virtual network** and select **Virtual networks**.
2. Select the network to peer.
3. Under **Settings**, select **Peerings**.
4. Select **+ Add**.
5. Enter or select the values, then select **Add**.
6. Select **Refresh** after a few seconds. The status changes from **Updating** to **Connected**.

### Fields on the Add peering form

**Remote virtual network:** peering link name (unique within the local VNet), deployment model, subscription and virtual network. If you lack read access to the remote VNet, check **I know my resource ID** and enter the ID in the form `/subscriptions/<Id>/resourceGroups/<name>/providers/Microsoft.Network/virtualNetworks/<name>`.

**Settings, for each direction:**

| Setting | Default | What Learn says |
| --- | --- | --- |
| Allow the peered virtual network to access the local VNet | Selected | Allows traffic from the peered VNet and includes both VNets in the VirtualNetwork service tag |
| Allow the peered VNet to receive forwarded traffic | Not selected | Forwarded traffic from the other side |
| Allow gateway or route server in the peered VNet to forward traffic | Not selected | Requires a gateway or route server in that VNet |
| Use the peered VNet's remote gateway or route server | Not selected | Possible only if the other VNet has a gateway or route server and allows forwarding. Can be on in only one of the two peerings. You cannot use remote gateways if you already have a gateway in your VNet |

Learn notes that parts of the page call the first setting Allow traffic to remote virtual network and do not reconcile the names.

## Status values

The page names two: **Initiated** after the first peering exists, and **Connected** for both after the second. **Updating** appears in the portal step. The page lists no other states or error statuses.

## Behaviors to plan for

- **Not transitive.** With A-B and B-C, A and C cannot communicate through B. Create a direct A-C peering or route through a network virtual appliance in a hub.
- **DNS.** Default Azure name resolution does not resolve names across peered VNets. Use Azure Private DNS or a custom DNS server.
- **Performance.** Same-region peered resources communicate with the same latency as within one VNet. Bandwidth is limited by the VM size, with no extra peering limit.
- **Gateways.** A VNet can be both peered and gateway-connected. Traffic then flows through the peering. For on-premises traffic through a VPN gateway to a peered VNet, the on-premises VPN device must include all Azure VNet CIDRs.
- **Load balancers.** Resources cannot reach the front-end IP of a Basic load balancer in a globally peered VNet. Standard load balancers work with both peering types.
- **Point-to-Site VPN.** Download the clients again after peering so they receive the new routes.
- **Application Gateway.** Without Network Isolation it does not allow traffic between peered VNets when the access setting is disabled.
- **Cost.** A nominal charge applies to ingress and egress traffic over a peering. See the pricing page.

## Change or delete a peering

To change settings: Virtual networks > the VNet > **Peerings** > the peering, change the setting and select **Save**.

To delete: select the VNet > **Peerings**, select the peering and **Delete**, type `delete` in the confirmation box, then confirm. Deleting from one VNet also deletes it from the remote VNet. To block traffic temporarily, Learn suggests clearing the allow-traffic setting instead of deleting. A VNet cannot be moved while in a peering. Delete the peering, move the VNet and recreate it.

## What the page does not cover

What happens when a peered VNet's address space changes, numeric limits such as peerings per VNet, code samples (it links to sample pages), and pricing amounts.

## A setup checklist

The checklist is practical advice.

1. Compare the address spaces of both VNets.
2. Decide on forwarded traffic and gateway settings before you create the peering.
3. Create the peering and confirm both sides show Connected.
4. Plan DNS separately.
5. Test with a VM in each VNet.

## Typical mistakes

- Overlapping address spaces.
- Expecting traffic to pass through a middle VNet.
- Forgetting DNS for name resolution.
- Using a Basic load balancer across global peering.
- Moving a VNet without deleting the peering first.

## Related

- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Virtual network peering](https://www.m365.fm/entity/virtual-network-peering/)
- [Azure private DNS zone](https://www.m365.fm/entity/azure-private-dns-zone/)

## Sources

- [Create, change or delete a virtual network peering (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-network/virtual-network-manage-peering)
