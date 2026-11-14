---
title: "Secure Microsoft 365 Copilot Declarative Agent API Plugins: OAuth Scopes, Entra SSO and Confirmation"
summary: "How to limit what a declarative agent's API plugin can do: authentication type, least scopes, auth config restrictions, per-function confirmation and security_info, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [declarative-agent, api-plugins, oauth-2-0, copilot-extensibility]
keypoints:
  - "API plugins support Entra SSO, OAuth 2.0 authorization code flow, API key and no authentication. Dynamic client registration is not supported for API plugins."
  - "The plugin manifest stores only an auth config ID in reference_id. No client ID, secret or token is written to the manifest."
  - "Request only the scopes your API needs. For the Microsoft identity platform, add offline_access only when refresh tokens are required."
  - "In the Teams developer portal, restrict an auth config by organization and by app. Binding to a specific Teams app can cause every MCP tool call to fail with 404."
  - "Per function, confirmation and security_info.data_handling describe the risk. ResourceStateUpdate marks actions that need explicit user confirmation."
faq:
  - q: "Which authentication types can a declarative agent API plugin use?"
    a: "Microsoft Learn lists Microsoft Entra single sign-on, OAuth 2.0 authorization code flow, API key and no authentication as supported for API plugins. Dynamic client registration is listed as not supported for API plugins."
  - q: "Are secrets stored in the plugin manifest?"
    a: "No. Learn says the runtime authentication object holds only a reference_id that points to an auth config in the Microsoft Enterprise token store. No client ID, client secret or token is written to the manifest."
  - q: "How do I limit which functions can be called?"
    a: "Learn describes run_for_functions in the runtime object to choose which functions a runtime exposes, and a confirmation object that asks the user before a function runs. The security_info.data_handling values describe whether a function reads, exports or changes data."
  - q: "Do the Learn pages tell me how to design fine-grained permissions inside my own API?"
    a: "No. The pages read for this article cover how Copilot authenticates and which scopes it requests. Per-endpoint authorization inside your API is your own design and is not described there."
  - q: "How does a user sign out of an OAuth plugin?"
    a: "Learn says users can sign out from Chat settings, then Agents, in Microsoft 365 Copilot, which clears the stored OAuth token. For Entra SSO the token cannot be cleared directly, and Learn points to the Graph revokeSignInSessions API to force reauthentication."
---

Securing a declarative agent's API plugin comes down to four controls that Microsoft Learn documents: pick the authentication type, request the smallest set of scopes, restrict the auth config, and describe each function's risk so Copilot asks for confirmation when it should. Fine-grained permissions inside your own API remain your job. The pages read for this article do not cover that part.

## Choose the authentication type

For API plugins, Learn lists these options:

| Scheme | API plugins |
|---|---|
| Microsoft Entra single sign-on | Supported |
| OAuth 2.0 authorization code flow | Supported |
| API key | Supported |
| No authentication | Supported |
| Dynamic client registration | Not supported |

Each scheme relies on an authentication configuration, called an auth config. It is a record stored in the Microsoft Enterprise token store. At runtime, Copilot uses it to get a token or key and sends it in calls to your API on behalf of the signed-in user.

Use anonymous access only for public data. For anything private, prefer Entra SSO when your API is protected by Entra ID, and OAuth 2.0 for other providers.

## Keep secrets out of the manifest

The plugin manifest references the auth config in the runtime authentication object:

```json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id": "auth config ID"
}
```

The documented `type` values are `None`, `OAuthPluginVault` and `ApiKeyPluginVault`. Learn states that the `reference_id` exists so secret values do not need to be stored in the manifest, and that no client ID, secret or token is written to it.

You can create the auth config with Microsoft 365 Agents Toolkit, which also updates the manifest, or manually in the Teams developer portal.

## Register OAuth with least privilege

For OAuth 2.0, the flow uses PKCE, which is on by default. Learn says it is on because many organizations block client secrets, and that you should set `isPKCEEnabled: false` only if the provider does not support PKCE. It also suggests registering a public client (single-page application platform) instead of a Web client, so no secret is needed.

Key steps:

1. Register an app with your OAuth provider and note the client ID, plus the secret for a Web client.
2. Register this redirect URI with the provider. Sign-in fails without it:
   `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`
3. In the Teams developer portal, open **Tools** > **OAuth client registration** and select **Register client** or **New OAuth client registration**.
4. Fill in registration name, base URL, client ID, endpoints and **Scope**, then select **Save**.

On scopes, Learn says to use the values your provider and API require. For the Microsoft identity platform, include `offline_access` if the plugin needs refresh tokens. The page does not state a least-privilege rule in so many words, so apply it yourself: list the scopes your functions need and nothing more.

One trap is documented: scope consent is not verified at provisioning. A scope that cannot be consented to provisions fine, then fails later with "Need admin approval". Confirm admin consent before you provision.

## Entra SSO: the extra steps

With Entra SSO, Learn says your API must use Entra ID to control access. After creating the auth config, which yields an auth config ID and an Application ID URI, you must still:

- Add the Application ID URI to the `identifierUris` of your Entra app, using the manifest editor.
- Add `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect` as a redirect URI on the **Web** platform.
- Under **Expose an API**, add the Microsoft Enterprise token store client ID `ab3be6b7-f5df-413d-ac2d-abf1e3fd9c0b` as an authorized client application.
- Update your API to accept the new identifier URI as token audience, and, if it validates the client application, allow that client ID.

If your API uses the on-behalf-of flow to call another API that needs consent, Learn says to return `401 Unauthorized`, which makes the agent prompt the user to sign in and consent.

## Restrict the auth config

In the Teams developer portal, two settings narrow where the registration works:

- **Restrict usage by org:** **My organization only** for development or single-tenant use, or **Any Microsoft 365 organization** when the plugin must work across tenants.
- **Restrict usage by app:** For SSO, Learn says to select **Any Teams app** if you do not know the final app ID, and to bind the registration to your published app ID after publishing. For MCP servers, the OAuth article says not to bind to a specific app ID, because it causes every tool call to fail with `404`.

The base URL of the registration must match the server URL in your OpenAPI `servers` array.

## Control functions: confirmation and security_info

The plugin manifest lets you describe each function's behavior. Learn documents these properties:

- **`run_for_functions`** in a runtime lists which functions that runtime exposes. If omitted, all functions in the runtime are available. Wildcards are allowed, and no two runtimes may claim the same function.
- **`confirmation`** describes a dialog that should be shown before invoking the function. `type` is `None` or `AdaptiveCard`, with optional `title` and `body`.
- **`isNonConsequential`** lets users choose "Always Allow", but only for OpenAPI GET actions without `x-oai-isConsequential` defined. For other actions it has no effect.
- **`security_info.data_handling`** is required when `security_info` is present. Values are `GetPublicData`, `GetPrivateData`, `DataTransform`, `DataExport` and `ResourceStateUpdate`. The last one covers actions such as granting or denying permissions or starting a transaction that need explicit user confirmation.

If `security_info` is omitted, Learn says the function cannot interact with other plugins or capabilities of the containing agent. That is a useful safe default.

A practical split: mark read-only lookups as `GetPrivateData`, give every write or delete action a confirmation card and `ResourceStateUpdate`, and expose only the functions the agent needs through `run_for_functions`.

## Sign-out and revocation

Users can sign out from **Chat settings** > **Agents** in Microsoft 365 Copilot, which clears a stored OAuth token. For Entra SSO, Learn says the token cannot be cleared directly and may persist after an agent is uninstalled. To force reauthentication, remove the user's consent or revoke sessions with the Microsoft Graph `revokeSignInSessions` API.

## Common failures

Learn lists mismatched values between provider, auth config and manifest as the most common cause of sign-in failures. Check, in this order:

1. The auth config base URL matches the manifest or OpenAPI server URL.
2. The redirect URI is registered with the provider.
3. `reference_id` matches the auth config ID.
4. The org and app restrictions allow your Teams app and tenant.

Servers that return `307 Temporary Redirect` from the token endpoint are not supported.

## Related

- [Declarative agent](https://www.m365.fm/entity/declarative-agent/)
- [API plugins for Microsoft 365 Copilot](https://www.m365.fm/entity/api-plugins/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Microsoft 365 Copilot extensibility](https://www.m365.fm/entity/copilot-extensibility/)

## Sources

- [Configure authentication for MCP and API plugins (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication)
- [OAuth 2.0 authentication for plugins (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication-oauth)
- [Microsoft Entra SSO authentication for plugins (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication-entra-sso)
- [Troubleshoot plugin authentication (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication-troubleshooting)
- [Plugin manifest schema 2.4 (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-manifest-2.4)
