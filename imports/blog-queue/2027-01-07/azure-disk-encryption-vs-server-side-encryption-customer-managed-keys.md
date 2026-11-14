---
title: "Azure Disk Encryption vs Server-Side Encryption With Customer-Managed Keys"
summary: "Compare Azure Disk Encryption, server-side encryption with customer-managed keys, encryption at host and confidential disk encryption for managed disks, including temp disks, HSM support and the retirement date of ADE."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [azure-disk-storage, azure-virtual-machines]
keypoints:
  - "Server-side encryption (SSE) is always on for managed disks. It supports customer-managed keys only when you configure it with a disk encryption set (DES)."
  - "SSE does not encrypt temp disks or disk caches. Encryption at host adds temp disk and cache encryption and flows data encrypted to storage."
  - "Azure Disk Encryption (ADE) runs inside the VM with BitLocker or DM-Crypt and uses VM CPU. Learn says it is scheduled for retirement on September 15, 2028."
  - "Learn recommends encryption at host for new VMs. ADE-enabled VMs, including backups, must migrate before the retirement date."
  - "Encryption at host supports temp disk encryption only with platform-managed keys."
faq:
  - q: "What is the difference between ADE and SSE with customer-managed keys?"
    a: "According to Microsoft Learn, SSE encrypts managed disks in the storage clusters and supports customer-managed keys when configured with a disk encryption set. ADE encrypts inside the VM with BitLocker on Windows or DM-Crypt on Linux and integrates with Azure Key Vault."
  - q: "Does SSE encrypt temp disks and caches?"
    a: "No. Learn says SSE does not encrypt temp disks or disk caches. Encryption at host, ADE and confidential disk encryption cover them."
  - q: "When is Azure Disk Encryption retired?"
    a: "Learn says ADE is scheduled for retirement on September 15, 2028. After that date, encrypted disks fail to unlock after VM reboots, which causes service disruption."
  - q: "Which option should I use for new VMs?"
    a: "Learn recommends encryption at host for new VMs. It can use customer-managed keys through a disk encryption set."
  - q: "Do all options support hardware security modules?"
    a: "Learn lists Key Vault Premium and Managed HSM for SSE, encryption at host and confidential disk encryption. For ADE it lists Key Vault Premium only."
---

For new virtual machines, Microsoft Learn recommends encryption at host, not Azure Disk Encryption. Azure Disk Encryption (ADE) is scheduled for retirement on September 15, 2028. Server-side encryption (SSE) is always on for managed disks and supports customer-managed keys when you attach a disk encryption set. This guide follows the Microsoft Learn overview of disk encryption options for Azure managed disks.

## The four options

**Server-side encryption (SSE)** is always enabled. It encrypts OS and data disks when data is written to the storage clusters. With a disk encryption set (DES), it also supports customer-managed keys. It does not encrypt temp disks or disk caches.

**Encryption at host** is a VM option that enhances SSE. All temp disks and disk caches are encrypted at rest and flow encrypted to the storage clusters.

**Azure Disk Encryption (ADE)** encrypts OS and data disks inside the VM, using DM-Crypt on Linux or BitLocker on Windows. It integrates with Azure Key Vault and can use a key encryption key (KEK).

**Confidential disk encryption** binds disk encryption keys to the VM's TPM, so the protected disk content is accessible only to the VM. Confidential OS disk encryption protects the OS disk. Confidential temp disk encryption is available only through an opt-in process. Encryption at host can cover other disks on a confidential VM.

## Comparison from the page

| Capability | SSE | Encryption at host | ADE | Confidential disk encryption (OS disk) |
| --- | --- | --- | --- | --- |
| Encryption at rest, OS and data disks | Yes | Yes | Yes | Yes |
| Temp disk encryption | No | Yes, only with platform-managed keys | Yes | Yes, opt-in |
| Cache encryption | No | Yes | Yes | Yes |
| Data flows encrypted to storage | No | Yes | Yes | Yes |
| Customer control of keys | Yes, with a DES | Yes, with a DES | Yes, with a KEK | Yes, with a DES |
| HSM support | Key Vault Premium, Managed HSM | Key Vault Premium, Managed HSM | Key Vault Premium only | Key Vault Premium, Managed HSM |
| Uses VM CPU | No | No | Yes | Yes |
| Custom images | Yes | Yes | Not for custom Linux images | Yes |
| Enhanced key protection | No | No | No | Yes |
| Defender for Cloud status | Unhealthy | Healthy | Healthy | Not applicable |

## What this means for the comparison in the title

The question is how ADE differs from SSE with customer-managed keys. The page shows three differences.

- **Where encryption happens.** SSE with a DES encrypts in the storage clusters and does not use VM CPU. ADE encrypts inside the guest operating system and uses VM CPU.
- **Coverage.** SSE does not cover temp disks, caches or data flows between compute and storage. ADE does.
- **Key control.** Both allow customer control. SSE uses a DES, and ADE uses Key Vault with an optional KEK.

If you want customer-managed keys and temp disk coverage together, the page points to encryption at host, but with a limit. Temp disk encryption under encryption at host is supported only with platform-managed keys.

## Defender for Cloud recommendations

The page lists how recommendations map to the options.

- The recommendation that VMs and scale sets should have encryption at host enabled detects only encryption at host.
- The recommendation that VMs should encrypt temp disks, caches and data flows detects only ADE.
- The Windows and Linux recommendations that say to enable ADE or EncryptionAtHost detect both.
- Confidential disk encryption has no applicable recommendation at present.

Because Defender for Cloud reports SSE alone as Unhealthy, a VM that relies only on SSE can appear as a finding even though its disks are encrypted at rest.

## Retirement of ADE

Learn says ADE is scheduled for retirement on September 15, 2028. After that date, encrypted disks fail to unlock after VM reboots, resulting in service disruption. All ADE-enabled VMs, including backups, must migrate to encryption at host before that date. The migration procedure is on a separate Learn page that was not read for this guide.

## What the page does not say

- Steps to create a disk encryption set, a Key Vault or a KEK. The page links to other articles.
- The default key model for SSE, stated outright, and key rotation details.
- Supported VM sizes, OS versions and regions.
- Pricing and performance impact.
- Whether ADE supports custom Windows images. The page names only Linux.
- The migration procedure from ADE to encryption at host.

## A decision outline

This outline is practical advice built on the page.

1. For a new VM, start with encryption at host.
2. If you need customer-managed keys for OS and data disks, add a DES.
3. If you also need temp disk encryption, check that platform-managed keys are acceptable for the temp disk.
4. For confidential VMs, review confidential disk encryption.
5. For existing ADE VMs, plan the migration well before September 15, 2028.

## Typical mistakes

- Assuming SSE encrypts the temp disk.
- Expecting customer-managed keys on the temp disk with encryption at host.
- Leaving ADE VMs in place until the retirement date.
- Forgetting backups of ADE-enabled VMs, which Learn says must also migrate.

## Related

- [Azure Disk Storage](https://www.m365.fm/entity/azure-disk-storage/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)
- [BitLocker](https://www.m365.fm/entity/bitlocker/)

## Sources

- [Overview of managed disk encryption options (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-machines/disk-encryption-overview)
