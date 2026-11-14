---
title: "Fix AADSTS90002: Tenant Name Not Found (InvalidTenantName) After Sign-In Against the Wrong Cloud or Domain"
summary: "AADSTS90002 means Entra could not find the tenant you signed in to. Learn names two causes: a cross-cloud app used against the wrong cloud, or a tenant derived from an email domain that is not registered. Check the endpoint and the tenant value."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [entra-id, tenant-restrictions, cross-tenant-access-settings]
keypoints:
  - "The error reference calls AADSTS90002 InvalidTenantName: the tenant name was not found in the data store, so check that you have the correct tenant ID."
  - "App developers get it when the app tries to sign in to a tenant Microsoft cannot find, often because of a cross-cloud app used against the wrong cloud."
  - "The other named cause is a tenant derived from an email address where the domain is not registered."
  - "Global Azure, US Government and China operated by 21Vianet each have their own sign-in endpoint and their own Azure portal."
  - "For single-tenant apps, replace common in the authority URL with the tenant ID or name; the tenant ID is under Entra ID > Overview > Properties."
faq:
  - q: "What does AADSTS90002 mean?"
    a: "The Microsoft Entra error reference lists it as InvalidTenantName: the tenant name was not found in the data store, so check that you have the correct tenant ID. The application developer receives this error if the app tries to sign in to a tenant that Microsoft cannot find."
  - q: "What are the two causes Learn names?"
    a: "First, a cross-cloud app used against the wrong cloud. Second, the developer tried to sign in to a tenant derived from an email address, but the domain is not registered."
  - q: "What are the sign-in endpoints for each cloud?"
    a: "Per Learn: global service login.microsoftonline.com, US Government login.microsoftonline.us, and China operated by 21Vianet login.partner.microsoftonline.cn. Each national cloud authenticates users separately and has separate endpoints."
  - q: "Where do I put the tenant in a single-tenant app?"
    a: "In the authority URL. Learn says for single-tenant applications to replace common in the authorization and token endpoint URLs with your tenant ID or name, for example https://login.microsoftonline.com/contoso.com."
  - q: "How do I find the tenant ID?"
    a: "In the Microsoft Entra admin center sign in as at least Global Reader and go to Entra ID, Overview, Properties, then scroll to Tenant ID. In the Azure portal go to Microsoft Entra ID, Properties. You can also use Get-AzTenant in Azure PowerShell or az account tenant list in the Azure CLI."
---

AADSTS90002, named InvalidTenantName, means Microsoft Entra could not find the tenant that your sign-in request points to. The Microsoft Entra error reference says the tenant name was not found in the data store, and to check that you have the correct tenant ID. It names two causes: a cross-cloud app used against the wrong cloud, and a tenant derived from an email address whose domain is not registered. So the checks are two: which cloud endpoint the request uses, and which tenant value it carries.

## What the reference says

The reference entry reads as follows in substance. The tenant name was not found in the data store. The application developer receives this error if the app attempts to sign in to a tenant that Microsoft cannot find. Often, this is because a cross-cloud app was used against the wrong cloud, or the developer attempted to sign in to a tenant derived from an email address, but the domain is not registered.

The reference row gives no further steps for this code. The fixes below come from the Learn pages on national clouds and on finding the tenant ID, plus my own advice where marked.

## Cause 1: the wrong cloud

Microsoft Entra ID is deployed in the global Azure cloud and in national clouds. Learn lists Azure Government and Microsoft Azure operated by 21Vianet, and says Azure Germany closed on October 29, 2021. Each cloud instance is separate, with its own environment and endpoints. All national clouds authenticate users separately in each environment.

| Cloud | Sign-in endpoint | Azure portal |
| --- | --- | --- |
| Global service | `https://login.microsoftonline.com` | `https://portal.azure.com` |
| US Government | `https://login.microsoftonline.us` | `https://portal.azure.us` |
| China operated by 21Vianet | `https://login.partner.microsoftonline.cn` | `https://portal.azure.cn` |

What to check:

1. **Which endpoint does the app call?** Open the authorization or token URL in the app configuration or the failing request. Learn says to use the endpoints for the cloud instance where you deploy the application.
2. **Where does the tenant live?** Because each cloud authenticates users separately, a request sent to the wrong cloud's endpoint can point at a tenant that this cloud does not hold. That is my reading, and it fits the reference description of an app used against the wrong cloud.
3. **Was the app registered in the right portal?** Learn says that to integrate an application with the Microsoft identity platform in a national cloud, you must register it separately in the Azure portal specific to that environment. An app registered only in the global portal does not exist in another cloud.
4. **Read the endpoints from the registration.** In the Microsoft Entra admin center, sign in as at least a Cloud Application Administrator, go to **Entra ID** > **App registrations**, select the app and then **Endpoints**. Learn says to use the endpoint that matches the protocol you use, together with the **Application (client) ID**.

Learn also says some services and features in the global Azure cloud might be unavailable in national clouds, and links Products available by region.

## Cause 2: a tenant value that does not resolve

The second named cause is a tenant derived from an email address, for example taking the part after the at sign and using it as the tenant value, when that domain is not registered.

Learn's endpoint guidance explains where the tenant value goes. The common endpoints look like `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` and `https://login.microsoftonline.com/common/oauth2/v2.0/token`. For single-tenant applications, replace `common` with your tenant ID or name, for example `https://login.microsoftonline.com/contoso.com`.

What to check:

1. **Print the exact authority.** Look at the string between the host and `/oauth2/v2.0`. Check it for typos, extra spaces and a domain that you assumed from an email address.
2. **Prefer the tenant ID.** A domain name only works if it is registered with a tenant. The tenant ID is a stable value. This is my advice, not a Learn statement.
3. **Find the tenant ID.** Learn gives these ways:
   - Entra admin center: sign in as at least Global Reader, go to **Entra ID** > **Overview** > **Properties** and read **Tenant ID**.
   - Azure portal: **Microsoft Entra ID** > **Properties** > **Tenant ID**.
   - Azure PowerShell: `Connect-AzAccount` then `Get-AzTenant`.
   - Azure CLI: `az login`, `az account list` or `az account tenant list`. These return the `tenantId` for each of your subscriptions.
   - Microsoft 365 CLI: `m365 tenant id get`.

## Cases the reference does not describe

The error entry says the developer receives the error. If an end user sees it in a third-party tool, the likely path is the same, but the fix sits in that tool's configuration: the cloud setting and the tenant field. I would collect the exact URL from the browser address bar of the failed sign-in page, because it shows the endpoint host and the tenant value in the request. That is an inference on my part.

## A short decision path

This is my own summary.

1. Read the host in the failing URL. Does it match the cloud where the tenant lives?
2. Read the tenant segment. Is it `common`, an ID or a domain?
3. If it is a domain, confirm that it belongs to a tenant in that cloud. If you are not sure, replace it with the tenant ID.
4. If the app is meant for a national cloud, confirm the app is registered in that cloud's portal.
5. Retest. If it still fails, copy the full error text with the trace ID and timestamp for support.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Tenant restrictions](https://www.m365.fm/entity/tenant-restrictions/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft Entra authentication & national clouds - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/authentication-national-cloud)
- [How to find your tenant ID - Microsoft Entra (Microsoft Learn)](https://learn.microsoft.com/entra/fundamentals/how-to-find-tenant)
