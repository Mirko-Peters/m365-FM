---
title: "Fix AADSTS50001: InvalidResource, the Resource Is Disabled or Does Not Exist"
summary: "AADSTS50001 (InvalidResource) says the resource is disabled or does not exist and tells you to check the exact resource URL in your app code. Learn how resource identifiers, scope strings and the .default scope are built, and which spots in your request to check."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [entra-id, oauth-2-0, access-token]
keypoints:
  - "The Entra error reference names AADSTS50001 InvalidResource: the resource is disabled or does not exist, so check the exact resource URL in your code."
  - "Every web-hosted resource has a resource identifier, or application ID URI, and scopes are built by appending a permission to it."
  - "If the resource identifier is left out of the scope parameter, the platform assumes Microsoft Graph."
  - "For client credentials requests, the scope must be the resource plus slash .default, and combining .default with dynamic scopes causes an error."
  - "A trailing slash in a resource URI can matter: Learn's example for Azure Resource Manager needs a double slash before .default."
faq:
  - q: "What does AADSTS50001 mean?"
    a: "The Microsoft Entra error code reference lists it as InvalidResource: the resource is disabled or does not exist. It tells you to check your app code to make sure you specified the exact resource URL for the resource you are trying to access."
  - q: "Where is the resource named in my request?"
    a: "In the scope parameter on the v2.0 endpoint, as the resource identifier followed by a permission or .default. On the v1.0 endpoint the resource parameter carries it. Learn says scope equal to resource identifier slash .default is functionally the same as the resource parameter on v1.0."
  - q: "What if I leave the resource out of the scope?"
    a: "Learn says that in requests to the authorization, token or consent endpoints, an omitted resource identifier means Microsoft Graph. So scope equal to User.Read is the same as the Graph URL plus User.Read."
  - q: "Does a trailing slash matter?"
    a: "Learn says it can. Some resource URIs end with a slash, and then the slash must be present when you request the token. Its example is Azure Resource Manager, which needs a double slash before .default."
  - q: "Does the reference page give more causes than the row?"
    a: "No. The row names the code and the instruction to check the resource URL. The scope and resource explanations in this article come from Learn's page on scopes and permissions, which does not mention AADSTS50001 itself."
---

AADSTS50001 is named InvalidResource in the Microsoft Entra error reference: the resource is disabled or does not exist, and you should check your app code to make sure you specified the exact resource URL for the resource you want to access. The reference row stops there. To find what is wrong with a request, you need to know how a resource is identified, so this article combines that row with Learn's page on scopes and permissions.

## What the reference row says

The row for AADSTS50001 reads: InvalidResource - The resource is disabled or doesn't exist. Check your app's code to ensure that you have specified the exact resource URL for the resource you're trying to access.

The wording allows two situations: the resource really is disabled or missing, or the request names it incorrectly. My reading: the second half of the sentence points at the second one, because the instruction is to check the resource URL in code. The reference does not give a list of causes, so the rest of this article is about how the URL gets into a request.

## How a resource is identified

Learn's page on scopes says every web-hosted resource that integrates with the Microsoft identity platform has a resource identifier, also called the application ID URI. Its examples:

- Microsoft Graph: `https://graph.microsoft.com`
- Microsoft 365 Mail API: `https://outlook.office.com`
- Azure Key Vault: `https://vault.azure.net`

Permissions, called scopes in OAuth 2.0, are strings made by appending the permission to the resource identifier. Learn's example is `https://graph.microsoft.com/Calendars.Read`.

A request that names a resource identifier the platform cannot match to a resource is the situation the error row describes. The page does not say this in so many words, so it is my reading.

## Places in a request that name the resource

Learn describes several forms. Check each one that your app uses:

1. **The scope parameter.** On the v2.0 endpoint, the scope carries the resource identifier plus a permission.
2. **The .default scope.** The value is the identifier URI plus a slash and `.default`. For a resource at `https://contoso.com`, that is `https://contoso.com/.default`.
3. **The resource parameter on v1.0.** Learn says that `scope={resource-identifier}/.default` is functionally the same as `resource={resource-identifier}` on the v1.0 endpoint.
4. **An omitted resource.** In requests to the authorization, token or consent endpoints, if the resource identifier is omitted from the scope, the resource is assumed to be Microsoft Graph. So `scope=User.Read` equals `https://graph.microsoft.com/User.Read`.

Point 4 matters for debugging. If your app should call another API but the scope has only a bare permission name, Learn says the resource is assumed to be Microsoft Graph, not the API you meant. My reading: that mismatch can show up as a different failure than you expect.

## Client credentials and .default

Learn says a client credentials request must include `scope={resource}/.default`, and that requesting individual application permissions in that flow is not supported. The page also says clients cannot combine static `.default` consent with dynamic consent in one request. Its example, `scope=https://graph.microsoft.com/.default Mail.Read`, results in an error because it mixes scope types.

That is a different error from AADSTS50001, but both come from a malformed scope string, so check the whole scope parameter when you check the resource URL.

## The trailing slash

Learn warns that some resource URIs end in a forward slash. The slash can cause problems with token validation, mainly for Azure Resource Manager at `https://management.azure.com/`. In that case the slash must be present when the token is requested, so with `.default` you request `https://management.azure.com//.default`, with a double slash. Learn adds a general hint: if a token is issued but the API rejects it, consider adding a second slash and trying again.

The page describes this as a token validation problem, not as AADSTS50001, so treat it as one more place where an exact string matters.

## A checking order

This section is my advice, not a Microsoft statement.

1. **Print the scope or resource value your app really sends.** Do this from the network trace, not from the configuration you think it uses.
2. **Compare it with the resource identifier of the API.** Compare character by character, including scheme, host, path and trailing slash.
3. **Check for environment mix-ups.** An identifier copied from a test API may not exist in the tenant where the app now runs.
4. **Check that the resource exists in the tenant.** The row says the resource can be disabled or missing. Ask the API owner whether the service principal for that API exists and is enabled in the tenant you sign in to. Learn's reference row does not describe how to look this up.
5. **Fix the scope format.** Use the identifier plus `.default` for client credentials, and do not mix `.default` with named scopes.
6. **Retry and read the new message.** If the code changes, you have fixed one problem and found the next.

## What the pages do not cover

The reference row for AADSTS50001 is one sentence and lists no causes or steps. Learn's scopes page covers resource identifiers, `.default` and the trailing slash, but it does not mention AADSTS50001. How to register a web API, define app roles or check a service principal is covered on separate Learn pages.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Access token](https://www.m365.fm/entity/access-token/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Scopes and permissions in the Microsoft identity platform - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/scopes-oidc)
