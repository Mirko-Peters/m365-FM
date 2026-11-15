---
title: "Which regression tests should you automate first? A decision guide"
summary: "Which tests to automate first? Start with business-critical, frequently run, stable regression tests. Use five criteria and a simple scoring matrix to decide."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [regression-testing, end-to-end-testing, unit-testing]
keypoints:
  - "Automate first the regression tests that cover business-critical flows, run often, change rarely and cost the most time to repeat by hand."
  - "Rank features by the cost of failure: probability and severity of a defect decide which test earns automation before the others."
  - "Leave single-use, unstable, exploratory and usability checks manual for now, because automating them can cost more than running them by hand."
  - "A weighted score from 1 to 5 across criticality, frequency, stability, manual effort and flakiness turns a debate into a ranked list."
  - "Prefer the lowest test layer that works, and keep browser-level end-to-end tests for the flows where full validation is essential."
faq:
  - q: "Which tests should be automated first?"
    a: "Automate regression tests for business-critical flows first, such as login, checkout or payments, especially those that run on every build and rarely change. Smoke tests and repeated, data-driven checks are also strong candidates. Leave single-use tests, unstable features and exploratory or usability testing manual until they settle."
  - q: "What should not be automated in regression testing?"
    a: "Do not automate tests you will run once, checks for features that are still changing, tests with no clear pass or fail result, and exploratory or usability testing. Automating these often costs more than running them by hand. Revisit the list when a feature stabilizes or a manual check becomes repetitive."
  - q: "How do I prioritize regression test cases for automation?"
    a: "Score each candidate on business criticality, how often it runs, how stable the feature is, how much manual effort it saves and how likely it is to flake. Weight the factors, add them up and automate the highest scores first. Review the ranking each quarter, because risk and usage change."
---

Which tests to automate first? Start with regression tests that cover business-critical flows, run on every build, rarely change, and take the longest to repeat by hand. This guide is for QA leads with a small team and a long list of manual checks who need a defensible order. You will see five selection criteria, a list of what to leave manual for now, and a simple scoring matrix. A worked example with made-up numbers ranks five candidate tests, so you can copy the method.

## Why the order of automation matters

Automation takes effort, and that effort is only repaid when a test runs many times. A test that runs on every build pays back quickly. A test that runs once never does.

In agile teams with short sprints, the team rarely has time to automate everything. Test automation is an investment, so think about return on investment (ROI): the manual hours that each automated test case saves, minus the hours to write and maintain its test scripts. The order in which you automate therefore decides how fast your investment returns. A team that automates ten low-value checks and leaves the checkout manual has spent its effort in the wrong place.

The Ranorex guide on [knowing what to automate](https://www.ranorex.com/blog/know-what-to-automate/) puts [regression testing](https://www.m365.fm/entity/regression-testing/) at the top of the priority list, because frequent reruns multiply the savings. It also tells teams to rank features by the cost of failure and to add the tests for the riskiest features to the regression suite first.

The TestDevLab article on [prioritizing test cases for regression testing](https://www.testdevlab.com/blog/how-to-prioritize-test-cases-for-regression-testing) describes the same idea as risk-based prioritization: ranking test cases by factors such as the probability of failure and the severity of the impact. It advises starting with high-risk, highly critical functions and then moving to lower-risk ones. It also says frequently updated features and complex, multi-component features deserve earlier testing.

The practical message: automate by risk and by how often the test will run, not by feature list or ease.

A short automation strategy names the candidates, the tools, the owner and the review date. Most test automation best practices begin the same way: decide what to automate, and only then choose the tool.

## Which tests to automate first: five criteria

Katalon's guide on [selecting regression test cases](https://katalon.com/resources-center/blog/how-to-select-regression-test-cases) says strong automation candidates meet most of a set of conditions. These five are the ones that matter most for a small team.

1. **Business-critical.** The test covers a revenue-critical, security-sensitive or core flow, such as login, checkout or payments. If this breaks, customers notice first.
2. **Runs often.** The test runs on every pull request, every nightly build or every release.
3. **Stable.** The feature rarely changes, so the test will not need constant repair.
4. **Costly by hand.** The test is repetitive, slow and prone to human error. Repeated and data-driven checks fit well, because the same steps run with many inputs, and automation testing saves the most time here.
5. **Clear result.** The test has an objective pass or fail result that is easy to check, for example through the screen, an API response or the system state. Cover the edge cases that matter in the test data, not every possible input.

A test that meets four or five of these goes to the top of the queue. A test that meets one or two waits.

Katalon adds a point about layers: prefer the lowest layer that works, and automate unstable UI flows only when end-to-end validation is essential. If a rule can be checked by a [unit test](https://www.m365.fm/entity/unit-testing/) or an API call, that check is usually faster and steadier than a browser test. Slow UI tests belong to the few flows that need them. Keep browser-level [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/) for the journeys where the whole path through the screens must be proven.

## Fit the order to the test pyramid and your pipeline

Selection says what to automate. Layers say where. Martin Fowler's [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) advises many small, fast unit tests, some coarser tests and very few high-level tests. His rule for choosing the level is useful for a ranked list: if a higher-level test spots an error and no lower-level test fails, write a lower-level test. Push tests as far down as possible, and remove high-level tests that duplicate what lower levels already cover.

So before you write a browser test for a ranked item, ask two questions. Could a unit test or an integration test prove the same rule faster? Are any automated test cases now redundant? These are our questions, built on Fowler's rule, not a checklist from the sources.

Then place each test in the pipeline. Ranorex describes smoke tests as a small subset of regression tests that run with each new build, and Katalon names every pull request, nightly build and release as the points where strong candidates run. A practical split, which is our own suggestion, is a small smoke set on every build and the fuller automation suite each night or release. Keep exploratory testing in the QA team's hands, and review the plan every quarter.

## What to leave manual for now

Saying no is part of the plan. Ranorex lists cases where automation does not pay:

- **Single-use tests.** It may take longer to automate a test than to run it by hand once. Tests that will join the regression suite or are data-driven do not count as single-use.
- **Unstable features.** While a requirement is still experimental or under development, test it manually.
- **Tests without a clear pass or fail result.** Automate only when the result is objective.
- **Exploratory and usability testing.** Ranorex says these tests can not and should not be automated, because they depend on human judgment.

Features that resist automation, such as a CAPTCHA, need a plan of their own. Ranorex suggests turning them off in the test environment, adding a developer bypass, or pausing for a tester to complete them.

Manual does not mean forgotten. Put these tests on a list with a review date, so a feature that has settled can move up.

## Score the candidates with a simple matrix

When two tests both look important, a score makes the decision visible. Katalon recommends scoring each test from 1 to 5 on weighted factors, multiplying each score by its weight and adding the results. Its example weights are business criticality 0.3, execution frequency 0.2, stability 0.2, manual effort saved 0.15 and flakiness score 0.15, where a higher score means a lower risk of flakiness. Its suggested thresholds are 4.0 or higher to automate, 3.0 to 3.9 to revisit later, and below 3.0 to keep manual or exploratory.

You can use these weights as they are or change them. The point is not the exact number. The point is that the team agrees on the factors before it argues about single tests.

Where do the scores come from? Katalon notes that production data and past incidents show which paths matter most. TestDevLab describes history-based prioritization, which ranks tests by their past record of finding faults. Use your incident list and support tickets to fill the criticality column, and use your build history to fill the frequency and flakiness columns. A score based on data is easier to defend than a score based on opinion. Review the ranking with the whole team, and track test coverage of your critical flows as a simple count: how many of your top ten flows have an automated test case?

## Example: ranking five candidate tests

The scores are made up, and the weights are the ones above.

A QA lead has five manual checks to rank. Each factor is scored from 1 to 5.

1. **Invoice export.** Criticality 5, frequency 5, stability 4, effort 4, flakiness score 3. Score: 1.5 + 1.0 + 0.8 + 0.6 + 0.45 = 4.35. Automate first.
2. **Password reset.** Criticality 5, frequency 3, stability 5, effort 3, flakiness score 4. Score: 1.5 + 0.6 + 1.0 + 0.45 + 0.6 = 4.15. Automate next.
3. **Report filter.** Criticality 3, frequency 4, stability 4, effort 4, flakiness score 4. Score: 0.9 + 0.8 + 0.8 + 0.6 + 0.6 = 3.7. Revisit next quarter.
4. **New dashboard layout.** Criticality 3, frequency 3, stability 1, effort 3, flakiness score 2. Score: 0.9 + 0.6 + 0.2 + 0.45 + 0.3 = 2.45. Keep manual until the design settles.
5. **Profile photo upload.** Criticality 2, frequency 2, stability 3, effort 2, flakiness score 2. Score: 0.6 + 0.4 + 0.6 + 0.3 + 0.3 = 2.2. Keep manual.

The result is a ranked list: invoice export, then password reset, with the report filter in reserve. The lead starts with a small automation framework, shared test data and these first test cases, then grows the automated suite. The product owner can see the reasons, and when the dashboard stops changing, its stability score rises and it can move up.

## Common mistakes

- **Automating the easiest tests first.** Easy tests are often low-impact ones, so the suite grows without protecting what matters.
- **Automating an unstable feature.** The tests break with every change, and the team stops trusting them.
- **Counting tests instead of impact.** A large suite of low-value checks costs more to maintain than it saves.
- **Starting every check at the browser layer.** If a unit test or an API check can cover the rule, it is usually cheaper to keep.
- **Ignoring manual testing that still matters.** Exploratory checks and usability reviews stay with testers, and software testing needs both kinds of effort.
- **Never revisiting the ranking.** Usage, impact and stability change, so review the list every quarter.

## How software can help

A spreadsheet with your five criteria and the weights is enough to start. Add a column for the last review date. Your test management tool, if you have one, can also show how often each test runs and how often it fails, which feeds the frequency and flakiness scores. Past defect data from your ticket system shows which areas break most. Browser testing tools, whether script-based or plain-language, only matter once the ranking says which flows deserve a test. Pick the tool after you have the list, not before.

## Next step

List your twenty slowest manual regression checks, score each on the five factors, and sort the result. Then automate the top three, and use that ranked list to answer which tests to automate first in your next planning meeting.
