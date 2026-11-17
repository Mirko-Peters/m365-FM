---
title: "Securing the Azure Virtual Desktop control plane with Private Link"
summary: "Private Link for Azure Virtual Desktop puts private endpoints in your virtual network so that feed discovery, feed download and session traffic can use private routes instead of public ones. This guide compares the four scenarios Microsoft documents, walks through the setup steps and covers DNS, public access settings and the RDP Shortpath opt-in."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, azure-private-link]
keypoints:
  - "Learn describes three private workflows: initial feed discovery (workspace sub-resource global, one per deployment), feed download (workspace sub-resource feed, one per workspace) and connections to a host pool (host pool sub-resource connection, one per host pool)."
  - "Four scenarios are documented: full private, private with public discovery, private sessions only and no Private Link. Each needs a different set of endpoints."
  - "The global workspace cannot be access-controlled. Learn says it is always reachable from public routes, even if you set it to private-only."
  - "Two private DNS zones are involved: privatelink-global.wvd.microsoft.com for the global endpoint and privatelink.wvd.microsoft.com for feed and connection endpoints. Sharing one zone between them is no longer supported."
  - "UDP traffic such as RDP Shortpath for managed networks is blocked over Private Link until you opt in on the Networking page. Learn says public network Shortpath (STUN/TURN) is not supported with Private Link and names RDP Shortpath for managed networks and RDP Shortpath for managed networks (STUN) as the options to use. The portal requires the public STUN and TURN options to be off."
faq:
  - q: "Is Private Link for Azure Virtual Desktop generally available?"
    a: "Microsoft Learn's What's new page lists Private Link with Azure Virtual Desktop as generally available in its July 2023 entry. The setup page says the Private Link PowerShell cmdlets need the preview version of the Az.DesktopVirtualization module, added in version 5.0.0, so check that page for the current module version."
  - q: "Do I need a private endpoint for every part of the service?"
    a: "No. Learn lists a sessions-only scenario that needs only the host pool connection endpoints, and a scenario without the global endpoint where initial feed discovery stays public. Only the full private scenario needs global, feed and connection endpoints."
  - q: "Does Private Link work with RDP Shortpath?"
    a: "Yes for the managed-network variants, and only with an opt-in. Learn says UDP over Private Link is blocked unless you select Allow Direct UDP network path over Private Link on the Networking page, and it names RDP Shortpath for managed networks and RDP Shortpath for managed networks (STUN) as the options to use. Public network Shortpath (STUN/TURN) is not supported with Private Link, and the portal will not save the setting while the public STUN and TURN options are on. The opt-in alone does not enable Shortpath; the managed-network variant must be configured separately."
---

Private Link lets you reach Azure Virtual Desktop through private endpoints in your own virtual network, so the traffic between that network and the service stays on the Microsoft network. How much of the service you move onto private routes is your choice: Microsoft Learn documents four scenarios, from fully private to sessions-only. This article compares them, lists the setup steps and covers the DNS and access settings that decide whether users can connect. In this article "control plane" means the three parts Learn describes as separate workflows: initial feed discovery, feed download and connections to host pools. Learn's Private Link overview does not use the term itself.

## What Private Link changes

Without Private Link, clients and [session hosts](/entity/avd-session-host/) reach the service over public routes. With [Private Link](/entity/azure-private-link/), you create [private endpoints](/entity/azure-private-endpoint/) in a [virtual network](/entity/azure-virtual-network/) and traffic to the service uses those endpoints. Learn says users connect to the virtual network with a VPN or ExpressRoute and use the Remote Desktop client. See [Azure Virtual Desktop](/entity/azure-virtual-desktop/) for the service itself.

Learn names three workflows, each tied to a resource type and a sub-resource:

| Workflow | Resource | Sub-resource | How many endpoints |
|---|---|---|---|
| Initial feed discovery | Workspace | global | One for the whole Azure Virtual Desktop deployment |
| Feed download | Workspace | feed | One per workspace |
| Connections to host pools | Host pool | connection | One per host pool |

## The four scenarios compared

| Scenario | Private routes | Public routes | Endpoints needed |
|---|---|---|---|
| 1. Full private | Discovery, feed download, sessions | Global workspace stays reachable | global, feed, connection |
| 2. Private, public discovery | Feed download, sessions | Initial feed discovery | feed, connection |
| 3. Private sessions only | Sessions | Discovery and feed download | connection |
| 4. No Private Link | None | All | None |

Scenario 3 is the smallest change. It adds one endpoint per [host pool](/entity/avd-host-pool/) and leaves the feed public. Scenario 1 adds the most endpoints and the global endpoint, with the limits described below. Learn gives no recommendation between them. The choice depends on what your security requirements say must not use public routes.

## The global endpoint needs care

The global endpoint creates DNS entries and private IP routes for the global FQDN and becomes a single shared route for all clients. Learn says the following:

- Learn recommends a separate workspace used only for this purpose, with no application groups registered. Deleting it stops all feed discovery.
- You cannot control access to this workspace. If you set it to private-only, the setting is ignored and it is always reachable from public routes.
- Learn says one global endpoint serves the whole deployment. Our reading: treat it as shared infrastructure rather than something to create per project.

## DNS: two zones and a fixed query sequence

Private Link works only when names resolve to the private IPs. Learn lists two private DNS zones:

- `privatelink-global.wvd.microsoft.com` for the global sub-resource.
- `privatelink.wvd.microsoft.com` for workspace feed and host pool connection endpoints.

Learn says that, starting 1 September 2023, sharing the `privatelink.wvd.microsoft.com` zone between the global endpoint and other endpoints is no longer supported. If you built an early preview configuration that way, create a new global endpoint with the global zone.

The client sequence for a private-only connection is, in short: the device queries `rdweb.wvd.microsoft.com` and the global zone returns a private IP for initial discovery; a query for `<workspaceId>.privatelink.wvd.microsoft.com` returns the private IP for feed download over TCP 443; the connection then queries `<hostpoolId>.afdfp-rdgateway.wvd.microsoft.com`, which the `privatelink.wvd.microsoft.com` zone resolves to the gateway's private IP, also over TCP 443. Session traffic then uses a port in the TCP dynamic range of 1 to 65535.

For clients outside Azure, the Private Link DNS integration page adds three rules: a DNS forwarder should be deployed in the virtual network that is linked to the private DNS zone, the forwarder forwards to Azure DNS at 168.63.129.16, and the conditional forwarder on-premises must use the public zone name, not the `privatelink` name. The Azure Virtual Desktop values are on Learn's "Azure Private Endpoint private DNS zone values" page: the public forwarder is `wvd.microsoft.com`, and the private zones are `privatelink-global.wvd.microsoft.com` for the global sub-resource and `privatelink.wvd.microsoft.com` for feed and connection. In Azure Government the public forwarder is `wvd.azure.us`, with the zones `privatelink-global.wvd.azure.us` (global) and `privatelink.wvd.azure.us` (feed and connection). In Azure China the forwarder is `wvd.azure.cn`, with `privatelink-global.wvd.azure.cn` and `privatelink.wvd.azure.cn`. Peered or hub-and-spoke networks need links from the zone to every network that has clients, and Learn warns against putting records for several services in one zone. See also [Azure private DNS zone](/entity/azure-private-dns-zone/). A separate article in this series covers DNS basics for the service.

## Setup steps

Learn's prerequisites are an existing host pool with session hosts, an application group and a workspace; a virtual network and a subnet for the endpoints; the Azure role-based access control permissions to create private endpoints; and a supported client app. The setup page also has PowerShell and CLI procedures.

1. **Register the resource provider on each subscription.** In the Azure portal open **Subscriptions**, select the subscription, then **Settings**, **Resource providers**, select **Microsoft.DesktopVirtualization** and choose **Re-register**. Confirm the status is **Registered**.
2. **Plan the address space.** Learn says IP allocations can grow over time, because additional addresses are needed for private endpoints during capacity expansions. Use a subnet with headroom.
3. **Create the host pool endpoints.** Open **Host pools**, select the pool, then **Networking**, **Private endpoint connections**, **New private endpoint**. Set **Target sub-resource** to **connection**. The region must match the virtual network and session hosts. Use private DNS integration with `privatelink.wvd.microsoft.com`. Repeat per host pool.
4. **Create the feed endpoint** on each workspace the same way, with **Target sub-resource** set to **feed**.
5. **Create the global endpoint** only for scenario 1, on the dedicated placeholder workspace, with **Target sub-resource** set to **global** and the zone `privatelink-global.wvd.microsoft.com`.
6. **Set public access.** On a workspace, open **Networking**, **Public access**, then choose to enable public access from all networks or to disable it and use private access. On a host pool, there is a third choice: enable public access for end users and use private access for session hosts. Learn says these settings cannot be configured in Azure CLI.
7. **Restart the agent.** After a change to a host pool's private endpoint or network configuration, restart the **Remote Desktop Agent Loader** (`RDAgentBootLoader`) service on every session host, or restart the hosts. Changing session host access does not affect existing sessions.
8. **Verify.** Each endpoint's connection state should read **Approved**, each session host should show **Available**, and a test user should subscribe to the workspaces and connect.

## What the public access settings do

For host pools, the combination of client route and session host route decides whether a session is allowed. With public access enabled from all networks, a session is allowed if either side uses a public or private route. With public access disabled, a session is allowed only if both client and session host use private routes. In the mixed setting, public for client networks and private for session hosts, Learn says the session host's route decides: denied if it is public, allowed if it is private, whatever the client route.

For workspaces other than the global one, disabling public access means feed requests from public routes are denied and private routes are allowed.

To also block public routes in the network, Learn suggests a network security group or Azure Firewall with the **WindowsVirtualDesktop** service tag. It warns not to block traffic between the endpoints and addresses in the required URL list, and not to restrict ports to the host pool connection endpoint, because the full TCP range 1 to 65535 must be allowed.

## RDP Shortpath over Private Link

UDP-based transports are blocked over Private Link unless you opt in. On the host pool, open **Networking**, **Public access**, choose either "enable public access for end users, use private access for session hosts" or "disable public access and use private access", select **Allow Direct UDP network path over Private Link**, then turn off [RDP Shortpath](/entity/rdp-shortpath/) for public networks via STUN and via TURN on the **RDP Shortpath** tab. The portal blocks saving with a configuration error while either is on.

The scope is narrow. The setup page says public network Shortpath (STUN/TURN) is not supported with Private Link and tells you to use RDP Shortpath for managed networks or RDP Shortpath for managed networks (STUN). The RDP Shortpath page describes the managed-network case as a direct UDP connection, either through a listener and an inbound port on each session host or, in the STUN variant, without inbound ports. The February 2025 What's new entry, written for the preview, says that "all other RDP Shortpath options using STUN or TURN" are not supported, so check the setup page for the current list. What's new lists RDP Shortpath (UDP) over Private Link as generally available in February 2026, with explicit opt-in. Connections without the opt-in continue over WebSocket (TCP). The opt-in alone does not finish the setup: the Tech Community announcement of 17 February 2026 says you must still configure the required Shortpath settings on your session hosts and network, and that opting in for UDP does not automatically complete the end-to-end Shortpath setup. The RDP Shortpath page describes the managed-network variant: you enable a UDP listener on the session hosts, port 3390 by default, and allow an inbound port on each session host, or you use the STUN variant. The article "How to configure RDP Shortpath for managed and public networks" in this series covers that.

## Limits and status

- **Status.** Learn's What's new shows Private Link in preview in November 2022 and lists it as generally available in its July 2023 entry. The setup page says the PowerShell cmdlets need the preview version of the Az.DesktopVirtualization module, added in version 5.0.0.
- **Clients.** The overview says all Remote Desktop clients can be used with Private Link. The setup page requires version 1.2.4066 or later of the Remote Desktop client for Windows and also names the Windows App on macOS and iOS/iPadOS. A Tech Community post says the Remote Desktop client for Windows reached end of support on 27 March 2026. Learn's Windows App comparison (updated 12 November 2026) marks Private Link as supported on Windows, macOS, iOS/iPadOS and Android/Chrome OS, but not in the web browser or on Meta Quest. That differs from the overview's "all clients" wording, so check your user devices before you close the public routes. The overview adds that a Windows client without internet access, subscribed to both public and private feeds, cannot reach the feed.
- **Regions and cost.** The Private Link overview page lists no supported regions and no prices. The Tech Community announcement, published on 14 July 2023 and updated on 28 July 2023, states: "As of July 28, 2023, Private Link for Azure Virtual Desktop is generally available in Azure Government." Check Azure's current pricing for private endpoints before you plan many of them.

## Sources

Accessed 17 November 2026.

- [Microsoft Tech Community: Announcing the General Availability of Private Link for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-the-general-availability-of-private-link-for-azure/3874429)
- [Microsoft Learn: Azure Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-overview)
- [Microsoft Learn: Set up Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-setup)
- [Microsoft Learn: Azure Private Endpoint DNS integration](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns-integration)
- [Microsoft Learn: Azure Private Endpoint private DNS zone values](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: RDP Shortpath](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Tech Community: RDP Shortpath (UDP) over Private Link is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/rdp-shortpath-udp-over-private-link-is-now-generally-available/4494644)
- [Microsoft Learn: Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features)
- [Tech Community: Prepare for the Remote Desktop client for Windows end of support](https://techcommunity.microsoft.com/blog/windows-itpro-blog/prepare-for-the-remote-desktop-client-for-windows-end-of-support/4397724)
