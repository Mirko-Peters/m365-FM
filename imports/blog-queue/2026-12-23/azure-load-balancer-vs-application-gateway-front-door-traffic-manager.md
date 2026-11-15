---
title: "Azure Load Balancer vs Application Gateway vs Front Door vs Traffic Manager"
summary: "Choose between Azure Load Balancer, Application Gateway, Front Door and Traffic Manager using Microsoft's criteria: global or regional, HTTP(S) or not, layer 4 or 7, and the decision flow from the Azure Architecture Center."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [azure-load-balancer, azure-application-gateway, azure-front-door, azure-traffic-manager]
keypoints:
  - "Front Door is global and HTTP(S). Application Gateway is regional and handles HTTP(S), TCP and TLS. Load Balancer is a layer 4 service. Traffic Manager is DNS-based."
  - "Microsoft's comparison table lists Load Balancer as regional or global for non-HTTP(S) and Traffic Manager as global for non-HTTP(S)."
  - "Traffic Manager load balances only at the domain level, so DNS caching and ignored TTL values mean it cannot fail over as fast as Front Door."
  - "Internet-facing multi-region web apps that need acceleration point to Front Door. Adding SSL offload or per-request layer 7 processing adds Application Gateway."
  - "The decision tree is a starting point. Workloads with several services often use more than one load balancing solution."
faq:
  - q: "What is the main difference between these four services?"
    a: "Microsoft's Architecture Center splits them by scope and traffic type. Front Door is global and HTTP(S), Application Gateway is regional and handles HTTP(S), TCP and TLS, Load Balancer is a layer 4 service for TCP and UDP traffic, and Traffic Manager is a DNS-based global load balancer."
  - q: "Why is Traffic Manager slower to fail over than Front Door?"
    a: "The page says Traffic Manager load balances only at the domain level, so it cannot fail over as quickly as Front Door because of common challenges with DNS caching and systems that do not respect TTL values."
  - q: "When do I need Application Gateway behind Front Door?"
    a: "For an internet-facing, multi-region web app that needs SSL offload or per-request application-layer processing, the flow chart combines Front Door with Application Gateway. For API-only hosting it names Front Door with API Management as an option."
  - q: "Is Load Balancer an HTTP load balancer?"
    a: "No. Learn describes Azure Load Balancer as a Layer-4 service that handles inbound and outbound traffic for all UDP and TCP protocols, and the comparison table recommends it for non-HTTP(S) traffic."
  - q: "Does the page say which one is cheapest or best?"
    a: "No. It lists cost, SLA and features and limits as criteria to check yourself and calls its flow chart a starting point that should be followed by a more detailed evaluation."
---

These four services overlap in name but not in job. This comparison follows the Azure Architecture Center's load balancing overview, which categorizes each service and gives a decision flow. It does not rank them, and neither does this article.

## The two ways Microsoft categorizes them

- **Global or regional.** Global services distribute traffic across regional back ends, clouds or on-premises services through a single control plane. Regional services distribute traffic within virtual networks across VMs or zonal and zone-redundant endpoints in a region.
- **HTTP(S) or not.** HTTP(S) load balancers are layer 7 and accept only HTTP(S) traffic, with features such as SSL offload, WAF, path-based routing and session affinity. Non-HTTP(S) services are layer 4 TCP and UDP services, or DNS-based load balancing.

## What each service is

**Azure Front Door.** Described as an application delivery network that provides global load balancing and site acceleration for web applications. It offers layer 7 capabilities such as SSL offload, path-based routing, fast failover and caching.

**Traffic Manager.** A DNS-based traffic load balancer that distributes traffic across global Azure regions. It load balances only at the domain level, so it cannot fail over as quickly as Front Door, because of DNS caching and systems that ignore TTL values.

**Application Gateway.** A proxy load balancer that provides application delivery controller functionality as a managed service. It offers layer 7 load balancing, routing, TLS offloading and WAF, and layer 4 load balancing for TCP and TLS. Learn says to use it to transition traffic from public network space to web servers hosted in private network space within a region.

**Azure Load Balancer.** A layer 4 service that handles inbound and outbound traffic across all UDP and TCP protocols. It is zone redundant and supports regional and cross-region topologies.

## Comparison table

| Service | Global or regional | Recommended traffic |
| --- | --- | --- |
| Azure Front Door | Global | HTTP(S) |
| Traffic Manager | Global | Non-HTTP(S) |
| Application Gateway | Regional | HTTP(S), TCP and TLS |
| Azure Load Balancer | Regional or global | Non-HTTP(S) |

The page's table also lists API Management (HTTP(S) APIs only) and Application Gateway for Containers (HTTP(S), regional).

## Criteria Microsoft lists

- **Traffic type.** Is it a web HTTP(S) application, and is it public facing or private?
- **Global versus regional.** Do you load balance VMs or containers within one virtual network, scale units across regions, or both?
- **Availability.** Review the service level agreement.
- **Cost.** Count the service cost and the operational cost of managing the solution.
- **Features and limits.** Identify the capabilities and service limits of each service.

## Decision flow highlights

From the page's text description of the flow chart (the description of the first path is ambiguous, so check the diagram itself):

- An internet-facing web application that is not global or deployed in multiple regions ends at Application Gateway. One path of the chart ends at Load Balancer.
- Internet-facing, multi-region, with performance acceleration needed: Azure Front Door.
- Internet-facing, multi-region, with SSL offload or per-request application-layer processing: Front Door combined with Application Gateway. For API-only hosting, Front Door with API Management is an option.
- Internet-facing, multi-region, without acceleration or per-request layer 7 needs: Front Door, with the hosting type deciding what is added. PaaS uses Front Door alone, IaaS VMs add Load Balancer and AKS adds the Application Gateway ingress controller.

The page calls the chart a starting point, tells you to do a more detailed evaluation and notes that a workload with several services needing load balancing often uses more than one solution.

## Practical examples (my examples)

| Situation | Service per the page |
| --- | --- |
| Public web app in one region, WAF needed | Application Gateway |
| Public web app across regions, speed matters | Front Door |
| TCP traffic across VMs in a virtual network (my example, the page names no specific workloads) | Load Balancer |
| Non-HTTP service, DNS-level routing across regions | Traffic Manager |

The first two rows follow the flow chart wording, and the WAF mention is my addition from Application Gateway's feature list. The last two follow the table's non-HTTP(S) recommendation. Confirm each against the feature and limit pages before you design.

## Mistakes to avoid (my advice)

- Picking Traffic Manager for HTTP(S) workloads that need fast failover. The page says its DNS basis limits failover speed.
- Treating Application Gateway as global. The table lists it as regional.
- Looking for one service that does everything. Combining services is normal for larger workloads.

## What the page does not give

It gives no pricing and no SLA numbers, and it does not compare WAF capabilities between Application Gateway and Front Door. Check each product's pages for those.

## Related

- [Azure Load Balancer](https://www.m365.fm/entity/azure-load-balancer/)
- [Azure Application Gateway](https://www.m365.fm/entity/azure-application-gateway/)
- [Azure Front Door](https://www.m365.fm/entity/azure-front-door/)
- [Azure Traffic Manager](https://www.m365.fm/entity/azure-traffic-manager/)

## Sources

- [Load Balancing Options (Microsoft Learn)](https://learn.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview)
