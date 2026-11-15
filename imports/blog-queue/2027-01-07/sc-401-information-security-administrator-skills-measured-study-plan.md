---
title: "SC-401 Information Security Administrator: Skills Measured and Study Plan"
summary: "The SC-401 Administering Information Security in Microsoft 365 skills outline with domain weights, what each domain covers, the resources named on the study guide, and a study plan built on the outline."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [sc-401, purview]
keypoints:
  - "The study guide lists three domains, each weighted 30-35%: implement information protection, implement data loss prevention and retention, and manage risks, alerts and activities."
  - "The skills are measured as of October 28, 2026. A passing score is 700 or greater."
  - "Topics include sensitivity labels, sensitive info types, DLP, Endpoint DLP, retention, Insider Risk Management, Purview Audit and DSPM for AI."
  - "The page names a free practice assessment, training paths, documentation, an exam sandbox and renewal through a free online assessment."
  - "Use the outline to plan study. This guide contains no exam questions."
faq:
  - q: "What does SC-401 cover?"
    a: "The Microsoft study guide lists three domains: implement information protection, implement data loss prevention and retention, and manage risks, alerts and activities. It centers on Microsoft Purview and related services."
  - q: "How is the exam weighted?"
    a: "Each of the three domains is weighted 30-35%, so no single area dominates."
  - q: "What score do I need?"
    a: "The study guide says a passing score is 700 or greater."
  - q: "Does the exam cover AI?"
    a: "Yes. Domain 3 includes a section on protecting data used by AI services, with DSPM for AI prerequisites, roles, policies and monitoring."
  - q: "Is there a retirement date?"
    a: "The study guide page does not show a retirement date. It gives the skills measured as of October 28, 2026."
---

SC-401 tests whether you can plan and implement information protection, data loss prevention, retention and insider risk controls in Microsoft 365. The study guide splits the exam into three domains of equal weight, 30-35% each. This guide summarizes the outline as published on the Microsoft Learn study guide, with skills measured as of October 28, 2026, and adds a study order. It contains no exam questions.

## Audience

The page describes an information security administrator who plans and implements information security for sensitive data using Microsoft Purview and related services. The role mitigates internal and external risks to data in Microsoft 365 collaboration, protects data used by AI services, and implements information protection, DLP, retention and insider risk management. It also manages alerts and activities and takes part in incident response. It also describes working with governance, data and security roles and with workload administrators and business application owners, and it expects familiarity with all Microsoft 365 services, PowerShell, Microsoft Entra, the Microsoft Defender portal and Microsoft Defender for Cloud Apps. A passing score is 700 or greater. The page shows no retirement date.

## Domain 1: implement information protection (30-35%)

**Data classification**

- Identify sensitive information requirements and translate them into built-in or custom sensitive info types.
- Document fingerprinting and exact data match (EDM) sensitive info types.
- Trainable classifiers.
- Data explorer and Content explorer for monitoring classification and label usage.
- Optical character recognition (OCR) support for sensitive info types.

**Sensitivity labels in Microsoft Purview**

- Roles and permissions for label administration.
- Label creation for items and containers, protection settings and content marking.
- Publishing policies and auto-labeling policies.
- Labels on containers such as Teams, Microsoft 365 Groups and SharePoint sites, and on Power BI items.
- Labels through Microsoft Defender for Cloud Apps.

**Windows, file shares and Exchange**

- The Microsoft Purview Information Protection client and scanner, including bulk classification of on-premises data.
- Microsoft Purview Message Encryption and Advanced Message Encryption.

## Domain 2: implement data loss prevention and retention (30-35%)

**DLP policies**

- Design, roles and permissions, creation and management.
- DLP for Adaptive Protection and policy and rule precedence.
- File policies in Defender for Cloud Apps built with a DLP policy.

**Endpoint DLP**

- Device requirements including extensions, advanced DLP rules for devices and Endpoint DLP settings.
- Just-in-time protection and monitoring endpoint activities.

**Retention**

- Plan retention and disposition with retention labels.
- Adaptive policy scopes, retention label policies that publish or auto-apply labels, and retention policies.
- Interpret policy precedence, including Policy lookup, and recover retained content.

## Domain 3: manage risks, alerts and activities (30-35%)

**Insider Risk Management**

- Roles, connectors, Defender for Endpoint integration and settings.
- Policy indicators, templates, policies and forensic evidence settings.
- Insider risk levels for Adaptive Protection.
- Alerts, cases and the workflow, including notice templates.

**Alerts and activities**

- Assign Purview Audit (Premium) licenses, investigate with Purview Audit and configure audit retention policies.
- Activity explorer, DLP alert response, insider risk investigation, Purview alerts in Defender XDR and Defender for Cloud Apps file policy alerts.
- Searches with eDiscovery.

**Protect data used by AI services**

- Controls in Purview and in Microsoft 365 productivity workloads for environments that use AI services.
- DSPM for AI prerequisites, roles and permissions, policies and monitoring.

## Resources named on the page

- A free practice assessment.
- Self-paced learning paths and modules, and instructor-led courses.
- Documentation: Microsoft security, Microsoft Purview, DLP, Defender for Cloud, the Zero Trust Guidance Center and governance, risk and compliance in Azure.
- The exam sandbox, Microsoft Q&A, the community hubs, the Exam Readiness Zone and accommodations requests.
- Renewal through a free online assessment on Microsoft Learn. The page says associate, expert and specialty certifications expire annually.

The change log lists one minor change, to the sensitivity labels section. The audience profile and the top-level group Implement information protection are marked no change, and the table lists no other rows.

## What the page does not say

Exam length, question count, price, prerequisites, and the weight of individual subtopics. Only the domain percentages are given.

## A study plan

This plan is my advice, built on the weights.

1. **Weeks 1-2, domain 1.** Build sensitive info types, then labels and auto-labeling in a test tenant.
2. **Weeks 3-4, domain 2.** Create DLP policies, then Endpoint DLP and retention labels. Study precedence rules.
3. **Weeks 5-6, domain 3.** Set up Insider Risk Management, audit retention and DSPM for AI.
4. **Week 7.** Take the free practice assessment and revisit weak areas against the outline.

## Typical mistakes (my advice)

- Studying only labels and neglecting retention and Insider Risk Management.
- Reading about DLP precedence without testing overlapping policies.
- Skipping the AI protection section.
- Using the outline as a list of terms instead of tasks to practice.

## Related

- [SC-401](https://www.m365.fm/entity/sc-401/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Insider Risk Management](https://www.m365.fm/entity/insider-risk-management/)

## Sources

- [Study guide for Exam SC-401: Administering Information Security in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/sc-401)
