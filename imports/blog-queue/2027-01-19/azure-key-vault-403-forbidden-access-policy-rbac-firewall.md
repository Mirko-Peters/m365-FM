---
title: "Azure Key Vault 403 Forbidden: Access Policy, RBAC or Firewall?"
summary: "A 403 from Key Vault means the caller is authenticated but not allowed. Learn names two causes, no access policy for the identity or a request IP that the Key Vault firewall does not approve, and recommends logging to tell them apart. A step-by-step guide to 401, 403 and 429 differences."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [azure-key-vault, azure-rbac, managed-identity]
keypoints:
  - "A 403 means the caller was authenticated but is not permitted; Learn lists two causes: no access policy for the identity or an IP address the Key Vault firewall does not approve."
  - "Turn on Key Vault logging to tell whether the firewall or the access policy blocked the request."
  - "The firewall error says the client address is not authorized and the caller is not a trusted service; Azure Web Sites are not a trusted service."
  - "Often the app is not using the client ID or object ID you think it is, so check which identity actually calls the vault."
  - "401 points to token problems and 429 to throttling, so do not treat all three the same way."
faq:
  - q: "What does a 403 from Key Vault mean?"
    a: "The request was authenticated but the caller is not allowed to do the operation. Learn lists two reasons: there is no access policy for the identity, or the IP address of the requester is not approved in the Key Vault firewall."
  - q: "How do I tell the firewall from the access policy?"
    a: "Turn on logging for the vault and look at the logged request. Learn also gives the firewall error text, which says that the client address is not authorized and that the caller is not a trusted service."
  - q: "Which authorization model should I use?"
    a: "The Key Vault access issues page says Azure RBAC is the recommended authorization model. If the vault still uses access policies, make sure the identity has a policy with the needed permissions."
  - q: "Why does it still fail right after I add an identity?"
    a: "Learn says to retry after adding an identity. For groups that contain managed identities, the troubleshooting page says token refresh can take many hours."
  - q: "What is different about 401 and 429?"
    a: "Learn describes 401 as a missing, wrong-resource or expired token, with the resource being https://vault.azure.net, and 429 as throttling, to be handled with backoff or by splitting across vaults."
---

A 403 from Azure Key Vault means the caller was authenticated but is not allowed to do what it asked. Learn's REST error codes page gives two causes: the identity has no access policy, or the requesting IP address is not approved in the Key Vault firewall. Turn on logging to see which one it is. This article follows that page and Learn's troubleshooting article on Key Vault access issues, and separates 403 from 401 and 429.

## The three codes

Learn's REST error code page separates the common failures:

- **401 Unauthorized.** The request has no token, the token is for the wrong resource, or the token has expired. The resource for tokens is `https://vault.azure.net`.
- **403 Forbidden.** Authenticated but not authorized, as described below.
- **429 Too many requests.** Throttling. Use backoff and retries, and if needed spread load across several vaults.

Do not use 403 steps for a 401, because the cause is in the token and not in permissions.

## Cause 1: no permission for the identity

The page says that the identity has no access policy for the operation. Points from Learn's pages:

- Often the app is not using the client ID that the customer thinks it is. Check which identity the app actually uses, for example the system-assigned or user-assigned managed identity or a service principal.
- Check the object ID. The page notes that duplicate names exist, so compare IDs, not display names.
- The page says the Authorized application setting is for the on-behalf-of flow. In my reading, that means it is not the setting to use for a direct caller.
- Right after you add an identity, retry, as the page advises.
- The troubleshooting article says a group that holds managed identities may take many hours to refresh tokens, so test with the identity itself first.
- It also says that redeploying with an ARM template replaces the access policies, so a deployment can remove a policy you added by hand.

On authorization models, the access issues article says Azure RBAC is the recommended model. Whichever model your vault uses, give the identity only the permissions it needs.

## Cause 2: the firewall

The second cause on the REST page is that the requesting IP address is not approved in the Key Vault firewall. The firewall error text reads that the client address is not authorized and the caller is not a trusted service, with the address shown. Learn adds that Azure Web Sites are not a trusted service for the firewall exception.

That means an App Service app may be blocked by the firewall even though it has a policy or role. Compare the address in the error with the vault's network settings.

## Telling them apart

Learn's guidance is to turn on logging. Learn does not say more than that on the page I read, so look at what your log shows for the failing request. If the message mentions the client address, think firewall. If the identity is correct and the address is allowed, think permissions.

## A diagnostic order

This section is my advice, not a Microsoft statement.

1. **Read the exact error.** A message with a client address points to the firewall branch.
2. **Find the real caller.** Print or log the identity the app uses. A wrong client ID explains a surprising number of 403 errors, as Learn hints.
3. **Check the vault's authorization model.** Look at whether it uses RBAC or access policies, then check the matching place.
4. **Check the operation.** Reading a secret, listing keys and getting a certificate need different permissions. Compare what the app calls with what you granted.
5. **Check networking.** Look at whether the firewall is enabled, which networks are allowed and where the request comes from.
6. **Wait and retry once.** Learn mentions retrying after adding an identity, so allow a short time before you conclude it failed.
7. **Look at deployments.** If a template redeployed the vault, check that the policy still exists.
8. **Use the log.** If the cause is still unclear, enable logging and reproduce once.

## Habits that prevent 403 errors

This section is my advice, not a Microsoft statement.

- **Prefer managed identities** for apps in Azure, as the troubleshooting page treats them as the simplest cloud authentication.
- **Grant permissions to the identity directly** while testing, and to groups only after you understand token refresh.
- **Keep the vault configuration in one deployment.** If you use templates, define the access in the template so it is not replaced.
- **Test from the same network as production.** A test from your laptop passes a firewall that the production app does not.
- **Keep logging on** for production vaults, so the next 403 is quick to diagnose.

## What to report to the vault owner

This section is my advice, not a Microsoft statement.

If you are not the vault owner, send them the exact error text, the time of the failure, the identity the app uses (client ID and object ID) and the operation that failed. If the message shows a client address, include it. With these details the owner can check the policy or role and the firewall in a few minutes, instead of guessing which of the two causes applies.

## What I did not read

I read the REST error code page and the Key Vault access issues page. I did not read the pages on configuring the firewall, on the RBAC guide or on the throttling limits in detail, so I give no throttling numbers here and no step-by-step portal paths for those settings.

## Related

- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)

## Sources

- [REST API error codes - Azure Key Vault (Microsoft Learn)](https://learn.microsoft.com/azure/key-vault/general/rest-error-codes)
- [Troubleshooting Azure Key Vault access policy issues (Microsoft Learn)](https://learn.microsoft.com/azure/key-vault/general/troubleshooting-access-issues)
