---
title: "Fix AADSTS700082: Refresh Token Has Expired Due to Inactivity"
summary: "AADSTS700082 is an expected part of the token lifecycle: the user did not use the app for a long time, so the refresh token had expired. Learn on refresh token lifetimes, revocation and what apps should do, plus a Power Automate connection example and the fix for users, owners and developers."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [entra-id, oauth-2-0, access-token]
keypoints:
  - "The reference row calls AADSTS700082 an expected part of the token lifecycle after an extended period without using the app."
  - "Default refresh token lifetimes on Learn: 24 hours for single-page apps and email one-time passcode flows, and 90 days for all other scenarios."
  - "Refresh tokens can also be revoked by the sign-in service at any time. Apps should send the user to an interactive sign-in to get a new token."
  - "For a Power Automate connection with this message, Learn says to create a new connection or reauthorize the existing one."
  - "Refresh tokens replace themselves on each use. Securely delete the old token after you obtain a new one."
faq:
  - q: "What does AADSTS700082 mean?"
    a: "The code is ExpiredOrRevokedGrantInactiveToken. The refresh token has expired due to inactivity. The message gives the issue date of the token and how long it was inactive. Learn calls it an expected part of the token lifecycle, because the user went an extended period without using the application."
  - q: "How long do refresh tokens live?"
    a: "The Learn page on refresh tokens gives these defaults: 24 hours for single-page applications, 24 hours for apps that use the email one-time passcode flow, and 90 days for all other scenarios."
  - q: "How do I fix it as an end user?"
    a: "Sign in again interactively. Learn says apps should handle expired or revoked refresh tokens by redirecting the user to an interactive sign-in prompt to reauthenticate and obtain a new token. For a Power Automate connection, create a new connection or reauthorize the existing one."
  - q: "Is a password change the same thing?"
    a: "No, but it can also invalidate tokens. The revocation table says a password changed by the user revokes password-based tokens, while an expired password does not. That produces other messages, so compare the error text."
  - q: "What should a developer do?"
    a: "Handle the error by starting an interactive sign-in, and for single-page apps be ready to rerun the authorization code flow every 24 hours. Learn also says the platform does not revoke old refresh tokens when they fetch new access tokens, so securely delete the old one after getting a new one."
---

AADSTS700082 is an error that the reference describes as normal. The text says the refresh token has expired due to inactivity, and the page describes it as an expected part of the token lifecycle. That does not make it painless, since a flow or app that depends on the token needs a new interactive sign-in. This article explains what the error says, what lifetimes Learn gives, and what each role can do.

## What the reference says

The row for AADSTS700082 (ExpiredOrRevokedGrantInactiveToken) reads: the refresh token has expired due to inactivity, the token was issued on a date and was inactive for a period. It explains that the user went an extended period without using the application, so the token was expired when the app tried to refresh it.

A similar message appears in a Power Automate context on Learn:

> The refresh token has expired due to inactivity. The token was issued on `<DateTime>` and was inactive for 90.00:00:00.

The same page says the SharePoint connector needs to be used at least once every 90 days to stay active, and for this case the fix is to create a new connection or reauthorize the existing one.

## Why refresh tokens exist

A refresh token is used to get a new access token and refresh token pair when the current access token expires. A client gets one together with its first access token. Learn adds these properties:

- A refresh token is bound to a combination of user and client, but not to a resource or a tenant.
- A client can use it to get access tokens for any combination of resource and tenant where it has permission.
- Refresh tokens are encrypted, and only the Microsoft identity platform can read them.

## Lifetimes

| Scenario | Default lifetime |
| --- | --- |
| Single-page applications | 24 hours |
| Apps that use the email one-time passcode flow | 24 hours |
| All other scenarios | 90 days |

Refresh tokens replace themselves with a new token on every use. The platform does not revoke the old token when you use it to fetch new access tokens, so the app should securely delete the old one and store the new one as safely as access tokens or app credentials.

For single-page apps, a refresh token sent to a redirect URI registered as `spa` expires after 24 hours. Tokens obtained with it carry over that expiration. So the app must be ready to run the authorization code flow interactively again every 24 hours. Learn says users usually do not enter credentials or see more than a reload, and the browser must visit the sign-in page in a top-level frame because browsers block third-party cookies.

## Expiration and revocation

Refresh tokens expire when the lifetime elapses. The sign-in service can also revoke them at any time before that. The page says your app should handle this gracefully by redirecting the user to an interactive sign-in to reauthenticate and get a new token. The page does not state a general inactivity period beyond the lifetimes above, so my suggestion is to use the message text, which gives the period for your case.

Learn's revocation table (for public clients, with confidential client tokens in the last column) shows, among others:

| Change | Effect |
| --- | --- |
| Password expires | Tokens stay alive |
| Password changed by user | Password-based cookie and token revoked, the others stay alive |
| User does SSPR | Password-based cookie and token revoked |
| User revokes their refresh tokens | All revoked |
| Admin revokes all refresh tokens for a user | All revoked |
| Single sign-out | Both cookie types revoked. Password-based and non-password-based tokens and the confidential client token stay alive |

The page also notes that refresh tokens are not revoked for B2B users in their resource tenant, and need to be revoked in the home tenant. The table above is a summary; the page shows every row and column.

## What to do, by role

**End user or flow owner.** Sign in again. For a Power Automate connection, create a new connection or reauthorize the existing one.

**Administrator** (my suggestions, not from the pages).

- Confirm from the message that the token was inactive for the stated period. If so, that matches the reference's description of an expected part of the token lifecycle.
- If the same flow or app fails often, check how often it runs relative to the lifetime above.
- If users report the error right after a change, compare with the revocation table (password change, SSPR or revocation).

**Developer.**

- Treat the error as a signal to start an interactive sign-in, not as a fatal failure.
- For single-page apps plan for the 24-hour limit.
- Delete the old refresh token after each successful refresh.

## Habits that help (my advice)

This is my suggestion, not guidance from the page:

- For business-critical connections to rarely used services, schedule a periodic test run, so the connection is used well before the limit that applies to it.
- Use a named owner and a backup owner for shared connections, so reauthorization does not wait for one person.
- Log the token issue date and the inactivity period from the error in your ticket. They show whether it was plain inactivity or something else.
- Do not extend the problem by storing sign-in secrets in scripts to avoid the prompt. Use the supported sign-in flow for your app type.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Access token](https://www.m365.fm/entity/access-token/)

## Sources

- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Refresh tokens in the Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/refresh-tokens)
- [Resolve Power Automate Broken Connections (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-automate/connections/troubleshoot-broken-connections)
