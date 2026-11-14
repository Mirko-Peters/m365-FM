---
title: "Fix AADSTS700016: Application Not Found in the Directory or Tenant in Microsoft Entra"
summary: "Fix AADSTS700016 UnauthorizedClient_DoesNotMatchRequest using Microsoft Learn: the four causes the error reference lists, how to read the sign-in log, tenant endpoints, single-tenant versus multitenant apps, admin consent, and the related SAML error AADSTS70001."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [entra-id, app-registration]
keypoints:
  - "Learn describes AADSTS700016 UnauthorizedClient_DoesNotMatchRequest as the application not being found in the directory or tenant."
  - "The reference lists four causes: app not installed by the admin, no user consent, a misconfigured application identifier, or a request sent to the wrong tenant."
  - "Find the failed sign-in in the Entra admin center under Monitoring and health, Sign-in logs, filter Status to Failure, and note the correlation ID and error code."
  - "A single-tenant app is available only in its home tenant, and the sign-in endpoint value common, organizations, consumers or a tenant ID controls who can sign in."
  - "AADSTS70001 has similar wording but the Learn troubleshooting article covers SAML sign-in where the Issuer does not match the configured Identifier."
faq:
  - q: "What does AADSTS700016 mean?"
    a: "According to Microsoft Learn, the application was not found in the directory or tenant. This can happen if the administrator has not installed the application, no user in the tenant consented to it, the application identifier is misconfigured, or the request was sent to the wrong tenant."
  - q: "Where do I see details of the failed sign-in?"
    a: "According to Microsoft Learn, in the Microsoft Entra admin center go to Entra ID, Monitoring and health, Sign-in logs, select Failure under Status, and open the failed sign-in. Reports Reader is the least privileged role."
  - q: "How does an admin grant consent?"
    a: "According to Microsoft Learn, in Entra ID, Enterprise apps, All applications, select the app, select Permissions under Security and select Grant admin consent. This works only if the app is already provisioned in your tenant."
  - q: "Is AADSTS70001 the same error?"
    a: "No. The Microsoft Learn troubleshooting article for AADSTS70001 covers SAML-based single sign-on where the Issuer in the SAML request does not match the Identifier configured in Entra ID."
---

AADSTS700016 means Microsoft Entra could not find the application in the tenant that the sign-in request targeted. The usual checks are the application ID in the request, the tenant the request goes to, and whether the app exists in that tenant through registration or consent. This guide uses the Microsoft Learn error code reference and related pages. The reference gives causes but no numbered fix steps, so the order of checks below is a suggestion.

## What the reference says

The Learn entry reads AADSTS700016 UnauthorizedClient_DoesNotMatchRequest: the application was not found in the directory or tenant. It says this can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You might have misconfigured the identifier value for the application, or sent your authentication request to the wrong tenant.

That gives four causes:

1. The tenant administrator has not installed the application.
2. No user in the tenant has consented to it.
3. The application identifier is misconfigured.
4. The authentication request went to the wrong tenant.

The page does not tell you which cause applies, and it has no troubleshooting steps for this code. It also says error codes can change, and points to the lookup tool at `login.microsoftonline.com/error` for current descriptions.

## Step 1: Read the failed sign-in

Learn describes how to find the failed sign-in:

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID**, **Monitoring and health**, **Sign-in logs**.
3. Search by username or application, and select **Failure** under **Status**.
4. Open the failed sign-in and note the correlation ID, sign-in error code and failure reason. **Additional Details** often tells you how to resolve the issue.

You can also paste the code into the error code lookup tool. Developers can use the `error_codes`, `timestamp`, `trace_id` and `correlation_id` fields of the error response for diagnosis. Learn says to react to the `error` field in code and never to `error_description`.

## Step 2: Check the application identifier

Compare the application (client) ID in the request with the one on the app registration. To find the registration, use **Entra ID**, **App registrations**, and select the app. A copy and paste error or an ID from another environment is a common explanation for the misconfigured identifier cause. That last point is a suggestion, because Learn does not describe it.

## Step 3: Check the tenant endpoint

The identity platform page explains that the value in the endpoint path controls who can sign in: `common` for Microsoft accounts and work or school accounts, `organizations` for work or school accounts only, `consumers` for Microsoft accounts only, and a tenant ID or domain name for a specific tenant. The page also shows where to find the endpoints of a registered app: **Entra ID**, **App registrations**, the app, **Endpoints**. It does not say which errors result from using the wrong endpoint.

## Step 4: Check single-tenant versus multitenant

The tenancy page says single-tenant apps are available only in the tenant they were registered in. Multitenant apps are available to users in their home tenant and in other tenants. The audience options are:

- Accounts in this directory only (single tenant).
- Accounts in any Microsoft Entra directory (multitenant).
- Accounts in any Microsoft Entra directory and personal Microsoft accounts (multitenant).

The page does not describe what a user from another tenant sees when signing in to a single-tenant app. Learn also links an article on converting an app to multitenant.

## Step 5: Check that the app exists in the tenant

If the app is provisioned in the tenant, an administrator can grant consent in the Enterprise applications pane:

1. Sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator.
2. Go to **Entra ID**, **Enterprise apps**, **All applications**, and select the app.
3. Select **Permissions** under **Security**, review the permissions, and select **Grant admin consent**.

Learn says the app must already be provisioned in the tenant. For apps registered in your own tenant, you can use **App registrations**, **API permissions**, **Grant admin consent**. The consent page lists these roles: Privileged Role Administrator for any permission on any API, and Cloud Application Administrator, AI Administrator or Application Administrator for any permission except Microsoft Graph app roles. It also gives an admin consent URL of the form `https://login.microsoftonline.com/{organization}/adminconsent?client_id={client-id}`.

## A related code: AADSTS70001

The reference lists AADSTS70001 as the application being disabled, and links an article whose title says application with identifier was not found in the directory. That article covers SAML single sign-on: the Issuer sent in the SAML request does not match the Identifier configured in Entra ID. Check **Basic SAML configuration** for the **Identifier**, including a trailing slash. This is a different case from AADSTS700016, and the link slug and description do not match on the reference page.

## Not covered

The pages I read do not describe the following:

- Troubleshooting steps for AADSTS700016 itself.
- Which of the four causes applies to a given failure.
- What the wrong endpoint produces.
- The sign-in experience of external users for single-tenant apps.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [App registration](https://www.m365.fm/entity/app-registration/)

## Sources

- [Microsoft Entra authentication and authorization error codes](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Tenancy in Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/single-and-multi-tenant-apps)
- [Microsoft identity platform and OAuth 2.0 protocols](https://learn.microsoft.com/entra/identity-platform/v2-protocols)
- [Troubleshoot sign-in errors](https://learn.microsoft.com/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
- [Grant tenant-wide admin consent](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent)
- [Error AADSTS70001](https://learn.microsoft.com/troubleshoot/azure/active-directory/error-code-aadsts70001-app-not-found-in-directory)
