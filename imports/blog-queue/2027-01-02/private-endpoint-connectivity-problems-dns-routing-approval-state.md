---
title: "Private Endpoint Connectivity Problems: Troubleshoot DNS, Routing and Approval State"
summary: "A step-by-step order for troubleshooting Azure private endpoints: check approval state, DNS resolution and zone links, effective routes, NSG rules, peering and Web App VNet integration."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [azure-private-link, azure-virtual-network]
keypoints:
  - "Check DNS first with nslookup. The FQDN must resolve to the private endpoint's private IP, not a public IP."
  - "The most common DNS cause on Learn is a private DNS zone that is not linked to the querying virtual network."
  - "A Pending connection is approved by the target resource owner, not by the consumer. Managed services such as Front Door never auto-approve."
  - "The private endpoint creates a /32 route that can override a broader user-defined route and bypass a firewall or NVA."
  - "If approval, DNS, routes, NSGs and peering all check out, open an Azure support request."
faq:
  - q: "Why does the private endpoint FQDN resolve to a public IP?"
    a: "Microsoft Learn lists a private DNS zone not linked to the querying virtual network as the most common cause, followed by a missing or stale A record and custom DNS that does not forward privatelink queries to Azure DNS at 168.63.129.16."
  - q: "Who approves a Pending private endpoint connection?"
    a: "Per Microsoft Learn, the target resource owner approves, signed in to the target subscription. The consumer cannot approve from its own subscription. Learn names Front Door Premium, App Service, Synapse and Data Factory as sources that never auto-approve."
  - q: "Why does traffic to a private endpoint bypass my firewall?"
    a: "Learn explains that the private endpoint adds a /32 system route that wins over a broader user-defined route by longest prefix match. The documented fix is a /32 user-defined route to the private endpoint IP with the firewall as next hop."
  - q: "Does the NSG on the private endpoint subnet matter?"
    a: "The Learn page says the private endpoint subnet NSG is not evaluated by default, because privateEndpointNetworkPolicies is Disabled. It tells you to check the NSG on the source subnet instead."
  - q: "What if everything checks out and it still fails?"
    a: "Learn says to file an Azure support request. For intermittent timeouts under high connection volume with Accelerated Networking, it also describes SNAT exhaustion as a possible cause."
---

Work through a private endpoint problem in this order: confirm the connection is approved, confirm DNS returns the private IP, confirm routes and NSG rules allow the path, then check peering or service-specific integration. Microsoft Learn splits this across three troubleshooting pages for approval state, DNS resolution and connectivity failures. This guide merges them in the order a technician would use.

## Step 1: Check the approval state

A private endpoint can show Pending even when it is provisioned. From the Learn page on pending connections, the common causes are:

1. A cross-subscription or cross-tenant connection that is not on the target's auto-approval list, so it waits for manual approval.
2. A managed-service source: Azure Front Door Premium, App Service, Azure Synapse or Azure Data Factory never auto-approve.
3. The approver lacks the approve data action for the service. The call fails with `AuthorizationFailed` and the portal hides **Approve**.
4. The consumer subscription is not on the allow list although auto-approval was expected.

The **target resource owner** approves, signed in to the target subscription. The consumer cannot approve from its own subscription. Learn names Storage Account Contributor, Key Vault Contributor and Network Contributor as examples of roles that carry the approval action for storage, Key Vault and Private Link service targets. Role assignments can take up to 30 minutes to propagate, according to the page.

Read-only checks with the Azure CLI: `az network private-endpoint show` on the consumer side and `az network private-endpoint-connection list --id <target resource ID>` on the target side. Learn expects `Approved` on both and `actionsRequired` as `None`. Approve with `az network private-endpoint-connection approve`.

A caution: the page I read for this step says the source page contains unresolved verification markers and some inconsistent claims, for example auto-approval property paths for first-party services. Confirm those details on the live page.

## Step 2: Check DNS resolution

Run `nslookup` on the FQDN from the affected machine. Learn gives this table:

| Result | Meaning |
| --- | --- |
| Public IP | The private DNS zone is not being used |
| Private IP | DNS is correct. Check routing, NSG and service firewall |
| NXDOMAIN | The zone intercepts the query but has no matching A record |
| Timeout, no servers reached | The DNS server is unreachable, for example a custom DNS VM that is down |

If the result is wrong, check in this order:

1. **Private endpoint and its IP.** Confirm `Approved` and find the private IP from the network interface.
2. **A record in the private DNS zone.** Look for a record named with the short name before `.privatelink.`. For example `mystorageaccount` for `mystorageaccount.blob.core.windows.net`.
3. **Virtual network links on the zone.** The querying VNet must be listed with the state `Completed`. If it shows `InProgress`, wait one to two minutes.
4. **VNet DNS servers.** If custom DNS servers are set, they must forward `privatelink.*` queries to `168.63.129.16`. That address is reachable only from inside an Azure VNet. For on-premises DNS, Learn says to use an Azure DNS Private Resolver inbound endpoint or a forwarder VM in the VNet.

Fixes on Learn: link the zone to the VNet with registration disabled, correct the A record or create a DNS zone group on the private endpoint so records are managed automatically, and add conditional forwarders for custom DNS. If non-private-endpoint names return NXDOMAIN because the zone overrides the namespace, Learn suggests the `NxDomainRedirect` resolution policy on the VNet link or explicit A records.

## Step 3: Check the network path

If DNS returns the private IP but traffic never arrives, Learn lists these symptoms: TCP timeouts to the private IP, `Connection timed out`, or `No route to host`. Its checks run in this order:

1. **PE connection state.** `Succeeded` and `Approved`. If provisioning failed or the IP is empty, Learn says to delete and re-create the endpoint.
2. **Effective routes on the source NIC.** Run `az network nic show-effective-route-table` and look for the private endpoint `/32` route with next hop type `InterfaceEndpoint`.
3. **NSG rules on the source subnet.** The private endpoint subnet NSG is not evaluated by default.
4. **VNet peering.** Peering must be `Connected` in both directions when source and endpoint are in different VNets. Check `AllowForwardedTraffic` when traffic goes through a hub NVA.
5. **Web App VNet integration**, if the source is a Web App. It needs integration and route-all enabled, and the integration subnet is delegated to `Microsoft.Web/serverFarms`.

### The /32 route and firewalls

Learn says the `/32` route from the private endpoint wins over a broader user-defined route, such as `10.0.0.0/8` to a virtual appliance, so traffic can bypass a central firewall. The documented fix is a `/32` user-defined route for the endpoint IP with the firewall as next hop. Verify with `az network watcher show-next-hop`. If it shows `None`, confirm the NVA has an adapter at that IP with IP forwarding enabled.

### Intermittent failures

Learn describes intermittent HTTP 499 or TCP resets under high connection volume with Accelerated Networking as a possible SNAT exhaustion case. The listed options are disabling Accelerated Networking on the NIC, which causes downtime, or adding a public IP to a NAT gateway.

## Roles you need

Learn lists Network Contributor on the source and endpoint resource groups, and Network Watcher Contributor for next-hop and effective-route operations. Private DNS changes need Private DNS Zone Contributor.

## Typical mistakes

- Testing from a machine on a network that does not use the linked private DNS zone.
- Linking the zone to the wrong VNet.
- Waiting for auto-approval on a managed-service source.
- Looking at the endpoint subnet NSG instead of the source subnet NSG.

## Related

- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure DNS](https://www.m365.fm/entity/azure-dns/)
- [Azure Front Door](https://www.m365.fm/entity/azure-front-door/)

## Sources

- [Troubleshoot private endpoint connectivity failures (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/private-link/troubleshoot-private-endpoint-connectivity-failure)
- [Troubleshoot private endpoint DNS resolution failure (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/private-link/troubleshoot-private-endpoint-dns-resolution)
- [Troubleshoot a private endpoint connection stuck in Pending state (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/private-link/troubleshoot-private-endpoint-pending-approval)
