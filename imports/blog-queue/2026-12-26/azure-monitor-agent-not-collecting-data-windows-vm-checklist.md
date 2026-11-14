---
title: "Azure Monitor Agent Not Collecting Data From a Windows VM: Troubleshooting Checklist"
summary: "Work through the Azure Monitor Agent checklist for Windows VMs: extension status, heartbeat, MonAgentCore, data collection rule association and region, managed identity, IMDS, config files and where the logs are."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [azure-monitor-agent, azure-monitor]
keypoints:
  - "AzureMonitorWindowsAgent should show Provisioning succeeded under Extensions + applications. That status only means the package was downloaded and registered, not that the agent is running."
  - "Query the Heartbeat table for Category Azure Monitor Agent. If it is empty, check that MonAgentCore.exe is running and wait 5 minutes."
  - "The data collection rule must be associated with the VM and, for a Log Analytics workspace, in the same physical region as the workspace."
  - "If mcsconfig.latest.xml is missing, the VM may lack a DCR association or a managed identity, or the agent cannot reach the Instance Metadata Service."
  - "Event logs must be on a local disk. Network shares and UNC paths are not supported."
faq:
  - q: "Does Provisioning succeeded mean the agent works?"
    a: "No. According to Microsoft Learn, it only means the package was downloaded and registered. It does not confirm the agent is running."
  - q: "How do I check that the agent is running?"
    a: "Run a Heartbeat query for Category Azure Monitor Agent and your computer name in Log Analytics. If there is no heartbeat, check Task Manager for MonAgentCore.exe and wait 5 minutes."
  - q: "Where are the agent logs?"
    a: "Extension logs are in C:\\WindowsAzure\\Logs\\Plugins\\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent. Core agent logs and configuration are under C:\\WindowsAzure\\Resources\\AMADataStore.<virtual-machine-name>."
  - q: "What if mcsconfig.latest.xml is missing?"
    a: "Learn lists causes: the VM is not associated with a data collection rule, managed identity is not enabled, IMDS is not running or accessible, or the agent cannot access IMDS. Check MAEventTable.tsf for IMDS errors."
  - q: "Can I collect event logs from a network share?"
    a: "No. Learn says event logs must be on a local disk, and network shares and UNC paths are not supported."
---

When the Azure Monitor Agent (AMA) does not send data from a Windows VM, work through the same sequence Microsoft Learn gives: extension, heartbeat, data collection rule, then configuration download. This article follows that checklist and its paths.

## 1. Review prerequisites

Start with the prerequisites in the agent management article, which the page links to.

## 2. Verify the extension

In the Azure portal open the VM and go to **Settings** > **Extensions + applications**. `AzureMonitorWindowsAgent` should show **Provisioning succeeded**.

- If it does not appear, check the machine can reach Azure and list extension versions with `az vm extension image list-versions --location <machine-region> --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor`.
- Wait 10 to 15 minutes, because the extension may be transitioning. If it still does not appear, uninstall and reinstall it.
- Extension logs: `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent`.
- Provisioning succeeded only means the package was downloaded and registered. It does not confirm the agent is running.

## 3. Verify the agent is running

Run this in Log Analytics. Skip it if Custom Metrics is the only destination of the data collection rule (DCR):

```kusto
Heartbeat | where Category == "Azure Monitor Agent" and Computer == "<computer-name>" | take 10
```

If there is no heartbeat, open Task Manager and look for `MonAgentCore.exe`. If it is running, wait 5 minutes for a heartbeat. If there is still none, check the core agent logs in `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\Configuration`.

## 4. Verify the DCR exists and is associated

- If you use a Log Analytics workspace, confirm the DCR is in the same physical region as the workspace.
- Check for `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\mcsconfig.latest.xml`. If it is missing, the causes can be:
  - The VM is not associated with a DCR.
  - Managed identity is not enabled on the VM.
  - The Azure Instance Metadata Service (IMDS) is not running or accessible from the VM.
  - AMA cannot access IMDS. Look for IMDS errors in `...\Tables\MAEventTable.tsf`.
- In the portal, open the DCR, go to **Configuration** > **Resources** and confirm the VM is listed. If not, select **Add** and choose the VM. Repeat for all DCRs.

## 5. Verify the agent downloaded the DCR

Check for the latest DCR in `...\mcs\configchunks`. If the directory is empty or missing, verify the DCR association, confirm the VM can reach the Azure Monitor configuration service endpoints and check `MAEventTable.tsf` for errors.

## Other checks on the page

- **Performance counters:** confirm `performanceCounters` is in the DCR JSON and that `mcsconfig.lkg.xml` contains `CounterSet` nodes.
- **Custom Metrics destination:** confirm `azureMonitorMetrics` is in the DCR destinations. The `MetricsExtension.Native.exe` command line should contain `-TokenSource MSI`, and specific token and configuration files should exist under the `mcs` folder. The page also describes using `table2csv.exe` on `MaMetricsExtensionEtw.tsf` and looking for Level 2 errors.
- **Windows event logs:** confirm `windowsEventLogs` is in the DCR JSON and that `mcsconfig.lkg.xml` contains `Subscription` nodes. Event logs must be on a local disk, and network shares and UNC paths are not supported.

## Where the key files live

All agent data for a VM sits under `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>`. The page points to these locations: `Configuration` for core agent logs, `mcs` for the downloaded configuration such as `mcsconfig.latest.xml` and `mcsconfig.lkg.xml`, `mcs\configchunks` for the latest data collection rule files, and `Tables\MAEventTable.tsf` for agent events, including IMDS errors. Extension logs are separate, under `C:\WindowsAzure\Logs\Plugins`. Knowing which folder answers which question speeds up the checklist, which is a suggestion based on the page layout and not a Microsoft statement.

For the Custom Metrics destination, the page also names `AuthToken-MSI.json` and a custom metric configuration file in the `mcs` folder. It says the metrics extension command line should contain `-TokenSource MSI`. If those are absent, the managed identity step above is the first thing to recheck.

## Order summary

1. Extension status, then logs.
2. Heartbeat, then process.
3. DCR association and region.
4. Managed identity and IMDS if the configuration file is missing.
5. Configuration chunks and endpoint reachability.

## Not covered

The page gives no Windows service names, no list of endpoints, ports or proxy settings, no meaning of specific IMDS or configuration service errors and no remediation beyond links. It does not cover Linux VMs or Arc-enabled servers.

## Related

- [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Troubleshoot the Azure Monitor agent on Windows virtual machines and scale sets (Microsoft Learn)](https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-troubleshoot-windows-vm)
