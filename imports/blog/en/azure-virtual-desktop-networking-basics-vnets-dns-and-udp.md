---
title: "Azure Virtual Desktop networking basics: vNets, DNS and UDP"
summary: "Azure Virtual Desktop needs a virtual network and subnet in the session hosts' region, working DNS, and outbound access to a published list of endpoints, mostly on TCP 443. The default transport needs no inbound ports. UDP through RDP Shortpath is a second transport that falls back to TCP when it is blocked."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, rdp-shortpath]
keypoints:
  - "Azure Virtual Desktop uses reverse connect: session hosts and clients make outbound TLS connections to the service, so the default transport needs no inbound ports. Only the optional managed-network Shortpath listener uses an inbound UDP port. Learn advises against opening 3389 and against public IP addresses on session hosts."
  - "The virtual network must be in the same region as the session hosts and must reach the domain controllers and DNS servers when you use AD DS or Microsoft Entra Domain Services."
  - "168.63.129.16 is the Azure DNS address and an Azure platform endpoint. Learn says traffic to it must not be intercepted, proxied or redirected, and port 53 is needed there only with Azure-provided DNS."
  - "TCP 443 to the required FQDNs is the default transport. RDP Shortpath adds UDP: port 3390 for the listener on managed networks, UDP 1024 to 65535 (default 49152 to 65535) for direct STUN connections on public networks and UDP 3478 for STUN queries and the TURN relay. It falls back to TCP if UDP is blocked."
  - "In new virtual networks created with API versions released after 31 March 2026, subnets are private by default. Session hosts there need an explicit outbound method, such as a NAT gateway, to reach the required endpoints."
faq:
  - q: "Do I need to open inbound ports for Azure Virtual Desktop?"
    a: "Not for the default transport. Microsoft Learn says the service uses a reverse connection, so no inbound ports are needed. The exception is the optional RDP Shortpath listener for managed networks, which needs an inbound UDP port on each session host. Learn recommends not opening inbound port 3389 or assigning public IP addresses to session hosts, and suggests just-in-time VM access if you must open 3389."
  - q: "Is UDP required for Azure Virtual Desktop?"
    a: "No. TCP on port 443 is the default. RDP Shortpath adds a UDP-based transport. For public networks it works without extra configuration when firewalls allow UDP; the managed-network listener variant needs the listener enabled. If a firewall blocks UDP, Learn says the connection falls back to TCP."
  - q: "Which DNS servers should session hosts use?"
    a: "That depends on your identity setup. For AD DS or Microsoft Entra Domain Services, the virtual network must reach the domain controllers and relevant DNS servers. Learn lists four name resolution methods for virtual networks: Azure Private DNS zones (called the preferred solution), Azure-provided DNS, your own DNS server and DNS Private Resolver. A DNS server in the network, such as a domain controller running in Azure, can answer its own domains and forward all other queries to 168.63.129.16."
---

Azure Virtual Desktop needs three network basics: a virtual network and subnet in the same Azure region as the session hosts, DNS that resolves both your domain and Azure names, and outbound access to a published list of Microsoft endpoints, mostly on TCP 443. The default transport needs no inbound port. UDP through RDP Shortpath is added when the network allows it and falls back to TCP when it is blocked. Private Link and the Shortpath configuration steps have their own articles in this series.

## How a connection reaches a session host

Learn's [network connectivity article](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity) says Azure Virtual Desktop uses reverse connect transport. Unlike on-premises Remote Desktop Services, no TCP listener on the session host waits for RDP connections. Both sides connect outbound over HTTPS:

- At startup, the Remote Desktop Agent Loader service on the session host opens a persistent TLS channel to the Azure Virtual Desktop broker.
- When a user selects a resource, the client opens a TLS connection to a gateway instance. For public cloud connections, gateways are grouped in 10 ms latency steps, and the one with the lowest latency and then the fewest existing connections is chosen.
- The session host connects to the same gateway, and the gateway relays data between both endpoints. This is the base transport for RDP.

For all connections that clients and session hosts start to the service infrastructure, TLS 1.2 is the minimum and TLS 1.3 can be used if the client operating system supports it. Inside the relayed path, RDP sets up a nested TLS connection between client and session host. It uses the mutually agreed TLS version, up to TLS 1.3, which Learn says is supported starting in Windows 11 21H2 and Windows Server 2022.

## The virtual network and subnet

The [prerequisites article](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) lists the network requirements:

1. A virtual network and subnet for the session hosts. If you create session hosts together with the host pool, the virtual network must exist beforehand to appear in the list, and it must be in the same Azure region as the session host.
2. Connectivity from this virtual network to your domain controllers and relevant DNS servers if you use AD DS or Microsoft Entra Domain Services, because session hosts must join the domain.
3. Session hosts and users must reach the service on TCP 443 to the required URL list, and these URLs must not be blocked by filtering or a firewall. If users need Microsoft 365, the session hosts must also reach the Microsoft 365 endpoints.

Learn also advises that the round-trip time from the client network to the Azure region of the host pools stays below 150 ms and that you create session hosts in the region closest to users. It recommends not opening inbound port 3389 and not assigning public IP addresses to session hosts, and suggests just-in-time VM access if you must open 3389.

DNS servers are set on the virtual network, or on a network interface, where they take precedence. If you choose custom DNS servers for the virtual network, specify at least one IP address, otherwise the virtual network ignores the setting and uses Azure-provided DNS. For hub-and-spoke designs, see the Azure Firewall guidance under outbound endpoints below, and [Azure Virtual Network](/entity/azure-virtual-network/) for the product itself.

## Outbound internet access in a new virtual network

The required endpoints are public addresses, so a session host needs an outbound path to them. Learn's [default outbound access article](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access) says that for the API version released after 31 March 2026, subnets in new virtual networks have `defaultOutboundAccess` set to `false`. Virtual machines in these private subnets need an explicit outbound method to reach public endpoints. The Azure portal already defaults to private subnets, and deployments using earlier API versions and existing virtual networks keep the earlier default.

Learn lists four explicit methods:

- Associate a NAT gateway with the subnet, which Learn calls the recommended method for most scenarios.
- Associate a standard load balancer configured with outbound rules.
- Associate a standard public IP with a network interface of the VM. This is at odds with Learn's advice to avoid public IP addresses on session hosts.
- Add a firewall or network virtual appliance and point traffic to it with a user-defined route.

Windows activation and Windows updates do not work in a private subnet without an explicit method of egress.

## DNS

Learn's [name resolution article](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances) lists four methods: Azure Private DNS zones, which it calls the preferred solution, Azure-provided name resolution, your own DNS server, and Azure DNS Private Resolver. For session hosts:

- The Azure DNS address is 168.63.129.16, a static address that does not change. A DNS server inside the network, such as a domain controller running in Azure, can answer its own domains and forward other queries to that address.
- After you change DNS settings on a deployed virtual network or VM, renew the DHCP lease on the affected VMs (`ipconfig /renew` on Windows). Do not edit DNS server IPs inside a VM, because service healing can erase them.

The [required endpoints article](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint) adds a rule specific to Azure Virtual Desktop. Session host VMs need two Azure platform addresses: 169.254.169.254 (instance metadata, TCP 80) and 168.63.129.16 (ports 80 and 32526 on TCP, port 53 on TCP and UDP). Learn says traffic to these addresses must not be intercepted, proxied or redirected. Port 53 there is needed only with Azure-provided DNS; with custom DNS, make sure the session hosts can reach your servers.

## Outbound endpoints

All entries on the required endpoints page are outbound. A selection for session hosts in the Azure cloud:

| Address | Protocol and port | Purpose |
|---|---|---|
| `login.microsoftonline.com` | TCP 443 | Authentication to Microsoft Online Services |
| `*.wvd.microsoft.com` | TCP 443 | Service traffic, including TCP-based RDP connectivity |
| `51.5.0.0/16` | UDP 3478 | Relayed RDP connectivity |
| `azkms.core.windows.net` | TCP 1688 | Windows activation |
| `mrsglobalsteus2prod.blob.core.windows.net` | TCP 443 | Agent and side-by-side stack updates |
| `*.service.windows.cloud.microsoft` | TCP 443 | Service traffic |

The full list is longer and also includes certificate endpoints on TCP 80, so use the page as the reference. Learn says you must use the wildcard for FQDNs involving service traffic, and that deployments where the listed FQDNs are blocked are not supported. It offers no IP address range in place of FQDNs and recommends service tags and FQDN tags; both are named `WindowsVirtualDesktop`. The Agent URL Tool checks from a session host whether each endpoint is reachable.

For Azure Firewall, Learn's [firewall guidance](https://learn.microsoft.com/en-us/azure/firewall/protect-azure-virtual-desktop) uses the FQDN tag `WindowsVirtualDesktop` and warns that disconnections can occur during Azure Firewall scale-ins if you route all traffic to the firewall with a default route. For hub-and-spoke designs, Learn's remedy is a route in the subnet's route table with destination type Service tag, destination service `WindowsVirtualDesktop` and next hop Internet, so that the gateway and broker are reached directly. In a private subnet, this route needs one more piece: Learn says routes with next hop type `Internet` break in a private subnet, and connections to the service tag destinations fail unless an explicit outbound method, such as a NAT gateway, is also configured for the source of the connection. Learn also says not to use TLS inspection.

## UDP and RDP Shortpath

Learn's [RDP Shortpath article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath) describes the order: RDP begins with the TCP-based reverse connect transport and then tries to establish the session over UDP. If UDP succeeds, the TCP connection drops. Otherwise TCP remains the fallback.

| Mode | Where it applies | Ports and notes |
|---|---|---|
| Managed networks, listener variant | Private connection such as ExpressRoute private peering or a site-to-site or point-to-site VPN (IPsec) | You must enable the UDP listener on the session host, default port 3390, with an inbound port allowed on each session host |
| Managed networks, STUN variant | Same private connections | Direct UDP through STUN, with no inbound port required on the session host |
| Public networks, direct | STUN between client and session host | Outbound from the session host subnet on UDP 1024 to 65535, default range 49152 to 65535 (Learn excludes port 65330, which Azure reserves); the session host's STUN query uses UDP 3478 |
| Public networks, relayed | TURN | UDP 3478 to `51.5.0.0/16` in the Azure cloud; Learn's firewall table calls this rule STUN/TURN relay |

Public network Shortpath via STUN and TURN is generally available in the Azure cloud, according to the page. It works without extra configuration when networks and firewalls allow the traffic and the RDP transport settings are at their defaults, so for public networks the decision is whether UDP may pass your firewalls. Only the managed-network listener variant requires you to enable a listener. If both modes are available, the connection that is established first is used. Learn recommends avoiding force tunneling, double or carrier-grade NAT, cloud packet-inspection services and TCP-based VPNs, and enabling IPv6 connectivity or Teredo. If a firewall blocks UDP, Shortpath fails and the connection continues over TCP. Learn also says the TURN relay is chosen by the physical location of the client and is available only in a list of Azure regions, and that a client far from a relay might fall back from UDP to TCP. See [RDP Shortpath](/entity/rdp-shortpath/) for the settings.

## Bandwidth and latency

Learn's [bandwidth article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-bandwidth) estimates graphics for a single 1920x1080 monitor in default mode: idle 0.3 Kbps, Microsoft Word 100 to 150 Kbps, web browsing 6 to 6.5 Mbps and video playback 8.5 to 9.5 Mbps. Throttle rate-limiting is not supported for reverse connect transport, so bandwidth limits need managed-network Shortpath. Learn's [connection quality article](https://learn.microsoft.com/en-us/azure/virtual-desktop/connection-latency) describes the `ConnectionGraphicsData` table, which Learn labels preview. It rates end-to-end delay per frame as good below 150 ms, okay from 150 to 300 ms and bad above 300 ms, and records data only when a metric is okay or bad. This differs from the round-trip time below 150 ms in the prerequisites, so do not compare the two numbers.

## A short network checklist

1. Create the virtual network and subnet in the same region as the session hosts.
2. If you use AD DS or Microsoft Entra Domain Services, confirm the network reaches the domain controllers and DNS servers.
3. Decide on DNS: Azure-provided or custom, and if custom, forwarding to 168.63.129.16.
4. Give the subnet an explicit outbound method, such as a NAT gateway, if the virtual network is new and its subnet is private. This also applies when a route with next hop Internet bypasses the firewall.
5. Allow the outbound ports of the required endpoints list (mostly TCP 443, plus TCP 80 and 1688 and UDP 3478 for some entries), then run the Agent URL Tool on a session host.
6. Do not intercept 168.63.129.16 or 169.254.169.254.
7. Keep inbound 3389 closed and give session hosts no public IP addresses. Only the managed-network Shortpath listener needs an inbound UDP port.
8. Decide whether UDP may pass your firewalls (public-network Shortpath needs no setting) and whether to enable the managed-network listener, then test the fallback to TCP.
9. Measure round-trip time from user locations to the chosen region.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Understanding Azure Virtual Desktop network connectivity](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Name resolution for resources in Azure virtual networks](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances)
- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Remote Desktop Protocol bandwidth requirements Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-bandwidth)
- [Microsoft Learn: Analyze connection quality in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/connection-latency)
- [Microsoft Learn: Default outbound access for VMs in Azure](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access)
- [Microsoft Learn: Use Azure Firewall to protect Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/firewall/protect-azure-virtual-desktop)
