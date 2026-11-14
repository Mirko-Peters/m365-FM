---
title: "Azure Functions Hosting Plans Compared: Flex Consumption, Premium and Dedicated"
summary: "Compare Azure Functions hosting plans from Microsoft Learn: Flex Consumption, Premium, Dedicated, Container Apps and legacy Consumption, with scale, timeout, networking and billing, recommendations and the retirement dates the page states."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [azure-functions, azure-functions-consumption-plan]
keypoints:
  - "Learn calls the Consumption plan legacy and says new serverless apps should use Flex Consumption."
  - "Flex Consumption scales up to 1,000 instances on demand per function group, with always ready instances, private endpoints and outbound VNet integration."
  - "Premium keeps at least one instance per plan always warm. Dedicated runs continuously on a set number of instances and needs Always On for unbounded timeouts."
  - "Function apps on the end-of-life v3 runtime on Linux in a Consumption plan stop running after September 30, 2026. Linux Consumption retires on 30 September 2028."
  - "HTTP-triggered functions have a 230-second response limit regardless of the function app timeout."
faq:
  - q: "Which plan should a new serverless app use?"
    a: "According to Microsoft Learn, Flex Consumption. The page marks the Consumption plan as legacy and says new serverless apps should use Flex Consumption."
  - q: "Which plan avoids cold starts?"
    a: "Learn says Premium always ready instances avoid cold starts, that Flex Consumption has improved cold start and supports always ready instances, and that for Dedicated cold start is not really an issue."
  - q: "What are the timeouts?"
    a: "The overview lists 30 minutes default and unbounded maximum for Flex Consumption, Premium, Dedicated (which requires Always On) and Container Apps, and 5 minutes default and 10 maximum for legacy Consumption. HTTP-triggered functions have a 230-second response limit."
  - q: "When does Linux Consumption retire?"
    a: "Learn says Linux Consumption retires on 30 September 2028 and gets no new features or language versions. Windows Consumption apps are not currently affected. The page's tables label Linux Consumption as retired, so check the current status."
  - q: "Which plan supports private endpoints?"
    a: "Learn lists private endpoints for Flex Consumption. It lists full VNet support for Premium and Dedicated and no private endpoints for Container Apps. Legacy Consumption has inbound access restrictions only."
---

For a new serverless Azure Functions app, Microsoft Learn points to Flex Consumption. Premium and Dedicated fit other needs, and the Consumption plan is legacy. This article restates the Learn hosting plan comparison and the retirement notes on that page.

## Overview

| Plan | Scale to zero | Max instances | Timeout default / max (minutes) | Networking |
| --- | --- | --- | --- | --- |
| Flex Consumption | Yes, with improved cold start | Up to 1,000 on demand per function group | 30 / unbounded | Inbound access restrictions, private endpoints, service endpoints, outbound VNet integration. No Hybrid Connections. |
| Premium | At least one instance per plan always warm | Windows 100. Linux 20 to 100. | 30 / unbounded | Full VNet support. Hybrid Connections on Windows only. |
| Dedicated (App Service) | Not applicable | 10 to 30 (100 in an ASE) | 30 / unbounded, requires Always On | Full VNet support. Hybrid Connections on Windows only. |
| Container Apps | Yes, if minimum replicas is zero | 300 to 1,000 | 30 / unbounded | Inbound access restrictions, service endpoints, outbound VNet. No private endpoints. |
| Consumption (legacy) | Yes | Windows 200. Linux 100. | 5 / 10 | Inbound access restrictions only |

## Billing as the page words it

- **Flex Consumption:** executions, memory of active instances, plus the cost of always ready instances.
- **Premium:** core seconds and memory across needed and prewarmed instances. The page says this plan provides the most predictable pricing.
- **Dedicated:** regular App Service plan rates. An App Service Environment has a flat monthly rate.
- **Container Apps:** based on plan type.
- **Consumption:** executions, execution time and memory.

The page gives no price figures and links to the pricing pages.

## Key details

- HTTP-triggered functions have a 230-second response limit regardless of the function app timeout.
- Flex Consumption scales per function. HTTP triggers scale together as a group, as do Blob storage (Event Grid) triggers and Durable Functions triggers.
- Flex Consumption supports Linux code-only deployments, and Windows deployments are code-only. Azure Functions does not support Windows containers. Linux is the only supported OS for the Python runtime.

## When to pick which

- **Flex Consumption:** pay-per-execution serverless hosting, VNet access and variable workloads, with instance sizes of 512 MB, 2,048 MB or 4,096 MB and optional always ready instances.
- **Premium:** apps that run continuously or nearly so, need more CPU or memory, run longer than Consumption allows, need VNet access or need a custom Linux image.
- **Dedicated:** existing underutilized VMs, fully predictable billing or manual scaling, running web and function apps on one plan, or long-running workloads where Durable Functions cannot be used.
- **Container Apps:** control over the container image, custom libraries, moving on-premises code to containers, avoiding Kubernetes management, or dedicated GPU compute.
- **Consumption (legacy):** mainly for a dependency on Windows, such as the full .NET Framework or Windows-specific PowerShell modules. For new apps, use Flex Consumption.

## Retirement and legacy notes

- Function apps still running the end-of-life v3 runtime on Linux in a Consumption plan stop running after September 30, 2026. Migrate to v4.
- Linux Consumption retires on 30 September 2028 and gets no new features or language versions. Windows Consumption apps are not currently affected.
- Learn says to migrate Consumption apps to Flex Consumption before the retirement date.

## Inconsistencies on the page

The OS and hosting tables list Linux Consumption as retired, while the retirement note says it is retiring on 30 September 2028. The page does not resolve this, so check the current status before you plan. The Premium Linux instance count is also shown as a range with a regional footnote.

## A quick decision path

This path is a suggestion that restates the recommendations above, not a Microsoft flowchart.

1. New serverless app with variable load and VNet needs: start with Flex Consumption.
2. Always-on or near-continuous workload, more CPU or memory, or a custom Linux image: Premium.
3. Spare App Service capacity or a need for fixed, manual scaling: Dedicated.
4. Custom container image, GPU or Kubernetes-free container hosting: Container Apps.
5. Existing Consumption apps: plan the move to Flex Consumption before the dates above.

## Not covered

The page gives no exact pricing, step-by-step setup or migration procedures, code samples, Durable Functions detail, performance tuning or full regional quotas. It links to pages for those.

## Related

- [Azure Functions](https://www.m365.fm/entity/azure-functions/)
- [Azure Functions Consumption plan](https://www.m365.fm/entity/azure-functions-consumption-plan/)

## Sources

- [Azure Functions hosting options](https://learn.microsoft.com/azure/azure-functions/functions-scale)
