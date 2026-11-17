---
title: "The Azure Virtual Desktop agent: what it does on a session host"
summary: "The Azure Virtual Desktop agent is the software on each session host that connects the VM to the Azure Virtual Desktop service. This article explains what Learn says it does at registration, during a connection and during updates, and where an admin can read its state."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-agent, avd-session-host]
keypoints:
  - "Learn describes the agent as the intermediate communicator between the Azure Virtual Desktop service and the session host VM. The agent installs the side-by-side stack and the Geneva Monitoring agent, and all three are essential for end-to-end connectivity."
  - "A registration key authorizes the host to join a host pool. Learn allows a key lifetime of no less than an hour and no longer than 27 days."
  - "Session hosts connect outbound: reverse connect transport uses no TCP listener for incoming RDP connections, and both the client and the session host connect to the Azure Virtual Desktop gateway."
  - "New agent versions are flighted over five-day periods, with 24 hours for all VMs in a broker region to receive the update. A VM keeps three versions of the agent and of the side-by-side stack."
  - "Agent state shows up in the portal as session host status and health checks, in the Application event log, and in the WVDAgentHealthStatus table in Log Analytics."
faq:
  - q: "Do I install the Azure Virtual Desktop agent myself?"
    a: "Usually not. Learn says that when you provision VMs in the Azure portal and Azure Marketplace, the agent and the agent bootloader are installed automatically. If you create VMs outside the Azure Virtual Desktop service, you download the agent and bootloader .msi files and install them with a registration key. After installation the agent is updated automatically."
  - q: "Does the agent carry my users' RDP traffic?"
    a: "Learn describes the session as relayed by the gateway. The broker instructs the agent on the session host to connect to the same gateway service the user's device used, and once both are connected the gateway relays the RDP traffic. Both connections are outbound, and reverse connect does not use a TCP listener for incoming RDP connections. The pages do not say which installed component holds the RDP stream on the host."
  - q: "Can I choose when the agent updates?"
    a: "Partly. Scheduled Agent Updates lets you define up to two maintenance windows of two hours each for non-critical component updates on existing host pools. After four attempts in the windows the broker installs the update by force, and a critical update is installed by force for security purposes. The feature is disabled by default."
---

The Azure Virtual Desktop agent is the software on a session host that lets the VM communicate with the Azure Virtual Desktop service. Microsoft Learn calls it the intermediate communicator between the service and the virtual machines, and says that problems with agent installation, update or configuration mean the VMs cannot connect to the service.

## The pieces on the VM

Learn's [agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) describes the agent and its bootloader, and names the side-by-side stack and the Geneva Monitoring agent as the other two components. After a manual installation, [Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool) lists four installed applications.

| Component | What Learn says it does | Installed application |
|---|---|---|
| Agent | Acts as the intermediate communicator between the service and the VM | Remote Desktop Services Infrastructure Agent |
| Agent bootloader | The executable that loads the agent | Remote Desktop Agent Boot Loader |
| Side-by-side (SxS) stack | Required for users to securely establish reverse server-to-client connections | Remote Desktop Services SxS Network Stack |
| Geneva Monitoring agent | Monitors the health of the agent | Remote Desktop Services Infrastructure Geneva Agent |

Once the agent is installed, it installs the stack and the Geneva Monitoring agent. Learn says all three are essential for end-to-end user connectivity to function properly. See the entity page for the [agent](/entity/avd-agent/).

## What the agent does, in outline

**1. It registers the host.** A registration key authorizes a [session host](/entity/avd-session-host/) to join a [host pool](/entity/avd-host-pool/), and it is valid only for the duration you specify. The troubleshooting guide says the expiration can be no less than an hour and no longer than 27 days from generation. By hand, you run the agent installer, paste the key at the token prompt, then run the bootloader installer. After a short time the VM is listed as a session host, its status may first appear as Unavailable, and once it is Available, Learn has you restart the VM.

- For staged rollouts spanning multiple days, Learn says to set the lifetime to cover the full window, up to 27 days, so hosts you provision later do not fail to register with `EXPIRED_MACHINE_TOKEN`. If the deployment exceeds 27 days, generate a new key before the previous one expires.
- Pre-provisioned hosts that stay powered off for more than 90 days also have their machine token expire. Learn says to power affected VMs on for at least 20 minutes every 90 days so the token refreshes automatically.

**2. The loader service opens a channel to the broker.** Learn's [network connectivity article](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity) says that when a session host starts, the Remote Desktop Agent Loader service establishes the broker's persistent communication channel. The channel is layered on TLS and serves as a bus for service message exchange between the session host and the Azure Virtual Desktop infrastructure.

**3. It reports health.** The [status and health check page](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks) says the agent regularly runs health checks on the session host and assigns the statuses described below.

**4. It updates itself and the stack.** After the initial installation, Learn says the agent regularly queries the service for a newer version of the agent, the stack or the monitoring agent. A newer version is installed automatically by the flighting system, unless Scheduled Agent Updates is configured.

## Where the agent sits in a connection

Learn says Azure Virtual Desktop uses reverse connect transport to establish the remote session and carry RDP traffic. Unlike on-premises Remote Desktop Services deployments, it does not use a TCP listener to receive incoming RDP connections. It uses outbound connectivity to the Azure Virtual Desktop infrastructure over HTTPS.

In the network connectivity article's connection sequence, the broker uses the previously established persistent channel to initialize the connection, the Remote Desktop stack initiates a TLS connection to the same gateway instance the client used, and after both are connected the gateway starts relaying the data.

The [service architecture and resilience article](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience) words the same moment differently: the broker instructs the Azure Virtual Desktop agent running on the session host to connect to the same gateway service the user's device used, and the gateway then relays the RDP traffic over TCP. Reverse connect transport is the default there. These two pages name the host-side connection differently and neither says which installed component holds the RDP stream. For the UDP-based alternative, see [RDP Shortpath](/entity/rdp-shortpath/).

## Outbound access session hosts need

Learn says you must unblock the required URLs to install the agent, the stack and the Geneva Monitoring agent. The [required FQDN article](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint) has the full table. This is an excerpt of its Azure cloud table. All entries are outbound, so you do not need to open inbound ports, and you must use the wildcard for FQDNs involving service traffic.

| Address | Port | Purpose in Learn's table |
|---|---|---|
| `*.wvd.microsoft.com` | TCP 443 | Service traffic including TCP based RDP connectivity |
| `*.service.windows.cloud.microsoft` | TCP 443 | Service Traffic |
| `*.windows.cloud.microsoft` | TCP 443 | Service Traffic |
| `*.windows.static.microsoft` | TCP 443 | Service Traffic |
| `mrsglobalsteus2prod.blob.core.windows.net` | TCP 443 | Agent and side-by-side (SXS) stack updates |
| `*.prod.warm.ingest.monitor.core.windows.net` | TCP 443 | Agent traffic, diagnostic output |
| `gcs.prod.monitoring.core.windows.net` | TCP 443 | Agent traffic |

Learn lists two more addresses separately, `169.254.169.254` (TCP 80, Azure Instance Metadata Service) and `168.63.129.16` (TCP/UDP 80, 32526 (TCP) and 53 (TCP/UDP), Azure Platform Service Connectivity). Port 53 for the second address is only required with Azure-provided DNS.

Two cautions come from that page:

- Traffic to the two fabric addresses must not be intercepted, proxied, or redirected.
- Microsoft does not support Azure Virtual Desktop deployments where the listed FQDNs and endpoints are blocked.

Two further points come from other pages:

- For agent traffic without a wildcard, the same page gives a tip: in the Application log, source WVD-Agent, look for event ID 3701 and unblock the FQDNs listed there. They are region-specific, so repeat the process for each Azure region.
- The [check access article](https://learn.microsoft.com/en-us/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint) describes the Azure Virtual Desktop Agent URL Tool, `WVDAgentUrlTool.exe`, which is part of the agent installation folder and lists required FQDNs and endpoints the host cannot access. It does not verify the wildcard entries, so allow those first.

## How agent updates arrive

Learn says the agent update is not connected to Azure Virtual Desktop infrastructure build updates. New versions are deployed in five-day periods to all Azure subscriptions, called flights.

- It takes 24 hours for all VMs in a single broker region to receive the update in a flight, so VMs in one host pool can update at different times, and VMs in different regions might update on different days of the period.
- An event 3277 in the Application log means the update did not work. If you do not see it, the VM is in a different flight and is updated later.
- A VM keeps three versions of the agent and of the side-by-side stack. If you delete these components prematurely and the agent or stack fails, it cannot roll back, which puts the VM in an unavailable state.
- For the Geneva Monitoring agent, the earlier version is disabled, not deleted, so it can be re-enabled if the latest version has a problem.

Two options change the timing. A [validation host pool](/entity/avd-validation-environment/) lets you monitor service updates before the service applies them to your standard environment, as [Learn's validation environment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-validation-environment) puts it, and [What's new in the agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent) lists current versions. [Scheduled agent updates](/entity/avd-scheduled-agent-updates/) create up to two maintenance windows so that updates do not happen during peak business hours. The feature is disabled by default and can only be configured for existing host pools, under Azure Virtual Desktop, Host pools, the pool, Scheduled Agent Updates. Non-critical updates after installation then happen only within your two-hour windows. The broker tries each window up to four times and then installs the update by force, and a critical update is installed by force for security purposes. The companion articles on validation host pools and on scheduled agent updates cover both in detail.

## Reading the agent's state

**Portal status.** On the Session hosts tab, the status page lists these agent-related meanings:

- *Upgrading*: the agent upgrade is in progress.
- *Upgrade Failed*: the agent could not update or upgrade. Learn says this does not affect new or existing sessions, and new sessions are still load balanced to the host.
- *Needs Assistance*: the host failed one or more non-fatal checks: the Geneva Monitoring Agent, Azure Instance Metadata Service (IMDS) or URL health check. Users can still connect, but the experience may degrade. New sessions are still load balanced here. Select the host's name on the Session hosts tab to see which checks failed. A failed Geneva check is semi-fatal: connections can succeed but carry no logging information.
- *Unavailable*: the host is off or failed a fatal check. The stack listener and domain trust checks are fatal, and users cannot connect if the domain joined check fails. New sessions are not load balanced to Unavailable or Shutdown hosts.

**Event Viewer.** The agent guide points to Windows Logs, Application, with the sources WVD-Agent, WVD-Agent-Updater, RDAgentBootLoader and MsiInstaller. Event 3277 covers several errors, told apart by the description. `INVALID_REGISTRATION_TOKEN` or `EXPIRED_MACHINE_TOKEN` means the registration key is not recognized as valid, and `InstallationHealthCheckFailedException` means the stack listener is not working. Event 3019 means the agent cannot reach the web socket transport URLs, and 3703 that it cannot reach the gateway URLs. The guide also covers the Remote Desktop Agent Boot Loader service not starting fast enough at OS boot (Event 7000 or 7011). The companion article on troubleshooting the agent goes through these failures.

**Log Analytics.** Learn's [agent update diagnostics guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics) uses the `WVDAgentHealthStatus` table and points to the Log Analytics guide for sending diagnostics to a workspace. This query, adapted from the guide, shows which agent version a host reported and when each version first appeared:

```kusto
WVDAgentHealthStatus
| where TimeGenerated >= ago(30d)
| where SessionHostName == "<session host name>"
| project TimeGenerated, AgentVersion, SessionHostName, LastUpgradeTimeStamp, UpgradeState, UpgradeErrorMsg
| summarize arg_min(TimeGenerated, *) by AgentVersion
| sort by TimeGenerated asc
```

The guide notes that results cover only the last 30 days. See also [Azure Virtual Desktop Insights](/entity/avd-insights/).

## A short routine for admins

1. When a host will not register, check the registration key lifetime first, and match it to your rollout window.
2. Before blaming the agent for a connection problem, run the Agent URL Tool against the FQDN list after allowing the wildcard entries yourself. Learn does not say whether the tool tests the two fabric addresses, so check them yourself. A failed IMDS check puts a host in Needs Assistance; do not intercept, proxy or redirect that traffic.
3. Read the status on the Session hosts tab before opening a VM.
4. Do not delete old agent or stack versions early. Learn says the VM keeps three versions so it can roll back, and deleting them can leave the VM unavailable after a failed update. Remove components only as the troubleshooting guide describes.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview)
- [Microsoft Learn: What's new in the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent)
- [Microsoft Learn: Scheduled agent updates for Azure Virtual Desktop host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates)
- [Microsoft Learn: Scheduled agent updates diagnostics guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Understanding Azure Virtual Desktop network connectivity](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks)
- [Microsoft Learn: Configure a host pool as a validation environment](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-validation-environment)
- [Microsoft Learn: Check access to required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint)
- [Microsoft Learn: Troubleshoot common Azure Virtual Desktop Agent issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent)
