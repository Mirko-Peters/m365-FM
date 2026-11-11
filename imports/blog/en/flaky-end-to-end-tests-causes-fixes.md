---
title: "Flaky end-to-end tests: why they fail and how to cut them down"
summary: "Flaky end-to-end tests pass and fail with no code change. Learn the five usual causes, how to fix waits and test data, and what to do with tests you cannot fix."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, regression-testing, ai-agent]
keypoints:
  - "A flaky test passes sometimes and fails sometimes without any change in the code, the test or the environment, so a failure tells you nothing until you repeat the run."
  - "Google reported that about 1.5 percent of its test runs were flaky and almost 16 percent of its tests showed some flakiness, so flakiness is normal at scale and needs a plan."
  - "The five usual causes are shared state, timing, remote services, the system clock and leaked resources, and timing is the first thing to check in browser tests."
  - "Replace fixed sleeps with waits for a visible condition, and give every test its own data so tests cannot disturb each other."
  - "Quarantine a flaky test as a stopgap, but cap how many tests may sit there and for how long, or the regression suite slowly loses its value."
faq:
  - q: "What is a flaky test?"
    a: "A flaky test is an automated test that passes on some runs and fails on others without any change to the code, the test or the environment. Because the result varies, a failure does not prove a bug. Teams must re-run the test to learn whether the failure is real, which slows work and erodes trust."
  - q: "Why are end-to-end tests flakier than unit tests?"
    a: "End-to-end tests drive a real browser through a full workflow, so they depend on timing, network calls, test data, shared environments and third-party services. Any of these can vary between runs. A unit test checks a small piece of code in isolation, so it has far fewer moving parts and rarely flakes."
  - q: "Should I just retry flaky tests automatically?"
    a: "Use retries as a short-term bandage, not a fix. Google describes re-running failures and marking tests as flaky, and calls the latter hardly a perfect solution. Retries can hide a real race condition. Record every retry, find the cause, and set a limit for how long a test may stay flaky."
---

Flaky end-to-end tests are automated browser tests that pass on one run and fail on the next with no change in the code, the test or the environment. This guide is for QA leads and automation engineers who spend more time re-running red builds than fixing bugs. You will see why these tests flake, what the five usual causes are, how to fix the worst one (waiting), and how to manage the tests you cannot fix yet. A worked example with made-up numbers shows how to find the root cause in three steps.

## Why flaky tests do so much damage

A test is flaky when its result is not repeatable. Martin Fowler's article on [non-determinism in tests](https://www.martinfowler.com/articles/nonDeterminism.html) defines it as a test that "passes sometimes and fails sometimes, without any noticeable change in the code, tests, or environment."

The harm comes from lost trust. If a red build might be a real bug or might be noise, people learn to ignore red builds. Then a real defect slips through. Teams also waste time: every failure needs a re-run before anyone can say whether it matters. An unstable test suite slows the CI pipeline too, because each failed test run waits for a retry and blocks the merge queue behind it.

The numbers from large systems show that this is normal, not rare. A post on the Google Testing Blog, [Flaky Tests at Google and How We Mitigate Them](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html), reports that about 1.5 percent of all test runs gave a flaky result, and almost 16 percent of tests had some level of flakiness. It also says about 84 percent of observed pass-to-fail transitions in post-submit testing involved a flaky test. With an average project of about 1,000 tests, a 1.5 percent flake rate means roughly 15 tests will likely fail on a given run. Your numbers will differ, but the lesson holds: at scale, flakiness is a certainty, so you need a process.

Browser-based [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/) is especially exposed. Each test depends on a browser, a network, a deployed application, test accounts and often third-party services. More moving parts mean more chances to vary. That is why e2e tests tend to be less stable than unit tests, which have far fewer moving parts.

## The five usual causes of flaky end-to-end tests

Fowler's article names five common causes. Each one applies to browser tests.

1. **Lack of isolation.** Tests share state, such as database records or a logged-in session, so one test changes what another sees. Fix: build the starting state again for each test, or clean up after it.
2. **Asynchronous behavior.** The page needs time to respond, and the test acts too early or too late. Fowler's advice: "Never use bare sleeps to wait for asynchronous responses."
3. **Remote services.** A live payment sandbox, mail service or identity provider is slow or down. Fix: replace the remote system with a test double where the test does not need the real one.
4. **Time.** Tests that read the system clock behave differently at midnight, at month end or across time zones. Fix: control the clock in the test.
5. **Resource leaks.** A test leaves a connection or session open, and a later, unrelated test fails when the resource runs out.

The Google post adds concurrency, reliance on non-deterministic or undefined behavior, flaky third-party code and infrastructure problems. Treat both lists as a checklist when you investigate the root cause of a failing test.

## Fix the waits first

In browser tests, timing is usually the first suspect. A test that clicks a button before it is ready, or checks a message before it appears, will pass on a fast machine and fail on a busy one.

A fixed pause such as "wait 5 seconds" is the worst answer. It wastes time when the page is quick, and it still fails when the page is slow. Fowler suggests polling at a short interval with a generous overall timeout.

Modern tools build this in. Playwright's documentation on [actionability](https://playwright.dev/docs/actionability) lists the checks it performs before an action: the element must be visible, stable (its position does not change between animation frames), enabled, able to receive events at the click point, and, for typing, editable. Playwright waits until the checks pass, or fails with a timeout error. Its best-practices page adds that web-first assertions retry until the condition is met.

Practical rules:

- Wait for a condition a user could see, such as a heading or a row, not for a number of seconds.
- Prefer a selector based on role, text or a test ID over long CSS or XPath paths, which break when the page layout changes.
- Set one generous timeout for the whole step instead of many small sleeps.
- Check the result with an assertion that retries.

## Isolate test data and the test environment

The second big lever is data. Give each test its own account, its own order or its own folder. Do not let two tests edit the same record. If tests must run in parallel, shared data guarantees random failures.

Also look at the environment. A shared staging system that other teams deploy to in the middle of your run will cause failures that no test fix can cure. Agree on deployment windows, or run your suite against a dedicated environment.

If a step depends on an outside service, ask whether the test is about that service. If not, replace it with a stub. Keep a small number of tests that use the real service, and treat them as a separate group.

Finally, make every failure easy to diagnose. Keep the log, a screenshot and a trace of each failed test run in your CI pipeline. Playwright's best-practices page suggests collecting a trace on the first retry of a failing test, so you can replay what happened instead of guessing. With a log and a trace, a flaky test turns into a clear workflow problem you can fix, such as a timeout on one slow UI step.

## What to do with tests you cannot fix yet

Some flaky tests need more time than you have, and some depend on code you do not own. Then manage them openly, and keep the stable test results trustworthy.

- **Quarantine.** Fowler describes moving non-deterministic tests into a separate suite, so healthy tests keep giving reliable feedback. He adds that quarantined tests must still be fixed quickly, and that you should limit how many can accumulate or how long they can stay.
- **Retry with a record.** Google describes re-running failing tests and marking a test as flaky, so that it reports failure only after three failures in a row. The post calls this hardly a perfect solution, and warns that auto-quarantine could mask a real race condition.
- **Track flakiness over time.** Google also describes tools that detect changes in a test's flakiness level. Even a simple list of tests with their pass rate shows where to look first.

Whatever you choose, make the flaky list visible, give each test an owner and set a date.

## Example: finding the cause in three steps

The numbers are made up.

A suite has 200 browser tests. Over two weeks, 14 of them fail at least once without a code change. That is 7 percent of tests.

1. **Group by cause.** The team reads the failure logs and sorts the 14 tests. Eight fail with a timeout on a button, four fail because two tests edit the same customer record, and two fail only after a deploy to staging.
2. **Fix the biggest group.** The team replaces fixed sleeps in the eight timing tests with waits for visible conditions. Seven stop failing.
3. **Fix the next group.** Each test that edited the shared customer now creates its own customer. The four tests stop failing.

After the third step, three flaky tests remain. The team quarantines the two deploy-related tests and gives each an owner and a two-week deadline. The suite's flaky share drops from 7 percent to 1.5 percent, and the team re-checks it every week.

## Common mistakes

- **Adding sleeps.** They hide the problem for a while and slow every run.
- **Retrying everything and moving on.** Retries without a record hide real defects, and the root cause stays in place.
- **Sharing test data between tests.** Parallel runs turn this into random failures.
- **Testing third-party services in every test.** Stub them where the service is not the point.
- **Letting quarantine grow without limits.** A quarantine with no owner becomes a graveyard.
- **Blaming the tool first.** Check timing, data and environment before you switch frameworks.

## How software can help

Start with what your framework offers: auto-waiting, traces and retries on CI. Add a dashboard of failures by test and by cause, so patterns are visible. A spreadsheet works at first. Tools that use an [AI agent](https://www.m365.fm/entity/ai-agent/) to run tests from plain-language steps may reduce some timing problems, because the agent decides how long to wait, but they bring their own risks, such as misread instructions. Pilot them on a few tests and compare the flaky rate before you decide.

## Next step

List your ten most unreliable tests this week, assign a likely cause to each from the five above, and fix the waiting problems first. Then track the rate of flaky end-to-end tests every week, and protect the value of your [regression testing](https://www.m365.fm/entity/regression-testing/) suite with a limit on quarantine.
