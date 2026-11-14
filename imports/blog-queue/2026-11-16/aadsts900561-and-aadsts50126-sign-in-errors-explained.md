---
title: "AADSTS900561 and AADSTS50126 Sign-in Errors Explained: Causes and Checks"
summary: "What AADSTS900561 (endpoint only accepts POST, received GET) and AADSTS50126 (invalid username or password) mean in Microsoft Entra ID, with the documented causes and the checks to run in order."
status: review
publish: false
author: mirko-p
date: 2026-11-16
topics: [entra-id, microsoft-entra-sign-in-logs, mfa]
keypoints:
  - "AADSTS900561 means an endpoint that accepts only POST received a GET. Microsoft's error reference says it can be a developer error or caused by the browser back button, and that it can be ignored."
  - "For users, Microsoft Q&A answers suggest closing other sign-in tabs, trying a private window or another browser and allowing third-party cookies for the sign-in site."
  - "AADSTS50126 means the credentials were not valid. Microsoft expects some of these errors in logs because users make mistakes."
  - "In apps that sign in with username and password, MFA or a federated domain can also produce AADSTS50126, and Microsoft says the message is misleading in those cases."
  - "Admins find the exact reason in the Microsoft Entra admin center under Monitoring and health, Sign-in logs, by sign-in error code."
faq:
  - q: "What does AADSTS900561 mean?"
    a: "Microsoft's authentication and authorization error code reference lists it as BadResourceRequestInvalidRequest: the endpoint only accepts the listed HTTP verbs, for example POST, but received another one, for example GET. The reference says this can be due to developer error or to users pressing the back button, and that it can be ignored."
  - q: "How do I fix AADSTS900561 as an end user?"
    a: "Microsoft documents no fixed remedy. A Microsoft community moderator on Microsoft Q&A suggests closing other sessions and tabs, trying another browser or a private window, clearing the cache and adding login.microsoftonline.com to trusted sites. A Microsoft staff reply on another thread says the error typically occurs when third-party cookies are blocked."
  - q: "What does AADSTS50126 mean?"
    a: "Microsoft's error reference lists AADSTS50126 as InvalidUserNameOrPassword: error validating credentials due to invalid username or password. It says the user did not enter the right credentials and that you should expect some of these errors in your logs because users make mistakes."
  - q: "Why do I get AADSTS50126 when the password is correct?"
    a: "A Microsoft moderator on Microsoft Q&A names two causes for apps using the username and password flow: the account requires MFA, which blocks non-interactive sign-in, or the domain is federated and the flow cannot follow the redirect to the external identity provider. Microsoft acknowledged the message is misleading in these cases."
---
AADSTS900561 and AADSTS50126 look similar but have different causes. AADSTS900561 is a request-method error: a sign-in endpoint that accepts only POST received a GET. AADSTS50126 is a credential error: Microsoft Entra ID could not validate the username or password. This guide gives Microsoft's documented meaning for each and the checks in a sensible order. For AADSTS900561 the official guidance is thin, and this article says where.

## AADSTS900561: the endpoint only accepts POST requests

Microsoft's error code reference lists the error as **BadResourceRequestInvalidRequest**. The text says the endpoint only accepts the listed HTTP verbs (for example POST) and received a different one (for example GET). It adds that this can be due to developer error, or to users pressing the back button in the browser, which triggers a bad request, and that it can be ignored.

In practice that means:

- If it appears once after pressing back, refreshing a sign-in page or opening an old sign-in link, start the sign-in again from the application's normal address.
- If it appears every time, something sends or redirects a GET to a sign-in step that needs a POST.

### Checks for end users

Microsoft does not publish a fixed remedy. These are the answers that Microsoft Q&A threads give, so treat them as community guidance rather than official procedure:

1. Close other sessions and tabs. A moderator reply attributes the error to several sessions open in different tabs, for example after signing out of one account and into another.
2. Try a different browser or a private window, and clear the cache.
3. Add `https://login.microsoftonline.com` to your trusted sites.
4. Allow third-party cookies for the site you are opening. A Microsoft staff reply on another thread says the error typically occurs when third-party cookies are blocked by certain browsers.

One Q&A thread about a Dynamics 365 demo environment reports that trying a different browser, a private window and trusted sites did not help, and it has no confirmed answer. If the checks fail, note the request ID, correlation ID and timestamp from the error page and give them to your admin.

### Checks for developers and admins

Microsoft's reference describes a related code, AADSTS90056, where an app must send a POST to the token endpoint to redeem a code. It suggests checking **App registrations**, then **Endpoints** to confirm the endpoints are configured correctly. That entry is a different error, but the same idea applies: confirm the call method matches what the endpoint expects. Also compare the sign-in URL the app uses with the URL registered for it, and avoid linking users to callback addresses that were meant to be reached by redirect. The last two points are general troubleshooting reasoning, not Microsoft-documented steps.

## AADSTS50126: invalid username or password

The error reference lists AADSTS50126 as **InvalidUserNameOrPassword**, with the explanation that the user did not enter the right credentials. It says to expect some of these in your logs.

### Check in this order

1. **Retype the credentials** at the normal sign-in page, using the full user principal name.
2. **Check related codes.** Microsoft lists neighbors that look alike:
   - AADSTS50053: account locked after too many incorrect attempts, or sign-in blocked from an IP address with malicious activity.
   - AADSTS50055: the password is expired, and the user is offered a reset.
   - AADSTS50057: the account is disabled.
   - AADSTS50034: the account does not exist in the directory, often a typo or the wrong tenant.
   - AADSTS50064: credential validation failed.
   - AADSTS50056: the password does not exist in the directory for this user.
3. **Read the sign-in log.** Sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator, go to your tenant, then **Monitoring & health**, **Sign-in logs**, find the failed sign-in with the **Sign-in error code** and read the **Failure reason**. Microsoft documents this path for error 50053. The pages read do not repeat it for 50126, but the same log lists the sign-in error code of failed sign-ins.
4. **For an app or script that signs in with username and password,** check MFA and federation. A Microsoft moderator explained two causes: MFA requires interactive sign-in, so background username and password flows fail, and a federated domain redirects to an external identity provider, which the flow cannot follow. Entra ID then returns the misleading invalid-password message. Microsoft said a bug was filed to fix the wording.

### Fixes the moderator named for that case

- Use a service account without MFA for unattended access.
- Test with a cloud-only account on the tenant's onmicrosoft.com domain, which always uses managed authentication.
- Allow cloud authentication for the federated account, or switch the domain to managed authentication by disabling federation.

These come from a single Q&A answer from 2022, so confirm against current Microsoft guidance before changing identity settings.
## Look up any code

Microsoft's reference says codes and messages can change and recommends https://login.microsoftonline.com/error. Search for the number, or link directly with `?code=` followed by the number.

## Common mistakes

- Treating AADSTS900561 as a password problem.
- Resetting passwords before reading the sign-in log.
- Disabling MFA broadly instead of using a separate service account for automation.
- Ignoring the request ID and timestamp on the error page.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)
- [Multifactor authentication (MFA)](https://www.m365.fm/entity/mfa/)

## Sources

- [Microsoft Learn: Microsoft Entra authentication and authorization error codes](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft Q&A: AADSTS900561 The endpoint only accepts POST requests. Received a GET request](https://learn.microsoft.com/en-us/answers/questions/5261614/aadsts900561-the-endpoint-only-accepts-post-reques)
- [Microsoft Q&A: How to fix AADSTS900561](https://learn.microsoft.com/en-us/answers/questions/1328488/how-to-fix-aadsts900561-the-endpoint-only-accepts)
- [Microsoft Q&A: Login demo Dynamics 365 F&O AADSTS900561](https://learn.microsoft.com/en-us/answers/questions/1635277/login-demo-dynamics-365-f-o-aadsts900561-the-endpo)
- [Microsoft Q&A: AADSTS50126 Error validating credentials due to invalid username or password](https://learn.microsoft.com/en-us/answers/questions/797047/aadsts50126-error-validating-credentials-due-to-in)
