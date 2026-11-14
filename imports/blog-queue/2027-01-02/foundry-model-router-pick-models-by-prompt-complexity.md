---
title: "Foundry Model Router: How to Deploy It and Route Prompts by Complexity"
summary: "How to deploy and use the Microsoft Foundry model router: routing modes, model subsets, Claude deployment rules, API use, session affinity preview, monitoring and common issues."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [model-router, azure-ai-foundry]
keypoints:
  - "Model router is a trained language model that selects an LLM for each prompt in real time, packaged as one deployment."
  - "Routing modes are Balanced (default), Quality and Cost. A mode change can take up to five minutes to take effect."
  - "You can route to a subset of models. Claude models must be deployed separately first, or the deployment request fails."
  - "Call it like any chat model by using the deployment name. The model field of the response shows which model served the request."
  - "Benchmark against your current model for quality, cost and latency before sending production traffic."
faq:
  - q: "What does the Foundry model router do?"
    a: "According to Microsoft Learn, model router is a trained language model that selects the best large language model to respond to a prompt in real time. It uses different preexisting models to deliver performance and save on compute cost in a single deployment."
  - q: "Which routing mode should I choose?"
    a: "Microsoft Learn describes Balanced as the default for most workloads, Quality for critical tasks such as legal review or complex reasoning, and Cost for high-volume, budget-sensitive workloads such as classification."
  - q: "Do I deploy the underlying models myself?"
    a: "Learn says you do not need to deploy the supported models separately, except Claude models. To route to Claude, deploy them from the model catalog first. Otherwise a request that lists them fails with an InvalidResourceProperties error."
  - q: "How do I see which model answered?"
    a: "Learn says the Chat Completions response includes a model field that identifies the underlying model that served the request. You can also see the selected model in the playground."
  - q: "Can the router keep a conversation on the same model?"
    a: "Learn documents session affinity for Chat Completions as a preview. With a session ID and the Foundry-Features header set to ModelRouterControls=V1Preview, the router tries the same eligible model first. It is best-effort and the association expires after 30 minutes without a successful request."
---

Deploy model router as a single model in Microsoft Foundry, pick a routing mode, optionally limit it to a subset of models, and then call the deployment name like any chat model. The router chooses the underlying model per prompt. This guide follows the Microsoft Learn how-to for model router as it read on the research date. The list of supported models changes often, so check the live page before you rely on a specific model.

## What it is

Model router is a trained language model that selects the best large language model for a prompt in real time. It uses several existing models to keep quality high and reduce compute cost, all in one deployment. Learn links separate concept pages for how it works and its limitations, which I did not read for this article.

## Supported models

The latest version in the Learn table is `2025-11-18`. It lists models from OpenAI, Anthropic, xAI, Fireworks, DeepSeek and Meta. Learn says you do not need to deploy the supported models separately, with one exception: Claude models. Deploy Claude from the model catalog first, and the router invokes those deployments when you select them for routing.

## Deploy the router

Follow the Foundry resource deployment guide first. Then, in the Foundry portal:

1. Open the model catalog and find `model-router` in the **Models** list.
2. Select it and choose **Default settings** for the **Balanced** routing mode across all supported models.

You can also deploy with the Azure Management REST API. Learn shows a PUT request to the account's deployments path with `sku` set to `GlobalStandard`, a capacity value, and the model `model-router` with version `2025-11-18`.

If your organization uses the built-in Azure Policy for model deployment, Learn says the allowed publishers must include `Microsoft` (the publisher of model router) and the publisher of each model you route to, for example `Anthropic`. Otherwise the policy blocks the deployment.

## Custom settings

Choose **Custom settings** for more options. Learn notes:

- Settings apply to all underlying chat models. Do not deploy the underlying models separately or set content filters and rate limits on each one.
- The content filter you choose applies to all content to and from the router.
- Your tokens-per-minute limit applies to all activity through the router.

### Choose a routing mode

| Mode | When Learn suggests it |
| --- | --- |
| Balanced (default) | Most workloads. Optimizes cost while maintaining quality |
| Quality | Critical tasks such as legal review, medical summaries or complex reasoning |
| Cost | High-volume, budget-sensitive work such as content classification or simple Q&A |

Mode changes can take up to five minutes to take effect.

### Route to a subset

In the deployment pane, select **Route to a subset of models** and pick the models. You must select at least one. If none is selected, the deployment uses the default model set for the mode. New models introduced later are excluded until you add them. Subset changes can also take up to five minutes. In the REST request, add a `routing` block with a `mode` and a `models` array. Claude models in that array must already be deployed to the same Foundry account with a matching SKU.

## Call the router

Set the `model` parameter to your router deployment name. Learn shows both the Foundry Responses API and the Chat Completions API in Python and JavaScript. The response `model` field reveals which underlying model was selected. In the playground, each response shows the selected model as well.

Two parameter notes from Learn:

- If the router selects a reasoning model, it ignores `Temperature` and `Top_P`. Parameters such as `stop`, `presence_penalty` and `logprobs` are dropped for o-series models.
- Since version `2025-11-18`, `reasoning_effort` is supported and passed to the underlying reasoning model.

You can also connect a router deployment as the base model of a Foundry agent by selecting it in the agent playground.

## Session affinity (preview)

Chat Completions is stateless, so the router evaluates each request independently by default. Learn describes a preview that asks the router to try the same eligible model first for related turns. You set the header `Foundry-Features: ModelRouterControls=V1Preview` and send an application-owned session ID, either in `routing_config.session_affinity` or the `x-ms-session-id` header. The ID must be 1 to 256 characters. The association expires after 30 minutes without a successful request. Learn says this is best-effort, does not guarantee a prompt-cache hit, and yields to policy, safety, capability, quota and availability requirements.

## Monitor cost and performance

- **Metrics:** In the Azure portal, open **Monitoring** > **Metrics** for the resource, filter by the router deployment and split by underlying model.
- **Cost:** Router cost is the sum of the underlying models' cost. Open **Cost analysis**, filter by the **Deployment** tag and select your router deployment name.

## Evaluate before production

Learn tells you to treat the first deployment as a starting point and to benchmark against your current model for response quality, estimated cost and latency before sending production traffic.

## Common issues from Learn

| Issue | Suggested resolution |
| --- | --- |
| Rate limit exceeded | Raise the tokens-per-minute quota or add retry with exponential backoff |
| Unexpected model selection | Review the routing mode, consider a subset |
| High latency | Use Cost mode for latency-sensitive workloads |
| Claude model not routing | Deploy Claude from the model catalog first |

## What this article does not cover

I did not read the pages on routing logic, pricing or the monitoring metadata, so this guide gives no statement on how the router scores prompt complexity internally. For that, read the Learn concept pages.

## Related

- [Model router](https://www.m365.fm/entity/model-router/)
- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Foundry model catalog](https://www.m365.fm/entity/foundry-model-catalog/)
- [Azure OpenAI](https://www.m365.fm/entity/azure-openai/)

## Sources

- [How to use model router for Microsoft Foundry (Microsoft Learn)](https://learn.microsoft.com/azure/foundry/openai/how-to/model-router)
