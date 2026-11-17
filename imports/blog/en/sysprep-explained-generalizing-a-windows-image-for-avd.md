---
title: "Sysprep explained: generalizing a Windows image for AVD"
summary: "Sysprep with the /generalize option removes computer-specific information such as the SID from a Windows installation, so that one captured image can create many session hosts. This article explains what it changes, which options matter, and how the manual, Azure Image Builder and Nerdio build paths each run it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [sysprep, golden-image]
keypoints:
  - "Microsoft Learn says an image must be generalized before it is deployed to new PCs, even when the hardware is identical. Generalizing resets the SID, clears system restore points and deletes event logs."
  - "On Azure, generalizing a VM cannot be undone and the VM cannot be restarted afterwards. Learn advises running sysprep on a copy made from a snapshot of the OS disk."
  - "The Azure sysprep step does not support a custom answer file, so the /unattend switch is not available there. Image Builder runs its own default sysprep command at the end of a build, and you can override it with c:\\DeprovisioningScript.ps1."
  - "Nerdio Manager runs Sysprep /generalize on a temporary VM cloned from the image VM's OS disk, then captures a new image version and deletes the temporary VM."
  - "A generalized image is the normal input for session hosts. Specialized images keep the computer name and accounts of the source VM, and the AVD pages checked here do not describe them for session hosts."
faq:
  - q: "Do I always have to run sysprep before creating an AVD session host image?"
    a: "For the golden image procedure that Learn describes for Azure Virtual Desktop, yes: the VM is generalized by running sysprep before capture. Azure Compute Gallery also supports specialized images, which keep machine-specific information such as the computer name, and Learn says generalizing is not necessary for a gallery image unless you want an image without it. The Azure Virtual Desktop pages checked for this article do not describe specialized images for session hosts."
  - q: "Can I run sysprep more than once on the same image?"
    a: "Learn says the sysprep command can run up to 1001 times on a single Windows image for Windows 8.1 and Windows Server 2012 or later, after which you must recreate the image. On Azure, a VM that has been generalized cannot be restarted, and the AVD golden image page says that if sysprep or capture fails you should create a new VM from your last snapshot and run sysprep again."
  - q: "Does Nerdio Manager generalize my image VM directly?"
    a: "According to the Nerdio help page, the Power off and set as image task clones the OS disk, starts a temporary VM, runs Sysprep /generalize on that clone, captures the image version and deletes the temporary VM. The help page does not say that the original image VM is generalized."
---

Sysprep is the Windows System Preparation tool, and its `/generalize` option removes computer-specific information from a Windows installation so that one captured image can create many VMs. For Azure Virtual Desktop it is the step between a customized base VM and a reusable [golden image](/entity/golden-image/): without it, every session host built from the image would carry the identity of the source machine. This article explains what [sysprep](/entity/sysprep/) changes, which options matter, and how the manual, Azure Image Builder and Nerdio build paths each run it. Failure cases are left to a separate article on sysprep pitfalls.

## What generalize does

Learn's description is short: "Generalizing the image removes computer-specific information such as installed drivers and the computer security identifier (SID)." Its page on command-line options adds that `/generalize` "resets the security ID (SID), clears any system restore points, and deletes event logs."

Three details matter:

- **Drivers are uninstalled, not deleted.** Generalizing uninstalls the configured devices but does not remove the device drivers from the PC. An unattend setting, `PersistAllDeviceInstalls`, can keep Plug and Play devices through the process, but it needs an answer file.
- **The SID is replaced per operating system volume.** If one computer holds several operating systems, sysprep must run on each one.
- **Copying without generalizing is not supported.** Learn states that moving or copying a Windows image to a different computer without running `Sysprep /generalize` is unsupported, "whether you use imaging, hard disk duplication, or another method". This applies even when the target has identical hardware.

The tool has a few operating rules. Only an administrator can run it, only one instance can run at a time, and it must be the sysprep that ships with the Windows image being prepared, run from `%WINDIR%\system32\sysprep`. It cannot run under the System account. The graphical interface is deprecated, and Learn tells you to use the command line.

## The options you will meet

| Option | Documented behavior |
|---|---|
| `/generalize` | Removes unique system information from the installation |
| `/oobe` | Restarts the computer into OOBE mode |
| `/shutdown` | Shuts the computer down after sysprep finishes |
| `/quit` | Closes the tool without rebooting or shutting down |
| `/quiet` | Runs without on-screen confirmation messages, for automation |
| `/mode:vm` | Generalizes a VHD for deployment on the same VM or hypervisor; the VHD must be deployed to a VM with the same hardware profile, and it can only be run inside a VM |
| `/unattend:<file>` | Applies an answer file |

Learn shows three slightly different invocations:

- Azure's generalize page: `sysprep.exe /generalize /shutdown`
- The Windows deployment page: `%WINDIR%\system32\sysprep\sysprep.exe /generalize /shutdown /oobe`
- Azure Image Builder's default script: `& $Env:SystemRoot\System32\Sysprep\Sysprep.exe /oobe /generalize /quiet /quit`

Azure's page tells you to let the VM shut down and not to restart it.

## Generalized or specialized

Azure Compute Gallery images carry an operating system state, which you set to generalized or specialized when you create the image definition. Learn describes generalizing as "a process that removes machine and user specific information from the VM" and names the Sysprep tool for Windows. Specialized VMs "haven't been through a process to remove machine specific information and accounts". A VM created from a specialized image keeps the computer name of the source VM, and Learn says you should change it to avoid collisions. Accounts that could sign in to the source VM can also be used on VMs created from the image. VMs from specialized images boot faster, because the source has already been through first boot.

For a gallery, the Azure page says generalizing "isn't necessary" unless you want an image without machine-specific information such as user accounts, while it is still required for a legacy image outside a gallery. The Azure Virtual Desktop golden image page, which this article follows, generalizes with sysprep. The AVD pages checked for this article do not discuss specialized images for session hosts, so treat the generalized path as the documented one.

## Manual path: sysprep on a golden image VM

The AVD golden image page and the Azure generalize page together give this order. The wider build and release process is in the article on the golden image lifecycle.

1. Create the base VM without the "Login with Microsoft Entra ID" flag, and take a snapshot.
2. Customize the VM. If it was domain joined, remove it from the domain before sysprep. The Windows page notes that sysprep itself removes a domain-joined PC from the domain, but the AVD page asks you to do it first.
3. Install the latest Windows updates, clean up temporary files and unneeded user profiles, and take the final snapshot.
4. Do not install the Azure Virtual Desktop agent to register the VM to a host pool. Hosts built from that image would fail to join because the registration token has expired.
5. Disable antivirus programs, because they can cause problems when sysprep starts, and make sure Unified Write Filter is not enabled, because it is not supported on session hosts.
6. On Azure, enable the CD/DVD-ROM in the OS. Learn says Azure mounts an ISO to the DVD-ROM when a VM is created from a generalized image, and with the DVD-ROM disabled the VM gets stuck at OOBE. The documented command is `reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\cdrom /v start /t REG_DWORD /d 1 /f`. Drives must also be fully decrypted, and no policy may deny access to all removable storage classes.
7. Delete `C:\Windows\Panther` if it exists, because it holds logs from earlier sysprep runs that can make sysprep fail.
8. From `%windir%\system32\sysprep`, run `sysprep.exe /generalize /shutdown`. Do not restart the VM when it finishes.
9. Mark the VM as generalized in Azure, for example with `Set-AzVm -ResourceGroupName $rgName -Name $vmName -Generalized`, and capture it.

If the source VM was itself created from an existing session host, the session host update page adds one more item: delete the `C:\packages\plugin` folder before creating the image, because it otherwise prevents the DSC extension that joins updated VMs to the host pool from running.

The point that matters most for the workflow is irreversibility. Learn says a generalized VM "can't be restarted", the process "isn't reversible", and that to keep the original VM working you should snapshot the OS disk, create a VM from the snapshot and generalize that copy. The AVD page says the same about capture: delete the VM after capturing, and never capture the same VM twice.

Learn also says that a custom answer file is not supported in the Azure sysprep step, so you cannot use `/unattend` there.

## Azure Image Builder and custom image templates

[Custom image templates](/entity/avd-custom-image-templates/) are built on [Azure Image Builder](/entity/azure-image-builder/), and the Learn page says that when creating the image, Azure Image Builder "also takes care of generalizing the image with sysprep". The Learn page for custom image templates, as retrieved, does not state a preview or general availability label.

The Image Builder reference explains the details. By default it runs deprovision code at the end of each image customization phase, and for Windows it uses Sysprep. The default script removes `Panther\unattend.xml` and then calls the sysprep command shown above. Two details matter:

- To change the command, create `c:\DeprovisioningScript.ps1` with a PowerShell or shell provisioner. Image Builder reads it and writes the commands to `customization.log`.
- The default command does not include `/mode:vm`. The reference says that property may be required for images that will have the Hyper-V role installed, and that adding it means overriding the command.

The reference says that if a Windows custom image builds successfully but VMs created from it fail, you should review the Windows Server sysprep documentation or raise a support request. The page does not say whether customizers can run after the generalize step.

## Nerdio Manager

[Nerdio desktop image management](/entity/nerdio-desktop-image/) wraps the same operation in a task. The Nerdio help page describes the Power off and set as image operation like this:

1. Power off the desktop image VM.
2. Clone the OS disk, then create and start a temporary VM from the clone.
3. Remove local user accounts so per-user modern apps do not block sysprep.
4. Run `Sysprep /generalize` on the temporary VM and wait for it to shut down.
5. Capture a new image version and update, add or replace the version in the Azure Compute Gallery, depending on your options.
6. Delete the temporary VM.

This mirrors the manual advice to generalize a copy rather than the original. The help page does not state what happens to the original image VM beyond the first step, so confirm in your own environment whether you can keep updating it. For failures, the page points to `%WINDIR%\System32\Sysprep\Panther` on the temporary VM and offers a Cleanup action on a failed task to delete the temporary VM and avoid extra cost.

## What happens after deployment

The next time the generalized image boots, the specialize configuration pass runs, and Learn says a deployed reference computer displays the OOBE screen. Learn documents where the logs land:

| Stage | Log path |
|---|---|
| Generalize | `%WINDIR%\System32\Sysprep\Panther` |
| Specialize | `%WINDIR%\Panther` |
| Unattended setup actions (OOBE) | `%WINDIR%\Panther\Unattendgc` |

`setupact.log` is the main file. Generalize actions are logged outside the standard Windows Setup logs because that pass deletes some of them.

## Limits to keep in mind

- **Run count.** Up to 1001 sysprep runs on one image for Windows 8.1 and Windows Server 2012 or later, 3 for Windows 7 and Server 2008 R2.
- **Not for deployed systems.** Microsoft does not support sysprep on Windows that has already been deployed, or for purposes other than image creation.
- **Server roles.** Not all server roles support sysprep, and a generalized installation with certain roles may not keep working after deployment.
- **Encrypted data.** Running sysprep on an NTFS partition with encrypted files or folders makes that data unreadable and unrecoverable.
- **Store apps.** Installing or updating Microsoft Store apps before generalizing causes sysprep to fail because apps must be provisioned for all users; the Windows page shows the error message and the log path to look for.
- **Applications.** Learn warns that some applications, such as security products, Store apps and virtualization agents, do not support sysprep or need specific preparation.

The companion article on sysprep pitfalls takes these cases further. The short version for planning: keep the pre-sysprep VM as a snapshot and treat the generalized VM as single use.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Remove machine specific information by deprovisioning or generalizing a VM before creating an image](https://learn.microsoft.com/en-us/azure/virtual-machines/generalize)
- [Microsoft Learn: Sysprep (Generalize) a Windows installation](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation)
- [Microsoft Learn: Sysprep command-line options](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep-command-line-options)
- [Microsoft Learn: Sysprep process overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep-process-overview)
- [Microsoft Learn: Sysprep (System Preparation) overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Azure VM Image Builder template reference](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json)
- [Microsoft Learn: Store and share images in an Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Nerdio Manager for Enterprise help: Troubleshoot desktop image Sysprep errors](https://nmehelp.getnerdio.com/hc/en-us/articles/26124310117773-Troubleshoot-desktop-image-Sysprep-errors)
