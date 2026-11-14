---
title: "Fix AADSTS500021: Access to the Tenant Is Denied by Tenant Restrictions"
summary: "AADSTS500021 means the tenant restriction feature is active and the user tried to reach a tenant that is not in the Restrict-Access-To-Tenants allow list. Check the proxy header, the allowed tenant list, the Entra tenant restrictions report and B2B scenarios."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [entra-id, tenant-restrictions, cross-tenant-access-settings]
keypoints:
  - "Learn says AADSTS500021 indicates tenant restrictions are configured and the user is trying to reach a tenant that is not in the allowed list from the Restrict-Access-To-Tenants header."
  - "The header is added by your proxy to traffic to login.microsoftonline.com, login.microsoft.com and login.windows.net, together with Restrict-Access-Context."
  - "The allow list takes tenant domains or directory IDs, comma separated without white space, and must include every tenant your users legitimately need, such as B2B partners."
  - "Admins can review blocked sign-ins in the Entra admin center under Entra ID, Overview, Tenant restrictions, with personal data masked for other tenants."
  - "Azure RMS and Office Message Encryption are incompatible with this feature because they sign users in to other tenants for decryption keys."
faq:
  - q: "What does AADSTS500021 mean?"
    a: "The Microsoft Entra error reference says it indicates that the tenant restriction feature is configured and that the user is trying to access a tenant that is not in the list of allowed tenants specified in the Restrict-Access-To-Tenant header. The error text names the tenant that was denied."
  - q: "Who causes the error: Microsoft or my network?"
    a: "The restriction is configured in your own proxy infrastructure, not in the Entra service. Learn says that when the Restrict-Access-To-Tenants header is present, Microsoft Entra issues security tokens only for the permitted tenants, and the proxy must insert the header into traffic to the Entra sign-in endpoints."
  - q: "How do I allow another tenant?"
    a: "Add it to the Restrict-Access-To-Tenants header value on the proxy. Learn says the value is a comma-separated list without white space, and each tenant can be named by a registered domain or by its directory ID, for example contoso.com,fabrikam.onmicrosoft.com and a GUID."
  - q: "Where can I see which sign-ins were blocked?"
    a: "In the Microsoft Entra admin center, sign in as at least Global Reader and go to Entra ID, Overview, Tenant restrictions. The report shows sign-ins blocked by the policy for the tenant named in Restrict-Access-Context. Learn says you must use your own directory ID there to get the logs."
  - q: "Which clients enforce it?"
    a: "Learn says Microsoft 365 browser-based apps support tenant restrictions, and thick clients such as Outlook, Word and Excel enforce them only with modern authentication. Teams supports only modern authentication. Platforms that cannot break and inspect TLS traffic, such as Android 7.0 and later with user certificates, cannot use the feature."
---

AADSTS500021 means a user's sign-in request went to a tenant that is not on your organization's allowed list. Microsoft's error reference says the tenant restriction feature is configured and the user tried to access a tenant that is not in the list in the `Restrict-Access-To-Tenant` header. So the error is often a working policy, not a fault. The fix is to confirm whether the user should have access to that tenant, then change the allow list on your proxy if so. This guide uses the Learn page on tenant restrictions, which the error reference links.

## What the feature does

Learn says tenant restrictions let organizations control access to SaaS cloud applications based on the Microsoft Entra tenant the applications use for single sign-on. Organizations specify the list of tenants that users on their network may access. Microsoft Entra ID then grants access only to those tenants, and all others are blocked, even tenants where users are guests.

The page focuses on Microsoft 365 but says the feature protects all apps that send the user to Microsoft Entra ID for single sign-on.

## How the pieces fit

Learn lists four components:

1. **Microsoft Entra ID.** If the `Restrict-Access-To-Tenants: <permitted tenant list>` header is present, Entra only issues security tokens for the permitted tenants.
2. **On-premises proxy server infrastructure.** A proxy capable of TLS inspection that inserts the header into traffic destined for Entra ID.
3. **Client software.** Clients must request tokens directly from Entra so the proxy can intercept traffic. Browser-based Microsoft 365 apps and Office clients using modern authentication support it.
4. **Modern authentication.** Cloud services must use it for the block of nonpermitted tenants to work.

TLS inspection is needed only on traffic to Microsoft Entra ID, not on traffic to the Microsoft 365 cloud services. The feature requires Microsoft Entra ID P1 or P2 licenses.

## Reading the error

The end user sees a message that they are trying to access a resource that belongs to an organization unapproved by their IT department. Learn's example: a user on the Contoso network tries to reach the Fabrikam instance of a shared SaaS application such as Outlook online, and Fabrikam is not a permitted tenant.

## Check the proxy configuration

If you administer the proxy, check these points from Learn.

**Which hosts get the headers.** For each outgoing request to `login.microsoftonline.com`, `login.microsoft.com` and `login.windows.net`, the proxy inserts two headers: `Restrict-Access-To-Tenants` and `Restrict-Access-Context`.

**The allow list value.** A comma-separated list of tenants, with no white space. Any domain registered with a tenant can identify it, and so can the directory ID. Learn's example: `Restrict-Access-To-Tenants: contoso.com,fabrikam.onmicrosoft.com,aaaabbbb-0000-cccc-1111-dddd2222eeee`.

**The context value.** A single directory ID that declares which tenant sets the policy. Learn says to use your own directory ID, or the sign-in logs appear in someone else's tenant with all personal information removed.

**Validate a domain against an ID.** Open `https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration` with the domain and then the ID. If the results are the same, they refer to the same tenant.

**Do not inject for device endpoints.** Learn warns against including subdomains under `*.login.microsoftonline.com`, because that includes `device.login.microsoftonline.com` and interferes with client certificate authentication used in device registration and device-based Conditional Access. Exclude `device.login.microsoftonline.com` and `enterpriseregistration.windows.net` from TLS break-and-inspect and header injection.

**Prevent user-set headers.** The proxy should replace the `Restrict-Access-To-Tenants` header if it already exists in the incoming request, and clients must be forced to use the proxy for those hosts.

To find your directory ID, sign in to the Entra admin center as at least Global Reader and go to **Entra ID** > **Overview** > **Properties**, then copy **Tenant ID**.

## Find who was blocked

In the Entra admin center, as at least Global Reader, go to **Entra ID** > **Overview** > **Tenant restrictions**. The admin of the tenant named in `Restrict-Access-Context` sees blocked sign-ins, including the identity and the target directory ID. For users from other tenants, user data such as name and user principal name are masked. You can filter by time, user, application, client or status, and add columns such as **IP Address**, **Client**, **Location** and **Target tenant ID**.

## Cases that surprise people

- **B2B partners and other tenants.** If you use SaaS apps with a different Entra tenant than the one used by Microsoft 365, make sure all required tenants are permitted. Learn names B2B collaboration as an example.
- **Azure RMS and Office Message Encryption.** Learn says these features are not compatible, because they sign users in to other tenants to get decryption keys. Encrypted mail and documents from untrusted tenants are not accessible.
- **Legacy protocols.** Outlook and Skype for Business clients that support modern authentication might still use legacy protocols against tenants where modern authentication is not enabled, which can bypass the restriction. Applications using legacy protocols may be blocked if they contact the Entra sign-in hosts.
- **Platforms that cannot inspect TLS.** Android 7.0 and later treat user certificates differently, and Microsoft client apps ignore user certificates by default, so the proxy certificate is not trusted and the feature does not work. Learn lists other Entra controls for such environments.
- **Consumer accounts.** A separate header, `sec-Restrict-Tenant-Access-Policy: restrict-msa`, goes to `login.live.com` to block consumer apps. It does not block B2B authentication of consumer accounts or user-less device traffic, which the allow list controls instead. Learn says consumer authentication does not appear in the admin logs.

## Test before widening or tightening

Learn describes two test methods. A host-based approach uses Fiddler, a web debugging proxy, with custom rules that insert the headers for the three Entra hosts. A staged rollout uses PAC files to point test users to a test proxy while others stay on production, or proxy groups where your proxy supports them.

## What I would do first

This is my own advice, not a Microsoft statement.

1. Read the denied tenant name from the error text.
2. Ask whether the user has a business reason to reach that tenant. If not, the policy is working.
3. If yes, add the tenant by domain or ID to the allow list at the proxy, check the commas and white space, and test with one user.
4. Use the Tenant restrictions report to see how many other users hit the same target tenant, which tells you whether you need a policy change or a single exception.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Tenant restrictions](https://www.m365.fm/entity/tenant-restrictions/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)

## Sources

- [Use tenant restrictions to manage access to SaaS apps - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/tenant-restrictions)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
