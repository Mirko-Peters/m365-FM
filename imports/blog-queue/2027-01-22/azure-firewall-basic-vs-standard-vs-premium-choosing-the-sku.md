---
title: "Azure Firewall Basic vs Standard vs Premium: Choosing the Right SKU"
summary: "Compare Azure Firewall Basic, Standard and Premium using Microsoft Learn: throughput, threat intelligence mode, DNS proxy, web categories, TLS inspection, IDPS and URL filtering, the policy SKU rule, and how pricing is structured."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [azure-firewall, azure-monitor]
keypoints:
  - "Learn lists autoscale limits of up to 250 Mbps for Basic, up to 30 Gbps for Standard and up to 100 Gbps for Premium."
  - "Basic has no DNS proxy, no network-level FQDN filtering and no web categories, and its threat intelligence runs in alert mode only."
  - "Standard adds DNS proxy, custom DNS, network FQDN filtering, web categories and threat intelligence with alert and deny."
  - "Premium adds TLS inspection, IDPS, URL filtering and web categories that evaluate the whole URL."
  - "Pricing has a per-hour deployment charge and a per-gigabyte data processing charge. Cost rises from Basic to Standard to Premium."
faq:
  - q: "What is the throughput of each Azure Firewall SKU?"
    a: "The Microsoft Learn comparison lists cloud scalability of up to 250 Mbps for Basic, up to 30 Gbps for Standard and up to 100 Gbps for Premium. Fat flow support is listed as not applicable for Basic, 1 Gbps for Standard and 10 Gbps for Premium."
  - q: "Which SKU do I need for DNS proxy or web categories?"
    a: "Standard or Premium. The features-by-SKU page lists DNS proxy with custom DNS and web content filtering by web categories as available in Standard and Premium, and not in Basic. Basic limitations on that page also name network FQDN filtering and web categories as unsupported."
  - q: "What does Premium add over Standard?"
    a: "Per Learn, Premium adds outbound and east-west TLS inspection, a fully managed signature-based IDPS, URL filtering of the full path, and web categories matched on the entire URL. Inbound TLS inspection is handled by Azure Application Gateway rather than the firewall."
  - q: "Does Basic block traffic from known malicious addresses?"
    a: "Not by itself. The Basic features page says threat intelligence-based filtering in Basic only provides alerts and cannot deny traffic. Standard and Premium support alert and deny."
  - q: "Do I need to match the firewall policy to the SKU?"
    a: "For web categories on Premium, yes. The Premium implementation guide says web categories are only available in firewall policies and that the policy SKU must match the firewall instance SKU, for example a Premium instance requires a Premium policy."
---

Azure Firewall comes in three SKUs: Basic, Standard and Premium. Microsoft Learn describes Basic as an entry option with throughput up to 250 Mbps, Standard as Layer 3 to Layer 7 filtering with autoscaling up to 30 Gbps, and Premium as the option for highly sensitive applications such as payment processing. This article compares them using the SKU chooser, the features-by-SKU page and the Premium implementation guide.

## Quick comparison

| Feature | Basic | Standard | Premium |
| --- | --- | --- | --- |
| Scalability | Up to 250 Mbps | Up to 30 Gbps | Up to 100 Gbps |
| Fat flow support | N/A | 1 Gbps | 10 Gbps |
| Stateful firewall (5-tuple), SNAT and DNAT | Yes | Yes | Yes |
| Application FQDN filtering (SNI based) | Yes | Yes | Yes |
| Network-level FQDN filtering | No | Yes | Yes |
| Threat intelligence | Alert only | Alert and deny | Alert and deny |
| DNS proxy and custom DNS | No | Yes | Yes |
| Web categories | No | Yes (FQDN based) | Yes (full URL) |
| URL filtering | No | No | Yes |
| Outbound TLS inspection | No | No | Yes |
| IDPS | No | No | Yes |
| Multiple public IP addresses | Yes | Up to 250 | Up to 250 |
| Forced tunneling | Yes | Yes | Yes |
| Deployment without public IP in forced tunnel mode | No | Yes | Yes |

All three SKUs share built-in high availability, availability zones, central management through Firewall Manager, policy analytics, full logging with SIEM integration, service tags and FQDN tags, and DevOps integration through REST, PowerShell, CLI, templates and Terraform. Learn also says all SKUs are PCI, SOC and ISO compliant.

## Basic

Learn positions Basic for small and medium-sized businesses that need essential protection at an affordable price. Its listed limitations are throughput limited to 250 Mbps, no DNS proxy (it uses Azure DNS only), threat intelligence in alert mode only, no network FQDN filtering and no web categories.

## Standard

Standard includes all Basic features plus unrestricted cloud scalability, network-level FQDN filtering for any TCP or UDP protocol, threat intelligence with alert and deny, DNS proxy, custom DNS, web categories, and deployment without a public IP address in forced tunnel mode. Learn notes that DNS proxy is crucial for reliable FQDN filtering in network rules.

Its limitations compared with Premium: no TLS inspection, no IDPS, no URL filtering (FQDN only), FQDN-based categorization, and a 30 Gbps ceiling.

## Premium

Premium includes all Standard features plus the following, per the features and implementation pages:

- **TLS inspection.** Decrypts outbound traffic, processes it, re-encrypts it and sends it to the destination, using a customer-provided CA certificate to create an on-the-fly certificate. Learn lists outbound and east-west use cases. Inbound TLS inspection is a use case of Azure Web Application Firewall on Application Gateway.
- **IDPS.** Signature-based, applied to inbound, spoke-to-spoke and outbound traffic. Learn gives over 67,000 rules in more than 50 categories, 20 to 40+ new rules released daily and customization of up to 10,000 rules. Signature modes are Disabled, Alert and Alert and Deny. An IDPS bypass list can exclude IP addresses, ranges and subnets. Learn says the bypass list is not meant to improve throughput.
- **URL filtering.** Considers the entire URL, such as a path under a domain, for HTTP and HTTPS. For HTTPS, TLS inspection must be enabled at the application rule level.
- **Advanced web categories.** Learn's example: for an HTTPS request to a news path on a search engine domain, Standard sees only the FQDN and categorizes it as Search Engine, while Premium sees the full URL and categorizes it as News.
- **PCI DSS capabilities.** Premium provides the capabilities payment processing environments typically need, such as TLS inspection and IDPS. The page says the PCI DSS Level 1 certification itself applies to Azure Firewall across all SKUs.

### Premium details worth knowing

- The categories Education, Finance, Government and Health and medicine do not support TLS termination. To support termination for specific URLs, add them manually in application rules.
- Web categories exist only in firewall policies, and the policy SKU must match the firewall instance SKU.
- Using Web Category Check needs Microsoft.Network/azureWebCategories/* access at the subscription level.
- Learn says TLS 1.0 and 1.1 are being deprecated and recommends moving to TLS 1.2.

## What does it cost

Learn says each SKU has two cost components: a fixed deployment charge per firewall per hour and a variable data processing charge per gigabyte. Overall cost increases from Basic to Standard to Premium, and rates vary by region. The page gives no prices, so use the Azure pricing page and calculator it links. Its advice is to choose the lowest SKU that meets your security and throughput requirements.

## How I would decide (my advice)

This is my suggestion, not a Microsoft recommendation:

1. Start with throughput. If you expect more than 250 Mbps, Basic is out.
2. Ask whether you need to deny known-bad traffic. If yes, Basic's alert-only threat intelligence does not meet that, and Standard does.
3. Check whether your rules need FQDNs on non-HTTP protocols or a DNS proxy. Those are Standard features.
4. Choose Premium only for a concrete need: TLS inspection, IDPS, full URL filtering or a payment or healthcare environment. Plan the CA certificate work before you start, since TLS inspection depends on it.
5. Decide the policy SKU together with the firewall SKU, so they match.

## What the pages do not settle

The SKU chooser has a flow chart that I could only read as an image, so I do not reproduce it. For migration between SKUs I read no page, so I give no steps.

## Related

- [Azure Firewall](https://www.m365.fm/entity/azure-firewall/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Choose the right Azure Firewall SKU to meet your needs (Microsoft Learn)](https://learn.microsoft.com/azure/firewall/choose-firewall-sku)
- [Azure Firewall features by SKU (Microsoft Learn)](https://learn.microsoft.com/azure/firewall/features-by-sku)
- [Azure Firewall Premium features implementation guide (Microsoft Learn)](https://learn.microsoft.com/azure/firewall/premium-features)
