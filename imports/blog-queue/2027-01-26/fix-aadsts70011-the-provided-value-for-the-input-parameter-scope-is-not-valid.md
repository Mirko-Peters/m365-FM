---
title: "Fix AADSTS70011: The Provided Value for the Input Parameter Scope Is Not Valid"
summary: "AADSTS70011 (InvalidScope) means the scope the app requested is invalid. The reference row is one line, so this article uses the Learn scopes page to build a checklist: resource format, .default rules, OpenID Connect scopes, trailing slash."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [entra-id, oauth-2-0, graph]
keypoints:
  - "The Microsoft Entra error reference lists AADSTS70011 as InvalidScope and says the scope requested by the app is invalid. It gives no further steps."
  - "The Learn scopes page shows the valid shapes: OpenID Connect scopes, a resource plus permission such as https://graph.microsoft.com/Calendars.Read, or a resource plus .default."
  - "A .default scope cannot be combined with dynamic scopes in one request, and the client credentials flow must use resource/.default."
  - "The address and phone OpenID Connect scopes are not supported. Refresh tokens need an explicit offline_access scope on the v2.0 endpoint."
  - "The page does not tie these cases to AADSTS70011 by name, so the checklist here is my reading, to be confirmed with the sign-in log."
faq:
  - q: "What does AADSTS70011 mean?"
    a: "The Microsoft Entra reference lists it as InvalidScope, with the text that the scope requested by the app is invalid. The row has no resolution steps, so you have to work out which scope value is wrong from the request itself."
  - q: "Where do I see which scope the app sent?"
    a: "In the scope query parameter of the request to the authorize or token endpoint. The app sets it in its code or in its authentication library configuration. The sign-in log shows the error code for the failed attempt. The reference row does not describe a log field, so check the app code and the network trace of the sign-in."
  - q: "Can I mix .default with a normal permission?"
    a: "No. The Learn scopes page says clients cannot combine static consent (.default) and dynamic consent in a single request, and that a scope value such as https://graph.microsoft.com/.default Mail.Read results in an error because it combines scope types."
  - q: "Which scope should a daemon app request?"
    a: "The page says client credentials requests must include scope={resource}/.default, where the resource is the web API the app calls. Requesting individual application permissions in that flow is not supported."
  - q: "Why do I get no refresh token?"
    a: "On the v2.0 endpoint the app must explicitly request offline_access to receive refresh tokens. The page adds that the grant type and the client configuration can also affect whether a refresh token is returned."
---

AADSTS70011 is short and blunt. The Microsoft Entra error reference lists it as InvalidScope: the scope requested by the app is invalid. There are no resolution steps on that row. This article therefore reads the Learn page on scopes and permissions and turns it into a checklist of what a valid scope value looks like. The page does not say which of these mistakes produces AADSTS70011, so where I connect them, I say it is my reading.

## What the reference says

The row reads: AADSTS70011, InvalidScope. The scope requested by the app is invalid.

That is the whole entry. It means the problem sits in the scope value the application sent, not in the user, the password or the device. The fix is in the app code, its authentication library setup or its app registration.

## What a valid scope looks like

The Learn scopes page describes how the Microsoft identity platform builds scope values:

- A permission is a string value. The app requests it in the `scope` query parameter.
- A resource-based permission is the resource identifier (application ID URI) plus the permission value, for example `https://graph.microsoft.com/Calendars.Read` to read calendars in Microsoft Graph.
- If the resource identifier is omitted in requests to the authorization, token or consent endpoints, the resource is assumed to be Microsoft Graph. `scope=User.Read` is the same as `https://graph.microsoft.com/User.Read`.
- The OpenID Connect scopes that are well defined are `openid`, `email`, `profile` and `offline_access`.
- The `.default` scope refers to a resource without naming permissions. It is built from the identifier URI of the resource, a forward slash and `.default`, for example `https://contoso.com/.default`.

Compare your request to these shapes first. A typo in the resource URI or the permission name is the simplest case, and it is also the case I would check before reading anything else.

## Checklist

1. **Read the actual scope string.** Take it from the request to the authorize or token endpoint, not from memory of the code. Check spelling, case and the resource part.
2. **Check unsupported OpenID Connect scopes.** The page says the `address` and `phone` scopes are not supported. If the app asks for them, remove them.
3. **Check the combination of .default and other scopes.** The page says clients cannot combine static (`.default`) and dynamic consent in a single request, and that `scope=https://graph.microsoft.com/.default Mail.Read` results in an error because it combines scope types. Use one style per request.
4. **Check the flow.** The page says `.default` is required in the On-Behalf-Of flow and in the client credentials flow. For client credentials, the request must include `scope={resource}/.default`, and individual application permissions in that flow are not supported.
5. **Check the trailing slash.** Some resource URIs end with a slash, for example `https://management.azure.com/` for Azure Resource Manager. With `.default` you must then request `https://management.azure.com//.default`, with a double slash. The page says that if the token is issued but the API rejects it, try adding a second slash. This is about token validation, so I treat it as a later check, not as a first suspect for AADSTS70011.
6. **Check refresh token expectations.** On the v2.0 endpoint the app must request `offline_access` to receive refresh tokens. This is not an invalid scope case in itself. I list it because it is part of getting the scope list right.

## Consent and admin-restricted permissions

Some permissions are admin restricted. Examples on the page are `User.Read.All`, `Directory.ReadWrite.All` and `Group.Read.All`. If an app requests such a permission from an organizational user, the user gets an error message that says they are not authorized to consent. That is a consent problem, not an invalid scope. The two can look alike in a ticket, so read the exact code on the error page.

The page also explains what `.default` does with consent: it triggers a consent prompt only if no delegated permission was granted between the client and the resource for the signed-in user, or if `prompt=consent` is used. If consent exists, the returned token contains all scopes granted for that resource for the user.

## Which scope for which app type (summary)

| App type | Scope shape on the page |
| --- | --- |
| Interactive sign-in with OpenID Connect | `openid` plus others such as `profile`, `email` |
| Call Microsoft Graph for a user | `User.Read` or `https://graph.microsoft.com/User.Read` |
| Call another API for a user | `{application ID URI}/{permission}` |
| Daemon or service with client credentials | `{resource}/.default` |
| Long-lived access for a user | add `offline_access` |

## What I would do in practice (my advice)

This is my suggestion, not guidance from the reference:

1. Reproduce the failing request with the same client and capture the scope value. Do it once with a minimal scope such as `openid` or `User.Read` to see whether the error depends on one value.
2. Add the scopes back one at a time. The first one that brings the error back is the invalid one.
3. If the app uses a library such as MSAL, check the scope list in its configuration for old or copied values, especially after changing the target API.
4. Compare the permission names with the API's documentation. Names are exact, and a similar name that does not exist is not valid.
5. Write the finding into the app's documentation, so the next person does not repeat the search.

## What the sources do not cover

The reference row and the scopes page do not list every cause of AADSTS70011, and they do not name a log field for the rejected scope. If the checklist finds nothing, open a support case with the correlation ID and timestamp from the failed sign-in.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Scopes and permissions in the Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/scopes-oidc)
