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
  - "On multi-session hosts only the certificate templates (trusted certificate, SCEP, PKCS) and the VPN template (device tunnel only) are supported, so other configuration goes through the settings catalog, and user-scope and device-scope settings must be assigned to users and devices respectively."
  - "Compliance policies for multi-session must target the device group, and only a listed set of settings is evaluated; the rest report Not applicable."
  - "Windows Update ring policies are not supported on multi-session hosts, and Learn's update management page recommends session host update or Azure Compute Gallery images for multi-session, not Windows Update. Session host update needs a host pool with a session host configuration, is limited to the global Azure cloud and does not keep manual customizations. Cloned images of enrolled machines are not supported."
faq:
  - q: "Can I enroll a golden image in Intune and clone it for new session hosts?"
    a: "No. Microsoft Learn says Intune does not support using a cloned image of a computer that is already enrolled, and it names Azure Virtual Desktop VMs explicitly. Enroll the session hosts after they are created from the image."
  - q: "Do Windows Update rings work for multi-session session hosts?"
    a: "Learn lists Windows Update ring policies as not supported for Windows Enterprise multi-session. Its update management page marks Windows Update as not recommended and Windows Autopatch as not supported for multi-session, and recommends session host update (which needs a host pool with a session host configuration) or Azure Compute Gallery images. The settings catalog offers quality update settings such as active hours, deadlines and deferral, for in-place patching."
  - q: "What happens in Intune when I delete a session host VM in Azure?"
    a: "Deleting the VM leaves an orphaned device record in Intune. For personal hosts, Learn says these records are cleaned up according to the cleanup rules configured for the tenant. For multi-session hosts, Learn adds that Intune attempts to delete records of devices inactive for 60 days or more, separate from admin-configured cleanup rules, and that deletion is not guaranteed at 60 days."
---

Microsoft Intune manages Azure Virtual Desktop session hosts like other Windows Enterprise devices once they are enrolled, with documented differences between personal single-session hosts and pooled multi-session hosts. The differences decide how you enroll, which policies apply, how compliance is evaluated and how you control updates. This article compares the two models using Microsoft Learn's Intune pages. Update planning in general is a separate article in this series.

## The two supported models

| | Personal, single-session | Pooled, multi-session |
|---|---|---|
| Edition | Windows Enterprise | [Windows Enterprise multi-session](/entity/windows-enterprise-multi-session/) |
| Host pool type | [Personal](/entity/avd-personal-host-pool/) remote desktops | [Pooled](/entity/avd-pooled-host-pool/) host pools deployed through Azure Resource Manager |
| How Learn describes management | Treated like Windows Enterprise physical desktops | Treated as a separate OS edition; some Windows Enterprise configurations are not supported (see Configuration) |
| Join type | Entra hybrid joined or Entra joined, enrolled in Intune | Entra hybrid joined or Entra joined, enrolled in Intune |
| Agent requirement | Not specified on the single-session page | Azure Virtual Desktop agent 1.0.2944.1400 or later |

Both models require the session hosts to be in an Azure subscription associated with the same Microsoft Entra tenant as Intune. Learn describes Intune management of multi-session hosts as generally available. Multi-session hosts must be Microsoft Entra hybrid joined or Microsoft Entra joined, and the multi-session page says that session hosts joined to Microsoft Entra Domain Services cannot be managed with Intune. Learn says Intune management does not depend on or interfere with Azure Virtual Desktop management of the same VM. Citrix DaaS and VMware Horizon Cloud are not supported for multi-session. Learn also says the appropriate Azure Virtual Desktop and Intune licenses are required.

## Enrollment

For Entra joined hosts, Learn says to enable **Enroll the VM with Intune** in the Azure portal. Learn says you can deploy Microsoft Entra joined VMs from the Azure portal when you create a new host pool or expand an existing one. On the **Virtual Machines** tab, selecting **Microsoft Entra ID** gives you the option to enroll VMs with Intune automatically. For hybrid joined hosts, Learn lists three methods for single-session hosts: group policy auto-enrollment, Configuration Manager co-management and user self-enrollment. For multi-session hosts it lists the first two, and the group policy must use **Device credentials**. Enrollment with user credentials is not supported for multi-session.

Four limits catch teams early.

- **Cloned images.** Intune does not support a cloned image of a machine that is already enrolled, physical or virtual. Enroll hosts after deployment, not inside the golden image.
- **Several MDM providers.** The multi-session page lists more than one MDM provider, which is not supported, as a cause of failed hybrid-joined enrollment. The single-session page lists it as a known issue with a note that a fix is planned.
- **Windows Autopilot.** Out-of-box enrollment is not supported for multi-session. That includes Autopilot, Commercial OOBE and the Enrollment status page.
- **Clouds.** Cross-cloud enrollment is not supported, for example an Azure Government VM into a public cloud tenant. Multi-session is supported in GCC, GCC High and DoD, and not in the China sovereign cloud.

Retirement matters for pools that scale. Deleting a VM in Azure leaves an orphaned device record. For personal hosts, Learn says the records are cleaned up according to the cleanup rules configured for the tenant, and names no fixed period. The multi-session page describes a separate mechanism: Intune attempts to permanently delete records of devices inactive for 60 days or more, independent of admin-configured cleanup rules, and says deletion is not guaranteed at 60 days and can take longer. Check your tenant cleanup rules if hosts are created and deleted often.

## Configuration

Personal hosts follow the physical-desktop model, which Learn says lets you use some of your existing configurations. Learn names three exceptions for single-session: Domain Join and Wi-Fi profiles are not supported, the `RemoteDesktopServices/AllowUsersToConnectRemotely` policy must not be disabled, and the limitations for Windows virtual machines in general also apply.

Multi-session has more constraints, because it is treated as a separate OS edition.

1. **Use the settings catalog.** In the Intune admin center, go to **Devices** > **By platform** > **Windows** > **Manage devices** > **Configuration** > **Create** > **New Policy**, select **Windows 10 and later** as the platform and **Settings catalog** as the profile type. Learn lists only four templates as supported: trusted certificate, SCEP certificate and PKCS certificate (device scope when targeting devices, user scope when targeting users), and VPN as device tunnel only. Create other policies through the settings catalog. In the settings picker, select **Add filter** and set OS edition == **Enterprise multi-session** to list the supported settings. For certificate profiles with Configuration Manager co-management, set the Resource Access Policies workload slider to **Intune** or **Pilot Intune** in Configuration Manager; Learn says this lets Windows clients start requesting the certificate.
2. **Match scope to assignment.** The catalog marks user-scope settings with (User). Device-scope settings go to device groups and user-scope settings go to users. The wrong combination is reported as Error or Not applicable.
3. **Check Administrative Templates.** ADMX-backed policies are supported, but some are not yet in the settings catalog, and some ADMX-ingested settings are not applicable to multi-session.
4. **Assign scripts by context.** System context scripts assigned to devices need **Run this script using the logged on credentials** set to No. User context scripts assigned to users need Yes.
5. **Deploy apps with Required or Uninstall.** Learn says all apps must install in the system or device context and be targeted to devices. The Available intent is not supported. Web apps do not apply, RemoteApp and MSIX app attach are not supported, and a system context Win32 app with a dependency on a user context app does not install.

If you use FSLogix, Learn adds two cautions. First, Intune does not currently support token roaming between devices, so make sure tokens are not unexpectedly roamed or duplicated, and confirm that you run a supported FSLogix version and configuration with token roaming disabled. Second, do not configure modern apps where FSLogix is configured, which is a known single-session issue. See [FSLogix](/entity/fslogix/).

## Compliance

Intune compliance policies evaluate managed devices against rules, and a noncompliant result can trigger actions. By default each policy marks a device noncompliant if it fails a rule. The tenant setting for devices with no policy defaults to Compliant; Learn advises changing it to Not compliant if you use Conditional Access with compliance policies. See [device compliance](/entity/device-compliance/) and [Conditional Access](/entity/conditional-access/).

For multi-session hosts, the rules are narrower. Compliance policies must target the device group; user-targeted compliance is not supported. Only these settings are evaluated: minimum and maximum OS version, valid OS builds, simple passwords, password type, length, complexity, expiration and history, Microsoft Defender Antimalware including security intelligence and minimum version, firewall, antivirus, antispyware, real-time protection and Defender for Endpoint risk score. Every other policy reports Not applicable. Conditional Access policies themselves support both user and device based configurations for multi-session. Plan to review the "Not applicable" results before you interpret a compliant status as proof that a setting was checked.

## Updates

Update control differs the most. The Intune pages do not compare update methods; Learn's update management page for session hosts does. That page, announced in What's new in September 2026, separates patching a running host in place from image-based servicing, which builds a new image version, deploys new hosts and drains the old ones. For monthly security and quality updates it marks the delivery methods as follows.

| Delivery method | Windows client Enterprise (single-session) | Windows client multi-session |
|---|---|---|
| Windows Update | Recommended | Not recommended |
| Windows Autopatch | Recommended | Not supported |
| Configuration Manager | Supported | Supported |
| Session host update | Not supported | Recommended |
| Azure Compute Gallery | Not recommended | Recommended |

Learn says image-based servicing through session host update is recommended for pooled environments because it provides consistent host configuration, easier rollback and reduced impact to active user sessions, and that user data and local storage are not saved when a host is updated this way. The series article on update strategies covers the decision; this section covers what applies to Intune.

"Recommended" for session host update comes with conditions:

- **Prerequisite.** Session host update works on host pools that have a session host configuration, not on standard host pools.
- **Status.** Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, on 9 July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.
- **Cloud.** Learn says session host update is only available in the global Azure cloud, not in other clouds such as Azure US Government or Azure operated by 21Vianet. Intune supports multi-session hosts in GCC, GCC High and DoD, so check that your cloud is covered before you plan around session host update.
- **Manual changes are lost.** Learn says files, registry keys or certificates added manually to session hosts are not present after an update, because the update creates new VMs. Restore them with Intune or Group Policy, put them into the image, or add them to the custom configuration PowerShell script in the session host configuration.

For multi-session, Windows Update ring policies are not currently supported in Intune; check the Intune page before you plan around that. Learn says to use the settings catalog for quality (security) update settings, in the Windows Update for Business category: Active Hours Start, End and Max Range, Block "Pause Updates" ability, Configure Deadline Grace Period, Defer Quality Updates Period (Days), Pause Quality Updates Start Time and Quality Update Deadline Period (Days). Given the table, treat these settings as a way to shape the in-place option that Learn marks Not recommended for multi-session hosts, not as the primary route.

For personal hosts, Learn says Intune treats them like physical Windows Enterprise desktops, and the single-session page does not discuss updates. The table marks Windows Update and Windows Autopatch as Recommended for Windows client Enterprise, so rings are the likely route; test your ring assignment on a pilot host before assuming parity with physical devices. See [update rings](/entity/intune-update-rings/) and [Windows Update for Business](/entity/windows-update-for-business/).

For multi-session hosts, Learn says security baselines are available and recommends reviewing them and configuring the recommended policies and values in the settings catalog. Endpoint security profiles can be configured for multi-session hosts when **Windows** is offered as the platform; if it is not offered, the profile is not supported there.

## Remote actions

Several remote actions are not supported or recommended on session hosts, and they are disabled for multi-session in the UI and Graph: Windows Autopilot reset, BitLocker key rotation, Fresh Start, Remote lock, Reset password and Wipe. Learn's What's new page lists an item from July 2026: Intune Remote Help supports remote assistance in Azure Virtual Desktop RemoteApp sessions.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Microsoft Intune](/entity/intune/)
- [AVD session host](/entity/avd-session-host/)
- [Microsoft Entra join for AVD](/entity/avd-entra-join/)

## Sources

All retrieved on 2026-11-17.

- [Microsoft Learn: Using Azure Virtual Desktop with Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop)
- [Microsoft Learn: Windows Enterprise multi-session remote desktops](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Get started with device compliance in Intune](https://learn.microsoft.com/en-us/mem/intune/protect/device-compliance-get-started)
- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-ad-joined-vm)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Windows update management methodologies for session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts)
