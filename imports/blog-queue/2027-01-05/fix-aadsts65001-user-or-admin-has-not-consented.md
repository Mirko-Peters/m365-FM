---
title: "Fix AADSTS65001: The User or Administrator Has Not Consented to Use the Application"
summary: "Fix AADSTS65001 in Microsoft Entra: how to read the sign-in request, check user consent settings, service principals and assignment, grant admin consent, and read the audit log. Based on Microsoft Learn troubleshooting guidance."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [entra-id]
keypoints:
  - "Learn does not map AADSTS65001 to one cause. It lists scenarios such as disabled user consent, Assignment required, missing service principals and scopes that need admin consent."
  - "Start by capturing the sign-in request and noting client_id, scope, resource and prompt."
  - "Check Enterprise applications > Consent and permissions and the application's Properties > Assignment required."
  - "Learn names Global Administrator, Company Administrator or Application Administrator for admin consent."
  - "Adding permissions to an app registration does not consent to them. A leftover prompt=consent parameter can keep causing errors."
faq:
  - q: "What does AADSTS65001 say?"
    a: "The message reads: The user or administrator has not consented to use the application with ID and name. Send an interactive authorization request for this user and resource."
  - q: "What are the usual causes?"
    a: "Microsoft Learn lists missing User.Read permission, user consent disabled in the tenant, Assignment required on the app, no service principal for the client or the resource, prompt=admin_consent or prompt=consent in the request, unconsented scopes, scopes that need admin consent, and user consent blocked for risky applications."
  - q: "Who can grant admin consent?"
    a: "Learn names Global Administrator, Company Administrator or Application Administrator. Application permissions always need consent from a Global or Company Administrator."
  - q: "Where do I check whether users may consent?"
    a: "Per Learn, in the Azure portal go to Microsoft Entra ID > Enterprise applications > Consent and permissions and review User consent for applications."
  - q: "Why does the error persist after I consented?"
    a: "Learn lists a leftover prompt=consent or prompt=admin_consent parameter, and notes that consenting for the organization does not give access to all users when Assignment required is on."
---

AADSTS65001 means the sign-in request needs consent that nobody has given yet. The fix depends on why. Capture the request, check the tenant's user consent setting, check whether the app exists as an enterprise application and whether assignment is required, then grant admin consent if needed. This guide follows the Microsoft Learn troubleshooting article on consent issues and, for related codes, the page on the consent experience.

## The error

Learn quotes the message: The user or administrator has not consented to use the application with ID and name. Send an interactive authorization request for this user and resource.

The troubleshooting article does not tie this code to one cause. It lists scenarios for admin approval or consent errors:

- The **User.Read** permission is missing.
- User consent is disabled at the tenant level.
- **Assignment required** is on for the application.
- No service principal exists in the tenant for the client application.
- No service principal exists in the tenant for the resource.
- The request uses `prompt=admin_consent` or `prompt=consent`.
- The request asks for scopes that are not consented.
- A scope or permission needs admin consent.
- User consent is blocked for risky applications.

## Troubleshooting steps from Learn

1. **Get the sign-in request.** Read it from the browser address bar or capture it with a tool such as Fiddler. Note `client_id`, `scope`, `resource` and `prompt`.
2. **Check user consent settings.** In the Azure portal go to **Microsoft Entra ID** > **Enterprise applications** > **Consent and permissions** and review **User consent for applications**. With **Allow user consent for apps**, users can consent to permissions that do not need admin consent, so continue. With **Do not allow user consent**, users always see Need admin approval and an admin must consent.
3. **Verify the application exists.** Under **Enterprise applications**, set **Application Type** to **All Applications** and search for the app ID. If it is missing, admin consent is needed.
4. **Check assignment.** Open the app, go to **Manage** > **Properties** and review **Assignment required**. If it is on, an admin must consent.
5. **Compare permissions.** Compare the app's **Permissions** pane with the scope in the request. Missing scopes need consent. `openid`, `email`, `profile` and `offline_access` usually are not listed on enterprise applications.
6. **Verify the resource.** Test an authorize request with the app ID and resource URI. Errors such as AADSTS650052, AADSTS650057 and AADSTS500011 point to resource or subscription problems.
7. **Remove the prompt parameter.** After consent is granted, a leftover `prompt=consent` or `prompt=admin_consent` can cause repeated errors.

## Grant admin consent

Learn names the roles **Global Administrator**, **Company Administrator** and **Application Administrator**.

1. Have the administrator open the application's sign-in page.
2. If the consent screen appears, review the permissions and select **Consent on behalf of your organization**.
3. If no consent screen appears, add `&prompt=consent` to the sign-in address. If the permissions are not in the app registration, Learn shows a v2 endpoint address that lists each scope in the `scope` parameter.
4. Alternatively use the admin consent URL form `https://login.microsoftonline.com/<Tenant-ID>/adminconsent?client_id=<App-ID>`. The permissions must already be configured in the app registration.

## Caveats from Learn

- With **Assignment required** on, consenting for the organization does not give access to all users. Only assigned users can use the app. The article's workaround is to turn Assignment required off, let users consent, then turn it back on.
- Only the application owner can add permissions to the app registration.
- Adding permissions to an app registration is not consent. Consent requires assigning permissions to the service principal.
- Application permissions always need consent from a Global or Company Administrator and must be added in the owning tenant's app registration.
- Application administrators can consent to delegated permissions that need admin consent.
- Understand a permission before you consent. For third-party apps, work with the vendor.
- For risky-app blocks, such as `UserConsentBlockedForRiskyAppsException`, admin consent is required even when user consent is generally allowed.
- SAML-based apps can show similar errors but need different fixes.

## Read the audit log

Go to **Microsoft Entra ID** > **Audit logs** and filter by **Category: ApplicationManagement**, **Status: Failure** and **Activity: Consent to application**. Open the entry and read **Status reason**. A role such as Global Administrator or Security Reader is needed.

## Related codes from the consent experience page

| Code | Meaning on the page |
| --- | --- |
| AADSTS90093 and AADSTS90094 | A non-admin user requests permissions only an admin can grant, or user consent is turned off |
| AADSTS90090 | A transient failure recording consent. Retry later |
| AADSTS65005 | The resource is not available in the tenant, or the request does not match the app registration |
| AADSTS900941 and AADSTS900981 | Admin consent is required because the app is considered risky |
| AADSTS65004 | The user declined consent |

## What the pages do not cover

The consent experience page does not mention AADSTS65001. The troubleshooting article gives no PowerShell, Graph or CLI commands and does not describe the admin consent workflow settings. It names no role for changing the user consent setting.

## Typical mistakes

- Granting consent to a user but not for the organization.
- Forgetting Assignment required.
- Testing with a stale sign-in link that still has a prompt parameter.
- Consenting to a permission nobody has reviewed.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Troubleshoot consent issues in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/troubleshoot-consent-issues)
- [Microsoft Entra application consent experience (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/application-consent-experience)
