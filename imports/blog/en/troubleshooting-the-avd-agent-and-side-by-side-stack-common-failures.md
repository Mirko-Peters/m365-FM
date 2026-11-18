---
title: "Troubleshooting the AVD agent and side-by-side stack: common failures"
summary: "Learn's agent troubleshooting page starts with the session host's Application log, and its stack sections use the qwinsta output. This article maps those signs to the narrow fix Learn documents and notes the cases where Learn goes straight to a full reset."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-agent, avd-session-host]
keypoints:
  - "Start in Event Viewer (Windows Logs > Application), filtering on WVD-Agent, WVD-Agent-Updater, RDAgentBootLoader and MsiInstaller. The event text shows which documented fix applies."
  - "Run qwinsta on the session host. If rdp-tcp and rdp-sxs do not show Listen, the side-by-side stack is the problem, and Learn's health check table treats a failed stack listener check as fatal."
  - "Installs fail for checkable reasons: Group Policy blocking msiexec.exe or cmd.exe, low disk space, .NET below 4.7.2, DisableRegistryTools = 1, or an OS SKU such as Windows Pro."
  - "INVALID_FORM and events 3703 and 3019 are network and policy problems. Our reading: test the broker with /api/health and run WVDAgentUrlTool.exe before touching registration."
  - "A registration key must be valid for at least one hour and at most 27 days. Learn's full reset with a new key is for the cases it names and for problems the earlier sections did not resolve."
faq:
  - q: "How do I check whether the side-by-side stack is healthy?"
    a: "Run qwinsta.exe on the session host. Learn says the stack is fine when the rdp-tcp and rdp-sxs entries are listed and their STATE column shows Listen. If either entry is missing or not listening, there is a stack issue. Learn says stack updates are installed together with agent updates, and that the listener does not work if the update was unsuccessful."
  - q: "A host stays in Upgrading or Unavailable. What does Learn suggest first?"
    a: "Reinstall only the side-by-side stack. Stop the RDAgentBootLoader service, uninstall the latest Remote Desktop Services SxS Network Stack, install the newest SxSStack MSI from C:\\Program Files\\Microsoft RDInfra, restart, and run qwinsta again. If the entries still do not show Listen, re-register the VM and reinstall the agent."
  - q: "Why does the agent install on a Windows Pro VM but never work?"
    a: "Learn says the side-by-side stack supports only Windows Enterprise or Windows Server SKUs. On other SKUs the stack installs but is not activated, so it does not appear in qwinsta. Create session hosts with a supported operating system."
---

For a broken Azure Virtual Desktop agent or side-by-side stack, Learn recommends starting in the session host's Application log; for stack problems it uses the `qwinsta` output. Match the event text or the output to the narrow fix first. Learn keeps the full uninstall and reinstall for the cases it names and for problems the earlier sections did not resolve.

This article covers the [Azure Virtual Desktop agent](https://www.m365.fm/entity/avd-agent/) and stack on one [session host](https://www.m365.fm/entity/avd-session-host/). For a running host marked Unavailable, including domain join, autoscale and URL checks, the article "Azure Virtual Desktop Session Host Shows Unavailable: A Step-by-Step Checklist" is the broader starting point.

## What the agent, the boot loader and the stack are

Learn's registration steps install four programs: the boot loader, the infrastructure agent, the Geneva monitoring agent and the SxS Network Stack. Stack updates arrive together with agent updates. Learn's health check table calls a failed stack listener check fatal and lists restarting the VM as the first step.

## Start with the Application log

In Event Viewer on the session host, go to **Windows Logs > Application**. Learn names four sources: `WVD-Agent`, `WVD-Agent-Updater`, `RDAgentBootLoader` and `MsiInstaller`. Most of the errors below are event ID 3277 with a keyword in the description.

| Event or sign | Documented cause |
|---|---|
| 3277 `INVALID_FORM` | Agent cannot reach the broker (firewall or DNS) |
| 3703 `RD Gateway Url: is not accessible` | Gateway URLs blocked |
| 3019 | Web socket transport URLs unreachable |
| 3277 `InstallMsiException` (also the text in Learn's Win32Exception section), `DownloadMsiException` | Policy, running installer or disk space |
| 3389 `MissingMethodException` | Agent update failed; .NET Framework below 4.7.2 is a possible cause |
| 3277 `InstallationHealthCheckFailedException` | Stack listener broken |
| 3277 `INVALID_REGISTRATION_TOKEN`, `EXPIRED_MACHINE_TOKEN` | Registration key not recognised |
| `NAME_ALREADY_REGISTERED` (no event ID documented) | Probably a duplicate host name |
| `RDAgentBootLoader` stopped, or no Remote Desktop Agent Loader service | Boot loader could not install the agent properly |
| `O_REVERSE_CONNECT_STACK_FAILURE` | Stack not installed on the host |
| 7000 or 7011 at boot | Boot loader starts too slowly |

## Check the stack with qwinsta

From a command prompt on the host, run `qwinsta.exe`. Note the version number next to `rdp-sxs` in the `SESSIONNAME` column. Learn's rule: if the `STATE` column for `rdp-tcp` and `rdp-sxs` is not `Listen`, or the entries are missing, you have a stack issue. For `InstallationHealthCheckFailedException`, Learn says the terminal server toggled the registry key for the stack listener; check the listener and, if it is not working, uninstall and reinstall the stack manually.

Learn's registry checks are written for Windows 10 2004; for 1809, 1903 or 1909 with a broken listener, Learn goes straight to the full reset.

1. In `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations`, open each folder that matches the `rdp-sxs` version from `qwinsta`. Make sure `fReverseConnectMode` and `fEnableWinStation` are `1`.
2. Restart the VM.
3. In `...\Terminal Server\ClusterSettings`, check that `SessionDirectoryListener` is `rdp-sxs<version number>`. If not, follow the full reset below.

A second Learn page lists different values (`WinStations\rds-sxs`, and `SessionDirectoryListener` set to `rdp-sxs`); the pages are not reconciled.

### Reinstall only the stack

Learn gives this procedure for hosts stuck in Upgrading or Unavailable:

1. Sign in as administrator and run `qwinsta.exe` to confirm the stack state.
2. Stop the boot loader with `Stop-Service RDAgentBootLoader`.
3. Uninstall the latest **Remote Desktop Services SxS Network Stack**, or the version named in the `ReverseConnectionListener` value under `...\Terminal Server\WinStations` (Programs and Features, or Settings > Apps on Windows 11).
4. Find the newest installer already on the host:

```powershell
$sxsMsi = (Get-ChildItem "$env:SystemDrive\Program Files\Microsoft RDInfra\" | ? Name -like SxSStack*.msi | Sort-Object CreationTime -Descending | Select-Object -First 1).FullName
$sxsMsi
```

5. Install it with `msiexec /i $sxsMsi`, restart the VM, and run `qwinsta.exe` again.

If `rdp-tcp` and `rdp-sxs` still do not show `Listen`, Learn says to re-register the VM and reinstall the agent. The Learn page "Troubleshoot Azure Virtual Desktop session host" lists known causes of a malfunctioning stack: not following the correct order of the enabling steps, an auto update to Windows 10 "Enhanced Versatile Disc (EVD)" (Learn's wording), and a missing Remote Desktop Session Host role. The same page gives the cause of `O_REVERSE_CONNECT_STACK_FAILURE` as a stack that is not installed on the VM. On Windows Server, the registration steps in "Add session hosts to a host pool" include installing that role before the agent; the command-line variant is `Install-WindowsFeature -Name RDS-RD-Server -Restart`.

## Failures that block the install

- **`InstallMsiException` (3277).** Another installer is running, or Group Policy blocks `msiexec.exe`. Run `rsop.msc` elevated and check **Computer Configuration > Administrative Templates > Windows Components > Windows Installer > Turn off Windows Installer**. If it is Enabled, involve your Active Directory team.
- **Learn's `Win32Exception` section (3277).** The event description it names is `InstallMsiException`, so search for that text. A policy blocks `cmd.exe`, which is needed to restart the service when the agent updates. In `rsop.msc`, check **User Configuration > Administrative Templates > System > Prevent access to the command prompt**.
- **`DownloadMsiException` (3277).** Not enough disk space for the agent. Free space or enlarge the disk.
- **`MissingMethodException` (3389).** The agent did not update successfully and reverted to an earlier version. Learn says this might happen because .NET Framework is below 4.7.2; install 4.7.2 or later.
- **`DisableRegistryTools` set to 1.** Learn lists this last, for when the full reset did not help. The value, under `...\Policies\System\DisableRegistryTools` in HKU `\DEFAULT`, HKU `\S-1-5-18` and HKCU, stops the agent from installing the stack, which causes an installMSIException error and leaves hosts Unavailable. The fix: remove the value in all three places, uninstall the stack and delete its registry keys, restart, and let the agent reinstall the stack.
- **Unsupported SKU.** The stack supports only Windows Enterprise or Windows Server. On Windows Pro it installs but is not activated and is absent from `qwinsta`.

## Agent cannot reach the service

**`INVALID_FORM`.** In the registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\RDInfraAgent`, read `BrokerResourceIdURI` and `BrokerResourceIdURIGlobal`. Open each in a browser with `/api/health` appended. A healthy result says **RD Broker is Healthy**. If the pages do not load, unblock the required endpoints. If they load but the agent still fails, check Group Policy for TLS cipher settings: Learn says the service uses the same TLS 1.2 ciphers as Azure Front Door.

**Event 3703 and event 3019.** 3703 reads `RD Gateway Url: is not accessible`, and 3019 means the web socket transport URLs cannot be reached. For 3703, allow the required URL list through firewall and proxy. For 3019, Learn also names DNS settings. For a support case on 3019, Learn asks for network trace logs.

**Test the endpoints from the host.** Run `WVDAgentUrlTool.exe` from the installed agent folder; it needs .NET 4.6.2, RDAgent 1.0.2944.400 or higher, and `WVDAgentUrlTool.config` next to it.

The output lists reachable and unreachable endpoints. The tool does not check wildcard entries, only specific entries beneath them.

**`ENDPOINT_NOT_FOUND` (3277).** The broker found no endpoint. Learn lists four causes: no hosts in the pool, hosts not active, all hosts over the [maximum session limit](https://www.m365.fm/entity/avd-maximum-session-limit/), or no agent service running. For "Connection not found: RDAgent does not have an active connection to the broker", a host at its connection limit, Learn suggests lowering the session limit or adding resources.

## Registration and token failures

- **`INVALID_REGISTRATION_TOKEN` or `EXPIRED_MACHINE_TOKEN`.** Generate a new key (host pool overview > **Registration key** > **Generate new key**). On the host, set `IsRegistered` to `0` and `RegistrationToken` to the new key under `HKLM:\SOFTWARE\Microsoft\RDInfraAgent`, run `Restart-Service RDAgentBootLoader`, then confirm `IsRegistered` is `1` and the token is empty.
- **Key lifetime.** Learn says the expiry can be no less than an hour and no longer than 27 days. Pre-provisioned hosts that stay powered off for more than 90 days also have their machine token expire; Learn advises powering affected VMs on for at least 20 minutes every 90 days.
- **`NAME_ALREADY_REGISTERED`.** Learn says the name has already been registered and is probably a duplicate. Remove the host from the pool, create a VM with a unique name, and wait 5 to 10 minutes for **Available**.
- **Agent will not update itself.** If `Get-AzWvdSessionHost` shows Unavailable because the agent cannot update itself, a Learn page describes a manual update: download a new agent version on the host, stop `RDAgentBootLoader`, run the installer, remove the `INVALID_TOKEN` entry when it asks for a token (no new token is needed), finish the wizard and start the service again.

## Loader stopped or Needs Assistance

**Loader stopped.** Learn says a stopped `RDAgentBootLoader`, or no status for **Remote Desktop Agent Loader**, means the boot loader could not install the agent properly. In Services, start **Remote Desktop Agent Loader** (greyed out means no administrator permissions), wait 10 seconds, then refresh. If it stops again, Learn suspects a registration failure.

**Needs Assistance.** Learn names three health checks. `UrlsAccessibleCheck`: a firewall blocks a required URL, or the hosts file lists it (find the file via `DataBasePath` under `HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`). `MetaDataServiceCheck`: unblock 169.254.169.254 and bypass web proxies for it; for a web proxy, Learn uses `netsh winhttp set proxy proxy-server="http=<customerwebproxyhere>" bypass-list="169.254.169.254"`. `MonitoringAgentCheck`: confirm the Geneva Agent is installed, read `GenevaInstall.txt` in `C:\Program Files\Microsoft RDInfra`, and check that the scheduled task `GenevaTask_<version>` runs.

## Slow start at boot

If the loader is stopped after a restart, the host shows Needs Assistance or Unavailable, or Windows logs event 7000 or 7011, Learn describes a startup that is too slow. Set **Remote Desktop Agent Loader** to **Automatic (Delayed Start)** and raise the timeout with `reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v ServicesPipeTimeout /t REG_DWORD /d 60000 /f`. Learn says to start at 60,000 ms; a reboot is required. Also check disk IOPS and antivirus scans, logon scripts or large GPOs that starve the agent. Release notes for 1.0.15294.200 (September 2026) add a scheduled task that helps ensure the boot loader is running after startup. The "Latest available versions" table showed production 1.0.15732.100 and validation 1.0.15991.300 as of 17 November 2026. [Validation host pools](https://www.m365.fm/entity/avd-validation-environment/) receive agent updates first.

## The full reset

Learn's catch-all procedure applies when a host is stuck in Upgrading or Unavailable, the loader service is missing, the host never appears in the pool, `EXPIRED_REGISTRATION_TOKEN` appears, or earlier sections did not help. The Unavailable checklist article covers it in detail; in short:

1. Uninstall the four programs named above (every instance), then restart. Over RDP, choose **Do not close applications** when the stack uninstall asks.
2. Remove the host from the pool: **Host pools**, your pool, **Session Hosts**, select the host, **Remove**.
3. Generate a new registration key.
4. Run the current agent and boot loader installers, paste the key, and restart. The host should then show as **Available**.

## When to open a case

If the host still fails, Learn says to create a support case with detailed information about the problem and the actions you tried. Our reading of useful details: host name, event IDs with UTC times, `qwinsta` output, agent version and URL tool result.

## Sources

- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Agent issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop session host](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-vm-configuration)
- [Microsoft Learn: Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks)
- [Microsoft Learn: Check access to required FQDNs and endpoints](https://learn.microsoft.com/en-us/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint)
- [Microsoft Learn: What's new in the Azure Virtual Desktop Agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
