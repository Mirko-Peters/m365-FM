---
title: "Azure Load Balancer SKUs: Standard vs Gateway After the Basic Retirement on September 30, 2025"
summary: "Azure Load Balancer has Basic (retired), Standard and Gateway SKUs. What retired on September 30, 2025, how Standard differs from Basic, what Gateway is for, how chaining works and what to plan when you upgrade, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [azure-load-balancer, network-security-group, azure-virtual-machines]
keypoints:
  - "Basic Load Balancer was retired on September 30, 2025. Learn says Basic resources remain operational but are unsupported and not covered by SLA guarantees."
  - "Standard is the general SKU: zones, 99.99% SLA, TCP, HTTP and HTTPS probes, secure by default, outbound rules and the Global tier."
  - "Gateway is a different SKU for third-party network virtual appliances. It is chained to a Standard load balancer or Standard IP configuration."
  - "Gateway rules are HA port rules only, its frontend IP is private, and it does not work with the Global load balancer tier."
  - "Upgrading is not a drop-in: Standard blocks outbound access by default, needs NSG rules for public IPs and cannot be mixed with Basic IPs."
faq:
  - q: "What happened to Basic Load Balancer?"
    a: "Microsoft Learn says Basic Load Balancer was retired on September 30, 2025 and that you should upgrade to Standard as soon as possible. The upgrade guidance adds that Basic load balancers remain operational after that date, but customers who keep using them accept the risk that the service is unsupported and not covered by SLA guarantees."
  - q: "How do Standard and Basic differ in practice?"
    a: "The SKU page lists, for Standard: IP-based and NIC-based backends, health probes for TCP, HTTP and HTTPS, availability zones, Azure Monitor multi-dimensional metrics, HA ports for internal load balancers, secure by default behavior closed to inbound flows unless a network security group allows them, outbound rules, a 99.99% SLA and a Global tier. Basic is described as open by default, with no zones and no SLA."
  - q: "What is the Gateway Load Balancer SKU for?"
    a: "According to Learn, Gateway Load Balancer is designed for high performance and high availability scenarios with third-party network virtual appliances, for example firewalls, packet analytics, intrusion detection and prevention, traffic mirroring and DDoS protection. It uses VXLAN and keeps flows sticky to one appliance instance so traffic is symmetrical."
  - q: "How does a Gateway Load Balancer connect to my application?"
    a: "You chain a Standard Public Load Balancer frontend or a Standard IP configuration of a virtual machine to the Gateway Load Balancer frontend. Learn says no other configuration, such as UDRs, is then needed, and that you cannot set a Gateway frontend IP as the next hop in a user-defined route."
  - q: "Can I mix Basic and Standard resources during migration?"
    a: "No. Learn says it is not possible to mix Basic and Standard SKU IPs or load balancers, and all public IPs associated with a load balancer and its backend pool members must match. It recommends the automated PowerShell upgrade scripts over a manual portal upgrade."
---

Azure Load Balancer has three SKUs: Basic (retired), Standard and Gateway. Basic was retired on September 30, 2025. Standard is the general-purpose SKU that replaces it. Gateway is a separate SKU for third-party network virtual appliances (NVAs) and does not replace either of the other two. This article follows the SKU, Gateway and upgrade pages on Microsoft Learn.

## What the retirement means

Learn states that Basic Load Balancer was retired on September 30, 2025 and that anyone still using it should upgrade to Standard as soon as possible. The upgrade guidance clarifies two points:

- Basic load balancers remain operational after the retirement date, to give users more time. Customers who keep them accept the risks and acknowledge that the service is unsupported and not covered by SLA guarantees.
- Cloud Services Extended Support (CSES) deployments are not affected. You can still create and use Basic load balancers there, although Learn advises Standard on Azure Resource Manager native resources when possible.

## Standard compared with Basic

| Area | Standard | Basic (retired) |
| --- | --- | --- |
| Scenario | High performance and ultra-low latency at network layer, within and across regions and to availability zones | Small-scale applications that do not need high availability or redundancy |
| Backend type | IP based, NIC based | NIC based |
| Backend pool | Any VMs or scale sets in a single virtual network | VMs in a single availability set or scale set |
| Health probes | TCP, HTTP, HTTPS | TCP, HTTP |
| Availability zones | Zone-redundant or zonal frontends | Not available |
| Public IP | Standard SKU required | Basic SKU required |
| Diagnostics | Azure Monitor multi-dimensional metrics | Not supported |
| HA ports | Available for internal load balancers | Not available |
| Default security | Closed to inbound unless a network security group allows it | Open by default, NSG optional |
| Outbound rules | Declarative outbound NAT configuration | Not available |
| SLA | 99.99% | Not available |
| Global tier | Supported for public load balancers | Not supported |
| Private Link, NAT Gateway, global VNet peering | Supported for Standard internal (and NAT Gateway for both types) | Not supported |

Limitations on the page: a standalone VM, availability set or scale set can reference one SKU, never both. Resource group moves are supported for Standard Load Balancer and Standard Public IP, and subscription moves are not supported for Standard load balancers.

## What the Gateway SKU is

Gateway Load Balancer is designed for high performance and high availability with third-party NVAs. Learn lists scenarios such as firewalls, advanced packet analytics, intrusion detection and prevention systems, traffic mirroring, DDoS protection and custom appliances. It provides the bump-in-the-wire technology so that traffic to and from a public endpoint goes to the appliance before the application.

Technical points from the page:

- Traffic to and from a Gateway Load Balancer uses the VXLAN protocol. The source IP is preserved when traffic returns to the consumer.
- Flow stickiness keeps packets on the same appliance in both directions, so flows are symmetrical.
- The frontend IP is private only. Rules can only be HA port rules, and one rule can be associated with up to two backend pools. Each backend pool can have up to two tunnel interfaces, internal or external.
- It supports inbound and outbound inspection. For outbound, you chain the Gateway load balancer to the frontend IP configurations selected in the outbound rules.
- Limitations: it does not work with the Global load balancer tier, and cross-tenant chaining is not supported through the Azure portal.

### Chaining

You chain a Standard Public Load Balancer, or a Standard IP configuration of a virtual machine, to a Gateway Load Balancer by referencing its frontend IP configuration. After chaining, you need no UDRs. You cannot configure a Gateway frontend IP as a UDR next hop. For cross-tenant chains, users need permission for the resource provider operation `Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action` and guest access to the subscription of the Gateway Load Balancer.

## Standard or Gateway

They answer different questions, so you often use both:

| Question | Answer from Learn |
| --- | --- |
| Distribute traffic to my application VMs | Standard |
| Insert third-party appliances in the path | Gateway, chained to a Standard resource |
| Need zones and an SLA | Standard |
| Need cross-region load balancing | Standard with the Global tier. Gateway does not work with it |

## Upgrading from Basic

Learn recommends this approach: learn the differences, identify the Basic load balancers, plan downtime, migrate with the automated PowerShell scripts or create a new Standard load balancer with the same configuration, verify traffic and delete the Basic resource. It calls the scripts the recommended option because of the number of steps in a manual upgrade.

If you upgrade manually, Learn warns:

- Set all public IPs for the load balancer and backend VMs to static first. If you disassociate a public IP before changing it to static, the address may be lost.
- Basic and Standard IPs and load balancers cannot be mixed.
- Standard public IPs are secure by default, so a network security group must allow traffic.
- Standard load balancers block outbound access by default. A public load balancer needs an outbound rule. For private ones, configure a NAT Gateway on the backend subnet or add instance-level public IPs.
- Validate the recreated configuration, but live traffic can only be validated after cutover. Do not delete the Basic resource if the Standard configuration does not validate.

## A planning order (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Inventory Basic load balancers and their public IP SKUs first.
2. Decide how outbound traffic will work after the move. That is the most common surprise, since Standard blocks it by default.
3. Prepare NSG rules before cutover.
4. Add Gateway Load Balancer only if you have an appliance use case.

## Related

- [Azure Load Balancer](https://www.m365.fm/entity/azure-load-balancer/)
- [Network security group (NSG)](https://www.m365.fm/entity/network-security-group/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Azure Load Balancer SKUs (Microsoft Learn)](https://learn.microsoft.com/azure/load-balancer/skus)
- [Gateway load balancer (Microsoft Learn)](https://learn.microsoft.com/azure/load-balancer/gateway-overview)
- [Upgrading from Basic Load Balancer - Guidance (Microsoft Learn)](https://learn.microsoft.com/azure/load-balancer/load-balancer-basic-upgrade-guidance)
