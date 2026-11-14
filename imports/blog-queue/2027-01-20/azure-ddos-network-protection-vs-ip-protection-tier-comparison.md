---
title: "Azure DDoS Network Protection vs IP Protection: Tier Comparison"
summary: "Azure DDoS Network Protection and IP Protection share the same core features. The differences per Microsoft Learn: Basic public IPs, rapid response, cost protection, WAF discount and pricing model, plus shared limitations."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [azure-ddos-protection, azure-firewall, azure-load-balancer]
keypoints:
  - "Both tiers offer always-on monitoring, L3/L4 automatic mitigation, metrics and alerts, mitigation reports and flow logs, and Microsoft Sentinel integration."
  - "Only Network Protection offers DDoS rapid response support, cost protection and the WAF discount."
  - "IP Protection does not protect Public IP Basic tier resources. Network Protection does."
  - "Pricing differs by model: per protected IP for IP Protection, per 100 protected IP addresses for Network Protection."
  - "Neither tier covers layer 7. Learn says web applications need a WAF for application-layer protection."
faq:
  - q: "What is the difference between DDoS Network Protection and IP Protection?"
    a: "According to Microsoft Learn, IP Protection has the same core engineering features as Network Protection but differs in value-added services: DDoS rapid response support, cost protection and discounts on WAF are not available in IP Protection. Network Protection also protects Public IP Basic tier resources, while IP Protection does not."
  - q: "How is each tier priced?"
    a: "The tier comparison page lists the price as per protected IP for DDoS IP Protection and per 100 protected IP addresses for DDoS Network Protection. The overview adds that a single DDoS protection plan for Network Protection can be used across multiple subscriptions in a tenant, and that IP Protection needs no plan. Amounts are on the Azure pricing page."
  - q: "Does DDoS protection cover layer 7 attacks?"
    a: "No. The overview says Azure DDoS Protection protects at network layers 3 and 4. For web applications you need protection at layer 7 by adding a web application firewall, such as the Application Gateway WAF SKU or a third-party WAF."
  - q: "Is anything protected without enabling either tier?"
    a: "Learn notes that, at no additional cost, Azure DDoS infrastructure protection protects every Azure service that uses public IPv4 and IPv6 addresses, including PaaS services such as Azure DNS. It needs no configuration or application changes."
  - q: "What are the shared limitations?"
    a: "Learn lists, for both tiers: multitenant PaaS services such as Azure App Service Environment for Power Apps, API Management outside the virtual network integration mode and Azure Virtual WAN are not supported, a public IP attached to a NAT Gateway cannot be protected, and Classic or RDFE virtual machines are not supported."
---

Azure DDoS Network Protection and DDoS IP Protection share the same core engineering features. The documented differences are four: Public IP Basic tier protection, DDoS rapid response support, cost protection and the WAF discount exist only in Network Protection, and the price model differs. This article follows the tier comparison and overview pages on Microsoft Learn.

## The two tiers in one paragraph

Azure DDoS Protection supports two tier types: DDoS IP Protection and DDoS Network Protection. You choose the tier in the Azure portal during the workflow where you configure DDoS Protection. Network Protection is automatically tuned to protect your Azure resources in a virtual network, and enabling it protects all resources on that virtual network. IP Protection is a pay-per-protected-IP model that you enable on a public IP resource.

## Feature comparison

Learn's table, condensed:

| Feature | IP Protection | Network Protection |
| --- | --- | --- |
| Active traffic monitoring and always-on detection | Yes | Yes |
| L3/L4 automatic attack mitigation | Yes | Yes |
| Application based mitigation policies | Yes | Yes |
| Metrics and alerts | Yes | Yes |
| Mitigation reports | Yes | Yes |
| Mitigation flow logs | Yes | Yes |
| Mitigation policies tuned to the customer's application | Yes | Yes |
| Integration with Firewall Manager | Yes | Yes |
| Microsoft Sentinel data connector and workbook | Yes | Yes |
| Protection of resources across subscriptions in a tenant | Yes | Yes |
| Public IP Standard tier protection | Yes | Yes |
| Public IP Basic tier protection | No | Yes |
| DDoS rapid response support | Not available | Yes |
| Cost protection | Not available | Yes |
| WAF discount | Not available | Yes |
| Price | Per protected IP | Per 100 protected IP addresses |

Read the table from the bottom. The first eleven rows are the same. The last five are the decision.

## What the differing features mean

- **DDoS rapid response:** during an active attack, customers with Network Protection have access to the DDoS Rapid Response team, who can help with investigation during the attack and analysis afterward.
- **Cost protection:** Learn's overview calls it a cost guarantee: you receive data-transfer and application scale-out service credit for resource costs incurred as a result of documented DDoS attacks.
- **WAF discount:** listed in the comparison as available only with Network Protection. The pages I read do not state the amount, so check the pricing page.
- **Public IP Basic tier:** IP Protection does not support it, which is listed as the one additional limitation of IP Protection.

## What both tiers do

The overview lists these key features: always-on traffic monitoring, adaptive real-time tuning, and analytics, metrics and alerting. Azure applies three auto-tuned mitigation policies, TCP SYN, TCP and UDP, to each public IP of a protected resource. The thresholds are set through machine learning based traffic profiling, and mitigation happens for an IP under attack only when a policy threshold is exceeded. Attack analytics give reports in five-minute increments during an attack and a summary after it. Metrics are available through Azure Monitor, and alerts can be set for the start, stop and duration of an attack. Flow logs can be streamed to Microsoft Sentinel or to an offline SIEM.

## Pricing model

For Network Protection, a single DDoS protection plan under a tenant can be used across multiple subscriptions, so you do not need more than one plan. For IP Protection there is no plan, and you can enable it on any public IP resource. Learn points to the Azure DDoS Protection pricing page for amounts, and I do not quote any here.

## Limitations that apply to both

- Multitenant PaaS services, including Azure App Service Environment for Power Apps, Azure API Management in deployment modes other than API Management with virtual network integration, and Azure Virtual WAN, are not currently supported.
- A public IP resource attached to a NAT Gateway cannot be protected.
- Virtual machines in Classic/RDFE deployments are not supported.
- A VPN gateway or virtual network gateway is protected by a DDoS policy, but adaptive tuning is not supported at this stage.
- Protection of a public IP address prefix linked to a public load balancer frontend is supported with the Network Protection tier.
- DDoS telemetry for individual VM instances in Virtual Machine Scale Sets is available with Flexible orchestration mode.

A single VM behind a public IP is supported but not recommended, according to the note on the page.

## Free baseline and layer 7

Azure DDoS infrastructure protection comes at no additional cost for every Azure service with public IPv4 and IPv6 addresses. It needs no configuration. The paid tiers add the monitoring, tuning, reporting and support features above, applied to your own resources.

Both tiers protect at layers 3 and 4. For web applications at layer 7, add a web application firewall. Learn names the Application Gateway WAF SKU and third-party WAFs from the Azure Marketplace. The overview also lists DDoS Protection as one of the Network Security services next to Azure Firewall and Azure Web Application Firewall, each with its own use cases.

## How to choose (my advice)

This is my reading of the documented differences, not a Microsoft recommendation:

1. If you have Public IP Basic tier resources you need to protect, only Network Protection covers them.
2. If rapid response during an attack, cost protection or the WAF discount matter, you need Network Protection.
3. If you protect a few public IPs and none of those three matters, IP Protection offers the same core detection and mitigation.
4. Compare the two price models for your number of public IPs on the pricing page. The per-100-IP unit of Network Protection suits larger counts.

## Related

- [Azure DDoS Protection](https://www.m365.fm/entity/azure-ddos-protection/)
- [Azure Firewall](https://www.m365.fm/entity/azure-firewall/)
- [Azure Load Balancer](https://www.m365.fm/entity/azure-load-balancer/)

## Sources

- [About Azure DDoS Protection Tier Comparison (Microsoft Learn)](https://learn.microsoft.com/azure/ddos-protection/ddos-protection-sku-comparison)
- [Azure DDoS Protection Overview (Microsoft Learn)](https://learn.microsoft.com/azure/ddos-protection/ddos-protection-overview)
