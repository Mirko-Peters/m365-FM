---
title: "Pooled or personal host pools: a decision guide"
summary: "Choose a pooled host pool when several users can share a session host and keep their profile in FSLogix. Choose a personal host pool when each user needs a dedicated desktop that keeps its state on the VM's OS disk."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [avd-pooled-host-pool, avd-personal-host-pool]
keypoints:
  - "A pooled host pool lets user sessions be load balanced to any session host, with several users on one host. A personal host pool assigns each session host to one user."
  - "Pooled pools use breadth-first or depth-first load balancing. Personal pools have no load-balancing algorithm, because users always map 1:1 to a session host."
  - "Personal pools use automatic or direct assignment. Automatic is the default for new personal pools; with direct assignment a user without a session host gets 'No resources available'."
  - "Profile data goes to FSLogix on pooled pools. On personal pools it can stay on the VM's OS disk."
  - "Autoscale differs by type: pooled plans can force sign-out in ramp-down, personal schedules offer no forced sign-out setting, only disconnect and sign-out timers, and autoscale does not put a personal host in drain mode before deallocating it."
faq:
  - q: "Can I change a host pool from pooled to personal later?"
    a: "The sources used for this article do not describe converting a host pool between types, so this guide makes no claim about it. Treat the type as a design decision and plan a new host pool if you need the other type."
  - q: "Does load balancing apply to personal host pools?"
    a: "No. Microsoft Learn says load balancing does not apply to personal host pools because users always have a 1:1 mapping to a session host. Personal pools use an assignment type instead, either automatic or direct."
  - q: "Can one user get more than one personal desktop?"
    a: "Yes, but only in a personal host pool with direct assignment. Microsoft Learn says pooled pools and personal pools with automatic assignment do not support it, and that once multiple desktop assignment is enabled on a host pool it cannot be disabled."
---

A pooled host pool fits users who can share session hosts and whose profile lives outside the VM. A personal host pool fits users who need one dedicated desktop that keeps its own state. The rest of this guide sets out the criteria, the load-balancing and assignment rules, and what changes for autoscale.

This comparison is based on Microsoft Learn. It gives no prices, no user-count thresholds and no conversion path between types, because the sources used here do not contain them.

## The two host pool types

Microsoft Learn defines both types in its [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology):

- **Pooled**: user sessions can be load balanced to any session host in the host pool, and several users can be on one session host at the same time. Learn describes this as a shared remote experience with lower costs and greater efficiency.
- **Personal**: each session host is assigned to an individual user. Learn describes this as dedicated desktops that optimize environments for performance and data separation.

Both are made of [session hosts](/entity/avd-session-host/) inside a [host pool](/entity/avd-host-pool/). See also the entity pages for [pooled host pools](/entity/avd-pooled-host-pool/) and [personal host pools](/entity/avd-personal-host-pool/).

## Decision criteria

| Criterion | Pooled | Personal |
|---|---|---|
| Users per session host | Several at the same time | One assigned user |
| Mapping | Sessions are load balanced | 1:1 mapping of user to session host |
| Profile data | Should be stored in FSLogix, because users can land on different hosts | Can be stored on the VM's OS disk, because each user uses one host |
| Distribution rule | Breadth-first or depth-first | Automatic or direct assignment |
| Stated emphasis (Learn) | Lower costs and greater efficiency | Performance and data separation |

If users cannot share a host and each needs a dedicated desktop, personal is the starting point. If users can share hosts and their profile can follow them, pooled is the starting point. These are inferences from the Learn definitions, not Microsoft rules, so test with a pilot group.

### Profiles are the practical dividing line

On a pooled pool, a user who signs out and signs back in might be load balanced to a different session host. Learn therefore says pooled users should store profile data in [FSLogix](/entity/fslogix/). On a personal pool each user only ever uses one session host, so the profile data can sit on the OS disk of that VM. If you plan to use FSLogix with a personal pool anyway, read the hibernation note under autoscale below.

## Pooled host pools: load balancing

Learn's [load-balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) lists two algorithms. You can configure one per pooled host pool at a time and change it at any time.

**[Breadth-first](/entity/avd-breadth-first-load-balancing/)** aims to distribute new sessions evenly across the session hosts. It queries the hosts that allow new connections and then picks one at random from the half of the available hosts with the fewest sessions. Learn gives an example: with nine hosts holding 11 to 19 sessions, a new session can go to any of the first five hosts with the fewest sessions. Because of the randomization, sessions may not be spread evenly. A [maximum session limit](/entity/avd-maximum-session-limit/) is not required; if you pick breadth-first when you create the pool, the default is 999999, which is also the highest value you can set. If you use autoscale on a pooled pool, set a custom limit instead of the default; the autoscale prerequisites on Learn say not to use the default value.

**[Depth-first](/entity/avd-depth-first-load-balancing/)** keeps starting new sessions on one host until its maximum session limit is reached. It selects the host with the most sessions among those that allow new connections and have not reached the limit; on a tie it takes the first host from the query. You must set a maximum session limit with depth-first. Once all hosts have reached the limit, you need to raise it or add hosts.

Rules for both algorithms, from the same page:

- A user with an active or disconnected session in the pool is sent back to that session host, even if [drain mode](/entity/avd-drain-mode/) is enabled on it.
- A user without a session is never sent to a host in drain mode.
- Lowering the maximum session limit on a host with active sessions does not affect those sessions.

Learn's [autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq) notes that a scaling plan can set a different algorithm per phase. It says breadth-first suits ramp-up and peak, and depth-first suits ramp-down and off-peak because it consolidates sessions onto fewer hosts.

## Personal host pools: assignment

Learn's article on [personal desktop assignment](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type) says personal desktops have a one-to-one mapping: a single user can only be assigned to a single personal desktop, unless multiple assignment is enabled (see below). User activities, files and settings can persist on the VM's OS disk after sign-out.

Two assignment types exist:

- **Automatic** is the default for new personal host pools. The session host does not need to be assigned before the user connects. When an assigned user connects for the first time, the session is load balanced to an available session host. You can still assign a user directly to a session host in an automatic pool.
- **Direct** requires that the user is assigned both to the host pool and to a specific session host. A user assigned only to the host pool cannot reach resources and sees the error "No resources available".

### Set the assignment type

1. In the Azure portal, open **Azure Virtual Desktop**, then **Host pools**, then your personal host pool.
2. Select **Properties**.
3. Choose **Automatic** or **Direct** in the **Assignment** dropdown.
4. Select **Save**.

### Assign, unassign and reassign

Learn gives these portal paths:

1. **Assign (direct)**: host pool, **Application groups**, the application group, **Assignments**, **+ Add**, select the users or groups, **Select**. Then select **Assign VM** (or open **Session hosts**), select the session host, select **Assign**, choose the user and select **Select**.
2. **Unassign**: host pool, **Session hosts**, select the host, **Assignment**, **Unassign user**.
3. **Reassign**: host pool, **Session hosts**, select the host, **Assignment**, **Assign to a different user**.

Learn says the Azure CLI cannot assign, unassign or reassign users. Friendly names for session hosts can only be set with PowerShell (`Update-AzWvdSessionHost` with the `FriendlyName` parameter).

### Multiple personal desktops for one user

Learn says you can assign multiple personal desktops to one user only in personal host pools with direct assignment. Pooled pools and automatic assignment are not supported. Once the option is enabled on a host pool, it cannot be disabled. Save direct assignment first, then in a separate save select **Assign multiple desktops to a single user**; doing both at once produces an error. Assigning multiple desktops with PowerShell needs Az.DesktopVirtualization 5.3.0-preview or later, according to the article, so check the module version before you script it. If a single FSLogix profile container serves the pool, Learn says to enable multiple concurrent connections to avoid errors.

## Autoscale differences

Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) compares both types. A [scaling plan](/entity/avd-scaling-plan/) can only be assigned to host pools of the type specified in the plan. Both types use the phases ramp-up, peak, ramp-down and off-peak. Phase details are in the sibling article "Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained".

| Area | Pooled | Personal |
|---|---|---|
| Forced sign-out in ramp-down | Yes, with a wait time | Not offered in the schedule |
| Action on shutdown (power management) | Deallocate the VM | Deallocate, hibernate or do nothing, set per timer |
| Ramp-up settings | Start time, algorithm, minimum percentage of hosts, capacity threshold | Start time, [Start VM on Connect](/entity/avd-start-vm-on-connect/), VMs to start |
| Disconnect and sign-out timers | Not part of the schedule; Learn describes a time limit policy (Intune or Group Policy) for signing out disconnected users | In every phase, 0 to 360 minutes, each with an action (deallocate, hibernate or do nothing) |

Status: power management is generally available for pooled and personal pools; see [power management autoscaling](/entity/avd-power-management-autoscaling/). Dynamic autoscaling applies only to pooled pools with a session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview (Az.DesktopVirtualization) that the scaling plan article requires for it, still carry preview wording; check the current page before relying on a limit. The sibling article "Power management autoscaling vs dynamic autoscaling: which one fits your host pools" covers the choice between the two.

For personal pools, the FAQ adds three points. Autoscale deallocates a personal desktop when the user session is signed out or disconnected. It does not put the host into drain mode first, so a user who connects during deallocation gets a "No resources available" error. A session host that was turned on but never signed into is deallocated after a period of inactivity, which the page does not define. For pooled pools, the FAQ says autoscale overrides drain mode on all VMs in scope, so use an exclusion tag to keep a VM out of scaling.

### Hibernation and FSLogix

Learn says that personal desktop autoscale with hibernation requires hibernation to be enabled on the session hosts. If a plan is set to hibernate but the hosts do not have hibernation enabled, the FAQ says autoscale does nothing to them: no hibernate and no deallocate. Learn also says FSLogix and App Attach currently do not support hibernate and that you should not enable hibernate if you use them for personal host pools. If you chose FSLogix for a personal pool, plan for deallocation, not hibernation. See [hibernation](/entity/avd-hibernation/).

## A short selection procedure

1. List the user groups and note for each whether the workload needs a dedicated VM.
2. Check where profile data must live. If users can land on different hosts, as on a pooled pool, plan FSLogix.
3. For pooled pools, choose breadth-first or depth-first, and set a maximum session limit (mandatory for depth-first).
4. For personal pools, choose automatic or direct assignment. Direct assignment fits when you want to control which user gets which VM, and it is required if one user needs several desktops; automatic suits the rest.
5. Decide how autoscale should end sessions: forced sign-out in pooled ramp-down, or disconnect and sign-out timers on personal pools.
6. Pilot with a small group and compare the user experience and the VM running hours.

## Sources

Retrieved 2026-11-16.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Configure personal desktop assignment in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
