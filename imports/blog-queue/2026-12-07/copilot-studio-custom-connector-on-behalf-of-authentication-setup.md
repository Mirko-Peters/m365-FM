---
title: "Copilot Studio Custom Connector On-Behalf-Of Authentication: Setup Guide"
summary: "How to configure OAuth on-behalf-of (OBO) sign-in for a custom connector that an agent in Copilot Studio uses: two app registrations, the Azure API Connections client ID, security tab values and sharing."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [copilot-studio, custom-connectors, on-behalf-of-flow]
keypoints:
  - "OBO lets an agent call a service as the signed-in user. The agent asks the user for consent, then accesses the service transparently."
  - "The connector needs its own app registration with delegated permissions, admin consent, a client secret and an exposed scope such as access_as_user."
  - "The Azure API Connections service principal (client ID fe053c5f-3692-4f14-aef2-ee34fc081cae) must be an authorized client application, or users sign in every time."
  - "On the connector's Security tab, set OAuth 2.0, Microsoft Entra ID and Enable on-behalf-of login to true, then copy the Redirect URL into the app registration."
  - "Share the connector with makers as Can edit and with end users as Can view."
faq:
  - q: "What does on-behalf-of authentication change for the user?"
    a: "According to Microsoft Learn, the agent prompts the user to grant permission to get a token on the user's behalf. The user can allow or deny. After consent, the agent can access the service transparently for that user."
  - q: "Do I need two app registrations?"
    a: "Only if the connector calls a custom API or MCP server. Microsoft Learn marks the service app registration as optional and says to skip it when the connector only calls Microsoft services such as Microsoft Graph. The connector app registration is always needed."
  - q: "Why must I choose delegated permissions?"
    a: "Microsoft Learn states that OBO needs delegated permissions to act on behalf of the signed-in user. Application permissions do not fit this flow."
  - q: "What happens if the Azure API Connections service principal is not authorized?"
    a: "Microsoft Learn says users would need to sign in explicitly each time they use the connector. If the service principal does not exist in the tenant, a tenant administrator must provision it first."
  - q: "Does Microsoft Learn describe a separate Copilot Studio step for OBO?"
    a: "No. The OBO article has no separate Copilot Studio configuration section. Once the connector is set up and shared, OBO works in agent conversations. Adding the connector to the agent is covered in the article on connectors as tools."
---

On-behalf-of (OBO) authentication for a custom connector in Copilot Studio comes down to four tasks: register an app for the connector, expose a scope and authorize the Azure API Connections service principal, set the connector's Security tab to OAuth 2.0 with Microsoft Entra ID and OBO enabled, and share the connector. Microsoft Learn describes the result as a seamless experience in agent conversations. The agent asks the user for consent and, once it is granted, accesses the service as that user.

This guide follows the Learn article "Configure OBO authentication for custom connectors". Where that article is silent, this text says so.

## Before you start

The Learn article has no separate prerequisites section. The steps assume:

- Access to the Azure portal (App registrations) and to Power Apps (Custom connectors).
- A custom connector that already exists. If there is none, Learn points to its tutorial on creating a custom connector from scratch.
- Rights to grant admin consent in the tenant.

## Step 1 (optional): Register the service app

This step applies only if the connector calls a custom API or MCP server that validates Microsoft Entra ID tokens. Skip it for Microsoft services such as Microsoft Graph.

1. In the Azure portal, open **App registrations** and select **New registration**.
2. Enter a name, choose the supported account types that fit, and select **Register**.
3. Open **Expose an API** and select **Add a scope**. Enter a scope name such as `employee.read`, choose who can consent, add the consent texts and set the state to **Enabled**.
4. Record the application (client) ID and the scope.

The API must validate tokens issued for this application ID and scope. Learn states that token validation is outside the scope of the article.

## Step 2: Register the connector app

1. Create another registration. Choose **Accounts in this organizational directory only (Single tenant)**. Learn says not to add a redirect URI yet.
2. Open **API permissions** and select **Add a permission**. For a custom API, choose **APIs my organization uses**, find the service app and select its delegated scope. For Microsoft services, choose **Microsoft APIs**, pick the service and select delegated permissions, for example `Files.Read.All` on Microsoft Graph.
3. Select **Grant admin consent** for the organization.
4. Open **Certificates & secrets**, create a **New client secret**, choose an expiration period that fits your organization's security policies, and copy the **Value** at once. Azure shows it only one time.
5. Open **Expose an API** and add a scope such as `access_as_user`. Set **Who can consent** to **Admins and users** and the state to **Enabled**.
6. Under **Authorized client applications**, add the Azure API Connections service principal client ID `fe053c5f-3692-4f14-aef2-ee34fc081cae` and select the scope you created.

The page stresses two points. First, select **Delegated permissions**, not **Application permissions**. Second, if the Azure API Connections service principal does not exist in the tenant, a tenant administrator must provision it first. Without the authorization in step 6, users would have to sign in explicitly every time.

## Step 3: Configure the connector

In Power Apps, open **Custom connectors**, select the connector and open the **Security** tab. Learn lists these values:

| Field | Value |
|---|---|
| Authentication type | OAuth 2.0 |
| Identity Provider | Microsoft Entra ID |
| Client ID | Application ID of the connector app registration |
| Client secret | The secret value from step 2 |
| Authorization URL | Default `https://login.microsoftonline.com` |
| Tenant ID | Default `common`, or your tenant ID |
| Resource URL | For a custom API, the Application ID URI such as `api://<id>`. For Microsoft Graph, `https://graph.microsoft.com` |
| Enable on-behalf-of login | true |
| Scope | One or more scopes separated by spaces, for example `Files.Read.All User.Read` |

Select **Update connector**. A **Redirect URL** appears. Copy it, open the connector app registration, select **Authentication**, **Add a platform**, **Web**, paste the URL and select **Configure**.

The article does not list a Token URL field in this procedure.

## Step 4: Share the connector

Follow the Learn article on sharing custom connectors in an organization. For OBO, Learn assigns two permission levels:

- Makers who build the agent get **Can edit**.
- End users who talk to the agent get **Can view**, so they can sign in and use the connector.

## Use the connector in an agent

The OBO article stops after sharing. To add the connector to an agent, the Copilot Studio article on connectors as tools says to open the agent, go to **Tools**, select **Add a tool**, then **New tool** and **Custom connector**. This opens the Custom connectors section of Power Apps.

By default, connectors ask agent users for their own credentials. Learn also describes a **Maker-provided credentials** option under the tool's **Overview** page, which needs an authenticated channel. Do not mix this up with OBO: maker-provided credentials use the maker's connection, not the user's identity.

## Common mistakes to check

- **Application instead of delegated permissions.** The flow needs delegated permissions.
- **Secret not saved.** A lost secret cannot be retrieved. Create a new one and update the Security tab.
- **Missing authorized client application.** Users get repeated sign-in prompts.
- **Redirect URL not added.** The URL only appears after the first **Update connector**. Add it as a Web platform.
- **API does not validate its own audience and scope.** Learn leaves this part to the API owner.
- **Teams with custom Active Directory authentication.** Learn says single sign-on is not supported for connectors in that setup. Users must authenticate to each connector manually.

## What the pages do not say

The OBO article gives no numeric limits or quotas. It also does not describe how long a consent stays valid or how to revoke it. For those points, check the Microsoft Entra documentation for your tenant.

## Related

- [Custom connectors](https://www.m365.fm/entity/custom-connectors/)
- [OAuth 2.0 On-Behalf-Of flow](https://www.m365.fm/entity/on-behalf-of-flow/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Admin consent](https://www.m365.fm/entity/admin-consent/)

## Sources

- [Configure OBO authentication for custom connectors (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-custom-connector-on-behalf-of)
- [Use connectors in Copilot Studio agents (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-connectors)
