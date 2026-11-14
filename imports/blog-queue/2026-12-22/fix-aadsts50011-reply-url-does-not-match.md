---
title: "Fix AADSTS50011: The Reply URL Does Not Match the Reply URLs Configured"
summary: "What AADSTS50011 InvalidReplyTo means in Microsoft Entra ID, how to find the mismatched URL, and which redirect URI rules from Microsoft Learn explain why a registered URL still fails."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [entra-id]
keypoints:
  - "AADSTS50011 (InvalidReplyTo) means the reply address is missing, misconfigured, or does not match the reply addresses configured for the app."
  - "For SAML apps the cause is an AssertionConsumerServiceURL in the request that differs from the Reply URL value or pattern configured in Entra ID."
  - "The fix is to add the exact URL from the error to the application, or have someone who manages the app do it."
  - "Redirect URIs are case-sensitive, must use https except for localhost, and wildcards are allowed only for work or school only apps."
  - "Add redirect URIs to the application object, never to the service principal, because service principal values can be removed during sync."
faq:
  - q: "What does AADSTS50011 mean?"
    a: "The Microsoft Entra error reference describes AADSTS50011 InvalidReplyTo as a reply address that is missing, misconfigured, or does not match the reply addresses configured for the app. The stated resolution is to add the missing reply address to the Entra application."
  - q: "Where do I find the URL that failed?"
    a: "For SAML single sign-on the Learn troubleshooting article says the AssertionConsumerServiceURL value in the SAML request is the URL you see in the error. Compare that value with the Reply URL configured in Entra ID."
  - q: "Are redirect URIs case-sensitive?"
    a: "Yes. The Microsoft identity platform page on redirect URIs says they are case-sensitive and must match the case of the URL path of the running application."
  - q: "Can I use a wildcard redirect URI?"
    a: "Only for apps configured to sign in work or school accounts of one organization. Learn says wildcard URIs are unsupported for registrations that sign in personal Microsoft accounts and work or school accounts, and it discourages them in general."
  - q: "Who can fix this error?"
    a: "Someone with permission to manage the application in Microsoft Entra. The error reference says the resolution is to add the missing reply address or to have a person with those permissions do it."
---

AADSTS50011 means the sign-in request named a reply address that Microsoft Entra ID does not have on record for that application. The fix is almost always to make the two values identical. This guide follows what Microsoft Learn says about the error and then covers the redirect URI rules that explain most near-miss cases.

## What the error says

The Microsoft Entra error reference lists the code as **AADSTS50011 InvalidReplyTo**: the reply address is missing, misconfigured, or doesn't match the reply addresses configured for the app. Its resolution is to add the missing reply address to the Microsoft Entra application, or have someone with permission to manage the application do it.

The full message in the Learn troubleshooting article reads: the reply URL does not match the reply URLs configured for the application, and you should make sure the reply URL sent in the request matches one added to your application.

Reply URL and redirect URI are the same thing. Learn says the values depend on the application, and you should get them from the application vendor.

## Case 1: SAML single sign-on

The Learn troubleshooting article covers apps set up for SAML-based single sign-on with Entra ID.

**Cause.** The `AssertionConsumerServiceURL` value in the SAML request doesn't match the Reply URL value or pattern configured in Entra ID. The value in the request is the URL shown in the error.

**Resolution, in order:**

1. Make sure the `AssertionConsumerServiceURL` in the SAML request matches the Reply URL configured in Entra ID.
2. Verify or update the **Reply URL** textbox so it matches the `AssertionConsumerServiceURL` value in the request.

Once the value matches, sign-in should work. Learn points to its Salesforce tutorial as a sample of the detailed portal steps, because the exact steps depend on the application. The article itself does not give a navigation path, so follow your vendor's integration tutorial for the screen.

## Case 2: OpenID Connect or OAuth app registration

The troubleshooting article above is about SAML. For app registrations that use redirect URIs, the Microsoft identity platform page on redirect URI restrictions lists the rules. A URL can look registered and still fail because of one of these.

- **Scheme.** Redirect URIs must begin with `https`. The `http` scheme is supported only for localhost URIs and should be used only during local development and testing.
- **Case.** Redirect URIs are case-sensitive and must match the case of the URL path of the running application.
- **Special characters.** `! $ ' ( ) , ;` are not supported, and neither are Internationalized Domain Names.
- **Localhost.** For localhost redirect URIs, the port is ignored when matching. Learn says not to register several localhost URIs that differ only by port, and that the IPv6 loopback address is not supported. It recommends the loopback literal `127.0.0.1` over `localhost`.
- **Wildcards.** Wildcards such as `https://*.contoso.com` are discouraged. They are allowed only for apps that sign in work or school accounts of one organization's tenant, and are unsupported when personal Microsoft accounts are in the audience.
- **Query strings.** Allowed only for apps that sign in work or school accounts only.
- **Trailing slash.** A URI without a path is returned with a trailing slash for query or fragment response modes, for example `https://contoso.com` returns as `https://contoso.com/`. URIs with a path are not modified.
- **Count and length.** Up to 256 redirect URIs for apps that sign in work or school accounts, and 100 when personal accounts are included. Each URI can have up to 256 characters.

## Where to register the URI

Learn says to always add redirect URIs to the application object only. Values added to a service principal could be removed when the service principal syncs with the application object.

Add the URI under the platform that matches the app type: **Web**, **Single-page application (SPA)**, or **Mobile and desktop applications**. In the Azure portal the **Redirect URIs** text box rejects `http` loopback URIs. Learn names the `replyUrlsWithType` attribute in the application manifest for those restricted cases, and I could not confirm exact manifest steps from the pages I read, so check the manifest reference before editing.

## Quick checklist (my advice)

1. Copy the exact reply URL from the error message.
2. Compare it character by character with the registered value: scheme, host, path, case, trailing slash.
3. For SAML apps, compare with the Reply URL textbox. For OIDC apps, compare with the platform's redirect URIs on the application object.
4. Check whether the app registers the right platform type.
5. If you are not allowed to edit the app, send the URL and application ID to the app owner.

## What the pages do not cover

The Learn pages I read do not give a portal navigation path for the SAML reply URL, and they do not describe how Entra normalizes every possible mismatch. If a URL still fails after it matches exactly, my advice is to read the error text again for a different application ID, because sending a request to the wrong app registration is a separate problem from a mistyped URL.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Error AADSTS50011 - The reply URL specified in the request does not match the reply URLs configured for the application (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50011-reply-url-mismatch)
- [Redirect URI (reply URL) best practices and limitations (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reply-url)
