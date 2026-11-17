---
title: "RDP Multipath: staying connected when the network path changes"
summary: "RDP Multipath keeps standby network paths for an Azure Virtual Desktop session and switches to one of them when the active path degrades or fails. This article explains which paths exist, which client versions and endpoints it needs, how it rolled out, and how to plan firewall capacity and verify it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [rdp-multipath, remote-desktop-protocol]
keypoints:
  - "Multipath monitors several transport paths for one session: UDP through STUN, UDP through a TURN relay, and redundant TCP reverse connect paths. If the active path degrades, traffic moves to a standby path. If every path is lost, the client tries to reconnect when the network returns."
  - "Learn says no configuration is needed beyond an environment that supports RDP Shortpath. It lists Windows App 2.0.559.0 for multiple UDP paths and 2.0.1069.0 for redundant TCP paths; macOS has a beta for UDP paths and other platforms are not supported."
  - "Status per Learn's What's new: Multipath GA in July 2025 and fully rolled out in November 2025; redundant TCP in preview in April 2026, a phased GA rollout from May 2026 and GA in July 2026 for Azure Virtual Desktop and Windows 365 Cloud PCs. In Azure Government, redundant UDP paths were GA in September 2026 and redundant TCP followed in October 2026."
  - "Plan capacity per user: each session can open up to five outbound paths, up to three UDP and up to two TCP. Firewall rules, NAT capacity and port exhaustion limits should allow for that."
  - "Check it in the connection bar, which shows that RDP Multipath is enabled, and in Azure Virtual Desktop Insights under connection reliability."
faq:
  - q: "Do I have to enable RDP Multipath on the host pool?"
    a: "Learn's Multipath page lists no host pool switch or policy. It says Multipath works automatically when the prerequisites are met, and What's new says no additional configuration is required when they are. The prerequisites are a supported Windows App version and an environment that supports RDP Shortpath."
  - q: "Does Multipath replace RDP Shortpath?"
    a: "No. Learn recommends configuring Shortpath as the primary transport so that Multipath has UDP paths to work with. Multipath adds standby paths to the transport that Shortpath and reverse connect already provide. If UDP is blocked, Learn says redundant TCP paths can still add resilience."
  - q: "Why does one host pool show Multipath and another does not?"
    a: "Check the client first. The Multipath page names Windows App 2.0.559.0 for multiple UDP paths and 2.0.1069.0 for redundant TCP paths, and says connections must come from a local Windows device. Rollout is a second possibility: the May 2026 entry in What's new says that until the rollout reaches full availability, redundant TCP may not be consistently enabled across all host pools. The July 2026 entry announces general availability but does not say whether every host pool has been reached."
---

RDP Multipath is an Azure Virtual Desktop transport feature that watches more than one network path for a session and moves traffic to a standby path when the active one degrades or fails. It adds resilience on top of [RDP Shortpath](/entity/rdp-shortpath/) and the TCP reverse connect transport, and Microsoft Learn says it needs no configuration beyond a supported client and an environment that supports Shortpath. This article covers what a "path" is, what the feature depends on, what is generally available, and how to plan and check it. How Multipath fits with Shortpath and TURN in a rollout is the subject of a separate article in this series.

## The problem it addresses

When the transport of a [Remote Desktop Protocol](/entity/remote-desktop-protocol/) session fails (Learn names a TCP disconnect, a keep-alive timeout or the loss of the network interface as signals), the current Auto-Reconnect model freezes the screen behind a modal "Reconnecting" dialog and blocks user input, according to Learn's [fast reconnect article](https://learn.microsoft.com/en-us/azure/virtual-desktop/fast-reconnect). Learn's [RDP Multipath article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath) describes the answer: continuous monitoring of multiple network paths and dynamic selection of the most reliable one, which reduces the likelihood of disconnections. Backup paths stay on standby, and if the active path becomes unstable or fails, Multipath switches to the next one.

## Which paths it manages

Learn lists three kinds of path:

- **UDP via STUN.** A direct UDP connection between client and session host. ICE discovers and evaluates Shortpath routes.
- **UDP via TURN.** A UDP connection relayed through a Microsoft relay server, used when a direct connection is not possible.
- **TCP via reverse connect.** Redundant TCP-based reverse connect paths established using Rendezvous. Learn's Shortpath page separately says every connection begins on a TCP-based reverse connect transport.

Learn says these can be combined. Its example diagram shows UDP via STUN as the active path, supplemented by redundant UDP connections through a TURN server. When UDP-based Shortpath is available, UDP stays the preferred transport for performance and reliability; redundant TCP paths are added as standby transport on top. If UDP is unavailable or restricted by network policy, Learn says Multipath can still provide resilience through redundant TCP paths.

If the active path degrades or fails, the system switches to a backup UDP or TCP path. If all paths are lost, for example in a network outage, it attempts to reconnect once connectivity is restored. The Multipath page does not publish thresholds, switch times or the rules that rank one standby path above another, so any expectation about how fast a switch feels needs a pilot with your own networks.

## Where it sits in the connection sequence

Multipath does not change how a session starts. Learn's Shortpath page says every connection begins on the TCP-based reverse connect transport through the Azure Virtual Desktop gateway, where brokering and authentication happen. For public networks, the session host and client then exchange candidate lists over that transport, and ICE coordinates STUN and TURN so that the preferred path is tried first. Multipath, as Learn describes it, keeps backup paths on standby after that point and switches when the active one degrades. In our reading, Shortpath decides which path is used now, and Multipath decides what happens when that path stops being good enough.

## What it needs

**Client.** Learn lists these minimums:

| Client | What it enables |
|---|---|
| Windows App for Windows, 2.0.559.0 or later | Multipath with multiple UDP transport paths |
| Windows App for Windows, 2.0.1069.0 or later | Multiple UDP paths and redundant TCP paths |
| Windows App for macOS beta, 11.3.8 (3048) | Multipath with multiple UDP transport paths; What's new adds that the environment must meet the Shortpath for public networks requirements |
| Other platforms | Not currently supported |

Learn adds that connections must come from a local Windows device for the Windows versions above. The [Windows App](/entity/windows-app/) version check is the first item to test when one user gets Multipath and another does not.

**Network.** The Multipath page lists these Azure cloud endpoints for TCP and UDP RDP transport:

| Method | Destination | Protocol and port |
|---|---|---|
| TCP-based RDP, used first for every connection | `*.wvd.microsoft.com`, `40.64.144.0/20` | TCP 443 |
| UDP via TURN | `51.5.0.0/16` | UDP 3478 |
| UDP via STUN, direct | `51.5.0.0/16` | UDP 1024-65535, default 49152-65535 |

The STUN row is where Learn's pages differ. The Multipath page gives `51.5.0.0/16` as the address for direct STUN. The Shortpath page's firewall tables give the destination as "Any" for the session host virtual network, and, for the client network, the public IP addresses assigned to the NAT gateway or Azure Firewall as provided by the STUN endpoint. Learn does not reconcile the two. In our reading, the safer rule for direct STUN is the broader one: allow outbound UDP to the internet in the port range, and treat `51.5.0.0/16` as certain only for the TURN relay on UDP 3478.

For Azure Government, the Multipath page lists `20.159.80.0/24` on TCP 443, `20.140.236.0/22` on UDP 3478 for TURN, and `20.140.236.0/22` on UDP 1024-65535 (default 49152-65535) for direct STUN. The label on that tab says Shortpath connectivity through those endpoints is in public preview for Azure Government, limited to designated validation rings. That matches the September 2026 entries in What's new, where TURN was still in preview there. The availability table on the same page, the Shortpath page and the October 2026 entry all say general availability, so the label may be out of date. Check the current wording if you run in that cloud.

## Status: what is generally available

Learn's [What's new](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) page gives this sequence:

| Date | Entry |
|---|---|
| July 2025 | RDP Multipath generally available for Azure Virtual Desktop and Windows 365, rolled out in phases |
| November 2025 | Phased deployment completed across all eligible connections |
| April 2026 | Redundant TCP paths announced in public preview |
| May 2026 | GA rollout of redundant TCP begins, phased and quality-driven; redundant TCP may not be enabled consistently across all host pools until it completes |
| July 2026 | Redundant TCP generally available for Azure Virtual Desktop |
| August 2026 | Modern Auto-Reconnect, which is powered by Multipath, enters public preview and begins a phased rollout |
| September 2026 | UDP support for Windows App on macOS beta. In Azure Government, redundant UDP paths generally available, phased GA of redundant TCP started (validation ring), and Shortpath with TURN in public preview |
| October 2026 | Multipath with redundant TCP and UDP paths, and Shortpath with TURN, generally available in Azure Government |

The Multipath page's availability table shows both multiple UDP paths and redundant TCP paths as generally available in the Azure public cloud and Azure Government. For Windows 365, the Windows 365 What's new page has its own entries: Multipath fully rolled out in the week of 3 November 2025, the redundant TCP GA rollout in the week of 11 May 2026, and general availability of redundant TCP for Windows 365 Cloud PC in the week of 6 July 2026.

## What users see: Modern Auto-Reconnect

The most visible effect of a path change is what happens to the session window. Learn's [Session Auto-Reconnect](https://learn.microsoft.com/en-us/azure/virtual-desktop/fast-reconnect) page describes two models.

- **Current model.** After the client detects a transport failure, it waits for the operating system to report a network, then retries in a loop. Each attempt is a full end-to-end operation, and the delay between attempts starts at about one second and doubles with jitter, for a window of about 30 seconds. A modal "Reconnecting" dialog blocks input meanwhile; if the window expires, the user is asked to retry or cancel.
- **Modern Auto-Reconnect.** Instead of retrying, the client enters a "connection paused" state while the session stays active on the host, and resumes it as soon as any viable path appears. Learn says this is enabled by RDP Multipath, which lets the connection recover without rebuilding the whole connection state, and that the user sees a lightweight "Connection paused" notification instead of a blocking dialog. If connectivity does not return within the allowed waiting period, the user is asked whether to keep waiting or close the session.

Status and requirements, per Learn: What's new lists Modern Auto-Reconnect twice in August 2026, as a public preview and as the start of a phased rollout in Azure Virtual Desktop, and the Windows 365 What's new page lists a rollout start in the week of 10 August 2026. The Auto-Reconnect page says availability expands gradually and requires Windows App for Windows 2.0.1314.0 or later, in addition to Multipath. It does not give the length of the waiting period.

## Planning capacity

One detail from Learn changes sizing. Each active session can establish up to five outbound transport paths: up to three UDP ports for Shortpath and Multipath connections, and up to two TCP ports for reverse connect, including redundant paths. Learn tells administrators to set firewall rules, NAT capacity and port exhaustion limits for the expected number of concurrent sessions and their paths.

A worked example, which is our arithmetic on Learn's maximum and not a measured value: 500 concurrent sessions could open up to 1,500 UDP and 1,000 TCP outbound ports, 2,500 in total, several times what one connection per session would need. In our reading, the same applies on the client side, where a shared office egress address serves many users at once.

## Verifying that it works

Learn offers two checks:

1. **In the session.** The connection bar's connection information shows that RDP Multipath is enabled.
2. **In Azure.** [Azure Virtual Desktop Insights](/entity/avd-insights/) has a connection reliability use case that administrators can review.

Neither the Multipath page nor the Shortpath configuration article names a log field that identifies the standby paths of a session. For the transport in use, the Shortpath configuration article describes the `UdpUse` column in the WVDConnections table, with 1 for managed networks, 2 for direct STUN and 4 for TURN; any other value means TCP.

## Limits and when it will not help

- In our reading, if the client cannot reach the gateway on TCP 443, no standby path helps, because Learn describes TCP 443 as the initial connection for every session host or Cloud PC.
- Learn says other platforms are not currently supported, so users on clients outside the table above should not expect a Multipath benefit.
- Learn recommends Shortpath as the primary transport. Where UDP is blocked, expect the redundant TCP paths to be the only standby, and test that on your own networks.
- Compare a pilot group with a control group before you quote an improvement, because behaviour depends on rollout state, client version and network.

## A short checklist

1. Use Windows App 2.0.1069.0 or later on Windows devices, which Learn recommends, and 2.0.1314.0 or later if you want Modern Auto-Reconnect.
2. Allow TCP 443 to the gateway range, UDP 3478 to the TURN range and outbound UDP for STUN, noting the difference between the Multipath and Shortpath pages described above.
3. Size NAT and firewall capacity for up to five paths per session.
4. Confirm the indicator in the connection bar on a test session, then review connection reliability in Insights.
5. Record the host pools where it does not appear and check client version before opening a ticket.

## Sources

- [Microsoft Learn: Use RDP Multipath to improve Azure Virtual Desktop connections](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Microsoft Learn: Session Auto-Reconnect](https://learn.microsoft.com/en-us/azure/virtual-desktop/fast-reconnect)
- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Configure RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath)
