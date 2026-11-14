---
title: "Azure VM Will Not Boot: Use Boot Diagnostics and Serial Console"
summary: "What boot diagnostics and the Azure Serial Console show for a VM that fails to boot: enabling boot diagnostics, screenshots and serial log, storage limits, listed boot errors, Serial Console prerequisites and access paths, and what the Learn pages leave out."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [azure-virtual-machines]
keypoints:
  - "Boot diagnostics gives a screenshot for Windows and Linux VMs. The serial log is for Linux VMs only. Output can take up to 10 minutes to reach the storage account."
  - "Enable at creation under Management > Monitoring > Boot diagnostics, or later under Help > Boot diagnostics > Settings. Premium storage accounts and ZRS are not supported."
  - "Serial Console is a text console over ttyS0 or COM1 that works independent of network state. It needs boot diagnostics, a password user in the VM and the Virtual Machine Contributor role."
  - "Path: All resources > the VM > Help > Serial console. For scale sets go through Instances > the instance > Help > Serial console."
  - "The pages give no step-by-step recovery for a non-booting VM and do not address how to get a password user on a VM that cannot boot."
faq:
  - q: "What does boot diagnostics show?"
    a: "A screenshot for Windows and Linux VMs, taken through the hypervisor, and a serial log (console output) for Linux VMs only. Screenshots and output can take up to 10 minutes to appear in the storage account."
  - q: "How do I enable it?"
    a: "At creation under Management > Monitoring > Boot diagnostics, where the default is a managed storage account. On an existing VM go to Help > Boot diagnostics > Settings, choose a managed or custom storage account and Save."
  - q: "What are the limits?"
    a: "Resource Manager model only. Premium storage accounts and zone-redundant storage are not supported, and an unsupported account can cause a StorageAccountTypeNotSupported error."
  - q: "What does Serial Console need?"
    a: "Boot diagnostics enabled, a user account with password authentication in the VM, the Virtual Machine Contributor role on the VM and on the boot diagnostics storage account, the Resource Manager model, and a storage account that does not disable Allow storage account key access."
  - q: "Where do I open it?"
    a: "All resources > the VM > Help > Serial console. For a scale set instance, go to All resources > the scale set > Instances > the instance > Help > Serial console."
---

When an Azure VM does not come up, you cannot always sign in over the network. Boot diagnostics shows what the VM displays at startup. The Serial Console gives a text channel that does not depend on the network. This guide follows two Microsoft Learn pages: the serial console overview and the boot diagnostics page. Neither page is a full troubleshooting procedure, so this guide covers the tools and their conditions.

## Boot diagnostics

- The serial log (console output) is available for Linux VMs only.
- A screenshot is taken for Windows and Linux VMs through the hypervisor.
- Screenshots and output can take up to 10 minutes to appear in the storage account.

### Enable it

- At creation: **Management** tab > **Monitoring** > **Boot diagnostics**. The default is a managed storage account.
- On an existing VM: **Help** > **Boot diagnostics** > **Settings** tab. Choose a managed or custom storage account and select **Save**.
- Azure CLI uses `az vm boot-diagnostics`, and ARM templates use a diagnosticsProfile with bootDiagnostics (API version 2015-06-15 or later). The page gives no example.

### View it

Open **Help** > **Boot diagnostics**. There is a **Screenshot** tab, and Linux VMs also have a log view.

### Limits

- Resource Manager model only.
- Premium storage accounts and zone-redundant storage are not supported. A StorageAccountTypeNotSupported error is possible.
- If a screenshot looks stale, disable the display timeout. On Windows run `powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO VIDEOIDLE 0` in an elevated command prompt. On Linux run `xset s off`. Windows VMs from specialized VHDs may need the powercfg command run manually.

### Boot errors the page lists

Each links to a Microsoft Support article: 0xC000000E, 0xC000000F, 0xC0000011, 0xC0000034, 0xC0000098, 0xC00000BA, 0xC000014C, 0xC0000221, 0xC0000225, 0xC0000359, 0xC0000605, An operating system wasn't found, and Boot failure or INACCESSIBLE_BOOT_DEVICE.

## Serial Console

The Serial Console is a text console to the ttyS0 or COM1 serial port. It works independent of network state. Use it through the Azure portal or Azure CLI. The CLI extension is added with `az extension add --name serial-console --upgrade`, and it installs automatically on first use.

### Prerequisites

- Boot diagnostics enabled on the VM.
- A user account with password authentication in the VM. You can create one with **Reset password** in the VM access extension under **Help**.
- The Virtual Machine Contributor role on the VM and on the boot diagnostics storage account.
- The Resource Manager model.
- A storage account that does not have Allow storage account key access disabled.
- TLS 1.2 is used. It is configured separately on the storage account.

### Open it

- VM: **All resources** > the VM > **Help** > **Serial console**.
- Scale set: **All resources** > the scale set > **Instances** > the instance > **Help** > **Serial console**. Enable boot diagnostics in the scale set model and upgrade the instances first.
- Advanced use covers system request or NMI, graceful reboot and forced power cycle. These are in linked articles.

## What the pages do not say

- A step-by-step procedure for a non-booting VM.
- Consistent role wording. One place says Contributor or higher and another says Virtual Machine Contributor.
- The current status of the storage change that the page dates to the end of 2025.
- How to create a password user when the VM cannot boot.

## A triage outline

This outline is practical advice built on the pages.

1. Open the boot diagnostics screenshot and read the error. Wait up to 10 minutes if nothing shows.
2. Compare any code with the list on the page and open the linked article.
3. For Linux, read the serial log.
4. If the VM responds to console input, try the Serial Console.
5. Enable boot diagnostics before a problem happens, so the data exists when you need it.

## Typical mistakes

- Enabling boot diagnostics only after the VM has failed.
- Using a Premium or ZRS storage account for diagnostics.
- Expecting a serial log for a Windows VM.
- Having no password-based user in the VM when you need the console.

## Related

- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Azure Serial Console overview (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/serial-console-overview)
- [Boot diagnostics (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/boot-diagnostics)
