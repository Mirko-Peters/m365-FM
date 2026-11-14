---
title: "Foundry Provisioned Throughput (PTU) vs Pay-As-You-Go: How to Choose, Size and Tune"
summary: "Compare Microsoft Foundry provisioned throughput units with pay-per-token deployments. Learn when each fits, how to size PTUs, how spillover handles 429 errors, and how to monitor utilization, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [microsoft-foundry, provisioned-throughput-units, azure-ai-foundry, azure-openai]
keypoints:
  - "Provisioned deployments hold fixed capacity and bill per PTU per hour. Standard and Global Standard deployments bill per token and share capacity."
  - "Learn says provisioned fits predictable, latency-sensitive, high-volume traffic. Standard fits development, testing, low volume and variable traffic."
  - "At 100 percent utilization a provisioned deployment returns HTTP 429 with retry-after-ms. Learn calls it a traffic-management signal, not a service error."
  - "Spillover can redirect overflow requests to a standard deployment of the same model in the same Foundry resource. Spilled tokens bill at standard rates."
  - "Watch the Provisioned-managed utilization V2 metric in Azure Monitor and avoid scaling PTUs up and down with traffic."
faq:
  - q: "When should I use provisioned throughput instead of pay-as-you-go?"
    a: "Microsoft Learn says provisioned suits applications with predictable traffic, latency-sensitive requirements, production-scale volume where per-token billing becomes expensive, and real-time scenarios such as chat applications, copilots or agents. Standard deployments remain the better fit for development, testing, low volume or highly variable traffic."
  - q: "Does having PTU quota guarantee capacity?"
    a: "No. Learn states that PTU quota has no cost but does not guarantee capacity. If the region lacks capacity for the requested PTU count, the deployment fails, and capacity released by deleting or scaling down may not be available again later."
  - q: "What happens when a provisioned deployment is fully used?"
    a: "Per Microsoft Learn, the service returns HTTP 429 immediately with retry-after and retry-after-ms headers, instead of queuing. You can redirect requests with spillover to a standard deployment or wait for the indicated time and retry."
  - q: "Do reservations guarantee PTU capacity?"
    a: "No. Learn says Azure reservations discount the PTU billing meter with a one-month or one-year commitment, but do not guarantee capacity. It advises creating the deployments first and purchasing the reservation afterwards."
---

Use provisioned throughput (PTU) when traffic is predictable, latency matters and token volume is high enough that per-token billing gets expensive. Use pay-as-you-go deployments (Standard, Global Standard, Data Zone Standard) for development, testing, low volume and uneven traffic. Many production setups combine both: provisioned capacity for the steady base load and a standard deployment for bursts, connected through spillover. This article summarizes what Microsoft Learn documents on choosing, sizing and tuning that setup.

## How the two models differ

Learn describes a provisioned deployment as one that holds a fixed amount of processing capacity exclusively for your deployment, whether or not requests are being made. Standard deployments share inference capacity across customers, so throughput can vary with demand.

| | Standard (pay-as-you-go) | Provisioned |
|---|---|---|
| Billing | Pay per token | Per PTU per hour, or with Azure reservations |
| Latency | No SLA | Defined latency target per model |
| Best for | Development, testing, variable traffic | Mission-critical, high-scale production with steady load |

Learn lists three provisioned variants by data routing: **Global Provisioned** (routed across regions), **Data Zone Provisioned** (stays within a US or EU zone) and **Regional Provisioned** (stays in one Azure region). The deployment types page also recommends starting with **Global Standard** for most workloads and moving only for a specific reason such as data residency, reserved throughput or batch processing.

## Step 1: Decide whether provisioned fits

Check these points against your workload:

1. Can you estimate requests per minute and token volumes?
2. Do users or agents need consistent latency?
3. Is the monthly per-token bill high enough that a fixed hourly cost makes sense?

If the answer to the first is no, start with a standard deployment and collect real numbers first. Learn calls standard the better fit for highly variable traffic.

## Step 2: Check quota and capacity

Learn separates two terms. **PTU quota** is the maximum number of PTUs you can deploy per subscription, per region and per deployment type, and it has no cost. **Capacity** is what is actually available to deploy. Having quota does not guarantee capacity, and the deployment fails if the region cannot supply the requested PTUs. Every model also has a minimum PTU count. The pages read here do not list the numbers, so check the model-specific table in the sizing documentation.

To view or request quota in the Foundry portal, go to **Manage** > **Quota** > **Provisioned throughput unit**, select the subscription and region, and use **Request Quota** if you need more. Learn says approval might take several days.

## Step 3: Size the deployment

Learn names three inputs: request shape (requests per minute and average input and output tokens), the output-to-input ratio (output tokens need more capacity than input tokens) and the cache rate. The calculation converts token volumes into a normalized TPM figure and divides it by the model's input TPM per PTU. You can do this manually or with the capacity calculator in the Foundry portal.

Learn also advises benchmarking on your own data for at least 10 minutes to see steady-state results, with your own traffic shape and retry logic. It adds that setting `max_tokens` close to the true generation size gives the highest concurrency.

## Step 4: Handle 429 responses

When utilization reaches 100 percent, a provisioned deployment returns HTTP 429 right away, with `retry-after` and `retry-after-ms` headers. Learn says this is a traffic-management signal rather than a service error, and that accepted requests always complete with predictable latency because traffic is not queued.

You have two documented options:

- **Redirect** to another deployment, which adds the least latency. Spillover automates this.
- **Retry** after the time in `retry-after-ms`, if you need the provisioned deployment and can accept more latency.

The OpenAI SDKs retry 429 responses by default, and Learn shows how to raise `max_retries` from the default of 2.

## Step 5: Add spillover for bursts

Spillover redirects overflow from a provisioned deployment to a standard deployment. It triggers on a 429, on a 400 when a long-context request exceeds what PTU supports, and on 500 or 503 errors. Requirements from the Learn page:

- A provisioned deployment and a matching standard deployment of the same model and version in the **same Foundry resource**.
- At least the **Cognitive Services Contributor** role on the resource.

Enable it for all requests in the portal by choosing **Deploy** > **Custom settings**, selecting a provisioned **Deployment type** and turning on **Traffic spillover**. Or send the `x-ms-spillover-deployment` header with the standard deployment name per request. If both are set, the deployment property wins. Learn warns that spilled requests can see added latency, because the provisioned deployment is always tried first.

Billing follows where the request is served. Provisioned requests cost only the hourly PTU charge. Spilled requests bill at standard token rates. According to the Learn page, Azure DeepSeek and Meta Llama models do not currently support spillover.

## Step 6: Monitor utilization

In the Azure portal, open the Foundry resource, select **Metrics** and add **Provisioned-managed utilization V2**. Learn defines utilization as PTUs consumed divided by PTUs deployed in the period. Use **Apply Splitting** to see each deployment. To see spillover, add the **Azure OpenAI Requests** metric and apply the `IsSpillover` split.

## Cost habits that Learn calls out

- All provisioned types bill per PTU per hour from creation to deletion, regardless of tokens used.
- Learn advises against scaling PTUs up and down with traffic, because capacity may not be available when scaling back up. It also says continuous hourly billing at high utilization typically exceeds reservation pricing.
- Azure reservations offer a one-month or one-year commitment. They do not guarantee capacity, so create deployments first and buy the reservation afterwards.

## Related

- [Microsoft Foundry](https://www.m365.fm/entity/microsoft-foundry/)
- [Provisioned throughput units](https://www.m365.fm/entity/provisioned-throughput-units/)
- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Azure OpenAI](https://www.m365.fm/entity/azure-openai/)

## Sources

- [Microsoft Learn: Provisioned throughput for Foundry Models](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/provisioned-throughput)
- [Microsoft Learn: Deployment types for Foundry Models](https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/deployment-types)
- [Microsoft Learn: Spillover traffic management](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/spillover-traffic-management)
- [Microsoft Learn: Get started with provisioned deployments](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/provisioned-get-started)
