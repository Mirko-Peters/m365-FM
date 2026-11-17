---
title: "Forcing users to sign out during AVD ramp-down: what happens and what users see"
summary: "When force sign-out is enabled in the ramp-down phase, autoscale drains the host with the fewest sessions, notifies its users, waits, ends the remaining sessions and deallocates the VM. This article follows that sequence, shows Microsoft's worked scenario and explains where the wait time and the notification text are set."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-force-logoff, avd-scaling-plan]
keypoints:
  - "Force sign-out works only in the ramp-down phase of a scaling plan schedule. Learn says the setting does not sign out users in any other phase, and autoscale cannot force users out of a personal desktop."
  - "The sequence is: select the host with the fewest sessions, put it in drain mode, notify its users, wait, end the remaining sessions, deallocate the VM."
  - "Idle, disconnected and active sessions are all forced to sign out if the users do not sign out during the wait time."
  - "The wait time and the notification text are settings of the schedule, not fixed values: RampDownWaitTimeMinute and RampDownNotificationMessage in PowerShell. Learn's examples use 30 minutes and a short sample message."
  - "Learn states no default and no allowed range for the wait time, and it does not describe how the message is displayed in the client, so test with a pilot host pool."
faq:
  - q: "Does force sign-out also sign out disconnected sessions?"
    a: "Yes. Microsoft Learn says idle, disconnected and active sessions are forced to sign out if the users do not sign out during the ramp-down wait time. The glossary defines a forced sign-out as ending an active or disconnected session without the user's consent."
  - q: "Can I change the notification text and the wait time?"
    a: "Yes. The scaling plan schedule has a wait time in minutes and a notification message for the ramp-down period. Learn's PowerShell example sets 30 minutes and the text 'Please log out of your session.' Learn gives no default and no allowed range for either value."
  - q: "Can a forced-out user start a new session on the host that is about to shut down?"
    a: "Not as a new user. Autoscale puts the host in drain mode first, and the load balancer does not consider drained hosts for new users. It sets drain mode back to off after it has deallocated the VM."
---

Force sign-out is a setting in the ramp-down phase of an autoscale schedule. When it is on, autoscale picks the session host with the fewest sessions, puts it in drain mode, sends the users on it a notification, waits for the configured time, ends any sessions that remain and deallocates the VM. Both the wait time and the notification text are values you set in the schedule. This article explains each step, shows Microsoft's worked example and says what Learn leaves open. Whether to turn the setting on at all is the subject of "Force sign out vs wait for sign-out: choosing the ramp-down behaviour".

## What the setting is

Microsoft Learn's glossary defines a forced sign-out as the service ending an active or disconnected user session without the user's consent. In the scaling plan schedule it appears on the ramp-down tab. The portal label for pooled plans with power management autoscaling is **Force logoff of users**. For dynamic autoscaling the label is **Force logoff users**, and the FAQ says the force sign-out and consolidation logic is the same for both methods.

On status: Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording, so check the current page before relying on a limit. Power management autoscaling is generally available. See [force sign-out](/entity/avd-force-logoff/) and the [scaling plan](/entity/avd-scaling-plan/) for the surrounding objects.

Three scope rules come from Learn:

- **Only ramp-down.** The scenarios page says the force logoff setting does not sign out users in any other phase. If the wait time is longer than the phase, the schedule moves to off-peak and sessions are not forced out. The FAQ's example is a 15-minute phase with a 20-minute wait.
- **Pooled pools only.** The FAQ answers "Can I configure autoscale to force users to sign out of their personal desktop?" with no: autoscale for personal desktops only deallocates a host if the user has signed out. Learn is not uniform here, because another FAQ entry speaks of a session being "signed out or disconnected", and the personal schedule has a **When disconnected for (min)** setting with a deallocate action. What Learn does not offer for personal pools is a forced sign-out.
- **Consolidation still applies.** Autoscale shuts down hosts only if all existing sessions, active and disconnected, fit on fewer hosts without exceeding the [capacity threshold](/entity/avd-capacity-threshold/), and the minimum percentage of hosts is respected.

## The sequence, step by step

1. **Consolidation check.** Autoscale divides the total sessions (active plus disconnected) by the product of the maximum session limit and the capacity threshold and rounds up. Only hosts beyond that number are candidates.
2. **Host selection.** Autoscale selects the host with the fewest sessions. If several hosts have equal numbers, the scenarios page says it chooses at random.
3. **Drain mode.** The host goes into [drain mode](/entity/avd-drain-mode/) and accepts no sessions from new users.
4. **Notification.** Users on that host receive a notification that they will be signed out after a certain time.
5. **Wait.** Autoscale waits for the configured time. Users can sign out themselves.
6. **Forced sign-out.** Users still connected, idle or disconnected are signed out.
7. **Deallocation.** Autoscale deallocates the VM, and for dynamic plans it can delete it. It then sets AllowNewSessions back to true, which turns drain mode off.

Even with force sign-out on, autoscale still consolidates disconnected users first. The forced sign-out applies only to users who remain after the wait time.

## A worked example from Learn

Scenario 3 on the scenarios page uses six session hosts, depth-first load balancing, a 75 percent capacity threshold, a 10 percent minimum of hosts and a maximum session limit of 5. Four hosts are available, so capacity is 20, and four sessions are running, so used capacity is 20 percent.

- Autoscale can turn off two hosts without exceeding 75 percent. Every host has sessions, so it uses force sign-out. The session counts are equal, so it picks two hosts at random, drains them, notifies the users, signs out whoever remains after the wait time and turns the hosts off. Two hosts remain with capacity 10.
- Two users reconnect and sessions rise to four, 40 percent used. Autoscale does not turn off another host, because one host with capacity 5 and four users would be at 80 percent.
- One user signs out, leaving three sessions on two hosts, 30 percent. Now one more host can go. Autoscale selects the one with the fewest sessions, drains it, notifies its users and signs out the rest after the wait.
- The forced-out user reconnects, and three sessions now run on one host, 60 percent. The last host stays on, because turning it off would breach the minimum percentage of hosts.

You can run the same check with your own values. Suppose four hosts run at the start of ramp-down with 12 sessions in total, a maximum session limit of 20 and a threshold of 75 percent. The formula gives 12 / (20 x 0.75) = 0.8, which rounds up to one host. Three hosts are therefore candidates, subject to the minimum percentage, and autoscale drains the hosts with the fewest sessions first. The numbers are illustrative, not from Learn.

A forced sign-out is not the end of a user's day. A user whose host is shut down can sign in again and is placed on a host that is still available.

## What users see, and where you set it

The experience on the user side has three parts.

**The notification.** Learn's create-and-assign page says autoscale sends the users a notification telling them they will be signed out, and the scenarios page describes a notification that the session host will be turned off. The text is yours to set: the schedule has a notification message field for the ramp-down period.

**The wait time.** The schedule also has the number of minutes to wait before hosts are stopped. These are the PowerShell parameters of `New-AzWvdScalingPlanPooledSchedule`, as Learn's example for a pooled schedule sets them:

```powershell
RampDownForceLogoffUser = $true
RampDownWaitTimeMinute = '30'
RampDownNotificationMessage = 'Please log out of your session.'
RampDownStopHostsWhen = 'ZeroSessions'
```

The cmdlet reference describes the wait time as the number of minutes to wait to stop hosts during the ramp-down period and the message as the notification message for users during that period. In the ARM template reference the properties are `rampDownWaitTimeMinutes`, `rampDownNotificationMessage`, `rampDownForceLogoffUsers` and `rampDownStopHostsWhen`, with the values `ZeroActiveSessions` and `ZeroSessions` for the last one. Learn lists no minimum, maximum or default for these properties, and the cmdlet reference shows no default for either. The 30 minutes and the sample text are examples, not recommended values.

**The end of the session.** After the wait time the session ends. Learn calls it a forced sign-out, not a disconnect, so plan for unsaved work to be lost. A user who reconnects while the host is drained is handled by the load balancer: Learn says a user with an active or disconnected session on a drained host is still redirected there, while new users are never sent to a drained host. Once the forced sign-out has ended the old session, the next connection goes to another host. For personal desktops, autoscale does not use drain mode when it deallocates, and a user who connects during deallocation receives "No resources available".

Learn does not describe how the message appears in the Remote Desktop client or the Windows App, or how applications react to the sign-out. Write the message so that it stands on its own, with the time and the action, and check it in a pilot host pool.

## Related settings

The decision between forcing and waiting, the time limit for disconnected sessions, and the cost of each are covered in "Force sign out vs wait for sign-out: choosing the ramp-down behaviour". Two facts matter for the sequence itself:

- **Exclusion tag.** Hosts that carry the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) are not started, stopped or changed in drain mode, so their users are not signed out by the scale-down.
- **Manual drain mode.** Autoscale overrides drain mode on all VMs included in scaling, no matter who set it. See "Drain mode in Azure Virtual Desktop explained".

## Practical checks

- Set the wait time shorter than the ramp-down phase, with margin.
- Put the end-of-day behaviour and the sign-out deadline in the message text, and tell users in advance what a sign-out means for open files.
- Check whether your profile solution flushes data cleanly on sign-out. Learn's autoscale pages do not cover [FSLogix](/entity/fslogix/) behavior at forced sign-out.
- Keep the maximum session limit realistic, because the consolidation maths depends on it. See "How to size the maximum session limit per session host".
- For a single host outside autoscale, `Send-AzWvdUserSessionMessage` takes a message title and body, and `Remove-AzWvdUserSession` has a `-Force` switch. "How to use drain mode for patching and maintenance of session hosts" shows the order of the commands.

## Sources

Accessed 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: New-AzWvdScalingPlanPooledSchedule](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpooledschedule)
- [Microsoft Learn: Microsoft.DesktopVirtualization scalingPlans (ARM template reference)](https://learn.microsoft.com/en-us/azure/templates/microsoft.desktopvirtualization/scalingplans)
- [Microsoft Learn: Host pool load-balancing methods](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-load-balancing)
- [Microsoft Learn: Send-AzWvdUserSessionMessage](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/send-azwvdusersessionmessage)
- [Microsoft Learn: Remove-AzWvdUserSession](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/remove-azwvdusersession)
