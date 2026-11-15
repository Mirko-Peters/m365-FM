---
title: "Testing in plain language: how to evaluate a QA tool"
summary: "A practical checklist for evaluating a QA tool for end-to-end testing: what to demand from any product, how plain-language testing works, and how to run a fair pilot before you commit."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [end-to-end-testing, genta-automation]
faq:
  - q: "What is end-to-end testing and how does it differ from unit testing?"
    a: "End-to-end testing, often called front-end or UI testing, simulates a real user in a browser to confirm that complete workflows, such as logging in or checking out, actually succeed. Unit tests check small pieces of code in isolation. End-to-end tests check that the pieces work together from the user's point of view."
  - q: "What should I check when evaluating a QA tool for browser-based testing?"
    a: "Look at how tests are written and maintained, how failures are reported (screenshots, logs), where tests run, how environments and secrets are handled, and what access control and audit options exist. Then run a pilot on a few real workflows from a non-production environment and judge the results yourself."
  - q: "Can plain-language test descriptions replace scripted UI tests?"
    a: "That depends on your applications and your team. Plain-language tools aim to reduce the effort of writing and maintaining scripts, but you should verify this on your own workflows. A pilot that compares effort, stability and the clarity of failure reports will tell you more than any product description."
---

Buying a QA tool is easy to get wrong. A demo shows a clean run on a friendly application, and the real costs appear months later: tests that need constant repair, failures nobody can explain, access rules that do not fit your organisation.

This article gives you a practical way to evaluate a tool for [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/). It covers what to ask, what to pilot and how to read the results. One tool, [Genta Automation](https://www.m365.fm/entity/genta-automation/), is used as an example of a plain-language approach, based only on the vendor's own statements.

## What end-to-end testing actually checks

End-to-end testing, also called front-end or UI testing, simulates a real user in a browser. Instead of checking a function in isolation, it confirms that a complete workflow succeeds: logging in, searching, submitting a form, checking out.

That makes it a different kind of safety net from unit tests. A unit test can pass while the login page is broken, because individual pieces can work alone and still fail together. An end-to-end test follows the path a user would take.

Imagine a team that owns an internal web application for expense claims. The code for each screen has tests, yet a change to the sign-in redirect could still break the whole flow. A test that signs in, creates a claim and submits it is designed to catch that kind of problem.

The trade-off is cost. Browser-based tests are slower than unit tests, and they depend on the user interface, which changes often. This is why the way a tool handles test creation and maintenance matters so much.

## Questions to ask any QA tool

Before looking at features, write down what you need. These questions apply to any product, including the one described later.

**How are tests written?** Some tools use code and selectors, some use recorders, some use plain-language descriptions. Ask who on your team will write tests, and who will repair them.

**What happens when the interface changes?** A renamed button or a moved field is routine. Find out what your team has to do afterwards.

**How are failures reported?** A bare "failed" is not useful. Look for screenshots, logs and other artifacts that let someone understand the failure without re-running it by hand.

**Where do tests run?** Cloud, on-premises or self-hosted agents all have different implications for security, network access and cost. Regulated or isolated environments may rule some options out.

**How are environments handled?** You will likely test development, staging and perhaps production. Check how the tool separates them and how it stores credentials and other secrets.

**Who can do what?** Role-based access control, API keys and an audit log matter once more than one team uses the tool.

**How does it fit your pipeline?** Look at schedules, triggers by webhook or API, and how results reach the people who need them.

Rank these by your own priorities. A small team with one application may care most about effort. A larger organisation may care most about access control and audit.

## What a plain-language approach looks like

Traditional UI automation relies on selectors and waits: you tell the tool exactly which element to find and how long to wait for it. Both can be sources of fragile tests.

Genta Automation, a product of Cognillo, takes a different approach, according to the vendor. Testers describe in plain language what the application should do. Genta then controls the browser, runs the test on a clean cloud virtual machine and reports pass or fail, with screenshots, logs and failure artifacts. The vendor states that selectors, unstable waits and idle runners are not needed. It describes the platform as aimed at QA leads, software development engineers in test (SDETs) and automation engineers.

The vendor also names these functions:

- test case and suite management with feature coverage tracking
- cloud execution with on-demand virtual machines and parallel runs
- scheduled runs, and triggers by webhook or API
- retry and timeout policies
- environments such as development, staging and production, with encrypted variables
- dashboards with export to Excel, CSV or PDF
- several organizations, role-based access control, API keys and an audit log

On deployment, the vendor says the platform can be cloud-hosted or on-premises, for public and private web and desktop applications, with self-hosted agents offered for regulated or air-gapped environments. A free plan exists, and the product page names paid plans starting at 29 US dollars per month (as of November 2026). Check the [product page](https://www.cognillo.com/genta) for current details. At the time of checking, the walkthrough videos for Genta are marked as "coming soon" on the [videos page](https://www.cognillo.com/videos).

These are the vendor's statements and were not tested by M365.FM. Cognillo sponsors M365.FM. Treat the list as a set of claims to verify in your own pilot, in the same way you would treat any vendor's description.

## How to run a fair pilot

A pilot turns claims into evidence. Keep it small and comparable.

**Pick two or three real workflows.** Choose flows that matter and are stable enough to test: sign-in, a core form, a search. Avoid starting with your most complicated screen.

**Use a non-production environment.** Run pilots against development or staging, with test accounts. If a workflow creates, changes or deletes data, such as submitting orders or removing records, make sure it happens in a test environment that you can reset, and that you have a backup or a way back before you start. Do not point an unproven tool at production data.

**Define what you will measure.** Without inventing targets, compare the same things for each tool you consider:

1. Effort to create each test
2. Effort to adjust a test after a deliberate interface change
3. Clarity of the failure report for a deliberately broken workflow
4. Ease of running tests on a schedule or from a pipeline
5. Fit with your access control and audit needs

**Break something on purpose.** Change a label, move a button, or disable a feature in the test environment and see what the tool reports. A tool that has only been seen on passing runs has not been tested under failure conditions.

**Involve the people who will own it.** The person who maintains tests in six months should take part in the pilot, not only the person who signs the purchase.

**Write down the result.** A short note per workflow, with screenshots of the failure reports, is enough to compare options later.

## Reading the results and deciding

After the pilot, resist the urge to pick the tool with the most features. Look at the answers to a few plain questions.

Did your team understand every failure without extra investigation? Could a second person pick up a test written by the first? Did the tool run where your security and network rules require it? Do the access and audit options match what your organisation expects?

Also consider what the tool does not cover. End-to-end tests complement, but do not replace, unit and integration tests. If your applications are mainly desktop or mainly APIs, check that the tool supports them. If you are in a regulated environment, confirm deployment options with the vendor in writing and check the current terms.

Pricing deserves the same care as capability. A free plan or a low starting price tells you where the entry point is, not what your usage will cost. Ask what drives cost for your expected volume, such as parallel runs or the number of users, and confirm current plans directly with the vendor.

## Practical takeaways

- Define your needs first: who writes tests, who maintains them, where they must run.
- Judge a tool by its failure reports and maintenance effort, not by a clean demo run.
- Pilot two or three real workflows in a non-production environment, with a backup or a way back for anything that changes data.
- Break something on purpose to see how the tool reports it.
- Treat vendor descriptions, including those of plain-language tools such as Genta Automation, as claims to verify in your own pilot.
- Check access control, audit, environment handling and deployment options before you roll out beyond one team.
- Keep end-to-end tests as one layer next to unit and integration tests, not as a replacement.
- For Microsoft 365 context and related topics, see [Microsoft Learn](https://learn.microsoft.com/) and the M365.FM site.
