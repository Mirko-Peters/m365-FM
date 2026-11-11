---
title: "Dev, staging, production: running automated tests in each safely"
summary: "How to run automated tests in staging and production safely: what to run where, how to set up base URLs and secrets, and how to protect real customer data."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, application-lifecycle-management, genta-automation]
keypoints:
  - "Each environment has a job: development gives fast feedback, staging is the final check before release, and production is the live system that real users depend on."
  - "Run the full regression suite, including destructive tests, in staging, and keep production to a small read-only smoke suite and scheduled monitors."
  - "Give every environment its own base URL, timeouts and retry policy, and keep credentials out of the test code and the repository."
  - "Use synthetic or masked data in staging, and dedicated test accounts in production that stay out of billing, analytics and customer reports."
  - "Build guardrails first: monitoring, a rollback plan, read-only actions and feature flags, and never treat production as your first line of defense."
faq:
  - q: "Should automated tests run in production?"
    a: "Only a small, safe set. Run a short smoke suite of read-only checks on critical paths and scheduled monitors, using dedicated test accounts. Keep destructive tests, load tests and anything that writes data in staging. Testing in production adds a final feedback loop, but it does not replace testing before release."
  - q: "What is the difference between staging and production for testing?"
    a: "Staging should match production as closely as possible but holds synthetic or masked data, so you can run the full regression suite, including tests that delete or change records. Production holds real customer data and live traffic, so tests there must be read-only or use isolated test accounts."
  - q: "How do I keep passwords out of automated browser tests?"
    a: "Do not write them in test files or commit them. Load them from environment variables or your CI platform's secret store, use a separate account for each environment, and commit only a placeholder file that lists the variable names. Validate that every required variable exists before the run starts."
---

To run automated tests in staging and production safely, give each environment a different job: the full regression suite in staging, and only a small, read-only set in production. This guide is for QA leads who are asked to test more often without risking real customers or real data. You will see what each environment is for, what to run where, how to configure URLs and secrets, how to treat test data, and which guardrails to set. A worked example with made-up numbers shows a split that a small team can copy.

## What each environment is for

The Flagsmith guide on [testing environment best practices](https://www.flagsmith.com/blog/testing-environment-best-practices) describes four environments.

- **Development** puts fast feedback ahead of realism. Developers work locally or in a shared sandbox.
- **Testing or QA** is a controlled space for functional, integration and regression tests against a build.
- **Staging** is configured to match production as closely as possible and serves as the final check before release.
- **Production** is the live environment that users interact with.

Together these form the path of a release through [application lifecycle management](https://www.m365.fm/entity/application-lifecycle-management/): code moves from one environment to the next, and each step is a chance to find problems cheaply.

The same guide makes two points that matter for automation. First, the closer a test environment matches production, the more confidence you can place in what it tells you, and parity should cover operating systems, dependency versions and network configuration, not only application code. Second, test environments should not share databases, credentials or infrastructure with production or with each other. A test that touches the wrong database is the fastest way to turn a test run into an incident.

In a DevOps pipeline, each deployment can trigger a different set of automated tests. After a merge, the deploy to the test environment runs fast checks. The deploy to the next stage, staging, runs the full suite, and the release waits for the result. Automated testing at each stage gives quick feedback, and you automate the move from one stage to the next only when the checks pass. The same approach works whether the UI tests use Selenium, Playwright or another tool.

## How to run automated tests in staging and production

The TestDino article [Playwright Staging vs Production: What to Run Where](https://testdino.com/blog/playwright-staging-vs-production) gives a clear split, and it applies to any tool.

**In staging**, run the full regression suite. That includes destructive tests that delete accounts or clear carts, performance and load tests, visual regression tests and database migration tests. Use sandbox or test-mode credentials for third-party services. Staging is the place for every test that writes data or simulates an edge case.

**In production**, run a small smoke suite of critical paths, which the article puts at roughly five to ten flows, plus synthetic monitors on a schedule, roughly every five to fifteen minutes. Add read-only API health checks and similar light checks. The article's rule is strict: every test on the live system must be read-only or use completely isolated test accounts.

That split fits the idea behind [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/). Browser journeys are slow and sometimes flaky, so keep the long list for staging and let only the few most important journeys run against the live system. Tag tests, for example as smoke or destructive, so that the production run can exclude the destructive group by rule instead of by memory.

## Configure each environment without leaking secrets

Treat each environment as a separate configuration. TestDino suggests defining a separate project per environment in Playwright, each with its own base URL, timeout and retry count. In its example, staging allows retries and production does not, and production captures traces and videos only on failure. The idea works in other tools too.

Rules for configuration and secrets:

1. **Keep credentials out of config files.** Load environment-specific values from environment files that are excluded from version control, and commit only a placeholder file that lists the variable names.
2. **Use the CI platform's secret store in pipelines.** The article recommends taking secrets from the CI environment settings instead of files.
3. **Validate variables before the run.** A missing base URL causes confusing errors, so check that every required variable is set before the first test starts.
4. **Put the production scope in the configuration.** Filter production tests in the config, not only in command-line flags that someone can forget.
5. **Version the environment definition.** Flagsmith advises managing environment configuration under version control, so that untracked changes do not cause drift and unexplained failures.

Use a separate account for each environment, and give each account the least access its tests need.

## Test data: synthetic in staging, isolated in production

Data is the second place where safe and unsafe testing diverge.

- **Staging:** use synthetic, anonymized or seeded data. Flagsmith advises mirroring real-world scenarios with synthetic data, masking or anonymizing any production data you copy, and refreshing test data on a schedule instead of letting it go stale.
- **Production:** it holds real and sensitive customer data. TestDino advises dedicated test accounts that are excluded from billing and analytics and that never appear in customer-facing reports. If the application handles regulated data, it suggests dedicated test tenants with synthetic data.
- **Unique data per run:** generate unique values for each run, for example with a timestamp, and set up state through an API call instead of through the screen.
- **Clean up:** if a test must create a record, delete it afterwards through an API call.

The BugBug guide on [production testing](https://bugbug.io/blog/software-testing/production-testing/) adds a warning about irreversible harm. Its examples of what not to do include payment edge cases with real cards, data migrations without backups and permission boundaries tested with real users.

## Guardrails before you test on the live system

BugBug's central rule is that production testing only works when guardrails come first. Its list is short and practical:

- **Monitoring** so that failures are spotted quickly, including failures that tests themselves cause.
- **Read-only actions** where possible, such as checking a page instead of submitting a form. Stop before final actions such as placing an order.
- **Feature flags** to expose a change to a small group, widen the audience in steps and switch it off without a redeploy. The guide also warns about forgotten flags that turn into technical debt.
- **A rollback plan** defined before the test, because rollbacks should be boring, not heroic.
- **Detection, not diagnosis.** Use production tests to flag a problem and find the root cause in another environment.

The guide puts the limits plainly: production is the final feedback loop, not the first line of defense, and testing in production is not an excuse to skip QA.

## Example: a split for a 120-test suite

The numbers are made up.

A team has 120 browser tests and one staging environment. Today the whole suite runs on staging before each release, and nothing runs after the release goes live.

The QA lead sets up three groups. All 120 tests stay on staging, including 18 tagged as destructive. A smoke group of 8 read-only tests covers login, search, opening an invoice and downloading a report. It runs on the live system after each release and then every 15 minutes, using a dedicated test account with no access to billing. A third group of 4 API health checks runs every 5 minutes.

Two weeks later, the smoke group fails at 2 a.m. because the test account password expired. The alert goes to the on-call engineer, who sees from the log that the cause is the account, not the application. The team moves the password into the CI secret store with a rotation date. No customer was affected, and the team learned that the production tests need an owner.

## Common mistakes

- **Running the full suite in production.** Destructive and write tests belong in staging.
- **Sharing a database or credentials across environments.** One wrong URL then touches real data.
- **Committing passwords or tokens to the test repository.** Use a secret store and a placeholder file.
- **Using real customer accounts as test accounts.** Use dedicated accounts that stay out of billing and analytics.
- **Skipping the rollback plan.** Decide how you will undo a bad change before you test it.
- **Letting staging drift away from production.** Tests that pass on a different setup tell you little.

## How software can help

Start with what your CI system and test framework offer: per-environment projects, a secret store, scheduled runs and tags. Add a monitoring tool that alerts on failed production checks. Some test platforms bring these parts together. [Genta by Cognillo](https://www.m365.fm/entity/genta-automation/) is one example: according to the vendor, it supports environments such as development, staging and production with encrypted variables, scheduled runs and an audit log. These are the vendor's statements and were not tested by M365.FM. Compare it with other options in a pilot, and check how each tool stores secrets and who can read them.

Disclosure: Cognillo sponsors M365.FM.

## Next step

List your environments and write down, for each one, which tests may run there, which account they use and where the secrets live. Then move one destructive test out of production, and use that list to run automated tests in staging and production with clear rules.
