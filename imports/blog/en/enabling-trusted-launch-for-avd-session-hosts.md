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
  - "An in-place upgrade needs a stopped Generation 2 VM, a supported size and OS, no unsupported features, and the Enhanced policy if Azure Backup is on. Azure Site Recovery has to be disabled first; Learn's Site Recovery page calls migrating protected VMs unsupported yet lists steps, and protection has to be set up again afterwards."
  - "Images must be Generation 2. For an Azure Compute Gallery image, Learn recommends the TrustedLaunchSupported security type on the image definition, which creates both Gen2 and trusted launch VMs."
  - "For a single VM changed in place (paths B and C), rolling back to Standard is one-way: trusted launch cannot be re-enabled on that VM. The portal does not support that rollback, which needs newer CLI, PowerShell or API versions."
  - "Verify afterwards: security type on the VM, Secure Boot and vTPM, the Guest Attestation extension, and outbound access to the Azure Attestation endpoint."
faq:
  - q: "Can I enable trusted launch on a running session host?"
    a: "It depends on the generation. For a Gen2 VM, Learn's procedure stops the VM first, changes the security type, then starts it again. For a Gen1 VM in the portal, the VM must be running when you start, and the portal asks you to confirm the deallocation when you save; with the CLI or PowerShell you deallocate first. Either way the VM is deallocated during the change, so put the host in drain mode beforehand."
  - q: "What happens to my existing Gen1 session hosts?"
    a: "Learn describes an upgrade from Gen1 to Gen2 with trusted launch for which you first convert the guest OS volume from MBR to GPT (on Windows with MBR2GPT), and does not support Gen1 to Gen2 without trusted launch. Our reading: replacing pooled hosts from a Gen2 image avoids that conversion, but Learn does not say so."
  - q: "Can I turn it off again if something breaks?"
    a: "For a single VM changed in place (paths B and C), yes, but it is one-way. Learn describes setting the security type back to Standard with newer Azure CLI, Azure PowerShell or API versions, not in the portal, and warns that trusted launch cannot be re-enabled on that VM afterwards. For path A, the service tries to roll back a host that fails to update to the previous configuration, and a failed update can only be retried or cancelled; see Rollback and pitfalls."
---

To enable trusted launch on [Azure Virtual Desktop](/entity/azure-virtual-desktop/) session hosts, first check how the host pool is managed. In a pooled host pool with a session host configuration, you set **Security type** to Trusted launch virtual machines in a session host update, and the service replaces the hosts. Otherwise you stop each Generation 2 VM and switch its security type, or you deploy new hosts from a Generation 2 image.

This is the how-to companion to [Trusted launch for Azure VMs and session hosts explained](/community/u/mirko-p/blog/trusted-launch-for-azure-vms-and-session-hosts-explained/), which covers what [trusted launch](/entity/trusted-launch/) does.

## Choose the path

Learn calls trusted launch the default state for newly created Azure Generation 2 VMs when the image, source disk and VM size support it. The [Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) page lists Trusted launch virtual machines as the default security type when you create a host pool with a session host configuration in the portal. Learn's FAQ says trusted launch as default "doesn't change existing Azure VMs", so the steps below mainly concern older hosts. Open a VM's **Overview** and read **Security type**.

Learn says the management approach cannot be changed after the pool is created, and session host configuration is for pooled pools only.

| Situation | Path | Effect on hosts |
|---|---|---|
| Pooled pool with a [session host configuration](/entity/avd-session-host-configuration/) | Session host update (path A) | Existing VMs are deleted or deallocated and new ones created |
| Standard-management pool, Gen2 VMs | Change each VM (path B) | Same VM, stopped and restarted |
| Standard-management pool, Gen1 VMs | Gen1 upgrade or new hosts (path C) | Disk conversion, or replacement |
| Any pool, your own image | Prepare a Gen2 image first (path D) | New hosts only |

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Check the prerequisites

Learn's page for [existing Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) lists what the VM needs:

- A supported size family and OS version: compare your VM size with the supported and not supported lists in the [overview](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch).
- No unsupported features. The overview names managed images and Linux VM hibernation.
- Azure Backup, if used, on the Enhanced policy. Learn says trusted launch cannot be enabled on VMs with Standard policy backup protection. See [Migrate Azure VM backups from standard to enhanced policy](https://learn.microsoft.com/en-us/azure/backup/backup-azure-vm-migrate-enhanced-policy).
- Azure Site Recovery: both the Gen2 page and the [Site Recovery page](https://learn.microsoft.com/en-us/azure/site-recovery/concepts-trusted-vm) say to disable it before the upgrade; the Gen2 page adds that it can be re-enabled afterwards. The Site Recovery page says protected Gen2 VMs cannot be migrated and its support matrix lists the migration as not supported, yet it gives steps (disable replication, uninstall the extension and mobility service, then migrate); recovery points are deleted and the VM needs protection again. Our reading: treat protected VMs as unsupported unless confirmed otherwise.
- Restore points for production VMs, and a test on a non-production VM first.

## Path A: session host update

This path needs a pooled pool with a session host configuration and hosts in one region and resource group. The general workflow and known issues are in our article on [session host updates](/community/u/mirko-p/blog/managing-session-host-updates-with-a-session-host-configuration/); this section covers the trusted launch specifics.

1. Use a generation 2 image, which Learn says a trusted launch VM needs. Replicas and images from another subscription, where Learn's pages differ, are covered in the session host update article linked above.
2. Disable autoscale for the pool until the update finishes, and remove any resource locks on the session hosts or their resource group (both per the update pages).
3. In the Azure portal, open the pool's **Session hosts**, select **Manage session host update**, then **New update**. On **Basics**, set the VM batch size; one initial host is updated first, and the update stops if that host fails.
4. On the **Session hosts** tab, set **Security type** to **Trusted launch virtual machines**. Secure boot and vTPM are selected automatically.
5. On **Schedule**, choose **Schedule update now** or a time up to two weeks ahead. On **Notifications**, set the sign-out delay (0 to 60 minutes), then select **Review** and **Update**.

Learn says it takes around 20 minutes for a session host to update, with each batch updated concurrently. Follow progress in the blue banner under **Session hosts**, using **Refresh**.

Do not change drain mode or remove VMs during the update; the service manages drain mode.

## Path B: change existing Gen2 VMs

Use this for standard management and Generation 2 VMs. Drain one host first, using **Turn drain mode on** under **Host pools**, **Session hosts**, or `Update-AzWvdSessionHost` with `AllowNewSession = $False` per [drain mode](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode). Existing sessions stay active; stop the VM when none remain.

Portal steps:

1. Confirm the VM generation is **V2** and select **Stop**.
2. On the VM **Overview**, under **Security type**, select **Standard**; the **Configuration** page opens.
3. Open the **Security type** list, select **Trusted launch**, tick **Secure Boot** and **vTPM**, and select **Save**.
4. Start the VM and confirm that you can sign in over RDP.

Learn adds that vTPM is on by default, Secure Boot is not (strongly recommended), and VMs created from a Compute Gallery image, a managed image or an OS disk cannot be upgraded in the portal. Use the CLI or PowerShell:

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

Check that `securityType` shows `TrustedLaunch`, then end drain mode and test a connection.

## Path C: Gen1 hosts

Learn's [Gen1 upgrade](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1) does not support Gen1 to Gen2 without trusted launch, and the guest OS volume, usually MBR on Gen1, must be updated to GPT first. For Windows: `MBR2GPT /validate /allowFullOS`, stop if validation fails, then `MBR2GPT /convert /allowFullOS`, which is irreversible. Windows Server 2016 is excluded on this path, and Windows OS volume encryption such as BitLocker must be disabled before and re-enabled afterwards. The same Enhanced backup policy and Site Recovery prerequisites apply as for Gen2.

Before running MBR2GPT, take a full backup or create restore points: a VM upgraded this way cannot be rolled back to Gen1, only recovered from a backup or restore point taken before. The Windows system volume cannot be extended after the conversion, so extend it first.

Afterwards, set the security type as in path B. In the portal the Gen1 VM must be running; you acknowledge the volume update, tick Secure Boot and vTPM, save and confirm the deallocation. With the CLI or PowerShell, deallocate it first. Learn's known issue: the image reference still shows Gen1, so reimaging fails to boot. To replace Gen1 hosts instead, see path D.

## Path D: a Gen2 image that supports trusted launch

For your own [golden images](/entity/golden-image/) in [Azure Compute Gallery](/entity/azure-compute-gallery/), Learn recommends an image definition with security type `TrustedLaunchSupported`. The source must contain no VM guest state; the image can create Gen2 or trusted launch VMs.

```azurecli
az sig image-definition create --resource-group MyResourceGroup --location eastus \
    --gallery-name MyGallery --gallery-image-definition MyImageDef \
    --publisher MyPublisher --offer MyOffer --sku MySku \
    --os-type Windows --os-state Generalized --hyper-v-generation V2 \
    --features SecurityType=TrustedLaunchSupported
```

Replace the placeholder names with your own.

Learn's overview lists managed images as unsupported with trusted launch and recommends Azure Compute Gallery. The [deployment article](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-portal) is consistent: it names a Gen2 managed image only as a source for a gallery image version whose definition is `TrustedLaunchSupported`, and says managed images cannot be created for trusted launch VMs. The [FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq) says to bypass the trusted launch default (`securityType` of `Standard`) on a Gen2 VM used to create managed images, or to generate `TrustedLaunchSupported` gallery images with Azure Image Builder or Packer.

### Deploy new hosts from the image

For a standard-management pool, the [Add session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool) page lists the security type options without naming a default. Generate a registration key (**Host pools**, the pool, **Registration key**, **Generate new key**). Then open **Session hosts**, select **+ Add**, and on the **Virtual machines** tab set **Security type** to **Trusted launch virtual machines** (secure boot and vTPM are selected automatically). Select your gallery image via **See all images**, choose the size, complete the other tabs and select **Create**.

The page says all session hosts in a pool should have the same configuration; our reading is to drain and remove old hosts once no sessions remain.

## Verify and monitor

1. On each VM's **Overview**, confirm **Security type**, Secure Boot and vTPM.
2. For monitoring, tick **Integrity monitoring** under **Settings**, **Configuration**. Learn says this installs the Guest Attestation extension, and Secure Boot and vTPM must be on first.
3. Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-portal) lists letting firewalls reach `*.attest.azure.net`. If the extension fails to provision behind an NSG, Learn's fix is an outbound Allow rule for the `AzureAttestation` service tag.

## Rollback and pitfalls

- **Rollback of a single VM is one-way.** For paths B and C, Learn says that after setting `securityType` to Standard, trusted launch cannot be re-enabled on that VM. The portal does not support this rollback; it needs Azure CLI 2.86.0, Azure PowerShell 15.6.1 or API version 2025-11-01, or later.
- **Rollback and failures in path A.** Per Learn's [troubleshooting page](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-session-host-configuration-update), a host that fails to update is rolled back to the previous session host configuration if possible; hosts already updated are not rolled back. The service finishes the current batch and marks the update failed; you can only retry or cancel. If a rollback fails, the host is unavailable and capacity drops (our reading: the pool then has mixed security types). An update that fails to initiate cannot be retried; cancel and schedule a new one. Statuses and recovery are in the session host update article. Learn describes no undo for a completed update; because the update pages list Standard as a selectable security type, our reading is that a further update with **Security type** set to Standard is the way back.
- **Unsigned components.** Per the overview, with Secure Boot on, a VM does not boot if a boot component is unsigned.

## Sources

Microsoft Learn pages unless noted.

- [Enable Trusted launch on existing Azure Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) (updated 19 June 2026)
- [Upgrade existing Azure Gen1 VMs to Trusted launch](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1) (updated 19 June 2026)
- [Deploy a virtual machine with Trusted Launch enabled](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-portal)
- [Trusted Launch for Azure virtual machines](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) (updated 25 September 2026)
- [Migrate Azure VM backups from standard to enhanced policy](https://learn.microsoft.com/en-us/azure/backup/backup-azure-vm-migrate-enhanced-policy)
- [Azure Site Recovery support for Azure trusted launch virtual machines](https://learn.microsoft.com/en-us/azure/site-recovery/concepts-trusted-vm)
- [Trusted launch FAQs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq)
- [Boot integrity monitoring overview](https://learn.microsoft.com/en-us/azure/virtual-machines/boot-integrity-monitoring-overview)
- [Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) (updated 2 July 2026)
- [Update session hosts using session host update in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure) (updated 2 July 2026)
- [Host pool management approaches for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool) (updated 2 July 2026)
- [What's new in Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) (updated 21 October 2026)
- [Drain session hosts for maintenance in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) (updated 1 October 2026)
- [Troubleshoot session host configuration and session host update in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-session-host-configuration-update)
- [Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612) (Microsoft Tech Community, July 2026)
