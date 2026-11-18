---
title: "Nerdio auto-scaling vs native AVD autoscale: a fair comparison"
summary: "Native Azure Virtual Desktop autoscale and Nerdio auto-scaling both start and stop session hosts on a schedule but differ in triggers, disks, scheduling, repair and cost. Nerdio's comparison pages predate July 2026."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-auto-scaling, nerdio-manager-for-enterprise]
keypoints:
  - "Native autoscale scales on session-based capacity. Nerdio can also use CPU, RAM, average active and available sessions, combining up to three triggers (Premium only per Nerdio's pages)."
  - "Native power management only starts and stops hosts. Dynamic autoscale, GA in July 2026, can create and delete hosts, so older claims that native scaling cannot add hosts need rechecking."
  - "Native autoscale has no extra charge according to Microsoft Learn. Nerdio is a separate product with its own licence, and its savings figures come from Nerdio and its customers."
  - "Learn's FAQ says native autoscale does not currently support ramping down on specific dates. Nerdio documents an alternative schedule selected by days or dates."
  - "Learn says not to combine autoscale with other Microsoft or third-party scaling tools on a pool. Learn does not name Nerdio, so our reading is one scaling mechanism per pool."
faq:
  - q: "Can I run Nerdio auto-scaling and a native AVD scaling plan on the same host pool?"
    a: "Learn's scenarios page says not to use autoscale together with other Microsoft or third-party scaling tools and to disable those on the pools a scaling plan covers. The plan pages add that autoscale cannot be used with Azure Automation or Logic Apps scaling on the same pool, and that dynamic scaling cannot be used with any other scaling script. The four Learn autoscale pages cited here do not name Nerdio, and Nerdio's dynamic and personal host pool auto-scale pages do not describe combining the two. Our reading is to use one mechanism per host pool; confirm edge cases with Nerdio and Microsoft."
  - q: "Is native AVD autoscale free?"
    a: "Microsoft Learn's autoscale FAQ answers no to the question whether autoscale causes extra charges and refers to the Azure Virtual Desktop pricing page. Learn's cost overview says Azure Virtual Desktop costs come from underlying Azure resource consumption, including the session host VMs and their managed disks, plus licensing, so you still pay for the hosts and disks that autoscale controls."
  - q: "Do the 70 to 75 percent savings that Nerdio quotes apply to my environment?"
    a: "Treat them as vendor figures. Nerdio's pages give up to 70 percent in one place and up to 75 percent in another, and the footnote text for some figures is not shown on the page. Savings depend on your baseline, for example whether hosts already stop after hours, so measure a pilot pool."
---

Native Azure Virtual Desktop autoscale and Nerdio auto-scaling both reduce compute cost by running fewer session hosts outside busy periods. They differ in triggers, scheduling, disk handling, repair features, licensing and where you manage them.

## Two things being compared

Microsoft's autoscale is configured through a [scaling plan](https://www.m365.fm/entity/avd-scaling-plan/). [Power management autoscaling](https://www.m365.fm/entity/avd-power-management-autoscaling/) starts and stops session hosts and is generally available. [Dynamic autoscaling](https://www.m365.fm/entity/avd-dynamic-autoscaling/) can also create and delete session hosts and works only for pooled host pools with [session host configuration](https://www.m365.fm/entity/avd-session-host-configuration/). Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

[Nerdio auto-scaling](https://www.m365.fm/entity/nerdio-auto-scaling/) is a function of [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/). It is off by default and is configured per host pool in the Nerdio console. Nerdio's host pool overview now calls pools with auto-scale enabled "auto-scale enabled" host pools, formerly "dynamic", and says some parts of the product still use the old term. Below, "Premium" means Nerdio lists the feature as Premium only; where a help page names no edition, the article says so. Nerdio's pricing page lists AVD Auto-scale and AVD Auto-heal for Core and Premium, and Advanced AVD Auto-scale for Premium only, which it describes as "multiple scaling triggers, flexible schedules, rolling drain modes, and intelligent capacity management".

## Side-by-side

| Area | Native AVD autoscale | Nerdio auto-scaling |
|---|---|---|
| Pooled trigger | Used capacity compared with a capacity threshold, based on the maximum session limit | CPU or RAM usage, average active sessions, available sessions, or user-driven; up to three combined triggers need Premium |
| Schedule | Four phases (ramp-up, peak, ramp-down, off-peak) per schedule; a plan can hold several schedules, for example weekdays and weekend | Default schedule plus an alternative schedule selected by days or dates (Premium assumed, see Dates row), working hours, pre-stage hosts (no edition named) |
| Dates | Learn FAQ: no ramp-down on specific dates at present | Alternative schedule can target specific dates. The pricing page puts "flexible schedules" under Premium-only Advanced AVD Auto-scale and the help pages name no edition, so assume Premium until Nerdio confirms (our reading). The Premium list also names a "Secondary Auto-scale configuration", possibly the same feature |
| Host creation | Power management: start and stop only. Dynamic: create and delete, with minimum and maximum pool size | Creates and removes hosts in pools with auto-scale enabled, within base, minimum active and burst sizing |
| Personal pools | Per phase: Start VM on Connect, then deallocate, hibernate or do nothing after 0 to 360 minutes disconnected or signed out. Learn's FAQ says autoscale cannot force sign-out of personal desktops | User-driven and schedule-based modes, power-off aggressiveness, auto-grow and auto-shrink (Premium), pre-staging (no edition named) |
| Stopped OS disks | The scaling plan pages describe no disk-type setting | Separate disk type while hosts are stopped. Neither the help page nor the entitlement page names an edition; the Premium list has "Desktop image disk tier optimization", and the pages do not say whether it is the same feature, so confirm |
| Drain mode | Pooled: autoscale puts hosts it will shut down in drain mode and overrides existing drain settings; use an exclusion tag | Optional setting to deactivate (drain) hosts at the start of the scale-in window; rolling drain mode (Premium) |
| Repair | No equivalent in the scaling plan settings | Auto-heal with ordered recovery actions (Core and Premium per Nerdio's pricing page) |
| Cost of the feature | No extra charge per Learn FAQ | Part of a separately licensed product, billed per unique Entra ID user and calendar month at the highest entitlement used |
| Where managed | Documented for the Azure portal and PowerShell; the FAQ says Azure CLI is currently not offered | Nerdio Manager console |

Nerdio rows come from Nerdio's help pages; Premium marks come from its entitlement page dated 6 November 2026, which names "Intelligent pre-stage" without saying whether that means pre-stage hosts, intelligent disk pre-staging or both. Native rows come from Learn. Both are vendor documentation.

## Where the products overlap

Both use schedules, support personal pools and Start VM on Connect, and can warn users before signing them out (native in ramp-down for pooled pools with force sign-out, Nerdio via messaging). For pooled pools the shutdown logic differs. Native autoscale consolidates sessions in ramp-down and puts hosts it will shut down in [drain mode](https://www.m365.fm/entity/avd-drain-mode/) in the cases Learn describes. Nerdio consolidates users at its High scale-in aggressiveness; Medium removes only hosts with disconnected sessions and Low only hosts with no sessions, and drain mode is an optional setting, with rolling drain mode in Premium. Native autoscale also offers an [exclusion tag](https://www.m365.fm/entity/avd-scaling-plan-exclusion-tag/) for keeping individual hosts out of scaling.

One scaling plan can serve several host pools of the same type. Nerdio's reusable host pool profiles also cover FSLogix, RDP, directory and session time limits; the help page names Premium only for auto-scale profiles.

## Claims to recheck

Nerdio's comparison pages are marketing material; the two discussed here were modified in March and June 2026:

- Nerdio's blog comparison (modified 16 June 2026, before the July general availability announcement) says native scaling can only power on hosts that already exist and cannot create new ones. Learn now describes dynamic autoscaling as creating and deleting hosts, so the contrast holds for power management, not for pools with session host configuration.
- The same page says session count is the only trigger native autoscale uses. Learn defines the trigger as used capacity against a threshold, which fits that description. Our reading: capacity is calculated from the maximum session limit, so if per-user load varies widely, a lower limit leaves headroom; test the value in the pilot.
- The "AVD native vs NME" page (modified 31 March 2026) gives native scaling approximately 10 to 20 percent cost reduction and Nerdio over 70 percent. The footnote markers are not resolved on the page, so the basis cannot be checked. A demo call-to-action there says up to 70 percent, while its FAQ says up to 75 percent.
- The same table sets native "Always-on Buffer hosts" against Nerdio "Scale-to-Zero", and "Linear (Reactive)" against "Heuristic & Predictive (Proactive)". Learn's FAQ says native autoscale can turn off all hosts in a pooled pool if the minimum percentage of hosts is 0 percent and no sessions remain, disconnected ones included, which usually needs a session time limit policy. Our reading: the pooled help page describes thresholds, schedules and pre-staging but no learned element, so check what "predictive" means for your pool type.
- Nerdio cites 74 percent monthly compute savings at one bank and a 71 percent reduction in AVD spend at one university adding more than 1,000 users. These describe specific environments, not yours.
- Nerdio estimates about 900 to 1,200 US dollars per month per 100 machines from switching OS disks while hosts are stopped. The saving depends on disk SKU, region, VM count and hours stopped; the help page names no edition for the feature.

## When native autoscale is enough

Native autoscale suits these situations:

- Pooled pools with predictable working hours, where the four phases and a capacity threshold match the load.
- Pools with session host configuration, when creating and deleting hosts is the main need and a minimum and maximum host pool size can express the range.
- A requirement to avoid an extra management product, or teams that already manage pools with Azure tooling and want no additional licence.
- Azure Government: Learn says power management autoscaling is available there and dynamic autoscaling is not. Nerdio's entitlement page lists Azure Government support as Premium only and its pricing page marks it for Core and Premium; confirm with Nerdio.

## When Nerdio auto-scaling may add something

- Load that follows CPU or RAM rather than session counts, or that needs several triggers at once or rolling drain mode (both Premium).
- Schedules with date-specific exceptions such as holidays, which the Learn FAQ says native autoscale does not currently ramp down for. See the Dates row: treat the alternative schedule as Premium until Nerdio confirms.
- Personal pools that need auto-grow or auto-shrink (Premium), or pre-staging (the Premium list names "Intelligent pre-stage"; see the note under the table).
- Lower OS disk cost for stopped hosts (edition to be confirmed, see the table), or auto-heal for broken hosts (Core and Premium per the pricing page).
- Administrators who want scaling, images and host pool profiles in one console, accepting a separate product. Confirm the current Premium list with Nerdio before buying, because custom licensing agreements can differ.

## Limits on both sides

Native autoscale has documented constraints. Scaling plan data must sit in the same region as the host pool configuration, and pooled pools need a custom maximum session limit. Assigning the roles requires the roleAssignments/write permission, part of User Access Administrator and Owner. Power management autoscaling needs the Desktop Virtualization Power On Off Contributor role, assigned to a managed identity on the host pool or to the Azure Virtual Desktop service principal; dynamic autoscaling also needs Desktop Virtualization Virtual Machine Contributor on the service principal. Learn says assigning them below subscription scope prevents autoscale from working properly. The FAQ adds that autoscale neither tracks availability zones nor provides disaster recovery.

Nerdio's reference architecture says Nerdio Manager runs within the customer's Entra ID and Azure subscription, so Nerdio auto-scaling adds a component to deploy and operate (our reading). It also says that to enable auto-scaling, a pool must be created as, or converted to, a dynamic pool, the older name for an auto-scale enabled pool; our reading is that this "dynamic" is a different thing from Microsoft's dynamic autoscaling method. The host pool overview says pools existing when Nerdio Manager is first deployed are static, and that auto-scale can be enabled on a static pool after creation. [Nerdio auto-scaling explained](https://www.m365.fm/community/u/mirko-p/blog/nerdio-auto-scaling-explained-scaling-personal-and-pooled-host-pools-to-demand/) covers the conversion.

## A short procedure to decide

1. List host pools by type, user count and load predictability. Mark pools with date-specific exceptions and personal pools.
2. Record a baseline per pool from Azure Cost Management: compute, disk and storage cost, and current autoscale settings.
3. Pick one pooled and one personal pilot pool, one mechanism per pool (see the FAQ). For Nerdio, enable auto-scale in Nerdio Manager on the pilot pool first (an auto-scale enabled pool, formerly "dynamic").
4. Define measures first: monthly cost per active user, failed or delayed sign-ins, "No resources available" errors, and admin time on scaling changes.
5. Run at least one full monthly cycle, holidays included, then compare with the baseline, not with vendor figures.
6. Decide per pool type. A mixed answer is valid, for example native plans for simple pooled pools and Nerdio for personal pools, provided each pool has only one mechanism.

## Sources

- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio help: NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio: Enterprise pricing and feature details](https://getnerdio.com/pricing/enterprise/)
- [Nerdio help: Overview of host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517-Host-Pools)
- [Nerdio help: Enable dynamic host pool Auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
- [Nerdio help: Enable personal host pool Auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124320032653)
- [Nerdio help: Host pool profiles](https://nmehelp.getnerdio.com/hc/en-us/articles/26124342722701)
- [Nerdio: Nerdio vs. native Azure Virtual Desktop management (auto-scaling comparison blog)](https://getnerdio.com/blog/nerdio-vs-native-azure-virtual-desktop-comparison-series-auto-scaling/)
- [Nerdio: AVD native vs NME](https://getnerdio.com/avd-native-vs-nme/)
- [Nerdio help: Nerdio Manager for Enterprise reference architecture](https://nmehelp.getnerdio.com/hc/en-us/articles/26124355756941-Nerdio-Manager-for-Enterprise-reference-architecture)
