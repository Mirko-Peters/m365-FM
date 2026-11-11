---
title: "Genta: what “text to action” means for software testing"
summary: "Genta from Cognillo is described as a generative AI platform that runs tests written in plain language. This article explains what 'text to action' means for end-to-end testing, what to check before adopting it, and where it fits."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [genta-automation, cognillo, end-to-end-testing]
faq:
  - q: "What does 'text to action' mean in software testing?"
    a: "It means a tester describes in plain language what an application should do, and the tool carries out those actions itself, for example in a browser, then reports pass or fail. Genta Automation is described by Cognillo as working this way, without hand-written selectors or wait logic. How reliable this is for your applications should be verified in a pilot."
  - q: "Is Genta Automation the same as the SharePoint Essentials Toolkit?"
    a: "No. Both are Cognillo products, but they serve different purposes. Genta Automation is a generative AI platform for quality assurance and software testing. The SharePoint Essentials Toolkit is a tool for SharePoint administrators and site owners, with reports on permissions, sharing links, broken links and content tasks."
  - q: "Does plain-language testing replace the need to plan tests?"
    a: "No. Writing a test in plain language changes how a test is expressed, not whether it is well designed. You still need to decide which workflows matter, what the expected result is, and what test data and environments to use. Treat any such tool as support for that planning, not a substitute."
---

Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages ([Cognillo](https://www.m365.fm/entity/cognillo/)).

Most teams know what they want from end-to-end tests: confirmation that a real user can log in, search, submit a form or check out. Fewer teams enjoy the effort of writing and maintaining those tests. Selectors change, timing assumptions break, and a test that passed yesterday fails today for reasons unrelated to the product.

"Text to action" is one answer to that problem. Instead of scripting every click, you describe the intended behaviour in plain language and let software carry out the actions. [Genta Automation](https://www.m365.fm/entity/genta-automation/), a product from [Cognillo](https://www.m365.fm/entity/cognillo/), is described by the vendor as working this way. This article explains what the approach means, what the vendor says about it, and what you should check before using it.

## What "text to action" means

In a classic automated UI test, a developer or test engineer writes code that finds elements on a page, clicks them, waits for results and checks values. The test describes *how* to do something.

In a text-to-action approach, the tester describes *what* should happen, for example "log in with a test account and confirm that the dashboard appears". A generative AI system interprets that description, performs real actions in the application and reports the outcome.

According to Cognillo's product page, Genta Automation is a generative AI platform that carries out real software actions. Users describe what the application should do; Genta controls the browser, runs the test on a clean cloud virtual machine and reports pass or fail, with screenshots, logs and failure artifacts. The vendor also states that selectors, unstable waits and idle runners are not needed.

These are the vendor's own statements and have not been tested by M365.FM. They describe the design intent, not a result you should assume in your environment.

## Where it fits: end-to-end testing

The practice this approach targets is [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/), also called front-end or UI testing. It simulates a real user in a browser to confirm that complete workflows, such as logging in or checking out, actually succeed.

End-to-end tests answer a different question than unit tests. A unit test asks whether a small piece of code behaves correctly. An end-to-end test asks whether the whole chain works together: front end, back end, authentication and integrations.

That breadth is the value, and also the cost. End-to-end tests touch many moving parts, so they can be slower to write and harder to maintain than lower-level tests. A tool that expresses tests in plain language targets the writing and maintenance effort, not the need for the tests themselves.

Imagine a team that maintains a web application with a sign-in page, a search function and a report export. They might describe three workflows in plain sentences, one per feature, and run them on a schedule. That is a hypothetical example to show the idea, not a recommendation for any specific setup.

## What Cognillo says Genta offers

Beyond the core idea, the vendor's product page lists a range of functions. All of the following are vendor statements, not tested by M365.FM:

- Test case and suite management with feature coverage tracking
- Cloud execution with on-demand virtual machines and parallel runs
- Scheduled runs, and triggers by webhook or API
- Retry and timeout policies
- Environments such as development, staging and production, with encrypted variables
- Dashboards with export to Excel, CSV or PDF
- Several organizations, role-based access control, API keys and an audit log

On deployment, the page says Genta can be cloud-hosted or on-premises, for public and private web and desktop applications, and that self-hosted agents are offered for regulated or air-gapped environments. It also mentions a free plan and paid plans starting at 29 US dollars per month, as of November 2026. Check the current pricing and terms with the vendor before planning a budget.

The audience named on the page is QA leads, software development engineers in test (SDETs) and automation engineers. Cognillo's video page marks the Genta walkthrough videos as "coming soon", so demos of Genta may not yet be available there.

For context, Cognillo describes itself as a software company in Jersey City, New Jersey, operating as Tendero, Inc., and says it has provided enterprise IT solutions since 2012. Cognillo sponsors M365.FM, which is why this article is marked as sponsored.

## What to verify before you adopt it

A plain-language interface raises questions that a script does not. A script follows its code; an AI-driven test interprets what you wrote. Before you build on it, run a pilot and look at these areas.

**Determinism.** Does the same description produce the same actions and the same verdict on repeated runs? A test that passes and fails inconsistently gives an unreliable signal.

**Precision of the check.** "Confirm the dashboard appears" can be satisfied in several ways. Decide how specific an expected result must be, and test whether the tool catches a deliberately introduced defect.

**Evidence.** The vendor says it provides screenshots, logs and failure artifacts. Check whether they are enough for a developer to understand a failure without rerunning it by hand.

**Test data and accounts.** Tests that sign in need accounts and data. Decide how credentials are stored and who can see them. The vendor mentions encrypted variables; confirm how that fits your security policies.

**Environments.** Running against production can change real data. Use development or staging first, test with a pilot setup, and make sure test actions cannot send real e-mails or create real orders; have a way to undo or clean up test data.

**Access and audit.** If several people create and run tests, role-based access and an audit trail matter. Confirm they cover what your governance requires.

## Where this does not replace planning

Describing a test in a sentence is easier than writing code, but it does not decide what is worth testing. The hard questions remain with your team:

- Which workflows are critical enough to automate?
- What is the exact expected outcome?
- Who owns a failing test and fixes it?
- How do tests stay in sync when the application changes on purpose?

A reasonable path is to start small. Pick one stable, high-value workflow, express it in plain language, run it repeatedly in a non-production environment and compare the results with a manual check. Add more only once you trust the signal.

It also helps to keep your existing tests in place while you evaluate. A new approach should earn its place by being reliable in your context, not by being new.

## A note on the SharePoint Essentials Toolkit

Cognillo also makes the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/), a tool for SharePoint administrators and site owners. It covers reports on permissions, oversharing and sharing links, broken links, content tools, migration and scheduled exports, according to the vendor. It is a separate product with a separate purpose and is not related to software testing. Genta Automation is the product relevant to the topic of this article.

## Practical takeaways

- "Text to action" means describing *what* an application should do in plain language and letting software perform the actions and report pass or fail.
- Genta Automation is Cognillo's product for this. Its functions, deployment options and prices are vendor statements, not tested by M365.FM.
- The approach targets the writing and maintenance effort of [end-to-end tests](https://www.m365.fm/entity/end-to-end-testing/), not the need to decide what to test.
- Run a pilot in a development or staging environment before relying on results. Do not point early experiments at production.
- Check repeatability, how precisely expected results are verified, the quality of the evidence, handling of credentials, and access control and audit needs.
- Start with one stable, high-value workflow and keep your existing tests while you compare.
- Confirm current pricing, plans and terms on the [Genta page](https://www.cognillo.com/genta) before budgeting.
