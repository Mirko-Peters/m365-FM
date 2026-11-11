---
title: "Test coverage for business apps: how to track what is really tested"
summary: "Feature test coverage tracking shows which features of a business app have tests and which do not. Build a coverage matrix, read its gaps and keep it current."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, regression-testing, genta-automation]
keypoints:
  - "Test coverage asks which features, requirements and use cases have tests, while code coverage only measures how much source code ran during testing."
  - "A coverage matrix maps each requirement or feature to the test cases that check it, along with priority, results, status and an owner."
  - "A linked test shows documented coverage, not successful validation, so track results per build next to the links."
  - "Start from the full list of features, including those without tests, because a matrix built only from existing tests cannot show what was never tested."
  - "Review the matrix during planning, after changes and before release decisions, and keep dated snapshots as evidence."
faq:
  - q: "What is feature test coverage?"
    a: "Feature test coverage describes how many of an application's features, requirements or use cases have at least one test that checks them. It differs from code coverage, which measures how much source code ran during testing. For business apps, feature coverage is usually the more useful number, because it shows which business functions are untested."
  - q: "How do I track what is tested in a business application?"
    a: "List every feature, give each a stable ID, and map each one to the test cases that check it. Add priority, the latest result per build, a status and an owner. Keep features that have no test on the list, so gaps stay visible, and review the matrix before each release."
  - q: "Does high test coverage mean the software is good?"
    a: "No. Coverage shows that something is tested, not that it is tested well. A linked test is documented coverage, not proof of validation, and weak tests give weak coverage. Check results per build, the depth of the tests and the risk of each feature, not only the percentage."
---

Feature test coverage tracking answers one plain question for a business application: which features have a test, and what happened when the test last ran? This guide is for QA leads who maintain tests for line-of-business apps and need a clear picture for release meetings. You will see how test coverage in software testing differs from code coverage, how to measure test coverage with a coverage matrix, and how to keep it current. A worked example with made-up numbers shows why a high percentage of mapped features can still hide gaps.

## What test coverage means, and what it does not

The Perforce article on [test coverage versus code coverage](https://www.perforce.com/blog/perfecto/test-coverage-vs-code-coverage) separates two ideas that teams often mix up.

- **Test coverage** is about features and use cases. It helps you see whether all necessary scenarios have been considered, and the article calls it a good indicator of risk. It is judged against measures such as specifications, risk, functionality and product.
- **Code coverage** is a measurement of how much of an application's source code was executed during testing, often given as a percentage of lines. It shows which code has and has not been tested.

For a business application, such as an order system or an HR portal, the first idea usually matters more to the people who rely on the software. A manager asks whether invoice approval is tested, not whether line 4,200 ran.

The same article warns about reading either number too generously. Code coverage does not necessarily equal code quality, and test coverage does not guarantee that an application is free of bugs. If the tests are weak, the coverage is weak too. Treat coverage as a map of where you have looked, not a grade.

## Feature test coverage tracking in four steps

The TestRail guide on the [requirements traceability matrix](https://www.testrail.com/blog/requirements-traceability-matrix/) describes a method that you can reduce to four steps for feature test coverage tracking.

1. **Define the scope.** Decide which release or feature set the matrix covers, and which builds and environments it applies to.
2. **List every feature.** Collect the full in-scope list from authoritative sources and give each item a unique, stable ID. The guide stresses preserving the full list, including items without tests. A list built only from existing tests cannot reveal what was never linked.
3. **Map each item to its tests.** Link each item to the test cases, reviews or analyses that evaluate it, and check that those checks address its key acceptance criteria.
4. **Record results and review.** Record the result for the relevant build, connect defects to the affected results, agree on what counts as verified, and review the matrix for missing mappings and outdated cases.

Do this first for the flows that matter most, and for each new feature as it arrives. Each QA team has its own workflow, so keep the steps light. A small matrix that is current is worth more than a complete one that nobody trusts.

When a team chooses to automate a check, the picture changes only a little. An automated test is still just one test case, and automation coverage means the share of mapped features whose tests run without a tester. Count it as a separate column, next to manual cases, so the team sees how much is automated and how much still depends on people. Coverage metrics such as these help planning, but the backlog of untested, high-risk features is the number that drives action.

## What to put in the coverage matrix

TestRail lists the columns that a full matrix can hold. For a small QA team, these are enough:

- **Requirement or feature ID** and a short description.
- **Priority or risk**, so that you read the gaps in the right order.
- **Linked test case IDs**, which may include manual cases and automated ones from your [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/) suite.
- **Latest result and build**, so the matrix shows what happened and when.
- **Status**, such as not covered, covered, passed, failed or blocked.
- **Owner**, the person who answers for the row.

PractiTest, in its article on the [requirement traceability matrix](https://www.practitest.com/resource-center/article/requirement-traceability-matrix-rtm/), describes traceability in both directions: from a feature to its tests, and from a test back to the feature it supports. The two directions help in different ways. The first shows what a feature has. The second shows why a test exists, and which tests to look at when a requirement changes.

## Read the matrix: gaps, depth and age

A matrix is only as useful as the questions you ask of it.

- **Mapping gaps.** Which features have no linked test? TestRail defines mapping coverage as the share of testable in-scope requirements with at least one linked test.
- **Validation gaps.** TestRail is clear that a linked test shows documented coverage, not successful validation. Look at the last result: did the test run, and did it pass?
- **Depth.** PractiTest warns that you can test something completely in terms of percentage but not necessarily well in terms of depth. One test per feature may be thin, and combinations of requirements can matter.
- **Age.** A test that has not run for months says little about today's build. Show the date of the last run.
- **Orphans.** Tests that link to nothing may guard a risk that your feature list does not capture. TestRail advises reviewing unlinked tests before removing them.

A short list of the five riskiest gaps is more useful in a release meeting than a table of two hundred rows.

## Where code coverage tools still help

Martin Fowler's note on [test coverage](https://martinfowler.com/bliki/TestCoverage.html) calls a coverage tool "a useful tool for finding untested parts of a codebase" and suggests running coverage tools every so often to look at the untested code. He also writes that coverage is of little use as a numeric statement of how good your tests are, because high coverage numbers are too easy to reach with low-quality testing. He would be suspicious of anything like 100 percent, and he sees coverage below about half as a sign of trouble. He adds that coverage is most useful to the people who write tests, because reading it takes technical judgment.

For a QA lead, that suggests a split of work. In our view, developers read the coverage report for their unit tests and integration tests, while the QA team reads the feature matrix to improve test coverage where the business risk is highest, across manual testing and test automation. Neither number alone gives release confidence. Both are a map of testing efforts, not proof of product quality.

## Keep it up to date

A stale matrix is worse than none, because people trust it. TestRail recommends reviewing it during planning, after changes and before release decisions, and keeping a dated snapshot when you need the evidence behind a decision. It also suggests naming a coordinator and owners for change requests, test updates and verification decisions. PractiTest adds that the matrix should stay visible to everyone who needs it, and it warns that emailed spreadsheet copies lead to confusion about which version is current.

Keep one shared version. If you use a test management tool, let it update the links and results as tests run, so the matrix does not depend on someone's memory. It also supports your [regression testing](https://www.m365.fm/entity/regression-testing/), because the links show which regression tests to rerun after a change.

## Example: 40 features, three different numbers

The numbers are made up.

A QA lead tracks 40 features of an order management app. The matrix shows three different pictures.

- **Mapped:** 31 of 40 features have at least one linked test. That is 77.5 percent mapping coverage.
- **Verified:** of those 31, 22 passed on the latest build. Five failed or are blocked, and four have not run for 90 days. Verified coverage is 22 of 40, or 55 percent.
- **Gaps:** 9 features have no test at all. Three of them are high-risk: refunds, price overrides and user role changes.

The lead presents the second number, not the first, to the product owner. The team's next sprint adds tests for the three high-risk gaps, fixes the five failing or blocked tests and reruns the four stale ones. The dashboard percentage rises, and so does the confidence behind it. A matrix that showed only the 77.5 percent would have hidden the problem.

## Common mistakes

- **Counting code coverage as feature coverage.** Executed lines say nothing about untested business functions.
- **Building the matrix only from existing tests.** You will never see what has no test.
- **Treating a link as proof.** Show the latest result per build.
- **Chasing a percentage.** A target of 100 percent invites thin tests that only touch each feature.
- **Letting the matrix go stale.** Review it at planning, after changes and before release.
- **Keeping copies in email.** Several versions lead to arguments about which one is right.

## How software can help

A spreadsheet is a fair start. A test management tool can link tests to features and update results automatically, which saves the manual upkeep. [Genta by Cognillo](https://www.m365.fm/entity/genta-automation/) is one example. According to the vendor, it includes test case and suite management with feature coverage tracking, scheduled runs, and dashboards that export to Excel, CSV or PDF. These are the vendor's statements and were not tested by M365.FM. Compare it with other options, and check how each tool links results to requirements before you commit.

## Next step

Take your most important business flow, list its ten features, and map each to its tests in a simple matrix with the last result and date. Then bring the three biggest gaps to your next release meeting, and agree who owns feature test coverage tracking from then on.
