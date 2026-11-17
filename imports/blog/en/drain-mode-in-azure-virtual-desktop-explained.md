---
title: "Drain mode in Azure Virtual Desktop explained"
summary: "Drain mode stops a session host from accepting new sessions from new users, while existing sessions continue until they end. This article explains what it changes and what it does not, who can turn it on, how autoscale uses and overrides it, and how to read and set it in the portal and with PowerShell."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-drain-mode, avd-session-host]
keypoints:
  - "A drained session host accepts no new sessions. Existing sessions stay connected until the user signs out or an administrator ends them, and administrators can still connect to the server directly."
  - "Drain mode is not a sign-out, a shutdown or a health status. It changes only whether the host can be chosen for new connections."
  - "A user who already has an active or disconnected session on a drained host is still redirected to that host when signing in again. New users are not placed there."
  - "On pooled host pools autoscale turns drain mode on and off no matter who set it. Use the exclusion tag to protect a host. On personal pools autoscale does not use drain mode."
  - "In PowerShell the setting is the AllowNewSession switch of Update-AzWvdSessionHost, and the Session Host Operator role is listed as the prerequisite for the portal procedure."
faq:
  - q: "Does drain mode sign users out?"
    a: "No. Microsoft Learn says existing connections remain active until the user signs out or an administrator ends the session. Drain mode only affects where new sessions are placed."
  - q: "Why did my host leave drain mode by itself?"
    a: "If the host is in a pooled host pool with an autoscale scaling plan, autoscale overrides drain mode on VMs included in scaling, whoever set it. The FAQ says to use exclusion tags to keep a VM out of scaling actions."
  - q: "How long does the portal take to show the change?"
    a: "Learn says that if you refresh the portal immediately after changing drain mode, the status might appear out of sync, and it advises waiting at least 60 seconds before refreshing."
---

Drain mode is a per-host setting that stops a session host from accepting new user sessions. Sessions that already exist are not touched. This article explains what the setting changes, what it does not change, how the load balancer and autoscale treat it, and how to set and read it. For the maintenance procedure that uses it, see the separate articles on patching with drain mode. Sources were retrieved on 17 November 2026.

## What drain mode does

Microsoft Learn describes [drain mode](/entity/avd-drain-mode/) as a way to isolate a [session host](/entity/avd-session-host/) so you can perform maintenance without disrupting the service. The documented effects are:

- **New sessions.** A drained host does not accept new sessions. New connections are redirected to the next available session host.
- **Existing sessions.** They remain active until the user signs out or an administrator ends the session.
- **Maintenance.** Once no sessions remain on the host, you can do the maintenance.
- **Administrator access.** Administrators can still connect to the server directly, without going through the Azure Virtual Desktop service.

In the Azure PowerShell reference the same state is the `-AllowNewSession` parameter of `Update-AzWvdSessionHost`. Learn's autoscale FAQ uses the matching property name AllowNewSessions: when autoscale turns drain mode off after deallocating a VM, it sets AllowNewSessions to true. So drain mode on means new sessions are not allowed, and drain mode off means they are.

## What drain mode is not

- **It is not a sign-out.** Nothing ends because you turned it on.
- **It is not a shutdown.** The VM keeps running, and so does its cost.
- **It is not a health state.** It does not mark the host as unavailable. Health checks and statuses are a separate topic; see the checklist for hosts that show as unavailable.
- **It is not the same as the maximum session limit.** Under depth-first load balancing a host at its [maximum session limit](/entity/avd-maximum-session-limit/) is left out of the query for new sessions, but only until sessions end and there is room again. A drained host stays excluded until you switch drain mode off.

## How the load balancer treats a drained host

Learn's load-balancing page states two rules that explain what users experience:

1. For new users, the load balancer does not consider session hosts in drain mode.
2. A user who has an active or disconnected session and signs in again is redirected to that session host, even if drain mode is enabled.

The second rule matters for planning. A user with a disconnected session on a drained host returns to that host, so the host does not empty by itself while such sessions exist. The host is empty only when its users have signed out or you have ended their sessions. Learn lists both rules as behaviors shared by [breadth-first](/entity/avd-breadth-first-load-balancing/) and [depth-first](/entity/avd-depth-first-load-balancing/) load balancing. It adds that load balancing does not apply to personal host pools.

## Who can set it, and how

Learn's prerequisites for the portal procedure are a host pool with at least one session host and the **Desktop Virtualization Session Host Operator** role. For local Azure PowerShell you need the Az.DesktopVirtualization module, or you can use Azure Cloud Shell.

In the Azure portal:

1. Sign in to the Azure portal and search for **Azure Virtual Desktop**.
2. Select **Host pools**, then the host pool, then **Session hosts**.
3. Select the check box next to the session host and choose **Turn drain mode on**.
4. To allow connections again, select the host and choose **Turn drain mode off**.

Learn's What's new page lists January 2021 as the date when you could enable or disable drain mode for multiple session hosts at once, and February 2021 as the date of bulk drain mode in the session host grid tab. Both entries carry no preview or GA label.

In PowerShell, the reference page for `Update-AzWvdSessionHost` gives this example:

```powershell
Update-AzWvdSessionHost -ResourceGroupName ResourceGroupName `
    -HostPoolName HostPoolName `
    -Name SessionHostName `
    -AllowNewSession:$false
```

`-AllowNewSession` is a switch parameter, so `:$true` is the inverse. The reference page shows only the `:$false` example, so test the reverse on a non-production host first. The reference page for `Get-AzWvdSessionHost` documents no output property for this setting, so the portal remains the documented place to read the state.

## How autoscale uses and overrides drain mode

Autoscale uses drain mode itself, which is the most common source of confusion. The relevant statements are:

- Before autoscale deallocates a pooled session host in ramp-down, it puts the host in drain mode. With forced sign-out it also notifies the users and signs them out after the wait time.
- After the VM is deallocated, autoscale sets AllowNewSessions back to true, which turns drain mode off.
- Autoscale still turns drain mode on or off on VMs included in scaling, no matter who put them in drain mode. To exclude a VM from scaling actions you must use the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/). Tagged hosts are not started, stopped or changed in drain mode.
- For personal host pools, autoscale does not put the host in drain mode before it deallocates it. A user who tries to connect while autoscale is deallocating the host receives the error "No resources available".

So a drain you set by hand on a pooled host may be reversed at the next scaling action unless the host carries the tag. See the [scaling plan](/entity/avd-scaling-plan/) and [force sign-out](/entity/avd-force-logoff/) articles in this series for the ramp-down sequence.

## A short example

Take a pooled host with three sessions: user A is active, user B is disconnected and user C is active. You turn drain mode on. User D signs in for the first time and is sent to another host, because the load balancer does not consider drained hosts for new users. User A signs out. User B reconnects, and because B has a disconnected session on this host, B returns to it even though it is drained. User C stays connected. The host is free for maintenance only after B and C have signed out or an administrator has ended their sessions. If you do nothing, it stays in that state, unless autoscale changes drain mode on a pooled host that is not tagged. This walk-through applies the documented rules and is not a Learn scenario.

## Drain mode compared with related controls

| Control | What it changes | Existing sessions |
|---|---|---|
| Drain mode | The host receives no new sessions from new users | Stay connected |
| Lower maximum session limit | How many sessions the host accepts | Learn says lowering it on a host with active sessions does not affect them |
| Exclusion tag | Autoscale does not start, stop or change drain mode on the host | Unaffected |
| Force sign-out in ramp-down | Autoscale ends remaining sessions after the wait time | Ended |

Only the last row ends sessions. Drain mode therefore needs a second step, either waiting or ending sessions, before a host is free for work. The table is a summary of the Learn statements above.

## Reading the result

- **Timing.** After you change drain mode in the portal, wait at least 60 seconds before refreshing. Learn warns that an immediate refresh can show an out-of-sync status.
- **Sessions.** Check the session count on the host before you start work. Existing sessions are not ended by drain mode. The Insights glossary says its Sessions item shows connected and disconnected sessions, while Idle sessions shows only disconnected ones.
- **Direct access.** Because administrators can reach the VM without the service, your own testing on a drained host does not prove what users will see.

## Common misunderstandings

- **"I turned drain mode on and users were disconnected."** The documentation does not describe that. Check for autoscale, a policy or a patch process that ends sessions.
- **"The host is drained but still has users."** Expected: sessions persist, and returning users go back to their host.
- **"Drain mode is off again."** On pooled pools, check the scaling plan and the exclusion tag first.
- **"New users cannot connect at all."** If every host in a pool is in drain mode, no host can take a new user. The sources retrieved do not name the error message for that case.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Drain mode in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Host pool load-balancing methods](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-load-balancing)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Get-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/get-azwvdsessionhost)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
