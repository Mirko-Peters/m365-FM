---
title: "Test evidence for audits: screenshots, logs and pass/fail records"
summary: "Automated test evidence for audits: what a QA lead should capture, how screenshots, logs and pass/fail records stay reviewable, and how to answer an auditor."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, audit-readiness, compliance, genta-automation]
keypoints:
  - "An auditor needs to see from the records alone what was tested, what was expected, what happened and who or what executed the test, so a bare pass or fail is rarely enough."
  - "Useful evidence has five parts: screenshots or recordings, execution logs, attachments such as test data, execution metadata and links from failures to defects."
  - "Screenshots are not legally required, and system logs can serve as evidence if the logs are trustworthy and the test automation tool itself is validated."
  - "Scale the depth of evidence to risk: keep full records for high-risk functions and lighter records for low-risk ones."
  - "Link every test to a requirement and measure how fast you can pull complete evidence for one requirement."
faq:
  - q: "What counts as test evidence for an audit?"
    a: "Test evidence is any record that lets a reviewer see what was tested, what was expected and what happened. Typical parts are the test steps, screenshots or recordings, execution logs, the result, and metadata such as who executed the test, when and in which environment. A bare pass or fail is usually too thin."
  - q: "Do auditors require screenshots of every test?"
    a: "Not as a general rule. A medical-device quality specialist notes that screenshots are not a legal requirement, and the FDA's draft guidance on computer software assurance says system logs and audit trails can serve as records. What matters is that a reviewer can tell what happened. Set screenshot rules by risk."
  - q: "Can automated test logs replace manual screenshots?"
    a: "Sometimes. Logs can serve as evidence if the output shown on screen matches the log entries, the results are checked against the requirements, the test automation tool is validated, and the logs meet any record rules that apply to you. Check with your quality or compliance team before you drop screenshots."
---

Automated test evidence for audits is the set of records that proves a test was executed, shows what it checked and states what happened, in a form a stranger can review months later. This guide is for QA leads whose teams are asked for proof during a compliance review or a validation. You will see what an auditor looks for, which parts of a test execution are worth keeping, how much detail to record, and how to organize it. A worked example with made-up numbers shows a team going from a scramble to a five-minute answer.

## What auditors actually ask for

An auditor does not want your test tool. The auditor wants to judge whether your product does what it should and whether your own records show it. The Johner Institute article on [objective evidence](https://blog.johner-institute.com/quality-management-iso-13485/objective-evidence/), written for medical-device quality, puts it this way: documentation should be detailed enough that an uninvolved person can understand what was done and why the requirements are met.

The same article describes four levels of detail in test records, from a plain "passed" or "not passed" up to a full video. It rates the first level as insufficient, says the second gives limited traceability, and says that from the third level, screenshots, reviewers should have enough to work with. It also says a bare pass or fail is not routinely accepted.

Your field has its own rules, but under almost any framework or standard, the same questions come up:

- What was tested, and against which requirement?
- What did you expect to happen?
- What happened, and who or what executed the test?
- When and in which environment did it happen?
- If it failed, what did you do about it?

Audit evidence that answers these five questions without a conversation is what a good file looks like. Treat this as part of [audit readiness](https://www.m365.fm/entity/audit-readiness/) for your test team, so that you stay audit-ready all year and not only in the weeks before a review.

## Automated test evidence for audits: what to capture

The TestCollab guide on a [test evidence strategy](https://testcollab.com/blog/building-a-test-evidence-strategy-that-scales) names five kinds of evidence. They are a good checklist for any documentation:

1. **Screenshots and recordings.** Visual proof of screen states, error messages and failures, which helps most in browser-based [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/).
2. **Execution logs.** Step-by-step records of what passed, what failed and why.
3. **Attachments.** Test data, configuration snapshots, API responses or exported reports.
4. **Execution metadata.** Who started the run, when, in which environment and with which configuration.
5. **Defect links.** A connection between each failed test and its bug ticket.

To automate evidence collection is the natural next step, and teams that automate it stop depending on memory. A tool can attach a screenshot on failure and send results with their attachments to a test management system, and automated evidence of this kind needs no one to remember anything. The guide adds a useful point: evidence captured during the test is more accurate than evidence rebuilt later. Good evidence capture, with records kept next to the results, beats a spreadsheet that someone fills in before the audit.

Not every test needs every artifact. The guide suggests that a smoke test may need only a status, while an acceptance test may need a screenshot of each critical screen, and a regression test may need execution records and environment details. Write these rules down once, per test type, so that the audit process does not depend on guesswork.

## Screenshots, logs or video: how much is enough

Johner makes three points that save time.

- **Screenshots are not a legal requirement.** They are one way to show what happened, for example that a specific warning appeared.
- **Logs can serve as evidence.** The conditions are that the screen output and the entries match, the results are evaluated against the requirements, the test automation tool is validated, and the records meet the rules that apply, such as 21 CFR Part 11 for electronic records in the United States.
- **Video has costs.** It shows execution but does not evaluate the result, it takes time to review, it uses a lot of storage and it is hard to use for regression testing.

The FDA's draft guidance on computer software assurance, as explained in a [Jama Software article](https://www.jamasoftware.com/blog/decoding-the-fdas-draft-guidance-on-computer-software-assurance-for-medical-devices-bio-pharma/), goes in the same direction. According to that article, screenshots are not required, and system logs, audit trails and other electronic data can serve as the record. The record should show the intended use, the risk determination, the assurance activities performed, any issues found and a conclusion on whether the results are acceptable. The article also describes a risk-based approach: scripted testing for high-risk functions and unscripted testing for lower-risk ones. Check which version of the guidance applies to you, because the article describes the draft.

The practical rule is to scale the depth of the record to the risk. Keep full records, with steps, expected results, screenshots and logs, where a failure could harm people, money or compliance. 

Johner also mentions test robots that simulate user actions and record the reactions, with AI possibly assisting the evaluation. If you use AI to judge results, treat the AI output as a draft, keep a person responsible for the verdict, and validate the AI features like any other part of the tool. An AI verdict with no record of the reasoning is weak evidence, and AI-driven checks need the same record as every other check. You can automate the capture of that record too.

## Make the record trustworthy and easy to find

Manual evidence collection means manual work, and manual work invites human error, especially in audit season when teams attach evidence by hand. Evidence that cannot be found, or that someone could have edited, is weak evidence. Four habits help.

1. **Trace every test to a requirement.** TestCollab recommends linking each test to the requirement it validates, so the evidence shows which test covered which requirement and with what result. A traceability matrix can build these links automatically.
2. **Keep the audit trail of the test executions.** Store the history, so that a reviewer can see every execution of a test, not only the last green one. Failed executions that were fixed and repeated belong in the history.
3. **Control who can change what.** Limit edit rights to results and attachments, and record who changed a test or its expected result. Ask your quality team whether you need formal signatures.
4. **Add a review gate.** TestCollab suggests a custom status such as "Needs Evidence Review" that blocks a test from being marked complete until the required artifacts are attached.

The same guide offers three measures that you can track:

- **Evidence coverage:** the share of test executions that have the required artifacts. Its example is that 60 percent against a policy requiring screenshots points to a process problem.
- **Time to evidence:** how soon after an execution the artifacts are attached.
- **Retrieval speed:** whether you can pull complete evidence for any requirement in under five minutes, which is the standard the guide suggests.

Keep in mind that the guide does not cover how long to retain records or how to prevent tampering. Those answers come from your regulator, your contracts and your own policy. If your company also works under a compliance framework such as SOC 2, ask your compliance lead whether the same records can serve both, and connect the test workflow to your pipeline through an integration, so the records arrive without manual copying.

## Which evidence tasks to automate, and which need a person

Evidence automation works best on repetitive steps: data collection from test runs, attaching test logs and screenshots, and linking each result to its requirement. In our view, that spares you the busywork of manually collecting evidence before every audit preparation round. A person should still review the supporting evidence, because only a person can judge whether it supports a specific control or an audit requirement. Keep test scripts, test logs and results from test runs in one store that serves as the source of truth, and use the same compliance evidence for each framework that asks for it, if your quality team agrees.

## Example: from a scramble to five minutes

The numbers are made up.

A QA lead supports an invoicing application that falls under an internal control review. The team executes 60 automated tests before each release. Before the review, the reviewer picks five requirements and asks for proof of testing.

The first attempt is painful. Test results sit in a pipeline output that expires after 30 days. Screenshots exist for only 27 of the 60 executions, which is 45 percent evidence coverage. Nobody can say which test covers credit notes. It takes the team two days to answer, and the answer has gaps.

After the review, the lead makes four changes. Every test gets a requirement ID. The pipeline attaches a screenshot and the execution record to each failed step and a final screenshot to each critical test. Results, with history, move to a store that is kept for the whole review period, and a review status blocks completion until artifacts are attached. The lead also writes a one-page rule per test type.

At the next review, the reviewer again asks about five requirements. The team exports the history for each one in about five minutes per requirement. Evidence coverage is now 58 of 60 executions, and the two exceptions are documented smoke tests with a status only, as the rule allows.

## Common mistakes

- **Keeping only pass or fail.** A reviewer cannot tell what was checked.
- **Capturing evidence after the fact.** Rebuilt records are less accurate and look weaker.
- **Recording everything, always.** Full video for every test costs storage and review time, and little of it is looked at.
- **No link to requirements.** Without traceability, you cannot show what a test proves.
- **Throwing away history.** Reviewers may ask about failed executions, not only the final result.
- **Trusting the test tool blindly.** If its records are your evidence, the tool that produced them may itself need validation.

## How software can help

Start with your test management tool and CI system. They can store results, attach artifacts and keep history. Some testing tools and testing platforms add evidence features. [Genta by Cognillo](https://www.m365.fm/entity/genta-automation/) is one example. According to the vendor, it reports pass or fail with screenshots, logs and failure artifacts, and offers role-based access control, an audit log and dashboard exports to Excel, CSV or PDF. These are the vendor's statements and were not tested by M365.FM. Compare tools in a pilot, and check whether the records meet your own [compliance](https://www.m365.fm/entity/compliance/) rules.

## Next step

Pick one regulated feature and write down which five facts an auditor would need to see for its tests. Then check a recent test execution against that list, and use the gaps to set your rule for automated test evidence for audits.
