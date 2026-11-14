---
title: "Intune Policy Conflicts and Sync Errors on Windows 365 Cloud PCs: How to Troubleshoot"
summary: "Check policy status, force a sync, resolve conflicts and handle known Windows 365 issues such as AllSigned execution policy, compliance settings that do not apply and the baseline-driven Administrator protection change."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [windows-365, intune, azure-virtual-desktop]
keypoints:
  - "Start in the Intune Troubleshoot pane. A Conflict state means two policies set the same setting differently, or the device has a setting Intune cannot override."
  - "Windows devices check in about every 8 hours, and new enrollments check in more often at first. Force a sync under Settings, Accounts, Access Work or School."
  - "Microsoft lists known Cloud PC issues, including a GPO that sets the PowerShell execution policy to AllSigned and blocks provisioning scripts."
  - "TPM and encryption compliance settings report Not applicable on Cloud PCs. Require BitLocker and Secure Boot can report Not Compliant."
  - "Conflicting configuration settings must be resolved manually by finding every place the setting is defined."
faq:
  - q: "How often does a Cloud PC sync with Intune?"
    a: "Microsoft Learn says Windows 10 and 11 PCs enrolled as devices check in about every 8 hours. Recently enrolled devices check in every 3 minutes for 15 minutes, then every 15 minutes for 2 hours, then about every 8 hours. A manual sync is available under Settings, Accounts, Access Work or School."
  - q: "What does the Conflict status mean?"
    a: "Per Microsoft Learn, Conflict means there is an existing setting on the device that Intune cannot override, or that you deployed two policies with the same setting using different values. Intune shows the conflict and you must resolve it manually."
  - q: "Why does my Cloud PC report Not Compliant?"
    a: "Microsoft's known issues page says Require BitLocker and Require Secure Boot to be enabled on the device might report Not Compliant on Cloud PCs, while TPM and Require encryption of data storage on device report Not applicable. The workaround is to exclude Cloud PCs with a filter and use a compliance policy without those settings."
  - q: "Why did Cloud PC provisioning fail with a Custom Script Extension error?"
    a: "Microsoft Learn names a GPO that sets the PowerShell execution policy to AllSigned at the MachinePolicy scope as a cause. Windows 365 normally sets RemoteSigned at the LocalMachine scope. Remove the GPO or change it to RemoteSigned, then retry the health check and provisioning."
---

When Intune policies conflict or fail to sync on Windows 365 Cloud PCs, work through three layers: the policy status Intune reports, the device's check-in state, and the known Cloud PC issues that Microsoft documents. This article follows Microsoft Learn's Intune troubleshooting pages and the Windows 365 known issues page, last updated on 2026-10-19.

## Step 1: Find out what Intune reports

In the Microsoft Intune admin center, open **Troubleshooting + support** > **Troubleshoot**, select the user, and confirm the Intune license shows a green check. Under **Devices**, check:

- **Managed** must show MDM or EAS/MDM for the device to receive compliance or configuration policies.
- **Microsoft Entra join Type** should be Workplace or AzureAD. If it shows Not Registered, Microsoft says unenrolling and re-enrolling resolves it.
- **Intune compliant** and **Microsoft Entra compliant** should be Yes.
- **Last check in** older than 24 hours may indicate a device problem.

Select the device to see **Device Compliance** and **Device Configuration**. If an expected policy is missing, it is not targeted correctly, so assign it to the user or device.

Microsoft defines the states:

| State | Meaning |
|---|---|
| Not Applicable | The policy is not supported on this platform |
| Conflict | A setting exists on the device that Intune cannot override, or two policies set the same setting with different values |
| Pending | The device has not checked in, or has not yet reported status |
| Conforms (profile status) | The device received the profile and reports it conforms |

For a Windows setting showing Not Applicable, Microsoft says it may be newer than the OS version or limited to certain editions. Check the Configuration Service Provider reference.

## Step 2: Force a sync and mind the timing

By default, Intune devices check in every 8 hours. Recently enrolled Windows devices check in every 3 minutes for the first 15 minutes, every 15 minutes for the next 2 hours, then about every 8 hours. Intune also sends a notification when a policy is assigned, changed or removed, and the delay ranges from immediate to a few hours. If a device does not check in after the first notification, Intune retries three times.

To sync manually on the Cloud PC, open **Settings** > **Accounts** > **Access Work or School**, select the account, then **Info** > **Sync**.

Two timing points matter during provisioning. Dynamic device group membership is not instant and can take minutes to hours, so policies assigned to such a group may not apply until the next check-in. Microsoft recommends assigning policies to user groups for fast delivery during enrollment, because user groups are populated before device setup. When a user leaves a group, removal can take up to 7 hours or more.

## Step 3: Resolve conflicts

Microsoft says that if two configuration settings conflict, Intune shows the conflict and you must resolve it manually. The page gives no steps, but it says conflicting policies can come from several places in the admin center: Group Policy analytics, endpoint security, security baselines and others. Check all of them. The built-in Intune reports can help find them.

Other rules from the same page:

- Compliance settings take precedence over the same configuration profile setting.
- If two compliance policies evaluate the same setting, the most restrictive value applies.
- On Windows, removing a profile behavior depends on the CSP. Some settings are removed and others stay (tattooing).

Hybrid scenarios add risk. A GPO and an Intune policy can both set a value. Decide which one owns each setting and remove the other.

## Step 4: Check known Cloud PC issues

Microsoft's known issues page lists items that look like policy problems:

- **Provisioning fails with a Custom Script Extension error.** A GPO that sets the execution policy to `AllSigned` at the `MachinePolicy` scope overrides the default and blocks unsigned scripts. Windows 365 normally sets `RemoteSigned` at `LocalMachine`. Remove the GPO or change it to `RemoteSigned`, retry the network connection health check, then retry provisioning.
- **Administrator protection turned on by a baseline.** It is not supported on Cloud PCs. If they are Microsoft Entra hybrid joined and receive the Windows security baselines through Group Policy, Administrator protection is turned on starting with the October 2026 Windows security update even if you did not enable it. Symptoms are unexpected authentication prompts and elevation failures. Set **User Account Control: Configure type of Admin Approval Mode** to **Legacy Admin Approval Mode** in the assigned policy or a GPO that takes precedence, then restart the Cloud PCs.
- **Memory Integrity reported as off.** Nested virtualization inhibits DMA protections. Turn off nested virtualization, or do not require DMA for VBS.
- **Restart loop after restore or resize.** It affects Cloud PCs provisioned before July 2022 that use Attack Surface Reduction rules or third-party tools that block the install language script. Remove the policies or set them to Audit mode.
- **Screen capture protection in Teams.** In Intune, set **Enable screen capture protection** to Enable and **Screen Capture Protection Options** to **Block screen capture on client and server**, under the Azure Virtual Desktop settings.

## Step 5: Compliance policies that do not fit Cloud PCs

Microsoft says these settings report **Not applicable** on Cloud PCs: Trusted Platform Module (TPM) and Require encryption of data storage on device. Require BitLocker and Require Secure Boot may report **Not Compliant**. To enable Secure Boot, reprovision the Cloud PC. To remove the non-compliant settings, create a filter for all Cloud PCs, exclude them from compliance policies that hold these settings, then create a new compliance policy without them and include Cloud PCs through the filter.

## Step 6: Scope tags and groups

Windows 365 role assignments support only user groups in scope groups, not device groups. A scope tag applied to the top of a nested group is not applied to Cloud PCs in inner groups, so tag each group individually. If a policy seems to target the wrong Cloud PCs, check these first.

## Quick order of work

1. Troubleshoot pane: license, join type, last check-in.
2. Per-policy state: Conflict, Pending or Not Applicable.
3. Manual sync on the Cloud PC.
4. Search every policy source for the conflicting setting.
5. Compare against the known issues above.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Windows 365 Frontline](https://www.m365.fm/entity/windows-365-frontline/)

## Sources

- [Microsoft Learn: Troubleshoot policies in Microsoft Intune](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-configuration/troubleshoot-policies-in-microsoft-intune)
- [Microsoft Learn: Common questions and scenarios with policies and profiles in Intune](https://learn.microsoft.com/en-us/intune/device-profile-troubleshoot)
- [Microsoft Learn: Known issues for Windows 365 Enterprise and Frontline](https://learn.microsoft.com/en-us/windows-365/enterprise/known-issues-enterprise)
