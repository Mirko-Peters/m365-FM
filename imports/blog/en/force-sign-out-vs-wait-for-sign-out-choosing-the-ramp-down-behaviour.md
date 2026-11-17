---
title: "Force sign out vs wait for sign-out: choosing the ramp-down behaviour"
summary: "In the ramp-down phase of a pooled scaling plan you either force remaining users to sign out after a wait time or let autoscale wait for them. This guide compares the portal choices, relates them to the configuration listed in Microsoft's autoscale FAQ, and gives a short decision procedure."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-force-logoff, avd-scaling-plan]
keypoints:
  - "The ramp-down tab offers force sign-out, or, with it off, a choice between VMs that have no active or disconnected sessions and VMs that have no active sessions. The create-and-assign page names both off options without describing the difference beyond their labels."
  - "Learn's autoscale FAQ lists a recommended configuration of four parts: stop VMs when no active sessions, force sign-out \"if you want to\" sign out users who do not disconnect within the wait time, a Group Policy time limit of 15 to 30 minutes for disconnected sessions, and a minimum percentage of active hosts of 0 in off-peak."
  - "Force sign-out trades unsaved work for certainty: after the wait time, remaining idle, disconnected and active sessions are ended and the host is deallocated."
  - "Waiting costs running hosts. Disconnected sessions count as used capacity, and zero running hosts needs zero sessions and a minimum percentage of 0."
  - "The choice applies to pooled pools. Learn says autoscale cannot be configured to force users out of a personal desktop."
faq:
  - q: "Can I use a time limit for disconnected sessions instead of force sign-out?"
    a: "Partly. Microsoft Learn suggests a Group Policy or Intune setting named Set time limit for disconnected sessions. It removes disconnected sessions but does not touch users who are still connected, and the autoscale FAQ lists it next to force sign-out rather than as a replacement."
  - q: "Why do hosts keep running with only disconnected sessions?"
    a: "The autoscale FAQ says disconnected sessions are treated as active for capacity calculations because users may reconnect. Autoscale therefore keeps enough hosts to hold them. Reaching zero running hosts needs zero sessions, including disconnected ones, and a minimum percentage of 0."
  - q: "Does the setting matter outside ramp-down?"
    a: "No. Learn says forced sign-out is possible only during ramp-down. In other phases the setting does nothing, so a wait that runs past the end of ramp-down is not enforced."
---

Turn force sign-out on when ending sessions at a fixed time is acceptable and you want hosts deallocated on schedule. Leave it off when unsaved work or long-running tasks matter more than the cost of hosts that stay on. Microsoft's autoscale FAQ lists a recommended configuration in which a time limit for disconnected sessions is one part and force sign-out is an optional one ("if you want to sign out users who don't disconnect within the wait time"). This article compares that configuration with the alternatives. How the forced sign-out sequence runs, and where the wait time and message are set, is covered in "Forcing users to sign out during AVD ramp-down: what happens and what users see". This article is about the decision for a pooled [scaling plan](/entity/avd-scaling-plan/).

## The three choices on the ramp-down tab

For a power management plan the ramp-down tab has the field [Force logoff of users](/entity/avd-force-logoff/). Learn's create-and-assign page says that if you do not enable it, you must select one of two options:

| Choice | What Learn says | Effect on hosts |
|---|---|---|
| Force logoff of users on | Autoscale drains the host with the fewest sessions, notifies users, signs out those who remain after the wait time and deallocates the VM | Hosts beyond the required number are deallocated on schedule |
| Off: **VMs have no active or disconnected sessions** | The create-and-assign page names the option and gives no further description | Not described |
| Off: **VMs have no active sessions** | The glossary and scenarios pages describe "Stop VMs when ... no active sessions" as waiting for voluntary sign-outs, then consolidating. The wording points to this option, but Learn does not say so | Disconnected sessions still count toward capacity (FAQ) |

Learn's pages are not consistent about names, and the portal labels differ from the explanatory pages. The create-and-assign page uses the two portal labels above. The glossary uses "Stop VMs when VMs have no active sessions" and "Force sign out users". The scenarios page uses both "Stop VMs when VMs have no active sessions" and "Stop VMs when no active sessions", and the FAQ uses both forms. Learn does not map the portal labels to these texts one by one, so match the labels in your portal rather than copying these names. For scripts, the ramp-down property `RampDownStopHostsWhen` takes `ZeroSessions` or `ZeroActiveSessions`, and Learn does not state which portal label each value corresponds to.

For dynamic autoscaling the fields are **Force logoff users** and **Minimum percentage of active hosts**, and the FAQ says its guidance applies to both methods. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages still carry preview wording, so check the current page before relying on a limit.

In all cases the same safeguards apply: autoscale shuts a host down only if all existing sessions, active and disconnected, fit on fewer hosts without exceeding the [capacity threshold](/entity/avd-capacity-threshold/), and the [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) is respected.

## The configuration in the autoscale FAQ

The autoscale FAQ answers the question "What's the difference between 'Stop VMs when no active sessions' and using Group Policy to sign out disconnected sessions?" with a recommended configuration of four parts:

1. Enable "Stop VMs when no active sessions" to protect connected users.
2. Enable "Force sign out users" if you want to sign out users who do not disconnect within the wait time.
3. Configure Group Policy to sign out disconnected sessions after 15 to 30 minutes.
4. Set the minimum active hosts to 0 percent during off-peak hours.

The FAQ says this combination protects users during active hours and allows a complete scale-down to zero hosts afterwards. It describes the two mechanisms as complementary: the autoscale setting does not eliminate disconnected sessions, because it assumes users may reconnect, while the policy converts them to no session. Note that the FAQ makes force sign-out conditional: it is the part to enable if you want to end sessions of users who stay connected. The other three parts do not depend on it.

The pages do not fit together without a gap. The create-and-assign page says that if you do not enable forced sign-out you must select **VMs have no active or disconnected sessions** or **VMs have no active sessions**, which reads as if the stop-VMs options belong to the case without forcing. The FAQ lists "Stop VMs when no active sessions" and "Force sign out users" together, and the cmdlet reference example for `New-AzWvdScalingPlanPooledSchedule` sets both `-RampDownForceLogoffUser:$true` and `-RampDownStopHostsWhen ZeroSessions`. The ARM reference has both as separate properties, `rampDownForceLogoffUsers` and `rampDownStopHostsWhen`. How the portal shows the two together is not described on these pages, so check your own portal, and in a script you can set both. Treat the FAQ configuration as the starting point. The rest of the article covers when to deviate from it, and those deviations are this article's judgment, not Learn guidance.

## What waiting costs

Disconnected sessions are the usual reason hosts stay on. The FAQ states that they are treated as active sessions for capacity calculations, because autoscale assumes users may reconnect. Its example: 9 disconnected users, a maximum session limit of 5 and a threshold of 90 percent give 9 / (5 x 0.9) = 2 hosts minimum. Zero running hosts after hours needs zero user sessions, including disconnected sessions, and a minimum percentage of hosts of 0 percent.

The arithmetic below is an illustration and not a Learn figure. If two hosts stay on for a 10-hour night because of six lingering disconnected sessions, that is 20 host-hours per night for six users. Your own VM price turns that into a cost.

## What forcing costs

The FAQ says idle, disconnected and active sessions are forced to sign out if the users do not sign out during the ramp-down wait time. The costs are therefore:

- **Unsaved work.** Treat any open document as at risk when the session ends. Whether your profile solution closes cleanly is something to test, for example with [FSLogix](/entity/fslogix/).
- **Late workers.** An active user at the end of ramp-down is treated like an abandoned session, because the FAQ says idle, disconnected and active sessions are all forced to sign out.
- **Other time zones.** A scaling plan has one time zone (the `-TimeZone` parameter of `New-AzWvdScalingPlan` is the "Timezone of the scaling plan"), so users in other time zones can be active during your ramp-down.

The wait time and the notification text are settings you control, which is what makes notice possible. See the sibling article for the parameters. The timing rule is covered there too: a wait that outlasts the phase is not enforced.

## The middle path: a disconnected-session time limit

Learn's create-and-assign page and the FAQ point to the policy "Set time limit for disconnected sessions". In Group Policy it sits under Computer Configuration, Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host and Session Time Limits. Intune offers the same setting. The FAQ suggests a timeout such as 15 to 30 minutes and says it should complete before the end of the ramp-down phase. Learn says that once the policy applies to the session hosts, you restart them for the setting to take effect.

With force sign-out off, the pattern is: users who leave keep their session for the timeout, then the session ends and autoscale can deallocate the host, while users still connected are left alone. With force sign-out on, the policy handles the people who left, and the force setting handles the rest.

## Decision procedure

1. **Is the host pool pooled?** If personal, forced sign-out does not exist. Learn says autoscale cannot be configured to force users out of a personal desktop and deallocates only after the user has signed out. The personal schedule also has a **When disconnected for (min)** setting with a deallocate action, so a disconnected session can lead to deallocation there. See [pooled and personal host pools](/entity/avd-pooled-host-pool/).
2. **Start from the FAQ configuration.** If ending sessions at the end of the day is acceptable, the four-part configuration above, with force sign-out as its optional second part, is the documented starting point.
3. **Can any user have work that must not be interrupted?** Examples are long exports, shift workers in another time zone or unattended jobs. If yes, keep force sign-out off, or move those users to a pool with its own plan.
4. **Do disconnected sessions accumulate overnight?** If yes and cost matters, keep the disconnected-session time limit and measure how many hosts still run after ramp-down.
5. **Must hosts be off at a fixed time?** For example, a maintenance window or a budget rule. If yes, turn force sign-out on, and size the wait time with margin.
6. **Can you give notice?** Whatever you choose, set a clear notification message and tell users the end-of-day behaviour in advance.

## Three example pools

These profiles are illustrations, not Learn cases, and apply the logic above.

- **Task workers on fixed shifts.** Everyone leaves within a known window and nothing runs unattended. Force sign-out on, with a wait time inside ramp-down, gives predictable shutdown.
- **Knowledge workers who close the laptop and walk away.** Most sessions become disconnected, not active. The disconnected-session time limit removes the lingering sessions, and autoscale can then consolidate and deallocate. Without the limit, expect hosts to remain for those sessions.
- **Mixed teams with analysts running long jobs.** Keep force sign-out off. Put the hosts that run long jobs behind the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/), or give that group its own pool and plan. Tagged hosts are never stopped by autoscale, so their cost continues until you act, and Learn says they still count toward the minimum percentage of hosts.

## Settings to review with the choice

- **Minimum percentage of hosts.** A value above 0 keeps hosts on regardless of sessions.
- **Maximum session limit.** The consolidation arithmetic uses it, so a poorly sized value changes how many hosts remain. See "How to size the maximum session limit per session host" and [maximum session limit](/entity/avd-maximum-session-limit/).

## A staged rollout

A cautious order is to start with force sign-out off and the time limit policy on, record the number of hosts that run after ramp-down for two weeks, then decide whether the remaining cost justifies forcing. That method is a suggestion. It differs from the FAQ configuration, which lists force sign-out as an option from the start. Whichever order you use, apply the policy to the session hosts and restart them before you measure.

## Sources

Accessed 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: New-AzWvdScalingPlanPooledSchedule](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpooledschedule)
- [Microsoft Learn: Microsoft.DesktopVirtualization scalingPlans (ARM template reference)](https://learn.microsoft.com/en-us/azure/templates/microsoft.desktopvirtualization/scalingplans)
- [Microsoft Learn: Autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scaling-plan)
- [Microsoft Learn: New-AzWvdScalingPlan](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplan)
