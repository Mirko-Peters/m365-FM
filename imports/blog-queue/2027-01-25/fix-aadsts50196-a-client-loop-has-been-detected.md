---
title: "Fix AADSTS50196: A Client Loop Has Been Detected"
summary: "AADSTS50196 (LoopDetected) means an app made too many of the same token request in a short time. Learn points to the app logic: token caching and error handling. A developer-focused fix using the MSAL silent-first call pattern and the error field rules from the Entra error code page."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [entra-id, access-token, oauth-2-0]
keypoints:
  - "The reference says the app made too many of the same request in too short a period, which indicates a faulty state or abusive token requests."
  - "The fix is in the app: check that token caching is implemented and that error conditions are handled correctly."
  - "With MSAL, first try to get a token silently from the cache and only fall back to another method when a UI required error is returned."
  - "Do not use silent acquisition in the client credentials flow or the authorization code flow in web apps. Those paths have their own handling."
  - "React to the error field and not to error_description, and do not depend on error code numbers or text, because they can change at any time."
faq:
  - q: "What does AADSTS50196 mean?"
    a: "The error code is LoopDetected. The Microsoft Entra reference says a client loop has been detected and that the app has made too many of the same request in too short a period, indicating that it is in a faulty state or is abusively requesting tokens."
  - q: "What should I check first in my code?"
    a: "The reference says to check the app logic to ensure that token caching is implemented and that error conditions are handled correctly. In practice look for code that requests a new token in a tight loop, or that retries the same failing request without a change."
  - q: "How should an app acquire tokens with MSAL?"
    a: "Learn says application code should first try to get a token silently from the cache. If the call returns a UI required error or exception, try acquiring a token by other means. MSAL caches a token after it is acquired and can refresh it near expiry, because the cache also holds a refresh token."
  - q: "Are there flows where I should not call the silent method?"
    a: "Yes. Learn names two: the client credentials flow, which uses an application token cache and verifies it before sending a request to the security token service, and the authorization code flow in web apps, which redeems a code and so cannot look in the cache first."
  - q: "Should my code parse the error text?"
    a: "No. The error code page says to use the error field to react to errors and never to use error_description in code. Error codes and messages are subject to change at any time, and apps that depend on text or code numbers will break over time."
---

AADSTS50196 is not a sign-in problem for a user. It is a message to the developer of an application: the app asked Microsoft Entra ID for the same token too many times in too short a time. The Microsoft Entra error code reference calls it LoopDetected and tells you to look at the app's token caching and error handling. This article shows what that means in practice, using the Learn pages on error codes and on acquiring and caching tokens with MSAL. The reference gives only one line for this code, so the details come from the MSAL page, and my own advice is marked.

## What the reference says

The row for AADSTS50196 reads: a client loop has been detected. Check the app's logic to ensure that token caching is implemented, and that error conditions are handled correctly. The app has made too many of the same request in too short a period, indicating that it is in a faulty state or is abusively requesting tokens.

Two points follow from the wording:

- The sign-in service is protecting itself from repeated identical requests. The user did nothing wrong.
- The fix is in the app's code, not in tenant settings. The reference points to two things: token caching and error handling.

## Cause 1: No token caching

MSAL caches a token after it has been acquired. Learn says your application code should first try to get a token silently from the cache before it tries to acquire a token by other means. In many cases the silent call can even get another token with more scopes based on a token in the cache, and it can refresh a token that is close to expiry, because the cache also holds a refresh token.

An app that goes to the sign-in endpoint for every request, instead of reading the cache first, creates many identical requests in a short time.

### Recommended call pattern for public clients

1. Try to get a token silently from the cache.
2. If the call returns a "UI required" error or exception, acquire a token by other means, such as an interactive sign-in.

### Where not to call the silent method

Learn names two flows:

- **Client credentials flow.** It does not use the user token cache but an application token cache, and MSAL checks that cache before sending a request to the security token service.
- **Authorization code flow in web apps.** It redeems a code that the app got when the user signed in and consented. The method gets a code and not an account, so it cannot look in the cache before the call to the service.

For web apps with the OpenID Connect authorization code flow, Learn recommends that controllers create a confidential client application with a token cache with customized serialization, and then acquire the token with the authorization code flow.

### Cache by session for OBO

For the on-behalf-of flow, the page says tokens should be cached on a session basis, not on a user basis. For authorization code flow in web apps, tokens can be cached by user or by session. If you cache by user, Learn recommends limiting the session lifetime so that Entra ID can check the state of Conditional Access policies often.

## Cause 2: Error conditions not handled

An app that retries immediately after a failure, with the same request, can create the loop even when caching is in place. The Entra error code page gives rules for reacting to errors:

- Use the `error` field to react to errors. The page lists common values such as `invalid_request`, `invalid_grant`, `interaction_required` and `temporarily_unavailable`, each with a suggested client action.
- Use `error_description` for diagnosis only. The page says never to use this field to react to an error in your code.
- `error_uri` is for developers only. Do not present it to users.
- `error_codes`, `trace_id` and `correlation_id` help diagnostics.
- Error codes and messages can change at any time, so apps that depend on text or code numbers break over time.

For current descriptions and fixes the page recommends the lookup at `https://login.microsoftonline.com/error?code=<number>`.

## Do not read the token itself

Learn adds that the client should never look inside the access token. The format is not guaranteed to stay stable and it can be encrypted for the resource. It calls code that depends on token content one of the most common sources of errors and broken client logic. Use the authentication result instead, which gives the expiry time and the scopes, so the app can cache intelligently.

## Checks for the developer

1. Find the code that calls the token endpoint and confirm that it reads the cache first.
2. Confirm that the app does not create a new client application object for every request. A cache that is thrown away each time is no cache. This is my advice, since the page does not state it.
3. Look at the retry logic. Make sure a failure that needs user interaction leads to an interactive sign-in once, not to repeated silent attempts.
4. Check for background jobs or timers that all start together and ask for tokens at the same moment.
5. Use the correlation ID and timestamp from a failed response to find the requests in the sign-in logs.
6. Test by running the app against a test tenant and watching how many token requests a normal session makes.

## What an admin can do

The page gives no tenant-side fix. If a vendor app triggers the error, collect the correlation ID, the time and the application name from the sign-in logs and send them to the vendor, so they can look at their caching and error handling. That step is my suggestion.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Access token](https://www.m365.fm/entity/access-token/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Acquire and cache tokens with Microsoft Authentication Library (MSAL) (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/msal-acquire-cache-tokens)
