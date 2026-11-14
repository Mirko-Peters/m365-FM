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
  - "Learn states no least-privilege rule; request only the scopes your API needs (my advice). With the Microsoft identity platform, include offline_access if refresh tokens are needed."
  - "In the Teams developer portal, restrict an auth config by organization and by app. For MCP servers, Learn warns that binding to one Teams app ID makes every tool call return 404."
  - "Per function, confirmation and security_info.data_handling describe the risk. ResourceStateUpdate marks actions that need explicit user confirmation."
faq:
  - q: "Which authentication types can a declarative agent API plugin use?"
    a: "Microsoft Learn lists Microsoft Entra single sign-on, OAuth 2.0 authorization code flow, API key and no authentication as supported for API plugins. Dynamic client registration is listed as not supported for API plugins."
  - q: "Are secrets stored in the plugin manifest?"
    a: "No. Learn says the runtime authentication object holds only a reference_id that points to an auth config in the Microsoft Enterprise token store. No client ID, client secret or token is written to the manifest."
  - q: "How do I limit which functions can be called?"
    a: "Learn describes run_for_functions in the runtime object to choose which functions a runtime makes available (it does not call this access control), and a confirmation object for a dialog that should be shown before a function runs. The security_info.data_handling values describe whether a function reads, exports or changes data."
  - q: "Do the Learn pages tell me how to design fine-grained permissions inside my own API?"
    a: "No. The pages read for this article cover how Copilot authenticates and which scopes it requests. Per-endpoint authorization inside your API is your own design and is not described there."
  - q: "How does a user sign out of an OAuth plugin?"
    a: "Learn says users can sign out from Chat settings, then Agents, in Microsoft 365 Copilot, which clears the stored OAuth token. For Entra SSO the token cannot be cleared directly, and Learn points to the Graph revokeSignInSessions API to force reauthentication."
---

Securing a declarative agent's API plugin comes down to four controls, my grouping of what Microsoft Learn documents: pick the authentication type, request the smallest set of scopes, restrict the auth config, and describe each function's risk and add confirmation dialogs where a user should approve a call. Fine-grained permissions inside your own API remain your job. The pages read for this article do not cover that part.

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

Learn's guidance is to choose the scheme that matches how your API protects its endpoints. My advice: use anonymous access only for public data, and for private data prefer Entra SSO when Entra ID protects your API and OAuth 2.0 for other identity providers. The API key and anonymous setup pages were not read for this article.

## Keep secrets out of the manifest

The plugin manifest references the auth config in the runtime authentication object:

```json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id": "auth config ID"
}
```

The documented `type` values are `None`, `OAuthPluginVault` and `ApiKeyPluginVault`. Learn states that the `reference_id` exists so secret values do not need to be stored in the manifest, and that no client ID, secret or token is written to it.

You can create the auth config with Microsoft 365 Agents Toolkit, which also updates the manifest, or manually in the Teams developer portal. Learn also lists a declarative agent developer skill, but only for MCP plugins.

## Register OAuth with least privilege

For OAuth 2.0, the flow uses PKCE, which is on by default. Learn says it is on because many organizations block client secrets, and that you should set `isPKCEEnabled: false` in m365agents.yml of your Agents Toolkit project before provisioning, only if the provider does not support PKCE. The Teams developer portal has an equivalent **Enable Proof Key for Code Exchange (PKCE)** setting. It also suggests registering a public client (single-page application platform) instead of a Web client, so no secret is needed.

Key steps:

1. Register an app with your OAuth provider and note the client ID, plus the secret for a Web client.
2. Register this redirect URI with the provider. Sign-in fails without it:
   `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`
3. In the Teams developer portal, open **Tools** > **OAuth client registration** and select **Register client** or **New OAuth client registration**.
4. Fill in registration name, base URL, org and app restrictions, client ID, client secret, the authorization, token and refresh endpoints, **Scope** and the PKCE setting, then select **Save**. The portal then shows the auth config ID, currently labelled **OAuth client registration ID**, which belongs in `reference_id`.

On scopes, Learn says to use the values your provider and API require. For the Microsoft identity platform, include `offline_access` if the plugin needs refresh tokens. The page does not state a least-privilege rule in so many words, so apply it yourself: list the scopes your functions need and nothing more.

One trap is documented for MCP servers protected by Entra ID: scope consent is not verified at provisioning. A scope that cannot be consented to provisions fine, then fails later with "Need admin approval". Confirm admin consent before you provision. Learn does not say whether the same applies to API plugins; I would check consent anyway.

## Entra SSO: the extra steps

With Entra SSO, Learn says your API must use Entra ID to control access. After creating the auth config, which yields an auth config ID and an Application ID URI, you must still:

- Add the Application ID URI to the `identifierUris` of your Entra app. If the app already has a URI, Learn says to use the manifest editor to add another, because the admin center UI cannot add multiple URIs.
- Add `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect` as a redirect URI on the **Web** platform.
- Under **Expose an API**, add the Microsoft Enterprise token store client ID `ab3be6b7-f5df-413d-ac2d-abf1e3fd9c0b` as an authorized client application.
- Update your API to accept the new identifier URI as token audience, and, if it validates the client application, allow that client ID.

If your API uses the on-behalf-of flow to call another API that needs consent, Learn says to return `401 Unauthorized`, which makes the agent prompt the user to sign in and consent.

## Restrict the auth config

In the Teams developer portal, two settings narrow where the registration works:

- **Restrict usage by org:** **My organization only** for development or testing in one tenant, or **Any Microsoft 365 organization** when the plugin must work across tenants. That wording is from the OAuth article; the SSO article only says to select which organization has access.
- **Restrict usage by app:** For SSO, Learn says to select **Any Teams app** if you do not know the final app ID, and to bind the registration to your published app ID after publishing. For MCP servers, the OAuth article says not to bind to a specific app ID, because it causes every tool call to fail with `404`. The pages read give no such warning for API plugins.

The base URL of the registration should correspond to an entry in your OpenAPI `servers` array. The troubleshooting article names a base URL mismatch as one cause of sign-in failures.

## Control functions: confirmation and security_info

The plugin manifest lets you describe each function's behavior. Learn documents these properties:

- **`run_for_functions`** in a runtime lists which functions that runtime exposes. If omitted, all functions in the runtime are available. Wildcards are allowed, and no two runtimes may claim the same function. Using it to expose fewer functions is my reading; Learn describes it only as choosing the functions available in a runtime.
- **`confirmation`** describes a dialog that should be shown before invoking the function. `type` is `None` or `AdaptiveCard`, with optional `title` and `body`.
- **`isNonConsequential`** lets users choose "Always Allow", but only for OpenAPI GET actions without `x-oai-isConsequential` defined. For other actions it has no effect.
- **`security_info.data_handling`** is required when `security_info` is present. Values are `GetPublicData`, `GetPrivateData`, `DataTransform`, `DataExport` and `ResourceStateUpdate`. The last one covers actions such as granting or denying permissions or starting a transaction that need explicit user confirmation.

If `security_info` is omitted, Learn says the function cannot interact with other plugins or capabilities of the containing agent. In my view that is a useful safe default.

My suggestion, not a Learn rule: mark read-only lookups as `GetPrivateData`, give every write or delete action a confirmation card and `ResourceStateUpdate`, and expose only the functions the agent needs through `run_for_functions`.

## Sign-out and revocation

Users can sign out from **Chat settings** > **Agents** in Microsoft 365 Copilot, which clears a stored OAuth token. For Entra SSO, Learn says the token cannot be cleared directly and may persist after an agent is uninstalled. To force reauthentication, remove the user's consent or revoke sessions with the Microsoft Graph `revokeSignInSessions` API.

## Common failures

Learn lists mismatched values between provider, auth config and manifest as the most common cause of sign-in failures. Learn's checklist reads:

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

- [Configure authentication for MCP and API plugins in agents in Microsoft 365 Copilot (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication)
- [Configure OAuth 2.0 authentication (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication-oauth)
- [Configure Microsoft Entra SSO authentication (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication-entra-sso)
- [Troubleshoot MCP and API plugin authentication (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication-troubleshooting)
- [Plugin manifest schema 2.4 for Microsoft 365 Copilot (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-manifest-2.4)
