---
title: "Build a Declarative Agent for Microsoft 365 Copilot: Agents Toolkit Steps"
summary: "Build, provision and test a basic declarative agent for Microsoft 365 Copilot with the Microsoft 365 Agents Toolkit, plus prerequisites, instruction-writing guidance, the 8,000-character limit and what Microsoft Learn does not cover."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [copilot-extensibility, copilot-agent-builder]
keypoints:
  - "A declarative agent is defined by its purpose, instructions, knowledge and actions. The Learn tutorial builds one in Visual Studio Code with the Microsoft 365 Agents Toolkit."
  - "Provisioning fails if custom app upload is not enabled in the tenant. No minimum Agents Toolkit version is stated."
  - "Create a New Agent/App, choose Declarative Agent and No Action, then Provision in the Lifecycle pane and test at m365.cloud.microsoft/chat."
  - "The instruction guidance states an 8,000-character instruction limit and warns against moving instructions into SharePoint or other knowledge sources."
  - "Microsoft 365 Government tenants do not support publishing agents through Agents Toolkit. The tutorial does not describe publishing steps."
faq:
  - q: "What do I need to build a declarative agent with the Agents Toolkit?"
    a: "According to Microsoft Learn, a Microsoft 365 tenant where you can upload custom apps, Visual Studio Code and the Microsoft 365 Agents Toolkit extension. Learn says provisioning fails if custom app upload is not enabled."
  - q: "Who can use the agent from the tutorial?"
    a: "The tutorial targets licensed Microsoft 365 Copilot users. Learn adds that Microsoft 365 Copilot Chat users can be targeted too, with limited capabilities."
  - q: "How long can the instructions be?"
    a: "The Learn page on writing instructions states an 8,000-character instruction limit. It does not say whether formatting counts toward it."
  - q: "Does the tutorial cover publishing to all users?"
    a: "No. The tutorial covers create, provision and test. It only notes that Microsoft 365 Government tenants do not support publishing agents through Agents Toolkit."
  - q: "Can I build one without code?"
    a: "The guidance on instructions says it applies to agents built with Agent Builder in Microsoft 365 Copilot or with the Agents Toolkit. The tutorial page I read for this article does not cover Agent Builder or Copilot Studio steps."
---

To build a declarative agent with Microsoft's tutorial, install Visual Studio Code and the Microsoft 365 Agents Toolkit, create a new agent with the Declarative Agent template, provision it and test it in the Copilot app at m365.cloud.microsoft/chat. This article follows the Learn tutorial and adds the guidance Learn gives on writing instructions.

## What a declarative agent is

Microsoft Learn describes a declarative agent as a goal-directed conversational experience powered by Microsoft 365 Copilot. You define its purpose, instructions, knowledge and supported actions for a business scenario. Learn groups the definition into identity and behavior, knowledge, capabilities, and host and distribution metadata.

The overview page also says to check first whether an existing, approved agent can already do the job. It advises recording dependencies such as identity, permissions, consent, data boundaries, language, licensing, owner and support contact. It says an agent might not be the right component when the solution requires complete control of the orchestration, model, hosting or user interface, and points to custom engine agents for that case.

## Prerequisites

- A Microsoft 365 tenant where you can upload custom apps. Provisioning fails if custom app upload is not enabled.
- Visual Studio Code.
- The Microsoft 365 Agents Toolkit extension for Visual Studio Code.
- Familiarity with the Teams Store validation guidelines, which the tutorial lists for compliance, performance, security and user experience.

The tutorial's screenshots use a release version of the toolkit and say prerelease versions may differ. It states no minimum version.

## Create the agent

1. Open Visual Studio Code.
2. Select **Microsoft 365 Agents Toolkit** > **Create a New Agent/App**.
3. Select **Declarative Agent**.
4. Select **No Action** to create a basic agent.
5. Select **Default folder** for the project root.
6. Enter an **Application Name**. The tutorial uses `My Agent`.

## Provision

In the new Visual Studio Code window, select **Microsoft 365 Agents Toolkit**, then select **Provision** in the **Lifecycle** pane. The prerequisites say Provision fails if custom app upload is not enabled.

## Test

1. Go to https://m365.cloud.microsoft/chat.
2. Next to **New Chat**, select the conversation drawer icon.
3. Select your agent, for example **My Agent**.
4. Ask a question. The template's reply in the tutorial is a thank-you message from the Agents Toolkit.

## Write better instructions

Learn has a separate page on instructions. It applies to developers and makers who use Agent Builder or the Agents Toolkit. For Copilot Studio agents, the page points to separate guidance on generative orchestration.

- **Limit:** the page states an 8,000-character instruction limit. It warns against storing instructions in SharePoint or other knowledge sources, because those are not treated as trusted instruction content and can be blocked, truncated or sanitized.
- **Structure:** purpose, general guidelines (directions, tone, restrictions) and skills, plus optional parts such as step-by-step instructions, error handling, interaction examples and nonstandard terms.
- **Steps:** give each workflow step a Goal, an Action and a Transition.
- **Grounding:** set `discourage_model_knowledge` to `true` in the `special_instructions` object of the manifest to make the agent rely on configured knowledge sources.
- **Wording:** use precise verbs such as ask, search, send, check or use, and always specify tone, verbosity and output format.

## Test and iterate

Learn describes a loop of create, publish (subject to responsible AI validation), test and iterate. Its test list includes comparing results with Microsoft 365 Copilot, checking that conversation starters work, verifying that the agent follows the instructions and trying prompts outside the starters. Learn also warns that Copilot changes models over time, so behavior can shift.

## Limits and gaps

- Microsoft 365 Government tenants do not support publishing agents through Agents Toolkit.
- Copilot Chat users have limited capabilities.
- The tutorial page does not describe publishing steps, admin approval, manifest schema, capabilities or action configuration.
- Licensing and quotas are not described on the overview page. See Microsoft's licensing documentation for those.

## Availability in Government clouds

The overview page lists national cloud support. GCC has full declarative agent support. In GCC High, pro-code agents built with the Agents Toolkit are supported, and Agent Builder is now also available. In DoD, support is limited to pro-code agents built with the Agents Toolkit, and Agent Builder is not available for declarative agents. Check this before you plan a rollout in a Government tenant.

## Related

- [Copilot extensibility](https://www.m365.fm/entity/copilot-extensibility/)
- [Copilot Agent Builder](https://www.m365.fm/entity/copilot-agent-builder/)

## Sources

- [Create declarative agents by using Microsoft 365 Agents Toolkit and JSON (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/copilot/extensibility/build-declarative-agents)
- [Write effective instructions for declarative agents (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/copilot/extensibility/declarative-agent-instructions)
- [Declarative agents for Microsoft 365 Copilot (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/copilot/extensibility/overview-declarative-agent)
