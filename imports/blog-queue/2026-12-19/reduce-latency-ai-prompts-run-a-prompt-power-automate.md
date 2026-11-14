---
title: "Reduce Latency When Running AI Prompts in Power Automate With the Run a Prompt Action"
summary: "What Microsoft documents about speed when using AI Builder prompts in cloud flows: model category, JSON output, request time limits, loop concurrency and throttling, and the gap where Learn gives no latency numbers."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [power-automate, ai-builder, prompt]
keypoints:
  - "Learn gives no latency figures for prompts. Its only speed guidance is the model category: Mini is faster, General might be slower, and Deep models are slower because they reason before responding."
  - "The default model is GPT-4.1 mini. Experimental and preview models can vary in latency and might time out or be unavailable."
  - "Inbound requests to a flow, such as a Power Apps call with a response action, have a 120 second limit. Use an asynchronous pattern for work that takes longer."
  - "Apply to each runs one item at a time by default and can be raised to a value from 1 to 50. Prompts and AI Builder can be subject to usage limits or capacity throttling."
  - "Set the prompt output to JSON when several elements are needed, and keep prompts and expected outputs short and specific."
faq:
  - q: "Does Learn say how long the Run a prompt action takes?"
    a: "No. The Learn pages read for this article do not give response times or latency figures for prompts in Power Automate. They say only that capability might be subject to usage limits or capacity throttling."
  - q: "Which model is the fastest for prompts?"
    a: "Learn's model table lists a Mini category with faster processing, a General category that might be slower due to complexity and a Deep category that is slower because it reasons before responding. The default model, GPT-4.1 mini, is in the Mini category."
  - q: "How long can a flow take to respond to a Power Apps call?"
    a: "Learn lists 120 seconds, or 2 minutes, for inbound requests. Flows with a response action such as Respond to a PowerApp or flow return a response within this limit, and actions after the response action can keep running."
  - q: "Can I run prompt calls in parallel inside a loop?"
    a: "Learn says the Apply to each concurrency default is 1 and can be set between 1 and 50. It also warns that high concurrency can cause performance issues when connected services have request limits, and that enabling trigger concurrency control cannot be undone."
  - q: "How do I get structured output from a prompt?"
    a: "Select JSON as the prompt output in prompt builder. Learn says this makes it easier to process responses with multiple elements. JSON formats must use field keys, and the error 'A JSON could not be generated' can be addressed by adding the instruction not to include JSON markdown."
---

Microsoft Learn does not publish latency numbers for the Run a prompt action, so there is no documented target to tune against. What it does document is a set of levers that affect how long a flow with an AI prompt takes: the model category, the shape of the prompt output, request time limits, loop concurrency and throttling. This article lists those levers and says plainly where Learn is silent.

## Lever 1: Pick the model category deliberately

In prompt builder, the model is chosen with **Model** at the top. Learn lists these categories:

| Category | Performance | Speed | Example models |
|---|---|---|---|
| Mini | Good for most tasks | Faster processing | GPT-4.1 mini (default) |
| General | Superior for complex tasks | Might be slower due to complexity | GPT-4.1, GPT-5 chat |
| Deep | Trained for reasoning tasks | Slower, as it reasons before responding | GPT-5 reasoning |

Learn recommends a mini model when you need a cost-effective solution for moderately complex tasks or faster processing. The default is GPT-4.1 mini at the basic rate. General and Deep models use the standard and premium rates.

Two cautions from the same page:

- Experimental and preview models might show variability in latency, response quality or message consumption, and might time out or be unavailable. Anthropic Claude models are at the experimental stage even without a tag.
- The temperature setting does not change speed according to Learn. It guides creativity versus determinism, with 0 as the default.

For a flow that classifies, extracts or summarizes, start with the Mini category and measure. Move up only when quality requires it.

## Lever 2: Keep the prompt and output small

Learn's prompt guidance asks for clear, concise and specific prompts, and says to adjust the prompt if generated text is too long or contains irrelevant information. Learn does not state that shorter output is faster, so treat this as a sensible practice and test it.

When you need several values, set the output to **JSON** in the top-right corner of the prompt. Learn says this makes it easier to process responses with multiple elements in cloud flows. Details:

- The format mode is **Auto detected** by default. Select **Save custom** after editing the example, or your changes are lost.
- The saved format is applied at runtime, so responses stay consistent even when dynamic inputs change.
- JSON formats must use field keys. A bare array of strings is not supported.
- If you see "A JSON could not be generated. Edit your prompt instruction and try again.", Learn says to add `Don't include JSON markdown in your answer` to the prompt.

One prompt call that returns several fields is a single round trip, instead of several calls that each return one value. The pages do not measure the difference.

## Lever 3: Respect the request time limits

Learn lists these limits for cloud flows:

- Inbound requests, including instant flows and the HTTP Request trigger, have 120 seconds (2 minutes).
- Flows with a response action, including **Respond to a PowerApp or flow**, always return a response within this limit. Actions after the response action can keep running beyond it.
- Outbound synchronous requests have 120 seconds. Outbound asynchronous requests can be configured up to 30 days. For longer-running operations, use an asynchronous polling pattern or an **Until** loop.
- Run duration is 30 days.

If a prompt call could take long, do not hold a Power Apps user on the response. Return an acknowledgment first with the response action, then run the prompt after it and write the result to Dataverse or SharePoint. The caller can pick it up later. This follows Learn's statement that a flow can respond and continue running other operations.

## Lever 4: Loops, concurrency and throttling

The most common slow design is one prompt call per item inside **Apply to each**. Learn documents:

- Apply to each concurrency defaults to 1 and can be set between 1 and 50.
- A high number of concurrent runs can cause performance issues when connected services have request limits.
- Trigger concurrency control is off by default and cannot be undone without deleting and re-adding the trigger. Learn's guidance is to leave it at the default, or to place the actions that need it in a dedicated child flow.

For prompts, Learn adds that the capability might be subject to usage limits or capacity throttling, and that it consumes credits: AI Builder credits are consumed first in Power Apps and Power Automate, if you have them. Learn does not give numbers for the throttling.

A practical approach: raise loop concurrency in small steps, watch the run history for slow or failed prompt actions, and stop when it stops helping. If a flow is throttled, Learn says the usual result is delayed runs of later actions, and that a consistently throttled flow is turned off after 14 days.

The default retry policy for actions retries at exponentially increasing intervals, up to 12 retries over about an hour for the medium and high profiles. A flow that hits a throttling error can therefore look slow rather than failed. Learn's page describes this policy for actions in general and does not say how it applies to Run a prompt in particular.

## Lever 5: Filter before you call the model

Do not send every item to the model. The trigger guidance says to run flows only when a condition is met, for example with the OData filter property for Dataverse. For emails or list items, add trigger conditions or a **Condition** action before the **Run a prompt** step, so only relevant items cost time and credits.

## What is not documented

The pages read for this article do not describe typical response times, token throughput, a guaranteed maximum duration for the prompt action, or a setting for streaming in flows. Measure your own flow: note the duration of the prompt action in the run history for a sample of inputs, change one lever at a time and compare.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [AI Builder](https://www.m365.fm/entity/ai-builder/)
- [Prompt](https://www.m365.fm/entity/prompt/)

## Sources

- [Use a prompt in a flow (Microsoft Learn)](https://learn.microsoft.com/en-us/ai-builder/use-a-custom-prompt-in-flow)
- [Model selection and temperature settings (Microsoft Learn)](https://learn.microsoft.com/en-us/ai-builder/prompt-modelsettings)
- [Change the output of your prompt (Microsoft Learn)](https://learn.microsoft.com/en-us/ai-builder/change-prompt-output)
- [Prompts overview (Microsoft Learn)](https://learn.microsoft.com/en-us/ai-builder/prompts-overview)
- [Create a custom prompt (Microsoft Learn)](https://learn.microsoft.com/en-us/ai-builder/create-a-custom-prompt)
- [Limits and configuration in Power Automate (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- [Optimize Power Automate triggers (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)
