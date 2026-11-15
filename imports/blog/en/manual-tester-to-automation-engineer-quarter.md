---
title: "From manual tester to automation engineer: a realistic first quarter"
summary: "Manual tester to automation engineer: a realistic first quarter with three phases, one language and framework, a first regression suite and how AI tools fit."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, regression-testing, ai-upskilling]
keypoints:
  - "Your testing judgment is the hard part of the move to automation; the code is learnable, so the first quarter is about building the habit of writing small, reliable checks."
  - "A realistic first quarter has three phases: fundamentals and one tool, a first small suite on a real application, and then a pipeline run plus a short write-up of what you built."
  - "Pick one language and one framework, such as Python or JavaScript with Selenium or Playwright, and finish a project before comparing tools."
  - "Start with a handful of stable, repeated regression checks, because maintenance can cost as much time as writing new tests."
  - "AI assistants can draft test code from user stories, but you still need the basics to review what they produce."
faq:
  - q: "How long does it take to move from manual testing to automation?"
    a: "A first quarter is enough to write and run a small, useful suite, but not to design frameworks alone. One guide plans six months at 10 to 15 hours a week, with fundamentals first. Treat 90 days as a start: aim for a working suite in a pipeline and a short record of what you built."
  - q: "Do manual testers need to learn programming to move into automation?"
    a: "Yes, at a basic level. You need one language, control flow, functions, data structures and version control. Low-code and recording tools can help you start, but recorded tests often need hand-written code for errors and loops, so the fundamentals still matter. Learn them early, then build projects on top."
  - q: "Which tests should a new automation engineer automate first?"
    a: "Start with stable, repeated checks of critical user flows, such as login and checkout, that you already run by hand on every release. These regression checks give quick payback. Leave exploratory and usability testing manual, and avoid automating features that change every week."
---

The move from manual tester to automation engineer is smaller than it looks, and it takes longer than a weekend course suggests. This guide is for manual testers and QA leads who want a plan for the first three months of a career in software testing and test automation. You will see what changes in the role, a three-phase quarter, how to choose a language and a first project, which regression checks to automate first, and where AI tools help. A worked example with made-up numbers shows one tester's quarter.

## What actually changes in the role

The PractiTest guide on [becoming an automated tester](https://www.practitest.com/resource-center/article/manual-to-automated-tester/) makes a point worth putting first: automation is still testing. Good test design matters more than the choice of tool, because a tool only tests what you tell it to test. Your habits as a manual QA tester, such as noticing odd behavior, thinking about boundaries and asking what could go wrong, are the part that does not come from a tutorial.

What changes is the unit of work. Instead of running a test case, you write a small program that runs it, and then you keep that program working. The same guide expects you to spend a lot of time on problem solving, mostly deciding whether a failure comes from the script, the environment or a real defect. Automated tests are also largely confirmatory. They act as a safety net, so many passing results are normal, and the useful question is whether your checks are too easy.

One more change is easy to miss. You become responsible for code that other people depend on. A check that fails for no reason costs the whole team time and trust, so reliability matters more than the number of checks.

## Manual tester to automation engineer: the first 90 days

The sources do not agree on one schedule, so the plan below is our own suggestion, built from their advice. It uses three phases of about a month each.

**Phase 1, weeks 1 to 4: fundamentals and one tool.**

- Learn automation skills in small steps, not all at once.
- Audit your manual work. Note what you repeat most often and how long each run takes.
- Learn the basics of coding in one language: variables, control flow, functions, lists and dictionaries, reading a file, handling errors. One [guide on the transition](https://yrkan.com/blog/manual-to-automation-transition/) puts programming fundamentals first and describes the months before the first test as groundwork.
- Install Git and keep everything in a repository from day one.
- Write your first tiny scripts away from your product, such as a log parser or a small data generator. That keeps the first failures cheap.

**Phase 2, weeks 5 to 9: a first small suite on a real application.**

- Pick a framework for automation testing and write checks for three or four critical flows, such as sign-in, search and checkout.
- Use a public demo application or an open-source project if your own product is not suitable yet. PractiTest suggests starting with a web application, and leaving mobile testing for later because it is harder.
- Organize the code from the start, for example with page objects and clear names, so that a change to the page does not mean editing twenty tests.

**Phase 3, weeks 10 to 13: a pipeline and a record.**

- Run the suite from a continuous integration job, so it runs on every change without you pressing a button.
- Write a short README: what the suite covers, how to run it, what it does not cover.
- Review one week of results. Which checks failed without a defect? Fix or remove them.
- Show the work to a developer and ask for a review. Learning alone is slow, and that guide lists learning in isolation as a mistake.

The same guide describes a six-month plan at 10 to 15 hours a week, so a quarter alone will not make you a senior engineer. It will give you a working suite, a habit and a portfolio.

## Choose one language and one framework

Pick one and finish a project with it.

- **Language.** The guide suggests Python for beginners and JavaScript or TypeScript for modern web stacks. Choose what your developers use, so someone can review your code and answer questions.
- **Browser framework.** Selenium and Playwright are the two named most often in the sources. The [90-day roadmap on DEV Community](https://dev.to/qa-leaders/from-manual-testing-to-ai-agents-a-90-day-transformation-roadmap-46l1) suggests Playwright for modern web apps, Cypress for rapid development and Selenium for legacy support. Pick the one your team already uses if there is one.
- **Test runner.** Pytest for Python or Jest for JavaScript, as that guide lists.

PractiTest adds a useful order of learning: first general automation approaches, which transfer across tools and languages, and only then an in-demand tool. Check your company's stack and a few job postings before you decide. Do not buy a tool and expect coverage to follow. The same guide names tool-first thinking as a pitfall.

## Which regression checks to automate first

Your manual regression list is the best source of what to automate first, because you already know it is worth running. The [regression testing](https://www.m365.fm/entity/regression-testing/) work you repeat every release is the part a script handles best. The DEV Community roadmap suggests picking five critical user flows in its first weeks and building a smoke suite that runs on every deployment as the first quick win.

Choose checks that are:

- **Stable.** The feature has not changed for weeks and will not change next sprint.
- **Repeated.** You run them every release or every build.
- **Clear.** There is one expected result you can state in a sentence.

Skip the rest for now. The guide is firm that exploratory and usability testing should not be automated, and it lists "automating everything" as a mistake. A handful of reliable checks beats a hundred fragile ones, because, as PractiTest warns, maintenance can consume as much time as creating new tests.

A first suite of this kind usually covers a few browser flows end to end. This is [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/) in its simplest form: a script acts like a user and confirms that a whole workflow, such as logging in or checking out, still works. Add API testing when a flow can be tested without the browser, because those tests run faster and break less often.

## Where AI tools fit into the quarter

AI assistants can speed up the work, but they do not replace the basics. The DEV Community roadmap places AI-assisted test generation after the first month of fundamentals, and the order is sensible. It suggests generating test scenarios from user stories, comparing the output with hand-written code, and giving the assistant context such as your page object pattern and naming conventions. It also advises understanding the basics instead of relying entirely on AI, and fixing a weak manual test strategy before automating it.

You cannot review what you do not understand. If you cannot read the generated test, you cannot tell whether it checks the right thing or merely passes. That is our own reasoning, but it matches the sources' order. Use the AI assistant for drafts and for explaining unfamiliar code, and keep the decisions about what to test with you.

Self-healing tools, which often use AI, are a related topic. PractiTest cautions that they can repair changed locators but do little when the process in a test changes. Treat them as help with maintenance, not as a reason to skip clean design. Learning to use these tools well is part of [AI upskilling](https://www.m365.fm/entity/ai-upskilling/): training tied to a recurring task, judged by how the work changes and not by courses completed.

## Example: one tester's first quarter

The numbers are made up.

A tester on a QA team of eight runs a manual regression list of 80 cases before each release. The run takes two people about a day and a half. She has no programming background.

In weeks 1 to 4, she works through Python basics for about five hours a week and writes three small scripts. She also records which 12 cases she runs most often and which have not changed in two months.

In weeks 5 to 9, she writes checks for 9 of those 12 cases using Playwright, with page objects for the sign-in and order pages. Two checks fail at random, and she traces both to timing problems and fixes them. A developer reviews her code and asks her to remove duplicated steps.

In weeks 10 to 13, she runs the 9 checks from a pipeline on every merge, and writes a one-page README. The checks take about six minutes. The manual regression run drops from a day and a half to about a day, because 9 of 80 cases are covered. The following quarter's plan is 15 more checks, and a decision to keep exploratory work as manual testing.

## Common mistakes

- **Watching tutorials without building anything.** The transition guide calls this tutorial hell and suggests spending far more time doing than watching.
- **Skipping basic coding skills.** Jumping straight to a framework leaves you unable to debug your own scripts.
- **Automating everything.** Exploratory and usability testing stay manual, and unstable features are poor candidates.
- **Ignoring maintenance.** Plan time to fix and delete checks, not only to write them.
- **Trusting a passing run.** Scripts can pass for the wrong reason, so watch them run from time to time and break them on purpose.
- **Learning in isolation.** Ask for code review and find a mentor or a community early.

## How software can help

Start with free tools: a code editor, Git, a public demo application, and the built-in runners of your chosen framework. A continuous integration service runs the suite on every change, and a simple tracking list can hold your candidate checks, their status and their last review date. Recorders and AI assistants can draft test code, but review every line. If your team later wants a platform that manages tests for you, compare it with what you built, and judge it by how much maintenance it removes in practice.

## Next step

Write down the ten manual checks you repeat most often and mark the three most stable ones. Start your manual tester to automation engineer plan this week by choosing one language and one framework, and by writing the first of those three checks.
