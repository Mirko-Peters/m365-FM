---
title: "Microsoft Defender and Intune: Common Misconfigurations to Check"
summary: "A checklist of Defender and Intune misconfigurations that Microsoft documents: overlapping policies, mixed management sources, onboarding policy conflicts, security management errors and tenant mismatches."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [intune, microsoft-defender-for-endpoint, security-baselines, group-policy]
keypoints:
  - "In Intune all policy types have equal precedence. Different values for the same setting in several policies can cause a conflict and the setting may fail to apply."
  - "For Defender Antivirus settings, Microsoft lists an order of precedence in which Group Policy outranks Intune (MDM)."
  - "Microsoft recommends one management method for Defender Antivirus for the best results."
  - "Onboarding and offboarding policies deployed to the same device at the same time make the device non-compliant."
  - "Security management for Defender for Endpoint needs matching Microsoft Entra tenant IDs and a correct SCP, and has numbered enrollment error codes."
faq:
  - q: "Why does an Intune Defender setting not apply?"
    a: "Microsoft Learn names conflicts as a common cause. All Intune policy types have equal precedence, so the same setting with different values in several policies can fail to apply. Settings may also come from Group Policy, Configuration Manager or local changes, which can outrank Intune."
  - q: "Which wins for Defender Antivirus settings, Group Policy or Intune?"
    a: "Microsoft Learn lists an order of precedence from highest to lowest: Defender for Endpoint security settings management, Group Policy, Configuration Manager co-management, Configuration Manager standalone, Intune (MDM), Configuration Manager with tenant attach, then PowerShell, MpCmdRun or WMI."
  - q: "How can I see where a Defender setting comes from?"
    a: "Microsoft Learn says to use the Effective settings tab on the device page in the Microsoft Defender portal, which shows the actual value and the source that configured it. It also names GpResult.exe, the Configuration Manager logs and mdmdiagnosticstool.exe for finding the source."
  - q: "Why is a device non-compliant after onboarding through Intune?"
    a: "Microsoft Learn lists three known cases: Windows setup (OOBE) was not completed, the SENSE service uses delayed start and Intune reports it during a session at startup, or onboarding and offboarding policies are deployed to the same device at the same time."
  - q: "What does the SenseCM EnrollmentStatus registry value show?"
    a: "For security management for Defender for Endpoint, Microsoft Learn says to check HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\SenseCM\\EnrollmentStatus when the device is not found in Microsoft Entra ID or Intune, and to match the error code to the documented cause."
---

Most Defender and Intune problems trace back to a few causes: the same setting configured in several places, more than one tool managing Defender Antivirus, onboarding policies that overlap, and enrollment prerequisites that were never met. This checklist follows Microsoft Learn and puts the checks in the order Microsoft describes. It does not replace tenant-specific testing.

## 1. Overlapping policy types

Microsoft Learn states that all Intune policy types are treated as equal sources of device configuration. When multiple policies set the same setting to different values, the setting might fail to apply and be flagged as conflicted. Three common scenarios are listed:

- Security baselines against endpoint security or device configuration policies.
- Device configuration policies that manage the same settings as endpoint security policies.
- Multiple endpoint security policies with different values for the same setting.

Baselines can set non-default values, while endpoint security and device configuration policies typically default to Not configured, so mixing the approaches can create conflicts. Microsoft's workflow for conflicts is: monitor deployment reports for error or conflict flags, check which policy types target the same setting, use per-setting status in device reporting, check whether baselines set non-default values, then resolve using policy-specific guidance.

**Check:** Document which policy type owns which setting. Microsoft's guidance is to plan the policy architecture before implementation and use consistent approaches across policy types.

## 2. Duplicated policies without assignments

Microsoft Learn notes that a duplicated policy keeps all settings and scope tags but does not inherit assignments. A copied policy that was never assigned will not reach devices.

**Check:** After you duplicate a policy, configure new assignments and review the settings.

## 3. More than one tool managing Defender Antivirus

The Learn article on troubleshooting Defender Antivirus settings lists an order of precedence, highest to lowest:

1. Defender for Endpoint security settings management
2. Group Policy
3. Configuration Manager co-management
4. Configuration Manager (standalone)
5. Intune (MDM)
6. Configuration Manager with tenant attach
7. PowerShell (`Set-MpPreference`), MpCmdRun or WMI

So a Group Policy value can override an Intune value. The article adds that `MDMWinsOverGP` does not apply to all settings, for example attack surface reduction rules on Windows 10. Its tip is to use one management method for Defender Antivirus for the best results.

**Check:** On a problem device, open the device page in the Microsoft Defender portal and use the **Effective settings** tab, which shows each value and its source. Then identify the source:

- Group Policy: run `GpResult.exe /h C:\temp\GpResult_output.html` in an elevated Command Prompt.
- Configuration Manager: check `C:\Windows\CCM\Logs`.
- Intune: run `mdmdiagnosticstool.exe -out "c:\temp\MDMDiagReport.zip"`.
- Local: find out whether the setting came from imaging, PowerShell, WMI or a registry edit.

Remove or revise the conflicting policies. For exclusions, the article says that from release 4.18.25110.6 (February 2026) organizations using Defender for Endpoint configuration management cannot read exclusions directly from the registry and should use supported cmdlets such as `Get-MpPreference`.

## 4. Onboarding policy mistakes in Intune

The Learn troubleshooting article for onboarding through Intune lists these known non-compliance cases:

| Symptom | Cause given | Action |
|---|---|---|
| Compliant by SenseIsRunning, non-compliant by OrgId, Onboarding and OnboardingState | Windows setup (OOBE) was not completed after installation or upgrade | Wait for OOBE to complete |
| Compliant by OrgId, Onboarding and OnboardingState, non-compliant by SenseIsRunning | SENSE service startup type is Delayed Start | Usually resolves within 24 hours |
| Device is non-compliant | Onboarding and offboarding policies deployed to the same device at the same time | Make sure they are not deployed together |

It also lists error code 0x87D1FDE8 (Remediation failed) with causes such as a wrong blob signature, a missing registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection`, or deployment on an unsupported SKU. For that case the page names Enterprise, Education and Professional as supported and says server is not supported. If Intune policies do not propagate, the page suggests you might need to configure automatic MDM enrollment.

**Check:** Look in the event log `Microsoft\Windows\DeviceManagement-EnterpriseDiagnostics-Provider`, channel Admin. Event ID 1819 reports a failed set of a node value.

## 5. Security management for Defender for Endpoint

Security management lets devices that Intune does not manage receive security configurations. Microsoft Learn lists prerequisites: the Intune tenant is configured and the feature turned on, the Microsoft Entra ID and Intune endpoints are open in the firewall, and the Entra tenant ID in your Defender for Endpoint tenant matches the tenant ID in the SCP entry for your domain.

Troubleshooting order from the page:

1. Run the MDE Client Analyzer on Windows and review `MDE Client Analyzer Results.htm`.
2. If the device is missing from Entra ID or Intune, check `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\SenseCM\EnrollmentStatus`.
3. Match the error code to its cause.

Examples from Microsoft's table: codes 8 and 44 point to Intune tenant configuration, 13-14, 20, 24 and 25 to connectivity, 15 to a tenant mismatch, 16 and 17 to SCP misconfiguration, 40 to clock sync, 43 to a conflict with Configuration Manager, and 4 to management by the Configuration Manager agent. For code 4, the page says to turn off **Manage Security setting using Configuration Manager** under **Settings > Endpoints > Configuration Management > Enforcement Scope**. The page notes its error list is not complete.

## Quick checklist

- One owner per setting, documented.
- No duplicated policies left unassigned.
- One management method for Defender Antivirus.
- Effective settings reviewed in the Defender portal for problem devices.
- Onboarding and offboarding never deployed to the same device together.
- Tenant ID, SCP and firewall endpoints verified for security management.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Security baselines](https://www.m365.fm/entity/security-baselines/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)

## Sources

- [Microsoft Learn: Manage endpoint security policies in Intune](https://learn.microsoft.com/en-us/intune/device-configuration/endpoint-security/manage-policies)
- [Microsoft Learn: Troubleshoot Microsoft Defender Antivirus settings](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-settings)
- [Microsoft Learn: Troubleshoot Microsoft Defender for Endpoint onboarding issues](https://learn.microsoft.com/en-US/defender-endpoint/troubleshoot-onboarding)
- [Microsoft Learn: Troubleshoot onboarding issues related to security management for Microsoft Defender for Endpoint](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-security-config-mgt)
