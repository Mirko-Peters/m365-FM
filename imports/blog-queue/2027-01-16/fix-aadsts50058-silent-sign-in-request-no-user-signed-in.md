---
title: "Fix AADSTS50058: Silent Sign-In Request Sent but No User Is Signed In"
summary: "AADSTS50058 (UserInformationNotProvided) is often expected when a silent request finds no session. Learn how prompt=none and ssoSilent trigger it, why blocked third-party cookies cause it, and how to fall back to an interactive sign-in with MSAL.js."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [entra-id, openid-connect, oauth-2-0]
keypoints:
  - "The Entra error reference calls AADSTS50058 UserInformationNotProvided: session information is not sufficient for single sign-on, and says it is a common, expected error for unauthenticated users."
  - "In an SSO context where the user did sign in earlier, the reference says the SSO session was not found or invalid; it may be returned when prompt=none is specified."
  - "MSAL.js ssoSilent opens a hidden iframe and reuses the Entra session cookie, which does not work in browsers that block third-party cookies such as Safari."
  - "The documented fix is an interactive request with loginPopup or loginRedirect, optionally with loginHint or sid."
  - "With prompt=none, the platform returns interaction_required or login_required instead of showing a prompt."
faq:
  - q: "Is AADSTS50058 always a problem?"
    a: "No. The Microsoft Entra error reference says it is a common error that is expected when a user is unauthenticated and has not yet signed in. It becomes a problem when the user did sign in earlier and the SSO session was not found or is invalid."
  - q: "When is it returned?"
    a: "The reference says it might be returned to the application if prompt=none is specified. prompt=none ensures the user sees no interactive prompt, so if the request cannot complete silently the platform returns an error, either interaction_required or login_required."
  - q: "Why does it appear in Safari?"
    a: "MSAL.js documents that ssoSilent opens a hidden iframe to reuse an existing Microsoft Entra session, and that this does not work in browsers that block third-party cookies, such as Safari. The result is an interaction error with AADSTS50058."
  - q: "How should my app handle it?"
    a: "Catch InteractionRequiredAuthError and make an interactive request with loginPopup or loginRedirect. If you already know the user, pass loginHint or sid so the right account is used."
  - q: "What does prompt=login do?"
    a: "It forces the user to enter credentials on that request, negating single sign-on."
---

AADSTS50058 means a silent sign-in request found no usable session. The Microsoft Entra error reference calls it UserInformationNotProvided: session information is not sufficient for single sign-on, so a user is not signed in. It says this is a common error that is expected when a user is unauthenticated, and that it may be returned when prompt=none is specified. For developers, the documented answer is to fall back to an interactive request. This article covers the app side with MSAL.js and the OAuth parameters involved. A separate case is the Power Apps sign-in message that carries the same code.

## What the reference says

The reference describes two situations:

1. The user is unauthenticated and has not signed in yet. Learn calls this a common, expected error.
2. The request is made in an SSO context where the user signed in before. Then the SSO session was either not found or invalid.

It adds that the error might be returned to the application if `prompt=none` is specified. There is no step list in the table row, so the guidance below comes from the MSAL.js and authorization code flow pages.

## How a silent request produces it

The authorization code flow page documents the `prompt` parameter. With `prompt=none`, the user is not shown any interactive prompt. If the request cannot be completed silently by single sign-on, the Microsoft identity platform returns an `interaction_required` error. For authorization endpoint errors, the page also lists `login_required`: the client asked for silent authentication but a single user could not be found, which may mean multiple users are active in the session, or none. Its guidance for `interaction_required` is to retry without `prompt=none`.

The MSAL.js page explains the mechanism. Entra ID sets a session cookie on first authentication, and MSAL.js also caches ID and access tokens in browser storage per application domain. The two work independently but together give SSO. The `ssoSilent` method signs the user in without interaction by relying on that session cookie.

## The third-party cookie case

Learn says `ssoSilent` attempts to open a hidden iframe and reuse an existing session with Entra ID. This will not work in browsers that block third-party cookies, such as Safari, and leads to an interaction error. The page's sample message is:

```text
InteractionRequiredAuthError: login_required: AADSTS50058: A silent sign-in request was sent but no user is signed in. The cookies used to represent the user's session were not sent in the request to Azure AD
```

The documented resolution: the user must make an interactive authentication request with `loginPopup()` or `loginRedirect()`. In some cases, the prompt value `none` can be used together with an interactive MSAL.js method to achieve SSO. If you already have the user's sign-in information, pass `loginHint` or `sid` to sign in a specific account.

## The documented fallback pattern

MSAL.js samples all follow one shape: try silently, and on `InteractionRequiredAuthError` go interactive.

```javascript
const silentRequest = {
    scopes: ["User.Read", "Mail.Read"],
    loginHint: "user@contoso.com"
};

try {
    const loginResponse = await msalInstance.ssoSilent(silentRequest);
} catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
        const loginResponse = await msalInstance.loginPopup(silentRequest).catch(error => {
            // handle error
        });
    } else {
        // handle error
    }
}
```

Learn recommends the `login_hint` optional ID token claim, passed as `loginHint`, as the most reliable account hint for silent and interactive requests. Other options are the session ID `sid`, which you add as an optional claim to ID tokens, and an `account` object found with `getAccountByUsername()` or `getAccountByHomeId()`.

Without any hint, silent sign-in can fail when the browser session holds more than one account. Learn gives AADSTS16000 for that case, where the server could not tell which account to use, and says you need one of the hints or an interactive sign-in.

## Related settings from Learn

- Set `redirectUri` to a blank page or another page that does not use MSAL, for better performance and to avoid issues with `ssoSilent`.
- For SSO between browser tabs of the same app, set `cacheLocation` to `localStorage`.
- To make Entra ID ask for credentials despite an active session, use `prompt=login`.

## Diagnose it in practice

This section is my advice, not a Microsoft statement.

1. **Decide if it is expected.** If the first request of the day fails silently and the app then shows a sign-in, nothing is broken. Log it at low severity.
2. **Reproduce in a normal and a private window,** and in a browser that blocks third-party cookies. If only the blocking browser fails, the cookie case above fits.
3. **Check what the app does after the error.** The bug is usually the missing fallback, not the error itself.
4. **Pass a hint when you have one,** so an account picker does not appear unexpectedly.
5. **Check redirect URI setup** and tab sharing if only some tabs fail.
6. **For end users in a Microsoft product** that shows this code, such as Power Apps, the steps are about browser cookie settings, not app code.

## How to tell the cases apart

This section is my advice, not a Microsoft statement. Two questions separate most cases. First, did the user ever sign in on this browser? If not, the error is the expected outcome of a silent request and the app should fall back to an interactive sign-in. Second, does the failure appear only in one browser family? If it does, look at third-party cookie handling before you look at the tenant. A sign-in log entry for the same time stamp helps confirm which request carried the error.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OpenID Connect](https://www.m365.fm/entity/openid-connect/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Single sign-on (MSAL.js) - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/msal-js-sso)
- [Microsoft identity platform and OAuth 2.0 authorization code flow - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-auth-code-flow)
