---
title: "Azure Key Vault Secret Rotation With Event Grid, Logic Apps and Functions"
summary: "Use the Key Vault near-expiry event in Event Grid to start rotation. Learn what Microsoft documents for Functions and for Logic Apps, the 30-day timing, retries, permissions and where the gaps are."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [azure-key-vault, azure-event-grid, azure-logic-apps]
keypoints:
  - "Key Vault publishes SecretNearExpiry to Event Grid 30 days before a secret expires. A subscriber can then create a new secret version and update the target service."
  - "Microsoft's rotation tutorial uses an Azure Function. Its Logic Apps tutorial only sends an email when a secret version is created."
  - "Event Grid retries delivery for two hours if a step fails. Between the new version and the target update, the stored secret may not work."
  - "Events fire only for new versions, and you must subscribe on the key vault first."
  - "Use Microsoft Entra-only authentication for Azure SQL where possible, and use secret rotation only when SQL logins are required."
faq:
  - q: "When does Key Vault raise the near-expiry event?"
    a: "Microsoft Learn says Key Vault publishes SecretNearExpiry to Event Grid 30 days before a secret's expiration date. The tutorial sets the expiry to tomorrow and says that a short expiration date publishes a SecretNearExpiry event within 15 minutes."
  - q: "Can a Logic App rotate the secret?"
    a: "The Learn pages I read document a Logic App that sends an email on the SecretNewVersionCreated event, and a Function that rotates a SQL password. They do not document a Logic App that rotates a secret. You can build one with the same pattern, but the steps are your own design."
  - q: "What happens if the rotation fails?"
    a: "The tutorial says that if any step fails, Event Grid retries for two hours. It also warns that there can be a lag between creating the new secret version and updating SQL Server, during which the stored secret cannot authenticate."
  - q: "Do I need Event Grid registered as a resource provider?"
    a: "Yes. The Logic Apps tutorial lists Event Grid registered as a resource provider as a prerequisite, together with a key vault, an Azure subscription and an email account."
  - q: "What about resources with two sets of credentials?"
    a: "Learn has a separate tutorial for rotation with two sets of authentication credentials. The one-credential tutorial states clearly that it covers only resources with one set."
---

Key Vault can start secret rotation through Azure Event Grid. About 30 days before a secret expires, Key Vault publishes a near-expiry event, and a subscriber, usually an Azure Function, creates a new secret version and updates the system that uses it. Logic Apps fit the notification part well. Microsoft's pages show the rotation itself with a Function, so a Logic App that rotates is your own design.

## How the documented pattern works

The tutorial for resources with one set of credentials describes four steps:

1. Thirty days before the secret expires, Key Vault publishes the `SecretNearExpiry` event to Event Grid.
2. Event Grid calls the subscribed function app with an HTTP POST.
3. The function generates a new random password and creates a new version of the secret.
4. The function updates SQL Server with the new password.

Two warnings come with it. There can be a lag between steps 3 and 4, and during that time the secret in Key Vault cannot authenticate to SQL Server. If any step fails, Event Grid retries for two hours.

Microsoft's autorotation page confirms the split. Keys can use rotation policies with a minimum interval of seven days. Secrets are rotated through Azure Functions triggered by Event Grid events. For secrets, near-expiry notifications can also act as a manual reminder.

## Step 1: Understand the events

Learn describes three status changes for secrets: about to expire (30 days before), expired, and a new version available. Notifications for keys and certificates are supported as well, but the 30-day figure is given only for secrets. The Logic Apps tutorial names `Microsoft.KeyVault.SecretNewVersionCreated`, and the rotation tutorial names `SecretNearExpiry`. Two rules matter:

- Events are triggered only for new versions of secrets, keys and certificates.
- You must first subscribe to the event on the key vault.

For consumers, Learn says to check the topic to confirm the event comes from the expected vault, check that the `eventType` is one you handle, and ignore unknown fields. You can use subject prefix and suffix filters to narrow the events.

## Step 2: Prepare permissions and tags

- Assign yourself the **Key Vault Secrets Officer** role to create secrets in the vault.
- The function app uses a system-assigned managed identity with a role assignment that lets it access secrets in the vault. The template creates it.
- The sample reads three tags from the secret: `CredentialId`, `ProviderAddress` and `ValidityPeriodDays`. They tell the function what to rotate.
- The key vault, SQL Server and function app must be in the same resource group in the tutorial.

## Step 3: Deploy and test the rotation

The tutorial deploys three templates: a key vault with SQL Server, the rotation function with its Event Grid subscription for `SecretNearExpiry`, and a web app for verification. To trigger it quickly, create the secret with an expiry of tomorrow. Learn says that setting a short expiration date publishes the event within 15 minutes. In the portal, open **Key Vault** > **Secrets** and compare the versions of the secret.

Some notes from the page:

- For Azure SQL Database and Azure SQL Managed Instance, Microsoft prefers Microsoft Entra-only authentication over SQL logins. Use password rotation only when a workload requires SQL authentication.
- The sample targets the .NET in-process model. For new work, Microsoft points to the isolated worker model.
- The template deploys through source control. For production, Learn recommends `func azure functionapp publish` or zip deploy with `WEBSITE_RUN_FROM_PACKAGE`.

## Step 4: Add a Logic App for notifications

Learn's Logic Apps tutorial sends an email when a secret changes:

1. In the Azure portal, open the key vault, then **Events** > **Get Started** > **Logic Apps**.
2. In the designer, validate the connection and continue.
3. On **When a resource event occurs**, keep the subscription and resource name, choose **Microsoft.KeyVault.vaults** as resource type and **Microsoft.KeyVault.SecretNewVersionCreated** as event type.
4. Add the **Send an email (V2)** action for your mail provider and build the message. You can read the event data with `@{triggerBody()?['Data']}`.
5. Save the Logic App.

To verify, open **Events** > **Event Subscriptions** in the vault and check that a subscription exists. Then create a secret. An email should arrive. The page does not document role assignments.

## Designing a Logic App that rotates (my own design, not documented)

A Logic App could take the place of the function, but none of the Learn pages I read describe this, so treat the following as my own sketch. Use the same shape: trigger on the near-expiry event, read the secret's tags, change the credential at the target, then write the new secret version. Decide the order carefully, because the documented pattern shows a window in which the stored value may be wrong. Plan for retries and for a failure alert.

## Where Logic Apps help most

Even if the Function does the rotation, a Logic App is a good second subscriber. It can read the same Event Grid event and tell the owning team that a secret is about to expire or that a new version exists. The Logic Apps tutorial sends an email. Its prerequisites point to the Logic Apps connectors overview for other mail providers. Using the Logic App for a chat message or a ticket is my own idea and is not described in the tutorial. Learn also notes that multiple subscriptions can route events to the same handler, which is why the handler should check the topic and event type before it acts.

## Typical mistakes (own checklist)

- No event subscription on the vault, so nothing ever fires.
- Expecting events for a secret that never gets a new version.
- Rotating a service with two credential sets using the one-credential pattern.
- No alert when rotation fails, so the secret expires unnoticed.

## Related

- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)
- [Azure Event Grid](https://www.m365.fm/entity/azure-event-grid/)
- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Azure Functions](https://www.m365.fm/entity/azure-functions/)

## Sources

- [Automate secret rotation for resources with one set of credentials (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation)
- [Understanding autorotation in Azure Key Vault (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/autorotation)
- [Monitoring Key Vault with Azure Event Grid (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/event-grid-overview)
- [Use Logic Apps to receive email about status changes of key vault secrets (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/event-grid-logicapps)
