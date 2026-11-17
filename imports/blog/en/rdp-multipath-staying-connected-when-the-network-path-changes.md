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
  - "Status per Learn's What's new: Multipath GA in July 2025 and fully rolled out in November 2025; redundant TCP in preview in April 2026, a phased GA rollout from May 2026 and GA in July 2026; Azure Government GA in October 2026."
  - "Plan capacity per user: each session can open up to five outbound paths, up to three UDP and up to two TCP. Firewall rules, NAT capacity and port exhaustion limits should allow for that."
  - "Check it in the connection bar, which shows that RDP Multipath is enabled, and in Azure Virtual Desktop Insights under connection reliability."
faq:
  - q: "Do I have to enable RDP Multipath on the host pool?"
    a: "Learn's Multipath page lists no host pool switch or policy. It says Multipath works automatically when the prerequisites are met, and What's new says no additional configuration is required when they are. The prerequisites are a supported Windows App version and an environment that supports RDP Shortpath."
  - q: "Does Multipath replace RDP Shortpath?"
    a: "No. Learn recommends configuring Shortpath as the primary transport so that Multipath has UDP paths to work with. Multipath adds standby paths to the transport that Shortpath and reverse connect already provide. If UDP is blocked, Learn says redundant TCP paths can still add resilience."
  - q: "Why does one host pool show Multipath and another does not?"
    a: "A likely reason is rollout. The May 2026 entry in What's new says that until the rollout reaches full availability, redundant TCP may not be consistently enabled across all host pools. The client version matters too, because 2.0.1069.0 or later is needed for the redundant TCP paths."
---

RDP Multipath is an Azure Virtual Desktop transport feature that watches more than one network path for a session and moves traffic to a standby path when the active one degrades or fails. It adds resilience on top of [RDP Shortpath](/entity/rdp-shortpath/) and the TCP reverse connect transport, and Microsoft Learn says it needs no configuration beyond a supported client and an environment that supports Shortpath. This article covers what a "path" is, what the feature depends on, what is generally available, and how to plan and check it. How Multipath fits with Shortpath and TURN in a rollout is the subject of a separate article in this series.

## The problem it addresses

A [Remote Desktop Protocol](/entity/remote-desktop-protocol/) session runs over one transport at a time. If that path degrades, because a Wi-Fi access point changes, a VPN reconnects or a mobile link drops, the user sees a freeze or a disconnect. Learn's [RDP Multipath article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath) describes the answer: continuous monitoring of multiple network paths and dynamic selection of the most reliable one, which reduces the likelihood of disconnections. Backup paths stay on standby, and if the active path becomes unstable or fails, Multipath switches to the next one.

## Which paths it manages

Learn names three kinds of path:

- **UDP via STUN.** A direct UDP connection between client and session host. ICE discovers and evaluates Shortpath routes.
- **UDP via TURN.** A UDP connection relayed through a Microsoft relay server, used when a direct connection is not possible.
- **TCP via reverse connect.** Redundant TCP paths established using Rendezvous, the same family of transport that every session starts on.

Learn says these can be combined. Its example diagram shows UDP via STUN as the active path, supplemented by redundant UDP connections through a TURN server. When UDP-based Shortpath is available, UDP stays the preferred transport for performance and reliability; redundant TCP paths are added as standby transport on top. If UDP is unavailable or restricted by network policy, Learn says Multipath can still provide resilience through redundant TCP paths.

If the active path degrades or fails, the system switches to a backup UDP or TCP path. If all paths are lost, for example in a network outage, it attempts to reconnect once connectivity is restored. Learn does not publish thresholds, switch times or the rules that rank one standby path above another, so any expectation about how fast a switch feels needs a pilot with your own networks.

## What it needs

**Client.** Learn lists these minimums:

| Client | What it enables |
|---|---|
| Windows App for Windows, 2.0.559.0 or later | Multipath with multiple UDP transport paths |
| Windows App for Windows, 2.0.1069.0 or later | Multiple UDP paths and redundant TCP paths |
| Windows App for macOS beta, 11.3.8 (3048) | Multipath with multiple UDP transport paths |
| Other platforms | Not currently supported |

Learn adds that connections must come from a local Windows device for the Windows versions above. [Windows App](/entity/windows-app/) is the client to standardise on, and the version check is the first item to test when one user gets Multipath and another does not.

**Network.** The Azure cloud endpoints Learn lists for TCP and UDP RDP transport are:

| Method | Destination | Protocol and port |
|---|---|---|
| TCP-based RDP, used first for every connection | `*.wvd.microsoft.com`, `40.64.144.0/20` | TCP 443 |
| UDP via TURN | `51.5.0.0/16` | UDP 3478 |
| UDP via STUN, direct | any | UDP 1024-65535, default 49152-65535 |

For Azure Government, the Multipath page lists `20.159.80.0/24` on TCP 443 and `20.140.236.0/22` on UDP 3478 for TURN and for the STUN range. Note the label on that tab: it says Shortpath connectivity through those endpoints is in public preview for Azure Government, limited to designated validation rings, while the availability table on the same page, the Shortpath page and the October 2026 entry in What's new all say general availability. Check the current wording if you run in that cloud.

## Status: what is generally available

Learn's [What's new](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) page gives this sequence:

| Date | Entry |
|---|---|
| July 2025 | RDP Multipath generally available for Azure Virtual Desktop and Windows 365, rolled out in phases |
| November 2025 | Phased deployment completed across all eligible connections |
| April 2026 | Redundant TCP paths announced in public preview |
| May 2026 | GA rollout of redundant TCP begins, phased and quality-driven; redundant TCP may not be enabled consistently across all host pools until it completes |
| July 2026 | Redundant TCP generally available for Azure Virtual Desktop |
| September 2026 | UDP support for Windows App on macOS beta |
| October 2026 | Multipath and Shortpath with TURN generally available in Azure Government |

The Multipath page's availability table shows both multiple UDP paths and redundant TCP paths as generally available in the Azure public cloud and Azure Government. The July 2025 entry names Windows 365 as well; the redundant TCP entries name Azure Virtual Desktop, so confirm Windows 365 behaviour before you promise it to Cloud PC users.

## Planning capacity

One detail from Learn changes sizing. Each active session can establish up to five outbound transport paths: up to three UDP ports for Shortpath and Multipath connections, and up to two TCP ports for reverse connect, including redundant paths. Learn tells administrators to set firewall rules, NAT capacity and port exhaustion limits for the expected number of concurrent sessions and their paths.

A worked example, which is our arithmetic on Learn's maximum and not a measured value: 500 concurrent sessions could open up to 1,500 UDP and 1,000 TCP outbound ports, 2,500 in total. A NAT gateway or firewall that was sized for one connection per session could therefore see several times the connection count. The same applies to the client side, where a shared office egress address serves many users at once.

## Verifying that it works

Learn offers two checks:

1. **In the session.** The connection bar's connection information shows that RDP Multipath is enabled.
2. **In Azure.** [Azure Virtual Desktop Insights](/entity/avd-insights/) has a connection reliability use case that administrators can review.

Learn does not document a log field that identifies the standby paths of a session. For the transport in use, the Shortpath configuration article describes the `UdpUse` column in the WVDConnections table, with 1 for managed networks, 2 for direct STUN and 4 for TURN; any other value means TCP.

## Limits and when it will not help

- Multipath improves how a session survives a path change. It does not create a path where none exists. If the client cannot reach the gateway on TCP 443, no standby path helps.
- Users on unsupported clients, such as web or mobile clients in the table above, get no Multipath benefit.
- Learn recommends Shortpath as the primary transport. Where UDP is blocked, expect the redundant TCP paths to be the only standby, and test that on your own networks.
- Because behaviour depends on rollout state, client version and network, compare a pilot group with a control group before you quote an improvement.

## A short checklist

1. Standardise on Windows App 2.0.1069.0 or later on Windows devices.
2. Allow TCP 443 to the gateway range, UDP 3478 to the TURN range and outbound UDP for STUN.
3. Size NAT and firewall capacity for up to five paths per session.
4. Confirm the indicator in the connection bar on a test session, then review connection reliability in Insights.
5. Record the host pools where it does not appear and check client version before opening a ticket.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Use RDP Multipath to improve Azure Virtual Desktop connections](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Configure RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath)
