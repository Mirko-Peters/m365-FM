---
title: "Nerdio scripted actions explained: automating Azure and Windows tasks"
summary: "Nerdio scripted actions are PowerShell scripts that Nerdio Manager runs either on a Windows VM or in an Azure Automation account. This article explains the two kinds, when Nerdio triggers them, how groups and sequences differ, and which limits to plan for."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-scripted-actions, nerdio-manager-for-enterprise]
keypoints:
  - "Windows scripts run on the VM via the Custom Script Extension. Azure runbooks run in an Automation account Nerdio creates, as Nerdio's service principal; use them for Azure changes."
  - "Triggers are host pool VM events (provisioned, re-imaged, destroyed, stopped, started), a bulk Hosts > Run script run, and Run script on a desktop image, with an optional schedule."
  - "Scripted Actions Groups run scripts in a set order, with optional default parameters. Scripted Sequences are a separate GUI feature in Public Preview, with documented limits."
  - "Nerdio's default-scripts page lists 8 Windows scripts and 3 runbooks and calls the list partial. Defaults are locked, so you clone one to change it."
  - "Two failure sources to plan for: Windows scripts fail after the 90-minute Azure timeout, and a runbook job can show Complete although the script failed."
faq:
  - q: "Should a task that changes Azure resources run as a Windows script or as a runbook?"
    a: "As a runbook. Nerdio says Azure-context scripts run on session hosts are less efficient and can be unreliable, and that some scripts need a restart or shutdown that is impossible on the session host itself. Runbooks run in the Automation account, in the security context of the Nerdio Manager service principal."
  - q: "Do scripted actions work on Windows 365 Cloud PCs?"
    a: "Nerdio's Windows 365 page describes how to enable Windows scripts only: switch on Enable Cloud PC and assign the script to all users, all devices or selected groups (groups are recommended). Nerdio's Windows scripts usage page separately lists 'Custom scripts are not supported on Cloud PCs', so test one script on a single Cloud PC before you rely on it."
  - q: "What is the difference between a scripted actions group and a scripted sequence?"
    a: "A group is an ordered list of existing scripts that behaves as if you had added each script to the task yourself. A sequence is a different feature: a GUI-built list of tasks such as install app, registry change, PowerShell script and restart, which Nerdio documents as Public Preview with task and device limits."
---

Nerdio scripted actions are PowerShell scripts that [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) runs either on a Windows VM or in an Azure Automation account. Use a Windows script when the change belongs on the machine, and an Azure runbook when the change targets Azure resources. The rest of this article shows how each kind runs, when Nerdio starts them and where the limits are.

## The two kinds side by side

[Nerdio](https://www.m365.fm/entity/nerdio/)'s overview describes [scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/) as scripts that "extend and customize" Nerdio Manager. They can use pre-populated variables such as `$AzureVMName`.

| | Windows script | Azure runbook |
|---|---|---|
| Runs | On the VM, through the Azure Custom Script Extension | In an Azure Automation account created and managed by Nerdio Manager |
| Context | Administrative privileges; the LocalSystem account per Nerdio's desktop image page | Security context of the Nerdio Manager service principal |
| Suited to | Software, registry, OS settings on a VM | Changes to Azure resources |
| Restart | Not inside the script; use "Individual with restart" or the restart option | "Individual with restart" is Windows-only |
| Timeout | 90 minutes, set by Azure | Execution Timeout field, in minutes, in Individual mode |

The Windows route has one notable property. Nerdio's page says the extension needs to be installed and removed every time Nerdio Manager executes a Windows scripted action, and that scripts can be combined into a single run if they do not interfere with each other, which saves time. Separately, Learn's Custom Script Extension page says a VM can have only one version of an extension applied. The execution mode sets how a script takes part: **Combined** marks it as safe to combine with other scripts, **Individual** runs it alone, and **Individual with restart** runs it alone and then restarts the VM.

For runbooks, Nerdio says there is no need to specify authentication, because Nerdio Manager is already signed in to Azure. The service principal still needs permissions on every resource the script changes. Azure modules are preinstalled in the Automation account. Runbooks are disabled by default and are enabled under **System > Settings > Nerdio** in the Azure Runbooks Scripted Actions section.

## Why Azure tasks belong in runbooks

Nerdio recommends runbooks for tasks in Azure context and gives two reasons for not running them on a session host: it is "less efficient and can be unreliable", and some scripts need a restart or shutdown that a session host cannot perform on itself. A script that assigns a public IP to a VM, for example, is an Azure operation and does not need to execute inside that VM.

Nerdio's runbook page names two execution modes. **Storage account** sends Azure Automation a link to the script in the connected storage account and is recommended for standard accounts. **Inline Script** sends the full script text and is recommended for hardened environments where Automation cannot reach the storage account; scripts larger than 500 KB may fail in that mode. A hybrid worker covers cases where Key Vault and other components are reachable only through private endpoints.

## What ships and where scripts come from

Nerdio's default-scripts page lists eight Windows scripts: Install MS Teams, Install MS 365 Office Apps, Virtual Desktop Optimization, Install Zoom VDI Client, Enable RDP Shortpath, Enable AVD Screen Capture Protection, Grant user local admin rights and Update Windows. It lists three runbooks: Assign Public IP to VM, Enable Anti-Malware Extension and Enable VM OS Disk Encryption. Several need review before use. The Virtual Desktop Optimization script removes many apps, such as Calculator, by default, and the Office script installs a default app list.

Nerdio calls the list partial and says defaults change over time. Defaults carry the Nerdio tag and are locked for editing, so you clone one to get an editable copy.

Your own scripts are created under **Endpoints > Automation > Scripted Actions**: select **Windows Scripts** or **Azure Runbooks**, then **Add scripted action**. You give a name, description, optional tags and an execution mode, then enter the code. Script repositories are marked Premium-only in Nerdio's help. Nerdio's own repository, called NMW, is linked by default and is built from Nerdio's public GitHub repositories; you can unlink it. You can also link your own GitHub, GitLab or [Azure DevOps](https://www.m365.fm/entity/azure-devops/) repository, which syncs hourly when auto-synchronization is on. The overview page does not state an edition requirement for scripted actions themselves.

## When scripts run

Nerdio's pages describe these main ways to start a script.

1. **Host lifecycle.** On a host pool, open the action menu, select **Settings > Scripted Actions** and toggle on the "Run scripted actions when..." options. Nerdio lists provisioning, re-imaging, destruction, stopping and starting of session hosts. A script attached here runs as a final step of that event. The option for VM creation has two slots: one runs right after the VM is created and has joined the domain, before the AVD agent registers; the other runs after the VM has joined the host pool, before users can reach it.
2. **Bulk run.** **Hosts > Run script** on a host pool runs a script against the hosts in the pool, now or on a schedule. Options include input parameters, passing AD credentials, restarting VMs afterwards, **Process hosts in groups of** N, **Number of failures before aborting**, and a message to active users with a delay in minutes. **Exclude not running hosts** skips stopped and deallocated hosts in scheduled runs. Without that option, powered-off hosts are started so the script can run and powered off again afterwards.
3. **Desktop images.** **Desktop Images > Run script** from the image's action menu offers a schedule, parameters, AD credentials and **Restart VM after script execution**. Scripts here receive extra variables: `$SATrigger` (set to "RunOnce"), `$SATriggerMode` (Manual or Schedule), `$DesktopImageVmName`, `$DesktopImageActiveVersion` and `$DesktopImageStagedVersion`.

Common pre-populated variables are `$HostPoolId`, `$HostPoolName`, `$AzureSubscriptionId`, `$AzureSubscriptionName`, `$AzureResourceGroupName`, `$AzureRegionName`, `$AzureVMName`, `$ADUsername` and `$ADPassword` (only when AD credentials are passed) and `$DesktopUser` (personal host pools). For Azure scripted actions, Nerdio says hovering over the Info icon next to Script shows the variables that apply.

## Groups and sequences are different things

A **Scripted Actions Group** (**Endpoints > Automation > Scripted Actions > Scripted actions groups**) bundles scripts, with optional default parameters, so you can assign the bundle during deployment tasks. Scripts run in the listed order, and you can drag them to reorder. Nerdio states that a group in a task behaves the same as adding its scripts individually, so the group is not isolated; you are responsible for the order of scripts and groups inside a task.

One restriction needs care. Nerdio's usage page lists, under "Custom Windows Scripted Actions Options", that these scripts run only as Individual or Individual with restart and that using scripts in Windows Scripted Actions Groups is not supported. The Groups page, in contrast, offers default parameters for groups. Nerdio does not say what "custom" covers here, so test a parameterized script before adding it to a group.

A **Scripted Sequence** is a separate feature. Nerdio describes it as a GUI for building task chains without scripting: install or uninstall an application, create, edit or delete registry keys, run a custom script, restart. It is distinct from scripted actions and is documented as **Public Preview**. Its page lists these preview limits:

- 50 tasks per sequence, including tasks in groups, and 20 application install or uninstall tasks.
- 100 devices per run. The 8.2.0 release note (a Public Preview build, 17 September 2026) raises this to 1,000 per execution and says the limit is planned for removal at GA. The notes for the GA builds 8.2.1 to 8.2.3 (current: 8.2.3, 13 November 2026) do not repeat that entry, and the Scripted Sequences page still lists 100 devices, so compare your installed version with both.
- Windows 365 is supported through Intune only, not through provisioning policies.
- Deployment to Intune devices goes through Intune platform scripts, and Nerdio gives about 30 minutes as the maximum start delay when a Task Worker is present, and over an hour when one must be installed first.

Release 8.0 (Public Preview, 2 June 2026) lets existing Windows scripted actions be added as tasks in a sequence. Nerdio also notes that the Task Worker script is currently unsigned, so the device script execution policy must allow unsigned scripts.

## Windows 365 Cloud PCs

Nerdio's page says you can use the same scripts for AVD and [Windows 365](https://www.m365.fm/entity/windows-365/) "without any significant modifications", and that only Windows scripts apply. In the script's settings you enable **Enable Cloud PC**, which is required. You choose whether to run with logged-on credentials (default: system context), enforce a signature check, run in a 64-bit PowerShell host, and assign to all users, all devices or selected groups; the page recommends groups. Submission can take several hours, and results appear in the Scripts column under **Windows 365 > Cloud PCs**. Nerdio's usage page lists "Custom scripts are not supported on Cloud PCs" under the same "custom" heading discussed above, so treat Cloud PC support as something to test on one device first.

## Limits worth planning for

- **Silent failure:** runbook jobs can end as Complete although the script failed. Nerdio recommends letting failing commands stop the script so the job reports Fail. For runbooks, `Write-Output` and `Write-Error` text appears in the task details and `Write-Verbose` does not. For Windows scripts, `Write-Output` goes to the VM logs only; select Request Custom PowerShell Scripts logs in the task details to retrieve it.
- **Module drift:** release 8.1.0 (a Public Preview build, 21 July 2026) notes that an Az.Accounts upgrade to 5.3.2 or later broke existing runbooks and scripted actions, and that Nerdio Manager can now restrict module versions.
- **Runtime:** Learn lists PowerShell 7.6, 7.4 and 5.1 as supported for Automation runbooks and recommends long-term supported versions such as 7.6 or 7.4 for new ones. Nerdio's 8.2.0 release notes mention PowerShell 7.4 runbook support, enabled by an opt-in setting, and do not mention 7.6; the 8.2.1 to 8.2.3 notes do not repeat the entry. Check your installed version before relying on 7.6.
- **Certificate:** runbooks use the `nmw-scripted-action-cert` certificate. Nerdio recommends the default 120-month validity when renewing.

## Native tools or Nerdio hooks

Scripted actions are not the only route. Learn documents the Custom Script Extension (90-minute limit, runs as LocalSystem) and Azure Automation runbooks directly. What Nerdio adds, per its pages, is the placement: events in the host lifecycle, desktop image steps, a bulk run with concurrency and abort thresholds, and variables filled in for you. If you manage a few static VMs outside Nerdio, you can use the native tools directly. For writing scripts that behave safely under these hooks, see the companion article "Writing a safe scripted action: parameters, secrets and testing". For calling Nerdio from outside, see "Automating Nerdio with the REST API and PowerShell".

## Related

- [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/)
- [Nerdio scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/)
- [Azure Automation](https://www.m365.fm/entity/azure-automation/)
- [PowerShell](https://www.m365.fm/entity/powershell/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [Nerdio Help: Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio Help: Considerations for Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124352596749-Considerations-for-Scripted-Actions)
- [Nerdio Help: Scripted actions for Azure Runbooks](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302308109)
- [Nerdio Help: Scripted Actions for Windows Scripts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124334667149-Scripted-Actions-for-Windows-Scripts)
- [Nerdio Help: Windows Scripted Actions: Usage, Supported Features, and Considerations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368713741-Windows-Scripted-Actions-Usage-Supported-Features-and-Considerations)
- [Nerdio Help: Default Scripts for Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124382667021-Default-Scripts-for-Nerdio-Manager)
- [Nerdio Help: Scripted Actions Groups](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368803213)
- [Nerdio Help: Scripted Sequences](https://nmehelp.getnerdio.com/hc/en-us/articles/41694096467981)
- [Nerdio Help: Run Bulk Host Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124337068045-Run-Bulk-Host-Scripted-Actions)
- [Nerdio Help: Desktop Images Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775171213-Desktop-Images-Scripted-Actions)
- [Nerdio Help: Scripted Actions for Windows 365](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302435469-Scripted-Actions-for-Windows-365)
- [Nerdio Help: Script repositories integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385380877)
- [Nerdio Help: Troubleshoot Scripts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124334376717)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677)
- [Learn: Custom Script Extension for Windows](https://learn.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-windows)
- [Learn: Azure Automation runbook types](https://learn.microsoft.com/en-us/azure/automation/automation-runbook-types)
