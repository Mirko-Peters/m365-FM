---
title: "Copilot Studio generative orchestration picks the wrong topic: debugging checklist"
summary: "Why a Copilot Studio agent with generative orchestration calls the wrong topic or none, how trigger order and descriptions decide it, and how to use the activity map, Track between topics and snapshots to find the cause."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [copilot-studio, copilot-studio-topics, ai-agent]
keypoints:
  - "With generative orchestration, the topic trigger is The agent chooses. Selection depends mainly on the descriptions of topics, tools, agents and knowledge sources, then on names and parameters."
  - "Similar descriptions make the choice unpredictable. Microsoft says the agent then selects a single topic rather than invoking all of them."
  - "More than one trigger can fire. Order is by trigger type, then by creation date, oldest first, unless you set the Priority property."
  - "The Multiple Topics Matched (did you mean) system topic is not called by generative orchestration, and Conversational boosting is not used for knowledge search."
  - "Use the activity map, Track between topics, the Variables panel and Save snapshot to see what the orchestrator did. Test with the same model your agent uses."
faq:
  - q: "What decides which topic a generative orchestration agent uses?"
    a: "Microsoft Learn says the most important factor is the description of the topics, tools, agents and knowledge sources. Other factors are names, input and output parameters and their descriptions. The topic trigger is The agent chooses, which fires when the name and description on the Trigger node match the user message."
  - q: "Why does the same question give different answers in a new chat and an ongoing chat?"
    a: "Learn says conversation history can change the result, so you might see different responses for the same query between a fresh conversation and an ongoing one. It also notes the amount of history used is currently limited."
  - q: "In what order do triggers fire when several match?"
    a: "Learn lists the order by type: An activity occurs first, then A message is received and similar event triggers, then The agent chooses or User says a phrase. For several triggers of the same type, the oldest created runs first. The Priority property sets the order explicitly."
  - q: "Does the did-you-mean topic work with generative orchestration?"
    a: "No. Learn says agents that use generative orchestration currently don't call the Multiple Topics Matched system topic. If you leave it on, disambiguation would start automatically once that changes, so Learn describes turning the topic off to prevent that."
  - q: "How can I see why a topic was chosen?"
    a: "In the test chat, follow the orchestrator's plan on the activity map, or turn on Track between topics from the three dots menu. Select an agent response to jump to the topic and node that sent it. The pages I read do not show the model's reasoning, only the plan and the nodes that fired."
---

When a Copilot Studio agent with generative orchestration answers from the wrong topic, the first things to check are the topic descriptions, overlapping topics and trigger settings. Microsoft documents what drives topic selection, the order triggers fire in and a few behaviors that surprise people. This checklist follows that order and uses the test tools to confirm each cause.

## How selection works

With generative orchestration on, topic triggers show **The agent chooses** instead of **User says a phrase**. Learn says this trigger fires when the topic's name and the description on the **Trigger** node match the user's message. In classic orchestration, trigger phrases do the matching.

The agent can select one or more tools, topics, other agents or knowledge sources, including for multi-intent queries. If it selects several, it calls them in sequence after asking for missing information. Then it summarizes the answer from everything it used.

Learn names the main factor: the description. Names, parameters and their descriptions come second.

## Step 1: Check the descriptions

Learn's recommendations for descriptions:

- Use simple, direct language, in the active voice and present tense.
- Keep them to one or two sentences, with a short, unique name.
- For similar items, say what they cannot do.
- Avoid vague text. Learn calls "This tool can answer questions" too vague.

The risk is overlap. Learn says that when topics have similar descriptions, the agent selects one topic rather than invoking all of them, and the overlap makes that choice unpredictable. If two topics are close, rewrite both so each states its own scope and exclusions.

If you switched an existing agent from classic to generative orchestration, Copilot Studio generated a default description for each topic from its trigger phrases. Learn says the generated descriptions are often good enough, but recommends revising them. Whether they cause vague matching in your agent is something to check in the test chat, not a documented fact.

## Step 2: Check trigger order and priority

More than one trigger can fire for one incoming activity. Learn gives this order by trigger type:

1. **An activity occurs**
2. **A message is received**, **A custom client event occurs**, **The conversation changes**, **It's invoked**
3. **The agent chooses** or **User says a phrase**

Among triggers of the same type, the system runs them in creation order, oldest first. The **Priority** property on the trigger overrides this. Learn gives this order for triggers that fire, but does not say how it interacts with the description-based choice among several **The agent chooses** topics. My own reading, not from Microsoft: the order matters most when you also use non-description triggers such as **A message is received**, which rank before **The agent chooses**. The **Condition** property can also limit a trigger, for example to one channel.

## Step 3: Know the documented limitations

Learn lists behaviors that look like bugs but are documented:

- **Disambiguation:** agents with generative orchestration don't call the **Multiple Topics Matched** system topic.
- **Knowledge:** the agent doesn't use the **Conversational boosting** system topic when it searches knowledge sources.
- **Custom entities:** tools and topics don't yet support custom entities (closed lists and regex entities) as input parameters. Collect them with a **Question** node.
- **History:** the amount of conversation history is limited.
- **Model dependence:** some behavior, such as whether the orchestrator restates a message a topic already showed, depends on the configured model. Test with that model.

Learn does not say how Fallback, Escalate, Greeting or Goodbye rank against generative selection. The system topics page describes Fallback as triggering when the agent can't match a message to a topic, and does not give a precedence order. Do not assume one.

## Step 4: Use the test tools

In the test chat:

1. Watch the **activity map**, which shows the orchestrator's plan in real time.
2. Or close the map and use the three dots menu to turn on **Track between topics**. Learn suggests turning off **Show activity map when testing** to avoid collapsing it every turn.
3. Select an agent response to jump to the topic and node that sent it. Nodes that fired have a colored checkmark and bottom border.
4. Open **Variables**, then the **Test** tab, to watch variable values.
5. For a deeper look, use the three dots menu and **Save snapshot**. The archive `botContent.zip` holds `dialog.json` with conversational diagnostics and error descriptions, and `botContent.yml` with the agent content. Learn warns it can contain sensitive information.

Use **Reset** between tests so earlier turns do not influence the result. Learn also warns that timer-based and background events, including inactivity triggers, might not fire in the test panel.

## Step 5: Control the plan

If the orchestrator keeps executing steps you do not want, use an **End all topics** node to cancel remaining planned steps. If a topic's own message is being repeated, Learn advises returning outputs, including an answered-state output, so the orchestrator composes one reply instead of answering again. By default, the **Reset Conversation** topic does not clear conversation history.

## A short test routine (my own suggestion)

Build a small set of test questions for each topic, including one question that should match two topics and one that should match none. Run each in a fresh chat and again after a few earlier turns, since Learn says history can change results. Record which topic, tool or knowledge source answered. If the same question lands on different topics across runs, overlapping descriptions are a likely cause, which is my own inference. Learn says similar descriptions make the selection unpredictable. Repeat the set after every change to a description, because one edit can move other questions.

## Typical mistakes (my own list)

- Two topics with near-identical descriptions.
- Leaving auto-generated descriptions after switching orchestration mode.
- Expecting a did-you-mean prompt when two topics match.
- Testing only in a fresh chat and missing history effects.
- Judging results with a different model than production uses.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Copilot Studio topics](https://www.m365.fm/entity/copilot-studio-topics/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)

## Sources

- [Orchestrate agent behavior with generative AI](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)
- [Set topic triggers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers)
- [Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics)
- [Test your agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-test-bot)
