---
title: "Dataverse Customer-Managed Keys and Virtual Network Support: Setup Order, Roles and Limits"
summary: "How to apply a customer-managed encryption key and Azure virtual network support to Dataverse environments in Power Platform: prerequisites, enterprise policies, linking steps, downtime and the documented limits for each."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [dataverse, customer-managed-keys, managed-environments, power-platform-admin-center]
keypoints:
  - "Both features apply to managed environments and use an Azure enterprise policy, but they are different policies with different kinds, Encryption and NetworkInjection."
  - "The key vault must have soft delete and purge protection enabled, and an expired or revoked key takes the environments offline."
  - "Encryption can take up to four days, and adding an environment to a key policy disables it for a period."
  - "Virtual network support needs a dedicated delegated subnet per policy in the paired Azure regions of the environment."
  - "Enabling or disabling subnet delegation can cause up to a 30 minute window of instability."
faq:
  - q: "Which environments can use a customer-managed key?"
    a: "According to Microsoft Learn, only managed environments can be added. Trial and Dataverse for Teams environments cannot. The enterprise policy location must match the environment's region, and the key vault needs soft delete and purge protection."
  - q: "What happens if the key is disabled or expires?"
    a: "Microsoft Learn warns that if an expiration date is set and the key expires, all environments encrypted with it will be down. Revoking the policy's permissions or disabling the key or vault locks the environments, and Learn says locked environments cannot be accessed by anyone, including Microsoft support, and data loss can occur."
  - q: "Does virtual network support work for trial environments?"
    a: "No. Microsoft Learn lists Production, Default, Sandbox and Developer environments as supported, and Trial and Dataverse for Teams as not supported. The Learn setup page also requires the environment to be a managed environment."
  - q: "How do I remove a virtual network policy from an environment?"
    a: "Microsoft Learn says you can only remove it with PowerShell, using Disable-SubnetInjection with the environment ID. Learn adds that to change the virtual network DNS address you unlink all environments, wait 30 minutes, make the change and enable again."
  - q: "Can I rotate the encryption key without downtime?"
    a: "Microsoft Learn describes creating a new key version in the same key as the recommended method, with no downtime. The new version can take up to 24 hours to apply, and the previous version must stay enabled for at least 28 days."
---

Customer-managed keys and virtual network support secure Dataverse in different ways. A customer-managed key (CMK) lets you hold the encryption key for environment data. Virtual network support lets plug-ins and connectors reach private resources without public exposure. Both rely on managed environments and an Azure enterprise policy. Microsoft Learn documents each separately, and the order below keeps them from interfering with each other.

## Shared groundwork

- Make the target environments **managed environments**. Both features require it.
- Separate duties. Learn recommends that the Azure key vault admin does not have Power Platform admin center access.
- Assign the roles: a Power Platform administrator role in Entra ID for linking, and read access on each enterprise policy for those admins.
- Register `Microsoft.PowerPlatform` in the Azure subscription. Virtual network support also needs `Microsoft.Network`.
- Check the environment region. Policies must match it.

## Part 1: Customer-managed key

### Prerequisites

- An Azure Key Vault or Managed HSM. Soft delete and purge protection are mandatory. Learn says you cannot encrypt with your own key without them.
- An RSA key of 2048 or 3072 bits. Managed HSM keys are RSA-HSM.
- Azure RBAC is recommended for the vault. Private link is supported with public access disabled and trusted Microsoft services allowed to bypass the firewall.
- Users in CMK environments need a qualifying subscription, such as Microsoft 365 E5 or a listed compliance or information protection add-on.
- Trial and Teams environments cannot be added.

### Steps

1. Generate the key in the vault. Set an expiry alert. An expired key takes all environments encrypted with it down.
2. Create the enterprise policy by deploying an ARM template of type `Microsoft.PowerPlatform/enterprisePolicies` with `kind` set to `Encryption`, a system-assigned identity and the key vault and key name.
3. In the vault, grant the policy's managed identity the **Key Vault Crypto Service Encryption User** role.
4. Grant the Power Platform admin read access on the policy, with `New-AzRoleAssignment` and the Reader role.
5. In the Power Platform admin center, go to **Security** > **Data and Privacy** > **Customer-managed encryption key** > **Edit policy** > **Add environments**.

### What to expect

Adding an environment disables it while encryption runs, and the downtime depends on database size. Learn recommends testing with a copy first. Status moves from Encrypting to Encrypting - online and then Encrypted. It can take up to four days, and if it fails the data stays under the Microsoft-managed key and you can rerun it. Check **Manage** > **Environments** > the environment > **History** > **Update Customer Managed Key**.

### Rotation, revocation and scope

- **Rotate with a new key version.** Learn calls this the recommended method. There is no downtime, it can take 24 hours, and the old version must remain enabled for at least 28 days.
- **Revocation locks environments.** Locked environments are inaccessible to everyone, including Microsoft support, and data loss can occur.
- **Removal needs patience.** Removing an environment disables it. Do not delete or disable the key, vault or permissions until 30 days after removal.
- **Not everything is covered.** Connection settings, environment settings, app display names and descriptions, and solution checker results remain Microsoft-managed.
- **Restore and copy** work only to environments with the same CMK. Reset deletes encrypted data, including backups.

## Part 2: Virtual network support

### Prerequisites

- An Azure subscription associated with the Power Platform tenant.
- Supported environment types: Production, Default, Sandbox and Developer. Trial and Teams are not supported.
- Azure Network Contributor or an equivalent role, and the Power Platform administrator role.
- A dedicated, new subnet delegated to `Microsoft.PowerPlatform/enterprisePolicies`.
- Virtual networks in the paired Azure regions for the environment's region. For many geographies, create two virtual networks in different regions.

### Steps

1. Create the networks and delegate the subnets. The PowerShell module `Microsoft.PowerPlatform.EnterprisePolicies` provides `New-VnetForSubnetDelegation`.
2. Create the policy with `New-SubnetInjectionEnterprisePolicy`, or an ARM template with `kind` set to `NetworkInjection`.
3. Grant read access on the policy to the Power Platform admin.
4. Link the environment with `Enable-SubnetInjection`, or in the admin center under **Security** > **Data and privacy** > **Azure Virtual Network policies**.
5. Confirm **Succeeded** on the environment's **History** page.

### Sizing and limits

- Production environments need 25 to 30 IP addresses each, nonproduction 6 to 10, and each subnet reserves 5.
- Learn's example: four production environments need 125 addresses, so a /25.
- A delegated subnet cannot be shared across enterprise policies, and its range cannot change while in use.
- Enabling or disabling delegation can cause up to a 30 minute window of unavailability.
- A NAT gateway is required if components need public internet access.
- Supported today: Dataverse plug-ins and a list of connectors, including SQL Server, Azure Key Vault, Blob Storage, custom connectors and HTTP with Microsoft Entra ID. Azure-aware plug-ins, low-code plug-ins that use connectors and SQL through an on-premises gateway are not supported. GCC is not supported.

## Doing both

The pages read do not describe combining a key policy and a network policy on the same environment, and the Learn CMK page notes that its template includes a `networkInjection` property set to null. Treat them as two policies and apply each separately, and test the second change after the first has finished. Key vault private link is supported for CMK.

## Typical mistakes

- Using an environment that is not managed.
- Letting a key expire.
- Applying a policy in the wrong region.
- Reusing a delegated subnet in a second policy.
- Deleting the old key version or vault too early.

## What the sources do not say

The pages read do not state a combined procedure, the exact downtime of CMK for a given size, or a way to remove a virtual network policy outside PowerShell.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Customer-managed keys](https://www.m365.fm/entity/customer-managed-keys/)
- [Managed environments](https://www.m365.fm/entity/managed-environments/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Manage your customer-managed encryption key](https://learn.microsoft.com/en-us/power-platform/admin/customer-managed-key)
- [Virtual Network support overview](https://learn.microsoft.com/en-us/power-platform/admin/vnet-support-overview)
- [Set up virtual network support for Power Platform](https://learn.microsoft.com/en-us/power-platform/admin/vnet-support-setup-configure)
