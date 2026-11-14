---
title: "Copilot Studio Agent Flows vs Power Automate Cloud Flows: Which to Use"
summary: "Agent flows and Power Automate cloud flows both automate processes, but they differ in where you manage them, how they are billed and what they can do. Here is what Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [copilot-studio, power-automate, agent-flows, ai-agent]
keypoints:
  - "Learn describes agent flows as deterministic: the same input always produces the same output. An agent decides when to call them."
  - "Agent flows are managed in Copilot Studio and billed through Copilot Studio capacity. Cloud flows stay in Power Automate and use its billing."
  - "Agent flows can't be copied, shared, have co-owners or give run-only permissions in Copilot Studio, unlike cloud flows."
  - "To add a flow to an agent, it must be a solution flow with the When an agent calls the flow trigger and the Respond to the agent action."
  - "Converting a cloud flow to an agent flow is one-way. You can't reverse it because the billing changes."
faq:
  - q: "What is the difference between an agent flow and a cloud flow?"
    a: "Microsoft Learn's Copilot Studio FAQ says agent flows focus on AI-driven automation, are billed through Copilot Studio based on consumption, and can't be copied, shared, have co-owners or give run-only permissions in Copilot Studio. Cloud flows offer a wide range of connectors and actions and suit general automation, alone or together with agent flows."
  - q: "Do I need a Power Automate license to build agent flows?"
    a: "No. According to the Copilot Studio FAQ on Microsoft Learn, agent flows are billed in Copilot Studio based on usage and are not included entitlements in Power Automate. Learn also says agent flows are premium flows that can use premium connectors."
  - q: "Why don't I see my Power Automate flows in Copilot Studio?"
    a: "Learn explains that the Copilot Studio Flows page only shows agent flows created in Copilot Studio. Flows created in Power Automate must be managed in Power Automate unless you convert them to agent flows."
  - q: "Can I convert a cloud flow into an agent flow and back?"
    a: "You can convert a cloud flow to an agent flow, but not back. Learn calls it a one-way operation because the flow's billing changes. The flow must be in a solution and the environment needs available Copilot Studio capacity, prepaid or pay-as-you-go."
  - q: "Can agent flows call desktop flows?"
    a: "The Copilot Studio FAQ says you can't call desktop flows from agent flows at this time. The FAQ was last updated on 2026-05-27, so check the current page before you rely on that."
---

Use an **agent flow** when you want a deterministic automation that is built and billed in Copilot Studio and called by an agent as a tool. Keep a **Power Automate cloud flow** when you want to manage it in Power Automate, stay on Power Automate billing or share it with co-owners. Microsoft Learn does not give a formal decision tree, so the guidance below combines what its pages document, and says where they are silent.

## What each one is, according to Learn

**Agent flows** are part of the Copilot Studio standard harness experience. Learn describes them as deterministic ("the same input always produces the same output") and says each one has a trigger and at least one action. You build them in the Designer, a drag-and-drop canvas. Flows live in solutions, which give you drafts, versioning, export and import.

Action categories named on the page:

- AI capabilities, such as generating text, processing documents, running a prompt or calling an agent
- Human in the loop, such as approval requests or information requests
- Built-in tools, such as loops, branching, data operations and child flows
- Connectors for Microsoft 365, third-party services and custom connectors

**Cloud flows** are the general Power Automate automation. Learn's FAQ says they offer a wide range of connectors and actions and can be used independently or together with agent flows for end-to-end automation.

## Side-by-side

| Aspect | Agent flow | Power Automate cloud flow |
|---|---|---|
| Managed in | Copilot Studio | Power Automate |
| Billing | Copilot Studio consumption, no individual license | Power Automate billing |
| Sharing | Can't be copied, shared, co-owned or given run-only permissions in Copilot Studio | Supported in Power Automate |
| Connectors | Premium connectors allowed | Wide range |
| Desktop flows | Can't be called at this time | Not covered by the pages I read |
| Conversion | Not reversible | Can be converted to an agent flow |

The table only includes what the Learn pages state. Where the right column says "not covered", Microsoft's agent flow pages simply do not discuss it.

## Agents versus flows

An agent decides what to do from its instructions. A flow does what its steps say. Learn's trigger documentation says an agent uses its instructions to choose actions or topics based on an event payload. An agent flow is one of the things it can choose, which is why Learn lists the trigger **When an agent calls the flow** for flows added as tools.

The FAQ also compares agent flows with topics. Both are deterministic pathways. Topics are optimized for conversation, and agent flows are optimized for business processes and non-conversational work.

## When to choose which

These points follow from the documented differences:

- **Choose an agent flow** when an agent should call a repeatable process as a tool, you want it managed next to the agent in Copilot Studio, and you accept capacity-based billing.
- **Choose a cloud flow** when you need co-owners, run-only permissions or copying, or the flow must stay on Power Automate billing.
- **Convert a cloud flow** only after checking the billing change, because you can't go back.

## Requirements to use a flow from an agent

Learn's FAQ states that to add a flow to an agent, it must be a solution flow and contain the **When an agent calls the flow** trigger and the **Respond to the agent** action. An agent flow can be added as an action to any of your agents.

## How billing works

Learn says flows consume Copilot Studio capacity for each action they execute. You can review usage in the Power Platform admin center under **Licensing** > **Copilot Studio** with the **Agent flow actions** metric.

When an agent runs an agent flow:

- From a topic, it uses one **Classic answer** plus the agent flow actions.
- Through generative orchestration, it uses one **Autonomous action** plus the agent flow actions.
- From the agent's embedded test chat, no agent flow capacity is used.

The caveat people miss: when an environment has no Copilot Credits, new agent flow runs are blocked. Runs started while a user with a Microsoft 365 Copilot license is chatting with the agent are not affected. Runs an agent starts autonomously, for example after an event trigger, are charged and can be blocked even if your users have Microsoft 365 Copilot licenses. Learn recommends enabling pay-as-you-go billing to avoid interruption.

## How to convert a cloud flow

Learn gives these steps:

1. Make sure the flow is in a solution in the target environment.
2. Select **Edit**.
3. Change the plan to **Copilot Studio**.
4. Select **Save** and confirm.

The environment must have Copilot Studio capacity available. You can only convert to an agent flow, not to the newer workflow format.

## Typical mistakes

- Looking for a Power Automate flow on the Copilot Studio Flows page. It only lists agent flows made in Copilot Studio.
- Converting a flow without telling the owner of the billing plan.
- Expecting to share an agent flow with co-owners the way you would a cloud flow.
- Assuming a Microsoft 365 Copilot license covers autonomous runs.

The pages I read do not give timeouts, run duration or action limits for agent flows, so check the current limits documentation before you design long-running processes.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Agent flows](https://www.m365.fm/entity/agent-flows/)
- [Copilot Credits](https://www.m365.fm/entity/copilot-credits/)

## Sources

- [Agent flows overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
- [Agent flows FAQ (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs)
- [Event trigger overview (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/authoring-triggers-about)
