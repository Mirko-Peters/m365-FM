---
title: "Onboard a Customer to Azure Lighthouse for Delegated Management"
summary: "How to onboard a customer to Azure Lighthouse: prerequisites, the IDs you need, ARM template and Marketplace methods, supported roles, deployment rules, verification and troubleshooting."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [azure-lighthouse]
keypoints:
  - "Onboarding delegates a customer subscription or resource groups to users, groups or service principals in the service provider tenant."
  - "Methods are an ARM template (created in the portal or from samples) or a Microsoft Marketplace managed service offer."
  - "Owner, roles with DataActions, roles with restricted actions and deprecated built-in roles are not supported in authorizations."
  - "The customer-side deployer needs permission to write, delete and read role assignments on the subscription. Owner satisfies this."
  - "Verify in My customers on the provider side and Service provider offers on the customer side. Updates can take up to 15 minutes."
faq:
  - q: "What do I need before onboarding a customer?"
    a: "According to Microsoft Learn, the customer tenant needs an active Azure subscription, the service provider tenant holds the users, groups or service principals to be granted access, and groups used in authorizations must be of type Security. Learn also recommends least privilege."
  - q: "Which roles cannot be delegated?"
    a: "Microsoft Learn says Owner, any role with DataActions, any role with restricted actions and deprecated built-in roles are not supported in authorizations. Reader is required to see the delegation in My customers."
  - q: "How many deployments do I need?"
    a: "Learn says you need one deployment per subscription, even within the same customer tenant. Multiple resource groups in one subscription can share a deployment. Management groups cannot be onboarded in one deployment."
  - q: "Who can deploy on the customer side?"
    a: "Per Learn, the deployer needs a role that includes the role assignment write, delete and read permissions on the target subscription. Owner satisfies this. For CSP subscriptions, a user with the Admin Agent role in the service provider tenant can deploy."
  - q: "Can the provider remove the delegation later?"
    a: "Learn recommends assigning the Managed Services Registration Assignment Delete Role so that managing-tenant users can remove the delegation. Without it, only the customer can remove it."
---

To onboard a customer to Azure Lighthouse, collect the tenant, subscription and principal IDs, build an authorization list with supported roles, deploy an ARM template or a Marketplace offer in the customer's subscription, and then verify the delegation on both sides. This guide follows the Microsoft Learn onboarding article.

## Prerequisites

Learn lists these:

- The customer tenant has an **active Azure subscription**.
- The service provider tenant contains the users, groups or service principals to be granted access.
- Groups used in authorizations must have **Group type = Security**, not Microsoft 365.
- Apply least privilege and use only supported roles.
- Optional: link your Microsoft Cloud Partner Program ID to at least one account with access to each onboarded subscription, in the service provider tenant.

## Information to collect

| Item | Template field | Note |
| --- | --- | --- |
| Service provider tenant ID | `managedByTenantId` | Filled in automatically in the portal |
| Customer tenant ID and subscription ID | Deployment target | One deployment per subscription |
| Resource group name | `rgName` | Needed only for resource-group scope |
| Offer name | `mspOfferName` | Must be unique and is visible to the customer |
| Principal ID | `principalId` | Object ID of the user, group or service principal in the managing tenant |
| Display name | `principalIdDisplayName` | Shown to the customer |
| Role definition ID | `roleDefinitionId` | An Azure built-in role ID |

## Pick the supported roles

Azure built-in roles are supported. Learn says Reader is required for the delegation to show in **My customers**. Not supported:

- **Owner**
- Any role with **DataActions**
- Any role with **restricted actions**
- **Deprecated** built-in roles. Learn says users with a deprecated role lose access and new delegations fail until the template is updated and redeployed.

The sample on Learn uses **User Access Administrator**, which requires `delegatedRoleDefinitionIds` that list the roles it may assign, typically to managed identities for policy remediation. Learn also recommends assigning the **Managed Services Registration Assignment Delete Role** so the provider can later remove the delegation. Otherwise only the customer can.

## Choose a method

1. **ARM template created in the Azure portal.** In the provider tenant, go to **My customers** > **Create ARM Template**. Enter a name and description, choose **Subscription** or **Resource group**, and add authorizations with **+ Add authorization**. Select **View template** and **Download**. Learn says the file is not stored in the portal.
2. **ARM template from the samples repository.** Learn lists templates for subscription scope (`subscription.json`), resource group scope (`rg.json`), multiple resource groups in one subscription (`multi-rg.json`) and Marketplace offers. Eligible authorizations use templates in a separate folder.
3. **Microsoft Marketplace.** Customers who buy a public or private managed service offer can be onboarded this way.

## Deployment rules

- One deployment per subscription, even within the same customer tenant.
- Multiple resource groups in one subscription can share a deployment.
- Multiple offers on the same scope need separate deployments with different `mspOfferName` values.
- Management groups cannot be onboarded in a single deployment. Learn suggests using a policy to onboard each subscription.

## Deploy in the customer subscription

The deployer needs a role with write, delete and read permissions on role assignments for the target subscription. Owner satisfies this. To find eligible users, open **Access control (IAM)** and view users with the Owner role. For CSP subscriptions, a user with the Admin Agent role in the service provider tenant can deploy. The `Microsoft.ManagedServices` resource provider is registered automatically during deployment.

Deployment options:

- **Azure portal:** **Service providers** > **Service provider offers** > **Add offer** > **Add via template**. Upload the template and optional parameter file, select **Upload**, then **Review and create** > **Create**.
- **Azure CLI** or **Azure PowerShell**.
- **Deploy to Azure** buttons in the samples repository. Update the offer name, description, managed-by tenant ID and authorizations before creating.

## Verify the result

- **Service provider tenant:** go to **My customers** > **Customers** and confirm the subscription appears under the offer name.
- **Customer tenant:** go to **Service providers** > **Service provider offers** and confirm the offer appears.

Learn says updates can take up to 15 minutes. Refreshing the browser, signing out and in, or requesting a new token can speed things up.

## Troubleshooting checklist from Learn

- Reader, or a role that includes Reader, is granted so the delegation is visible.
- `managedByTenantId` differs from the customer subscription's tenant ID.
- No duplicate assignments exist at the same scope with the same `mspOfferName`.
- `Microsoft.ManagedServices` is registered on the subscription.
- No Owner, DataActions, restricted-action or deprecated roles are used.
- Groups are Security type.
- Group members are added in Microsoft Entra ID, which needs no redeployment. Group owners are not automatically members.
- Nested groups may take additional time to gain access.

## Typical mistakes

- Using a Microsoft 365 group in an authorization.
- Asking for Owner and having the deployment rejected.
- Forgetting Reader, so the customer appears to be missing in My customers.
- Reusing an offer name on the same scope.

## Related

- [Azure Lighthouse](https://www.m365.fm/entity/azure-lighthouse/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)

## Sources

- [Onboard a customer to Azure Lighthouse (Microsoft Learn)](https://learn.microsoft.com/azure/lighthouse/how-to/onboard-customer)
