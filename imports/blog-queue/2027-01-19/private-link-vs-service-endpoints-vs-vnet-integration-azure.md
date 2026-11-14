---
title: "Private Link vs Service Endpoints vs VNet Integration: Which Azure Network Isolation Option"
summary: "Private Link gives a service a private IP in your virtual network, service endpoints extend your subnet identity to a service that keeps its public address, and App Service virtual network integration only governs outbound traffic from an app. A comparison based on Microsoft Learn pages."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [azure-private-link, azure-virtual-network, azure-storage-account, azure-app-service]
keypoints:
  - "Service endpoints give your subnet's identity to an Azure service, but DNS still resolves to the service's public IP and endpoints cannot be used for traffic from on-premises."
  - "Private Link maps a private endpoint to one resource instance with a private IP in your network and works from on-premises over ExpressRoute private peering, VPN and peering."
  - "App Service virtual network integration is outbound only; for inbound private access Learn points to private endpoints."
  - "Learn's service endpoint page says Microsoft recommends Azure Private Link and private endpoints for secure and private access to Azure platform services."
  - "Service endpoints change the source address of subnet traffic to a private IP, which can break existing firewall rules based on public IPs."
faq:
  - q: "What is the main difference between service endpoints and Private Link?"
    a: "Learn says service endpoints extend your virtual network identity to the Azure service, whose DNS name still resolves to a public IP. Private Link deploys a private endpoint, a network interface in your virtual network, mapped to a specific resource instance, so traffic uses a private IP."
  - q: "Can service endpoints serve on-premises users?"
    a: "Not directly. Learn lists as a limitation that endpoints cannot be used for traffic from on-premises services to Azure services. To allow on-premises traffic you add public NAT IP addresses to the service firewall. Private Link, by contrast, supports on-premises access over ExpressRoute private peering, VPN tunnels and peered networks."
  - q: "Does App Service virtual network integration make my app private?"
    a: "No. Learn says it gives your app access to resources in your virtual network but does not grant inbound private access. It is used only for outbound calls, and private endpoints are for inbound private access."
  - q: "Does Learn recommend one of the options?"
    a: "On the service endpoints page, a note says Microsoft recommends Azure Private Link and private endpoints for secure and private access to services hosted on the Azure platform."
  - q: "Do service endpoints cost extra?"
    a: "Learn says there is no extra charge for service endpoints. For Private Link it points to a pricing page, which I did not read, so check it for current prices."
---

These three features answer different questions. Service endpoints let a subnet reach an Azure service by identity, with the service keeping its public address. Private Link puts a private IP for a specific resource into your virtual network. App Service virtual network integration lets an app make outbound calls into your network and says nothing about inbound access. Microsoft Learn's service endpoint page carries a note that Microsoft recommends Private Link and private endpoints for secure and private access to Azure platform services. This article compares the three using Learn's pages on each.

## Service endpoints

Learn describes service endpoints as secure, direct connectivity to Azure services over an optimized route on the Azure backbone. You enable an endpoint on a subnet and then add a virtual network rule on the service, which removes public internet access to the resource and allows traffic only from your virtual network.

Points from the page:

- **Source address changes.** Service traffic switches from a public IPv4 source address to the virtual network's private address. Firewall rules based on Azure public IPs stop working after the switch, and existing open TCP connections to the service are closed.
- **DNS stays the same.** DNS entries for Azure services keep resolving to the public IP addresses of the service.
- **Limitations.** The feature applies only to virtual networks deployed through Azure Resource Manager, and endpoints cannot be used for traffic from on-premises services to Azure services.
- **On-premises access.** By default, resources secured to virtual networks are not reachable from on-premises. You must allow public (typically NAT) IP addresses from on-premises or ExpressRoute in the service firewall.
- **Cost.** There is no extra charge for service endpoints, and no limit on the total number of endpoints in a virtual network.

Learn lists services such as Azure Storage, Azure SQL Database, Azure Cosmos DB, Azure Key Vault, Azure Service Bus, Azure Event Hubs and Azure App Service.

## Private Link and private endpoints

Learn says Private Link lets you access Azure PaaS services, and customer-owned or partner services, over a private endpoint in your virtual network. Traffic travels the Microsoft backbone network, and the service need not be exposed to the public internet. Benefits listed:

- **Private access** to services on the Azure platform.
- **On-premises and peered networks**: access over ExpressRoute private peering, VPN tunnels and peered virtual networks, with no need for Microsoft peering or the internet.
- **Protection against data leakage**: a private endpoint is mapped to an instance of a PaaS resource instead of the entire service, so consumers can connect only to that resource.
- **Global reach**: a consumer's virtual network in one region can connect to services behind Private Link in another.
- **Your own services**: you can place a service behind a standard load balancer and offer it through Private Link.

Learn also notes that Azure Private Link integrates with Azure Monitor for logging, and refers to a pricing page and a limits page for details.

## App Service virtual network integration

Learn's App Service page says virtual network integration gives your app access to resources in or through a virtual network but does not grant inbound private access. It is used only for outbound calls. For inbound private access, the page points to private endpoints. Facts from the page:

- It needs a Basic, Standard, Premium (v2 to v4) or Elastic Premium plan, and works with apps, function apps and Logic apps.
- It supports connecting to a virtual network in the same region.
- It needs a dedicated, unused subnet that is an IPv4 /28 block or larger.
- It can reach resources in the integrated and peered networks, across ExpressRoute, service endpoint-secured services and private endpoint-enabled services.
- NSGs and route tables on the integration subnet apply to outbound traffic only. Inbound NSG rules do not apply.
- To call a private endpoint from the app, DNS must resolve to the private endpoint, for example with Azure DNS private zones.

## Side by side

| Question | Service endpoints | Private Link | App Service VNet integration |
| --- | --- | --- | --- |
| Direction | Subnet to Azure service | Client to a specific resource | App outbound into your VNet |
| Address of the target | Public IP, DNS unchanged | Private IP in your VNet | Not applicable |
| On-premises clients | Not through the endpoint | Yes, per Learn | Not its purpose |
| Scope of access | Service, limited by VNet rules | One resource instance | Outbound only |
| Extra charge | None, per Learn | See Learn pricing page | None beyond plan, per Learn |

## Choosing

This section is my advice, not a Microsoft statement.

1. **Start from the direction.** If the question is how my web app calls a database privately, you need integration plus a private path to the database. If the question is how people reach my app privately, integration does not answer it.
2. **Use Private Link when on-premises access or per-resource scoping matters.** Learn lists both as benefits.
3. **Use service endpoints for simple subnet-to-service restriction.** Learn describes them as simple to set up with little management overhead, and with no extra charge.
4. **Check the source IP change before enabling endpoints.** Learn warns that firewall rules built on public IPs stop working and open connections close, so schedule the change.
5. **Combine them where needed.** An app with virtual network integration can reach both service endpoint-secured and private endpoint-enabled services, according to Learn.
6. **Plan DNS early for private endpoints.** Learn's App Service page says DNS must resolve to the private endpoint, so decide how private zones are linked.

## What the pages do not say

This is a comparison I built from separate pages. The storage firewall page, which I also read, describes virtual network rules for storage and the two storage service endpoint types, Microsoft.Storage for the same region and Microsoft.Storage.Global for any region. I did not read a single Microsoft page that ranks all three options, so the table above is my summary.

## Related

- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Storage account](https://www.m365.fm/entity/azure-storage-account/)
- [Azure App Service](https://www.m365.fm/entity/azure-app-service/)

## Sources

- [Azure virtual network service endpoints (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview)
- [What is Azure Private Link? (Microsoft Learn)](https://learn.microsoft.com/azure/private-link/private-link-overview)
- [Integrate your app with an Azure virtual network - Azure App Service (Microsoft Learn)](https://learn.microsoft.com/azure/app-service/overview-vnet-integration)
- [Azure Storage firewall rules and network access (Microsoft Learn)](https://learn.microsoft.com/azure/storage/common/storage-network-security)
