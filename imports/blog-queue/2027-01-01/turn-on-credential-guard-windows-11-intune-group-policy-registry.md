---
title: "Turn On Credential Guard on Windows 11 With Intune, Group Policy or Registry"
summary: "How to enable, verify and disable Credential Guard on Windows 11 with Intune, Group Policy or the registry, based on Microsoft Learn: default enablement, exact settings and values, UEFI lock options, verification with msinfo32 and PowerShell, and event IDs."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [credential-guard, intune, windows-hello-for-business]
keypoints:
  - "Credential Guard is enabled by default on devices that meet the requirements, starting with Windows 11 22H2 and Windows Server 2025. An explicit setting overrides the default after a reboot."
  - "Enable it before a device joins a domain or before a domain user first signs in. Enabling it later may be too late, because secrets may already be compromised."
  - "In an Intune Settings catalog policy, choose Device Guard, Credential Guard, and then Enabled with UEFI lock or Enabled without lock. Choose without lock if you want to turn it off remotely."
  - "Group Policy path is Computer Configuration, Administrative Templates, System, Device Guard, Turn On Virtualization Based Security. Restart the device after the policy applies."
  - "Verify with msinfo32 or the Win32_DeviceGuard PowerShell query, where SecurityServicesRunning returns 1 when it runs. Task Manager and LsaIso.exe is not a recommended check."
faq:
  - q: "Is Credential Guard on by default in Windows 11?"
    a: "According to Microsoft Learn, starting in Windows 11 22H2 and Windows Server 2025 it is enabled by default on devices that meet the requirements. The requirements themselves are on a separate overview page."
  - q: "Which option should I choose to be able to turn it off remotely?"
    a: "According to Microsoft Learn, choose Enabled without lock. With UEFI lock, disabling needs a procedure with physical presence at the device."
  - q: "How do I check that it runs?"
    a: "Learn lists System Information (msinfo32), where Credential Guard appears next to Virtualization-based Security Services Running, and a PowerShell query of Win32_DeviceGuard that returns 1 when it is running."
  - q: "Which registry values enable it?"
    a: "According to Microsoft Learn, EnableVirtualizationBasedSecurity set to 1 and RequirePlatformSecurityFeatures set to 1 or 3 under HKLM SYSTEM CurrentControlSet Control DeviceGuard, and LsaCfgFlags set to 1 or 2 under Control Lsa."
---

You can turn on Credential Guard with a Microsoft Intune Settings catalog policy, a Group Policy setting, or registry values, and then restart the device. On Windows 11 22H2 and later it may already be on by default. This guide follows the Microsoft Learn article on configuring Credential Guard, which was updated in 2026.

## Default enablement

Learn says that starting in Windows 11 22H2 and Windows Server 2025, Credential Guard is enabled by default on devices that meet the requirements. The requirements are not listed on the configure page, which links to an overview. Administrators can explicitly enable or disable it, and explicitly configured values overwrite the default state after a reboot. If Credential Guard was explicitly turned off before an update to a version where it is on by default, it stays disabled after the update.

## Timing matters

Learn says Credential Guard should be enabled before a device is joined to a domain or before a domain user signs in for the first time. If it is enabled after domain join, the user and device secrets may already be compromised.

## Enable with Intune

Create a Settings catalog policy with this setting:

| Category | Setting | Value |
|---|---|---|
| Device Guard | Credential Guard | Enabled with UEFI lock, or Enabled without lock |

If you want to be able to turn Credential Guard off remotely, choose **Enabled without lock**. Assign the policy to a group of devices or users. Learn also mentions that an account protection profile in endpoint security can configure it.

As an alternative you can use a custom policy with the DeviceGuard Policy CSP:

| Setting | OMA-URI | Type | Value |
|---|---|---|---|
| Turn On Virtualization Based Security | `./Device/Vendor/MSFT/Policy/Config/DeviceGuard/EnableVirtualizationBasedSecurity` | int | `1` |
| Credential Guard Configuration | `./Device/Vendor/MSFT/Policy/Config/DeviceGuard/LsaCfgFlags` | int | `1` for UEFI lock, `2` without lock |

Restart the device after the policy applies.

## Enable with Group Policy

Use the Local Group Policy Editor for one device, or create or edit a GPO for devices joined to Active Directory. The setting is:

| Path | Setting | Value |
|---|---|---|
| Computer Configuration, Administrative Templates, System, Device Guard | Turn On Virtualization Based Security | Enabled, then choose an option in the Credential Guard Configuration dropdown |

The dropdown options are **Enabled with UEFI lock** and **Enabled without lock**. As with Intune, choose without lock if you want to turn it off remotely. Restart after the policy applies.

## Enable with the registry

| Key path | Value name | Type | Data |
|---|---|---|---|
| HKLM, SYSTEM, CurrentControlSet, Control, DeviceGuard | EnableVirtualizationBasedSecurity | REG_DWORD | 1 |
| HKLM, SYSTEM, CurrentControlSet, Control, DeviceGuard | RequirePlatformSecurityFeatures | REG_DWORD | 1 for Secure Boot, 3 for Secure Boot and DMA protection |
| HKLM, SYSTEM, CurrentControlSet, Control, Lsa | LsaCfgFlags | REG_DWORD | 1 for UEFI lock, 2 without lock |

Restart the device to apply the change. Learn adds that you can set these entries through the FirstLogonCommands unattend setting.

## Verify

Learn says that checking Task Manager for `LsaIso.exe` is not a recommended method. Use one of these:

- **System Information:** run `msinfo32.exe`, select **System Summary**, and confirm **Credential Guard** next to **Virtualization-based Security Services Running**.
- **PowerShell**, from an elevated session:

```powershell
(Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard).SecurityServicesRunning
```

The result 0 means disabled and 1 means running.

- **Event Viewer:** open `Windows Logs\System` and filter for the source WinInit. Event 13 says Credential Guard was started. Event 14 shows the configuration, where 0x1 or 0x2 means configured to run, and the second value should always be 0 for protect mode. Event 15 is a warning that the secure kernel is not running. Events 16 and 17 report a launch failure and an error reading the UEFI configuration.

## Disable

How you disable it depends on the configuration. If it runs in a virtual machine, the host can disable it. If it is on with UEFI lock, you need the UEFI lock procedure. If it is on without lock, or by default, use Intune, Group Policy or the registry.

- **Intune:** set the Settings catalog value to **Disabled**, or set `LsaCfgFlags` to `0` in the CSP.
- **Group Policy:** set Turn On Virtualization Based Security to **Disabled**.
- **Registry:** set `LsaCfgFlags` to `0` under `HKLM\SYSTEM\CurrentControlSet\Control\Lsa` and under `HKLM\SOFTWARE\Policies\Microsoft\Windows\DeviceGuard`. Learn notes that deleting these entries may not disable it, so set them to 0.

Restart the device after each change. The UEFI lock procedure needs physical presence at the machine. It copies SecConfig.efi, creates a boot entry with `bcdedit`, and shows a confirmation prompt at boot that must be confirmed. For a virtual machine, the host can run `Set-VMSecurity -VMName <VMName> -VirtualizationBasedSecurityOptOut $true`. Use the exact command list from the Learn page for the UEFI case.

## Suggestion: a safe rollout

This section is a practical suggestion and not a Microsoft statement.

1. Pilot the policy with **Enabled without lock**, so you can reverse it if an app breaks.
2. Check the known issues article that Learn links before you widen the scope.
3. Verify on several devices with the PowerShell query and the event log.
4. Consider UEFI lock only after the pilot, because reversing it needs a person at the device.

## Not covered

The pages I read do not describe the following:

- The hardware and software requirements for default enablement, which are on the overview page.
- The contents of the known issues and additional mitigations articles.
- Whether Windows 10 is covered by default enablement.

## Related

- [Credential Guard](https://www.m365.fm/entity/credential-guard/)
- [Intune](https://www.m365.fm/entity/intune/)
- [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/)

## Sources

- [Configure Credential Guard](https://learn.microsoft.com/windows/security/identity-protection/credential-guard/configure)
