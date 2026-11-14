---
title: "Foundry Agent Managed Identity Authentication Failures: Fixing 401 Errors in Custom Tools"
summary: "Why a Microsoft Foundry agent tool returns 401 with managed identity: project identity versus account identity, missing role on the target, wrong audience, and how MCP and OpenAPI tools differ."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [azure-ai-foundry, managed-identity, ai-agent]
keypoints:
  - "For OpenAPI tools, the managed identity method uses the Foundry project's managed identity, not the account's, and only works if the target accepts Microsoft Entra tokens."
  - "Per Learn, failing managed identity authentication points to a disabled identity or a missing role on the target. A 401 despite an assigned role points to an audience mismatch."
  - "The audience is the target service's resource identifier, for example https://storage.azure.com, never the Foundry project endpoint."
  - "Assign the least-privileged data-plane role. Azure Resource Manager Reader alone does not grant data-plane access."
  - "MCP tools can use agent identity or project managed identity. Learn does not name the roles or audience values for MCP servers."
faq:
  - q: "What does a 401 mean for an OpenAPI tool with managed identity?"
    a: "Microsoft Learn's troubleshooting table lists two separate rows. Authentication failing for the project managed identity is attributed to the identity not being enabled or its role assignment missing. A 401 even though the role is assigned is attributed to an audience URI that does not match what the target expects. To verify a token's audience, Learn suggests decoding it at jwt.ms and checking the aud claim."
  - q: "Which identity does the OpenAPI tool use?"
    a: "Microsoft Learn says the managed identity option uses the Foundry project's managed identity, not the account's. Toolboxes always require the project identity, and prompt agents in new subscriptions must use it. Existing subscriptions can still use the account identity but Learn says to migrate as soon as possible."
  - q: "Which audience should the connection use?"
    a: "The target service's resource identifier. Learn lists examples such as https://storage.azure.com for Storage, https://vault.azure.net for Key Vault, https://search.azure.com for AI Search, https://cognitiveservices.azure.com for Translator and the Application ID URI such as api://client-id for an Entra-protected app registration."
  - q: "Which roles do I need to create the connection and run the agent?"
    a: "Microsoft Learn lists the Foundry User role on the project to create and run agents and the Foundry Project Manager role to create a project connection."
  - q: "Is there an official fix for custom API 401 errors with app roles?"
    a: "The Microsoft Q&A thread read for this article has no accepted answer. The original poster reported that disabling and re-enabling the managed identity, then creating the federated identity credential, assigning the app role and also assigning Reader on the subscription fixed it. The poster did not isolate which step helped, so this is an unverified observation."
---

A Foundry agent tool that returns 401 Unauthorized with managed identity points, according to Microsoft Learn's troubleshooting table, to a missing role for the identity the agent uses or to a wrong audience. The Learn pages use the name Microsoft Foundry, and this guide follows them.

## Step 1: Find out which identity is used

For OpenAPI tools, Microsoft Learn lists three authentication methods: anonymous, API key and project managed identity. A bearer token is handled through the API key connection, whose value must read `Bearer <token>`. The managed identity method uses an OpenAPI project connection with `authType: "ProjectManagedIdentity"` and works with the Foundry project's managed identity, not the account's.

The page spells out the rules:

- Toolboxes always require the project managed identity.
- Prompt agents in new subscriptions must use the project managed identity.
- Existing subscriptions can still use the account managed identity, but Learn says to migrate as soon as possible.
- The account identity method is the older direct `managed_identity` audience configuration in the tool definition. It is not supported in toolboxes and is not the portal's **Managed identity** option.

If the role was assigned to the account identity, the project identity has no access. This is the most common mismatch in a migration.

## Step 2: Assign the role on the target

1. In the Azure portal, open the target resource and select **Access Control**.
2. Select **Add** > **Add role assignment**.
3. Choose the least-privileged data-plane or application role that covers the operations in the spec.
4. Select **Managed identity**, then **select members**, and choose the Foundry project's managed identity.
5. Select **Finish**.

Learn warns that Azure Resource Manager **Reader** alone does not grant data-plane access. The target must also accept Microsoft Entra tokens, or the method fails.

## Step 3: Create the connection with the right audience

The connection is an OpenAPI project connection with `authType: "ProjectManagedIdentity"`, the target API endpoint and the audience expected by that API. It stores no key or token.

The audience is the target's resource identifier. It is not the Foundry project endpoint. Examples from the page:

| Target | Audience |
|---|---|
| Azure Storage | `https://storage.azure.com` |
| Azure Key Vault | `https://vault.azure.net` |
| Azure AI Search | `https://search.azure.com` |
| Azure Translator | `https://cognitiveservices.azure.com` |
| Azure API Management (management plane) | `https://management.azure.com` |
| Entra-protected app registration | Application ID URI, for example `api://<client-id>` |

A mismatch fails with 401. Decode a token at jwt.ms and read the `aud` claim to compare.

## Step 4: Reference the connection in the tool

The tool definition uses `auth.type: "project_connection"` and passes the connection's full ARM resource ID in `auth.security_scheme.project_connection_id`. Learn's troubleshooting table lists a connection-not-found error when the resource ID is incorrect or belongs to another project, and says to use the full ARM resource ID of the connection in the project that sends the request. The page's error example is a `ConnectionNotFoundException` for a short connection name.

Also check the spec. Each operation needs an `operationId` with only letters, `-` and `_`. Request bodies must be `application/json` or `application/json-patch+json`.

## Step 5: Use Learn's troubleshooting table

| Symptom | Cause and fix from Learn |
|---|---|
| Authentication fails for project managed identity | Identity not enabled, or role assignment missing |
| Project managed identity returns 401 although the role is assigned | Connection audience URI does not match what the target expects |
| Token rejected by target API | Target does not accept Microsoft Entra ID tokens, so use another method |
| Project managed identity not used | Tool still uses direct `managed_identity` audience instead of a project connection |
| API key not included in requests | `securitySchemes` or `security` missing, or scheme name differs from the connection key name |
| Bearer token not sent correctly | Connection value missing `Bearer` plus a space |
| Connection not found | Use the full ARM resource ID of the connection in the sending project |
| Agent does not call the tool | Set `tool_choice` to `"required"` and use descriptive `operationId` values |

## MCP tools use a different list

For MCP servers, the authentication article lists key-based, Microsoft Entra with agent identity, Entra with project managed identity, OAuth identity passthrough and unauthenticated access. Entra authentication is the suggested start when the server supports it.

- **Agent identity** fits when access should be scoped per agent. Before publishing, all agents in a project share one agent identity. After publishing, an agent gets a unique one.
- **Project managed identity** fits when all agents in the project share the same access, or when the server needs a managed identity.
- The identity needs role assignments on the underlying service. The page names no specific roles and gives no audience values, only `<entra-audience>` as a placeholder.
- Its troubleshooting table says Entra auth failures come from missing role assignments on the agent identity or project managed identity.

With OAuth passthrough, the tenant of the user must match the project's tenant, and a managed OAuth setup blocks Microsoft audiences going to custom MCP servers with the error `Cannot pass Microsoft token to untrusted MCP endpoint.`

## A community case with an app role

A Microsoft Q&A question describes an OpenAPI tool that reached a custom API but received 401, with the audience validated and no `roles` claim in the token. The poster reports fixing it by disabling and re-enabling the Foundry managed identity, which recreated its service principal, then creating the federated identity credential, assigning the app role and assigning Reader on the subscription. The poster did not isolate which step fixed it and believes Foundry had been reusing the original token. No Microsoft answer was accepted on that thread, so treat it as a lead for testing, not as guidance. The poster's follow-up about an agent blueprint ID and an on-behalf-of call stayed unresolved.

## Typical mistakes (own reading of the pages above)

- Assigning roles to the account identity and running the agent with the project identity.
- Using the project endpoint as audience.
- Assigning only Reader at the resource manager level.
- Rotating an API key and not updating the connection.
- Expecting identity changes to appear at once. In the Q&A case the poster believes Foundry reused an old token, but Learn does not state a delay.

## Related

- [Foundry Agent Service](https://www.m365.fm/entity/foundry-agent-service/)
- [Foundry project](https://www.m365.fm/entity/foundry-project/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)
- [OpenAPI](https://www.m365.fm/entity/openapi/)

## Sources

- [OpenAPI tool in Microsoft Foundry (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/openapi)
- [Set up MCP server authentication (Microsoft Foundry, Microsoft Learn)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication)
- [Foundry Agent using Open API Tool configured for Managed Identity unable to get past 401 response (Microsoft Q&A)](https://learn.microsoft.com/en-us/answers/questions/5749688/foundry-agent-using-open-api-tool-configured-for-m)
