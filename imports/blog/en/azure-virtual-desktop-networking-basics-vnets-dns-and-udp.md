---
title: "Azure Virtual Desktop networking basics: vNets, DNS and UDP"
summary: "Azure Virtual Desktop needs a virtual network and subnet in the session hosts' region, working DNS, and outbound access on TCP 443 to a published list of endpoints, with no inbound ports. UDP through RDP Shortpath is an optional second transport that falls back to TCP when it is blocked."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, rdp-shortpath]
keypoints:
  - "Azure Virtual Desktop uses reverse connect: session hosts and clients make outbound TLS connections to the service, so you do not open inbound ports. Learn advises against opening 3389 and against public IP addresses on session hosts."
  - "The virtual network must be in the same region as the session hosts and must reach the domain controllers and DNS servers when you use AD DS or Microsoft Entra Domain Services."
  - "168.63.129.16 is the Azure DNS address and an Azure platform endpoint. Learn says traffic to it must not be intercepted, proxied or redirected, and port 53 is needed there only with Azure-provided DNS."
  - "TCP 443 to the required FQDNs is the default transport. RDP Shortpath adds UDP: port 3390 for the listener on managed networks, UDP 1024 to 65535 (default 49152 to 65535) for direct STUN connections on public networks and UDP 3478 for the TURN relay. It falls back to TCP if UDP is blocked."
  - "In new virtual networks created with API versions released after 31 March 2026, subnets are private by default. Session hosts there need an explicit outbound method, such as a NAT gateway, to reach the required endpoints."
faq:
  - q: "Do I need to open inbound ports for Azure Virtual Desktop?"
    a: "No. Microsoft Learn says the service uses a reverse connection, so no inbound ports are needed. It recommends not opening inbound port 3389 on session hosts and not assigning them public IP addresses. If you must open 3389 for troubleshooting, Learn recommends just-in-time VM access."
  - q: "Is UDP required for Azure Virtual Desktop?"
    a: "No. TCP on port 443 is the default. RDP Shortpath adds a UDP-based transport, and if a firewall blocks UDP, Learn says the connection falls back to the TCP-based reverse connect transport."
  - q: "Which DNS servers should session hosts use?"
    a: "That depends on your identity setup. For AD DS or Microsoft Entra Domain Services, the virtual network must reach the domain controllers and relevant DNS servers. Azure-provided DNS, a custom DNS server that forwards to 168.63.129.16, Private DNS zones and DNS Private Resolver are the four name resolution methods Learn lists for virtual networks."
---

Azure Virtual Desktop needs three network basics: a virtual network and subnet in the same Azure region as the session hosts, DNS that resolves both your domain and Azure names, and outbound access on TCP 443 to a published list of Microsoft endpoints. No inbound port is needed. UDP through RDP Shortpath is optional and falls back to TCP when it is blocked. This article explains each part in the order a connection uses them. Private Link and the Shortpath configuration steps have their own articles in this series. Sources are listed at the end and were retrieved on 17 November 2026.

## How a connection reaches a session host

Learn's [network connectivity article](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity) says Azure Virtual Desktop uses reverse connect transport. Unlike an on-premises Remote Desktop Services deployment, there is no TCP listener on the session host waiting for RDP connections. Both sides connect outbound over HTTPS:

- At startup, the Remote Desktop Agent Loader service on the session host opens a persistent communication channel to the Azure Virtual Desktop broker, layered on a TLS connection.
- When a user selects a resource, the client opens a TLS connection to a gateway instance. For public cloud connections, Learn says gateway latencies are evaluated, the gateways are grouped in 10 ms steps, and the one with the lowest latency and then the lowest number of existing connections is chosen.
- The session host connects to the same gateway, and the gateway relays data between both endpoints. This is the base transport for RDP.

For all connections from clients and session hosts to the service infrastructure, TLS 1.2 is the minimum and TLS 1.3 can be used if the client operating system supports it. TLS 1.3 is supported starting in Windows 11 (21H2) and in Windows Server 2022. For the nested TLS connection between client and session host, which uses the session host's certificates, Learn says the mutually agreed TLS version supported and enabled on both sides is used, up to TLS 1.3.

## The virtual network and subnet

The [prerequisites article](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) lists the network requirements:

1. A virtual network and subnet for the session hosts. If you create session hosts together with the host pool, the virtual network must exist beforehand to appear in the list, and it must be in the same Azure region as the session host.
2. Connectivity from this virtual network to your domain controllers and relevant DNS servers if you use AD DS or Microsoft Entra Domain Services, because session hosts must join the domain.
3. Session hosts and users must reach the service on TCP 443 to the required URL list, and these URLs must not be blocked by filtering or a firewall. If users need Microsoft 365, the session hosts must also reach the Microsoft 365 endpoints.

Learn also advises that session hosts reach the other networks where users' applications and data live, that the round-trip time from the client network to the Azure region of the host pools stays below 150 ms, and that you create session hosts in the region closest to users. Azure Firewall can filter outbound traffic. Learn recommends not opening inbound port 3389 and not assigning public IP addresses to session hosts, and suggests just-in-time VM access if you must open 3389 for troubleshooting.

The subnet and the virtual network design (address space, peering) are not prescribed by these pages, so this article does not either. For hub-and-spoke designs, the Azure Firewall guidance is covered under outbound endpoints below. See [Azure Virtual Network](/entity/azure-virtual-network/) for the product itself.

## Outbound internet access in a new virtual network

The required endpoints are public addresses, so a session host needs a working outbound path to them. Learn's [default outbound access article](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access) says that for the API version released after 31 March 2026, subnets in new virtual networks have `defaultOutboundAccess` set to `false`. Virtual machines in these private subnets cannot rely on default outbound access and need an explicit outbound method to reach public endpoints. The Azure portal already defaults to private subnets, and deployments using earlier API versions keep the earlier default. Existing virtual networks are not changed unless their subnets are explicitly made private.

Learn lists four explicit methods:

- Associate a NAT gateway with the subnet, which Learn calls the recommended method for most scenarios.
- Associate a standard load balancer configured with outbound rules.
- Associate a standard public IP with a network interface of the VM. Note that this conflicts with Learn's advice above to avoid public IP addresses on session hosts, so weigh it against that advice.
- Add a firewall or network virtual appliance and point traffic to it with a user-defined route.

The same article says Windows activation and Windows updates do not work in a private subnet without an explicit method of egress. Activation uses `azkms.core.windows.net` on TCP 1688, which appears in the endpoint table below.

## DNS

Learn's [name resolution article](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances) lists four methods for resources in a virtual network: Azure Private DNS zones, Azure-provided name resolution, your own DNS server, which can forward queries to Azure, and Azure DNS Private Resolver. Points that matter for session hosts:

- The Azure DNS address is 168.63.129.16, a static address that does not change. A DNS server inside the network, such as a domain controller running in Azure, can answer its own domains and forward other queries to that address.
- After you change DNS settings on a deployed virtual network or VM, renew the DHCP lease on the affected VMs. For Windows, Learn gives `ipconfig /renew`. Learn also says not to edit DNS server IPs inside a VM, because service healing can erase them.
- If Azure VPN Gateway is used with custom DNS server IPs on a virtual network, the address 168.63.129.16 must be in the list to keep service uninterrupted.

The [required endpoints article](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint) adds a rule specific to Azure Virtual Desktop. Session host VMs need two Azure platform addresses: 169.254.169.254 (instance metadata, TCP 80) and 168.63.129.16 (ports 80 and 32526 on TCP, port 53 on TCP and UDP). Learn says traffic to these addresses must not be intercepted, proxied or redirected, because that causes provisioning failures, health monitoring problems and connection problems. Port 53 for that address is needed only with Azure-provided DNS. With custom DNS, queries go to your servers, and you must make sure the session hosts can reach them within the virtual network.

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

The full list is longer and also includes certificate endpoints on TCP 80, so use the page as the reference, because Learn can change it. Learn says you must use the wildcard for FQDNs involving service traffic, and that Microsoft does not support deployments where the listed FQDNs are blocked. It offers no IP address range to allow in place of FQDNs, and recommends service tags and FQDN tags to simplify the configuration. The Azure Virtual Desktop service tag and FQDN tag are both named `WindowsVirtualDesktop`. Service tags work in network security group rules, Azure Firewall rules and user-defined routes. The Azure Virtual Desktop Agent URL Tool checks from a session host whether each endpoint is reachable.

For Azure Firewall, Learn's [firewall guidance](https://learn.microsoft.com/en-us/azure/firewall/protect-azure-virtual-desktop) says the firewall uses the FQDN tag `WindowsVirtualDesktop` to simplify the configuration. It also warns that disconnections can occur during Azure Firewall scale-ins if you route all traffic to the firewall with a default route. For hub-and-spoke designs, Learn's remedy is a route in the route table of the Azure Virtual Desktop subnet with destination type Service tag, destination service `WindowsVirtualDesktop` and next hop Internet, so that the gateway and broker are reached directly.

## UDP and RDP Shortpath

Learn's [RDP Shortpath article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath) describes the order: RDP begins with the TCP-based reverse connect transport and then tries to establish the session over UDP. If UDP succeeds, the TCP connection drops. Otherwise TCP remains the fallback.

| Mode | Where it applies | Ports and notes |
|---|---|---|
| Managed networks, listener variant | Private connection such as ExpressRoute or a site-to-site VPN | UDP listener on the session host, default port 3390, with an inbound port allowed on each session host |
| Managed networks, STUN variant | Same private connections | Direct UDP through STUN, with no inbound port required on the session host |
| Public networks, direct | STUN between client and session host | UDP 1024 to 65535, default range 49152 to 65535 |
| Public networks, relayed | TURN | UDP 3478 to `51.5.0.0/16` in the Azure cloud |

Public network Shortpath via STUN and TURN is generally available in the Azure cloud, according to the page. For public networks, Learn recommends avoiding force tunneling if users reach Azure Virtual Desktop over the internet, making sure there is no double NAT or carrier-grade NAT, avoiding cloud packet-inspection services and enabling IPv6 connectivity or Teredo. It also recommends avoiding TCP-based VPN solutions, which add TCP congestion control overhead and slow RDP. If a firewall blocks UDP, Shortpath fails and the connection continues over TCP. The [RDP Shortpath](/entity/rdp-shortpath/) entity page and the sibling articles on configuration cover the settings.

## Bandwidth and latency

Learn's [bandwidth article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-bandwidth) gives graphics estimates for a single 1920x1080 monitor in default mode: idle 0.3 Kbps, Microsoft Word 100 to 150 Kbps, web browsing 6 to 6.5 Mbps and video playback 8.5 to 9.5 Mbps. It says that only changed screen areas are sent, and it states that throttling and rate-limiting are not supported for reverse connect transport, so QoS for bandwidth limits needs RDP Shortpath for managed networks. For quality, the [connection latency article](https://learn.microsoft.com/en-us/azure/virtual-desktop/connection-latency) rates the end-to-end delay per frame as good below 150 ms, okay from 150 to 300 ms and bad above 300 ms. This is a different measurement from the round-trip time below 150 ms in the prerequisites, so do not compare the two numbers directly.

## A short network checklist

1. Create the virtual network and subnet in the same region as the session hosts.
2. If you use AD DS or Microsoft Entra Domain Services, confirm the network reaches the domain controllers and DNS servers.
3. Decide on DNS: Azure-provided or custom, and if custom, forwarding to 168.63.129.16.
4. Give the subnet an explicit outbound method, such as a NAT gateway, if the virtual network is new and its subnet is private.
5. Allow outbound TCP 443 to the required endpoints, then run the Agent URL Tool on a session host.
6. Do not intercept 168.63.129.16 or 169.254.169.254.
7. Keep inbound 3389 closed and give session hosts no public IP addresses.
8. Decide whether to enable UDP with RDP Shortpath, and test the fallback to TCP.
9. Measure round-trip time from your user locations to the chosen region.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Understanding Azure Virtual Desktop network connectivity](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Name resolution for resources in Azure virtual networks](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances)
- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Understanding RDP bandwidth requirements for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-bandwidth)
- [Microsoft Learn: Connection latency in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/connection-latency)
- [Microsoft Learn: Default outbound access for VMs in Azure](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access)
- [Microsoft Learn: Use Azure Firewall to protect Azure Virtual Desktop deployments](https://learn.microsoft.com/en-us/azure/firewall/protect-azure-virtual-desktop)
