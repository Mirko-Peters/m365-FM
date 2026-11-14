---
title: "Fix AADSTS54005: OAuth2 Authorization Code Was Already Redeemed"
summary: "AADSTS54005 says the OAuth2 authorization code was already redeemed. See what Learn documents about code lifetime and the token request, how invalid_grant relates, and my checklist for double redemption such as retries, reloads and parallel requests."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [entra-id, oauth-2-0, openid-connect]
keypoints:
  - "The Entra error reference lists AADSTS54005 as: the OAuth2 authorization code was already redeemed; retry with a new valid code or use an existing refresh token."
  - "Authorization codes are short lived and typically expire after about 1 minute."
  - "The token endpoint returns invalid_grant when the authorization code or PKCE code verifier is invalid or expired; the client action is a new /authorize request."
  - "Refresh tokens are issued only if the offline_access scope was requested, and are the way to get further access tokens."
  - "Learn recommends using a Microsoft-built authentication library rather than crafting raw HTTP requests."
faq:
  - q: "What does AADSTS54005 mean?"
    a: "The Microsoft Entra error reference says the OAuth2 authorization code was already redeemed, and advises retrying with a new valid code or using an existing refresh token."
  - q: "How long is an authorization code valid?"
    a: "Learn says authorization codes are short lived and typically expire after about 1 minute."
  - q: "How do I get a new code?"
    a: "Send the user through the /authorize endpoint again. For invalid_grant at the token endpoint, Learn's client action is to try a new request to /authorize and verify that the code_verifier was correct."
  - q: "Can I use a refresh token instead?"
    a: "Yes, if you have one. The token response includes a refresh token only if the offline_access scope was requested. You redeem it at the /token endpoint with grant_type=refresh_token, and Learn says to replace the old refresh token with the new one."
  - q: "Should I write the token request by hand?"
    a: "Learn says the page describes low-level protocol details needed only when manually crafting raw HTTP requests, which it does not recommend. It advises using a Microsoft-built and supported authentication library."
---

AADSTS54005 means the authorization code your app sent to the token endpoint was already redeemed. The Microsoft Entra error reference words it as: OAuth2 authorization code was already redeemed, retry with a new valid code or use an existing refresh token. The remedy is never to send the same code twice. Get a new code through the /authorize endpoint, or use a refresh token you already hold. This article follows the error reference and Learn's page on the OAuth 2.0 authorization code flow.

## Where the code comes from and where it goes

In the authorization code flow, the app sends the user to `/authorize`. After sign-in and consent, the platform returns a `code` to the redirect URI. Learn says the code is the `authorization_code` the app requested, and that authorization codes are short lived and typically expire after about 1 minute.

The app then redeems the code by sending a POST to the `/token` endpoint, with these parameters among others:

- `client_id`
- `code`, the authorization code from the first leg
- `redirect_uri`, the same value used to get the code
- `grant_type=authorization_code`
- `code_verifier`, the same one used to obtain the code when PKCE was used
- a client secret or certificate assertion for confidential web apps

A successful response holds an `access_token`, and also a `refresh_token` if `offline_access` was requested and an `id_token` if `openid` was requested.

## How this error differs from invalid_grant

The same page lists `invalid_grant` among token endpoint errors: the authorization code or PKCE code verifier is invalid or has expired. The client action is to try a new request to `/authorize` and verify that `code_verifier` was correct. AADSTS54005 is the more specific case in which the platform recognizes that the code was used before. The error reference row states that outcome directly.

## What the documentation does not say

The pages I read give the lifetime of a code and the meaning of the error. They do not list the ways an app ends up redeeming a code twice. The causes in the next section are my own experience and reasoning, so test each against your logs.

## Likely causes of double redemption

This section is my advice, not a Microsoft statement.

1. **A page reload on the redirect URI.** The browser reloads the callback URL that carries `code` in the query string and the app redeems it again. Remove the code from the address after the first use.
2. **Two redemptions in parallel.** Two components, two tabs or two server instances handle the same callback at once. Only one can win.
3. **Automatic retries.** An HTTP client or gateway retries a slow `/token` call, and the retry arrives after the first has succeeded.
4. **A debugging or replay tool** that resends a captured request.
5. **A framework and your own code both handling the callback.** For example, a library middleware redeems the code and then your custom handler tries again.
6. **Back button navigation** after sign-in returns to the callback URL.

## Fix it

1. **Find the second call.** Compare the correlation IDs and timestamps of the successful and failed `/token` requests in your server logs or in the sign-in logs.
2. **Make redemption happen once.** Guard the callback so that a code is redeemed in one place, and mark the state value as used after the first attempt. Learn says the `state` value should be checked on return, which also helps tie a callback to one request.
3. **Do not retry a failed redemption with the same code.** On this error, start a new `/authorize` request, or call `/token` with a refresh token if you have one.
4. **Use the library.** Learn says to use a Microsoft-built and supported authentication library to get tokens, not hand-built HTTP requests. A library keeps this logic out of your code.
5. **Use refresh tokens for later tokens.** Learn says refresh tokens are valid for the permissions the client already has consent for, and that you should replace the old refresh token with the new one. Single page apps should expect refresh tokens to expire after 24 hours, per the page, so plan an interactive sign-in at that point.

## Check the request details

If the error occurs even though the code was used once, check these items from the flow page:

- `redirect_uri` must match the value used to get the code.
- `code_verifier` must be the same one used in the `/authorize` request.
- The code must be redeemed within its short lifetime.
- Public clients, such as native apps and single page apps, must not use secrets or certificates when redeeming a code.

A single page app that has not registered its redirect URI with the `spa` type gets an `invalid_request` error about cross-origin token redemption, which is a different problem from this one.

## A short checklist

1. Confirm the error text mentions the code was already redeemed.
2. Find the earlier successful redemption in the logs.
3. Identify what triggered the second call: reload, retry, parallel handler or replay.
4. Make the callback idempotent from the app side.
5. Start a fresh sign-in, or use the refresh token.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [OpenID Connect](https://www.m365.fm/entity/openid-connect/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft identity platform and OAuth 2.0 authorization code flow - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-auth-code-flow)
