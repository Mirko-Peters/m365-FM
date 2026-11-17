---
title: "The Azure Virtual Desktop agent: what it does on a session host"
summary: "The Azure Virtual Desktop agent is the service on each session host that connects the VM to the Azure Virtual Desktop service. This article explains what it does at registration, during a connection and during updates, and where an admin can read its state."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-agent, avd-session-host]
keypoints:
  - "Learn describes the agent as the intermediate communicator between the Azure Virtual Desktop service and the session host VM. It works together with the agent bootloader, the side-by-side stack and the Geneva Monitoring agent, and Learn calls all three essential for end-to-end connectivity."
  - "A registration key authorizes the host to join a host pool. Learn allows a key lifetime of no less than an hour and no longer than 27 days."
  - "Session hosts connect outbound: Learn says reverse connect transport uses no TCP listener for incoming RDP connections, and both client and session host connect to the Azure Virtual Desktop gateway."
  - "New agent versions are flighted over five-day periods, with 24 hours for all VMs in a broker region to receive the update. A VM keeps three versions of the agent and of the side-by-side stack."
  - "Agent state shows up in the portal as session host status and health checks, in the Application event log, and in the WVDAgentHealthStatus table in Log Analytics."
faq:
  - q: "Do I install the Azure Virtual Desktop agent myself?"
    a: "Usually not. Learn says that when you create session hosts with the Azure portal or Azure Marketplace, the agent and the agent bootloader are installed automatically. If you build VMs yourself, for example with PowerShell, you download the agent and bootloader .msi files and install them with a registration key. After installation the agent updates itself."
  - q: "Does the agent carry my users' RDP traffic?"
    a: "Learn's connectivity page splits the work. The agent's persistent channel to the broker carries service messages between the session host and the Azure Virtual Desktop infrastructure. The Remote Desktop stack opens the TLS connection to the gateway for the session itself. Both are outbound from the host, and Learn says reverse connect does not use a TCP listener for incoming RDP connections."
  - q: "Can I stop the agent from updating during business hours?"
    a: "Yes, for existing host pools. Scheduled agent updates lets you define up to two maintenance windows of two hours each. Learn says that after four failed attempts in the windows the broker installs the update by force, and that a critical update is installed by force for security reasons."
---

The Azure Virtual Desktop agent is the software on a session host that lets the VM talk to the Azure Virtual Desktop service. Microsoft Learn calls it the intermediate communicator between the service and the virtual machine: it registers the host, keeps a channel to the broker open, reports health and installs updates. If the agent is broken, Learn says the VM cannot connect to the service.

This article covers the agent's job on the host. Host sizing and lifecycle, and failure patterns, are covered in other articles in this series.

## The pieces on the VM

Learn's [agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) names three components that sit on a session host. Learn's [agent troubleshooting guide](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent) gives the program names and the boot loader service name you see on the machine.

| Component | What Learn says it does | Name on the VM |
|---|---|---|
| Agent and agent bootloader | The agent is the intermediate communicator between the service and the VM. The bootloader is the executable that loads the agent. | Remote Desktop Services Infrastructure Agent; Remote Desktop Agent Boot Loader (service Remote Desktop Agent Loader, RDAgentBootLoader) |
| Side-by-side (SxS) stack | Required for users to establish reverse server-to-client connections securely | Remote Desktop Services SxS Network Stack |
| Geneva Monitoring agent | Monitors the health of the agent | Remote Desktop Services Infrastructure Geneva Agent |

Once the agent is installed, it installs the other two components. Learn says all three are essential. This is not the FSLogix agent or the Remote Desktop client agent. See the entity page for the [agent](/entity/avd-agent/).

## What the agent does, in order

**1. It registers the host.** A registration key authorizes a [session host](/entity/avd-session-host/) to join a [host pool](/entity/avd-host-pool/). Learn's [add session hosts article](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool) says the key is valid only for the duration you specify, up to a maximum of 27 days, and the troubleshooting guide gives the lower bound: no less than an hour. When you register by hand, you run the agent installer, paste the key at the registration token prompt, and then run the bootloader installer. On Windows Server, Learn first has you install the Remote Desktop Session Host role. Shortly afterwards the VM is listed as a session host, and Learn notes its status may first show as Unavailable. If a newer agent version exists, the host upgrades automatically. Once the status is Available, Learn has you restart the VM.

- Learn warns that hosts you provision later in a staged rollout fail with `EXPIRED_MACHINE_TOKEN` if the key has already expired. For a longer rollout, generate a new key before the old one runs out.
- Pre-provisioned hosts that stay powered off for more than 90 days also have their machine token expire. Learn says to power such VMs on for at least 20 minutes every 90 days so the token refreshes automatically.

In its re-registration procedure, the troubleshooting guide works with two values under `HKLM:\SOFTWARE\Microsoft\RDInfraAgent`: `IsRegistered` and `RegistrationToken`. After a successful registration it expects `IsRegistered` to be 1 and `RegistrationToken` to be blank.

**2. It keeps a channel to the broker.** Learn's [network connectivity article](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity) says that when a session host starts, the Remote Desktop Agent Loader service establishes the broker's persistent communication channel. The channel is layered on a TLS connection and serves as a bus for service messages between the session host and the Azure Virtual Desktop infrastructure.

**3. It reports health.** Learn says the agent regularly runs health checks on the session host and assigns the statuses (Available, Needs Assistance, Unavailable, Shutdown, Upgrading, Upgrade Failed). The portal lists them. More on reading these below.

**4. It updates itself and the stack.** After the first installation, Learn says the agent regularly asks the service whether there are newer versions of the agent, the side-by-side stack or the monitoring agent. By default the rollout system installs newer components automatically.

## Where the agent sits in a connection

Learn says Azure Virtual Desktop uses reverse connect transport to set up the remote session and carry RDP traffic. Unlike on-premises Remote Desktop Services, reverse connect does not use a TCP listener for incoming RDP connections. It uses outbound connectivity over HTTPS, and both client and session host connect to the Azure Virtual Desktop gateway. In Learn's connection sequence, the Remote Desktop stack on the host then starts a TLS connection to the same gateway instance the client used.

In our reading, the agent's channel to the broker is the control path and the stack's connection to the gateway is the session path, and the host dials out in both cases. For UDP-based connections see [RDP Shortpath](/entity/rdp-shortpath/).

## Outbound access the agent needs

Learn's agent overview says the URLs in the required URL list must be unblocked to install the agent, the stack and the Geneva Monitoring agent. The [required URL list](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint) has the full table for the Azure cloud. This excerpt covers the entries tied to agent behavior. Learn says you must use the wildcard for FQDNs involving service traffic:

| Address | Port | Purpose in Learn's table |
|---|---|---|
| `*.wvd.microsoft.com` | TCP 443 | Service traffic, including TCP-based RDP connectivity |
| `*.service.windows.cloud.microsoft` | TCP 443 | Service traffic |
| `*.windows.cloud.microsoft` | TCP 443 | Service traffic |
| `*.windows.static.microsoft` | TCP 443 | Service traffic |
| `login.microsoftonline.com` | TCP 443 | Authentication to Microsoft Online Services |
| `mrsglobalsteus2prod.blob.core.windows.net` | TCP 443 | Agent and side-by-side stack updates |
| `*.prod.warm.ingest.monitor.core.windows.net` | TCP 443 | Agent traffic, diagnostic output |
| `gcs.prod.monitoring.core.windows.net` | TCP 443 | Agent traffic |
| `51.5.0.0/16` | UDP 3478 | Relayed RDP connectivity |
| `169.254.169.254` | TCP 80 | Azure Instance Metadata Service |
| `168.63.129.16` | TCP/UDP: 80, 32526 (TCP), 53 (TCP/UDP) | Azure platform service connectivity; port 53 is only required with Azure-provided DNS |

Three cautions come straight from that page:

- Traffic to the two fabric addresses, `169.254.169.254` and `168.63.129.16`, must not be intercepted, proxied or redirected.
- Microsoft does not support deployments where the listed endpoints are blocked.
- If you need agent FQDNs without wildcards, Learn points to the Application log, source WVD-Agent, event ID 3701, and says to repeat this for each region.

## How agent updates arrive

Learn says agent updates are not tied to Azure Virtual Desktop infrastructure updates. New versions go out in flights.

- A flight is a five-day period in which a new version is deployed to all Azure subscriptions.
- It takes 24 hours for all VMs in one broker region to receive the update in a flight. VMs in the same host pool can update at different times, and VMs in different regions can update on different days of the period.
- Learn says the update normally takes 2 to 3 minutes on a new VM.
- A VM keeps three versions of the agent and of the side-by-side stack. The earliest is removed when a new one installs. If you delete components early, rollback after a failed update may not be possible, which Learn says puts the VM in an unavailable state.
- The Geneva Monitoring agent updates differently: the old GenevaTask is found and disabled before a new task is created, and the earlier monitoring agent is not deleted, so it can be re-enabled if the new version has a problem.

The [version history](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent) shows the rollout in practice. The page's latest-versions table lists 1.0.15732.100 for production and 1.0.15991.300 for validation; check it for the current numbers. Learn says the rollout can take several weeks to complete across all environments, that not all validation versions reach production because updates are repacked under a new version number, and that validation updates are released more frequently than production updates. 

Two tools let you shape this. A [validation host pool](/entity/avd-validation-environment/) lets you monitor service updates before the service applies them to your standard environment, as [Learn's validation environment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-validation-environment) puts it. [Scheduled agent updates](/entity/avd-scheduled-agent-updates/) restrict non-critical component updates to maintenance windows you define. Learn's rules for the second one:

- You can configure it only for existing host pools. You set one or two maintenance windows of two hours each, in one time zone for the pool or in each host's local time zone.
- Hosts must be powered on during the window.
- The broker tries each window up to four times and then installs the update by force. A critical component update is also installed by force.
- Pools with the feature receive the update after the agent has been fully flighted to production.

The portal path in Learn is Azure Virtual Desktop, Host pools, the pool, Scheduled Agent Updates. It is disabled by default.

## Reading the agent's state

**Portal status.** On the Session hosts tab, Learn's [status and health check page](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks) lists these agent-related meanings:

- *Upgrading*: the agent upgrade is in progress, and the status returns to Available afterwards.
- *Upgrade Failed*: the agent could not update or upgrade. Learn says this does not affect new or existing sessions, and new sessions are still load balanced to the host.
- *Needs Assistance*: one or more non-fatal checks failed: the Geneva Monitoring Agent, Azure Instance Metadata Service (IMDS) or URL health check. Users can still connect, but the experience may degrade. Learn's health check table calls the Geneva check semi-fatal: connections can succeed but carry no logging information.
- *Unavailable*: the host is off or failed a fatal check. Domain joined, side-by-side stack listener and domain trust are the fatal checks in Learn's table.

**Event Viewer.** Learn's agent guide points to Windows Logs, Application, with the sources WVD-Agent, WVD-Agent-Updater, RDAgentBootLoader and MsiInstaller. Event 3277 appears for several errors, identified by the description text. `INVALID_REGISTRATION_TOKEN` or `EXPIRED_MACHINE_TOKEN` means the registration key is not recognized as valid. `InstallationHealthCheckFailedException` means the stack listener is not working. The overview adds that an event 3277 after an update means the update failed. Event 3019 means the agent cannot reach the web socket transport URLs, and event 3703 means it cannot reach the gateway URLs.

**Log Analytics.** Learn's [agent update diagnostics guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics) uses the `WVDAgentHealthStatus` table. The table has data only if you send the host pool's diagnostics to a Log Analytics workspace, which the guide's first section walks through. This query, adapted from the guide, shows which agent version a host reported and when each version first appeared:

```kusto
WVDAgentHealthStatus
| where TimeGenerated >= ago(30d)
| where SessionHostName == "<session host name>"
| project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg
| summarize arg_min(TimeGenerated, *) by AgentVersion
| sort by TimeGenerated asc
```

Results cover only the last 30 days. See also [Azure Virtual Desktop Insights](/entity/avd-insights/).

## A short routine for admins

1. When a host will not register, check the registration key lifetime first. Learn ties `EXPIRED_MACHINE_TOKEN` to hosts provisioned after the key has expired, so match the lifetime to your rollout window.
2. Before blaming the agent for a connection problem, check outbound access against the required URL list, including the two fabric addresses.
3. If you use scheduled agent updates, make sure hosts are powered on in the window.
4. Read the status on the Session hosts tab before opening a VM. Needs Assistance and Upgrade Failed still accept sessions, while Unavailable does not.
5. Do not remove old agent or stack versions by hand.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview)
- [Microsoft Learn: What's new in the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent)
- [Microsoft Learn: Scheduled agent updates for Azure Virtual Desktop host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates)
- [Microsoft Learn: Scheduled agent updates diagnostics guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Understanding Azure Virtual Desktop network connectivity](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks)
- [Microsoft Learn: Configure a host pool as a validation environment](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-validation-environment)
- [Microsoft Learn: Troubleshoot common Azure Virtual Desktop Agent issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent)
