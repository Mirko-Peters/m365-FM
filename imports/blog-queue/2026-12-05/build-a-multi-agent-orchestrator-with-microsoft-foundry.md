---
title: "Build a Multi-Agent Orchestrator with Microsoft Foundry: Options and Dates"
summary: "Which Microsoft options exist for multi-agent orchestration in Foundry: workflows, Microsoft Agent Framework patterns, hosted agents and A2A, plus the retirement dates Microsoft Learn lists for older approaches."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [microsoft-foundry, ai-agent, microsoft-agent-framework, agent-orchestrator]
keypoints:
  - "Foundry workflows, a visual builder for orchestrating agents, are in preview and scheduled to lose the visual designer and in-portal execution on December 1, 2026."
  - "Microsoft recommends Microsoft Agent Framework for new workflows, with five built-in patterns: sequential, concurrent, handoff, group chat and magentic."
  - "Hosted agents run your own orchestration code in Foundry with a managed endpoint, a dedicated Entra identity and observability."
  - "Connected agents from Foundry Agent Service (classic) are deprecated and set to be retired on March 31, 2027, and allow a depth of only 2."
  - "Pick a pattern by task shape, test with a small number of agents, and keep secrets out of prompts and saved variables."
faq:
  - q: "What are the ways to orchestrate several agents in Microsoft Foundry?"
    a: "Microsoft Learn describes workflows in the Foundry portal, which are in preview, orchestration patterns in Microsoft Agent Framework, hosted agents for custom orchestration code, the A2A protocol for agent-to-agent communication, and the older connected agents in classic Foundry Agent Service, which are deprecated."
  - q: "Are Foundry workflows safe to build on?"
    a: "Microsoft Learn labels them preview, with no SLA, and says the visual designer and in-portal workflow execution are not supported after December 1, 2026. New workflows should use Microsoft Agent Framework. Check the current page for the status before you start, because this date is close."
  - q: "Which orchestration patterns does Microsoft Agent Framework provide?"
    a: "The Learn overview lists five: sequential, where agents execute one after another; concurrent, where they execute in parallel; handoff, where agents transfer control based on context; group chat, where they collaborate in a shared conversation; and magentic, where a manager agent coordinates specialized agents."
  - q: "How do I keep a human in the loop?"
    a: "Microsoft Learn says orchestrations in Agent Framework support human-in-the-loop interactions through tool approval and request info. Agents can use approval-required tools that pause the workflow for human review before execution. Foundry workflows also offer a Human in the loop template that asks the user a question and waits."
  - q: "What happens to connected agents?"
    a: "Microsoft Learn says agents (classic) are deprecated and will be retired on March 31, 2027, and recommends moving to the generally available Microsoft Foundry Agents Service. The page also lists limits: no local functions, citations that may not pass through and a maximum depth of 2."
---

For a new multi-agent build on Microsoft Foundry, the documented direction is Microsoft Agent Framework for the orchestration logic, with Foundry hosting the agents. The visual workflow builder in the Foundry portal is still described, but Microsoft Learn marks it preview and sets a retirement date of December 1, 2026 for the visual designer and in-portal execution. This article compares the options, shows what the pages say about each and flags the dates to check before you start.

Note on sources: Microsoft Learn pages in this area change often. The statements below come from pages read on November 14, 2026. Re-check the status and dates on the day you build.

## Why use several agents at all

Learn's workflow page says that orchestrating multiple specialized agents is more robust than a single agent for complex tasks. A Microsoft Learn training module on multi-agent orchestration adds a caution: it asks learners to decide when multi-agent architectures earn their coordination cost. Start with one agent. Split only when a single agent fails on scope, tools or reliability.

## The options, side by side

| Option | What it is | Status and dates per Learn |
|---|---|---|
| Foundry workflows | Visual builder for declarative sequences that orchestrate agents and logic | Preview. Visual designer and in-portal execution not supported after December 1, 2026 |
| Microsoft Agent Framework orchestrations | Built-in patterns in code or declarative YAML | Recommended for new workflows |
| Hosted agents | Your own code packaged as a container image or zip, run in Foundry | The agent overview does not label it preview or GA |
| A2A protocol | Agent-to-agent communication | v1.0 generally available, v0.3 preview |
| Connected agents (classic) | Main agent delegates to subagents | Deprecated, retirement March 31, 2027 |

## Orchestration patterns in Agent Framework

The Learn overview lists five patterns:

- **Sequential:** agents execute one after another in a defined order.
- **Concurrent:** agents execute in parallel.
- **Handoff:** agents transfer control to each other based on context.
- **Group chat:** agents collaborate in a shared conversation.
- **Magentic:** a manager agent dynamically coordinates specialized agents.

The overview page does not say when to use each pattern, so match them to the task yourself. A report that needs research, then drafting, then review fits sequential. Independent checks on the same input fit concurrent. A support case that moves between specialists fits handoff.

For human control, Learn says orchestrations support tool approval and request info. Agents can use approval-required tools that pause the workflow for human review before execution.

## If you still use the Foundry workflow builder

Learn describes these steps:

1. Sign in to Microsoft Foundry with the **New Foundry** toggle on.
2. Select **Build**, then **Create new workflow** and a type such as **Sequential**.
3. Assign an agent to each agent node, choosing an existing one or creating one.
4. Select **Save**. Foundry does not save automatically.
5. Select **Run Workflow** and test in the chat window.

Prerequisites are an Azure subscription, a Foundry project and at least the Contributor role on the project. Without the role, the **Workflows** option may not be visible. Templates are Human in the loop, Sequential and Group chat. Node types include Agent, Logic, Data transformation and Basic chat. Hosted agents are not supported in the workflow designer.

Learn gives three migration paths before December 1, 2026: Microsoft Agent Framework, which is recommended and runs as a hosted agent; Azure Logic Apps for a visual designer; and agent-to-agent for lightweight hand-offs. Before migrating, switch to the YAML view and export the file, since it is the portable artifact.

## Hosted agents and identity

According to the Foundry Agent Service overview, hosted agents carry your own code, built with Agent Framework, LangGraph, the OpenAI Agents SDK, the Anthropic Agent SDK or custom code. Foundry provides a managed endpoint, autoscaling, a dedicated Entra identity, session state and observability. The page names hosted agents as the place for custom orchestration logic and multi-agent systems.

## Why connected agents are not a good base

Connected agents let a main agent delegate to subagents using natural-language routing. Learn lists limits: no local functions, citations that may not pass from subagents to the main agent, and a maximum depth of 2, meaning subagents cannot have their own subagents. The page also says agents (classic) are deprecated.

## A practical build order

1. Write the task as steps and decide which steps need their own agent.
2. Pick a pattern from the five above.
3. Build in Agent Framework, with approval-required tools for risky actions.
4. Host the result as a hosted agent so Foundry provides identity and observability.
5. Test with real inputs, then add agents one at a time.

## Typical mistakes

- Starting a new project on a preview builder with a known retirement date.
- Putting secrets in prompts, JSON schemas or saved variables. Learn says not to.
- Adding agents before one agent has been proven insufficient.
- Forgetting to select Save in the visual builder.

## What the pages do not say

The pattern overview gives no preview or GA status and no code. The training module on multi-agent orchestration was available only as its introduction, so I did not read its implementation units.

## Related

- [Microsoft Foundry](https://www.m365.fm/entity/microsoft-foundry/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)
- [Microsoft Agent Framework](https://www.m365.fm/entity/microsoft-agent-framework/)
- [Agent orchestrator](https://www.m365.fm/entity/agent-orchestrator/)

## Sources

- [Workflows in Microsoft Foundry (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow)
- [Agent Framework orchestrations (Microsoft Learn)](https://learn.microsoft.com/agent-framework/workflows/orchestrations)
- [Microsoft Foundry Agent Service overview (Microsoft Learn)](https://learn.microsoft.com/azure/foundry/agents/overview)
- [Connected agents, classic (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/how-to/connected-agents)
- [Implement advanced multi-agent orchestration patterns in Microsoft Foundry (Microsoft Learn)](https://learn.microsoft.com/en-us/training/modules/aaai-implement-multi-agent-orchestration-azure-ai-foundry/1-introduction)
