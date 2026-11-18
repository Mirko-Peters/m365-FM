---
title: "Sysprep explained: generalizing a Windows image for AVD"
summary: "Sysprep with /generalize removes computer-specific information such as the SID from a Windows installation, so one captured image can create many session hosts. Covers options and the manual, Image Builder and Nerdio paths."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [sysprep, golden-image]
keypoints:
  - "Microsoft Learn says an image must be generalized before it is deployed to new PCs. Generalizing resets the SID, clears system restore points and deletes event logs."
  - "On Azure, generalizing a VM cannot be undone and the VM cannot be restarted. Learn advises generalizing a copy made from a snapshot of the OS disk."
  - "The Azure sysprep step does not support /unattend. Image Builder runs a default sysprep command at the end of each customization phase; c:\\DeprovisioningScript.ps1 overrides it."
  - "Nerdio Manager's Power off & set as image runs Sysprep /generalize on a temporary VM cloned from the image VM's OS disk, then captures a new image version and deletes the clone."
  - "The AVD golden image procedure runs sysprep before capture. Specialized images keep the source VM's computer name and accounts; Image Builder accepts only generalized sources."
faq:
  - q: "Do I always have to run sysprep before creating an AVD session host image?"
    a: "For the golden image procedure that Learn describes for Azure Virtual Desktop, yes: the VM is generalized by running sysprep before capture. Azure Compute Gallery also supports specialized images, which keep machine-specific information such as the computer name, and Learn says generalizing is not necessary for a gallery image unless you want an image without it. Azure Image Builder accepts only generalized source images, and Nerdio Manager's set-as-image dialog has a separate Specialized image option."
  - q: "Can I run sysprep more than once on the same image?"
    a: "Learn says the sysprep command can run up to 1001 times on a single Windows image for Windows 8.1 and Windows Server 2012 or later, after which you must recreate the image. On Azure, a VM that has been generalized cannot be restarted, and the AVD golden image page says that if sysprep or capture fails you should create a new VM from your last snapshot and run sysprep again. The Sysprep overview page adds two statements: Sysprep can be run an unlimited number of times to build and configure an installation, and after a Sysprep error the tool cannot be run again on the same image, which must be redeployed first. Our reading is that the 1001 counter applies to generalizing images and the unlimited statement to build and configuration runs, so plan around 1001."
  - q: "Does Nerdio Manager generalize my image VM directly?"
    a: "No. According to the Nerdio help pages, the Power off & set as image task clones the OS disk, starts a temporary VM, runs Sysprep /generalize on that clone, captures the image version and deletes the temporary VM. Nerdio's troubleshooting page says not to Sysprep the image VM manually, because Sysprepping an Azure VM makes it unusable in Azure, which is one reason Nerdio Manager Syspreps a clone. The set-as-image dialog also offers Leave desktop image VM running."
---

Sysprep is the Windows System Preparation tool, and its `/generalize` option removes computer-specific information from a Windows installation so that one captured image can create many VMs. For Azure Virtual Desktop it is the step between a customized base VM and a reusable [golden image](https://www.m365.fm/entity/golden-image/). This article explains what [sysprep](https://www.m365.fm/entity/sysprep/) changes, which options matter, and how the manual, Azure Image Builder and Nerdio build paths each run it. Failure cases are left to a separate article on sysprep pitfalls.

## What generalize does

Learn's description is short: "Generalizing the image removes computer-specific information such as installed drivers and the computer security identifier (SID)." Its page on command-line options adds that `/generalize` "resets the security ID (SID), clears any system restore points, and deletes event logs."

Three details matter:

- **Devices are uninstalled, drivers stay.** Generalizing uninstalls the configured devices but leaves the drivers on the PC. `PersistAllDeviceInstalls` can keep Plug and Play devices, but needs an answer file.
- **The SID is replaced per operating system volume.** With several operating systems on one computer, run sysprep on each.
- **Copying without generalizing is not supported.** Learn states that moving or copying a Windows image to a different computer without running `Sysprep /generalize` is unsupported, "whether you use imaging, hard disk duplication, or another method".

Run it as an administrator, one instance at a time, using the sysprep that ships with the image, never under the System account. The graphical interface is deprecated.

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

Learn shows three slightly different invocations (Azure's page says to let the VM shut down and not restart it):

- Azure's generalize page: `sysprep.exe /generalize /shutdown`
- The Windows deployment page: `%WINDIR%\system32\sysprep\sysprep.exe /generalize /shutdown /oobe`
- Azure Image Builder's default script: `& $Env:SystemRoot\System32\Sysprep\Sysprep.exe /oobe /generalize /quiet /quit`

## Generalized or specialized

Azure Compute Gallery images carry an operating system state, which you set to generalized or specialized when you create the image definition. Learn describes generalizing as "a process that removes machine and user specific information from the VM" and names the Sysprep tool for Windows. Specialized VMs "haven't been through a process to remove machine specific information and accounts". A VM created from a specialized image keeps the computer name of the source VM, which Learn says you should change to avoid collisions, and accounts that could sign in to the source VM also work on it. Such VMs boot faster.

For a gallery, the Azure page says generalizing "isn't necessary" unless you want an image without machine-specific information such as user accounts, while it is still required for a legacy image outside a gallery. The AVD golden image page, which this article follows, generalizes the VM by running sysprep before capture. Two other tools address specialized images explicitly. Image Builder states that it supports only generalized source images and that specialized images are not supported at this time. Nerdio Manager's set-as-image dialog has a Specialized image option, described as for images that keep machine and user-specific information and have not been through generalization.

## Manual path: sysprep on a golden image VM

The AVD golden image page and the Azure generalize page together give this order.

1. Create the base VM without the "Login with Microsoft Entra ID" flag, and take a snapshot.
2. Customize the VM, but do not leave it domain joined. The AVD golden image page says twice to remove the VM from the domain before sysprep, and Nerdio advises not joining desktop images to your identity provider at all, because domain-joined images can cause unexplained errors before Sysprep. The Sysprep (System Preparation) overview page contradicts itself: it says Sysprep runs only if the PC is in a workgroup, not a domain, and in the next sentence that Sysprep removes a domain-joined PC from the domain. Our reading: follow the AVD instruction.
3. Install the latest Windows updates, clean up temporary files and unneeded user profiles, and take the final snapshot.
4. Do not install the Azure Virtual Desktop agent. Hosts built from that image would fail to join the host pool because the registration token has expired.
5. Disable antivirus programs, which can cause problems when sysprep starts, and make sure Unified Write Filter is not enabled, because it is not supported on session hosts.
6. On Azure, enable the CD/DVD-ROM in the OS. Learn says Azure mounts an ISO to the DVD-ROM when a VM is created from a generalized image, and with the DVD-ROM disabled the VM gets stuck at OOBE. The documented command is `reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\cdrom /v start /t REG_DWORD /d 1 /f`. Drives must also be fully decrypted.
7. Delete `C:\Windows\Panther` if it exists, because it holds logs from earlier sysprep runs that can make sysprep fail.
8. From `%windir%\system32\sysprep`, run `sysprep.exe /generalize /shutdown`. Do not restart the VM when it finishes.
9. After sysprep has finished and the VM has shut down, mark it as generalized in Azure, for example with `Set-AzVm -ResourceGroupName $rgName -Name $vmName -Generalized`, and capture it.

If the source VM was itself created from an existing session host, the session host update page adds one more item: delete the `C:\packages\plugin` folder before creating the image, because it otherwise prevents the DSC extension that joins updated VMs to the host pool from running.

The point that matters most is irreversibility. Learn says a generalized VM "can't be restarted", the process "isn't reversible", and that to keep the original VM working you should generalize a copy made from a snapshot of the OS disk. The AVD page says the same about capture: delete the VM afterwards and never capture it twice. A custom answer file is not supported in the Azure sysprep step, so `/unattend` is unavailable there.

## Azure Image Builder and custom image templates

[Custom image templates](https://www.m365.fm/entity/avd-custom-image-templates/) are built on [Azure Image Builder](https://www.m365.fm/entity/azure-image-builder/), and the Learn page says that when creating the image, Azure Image Builder "also takes care of generalizing the image with sysprep".

The Image Builder reference explains the details. By default it runs deprovision code at the end of each image customization phase, and for Windows it uses Sysprep. The default script waits for the guest agent services (RdAgent, WindowsAzureTelemetryService, WindowsAzureGuestAgent) to run, removes WinRM certificates created by Packer, deletes `Sysprep\unattend.xml` and `Panther\unattend.xml` if present, calls the sysprep command shown above, and then waits until `ImageState` is `IMAGE_STATE_GENERALIZE_RESEAL_TO_OOBE`. Source images must already be generalized; the reference says specialized images are not supported at this time. Two more details matter:

- To change the command, create `c:\DeprovisioningScript.ps1` with a PowerShell or shell provisioner. Image Builder reads it and writes the commands to `customization.log`.
- The default command does not include `/mode:vm`. The reference says that property may be required for images that will have the Hyper-V role installed, and that adding it means overriding the command.

The reference says that if a Windows custom image builds successfully but VMs created from it fail, you should review the Windows Server sysprep documentation or raise a support request.

## Nerdio Manager

[Nerdio desktop image management](https://www.m365.fm/entity/nerdio-desktop-image/) wraps the same operation in a task. In Nerdio Manager, go to Cloud Desktops > Desktop Images and choose Power off & set as image, or Set as image, depending on the power state of the image VM. The troubleshooting page lists these steps for the Power off & set as image operation:

1. Power off the desktop image VM.
2. Clone the OS disk, then create and start a temporary VM from the clone.
3. Remove local user accounts so per-user modern apps do not block sysprep.
4. Run `Sysprep /generalize` on the temporary VM and wait for it to shut down.
5. Capture a new image version and update, add or replace the version in the Compute Gallery, depending on your options.
6. Delete the temporary VM.

Several details from the two help pages matter for sysprep:

- **Clone, not original.** The troubleshooting page says not to Sysprep the desktop image VM manually: Sysprepping an Azure VM makes it unusable in Azure, which is one of the reasons Nerdio Manager clones the VM and Syspreps the clone. This matches the manual advice to generalize a copy; do not run the manual sysprep step on a Nerdio desktop image VM.
- **Specialized image.** The set-as-image dialog has a Specialized image option, described as for images that keep machine and user-specific information and have not been through generalization. The troubleshooting page lists the steps above without mentioning that option, and neither help page says how the task treats the sysprep step when it is set.
- **Local profiles.** By default Nerdio Manager removes local user profiles, which the page says increases the likelihood of Sysprep success. Skip removal of local profiles bypasses this, and partially installed APPX apps are then not removed.
- **Original VM.** Leave desktop image VM running keeps the image VM running after the task, which the page describes as useful for pushing OS and application updates to it.

After a failure, the Sysprep logs are in `%WINDIR%\System32\Sysprep\Panther` on the temporary VM, and the Cleanup action on the failed task deletes that VM to avoid extra cost.

## What happens after deployment

The next time the generalized image boots, the specialize configuration pass runs. Learn documents where the logs land:

| Stage | Log path |
|---|---|
| Generalize | `%WINDIR%\System32\Sysprep\Panther` |
| Specialize | `%WINDIR%\Panther` |
| Unattended setup actions (OOBE) | `%WINDIR%\Panther\Unattendgc` |

`setupact.log` is the main file. Generalize actions are logged outside the standard Windows Setup logs because that pass deletes some of them.

## Limits to keep in mind

- **Run count.** Up to 1001 sysprep runs on one image for Windows 8.1 and Windows Server 2012 or later, 3 for Windows 7 and Server 2008 R2. After a Sysprep error, the overview page says the tool cannot run again on the same image until it is redeployed.
- **Encrypted data.** Sysprep on an NTFS partition with encrypted files or folders makes that data unrecoverable.
- **Store apps.** Installing or updating Microsoft Store apps before generalizing causes sysprep to fail because apps must be provisioned for all users.

The companion article on sysprep pitfalls takes these cases further. For planning, keep the pre-sysprep VM as a snapshot and treat the generalized VM as single use.

## Sources

- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Deprovision or generalize a VM before creating an image](https://learn.microsoft.com/en-us/azure/virtual-machines/generalize)
- [Microsoft Learn: Sysprep (Generalize) a Windows installation](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation)
- [Microsoft Learn: Sysprep Command-Line Options](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep-command-line-options)
- [Microsoft Learn: Sysprep Process Overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep-process-overview)
- [Microsoft Learn: Sysprep (System Preparation) Overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Create an Azure Image Builder Bicep file or ARM template JSON template](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json)
- [Microsoft Learn: Share VM images in a compute gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Nerdio Manager for Enterprise help: Desktop images: set as image](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775147789-Desktop-images-set-as-image)
- [Nerdio Manager for Enterprise help: Troubleshoot desktop image Sysprep errors](https://nmehelp.getnerdio.com/hc/en-us/articles/26124310117773-Troubleshoot-desktop-image-Sysprep-errors)
