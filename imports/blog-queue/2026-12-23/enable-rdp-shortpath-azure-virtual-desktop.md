---
title: "Enable RDP Shortpath for Azure Virtual Desktop to Improve Connection Quality"
summary: "How RDP Shortpath works in Azure Virtual Desktop and how to enable it for managed and public networks: client requirements, Intune settings, ports, host pool options, UDP settings and verification."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [azure-virtual-desktop]
keypoints:
  - "RDP Shortpath adds a direct UDP transport between client and session host. If UDP fails, the connection falls back to TCP reverse connect."
  - "Managed networks use ExpressRoute private peering or VPN and a listener on UDP port 3390 by default. Public networks use STUN and TURN with no inbound port."
  - "Enable the listener under Administrative templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Azure Virtual Desktop in an Intune Settings catalog profile."
  - "Host pool options are under Host pools > Settings > Networking > RDP Shortpath. The most restrictive setting between host pool and session host applies."
  - "Verify in the Connection Information dialog: UDP (Private Network), UDP or UDP (Relay) show the transport in use."
faq:
  - q: "What does RDP Shortpath change?"
    a: "Microsoft Learn says RDP normally starts a TCP-based reverse connect transport through the Azure Virtual Desktop gateway and tries to switch to UDP. With Shortpath, a direct UDP-based transport is used between client and session host. If UDP succeeds the TCP connection is dropped, and if not, TCP continues as a fallback."
  - q: "Which ports are involved?"
    a: "For managed networks the session host listens on UDP 3390 by default. For STUN and TURN on public networks, Learn lists UDP 3478 for signaling and relay, UDP 1024 to 65535 (default 49152 to 65535) for direct STUN connections, and the TURN relay range 51.5.0.0/16 in the Azure cloud."
  - q: "Which clients support it?"
    a: "The setup page lists the Windows App on Windows, the Windows App on macOS in beta version 11.3.8 (3048), and the Windows App on Android and Chrome OS in preview. Check the page for current versions."
  - q: "Do I need to open inbound ports for public networks?"
    a: "No. Learn says public network connections need no listener or inbound port, but outbound UDP to the internet or STUN and TURN servers must be allowed. Symmetric NAT, for example Azure Firewall or NAT Gateway, forces relayed TURN connections."
  - q: "How do I know it works?"
    a: "Connect to a remote session, select the signal strength icon in the Connection toolbar and read the transport. UDP (Private Network) is a managed-network direct connection, UDP is STUN and UDP (Relay) is TURN."
---

RDP Shortpath gives Azure Virtual Desktop a direct UDP path between the client and the session host. Learn describes it as offering better reliability and more consistent latency than the default TCP path. This guide covers how the transport is chosen, the network rules, the Intune and host pool settings, and how to confirm it is in use.

## How it works

By default RDP starts a TCP-based reverse connect transport through the Azure Virtual Desktop gateway and tries to switch to UDP. If UDP works, the TCP connection is dropped. If not, TCP stays as the fallback. Shortpath uses URCP for rate control.

There are two network cases:

- **Managed networks** are private connections such as ExpressRoute private peering or a site-to-site or point-to-site IPsec VPN. Either the session host listens on UDP 3390 (default, configurable) and inbound ports must be allowed, or STUN establishes the connection without inbound ports.
- **Public networks** use STUN for a direct UDP path first, then TURN for a relayed UDP path.

If several paths are available, the first one established is used.

## Prerequisites

From the setup page: the Windows App on Windows, Windows App on macOS (beta 11.3.8 (3048)) or Windows App on Android and Chrome OS (preview). Azure PowerShell needs the Az.DesktopVirtualization 5.2.1-preview module, unless you use Cloud Shell. STUN for public networks is available in Azure public and Azure Government, and TURN only in Azure public.

## Network rules

| Purpose | Port and protocol | Note |
| --- | --- | --- |
| Managed-network listener | Inbound UDP 3390 to the session host | Only for the listener method |
| STUN or TURN signaling | UDP 3478 outbound | |
| STUN direct connection | UDP 1024 to 65535, default 49152 to 65535 | Can be limited |
| TURN relay (Azure cloud) | UDP to 51.5.0.0/16 on 3478 | |
| TURN relay (Azure Government) | UDP to 20.140.236.0/22 on 3478 | |

Allow outbound UDP from session hosts to the internet. Learn says symmetric NAT such as Azure Firewall or NAT Gateway forces relayed TURN connections, and that Teredo or IPv6 improve success but are not required.

## Enable for managed networks (Intune)

1. In the Intune admin center, create or edit a **Settings catalog** profile for Windows 10 and later.
2. Browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.
3. Select **Enable RDP Shortpath for managed networks** and set the toggle to **Enabled**.
4. Assign the profile to the session hosts and create it.
5. Allow the listener port through Windows Firewall and any other firewall, for example with an Intune firewall policy.
6. Restart the session hosts after the policy applies.

Clients need direct connectivity on port 3390 with no blocking by firewalls or a network security group. The page has a Group Policy tab but I could not read its setting names, so check Learn for those.

## Enable for public networks

No listener is required. Under **Azure Virtual Desktop** > **RDP Shortpath** in the same policy tree, Learn lists:

- **RDP Shortpath for managed networks using NAT traversal**
- **RDP Shortpath for public networks using NAT traversal** (STUN)
- **RDP Shortpath for public networks using Relay (TURN)**

Set each to **Enabled** or **Not Configured** to allow it, or **Disabled** to block it. Microsoft strongly recommends keeping TURN enabled. You can optionally limit the port range with **Use port range for RDP Shortpath for unmanaged networks**, with **Port pool size (Device)** default 1000 and **UDP base port (Device)** default 38300.

## Host pool setting

In the Azure portal, go to **Host pools**, select the pool, then **Settings** > **Networking** > **RDP Shortpath**. Set each drop-down, where **Default** equals **Enabled**, and select **Save**. The most restrictive setting between host pool and session host applies.

## UDP must not be blocked

On session hosts, under **Remote Desktop Session Host** > **Connections**, set **Select RDP transport protocols** to **Not configured**, or to **Enabled** with **Select Transport Type** set to **Use both UDP and TCP**. On client devices, make sure **Turn Off UDP On Client** is **Not configured** or **Disabled**.

## Verify

Connect, select the signal strength icon in the **Connection** toolbar, and read the transport. **UDP (Private Network)** is managed direct, **UDP** is STUN, **UDP (Relay)** is TURN.

## Limitations from Learn

- If UDP is blocked, the session falls back to TCP.
- TURN relays are picked by client location, so distant clients may fall back to TCP, and relay updates can drop the connection for a few seconds.
- Avoid force tunneling, double NAT or carrier-grade NAT, cloud packet inspection and TCP-based VPNs.
- Session host certificates are self-generated. CA-issued certificates are not supported.
- Security is the same as the TCP reverse connect transport.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/azure/virtual-desktop/rdp-shortpath)
- [Configure RDP Shortpath](https://learn.microsoft.com/azure/virtual-desktop/configure-rdp-shortpath)
