---
title: "Windows 11 Enterprise multi-session: what is different"
summary: "Windows 11 Enterprise multi-session allows several users to sign in at the same time on one VM, but it runs only in Azure Virtual Desktop, only in pooled host pools, and is managed and patched differently from Windows 11 Enterprise. This article lists the differences an admin meets when moving a single-session image or a policy set to it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-enterprise-multi-session, azure-virtual-desktop]
keypoints:
  - "Multi-session allows several concurrent interactive sessions on one VM. It is licensed through the same per-user licenses as Windows 11 Enterprise, but it may be used in production only in Azure Virtual Desktop and does not activate against on-premises KMS."
  - "It is an edition of its own: you cannot upgrade a Pro or Enterprise VM to it, and a VM moved to another edition cannot switch back. Learn's update page marks multi-session as not supported in personal host pools."
  - "It reports ProductType 3, the same value as Windows Server, so some installers refuse to run on it."
  - "Management differs. Intune treats it as a separate edition with a smaller set of supported profiles, no Autopilot or update rings, and no Available app intent."
  - "Patching differs. Learn recommends session host update or Azure Compute Gallery images and marks Windows Update as not recommended, Windows Autopatch as not supported, and hotpatch as not supported."
faq:
  - q: "Is Windows 11 Enterprise multi-session licensed differently from Windows 11 Enterprise?"
    a: "Not according to Learn's prerequisites page, which lists Windows 11 Enterprise multi-session and Windows 11 Enterprise in the same row with the same internal-use licenses: Microsoft 365 E3, E5, A3, A5, F3, Business Premium and Student Use Benefit, Windows Enterprise E3 and E5, Windows Education A3 and A5, and Windows VDA per user. External commercial use goes through per-user access pricing. Check the current page and Azure Virtual Desktop pricing before you buy."
  - q: "Can I use multi-session in a personal host pool?"
    a: "Learn's update management page marks Windows client multi-session as not supported in personal host pools and supported in pooled ones. Learn also says pooled pools with Windows client Enterprise are not recommended and describes that case as session density set to 1."
  - q: "Can I run Windows Enterprise multi-session on my own hardware or in another cloud?"
    a: "Not for production. Learn's FAQ says customers may not run Windows Enterprise multi-session in production outside the Azure Virtual Desktop service, that Microsoft or its approved providers, Citrix and Omnissa, provide access to that service, and that it also does not activate against on-premises Key Management Services."
---

Windows 11 Enterprise multi-session differs from Windows 11 Enterprise in five ways that matter to an administrator: it allows multiple users to be signed in at once, it is available only through Azure Virtual Desktop and only as a pooled session host, it reports itself as a server-class product type, it is managed through a narrower Intune feature set, and it is serviced by replacing images rather than patching in place. Everything else, from the Windows 11 user interface to the per-user licensing, looks the same. This article lists the differences one by one so you can check an existing image, policy set or process before you move it.

Learn's Windows Enterprise multi-session FAQ, which covers Windows 10 and Windows 11 together, describes it as a virtual edition of Windows Enterprise that allows multiple concurrent interactive sessions, something that previously only Windows Server could do. The sources for this article are the Learn pages listed at the end, all retrieved on 17 November 2026.

## Where it can run

**Only in Azure Virtual Desktop.** Learn's FAQ says it does not allow Windows Enterprise multi-session in production environments outside the Azure Virtual Desktop service. Only Microsoft or the Azure Virtual Desktop approved providers, Citrix and Omnissa, can provide access to the service. It is against the licensing agreement to run it outside for production, and it does not activate against on-premises KMS.

**Only in pooled host pools.** Learn's update management page has a table of supported session host operating systems by host pool type. For Windows client multi-session it shows personal host pools as Not supported and pooled host pools as Supported. For Windows client Enterprise (single-session) it shows personal as Supported and pooled as Not recommended, with a footnote that this means session density set to 1. So the usual split is multi-session for [pooled](/entity/avd-pooled-host-pool/) and single-session Enterprise for [personal](/entity/avd-personal-host-pool/) host pools.

**Not as a converted VM.** Learn's FAQ says you cannot upgrade an existing Windows Professional or Enterprise VM to multi-session. If you deploy a multi-session VM and then change the product key to another edition, you cannot switch back and must redeploy. Changing the Azure Virtual Desktop VM SKU to another edition is not supported. For an existing fleet the route is a new image and new VMs.

## What looks different to applications and tools

Windows Enterprise multi-session reports `ProductType` as 3, the same value as Windows Server, according to Learn. That keeps compatibility with Remote Desktop Session Host management tooling and multi-session-aware applications. The catch is that some installers block installation when they detect a value other than Client. Learn's advice if an app will not install is to ask the vendor for an updated version.

Remote Desktop IP Virtualization is not supported on the operating systems that Azure Virtual Desktop supports, Learn says. If an application depends on per-session IP addresses, test it before you plan a migration.

How many users fit on one VM is not fixed by the edition. Learn says the number of simultaneous interactive sessions depends on hardware (vCPU, memory, disk and vGPU), how users work, and how heavy the workload is, and suggests validating performance. Our own article on sizing a pooled host pool covers the method.

## What is the same: licensing

It is easy to assume the multi-session edition needs different licenses. Learn's prerequisites page lists Windows 11 Enterprise multi-session and Windows 11 Enterprise in one row, with the same internal-use licensing methods: Microsoft 365 E3, E5, A3, A5, F3, Business Premium and Student Use Benefit; Windows Enterprise E3 and E5; Windows Education A3 and A5; and Windows VDA per user. For external commercial use the same row points to per-user access pricing. The FAQ adds that multi-session lets IT use existing per-user Windows licensing instead of RDS Client Access Licenses. Windows Server session hosts are listed in separate rows of that table, and our licensing article covers the cases in detail.

## Profiles and apps

Learn recommends [FSLogix](/entity/fslogix/) profile containers when you use multi-session in non-persistent environments or other scenarios that need a centrally stored profile, because the profile is then available and up to date for every session. FSLogix is pre-installed on all available multi-session images and is free for Azure Virtual Desktop users, but the admin still configures the profile container.

A side effect surprises users. When a profile solution deletes the profile at sign-out, apps the user installed during the session disappear too. Learn's remedy is to provision apps for all users instead, and it points to publishing built-in apps, the DISM app package servicing options and `Add-AppxProvisionedPackage`. To stop users from adding Store apps, Learn describes a Group Policy: **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Store**, then **Turn off the Store Application** set to **Enabled**.

## Images

Windows Enterprise multi-session can be selected in the Azure Virtual Desktop management interface, or found in Azure Marketplace under the Windows 10 or 11 offering, **Windows Enterprise multi-session plan**. For an image with Microsoft 365 Apps for enterprise, Learn says to search with the keyword **multi-session**. Marketplace images are updated monthly after the security patch release, and the images with Microsoft 365 apps appear around the middle of the third week of the month. Pre-installed apps are the latest version available on the second Tuesday of that month; later updates wait for the next month's image.

To customize, Learn recommends custom image templates. Alternatively create an Azure VM from the multi-session image, install line-of-business apps, run sysprep to generalize, and capture the image.

## Management with Intune

Learn's Intune page describes Intune management of multi-session VMs as generally available, with device-based configuration for devices and user-based configuration for users. The VMs must be in pooled host pools deployed through Azure Resource Manager, in the same tenant, running AVD agent 1.0.2944.1400 or later, and either Microsoft Entra hybrid joined (with device-credential enrollment or co-management) or Microsoft Entra joined and enrolled. Learn calls the edition "a separate OS edition" for which some Windows Enterprise configurations are not supported. The main differences from Windows 11 Enterprise:

| Area | Multi-session, per Learn |
|---|---|
| Profile types | Settings catalog; only the trusted certificate, SCEP, PKCS and VPN (device tunnel only) templates are supported. Unsupported templates show as Not applicable. |
| Compliance | A defined list is supported (for example minimum and maximum OS version, password settings, firewall, antivirus, Defender risk score); everything else reports Not applicable. Target compliance policies to devices; user-targeted compliance is not supported. |
| Apps | System-context apps targeted to devices, with **Required** or **Uninstall** intent. **Available** intent is not supported. RemoteApp and MSIX app attach are not supported in Intune. |
| Updates | Windows update ring policies are not supported; quality update settings come from the Settings catalog. |
| Enrollment | Autopilot, Commercial OOBE and the enrollment status page are not supported. |
| Remote actions | Autopilot reset, BitLocker key rotation, Fresh Start, Remote lock, Reset password and Wipe are not supported. |

Learn's FAQ also names Configuration Manager 1906 as a recommended management tool for multi-session. Our article on managing session hosts with [Intune](/entity/intune/) covers these limits in more depth.

## Servicing

Servicing is where a single-session habit hurts most. Learn's update management page gives these markers for monthly updates on Windows client multi-session: Windows Update Not recommended, [Windows Autopatch](/entity/windows-autopatch/) Not supported, Configuration Manager Supported, session host update Recommended, and [Azure Compute Gallery](/entity/azure-compute-gallery/) Recommended. For Windows client Enterprise, Windows Update and Autopatch are Recommended. Hotpatching, which applies eligible updates without a reboot, is listed as supported on Windows 11 Enterprise, version 24H2 or later with virtualization-based security, and Not supported on multi-session.

Feature updates follow the same pattern. Windows Update is Not recommended and Autopatch Not supported for multi-session, with session host update and Azure Compute Gallery Recommended. For feature updates through WSUS the page says Not recommended, while the multi-session FAQ says the OS can receive feature updates published to WSUS as long as the VM meets the Windows 11 hardware requirements, so read WSUS as possible but not preferred. In-place upgrades, for example Windows 10 to 11, are not supported for pooled session hosts; Learn recommends new VMs from a new image, using session host update for multi-session. Session host update needs a host pool with a session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## A checklist before you move

1. Is the target host pool pooled? If it is personal, use single-session Enterprise.
2. Do all applications install on a ProductType 3 system, and none rely on Remote Desktop IP Virtualization?
3. Is the profile in FSLogix, and are apps provisioned for all users rather than installed per profile?
4. Are your Intune profiles settings-catalog based, and are apps targeted to devices with Required intent?
5. Is there an image-based process for monthly updates, instead of Windows Update rings?
6. Is every license already covered, and is every user within Azure Virtual Desktop?

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Windows Enterprise multi-session FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Using Azure Virtual Desktop multi-session with Microsoft Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Windows update management methodologies for session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
