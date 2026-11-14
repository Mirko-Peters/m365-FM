---
title: "How to Use Microsoft Security Exposure Management to Find Attack Paths"
summary: "What Microsoft Security Exposure Management is and which capabilities help find attack paths: enterprise exposure graph, attack surface map, attack paths, critical asset management, overview dashboard and connectors, with the portal steps the Learn overview does not give."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [microsoft-security-exposure-management, defender]
keypoints:
  - "Security Exposure Management gives a unified view of security posture across endpoints, cloud resources and external attack surfaces. It is available in public cloud only."
  - "Attack paths simulate attack scenarios and show how an attacker could breach the attack surface, including hybrid paths. You can focus on choke points and use recommendations."
  - "Related capabilities are the enterprise exposure graph, the attack surface map, critical asset management and exposure insights."
  - "The overview dashboard has two actions: Resolve Now and Monitor Exposure, with domain initiative scores for Code, Endpoint, Cloud, Identity and SaaS."
  - "The page gives no roles, licenses, onboarding steps or menu path for attack paths, and it links no licensing page."
faq:
  - q: "What is Microsoft Security Exposure Management?"
    a: "A security solution that provides a unified view of security posture across company assets and workloads spanning endpoints, cloud resources and external attack surfaces. It helps teams manage attack surfaces, protect critical assets and mitigate exposure risk."
  - q: "What are attack paths?"
    a: "They simulate attack scenarios and show how an attacker could breach the attack surface, including hybrid paths that span on-premises and cloud. You can focus on choke points and use actionable recommendations to mitigate them."
  - q: "Is it available in sovereign clouds?"
    a: "No. The page says it is available in public cloud only and not in US Gov, China Gov or other sovereign clouds."
  - q: "What do the two dashboard actions mean?"
    a: "Resolve Now lists prioritized Patch, Mitigate and Fix items focused on internet-exposed and business-critical assets. Monitor Exposure shows internet-exposed resources and domain initiative scores."
  - q: "Where are prerequisites and licensing?"
    a: "Not on the overview. The page gives no prerequisites or licensing and links no licensing page. Its links cover vulnerability management integration, posture policies and exemptions."
---

Security Exposure Management, according to the page, simulates attack scenarios and identifies weaknesses that an attacker could exploit across endpoints and cloud resources. This guide follows the Microsoft Learn page What is Microsoft Security Exposure Management? The page describes capabilities. It gives no menu path, roles or licensing, so this guide does not either.

## What it is

Microsoft Security Exposure Management is a security solution that provides a unified view of security posture across company assets and workloads spanning endpoints, cloud resources and external attack surfaces. It enriches asset data with security context to help teams manage attack surfaces, protect critical assets, and explore and mitigate exposure risk. With the Defender for Cloud integration in the Defender portal, it aggregates signals from Azure, AWS and GCP together with on-premises signals. The page says this aligns with the Continuous Threat Exposure Management approach.

It is available in public cloud only. It is not available in US Gov, China Gov or other sovereign clouds.

## Attack paths

Attack paths simulate attack scenarios and show how an attacker could breach the attack surface. They include hybrid paths that span on-premises and cloud. The page says Security Exposure Management generates attack paths from data collected across assets and workloads in multiple environments. You can focus on choke points through which many attack paths flow, including those that bridge on-premises and cloud, and use actionable recommendations to mitigate the identified paths.

## Capabilities that support them

- **Enterprise exposure graph.** Aggregates cloud misconfigurations, multicloud assets and external attack surface data. Graph schemas describe devices, identities, machines, cloud resources and storage. You can run graph queries to explore assets and hunt for threats.
- **Attack surface map.** Visualizes environments and graph queries, including cloud resources and their relationships.
- **Critical asset management.** Marks predefined and customized assets as critical across devices, identities and cloud resources.
- **Exposure insights.** Aggregates security posture data and includes events, recommendations, metrics and security initiatives.
- **Vulnerability management.** Assesses and prioritizes vulnerabilities across devices and cloud resources through Microsoft Defender Vulnerability Management integration.
- **Data connectors.** Consolidate data from third-party sources such as ServiceNow CMDB, Tenable, Qualys and Rapid7.

## Overview dashboard

- **Resolve Now:** prioritized items across Patch, Mitigate and Fix, focused on internet-exposed and business-critical assets.
- **Monitor Exposure:** a real-time view of internet-exposed resources such as cloud assets, devices and shadow resources, and domain initiative scores across Code, Endpoint, Cloud, Identity and SaaS.

## Posture policies and exemptions

The page also says you can tailor posture evaluation. Posture policies define which security recommendations are evaluated and where they apply, starting with the Microsoft-managed MDC Baseline Policy or custom policies. Exemptions exclude findings that do not need remediation, such as false positives, risks covered by another control or accepted risks, and each exemption keeps its scope, justification and review period. Policies and exemptions are currently available for cloud resources in environments managed in Defender.

## Who the page is aimed at

Security and compliance admins, SecOps and partner teams, security architects, and CISOs and security decision makers.

## What the page does not say

- Roles, licenses and onboarding steps. It links no licensing or onboarding page.
- A menu path or click steps for attack paths in the Defender portal.
- An exposure score by that name. It speaks of exposure insights and domain initiative scores.
- How to open security initiatives, recommendations and events.
- Graph query syntax.

## A working outline

This outline is my advice, built on the page.

1. Confirm you are in public cloud, and look elsewhere in Microsoft Learn for roles, licensing and onboarding, since this page has none.
2. Mark your critical assets so that paths are judged against what matters.
3. Look at the attack surface map and the attack paths, and note the choke points.
4. Work the Resolve Now list for internet-exposed and business-critical assets.
5. Add data connectors if your asset data lives in third-party tools.

## Typical mistakes (my advice)

- Planning a rollout in a sovereign cloud.
- Starting without critical assets defined.
- Expecting the overview to give click paths and licensing.
- Treating domain initiative scores as one overall exposure score.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Availability | Public cloud only |
| Attack paths | Simulated attack scenarios, including hybrid paths |
| Graph | Enterprise exposure graph with queryable schemas |
| Map | Attack surface map |
| Dashboard actions | Resolve Now, Monitor Exposure |
| Initiative domains | Code, Endpoint, Cloud, Identity, SaaS |

## Why critical assets come first (my reading)

Critical asset management marks predefined and customized assets as critical across devices, identities and cloud resources. Attack paths are about how an attacker reaches something valuable, so the definition of valuable shapes what you see. The page presents critical asset management as one capability next to the others and does not prescribe an order. Starting with it is practical advice.

## Related

- [Microsoft Security Exposure Management](https://www.m365.fm/entity/microsoft-security-exposure-management/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [KQL](https://www.m365.fm/entity/kql/)

## Sources

- [What is Microsoft Security Exposure Management? (Microsoft Learn)](https://learn.microsoft.com/security-exposure-management/microsoft-security-exposure-management)
