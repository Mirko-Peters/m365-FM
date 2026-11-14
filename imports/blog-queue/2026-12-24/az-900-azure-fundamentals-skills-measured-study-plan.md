---
title: "AZ-900 Azure Fundamentals: Skills Measured and Study Plan"
summary: "The AZ-900 skills measured outline from Microsoft Learn as of July 20, 2026: three domains with weightings and topics, language notes, and a study plan ordered by weight. No exam questions."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [az-900]
keypoints:
  - "The Learn study guide is dated skills measured as of July 20, 2026. The passing score is 700 or greater."
  - "Describe Azure architecture and services is the largest domain at 35 to 40 percent, then management and governance at 30 to 35 and cloud concepts at 25 to 30."
  - "Legacy practice assessments on Microsoft Learn are no longer updated. The page recommends the Practice Assessment on AI Skills Navigator instead."
  - "The page does not say the exam is retiring."
  - "If the exam is not offered in your language you can request an additional 30 minutes, and localized versions are typically updated about eight weeks after English."
faq:
  - q: "What are the AZ-900 domains and weights?"
    a: "Microsoft Learn lists three: describe cloud concepts at 25 to 30 percent, describe Azure architecture and services at 35 to 40 percent, and describe Azure management and governance at 30 to 35 percent."
  - q: "How current is the outline?"
    a: "The study guide I read is labelled skills measured as of July 20, 2026. Check the page before booking because Microsoft revises the outline."
  - q: "Is AZ-900 retiring?"
    a: "The study guide does not state that the exam is retiring. It does say that legacy practice assessments on Microsoft Learn are no longer being updated."
  - q: "What is the passing score?"
    a: "700 or greater, according to the study guide."
  - q: "Which topics sit under management and governance?"
    a: "Cost management with the pricing calculator and tags, governance and compliance with Microsoft Purview, Azure Policy and resource locks, managing and deploying resources with the portal, Cloud Shell, CLI, PowerShell, Azure Arc and ARM templates, and monitoring with Advisor, Service Health and Azure Monitor."
---

AZ-900 is Microsoft's entry-level Azure exam. This article summarizes the skills measured outline from the Microsoft Learn study guide dated July 20, 2026, and uses the weights to build a study plan. It contains no exam questions.

## Exam facts from the study guide

- Passing score: 700 or greater.
- The English exam is updated first, and localized versions are typically updated about eight weeks later, though this schedule isn't always met.
- If the exam isn't available in your preferred language, you can request an additional 30 minutes.
- Legacy practice assessments on Microsoft Learn are no longer being updated. The page recommends the new Practice Assessment on AI Skills Navigator.
- The page does not state that the exam itself is retiring.

## Domain 1: cloud concepts (25 to 30%)

- Cloud computing: definition, shared responsibility model, public, private and hybrid models with use cases, the consumption-based model, pricing models and serverless.
- Benefits of cloud: high availability and scalability, reliability and predictability, security and governance, manageability.
- Service types: IaaS, PaaS and SaaS, with use cases for each.

## Domain 2: Azure architecture and services (35 to 40%)

- **Core architecture:** regions, region pairs, sovereign regions, availability zones, datacenters, resources and resource groups, subscriptions and management groups and their hierarchy.
- **Compute and networking:** container, VM and function compute types, VM options (virtual machines, scale sets, availability sets, Azure Virtual Desktop), VM resource requirements, app hosting options, virtual networking (VNets, subnets, peering, Azure DNS, VPN Gateway, ExpressRoute), public and private endpoints.
- **Storage:** Azure Storage services, tiers, redundancy options, account types, file transfer tools (AzCopy, Storage Explorer, Azure File Sync) and migration options (Azure Migrate, Azure Data Box).
- **Identity, access and security:** Microsoft Entra ID and Entra Domain Services, authentication (SSO, MFA, passwordless), external identities, Conditional Access, RBAC, Zero Trust, defense-in-depth and Microsoft Defender for Cloud.

## Domain 3: management and governance (30 to 35%)

- **Cost management:** cost factors, the pricing calculator, cost management capabilities and tags.
- **Governance and compliance:** Microsoft Purview, Azure Policy and resource locks.
- **Managing and deploying resources:** the Azure portal, Cloud Shell, Azure CLI, Azure PowerShell, Azure Arc, infrastructure as code, Azure Resource Manager and ARM templates.
- **Monitoring:** Azure Advisor, Azure Service Health and Azure Monitor with Log Analytics, alerts and Application Insights.

## Study plan by weight

| Priority | Domain | Weight |
| --- | --- | --- |
| 1 | Azure architecture and services | 35 to 40% |
| 2 | Management and governance | 30 to 35% |
| 3 | Cloud concepts | 25 to 30% |

Weights are ranges, so use them to split study time, not to predict question counts.

### A three-week outline

This is a suggestion based on the weights, not a Microsoft recommendation.

1. **Week 1: concepts, then core architecture.** Learn the shared responsibility model and IaaS, PaaS and SaaS, then the geography and hierarchy topics.
2. **Week 2: compute, networking, storage and identity.** This is the biggest block, so work through each service family and keep notes on when to use which.
3. **Week 3: governance, management and monitoring.** Cover cost tools, Policy and locks, deployment tools and the monitoring services, then review weak spots.

## Tips

These tips are my advice, not part of the study guide.

- Practice with the Azure portal and Cloud Shell in a free or sandbox subscription where possible, because several topics are tools.
- Learn related services in pairs, such as Azure Policy and resource locks, so you can explain the difference.
- Use current product names, for example Microsoft Entra ID and Microsoft Defender for Cloud.
- Check the study guide again shortly before your exam date.

## What the page does not cover

The part of the guide I read does not give exam duration, question count or price, and it does not list available languages. The exam details page covers scheduling.

## How to use the outline

Print the three domain lists and mark each bullet as known, unsure or new. Spend the first sessions on the new items in the largest domain, then return to the unsure items. This is a suggestion for self-study and not part of the Microsoft study guide.

Because the outline is dated, compare the date on the live page with the July 20, 2026 date used here. If the date has changed, review the change log at the bottom of the page before you rely on this summary.

## Related

- [AZ-900](https://www.m365.fm/entity/az-900/)

## Sources

- [Study guide for Exam AZ-900: Microsoft Azure Fundamentals (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-900)
