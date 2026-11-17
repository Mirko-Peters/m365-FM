---
title: "Troubleshooting the AVD agent and side-by-side stack: common failures"
summary: "Most Azure Virtual Desktop agent and side-by-side stack failures leave a recognisable Application-log event or a missing Listen state in qwinsta. This article maps those signs to the narrow fix that Microsoft Learn documents, so a full reinstall becomes the last step instead of the first."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-agent, avd-session-host]
keypoints:
  - "Start in Event Viewer under Windows Logs, Application, and filter on the sources WVD-Agent, WVD-Agent-Updater, RDAgentBootLoader and MsiInstaller. The event text (for example INVALID_FORM or InstallMsiException) tells you which of the documented fixes applies."
  - "Run qwinsta on the session host. If rdp-tcp and rdp-sxs do not show Listen, the side-by-side stack is the problem, and Learn's health check table treats a failed stack listener check as fatal."
  - "Installs fail for narrow, checkable reasons: a Group Policy that blocks msiexec.exe or cmd.exe, too little disk space, .NET Framework below 4.7.2, a DisableRegistryTools value of 1, or an operating system SKU such as Windows Pro that cannot run the stack."
  - "INVALID_FORM, event 3703 and event 3019 are network and policy problems between the agent and the service. Test the broker with /api/health and run WVDAgentUrlTool.exe before you touch the registration."
  - "A registration key must be valid for at least one hour and at most 27 days. Reinstall everything with a new key only when the targeted fixes do not apply."
faq:
  - q: "How do I check whether the side-by-side stack is healthy?"
    a: "Run qwinsta.exe on the session host. Learn says the stack is fine when the rdp-tcp and rdp-sxs entries are listed and their STATE column shows Listen. If either entry is missing or not listening, there is a stack issue. Stack updates are installed together with agent updates, so a failed update is a common reason."
  - q: "A host stays in Upgrading or Unavailable. What does Learn suggest first?"
    a: "Reinstall only the side-by-side stack. Stop the RDAgentBootLoader service, uninstall the latest Remote Desktop Services SxS Network Stack, install the newest SxSStack MSI from C:\\Program Files\\Microsoft RDInfra, restart, and run qwinsta again. If the entries still do not show Listen, re-register the VM and reinstall the agent."
  - q: "Why does the agent install on a Windows Pro VM but never work?"
    a: "Learn says the side-by-side stack supports only Windows Enterprise or Windows Server SKUs. On other SKUs the stack installs but is not activated, so it does not appear in qwinsta. Create session hosts with a supported operating system."
---

A broken Azure Virtual Desktop agent or side-by-side stack almost always leaves two traces: an event in the session host's Application log and a stack that is not listening. Match the event text or the `qwinsta` output to the narrow fix first. The full uninstall and reinstall is the last step, because it removes the host from the pool and starts a new registration.

This article covers the [Azure Virtual Desktop agent](/entity/avd-agent/) and the stack on a single [session host](/entity/avd-session-host/). For a host that is running but marked Unavailable, including domain join, autoscale and URL checks, the article "Azure Virtual Desktop Session Host Shows Unavailable: A Step-by-Step Checklist" is the broader starting point. The main Learn troubleshooting page carries 2025 metadata and names older Windows 10 versions, so check each step against the current text.

## What the agent, the boot loader and the stack are

Learn's registration steps install four programs: Remote Desktop Agent Boot Loader, Remote Desktop Services Infrastructure Agent, Remote Desktop Services Infrastructure Geneva Agent and Remote Desktop Services SxS Network Stack. Learn says that reinstalling the agent and boot loader also installs the side-by-side stack and the Geneva monitoring agent, and that stack updates arrive together with agent updates. Learn's health check table calls a failed stack listener check fatal: users cannot connect, and the documented first step is to restart the VM.

## Start with the Application log

Open Event Viewer on the session host and go to **Windows Logs > Application**. Learn names four sources to look at: `WVD-Agent`, `WVD-Agent-Updater`, `RDAgentBootLoader` and `MsiInstaller`. Most of the errors below are event ID 3277 with a keyword in the description.

| Event or sign | Documented cause | Jump to |
|---|---|---|
| 3277 `INVALID_FORM` | Agent cannot reach the broker (firewall or DNS) | Agent cannot reach the service |
| 3703 `RD Gateway Url: is not accessible` | Gateway URLs blocked | Agent cannot reach the service |
| 3019 | Web socket transport URLs unreachable | Agent cannot reach the service |
| 3277 `InstallMsiException`, `Win32Exception`, `DownloadMsiException` | Policy, running installer or disk space | Failures that block the install |
| 3389 `MissingMethodException` | .NET Framework below 4.7.2 | Failures that block the install |
| 3277 `InstallationHealthCheckFailedException` | Stack listener broken | Check the stack with qwinsta |
| 3277 `INVALID_REGISTRATION_TOKEN`, `EXPIRED_MACHINE_TOKEN`, `NAME_ALREADY_REGISTERED` | Registration | Registration and token failures |
| 7000 or 7011 at boot | Boot loader starts too slowly | Slow start at boot |

## Check the stack with qwinsta

From a command prompt on the host, run `qwinsta.exe`. Note the version number next to `rdp-sxs` in the `SESSIONNAME` column. Learn's rule: if the `STATE` column for `rdp-tcp` and `rdp-sxs` is not `Listen`, or the entries are missing, you have a stack issue. For `InstallationHealthCheckFailedException`, Learn's explanation is that the terminal server toggled the registry key for the stack listener, and its fix is to check the listener and, if it is not working, uninstall and reinstall the stack manually.

Learn's section for a Windows 10 2004 host adds registry checks. Use them only after the stack is installed but not listening:

1. In `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations`, open the folder that matches the `rdp-sxs` version from `qwinsta`.
2. Make sure `fReverseConnectMode` is `1` and `fEnableWinStation` is `1`. Repeat for every matching folder.
3. Restart the VM.
4. In `...\Terminal Server\ClusterSettings`, check that `SessionDirectoryListener` is `rdp-sxs<version number>`, with the version from `qwinsta`.
5. If it is not, follow the full reset below.

For many VMs, Learn suggests importing the key from a working machine or setting it with a Group Policy object.

### Reinstall only the stack

Learn gives this procedure for hosts stuck in Upgrading or Unavailable:

1. Sign in as administrator and run `qwinsta.exe` to confirm the stack state.
2. Stop the boot loader: `Stop-Service RDAgentBootLoader`.
3. Uninstall the latest **Remote Desktop Services SxS Network Stack** (Programs and Features, or Settings > Apps on Windows 11). Learn also accepts the version named under `ReverseConnectionListener` in the WinStations key.
4. Find the newest installer already on the host:

```powershell
$sxsMsi = (Get-ChildItem "$env:SystemDrive\Program Files\Microsoft RDInfra\" | ? Name -like SxSStack*.msi | Sort-Object CreationTime -Descending | Select-Object -First 1).FullName
$sxsMsi
```

5. Install it with `msiexec /i $sxsMsi`, restart the VM, and run `qwinsta.exe` again.

If `rdp-tcp` and `rdp-sxs` still do not show `Listen`, Learn says to re-register the VM and reinstall the agent. A separate Learn page adds that known causes of a malfunctioning stack include not following the correct order of the enabling steps, an automatic update of the operating system, and a missing Remote Desktop Session Host role. On Windows Server, the registration steps therefore start with `Install-WindowsFeature -Name RDS-RD-Server -Restart`.

## Failures that block the install

When the stack or agent will not install, the cause is often outside the agent:

- **`InstallMsiException` (3277).** Another installer is running, or Group Policy blocks `msiexec.exe`. Run `rsop.msc` elevated and check **Computer Configuration > Administrative Templates > Windows Components > Windows Installer > Turn off Windows Installer**. If it is Enabled, work with your Active Directory team.
- **`Win32Exception` (3277).** A policy blocks `cmd.exe`, which the update uses to restart the service. In `rsop.msc`, check **User Configuration > Administrative Templates > System > Prevent access to the command prompt**. Learn's text says the event description reads InstallMsiException, so read the full event text.
- **`DownloadMsiException` (3277).** Not enough disk space for the agent. Free space or enlarge the disk.
- **`MissingMethodException` (3389).** The agent updated and reverted to an earlier version because .NET Framework is below 4.7.2. Install 4.7.2 or later.
- **`DisableRegistryTools` set to 1.** Check `\DEFAULT\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\DisableRegistryTools` and the `S-1-5-18` path under HKU, and the same path under HKCU. Learn says the value stops the agent from installing the stack and leaves hosts Unavailable. The fix: remove the value in all three places, uninstall the affected stack and delete its registry keys, restart, and let the agent reinstall the stack.
- **Unsupported SKU.** The stack supports only Windows Enterprise or Windows Server. On Windows Pro it installs but is not activated and is absent from `qwinsta`.

## Agent cannot reach the service

These events mean the agent is installed but cannot talk to the service.

**`INVALID_FORM`.** In the registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\RDInfraAgent`, read `BrokerResourceIdURI` and `BrokerResourceIdURIGlobal`. Open each in a browser with `/api/health` appended. Learn's examples are `https://rdbroker-g-us-r0.wvd.microsoft.com/api/health` and `https://rdbroker.wvd.microsoft.com/api/health`. A healthy result says **RD Broker is Healthy**. If the pages do not load, unblock the required endpoints. If they load but the agent still fails, check Group Policy for TLS cipher settings: Learn says the service uses the same TLS 1.2 ciphers as Azure Front Door.

**Event 3703 and event 3019.** 3703 reads `RD Gateway Url: is not accessible`, and 3019 means the web socket transport URLs cannot be reached. For both, allow the required URL list through firewall, proxy and DNS. For a support case on 3019, Learn asks for network trace logs.

**Test the endpoints from the host.** The Agent URL Tool ships with the agent. It needs .NET 4.6.2 and RDAgent 1.0.2944.400 or higher, and `WVDAgentUrlTool.exe` must sit next to `WVDAgentUrlTool.config`. Learn's commands:

```powershell
$RDAgent = Get-WmiObject -Class Win32_Product | ? Name -eq "Remote Desktop Services Infrastructure Agent" | Sort-Object Version -Descending
$path = ($RDAgent[0]).InstallSource + "RDAgent_" + ($RDAgent[0]).Version
cd $path
.\WVDAgentUrlTool.exe
```

The output lists reachable and unreachable endpoints. The tool does not check the wildcard entries, only specific entries beneath them, so allow the wildcards before you run it.

**`ENDPOINT_NOT_FOUND` (3277).** The broker found no endpoint. Learn lists four causes: no hosts in the pool, hosts not active, all hosts over the [maximum session limit](/entity/avd-maximum-session-limit/), or no agent service running. Check that the VM is on and still in the pool, under its session limit, with a running agent service and stack listener, a reachable broker and an unexpired registration token. The related message "Connection not found: RDAgent does not have an active connection to the broker" points to a host at its connection limit; Learn suggests lowering the session limit or adding resources.

## Registration and token failures

- **`INVALID_REGISTRATION_TOKEN` or `EXPIRED_MACHINE_TOKEN`.** Generate a new key (host pool overview > **Registration key** > **Generate new key**). On the host, set `IsRegistered` to `0` and `RegistrationToken` to the new key under `HKLM:\SOFTWARE\Microsoft\RDInfraAgent`, run `Restart-Service RDAgentBootLoader`, then confirm `IsRegistered` is `1` and `RegistrationToken` is empty.
- **Key lifetime.** Learn says the expiry must be between one hour and 27 days. Hosts that stay powered off for more than 90 days also lose their machine token, and Learn advises powering such VMs on for at least 20 minutes every 90 days.
- **`NAME_ALREADY_REGISTERED`.** The name is probably a duplicate. Remove the host from the pool, create a VM with a unique name, and wait 5 to 10 minutes for **Available**.
- **Agent will not update itself.** An older Learn page describes a manual update: stop `RDAgentBootLoader`, run the new agent installer, remove the `INVALID_TOKEN` entry when it asks for a token (no new token is needed), finish the wizard and start the service again.

## Slow start at boot

If the boot loader is stopped after a restart, the host shows Needs Assistance or Unavailable, or Windows logs event 7000 or 7011, Learn describes a startup that is too slow. Set **Remote Desktop Agent Loader** to **Automatic (Delayed Start)**, and raise the timeout with `reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v ServicesPipeTimeout /t REG_DWORD /d 60000 /f`. Learn says to start at 60,000 ms and that a reboot is required. Also check disk IOPS and antivirus scans, logon scripts or large GPOs that starve the agent. The agent release notes for version 1.0.15294.200 (September 2026) add a scheduled task that helps ensure the boot loader is running after startup, and 1.0.14114.100 (May 2026) lists better startup reliability on slow-booting VMs. Compare the installed version with the "Latest available versions" table, which showed production 1.0.15732.100 and validation 1.0.15991.300 when this was written. Agent updates roll out in stages, with [validation host pools](/entity/avd-validation-environment/) receiving them first.

## The full reset

Use it when the host is stuck, the agent loader service or process is missing, the host never appears in the pool, you get `EXPIRED_REGISTRATION_TOKEN`, or the targeted fixes did not apply. Learn's sequence:

1. Uninstall Remote Desktop Agent Boot Loader, Remote Desktop Services Infrastructure Agent, Remote Desktop Services Infrastructure Geneva Agent and Remote Desktop Services SxS Network Stack (remove every instance), then restart. Over RDP, choose **Do not close applications** when the stack uninstall asks.
2. Remove the host from the pool: **Host pools**, your pool, **Session Hosts**, select the host, **Remove**.
3. Generate a new registration key.
4. Run the current agent and boot loader installers, paste the key, and restart.
5. Wait for **Available**; Learn gives 5 to 10 minutes for a re-registered host.

## When to open a case

If the host still fails, Learn says to open a support case with the problem details and the steps already tried. Include the host name, event IDs with UTC times, the `qwinsta` output, the agent version and the URL tool result.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Agent issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop session host](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-vm-configuration)
- [Microsoft Learn: Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks)
- [Microsoft Learn: Check access to required FQDNs and endpoints](https://learn.microsoft.com/en-us/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint)
- [Microsoft Learn: What's new in the Azure Virtual Desktop Agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
