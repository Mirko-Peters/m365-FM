---
title: "Azure Logic Apps Dataverse Connector Token Expiry: Service Principal and Managed Identity Options"
summary: "What Microsoft documents for Dataverse authentication in Logic Apps: connector auth types, which connectors support managed identity, application users, and where the documentation stops."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [azure-logic-apps, dataverse, managed-identity]
keypoints:
  - "The Dataverse connector reference lists three working auth types: Oauth, Service Principal and Client Certificate. Managed identity is not listed there."
  - "Microsoft's list of managed connectors that support managed identity in Logic Apps does not include Dataverse, so the combination is not documented."
  - "An Oauth connection is tied to a signed-in user. A Service Principal connection uses a client ID and secret, and is marked as shareable."
  - "Dataverse needs an application user bound to the app registration, created in the Power Platform admin center, and an assigned security role."
  - "The HTTP action supports managed identity, but the Audience must exactly match what Microsoft Entra ID expects, or you get 400 or 401 errors."
faq:
  - q: "Does the Dataverse connector support managed identity in Logic Apps?"
    a: "The pages read do not say so. The Dataverse connector reference on Microsoft Learn lists Client Certificate Auth, Oauth, Service Principal and a deprecated Default option, and the Logic Apps managed identity article does not list Dataverse among supported managed connectors. Check the current connector pane in your own logic app before relying on it."
  - q: "How do I avoid user-bound connections that expire?"
    a: "Microsoft Learn recommends an application user for server-to-server scenarios. You create the user in the Power Platform admin center, bind it to a Microsoft Entra app registration and use a secret or certificate. The Dataverse connector's Service Principal auth type takes the client ID, client secret and tenant ID."
  - q: "How long does a Dataverse access token last?"
    a: "The Dataverse Web API article on Microsoft Learn notes that the access token expires in about an hour, with a default expiration of 60 minutes. MSAL libraries cache and refresh tokens, so long-running clients should acquire a token per request."
  - q: "What throttling limit applies to the Dataverse connector?"
    a: "The connector reference lists 6000 API calls per connection per 300 seconds. A separate Logic Apps Standard article on this site covers Dataverse service protection limits in detail."
---

A Dataverse connection in Logic Apps that keeps failing with expired tokens is usually bound to a user sign-in. Microsoft documents a service principal connection, using an application user in Dataverse, as the non-interactive alternative. The pages read for this article do not document managed identity for the Dataverse connector itself, so this article states what is documented and marks the gap.

## Why the connection stops working

The Dataverse connector reference describes four authentication types:

| Auth type | Shareable | What it takes |
|---|---|---|
| Client Certificate Auth | Yes | Tenant, client ID and a PFX certificate secret |
| Oauth | No | A user sign-in, no extra parameters |
| Service Principal | Yes | Client ID, client secret and tenant ID |
| Default (deprecated) | No | Only for older connections without an explicit type |

An Oauth connection depends on the account that signed in. If that account is changed, disabled or must sign in again, the connection fails. The Microsoft pages read do not describe the exact token or refresh lifetime of such a connection, so treat the cause as an account or consent problem and check the connection status first. The Dataverse Web API article does say a Microsoft Entra access token has a finite lifetime, with a default of 60 minutes.

## Is managed identity supported?

Microsoft's article on managed identities in Logic Apps says that for an operation to support managed identity, it must support OAuth with Microsoft Entra. Its sample list of managed connectors with managed identity support includes Azure Blob Storage, Key Vault, Service Bus, SQL Server, Azure Resource Manager and others. Dataverse does not appear in that list. The page calls it a sample list and points to a broader authentication reference, which was not read here.

The built-in HTTP action does support managed identity. So a workflow could call the Dataverse Web API directly with the HTTP action. Microsoft does not document that exact combination in the pages read, so test it in a non-production environment before you depend on it.

## Use an application user for non-interactive access

Microsoft's Dataverse guidance for apps that run without a signed-in user is to create a special application user bound to a Microsoft Entra app registration, then use either a secret or a certificate. Microsoft adds that this does not consume a paid license, and advises against using an ordinary user account for these scenarios.

Create the application user in the Power Platform admin center:

1. Select **Manage** > **Environments** and open the environment.
2. Select **Settings** > **Users + permissions** > **Application users**.
3. Select **+ New app user** and then **+ Add an app** to pick the Microsoft Entra app registration.
4. Choose a **Business Unit**, enter an **Email address** and edit the security roles.
5. Select **Save**, confirm, then select **Create**.

Rules from the same page:

- Only Microsoft Entra app registrations appear in the list. Enterprise applications do not.
- You can have only one application user per registered application in an environment.
- Application users are unlicensed. The Application ID cannot be changed after creation.
- The page says you can also enter an Azure Managed Identity Application ID, and that for a managed identity you should not enter the application name.

Assign a security role that grants only the table privileges the workflow needs. Microsoft does not describe a specific least-privilege role for Logic Apps, so build one for your tables.

## Switch the Logic App connection

In the connector's **Create connection** pane, choose the **Service Principal** authentication type and supply the tenant, client ID and client secret. Because this type is shareable, other users or workflows can reuse the connection. A secret expires on a date you choose in the app registration, so record that date and renew the secret before it ends. The Dataverse Web API article also warns that a secret value is shown only once after you save it.

If you call the Web API yourself, Microsoft says to use a scope of `<environment-url>/.default` for a confidential client, and `<environment-url>/user_impersonation` for a public client.

## If you use the HTTP action with managed identity

For built-in actions, Microsoft's steps are:

1. Enable the identity. On a Consumption logic app, open **Settings** > **Identity** and turn on the system-assigned identity. Standard logic apps enable it by default.
2. On the HTTP action, open **Advanced parameters**, select **Authentication**, then set **Authentication type** to **Managed identity** and choose the identity.
3. Set the **Audience** to the exact resource ID the target expects.

The page warns that the target resource ID must match exactly, otherwise you may get a 400 Bad Request or 401 Unauthorized error. Do not disable the system-assigned identity to remove access. Disabling it generates a new object ID, and connections that used it stop working even if you re-enable it. Remove the role assignment instead.

For Dataverse, the identity must also exist as an application user. The pages read do not give the Audience value for a Dataverse environment under managed identity, so confirm it against current Dataverse documentation.

## Troubleshooting order

1. Check which authentication type the connection uses.
2. If it is Oauth, find the account bound to it and whether it can still sign in.
3. If it is Service Principal, check the secret expiry date and the tenant ID.
4. Confirm the application user exists and holds a security role.
5. Check throttling. The connector allows 6000 calls per connection per 300 seconds.

## Related

- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)
- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)

## Sources

- [Microsoft Learn: Microsoft Dataverse connector reference](https://learn.microsoft.com/en-us/connectors/commondataserviceforapps/)
- [Microsoft Learn: Authenticate with managed identities in Azure Logic Apps](https://learn.microsoft.com/en-us/azure/logic-apps/authenticate-with-managed-identity)
- [Microsoft Learn: Manage application users in the Power Platform admin center](https://learn.microsoft.com/en-us/power-platform/admin/manage-application-users)
- [Microsoft Learn: Connect to Dataverse with OAuth](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/authenticate-oauth)
