---
title: "Windows LAPS on Hybrid Joined Devices: Active Directory or Entra ID Backup, Not Both"
summary: "Windows LAPS cannot write passwords to Active Directory and Entra ID at the same time. This guide shows how to choose one target for hybrid joined PCs and deploy it with Group Policy or Intune, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [windows-laps, hybrid-entra-join, active-directory, intune]
keypoints:
  - "Microsoft Learn states that Windows LAPS cannot back up passwords to both Microsoft Entra ID and Windows Server Active Directory."
  - "Hybrid joined devices can use either target. BackupDirectory 1 means Entra ID and 2 means Active Directory."
  - "For Active Directory backup, run Update-LapsADSchema once per forest and grant the device self permission on the OU."
  - "Encrypted password storage in Active Directory needs a domain functional level of 2016 or later."
  - "An Intune policy based on the Windows LAPS CSP overrides GPO and legacy LAPS, so use one policy mechanism per device."
faq:
  - q: "Can Windows LAPS write passwords to Active Directory and Entra ID at the same time?"
    a: "No. According to Microsoft Learn, you cannot back up passwords to both Microsoft Entra ID and Windows Server Active Directory. Hybrid joined devices can back up to either one, and the BackupDirectory setting selects it. The Intune documentation repeats that a device uses one directory type or the other, but not both."
  - q: "Which BackupDirectory value do I use?"
    a: "Microsoft Learn lists 0 for disabled, 1 for Microsoft Entra only and 2 for Windows Server Active Directory only. The default is 0, and if it stays at 0 all other settings are ignored."
  - q: "Does a hybrid joined device need LAPS enabled in the Entra tenant?"
    a: "The Intune documentation says hybrid join, unlike Entra join, does not require LAPS to be enabled in Microsoft Entra. The Windows LAPS and Entra scenario page frames the tenant-level enablement around Entra joined devices, so check the Entra article for your join type."
  - q: "Can I sync Active Directory LAPS passwords to Entra ID with Entra Connect?"
    a: "No. Microsoft Learn says syncing the on-premises Windows LAPS attributes to Entra ID is not a tested scenario, and a manual sync will not make them appear in the Entra or Intune portals."
  - q: "Does Windows LAPS create the local administrator account?"
    a: "No. Microsoft Learn says Windows LAPS does not create a custom local administrator account. Create it first, preferably with the RestrictedGroups CSP. If AdministratorAccountName is empty, LAPS manages the built-in administrator by its well-known RID."
---

Hybrid joined workstations get one Windows LAPS backup target, not two. Microsoft Learn states that you cannot back up passwords to both Microsoft Entra ID and Windows Server Active Directory. A hybrid joined device can use either target, and the `BackupDirectory` setting decides: 1 for Entra ID or 2 for Active Directory. The task is therefore a choice, followed by a deployment that matches it.

## Step 1: Choose the backup target

Learn describes the join states like this:

| Join state | Backup target |
|---|---|
| Microsoft Entra joined only | Microsoft Entra ID only |
| Active Directory joined only | Windows Server Active Directory only |
| Hybrid joined | Either one, not both |
| Workplace joined | Not supported |

Questions that help decide:

- **Who retrieves passwords?** Entra ID passwords are read in the Entra or Intune portals by roles such as Cloud Device Administrator and Intune Administrator. Active Directory passwords are read with `Get-LapsADPassword` and AD permissions.
- **Where do you manage devices?** Learn calls Intune with the Windows LAPS CSP the preferred option for Entra joined devices. For Active Directory backup, the AD article lists Group Policy as the most common choice and Intune with the Windows LAPS CSP for hybrid joined devices. The Intune page also lists hybrid join as supported for backup to Entra ID.
- **Do you need DSRM backup for domain controllers?** That is an Active Directory feature only.

Licensing is not a barrier. Learn says Windows LAPS is free, Active Directory backup needs no other license, and Entra ID backup needs Entra ID Free or higher.

## Step 2: Deploy for Active Directory backup

This path uses `BackupDirectory` = 2.

1. **Check domain requirements.** Encrypted storage needs a domain functional level of 2016 or later. Domain controllers running Windows Server 2016 or earlier do not support Windows LAPS DSRM management.
2. **Copy the templates.** Windows Update does not copy `LAPS.admx` to a Group Policy central store, so copy it manually.
3. **Extend the schema once per forest.** Run `Update-LapsADSchema` on a Windows Server 2019 or later domain controller with Windows LAPS, or on a server with the LAPS PowerShell module.
4. **Grant the device permission.** Run `Set-LapsADComputerSelfPermission -Identity <OU>` for the OU that holds the computers.
5. **Grant read and expiry rights.** Use `Set-LapsADReadPasswordPermission` with `-AllowedPrincipals`, and `Set-LapsADResetPasswordPermission` for groups that may expire passwords. Domain Admins have both by default.
6. **Audit extended rights.** `Find-LapsADExtendedRights -Identity <OU>` should list only SYSTEM and Domain Admins. Remove other principals, because the password attributes are confidential.
7. **Create the policy.** In Group Policy, go to **Computer Configuration** > **Policies** > **Administrative Templates** > **System** > **LAPS**. Set the backup directory to Active Directory. Optionally set `AdministratorAccountName` and `ADPasswordEncryptionPrincipal`, which defaults to Domain Admins.
8. **Force and verify.** Run `Invoke-LapsPolicyProcessing`, then look for event 10018 in the LAPS Operational log. `Get-LapsADPassword -Identity <computer> -AsPlainText` shows `Source: EncryptedPassword` when encryption is active.

Query permission does not imply decryption rights. Decryption follows `ADPasswordEncryptionPrincipal`, and an invalid name causes policy processing to fail without a backup.

## Step 3: Deploy for Entra ID backup

This path uses `BackupDirectory` = 1. Learn says Entra ID does not allow managed devices to post new passwords by default, and an admin must enable the feature at tenant level. The Intune page says that setting applies to Entra join and that hybrid join does not require it. The Windows LAPS article does not give the portal path, so follow its link to the Entra article.

Active Directory settings are not supported when backing up to Entra ID. In Intune, create the policy under **Endpoint security** > **Account protection** with the profile **Local admin password solution (Windows LAPS)**, and assign it to device groups.

## Step 4: Avoid conflicting policy sources

Windows LAPS reads settings from one policy root and ignores the others. The order is the LAPS CSP, then LAPS Group Policy, then local configuration, then legacy Microsoft LAPS. The first root with at least one explicit setting wins, and settings are never merged across roots. Learn recommends one policy mechanism per device, and notes that an Intune CSP policy overrides GPO and legacy LAPS.

If the directory does not match the join type, the device may accept the Intune policy without an error and still fail to back up. Learn gives AD backup on a non-domain-joined device as the example.

## Step 5: Handle the local account and legacy LAPS

- Windows LAPS does not create custom accounts. Create the account first, preferably with the RestrictedGroups CSP.
- Only one account can be managed per device. Two policies naming different accounts conflict.
- Legacy Microsoft LAPS is deprecated. Emulation mode honors existing legacy GPO settings during migration, but it stores passwords in clear text only, so it cannot use encryption or password history. Treat it as temporary.
- Automatic account management needs Windows 11 24H2 or Windows Server 2025 or later.

## Typical mistakes

- Expecting a dual backup to both directories.
- Skipping `Update-LapsADSchema` or the OU permissions and then seeing no backup.
- Syncing AD attributes to Entra ID and expecting them in the portals.
- Leaving `BackupDirectory` at 0, which ignores all other settings.
- Naming a custom account that does not exist.

## What the sources do not say

The pages read do not describe a supported way to migrate a hybrid device from one target to the other, and they do not give the Entra portal path for the tenant setting. The Intune page has no dedicated hybrid join section.

## Related

- [Windows LAPS](https://www.m365.fm/entity/windows-laps/)
- [Hybrid Entra join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Active Directory](https://www.m365.fm/entity/active-directory/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Windows LAPS overview](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-overview)
- [Windows LAPS scenarios: Windows Server Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-scenarios-windows-server-active-directory)
- [Windows LAPS scenarios: Microsoft Entra ID](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-scenarios-azure-active-directory)
- [Configure policy settings for Windows LAPS](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-management-policy-settings)
- [Microsoft Intune support for Windows LAPS](https://learn.microsoft.com/mem/intune/protect/windows-laps-overview)
