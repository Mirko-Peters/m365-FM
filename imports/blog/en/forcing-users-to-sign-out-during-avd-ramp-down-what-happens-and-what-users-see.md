---
title: "Forcing users to sign out during AVD ramp-down: what happens and what users see"
summary: "When force sign-out is enabled in the ramp-down phase, autoscale drains the host with the fewest sessions, notifies its users, waits, ends the remaining sessions and deallocates the VM. This article follows that sequence, shows Microsoft's worked scenario and lists what Learn does not document about the user experience."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-force-logoff, avd-scaling-plan]
keypoints:
  - "Force sign-out works only in the ramp-down phase of a pooled scaling plan schedule. Learn says the setting does not sign out users in any other phase, and autoscale cannot force users out of a personal desktop."
  - "The sequence is: select the host with the fewest sessions, put it in drain mode, notify its users, wait, end the remaining sessions, deallocate the VM."
  - "Idle, disconnected and active sessions are all forced to sign out if the users do not sign out during the wait time."
  - "If the wait time is longer than the ramp-down phase, the schedule moves to off-peak and sessions are not forced out."
  - "Learn does not publish the notification text, a default wait time or the wait time limits, so check them in a test host pool before you tell users what to expect."
faq:
  - q: "Does force sign-out also sign out disconnected sessions?"
    a: "Yes. Microsoft Learn says idle, disconnected and active sessions are forced to sign out if the users do not sign out during the ramp-down wait time. The glossary defines a forced sign-out as ending an active or disconnected session without the user's consent."
  - q: "Can a forced-out user start a new session on the host that is about to shut down?"
    a: "Not as a new user. Autoscale puts the host in drain mode first, and the load balancer does not consider drained hosts for new users. It sets drain mode back to off after it has deallocated the VM."
  - q: "Does force sign-out work for personal host pools?"
    a: "No. The autoscale FAQ says autoscale for personal desktops only deallocates a session host if the user has signed out of the session."
---

Force sign-out is a setting in the ramp-down phase of a pooled autoscale schedule. When it is on, autoscale picks the session host with the fewest sessions, puts it in drain mode, notifies the users on it, waits for the configured time, ends any sessions that remain and deallocates the VM. This article explains each step, shows Microsoft's worked example and lists what Learn leaves undocumented. A separate article compares force sign-out with waiting for users to sign out. Sources were retrieved on 17 November 2026.

## What the setting is

Microsoft Learn's glossary defines a forced sign-out as the service ending an active or disconnected user session without the user's consent. In the scaling plan schedule it appears on the ramp-down tab. The portal label for pooled plans with power management autoscaling is **Force logoff of users**. For dynamic autoscaling, which Learn labels preview in its glossary and scenarios pages, the label is **Force logoff users**. See [force sign-out](/entity/avd-force-logoff/) and the [scaling plan](/entity/avd-scaling-plan/) for the surrounding objects.

Three scope rules come from Learn:

- Only ramp-down. The scenarios page says the force logoff setting does not sign out users in any other phase. The FAQ gives the reason that matters in practice: if the ramp-down phase is 15 minutes long and the wait time is 20 minutes, the schedule shifts to off-peak and sessions are not forced out.
- Pooled pools only. The FAQ says autoscale for personal desktops only deallocates a host if the user has already signed out.
- Not a replacement for consolidation. Autoscale shuts down hosts only if all existing sessions, active and disconnected, fit on fewer hosts without exceeding the [capacity threshold](/entity/avd-capacity-threshold/). The minimum percentage of hosts is respected too.

## The sequence, step by step

Learn's scenarios, create-and-assign and FAQ pages describe the order:

1. **Consolidation check.** Autoscale calculates the hosts needed: total sessions (active plus disconnected) divided by the product of the maximum session limit and the capacity threshold. Only hosts beyond that number are candidates.
2. **Host selection.** Autoscale selects the host with the fewest user sessions, active and disconnected. If several hosts have equal numbers, the scenarios page says it chooses at random.
3. **Drain mode.** The selected host goes into [drain mode](/entity/avd-drain-mode/), so it accepts no new sessions from new users.
4. **Notification.** Autoscale sends the users on that host a notification that they will be signed out after a certain time.
5. **Wait.** Autoscale waits for the configured time. Users can sign out themselves during this period.
6. **Forced sign-out.** Users still connected, idle or disconnected are signed out.
7. **Deallocation.** Autoscale deallocates the VM and then sets the AllowNewSessions setting back to true, which turns drain mode off. For dynamic pools Learn says it deallocates or deletes the VM.

The FAQ also says that, even with force sign-out enabled, autoscale still consolidates disconnected users during ramp-down. The forced sign-out applies only to users who remain after the wait time ends.

## A worked example from Learn

Scenario 3 on the scenarios page uses six session hosts, depth-first load balancing, a 75 percent capacity threshold, a 10 percent minimum of hosts and a maximum session limit of 5. Four hosts are available, so capacity is 20, and four sessions are running, so used capacity is 20 percent.

- Autoscale can turn off two hosts without exceeding 75 percent. Every host has sessions, so it uses force sign-out. The session counts are equal, so it picks two hosts at random, drains them, notifies the users, signs out whoever remains after the wait time and turns the hosts off. Two hosts remain with capacity 10.
- Two users reconnect and sessions rise to four, 40 percent used. Autoscale does not turn off another host, because one host with capacity 5 and four users would be at 80 percent.
- One user signs out, leaving three sessions on two hosts, 30 percent. Now one more host can go. Autoscale selects the one with the fewest sessions, drains it, notifies its users and signs out the rest after the wait.
- The forced-out user reconnects, and three sessions now run on one host, 60 percent. The last host stays on. Learn says autoscale keeps at least one host running during ramp-down when the minimum percentage would otherwise be breached.

You can run the same check with your own values. Suppose four hosts are running at the start of ramp-down with 12 sessions in total, a maximum session limit of 20 and a threshold of 75 percent. The consolidation formula gives 12 / (20 x 0.75) = 0.8, which rounds up to one host. Three hosts are therefore candidates, subject to the minimum percentage of hosts, and autoscale drains and signs out the hosts with the fewest sessions first. The numbers are illustrative, not from Learn.

The example shows that a forced sign-out is not the end of a user's day. A user whose host is shut down can sign in again and is placed on a host that is still available.

## What users see, and what is not documented

Learn documents less about the user side than about the autoscale side. The pages state:

- Users on the selected host receive a notification that they are going to be forcibly signed out after a certain time. The scenarios page also describes a notification that the session host will be turned off.
- After the wait time the session ends. Learn calls it a forced sign-out, not a disconnect, so plan for unsaved work to be lost.
- A user who reconnects while the host is drained is handled by the load balancer. Learn's load-balancing page says that a user with an active or disconnected session on a drained host is still redirected to that host, and that for new users the load balancer does not consider drained hosts. Once the forced sign-out has ended the old session, the user no longer has a session there, so the next connection goes to another host.
- For personal desktops, the FAQ says autoscale does not use drain mode when it deallocates after a sign-out or disconnect. A user who connects during deallocation receives the error "No resources available".

Learn does not state the notification text, the default wait time, the allowed range of the wait time, or how the message appears in the Remote Desktop client or Windows App. The FAQ and scenarios pages use 15 minutes only as an example. The create-and-assign page does not name a field for them either, so confirm the portal fields and run a test in a non-production host pool before you describe the experience to users. Do not copy the text of a notification from a forum post into your user communication without checking it.

## Interaction with other settings

- **Exclusion tag.** Hosts that carry the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) are not started, stopped or changed in drain mode. Because autoscale does not stop them, their users are not signed out by the scale-down.
- **Manual drain mode.** The FAQ says autoscale overrides drain mode on all VMs included in scaling, no matter who set it. Use the tag for maintenance hosts.
- **Time limit for disconnected sessions.** Learn suggests a Group Policy or Intune setting, "Set time limit for disconnected sessions", under Remote Desktop Session Host and Session Time Limits. The FAQ says to make sure the timeout completes before the end of the ramp-down phase. That policy removes disconnected sessions, which autoscale otherwise assumes may reconnect.
- **Manual cleanup.** The Az.DesktopVirtualization module has `Send-AzWvdUserSessionMessage`, which takes a message title and body, and `Remove-AzWvdUserSession`, which has a `-Force` switch. You can use them for a single host outside autoscale.

## Practical checks

- Set the wait time shorter than the ramp-down phase, with margin. The FAQ's 15 and 20 minute example is the failure case.
- Tell users when ramp-down starts and what sign-out means for open files. The sources do not describe how applications react.
- Check whether your profile solution flushes data cleanly on sign-out. Learn's autoscale pages do not cover [FSLogix](/entity/fslogix/) behavior at forced sign-out.
- Keep the maximum session limit realistic, because the consolidation maths depends on it. See the sizing guide in this series.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Host pool load-balancing methods](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-load-balancing)
- [Microsoft Learn: Send-AzWvdUserSessionMessage](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/send-azwvdusersessionmessage)
- [Microsoft Learn: Remove-AzWvdUserSession](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/remove-azwvdusersession)
