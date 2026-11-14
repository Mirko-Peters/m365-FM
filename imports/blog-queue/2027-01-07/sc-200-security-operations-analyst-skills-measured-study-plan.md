---
title: "SC-200 Security Operations Analyst: Skills Measured and Study Plan"
summary: "The SC-200 Microsoft Security Operations Analyst skills outline with domain weights, what each domain covers, the practice assessment named on the study guide, and a study plan built on the outline."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [sc-200, microsoft-sentinel]
keypoints:
  - "The study guide lists three domains: manage a security operations environment (40-45%), respond to security incidents (35-40%) and perform threat hunting (20-25%)."
  - "The skills are measured as of October 21, 2026. A passing score is 700 or greater."
  - "Tools in scope include Microsoft Defender XDR, Defender for Endpoint, Microsoft Sentinel, Purview, Entra ID and Defender for Cloud."
  - "The page names a new Practice Assessment on AI Skills Navigator as the recommended one. The Learn practice assessment is legacy and no longer updated."
  - "Use the outline to plan your study. This guide contains no exam questions."
faq:
  - q: "What does SC-200 cover?"
    a: "The Microsoft study guide lists three domains: manage a security operations environment, respond to security incidents and perform threat hunting. It spans Defender XDR, Defender for Endpoint, Microsoft Sentinel, Purview, Entra ID and Defender for Cloud."
  - q: "How is the exam weighted?"
    a: "Manage a security operations environment is 40-45%, respond to security incidents is 35-40% and perform threat hunting is 20-25%."
  - q: "What score do I need?"
    a: "The study guide says a passing score is 700 or greater."
  - q: "Which practice assessment should I use?"
    a: "The page recommends the new Practice Assessment on AI Skills Navigator. It says the legacy practice assessment on Microsoft Learn is no longer updated."
  - q: "Does the outline include KQL?"
    a: "Yes. Threat hunting includes identifying the right table for a KQL query, identifying threats with KQL and creating Advanced Hunting queries."
---

SC-200 measures how well a security operations analyst can configure, triage and hunt across the Microsoft security stack. The study guide lists three domains. The largest is managing the security operations environment, at 40-45%. This guide summarizes the outline as published on the Microsoft Learn study guide, with skills measured as of October 21, 2026, and then suggests a study order. It contains no exam questions.

## Audience

The page describes a security operations analyst who reduces organizational risk by triaging, responding to incidents, hunting for threats and engineering detections. The role works in multicloud and on-premises environments with Microsoft Defender XDR, Microsoft Sentinel, Microsoft Entra ID, Microsoft Purview and Microsoft Defender for Cloud workload protections. It also involves KQL hunting and automating responses. A passing score is 700 or greater. The page does not show a retirement date for the exam.

## Domain 1: manage a security operations environment (40-45%)

**Configure automation for Defender XDR and Microsoft Sentinel**

- Email and alert notifications in Defender XDR, including tuning, suppression and correlation.
- Defender for Endpoint advanced features, rule settings, custom data collection and security policies, including attack surface reduction rules.
- Automated investigation and response, and automatic attack disruption in Defender XDR.
- Device groups, permissions and automation levels in Defender for Endpoint.
- Automation rules and playbooks in Microsoft Sentinel.

**Configure the Microsoft Sentinel SIEM and platform**

- Sentinel roles.
- Data retention for XDR and Sentinel tables, including Analytics, Data lake and XDR tiers.
- Workbooks, and platform optimization including SOC optimization recommendations.

**Ingest data into Microsoft Sentinel**

- Choose data connectors for Windows logs and security events.
- Windows Security Events via AMA with data collection rules, and Windows Event Forwarding.
- Syslog and CEF via AMA.
- Azure activity logs through Azure Policy and diagnostic settings.
- Threat indicators, and custom log tables.

**Configure detections**

- Custom detection rules with Advanced Hunting in Defender XDR, and how to manage them.
- Analytics rules in Sentinel: scheduled, near-real-time, threat intelligence and machine learning.
- Attack vector coverage with the MITRE ATT&CK matrix, and anomalies in Sentinel.

## Domain 2: respond to security incidents (35-40%)

- **Defender XDR:** investigate and remediate threats from Defender for Office 365, Purview, Defender for Cloud workload protections, Defender for Cloud Apps, Entra ID, Defender for Identity and Sentinel. Investigate with agentic AI, including embedded Microsoft Security Copilot. Investigate multistage, multidomain and lateral movement attacks. Manage incidents with case management.
- **Defender for Endpoint:** device timelines, live response, investigation packages, evidence and entity investigation, and incidents from automatic attack disruption.
- **Microsoft 365 activities:** Purview Audit, content search in Purview eDiscovery and Microsoft Graph activity logs.

## Domain 3: perform threat hunting (20-25%)

- **Defender XDR:** choose the right table for a KQL query, identify threats with KQL, create Advanced Hunting queries, interpret threat analytics, create hunting graphs including blast radius, and analyze entity relationships with Sentinel Graph.
- **Sentinel platform:** create and monitor hunting queries, create and manage KQL jobs in the data lake, create and manage summary rule tables, and hunt with notebooks, including the connection to the Sentinel MCP Server.

## Resources named on the page

- **Practice assessment:** the page recommends the new Practice Assessment on AI Skills Navigator, which it says aligns more closely with the exam. The older Learn practice assessment is no longer updated.
- **Training:** self-paced learning paths, modules and instructor-led courses, linked from the exam page.
- **Exam Prep video** and other Microsoft Learn shows.
- **Documentation:** Microsoft security, Defender XDR, Defender for Cloud and Sentinel documentation.
- **Exam sandbox**, accommodations requests and the community hubs.
- **Renewal:** the page says associate certifications expire annually and can be renewed by passing a free online assessment.

## What the page does not say

Exam length, question count, price, languages, prerequisite certifications, or how many questions each subtopic gets. It gives only domain percentages.

## A study plan

This plan is practical advice based on the weights above.

1. **Weeks 1-3, domain 1.** It carries the most weight. Work through ingestion, detection rules and automation in a Sentinel and Defender lab.
2. **Weeks 4-5, domain 2.** Practice triage across Defender XDR, Defender for Endpoint and Purview, including device timelines and live response.
3. **Week 6, domain 3.** Write KQL daily. Learn which table holds which signal.
4. **Week 7.** Take the practice assessment, review the weak areas against the outline and repeat.

## Typical mistakes

- Spending too little time on domain 1.
- Studying Sentinel without Defender XDR, although both are in scope.
- Reading about KQL without writing queries.
- Using the legacy practice assessment as the main check.

## Related

- [SC-200](https://www.m365.fm/entity/sc-200/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Advanced hunting](https://www.m365.fm/entity/advanced-hunting/)

## Sources

- [Study guide for Exam SC-200: Microsoft Security Operations Analyst (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/sc-200)
