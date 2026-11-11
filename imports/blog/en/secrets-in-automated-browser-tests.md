---
title: "Test credentials and secrets in automated browser tests"
summary: "Secrets in automated browser tests leak through code, traces, videos and logs. Learn to keep passwords out of the repo, scope test accounts and clean artifacts."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [end-to-end-testing, least-privilege, regression-testing]
keypoints:
  - "Secrets in browser tests leak in more places than the test code: traces, screenshots, videos, console logs, HAR files and saved sign-in state can all contain tokens or passwords."
  - "Never hardcode passwords in test files. Load them from environment variables locally and from the CI platform's secret store in pipelines."
  - "A saved browser state file can contain live session cookies that let someone impersonate the test account, so keep it out of every repository."
  - "Use dedicated test accounts, one per role and, for parallel runs that change shared data, one per worker, each with only the access its tests need."
  - "Clean artifacts before they leave the runner, restrict who can read reports, and keep test-only login shortcuts out of production."
faq:
  - q: "How do I store passwords for automated browser tests?"
    a: "Do not write them in test files. Keep them in environment variables, loaded from a local file that is excluded from version control, and in your CI platform's secret store for pipelines. Use dedicated test accounts, not personal ones, and consider a secrets manager that issues short-lived values for larger teams."
  - q: "Is the Playwright storage state file a security risk?"
    a: "Yes. Playwright's documentation warns that the saved browser state file may contain sensitive cookies and headers that could let someone impersonate you or your test account. It strongly discourages checking these files into any repository. Add the folder to your ignore file and delete the state when it expires."
  - q: "Can test reports and traces leak secrets?"
    a: "Yes. Traces can contain authorization headers, tokens and cookies, screenshots can show a value during typing, and videos can record passwords on screen. Limit what you record, remove sensitive values before artifacts leave the test runner, and restrict who can open reports and for how long they are kept."
---

Secrets in automated browser tests are passwords, tokens, API keys and session cookies that your tests need in order to sign in, and they leak in more places than most teams expect. Handling them well is a basic part of test automation and of browser automation in general. This guide is for test automation engineers who write or maintain browser tests for [end-to-end testing](https://www.m365.fm/entity/end-to-end-testing/) that log in to real systems. You will see where secrets leak, how to keep them out of code and repositories, how to set up test accounts with limited access, how to reuse sign-in state safely, and how to deal with multi-factor sign-in. A worked example with made-up numbers shows a quick audit.

## Where secrets in automated browser tests leak

The obvious leak is a password typed into one of your test scripts. The less obvious leaks are the files that a test run produces. The Currents article on [avoiding data leaks in Playwright](https://currents.dev/posts/playwright-avoid-data-leak) lists the risks, and they apply to other tools that record runs in a similar way:

- **Traces.** A trace can contain raw authorization headers, bearer tokens, cookie values, page snapshots and personal data seen in network traffic. The article rates traces as the most critical risk.
- **Screenshots.** A value can be visible while a test is typing it, or a token can show in a notification.
- **Videos.** A video records the whole screen for the whole test, including autofilled passwords and tokens shown on admin pages.
- **Console logs and attachments.** Console output is repeated on every retry, and attached API responses can carry tokens or personal data.
- **Reporter and step output.** If a step name includes an environment value, it appears in CI logs and HTML reports.
- **HAR files.** These network recordings hold request and response headers and bodies, which can include credentials.
- **Saved sign-in state.** A state file holds live session cookies and tokens, and it can end up in Git if nobody ignores it.

The article also warns that CI secret masking only covers log output, and it misses values that are encoded, cut short or joined with other text. Masking is a net, not a fix.

## Keep passwords out of code and the repository

The TestDino guide on [Playwright authentication](https://testdino.com/blog/playwright-authentication) is direct: never hardcode passwords in test files. Its advice for CI runs matches common practice in other frameworks:

1. **Use environment variables.** Locally, store passwords in an environment file that is excluded from version control. In CI, use your provider's secret management and read the values from the process environment.
2. **Ignore the file.** Add the environment file patterns to your ignore list before the first commit, and commit only a placeholder file that lists the variable names.
3. **Let the pipeline win.** Currents advises configuring the environment loader so that values injected by CI take precedence over values from a local file.
4. **Use a secrets manager for larger teams.** These security best practices scale well, and Currents names CI-native secrets and external managers such as Vault, AWS Secrets Manager and Google Cloud Secret Manager. It also recommends short-lived tokens through workload identity, and runner permissions scoped to only the secret paths the run needs.
5. **Keep step names static.** Do not write a secret into a step title. Use a fixed label.

If a secret has already been committed, treat it as exposed. Change it, and then clean the history. Deleting the file in a later commit does not remove it from the history.

## Use dedicated test accounts with least privilege

A test account is a real account, and it deserves the same care as any other. When you automate sign-in, you also automate access to a real system, so validate what each account can reach, in every test environment. The principle of [least privilege](https://www.m365.fm/entity/least-privilege/) applies: give each account only the access its tests need and nothing more.

- **Never use a personal account.** A dedicated login can be disabled, rotated or audited without touching a person's access.
- **One account per role.** If tests check what an administrator and an ordinary user can see, each role needs its own account. TestDino lists this as a requirement for multi-role tests.
- **One account per parallel worker, when tests change shared data.** Playwright's documentation on signing in describes this: a single shared account works only if tests can run at the same time without affecting each other. Otherwise each parallel worker needs its own account. TestDino describes picking the account by worker index.
- **Keep production access narrow.** If any test touches a live system, the login should be isolated and unable to reach billing or customer data.
- **Set an owner and an expiry.** Write down who owns each account and when its passwords are reviewed. This is our own advice, not a point from the sources.

Logins that nobody owns outlive the tests they were made for, and they stay valid long after.

## Reuse sign-in state without exposing it

Test data and sign-in state are different things, but both need protection. Signing in through the screen for every test is slow, and it makes every automated test depend on the sign-in workflow. Playwright's documentation on [authentication](https://playwright.dev/docs/auth) describes a common pattern: a setup step signs in once and writes the browser state to a file, and tests then start from that state. The documentation also gives the safety rules:

- Create a folder for the state files and add it to your ignore file. The docs recommend exactly that.
- Treat the file as a credential. A danger notice says it may contain sensitive cookies and headers that could be used to impersonate you or your test account, and the docs strongly discourage checking such files into private or public repositories.
- Delete the stored state when it expires, or write it to the output folder if it does not need to persist between runs.
- Where the application supports signing in through an API, that can be easier and faster than driving the interface, and the resulting state is saved the same way.

Currents adds a cleanup step: clear cookies in the teardown of your sign-in fixture, and restrict who can read CI artifacts.

## Multi-factor sign-in and test-only shortcuts

Multi-factor authentication makes automation harder, and that is the point of it. TestDino suggests options for test accounts. For codes from an authenticator app, generate the code in the setup script with a library. For SMS or email codes, disable multi-factor sign-in for test accounts in staging, or use a test-only route.

A test-only bypass route is a real risk. TestDino says it should be gated behind an environment variable check and never deployed to production. Treat any shortcut that skips sign-in as a security feature that needs its own review.

## Example: a 30-minute audit

The numbers are made up.

A team runs 90 browser tests as part of its [regression testing](https://www.m365.fm/entity/regression-testing/) and checks the test repository for secrets. The audit takes 30 minutes and finds five things:

1. Two passwords written in a test helper file.
2. A folder of saved sign-in state files that is not in the ignore list.
3. A trace setting that records every test, and report artifacts that all employees can open.
4. One account used by all 8 parallel workers, which makes two tests fail at random.
5. A personal account of a former tester, still used by one test.

The fixes take a day. The passwords move into the CI secret store, and the old values are changed. The state folder is ignored and removed from history. Traces are kept only for failed tests, and report access narrows to the QA group. Each parallel worker gets its own account, and the random failures stop. The personal account is replaced with a dedicated one that has an owner. The team schedules the same audit every quarter.

## Common mistakes

- **Hardcoding a password "just for now".** It stays in the history forever.
- **Committing saved sign-in state.** The file works like a password for the account.
- **Trusting CI log masking.** It misses encoded or partial values, and it does nothing for traces or videos.
- **Recording everything.** Videos, full traces and open reports spread secrets to more people.
- **Sharing one login across parallel workers.** It causes both random failures and unclear audit trails.
- **Forgetting test-only bypass routes in production.** Gate them and review them.

## How software can help

Start with your CI platform's secret store and your repository's secret scanning, if it has one. A secrets manager can also encrypt stored values, and it helps once several teams share logins, because it controls access, rotation and logging in one place. Your test framework's settings control what is recorded, and a small script can strip sensitive headers from artifacts. Choose automated testing tools that fit your CI setup, and test the cleanup on a sample run before you rely on it. The same rules hold in Selenium, Cypress, Playwright or a Python test suite, and for UI tests as well as API tests that call the web application.

## Next step

Open your test repository today and search it for passwords, tokens and saved state files, then move every secret you find into your CI secret store. After that, review how your tests record traces and videos, so that secrets in automated browser tests stop spreading through your reports.
