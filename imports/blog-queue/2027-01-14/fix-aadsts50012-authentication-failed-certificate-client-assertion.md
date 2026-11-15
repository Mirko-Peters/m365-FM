---
title: "Fix AADSTS50012: Authentication Failed Because of Certificate, Thumbprint or Client Assertion Problems"
summary: "AADSTS50012 (AuthenticationFailed) lists seven reasons, from an unauthorized signing certificate or thumbprint to an invalid client assertion signature. Use Learn's certificate credential rules to check the assertion header, claims and registered certificate."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [entra-id, x509-certificate, certificate-authority]
keypoints:
  - "The error reference lists seven reasons for AADSTS50012, including an unauthorized subject name or thumbprint, an invalid certificate chain and an invalid client assertion signature."
  - "For a certificate credential, Learn says the assertion header should use alg PS256, typ JWT and an x5t#S256 SHA-256 thumbprint, and the signature should use PSS padding."
  - "The certificate must be registered on the app under Certificates and secrets, or as keyCredentials in the manifest."
  - "iss and sub are the application client ID, aud is the tenant token endpoint, and Learn says to keep the assertion lifetime short."
  - "Learn's certificate credentials page does not describe the subject name or trusted authority policy causes, so treat those as open items to verify with Microsoft."
faq:
  - q: "What does AADSTS50012 mean?"
    a: "The Microsoft Entra error reference lists it as AuthenticationFailed. Authentication failed for one of seven reasons: the subject name of the signing certificate is not authorized, a matching trusted authority policy was not found for the authorized subject name, the certificate chain is not valid, the signing certificate is not valid, policy is not configured on the tenant, the thumbprint of the signing certificate is not authorized, or the client assertion contains an invalid signature."
  - q: "How should the client assertion header look?"
    a: "Per Microsoft Learn for certificate credentials: alg should be PS256, typ should be JWT, and x5t#S256 is the base64url-encoded SHA-256 thumbprint of the X.509 certificate's DER encoding."
  - q: "Which claims does the assertion need?"
    a: "aud is https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token, iss and sub are both the application client ID, exp and nbf bound the lifetime, jti is a unique GUID and iat is the issue time. Learn advises keeping the lifetime to 5 to 10 minutes after nbf at most."
  - q: "How do I register the certificate on the app?"
    a: "In the Entra admin center open the app registration, select Certificates and secrets, then Certificates, Upload certificate and Add. The thumbprint, start date and expiration then appear. You can instead replace keyCredentials in the application manifest."
  - q: "What if the error says the signing certificate or subject name is not authorized?"
    a: "The Learn certificate credentials page does not describe subject name authorization or trusted authority policies, so this article gives no configuration steps for them. My advice: check that the certificate used to sign is the one registered on the app and note the full error text and trace ID for Microsoft support."
---

AADSTS50012 is named AuthenticationFailed, and the Microsoft Entra error reference gives seven possible reasons. They concern the signing certificate, its thumbprint, its chain, policy on the tenant, and the signature of the client assertion. This article uses Microsoft Learn's page on certificate credentials to check what a correct client assertion looks like, then matches each listed reason to a check. Where Learn gives no detail, the article says so.

## The seven reasons from the reference

Learn's error reference says authentication failed for one of these reasons:

1. The subject name of the signing certificate is not authorized.
2. A matching trusted authority policy was not found for the authorized subject name.
3. The certificate chain is not valid.
4. The signing certificate is not valid.
5. Policy is not configured on the tenant.
6. The thumbprint of the signing certificate is not authorized.
7. The client assertion contains an invalid signature.

The reference gives no more detail than this list. The error text you receive should be matched against it. Copy the full message, including the trace ID and timestamp, before changing anything.

## Where this fits: certificate credentials

Learn says an application can use its own credentials wherever a client secret could be used, such as the client credentials flow and the on-behalf-of flow. One form is a JWT assertion signed with a certificate the application owns, which is the `private_key_jwt` option in OpenID Connect. The assertion replaces `client_secret` with two parameters: `client_assertion_type`, a fixed value of `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`, and `client_assertion`, the JWT.

If you want to use a JWT issued by another identity provider instead, Learn points to workload identity federation and a federation policy. That is a different setup and not covered here.

## Check the assertion

### Header

| Parameter | Learn says |
| --- | --- |
| `alg` | Should be PS256 |
| `typ` | Should be JWT |
| `x5t#S256` | Base64url-encoded SHA-256 thumbprint of the X.509 certificate's DER encoding |

The signature is computed with the certificate as in RFC 7519, and Learn says to use PSS padding.

### Claims

| Claim | Value |
| --- | --- |
| `aud` | `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token` |
| `iss` | The application (client) ID GUID |
| `sub` | The same value as `iss` |
| `jti` | A unique GUID |
| `nbf` | The not-before time; Learn says the current time is appropriate |
| `exp` | The expiration time; Learn says to keep it short, 5 to 10 minutes after `nbf` at most |
| `iat` | The time the JWT was issued |

Learn says Microsoft Entra ID does not currently place restrictions on the `exp` time. The page only shows the global endpoint. My advice, not from this page: in a national cloud, check which token endpoint applies before you build the `aud` value.

## Match the reasons to checks

The right-hand column is my advice, not Learn text.

| Reason | What to check |
| --- | --- |
| Invalid signature on the client assertion (7) | Compare your header and signing against the tables above: PS256, PSS padding, and a signature made with the private key of the registered certificate. Decode the JWT and confirm all three parts. |
| Thumbprint of the signing certificate not authorized (6) | The `x5t#S256` header must be the SHA-256 thumbprint of the certificate you actually used to sign, and that certificate must be registered on the app. Compare it with the thumbprint shown under **Certificates & secrets**. |
| Signing certificate not valid (4) | Check the start and expiration dates shown after upload. The page does not define other validity rules. |
| Certificate chain not valid (3) | The certificate credentials page does not describe chain validation. Check the chain in the certificate store of the machine that signs, and collect the details for support. |
| Subject name not authorized (1), trusted authority policy not found (2), policy not configured on the tenant (5) | The certificate credentials page does not describe these and gives no configuration steps for them. Collect the full error text and ask Microsoft support or consult the documentation for the feature that you use. |

## Register the certificate on the app

Learn says there are two ways in the Microsoft Entra admin center.

**Upload the certificate file.** In the app registration, select **Certificates & secrets** > **Certificates**, select **Upload certificate**, choose the file and select **Add**. After upload the thumbprint, start date and expiration are shown.

**Edit the application manifest.** Compute the base64 thumbprint and base64 raw data of the certificate, provide a GUID as key ID, then in **Manifest** replace the `keyCredentials` property with an entry of type `AsymmetricX509Cert` and usage `Verify`. The property accepts multiple certificates for richer key management.

## If you suspect the wrong certificate

This section is my advice, not a Microsoft statement.

1. Write down the thumbprint shown on the app registration.
2. Compute the thumbprint of the certificate in the signing environment, in the SHA-256 form that the header uses, and compare. If you rotated certificates, the signing service may still hold the old one.
3. If you use a library, check that it was given the certificate, not only a secret or a stale certificate path. Learn notes that MSAL supports certificate assertions with `.WithCertificate()` in .NET.
4. Repeat the request with a freshly built assertion and a short lifetime.
5. If the message still names subject name or policy, stop guessing and send the trace ID to support.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [X.509 certificate](https://www.m365.fm/entity/x509-certificate/)
- [Certificate authority](https://www.m365.fm/entity/certificate-authority/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft identity platform certificate credentials - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/certificate-credentials)
