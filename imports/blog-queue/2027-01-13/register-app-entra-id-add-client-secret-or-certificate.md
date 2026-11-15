---
title: "How to Register an App in Microsoft Entra ID and Add a Client Secret or Certificate"
summary: "Register an app in the Microsoft Entra admin center, choose supported account types, record the client ID, then add a certificate, client secret or federated credential. Includes role, lifetime and visibility notes."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [entra-id, app-registration, client-secret]
keypoints:
  - "Sign in to the Microsoft Entra admin center as at least Application Developer, go to Entra ID > App registrations > New registration, and select Register."
  - "Learn recommends Single tenant only for most applications and tells you to record the Application (client) ID from the Overview page."
  - "Add credentials under Certificates & secrets: certificates (.cer, .pem, .crt), client secrets or federated credentials."
  - "Client secret lifetime is limited to two years (24 months) or less, and Microsoft recommends under 12 months."
  - "The client secret Value is shown only once, and Learn says to use certificate or federated credentials in production."
faq:
  - q: "What role do I need to register an app in Entra ID?"
    a: "Microsoft Learn says the account must be at least an Application Developer. You also need an Azure account with an active subscription and a workforce or external tenant. The default directory works for the quickstart."
  - q: "Which supported account type should I choose?"
    a: "Learn recommends Single tenant only for most applications. It lists four options: single tenant, multiple Entra ID tenants for multitenant SaaS apps, any Entra ID tenant plus personal Microsoft accounts, and personal accounts only. The choice depends on who should be able to use your app."
  - q: "How long can a client secret last?"
    a: "According to Learn, client secret lifetime is limited to two years (24 months) or less, and you cannot specify a custom lifetime longer than 24 months. Microsoft recommends an expiration of less than 12 months. The secret value is never displayed again after you leave the page."
  - q: "Should I use a client secret or a certificate?"
    a: "Learn says Microsoft recommends a certificate instead of a client secret before moving to production, and describes client secrets as less secure than certificate or federated credentials that should not be used in production. For testing you can use a self-signed certificate, but in production Learn says to use a certificate from a well-known certificate authority managed with Azure Key Vault."
  - q: "Why can users not see my new app in My Apps?"
    a: "Learn states that new app registrations are hidden from users by default. To make the app visible on the My Apps page, go to Entra ID > Enterprise apps, select the app and set Visible to users to Yes on the Properties page."
---

To register an app, sign in to the Microsoft Entra admin center, go to **Entra ID** > **App registrations**, select **New registration**, name the app, choose the supported account types and select **Register**. Then record the **Application (client) ID**. If the app is a confidential client, add a credential under **Certificates & secrets**. This guide follows two Microsoft Learn pages: the app registration quickstart and the page on adding and managing app credentials.

## Before you start

Learn lists these prerequisites for the registration:

- An Azure account with an active subscription.
- The account must be at least an **Application Developer**.
- A workforce or external tenant. The default directory is fine for the quickstart.

Learn explains what registration does: it establishes a trust relationship between your app and the Microsoft identity platform. The trust is unidirectional. Your app trusts the platform, not the other way round. Once created, you cannot move the application object between tenants.

## Register the application

1. Sign in to the Microsoft Entra admin center (`https://entra.microsoft.com`) as at least an Application Developer.
2. If you have access to several tenants, use the **Settings** icon in the top menu to switch to the tenant where you want to register the app.
3. Browse to **Entra ID** > **App registrations** and select **New registration**.
4. Enter a meaningful **Name**, for example `identity-client-app`. Users can see the name and you can change it at any time. Several registrations can share a name.
5. Under **Supported account types**, choose who can use the app.
6. Select **Register**.
7. On the **Overview** page, record the **Application (client) ID**. It identifies the app and is used in your code when validating security tokens from the Microsoft identity platform.

### Supported account types

| Option | Meaning per Learn |
| --- | --- |
| Single tenant only | For apps used only by users or guests in your tenant. Learn recommends this for most applications. |
| Multiple Entra ID tenants | For multitenant apps where users in any Entra tenant can use the app, ideal for SaaS apps offered to several organizations. |
| Any Entra ID tenant plus personal Microsoft accounts | For multitenant apps that also support personal accounts such as Skype, Xbox, Live or Hotmail. |
| Personal accounts only | For apps used only by personal Microsoft accounts. |

### Make the app visible to users

Learn says new app registrations are hidden from users by default. When you want the app on the **My Apps** page, go to **Entra ID** > **Enterprise apps**, select the app, and on **Properties** set **Visible to users?** to **Yes**.

## Add a credential

Credentials let a confidential client authenticate itself and call web APIs without user interaction. Learn describes three types. Open your app under **App registrations**, then **Certificates & secrets**.

### Certificate (Microsoft's recommended type)

1. Select **Certificates** > **Upload certificate**.
2. Choose a file. Learn says it must be a `.cer`, `.pem` or `.crt` file.
3. Select **Add**.
4. Record the certificate **Thumbprint** for your client application code.

Learn's guidance: Microsoft recommends a certificate over a client secret before the app goes to production. For testing you can use a self-signed certificate. In production, buy a certificate from a well-known certificate authority and use Azure Key Vault to manage access and lifetime.

### Client secret

A client secret is an application password, a string your app uses instead of a certificate. Learn says secrets are less secure than certificate or federated credentials and should not be used in production. They can be convenient for local development.

1. Select **Client secrets** > **New client secret**.
2. Add a description.
3. Choose an expiration or a custom lifetime. Lifetime is limited to two years (24 months) or less, and you cannot set a custom lifetime beyond 24 months. Microsoft recommends under 12 months.
4. Select **Add**.
5. Copy the secret **Value** right away. Learn says it is never displayed again after you leave the page.

Learn adds a note for Azure DevOps service connections that create the service principal automatically: update the secret from the Azure DevOps portal rather than directly in Entra.

### Federated credential

Federated identity credentials let workloads such as GitHub Actions, Kubernetes workloads or compute outside Azure access Entra-protected resources without managing secrets, through workload identity federation.

1. Select **Federated credentials** > **Add credential**.
2. In **Federated credential scenario**, choose one of: customer managed keys, GitHub Actions deploying Azure resources, Kubernetes accessing Azure resources, or Other issuer.
3. Follow the guidance for that scenario.

## External tenants only: admin consent

After registration the app gets the **User.Read** permission. In external tenants, customer users cannot consent to permissions themselves, so an admin must. Select **API permissions**, then **Grant admin consent for <tenant name>**, then **Yes**. Select **Refresh** and check that **Granted for <tenant name>** appears under **Status**.

## Which credential to pick

This is my reading of Learn's guidance, not an extra rule.

1. Production workload that runs in a place that supports federation: use a federated credential, so no secret has to be stored.
2. Production workload that needs a credential: use a certificate and keep it in Azure Key Vault.
3. Local development or a short test: a client secret with a short expiry is acceptable, and delete it afterwards.

## Common mistakes

My list, based on the facts above:

- Not copying the secret value before leaving the page. You must create a new secret.
- Letting a secret expire without a reminder. Put the expiry date in a calendar or monitoring.
- Registering as multitenant when single tenant is enough.
- Forgetting that the app stays hidden from My Apps until you set Visible to users.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [App registration](https://www.m365.fm/entity/app-registration/)
- [Client secret](https://www.m365.fm/entity/client-secret/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [How to Register an App in Microsoft Entra ID - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/quickstart-register-app)
- [Add and manage app credentials in Microsoft Entra ID - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/how-to-add-credentials)
