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
  - "Force sign-out does not guarantee that hosts are off at a set time. It ends the remaining idle, disconnected and active sessions only on the hosts autoscale has chosen to shut down, and autoscale chooses them only if all sessions fit on fewer hosts within the capacity threshold and the minimum percentage of hosts."
  - "Waiting costs running hosts. Disconnected sessions count as used capacity, and zero running hosts needs zero sessions and a minimum percentage of 0."
  - "The choice applies to pooled pools. Learn says autoscale cannot be configured to force users out of a personal desktop."
faq:
  - q: "Can I use a time limit for disconnected sessions instead of force sign-out?"
    a: "Partly. Microsoft Learn suggests a Group Policy or Intune setting named Set time limit for disconnected sessions. Learn describes it as automatically signing out disconnected sessions after a timeout. That it leaves connected users alone is this article's reading of the setting, not a Learn statement. The autoscale FAQ lists it next to force sign-out rather than as a replacement."
  - q: "Why do hosts keep running with only disconnected sessions?"
    a: "The autoscale FAQ says disconnected sessions are treated as active for capacity calculations because users may reconnect. Autoscale therefore keeps enough hosts to hold them. Reaching zero running hosts needs zero sessions, including disconnected ones, and a minimum percentage of 0. The FAQ says to also use a Group Policy that signs out disconnected sessions, even when force sign-out is on."
  - q: "Does the setting matter outside ramp-down?"
    a: "No. Learn says forced sign-out is possible only during ramp-down. In other phases the setting does nothing, so a wait that runs past the end of ramp-down is not enforced."
---

Turn force sign-out on when ending the remaining sessions on the hosts autoscale has chosen to shut down is acceptable, and you do not want those hosts to wait for voluntary sign-outs. It does not guarantee that every host is off at a fixed time, because autoscale chooses hosts to shut down only when all sessions fit on fewer hosts. Leave it off when unsaved work or long-running tasks matter more than the cost of running hosts. Microsoft's autoscale FAQ lists a recommended configuration in which force sign-out is an optional part ("if you want to sign out users who don't disconnect within the wait time"). This article compares that configuration with the alternatives for a pooled [scaling plan](/entity/avd-scaling-plan/). How the forced sign-out sequence runs, and where the wait time and message are set, is covered in "Forcing users to sign out during AVD ramp-down: what happens and what users see".

## The three choices on the ramp-down tab

For a power management plan the ramp-down tab has the field [Force logoff of users](/entity/avd-force-logoff/). Learn's create-and-assign page says that if you do not enable it, you must select one of two options:

| Choice | What Learn says | Effect on hosts |
|---|---|---|
| Force logoff of users on | Autoscale drains the host with the fewest sessions, notifies users, signs out those who remain after the wait time and deallocates the VM (dynamic autoscaling: deallocates or deletes) | The chosen host is shut down after the wait time, if all sessions fit on fewer hosts within the capacity threshold and the minimum percentage is kept |
| Off: **VMs have no active or disconnected sessions** | The create-and-assign page names the option and gives no further description | Not described |
| Off: **VMs have no active sessions** | The glossary and scenarios pages describe "Stop VMs when ... no active sessions" as waiting for voluntary sign-outs, then consolidating. Learn does not say this is the option | Disconnected sessions still count toward capacity (FAQ) |

Learn's pages are not consistent about names. The create-and-assign page uses the two portal labels above. The glossary uses "Stop VMs when VMs have no active sessions" and "Force sign out users", while the scenarios page and the FAQ use both "Stop VMs when VMs have no active sessions" and "Stop VMs when no active sessions". Learn does not map the portal labels to these texts one by one, so match the labels in your portal rather than copying these names. For scripts, the ramp-down property `RampDownStopHostsWhen` takes `ZeroSessions` or `ZeroActiveSessions`, and Learn does not state which portal label each value corresponds to.

For dynamic autoscaling the fields are **Force logoff users** and **Minimum percentage of active hosts**, and the FAQ says its guidance applies to both methods. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages still carry preview wording, so check the current page before relying on a limit.

In all cases the same safeguards apply: autoscale shuts a host down only if all existing sessions, active and disconnected, fit on fewer hosts without exceeding the [capacity threshold](/entity/avd-capacity-threshold/), and the [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) is respected. Forced sign-out sits inside these limits. In Learn's scenario 3, autoscale first works out that it can turn off two hosts, then forces out the users on the two hosts it picked. When those users sign back in, autoscale cannot turn off another host, because the used capacity would reach 80 percent against a 75 percent threshold. The FAQ adds that with force sign-out on, autoscale still consolidates disconnected users first, and that force sign-out applies only to users who remain after the wait time.

## The configuration in the autoscale FAQ

The autoscale FAQ answers the question "What's the difference between 'Stop VMs when no active sessions' and using Group Policy to sign out disconnected sessions?" with a recommended configuration of four parts:

1. Enable "Stop VMs when no active sessions" to protect connected users.
2. Enable "Force sign out users" if you want to sign out users who do not disconnect within the wait time.
3. Configure Group Policy to sign out disconnected sessions after 15 to 30 minutes.
4. Set the minimum active hosts to 0 percent during off-peak hours.

The FAQ says this combination protects users during active hours and allows a complete scale-down to zero hosts afterwards. It describes the two mechanisms as complementary: the autoscale setting does not eliminate disconnected sessions, because it assumes users may reconnect, while the policy converts them to no session. Force sign-out is the conditional part, and the other three do not depend on it.

The pages leave a gap. The create-and-assign page reads as if the stop-VMs options belong to the case without forcing, while the FAQ lists both together. The cmdlet example for `New-AzWvdScalingPlanPooledSchedule` sets `-RampDownForceLogoffUser:$true` and `-RampDownStopHostsWhen ZeroSessions`, and the ARM reference has `rampDownForceLogoffUsers` and `rampDownStopHostsWhen` as separate properties. How the portal shows the two together is not described, so check your own portal. Treat the FAQ configuration as the starting point. The rest of the article covers when to deviate from it, and those deviations are this article's judgment, not Learn guidance.

## What waiting costs

Disconnected sessions can keep hosts on. The FAQ states that they are treated as active sessions for capacity calculations, because autoscale assumes users may reconnect. Zero running hosts after hours needs zero user sessions, including disconnected sessions, and a minimum percentage of hosts of 0 percent.

Take the values of the FAQ's six-user example: a maximum session limit of 5 and a capacity threshold of 90 percent. Six lingering disconnected sessions need 6 / (5 x 0.9) = 1.33 hosts, rounded up to 2. The night length is this article's illustration and not a Learn figure: two hosts running for 10 hours are 20 host-hours per night for six users. Your own VM price turns that into a cost.

## What forcing costs

The FAQ says idle, disconnected and active sessions are forced to sign out if the users do not sign out during the ramp-down wait time. Per the create-and-assign page and scenario 3, that applies to the sessions on the hosts autoscale has selected to shut down. The costs are:

- **Unsaved work.** Treat any open document as at risk when the session ends. Test whether your profile solution, for example [FSLogix](/entity/fslogix/), closes cleanly.
- **Late workers.** An active user on a host selected for shutdown is signed out when the wait time runs out, like everyone else on that host. A user on a host that keeps running is not affected.
- **Reconnection.** Scenario 3 shows forced users signing back in. The selected host is in drain mode (FAQ), so they land on another host, and autoscale may then be unable to turn off more hosts.
- **Other time zones.** A scaling plan has one time zone (`-TimeZone` of `New-AzWvdScalingPlan` is the "Timezone of the scaling plan"), so users elsewhere can be active during your ramp-down.

You control the wait time and the notification text, which makes notice possible. A wait that outlasts the ramp-down phase is not enforced.

## The middle path: a disconnected-session time limit

Learn's create-and-assign page and the FAQ point to the policy "Set time limit for disconnected sessions". In Group Policy it sits under Computer Configuration, Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host and Session Time Limits. Intune offers the same setting. The FAQ suggests a timeout such as 15 to 30 minutes and says it should complete before the end of the ramp-down phase. Learn says that once the policy applies to the session hosts, you restart them for the setting to take effect.

With force sign-out off, the pattern is: users who leave keep their session for the timeout, then the session ends and autoscale can deallocate the host, while autoscale waits for users still connected to sign out. With force sign-out on, the policy handles the people who left, and the force setting handles the rest on the hosts selected for shutdown. For zero running hosts the FAQ names the policy together with a minimum percentage of hosts of 0, and force sign-out does not replace either.

## Decision procedure

1. **Is the host pool pooled?** If personal, forced sign-out does not exist: Learn says autoscale cannot force users out of a personal desktop. The FAQ says it deallocates only after the user has signed out, yet the personal schedule has a **When disconnected for (min)** setting with a deallocate action, so Learn is not consistent here. See [pooled and personal host pools](/entity/avd-pooled-host-pool/).
2. **Start from the FAQ configuration.** If ending sessions at the end of the day is acceptable, the four-part configuration above, with force sign-out as its optional second part, is the documented starting point.
3. **Can any user have work that must not be interrupted?** Examples are long exports, shift workers in another time zone or unattended jobs. If yes, keep force sign-out off, or give those users a pool with its own plan.
4. **Do disconnected sessions accumulate overnight?** If yes and cost matters, keep the disconnected-session time limit and measure how many hosts still run after ramp-down.
5. **Must all hosts be off at a fixed time?** For example, a maintenance window or a budget rule. Force sign-out alone does not guarantee it. It ends sessions only on the hosts autoscale selects, and only when the capacity threshold and the minimum percentage allow it. For zero hosts, combine the disconnected-session time limit with a minimum percentage of 0, add force sign-out for users who stay connected, and check in a pilot pool how many hosts still run after ramp-down.
6. **Can you give notice?** Set a clear notification message and tell users the end-of-day behaviour in advance.

## Three example pools

These profiles are illustrations, not Learn cases.

- **Task workers on fixed shifts.** Everyone leaves within a known window and nothing runs unattended. Force sign-out on, with a wait time inside ramp-down, ends stragglers' sessions on the hosts autoscale picks. For zero hosts overnight, add the time limit and a minimum percentage of 0.
- **Knowledge workers who close the laptop and walk away.** Most sessions become disconnected, not active. The disconnected-session time limit removes the lingering sessions, and autoscale can then consolidate and deallocate. Without the limit, expect hosts to remain for those sessions.
- **Mixed teams with analysts running long jobs.** Keep force sign-out off. Put the hosts that run long jobs behind the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/), or give that group its own pool and plan. Autoscale does not stop tagged hosts, and Learn says they still count toward the minimum percentage of hosts.

## A staged rollout

A cautious order, and this article's suggestion, is to start with force sign-out off and the time limit policy on, record how many hosts run after ramp-down for two weeks, then decide whether the remaining cost justifies forcing. Restart the hosts after applying the policy, before you measure.

## Sources

Accessed 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: New-AzWvdScalingPlanPooledSchedule](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpooledschedule)
- [Microsoft Learn: Microsoft.DesktopVirtualization scalingPlans (ARM template reference)](https://learn.microsoft.com/en-us/azure/templates/microsoft.desktopvirtualization/scalingplans)
- [Microsoft Learn: New-AzWvdScalingPlan](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplan)
