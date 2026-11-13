---
title: "Windows Server Will Not Onboard to Defender for Endpoint: A Checklist"
summary: "A server shows Error Id 15, stays at Can be onboarded, or the Azure Arc extension fails? Work through OS route, updates, the SENSE service, antivirus conflicts and connectivity in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [microsoft-defender-for-endpoint, windows-server, azure-arc]
keypoints:
  - "First decide the route: Server 2019 and later have the sensor built in, while Server 2016 and 2012 R2 need the unified solution. Azure and Azure Arc servers can be onboarded through Defender for Cloud."
  - "Learn lists prerequisites for 2016 and 2012 R2: SSU from September 14, 2021 or later, LCU from September 20, 2018 or later, and Defender Antivirus installed and up to date."
  - "Use sc.exe query sense, the WDATPOnboarding events and the SENSE Operational log to find out where onboarding stops."
  - "Error 577 or 1058 when starting the service points to a Defender Antivirus conflict. For devices without the August 2020 antivirus platform update, Learn says to clear DisableAntiSpyware and DisableAntiVirus and run onboarding again."
  - "None of the four community threads reported a fix confirmed by the asker. Use them as symptoms, and trust the Learn pages for the steps."
faq:
  - q: "Which route do I use for Windows Server 2016?"
    a: "Microsoft Learn describes the modern unified solution for Windows Server 2016 and 2012 R2. Server 2016 already has Microsoft Defender Antivirus built in and installs the EDR sensor. Learn also says that Defender Antivirus must be installed as a feature and fully updated before installation. The older Microsoft Monitoring Agent route (used before April 2022) still appears in the Learn pages for servers that were never upgraded to the unified solution."
  - q: "What does the status Can be onboarded mean?"
    a: "Learn's device inventory page uses the filter Onboarding status > Can be onboarded to find discovered devices that are ready for agent deployment. A server that stays in this state is visible to the portal but the sensor is not reporting. Learn does not give a longer definition, so check the sensor on the server."
  - q: "Is KB5005292 required?"
    a: "Learn says to apply or approve Windows Update KB5005292 on Server 2016 and 2012 R2 to receive product improvements and fixes for the Defender for Endpoint component. A 2025 community answer called it a requirement for the EDR sensor. Learn's wording is about improvements and fixes, so use the Learn wording."
  - q: "The Azure Arc extension fails but Arc itself is connected. What now?"
    a: "In a 2026 thread, moderators pointed to missing updates or damaged system components and suggested updating the server and the Arc agent, repairing the image with DISM and sfc, and redeploying the extension. That thread has no confirmed result. Learn's server page says to enable Defender for Servers on the subscription, check the integration settings and prerequisites, wait for deployment and run the checks."
---

Onboarding a Windows server to Defender for Endpoint can fail in ways that look alike from the portal. The server does not show up, or it is listed as **Can be onboarded** and never changes. This article turns four Microsoft Q&A threads into one ordered checklist. The solution steps come from current Microsoft Learn pages. It is not an official Microsoft procedure.

The threads, with what they actually contain:

- **May 2025:** a Windows Server 2016 onboarding failed with `[Error Id: 15, Error Level: 1] Unable to start Microsoft Defender for Endpoint Service`. A volunteer moderator suggested checking the `sense` service, using the unified agent and installing KB5005292. The asker never replied.
- **February 2026:** a Server 2016 machine was connected to Azure Arc, but the Defender for Endpoint extension from Defender for Cloud failed. Moderators suggested updates and repair steps. The discussion moved to private messages, so there is no public result.
- **July 2026:** an on-premises domain controller on Server 2022 stayed at **Can be onboarded** after several offboard and onboard cycles and a temporary allow-all outbound rule. The only answer was AI generated. No result was reported.
- **2023 to 2024:** the extension failed with `vNext/Unified agent installation failed` on many Server 2016 machines. One answer blamed a Group Policy that disabled Defender Antivirus. The asker said the value was not set in their case.

None has a confirmed fix, so they only serve as symptom descriptions.

## Step 1: Decide which route the server should use

Learn names these routes:

- A supported Azure VM or Azure Arc-enabled server in a subscription with Defender for Servers enabled is onboarded automatically by Defender for Cloud.
- A server managed with an endpoint deployment tool uses manual deployment: local script, Configuration Manager, Group Policy, VDI scripts or the modern unified solution for Server 2016 and 2012 R2.

Learn also says Windows Server 2019 and later have Defender Antivirus and the EDR sensor built in. Server 2012 R2 installs both. Server 2016 has Defender Antivirus built in and installs the EDR sensor.

Pick one route per server. If a server is already Arc-enabled and managed by Defender for Cloud, a manual package on top of it only adds a second variable.

## Step 2: Check the prerequisites for Server 2016 and 2012 R2

Learn lists these for the unified solution:

- The Servicing Stack Update from September 14, 2021 or later is installed.
- The Latest Cumulative Update from September 20, 2018 or later is installed.
- Microsoft Defender Antivirus is enabled and up to date, with the latest platform version (Learn links to the Microsoft Update Catalog, searched for KB4052623, for a manual download).
- On Server 2016, Defender Antivirus is installed as a feature and fully updated before installation.

Learn also says to apply or approve KB5005292, and that the installation package is updated every month, so download a fresh one before deployment. After installation you do not run the installer again for updates. If you do, it asks you to offboard first.

An independent advisor in the 2026 thread named a different baseline (a Server 2016 version with a specific KB) and said the Microsoft Monitoring Agent must be present. I could not find that baseline on the Learn page, and Learn describes MMA as the solution used before April 2022, which the unified solution replaces. Do not use that advice. Learn's own dates above apply.

## Step 3: Check the services

On the server, in an elevated Command Prompt:

```
sc.exe query Windefend
sc.exe query sense
```

Learn says to use the first command on servers that should run Defender Antivirus in active mode. If it returns "The specified service doesn't exist as an installed service", install Defender Antivirus. The second command confirms that Defender for Endpoint is running. If the `sense` service does not exist at all, the sensor is not installed. The 2025 answer also said to check that you used the package for your OS version; that comes from the thread.

## Step 4: Read the onboarding and sensor logs

If you used the local script, Learn says to check **Event Viewer** > **Windows Logs** > **Application** and filter for the source **WDATPOnboarding**. Some script event IDs from the Learn table:

| ID | Meaning | What to do (Learn) |
|---|---|---|
| 10 | Onboarding data could not be written to the registry | Check permissions on `HKLM\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection`, run as administrator |
| 15 | Failed to start the SENSE service | Run `sc query sense`, look for pending states, run again as administrator |
| 30 | The script timed out waiting for the service | Review the SENSE events |
| 65 | Not enough privileges | Run with administrator rights |

The error text in the 2025 thread looks like the script's event 15, which Learn describes as a failure to start the SENSE service. The thread does not show the log source, so this is my reading, not something the thread confirms.

Then open **Applications and Services Logs** > **Microsoft** > **Windows** > **SENSE** > **Operational**, and filter for Critical, Warning and Error. Learn says events 5, 7 and 15 mean "ensure internet access", event 6 means run the onboarding script again, and event 9 during onboarding means reboot and run onboarding again.

## Step 5: Look for an antivirus conflict

Learn says that if a non-Microsoft antivirus is present, Defender Antivirus should run in passive mode during installation and onboarding. For the case where the service does not start with system error 577 or 1058, Learn says to make sure the `DisableAntiSpyware` and `DisableAntiVirus` policies are cleared under `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender`, then run onboarding again. Learn says this applies only to devices without the August 2020 Defender Antivirus update (4.18.2007.8), and that `DisableAntiSpyware` is ignored on Windows 10 since then. It also says not to change the startup type of `wdboot`, `wdfilter`, `wdnisdrv`, `wdnissvc` or `windefend`, because that is unsupported and may require reimaging.

A similar idea appears in the 2023 to 2024 thread, where one community answerer reported that a Group Policy setting `DisableAntiSpyware` = 1 blocked the extension on their own system, and setting it to 0 let it install. The asker said the value was not set in their case, and Learn does not confirm this cause for the extension. If you suspect it, check Group Policy results on the server, not just the local registry.

## Step 6: Test connectivity

The sensor on Windows uses WinHTTP, not the browser proxy settings. Run the Client Analyzer as described in Learn's connectivity page: extract `MDEClientAnalyzer.zip`, run `MDEClientAnalyzer.cmd` from an elevated prompt, and read `MDEClientAnalyzerResult.txt`. If one connection method returns 200 for a URL, the client can reach it. For a server that is not onboarded yet, Learn describes `mdeclientanalyzer.cmd -o <path to onboarding cmd file>`.

Learn says streamlined connectivity supports Windows Server 2019 and later, and Windows Server 2016 and 2012 R2 running the unified solution. It needs `*.endpoint.security.microsoft.com`, which must be excluded from TLS inspection. Servers still on the Microsoft Monitoring Agent stay on the older method. For those, Learn describes running `TestCloudConnection.exe` from `C:\Program Files\Microsoft Monitoring Agent\Agent` to get the workspace URLs.

In the July 2026 thread, a temporary allow-all outbound firewall rule did not help. The thread gives no cause. A TLS-inspecting proxy, name resolution or the sensor itself are still open.

## Step 7: If you use Azure Arc and Defender for Cloud

Learn's server page says: enable Defender for Servers on the subscription that holds the VM or Arc resource, review the Defender for Endpoint integration settings and prerequisites, let the deployment finish, and run the onboarding checks.

If the extension fails, the 2026 thread reported an error that said an assembly "could not be found" from a `Enable-WindowsOptionalFeature` call. Moderators in that thread attributed it to missing updates or damaged system components. They suggested installing the latest servicing stack and cumulative updates, running `DISM /Online /Cleanup-Image /RestoreHealth` and `sfc /scannow`, updating the Arc agent, and removing and redeploying the extension. They also asked for logs from `C:\ProgramData\AzureConnectedMachineAgent\Log`. The 2023 thread names the extension log folder `C:\Packages\Plugins\Microsoft.Azure.AzureDefenderForServers.MDE.Windows\<version>`. All of this is reported in the threads, not confirmed in the Learn pages I read, and the 2026 asker never confirmed a result.

## Step 8: Verify

Learn's checks after onboarding: find the server in the Defender device inventory and check its identity, sensor health and recent activity, then run an approved detection test and confirm that the alert arrives. If you offboarded the server several times while testing, remember that Learn's offboarding page says the device profile (without data) stays in the device inventory for up to 180 days, so check the last seen time, not just the name.

## Limits

- Learn's pages differ in focus. The troubleshooting page still has a Server 2016 section built around the Microsoft Monitoring Agent, while the server page describes the unified solution. Use the MMA checks only if the server really uses MMA.
- Learn says nothing special about domain controllers. The July 2026 thread gives no domain-controller-specific cause.
- If all checks pass and the server stays at **Can be onboarded**, collect the Client Analyzer output, the SENSE log and the onboarding script log, and open a support case.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Windows Server](https://www.m365.fm/entity/windows-server/)
- [Azure Arc](https://www.m365.fm/entity/azure-arc/)

## Sources

- [Microsoft Learn: Onboard servers through Defender for Endpoint's onboarding experience](https://learn.microsoft.com/en-us/defender-endpoint/onboard-server)
- [Microsoft Learn: Troubleshoot Defender for Endpoint onboarding issues](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-onboarding)
- [Microsoft Learn: Verify client connectivity to Defender for Endpoint service URLs](https://learn.microsoft.com/en-us/defender-endpoint/verify-connectivity)
- [Microsoft Learn: Configure network connectivity to Defender for Endpoint](https://learn.microsoft.com/en-us/defender-endpoint/configure-environment)
- [Microsoft Learn: Explore devices in the device inventory](https://learn.microsoft.com/en-us/defender-endpoint/machines-view-overview)
- [Microsoft Learn: Onboard Windows devices with a local script](https://learn.microsoft.com/en-us/defender-endpoint/configure-endpoints-script)
- [Microsoft Learn: Offboard devices from Defender for Endpoint](https://learn.microsoft.com/en-us/defender-endpoint/offboard-machines)
- [Microsoft Q&A: Server 2016 onboarding error Id 15, in Spanish (May 2025)](https://learn.microsoft.com/en-us/answers/questions/2277419/al-intentar-hacer-el-onboarding-de-un-servidor-201)
- [Microsoft Q&A: Microsoft Windows Server 2016, MDE extension (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5770733/microsoft-windows-server-2016)
- [Microsoft Q&A: Issue with Windows Server 2022 Defender Onboarding (July 2026)](https://learn.microsoft.com/en-us/answers/questions/5945230/issue-with-windows-server-2022-defender-onboarding)
- [Microsoft Q&A: MDE.Windows extension installation fails with vNext/Unified agent installation failed (2023 to 2024)](https://learn.microsoft.com/en-us/answers/questions/1414677/mde-windows-extension-installation-fails-with-vnex)
