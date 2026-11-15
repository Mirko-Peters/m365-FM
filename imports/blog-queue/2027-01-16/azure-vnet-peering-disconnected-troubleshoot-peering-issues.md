---
title: "Azure Virtual Network Peering Shows Disconnected: Troubleshoot Peering Issues"
summary: "A Disconnected peering means one of the two peering links was deleted, so you delete and re-create both. Learn also covers Initiated status, address space sync, UDR conflicts, overlapping CIDR ranges, gateway transit and hub-spoke problems in one troubleshooting page."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [virtual-network-peering, azure-virtual-network, network-security-group]
keypoints:
  - "Disconnected means one of the two peering links is deleted; traffic cannot flow until you delete the remaining link on both sides and re-create the peering."
  - "Initiated means only the first link exists; create the peering from the second virtual network to reach Connected."
  - "After you change the address space of a peered virtual network, sync the peering on every remote peer."
  - "A UDR with the same prefix as a peering route overrides it, which can send traffic to an NVA or drop it."
  - "Azure does not allow peering between virtual networks with overlapping address spaces."
faq:
  - q: "What does a Disconnected peering status mean?"
    a: "Microsoft Learn says one of the two peering links is deleted and traffic cannot flow between the virtual networks until peering is reestablished. Common causes are manual deletion of one side, address space changes without a sync, moving a virtual network to another subscription or tenant, and Azure Policy enforcement."
  - q: "Can I just re-create the missing link?"
    a: "No. Learn says you cannot re-create a peering while one side is Disconnected. Delete the peering from both virtual networks first, then create new links on both, with the correct settings for Allow forwarded traffic, Allow gateway transit and Use remote gateways."
  - q: "What does Initiated mean?"
    a: "Only the first peering link exists. Create the peering from the second virtual network to complete the connection and reach Connected."
  - q: "The status is Connected but traffic fails. What now?"
    a: "Learn says to check traffic flows with Connection Troubleshoot and IP flow verify for NSG or UDR interference, and to take a network trace on the destination VM while running TcpPing or PsPing from the source. If packets arrive, check the VM firewall and the application listening on the port."
  - q: "Which permissions do I need to create a peering?"
    a: "For peering between subscriptions, Learn says you need Network Contributor permissions in both subscriptions."
---

A peering that shows Disconnected has lost one of its two links. Microsoft Learn says traffic cannot flow between the virtual networks until peering is reestablished, and that you must delete the remaining link on both virtual networks and create new links on both sides. You cannot re-create a link while one side is still Disconnected. This guide follows Learn's page on troubleshooting virtual network peering issues, which also covers Initiated status, sync problems, route conflicts and gateway transit.

## Read the status on both sides

In the Azure portal, open each virtual network, select **Peering** and compare the **Status**. The status can be asymmetric, for example Connected on one side and Initiated or Disconnected on the other. With Azure CLI, run this for each network:

```azurecli
az network vnet peering show --resource-group <resource-group> --vnet-name <vnet-name> --name <peering-name> --query peeringState
```

| State | Learn's description |
| --- | --- |
| Initiated | Only the first peering link exists. Create the peering from the second virtual network. |
| Connected | Both links exist and traffic can flow. |
| Disconnected | One link is deleted. Delete and re-create both links. |

## If the status is Disconnected

Learn lists these common causes:

- **Manual deletion.** You deleted a link on one side, so the remaining link becomes Disconnected.
- **Address space changes.** You changed the address space of a peered virtual network and did not sync the peering.
- **Subscription or tenant changes.** You moved a virtual network to another subscription or tenant.
- **Azure Policy enforcement.** A policy that restricts peering or network configuration removed or blocked a peering.

The fix:

1. Delete the remaining peering link from both virtual networks, in the portal or with `az network vnet peering delete`.
2. Re-create the peering from both virtual networks, with the correct values for **Allow forwarded traffic**, **Allow gateway transit** and **Use remote gateways** on each side.
3. Confirm the status shows **Connected** on both sides.

If the cause was a policy, re-creating the link will fail or be undone again, so check Azure Policy assignments first. That check is my advice, based on the policy cause Learn lists.

## If the status is Initiated

Only one link exists. Create the peering from the second virtual network to the first. Learn says both links are required before the status changes to Connected. For peering across subscriptions or tenants, the account needs Network Contributor in both subscriptions, and Learn points to its page on peering between different subscriptions. A message such as `Current tenant <TENANT ID> isn't authorized to access linked subscription` points to that page as well.

## If the status is Connected but traffic fails

1. Run **Connection Troubleshoot** and **IP flow verify** from the source VM to the destination VM to see whether an NSG or UDR interferes.
2. If a firewall or NVA is involved, document the UDR parameters, remove the UDR that points to the NVA from the source subnet or NIC, and test directly. If that does not work, Learn points to its NVA troubleshooter.
3. Take a network trace on the destination VM, with Netsh on Windows or TCPDump on Linux, run TcpPing or PsPing from the source to the destination IP and port, then stop the trace.
4. If packets arrive from the source, there is no networking problem. Look at the VM firewall and the application listening on that port.

## Sync after address space changes

When you change the address space of a peered virtual network, sync the peering for each remote peer so changes are picked up. In the portal, open the network, select **Peering**, tick the peering and select **Sync**, then repeat for each remote peer. With Azure CLI:

```azurecli
az network vnet peering sync --resource-group <resource-group> --vnet-name <vnet-name> --name <peering-name>
```

Learn says to sync after every resize instead of batching several resizes, and that address space sync is not supported when the network is peered with a classic virtual network. It also lists problems such as routes not propagating after a new peering, where it says to wait a few minutes and then check effective routes, and cross-tenant sync failures, where the account needs the right permissions in both tenants.

## Route conflicts and overlaps

- **UDR overrides peering route.** Azure adds system routes with next hop type Virtual network peering. A UDR with the same address prefix takes precedence and can send traffic to an NVA or drop it. Review the route table on the subnet.
- **Asymmetric routing in hub-spoke.** Check effective routes on both VM network interfaces, and use Network Watcher next hop in both directions. If the return path is missing, add a UDR on the destination subnet pointing back through the same NVA.
- **Overlapping address spaces.** Azure does not allow peering between virtual networks with overlapping CIDR ranges, and the operation fails. Resize one network, after confirming nothing is deployed in the range being removed, or plan address spaces up front. Learn also mentions Azure Virtual Network Manager with `ConnectedGroupAddressOverlap` set to Disallowed.

## Hub-spoke and gateway transit

For site-to-site or ExpressRoute connections to on-premises through a hub, Learn points to its VPN gateway transit page. On the network with the gateway, **Allow forwarded traffic** must be selected, and on the network without a gateway, **Use remote gateway** must be selected. If the spoke already has a VPN gateway, **Use remote gateway** is not supported on it. For point-to-site clients, download and reinstall the client package after you create or change peering, because newly peered routes are not added automatically. For spokes in the same region, Learn describes an NVA in the hub with UDRs in the spokes. Transit over global virtual network peering is now supported, according to the page.

One more point from the page: Azure Basic Load Balancer was retired on September 30, 2025, and resources behind a Basic internal load balancer do not work over global virtual network peering. Upgrade to Standard Load Balancer.

## Other messages on the page

- **Not connected:** delete the peering from both networks and re-create it.
- **Failed to peer a Databricks virtual network:** configure the peering under Azure Databricks and specify the target network by Resource ID.
- **The remote virtual network lacks a gateway:** appears when you peer across tenants and later want Use Remote Gateways, because the portal cannot see a gateway in another tenant. Learn says to enable it when you create the new peering, or use PowerShell or CLI.

## A short routine

This section is my advice, not a Microsoft statement.

1. Check both sides before changing anything, and write down the settings of each link.
2. Look in the activity log and Azure Policy for what deleted or changed the link.
3. Delete both links, then re-create them with the recorded settings.
4. Test with IP flow verify and next hop, then with a trace.
5. Add a sync step to every runbook that changes an address space.

## Related

- [Virtual network peering](https://www.m365.fm/entity/virtual-network-peering/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Network security group](https://www.m365.fm/entity/network-security-group/)

## Sources

- [Troubleshoot virtual network peering issues - Azure (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-network/virtual-network-troubleshoot-peering-issues)
