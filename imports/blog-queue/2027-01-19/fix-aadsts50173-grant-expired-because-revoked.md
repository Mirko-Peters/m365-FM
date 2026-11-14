---
title: "Fix AADSTS50173: The Provided Grant Has Expired Because It Was Revoked"
summary: "AADSTS50173 means a refresh token no longer works because it was revoked, usually after a password change or reset, an expiry or an admin action. This guide covers what the error text tells you, the user fix of signing in again, and what developers should do with MSAL."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [entra-id, oauth-2-0, access-token]
keypoints:
  - "The message says the provided grant has expired due to it being revoked and that a fresh auth token is needed."
  - "Learn lists three causes: the user changed or reset the password, the refresh token expired, or an administrator revoked it."
  - "The error text includes the grant's issue time and the user's TokensValidFrom date, which lets you compare the two."
  - "For users the fix is to reauthenticate, for example by clearing the cached token or signing out and in again."
  - "Developers should handle the error with MSAL, or without MSAL ask the user to reauthenticate to get a fresh token."
faq:
  - q: "What does AADSTS50173 mean?"
    a: "The refresh token in the request was revoked, so the grant is no longer valid. The error text says a fresh auth token is needed and that the user might have changed or reset their password."
  - q: "What are the causes?"
    a: "Learn lists the user changing or resetting their password, the refresh token expiring, and an administrator revoking the token."
  - q: "How does a user fix it?"
    a: "Reauthenticate. Learn suggests clearing the cached token, or signing out and signing in again, so the app gets a new token."
  - q: "What should app developers do?"
    a: "Handle the error. Learn points to MSAL error handling, and says that if you do not use MSAL you should ask the user to reauthenticate to obtain a fresh token."
  - q: "What do the two dates in the message mean?"
    a: "The message states when the grant was issued and the TokensValidFrom date for the user. In my reading, a grant issued before that date is the case the error describes."
---

AADSTS50173 means the grant in the request, usually a refresh token, was revoked, so the app must get a fresh token by signing the user in again. Microsoft's error reference describes it as: the provided grant has expired due to it being revoked, a fresh auth token is needed, and the user might have changed or reset their password. The message includes the time the grant was issued and the TokensValidFrom date for the user. This article covers the three causes Learn names and the fix for users and developers.

## What the message says

The Microsoft Entra error reference entry for AADSTS50173 reads, in substance: the provided grant has expired due to it being revoked; a fresh auth token is needed; the user might have changed or reset their password; the grant was issued at a given time and the TokensValidFrom date for this user is a given date. The two values in the text let you compare the age of the grant against the date from which tokens are valid for that user.

Learn's dedicated troubleshooting article uses the same title and says the error occurs when a refresh token has been revoked.

## Causes

Learn lists three reasons for a revoked refresh token:

1. **The user changed or reset their password.** The existing tokens stop being valid.
2. **The refresh token expired.**
3. **An administrator revoked it.** Learn links to its guidance on revoking user access in Microsoft Entra ID.

The page also links to a page on refresh tokens, including token revocation.

## Fix for users

Learn's advice for users is to reauthenticate:

- Clear the cached token, if the app lets you, or
- Sign out of the app and sign in again.

After a fresh sign-in the app receives a new token. If the app does not prompt you and keeps failing, close it fully, reopen it and try again. That last step is my suggestion, not Learn's.

## Fix for developers

Learn's guidance for developers is:

- If you use the Microsoft Authentication Library (MSAL), handle the error as MSAL's error handling guidance describes.
- If you do not use MSAL, ask the user to reauthenticate to obtain a fresh token.

In other words, the application must treat this error as a signal to start a new sign-in rather than retrying with the same refresh token.

## Reading the dates

This section is my advice and interpretation, not a Microsoft statement.

Compare the two values in the message. If the grant was issued before the TokensValidFrom date, the token predates the event that moved the date, such as a password change or an admin revocation. That points you to the cause: ask whether the user changed the password around that time, or check the audit information your admins can see for a revocation.

If the grant was issued after that date, I would not assume the same cause and would capture the full message and correlation details for a deeper look.

## A support checklist

This section is my advice, not a Microsoft statement.

1. **Ask what changed.** Did the user reset the password or have a security event? Did an admin revoke sessions?
2. **Ask which app.** A mobile app, a desktop client and a web app may all hold separate tokens, and each needs a new sign-in.
3. **Have the user sign out and in.** This is the documented fix and takes a minute.
4. **Check for repeat failures.** If the same user is back after a fresh sign-in, something is re-issuing old tokens, or the app caches tokens in a place the sign-out does not clear.
5. **For service accounts and automation, review how tokens are stored.** A long-running job that stores a refresh token will fail after a password change, because its token is revoked. Plan how the job signs in again.
6. **Tell users after password resets.** A short note that apps may ask them to sign in again avoids tickets.
7. **Escalate with details.** Provide the full error text, time, correlation ID and app name.

## Where this fits among related errors

This section is my advice, not a Microsoft statement.

AADSTS50173 is about a revoked grant. Other AADSTS codes concern token validity in other ways, such as an invalid refresh token or an expired grant. Use the reference entry for the exact code in front of you rather than assuming they share a fix. The common thread is that the app needs a new interactive sign-in.

## Communicating the fix

This section is my advice, not a Microsoft statement.

When you tell users how to resolve the error, keep the message to one action: sign out of the app, sign in again and, if the app offers it, clear its cached account first. Say why it happened in plain words, for example that a password change or an admin action ended the old session. For developers on your team, point to your MSAL handling guidance and ask them to confirm that the app starts an interactive sign-in on this code instead of showing a generic failure. A clear user-facing message in the app reduces repeat tickets more than any change on the identity side.

## What I did not read

I read the Learn troubleshooting article for AADSTS50173 and the reference entry. The article is short. I did not read the linked pages on refresh tokens and revoking user access, so I do not describe how revocation is done or how long it takes to take effect, and I do not claim anything about token lifetimes.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Access token](https://www.m365.fm/entity/access-token/)

## Sources

- [Error code AADSTS50173 - The Provided Grant Has Expired Due to it Being Revoked (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50173-grant-expired-revoked)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
