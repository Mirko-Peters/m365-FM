---
title: "AZ-700 Azure Network Engineer: Skills Measured and Study Plan"
summary: "AZ-700 Azure Networking Solutions skills outline as of July 27, 2026: five skill areas with weights, audience profile, passing score, what changed in the latest update and a study plan based on the weights."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [az-700]
keypoints:
  - "As of July 27, 2026 the five areas are core networking (25-30%), connectivity services (20-25%), application delivery (15-20%), private access (10-15%) and network security (15-20%)."
  - "The study guide says a score of 700 or greater is required to pass. Most questions cover generally available features."
  - "The July 2026 change log lists three minor changes: IP addressing, Monitor networks and network security groups."
  - "The guide contains no retirement notice and recommends the new Practice Assessment on AI Skills Navigator."
  - "This guide uses only the public skills outline and contains no exam questions."
faq:
  - q: "What are the skill areas and weights?"
    a: "As of July 27, 2026: design and implement core networking infrastructure (25-30%), design, implement and manage connectivity services (20-25%), design and implement application delivery services (15-20%), design and implement private access to Azure services (10-15%), and design and implement Azure network security services (15-20%)."
  - q: "What score do I need?"
    a: "The study guide says a score of 700 or greater is required to pass."
  - q: "What changed in the latest update?"
    a: "Three minor changes: IP addressing for Azure resources, Monitor networks, and network security groups. The audience profile and the two top-level areas shown in the table are marked no change, and the table lists no other areas."
  - q: "Is the exam retiring?"
    a: "The study guide contains no retirement notice. It says the legacy Practice Assessment is no longer updated and recommends the new one on AI Skills Navigator."
  - q: "Does this article include exam questions?"
    a: "No. It uses only the skills outline."
---

AZ-700 puts the most weight on core networking (25-30%). Connectivity services come next at 20-25%. This guide uses only the Microsoft Learn skills outline, valid as of 27 July 2026, and contains no exam questions.

## About the exam

The study guide says a score of 700 or greater is required to pass. Most questions cover generally available features, though preview features may appear if commonly used. English is updated first and localized versions follow about eight weeks later. If the exam is not offered in your preferred language, you can request an additional 30 minutes.

The audience is an Azure network engineer with expertise in planning, implementing and managing Azure networking across core network infrastructure, hybrid connectivity, application delivery, private access to Azure services and network security. Responsibilities include optimizing performance, resiliency, scale and security, proactively monitoring networks and resolving connectivity issues. You work with solution architects, cloud administrators, security engineers, application developers and DevOps engineers. Candidates should have experience with Azure compute, storage and networking, and understand name resolution, network protocols and network address management.

## Skill areas and weights

| Skill area | Weight |
| --- | --- |
| Design and implement core networking infrastructure | 25-30% |
| Design, implement and manage connectivity services | 20-25% |
| Design and implement application delivery services | 15-20% |
| Design and implement private access to Azure services | 10-15% |
| Design and implement Azure network security services | 15-20% |

## Area 1: core networking infrastructure (25-30%)

- **IP addressing:** segmentation and address spaces, subnets for gateways, private endpoints, firewalls, Application Gateway, VNet-integrated services and Bastion, delegation, public IP addresses and prefixes, and custom IP prefixes.
- **Name resolution:** VNet DNS settings, public and private DNS zones and links, and Azure DNS Private Resolver.
- **VNet connectivity and routing:** service chaining and gateway transit, VNet peering, Azure Virtual Network Manager, user-defined routes and forced tunneling, routing diagnostics, Azure Route Server and NAT Gateway.
- **Monitoring:** Network Watcher, Azure Monitor for Networks, DDoS protection, and Defender for Cloud network recommendations including Secure Score, attack path analysis and Cloud Security Explorer.

## Area 2: connectivity services (20-25%)

- **Site-to-site VPN:** high availability, gateway SKU, policy-based vs route-based, local network gateways, IPsec and IKE policies, diagnostics and Azure Extended Network.
- **Point-to-site VPN:** gateway SKU and tunnel type, RADIUS or Microsoft Entra authentication, client configuration files, diagnostics, and requirements for Always On VPN and Azure Network Adapter.
- **ExpressRoute:** connectivity model, SKU and tier, cross-region design, Global Reach, FastPath and ExpressRoute Direct, private and Microsoft peering, gateways, route advertisement, encryption and BFD.
- **Virtual WAN:** SKU and architecture, virtual hubs and scale units, gateways, hub routing and third-party NVAs.

## Area 3: application delivery (15-20%)

- **Load Balancer and Traffic Manager:** requirements to features, SKU and tier, public vs internal, regional vs cross-region, rules, inbound NAT, outbound rules with SNAT, Traffic Manager and Gateway Load Balancer.
- **Application Gateway:** manual vs autoscale, backend pools, health probes, listeners, routing rules, HTTP settings, TLS and rewrite rule sets.
- **Front Door:** tier, routing, origins, endpoints, TLS termination and end-to-end TLS, caching, rules, URL rewrite and redirect, and securing origins with Private Link.

## Area 4: private access (10-15%)

- **Private Link and private endpoints:** planning and creating endpoints, a Private Link service, DNS integration and integration with on-premises clients.
- **Service endpoints:** when to use them, creating them, and service endpoint policies.

## Area 5: network security (15-20%)

- **Network security groups:** NSGs and application security groups, inbound and outbound rules, virtual network flow logs, IP flow verify, NSGs for remote administration with Azure Bastion, and security with Azure Virtual Network Manager.
- **Azure Firewall and Firewall Manager:** SKU selection, deployments, rules, Firewall Manager policies and a secure hub in a Virtual WAN hub.
- **WAF:** deployment design, detection or prevention mode, rule sets for Front Door and Application Gateway, and WAF policies.

## What changed on 27 July 2026

Three minor changes: Design and implement IP addressing for Azure resources, Monitor networks, and implement and manage network security groups. The audience profile and the top-level groups core networking and network security are marked no change, and the table lists no other areas. The page does not say which wording changed.

## A study plan from the weights

The plan is advice derived from the weights, not an official plan.

1. Start with area 1, since it carries 25-30% and the other areas depend on it: address spaces, DNS, peering, routes.
2. Move to area 2 and compare VPN and ExpressRoute choices side by side.
3. Cover area 3 by learning which service fits which requirement.
4. Spend less time on area 4, but do not skip DNS integration for private endpoints.
5. For area 5, practice NSG and firewall rule design.
6. Build small labs. Networking choices are easier to remember after you configure them.
7. Use the new Practice Assessment on AI Skills Navigator that the study guide recommends.
8. Read the study guide again before your exam date.

## Before you book

The study guide has no retirement notice. The exam page shows current price and status, which this guide does not cover.

## Related

- [AZ-700](https://www.m365.fm/entity/az-700/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Virtual network peering](https://www.m365.fm/entity/virtual-network-peering/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)

## Sources

- [Study guide for Exam AZ-700: Designing and Implementing Microsoft Azure Networking Solutions (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-700)
