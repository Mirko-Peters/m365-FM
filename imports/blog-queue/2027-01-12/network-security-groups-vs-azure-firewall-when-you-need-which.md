---
title: "Network Security Groups vs Azure Firewall: When You Need Which"
summary: "Compare Azure network security groups and Azure Firewall using two Microsoft Learn pages: what NSG rules, default rules and service tags do, what Azure Firewall offers in its three SKUs, and why the pages themselves do not compare them."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [azure-firewall, azure-virtual-network]
keypoints:
  - "An NSG filters traffic between Azure resources in a virtual network with allow and deny rules. Priority runs from 100 to 4096, and processing stops at the first match."
  - "Azure Firewall is a cloud-native, fully stateful firewall as a service in Basic, Standard and Premium SKUs, with L3-L7 filtering and threat intelligence in Standard."
  - "Neither Learn page mentions the other, so the comparison here is practical advice built on the documented facts and is labeled as such."
  - "NSG flow logs retire on September 30, 2027. Microsoft recommends migrating to virtual network flow logs."
  - "The NSG page gives no rule limit number and the Firewall page gives no rule type or FQDN detail, no prices and no SLA figures."
faq:
  - q: "What does a network security group do?"
    a: "It filters network traffic between Azure resources in Azure virtual networks. It contains security rules that allow or deny inbound traffic to, or outbound traffic from, several types of Azure resources."
  - q: "What is Azure Firewall?"
    a: "Microsoft Learn calls it a cloud-native, intelligent network firewall security service that offers threat protection for Azure workloads. It is a fully stateful firewall as a service with built-in high availability and unlimited cloud scalability, and it inspects east-west and north-south traffic."
  - q: "Which Azure Firewall SKUs exist?"
    a: "Basic for small and medium-sized businesses with Threat Intel alert mode only and an estimated throughput of 250 Mbps, Standard with L3-L7 filtering and threat intelligence feeds, and Premium with signature-based IDPS."
  - q: "Do NSG rules hold state?"
    a: "Yes. A flow record is created for existing connections, so an allowed outbound rule covers the response without a matching inbound rule, and the reverse. Rule changes apply only to new connections."
  - q: "Does Microsoft compare the two on these pages?"
    a: "No. The NSG page does not mention Azure Firewall, and the Azure Firewall page does not mention network security groups."
---

Network security groups (NSGs) and Azure Firewall both filter traffic in Azure, but they are different services. Neither Microsoft Learn page compares them. This guide reports what each page says and then offers a labeled practical comparison.

## What an NSG is

An NSG filters network traffic between Azure resources in Azure virtual networks. It contains security rules that allow or deny inbound traffic to, or outbound traffic from, several types of Azure resources.

| Rule property | Detail from the page |
| --- | --- |
| Name | Up to 80 characters |
| Priority | 100 to 4096. Lower numbers are processed first. Processing stops at the first match |
| Source or destination | Any, an IP address, a CIDR block, a service tag or an application security group |
| Protocol | TCP, UDP, ICMP, ESP, AH or Any. ESP and AH are not available in the portal |
| Direction | Inbound or outbound |
| Port range | A single port, a range or a comma-separated mix |
| Action | Allow or Deny |

Rules are evaluated on the five-tuple of source, source port, destination, destination port and protocol. You cannot create two rules with the same priority and direction.

**State.** A flow record is created for existing connections. An allowed outbound rule covers the response without a matching inbound rule, and vice versa. Rule changes apply only to new connections.

**Default rules.** They cannot be deleted but can be overridden with higher-priority rules.

| Direction | Rule | Priority | Access |
| --- | --- | --- | --- |
| Inbound | AllowVNetInBound | 65000 | Allow |
| Inbound | AllowAzureLoadBalancerInBound | 65001 | Allow |
| Inbound | DenyAllInbound | 65500 | Deny |
| Outbound | AllowVnetOutBound | 65000 | Allow |
| Outbound | AllowInternetOutBound | 65001 | Allow |
| Outbound | DenyAllOutBound | 65500 | Deny |

Other points: service tags group IP prefixes of Azure services. Application security groups define policy by group of VMs instead of IP addresses. Augmented rules combine several ports and addresses in one rule, but not several service tags or application groups. Security admin rules from Azure Virtual Network Manager always have higher priority than NSG rules. NSG flow logs retire on September 30, 2027, and Microsoft recommends virtual network flow logs. Outbound SMTP on port 25 is blocked for many subscription types.

## What Azure Firewall is

Azure Firewall is a cloud-native, intelligent network firewall security service. It is a fully stateful firewall as a service with built-in high availability and unlimited cloud scalability. It inspects east-west and north-south traffic.

- **Basic:** designed for small and medium-sized businesses, Threat Intel alert mode only, a fixed scale unit with two backend VMs, recommended for about 250 Mbps.
- **Standard:** L3-L7 filtering and threat intelligence feeds from Microsoft that can alert on and block traffic from or to known malicious IP addresses and domains.
- **Premium:** adds signature-based IDPS, with more than 67,000 signatures in more than 50 categories.
- **Azure Firewall Manager:** central management across subscriptions with firewall policies, for virtual network and Virtual WAN environments.

## What the pages do not say

- The NSG page does not mention Azure Firewall. The Firewall page does not mention NSGs.
- The NSG page gives no number for the maximum rules per NSG. It links to the limits page.
- The Firewall page does not name rule types such as network, application or NAT, and does not describe FQDN filtering. It gives no prices or SLA figures.
- Subnet association for NSGs is not described explicitly.

## A practical comparison

This comparison is practical advice built on the two pages and is not stated by Microsoft in them.

1. Use NSGs for basic allow and deny control by address, port and protocol close to the resources, in every virtual network.
2. Consider Azure Firewall when you need L3-L7 filtering, threat intelligence, IDPS or central policy across subscriptions.
3. The two are not alternatives in every case. Many environments use both, with NSGs at the subnet or NIC and a firewall at a central point.
4. Check the Azure Firewall pricing page before you decide, because the overview gives no figures.

## Typical mistakes

- Expecting an NSG to give threat intelligence or signature-based inspection. Those features are described for Azure Firewall Standard and Premium.
- Expecting a rule change to cut existing connections.
- Forgetting the default outbound rule that allows internet traffic.
- Planning on NSG flow logs without noting the retirement date.

## Related

- [Azure Firewall](https://www.m365.fm/entity/azure-firewall/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)

## Sources

- [Network security groups overview (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview)
- [What is Azure Firewall (Microsoft Learn)](https://learn.microsoft.com/azure/firewall/overview)
