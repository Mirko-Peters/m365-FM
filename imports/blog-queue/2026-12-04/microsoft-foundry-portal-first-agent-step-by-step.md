---
title: "Microsoft Foundry Portal Tour: Build Your First Agent Step by Step"
summary: "A walkthrough of the Microsoft Foundry portal for a first prompt agent: project, model deployment, playground, instructions, web search tool, save as agent and preview, with roles, agent types and cleanup."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [microsoft-foundry, azure-ai-foundry, foundry-agent-service, ai-agent]
keypoints:
  - "Foundry Agent Service offers prompt agents, voice-based prompt agents and hosted agents. A prompt agent is configuration only: instructions, a model and tools."
  - "The Microsoft Learn lab opens ai.azure.com, turns on New Foundry, picks or creates a project and deploys a chat model such as gpt-5-mini."
  - "In the playground you add instructions and the Web search tool, then select Save as agent. The YAML tab shows the model, instructions and tools."
  - "Creating a project for yourself needs a role such as Foundry Account Owner or Foundry Owner on the subscription or resource group."
  - "Delete the Azure resources when you finish exploring, to avoid ongoing charges."
faq:
  - q: "What do I need before I open the Foundry portal?"
    a: "The Microsoft Learn lab lists an Azure subscription with permission to create a Foundry project and resources, quota for a chat model in the project's region, and a region from the AI Foundry recommended list. It estimates roughly 40 minutes for the full exercise, with the portal steps coming first."
  - q: "Which role creates a project?"
    a: "Microsoft Learn says creating a project for yourself needs a role that can create a Foundry resource, such as Foundry Account Owner or Foundry Owner on the subscription or resource group. For a team, you need a role that can make role assignments, such as Owner. Azure AI User, Owner, Account Owner and Project Manager were renamed to the Foundry equivalents."
  - q: "What types of agents can Foundry Agent Service run?"
    a: "The Foundry Agent Service overview lists prompt agents, which are defined by instructions, model and tools, voice-based prompt agents, and hosted agents, where you ship your own code as a container image or zip file. It states preview status for voice-based agents, the Microsoft Copilot harness and the agent optimizer."
  - q: "Where do I see the agent definition?"
    a: "In the Learn lab, after you select Save as agent, the agent opens in its own playground. The YAML tab on the right shows the model, instructions and tools, and the Details tab shows a Responses endpoint that later client-app steps use."
  - q: "Will it cost money?"
    a: "The Learn lab tells you to delete the Azure resources when you finish exploring to avoid ongoing charges. It doesn't give prices. Check the Foundry pricing page and your subscription's cost view for numbers."
---

The shortest path to a first Foundry agent is a prompt agent built in the portal: pick a project, deploy a model, test it in the playground, add instructions and a tool, then save it as an agent. This walkthrough follows Microsoft's official lab, adds the roles and agent types from the Learn pages, and flags what changes with your environment.

## Know the agent types first

Microsoft Foundry Agent Service is described on Learn as a managed platform for building, deploying and scaling agents. It offers three agent types:

| Type | What it is |
|---|---|
| Prompt agents | Defined through configuration: instructions, model and tools. Foundry runs them, with no code or infrastructure to manage |
| Voice-based prompt agents | Real-time spoken agents using Voice Live |
| Hosted agents | Your own code (Agent Framework, LangGraph, OpenAI Agents SDK, Anthropic Agent SDK or custom) shipped as a container image or .zip file |

Learn recommends the prompt agent quickstart or the Foundry portal for a first agent. The overview marks voice-based agents, the Microsoft Copilot harness and the agent optimizer as preview. It doesn't state a status for prompt or hosted agents, so check the live page before planning production use.

## Permissions

Per Microsoft Learn:

- To create a project for yourself, you need a role that can create a Foundry resource, such as **Foundry Account Owner** or **Foundry Owner** on the subscription or resource group.
- To create a project for a team, you need a role that can make role assignments, such as **Owner**, plus the team's email addresses or Microsoft Entra security group IDs.
- Azure AI User, Azure AI Owner, Azure AI Account Owner and Azure AI Project Manager are now **Foundry User**, **Foundry Owner**, **Foundry Account Owner** and **Foundry Project Manager**. Role IDs and permissions are unchanged.

## Step by step in the portal

The Microsoft Learn lab "Develop your first AI agent in Microsoft Foundry" uses these steps.

1. **Open the portal.** Go to `https://ai.azure.com` and sign in with your Azure credentials. Close tip panes.
2. **Turn on the new portal.** In the top toolbar, turn on **New Foundry** if it isn't on.
3. **Pick or create a project.** Use the default project if one exists. Otherwise create one with a unique name, expand **Advanced options** and set the Foundry resource name, subscription, resource group and an AI Foundry recommended region.
4. **Deploy a model.** On **Home**, select **Explore models**, search for `gpt-5-mini`, open it and select **Deploy** with default settings. If you lack quota, the lab suggests a custom deployment, another chat model such as `gpt-5-nano` or `gpt-5.4-mini`, or a project in another region.
5. **Test in the playground.** After deployment the playground opens. Ask a question and a follow-up to confirm context is kept. **New chat** clears the history.
6. **Add instructions.** In the **Instructions** box on the left, tell the model what it is for and what to refuse. Test with an on-topic and an off-topic question.
7. **Add a tool.** Expand **Tools**, and in the **Add** drop-down select **Web search**. Test with a question that needs live results.
8. **Save as agent.** Select **Save as agent** at the top right and name it. The agent opens in its own playground, with a **YAML** tab showing the model, instructions and tools.
9. **Preview it.** In the **Publish** drop-down select **Preview web app**, which opens in a new tab.

The **Details** tab of the agent shows a **Responses** endpoint, which the lab's later client-app steps use.

## Create the resource from the command line instead

Microsoft's quickstart for resources shows the Azure CLI route and needs Azure CLI 2.80.0 or later. Points that cause failures:

- `--allow-project-management` can't be changed after the resource is created.
- `--assign-identity` is required. Without it, project creation fails with a managed-identity error.
- `--custom-domain` must be globally unique. A conflict returns `CustomDomainInUse`.
- `DeploymentModelNotSupported` means the model, version or SKU isn't available in your region.

The quickstart also says to create the project in **West US 3** if you want to try an instant model (preview), which skips the model deployment step.

## Tools you can add later

The overview lists built-in tools (web search, file search, code interpreter, memory) and custom tools (functions, OpenAPI specs, MCP servers). Toolboxes group tools behind one managed MCP-compatible endpoint with centralized authentication, governance and versioning. Tool authentication can be key-based, Microsoft Entra, OAuth On-Behalf-Of passthrough, or unauthenticated where appropriate.

## After the first agent

Learn's overview describes a development lifecycle of Create, Test, Trace, Evaluate, Optimize, Publish and Monitor. The portal lab covers the first two stages and a preview. Before sharing an agent, plan the rest: how you will trace runs, which evaluations you will run, and who can use the published endpoint. Learn says published agents are versioned with stable endpoints and can be shared through Microsoft Teams, Microsoft Copilot and the Entra Agent Registry. Each agent also gets an Entra identity, with role-based access control, content filters and guardrails.

## Common mistakes

- Starting without model quota in the project's region.
- Treating a preview feature as production-ready.
- Forgetting to clean up. The lab says to delete the Azure resources when you finish.
- Using old role names in scripts. Learn recommends the role GUIDs in code during the rename rollout.

I could not confirm portal menu names beyond those in the lab. Foundry's portal changes often, so match screens to the live Learn page.

## Related

- [Microsoft Foundry](https://www.m365.fm/entity/microsoft-foundry/)
- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Foundry Agent Service](https://www.m365.fm/entity/foundry-agent-service/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)

## Sources

- [Foundry Agent Service overview (Microsoft Learn)](https://learn.microsoft.com/azure/foundry/agents/overview)
- [Develop your first AI agent in Microsoft Foundry (Microsoft Learning lab)](https://microsoftlearning.github.io/mslearn-agent-quickstart/Instructions/Labs/01b-create-first-agent.html)
- [Quickstart: create Foundry resources (Microsoft Learn)](https://learn.microsoft.com/en-ca/azure/foundry/tutorials/quickstart-create-foundry-resources)
