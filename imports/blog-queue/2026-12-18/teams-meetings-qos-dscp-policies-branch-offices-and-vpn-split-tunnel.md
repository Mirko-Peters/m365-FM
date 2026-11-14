---
title: "Teams Meetings QoS and DSCP Policies for Branch Offices and VPN: Ports, Intune and Split Tunnel"
summary: "How to deploy Quality of Service for Teams real-time media: DSCP values and port ranges, the Teams admin center setting, Intune, PowerShell and Group Policy on Windows, and why Microsoft advises split tunneling over VPN."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [teams, teams-admin-center, virtual-private-network, intune]
keypoints:
  - "Teams default markings are DSCP 46 for audio on ports 50000-50019, 34 for video on 50020-50039 and 18 for screen sharing on 50040-50059."
  - "Turn on Insert Quality of Service (QoS) markers for real-time media traffic in Meetings > Meeting settings, because it is off by default."
  - "On Windows, apply DSCP marking for ms-teams.exe with Intune, New-NetQosPolicy or Group Policy-based QoS."
  - "QoS only works on links you manage. Microsoft recommends avoiding real-time media over VPN and using a split tunnel for the Optimize endpoints."
  - "Capture traffic at your network egress to confirm the DSCP values are not changed or stripped in transit."
faq:
  - q: "Which DSCP values does Teams use for meetings?"
    a: "According to Microsoft Learn, audio uses DSCP 46 (EF), video uses 34 (AF41), screen sharing uses 18 (AF21) and calling and meeting signaling uses 40 (CS5). You can adjust port ranges but you cannot configure the DSCP markings."
  - q: "Do I need the Teams admin center setting if I mark packets with Group Policy?"
    a: "Microsoft Learn says to enable Insert Quality of Service (QoS) markers for real-time media traffic in the Teams admin center. The default is Off. Learn describes this as needed for client-side marking to work, including on Mac, mobile and Teams Phone devices."
  - q: "Does QoS help users who connect over a VPN?"
    a: "Only inside your managed network. Microsoft Learn says remote users on a VPN get prioritization only inside the managed network, VPNs add overhead and delay, and traffic that leaves your network is not prioritized. Learn recommends avoiding real-time traffic over VPN."
  - q: "How do I keep Teams media off the VPN?"
    a: "Microsoft Learn recommends a split tunnel, so that Optimize category endpoints go directly to the internet. Teams media has no URL, so routing is controlled with IP subnets. Learn names 52.112.0.0/14, 52.122.0.0/15 and 2603:1063::/38 as the Teams media example and advises using the Microsoft 365 endpoint service for the current list."
  - q: "How do I check that marking works end to end?"
    a: "Microsoft Learn suggests capturing traffic at the network egress point, ideally with port mirroring on a switch or router, and confirming that DSCP values are intact. Then monitor with call analytics, the Call Quality Dashboard and Teams reporting."
---

QoS for Teams meetings has three parts: mark the packets, honor the markings on every managed link, and keep media off paths that cannot honor them. For branch offices, that means DSCP marking on Windows clients or routers plus the Teams admin center setting. For VPN users, Microsoft Learn recommends a split tunnel because QoS does not extend beyond your managed network.

## Step 1: Know the default values

Learn lists these client source ports and DSCP values:

| Media | Source ports | DSCP | Class |
|---|---|---|---|
| Audio | 50000 to 50019 | 46 | EF |
| Video | 50020 to 50039 | 34 | AF41 |
| Screen sharing | 50040 to 50059 | 18 | AF21 |
| Calling and meeting signaling | 50070 to 50089 | 40 | CS5 |

Each media type needs its own DSCP value and a non-overlapping port range. You can change the port ranges, but you cannot configure the DSCP markings. Signaling ports are not configurable. Mac and mobile clients use hard-coded values, EF for audio and AF41 for video and screen sharing. Browser clients keep using dynamic ports.

## Step 2: Enable marking in the Teams admin center

Go to **Meetings** > **Meeting settings** and find the **Network** section. Set **Insert Quality of Service (QoS) markers for real-time media traffic** to **On**. The default is Off. Under **Select a port range for each type of real-time media traffic**, keep **Specify port ranges** and the defaults above, unless you have a reason to change them. If you change them, change the router and client policies to match.

## Step 3: Mark traffic on Windows clients

Learn covers the new Teams client, with the executable name `ms-teams.exe`. Assign these as device policies.

### Intune

Create a custom profile for Windows 10 and later under **Devices** > **Configuration**. Use the `NetworkQoSPolicy` CSP with OMA-URI settings such as `./Device/Vendor/MSFT/NetworkQoSPolicy/TeamsAudio/AppPathNameMatchCondition` (String, `ms-teams.exe`), `.../SourcePortMatchCondition` (String, `50000-50019`) and `.../DSCPAction` (Integer, `46`). Repeat for `TeamsVideo`, `TeamsScreenshare` and `TeamsCMSignaling` with their ports and values. Target device groups, not user groups.

### PowerShell

Run `New-NetQosPolicy` per endpoint, for example:

```powershell
New-NetQosPolicy -Name "Teams Audio" -AppPathNameMatchCondition "ms-teams.exe" -IPProtocolMatchCondition Both -IPSrcPortStartMatchCondition 50000 -IPSrcPortEndMatchCondition 50019 -DSCPAction 46 -NetworkProfile All
```

Repeat for video (34, 50020 to 50039), sharing (18, 50040 to 50059) and signaling (40, 50070 to 50089, UDP only in the source).

### Group Policy

Under **Computer Configuration** > **Windows Settings**, right-click **Policy-based QoS** and select **Create new policy**. Create one policy per media type. Specify the DSCP value, restrict it to `ms-teams.exe`, leave the source and destination IP as any, choose TCP and UDP, and enter the source port range, for example `50000:50019`. Run `gpupdate /force`. To verify, run `gpresult /R` and check `HKEY_LOCAL_MACHINE\Software\Policies\Microsoft\Windows\QoS` for the application name, DSCP value and local port.

## Step 4: Add router marking at the branch

Learn describes two methods and recommends both. Client-side marking covers managed devices. Port-based tagging at the router covers devices that cannot mark their own traffic, and Learn calls it the most reliable method across platforms. Router policies should match the client source ports with the source and destination IP set to any, so they catch both directions. Learn also advises keeping the path short, avoiding closed ports and avoiding proxies. Router syntax depends on the vendor, and the page gives no examples.

## Step 5: Handle VPN users

Learn is direct about VPNs:

- VPNs add packet overhead and delay real-time traffic, and Microsoft recommends avoiding real-time traffic over VPN.
- Remote users on a VPN get prioritization only inside your managed network.
- Recommended: give Teams traffic an alternate path that bypasses the VPN, a split tunnel. Reasons include VPNs not being built for real-time media, some not supporting UDP, and hair-pinning that adds latency.

For the split tunnel, route the **Optimize** category endpoints directly. Teams media has no URL, so routing uses IP subnets. Learn's example lists `52.112.0.0/14`, `52.122.0.0/15` and `2603:1063::/38`, and shows how to pull the current Optimize list from the Microsoft 365 endpoint service. Media is already encrypted with SRTP, which is the reason Learn gives for it being safe to send outside the tunnel. Learn also says that if media still crosses the VPN, a firewall rule blocking the Teams subnets or ports from the VPN should suffice. For consistent routing, use Teams client version 1.3.00.13565 or later.

## Step 6: Verify

1. Confirm the Teams admin center setting is On.
2. Confirm ports and DSCP values match the table.
3. Capture traffic at egress and confirm the DSCP values survive.
4. Run `tracert worldaz.tr.teams.microsoft.com` from a VPN client. The path should use the local ISP.
5. Monitor call analytics and the Call Quality Dashboard.

## Typical mistakes

- Leaving the admin center QoS setting Off.
- Using `Teams.exe` instead of `ms-teams.exe` in a policy.
- Overlapping port ranges between media types.
- Expecting QoS to prioritize traffic once it leaves the managed network.
- Assigning the Intune profile to user groups.

## What the sources do not say

The pages read do not list Group Policy names beyond the steps above, do not give router syntax, and do not state how switches should treat DSCP values. The Learn page on Teams network preparation does not state latency or packet loss targets.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Virtual private network](https://www.m365.fm/entity/virtual-private-network/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Implement Quality of Service in Microsoft Teams](https://learn.microsoft.com/microsoftteams/qos-in-teams)
- [Implement QoS in Teams clients](https://learn.microsoft.com/microsoftteams/qos-in-teams-clients)
- [Manage meeting settings in Teams](https://learn.microsoft.com/microsoftteams/meeting-settings-in-teams)
- [Prepare your organization's network for Microsoft Teams](https://learn.microsoft.com/MicrosoftTeams/prepare-network)
- [Implementing VPN split tunneling for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-vpn-implement-split-tunnel)
- [Securing Teams media traffic for VPN split tunneling](https://learn.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-vpn-securing-teams)
