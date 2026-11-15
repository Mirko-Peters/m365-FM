---
title: "Fix Windows Update Error 0x8007000E or 0x800705AA: Insufficient Virtual Memory"
summary: "Windows Update error 0x8007000e or 0x800705aa from Microsoft Learn: how the symptoms and Event ID 2004 look, how to tell memory from the registry size limit in CBS.log, a clean restart workaround, automatic paging file management and resetting RegistrySizeLimit."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [windows-update-for-business]
keypoints:
  - "Both errors usually mean the computer or VM has too little available virtual memory to install the update."
  - "Learn names two common causes: third-party apps using lots of virtual memory, and a manually configured paging file instead of automatic management."
  - "Error 0x800705aa can instead be a registry problem. Check CBS.log for failures to load the COMPONENTS hive with ERROR_NO_SYSTEM_RESOURCES."
  - "Back up the OS disk first. Then set Automatically manage paging file size for all drives, restart and monitor memory."
  - "For the registry case, delete RegistrySizeLimit under HKLM\\SYSTEM\\CurrentControlSet\\Control or set it to 0, restart and try the update again."
faq:
  - q: "What do 0x8007000e and 0x800705aa mean?"
    a: "Microsoft Learn shows the messages Not enough memory resources available to complete this operation for 0x8007000e and Insufficient system resources exist to complete the requested service for 0x800705aa. In most cases the computer or VM does not have enough available virtual memory for Windows to install the update."
  - q: "When do I see 0x800705aa instead of 0x8007000e?"
    a: "The page says the second message typically occurs when you install an update with dism /online /add-package and the path of a .cab file."
  - q: "How do I know whether it is memory or the registry?"
    a: "Check CBS.log. If it shows Failed to load the COMPONENTS hive with HRESULT 0x800705aa ERROR_NO_SYSTEM_RESOURCES, the issue involves registry resources and the RegistrySizeLimit value. If the log instead shows DPX exceptions with Failed to create file in the SoftwareDistribution folder, Learn treats it as a nonregistry cause."
  - q: "What does the RegistrySizeLimit fix change?"
    a: "If the RegistrySizeLimit entry is set to a value other than 0, it restricts the maximum registry size, and Windows cannot do servicing such as updates when the registry reaches the limit. Delete the entry or set it to 0 under HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control, restart, and update again."
  - q: "What if nothing works?"
    a: "Learn says to contact Microsoft Support and to attach copies of the relevant CBS.log data to the support request."
---

A Windows update that fails with 0x8007000e or 0x800705aa is telling you that the machine ran out of something while installing. The Microsoft Learn page on these two codes separates a general virtual memory problem from a special case about the registry size limit, and it gives a clean restart as a workaround. This article follows that order.

## Symptoms

The update installation fails with one of these messages:

- Installer encountered an error 0x8007000e. Not enough memory resources available to complete this operation.
- An error occurred, Error 0x800705aa. Insufficient system resources exist to complete the requested service.

Learn notes that the second message typically occurs when you install the update with `dism /online /add-package /packagepath:<path of .cab file>`.

In Event Viewer you might also find **Event ID 2004**. Its description says Windows successfully diagnosed a low virtual memory condition and lists the programs that used the most virtual memory. The page's example names several java.exe processes.

## Step 1: Decide whether it is memory or the registry

Error 0x800705aa can point to the registry and not to general memory. To tell which, check the **CBS.log** file. Learn shows registry-related entries like these:

- Failed to load the COMPONENTS hive from C:\Windows\System32\config\COMPONENTS into registry key HKLM\COMPONENTS, with HRESULT 0x800705aa - ERROR_NO_SYSTEM_RESOURCES
- Failed to load component store
- Failed to get CSI store
- Failed to get component state

If instead the log shows DPX phase entries with DpxException hr=0x800705aa and Failed to create file in the SoftwareDistribution download folder, the page treats that as an example of a nonregistry cause. For how to use the log, Learn points to its page on Windows Update log files.

## Causes

In most cases the computer or virtual machine does not have enough available virtual memory to install the update. The most common reasons per Learn:

- Third-party applications use a lot of virtual memory.
- Virtual memory is manually configured instead of managed automatically.

In the registry case, the `RegistrySizeLimit` entry is set to a value other than 0. That restricts the maximum registry size. When the registry grows to the limit, Windows cannot do required servicing, such as updates.

## Workaround: clean restart

A normal startup launches system processes, antivirus software and utility apps that run in the background and can interfere with the update. A clean restart starts Windows without them.

1. Sign in as an administrator.
2. Enter **msconfig** in the Search box and select **System Configuration**.
3. Select **Services** > **Hide all Microsoft services** > **Disable all**.
4. Select **Startup** > **Open Task Manager**.
5. Under **Startup** in Task Manager, select each item and select **Disable**.
6. Close Task Manager.
7. In System Configuration select **Startup** > **OK**.
8. Restart the computer.

Then try the update again. Remember to undo these settings after the update, since the steps disable startup items. The page's steps end at the restart, so that last reminder is mine.

## Resolution

**Before you start:** the page says to back up the operating system disk. For VMs it points to Azure Virtual Machine restore.

### General resource issues

If the machine is a VM, consider upgrading the virtual hardware to give it more memory. To let Windows manage the paging file:

1. Select Search and enter **sysdm.cpl** to open **System Properties**.
2. Select **Advanced** > **Performance** > **Settings**.
3. In **Performance Options** select **Advanced** > **Virtual memory** > **Change**.
4. Make sure **Automatically manage paging file size for all drives** is selected and select **OK**.
5. Restart the computer.
6. Monitor the computer's available memory resources, so the issue does not return.

### Registry size limit issue

Learn warns that editing the registry incorrectly can cause serious problems, so back up the registry first.

1. Type **regedit** in the search bar, right-click **Registry Editor** and select **Run as administrator**.
2. Go to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control`.
3. Right-click `RegistrySizeLimit` and either select **Delete**, or select **Modify**, enter **0** in **Value data** and select **OK**.
4. Restart the physical computer or VM.
5. Try the Windows update again.

If it still fails, contact Microsoft Support and attach the relevant CBS.log data.

## Quick map

| What you see | Likely path |
| --- | --- |
| 0x8007000e, or Event ID 2004 naming a heavy process | Virtual memory shortage. Check apps and paging file |
| 0x800705aa after dism with a .cab | Virtual memory, or the registry case. Read CBS.log |
| CBS.log: COMPONENTS hive, ERROR_NO_SYSTEM_RESOURCES | RegistrySizeLimit |
| Fails with normal start, may work after clean restart | Background apps and services interfering |

## Habits that help (my advice)

This is my suggestion, not guidance from the page:

- Look at the Event ID 2004 text first. It names the processes that used the most virtual memory, which tells you what to stop or fix.
- On a VM, check the assigned memory before you change guest settings. The page suggests more virtual hardware.
- Do not set RegistrySizeLimit on purpose to a small value on machines that you update, unless you have a reason that you document.
- Keep the CBS.log from the failed attempt before you retry, since a support case will ask for it.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)

## Sources

- [Troubleshoot Windows Update error code 0x8007000e or 0x800705aa (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/error-0x8007000e-0x800705aa-insufficient-virtual-memory)
