---
title: "Fix AADSTS50020: User Account From an External Identity Provider Does Not Exist in the Tenant"
summary: "AADSTS50020 means a guest or external account is not in the tenant it tries to reach. Eight causes from Microsoft Learn with the fix for each: personal accounts, single-tenant app registration, wrong endpoint, wrong tenant session, missing invite, user assignment, ROPC and re-created users."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [entra-id, b2b-collaboration, guest-access, app-registration]
keypoints:
  - "AADSTS50020 is returned when a guest user from an identity provider cannot sign in to a resource tenant. The account must exist there as an external user."
  - "Read the User account and Identity provider values in the error. They show which account and which IdP the user actually signed in with."
  - "A single-tenant app registration rejects users from other directories. Learn says signInAudience cannot be changed in the manifest, so re-create the registration."
  - "Use the endpoint that matches the app type: organizations, common or consumers, and not a tenant-specific URL for multitenant sign-in."
  - "If a guest was deleted and the home tenant re-created the same user name, reset the redemption status of the guest account."
faq:
  - q: "What does AADSTS50020 mean?"
    a: "The reference row says the user account from an identity provider does not exist in the tenant and cannot access the application in that tenant. The account needs to be added as an external user first, or the user should sign in with a different Microsoft Entra account. If the user should be a member, they should be invited through the B2B system."
  - q: "Where do I see which account and identity provider were used?"
    a: "In the error message itself, in the User account and Identity provider values. Learn also says the home tenant sign-in logs can show a failure with the 90072 code and the same text."
  - q: "Why does an app registration cause this error?"
    a: "If the registration is a single-tenant account type, users from other directories or identity providers cannot sign in. Check signInAudience in the manifest for AzureADandPersonalMicrosoftAccount, AzureADMultipleOrgs or PersonalMicrosoftAccount. Learn says you currently cannot change signInAudience in the manifest, so you re-create the registration with the correct account type."
  - q: "Which sign-in URL should my app use?"
    a: "Learn lists https://login.microsoftonline.com/organizations for multitenant apps, /common for multitenant and personal accounts, and /consumers for personal accounts only, set in the Authority setting. A tenant-specific URL means users from other organizations must be guests in that tenant."
  - q: "A guest was deleted and re-created and now fails. What should I do?"
    a: "Learn describes the case where the user name of a deleted guest was re-created by the home tenant administrator. Compare the creation dates with Microsoft Graph, Entra PowerShell or Graph PowerShell. If the guest was created before the home tenant account, reset the redemption status of the guest account, which avoids deleting and re-creating it."
---

AADSTS50020 is an identity mismatch error. The account that signs in is real, but it does not exist in the tenant that it is trying to reach, or it comes from an identity provider that the tenant does not expect. The Microsoft Learn error reference gives the one-line meaning. A longer Learn troubleshooting page lists eight causes, and this article uses that list. It also starts with a short triage, since the error text already tells you a lot.

## What the error says

The reference row for AADSTS50020 (UserUnauthorized) says that the user account from an identity provider does not exist in the tenant, so it cannot access the application there. The account needs to be added as an external user in the tenant first. Or the user signs out and signs in again with a different Microsoft Entra account. If the user should be a member of the tenant, they should be invited through the B2B system.

On the user's screen the message looks like this:

> AADSTS50020: User account 'user@domain.com' from identity provider {IdentityProviderURL} does not exist in tenant {ResourceTenantName}.

Learn adds that the home tenant's sign-in logs may show a failure with a 90072 code and a longer message with the same meaning.

## Step 1: Triage with the error text

Look at the **User account** and **Identity provider** values in the message and ask whether they are the expected combination. Learn's questions: did the user sign in with their organization account to your tenant instead of their home tenant, or did they sign in to the `live.com` provider with a different personal account than the one that was invited? That points to cause 4. If the values are as expected, cause 4 is unlikely (my reading), and the other causes come next.

## The eight causes

### Cause 1: A personal Microsoft account signs in to the Entra admin center

Signing in to the Microsoft Entra admin center with a personal account (Outlook, Hotmail or OneDrive) connects you to the Microsoft Services tenant by default, which has no linked directory for actions. Learn says this is expected, and that in the earlier experience a directory was created and linked to the personal account, but the behavior has changed.

**Fix:** create an Azure account with a new tenant. Browse to the Azure account page, select **Try Azure for free** and follow the instructions. A tenant is generated, and you become its Global Administrator.

### Cause 2: Unsupported account type in the app registration

If the registration is a single-tenant account type, users from other directories or identity providers cannot sign in.

**Fix:**

1. In the Azure portal, open **App registrations** and your app.
2. Select **Manifest** and find **signInAudience**.
3. Check for one of: **AzureADandPersonalMicrosoftAccount**, **AzureADMultipleOrgs**, **PersonalMicrosoftAccount**.
4. If it has none of these, re-create the app registration with the correct account type, because you currently cannot change **signInAudience** in the manifest.

### Cause 3: Wrong endpoint

If the supported account type is multitenant, multitenant plus personal, or personal only, the authentication call must target a matching URL. With `https://login.microsoftonline.com/<YourTenantNameOrID>`, users from other organizations cannot access the app unless they are guests in that tenant, and the authentication runs on your tenant only.

| Application type | Sign-in URL |
| --- | --- |
| Multitenant applications | `https://login.microsoftonline.com/organizations` |
| Multitenant and personal accounts | `https://login.microsoftonline.com/common` |
| Personal accounts only | `https://login.microsoftonline.com/consumers` |

Apply the value in the `Authority` setting of your application code.

### Cause 4: Signed in to the wrong tenant

Users arrive by a direct link or through myapps.microsoft.com and may already have an active session with a different account than intended, for example an organization account when a personal guest account was meant, or the reverse.

**Fix:** have the user sign out, then sign in again from a new in-private browser session or a different browser.

### Cause 5: The guest was not invited

**Fix:** invite the guest user. Learn points to its quickstart for adding guest users in the Azure portal.

### Cause 6: The app requires user assignment

For an enterprise application that requires user assignment, the error occurs when the user is not on the assigned list.

**Check:** in the Azure portal open **Enterprise applications**, select the app, open **Properties** and see whether **Assignment required** is set to **Yes**.

**Fix:** assign the user individually, or through an assigned group or dynamic group. Learn links its pages on assigning a user account and on managing access to an application.

### Cause 7: ROPC flow with personal accounts

The Microsoft identity platform supports the resource owner password credentials (ROPC) flow only within Entra tenants, not for personal accounts. Personal accounts that are invited to a tenant cannot use ROPC.

**Fix:** use a tenant-specific endpoint, `https://login.microsoftonline.com/<TenantIDOrName>`, or the organization's endpoint.

### Cause 8: A deleted user name was re-created by the home tenant

This happens when the name of a guest deleted in the resource tenant is re-created by the home tenant administrator.

**Verify:** compare the creation dates of the guest in the resource tenant and the user in the home tenant. The case is confirmed if the guest was created before the home tenant account. Learn gives three ways:

- Microsoft Graph: `GET https://graph.microsoft.com/v1.0/users/{id | userPrincipalName}/createdDateTime`
- Microsoft Entra PowerShell: `Get-EntraUser -UserId {id | userPrincipalName} | Select-Object id, userPrincipalName, createdDateTime`
- Microsoft Graph PowerShell SDK: `Get-MgUser` with the Id, UserPrincipalName and CreatedDateTime properties.

**Fix:** reset the redemption status of the guest user account in the resource tenant. You keep the guest object and do not need to delete and re-create it. Learn says you can reset it in the Azure portal, Azure PowerShell or the Microsoft Graph API.

## Check order (my advice)

This is my suggestion, not an order from the page:

1. Read the account and identity provider in the error, and compare with who should sign in.
2. For one user, check cause 5 and cause 6 first, since they are quick to verify in the tenant. Then ask for a private browser session (cause 4).
3. For many users of one app, check the registration type and the endpoint (causes 2 and 3).
4. For a guest who worked before and now fails after a clean-up, think about cause 8.
5. Write down which cause it was, so the next ticket is short.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Guest access](https://www.m365.fm/entity/guest-access/)
- [Application registration](https://www.m365.fm/entity/app-registration/)

## Sources

- [Error AADSTS50020 - User account from identity provider does not exist in tenant (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50020-user-account-identity-provider-does-not-exist)
- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
