---
title: "Service Principals in Entra ID: Best Practices and Common Problems"
summary: "What a service principal is, how it differs from an app registration, and the security practices Microsoft documents: managed identities, certificates, least privilege, owners, plus known pitfalls."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [service-principal, entra-id, app-registration, managed-identity]
keypoints:
  - "The application object is the global blueprint in the home tenant. The service principal is the local instance in each tenant that defines what the app can do there."
  - "Microsoft orders credentials from most to least preferred: managed identity, federated credentials, certificates. It says not to use secrets (passwords)."
  - "Request only the least permissive permission, prefer delegated over app-only access, and remove permissions the app no longer needs."
  - "Keep owners to a minimal set, review the owner list every few months, and keep at least two owners per service principal."
  - "Deleted apps and service principals can be restored for up to 30 days. Non-admin users can create at most 250 app and service principal objects, deleted ones included."
faq:
  - q: "What is the difference between an app registration and a service principal?"
    a: "According to Microsoft Learn, the application object (the app registration) is the global representation of an app and lives in its home tenant. The service principal is the local representation in a specific tenant and defines the access policy and permissions there. Registering an app in the portal creates both in the home tenant."
  - q: "Should I use a client secret or a certificate for a service principal?"
    a: "Microsoft's security guidance lists a managed identity as strongly recommended, then federated credentials only from platforms you trust, then certificate credentials if neither is possible. It says not to use password credentials, also called secrets."
  - q: "When should I use a managed identity instead of a service principal?"
    a: "Microsoft Learn lists four conditions: the service runs in Azure, it does not sign in users, it does not act as a web API resource, and it does not need to run in multiple tenants. If all four are true, consider a managed identity. A managed identity is itself a type of service principal that you cannot edit directly."
  - q: "Can I recover a deleted service principal?"
    a: "Per the Microsoft Learn delete and recover FAQ, soft-deleted applications and service principals can be restored for up to 30 days, then they are permanently deleted. Application registrations are restored in the Microsoft Entra admin center. Service principals are restored with PowerShell or Microsoft Graph, because deleted service principals are not shown in the admin center."
  - q: "Why do I get a Directory_QuotaExceeded error when creating apps?"
    a: "The Learn FAQ says a non-admin user can create no more than 250 applications and service principals, and both active and restorable deleted objects count. Deleting objects does not free quota by itself. You must permanently delete them from the deleted items container."
---

A service principal is the identity an application uses inside one Microsoft Entra tenant. It defines what the app can access there. The security practices Microsoft documents are short: prefer managed identities, avoid secrets, grant least privilege, limit owners, and review all of it on a schedule.

This article follows the Microsoft Learn pages on application and service principal objects, app registration security, and deleting and recovering apps. Where those pages disagree or say nothing, that is stated.

## Application object versus service principal

Microsoft describes two objects:

- **Application object.** The global representation of the app. It lives in the tenant where the app was registered, called the home tenant. It works like a template for the service principals created from it.
- **Service principal.** The local representation of the app in one tenant. It is the security principal that defines the app's access policy and permissions in that tenant.

A single-tenant app has one service principal, in its home tenant. A multitenant app has one in its home tenant plus one in each tenant where someone consented to it. Registering an app in the portal creates both objects. If you register through Microsoft Graph, creating the service principal is a separate step.

Changes to the application object are reflected in its service principal only in the home tenant. They do not propagate to service principals in other tenants.

## The three types of service principal

| Type | Linked app object | Can you edit it? |
|---|---|---|
| Application | Yes | Governed by the app object, with tenant-specific settings |
| Managed identity | No | Can be granted access, but not modified directly |
| Legacy | No | Has editable properties such as credentials and reply URLs |

Legacy service principals are used only in the tenant where they were created. In Microsoft Graph the type appears as the `servicePrincipalType` property, where the reference lists more values than these three, including ServiceIdentity (an agent identity) and SocialIdp (for internal use). Microsoft Graph documents that an Application service principal whose app registration is missing does not get tokens issued.

## Create one the documented way

1. Sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator.
2. Go to **Entra ID** > **App registrations** and select **New registration**.
3. Enter a name and choose **Accounts in this organizational directory only** if the app is single tenant.
4. Select **Register**. The service principal is created automatically.

To manage permissions, consent and sign-in information afterwards, use **Enterprise applications**. For Azure access, the same page describes assigning a role at the subscription, resource group or resource scope, with permissions inherited by lower scopes. Choosing the narrowest scope that works is general least-privilege practice, not a requirement stated there.

## Best practices from Microsoft

### Pick the right identity type

Consider a managed identity instead of an app registration when the service runs in Azure, does not sign in users, is not a web API, and does not need multiple tenants.

### Rank your credentials

Microsoft lists the options from most to least preferred. The page does not call this a formal ranking:

1. A managed identity as the credential. Microsoft calls this strongly recommended because it needs no credential management.
2. Federated credentials from a platform you trust. Microsoft advises caution and says to configure federated credentials only from platforms you trust.
3. A certificate. Store it in a key vault such as Azure Key Vault and prefer one from a trusted certificate authority.
4. A secret. The page says: "Don't use password credentials."

Related rules from the same page: use application management policies to limit secret lifetimes or block secrets, put no credentials on public or installed clients, roll credentials over frequently, never share credentials across apps, and avoid many credentials on one app. It also recommends a credential scanner in build pipelines so credentials do not end up in repositories. The page gives no fixed rotation interval.

### Keep redirect URIs under control

Own every redirect URI, watch the DNS records behind them, avoid wildcards and insecure schemes such as http, and trim the list. The page says a lapse in ownership of one URI can lead to application compromise.

### Limit permissions

Request only the least permissive permission, review permissions periodically, and remove ones the app no longer needs. Prefer delegated access over app-only access whenever possible.

### Lock the instance and limit owners

A tenant admin can customize the service principal in any tenant, which can add unexpected changes such as credentials the app owner should control. Microsoft recommends configuring the app instance property lock and locking every sensitive property available. This is especially critical for multitenant apps.

Keep application ownership to a minimal set of people. An administrator should review the owner list once every few months. Microsoft Entra access reviews can automate that. The Microsoft Graph reference adds a recommendation of at least two owners per service principal.

### Use identifier URIs correctly

For apps that receive v1.0 tokens, use only the default URIs, `api://<appId>` and `api://<tenantId>/<appId>`. For v2.0 tokens, `api://<appId>` is the recommended format. The value must be unique in the tenant and must not end with a slash. Resource apps with custom identifier URIs should use the v2.0 access token format.

## Common problems and what the docs say

**Sign-ins are hard to trace.** Entra has separate sign-in logs for service principals and managed identities, apart from user sign-ins. Open the Microsoft Entra admin center as at least a Reports Reader and go to **Entra ID** > **Monitoring & health** > **Sign-in logs**. The page I read does not say which tab shows service principal sign-ins.

**An app stops getting tokens.** Check that the app registration still exists. Also check the `accountEnabled` and `appRoleAssignmentRequired` properties on the service principal. If `accountEnabled` is false, no user can sign in even when assigned. If `appRoleAssignmentRequired` is true, an app role assignment is needed first.

**Quota error on creation.** A non-admin user can create no more than 250 apps and service principals combined. Both active objects and restorable deleted objects count, and you free quota only by permanently deleting from the deleted items container.

**Restore did not bring everything back.** Learn gives two statements. The app objects page says restoring an application object in the App registrations UI does not restore its service principal. The delete and recover FAQ says that if both were deleted, restoring the registration also restores the service principal. Check the result after any restore. The FAQ also says service principal policies cannot be recovered and must be configured again, and provisioning data can take 40 minutes to 1 day to reappear.

**You need to pause an app, not delete it.** Learn describes deactivating an application. It stops new token issuance and keeps the objects for investigation or later reactivation.

## A short review routine

1. List apps with secrets and move them to certificates or managed identities.
2. Remove permissions nobody uses.
3. Check owners and expiry dates.
4. Check that redirect URI domains are still yours.
5. Review service principal sign-in logs for unused apps.

## Related

- [Service principal](https://www.m365.fm/entity/service-principal/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Application registration](https://www.m365.fm/entity/app-registration/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)

## Sources

- [Microsoft Learn: Security best practices for application properties in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/security-best-practices-for-app-registration)
- [Microsoft Learn: Application objects and service principals in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals)
- [Microsoft Learn: Register a Microsoft Entra app and create a service principal](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal)
- [Microsoft Learn: Deleting and recovering applications and service principals](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/delete-recover-faq)
- [Microsoft Learn: servicePrincipal resource type (Microsoft Graph)](https://learn.microsoft.com/en-us/graph/api/resources/serviceprincipal)
- [Microsoft Learn: Sign-in logs in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins)
