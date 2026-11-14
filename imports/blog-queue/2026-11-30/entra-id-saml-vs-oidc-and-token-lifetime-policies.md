---
title: "Entra ID SAML vs OIDC and Token Lifetime Policies"
summary: "When to choose SAML or OpenID Connect with Microsoft Entra ID, according to Microsoft's decision guide, and how default token lifetimes and the configurable access token lifetime policy work."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [entra-id, saml, openid-connect, access-token]
keypoints:
  - "Microsoft Entra ID fully supports both SAML 2.0 and OpenID Connect, and Microsoft says both are secure. The choice is about fit."
  - "For new development Microsoft recommends OpenID Connect. SAML is a requirement-driven choice for enterprise customers, legacy identity providers or compliance mandates."
  - "Default lifetimes: access tokens random 60 to 90 minutes, ID tokens 1 hour, SAML2 tokens 1 hour, refresh tokens up to 90 days inactive."
  - "Only the access token lifetime policy is configurable. It ranges from 10 minutes to 1 day, applies to access, ID and SAML2 tokens, and is managed through Microsoft Graph only."
  - "Since January 30, 2021, refresh and session token lifetimes cannot be set by policy. Use Conditional Access sign-in frequency to control how often users sign in."
faq:
  - q: "Should I use SAML or OIDC with Microsoft Entra ID?"
    a: "Microsoft's decision guide says to default to OIDC for new SaaS development and to choose SAML when customers, compliance rules or legacy identity providers require it. Support both if your customers span both worlds."
  - q: "Is SAML less secure than OpenID Connect?"
    a: "No. According to the Microsoft decision guide, both protocols are secure and the choice is about fit, development effort and customer environments, not security strength."
  - q: "How long does a SAML token last in Entra ID?"
    a: "Microsoft Learn gives a default of 1 hour for SAML2 tokens, set by the NotOnOrAfter value in the conditions element. The configurable policy adds a five-minute clock skew."
  - q: "Can I change refresh token lifetime in Entra ID?"
    a: "Not with token lifetime policies. Microsoft Learn says that since January 30, 2021 refresh and session token properties are ignored and new tokens use the default configuration. Use Conditional Access sign-in frequency."
  - q: "Is there a portal page for token lifetime policies?"
    a: "No. Microsoft Learn says there is no Microsoft Entra admin center UI for them. Policies are managed through Microsoft Graph and the Microsoft Graph PowerShell SDK."
---

For new applications, Microsoft recommends OpenID Connect (OIDC) with Microsoft Entra ID. SAML 2.0 is fully supported and is the right choice when customers, compliance rules or legacy identity providers require it. Token lifetime is a separate topic: defaults are about an hour for ID and SAML tokens, and only the access token lifetime policy can be configured.

## SAML vs OIDC: what Microsoft says

Microsoft's decision guide opens with two statements. Entra ID fully supports both protocols, and both are secure. The choice shapes how you build the app, how hard it is to integrate and how well it fits customer environments.

| Aspect | SAML 2.0 | OpenID Connect |
|---|---|---|
| Message format | XML-based | JSON-based |
| Token type | XML assertions | JWT tokens |
| Enterprise adoption | Widely established | Growing rapidly |
| Development complexity | Higher, XML processing required | Lower, REST and JSON based |
| Modern framework support | Limited native support | Excellent support |
| Mobile and single-page apps | Challenging | Native support |
| Customer onboarding | More complex, manual setup | Simpler, automated discovery |
| Long-term maintainability | Higher overhead | Lower maintenance |

The table is generalized, and individual integrations may differ.

### When to choose which

Microsoft's guide gives this summary: OIDC suits new, cloud-native SaaS and customers with modern identity. SAML is a requirement-driven choice for enterprise customers, compliance or procurement mandates, or legacy identity providers that support only SAML.

- **Choose OIDC if** you build new SaaS or cloud-native apps, single-page or mobile apps, want development speed and modern integration, or plan multitenant distribution.
- **Choose SAML if** enterprise customers require it, you work with legacy identity providers that lack OIDC, compliance or procurement rules mandate it, or you already have a working SAML implementation.
- **Support both if** your customers span both environments. This means maintaining two integration paths.
- **If unsure,** default to OIDC for new SaaS development.

A second Microsoft article, on authenticating applications and users, agrees. It recommends OIDC for new application development and says Entra ID fully supports SAML, but the Microsoft identity platform does not provide libraries or development tools for building SAML apps. It also lists a migration limit: you cannot migrate apps that need the WS-Trust ActAs pattern or SAML artifact resolution. WS-Federation is supported but not recommended for new applications.

### Where OAuth 2.0 fits

OIDC and OAuth 2.0 are related but do different jobs. Microsoft's protocol overview says OAuth 2.0 is for authorization, issuing access and refresh tokens, while OIDC handles user sign-in, sign-out and single sign-on, using ID tokens. All tokens are bearer tokens formatted as JSON Web Tokens. The page recommends using a Microsoft Authentication Library (MSAL) rather than writing your own authentication flows. It does not cover SAML.

## Default token lifetimes

Microsoft Learn lists these defaults:

| Token | Default lifetime |
|---|---|
| Access token | Random 60 to 90 minutes, 75 on average. Depends on client, resource and whether Conditional Access is enabled. With Continuous Access Evaluation it may extend to 24 to 28 hours |
| ID token | 1 hour |
| SAML2 token | 1 hour, set by `NotOnOrAfter` in the `<conditions>` element |
| Refresh token | Maximum inactive time of 90 days, maximum age until revoked |
| Session token | Non-persistent: 24 hours maximum inactive time. Persistent: 90 days. Maximum age until revoked. Each use extends validity |

## The access token lifetime policy

Only one property is configurable, `AccessTokenLifetime`. Despite the name it applies to access tokens, ID tokens and SAML2 tokens.

- **Minimum:** 10 minutes (`00:10:00`).
- **Maximum:** one day (`23:59:59`).
- **Format:** C# TimeSpan, `hh:mm:ss`.
- **SAML tokens:** the policy value is used plus five minutes of clock skew. The `NotOnOrAfter` value in `<SubjectConfirmationData>` is not affected.
- **Precedence:** an organization-level policy takes precedence over an application-level policy. If neither exists, defaults apply.

Limitations from Learn:

- There is **no Microsoft Entra admin center UI**. Policies are managed only through Microsoft Graph and the Microsoft Graph PowerShell SDK.
- Policies do not apply to managed identity service principals or to apps with `signInAudience` set to a personal Microsoft account option.
- The SharePoint and OneDrive policy applies only to mobile and desktop clients, not browser sessions. For browser sessions use Conditional Access session lifetime.

### Refresh and session tokens

As of January 30, 2021, refresh and session token lifetimes are no longer configurable through token lifetime policies. Existing properties are ignored and new tokens use the default configuration. To control how often users must sign in, use **Conditional Access sign-in frequency**.

## Practical decision steps

1. **Is a customer or compliance rule forcing SAML?** If yes, use SAML. If not, use OIDC for a new app.
2. **Do you have mobile or single-page clients?** The decision guide marks SAML as challenging there.
3. **Do you need shorter or longer tokens?** Decide whether `AccessTokenLifetime` is the right lever, and remember it covers access, ID and SAML2 tokens at once.
4. **Do you need users to sign in more or less often?** Use Conditional Access sign-in frequency, not a token policy.
5. **Document the choice.** Record why SAML or OIDC was chosen, since supporting both adds effort.

## Common mistakes

- **Choosing SAML for security reasons.** Microsoft says both are secure.
- **Trying to extend refresh tokens with a policy.** That has not worked since January 30, 2021.
- **Looking for a portal page.** Use Microsoft Graph or Microsoft Graph PowerShell.
- **Shortening tokens without testing apps.** The minimum is 10 minutes, and shorter tokens mean more renewals.
- **Writing your own protocol code.** Microsoft advises using MSAL where possible.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [SAML](https://www.m365.fm/entity/saml/)
- [OpenID Connect](https://www.m365.fm/entity/openid-connect/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft Learn: SAML vs OIDC decision guide](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/saml-vs-oidc-decision-guide)
- [Microsoft Learn: Authenticate applications and users with Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/architecture/authenticate-applications-and-users)
- [Microsoft Learn: Microsoft identity platform protocols](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols)
- [Microsoft Learn: Configurable token lifetimes](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes)
