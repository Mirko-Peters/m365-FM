---
title: "Azure Backup Immutable Vault and Multi-User Authorization: Setup for Ransomware Protection"
summary: "How to enable and lock vault immutability in Azure Backup and protect critical operations with multi-user authorization through a Resource Guard, including roles, PIM approval, limits and irreversible choices."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [azure-backup, immutable-backup, multi-user-authorization, ransomware]
keypoints:
  - "Immutability blocks operations that reduce recovery points. It has three states: disabled, enabled (reversible) and enabled and locked (irreversible)."
  - "Enable it under vault Properties > Immutable vault > Settings, and lock it only after you have tested policies and retention."
  - "MUA uses a separate Resource Guard resource. The backup admin must not hold Contributor, Backup MUA Admin or Backup MUA Operator on it."
  - "Place the Resource Guard in another subscription or tenant for stronger isolation, in the same region as the vault."
  - "Require approval in PIM for Backup MUA Operator. Without it, requests are approved automatically."
faq:
  - q: "Can I undo vault immutability?"
    a: "Only while it is Enabled and not locked. Microsoft Learn says locking is irreversible and uses WORM storage. Disabling an unlocked setting requires Resource Guard approval if MUA protects that operation."
  - q: "What is the difference between 'based on backup policy' and 'specific duration'?"
    a: "Based on policy keeps recovery points immutable for as long as the policy retains them. Specific duration makes points immutable for a fixed number of days regardless of policy, after which they follow policy retention without immutability. Locking also locks the configured duration."
  - q: "Which operations does MUA protect?"
    a: "Learn lists, among others, disabling soft delete or security features and removing MUA protection (both mandatory), plus optional operations such as delete protection, modify policy, modify protection, stop backup and retain data, disable immutability and modifying encryption settings. Restore is disabled by default."
  - q: "Does the Resource Guard have to be in a different tenant?"
    a: "No. Learn recommends a different subscription or tenant for better protection but allows the same subscription. Isolation is least in the same subscription and greatest across tenants. It must be in the same region as the vault."
  - q: "What does MUA not cover?"
    a: "Learn states MUA protects the listed operations on vaulted backups. Operations performed directly on the data source, the protected Azure resource or workload, are outside Resource Guard's scope."
---

Use both controls together. Immutability stops operations that would delete recovery points early. Multi-user authorization (MUA) makes the remaining sensitive operations, including turning protections off, require a second person. Neither one protects the production data itself, and both have irreversible choices, so test before locking.

## Immutable vault

Immutable vault blocks operations that could lead to loss of recovery points. It supports Recovery Services vaults and Backup vaults and all workloads that Azure Backup protects. It does not apply to operational backups for blobs, files and disks. The `Microsoft.RecoveryServices` resource provider must be registered in the subscription.

### The three states

| State | Behavior |
|---|---|
| Disabled | Nothing blocked |
| Enabled | Blocks operations that could lose backups. Can be disabled |
| Enabled and locked | Same, with WORM storage. Cannot be disabled |

### Two enablement options

- **Based on backup policy (default):** points stay immutable as long as the policy retains them.
- **Specific duration:** points are immutable for a number of days you choose. With 180-day retention and 30-day immutability, the points are immutable for 30 days and then remain until day 180 unprotected by immutability. Policy retention cannot go below the duration, and the duration applies to every recovery point in the vault.

### Enable it

You need Backup Contributor on the vault.

1. Open the Recovery Services vault.
2. Select **Properties** > **Immutable vault** > **Settings**.
3. Select **Enable vault immutability**. It is reversible at this stage.
4. Choose based on policy or specific duration.
5. Select **Apply**.

Immutability cannot be locked during vault creation. Enable it first, then lock through Properties. Lock only after you tested policies, retention and costs. Locking also locks the duration, and a locked duration cannot be shortened.

### What gets blocked

- Stop protection with deletion of data before expiry
- Policy changes that reduce retention, including swapping an item to a lower-retention policy
- Increasing retention for items whose backups are suspended is not supported

Increasing retention and changing the schedule are allowed. With Stop backup and **Retain as per policy**, the last hardened restore point and the latest restore point are kept indefinitely. Retained restore points incur charges, so delete them manually after the policy expires.

The Backup vault steps are not included in the portal how-to page I read. Time-based immutability for Backup vaults is limited to Australia East, North Europe and West Central US per the concept page.

## Multi-user authorization

MUA protects Recovery Services vaults and Backup vaults with a **Resource Guard**. To perform a protected operation, a user needs permissions on the Resource Guard.

### Roles

| Role | Held by | Purpose |
|---|---|---|
| Backup admin | Vault owner | Manages the vault, no rights on the Resource Guard at first |
| Security admin | Resource Guard owner | Controls the gate and permissions |
| Reader | Granted to backup admin | Needed to enable MUA on a vault |
| Backup MUA Operator | Granted temporarily | Allows only the protected operations |
| Backup MUA Admin or Contributor | Security admin only | Includes delete permissions on the Resource Guard |

The backup admin must never hold Contributor, Backup MUA Admin or Backup MUA Operator on the Resource Guard or its subscription outside of an approved window. Learn says those override MUA protection.

### Setup steps

1. **Create the Resource Guard** (security admin). Search **Resource Guards**, select **Create**, use the same region as the vault and add a description explaining how to request access. On **Protected operations**, choose what to protect. The Backup vault tab currently lists only Delete backup instance.
2. **Adjust protected operations** under Resource Guard **Properties**. Optional operations can be disabled. Disable soft delete and Remove MUA protection cannot be.
3. **Grant Reader** to the backup admin under **Access Control (IAM)**.
4. **Enable MUA on the vault** (backup admin): **Properties** > **Multi-User Authorization** > **Update**, then enter the Resource Guard URI or pick it from a list after selecting the directory and authenticating.
5. **Configure PIM** (security admin): make the backup admin eligible for Backup MUA Operator. Under the role settings, select **Require approval to activate** and add approvers.
6. **Test**: confirm protected operations are blocked.

Register `Microsoft.RecoveryServices` and `Microsoft.DataProtection` providers for Recovery Services vaults, or `Microsoft.DataProtection` for Backup vaults, in both subscriptions.

### Request and approve an operation

1. The backup admin activates the eligible role in PIM under **My roles** > **Azure resources**.
2. The security admin approves under **Approve Requests**.
3. The backup admin runs the operation during the approved period.
4. With just-in-time access, the role is retracted automatically. A manual IAM grant stays until removed.

Learn warns that without an approver configured, activation requests are approved automatically. It also notes a documentation inconsistency in the Backup vault PIM section, which mentions Contributor where Backup MUA Operator is intended, so verify the role before granting.

Disabling immutability needs the Resource Guard too, unless the guard is in the same directory as the vault.

## Isolation choices

| Layout | Isolation |
|---|---|
| Same subscription | Least |
| Different subscription, same tenant | Medium |
| Different tenant | Maximum, harder to test |

## Best practices from Learn

- Use a different owner for the Resource Guard than for the vault.
- Grant only Backup MUA Operator, and only temporarily.
- Use PIM or just-in-time access.
- Keep Restore unprotected unless your policy requires otherwise.

## Related

- [Azure Backup](https://www.m365.fm/entity/azure-backup/)
- [Immutable backup](https://www.m365.fm/entity/immutable-backup/)
- [Multi-user authorization](https://www.m365.fm/entity/multi-user-authorization/)
- [Ransomware](https://www.m365.fm/entity/ransomware/)

## Sources

- [Immutable vault for Azure Backup](https://learn.microsoft.com/en-us/azure/backup/backup-azure-immutable-vault-concept)
- [Manage immutable vault operations](https://learn.microsoft.com/en-us/azure/backup/backup-azure-immutable-vault-how-to-manage)
- [Multi-user authorization using Resource Guard](https://learn.microsoft.com/en-us/azure/backup/multi-user-authorization-concept)
- [Configure multi-user authorization](https://learn.microsoft.com/en-us/azure/backup/multi-user-authorization)
