---
title: "Fix AADSTS900144: The Request Body Must Contain a Required Parameter"
summary: "AADSTS900144 is a developer error: the app sent a token or sign-in request without a required parameter. Which parameters Microsoft Learn lists as required for the authorization code flow and refresh requests, and how to compare your request."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [entra-id]
keypoints:
  - "The error reference describes AADSTS900144 as a developer error: the app attempts to sign in without the necessary or correct authentication parameters."
  - "The error text names the missing parameter in quotes, so the message itself tells you what to add."
  - "For redeeming an authorization code, Learn lists client_id, code, redirect_uri and grant_type as required. client_secret is required for confidential web apps."
  - "For refreshing, client_id, grant_type set to refresh_token, and refresh_token are required, plus client_secret for web apps."
  - "Learn says invalid_request, a protocol error such as a missing required parameter, is fixed by correcting the request or app registration and resubmitting."
faq:
  - q: "What does AADSTS900144 mean?"
    a: "The Microsoft Entra error code reference says the request body must contain the parameter named in the message, and calls it a developer error: the app is attempting to sign in without the necessary or correct authentication parameters. That points to the app's code or configuration rather than the user's account (my reading)."
  - q: "Which parameters are required when redeeming an authorization code?"
    a: "According to the authorization code flow article on Microsoft Learn, the token request needs tenant in the path, client_id, code, redirect_uri and grant_type set to authorization_code. client_secret is required for confidential web apps, and code_verifier is required if PKCE was used in the authorization request."
  - q: "Which parameters are required for a refresh token request?"
    a: "Learn lists tenant, client_id, grant_type set to refresh_token and refresh_token as required. client_secret is required for web apps. The scope parameter is optional for this leg."
  - q: "Should a native or single-page app send a client secret?"
    a: "No. Learn says public clients, which include native applications and single-page apps, must not use secrets or certificates when redeeming an authorization code, because a client secret cannot be reliably stored on devices or web pages."
  - q: "Where do I find the exact error details?"
    a: "The error response contains error_description, trace_id, correlation_id and a timestamp. Learn says the description helps developers find the cause of an authentication error, and that you should not react to the description text in code. Microsoft also points to the login.microsoftonline.com error lookup page for current descriptions."
---

AADSTS900144 means the app sent a request to the Microsoft Entra token service without a parameter that the request requires. The error message names the missing parameter. The fix is in the app's request, not in the user's account, so compare the request your app builds with the parameters that Microsoft Learn lists as required.

## What the error reference says

The Microsoft Entra error code reference lists AADSTS900144 with this description: the request body must contain the parameter named in the message, and it is a developer error, because the app is attempting to sign in without the necessary or correct authentication parameters. The page does not give further remediation text for this code.

The same reference explains the generic `invalid_request` error: a protocol error, such as a missing required parameter. For the token endpoint, the authorization code flow article says the action is to fix the request or app registration and resubmit the request.

Two notes from the reference are worth knowing:

- Error codes and messages can change. Microsoft says apps that depend on the text or the numbers will break over time, and that you should not use the `error_description` field to react to an error in code. Use the `error` string instead.
- For the most current information, Microsoft points to the login.microsoftonline.com error lookup page, which accepts the code number.

## Read the message first

A typical error response includes `error`, `error_description`, `error_codes`, `timestamp`, `trace_id` and `correlation_id`. The description contains the name of the missing parameter in quotes. Write down the parameter, the endpoint your app called and the correlation ID. If you later open a support case, those IDs help find the request.

The message says "request body", so the failing call is most likely a POST to a token endpoint. That is my reading of the wording, not a statement from the page.

## Check the authorization code redemption request

The authorization code flow article shows the token request as a `POST` to `/{tenant}/oauth2/v2.0/token` with `Content-Type: application/x-www-form-urlencoded`. The parameters:

| Parameter | Status per Learn |
| --- | --- |
| `tenant` (in the path) | Required. Valid values are `common`, `organizations`, `consumers` and tenant identifiers |
| `client_id` | Required. The Application (client) ID of the app registration |
| `code` | Required. The authorization code from the first leg |
| `redirect_uri` | Required. The same value used to obtain the code |
| `grant_type` | Required. Must be `authorization_code` |
| `scope` | Optional. A space-separated list of scopes from a single resource |
| `code_verifier` | Recommended. Required if PKCE was used in the authorization request |
| `client_secret` | Required for confidential web apps |

For certificate credentials, the `client_secret` is replaced by `client_assertion_type` and `client_assertion`, both required for confidential web apps. The assertion type must be `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.

Learn adds that the client secret must be URL-encoded, that the Basic authentication pattern in the Authorization header is also supported, and that public clients must not use secrets or certificates when redeeming a code.

## Check the refresh request

The refresh request goes to the same endpoint. Learn lists these parameters:

- `tenant`, `client_id`, `grant_type` set to `refresh_token`, and `refresh_token` are required.
- `client_secret` is required for web apps.
- `scope` is optional. If given, it must be equivalent to or a subset of the scopes in the original request.

My advice: do not reuse the code request and only change `grant_type`, because that leaves `code` and `redirect_uri` in and `refresh_token` out. Build each request from its own table.

## Check the authorization request when sign-in fails earlier

For the `/authorize` request, Learn marks `client_id`, `response_type`, `redirect_uri` and `scope` as required, plus the tenant in the path. The hybrid flow, where an ID token is requested too, adds a required `nonce` and the `openid` scope. Single-page apps must use `code_challenge` and `code_challenge_method`. If `code_challenge_method` is included, `code_challenge` is required.

## Practical checklist (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Copy the parameter name from the error message.
2. Capture the real HTTP request, not what the code is supposed to send. Check that the body is form encoded and that the name is spelled exactly.
3. Confirm the Content-Type header is `application/x-www-form-urlencoded`.
4. Compare with the table for the grant you use. If you use an authentication library, compare against a working sample, because Learn recommends Microsoft-built libraries over hand-built HTTP requests.
5. Check that the parameter is not empty because of a configuration value that failed to load, such as a missing client ID or redirect URI setting.
6. Confirm the app type. A public client must not send a secret, and a confidential web app needs one.

## When it is not your own code

If the failing request comes from a third-party application, the person who owns it must fix it. The error reference calls this a developer error and gives no tenant-side remedy for this code. My advice: report the exact message, the correlation ID and the time to the vendor.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft identity platform and OAuth 2.0 authorization code flow (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-auth-code-flow)
