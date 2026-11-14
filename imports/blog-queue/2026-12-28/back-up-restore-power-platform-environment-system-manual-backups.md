---
title: "Back Up and Restore a Power Platform Environment: System and Manual Backups"
summary: "Create manual backups, restore system and manual backups and extend retention in the Power Platform admin center, with the allowed source and target types, requirements, what is not restored and troubleshooting steps from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [power-platform-admin-center, power-platform-environment, dataverse]
keypoints:
  - "System backups are automatic with 7 day retention. Production managed environments can extend retention to 14, 21 or 28 days for system and manual backups."
  - "Open Manage, Environments, select the environment, then Backup and Restore, Restore or manage. Restore needs 1 GB of free capacity and the same region for source and target."
  - "You cannot restore directly to production. Switch the type to sandbox, restore, then switch back. Default can only be restored to a developer environment."
  - "After a restore, solution flows are turned off, connection references need new connections and the environment is in administration mode."
  - "Restore and copy can take up to 48 hours with large data. Wait 48 hours before opening a support ticket."
faq:
  - q: "How long are backups kept?"
    a: "According to Microsoft Learn, 7 days for system and manual backups in production, sandbox, developer and Teams environments. Production managed environments can extend to 14, 21 or 28 days. Trial environments are not backed up."
  - q: "How do I create a manual backup?"
    a: "In the Power Platform admin center select Manage, Environments, choose an environment, then Backup and Restore, Restore or manage, the Manual tab, Create a manual backup, enter the information and select Create. Wait 10 to 15 minutes before restoring."
  - q: "Can I restore over production?"
    a: "Not directly. Learn says to change the type to sandbox, restore and switch back to production as soon as possible, because changing to sandbox affects database retention."
  - q: "What is not restored?"
    a: "Solution flows are turned off, existing solution flows in the target are deleted, connection references need new connections, apps shared with Everyone are no longer shared with Everyone, and canvas app IDs differ."
  - q: "Can I recover a deleted environment?"
    a: "Yes, within 7 days of deletion in the admin center or with the Recover-AdminPowerAppEnvironment cmdlet. Production environments with Dynamics 365 apps can be recovered for up to 28 days."
---

Power Platform protects Dataverse data with system backups, which are automatic, and manual backups, which an admin creates before big changes. This guide follows the Microsoft Learn article on backing up and restoring environments.

## Retention

| Environment type | System backup | Manual backup |
| --- | --- | --- |
| Production | 7 days | 7 days |
| Sandbox | 7 days | 7 days |
| Developer | 7 days | 7 days |
| Teams | 7 days | 7 days |
| Default | 7 days | Not supported |
| Trial | Not backed up | Not supported |

Production managed environments can extend retention to 7, 14, 21 or 28 days. Unmanaged developer and Dataverse for Teams environments are described as deprecated. System backups do not count toward storage capacity, but restoring needs 1 GB of free capacity.

## Extend retention

1. In the Power Platform admin center select **Manage**, then **Environments**.
2. Select a production managed environment and select **Edit**.
3. In **Edit details**, under **Backup retention**, choose 7, 14, 21 or 28 days and **Save**.

The setting applies to system and manual backups and can take up to 24 hours. Tenant admins with the Power Platform admin, Global admin or Dynamics 365 admin role can change it. A retention rule set at the environment group level cannot be overridden per environment. PowerShell uses `Set-AdminPowerAppEnvironmentBackupRetentionPeriod`.

## Create a manual backup

Create one before major customizations or version updates. Select **Manage**, **Environments**, the environment, **Backup & Restore**, **Restore or manage**, the **Manual** tab and **Create a manual backup**. There is no limit on the number of manual backups. A manual backup is a labeled restore point timestamp, not a separate full copy. Wait 10 to 15 minutes before restoring. You can delete manual backups but not system backups.

## Restore

1. Open the environment, then **Backup & Restore**, **Restore or manage**.
2. On the **System** or **Manual** tab pick a backup and continue or select **Restore**.
3. On the **Backup retention** panel select the target environment to overwrite.
4. For manual backups, choose whether to include audit logs. They are excluded by default because they can lengthen the restore.
5. Select **Restore** and **Confirm**.

| Source | Target |
| --- | --- |
| Production | Sandbox |
| Sandbox | Sandbox |
| Developer | Sandbox, Developer |
| Teams | Teams (self-restore only) |
| Default | Developer |

Requirements: same region, a managed environment can be restored only to another managed environment, a customer-managed key on the source needs one on the target, matching enterprise policies and 1 GB of free capacity. Backup and restore work only with Dataverse environments. To restore into production, change the type to sandbox first and switch back as soon as possible.

## What changes after a restore

- Existing solution flows in the target are deleted. Restored solution flows are turned off.
- Connection references need new connections, and custom connectors need review.
- Apps shared with Everyone are no longer shared with Everyone, and canvas app IDs differ.
- The restored environment is placed in administration mode.
- Only apps and flows in a Dataverse solution are included.

## Troubleshooting

- Operations can take up to 48 hours with large data. Wait before opening a ticket.
- A failed restore leaves the target disabled. Wait 30 minutes and retry with the same target.
- If a target does not appear, check type pairing, region, managed status, encryption key, enterprise policy and free capacity.
- To recover deleted records without overwriting, restore the backup into a new empty environment.

## Capacity and timing notes

Backups do not count against storage capacity, but if storage exceeds the entitlement, restore, create and copy are blocked, because each needs at least 1 GB available. Learn lists freeing storage, archiving data, deleting environments or buying capacity as remedies. Copying and restoring can take more than a day, especially with large data or audit data. Downloading a database backup for offline use is not supported, and previous backups remain available after a restore within the retention period.

## Before you restore

This checklist is a suggestion built from the requirements, not a Microsoft procedure.

1. Confirm the target type is allowed for your source type and that the target is in the same region.
2. Check that both environments are managed, or both are not.
3. Check free capacity of at least 1 GB.
4. Plan for flows and connections that must be re-enabled afterwards.
5. Decide whether audit logs are worth the longer restore time.

## Not covered

The page says the interface and API enforce no limit on database size for backups. Only the capacity rule applies: when storage exceeds the entitlement, restore, create and copy are blocked. It covers app-specific backups, for example Dynamics 365 Marketing or Finance, only through links.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform environment](https://www.m365.fm/entity/power-platform-environment/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Back up and restore environments (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/backup-restore-environments)
