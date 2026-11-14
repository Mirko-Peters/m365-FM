---
title: "Fix AADSTS700027: Client Assertion Failed Signature Validation"
summary: "AADSTS700027 means the app sent a client assertion that failed signature validation. The error reference calls it a developer error. Use Learn's certificate credentials page to check the assertion header, claims, signature padding and the certificate registered on the app registration."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [entra-id, app-registration, x509-certificate, client-credentials-flow]
keypoints:
  - "The error reference describes AADSTS700027 as a developer error: the app is signing in without the necessary or correct authentication parameters."
  - "A certificate credential is a JWT assertion signed with a certificate the app owns, sent as client_assertion with the fixed type urn:ietf:params:oauth:client-assertion-type:jwt-bearer."
  - "Learn lists the header values: alg should be PS256, typ should be JWT, x5t#S256 is the Base64url SHA-256 thumbprint of the certificate."
  - "The signature uses PSS padding, and the matching certificate must be uploaded under Certificates and secrets on the app registration."
  - "Keep the assertion short-lived: Learn says 5 to 10 minutes after nbf at most."
faq:
  - q: "What does AADSTS700027 mean?"
    a: "The Entra error code reference says client assertion failed signature validation, and describes it as a developer error where the app attempts to sign in without the necessary or correct authentication parameters."
  - q: "Which header values does Learn require?"
    a: "alg should be PS256, typ should be JWT, and x5t#S256 should be the Base64url-encoded SHA-256 thumbprint of the DER encoding of the X.509 certificate."
  - q: "Which claims does the assertion need?"
    a: "Learn lists aud (the token endpoint URL for your tenant), exp, iss (the client ID), jti (a unique ID), nbf, sub (the same value as iss) and iat."
  - q: "How is the assertion signed?"
    a: "Learn says to compute the signature by applying the certificate as described in the JWT specification, and to use PSS padding."
  - q: "Where do I register the certificate?"
    a: "In the Microsoft Entra admin center, on the app registration, select Certificates and secrets, then Certificates, upload the certificate and select Add. You can also update the keyCredentials property in the application manifest."
---

AADSTS700027 means the client assertion an application sent failed signature validation. The Microsoft Entra error reference calls it a developer error: the app is attempting to sign in without the necessary or correct authentication parameters. The reference does not list specific causes. This guide therefore uses Learn's page on certificate credentials, which describes what a valid assertion looks like, as a checklist. The mapping from checklist items to this error is my reading, since the reference does not tie them together.

## What a certificate credential is

Learn says an application can use its own credentials anywhere a client secret could be used, for example in the OAuth 2.0 client credentials grant and the on-behalf-of flow. One form is a JSON Web Token assertion signed with a certificate the application owns, the `private_key_jwt` client authentication option in OpenID Connect. The app sends it as `client_assertion`, with `client_assertion_type` set to the fixed value `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`, in place of `client_secret`.

If you want to use a JWT from another identity provider as the credential, Learn points to workload identity federation instead.

## Checklist: the header

| Field | Learn says |
| --- | --- |
| `alg` | Should be PS256 |
| `typ` | Should be JWT |
| `x5t#S256` | Base64url-encoded SHA-256 thumbprint of the certificate's DER encoding |

Check that your JWT library produces PS256, not a different algorithm, and that the thumbprint field is the SHA-256 form named x5t#S256. The page gives only that field, so a different thumbprint format is a point to verify.

## Checklist: the claims

| Claim | Learn says |
| --- | --- |
| `aud` | `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token` |
| `iss` | The client ID, the GUID application ID |
| `sub` | Same value as `iss` |
| `jti` | A unique identifier, a GUID |
| `nbf` | The current time is appropriate |
| `iat` | The time the JWT was issued |
| `exp` | Keep it short: 5 to 10 minutes after `nbf` at most |

Learn adds that Microsoft Entra ID does not currently place restrictions on the `exp` time. Check that the tenant ID in `aud` is the tenant that owns the app registration, and that `iss` and `sub` carry the client ID and not the object ID. The page says to use the GUID application ID.

## Checklist: the signature

Learn says the signature is computed by applying the certificate as described in the JWT specification, and to use PSS padding. If your code signs with PKCS1 v1.5 padding, or signs with a different key than the registered certificate, signature validation fails. Learn notes that MSAL supports building the assertion with `.WithCertificate()`, which avoids manual construction.

## Checklist: the registration

The signature can only validate if Entra ID holds the public part of the certificate. Learn gives two ways to register it:

1. **Upload the file.** On the app registration select **Certificates & secrets** > **Certificates**, then **Upload certificate**, choose the file and select **Add**. The thumbprint, start date and expiration appear.
2. **Update the manifest.** Replace the `keyCredentials` property with an entry that has `customKeyIdentifier` (the Base64-encoded certificate hash), `keyId` (a GUID), `type` of `AsymmetricX509Cert`, `usage` of `Verify` and `key` (the Base64-encoded raw data). The property is multi-valued, so several certificates can be uploaded.

If the app signs with a certificate that is not on the registration, or one that was replaced, expect a validation failure. That follows from how Learn describes registration, and the page does not state it as a cause of this specific error.

## Decode and compare

This section is my advice, not a Microsoft statement.

1. **Decode your assertion.** Paste a test assertion into a JWT decoder you trust, using a throwaway one that has no real secrets, and compare each header and claim with the tables above.
2. **Compare thumbprints.** Calculate the SHA-256 thumbprint of the certificate your code loads and compare it with the thumbprint shown in the portal after upload. A mismatch shows the wrong certificate is in use.
3. **Check where the key comes from.** In services that load a certificate from a store or vault, confirm the app loads the same version that you uploaded.
4. **Check clocks.** The `nbf`, `iat` and `exp` claims are time-based, so a clock far off on the host can cause trouble. Learn does not list that as a cause, so I treat it as an item to rule out.
5. **Test with MSAL** if you built the assertion by hand. If the MSAL path works with the same certificate, the difference is in your handwritten assertion.

## Common ways a hand-built assertion goes wrong

This section is my advice, not a Microsoft statement, and it is a list of places to look, not documented causes of the error. A library default may produce a different signing algorithm than PS256. A copied example may carry a placeholder in `iss` or `sub`. A certificate that was renewed may be in the vault while the app registration still holds the old public key. A test assertion may be reused after it expired. Each of these maps to an item in the checklists above, which is why the checklist order starts with the assertion and ends with the registration.

## What the sources do not say

The error reference row has one sentence. The certificate credentials page describes a valid assertion but does not mention AADSTS700027. Neither page lists the causes of this error or the checks the service performs, so no documented ranking of causes exists in the pages I read.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [App registration](https://www.m365.fm/entity/app-registration/)
- [X.509 certificate](https://www.m365.fm/entity/x509-certificate/)
- [Client credentials flow](https://www.m365.fm/entity/client-credentials-flow/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft identity platform certificate credentials - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/certificate-credentials)
