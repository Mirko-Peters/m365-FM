---
title: "Fix AADSTS7000215 Invalid Client Secret After a Secret Expires: What Learn Documents"
summary: "AADSTS7000215 means an invalid client secret was provided. This guide separates what Microsoft Learn states about AADSTS7000215, AADSTS7000222 and AADSTS700016 from practical checks, and covers certificates and federated credentials as alternatives."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [entra-id, entra-workload-id]
keypoints:
  - "Learn lists AADSTS7000215 as Invalid client secret is provided, a developer error where the app signs in without the necessary or correct authentication parameters."
  - "A separate code, AADSTS7000222, covers expired client secret keys. The remedy named is to create new keys or use certificate credentials."
  - "AADSTS700016 means the application was not found in the directory or tenant, which can be a wrong identifier or the wrong tenant."
  - "Microsoft recommends a certificate instead of a client secret before an app moves to production. Upload .cer, .pem or .crt files under Certificates and secrets."
  - "The error reference gives no remediation for AADSTS7000215 itself, so the checks here are marked as suggestions."
faq:
  - q: "What does AADSTS7000215 say?"
    a: "According to the Microsoft Learn error code reference, the text is Invalid client secret is provided, with the explanation that this is a developer error where the app is attempting to sign in without the necessary or correct authentication parameters. The page gives no further description or remediation."
  - q: "Is AADSTS7000215 the code for an expired secret?"
    a: "The reference lists expired secrets under AADSTS7000222, InvalidClientSecretExpiredKeysProvided, which says the provided client secret keys are expired and to create new keys or consider certificate credentials. AADSTS7000215 is listed as an invalid secret."
  - q: "Where do I upload a certificate?"
    a: "In the Microsoft Entra admin center under App registrations, select the app, then Certificates and secrets, Certificates, Upload certificate. The file must be .cer, .pem or .crt, and you record the thumbprint."
  - q: "Should I use a certificate or a secret?"
    a: "Learn says Microsoft recommends a certificate instead of a client secret before moving the application to a production environment, because certificates are considered more secure."
  - q: "How do I look up an error code?"
    a: "Use login.microsoftonline.com/error and search by number or link with the code parameter. Learn says error codes and messages can change and apps should not depend on the error text."
---

AADSTS7000215 appears when an app signs in to Microsoft Entra ID with a client secret that Entra does not accept. This article keeps what Microsoft Learn documents separate from practical checks. The error reference gives very little on this code, so most of the checks below are suggestions and not Microsoft statements.

## What Learn says about the codes

- **AADSTS7000215:** the text is `Invalid client secret is provided.` followed by `Developer error - the app is attempting to sign in without the necessary or correct authentication parameters.` The page gives no further description or remediation.
- **AADSTS7000222:** `InvalidClientSecretExpiredKeysProvided`. The provided client secret keys are expired. Create new keys for the app, or consider certificate credentials for added security.
- **AADSTS700016:** `UnauthorizedClient_DoesNotMatchRequest`. The application was not found in the directory or tenant. This can happen if the application has not been installed by the administrator or consented to by any user in the tenant, if the identifier is misconfigured, or if the request went to the wrong tenant.

So a secret that has expired is documented under AADSTS7000222. If you see AADSTS7000215 after a rotation, the page only tells you that the secret or authentication parameters were wrong.

## Using the error lookup

The reference says error codes and messages can change. For current information, use login.microsoftonline.com/error, either by searching a number or by linking with a `code` parameter. The `error_uri` field links to this lookup, is for developer use only and should not be shown to users. Apps should not depend on error text or code numbers. Use the `error` field to react to errors, and do not use `error_description` for that.

The sample error response includes `trace_id`, a unique identifier for the request that helps in diagnostics, and `correlation_id`, which helps across components. The page does not explain how to use them when contacting support.

## Practical checks (suggestions)

These checks are suggestions, not from the Learn pages.

1. Confirm the app uses the secret value and not the secret ID, and that the deployed configuration was updated after the rotation.
2. Check which app registration the client ID belongs to, and that the secret was created on that registration.
3. Check whether any other environment, such as a staging slot or a scheduled job, still holds the old secret.
4. If the app signs in to a different tenant, check the tenant in the request, because AADSTS700016 covers a wrong tenant.

## Move to a certificate

Microsoft recommends using a certificate instead of a client secret before moving the application to a production environment. Learn describes certificates as the recommended credential type because they are considered more secure.

1. In the Microsoft Entra admin center, go to **App registrations** and select your application.
2. Select **Certificates & secrets** > **Certificates** > **Upload certificate**.
3. Select a `.cer`, `.pem` or `.crt` file, then **Add**.
4. Record the certificate **Thumbprint** for use in your client application code.

For testing you can create a self-signed certificate. For production, Learn says to purchase a certificate signed by a well-known certificate authority and use Azure Key Vault to manage certificate access and lifetime.

## Remove the secret problem entirely

Workload identity federation lets a workload exchange a token from an external identity provider for a Microsoft access token, which the overview says eliminates the burden of managing credentials and the risk of leaked secrets or expired certificates. The credential page lists **Add a federated credential** as an option and links to configuration articles. For GitHub Actions and similar scenarios, see the federation overview.

## Reading the three codes together

The three codes point at different layers. AADSTS7000215 is about the secret or authentication parameters sent, AADSTS7000222 is about secrets that are expired, and AADSTS700016 is about the application not being found in the tenant at all. If the application cannot be found, no secret change will help, so check the client ID and tenant first. This reading is a suggestion based on the wording of the reference, not a Microsoft diagnostic flow.

## Not covered

The pages I read do not describe how to create a client secret, whether the secret value is shown only once, expiration options or the maximum secret lifetime, how to rotate secrets or how to find which secret is wrong. They also do not give the exact federated credential settings.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Entra Workload ID](https://www.m365.fm/entity/entra-workload-id/)

## Sources

- [Microsoft Entra authentication and authorization error codes](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Add credentials to your application](https://learn.microsoft.com/entra/identity-platform/how-to-add-credentials)
- [Workload identity federation](https://learn.microsoft.com/entra/workload-id/workload-identity-federation)
