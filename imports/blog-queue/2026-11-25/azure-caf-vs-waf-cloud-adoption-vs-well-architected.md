---
title: "Azure CAF vs WAF: Cloud Adoption Framework and Well-Architected Framework Explained"
summary: "How the Azure Cloud Adoption Framework (CAF) and the Azure Well-Architected Framework (WAF) differ, what each covers, who uses them, and how they fit together, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-25
topics: [cloud-adoption-framework, azure-well-architected-framework, azure-landing-zone]
keypoints:
  - "The Cloud Adoption Framework (CAF) guides decision makers through Azure adoption and ends in an Azure landing zone plus operational standards."
  - "The Well-Architected Framework (WAF) is a design framework that improves the quality of a single workload across five pillars."
  - "CAF has seven phases in Microsoft's current version: Strategy, Plan, Ready, Adopt, Govern, Secure and Manage."
  - "WAF pillars are Reliability, Security, Cost Optimization, Operational Excellence and Performance Efficiency."
  - "Microsoft points readers who want centralized controls for a portfolio of workloads to CAF rather than WAF."
faq:
  - q: "What is the difference between CAF and WAF in Azure?"
    a: "According to Microsoft Learn, the Cloud Adoption Framework provides a roadmap for cloud adoption and helps decision makers establish an Azure foundation and standards. The Azure Well-Architected Framework is a design framework for improving the quality of a workload. CAF works at the level of the organization and its landing zone, and WAF works at the level of a specific workload."
  - q: "What are the CAF phases?"
    a: "The Microsoft Learn overview lists seven phases for Azure adoption: Strategy, Plan, Ready, Adopt, Govern, Secure and Manage. Each phase is framed as a question, for example Ready asks how to build the Azure landing zone. The page does not include an Organize phase."
  - q: "What are the five pillars of the Well-Architected Framework?"
    a: "Microsoft Learn names Reliability, Security, Cost Optimization, Operational Excellence and Performance Efficiency. It says design decisions must be balanced across all pillars, given the business requirements."
  - q: "Which framework should I use first?"
    a: "Microsoft Learn presents CAF as the foundation: the outcome of Azure adoption is a landing zone and operational standards that support all Azure workloads. WAF then helps design and review each workload. The pages do not prescribe a strict order, so choose by the decision in front of you."
  - q: "Is the Well-Architected Review free?"
    a: "The Microsoft Learn overview says the Microsoft Azure Well-Architected Review is offered at no charge. It is a collection of questionnaires tied to the pillar checklists, and you can track your score through repeated runs."
---

The Cloud Adoption Framework (CAF) is about getting an organization ready for Azure and keeping it governed. The Well-Architected Framework (WAF) is about designing and improving individual workloads once they run on Azure. CAF answers decisions such as how to build a landing zone. WAF answers whether a given workload is reliable, secure, cost-efficient, operable and fast enough.

Both come from Microsoft Learn and are meant to be used together. The sections below describe each one as Microsoft documents it and then compare them.

## What CAF is

Microsoft says the Cloud Adoption Framework helps decision makers make better decisions, faster. It provides proven guidance to reduce risk, accelerate adoption and create a foundation for current and future workloads. It organizes guidance into building blocks that help establish an Azure foundation and the standards needed to support workloads over time.

The foundation scenario is Azure adoption. Its outcome is an Azure landing zone and operational standards that support all Azure workloads. Other scenarios build on that foundation: a unified data platform, AI adoption, AI agents, sovereignty and Azure VMware Solution.

### The seven phases

The current overview lists these phases, each with a guiding question:

| Phase | Question |
|---|---|
| Strategy | What should our Azure adoption look like? |
| Plan | How will we prepare for Azure adoption? |
| Ready | How will we build our Azure landing zone? |
| Adopt | How will we migrate, modernize and build workloads? |
| Govern | How will we control our Azure environment? |
| Secure | How will we protect our Azure environment? |
| Manage | How will we operate and optimize Azure over time? |

The page read for this article lists these seven phases only, with no Organize phase, so use these names when you refer to the current version.

### Who it is for

Microsoft states that CAF is designed for decision makers responsible for Azure adoption: business leaders, technology leaders, platform teams, and security and governance teams. Platform teams use it to establish an Azure landing zone and shared services. Security and governance teams use it to define standards, compliance requirements and risk management approaches.

## What WAF is

Microsoft describes the Azure Well-Architected Framework as a design framework that can improve the quality of a workload by helping it be resilient, available and recoverable, be as secure as needed, deliver a sufficient return on investment, support responsible development and operations, and accomplish its purpose within acceptable timeframes.

### The five pillars

1. Reliability
2. Security
3. Cost Optimization
4. Operational Excellence
5. Performance Efficiency

Each pillar has its own guide with design principles, checklists, key design strategies, tradeoffs and risks, design patterns and a maturity model. Microsoft stresses that decisions must be balanced across all pillars, since improving one can cost another.

### Layers and assessment

The framework is structured as pillars, workload guidance, service guides and design guides. The workload layer shows how the pillars apply to a specific class of workload, and Microsoft suggests reading the one that most closely matches your requirements. Service guides support decisions about single Azure components.

The Azure Well-Architected Review is offered at no charge. It is a set of questionnaires tied to the pillar checklists that evaluate design choices. You can run it repeatedly to track your score.

## CAF and WAF side by side

| | Cloud Adoption Framework | Well-Architected Framework |
|---|---|---|
| Main purpose | Roadmap for adopting and governing Azure | Design framework for workload quality |
| Scope | Organization, landing zone, shared standards | A single workload |
| Structure | Phases from Strategy to Manage | Five pillars plus workload and service guides |
| Typical readers | Business leaders, technology leaders, platform and governance teams | Teams that design and operate a workload |
| Output | Azure landing zone and operational standards | Better design choices and a Review score |

## How they fit together

Microsoft's WAF overview contains a direct pointer. If you want guidance for improving a portfolio of workloads through centralized controls, that content might not fully apply, and Microsoft recommends the Cloud Adoption Framework. In other words, centralized controls across many workloads are CAF territory, while the quality of one workload is WAF territory.

The CAF overview itself does not mention the Well-Architected Framework, so the link between the two is stated only on the WAF side. A reasonable reading is that CAF produces the landing zone and standards, and WAF is used on the workloads that run inside them. That reading is an interpretation, not a statement from the pages.

## Common mix-ups

- **Treating WAF as a migration plan.** WAF does not describe how to move to Azure. Its pillars help you judge the design of a workload, and the Review scores that design.
- **Treating CAF as an architecture checklist.** CAF sets the foundation and standards, and the phases are decisions for leaders and platform teams, not per-application design reviews.
- **Applying only one pillar.** Microsoft says decisions must be balanced across all five pillars.

## A practical way to choose

- **You are planning your first Azure environment.** Start with CAF: Strategy, Plan and Ready, ending in a landing zone.
- **You need rules across many subscriptions or teams.** Use the Govern, Secure and Manage phases of CAF.
- **You are designing or reviewing one application.** Use WAF: read the pillar checklists and run the Well-Architected Review.
- **You are unsure.** Ask whether the decision affects the whole Azure environment or a single workload.

## Related

- [Microsoft Cloud Adoption Framework](https://www.m365.fm/entity/cloud-adoption-framework/)
- [Azure Well-Architected Framework](https://www.m365.fm/entity/azure-well-architected-framework/)
- [Azure landing zone](https://www.m365.fm/entity/azure-landing-zone/)
- [Microsoft Azure](https://www.m365.fm/entity/azure/)

## Sources

- [Microsoft Learn: What is the Cloud Adoption Framework?](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/overview)
- [Microsoft Learn: What is the Azure Well-Architected Framework?](https://learn.microsoft.com/en-us/azure/well-architected/what-is-well-architected-framework)
