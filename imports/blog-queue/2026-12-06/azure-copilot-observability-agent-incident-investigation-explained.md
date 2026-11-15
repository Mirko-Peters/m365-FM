---
title: "Azure Copilot Observability Agent: How Agentic Incident Investigation Works"
summary: "What the Azure Copilot observability agent does in Azure Monitor: chat, deep investigation of an active incident, autonomous alert correlation in preview, telemetry prerequisites, regions and limits."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [azure-copilot-agents, azure-monitor, microsoft-security-copilot]
keypoints:
  - "The observability agent in Azure Monitor offers three things: chat with telemetry, deep investigation of an active incident and autonomous operations (preview)."
  - "Chat and deep investigation need no resource setup. Autonomous operations need an Observability Agent resource, which is in preview."
  - "Deep investigation is optimized for AKS, Application Insights and virtual machines and ends in a report with findings and recommended next steps."
  - "The agent does not restart resources, change configuration or resolve issues on its own. People review the issues it creates."
  - "Resource logs are not collected by default, and missing requests, dependencies or exceptions can make findings incomplete."
faq:
  - q: "What is the Azure Copilot observability agent?"
    a: "Microsoft Learn describes it as an AI-powered operational companion in Azure Monitor. It helps you work with observability data through natural language, guided investigation and issue-based follow-up, and it complements existing insights, visualization and response features."
  - q: "Does the agent fix incidents by itself?"
    a: "No. Microsoft Learn says autonomous operations use a controlled-autonomy model. The agent does not restart resources, change configuration or resolve issues on its own. Your team reviews the issues and decides what to do."
  - q: "Do I need to create a resource to use it?"
    a: "Only for autonomous operations. According to Microsoft Learn, chat and deep investigation require no resource provisioning or setup. The Observability Agent resource gives the agent a durable identity, scope and governance boundary and is in preview."
  - q: "Which workloads does deep investigation support best?"
    a: "Microsoft Learn says it is optimized for full-stack, distributed systems on Azure Kubernetes Service, Application Insights and virtual machines. The page does not list further supported resource types."
  - q: "What are the main limits?"
    a: "Microsoft Learn lists a 24-hour limit for continuing a conversation, English as the only fully supported language, no support for customer-managed keys in agent conversations, and availability in nine listed regions."
---
The Azure Copilot observability agent is the part of Azure Monitor that investigates incidents with AI. You can ask it questions about your telemetry, start a deep investigation when something is already wrong, or let it correlate alerts in the background and open issues for your on-call team. This article explains what each mode does, what it needs and where Microsoft says it stops.

## What it is

Microsoft Learn calls the agent an AI-powered operational companion in Azure Monitor. It works through natural language, guided investigation and issue-based follow-up. It does not replace the existing Azure Monitor insights and dashboards. It sits on top of them.

Access is controlled through Azure Copilot, so users need access to Azure Copilot first. To start a chat, open the **Application Insights Logs** page and select the **Observability Agent** button in the query toolbar. The chat is scoped to the resource where you launch it.

## The three modes

| Mode | When to use it | Setup |
|---|---|---|
| Chat | You have a question about logs, metrics or related telemetry | None |
| Deep investigation | An incident is active and you need to know what happened and what to do next | None |
| Autonomous operations (preview) | You want alerts correlated in the background | Observability Agent resource (preview) |

Chat context is temporary. To keep the analysis, continue into a deep investigation and save it as an Azure Monitor issue. Azure Monitor issues are also marked as preview.

## How the agentic investigation works

A deep investigation collects signals from three layers: application, infrastructure and the Azure platform. It correlates them automatically and produces a report with findings and recommended next steps. The agent explains its reasoning, including which signals it considered and how they relate. Conversations keep context across follow-up questions.

Microsoft says the investigation is optimized for full-stack, distributed systems on **Azure Kubernetes Service (AKS)**, **Application Insights** and **virtual machines**. The documentation does not use the term "root cause" for the output, so treat the report as findings to verify, not as a verdict.

## Autonomous operations

Autonomous operations are opt-in and in preview. Within a scope you select, the agent correlates alerts and creates an Azure Monitor issue when alerts appear to represent the same incident. The on-call team then reviews the issue.

The agent does not restart resources, change configuration or resolve issues. Microsoft describes this as a controlled-autonomy model.

You can add custom instructions to the Observability Agent resource. These are natural-language rules applied across autonomous runs, for example which alerts to correlate or which workloads are revenue-critical. They are stored as Azure resource state and governed by Azure RBAC.

## Prepare your telemetry first

Microsoft's best-practices page says investigation quality depends on the data you collect:

- **Resource logs** are not collected by default. Enable them for every resource that supports your application.
- **Requests, dependencies and exceptions** are all analyzed. If one type is missing, findings might be incomplete.
- **Service context** matters. Give each service a meaningful cloud role name. OpenTelemetry does not populate resource context by default, so configure resource detectors for values such as `service.name` and `cloud.resource_id`.
- **AKS context** is needed to link application failures to pod restarts or node issues.
- **Reserved properties** such as `OperationId`, `OperationName`, `UserId`, `SessionId` and `cloud_RoleName` should not be overridden, because that breaks correlation and investigation accuracy.
- **Release annotations** mark deployments and configuration changes. **Availability tests** on critical endpoints can trigger investigations when an endpoint goes down.

## Limits and regions

From the overview page:

- A conversation can't continue beyond 24 hours.
- English is the only fully supported language.
- Customer-managed keys are not supported for agent conversations. Microsoft-managed keys are used.
- Available regions: Australia East, Canada Central, Central US, East Asia, East US, South Central US, UK South, West Central US and West Europe. Some processing is geographic rather than regional.

## A practical checklist

1. Confirm that your users have Azure Copilot access.
2. Enable resource logs and complete Application Insights instrumentation.
3. Set cloud role names and resource context.
4. Try chat on an Application Insights Logs page for a known past incident.
5. Run a deep investigation during the next real incident and save it as an issue.
6. Only then consider an Observability Agent resource for autonomous operations.

## What the pages do not say

The pages I read do not list the RBAC roles needed for the Observability Agent resource, do not describe pricing or quotas, and do not name supported resource types beyond AKS, Application Insights and virtual machines. A Microsoft Tech Community post confirms that autonomous operations entered public preview, but its body could not be read in full. Check the linked Learn pages before you plan a rollout.

## Related

- [Azure Copilot agents](https://www.m365.fm/entity/azure-copilot-agents/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Microsoft Security Copilot](https://www.m365.fm/entity/microsoft-security-copilot/)

## Sources

- [Azure Copilot observability agent](https://learn.microsoft.com/en-us/azure/copilot/observability-agent)
- [Observability agent overview](https://learn.microsoft.com/en-us/azure/azure-monitor/aiops/observability-agent-overview)
- [Observability agent best practices](https://learn.microsoft.com/en-us/azure/azure-monitor/aiops/observability-agent-best-practices)
