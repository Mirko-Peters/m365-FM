---
title: "Managing AVD session hosts with Intune: configuration, compliance and updates"
summary: "Microsoft Intune manages Azure Virtual Desktop session hosts as Windows Enterprise devices once they are enrolled, but personal single-session hosts and pooled multi-session hosts follow different rules. This article compares the two on enrollment, configuration, compliance and update control, with the documented limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, intune]
keypoints:
  - "Intune supports personal single-session hosts running Windows Enterprise and pooled Windows Enterprise multi-session hosts. Multi-session management is documented as generally available."
  - "Entra joined hosts are enrolled with the Enroll the VM with Intune option in the Azure portal. Hybrid joined hosts use group policy auto-enrollment or Configuration Manager co-management. Multi-session does not support enrollment with user credentials."
  - "On multi-session hosts, templates other than certificates are not supported, so configuration goes through the settings catalog, and user-scope and device-scope settings must be assigned to users and devices respectively."
  - "Compliance policies for multi-session must target the device group, and only a listed set of settings is evaluated; the rest report Not applicable."
  - "Windows Update ring policies are not supported on multi-session hosts. Learn documents quality update settings through the settings catalog instead, and cloned images of enrolled machines are not supported."
faq:
  - q: "Can I enroll a golden image in Intune and clone it for new session hosts?"
    a: "No. Microsoft Learn says Intune does not support using a cloned image of a computer that is already enrolled, and it names Azure Virtual Desktop VMs explicitly. Enroll the session hosts after they are created from the image."
  - q: "Do Windows Update rings work for multi-session session hosts?"
    a: "Learn lists Windows Update ring policies as not supported for Windows Enterprise multi-session. It documents the settings catalog for Windows Update client policies for quality updates, with settings such as active hours, deadlines and deferral of quality updates."
  - q: "What happens in Intune when I delete a session host VM in Azure?"
    a: "Deleting the VM leaves an orphaned device record in Intune. Learn says Intune tries to remove records of devices that have been inactive for 60 days or more, that deletion is not guaranteed at 60 days, and that tenant cleanup rules also apply."
---

Microsoft Intune manages Azure Virtual Desktop session hosts like other Windows Enterprise devices once they are enrolled, with documented differences between personal single-session hosts and pooled multi-session hosts. The differences decide how you enroll, which policies apply, how compliance is evaluated and how you control updates. This article compares the two models using Microsoft Learn's Intune pages. Sources are listed at the end, retrieved on 17 November 2026. Update planning in general is a separate article in this series.

## The two supported models

| | Personal, single-session | Pooled, multi-session |
|---|---|---|
| Edition | Windows Enterprise | [Windows Enterprise multi-session](/entity/windows-enterprise-multi-session/) |
| Host pool type | [Personal](/entity/avd-personal-host-pool/) remote desktops | [Pooled](/entity/avd-pooled-host-pool/) host pools deployed through Azure Resource Manager |
| How Learn describes management | Treated like Windows Enterprise physical desktops | Managed like a shared Windows client device, with the limits below |
| Join type | Entra hybrid joined or Entra joined, enrolled in Intune | Entra hybrid joined or Entra joined, enrolled in Intune |
| Agent requirement | None stated | Azure Virtual Desktop agent 1.0.2944.1400 or later |
| Status on Learn | No preview label | Described as generally available, no preview label |

Both models require the session hosts to be in an Azure subscription associated with the same Microsoft Entra tenant as Intune. Session hosts joined only to Microsoft Entra Domain Services or Active Directory Domain Services are not supported for multi-session. Learn says Intune management does not depend on or interfere with Azure Virtual Desktop management of the same VM. Citrix DaaS and VMware Horizon Cloud are not supported for multi-session.

## Enrollment

For Entra joined hosts, Learn says to enable **Enroll the VM with Intune** in the Azure portal. The pages retrieved do not say which wizard tab holds the option, so look for it in the host creation flow. For hybrid joined hosts, Learn lists three methods for single-session hosts: group policy auto-enrollment, Configuration Manager co-management and user self-enrollment. For multi-session hosts it lists the first two, and the group policy must use **Device credentials**. Enrollment with user credentials is not supported for multi-session. With co-management, set the Resource Access Policies workload slider to **Intune** or **Pilot Intune**.

Four limits catch teams early.

- **Cloned images.** Intune does not support a cloned image of a machine that is already enrolled, physical or virtual. Enroll hosts after deployment, not inside the golden image.
- **Several MDM providers.** Learn lists as a known issue that auto-enrollment fails if the tenant has more than one MDM provider, with a note that a fix is planned.
- **Windows Autopilot.** Out-of-box enrollment is not supported for multi-session. That includes Autopilot, Commercial OOBE and the Enrollment status page.
- **Clouds.** Cross-cloud enrollment is not supported, for example an Azure Government VM into a public cloud tenant. Multi-session is supported in GCC, GCC High and DoD, and not in the China sovereign cloud.

Retirement matters for pools that scale. Deleting a VM in Azure leaves an orphaned device record. Intune tries to remove records of devices inactive for 60 days or more, and Learn says this is not guaranteed at 60 days. Learn says these records are also cleaned up according to the cleanup rules configured for the tenant, so check those rules if your hosts are created and deleted often.

## Configuration

Personal hosts follow the physical-desktop model, so existing configurations largely apply. Learn names three exceptions for single-session: Domain Join and Wi-Fi profiles are not supported, the `RemoteDesktopServices/AllowUsersToConnectRemotely` policy must not be disabled, and the limitations for Windows virtual machines in general also apply.

Multi-session has more constraints, because it is treated as a separate OS edition.

1. **Use the settings catalog.** Templates other than certificates are not supported, so all policies are created through the settings catalog. In the settings picker, use the **Enterprise multi-session** OS edition filter to find supported settings. Trusted certificate, SCEP and PKCS certificate profiles work for device or user, and VPN works as device tunnel only.
2. **Match scope to assignment.** The catalog marks user-scope settings with (User). Device-scope settings go to device groups and user-scope settings go to users. The wrong combination is reported as Error or Not applicable.
3. **Check Administrative Templates.** ADMX-backed policies are supported, but some are not yet in the settings catalog, and some ADMX-ingested settings are not applicable to multi-session.
4. **Assign scripts by context.** System context scripts assigned to devices need **Run this script using the logged on credentials** set to No. User context scripts assigned to users need Yes.
5. **Deploy apps with Required or Uninstall.** The Available intent is not supported. Web apps do not apply, RemoteApp and MSIX app attach are not supported, and a system context Win32 app with a dependency on a user context app does not install.

If you use FSLogix, Learn adds two cautions: make sure tokens are not roamed or duplicated across devices, using a supported FSLogix version with token roaming disabled, and do not configure modern apps where FSLogix is configured, which is a known single-session issue. See [FSLogix](/entity/fslogix/).

## Compliance

Intune compliance policies evaluate managed devices against rules, and a noncompliant result can trigger actions. By default each policy marks a device noncompliant if it fails a rule. The tenant setting for devices with no policy defaults to Compliant; Learn advises changing it to Not compliant if you use Conditional Access with compliance policies. See [device compliance](/entity/device-compliance/) and [Conditional Access](/entity/conditional-access/).

For multi-session hosts, three rules apply. Compliance policies must target the device group; user-targeted compliance is not supported. Only these settings are evaluated: minimum and maximum OS version, valid OS builds, simple passwords, password type, length, complexity, expiration and history, Microsoft Defender Antimalware including security intelligence and minimum version, firewall, antivirus, antispyware, real-time protection and Defender for Endpoint risk score. Every other policy reports Not applicable. Conditional Access policies support both user and device based configurations. Plan to review the "Not applicable" results before you interpret a compliant status as proof that a setting was checked.

## Updates

Update control differs the most. For multi-session, Windows Update ring policies are not supported. Learn documents Windows Update client policies through the settings catalog for quality updates, with these settings: Active Hours Start, End and Max Range, Block "Pause Updates" ability, Configure Deadline Grace Period, Defer Quality Updates Period (Days), Pause Quality Updates Start Time and Quality Update Deadline Period (Days). The pages retrieved do not list feature update policies for multi-session.

For personal hosts, Learn says Intune treats them like physical Windows Enterprise desktops. It does not list update rings separately for single-session, so test your ring assignment on a pilot host before assuming parity with physical devices. See [update rings](/entity/intune-update-rings/) and [Windows Update for Business](/entity/windows-update-for-business/). Whether to patch running pooled hosts or replace them from an updated image is a design choice that Learn's Intune pages do not address; the series article on update strategies covers it.

Learn also recommends reviewing the available security baselines and setting the recommended values in the settings catalog.

## Remote actions

Several remote actions are not supported or recommended on session hosts, and they are disabled for multi-session in the UI and Graph: Windows Autopilot reset, BitLocker key rotation, Fresh Start, Remote lock, Reset password and Wipe. Learn's What's new page lists a separate item from July 2026: Intune Remote Help supports remote assistance in Azure Virtual Desktop RemoteApp sessions.

## A short checklist

- Decide per host pool whether it is personal or pooled, and read that column of the table above.
- Create device groups for the session hosts and target compliance and device-scope settings at them.
- Build policies in the settings catalog and filter for Enterprise multi-session.
- Keep enrollment out of the golden image.
- Plan cleanup of orphaned device records.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Microsoft Intune](/entity/intune/)
- [AVD session host](/entity/avd-session-host/)
- [Microsoft Entra join for AVD](/entity/avd-entra-join/)

## Sources

All retrieved on 2026-11-17.

- [Microsoft Learn: Using Azure Virtual Desktop with Intune](https://learn.microsoft.com/en-us/mem/intune/fundamentals/azure-virtual-desktop)
- [Microsoft Learn: Using Azure Virtual Desktop multi-session with Intune](https://learn.microsoft.com/en-us/mem/intune/fundamentals/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Get started with device compliance in Intune](https://learn.microsoft.com/en-us/mem/intune/protect/device-compliance-get-started)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
