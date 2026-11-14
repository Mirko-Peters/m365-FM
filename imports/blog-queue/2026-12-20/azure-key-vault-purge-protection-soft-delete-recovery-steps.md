---
title: "Azure Key Vault Purge Protection and Soft Delete: How to Recover a Deleted Vault, Key or Secret"
summary: "What Microsoft Learn documents for recovering deleted Azure Key Vaults and objects: soft delete and purge protection rules, required permissions, portal, CLI and PowerShell recovery steps, name reuse limits and what is not restored."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [azure-key-vault, azure-policy, azure-rbac]
keypoints:
  - "Soft delete is on by default for new vaults and cannot be disabled once enabled. Deleted vaults and objects stay recoverable for 7 to 90 days, with 90 as the default."
  - "The retention interval can only be set when the vault is created. Learn says it cannot be changed afterwards, and the same interval applies to purge protection."
  - "Purge protection is optional and not on by default. When on, nobody, including Microsoft, can purge a vault or object before the retention period ends, and it cannot be turned off."
  - "Recovering a soft-deleted vault does not restore Azure RBAC role assignments or Event Grid subscriptions. They must be recreated."
  - "A deleted vault name stays reserved until the retention period expires or the vault is recovered, because vault names are globally unique."
faq:
  - q: "How long can I recover a deleted Key Vault or secret?"
    a: "Learn says deleted vaults and objects remain recoverable for a configurable 7 to 90 calendar days, and the default is 90 days when nothing is specified. The interval can only be set at vault creation and cannot be changed later."
  - q: "Can I turn off purge protection if it blocks me?"
    a: "No. Learn states that purge protection cannot be disabled or overridden by anyone, including Microsoft. You must recover the deleted vault or wait for the retention period to elapse before reusing its name."
  - q: "Why can I not create a vault with the name of a deleted one?"
    a: "Key vault names are globally unique, and Learn says you cannot create a vault with the name of one in the soft-deleted state. The name is available again after the retention period expires or after you purge the vault, which is only possible without purge protection."
  - q: "Which permissions are needed to recover or purge a soft-deleted vault?"
    a: "The Learn recovery article lists subscription-level permissions for reading and purging deleted vaults and the Key Vault Contributor role to recover a soft-deleted vault. The soft-delete overview says only the subscription owner or the Key Vault Purge Operator role can purge a vault."
  - q: "Does recovering a vault bring back my role assignments?"
    a: "No. Learn says soft-deleting a vault deletes integrated items such as Azure RBAC role assignments and Event Grid subscriptions, and recovering the vault does not restore them. Recreate them after recovery."
---

To recover a deleted Azure Key Vault, list the vault in the soft-deleted state and recover it before the retention period ends. This works only if soft delete was in effect, which Microsoft Learn says is the default for new vaults. Purge protection adds a lock: nobody can permanently delete the vault or its objects before the retention period passes. This article walks through the documented steps and the limits that surprise people during a recovery.

## What soft delete and purge protection guarantee

From the Learn soft-delete overview:

- Deleted vaults, keys, secrets and certificates stay recoverable for 7 to 90 calendar days. The default is 90 days.
- Permanent deletion takes two operations: delete, then purge of the soft-deleted object.
- Soft delete is on by default for new vaults and cannot be disabled once enabled.
- The retention interval can only be set during vault creation and cannot be changed afterwards. The same interval applies to the purge protection retention policy.
- Purge protection is optional and **not enabled by default**. It can be enabled only after soft delete is enabled. When it is on, a vault or object in the deleted state cannot be purged until the retention period passes, but it can still be recovered.
- Learn recommends purge protection when keys are used for encryption, and says most Azure services that integrate with Key Vault, such as Storage, require it.

Learn adds a note on the recovery page: when purge protection is enabled, it cannot be disabled or overridden by anyone, including Microsoft. Both features are strongly recommended for production environments.

One inconsistency on the soft-delete overview: one section says soft-deleted resources are retained "for a set period of time, 90 days", while other sections describe a configurable 7 to 90 days. The configurable range is the more detailed statement.

## What stays blocked while an object is deleted

- A deleted object can only be listed, recovered or forcibly deleted. Other operations fail.
- You cannot create a vault with the same name in the same location, and you cannot create an object with the same name inside a vault while a deleted object of that name exists.
- Vault names are globally unique, so the name is reserved across the whole service until the retention period ends.
- Learn says resource deletion cannot be rescheduled. At the end of the interval, the service purges the vault or object unless it was recovered.

## Permissions

The recovery article lists these subscription-level permissions for working with soft-deleted vaults:

| Permission or role | Purpose according to Learn |
|---|---|
| Microsoft.KeyVault/locations/deletedVaults/read | View properties of a soft-deleted vault |
| Microsoft.KeyVault/locations/deletedVaults/purge/action | Purge a soft-deleted vault |
| Microsoft.KeyVault/locations/operationResults/read | Check the purging state of a vault |
| Key Vault Contributor | Recover a soft-deleted vault |

The soft-delete overview says that only users with special permissions can list deleted vaults and recommends a custom role for handling deleted vaults. In general, only the subscription owner or a user with the **Key Vault Purge Operator** Azure RBAC role can purge a vault. For objects, the recovery article assigns the Key Vault Certificates Officer, Crypto Officer and Secrets Officer roles in its CLI examples to grant purge and recover access for certificates, keys and secrets.

## Recover a vault in the Azure portal

From the Learn recovery article:

1. Sign in to the Azure portal.
2. Search for the **Key Vault** service. Do not open an individual vault.
3. Select **Manage deleted vaults** at the top of the screen.
4. In the context pane, select your subscription.
5. Select the check box next to the vault, then select **Recover** at the bottom of the pane.

The same pane has a purge option, which permanently deletes the vault. Learn warns about this in capital letters for the CLI commands as well.

## Recover with CLI or PowerShell

Learn lists these commands for vaults:

- Azure CLI: `az keyvault list-deleted --subscription <subscription-id> --resource-type vault` and then `az keyvault recover --subscription <subscription-id> -n <vault-name>`.
- Azure PowerShell: `Get-AzKeyVault -InRemovedState` and then `Undo-AzKeyVaultRemoval -VaultName "<vault-name>" -ResourceGroupName "<resource-group>" -Location "<location>"`.

For objects, the CLI list commands are `az keyvault key list-deleted`, `az keyvault secret list-deleted` and `az keyvault certificate list-deleted`, each followed by `recover`. In PowerShell, use `Get-AzKeyVaultKey`, `Get-AzKeyVaultSecret` or `Get-AzKeyVaultCertificate` with `-InRemovedState`, and then `Undo-AzKeyVaultKeyRemoval`, `Undo-AzKeyVaultSecretRemoval` or `Undo-AzKeyVaultCertificateRemoval`. In the portal, open the keys, secrets or certificates blade of the vault and select **Manage deleted** keys, secrets or certificates.

## What a recovery does not bring back

Learn flags this twice as important: when a vault is soft-deleted, services integrated with it are deleted, for example Azure RBAC role assignments and Event Grid subscriptions. Recovering the vault does not restore them, and they must be recreated. Plan to document role assignments and Event Grid subscriptions of critical vaults before an incident, as the author's suggestion.

## Enable the protection

- Check the vault: `az keyvault show` or `Get-AzKeyVault`. In the portal, the **Properties** blade shows the soft-delete setting.
- Enable purge protection: `az keyvault update --subscription <subscription-id> -g <resource-group> -n <vault-name> --enable-purge-protection true`, or `Update-AzKeyVault -VaultName "<vault-name>" -ResourceGroupName "<resource-group>" -EnablePurgeProtection`.
- Learn recommends turning on soft-delete enforcement for vaults through Azure Policy.

Because purge protection cannot be turned off, decide before enabling it that the retention period suits you. For a test vault you plan to delete and recreate under the same name, the lock means waiting out the interval.

## What the documentation does not say

The pages read do not explain how to recover from a purged vault, they do not list a support path for it, and they do not describe a regional disaster procedure for soft-deleted vaults. The recovery article only lists automatic redundancy and failover, soft delete with purge protection, and manual backup and restore as separate options and points to separate pages for the first and last.

## Related

- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Customer-managed keys](https://www.m365.fm/entity/customer-managed-keys/)

## Sources

- [Azure Key Vault soft-delete (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/soft-delete-overview)
- [Azure Key Vault recovery overview (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/key-vault/general/key-vault-recovery)
