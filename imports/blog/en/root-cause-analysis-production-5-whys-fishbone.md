---
title: "Root Cause Analysis in Production: 5 Whys and Fishbone in Practice"
summary: "Root cause analysis in production, step by step: when to use the 5 whys or a fishbone diagram, how to verify a cause and a worked downtime example with numbers."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [continuous-improvement, bottleneck, pdca-cycle, a3-problem-solving]
keypoints:
  - "Root cause analysis finds the underlying cause of a problem so that the fix prevents recurrence instead of treating a symptom."
  - "Use the 5 whys for a clear chain of cause and effect, and a fishbone diagram first when several causes may interact."
  - "Every why must be answered with an observed fact or measured data, not a hypothesis, and the cause must be verified before action."
  - "Start with the biggest losses, using a Pareto view, and give priority to the bottleneck, where lost time costs the whole line."
  - "A fix is only proven when the check shows the problem has not returned, so run it as a small PDCA trial."
faq:
  - q: "What is root cause analysis in manufacturing?"
    a: "It is a structured way to find the underlying source of a process or product failure, so that the corrective action prevents the problem from coming back. Instead of fixing the symptom, such as a machine stop, the team asks why it happened, collects facts and traces the chain of causes until it finds one it can act on."
  - q: "When should I use the 5 whys and when a fishbone diagram?"
    a: "Use the 5 whys when the problem seems to follow a single chain of cause and effect. Use a fishbone diagram first when several factors might interact, because it lays out many hypotheses on one page. A common approach is to build the fishbone, then apply the 5 whys to the most likely branches."
  - q: "How many whys are enough?"
    a: "Five is a rule of thumb, not a target. Stop when you reach a cause you can act on and that you have verified: if you fixed it, the problem should not recur. Sometimes three whys are enough and sometimes you need more. Each answer must rest on an observed fact, not a guess."
---

Root cause analysis (RCA) finds the underlying cause of a problem, so that the fix stops it from coming back. In production, the usual tools are the 5 whys and the fishbone diagram. This article is for production managers who must solve line problems today and want them to stay solved. You get a clear routine, a guide to choosing between the two tools, a worked downtime example with numbers and a list of common mistakes.

## What is root cause analysis in production?

iSixSigma describes root cause analysis as a way of identifying the underlying source of a process or product failure. It recommends starting with a factual problem statement: the failed product or process, the observations, the number of failed units and the customer's description. See its article on [Ishikawa diagrams and the 5 whys](https://www.isixsigma.com/cause-effect/root-cause-analysis-ishikawa-diagrams-and-the-5-whys/).

Three terms are easy to confuse:

- **Containment** protects the customer or the line today, for example by sorting suspect parts. It does not remove the cause.
- **Corrective action** is the change that removes the cause.
- **Root cause** is the cause that, once removed, prevents recurrence under similar conditions.

If you only contain, the same defect or stop will return. If you jump to corrective action without a verified cause, you may fix the wrong thing. RCA sits between the two.

## When do you use the 5 whys?

The ASQ glossary describes the [Five Whys](https://asq.org.in/glossary/quality/F/five-whys/) as a technique that involves repeatedly asking "why?". It is typically run about five times, but more or fewer is acceptable, and it credits Sakichi Toyoda with developing it. Its rules are practical:

1. Write a precise problem statement backed by data.
2. Ask why the problem occurred and record the closest observable cause.
3. Keep asking why about each answer, staying grounded in facts.
4. Stop at a cause you can act on to prevent recurrence.
5. Verify the root cause: does it lead to the problem, and would fixing it prevent the problem?
6. Apply a countermeasure and confirm by follow-up measurement that the problem does not recur.

The same page notes that each answer should be "an observed fact or measured data point, not a hypothesis". It also says the method works best for linear causal chains with one root cause, and recommends a fishbone diagram for complex problems.

## When is a fishbone diagram better?

A fishbone, or Ishikawa, diagram is a picture of hypotheses. The effect, such as "short shots on press 3", sits at the head, and branches show possible causes. Teams often group the branches as machine, method, material, people, measurement and environment. The diagram helps the team see many possible causes at once and agree which ones to test.

iSixSigma recommends a clear way to combine the tools: write the problem statement and collect data first, build the diagram from hypotheses that describe observable effects, apply the 5 whys to the most likely branches, and track each hypothesis with an owner and a due date. It also warns that brainstormed diagrams often include causes that do not contribute, and that vague categories such as "lighting" rarely show a path to failure.

Rule of thumb: a single clear chain means the 5 whys is enough. Several possible contributing factors, or a team that disagrees, means a fishbone first.

Many production problems have more than one of the root causes at work. A short stop can come from a worn part, a missing check and a gap in training at the same time. When you identify the root cause, ask whether you found one of the root causes or all of them. Defining the problem well is half of the answer: a narrow statement, such as "stops at station 3 on the night shift", leads to fewer potential causes than a wide one. To determine the root cause of a recurring defect, compare good and bad runs, and list what differs. Then implement corrective actions for each verified cause, one at a time, so you can see which one works. This is plain problem-solving: facts first, hypotheses second, actions last.

## How do you run RCA on the line?

1. **Contain.** Protect the customer and the line first. Quarantine suspect product and restore a safe state.
2. **Choose the problem.** Do not analyze everything. Use a Pareto view, a ranking of losses from largest to smallest, and take the largest. Look first at the [bottleneck](https://www.m365.fm/entity/bottleneck/), the step that limits output. A minute lost there is lost for the whole line, while a minute lost on a step with spare capacity may cost nothing.
3. **Define it with data.** What, where, when, how much, compared with what? Put a number on it.
4. **Go and see.** Look at the real process at the gemba, the Japanese word for "the real place", the shop floor. Talk to the operators who were there.
5. **Find candidate causes.** Use the 5 whys or a fishbone with a cross-functional team: operator, maintenance, quality, and a supervisor.
6. **Verify.** Test the likely cause. If it is real, removing it should change the outcome, and bringing it back should bring the problem back.
7. **Act and check.** Run the countermeasure as a small trial and measure the result. The [PDCA cycle](https://www.m365.fm/entity/pdca-cycle/) gives this step its shape, and an [A3 report](https://www.m365.fm/entity/a3-problem-solving/) can record the whole story on one page.

## Example: downtime on one line

This example uses assumed numbers.

Line 4 runs two shifts of 8 hours for 5 days, so 80 planned hours. Last week it lost 14 hours to stops, which is 14 ÷ 80 = 17.5%.

**Pareto of the stops:**

- Sensor misreads: 6.3 h (45%)
- Changeover overrun: 4.2 h (30%)
- Waiting for material: 2.1 h (15%)
- Other: 1.4 h (10%)

The two largest causes make up 75% of the loss. The team starts with sensor misreads.

**Five whys.**
1. Why did the line stop? The sensor misread the part position.
2. Why? There was dust on the sensor lens.
3. Why was there dust? Nobody cleans the lens during the shift.
4. Why not? Cleaning is not part of the operator's standard work.
5. Why not? The standard work was written before the sensor was installed.

The root cause is a gap in the standard work, not a faulty sensor. The countermeasure is to add a lens check to the start-of-shift routine and to fit a small cover.

**Expected effect.** If this removes 80% of the sensor stops: 6.3 × 0.8 = 5.04 hours. The new downtime is 14 − 5.04 = 8.96 hours, or 8.96 ÷ 80 = 11.2%. The check after two weeks shows whether the real result matches. If it does not, the team returns to the diagram.

## How do you make sure the cause is the right one?

Test the finding before you invest in a fix. Two simple questions help:

- If the cause you identified were different, would the outcome have been different?
- If you remove it, is the same failure unlikely to recur under similar conditions?

Collect data before and after. A good RCA ends with a measured result and a changed standard, and that is how it feeds [continuous improvement](https://www.m365.fm/entity/continuous-improvement/) instead of firefighting. Also write down contributing factors that you did not fix, such as training or tooling, so that they are not lost.

Be careful with "human error". It is rarely a root cause. If an operator made a mistake, ask why the process allowed it: was the instruction clear, was the tool suitable, was there time? The answer is almost always in the system.

## Common mistakes

- **Stopping at the first why.** The first answer is usually the symptom.
- **Answering with opinions.** Each why needs an observed fact or a measurement.
- **Blaming people.** Blame ends the conversation and hides the real cause.
- **Analyzing small problems first.** Use a Pareto view and begin with the largest loss.
- **Skipping verification.** An unverified cause leads to a fix that does not work.
- **Not changing the standard.** If the standard work stays the same, the problem will return.

## How software can help

Good analysis needs good data. Software can capture the reason for each stop at the moment it happens, build Pareto charts automatically and show whether a problem returns after the fix. That saves time in the first steps of RCA and gives the team facts instead of memories. A tool does not do the thinking. People still go to the gemba and ask why.

## Next step

Take last week's biggest loss on your line, write a problem statement with a number and run the 5 whys with the operators who were there. Then verify the cause with a small trial. That is the practical way to apply root cause analysis in your production.
