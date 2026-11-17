---
title: "Disconnect and sign-out time limits in Azure Virtual Desktop explained"
summary: "In Azure Virtual Desktop a session can end for several unrelated reasons: Windows session time limits, autoscale timers, session lock and Conditional Access. This article explains what each clock measures and what it does to the session, so you can choose the right one before you configure anything."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop]
keypoints:
  - "A disconnected session is one the user has not signed out of. Learn's autoscale FAQ says that with its \"Stop VMs when VMs have no active sessions\" setting autoscale counts disconnected sessions as active; only signing out or ending the session removes them."
  - "Windows has three timers under Session Time Limits (disconnected, active but idle, active) plus a switch that turns the idle and active timeouts from disconnect into end session. Without them, Learn's policy reference says sessions stay for an unlimited time."
  - "Autoscale has its own clocks: a forced sign-out wait time during ramp-down in pooled host pools, and in personal host pool schedules settings of 0 to 360 minutes that trigger a VM action (deallocate, hibernate or nothing) but do not end sessions."
  - "Session lock with single sign-on disconnects by default. Sign-in frequency does not end a connection that is already established: it applies only when a new access token is needed. Neither is a session time limit."
  - "Match the clock to the problem: lingering disconnected sessions, idle desktops, long-running sessions, security re-checks and VM shutdown each point to a different mechanism."
faq:
  - q: "Does a disconnect time limit sign users out?"
    a: "It ends the session. Learn's policy reference says that when you enable Set time limit for disconnected sessions, disconnected sessions are deleted from the server after the specified time. Until then the session keeps running and the user can reconnect to it. Our reading: unsaved work in programs that are still running is lost when the session is deleted."
  - q: "Is an idle limit a sign-out or a disconnect?"
    a: "A disconnect by default. Learn says the idle and active limits disconnect the session unless the policy End session when time limits are reached is enabled, in which case the session is ended. That policy applies only to limits an administrator has set, not to disconnects caused by network or connectivity problems."
  - q: "Do these Windows policies replace the autoscale settings?"
    a: "No. Learn's autoscale FAQ describes them as complementary mechanisms with different purposes. Autoscale consolidates and deallocates hosts and, per its FAQ, counts disconnected sessions as active under its \"Stop VMs when VMs have no active sessions\" setting; the Windows disconnected-session limit turns disconnected sessions into no session."
---

A disconnected session in Azure Virtual Desktop is still a session: it stays on the session host and the user is sent back to it on reconnect. It only goes away when the user signs out or something ends it. This article explains the clocks that can end or disconnect a session, what each one measures, and which problem each one solves.

The step-by-step configuration of the Windows policies is the subject of "Setting idle, disconnected and active session limits with policy". The ramp-down behavior of autoscale is covered in "Force sign out vs wait for sign-out: choosing the ramp-down behaviour". Here the goal is the map: what the clocks are and how they differ.

## Disconnected and signed out are different states

Microsoft Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) defines these user session states:

- **Active:** the user has signed in and connected to a desktop or RemoteApp resource.
- **Disconnected:** an inactive session that the user has not signed out of. Closing the remote session window without signing out makes the session disconnected. On reconnect the user is redirected to that session on the same session host, and it becomes active again.

For capacity this distinction matters. A disconnected session still belongs to a session host, and autoscale counts it. When forced sign-out is off, Learn's create-and-assign page says to select "VMs have no active or disconnected sessions" or "VMs have no active sessions" for ramp-down; it does not explain how the two differ, so test both on a pilot pool. The autoscale FAQ calls the second option "Stop VMs when VMs have no active sessions" and says that with it autoscale treats disconnected sessions as active, because users may reconnect immediately. Its example uses a maximum session limit of 5 and a capacity threshold of 90 percent, so each host counts as 4.5 sessions. Six disconnected users need 6 / 4.5 = 1.33, rounded up to two hosts. Nine disconnected users also need two hosts. By the FAQ's description, a host with only disconnected sessions keeps running unless forced sign-out or a time limit ends them.

## The Windows session time limits

The core clocks are Remote Desktop Services policies on the session host. In Group Policy they are under Computer Configuration, Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host, Session Time Limits. Learn's Policy CSP reference for ADMX_TerminalServer lists them for Windows 10 and Windows 11 editions including Enterprise. Learn's session lock article shows that [Intune](/entity/intune/) can set Remote Desktop Session Host policies through the settings catalog under Administrative templates; the classic route is a [Group Policy](/entity/group-policy/) object.

| Setting | What it measures | What happens at the limit |
|---|---|---|
| Set time limit for disconnected sessions | Time since the session was disconnected | The disconnected session is deleted from the server |
| Set time limit for active but idle Remote Desktop Services sessions | Time without user input in a connected session | The session is disconnected (or ended, see below) |
| Set time limit for active Remote Desktop Services sessions | Total time the session has been connected, whatever the user does | The session is disconnected (or ended) |
| End session when time limits are reached | Not a clock: it changes the outcome of the two limits above | The session is ended instead of disconnected |

Details from the policy reference:

- **Defaults are unlimited.** Learn says disconnected sessions are maintained for an unlimited time by default, and sessions may stay active but idle, or active, for an unlimited time.
- **Warnings.** The idle and the active limit warn the user two minutes before the session disconnects. Learn describes no warning for the disconnected-session limit.
- **Console sessions are exempt.** All three limits say they do not apply to a console session.
- **Computer beats user.** Each setting appears in both Computer Configuration and User Configuration. If both are configured, Computer Configuration takes precedence.
- **Only explicit limits.** The End session setting applies only to time-outs the administrator set. Learn says it does not apply to time-out events caused by connectivity or network conditions.

Our reading of how these combine: with the End session policy off, an idle or active limit moves the session into the disconnected state, and the disconnected limit then runs from that moment. Two stages with different lengths are therefore possible, for example a short idle limit that disconnects, followed by a longer disconnected limit that deletes. Learn does not spell this chain out, so test it first.

The Windows Server 2008 R2 archive page for the same settings also lists a separate setting, Set time limit logoff of RemoteApp sessions. It says that closing a RemoteApp program normally disconnects the session, and that the setting keeps it disconnected for a set time before it is logged off. That is archived 2012 documentation and the current ADMX_TerminalServer page does not list the setting, so check your own image first.

## Autoscale has its own clocks

Autoscale acts on the VMs, and its timers are set in the [scaling plan](/entity/avd-scaling-plan/), where the options differ by host pool type. Learn's autoscale FAQ treats autoscale and the Windows disconnected-session limit as separate, complementary mechanisms.

**Pooled host pools.** In the ramp-down phase you can choose to force users to sign out. Learn says autoscale then puts the host in [drain mode](/entity/avd-drain-mode/), notifies the users that they will be signed out, signs them out after the wait time, and deallocates the VM. The autoscale FAQ says idle, disconnected and active sessions are all signed out this way, and adds that forced sign-out is possible only during ramp-down: in its example, a 15-minute ramp-down phase with a 20-minute wait time means the schedule moves to off-peak and sessions are not forced out. With or without forced sign-out, capacity threshold and minimum percentage of hosts are still respected: Learn says autoscale shuts down hosts only if all existing sessions, active and disconnected, can be consolidated onto fewer hosts without exceeding the capacity threshold. See [force sign-out](/entity/avd-force-logoff/) and [capacity threshold](/entity/avd-capacity-threshold/). The scaling plan page gives no range for the wait time.

**Personal host pools.** Learn's scaling plan page shows a Disconnect settings group and a Sign out settings group in every phase. "When disconnected for (min)" is the number of minutes a session has been disconnected, and "When logged off for (min)" the number of minutes it has been logged off. Each takes 0 to 360 and an action for the VM: deallocate, hibernate the desktop, or do nothing. Learn describes a VM action here, not a sign-out. Learn warns that FSLogix and App Attach currently do not support hibernate, so do not enable it with either on personal host pools.

One point reads differently across Learn pages. The autoscale FAQ says autoscale for personal desktops only deallocates session hosts if the user has signed out, while the schedule page documents the disconnect setting with a deallocate action. Test the disconnect action on a pilot host before you design around either.

The two layers meet at one point. The scaling plan page says you can configure a time limit policy that applies to all phases to sign out all disconnected users, reducing the used host pool capacity, using Intune or Group Policy. The FAQ lists its "Stop VMs when VMs have no active sessions" setting and the Windows disconnected-session limit as complementary: the first protects connected users and lets autoscale consolidate disconnected ones, while the policy turns disconnected sessions into no session. The FAQ's recommended combination uses a disconnected-session timeout of 15 to 30 minutes and a minimum percentage of 0 in off-peak hours, with the timeout finishing before ramp-down ends.

## Two settings that look like time limits but are not

**Session lock** can disconnect a session. Learn's single sign-on page says that with Microsoft Entra single sign-on, when the remote session is locked by the user or by policy, you can choose between disconnecting the session and showing the remote lock screen. The default is to disconnect. The reasons given include support for passwordless sign-in and re-evaluation of Conditional Access, including multifactor authentication and sign-in frequency, when the user reconnects. In Intune the settings are named "Disconnect remote session on lock for Microsoft identity platform authentication" and "Disconnect remote session on lock for legacy authentication"; the second one defaults to showing the lock screen. Learn says to restart the session hosts after the policy applies. See [single sign-on](/entity/avd-single-sign-on/) for the wider picture.

**Sign-in frequency** does not end a connection. Learn says that after a connection is established, users are not prompted even if the connection lasts longer than the configured frequency. A prompt appears only when a new access token is needed, for instance when a network disruption forces the session to be re-established after that period. For the Azure Virtual Desktop app, Learn lists subscribing, manually refreshing the resource list and authenticating to the gateway during a connection as the points where it is enforced. "Every time" is supported only for the Windows Cloud Login app, with single sign-on enabled.

## Which clock for which problem

| Problem | Mechanism to consider | Note |
|---|---|---|
| Disconnected sessions pile up and keep hosts running | Disconnected-session limit; or force sign-out in ramp-down | The limit works at any hour; forced sign-out only in ramp-down |
| Idle desktops stay connected for hours | Idle limit, optionally with End session | Warning two minutes before |
| A session must not run longer than a fixed time | Active session limit | Applies even when the user is working |
| A personal VM should stop after the user leaves | Personal schedule "When disconnected for" or "When logged off for" | VM action only, 0 to 360 minutes; hibernate caveat for FSLogix |
| Users must re-prove identity | Sign-in frequency, session lock disconnect | Acts at reconnect or token renewal |
| All hosts off at night | Autoscale minimum 0 percent plus a way to end disconnected sessions | FAQ: disconnected sessions count as active under "Stop VMs when VMs have no active sessions" |

## Checks before you choose a limit

1. **Decide disconnect or end.** A disconnect keeps running programs; ending the session discards unsaved work. Give the End session policy a user notice and a pilot group.
2. **Check the user pattern.** Users who close the remote session window without signing out create disconnected sessions. Our reading: an idle limit applies only to active sessions, so it does not clean them up.
3. **Watch the order.** Make sure a disconnected-session limit finishes before ramp-down ends if you expect hosts to switch off.
4. **Scope by host pool.** The policies are applied to session hosts. Our reading: if you assign them to the hosts of one host pool only, a pool for task workers and a pool for developers can carry different values.

## Sources

- Microsoft Learn, Azure Virtual Desktop terminology: https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology
- Microsoft Learn, ADMX_TerminalServer Policy CSP: https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-terminalserver
- Microsoft Learn (archive), Session Time Limits, Windows Server 2008 R2: https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee791741(v=ws.10)
- Microsoft Learn, Azure Virtual Desktop autoscale FAQ: https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq
- Microsoft Learn, Create and assign an autoscale scaling plan: https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan
- Microsoft Learn, Autoscale scaling plans and example scenarios: https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios
- Microsoft Learn, Configure single sign-on for Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on
- Microsoft Learn, Configure the session lock behavior: https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-session-lock-behavior
- Microsoft Learn, Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access: https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa
