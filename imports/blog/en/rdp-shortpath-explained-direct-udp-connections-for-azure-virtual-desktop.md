---
title: "RDP Shortpath explained: direct UDP connections for Azure Virtual Desktop"
summary: "RDP Shortpath adds a UDP-based transport to an Azure Virtual Desktop connection and falls back to the TCP reverse connect transport when UDP cannot be established. It has two modes, managed networks and public networks, which together give four options."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [rdp-shortpath, remote-desktop-protocol]
keypoints:
  - "Every connection starts on the TCP reverse connect transport through the gateway. The client then tries UDP in the background, and if UDP succeeds the TCP connection drops. If it fails, the session stays on TCP."
  - "Learn describes four options: managed networks with the listener, managed networks with ICE/STUN, public networks with direct STUN and public networks relayed through TURN. Only the listener variant needs a setting on the session host."
  - "Public networks prefer a direct STUN path and use a TURN relay when a firewall or NAT blocks it. Learn names Symmetric NAT, as with Azure Firewall and Azure NAT Gateway, as a case for the relayed connection."
  - "When managed and public paths are both available, the first connection established is used, and Learn says the managed path is likely to win because it needs fewer steps."
  - "The security level is the same as the TCP reverse connect transport: TLS over reliable UDP using the session host's certificate, set up only after the service has authenticated the session."
faq:
  - q: "Does RDP Shortpath replace the TCP connection to Azure Virtual Desktop?"
    a: "No. Learn says it extends RDP multi-transport and complements the reverse connect transport. Brokering and authentication always run over the TCP reverse connect path first. Shortpath is set up afterwards, and if it cannot be established the session continues over TCP."
  - q: "Is RDP Shortpath for public networks generally available?"
    a: "Per the RDP Shortpath page on Learn, public network Shortpath via STUN and TURN is generally available in the Azure cloud and in Azure Government. The configuration page carries a note that says TURN is available only in the Azure public cloud, so check the current wording for your cloud before you plan around it. Some client platforms are in beta or preview, which the client section below lists."
  - q: "Can a user lose the session when a TURN relay is updated?"
    a: "Learn says TURN-based connections are susceptible to drops during relay updates, which usually happen in planned maintenance windows but can occur outside them for urgent Azure infrastructure fixes. It says the client reconnects automatically within a few seconds."
---

RDP Shortpath is a UDP-based transport for [Remote Desktop Protocol](/entity/remote-desktop-protocol/) sessions in Azure Virtual Desktop. It runs next to the default TCP reverse connect transport: every session starts on TCP, the client then tries to build a UDP path, and if that works the TCP connection is dropped and the session moves to UDP. If UDP cannot be established, the session simply stays on TCP. This article explains the concept and the decisions behind it; the configuration steps are in the companion article on configuring RDP Shortpath, and ports, firewall rules and DNS are covered in the networking basics article in this series.

## What problem it addresses

Learn's [RDP Shortpath article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath) describes the trade-off. A UDP-based transport offers better connection reliability and more consistent latency. The TCP-based reverse connect transport is the one with the highest compatibility across network configurations and a high success rate for establishing RDP connections. Shortpath keeps both: TCP gives the broadest compatibility and a high success rate for starting a session, and UDP improves the session where the network allows.

The UDP transport is built on the Universal Rate Control Protocol (URCP). Learn says URCP adds active monitoring of network conditions to UDP and provides fair, full use of the link. Learn lists these benefits: higher throughput; with STUN, no extra relay points, which reduces round-trip time; and, for managed networks only, support for Quality of Service marking with DSCP and a throttle rate that limits outbound traffic per session.

## The connection sequence in one view

Learn describes one sequence for managed networks and another for public networks. Both share these steps, with one difference in step 3:

1. The connection starts on the TCP reverse connect transport through the Azure Virtual Desktop gateway. Brokering and authentication happen here.
2. Client and session host exchange capabilities over this first transport.
3. The two sides try to build a UDP path in parallel. For managed networks, Learn says the client keeps establishing the initial connection over reverse connect while it probes the session host's addresses, so the user sees no delay. The public-network sequence on the same page does not repeat that statement.
4. If a UDP path works, the client sets up TLS over reliable UDP, and all dynamic virtual channels (remote graphics, input and device redirection) move to the new transport.
5. If a firewall or the network topology blocks UDP, RDP continues on reverse connect.

How step 3 works differs between the two modes.

## The two modes and four options

[RDP Shortpath](/entity/rdp-shortpath/) can be used in two ways, and Learn's configuration page splits them into four options.

| Option | Path | What it needs |
|---|---|---|
| Managed networks with listener | Direct UDP between client and session host over a private connection | Enable the Shortpath listener on session hosts and allow an inbound port |
| Managed networks with ICE/STUN | Direct UDP over a private connection | No listener and no inbound port; STUN discovers addresses and a dynamic port |
| Public networks with ICE/STUN | Direct UDP over the internet | No listener and no inbound port; the port range is configurable |
| Public networks via TURN | Relayed UDP through a Microsoft relay server | No listener and no inbound port; the port range is configurable |

**Managed networks** means a private connection with direct line of sight: [Azure ExpressRoute](/entity/azure-expressroute/) private peering, or a site-to-site or point-to-site IPsec VPN such as [Azure VPN Gateway](/entity/azure-vpn-gateway/). Learn defines line of sight as the client being able to reach the session host without being blocked by firewalls. For other VPN types it recommends a UDP-based VPN, because TCP-based VPNs add the overhead of TCP congestion control, which slows RDP.

In the listener variant, the session host sends the client the list of its IPv4 and IPv6 addresses, and the client probes them directly. That is why it needs an open inbound port on every session host.

**Public networks** means the internet. Learn describes the problem it solves: client and session host both sit behind NAT devices and usually do not know their own public address.

## How a public path is found: ICE, STUN and TURN

For public networks, Learn says Interactive Connectivity Establishment (ICE) coordinates STUN and TURN so that the preferred path is tried first.

**STUN** lets a device discover its public IP address and port from behind a NAT device. The session host collects candidates in several steps:

1. It lists all network interfaces, including virtual ones such as VPN and Teredo interfaces.
2. The Remote Desktop Services service opens a UDP socket on each interface and stores the address and port as a local candidate.
3. It sends a small UDP packet from each socket to the Azure Virtual Desktop STUN server. The reply contains the public address and port, stored as a reflexive candidate.
4. The session host passes its candidate list to the client over the existing reverse connect transport. The client gathers its own candidates and sends them back.
5. Both sides then try to connect to each other at the same moment. Learn explains why: many NAT devices accept incoming traffic on a socket once outbound traffic has opened it, so simultaneous attempts often succeed without any inbound firewall rule.

**TURN** is the fallback. When STUN fails because a firewall or NAT device blocks the direct path, traffic is relayed through an intermediate server. Learn's order of preference puts the direct STUN connection first and the relayed connection second. It names Symmetric NAT, which maps one private source address and port to a unique public destination address and port, as the typical reason for a relay, and says this is the case with [Azure Firewall](/entity/azure-firewall/) and [Azure NAT Gateway](/entity/azure-nat-gateway/). If UDP is blocked completely, the connection falls back to TCP.

A TURN relay is chosen by the client's physical location. Learn notes that a client far from any relay might fall back to TCP. According to Learn, the TURN range moved from a shared Azure Communication Services subnet to a dedicated range for Azure Virtual Desktop and Windows 365 across 39 Azure regions. The page lists those regions; check it for your users' locations. For the address range and ports, use the networking basics article or the Learn page itself.

Learn says TURN-based connections can drop during relay updates, usually in planned maintenance windows but occasionally outside them for urgent fixes, and that the client reconnects within a few seconds.

## When more than one path exists: first found wins

A user on a corporate VPN can often reach the session host both over the private connection and over the internet. Learn's example scenarios show how the outcome is decided:

- **Managed path not enabled** (scenario 3): ICE/STUN sees several routes, evaluates each and chooses the lowest latency. A public-network Shortpath over a direct VPN connection can win this way.
- **Both modes enabled** (scenario 4): the client attempts both at once, through the listener port on the managed side and through ICE/STUN on the public side. The first connection established is used. Because the public route has more steps, such as NAT devices, load balancers or a STUN server, Learn says the managed path is likely to be established first.
- **Steering a route** (scenario 5): to stop ICE/STUN from using a particular route, an administrator can block UDP on that route. The remaining path is then always used.
- **Everything blocked** (scenario 7): Shortpath fails and the session runs on TCP reverse connect.

The design decision for an administrator is whether to control the path (listener, or UDP blocked on one route) or accept whatever ICE finds.

## What tends to prevent a direct path

Learn's recommendations for public networks read as a list of things that interfere with direct UDP: force tunneling, double NAT or carrier-grade NAT, cloud packet-inspection services and TCP-based VPNs. It also recommends that users leave UPnP enabled on home routers, because the client can use UPnP to create a port mapping that improves the odds of a direct connection, and it suggests enabling IPv6 or Teredo, which adds NAT traversal candidates in IPv4-only networks. The Windows 365 page adds a known-issues list that matches this: double NAT through a secure web gateway or proxy, routing through an inspecting proxy, networks that restrict UDP, and carrier-grade NAT.

None of these breaks a session, since TCP remains; they decide whether users see the UDP benefit.

## Security

Learn states that Shortpath extends RDP multi-transport and does not replace reverse connect. Initial brokering stays with the service, and connection attempts are ignored unless they match a reverse connect session first. Shortpath is established after authentication. The UDP path uses TLS over reliable UDP with the session host's certificate. By default the operating system generates that certificate during deployment, and Learn says Azure Virtual Desktop does not support a certificate from a certificate authority at this time. Learn says the security offered is the same as for the TCP reverse connect transport.

## Clients, clouds and Windows 365

Per the configuration page, the client must be Windows App or the Remote Desktop app on a supported platform. The prerequisites list Windows App on Windows, on macOS in a beta (version 11.3.8, build 3048) and on Android and ChromeOS as a preview.

For availability, the RDP Shortpath page marks Shortpath for public networks via STUN and TURN as generally available in the Azure cloud and in Azure Government. The configuration page, on the other hand, says STUN is available in both clouds and TURN only in the Azure public cloud. Learn's pages disagree here, so check the current wording of both pages for your cloud.

[Windows 365](/entity/windows-365/) Cloud PCs can use the same feature. The Windows 365 page on Learn lists STUN and TURN as generally available in the Azure public cloud and in Azure Government, and says the Cloud PC needs outbound UDP to the public address space because the client's address is usually unknown.

## A short decision guide

1. Do users connect over ExpressRoute or an IPsec VPN with a direct route to the session hosts? Then a managed-network option applies. Decide between the listener, which needs an inbound port on every session host, and ICE/STUN, which does not. Learn lists DSCP marking and a per-session throttle rate as benefits for managed networks; it does not say whether that covers the ICE/STUN variant as well.
2. Do users connect over the internet? Public-network Shortpath needs no configuration when firewalls allow the traffic and the transport settings are at their defaults. The questions become whether UDP may leave the session host subnet and the client network, and which outbound path the subnet uses.
3. Is a Symmetric NAT in the path, for example Azure Firewall or Azure NAT Gateway in front of the session hosts? Plan for the relayed connection, and keep TURN enabled.
4. Do you need control over which path wins? Use scenario 5: block UDP on the route you do not want.
5. Do users sit behind double NAT, carrier-grade NAT, an inspecting proxy or a TCP-based VPN? Expect TCP and treat UDP as an improvement where it appears.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Configure RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath)
- [Microsoft Learn: Use RDP Shortpath for public networks with Windows 365 Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/rdp-shortpath-public-networks)
