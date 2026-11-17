---
title: "Trusted launch for Azure VMs and session hosts explained"
summary: "Trusted launch protects the boot chain of Generation 2 Azure VMs with Secure Boot, a virtual TPM and boot integrity monitoring. For Azure Virtual Desktop it is the default security type in the Azure portal and a Windows 11 requirement on Azure."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [trusted-launch, azure-virtual-desktop]
keypoints:
  - "Trusted launch is a set of coordinated features for Generation 2 Azure VMs: Secure Boot, a virtual TPM (vTPM) and boot integrity monitoring through remote attestation. Learn says you can enable them independently, and that it adds no VM price."
  - "When you add session hosts in the Azure portal, Learn says the default security type is Trusted virtual machines. The Windows 11 requirements page lists trusted launch with vTPM enabled as the Azure setting for Windows 11 VMs."
  - "The protection covers the running OS and OS disk, not data disks. It targets bootkits, rootkits and kernel-level malware; it does not replace antimalware or patching."
  - "A trusted launch VM does not boot if unsigned components are found. Learn says VMs created directly from Marketplace images should not hit this; custom images and drivers are where to look."
  - "Secrets bound to the vTPM belong to one VM, and pooled users can land on any host in the pool, so check features that rely on the vTPM before you use them on pooled session hosts."
faq:
  - q: "Is trusted launch the same as a confidential VM?"
    a: "No. Learn's Azure Virtual Desktop security guide describes trusted launch as protection against bottom-of-the-stack threats such as rootkits, boot kits and kernel-level malware. Confidential VMs go further: Learn says they encrypt the desktop in memory, protect it in use and back it with a hardware root of trust. In the portal, Confidential virtual machines is a separate security type from Trusted launch virtual machines."
  - q: "Does trusted launch cost extra?"
    a: "Learn's trusted launch overview says it does not increase existing VM pricing costs. Related services can have their own costs: the trusted launch FAQ says boot integrity alerts in Microsoft Defender for Cloud are only available if enhanced security features in Defender for Cloud are enabled, so check that plan's pricing separately."
  - q: "Can I use a Generation 1 image or VM?"
    a: "Not for trusted launch itself, which applies to Generation 2 VMs. The Windows 11 requirements page also lists generation 2 for Windows 11 VMs and says in-place upgrade of existing generation 1 VMs to Windows 11 is not possible. Learn describes separate paths to move an existing Gen1 VM to Gen2 with trusted launch; those belong in a how-to, not in this concept article."
---

Trusted launch is a group of security features for Generation 2 Azure virtual machines that protects the boot process: Secure Boot allows only signed boot components, a virtual TPM (vTPM) records measurements of the boot, and boot integrity monitoring uses those records for remote attestation. For [Azure Virtual Desktop](/entity/azure-virtual-desktop/) it matters in two ways: the Azure portal selects it by default when you add session hosts, and Windows 11 on Azure needs trusted launch with vTPM enabled.

This article explains the concept and the decisions around it. Switching it on for existing session hosts is covered in the companion article "Enabling trusted launch for AVD session hosts". Sources were retrieved on 17 November 2026.

## What trusted launch is

Learn's [trusted launch overview](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) describes it as a way to improve the security of Generation 2 VMs with enhanced protection against bootkits, rootkits and low-level malware. It uses several coordinated infrastructure technologies that you can enable independently. The page lists these benefits: VMs deploy with verified boot loaders, OS kernels and drivers; keys, certificates and secrets in the VM are protected; the integrity of the entire boot chain becomes visible; and workloads can be shown to be trusted.

The [Trusted launch (Azure virtual machines)](/entity/trusted-launch/) feature is built from these parts:

- **Secure Boot.** Implemented in platform firmware. Learn says it ensures that only signed operating systems and drivers can boot, and that if it cannot authenticate a signed component from a trusted publisher, the VM fails to boot.
- **vTPM.** A virtualized TPM that follows the TPM 2.0 specification. Learn says each VM gets its own dedicated TPM instance running in a secure environment outside the reach of the VM, and that it serves as a vault for keys and measurements.
- **Boot integrity monitoring.** The vTPM measures the boot chain (UEFI, OS, system and drivers), and remote attestation through the cloud certifies that the VM booted correctly. If attestation fails, Microsoft Defender for Cloud issues integrity alerts.

On top of this, Learn says trusted launch lets you enable virtualization-based security (VBS) features: hypervisor code integrity (HVCI) and Windows Defender Credential Guard.

## How the boot check works

Learn's [trusted launch FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) explains the difference between the two mechanisms in plain terms. In a Secure Boot chain, each step checks the cryptographic signature of the next step; if a component has been tampered with, the signature does not match and the VM does not boot. Measured boot and the vTPM add a record: the measurements are used afterwards to prove that the platform started correctly.

## What it does not cover

Set the scope correctly before you put it in a security review:

- **Data disks.** The FAQ says trusted launch security features apply to the running OS and OS disks only, not to data disks or to OS binaries stored on data disks.
- **Threat class.** The stated target is bootkits, rootkits and kernel-level malware, which run in kernel mode and remain hidden from users. Nothing on these pages presents it as a replacement for antimalware, patching or identity controls.
- **Memory encryption.** Learn describes encryption of the desktop in memory for confidential VMs, not for trusted launch; see the comparison below.

Learn lists two practical effects: the paravisor that trusted launch creates inside the VM typically uses about 50 MB of memory, shown as reserved in the guest OS, and trusted launch does not increase existing VM pricing costs.

## Where it applies to Azure Virtual Desktop

Learn's [Azure Virtual Desktop security guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-guide) says: "When you add session hosts using the Azure portal, the default security type is Trusted virtual machines. This ensures that your VM meets the mandatory requirements for Windows 11." The [Windows 11 requirements page](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements) backs this up. For VMs it lists generation 2, and for Azure it lists trusted launch with vTPM enabled. It also says in-place upgrade of existing generation 1 VMs to Windows 11 is not possible.

The [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) shows the choice in the portal. When you add session hosts to a host pool that uses a [session host configuration](/entity/avd-session-host-configuration/), you select a security type of Standard, Trusted launch virtual machines or Confidential virtual machines, and Trusted launch virtual machines is the default. Selecting it turns on Secure Boot and vTPM automatically. The standard management tab offers the same three options and the same automatic selections.

So for a new Windows 11 multi-session pool created in the portal, you usually get trusted launch without doing anything. The decisions that remain are about images, sizes, drivers and how you monitor.

## Checks before you rely on it

**Image.** Trusted launch needs a Generation 2 image. Learn's FAQ shows how to check a Marketplace image with `az vm image show` and look for `"hyperVGeneration": "V2"` and a `SecurityType` value that contains `TrustedLaunch`. For your own images, Learn says managed images are not supported; use Azure Compute Gallery instead. The FAQ adds that new features such as trusted launch are only supported through Azure Compute Gallery. If you maintain [golden images](/entity/golden-image/), build and publish them as Gen2 gallery images, and test them on the VM size you will deploy.

**Operating system.** Learn's supported list includes Windows 10 and 11 in Pro, Enterprise and Enterprise multi-session variants and Windows Server 2016 to 2025, which covers the usual [session host](/entity/avd-session-host/) choices.

**VM size.** Not every size family supports it. The overview lists, among others, B, D, E, F and L families as supported, and A, Dv2 and Dv3 as not supported. The page has a table with some formatting problems in the "currently not supported" column, so check your size on the live page, or with the CLI query in the FAQ (`az vm list-skus ... --query "[?name=='<size>'].capabilities"`), before you plan a pool around it. One related limit: Learn says that once a VM is created with trusted launch you cannot resize it to a size family that does not support it, for example an unsupported M-series size.

**Unsupported features.** The overview names managed images and Linux VM hibernation as unsupported.

**Deployment code.** The portal, PowerShell and CLI default new Gen2 VMs to trusted launch. For templates (ARM, Bicep, Terraform), Learn says the absence of a `securityProfile` element deploys a VM without trusted launch unless the subscription is registered for the "Trusted Launch as Default" feature. With API version 2025-11-01 or higher, the default applies only if the Marketplace or gallery image, the source disk and the VM size all support trusted launch; otherwise the deployment still succeeds, without it. The explicit settings are `securityType: TrustedLaunch` with `secureBootEnabled` and `vTpmEnabled` set to true. Check the resulting VM instead of assuming a pipeline matches the portal.

## Pooled hosts, the vTPM and encryption

The vTPM is per VM. Learn's AVD security guide states the consequence directly: any feature that uses the vTPM results in secrets bound to that specific VM, and in a pooled scenario users can be redirected to any VM in the host pool, so depending on how a feature is designed, this can have an impact. Our reading: test any feature that stores a secret in the vTPM on a real [pooled host pool](/entity/avd-pooled-host-pool/) before rollout, because a later session may land on a host that does not hold that secret.

The same guide recommends enabling vTPM to use remote attestation, and says that with vTPM enabled you can also use BitLocker through Azure Disk Encryption. It warns: do not use BitLocker to encrypt the specific disk where FSLogix profile data is stored.

For [ephemeral OS disks](/entity/avd-ephemeral-os-disks/), the FAQ says trusted launch supports them, but keys and secrets that the vTPM generates or seals after VM creation might not persist across reimaging and platform events such as service healing. That fits stateless hosts, but not a design that expects vTPM-held state to survive a reimage.

## Secure Boot, custom images and drivers

Secure Boot is the part most likely to surprise an image owner. Learn's FAQ says a trusted launch VM does not boot if unsigned components are detected in the UEFI firmware, bootloader, OS or boot drivers. VMs created directly from a Marketplace image should not hit this. If one does, the FAQ suggests, in order: update to a supported, newer image version if the image is deprecated; check for unsigned boot components if the image was built outside the Marketplace; and if neither applies, treat the VM as possibly infected with a bootkit or rootkit, delete it and recreate it from the same source image while you evaluate the software you install.

Two more points from the FAQ: adding COM ports requires disabling Secure Boot, and you should not disable Secure Boot unless you use a custom unsigned kernel or drivers.

## Monitoring in Defender for Cloud

The overview lists what [Microsoft Defender for Cloud](/entity/microsoft-defender-for-cloud/) reports for compatible VMs:

| Item | Severity (Learn) | Meaning |
|---|---|---|
| Enable Secure Boot | Low | VM supports trusted launch but Secure Boot is off |
| Enable vTPM | Low | vTPM is off, so guest attestation cannot be used |
| Install Guest Attestation extension | Low | Secure Boot and vTPM are on, but the extension is missing |
| VM attestation failure | Medium | Periodic or post-boot attestation failed |

The FAQ gives three causes for failed attestation: the measured boot log deviates from a trusted baseline (which can happen when Secure Boot is disabled), the attestation quote cannot be verified as coming from the VM's vTPM, or the attestation extension is not responding. The overview also notes that these client boot attestation alerts show in Defender for Cloud, not in the Defender portal. If you must disable Secure Boot, Learn says you can suppress that alert to avoid false positives.

## Trusted launch or confidential VMs

The portal offers both as security types, and the AVD guide treats them differently.

| | Trusted launch | Confidential VM |
|---|---|---|
| What it protects | Boot chain against rootkits, boot kits and kernel-level malware | Desktop in memory, in use, backed by a hardware root of trust ([confidential computing](/entity/azure-confidential-computing/)) |
| Portal options set automatically | Secure Boot, vTPM | Secure Boot, vTPM and integrity monitoring; you cannot opt out of vTPM |
| OS disk encryption in the portal | No separate checkbox | "Confidential compute encryption" checkbox, shown only for confidential VMs |
| Portal default | Yes, for session host configuration | Not the default |

Learn lists the OS versions supported for confidential session hosts: Windows 11 Enterprise and Enterprise multi-session, Windows 10 Enterprise and Enterprise multi-session, Windows Server 2022 and Windows Server 2019, in versions in active support. Trusted launch fits boot-level tampering; confidential VMs are for when memory protection is a requirement. The overview lists the DC and EC confidential families as not supported for trusted launch, so confidential VMs are a separate choice rather than an add-on.

## Where this article stops

For Gen2 session hosts that run without trusted launch, Learn has a separate article for enabling it on existing VMs. It says rollback to the Standard security type is one-way. The steps are the subject of the companion how-to; Gen1 VMs have their own upgrade article.

## Sources

Retrieved 17 November 2026.

- [Trusted launch for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) (Microsoft Learn, last updated 25 September 2026)
- [Trusted launch FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) (Microsoft Learn, last updated 10 February 2026)
- [Security recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-guide) (Microsoft Learn, last updated 19 October 2026)
- [Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) (Microsoft Learn, content date 1 October 2026)
- [Windows 11 requirements](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements) (Microsoft Learn, last updated 14 July 2026)
- [Enable trusted launch on existing Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) (Microsoft Learn, last updated 19 June 2026)
