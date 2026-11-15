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
    a: "Based on policy keeps recovery points immutable for as long as the policy retains them. Specific duration makes points immutable for a fixed number of days regardless of policy, after which they follow policy retention without immutability. Locking is irreversible, so confirm the configured duration first."
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
| Enabled and locked | Same, with WORM storage. Cannot be disabled. Where WORM storage is not yet available for a region or workload, Learn says the backup service enforces the lock and moves the backups to WORM storage automatically later |

### Two enablement options

- **Based on backup policy (default):** points stay immutable as long as the policy retains them.
- **Specific duration:** points are immutable for a number of days you choose. The concept page's support matrix lists time-based immutability for Recovery Services vaults. With 180-day retention and 30-day immutability, the points are immutable for 30 days and then remain until day 180 unprotected by immutability. Policy retention can be reduced down to the duration but not below it, and the duration applies to every recovery point in the vault.

### Enable it

You need Backup Contributor on the vault.

1. Open the Recovery Services vault.
2. Select **Properties** > **Immutable vault** > **Settings**.
3. Select **Enable vault immutability**. It is reversible at this stage.
4. The how-to steps do not show a duration choice. The two options come from the concept page, so check your portal for where it is offered.
5. Select **Apply**.

Immutability cannot be locked during vault creation. Enable it first, then lock through Properties. Lock only after you tested policies, retention and costs. Learn says locking makes the setting irreversible and advises confirming the duration first. My own reading is that a locked duration can then no longer be shortened.

### What gets blocked

- Stop protection with deletion of data before expiry
- Policy changes that reduce retention, including swapping an item to a lower-retention policy
- Increasing retention for items whose backups are suspended is not supported

Increasing retention and changing the schedule are allowed. With Stop backup and **Retain as per policy**, the last hardened restore point and the latest restore point are kept indefinitely. Retained restore points incur charges, so delete them manually after the policy expires.

The how-to page has a Backup vault tab with the same enable and lock steps (Properties > Immutable vault > Settings). It does not mention a duration option for Backup vaults, and the concept page lists time-based immutability only for Recovery Services vaults. The concept page's restricted-operations table for Backup vaults lists only stop protection with deletion of data. The how-to page's note says immutable WORM storage for Backup vaults is in preview in a short list of regions, while the concept page says generally available, so check current region support.

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

Learn says the backup admin must not hold Contributor, Backup MUA Admin or Backup MUA Operator on the Resource Guard in any scenario, because these permissions override MUA protection. Its own flow still grants Backup MUA Operator temporarily for a protected operation. My own reading is that the admin holds it only inside an approved window.

### Setup steps

1. **Create the Resource Guard** (security admin). Search **Resource Guards**, select **Create**, use the same region as the vault and add a description explaining how to request access. On **Protected operations**, choose what to protect. The setup page says the Backup vault tab currently includes only the Delete backup instance option, while the concept page lists more optional operations for Backup vaults, so check what your portal shows.
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

Learn warns that without an approver configured, activation requests are approved automatically. The Backup vault PIM section of the setup page names the Contributor role where the Recovery Services section names Backup MUA Operator. Learn does not comment on the difference. The concept page and the other sections use Backup MUA Operator, and Contributor adds delete rights on the Resource Guard, so verify the role before granting.

Disabling immutability on a Recovery Services vault is a protected operation and needs access to the Resource Guard. The how-to page adds that selecting the directory and authenticating is not required if the Resource Guard is in the same directory as the vault.

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
- Restore is disabled as a protected operation by default. Whether to protect it is your decision. That point is my own note, not a Learn recommendation.

## Related

- [Azure Backup](https://www.m365.fm/entity/azure-backup/)
- [Immutable backup](https://www.m365.fm/entity/immutable-backup/)
- [Multi-user authorization](https://www.m365.fm/entity/multi-user-authorization/)
- [Ransomware](https://www.m365.fm/entity/ransomware/)

## Sources

- [Microsoft Learn: Concept of Immutable Vault for Azure Backup](https://learn.microsoft.com/en-us/azure/backup/backup-azure-immutable-vault-concept)
- [Microsoft Learn: How to manage Azure Backup Immutable vault operations](https://learn.microsoft.com/en-us/azure/backup/backup-azure-immutable-vault-how-to-manage)
- [Microsoft Learn: Multiuser Authorization Using Resource Guard](https://learn.microsoft.com/en-us/azure/backup/multi-user-authorization-concept)
- [Microsoft Learn: Configure Multi-user authorization using Resource Guard](https://learn.microsoft.com/en-us/azure/backup/multi-user-authorization)
