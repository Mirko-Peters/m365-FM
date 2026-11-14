---
title: "Fix AADSTS7000218: The Request Body Must Contain client_assertion or client_secret"
summary: "AADSTS7000218 (invalid_client) appears when a confidential client sends no secret or assertion to the token endpoint. Add the credential, or allow public client flows for ROPC and device code apps."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [entra-id, app-registration, client-secret]
keypoints:
  - "The error means the app did not provide the client secret or assertion that the token endpoint expects from a confidential client."
  - "Fix 1: include the client secret or assertion in the token request."
  - "Fix 2, for flows like ROPC or device code: App registrations > Authentication > Advanced settings > Allow public client flows > Yes."
  - "Entra ID decides the client type from the redirect URI type: Web means confidential, Mobile and desktop applications means public."
  - "Without a redirect URI, the Enable the following mobile and desktop flows setting decides: Yes means public, No means confidential."
faq:
  - q: "What does AADSTS7000218 mean?"
    a: "Microsoft Learn says it occurs when a confidential client application authenticates to Microsoft Entra ID without providing the credentials the token endpoint expects. The response has the error invalid_client and the message that the request body must contain client_assertion or client_secret."
  - q: "How do I fix it for a confidential client?"
    a: "Learn says to include the client secret or assertion in the token request. A confidential client must provide its credentials when it authenticates to Microsoft Entra ID."
  - q: "How do I fix it for a public client such as ROPC or device code?"
    a: "For flows where you do not expect the app to be confidential, such as resource owner password credentials or device authorization grant, Learn says to allow public client flows. In App registrations select your application, then Authentication, then Advanced settings, and under Allow public client flows set Enable the following mobile and desktop flows to Yes."
  - q: "How does Entra ID decide whether my app is public or confidential?"
    a: "Learn describes two methods. If the request contains a redirect URI, its type decides: Web classifies the app as confidential and Mobile and desktop applications as public. If no redirect URI is provided, as in ROPC, device code and Integrated Windows Authentication, the Enable the following mobile and desktop flows setting decides."
  - q: "Is changing the client type to public safe?"
    a: "Learn warns that changing the default client type from confidential to public has security implications and links to its page on public and confidential client applications. Only enable it for flows that cannot keep a secret."
---

AADSTS7000218 means the token request reached Microsoft Entra ID without a client secret or client assertion, and Entra ID treated the app as a confidential client that must have one. You have two documented fixes. Send the credential in the request, or, for flows such as ROPC or device code that should run as a public client, allow public client flows in the app registration.

## The error

Microsoft Learn shows the response like this: an `invalid_client` error with the description "AADSTS7000218: The request body must contain the following parameter: 'client_assertion' or 'client_secret'" and the error code 7000218, followed by the trace ID, correlation ID and timestamp.

The Learn article gives the cause in one sentence: the application does not provide the credentials, a client secret or an assertion, that the token endpoint expects. A confidential client must provide its credentials when it authenticates.

## Fix A: The app is a confidential client

Include the client secret or assertion in the token request. This is the resolution Learn states first.

If you need to create a credential, the app registration has **Certificates & secrets**. A separate Learn article describes adding certificates, client secrets and federated credentials. It says Microsoft recommends a certificate over a client secret before production, and that client secrets should not be used in production. Check that the secret value you send is the secret **Value**, not the ID. The secret value is shown only once when you create it. That last detail is from the credentials article, and the point about mixing up value and ID is my own advice.

## Fix B: The app should be a public client

Some flows are not meant for confidential clients, for example the OAuth 2 resource owner password credentials (ROPC) grant and the device authorization grant. In those cases Learn says to allow public client flows:

1. In the Azure portal, open **App registrations** and select your application.
2. Select **Authentication**.
3. Select **Advanced settings** > **Allow public client flows**.
4. For **Enable the following mobile and desktop flows**, select **Yes**.

Learn warns that changing the default client type from confidential to public has security implications and points to its page on public and confidential clients. So only do this when the app really cannot keep a secret, such as a desktop or mobile app in an unmanaged environment.

## Why Entra ID calls your app confidential

Learn explains the client types as defined by OAuth 2.0:

- **Confidential client:** can securely store a secret. Example: a web application whose code and secrets sit on a server not exposed to the public.
- **Public client:** cannot store a secret. Example: a mobile or desktop application in an insecure or unmanaged environment.

In the app registration model a registered application can be both, depending on context. Entra ID determines the type like this:

1. **By redirect URI type.** It compares the redirect URI in the request with the registered ones. A **Web** redirect URI classifies the application as confidential. A **Mobile and desktop applications** redirect URI classifies it as public.
2. **By the mobile and desktop flows setting, when no redirect URI is sent.** In ROPC, device code and Integrated Windows Authentication no redirect URI is provided. Then **Enable the following mobile and desktop flows** decides. **Yes** means public. **No** means confidential.

A confidential client is expected in certain flows, namely client credentials, authorization code and on-behalf-of, according to Learn. So the usual causes of this error are an app that sends a request without a credential, or a flow that sends no redirect URI while the setting is still **No**.

## Identify the flow your app uses

Learn suggests reviewing the application code or capturing a trace to inspect the `grant_type` and `redirect_uri` sent in the POST to the token endpoint. The endpoints are `https://login.microsoftonline.com/<tenant name>/oauth2/token` for v1 and `https://login.microsoftonline.com/<tenant name>/oauth2/v2.0/token` for v2.

| Flow | grant_type |
| --- | --- |
| ROPC | `password` |
| Device code | `urn:ietf:params:oauth:grant-type:device_code` |
| Authorization code | `authorization_code` |
| Client credentials | `client_credentials` |
| On-behalf-of | `urn:ietf:params:oauth:grant-type:jwt-bearer` |
| SAML bearer assertion | `urn:ietf:params:oauth:grant-type:saml1_1-bearer` |

## Which fix to pick

This is my reading of the page, not an extra Microsoft rule.

1. `client_credentials`, `authorization_code` with a Web redirect URI, or on-behalf-of: the app is meant to be confidential. Fix the code or configuration so it sends the secret or assertion.
2. `device_code` or `password` with no secret available: the flow is public. Check the **Allow public client flows** setting.
3. A desktop or mobile app that registered a Web redirect URI by mistake: Entra ID sees a confidential client. Fix the redirect URI type before you change the public client setting.

Learn links separate pages for the ROPC and device code flows. I did not read them for this article, so check them before you rely on either flow.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [App registration](https://www.m365.fm/entity/app-registration/)
- [Client secret](https://www.m365.fm/entity/client-secret/)

## Sources

- [Invalid Client Error AADSTS7000218 When Authenticating to Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/confidential-client-application-authentication-error-aadsts7000218)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Add and manage app credentials in Microsoft Entra ID - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/how-to-add-credentials)
