---
title: "AB-900 Exam Guide: Microsoft 365 Copilot and Agent Administration Fundamentals"
summary: "The AB-900 skills measured outline from Microsoft Learn, as of October 14, 2026, with weights for core services, data protection and governance, and Copilot and agent administration, plus a study plan."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [ab-900, copilot, sharepoint-advanced-management, microsoft-365-admin-center]
keypoints:
  - "AB-900 skills measured are dated October 14, 2026, and the passing score is 700 or greater. The study guide lists no prerequisites."
  - "Data protection and governance for Microsoft 365 and Copilot weighs most at 35 to 40 percent, including Purview, Copilot data access and SharePoint oversharing."
  - "Core features and objects of Microsoft 365 services is 30 to 35 percent, with a strong identity and security slice."
  - "Basic administrative tasks for Copilot and agents is 25 to 30 percent: licenses, pay-as-you-go billing, usage monitoring, prompts and agent approval."
  - "Most questions cover generally available features, though commonly used preview features may appear."
faq:
  - q: "Who is AB-900 for?"
    a: "Microsoft Learn says candidates should be familiar with Microsoft 365 core services, security, identity, data protection and governance, plus Copilot and agents, and with admin centers such as Exchange Online, SharePoint, Teams, Entra and Purview. Experience with AI-driven productivity tools and modern IT management is expected."
  - q: "How is the exam weighted?"
    a: "According to the Learn study guide: identify the core features and objects of Microsoft 365 services 30 to 35 percent, understand data protection and governance tasks for Microsoft 365 and Copilot 35 to 40 percent, and perform basic administrative tasks for Copilot and agents 25 to 30 percent."
  - q: "Does AB-900 cover SharePoint oversharing?"
    a: "Yes. The skills measured include identifying tools to troubleshoot oversharing, running a data access governance report in SharePoint, and understanding SharePoint Advanced Management features, including restricted access control."
  - q: "Does the exam include billing topics?"
    a: "The skills measured list comparing the Copilot monthly license model with pay-as-you-go, including SharePoint, and monitoring and managing Copilot pay-as-you-go billing policies. They don't list prices, so learn the models rather than amounts."
  - q: "Is there a practice assessment?"
    a: "The study guide page I read does not mention a practice assessment. It links to an exam sandbox for exploring the exam environment, and it points to self-paced learning paths, instructor-led courses and documentation."
---

AB-900 is the entry-level exam for people who administer Microsoft 365 Copilot and agents. It mixes core Microsoft 365 knowledge, data protection and governance, and basic Copilot and agent administration. This guide follows the official skills measured outline and contains no exam questions.

## Exam facts

From the Learn study guide:

- **Exam:** Microsoft 365 Copilot and Agent Administration Fundamentals.
- **Skills measured as of:** October 14, 2026.
- **Passing score:** 700 or greater.
- **Prerequisites:** None listed.
- **Preview:** Most questions cover generally available features. Preview features that are commonly used may appear.
- **Language:** Localized versions follow the English version by about eight weeks, and you can request 30 extra minutes if your language isn't available.

The change log says one section had a minor change and the audience profile had none.

## Who it is for

Learn expects familiarity with Microsoft 365 core services, security, identity and access, data protection and governance, and with Copilot and agents. You should know the admin centers for Exchange Online, SharePoint, Teams, Entra and Purview, understand objects such as users, groups, teams, sites and libraries, and know core security features such as authentication methods, Conditional Access and single sign-on.

## Weights

| Area | Weight |
|---|---|
| Identify the core features and objects of Microsoft 365 services | 30 to 35% |
| Understand data protection and governance tasks for Microsoft 365 and Copilot | 35 to 40% |
| Perform basic administrative tasks for Copilot and agents | 25 to 30% |

## Area 1: Core features and objects

- **Core objects.** How license types affect access, organization settings in the Microsoft 365 admin center, objects in the Exchange, SharePoint and Teams admin centers, and SharePoint roles and permissions.
- **Security principles.** Zero Trust, authorization, authentication methods, threat protection and Microsoft Defender XDR.
- **Core security features.** Entra ID, Conditional Access, single sign-on, troubleshooting sign-in issues (MFA, Conditional Access, risky sign-ins), Identity Secure Score, audit logs, Privileged Identity Management, app registrations and enterprise applications.

## Area 2: Data protection and governance (largest)

- **Microsoft Purview.** Information Protection, Data Loss Prevention, Insider Risk Management, Communication Compliance, DSPM for AI and Data Lifecycle Management, plus sensitivity labels, classification and retention.
- **Data security implications of Copilot.** How Copilot accesses data, how Microsoft Graph influences responses, how permissions and controls in Microsoft 365, Purview and Defender protect against risk, and responsible AI principles.
- **Risks.** Compliance Manager, Data Explorer, Insider Risk Management, DLP alerts, Communication Compliance violations, activity explorer, DSPM for AI and eDiscovery content search.
- **Oversharing in SharePoint.** Troubleshooting tools, data access governance reports and SharePoint Advanced Management, including restricted access control.

## Area 3: Copilot and agent administration

- **Features and capabilities.** Compare built-in Copilot with agents, compare monthly licensing with pay-as-you-go, know which features can be enabled or disabled, and identify use cases for Researcher, Analyst and custom agents.
- **Copilot administration.** Assign licenses, manage pay-as-you-go billing policies, monitor usage and adoption with Copilot Analytics and the admin center, and manage prompts (save, share, schedule, delete).
- **Agent administration.** Configure user access to agents, create an agent, understand the approval process, and monitor usage, insights and lifecycle in the Microsoft 365 admin center and Power Platform admin center.

## Documentation facts that map to the outline

These points come from Learn pages on topics the outline names. They are study anchors, not a prediction of what the exam asks.

- **Security defaults and Conditional Access.** Security defaults need no license and are enabled on new tenants. Conditional Access needs at least Microsoft Entra ID P1, and security defaults must be disabled before you can use it.
- **Microsoft-managed policies.** Learn lists policies such as blocking legacy authentication and requiring MFA for admins, created in report-only state first.
- **Agent registry.** Agent 365 is described as the unified registry for agents. Learn names the AI Reader role for viewing the inventory and the Agent ID Administrator role for managing agent identities, and the path Microsoft 365 admin center, Agents, All agents.
- **Agent flows billing.** Autonomous agent flow runs are charged and can be blocked when an environment has no Copilot Credits.

## Study plan

1. Start with Area 2, since it is the biggest. Practice finding a data access governance report in SharePoint and read how sensitivity labels interact with Copilot.
2. Review identity basics for Area 1: Conditional Access, MFA and PIM.
3. Open the Microsoft 365 admin center and the Power Platform admin center and find the agent and billing controls for Area 3.
4. Use the exam sandbox from the study guide to learn the exam interface.

## How to read the outline

The bullets illustrate how each skill is assessed, and Learn says related topics may also be covered. Use them as a checklist, and for each one find where it lives in an admin center. For an administration exam, knowing where a setting sits and what it controls is more useful than memorizing wording.

## Common mistakes

- Treating it as a Copilot-only exam. Two thirds of the weighting is not about Copilot features.
- Skipping Purview because it sounds advanced. The list names many Purview tools.
- Memorizing prices. The outline asks you to compare licensing models.

## Related

- [AB-900](https://www.m365.fm/entity/ab-900/)
- [Microsoft Copilot](https://www.m365.fm/entity/copilot/)
- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Study guide for Exam AB-900 (Microsoft Learn)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-900)
- [Security defaults in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults)
- [Microsoft-managed Conditional Access policies (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/managed-policies)
- [Agent registry convergence with Agent 365 (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/agent-id/agent-registry-convergence)
- [Agent flows overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
