---
title: "How to test AI agents and Copilot extensions in a repeatable way"
summary: "How to test AI agents in a repeatable way: build a test set, pick graders, score tool calls and track regressions, with a Copilot Studio example for QA leads."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [ai-agent, ai-evaluation, copilot-studio, end-to-end-testing]
keypoints:
  - "An AI agent gives different answers to the same input, so repeatable testing means scoring against agreed criteria and thresholds instead of matching one exact string."
  - "Split agent tests into layers: ordinary unit tests for routing and parsing, quality scoring of the language model output, and end-to-end scenarios for multi-step flows."
  - "A good test set starts small, covers real user tasks, known failures, edge cases and high-risk behavior, and is kept under version control next to the prompts."
  - "Check the path as well as the answer: a correct-sounding reply that skipped a required tool call is still a failure."
  - "Run each case several times, compare failure rates against a baseline, and keep must-pass cases and forbidden actions as hard gates."
faq:
  - q: "How do you test an AI agent?"
    a: "Build a test set of realistic inputs with expected results, run the agent against it, and score each answer with agreed graders such as keyword checks, meaning comparison or a judge model. Check tool calls as well as answers, repeat runs because outputs vary, and compare the scores with a baseline after every change to prompts, models or tools."
  - q: "Can you unit test an AI agent?"
    a: "Partly. Routing, parsing, formatting and state changes are ordinary code, so normal unit tests with exact assertions work well. The language model's answer is different: correct replies can be worded many ways, so score quality against thresholds instead of exact text, and add end-to-end scenarios for multi-turn flows."
  - q: "How many test cases does an AI agent need?"
    a: "There is no fixed number. Start small with high-quality cases that cover real user tasks, known failures and high-risk behavior, then grow the set as real conversations show new problems. In Copilot Studio, a single test set holds up to 100 test cases, and the quick generator drafts ten."
---

How to test AI agents is a practical question for any QA lead who has been asked to approve one: the same input can produce different answers, so the old habit of comparing output to one expected value no longer works. This guide is for QA leads who need a repeatable method for agents built with Copilot Studio or other tools. You will see what makes agents hard to test, a layered approach, how to build a test set, which graders to use, and how to keep results comparable over time. A worked example with made-up numbers shows a small team putting it together.

## What makes AI agents hard to test

A classic application behaves predictably: the same input leads to the same result. An [AI agent](https://www.m365.fm/entity/ai-agent/) works on top of a large language model, so its answers vary, and it also decides which tools to call and in what order. That gives you two things to check: the final answer and the path the agent took to reach it.

Language models can hallucinate, which means they state wrong facts with confidence, so every AI system you ship needs checks for it. The risk grows with agentic workflows, where an AI agent calls an API, reads a file or changes a record on the user's behalf. Testing such an AI agent covers more than the words it writes.

The SitePoint article on [testing AI agents in a non-deterministic world](https://www.sitepoint.com/testing-ai-agents-deterministic-evaluation-in-a-non-deterministic-world/) rejects exact-string matching for model output, because correct answers can be phrased in many ways. It replaces the question "is it identical?" with "is it good enough?". That shift is the core of AI agent testing, and it affects how you write expected results, set pass marks and report risk.

Variation does not make testing impossible. It means agent testing uses ranges, thresholds and repeated runs, while the plain code stays under plain tests.

## How to test AI agents in four layers

The same SitePoint article splits agent testing into three layers, and the LangChain guide on [testing LLMs and AI agents](https://www.langchain.com/resources/llm-testing) adds a fourth idea, release gates. Together they make a workable plan:

1. **Plain logic.** Tool routing, parsing, formatting and state changes are ordinary code. Ordinary unit tests with exact assertions work well here, and SitePoint suggests running them on every commit.
2. **Output quality.** Evaluate the language model's answers for faithfulness, relevance and hallucination. These checks are slower and cost money when a judge model is involved, so SitePoint suggests running them on merges or on a schedule.
3. **End-to-end scenarios.** Run multi-turn conversations and multi-step tool use from a user's first message to the final result. This is the AI agent's version of [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/), and it is the layer that finds problems between the parts.
4. **Release gates.** LangChain recommends running the checks in your delivery pipeline on each candidate change, with agreed thresholds for quality, behavior and performance such as latency and cost.

Do not skip the first layer because the AI agent feels like magic. Many AI agent failures are plain bugs in how input is parsed or which tool is chosen, and they are cheap to catch.

## Build a test set that stays useful

The test set, often called an eval set, is the center of [AI evaluation](https://www.m365.fm/entity/ai-evaluation/) work. LangChain's advice is to start small with high-quality cases that cover real user tasks, known failures and high-risk behavior, then expand as real conversations reveal new problems. Include common requests, adversarial inputs, edge cases and examples corrected by domain experts. Each case can hold an input, a reference output, evaluation criteria, required or forbidden steps and metadata for filtering.

SitePoint adds a habit that makes results traceable: keep the dataset in source control and version it next to the prompt templates, so that a change in scores can be tied to a specific change in the agent.

A starter set for a QA lead might look like this:

- **Common questions** in the words people actually use.
- **Known failures** from earlier incidents or complaints, kept as permanent regression cases.
- **Edge cases**, such as vague questions, mixed languages, missing information and requests the AI agent should decline.
- **Risky requests**, including attempts at prompt injection, questions about data the user should not see and requests for actions outside the agent's scope.
- **Must-pass cases**, where a single failure blocks release.

Write the expected result as precisely as you can. Vague expectations produce noisy scores, whatever tool does the scoring.

## Choose graders: code, judge model or person

LangChain describes three kinds of graders, and each has a place:

- **Code checks** suit deterministic rules: valid JSON, a required account ID, a specific tool call. They are cheap and repeatable.
- **A judge model** scores judgment-based qualities such as groundedness, instruction following and task completion. LangChain advises validating judge scores against human-reviewed examples before relying on them.
- **Human review** handles ambiguous or high-risk cases. Reviewers label failures, and those cases can join the test set as future regression tests.

Check the path, not only the answer. LangChain calls this trajectory evaluation: tool order, arguments, approval steps and loops. Its example is a refund agent that should call a policy lookup before answering. A correct-sounding answer that skipped the lookup is still a failure. This is why each test case should record the expected tool call, not just the expected text.

Scores need thresholds. SitePoint suggests a minimum per metric instead of one exact target, and its examples include 0.85 for faithfulness and 0.7 for answer relevancy. Treat such numbers as examples, and set your own from your risk.

## Testing a Copilot Studio agent

[Copilot Studio](https://www.m365.fm/entity/copilot-studio/) has built-in evaluation, and Microsoft's page on [creating a test set](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-create) lists the details a QA lead needs.

- **Test sets:** a single-response test set holds up to 100 test cases. You can generate a quick set of ten questions from the agent's description, generate more from a knowledge source or topics, reuse questions from a test chat, import a CSV or TXT file, or write cases by hand.
- **Test methods:** general quality, content safety, compare meaning, tool use, keyword match, text similarity, exact match and custom criteria. All methods except general quality need an expected answer, keywords or capabilities per case.
- **Identity:** automated testing uses the signed-in user's authentication to reach knowledge sources and tools. Run as the same user every time so results stay comparable, and make sure that user can reach every source the agent needs.
- **Limits:** generated sets cannot find information gaps, because they draw only from what the agent already knows. Results are kept for 89 days, so export them to CSV to keep a baseline.

Two cautions follow from the page. Generated test cases can contain sensitive data the connected account can reach, and other makers with access to the agent can view the linked test sets, so review them before sharing. And a generated set is a starting point, not a finished set. Add your own known failures and risky requests by hand.

## Make results repeatable

Repeatability comes from habits in your testing workflow, not from a feature:

1. **Run each case more than once.** SitePoint suggests at least three runs and an average. LangChain suggests comparing failure rates for variable outputs.
2. **Compare against a baseline.** Run the candidate and the current version on the same test set. LangChain warns that a better average can hide a regression on one critical case, so watch the must-pass examples.
3. **Use hard gates for forbidden actions.** LangChain suggests deterministic checks with a zero-failure threshold for actions the agent must never take.
4. **Rerun after every change, and automate it.** Automation in your pipeline keeps the habit alive. A prompt change counts as a code change, and so does a change to models, retrieval, tool definitions, memory or routing.
5. **Keep the evidence.** Export results and store them with the test set version and the agent version.

## Example: a leave-policy agent

The numbers are made up.

A team builds a Copilot Studio agent that answers questions about leave policy. The QA lead creates 40 test cases. Twenty-two are common questions, eight are known failures from the pilot, six use unusual wording such as unclear dates, and four are risky requests, including a question about another employee's leave. Six are marked must-pass.

The lead uses keyword match for fixed facts such as the number of leave days, compare meaning for explanations, and a tool-use check that the agent calls the policy lookup before answering. Each case runs three times.

On the first full run, 34 of 40 cases pass in all three runs. Of the six failures, two involve a must-pass case, and in one of them the agent answered without calling the policy lookup. The team fixes the instruction, reruns, and reaches 38 of 40 with all must-pass cases green. The lead exports the results as the baseline and sets a rule: any prompt or model change reruns all 40 cases, and a drop in any must-pass case blocks the release in the delivery workflow.

## Common mistakes

- **Matching exact text.** Correct answers vary, so exact match produces false failures.
- **Judging the answer only.** The agent may reach a good-looking answer by skipping a required step.
- **Running each case once.** One lucky run proves little.
- **Trusting a generated test set alone.** It cannot find gaps in what the agent was never told.
- **Trusting the judge model blindly.** Validate its scores against human-reviewed examples.
- **Testing only the happy path.** Include unusual wording, risky requests and known failures.

## How software can help

Start with what your agent platform offers. Copilot Studio has built-in evaluation, and open-source and commercial evaluation frameworks exist for custom AI agents. Pick a testing tool that lets you version test sets, run each case several times, check tool calls and export results. Add your delivery pipeline as the gate, and use a spreadsheet or test management tool to track the cases and their owners. Pilot on one AI agent before you standardize.

## Next step

Write ten cases for one AI agent you already run, including three known failures and two risky requests, and score them three times each. Then store the results as a baseline, so that how to test AI agents in your team becomes a routine step rather than a debate.
