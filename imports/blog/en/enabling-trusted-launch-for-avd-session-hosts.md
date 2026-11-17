---
title: "Enabling trusted launch for AVD session hosts"
summary: "How you enable trusted launch depends on how the host pool is managed: in a pool with a session host configuration you change the security type in a session host update, otherwise you change each stopped Generation 2 VM or replace it. This guide covers prerequisites, the image, the commands and the checks."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [trusted-launch, azure-virtual-desktop]
keypoints:
  - "Pick the path first: a pooled host pool with a session host configuration changes the security type in a session host update, which replaces the hosts. A standard pool means changing each Generation 2 VM, or replacing it."
  - "An in-place upgrade needs a stopped (deallocated) Generation 2 VM, a supported size and OS, no unsupported features, and the Enhanced policy if Azure Backup is on. Learn says to disable Azure Site Recovery first."
  - "Images must be Generation 2. For an Azure Compute Gallery image, Learn recommends the TrustedLaunchSupported security type on the image definition, which creates both Gen2 and trusted launch VMs."
  - "Rolling back to Standard is one-way: trusted launch cannot be re-enabled on the same VM. Rollback is not available in the portal and needs newer CLI, PowerShell or API versions."
  - "Verify afterwards: security type on the VM, Secure Boot and vTPM, the Guest Attestation extension, and outbound access to the Azure Attestation endpoint."
faq:
  - q: "Can I enable trusted launch on a running session host?"
    a: "No. Learn's procedure for an existing Generation 2 VM stops (deallocates) the VM first, changes the security type, then starts it again. Put the host in drain mode beforehand so that no new sessions arrive, and plan for the VM being offline for the change."
  - q: "What happens to my existing Gen1 session hosts?"
    a: "Learn describes an upgrade path from Gen1 to Gen2 with trusted launch that includes converting the guest OS disk from MBR to GPT with MBR2GPT, and it does not support Gen1 to Gen2 without trusted launch. Our reading: for pooled hosts, replacing them from a Gen2 image avoids that conversion, but Learn does not say so."
  - q: "Can I turn it off again if something breaks?"
    a: "Yes, but only once. Setting the security type back to Standard works with Azure CLI 2.86.0 or later, Azure PowerShell 15.6.1 or later, or Microsoft.Compute API version 2025-11-01 or later, not in the portal. Learn warns that trusted launch cannot be re-enabled on the same VM afterwards, so test on a copy first."
---

To enable trusted launch on Azure Virtual Desktop session hosts, first check how the host pool is managed. In a pooled host pool with a session host configuration, you set **Security type** to Trusted launch virtual machines in a session host update, and the service replaces the hosts. Otherwise you stop each Generation 2 VM and switch its security type, or you deploy new hosts from a Generation 2 image. Sources were retrieved on 17 November 2026.

This is the how-to companion to the explainer on [trusted launch](/entity/trusted-launch/), which covers what Secure Boot, the vTPM and boot integrity monitoring do. Here the focus is on the order of steps, the values and the stumbling blocks for [Azure Virtual Desktop](/entity/azure-virtual-desktop/).

## Choose the path

| Situation | Path | Effect on hosts |
|---|---|---|
| Pooled pool with a [session host configuration](/entity/avd-session-host-configuration/) | Session host update (path A) | Existing VMs are deleted or deallocated and new ones created |
| Standard pool, Gen2 VMs | Change each VM (path B) | Same VM, stopped and restarted |
| Standard pool, Gen1 VMs | Gen1 upgrade or new hosts (path C) | Disk conversion, or replacement |
| Any pool, your own image | Prepare a Gen2 image first (path D) | New hosts only |

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Check the prerequisites

Learn's page for [existing Gen2 VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm) lists what the VM needs:

- A supported size family and a supported OS version. Windows 10 and 11 (Pro, Enterprise, Enterprise multi-session) and Windows Server 2016 to 2025 are on the overview's list. Size families such as B, D, E, F and L are supported; A, Dv2 and Dv3 are not. Check the live [size table](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch), because it has columns for sizes that are "currently not supported".
- No unsupported features. The overview names managed images and Linux VM hibernation.
- Azure Backup, if used, on the Enhanced policy. Learn says trusted launch cannot be enabled on VMs with Standard policy backup protection, and the migration article is labelled preview.
- Azure Site Recovery disabled before the upgrade, then reconfigured afterwards.
- Restore points for production VMs, and a test on a non-production Gen2 VM first.

Two network items apply to monitoring. Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-portal) asks you to allow the `AzureAttestation` service tag in outbound NSG rules and to let firewalls reach `*.attest.azure.net`. It also recommends onboarding the subscription to Defender for Cloud, since without it you cannot monitor boot integrity.

## Path A: session host update

This path applies to pooled host pools with a session host configuration. It needs an image that supports Azure Virtual Desktop and matches the VM generation. Learn says a trusted launch or confidential VM needs a generation 2 image.

1. Prepare the image. A Compute Gallery image should have at least two replicas, and an image in a different subscription from the host pool is not supported.
2. Disable autoscale for the pool. The [session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) page says to disable it before the update and keep it off until the update finishes.
3. Remove resource locks on the session hosts and their resource group.
4. In the Azure portal, open **Azure Virtual Desktop**, then **Host pools**, select the pool, then **Session hosts**.
5. Select **Manage session host update**, then **New update**. Alternatively select **Manage session host configuration**, then **Edit**.
6. On the **Basics** tab, set the VM batch size, the maximum number of hosts removed at a time. Learn says one initial host is updated first, and the update stops if that host fails.
7. On the **Session hosts** tab, set **Security type** to **Trusted launch virtual machines**. Secure boot and vTPM are selected automatically. Also review image, size and OS disk type.
8. On the **Schedule** tab, choose **Schedule update now** or a time up to two weeks ahead. On **Notifications**, set the minutes before users are signed out (0 to 60) and a message.
9. Review and select **Update**. Watch the blue banner under **Session hosts** and select **Refresh**.

Planning figures from Learn: about 20 minutes per session host, with the hosts in a batch updated concurrently. Our arithmetic for 10 hosts and a batch size of 2: the initial host, then five batches, so roughly 100 to 120 minutes. Learn also says users are asked to sign out, so schedule outside peak hours.

Do not change drain mode or remove VMs during the update, because the service sets drain mode itself. An update cannot be edited once scheduled; cancel and schedule again. The OS disk name changes to the format `SessionHostName-DateTime_Hash`. The page's PowerShell examples set image, credentials, size and disk type, but none sets the security type, and the cmdlets for session host configuration come from a preview version of the Az.DesktopVirtualization module (5.3.0 and later). Use the portal for this change.

Limits on the same page: session host update is available only in the global Azure cloud, not Azure US Government or Azure operated by 21Vianet, and a purchase plan on a gallery image is not retained.

Our reading: because path A creates new VMs, switching the security type back later is another update, not the one-way rollback that applies to an in-place VM change.

## Path B: change existing Gen2 VMs

Use this for a standard pool whose VMs are Generation 2. Drain one host first, using **Turn drain mode on** under **Host pools**, **Session hosts**, or `Update-AzWvdSessionHost` with `AllowNewSession = $False` per [drain mode](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode). Existing sessions stay active until users sign out or you end them.

Portal steps from Learn:

1. Confirm the VM generation is **V2** and select **Stop**.
2. On the VM **Overview**, under **Security type**, select **Standard**; the **Configuration** page opens.
3. Open the **Security type** list, select **Trusted launch**, tick **Secure Boot** and **vTPM**, and select **Save**.
4. Start the VM and confirm that you can sign in over RDP.

Learn adds that vTPM is on by default, Secure Boot is not, and Microsoft strongly recommends enabling Secure Boot unless you use a custom unsigned kernel or drivers. VMs created from a Compute Gallery image, a managed image or an OS disk cannot be upgraded in the portal. Use the CLI or PowerShell:

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

The CLI output should return a `securityProfile` with `securityType` set to `TrustedLaunch` and both UEFI settings true. An ARM template route also exists on the same page. Then take the host out of drain mode and test a connection from a client.

## Path C: Gen1 hosts

Learn treats this as a separate [Gen1 upgrade](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-existing-vm-gen-1). Gen1 to Gen2 without trusted launch is not supported, and the guest disk must change from MBR to GPT first. For Windows, Learn runs `MBR2GPT /validate /allowFullOS`, stops if validation fails, then `MBR2GPT /convert /allowFullOS`, which is irreversible. Windows Server 2016 is excluded on this path, and Windows OS volume encryption such as BitLocker must be disabled before and re-enabled afterwards.

Known issues listed there matter for host pools: the image reference still shows the Gen1 source, so reimaging with that reference causes a boot failure, and the temporary disk can move from D: to E:. Our reading: for pooled hosts that are rebuilt from images anyway, new Gen2 hosts are less work, but test both.

## Path D: a Gen2 image that supports trusted launch

For your own [golden images](/entity/golden-image/) in [Azure Compute Gallery](/entity/azure-compute-gallery/), Learn recommends an image definition with security type `TrustedLaunchSupported`. The source must contain no VM guest state, and the result can create Gen2 or trusted launch VMs.

```azurecli
az sig image-definition create --resource-group MyResourceGroup --location eastus \
    --gallery-name MyGallery --gallery-image-definition MyImageDef \
    --publisher MyPublisher --offer MyOffer --sku MySku \
    --os-type Windows --os-state Generalized --hyper-v-generation V2 \
    --features SecurityType=TrustedLaunchSupported
```

The Learn example uses `--os-type Linux`; the PowerShell example on that page uses Windows, so the value above is adapted. An image captured from a trusted launch VM needs the definition type `TrustedLaunch` and can create only trusted launch VMs. If BitLocker is on in such a Windows VM, Learn says you might not be able to generalize it. Managed images are not supported with trusted launch; the FAQ says new features are supported only through Azure Compute Gallery.

One build-time detail from the [FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch-faq): if a Gen2 VM is used to generate a `TrustedLaunchSupported` gallery image through Azure Image Builder or Packer, explicitly bypass the trusted launch default for that build VM by setting `securityType` to `Standard` (API 2025-11-01 or later).

## Verify and monitor

1. On each VM's **Overview**, confirm **Security type** shows trusted launch and the Secure Boot and vTPM states.
2. For monitoring, tick **Integrity monitoring** under **Settings**, **Configuration**. Learn says this installs the Guest Attestation extension. Secure Boot and vTPM must be on first.
3. If the extension fails to provision behind an NSG or proxy, Learn's fix is an outbound rule with the `AzureAttestation` service tag set to Allow.
4. Look for Defender for Cloud recommendations on Secure Boot, vTPM and the extension; attestation fails if Secure Boot is off.

## Rollback and pitfalls

- **Rollback is one-way.** Learn says that after setting `securityType` to Standard, trusted launch cannot be re-enabled on that VM.
- **Resize limit.** A trusted launch VM cannot be resized to an unsupported family such as M-series, per the overview.
- **Unsigned drivers.** A trusted launch VM does not boot if unsigned boot components are found. Marketplace images should not hit this; the overview notes that CUDA and GRID driver installation on Secure Boot Windows VMs needs no extra steps.
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
- [Drain session hosts for maintenance](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode) (Microsoft Learn)
- [Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool) (Microsoft Learn)
- [Security recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-guide) (Microsoft Learn)
- [Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612) (Microsoft Tech Community, July 2026)
