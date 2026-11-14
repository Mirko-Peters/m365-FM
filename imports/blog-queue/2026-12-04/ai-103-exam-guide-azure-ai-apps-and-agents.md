---
title: "AI-103 Exam Guide: Developing AI Apps and Agents on Azure, Skills Measured"
summary: "The AI-103 skills measured outline from Microsoft Learn with section weights, what each area covers, who the exam is for, passing score, preview-feature policy and how to plan your study."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [ai-103, azure-ai-foundry, foundry-agent-service, ai-agent]
keypoints:
  - "Exam AI-103 is Developing AI Apps and Agents on Azure. Learn's skills measured are dated April 16, 2026, and the passing score is 700 or greater."
  - "Implement generative AI and agentic solutions carries the most weight at 30 to 35 percent, followed by Plan and manage an Azure AI solution at 25 to 30 percent."
  - "Vision, text analysis and information extraction each weigh 10 to 15 percent, so they can't be skipped."
  - "The audience profile expects Python app development experience and familiarity with Microsoft Foundry, general AI, generative AI and Azure services."
  - "Most questions cover generally available features, but the exam may include preview features that are commonly used."
faq:
  - q: "Who is the AI-103 exam for?"
    a: "Microsoft Learn describes the candidate as an Azure AI engineer who builds, manages and deploys agents and AI solutions that use Microsoft Foundry. You should have experience developing apps in Python and be familiar with general AI, generative AI and Azure services. The study guide lists no formal prerequisites."
  - q: "How is the exam weighted?"
    a: "Per the Learn study guide: Plan and manage an Azure AI solution 25 to 30 percent, Implement generative AI and agentic solutions 30 to 35 percent, Implement computer vision solutions 10 to 15 percent, Implement text analysis solutions 10 to 15 percent, and Implement information extraction solutions 10 to 15 percent."
  - q: "What score do I need to pass?"
    a: "The Learn study guide states a passing score of 700 or greater. It also says Microsoft associate, expert and specialty certifications expire annually and can be renewed by passing a free online assessment on Microsoft Learn."
  - q: "Will preview features appear on the exam?"
    a: "The study guide says most questions cover generally available features, and the exam may contain questions on preview features if they are commonly used. Because Foundry changes quickly, check the skills measured date on the live page before you study."
  - q: "Is there an official practice assessment?"
    a: "Yes. The certification page says the Practice Assessment is available on AI Skills Navigator with a new upgraded experience, and that you must be signed in to AI Skills Navigator to launch it. Learn also offers an exam sandbox that shows the look and feel of the exam and its question types."
---

AI-103 tests whether you can plan, build and operate AI apps and agents on Azure with Microsoft Foundry. This guide turns the official skills measured outline into a study plan. It lists the areas and weights from Microsoft Learn, and it does not contain exam questions or recalled content.

## Exam facts

From the Learn study guide and the certification page:

- **Exam:** AI-103, Developing AI Apps and Agents on Azure.
- **Certification:** Microsoft Certified: Azure AI Apps and Agents Developer Associate (intermediate level, per the certification page).
- **Skills measured as of:** April 16, 2026, according to the study guide.
- **Passing score:** 700 or greater.
- **Duration and format:** 120 minutes. The exam is proctored and may include interactive components.
- **Languages:** The certification page lists English, Chinese (Simplified), Chinese (Traditional), French, German, Japanese, Korean, Italian, Portuguese (Brazil) and Spanish.
- **Retake:** After a failed attempt you can retake after 24 hours. The wait for later retakes varies, see Microsoft's retake policy.
- **Language:** English first. Localized versions are updated about eight weeks later, though not always on time. If your language isn't available you can request an additional 30 minutes.
- **Renewal:** Associate certifications expire annually and renew through a free online assessment.

## Who it is for

Learn describes an Azure AI engineer who builds, manages and deploys agents and AI solutions on Foundry. Responsibilities include planning and managing Azure AI solutions, generative AI and agentic solutions, computer vision, text analysis and information extraction. You should have Python experience.

## Skills measured and weights

| Area | Weight |
|---|---|
| Plan and manage an Azure AI solution | 25 to 30% |
| Implement generative AI and agentic solutions | 30 to 35% |
| Implement computer vision solutions | 10 to 15% |
| Implement text analysis solutions | 10 to 15% |
| Implement information extraction solutions | 10 to 15% |

## Area 1: Plan and manage an Azure AI solution

Four groups of skills:

- **Choose Foundry services.** Pick models for each task, choose services for generation, grounding, vector search, agent workflows and multimodal work, and choose retrieval, indexing, memory and tool integration.
- **Set up solutions in Foundry.** Design Azure infrastructure, choose deployment options, configure model and agent deployments, and integrate projects with CI/CD pipelines.
- **Manage, monitor and secure.** Quotas, scaling, rate limits and cost, monitoring of performance, drift, safety and grounding, and security such as managed identity, private networking, keyless credentials and role policies.
- **Responsible AI.** Safety filters and guardrails, evaluators and safety evaluations, auditing through trace logging and approval workflows, and governing agent behavior with oversight modes and tool-access controls.

## Area 2: Implement generative AI and agentic solutions

This is the biggest area. It covers:

- **Generative apps.** Deploy and consume models, implement retrieval-augmented generation, design tool-augmented workflows, evaluate quality and safety, and connect apps to a Foundry project with the SDKs.
- **Agents.** Define roles, goals, conversation tracking and tool schemas. Build agents with retrieval, function calling and memory. Integrate APIs, knowledge stores and search. Implement orchestrated multi-agent solutions and semiautonomous workflows with safeguards and approval flows. Monitor and evaluate deployed agents.
- **Optimize and operationalize.** Prompt engineering and model parameters, reflection and self-critique loops, observability with tracing and token analytics, and orchestrating several models or hybrid LLM and rules approaches.

## Area 3: Computer vision (10 to 15%)

Image and video generation from text and reference media, image editing such as inpainting, multimodal understanding (captions, visual question answering, alt text, Content Understanding for visual features and video), and responsible AI for visual content, including indirect prompt injection through text embedded in images.

## Area 4: Text analysis (10 to 15%)

Language model text analysis (entities, topics, summaries, structured JSON, sentiment, tone, safety, translation) and speech (speech to text and text to speech for agents, custom speech models, multimodal reasoning from audio, speech translation).

## Area 5: Information extraction (10 to 15%)

Retrieval and grounding pipelines (ingesting and indexing documents, images, audio and video, semantic, hybrid and vector search, enrichment skills, RAG ingestion with OCR) and content extraction from documents using Content Understanding analyzers.

## Foundry facts to anchor Area 2

The study guide is an outline, so pair it with the product documentation. The Foundry Agent Service overview on Learn gives concrete anchors:

- Agent types are prompt agents, voice-based prompt agents and hosted agents.
- Built-in tools include web search, file search, code interpreter and memory. Custom tools include functions, OpenAPI specs and MCP servers.
- The development lifecycle on the page runs Create, Test, Trace, Evaluate, Optimize, Publish, Monitor.
- A2A protocol v1.0 is generally available, while v0.3 remains preview.
- Agents get an Entra identity, with role-based access control, content filters, guardrails and network isolation.

These map to outline items on tools, multi-agent solutions, observability, security and responsible AI. They are documentation facts, not a list of what the exam asks.

## A study plan

1. Spend the first block on Area 2, because it is the largest. Build one prompt agent and one agent with function calling.
2. Then Area 1, with attention to security and responsible AI, since those bullets are specific.
3. Give the three 10 to 15 percent areas an equal slice each. Together they weigh 30 to 45 percent.
4. Take the Practice Assessment on AI Skills Navigator, which requires signing in there, and try the exam sandbox to see the question types. Then fill the gaps they show.

Learn's page does not list a retirement date and gives no formal prerequisites.

## Common mistakes

- Studying only agents. The other areas add up to more than a third of the exam.
- Ignoring the skills measured date. The outline can change.
- Learning from outdated product names. Product and service names change over time, so check the current names in the documentation.

## Related

- [AI-103](https://www.m365.fm/entity/ai-103/)
- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Foundry Agent Service](https://www.m365.fm/entity/foundry-agent-service/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)

## Sources

- [Study guide for Exam AI-103 (Microsoft Learn)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [Foundry Agent Service overview (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)
- [Microsoft Certified: Azure AI Apps and Agents Developer Associate (Microsoft Learn)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
