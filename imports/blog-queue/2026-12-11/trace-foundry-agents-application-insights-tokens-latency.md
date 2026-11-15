---
title: "Trace Foundry Agents in Application Insights: Execution Traces, Tokens and Latency"
summary: "Connect Application Insights to a Microsoft Foundry project, view agent traces, read latency from spans and find token usage. Roles, menu paths and the gaps Microsoft's pages leave open."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [azure-ai-foundry, application-insights, ai-agent, opentelemetry]
keypoints:
  - "In the new Foundry portal, connect Application Insights under Build > Agents > Traces > Connect. After that, server-side tracing starts without code changes."
  - "Querying telemetry needs the Log Analytics Reader role on the Application Insights resource, plus Privileged Monitoring Data Reader if the tables are protected."
  - "Latency comes from span start and end times. The traces list shows durations per trace."
  - "Token counts appear in the conversation view. A classic OpenAI SDK page shows gen_ai.usage.input_tokens and output_tokens in a chat span."
  - "Traces can contain prompts, outputs and tool arguments. Message content recording is off by default in the classic agent SDK steps."
faq:
  - q: "How do I connect Application Insights to a Foundry project?"
    a: "According to Microsoft Learn, sign in to Microsoft Foundry with the New Foundry toggle on, open the project, select Build, Agents, then Traces, then Connect, and either pick an existing resource or create a new one. If the Connect button is missing, use Manage, Project details, Connected resources, Add connection, Application Insights."
  - q: "Which roles do I need to read traces?"
    a: "Microsoft Learn names Log Analytics Reader on the connected Application Insights resource. If the underlying Log Analytics tables are protected, it also names Privileged Monitoring Data Reader. The classic OpenAI SDK page adds that connecting an existing resource needs at least contributor access to the Foundry resource."
  - q: "How do I see latency for an agent run?"
    a: "Spans carry start and end times, so latency is derived from them. The new setup page says the traces list shows durations, the classic OpenAI SDK page lists a Duration column per trace, and selecting a trace lets you step through its spans. The classic agent tracing page does not document a dedicated latency field."
  - q: "Where do I find token usage?"
    a: "The new Foundry setup page says token information appears in the conversation view on the Traces page. The classic Learn page on tracing OpenAI SDK applications shows gen_ai.usage.input_tokens and gen_ai.usage.output_tokens attributes in a sample chat completion span, not in an agent run. The classic agent tracing page does not specify token counts."
  - q: "Is agent tracing generally available?"
    a: "Per the new Foundry setup page, tracing is generally available for prompt and hosted agents, while workflow and external agents are in preview. The classic Foundry agent tracing page carries a general preview notice for items marked preview, but the text I read marks no specific item."
---

Connect an Application Insights resource to the Foundry project, then open **Agents** > **Traces** to see each run as a trace with spans. Latency is the duration of a trace or span. Token counts show in the conversation view. Traces are stored in your own Application Insights resource, so retention and cost follow that resource. The steps below follow the current Foundry pages and note where the pages are silent.

## What you need first

- A Foundry project.
- An Azure Monitor Application Insights resource, new or existing.
- Access rights. The classic OpenAI SDK page says connecting an existing resource needs at least contributor access to the Foundry resource, and creating a new one needs the contributor role on the selected resource group. The new setup page lists only access to the connected Application Insights resource.
- To query telemetry: **Log Analytics Reader** on the Application Insights resource. If the Log Analytics tables are protected, also **Privileged Monitoring Data Reader**.

The classic OpenAI SDK page says new resources do not provision Application Insights automatically and that you associate one once per Foundry resource.

## Step 1: Connect Application Insights

1. Sign in to Microsoft Foundry and make sure the **New Foundry** toggle is on.
2. Open your project.
3. In the left navigation, select **Build** > **Agents**.
4. At the top, select **Traces**.
5. On the right, select **Connect**. Choose an existing resource and select **Connect**, or select **Create new** and finish the wizard.

If you do not see **Connect**, use **Manage** > **Project details** > **Connected resources** > **Add connection** > **Application Insights**.

## Step 2: Generate traffic and open a trace

Learn recommends server-side tracing. Once the resource is connected, Foundry enables it automatically and no code changes are needed. Traces appear within minutes. If they do not, wait a few minutes, send new requests and refresh.

Open **Agents** > **Traces**. You can search, filter and sort traces from the last 90 days. Select a trace to step through its spans. On the same page you can search by Response ID or Trace ID, then select a Conversation ID to see conversation history, response information and tokens, ordered actions, run steps, tool calls and inputs and outputs.

## Step 3: Read latency and token usage

**Latency.** A span has a start and end time, so latency follows from them. The new setup page says the traces list shows durations, and the classic OpenAI SDK page lists a **Duration** column per trace. Inside a trace, compare spans to find the slow step, such as a tool call or a model call.

**Tokens.** The new Foundry setup page says token information appears in the conversation view. For the underlying attribute names, the classic Learn page on tracing OpenAI SDK applications shows a sample chat completion span (not an agent run) with `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens`. The classic agent tracing page does not document token counts, and I found no page that lists every agent span attribute.

## Step 4: Add client-side tracing if you need app visibility

Server-side traces show what Foundry executed. If you also want spans from your own code, instrument the client. The new setup page lists different Python packages (`azure-ai-projects opentelemetry-sdk azure-core-tracing-opentelemetry`) and links to a separate client-side tracing page that I did not read. The classic page lists these packages:

```bash
pip install azure-ai-projects azure-identity
pip install azure-monitor-opentelemetry opentelemetry-sdk
```

The documented flow gets the connected connection string from the project and passes it to Azure Monitor:

```python
connection_string = project_client.telemetry.get_application_insights_connection_string()
configure_azure_monitor(connection_string=connection_string)
```

You can wrap your own functions in spans with `tracer.start_as_current_span(...)` and add attributes with `span.set_attribute(...)`. When several apps write to one Application Insights resource, set `OTEL_SERVICE_NAME`, then filter in the query with:

```kusto
| where cloud_RoleName == "service_name"
```

That filter is the only query the classic page shows. For other queries, work in the Application Insights resource directly.

## Server-side or client-side: how to decide (my own summary)

| Question | Server-side tracing | Client-side instrumentation |
|---|---|---|
| Setup | Connect Application Insights, no code | Install packages, call `configure_azure_monitor` |
| What you see | What Foundry executed: runs, steps, tool calls | Your own application code as extra spans |
| When it fits | You need to find slow or failing agent steps | You need one trace that spans your app and the agent |

Start with server-side tracing. Add client-side code only when the trace has gaps in your own code. The classic agent tracing page also describes framework integrations. Microsoft Agent Framework and Semantic Kernel have native tracing, while LangChain and LangGraph (Python only) use the `langchain-azure-ai` package. Microsoft notes that the LangChain and LangGraph v1 releases are under active development, so tracing behavior can change.

Local debugging is possible without cloud access. The classic page describes console tracing with a span exporter, and the Foundry Toolkit for VS Code provides a local OTLP-compatible collector.

## Handle sensitive data

Traces can contain user inputs, model outputs and tool arguments. Learn says to redact secrets and personal data before they reach telemetry. In the SDK steps, chat message content is recorded only if you set `AZURE_TRACING_GEN_AI_CONTENT_RECORDING_ENABLED` to `true`. The default is `False`, and the page warns the content might contain personal data.

## Typical problems

- **No Traces data.** The Application Insights resource is not connected, or no new traffic has run since connecting.
- **Traces visible in Foundry, queries return nothing in Log Analytics.** Check the Log Analytics Reader role and, for protected tables, Privileged Monitoring Data Reader.
- **Mixed apps in one resource.** Set a service name and filter on `cloud_RoleName`.
- **Evaluation results missing in the playground.** The classic page says playground evaluations are billed, expire after 24 hours and are not available in `australiaeast`, `japaneast`, `southindia` or `uksouth`.

## Related

- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Application Insights](https://www.m365.fm/entity/application-insights/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)
- [OpenTelemetry](https://www.m365.fm/entity/opentelemetry/)

## Sources

- [Set up tracing for AI agents in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup)
- [Trace and observe AI agents in Microsoft Foundry (classic)](https://learn.microsoft.com/en-us/azure/foundry-classic/how-to/develop/trace-agents-sdk)
- [View trace results for AI applications using OpenAI SDK (classic)](https://learn.microsoft.com/en-us/azure/foundry-classic/how-to/develop/trace-application)
