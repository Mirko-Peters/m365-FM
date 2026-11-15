---
title: "Secure Azure Key Vault With a Private Endpoint, Managed Identities and Azure RBAC: Setup and Checks"
summary: "How to combine private endpoint access, managed identities and Azure RBAC data plane roles for Azure Key Vault, with the portal steps, DNS checks, role choices and limits documented on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [azure-key-vault, azure-private-link, managed-identity, azure-rbac]
keypoints:
  - "A Key Vault private endpoint must be in the same region as its virtual network, while the vault itself can be in another region. The connection must be approved before it works."
  - "Learn's troubleshooting list covers approved state, a private DNS zone named privatelink.vaultcore.azure.net, a virtual network link, the A record and its IP address."
  - "A vault with public access disabled still resolves in public DNS by design. Learn says DNS resolution is not access, and the data-plane controls protect the vault."
  - "Learn recommends managed identities for application access and Azure RBAC over legacy access policies, with roles assigned at vault scope and one vault per application and environment."
  - "Switching a vault to the Azure RBAC permission model invalidates all access policy permissions and can cause outages if equivalent roles are not assigned."
faq:
  - q: "Do the private endpoint and the key vault have to be in the same region?"
    a: "The private endpoint and the virtual network must be in the same region. Learn says the key vault can be in a different region. The portal filters the virtual networks by the region you select for the endpoint."
  - q: "Why does my vault still resolve to a public IP address from inside my network?"
    a: "Learn lists the likely causes: the private DNS zone privatelink.vaultcore.azure.net is missing, it is not linked to the virtual network, the A record for the vault name is missing, or the A record has the wrong private IP address. Check them in that order."
  - q: "Can anyone still find a vault whose public access is disabled?"
    a: "Its name still resolves in public DNS by design. Learn says this only confirms that a vault with that name exists and does not expose the endpoint IP, configuration or data. With public network access disabled and no allow list, the service rejects requests at that ingress."
  - q: "Which role does an application with a managed identity need to read secrets?"
    a: "Learn's built-in role table lists Key Vault Secrets User for reading secret contents. Assign the role to the managed identity at key vault scope. Learn describes Key Vault Reader as metadata only, without secret contents or key material."
  - q: "What happens when I switch from access policies to Azure RBAC?"
    a: "Learn says setting the Azure RBAC permission model invalidates all access policy permissions. It can cause outages when equivalent Azure roles are not assigned, so assign the roles first."
---

A secure Key Vault setup has three separate layers: where requests can come from (private endpoint and firewall), who is calling (managed identity) and what the caller may do (Azure RBAC on the data plane). Microsoft Learn documents each layer on its own page. This article puts the documented steps in order and highlights the checks that the Learn pages list for failures.

## Layer 1: private endpoint

### Requirements

From the Private Link integration page:

- A key vault, an Azure virtual network and a subnet.
- Owner or Contributor permissions on both the key vault and the virtual network.
- The private endpoint and the virtual network must be in the same region. The key vault can be in a different region.
- Key Vault limits the number of private endpoints per vault. Learn points to the service limits page for the numbers.

### Create the endpoint for an existing vault in the portal

1. Sign in to the Azure portal and open the key vault.
2. Select **Networking** under **Settings**, then the **Private endpoint connections** tab.
3. Select **+ Create**.
4. On the **Basics** step choose the resource group, a name and the region of the virtual network.
5. On the **Resource** step, resource type is `Microsoft.KeyVault/vaults` and **Target sub-resource** fills in with `vault`.
6. On the **Virtual Network** step, select the virtual network and subnet.
7. Keep the private DNS zone integration option at its default, then select **Create**.

For a new vault, Learn says to use the **Networking** tab, turn off public access and select **+ Create a private endpoint**.

### Approval

A private endpoint connection must be approved. If the vault is in your directory and you have enough permissions, you can approve it. For a resource in another directory, the owner must approve. Learn lists four states: Pending, Approved, Rejected and Disconnected. A disconnected endpoint should be deleted for cleanup. To approve or reject in the portal, open the vault, select **Networking**, select the connection and choose approve or reject.

### Verify and troubleshoot

From a machine in the endpoint's virtual network, run `nslookup <vault-name>.vault.azure.net`. Over a private endpoint, Learn says the result shows a private IP address and an alias into `<vault-name>.privatelink.vaultcore.azure.net`. If you still get a public IP address, go through the Learn checklist:

1. Connection state is **Approved** and provisioning state is **Succeeded**.
2. A private DNS zone named exactly `privatelink.vaultcore.azure.net` exists.
3. The zone is linked to the virtual network that makes the calls.
4. The zone has an A record with the simple vault name, without a suffix. Learn suggests a TTL of 600.
5. The A record has the private IP address shown on the network interface of the private endpoint resource.
6. For on-premises callers, conditional forwarders exist for both `vault.azure.net` and `vaultcore.azure.net`, routing to an Azure Private DNS Resolver or another DNS platform with Azure resolution.

### What public DNS still shows

Learn says a vault with a private endpoint and public access disabled still resolves in public DNS, because the name returns a CNAME into the privatelink zone. This is intended. A successful lookup confirms only that a vault with that name exists. Learn lists the data-plane controls that protect the vault: public access disabled, private endpoint, RBAC, soft delete, purge protection, Microsoft Defender for Key Vault and diagnostic logging. It adds that if predictable names matter for your threat model, choose names that do not encode environment, customer or workload.

### Firewall and trusted services

The Learn security article lists network options from most to least restricted: disable public access and use private endpoints only, enable the Key Vault Firewall, or use a Network Security Perimeter. It says the trusted Microsoft services bypass still applies when public access is disabled, and that only services on the trusted services list are admitted. `publicNetworkAccess: SecuredByPerimeter` overrides the trusted services bypass. Learn also advises pinning clients to TLS 1.2 or 1.3.

## Layer 2: managed identity

The authentication page recommends enabling a system-assigned managed identity for the application. Azure then manages the application's service principal and authenticates it with other Azure services. If you cannot use a managed identity, you register the application in your Microsoft Entra tenant. The security article adds the recommendation to use managed identities for all app and service connections to avoid hard-coded credentials.

Learn describes three access scenarios: application-only, user-only and application-plus-user. For application-only access with Azure RBAC, you assign roles to the managed identity or service principal. Learn says the application-plus-user option is currently not available for data plane Azure RBAC.

Every request goes through the same check order, according to Learn: Microsoft Entra ID issues the token, the Key Vault firewall checks the network criteria (including trusted services and private link), Key Vault validates the token, and then checks the permission. A caller that fails the firewall gets a forbidden response, and so does a caller without permission.

## Layer 3: Azure RBAC on the data plane

From the Key Vault RBAC guide:

- The control plane uses Azure RBAC, and the data plane uses either a legacy access policy or Azure RBAC for Key Vault data plane operations.
- Starting with API version 2026-02-01, Azure RBAC is the default access control model for newly created key vaults.
- The `Key Vault Contributor` role is for control plane operations only and does not allow access to keys, secrets and certificates.
- Learn warns that someone with Contributor on the control plane can grant themselves data plane access through an access policy, so tightly control Contributor access.

Data plane built-in roles named on the page include Key Vault Administrator, Key Vault Reader (metadata only), Key Vault Secrets Officer, Key Vault Secrets User (read secret contents), Key Vault Crypto Officer, Key Vault Crypto User, Key Vault Crypto Service Encryption User, Key Vault Certificates Officer, Key Vault Certificate User and Key Vault Purge Operator. Key Vault Data Access Administrator manages assignments of those roles and includes an ABAC condition.

Practice recommended by Learn:

- Use one vault per application per environment (development, pre-production, production), with roles assigned at key vault scope.
- Assigning roles on individual keys, secrets or certificates is not recommended. Exceptions are individual secrets that need individual user access, or secrets shared between applications.
- Object-scope assignments do not provide isolation for application teams, because administrative operations such as network access control and monitoring need vault-level permissions.
- Do not use legacy access policies for critical data and workloads, according to the security article, which names missing support for Privileged Identity Management as one reason.
- Use PIM for eligible just-in-time assignments of privileged roles, with approval and MFA on activation.

### Assign a role

In the portal: open the vault, select **Access control (IAM)**, select **Add** > **Add role assignment**, pick the role and select the managed identity as the member. Learn also shows `az role assignment create --role <role-name> --assignee <user-principal-name> --scope <scope>`. It recommends using role IDs instead of names in scripts. Role assignments can take several minutes to take effect.

### Switch an existing vault

Changing the permission model needs unrestricted `Microsoft.Authorization/roleAssignments/write`, which is part of Owner and User Access Administrator. With User Access Administrator you also need `Microsoft.KeyVault/vaults/write`. Learn says classic subscription administrator roles and the restricted Key Vault Data Access Administrator cannot change the permission model. Setting the Azure RBAC model invalidates all access policy permissions, so assign equivalent roles first.

## Preview note

The Key Vault RBAC guide says ABAC conditions on Key Vault roles are in preview and apply only to secret data actions. Check the status before you rely on it.

## What the documentation does not say

The pages read do not give a combined end-to-end procedure for all three layers, and they do not list the private endpoint limit numbers or the trusted services in the pages read. They also do not say how long DNS changes take to propagate beyond the A record TTL suggestion.

## Related

- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)

## Sources

- [Integrate Key Vault with Azure Private Link (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/private-link-service)
- [Grant permission to applications to access an Azure key vault using Azure RBAC (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide)
- [Authenticate to Azure Key Vault (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/authentication)
- [Secure your Azure Key Vault (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/secure-key-vault)
