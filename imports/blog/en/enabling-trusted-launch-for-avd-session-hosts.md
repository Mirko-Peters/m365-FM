---
title: "Enabling trusted launch for AVD session hosts"
summary: "How you enable trusted launch depends on how the host pool is managed: in a pool with a session host configuration you change the security type in a session host update, otherwise you change each stopped Generation 2 VM or replace it. This guide covers prerequisites, the image, the commands and the checks."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [trusted-launch, azure-virtual-desktop]
keypoints:
  - "Pick the path first: a pooled pool with a session host configuration changes the security type in a session host update. A pool with standard management means changing each Gen 2 VM or replacing it."
  - "An in-place upgrade needs a stopped Generation 2 VM, a supported size and OS, no unsupported features, and the Enhanced policy if Azure Backup is on. Disable Azure Site Recovery first."
  - "Images must be Generation 2. For an Azure Compute Gallery image, Learn recommends the TrustedLaunchSupported security type on the image definition, which creates both Gen2 and trusted launch VMs."
  - "Rolling back to Standard is one-way: trusted launch cannot be re-enabled on the same VM. Rollback is not available in the portal and needs newer CLI, PowerShell or API versions."
  - "Verify afterwards: security type on the VM, Secure Boot and vTPM, the Guest Attestation extension, and outbound access to the Azure Attestation endpoint."
faq:
  - q: "Can I enable trusted launch on a running session host?"
    a: "No. Learn's procedure for an existing Generation 2 VM stops (deallocates) the VM first, changes the security type, then starts it again. Put the host in drain mode beforehand so that no new sessions arrive, and plan for the VM being offline for the change."
  - q: "What happens to my existing Gen1 session hosts?"
    a: "Learn describes an upgrade path from Gen1 to Gen2 with trusted launch that includes converting the guest OS disk from MBR to GPT with MBR2GPT, and it does not support Gen1 to Gen2 without trusted launch. Our reading: for pooled hosts, replacing them from a Gen2 image avoids that conversion, but Learn does not say so."
  - q: "Can I turn it off again if something breaks?"
    a: "Yes, but it is one-way. Setting the security type back to Standard works with Azure CLI 2.86.0 or later, Azure PowerShell 15.6.1 or later, or Microsoft.Compute API version 2025-11-01 or later, not in the portal. Learn warns that trusted launch cannot be re-enabled on the same VM afterwards, and advises a test on a non-production Gen2 VM and restore points before any change."
---

To enable trusted launch on Azure Virtual Desktop session hosts, first check how the host pool is managed. In a pooled host pool with a session host configuration, you set **Security type** to Trusted launch virtual machines in a session host update, and the service replaces the hosts. Otherwise you stop each Generation 2 VM and switch its security type, or you deploy new hosts from a Generation 2 image.

This is the how-to companion to [Trusted launch for Azure VMs and session hosts explained](/community/u/mirko-p/blog/trusted-launch-for-azure-vms-and-session-hosts-explained/), which covers what [trusted launch](/entity/trusted-launch/) does. Here the focus is the order of steps, the values and the stumbling blocks for [Azure Virtual Desktop](/entity/azure-virtual-desktop/).

## Choose the path

Trusted launch is the default for newly created Azure Generation 2 VMs, and session hosts added in the Azure portal default to Trusted virtual machines, per Learn. Existing VMs keep their setting, so the steps below mainly concern older hosts. Open a VM's **Overview** and read **Security type**.

Which path applies depends on how the host pool was created. Learn says the management approach is set at creation and cannot be changed later, so a pool created without a session host configuration cannot get one afterwards. "Standard management" here is that approach, not the security type Standard. Session host configuration is for pooled host pools only, and its hosts cannot be changed outside the service with tools designed for standard management.

| Situation | Path | Effect on hosts |
|---|---|---|
| Pooled pool with a [session host configuration](/entity/avd-session-host-configuration/) | Session host update (path A) | Existing VMs are deleted or deallocated and new ones created |
| Standard-management pool, Gen2 VMs | Change each VM (path B) | Same VM, stopped and restarted |
| Standard-management pool, Gen1 VMs | Gen1 upgrade or new hosts (path C) | Disk conversion, or replacement |
| Any pool, your own image | Prepare a Gen2 image first (path D) | New hosts only |

Microsoft announced general availability of enhanced host pool management, including session host configuration and update, in July 2026 (Tech Community). Some Learn pages still carry preview wording; check the current page before relying on a limit.

## Check the prerequisites

Learn's page for [existing Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) lists what the VM needs:

- A supported size family and OS version. The [overview](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) lists Windows 10 and 11 and Windows Server 2016 to 2025, and size families such as B, D, E, F and L; A, Dv2 and Dv3 are not supported. Check its live size table, which has columns for sizes that are "currently not supported".
- No unsupported features. The overview names managed images and Linux VM hibernation.
- Azure Backup, if used, on the Enhanced policy. Learn says trusted launch cannot be enabled on VMs with Standard policy backup protection, and the migration article is labelled preview.
- Azure Site Recovery disabled before the upgrade, then reconfigured afterwards.
- Restore points for production VMs, and a test on a non-production VM first.

For monitoring, Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-portal) asks you to allow the `AzureAttestation` service tag in outbound NSG rules, let firewalls reach `*.attest.azure.net`, and onboard the subscription to Defender for Cloud, since otherwise you cannot monitor boot integrity.

## Path A: session host update

This path applies to pooled host pools with a session host configuration whose session hosts are all in the same Azure region and resource group. Learn says a trusted launch VM needs a generation 2 image.

1. Prepare the image. A Compute Gallery image should have at least two replicas, and an image in a different subscription from the host pool is not supported.
2. Disable autoscale for the pool. The [session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) page says to disable it before the update and keep it off until the update finishes.
3. Remove resource locks on the session hosts and their resource group.
4. In the Azure portal, open **Azure Virtual Desktop**, then **Host pools**, select the pool, then **Session hosts**.
5. Select **Manage session host update**, then **New update**. Alternatively select **Manage session host configuration**, then **Edit**.
6. On the **Basics** tab, set the VM batch size, the maximum number of hosts removed at a time. Learn says one initial host is updated first, and the update stops if that host fails.
7. On the **Session hosts** tab, set **Security type** to **Trusted launch virtual machines**. Secure boot and vTPM are selected automatically. Review image, size and disk type too.
8. On the **Schedule** tab, choose **Schedule update now** or a time up to two weeks ahead. On **Notifications**, set the minutes before users are signed out (0 to 60) and a message.
9. Review and select **Update**. Watch the blue banner under **Session hosts** and select **Refresh**.

Learn plans about 20 minutes per session host, with the hosts in a batch updated concurrently. Our arithmetic for 10 hosts and a batch size of 2: the initial host plus five batches is six rounds of about 20 minutes, so roughly 120 minutes. Learn does not say whether the sign-out wait applies per batch or once.

Do not change drain mode or remove VMs during the update; the service sets drain mode itself. Files, registry keys or certificates added manually to session hosts are not present afterwards, so put them in the image, in Intune or Group Policy, or in the custom configuration script. A scheduled update cannot be edited. The OS disk name changes to the format `SessionHostName-DateTime_Hash`. The PowerShell examples on the [session host configuration update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure) page do not set the security type; that page lists it only in the portal steps. The session host configuration cmdlets come from a preview version of the Az.DesktopVirtualization module (from 5.3.0).

The [session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) page lists two limits that matter here: it is available only in the global Azure cloud, not Azure US Government or Azure operated by 21Vianet, and a purchase plan on a gallery image is not retained.

Our reading: because path A creates new VMs, switching back would be another update, not the one-way rollback of an in-place change. Learn does not document this, so test it on a spare pool.

## Path B: change existing Gen2 VMs

Use this for a host pool with standard management and Generation 2 VMs. Drain one host first, using **Turn drain mode on** under **Host pools**, **Session hosts**, or `Update-AzWvdSessionHost` with `AllowNewSession = $False` per [drain mode](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode). Existing sessions stay active.

Portal steps:

1. Confirm the VM generation is **V2** and select **Stop**.
2. On the VM **Overview**, under **Security type**, select **Standard**; the **Configuration** page opens.
3. Open the **Security type** list, select **Trusted launch**, tick **Secure Boot** and **vTPM**, and select **Save**.
4. Start the VM and confirm that you can sign in over RDP.

Learn adds that vTPM is on by default, Secure Boot is not, and Learn recommends Secure Boot unless you use a custom unsigned kernel or drivers. VMs created from a Compute Gallery image, a managed image or an OS disk cannot be upgraded in the portal. Use the CLI or PowerShell:

```azurecli
az vm deallocate --resource-group myResourceGroup --name myVm
az vm update --resource-group myResourceGroup --name myVm \
    --security-type TrustedLaunch --enable-secure-boot true --enable-vtpm true
az vm start --resource-group myResourceGroup --name myVm
```

```azurepowershell
Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm
Get-AzVM -ResourceGroupName myResourceGroup -VMName myVm |
    Update-AzVM -SecurityType TrustedLaunch -EnableSecureBoot $true -EnableVtpm $true
Start-AzVM -ResourceGroupName myResourceGroup -Name myVm
```

The CLI output should show `securityType` as `TrustedLaunch` with both UEFI settings true. Then take the host out of drain mode and test a connection.

## Path C: Gen1 hosts

Learn treats this as a separate [Gen1 upgrade](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1). Gen1 to Gen2 without trusted launch is not supported, and the guest disk must change from MBR to GPT first. For Windows, Learn runs `MBR2GPT /validate /allowFullOS`, stops if validation fails, then `MBR2GPT /convert /allowFullOS`, which is irreversible. Windows Server 2016 is excluded on this path, and Windows OS volume encryption such as BitLocker must be disabled before and re-enabled afterwards.

Before running MBR2GPT, take a full backup or create restore points. Learn says a VM upgraded to trusted launch cannot be rolled back to Gen1 and has to be recovered from a backup taken before the upgrade. It also says the Windows system volume cannot be extended after the conversion, and recommends extending it before the upgrade.

Afterwards, set the security type as in path B. In the portal the Gen1 VM must be running; you acknowledge that the guest OS volume was updated and validated, tick Secure Boot and vTPM, save, and confirm the deallocation.

Known issues listed there matter for host pools: the image reference still shows the Gen1 source, so reimaging with that reference causes a boot failure, and the temporary disk can move from D: to E:.

## Path D: a Gen2 image that supports trusted launch

For your own [golden images](/entity/golden-image/) in [Azure Compute Gallery](/entity/azure-compute-gallery/), Learn recommends an image definition with security type `TrustedLaunchSupported`. The source must contain no VM guest state; the result can create Gen2 or trusted launch VMs.

```azurecli
az sig image-definition create --resource-group MyResourceGroup --location eastus \
    --gallery-name MyGallery --gallery-image-definition MyImageDef \
    --publisher MyPublisher --offer MyOffer --sku MySku \
    --os-type Windows --os-state Generalized --hyper-v-generation V2 \
    --features SecurityType=TrustedLaunchSupported
```

Learn's CLI example uses `--os-type Linux`; the value above is adapted. An image captured from a trusted launch VM needs the definition type `TrustedLaunch` and can create only trusted launch VMs. Managed images are not supported with trusted launch.

The [FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) adds that if a Gen2 VM is used to generate a `TrustedLaunchSupported` gallery image through Azure Image Builder or Packer, explicitly bypass the trusted launch default for that build VM by setting `securityType` to `Standard` (API 2025-11-01 or later).

## Verify and monitor

1. On each VM's **Overview**, confirm **Security type** and the Secure Boot and vTPM states. After a session host update, **Current Version** and **Target Version** under **Session hosts** show whether each host is current.
2. For monitoring, tick **Integrity monitoring** under **Settings**, **Configuration**. Learn says this installs the Guest Attestation extension. Secure Boot and vTPM must be on first.
3. If the extension fails to provision behind an NSG or proxy, Learn's fix is an outbound rule with the `AzureAttestation` service tag set to Allow.
4. Check Defender for Cloud recommendations on Secure Boot, vTPM and the extension.

## Rollback and pitfalls

- **Rollback is one-way.** Learn says that after setting `securityType` to Standard, trusted launch cannot be re-enabled on that VM. A Gen1 VM upgraded to trusted launch returns to Gen1 only from a backup.
- **Resize and drivers.** Per the overview, a trusted launch VM cannot be resized to an unsupported family such as M-series, and does not boot if unsigned boot components are found.
- **Backups.** Per the FAQ, backups from before the upgrade restore the whole VM or data disks, not the OS disk alone.

## Sources

Retrieved 17 November 2026.

- [Enable trusted launch on existing Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) (Microsoft Learn, last updated 19 June 2026)
- [Upgrade existing Gen1 VMs to Gen2 with trusted launch](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1) (Microsoft Learn, last updated 19 June 2026)
- [Deploy a trusted launch VM](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-portal) (Microsoft Learn)
- [Trusted launch for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) (Microsoft Learn, last updated 25 September 2026)
- [Trusted launch FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) (Microsoft Learn)
- [Boot integrity monitoring overview](https://learn.microsoft.com/en-us/azure/virtual-machines/boot-integrity-monitoring-overview) (Microsoft Learn)
- [Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) (Microsoft Learn, last updated 2 July 2026)
- [Update session hosts with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure) (Microsoft Learn, content date 2 July 2026)
- [Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches) (Microsoft Learn)
- [Drain session hosts for maintenance](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode) (Microsoft Learn)
- [Security recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-recommendations) (Microsoft Learn)
- [Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612) (Microsoft Tech Community, July 2026)
