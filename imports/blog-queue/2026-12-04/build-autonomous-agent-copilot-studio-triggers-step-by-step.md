---
title: "Copilot Studio Autonomous Agents: Build One Step by Step With Event Triggers"
summary: "How to build an autonomous agent in Copilot Studio: turn on generative orchestration, add actions, add an event trigger, test it, publish it, and what the credential and billing rules mean."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [copilot-studio, autonomous-agent, generative-orchestration, ai-agent]
keypoints:
  - "An autonomous agent in Copilot Studio is a normal agent with event triggers. The trigger sends a payload, and the agent decides which actions or topics to run."
  - "Generative orchestration must be on for the agent, and solution-aware cloud flow sharing must be enabled in the environment, or triggers can't be added."
  - "Add a trigger on the agent's Overview page under Triggers > Add trigger. Edit its parameters and payload later in Power Automate."
  - "Triggers run with the agent maker's credentials only, so review what data the agent can reach before publishing."
  - "Each trigger payload is processed like a user message and counts toward Copilot Credit consumption, even for users with a Microsoft 365 Copilot license."
faq:
  - q: "What makes a Copilot Studio agent autonomous?"
    a: "According to Microsoft Learn, event triggers let an agent act when a specified event occurs, instead of waiting for a user message. A trigger sends a payload with event data and instructions, and the agent uses its own instructions to choose actions or topics. The agent only acts within what its author defined."
  - q: "Do I need generative orchestration for triggers?"
    a: "Yes. Microsoft Learn states that event triggers are only available for agents with generative orchestration turned on. The pages I read also say solution-aware cloud flow sharing must be turned on in the environment, otherwise triggers can't be added."
  - q: "Whose credentials does an event trigger use?"
    a: "Learn says event triggers can only use the agent maker's credentials, meaning the ones used to authorize the connections when the trigger was added. Copilot Studio shows a warning before you publish an agent with authenticated triggers, because users may reach data through the author's access."
  - q: "Does a trigger cost anything?"
    a: "Learn says trigger activity counts toward Copilot Credit consumption, because each payload is processed like a user message. Agent flows that run in response to a trigger payload use credits at the standard rate, even for users with a Microsoft 365 Copilot license. If the environment has no credits, those flows are blocked."
  - q: "How do I test a trigger before publishing?"
    a: "Run the triggering event once to create a payload, select the Test trigger icon next to the trigger on the Overview page, pick an instance and select Start testing. The map icon in the test pane opens the activity map, which shows each step of the agent's reaction."
---

An autonomous agent in Copilot Studio is an agent that starts work when an event happens, such as a new SharePoint item, a new email, or a recurrence timer, instead of waiting for someone to type a message. You build it like any other agent, then add one or more event triggers. The steps below follow the order Microsoft Learn uses: prerequisites, agent setup, actions, trigger, test, publish, monitor.

## What "autonomous" means here

Microsoft Learn describes event triggers as a way to make an agent perform actions or call topics in response to an external event. Unlike topic triggers, they don't need user input such as trigger phrases.

The flow has three parts:

1. The event trigger registers that a specific event happened.
2. The trigger sends a payload. This is a JSON or plain-text message with event data and optional instructions.
3. The agent uses its instructions to pick one or more actions or topics based on that payload.

The agent does not invent new actions. The author must define the actions or topics it can choose from.

## Before you start

The Learn pages I read list these requirements:

- **Generative orchestration** must be turned on for the agent.
- **Solution-aware cloud flow sharing** must be turned on in the environment. Without it, triggers can't be added. If your data policies allow the trigger but it is blocked, the environment admin has to check this setting.
- The triggers you see depend on your organization's **data policies**, which admins configure in Power Automate.
- You need permission to reach the system where the event happens, because the trigger runs with your credentials.

## Step 1: Create the agent and write instructions

Microsoft's training exercise for a first autonomous agent starts like this:

1. On the **Home** screen, select **Create**, then **Create New Agent**.
2. Select **Skip to configure** to set up the agent manually.
3. Enter a name, a description and instructions.

The exercise's example instructions describe a process in plain language: what to do when a request arrives, whom to notify, and what to do after approval. That is a good model. State the goal, the order of steps, and what the agent must not do.

The exercise is a training page, and Copilot Studio screens change, so treat button names as a guide. The current trigger articles do not repeat these first steps.

## Step 2: Turn on generative orchestration and add knowledge

In the exercise, the **Orchestration** section has the option to use generative AI to determine how best to respond to users and events. Turn it on. The exercise labels that setting and Dataverse knowledge as preview, while the current trigger pages only say that orchestration must be on.

If the agent needs data, add it under **Knowledge** > **Add knowledge**. The exercise uses a Dataverse table as an example.

## Step 3: Give the agent actions or topics to call

An agent that receives a payload needs something to do with it. In the exercise, you select **Add action** on the **Overview** page, search for a connector action such as **Send an email (V2)**, and give it a clear name and a description that tells the agent when to use it. The description matters, because generative orchestration relies on it to choose.

Learn gives two cautions:

- Keep consecutive action or topic calls **under 15**. Longer sequences can be unreliable.
- If an agent repeatedly fails to call an action, or a connector does not run reliably through the agent, build a Power Automate flow action for that job instead.

## Step 3b: Configure actions for unattended use

When nobody is chatting, nobody can sign in. Learn says that for autonomous operation you should configure each action with **maker authentication** that needs no user input, and instruct the agent not to ask users for credentials. If an agent flow cannot receive information or an action fails, the session can't continue.

## Step 4: Add the event trigger

1. On the agent's **Overview** page, go to the **Triggers** section.
2. Select **Add trigger**.
3. Select the trigger you want, for example a SharePoint, OneDrive, Planner or Dataverse trigger, or a **Recurrence** trigger for time-based runs.
4. Provide authentication details if asked, then select **Next**.
5. Set the event parameters that narrow what activates the trigger, and set the payload.

Triggers come with default payload content, such as **Use content from Body**. You can add your own instructions. Learn gives this example for a Dataverse row trigger: the payload says to look for duplicate account names, and the agent instructions say to create a task if one is found. Avoid conflicts between payload instructions and general agent instructions, because they can cause errors or odd results.

To change parameters or payload later, select the three dots next to the trigger, then **Edit in Power Automate**. Use the **Parameters** and **Code view** tabs there. The exercise uses this to add a subject filter to an email trigger.

## Step 5: Test before you publish

A new trigger does not react until the agent is published, so test first.

1. Run the triggering event once, for example assign a test task to yourself in Planner.
2. On **Overview**, select the **Test trigger** icon beside the trigger.
3. Choose an event instance and select **Start testing**.
4. Select the **map icon** in the test pane to open the activity map. It shows whether an action is missing input.

## Step 6: Publish and monitor

Before publishing you get a warning that the agent uses the author's credentials. After publishing, the agent reacts every time a trigger fires. The **Activity** page shows a step-by-step record of triggers and reactions.

## Risks to plan for

| Topic | What Learn says |
|---|---|
| Credentials | Triggers use only the maker's credentials. Users may reach data and systems through that access. |
| Data | Payloads can contain sensitive data that an agent might output through other actions. Narrow trigger parameters and test what payloads contain. |
| Cost | Each payload is processed like a user message and billed in Copilot Credits. A recurrence every 10 minutes sends a payload every 10 minutes. |
| Throttling | Frequent or endless triggers can exceed service quotas. Admins can monitor usage and block event triggers in an environment. |

## Common mistakes

- Publishing without testing, then finding the trigger fires on every item.
- Using a very short recurrence interval because it feels responsive.
- Leaving actions on user authentication, so the run stalls.
- Writing payload instructions that contradict the agent instructions.

The pages I read do not list every available trigger, and they do not describe turning a trigger off or deleting it, so check the live Copilot Studio UI for those.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Autonomous agent](https://www.m365.fm/entity/autonomous-agent/)
- [Generative orchestration](https://www.m365.fm/entity/generative-orchestration/)
- [Copilot Credits](https://www.m365.fm/entity/copilot-credits/)

## Sources

- [Event trigger overview (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/authoring-triggers-about)
- [Add an event trigger (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/authoring-trigger-event)
- [Exercise: Create your first autonomous agent (Microsoft Learn training)](https://learn.microsoft.com/en-us/training/modules/autonomous-agent/exercise-create-your-first-autonomous-agent)
