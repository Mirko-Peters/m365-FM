---
title: "Run Scheduled Microsoft Graph Scripts on Azure Automation Hybrid Runbook Workers"
summary: "How to set up an extension-based Hybrid Runbook Worker, point a Graph PowerShell runbook at it with the Run on option, schedule it, and pick an authentication method, using Microsoft Learn's documented requirements and limits."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [azure-automation, hybrid-runbook-worker, microsoft-graph-powershell, graph]
keypoints:
  - "Use extension-based (V2) Hybrid Runbook Workers. Agent-based workers retired on 31 August 2024, and jobs on them were stopped from 1 April 2025."
  - "A worker needs two cores, 4 GB RAM, Windows PowerShell 5.1 on Windows and the Azure Connected Machine agent for non-Azure machines."
  - "Choose the group in Run on when you start or link the runbook. Jobs run as the local System account unless you configure custom credentials."
  - "Azure Automation schedules cannot run more often than hourly."
  - "Learn documents Connect-MgGraph -Identity but does not state it works from a hybrid worker, so test managed identity on the worker before you depend on it."
faq:
  - q: "Why use a Hybrid Runbook Worker for Graph scripts?"
    a: "Microsoft Learn says hybrid jobs are not subject to Azure sandbox limits on disk, memory or network sockets, nor the sandbox fair-share time limit, and can reach local resources. For a script that only calls Microsoft Graph, a cloud runbook is simpler. Use a worker when the script also needs on-premises access or exceeds sandbox limits."
  - q: "Can I schedule a runbook to run every 15 minutes?"
    a: "Not with a plain schedule. Learn says the most frequent interval for an Azure Automation schedule is one hour. Its two workarounds are a webhook called from Azure Logic Apps, or four schedules that start within 15 minutes of each other and each run hourly."
  - q: "Which operating systems and PowerShell versions does the worker support?"
    a: "Learn lists Windows Server 2016 and later plus Windows 10 and 11, and several Linux distributions. On Windows the worker needs Windows PowerShell 5.1 and .NET Framework 4.6.2 or later, and PowerShell Core is not supported for the extension itself. PowerShell 7.x runbooks need extension version 1.1.11 or later, with the runtime installed and an environment variable set."
  - q: "What identity does a job run under?"
    a: "Learn says Hybrid Runbook Worker jobs run under the local System account on Windows. You can change that for a group by setting Hybrid Worker credentials to Custom, which requires folder permissions so jobs are not suspended. Linux workers do not support Hybrid Worker credentials."
---

Most Graph scripts run fine in a normal Azure Automation runbook. A Hybrid Runbook Worker earns its place when the same script also needs something the cloud sandbox cannot give it: access to an on-premises resource, more disk or memory, or longer runtime. This guide covers setup, scheduling and the authentication questions that come with it.

## Decide whether you need a worker

Learn's overview lists the reasons: in-guest management of Azure VMs and Azure Arc-enabled servers, overcoming sandbox limits such as jobs over the three-hour cloud limit, reaching local services, keeping data on-premises, and reaching private services over an Azure virtual network. Hybrid jobs are not subject to the sandbox limits on disk, memory or network sockets, nor to the fair-share time limit. Only the worker's own resources apply.

If the script only calls Microsoft Graph over the internet, skip the worker.

## Step 1: Use the extension-based worker

Learn says the extension-based (V2) platform is the supported one. Agent-based (V1) user workers retired on 31 August 2024, and the page states that from 1 April 2025 all jobs on agent-based workers were stopped. A machine can run both during migration, so you can add V2, validate, and then remove V1.

Prerequisites from the install page:

- Two cores and 4 GB of RAM.
- For non-Azure machines, the Azure Connected Machine agent, which means the server is Azure Arc-enabled.
- A system-assigned managed identity on the machine. If it is off, it is enabled during the add process.
- Windows PowerShell 5.1 and .NET Framework 4.6.2 or later on Windows.
- Outbound TCP 443 to `*.azure-automation.net`. Requests time out after 30 seconds and fail after three attempts.

Not supported: virtual machine scale sets. Learn strongly recommends never installing the extension on a domain controller. A machine can belong to one worker group only, and a worker cannot report to several Automation accounts.

## Step 2: Create the worker group

In the Azure portal:

1. Open your Automation account.
2. Under **Process Automation**, select **Hybrid worker groups**.
3. Select **+ Create hybrid worker group** and enter a name.
4. Choose **Use Hybrid Worker Credentials**: Default uses the local system account, Custom uses a credential asset.
5. On the **Hybrid workers** tab, select **Add machines**. Only machines that are not in another group appear.
6. Select **Review + Create**, then **Create**.

Extension installation can take a few minutes. The group's **Platform** column should read **Extension based (V2)**. For several workers in one group, you get higher availability. Each worker polls every 30 seconds, and one worker generally picks up up to four jobs per ping.

You can script the same steps with `New-AzAutomationHybridRunbookWorkerGroup` and `New-AzAutomationHybridRunbookWorker`.

## Step 3: Install what the runbook needs

For PowerShell 7 runbooks, Learn requires the matching extension version and an installed runtime. For Windows:

- PowerShell 7.6 and 7.4: extension version 1.3.63 or later.
- PowerShell 7.2: extension version 1.1.11 or later.
- Install the runtime, set the environment variable such as `powershell_7_4_path`, and restart the worker.

The module pages I read do not say how the Microsoft Graph modules reach a hybrid worker, and they do not state whether modules imported to the Automation account are available there. Install `Microsoft.Graph.Authentication` and the modules your script needs on the worker machine, and test with a short runbook. Learn also says that when you author a runbook for a worker, you should edit and test it on the machine that hosts the worker.

## Step 4: Choose how the script signs in to Graph

Learn's hybrid runbook page describes three ways to authorize runbooks: the runbook supplies its own authentication, managed identities, or Hybrid Worker credentials. Details that matter:

- Managed identity replaces the Run As account, so you do not export certificates or renew them.
- On a worker, the Automation account's system-assigned identity is supported. The page says the Automation account's user-assigned identity cannot be used on a hybrid worker.
- The VM's own identity works only if the Automation account's managed identity is not enabled. Once it is, the VM identity no longer works.
- Run `Disable-AzContextAutosave -Scope Process` at the start of a runbook so it does not inherit a saved context.

For the Graph call itself, the Connect-MgGraph reference documents `Connect-MgGraph -Identity`, and `-ClientId` to select a user-assigned identity. That page does not mention Azure Automation, and the Learn pages I read do not state that this works from a hybrid worker. They also do not show how to grant Graph application permissions to a managed identity. Test the sign-in on the worker, and keep certificate-based app-only authentication as the fallback if it does not work in your environment.

Credential assets are the third option. Use `Get-AutomationPSCredential` and `Get-AutomationVariable` in the runbook, and store secrets as encrypted assets, not in the script.

## Step 5: Run and schedule on the group

To start a runbook on the group in the portal, set **Run on** to **Hybrid Worker** and pick the group. From PowerShell:

```powershell
Start-AzAutomationRunbook -AutomationAccountName "MyAutomationAccount" -Name "Test-Runbook" -RunOn "MyHybridGroup"
```

When a group is specified, one worker in it retrieves and runs the runbook. If the runbook does not specify the option, Azure Automation runs it in the cloud as usual.

Schedules are created under **Schedules** in Shared Resources, then linked from the runbook. The schedule page says the most frequent interval is one hour, and that Azure Automation supports daylight saving time. The page shows `Modify run settings (Default:Azure)` for runbooks with parameters, and an ARM example that sets `runOn` to a hybrid worker group on the job schedule. It does not otherwise describe the hybrid option in the schedule workflow, so confirm in your portal that the linked job targets the group, and check the first scheduled job's history.

## Job behavior to plan for

- Jobs run as the local System account on Windows. With custom credentials, grant the folder permissions Learn lists, or jobs may be suspended.
- If the host reboots, a running job restarts from the beginning. After more than three restarts, it is suspended. Make long runbooks safe to rerun.
- If no worker in the group has pinged in the last 30 minutes, jobs are suspended after three retries.
- Signed runbooks: once signature validation is enabled, unsigned runbooks fail on the worker. PowerShell 7.x does not support signed runbooks on Windows and Linux workers.

## Logs and monitoring

On Windows, the extension logs are under `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows<version>`, and high-level job events appear in the Microsoft-SMA/Operational event log. Use VM insights for processor, memory, network and disk utilization.

## Related

- [Azure Automation](https://www.m365.fm/entity/azure-automation/)
- [Hybrid Runbook Worker](https://www.m365.fm/entity/hybrid-runbook-worker/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)

## Sources

- [Microsoft Learn: Azure Automation Hybrid Runbook Worker overview](https://learn.microsoft.com/en-us/azure/automation/automation-hybrid-runbook-worker)
- [Microsoft Learn: Deploy an extension-based Hybrid Runbook Worker](https://learn.microsoft.com/en-us/azure/automation/extension-based-hybrid-runbook-worker-install)
- [Microsoft Learn: Run runbooks on a Hybrid Runbook Worker](https://learn.microsoft.com/en-us/azure/automation/automation-hrw-run-runbooks)
- [Microsoft Learn: Manage schedules in Azure Automation](https://learn.microsoft.com/en-us/azure/automation/shared-resources/schedules)
- [Microsoft Learn: Manage modules in Azure Automation](https://learn.microsoft.com/en-us/azure/automation/shared-resources/modules)
- [Microsoft Learn: Connect-MgGraph](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.authentication/connect-mggraph)
