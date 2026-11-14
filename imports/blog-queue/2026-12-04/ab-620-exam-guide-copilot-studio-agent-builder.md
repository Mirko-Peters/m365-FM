---
title: "AB-620 Exam Guide: AI Agent Builder Associate, Skills Measured in Copilot Studio"
summary: "The AB-620 skills measured outline from Microsoft Learn with section weights: planning agents, agent flows, topics, tools, MCP, multi-agent work, evaluation and ALM, plus passing score and a study order."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [ab-620, copilot-studio, agent-flows, mcp]
keypoints:
  - "AB-620 covers designing and building integrated AI agent solutions in Copilot Studio. The passing score is 700 or greater."
  - "Integrate and extend agents carries the most weight at 40 to 45 percent: knowledge sources, tools, MCP, multi-agent collaboration and Azure."
  - "Plan and configure agent solutions is 30 to 35 percent and includes agent flows, human-in-the-loop flows and topics."
  - "Test and manage agents is 20 to 25 percent and covers evaluation test sets and application lifecycle management."
  - "The audience profile expects Power Fx, Dataverse, Power Platform environments, Microsoft 365 Copilot, Foundry and adaptive cards familiarity."
faq:
  - q: "Who is the AB-620 exam for?"
    a: "Microsoft Learn describes a professional developer or advanced builder who builds, extends and integrates custom agents for enterprise solutions, typically an IT application developer, consultant or ISV partner. Candidates should know Power Fx, Dataverse, Power Platform environments, Microsoft 365 Copilot, Microsoft Foundry and adaptive cards."
  - q: "How is AB-620 weighted?"
    a: "Per the Learn study guide: Plan and configure agent solutions 30 to 35 percent, Integrate and extend agents in Copilot Studio 40 to 45 percent, and Test and manage agents 20 to 25 percent."
  - q: "What score is needed and is the exam in beta?"
    a: "The study guide states a passing score of 700 or greater and does not label the exam as beta. It says most questions cover generally available features but the exam may include preview features that are commonly used."
  - q: "Does AB-620 cover MCP and multi-agent solutions?"
    a: "Yes. The skills measured list configuring MCP tools, and multi-agent collaboration from Copilot Studio, including integrating a Foundry agent, an existing agent and a Fabric data agent, and creating a multi-agent solution with the A2A protocol."
  - q: "Which date applies to the skills measured?"
    a: "The page I read gives no skills-measured update date. It shows ms.date 2026-04-09 and a footer update of 2026-10-16. The exam title also differs slightly between the page heading and its metadata, so confirm on the live certification page."
---

AB-620 is the Copilot Studio builder exam for people who extend agents with flows, tools, MCP and Azure services. This guide turns Microsoft's skills measured outline into a study order. It follows the Learn study guide and does not include exam questions.

## Exam facts

- **Exam:** AB-620, Designing and Building Integrated AI Agent Solutions in Copilot Studio. The page metadata uses a slightly different title, and a search listing shows "AI Solutions", so confirm on the live page.
- **Certification:** AI Agent Builder Associate.
- **Passing score:** 700 or greater.
- **Preview:** The page does not label the exam as beta. It says most questions cover generally available features, and the exam may include commonly used preview features.
- **Prerequisites:** None formal. The audience profile lists expected knowledge instead.
- **Practice:** A practice assessment is available on AI Skills Navigator after sign-in.

## Who it is for

Learn describes a professional developer or advanced builder who builds, extends and integrates custom agents, such as an IT application developer, consultant or ISV partner. You should know Power Fx, Dataverse, Power Platform environments and components, Microsoft 365 Copilot, Foundry and adaptive cards. You should also have intermediate knowledge of generative AI concepts (models, orchestration, RAG, MCP, A2A), prompt engineering and REST APIs.

## Weights

| Area | Weight |
|---|---|
| Plan and configure agent solutions | 30 to 35% |
| Integrate and extend agents in Copilot Studio | 40 to 45% |
| Test and manage agents | 20 to 25% |

## Area 1: Plan and configure agent solutions

- **Plan an agent solution.** Integration with enterprise systems, identity strategy, channels and deployment, responsible AI, security and governance, reusable components, and internal versus external audiences.
- **Create and monitor agent flows.** Create a flow, create a human-in-the-loop flow, configure actions and connectors, monitor flows, add input and output parameters, and implement error handling.
- **Configure topics.** Add agent flows and tools to a topic, format responses, use custom prompts and knowledge sources, send HTTP requests, configure the generative answers node and adaptive cards, and manage variables.

## Area 2: Integrate and extend agents (largest)

- **Enterprise knowledge sources.** Copilot connectors, Power Platform connectors and Azure AI Search.
- **Tools.** Configure and monitor computer use, configure MCP tools, add a tool from an existing custom connector, and add REST APIs.
- **Multi-agent collaboration.** Design multi-agent solutions, integrate a Foundry agent, an existing Copilot Studio agent and a Fabric data agent, and build a solution with the A2A protocol.
- **Azure integration.** Generative answers with Azure AI Search in Foundry, custom prompts using the Foundry model catalog, and monitoring with Application Insights.

## Area 3: Test and manage agents

- **Evaluate performance.** Create a test set, choose an evaluation method and review results.
- **ALM.** Create a solution, add existing agents to it, use environment variables, and implement and extend Power Platform Pipelines.

## Study order

1. Learn agent flows first, including the billing and trigger rules in the agent flows documentation, since flows appear in both Area 1 and tools.
2. Build one agent with a knowledge source, an MCP tool (Tools > Add a tool > New tool > Model Context Protocol) and a custom connector tool.
3. Build a two-agent setup that connects a Foundry agent.
4. Practice a solution with environment variables and a pipeline.
5. Take the practice assessment.

## Documentation facts that map to the outline

These points come from Learn pages on topics the outline names. They are anchors for study, not a prediction of exam content.

- **Agent flows.** Learn describes them as deterministic, each with a trigger and at least one action. To add a flow to an agent it must be a solution flow with the When an agent calls the flow trigger and the Respond to the agent action. Converting a cloud flow to an agent flow is one-way.
- **Human in the loop.** The agent flows overview lists approval requests and information requests among the action categories.
- **MCP tools.** Authentication options are None, API key and OAuth 2.0, with dynamic discovery, dynamic and manual OAuth types. Only streamable transport is supported. Data policies on Power Platform connectors also regulate MCP servers.
- **Event triggers.** They need generative orchestration, run with the maker's credentials, and count toward Copilot Credit consumption.

## How to read the outline

The bullets are skills, not topics to memorize. For each bullet, ask whether you have done it at least once in a trial environment. Items such as creating a test set, adding an environment variable or configuring computer use are quick to try and hard to recall from reading alone. Mark each bullet as done, read only, or not started, and keep the last group short in the final week.

## Cautions

- The outline mixes planning with hands-on items. Reading alone is not enough for Area 2.
- The study guide page also contains a second study-resources table that appears to belong to another exam. Ignore it and use the skills measured section.
- Copilot Studio changes often. Check the page date before you start.

## Related

- [AB-620](https://www.m365.fm/entity/ab-620/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Agent flows](https://www.m365.fm/entity/agent-flows/)
- [MCP](https://www.m365.fm/entity/mcp/)

## Sources

- [Study guide for Exam AB-620 (Microsoft Learn)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [Connect an agent to an existing MCP server (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent)
- [Agent flows overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
- [Event trigger overview (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/authoring-triggers-about)
