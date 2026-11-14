---
title: "How to Add Child Agents and Connected Agents in Copilot Studio"
summary: "When to use child agents and when to use connected agents in Copilot Studio: the differences, supported connected agent types, redirecting from a topic, referencing agents in instructions, managing them, and the preview limitations on the Learn page."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [copilot-studio]
keypoints:
  - "Child agents are lightweight agents inside your existing agent. Connected agents are separate agents you connect to a main agent, with their own settings, publishing and lifecycle."
  - "Learn cites roughly 30 to 40 choices of action as a rule of thumb where tool differentiation degrades. Splitting across agents adds latency and testing and governance effort."
  - "Connected agent types are A2A agents, Microsoft Foundry agents (preview), Fabric Data agents (preview) and Microsoft 365 Agents SDK agents (preview)."
  - "Redirect to an agent from a topic with Add node and the Add an agent submenu, or reference an agent in instructions by typing a slash on the Overview page."
  - "The page is preview documentation and does not contain the step-by-step add flows, publishing prerequisites or authentication details."
faq:
  - q: "What is the difference between child and connected agents?"
    a: "Child agents are lightweight agents within your existing agent, for a single use case owned by one team, without separate configuration or deployment. Connected agents are separate agents you connect to your main agent, for multiple teams, separate publishing, dedicated settings, independent lifecycle management or reuse."
  - q: "When should I move to connected agents?"
    a: "Learn lists tool differentiation degrading at roughly 30 to 40 choices of action, multiple teams managing agents independently, separate publishing or channels, dedicated settings such as their own model, independent ALM and reuse across main agents."
  - q: "Which connected agent types are supported?"
    a: "Agents available over the A2A protocol, Microsoft Foundry agents (preview), Fabric Data agents (preview) and agents built with the Microsoft 365 Agents SDK (preview)."
  - q: "How do I call an agent from a topic?"
    a: "Select the Add node icon under the node where the redirect should happen, choose the agent in the Add an agent submenu, set inputs if it supports them, then save and test the topic. Fabric Data agents cannot be redirected to."
  - q: "How do I disable or remove one?"
    a: "On the Agents page use the Enabled toggle to disable an agent temporarily. Delete a child agent from its ellipsis menu, or choose Disconnect agent to remove a connected agent."
---

Copilot Studio lets one agent hand work to others. There are two ways to do it: child agents inside the main agent and connected agents that live on their own. This guide follows the Microsoft Learn page on adding other agents. The page is preview documentation and is not meant for production use. It explains the choice, redirecting and limitations. The add flows are on linked pages that were not read.

## Child agents and connected agents

**Child agents** are lightweight agents within your existing agent. Learn lists these reasons to use them:

- A single use case, such as creating a ticket or checking a status.
- One developer or a small team owns the solution.
- You want to group tools, instructions and knowledge into subagents.
- You do not need separate configuration, authentication or deployment.
- You do not plan to publish or reuse them.

**Connected agents** are separate agents connected to the main agent. Consider them when:

- Tool differentiation degrades. The page gives roughly 30 to 40 choices of action (tools, topics and agents) as a rule of thumb, and warns that fewer tools with similar descriptions can also hurt.
- Multiple teams manage agents independently.
- Agents must be published separately or have their own channels.
- Agents need dedicated settings such as their own model.
- You need independent application lifecycle management.
- You want reuse across more than one main agent.

You can mix both. Splitting across agents adds latency from extra orchestration hops and increases testing, management and governance effort.

## Supported connected agent types

All appear on the main agent's **Agents** page:

- Agents available over the A2A protocol.
- Microsoft Foundry agents (preview).
- Fabric Data agents (preview).
- Agents built with the Microsoft 365 Agents SDK (preview).

## Redirect from a topic

1. Select the **Add node** icon under the node where the redirect should occur, then choose the agent in the **Add an agent** submenu.
2. If the agent supports inputs and outputs, set values for the inputs. Each output gets a topic variable automatically.
3. Save and test the topic.

After the agent finishes, the originating topic resumes. Fabric Data agents cannot be redirected to.

## Reference agents in instructions

On the main agent's **Overview** page type **/** in the **Instructions** field and select the agent. Use the test panel to confirm that the agent appears in the activity map.

## Manage

- Use the **Enabled** toggle on the **Agents** page to disable an agent temporarily. An inactive agent does not respond to users or triggers.
- Delete a child agent from the ellipsis menu with **Delete**.
- Remove a connected agent with **Disconnect agent**.

## Known limitations

- Fabric Data agents cannot be redirected to from a topic or referenced in instructions, and they do not work when the main agent is deployed to Microsoft Copilot.
- Citations may not always carry over to the calling agent.
- Child and connected agents follow the main agent's Use general knowledge setting, though they may still use underlying model knowledge when generating questions or messages.
- A main agent that has connected agents cannot also be a connected agent for another main agent. Agents without connected agents can be shared across main agents.
- If a parent depends entirely on subagents and its after-running behavior is Don't respond, the platform may send an extra system-generated explanation_of_tool_call message. It does not indicate a configuration problem.

## What the page does not say

- Step-by-step flows for adding a child or connected agent.
- Publishing or sharing prerequisites and authentication details.
- Ownership and sharing rules. They are on linked pages.

## A decision outline

This outline is practical advice built on the page.

1. Start with child agents for a single use case with one owner.
2. Count the actions of your main agent. If you approach the rule of thumb, consider splitting.
3. Use connected agents when another team owns the agent, or when it needs its own publishing or model.
4. Test the latency and the activity map after each split.
5. Avoid production use of preview connected agent types until they are generally available.

## Typical mistakes

- Using connected agents for a small single-use-case agent and paying for the extra hops.
- Expecting Fabric Data agents to work in topics or in Microsoft Copilot deployments.
- Chaining connected agents. A main agent with connected agents cannot also be connected to another.
- Treating the rule of thumb of 30 to 40 actions as a hard limit.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Add other agents to an agent in Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/authoring-add-other-agents)
