---
title: "Fix Windows Update Error 0x8024001E: Causes, Log Checks and Repair Steps"
summary: "Windows Update error 0x8024001E has several causes: corrupted update files, low disk space, flaky connectivity, scheduled tasks or WSUS problems. Check the logs first, then follow the repair steps Microsoft lists."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [windows-update-for-business, windows-server-update-services]
keypoints:
  - "Microsoft says several different issues can cause 0x8024001E, so identify the cause from logs before changing things."
  - "Learn lists four causes: corrupted or incomplete update files, too little disk space, intermittent connectivity and server maintenance or scheduled tasks."
  - "The resolution includes keeping at least 10 GB free on drive C and renaming the SoftwareDistribution folder."
  - "Restart the Windows Update service, the Update Orchestrator Service and BITS, then try the update again."
  - "In WSUS environments the error can appear together with secondary error code 0x800f0821."
faq:
  - q: "What does Windows Update error 0x8024001E mean?"
    a: "Microsoft Learn describes it as an installation failure of a Windows update. The article says several different issues can cause it, so the code alone does not point to one fix. The listed causes are corrupted or incomplete update source files, not enough disk space, intermittent connectivity, and server maintenance, scheduled tasks or other outages that disrupt the update."
  - q: "How much free disk space does Microsoft say is needed?"
    a: "The resolution steps on Microsoft Learn say to make sure that drive C has at least 10 GB of free space. That figure comes from the troubleshooting steps for this error."
  - q: "Where do I look for the cause in the logs?"
    a: "Learn points to the UpdateSessionOrchestrator logs in C:\\ProgramData\\USOShared\\Logs\\System for security updates, the CBS logs for unexpected restarts, and the Microsoft-Windows-TaskScheduler/Operational event log in Event Viewer for scheduled tasks. For WSUS problems it points to the System event log."
  - q: "Does this error also happen on Azure virtual machines?"
    a: "Yes. The Learn article is written for Windows client computers and for Azure Windows VMs. It advises backing up the operating system disk before troubleshooting and links to the Azure VM restore documentation."
  - q: "What if the steps do not fix it?"
    a: "Microsoft says to collect data with the Windows servicing data collection guidance linked in the article and then contact Microsoft Support."
---

Error 0x8024001E means a Windows update failed during installation. Microsoft Learn states that several different issues can cause it, so the fastest route is to read the logs, match what you see to one of four symptom patterns, and then apply the resolution steps in order. The steps below follow the Learn troubleshooting article for this code, which covers Windows client computers and Azure Windows VMs.

## Back up first

Learn opens the resolution with an important note: before you troubleshoot, back up the operating system disk. For Azure VMs the article links to the Azure Virtual Machine restore documentation. Several of the later steps rename system folders or stop services, so a restore point is sensible even on a physical PC.

## What can cause 0x8024001E

The article lists four conditions:

- The update source files on the computer are corrupted or incomplete.
- The computer does not have enough available disk space to install the update.
- Intermittent connectivity disrupts the update process.
- Server maintenance, scheduled tasks or other server outages disrupt the update process.

## Match your case to one of four symptoms

Learn groups the evidence into four symptoms. Check which one fits before you go to the repair steps.

### Symptom 1: A security update does not install

If the update is a security update, check the UpdateSessionOrchestrator logs in `C:\ProgramData\USOShared\Logs\System`. Look for entries from the download handler that report the result `0x8024001E` ("Download finished" with the update name and the error). The Learn example shows entries for Windows Server 2016 cumulative updates. The pattern is what matters: the download step reports the error for a named update.

### Symptom 2: An unexpected restart interrupts the installation

If the computer or VM restarts before the update finishes, the update might not install correctly. Check the CBS logs. The example in Learn shows lines such as "Trusted Installer is shutting down because: SHUTDOWN_REASON_AUTOSTOP" followed by the TiWorker shutdown signal. That points to a restart or shutdown in the middle of servicing.

### Symptom 3: A scheduled task interferes

Open Event Viewer and review the **Microsoft-Windows-TaskScheduler/Operational** log. Look for sequences where a task registration or update for a Windows Update task is followed by another task, in the Learn example a task named "Check WSUS Reg", completing around the same time. Use that information to identify which scheduled task disrupted the installation.

### Symptom 4: A WSUS issue with secondary error 0x800f0821

In WSUS environments a problem on the WSUS side can prevent the update from installing. The error can then appear together with the secondary code 0x800f0821. In Event Viewer, check the System log. The Learn example shows an installation failure with 0x8024001E for a cumulative update, followed by the Windows Update service entering the stopped state and then the running state.

## Resolution steps, in Microsoft's order

Follow these steps in sequence.

1. **Disable the interfering scheduled task**, if you identified one in symptom 3.
2. **Check WSUS**, if you use it. Make sure WSUS is working correctly. Learn links to its WSUS best practices article for managing the service. I did not read that linked page for this article, so use it as the next stop if WSUS is your update source.
3. **Check disk space.** Make sure that drive C has at least 10 GB of free space.
4. **Rename the software distribution folder.** Open a Command Prompt window and run these commands in sequence:

   ```
   net stop wuauserv
   rename c:\windows\SoftwareDistribution softwaredistribution.old
   net start wuauserv
   ```

5. **Restart the related services:** the Windows Update service (WUAServ), if you did not already restart it, the Update Orchestrator Service for Windows Update (UsoSvc) and the Background Intelligent Transfer Service (BITS).
6. **Try the update again.** Learn offers two methods:
   - Open **Windows Settings**, select **Windows Update**, and follow the prompts to check for and install updates.
   - Download the update manually from the Microsoft Update Catalog and install it from the command prompt. The article shows `expand -f:*x64.cab` to extract the .cab file from the .msu package, followed by `dism /online /add-package /packagepath:` pointing at that .cab file.

Learn adds an important warning for the retry: make sure the computer or VM does not restart during the update process unless the update itself requires a restart. That ties back to symptom 2.

## If it still fails

Microsoft says that if the issue persists, you should collect data as described in its article on collecting data to analyze and troubleshoot Windows servicing, Updates and Features on Demand scenarios, and then contact Microsoft Support. That is the documented escalation path.

## How I would use this in practice

This section is my advice, not a Microsoft statement.

- Start with the cheapest checks. Free space and a pending restart take a minute to verify. Renaming the SoftwareDistribution folder is more intrusive, so do it after those.
- If the error appears on many machines at once, suspect the shared part: the WSUS server, a maintenance window, a scheduled task pushed by policy or a network path. Fixing one PC at a time will not help.
- Write down which symptom matched and what you changed. If you need to open a support case, that record saves time.
- Keep update jobs and reboots apart. If a management tool restarts machines on its own schedule, check it against the update window.

## What the article does not cover

The Learn page describes causes and steps for this one code. It does not give a timeline for how long a fix takes, and I do not want to guess one. If the update keeps failing after all six steps, treat it as a case for data collection and support, as Microsoft advises.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Server Update Services](https://www.m365.fm/entity/windows-server-update-services/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Troubleshoot Windows Update Error 0x8024001E - Windows Client (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/troubleshoot-windows-update-error-0x8024001e)
