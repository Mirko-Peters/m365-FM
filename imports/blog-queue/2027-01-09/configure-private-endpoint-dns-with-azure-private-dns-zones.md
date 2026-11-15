---
title: "How to Configure Private Endpoint DNS With Azure Private DNS Zones"
summary: "Configure DNS for Azure private endpoints with private DNS zones: why DNS must resolve to the private IP, recommended zone names, one zone per service, the NXDOMAIN risk and fallback, and what the Learn page leaves to other articles."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [azure-private-dns-zone, azure-private-link]
keypoints:
  - "DNS must resolve the service FQDN to the private endpoint IP address. Existing public DNS configurations must be overridden, while connection URLs do not change."
  - "Use the recommended privatelink zone names. Zone configurations are generated automatically only with the recommended naming scheme."
  - "Create one DNS zone for each private endpoint of like services, and do not mix records for several services in one zone."
  - "A zone such as privatelink.blob.core.windows.net can return NXDOMAIN for a resource without a private endpoint. Use Fallback to Internet on the virtual network link."
  - "DNS resolving does not grant access. When Public network access is Disabled, the service rejects the connection regardless of DNS."
faq:
  - q: "What does DNS have to do for a private endpoint?"
    a: "Microsoft Learn says DNS must resolve the service FQDN to the private endpoint IP address. Azure creates a CNAME on public DNS that redirects to the privatelink name, and your private zone overrides it with the private IP."
  - q: "Which zone names should I use?"
    a: "The recommended privatelink names, such as privatelink.blob.core.windows.net for blob, privatelink.vaultcore.azure.net for Key Vault and privatelink.database.windows.net for Azure SQL. Government and China clouds have separate names."
  - q: "Can I put several services in one zone?"
    a: "No. Learn says to create a DNS zone for each private endpoint of like services and not to place records for multiple services in the same zone."
  - q: "Why do I get NXDOMAIN for some resources?"
    a: "If a zone like privatelink.blob.core.windows.net is used and a target resource has no private endpoint, the zone can return NXDOMAIN. Use Fallback to Internet on the virtual network link, or add an A record with the public IP, which Learn does not recommend."
  - q: "Does a successful lookup mean I have access?"
    a: "No. DNS resolution and access control are separate. With Public network access Disabled, the service rejects the connection regardless of DNS."
---

A private endpoint only works for clients whose DNS answers with the private IP. Most failures come from the zone, the link or the name. The Microsoft Learn page behind this guide lists zone names, the recommended approach and caveats. It does not explain virtual network links in detail, zone groups, custom DNS servers or on-premises designs. It links only to short pointers such as the Private DNS zones overview, Azure Private Resolver and the Fallback to Internet article, and none of those was read for this guide.

## How DNS works for a private endpoint

- DNS must resolve the service FQDN to the private endpoint IP address. Existing public DNS configurations must be overridden.
- The private endpoint's network interface provides the FQDN and private IP addresses you need.
- Azure creates a CNAME on public DNS that redirects to the privatelink domain name. You override it with the private IP.
- Connection URLs do not change. Client DNS requests to a public DNS server resolve to your private endpoints.
- DNS and access control are separate. The public `privatelink` CNAME chain resolves from anywhere, and a successful lookup does not grant data-plane access. If **Public network access** is **Disabled**, the service rejects the connection regardless of DNS.

## Options

- A host file, recommended only for testing.
- A private DNS zone linked to your virtual network to resolve specific domains.
- Azure Private Resolver, optionally, to override DNS resolution for a private link resource.

## Recommended zone names

| Service (subresource) | Private DNS zone |
| --- | --- |
| Storage blob | `privatelink.blob.core.windows.net` |
| Storage file | `privatelink.file.core.windows.net` |
| Key Vault (vault) | `privatelink.vaultcore.azure.net` |
| Azure SQL Database (sqlServer) | `privatelink.database.windows.net` |
| Cosmos DB (Sql) | `privatelink.documents.azure.com` |
| Container Registry (registry) | `privatelink.azurecr.io` |
| Service Bus and Event Hubs (namespace) | `privatelink.servicebus.windows.net` |

Government and China clouds use separate names. Some services need several zones, for example Azure Monitor and Azure Data Explorer. The page lists the full set.

## The recommended approach

- Use the recommended names. Private endpoint private DNS zone configurations are generated automatically only with the recommended naming scheme.
- Create a DNS zone for each private endpoint of like services. Do not place records for several services in the same zone.
- Do not link an existing zone for one Azure service to private endpoints of two different services. Learn says this deletes the initial A record.
- Link the private DNS zone to the virtual network so that it resolves the domains.

## Caveats

- **Do not override a zone that public endpoints still use.** Resolution breaks without DNS forwarding to the public DNS.
- **NXDOMAIN.** If a zone like `privatelink.blob.core.windows.net` exists and a target resource has no private endpoint, the zone can return NXDOMAIN. Use **Fallback to Internet** on the virtual network link. Or add an A record with the public IP manually, which Learn does not recommend because it will not follow changes to the public IP.
- **Azure Files.** Shares must be remounted if they were connected to the public endpoint.
- **Footnotes on the page.** Container Registry: if you use Azure Private DNS zones, do not deploy the regional data zone `{regionName}.data.privatelink.azurecr.io` as an additional zone, because the entries are added automatically to the existing `privatelink.azurecr.io` zone. Web Apps: to use the Kudu console or Kudu REST API, create two records that point to the private endpoint IP address, one for the app and one for `scm`, in the private zone `privatelink.azurewebsites.net` or a custom DNS server, and do not deploy `scm.privatelink.azurewebsites.net` as an additional zone in Azure private DNS. Foundry Tools: a zone for each endpoint suffix. IoT Hub: `privatelink.servicebus.windows.net` is needed for the built-in endpoint.

## What the page does not say

- Virtual network link configuration, beyond a passing mention and the fallback link.
- DNS zone groups.
- How to set up custom DNS servers or conditional forwarders, and the Azure DNS address they would point to. The tables do list a public DNS zone forwarders column for each service.
- On-premises and hub-and-spoke designs.

## A configuration outline

This outline is my advice, built on the page.

1. Find the recommended zone for your service and subresource.
2. Create the zone once for that service type and link it to the virtual network.
3. Create the private endpoint, and check that the A record uses the private IP.
4. From a client in the network, resolve the FQDN and confirm that it returns the private IP.
5. If other resources of the same type have no private endpoint, enable Fallback to Internet.
6. Check Public network access separately, since DNS does not control it.

## Typical mistakes (my advice)

- Using custom zone names and expecting automatic records.
- Putting several services in one zone.
- Overriding a zone that public workloads still need.
- Treating a correct lookup as proof of access.

## Related

- [Azure Private DNS zone](https://www.m365.fm/entity/azure-private-dns-zone/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [Azure Private Endpoint private DNS zone values (Microsoft Learn)](https://learn.microsoft.com/azure/private-link/private-endpoint-dns)
