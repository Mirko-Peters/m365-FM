---
title: "Pooled or personal host pools: a decision guide"
summary: "Choose a pooled host pool when several users can share a session host and keep their profile in FSLogix. Choose a personal host pool when each user needs a dedicated desktop that keeps its state on the VM's OS disk."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-pooled-host-pool, avd-personal-host-pool]
keypoints:
  - "A pooled host pool lets user sessions be load balanced to any session host, with several users on one host. A personal host pool assigns each session host to one user."
  - "Pooled pools use breadth-first or depth-first load balancing. Learn says load balancing does not apply to personal host pools: there is no algorithm to choose, and each user maps 1:1 to a session host."
  - "Personal pools use automatic or direct assignment. Automatic is the default for new personal pools; with direct assignment a user assigned only to the host pool, not to a session host, gets 'No resources available'."
  - "Profile data goes to FSLogix on pooled pools. On personal pools it can stay on the VM's OS disk. Pooled hosts are updated by redeploying from updated images, personal hosts with Windows Updates or Configuration Manager. RemoteApp is available with pooled host pools only."
  - "Autoscale differs by type: pooled plans can force sign-out in ramp-down, personal schedules offer no forced sign-out setting, only disconnect and sign-out timers, and autoscale does not put a personal host in drain mode before deallocating it."
faq:
  - q: "Can I change a host pool from pooled to personal later?"
    a: "No. The Azure Virtual Desktop FAQ says that once you create a host pool, you cannot change its type. You can, however, move any VMs you register to a host pool to a different type of host pool. Our reading: the route is a new host pool of the other type, with the VMs moved over. Learn's host pool management approaches page says you cannot retrieve a registration token to add session hosts created outside Azure Virtual Desktop to a host pool that uses a session host configuration, so check the target pool's management approach first."
  - q: "Does load balancing apply to personal host pools?"
    a: "No. Microsoft Learn says load balancing does not apply to personal host pools because users always have a 1:1 mapping to a session host. Personal pools use an assignment type instead, either automatic or direct. With automatic assignment a user without a host gets one at the first connection, as described below."
  - q: "Can one user get more than one personal desktop?"
    a: "Yes, but only in a personal host pool with direct assignment. Microsoft Learn says pooled pools and personal pools with automatic assignment do not support it, and that once multiple desktop assignment is enabled on a host pool it cannot be disabled."
---

A pooled host pool fits users who can share session hosts and whose profile lives outside the VM. A personal host pool fits users who need one dedicated desktop that keeps its own state. The rest of this guide sets out the criteria, the load-balancing and assignment rules, and what changes for autoscale.

This comparison is based on Microsoft Learn. Prices and user-count thresholds are outside this guide.

## The two host pool types

Microsoft Learn defines both types in its [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology):

- **Pooled**: user sessions can be load balanced to any session host in the host pool, and several users can be on one session host at the same time. Learn describes this as a shared remote experience with lower costs and greater efficiency.
- **Personal**: each session host is assigned to an individual user. Learn describes this as dedicated desktops that optimize environments for performance and data separation.

Both are made of [session hosts](/entity/avd-session-host/) inside a [host pool](/entity/avd-host-pool/). See also the entity pages for [pooled host pools](/entity/avd-pooled-host-pool/) and [personal host pools](/entity/avd-personal-host-pool/).

## Decision criteria

| Criterion | Pooled | Personal |
|---|---|---|
| Users per session host | Several at the same time | One assigned user |
| Maximum session limit | Set on the host pool; can be exceeded under high concurrent connection load | One |
| Mapping | Sessions are load balanced | 1:1 mapping of user to session host |
| Profile data | Should be stored in FSLogix, because users can land on different hosts | Can be stored on the VM's OS disk, because each user uses one host |
| Distribution rule | Breadth-first or depth-first | Automatic or direct assignment |
| Windows updates | Updated by redeploying session hosts from updated images instead of traditional updates | Updated with Windows Updates, Microsoft Configuration Manager or other software distribution tools |
| Application groups | Desktop and RemoteApp | Desktop only (RemoteApp is available with pooled host pools only) |
| Management approach | Standard or session host configuration | Standard (session host configuration is for pooled host pools only) |
| Stated emphasis (Learn) | Lower costs and greater efficiency | Performance and data separation |

Learn also says personal desktops suit users with resource-intensive workloads, because performance improves when only one session runs on the session host. If users cannot share a host and each needs a dedicated desktop, personal is the starting point. If users can share hosts and their profile can follow them, pooled is the starting point. The starting-point rule is an inference from the Learn definitions, not a Microsoft rule, so test with a pilot group.

### Updates, apps and management approach

Three rows in the table decide how much operating effort each type needs. Pooled hosts are updated by redeploying from updated images. Our reading, not a Learn statement: this fits the session host configuration approach (session host update). With standard management you build and replace images with your own tools. Learn's host pool management page says the management approach is set at creation and cannot be changed, and that a session host configuration can be used with pooled host pools only. Anyone who must publish individual applications needs a pooled host pool, because RemoteApp application groups are available only there. The AVD FAQ adds that in-place upgrade of the session host operating system is supported for personal but not for pooled host pools, and that Azure Backup at the compute level is recommended only for personal host pools.

### Profiles are the practical dividing line

On a pooled pool, a user who signs out and signs back in might be load balanced to a different session host. Learn therefore says pooled users should store profile data in [FSLogix](/entity/fslogix/). On a personal pool each user only ever uses one session host, so the profile data can sit on the OS disk of that VM. If you plan to use FSLogix with a personal pool anyway, read the hibernation note under autoscale below.

## Pooled host pools: load balancing

Learn's [load-balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) lists two algorithms. You can configure one per pooled host pool at a time and change it at any time.

**[Breadth-first](/entity/avd-breadth-first-load-balancing/)** aims to distribute new sessions evenly: it picks a host at random from the half of the available hosts with the fewest sessions. A [maximum session limit](/entity/avd-maximum-session-limit/) is not required; the default is 999999, which is also the highest value you can set. If you use autoscale on a pooled pool, set a custom limit instead; the autoscale prerequisites on Learn say not to use the default value.

**[Depth-first](/entity/avd-depth-first-load-balancing/)** keeps starting new sessions on one host until its maximum session limit is reached, then moves on; on a tie it takes the first host from the query. You must set a maximum session limit with depth-first, and once all hosts reach it you need to raise it or add hosts.

With autoscale, the host pool value does not apply: Learn's autoscale scenarios page says that for pooled host pools autoscale ignores the load-balancing algorithm in the host pool settings and applies load balancing based on the schedule configuration.

For both algorithms, a user with an active or disconnected session is sent back to that session host even if [drain mode](/entity/avd-drain-mode/) is enabled on it, and a user without a session is never sent to a host in drain mode.

Learn's [autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq) says a scaling plan can set a different algorithm per phase: breadth-first for ramp-up and peak, depth-first for ramp-down and off-peak, which consolidates sessions onto fewer hosts.

## Personal host pools: assignment

Learn's article on [personal desktop assignment](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type) says a single user can only be assigned to a single personal desktop, unless multiple assignment is enabled (see below). User activities, files and settings can persist on the VM's OS disk after sign-out.

Two assignment types exist:

- **Automatic** is the default for new personal host pools. The session host does not need to be assigned before the user connects. When an assigned user connects for the first time, the session is load balanced to an available session host. You can still assign a user directly to a session host in an automatic pool.
- **Direct** requires that the user is assigned both to the host pool and to a specific session host. A user assigned only to the host pool cannot reach resources and sees the error "No resources available".

### Set the type and assign users

In the Azure portal the type is a host pool property: **Host pools**, your pool, **Properties**, the **Assignment** drop-down (**Automatic** or **Direct**), then **Save**. For direct assignment, Learn's portal path is: host pool, **Application groups**, the application group, **Assignments**, **+ Add**, select the users or groups, then **Assign VM** in the information bar, select the session host and **Assign** (or **Assignment** > **Assign user**), select the user and **Select**. To unassign or reassign, open **Session hosts**, select the host, then **Assignment** > **Unassign user** or **Assign to a different user**.

Learn says the Azure CLI cannot assign, unassign or reassign users. Friendly names for session hosts can only be set with PowerShell (`Update-AzWvdSessionHost` with the `FriendlyName` parameter). The sibling article "Assigning personal desktops: automatic vs direct assignment" has the details.

### Multiple personal desktops for one user

Learn says you can assign multiple personal desktops to one user only in personal host pools with direct assignment; pooled pools and automatic assignment are not supported. Once enabled, the option cannot be disabled. Save direct assignment first, then in a separate save select **Assign multiple desktops to a single user**. In PowerShell this uses `LoadBalancerType = 'MultiplePersistent'` and needs Az.DesktopVirtualization 5.3.0-preview or later, according to the article, so check the module version before you script it. If a single FSLogix profile container serves the pool, Learn says to enable multiple concurrent connections to avoid errors.

## Autoscale differences

Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) compares both types. A [scaling plan](/entity/avd-scaling-plan/) can only be assigned to host pools of the type specified in the plan. Both types use the phases ramp-up, peak, ramp-down and off-peak.

| Area | Pooled | Personal |
|---|---|---|
| Forced sign-out in ramp-down | Yes, with a wait time | Not offered in the schedule |
| Action on shutdown (power management) | Deallocate the VM | Deallocate, hibernate or do nothing, set per timer |
| Ramp-up settings | Start time, algorithm, minimum percentage of hosts, capacity threshold | Start time, [Start VM on Connect](/entity/avd-start-vm-on-connect/), VMs to start |
| Disconnect and sign-out timers | Not part of the schedule; Learn describes a time limit policy (Intune or Group Policy) for signing out disconnected users | In every phase, 0 to 360 minutes, each with an action (deallocate, hibernate or do nothing) |

Status: power management is generally available for pooled and personal pools; see [power management autoscaling](/entity/avd-power-management-autoscaling/). Dynamic autoscaling applies only to pooled pools with a session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview (Az.DesktopVirtualization) that the scaling plan article requires for it, still carry preview wording; check the current page before relying on a limit.

For personal pools, the FAQ says autoscale does not put the host into drain mode before deallocating it, so a user who connects during deallocation gets a "No resources available" error. For pooled pools, it says autoscale overrides drain mode on all VMs in scope, so use an exclusion tag to keep a VM out of scaling.

### Hibernation and FSLogix

If a personal plan is set to hibernate but the hosts do not have hibernation enabled, the FAQ says autoscale does nothing to them: no hibernate and no deallocate. Learn also says FSLogix and App Attach currently do not support hibernate, so if you chose FSLogix for a personal pool, plan for deallocation. See [hibernation](/entity/avd-hibernation/).

## A short selection procedure

1. List the user groups and note whether each workload needs a dedicated VM.
2. Check where profile data must live. If users can land on different hosts, plan FSLogix.
3. Check the operating model: if users need published RemoteApp applications or you want session host configuration with update and dynamic autoscaling, plan pooled; decide how hosts will be patched (image redeployment or Windows Updates and Configuration Manager).
4. For pooled pools, choose breadth-first or depth-first, and set a maximum session limit (mandatory for depth-first). If a scaling plan will manage the pool, the algorithm in each schedule phase applies instead of the host pool value.
5. For personal pools, choose automatic or direct assignment. Direct assignment fits when you want to control which user gets which VM, and it is required if one user needs several desktops; automatic suits the rest.
6. Decide how autoscale should end sessions: forced sign-out in pooled ramp-down, or disconnect and sign-out timers on personal pools.
7. Pilot with a small group and compare the user experience and the VM running hours.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Configure personal desktop assignment in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
