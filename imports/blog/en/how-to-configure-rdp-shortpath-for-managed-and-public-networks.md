---
title: "How to configure RDP Shortpath for managed and public networks"
summary: "RDP Shortpath for public networks works without configuration when networks and firewalls allow UDP, while the managed-network listener needs a policy, a firewall rule and a restart on every session host. This guide covers the policy paths, the host pool networking settings, the port range limit and the checks that show which transport a session uses."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [rdp-shortpath, remote-desktop-protocol]
keypoints:
  - "Only the managed-network listener variant needs session host configuration: enable Enable RDP Shortpath for managed networks through Intune or Group Policy, allow the inbound port (default 3390) and restart the session hosts."
  - "The host pool has its own RDP Shortpath settings under Networking. Each of the four options can be Default, Enabled or Disabled, and where host pool and session host disagree the most restrictive setting applies."
  - "Learn says the Azure PowerShell parameters ManagedPrivateUdp, DirectUdp, PublicUdp and RelayUdp were added in version 5.2.1 preview of the Az.DesktopVirtualization module. The cmdlet reference for Update-AzWvdHostPool does not list them, so check your module version before scripting."
  - "Learn advises keeping TURN enabled unless you disable it for troubleshooting, because it gives a reliable path when direct UDP fails and disabling it can push connections to TCP. Learn's configuration page says TURN is available only in the Azure public cloud, while other Learn pages list it as generally available in Azure Government."
  - "Verify with the Connection Information dialog (UDP (Private Network), UDP or UDP (Relay)), event ID 135 on the session host, or the UdpUse column in the WVDConnections table."
faq:
  - q: "Do I have to configure anything for RDP Shortpath on public networks?"
    a: "Usually not. Learn says Shortpath for public networks with STUN or TURN works automatically if networks and firewalls allow the traffic and the RDP transport settings on session hosts and clients are at their defaults. Configuration is needed to limit the port range, to disable options, or to repair a UDP setting that a policy changed to TCP only."
  - q: "Why does the managed-network option not work after I enable the policy?"
    a: "Three points from the configuration page are worth checking. The session host must be restarted after the policy applies. The inbound port, 3390 by default, must be allowed in Windows Firewall, any other firewall and any network security group. The host pool setting must not be Disabled, because the most restrictive of host pool and session host settings is used."
  - q: "How do I see whether a session uses UDP?"
    a: "In the client, open the Connection Information dialog from the signal strength icon in the connection bar. Learn says the transport shows as UDP (Private Network) for the managed path, UDP for direct STUN and UDP (Relay) for TURN. On the session host, event ID 135 in the RemoteDesktopServices-RdpCoreCDV Operational log records the multi-transport result, and Log Analytics shows UdpUse values of 1, 2 or 4."
---

RDP Shortpath for public networks needs no configuration in a default setup: it works when firewalls allow the UDP traffic and the RDP transport settings are at their defaults. Only the managed-network variant with a listener needs work on each session host, and everything else is optional tuning of host pool settings, the port range and verification. This guide follows Learn's [configuration article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath), last revised in October 2026. How the options differ and when each applies is explained in the RDP Shortpath concept article in this series; firewall ports and address ranges are in the networking basics article.

## Before you start

Learn lists these prerequisites:

- A client that supports it. Windows App on Windows qualifies. Learn lists a macOS beta (version 11.3.8, build 3048) and Android and ChromeOS as preview.
- For the managed-network listener, direct connectivity from the client to the session host on the listener port, not blocked by Windows Firewall, another firewall or a network security group. Examples are [Azure ExpressRoute](/entity/azure-expressroute/) private peering or an IPsec site-to-site or point-to-site VPN.
- For public networks, internet access for clients and session hosts, with outbound UDP from the session hosts to the internet or to the STUN and TURN servers.
- For Azure PowerShell, the Az.DesktopVirtualization module. Learn says the Shortpath parameters were added in version 5.2.1 preview and tells you to use that version. The cmdlet reference page for `Update-AzWvdHostPool` (Azure PowerShell 16.5.0) does not list the four parameters, so run `Get-Help Update-AzWvdHostPool -Parameter ManagedPrivateUdp` in your session first, or use the portal steps below.

Availability differs by cloud. The first note on Learn's configuration page says public-network Shortpath via STUN is available in the Azure public cloud and Azure Government, and via TURN only in the Azure public cloud. The TURN option also needs the client to be in a supported location; the TURN region list is on the concept page. The RDP Shortpath concept page and the Windows 365 page, however, list TURN as generally available in Azure Government as well. Learn's pages disagree, so check the current wording for your cloud before you plan around TURN.

By default, all four options are enabled at host pool level (Default means Enabled), and UDP and TCP are both enabled in Windows on session hosts and clients.

## Step 1: Check that UDP is not switched off on the session hosts

A policy can force TCP only. Learn checks the registry value `SelectTransport` under `HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services`. If the value does not exist, the default applies and UDP is enabled. A value of 1 means use only TCP, and 2 means use either UDP or TCP.

If a policy set TCP only, change it here:

- **Intune**: Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host, Connections, Select RDP transport protocols.
- **Group Policy**: the same path under Computer Configuration, Policies, Administrative Templates.

Set it to Not configured, or to Enabled with Select Transport Type set to Use both UDP and TCP. Update the policy and restart the session hosts.

## Step 2: Enable the listener for managed networks (listener option only)

Learn says you do not need the listener for the other three options. Do this only if you want the listener variant.

**With Intune**

1. In the Microsoft Intune admin center, create or edit a configuration profile for Windows 10 and later with the Settings catalog profile type.
2. In the settings picker, browse to Administrative templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host, Azure Virtual Desktop.
3. Select Enable RDP Shortpath for managed networks and set it to Enabled.
4. Assign the profile to the group containing the session hosts and create it.
5. Allow the configured port inbound in Windows Firewall and any other firewall, using Learn's Intune firewall policy guidance.
6. Restart the session hosts after the policy applies.

**With Group Policy**

1. Make the Azure Virtual Desktop administrative template available in your domain.
2. In Group Policy Management, create or edit a policy that targets the session hosts.
3. Go to Computer Configuration, Policies, Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host, Azure Virtual Desktop.
4. Open Enable RDP Shortpath for managed networks, select Enabled and, if you want, change the listener port. The default is 3390.
5. Allow that port inbound in Windows Firewall and elsewhere, then apply the policy and restart the session hosts.

## Step 3: Set the host pool networking settings

The host pool controls which of the four options clients may use. Where host pool and session host settings conflict, Learn says the most restrictive one wins. For example, a Disabled host pool value overrides an enabled listener. In the Azure portal:

1. Open Azure Virtual Desktop, then Host pools, and select the pool.
2. Under Settings, select Networking, then RDP Shortpath.
3. For each option, pick Default, Enabled or Disabled, then Save. Default corresponds to Enabled.

With Azure PowerShell, the parameters map to the options as follows:

| Parameter | Option |
|---|---|
| `ManagedPrivateUdp` | Managed networks (listener) |
| `DirectUdp` | Managed networks with ICE/STUN |
| `PublicUdp` | Public networks with ICE/STUN |
| `RelayUdp` | Public networks via TURN |

To read the current values:

```azurepowershell
$parameters = @{
    HostPoolName = "<HostPoolName>"
    ResourceGroupName = "<ResourceGroupName>"
}
Get-AzWvdHostPool @parameters | FL ManagedPrivateUdp, DirectUdp, PublicUdp, RelayUdp
```

To keep the managed-network default and disable the options that use STUN or TURN, add `ManagedPrivateUdp = "Default"`, `DirectUdp = "Disabled"`, `PublicUdp = "Disabled"` and `RelayUdp = "Disabled"` to a parameter set with `Name` and `ResourceGroupName`, and pass it to `Update-AzWvdHostPool`. Learn also shows the combination for public networks only (`PublicUdp` and `RelayUdp` Enabled, the other two Disabled) and one for TURN only. Run the read command again to confirm.

## Step 4: Control the public-network types with a policy (optional)

Learn also describes a policy that switches individual path types on or off per session host. In Intune and in Group Policy, browse to the same Azure Virtual Desktop node, then RDP Shortpath. The three settings are:

- RDP Shortpath for managed networks using NAT traversal
- RDP Shortpath for public networks using NAT traversal
- RDP Shortpath for public networks using Relay (TURN)

Enabled or Not configured means the connection attempts the path. Disabled means it does not. Restart the session hosts afterwards. Learn's note is explicit: keep TURN enabled unless you turn it off for troubleshooting, because it is the predictable path behind Symmetric NAT or restrictive firewalls, and disabling it lowers the connection success rate and can force TCP. A further note says it is strongly recommended to enable and optimize TURN in all cases, especially across networks you do not manage. The Group Policy steps on the page tell you to open the managed networks setting; open the setting for the type you actually want to change.

## Step 5: Limit the port range (optional)

By default, the STUN and TURN options use the ephemeral range 49152 to 65535. Learn says you can instead use a smaller range. The default smaller range is 38300 to 39299, from a base port of 38300 and a pool size of 1000, and you can set your own. The range must lie between 1024 and 49151. The client picks a random port from the range for each connection, and if the range is exhausted, connections fall back to the default range.

The setting is Use port range for RDP Shortpath for unmanaged networks under the same Azure Virtual Desktop node, in Intune and in Group Policy. Enable it and enter UDP base port (Device) and Port pool size (Device). Restart the session hosts.

## Step 6: Check the client side

UDP is enabled by default on Windows clients. If it is off, the registry value `fClientDisableUDP` under `HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client` is 1. The policy is Turn Off UDP On Client, under Remote Desktop Services, Remote Desktop Connection Client. Set it to Not configured or Disabled, update the policy and restart the client.

Learn also offers `avdnettest.exe`, which checks that a client reaches the STUN and TURN endpoints and reports the NAT type. Learn says an environment with Symmetric NAT can use a relayed connection with TURN.

Teredo is optional. In IPv4-only networks it adds NAT traversal candidates. Run `Set-NetTeredoConfiguration -Type Enterpriseclient` as an administrator on session hosts and clients, then restart them.

## Step 7: Verify which transport a session uses

Connect to a session and check one of these:

- **Connection Information** in the client: UDP (Private Network) means managed-network Shortpath, UDP means direct STUN, and UDP (Relay) means TURN.
- **Event Viewer** on the session host (Learn's introduction mentions the client device, but its steps use the session host): Applications and Services Logs, Microsoft, Windows, RemoteDesktopServices-RdpCoreCDV, Operational. Filter for event ID 135. A UDP session shows the message "The multi-transport connection finished for tunnel: 1, its transport type set to UDP".
- **Log Analytics**: the `UdpUse` column of the WVDConnections table. Learn defines 1 as managed networks, 2 as public networks with direct STUN and 4 as public networks relayed by TURN. Any other value means TCP.

## Windows 365

Learn's Windows 365 page sends you to the Azure Virtual Desktop instructions to enable Shortpath for public networks and says indirect UDP with TURN is on by default. To turn UDP off, set the ADMX_TerminalServer policy TS_SELECT_TRANSPORT to Use only TCP. Its known-issues list names double NAT, for example through a secure web gateway or proxy, routing through an internet proxy or inspection device, networks that restrict UDP or limit ports and IP ranges, carrier-grade NAT, and connection drops during TURN relay updates, after which the client reconnects automatically within a few seconds.

## Common stumbling blocks

- **No restart.** Learn asks for a restart of the session hosts after each policy change.
- **A forgotten TCP-only policy** from an older baseline, found in step 1.
- **A Disabled host pool option** that overrides a correct policy.
- **A closed listener port** in Windows Firewall or a network security group.
- **A NAT type that blocks direct paths.** Learn says a relayed connection with TURN is the option for Symmetric NAT, so allow the relay path rather than disabling UDP, where TURN is available for your cloud and client location.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Configure RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath)
- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Use RDP Shortpath for public networks with Windows 365 Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/rdp-shortpath-public-networks)
