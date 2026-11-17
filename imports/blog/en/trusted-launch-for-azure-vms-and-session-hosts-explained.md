---
title: "Trusted launch for Azure VMs and session hosts explained"
summary: "Trusted launch protects the boot chain of Generation 2 Azure VMs with Secure Boot, a virtual TPM and boot integrity monitoring. For Azure Virtual Desktop it is the default security type in the Azure portal and a Windows 11 requirement on Azure."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [trusted-launch, azure-virtual-desktop]
keypoints:
  - "Trusted launch combines Secure Boot, a virtual TPM (vTPM) and boot integrity monitoring for Generation 2 Azure VMs. Learn says you can enable them independently and that it adds no VM price."
  - "Learn says the default security type is Trusted virtual machines when you add session hosts in the Azure portal. For Windows 11 on Azure, the requirements page lists trusted launch with vTPM enabled."
  - "It covers the running OS and OS disk, not data disks, and targets bootkits, rootkits and kernel malware. Learn lists endpoint protection and monthly base-image patching as separate recommendations."
  - "A trusted launch VM does not boot if unsigned components are found. Learn says VMs created directly from Marketplace images should not hit this; custom images and drivers are where to look."
  - "Secrets bound to the vTPM belong to one VM, and pooled users can land on any host in the pool, so check features that rely on the vTPM before you use them on pooled session hosts."
faq:
  - q: "Is trusted launch the same as a confidential VM?"
    a: "No. Learn's Azure Virtual Desktop security recommendations describe trusted launch as protection against bottom-of-the-stack threats such as rootkits, boot kits and kernel-level malware. Confidential VMs go further: Learn says they encrypt the desktop in memory, protect it in use and back it with a hardware root of trust. In the portal, Confidential virtual machines is a separate security type from Trusted launch virtual machines."
  - q: "Does trusted launch cost extra?"
    a: "Learn's trusted launch overview says it does not increase existing VM pricing costs. The trusted launch FAQ also says boot integrity alerts in Microsoft Defender for Cloud are only available if enhanced security features in Defender for Cloud are enabled. Learn does not state a price for those features on these pages."
  - q: "Can I use a Generation 1 image or VM?"
    a: "Not for trusted launch itself, which applies to Generation 2 VMs. The Windows 11 requirements page also lists generation 2 for Windows 11 VMs and says in-place upgrade of existing generation 1 VMs to Windows 11 is not possible. Learn describes separate paths to move an existing Gen1 VM to Gen2 with trusted launch; this article does not cover the steps."
---

Trusted launch is a group of security features for Generation 2 Azure virtual machines that protects the boot process: Secure Boot allows only signed boot components, a virtual TPM (vTPM) records measurements of the boot, and boot integrity monitoring uses those records for remote attestation. For [Azure Virtual Desktop](/entity/azure-virtual-desktop/) it matters in two ways: the Azure portal selects it by default when you add session hosts, and Windows 11 on Azure needs trusted launch with vTPM enabled.

This article explains the concept and the decisions around it, not the steps for enabling it on existing session hosts.

## What trusted launch is

Learn's [trusted launch overview](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) describes it as a way to improve the security of Generation 2 VMs with enhanced protection against bootkits, rootkits and low-level malware. It uses several coordinated infrastructure technologies that you can enable independently. The page lists benefits such as verified boot loaders, OS kernels and drivers, protected keys, certificates and secrets, and visibility into the integrity of the boot chain.

The [Trusted launch (Azure virtual machines)](/entity/trusted-launch/) feature is built from these parts:

- **Secure Boot.** Implemented in platform firmware. Learn says it ensures that only signed operating systems and drivers can boot, and that if it cannot authenticate a signed component from a trusted publisher, the VM fails to boot.
- **vTPM.** A virtualized TPM that follows the TPM 2.0 specification. Learn says each VM gets its own dedicated TPM instance running in a secure environment outside the reach of the VM, and that it serves as a vault for keys and measurements.
- **Boot integrity monitoring.** The vTPM measures the boot chain (UEFI, OS, system and drivers), and remote attestation through the cloud certifies that the VM booted correctly. If it fails, Microsoft Defender for Cloud issues alerts.

On top of this, Learn says trusted launch lets you enable virtualization-based security (VBS) features: hypervisor code integrity (HVCI) and Windows Defender Credential Guard.

## How the boot check works

The [trusted launch FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) describes the Secure Boot chain: each step in the boot process checks a cryptographic signature of the subsequent steps. If any object is compromised, the signature does not match and the VM does not boot.

The measuring side is described elsewhere: the AVD security recommendations say remote attestation verifies that Measured Boot records are present, genuine and originate from the vTPM.

## What it does not cover

Scope to keep in mind:

- **Data disks.** The FAQ says trusted launch security features apply to the running OS and OS disks only, not to data disks or to OS binaries stored on data disks.
- **Threat class.** The stated target is bootkits, rootkits and kernel-level malware. Learn's AVD security recommendations list endpoint protection on all session hosts and monthly patching of base images as separate recommendations, next to the trusted launch section.
- **Memory encryption.** Learn describes encryption of the desktop in memory for confidential VMs, not for trusted launch; see the comparison below.

Two practical notes from separate Learn pages: the FAQ says the paravisor typically uses about 50 MB of memory, shown as reserved in the guest OS. The overview says trusted launch does not increase existing VM pricing costs.

## Where it applies to Azure Virtual Desktop

Learn's [Azure Virtual Desktop security recommendations](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-recommendations) say: "When you add session hosts using the Azure portal, the default security type is Trusted virtual machines. This ensures that your VM meets the mandatory requirements for Windows 11." The [Windows 11 requirements page](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements) backs this up. For VMs it lists generation 2, and for Azure it lists trusted launch with vTPM enabled.

The [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) shows the choice in the portal. When you create a host pool with a [session host configuration](/entity/avd-session-host-configuration/), you select a security type of Standard, Trusted launch virtual machines or Confidential virtual machines, and the article says Trusted launch virtual machines is the default. Selecting it turns on Secure Boot and vTPM automatically. The standard management tab offers the same three options and the same automatic selections.

So for a new Windows 11 multi-session pool created in the portal, you usually get trusted launch without doing anything, as long as the image and VM size support it. The decisions that remain are about images, sizes, drivers and how you monitor.

## Checks before you rely on it

**Image.** Trusted launch needs a Generation 2 image. Learn's FAQ shows how to check a Marketplace image with `az vm image show` and look for `"hyperVGeneration": "V2"` and a `SecurityType` value that contains `TrustedLaunch`. For your own images, Learn says managed images are not supported; use Azure Compute Gallery instead. If you maintain [golden images](/entity/golden-image/), build and publish them as Gen2 gallery images, and test them on the VM size you will deploy. The FAQ lists cases where you must bypass the trusted launch default, among them using a Gen2 VM to generate `TrustedLaunchSupported` gallery images through Azure Image Builder or Packer. To bypass it, set `securityType` to `Standard` (API version 2025-11-01 or higher, Azure PowerShell v15.6.1 or higher, Azure CLI v2.86.0 or higher).

**Operating system.** Learn's supported list includes Windows 10 and 11 (Pro, Enterprise, Enterprise multi-session) and Windows Server 2016 to 2025, which covers the usual [session host](/entity/avd-session-host/) choices.

**VM size.** Not every size family supports it. The overview's table has columns for supported size families, currently not supported size families and not supported size families. Supported families include B, D, E, F and L, and the NC, ND and NV GPU families. Dpsv5, Dpdsv5, Dplsv5, Dpldsv5 and Mbdsv4 (Preview) sit in the "currently not supported" column. Not supported are the A family, Dv2, Dv3, the DC and EC confidential families, the M family except Mbdsv4 (Preview), and the older NC-series, NV-series and NP-series. Learn's note under the table says the not-supported families do not support Generation 2 VMs, so the fix there is an equivalent supported size family. Learn does not explain the "currently not supported" column further; check those sizes with the query below.

To check a specific size, the FAQ gives a CLI query (`az vm list-skus ... --query "[?name=='<size>'].capabilities"`). For a Gen2 size, output that includes `TrustedLaunchDisabled True` means trusted launch is not supported; if that entry is absent, it is supported. One related limit: Learn says that once a VM is created with trusted launch you cannot resize it to a size family that does not support it, for example an unsupported M-series size.

**Unsupported features.** The overview names managed images and Linux VM hibernation as unsupported.

**Deployment code.** The portal, PowerShell and CLI default new Gen2 VMs to trusted launch. For templates (ARM, Bicep, Terraform), Learn says the absence of a `securityProfile` element deploys a VM without trusted launch unless the subscription is registered for the "Trusted Launch as Default" feature. With API version 2025-11-01 or higher, the default applies only if the Marketplace or gallery image, the source disk and the VM size all support trusted launch; otherwise the deployment still succeeds, without it. The explicit settings are `securityType: TrustedLaunch` with `secureBootEnabled` and `vTpmEnabled` set to true.

## Pooled hosts, the vTPM and encryption

The vTPM is per VM. Learn's AVD security recommendations say any feature that uses the vTPM results in secrets bound to that specific VM, and in a pooled scenario users can be redirected to any VM in the host pool, so depending on how a feature is designed, this can have an impact. Our reading: test any feature that stores a secret in the vTPM on a real [pooled host pool](/entity/avd-pooled-host-pool/) before rollout, because a later session may land on a host that does not hold that secret.

The same page recommends enabling vTPM to use remote attestation, and says that with vTPM enabled you can also use BitLocker through Azure Disk Encryption. It warns: do not use BitLocker to encrypt the specific disk where FSLogix profile data is stored.

For [ephemeral OS disks](/entity/avd-ephemeral-os-disks/), the FAQ says trusted launch supports them, but keys and secrets that the vTPM generates or seals after VM creation might not persist across reimaging and platform events such as service healing.

## Secure Boot, custom images and drivers

Learn's FAQ says a trusted launch VM does not boot if unsigned components are detected in the UEFI firmware, bootloader, OS or boot drivers. VMs created directly from a Marketplace image should not hit this. If one does, the FAQ suggests, in order: update to a newer image version if the image is deprecated; check for unsigned boot components if the image was built outside the Marketplace; otherwise treat the VM as possibly infected with a bootkit or rootkit, delete it and recreate it from the same source image.

The FAQ adds that COM ports require disabling Secure Boot, and that you should not disable it unless you use a custom unsigned kernel or drivers.

## Monitoring in Defender for Cloud

The overview lists what [Microsoft Defender for Cloud](/entity/microsoft-defender-for-cloud/) reports for compatible VMs:

| Item | Severity (Learn) | Meaning |
|---|---|---|
| Enable Secure Boot | Low | VM supports trusted launch but Secure Boot is off |
| Enable vTPM | Low | vTPM is off, so guest attestation cannot be used |
| Install Guest Attestation extension | Low | Secure Boot and vTPM are on, but the extension is missing |
| VM attestation failure | Medium | Periodic or post-boot attestation failed |

The FAQ gives three causes for failed attestation: the attested information deviates from a trusted baseline, the attestation quote cannot be verified as coming from the VM's vTPM, or the attestation extension is not responding. The overview adds that alerts need vTPM and the Attestation extension, that Secure Boot must be enabled for attestation to pass, and that these alerts show in Defender for Cloud, not in the Defender portal. If you must disable Secure Boot, Learn says you can suppress that alert to avoid false positives.

## Trusted launch or confidential VMs

The portal offers both as security types, and the AVD security recommendations treat them differently.

| | Trusted launch | Confidential VM |
|---|---|---|
| What it protects | Boot chain against rootkits, boot kits and kernel-level malware | Desktop in memory, in use, backed by a hardware root of trust ([confidential computing](/entity/azure-confidential-computing/)) |
| Portal options set automatically | Secure Boot, vTPM | Secure Boot, vTPM and integrity monitoring; you cannot opt out of vTPM |
| Portal default | Yes, when creating a host pool with a session host configuration | Not the default |

In the standard management flow, Learn shows a "Confidential compute encryption" checkbox for OS disk encryption, which appears only if you select Confidential virtual machines as the security type. Trusted launch addresses boot-level tampering; confidential VMs add memory protection. The overview lists the DC and EC confidential families as not supported for trusted launch, so confidential VMs are a separate choice rather than an add-on.

## Where this article stops

For Gen2 session hosts that run without trusted launch, Learn has a separate article for enabling it on existing VMs. It says rollback to the Standard security type is one-way. Gen1 VMs have their own [upgrade article](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1).

## Sources

Retrieved 17 November 2026.

- [Trusted launch for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) (Microsoft Learn, last updated 25 September 2026)
- [Trusted launch FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) (Microsoft Learn, last updated February 2026)
- [Security recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-recommendations) (Microsoft Learn, last updated 19 October 2026)
- [Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) (Microsoft Learn, content date 1 October 2026)
- [Windows 11 requirements](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements) (Microsoft Learn, last updated 14 July 2026)
- [Enable trusted launch on existing Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) (Microsoft Learn, last updated 19 June 2026)
- [Upgrade Gen1 VMs to Trusted launch](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1) (Microsoft Learn, last updated 19 June 2026)
