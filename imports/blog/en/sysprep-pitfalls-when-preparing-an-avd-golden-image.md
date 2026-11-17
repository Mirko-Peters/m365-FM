---
title: "Sysprep pitfalls when preparing an AVD golden image"
summary: "Sysprep failures on an Azure Virtual Desktop golden image come from a documented set of causes: apps installed for one user, security software, BitLocker, pending updates and leftover state. This article maps each documented error to its cause and fix, and shows how to read the log to find the first real error."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [sysprep, golden-image]
keypoints:
  - "Read the generalize log in %WINDIR%\\System32\\Sysprep\\Panther first. Nerdio's help page says the first Error entry in setupact.log usually identifies the root cause and later errors are typically side effects."
  - "An app installed for a user but not provisioned for all users produces the error 'was installed for a user, but not provisioned for all users' and code 0x80073cf2. Learn gives a per-user removal followed by removal of the provisioning."
  - "BitLocker on the OS volume blocks sysprep, and Microsoft Defender for Endpoint state on the source image can block it too. Learn advises not onboarding the primary image."
  - "Failures after sysprep succeeded are a separate group: a disabled CD/DVD-ROM can leave new Azure VMs stuck at OOBE, and a generalized image uploaded or captured as specialized causes a provisioning timeout."
  - "After a sysprep error the tool cannot be run again on the same image until it is redeployed, so keep a snapshot taken before the first run. In Nerdio Manager, do not sysprep the image VM yourself: Power off & set as image generalizes a clone."
faq:
  - q: "Why does sysprep fail with 'was installed for a user, but not provisioned for all users'?"
    a: "Learn explains that sysprep's Appx provider only handles per-user packages and all-user (provisioned) packages. It fails when an all-user package was deprovisioned but not removed for a user, or when a user updated an all-user package on the reference computer, for example through the Microsoft Store. The documented fix is to remove the package for the user that is running sysprep, and then remove the provisioning."
  - q: "Can I just run sysprep again after it fails?"
    a: "Not on the same image. The Sysprep overview page on Learn says that after a Sysprep error you cannot run the tool on the same Windows image again and must first redeploy the image. The AVD golden image page gives the practical route: create a new VM from your last snapshot and run sysprep again. In Nerdio Manager, Sysprep runs on a clone, so its help page tells you to fix the cause on the image VM and run Power off & set as image again."
  - q: "Does Nerdio Manager avoid these problems?"
    a: "Only some of them. Nerdio Manager runs Sysprep /generalize on a temporary clone of the image VM, so the image VM itself is not sysprepped. It also removes local user accounts to prevent Sysprep from failing due to per-user modern apps, but its help page says the apps remain after the accounts are removed and can still block Sysprep. For BitLocker, security software and domain join, the page lists them under common mistakes: do not enable BitLocker, do not install security software on the image, and do not join the image to your identity provider. A failed task shows an Error status with downloadable Sysprep logs."
---

Sysprep failures on an Azure Virtual Desktop image come from a documented set of causes: an app installed for one user, security software, an encrypted OS disk, pending updates, or state left behind by an earlier run. The first error entry in the generalize log usually names the cause. This article is the troubleshooting companion to [Sysprep explained](/entity/sysprep/).

## Find the first error before changing anything

For a [golden image](/entity/golden-image/) the generalize log in `%WINDIR%\System32\Sysprep\Panther` matters, and `setupact.log` is its main file; specialize and OOBE logs sit in `%WINDIR%\Panther` and `%WINDIR%\Panther\Unattendgc`.

Nerdio's help page gives the reading rule: open `setupact.log` and find the first Error entry, because it usually identifies the root cause and later errors are typically side effects. Learn's Store apps page shows its example in `SetupErr.log`: the first entry says a package "was installed for a user, but not provisioned for all users", followed by lines naming `SysprepGeneralize`, `RunExternalDlls` and `0x80073cf2`. Our reading is that those later lines are the same failure propagating.

In Nerdio Manager a failed task shows an Error status: open Details, select Download logs, and then Cleanup to delete the temporary VM.

## Error reference

These are the documented errors with the cause and fix each page gives. The BitLocker, `c000000d`, RPC and "Object reference" rows come from Nerdio's help page, where running the task again means starting Power off & set as image once more.

| Log line or symptom | Documented cause | Documented fix |
|---|---|---|
| `Package <name> was installed for a user, but not provisioned for all users`, `0x80073cf2` | An all-user app was deprovisioned but not removed for a user, or updated by a user | Remove the package for the user, then the provisioning (pitfall 1) |
| `BitLocker is on for the OS volume. Turn BitLocker off to run Sysprep.` | BitLocker is enabled on an image drive | Disable BitLocker on the image VM, run the Nerdio task again |
| `BiUpdateEfiEntry failed c000000d` | Pending Windows updates need a restart | Start the image VM, install updates, restart, run the task again |
| `Remove-AppXPackage: The remote procedure call failed.` | Image joined to Active Directory, Microsoft Entra ID or Entra Domain Services and the account lacks permissions | Review `C:\Users`, sign in with each account until the command succeeds |
| `Error in executing action for Windows-SenseClient-Service` | Defender for Endpoint state on the source image | Offboard the image (pitfall 2) |
| `Object reference not set to an instance of an object.` | Nerdio Manager error for an unknown Windows version | Clone the VM and run Sysprep on the clone in the Azure portal, or wait for support |

## Pitfall 1: apps installed for one user

Learn's Store apps page explains that sysprep's Appx provider fails when an all-user package was deprovisioned (`dism -online /Remove-ProvisionedAppxPackage`) without being removed for a user, or when a user updated one, for example in the Microsoft Store.

Learn's resolution is to remove the package for the user running sysprep and then remove the provisioning:

1. List packages and users: `Get-AppxPackage -AllUsers | Where PublisherId -eq 8wekyb3d8bbwe | Format-List -Property PackageFullName,PackageUserInformation`. This filter lists only Microsoft-published packages. For manually provisioned apps from other publishers, Learn gives `Get-AppxPackage -AllUsers | Format-List -Property PackageFullName,PackageUserInformation`. Look for users where the package shows as Installed, then delete those accounts or sign in with them.
2. Remove the package, using the full name from step 1: `Remove-AppxPackage -Package <packagefullname>`
3. Remove the provisioning: `Remove-AppxProvisionedPackage -Online -PackageName <packagefullname>`

To stop the Store updating apps while you build, Learn says to unplug the internet connection or disable automatic updates in audit mode. 

Nerdio's page notes that Nerdio Manager removes local user accounts before Sysprep, but the apps remain and can still block it. Its example removes an `AdobeNotificationClient` package with `Get-AppXPackage -AllUsers | Where Name -like "AdobeNotificationClient*" | Remove-AppXPackage -AllUsers`, run on the image VM. Our reading is that the Microsoft publisher filter above would not list that package, so use the unfiltered command to find such apps.

Language packs interact with this. Learn's language pack page, written for Windows 10 Enterprise multi-session, says to refresh the inbox apps from the Inbox Apps ISO and then update them through the Store, while the Store apps page names a Store update as a cause of this failure. The two pages give different instructions, so check `SetupErr.log` before relying on the image.

## Pitfall 2: security software on the image

The AVD golden image page says an antivirus app may cause issues when sysprep starts and advises disabling all antivirus programs first. [Microsoft Defender for Endpoint](/entity/microsoft-defender-for-endpoint/) has two documented problems that are not the same:

- **A sysprep error (Nerdio).** Nerdio's page, which uses the older name Defender for ATP, describes sysprep failing to delete the `senseGuid` value (`RegDeleteValueW`, `dwRet = 0x5`); in Nerdio Manager it surfaces as "Wait for temp VM to stop timed out". The fix: download the offboarding package from Settings > Endpoints (Local Script method), run it on the source image, and confirm the service is stopped with startup type Manual. Nerdio advises installing it on session hosts after deployment, not on the source image.
- **A duplicate device identity (Learn).** Learn's page on non-persistent VDI devices says not to onboard the primary image, template VMs or replica VMs, because cloning can duplicate `senseGuid` and stop provisioned VMs appearing as new devices in the Defender portal. It gives this reason, not a sysprep error. For an already onboarded image, its "Update VDI images" steps offboard the machine and, with local administrator permissions and PsExec, delete `senseGuid`, `senseId` and related values from a SYSTEM shell; copy the exact list from the page.

Nerdio also says other security software on the image often interferes with generalization.

## Pitfall 3: BitLocker and encrypted disks

Nerdio's page says an encrypted OS disk prevents sysprep from completing, and the Azure generalize page requires fully decrypted drives. The Sysprep overview adds that running sysprep on an NTFS partition with encrypted files or folders makes that data unreadable and unrecoverable. Check [BitLocker](/entity/bitlocker/) on every drive of the image VM, since Nerdio lists BitLocker on any image drive as a cause.

## Pitfall 4: state the image should not carry

- **Domain or identity join.** Nerdio says joining desktop images to your identity provider can cause errors before sysprep, and the golden image page says to remove the VM from the domain first. The Sysprep overview says both that Sysprep runs only if the PC is in a workgroup, not a domain, and that Sysprep removes a domain-joined PC from the domain.
- **Entra sign-in flag.** Deploy the image VM without "Login with Microsoft Entra ID".
- **Unified Write Filter.** The golden image page says it is not supported for session hosts and must not be enabled in the image.
- **The AVD agent.** Do not deploy it on the golden image VM; session hosts built from it fail to join the host pool because the registration token has expired.
- **Leftover plugin folder.** If you capture an image from an existing session host and use it as the source image for session host update, delete `C:\packages\plugin` first; otherwise it prevents the DSC extension that joins the updated VMs to the host pool from running.

## Pitfall 5: sysprep succeeded, the new VM did not

Learn documents these deployment-time failures:

- **Stuck at OOBE.** Azure mounts an ISO to the DVD-ROM when it creates a VM from a generalized image, and a disabled CD/DVD-ROM driver leaves the VM stuck at OOBE. Before generalizing, run `reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\cdrom /v start /t REG_DWORD /d 1 /f`. The same list says to verify that no policy restricts removable storage access, for example All Removable Storage classes: Deny all access; it does not state what happens if one applies.
- **Wrong generalized setting.** Learn's custom image provisioning errors page covers a mismatch at upload or capture: A generalized OS uploaded as specialized gives a provisioning timeout with the VM stuck at the OOBE screen; captured as specialized, it times out because the original VM is marked as generalized. A specialized OS uploaded or captured as generalized gives a provisioning failure. The fix is the matching setting: re-upload the original VHD, or delete the image and recapture from the current VHDs. The golden image page instead says never to capture the same VM twice and to create a new VM from the latest snapshot. The two pages differ; our reading is that the golden image rule is the one written for AVD golden images.
- **Image Builder timing.** Learn says the D1_V2 size might be the reason for a sysprep timing problem: with customizations that run in under three seconds, the sysprep command checks for `WindowsAzureGuestAgent`, which might not be fully installed. The fix is a bigger VM size or a 60-second PowerShell sleep customization. For a Windows 10 image showing "Please wait for the Windows Modules Installer" at first logon, Learn suggests a restart customizer as the last customization and `/mode:vm`. See [Azure Image Builder](/entity/azure-image-builder/) and [custom image templates](/entity/avd-custom-image-templates/).

## What you cannot undo

After a sysprep error the image must be redeployed before the tool can run on it again (Sysprep overview). Azure says a generalized VM cannot be restarted. For a manual build, a snapshot taken before the first run is the recovery path. Nerdio's page says sysprepping an Azure VM makes it unusable in Azure, which is why Nerdio Manager generalizes a clone; see [Nerdio desktop image](/entity/nerdio-desktop-image/).

## Pre-sysprep checklist

Domain join, updates, BitLocker and per-user apps are in both Nerdio's and Learn's pages. The other points come from Learn's manual procedure and are not on Nerdio's page; our reading is that they are a reasonable check on Nerdio's image VM too. Items 7 and 8 are the manual path. In Nerdio Manager, do not run sysprep on the image VM yourself, because Nerdio's page lists it as a mistake; use Power off & set as image.

1. Build from a fresh base VM and take snapshots as you go.
2. Remove any domain or identity join, deploy without the Entra sign-in flag, skip the AVD agent, keep Unified Write Filter off.
3. Install updates, restart, and confirm nothing is pending.
4. Do not onboard the image to Defender for Endpoint; keep security software off it (Nerdio) or disable antivirus (Learn).
5. Confirm no drive is BitLocker-encrypted, and check for per-user and Store-updated packages.
6. Enable the CD/DVD-ROM driver and check removable storage policies.
7. Delete `C:\Windows\Panther`, which holds logs from earlier Sysprep runs that can cause Sysprep to fail, then run `sysprep.exe /generalize /shutdown`; Azure does not support `/unattend` here. Do not run it under the System account (for example Task Scheduler or PsExec); the Sysprep overview lists that as unsupported.
8. After shutdown, mark the VM generalized and capture it once.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Deprovision or generalize a VM before creating an image](https://learn.microsoft.com/en-us/azure/virtual-machines/generalize)
- [Microsoft Learn: Sysprep (System Preparation) Overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview)
- [Microsoft Learn: Sysprep Process Overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep-process-overview)
- [Microsoft Learn: Sysprep fails with Microsoft Store apps - Windows Client](https://learn.microsoft.com/en-us/troubleshoot/windows-client/setup-upgrade-and-drivers/sysprep-fails-remove-or-update-store-apps)
- [Microsoft Learn: Onboard non-persistent VDI devices to Microsoft Defender for Endpoint](https://learn.microsoft.com/en-us/defender-endpoint/configure-endpoints-vdi)
- [Microsoft Learn: Custom image provisioning errors](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-machines/windows/custom-image-provisioning-errors)
- [Microsoft Learn: Troubleshoot Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-troubleshoot)
- [Microsoft Learn: Install language packs on Windows 10 VMs in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/language-packs)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Nerdio Manager for Enterprise help: Troubleshoot desktop image Sysprep errors](https://nmehelp.getnerdio.com/hc/en-us/articles/26124310117773-Troubleshoot-desktop-image-Sysprep-errors)
- [Nerdio Manager for Enterprise help: Troubleshoot Sysprep and Windows Defender ATP](https://nmehelp.getnerdio.com/hc/en-us/articles/26124299152909-Troubleshoot-Sysprep-and-Windows-Defender-ATP)
