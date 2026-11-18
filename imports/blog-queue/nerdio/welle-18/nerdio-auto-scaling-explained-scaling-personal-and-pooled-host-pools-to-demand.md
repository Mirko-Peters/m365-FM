---
title: "Nerdio auto-scaling explained: scaling personal and pooled host pools to demand"
summary: "Nerdio auto-scaling in Nerdio Manager keeps only as many session host VMs running as demand requires, for pooled and personal host pools. This article covers what it controls and which features are Premium only."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-auto-scaling, nerdio-manager-for-enterprise]
keypoints:
  - "Auto-scaling is off by default and enabled per host pool under Auto-scale > Configure. It starts, stops, creates or removes VMs (pooled: scale-out/in; personal: auto-grow/shrink)."
  - "A pooled pool is sized with a base capacity, a minimum of active hosts and a burst range. Values can be counts or percentages that are rounded up to whole hosts."
  - "Scale-in aggressiveness (high, medium, low) decides whether hosts with active or disconnected sessions may be removed outside working hours. High is the default."
  - "Personal host pools use either user-driven mode (stop after sign-out) or schedule-based mode (power on and off in working hours), with optional auto-grow, auto-shrink (Premium only) and auto-heal."
  - "Nerdio lists Advanced Auto-scale, multiple triggers, intelligent pre-stage, rolling drain mode and personal auto-grow as Premium only. Basic auto-scale and Auto-heal are in Core and Premium."
faq:
  - q: "Is Nerdio auto-scaling on by default?"
    a: "No. Nerdio's help pages say auto-scale is disabled by default. You enable it per host pool under Auto-scale, then Configure, by switching the Auto-scale toggle to Enabled and saving."
  - q: "Does Nerdio auto-scaling work for personal host pools as well as pooled ones?"
    a: "Yes. Nerdio documents a separate configuration for personal host pools with user-driven and schedule-based modes, and a dynamic configuration for pooled pools. The settings differ: pooled pools use sizing and scaling triggers, personal pools use start and stop rules per desktop."
  - q: "Which parts of Nerdio auto-scaling need the Premium edition?"
    a: "Nerdio's entitlement page lists Advanced Auto-scale, multiple triggers, intelligent pre-stage, rolling drain mode, secondary Auto-scale configuration and personal host pool auto-grow and auto-shrink as Premium only. Auto-scale profiles and Auto-scale Insights are also Premium only on their help pages, and Insights is in Public Preview. Basic AVD Auto-scale and Auto-heal are in Core and Premium."
---

Nerdio auto-scaling is a function of Nerdio Manager that keeps only as many session host VMs running as the current demand requires. Idle VMs are stopped or deleted, and VMs are started or created when demand rises or at set times of the day. This article explains the moving parts for pooled and personal host pools, with settings taken from Nerdio's help center.

## What auto-scaling controls

[Nerdio auto-scaling](https://www.m365.fm/entity/nerdio-auto-scaling/) belongs to [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) from [Nerdio](https://www.m365.fm/entity/nerdio/). It is switched off by default.

It acts at three levels:

- **Compute.** For pooled pools Nerdio can start, stop, create and remove session hosts. For personal pools it powers desktops on and off and can also add and remove desktops.
- **OS disks.** A stopped host can use a cheaper OS disk type and return to the running type before it starts.
- **Repair.** Auto-heal can restart or remove a host that the AVD agent reports as unavailable and that has no active session.

Nerdio's host pool overview distinguishes two kinds of pool. A *static* host pool has a fixed number of hosts set by the administrator, with auto-scale off. A pool with auto-scale enabled creates and removes hosts based on demand. The help page notes that this kind was previously called a "dynamic" host pool. Pools that exist when Nerdio Manager is first deployed to an existing environment start as static. To convert one, go to Cloud Desktops, Azure Virtual Desktop, Workspaces, select the workspace and choose **Convert Host Pool** in the Static Host Pools area. Active sessions are not affected, and auto-scale stays off until you enable it.

Nerdio's "dynamic" is its own host pool type, separate from Microsoft's [dynamic autoscaling](https://www.m365.fm/entity/avd-dynamic-autoscaling/) in Azure Virtual Desktop scaling plans.

## Where to switch it on

For both pool types the path in Nerdio Manager is the same: open the host pool's more options menu, hover over **Auto-scale**, select **Configure**, set the options, toggle **Auto-scale** to Enabled at the bottom of the page and select **Save**. Common settings include the time zone, a VM name prefix (up to 10 characters, plus a random four-character suffix) or a pattern such as `AVDHOST{###}`, network, image, VM size and the running and stopped OS disk types.

## Pooled host pools: sizing and triggers

**Host pool sizing** has three values. The base host pool capacity is the set of hosts that always belong to the pool, running or stopped. The minimum active host capacity is the number of running hosts that are always available. Burst capacity covers extra hosts created above the base when demand requires, and these go first in after-hours scale-in. You can enter counts or percentages. With percentages, values are relative to the base and rounded up to whole hosts. Nerdio's example: a base of 9 hosts with 30 percent minimum active and 70 percent burst shows 3 and 7 hosts, a possible total of 16.

A host counts as active either when the VM is started in Azure or when the AVD agent reports it as Available; the help page calls the first rarely appropriate.

**Scaling triggers** decide when to add or remove capacity:

- **CPU or RAM usage:** the average across running hosts exceeds a value for a set duration.
- **Average active sessions:** scale out above a per-host average, scale in below it.
- **Available sessions:** maintain a number of free sessions, with separate values for working hours and for outside them.
- **User-driven:** hosts start on connect and stop a set number of minutes after the last user signs out.

With the Premium edition you can combine up to three triggers. Scale-out happens when any scale-out condition is met, and scale-in only when all scale-in conditions are met. Nerdio's example is CPU at 65 percent for 15 minutes or 90 percent for 5 minutes, whichever comes first. The session limit per host and the load balancing mode ([breadth-first](https://www.m365.fm/entity/avd-breadth-first-load-balancing/) or [depth-first](https://www.m365.fm/entity/avd-depth-first-load-balancing/)) also apply, and [Start VM on Connect](https://www.m365.fm/entity/avd-start-vm-on-connect/) can be enabled.

**Scale-in restrictions** limit when hosts are removed and how far sessions are consolidated:

| Aggressiveness | What happens after hours |
|---|---|
| High (default) | Hosts with active or disconnected sessions can be removed or powered off. Empty hosts go first, then hosts with the fewest sessions. Users with active sessions get a warning. |
| Medium | Only hosts with disconnected sessions are removed. Hosts with active sessions stay. |
| Low | Only hosts with no sessions at all are removed. This is the least disruptive setting, but it does not guarantee any scale-in. |

**Rolling drain mode** (Premium only) creates one or more windows, outside the scale-in restriction window, that put a percentage of hosts into [drain mode](https://www.m365.fm/entity/avd-drain-mode/) so that they can shut down sooner. Scale-in then prefers hosts with the fewest active sessions, then hosts in drain mode, then hosts with the fewest total sessions. **Pre-staging** (Nerdio's Premium list names "Intelligent pre-stage"; see the edition section) makes a set number of hosts active by the start of work hours, with a scale-in delay during which they are not removed. An **alternative schedule**, for example for weekends or holidays, can be selected by days or dates. The alternative schedule page names no edition. Nerdio's Premium list names a "Secondary Auto-scale configuration" without saying what it covers; it may be this feature, so check with Nerdio before you rely on it in Core. The estimated monthly cost at the top of the page reflects only the default schedule.

**Automatically Re-image Used Hosts** can be Disabled, Always (after a user has signed in, and for multi-session hosts as soon as the last user signs out) or During scale-in restrictions only, which Nerdio says limits the risk of reduced session capacity at other times.

## Personal host pools: two modes

Nerdio treats [personal host pools](https://www.m365.fm/entity/avd-personal-host-pool/) differently because each desktop belongs to one user, and offers two auto-scale modes.

**User-driven mode** offers a Start VM on Connect option. A desktop starts when the user connects and stops a configurable time after all users have signed out, but only if there are no active or disconnected sessions. There is a switch to bypass drain mode before shutdown. Two pre-staging blocks exist only in this mode. **Pre-stage hosts** starts stopped hosts, activates hosts in drain mode, switches stopped disks to the running type and keeps hosts from stopping, from the start of work hours until a scale-in delay ends. **Pre-stage Host OS Disks** converts disks on chosen days and times and can leave unassigned desktops on the stopped disk type.

**Schedule-based mode** powers desktops according to working days and hours. Its key setting is power-off aggressiveness:

- **High** powers off all hosts, including those with active sessions, after warning users.
- **Medium** powers off hosts without active sessions, including disconnected ones.
- **Low** powers off only hosts with no active or disconnected sessions.

Power-on and power-off timing can each be set to never, once or continuously. With once, hosts changed manually outside the schedule are left alone; with continuously, Nerdio also acts on manual changes. Schedule-based mode also offers Start VM on Connect and an option to include hosts without an assigned user.

Both modes share these features:

- **Intelligent disk pre-staging**, which requires AVD insights to be enabled for the pool. It offers a hybrid mode (defined schedule plus learned staging) and an automated mode that stages disks 30 minutes before anticipated logons for existing users; new users follow the defined schedule until enough data exists.
- **Auto-grow** (Premium only), which adds desktops when unassigned ones fall below a number or percentage.
- **Auto-shrink** (Premium only), which deletes desktops that have not been used for a set number of days. Inactive VMs are shut down and tagged as pending deletion, with a default pending period of 24 hours. User emails need Notifications enabled on the System > Settings > Nerdio page.

Nerdio's dev and test article adds that if Azure's own Start VM on Connect powers a host outside Nerdio Manager, the disk change may not happen automatically; Nerdio suggests pre-staging hosts to the running disk type.

## Profiles, Insights and editions

Nerdio's host pool profiles are reusable definitions for auto-scale, FSLogix, RDP, directory and session time limit settings. Auto-scale profiles have three modes: shared for pooled pools, and schedule-based or user-driven for personal pools. They are created under Cloud Desktops, Azure Virtual Desktop, Host Pool Profiles, and assigned to one or more pools. The page states that auto-scale profiles are available only in the Premium edition.

**Auto-scale Insights** is described for dynamic host pools, meaning pools with auto-scale enabled; its steps cover no personal-pool case. Under Auto-scale, then Configure, you enter the Host Session Density. The view shows historic usage and predicted requirements in 30-minute samples, based on the last 7 calendar days. With fewer than 2 days of data no details are shown. Nerdio states that the feature is only available in the Premium edition and is in Public Preview.

Nerdio's entitlement page states that the features on its Premium list require a Premium entitlement (Windows Cloud Premium or AVD Premium) and are not included with Core. Under AVD Management it lists Advanced Auto-scale, multiple Auto-scale triggers, Intelligent pre-stage, Rolling drain mode, Secondary Auto-scale configuration and personal host pool auto-grow / auto-shrink. The page does not say whether "Intelligent pre-stage" means pre-stage hosts or intelligent disk pre-staging, so check which one you rely on.

Nerdio's pricing page separates three rows: AVD Auto-scale and AVD Auto-heal are checked for both Core and Premium, while Advanced AVD Auto-scale (multiple scaling triggers, flexible schedules, rolling drain modes, intelligent capacity management) is checked for Premium only. Our reading: basic AVD Auto-scale and Auto-heal are available in Core, and the items above need Premium. Nerdio's 2024 version 6.0 announcement also lists enhanced compute scaling as Premium. Custom licensing agreements can differ from this standard model.

## Practical points before enabling it

1. Decide which pool type each workload needs. Nerdio's dev and test guidance suggests separate pools for mixed user types.
2. Our recommendation: set the session limit per host first, because capacity maths depends on it.
3. Our recommendation: try low scale-in aggressiveness in a pilot pool, check the history, then move to medium or high. Nerdio notes that Low gives no guarantee that the pool is ever scaled in.
4. Enable messaging so users get a warning before a host is removed.
5. Keep one scaling mechanism per pool. Microsoft Learn says not to use autoscale together with other Microsoft or third-party scaling tools and to disable those on pools that get a scaling plan, and that dynamic scaling cannot be combined with other scaling scripts. Learn does not name Nerdio. Our reading: treat Nerdio auto-scale and a native scaling plan as mutually exclusive on one pool, and ask Nerdio if you need an exception.

## Sources

- [Nerdio help: NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio: Enterprise pricing and feature details](https://getnerdio.com/pricing/enterprise/)
- [Nerdio help: Enable dynamic host pool Auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
- [Nerdio help: Enable personal host pool Auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124320032653)
- [Nerdio help: Host pool profiles](https://nmehelp.getnerdio.com/hc/en-us/articles/26124342722701)
- [Nerdio help: Auto-scale Insights](https://nmehelp.getnerdio.com/hc/en-us/articles/29088961716109)
- [Nerdio help: Overview of host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517-Host-Pools)
- [Nerdio help: Convert a static host pool to dynamic](https://nmehelp.getnerdio.com/hc/en-us/articles/26124321369613-Convert-a-static-host-pool-to-dynamic)
- [Nerdio help: Auto-scale Strategies for Dev and Test Workloads](https://nmehelp.getnerdio.com/hc/en-us/articles/44545451458061-Auto-scale-Strategies-for-Dev-and-Test-Workloads)
- [Nerdio: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5 (2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
