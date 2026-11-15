---
title: "Fix AADSTS65005: Misconfigured Application and Required Resource Access"
summary: "AADSTS65005 means the app asked for a resource that is not in its required resource access list or cannot be found in the tenant. Learn describes two variants and fixes such as registering the app, consenting or adding the service principal."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [entra-id, oauth-2-0, single-sign-on]
keypoints:
  - "The error name is MisconfiguredApplication; the app's required resource access list does not contain the resource, or the resource cannot be found in the tenant."
  - "Learn's short troubleshooting page says the client has not specified the resource in its requiredResourceAccess list and that the app may not be registered or lack permissions."
  - "The consent error page describes a variant where the resource is not available in the tenant and a variant where requested permissions do not match."
  - "For a permissions mismatch the causes are developer misconfiguration or a missing service principal for the target resource; fixes include consent, the Entra admin center or the gallery."
  - "If the app uses SAML, the reference table says a wrong Identifier (Entity ID) can also produce this code and points to AADSTS650056."
faq:
  - q: "What does AADSTS65005 mean?"
    a: "The reference entry is named MisconfiguredApplication. The app's required resource access list does not contain apps discoverable by the resource, or the client app requested access to a resource that was not in its list, or Graph returned a bad request or resource not found."
  - q: "Is this a user problem or a developer problem?"
    a: "Mostly a configuration problem of the app registration or the tenant. Learn lists developer misconfiguration as one cause, and a missing service principal for the target resource as the other."
  - q: "What if the app uses SAML single sign-on?"
    a: "The reference entry says you might have configured the app with the wrong Identifier (Entity ID), and refers to the troubleshooting article for error AADSTS650056."
  - q: "Which fixes does Learn list for a missing resource in the tenant?"
    a: "For a missing service principal of the resource application, Learn lists acquiring a subscription (Microsoft-published applications), consenting to the resource application, granting permissions via the Microsoft Entra admin center, or adding the application from the gallery. The method depends on the type of application."
  - q: "Is there more than one article for this code?"
    a: "Yes. Learn has a short Microsoft 365 troubleshooting article for AADSTS65005 when signing in to cloud services, and a longer consent error article that covers both variants of the code."
---

AADSTS65005 is returned when an application requests a resource that is not in its required resource access list, or that the tenant cannot find. In Microsoft Entra's error reference the entry is called MisconfiguredApplication. The fix depends on which side is wrong: the app registration, the consent, or the missing service principal for the target resource in your tenant. This article follows two Microsoft Learn pages, a short Microsoft 365 troubleshooting article and the Entra article on unexpected consent errors.

## What the reference entry says

The Entra authentication error reference describes AADSTS65005 as MisconfiguredApplication: the app's required resource access list does not contain apps discoverable by the resource, or the client app has requested access to a resource that was not specified in its required resource access list, or the Graph service returned a bad request or resource not found. If the app supports SAML, the entry adds, you might have configured the app with the wrong Identifier (Entity ID), and points to the troubleshooting article for AADSTS650056.

## The short Microsoft 365 article

Learn's article on AADSTS65005 when signing in to Microsoft cloud services is brief. In summary:

- **Symptom:** the sign-in fails with a message that the client application has not specified the resource in its requiredResourceAccess list.
- **Cause:** the app may not be registered with Microsoft Entra ID, or it may not have the correct permissions to access the resource.
- **Resolution:** register the application correctly. The page links to registration guidance for apps that use Microsoft Graph, for Dynamics CRM apps and for gallery apps with federated single sign-on.

That page does not walk through tenant-side checks, which is where the second page helps.

## The consent error article

Learn's article on unexpected errors when performing consent to an application describes AADSTS65005 in two variants.

### Variant 1: resource not available in the tenant

The message says the client application is requesting access to a resource that isn't available in your organization. Learn says to ensure the resources that provide the requested permissions are available in your tenant, or to contact an administrator of the tenant. Otherwise, it says, there's a misconfiguration in how the application requests resources, and you should contact the application developer.

### Variant 2: permissions mismatch

The app requested a resource that cannot be found in the tenant. Learn gives two causes:

1. **The developer misconfigured the app.** The app asks for a resource that its registration does not declare, or declares incorrectly.
2. **There is no service principal for the target resource in the tenant.** It may never have existed or it may have been removed.

For the missing service principal, Learn says you must provision one for the resource application so that the client application can request permissions to it. The method depends on the type of application:

- Acquire a subscription for the resource application (Microsoft-published applications).
- Consent to the resource application.
- Grant the application permissions via the Microsoft Entra admin center.
- Add the application from the Microsoft Entra application gallery.

Learn lists other codes on the same page, including AADSTS65004, AADSTS90093, AADSTS90094, AADSTS90090, AADSTS900941 and AADSTS900981. Use those entries when your message differs.

## A diagnostic order

This section is my advice, not a Microsoft statement.

1. **Read the full message.** It names the resource the app requested. Everything else depends on that name.
2. **Decide whether you own the app.** If you wrote it, open the app registration and compare its API permissions with the resource in the message. If a vendor wrote it, collect the app name and resource and ask the vendor.
3. **Check the tenant for the resource.** In Enterprise applications, search for the resource application. If it is absent, Variant 2's missing service principal cause is a candidate.
4. **Check whether you need a subscription.** Learn lists acquiring a subscription for the resource application as an option for Microsoft-published applications.
5. **Consent as the right person.** If consent is the missing step, decide who in your organization should grant it, and review what the consent prompt asks for.
6. **If SAML is involved, compare identifiers.** The reference entry mentions a wrong Identifier (Entity ID), so check it against what the application expects.
7. **Retest in a fresh session.** Use a private browser window to avoid cached tokens muddying the result.

## Mistakes to avoid

This section is my advice, not a Microsoft statement.

- **Granting broad permissions to make the error go away.** Add only what the app declares and needs. Review the consent prompt text before approving.
- **Treating every AADSTS6500x code alike.** 65004 and 65005 are separate entries. Use the reference entry for the exact code.
- **Editing the registration without noting the original state.** Write down what was there before, so you can roll back if a change breaks another sign-in path.
- **Ignoring the vendor.** For a third-party app the registration is not yours to fix. A clear report with the app name, the resource named in the error and the correlation details from the message is what the vendor can act on.

## Information to collect before you escalate

This section is my advice, not a Microsoft statement.

- The full error text, including the resource named in it.
- The app name and application (client) ID shown in the message.
- The tenant ID, the time of the failure and the correlation ID if shown.
- Whether the failure is reproducible for an admin account as well as a regular user.
- Whether the SAML or OpenID Connect protocol is in use.

## What the pages do not cover

The short Microsoft 365 article links to a gallery single sign-on troubleshooting page and to registration guidance, and the reference entry links to the AADSTS650056 article. This article does not describe the steps on those pages.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Single sign-on](https://www.m365.fm/entity/single-sign-on/)

## Sources

- [AADSTS65005 error when you try to sign in to Microsoft Cloud services - Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoft-365/admin/active-directory/aadsts65005-error-when-sign-in-cloud)
- [Unexpected Error When Performing Consent to an Application - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/application-sign-in-unexpected-user-consent-error)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
