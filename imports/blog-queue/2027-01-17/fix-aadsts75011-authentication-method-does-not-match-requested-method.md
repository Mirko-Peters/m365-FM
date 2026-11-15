---
title: "Fix AADSTS75011: Authentication Method Does Not Match the Requested Authentication Method"
summary: "AADSTS75011 appears with SAML single sign-on when the app requests an AuthnContext that differs from how the user already signed in. Learn gives two fixes: remove RequestedAuthnContext if the app allows, or send forceAuthn=true so Entra ID performs a fresh authentication."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [entra-id, saml, single-sign-on]
keypoints:
  - "The error occurs when signing in to a SAML SSO app and the AuthnContext of the earlier sign-in differs from the AuthnContextClassRef the app requests."
  - "The Entra error reference names it NoMatchedAuthnContextInOutputClaims."
  - "Learn's example: a federated user signs in with Windows integrated authentication, so the class reference is urn:federation:authentication:windows."
  - "Resolution one: RequestedAuthnContext is optional, so ask the application whether it can be removed."
  - "Resolution two: have the SAML request contain forceAuthn=true so a fresh authentication is done and the AuthnContext is honored."
faq:
  - q: "What triggers AADSTS75011?"
    a: "Learn says the SAML request contains a RequestedAuthnContext, so the app expects the AuthnContext given by its AuthnContextClassRef. The user has already authenticated earlier with a different authentication method, and Entra ID does not start a fresh authentication, so there is a mismatch."
  - q: "Which sign-in methods does Learn mention as examples?"
    a: "A federated user reaching MyApps with Windows integrated authentication, where the class reference is urn:federation:authentication:windows, and a multifactor example that Learn writes as X509, MultiFactor."
  - q: "Which side fixes it, the app or Entra ID?"
    a: "Both options in Learn involve the SAML request, which the application sends. Ask the application owner either to drop the optional RequestedAuthnContext or to set forceAuthn to true."
  - q: "Does forceAuthn change the user experience?"
    a: "Per Learn, it requests a fresh authentication, so a new sign-in happens when the SAML request is processed. The page does not describe the prompt itself."
  - q: "Is this a Conditional Access error?"
    a: "The Learn page describes it as a SAML request issue. The error reference row does not mention Conditional Access for this code."
---

AADSTS75011 appears when a SAML single sign-on app asks for one authentication method, but the user already signed in to Microsoft Entra ID with a different one. Microsoft Learn gives two resolutions: ask the application to drop the optional RequestedAuthnContext, or make the SAML request carry `forceAuthn="true"` so a fresh authentication is performed. This article follows Learn's troubleshooting page for the error and the Entra error code reference.

## The error as documented

The error code reference lists it as NoMatchedAuthnContextInOutputClaims: the authentication method by which the user authenticated with the service does not match the requested authentication method. It links to the dedicated troubleshooting article. The full message on that page reads: Authentication method by which the user authenticated with the service doesn't match requested authentication method AuthnContextClassRef.

It applies to a SAML-based single sign-on application integrated with Microsoft Entra ID.

## Cause in Learn's words, simplified

A SAML request can carry a `RequestedAuthnContext`. That means the app expects the authentication context named by its `AuthnContextClassRef`. If the user has already authenticated before reaching the app, the authentication method of that earlier sign-in may differ from the requested one. Entra ID does not perform a fresh authentication in that case. It uses the authentication context passed through by the identity provider, for example AD FS or another federation service.

Learn gives an example. A federated user reaches MyApps and Windows integrated authentication occurs. The `AuthnContextClassRef` is `urn:federation:authentication:windows`. If the app then requests anything other than that, there is a mismatch. Learn mentions another case where multifactor authentication was used, written as `X509, MultiFactor`.

## Two resolutions from Learn

1. **Remove the request.** `RequestedAuthnContext` is an optional value. If possible, ask the application whether it can be removed.
2. **Force a fresh authentication.** This makes the requested value honored. By requesting a fresh authentication, a fresh authentication is done when the SAML request is processed and the `AuthnContext` is honored. The SAML request must contain `forceAuthn="true"`.

That is the whole resolution on the page. It does not describe where in the Entra admin center to change something, because both changes are made in the application's SAML request.

## A diagnostic path

This section is my advice, not a Microsoft statement. Learn does not give diagnostic steps, so the order below is my approach.

1. **Confirm it is a SAML app.** The page covers SAML only. If the failing app uses OpenID Connect, this page does not apply.
2. **Get the SAML request.** Capture it with a browser tool that decodes SAML requests, and look for the `RequestedAuthnContext` element and its `AuthnContextClassRef` value.
3. **Reproduce with a different path.** Learn's example involves a user who signed in through federation. Try the same app with a user who has not signed in yet, and see whether the error disappears. If it does, the earlier sign-in method is the variable.
4. **Look at the sign-in log.** The sign-in logs show the authentication details of the earlier sign-in, which you can compare with the class reference that the app requests.
5. **Decide which resolution fits.** If the app does not need a specific context, ask the vendor to remove it. If it does, ask for `forceAuthn`.

## Questions to put to the application owner

- Is `RequestedAuthnContext` needed, or was it added by default in the SAML library or configuration?
- Which `AuthnContextClassRef` value does the app expect, and why?
- Can the SAML request be changed to include `forceAuthn="true"` for this app?
- Does the owner understand that this causes a fresh sign-in each time the request is processed? Learn says this is how the requested context gets honored. My inference: users may see more authentication prompts than before.

## What the page does not cover

The troubleshooting page is short. It does not cover Conditional Access, authentication strengths, a list of supported `AuthnContextClassRef` values, or app-side configuration for particular vendors. If your scenario involves one of those, you need another source.

## Reading the example again

This section is my reading of Learn's example, which shows that the failure does not depend on a wrong password or a blocked account. The user did sign in. The problem is only that the way they signed in, Windows integrated authentication through a federation service, does not match the way the app asked to be signed in. That is why neither a password reset nor a new session by itself explains the error, and why both resolutions change the request instead of the user. The second resolution, in my reading, trades a smoother experience for compliance with the requested context, because the user authenticates again so that the requested method can be honored.

## Related reading on the platform side

The reference row links to the troubleshooting page and lists other error codes for broader context. For the wider SAML sign-in flow in Entra ID, use the Microsoft Entra documentation for SAML single sign-on.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [SAML](https://www.m365.fm/entity/saml/)
- [Single sign-on](https://www.m365.fm/entity/single-sign-on/)

## Sources

- [Error - AADSTS75011 Authentication method by which the user authenticated with the service doesn't match requested authentication method AuthnContextClassRef. (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/error-code-aadsts75011-auth-method-mismatch)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
