---
title: "Windows 11 26H2: What Is New and What Admins Need to Know"
summary: "Windows 11 version 26H2 (the 2026 Update) is an enablement package for 25H2 and 24H2. This guide covers new features, support lifecycle, rollout, admin steps and the known issues Microsoft lists."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [windows-update-for-business, windows-autopatch, windows-autopilot]
keypoints:
  - "Windows 11 version 26H2, also called the Windows 11 2026 Update, is generally available for eligible devices on 25H2 or 24H2."
  - "It is delivered as a small enablement package that installs like a monthly update and needs one restart."
  - "Installing 26H2 resets the support lifecycle: 24 months for Home and Pro, 36 months for Enterprise and Education."
  - "Windows settings backup, app-specific taskbar actions and File Explorer improvements are now enabled by default. Existing admin policies still apply."
  - "Microsoft recommends piloting first, testing business-critical apps, then expanding through update rings while monitoring Windows release health."
faq:
  - q: "Is Windows 11 26H2 a full upgrade?"
    a: "No. The Windows IT Pro Blog says it is delivered as an enablement package for eligible devices on 25H2 or 24H2. The package activates features already on the device, is a small download and typically installs faster."
  - q: "How long is Windows 11 26H2 supported?"
    a: "According to the Windows IT Pro Blog and the Message Center post MC1482225, installing 26H2 resets the support lifecycle to 24 months for Home and Pro and 36 months for Enterprise and Education."
  - q: "What should admins do first?"
    a: "MC1482225 says no immediate action is required. When ready, validate on a targeted set of devices, test business-critical apps, hardware and workflows, then expand through existing update rings and monitor deployment health."
  - q: "How can a user get 26H2 early?"
    a: "Microsoft Support says to go to Settings > Windows Update and turn on Get the latest updates as soon as they're available. Microsoft may apply safeguard holds to devices with known compatibility issues."
  - q: "Are there known issues?"
    a: "Yes. The Microsoft Support update history for 26H2 lists issues with File History, Credential Guard machine accounts and domain trust, USB Audio Class 1.0 devices, and a black screen after sign-in on Azure Virtual Desktop hosts that use FSLogix, with fixes in named updates."
---

Windows 11, version 26H2, which Microsoft also calls the Windows 11 2026 Update, is the annual feature update for Windows 11. It is generally available for eligible devices on Windows 11 25H2 or 24H2, and it installs as a small enablement package. For admins the main points are the lifecycle reset, the features that are now on by default, the rollout controls and the known issues. This guide summarizes what Microsoft documents as of mid-November 2026.

## How 26H2 is delivered

The Windows IT Pro Blog (September 29, 2026) says 26H2 is delivered as an enablement package for eligible devices on 25H2 or 24H2. The package activates features already present on the device, installs like a monthly quality update and is a small download. Microsoft Support adds that it needs one restart. Message Center post MC1482225 explains why: 26H2 shares a servicing branch and code base with 25H2 and 24H2, so a full OS swap is not required.

Microsoft describes the release as a controlled feature rollout. Availability expands over time, and Microsoft may apply safeguard holds to devices with known compatibility issues. Status is posted on the Windows release health hub.

Commercial and education customers can get it through existing tools. MC1482225 names Windows Autopatch and the Microsoft 365 admin center, and notes that downloads in the admin center may be delayed.

## What is new

The Windows IT Pro Blog groups the changes as follows.

**Security**
- Administrator protection, with just-in-time admin privileges, configurable through Intune or Group Policy.
- Built-in Sysmon, off by default.
- Smart App Control can be toggled without a clean install.
- Windows Hello Enhanced Sign-in Security extends to more peripheral fingerprint sensors.
- ML-KEM and ML-DSA post-quantum APIs through CNG and .NET.
- Driver trust changes that remove default trust for cross-signed drivers.

**Management and deployment**
- Autopilot device preparation adds device association.
- Settings backup and restore extends first sign-in restore to Entra hybrid joined devices, Cloud PCs and multi-user environments.
- Point-in-time restore rolls a PC back to a recent automatic restore point.
- Policy-based removal of preinstalled MSIX and APPX apps on Enterprise and Education.
- RSAT on Arm64, and app update orchestration with Windows Update.

**User experience and accessibility**
- File Explorer AI actions and archive format support.
- Windows Search previews and better typo handling.
- New Start and taskbar options, including a smaller taskbar.
- Task Manager NPU visibility, and improvements to Magnifier, Narrator (Braille Viewer) and Voice Access.

Many of these features were delivered earlier through monthly cumulative updates and are activated by the enablement package, according to the same post. Some have eligibility requirements.

## Features now on by default

Microsoft Support and MC1482225 name three features that were previously under temporary commercial control and are now on by default:

- **Windows settings backup**, which preserves supported settings and Microsoft Store app lists for recovery and device replacement.
- **App-specific taskbar actions.**
- **File Explorer** navigation and usability improvements.

Existing administrator policies for settings backup are still honored. Review the defaults and adjust policies if your organization does not want them.

## Support lifecycle

Installing 26H2 resets the support lifecycle, per the IT Pro Blog, the Support page and MC1482225:

| Edition | Months of support |
|---|---|
| Home | 24 |
| Pro | 24 |
| Enterprise | 36 |
| Education | 36 |

## Admin checklist

MC1482225 says no immediate action is required. Microsoft's recommended steps for when you are ready to deploy are:

1. Validate 26H2 on a pilot or targeted set of devices.
2. Test business-critical apps, representative hardware and workflows.
3. Review the default-enabled features and adjust policies or configuration as needed.
4. Expand deployment through existing update rings and processes.
5. Monitor deployment health and safeguard holds on Windows release health.
6. Review security and compliance requirements, and prepare support staff for the changes.

MC1482225 also says Microsoft published an updated 26H2 security baseline, and that refreshed ADMX templates and the Group Policy Settings Reference are available. These are listed as resources, not as numbered steps.

To get the update early on a single device, Microsoft Support says to open **Settings > Windows Update** and turn on **Get the latest updates as soon as they're available**.

## Known issues Microsoft lists

The Microsoft Support update history for 26H2, last updated around November 10, 2026, lists these items:

- **File History (September 2026 update):** some users cannot create or update backups and may see a "Reconnect your drive" message. Fixed in updates released on or after September 22, 2026, such as KB5124010.
- **Domain trust (KB5124008 and later):** Credential Guard protected machine accounts can lose their secure channel with on-premises Active Directory. The cause given is that KB5124008 and later updates enable the Machine Identity Isolation feature, which is only supported in environments connected to domain controllers running at a Windows Server 2025 domain functional level. KB5124010 disables Machine Identity Isolation enforcement.
- **USB Audio Class 1.0 devices:** some fail to start (Code 10) or produce no sound. Fixed in KB5132061.
- **Black screen after sign-in:** mainly on Azure Virtual Desktop hosts that use FSLogix. Fixed in KB5127648.

The latest listed update on that page is KB5132061 from November 10, 2026, covering OS builds 26300.9974, 26200.9974 and 26100.9974.

## What the sources do not cover

The IT Pro Blog does not cover consumer-specific changes, Intune or Autopatch availability details or Defender reporting. Intune and Autopatch availability for 26H2 and the Defender device version filter come up only in reader comments, which are not documentation. Check Windows release health and your own update ring configuration for tenant-specific status.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Windows IT Pro Blog: An IT pro's guide to Windows 11, version 26H2](https://techcommunity.microsoft.com/blog/windows-itpro-blog/an-it-pro%e2%80%99s-guide-to-windows-11-version-26h2/4559760)
- [Microsoft Support: Windows 11, version 26H2 update history](https://support.microsoft.com/en-us/help/5130367)
- [Message Center MC1482225: How to get the Windows 11 2026 Update (mirror)](https://mc.merill.net/message/MC1482225)
