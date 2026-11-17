---
title: "Force sign out vs wait for sign-out: choosing the ramp-down behaviour"
summary: "In the ramp-down phase of a pooled scaling plan you either force remaining users to sign out after a wait time or let autoscale wait for them. This guide compares the three portal choices, shows what each costs in running hosts and lost sessions, and gives a short decision procedure."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-force-logoff, avd-scaling-plan]
keypoints:
  - "The ramp-down tab offers force sign-out, or, with it off, a choice between VMs that have no active or disconnected sessions and VMs that have no active sessions. Learn does not walk through the difference between the two off options beyond their labels."
  - "Force sign-out trades unsaved work for certainty: after the wait time, remaining idle, disconnected and active sessions are ended and the host is deallocated."
  - "Waiting costs running hosts. Disconnected sessions count as used capacity, so autoscale keeps hosts for them, and zero running hosts needs zero sessions and a minimum percentage of 0."
  - "A Group Policy or Intune time limit for disconnected sessions is the middle path. Learn says the timeout should finish before ramp-down ends."
  - "The choice applies only to pooled pools. Personal desktops are never force-signed out by autoscale."
faq:
  - q: "Can I use a time limit for disconnected sessions instead of force sign-out?"
    a: "Yes. Microsoft Learn suggests a Group Policy or Intune setting named Set time limit for disconnected sessions to sign out disconnected users after a set time. It removes disconnected sessions but does not touch users who are still connected, so it is a partial alternative."
  - q: "Why do hosts keep running with only disconnected sessions?"
    a: "The autoscale FAQ says disconnected sessions are treated as active for capacity calculations because users may reconnect. Autoscale therefore keeps enough hosts to hold them. Reaching zero running hosts needs zero sessions, including disconnected ones, and a minimum percentage of 0."
  - q: "Does the setting matter outside ramp-down?"
    a: "No. Learn says forced sign-out is possible only during ramp-down. In other phases the setting does nothing, so a wait that runs past the end of ramp-down is not enforced."
---

Turn force sign-out on when ending sessions at a fixed time is acceptable and you want hosts deallocated on schedule. Leave it off when unsaved work or long-running tasks matter more than the cost of hosts that stay on. Between the two sits a time limit for disconnected sessions. This article compares the options Microsoft Learn documents for the ramp-down phase of a pooled [scaling plan](/entity/avd-scaling-plan/) and gives a decision procedure. How the forced sign-out sequence runs is covered in a separate article, "Forcing users to sign out during AVD ramp-down". Sources were retrieved on 17 November 2026.

## The three choices on the ramp-down tab

For a pooled plan the ramp-down tab has the field [Force logoff of users](/entity/avd-force-logoff/). Learn's create-and-assign page says that if you do not enable it, you must select one of two options:

| Choice | What Learn says | Effect on hosts |
|---|---|---|
| Force logoff of users on | Autoscale drains the host with the fewest sessions, notifies users, signs out those who remain after the wait time and deallocates the VM | Hosts beyond the required number are deallocated on schedule |
| Off: **VMs have no active or disconnected sessions** | The create-and-assign page names the option and says autoscale then waits for users to sign out | Learn gives no further description |
| Off: **VMs have no active sessions** | The glossary says autoscale waits for voluntary sign-outs, then consolidates | Disconnected sessions still count toward capacity (FAQ) |

Learn's pages are not consistent about names. The glossary and scenarios page use "Stop VMs when VMs have no active sessions" and "Force sign out users". The FAQ calls the same options "Stop VMs when no active sessions". Match the labels in your portal rather than these texts. Learn gives no worked example for the two off options and does not spell out the difference between them beyond the labels, so test both in a non-production pool.

In all three cases the same safeguards apply: autoscale shuts a host down only if all existing sessions, active and disconnected, fit on fewer hosts without exceeding the [capacity threshold](/entity/avd-capacity-threshold/), and the [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) is respected.

## What waiting costs

Disconnected sessions are the usual reason hosts stay on. The FAQ states that disconnected sessions are treated as active user sessions for capacity calculations, because autoscale assumes users may reconnect. It gives these cases:

- 9 disconnected users, a maximum session limit of 5 and a threshold of 90 percent: 9 / (5 x 0.9) = 2 hosts minimum.
- 6 disconnected users with the same limit and threshold: 6 / 4.5 = 1.33, rounded up to 2 hosts.
- Zero running hosts after hours needs zero user sessions, including disconnected sessions, and a minimum percentage of hosts of 0 percent.

The arithmetic below is this article's illustration and not a Learn figure. If two hosts stay on for a 10-hour night because of six lingering disconnected sessions, that is 20 host-hours per night for six users. Your own VM price turns that into a cost. Learn publishes no prices for this.

## What forcing costs

The FAQ says idle, disconnected and active sessions are forced to sign out if the users do not sign out during the ramp-down wait time. The glossary defines a forced sign-out as ending a session without the user's consent. The costs are therefore:

- **Unsaved work.** The sources do not describe how applications behave at sign-out, so treat any open document as at risk. Whether your profile solution closes cleanly is something to test, for example with [FSLogix](/entity/fslogix/).
- **Late workers.** An active user at the end of ramp-down receives the same treatment as an abandoned session. Autoscale selects the host with the fewest sessions, active and disconnected, and the sources describe no exemption for active users.
- **Timing rules.** The wait time has to fit inside ramp-down. The FAQ's example of a 15-minute phase with a 20-minute wait ends in the off-peak phase, where sessions are not forced out. Learn gives no default or limits for the wait time.

## The middle path: a disconnected-session time limit

Learn's create-and-assign page and the FAQ point to the policy "Set time limit for disconnected sessions". In Group Policy it sits under Computer Configuration, Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host and Session Time Limits. Intune offers the same setting. The FAQ suggests a timeout such as 15 to 30 minutes and says it should complete before the end of the ramp-down phase.

The FAQ contrasts the two mechanisms. The autoscale setting does not eliminate disconnected sessions, because it assumes they may reconnect. The policy eliminates them, converting them to no session. The combination gives a pattern with force sign-out off: users who leave keep their session for the timeout, then the session ends and autoscale can deallocate the host, while users still connected are left alone.

## Decision procedure

1. **Is the host pool pooled?** If personal, the question does not arise. Learn says autoscale for personal desktops only deallocates a host after the user has signed out. See [pooled and personal host pools](/entity/avd-pooled-host-pool/).
2. **Can any user have work that must not be interrupted at the end of the day?** Examples are long exports, shift workers in another time zone or unattended jobs. Start times are entered in the time zone you select for the plan, and Learn says nothing about users in other time zones, so users elsewhere may still be active during ramp-down. If yes, keep force sign-out off, or move those users to a pool with its own plan.
3. **Do disconnected sessions accumulate overnight?** If yes and cost matters, add the disconnected-session time limit and measure how many hosts still run after ramp-down.
4. **Must hosts be off at a fixed time?** For example, a maintenance window or a licence or budget rule. If yes, turn force sign-out on, and size the wait time with margin.
5. **Can you give notice?** Whatever you choose, tell users the end-of-day behaviour. Learn does not document the notification text, so verify it in a test pool before describing it.

## Three example pools

These profiles are illustrations, not Learn cases, and apply the logic above.

- **Task workers on fixed shifts.** Everyone leaves within a known window and nothing runs unattended. Force sign-out on, with a wait time inside ramp-down, gives predictable shutdown. The main work is telling users in advance.
- **Knowledge workers who close the laptop and walk away.** Most sessions become disconnected, not active. Force sign-out may not be needed. The disconnected-session time limit removes the lingering sessions, and autoscale can then consolidate and deallocate on its own. If the limit is missing, expect hosts to remain for the disconnected sessions, as in the FAQ's two-host example.
- **Mixed teams with analysts running long jobs.** Keep force sign-out off. Put the hosts that run long jobs behind the exclusion tag, or give that group its own pool and plan, so the other pool can still scale down.

## Settings to review with the choice

- **Wait time.** Keep it well inside the ramp-down phase.
- **Minimum percentage of hosts.** A value above 0 keeps hosts on regardless of sessions.
- **Exclusion tag.** Hosts with the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) are not started, stopped or changed in drain mode by autoscale, so they are outside either behaviour. Use it for a host that runs a job you cannot interrupt.
- **Maximum session limit.** The consolidation arithmetic uses it, so a poorly sized value changes how many hosts remain. See the sizing guide in this series and [maximum session limit](/entity/avd-maximum-session-limit/).

## A staged rollout

A cautious order is to start with force sign-out off and the time limit policy on, record the number of hosts that run after ramp-down for two weeks, then decide whether the remaining cost justifies forcing. That method is a suggestion rather than a Microsoft recommendation. The only Learn guidance on the choice itself is that consolidation and its safeguards apply in both cases.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scaling-plan)
