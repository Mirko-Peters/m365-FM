---
title: "Fix AADSTS50158: External Security Challenge Not Satisfied"
summary: "AADSTS50158 means the user was sent to another page or provider, such as terms of use or a third-party MFA, and the challenge did not complete. Check sign-in logs, external MFA setup and non-interactive clients."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [entra-id, conditional-access, mfa]
keypoints:
  - "Learn says the user must satisfy additional requirements and was redirected to another page, such as terms of use or a third-party MFA provider."
  - "The code alone does not indicate a failure on the user's part; the sign-in logs may show the challenge passed or failed."
  - "With an external MFA method, the user's browser is redirected to the provider and must return a valid token, and Entra abandons the attempt about 5 minutes after redirection."
  - "Apps that cannot show an interactive page, such as scripts using username and password, fail because they cannot complete the redirect."
  - "External MFA methods are satisfied by the Require multifactor authentication grant, not by authentication strengths."
faq:
  - q: "What does AADSTS50158 mean?"
    a: "According to the Microsoft Entra error code reference, the external security challenge was not satisfied and the user will be redirected to another page or authentication provider to satisfy additional authentication challenges. The user is required to meet extra requirements before finishing authentication, such as terms of use or a third-party MFA provider."
  - q: "Does the error mean the user failed to sign in?"
    a: "Not necessarily. Learn says this code alone does not indicate a failure on the users' part to sign in. The sign-in logs may indicate that the challenge was successfully passed or failed, so check the log entry for the same correlation ID."
  - q: "How does an external MFA method fit in?"
    a: "Learn describes the flow: Entra ID determines another factor is needed, the user picks the external method, and the browser is redirected to the provider. The provider returns a token with required claims. If validation succeeds, MFA is met. If not, the original authentication fails because of the Conditional Access requirement."
  - q: "Why does a script or app fail with this error while the browser works?"
    a: "The challenge needs a browser-style redirect. A Microsoft Q&A thread on the error describes an SQL client using Azure Active Directory password authentication that failed after the company applied MFA or Conditional Access, and the suggested direction was to configure the application to work with MFA. Disabling MFA is not a good fix."
  - q: "Can authentication strengths use an external MFA method?"
    a: "Learn says external MFA methods are not currently supported with authentication strengths. Policies should use the Require multifactor authentication grant control, because grant controls based on authentication strengths, including the built-in MFA strength, are not satisfied by the external MFA method."
---

AADSTS50158 means Microsoft Entra ID sent the user to another page or provider to satisfy an extra requirement, and the sign-in attempt did not complete that step. The Microsoft Entra error reference gives terms of use and a third-party MFA provider as examples. Start with the sign-in log entry, because the same reference says the code alone does not show that the user failed.

## What Microsoft says

The error code reference describes AADSTS50158 as follows. The external security challenge was not satisfied. The user will be redirected to another page or authentication provider to satisfy additional authentication challenges. The user must meet additional requirements before finishing authentication and was redirected to another page, such as terms of use or a third-party MFA provider.

Two sentences matter for troubleshooting:

- This code alone does not indicate a failure on your users' part to sign in.
- The sign-in logs may indicate that the challenge was passed or failed.

So the error text is a progress marker. The final result is in the log.

## Step 1: Read the sign-in log

Find the entry with the correlation ID or timestamp from the error response. Look at whether the challenge step succeeded. If it succeeded and the user got in, the 50158 entry was only an interim event. If it failed, note which requirement was involved: terms of use, an external MFA provider, or something else. The reference does not list other possibilities, so I do not either.

## Step 2: If an external MFA method is in use

Learn's reference for external MFA providers describes the sequence:

1. The user signs in with a first factor to an app protected by Entra ID.
2. Entra ID decides another factor is needed, for example because a Conditional Access policy requires MFA.
3. The user chooses the external MFA method as the second factor.
4. Entra ID redirects the browser session to the provider's URL, with an expired or nearly expired token that identifies the user and tenant.
5. The provider validates that token, authenticates the user, and redirects the user back to Entra ID with a valid token that includes the required claims.
6. Entra ID checks the token's signature and contents against the requirements.

If validation succeeds, MFA is met. If the `id_token` is missing or invalid, the request is unsuccessful, and Entra ID fails the original authentication attempt because of the Conditional Access requirement. Learn adds that Entra ID abandons its state of the attempt about 5 minutes after the redirection to the provider. A user who takes longer than that can end up with a failed attempt.

What to check on the admin side, based on the same page:

- The external method is added to the tenant's authentication methods policy and enabled for the right groups.
- The provider's application has admin consent in the tenant. Learn says that without consent, an admin sees `AADSTS900491: Service principal ... not found`, which is a different error.
- The provider's `authorization_endpoint` is registered as a redirect URL in the application registration. Learn says otherwise you get a failure to validate the authorization URL of the external claims provider.
- Your Conditional Access policy uses **Require multifactor authentication**. Learn says external MFA methods are not currently supported with authentication strengths, and that strength-based grants, including the built-in MFA strength, are not satisfied by an external method.

Learn also describes a migration period in which custom controls and external MFA methods can run side by side. During it, it recommends a parallel policy that uses the MFA grant and testing with a subset of users first.

## Step 3: Non-interactive clients

A challenge that needs a redirect cannot be completed by code that only sends a username and password. A Microsoft Q&A thread on this exact error shows an SQL tool using Azure Active Directory password authentication that stopped working when the company applied a policy to all users. The thread's volunteer answers suggest configuring the application to work with MFA or Conditional Access. One answer also suggests disabling MFA to test, but that is a test step at best and not something I would do in production. For your own scripts and apps, the usual direction is an interactive sign-in or a non-interactive identity such as a service principal or managed identity. That last point is my advice and not text from the pages I read.

## Step 4: Terms of use and other redirects

The reference names terms of use as a possible redirect. If your sign-in log points to it, check whether the user has accepted the terms and whether the client can display the page. I did not read the terms of use documentation for this article, so use the Conditional Access terms of use pages as your next stop.

## A short working order

This is my order.

1. Read the sign-in log. Did the challenge fail or pass?
2. Is the user in a browser? Retest with an interactive browser sign-in.
3. Does the failing client run without a UI? Switch it to a supported flow.
4. Are external MFA methods in use? Check the policy grant, consent, redirect URL and the 5 minute window.
5. Collect the correlation ID and timestamp if you need support.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft Entra External MFA Method Provider Reference - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-authentication-external-method-provider)
- [AADSTS50158: External security challenge not satisfied (Microsoft Q&A)](https://learn.microsoft.com/answers/a/414161)
