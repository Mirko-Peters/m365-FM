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
  - "If the agent seems stuck, Learn suggests uninstalling the backup extension so that it is reloaded at the next backup."
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

When an Azure Backup job for a virtual machine fails, the cause is most often the VM Agent, the snapshot step, the network path, or a Windows VSS writer. The Microsoft Learn troubleshooting article lists errors with causes and fixes. This guide shows the order in which to check things and points out what the page does not contain.

## Check the basics first

Learn starts with checks that apply to many errors:

1. Use the latest version of the VM Agent.
2. On Windows, open **Services.msc** and confirm that the Windows Azure Guest Agent service is running.
3. Make sure no other backup service or backup product is running on the VM at the same time.
4. If the agent still seems stuck, uninstall the backup extension from the VM. Azure Backup installs it again at the next backup run.

The page states that the Windows VM Agent should be version 2.6.1198.718 or higher.

## Find your error code on the page

The page is organized by error code. It groups errors into agent problems, snapshot problems, and a set of other causes. Before you apply a fix, copy the exact code from the failed job and search the page for it.

Some codes that people search for are not on the page. The version I read has no section for UserErrorGuestAgentStatusUnavailable, ExtensionSnapshotFailedNoNetwork or ExtensionOperationFailed. The closest sections are ExtensionSnapshotFailedNoSecureNetwork and the VM Agent sections. If your code is not on the page, treat the basic checks above as the starting point and open a support request with the job details.

## Snapshot and extension errors

The page covers several snapshot related causes. These are the ones I could read, with the fix Learn gives:

- **Antivirus interference (VMRestorePointInternalError):** Learn describes antivirus exclusions for the backup extension.
- **Network unresponsive:** For network related snapshot failures, Learn describes setting `SnapshotMethod` to `firstHostThenGuest` in the extension configuration.
- **Linux file system freeze (UserErrorFsFreezeFailed):** Learn points to the `vmbackup.conf` file for the freeze settings.
- **Snapshot limit:** A VM can reach a limit on snapshots. The page covers this as its own error.
- **Policy with a Deny effect:** An Azure Policy that denies the creation of the snapshot resources can block the job.
- **BitLocker and Visual C++ redistributable:** The page lists both as causes to check on Windows.

Apply one fix at a time and run a new backup after each, so you know which change helped.

## Windows VSS and COM+ errors

For Windows VMs, the page describes checks of the Volume Shadow Copy Service:

- Run `vssadmin list writers` and check the state of each writer. A writer that is not stable points to the application that owns it.
- For some failures, Learn describes a registry value named `SnapshotWithoutThreads`.
- COM+ and Microsoft Distributed Transaction Coordinator (MSDTC) problems are listed as their own causes.
- For SQL Server in the VM, the page mentions the registry value `UseVssFullBackup` for full VSS backups.

I did not verify the exact registry paths here. Copy them from the Learn page and not from this summary.

## Duration thresholds

The page states that backups that take more than 12 hours, or restores that take more than 6 hours, should be reviewed. If your jobs sit near these values, look at disk churn, VM size and the backup window.

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

- [Troubleshoot Azure VM backup errors](https://learn.microsoft.com/azure/backup/backup-azure-vms-troubleshoot)
