---
title: "Hybrid Joined PCs and Intune: How Co-Management Works"
summary: "How hybrid joined PCs are managed with Intune through co-management: prerequisites, the two paths, the seven workloads, pilot versus full switching, and the mistakes Microsoft warns about."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [co-management, hybrid-entra-join, intune, configuration-manager]
keypoints:
  - "Co-management means a Windows device is managed by Configuration Manager and Intune at the same time. It needs the Configuration Manager client and Intune enrollment."
  - "Supported join types are Microsoft Entra hybrid joined and Microsoft Entra joined. Entra registered only is not supported."
  - "Seven workloads can move to Intune, one at a time: compliance, Windows Update, resource access, Endpoint Protection, device configuration, Office apps and client apps."
  - "Configure and deploy a workload in Intune before you switch it, and make sure only one tool manages it."
  - "Clean up duplicate Entra device objects before enabling co-management, or devices may fail to enroll."
faq:
  - q: "Is co-management the same as hybrid join?"
    a: "No. Microsoft Learn says co-management is a management option, while Microsoft Entra hybrid join is an identity option. A device can be hybrid joined without being co-managed, and co-management also works for devices that are only Entra joined."
  - q: "Do I have to move all workloads to Intune at once?"
    a: "No. Microsoft Learn says you can switch each workload individually and pilot a workload with a separate collection of devices first. Until a workload is switched, Configuration Manager keeps managing it."
  - q: "Which join types work with co-management?"
    a: "According to Microsoft Learn, Microsoft Entra hybrid joined and Microsoft Entra joined devices are supported. Devices that are only Microsoft Entra registered are not supported."
  - q: "Does co-management manage PCs that are off the corporate network?"
    a: "Not by itself. Microsoft Learn says the client still needs to communicate with its assigned site. A cloud management gateway (CMG) is the documented way to reach internet-based clients. It is not required for co-management, and co-management is not required for a CMG."
  - q: "Is hybrid join recommended for new devices?"
    a: "The Windows Autopilot requirements page says Microsoft recommends deploying new devices as cloud-native with Microsoft Entra join and does not recommend deploying new devices as hybrid joined, including through Autopilot. The hybrid join page lists reasons existing organizations still use it, such as Group Policy."
---
Hybrid joined PCs can be managed by Intune through **co-management**. The device keeps its Configuration Manager client and is also enrolled in Intune. You then decide, workload by workload, which tool is in charge. This article explains the parts, the setup path and the warnings Microsoft Learn gives.

## Hybrid join and co-management are different things

A hybrid joined device is joined to on-premises Active Directory and registered with Microsoft Entra ID. Microsoft Learn describes it as an identity option for organizations with existing Windows Server AD. Such devices need network line of sight to domain controllers from time to time. Without it they become unusable.

Co-management is a management option: Windows devices managed by Configuration Manager and Microsoft Intune together. Microsoft Learn lists the benefits for existing clients:

- Conditional Access with device compliance
- Intune remote actions such as restart, remote control and factory reset
- Central device health visibility
- Linking users, devices and apps with Microsoft Entra ID
- Modern provisioning with Windows Autopilot

Managing devices with Configuration Manager plus a third-party MDM is called coexistence, not co-management. It has more limits because workloads can't be balanced between the two.

## Prerequisites

From the co-management overview:

- **Windows:** a version that Intune supports.
- **Join type:** Microsoft Entra hybrid joined or Microsoft Entra joined. Microsoft Entra registered only is not supported.
- **Configuration Manager:** a supported current branch version. Several Configuration Manager instances can connect to one Intune tenant.
- **Intune:** Intune set up and Windows automatic enrollment enabled.
- **Licensing:** Microsoft Entra ID P1 or P2. An Enterprise Mobility + Security subscription includes both and Intune. At least one Intune license is needed for the admin who signs in to the Intune admin center, otherwise sign-in can fail with *An unanticipated error occurred*.

Enabling co-management does not require onboarding the site to Microsoft Entra ID. Internet-based clients need a CMG, and the CMG does require it.

## The two paths

1. **Existing Configuration Manager clients.** Set up hybrid Microsoft Entra join and let the clients enroll in Intune automatically.
2. **New internet-based devices.** Devices join Microsoft Entra ID and enroll in Intune automatically. You then install the Configuration Manager client.

For a pure hybrid scenario without Configuration Manager, the Windows enrollment guide describes Group Policy enrollment: devices must be hybrid joined, and you create the policy **Enable automatic MDM enrollment using default Microsoft Entra credentials** in on-premises AD. Microsoft adds that Windows Autopilot may be the better cloud-native option.

## Enable co-management

Microsoft recommends the co-management setup guide in the Microsoft 365 admin center. In the Configuration Manager console (version 2111 and later) the steps are:

1. Go to **Administration** > **Cloud Services** > **Cloud Attach**.
2. Select **Configure Cloud Attach**.
3. On **Onboarding**, choose the Azure environment and sign in as a Microsoft Entra Global Administrator. The sign-in is used once for the wizard.
4. On **Enablement**, set **Automatic enrollment in Intune** to **Pilot**, **All** or **None**. With **Pilot**, only clients in the **Intune Auto Enrollment** collection enroll.
5. On **Workloads**, choose **Pilot Intune** or **Intune** for each workload, or leave them unchanged and switch later.
6. On **Staging**, name the pilot collection for each workload set to **Pilot Intune**.

The wizard does not move workloads when you enable co-management. Enrollment is also not instant: Configuration Manager randomizes it, and Microsoft gives the example of 100,000 clients enrolling over several days.

## Clean up Entra duplicates first

Microsoft warns that stale duplicate device objects in Microsoft Entra ID can make devices fail to enroll. They usually appear when a device first joins as Entra registered and later becomes hybrid joined, leaving two records with different join types. Clean these up before you enable co-management.

## The seven workloads

| Workload | What it covers |
|---|---|
| Compliance policies | Rules for Conditional Access and compliance monitoring |
| Windows Update policies | Deferral policies for feature and quality updates |
| Resource access policies | VPN, Wi-Fi, email and certificates |
| Endpoint Protection | Defender suite, firewall and BitLocker |
| Device configuration | Device settings, and it also moves resource access and Endpoint Protection |
| Office Click-to-Run apps | Microsoft 365 Apps |
| Client apps | Apps and PowerShell scripts |

Rules to remember:

- Configure and deploy the workload in Intune before you switch it. Each workload should be managed by only one tool at a time.
- Switching back is possible but can have an impact. For example, Windows and Office versions installed by Intune stay at the later version.
- Resource access policies stopped being supported in Configuration Manager version 2203. From 2403 the node is removed and an upgrade is blocked if old policies remain.
- After switching Windows Update policies, adjust Configuration Manager client settings by hand so both tools do not manage updates.

## When hybrid join still fits

Microsoft's hybrid join page lists these good-fit cases: you want to keep Group Policy, keep existing imaging, or run Win32 apps that rely on Active Directory machine authentication. Otherwise Microsoft points to Entra join for cloud-native endpoints.

## What the pages do not say

The pages I read do not describe a slider control, and they do not name a minimum Windows build or Configuration Manager version for co-management in general.

## Related

- [Co-management](https://www.m365.fm/entity/co-management/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Configuration Manager](https://www.m365.fm/entity/configuration-manager/)

## Sources

- [Co-management for Windows devices](https://learn.microsoft.com/en-us/intune/configmgr/comanage/overview)
- [Enable co-management in Configuration Manager](https://learn.microsoft.com/en-us/intune/configmgr/comanage/how-to-enable)
- [Co-management workloads](https://learn.microsoft.com/en-us/intune/configmgr/comanage/workloads)
- [Microsoft Entra hybrid joined devices](https://learn.microsoft.com/en-us/entra/identity/devices/concept-hybrid-join)
- [Windows device enrollment guide for Intune](https://learn.microsoft.com/en-us/intune/device-enrollment/windows/guide)
- [Windows Autopilot requirements](https://learn.microsoft.com/en-us/autopilot/requirements)
