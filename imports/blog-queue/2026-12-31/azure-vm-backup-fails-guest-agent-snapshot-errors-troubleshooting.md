---
title: "Azure VM Backup Fails With Guest Agent or Snapshot Errors: Troubleshooting Guide"
summary: "Troubleshoot Azure Backup failures for Azure virtual machines using the Microsoft Learn troubleshooting article: basic VM Agent checks, snapshot and VSS errors, network and antivirus causes, the Linux freeze setting, and what the page does not cover."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [azure-backup, azure-virtual-machines]
keypoints:
  - "Start with the basics from Learn: install the latest VM Agent, check that the Windows Azure Guest Agent service is running, and make sure no other backup service is active."
  - "To rule out snapshot extension issues, Learn suggests uninstalling the extensions to force a reload, then retrying the backup."
  - "For Windows VSS failures, run vssadmin list writers and look for writers that are not in a stable state."
  - "Snapshot errors can come from network access, antivirus exclusions, BitLocker, COM+ or MSDTC problems, a Deny policy, or too many snapshots."
  - "The troubleshooting page has no section for the error codes UserErrorGuestAgentStatusUnavailable or ExtensionOperationFailed, so match your code against the page itself."
faq:
  - q: "Where do I start when an Azure VM backup fails?"
    a: "According to Microsoft Learn, begin with the VM Agent: use the latest agent, confirm the Windows Azure Guest Agent service runs, and confirm that no other backup service is running. Then look up your error code on the troubleshooting page."
  - q: "How do I force the backup extension to reload?"
    a: "Learn describes uninstalling the backup extension from the VM. It is then reinstalled during the next backup."
  - q: "Which Windows VM Agent version does Learn mention?"
    a: "The Learn page states that the Windows VM Agent should be version 2.6.1198.718 or higher."
  - q: "How long can a backup or restore take before Learn says to look at it?"
    a: "According to Microsoft Learn, a backup that takes more than 12 hours or a restore that takes more than 6 hours should be reviewed."
---

When an Azure Backup job for a virtual machine fails, the causes the Learn page lists include the VM Agent, the snapshot step, the network path and Windows VSS writers. The Microsoft Learn troubleshooting article lists errors with causes and fixes. This guide shows the order in which to check things and points out what the page does not contain.

## Check the basics first

Learn starts with checks that apply to many errors:

1. Use the latest version of the VM Agent.
2. On Windows, open **Services.msc** and confirm that the Windows Azure Guest Agent service is running.
3. Check that the VM has internet connectivity and that no other backup service is running at the same time.
4. To rule out snapshot extension issues, uninstall the extensions to force a reload and retry the backup. Azure Backup installs the extension again at the next backup run.

The page also lists a check that the OS version is supported, against the IaaS VM Backup Support Matrix, and a check of the Event log, because failures from other backup products such as Windows Server Backup can be mistaken for Azure Backup failures.

The page states that the Windows VM Agent should be version 2.6.1198.718 or higher.

## Find your error code on the page

The page has sections for backup (basic troubleshooting and common issues listed by error code), jobs, restore, backup or restore duration, the VM Agent, VM snapshot issues, networking and a policy migration issue. Before you apply a fix, copy the exact code from the failed job and search the page for it.

Some codes that people search for are not on the page. The version I read has no section for UserErrorGuestAgentStatusUnavailable, ExtensionSnapshotFailedNoNetwork or ExtensionOperationFailed. The closest sections are ExtensionSnapshotFailedNoSecureNetwork and the VM Agent sections. If your code is not on the page, treat the basic checks above as the starting point and open a support request with the job details.

## Snapshot and extension errors

The page covers several snapshot related causes. These are the ones I could read, with the fix Learn gives:

- **Antivirus interference (VMRestorePointInternalError):** if the Event Viewer shows a faulting application IaaSBcdrExtension.exe, Learn says to exclude the VMSnapshot plugin and log folders from the antivirus.
- **Network calls delayed (ExtensionFailedTimeoutVMNetworkUnresponsive):** Learn first sets the registry values `SnapshotMethod` to `firstHostThenGuest` and `CalculateSnapshotTimeFromHost` to `True`, so snapshots are taken through the host. If that fails, it suggests a backup time with less load or a larger VM. A separate section, ExtensionSnapshotFailedNoSecureNetwork, adds `SchUseStrongCrypto` for the installed .NET Framework versions.
- **Linux file system freeze (UserErrorFsFreezeFailed):** Learn first unmounts the devices, runs fsck and mounts them again. If a mount point cannot be unmounted, it adds `MountsToSkip` to `/etc/azure/vmbackup.conf`. It also says to check for duplicate mount points.
- **Snapshot limit (ExtensionFailedSnapshotLimitReachedError):** the limit was exceeded for some attached disks. Learn says to delete disk blob snapshots you do not need, configure soft-delete retention if soft delete is enabled on the storage accounts, and schedule Site Recovery at a different time.
- **Policy with a Deny effect (UserErrorRequestDisallowedByPolicy):** for an Azure Policy that governs tags, Learn says to change the effect from Deny to Modify, or to create the resource group manually using the Azure Backup naming schema.
- **BitLocker and Visual C++ redistributable:** for ExtensionSnapshotBitlockerError Learn says to turn off BitLocker for all drives and check again. For ExtensionVCRedistInstallationFailure it describes installing the redistributable from the plugin folder and checking that the Msiserver Start value is 3, not 4.

Apply one fix at a time and run a new backup after each, so you know which change helped.

## Windows VSS and COM+ errors

For Windows VMs, the page describes checks of the Volume Shadow Copy Service:

- Run `vssadmin list writers` in an elevated prompt. For every writer whose state is not [1] Stable, Learn says to restart the writer's service, ideally during scheduled downtime, and to check free disk space, RAM, page file and CPU first.
- If restarting the writers does not help, Learn describes a registry value named `SnapshotWithoutThreads`. For writers that time out under limited IOPS it suggests spreading the load across disks, backing up off peak or upgrading the disks.
- COM+ and Microsoft Distributed Transaction Coordinator (MSDTC) problems are listed as their own causes.
- For SQL Server in the VM, Azure VM Backup uses a VSS Full (Copy-Only) backup by default. Only if you explicitly need a non-copy-only full backup, which can truncate SQL logs and affect the SQL backup chain, Learn describes the registry value `UseVssFullBackup`.

I did not verify the exact registry paths here. Copy them from the Learn page and not from this summary.

## Duration thresholds

The page states that backups that take more than 12 hours, or restores that take more than 6 hours, should be reviewed. For these cases Learn points to the best practices and performance considerations in the VM backup introduction.

## Suggestion: a working order

This section is a practical suggestion and not a Microsoft statement.

1. Record the error code, the VM name, the time and the job ID.
2. Check agent version and service state.
3. Review recent changes: a new antivirus product, a new Azure Policy, BitLocker or a changed network rule.
4. Reload the extension.
5. Run the VSS or Linux freeze checks that match the operating system.
6. Check for a snapshot limit.

Keeping this record helps if you need to open a support request later.

## Not covered

The pages I read do not describe the following:

- Instant restore snapshot retention numbers.
- Error codes that are not listed on the page.
- A single decision tree that ties all causes together.
- Step-by-step portal paths for reviewing job details.

## Related

- [Azure Backup](https://www.m365.fm/entity/azure-backup/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Troubleshoot backup errors with Azure VMs (Microsoft Learn)](https://learn.microsoft.com/azure/backup/backup-azure-vms-troubleshoot)
