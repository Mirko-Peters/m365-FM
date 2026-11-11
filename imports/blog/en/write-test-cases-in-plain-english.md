---
title: "How to write a test case in plain English that an AI agent can run"
summary: "Write test cases in plain English that an AI agent can run: one behavior per test, one action per step, named elements and a clear, checkable expected result."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, ai-agent, generative-ai]
keypoints:
  - "A plain-English test case has five parts: a title, preconditions, steps, an expected result and the test data, and an AI agent needs all five spelled out."
  - "Write one behavior per test and one action per step, because tool makers report that single-step instructions are the most accurate."
  - "Name each element the way a user sees it, such as the Log In button, instead of writing the button or the field."
  - "Give every test an expected result that can be checked on the screen, such as a title or an amount, never make sure it works."
  - "Read what the agent generated before you trust a pass, and rewrite any step it interpreted in a way you did not mean."
faq:
  - q: "How do I write a test case in plain English?"
    a: "Give the test a short title that states one behavior. List the starting state, then the user actions as separate short steps, then the expected result. Name each element as a user sees it. Keep the test data in the steps. Aim for under ten steps, so the intent stays clear."
  - q: "What is the difference between a test case and acceptance criteria?"
    a: "Acceptance criteria say what must be true for a story to count as done, often in one or two sentences. A test case turns one criterion into a repeatable check with a starting state, exact steps, test data and an expected result. One criterion can lead to several test cases."
  - q: "Can an AI agent write the test cases for me?"
    a: "It can draft them, but a person should review every draft. Models can invent steps or expected results that do not match your product. Use the draft as a starting point, check it against the real user story, and rewrite anything vague before it becomes part of your regression suite."
---

To write test cases in plain English that an AI agent can run, keep each test to one behavior, each step to one action, and each check to one result you can see on the screen. This guide is for QA leads and testers who want to move from scripts to written instructions and still get reliable results. You will learn the five parts of a test case, the rules that make a step runnable, a method to turn acceptance criteria into tests, and a worked example you can copy.

## The five parts of a plain-English test case

A good test case reads like a short story that anyone on the team can follow. In software testing, writing effective test cases is a core QA skill, and manual testers have always written them in plain language. What is new is that an AI agent can now run the test steps. This matters most for [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/), where a test follows a user through a whole workflow in a browser. For an [AI agent](https://www.m365.fm/entity/ai-agent/), each part must be explicit, because the agent cannot ask you what you meant.

1. **Title.** One line that states the behavior, such as "A customer can reset a forgotten password". The title is the first thing a reader sees in a report.
2. **Preconditions.** The state the product must be in before the test starts, for example "A customer account exists and the customer is signed out".
3. **Steps.** What a user does, one action per line.
4. **Expected result.** What the user should see afterwards, in terms you can check on the screen.
5. **Test data.** The exact values used, such as an email address or an order number.

A shared template keeps the test cases of every tester in the same shape, and a test suite with one template is much easier to review. A test case also needs a way to verify the result, which is why the expected result matters.

This is the same shape that behavior-driven development uses. In the Gherkin language, as explained on [Automation Panda](https://automationpanda.com/2017/01/26/bdd-101-the-gherkin-language/), Given sets up the starting state, When performs the action under test, and Then states the expected result. You do not need to use those keywords. The three roles are still useful.

## Rules that make a step runnable by an AI agent

Tool makers publish advice for writing instructions an AI agent can follow. BrowserStack's documentation for its [natural language test agent](https://www.browserstack.com/docs/automate/selenium/set-up-test-env/nl-test-automation-agent-selenium) gives rules that apply to most tools:

- **Start with an action verb.** "Click the Submit button" is clear. "The submit button" is not an instruction.
- **Use one intent per command.** Split multi-step tasks into separate steps.
- **Name the specific element.** Write "the Log In button", not "the button".
- **Scroll first when a target is off-screen.** Add a step before the action.

The same page says reliability drops as commands get more complex, and that single-step instructions are the most accurate. Add three rules from experience:

- **Use the words on the screen.** If the button says "Sign in", do not write "Log in".
- **Put values in the step.** Write "Type ana@example.com into the Email field", not "enter a valid email".
- **Avoid pronouns and vague words.** "It", "there", "properly" and "correctly" all hide a decision that the agent must guess.

## How to write test cases in plain English, step by step

Follow this method to turn a requirement into a test case.

1. **Start from one acceptance criterion.** Take a single sentence from the user story, for example "A customer who forgets a password can set a new one by email".
2. **Pick one behavior.** Each test case checks one behavior. The Automation Panda guide on [writing good Gherkin](https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/) states it as "One Scenario, One Behavior" and says a scenario with several When-Then pairs should be split.
3. **Write the starting state.** Describe it as a state, not as setup actions. "A customer account exists" is better than ten steps that create one.
4. **Write the user actions.** Each action is one short line with a verb and a named element.
5. **Write the expected result.** Say what appears: a heading, a message, a value. Use the exact text.
6. **Add the data.** Put the values in the steps or in a small table under the test.
7. **Read it aloud.** If a new colleague could not run it by hand, the agent will struggle too.

The same guide suggests keeping scenarios short, with fewer than ten steps. A long test case is often several test cases joined together. Variations of one behavior, such as three invalid passwords, belong in a data table, not in three copies of the same steps.

## Example: a password reset test, before and after

The details are made up.

**Before (too vague).** "Check that password reset works." An agent has no starting state, no actions and no result to check. It might pass for the wrong reason.

**After (runnable).**

- Title: A customer can request a password reset link.
- Precondition: A customer account exists for ana@example.com, and the customer is signed out.
- Step 1: Open the Sign in page.
- Step 2: Click the "Forgot password" link.
- Step 3: Type ana@example.com into the Email field.
- Step 4: Click the "Send reset link" button.
- Expected result: The page shows the message "Check your email".

The "after" version has one behavior, five short actions and one visible result. If your product also needs the link in the email to work, write a second test case for that behavior. Do not extend the first one.

Now run it and read the log. Say the agent clicked "Forgot password" correctly but typed the address into a search box. The log shows the mistake, and you rewrite step 3 as "Type ana@example.com into the Email field on the reset form". The Cypress team recommends the same habit for its own plain-English tool: inspect each generated step, and eject to fixed code when you need a stable test.

## Variations: use a data table, not copies

Many test cases check the same behavior with different values. A sign-up form should reject an email address without an @ sign, one without a domain, and one with spaces. Do not write three test cases with identical steps.

The Automation Panda guide notes that Gherkin has no "Or" step. For variations of one behavior, it recommends a Scenario Outline with an Examples table, and it advises including only the variations you need, because extra rows add run time. You can use the same idea in plain English. Write the steps once with a placeholder, such as "Type {email} into the Email field", and add a small table below.

Example table, made up: {email} is "ana.example.com" and the expected message is "Enter a valid email address"; {email} is "ana@" and the message is the same; {email} is empty and the message is "Email is required". Three rows, one set of steps, three clear results. If one row fails, the report shows which value broke the rule.

## A review checklist before you run

Use this list for every new test case:

- The title states one behavior.
- The starting state is a state, not a list of setup clicks.
- Every step starts with a verb and names an element as the screen shows it.
- All values are written out.
- The expected result can be seen and has exact text or a number.
- There are fewer than ten steps.
- Another person has read the test.

## Common mistakes

- **Combining several behaviors in one test case.** When it fails, you do not know which part broke.
- **Describing how instead of what.** Ten steps of keystrokes hide the intent. State the action at the level a user would.
- **Skipping the expected result.** A test case with no check can pass without proving anything.
- **Using internal names.** Test IDs and CSS classes change. Use the labels users see.
- **Letting [generative AI](https://www.m365.fm/entity/generative-ai/) draft tests and accepting them unread.** A model can invent steps that your product does not have.
- **Leaving data to chance.** If a value is not stated, the agent will pick one, and the test may not repeat.

## How software can help

A shared spreadsheet or a wiki page is enough to start. Write each test in the five-part form and review it like code. If you use a test management tool, keep one test per record and link it to the requirement. A natural-language testing tool then reads the same text. Many teams also keep a short style guide with the rules above, so every new tester writes steps the same way.

## Next step

Take three acceptance criteria from your current sprint and write one test case for each, using the five parts. Run them in your tool of choice to write test cases in plain English that an agent can run, then fix every step the log shows as misread.
