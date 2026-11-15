---
title: "How to Copy, Update and Manage Business Central Environments in the Admin Center"
summary: "Manage Business Central environments in the admin center: create, copy, restore, update and delete, production vs sandbox differences, Power Platform linking, subscription limits and the operations log."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [dynamics-365-business-central]
keypoints:
  - "Create an environment under Environments > New: name, Production or Sandbox type, country, version. It is usable only when State is Active."
  - "Copy and restore create a new environment and count against the environment quota. The step-by-step articles are separate and were not read."
  - "Premium and Essential subscriptions include one production and three sandbox environments. Each additional production environment adds three sandboxes and 4 GB of database capacity."
  - "Sandbox databases cannot be exported, and outbound HTTP is blocked by default until Allow HttpClient Requests is enabled per app."
  - "The operations log keeps admin center and API operations for 180 days."
faq:
  - q: "How do I create an environment?"
    a: "Per Microsoft Learn, on the Environments tab select New, enter a name, choose Production or Sandbox, enter the country, select the version and select Create. The environment is not accessible until State is Active."
  - q: "What do the subscriptions include?"
    a: "Learn says Premium and Essential subscriptions include one production and three sandbox environments at no extra charge. Each additional production environment bought through a CSP partner adds three sandboxes and 4 GB of tenant-wide database capacity."
  - q: "What is the default update window?"
    a: "Learn says the default update window guarantees that updates do not run between 8:00 PM and 6:00 AM local time of the environment country or region. You can change it after creation."
  - q: "Can I export a sandbox database?"
    a: "No. Learn says environment databases of sandbox environments cannot be exported. Use Excel, RapidStart or copy to production first."
  - q: "Can I delete a linked environment?"
    a: "No. Learn says a linked environment cannot be deleted. Unlinking disables inherited settings but not existing integrations such as Power Automate flows."
---

The Business Central admin center lists environments under the Environments tab. You create new ones with New, copy and restore them with separate actions, and delete them from the action ribbon. This guide follows the Microsoft Learn page on environments in the admin center. Learn splits several procedures into linked articles. Those were not read here, and this guide says so where it matters.

## Create an environment

1. Select **Environments**, then **New** on the action ribbon.
2. Enter a **name**.
3. Select the **Environment Type**: **Production** or **Sandbox**.
4. Enter an **Application family** if the solution is not Business Central.
5. Select the **Country**. It sets the localization and the Azure region where the environment is created and stored. For the W1 version of a sandbox, pick a country that uses the W1 BaseApp.
6. Select the **Version**. Preview versions can appear for sandboxes. Preview environments are not updated when the version becomes available and are deleted automatically when the preview ends.
7. Select **Create**.

The environment is not accessible until **State** is **Active**. The new environment has a default update window that guarantees future updates do not run between 8:00 PM and 6:00 AM local time for the environment country or region. You can change the window after you create the environment.

## Production and sandbox

| Aspect | Production | Sandbox |
| --- | --- | --- |
| Purpose | Daily business operations on performance tiers with a high level of availability | Testing, development and training |
| Backups | Backed up automatically and frequently | Not stated |
| Export | Not stated | Databases cannot be exported. Use Excel, RapidStart or copy to production |
| Performance tests | Use a production-type environment | Not reliable, because of a different performance tier |
| Debugging | Not stated | Debugging endpoint open by default |
| Outbound HTTP | Not stated | Blocked by default. Enable **Allow HttpClient Requests** on Extension Settings for each app, including library apps |

A production environment can enter a **Suspended** state when the subscription is suspended or the environment has not been used for a long time.

## Copy, restore, rename, update, delete

- **Copy and restore:** both create a **new** environment and are subject to the environment quota. The target is not linked to a Power Platform environment. The steps are in the separate Learn articles on copying a production or sandbox environment and on restoring an environment.
- **Rename:** not described on the page. See the separate article.
- **Update:** the page only says an environment is updated to a newer version. Update management has its own article. Rescheduling and the update window appear as Modify operations in the log.
- **Delete:** select the environment on the Environments tab, then **Delete** on the action ribbon. A linked environment cannot be deleted. The log shows Soft delete, Recovered and Delete operations, but the page does not explain soft-delete retention. See the Learn article on deleting and recovering environments.

## Apps and upgrades

Apps published from VS Code or Designer are scoped to the service node. On a sandbox upgrade they are removed, but their data stays, so you must republish and reinstall them. Apps uploaded with **Upload Extension** in Extension Management are global and persist through upgrades and moves.

## Link to Power Platform

- You must be an internal admin with a role that gives access to the admin center, and you need permission to update the target Power Platform environment, such as **Environment Admin**. Learn warns that Microsoft Entra admin roles might not automatically grant the Power Platform environment admin role.
- The Power Platform environment must be in the Ready state, of the same type (production or sandbox) and not already linked.
- Open the environment, select **Link** or **Modify** under Linked Power Platform Environment, pick the environment and select **Link**.
- Links are one-to-one. Cross-geography linking is possible, but customer-managed encryption keys need the same geography.
- Unlinking disables inherited settings but not existing integrations.

## Limits and subscription rules

- Premium and Essential subscriptions include one production and three sandbox environments at no extra charge.
- Each additional production environment, bought through a CSP partner, adds three sandboxes and 4 GB of tenant-wide database capacity.
- Company limits apply from 2023 release wave 2. The page links to operational limits for the number.
- The quota is checked when you create, copy or restore an environment.

## Operations log

The log shows operations by internal and partner delegated admins, through the admin center or the API. It is retained for 180 days. Types include Copy, Create, Soft delete, Recovered, Delete, Modify, Move, Rename, Restart, Update and app operations.

## What the page does not cover

Step-by-step instructions for copy, restore, rename, update scheduling and delete or recover. The soft-delete retention period. The numeric company limit. Backup frequency. Specific admin center role names. Any PowerShell or scripting options.

## Typical mistakes (my advice)

- Planning performance tests in a sandbox.
- Expecting to export a sandbox database.
- Forgetting that outbound HTTP calls are blocked in sandboxes by default.
- Trying to delete an environment that is still linked.
- Assuming an Entra admin role gives Environment Admin rights in Power Platform.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform environment](https://www.m365.fm/entity/power-platform-environment/)

## Sources

- [Managing Production and Sandbox Environments (Microsoft Learn)](https://learn.microsoft.com/dynamics365/business-central/dev-itpro/administration/tenant-admin-center-environments)
