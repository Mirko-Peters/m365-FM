---
title: "Configure Dynamic Emergency Calling (E911) in Teams Phone: Subnets, Emergency Locations and Policies"
summary: "How dynamic emergency calling works in Microsoft Teams Phone: network settings, the Location Information Service and its match order, emergency addresses with geo codes, policy assignment, Direct Routing prerequisites, IPv6 matching pitfalls and testing, as documented on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [teams-phone, teams]
keypoints:
  - "The Location Information Service (LIS) matches a client in this order and uses the first match: wireless access point, Ethernet switch and port, Ethernet switch, then subnet."
  - "Emergency addresses assigned to network identifiers need geo codes for US routing. Teams checks Azure Maps and offers PIN drop when no match is found. Older addresses must be recreated."
  - "Direct Routing needs PIDF/LO enabled on the SBC and either an Emergency Routing Service provider (US and Canada) or an ELIN-based SBC setup."
  - "Learn warns that matching a network site does not prove the client got an emergency address. IPv6 clients that report a /128 prefix may not match a /64 LIS subnet."
  - "Test with 933 for Calling Plans, Operator Connect and Teams Phone Mobile in the US and Canada. Direct Routing customers coordinate with their ERSP. Network changes can take up to four hours."
faq:
  - q: "In which order does Teams match a client to an emergency location?"
    a: "Learn says the match happens in this order and the first match is used: wireless access point (WAP), Ethernet switch and port, Ethernet switch, then subnet. Subnet locations are supported on all Teams clients, and Wi-Fi locations on all except Teams phones."
  - q: "Why does a user get the right emergency policies but no emergency address?"
    a: "Learn says a network site match gives the client policies, while a location needs a match in LIS. A successful site match does not confirm the client obtained an emergency address. Subnets used in sites must also be redefined in LIS."
  - q: "How long do network setting changes take?"
    a: "Learn says it can take up to four hours for some changes to network settings, such as a new address or network identifier, to propagate and be available to Teams clients."
  - q: "What extra steps does Direct Routing need?"
    a: "Learn lists setting PidfloSupported to true on the SBC (Teams admin center under Voice, Direct Routing, or Set-CsOnlinePSTNGateway), and setting up an Emergency Routing Service provider for the US and Canada or configuring the SBC for an ELIN application. Emergency call routing policies apply to Direct Routing only."
  - q: "Which policy wins when a user and their network site have different emergency calling policies?"
    a: "Per Learn, if an emergency calling policy is assigned to a network site and to a user at that site, the site policy overrides the user policy."
---

Dynamic emergency calling in Teams Phone gives the emergency service the connected location of the Teams client instead of a fixed address. It works through two lists you maintain: network settings (sites, subnets and trusted IP addresses) that deliver the right policies, and the Location Information Service (LIS) that maps network identifiers to emergency locations. Microsoft Learn documents the setup and warns about several traps, notably IPv6. This article follows the Learn page and avoids statements about country rules beyond what it says.

## What must exist

From the Learn overview:

1. The network admin sets up network settings and the LIS to create a network and emergency location map.
2. At startup, periodically, and when the connection changes, the Teams client sends a location request. A network settings site match gives it emergency calling policies from that site. An LIS match gives it an emergency location from the network element it is connected to, in the order WAP, Ethernet switch and port, Ethernet switch, subnet. The first match is used.
3. When the client makes an emergency call, it sends the emergency location to the PSTN.

Automatic routing to the right PSAP depends on the country or region of the user. Microsoft Calling Plans, Operator Connect partners and Teams Phone Mobile partners provide dynamic emergency routing services for users in the United States and Canada.

## Direct Routing prerequisites

- In the SBC settings, add location information to the outgoing emergency call INVITE by setting `PidfloSupported` to true. In the Teams admin center: **Voice** > **Direct Routing**, select the SBC, **Edit**, and turn on **SBC supports PIDF/LO for emergency calls**. In PowerShell: `Set-CsOnlinePSTNGateway -Identity <sbc> -PidfLoSupported $true`.
- Configure a connection to an Emergency Routing Service provider (United States and Canada), or configure the SBC for an Emergency Location Identification Number (ELIN) application.

## Supported clients

Learn lists Teams for Windows and macOS, mobile on iOS and Android (minimum versions given on the page), Teams phones, Teams Rooms on Windows and Android, and Teams for Virtualized Desktop Infrastructure. Subnet locations work on all clients, Wi-Fi locations on all except Teams phones. Ethernet/Switch (LLDP) is supported on Windows 10 or later, macOS with LLDP enablement software, Teams phones from a minimum app version, and Teams Rooms. The Teams web client is not supported, and Learn suggests turning off **Web PSTN calling** in a Teams calling policy for web client users.

## Step 1: Emergency addresses

- Assign addresses to Calling Plan users, to Operator Connect and Teams Phone Mobile users (depending on number capabilities), and to network identifiers.
- For automated routing within the United States, locations assigned to network identifiers must include geo codes. You cannot assign addresses without geo codes to network identifiers.
- Teams checks Azure Maps when you enter an address in the Teams admin center. If no match is found, create the address manually with the PIN drop feature.
- You cannot assign emergency addresses that are more than a couple of years old to network identifiers. Re-create them.

## Step 2: Network settings

- Sites are collections of subnets, used exclusively for dynamic policy assignment, for example a Redmond site that gives roaming users Redmond emergency numbers, routing and security desk.
- Trusted IP addresses hold the external IP addresses of the enterprise network. The system looks for a dynamic policy or location by IP only if the user's external IP matches a trusted address. Requests by Ethernet/Switch and wireless access point are made regardless.
- Learn says cloud proxy deployments that modify the source IP addresses from Teams clients do not support network configuration setting lookups.
- Changes can take up to four hours to propagate.

What to configure, for both Calling Plan, Operator Connect and Teams Phone Mobile users and Direct Routing users: for dynamic security desk notification, configure trusted IP addresses and network sites. For dynamic locations only, configure only trusted IP addresses. For Direct Routing, dynamic enablement of emergency calling also needs trusted IP addresses and network sites.

## Step 3: Fill the LIS

In the Teams admin center, go to **Locations** > **Networks & locations**, select the tab (**Subnets**, **Wi-Fi access points**, **Switches** or **Ports**), then use **Add** (ID, description, emergency location, **Apply**) or **Upload** with the CSV or TSV templates. In PowerShell, use the Get, Set and Remove cmdlets for `CsOnlineLisSubnet`, `CsOnlineLisPort`, `CsOnlineLisWirelessAccessPoint` and `CsOnlineLisSwitch`.

Learn stresses: if you use subnets in network sites, you must redefine them in LIS to render dynamic locations. LIS calculates a network ID from the client IP and reported prefix length, and the network ID must match a configured subnet. Learn's example: 10.10.10.150/25 gives 10.10.10.128.

### IPv6 pitfall

On Windows, an IPv6 address from stateful DHCPv6 can be reported as `/128`, so LIS looks for the full client address and does not match a `/64` LIS entry. The same client can still match a network site with a `/64` subnet and receive policies without receiving a location. Learn's alternatives:

| Scenario | Configuration |
|---|---|
| Dual-stack endpoint | Configure the corresponding IPv4 subnet in LIS with an emergency location. |
| IPv6-only wired | Configure a switch or switch and port identifier, needs LLDP support. |
| IPv6-only wireless | Configure the access point BSSID, needs Wi-Fi location support. |

Learn says not to create per-device `/128` LIS subnet entries as a workaround, because IPv6 addresses can change.

## Step 4: Emergency policies and assignment

- The **emergency call routing policy** applies only to Direct Routing. It defines emergency numbers, optional masks and the PSTN route. Calling Plan, Operator Connect and Teams Phone Mobile users get emergency numbers from their usage location automatically.
- The **emergency calling policy** applies to all four models and defines the security desk notification experience, including per number settings and not alerting for test calls to 933.
- Assign them to users, to network sites, or both. Learn's examples: `Grant-CsTeamsEmergencyCallingPolicy`, `Set-CsTenantNetworkSite -EmergencyCallingPolicy ...`, `Grant-CsTeamsEmergencyCallRoutingPolicy` and `Set-CsTenantNetworkSite -EmergencyCallRoutingPolicy ...`.
- If a user and a network site both have an emergency calling policy and the user is at that site, the site policy overrides.

## Step 5: Test

Calling Plan, Operator Connect and Teams Phone Mobile users in the United States or Canada can call the test number 933, which routes to a bot that reads back the calling line ID, emergency address or location, and whether a real call would be routed to the PSAP automatically or screened first. Direct Routing customers in the United States coordinate with their ERSP for a test service. After adding alternative identifiers, Learn says to confirm the returned location and not to rely only on a site match.

Government clouds: Learn lists availability for GCC on all clients, and for GCCH and DoD on desktop, mobile and phones with minimum versions.

## What the documentation does not say

The page does not describe regulations for specific countries beyond the US and Canada routing statement, and it does not cover Survivable Branch Appliance behavior. For that, a separate article in this series covers it, and the Learn SBA page says location is not shared in SBA mode. This page also gives no sizing or number limits for LIS entries.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Configure dynamic emergency calling, Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/configure-dynamic-emergency-calling)
- [Direct Routing SBA, Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-survivable-branch-appliance)
