---
title: "Windows 11 Enterprise multi-session: what is different"
summary: "Windows 11 Enterprise multi-session allows several users to sign in at the same time on one VM. It may be used in production only in Azure Virtual Desktop, Learn marks it as not supported in personal host pools, and it is managed and serviced differently from Windows 11 Enterprise. This article lists the differences an admin meets when moving a single-session image or a policy set to it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-enterprise-multi-session, azure-virtual-desktop]
keypoints:
  - "Multi-session allows several concurrent interactive sessions on one VM. It is licensed through the same per-user licenses as Windows 11 Enterprise, but it may be used in production only as a session host of the Azure Virtual Desktop service, including on Azure Local, and does not activate against on-premises KMS."
  - "It is an edition of its own: you cannot upgrade a Pro or Enterprise VM to it, and a VM moved to another edition cannot switch back. Learn's update page marks multi-session as not supported in personal host pools."
  - "It reports ProductType 3, the same value as Windows Server, so some installers refuse to run on it."
  - "Management differs. Intune treats it as a separate edition with a smaller set of supported profiles, no Autopilot or update rings, and no Available app intent."
  - "Patching differs. Learn recommends session host update or Azure Compute Gallery images and marks Windows Update as not recommended, Windows Autopatch as not supported, and hotpatch as not supported."
faq:
  - q: "Is Windows 11 Enterprise multi-session licensed differently from Windows 11 Enterprise?"
    a: "Not according to Learn's prerequisites page, which lists Windows 11 Enterprise multi-session and Windows 11 Enterprise in the same row with the same internal-use licensing methods, for example Microsoft 365 E3 and E5 and Windows VDA per user. External commercial use goes through per-user access pricing. Check the current page and Azure Virtual Desktop pricing before you buy."
  - q: "Can I use multi-session in a personal host pool?"
    a: "Learn's update management page marks Windows client multi-session as not supported in personal host pools and supported in pooled ones. Learn also says pooled pools with Windows client Enterprise are not recommended and describes that case as session density set to 1."
  - q: "Can I run Windows Enterprise multi-session on my own hardware or in another cloud?"
    a: "Only as a session host of the Azure Virtual Desktop service. Learn's FAQ says customers may not run it in production outside that service and that it does not activate against on-premises Key Management Services. Session hosts on Azure Local, which is your own hardware, are part of the service and can use multi-session images, activated with Azure verification for VMs. Azure Virtual Desktop Hybrid does not support multi-session. For another cloud, the FAQ gives no exception."
---

Windows 11 Enterprise multi-session differs from Windows 11 Enterprise in several ways that matter to an administrator. It allows multiple users to be signed in at once, it may be used in production only through Azure Virtual Desktop, and it is intended for pooled session hosts. It reports itself as a server-class product type and is managed through a narrower Intune feature set. Learn recommends servicing it by replacing images rather than patching in place, and the licensing row is the same as for Windows 11 Enterprise. This article lists the differences one by one so you can check an existing image, policy set or process before you move it.

Learn's Windows Enterprise multi-session FAQ, which covers Windows 10 and Windows 11 together, describes it as a virtual edition of Windows Enterprise that allows multiple concurrent interactive sessions, something that previously only Windows Server could do.

## Where it can run

**Production use only in Azure Virtual Desktop.** Learn's FAQ says it does not allow Windows Enterprise multi-session in production environments outside the Azure Virtual Desktop service. Only Microsoft or the Azure Virtual Desktop approved providers, Citrix and Omnissa, can provide access to the service. Running it outside the service for production is against the licensing agreement, and it does not activate against on-premises KMS.

**Own hardware: Azure Local, not Hybrid.** Own hardware is possible inside the service. Learn's overview of Azure Virtual Desktop for [Azure Local](/entity/azure-local/) lists Windows 11 Enterprise multi-session and Windows 10 Enterprise multi-session among the images supported for session hosts, and the prerequisites page says to activate them with Azure verification for VMs. Azure Virtual Desktop Hybrid is different: Learn's Hybrid overview marks both multi-session editions as not supported there. For another cloud, the FAQ names no exception to the production restriction.

**Pooled, not personal host pools.** Learn's update management page has a table of session host operating systems by host pool type. For Windows client multi-session it shows personal host pools as Not supported, a marker the page defines as should not be used for, or not applicable to, this operating system, and pooled host pools as Supported. For Windows client Enterprise (single-session) it shows personal as Supported and pooled as Not recommended, with a footnote that this means session density set to 1. So the usual split is multi-session for [pooled](/entity/avd-pooled-host-pool/) and single-session Enterprise for [personal](/entity/avd-personal-host-pool/) host pools.

**Not as a converted VM.** Learn's FAQ says you cannot upgrade an existing Windows Professional or Enterprise VM to multi-session. If you deploy a multi-session VM and then change the product key to another edition, you cannot switch back and must redeploy. Changing the Azure Virtual Desktop VM SKU to another edition is not supported. For an existing fleet the route is a new image and new VMs.

## What looks different to applications and tools

Windows Enterprise multi-session reports `ProductType` as 3, the same value as Windows Server, according to Learn. That keeps compatibility with Remote Desktop Session Host management tooling and multi-session-aware applications. The catch is that some installers block installation when they detect a value other than Client. Learn's advice if an app will not install is to ask the vendor for an updated version.

Remote Desktop IP Virtualization is not supported on the operating systems that Azure Virtual Desktop supports, Learn says. Our reading is that an application which depends on per-session IP addresses should be tested before you plan a migration.

How many users fit on one VM is not fixed by the edition. Learn says the number of simultaneous interactive sessions depends on hardware (vCPU, memory, disk and vGPU), how users work, and how heavy the workload is, and suggests validating performance. Our own article on sizing a pooled host pool covers the method.

## What is the same: licensing

It is easy to assume the multi-session edition needs different licenses. Learn's prerequisites page lists Windows 11 Enterprise multi-session and Windows 11 Enterprise in one row with the same licensing methods, and the FAQ adds that multi-session lets IT use existing per-user Windows licensing instead of RDS Client Access Licenses. Windows Server session hosts sit in separate rows. The full list of qualifying licenses and the external-use rules are in our article on Azure Virtual Desktop licensing.

## Profiles and apps

Learn recommends [FSLogix](/entity/fslogix/) profile containers when you use multi-session in non-persistent environments or other scenarios that need a centrally stored profile, because the profile is then available and up to date for every session. FSLogix is pre-installed on all available multi-session images and is free for Azure Virtual Desktop users, but the admin still configures the profile container.

A side effect surprises users. When a profile solution deletes the profile at sign-out, apps the user installed during the session disappear too. Learn's remedy is to provision apps for all users instead, and it points to publishing built-in apps, the DISM app package servicing options and `Add-AppxProvisionedPackage`. To stop users from adding Store apps, Learn describes a Group Policy: **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Store**, then **Turn off the Store Application** set to **Enabled**.

## Images

Windows Enterprise multi-session can be selected in the Azure Virtual Desktop management interface, or found in Azure Marketplace under the Windows 10 or 11 offering, **Windows Enterprise multi-session plan**. For an image with Microsoft 365 Apps for enterprise, Learn says to search with the keyword **multi-session**. Marketplace images are updated monthly after the security patch release, and the images with Microsoft 365 apps appear around the middle of the third week of the month. Pre-installed apps are the latest version available on the second Tuesday of that month; later updates wait for the next month's image.

To customize, Learn recommends custom image templates. Alternatively create an Azure VM from the multi-session image, install line-of-business apps, run sysprep to generalize, and capture the image.

## Management with Intune

Learn's Intune page describes Intune management of multi-session VMs as generally available. The VMs must be in pooled host pools deployed through Azure Resource Manager, in the same tenant as Intune, running AVD agent 1.0.2944.1400 or later, and either Microsoft Entra hybrid joined or Microsoft Entra joined and enrolled. Learn calls the edition a separate OS edition for which some Windows Enterprise configurations are not supported. The differences you meet first:

- **Profiles:** use the Settings catalog. Of the templates, only trusted certificate, SCEP, PKCS and VPN (device tunnel only) are supported; other templates show as Not applicable.
- **Compliance and apps:** only a defined list of compliance settings is supported, and compliance policies must target devices. Apps must install in the system context, be targeted to devices, and use **Required** or **Uninstall** intent; **Available** is not supported.
- **Updates and enrollment:** Windows update ring policies, Autopilot, Commercial OOBE and the enrollment status page are not supported.

Three limits matter most when you build images. Learn says Intune does not support a cloned image of a computer that is already enrolled; replicated enrollment or identity tokens cause enrollment or synchronization failures, and Learn's troubleshooting link names error 0x8007064c, the machine is already enrolled. Intune also does not support token roaming between devices, so if FSLogix is used you must make sure tokens are not roamed or duplicated, and Learn points to the FSLogix RoamIdentity setting. Finally, session hosts joined to Microsoft Entra Domain Services cannot be managed with Intune. Learn's FAQ also names Configuration Manager 1906 as a recommended management tool for multi-session. Our article on managing session hosts with [Intune](/entity/intune/) covers compliance, apps, update rings and remote actions in full.

## Servicing

Servicing is where a single-session habit hurts most. Learn's update management page marks Windows Update as Not recommended for monthly updates on multi-session, [Windows Autopatch](/entity/windows-autopatch/) as Not supported, Configuration Manager as Supported, and session host update and [Azure Compute Gallery](/entity/azure-compute-gallery/) as Recommended. For Windows client Enterprise, Windows Update and Autopatch are Recommended. Learn recommends image-based servicing through session host update for pooled environments, citing consistent host configuration, easier rollback and less impact on active sessions, and notes that user data and local storage are not saved when a host is updated this way. Our article on Windows Update strategies for session hosts covers the full marker tables.

Hotpatching, which applies eligible updates without a reboot, is supported on Windows 11 Enterprise, version 24H2 or later, with virtualization-based security enabled and updates managed through Windows Autopatch and Microsoft Intune. Learn lists it as Not supported on multi-session. For feature updates through WSUS the page says Not recommended, while the multi-session FAQ says the OS can receive feature updates published to WSUS as long as the VM meets the Windows 11 hardware requirements, so read WSUS as possible but not preferred. In-place upgrades, for example Windows 10 to 11, are not supported for pooled session hosts; Learn recommends new VMs from a new image, using session host update for multi-session. Session host update needs a host pool with a session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. One visible case: Learn's prerequisites page, updated on 4 November 2026, still lists ephemeral OS disks for Azure VMs under the items that are not supported for session hosts, while the July 2026 announcement lists ephemeral OS disks as generally available with a session host configuration. The two sources disagree; confirm the current state of both before you plan around ephemeral disks.

## A checklist before you move

1. Is the target host pool pooled? If it is personal, use single-session Enterprise.
2. Do all applications install on a ProductType 3 system, and none rely on Remote Desktop IP Virtualization?
3. Is the profile in FSLogix, and are apps provisioned for all users rather than installed per profile?
4. Are your Intune profiles settings-catalog based, and are apps targeted to devices with Required intent?
5. Is there an image-based process for monthly updates, instead of Windows Update rings, and are images built without cloning an already enrolled machine?
6. Is every license already covered, and does every user connect through the Azure Virtual Desktop service? On own hardware, is it Azure Local rather than Hybrid?

## Sources


- [Microsoft Learn: Windows Enterprise multi-session FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Using Azure Virtual Desktop multi-session with Microsoft Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Windows update management methodologies for session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts)
- [Microsoft Learn: Azure Virtual Desktop for Azure Local](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview)
- [Microsoft Learn: Azure Virtual Desktop Hybrid](https://learn.microsoft.com/en-us/azure/virtual-desktop/hybrid-overview)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
