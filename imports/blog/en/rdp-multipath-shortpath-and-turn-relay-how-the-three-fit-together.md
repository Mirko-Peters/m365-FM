---
title: "RDP Multipath, Shortpath and TURN relay: how the three fit together"
summary: "Reverse connect TCP starts every Azure Virtual Desktop session, RDP Shortpath moves it to UDP through a managed, direct STUN or TURN relay path, and RDP Multipath keeps standby paths for when the active one degrades. This guide maps each layer to the setting that controls it, the network rules it needs and the check that shows which layer a session is using."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [rdp-multipath, remote-desktop-protocol]
keypoints:
  - "Three layers, three jobs: TCP reverse connect through the gateway brokers every session, Shortpath adds a UDP transport (managed network, direct STUN or TURN relay), and Multipath keeps standby UDP and TCP paths and switches when the active path degrades."
  - "Only the managed-network listener needs session host configuration. Shortpath for public networks works without configuration if networks and firewalls allow it. The Multipath page lists no separate switch for it, but recommends Shortpath as its primary transport."
  - "Keep TURN enabled unless disabling it for troubleshooting. The Shortpath configuration page calls TURN a predictable path when direct UDP cannot be established, for example behind Symmetric NAT or restrictive firewalls, and says disabling it lowers the connection success rate and can force TCP."
  - "Network rules to allow: TCP 443 to the gateway range, UDP 3478 to the TURN range 51.5.0.0/16, and outbound UDP for direct STUN, default ports 49152 to 65535. Multipath can use up to three UDP and two TCP ports per session."
  - "Verify layer by layer: Connection Information shows UDP (Private Network), UDP or UDP (Relay), the connection bar shows Multipath, and UdpUse in the WVDConnections table reports 1, 2 or 4."
faq:
  - q: "If I disable TURN on the host pool, does Multipath still work?"
    a: "Neither the Multipath nor the Shortpath page says. The Multipath page describes paths as combinations of UDP via STUN or TURN and redundant TCP reverse connect paths. In our reading, disabling a Shortpath option removes that kind of path from the candidates, so Multipath has fewer paths to choose from. The Shortpath configuration page separately warns that disabling TURN reduces successful connections and can force TCP."
  - q: "Which setting do I change to turn Multipath on?"
    a: "The Multipath page lists none. It says Multipath works automatically when the prerequisites are met: a supported Windows App version and an environment that supports Shortpath. The Shortpath settings, in the host pool networking tab and in policy, shape which paths exist, and so what Multipath can switch between."
  - q: "Does a narrow UDP port range affect Multipath?"
    a: "Neither page says. The Shortpath configuration page describes a smaller range, for example 38300 to 39299, for STUN and TURN options, and says that if the range is exhausted, connections fall back to the default range. The Multipath page says a session can use up to three UDP ports. Whether each of those comes from the narrowed range is not stated, so test with realistic session counts."
---

Reverse connect TCP brokers every Azure Virtual Desktop session, RDP Shortpath adds a UDP transport when the network allows it, and RDP Multipath keeps standby paths so that the session can survive a path change. The three are layers of one design, not alternatives. This guide maps each layer to the setting that controls it, the network rule it needs and the check that shows it is in use. The concepts are explained in the articles on [RDP Shortpath](/entity/rdp-shortpath/) and RDP Multipath in this series, and the click-by-click configuration is in the article "How to configure RDP Shortpath for managed and public networks". Here the focus is on how the layers interact when you plan or troubleshoot a rollout.

## The stack in one table

| Layer | Job | Controlled by | Needs |
|---|---|---|---|
| TCP reverse connect | Brokering, authentication, and the fallback transport | Always on | TCP 443 to the gateway |
| Shortpath, managed network (listener) | Direct UDP over private connectivity | Host pool `ManagedPrivateUdp`; session host policy "Enable RDP Shortpath for managed networks" | Inbound port, default 3390 |
| Shortpath, managed network with ICE/STUN | Direct UDP, no listener | Host pool `DirectUdp`; session host policy "RDP Shortpath for managed networks using NAT traversal" | UDP between client and host |
| Shortpath, public network with ICE/STUN | Direct UDP over the internet | Host pool `PublicUdp`; session host policy "RDP Shortpath for public networks using NAT traversal" | Outbound UDP, default ports 49152 to 65535 |
| Shortpath via TURN | Relayed UDP | Host pool `RelayUdp`; session host policy "RDP Shortpath for public networks using Relay (TURN)" | UDP 3478 to `51.5.0.0/16` in the Azure cloud |
| Multipath | Standby UDP and redundant TCP paths, automatic switching | No separate switch listed | Windows App 2.0.559.0 or later; 2.0.1069.0 or later for redundant TCP |

For session hosts, the policies apply in addition to the host pool options, and where the two conflict the most restrictive setting is used; Enabled or Not Configured means the path is attempted, Disabled means it is not.

The [Shortpath page](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath) says every connection begins on the reverse connect transport, then the client tries UDP, and if UDP succeeds the TCP connection drops. Under connection security it adds that once Shortpath is established, the reverse connect transport is dropped and all traffic flows over Shortpath. The [Multipath page](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath) describes the layer above: UDP paths through STUN or TURN, plus redundant TCP standby paths established using Rendezvous, with automatic switching when the main path degrades. The Shortpath page does not mention Multipath, and neither page says what becomes of the TCP paths once Shortpath is up. In our reading, the TCP connection that drops is the initial one and the redundant TCP paths are separate standby paths added by Multipath, but Learn does not confirm this. Treat the state of TCP after Shortpath is established as undocumented and check it in a pilot.

## What each layer decides

**Shortpath decides which UDP route is tried.** For public networks, ICE coordinates STUN and TURN so that the preferred route is attempted first: direct STUN, then the TURN relay. Where both a managed and a public path are available, the first connection to be established wins, and Learn says the managed path is likely to be established first because the public route has more steps.

**TURN provides a relayed UDP path when a direct one is not possible.** The Shortpath page says a relayed connection is an option for Symmetric NAT, which is the case with Azure Firewall and Azure NAT Gateway. If firewalls or other devices block UDP traffic altogether, the connection falls back to TCP; TURN does not help there.

**Multipath decides what happens afterwards.** Learn says backup paths stay on standby and the system switches to the next one when the active path becomes unstable or fails. If all paths are lost, it tries to reconnect when connectivity returns.

## What different networks produce

The table applies the Shortpath page's example scenarios to common situations. It is our summary, not a Learn table.

| Situation | Expected transport | What Multipath can add |
|---|---|---|
| Home user, direct UDP possible | UDP via STUN | Standby paths if another route exists |
| Home or office behind Symmetric NAT or restrictive firewall | UDP via TURN relay | Standby paths, if more than one can be built |
| Office on ExpressRoute or IPsec VPN, listener enabled | Managed UDP, likely first to establish | Standby paths |
| Both managed and public paths available, listener off | ICE picks the lowest-latency route | Standby paths |
| UDP blocked everywhere | TCP reverse connect (scenario 7) | Redundant TCP paths, with Windows App 2.0.1069.0 or later |
| Double NAT, carrier-grade NAT, cloud packet-inspection services, TCP-based VPN | Our reading: direct UDP is less likely, so relay or TCP | Whatever paths remain |

The first five rows follow the Shortpath scenarios. For the last row, the Shortpath page's general recommendations for public networks say to avoid force tunneling, double NAT or carrier-grade NAT, cloud packet-inspection services and TCP-based VPN solutions, and that some network configurations may negatively affect the success rate of the direct connection. It does not say which transport results.

## Rollout runbook

1. **Check the client first.** Multipath needs Windows App 2.0.559.0 or later for multiple UDP paths and 2.0.1069.0 or later for redundant TCP paths. Learn lists a macOS beta for UDP paths and says other platforms are not supported.
2. **Allow the transport endpoints.** Azure cloud: TCP 443 to `*.wvd.microsoft.com` and `40.64.144.0/20`, UDP 3478 to `51.5.0.0/16`, and outbound UDP for direct STUN. For direct STUN the pages differ: the Multipath page gives `51.5.0.0/16`, the Shortpath page gives "Any" for session hosts and NAT gateway or firewall public IPs for clients. The Multipath article in this series covers the difference and the Azure Government ranges.
3. **Make sure nothing forces TCP, and test the network.** The registry checks (`SelectTransport`, `fClientDisableUDP`) and the `avdnettest.exe` test are described step by step in the configuration article named above.
4. **Leave the host pool options at Default** unless you have a reason. Default corresponds to Enabled for all four.
5. **Pilot, then widen.** Compare a pilot group with a control group on the same networks.

## Interactions the pages do not spell out

Three questions come up in planning, and the Multipath and Shortpath pages are silent or ambiguous on each. They are our reading, to be tested.

- **Disabling Shortpath options and Multipath.** The Multipath page defines paths as combinations of UDP via STUN or TURN and redundant TCP. If you disable `PublicUdp` or `RelayUdp` on the host pool, in our reading that kind of UDP path is no longer a candidate. Keep that in mind before you trade resilience for a tidier firewall rule set.
- **A narrow port range.** The configuration page describes a smaller range of 38300 to 39299 (pool size 1000), and says the client picks a random port from it for every connection and that connections fall back to the default range when it is exhausted. The Multipath page says a session can use up to three UDP ports. If each path took a port from the narrowed range, a pool of 1,000 would serve about 333 sessions at three paths each (our arithmetic), and the effect would be unplanned ports rather than failed sessions. Check which behaviour your logs show.
- **Rollout state.** The May 2026 entry in What's new says redundant TCP may not be consistently enabled across all host pools until rollout completes, and the July 2026 entry announces general availability. In our reading, check the client version first when a pool lacks the indicator.

## Verification map

| Question | Where to look | What it shows |
|---|---|---|
| Which Shortpath type is in use? | Connection Information in Windows App | UDP (Private Network), UDP or UDP (Relay) |
| Is Multipath enabled? | Connection bar | An indicator that RDP Multipath is enabled |
| Over time and by user? | `UdpUse` in WVDConnections, and Event ID 135 on the host | Values and event are described in the configuration article |
| Are sessions stable? | Azure Virtual Desktop Insights, connection reliability | Connection reliability data |

## Troubleshooting order

When users report drops or high latency, work from the bottom of the stack upwards. This order is our working rule, not a Learn requirement.

1. Does the session connect at all? That is the TCP 443 path to the gateway.
2. Does it use UDP? Read Connection Information. As a working rule of ours, a plain TCP session points to a blocked UDP route, a TCP-only policy, or a network configuration the Shortpath page advises against.
3. If it uses a relay, is that expected? A TURN connection is normal behind Symmetric NAT, and is not a fault.
4. Is Multipath shown in the connection bar? If not, check the client version and the rollout notes before you change firewall rules.
5. Only then compare the pilot and control groups for session drops in Insights. For what users see when a path is lost, the Session Auto-Reconnect page describes Modern Auto-Reconnect, which Learn says is powered by Multipath and needs Windows App 2.0.1314.0 or later; the Multipath article in this series covers it.

## Status notes

The Shortpath page lists TURN relay availability per region and says a relay is chosen by the client's physical location, so a client far from any relay might fall back to TCP. It also says TURN connections can drop during relay updates and that the client reconnects automatically within a few seconds. The pages disagree on TURN in Azure Government: the configuration page (ms.date October 2026) says TURN is available only in the public cloud, while the Shortpath page and the October 2026 What's new entry say it is generally available in Azure Government. The Multipath article in this series sets out the Azure Government endpoints and the preview label on the Multipath page. Read the current wording for your cloud.

## Sources


- [Microsoft Learn: RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Configure RDP Shortpath for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath)
- [Microsoft Learn: Use RDP Multipath to improve Azure Virtual Desktop connections](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Session Auto-Reconnect](https://learn.microsoft.com/en-us/azure/virtual-desktop/fast-reconnect)
